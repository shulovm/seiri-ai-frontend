/** Round 1 sidecar. No change to canonical semantics; no truth promotion. */
import { createHash } from 'node:crypto';
import type { ProjectState, StatePatch, PatchOperation } from '../../types.js';
import { SCHEMA_VERSION } from '../../types.js';

export interface Unknown { status: 'unknown'; reason: string }
export interface HistoricalTime {
  raw: string;
  precision: 'day' | 'year' | 'unknown';
  calendar?: string;
  normalized_day?: string | Unknown;
  time_standard?: Unknown;
}
export interface HistoricalDataset {
  schema_version: 'historical-reality-experimental/round1';
  actors: { id: string; label: string; kind: string; identity_boundary: string }[];
  sources: {
    id: string; title: string; url: string; excerpt: string;
    inspection: string; creation: HistoricalTime;
    locator: Record<string, unknown>; access_date: string;
    [key: string]: unknown;
  }[];
  claims: {
    id: string; source_id: string; subject_id: string; predicate: string;
    object: string; claimant_id: string | Unknown; report_chain: string[];
    temporal_scope: HistoricalTime;
    extraction: { status: string; confidence: string; context: string };
    [key: string]: unknown;
  }[];
  evidence_relations: {
    id: string; source_id: string; claim_id: string;
    relation: 'attests_recorded_assertion' | 'qualifies';
    scope: 'inspected_text' | 'historical_reconstruction'; reason: string;
  }[];
  actor_epistemic_records: {
    id: string; actor_id: string; claim_id: string; source_id: string;
    stance: 'was_told' | 'explicit_no_positive_knowledge';
    as_of: HistoricalTime; limit: string;
  }[];
  reconstructions: {
    id: string; proposition: string; status: string; claim_ids: string[];
    relation_ids: string[]; reason: string; alternatives: string[];
    unknowns: string[]; assessed_on: string;
  }[];
  interpretations: { id: string; source_id: string; claim_ids: string[]; [key: string]: unknown }[];
  narratives: { id: string; interpretation_ids: string[]; [key: string]: unknown }[];
  [key: string]: unknown;
}

/** Referential validation, including provenance routes. Not authenticity verification. */
export function validateDataset(data: HistoricalDataset): void {
  if (data.schema_version !== 'historical-reality-experimental/round1') throw new Error('Unsupported experimental version');
  const ids = new Set<string>();
  for (const items of [data.actors, data.sources, data.claims, data.evidence_relations,
    data.actor_epistemic_records, data.reconstructions, data.interpretations, data.narratives]) {
    for (const item of items) {
      if (!item.id || ids.has(item.id)) throw new Error(`Duplicate/missing id: ${item.id}`);
      ids.add(item.id);
    }
  }
  const actorIds = new Set(data.actors.map(x => x.id));
  const sourceIds = new Set(data.sources.map(x => x.id));
  const claimIds = new Set(data.claims.map(x => x.id));
  const relationIds = new Set(data.evidence_relations.map(x => x.id));
  const interpretationIds = new Set(data.interpretations.map(x => x.id));
  const requireRef = (set: Set<string>, id: string) => {
    if (!set.has(id)) throw new Error(`Dangling reference: ${id}`);
  };
  const validateTime = (time: HistoricalTime) => {
    if (!time.raw || !['day','year','unknown'].includes(time.precision)) throw new Error('Invalid historical time');
    if (typeof time.normalized_day === 'string') {
      const parsed = new Date(`${time.normalized_day}T00:00:00Z`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(time.normalized_day) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0,10) !== time.normalized_day) throw new Error('Invalid normalized day');
      if (time.precision !== 'day') throw new Error('Cannot synthesize day from coarse time');
    } else if (!time.normalized_day || time.normalized_day.status !== 'unknown' || !time.normalized_day.reason) throw new Error('Unknown time requires reason');
  };
  for (const source of data.sources) {
    if (!source.title || !source.locator || !source.access_date || !source.excerpt || !source.inspection || !/^https:\/\//.test(source.url)) throw new Error(`Missing source provenance: ${source.id}`);
    validateTime(source.creation);
    if (source.temporal_annotations !== undefined) {
      if (!Array.isArray(source.temporal_annotations)) throw new Error('Invalid source temporal annotations');
      for (const annotation of source.temporal_annotations as {role:string;time:HistoricalTime}[]) {
        if (!annotation.role) throw new Error('Temporal annotation requires role');
        validateTime(annotation.time);
      }
    }
  }
  for (const claim of data.claims) {
    requireRef(sourceIds, claim.source_id); requireRef(actorIds, claim.subject_id);
    if (typeof claim.claimant_id === 'string') requireRef(actorIds, claim.claimant_id);
    else if (claim.claimant_id.status !== 'unknown' || !claim.claimant_id.reason) throw new Error('Unresolved claimant requires reason');
    claim.report_chain.forEach(x => requireRef(actorIds,x));
    if (!claim.extraction.context || !claim.extraction.status || !claim.extraction.confidence) throw new Error('Missing extraction context');
    validateTime(claim.temporal_scope);
  }
  for (const relation of data.evidence_relations) {
    requireRef(sourceIds, relation.source_id); requireRef(claimIds, relation.claim_id);
    if (!['attests_recorded_assertion','qualifies'].includes(relation.relation)) throw new Error('Unsupported observed relation');
    if (!['inspected_text','historical_reconstruction'].includes(relation.scope) || !relation.reason) throw new Error('Missing evidence scope');
    if (relation.relation === 'attests_recorded_assertion' && (relation.scope !== 'inspected_text' || data.claims.find(x=>x.id===relation.claim_id)!.source_id !== relation.source_id)) throw new Error('Text attestation must refer to its extraction source');
  }
  for (const record of data.actor_epistemic_records) {
    requireRef(actorIds, record.actor_id); requireRef(claimIds, record.claim_id); requireRef(sourceIds,record.source_id);
    if (!['was_told','explicit_no_positive_knowledge'].includes(record.stance) || !record.limit) throw new Error('Unsupported epistemic stance');
    validateTime(record.as_of);
    if (data.claims.find(x=>x.id===record.claim_id)!.source_id !== record.source_id) throw new Error('Actor record source must match extracted claim');
  }
  for (const record of data.reconstructions) {
    record.claim_ids.forEach(x=>requireRef(claimIds,x));
    record.relation_ids.forEach(x=>requireRef(relationIds,x));
    if (record.relation_ids.some(id=>!record.claim_ids.includes(data.evidence_relations.find(x=>x.id===id)!.claim_id))) throw new Error('Reconstruction relation must address a listed claim');
    if (!record.claim_ids.length || !record.relation_ids.length || !record.reason || !['strongly_established','possible','unresolved'].includes(record.status)) throw new Error('Reconstruction requires evidence and rationale');
  }
  for (const record of data.interpretations) {
    requireRef(sourceIds,record.source_id); record.claim_ids.forEach(x=>requireRef(claimIds,x));
  }
  for (const record of data.narratives) record.interpretation_ids.forEach(x=>requireRef(interpretationIds,x));
}

/** Human can replay the assessment → relation/claim → inspected source path. */
export function traceReconstruction(data: HistoricalDataset, id: string) {
  validateDataset(data);
  const reconstruction = data.reconstructions.find(x=>x.id===id);
  if (!reconstruction) throw new Error(`Missing reconstruction: ${id}`);
  const claims = data.claims.filter(x=>reconstruction.claim_ids.includes(x.id));
  const relations = data.evidence_relations.filter(x=>reconstruction.relation_ids.includes(x.id));
  const sourceIds = new Set([...claims.map(x=>x.source_id),...relations.map(x=>x.source_id)]);
  return { reconstruction, claims, relations, sources: data.sources.filter(x=>sourceIds.has(x.id)) };
}

/** Actor-specific documentary evidence. Unknown time stays unplaced, never inferred from source creation. */
export function actorEvidenceAt(data: HistoricalDataset, actorId: string, day: string) {
  validateDataset(data);
  if (!data.actors.some(x=>x.id===actorId)) throw new Error(`Unknown actor: ${actorId}`);
  const parsed = new Date(`${day}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0,10) !== day) throw new Error('Query requires a Gregorian day, not an instant');
  const records = data.actor_epistemic_records.filter(x=>x.actor_id===actorId);
  return {
    actor_id: actorId, day,
    documented_before_day: records.filter(x=>typeof x.as_of.normalized_day==='string' && x.as_of.normalized_day < day),
    same_day_order_unknown: records.filter(x=>x.as_of.normalized_day===day),
    unplaced: records.filter(x=>typeof x.as_of.normalized_day!=='string'),
    conclusion: 'Documentary records only; no inference of truth, continued belief, access, or ignorance.',
  };
}

/** Stable project-scoped UUIDs, independent of URL changes. */
function uuid(projectId: string, key: string): string {
  const h = createHash('sha256').update(`${projectId}\0${key}`).digest('hex');
  return `${h.slice(0,8)}-${h.slice(8,12)}-5${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20,32)}`;
}

/**
 * Safe partial projection into current GROUND: source-document entities and
 * claims about their inspected content. Never project external historical events,
 * unknown applicability, actor knowledge, or QUALIFIES as canonical SUPPORTS.
 * Sidecar remains required for historical meaning; this is not a lossless import.
 */
export function projectSourceAssertions(data: HistoricalDataset, state: ProjectState, recordedAt: string): StatePatch {
  validateDataset(data);
  if (!/^\d{4}-\d{2}-\d{2}T/.test(recordedAt) || Number.isNaN(Date.parse(recordedAt))) throw new Error('recordedAt requires ISO timestamp');
  const projectId = state.project.id;
  const operations: PatchOperation[] = [];
  const stamps = { project_id:projectId, recorded_at:recordedAt, created_at:recordedAt, updated_at:recordedAt };
  for (const source of data.sources) {
    const entityId = uuid(projectId,source.id);
    const evidenceId = uuid(projectId,`evidence:${source.id}`);
    operations.push({op:'upsert',entity:'reality_entity',entity_id:entityId,payload:{
      id:entityId,project_id:projectId,kind:'document',label:source.title,
      attrs:{experimental_source_identity:source.id},created_at:recordedAt,updated_at:recordedAt,
    }});
    operations.push({op:'upsert',entity:'evidence',entity_id:evidenceId,payload:{
      ...stamps,id:evidenceId,kind:'external_ref',observation_id:null,
      external_ref:source.url,summary:`${source.inspection}; locator ${JSON.stringify(source.locator)}`,
      provenance:{kind:'document',entity_id:entityId,external_id:source.id,label:source.title},
    }});
  }
  for (const claim of data.claims) {
    const entityId = uuid(projectId,claim.source_id);
    const evidenceId = uuid(projectId,`evidence:${claim.source_id}`);
    const claimId = uuid(projectId,claim.id);
    const linkId = uuid(projectId,`link:${claim.id}`);
    operations.push({op:'upsert',entity:'claim',entity_id:claimId,payload:{
      ...stamps,id:claimId,subject_id:entityId,predicate_kind:'attribute',
      predicate:'inspected_source_assertion',
      value:{experimental_claim_id:claim.id,proposition:claim.object,predicate:claim.predicate,
        extraction_context:claim.extraction.context},
      provenance:{kind:'document',entity_id:entityId,external_id:claim.source_id},
      // Conservative epistemic estimate for TEXT attribution only, never for the historical proposition.
      confidence:0.95,
      // This projection's claim concerns the inspected text at ingestion, not its historical applicability.
      applicable_from:recordedAt,applicable_until:null,
    }});
    operations.push({op:'upsert',entity:'claim_evidence_link',entity_id:linkId,payload:{
      ...stamps,id:linkId,claim_id:claimId,evidence_id:evidenceId,relation:'SUPPORTS',
    }});
  }
  return {schema_version:SCHEMA_VERSION,project_id:projectId,source:'import',operations};
}
