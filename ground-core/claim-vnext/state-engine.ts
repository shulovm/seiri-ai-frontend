import { assertState, requireCondition as check, equal, validatePatchShape, projectSchema, validateValue, normalizeForRead, validateAdmissionShape } from './validation.js';
import { FrozenArtifactRegistry, admitClaim, admitAssessment, definition } from './artifacts.js';
import { isProposition, type ProjectStateVNext, type StatePatchVNext, type ArtifactRef } from './types.js';
import { compareTemporalInstants, resolveTemporalInstant } from '../temporal.js';

export interface AdmissionContext {
  artifacts: FrozenArtifactRegistry;
  claim_admissions?: Readonly<Record<string,ArtifactRef>>;
}
/** Before/after verification is shared by mutation and direct persistence. */
export function assertTransition(before:ProjectStateVNext,after:ProjectStateVNext,context:AdmissionContext):void {
  assertState(before);assertState(after);
  const base=(s:ProjectStateVNext)=>{const {claims,claim_assessments,claim_evidence_links,updated_at,project,...rest}=s;return {...rest,project:{...project,updated_at:null}};};
  check(equal(base(before),base(after)),'Isolated writer cannot mutate unrelated canonical records');
  const added=<T extends {id:string}>(old:T[],next:T[],name:string):T[]=>{
    for(const record of old)check(equal(record,next.find(x=>x.id===record.id)),`${name} immutable: update/delete/ID reuse rejected`);
    return next.filter(x=>!old.some(y=>y.id===x.id));
  };
  const claims=added(before.claims,after.claims,'Claim');
  const assessments=added(before.claim_assessments,after.claim_assessments,'ClaimAssessment');
  const links=added(before.claim_evidence_links,after.claim_evidence_links,'ClaimEvidenceLink');
  for(const c of claims) {
    check(isProposition(c),'Legacy Claim creation is forbidden');
    if(c.applicable_from!==null&&c.applicable_until!==null&&resolveTemporalInstant(c.applicable_from).status==='RESOLVED'&&resolveTemporalInstant(c.applicable_until).status==='RESOLVED')check(compareTemporalInstants(c.applicable_from,c.applicable_until)<=0,'Invalid applicability interval');
    admitClaim(c,context.artifacts);
    const ref=context.claim_admissions?.[c.id];check(ref,'Claim admission artifact required');
    const a=context.artifacts.json(ref) as Record<string,any>;
    check(validateAdmissionShape(a),'Invalid admission artifact shape');
    check(typeof c.provenance.external_id==='string'&&/^[A-Za-z][A-Za-z0-9._-]*:[^\s]+$/.test(c.provenance.external_id),'Stable admission request identity required');
    check(after.claims.filter(x=>isProposition(x)&&x.provenance.external_id===c.provenance.external_id).length===1,'Admission request identity reused');
    check(a.format==='claim-admission.v1'&&a.project_id===after.project.id&&equal(a.candidate_claim,c),'Admission candidate mismatch');
    check(a.approval?.result==='APPROVED'&&a.transformation_rationale?.trim()&&Array.isArray(a.preserved_limitations)&&a.preserved_limitations.length>0,'Claim admission not approved');
    check(validateValue({$defs:projectSchema.$defs,$ref:'#/$defs/assessor'},a.reviewer),'Invalid admission reviewer');
    check(!a.reviewer.entity_id||before.reality_entities.some(e=>e.id===a.reviewer.entity_id),'Admission reviewer Entity missing');
    const process=definition(context.artifacts,a.review_process);
    check(typeof process.procedure==='string'&&process.procedure.trim().length>0,'Review process procedure required');
    check(equal(a.manifestation_scope,c.manifestation_scope)&&equal(a.predicate_definition,c.predicate_ref),'Admission semantic scope mismatch');
    const basis=context.artifacts.json(a.input_project_snapshot.artifact) as {schema_version:string};
    check(basis.schema_version===a.input_project_snapshot.stored_schema_version&&equal(normalizeForRead(basis),before),'Admission stale snapshot');
    check(equal(a.proposed_links,links.filter(x=>x.claim_id===c.id)),'Admission link mismatch');
    check(Array.isArray(a.source_observation_ids)&&a.source_observation_ids.every((id:string)=>before.epistemic_observations.some(o=>o.id===id)),'Admission Observation missing');
    check(Array.isArray(a.source_evidence_ids)&&a.source_evidence_ids.every((id:string)=>before.evidence.some(e=>e.id===id)),'Admission Evidence missing');
    check(Array.isArray(a.frozen_inputs),'Admission input list missing');
    a.frozen_inputs.forEach((r:ArtifactRef)=>context.artifacts.read(r));
  }
  for(const a of assessments) {
    check(before.claims.some(c=>c.id===a.claim_id&&isProposition(c)),'Assessment target must be previously admitted');
    admitAssessment(a,after,context.artifacts);
  }
}
/** Insert-only interpretation of upsert; existing IDs always fail, even identical payloads. */
export function applyPatchVNext(before:ProjectStateVNext,patch:StatePatchVNext,context:AdmissionContext):ProjectStateVNext {
  assertState(before);check(validatePatchShape(patch),'Invalid vNext patch / unsupported writer');
  check(patch.project_id===before.project.id,'Patch Project mismatch');
  const next=structuredClone(before);
  for(const operation of patch.operations) {
    check(operation.payload.id===operation.entity_id,'Patch payload ID mismatch');
    const key={claim:'claims',claim_assessment:'claim_assessments',claim_evidence_link:'claim_evidence_links'}[operation.entity] as 'claims'|'claim_assessments'|'claim_evidence_links';
    const list=next[key] as Array<{id:string}>;
    check(!list.some(x=>x.id===operation.entity_id),'Duplicate ID / immutable record');list.push(structuredClone(operation.payload));
  }
  next.updated_at=new Date().toISOString();next.project.updated_at=next.updated_at;
  assertTransition(before,next,context);return next;
}
