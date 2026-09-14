import { Router } from 'express';
import { tsImport } from 'tsx/esm/api';

// Scoped TS runtime import; no copy of canonical readers or global loader change.
const adapter = tsImport('./read-adapter.ts', import.meta.url);
// A packaging/import failure is reported by the GET boundary, not an unhandled
// rejection while the existing server is idle.
adapter.catch(() => {});
const transportStatuses = {
  PROJECT_SCOPE_MISMATCH: 404, ENTITY_NOT_FOUND: 404,
  FIXTURE_SOURCE_UNAVAILABLE: 503, FIXTURE_INTEGRITY_FAILURE: 503,
  CANONICAL_SOURCE_INVALID: 503,
};

export function createHumanInterfaceRouter(reader) {
  const router = Router();
  const route = '/reality/:projectId/:entityId';
  router.all(route, async (req, res) => {
    res.set('Cache-Control', 'no-store');
    if (req.method !== 'GET') {
      res.set('Allow', 'GET');
      return res.status(405).json({ transport_error: { code: 'METHOD_NOT_ALLOWED' } });
    }
    if (Object.keys(req.query).length) {
      return res.status(400).json({ transport_error: { code: 'UNSUPPORTED_QUERY_PARAMETERS' } });
    }
    try {
      const { readHumanReality } = await adapter;
      try {
        return res.json((reader ?? readHumanReality)(req.params.projectId, req.params.entityId));
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
  });
  return router;
}
