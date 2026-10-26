import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { stableSerialize, sha256, TARGET_PROJECT } from '../frus-1904-392/package.js';
import { validateDataset, type HistoricalDataset } from '../../experimental/historical-reality/substrate.js';
import { composeInspection } from '../stored-inspection.js';
import { applyPatch } from '../../state-engine.js';
import { validateProjectState } from '../../validate.js';
import { requireTemporalInstant } from '../../temporal.js';
import { verifyFreeze } from './freeze.js';
import type { ProjectState, StatePatch } from '../../types.js';
export { stableSerialize, sha256, TARGET_PROJECT };
export const BASELINE = 'f45b265afb6f4d9165ac46aa26eb1f16d82bbf94a3739212421bca93463e830b';
export const DATASET_HASH = '5bc32592aa80ee4742f8e01b09d4381dacc1ce080fb930772a7a1ea2b24c70c2';
export const POLICY = 'historical-stored-inspection-v1';
export const BATCH = 'frus-1904-expansion-inspection-v1';
export const DRY_RUN = '2000-01-01T00:00:00.000Z';
export const DELTA = { reality_entities: 7, epistemic_observations: 12, evidence: 12, claims: 0, claim_evidence_links: 0, reality_events: 0, reality_states: 0, observations: 0 };
export const TOTALS = { reality_entities: 11, epistemic_observations: 16, evidence: 16, claims: 0, claim_evidence_links: 0, reality_events: 0, reality_states: 0, observations: 0 };
export const ALLOWED = ['project.updated_at', 'updated_at'];
export interface Report { report_id: string; selected_sha256: string; observation_id: string; evidence_id: string; content: string; }
export interface Group { source_id: string; document_id: string; reports: Report[]; }
interface Manifest { batch_id: string; policy: string; project_id: string; dataset_sha256: string; discovery_sha256: string; groups: Group[]; }
export const manifest: Manifest = JSON.parse(readFileSync(new URL('./selection-manifest.json', import.meta.url), 'utf8'));
export const groups = manifest.groups;
const membership = [['395','c395-captured','c395-sunk','c395-first-fire'],['678','c678-uncertainty','c678-sent'],['679','c679-held'],['680','c680-attack'],['86','c86-request'],['430','c430-consent','c430-guarantee','c430-occupation'],['815','c815-inquiry']];
export function deterministicId(key: string) {
 const h = createHash('sha256').update(`${TARGET_PROJECT}\0${POLICY}:${key}`).digest('hex');
 return `${h.slice(0,8)}-${h.slice(8,12)}-5${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20,32)}`;
}
export function groupIds(g: Group) { return [g.document_id, ...g.reports.flatMap(r => [r.observation_id, r.evidence_id])]; }
export function select(data: HistoricalDataset, g: Group, r: Report): HistoricalDataset {
 const source = data.sources.find(s => s.id === g.source_id), report = data.claims.find(c => c.id === r.report_id);
 assert(source && report && report.source_id === source.id && report.extraction.status === 'researcher_paraphrase');
 const selected = {schema_version:data.schema_version, actors:structuredClone(data.actors), sources:[structuredClone(source)], claims:[structuredClone(report)], evidence_relations:structuredClone(data.evidence_relations.filter(x=>x.source_id===source.id&&x.claim_id===report.id)), actor_epistemic_records:structuredClone(data.actor_epistemic_records.filter(x=>x.source_id===source.id&&x.claim_id===report.id)), reconstructions:[], interpretations:[], narratives:[]};
 validateDataset(selected); assert.equal(sha256(stableSerialize(selected)), r.selected_sha256);
 return selected;
}
export function inputs() {
 assert.equal(manifest.batch_id,BATCH); assert.equal(manifest.policy,POLICY); assert.equal(manifest.project_id,TARGET_PROJECT); assert.equal(manifest.dataset_sha256,DATASET_HASH);
 const bytes=readFileSync(new URL('../../experimental/historical-reality/round1.dataset.json',import.meta.url)); assert.equal(sha256(bytes),DATASET_HASH);
 const data=JSON.parse(bytes.toString()) as HistoricalDataset; validateDataset(data);
 const discovery=readFileSync(new URL('./discovery-source.md',import.meta.url),'utf8'); assert.equal(sha256(discovery),manifest.discovery_sha256);
 assert.deepEqual(groups.map(g=>[g.source_id,...g.reports.map(r=>r.report_id)]),membership.map(([n,...reports])=>[`frus:1904:${n}`,...reports]));
 assert.equal(new Set(groups.flatMap(groupIds)).size,31);
 return groups.map(g=>{
  assert.equal(g.document_id,deterministicId(`document:${g.source_id}`));
  const section=discovery.split(`\n## ${g.source_id} — `)[1]?.split('\n## ')[0]; assert(section?.includes(`Document ID案: \`${g.document_id}\``));
  return {group:g,reports:g.reports.map(r=>{
   assert.equal(r.observation_id,deterministicId(`inspection-result:${g.source_id}:${r.report_id}`)); assert.equal(r.evidence_id,deterministicId(`inspection-evidence:${g.source_id}:${r.report_id}`));
   const review=section.split(`\n### ${r.report_id}\n`)[1]?.split('\n### ')[0]; assert(review);
   assert.equal(review.match(/Selected input SHA-256: `([^`]+)`/)?.[1],r.selected_sha256);
   assert.equal(review.match(/Observation ID案: `([^`]+)`/)?.[1],r.observation_id);
   assert.equal(review.match(/Evidence ID案: `([^`]+)`/)?.[1],r.evidence_id);
   assert.equal(review.match(/Recorded researcher-authored paraphrase: [^\n]+/)?.[0],r.content);
   assert(r.content.startsWith('Recorded researcher-authored paraphrase: '));
   const selected=select(data,g,r);assert.equal(readFileSync(new URL(`./selected-${r.report_id}.json`,import.meta.url),'utf8'),stableSerialize(selected));return {report:r,selected};
  })};
 });
}
/** One Document operation per source; reuse the established semantic composer for each report. */
export function patch(state: ProjectState, recordedAt: string): StatePatch {
 assert.equal(state.project.id,TARGET_PROJECT); requireTemporalInstant(recordedAt);
 const operations: StatePatch['operations']=[];
 for(const {group,reports} of inputs()) {
  let document: StatePatch['operations'][number] | undefined;
  for(const {report,selected} of reports) {
   const ops=composeInspection(state,recordedAt,{ids:{document:group.document_id,observation:report.observation_id,evidence:report.evidence_id},source:selected.sources[0],reportRef:`round1.dataset.json#claims/${report.report_id}`,content:report.content}).operations;
   if(!document){document=ops[0];operations.push(document);}else assert.deepEqual(document,ops[0]);
   operations.push(...ops.slice(1));
  }
 }
 assert.equal(operations.length,31); assert.equal(new Set(operations.map(o=>o.entity_id)).size,31);
 return {schema_version:state.schema_version,project_id:TARGET_PROJECT,source:'import',operations};
}
export function recordHashes(state: ProjectState) {
 const records=[...state.reality_entities,...state.epistemic_observations,...state.evidence];
 return Object.fromEntries(groups.flatMap(groupIds).map(id=>{const matches=records.filter(r=>r.id===id);assert.equal(matches.length,1);return [id,sha256(stableSerialize(matches[0]))];}));
}
export function prepared(packageCommit: string, packageFingerprint: string) {
 assert.match(packageCommit,/^[0-9a-f]{40}$/);assert.match(packageFingerprint,/^[0-9a-f]{64}$/);assert.equal(packageFingerprint,verifyFreeze(),'Package fingerprint mismatch');
 return {status:'PREPARED' as const,batch_id:BATCH,target_project:TARGET_PROJECT,expected_before_fingerprint:BASELINE,dataset_hash:DATASET_HASH,selected_input_hashes:groups.flatMap(g=>g.reports.map(r=>r.selected_sha256)),package_commit:packageCommit,package_fingerprint:packageFingerprint,source_ids:groups.map(g=>g.source_id),report_ids:groups.flatMap(g=>g.reports.map(r=>r.report_id)),generated_ids:groups.flatMap(groupIds),expected_report_sets:groups.map(g=>({source_id:g.source_id,document_id:g.document_id,report_ids:g.reports.map(r=>r.report_id)})),per_document_preflight:groups.map(g=>({source_id:g.source_id,status:'NOT_APPLIED'})),batch_preflight:'READY',expected_delta:DELTA,allowed_metadata_delta:ALLOWED,writer_owner:'ground-local-cli-v0',after_fingerprint:'UNBOUND',final_recorded_at:'UNBOUND',final_record_hashes:'UNBOUND',independent_read:'UNBOUND'};
}
export function validatePrepared(value: unknown) {
 const v=value as ReturnType<typeof prepared>;assert(v);assert.deepEqual(v,prepared(v.package_commit,v.package_fingerprint));
}
export interface Completion {status:'COMPLETED'; prepared:ReturnType<typeof prepared>; recorded_at:string; after_fingerprint:string; record_hashes:Record<string,string>; independent_read_fingerprint:string;}
export function validateCompletion(value: unknown): asserts value is Completion {
 const v=value as Completion;assert(v);assert.deepEqual(Object.keys(v).sort(),['status','prepared','recorded_at','after_fingerprint','record_hashes','independent_read_fingerprint'].sort());
 assert.equal(v.status,'COMPLETED');validatePrepared(v.prepared);requireTemporalInstant(v.recorded_at);assert.match(v.after_fingerprint,/^[0-9a-f]{64}$/);assert.equal(v.independent_read_fingerprint,v.after_fingerprint);
 assert.deepEqual(Object.keys(v.record_hashes).sort(),groups.flatMap(groupIds).sort());for(const h of Object.values(v.record_hashes))assert.match(h,/^[0-9a-f]{64}$/);
}
export type Status='NOT_APPLIED'|'ALREADY_APPLIED_EXACT'|'PARTIAL_OR_DIFFERENT';
/** Initial batch scope: any record touching a selected Document/report identity must match the closed expected set. This is not a global prohibition on future Observations. */
export function preflight(state: ProjectState, receipt?: Completion) {
 const checked=inputs(); let valid=state.project.id===TARGET_PROJECT&&validateProjectState(state).valid;
 if(receipt)try{validateCompletion(receipt);}catch{valid=false;}
 const expected=valid&&receipt?patch(state,receipt.recorded_at).operations:[];
 const arrays=Object.entries(state).filter(([,v])=>Array.isArray(v)) as [string,Array<Record<string,unknown>>][];
 const per_document=checked.map(({group:g,reports}):{source_id:string;status:Status}=>{
  const bad=():{source_id:string;status:Status}=>({source_id:g.source_id,status:'PARTIAL_OR_DIFFERENT'});
  if(!valid)return bad();
  const ids=new Set(groupIds(g)),refs=new Set(g.reports.map(r=>`round1.dataset.json#claims/${r.report_id}`));
  const source=reports[0].selected.sources[0];
  const touches=(v:unknown):boolean=>typeof v==='string'?(ids.has(v)||refs.has(v)||v===g.source_id||v===source.url):Array.isArray(v)?v.some(touches):v!==null&&typeof v==='object'?Object.values(v).some(touches):false;
  const found=arrays.flatMap(([collection,records])=>records.filter(touches).map(record=>({collection,record})));
  if(!found.length)return {source_id:g.source_id,status:'NOT_APPLIED'};
  if(!receipt||found.length!==ids.size)return bad();
  for(const id of ids){
   const matches=found.filter(x=>x.record.id===id);if(matches.length!==1)return bad();
   const {collection,record}=matches[0];const collectionExpected=id===g.document_id?'reality_entities':g.reports.some(r=>r.observation_id===id)?'epistemic_observations':'evidence';if(collection!==collectionExpected)return bad();
   const target=expected.find(o=>o.entity_id===id)!.payload as Record<string,unknown>;
   const {updated_at:actualUpdated,...actualRest}=record,{updated_at:dryUpdated,...targetRest}=target;
   if(stableSerialize(actualRest)!==stableSerialize(targetRest)||receipt.record_hashes[id]!==sha256(stableSerialize(record)))return bad();
  }
  return {source_id:g.source_id,status:'ALREADY_APPLIED_EXACT'};
 });
 // A completed receipt with an entirely absent batch is inconsistent, not READY.
 const allAbsent=per_document.every(x=>x.status==='NOT_APPLIED');
 return {per_document,gate:allAbsent&&!receipt?'READY':per_document.every(x=>x.status==='ALREADY_APPLIED_EXACT')?'NO_OP':'HOLD'} as const;
}
export function audit(before: ProjectState, after: ProjectState, recordedAt: string) {
 assert.equal(validateProjectState(after).valid,true);assert.equal(after.project.id,TARGET_PROJECT);
 for(const [key,n] of Object.entries(DELTA))assert.equal((after[key as keyof ProjectState] as unknown[]).length-(before[key as keyof ProjectState] as unknown[]).length,n);
 const changed=new Set(['reality_entities','epistemic_observations','evidence','project','updated_at']);
 assert.deepEqual(Object.keys(after).sort(),Object.keys(before).sort());
 for(const key of Object.keys(before))if(!changed.has(key))assert.deepEqual(after[key as keyof ProjectState],before[key as keyof ProjectState]);
 for(const key of ['reality_entities','epistemic_observations','evidence'] as const)assert.deepEqual(after[key].slice(0,before[key].length),before[key]);
 const {updated_at:a,...ap}=after.project,{updated_at:b,...bp}=before.project;assert.deepEqual(ap,bp);
 requireTemporalInstant(after.updated_at);assert.equal(after.project.updated_at,after.updated_at);
 const records=[...after.reality_entities,...after.epistemic_observations,...after.evidence];
 for(const op of patch(before,recordedAt).operations){const actual=records.filter(r=>r.id===op.entity_id);assert.equal(actual.length,1);const {updated_at:x,...aa}=actual[0];const {updated_at:y,...bb}=op.payload as Record<string,unknown>;assert.deepEqual(aa,bb);assert.equal(x,after.updated_at);}
}
export function dry(state: ProjectState) {
 assert.equal(preflight(state).gate,'READY');const candidate=patch(state,DRY_RUN),after=applyPatch(state,candidate);audit(state,after,DRY_RUN);
 return {after,review:{batch_id:BATCH,final_recorded_at:'UNBOUND',dry_run_recorded_at:DRY_RUN,expected_delta:DELTA,expected_totals:TOTALS,allowed_metadata_delta:ALLOWED,mutation_updated_at:'UNBOUND: existing applyPatch clock; never normalized backwards',groups:groups.map(g=>({source_id:g.source_id,document_id:g.document_id,expected_reports:g.reports.map(r=>r.report_id),records:candidate.operations.filter(o=>groupIds(g).includes(o.entity_id)).map(o=>({source_id:g.source_id,report_id:g.reports.find(r=>r.observation_id===o.entity_id||r.evidence_id===o.entity_id)?.report_id??null,record:o.payload,sha256:sha256(stableSerialize(o.payload))}))}))}};
}
