import React from 'react';
function Raw({record}) {
  return <details className="biz-record-raw"><summary>Canonical / raw record</summary><pre>{JSON.stringify(record,null,2)}</pre></details>;
}
export default function OperatingRecords({records}) {
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
    <section><h4>Next actions</h4><p className="biz-caption">保存された明示NextActionのみ。完了・取消も含む保存配列順です。実行許可・推奨順位ではありません。</p>
      {!Array.isArray(actions) ? <p>Not available in current read scope</p> : actions.length === 0 ? <p>このsnapshotに保存されたNextAction記録はありません。次の行動が不要という判定ではありません。</p> : actions.map(a => <article className="biz-operating-record" key={a.id} id={`next-action-${a.id}`}><h5>{a.title}</h5><p>{a.description === null ? 'description: null（保存値）' : a.description}</p><p>status: <code>{a.status}</code></p><p>due_at: <code>{a.due_at === null ? 'null（保存値）' : a.due_at}</code></p><Raw record={a}/></article>)}
    </section>
    <p className="biz-caption">goal_id / blocker_id / depends_on_action_id等はrawで保存参照を確認できます。RealityEntityへの参照ではないため、推定のExplorerリンクは作りません。ProjectのEntity一覧へは下のOpen Projectから進めます。</p>
  </details>;
}
