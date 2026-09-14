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

## HUMAN-001D — Human comprehension / semantic audit

C commit d7c66cfcb4c7a3001ec0c42918fb2bada3ea21c9 was pushed and confirmed on
origin/ground/human-001 before D. D changes presentation and its tests only.

Observed design risks (not measured human misreadings): canonical identity and
transport fields shared one context list; Overview could imply completeness;
Claim fields lacked role grouping; confidence and SUPPORTS lacked nearby role
notes; raw disclosure was at the bottom of long records; the fixed-width layout
could weaken label/value correspondence in narrow viewports.

Changes: canonical context and dashed transport-source section are separate;
counts are titled Records in this read scope with a completeness-limit note;
Claim identity/predicate, content, provenance, confidence, applicability and
record/storage fields have headings. All canonical fields and full raw records
remain. Raw disclosure is immediately below each record heading. Nearby notes
explain presentation/field roles without interpreting this historical fixture.
SUPPORTS stays the canonical relation; external_ref is a reference, not a source
quality evaluation. Empty Worldline does not assert historical inactivity.
Below 720px, each label and value stay in the same bounded row stacked vertically.
There is no KPI treatment, semantic icon/color, gauge, percentage or trust score.

Browser checks covered normal view, expanded raw Claim, a 480x800 viewport,
long JSON values, null applicability, external_ref href, loading, 404 and an
isolated integrity-failure test instance. Its changed-byte injection used the
unchanged B boundary; fixture bytes were never changed. Error views displayed
transport failures with no canonical content. The viewport was reset and the
normal proof restored. No external source page was treated as new authority.

Screen-only answerability review by the implementation author:

- Entity label: FRUS 1904, document 392; Entity/Project UUIDs are visible.
- Claims returned: 1; EpistemicObservations returned: 0, limited to the scope.
- Claim 79f42640-9eff-5def-a807-268ea0c0650f is referenced by Link
  44bcabb0-59b3-5d23-aa4b-b9edd5d00959, whose evidence_id is
  496d2e47-849a-5ddc-ae95-7ef6891b6ef3; relation is SUPPORTS.
- Provenance is visible in Claim and Evidence; confidence is 0.95;
  applicable_from is 2026-09-14T00:00:00.000Z; applicable_until is null.
- Source metadata separates stored schema 0.1.24 and read schema 0.1.25 and
  explains successful server fixture-hash verification, not source authenticity.
- The UI supplies no verdict on historical truth, most reliable source,
  historical occurrence date, reasons for zero observations, Claim adoption
  or source rank. Stored values are not promoted into answers to those questions.

No independent human participant comprehension test was performed. These are
presentation and semantic-risk checks, not proof that nobody can misread a
screen. The remaining long-page density and technical vocabulary are accepted
limits of this minimal proof; a generic inspector/navigation framework is out of
scope. Populated temporal cases require a future approved real fixture, not
synthetic additions. Historical truth/authenticity are deliberately not decided.

Final D verification: 12/12 HUMAN tests PASS (6 UI, 6 unchanged B boundary),
test/adapter/core typechecks and targeted frontend ESLint PASS, Vite build PASS,
Foundation verification PASS. JSX props remain JavaScript, not fully statically
typed. Core suite: 3,753 PASS / 104 FAIL, exactly the C failed cases, no increase.
Fixture SHA-256 remains
863545f650835b2b36c283ed2455cfe6fc31f10fbad78ee8647dc264ae56ad6c;
schema is 0.1.25; B contract and core are unchanged.

HUMAN-001's single-Entity read-only proof is complete within this audited scope.
No implementation blocker remains for that proof. Independent human usability
validation and other datasets remain limitations; no HUMAN-002 work is started.
