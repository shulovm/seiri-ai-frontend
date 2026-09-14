# HUMAN-001C — First Reality Explorer

Route: /reality/:projectId/:entityId (also under the existing /ma basename).
The B checkpoint a3233b170cf73be3ee5b4b74728ee5303045c7c0 was pushed and
confirmed on origin/ground/human-001 before UI implementation.

## Structure and boundary

RealityExplorer owns only request loading/error/response state and route params.
read-client performs GET requests to the existing HUMAN-001B endpoint, returning
the response without semantic conversion. No client imports of fixture or core.

RealityReadView presents, in one page:

1. Context: Project/Entity identity, label/kind, stored/read schema, fixture/hash.
2. Overview: scope-limited counts and inspectable raw collections.
3. Entity: every canonical field and one-operation full raw record.
4. Worldline: the complete existing getRealityWorldline result as raw.
5. Observations: returned records or a literal scope count of zero.
6. Claims: every field, then an expandable getEvidenceForClaim result matched
   by the explicit returned claim_id. Link fields and Evidence records retain
   existing supports/contradicts grouping. This is not a Graph projection.

RecordPanel renders field names unchanged; objects/arrays are declared JSON.
Provenance is visible without interaction, including inside Claim and Evidence.
Canonical/raw records are a formal feature, available within one operation.
Raw transport metadata is explicitly labelled as not a canonical record.
External references are inspectable links without trust/quality classifications.

No timestamp parsing, locale date conversion, temporal sorting, confidence
meter, truth score, interpretation, authority or inferred relations are added.
Read failure hides the canonical view. FIXTURE_INTEGRITY_FAILURE is labelled
as a read-foundation abnormality, separately from successful empty collections.

Zero wording: この read scope で返された件数: 0.
It asserts only the returned count, not historical absence or lack of observation.

server.js and vercel.json changes only enable SPA deep links; the B endpoint,
adapter and transport contract are unchanged. Existing /explore is retained.

## Checks

```sh
node --import tsx --test server/human-interface/ui.test.tsx
node --import tsx --test server/human-interface/read-boundary.test.ts
node_modules/.bin/tsc -p server/human-interface/ui-test-tsconfig.json
node_modules/.bin/tsc -p server/human-interface/tsconfig.json
node_modules/.bin/tsc -p ground-core/tsconfig.json
node_modules/.bin/eslint src/human-interface/*.jsx src/human-interface/read-client.js
npm run build
```

UI tests exercise the endpoint client, full raw preservation and representative
readable fields, scope counts, confidence/null/temporal fields, explicit Evidence
path, error separation and client import boundary. SSR tests do not prove all
browser interactions; the live browser must also be inspected and raw disclosure
opened. UI JavaScript is linted/built; the TypeScript checks cover tests, adapter
and core, not full static typing of JSX props.

Final checks: UI 5/5 and existing boundary 6/6 PASS; the listed TypeScript checks,
targeted frontend ESLint, Vite build and Foundation verifier PASS. Core tests
remain 3,753 PASS / 104 FAIL, with exactly the same failed cases as HUMAN-001B
(ignored storage fixture absence), no new failures. Fixture hash, core schema
0.1.25 and B adapter/HTTP contract are unchanged.

Live browser checks covered FRUS 392 fields, one-operation Entity raw disclosure,
scope-limited zero collections, loading and a 404 Project scope error through the
production SPA deep link. An isolated localhost instance used the existing B
router and server-only changed-byte injection to check the actual 503 integrity
screen, without modifying the fixture. The normal view was restored afterward.
Rendered fields were audited for added truth/source/temporal/relationship claims;
none were found in this proof. This audit is limited to this fixture and these
error cases, not a general semantic guarantee for future datasets.

## Remaining scope

This is a single-Entity proof. Event/State/Observation populated temporal cases,
multiple records, presentation density and future query-scoped derived reads
remain for subsequent approved checkpoints. No mobile optimization, global
navigation, search, Graph/Timeline/Map, BTC, writes or authentication are added.
