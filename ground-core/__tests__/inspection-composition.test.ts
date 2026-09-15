import assert from 'node:assert/strict';
import fs from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { test, mock } from 'node:test';
import { createEmptyProject, applyPatch } from '../state-engine.js';
import { validateProjectState, validateStatePatch } from '../validate.js';
import { getObservationsForSubject, getClaimsForSubject } from '../reality/epistemic.js';
import { buildInspectionPatch, idsFor, input, TARGET_PROJECT, POLICY_VERSION, SELECTED_SHA256, REPORT_REF, preflight, exactRecordHashes, type CompletionReceipt } from '../injections/frus-1904-392-inspection-v1/composition.js';
const VALIDATION_TIME = '2026-09-15T00:00:00.000Z'; // deterministic test-only binding, not a live recording time
function base() { const s = createEmptyProject({ title: 'inspection unit test', summary: 'preserve metadata' }); s.project.id = TARGET_PROJECT; s.current_state.project_id = TARGET_PROJECT; return s; }
function fixture() {
  const before = base(), patch = buildInspectionPatch(before, VALIDATION_TIME), after = applyPatch(before, patch);
  const receipt: CompletionReceipt = { project_id: TARGET_PROJECT, policy_version: POLICY_VERSION, selected_input_sha256: SELECTED_SHA256, recorded_at: VALIDATION_TIME, record_hashes: exactRecordHashes(after) };
  return { before, patch, after, receipt };
}
test('inspection mapping keeps source identity in existing identity attrs only', () => {
  const { after } = fixture(); const d = after.reality_entities[0]; const { source } = input();
  assert.equal(d.kind, 'document'); assert.equal(d.label, source.title);
  assert.deepEqual(d.attrs, { source_id: source.id, url: source.url, locator: source.locator });
});
test('content is a qualified recorded paraphrase, without operations logs or forged observer', () => {
  const { after } = fixture(); const o = after.epistemic_observations[0];
  assert.equal(o.content, 'Recorded researcher-authored paraphrase: Japanese minister at St. Petersburg — instructed to present termination note and break diplomatic relations.');
  assert.ok(!o.content.includes(SELECTED_SHA256)); assert.ok(!o.content.includes(VALIDATION_TIME));
  assert.equal(o.provenance.kind, 'document'); assert.equal(o.provenance.external_id, REPORT_REF); assert.equal(o.provenance.entity_id, undefined);
  assert.deepEqual(o.subject_ids, [idsFor(TARGET_PROJECT).document]); assert.equal(o.kind, 'textual');
});
test('observed_at is unknown; recording timestamp is explicitly supplied; no date-granularity conversion', () => {
  const { after } = fixture(); const o = after.epistemic_observations[0];
  assert.equal(o.observed_at, null); assert.equal(o.recorded_at, VALIDATION_TIME); assert.equal(o.created_at, VALIDATION_TIME);
  assert.throws(() => buildInspectionPatch(base(), '2026-09-14'));
  assert.throws(() => buildInspectionPatch(base(), ''));
});
test('standalone observation_ref Evidence has strict canonical link with no Claim', () => {
  const { after } = fixture(); const e = after.evidence[0];
  assert.equal(e.kind, 'observation_ref'); assert.equal(e.observation_id, after.epistemic_observations[0].id); assert.equal(e.external_ref, null);
  assert.equal(after.claims.length, 0); assert.equal(after.claim_evidence_links.length, 0); assert.equal(validateProjectState(after).valid, true);
});
test('schema 0.1.25 delta has exactly three records, no unrelated fields changed', () => {
  const { before, patch, after } = fixture(); assert.equal(validateStatePatch(patch).valid, true); assert.equal(validateProjectState(after).valid, true);
  assert.equal(after.schema_version, '0.1.25'); assert.equal(patch.operations.length, 3);
  for (const key of ['reality_entities','epistemic_observations','evidence'] as const) assert.equal(after[key].length, 1);
  for (const key of Object.keys(before)) if (!['reality_entities','epistemic_observations','evidence','project','updated_at'].includes(key)) assert.deepEqual((after as any)[key], (before as any)[key]);
  const { updated_at: a, ...bp } = before.project, { updated_at: b, ...ap } = after.project; assert.deepEqual(ap, bp);
});
test('IDs are target/key-derived, repeatable and independent of recording clock', () => {
  const s = base(), a = buildInspectionPatch(s, VALIDATION_TIME), b = buildInspectionPatch(s, '2026-10-01T12:00:00Z');
  assert.deepEqual(a.operations.map(o => o.entity_id), b.operations.map(o => o.entity_id));
  assert.deepEqual(a, buildInspectionPatch(s, VALIDATION_TIME));
  assert.notDeepEqual(idsFor(TARGET_PROJECT), idsFor('19041904-1904-4904-8904-190419041904'));
  const old = ['e1aa20fc-42ab-546b-a01c-7f610d67e707','23d2f2a5-ba7a-5203-a05c-67334501f8fa','ec285b6a-10d1-5d61-a32c-8118fddbef88','45376e57-af27-5d4b-ab07-827e5702b4cc'];
  assert.ok(Object.values(idsFor(TARGET_PROJECT)).every(id => !old.includes(id)));
});
test('NOT_APPLIED requires absence and no contradictory completion receipt', () => {
  const { before, receipt } = fixture(); assert.equal(preflight(before), 'NOT_APPLIED'); assert.equal(preflight(before, receipt), 'PARTIAL_OR_DIFFERENT');
});
test('ALREADY_APPLIED_EXACT includes all canonical fields and exact receipt timestamps', () => {
  const { after, receipt } = fixture(); assert.equal(preflight(after, receipt), 'ALREADY_APPLIED_EXACT'); assert.equal(preflight(after), 'PARTIAL_OR_DIFFERENT');
  assert.equal(preflight(after, { ...receipt, recorded_at: '2026-10-01T12:00:00Z' }), 'PARTIAL_OR_DIFFERENT');
});
test('partial/content/provenance/recorded/updated differences fail closed', () => {
  const { after, receipt } = fixture();
  for (const mutate of [
    (s: typeof after) => { s.evidence = []; },
    (s: typeof after) => { s.epistemic_observations[0].content = 'changed'; },
    (s: typeof after) => { s.epistemic_observations[0].provenance.kind = 'human'; },
    (s: typeof after) => { s.epistemic_observations[0].recorded_at = '2026-10-01T00:00:00Z'; },
    (s: typeof after) => { s.evidence[0].updated_at = '2026-10-01T00:00:00Z'; },
  ]) { const copy = structuredClone(after); mutate(copy); assert.equal(preflight(copy, receipt), 'PARTIAL_OR_DIFFERENT'); }
});
test('unexpected related observation, evidence, source identity or cross-collection IDs fail closed', () => {
  const { before, after, receipt } = fixture();
  const extraObs = structuredClone(after); extraObs.epistemic_observations.push({ ...after.epistemic_observations[0], id: 'extra' }); assert.equal(preflight(extraObs, receipt), 'PARTIAL_OR_DIFFERENT');
  const extraEvidence = structuredClone(after); extraEvidence.evidence.push({ ...after.evidence[0], id: 'extra' }); assert.equal(preflight(extraEvidence, receipt), 'PARTIAL_OR_DIFFERENT');
  const otherIdentity = structuredClone(before); otherIdentity.reality_entities.push({ ...after.reality_entities[0], id: 'other-source-id' }); assert.equal(preflight(otherIdentity), 'PARTIAL_OR_DIFFERENT');
  const collision = structuredClone(before); collision.evidence.push({ ...after.evidence[0], id: idsFor(TARGET_PROJECT).document }); assert.equal(preflight(collision), 'PARTIAL_OR_DIFFERENT');
});
test('unrelated valid records do not turn completed injection into a republish', () => {
  const { after, receipt } = fixture(); after.reality_entities.push({ ...after.reality_entities[0], id: '99999999-1111-4111-8111-111111111111', attrs: {}, label: 'unrelated' });
  assert.equal(preflight(after, receipt), 'ALREADY_APPLIED_EXACT');
});
test('current canonical subject reader returns observation and zero claims', () => {
  const { after } = fixture(); const id = idsFor(TARGET_PROJECT).document;
  assert.equal(getObservationsForSubject(after, id).length, 1); assert.deepEqual(getClaimsForSubject(after, id), []);
});
test('projection/preflight/memory apply do not invoke filesystem mutation', () => {
  const before = base();
  for (const key of ['writeFileSync','mkdirSync','renameSync','unlinkSync'] as const) mock.method(fs, key, () => { throw new Error('Unexpected write'); }); syncBuiltinESMExports();
  try { const patch = buildInspectionPatch(before, VALIDATION_TIME); assert.equal(preflight(before), 'NOT_APPLIED'); assert.equal(validateProjectState(applyPatch(before, patch)).valid, true); }
  finally { mock.restoreAll(); syncBuiltinESMExports(); }
});
