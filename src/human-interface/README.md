# HUMAN-003C — Minimal Browse UI

Baseline: Core v0 e769df3dabfee6f14b388cff8a150880ee323d37 and server boundary
f640a4ce20ded2afbaa5dd23d38f4a03fca5c78c. The latter was pushed and verified
on origin/ground/human-003 before this implementation.

Routes (also under /ma):

- /reality: GET /api/human-interface/projects. Displays only registered project_id,
  source_key and source_qualification, without canonical titles, schemas, hashes
  or integrity claims. No prefetch of Project or Entity content.
- /reality/:projectId: GET /api/human-interface/projects/:projectId. Displays the
  unchanged canonical Project fields, followed by RealityEntity identity links in
  response order. The identity disclosure retains all four projected fields.
  Transport / Snapshot source is a separate section. No counts or inferred status.
- /reality/:projectId/:entityId: existing Entity read and Explorer, with Projects /
  Project navigation. The new ENTITY_NOT_IN_SNAPSHOT explanation is limited to
  membership in the selected verified snapshot, not absence in the world.

Browse owns only route-specific request state and cancellation. Old scope content
is not rendered while a new scope is loading. Catalog errors are described as
registry catalog failures, never canonical read results. Project title is obtained
only from a verified Project Browse response. Qualification is neutral origin
metadata; saved Project summary text is transported without interpretation.

server.js and vercel.json only add SPA entry routes; no API contract is changed.
No search/filter/sort, metrics, source ranking, project-wide records, provenance
traversal, temporal processing or write/action is added. Canonical records, schema,
registry entries and fixture bytes are unchanged.

Verification: 56 tests PASS across registry, Entity/Browse boundary, existing UI
and new Browse UI tests. Adapter/core typechecks, focused Human Interface lint,
Vite build and Foundation verification pass. Full frontend lint has the identical
36 baseline errors. Full core suite not rerun; 3,753 PASS / 104 FAIL remains the
previous measured baseline, not a new claim about execution.

Real browser proof on localhost:3003: catalog → each of the three Projects →
candidate and non-candidate Entity → back navigation. Lists contained 14 / 4 / 42
identities. B15 Source A remained a normal person Entity with zero related records;
Round4 candidate and Stark non-candidate retained 23 and 11 Claims respectively.
390×844 catalog and Project layout checked; Round4 document scrollWidth equalled
viewport width 390. Unknown Project and Entity absence were checked against real
server responses. Integrity/catalog failure and delayed loading were checked via
a disposable localhost:3004 response harness outside the repo, without changing
snapshot bytes, registry or the production server contract.

The semantic audit corrected a shared error sentence that incorrectly called a
catalog failure a canonical response failure. HUMAN-003D should audit whether
users distinguish catalog registration from verified Project content, neutral
source origin from quality, stored order from importance, and selectable Entities
from knowledge richness. Hosted deployment and third-party comprehension are
not established by this checkpoint. HUMAN-003D is not started automatically.

---

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

## HUMAN-002D — Cross-Shape Explorer (current checkpoint)

The sections above document HUMAN-001 history. The current presentation consumes
HUMAN-002C's unchanged registry-resolved GET contract, with no registry/fixture
imports and no source picker. Open the three registered project/entity routes
directly. HUMAN-002C edd945421cd0bc05ca693d1aa6a47d12d74d7233 was pushed and
confirmed on origin/ground/human-002 before this implementation.

RecordPanel/FieldValue/RawView remain presentation primitives. Event and State
now have dedicated canonical record sections using the same full-field panel;
Observation retains subject_ids as an array and displays all existing fields.
Only canonical record type determines field-role notes. There are no source-key,
domain, controlled, document-kind or Historical rendering branches.

Worldline renders all existing temporal_summary fields, each ordered entry's
fields in core order, unplaced_events, and the complete raw result. Entries use
an ordered list, not a reconstructed Timeline. No sorting, Date parsing or
inferred relations occur. Scope wording distinguishes this worldline result from
all returned temporal records. State valid_until:null remains null with its
open-ended interval role explained; true/false stay literal stored values.

Transport context displays source_key and source_qualification separately from
canonical fields, with neutral source-origin wording. No confidence/trust/status
classification is inferred from controlled provenance.

Claims remain in response order. One Claim starts expanded; multiple Claims use
native details/summary with each full canonical ID and predicate visible. Every
record stays in the DOM and can be expanded, including complete raw JSON and
its unchanged per-Claim Evidence bundle. No selection, ranking, aggregation,
pagination or deduplication of canonical records occurs. The existing response's
Evidence IDs are counted in a presentation-only Set to show unique linked
Evidence for this read scope, separately from link and bundle counts.
When no bundles are returned, the UI shows only that bundle count and explicitly
states it is not the ProjectState's total Evidence count.

### Browser and semantic audit

The implementation author opened all three live routes on the dedicated
worktree server (localhost:3002); the existing HUMAN-001 server was untouched.

- HUMAN-001: the single Claim remains expanded; canonical IDs, full fields,
  provenance, confidence/applicability notes and Claim-Link-Evidence path remain
  accessible. Empty collections retain scope-only language.
- B15: Event 1, State 2, Observation 2, Claim 0, worldline entries 4 and unplaced 0
  are visible. Controlled qualification is displayed as transport metadata.
  Both bounded and open-ended State fields and literal true/false were inspected.
  The core returns the open-ended State panel first; the UI preserves that order
  instead of forcing a chronological State list. Worldline ordering stays core
  ordering. Observation 12:00 coexists with worldline latest_time 11:00.
- Round 4: all 23 Claim summaries were present and all 23 disclosures were
  actually opened. The last Claim's raw JSON was opened. The 23 links retain
  their IDs and all Evidence panels reference the single ID
  7cc1cc55-845a-55ad-ac87-1293c016c0a0. Scope counts show 23 links / unique linked
  Evidence 1. No record was omitted or replaced by a summary.
- Normal viewport and 390x844 viewport checked. B15 and Round 4 had document
  scrollWidth 390 at width 390, including all expanded Round 4 Claims. Long IDs,
  source qualification and raw JSON wrap; narrow field labels stack with values.
  Viewport override was reset after checking.
- Unknown project and entity scope mismatch were opened against the real server.
  Integrity and canonical read failure pages were opened using a temporary
  error-only server and the existing router's injection seam, without changing
  fixtures or adding canonical records. All four show explicit transport errors,
  no empty Reality or zero-record replacement.

The audit addressed three presentation risks: previously raw-only Event/State
and Worldline results, shared Evidence being mistaken for distinct records per
Claim, and 23 fully expanded Claims producing an unwieldy initial page. Dedicated
full-field panels, explicit worldline/Evidence scope wording and lossless Claim
disclosures address those risks within this checkpoint. No new canonical
semantic interpretation was found in this implementation audit. This is not an
independent third-party comprehension study.

Verification: registry 9 + HTTP boundary 18 + UI 10 = 37 tests PASS; UI-test,
adapter and core typechecks PASS; Human Interface lint and Vite build PASS;
HUMAN-001 Foundation verifier PASS. Registry tests verify all three immutable
hashes and baseline shapes. Frontend-wide lint reproduces exactly the prior
36 diagnostics. Fixture bytes, registry, HTTP/read contract, schema 0.1.25 and
core have no diff from HUMAN-002C. Core suite was not rerun for presentation-only
changes; the C verified baseline remains 3,753 PASS / 104 FAIL (missing storage
fixtures). No new failure occurred in the checks run for D.

HUMAN-002E should audit independent human understanding of qualification,
field-specific nulls, State collection order versus Worldline order, latest_time
scope, shared Evidence identity, and the cost of repeated disclosure on long
pages. Populated conflicts, unplaced/unresolved temporal cases, multi-subject
Observation browser proof, larger datasets and natural-domain populated
Event/State/Observation remain unproven by these three snapshots. No E work,
new read scope, navigation, Lens, source ranking or write/action is included.

## HUMAN-002E — Cross-Shape Semantic Audit / Explorer Core v0 Gate

**Gate: PASS — GROUND Reality Explorer Core v0**, within the three registered
proof scopes and the implementation-author audit described here. This is the
minimal common core for directly exploring different saved canonical shapes
without adding GROUND semantics. It is not a finished product, a third-party
comprehension result, or a claim that nobody can misread these screens.

The reusable [Comprehension Contract](./COMPREHENSION-CONTRACT.md) contains the
unchanged-D cold audit, per-screen answerable questions and answer key, prohibited
inferences, error probes and a future participant protocol. No independent third
party participated. The author has prior project knowledge; the cold pass used
only visible screen evidence before edits and is not a blinded study.

HUMAN-002D 96ac39bf4d4755548c1778e76f32e7c980085a4a was pushed and confirmed on
origin/ground/human-002 before auditing. All three D routes were opened before
UI changes. Cold findings: the existing qualification/null/shared-ID handling
was sound within visible evidence, but Worldline had a similar outline to
canonical sections and its scope note was distant from the Observations below.
Repeated bundles/English count labels imposed relation-vs-identity reading cost.
ENTITY_NOT_FOUND could be read as canonical absence despite being scope policy.
Full Claim/raw access worked; no new navigation framework was justified.

Minimal corrections:

- Bound the existing Worldline core result with a neutral outline; retain its
  explicit core-result label and all fields, values and ordering.
- Add a short Observation-side reminder that observed_at is not inserted into
  or substituted for the Worldline latest_time.
- Explain relation count versus unique Evidence identity count and that the
  displayed Claim-linked path does not assert Event/State evidence relations.
- Explain both 404 source/scope codes and state explicitly that read errors are
  not zero canonical records. Existing error codes and HTTP behavior are unchanged.

No qualification translation, null rewrite, temporal computation, ranking,
new disclosure behavior, new read scope or canonical field was added.

### Gate evidence

1. Three shapes use the same renderer without domain/source-key semantic branches:
   preserved cross-shape tests and actual browser inspection.
2. Canonical records, existing core read results and transport metadata remain
   separately labeled, with canonical/raw records and complete raw results.
3. Controlled qualification stays ordinary transport metadata, with no warning,
   truth, trust or confidence treatment; tests check exact value and separation.
4. State null stays literal null and its existing field-specific open-ended note;
   no unknown/missing/invalid classifier. true/false remain literal fields.
5. Worldline remains the core result, with four B15 entries in unchanged order,
   latest_time 11:00 and a separate 12:00 Observation. No all-record Timeline.
6. Round 4 preserves 23 Claims, 23 links and one shared Evidence ID, with no
   canonical aggregation, representative selection or record identity rewrite.
7. Claim-linked bundle zero and rejected scope never assert Project/Reality
   absence. Project-wide Evidence is not read or displayed.
8. Every canonical record/raw result remains accessible. First/last Claim,
   raw, Evidence, close and next-record operations were exercised again.
9. All four error screens remain alerts with no canonical content or successful
   empty response. 404s were checked on the actual server; 503s used the unchanged
   router's error-only injection seam, without fixture modifications.
10. HUMAN-001 retains label, identity, Claim/Link/Evidence path, confidence 0.95,
    provenance, applicability, schema values and scope zeros; regression passes.
11. No unresolved blocking semantic bug was identified in this bounded audit.

After corrections, all three screens were re-opened at 390x844; width and
scrollWidth were both 390. Field/value pairing, full IDs, link identity and raw
JSON remained available. The viewport override was reset. Round 4 retains all
23 summaries; first Claim/raw/Evidence can be opened, closed, and the last Claim
reached. Shared Evidence ID was checked across those bundles. No collapse-all or
new navigation was added because native per-record disclosure supported these
operations. Repeated opening and technical terms remain usability limitations.

Verification: 40 tests PASS (all prior 37 plus 3 semantic wording tests): registry
9, HTTP 18, UI 13. UI-test/adapter/core typechecks, Human Interface lint, Vite
build and Foundation verification PASS. All three fixture bytes and hashes are
unchanged from D. Frontend-wide lint exactly reproduces the existing 36 errors.
Schema/core/registry/HTTP contract have no diff. Full core suite was not rerun:
C's verified 3,753 PASS / 104 FAIL (missing ignored storage fixtures) is the
baseline; no core change occurred. No new failure in E's executed checks.

Remaining unproved: independent human comprehension, populated conflict/unplaced/
unresolved temporal cases, multi-subject Observation browser proof, larger
Realities, natural-domain populated Event/State/Observation, arbitrary Entity
browsing and additional reference scopes. The controlled snapshot remains
controlled; Historical Round 4 is not a substitute for populated temporal proof.

Next-phase candidates only: run an independent participant study using the fixed
contract; obtain a naturally sourced canonical injection with currently unproved
shapes; separately design a future read scope if wider Entity/Evidence access is
wanted. No HUMAN-003, new Lens, source selector, ranking, summary, write or action
work is started by this gate.
