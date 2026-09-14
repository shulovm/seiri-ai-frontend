import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { normalizeProjectState } from '../../ground-core/migrate.js';
import { SCHEMA_VERSION } from '../../ground-core/types.js';
import { validateProjectState } from '../../ground-core/validate.js';
import { getRealityWorldline, detectRealityStateConflicts } from '../../ground-core/reality/worldline.js';
import { getClaimsForSubject, getEvidenceForClaim, getObservationsForSubject } from '../../ground-core/reality/epistemic.js';

// No experimental imports, durable writes, clock, or temporal reimplementation.
const fixtureDir = new URL('../../fixtures/human-interface/human-001/', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('manifest.json', fixtureDir), 'utf8'));
const bytes = readFileSync(new URL('project-state.json', fixtureDir));
const hash = createHash('sha256').update(bytes).digest('hex');
assert.equal(hash, manifest.sha256);
assert.equal(bytes.length, manifest.byte_length);
const raw = JSON.parse(bytes.toString('utf8'));
assert.equal(raw.schema_version, manifest.snapshot_schema_version);
assert.equal(SCHEMA_VERSION, manifest.canonical_contract_schema_version);
// loadProject delegates to this same canonical normalizer. Use it directly
// because file-store filenames are <project_id>.json, not project-state.json.
const state = normalizeProjectState(raw);
assert.equal(state.schema_version, SCHEMA_VERSION);
assert.equal(state.project.id, manifest.project_id);
const validation = validateProjectState(state);
assert.ok(validation.valid, JSON.stringify(validation.errors));
// Migration must preserve every record and its timestamps, nulls and provenance.
for (const key of Object.keys(raw).filter(key => key !== 'schema_version')) {
  assert.deepEqual(state[key as keyof typeof state], raw[key], `Changed source field: ${key}`);
}
const worldline = getRealityWorldline(state, manifest.entity_id);
assert.equal(worldline.entity.id, manifest.entity_id);
assert.equal(worldline.entity.label, 'FRUS 1904, document 392');
const observations = getObservationsForSubject(state, manifest.entity_id);
const claims = getClaimsForSubject(state, manifest.entity_id);
assert.equal(claims.length, 1);
assert.equal(claims[0]!.id, '79f42640-9eff-5def-a807-268ea0c0650f');
const claim = claims[0]!;
assert.equal(claim.predicate, 'inspected_source_assertion');
assert.equal(claim.confidence, 0.95); // Stored declaration, not historical truth probability.
const evidence = getEvidenceForClaim(state, claim.id);
assert.equal(evidence.links.length, 1);
assert.equal(evidence.supports.length, 1);
assert.equal(evidence.contradicts.length, 0);
assert.equal(evidence.links[0]!.id, '44bcabb0-59b3-5d23-aa4b-b9edd5d00959');
assert.equal(evidence.links[0]!.relation, 'SUPPORTS');
assert.equal(evidence.supports[0]!.id, '496d2e47-849a-5ddc-ae95-7ef6891b6ef3');
assert.equal(evidence.links[0]!.evidence_id, evidence.supports[0]!.id);
assert.equal(evidence.supports[0]!.kind, 'external_ref');
assert.equal(evidence.supports[0]!.observation_id, null);
assert.equal(evidence.supports[0]!.provenance.entity_id, worldline.entity.id);
assert.equal(claim.provenance.entity_id, worldline.entity.id);
const counts = {
  reality_entities: state.reality_entities.length,
  claims: state.claims.length,
  evidence: state.evidence.length,
  claim_evidence_links: state.claim_evidence_links.length,
  reality_events: state.reality_events.length,
  reality_states: state.reality_states.length,
  epistemic_observations: state.epistemic_observations.length,
};
assert.deepEqual(counts, { reality_entities: 14, claims: 18, evidence: 14,
  claim_evidence_links: 18, reality_events: 0, reality_states: 0, epistemic_observations: 0 });
assert.equal(worldline.events.length, 0);
assert.equal(worldline.states.length, 0);
assert.equal(worldline.ordered_entries.length, 0);
assert.equal(worldline.unplaced_events.length, 0);
assert.equal(observations.length, 0);
assert.equal(detectRealityStateConflicts(state, manifest.entity_id).length, 0);
assert.equal(createHash('sha256').update(readFileSync(new URL('project-state.json', fixtureDir))).digest('hex'), hash);
console.log(JSON.stringify({ verification: 'PASS', fixture: fileURLToPath(fixtureDir),
  sha256: hash, snapshot_schema_version: raw.schema_version, read_schema_version: state.schema_version,
  project_id: state.project.id, counts, worldline, observations, claim, evidence }, null, 2));
