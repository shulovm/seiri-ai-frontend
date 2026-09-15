export class RealityReadError extends Error {
  constructor(status, code) {
    super(code);
    this.status = status;
    this.code = code;
  }
}

export async function fetchReality(projectId, entityId, { signal, fetcher = fetch } = {}) {
  const base = import.meta.env?.VITE_API_BASE ?? '';
  const response = await fetcher(`${base}/api/human-interface/reality/${encodeURIComponent(projectId)}/${encodeURIComponent(entityId)}`, { method: 'GET', signal });
  let body;
  try { body = await response.json(); }
  catch { throw new RealityReadError(response.status, 'INVALID_READ_RESPONSE'); }
  if (!response.ok) throw new RealityReadError(response.status, body?.transport_error?.code ?? 'SERVER_READ_FAILURE');
  if (body?.transport?.contract !== 'human-interface-reality-read.v1' ||
      !body.canonical_records || !body.core_read_results) {
    throw new RealityReadError(response.status, 'INVALID_READ_RESPONSE');
  }
  return body;
}
