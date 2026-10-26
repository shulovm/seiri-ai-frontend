import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, isAbsolute, resolve, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { stableSerialize, sha256, TARGET_PROJECT } from '../frus-1904-392/package.js';
import { validateDataset, type HistoricalDataset } from '../../experimental/historical-reality/substrate.js';
import { composeInspection } from '../stored-inspection.js';
import type { ProjectState, StatePatch } from '../../types.js';
import { applyPatch } from '../../state-engine.js';
import { validateProjectState } from '../../validate.js';
export { stableSerialize, sha256, TARGET_PROJECT };
export const BASELINE = 'f1ed694f3e0c3a10d383e816f43ca003cd6c123dad18c3f0688d2289c0f3e3bc';
export const DATASET_HASH = '5bc32592aa80ee4742f8e01b09d4381dacc1ce080fb930772a7a1ea2b24c70c2';
export const POLICY = 'historical-stored-inspection-v1';
export const BATCH = 'frus-1904-393-394-396-inspection-v1';
export const DRY_RUN = '2000-01-01T00:00:00.000Z'; // shape validation only; never final recording authority
export const rows = [
 {number:'393', report:'c393-termination', hash:'09e92a68333db6e37817ecfcf89780b0ac11b17aea0648fafed65dcb431054d4', content:'Recorded researcher-authored paraphrase: Imperial Japanese Government — declares intention to terminate present negotiations and reserve independent action.'},
 {number:'394', report:'c394-departure', hash:'42bfccf4abef6d79410dc3bcf6fc1914712681ee87ead1baec663a6da3cc0ebe', content:'Recorded researcher-authored paraphrase: Russian minister at Tokyo — expected departure date: 1904-02-12.'},
 {number:'396', report:'c396-declaration', hash:'6572c9855a3f315199cf0c9b82d1e55e356a364609ecd4a0eb8db5f85dea1de5', content:'Recorded researcher-authored paraphrase: Imperial Japanese Government — reported declaration date: 1904-02-10.'},
] as const;
export type Row = typeof rows[number];
export function ids(row: Row) {
 const source = `frus:1904:${row.number}`;
 const id = (key:string) => { const h=createHash('sha256').update(`${TARGET_PROJECT}\0${POLICY}:${key}`).digest('hex'); return `${h.slice(0,8)}-${h.slice(8,12)}-5${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20,32)}`; };
 return {document:id(`document:${source}`),observation:id(`inspection-result:${source}:${row.report}`),evidence:id(`inspection-evidence:${source}:${row.report}`)};
}
export function select(data: HistoricalDataset, row: Row): HistoricalDataset {
 validateDataset(data); const source=data.sources.find(s=>s.id===`frus:1904:${row.number}`), report=data.claims.find(c=>c.id===row.report);
 assert(source && report && report.source_id===source.id && report.extraction.status==='researcher_paraphrase');
 const selected={schema_version:data.schema_version,actors:structuredClone(data.actors),sources:[structuredClone(source)],claims:[structuredClone(report)],evidence_relations:structuredClone(data.evidence_relations.filter(r=>r.source_id===source.id&&r.claim_id===report.id)),actor_epistemic_records:structuredClone(data.actor_epistemic_records.filter(r=>r.source_id===source.id&&r.claim_id===report.id)),reconstructions:[],interpretations:[],narratives:[]};
 validateDataset(selected); assert.equal(sha256(stableSerialize(selected)),row.hash); return selected;
}
export function inputs() {
 const bytes=readFileSync(new URL('../../experimental/historical-reality/round1.dataset.json',import.meta.url));assert.equal(sha256(bytes),DATASET_HASH);
 const data=JSON.parse(bytes.toString());
 assert.equal(readFileSync(new URL('./selection-manifest.json',import.meta.url),'utf8'),stableSerialize({batch_id:BATCH,dataset_sha256:DATASET_HASH,policy:POLICY,selections:rows.map(r=>({...r,ids:ids(r)}))}));
 return rows.map(row=>{const selected=select(data,row);assert.equal(readFileSync(new URL(`./selected-${row.number}.json`,import.meta.url),'utf8'),stableSerialize(selected));return {row,selected};});
}
export function patch(state:ProjectState, recordedAt:string):StatePatch {
 assert.equal(state.project.id,TARGET_PROJECT);
 return {schema_version:state.schema_version,project_id:TARGET_PROJECT,source:'import',operations:inputs().flatMap(({row,selected})=>composeInspection(state,recordedAt,{ids:ids(row),source:selected.sources[0],reportRef:`round1.dataset.json#claims/${row.report}`,content:row.content}).operations)};
}
export type Status='NOT_APPLIED'|'ALREADY_APPLIED_EXACT'|'PARTIAL_OR_DIFFERENT';
export interface Completion {project_id:string; policy:string; batch_id:string; recorded_at:string; selected_input_hashes:string[]; record_hashes:Record<string,string>;}
export function records(state:ProjectState,row:Row) {const i=ids(row);return [state.reality_entities.find(x=>x.id===i.document),state.epistemic_observations.find(x=>x.id===i.observation),state.evidence.find(x=>x.id===i.evidence)];}
export function hashes(state:ProjectState) {return Object.fromEntries(rows.flatMap(row=>records(state,row)).map(r=>{assert(r);return [r.id,sha256(stableSerialize(r))];}));}
export function preflight(state:ProjectState,receipt?:Completion) {
 const checked=inputs();
 const per_document=checked.map(({row,selected}):{source_id:string;status:Status}=>{
 const source=selected.sources[0],i=ids(row),known=new Set(Object.values(i)), ref=`round1.dataset.json#claims/${row.report}`;
 const bad=():{source_id:string;status:Status}=>({source_id:source.id,status:'PARTIAL_OR_DIFFERENT'});
 if(state.project.id!==TARGET_PROJECT||!validateProjectState(state).valid)return bad();
 const docs=state.reality_entities.filter(x=>known.has(x.id)||x.attrs?.source_id===source.id||x.attrs?.experimental_source_identity===source.id||x.attrs?.url===source.url);
 const obs=state.epistemic_observations.filter(x=>known.has(x.id)||x.subject_ids.includes(i.document)||x.provenance.external_id===ref||x.provenance.entity_id===i.document);
 const ev=state.evidence.filter(x=>known.has(x.id)||x.observation_id===i.observation||x.external_ref===source.url||x.provenance.external_id===ref||x.provenance.entity_id===i.document);
 const all=Object.values(state).filter(Array.isArray).flat().filter(x=>x&&known.has(x.id));
 // Any additional canonical record referencing this chain is outside this package's authority.
 const references=(v:unknown):boolean=> typeof v==='string'?known.has(v):Array.isArray(v)?v.some(references):v!==null&&typeof v==='object'?Object.values(v).some(references):false;
 for(const collection of Object.values(state).filter(Array.isArray))for(const r of collection)if(r&&!known.has(r.id)&&references(r))return bad();
 if(!docs.length&&!obs.length&&!ev.length&&!all.length)return {source_id:source.id,status:receipt?'PARTIAL_OR_DIFFERENT':'NOT_APPLIED'};
 if(!receipt||docs.length!==1||obs.length!==1||ev.length!==1||all.length!==3||docs[0].id!==i.document||obs[0].id!==i.observation||ev[0].id!==i.evidence)return bad();
 if(receipt.project_id!==TARGET_PROJECT||receipt.policy!==POLICY||receipt.batch_id!==BATCH||stableSerialize(receipt.selected_input_hashes)!==stableSerialize(rows.map(r=>r.hash)))return bad();
 try {
 const expected=patch(state,receipt.recorded_at).operations.filter(o=>known.has(o.entity_id));
 for(const actual of [docs[0],obs[0],ev[0]]){
 const target=expected.find(o=>o.entity_id===actual.id)!.payload as Record<string,unknown>;
 const {updated_at:a,...aa}=actual, {updated_at:b,...bb}=target;
 if(stableSerialize(aa)!==stableSerialize(bb)||receipt.record_hashes[actual.id]!==sha256(stableSerialize(actual)))return bad();
 }
 const expectedKeys=rows.flatMap(r=>Object.values(ids(r))).sort();if(stableSerialize(Object.keys(receipt.record_hashes).sort())!==stableSerialize(expectedKeys))return bad();
 return {source_id:source.id,status:'ALREADY_APPLIED_EXACT'};
 }catch{return bad();}
 });
 return {per_document,gate:per_document.every(x=>x.status==='NOT_APPLIED')?'READY':per_document.every(x=>x.status==='ALREADY_APPLIED_EXACT')?'NO_OP':'HOLD'} as const;
}
export const DELTA={reality_entities:3,epistemic_observations:3,evidence:3,claims:0,claim_evidence_links:0,reality_events:0,reality_states:0,observations:0};
export const ALLOWED=['project.updated_at','updated_at'];
export function audit(before:ProjectState,after:ProjectState) {
 assert.equal(validateProjectState(after).valid,true);
 for(const [key,n] of Object.entries(DELTA))assert.equal((after as any)[key].length-(before as any)[key].length,n);
 for(const key of Object.keys(before))if(!['reality_entities','epistemic_observations','evidence','project','updated_at'].includes(key))assert.deepEqual((after as any)[key],(before as any)[key]);
 for(const key of ['reality_entities','epistemic_observations','evidence'] as const)assert.deepEqual(after[key].slice(0,before[key].length),before[key]);
 const {updated_at:a,...ap}=after.project,{updated_at:b,...bp}=before.project;assert.deepEqual(ap,bp);
 for(const row of rows){const [d,o,e]=records(after,row);assert(d&&o&&e);assert.deepEqual((o as any).subject_ids,[d.id]);assert.equal((e as any).observation_id,o.id);}
}
export function dry(state:ProjectState) {
 assert.equal(preflight(state).gate,'READY');const candidate=patch(state,DRY_RUN),after=applyPatch(state,candidate);audit(state,after);
 // Reproducible audit uses patch candidates. Actual mutation clocks are reported separately, not rewritten.
 return {candidate,after,review:{batch_id:BATCH,final_recorded_at:'UNBOUND',dry_run_recorded_at:DRY_RUN,allowed_metadata_delta:ALLOWED,expected_delta:DELTA,records:candidate.operations.map(o=>({source_id:`frus:1904:${rows.find(r=>Object.values(ids(r)).includes(o.entity_id))!.number}`,report_id:rows.find(r=>Object.values(ids(r)).includes(o.entity_id))!.report,record:o.payload,sha256:sha256(stableSerialize(o.payload))})),mutation_updated_at:'UNBOUND: core applyPatch execution clock; audited on every run'}};
}
export function prepared(packageCommit:string,packageHash:string) {
 assert.match(packageCommit,/^[0-9a-f]{40}$/);assert.match(packageHash,/^[0-9a-f]{64}$/);
 return {status:'PREPARED',batch_id:BATCH,project_id:TARGET_PROJECT,expected_before_fingerprint:BASELINE,dataset_hash:DATASET_HASH,selected_input_hashes:rows.map(r=>r.hash),package_commit:packageCommit,package_hash:packageHash,generated_ids:rows.map(r=>ids(r)),per_document_preflight:rows.map(r=>({source_id:`frus:1904:${r.number}`,status:'NOT_APPLIED'})),expected_delta:DELTA,allowed_metadata_delta:ALLOWED,writer_owner:'ground-local-cli-v0',after_fingerprint:'UNBOUND',final_recorded_at:'UNBOUND',final_record_hashes:'UNBOUND',independent_read:'UNBOUND'};
}
export function validatePrepared(value:unknown) {
 const v=value as ReturnType<typeof prepared>;assert(v);assert.deepEqual(v,prepared(v.package_commit,v.package_hash));
}
/** Operations bytes only; never writes a Project discovery directory. Caller must hold owner during future publish preparation. */
export function backup(bytes:Buffer,operationsDir:string,liveRoot:string) {
 assert(isAbsolute(operationsDir)&&isAbsolute(liveRoot));const rel=relative(resolve(liveRoot),resolve(operationsDir));assert(rel.startsWith('..'+ '/')||rel==='..');
 assert.equal(sha256(bytes),BASELINE);mkdirSync(operationsDir,{recursive:true});const path=join(operationsDir,'before-project-state.bytes');writeFileSync(path,bytes,{flag:'wx',mode:0o400});assert.equal(sha256(readFileSync(path)),BASELINE);return path;
}
