import test from "node:test";
import assert from "node:assert/strict";
import { createEmptyProject, applyPatch } from "../state-engine.js";
import { validateProjectState } from "../validate.js";
import { PatchError, ValidationError } from "../errors.js";
import { getRealityStatesAt } from "../reality/worldline.js";
import { temporalInstantKey, TemporalResolutionError } from "../temporal.js";
import { assessAdmissionTemporalRelation, assessTemporalPrerequisite, haveVerifiedEqualValues } from "../temporal-admission.js";
import type { ProjectState, StatePatch } from "../types.js";
const at="2026-09-05T00:30:00Z", leap="2026-09-05T23:59:60Z";
function fixture(from="2026-09-05T09:00:00+09:00",until:string|null="2026-09-05T01:00:00Z") {
  const p=createEmptyProject({title:"Temporal admission",summary:"before"});
  const id="c1010101-0101-4101-8101-010101010101";
  p.reality_entities.push({id,project_id:p.project.id,kind:"asset",label:"test",created_at:at,updated_at:at});
  const s={id:"c3030303-0303-4303-8303-030303030301",project_id:p.project.id,subject_id:id,kind:"condition",value:"normal",valid_from:from,valid_until:until,recorded_at:at,created_at:at,updated_at:at};
  p.reality_states.push(s);return {p,s,id};
}
function unrelated(p:ProjectState):StatePatch {return {schema_version:"0.1.24",project_id:p.project.id,source:"manual",operations:[{op:"upsert",entity:"current_state",entity_id:p.current_state.id,payload:{summary:"after"}}]};}
test("pre-existing unresolved interval does not block unrelated patch or imply verification",()=>{
  const {p,s,id}=fixture(leap,"2026-09-06T00:00:00Z"),before=JSON.stringify(p);
  const next=applyPatch(p,unrelated(p));
  assert.equal(next.current_state.summary,"after");assert.equal(next.reality_states[0]!.valid_from,leap);
  assert.equal(assessAdmissionTemporalRelation(s.valid_from,s.valid_until!,"<").status,"UNRESOLVED");
  assert.throws(()=>getRealityStatesAt(next,id,at),TemporalResolutionError);
  assert.throws(()=>temporalInstantKey(next.reality_states[0]!.valid_from),TemporalResolutionError);
  assert.equal(JSON.stringify(p),before);
});
for(const[from,until]of [["2026-09-05T09:00:00+09:00","2026-09-05T01:00:00Z"],["2026-09-05T00:00:00Z","2026-09-05T10:00:00+09:00"],["2026-09-05T00:00:00.123456789123456788Z","2026-09-05T00:00:00.123456789123456789Z"]]) test(`resolvable valid period accepted: ${from}`,()=>{
 const {p}=fixture(from,until);const next=applyPatch(p,unrelated(p));
 assert.equal(next.reality_states[0]!.valid_from,from);assert.equal(next.reality_states[0]!.valid_until,until);
});
for(const[from,until]of [["2026-09-05T01:00:00Z","2026-09-05T09:00:00+09:00"],["2026-09-05T00:00:00.123456789123456789Z","2026-09-05T00:00:00.123456789123456788Z"]]) test(`proven reversed period rejected: ${from}`,()=>{
 const {p}=fixture(from,until);assert.throws(()=>applyPatch(p,unrelated(p)),(e:unknown)=>e instanceof PatchError&&/valid_until before valid_from/.test(e.message));
});
test("existing inclusive zero-length storage invariant is preserved",()=>{
 const {p}=fixture("2026-09-05T09:00:00+09:00","2026-09-05T00:00:00Z");assert.equal(applyPatch(p,unrelated(p)).current_state.summary,"after");
});
test("temporal field update to schema-valid unresolved value persists exactly",()=>{
 const {p,s,id}=fixture(); const next=applyPatch(p,{...unrelated(p),operations:[{op:"upsert",entity:"reality_state",entity_id:s.id,payload:{valid_from:leap}}]});
 assert.equal(validateProjectState(next).valid,true);assert.equal(next.reality_states[0]!.valid_from,leap);
 assert.throws(()=>getRealityStatesAt(next,id,at),TemporalResolutionError);
});
test("creation of unresolved temporal declaration is allowed without temporal identity",()=>{
 const {p,s}=fixture(leap,"2026-09-06T00:01:00Z");p.reality_states=[];
 const next=applyPatch(p,{...unrelated(p),operations:[{op:"upsert",entity:"reality_state",entity_id:s.id,payload:s}]});
 assert.equal(next.reality_states.length,1);assert.throws(()=>temporalInstantKey(next.reality_states[0]!.valid_from),TemporalResolutionError);
});
for(const value of ["not-a-timestamp","2026-09-05T99:99:00Z"]) test(`schema-invalid temporal patch still rejected: ${value}`,()=>{
 const {p,s}=fixture();assert.throws(()=>applyPatch(p,{...unrelated(p),operations:[{op:"upsert",entity:"reality_state",entity_id:s.id,payload:{valid_from:value}}]}));
});
test("unresolved operand cannot hide invalid syntax in the other operand at final schema validation",()=>{
 const {p}=fixture(leap,"invalid");assert.throws(()=>applyPatch(p,unrelated(p)));
});
test("unresolved declaration does not disable other whole-project invariants",()=>{
 const {p}=fixture(leap,null);p.reality_states.push({...p.reality_states[0]!});
 assert.throws(()=>applyPatch(p,unrelated(p)),PatchError);
});
test("independent violated interval still rejects alongside an unresolved interval",()=>{
 const {p,s}=fixture(leap,null);p.reality_states.push({...s,id:"c3030303-0303-4303-8303-030303030302",valid_from:"2026-09-05T02:00:00Z",valid_until:"2026-09-05T01:00:00Z"});
 assert.throws(()=>applyPatch(p,unrelated(p)),/valid_until before valid_from/);
});
test("admission result distinguishes verified true, verified false and unresolved",()=>{
 assert.deepEqual(assessAdmissionTemporalRelation(at,at,"==="),{status:"VERIFIED",value:true});
 assert.deepEqual(assessAdmissionTemporalRelation(at,at,"<"),{status:"VERIFIED",value:false});
 const unresolved=assessAdmissionTemporalRelation(leap,at,"<");assert.equal(unresolved.status,"UNRESOLVED");
 assert.ok(!("value" in unresolved));
 if(unresolved.status==="UNRESOLVED"){assert.equal(unresolved.error.declaration,leap);assert.equal(unresolved.error.reason,"LEAP_SECOND_AUTHORITY_NOT_AVAILABLE");}
});
test("unresolved strict identity is retained as non-resolution, never compared equal via absent values",()=>{
 const a=assessTemporalPrerequisite(()=>temporalInstantKey(leap));
 assert.equal(haveVerifiedEqualValues(a,a),false);
 assert.equal(haveVerifiedEqualValues(assessTemporalPrerequisite(()=>temporalInstantKey(at)),assessTemporalPrerequisite(()=>temporalInstantKey("2026-09-05T09:30:00+09:00"))),true);
});
test("temporal deferral does not catch syntax or other structural errors",()=>{
 const error=new PatchError("structural failure");assert.throws(()=>assessTemporalPrerequisite(()=>{throw error;}),(e:unknown)=>e===error);
 assert.throws(()=>assessTemporalPrerequisite(()=>temporalInstantKey("invalid")),ValidationError);
});

import { buildDecisionContextSnapshot } from "../reality/decision-memory-core.js";
function decisionFixture() {
  const {p,id}=fixture();
  const space="d1111111-1111-4111-8111-111111111111", option="d2222222-2222-4222-8222-222222222222";
  const common={project_id:p.project.id,valid_from:"2026-09-01T00:00:00Z",valid_until:null,declared_by:{kind:"human" as const},recorded_at:at,created_at:at,updated_at:at};
  p.decision_space_declarations.push({...common,id:space,label:"Decision",description:null,basis:[]});
  p.decision_option_declarations.push({...common,id:option,decision_space_id:space,option:{kind:"DO_NOTHING"},label:null,description:null});
  const snapshot=buildDecisionContextSnapshot(p,space,at,at);
  const declaration={id:"d3333333-3333-4333-8333-333333333333",project_id:p.project.id,decision_space_id:space,decision_maker_entity_id:id,selected_option:{kind:"DO_NOTHING" as const},decided_at:at,context_snapshot:snapshot,declared_by:{kind:"human" as const},recorded_at:at,created_at:at,updated_at:at};
  return {p,declaration};
}
test("resolved Decision snapshot matching uses instant equality while preserving its declared fields",()=>{
 const {p,declaration}=decisionFixture();declaration.decided_at="2026-09-05T09:30:00+09:00";
 const next=applyPatch(p,{...unrelated(p),operations:[{op:"upsert",entity:"reality_decision_declaration",entity_id:declaration.id,payload:declaration}]});
 assert.equal(next.reality_decision_declarations[0]!.decided_at,declaration.decided_at);
 assert.equal(next.reality_decision_declarations[0]!.context_snapshot.assessed_at,at);
});
test("unresolved Decision snapshot prerequisite is deferred, but independent snapshot integrity is enforced",()=>{
 const {p,declaration}=decisionFixture();declaration.decided_at=leap;declaration.context_snapshot.assessed_at=leap;
 const patch:StatePatch={...unrelated(p),operations:[{op:"upsert",entity:"reality_decision_declaration",entity_id:declaration.id,payload:declaration}]};
 const next=applyPatch(p,patch);assert.equal(next.reality_decision_declarations[0]!.decided_at,leap);
 declaration.context_snapshot.decision_space_id="d4444444-4444-4444-8444-444444444444";
 assert.throws(()=>applyPatch(p,patch),/context_snapshot.decision_space_id must match/);
});
test("unresolved Commitment identity cannot block unrelated updates through Acceptance duplicate checks",()=>{
 const {p,id}=fixture();const intervention="e1111111-1111-4111-8111-111111111111",commitment="e2222222-2222-4222-8222-222222222222";
 const common={project_id:p.project.id,declared_by:{kind:"human" as const},recorded_at:at,created_at:at,updated_at:at};
 p.intervention_declarations.push({...common,id:intervention,intervention_key:"test",description:null,target_scope:{kind:"UNSCOPED"},valid_from:at,valid_until:null});
 p.intervention_commitment_declarations.push({...common,id:commitment,commitment_holder_entity_id:id,intervention_id:intervention,basis:[],committed_at:leap,valid_until:null});
 p.intervention_commitment_acceptance_declarations.push({...common,id:"e3333333-3333-4333-8333-333333333333",commitment_declaration_id:commitment,accepted_at:at});
 assert.equal(applyPatch(p,unrelated(p)).current_state.summary,"after");
 p.intervention_commitment_acceptance_declarations[0]!.commitment_declaration_id="e4444444-4444-4444-8444-444444444444";
 assert.throws(()=>applyPatch(p,unrelated(p)),PatchError);
});
