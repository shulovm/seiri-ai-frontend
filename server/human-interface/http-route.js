import { Router } from 'express';
import { tsImport } from 'tsx/esm/api';

// Scoped TS runtime import; no copy of canonical readers or global loader change.
const adapter = tsImport('./read-adapter.ts', import.meta.url);
// A packaging/import failure is reported by the GET boundary, not an unhandled
// rejection while the existing server is idle.
adapter.catch(() => {});
const transportStatuses = {
  PROJECT_SCOPE_MISMATCH: 404, ENTITY_NOT_IN_SNAPSHOT: 404,
  FIXTURE_SOURCE_UNAVAILABLE: 503, FIXTURE_INTEGRITY_FAILURE: 503,
  CANONICAL_SOURCE_INVALID: 503,
  LIVE_RUNTIME_CONFIG_UNAVAILABLE: 503, LIVE_ROOT_UNAVAILABLE: 503,
  LIVE_PROJECT_FILE_MISSING: 503, LIVE_PROJECT_ID_MISMATCH: 503,
  LIVE_SNAPSHOT_VALIDATION_FAILURE: 503, LIVE_PERMISSION_DENIED: 503, LIVE_READ_FAILURE: 503,
};

export function createHumanInterfaceRouter(reader, browseReader, provenanceReader) {
  const router = Router();
  const handle = select => async (req, res) => {
    res.set('Cache-Control', 'no-store');
    if (req.method !== 'GET') {
      res.set('Allow', 'GET');
      return res.status(405).json({ transport_error: { code: 'METHOD_NOT_ALLOWED' } });
    }
    if (Object.keys(req.query).length) {
      return res.status(400).json({ transport_error: { code: 'UNSUPPORTED_QUERY_PARAMETERS' } });
    }
    try {
      const loaded = await adapter;
      try {
        return res.json(select(loaded, req));
      } catch (error) {
        if (Object.hasOwn(transportStatuses, error?.code)) {
          return res.status(transportStatuses[error.code]).json({ transport_error: { code: error.code } });
        }
        // Expose core failure classification without inventing replacement data.
        return res.status(503).json({ transport_error: {
          code: 'CANONICAL_READ_FAILURE', core_error_code: error?.code ?? null,
        } });
      }
    } catch {
      return res.status(503).json({ transport_error: { code: 'READ_RUNTIME_UNAVAILABLE' } });
    }
  };
  router.all('/projects', handle(loaded => (browseReader ?? loaded.humanBrowseReader).catalog()));
  router.all('/projects/:projectId', handle((loaded, req) => (browseReader ?? loaded.humanBrowseReader).project(req.params.projectId)));
  router.all('/reality/:projectId/:entityId', handle((loaded, req) =>
    (reader ?? loaded.readHumanReality)(req.params.projectId, req.params.entityId)));
  // Separate lazy boundary: bundle/import failure never disables canonical Entity reads.
  router.all('/reality/:projectId/:entityId/observations/:observationId/provenance-source', async (req, res) => {
    res.set('Cache-Control', 'no-store');
    if (req.method !== 'GET') { res.set('Allow', 'GET'); return res.status(405).json({transport_error:{code:'METHOD_NOT_ALLOWED'}}); }
    if (Object.keys(req.query).length) return res.status(400).json({transport_error:{code:'UNSUPPORTED_QUERY_PARAMETERS'}});
    try {
      const loaded = await tsImport('./provenance-source.ts', import.meta.url);
      return res.json((provenanceReader ?? loaded.resolveProvenanceSource)(req.params.projectId, req.params.entityId, req.params.observationId, req.get('If-Ground-Snapshot-Fingerprint')));
    } catch (error) {
      const known = /^(PROVENANCE_|OBSERVATION_BINDING_MISMATCH$|OBSERVATION_NOT_IN_SCOPE$|SNAPSHOT_)/.test(error?.code ?? '');
      if (known) return res.status(error.status ?? 503).json({transport_error:{code:error.code}});
      if (Object.hasOwn(transportStatuses, error?.code)) return res.status(transportStatuses[error.code]).json({transport_error:{code:error.code}});
      return res.status(503).json({transport_error:{code:'PROVENANCE_SOURCE_UNAVAILABLE'}});
    }
  });
  return router;
}
