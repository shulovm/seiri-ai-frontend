import assert from 'node:assert/strict';
import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { test, mock } from 'node:test';
import { createEmptyProject, applyPatch } from '../state-engine.js';
import { validateProjectState, validateStatePatch } from '../validate.js';
import { isClaimApplicableAt } from '../reality/belief.js';
import { projectSourceAssertions } from '../experimental/historical-reality/substrate.js';
import { TARGET_PROJECT, loadFrozenInput, buildReviewPatch, stableSerialize, sha256, preflight, assertPublishPolicy, selectInput, type AppliedReceipt } from '../injections/frus-1904-392/package.js';
const stamp = '2026-09-14T00:00:00.000Z'; // test input, never a proposed live ingestion timestamp
function base() { const state = createEmptyProject({ title: 'test only', summary: 'metadata guard' }); state.project.id = TARGET_PROJECT; state.current_state.project_id = TARGET_PROJECT; return state; }
function applied() {
  const before = base(), patch = buildReviewPatch(before, stamp), after = applyPatch(before, patch);
  const arrays: Record<string, string> = { reality_entity: 'reality_entities', claim: 'claims', evidence: 'evidence', claim_evidence_link: 'claim_evidence_links' };
  const receipt: AppliedReceipt = { project_id: TARGET_PROJECT, record_fingerprints: Object.fromEntries(patch.operations.map(op => [ `${op.entity}/${op.entity_id}`, sha256(stableSerialize((after as any)[arrays[op.entity]].find((r: any) => r.id === op.entity_id))) ])) };
  return { before, patch, after, receipt };
}
test('selected input pins one source and one authored claim without rewriting their content', () => {
  const selected = loadFrozenInput();
  assert.equal(selected.sources.length, 1); assert.equal(selected.claims.length, 1);
  assert.equal(selected.sources[0].id, 'frus:1904:392'); assert.equal(selected.claims[0].id, 'c392-instruction');
  const bad = structuredClone(selected); bad.claims[0].source_id = 'missing'; assert.throws(() => selectInput(bad));
});
test('same target/input/time reproduces patch; record IDs do not depend on timestamps', () => {
  const state = base(); const first = buildReviewPatch(state, stamp);
  assert.deepEqual(first, buildReviewPatch(state, stamp));
  assert.deepEqual(first.operations.map(o => o.entity_id), buildReviewPatch(state, '2026-09-15T01:00:00Z').operations.map(o => o.entity_id));
  const old = structuredClone(state); old.project.id = '19041904-1904-4904-8904-190419041904';
  const experimental = projectSourceAssertions(loadFrozenInput(), old, stamp);
  assert.ok(first.operations.every(o => !experimental.operations.some(e => e.entity_id === o.entity_id)));
});
test('0.1.25 patch produces exactly four records and no Event/State/Observation; metadata retained', () => {
  const { before, patch, after } = applied();
  assert.equal(validateStatePatch(patch).valid, true); assert.equal(validateProjectState(after).valid, true);
  assert.equal(after.schema_version, '0.1.25'); assert.equal(patch.operations.length, 4);
  for (const name of ['reality_entities','claims','evidence','claim_evidence_links'] as const) assert.equal(after[name].length, 1);
  for (const name of ['reality_events','reality_states','epistemic_observations','observations'] as const) assert.equal(after[name].length, 0);
  assert.equal(after.project.title, before.project.title); assert.equal(after.project.summary, before.project.summary);
  assert.deepEqual(after.current_state, before.current_state);
  for (const key of Object.keys(before)) {
    if (!['project','updated_at','reality_entities','claims','evidence','claim_evidence_links'].includes(key)) assert.deepEqual((after as any)[key], (before as any)[key]);
  }
});
test('document provenance, URL, locator and all internal refs are retained', () => {
  const { after } = applied(); const [entity] = after.reality_entities, [claim] = after.claims, [evidence] = after.evidence, [link] = after.claim_evidence_links;
  assert.equal(claim.subject_id, entity.id); assert.equal(claim.provenance.entity_id, entity.id); assert.equal(evidence.provenance.entity_id, entity.id);
  assert.equal(claim.provenance.external_id, 'frus:1904:392'); assert.equal(evidence.external_ref, 'https://history.state.gov/historicaldocuments/frus1904/d392');
  assert.match(evidence.summary, /392/); assert.equal(link.claim_id, claim.id); assert.equal(link.evidence_id, evidence.id); assert.equal(link.relation, 'SUPPORTS');
});
test('null applicability is unbounded, not unknown; recording time remains separate', () => {
  const { after } = applied(); const c = after.claims[0];
  assert.equal(c.applicable_from, null); assert.equal(c.applicable_until, null); assert.equal(c.recorded_at, stamp);
  assert.equal(isClaimApplicableAt(c, '1800-01-01T00:00:00Z'), true);
  assert.equal(isClaimApplicableAt(c, '2100-01-01T00:00:00Z'), true);
  assert.equal(c.confidence, 0.95); assert.throws(assertPublishPolicy, /BLOCKED_CONFIDENCE_AND_APPLICABILITY_AUTHORITY/);
});
test('canonical confidence cannot be weakened to an invented unknown sentinel', () => {
  const { after } = applied(); (after.claims[0] as any).confidence = null;
  assert.equal(validateProjectState(after).valid, false);
});
test('preflight NOT_APPLIED requires all four IDs absent and no contradictory receipt', () => {
  const { before, patch, receipt } = applied(); assert.equal(preflight(before, patch), 'NOT_APPLIED'); assert.equal(preflight(before, patch, receipt), 'PARTIAL_OR_DIFFERENT');
});
test('preflight ALREADY_APPLIED_EXACT requires matching full record hashes and preserved timestamps', () => {
  const { after, patch, receipt } = applied(); assert.equal(preflight(after, patch, receipt), 'ALREADY_APPLIED_EXACT'); assert.equal(preflight(after, patch), 'PARTIAL_OR_DIFFERENT');
});
test('partial records, changed semantic field, refs or timestamps fail closed', () => {
  const { after, patch, receipt } = applied();
  for (const mutate of [
    (s: typeof after) => { s.claims = []; },
    (s: typeof after) => { s.claims[0].confidence = 0.5; },
    (s: typeof after) => { s.claim_evidence_links[0].evidence_id = s.claims[0].id; },
    (s: typeof after) => { s.claims[0].updated_at = '2027-01-01T00:00:00Z'; },
    (s: typeof after) => { s.claims[0].recorded_at = '2027-01-01T00:00:00Z'; },
  ]) { const changed = structuredClone(after); mutate(changed); assert.equal(preflight(changed, patch, receipt), 'PARTIAL_OR_DIFFERENT'); }
});
test('wrong Project and unexpected record type cannot pass preflight', () => {
  const { before, patch } = applied(); before.project.id = 'wrong'; assert.equal(preflight(before, patch), 'PARTIAL_OR_DIFFERENT');
});
test('dry projection and memory validation never call filesystem mutation primitives', () => {
  const state = base();
  for (const method of ['writeFileSync','renameSync','mkdirSync','unlinkSync'] as const) mock.method(fs, method, () => { throw new Error('Unexpected filesystem mutation'); });
  syncBuiltinESMExports();
  try { assert.equal(validateProjectState(applyPatch(state, buildReviewPatch(state, stamp))).valid, true); }
  finally { mock.restoreAll(); syncBuiltinESMExports(); }
});
