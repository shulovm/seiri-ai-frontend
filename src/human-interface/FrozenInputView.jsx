import React from 'react';

function Value({ value }) {
  return value !== null && typeof value === 'object'
    ? <pre>{JSON.stringify(value, null, 2)}</pre>
    : <code>{value === null ? 'null' : String(value)}</code>;
}
function Fields({ value, exclude = [] }) {
  return <dl className="hi-fields">{Object.entries(value).filter(([name]) => !exclude.includes(name)).map(([name, field]) => <div key={name}>
    <dt>{name}</dt><dd><Value value={field} /></dd>
  </div>)}</dl>;
}

export function FrozenInputFailure({ error }) {
  const code = error.code ?? 'PROVENANCE_SOURCE_UNAVAILABLE';
  let explanation = 'このsource expansionを読み取れませんでした。canonical ObservationやEvidenceの不存在を意味しません。';
  if (code === 'PROVENANCE_SOURCE_UNSUPPORTED') explanation = 'このObservationのfrozen input解決は未対応です。canonical provenanceとObservationは引き続き表示しています。';
  else if (code === 'SNAPSHOT_MISMATCH') explanation = '表示中のObservation snapshotと、現在のsource resolution用snapshotが一致しません。新しいsnapshotへ自動で結び直していません。更新する場合はEntityページを明示的に再読込してください。';
  else if (code.includes('INTEGRITY_FAILURE')) explanation = '固定artifactの整合性検証に失敗したため、inputを表示していません。別copyやweb sourceへfallbackしていません。';
  else if (code.includes('BINDING_MISMATCH') || code.includes('IDENTITY_MISMATCH') || code === 'PROVENANCE_BINDING_AMBIGUOUS') explanation = 'Observationと固定inputのbindingを確認できないため、source expansionを停止しました。Observation自体の真偽判定ではありません。';
  return <div role="alert"><p>Frozen input source · 読取結果</p><p>Transport error: <code>{code}</code></p><p>{explanation}</p></div>;
}

export default function FrozenInputView({ response }) {
  const { frozen_selected_input: input, transport, raw_selected_input: raw } = response;
  const url = input.source.url;
  return <div className="hi-frozen-result">
    <h4>Frozen selected input · projection input</h4>
    <p className="hi-note">保存されたinspection inputです。上のcanonical Observationはprojection outputであり、同じrecordではありません。inputを読めることはhistorical truthやsource authenticityの確認ではありません。</p>
    <p>input_schema: <code>{input.input_schema}</code></p>
    <details className="hi-raw hi-frozen-raw"><summary>Raw selected input · complete registered artifact</summary><pre>{raw}</pre></details>
    <p className="hi-note">rawは登録されたselected artifact全体です。Round1 dataset全体ではありません。</p>
    <details className="hi-frozen-operations"><summary>Operations / binding metadata</summary>
      <p className="hi-note">receipt / package情報はoperations provenanceです。canonical provenanceそのものではありません。hash一致はbyte identityであり、truth・trust・source authenticityを示しません。Project snapshotとinputのfingerprintは別です。</p>
      <Fields value={transport} />
      <h4>Canonical binding context · returned IDs / provenance</h4>
      <Fields value={response.canonical_binding_context} />
    </details>
    <section aria-label="Frozen input report"><h4>Stored input report</h4><Fields value={input.report} /></section>
    <section aria-label="Frozen input source"><h4>Stored input source</h4>
      {Object.hasOwn(input.source, 'url') && <div className="hi-external-source"><h4>External source URL</h4>
        {typeof url === 'string' && /^https?:\/\//.test(url) ? <a href={url} target="_blank" rel="noreferrer">{url}</a> : <Value value={url} />}
        <p className="hi-note">外部公開資料への参照です。外部websiteの現在内容がfrozen inputと同一であることは保証していません。このpanelは外部websiteを取得していません。</p>
      </div>}
      <Fields value={input.source} exclude={['url']} />
    </section>
    <section aria-label="Frozen input actors"><h4>Relevant stored actor records</h4>
      {input.relevant_actors.map(actor => <Fields key={actor.id} value={actor} />)}
    </section>
  </div>;
}
