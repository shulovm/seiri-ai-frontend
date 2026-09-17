import { closeSync, constants, existsSync, fstatSync, lstatSync, openSync, readdirSync, readFileSync, realpathSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { normalizeForRead, assertState, requireCondition as check, equal } from './validation.js';
import { sha256, FrozenArtifactRegistry, type ArchivedArtifact } from './artifacts.js';
import { assertTransition, applyPatchVNext, type AdmissionContext } from './state-engine.js';
import { SCHEMA_VERSION, type ProjectStateVNext, type StatePatchVNext, type ClaimAssessment, type ArtifactRef } from './types.js';

const marker='.claim-vnext-isolated.json';
const idPattern=/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
function readRegular(path:string):Buffer {
  check(lstatSync(path).isFile()&&!lstatSync(path).isSymbolicLink(),'Not a regular isolated artifact');
  const fd=openSync(path,constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK);
  try{check(fstatSync(fd).isFile(),'Not a regular file');return readFileSync(fd);}finally{closeSync(fd);}
}
function atomic(path:string,bytes:Buffer) {
  const tmp=`${path}.${randomUUID()}.tmp`;let created=false;
  try{writeFileSync(tmp,bytes,{flag:'wx',mode:0o600});created=true;renameSync(tmp,path);created=false;}
  finally{if(created&&existsSync(tmp))unlinkSync(tmp);}
}
const encoded=(v:unknown)=>Buffer.from(JSON.stringify(v,null,2)+'\n');
/** Creates a marker only in an explicitly supplied EMPTY root. No environment/default/live mode. */
export function createIsolatedStore(root:string):IsolatedProjectStore {
  check(isAbsolute(root),'Absolute isolated root required');const resolved=realpathSync(root);
  check(readdirSync(resolved).length===0,'Isolated store creation requires an empty root');
  writeFileSync(join(resolved,marker),encoded({contract:'claim-vnext-isolated.v1',schema:SCHEMA_VERSION}),{flag:'wx',mode:0o600});
  return new IsolatedProjectStore(resolved);
}
export class IsolatedProjectStore {
  readonly root:string;
  constructor(root:string){check(isAbsolute(root),'Absolute isolated root required');this.root=realpathSync(root);const m=JSON.parse(readRegular(join(this.root,marker)).toString());check(m.contract==='claim-vnext-isolated.v1'&&m.schema===SCHEMA_VERSION,'Not an isolated vNext root');}
  private path(id:string){check(idPattern.test(id),'Invalid Project ID');return join(this.root,`${id}.json`);}
  private exclusive<T>(fn:()=>T):T {
    const path=join(this.root,'writer.lock');const fd=openSync(path,'wx',0o600);
    try{return fn();}finally{closeSync(fd);unlinkSync(path);}
  }
  /** Explicit isolated bootstrap only. Never called by read normalization or save. */
  initialize(legacy:unknown):ProjectStateVNext {
    check((legacy as {schema_version?:string})?.schema_version!==SCHEMA_VERSION,'Initial state must be explicit legacy baseline');
    const state=normalizeForRead(legacy);
    return this.exclusive(()=>{const path=this.path(state.project.id);check(!existsSync(path),'Project already initialized');atomic(path,encoded(state));return state;});
  }
  loadProjectSnapshot(id:string) {
    const bytes=readRegular(this.path(id)),stored=JSON.parse(bytes.toString());assertState(stored);check(stored.project.id===id,'Stored Project mismatch');
    return {bytes,state:stored,fingerprint:sha256(bytes),stored_schema_version:SCHEMA_VERSION,read_schema_version:SCHEMA_VERSION};
  }
  artifactRegistry():FrozenArtifactRegistry {
    const path=join(this.root,'artifacts.json');
    return FrozenArtifactRegistry.fromArchive(existsSync(path)?JSON.parse(readRegular(path).toString()):[]);
  }
  private archive(registry:FrozenArtifactRegistry) {
    const old=this.artifactRegistry().export(), entries=new Map(old.map(e=>[e.key,e]));
    for(const e of registry.export()){const prior=entries.get(e.key);check(!prior||equal(prior,e),'Artifact key rebinding rejected');entries.set(e.key,e);}
    atomic(join(this.root,'artifacts.json'),encoded([...entries.values()]));
  }
  /** Operations bindings allow a later audit to recover each frozen admission review. */
  admissionBindings():Array<{project_id:string;claim_id:string;request_identity:string;artifact:ArtifactRef}> {
    const path=join(this.root,'claim-admissions.json');
    return existsSync(path)?JSON.parse(readRegular(path).toString()):[];
  }
  private saveLocked(next:ProjectStateVNext,expected:string,context:AdmissionContext) {
    const before=this.loadProjectSnapshot(next.project.id);check(before.fingerprint===expected,'Snapshot precondition mismatch');
    assertTransition(before.state,next,context);
    // Artifacts precede the snapshot; a crash may leave unreferenced artifacts, never missing basis bytes.
    this.archive(context.artifacts);
    const bindings=this.admissionBindings();
    for(const claim of next.claims.filter(c=>!before.state.claims.some(old=>old.id===c.id))) {
      const binding={project_id:next.project.id,claim_id:claim.id,request_identity:claim.provenance.external_id!,artifact:context.claim_admissions![claim.id]!};
      const prior=bindings.find(b=>b.project_id===binding.project_id&&b.claim_id===binding.claim_id);
      check(!prior||equal(prior,binding),'Admission binding mismatch');
      if(!prior)bindings.push(binding);
    }
    atomic(join(this.root,'claim-admissions.json'),encoded(bindings));
    atomic(this.path(next.project.id),encoded(next));
    return this.loadProjectSnapshot(next.project.id);
  }
  saveProject(next:ProjectStateVNext,expected:string,context:AdmissionContext) {return this.exclusive(()=>this.saveLocked(next,expected,context));}
  /** Durable operations identity; raw assessments remain separate even for identical scores. */
  publishAssessment(projectId:string,requestKey:string,payload:ClaimAssessment,context:AdmissionContext,expectedFingerprint:string) {
    check(requestKey.trim().length>0,'Request identity required');
    return this.exclusive(()=>{
      const journal=join(this.root,`request-${sha256(projectId+'\0'+requestKey)}.json`);
      const current=this.loadProjectSnapshot(projectId);
      let entry:{project_id:string;request_key:string;payload:ClaimAssessment;before_fingerprint:string;status:string};
      if(existsSync(journal)) {
        entry=JSON.parse(readRegular(journal).toString());
        check(entry.project_id===projectId&&entry.request_key===requestKey&&equal(entry.payload,payload),'Idempotency key payload mismatch');
        const existing=current.state.claim_assessments.find(a=>a.id===payload.id);
        if(existing){check(equal(existing,payload),'Published assessment differs');entry.status='COMPLETED';atomic(journal,encoded(entry));return structuredClone(existing);}
        check(entry.status!=='COMPLETED','Completed assessment disappeared');
      } else {
        check(!current.state.claim_assessments.some(a=>a.id===payload.id),'Assessment ID reused for another request');
        check(current.fingerprint===expectedFingerprint,'Snapshot precondition mismatch');
        entry={project_id:projectId,request_key:requestKey,payload:structuredClone(payload),before_fingerprint:expectedFingerprint,status:'PREPARED'};
        atomic(journal,encoded(entry));
      }
      check(current.fingerprint===entry.before_fingerprint,'Prepared request snapshot changed');
      const patch:StatePatchVNext={schema_version:SCHEMA_VERSION,project_id:projectId,source:'human_review',operations:[{op:'upsert',entity:'claim_assessment',entity_id:payload.id,payload}]};
      const next=applyPatchVNext(current.state,patch,context);
      this.saveLocked(next,entry.before_fingerprint,context);entry.status='COMPLETED';atomic(journal,encoded(entry));return structuredClone(payload);
    });
  }
}
