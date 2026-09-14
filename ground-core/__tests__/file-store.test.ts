import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { createEmptyProject } from "../state-engine.js";
import { listProjects, loadProject, saveProject } from "../file-store.js";
import { validateProjectState } from "../validate.js";
import { validProjectStateV010 } from "./fixtures.js";

describe("file-store", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "ground-core-store-"));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("saveProject → loadProject returns the same state", () => {
    const state = createEmptyProject({
      title: "Roundtrip Project",
      summary: "Roundtrip summary",
    });

    saveProject(state, { storageDir: tempDir });
    const loaded = loadProject(state.project.id, { storageDir: tempDir });

    assert.deepEqual(loaded, state);
    assert.equal(validateProjectState(loaded).valid, true);
  });

  it("listProjects returns saved project ids", () => {
    const first = createEmptyProject({ title: "First", summary: "First summary" });
    const second = createEmptyProject({ title: "Second", summary: "Second summary" });

    saveProject(first, { storageDir: tempDir });
    saveProject(second, { storageDir: tempDir });

    const ids = listProjects({ storageDir: tempDir });

    assert.deepEqual(ids, [first.project.id, second.project.id].sort());
  });

  it("writes pretty-printed JSON", () => {
    const state = createEmptyProject({
      title: "Pretty Print",
      summary: "Pretty summary",
    });

    saveProject(state, { storageDir: tempDir });

    const raw = readFileSync(join(tempDir, `${state.project.id}.json`), "utf8");
    assert.match(raw, /\{\n  "schema_version": "0.1.25"/);
  });

  it("loads and migrates legacy v0.1.0 project files", () => {
    const legacyPath = join(tempDir, `${validProjectStateV010.project.id}.json`);
    writeFileSync(legacyPath, `${JSON.stringify(validProjectStateV010, null, 2)}\n`, "utf8");

    const loaded = loadProject(validProjectStateV010.project.id, {
      storageDir: tempDir,
    });

    assert.equal(loaded.schema_version, "0.1.25");
    assert.ok(Array.isArray(loaded.reference_docs));
    assert.ok(Array.isArray(loaded.reality_entities));
    assert.equal(loaded.current_state.primary_next_action_id, null);
    assert.equal(loaded.next_actions[0]?.depends_on_action_id, null);
  });
});

describe("gitignore", () => {
  it("excludes runtime projects and generated storage scratch from Git", () => {
    const paths = ["ground-core/storage/projects/ignore-probe.json", "ground-core/storage/ignore-probe.json"];
    const ignored = execFileSync("git", ["check-ignore", "--no-index", "--stdin"], {
      cwd: process.cwd(), input: paths.join("\n") + "\n", encoding: "utf8",
    });
    assert.deepEqual(ignored.trim().split("\n"), paths);
  });
});
