/** Offline Gate F runner. Gold is declared in fixtures before this module executes NL.
 * It is not imported by production and is deliberately not an ordinary passing unit test.
 * Run: GROUND_PHASE4_OUTPUT_DIR=<dir> node --import tsx ground-core/__tests__/nl-heldout-evaluation.ts
 */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {createEmptyProject,applyPatch} from '../state-engine.js';
import {saveProject,loadProject} from '../file-store.js';
import {validateProjectState} from '../validate.js';
import {proposeFromReality} from '../reality/propose.js';
import {applyRealityProposal} from '../reality/apply.js';
import type {ProjectState,PatchOperation,RealityStateValue,StatePatch} from '../types.js';
const root=process.env.GROUND_PHASE4_OUTPUT_DIR;
if(!root)throw new Error('Set GROUND_PHASE4_OUTPUT_DIR to an isolated artifact directory.');
const fixture=readFileSync(resolve('ground-core/__tests__/fixtures/nl-phase4-heldout.json'),'utf8');
const manifest=JSON.parse(fixture);
const write=(p:string,v:unknown)=>{mkdirSync(join(root!,p,'..'),{recursive:true});writeFileSync(join(root!,p),JSON.stringify(v,null,2)+'\n');};
const T='2026-09-03T00:00:00.000Z';
// Construct typed native oracle independent of parser. A record property's ontology is a
// declared report meaning, not an automatic assertion that its contents are world truth.
function typedOracle(c:any):ProjectState{
 let s=createEmptyProject({title:'Phase4 predeclared gold '+c.id});const operations:PatchOperation[]=[];
 const common=(id:string)=>({id,project_id:s.project.id,created_at:T,updated_at:T});
 const labels=new Map<string,string>();const ent=(label:string,kind='semantic_record')=>{if(labels.has(label))return labels.get(label)!;const id=randomUUID();labels.set(label,id);operations.push({op:'upsert',entity:'reality_entity',entity_id:id,payload:{...common(id),kind,label}});return id;};
 const record=ent('Gold meaning record');const source=ent('Gold original input','text_record');
 for(const [kind,value] of Object.entries(c.oracle.properties??{}))for(const raw of Array.isArray(value)&&!kind.endsWith('_names')?value:[value]){
  const v=raw&&typeof raw==='object'&&!Array.isArray(raw)&&'entityLabel' in raw?ent(String(raw.entityLabel),'person'):raw;
  const id=randomUUID();operations.push({op:'upsert',entity:'reality_state',entity_id:id,payload:{...common(id),subject_id:record,kind,value:v as RealityStateValue,valid_from:T,valid_until:null,recorded_at:T}});
 }
 if(c.oracle.observation||c.oracle.provenanceLabel){const id=randomUUID();const actor=c.oracle.provenanceLabel?ent(c.oracle.provenanceLabel,'person'):source;operations.push({op:'upsert',entity:'epistemic_observation',entity_id:id,payload:{...common(id),kind:c.oracle.observation??'textual_report',content:c.input,subject_ids:[record],provenance:{kind:c.oracle.provenanceLabel?'human':'document',entity_id:actor},observed_at:null,recorded_at:T}});}
 for(const kind of c.oracle.events??[]){const id=randomUUID();operations.push({op:'upsert',entity:'reality_event',entity_id:id,payload:{...common(id),kind,subject_ids:[],summary:'Declared oracle occurrence',occurred_at:c.oracle.eventTimes?.[kind]??null,recorded_at:T}});}
 const patch:StatePatch={schema_version:'0.1.24',project_id:s.project.id,source:'manual',operations};s=applyPatch(s,patch);
 const dir=join(root!,'stores/gold',c.id);saveProject(s,{storageDir:dir});s=loadProject(s.project.id,{storageDir:dir});if(!validateProjectState(s).valid)throw new Error('Invalid gold '+c.id);
 write('oracles/'+c.id+'/typed-patch.json',patch);write('oracles/'+c.id+'/canonical.json',s);write('oracles/'+c.id+'/constraints.json',c.oracle);return s;
}
// All positive typed oracles and explicit negative/temporal constraints exist before first trial.
const oracles=new Map<string,ProjectState>();for(const c of manifest.cases)oracles.set(c.id,typedOracle(c));
write('oracle-runtime-lock.json',{fixtureSHA256:createHash('sha256').update(fixture).digest('hex'),oracleCount:oracles.size,allOraclesAppliedSavedReloadedValidated:true,completeBeforeNaturalLanguageTrials:true,lockedAt:new Date().toISOString()});
const eq=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
function compare(c:any,s:ProjectState){const gold=oracles.get(c.id)!;const checks:{key:string,expected:unknown,actual:unknown,passed:boolean}[]=[];
 const ck=(key:string,expected:unknown,actual:unknown,passed=eq(expected,actual))=>checks.push({key,expected,actual,passed});
 for(const g of gold.reality_states){const label=typeof g.value==='string'?gold.reality_entities.find(e=>e.id===g.value)?.label:undefined;const vals=s.reality_states.filter(x=>x.kind===g.kind).map(x=>label?s.reality_entities.find(e=>e.id===x.value)?.label:x.value);ck('state:'+g.kind,label??g.value,vals,vals.some(x=>eq(x,label??g.value)));}
 if(c.oracle.observation)ck('observation-kind',c.oracle.observation,s.epistemic_observations.map(x=>x.kind),s.epistemic_observations.some(x=>x.kind===c.oracle.observation));
 if(c.oracle.provenanceLabel)ck('provenance-label',c.oracle.provenanceLabel,s.epistemic_observations.map(x=>s.reality_entities.find(e=>e.id===x.provenance.entity_id)?.label),s.epistemic_observations.some(x=>s.reality_entities.find(e=>e.id===x.provenance.entity_id)?.label===c.oracle.provenanceLabel));
 for(const kind of c.oracle.events??[])ck('event:'+kind,true,s.reality_events.some(x=>x.kind===kind));
 for(const [kind,time]of Object.entries(c.oracle.eventTimes??{}))ck('event-time:'+kind,time,s.reality_events.find(x=>x.kind===kind)?.occurred_at??null);
 for(const key of c.oracle.forbidden??[])ck('no-state:'+key,0,s.reality_states.filter(x=>x.kind===key).length);
 for(const kind of c.oracle.forbiddenEvents??[])ck('no-event:'+kind,0,s.reality_events.filter(x=>x.kind===kind).length);
 if(c.oracle.noDecision)ck('no-formal-decision',0,s.reality_decision_declarations.length);
 if(c.oracle.noDirectBy)ck('no-direct-by',0,s.epistemic_observations.filter(x=>x.kind==='direct_visual'&&s.reality_entities.find(e=>e.id===x.provenance.entity_id)?.label===c.oracle.noDirectBy).length);
 if(c.oracle.forbiddenPermit)ck('no-derived-permit',0,s.intervention_permission_declarations.filter(x=>x.effect==='PERMIT').length);
 if(c.oracle.forbiddenCause)ck('no-derived-cause',0,s.reality_states.filter(x=>/cause_of|caused_by/.test(x.kind)).length);
 if(c.oracle.noIdentifiedPeople)ck('no-derived-identities',0,s.reality_states.filter(x=>x.kind==='identified_individual_names'||x.kind==='identified_individual_set').length);
 if(c.oracle.differentValues){const sets=c.oracle.differentValues.map((k:string)=>s.reality_states.filter(x=>x.kind===k).map(x=>x.value));ck('distinct-role-values',true,sets,sets.every((xs:unknown[])=>xs.length>0)&&!sets[0].some((x:unknown)=>sets[1].some((y:unknown)=>eq(x,y))));}
 if(c.oracle.identityRoles){const kinds=['container','label','contents','presumed_participant','registry_record'];const ids=kinds.flatMap(k=>s.reality_states.filter(x=>x.kind===k).map(x=>x.value));ck('five-distinct-identities',5,new Set(ids).size);}
 // Temporal meaning must be tied to a specific record/occurrence, not merely present somewhere.
 if(c.oracle.historyKnowledge&&c.input.includes('2026-'))for(const [value,time]of [['不明','2026-09-02T08:00:00Z'],[true,'2026-09-02T10:00:00Z']]as const){const subjects=s.reality_states.filter(x=>x.kind==='knowledge_of_X'&&x.value===value).map(x=>x.subject_id);ck('dated-knowledge:'+String(value),true,s.reality_states.some(x=>subjects.includes(x.subject_id)&&x.kind==='declared_time_expression'&&x.value===time));}
 if(c.oracle.historyPermission&&c.input.includes('2026-')){const permitted=s.reality_states.filter(x=>x.kind==='permission_status'&&x.value==='permitted').map(x=>x.subject_id);const revoked=s.reality_states.filter(x=>x.kind==='permission_status'&&x.value==='revoked').map(x=>x.subject_id);ck('past-permission-record-retained',true,permitted.length>0&&revoked.length>0&&!permitted.some(x=>revoked.includes(x)));}
 if(c.oracle.historyScene){const original=s.reality_states.filter(x=>x.kind==='scene_phase'&&x.value==='original').map(x=>x.subject_id);const post=s.reality_states.filter(x=>x.kind==='scene_phase'&&x.value==='post_intervention').map(x=>x.subject_id);ck('distinct-scene-records',true,original.length>0&&post.length>0&&!original.some(x=>post.includes(x)));}
 // Source channel is checked after persistence, not only metadata passed to the adapter.
 ck('persisted-source',[c.source],s.observations.map(x=>x.source));
 const positives=checks.filter(x=>!x.key.startsWith('no-'));return {checks,complete:checks.length>0&&positives.length>1&&checks.every(x=>x.passed),matched:checks.filter(x=>x.passed).length,required:checks.length};
}
function trial(c:any,n:number,input=c.input,answer=false){const id=c.id+'-'+n+(answer?'-answer':'');const dir=join(root!,'stores/natural',id);let s=createEmptyProject({title:'Phase4 held-out '+id});saveProject(s,{storageDir:dir});let p:any;let error:string|null=null;
 try{p=proposeFromReality(s,{project_id:s.project.id,input_text:input,source:c.source},'canonical');if('proposed_patch'in p.result){applyRealityProposal({project_id:s.project.id,proposal:p.result},{storageDir:dir});s=loadProject(s.project.id,{storageDir:dir});}}catch(e){error=String(e);}
 const comparison=compare(c,s);const clarification=p?.result?.type==='clarification';
 const falsePromotion=comparison.checks.some(x=>!x.passed&&(x.key.startsWith('no-formal-')||x.key.startsWith('no-direct-')||x.key.startsWith('no-state:verified')||x.key.startsWith('no-event:formal')||x.key.startsWith('no-derived-permit')));
 const falseDerivation=comparison.checks.some(x=>!x.passed&&(x.key.startsWith('no-event:')&&!x.key.includes('formal')||x.key==='no-derived-cause'||x.key==='no-derived-identities'||x.key==='no-state:equipment_operating_status'));
 const falseCollapse=comparison.checks.some(x=>!x.passed&&x.key==='distinct-role-values'&&Array.isArray(x.actual)&&x.actual.every((a:any)=>a.length>0));
 const sourceChecks=comparison.checks.filter(x=>x.key==='persisted-source'||x.key==='provenance-label'||x.key==='observation-kind'||x.key.startsWith('state:reporter')||x.key.startsWith('state:reported_observer')||x.key.startsWith('state:direct_observer')||x.key.startsWith('state:intermediary')||x.key.startsWith('state:record_reviewer')||x.key==='no-direct-by');
 const status=error?'Technical failure':clarification?'Clarification required':falsePromotion||falseDerivation||falseCollapse?'Incorrect canonicalization':comparison.complete?'Canonical success':comparison.matched>1?'Partial canonical success':'Safe unresolved';
 const trace=p?.translation_trace??null;const result={id,caseId:c.id,boundary:c.boundary,domain:c.domain,determinate:c.determinate,trial:n,answer,status,error,comparison,falsePromotion,falseDerivation,falseCollapse,clarification,necessaryClarification:clarification&&!c.determinate,unnecessaryClarification:clarification&&c.determinate,missingClarification:!clarification&&!c.determinate&&!answer,provenanceCorrect:sourceChecks.length>0&&sourceChecks.every(x=>x.passed),optionDecisionCorrect:[4,5].includes(c.boundary)?comparison.checks.filter(x=>x.key==='state:selection_completed'||x.key==='state:plan_lifecycle_stage'||x.key==='state:selected_plan_name'||x.key.includes('formal')||x.key==='no-formal-decision').every(x=>x.passed):null,canonicalValid:validateProjectState(s).valid,inputUnchanged:p?.ground_event?.input_text===input,paths:{actual:'trials/'+id+'/canonical.json',proposal:'trials/'+id+'/proposal.json',diff:'trials/'+id+'/comparison.json',trace:'trials/'+id+'/trace.json'}};
 write(result.paths.actual,s);write(result.paths.proposal,p??{error});write(result.paths.diff,comparison);write(result.paths.trace,trace);write('trials/'+id+'/result.json',result);return result;
}
const results:any[]=[];const resolutions:any[]=[];
for(const c of manifest.cases)for(let n=1;n<=manifest.repeatCount;n++){const r=trial(c,n);results.push(r);if(r.necessaryClarification){const after=trial(c,n,c.input+'\n'+c.answer,true);resolutions.push({caseId:c.id,trial:n,originalInput:c.input,explicitAnswer:c.answer,answerOnlyDeclaredInformation:true,method:'Unchanged original plus explicit minimal answer, ordinary canonical re-ingestion in isolated fixture store.',complete:after.status==='Canonical success',after});}}
const primary=results.filter(x=>x.determinate);const proportion=(a:any[],fn:(x:any)=>boolean)=>({numerator:a.filter(fn).length,denominator:a.length,percent:a.length?100*a.filter(fn).length/a.length:null});
const metrics={arrival:proportion(primary,x=>x.status==='Canonical success'),falsePromotion:proportion(primary,x=>x.falsePromotion),falseCollapse:proportion(primary,x=>x.falseCollapse),falseDerivation:proportion(primary,x=>x.falseDerivation),provenance:proportion(primary,x=>x.provenanceCorrect),optionDecision:proportion(primary.filter(x=>[4,5].includes(x.boundary)),x=>x.optionDecisionCorrect),unnecessaryClarification:proportion(primary,x=>x.unnecessaryClarification),missingClarification:proportion(results.filter(x=>!x.determinate),x=>x.missingClarification),clarificationResolution:proportion(resolutions,x=>x.complete)};
const gate={arrival:(metrics.arrival.percent??0)>=90,falsePromotion:(metrics.falsePromotion.percent??100)<=1,falseDerivation:(metrics.falseDerivation.percent??100)<=1,provenance:(metrics.provenance.percent??0)>=95,optionDecision:(metrics.optionDecision.percent??0)>=98,unnecessaryClarification:(metrics.unnecessaryClarification.percent??100)<=10,clarificationResolution:(metrics.clarificationResolution.percent??0)>=95};
const summary={primaryCases:320,clarificationCases:16,mainFormulations:64,contextStrata:5,initialTrials:results.length,determinateTrials:primary.length,resolutionTrials:resolutions.length,metrics,gate,engineeringGatePassed:Object.values(gate).every(Boolean),classes:results.reduce((a:any,x:any)=>(a[x.status]=(a[x.status]??0)+1,a),{}),invalid:results.filter(x=>!x.canonicalValid).length,technicalFailures:results.filter(x=>x.error).length,byBoundary:Array.from({length:16},(_,i)=>({boundary:i+1,...proportion(primary.filter(x=>x.boundary===i+1),x=>x.status==='Canonical success')})),stableFailures:manifest.cases.filter((c:any)=>c.determinate&&results.filter(r=>r.caseId===c.id).every(r=>r.status!=='Canonical success')).map((c:any)=>({id:c.id,boundary:c.boundary,failedChecks:results.find(r=>r.caseId===c.id).comparison.checks.filter((x:any)=>!x.passed).map((x:any)=>x.key)})),methodLimitations:['64 independent main formulations with five correlated context variants, not 320 independent discoveries.','Scoring compares predeclared structural semantic distinctions; UUIDs and processing timestamps are not exact-match targets.','The corpus is bounded and synthetic. It does not establish unrestricted natural-language understanding.','No tuning on this held-out set; every failed positive is visible.','Trace preserved is not synonymous with complete semantic comprehension.']};
write('trial-results.json',results);write('clarification-transcripts.json',resolutions);write('summary.json',summary);console.log(JSON.stringify(summary));
