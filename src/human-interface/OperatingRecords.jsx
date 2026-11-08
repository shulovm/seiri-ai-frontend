import React from 'react';
function Raw({record}) {
  return <details className="biz-record-raw"><summary>Canonical / raw record</summary><pre>{JSON.stringify(record,null,2)}</pre></details>;
}
export default function OperatingRecords({records, onTransition, updating=false}) {
  if (!records) return <p className="biz-caption">Not available in current read scope · Operating records</p>;
  const {current_state:state,blockers,next_actions:actions}=records;
  return <details className="biz-operating"><summary>Operating state · 保存された運営記録</summary>
    <p className="biz-caption">このcardのProjectと同じsnapshotです。現在時刻での再評価や行動の推奨は行っていません。</p>
    <section><h4>Current state</h4>
      {state ? <><p className="biz-description">{state.summary === '' ? '保存summaryは空です。' : state.summary}</p>
        <dl className="biz-source"><dt>phase</dt><dd>{state.phase === null ? 'null（保存値）' : state.phase}</dd><dt>updated_at</dt><dd>{state.updated_at}</dd></dl>
        <p className="biz-caption">Projectの保存CurrentStateです。RealityState・Project.statusとは別です。updated_atは更新fieldであり、現実の発生時刻ではありません。</p><Raw record={state}/></> : <p>Not available in current read scope</p>}
    </section>
    <section><h4>Blockers</h4><p className="biz-caption">保存された明示Blockerのみ。全statusを保存配列順で表示し、severityによる並べ替えはしません。</p>
      {!Array.isArray(blockers) ? <p>Not available in current read scope</p> : blockers.length === 0 ? <p>このsnapshotに保存されたBlocker記録はありません。事業を止める問題がないという判定ではありません。</p> : blockers.map(b => <article className="biz-operating-record" key={b.id} id={`blocker-${b.id}`}><h5>{b.title}</h5><p>{b.description}</p><p>status: <code>{b.status}</code> · severity: <code>{b.severity}</code></p><Raw record={b}/></article>)}
    </section>
    <section><h4>Next actions</h4><p className="biz-caption">status別の表示groupです。重要度・推奨順位ではなく、各group内は保存順です。</p>
      {!Array.isArray(actions) ? <p>Not available in current read scope</p> : actions.length === 0 ? <p>このsnapshotに保存されたNextAction記録はありません。次の行動が不要という判定ではありません。</p> : <>
        <section aria-label="Active actions"><h5>Active</h5>{actions.filter(a=>['pending','in_progress'].includes(a.status)).map(a=><ActionRecord key={a.id} action={a} onTransition={onTransition} updating={updating}/>)}</section>
        {actions.some(a=>a.status==='done') && <details><summary>Completed · 完了記録</summary>{actions.filter(a=>a.status==='done').map(a=><ActionRecord key={a.id} action={a}/>)}</details>}
        {actions.some(a=>a.status==='cancelled') && <details><summary>Cancelled · 取消記録</summary>{actions.filter(a=>a.status==='cancelled').map(a=><ActionRecord key={a.id} action={a}/>)}</details>}
      </>}
    </section>
    <p className="biz-caption">goal_id / blocker_id / depends_on_action_id等はrawで保存参照を確認できます。RealityEntityへの参照ではないため、推定のExplorerリンクは作りません。ProjectのEntity一覧へは下のOpen Projectから進めます。</p>
  </details>;
}

export function ActionRecord({action:a,onTransition,updating=false}) {
  return <article className="biz-operating-record" id={`next-action-${a.id}`}><h5>{a.title}</h5>
    <p>status: <code>{a.status}</code></p>
    {onTransition && ['pending','in_progress'].includes(a.status) && <button type="button" disabled={updating} onClick={()=>onTransition(a.id,a.status==='pending'?'start':'complete')}>{a.status==='pending'?'Start · 開始':'Mark done · 完了にする'}</button>}
    <details><summary>説明・期限</summary><p>{a.description===null?'description: null（保存値）':a.description}</p><p>due_at: <code>{a.due_at===null?'null（保存値）':a.due_at}</code></p></details><Raw record={a}/>
  </article>;
}
