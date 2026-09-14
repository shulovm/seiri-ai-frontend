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
  return <section className="hi-record">
    <h3>{title}</h3>
    <p className="hi-kind">Canonical record · field names and declared values</p>
    <dl className="hi-fields">{Object.entries(record).map(([name, value]) => <div key={name}>
      <dt>{name}</dt><dd><FieldValue name={name} value={value} /></dd>
    </div>)}</dl>
    <RawView value={record} />
  </section>;
}

function EvidenceRead({ result }) {
  return <details className="hi-evidence" open>
    <summary>Claim → ClaimEvidenceLink → Evidence</summary>
    <p className="hi-kind">Existing core read result · getEvidenceForClaim</p>
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
  return <main className="hi-explorer"><header><p>GROUND Human Interface · read-only</p><h1>Reality Explorer</h1></header>
    <section role="alert" className="hi-section"><h2>{integrity ? '読取基盤の異常 · fixture integrity failure' : error.status === 404 ? '読取 scope を解決できません' : 'Server read error'}</h2>
      <p>HTTP status: <code>{error.status ?? 'unavailable'}</code></p><p>Transport error: <code>{error.code ?? 'NETWORK_READ_FAILURE'}</code></p>
      <p>{integrity ? 'Fixture の整合性検証が失敗したため、canonical records は表示していません。' : 'この request の canonical read response を取得できませんでした。'}</p>
    </section></main>;
}

export default function RealityReadView({ response }) {
  const { transport, canonical_records: records, core_read_results: reads } = response;
  const source = transport.source;
  const collections = [
    ['RealityEvent', transport.returned_counts.events, reads.worldline.events],
    ['RealityState', transport.returned_counts.states, reads.worldline.states],
    ['EpistemicObservation', transport.returned_counts.observations, records.observations],
    ['Worldline entries · core read result', reads.worldline.ordered_entries.length, reads.worldline.ordered_entries],
    ['Claim', transport.returned_counts.claims, records.claims],
  ];
  return <main className="hi-explorer">
    <header className="hi-context"><p className="hi-eyebrow">GROUND Human Interface · read-only · HUMAN-001C</p>
      <h1>{records.entity.label}</h1><p>Reality Explorer · canonical records / existing core read results</p>
      <dl className="hi-fields">
        <div><dt>project.id</dt><dd><code>{records.project.id}</code></dd></div>
        <div><dt>project.title</dt><dd>{records.project.title}</dd></div>
        <div><dt>entity.id</dt><dd><code>{records.entity.id}</code></dd></div>
        <div><dt>entity.kind</dt><dd><code>{records.entity.kind}</code></dd></div>
        <div><dt>stored_schema_version</dt><dd><code>{source.stored_schema_version}</code></dd></div>
        <div><dt>read_schema_version</dt><dd><code>{source.read_schema_version}</code></dd></div>
        <div><dt>fixture</dt><dd><code>{source.fixture}</code></dd></div>
        <div><dt>sha256</dt><dd><code>{source.sha256}</code></dd></div>
      </dl>
      <RawView value={transport} label="Raw · transport metadata (not a canonical record)" />
      <RawView value={records.project} label="Canonical / raw · Project" />
    </header>
    <section className="hi-section"><h2>Reality Overview</h2>
      <p>件数は、この read scope で返された records / core read entries の件数です。</p>
      <p className="hi-scope"><code>{transport.requested_scope.project_id}</code> / <code>{transport.requested_scope.entity_id}</code></p>
      <ul className="hi-collections">{collections.map(([label, count, value]) => <li key={label}>
        <strong>{label}</strong><span>この read scope で返された件数: {count}</span>
        <RawView value={value} label={`Raw collection · ${label}`} />
      </li>)}</ul>
    </section>
    <section className="hi-section"><h2>Canonical Entity</h2><RecordPanel record={records.entity} title="RealityEntity" /></section>
    <section className="hi-section"><h2>Worldline</h2><p className="hi-kind">Existing core read result · getRealityWorldline</p>
      <RawView value={reads.worldline} label="Raw · complete getRealityWorldline result" />
    </section>
    <section className="hi-section"><h2>Observations</h2><p>この read scope で返された EpistemicObservation records: {records.observations.length}</p>
      {records.observations.map(record => <RecordPanel key={record.id} record={record} title="EpistemicObservation" />)}
    </section>
    <section className="hi-section"><h2>Claims</h2><p>この read scope で返された Claim records: {records.claims.length}</p>
      {records.claims.map(claim => <article key={claim.id}>
        <RecordPanel record={claim} title="Claim" />
        {reads.evidence_for_claim.filter(result => result.claim_id === claim.id).map(result => <EvidenceRead key={result.claim_id} result={result} />)}
      </article>)}
    </section>
    <footer>Human-readable presentation · canonical field values are retained. No semantic summary.</footer>
  </main>;
}
