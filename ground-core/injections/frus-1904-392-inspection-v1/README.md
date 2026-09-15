# SEMANTIC-002 — FRUS 392 Inspection Observation Composition Gate

Status: **composition fixed for review; UNPUBLISHED**. This version records a
stored inspection result, not a Claim with inconvenient fields removed. No live
writer, owner acquisition, source download or Human Interface change is supplied.
The old Claim candidate at ../frus-1904-392 remains byte-for-byte unchanged as an
UNPUBLISHED audit artifact at commit 25ba36665c1034c1317e7556abea007bb08da539.

## One-sentence meaning

According to the inspection report preserved in the Historical dataset, a
researcher-authored paraphrase about this Document's content is recorded as an
inspection result.

This is neither a declaration that the paraphrased historical proposition is
true, nor that the instruction was executed, nor a new direct inspection of the
original telegram by this projection process. Independent authentication of the
historical original is not claimed. Canonical separation is structural: a textual
EpistemicObservation about a document, no actor subject, no Claim, Event or State.
The epistemic record can itself be incomplete or wrong; validation is not truth.

## Frozen input / selection / version boundary

Reuse the exact full Round1 dataset and selected input adopted by LIVE-003B:

- Full SHA-256: 5bc32592aa80ee4742f8e01b09d4381dacc1ce080fb930772a7a1ea2b24c70c2
- Selected SHA-256: 2c4f2e2b9e4530d077087994e043e42920d79621c704ec8dc05a48f6a7fd849d
- Source ID: frus:1904:392
- Historical input key: c392-instruction (an external dataset key, NOT a live Claim)

The existing loadFrozenInput only checks hashes/selection and calls dataset
validation. projectSourceAssertions and buildReviewPatch are not used. Selection
keeps source/report values and the original actor dictionary; no actor is created
in the target. There is no new extraction from TEI. Later official TEI bytes are
not the Round1 web capture and are not this composition's input.

The full source remains available for access_date, completeness, authenticity,
unknowns, report-chain and extraction context. The new manifest names the shared
immutable input, new policy version, ID keys and projection fingerprint. A new
version is needed because the canonical meaning and record types differ. We do
not edit the old candidate or relabel its Claim/Evidence IDs as observations.

## Exact Document mapping

Existing RealityEntity fields, unchanged schema:

- id: project-scoped deterministic document key (manifest).
- project_id: 088d09dc-dfc5-487a-8f8f-22d2b33a9249.
- kind: document (existing open taxonomy, no enum added).
- label: source.title, exactly FRUS 1904, document 392.
- attrs.source_id: source.id, frus:1904:392.
- attrs.url: source.url, https://history.state.gov/historicaldocuments/frus1904/d392.
- attrs.locator: source.locator unchanged, including unknown page status/reason.
- created_at/updated_at: explicit recording binding, with updated_at subsequently
  assigned by existing applyPatch mechanics.

attrs is the existing identity-bearing property bag. source_id/url/locator are
application attribute keys describing the inspected edition's document identity,
not new top-level schema fields or authority declarations. They do not establish
that the mutable URL's current bytes equal the stored inspection input, nor that
this Entity is the authenticated original telegram. No inspection result, hash,
process ID, mutable condition or operational status is put into identity attrs.
The document is FRUS edition document 392 as referenced by the stored report.
Provenance below identifies the dataset report, a different source role.

## Exact Observation mapping

- id: deterministic inspection-result key, not the old Claim ID.
- project_id: the live target above.
- kind: textual. EpistemicObservation.kind is an open string, with textual named
  as a modality in core types.ts; no new Historical-specific enum is introduced.
- subject_ids: only the Document Entity ID.
- content, exactly:

  Recorded researcher-authored paraphrase: Japanese minister at St. Petersburg — instructed to present termination note and break diplomatic relations.

This deterministic rendering combines the existing actor label and report.object
with the inspected input's instructed_to predicate; the package checks that exact
predicate and researcher_paraphrase status. The historical actor occurs inside
the paraphrase text, not as the observer or an Observation subject. The phrase
“Recorded researcher-authored paraphrase” qualifies the content concisely; it is
not an exact quotation. No hashes, execution timestamps, calibration values or
long operational disclaimers are embedded in content. The actor-label dictionary
is input context, not new canonical actor records.

- observed_at: null. The actual inspection instant is not established. The
  access_date 2026-09-14 is day-granular and does not authorize midnight, an offset,
  a current-process time or a historical source date.
- recorded_at: an explicit future owner-controlled recording-time binding.
- created_at: same recording binding on first creation.
- updated_at: supplied to the patch, then existing core applyPatch stamps it.
- provenance: { kind: document, external_id: round1.dataset.json#claims/c392-instruction,
  label: Stored Historical Round1 inspection report; researcher-authored paraphrase }.

The external_id is a documented external record locator: claims entry whose id is
c392-instruction in the pinned full dataset. It is not a JSON Pointer (claims is an
array), not a person ID and not a live Claim reference. The manifest/receipt pins
which exact dataset bytes this identifier means. provenance.entity_id is omitted:
no dataset Entity or researcher Entity exists, and pointing it at the inspected
FRUS Document would confuse the report's source with its subject. EpistemicProvenance
explicitly permits sources that are not RealityEntities. Source-kind document
means the saved report is the provenance source; it does not name its observer.

## Evidence and source mapping

One standalone Evidence:

- id: deterministic inspection-evidence key.
- project_id: live target.
- kind: observation_ref.
- observation_id: the new Observation ID (strict existing canonical reference).
- external_ref: null.
- summary: Reference to the recorded document-inspection result.
- provenance: same report provenance as Observation, preserving source lineage
  for the independently addressable Evidence record.
- recorded_at/created_at: the same explicit recording binding.
- updated_at: existing applyPatch output.

Evidence makes the inspection result referenceable by future explicit Claim
links; it does not assert support for an absent Claim. Standalone Evidence is
allowed by existing core validation/tests. EpistemicProvenance is embedded, not a
fourth independent record. There are zero ClaimEvidenceLinks.

A separate external_ref Evidence is unnecessary: external source ID, URL and
locator have a canonical identity-bearing home in the Document attrs. Evidence's
role here is reference to the inspection result. An external_ref Evidence should
be added only if a separately justified external-evidence record is required or
identity/reference retention cannot be achieved under the existing contract.
There is no inferred Evidence-to-Evidence relation.

source URL/locator/source ID appear in Document.attrs once. The report locator
and paraphrase qualification appear in provenance; this locator identifies the
report rather than duplicating the source document URL. Original extraction.context
(e.g. instruction is not proof of delivery), extraction status, report chain,
access_date and completeness/authenticity limits stay in the pinned input and in
operations source qualification. There is no canonical extraction_context field
on Observation; it is not smuggled into attrs or a made-up provenance property.
The source remains inspectable through the exact manifest/receipt bindings.

## Recording time / dry-run policy

Projection has no clock and requires an explicit timestamp, validated with the
existing canonical temporal helper. For a future approved injection, acquire the
owner, load the latest snapshot, run preflight, then acquire one timestamp when
accepting this result for canonical recording. Retain that binding in the prepared
operation and use it for the Observation/Evidence recording fields and initial
creation fields. It is not the source time, inspection instant, exact rename
completion time, or a general current-world time. Record operations started_at,
projection_executed_at and publish/readback times separately; numeric equality
of any timestamps would not merge their roles.

The dry driver uses the actual dry execution clock only as a labeled
VALIDATION-ONLY binding so existing non-null timestamp schema and applyPatch can
be exercised in memory. dry-review.json explicitly leaves final_recorded_at
UNBOUND. Its validation_only_patch is not a future approved publish patch. No
final recorded_at has been invented, reserved or authorized. Final construction
requires its own owner-controlled binding and approved input/version. Tests use
fixed test clocks, which also have no live authority.

## Deterministic IDs

IDs use SHA-256(projectId + NUL + semantic key), with the inherited UUID-shaped
formatting convention. This is not RFC UUIDv5/SHA-1. Neither timestamp nor observer
identity enters the key. The versioned keys are in manifest.json.

- Document: fbdfd235-1a5b-5a5d-ad30-6f2c170fe9f9
- Observation: 87ae62f9-9481-5577-a299-813c022d2007
- Evidence: 3151b313-d5bc-5b58-a17d-a61add22f22d

Different keys from the UNPUBLISHED candidate deliberately prevent retaining an
old ID with a changed record role/mapping. Same input/target/key gives the same
IDs; clocks change timestamp fields, not IDs. No old experimental Project ID is
reused.

## Three-way preflight and receipt (no publishing here)

NOT_APPLIED requires no expected records, no same-source identity conflicts,
no unexpected related records and no contradictory completion receipt.
ALREADY_APPLIED_EXACT requires all three IDs, exact semantic payloads and a matching
completion receipt. Compare recorded_at/created_at/observed_at exactly. Only
updated_at comes from core mutation rather than the expected patch; it is still
verified by the receipt's full-record SHA-256. Extra fields are differences.
Partial sets, differing content/provenance/times, alternate same-source Entity,
extra related Observation/Evidence/Event/State/Claim/Link or cross-collection ID
collisions produce PARTIAL_OR_DIFFERENT. Unrelated Project records may coexist.
A missing completion receipt never authorizes a reapply to existing records.

The future owner receipt must include project ID, package commit and code hash,
policy version, full/selected input hashes, three generated IDs, approved recording
binding, source qualification, before/after exact snapshot hashes, execution time,
writer identity, validations and full committed record hashes. CompletionReceipt
in composition.ts is only the subset consumed by preflight, not a publish log.
Preflight never saves. NOT_APPLIED is eligibility to consider an operation, not
publish permission; ALREADY_APPLIED_EXACT means return without save.

Before a future publish, retain before exact bytes and prepared operation in the
private Git-external owner operations area, as designed in LIVE-003B. If publish
succeeds but completion receipt fails, fail closed and reconcile; do not regenerate
a new recording clock and blindly upsert. Recovery needs current fingerprint,
subsequent-write review and explicit approval. No auto rollback, stale lock cleanup,
CAS or new durability guarantee is implemented.

## Existing Human Interface read scope

At this baseline, createHumanRealityReader reads Document worldline, then
getObservationsForSubject and getClaimsForSubject. The new Observation and its
provenance would be returned, and generic RecordPanel/RawView can display them.
Claim/Event/State counts would be zero. Nothing requires Historical-specific UI.
Actual live Project registration/connection is still absent and is not added here.

Evidence is currently fetched only through getEvidenceForClaim. With no Claims,
evidence_for_claim is empty even though this composition has one Evidence. That
is a read-scope limitation, not evidence absence. A future read-scope task should
use explicit observation_id equality and project scope to expose observation_ref
Evidence; no relation may be inferred from labels, content or provenance text.
Do not add a Claim or external Evidence to make the current screen show a bundle.
The existing UI labels claim-linked bundles, so that scoped zero is not a global
Evidence count. No UI or reader was changed in SEMANTIC-002.

## Gate result

The approved direction has an existing-schema three-record representation. No
confidence or applicability value is needed because the record is an inspection
result, not an assessed proposition. No schema gap is required for this bounded
composition. Exact observer identity and inspection instant remain unspecified;
full report provenance/reproducibility is anchored by external operations metadata,
not falsely claimed as a rich structured canonical provenance graph.

LIVE-003C remains HOLD until this exact mapping is accepted and the owner-controlled
publish, prepared/completion receipt, backup and independent read procedure is
implemented/tested and explicitly authorized. No live save, Claim projection,
Historical Event/State generation, TEI extraction, source download, Human Interface
registration or automatic checkpoint advancement occurred.

## Verification at freeze

Dedicated tests: 13/13 PASS, covering mapping/content/provenance, null observed_at,
explicit timestamp requirement, standalone Evidence, 0.1.25 validation and exact
three-record delta, deterministic IDs, all three preflight states and conflict
cases, canonical subject readers, and no filesystem mutation during projection.
Full core: 3,911 tests, 3,807 PASS / 104 FAIL. LIVE-003B baseline was 3,794 PASS /
104 FAIL; all existing failure names match, with no new failures or missing-fixture
restoration. Core and existing Human Interface adapter typechecks, frontend build,
manifest code hash and git diff --check passed.

Live before/after fingerprint remains
724f01bfdeeed0414d8e1c360195b84439ce9e30f15cb35909a7f5aca0b0f169.
Actual live collections remain empty. The old Claim package and shared Historical
files have no diff against the parent checkpoint. Only this version's files and
its tests are new. Full core tests and dry review never invoke live publish.
