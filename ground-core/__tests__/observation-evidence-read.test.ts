import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getEvidenceForObservation } from '../index.js';
import { createEmptyProject } from '../state-engine.js';
import { NotFoundError, ValidationError } from '../errors.js';
import type { Evidence, EpistemicObservation } from '../types.js';
const id='11111111-1111-4111-8111-111111111111';
const foreign='22222222-2222-4222-8222-222222222222';
const observationId='33333333-3333-4333-8333-333333333333';
const time='2026-09-01T01:00:00+01:00';
function fixture(){
 const state=createEmptyProject({title:'Pure reader test'});state.project.id=id;
 const observation:EpistemicObservation={id:observationId,project_id:id,kind:'textual',content:'recorded content',provenance:{kind:'document'},subject_ids:[],observed_at:null,recorded_at:time,created_at:time,updated_at:time};
 state.epistemic_observations=[observation];
 const evidence:Evidence={id:'ffffffff-ffff-4fff-8fff-ffffffffffff',project_id:id,kind:'observation_ref',observation_id:observationId,external_ref:null,summary:'Stored reference',provenance:{kind:'sensor',external_id:null,label:'different provenance'},recorded_at:time,created_at:time,updated_at:time};
 return {state,evidence};
}
test('one explicit match preserves every canonical field without provenance agreement',()=>{
 const {state,evidence}=fixture();state.evidence=[evidence];assert.deepEqual(getEvidenceForObservation(state,observationId),[evidence]);
});
test('existing Observation with zero explicit matches returns []',()=>{
 const {state}=fixture();assert.deepEqual(getEvidenceForObservation(state,observationId),[]);
});
test('multiple matches retain stored order, even when ID and timestamp sorting would reverse it',()=>{
 const {state,evidence}=fixture();const second={...evidence,id:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',recorded_at:'2025-01-01T00:00:00Z'};state.evidence=[evidence,second];assert.deepEqual(getEvidenceForObservation(state,observationId),[evidence,second]);
});
test('unknown Observation fails closed, including when an orphan Evidence names it',()=>{
 const {state,evidence}=fixture();state.epistemic_observations=[];state.evidence=[evidence];assert.throws(()=>getEvidenceForObservation(state,observationId),NotFoundError);
});
test('external_ref is excluded even with equal observation_id and provenance',()=>{
 const {state,evidence}=fixture();state.evidence=[{...evidence,kind:'external_ref',external_ref:'https://example.test/source',provenance:state.epistemic_observations[0].provenance}];assert.deepEqual(getEvidenceForObservation(state,observationId),[]);
});
test('other Observation ID excluded despite shared summary/source/provenance',()=>{
 const {state,evidence}=fixture();state.evidence=[{...evidence,observation_id:foreign}];assert.deepEqual(getEvidenceForObservation(state,observationId),[]);
});
test('foreign Evidence is excluded and foreign Observation cannot establish existence',()=>{
 const {state,evidence}=fixture();state.evidence=[{...evidence,project_id:foreign}];assert.deepEqual(getEvidenceForObservation(state,observationId),[]);
 state.epistemic_observations[0].project_id=foreign;assert.throws(()=>getEvidenceForObservation(state,observationId),NotFoundError);
});
test('ambiguous local Observation IDs fail closed',()=>{
 const {state}=fixture();state.epistemic_observations.push(structuredClone(state.epistemic_observations[0]));assert.throws(()=>getEvidenceForObservation(state,observationId),ValidationError);
});
test('deeply frozen state is unchanged; result container does not alias the collection',()=>{
 const {state,evidence}=fixture();state.evidence=[evidence];const before=structuredClone(state);
 function freeze(value:unknown){if(value && typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}}
 freeze(state);const result=getEvidenceForObservation(state,observationId);result.pop();assert.deepEqual(state,before);assert.equal(state.evidence.length,1);
});
