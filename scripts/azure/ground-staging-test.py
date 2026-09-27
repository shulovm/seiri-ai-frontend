"""Run source gates without Azure credentials. Known failures are reported, never waived."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
from ground_staging import POLICY, require, run, save, now

p = argparse.ArgumentParser()
p.add_argument("--source", required=True)
p.add_argument("--sha", required=True)
p.add_argument("--release", required=True)
p.add_argument("--evidence", required=True)
a = p.parse_args()
src = Path(a.source).resolve()
ev = Path(a.evidence).resolve()
ev.mkdir(parents=True, exist_ok=True)
report = {"started": now(), "source_commit": a.sha, "gates": [], "status": "STOPPED"}
try:
    require(re.fullmatch(r"[a-f0-9]{40}", a.sha), "explicit 40-character SHA")
    require(run(["git", "rev-parse", "HEAD"], cwd=src).stdout.strip() == a.sha, "checkout exactly SHA")
    require(not run(["git", "status", "--porcelain", "--untracked-files=no"], cwd=src).stdout, "source tracked bytes clean")
    require(a.release in POLICY["approved_releases"], "release admitted by control policy")
    require(hashlib.sha256((src / "containers/ground-worker/corpus-pins.json").read_bytes()).hexdigest() == a.release, "source/release binding")
    # The initial pipeline cannot admit arbitrary source merely because tests pass.
    # Later source admission is a reviewed policy change; workflow dispatch stays exact-SHA.
    require(a.sha == POLICY["initial_source"], "source not yet admitted for this pipeline validation")
    commands = [
        ("dependencies", ["npm", "ci", "--ignore-scripts", "--no-audit", "--no-fund"]),
        ("core-typecheck", ["node", "node_modules/typescript/bin/tsc", "--noEmit", "-p", "ground-core/tsconfig.json"]),
        ("worker-build", ["node", "node_modules/typescript/bin/tsc", "-p", "containers/ground-worker/tsconfig.build.json"]),
        ("worker-and-blob", ["node", "--import", "tsx", "--test", "containers/ground-worker/worker.test.ts", "containers/ground-worker/blob-input.test.ts"]),
        ("core", ["npm", "run", "test:ground-core"]),
    ]
    for name, cmd in commands:
        if name == "worker-and-blob":
            shutil.copyfile(src / "containers/ground-worker/corpus-pins.json", src / "dist-worker/containers/ground-worker/corpus-pins.json")
            shutil.copytree(src / "docs/schemas", src / "dist-worker/docs/schemas", dirs_exist_ok=True)
        with (ev / (name + ".log")).open("w") as f:
            result = subprocess.run(cmd, cwd=src, stdout=f, stderr=subprocess.STDOUT, timeout=1200)
        entry = {"name": name, "exit_code": result.returncode}
        report["gates"].append(entry)
        if result.returncode:
            if name == "core":
                text = (ev / "core.log").read_text()
                entry["known_failure_names_present"] = [x for x in POLICY["known_baseline_core_failures"] if x in text]
                entry["known_failure_policy"] = POLICY["known_baseline_failure_policy"]
            raise RuntimeError("test gate: " + name)
    report["status"] = "TESTS_PASSED"
except Exception as e:
    report["failed_gate"] = str(e)
    raise
finally:
    report["ended"] = now()
    save(ev / "test-checkpoint.json", report)
