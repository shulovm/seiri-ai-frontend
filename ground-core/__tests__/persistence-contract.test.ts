import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { syncBuiltinESMExports } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, it, mock } from 'node:test';
import { createEmptyProject } from '../state-engine.js';
import { getStorageDir, listProjects, loadProject, loadProjectSnapshot, saveProject } from '../file-store.js';
import { runCli } from '../cli.js';
import { buildFreeWaterPhase0Fixture, validProjectStateV010 } from './fixtures.js';

describe('STORAGE-002 persistence contract', () => {
  let root: string;
  beforeEach(() => { root = fs.mkdtempSync(join(tmpdir(),'ground-persistence-')); });
  afterEach(() => { mock.restoreAll(); syncBuiltinESMExports(); fs.rmSync(root,{recursive:true,force:true}); });
  const hash = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex');

  for (const command of ['reality-apply', 'reconcile-apply']) {
    it(`${command} publishes through canonical storage without missing local fixtures`, () => {
      const state = buildFreeWaterPhase0Fixture();
      const options = { storageDir: root, writeOut: () => {}, writeErr: () => {} };
      saveProject(state, options);
      const before = loadProjectSnapshot(state.project.id, options);
      const proposal = join(root, 'proposal.json');
      assert.equal(runCli(['reality-propose', state.project.id, '--text',
        '配布場所、新宿中央公園に決めた', '--extractor', 'mock', '--out', proposal], options), 0);
      assert.equal(loadProjectSnapshot(state.project.id, options).fingerprint, before.fingerprint);
      assert.equal(runCli([command, state.project.id, '--proposal', proposal], options), 0);
      const after = loadProjectSnapshot(state.project.id, options);
      assert.equal(after.validation.valid, true);
      assert.notEqual(after.fingerprint, before.fingerprint);
      assert.ok(after.state.observations.length > before.state.observations.length);
    });
  }

  it('invalid state never replaces valid final bytes', () => {
    const a=createEmptyProject({title:'A'});saveProject(a,{storageDir:root});
    const path=join(root,a.project.id+'.json'),before=fs.readFileSync(path);
    assert.throws(()=>saveProject({...a,project:{...a.project,title:''}},{storageDir:root}));
    assert.deepEqual(fs.readFileSync(path),before);
  });

  it('partial temp write failure leaves A intact; temp is same-directory and excluded', () => {
    const a=createEmptyProject({title:'A'});saveProject(a,{storageDir:root});
    const original=fs.writeFileSync;
    mock.method(fs,'writeFileSync',(fd: number, bytes: Buffer)=>{
      assert.equal(typeof fd,'number');
      original(fd,bytes.subarray(0,17));
      const temp=fs.readdirSync(root).find(name=>name.endsWith('.tmp'));
      assert.ok(temp?.startsWith('.ground-'+a.project.id+'-'));
      assert.equal(fs.readFileSync(join(root,temp!)).length,17);
      assert.deepEqual(listProjects({storageDir:root}),[a.project.id]);
      assert.equal(loadProject(a.project.id,{storageDir:root}).project.title,'A');
      throw Object.assign(new Error('simulated disk full'),{code:'ENOSPC'});
    });syncBuiltinESMExports();
    assert.throws(()=>saveProject({...a,project:{...a.project,title:'B'}},{storageDir:root}),/disk full/);
    assert.equal(loadProject(a.project.id,{storageDir:root}).project.title,'A');
  });

  it('readers around rename observe complete A then complete B; permissions retained', () => {
    const a=createEmptyProject({title:'A'});saveProject(a,{storageDir:root});
    fs.chmodSync(join(root,a.project.id+'.json'),0o640);
    const rename=fs.renameSync;
    mock.method(fs,'renameSync',(from:string,to:string)=>{
      assert.equal(loadProject(a.project.id,{storageDir:root}).project.title,'A');
      assert.equal(JSON.parse(fs.readFileSync(from,'utf8')).project.title,'B');
      rename(from,to);
      assert.equal(loadProject(a.project.id,{storageDir:root}).project.title,'B');
    });syncBuiltinESMExports();
    saveProject({...a,project:{...a.project,title:'B'}},{storageDir:root});
    assert.equal(fs.statSync(join(root,a.project.id+'.json')).mode&0o777,0o640);
    assert.deepEqual(fs.readdirSync(root),[a.project.id+'.json']);
  });

  it('rename failure preserves A and does not report save success', () => {
    const a=createEmptyProject({title:'A'});saveProject(a,{storageDir:root});
    mock.method(fs,'renameSync',()=>{throw new Error('rename failed');});syncBuiltinESMExports();
    assert.throws(()=>saveProject({...a,project:{...a.project,title:'B'}},{storageDir:root}),/rename failed/);
    assert.equal(loadProject(a.project.id,{storageDir:root}).project.title,'A');
  });

  it('one exact read supplies raw bytes, fingerprint, stored object and normalized state', () => {
    const a=createEmptyProject({title:'A'});saveProject(a,{storageDir:root});
    const path=join(root,a.project.id+'.json'),bytes=fs.readFileSync(path),read=fs.readFileSync;
    let reads=0;
    mock.method(fs,'readFileSync',(fd: number)=>{
      assert.equal(typeof fd,'number');reads++;
      const returned=read(fd);
      // Publish a newer complete file after the read but before parsing/hashing.
      saveProject({...a,project:{...a.project,title:'B'}},{storageDir:root});
      return returned;
    });syncBuiltinESMExports();
    const snapshot=loadProjectSnapshot(a.project.id,{storageDir:root});
    assert.equal(reads,1);assert.equal(snapshot.fingerprint,hash(bytes));
    assert.deepEqual(snapshot.bytes,bytes);assert.deepEqual(snapshot.stored,JSON.parse(bytes.toString()));
    assert.equal(snapshot.state.project.title,'A');assert.equal(snapshot.validation.valid,true);
    mock.restoreAll();syncBuiltinESMExports();
    const b=loadProjectSnapshot(a.project.id,{storageDir:root});
    assert.equal(b.state.project.title,'B');assert.notEqual(b.fingerprint,snapshot.fingerprint);
    assert.equal(loadProjectSnapshot(a.project.id,{storageDir:root}).fingerprint,b.fingerprint);
    assert.deepEqual(loadProject(a.project.id,{storageDir:root}),b.state);
  });

  it('byte-only changes change fingerprint without inventing canonical revision', () => {
    const a=createEmptyProject({title:'A'});saveProject(a,{storageDir:root});
    const first=loadProjectSnapshot(a.project.id,{storageDir:root});
    fs.appendFileSync(join(root,a.project.id+'.json'),'\n');
    const second=loadProjectSnapshot(a.project.id,{storageDir:root});
    assert.notEqual(first.fingerprint,second.fingerprint);assert.deepEqual(first.state,second.state);
  });

  it('stored schema remains distinct from read schema and load never writes back', () => {
    const path=join(root,validProjectStateV010.project.id+'.json');
    const bytes=Buffer.from(JSON.stringify(validProjectStateV010));fs.writeFileSync(path,bytes);
    const s=loadProjectSnapshot(validProjectStateV010.project.id,{storageDir:root});
    assert.equal(s.stored_schema_version,validProjectStateV010.schema_version);
    assert.equal(s.read_schema_version,'0.1.25');assert.deepEqual(fs.readFileSync(path),bytes);
  });

  it('ID mismatch, malformed JSON and unknown schemas fail closed', () => {
    const a=createEmptyProject({title:'A'}),b=createEmptyProject({title:'B'});
    const path=join(root,a.project.id+'.json');
    for(const bytes of [JSON.stringify(b),'{partial',JSON.stringify({...a,schema_version:'99.0.0'})]){
      fs.writeFileSync(path,bytes);assert.throws(()=>loadProjectSnapshot(a.project.id,{storageDir:root}));
    }
  });

  it('discovery lists only regular UUID.json candidates, not validated Projects or temp files', () => {
    const a=createEmptyProject({title:'A'}),b=createEmptyProject({title:'B'});
    fs.writeFileSync(join(root,a.project.id+'.json'),'{malformed');
    fs.writeFileSync(join(root,'.ground-leftover.tmp'),'{partial');
    fs.writeFileSync(join(root,'notes.json'),'{}');fs.mkdirSync(join(root,b.project.id+'.json'));
    assert.deepEqual(listProjects({storageDir:root}),[a.project.id]);
    assert.throws(()=>loadProject(a.project.id,{storageDir:root}));
    assert.ok(fs.existsSync(join(root,'.ground-leftover.tmp')));
  });

  it('Project symlinks and path escapes are rejected by read, save and discovery', () => {
    const a=createEmptyProject({title:'A'}),outside=fs.mkdtempSync(join(tmpdir(),'ground-outside-'));
    try {
      const target=join(outside,'outside.json'),bytes=JSON.stringify(a);fs.writeFileSync(target,bytes);
      fs.symlinkSync(target,join(root,a.project.id+'.json'));
      assert.deepEqual(listProjects({storageDir:root}),[]);
      assert.throws(()=>loadProject(a.project.id,{storageDir:root}));
      assert.throws(()=>saveProject(a,{storageDir:root}));
      for(const id of ['../outside','/etc/passwd','a/b','..',a.project.id+'.json'])assert.throws(()=>loadProject(id,{storageDir:root}));
      assert.equal(fs.readFileSync(target,'utf8'),bytes);
    } finally {fs.rmSync(outside,{recursive:true,force:true});}
  });

  it('root aliases resolve to configured storage; explicit override precedes environment', () => {
    const alias=join(root,'alias'),actual=join(root,'actual');fs.mkdirSync(actual);fs.symlinkSync(actual,alias);
    const a=createEmptyProject({title:'A'});saveProject(a,{storageDir:alias});
    assert.equal(loadProject(a.project.id,{storageDir:actual}).project.id,a.project.id);
    const previous=process.env.GROUND_CORE_STORAGE_DIR;
    try{process.env.GROUND_CORE_STORAGE_DIR=actual;assert.equal(getStorageDir(),actual);assert.equal(getStorageDir({storageDir:alias}),alias);}
    finally{if(previous===undefined)delete process.env.GROUND_CORE_STORAGE_DIR;else process.env.GROUND_CORE_STORAGE_DIR=previous;}
  });

  it('atomic replacement alone does not coordinate two stale writers (unsupported operation)', () => {
    const a=createEmptyProject({title:'A'});saveProject(a,{storageDir:root});
    const writer1=loadProject(a.project.id,{storageDir:root}),writer2=loadProject(a.project.id,{storageDir:root});
    writer1.project.title='writer1';saveProject(writer1,{storageDir:root});
    writer2.project.summary='writer2';saveProject(writer2,{storageDir:root});
    const final=loadProject(a.project.id,{storageDir:root});
    assert.equal(final.project.title,'A');assert.equal(final.project.summary,'writer2');
  });
});
