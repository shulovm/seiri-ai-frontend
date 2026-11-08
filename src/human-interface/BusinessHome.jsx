import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OperatingRecords from './OperatingRecords.jsx';
import { fetchCatalog, fetchOperating } from './browse-client.js';

export function BusinessProjectCard({ source, request }) {
  const response = request?.response;
  const project = response?.canonical_project;
  return <article className="biz-card">
    <p className="biz-eyebrow">{source.source_mode === 'mutable_canonical_storage' ? 'LIVE PROJECT' : 'PROOF SNAPSHOT'}</p>
    <h3>{project ? project.title : source.project_id}</h3>
    <p className="biz-id">{source.project_id}</p>
    {!request && <p role="status">保存されたProjectを読み込んでいます…</p>}
    {request?.error && <div role="alert"><p>Projectを読み取れませんでした。</p><code>{request.error.code ?? 'READ_FAILURE'}</code><p>読取失敗は、Realityが0件という結果ではありません。</p></div>}
    {project && <>
      <p className="biz-description">{project.summary || '保存summaryは空です。'}</p>
      <dl className="biz-facts"><div><dt>保存status</dt><dd>{project.status}</dd></div>
        <div><dt>このsnapshotのEntity</dt><dd>{response.canonical_entities.length} 件</dd></div></dl>
      <p className="biz-caption">summaryとstatusはProjectの保存fieldです。現在の活動状況や進捗の判定ではありません。</p>
      <OperatingRecords records={response.canonical_operating_records} />
      <details><summary>読取sourceとsnapshot</summary><dl className="biz-source">
        {Object.entries(response.transport.source).map(([key,value]) => <div key={key}><dt>{key}</dt><dd><code>{String(value)}</code></dd></div>)}
      </dl></details>
    </>}
    <Link className="biz-open" to={`/reality/${encodeURIComponent(source.project_id)}`}>Open Project <span aria-hidden="true">→</span></Link>
  </article>;
}
function ProjectCard({ source }) {
  const [request,setRequest] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    fetchOperating(source.project_id, {signal:controller.signal}).then(response => {
      if (!controller.signal.aborted) {
        if (response.canonical_project.id !== source.project_id) setRequest({id:source.project_id,error:{code:'PROJECT_ID_MISMATCH'}});
        else setRequest({id:source.project_id,response});
      }
    }, error => { if (!controller.signal.aborted) setRequest({id:source.project_id,error}); });
    return () => controller.abort();
  }, [source.project_id]);
  return <BusinessProjectCard source={source} request={request?.id === source.project_id ? request : null} />;
}
export function BusinessHomeView({ request }) {
  const sources = request?.response?.registered_projects;
  const live = sources?.filter(s => s.source_mode === 'mutable_canonical_storage');
  const proof = sources?.filter(s => s.source_mode !== 'mutable_canonical_storage');
  return <main className="biz-home">
    <header className="biz-header"><Link to="/" className="biz-brand">GROUND <span>Business</span></Link><Link to="/reality">Reality Explorer ↗</Link></header>
    <section className="biz-intro"><p className="biz-eyebrow">BUSINESS HOME · READ-ONLY</p><h1>事業のRealityを、ここから。</h1>
      <p>保存されたProjectから、その中のReality、Evidence、出典へ。</p></section>
    <section aria-labelledby="business-world"><div className="biz-section-heading"><h2 id="business-world">Business World</h2>{sources && <span>登録live読取範囲 {live.length} · 検証用snapshot {proof.length}</span>}</div>
      <p className="biz-caption">Human Interfaceに登録された範囲です。会社全体のProject一覧や、事業の網羅性を表すものではありません。表示順は登録順です。</p>
      {!request && <p role="status">Projectの読取範囲を取得しています…</p>}
      {request?.error && <div role="alert">読取範囲を取得できませんでした。<code>{request.error.code ?? 'READ_FAILURE'}</code> Projectが存在しないという判定ではありません。</div>}
      {live && <div className="biz-grid">{live.map(source => <ProjectCard key={source.project_id} source={source} />)}</div>}
      {live?.length === 0 && <p>live Projectの読取範囲は登録されていません。</p>}
    </section>
    <section className="biz-boundary" aria-labelledby="business-boundary"><h2 id="business-boundary">まだ、この画面では確認できないこと</h2>
      <p>判断・Commitment、資源、epistemic gapsの状況は、このOperating読取範囲に含まれていません。未取得を0件や「問題なし」として扱いません。</p>
      <p>Entity単位の記録は、Open ProjectからReality Explorerで確認できます。</p></section>
    {proof?.length > 0 && <section className="biz-proofs"><details><summary>検証用snapshotを見る · {proof.length} 件</summary>
      <p className="biz-caption">読取機能の検証用に登録されたsnapshotです。運営中の事業Projectとして集計しません。</p>
      <div className="biz-grid">{proof.map(source => <ProjectCard key={source.project_id} source={source} />)}</div>
    </details></section>}
    <footer>Project → Reality Explorer → Evidence / Provenance / Raw</footer>
  </main>;
}
export default function BusinessHome() {
  const [request,setRequest] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    fetchCatalog({signal:controller.signal}).then(response => {if (!controller.signal.aborted) setRequest({response});},error => {if (!controller.signal.aborted) setRequest({error});});
    return () => controller.abort();
  }, []);
  return <BusinessHomeView request={request} />;
}
