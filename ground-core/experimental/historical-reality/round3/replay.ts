import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createEmptyProject,applyPatch} from '../../../state-engine.js';
import {saveProject,loadProject} from '../../../file-store.js';
import {getEvidenceForClaim} from '../../../reality/epistemic.js';
import {projectSourceAssertions} from '../substrate.js';
import {actorPropagationAt,type Round2} from '../round2/propagation.js';
import {materializeRound3,traceDocumentary,actorStagesAt,type Round3} from './lineage.js';
const here=dirname(fileURLToPath(import.meta.url));const bytes=readFileSync(resolve(here,'round3.dataset.json'),'utf8');const round=JSON.parse(bytes) as Round3;
const parent1=readFileSync(resolve(here,'../round1.dataset.json'),'utf8'),parent2=readFileSync(resolve(here,'../round2/round2.dataset.json'),'utf8');
const data=materializeRound3(parent1,parent2,round);const hash=(b:Buffer|string)=>createHash('sha256').update(b).digest('hex');
if(hash(readFileSync(resolve(here,'../round1.landscape.json')))!==round.parents.landscape_sha256)throw new Error('Landscape integrity mismatch');
for(const a of round.assets){const b=readFileSync(resolve(here,a.path));if(hash(b)!==a.sha256||b.length!==a.bytes)throw new Error('Asset integrity mismatch');if(a.format==='pdf'&&b.subarray(0,5).toString()!=='%PDF-')throw new Error('Not a PDF');if(a.format==='png'&&b.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw new Error('Not a PNG');if(a.format==='json')JSON.parse(b.toString('utf8'));if(a.format==='html'&&!/<(?:!doctype\s+html|html|head|body)/i.test(b.toString('latin1')))throw new Error('Not HTML');}
const p2=JSON.parse(parent2) as Round2;for(const a of p2.assets){const b=readFileSync(resolve(here,'../round2',a.path));if(hash(b)!==a.sha256||b.length!==a.bytes||b.subarray(0,5).toString()!=='%PDF-')throw new Error('Inherited asset changed');}
const output=resolve(process.argv[2]??resolve(here,'replay'));mkdirSync(output,{recursive:true});const write=(name:string,v:unknown)=>writeFileSync(resolve(output,name),JSON.stringify(v,null,2)+'\n');
write('sidecar.reload.json',round);const reloaded=JSON.parse(readFileSync(resolve(output,'sidecar.reload.json'),'utf8')) as Round3;
if(JSON.stringify(materializeRound3(parent1,parent2,reloaded))!==JSON.stringify(data))throw new Error('Sidecar reload changed meaning');
const d=round.documentary;const records=[...d.artifacts,...d.references,...d.messages,...d.lineage,...d.stages,...d.assessments,...d.gaps,...d.translation_checks,...d.reconstructions];
const traces=records.map(r=>traceDocumentary(data,reloaded,r.id));if(traces.some(t=>!t.claims.length||!t.sources.length))throw new Error('Missing derived provenance');
const p=createEmptyProject({title:'Historical Reality — Round3',summary:'Documentary identity, scoped certainty and custody sidecar'});p.project.id='19041904-1904-4904-8904-190419043004';p.current_state.project_id=p.project.id;
const patch=projectSourceAssertions(data,p,'2026-09-14T00:00:00.000Z'),state=applyPatch(p,patch);saveProject(state,{storageDir:output});const loaded=loadProject(state.project.id,{storageDir:output});
if(loaded.reality_events.length||loaded.reality_states.length||loaded.claims.some(c=>getEvidenceForClaim(loaded,c.id).supports.length!==1))throw new Error('Unsafe projection or lost core trace');
write('materialized.dataset.json',data);write('documentary-traces.json',traces);write('source-assertions.patch.json',patch);
write('actor-queries.json',{round1_round2:actorPropagationAt(data,p2,'jp-minister-ru','1904-02-10'),round3:[['ru-minister-jp','m-reply'],['ru-minister-jp','m-invitation'],['jp-fm-receiving-office','m-jp82'],['jp-fm','m-reply'],['jp-cabinet','m-reply']].map(([actor,message])=>actorStagesAt(data,round,actor,message,'1904-02-08'))});
write('negative-search-records.json',d.searches.map(s=>traceDocumentary(data,round,s.id)));
const summary={counts:{sources:data.sources.length,claims:data.claims.length,actors:data.actors.length,relations:data.evidence_relations.length,...Object.fromEntries(Object.entries(d).map(([k,v])=>[k,v.length])),assets:round.assets.length},parent_integrity:'Round1, Round2 and Round1 landscape SHA256 verified; inherited PDF assets verified',dataset_sha256:hash(bytes),derived_traces:traces.length,canonical_projection:{claims:loaded.claims.length,historical_events:0,historical_states:0,scope:'Inherited 0.95 uncalibrated source-content attribution only'},validation:'Sidecar serialize/reload/materialize; every derived basis traced; canonical file-store reload; new asset magic/size/hash plus inherited PDF integrity',limits:['No independent original authentication','No knowledge/read stage generated','1905/1906 edition link and underlying telegram remain unresolved','Full PDFs acquired; only declared pages inspected','Release announcement date is not exact scan creation date']};
write('validation.json',summary);console.log(JSON.stringify(summary,null,2));
