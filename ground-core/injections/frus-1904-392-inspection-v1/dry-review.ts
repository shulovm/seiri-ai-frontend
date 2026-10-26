import assert from 'node:assert/strict';
import { isAbsolute } from 'node:path';
import { loadProjectSnapshot } from '../../file-store.js';
import { applyPatch } from '../../state-engine.js';
import { validateProjectState, validateStatePatch } from '../../validate.js';
import { buildInspectionPatch, idsFor, ID_KEYS, TARGET_PROJECT, BOOTSTRAP_FINGERPRINT, POLICY_VERSION, preflight, input } from './composition.js';
const root = process.argv[2];
if (!root || !isAbsolute(root)) throw new Error('Explicit absolute read-only root required');
const options = { mode: 'canonical-live' as const, storageDir: root };
const before = loadProjectSnapshot(TARGET_PROJECT, options);
assert.equal(before.fingerprint, BOOTSTRAP_FINGERPRINT);
const executionTime = new Date().toISOString();
// Actual dry execution clock only, explicitly not the future final recording time.
const validationOnlyBinding = executionTime;
const patch = buildInspectionPatch(before.state, validationOnlyBinding);
assert.equal(validateStatePatch(patch).valid, true);
assert.equal(preflight(before.state), 'NOT_APPLIED');
const preview = applyPatch(before.state, patch);
assert.equal(validateProjectState(preview).valid, true);
const changed = ['reality_entities','epistemic_observations','evidence'];
for (const key of Object.keys(before.state)) if (![...changed, 'project', 'updated_at'].includes(key)) assert.deepEqual((preview as any)[key], (before.state as any)[key]);
const { updated_at: _a, ...oldProject } = before.state.project;
const { updated_at: _b, ...newProject } = preview.project;
assert.deepEqual(newProject, oldProject);
const after = loadProjectSnapshot(TARGET_PROJECT, options);
assert.equal(after.fingerprint, before.fingerprint);
const { source, report } = input();
console.log(JSON.stringify({
  checkpoint: 'SEMANTIC-002', policy_version: POLICY_VERSION, publication_authorized: false,
  recorded_at_binding: { final_recorded_at: 'UNBOUND: future owner-controlled recording only', validation_only_clock: validationOnlyBinding, execution_time: executionTime, explanation: 'The following patch is schema-validation material only; its timestamp is not approved for a future live record. No owner or save was used.' },
  input_qualification: { origin: 'Stored Historical dataset inspection report', source_id: source.id, input_key: report.id, extraction: report.extraction, access_date: source.access_date, completeness: source.completeness, authenticity: source.authenticity },
  target_project_id: TARGET_PROJECT, ids: idsFor(TARGET_PROJECT), id_keys: ID_KEYS,
  before_fingerprint: before.fingerprint, live_after_fingerprint: after.fingerprint,
  stored_schema: before.stored_schema_version, read_schema: before.read_schema_version,
  counts: Object.fromEntries(['reality_entities','epistemic_observations','evidence','claims','claim_evidence_links','reality_events','reality_states','observations'].map(k => [k, { before: (before.state as any)[k].length, memory_preview: (preview as any)[k].length }])),
  patch_validation: validateStatePatch(patch), memory_validation: validateProjectState(preview), preflight: 'NOT_APPLIED',
  title_summary_current_state_preserved: true, validation_only_patch: patch,
  memory_records: { document: preview.reality_entities[0], observation: preview.epistemic_observations[0], evidence: preview.evidence[0] },
}, null, 2));
