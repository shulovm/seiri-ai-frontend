import React from 'react';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { tsImport } from 'tsx/esm/api';

const { readHumanReality } = await tsImport('./read-adapter.ts', import.meta.url);
const { default: View, RealityReadFailure } = await tsImport('../../src/human-interface/RealityReadView.jsx', import.meta.url);
const { fetchReality } = await tsImport('../../src/human-interface/read-client.js', import.meta.url);
const project = '19041904-1904-4904-8904-190419041904';
const entity = '72bf5051-f100-524a-ac33-7a911f6d974a';
const response = readHumanReality(project, entity);
const escape = (text: string) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');

test('client uses only the fixed GET boundary and returns the response unchanged', async () => {
  let calls = 0;
  const result = await fetchReality(project, entity, { fetcher: async (url: string, options: { method: string }) => {
    calls++;
    assert.equal(url, `/api/human-interface/reality/${project}/${entity}`);
    assert.equal(options.method, 'GET');
    return { ok: true, status: 200, json: async () => response };
  } });
  assert.equal(calls, 1);
  assert.equal(result, response);
});

test('readable fields and complete raw Entity, Claim, Link, Evidence and provenance retain API values', () => {
  const html = renderToStaticMarkup(<View response={response} />);
  const bundle = response.core_read_results.evidence_for_claim[0];
  for (const record of [response.canonical_records.entity, response.canonical_records.claims[0], ...bundle.links, ...bundle.supports]) {
    assert.ok(html.includes(escape(JSON.stringify(record, null, 2))));
    for (const name of Object.keys(record)) assert.ok(html.includes(`<dt>${name}</dt>`));
  }
  assert.ok(html.includes('<dt>confidence</dt><dd><code>0.95</code>'));
  assert.ok(html.includes('<dt>applicable_until</dt><dd><code>null</code>'));
  for (const name of ['applicable_from', 'recorded_at', 'created_at', 'updated_at']) {
    assert.ok(html.includes(`<dt>${name}</dt>`));
  }
  assert.ok(html.includes('Claim → ClaimEvidenceLink → Evidence'));
  assert.ok(html.includes('ClaimEvidenceLink · SUPPORTS'));
  assert.ok(html.includes('https://history.state.gov/historicaldocuments/frus1904/d392'));
  assert.ok(html.includes('<dt>provenance</dt>'));
  assert.ok(html.includes('0.1.24') && html.includes('0.1.25'));
});

test('zero canonical collections remain scope-limited counts and inspectable arrays', () => {
  const html = renderToStaticMarkup(<View response={response} />);
  for (const label of ['RealityEvent', 'RealityState', 'EpistemicObservation', 'Worldline entries · core read result']) {
    assert.ok(html.includes(`<strong>${label}</strong><span>この read scope で返された件数: 0</span>`));
  }
  assert.ok(html.includes('<pre>[]</pre>'));
  assert.doesNotMatch(html, /Nothing happened|Never observed|Data missing|Truth probability|trust score|No state exists/i);
});

test('HTTP integrity failure remains a distinct transport error, not an empty Reality view', async () => {
  let error;
  try {
    await fetchReality(project, entity, { fetcher: async () => ({ ok: false, status: 503,
      json: async () => ({ transport_error: { code: 'FIXTURE_INTEGRITY_FAILURE' } }) }) });
  } catch (caught) { error = caught; }
  assert.ok(error);
  const html = renderToStaticMarkup(<RealityReadFailure error={error} />);
  assert.ok(html.includes('FIXTURE_INTEGRITY_FAILURE') && html.includes('503'));
  assert.ok(html.includes('読取基盤の異常'));
  assert.ok(!html.includes('Records in this read scope') && !html.includes('件数: 0'));
  for (const code of ['PROJECT_SCOPE_MISMATCH', 'ENTITY_NOT_FOUND', 'SERVER_READ_FAILURE']) {
    const failure = renderToStaticMarkup(<RealityReadFailure error={{ code, status: code === 'SERVER_READ_FAILURE' ? 503 : 404 }} />);
    assert.ok(failure.includes(code));
  }
});

test('D separates transport, canonical records and core results with field-role notes', () => {
  const html = renderToStaticMarkup(<View response={response} />);
  for (const label of ['Canonical records · context', 'Transport metadata · read source',
    'Existing core read result · getRealityWorldline', 'Records in this read scope',
    'Identity / predicate', 'Claim content', 'Provenance · canonical fields',
    'Confidence · declared value', 'Applicability · proposition scope', 'Record / storage fields']) {
    assert.ok(html.includes(label));
  }
  assert.ok(html.includes('SUPPORTS はここでの真偽判定を示す UI label ではありません'));
  assert.ok(html.includes('source quality の評価ではありません'));
  assert.ok(html.includes('出来事の occurred_at とは異なる役割'));
  assert.ok(html.includes('fixture hash 検証後'));
});

test('client dependency boundary contains no fixture/core imports or temporal resolution', () => {
  for (const name of ['RealityExplorer.jsx', 'RealityReadView.jsx', 'read-client.js']) {
    const source = readFileSync(new URL(`../../src/human-interface/${name}`, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /from\s+['"][^'"]*(?:ground-core|fixtures)|import\([^)]*(?:ground-core|fixtures)|new Date|Date\.(?:parse|now)|getRealityWorldline\s*\(|getEvidenceForClaim\s*\(/);
  }
});

test('B15 populated panels retain full raw fields, temporal roles and core entry order', () => {
  const body = readHumanReality('b7c4492f-955a-4189-a913-5ece6c6a876a','3b35ea51-6db5-4dee-8759-bb17377cbc0c');
  const html = renderToStaticMarkup(<View response={body} />);
  for (const [type, count] of [['RealityEvent',1],['RealityState',2],['EpistemicObservation',2]] as const) {
    assert.equal(html.split(`data-record-type="${type}"`).length - 1, count);
  }
  const w=body.core_read_results.worldline;
  for(const record of [...w.events,...w.states,...body.canonical_records.observations]) {
    assert.ok(html.includes(escape(JSON.stringify(record,null,2))));
    for(const name of Object.keys(record)) assert.ok(html.includes(`<dt>${name}</dt>`));
  }
  assert.ok(html.includes('controlled-experiment-canonical-snapshot'));
  assert.ok(html.includes('<dt>valid_until</dt><dd><code>null</code>'));
  assert.ok(html.includes('<dt>value</dt><dd><code>false</code>'));
  assert.ok(html.includes('<dt>value</dt><dd><code>true</code>'));
  assert.ok(html.includes('<dt>latest_time</dt><dd><code>2026-09-01T11:00:00.000Z</code>'));
  assert.ok(html.includes('<dt>observed_at</dt><dd><code>2026-09-01T12:00:00.000Z</code>'));
  const order=[...html.matchAll(/data-worldline-entry="([^"]+)"/g)].map(x=>x[1]);
  assert.deepEqual(order,w.ordered_entries.map((x:{record_id:string})=>x.record_id));
  assert.equal(order.length,4);
  assert.ok(html.includes('Claim records: 0'));
  assert.ok(html.includes('Claim-linked Evidence bundles: 0'));
  assert.ok(html.includes('ProjectState 全体の Evidence 件数ではありません'));
  assert.doesNotMatch(html,/Unique linked Evidence returned in this scope: 0|Evidence: 0|ready \/ not ready/);
});

test('Round4 preserves all 23 Claim identities and shared Evidence identity in disclosures', () => {
  const body=readHumanReality('19041904-1904-4904-8904-190419044004','466b098e-ae25-5b28-ad11-a5dc931eeb75');
  const html=renderToStaticMarkup(<View response={body}/>);
  assert.equal(html.split('class="hi-claim"').length-1,23);
  assert.ok(html.includes('Claim records: 23'));
  assert.ok(html.includes('ClaimEvidenceLink records returned: 23'));
  assert.ok(html.includes('Unique linked Evidence returned in this scope: 1'));
  assert.deepEqual([...html.matchAll(/data-record-type="Claim" data-record-id="([^"]+)"/g)].map(x=>x[1]),body.canonical_records.claims.map((x:{id:string})=>x.id));
  for(const c of body.canonical_records.claims) assert.ok(html.includes(escape(JSON.stringify(c,null,2))));
  const evidenceIds=[...html.matchAll(/data-record-type="Evidence" data-record-id="([^"]+)"/g)].map(x=>x[1]);
  assert.equal(evidenceIds.length,23); assert.equal(new Set(evidenceIds).size,1);
  assert.equal(html.split('data-record-type="ClaimEvidenceLink · SUPPORTS"').length-1,23);
});

test('presentation never branches by source/domain or reorders canonical collections', () => {
  const source=readFileSync(new URL('../../src/human-interface/RealityReadView.jsx',import.meta.url),'utf8');
  assert.doesNotMatch(source,/human-001|e2-b15|historical-round4|controlled-experiment|if\s*\([^)]*(?:source|document|historical|BTC)|\.sort\(|\.reverse\(/);
});

test('all required read failures remain errors with no empty Reality rendering', () => {
  for(const code of ['PROJECT_SCOPE_MISMATCH','ENTITY_NOT_FOUND','FIXTURE_INTEGRITY_FAILURE','CANONICAL_READ_FAILURE']) {
    const html=renderToStaticMarkup(<RealityReadFailure error={{code,status:code.endsWith('FAILURE')?503:404}}/>);
    assert.ok(html.includes(code));assert.ok(html.includes('role="alert"'));
    assert.doesNotMatch(html,/Records in this read scope|Claim records: 0/);
  }
});

test('E qualification remains transport-only and neutral, while canonical raw objects stay exact', () => {
  const body=readHumanReality('b7c4492f-955a-4189-a913-5ece6c6a876a','3b35ea51-6db5-4dee-8759-bb17377cbc0c');
  const before=JSON.stringify(body);
  const html=renderToStaticMarkup(<View response={body}/>);
  assert.equal(JSON.stringify(body),before);
  assert.equal(body.transport.source.source_qualification,'controlled-experiment-canonical-snapshot');
  assert.ok(!JSON.stringify(body.canonical_records).includes('source_qualification'));
  assert.ok(!JSON.stringify(body.core_read_results).includes('source_qualification'));
  assert.ok(html.includes('<dt>source_qualification</dt><dd><code>controlled-experiment-canonical-snapshot</code>'));
  assert.doesNotMatch(html,/role="alert"|class="[^\"]*(?:warning|danger)|unreliable|low confidence|fake|simulated truth/i);
  assert.ok(html.includes('canonical record の field や真偽の評価ではありません'));
});

test('E scope notes keep worldline, observation and Evidence return scopes distinct', () => {
  const body=readHumanReality('b7c4492f-955a-4189-a913-5ece6c6a876a','3b35ea51-6db5-4dee-8759-bb17377cbc0c');
  const html=renderToStaticMarkup(<View response={body}/>);
  assert.ok(html.includes('hi-section hi-core-read'));
  assert.ok(html.includes('Observation collection は Worldline とは別の読取結果'));
  assert.ok(html.includes('Event / State の根拠への接続を示すものではありません'));
  assert.ok(html.includes('<dt>valid_until</dt><dd><code>null</code>'));
  assert.doesNotMatch(html,/<dt>valid_until<\/dt><dd>[^<]*(?:unknown|missing|invalid|unresolved)/i);
  const historical=renderToStaticMarkup(<View response={response}/>);
  assert.ok(historical.includes('Link の件数と Evidence identity の件数は別'));
});

test('E scope and read error explanations do not assert canonical absence', () => {
  for(const code of ['PROJECT_SCOPE_MISMATCH','ENTITY_NOT_FOUND','FIXTURE_INTEGRITY_FAILURE','CANONICAL_READ_FAILURE']) {
    const html=renderToStaticMarkup(<RealityReadFailure error={{code,status:code.endsWith('FAILURE')?503:404}}/>);
    assert.ok(html.includes('読取エラーは、canonical records が0件という結果ではありません'));
    assert.doesNotMatch(html,/data-record-type=|Records in this read scope|Claim records: 0/);
    if(code==='ENTITY_NOT_FOUND') assert.ok(html.includes('ProjectState 内に Entity が存在しないという判定ではありません'));
    if(code==='PROJECT_SCOPE_MISMATCH') assert.ok(html.includes('Reality の不存在を示す判定ではありません'));
  }
});
