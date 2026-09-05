import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { spawnSync } from "node:child_process";
import {
  cmdInit,
  cmdList,
  cmdPatch,
  cmdShow,
  runCli,
} from "../cli.js";
import { loadProject } from "../file-store.js";

describe("cli commands", () => {
  let tempDir: string;
  let stdout: string[];
  let stderr: string[];

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "ground-core-cli-"));
    stdout = [];
    stderr = [];
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  function runtimeOptions() {
    return {
      storageDir: tempDir,
      writeOut: (message: string) => stdout.push(message),
      writeErr: (message: string) => stderr.push(message),
    };
  }

  it("init creates a project", () => {
    const projectId = cmdInit(["--title", "CLI Project"], runtimeOptions());

    assert.match(projectId, /^[0-9a-f-]{36}$/);
    const state = loadProject(projectId, { storageDir: tempDir });
    assert.equal(state.project.title, "CLI Project");
  });

  it("list shows created project metadata", () => {
    const projectId = cmdInit(["--title", "Listed Project"], runtimeOptions());
    const lines = cmdList([], runtimeOptions());

    assert.equal(lines.length, 1);
    assert.match(lines[0] ?? "", new RegExp(`${projectId}\\tactive\\t`));
    assert.match(lines[0] ?? "", /Listed Project$/);
  });

  it("show outputs pretty JSON", () => {
    const projectId = cmdInit(["--title", "Show Project"], runtimeOptions());
    const output = cmdShow(projectId, runtimeOptions());

    assert.match(output, /^\{\n  "schema_version": "0.1.24"/);
    assert.match(output, /"title": "Show Project"/);
  });

  it("patch --file updates state", () => {
    const projectId = cmdInit(["--title", "Patch Project"], runtimeOptions());
    const state = loadProject(projectId, { storageDir: tempDir });
    const patchPath = join(tempDir, "patch.json");

    writeFileSync(
      patchPath,
      JSON.stringify(
        {
          schema_version: "0.1.0",
          project_id: projectId,
          source: "manual",
          operations: [
            {
              op: "upsert",
              entity: "current_state",
              entity_id: state.current_state.id,
              payload: {
                summary: "Updated from CLI patch",
              },
            },
          ],
        },
        null,
        2
      )
    );

    const result = cmdPatch([projectId, "--file", patchPath], runtimeOptions());
    const updated = loadProject(projectId, { storageDir: tempDir });

    assert.equal(result.project_id, projectId);
    assert.equal(updated.current_state.summary, "Updated from CLI patch");
    assert.equal(result.updated_at, updated.updated_at);
  });

  it("fails for missing project_id on show", () => {
    const code = runCli(
      ["show", "00000000-0000-4000-8000-000000000000"],
      runtimeOptions()
    );

    assert.equal(code, 1);
    assert.match(stderr.join("\n"), /Project not found/);
  });

  it("fails for invalid patch", () => {
    const projectId = cmdInit(["--title", "Invalid Patch"], runtimeOptions());
    const patchPath = join(tempDir, "invalid-patch.json");

    writeFileSync(
      patchPath,
      JSON.stringify(
        {
          schema_version: "0.1.1",
          project_id: projectId,
          source: "manual",
          operations: [],
        },
        null,
        2
      )
    );

    const code = runCli(
      ["patch", projectId, "--file", patchPath],
      runtimeOptions()
    );

    assert.equal(code, 1);
    assert.match(stderr.join("\n"), /Validation error/);
  });

  it("new-id outputs UUID v4", () => {
    const code = runCli(["new-id"], runtimeOptions());
    assert.equal(code, 0);
    assert.match(
      stdout[0] ?? "",
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });
});

describe("cli entrypoint", () => {
  it("runs via npm script command shape", () => {
    const tempDir = mkdtempSync(join(tmpdir(), "ground-core-cli-spawn-"));

    try {
      const result = spawnSync(
        "npx",
        ["tsx", "ground-core/cli.ts", "init", "--title", "Spawn Project"],
        {
          cwd: process.cwd(),
          env: {
            ...process.env,
            GROUND_CORE_STORAGE_DIR: tempDir,
          },
          encoding: "utf8",
        }
      );

      assert.equal(result.status, 0);
      assert.match(result.stdout.trim(), /^[0-9a-f-]{36}$/);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
