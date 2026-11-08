import {readFileSync, statSync, realpathSync} from 'node:fs';
import {isAbsolute} from 'node:path';
import {withCanonicalWriter, assertStorageRead, type CanonicalOwnerConfig} from '../../ground-core/storage-owner.js';
import {loadProjectSnapshot, saveProject} from '../../ground-core/file-store.js';
import {applyPatch} from '../../ground-core/state-engine.js';
import {ValidationError, PatchError} from '../../ground-core/errors.js';
import {BUSINESS_PROJECT_ID} from './source-resolver.js';

export class ActionUpdateError extends Error {
  constructor(public readonly code:string, public readonly status:number) {super(code);}
}
export function writeOrigin(value = process.env.GROUND_BUSINESS_WRITE_ORIGIN): string | undefined {
  if (!value) return;
  try {
    const url=new URL(value);
    if (url.protocol==='http:' && ['localhost','127.0.0.1','[::1]'].includes(url.hostname) && url.origin===value) return value;
  } catch { /* disabled unless exact trusted loopback origin */ }
}
export function actionUpdateEnabled(projectId:string) {
  return projectId===BUSINESS_PROJECT_ID && !!process.env.GROUND_RUNTIME_CONFIG && !!writeOrigin();
}
export function createActionUpdater(runtimeConfigPath:string | undefined,
  // Server-only seam used to test failures at the canonical persistence boundary.
  persistence = {load:loadProjectSnapshot, save:saveProject}) {
  return (projectId:string, actionId:string, transition:unknown, expectedFingerprint:unknown) => {
    if (projectId!==BUSINESS_PROJECT_ID) throw new ActionUpdateError('WRITE_SCOPE_DENIED',403);
    if (!/^[0-9a-f-]{36}$/i.test(actionId) || !['start','complete'].includes(transition as string)) throw new ActionUpdateError('INVALID_TRANSITION',422);
    if (typeof expectedFingerprint!=='string' || !/^[a-f0-9]{64}$/.test(expectedFingerprint)) throw new ActionUpdateError('SNAPSHOT_PRECONDITION_REQUIRED',428);
    let config:CanonicalOwnerConfig;
    try {
      if (!runtimeConfigPath || !isAbsolute(runtimeConfigPath)) throw Error();
      config=JSON.parse(readFileSync(runtimeConfigPath,'utf8'));
      if(config.mode!=='canonical-live' || !isAbsolute(config.storageDir) || config.writerOwner!=='ground-local-cli-v0') throw Error();
      // This update boundary never initializes a root or a Project.
      if(!statSync(config.storageDir).isDirectory()) throw Error();
      assertStorageRead(realpathSync(config.storageDir),config);
    } catch {throw new ActionUpdateError('WRITE_CONFIG_UNAVAILABLE',503);}
    let acquired=false;
    try {
      return withCanonicalWriter(config, options=>{
        acquired=true;
        const before=persistence.load(projectId,options);
        if(before.fingerprint!==expectedFingerprint) throw new ActionUpdateError('SNAPSHOT_MISMATCH',409);
        if(before.stored_schema_version!==before.read_schema_version || before.read_schema_version!=='0.1.25') throw new ActionUpdateError('SCHEMA_WRITE_UNSUPPORTED',422);
        const action=before.state.next_actions.find(a=>a.id===actionId);
        if(!action) throw new ActionUpdateError('ACTION_NOT_FOUND',404);
        const oldStatus=transition==='start'?'pending':'in_progress';
        const newStatus=transition==='start'?'in_progress':'done';
        if(action.status!==oldStatus) throw new ActionUpdateError('INVALID_TRANSITION',409);
        const next=applyPatch(before.state,{schema_version:before.state.schema_version,project_id:projectId,source:'manual',operations:[{op:'upsert',entity:'next_action',entity_id:actionId,payload:{status:newStatus}}]});
        persistence.save(next,options);
        const after=persistence.load(projectId,options);
        const updated=after.state.next_actions.find(a=>a.id===actionId)!;
        return {transport:{contract:'human-interface-action-update.v1'},receipt:{project_id:projectId,action_id:actionId,before_fingerprint:before.fingerprint,after_fingerprint:after.fingerprint,old_status:action.status,new_status:updated.status,recorded_update:updated.updated_at}};
      });
    } catch(error) {
      if(error instanceof ActionUpdateError) throw error;
      if(!acquired) throw new ActionUpdateError('OWNER_UNAVAILABLE',409);
      if(error instanceof ValidationError || error instanceof PatchError || error instanceof SyntaxError) throw new ActionUpdateError('CANONICAL_VALIDATION_FAILURE',422);
      throw new ActionUpdateError('STORAGE_FAILURE',503);
    }
  };
}
