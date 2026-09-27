"""One PATCH maximum. Ambiguous client outcomes are resolved through live reads."""
import argparse
import datetime as dt
import json
import os
from pathlib import Path
import subprocess
import time
from ground_staging import *

p = argparse.ArgumentParser()
p.add_argument("--baseline", required=True)
p.add_argument("--image", required=True)
p.add_argument("--evidence", required=True)
a = p.parse_args()
ev = Path(a.evidence).resolve()
ev.mkdir(parents=True, exist_ok=True)
baseline = json.loads(Path(a.baseline).read_text())
image = json.loads(Path(a.image).read_text())
report = {"status": "STOPPED", "started": now(), "phase": "GROUND-AZURE-004", "mutation_attempts": 0,
          "activity_alert": POLICY["activity_alert"], "workflow_run": os.environ["GITHUB_RUN_ID"],
          "workflow_attempt": os.environ["GITHUB_RUN_ATTEMPT"], "source_commit": image["source_commit"], "image": image["image"]}
try:
    require(image["run_id"] == report["workflow_run"] and image["attempt"] == report["workflow_attempt"], "same-run image artifact")
    require(image["source_commit"] == POLICY["initial_source"], "admitted source")
    require(image["corpus_release"] in POLICY["approved_releases"], "admitted release")
    account = json.loads(az(["account", "show"]).stdout)
    require(account["id"] == POLICY["subscription"], "subscription")
    before = app_get()
    static_gates(before)
    require(contract(before) == baseline["contract"], "pre-deploy config drift")
    revs = revisions()
    previous = before["properties"]["latestReadyRevisionName"]
    previous_image = before["properties"]["template"]["containers"][0]["image"]
    # Future rollouts must use a reviewed last-verified checkpoint, not learn live drift.
    require(previous == baseline["revision"] and previous_image == baseline["image"], "pre-deploy verified revision/digest")
    healthy(before, revs, replicas(previous), previous, previous_image)
    roles = worker_roles(baseline["worker_principal_id"])
    require(roles == baseline["worker_roles"], "worker RBAC drift")
    prior_names = {r["name"] for r in revs}
    require(set(baseline["retained_revisions"]) <= prior_names, "baseline revisions retained")
    integrity(previous, image["corpus_release"], (dt.datetime.now(dt.timezone.utc) - dt.timedelta(minutes=10)).isoformat())
    remote = json.loads(az(["acr", "repository", "show", "--name", POLICY["registry"], "--image", "ground-worker@" + image["digest"]]).stdout)
    require(remote.get("digest") == image["digest"] and remote.get("name") == "ground-worker", "deploy digest exists in ACR")
    suffix = "ci-" + image["source_commit"][:7] + "-" + report["workflow_run"] + "-" + report["workflow_attempt"]
    expected = POLICY["app"] + "--" + suffix
    require(expected not in prior_names, "revision suffix already exists; reconcile previous attempt")
    body = deployment_body(before, image["image"], suffix)
    save(ev / "before.json", before)
    save(ev / "before-revisions.json", revs)
    save(ev / "before-worker-roles.json", roles)
    save(ev / "patch.json", body)
    # Recheck immediately before the single mutation; no silent concurrent changes.
    require(app_get() == before, "concurrent app change before PATCH")
    report.update(previous_revision=previous, previous_image=previous_image, expected_revision=expected, deployment_start=now(), mutation_attempts=1)
    save(ev / "checkpoint.json", report)
    try:
        response = az(["rest", "--method", "patch", "--url", ARM + APP + "?api-version=" + POLICY["app_api_version"], "--body", "@" + str(ev / "patch.json")], check=False, timeout=180)
        report["mutation_client_exit"] = response.returncode
        report["mutation_response_nonempty"] = bool(response.stdout.strip())
        (ev / "patch.stderr").write_text(response.stderr)
        (ev / "patch.stdout").write_text(response.stdout)
    except subprocess.TimeoutExpired:
        report["mutation_client_exit"] = "TIMEOUT_AMBIGUOUS"
    # Do not parse PATCH stdout or retry. Read ARM to establish the actual outcome.
    deadline = time.monotonic() + 900
    while time.monotonic() < deadline:
        live = app_get()
        save(ev / "latest-app.json", live)
        require(contract(live) == baseline["contract"], "post-deploy config drift")
        rs = revisions()
        require(prior_names <= {r["name"] for r in rs}, "old revision removed")
        candidate = [r for r in rs if r["name"] == expected]
        if candidate and candidate[0]["properties"].get("provisioningState") in {"Failed", "Deprovisioned"}:
            raise RuntimeError("candidate provisioning failed")
        if live["properties"].get("latestReadyRevisionName") == expected:
            rp = replicas(expected)
            healthy(live, rs, rp, expected, image["image"])
            save(ev / "ready-replicas.json", rp)
            break
        time.sleep(15)
    else:
        raise RuntimeError("revision readiness deadline; no automatic second deployment")
    deadline = time.monotonic() + 600
    while True:
        try:
            signal = integrity(expected, image["corpus_release"], report["deployment_start"])
            break
        except RuntimeError as e:
            # Only absence/insufficient ingestion is retryable; wrong values/failures stop.
            if str(e) not in {"fresh integrity heartbeat pending", "two successful integrity cycles pending"} or time.monotonic() >= deadline:
                raise
            time.sleep(20)
    save(ev / "integrity.json", signal)
    final = app_get()
    final_revs = revisions()
    final_reps = replicas(expected)
    healthy(final, final_revs, final_reps, expected, image["image"])
    require(contract(final) == baseline["contract"], "final configuration")
    require(worker_roles(baseline["worker_principal_id"]) == roles, "final worker RBAC")
    require(prior_names <= {r["name"] for r in final_revs}, "final revision retention")
    save(ev / "next-baseline.json", {**baseline, "revision": expected, "image": image["image"], "retained_revisions": sorted(r["name"] for r in final_revs)})
    report.update(status="DEPLOYED_VERIFIED", health_gate="VERIFIED", integrity_gate="VERIFIED", worker_identity_unchanged=True,
                  worker_rbac_unchanged=True, deployment_end=now(), activity_log_correlation="Run/source/digest/revision/time recorded; alert remains enabled")
except Exception as e:
    report["failed_gate"] = str(e)
    report["rollback_behavior"] = "STOP; old revision and evidence retained. No repeated rollout. A switched-but-unverified revision requires guarded operator recovery."
    raise
finally:
    report["ended"] = now()
    save(ev / "checkpoint.json", report)
