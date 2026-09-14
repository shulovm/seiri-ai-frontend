import {describe,it} from 'node:test';
import assert from 'node:assert/strict';
import {createEmptyProject,applyPatch} from '../state-engine.js';
import {proposeFromReality} from '../reality/propose.js';
describe('Reality intake channel is independent of content modality',()=>{
 for(const source of ['manual','field_test','conversation','system'] as const) for(const text of ['試験の再実施を優先する。','B案でいくと決めた。','配置案を候補として挙げる。']) it(`${source}: ${text}`,()=>{
  const state=createEmptyProject({title:'Channel test'});const p=proposeFromReality(state,{project_id:state.project.id,input_text:text,source});assert.ok('proposed_patch' in p.result);if('proposed_patch' in p.result){const s=applyPatch(state,p.result.proposed_patch);assert.equal(s.observations[0].source,source);}assert.equal(p.ground_event.source,source);
 });
});
