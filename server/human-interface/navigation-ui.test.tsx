import React from 'react';
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {renderToStaticMarkup} from 'react-dom/server';
const {MemoryRouter}=await import('react-router-dom');
import {tsImport} from 'tsx/esm/api';
const {default:View}=await tsImport('../../src/human-interface/RealityReadView.jsx',import.meta.url);
const {default:RequestView}=await import('../../src/human-interface/RealityRequestView.jsx');
const {createHumanRealityReader}=await tsImport('./read-adapter.ts',import.meta.url);
const {realitySourceRegistry:registry}=await tsImport('./source-registry.ts',import.meta.url);
const reader=createHumanRealityReader(registry);
const samples=registry.sources.map(s=>reader(s.project_id,s.entity_id));
const render=(response:any)=>renderToStaticMarkup(<View response={response}/>);
test('all proof shapes have native section links and unique focusable targets, including zero scopes',()=>{
 for(const response of samples){const html=render(response);for(const id of ['entity','worldline','observations','claims']){assert.ok(html.includes(`href="#${id}"`));assert.equal((html.match(new RegExp(`id="${id}"`,'g'))||[]).length,1);assert.ok(html.includes(`id="${id}" tabindex="-1"`));}assert.ok(html.includes('0件のsectionも現在のread scopeの結果'));assert.doesNotMatch(html,/href="#evidence"|role="tab"/);}
});
test('retained context repeats stored identity and links to Project and full Entity fields',()=>{for(const r of samples){const html=render(r);assert.ok(html.includes('aria-label="Current Entity and page navigation"'));assert.ok(html.includes(`href="/reality/${r.canonical_records.project.id}"`));assert.ok(html.includes('href="#top"'));assert.ok(html.includes(`<code>${r.canonical_records.entity.kind}</code>`));assert.ok(html.includes(r.canonical_records.entity.id));}});
test('Transport disclosure starts closed with every prior metadata field preserved',()=>{const html=render(samples[1]);assert.match(html,/<details class="hi-transport hi-transport-disclosure"><summary>Transport metadata · read source<\/summary>/);for(const key of ['source_mode','source_qualification','snapshot_fingerprint','stored_schema_version','read_schema_version'])assert.ok(html.includes(`<dt>${key}</dt>`));assert.doesNotMatch(html,/<details class="hi-raw" open/);});
test('multiple Observation relation scopes and all Round4 Claims retained',()=>{const b15=render(samples[1]);assert.equal((b15.match(/data-observation-id=/g)||[]).length,2);assert.ok(b15.includes('明示参照Evidence records: 0'));assert.ok(b15.includes('明示参照Evidence records: 1'));const round4=render(samples[2]);assert.equal((round4.match(/class="hi-claim"/g)||[]).length,23);});
test('loading never mounts stale canonical content or context for either Project or Entity change',()=>{const r=samples[0],projectId=r.canonical_records.project.id,entityId=r.canonical_records.entity.id;for(const request of [null,{projectId,entityId:'other',response:r},{projectId:'other',entityId,response:r}]){const html=renderToStaticMarkup(<MemoryRouter><RequestView projectId={projectId} entityId={entityId} request={request}/></MemoryRouter>);assert.ok(html.includes('role="status"'));assert.doesNotMatch(html,/hi-retained-context|Page sections|data-record-type/);assert.ok(!html.includes(r.canonical_records.entity.label));}});
test('error never mounts retained context even if a previous response is attached',()=>{const r=samples[0],projectId=r.canonical_records.project.id,entityId=r.canonical_records.entity.id;const html=renderToStaticMarkup(<MemoryRouter><RequestView projectId={projectId} entityId={entityId} request={{projectId,entityId,response:r,error:{status:503,code:'LIVE_READ_FAILURE'}}}/></MemoryRouter>);assert.ok(html.includes('role="alert"'));assert.doesNotMatch(html,/hi-retained-context|Page sections|data-record-type/);});
