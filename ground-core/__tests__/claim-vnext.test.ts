import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, rmSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { baseFixture, addClaim, assessment, addAssessment, admission, registerJSON, jsonBytes, TS } from './fixtures/claim-vnext.js';
import { assertState, normalizeForRead, getClaimAssessmentView, assessBeliefVNext, comparisonScope, getEvidenceForClaimVNext,
  inspectAssessmentReferences, FrozenArtifactRegistry, applyPatchVNext, createIsolatedStore, IsolatedProjectStore,
  sha256, assertTransition, SCHEMA_VERSION, isProposition, type ClaimProposition, type ProjectStateVNext, type AdmissionContext } from '../claim-vnext/index.js';
import { normalizeProjectState } from '../migrate.js';
import { saveProject as oldSave } from '../file-store.js';
import { validateProjectState } from '../validate.js';

const setup=()=>{const f=baseFixture(),a=addClaim(f);return {f,...a};};
const query=(s:ProjectStateVNext,c=s.claims[0]!,at=TS)=>assessBeliefVNext(s,comparisonScope(c),at);
function isolated<T>(fn:(store:IsolatedProjectStore,root:string)=>T):T {
  const root=mkdtempSync(join(tmpdir(),'semantic007-isolated-'));try{return fn(createIsolatedStore(root),root);}finally{rmSync(root,{recursive:true,force:true});}
}

test('FRUS86 stored excerpt origin, unassessed proposition and explicit Claim-Link-Evidence-Observation chain',()=>{
  const {f,state}=setup();assert.equal(f.inputRef.sha256,'43b917d9e171e08d53e2291da6bbca9ae2e079ff7f6339a3c04ceb17225b308f');
  assert.equal(state.claims.length,1);assert.equal('confidence' in state.claims[0]!,false);
  assert.equal('assessment_status' in state.claims[0]!,false);
  assert.equal(getClaimAssessmentView(state,f.claim.id).assessment_state,'UNASSESSED');
  const path=getEvidenceForClaimVNext(state,f.claim.id);assert.equal(path.supports[0]!.observation_id,f.observation);
  assert.equal(state.epistemic_observations[0]!.observed_at,null);
  assert.equal(query(state).status,'UNCONTESTED');assert.equal(query(state).unassessed_claim_count,1);
});

for(const confidence of [null,0,0.5,0.95])test(`new Claim rejects confidence=${confidence}`,()=>{
  const {state}=setup();(state.claims[0] as any).confidence=confidence;assert.throws(()=>assertState(state));
});
for(const name of ['subject_id','predicate_kind','predicate','value','manifestation_scope','applicable_from','applicable_until','provenance','recorded_at','created_at','updated_at'] as const)test(`Claim immutable ${name}`,()=>{
  const {state,context}=setup(),next=structuredClone(state),claim=next.claims[0] as ClaimProposition;
  const later='2026-09-18T00:00:00.000Z';
  switch(name) {
    case 'subject_id':claim.subject_id=null;claim.manifestation_scope={kind:'entity_only'};break;
    case 'predicate_kind':claim.predicate_kind='relation';break;
    case 'predicate':claim.predicate='another_predicate';break;
    case 'value':claim.value=false;break;
    case 'manifestation_scope':if(claim.manifestation_scope.kind==='frozen_artifact')claim.manifestation_scope.description='Another scope description';break;
    case 'applicable_from':claim.applicable_from=TS;break;
    case 'applicable_until':claim.applicable_until=TS;break;
    case 'provenance':claim.provenance.label='Another provenance label';break;
    case 'recorded_at':claim.recorded_at=later;break;
    case 'created_at':case 'updated_at':claim.created_at=later;claim.updated_at=later;break;
  }
  assertState(next); // Individually valid snapshots still cannot rewrite prior records.
  assert.throws(()=>assertTransition(state,next,context),/Claim immutable/);
});
test('Claim delete, duplicate insert and same-ID replacement fail',()=>{
  const {state,context,f}=setup();const gone=structuredClone(state);gone.claims=[];gone.claim_evidence_links=[];assert.throws(()=>assertTransition(state,gone,context));
  for(const value of [true,false])assert.throws(()=>applyPatchVNext(state,{schema_version:SCHEMA_VERSION,project_id:f.project,source:'manual',operations:[{op:'upsert',entity:'claim',entity_id:f.claim.id,payload:{...f.claim,value}}]},context));
});
test('selector zero/ambiguous/non-string, mismatched subject and missing scope fail',()=>{
  const f=baseFixture();for(const mutate of [(c:any)=>delete c.manifestation_scope,(c:any)=>c.manifestation_scope.selector.identity_value='missing',(c:any)=>c.manifestation_scope.selector.field_pointer='/locator',(c:any)=>c.manifestation_scope.source_entity_id=randomUUID()]) {
    const c=structuredClone(f.claim);mutate(c);assert.throws(()=>addClaim(f,f.initial,c));
  }
  const raw=JSON.parse(f.registry.read(f.inputRef).toString());raw.sources.push(raw.sources[0]);
  const dup=registerJSON(f.registry,'test:ambiguous-input',raw);const c=structuredClone(f.claim);if(c.manifestation_scope.kind==='frozen_artifact')c.manifestation_scope.artifact=dup.ref;
  assert.throws(()=>addClaim(f,f.initial,c,[f.link],dup.registry),/exactly one/);
});
test('frozen bytes and missing registry never fall back',()=>{
  const f=baseFixture(),c=structuredClone(f.claim);if(c.manifestation_scope.kind==='frozen_artifact')c.manifestation_scope.artifact.sha256='0'.repeat(64);
  assert.throws(()=>addClaim(f,f.initial,c),/integrity/);
  assert.throws(()=>addClaim(f,f.initial,f.claim,[f.link],new FrozenArtifactRegistry([])),/unavailable/);
});
test('Claim admission binds reviewed payload, links and exact before snapshot',()=>{
  const f=baseFixture();const ctx=admission(f,f.initial,f.claim,[f.link]);
  const patch={schema_version:SCHEMA_VERSION,project_id:f.project,source:'human_review' as const,operations:[{op:'upsert' as const,entity:'claim' as const,entity_id:f.claim.id,payload:f.claim}]};
  assert.throws(()=>applyPatchVNext(f.initial,patch,ctx),/link mismatch/);
  const changed=structuredClone(f.initial);changed.project.summary='different before';assert.throws(()=>applyPatchVNext(changed,{...patch,operations:[...patch.operations,{op:'upsert',entity:'claim_evidence_link',entity_id:f.link.id,payload:f.link}] as any},ctx),/stale/);
  assert.throws(()=>applyPatchVNext(f.initial,patch,{artifacts:f.registry}),/admission artifact/);
});
test('Assessment one then multiple, nullable time, no fusion, no representative confidence',()=>{
  const {f,state,context}=setup(),a=assessment(f,state,context.artifacts),one=addAssessment(state,a.record,a.context);
  const b=assessment(f,one,a.context.artifacts,0.75),two=addAssessment(one,b.record,b.context);
  assert.equal(two.claim_assessments.length,2);assert.equal(two.claim_assessments[0]!.assessed_at,null);assert.equal('updated_at' in two.claim_assessments[0]!,false);
  assert.deepEqual(two.claims,state.claims);const view=query(two);assert.equal(view.assessment_count,2);assert.equal(view.unassessed_claim_count,0);assert.equal(view.status,'UNCONTESTED');
  assert.deepEqual(view.per_claim_assessment_views[0]!.assessment_records.map(a=>a.result),[0.25,0.75]);
  assert.doesNotMatch(JSON.stringify(view),/mean_confidence|max_confidence|min_confidence|current_confidence|effective_confidence|leading_position/);
});
test('Assessment overwrite/delete/duplicate ID rejected',()=>{
  const {f,state,context}=setup(),a=assessment(f,state,context.artifacts),one=addAssessment(state,a.record,a.context);
  assert.throws(()=>addAssessment(one,a.record,a.context),/Duplicate/);
  for(const change of [(s:any)=>s.claim_assessments[0].result=0.9,(s:any)=>s.claim_assessments=[]]){const next=structuredClone(one);change(next);assert.throws(()=>assertTransition(one,next,a.context),/immutable/);}
});
for(const [label,mutate] of [
  ['assessor kind only',(a:any)=>a.assessor={kind:'human'}],
  ['assessor label only',(a:any)=>a.assessor={kind:'human',label:'Person'}],
  ['unnamespaced assessor',(a:any)=>a.assessor={kind:'system',external_id:'plain-name'}],
  ['missing assessor Entity',(a:any)=>a.assessor={kind:'human',entity_id:randomUUID()}],
  ['empty rationale',(a:any)=>a.rationale=''],['blank rationale',(a:any)=>a.rationale='  '],
  ['invalid result',(a:any)=>a.result=1.1],['null result',(a:any)=>a.result=null],
  ['missing Claim',(a:any)=>a.claim_id=randomUUID()],['wrong project',(a:any)=>a.project_id=randomUUID()],
  ['missing method',(a:any)=>a.method_ref.artifact.artifact_key='test:missing'],
  ['bad scale hash',(a:any)=>a.scale_ref.artifact.sha256='0'.repeat(64)],
  ['missing Evidence',(a:any)=>a.evidence_snapshot.evidence_ids=[randomUUID()]],
  ['missing Observation',(a:any)=>a.evidence_snapshot.observation_ids=[]],
  ['bad snapshot hash',(a:any)=>a.evidence_snapshot.project_snapshot.artifact.sha256='0'.repeat(64)],
  ['basis wrong schema',(a:any)=>a.evidence_snapshot.project_snapshot.stored_schema_version='0.0.0'],
] as const)test(`Assessment rejects ${label}`,()=>{
  const {f,state,context}=setup(),a=assessment(f,state,context.artifacts);mutate(a.record);assert.throws(()=>addAssessment(state,a.record,a.context));
});
test('assessment itself and changed Claim content cannot be the frozen basis',()=>{
  const {f,state,context}=setup(),a=assessment(f,state,context.artifacts);
  for(const change of [(s:any)=>s.claims[0].value=false,(s:any)=>s.claim_assessments.push(a.record)]) {
    const fake=structuredClone(state);change(fake);const reg=registerJSON(a.context.artifacts,`test:basis-${randomUUID()}`,fake);const r=structuredClone(a.record);r.evidence_snapshot.project_snapshot.artifact=reg.ref;
    assert.throws(()=>addAssessment(state,r,{artifacts:reg.registry}));
  }
});
test('broken assessment collection is never UNASSESSED; missing external basis keeps stored inventory',()=>{
  const {f,state,context}=setup();for(const missing of [undefined,null,{}]){const s=structuredClone(state);(s as any).claim_assessments=missing;assert.throws(()=>getClaimAssessmentView(s,f.claim.id));}
  const a=assessment(f,state,context.artifacts),one=addAssessment(state,a.record,a.context);
  const view=inspectAssessmentReferences(one,f.claim.id,new FrozenArtifactRegistry([]));assert.equal(view.assessment_count,1);assert.equal(view.assessment_state,'ASSESSMENTS_PRESENT');assert.equal(view.reference_resolution[0]!.status,'UNAVAILABLE_OR_INVALID');
});
test('conflict is independent of assessment and different frozen excerpts do not conflict',()=>{
  const {f,state,context}=setup();const negative={...structuredClone(f.claim),id:randomUUID(),value:false};
  const neg=addClaim(f,state,negative,[],context.artifacts);assert.equal(query(neg.state).status,'CONTESTED');assert.equal(query(neg.state).assessment_count,0);
  const a=assessment(f,neg.state,neg.context.artifacts,1),scored=addAssessment(neg.state,a.record,a.context);assert.equal(query(scored).status,'CONTESTED');assert.equal(query(scored).positions.length,2);
  const other={...structuredClone(f.claim),id:randomUUID(),value:false};
  if(other.manifestation_scope.kind==='frozen_artifact')other.manifestation_scope.selector.field_pointer='/purpose';
  const different=addClaim(f,state,other,[],context.artifacts);assert.equal(query(different.state).status,'UNCONTESTED');assert.equal(query(different.state,other).status,'UNCONTESTED');
});
test('artifact locator alias does not change scope; no byte-level equivalence is invented',()=>{
  const {f,state,context}=setup();const c={...structuredClone(f.claim),id:randomUUID()};const reg=context.artifacts.with('test:alias',f.registry.read(f.inputRef));
  if(c.manifestation_scope.kind==='frozen_artifact'){c.manifestation_scope.artifact.artifact_key='test:alias';c.manifestation_scope.description='same excerpt, another display label';}
  const next=addClaim(f,state,c,[],reg);assert.equal(query(next.state).positions.length,1);assert.equal(query(next.state).applicable_claims.length,2);
});
test('entity-only interval uses existing half-open and offset-aware temporal semantics',()=>{
  const f=baseFixture();const c={...f.claim,predicate:'condition',predicate_ref:f.def('test:entity-condition','/entity_predicate'),manifestation_scope:{kind:'entity_only' as const},applicable_from:'2026-09-17T09:00:00+09:00',applicable_until:'2026-09-17T01:00:00Z'};
  const a=addClaim(f,f.initial,c,[]);assert.equal(query(a.state,c,TS).status,'UNCONTESTED');assert.equal(query(a.state,c,'2026-09-17T01:00:00Z').status,'NO_CLAIMS');
  assert.throws(()=>query(a.state,c,'2026-09-17T00:00:60Z'),/timestamp|resolve/i);
});
test('legacy bytes stay unchanged, confidence retained, no invented assessment or scope',()=>{
  const bytes=readFileSync(new URL('../../fixtures/human-interface/human-001/project-state.json',import.meta.url));const raw=JSON.parse(bytes.toString()),state=normalizeForRead(raw),c=state.claims[0]!;
  assert.equal(isProposition(c),false);assert.equal(state.claim_assessments.length,0);assert.deepEqual(state.claims,raw.claims);
  const view=getClaimAssessmentView(state,c.id);assert.equal(view.assessment_state,'LEGACY_NUMERIC_PRESENT');assert.equal(view.legacy_numeric_confidence,0.95);assert.deepEqual(view.qualification,{method:'NOT_RECORDED',assessor:'NOT_RECORDED',calibration:'UNKNOWN'});
  assert.equal('manifestation_scope' in c,false);assert.deepEqual(bytes,readFileSync(new URL('../../fixtures/human-interface/human-001/project-state.json',import.meta.url)));
  const f=baseFixture(),a=assessment(f,state,f.registry);a.record.project_id=state.project.id;a.record.claim_id=c.id;assert.throws(()=>addAssessment(state,a.record,a.context));
});
test('old writer shapes and versions rejected; old reader fails rather than dropping vNext fields',()=>{
  const f=baseFixture();const {contract,predicate_ref,manifestation_scope,...old}=f.claim;
  const patch:any={schema_version:SCHEMA_VERSION,project_id:f.project,source:'manual',operations:[{op:'upsert',entity:'claim',entity_id:f.claim.id,payload:{...old,confidence:0.95}}]};
  assert.throws(()=>applyPatchVNext(f.initial,patch,{artifacts:f.registry}),/Legacy/);patch.schema_version='0.1.25';assert.throws(()=>applyPatchVNext(f.initial,patch,{artifacts:f.registry}),/unsupported writer/);
  assert.equal(validateProjectState(f.initial).valid,false);assert.throws(()=>normalizeProjectState(f.initial),/Unsupported/);
  isolated((_store,root)=>assert.throws(()=>oldSave(f.initial as any,{storageDir:root}),/Unsupported/));
});
test('vNext isolated save/load exact-byte stability, independent read, archive and direct-save guard',()=>isolated((store,root)=>{
  const f=baseFixture();store.initialize(f.legacy);const first=store.loadProjectSnapshot(f.project),a=addClaim(f,first.state);
  const saved=store.saveProject(a.state,first.fingerprint,a.context);assert.deepEqual(saved.state,a.state);
  assert.equal(new IsolatedProjectStore(root).loadProjectSnapshot(f.project).fingerprint,saved.fingerprint);
  const b=assessment(f,saved.state,a.context.artifacts);const two=addAssessment(saved.state,b.record,b.context);const saved2=store.saveProject(two,saved.fingerprint,b.context);
  const reopened=new IsolatedProjectStore(root);assert.deepEqual(reopened.loadProjectSnapshot(f.project).state,two);
  assert.equal(inspectAssessmentReferences(two,f.claim.id,reopened.artifactRegistry()).reference_resolution[0]!.status,'RESOLVED');
  const altered=structuredClone(two);(altered.claims[0] as ClaimProposition).value=false;
  assert.throws(()=>store.saveProject(altered,saved2.fingerprint,b.context),/immutable/);
  assert.throws(()=>store.saveProject(two,first.fingerprint,b.context),/precondition/);
  assert.equal(store.loadProjectSnapshot(f.project).fingerprint,saved2.fingerprint);assert.equal(readdirSync(root).some(n=>n.endsWith('.tmp')),false);
}));
test('durable request identity separates same-payload retry from reevaluation and changed payload',()=>isolated((store,root)=>{
  const f=baseFixture();store.initialize(f.legacy);const before=store.loadProjectSnapshot(f.project),c=addClaim(f,before.state);store.saveProject(c.state,before.fingerprint,c.context);
  const at=store.loadProjectSnapshot(f.project),a=assessment(f,at.state,c.context.artifacts);store.publishAssessment(f.project,'request:one',a.record,a.context,at.fingerprint);
  const once=store.loadProjectSnapshot(f.project);assert.deepEqual(new IsolatedProjectStore(root).publishAssessment(f.project,'request:one',a.record,a.context,at.fingerprint),a.record);
  assert.equal(store.loadProjectSnapshot(f.project).fingerprint,once.fingerprint);
  assert.throws(()=>store.publishAssessment(f.project,'request:one',{...a.record,result:0.75},a.context,once.fingerprint),/payload mismatch/);
  assert.throws(()=>store.publishAssessment(f.project,'request:two',a.record,a.context,once.fingerprint),/reused/);
  const b=assessment(f,once.state,a.context.artifacts,0.25);store.publishAssessment(f.project,'request:two',b.record,b.context,once.fingerprint);assert.equal(store.loadProjectSnapshot(f.project).state.claim_assessments.length,2);
}));
test('legacy roundtrip is isolated only; no implicit initialization of existing storage',()=>isolated((store,root)=>{
  const bytes=readFileSync(new URL('../../fixtures/human-interface/human-001/project-state.json',import.meta.url)),raw=JSON.parse(bytes.toString());
  store.initialize(raw);assert.deepEqual(store.loadProjectSnapshot(raw.project.id).state.claims,raw.claims);assert.throws(()=>createIsolatedStore(root),/empty root/);assert.throws(()=>store.initialize(raw),/already/);
}));

test('definition id/version cannot be rebound across assessments',()=>{
  const {f,state,context}=setup(),a=assessment(f,state,context.artifacts),one=addAssessment(state,a.record,a.context);
  const b=assessment(f,one,a.context.artifacts);b.record.method_ref.artifact.sha256='a'.repeat(64);
  const next=structuredClone(one);next.claim_assessments.push(b.record);assert.throws(()=>assertState(next),/rebinding/);
});
for(const [name,mutate] of Object.entries({
  'scale range':(d:any):void=>{d.scale.maximum=100;},
  'scale interpretation':(d:any):void=>{d.scale.interpretation='';},
  'method purpose':(d:any):void=>{d.method.purpose='another_purpose';},
  'method scale identity':(d:any):void=>{d.method.allowed_scales[0].id='test:another-scale';},
  'procedure missing':(d:any):void=>{d.method.procedure='';},
  'known action time required':(d:any):void=>{d.method.input_requirements.known_assessed_at_required=true;},
  'review artifact required':(d:any):void=>{d.method.input_requirements.review_artifact_required=true;},
  'rationale artifact required':(d:any):void=>{d.method.input_requirements.rationale_artifact_required=true;},
  'declared qualification without basis':(d:any):void=>{d.qualification.qualification='declared_with_basis';},
}))test(`method/scale/qualification admission rejects ${name}`,()=>{
  const {f,state,context}=setup(),a=assessment(f,state,context.artifacts);
  const defs=context.artifacts.json(f.def('test:declared-estimate','/method').artifact) as any;mutate(defs);
  const changed=registerJSON(a.context.artifacts,'test:changed-definitions',defs);
  for(const ref of [a.record.method_ref,a.record.scale_ref,a.record.calibration_qualification])ref.artifact=changed.ref;
  assert.throws(()=>addAssessment(state,a.record,{artifacts:changed.registry}));
});
test('Belief retains explicit supporting and contradicting Evidence without changing position or score',()=>{
  const {f,state,context}=setup();const link={...f.link,id:randomUUID(),relation:'CONTRADICTS' as const};
  const next=applyPatchVNext(state,{schema_version:SCHEMA_VERSION,project_id:f.project,source:'manual',operations:[{op:'upsert',entity:'claim_evidence_link',entity_id:link.id,payload:link}]},context);
  const belief=query(next);assert.equal(belief.status,'UNCONTESTED');assert.equal(belief.positions[0]!.has_evidence_tension,true);
  assert.equal(belief.positions[0]!.supporting_evidence.length,1);assert.equal(belief.positions[0]!.contradicting_evidence.length,1);assert.equal(belief.assessment_count,0);
});
test('admission review and request binding survive independent isolated read',()=>isolated((store,root)=>{
  const f=baseFixture();store.initialize(f.legacy);const before=store.loadProjectSnapshot(f.project),c=addClaim(f,before.state);store.saveProject(c.state,before.fingerprint,c.context);
  const reader=new IsolatedProjectStore(root),bindings=reader.admissionBindings();assert.equal(bindings.length,1);
  assert.equal(bindings[0]!.request_identity,f.claim.provenance.external_id);
  const artifact=reader.artifactRegistry().json(bindings[0]!.artifact) as any;assert.deepEqual(artifact.candidate_claim,f.claim);
  assert.equal(artifact.approval.result,'APPROVED');assert.equal(reader.loadProjectSnapshot(f.project).state.claim_assessments.length,0);
}));
test('direct snapshot save also rejects unresolved new Assessment references before bytes change',()=>isolated((store)=>{
  const f=baseFixture();store.initialize(f.legacy);const before=store.loadProjectSnapshot(f.project),c=addClaim(f,before.state);store.saveProject(c.state,before.fingerprint,c.context);
  const at=store.loadProjectSnapshot(f.project),a=assessment(f,at.state,c.context.artifacts),next=structuredClone(at.state);a.record.scale_ref.artifact.sha256='a'.repeat(64);next.claim_assessments.push(a.record);
  assert.throws(()=>store.saveProject(next,at.fingerprint,a.context));assert.equal(store.loadProjectSnapshot(f.project).fingerprint,at.fingerprint);
}));
test('isolated writer refuses concurrent owner and preserves the existing lock',()=>isolated((store,root)=>{
  const f=baseFixture();store.initialize(f.legacy);const before=store.loadProjectSnapshot(f.project);writeFileSync(join(root,'writer.lock'),'existing owner');
  assert.throws(()=>store.saveProject(before.state,before.fingerprint,{artifacts:f.registry}),/EEXIST/);assert.equal(readFileSync(join(root,'writer.lock'),'utf8'),'existing owner');
}));
