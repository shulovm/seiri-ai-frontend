import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter} from 'react-router-dom';
// @ts-expect-error presentation module
import {BusinessHomeView,BusinessProjectCard} from '../../src/human-interface/BusinessHome.jsx';
import {humanBrowseReader} from './read-adapter.js';
const render=(element:React.ReactNode)=>renderToStaticMarkup(<MemoryRouter>{element}</MemoryRouter>);
test('Business Home proof sources remain distinct from registered live read scopes',()=>{
 const response=humanBrowseReader.catalog(); const html=render(<BusinessHomeView request={{response}}/>);
 assert.ok(html.includes('検証用snapshotを見る'));assert.ok(html.includes('登録live読取範囲 0'));
 assert.ok(html.includes('未取得を0件'));assert.ok(!html.includes('72%'));assert.ok(!html.includes('最も重要'));
});
test('Project card uses verified canonical fields and source-scoped Entity count',()=>{
 for(const source of humanBrowseReader.catalog().registered_projects){
 const response=humanBrowseReader.project(source.project_id);const html=render(<BusinessProjectCard source={source} request={{response}}/>);
 assert.ok(html.includes(response.canonical_project.title));assert.ok(html.includes(source.project_id));
 assert.ok(html.includes(`href="/reality/${source.project_id}"`));assert.ok(html.includes(`${response.canonical_entities.length} 件`));
 assert.ok(html.includes(response.transport.source.snapshot_fingerprint));assert.ok(html.includes('現在の活動状況や進捗の判定ではありません'));
 }
});
test('Catalog loading and failure do not become zero counts or empty canonical success',()=>{
 const loading=render(<BusinessHomeView request={null}/>);assert.ok(loading.includes('role="status"'));assert.ok(!loading.includes('登録live読取範囲 0'));
 const error=render(<BusinessHomeView request={{error:{code:'READ_FAILURE'}}}/>);assert.ok(error.includes('role="alert"'));assert.ok(!error.includes('登録live読取範囲 0'));
});
test('Individual read failure keeps identity and navigation, with no invented summary or count',()=>{
 const source=humanBrowseReader.catalog().registered_projects[0];const html=render(<BusinessProjectCard source={source} request={{error:{code:'FIXTURE_INTEGRITY_FAILURE'}}}/>);
 assert.ok(html.includes(source.project_id));assert.ok(html.includes('FIXTURE_INTEGRITY_FAILURE'));assert.ok(!html.includes('このsnapshotのEntity'));assert.ok(!html.includes('保存status'));assert.ok(html.includes('Open Project'));
});
