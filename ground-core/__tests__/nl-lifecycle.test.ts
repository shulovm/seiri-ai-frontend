import {describe,it} from 'node:test';
import assert from 'node:assert/strict';
import {createEmptyProject} from '../state-engine.js';
import {proposeFromReality} from '../reality/propose.js';
import {interpretDecisionLifecycle} from '../reality/decision-lifecycle.js';
describe('Decision qualification precedes substring commitment',()=>{
 for(const text of ['受入可否の確定を待つか、B案へ変更するか検討中で、まだ選択されていない。','B案は未決定。','B案に決めたわけではなく比較中。','B案に決める予定だ。','B案が有力だ。'])it(text,()=>{const s=createEmptyProject({title:'Lifecycle'});const p=proposeFromReality(s,{project_id:s.project.id,input_text:text});if('proposed_patch' in p.result)assert.ok(p.result.proposed_patch.operations.every(o=>o.entity!=='judgment'));assert.notEqual(interpretDecisionLifecycle(text),'selected');});
 it('affirmative decision stays distinct',()=>assert.equal(interpretDecisionLifecycle('責任者がB案に決めた。'),'selected'));
});
