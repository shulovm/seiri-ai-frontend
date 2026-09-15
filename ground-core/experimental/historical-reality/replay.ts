import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createEmptyProject, applyPatch } from '../../state-engine.js';
import { saveProject, loadProject } from '../../file-store.js';
import { getEvidenceForClaim } from '../../reality/epistemic.js';
import { getRealityWorldline } from '../../reality/worldline.js';
import { actorEvidenceAt, projectSourceAssertions, traceReconstruction, validateDataset, type HistoricalDataset } from './substrate.js';

const here = dirname(fileURLToPath(import.meta.url));
const dataset = JSON.parse(readFileSync(resolve(here,'round1.dataset.json'),'utf8')) as HistoricalDataset;
validateDataset(dataset);
const output = resolve(process.argv[2] ?? resolve(here,'replay'));
mkdirSync(output,{recursive:true});
const project = createEmptyProject({title:'Historical Reality — Russo-Japanese War Round 1',summary:'Experimental source-content projection; historical sidecar required.'});
project.project.id = '19041904-1904-4904-8904-190419041904';
project.current_state.project_id = project.project.id;
const patch = projectSourceAssertions(dataset,project,'2026-09-14T00:00:00.000Z');
const state = applyPatch(project,patch);
saveProject(state,{storageDir:output});
const loaded = loadProject(state.project.id,{storageDir:output});
const routes = loaded.claims.map(claim=>({claim_id:claim.id,experimental_claim_id:(claim.value as Record<string,unknown>).experimental_claim_id,evidence:getEvidenceForClaim(loaded,claim.id)}));
if (routes.some(x=>x.evidence.supports.length!==1)) throw new Error('Source trace lost after persistence');
if (loaded.reality_events.length || loaded.reality_states.length) throw new Error('Historical claim promoted to reality');
const traces = dataset.reconstructions.map(x=>traceReconstruction(dataset,x.id));
const summary = {
  schema_version:dataset.schema_version,
  counts:{sources:dataset.sources.length,claims:dataset.claims.length,relations:dataset.evidence_relations.length,actors:dataset.actors.length,reconstructions:dataset.reconstructions.length},
  canonical_projection:{document_entities:loaded.reality_entities.length,source_content_claims:loaded.claims.length,evidence:loaded.evidence.length,historical_events:loaded.reality_events.length,historical_states:loaded.reality_states.length},
  historical_actor_query:actorEvidenceAt(dataset,'jp-minister-ru','1904-02-07'),
  canonical_worldline_entries:loaded.reality_entities.reduce((sum,x)=>sum+getRealityWorldline(loaded,x.id).ordered_entries.length,0),
  validation:'canonical patch applied; canonical file-store saved and loaded; every projected claim retains one source evidence; reconstruction traces include sidecar sources',
  limits:['No original naval scans or Russian-language originals inspected','No assertion of actual actor knowledge from source date','Canonical projection is partial; preserve dataset sidecar with it','Structural validation does not authenticate sources or establish historical truth'],
};
writeFileSync(resolve(output,'source-assertions.patch.json'),JSON.stringify(patch,null,2)+'\n');
writeFileSync(resolve(output,'reconstruction-traces.json'),JSON.stringify(traces,null,2)+'\n');
writeFileSync(resolve(output,'validation.json'),JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
