import AjvImport from 'ajv/dist/2020.js';
import addFormatsImport from 'ajv-formats';
import { readFileSync } from 'node:fs';
import { ValidationError } from '../errors.js';
import { normalizeProjectState } from '../migrate.js';
import { canonicalValueKey } from '../reality/semantic-equality.js';
import { isProposition, SCHEMA_VERSION, type DefinitionRef, type ProjectStateVNext } from './types.js';

// Same CJS/ESM interop convention as the stable validator.
const Ajv = (AjvImport as unknown as {default?: typeof AjvImport}).default ?? AjvImport;
const formats = (addFormatsImport as unknown as {default?: typeof addFormatsImport}).default ?? addFormatsImport;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ajv = new (Ajv as any)({allErrors:true,strict:false});
(formats as any)(ajv);
export const projectSchema = JSON.parse(readFileSync(new URL('../../docs/schemas/ground-core-project-state.v0.1.26.schema.json', import.meta.url),'utf8'));
// Relative to ground-core/claim-vnext, schemas are at repository/docs.
export const validateShape = ajv.compile(projectSchema);
export const validatePatchShape = ajv.compile(JSON.parse(readFileSync(new URL('../../docs/schemas/ground-core-state-patch.v0.1.26.schema.json', import.meta.url),'utf8')));
export function requireCondition(condition: unknown, message: string): asserts condition {
  if (!condition) throw new ValidationError(message);
}
export const equal = (a: unknown,b: unknown) => canonicalValueKey(a) === canonicalValueKey(b);
export function assertState(value: unknown): asserts value is ProjectStateVNext {
  requireCondition(validateShape(value), `Invalid vNext ProjectState: ${ajv.errorsText(validateShape.errors)}`);
  const s=value as ProjectStateVNext, project=s.project.id;
  const scoped = (items: Array<{id:string;project_id:string}>, name:string) => {
    requireCondition(new Set(items.map(x=>x.id)).size===items.length, `Duplicate ${name} ID`);
    requireCondition(items.every(x=>x.project_id===project), `${name} project mismatch`);
  };
  for (const k of ['claims','claim_assessments','claim_evidence_links','evidence','epistemic_observations','reality_entities'] as const) scoped(s[k],k);
  const entities=new Set(s.reality_entities.map(x=>x.id));
  const observations=new Set(s.epistemic_observations.map(x=>x.id));
  const evidence=new Set(s.evidence.map(x=>x.id));
  const claims=new Map(s.claims.map(x=>[x.id,x]));
  for (const o of s.epistemic_observations) requireCondition(o.subject_ids.every(id=>entities.has(id)), 'Missing Observation subject');
  for (const e of s.evidence) requireCondition(e.kind!=='observation_ref'||observations.has(e.observation_id!), 'Missing Evidence Observation');
  for (const c of s.claims) {
    requireCondition(c.subject_id===null||entities.has(c.subject_id),'Missing Claim subject');
    requireCondition(!c.provenance.entity_id||entities.has(c.provenance.entity_id),'Missing Claim provenance Entity');
    if (isProposition(c)) {
      requireCondition(c.created_at===c.updated_at,'Immutable Claim timestamp mismatch');
      requireCondition(c.manifestation_scope.kind!=='frozen_artifact'||c.manifestation_scope.source_entity_id===c.subject_id,'Frozen scope subject mismatch');
    }
  }
  for (const l of s.claim_evidence_links) requireCondition(claims.has(l.claim_id)&&evidence.has(l.evidence_id),'Missing ClaimEvidenceLink target');
  // Reusing a definition id/version cannot silently change its pinned definition.
  const definitions=new Map<string,string>();
  const pinned=(ref:DefinitionRef)=>{
    const key=JSON.stringify([ref.id,ref.version]);
    const identity=JSON.stringify([ref.artifact.sha256,ref.pointer]);
    requireCondition(!definitions.has(key)||definitions.get(key)===identity,'Definition id/version rebinding');
    definitions.set(key,identity);
  };
  s.claims.filter(isProposition).forEach(c=>pinned(c.predicate_ref));
  for (const a of s.claim_assessments) {
    [a.method_ref,a.scale_ref,a.calibration_qualification].forEach(pinned);
    const c=claims.get(a.claim_id);
    requireCondition(c&&isProposition(c),'Assessment requires immutable vNext Claim');
    requireCondition(!a.assessor.entity_id||entities.has(a.assessor.entity_id),'Missing assessor Entity');
    requireCondition(Number.isFinite(a.result),'Nonfinite assessment result');
    requireCondition(a.evidence_snapshot.project_snapshot.project_id===project,'Basis Project mismatch');
  }
}
/** Read normalization only; never authorizes a save or manufactures an assessment. */
export function normalizeForRead(raw: unknown): ProjectStateVNext {
  if ((raw as {schema_version?:string})?.schema_version===SCHEMA_VERSION) {assertState(raw);return structuredClone(raw);}
  const old=normalizeProjectState(raw);
  const next={...old,schema_version:SCHEMA_VERSION,claim_assessments:[]} as ProjectStateVNext;
  assertState(next);return next;
}
export function validateValue(schema: unknown,value: unknown): boolean {
  return Boolean(ajv.compile(schema)(value));
}

// Operations review artifact, deliberately outside ProjectState and ClaimAssessment.
const ref=(name:string)=>({$ref:`#/$defs/${name}`});
const nonblank={type:'string',pattern:'\\S'};
const ids={type:'array',items:ref('uuid'),uniqueItems:true};
const admissionProperties={
  format:{const:'claim-admission.v1'},project_id:ref('uuid'),
  input_project_snapshot:{type:'object',additionalProperties:false,required:['artifact','stored_schema_version'],properties:{artifact:ref('artifact_ref'),stored_schema_version:{type:'string',minLength:1}}},
  candidate_claim:ref('claim_proposition'),proposed_links:{type:'array',items:ref('claim_evidence_link')},
  predicate_definition:ref('definition_ref'),manifestation_scope:ref('manifestation_scope'),
  source_observation_ids:ids,source_evidence_ids:ids,frozen_inputs:{type:'array',items:ref('artifact_ref')},
  transformation_rationale:nonblank,preserved_limitations:{type:'array',minItems:1,items:nonblank},
  reviewer:ref('assessor'),review_process:ref('definition_ref'),
  approval:{type:'object',additionalProperties:false,required:['result','reviewed_at'],properties:{result:{enum:['APPROVED','REJECTED']},reviewed_at:{anyOf:[ref('timestamp'),{type:'null'}]}}},
};
export const validateAdmissionShape=ajv.compile({$defs:projectSchema.$defs,type:'object',additionalProperties:false,required:Object.keys(admissionProperties),properties:admissionProperties});
