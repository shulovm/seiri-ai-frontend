import { readFileSync, lstatSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { isAbsolute, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { loadProjectSnapshot } from '../../ground-core/file-store.js';
import { materializeRound6, traceTerritory, queryTerritory, assertTerritorialProjection, type Round6 } from '../../ground-core/experimental/historical-reality/round6/territory.js';

export function config(env: NodeJS.ProcessEnv) {
  const root = env.GROUND_WORKER_INPUT_DIR;
  if (!root || !isAbsolute(root) || env.GROUND_WORKER_INPUT_SCOPE !== 'historical-round6-staging') throw new Error('INVALID_CONFIG');
  const number = (key: string, fallback: number, min: number, max: number) => {
    const raw = env[key] ?? String(fallback);
    if (!/^\d+$/.test(raw)) throw new Error('INVALID_CONFIG');
    const n = Number(raw);
    if (!Number.isSafeInteger(n) || n < min || n > max) throw new Error('INVALID_CONFIG');
    return n;
  };
  return { root, interval: number('GROUND_WORKER_INTERVAL_MS', 60000, 1000, 86400000),
    port: number('GROUND_WORKER_HEALTH_PORT', 8080, 1024, 65535) };
}

// Packaging pins bind exactly the admitted, tracked historical corpus to this image.
// They confer no production authority or source-authenticity certification.
const pins = JSON.parse(readFileSync(fileURLToPath(new URL('./corpus-pins.json', import.meta.url)), 'utf8')) as {path:string,sha256:string}[];
export function verify(input: ReturnType<typeof config>) {
  const root = resolve(input.root);
  const read = (path: string) => {
    const full = resolve(root, path);
    if (!full.startsWith(root + sep)) throw new Error('INPUT_ESCAPE');
    let part = root;
    for (const segment of path.split('/')) {
      part = resolve(part, segment);
      if (lstatSync(part).isSymbolicLink()) throw new Error('INPUT_SYMLINK');
    }
    if (!lstatSync(full).isFile()) throw new Error('INPUT_NOT_FILE');
    return readFileSync(full);
  };
  // Read each exact byte buffer once, and use those verified bytes throughout the pass.
  const corpus = new Map<string, Buffer>();
  for (const pin of pins) {
    const bytes = read(pin.path);
    if (createHash('sha256').update(bytes).digest('hex') !== pin.sha256) throw new Error('INPUT_INTEGRITY');
    corpus.set(pin.path, bytes);
  }
  const text = (path: string) => {
    const bytes = corpus.get(path);
    if (!bytes) throw new Error('UNPINNED_INPUT');
    return bytes.toString('utf8');
  };
  const json = (path: string) => JSON.parse(text(path));
  const r = json('round6/round6.dataset.json') as Round6;
  const data = materializeRound6(text('round1.dataset.json'), text('round2/round2.dataset.json'),
    text('round3/round3.dataset.json'), text('round4/round4.dataset.json'), text('round5/candidate-inventory.json'), r);
  const derived = [...r.rows,...r.places,...r.contrasts,...r.chains,...r.cases,...r.cases.map(x=>x.reconstruction),...r.dependencies,...Object.values(r.documentary).flat()];
  const traces = derived.map(x=>traceTerritory(data,r,x.id));
  const queries = r.rows.map(x=>queryTerritory(data,r,{place_id:x.place_id,actor_id:x.actor_id,dimension:x.dimension,functional:x.scope.functional,assertion_form:x.assertion_form,population:x.scope.population,infrastructure:x.scope.infrastructure,day:'1904-02-26'}));
  if (!isDeepStrictEqual(data,json('round6/replay/materialized.dataset.json')) ||
      !isDeepStrictEqual(traces,json('round6/replay/evidence-traces.json')) ||
      !isDeepStrictEqual(queries,json('round6/replay/territorial-queries.json'))) throw new Error('REPLAY_MISMATCH');
  const id = '19041904-1904-4904-8904-190419046006';
  const snapshot = loadProjectSnapshot(id, { storageDir: resolve(root,'round6/replay'), mode:'local' });
  const archived = corpus.get('round6/replay/'+id+'.json')!;
  if (!snapshot.bytes.equals(archived)) throw new Error('SNAPSHOT_CHANGED');
  assertTerritorialProjection(snapshot.state,data,r);
  if (snapshot.state.reality_events.length || snapshot.state.reality_states.length || snapshot.state.epistemic_observations.length) throw new Error('AUTHORITY_PROMOTION');
  return { input_scope:'historical-round6-staging', files_checked:pins.length, source_traversals:traces.length,
    queries_checked:queries.length, claims:data.claims.length, evidence:snapshot.state.evidence.length,
    production_input:false, production_authority:false, source_authenticity_certified:false };
}
