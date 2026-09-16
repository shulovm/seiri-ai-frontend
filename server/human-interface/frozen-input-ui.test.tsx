import React from 'react';
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {renderToStaticMarkup} from 'react-dom/server';
import {tsImport} from 'tsx/esm/api';
const {default:View, FrozenInputFailure}=await tsImport('../../src/human-interface/FrozenInputView.jsx',import.meta.url);
const {default:Panel}=await tsImport('../../src/human-interface/FrozenInputPanel.jsx',import.meta.url);
const {fetchProvenanceSource}=await tsImport('../../src/human-interface/provenance-client.js',import.meta.url);
const {createProvenanceRegistry}=await tsImport('./provenance-source.ts',import.meta.url);
import {readFileSync} from 'node:fs';
const manifest=JSON.parse(readFileSync('fixtures/human-interface/provenance/historical-round1-v1/manifest.json','utf8'));
const registry=createProvenanceRegistry(),fingerprint='9ff0d8070296d2d5493b618b13d75beab003581a6f7011ae642a53f46fc453cf';
const escape=(s:string)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
function response(b:any){const r=registry.read(b.project_id,b.entity_id,b.observation_id);return {transport:{contract:'human-interface-provenance-source.v1',project_snapshot_fingerprint:fingerprint,package_commit:r.package.commit,selected_input_fingerprint:r.inputHash,receipt_fingerprint:r.receiptHash},canonical_binding_context:{project_id:b.project_id,entity_id:b.entity_id,observation_id:b.observation_id,provenance:b.expected_provenance},frozen_selected_input:{input_schema:r.input.schema_version,source:r.input.sources[0],report:r.input.claims[0],relevant_actors:r.input.actors},raw_selected_input:r.raw};}
test('all 16 frozen inputs preserve report/raw/metadata without quote/truth relabeling',()=>{
 for(const b of manifest.bindings){const r=response(b),html=renderToStaticMarkup(<View response={r}/>);assert.ok(html.includes(escape(r.raw_selected_input)));assert.ok(html.includes(`<code>${b.report_id}</code>`));assert.ok(html.includes('projection input'));assert.ok(html.includes('projection output'));assert.ok(html.includes('External source URL'));assert.ok(html.includes(`href="${r.frozen_selected_input.source.url}"`));assert.ok(html.includes('Raw selected input · complete registered artifact'));assert.match(html,/<details class="hi-frozen-operations"><summary>Operations \/ binding metadata/);assert.ok(html.includes(r.transport.selected_input_fingerprint));assert.doesNotMatch(html,/Original text|Source quote|Verify source|Confirm truth|View proof|Trusted source/);}
});
test('every Observation gets same closed lazy disclosure, including unsupported provenance, with no initial fetch',()=>{
 for(const provenance of [manifest.bindings[0].expected_provenance,{kind:'human',entity_id:'human-id'}]){const html=renderToStaticMarkup(<Panel projectId="project" entityId="entity" observation={{id:'observation',provenance}} fingerprint={fingerprint} hasIndex={true}/>);assert.match(html,/<details class="hi-frozen-panel"/);assert.doesNotMatch(html,/<details[^>]+open=|hi-frozen-result|role="status"/);assert.ok(html.includes('View frozen inspection input'));assert.ok(html.includes('href="#observation-index"'));}
});
test('client sends only scoped URL and displayed snapshot header, and rejects mismatched context',async()=>{
 const b=manifest.bindings[0],r=response(b),args={projectId:b.project_id,entityId:b.entity_id,observationId:b.observation_id,fingerprint};let calls=0;
 const fetcher=async(url:string,options:any)=>{calls++;assert.equal(url,`/api/human-interface/reality/${b.project_id}/${b.entity_id}/observations/${b.observation_id}/provenance-source`);assert.equal(options.method,'GET');assert.deepEqual(options.headers,{'If-Ground-Snapshot-Fingerprint':fingerprint});return {ok:true,status:200,json:async()=>r};};
 assert.deepEqual(await fetchProvenanceSource(args,{fetcher}),r);assert.equal(calls,1);
 for(const change of [(v:any)=>v.canonical_binding_context.observation_id='other',(v:any)=>v.transport.project_snapshot_fingerprint='other']){const wrong=structuredClone(r);change(wrong);await assert.rejects(()=>fetchProvenanceSource(args,{fetcher:async()=>({ok:true,status:200,json:async()=>wrong})}),(e:any)=>e.code==='INVALID_PROVENANCE_RESPONSE');}
});
test('source errors remain classified, no automatic retry or new snapshot request',async()=>{
 for(const code of ['PROVENANCE_SOURCE_UNSUPPORTED','PROVENANCE_SOURCE_UNAVAILABLE','PROVENANCE_INPUT_INTEGRITY_FAILURE','SNAPSHOT_MISMATCH','OBSERVATION_BINDING_MISMATCH']){let calls=0;await assert.rejects(()=>fetchProvenanceSource({projectId:'p',entityId:'e',observationId:'o',fingerprint},{fetcher:async()=>{calls++;return {ok:false,status:409,json:async()=>({transport_error:{code}})};}}),(e:any)=>e.code===code);assert.equal(calls,1);const html=renderToStaticMarkup(<FrozenInputFailure error={{code}}/>);assert.ok(html.includes('role="alert"'));assert.ok(html.includes(code));assert.doesNotMatch(html,/<main|data-record-type|hi-frozen-result/);}
});
