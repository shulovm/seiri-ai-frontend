/** Isolated test identities and declared test assessments, never live admission. */
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { createEmptyProject } from '../../state-engine.js';
import type { ProjectState, ClaimEvidenceLink } from '../../types.js';
import { normalizeForRead, SCHEMA_VERSION, FrozenArtifactRegistry, sha256, applyPatchVNext,
  type ClaimProposition, type ProjectStateVNext, type ClaimAssessment, type DefinitionRef, type AdmissionContext } from '../../claim-vnext/index.js';

const sourceURL=new URL('../../../fixtures/human-interface/provenance/historical-round1-v1/005/selected-c86-request.json',import.meta.url);
const defsURL=new URL('../../../fixtures/claim-vnext/definitions.json',import.meta.url);
export const TS='2026-09-17T00:00:00.000Z';
export const jsonBytes=(v:unknown)=>Buffer.from(JSON.stringify(v,null,2)+'\n');
export function registerJSON(registry:FrozenArtifactRegistry,key:string,value:unknown) {
  const bytes=jsonBytes(value);return {registry:registry.with(key,bytes),ref:{artifact_key:key,sha256:sha256(bytes)}};
}
export function snapshotRef(registry:FrozenArtifactRegistry,s:ProjectStateVNext) {
  return registerJSON(registry,`test:snapshot-${sha256(jsonBytes(s))}`,s);
}
export function baseFixture() {
  const input=readFileSync(sourceURL),defs=readFileSync(defsURL);
  const source=JSON.parse(input.toString()).sources[0];
  const manifest=JSON.parse(readFileSync(new URL('../../../fixtures/human-interface/provenance/historical-round1-v1/005/selection-manifest.json',import.meta.url),'utf8'));
  const content=manifest.groups.flatMap((g:any)=>g.reports).find((r:any)=>r.report_id==='c86-request').content;
  const legacy=createEmptyProject({title:'SEMANTIC-007 isolated test only',summary:'Contract fixture, not canonical live Historical Reality.'});
  const project=legacy.project.id,entity=randomUUID(),observation=randomUUID(),evidence=randomUUID();
  const stamps={project_id:project,created_at:TS,updated_at:TS,recorded_at:TS};
  legacy.reality_entities.push({id:entity,project_id:project,kind:'document',label:source.title,attrs:{source_id:source.id,url:source.url,locator:source.locator},created_at:TS,updated_at:TS});
  const provenance={kind:'document' as const,external_id:'round1.dataset.json#claims/c86-request',label:'Stored Historical Round1 inspection report; researcher-authored paraphrase'};
  legacy.epistemic_observations.push({...stamps,id:observation,kind:'textual',content,subject_ids:[entity],observed_at:null,provenance});
  legacy.evidence.push({...stamps,id:evidence,kind:'observation_ref',observation_id:observation,external_ref:null,summary:'Reference to the recorded document-inspection result.',provenance});
  const inputRef={artifact_key:'test:frus86-selected',sha256:sha256(input)},defsRef={artifact_key:'test:definitions-v1',sha256:sha256(defs)};
  const registry=new FrozenArtifactRegistry([[inputRef.artifact_key,input],[defsRef.artifact_key,defs]]);
  const def=(id:string,pointer:string):DefinitionRef=>({id,version:'1',artifact:defsRef,pointer});
  const initial=normalizeForRead(legacy);
  const claimId=randomUUID();
  const claim:ClaimProposition={...stamps,id:claimId,contract:'claim-proposition.v1',subject_id:entity,predicate_kind:'attribute',predicate:'contains_request_to_respect_chinese_neutrality_and_administrative_entity',predicate_ref:def('test:excerpt-request','/predicate'),value:true,
    manifestation_scope:{kind:'frozen_artifact',representation_kind:'stored_inspection_excerpt',source_entity_id:entity,artifact:inputRef,selector:{collection_pointer:'/sources',identity_field:'id',identity_value:'frus:1904:86',field_pointer:'/excerpt'},description:'TEST: stored inspection excerpt only, not the public source or historical truth.'},applicable_from:null,applicable_until:null,provenance:{kind:'system',external_id:`test:admission-${claimId}`,label:'Isolated scripted review only'}};
  const link:ClaimEvidenceLink={...stamps,id:randomUUID(),claim_id:claim.id,evidence_id:evidence,relation:'SUPPORTS'};
  return {legacy,initial,claim,link,registry,def,inputRef,project,entity,observation,evidence};
}
export function admission(f:ReturnType<typeof baseFixture>,before:ProjectStateVNext,c:ClaimProposition,links:ClaimEvidenceLink[],registry=f.registry) {
  const snap=snapshotRef(registry,before);
  const artifact={format:'claim-admission.v1',project_id:before.project.id,input_project_snapshot:{artifact:snap.ref,stored_schema_version:before.schema_version},candidate_claim:c,proposed_links:links,predicate_definition:c.predicate_ref,manifestation_scope:c.manifestation_scope,source_observation_ids:[f.observation],source_evidence_ids:[f.evidence],frozen_inputs:[f.inputRef],transformation_rationale:'TEST ONLY: scoped proposition about stored excerpt; no live review or confidence assessment.',preserved_limitations:['No public-source or historical truth assertion'],reviewer:{kind:'system',external_id:'test:reviewer'},review_process:f.def('test:admission-review','/review_process'),approval:{result:'APPROVED',reviewed_at:TS}};
  const registered=registerJSON(snap.registry,`test:admission-${c.id}`,artifact);
  return {artifacts:registered.registry,claim_admissions:{[c.id]:registered.ref}} satisfies AdmissionContext;
}
export function addClaim(f:ReturnType<typeof baseFixture>,before=f.initial,c=f.claim,links=[f.link],registry=f.registry) {
  c={...c,provenance:{...c.provenance,external_id:`test:admission-${c.id}`}};
  const context=admission(f,before,c,links,registry);
  const state=applyPatchVNext(before,{schema_version:SCHEMA_VERSION,project_id:before.project.id,source:'human_review',operations:[{op:'upsert',entity:'claim',entity_id:c.id,payload:c},...links.map(l=>({op:'upsert' as const,entity:'claim_evidence_link' as const,entity_id:l.id,payload:l}))]},context);
  return {state,context};
}
export function assessment(f:ReturnType<typeof baseFixture>,state:ProjectStateVNext,registry:FrozenArtifactRegistry,score=0.25) {
  const snap=snapshotRef(registry,state);
  const record:ClaimAssessment={id:randomUUID(),project_id:f.project,claim_id:f.claim.id,assessor:{kind:'system',external_id:'test:assessor-v1'},purpose:'proposition_epistemic_assessment',method_ref:f.def('test:declared-estimate','/method'),scale_ref:f.def('test:unit-scale','/scale'),result:score,calibration_qualification:f.def('test:uncalibrated','/qualification'),evidence_snapshot:{project_snapshot:{project_id:f.project,stored_schema_version:state.schema_version,artifact:snap.ref},evidence_ids:[f.evidence],observation_ids:[f.observation],frozen_inputs:[f.inputRef],review_artifacts:[]},rationale:'TEST ONLY numeric declaration for contract verification; not a historical confidence assessment.',assessed_at:null,recorded_at:TS,created_at:TS};
  return {record,context:{artifacts:snap.registry} satisfies AdmissionContext};
}
export function addAssessment(state:ProjectStateVNext,record:ClaimAssessment,context:AdmissionContext) {
  return applyPatchVNext(state,{schema_version:SCHEMA_VERSION,project_id:state.project.id,source:'human_review',operations:[{op:'upsert',entity:'claim_assessment',entity_id:record.id,payload:record}]},context);
}
