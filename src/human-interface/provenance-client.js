import { RealityReadError } from './read-client.js';

export async function fetchProvenanceSource({ projectId, entityId, observationId, fingerprint }, { signal, fetcher = fetch } = {}) {
  const base = import.meta.env?.VITE_API_BASE ?? '';
  const response = await fetcher(`${base}/api/human-interface/reality/${encodeURIComponent(projectId)}/${encodeURIComponent(entityId)}/observations/${encodeURIComponent(observationId)}/provenance-source`, {
    method: 'GET', signal, headers: { 'If-Ground-Snapshot-Fingerprint': fingerprint },
  });
  let body;
  try { body = await response.json(); }
  catch { throw new RealityReadError(response.status, 'INVALID_PROVENANCE_RESPONSE'); }
  if (!response.ok) throw new RealityReadError(response.status, body?.transport_error?.code ?? 'PROVENANCE_SOURCE_UNAVAILABLE');
  const context = body?.canonical_binding_context;
  if (body?.transport?.contract !== 'human-interface-provenance-source.v1' ||
      context?.project_id !== projectId || context?.entity_id !== entityId || context?.observation_id !== observationId ||
      body.transport.project_snapshot_fingerprint !== fingerprint ||
      !body.frozen_selected_input?.source || !body.frozen_selected_input?.report ||
      !Array.isArray(body.frozen_selected_input?.relevant_actors) || typeof body.raw_selected_input !== 'string') {
    throw new RealityReadError(response.status, 'INVALID_PROVENANCE_RESPONSE');
  }
  return body;
}
