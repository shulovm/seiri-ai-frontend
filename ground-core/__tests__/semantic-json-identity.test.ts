import test from "node:test";
import assert from "node:assert/strict";
import { canonicalizeSemanticValue, canonicalValueKey, semanticValuesEqual } from "../reality/semantic-equality.js";
import { normalizeReferenceCriterion, valueSatisfiesCriterion } from "../reality/reference-criterion.js";
import { detectRealityStateConflicts } from "../reality/worldline.js";
import { createEmptyProject } from "../state-engine.js";
import { validateProjectState } from "../validate.js";

for (const value of [null, 1, "literal", { field: true }, [1, 2]]) {
  test(`own __proto__ JSON member retains identity: ${JSON.stringify(value)}`, () => {
    const input = JSON.parse(`{"__proto__":${JSON.stringify(value)}}`);
    const before = JSON.stringify(input);
    const output = canonicalizeSemanticValue(input);
    assert.equal(JSON.stringify(output), before);
    assert.equal(Object.hasOwn(output as object, "__proto__"), true);
    assert.equal(Object.getPrototypeOf(output), Object.prototype);
    assert.equal(semanticValuesEqual(input, {}), false);
    assert.equal(JSON.stringify(input), before);
  });
}

test("nested JSON members preserve values while key order stays irrelevant", () => {
  const a = JSON.parse('{"z":[{"__proto__":{"b":2,"a":1},"constructor":"data"}],"toString":0}');
  const b = JSON.parse('{"toString":0,"z":[{"constructor":"data","__proto__":{"a":1,"b":2}}]}');
  assert.equal(canonicalValueKey(a), canonicalValueKey(b));
  const different = JSON.parse('{"toString":0,"z":[{"constructor":"data","__proto__":{"a":1,"b":3}}]}');
  assert.equal(semanticValuesEqual(a, different), false);
  assert.equal(semanticValuesEqual([a, 1], [1, a]), false);
});

test("Reference equality and ONE_OF do not erase an own JSON member", () => {
  const value = JSON.parse('{"__proto__":{"state":"declared"}}');
  assert.equal(valueSatisfiesCriterion(value, { kind: "EQUALS", value: {} }), false);
  assert.equal(valueSatisfiesCriterion(value, { kind: "ONE_OF", values: [{}] }), false);
  const normalized = normalizeReferenceCriterion({ kind: "ONE_OF", values: [{}, value, structuredClone(value)] });
  assert.equal(normalized.kind, "ONE_OF");
  if (normalized.kind === "ONE_OF") assert.equal(normalized.values.length, 2);
});

test("Worldline distinguishes value conflict from duplicate overlap for schema-valid JSON", () => {
  const p = createEmptyProject({ title: "JSON identity", summary: "" });
  const at = "2026-09-05T00:00:00Z";
  const entityId = "d1010101-0101-4101-8101-010101010101";
  p.reality_entities.push({ id: entityId, project_id: p.project.id, kind: "asset", label: "asset", created_at: at, updated_at: at });
  for (const [i, value] of [{}, JSON.parse('{"__proto__":{"state":"declared"}}')].entries()) {
    p.reality_states.push({ id: `d3030303-0303-4303-8303-03030303030${i}`, project_id: p.project.id, subject_id: entityId, kind: "condition", value, valid_from: at, valid_until: null, recorded_at: at, created_at: at, updated_at: at });
  }
  assert.equal(validateProjectState(p).valid, true);
  const conflicts = detectRealityStateConflicts(p, entityId);
  assert.equal(conflicts.length, 1);
  assert.equal(conflicts[0]!.conflict_kind, "value_conflict");
});
