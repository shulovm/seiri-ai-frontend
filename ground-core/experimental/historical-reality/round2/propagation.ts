/** Sparse, attributed propagation extension. Never a world-truth or historical-actor belief engine. */
import {createHash} from 'node:crypto';
import {actorEvidenceAt, validateDataset, type HistoricalDataset, type HistoricalTime} from '../substrate.js';
export interface Node {id:string; stage:string; actor_id:string; time:HistoricalTime & {clock:unknown;place:unknown;normalized_instant:unknown};claim_ids:string[];attestation_form:string}
export interface Round2 {
 schema_version:'historical-reality-experimental/round2';parent:{path:string;sha256:string;landscape_sha256:string};delta:Pick<HistoricalDataset,'actors'|'sources'|'claims'|'evidence_relations'|'actor_epistemic_records'|'reconstructions'|'interpretations'|'narratives'>;
 propagation:{nodes:Node[];edges:{id:string;from_id:string;to_id:string;relation:string;claim_ids:string[];limit:string}[];actor_records:{id:string;actor_id:string;node_id:string;claim_id:string;stance:string;payload:string;limit:string}[];assessments:{id:string;target:{kind:string;claim_id:string};status:string;reason:string;claim_ids:string[]}[];reply_lifecycle:{role:string;status:string;claim_ids:string[];unknown_reason:string}[];missing_evidence:{id:string;classification:string;target:string;reason:string;absence_inference:boolean}[];source_availability:Record<string,{documented_publication_reference:string;limit:string}>};
 assets:{source_id:string;path:string;sha256:string;pages:number;bytes:number}[];
}
export function materializeRound2(parentBytes:string,round:Round2):HistoricalDataset {
 if(round.schema_version!=='historical-reality-experimental/round2') throw new Error('Unsupported Round2 version');
 if(createHash('sha256').update(parentBytes).digest('hex')!==round.parent.sha256) throw new Error('Parent integrity mismatch');
 const base=JSON.parse(parentBytes) as HistoricalDataset; validateDataset(base);
 const merged=structuredClone(base);
 for(const key of ['actors','sources','claims','evidence_relations','actor_epistemic_records','reconstructions','interpretations','narratives'] as const) {
  (merged[key] as {id:string}[]).push(...structuredClone(round.delta[key]));
 }
 validateDataset(merged);validatePropagation(merged,round);return merged;
}
const unknown=(value:unknown):boolean=>Boolean(value && typeof value==='object' && (value as {status?:string}).status==='unknown' && typeof (value as {reason?:string}).reason==='string' && (value as {reason:string}).reason.length);
export function validatePropagation(data:HistoricalDataset,round:Round2):void {
 const actors=new Set(data.actors.map(x=>x.id)),claims=new Set(data.claims.map(x=>x.id)),sources=new Set(data.sources.map(x=>x.id));
 const nodes=new Map(round.propagation.nodes.map(x=>[x.id,x]));const ids=new Set<string>();
 const ref=(set:Set<string>,id:string)=>{if(!set.has(id))throw new Error(`Dangling propagation reference: ${id}`)};
 const id=(value:string)=>{if(!value||ids.has(value))throw new Error('Duplicate propagation ID');ids.add(value)};
 const day=(value:string)=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value+'T00:00:00Z'))&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;
 for(const n of round.propagation.nodes){id(n.id);ref(actors,n.actor_id);if(!n.claim_ids.length)throw new Error('Node requires attestation');n.claim_ids.forEach(x=>ref(claims,x));
  if(!['observation','record','message','transmission','receipt','interpretation','decision','order','action','publication','source_possession'].includes(n.stage))throw new Error('Unsupported attested stage');
  if(!['source_asserts','source_reports_actor_assertion','later_reconstruction','current_inference'].includes(n.attestation_form))throw new Error('Missing reporting form');
  if((typeof n.time.clock!=='string'&&!unknown(n.time.clock))||(typeof n.time.place!=='string'&&!unknown(n.time.place)))throw new Error('Clock/place representation required');
  if(typeof n.time.normalized_day==='string'&&n.time.precision!=='day')throw new Error('No precision synthesis');
  if(!n.time.raw || (typeof n.time.normalized_day==='string'?!day(n.time.normalized_day):!unknown(n.time.normalized_day)))throw new Error('Invalid propagation time');
  if(!unknown(n.time.time_standard)||!unknown(n.time.normalized_instant))throw new Error('This round has no verified UTC standard');
 }
 for(const e of round.propagation.edges){id(e.id);if(!nodes.has(e.from_id)||!nodes.has(e.to_id)||e.from_id===e.to_id)throw new Error('Invalid propagation edge');if(!e.limit||!e.claim_ids.length)throw new Error('Unattested edge');e.claim_ids.forEach(x=>ref(claims,x));}
 for(const r of round.propagation.actor_records){id(r.id);ref(actors,r.actor_id);ref(claims,r.claim_id);const n=nodes.get(r.node_id);if(!n||n.actor_id!==r.actor_id||!n.claim_ids.includes(r.claim_id))throw new Error('Actor scope/attestation mismatch');if(!r.limit||!r.payload)throw new Error('Epistemic boundary required');
  if(!['receipt_annotated','acknowledged_message','references_instruction','authored_report','distribution_reported'].includes(r.stance))throw new Error('Unsupported actor stance');
  if(r.stance==='receipt_annotated'&&n.stage!=='receipt')throw new Error('Receipt cannot be inferred from dispatch');
 }
 for(const a of round.propagation.assessments){id(a.id);ref(claims,a.target.claim_id);a.claim_ids.forEach(x=>ref(claims,x));if(!['source_assertion','external_reality'].includes(a.target.kind)||!['strongly_established','possible','unresolved'].includes(a.status)||!a.reason||!a.claim_ids.includes(a.target.claim_id))throw new Error('Assessment target and basis required');}
 for(const l of round.propagation.reply_lifecycle){if(!l.unknown_reason||!['unknown','reported_candidates'].includes(l.status)||(l.status==='unknown'&&l.claim_ids.length))throw new Error('Lifecycle uncertainty required');l.claim_ids.forEach(x=>ref(claims,x));}
 for(const m of round.propagation.missing_evidence){id(m.id);if(!['source_searched_and_not_found','known_to_have_existed_but_unavailable','source_may_have_existed','archive_incomplete','document_lost','actor_left_no_known_record','no_evidence_currently_located','evidence_suggests_absence'].includes(m.classification)||!m.reason||m.absence_inference!==false)throw new Error('No missing-evidence truth promotion');}
 for(const [s,a] of Object.entries(round.propagation.source_availability)){ref(sources,s);if(!day(a.documented_publication_reference)||!a.limit)throw new Error('Availability lower bound requires limit');}
 for(const a of round.assets){ref(sources,a.source_id);if(!/^[a-f0-9]{64}$/.test(a.sha256)||a.path.startsWith('/')||a.path.split('/').includes('..')||a.pages<1||a.bytes<1)throw new Error('Invalid asset provenance');}
}
/** Gregorian day query; no sorting across unverified local clocks, or reading from receipt. */
export function actorPropagationAt(data:HistoricalDataset,round:Round2,actor:string,day:string){
 validatePropagation(data,round);
 if(!data.actors.some(x=>x.id===actor))throw new Error('Unknown actor');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||Number.isNaN(Date.parse(day+'T00:00:00Z'))||new Date(day+'T00:00:00Z').toISOString().slice(0,10)!==day)throw new Error('Gregorian day required');
 const rows=round.propagation.actor_records.filter(r=>r.actor_id===actor).map(r=>({...r,node:round.propagation.nodes.find(n=>n.id===r.node_id)!}));
 return {actor_id:actor,day,inherited_round1_records:actorEvidenceAt(data,actor,day),documented_before_day:rows.filter(r=>typeof r.node.time.normalized_day==='string'&&r.node.time.normalized_day<day),same_day_order_unknown:rows.filter(r=>r.node.time.normalized_day===day),unplaced:rows.filter(r=>typeof r.node.time.normalized_day!=='string'),conclusion:'Retrospective documentary attestation only. Empty results mean no record in this layer; never actor ignorance, continued belief or contemporary public access.'};
}
export function publicAvailabilityAt(round:Round2,source:string,day:string){if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||Number.isNaN(Date.parse(day+'T00:00:00Z'))||new Date(day+'T00:00:00Z').toISOString().slice(0,10)!==day)throw new Error('Gregorian day required');const a=round.propagation.source_availability[source];return !a?'unknown':day<a.documented_publication_reference?'before_documented_publication_reference_access_unknown':'individual_access_and_reading_unknown';}
export function tracePropagation(data:HistoricalDataset,round:Round2,nodeId:string){validatePropagation(data,round);const node=round.propagation.nodes.find(x=>x.id===nodeId);if(!node)throw new Error('Unknown node');const claims=data.claims.filter(x=>node.claim_ids.includes(x.id));return {node,claims,relations:data.evidence_relations.filter(x=>node.claim_ids.includes(x.claim_id)),sources:data.sources.filter(x=>claims.some(c=>c.source_id===x.id))};}
