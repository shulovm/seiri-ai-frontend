import {it}from'node:test';import assert from'node:assert/strict';import {createEmptyProject}from'../state-engine.js';import {proposeFromReality}from'../reality/propose.js';import {interpretDecisionLifecycle}from'../reality/decision-lifecycle.js';
const propose=(text:string)=>{const s=createEmptyProject({title:'Materiality'});return proposeFromReality(s,{project_id:s.project.id,input_text:text},'canonical');};
it('temporal reference is not an unresolved observer',()=>assert.ok('proposed_patch'in propose('それまでXは不明。').result));
it('truth uncertainty is safely represented without an identity question',()=>assert.ok('proposed_patch'in propose('それは未確認。').result));
it('an unrelated preceding report does not resolve observer pronoun',()=>{const p=propose('記録がある。それが直接見た。');assert.equal('type'in p.result&&p.result.type,'clarification');});
it('future planned execution is not executing',()=>assert.equal(interpretDecisionLifecycle('B案の実行を開始する予定だ。'),'planned'));
it('partial execution is not complete',()=>assert.equal(interpretDecisionLifecycle('B案は一部だけ実行した。'),'partially_executed'));
