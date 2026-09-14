import {createHash,randomUUID} from 'node:crypto';
import type {PatchOperation,ProjectState,StatePatch,EpistemicProvenance,RealityStateValue} from '../types.js';
import type {PatchProposal,ClarificationResponse} from '../extraction/types.js';
import {validateStatePatch} from '../validate.js';
import {dryRunPatch} from '../extraction/dry-run.js';
import type {RealityProposeInput} from './types.js';
import {interpretDecisionLifecycle} from './decision-lifecycle.js';

/** Ingestion trace only. None of these types extend canonical primitives. */
export interface TranslationUnit {
 span:string; families:string[]; qualification:'observed'|'reported'|'verified'|'unknown'|'negative'|'predicted'|'hypothetical'|'unresolved';
 properties:Record<string,RealityStateValue>; observer?:string; reporter?:string; intermediary?:string; record?:string;
 eventKinds:string[]; time:string|null; timeExpression?:string; status:'preserved'|'unresolved'|'clarification required'|'unsupported'; reason?:string;
}
export interface TranslationTrace { input:string; units:TranslationUnit[]; canonicalTargets:{unit:number,ids:string[]}[]; residuals:{span:string,status:string,reason:string}[]; }
const fingerprint=(key:string)=>{const h=createHash('sha256').update(key).digest('hex');return `${h.slice(0,8)}-${h.slice(8,12)}-4${h.slice(13,16)}-8${h.slice(17,20)}-${h.slice(20,32)}`;};
const clean=(s:string)=>s.trim().replace(/^[「『\s]+|[」』\s。]+$/g,'');
function sentenceSpans(text:string):string[]{const out:string[]=[];let part='',depth=0;for(const ch of text){part+=ch;if(ch==='「'||ch==='『')depth++;if(ch==='」'||ch==='』')depth=Math.max(0,depth-1);if(depth===0&&/[。！？\n]/.test(ch)){out.push(part);part='';}}if(part.trim())out.push(part);return out;}
const numberValue=(s:string)=>{let n=0;const re=/(\d[\d,]*(?:\.\d+)?)(億|万|千)?/g;for(const m of s.matchAll(re))n+=Number(m[1].replaceAll(',',''))*({億:1e8,万:1e4,千:1e3}[m[2]]??1);return n;};
function explicitTime(s:string):{time:string|null,timeExpression?:string}{const iso=s.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{3})?)?(?:Z|[+-]\d{2}:\d{2})/);if(iso&&Number.isFinite(Date.parse(iso[0])))return {time:new Date(iso[0]).toISOString(),timeExpression:iso[0]};const local=s.match(/(?:\d+月\d+日\s*)?\d{1,2}(?:時(?:\d+分)?|:\d{2})/);return {time:null,...(local?{timeExpression:local[0]}:{})};}
/** Deterministic bounded grammar: semantics rather than domain-name shortcuts. */
export function decomposeReality(text:string):TranslationUnit[]{
 const units:TranslationUnit[]=[];
 // A quoted report is kept together; do not split nested attribution into independent world facts.
 const spans=sentenceSpans(text).map(clean).filter(Boolean);
 for(const span of spans){const u:TranslationUnit={span,families:[],qualification:'reported',properties:{},eventKinds:[],...explicitTime(span),status:'preserved'};
 const unknown=/不明|未確認|未検証|未確定|確認できていない|確認していない|分からない|分かっていない|判明していない|とは限らない|確認が取れていない/.test(span);
 const possible=/可能性|らしい|かもしれない|推測|疑い|見込み/.test(span);
 const denied=/存在しなかった|検出されなかった|見つからなかった|含まれていなかった|混入していなかった|陰性|検査.*(?:存在しない|含まれない)/.test(span);
 const verified=/検証された|検証した|検証済み|確認済み|検証により|検証で|検証によって|鑑定で|照合で.*確認|独立.*確認/.test(span)&&!/(?:検証|確認).*(?:未確認|していない|されていない)/.test(span);
 if(/予測|推計|推定|モデルでは/.test(span)){u.qualification='predicted';u.families.push('prediction');}
 else if(possible)u.qualification='hypothetical';else if(denied)u.qualification='negative';else if(verified)u.qualification='verified';else if(unknown)u.qualification='unknown';
 if(unknown||/未検査|検査していない|調べていない/.test(span)){u.families.push('knowledge');u.properties.knowledge_of_X='不明';}
 if(denied){u.families.push('inspection');u.properties.inspection_performed=true;u.properties.X_present=false;}
 if(/未検査|検査していない|調べていない/.test(span))u.properties.inspection_performed=false;
 const quoted=/[「『]|(?:が|から).*(?:報告|話した|聞いた|伝えた|言った)/.test(span);
 const actor=span.match(/^(.{1,35}?)(?:が|は|から)/)?.[1];
 const innerObserver=span.match(/(?:が[、\s「『]*|「)(.{1,30}?)(?:が|は).*(?:目撃|直接見|直接確認|確認した)/)?.[1];
 if(/直接見|直接確認|直接見た|目撃した/.test(span)&&!quoted){u.families.push('observation');u.qualification='observed';if(actor)u.observer=clean(actor);}
 if(quoted){u.families.push('report');if(actor)u.reporter=clean(actor);if(innerObserver&&clean(innerObserver)!==u.reporter)u.properties.reported_observer_name=clean(innerObserver);if(/から.*聞いた/.test(span)&&actor){u.intermediary=clean(actor);const from=span.match(/が[、\s]*(.{1,25}?)から/);if(from)u.reporter=clean(from[1]);const witness=span.match(/から(.{1,20}?)の目撃/);if(witness)u.properties.reported_observer_name=clean(witness[1]);}}
 if(/SNS.*(?:投稿|書か)|投稿.*書|記録|資料|台帳|名簿|ラベル|監視カメラ/.test(span)){u.families.push('record');u.record=span.match(/(?:SNS投稿|監視カメラ記録|電子管理記録|電子台帳|紙名簿|ラベル|台帳|記録|資料)/)?.[0];}
 if(/カメラ.*(?:記録|映像).*(?:確認|見た)|記録を.*確認/.test(span)){u.families.push('record-review');u.properties.record_review_completed=true;u.properties.direct_world_observation=false;const reviewer=span.match(/(?:記録|映像)を(.{1,25}?)が/)?.[1]??actor;if(reviewer)u.observer=clean(reviewer);}
 if(/(?:センサー|測定|計測|測定値|検査値|出力)/.test(span)){u.families.push('measurement');const reading=span.match(/(?:が|は|出力|値|結果)[^\d]{0,20}(\d[\d,]*(?:\.\d+)?)/);if(reading)u.properties.recorded_result_value=numberValue(reading[1]);if(verified&&reading)u.properties.verified_reality_value=numberValue(reading[1]);}
 if(verified){u.families.push('verification');u.properties.verification_completed=true;}
 const lifecycle=interpretDecisionLifecycle(span);
 if(lifecycle){u.families.push('decision-lifecycle');u.properties.plan_lifecycle_stage=lifecycle;if(['considered','candidate','preferred','intended','planned','selected'].includes(lifecycle))u.properties.selection_completed=lifecycle==='selected';if(lifecycle==='selected'){const p=span.match(/([A-ZＡ-Ｚ\w]+案)/);if(p)u.properties.selected_plan_name=p[1];u.eventKinds.push('formal_plan_selected');}if(lifecycle==='instructed')u.eventKinds.push('instruction_issued');if(lifecycle==='executing')u.eventKinds.push('execution_started');if(lifecycle==='completed')u.eventKinds.push('execution_completed');}
 if(/命令|指示|要請/.test(span)&&/(?:送った|送信した|発令した|指示した|命令した|要請した)/.test(span)&&!/(?:送った|した).*(?:わけではない|事実はない)/.test(span)){u.families.push('instruction');u.properties.instruction_issued=true;u.eventKinds.push('instruction_issued');}
 if(/(?:設備|装置|機器|遮断機).*(?:実際に停止|停止した|止まった)/.test(span)&&!unknown&&!possible&&!quoted){u.families.push('execution');u.eventKinds.push('equipment_stopped');u.properties.equipment_operating_status='停止';}
 if(/(?:活動|作業|処置|処理|実行|消火|止血).*(?:開始した|始めた|始まった)/.test(span)&&!possible&&!unknown&&!quoted){u.families.push('execution');u.eventKinds.push('execution_started');}
 if(/鎮火した|火災が鎮火|出血が止まった|止血が成立|配送先に到着|着金した/.test(span)&&!possible&&!unknown&&!quoted){u.families.push('outcome');u.eventKinds.push('outcome_established');}
 if(/所有者|所有権|法的.*所有|所有している/.test(span)){u.families.push('ownership');const owner=span.match(/(?:所有者(?:は|が)|所有権(?:は|が)|法的所有者は)\s*(.{1,25}?)(?:[、。]|$)/)?.[1]??span.match(/(.{1,25}?)(?:が|は).*所有している/)?.[1];if(owner)u.properties.owner_name=clean(owner);}
 if(/保管している|保管しており|現物.*保管|物理.*保管/.test(span)){u.families.push('custody');const who=span.match(/(?:現物(?:は|を)|保管者は)\s*(.{1,25}?)(?:が|は).*保管/)?.[1]??span.match(/(.{1,25}?)(?:が|は).*保管して/)?.[1];if(who)u.properties.custodian_name=clean(who);}
 if(/処分|売却|引渡|引き渡|移転/.test(span)&&/禁止|できない|許されない|制限|不明|確認していない|とは限らない/.test(span)){u.families.push('disposal-authority');u.properties.disposal_authority=unknown?'unknown':/禁止|できない|許されない/.test(span)?'prohibited':'restricted';}
 if(/許可|撤回|取り消|取消/.test(span)){u.families.push('permission');u.properties.permission_status=/撤回|取り消|取消/.test(span)?'revoked':unknown?'unknown':/許可.*(?:された|されていた|あった|認められた)/.test(span)?'permitted':'unresolved';if(u.properties.permission_status==='revoked')u.eventKinds.push('permission_revoked');}
 if(/実行要求|実施要求/.test(span)){u.families.push('execution-request');u.eventKinds.push('execution_requested');}
 if(/Evidence|証拠|検査結果|追加資料/.test(span)&&/受領|到着|受け取|届い/.test(span)){u.families.push('evidence-arrival');u.eventKinds.push('evidence_received');u.properties.evidence_received=true;}
 if(/判明|分かった/.test(span)&&!unknown){u.families.push('knowledge');u.properties.knowledge_of_X=true;}
 const quantity=/(\d[\d,]*(?:\.\d+)?(?:億|万|千)?(?:\d[\d,]*(?:万|千)?)?)\s*(円|個|点|台|人|立方メートル|m3|MW|kW|リットル|時間)/g;
 const mentions:RealityStateValue[]=[];
 for(const n of span.matchAll(quantity)){const v=numberValue(n[1]);u.families.push('quantity');const before=span.slice(0,n.index);const local=before.split(/、|あるが|だが|ですが|そのうち|一方|ただし/).at(-1)??before;const avail=/自由に|使用可能|利用可能|使える|供給できる|出荷できる/.test(local);const record=/登校記録|登校者|出欠|入場記録|記録は|名簿/.test(local);const observed=/体育館|集まった|実人数|確認は|確認された人数|確認人数/.test(local);const reserved=/予約|確保済み|引当|割当|割り当て/.test(local);const key=n[2]==='時間'?'time_limit_hours':avail?'available_quantity':reserved?'allocated_quantity':record?'record_count':observed?'observed_count':'total_quantity';const old=u.properties[key];u.properties[key]=old===undefined?v:Array.isArray(old)?[...old,v]:[old,v];u.properties[key+'_unit']=n[2];mentions.push({value:v,unit:n[2],role:key,start:n.index!,end:n.index!+n[0].length});}
 if(mentions.length)u.properties.quantity_mentions=mentions;
 if(/差(?:は|が).*\d+人/.test(span)){u.families.push('aggregate');u.properties.aggregate_record_discrepancy=Number(span.match(/差(?:は|が).*?(\d+)人/)?.[1]);}
 if(/誰(?:なの|か)|個体.*不明|特定.*(?:できない|していない)/.test(span)){u.families.push('identity-unknown');u.properties.individual_identity_known=false;}
 if(/P\d/.test(span)&&/照合|個別.*確認|特定された/.test(span)){u.families.push('individual-identity');u.properties.identified_individual_names=Array.from(new Set(span.match(/P\d+/g)??[]));}
 if(/容器|袋|ラベル|内容物|試料|電子.*記録|台帳/.test(span)&&/識別|由来|参加者|入れ替|別対象|別の対象/.test(span)){u.families.push('container-identity');u.properties.identity_roles_distinct=true;u.properties.contents_origin_verified=verified;}
 if(/事故.*(?:直後|時点)|介入|救助|修理前|修理後|原設定|資材.*移動|元.*配置/.test(span)){u.families.push('scene-history');u.properties.scene_phase=/後|移動|介入/.test(span)?'post_intervention':'original';if(/(?:元|当時|事故).*不明/.test(span))u.properties.original_complete_state_known=false;}
 if(/切替|切り替|切り換|服薬|投与|介入/.test(span)&&/後|続いて|翌|その後/.test(span)){u.families.push('temporal-succession');u.properties.temporal_succession=true;u.properties.causality_verified=false;}
 if(/原因|因果/.test(span)){u.families.push('causality');u.properties.causality_verified=verified&&!unknown&&!possible;if(verified&&!unknown&&!possible)u.eventKinds.push('causality_verified');}
 if(/対立|食い違|どちら.*正しい.*未|矛盾/.test(span)){u.families.push('conflict');u.properties.report_conflict_unresolved=true;u.qualification='unresolved';}
 if(quoted&&!u.families.includes('record-review')){
   u.qualification='reported';
   for(const key of ['verification_completed','verified_reality_value','selection_completed','causality_verified'])if(key in u.properties){u.properties['reported_'+key]=u.properties[key];delete u.properties[key];}
   u.eventKinds=[];
 }
 u.families=Array.from(new Set(u.families));u.eventKinds=Array.from(new Set(u.eventKinds));
 if(!u.families.length){u.status='unsupported';u.reason='No supported semantic grammar; preserved as residual input, no world assertion made.';}
 if(/^(?:それ|その人|この件|担当者がそれ)/.test(span)&&!units.some(x=>x.observer||x.reporter||x.record)){u.status='clarification required';u.reason='Unresolved referent materially changes the observation subject.';}
 units.push(u);
 }
 return units;
}
export function proposeCanonicalTranslation(state:ProjectState,input:RealityProposeInput):{result:PatchProposal|ClarificationResponse,trace:TranslationTrace}|null {
 const units=decomposeReality(input.input_text);
 const reference=input.input_text.match(/(?:補足[：:]\s*)?(?:「?それ」?|その人|参照語)(?:は|の参照先は)\s*([^。\n]{1,40}?)(?:を指す|です|である)[。\n]?/);
 if(reference)for(const u of units)if(u.status==='clarification required'){u.properties.resolved_referent=clean(reference[1]);u.status=u.families.length?'preserved':'unsupported';u.reason=undefined;if(u.observer&&/^(?:それ|その人)$/.test(u.observer))u.observer=clean(reference[1]);}
 const now=new Date().toISOString();const episode=randomUUID();const operations:PatchOperation[]=[];const targets:TranslationTrace['canonicalTargets']=[];const trace:TranslationTrace={input:input.input_text,units,canonicalTargets:targets,residuals:units.filter(u=>u.status!=='preserved').map(u=>({span:u.span,status:u.status,reason:u.reason??'Residual'}))};
 const material=units.filter(u=>u.status==='clarification required');if(material.length)return {trace,result:{type:'clarification',project_id:state.project.id,input_text:input.input_text,reason:'Observation subject is unresolved; no alternative subject is chosen.',questions:material.map(u=>`「${u.span}」の参照語は、どの対象を指していますか？`),risk_level:'medium',created_at:now}};
 const common=(id:string)=>({id,project_id:state.project.id,created_at:now,updated_at:now});
 const entities=new Map<string,string>();
 function entity(label:string,kind:string){const key=kind+'|'+label;if(entities.has(key))return entities.get(key)!;const matches=state.reality_entities.filter(x=>x.label===label&&x.kind===kind);const uid=matches.length===1?matches[0].id:fingerprint(state.project.id+'|nl|'+key);entities.set(key,uid);if(matches.length!==1)operations.push({op:'upsert',entity:'reality_entity',entity_id:uid,payload:{...common(uid),kind,label}});return uid;}
 const document=entity('Reality intake '+fingerprint(input.input_text),'text_record');
 const addState=(subject:string,kind:string,value:RealityStateValue,key:string)=>{const uid=fingerprint(state.project.id+'|nl-state|'+key);operations.push({op:'upsert',entity:'reality_state',entity_id:uid,payload:{...common(uid),subject_id:subject,kind,value,valid_from:now,valid_until:null,recorded_at:now}});return uid;};
 units.forEach((u,index)=>{const ids:string[]=[];const key=episode+'|'+input.input_text+'|'+index;const record=entity('Meaning record '+fingerprint(key),'semantic_record');ids.push(record);
  // State validity here describes this durable intake record, never a fabricated past-world state.
  ids.push(addState(record,'epistemic_status',u.qualification,key+'|qualification'));
  ids.push(addState(record,'interpretation_status',u.status,key+'|status'));
  if(u.timeExpression)ids.push(addState(record,'declared_time_expression',u.timeExpression,key+'|localtime'));
  for(const [kind,value] of Object.entries(u.properties))ids.push(addState(record,kind,value,key+'|'+kind));
  const subjectName=typeof u.properties.resolved_referent==='string'?u.properties.resolved_referent:u.span.match(/^(.{1,35}?)(?:には|は|が|の法的所有者|の所有者)/)?.[1];
  if(subjectName&&!/^(それ|この件|その人|同社)$/.test(clean(subjectName)))ids.push(addState(record,'target_entity',entity(clean(subjectName),'unspecified'),key+'|target'));
  for(const [name,role] of [['owner_name','owner'],['custodian_name','custodian'],['selected_plan_name','selected_plan']] as const){const label=u.properties[name];if(typeof label==='string')ids.push(addState(record,role,entity(label,role==='selected_plan'?'plan':'unspecified'),key+'|role-'+role));}
  let provenance:EpistemicProvenance={kind:'document',entity_id:document};
  if(u.reporter){const reporter=entity(u.reporter,'person');provenance={kind:'human',entity_id:reporter};ids.push(addState(record,'reporter',reporter,key+'|reporter'));}
  else if(u.observer){const observer=entity(u.observer,'person');provenance={kind:'human',entity_id:observer};ids.push(addState(record,u.families.includes('record-review')?'record_reviewer':'direct_observer',observer,key+'|observer'));}
  const sensor=u.span.match(/(?:^|[、\s])([^、。]{1,25}?センサー)/)?.[1];
  if(u.families.includes('measurement')&&sensor&&!u.reporter)provenance={kind:'sensor',entity_id:entity(clean(sensor),'device')};
  if(u.families.includes('container-identity')){
    for(const [role,pattern,kind] of [['container',/容器|袋/,'asset'],['label',/ラベル/,'document'],['contents',/内容物|中身|試料|遺物/,'asset'],['presumed_participant',/参加者|由来主体/,'person'],['registry_record',/電子.*記録|電子台帳|台帳/,'document']] as const){if(pattern.test(u.span))ids.push(addState(record,role,entity(role+' '+fingerprint(input.input_text),kind),key+'|identity-'+role));}
  }
  if(u.properties.reported_observer_name){const observer=entity(String(u.properties.reported_observer_name),'person');ids.push(addState(record,'reported_observer',observer,key+'|reportedObserver'));}
  if(u.intermediary)ids.push(addState(record,'intermediary',entity(u.intermediary,'person'),key+'|intermediary'));
  if(u.record)ids.push(addState(record,'source_record',entity(u.record+' '+fingerprint(u.span),'document'),key+'|sourceRecord'));
  const observation=fingerprint(state.project.id+'|nl-obs|'+key);ids.push(observation);operations.push({op:'upsert',entity:'epistemic_observation',entity_id:observation,payload:{...common(observation),kind:u.families.includes('record-review')?'record_review':u.families.includes('measurement')?'measurement_record':u.observer?'direct_visual':'textual_report',content:u.span,provenance,subject_ids:[record],observed_at:u.time,recorded_at:now}});
  if(u.families.includes('verification')||u.families.includes('measurement')||u.families.includes('report')){const evidence=fingerprint(state.project.id+'|nl-evidence|'+key);ids.push(evidence);operations.push({op:'upsert',entity:'evidence',entity_id:evidence,payload:{...common(evidence),kind:'observation_ref',observation_id:observation,external_ref:null,summary:u.span,provenance,recorded_at:now}});}
  // Only the bounded declared occurrence, never selected→executed or after→caused.
  if(!u.reporter&&!['hypothetical','predicted','unknown','unresolved'].includes(u.qualification)) for(const kind of u.eventKinds){const uid=fingerprint(state.project.id+'|nl-event|'+key+'|'+kind);ids.push(uid);operations.push({op:'upsert',entity:'reality_event',entity_id:uid,payload:{...common(uid),kind,subject_ids:[],summary:u.span,occurred_at:u.time,recorded_at:now}});}
  targets.push({unit:index,ids});
 });
 const legacy=randomUUID();operations.push({op:'upsert',entity:'observation',entity_id:legacy,payload:{...common(legacy),goal_id:null,title:'Reality semantic composition',body:input.input_text,source:input.source??'manual',observed_at:now}});
 // Local bounded proposal budget; do not broaden the legacy 8-op core/extraction safety limit.
 if(operations.length>512){
  const retained=operations.filter(x=>x.entity==='reality_entity'&&x.entity_id===document||x.entity==='observation');operations.splice(0,operations.length,...retained);targets.splice(0);
  const uid=randomUUID();operations.push({op:'upsert',entity:'reality_state',entity_id:uid,payload:{...common(uid),subject_id:document,kind:'interpretation_status',value:'unsupported: local translation budget exceeded',valid_from:now,valid_until:null,recorded_at:now}});
  trace.residuals=units.map(u=>({span:u.span,status:'unsupported',reason:'Local translation budget exceeded; no partial world assertions committed.'}));
 }
 const patch:StatePatch={schema_version:'0.1.24',project_id:state.project.id,source:'extraction',operations};const validation=validateStatePatch(patch);if(!validation.valid)throw new Error('Canonical translation patch invalid: '+JSON.stringify(validation.errors));const dry=dryRunPatch(state,patch);if(!dry.would_apply)throw new Error('Canonical translation dry-run failed: '+JSON.stringify(dry.errors));
 return {trace,result:{id:randomUUID(),project_id:state.project.id,input_text:input.input_text,summary:'Existing canonical composition; residual semantic units explicitly tracked.',confidence:1,risk_level:'medium',proposed_patch:patch,dry_run_result:dry,requires_human_approval:true,created_at:now}};
}
