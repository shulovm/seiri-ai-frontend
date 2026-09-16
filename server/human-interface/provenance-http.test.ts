import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { readFileSync } from 'node:fs';
import { createHumanInterfaceRouter } from './http-route.js';
import { createProvenanceSourceResolver, ProvenanceSourceError } from './provenance-source.js';
import { createHumanRealityReader, createHumanBrowseReader } from './read-adapter.js';
import { realitySourceRegistry } from './source-registry.js';
import { createHumanSourceResolver } from './source-resolver.js';
const bindings = JSON.parse(readFileSync('fixtures/human-interface/provenance/historical-round1-v1/manifest.json', 'utf8')).bindings;
const route = (b: any) => `/api/human-interface/reality/${b.project_id}/${b.entity_id}/observations/${b.observation_id}/provenance-source`;
async function serve(t: any, resolver: any, reader = createHumanRealityReader(realitySourceRegistry)) {
    const app = express();
    app.use('/api/human-interface', createHumanInterfaceRouter(reader, createHumanBrowseReader(realitySourceRegistry), resolver));
    const server = app.listen(0, '127.0.0.1');
    await new Promise<void>((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
    t.after(() => { server.closeAllConnections(); server.close(); });
    return `http://127.0.0.1:${(server.address() as any).port}`;
}
test('HTTP method/query policy; required/invalid header; no client file/source/ref parameters', async (t) => {
    const read = createHumanRealityReader(realitySourceRegistry), base = await serve(t, createProvenanceSourceResolver({ readEntity: read }));
    for (const [suffix, options, status, error] of [
        ['', { method: 'POST' }, 405, 'METHOD_NOT_ALLOWED'],
        ['?path=../../secret', {}, 400, 'UNSUPPORTED_QUERY_PARAMETERS'],
        ['?source_key=other', {}, 400, 'UNSUPPORTED_QUERY_PARAMETERS'],
        ['?commit=HEAD', {}, 400, 'UNSUPPORTED_QUERY_PARAMETERS'],
        ['', {}, 428, 'SNAPSHOT_PRECONDITION_REQUIRED'],
        ['', { headers: { 'If-Ground-Snapshot-Fingerprint': '../secret' } }, 400, 'SNAPSHOT_PRECONDITION_INVALID'],
    ] as const) {
        const r = await fetch(base + route(bindings[0]) + suffix, options);
        assert.equal(r.status, status);
        assert.equal(r.headers.get('cache-control'), 'no-store');
        assert.equal((await r.json()).transport_error.code, error);
    }
});
test('HTTP B15 unsupported / unknown scope and all proof Entity reads unchanged', async (t) => {
    const reader = createHumanRealityReader(realitySourceRegistry), base = await serve(t, createProvenanceSourceResolver({ readEntity: reader }));
    const s = realitySourceRegistry.sources[1], body = reader(s.project_id, s.entity_id), b = { project_id: s.project_id, entity_id: s.entity_id, observation_id: body.canonical_records.observations[0].id };
    for (const [id, status, error] of [[b.observation_id, 422, 'PROVENANCE_SOURCE_UNSUPPORTED'], ['unknown', 404, 'OBSERVATION_NOT_IN_SCOPE']]) {
        const r = await fetch(base + route({ ...b, observation_id: id }), { headers: { 'If-Ground-Snapshot-Fingerprint': body.transport.source.snapshot_fingerprint } });
        assert.equal(r.status, status);
        assert.equal((await r.json()).transport_error.code, error);
    }
    for (const s of realitySourceRegistry.sources) {
        const r = await fetch(`${base}/api/human-interface/reality/${s.project_id}/${s.entity_id}`);
        assert.equal(r.status, 200);
        assert.deepEqual(await r.json(), reader(s.project_id, s.entity_id));
    }
});
test('source failures are classified locally; existing Entity API still succeeds', async (t) => {
    for (const error of ['PROVENANCE_SOURCE_UNAVAILABLE', 'PROVENANCE_INPUT_INTEGRITY_FAILURE', 'PROVENANCE_RECEIPT_INTEGRITY_FAILURE', 'PROVENANCE_PACKAGE_INTEGRITY_FAILURE', 'PROVENANCE_BINDING_AMBIGUOUS']) {
        const base = await serve(t, () => { throw new ProvenanceSourceError(error); });
        const r = await fetch(base + route(bindings[0]));
        assert.equal(r.status, 503);
        assert.deepEqual(await r.json(), { transport_error: { code: error } });
        const s = realitySourceRegistry.sources[0];
        assert.equal((await fetch(`${base}/api/human-interface/reality/${s.project_id}/${s.entity_id}`)).status, 200);
    }
});
test('live HTTP 16 exact selected inputs; 395/678/430 distinct; before/after bytes unchanged', { skip: !process.env.GROUND_RUNTIME_CONFIG }, async (t) => {
    const config = JSON.parse(readFileSync(process.env.GROUND_RUNTIME_CONFIG!, 'utf8')), file = `${config.storageDir}/${bindings[0].project_id}.json`, before = readFileSync(file);
    const reader = createHumanRealityReader(createHumanSourceResolver({ runtimeConfigPath: process.env.GROUND_RUNTIME_CONFIG }));
    let reads = 0;
    const base = await serve(t, createProvenanceSourceResolver({ readEntity: (p, e) => { reads++; return reader(p, e); } }), reader);
    const fingerprint = '9ff0d8070296d2d5493b618b13d75beab003581a6f7011ae642a53f46fc453cf';
    let sizes: number[] = [];
    const distinct: Record<string, Set<string>> = {};
    for (const b of bindings) {
        const prior = reads, r = await fetch(base + route(b), { headers: { 'If-Ground-Snapshot-Fingerprint': fingerprint } });
        assert.equal(r.status, 200);
        assert.equal(reads, prior + 1);
        const text = await r.text();
        sizes.push(Buffer.byteLength(text));
        const out = JSON.parse(text);
        assert.equal(out.frozen_selected_input.report.id, b.report_id);
        assert.equal(out.raw_selected_input, readFileSync(`fixtures/human-interface/provenance/historical-round1-v1/${b.selected_input}`, 'utf8'));
        assert.equal(out.transport.project_snapshot_fingerprint, fingerprint);
        assert.ok(!text.includes('/Users/'));
        (distinct[b.source_id] ??= new Set()).add(out.transport.selected_input_fingerprint);
    }
    assert.equal(distinct['frus:1904:395'].size, 3);
    assert.equal(distinct['frus:1904:678'].size, 2);
    assert.equal(distinct['frus:1904:430'].size, 3);
    const mismatch = await fetch(base + route(bindings[0]), { headers: { 'If-Ground-Snapshot-Fingerprint': '0'.repeat(64) } });
    assert.equal(mismatch.status, 409);
    assert.equal((await mismatch.json()).transport_error.code, 'SNAPSHOT_MISMATCH');
    const defaultBase = await serve(t, undefined, reader);
    const defaultResponse = await fetch(defaultBase + route(bindings[0]), { headers: { 'If-Ground-Snapshot-Fingerprint': fingerprint } });
    assert.equal(defaultResponse.status, 200);
    assert.equal((await defaultResponse.json()).frozen_selected_input.report.id, 'c392-instruction');
    assert.deepEqual(readFileSync(file), before);
    console.log('Live HTTP response byte range', Math.min(...sizes), Math.max(...sizes));
});
test('Vite development server never serves private bundle files, including raw imports', async (t) => {
    const { createServer } = await import('vite');
    const server = await createServer({ logLevel: 'silent', server: { port: 0, host: '127.0.0.1', hmr: false } });
    await server.listen();
    t.after(() => server.close());
    const base = `http://127.0.0.1:${(server.httpServer!.address() as any).port}`;
    for (const path of ['/fixtures/human-interface/provenance/historical-round1-v1/392/receipt.json', '/fixtures/human-interface/provenance/historical-round1-v1/392/selected-input.json?raw', '/@fs' + process.cwd() + '/fixtures/human-interface/provenance/historical-round1-v1/manifest.json']) {
        const response = await fetch(base + path);
        assert.equal(response.status, 403);
        assert.ok(!(await response.text()).includes('record_hashes'));
    }
});
