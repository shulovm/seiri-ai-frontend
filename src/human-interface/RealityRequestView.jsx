import React from 'react';
import RealityReadView, { RealityReadFailure } from './RealityReadView.jsx';
import { BrowseNavigation } from './Browse.jsx';

// Resolve request scope before mounting any canonical content or retained identity.
export default function RealityRequestView({ projectId, entityId, request }) {
  if (!request || request.projectId !== projectId || request.entityId !== entityId) {
    return <main className="hi-explorer" role="status"><p>GROUND Human Interface · read-only</p><h1>Reality Explorer</h1><p>Canonical read response を取得しています…</p></main>;
  }
  if (request.error) return <><BrowseNavigation projectId={projectId} /><RealityReadFailure error={request.error} /></>;
  return <><BrowseNavigation projectId={projectId} /><RealityReadView response={request.response} /></>;
}
