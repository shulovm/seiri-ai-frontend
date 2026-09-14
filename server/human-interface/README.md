# HUMAN-002C — Registry-Resolved Read Boundary

The existing JavaScript server mounts `http-route.js`, which uses scoped `tsx`
`tsImport` to load the adapter and canonical TypeScript core. No global runtime
loader, React UI change, new canonical type or deployment is introduced.
Existing Docker/Vercel include patterns already cover the registry and fixtures.
Hosted deployment and Docker image build are not verified by this checkpoint.

## Selection and read scope

`GET /api/human-interface/reality/:projectId/:entityId`

The server-only `source-registry.ts` is the sole snapshot selection authority.
Its checked-in manifest explicitly registers `human-001`, `e2-b15` and
`historical-round4`. The project ID uniquely resolves one entry; the entity ID
must match that entry's proof candidate. An Entity present elsewhere in the
same ProjectState is still outside this HTTP scope. Source keys are metadata,
not alternative request selectors. No path, filename, registry override, scan,
nearest match, fallback, newest selection or multi-source merge is supported.

After scope checks, each request reads its registered fixture once, verifies
fresh bytes against its registered SHA-256 before parsing, then calls existing
core normalization and validation. Stored schema remains 0.1.24; read schema is
0.1.25. Every canonical reader receives that same normalized ProjectState.
The only read paths are `getRealityWorldline`, `getObservationsForSubject`,
`getClaimsForSubject` and `getEvidenceForClaim` per returned Claim.

## Transport and canonical contracts

The route and `human-interface-reality-read.v1` response shape remain:

- `transport`: source metadata, requested project/entity scope and returned
  Event/State/Observation/Claim counts. `source.source_key` and
  `source.source_qualification` are additive metadata. `source.fixture` remains
  as the existing compatibility field, now set to the registered source key.
  Hash, stored/read schema and canonical baseline commit are retained. Filesystem
  paths and original source paths are not sent to clients.
- `canonical_records`: unchanged Project, candidate RealityEntity, Observations
  and Claims returned by core.
- `core_read_results`: complete unchanged worldline and per-Claim Evidence
  bundles, including links, supports, contradicts and canonical provenance.

Qualification is source provenance, not confidence, trust or a truth judgment.
B15 carries `controlled-experiment-canonical-snapshot` only in transport; both
Historical sources carry `historical-replay-canonical-snapshot`. These fields
are never injected into canonical records.

B15 returns Event 1, State 2, Observation 2, Claim 0, worldline entries 4 and
unplaced 0. Original timestamps, field-specific nulls, bounded/open-ended State
intervals and same-time ordering remain untouched. Its 12:00 Observation does
not change the core worldline summary's 11:00 latest time. There is no adapter
Date comparison or timeline reconstruction.

B15's ProjectState contains one Evidence, but the claim-linked path returns no
bundles because there are no Claims/links. The response does not assert a
project-wide Evidence count. No project Evidence search, Observation-to-Evidence
or provenance Entity expansion is included.

Round 4 returns 23 Claims and 23 explicit links to one unique Evidence. Per-Claim
core bundles retain that same Evidence ID without creating new canonical
records or aggregating Claims. HUMAN-001 retains its original canonical result:
1 Claim, 1 link, 1 linked Evidence, and no Events/States/Observations.

## Failures

Responses use `Cache-Control: no-store`. Failure responses contain only
`transport_error`, never replacement empty Reality data:

- 404 `PROJECT_SCOPE_MISMATCH`: project has no registered source; no file read.
- 404 `ENTITY_NOT_FOUND`: retained compatibility code for an entity outside the
  registered proof scope; this does not assert absence from ProjectState.
- 400 `UNSUPPORTED_QUERY_PARAMETERS`: all query parameters rejected.
- 405 `METHOD_NOT_ALLOWED`, `Allow: GET`: includes HEAD and OPTIONS.
- 503 `FIXTURE_INTEGRITY_FAILURE`: no parse/normalization/fallback/writeback.
- 503 `FIXTURE_SOURCE_UNAVAILABLE`: registered bytes unavailable; no fallback.
- 503 `CANONICAL_SOURCE_INVALID`: registry schema/identity/validation mismatch.
- 503 `CANONICAL_READ_FAILURE` with existing `core_error_code` where available:
  parsing, core normalization/validation exceptions, or canonical read failure.
- 503 `READ_RUNTIME_UNAVAILABLE`: runtime import/registry initialization failure.
  Duplicate registration fails closed during initialization.

## Verification

```sh
node --import tsx --test server/human-interface/source-registry.test.ts server/human-interface/read-boundary.test.ts server/human-interface/ui.test.tsx
node --import tsx scripts/human-interface/verify-human-001.ts
node_modules/.bin/tsc -p server/human-interface/tsconfig.json
node_modules/.bin/tsc -p ground-core/tsconfig.json
node_modules/.bin/eslint src
node_modules/.bin/eslint src/human-interface server/human-interface/http-route.js
npm run build
```

33 tests PASS: registry 9, HTTP 18, existing UI 6. Tests compare complete HTTP
canonical results against direct existing readers for all sources, verify each
request uses exactly one fresh snapshot, reject in-project but out-of-scope
entities before reading, and exercise per-source corruption and method/query
restrictions. Malformed/invalid source cases use server-only byte injection;
no fixture or manifest is altered. All three fixture hashes and source bytes
remain identical to HUMAN-002B; Foundation verifier passes.

Plain Node (without a global TS loader) also serves all three registered routes with HTTP 200.

The core suite reproduces 3,753 PASS / 104 FAIL out of 3,857 tests; remaining
failures are missing ignored storage fixtures, matching the known baseline.
A sandboxed run initially added one CLI subprocess failure; rerunning with the
required local process permissions removed that environment-only failure.
No core files or missing storage fixtures were changed.

Adapter/core typechecks and Vite build pass. Focused Human Interface/HTTP lint
passes. Full frontend lint has 36 pre-existing errors in App.jsx, Explore.jsx,
kakera.js and prefs.js; diagnostic content matches the unchanged HUMAN-001D
frontend baseline exactly. No React or lint configuration changes are made.

HUMAN-002D can consume these three proof routes and separate transport source
qualification from canonical records. It must still decide presentation of
populated records. Arbitrary Entity browsing, project-wide Evidence and reference
expansion remain future read-scope decisions. No source selector, index, lens,
ranking, summary or write/action capability is included here.
