import React from 'react';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { tsImport } from 'tsx/esm/api';
const {default:View}=await tsImport('../../src/human-interface/RealityReadView.jsx',import.meta.url);
const {createHumanRealityReader}=await tsImport('./read-adapter.ts',import.meta.url);
const {createHumanSourceResolver,LIVE_PROJECT_ID}=await tsImport('./source-resolver.ts',import.meta.url);
const {realitySourceRegistry:registry}=await tsImport('./source-registry.ts',import.meta.url);
const reader=createHumanRealityReader(createHumanSourceResolver());
const b15=registry.sources[1];
const response=reader(b15.project_id,b15.entity_id);
const render=(r:typeof response)=>renderToStaticMarkup(<View response={r}/>);
const escape=(s:string)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
test('B15 displays both Observation scopes including explicit zero, and preserves Evidence raw fields',()=>{
 const html=render(response);
 assert.equal((html.match(/aria-label="Evidence linked to this Observation"/g)||[]).length,2);
 assert.ok(html.includes('このread scopeで返された明示参照Evidence records: 0'));
 assert.ok(html.includes('このread scopeで返された明示参照Evidence records: 1'));
 for(const bundle of response.core_read_results.evidence_for_observation){
  assert.ok(html.includes(`data-observation-id="${bundle.observation_id}"`));
  for(const e of bundle.evidence){assert.ok(html.includes(escape(JSON.stringify(e,null,2))));assert.ok(html.includes(`data-record-id="${e.id}"`));}
 }
 assert.ok(html.includes('Evidence.observation_id → EpistemicObservation.id'));
 assert.doesNotMatch(html,/No evidence exists|Unsupported|Unverified|Verified by|Confirmed by|Trusted source/);
});
test('zero Observations create no Observation Evidence sections; Claim Evidence remains in its own context',()=>{
 for(const source of [registry.sources[0],registry.sources[2]]){
  const result=reader(source.project_id,source.entity_id),html=render(result);
  assert.ok(!html.includes('aria-label="Evidence linked to this Observation"'));
  assert.ok(html.includes('Claim-linked Evidence · read scope'));
  assert.ok(html.includes('ProjectState 全体の Evidence 件数ではありません'));
 }
});
test('presentation maps all returned Evidence in response order without representative selection',()=>{
 // Render-only transport case, never a canonical fixture or stored record.
 const result=structuredClone(response),bundle=result.core_read_results.evidence_for_observation.find(b=>b.evidence.length)!;
 bundle.evidence.push({...bundle.evidence[0],id:'00000000-0000-4000-8000-000000000001'});
 const html=render(result);assert.ok(html.indexOf(`data-record-id="${bundle.evidence[0].id}"`)<html.indexOf(`data-record-id="${bundle.evidence[1].id}"`));
 assert.ok(html.includes('このread scopeで返された明示参照Evidence records: 2'));
});
test('missing bundle is not invented as a zero match',()=>{
 const result=structuredClone(response);result.core_read_results.evidence_for_observation=[];
 const html=render(result);assert.ok(html.includes('read resultが提供されていません'));assert.ok(!html.includes('明示参照Evidence records: 0'));
});
test('actual live response renders Observation 1 / Evidence 1 unchanged',{skip:!process.env.GROUND_RUNTIME_CONFIG},()=>{
 const r=createHumanRealityReader(createHumanSourceResolver({runtimeConfigPath:process.env.GROUND_RUNTIME_CONFIG}))(LIVE_PROJECT_ID,'fbdfd235-1a5b-5a5d-ad30-6f2c170fe9f9');
 assert.equal(r.transport.source.snapshot_fingerprint,'f1ed694f3e0c3a10d383e816f43ca003cd6c123dad18c3f0688d2289c0f3e3bc');
 const html=render(r);assert.equal(r.core_read_results.evidence_for_observation.length,1);
 const e=r.core_read_results.evidence_for_observation[0].evidence[0];assert.equal(e.id,'3151b313-d5bc-5b58-a17d-a61add22f22d');
 assert.ok(html.includes(escape(JSON.stringify(e,null,2))));assert.ok(html.includes('Reference to the recorded document-inspection result.'));
 assert.ok(html.includes('external_ref'));assert.ok(html.includes('<code>null</code>'));
});
