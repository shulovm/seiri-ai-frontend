import { createHash } from 'node:crypto';
import { requireCondition as check, equal, normalizeForRead, validateValue } from './validation.js';
import { requireTemporalInstant } from '../temporal.js';
import type { ArtifactRef, DefinitionRef, ClaimProposition, ClaimAssessment, ProjectStateVNext } from './types.js';

export const sha256=(bytes: Uint8Array|string)=>createHash('sha256').update(bytes).digest('hex');
export interface ArchivedArtifact { key:string; sha256:string; base64:string }
/** Explicit isolated archive. No URL fetch, path interpretation, mutable registry or fallback. */
export class FrozenArtifactRegistry {
  private readonly entries = new Map<string,Buffer>();
  constructor(entries: Iterable<readonly [string,Uint8Array]>) {
    for (const [key,bytes] of entries) {
      check(/^[A-Za-z][A-Za-z0-9._-]*:[^\s]+$/.test(key),'Invalid artifact key');
      check(!this.entries.has(key),'Duplicate artifact key');this.entries.set(key,Buffer.from(bytes));
    }
  }
  read(ref: ArtifactRef): Buffer {
    const bytes=this.entries.get(ref.artifact_key);
    check(bytes,'Artifact unavailable');check(sha256(bytes)===ref.sha256,'Artifact integrity failure');return Buffer.from(bytes);
  }
  json(ref: ArtifactRef): unknown {return JSON.parse(this.read(ref).toString('utf8'));}
  export(): ArchivedArtifact[] {return [...this.entries].map(([key,b])=>({key,sha256:sha256(b),base64:b.toString('base64')}));}
  static fromArchive(entries:ArchivedArtifact[]):FrozenArtifactRegistry {
    return new FrozenArtifactRegistry(entries.map(e=>{const b=Buffer.from(e.base64,'base64');check(sha256(b)===e.sha256,'Archive integrity failure');return [e.key,b] as const;}));
  }
  with(key:string,bytes:Uint8Array):FrozenArtifactRegistry {
    const prior=this.entries.get(key);
    check(!prior||prior.equals(Buffer.from(bytes)),'Artifact key rebinding rejected');
    return prior?this:new FrozenArtifactRegistry([...this.entries,[key,bytes] as const]);
  }
}
export function pointer(value:unknown,path:string):unknown {
  check(/^(?:\/(?:[^~/]|~[01])*)*$/.test(path),'Invalid JSON Pointer');
  let at=value;
  for(const part of path===''?[]:path.slice(1).split('/')) {
    const key=part.replace(/~1/g,'/').replace(/~0/g,'~');
    check(at!==null&&typeof at==='object'&&Object.hasOwn(at,key),'Pointer target missing');
    at=(at as Record<string,unknown>)[key];
  }
  return at;
}
type Obj=Record<string,any>;
function object(value:unknown,required:string[],optional:string[]=[]):Obj {
  check(value&&typeof value==='object'&&!Array.isArray(value),'Invalid definition object');
  const o=value as Obj;
  check(required.every(k=>Object.hasOwn(o,k))&&Object.keys(o).every(k=>[...required,...optional].includes(k)),'Definition fields mismatch');return o;
}
const text=(v:unknown)=>typeof v==='string'&&v.trim().length>0;
export function definition(registry:FrozenArtifactRegistry,ref:DefinitionRef):Obj {
  const d=pointer(registry.json(ref.artifact),ref.pointer) as Obj;
  check(d&&d.id===ref.id&&d.version===ref.version,'Definition identity mismatch');return d;
}
export const definitionKey=(ref:DefinitionRef)=>[ref.id,ref.version,ref.artifact.sha256,ref.pointer];
function matchesRef(candidate:Obj,ref:DefinitionRef,owner:DefinitionRef):boolean {
  if (Object.hasOwn(candidate,'local_pointer')) {
    object(candidate,['id','version','local_pointer']);
    return candidate.id===ref.id&&candidate.version===ref.version&&candidate.local_pointer===ref.pointer&&owner.artifact.sha256===ref.artifact.sha256;
  }
  object(candidate,['id','version','artifact','pointer']);return equal(definitionKey(candidate as DefinitionRef),definitionKey(ref));
}
export function admitClaim(c:ClaimProposition,registry:FrozenArtifactRegistry):void {
  const d=object(definition(registry,c.predicate_ref),['id','version','predicate_kind','predicate','question','value_schema','scope_kinds','applicability_policy']);
  check(d.predicate_kind===c.predicate_kind&&d.predicate===c.predicate&&text(d.question),'Predicate mismatch');
  check(Array.isArray(d.scope_kinds)&&d.scope_kinds.includes(c.manifestation_scope.kind),'Predicate scope mismatch');
  check(validateValue(d.value_schema,c.value),'Predicate value mismatch');
  check(['atemporal','declared_interval'].includes(d.applicability_policy),'Unknown applicability policy');
  if(d.applicability_policy==='atemporal')check(c.applicable_from===null&&c.applicable_until===null,'Atemporal predicate requires unbounded applicability');
  if(c.manifestation_scope.kind==='frozen_artifact') {
    const scope=c.manifestation_scope,sel=scope.selector;
    const list=pointer(registry.json(scope.artifact),sel.collection_pointer);
    check(Array.isArray(list),'Selector collection is not an array');
    const matches=list.filter(x=>x&&typeof x==='object'&&Object.hasOwn(x,sel.identity_field)&&x[sel.identity_field]===sel.identity_value);
    check(matches.length===1,'Selector must match exactly one representation');
    check(typeof pointer(matches[0],sel.field_pointer)==='string','Excerpt must be a stored string');
  }
}
const flags=['evidence_required','observation_required','frozen_input_required','review_artifact_required','rationale_artifact_required','known_assessed_at_required','resolved_assessed_at_required'];
export function admitAssessment(a:ClaimAssessment,state:ProjectStateVNext,registry:FrozenArtifactRegistry):void {
  const target=state.claims.find(c=>c.id===a.claim_id)!;
  const b=a.evidence_snapshot;
  const raw=registry.json(b.project_snapshot.artifact) as Obj;
  check(raw.schema_version===b.project_snapshot.stored_schema_version,'Basis stored schema mismatch');
  const snapshot=normalizeForRead(raw);
  check(snapshot.project.id===state.project.id,'Basis project mismatch');
  check(equal(snapshot.claims.find(c=>c.id===a.claim_id),target),'Assessment Claim target differs from frozen snapshot');
  check(!snapshot.claim_assessments.some(x=>x.id===a.id),'Basis contains assessment itself');
  for(const id of b.observation_ids)check(snapshot.epistemic_observations.some(o=>o.id===id),'Basis Observation missing');
  for(const id of b.evidence_ids) {
    const e=snapshot.evidence.find(e=>e.id===id);check(e,'Basis Evidence missing');
    if(e.kind==='observation_ref')check(b.observation_ids.includes(e.observation_id!),'Basis Evidence Observation not selected');
  }
  for(const ref of [...b.frozen_inputs,...b.review_artifacts])registry.read(ref);
  if(a.rationale_artifact)registry.read(a.rationale_artifact);
  const method=object(definition(registry,a.method_ref),['id','version','purpose','procedure','procedure_artifacts','allowed_scales','input_requirements','interpretation']);
  check(method.purpose===a.purpose&&text(method.procedure)&&text(method.interpretation),'Method purpose or description invalid');
  check(Array.isArray(method.procedure_artifacts)&&Array.isArray(method.allowed_scales)&&method.allowed_scales.length>0,'Method references invalid');
  method.procedure_artifacts.forEach((r:ArtifactRef)=>registry.read(r));
  check(method.allowed_scales.some((r:Obj)=>matchesRef(r,a.scale_ref,a.method_ref)),'Method scale mismatch');
  const requirements=object(method.input_requirements,flags);
  check(flags.every(k=>typeof requirements[k]==='boolean'),'Method input requirements invalid');
  check(!requirements.resolved_assessed_at_required||requirements.known_assessed_at_required,'Inconsistent time requirements');
  for(const [flag,available] of [['evidence_required',b.evidence_ids.length],['observation_required',b.observation_ids.length],['frozen_input_required',b.frozen_inputs.length],['review_artifact_required',b.review_artifacts.length],['rationale_artifact_required',Boolean(a.rationale_artifact)],['known_assessed_at_required',a.assessed_at!==null]] as const)check(!requirements[flag]||available,`Missing method requirement: ${flag}`);
  if(requirements.resolved_assessed_at_required)requireTemporalInstant(a.assessed_at!,'assessment method time');
  const scale=object(definition(registry,a.scale_ref),['id','version','minimum','maximum','minimum_meaning','maximum_meaning','interpretation','numeric_kind']);
  check(scale.minimum===0&&scale.maximum===1,'Unsupported scale range');
  check(['subjective_estimate','rule_score','probability_estimate'].includes(scale.numeric_kind),'Unsupported numeric kind');
  check([scale.minimum_meaning,scale.maximum_meaning,scale.interpretation].every(text),'Scale semantics missing');
  const q=object(definition(registry,a.calibration_qualification),['id','version','method','scale','qualification','explanation','applicability','basis_refs']);
  check(matchesRef(q.method,a.method_ref,a.calibration_qualification)&&matchesRef(q.scale,a.scale_ref,a.calibration_qualification),'Qualification binding mismatch');
  check(['not_established','not_applicable','declared_with_basis'].includes(q.qualification)&&text(q.explanation)&&text(q.applicability)&&Array.isArray(q.basis_refs),'Qualification invalid');
  check(q.qualification!=='declared_with_basis'||q.basis_refs.length>0,'Calibration declaration requires basis');
  q.basis_refs.forEach((r:ArtifactRef)=>registry.read(r));
}
