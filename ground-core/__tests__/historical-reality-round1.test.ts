import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { createEmptyProject, applyPatch } from '../state-engine.js';
import { saveProject, loadProject } from '../file-store.js';
import { getEvidenceForClaim } from '../reality/epistemic.js';
import { getRealityWorldline } from '../reality/worldline.js';
import { actorEvidenceAt, projectSourceAssertions, traceReconstruction, validateDataset, type HistoricalDataset } from '../experimental/historical-reality/substrate.js';

const here = dirname(fileURLToPath(import.meta.url));
const read = (): HistoricalDataset => JSON.parse(readFileSync(resolve(here,'../experimental/historical-reality/round1.dataset.json'),'utf8'));
const TS = '2026-09-14T00:00:00.000Z';

test('Round 1 persists through canonical patch/file-store while preserving external source routes and ontic separation',()=>{
  const data=read();
  const base=createEmptyProject({title:'historical calibration'});
  const patch=projectSourceAssertions(data,base,TS);
  const state=applyPatch(base,patch);
  assert.equal(base.claims.length,0);
  assert.equal(state.claims.length,data.claims.length);
  assert.equal(state.reality_events.length,0);
  assert.equal(state.reality_states.length,0);
  const dir=mkdtempSync(resolve(tmpdir(),'historical-ground-'));
  try {
    saveProject(state,{storageDir:dir});
    const loaded=loadProject(state.project.id,{storageDir:dir});
    assert.deepEqual(loaded.claims,state.claims);
    for(const claim of loaded.claims){
      const evidence=getEvidenceForClaim(loaded,claim.id);
      assert.equal(evidence.supports.length,1);
      assert.ok(data.sources.some(x=>x.id===evidence.supports[0].provenance.external_id && x.url===evidence.supports[0].external_ref));
      assert.equal(claim.applicable_from,TS);
      assert.equal(claim.predicate,'inspected_source_assertion');
      assert.equal(getRealityWorldline(loaded,claim.subject_id!).ordered_entries.length,0);
    }
    const again=applyPatch(loaded,patch);
    assert.equal(again.claims.length,state.claims.length);
    assert.equal(again.evidence.length,state.evidence.length);
    assert.equal(again.claim_evidence_links.length,state.claim_evidence_links.length);
  } finally {rmSync(dir,{recursive:true,force:true});}
});

test('Fate alternatives and qualifications survive serialize/replay; no binary contradiction or independent corroboration invented',()=>{
  const data=JSON.parse(JSON.stringify(read())) as HistoricalDataset;
  const trace=traceReconstruction(data,'r-variag');
  assert.equal(trace.reconstruction.status,'unresolved');
  assert.equal(trace.reconstruction.alternatives.length,2);
  assert.deepEqual(new Set(trace.claims.map(x=>x.id)),new Set(['c395-captured','cjacar-selfsink']));
  assert.equal(trace.relations.find(x=>x.id==='e-fate-qualifies')!.relation,'qualifies');
  assert.equal(trace.sources.find(x=>x.id==='jacar:chemulpo-guide')!.inspection,'guide_text_inspected');
  const state=createEmptyProject({title:'qualification'});
  const patch=projectSourceAssertions(data,state,TS);
  assert.equal(patch.operations.filter(x=>x.entity==='claim_evidence_link').length,data.claims.length);
  assert.ok(patch.operations.filter(x=>x.entity==='claim_evidence_link').every(x=>x.payload?.relation==='SUPPORTS'));
});

test('Source date never fills unknown conversation time; an actor report is not national knowledge or ignorance',()=>{
  const data=read();
  const query=actorEvidenceAt(data,'jp-minister-ru','1904-02-07');
  assert.equal(query.documented_before_day.length,0);
  assert.equal(query.same_day_order_unknown.length,0);
  assert.equal(query.unplaced.length,2);
  assert.ok(query.unplaced.some(x=>x.stance==='explicit_no_positive_knowledge'));
  assert.equal(actorEvidenceAt(data,'jp-government','1904-02-07').unplaced.length,0);
  assert.throws(()=>actorEvidenceAt(data,'Russia','1904-02-07'),/Unknown actor/);
  assert.throws(()=>actorEvidenceAt(data,'jp-government','1904-02-30'),/Gregorian day/);
});

test('Coarse day excludes future records and cannot establish ordering on the same day',()=>{
  const data=read();
  data.actor_epistemic_records[0].as_of={raw:'test conversation date',precision:'day',normalized_day:'1904-02-06'};
  assert.equal(actorEvidenceAt(data,'griscom','1904-02-05').documented_before_day.length,0);
  assert.equal(actorEvidenceAt(data,'griscom','1904-02-06').same_day_order_unknown.length,1);
  assert.equal(actorEvidenceAt(data,'griscom','1904-02-07').documented_before_day.length,1);
});

test('Provenance, raw dual dates and explicit unknown survive JSON; broken references and unsupported semantic promotions rejected',()=>{
  const data=read();
  validateDataset(data);
  const source=data.sources.find(x=>x.id==='frus:1904:680')!;
  assert.ok(JSON.stringify(source).includes('27th January [9th February]'));
  assert.ok(JSON.stringify(source).includes('time_standard'));
  const bad=structuredClone(data); bad.claims[0].source_id='missing';
  assert.throws(()=>validateDataset(bad),/Dangling/);
  const duplicate=structuredClone(data); duplicate.sources[1].id=duplicate.sources[0].id;
  assert.throws(()=>validateDataset(duplicate),/Duplicate/);
  const stance=structuredClone(data);
  (stance.actor_epistemic_records[0] as unknown as {stance:string}).stance='knew';
  assert.throws(()=>validateDataset(stance),/epistemic stance/);
  const date=structuredClone(data); date.sources[0].creation.normalized_day='1904-02-30';
  assert.throws(()=>validateDataset(date),/normalized day/);
  const extraction=structuredClone(data); extraction.claims[0].extraction.context='';
  assert.throws(()=>validateDataset(extraction),/extraction context/);
});

test('Narrative → interpretation → claim → source path is explicit, with no reconstructed necessity/consent verdict',()=>{
  const data=read(); validateDataset(data);
  const narrative=data.narratives[0];
  const interpretations=data.interpretations.filter(x=>narrative.interpretation_ids.includes(x.id));
  assert.equal(interpretations.length,2);
  assert.ok(interpretations.every(x=>x.claim_ids.length>0 && data.sources.some(s=>s.id===x.source_id)));
  assert.ok(data.reconstructions.every(x=>!x.proposition.includes('uncoerced consent')));
});
