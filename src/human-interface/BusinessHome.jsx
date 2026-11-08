import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import OperatingRecords from './OperatingRecords.jsx';
import { fetchCatalog, fetchOperating, updateAndReload } from './browse-client.js';

export function BusinessProjectCard({ source, request, onTransition, mutation, onReload }) {
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
      <ActionUpdateFeedback mutation={mutation} onReload={onReload}/>
      <OperatingRecords records={response.canonical_operating_records} onTransition={response.transport.action_update_enabled && !mutation?.error ? onTransition : undefined} updating={mutation?.busy} />
      <details><summary>読取sourceとsnapshot</summary><dl className="biz-source">
        {Object.entries(response.transport.source).map(([key,value]) => <div key={key}><dt>{key}</dt><dd><code>{String(value)}</code></dd></div>)}
      </dl></details>
    </>}
    <Link className="biz-open" to={`/reality/${encodeURIComponent(source.project_id)}`}>Open Project <span aria-hidden="true">→</span></Link>
  </article>;
}
const updateErrorText={SNAPSHOT_MISMATCH:'表示後に保存内容が変わりました。',INVALID_TRANSITION:'現在のstatusからこの変更はできません。',OWNER_UNAVAILABLE:'writerを取得できませんでした。別の操作またはlock状態を確認してください。',CANONICAL_VALIDATION_FAILURE:'canonical validationで保存が拒否されました。',STORAGE_FAILURE:'保存処理の結果を確定できません。',UPDATE_SAVED_RELOAD_FAILED:'保存は成功しましたが、再読込に失敗しました。',WRITE_DISABLED:'この環境ではAction更新は有効になっていません。'};
export function ActionUpdateFeedback({mutation,onReload}) {
  if(mutation?.busy) return <p role="status">保存と再読込中…</p>;
  if(mutation?.error) return <div className="biz-update-error" role="alert"><p>{updateErrorText[mutation.error.code] ?? 'Actionの更新結果を確認してください。'}</p><code>{mutation.error.code ?? 'UPDATE_OUTCOME_UNKNOWN'}</code><p>自動再適用はしません。再読込して保存状態を確認してください。</p><button type="button" onClick={onReload}>Projectを再読込</button></div>;
  if(mutation?.receipt) return <details className="biz-update-receipt"><summary>更新済み · 保存結果を再取得しました</summary><pre>{JSON.stringify(mutation.receipt,null,2)}</pre><p>再取得snapshotがreceiptと異なる場合は、その後の保存を含みます。</p></details>;
  return null;
}
function ProjectCard({ source }) {
  const [request,setRequest] = useState(null);
  const [mutation,setMutation] = useState(null);
  const [reload,setReload] = useState(0);
  const busy=useRef(false);
  const refresh=()=>{setMutation(null);setRequest(null);setReload(n=>n+1);};
  const transition=async(actionId,intent)=>{
    if(busy.current || mutation?.error || !request?.response) return;
    busy.current=true;setMutation({busy:true});
    try {
      const result=await updateAndReload(source.project_id,actionId,intent,request.response.transport.source.snapshot_fingerprint);
      setRequest({id:source.project_id,response:result.response});setMutation({receipt:result.receipt});
    } catch(error) {setMutation({error});}
    finally {busy.current=false;}
  };
  useEffect(() => {
    const controller = new AbortController();
    fetchOperating(source.project_id, {signal:controller.signal}).then(response => {
      if (!controller.signal.aborted) {
        if (response.canonical_project.id !== source.project_id) setRequest({id:source.project_id,error:{code:'PROJECT_ID_MISMATCH'}});
        else setRequest({id:source.project_id,response});
      }
    }, error => { if (!controller.signal.aborted) setRequest({id:source.project_id,error}); });
    return () => controller.abort();
  }, [source.project_id,reload]);
  return <BusinessProjectCard source={source} request={request?.id === source.project_id ? request : null} onTransition={transition} mutation={mutation} onReload={refresh} />;
}
export function BusinessHomeView({ request }) {
  const sources = request?.response?.registered_projects;
  const live = sources?.filter(s => s.source_mode === 'mutable_canonical_storage');
  const proof = sources?.filter(s => s.source_mode !== 'mutable_canonical_storage');
  return <main className="biz-home">
    <header className="biz-header"><Link to="/" className="biz-brand">GROUND <span>Business</span></Link><Link to="/reality">Reality Explorer ↗</Link></header>
    <section className="biz-intro"><p className="biz-eyebrow">BUSINESS HOME · CANONICAL RECORDS</p><h1>事業のRealityを、ここから。</h1>
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
