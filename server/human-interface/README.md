# HUMAN-003B — Project / Entity Browse Boundary

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
is checked for membership in that same verified ProjectState. Every saved
RealityEntity is permitted, including Entities with zero subject-related records.
The manifest candidate remains proof metadata/fixture validation, not access control. Source keys are metadata,
not alternative request selectors. No path, filename, registry override, scan,
nearest match, fallback, newest selection or multi-source merge is supported.

After resolving the registered Project, each canonical request reads its registered fixture once, verifies
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
- `canonical_records`: unchanged Project, selected RealityEntity, Observations
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
- 404 `ENTITY_NOT_IN_SNAPSHOT`: after integrity, normalization and validation,
  the ID is absent from the selected snapshot’s RealityEntity collection. This
  says nothing about the world, history, other snapshots or all GROUND knowledge.
  Integrity failure takes precedence over Entity membership.
- 400 `UNSUPPORTED_QUERY_PARAMETERS`: all query parameters rejected.
- 405 `METHOD_NOT_ALLOWED`, `Allow: GET`: includes HEAD and OPTIONS.
- 503 `FIXTURE_INTEGRITY_FAILURE`: no parse/normalization/fallback/writeback.
- 503 `FIXTURE_SOURCE_UNAVAILABLE`: registered bytes unavailable; no fallback.
- 503 `CANONICAL_SOURCE_INVALID`: registry schema/identity/validation mismatch.
- 503 `CANONICAL_READ_FAILURE` with existing `core_error_code` where available:
  parsing, core normalization/validation exceptions, or canonical read failure.
- 503 `READ_RUNTIME_UNAVAILABLE`: runtime import/registry initialization failure.
  Duplicate registration fails closed during initialization.

## Catalog and Project Browse

`GET /api/human-interface/projects` returns
`{ transport: { contract: "human-interface-project-catalog.v1" }, registered_projects }`.
Each catalog entry contains only `project_id`, `source_key`, `source_qualification`.
It enumerates the explicit registry in registry order, reads zero snapshot bytes,
and performs no storage scan. It does not claim verified integrity, loaded Project,
canonical title or confirmed schemas. Source qualification describes origin, not
quality, Project kind/status, warning severity or rank.

`GET /api/human-interface/projects/:projectId` returns:

- `transport`: contract `human-interface-project-browse.v1`, `requested_scope.project_id`,
  and `source` containing source_key, source_qualification, sha256,
  stored_schema_version, read_schema_version and canonical_baseline_commit.
- `canonical_project`: complete unchanged canonical Project, including title,
  summary, status, timestamps and tags if present. Strings such as Historical’s
  `historical sidecar required` are carried, never interpreted as instructions.
- `canonical_entities`: exactly `id`, `project_id`, `kind`, `label` from each
  saved RealityEntity. This is a transport projection, not a new canonical type.

Stored collection order is preserved; no semantic ordering is asserted.
No identity counts, ranking, temporal summaries, search or filtering are added.
Each canonical request reads exactly one fresh snapshot and verifies its hash
before parsing/normalization/validation. Catalog is the explicit zero-read case.
Both new routes use the same GET-only, no-query, no-store and failure boundary.
No filesystem path or internal source origin is exposed.

The permitted browse scope is identity enumeration plus the existing selected
Entity read path. Project-wide Evidence, Claims, Observations, Events/States,
raw ProjectState download, reverse provenance, cross-Entity traversal, derived
ranking and write/action remain outside scope. A selectable Entity does not
imply rich knowledge about that Entity. No React changes are included.

## Verification — HUMAN-003B

```sh
node --import tsx --test server/human-interface/source-registry.test.ts server/human-interface/read-boundary.test.ts server/human-interface/browse-boundary.test.ts server/human-interface/ui.test.tsx
node --import tsx scripts/human-interface/verify-human-001.ts
node_modules/.bin/tsc -p server/human-interface/tsconfig.json
node_modules/.bin/tsc -p ground-core/tsconfig.json
node_modules/.bin/eslint src/human-interface server/human-interface/http-route.js
npm run build
```

50 tests PASS (registry, existing Entity boundary, Browse boundary and existing UI).
Tests cover catalog with an unavailable byte reader (zero reads), exact Project
fields and identity-only projections (14 / 4 / 42), saved ordering, one fresh
snapshot per request, hash failures, cross-project rejection and all 60 Entity
results compared to direct canonical readers. Existing three proof routes retain
identical canonical results. Representative non-candidate HTTP proofs:

- B15 `15399c69-cad8-4c41-8243-00df797258d0`: source person, all subject collections zero.
- HUMAN-001 `bac9d6f2-862c-5006-af95-2dfd85d1475c`: 1 Claim and 1 linked bundle.
- Round4 `c7e61d36-1a63-5e61-a2f0-c146dde96887`: 11 Claims and 11 linked bundles.

Fixture bytes, manifest, core and schema are unchanged. Foundation verification,
adapter/core typechecks, focused lint and Vite build pass. Full frontend lint
retains the same 36 baseline errors; they are outside this change. The full core
suite is not rerun: its known baseline remains 3,753 PASS / 104 FAIL from missing
storage fixtures, not a newly measured result.

HUMAN-003C may consume the catalog, verified Project Browse and generalized
Entity endpoint. The old UI’s candidate-scope error wording is unchanged here;
003C must handle ENTITY_NOT_IN_SNAPSHOT explicitly. Other read-failure handling
and existing proof rendering remain covered by existing UI tests. Hosted
deployment and browser browse UI are not verified or implemented here.
