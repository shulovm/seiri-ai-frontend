"""Build locally before login; publish via short-lived OIDC identity, never ACR admin."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import tempfile
from ground_staging import POLICY, require, run, az, save, now

p = argparse.ArgumentParser()
p.add_argument("action", choices=["build", "push"])
p.add_argument("--source", required=True)
p.add_argument("--sha", required=True)
p.add_argument("--release", required=True)
p.add_argument("--evidence", required=True)
a = p.parse_args()
src = Path(a.source).resolve()
ev = Path(a.evidence).resolve()
ev.mkdir(parents=True, exist_ok=True)
require(re.fullmatch(r"[a-f0-9]{40}", a.sha), "source SHA")
require(a.sha == POLICY["initial_source"], "admitted source")
require(a.release in POLICY["approved_releases"], "admitted release")
run_id = os.environ["GITHUB_RUN_ID"]
attempt = os.environ["GITHUB_RUN_ATTEMPT"]
require(run_id.isdigit() and attempt.isdigit(), "run identity")
tag = "staging-" + a.sha[:7] + "-" + run_id + "-" + attempt
ref = POLICY["registry_server"] + "/ground-worker:" + tag
if a.action == "build":
    require(run(["git", "rev-parse", "HEAD"], cwd=src).stdout.strip() == a.sha, "source checkout")
    require(not run(["git", "status", "--porcelain", "--untracked-files=no"], cwd=src).stdout, "source clean")
    require(hashlib.sha256((src / "containers/ground-worker/corpus-pins.json").read_bytes()).hexdigest() == a.release, "release binding")
    paths = run(["git", "ls-tree", "-r", "--name-only", a.sha], cwd=src).stdout.splitlines()
    approved = []
    for path in paths:
        take = path in {"Dockerfile.worker", "Dockerfile.worker.dockerignore", "package.json", "package-lock.json"} or path.startswith(("ground-core/", "containers/ground-worker/", "docs/schemas/"))
        if not take:
            continue
        require(not any(part.startswith(".env") or part in {".git", "node_modules"} for part in Path(path).parts), "build context forbidden file")
        require(not (src / path).is_symlink(), "build context symlink")
        if path.startswith(("ground-core/storage/", "ground-core/__tests__/", "ground-core/examples/")) or path.endswith(".test.ts"):
            continue
        approved.append(path)
    with tempfile.TemporaryDirectory(prefix="ground-build-") as td:
        context = Path(td)
        for path in approved:
            out = context / path
            out.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(src / path, out)
        save(ev / "build-context.json", {p: hashlib.sha256((context / p).read_bytes()).hexdigest() for p in approved})
        result = run(["docker", "build", "--platform", "linux/amd64", "--label", "org.opencontainers.image.revision=" + a.sha,
                      "--label", "org.opencontainers.image.source=https://github.com/" + POLICY["repository"], "-f", "Dockerfile.worker", "-t", ref, "."], cwd=context, timeout=1800, check=False)
        (ev / "build.log").write_text(result.stdout + result.stderr)
        require(result.returncode == 0, "container build")
    save(ev / "build.json", {"source_commit": a.sha, "corpus_release": a.release, "tag": ref, "run_id": run_id, "attempt": attempt,
                             "built_at": now(), "pipeline_validation_build": a.sha == POLICY["initial_source"]})
else:
    built = json.loads((ev / "build.json").read_text())
    require(built["tag"] == ref and built["source_commit"] == a.sha and built["corpus_release"] == a.release, "build result binding")
    # az acr login uses the existing OIDC account; emits no registry credentials.
    az(["acr", "login", "--name", POLICY["registry"]])
    try:
        result = run(["docker", "push", ref], timeout=900, check=False)
        (ev / "push.log").write_text(result.stdout + result.stderr)
        require(result.returncode == 0, "ACR push")
        remote = json.loads(az(["acr", "repository", "show", "--name", POLICY["registry"], "--image", "ground-worker:" + tag]).stdout)
        digest = remote["digest"]
        require(re.fullmatch(r"sha256:[a-f0-9]{64}", digest), "ACR digest")
        require(remote.get("name") == "ground-worker", "ACR repository")
        local = json.loads(run(["docker", "image", "inspect", ref]).stdout)[0]
        full = POLICY["registry_server"] + "/ground-worker@" + digest
        require(full in local["RepoDigests"], "pushed/remote digest agreement")
        save(ev / "image.json", {**built, "digest": digest, "image": full, "published_at": now()})
    finally:
        run(["docker", "logout", POLICY["registry_server"]], check=False)
