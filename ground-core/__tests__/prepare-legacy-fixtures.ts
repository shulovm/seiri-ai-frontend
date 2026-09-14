/** Reproduce legacy CLI test inputs from committed examples; never overwrite live state. */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createEmptyProject, applyPatch } from "../state-engine.js";
import type { ProjectState, StatePatch } from "../types.js";
const root = process.cwd();
const dir = join(root, "ground-core/storage/projects");
const read = (path: string) => JSON.parse(readFileSync(join(root, path), "utf8"));
const generated: ProjectState[] = [];
for (const [title, files] of [
  ["Japanese Folktale / Momotaro", ["momotaro-production-design.patch.json", "momotaro-v0.1.1-manual.patch.json"]],
  ["GROUND Core", ["ground-core-manual-run.patch.json", "ground-core-v0.4-state-update.patch.json"]],
] as const) {
  const patches: StatePatch[] = files.map(f => read("ground-core/examples/" + f));
  let state = createEmptyProject({ title });
  state.project.id = patches[0]!.project_id;
  state.current_state.project_id = state.project.id;
  state.current_state.id = patches[0]!.operations.find(o => o.entity === "current_state")!.entity_id;
  for (const patch of patches) {
    // Historical v0.1.0 action payloads predate the existing nullable dependency field.
    for (const op of patch.operations) {
      if (op.op === "upsert" && op.entity === "next_action" && op.payload?.id) {
        const payload = op.payload as unknown as Record<string, unknown>;
        payload.depends_on_action_id ??= null;
      }
    }
    state = applyPatch(state, patch);
  }
  // Fixture clock only; production builders and examples remain unchanged.
  state = JSON.parse(JSON.stringify(state, (key, value) =>
    ["created_at", "updated_at"].includes(key) ? "2026-06-07T07:00:00.000Z" : value));
  generated.push(state);
}
generated.push(read("ground-core/__tests__/fixtures/freewater-phase0.project.json"));
for (const state of generated) {
  if (existsSync(join(dir, state.project.id + ".json"))) {
    throw new Error("Refusing to overwrite an existing project; use only a fresh test worktree");
  }
}
mkdirSync(dir, { recursive: true });
for (const state of generated) {
  writeFileSync(join(dir, state.project.id + ".json"), JSON.stringify(state, null, 2) + "\n", { flag: "wx" });
}
