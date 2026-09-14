import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { projectSourceAssertions, validateDataset, type HistoricalDataset } from '../../experimental/historical-reality/substrate.js';
import type { ProjectState, StatePatch } from '../../types.js';

export const TARGET_PROJECT = '088d09dc-dfc5-487a-8f8f-22d2b33a9249';
export const BOOTSTRAP_FINGERPRINT = '724f01bfdeeed0414d8e1c360195b84439ce9e30f15cb35909a7f5aca0b0f169';
export const DATASET_FINGERPRINT = '5bc32592aa80ee4742f8e01b09d4381dacc1ce080fb930772a7a1ea2b24c70c2';
export const SOURCE_ID = 'frus:1904:392';
export const CLAIM_ID = 'c392-instruction';
export const POLICY = Object.freeze({
  version: 'frus-392-review-policy-v1',
  status: 'BLOCKED_CONFIDENCE_AND_APPLICABILITY_AUTHORITY',
  confidence: 0.95,
  confidence_qualification: 'Legacy experimental value retained ONLY in a non-publishable review candidate; not approved or empirically justified.',
  applicability_qualification: 'null/null means no lower or upper bound in canonical belief readers, NOT unknown. Unbounded applicability remains unapproved for this source assertion.',
  applicable_from: null,
  applicable_until: null,
});

/** Sorted object keys, array order preserved, UTF-8 JSON plus one LF. Not a canonical domain type or RFC 8785 implementation. */
export function stableSerialize(value: unknown): string {
  function sorted(v: any): any {
    if (Array.isArray(v)) return v.map(sorted);
    if (v !== null && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map(k => [k, sorted(v[k])]));
    return v;
  }
  return JSON.stringify(sorted(value)) + '\n';
}
export const sha256 = (bytes: string | Buffer) => createHash('sha256').update(bytes).digest('hex');

export function selectInput(data: HistoricalDataset): HistoricalDataset {
  validateDataset(data);
  const source = data.sources.find(s => s.id === SOURCE_ID);
  const claim = data.claims.find(c => c.id === CLAIM_ID);
  if (!source || !claim || claim.source_id !== source.id) throw new Error('Pinned source/claim selection is missing or mismatched');
  const selected: HistoricalDataset = {
    schema_version: data.schema_version,
    // Preserve the original actor dictionary for source and reporting-chain context. No actors are projected.
    actors: structuredClone(data.actors),
    sources: [structuredClone(source)], claims: [structuredClone(claim)],
    evidence_relations: structuredClone(data.evidence_relations.filter(r => r.source_id === SOURCE_ID && r.claim_id === CLAIM_ID)),
    actor_epistemic_records: structuredClone(data.actor_epistemic_records.filter(r => r.source_id === SOURCE_ID && r.claim_id === CLAIM_ID)),
    reconstructions: [], interpretations: [], narratives: [],
  };
  validateDataset(selected);
  return selected;
}

export function loadFrozenInput(): HistoricalDataset {
  const full = readFileSync(fileURLToPath(new URL('../../experimental/historical-reality/round1.dataset.json', import.meta.url)));
  if (sha256(full) !== DATASET_FINGERPRINT) throw new Error('Full source dataset fingerprint mismatch');
  const selected = selectInput(JSON.parse(full.toString('utf8')));
  const bytes = readFileSync(fileURLToPath(new URL('./selected-input.json', import.meta.url)));
  const manifest = JSON.parse(readFileSync(fileURLToPath(new URL('./manifest.json', import.meta.url)), 'utf8'));
  if (bytes.toString('utf8') !== stableSerialize(selected) || sha256(bytes) !== manifest.selected_input_sha256) throw new Error('Selected input freeze mismatch');
  const code = readFileSync(fileURLToPath(new URL('../../experimental/historical-reality/substrate.ts', import.meta.url)));
  if (sha256(code) !== manifest.projection_sha256) throw new Error('Projection code freeze mismatch');
  return selected;
}

/** Review only: no owner session, no save, no approval inferred from this function. */
export function buildReviewPatch(state: ProjectState, recordedAt: string): StatePatch {
  if (state.project.id !== TARGET_PROJECT) throw new Error('Unexpected target Project');
  return projectSourceAssertions(loadFrozenInput(), state, recordedAt, {
    confidence: POLICY.confidence, applicable_from: null, applicable_until: null,
  });
}
export function assertPublishPolicy(): never {
  throw new Error('BLOCKED_CONFIDENCE_AND_APPLICABILITY_AUTHORITY: 0.95 is an unapproved review value. No live publish is authorized by this package.');
}

const collections = { reality_entity: 'reality_entities', claim: 'claims', evidence: 'evidence', claim_evidence_link: 'claim_evidence_links' } as const;
export type AppliedReceipt = { project_id: string; record_fingerprints: Record<string, string> };
export type Preflight = 'NOT_APPLIED' | 'ALREADY_APPLIED_EXACT' | 'PARTIAL_OR_DIFFERENT';
/** No save; exact receipt hashes include all canonical timestamps, including applyPatch-generated updated_at. */
export function preflight(state: ProjectState, patch: StatePatch, receipt?: AppliedReceipt): Preflight {
  if (state.project.id !== TARGET_PROJECT || patch.project_id !== TARGET_PROJECT || patch.operations.length !== 4) return 'PARTIAL_OR_DIFFERENT';
  const seen = new Set<string>();
  const pairs = patch.operations.map(op => {
    if (op.op !== 'upsert' || !(op.entity in collections) || seen.has(op.entity)) throw new Error('Unexpected injection operation');
    seen.add(op.entity);
    const collection = collections[op.entity as keyof typeof collections];
    const matches = state[collection].filter(r => r.id === op.entity_id);
    // A matching ID in a different record collection is also a conflict.
    const all = Object.values(state).filter(Array.isArray).flat().filter(r => r && r.id === op.entity_id);
    return { op, record: matches[0], invalid: matches.length > 1 || all.length !== matches.length };
  });
  if (pairs.some(p => p.invalid)) return 'PARTIAL_OR_DIFFERENT';
  if (pairs.every(p => !p.record)) return receipt ? 'PARTIAL_OR_DIFFERENT' : 'NOT_APPLIED';
  if (!receipt || receipt.project_id !== TARGET_PROJECT || pairs.some(p => !p.record)) return 'PARTIAL_OR_DIFFERENT';
  for (const { op, record } of pairs) {
    const payload = op.payload as Record<string, unknown>;
    for (const [key, value] of Object.entries(payload)) {
      if (key !== 'updated_at' && stableSerialize((record as any)[key]) !== stableSerialize(value)) return 'PARTIAL_OR_DIFFERENT';
    }
    if (receipt.record_fingerprints[`${op.entity}/${op.entity_id}`] !== sha256(stableSerialize(record))) return 'PARTIAL_OR_DIFFERENT';
  }
  return 'ALREADY_APPLIED_EXACT';
}
