# LIVE-003B — FRUS 1904 document 392 review package

**FROZEN FOR REVIEW, NOT APPROVED FOR PUBLISH.** Confidence and proposition
applicability policy remain blocked. No live writer, owner acquisition, source
download or Human Interface registration is provided by this package.

## Tracking and single implementation

The original Round1 dataset and substrate were previously untracked in
`/private/tmp/ground-rj-round13`. This checkpoint adopts exactly that full dataset
and the shared substrate at their existing relative Historical tree locations.
No Round13/15 dataset, replay driver, TEI asset or unrelated Historical implementation
is imported. The only record-construction function remains
`projectSourceAssertions` in `../../experimental/historical-reality/substrate.ts`.
The package selects input and audits the generated patch; it does not recreate or
rewrite records in a second projection implementation.

The upstream substrate hash is in manifest.json. The tracked modification adds an
explicit policy argument to this same function (and a range check); omission keeps
the old experimental behavior for compatibility. The live-review path always
passes explicit policy. The source function must not be called with omitted policy
for live adoption. Both upstream and modified hashes are distinguished.

Imports are Node crypto, core types/SCHEMA_VERSION; validation and ID helpers are
in the same substrate file. Existing applyPatch/normalize/validators/readers and
schema 0.1.25 come from baseline 03bfe7198571f3c3353816e4243a8ac19229d8c5.
No schema, canonical reader or core mutation semantics changed. The new Git commit
containing this package, rather than the upstream untracked worktree HEAD, is the
reproducible implementation checkpoint. Subsequent experiments should reuse the
tracked implementation; the old outside-worktree copy is not a second live path.

## Input and qualification

Full Round1 SHA-256:
`5bc32592aa80ee4742f8e01b09d4381dacc1ce080fb930772a7a1ea2b24c70c2`.
Selection: exact source `frus:1904:392` and claim `c392-instruction`; require the
claim to reference that source. Preserve both objects byte-content-equivalently
as parsed values, preserve the original actor dictionary, and retain only
source/claim-matching evidence relations and actor epistemic records. Reconstructed
propositions, interpretations and narratives are not selected. Full original
input remains tracked so exclusions, unknowns and provenance context are not lost.
Selected serialization is deterministic UTF-8 JSON: recursively sorted object
keys, original array order, no extra whitespace and one trailing LF. It is a
package serialization rule, not a new canonical ProjectState representation or
an assertion of RFC 8785 compatibility. selected-input.json and its manifest hash
are checked against a fresh selection from the hash-pinned full dataset.

The input is a stored Historical dataset representing an inspected edition and
researcher-authored paraphrase, not raw original telegram bytes. It asserts what
the inspected source says, not that instructions were delivered or acted on.
Official hosting does not independently authenticate the historical original.
The Round1 excerpt is not a full document capture. Later stored TEI bytes were
corroborating material in LIVE-003A, not the Round1 web capture; no equivalence is
asserted, and no new Claim is extracted from TEI in this checkpoint.

## Semantic policy audit — two unresolved gates

Claim.confidence in core types.ts is required epistemic confidence in [0,1], not
importance/authority. The number may concern the asserted source-content
proposition, but core does not supply a calibration, a default 0.95, or evidence
supporting that particular estimate. The old projection's 0.95 is an experimental
convention. Null is schema-invalid; neither zero nor 0.5 is an unknown sentinel.
Replacing 0.95 with another unsupported number would not solve this problem.
The review candidate retains 0.95 only to make the legacy proposal inspectable.
It is explicitly unapproved. A justified epistemic assessment or a separately
approved core capability for unspecified confidence is required; this checkpoint
does not invent either or relax the schema.

Claim.applicable_from/until are proposition applicability, not ingestion time.
The existing belief reader defines [from, until), null from = no lower bound,
null until = no upper bound, both null = always applicable. Null is NOT unknown.
It never substitutes recorded_at/created_at. See types.ts Claim,
reality/belief.ts:isClaimApplicableAt, and GROUND_V0.7_BELIEF_RECONCILIATION.md.

The review candidate removes ingestion-as-applicability and uses null/null to
expose a possible unbounded document-content proposition. This is not approved
merely because schema validation succeeds. Its meaning must be explicitly accepted
as a claim about the fixed edition's content without temporal bounds, or a
different justified applicability policy is needed. If unknown applicability is
required, null/null cannot encode it under current readers. No 1904 date, midnight
or TEI date range is substituted. Tests explicitly demonstrate applicability even
at 1800 and 2100 for the candidate so this risk cannot be hidden.

recorded_at is the proposed recording timestamp; source historical time stays in
the selected input. dry-review.json uses the actual dry execution clock only as
an inspection value. Future approved ingestion must fix and review its own
recordedAt. Operations execution_time is a separate metadata field. applyPatch
sets canonical updated_at using its execution clock; exact whole-state bytes are
not deterministic from source and target ID alone. No timestamps are overwritten
after core mutation to fake deterministic output.

assertPublishPolicy always rejects this package as
BLOCKED_CONFIDENCE_AND_APPLICABILITY_AUTHORITY. NOT_APPLIED preflight does not
mean permission to publish. There is no approved patch or live execution path yet.

## IDs, delta, provenance

IDs are deterministic SHA-256-derived UUID-shaped identifiers from Project ID,
NUL and source/claim key, with fixed formatting bits. This is not standard UUIDv5
(SHA-1). Keys are source ID, evidence:<source>, claim ID, link:<claim>. Execution
time is not an input. The target Project is
088d09dc-dfc5-487a-8f8f-22d2b33a9249; experimental Project IDs are not reused.

Expected patch: document RealityEntity, external_ref Evidence, attribute Claim
with inspected_source_assertion predicate, SUPPORTS ClaimEvidenceLink. Exactly
one of each. EpistemicProvenance is embedded in Claim/Evidence, not a fifth record.
Provenance retains document Entity reference and external source ID; Evidence URL
and summary locator, Claim extraction context, and legacy experimental identity
keys are preserved, not relabeled as proof of live authority. Claim/Evidence link
supports the source-content proposition, not automatic historical truth.
No RealityEvent, RealityState, EpistemicObservation or legacy Observation is made.
Project title/summary and current_state remain unchanged. Core project/top-level
updated_at changes in the memory preview are normal mutation bookkeeping.

## Dry review

Run from this checkout with an explicit absolute existing root:
`node --import tsx ground-core/injections/frus-1904-392/dry-review.ts <root>`.
The command prints a report to stdout only. It does not acquire an owner or call
saveProject. The checked-in dry-review.json is the observed non-publishable patch,
full memory-applied records, timestamps, validation and before/after live hashes.
It is an audit artifact, not a publish input or an expected future live hash.
Fresh generation will have different timestamps. The script requires the exact
bootstrap fingerprint and verifies it again after memory projection/apply.

## Idempotency design and preflight

The tested preflight function is side-effect-free. NOT_APPLIED means all expected
IDs are absent and no contradictory receipt exists. Four types/IDs must belong to
the target; cross-collection ID collisions fail closed. ALREADY_APPLIED_EXACT
requires all four expected payloads/refs plus an owner-controlled completion
receipt containing exact hashes of all four committed records. These hashes
include every canonical field, including core-generated updated_at. Comparison
of patch payloads excludes only updated_at because core supplies it; the receipt
hash still compares it exactly. recorded_at and created_at are not ignored.
Partial records, changed fields/times, a missing receipt, or inconsistent receipt
are PARTIAL_OR_DIFFERENT. No save is performed by preflight in any case.

Before a future first publish, run preflight and validate the full expected
record set under the owner session after reading the latest snapshot. A semantic
source-key collision under unexpected IDs or changed input/policy additionally
requires an explicit conflict review, not inferred permission from NOT_APPLIED.
Blind reapply is prohibited: upsert would change canonical timestamps. If publish
succeeds but receipt finalization fails, the next attempt must fail closed and
reconcile evidence; it must not create another injection or automatically reapply.

## Future publish receipt and recovery (design only)

Use a Git-external owner-managed operations directory beside, not inside, the
Project discovery directory. Receipt fields:

```json
{
  "target_project_id": "088d09dc-dfc5-487a-8f8f-22d2b33a9249",
  "before_fingerprint": "exact read SHA-256",
  "after_fingerprint": "exact committed read SHA-256",
  "full_dataset_sha256": "manifest pin",
  "selected_input_sha256": "manifest pin",
  "projection_code_commit": "actual executing committed package",
  "projection_sha256": "manifest pin",
  "source_id": "frus:1904:392",
  "claim_input_id": "c392-instruction",
  "generated_record_ids": {},
  "record_fingerprints": {},
  "approved_patch_sha256": "exact approved serialized patch",
  "recorded_at": "explicit approved ingestion timestamp",
  "execution_time": "operations execution clock",
  "writer_owner": "ground-local-cli-v0",
  "semantic_policy": {"version": "future approved policy", "decision": "explicit decision and rationale"},
  "validation": {"patch": true, "state": true, "independent_read": true}
}
```

Before any future save, retain the latest exact snapshot bytes in an exclusively
created 0600 operations backup and verify its hash, together with approved patch,
input/code identities and authorization. Root/operations parent must be private
and owner-managed. Record a prepared operation before publish, then finalize a
completion receipt only after read-back verifies the committed state. This is not
a transaction between receipt and Project file; failures require reconciliation.
No such backup or receipt is written to live operations during LIVE-003B.

Recovery requires current fingerprint verification, checking subsequent writes,
and explicit approval. Retained bytes are comparison/recovery material, not an
automatic restore instruction. Later valid writes cannot be blindly overwritten.
Any restoration or corrective patch must use the owner and atomic persistence
contract; no direct final-file copy, automatic rollback, CAS claim or new revision.
STORAGE-002's absence of fsync durability remains unchanged.

## LIVE-003C readiness

Package tracking and dry compatibility are established. Live publish is HOLD
until confidence and applicability decisions are justified and approved, the
tracked policy/patch is updated and re-reviewed, and receipt/recovery/preflight
execution is implemented and tested under owner control. No Human Interface
connection, source registration, Event/State/Observation injection or automatic
LIVE-003C advancement occurs.

## Verification at freeze

Dedicated package/semantic/preflight tests: 11/11 PASS. Full core: 3,898 tests,
3,794 PASS / 104 FAIL; STORAGE-003 was 3,783 PASS / 104 FAIL. The same 104 failing
test names remain, with no new failures and no missing fixture restoration.
Core and existing Human Interface adapter typechecks, frontend build and diff
whitespace check passed. No Historical replay script was run.

The live bootstrap was read twice around dry projection and remained exactly
`724f01bfdeeed0414d8e1c360195b84439ce9e30f15cb35909a7f5aca0b0f169`.
Tests reject filesystem mutation primitives during dry generation/apply. The
checked-in preview contains exactly four new records in memory and zero new
Event/State/EpistemicObservation/legacy Observation. Actual live collections
remain empty. Policy review is deliberately not a claim of publish readiness.
