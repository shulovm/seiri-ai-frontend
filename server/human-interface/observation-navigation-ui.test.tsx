import React from 'react';
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {renderToStaticMarkup} from 'react-dom/server';
import {tsImport} from 'tsx/esm/api';
const {default:View}=await tsImport('../../src/human-interface/RealityReadView.jsx',import.meta.url);
const {createHumanRealityReader}=await tsImport('./read-adapter.ts',import.meta.url);
const {createHumanSourceResolver,LIVE_PROJECT_ID}=await tsImport('./source-resolver.ts',import.meta.url);
const {realitySourceRegistry:registry}=await tsImport('./source-registry.ts',import.meta.url);
const reader=createHumanRealityReader(createHumanSourceResolver());
const render=(r:any)=>renderToStaticMarkup(<View response={r}/>);
const escape=(s:string)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
function check(r:any){
 const before=JSON.stringify(r),html=render(r),records=r.canonical_records.observations;
 assert.equal(JSON.stringify(r),before);
 const index=html.match(/<nav id="observation-index"[\s\S]*?<\/nav>/)?.[0];
 assert.equal(Boolean(index),records.length>1);
 assert.equal((html.match(/href="#observation-index"/g)||[]).length,records.length>1?records.length*4:0);
 let last=-1;
 for(const record of records){
  assert.ok(html.includes(`id="observation-${record.id}" class="hi-observation-group hi-anchor" tabindex="-1" role="region" aria-label="EpistemicObservation ${record.id}"`));
  assert.equal((html.match(new RegExp(`id="observation-${record.id}"`,'g'))||[]).length,1);
  assert.ok(html.includes(escape(JSON.stringify(record,null,2))));
  if(index){
   const position=index.indexOf(`href="#observation-${record.id}"`);assert.ok(position>last);last=position;
   assert.ok(index.includes(`>${escape(record.content)}</span>`));
   assert.ok(index.includes(record.id));
   if(record.provenance?.external_id!=null)assert.ok(index.includes(`>${escape(record.provenance.external_id)}</code>`));
  }
 }
 if(index){assert.doesNotMatch(index,/href="https?:|data-record-type="Evidence"|<ol/);assert.ok(index.includes('時間順・重要度を意味しません'));}
 assert.doesNotMatch(html,/Previous Observation|Next Observation/);
}
test('saved B15 two-Observation index preserves content, identity, response order and Evidence scopes',()=>check(reader(registry.sources[1].project_id,registry.sources[1].entity_id)));
test('saved zero-Observation proofs omit index and retain Claim collections',()=>{
 for(const source of [registry.sources[0],registry.sources[2]]){const r=reader(source.project_id,source.entity_id);check(r);assert.equal((render(r).match(/class="hi-claim"/g)||[]).length,r.canonical_records.claims.length);}
});
test('single-record presentation omits index but preserves fragment target',()=>{
 // Render-only projection of an existing returned record; never saved as canonical data.
 const r=reader(registry.sources[1].project_id,registry.sources[1].entity_id);
 r.canonical_records.observations=r.canonical_records.observations.slice(0,1);check(r);
});
test('actual live 3 / 2 / 3 and single records retain exact content and locators',{skip:!process.env.GROUND_RUNTIME_CONFIG},()=>{
 const live=createHumanRealityReader(createHumanSourceResolver({runtimeConfigPath:process.env.GROUND_RUNTIME_CONFIG}));
 for(const [id,count] of [['a4046668-2a14-5190-aa6b-c43f25bfbb34',3],['22e46a9a-c570-512a-ab6e-6e4ed43b7cce',2],['705575ca-1a28-5494-ac1f-f723157fcafb',3],['fbdfd235-1a5b-5a5d-ad30-6f2c170fe9f9',1]] as const){const r=live(LIVE_PROJECT_ID,id);assert.equal(r.canonical_records.observations.length,count);check(r);}
});
