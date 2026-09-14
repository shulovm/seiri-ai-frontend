# HUMAN-001B — Canonical Read Boundary

Server-only transport over the immutable HUMAN-001A fixture. No frontend, new
canonical type, summary, gap query, inferred relationship, or durable write.

## Runtime

The existing JavaScript server mounts http-route.js. It uses the existing tsx
scoped tsImport API to load read-adapter.ts and the existing TypeScript core.
The node server.js entry point is unchanged. tsx, ajv and ajv-formats are promoted
to production dependencies with original dependency ranges and locked versions;
no canonical code is copied. Dockerfile.api copies the required source/fixture
files; the Vercel function includes dynamic TS imports, schemas and fixture.
These packaging changes do not deploy anything. Hosted deployment is not tested.

## Endpoint and transport

GET /api/human-interface/reality/19041904-1904-4904-8904-190419041904/72bf5051-f100-524a-ac33-7a911f6d974a

Each accepted request reads one fixed file once, verifies SHA-256 against the
frozen manifest and Foundation hash, then uses core normalizeProjectState and
validateProjectState. All readers share that one normalized state. No snapshot
cache, fallback source, filesystem query, write-back, or read timestamp exists.
Other projects/entities are rejected even if present in the full fixture.

Response sections are transport wrappers, not a new GROUND schema:

- transport: contract name, fixture identity/hash, stored schema 0.1.24, read
  schema 0.1.25, canonical baseline commit, requested scope and returned counts.
- canonical_records: unchanged Project, RealityEntity, EpistemicObservations
  and Claims.
- core_read_results: unchanged getRealityWorldline result and each Claim's
  getEvidenceForClaim result, including links, supports, contradicts and complete
  Evidence/provenance fields. Those existing read results contain canonical records;
  their ordering, grouping and temporal_summary remain core-derived results.

The entity also occurs in the Worldline result because that is the existing core
return shape. No flattened/renamed canonical fields or added canonical relations.
Counts describe returned records only. Empty arrays, timestamp declarations,
field-specific nulls and confidence retain their original values. Evidence is
reachable only through the explicit ClaimEvidenceLinks returned by core.

All responses use Cache-Control: no-store. Errors contain only transport_error:

- 404 PROJECT_SCOPE_MISMATCH or ENTITY_NOT_FOUND.
- 400 UNSUPPORTED_QUERY_PARAMETERS (including path).
- 405 METHOD_NOT_ALLOWED; Allow: GET. HEAD is also rejected.
- 503 FIXTURE_INTEGRITY_FAILURE before parsing/normalization; no repair/fallback.
- 503 FIXTURE_SOURCE_UNAVAILABLE, CANONICAL_SOURCE_INVALID or READ_RUNTIME_UNAVAILABLE.
- 503 CANONICAL_READ_FAILURE with core_error_code when the existing core reader
  cannot supply a result. No replacement data is manufactured.

## Verification

```sh
node --import tsx scripts/human-interface/verify-human-001.ts
node --import tsx --test server/human-interface/read-boundary.test.ts
node_modules/.bin/tsc -p server/human-interface/tsconfig.json
node_modules/.bin/tsc -p ground-core/tsconfig.json
npm run build
```

Tests use local ephemeral HTTP ports and server-only injected byte readers to
simulate corruption/source failure without modifying the frozen fixture. They
compare complete response records/read results with direct canonical reads,
check exact source bytes after requests, no creation of core storage, identity
isolation, forbidden query/methods, per-request integrity and single-buffer use.

Checkpoint verification: 6 boundary tests PASS; adapter and core typechecks PASS;
Vite build PASS; Foundation verifier PASS. A separate directory with only
production dependencies also served the GET successfully from plain node with
no --import loader. No hosted deployment or Docker image build was performed.

The clean-worktree core suite ran 3,857 tests: 3,753 PASS and 104 FAIL, all caused
by absent ignored ground-core/storage/projects fixture files. Those same 104
cases fail in the independent Foundation archive. The archive additionally fails
one Git-ignore test because git archive does not contain .git (3,752 PASS / 105
FAIL). No core fixture/storage files were imported to hide these existing
reproducibility gaps, and no core tests were changed.

## HUMAN-001C limits

The frontend may consume these unchanged records and core results with their
transport metadata. It must keep source-content claims distinct from historical
truth, confidence from historical probability, ingestion/applicability times
from occurrence times, and zero records from historical absence. No direct
Event/State-to-Evidence link exists here. The fixture has zero Events, States and
EpistemicObservations, so this proof does not exercise their populated temporal
cases. Canonical resolution/comparison remains core authority; this adapter
does not add time queries or reinterpret any declarations.
