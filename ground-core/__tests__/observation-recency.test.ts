import test from 'node:test';
import assert from 'node:assert/strict';
import { assessObservationRecency } from '../observation-recency.js';
import { TemporalResolutionError } from '../temporal.js';
import { createEmptyProject, applyPatch } from '../state-engine.js';
import { validateProjectState } from '../validate.js';
import { hasRecentObservation } from '../studio/analyzers.js';
import { computeMomentumScore, buildProjectScoreContext } from '../director/portfolio-scoring.js';
import { ruleDirector } from '../director/rule-director.js';
import { recommendPortfolioFromInput } from '../director/portfolio-director.js';
import { analyzeStudio } from '../studio/rule-studio.js';
const now = Date.parse('2026-09-05T00:00:00Z');
const leap = '2026-08-31T23:59:60Z';
function state(times: string[]) {
  let p = createEmptyProject({title:'Recency',summary:''});
  for (const [i, at] of times.entries()) p = applyPatch(p, {schema_version:'0.1.25',source:'manual',project_id:p.project.id,operations:[{op:'upsert',entity:'observation',entity_id:`c5010101-0101-4101-8101-${String(i).padStart(12,'0')}`,payload:{title:'Observation',body:'Retained source',goal_id:null,source:'manual',observed_at:leap,created_at:at}}]});
  assert.equal(validateProjectState(p).valid,true);
  return p;
}
for (const [label,times,expected] of [
 ['empty',[],false], ['old',['2026-07-01T00:00:00Z'],false],
 ['recent',['2026-09-01T00:00:00Z'],true],
 ['unknown',[leap],null], ['old and unknown',['2026-07-01T00:00:00Z',leap],null],
 ['recent before unknown',['2026-09-01T00:00:00Z',leap],true],
 ['unknown before recent',[leap,'2026-09-01T00:00:00Z'],true],
 ['equivalent boundary',['2026-08-06T09:00:00+09:00'],true],
 ['precisely before boundary',['2026-08-05T23:59:59.999999999999Z'],false],
] as const) test(label,()=>{
 const p=state([...times]); const r=assessObservationRecency(p.observations,30,now);
 if(expected===null){assert.equal(r.status,'UNRESOLVED'); if(r.status==='UNRESOLVED'){assert.ok(r.error instanceof TemporalResolutionError);assert.equal(r.error.declaration,leap);}}
 else assert.deepEqual(r,{status:'RESOLVED',value:expected});
 assert.equal(p.observations.length,times.length);
});
test('report dependencies and conclusive momentum clamp',t=>{
 t.mock.method(Date,'now',()=>now);
 const p=state([leap]);
 assert.throws(()=>hasRecentObservation(p),TemporalResolutionError);
 const director=ruleDirector.recommend({project_state:p});
 const context=buildProjectScoreContext(p,director);
 // Empty action set independently fixes the clamped momentum at zero.
 assert.equal(computeMomentumScore(context),0);
 assert.doesNotThrow(()=>recommendPortfolioFromInput({project_states:[p],director_reports:[director]}));
 const portfolio=recommendPortfolioFromInput({project_states:[p],director_reports:[director]});
 assert.throws(()=>analyzeStudio({project_states:[p],director_reports:[director],portfolio_report:portfolio}),TemporalResolutionError);
 const sensitive={...context,eligible:true,primary:{...context.primary,matches_current_primary:false},in_progress_count:0,pending_count:0,state:{...p,current_state:{...p.current_state,confidence:null}}};
 assert.throws(()=>computeMomentumScore(sensitive),TemporalResolutionError);
 for(const times of [[leap,'2026-09-01T00:00:00Z'],['2026-09-01T00:00:00Z',leap]]){
   const recent=state(times); assert.equal(hasRecentObservation(recent),true);
   assert.equal(computeMomentumScore({...sensitive,state:{...recent,current_state:{...recent.current_state,confidence:null}}}),0.1);
 }
});
test('unconsumed observed_at remains unresolved without blocking ordinary reports',t=>{
 t.mock.method(Date,'now',()=>now);
 const p=state(['2026-09-01T00:00:00Z']);
 const director=ruleDirector.recommend({project_state:p});
 const portfolio=recommendPortfolioFromInput({project_states:[p],director_reports:[director]});
 assert.doesNotThrow(()=>analyzeStudio({project_states:[p],director_reports:[director],portfolio_report:portfolio}));
});
test('Portfolio ranking aborts when recency changes an eligible project score',async t=>{
 t.mock.method(Date,'now',()=>now);
 const {buildFreeWaterPhase0Fixture}=await import('./fixtures.js');
 const p=buildFreeWaterPhase0Fixture();
 p.observations=state([leap]).observations.map(o=>({...o,project_id:p.project.id}));
 const director=ruleDirector.recommend({project_state:p});
 assert.throws(()=>recommendPortfolioFromInput({project_states:[p],director_reports:[director]}),TemporalResolutionError);
});
test('Studio recent material selection remains independently decision-critical',t=>{
 t.mock.method(Date,'now',()=>now);
 const p=state([leap,'2026-09-01T00:00:00Z']);
 const director=ruleDirector.recommend({project_state:p});
 const portfolio=recommendPortfolioFromInput({project_states:[p],director_reports:[director]});
 assert.equal(hasRecentObservation(p),true);
 assert.throws(()=>analyzeStudio({project_states:[p],director_reports:[director],portfolio_report:portfolio}),TemporalResolutionError);
 // Twelve independent hypothesis materials fill the existing display cap.
 p.hypotheses=Array.from({length:12},(_,i)=>({id:`c6010101-0101-4101-8101-${String(i).padStart(12,'0')}`,project_id:p.project.id,goal_id:null,statement:'Recorded hypothesis',status:'untested',confidence:null,evidence_for:[],evidence_against:[],created_at:'2026-09-01T00:00:00Z',updated_at:'2026-09-01T00:00:00Z'}));
 const result=analyzeStudio({project_states:[p],director_reports:[director],portfolio_report:portfolio});
 assert.equal(result.decision_materials.length,12);
 assert.ok(result.decision_materials.every(x=>x.kind==='hypothesis'));
});
test('Studio material ordering preserves exact submillisecond chronology',t=>{
 t.mock.method(Date,'now',()=>now);
 const p=state(['2026-09-01T00:00:00.0001Z','2026-09-01T00:00:00.0003Z','2026-09-01T00:00:00.0002Z']);
 const director=ruleDirector.recommend({project_state:p});
 const portfolio=recommendPortfolioFromInput({project_states:[p],director_reports:[director]});
 const result=analyzeStudio({project_states:[p],director_reports:[director],portfolio_report:portfolio});
 assert.deepEqual(result.decision_materials.filter(x=>x.kind==='observation').map(x=>x.entity_id),[p.observations[1]!.id,p.observations[2]!.id]);
});
