import React from 'react';

function RawView({ value, label = 'Canonical / raw record' }) {
  return <details className="hi-raw"><summary>{label}</summary><pre>{JSON.stringify(value, null, 2)}</pre></details>;
}

function FieldValue({ name, value }) {
  if (value === null) return <code>null</code>;
  if (typeof value === 'object') return <pre>{JSON.stringify(value, null, 2)}</pre>;
  if (name === 'external_ref' && typeof value === 'string' && /^https?:\/\//.test(value)) {
    return <a href={value} target="_blank" rel="noreferrer">{value}</a>;
  }
  return <code>{String(value)}</code>;
}

function RecordPanel({ record, title }) {
  const claimGroups = [
    ['Identity / predicate', ['id', 'project_id', 'subject_id', 'predicate_kind', 'predicate']],
    ['Claim content', ['value']],
    ['Provenance · canonical fields', ['provenance']],
    ['Confidence · declared value', ['confidence']],
    ['Applicability · proposition scope', ['applicable_from', 'applicable_until']],
    ['Record / storage fields', ['recorded_at', 'created_at', 'updated_at']],
  ];
  const groups = title === 'Claim' ? [...claimGroups,
    ['Other canonical fields', Object.keys(record).filter(name => !claimGroups.some(([, names]) => names.includes(name)))]]
    : [['Canonical fields', Object.keys(record)]];
  return <section className="hi-record" data-record-type={title} data-record-id={record.id}>
    <h3>{title}</h3>
    <p className="hi-kind">Canonical record · field names and declared values</p>
    <RawView value={record} />
    {title === 'RealityState' && <p className="hi-note">valid_from / valid_until は State の validity fields です。valid_until: null は終了時刻を限定しない open-ended interval を表します。value は保存値のままです。</p>}
    {title === 'RealityEvent' && <p className="hi-note">occurred_at は occurrence、recorded_at は recording の field です。</p>}
    {title === 'EpistemicObservation' && <p className="hi-note">observed_at は observation、recorded_at は recording の field です。subject_ids をそのまま保持しています。</p>}
    {title === 'Claim' && <p className="hi-note">Claim は命題を表す canonical record です。この表示は命題の真偽判定ではありません。</p>}
    {groups.filter(([, names]) => names.some(name => Object.hasOwn(record, name))).map(([label, names]) => <section key={label} className="hi-field-group">
      {title === 'Claim' && <h4>{label}</h4>}
      {label.startsWith('Applicability') && <p className="hi-note">命題の applicability fields。出来事の occurred_at とは異なる役割です。</p>}
      <dl className="hi-fields">{names.filter(name => Object.hasOwn(record, name)).map(name => <div key={name}>
        <dt>{name}</dt><dd><FieldValue name={name} value={record[name]} /></dd>
      </div>)}</dl>
      {names.includes('confidence') && <p className="hi-note">confidence は canonical field value をそのまま表示しています。UI は真実確率や source ranking として解釈していません。</p>}
      {names.includes('external_ref') && <p className="hi-note">external_ref は参照先です。このリンク表示は source quality の評価ではありません。</p>}
    </section>)}
  </section>;
}

function EvidenceRead({ result }) {
  return <details className="hi-evidence" open>
    <summary>Claim → ClaimEvidenceLink → Evidence</summary>
    <p className="hi-kind">Existing core read result · getEvidenceForClaim</p>
    <p className="hi-note">Link の relation 名をそのまま表示します。SUPPORTS はここでの真偽判定を示す UI label ではありません。</p>
    <p>claim_id: <code>{result.claim_id}</code></p>
    {result.links.map(link => <RecordPanel key={link.id} record={link} title={`ClaimEvidenceLink · ${link.relation}`} />)}
    {['supports', 'contradicts'].map(group => <section key={group}>
      <h4>{group} · existing core grouping</h4>
      <p>この read result で返された Evidence records: {result[group].length}</p>
      {result[group].map(evidence => <RecordPanel key={evidence.id} record={evidence} title="Evidence" />)}
    </section>)}
    <RawView value={result} label="Raw · getEvidenceForClaim result" />
  </details>;
}

export function RealityReadFailure({ error }) {
  const integrity = error.code === 'FIXTURE_INTEGRITY_FAILURE';
  const scopeExplanation = {
    PROJECT_SCOPE_MISMATCH: 'この Project ID に登録された読取 source を解決できません。Reality の不存在を示す判定ではありません。',
    ENTITY_NOT_FOUND: 'この Entity ID は登録された proof read scope の対象ではありません。ProjectState 内に Entity が存在しないという判定ではありません。',
  }[error.code];
  return <main className="hi-explorer"><header><p>GROUND Human Interface · read-only</p><h1>Reality Explorer</h1></header>
    <section role="alert" className="hi-section"><h2>{integrity ? '読取基盤の異常 · fixture integrity failure' : error.status === 404 ? '読取 scope を解決できません' : 'Server read error'}</h2>
      <p>HTTP status: <code>{error.status ?? 'unavailable'}</code></p><p>Transport error: <code>{error.code ?? 'NETWORK_READ_FAILURE'}</code></p>
      <p>{integrity ? 'Fixture の整合性検証が失敗したため、canonical records は表示していません。' : 'この request の canonical read response を取得できませんでした。'}</p>
      {scopeExplanation && <p>{scopeExplanation}</p>}
      <p className="hi-note">読取エラーは、canonical records が0件という結果ではありません。</p>
    </section></main>;
}

export default function RealityReadView({ response }) {
  const { transport, canonical_records: records, core_read_results: reads } = response;
  const source = transport.source;
  const worldline = reads.worldline;
  const linkedEvidenceIds = new Set(reads.evidence_for_claim.flatMap(bundle =>
    [...bundle.supports, ...bundle.contradicts].map(evidence => evidence.id)));
  const linkCount = reads.evidence_for_claim.reduce((count, bundle) => count + bundle.links.length, 0);
  const collections = [
    ['RealityEvent', transport.returned_counts.events, reads.worldline.events],
    ['RealityState', transport.returned_counts.states, reads.worldline.states],
    ['EpistemicObservation', transport.returned_counts.observations, records.observations],
    ['Worldline entries · core read result', reads.worldline.ordered_entries.length, reads.worldline.ordered_entries],
    ['Claim', transport.returned_counts.claims, records.claims],
  ];
  return <main className="hi-explorer">
    <header className="hi-context"><p className="hi-eyebrow">GROUND Human Interface · read-only · HUMAN-002E</p>
      <h1>{records.entity.label}</h1><p>Reality Explorer · canonical records / existing core read results</p>
      <p>保存済み ProjectState の一つの RealityEntityと、その scope に対する既存 core 読取結果を見ています。</p>
      <h2>Canonical records · context</h2>
      <dl className="hi-fields">
        <div><dt>project.id</dt><dd><code>{records.project.id}</code></dd></div>
        <div><dt>project.title</dt><dd>{records.project.title}</dd></div>
        <div><dt>entity.id</dt><dd><code>{records.entity.id}</code></dd></div>
        <div><dt>entity.kind</dt><dd><code>{records.entity.kind}</code></dd></div>
      </dl>
      <RawView value={records.project} label="Canonical / raw · Project" />
      <section className="hi-transport"><h2>Transport metadata · read source</h2>
      <p className="hi-note">読取 source と schema の情報です。canonical record の field や真偽の評価ではありません。source_qualification は読取 source の由来です。成功 response は server の fixture hash 検証後に返されています。</p>
      <dl className="hi-fields">
        <div><dt>stored_schema_version</dt><dd><code>{source.stored_schema_version}</code></dd></div>
        <div><dt>read_schema_version</dt><dd><code>{source.read_schema_version}</code></dd></div>
        <div><dt>source_key</dt><dd><code>{source.source_key}</code></dd></div>
        <div><dt>source_qualification</dt><dd><code>{source.source_qualification}</code></dd></div>
        <div><dt>fixture</dt><dd><code>{source.fixture}</code></dd></div>
        <div><dt>sha256</dt><dd><code>{source.sha256}</code></dd></div>
      </dl>
      <RawView value={transport} label="Raw · transport metadata (not a canonical record)" />
      </section>
    </header>
    <section className="hi-section"><h2>Records in this read scope</h2>
      <p className="hi-kind">Transport-level returned counts / existing core entry count</p>
      <p>件数は、この read scope で返された records / core read entries の件数です。</p>
      <p className="hi-note">件数は Reality の completeness や歴史上の存在・不在を示しません。</p>
      <p className="hi-scope"><code>{transport.requested_scope.project_id}</code> / <code>{transport.requested_scope.entity_id}</code></p>
      <ul className="hi-collections">{collections.map(([label, count, value]) => <li key={label}>
        <strong>{label}</strong><span>この read scope で返された件数: {count}</span>
        <RawView value={value} label={`Raw collection · ${label}`} />
      </li>)}</ul>
    </section>
    <section className="hi-section"><h2>Canonical Entity</h2><RecordPanel record={records.entity} title="RealityEntity" /></section>
    <section className="hi-section hi-core-read"><h2>Worldline</h2><p className="hi-kind">Existing core read result · getRealityWorldline</p>
      <p className="hi-note">この Entity scope の既存 core 読取結果です。空の entries は、歴史上何も起きなかったという判定ではありません。</p>
      <p className="hi-note">この section は既存 core の Worldline result を表示します。この read scope の全recordを並べ直した chronology ではなく、latest_time は Reality 全体の最新時刻を示す表示ではありません。Observation collection は別に表示しています。</p>
      <h3>temporal_summary · core read result</h3>
      <dl className="hi-fields">{Object.entries(worldline.temporal_summary).map(([name, value]) => <div key={name}><dt>{name}</dt><dd><FieldValue name={name} value={value} /></dd></div>)}</dl>
      <h3>ordered_entries · core order · {worldline.ordered_entries.length}</h3>
      <ol className="hi-worldline">{worldline.ordered_entries.map((entry, index) => <li key={index} data-worldline-entry={entry.record_id}>
        <dl className="hi-fields">{Object.entries(entry).map(([name, value]) => <div key={name}><dt>{name}</dt><dd><FieldValue name={name} value={value} /></dd></div>)}</dl>
        <RawView value={entry} label="Raw · core worldline entry" />
      </li>)}</ol>
      <h3>unplaced_events · {worldline.unplaced_events.length}</h3>
      <RawView value={worldline.unplaced_events} label="Raw · core unplaced_events" />
      <RawView value={reads.worldline} label="Raw · complete getRealityWorldline result" />
    </section>
    <section className="hi-section"><h2>RealityEvents</h2><p>この read scope で返された RealityEvent records: {worldline.events.length}</p>
      {worldline.events.map(record => <RecordPanel key={record.id} record={record} title="RealityEvent" />)}
    </section>
    <section className="hi-section"><h2>RealityStates</h2><p>この read scope で返された RealityState records: {worldline.states.length}</p>
      {worldline.states.map(record => <RecordPanel key={record.id} record={record} title="RealityState" />)}
    </section>
    <section className="hi-section"><h2>Observations</h2><p className="hi-note">Observation collection は Worldline とは別の読取結果です。observed_at を Worldline の latest_time へ追加・置換する表示ではありません。</p><p>この read scope で返された EpistemicObservation records: {records.observations.length}</p>
      {records.observations.map(record => <RecordPanel key={record.id} record={record} title="EpistemicObservation" />)}
    </section>
    <section className="hi-section"><h2>Claims</h2><p>この read scope で返された Claim records: {records.claims.length}</p>
      <div className="hi-linked-scope"><h3>Claim-linked Evidence · read scope</h3>
      <p>この read path の Claim-linked Evidence bundles: {reads.evidence_for_claim.length}</p>
      <p className="hi-note">ProjectState 全体の Evidence 件数ではありません。各Claimの bundle が同じ Evidence id を参照する場合があります。</p>
      {reads.evidence_for_claim.length > 0 && <p>ClaimEvidenceLink records returned: {linkCount}<br />Unique linked Evidence returned in this scope: {linkedEvidenceIds.size}</p>}
      <p className="hi-note">この read path は Claim と Evidence の明示的な link を表示します。Event / State の根拠への接続を示すものではありません。</p>
      {reads.evidence_for_claim.length > 0 && <p className="hi-note">Link の件数と Evidence identity の件数は別です。Unique linked Evidence は返却された bundle 内の異なる Evidence id の件数です。</p>}
      </div>
      {records.claims.map(claim => <details className="hi-claim" key={claim.id} open={records.claims.length === 1}>
        <summary>Claim · <code>{claim.id}</code><span>{claim.predicate}</span></summary>
        <RecordPanel record={claim} title="Claim" />
        {reads.evidence_for_claim.filter(result => result.claim_id === claim.id).map(result => <EvidenceRead key={result.claim_id} result={result} />)}
      </details>)}
    </section>
    <footer>Human-readable presentation · canonical fields / existing core read results / transport metadata</footer>
  </main>;
}
