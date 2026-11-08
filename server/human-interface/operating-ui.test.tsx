import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
// @ts-expect-error JSX presentation
import OperatingRecords from '../../src/human-interface/OperatingRecords.jsx';
import {createHumanOperatingReader} from './read-adapter.js';
import {realitySourceRegistry} from './source-registry.js';
// @ts-expect-error JS transport
import {fetchOperating} from '../../src/human-interface/browse-client.js';
test('proof operating records preserve summaries, nulls and empty-vs-missing semantics',()=>{
 for(const source of realitySourceRegistry.sources){const records=createHumanOperatingReader()(source.project_id).canonical_operating_records;const html=renderToStaticMarkup(<OperatingRecords records={records}/>);
 assert.ok(html.includes(records.current_state.summary));assert.ok(html.includes('null（保存値）'));assert.ok(html.includes('事業を止める問題がないという判定ではありません'));assert.ok(!html.includes('No blockers'));
 }
 const missing=renderToStaticMarkup(<OperatingRecords/>);assert.ok(missing.includes('Not available in current read scope'));assert.ok(!missing.includes('保存されたBlocker記録はありません'));
});
test('populated presentation retains resolved/done and groups active before completed',()=>{
 const records={current_state:null,blockers:[{id:'unit-b',title:'Resolved record',description:'stored',status:'resolved',severity:'low'}],next_actions:[{id:'unit-a',title:'First stored',status:'done',description:null,due_at:null,sort_order:9},{id:'unit-c',title:'Second stored',status:'pending',description:'stored',due_at:'2026-11-09T09:00:00+09:00',sort_order:0}]};
 const html=renderToStaticMarkup(<OperatingRecords records={records}/>);assert.ok(html.includes('resolved'));assert.ok(html.includes('done'));assert.ok(html.indexOf('Second stored')<html.indexOf('First stored'));assert.ok(html.includes('2026-11-09T09:00:00+09:00'));assert.ok(!html.includes('Recommended'));
});
test('operating client rejects incomplete or cross-Project response instead of empty defaults',async()=>{
 const id=realitySourceRegistry.sources[0].project_id;const body=createHumanOperatingReader()(id);
 const fetcher=async()=>new Response(JSON.stringify(body),{status:200});assert.deepEqual(await fetchOperating(id,{fetcher}),body);
 for(const altered of [{...body,canonical_operating_records:undefined},{...body,canonical_project:{...body.canonical_project,id:'wrong'}}]) await assert.rejects(()=>fetchOperating(id,{fetcher:async()=>new Response(JSON.stringify(altered))}),/INVALID_READ_RESPONSE/);
});
