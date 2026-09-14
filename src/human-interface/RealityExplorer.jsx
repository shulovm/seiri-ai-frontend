import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchReality } from './read-client.js';
import RealityReadView, { RealityReadFailure } from './RealityReadView.jsx';
import './reality-explorer.css';

export default function RealityExplorer() {
  const { projectId, entityId } = useParams();
  const [request, setRequest] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    fetchReality(projectId, entityId, { signal: controller.signal }).then(
      response => { if (!controller.signal.aborted) setRequest({ projectId, entityId, response }); },
      error => { if (!controller.signal.aborted) setRequest({ projectId, entityId, error }); },
    );
    return () => controller.abort();
  }, [projectId, entityId]);
  if (!request || request.projectId !== projectId || request.entityId !== entityId) {
    return <main className="hi-explorer" role="status"><p>GROUND Human Interface · read-only</p><h1>Reality Explorer</h1><p>Canonical read response を取得しています…</p></main>;
  }
  if (request.error) return <RealityReadFailure error={request.error} />;
  return <RealityReadView response={request.response} />;
}
