/** Test-only reconstruction from versioned manual patches, never a runtime store. */
import {readFileSync, mkdirSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {createEmptyProject, applyPatch} from '../../ground-core/state-engine.js';
import type {ProjectState, StatePatch} from '../../ground-core/types.js';
import {createProjectFromExperimentSeed} from '../../ground-core/intake/create-project-from-seed.js';
import {validateExperimentSeed} from '../../ground-core/intake/validate-seed.js';

const root=fileURLToPath(new URL('../../',import.meta.url));
const read=(p:string)=>JSON.parse(readFileSync(resolve(root,p),'utf8'));
export const clock='2026-06-07T07:00:00.000Z';
// Only technical creation/update clocks are fixed; event/decision time is retained.
const stable=(state:ProjectState):ProjectState=>JSON.parse(JSON.stringify(state,(k,v)=>['created_at','updated_at'].includes(k)?clock:v));
export function generateFixtures():ProjectState[]{
 const result:ProjectState[]=[];
 for(const [title,files] of [
  ['Japanese Folktale / Momotaro',['momotaro-production-design.patch.json','momotaro-v0.1.1-manual.patch.json']],
  ['GROUND Core',['ground-core-manual-run.patch.json','ground-core-v0.4-state-update.patch.json']],
 ] as const){
  const patches:StatePatch[]=files.map(f=>read('ground-core/examples/'+f));
  let state=createEmptyProject({title});
  state.project.id=patches[0].project_id;
  state.current_state.project_id=state.project.id;
  state.current_state.id=patches[0].operations.find(o=>o.entity==='current_state')!.entity_id;
  for(const patch of patches){
   for(const op of patch.operations){
    if(op.op==='upsert'&&op.entity==='next_action'&&op.payload?.id)op.payload.depends_on_action_id??=null;
   }
   state=applyPatch(state,patch);
  }
  result.push(stable(state));
 }
 result.push(read('ground-core/__tests__/fixtures/freewater-phase0.project.json'));
 // The existing intention test needs a valid Moshimo owner graph. Its fallback
 // rebinds only the outer project, leaving FreeWater children with another owner.
 // Supply the already-versioned seed so that unchanged test takes its valid path.
 const moshimo=createProjectFromExperimentSeed(validateExperimentSeed(read('ground-core/examples/experiment-seeds/moshimo-first-episode.v0.1.0.json')));
 const ids=new Map<string,string>([[moshimo.project.id,'4afb2707-4c06-43b7-a9e6-6803e9431b88']]);
 const visit=(value:unknown,pointer:string)=>{
  if(!value||typeof value!=='object')return;
  if('id' in value&&typeof value.id==='string'&&!ids.has(value.id)){
   const hex=createHash('sha256').update('repro-001/moshimo/'+pointer).digest('hex');
   ids.set(value.id,`${hex.slice(0,8)}-${hex.slice(8,12)}-4${hex.slice(13,16)}-8${hex.slice(17,20)}-${hex.slice(20,32)}`);
  }
  for(const [k,v] of Object.entries(value))visit(v,pointer+'/'+k);
 };
 visit(moshimo,'');
 result.push(JSON.parse(JSON.stringify(moshimo,(k,v)=>
  ['created_at','updated_at','decided_at'].includes(k)?clock:typeof v==='string'?(ids.get(v)??v):v)));
 return result;
}
export function writeFixtures(directory:string){
 mkdirSync(directory,{recursive:true});
 return generateFixtures().map(state=>{
  const bytes=JSON.stringify(state,null,2)+'\n',name=state.project.id+'.json';
  writeFileSync(resolve(directory,name),bytes,{flag:'wx'});
  return {name,sha256:createHash('sha256').update(bytes).digest('hex')};
 });
}
