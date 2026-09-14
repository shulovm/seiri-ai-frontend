import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchCatalog, fetchProject } from './browse-client.js';
import { RealityReadFailure } from './RealityReadView.jsx';

export function BrowseNavigation({ projectId }) {
  return <nav className="hi-navigation" aria-label="Reality navigation"><Link to="/reality">Projects</Link>{projectId && <> / <Link to={`/reality/${encodeURIComponent(projectId)}`}>Project</Link></>}</nav>;
}
function Fields({ record }) {
  return <dl className="hi-fields">{Object.entries(record).map(([key,value]) => <div key={key}><dt>{key}</dt><dd><code>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</code></dd></div>)}</dl>;
}
export function CatalogView({ response }) {
  return <main className="hi-explorer"><header><p>GROUND Human Interface · read-only</p><h1>Projects</h1></header>
    <p className="hi-note">登録された読取 scope の transport catalog です。この一覧では snapshot の内容・整合性は未確認です。</p>
    <ul className="hi-browse-list">{response.registered_projects.map(project => <li key={project.project_id}>
      <Link to={`/reality/${encodeURIComponent(project.project_id)}`}>{project.project_id}</Link>
      <Fields record={{source_key:project.source_key,source_qualification:project.source_qualification}} />
    </li>)}</ul></main>;
}
export function ProjectView({ response }) {
  return <main className="hi-explorer"><BrowseNavigation /><header><p>GROUND Human Interface · read-only</p><h1>{response.canonical_project.title}</h1></header>
    <section className="hi-section"><h2>Canonical Project</h2><Fields record={response.canonical_project} /></section>
    <section className="hi-section"><h2>RealityEntity identities</h2><p className="hi-note">保存collection順です。重要度や時系列を表す順序ではありません。</p>
      <ul className="hi-browse-list">{response.canonical_entities.map(entity => <li key={entity.id}>
        <Link to={`/reality/${encodeURIComponent(entity.project_id)}/${encodeURIComponent(entity.id)}`}>{entity.label}</Link>
        <p><code>{entity.kind}</code><br /><code>{entity.id}</code></p>
        <details><summary>Identity fields</summary><Fields record={entity} /></details>
      </li>)}</ul></section>
    <section className="hi-transport"><h2>Transport / Snapshot source</h2><p className="hi-note">source qualification は由来を示します。Project の種類や品質評価ではありません。</p><Fields record={response.transport.source} /></section>
  </main>;
}
export default function Browse({ catalog = false }) {
  const { projectId } = useParams();
  const scope = catalog ? 'catalog' : projectId;
  const [request,setRequest] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    const pending = catalog ? fetchCatalog({signal:controller.signal}) : fetchProject(projectId,{signal:controller.signal});
    pending.then(response => { if (!controller.signal.aborted) setRequest({scope,response}); },
      error => { if (!controller.signal.aborted) setRequest({scope,error}); });
    return () => controller.abort();
  }, [catalog,projectId,scope]);
  if (!request || request.scope !== scope) return <main className="hi-explorer" role="status"><BrowseNavigation /><h1>{catalog ? 'Projects' : 'Project'}</h1><p>{catalog ? 'Registry catalog' : 'Canonical Project browse response'} を取得しています…</p></main>;
  if (request.error) return <><BrowseNavigation /><RealityReadFailure error={request.error} context={catalog ? 'Project catalog' : 'Project browse'} /></>;
  return catalog ? <CatalogView response={request.response} /> : <ProjectView response={request.response} />;
}
