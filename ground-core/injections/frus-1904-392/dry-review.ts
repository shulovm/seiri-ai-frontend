import assert from 'node:assert/strict';
import { isAbsolute } from 'node:path';
import { loadProjectSnapshot } from '../../file-store.js';
import { applyPatch } from '../../state-engine.js';
import { validateProjectState, validateStatePatch } from '../../validate.js';
import { buildReviewPatch, BOOTSTRAP_FINGERPRINT, TARGET_PROJECT, POLICY, preflight } from './package.js';

const root = process.argv[2];
if (!root || !isAbsolute(root)) throw new Error('An explicit absolute read-only live root is required');
const options = { mode: 'canonical-live' as const, storageDir: root };
const before = loadProjectSnapshot(TARGET_PROJECT, options);
assert.equal(before.fingerprint, BOOTSTRAP_FINGERPRINT);
const executedAt = new Date().toISOString();
const patch = buildReviewPatch(before.state, executedAt);
assert.equal(validateStatePatch(patch).valid, true);
assert.equal(preflight(before.state, patch), 'NOT_APPLIED');
const preview = applyPatch(before.state, patch);
assert.equal(validateProjectState(preview).valid, true);
assert.equal(preview.project.title, before.state.project.title);
assert.equal(preview.project.summary, before.state.project.summary);
const counts = Object.fromEntries(['reality_entities','claims','evidence','claim_evidence_links','reality_events','reality_states','epistemic_observations','observations'].map(k => [k, { before: (before.state as any)[k].length, memory_preview: (preview as any)[k].length }]));
const after = loadProjectSnapshot(TARGET_PROJECT, options);
assert.equal(after.fingerprint, before.fingerprint);
console.log(JSON.stringify({
  purpose: 'NON-PUBLISHABLE review candidate; no owner or save acquired',
  policy: POLICY, execution_time: executedAt,
  timing: 'Candidate recorded_at equals this dry execution clock for inspection only. Future approved ingestion must explicitly fix its own timestamp and regenerate the reviewed patch.',
  before_fingerprint: before.fingerprint, live_after_fingerprint: after.fingerprint,
  target_project_id: TARGET_PROJECT, stored_schema: before.stored_schema_version, read_schema: before.read_schema_version,
  preflight: 'NOT_APPLIED', patch_validation: validateStatePatch(patch), memory_state_validation: validateProjectState(preview),
  counts, project_title_summary_unchanged: true, publication_allowed: false, patch,
  memory_applied_records: { reality_entities: preview.reality_entities, claims: preview.claims, evidence: preview.evidence, claim_evidence_links: preview.claim_evidence_links },
}, null, 2));
