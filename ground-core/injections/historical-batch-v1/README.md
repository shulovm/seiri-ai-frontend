# LIVE-004B — frozen stored-inspection batch

No live publish or Human Interface change. Target 088d09dc-dfc5-487a-8f8f-22d2b33a9249.
FRUS 393/394/396 only. The experimental Round1 `claims` array is input inspection
report material, never canonical Claim authority. One Document, textual Observation,
and observation_ref Evidence per selected report. Original 392 records/IDs unchanged.
Shared `../stored-inspection.ts` composes both 392 and this batch; package-specific
input selection and explicitly approved content remain frozen. No generic predicate
translation, new actors, quotations, truth scores, events, or states.

## Identity and input

Namespace historical-stored-inspection-v1. UTF-8 hash input (NUL is one zero byte):
`projectId + NUL + namespace + ':' + roleKey`.
Role keys are `document:<sourceId>`, `inspection-result:<sourceId>:<reportId>`,
`inspection-evidence:<sourceId>:<reportId>`. SHA-256 hex h is formatted as
h[0:8]-h[8:12]-5h[13:16]-ah[17:20]-h[20:32]. This is the existing SHA-256
UUID-shaped algorithm, not RFC UUIDv5. No clock or batch execution ID in seeds.
Selection artifacts preserve the complete actor dictionary for reporting-chain
context, one source/report and linked experimental relations. Actors/relations are
not projected. Object keys sorted recursively; arrays preserved; compact UTF-8 JSON
plus LF. Full source and selected hashes are asserted on every input read.

## Temporal and review authority

Source dates: 393 Feb6; 394 Feb7 (expected departure Feb12, not occurrence);
396 Feb11 (reported declaration Feb10). Access date 2026-09-14 is day precision.
Exact inspection instant unavailable. observed_at stays null. Provenance points to
round1.dataset.json#claims/<report-id>; no invented researcher Entity.
Final recorded_at is UNBOUND. DRY_RUN 2000-01-01T00:00:00.000Z is deliberately
validation-only. Candidate created_at/updated_at in dry-review.json are dry bindings,
not hashes of future published records. applyPatch independently produces its real
execution updated_at; those clocks are never rewritten. Runtime audit verifies the
memory result. Reproducible candidate audit excludes execution-clock outputs.
Full final record hashes must include every timestamp, including core updated_at.
Only comparison with the expected composition disregards its provisional updated_at;
the receipt's full hash comparison never does.

## Preflight and future owner procedure

READY requires all three NOT_APPLIED. All EXACT is NO_OP (no mutation/save).
Mixed or any PARTIAL_OR_DIFFERENT is HOLD, including missing/mismatched receipts,
URL/source collision, extra references, content/provenance differences. No repairs.
Future LIVE-004C must verifyFreeze and pinned Git commit, acquire ground-local-cli-v0
owner, load latest exact snapshot, require expected before hash, rerun preflight,
write exact before bytes and prepared receipt outside Project discovery, bind final
recorded_at, compose all nine records, applyPatch + audit + canonical validation,
then one atomic save. No document-by-document save. This package has no save API.
Owner release and independent exact snapshot read follow. A completed receipt needs
full record hashes and actual after fingerprint; prepared fields are not completion.

Preserve title/summary/status/Project ID/current_state and unrelated semantic fields.
Only project.updated_at and state.updated_at may change under core mutation contract.
Existing 392 records must remain exactly unchanged. Delta +3 entities/+3 epistemic
observations/+3 evidence, everything else zero.

## Prepared receipt and recovery

prepared(commit, hash) creates the exact format; validatePrepared rejects missing,
extra or changed fields. Actual package commit/hash must be verified by the future
owner orchestrator (format validity alone is not authority). after fingerprint,
final recorded_at, final record hashes and independent read remain UNBOUND.
Future completion should additionally capture execution time, validation results,
before/after fingerprints and per-document preflight. Persist a prepared journal
before rename; interruption between rename and receipt completion requires explicit
owner reconciliation against bytes, never blind reapply or automatic rollback.
backup accepts exact baseline bytes and creates an exclusive read-only .bytes file
outside live root. No live backup was written inside canonical discovery. Existing
backup is not overwritten. Recovery requires explicit owner control, not per-record
rollback. Atomic rename is not a new fsync/power-loss durability guarantee.

## Reproduction

From repository root, run:
`node --import tsx ground-core/injections/historical-batch-v1/dry-review.ts '<absolute live root>'`
This loads the canonical snapshot once, verifies expected fingerprint, runs memory
mutation, and rechecks raw live bytes without acquiring owner. Output matches the
tracked dry-review.json. Drift is HOLD, never restoration of old state.

package-fingerprint.json hashes the declared source, implementation, tests, selection,
and dry-review files. Aggregate hash is SHA-256(stableSerialize(files)); manifest
itself excluded. Git commit is an independent enclosing identity, recorded externally
rather than embedded in its own hashed bytes. New package commits require refreeze.
