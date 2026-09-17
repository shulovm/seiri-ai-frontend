/** Compatibility audit: writes only disposable roots; optional live read never acquires ownership. */
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,rmSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import {withCanonicalWriter} from '../../ground-core/storage-owner.js';
import {baseFixture,addClaim,assessment,addAssessment} from '../../ground-core/__tests__/fixtures/claim-vnext.js';
import {comparisonScope,createIsolatedStore} from '../../ground-core/claim-vnext/index.js';
import {randomUUID} from 'node:crypto';
const repo=fileURLToPath(new URL('../../',import.meta.url));
import {realitySourceRegistry} from '../../server/human-interface/source-registry.ts';
import {loadProjectSnapshot,saveProject} from '../../ground-core/file-store.ts';
import {normalizeForRead,getClaimAssessmentView} from '../../ground-core/claim-vnext/index.ts';
import {assessBeliefAt} from '../../ground-core/reality/belief.ts';
const sha=(b:Buffer)=>createHash('sha256').update(b).digest('hex');
const report:any={sources:[]};
for(const source of realitySourceRegistry.sources){
 const path=join(repo,source.fixture_path),before=readFileSync(path),{state}=realitySourceRegistry.read(source.project_id);
 const vnext=normalizeForRead(state);assert.deepEqual(vnext.claims,state.claims);assert.equal(vnext.claim_assessments.length,0);
 assert.deepEqual({...vnext,schema_version:state.schema_version,claim_assessments:undefined},{...state,claim_assessments:undefined});
 for(const c of state.claims){const view=getClaimAssessmentView(vnext,c.id);assert.equal(view.kind,'legacy_claim');assert.equal(view.legacy_numeric_confidence,c.confidence);}
 const root=mkdtempSync(join(tmpdir(),'semantic008-v25-'));
 try {
 saveProject(state,{storageDir:root});const first=loadProjectSnapshot(state.project.id,{storageDir:root});saveProject(first.state,{storageDir:root});const second=loadProjectSnapshot(state.project.id,{storageDir:root});
 assert.equal(first.fingerprint,second.fingerprint);assert.equal(second.stored_schema_version,'0.1.25');assert.deepEqual(second.state,state);assert.equal('claim_assessments' in second.state,false);
 for(const c of state.claims){if(!c.subject_id)continue;const q={subjectId:c.subject_id,predicateKind:c.predicate_kind,predicate:c.predicate,at:state.updated_at};assert.deepEqual(assessBeliefAt(state,q),assessBeliefAt(second.state,q));}
 }finally{rmSync(root,{recursive:true,force:true});}
 assert.equal(sha(before),sha(readFileSync(path)));
 report.sources.push({key:source.source_key,stored_schema:source.stored_schema,read_schema:state.schema_version,claims:state.claims.length,legacy_confidence_preserved:true,write_schema:'0.1.25',vnext_dry_delta:{schema_version:'0.1.26',claim_assessments:[]},fake_assessments:0});
}
// Owner capability is tested only against a fresh disposable root, never the live root.
const temp=mkdtempSync(join(tmpdir(),'semantic008-owner-'));
try {
 const f=baseFixture(),config={mode:'canonical-live' as const,storageDir:join(temp,'projects'),writerOwner:'ground-local-cli-v0'};
 withCanonicalWriter(config,options=>{
  saveProject(f.legacy,options);const before=loadProjectSnapshot(f.project,options);
  for(const invalid of [{...f.legacy,claim_assessments:[]},{...f.legacy,claims:[f.claim]},f.initial])assert.throws(()=>saveProject(invalid as any,options));
  assert.equal(loadProjectSnapshot(f.project,options).fingerprint,before.fingerprint);
 });
 report.owner_writer={tested_root:'disposable test root',v26_state_rejected:true,vnext_claim_rejected:true,new_collection_rejected:true};
 // A mixed Project is explicitly constructed in the isolated fixture only.
 const {contract,predicate_ref,manifestation_scope,...old}=f.claim;
 f.legacy.claims.push({...old,id:randomUUID(),confidence:0.4});
 const store=createIsolatedStore(mkdtempSync(join(temp,'vnext-'))),initial=store.initialize(f.legacy);
 const before=store.loadProjectSnapshot(f.project),added=addClaim(f,initial);store.saveProject(added.state,before.fingerprint,added.context);
 const a=assessment(f,added.state,added.context.artifacts),next=addAssessment(added.state,a.record,a.context);
 const saved=store.saveProject(next,store.loadProjectSnapshot(f.project).fingerprint,a.context);
 assert.equal(getClaimAssessmentView(saved.state,old.id).kind,'claim_proposition');
 assert.equal(getClaimAssessmentView(saved.state,f.legacy.claims[0].id).kind,'legacy_claim');
 assert.notDeepEqual(comparisonScope(saved.state.claims[0]),comparisonScope(saved.state.claims[1]));
 assert.throws(()=>addAssessment(saved.state,{...a.record,id:randomUUID(),claim_id:f.legacy.claims[0].id},a.context));
 report.explicit_isolated_v26={legacy_claims:1,vnext_claims:1,assessments:1,scopes_separate:true,legacy_assessment_rejected:true};
}finally{rmSync(temp,{recursive:true,force:true});}
const args=process.argv.slice(2);
assert.ok(args.length===0||(args.length===2&&args[0]==='--runtime-config'),'Use --runtime-config <absolute approved config path> or omit live read');
if(args.length){
 const config=JSON.parse(readFileSync(args[1],'utf8'));
const live=loadProjectSnapshot('088d09dc-dfc5-487a-8f8f-22d2b33a9249',{mode:'canonical-live',storageDir:config.storageDir});
assert.equal(live.fingerprint,'9ff0d8070296d2d5493b618b13d75beab003581a6f7011ae642a53f46fc453cf');assert.equal(live.stored_schema_version,'0.1.25');
const s=live.state;assert.equal(s.reality_entities.length,11);assert.ok(s.reality_entities.every(e=>e.kind==='document'));assert.equal(s.epistemic_observations.length,16);assert.equal(s.evidence.length,16);assert.equal(s.claims.length,0);
const dry=normalizeForRead(s);assert.deepEqual({...dry,schema_version:s.schema_version,claim_assessments:undefined},{...s,claim_assessments:undefined});
report.live={fingerprint:live.fingerprint,stored_schema:live.stored_schema_version,read_schema:live.read_schema_version,documents:s.reality_entities.length,observations:s.epistemic_observations.length,evidence:s.evidence.length,claims:0,dry_delta:{schema_version:'0.1.26',claim_assessments:[]},written:false};
}
console.log(JSON.stringify(report,null,2));
