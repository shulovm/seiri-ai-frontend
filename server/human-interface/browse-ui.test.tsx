import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { tsImport } from 'tsx/esm/api';
const { MemoryRouter } = await import('react-router-dom');
const { humanBrowseReader } = await tsImport('./read-adapter.ts',import.meta.url);
const { CatalogView,ProjectView } = await import('../../src/human-interface/Browse.jsx');
const { RealityReadFailure } = await tsImport('../../src/human-interface/RealityReadView.jsx',import.meta.url);
const { fetchCatalog,fetchProject } = await tsImport('../../src/human-interface/browse-client.js',import.meta.url);
const render = (element:React.ReactNode)=>renderToStaticMarkup(<MemoryRouter>{element}</MemoryRouter>);
const esc = (s:string)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
test('catalog shows three transport identities and navigation, no canonical title or verified schema',()=>{
 const response=humanBrowseReader.catalog();const html=render(<CatalogView response={response}/>);
 assert.equal((html.match(/<li>/g)||[]).length,3);
 for(const p of response.registered_projects){assert.ok(html.includes(p.project_id));assert.ok(html.includes(p.source_qualification));assert.ok(!html.includes(humanBrowseReader.project(p.project_id).canonical_project.title));}
 assert.ok(!html.includes('sha256'));assert.ok(!html.includes('read_schema_version'));
});
for(const [i,p] of humanBrowseReader.catalog().registered_projects.entries()) test(`${p.source_key}: exact fields, all identity links in response order, transport separation`,()=>{
 const response=humanBrowseReader.project(p.project_id);const html=render(<ProjectView response={response}/>);
 assert.equal((html.match(/<li>/g)||[]).length,[14,4,42][i]);
 for(const value of Object.values(response.canonical_project)) assert.ok(html.includes(esc(String(value))));
 let last=-1;for(const e of response.canonical_entities){const at=html.indexOf(`href="/reality/${e.project_id}/${e.id}"`);assert.ok(at>last);last=at;assert.ok(html.includes(esc(e.label)));}
 assert.ok(html.indexOf('Transport / Snapshot source')>html.indexOf('RealityEntity identities'));
 assert.ok(!html.includes('returned_counts'));
});
test('clients only request their endpoint and preserve response; errors never become empty lists',async()=>{
 for(const [invoke,path,body] of [
  [(o:unknown)=>fetchCatalog(o),'/api/human-interface/projects',humanBrowseReader.catalog()],
  [(o:unknown)=>fetchProject('id/encoded',o),'/api/human-interface/projects/id%2Fencoded',humanBrowseReader.project(humanBrowseReader.catalog().registered_projects[0].project_id)],
 ] as const){let calls=0;assert.equal(await invoke({fetcher:async(url:string,opts:{method:string})=>{calls++;assert.equal(url,path);assert.equal(opts.method,'GET');return {ok:true,status:200,json:async()=>body};}}),body);assert.equal(calls,1);
 for(const code of ['PROJECT_SCOPE_MISMATCH','FIXTURE_INTEGRITY_FAILURE','CANONICAL_READ_FAILURE'])await assert.rejects(invoke({fetcher:async()=>({ok:false,status:503,json:async()=>({transport_error:{code}})})}),{code});}
});
test('catalog/project failures and verified snapshot Entity absence have scoped explanations',()=>{
 for(const context of ['Project catalog','Project browse']){const html=render(<RealityReadFailure context={context} error={{status:503,code:'FIXTURE_INTEGRITY_FAILURE'}}/>);assert.ok(html.includes(context));assert.ok(html.includes('canonical records は表示していません'));assert.ok(!html.includes('<li>'));}
 const html=render(<RealityReadFailure error={{status:404,code:'ENTITY_NOT_IN_SNAPSHOT'}}/>);assert.ok(html.includes('この検証済みsnapshotのRealityEntity collection'));assert.ok(!html.includes('proof read scope'));
});
