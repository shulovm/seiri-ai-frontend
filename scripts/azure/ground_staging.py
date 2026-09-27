"""Shared fail-closed gates. No Azure authentication or mutation on import."""
import copy
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import urllib.parse

HERE = Path(__file__).resolve().parent
POLICY = json.loads((HERE / "ground-staging-policy.json").read_text())
ROOT = f"/subscriptions/{POLICY['subscription']}/resourceGroups/{POLICY['resource_group']}"
APP = ROOT + "/providers/Microsoft.App/containerApps/" + POLICY["app"]
ARM = "https://management.azure.com"


def require(condition, gate):
    if not condition:
        raise RuntimeError(gate)


def now():
    return dt.datetime.now(dt.timezone.utc).isoformat()


def verify_image_binding(artifact):
    digest = artifact.get("digest", "")
    require(isinstance(digest, str) and re.fullmatch(r"sha256:[a-f0-9]{64}", digest), "artifact digest format")
    require(artifact.get("image") == POLICY["registry_server"] + "/" + POLICY["image_repository"] + "@" + digest,
            "artifact image/digest binding")


def classify_core_result(text, exit_code, source_sha):
    """Only the explicitly authorized exact-source baseline is admissible.

    Keep raw exit=1 and PRE_EXISTING_KNOWN_FAILURE in evidence. This is not
    a claim that all core tests pass. Any reporter/signature/count drift stops.
    """
    if exit_code == 0:
        return {"classification": "PASS", "raw_exit_code": 0}
    require(exit_code == 1 and source_sha == POLICY["initial_source"], "unadmitted core result")
    expected = {"tests": 4110, "pass": 4108, "fail": 2, "cancelled": 0, "skipped": 0, "todo": 0}
    for key, value in expected.items():
        matches = re.findall(r"^ℹ " + key + r" (\d+)$", text, re.M)
        require(matches == [str(value)], "core baseline count: " + key)
    require(text.count("✖ failing tests:") == 1, "core failure report shape")
    blocks = re.split(r"\ntest at ", text.split("✖ failing tests:")[1])[1:]
    require(len(blocks) == 2, "core failure block count")
    signatures = {}
    for block in blocks:
        require(block.startswith("ground-core/__tests__/contract-evolution.test.ts:"), "unexpected failing test file")
        names = re.findall(r"^✖ (.+) \([\d.]+ms\)$", block, re.M)
        require(len(names) == 1 and names[0] not in signatures, "core failure name")
        start = block.find("  AssertionError")
        end = block.find("\n      at ", start)
        require(start >= 0 and end > start, "core failure signature shape")
        signature = block[start:end].rstrip()
        signatures[names[0]] = hashlib.sha256(signature.encode()).hexdigest()
    require(signatures == POLICY["known_baseline_core_signatures"], "NEW_FAILURE: core assertion signature changed")
    return {"classification": "PRE_EXISTING_KNOWN_FAILURE", "raw_exit_code": exit_code,
            "admission": "EXACT_BASELINE_ONLY", "signatures": signatures}


def save(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, sort_keys=True) + "\n")


def run(args, *, cwd=None, timeout=120, check=True, input=None):
    p = subprocess.run(args, cwd=cwd, input=input, text=True, capture_output=True, timeout=timeout)
    if check and p.returncode:
        # Never include credentials, command bodies or token-bearing stdout.
        raise RuntimeError(f"command failed: {args[0]} {args[1] if len(args)>1 else ''}; exit={p.returncode}")
    return p


def az(args, **kwargs):
    return run(["az", *args, "--only-show-errors", "-o", "json"], **kwargs)


def get(path):
    p = az(["rest", "--method", "get", "--url", ARM + path])
    return json.loads(p.stdout)


def app_get():
    return get(APP + "?api-version=" + POLICY["app_api_version"])


def pages(path):
    result = []
    while path:
        require(path.startswith(ROOT + "/") or path.startswith("/subscriptions/" + POLICY["subscription"] + "/"), "pagination scope")
        body = get(path)
        require(isinstance(body.get("value"), list), "incomplete ARM list")
        result.extend(body["value"])
        nxt = body.get("nextLink")
        if nxt:
            require(nxt.startswith(ARM + "/"), "pagination host")
            path = nxt[len(ARM):]
        else:
            path = None
    return result


def revisions():
    return pages(APP + "/revisions?api-version=" + POLICY["app_api_version"])


def replicas(revision):
    require(re.fullmatch(r"ground-worker-staging--[a-z0-9-]+", revision), "revision name")
    return pages(APP + "/revisions/" + revision + "/replicas?api-version=" + POLICY["app_api_version"])


def contract(app):
    """Preserve all configuration, template and identity fields except rollout identity.

    Server-added fields are retained in the comparison, never copied into PATCH.
    Unknown changes stop; false negatives are safer than silently ignoring drift.
    """
    p = app["properties"]
    t = copy.deepcopy(p["template"])
    t.pop("revisionSuffix", None)
    for c in t["containers"]:
        c.pop("image", None)
    return {"identity": app.get("identity"), "configuration": p["configuration"],
            "template": t, "environmentId": p.get("environmentId"),
            "managedEnvironmentId": p.get("managedEnvironmentId"),
            "workloadProfileName": p.get("workloadProfileName"), "location": app["location"]}


def static_gates(app):
    p = app["properties"]
    require(app["id"].lower() == APP.lower(), "exact staging app")
    require(p["configuration"]["activeRevisionsMode"] == "Single", "Single mode")
    require(p["template"]["scale"]["minReplicas"] == 1 and p["template"]["scale"]["maxReplicas"] == 1, "scale 1/1")
    require(not p["template"]["scale"].get("rules"), "no added scale rules")
    require(len(p["template"]["containers"]) == 1, "one worker container")
    c = p["template"]["containers"][0]
    env = {x["name"]: x.get("value") for x in c.get("env", [])}
    require(len(env) == len(c.get("env", [])), "unique env names")
    require(env.get("GROUND_WORKER_INPUT_SOURCE") == "azure-blob", "azure-blob input")
    uami = ROOT + "/providers/Microsoft.ManagedIdentity/userAssignedIdentities/id-ground-worker-staging"
    require(env.get("GROUND_WORKER_IDENTITY_RESOURCE_ID", "").lower() == uami.lower(), "runtime identity selection")
    require(app["identity"]["type"] == "UserAssigned", "no additional identity type")
    require({x.lower() for x in app["identity"]["userAssignedIdentities"]} == {uami.lower()}, "worker UAMI")
    regs = p["configuration"].get("registries", [])
    require(len(regs) == 1 and regs[0]["server"] == POLICY["registry_server"], "registry server")
    require(regs[0].get("identity", "").lower() == uami.lower(), "registry UAMI")
    require(not regs[0].get("passwordSecretRef") and not regs[0].get("username"), "no registry password")
    require(any(x.get("type") == "Readiness" for x in c.get("probes", [])), "readiness probe exists")
    return c


def healthy(app, revs, reps, expected_revision, image):
    static_gates(app)
    p = app["properties"]
    require(p["latestRevisionName"] == expected_revision and p["latestReadyRevisionName"] == expected_revision, "latest/latestReady revision")
    require(p["provisioningState"] == "Succeeded", "app provisioning")
    active = [r for r in revs if r["properties"].get("active")]
    require(len(active) == 1 and active[0]["name"] == expected_revision, "one expected active revision")
    r = active[0]["properties"]
    require(r["healthState"] == "Healthy" and r["provisioningState"] == "Provisioned", "revision health")
    require(r["template"]["containers"][0]["image"] == image, "revision digest")
    require(p["template"]["containers"][0]["image"] == image, "app digest")
    require(len(reps) == 1, "one replica")
    cs = reps[0]["properties"]["containers"]
    require(len(cs) == 1, "one replica container")
    require(cs[0].get("ready") is True and cs[0].get("runningState") == "Running" and cs[0].get("restartCount") == 0, "ready/running/zero restarts")


def worker_roles(principal_id):
    # ARM only; no Microsoft Graph permission or runtime-identity credential.
    query = urllib.parse.urlencode({"api-version": "2022-04-01", "$filter": "principalId eq '" + principal_id + "'"})
    rows = pages("/subscriptions/" + POLICY["subscription"] + "/providers/Microsoft.Authorization/roleAssignments?" + query)
    keys = ("principalId", "roleDefinitionId", "scope", "condition", "conditionVersion", "delegatedManagedIdentityResourceId")
    return sorted([{k: r["properties"].get(k) for k in keys} for r in rows], key=lambda r: json.dumps(r, sort_keys=True))


def integrity(revision, release, after):
    require(release in POLICY["approved_releases"], "approved release")
    require(re.fullmatch(r"ground-worker-staging--[a-z0-9-]+", revision), "log revision")
    stamp = dt.datetime.fromisoformat(after.replace("Z", "+00:00")).isoformat()
    q = ("let events = ContainerAppConsoleLogs_CL | where TimeGenerated > datetime(" + stamp + ") "
         "and ContainerAppName_s == 'ground-worker-staging' and RevisionName_s == '" + revision + "' "
         "| extend p=parse_json(Log_s) | where tostring(p.event) in ('snapshot_integrity_checked','snapshot_integrity_failed'); "
         "let failures=toscalar(events | where tostring(p.event)=='snapshot_integrity_failed' | count); "
         "events | top 10 by TimeGenerated desc | project TimeGenerated,p,failure_count=failures")
    url = "https://api.loganalytics.azure.com/v1/workspaces/" + POLICY["workspace_customer_id"] + "/query?" + urllib.parse.urlencode({"query": q, "timespan": "PT15M"})
    p = az(["rest", "--method", "get", "--url", url, "--resource", "https://api.loganalytics.io"])
    body = json.loads(p.stdout)
    require("error" not in body, "Log Analytics partial/error response")
    tables = body["tables"]
    require(len(tables) == 1, "log response table")
    rows = tables[0]["rows"]
    require(rows, "fresh integrity heartbeat pending")
    seen = []
    for row in rows:
        require(row[2] == 0, "runtime integrity failure in verification window")
        event = json.loads(row[1]) if isinstance(row[1], str) else row[1]
        require(event.get("event") == "snapshot_integrity_checked", "runtime integrity failure")
        expected = {**POLICY["approved_releases"][release], "input_source": "azure-blob", "corpus_release": release,
                    "production_input": False, "production_authority": False, "source_authenticity_certified": False}
        for k, v in expected.items():
            require(type(event.get(k)) is type(v) and event[k] == v, "integrity field: " + k)
        seen.append({"time": row[0], "event": event})
    latest = dt.datetime.fromisoformat(seen[0]["time"].replace("Z", "+00:00"))
    require((dt.datetime.now(dt.timezone.utc) - latest).total_seconds() < 300, "integrity freshness")
    require(len(seen) >= 2, "two successful integrity cycles pending")
    return seen


def deployment_body(app, image, suffix):
    require(re.fullmatch(re.escape(POLICY["registry_server"] + "/ground-worker@sha256:") + r"[a-f0-9]{64}", image), "immutable image")
    require(re.fullmatch(r"ci-[a-f0-9]{7}-[0-9]+-[0-9]+", suffix) and len(suffix) <= 64, "revision suffix")
    static_gates(app)
    src = app["properties"]["template"]
    # Unknown template fields require review before sending any write.
    allowed = {"containers", "initContainers", "revisionSuffix", "scale", "volumes", "terminationGracePeriodSeconds", "serviceBinds"}
    require(set(src) <= allowed, "unreviewed template fields")
    t = {k: copy.deepcopy(v) for k, v in src.items() if k not in {"scale", "revisionSuffix"} and v is not None}
    t["scale"] = {"minReplicas": 1, "maxReplicas": 1, "rules": None}
    t["revisionSuffix"] = suffix
    t["containers"][0]["image"] = image
    # Partial update preserves identity, configuration, ingress and registry auth.
    return {"properties": {"template": t}}


def approved_baseline_bytes():
    digest = POLICY["current_baseline_sha256"]
    require(digest in POLICY["verified_baselines"] and re.fullmatch(r"[a-f0-9]{64}", digest), "reviewed baseline selector")
    raw = (HERE / "baselines" / (digest + ".json")).read_bytes()
    require(hashlib.sha256(raw).hexdigest() == digest, "immutable approved baseline bytes")
    return raw
