import React from 'react';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { tsImport } from 'tsx/esm/api';
const { CatalogView, ProjectView } = await import('../../src/human-interface/Browse.jsx');
const { default: RealityReadView, RealityReadFailure }=await tsImport('../../src/human-interface/RealityReadView.jsx',import.meta.url);
const { createHumanBrowseReader,createHumanRealityReader }=await tsImport('./read-adapter.ts',import.meta.url);
const { createHumanSourceResolver,LIVE_PROJECT_ID }=await tsImport('./source-resolver.ts',import.meta.url);
const { realitySourceRegistry }=await tsImport('./source-registry.ts',import.meta.url);
const render=(view:React.ReactNode)=>renderToStaticMarkup(<MemoryRouter>{view}</MemoryRouter>);
const resolver=createHumanSourceResolver({runtimeConfigPath:'/server-owned/unavailable.json'});
test('live catalog shows four explicit scopes, mode and qualification without content verification',()=>{
 const html=render(<CatalogView response={createHumanBrowseReader(resolver).catalog()}/>);
 assert.equal((html.match(/<li>/g)||[]).length,4);
 for(const text of [LIVE_PROJECT_ID,'source_mode','mutable_canonical_storage','immutable_proof_snapshot','canonical-live-project'])assert.ok(html.includes(text));
 assert.doesNotMatch(html,/snapshot_fingerprint|stored_schema_version|Live Truth|Current Reality|Authoritative History/);
});
// Transport-only rendering case built from an existing canonical reader result;
// this is not a new ProjectState, fixture, projection or live mutation.
const source=realitySourceRegistry.sources[1];
const proof=createHumanRealityReader()(source.project_id,source.entity_id);
const response={...proof,transport:{...proof.transport,source:{source_key:'canonical-live-project',source_mode:'mutable_canonical_storage',source_qualification:'canonical-live-project',stored_schema_version:'0.1.25',read_schema_version:'0.1.25',snapshot_fingerprint:'a'.repeat(64)}}};
test('mutable transport never claims fixture verification; canonical fields, nulls and provenance remain untouched',()=>{
 const html=render(<RealityReadView response={response}/>);
 assert.ok(html.includes('snapshot_fingerprint'));assert.ok(html.includes('a'.repeat(64)));
 assert.ok(html.includes('Mutable canonical storage'));assert.ok(!html.includes('fixture hash 検証後'));
 assert.ok(html.includes('observed_at'));assert.ok(html.includes('recorded_at'));assert.ok(html.includes('provenance'));assert.ok(html.includes('<code>null</code>'));
 assert.ok(html.includes('Claim-linked Evidence bundles: 0'));assert.ok(html.includes('ProjectState 全体の Evidence 件数ではありません'));
 assert.ok(html.includes('Observation → Evidence の参照はこのread scopeに含まれません'));
 assert.doesNotMatch(html,/No Evidence|No evidence exists|Reality version|truth hash|Live Truth/);
 const browse=createHumanBrowseReader().project(source.project_id);
 const projectHtml=render(<ProjectView response={{...browse,transport:{...browse.transport,source:response.transport.source}}}/>);
 assert.ok(projectHtml.includes('snapshot_fingerprint'));assert.ok(projectHtml.indexOf('Canonical Project')<projectHtml.indexOf('Transport / Snapshot source'));
});
for(const code of ['LIVE_RUNTIME_CONFIG_UNAVAILABLE','LIVE_ROOT_UNAVAILABLE','LIVE_PROJECT_FILE_MISSING','LIVE_SNAPSHOT_VALIDATION_FAILURE','LIVE_PROJECT_ID_MISMATCH','LIVE_PERMISSION_DENIED','LIVE_READ_FAILURE'])test(`${code} is a scope-limited read failure, never a zero-record result`,()=>{
 const html=render(<RealityReadFailure context="Project browse" error={{status:503,code}}/>);
 assert.ok(html.includes('role="alert"'));assert.ok(html.includes(code));assert.ok(html.includes('canonical records が0件という結果ではありません'));
 assert.ok(!html.includes('RealityEntity identities'));assert.ok(!html.includes('Canonical / raw record'));
});
