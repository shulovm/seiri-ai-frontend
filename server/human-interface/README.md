# HUMAN-004B — Mutable Canonical Storage Read Boundary

The existing JavaScript server mounts `http-route.js`, which uses scoped `tsx`
`tsImport` to load the adapter and canonical TypeScript core. No global runtime
loader, React UI change, new canonical type or deployment is introduced.
Existing Docker/Vercel include patterns already cover the registry and fixtures.
Hosted deployment and Docker image build are not verified by this checkpoint.

## Selection and read scope

`GET /api/human-interface/reality/:projectId/:entityId`

The server-only `source-resolver.ts` selects either the immutable proof registry
or the explicitly registered mutable live Project. `source-registry.ts` retains
its immutable fixture contract.
Its checked-in manifest explicitly registers `human-001`, `e2-b15` and
`historical-round4`. The project ID uniquely resolves one entry; the entity ID
is checked for membership in that same verified ProjectState. Every saved
RealityEntity is permitted, including Entities with zero subject-related records.
The manifest candidate remains proof metadata/fixture validation, not access control. Source keys are metadata,
not alternative request selectors. No path, filename, registry override, scan,
nearest match, fallback, newest selection or multi-source merge is supported.

For proof Projects, each canonical request reads its registered fixture once, verifies
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
Each catalog entry contains only `project_id`, `source_key`, `source_mode`, `source_qualification`.
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
Each canonical request acquires exactly one snapshot. Proof hashes are checked
before parsing; live exact-byte hashes and validation come from the core snapshot loader. Catalog is the explicit zero-read case.
Both new routes use the same GET-only, no-query, no-store and failure boundary.
No filesystem path or internal source origin is exposed.

The permitted browse scope is identity enumeration plus the existing selected
Entity read path. Project-wide Evidence, Claims, Observations, Events/States,
raw ProjectState download, reverse provenance, cross-Entity traversal, derived
ranking and write/action remain outside scope. A selectable Entity does not
imply rich knowledge about that Entity. No React changes are included.


## Explicit live enablement (HUMAN-004B)

Set `GROUND_RUNTIME_CONFIG` in the server process environment to the absolute
path of the existing STORAGE-003 runtime JSON, then start the server. The JSON
has the existing `CanonicalOwnerConfig` fields `mode: canonical-live`, absolute
`storageDir`, and `writerOwner`. No new storage configuration format is added.
STORAGE-003 has no exported config loader: owner-cli parses this JSON inline;
the read boundary reads the same file and reuses core `assertPersistenceMode`.
Only `{mode, storageDir}` is passed to `loadProjectSnapshot`; ownership is never
acquired and `writerOwner` is not used as a write capability.

No environment setting means proof-only (3 catalog entries). A provided setting
explicitly enables one fourth entry: `088d09dc-dfc5-487a-8f8f-22d2b33a9249`,
source key/qualification `canonical-live-project`. Catalog does not open the
runtime JSON, inspect the root, load a snapshot, or assert availability. Invalid
or missing configured runtime JSON fails on canonical read. No default-root,
fixture or environment-storage fallback is permitted. No root enumeration occurs.
Paths and runtime settings never appear in transport responses or error messages.

Transport `source_mode` is `immutable_proof_snapshot` or
`mutable_canonical_storage`, independent of `source_qualification`. Project and
Entity responses include `snapshot_fingerprint`, the SHA-256 of the stored bytes
used for that response. `sha256` remains a compatibility alias. Proof Entity
responses retain `fixture`; live responses do not claim fixture identity or an
immutable baseline commit. Existing proof response fields and canonical results
remain intact. Neither source metadata nor fingerprint is a canonical field,
revision, generation, temporal current state, truth identity, or ranking.

A live Project/Entity request calls core `loadProjectSnapshot` once. All identity,
worldline, Observation, Claim and claim-linked Evidence reads use that returned
state. The next request may observe another fingerprint after owner publication.
There is no cross-request pinning, latest/current selection, or temporal logic
in the adapter. Tests publish B after acquiring A: the first response stays wholly
A and the next response reads B. Test publication uses only disposable roots.

Live failures are HTTP 503 with only `transport_error`:

- `LIVE_RUNTIME_CONFIG_UNAVAILABLE`: missing/invalid configured runtime JSON.
- `LIVE_ROOT_UNAVAILABLE`: absent/non-directory root.
- `LIVE_PROJECT_FILE_MISSING`: the registered Project file cannot be found.
- `LIVE_PROJECT_ID_MISMATCH`: loaded Project identity differs from request.
- `LIVE_SNAPSHOT_VALIDATION_FAILURE`: canonical read/validation or root manifest failure.
- `LIVE_PERMISSION_DENIED`: root/snapshot access denied.
- `LIVE_READ_FAILURE`: other storage failure.

These are read failures within registered scope, not global absence or empty
collections. Existing proof errors, 404 unknown scope/membership, GET-only,
no-query and no-store behavior remain. The server never imports save/owner
acquisition, performs migration writeback, mutates manifests or removes locks/temp
files. Existing lock/temp bytes remain unchanged during read tests.

## Actual live verification and remaining scope

The opt-in script `scripts/human-interface/verify-human-004b-live.ts` uses the same
`GROUND_RUNTIME_CONFIG` environment setting and default HTTP router. It requires
LIVE-003C fingerprint
`f1ed694f3e0c3a10d383e816f43ca003cd6c123dad18c3f0688d2289c0f3e3bc`
and stops for investigation on a difference; it never restores or accepts it.
It verifies live Catalog 4, Project Entity 1, Document
`fbdfd235-1a5b-5a5d-ad30-6f2c170fe9f9`, Observation
`87ae62f9-9481-5577-a299-813c022d2007`, Claims/Events/States 0 and exact core
worldline. Live Project and all existing root file bytes are unchanged afterward.

Canonical storage Evidence `3151b313-d5bc-5b58-a17d-a61add22f22d` exists (1),
but Entity response claim-linked bundles are 0. This is not a Project-wide
Evidence count. Observation→Evidence traversal is a later read-scope checkpoint.
React/UI, refresh, source badges, fingerprint display and presentation remain
unchanged. HUMAN-004C can consume this server capability; no live UI proof is
claimed or automatically started.

Current verification: 89 tests PASS (all server resolver/registry/boundary and
existing UI tests, file-store and storage-owner tests), adapter/core typechecks,
Human Interface lint, Vite build, Foundation verification and actual live HTTP
verification PASS. Core/storage/schema/fixtures are unchanged. Full core suite
not rerun; known missing-fixture 104 failures are not repaired.

Commands (HTTP tests require local loopback permission):

```sh
TSX_TSCONFIG_PATH=server/human-interface/ui-test-tsconfig.json node --import tsx --test server/human-interface/*.test.ts server/human-interface/*.test.tsx ground-core/__tests__/file-store.test.ts ground-core/__tests__/storage-owner.test.ts
node_modules/.bin/tsc -p server/human-interface/tsconfig.json
node_modules/.bin/tsc -p ground-core/tsconfig.json
node_modules/.bin/eslint src/human-interface server/human-interface/http-route.js
npm run build
node --import tsx scripts/human-interface/verify-human-001.ts
# With the existing runtime config path explicitly set in GROUND_RUNTIME_CONFIG:
node --import tsx scripts/human-interface/verify-human-004b-live.ts
```

## Historical verification — HUMAN-003B

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
