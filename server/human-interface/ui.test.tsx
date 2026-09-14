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
  assert.ok(!html.includes('Reality Overview') && !html.includes('件数: 0'));
  for (const code of ['PROJECT_SCOPE_MISMATCH', 'ENTITY_NOT_FOUND', 'SERVER_READ_FAILURE']) {
    const failure = renderToStaticMarkup(<RealityReadFailure error={{ code, status: code === 'SERVER_READ_FAILURE' ? 503 : 404 }} />);
    assert.ok(failure.includes(code));
  }
});

test('client dependency boundary contains no fixture/core imports or temporal resolution', () => {
  for (const name of ['RealityExplorer.jsx', 'RealityReadView.jsx', 'read-client.js']) {
    const source = readFileSync(new URL(`../../src/human-interface/${name}`, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /from\s+['"][^'"]*(?:ground-core|fixtures)|import\([^)]*(?:ground-core|fixtures)|new Date|Date\.(?:parse|now)|getRealityWorldline\s*\(|getEvidenceForClaim\s*\(/);
  }
});
