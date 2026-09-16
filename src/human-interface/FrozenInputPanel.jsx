import React, { useEffect, useRef, useState } from 'react';
import { fetchProvenanceSource } from './provenance-client.js';
import FrozenInputView, { FrozenInputFailure } from './FrozenInputView.jsx';

export default function FrozenInputPanel({ projectId, entityId, observation, fingerprint, hasIndex }) {
  const [request, setRequest] = useState(null);
  const pending = useRef(null);
  const disclosure = useRef(null);
  useEffect(() => () => pending.current?.abort(), []);
  const cancel = () => { pending.current?.abort(); pending.current = null; };
  const load = () => {
    cancel();
    const controller = new AbortController();
    pending.current = controller;
    setRequest({ loading: true });
    fetchProvenanceSource({ projectId, entityId, observationId: observation.id, fingerprint }, { signal: controller.signal }).then(
      response => { if (!controller.signal.aborted) setRequest({ response }); },
      error => { if (!controller.signal.aborted) setRequest({ error }); },
    );
  };
  const close = () => { cancel(); setRequest(null); disclosure.current.open = false; disclosure.current.querySelector('summary').focus(); };
  return <details ref={disclosure} className="hi-frozen-panel" data-source-observation={observation.id} onToggle={event => {
    if (event.target !== event.currentTarget) return;
    if (event.currentTarget.open) load();
    else { cancel(); setRequest(null); }
  }}>
    <summary>View frozen inspection input</summary>
    <div className="hi-frozen-context"><p>Observation ID: <code>{observation.id}</code></p>
      <p>Canonical provenance · external_id: <code>{observation.provenance.external_id === undefined ? '(field omitted)' : observation.provenance.external_id === null ? 'null' : observation.provenance.external_id}</code></p>
      <p className="hi-note">独立したsource read scopeです。Observation-linked Evidenceとは別の表示です。</p>
      <a href={`#observation-${observation.id}`}>Back to Observation</a>
      {hasIndex && <> · <a href="#observation-index">Back to Observation index</a></>}
    </div>
    {request?.loading && <p role="status">Frozen selected inputを読み取っています…</p>}
    {request?.error && <><FrozenInputFailure error={request.error} /><button type="button" onClick={load}>Retry with displayed snapshot</button></>}
    {request?.response && <FrozenInputView response={request.response} />}
    <div className="hi-frozen-actions"><button type="button" onClick={close}>Close frozen input</button> <a href={`#observation-${observation.id}`}>Back to Observation</a>
      {hasIndex && <> · <a href="#observation-index">Back to Observation index</a></>}
    </div>
  </details>;
}
