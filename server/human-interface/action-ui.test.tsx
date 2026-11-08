import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter} from 'react-router-dom';
// @ts-expect-error JSX
import OperatingRecords from '../../src/human-interface/OperatingRecords.jsx';
// @ts-expect-error JSX
import {BusinessProjectCard} from '../../src/human-interface/BusinessHome.jsx';
// @ts-expect-error JS
import {updateAndReload,updateAction} from '../../src/human-interface/browse-client.js';
const actions=['done','pending','cancelled','in_progress','pending'].map((status,i)=>({id:`unit-${i}`,title:`Action ${i}`,status,description:`long context ${i}`,due_at:null}));
test('status grouping retains within-group order; completed/cancelled and description are collapsed; controls only active',()=>{
 const html=renderToStaticMarkup(<OperatingRecords records={{current_state:null,blockers:[],next_actions:actions}} onTransition={()=>{}}/>);
 assert.ok(html.indexOf('Action 1')<html.indexOf('Action 3'));assert.ok(html.indexOf('Action 3')<html.indexOf('Action 4'));assert.ok(html.indexOf('Action 4')<html.indexOf('Action 0'));
 assert.match(html,/<details><summary>Completed/);assert.match(html,/<details><summary>Cancelled/);assert.match(html,/<details><summary>説明・期限/);assert.equal((html.match(/Start · 開始/g)||[]).length,2);assert.equal((html.match(/Mark done/g)||[]).length,1);
 const readonly=renderToStaticMarkup(<OperatingRecords records={{current_state:null,blockers:[],next_actions:actions}}/>);assert.ok(!readonly.includes('Mark done'));assert.ok(!readonly.includes('Start ·'));
});
test('mutation errors stay inside affected Project card and suppress further updates until reload',()=>{
 const response={transport:{action_update_enabled:true,source:{}},canonical_project:{id:'business',title:'Business',summary:'stored summary',status:'active'},canonical_entities:[],canonical_operating_records:{current_state:null,blockers:[],next_actions:actions}};
 const html=renderToStaticMarkup(<MemoryRouter><BusinessProjectCard source={{project_id:'business'}} request={{response}} mutation={{error:{code:'SNAPSHOT_MISMATCH'}}} onTransition={()=>{}} onReload={()=>{}}/><BusinessProjectCard source={{project_id:'other'}} request={{response:{...response,canonical_project:{...response.canonical_project,title:'Unaffected'}}}}/></MemoryRouter>);
 assert.equal((html.match(/role="alert"/g)||[]).length,1);assert.ok(html.includes('Unaffected'));assert.ok(html.includes('Projectを再読込'));assert.ok(!html.includes('Mark done'));assert.ok(html.includes('stored summary'));
});
test('success uses refetched canonical response, not optimistic status; errors never retry automatically',async()=>{
 const calls:string[]=[];const canonical={canonical_operating_records:{next_actions:[{status:'done'}]}};
 const result=await updateAndReload('p','a','complete','fp',{write:async()=>{calls.push('write');return {receipt:{after_fingerprint:'new'}};},read:async()=>{calls.push('read');return canonical;}});
 assert.deepEqual(calls,['write','read']);assert.equal(result.response,canonical);
 let writes=0,reads=0;await assert.rejects(()=>updateAndReload('p','a','complete','fp',{write:async()=>{writes++;throw Error('SNAPSHOT_MISMATCH');},read:async()=>{reads++;}}),/SNAPSHOT_MISMATCH/);assert.equal(writes,1);assert.equal(reads,0);
 await assert.rejects(()=>updateAndReload('p','a','complete','fp',{write:async()=>({receipt:{}}),read:async()=>{throw Error('read failed');}}),/UPDATE_SAVED_RELOAD_FAILED/);
});
test('client sends intent only with exact snapshot precondition; validates receipt',async()=>{
 const fp='a'.repeat(64);const after='b'.repeat(64);let sent:any;
 const fetcher=async(url:any,options:any)=>{sent=options;return new Response(JSON.stringify({transport:{contract:'human-interface-action-update.v1'},receipt:{project_id:'p',action_id:'a',before_fingerprint:fp,after_fingerprint:after,new_status:'done'}}));};
 await updateAction('p','a','complete',fp,{fetcher});assert.deepEqual(JSON.parse(sent.body),{transition:'complete'});assert.equal(sent.headers['If-Ground-Snapshot-Fingerprint'],fp);
 await assert.rejects(()=>updateAction('p','a','complete',fp,{fetcher:async()=>new Response('{}')}),/UPDATE_OUTCOME_UNKNOWN/);
});
