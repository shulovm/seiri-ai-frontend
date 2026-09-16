import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchReality } from './read-client.js';
import RealityRequestView from './RealityRequestView.jsx';
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
  return <RealityRequestView projectId={projectId} entityId={entityId} request={request} />;
}
