# LIVE-005B — Multi-Observation Batch Package Freeze

Status: DRY PACKAGE ONLY. No live writer, owner acquisition, save, restore, network download or UI change. Authoritative input is the pinned stored inspection report, not an authenticated historical event. Schema remains 0.1.25.

## Frozen scope and authority

Target 088d09dc-dfc5-487a-8f8f-22d2b33a9249. Before exact-byte hash:
`f45b265afb6f4d9165ac46aa26eb1f16d82bbf94a3739212421bca93463e830b`.
Round1 input:
`5bc32592aa80ee4742f8e01b09d4381dacc1ce080fb930772a7a1ea2b24c70c2`.

The tracked discovery-source.md is the exact LIVE-005A report. Its source sections pin all 12 selected-input hashes, approved content candidates and 31 IDs. inputs() recalculates all selections and IDs and compares each against that artifact. Twelve selected JSON files preserve the LIVE-004 selection method: actor dictionary, one source/report, source/report-matched relation/actor-report records, empty reconstructions/interpretations/narratives. No actor, Claim or experimental reconstruction becomes canonical. Full dataset stays pinned for context omitted from selections.

Groups: 395 (3 reports), 678 (2), 679 (1), 680 (1), 86 (1), 430 (3), 815 (1). Source date/access date/report-chain/extraction caveats remain in selected inputs; no new temporal fields or provenance model. observed_at is null for all 12 because exact inspection instant is unknown. Source/content/access dates never substitute for it. Final recorded_at is UNBOUND until an authorized future recording transaction. DRY_RUN=2000-01-01T00:00:00.000Z is explicitly a validation binding, not a historical/inspection instant.

Content is verbatim from the approved LIVE-005A candidates, prefixed Recorded researcher-authored paraphrase. It is not an exact source quotation. 395 preserves reported fate/allegation; 678 preserves nested attribution and no-positive-knowledge, not canonical actor knowledge; 679 does not equate possession with receipt; 680 preserves translation and double date without new translation/calendar resolution; 86 preserves instruction/preference; 430 separates consent assertion/protocol guarantee/conditional permission; 815 preserves reported demand without inquiry findings.

## Composition and identity

Reuse ../stored-inspection.ts unchanged, also used by prior packages. Each report calls that sole semantic composer; identical Document operations are asserted equal and emitted once per source. No canonical core abstraction/type is added. 7 Document operations + 12 Observation operations + 12 observation_ref Evidence operations = 31. Each subject_ids contains only its source Document. Each Evidence independently references its own Observation, external_ref null. Document attrs retain source ID/URL/locator. Report provenance kind=document, external_id=round1.dataset.json#claims/<report ID>, existing researcher-paraphrase label; no invented observer identity.

Namespace historical-stored-inspection-v1. Document key=document:<source ID>; Observation key=inspection-result:<source ID>:<report ID>; Evidence key=inspection-evidence:<source ID>:<report ID>. Existing project-scoped SHA-256-to-UUID-shaped formatting, no timestamp input and no standard UUIDv5 claim. 392 keeps its older namespace and is untouched. New inputs() asserts all 31 IDs distinct; preflight detects existing identity/reference collisions.

Expected delta +7/+12/+12; final totals 11/16/16; Claim/ClaimEvidenceLink/Event/State/legacy Observation remain 0 for the actual live baseline. Every old record is retained byte-for-byte at the object-value level. Project ID/title/summary/status/current_state and all unrelated fields unchanged; only project.updated_at and top-level updated_at may advance. Newly created records receive existing applyPatch updated_at mechanics; dry review hashes candidate payloads, not a falsified final mutation timestamp.

## Exact preflight scope

Seven source groups are classified independently. NOT_APPLIED means no record touches an expected ID, exact source ID/URL or exact report locator. ALREADY_APPLIED_EXACT requires Document plus complete expected Observation/Evidence sets, correct collections, exact composition (updated_at separately bound by receipt full-record hashes), validated completed receipt and current package fingerprint. Missing/extra/changed records, duplicate identities, cross-collection IDs, altered content/provenance/refs or incomplete receipts fail closed.

For this initial batch, any array record containing an exact selected ID/source ID/URL/report locator anywhere in its fields is inside conflict detection scope. Thus an unexpected Observation subject pointing at a selected Document, even with another report locator, is HOLD. Unrelated records outside those exact references may coexist, including future Observations of other Documents. This conservative initial-package rule is not a permanent core prohibition on future reports: adding reports to these Documents later requires a separately authorized extension package and corresponding expected membership, not reusing this closed batch.

All seven NOT_APPLIED => READY (only with no completed receipt). All seven ALREADY_APPLIED_EXACT => NO_OP. Mixed/partial/different => HOLD. Receipt accompanying entirely absent batch => HOLD. READY does not grant publish permission. Canonical validation is not a truth judgment.

## Review and receipt

selection-manifest.json lists seven groups, 12 contents/hashes and all IDs. dry-review.json provides complete 31 canonical candidate payloads with individual dry hashes, grouped by Document, plus actual-live preflight and independent read-contract checks in memory. No candidate state is published.

prepared(commit, fingerprint) fixes batch/project/before hash, dataset and 12 selection hashes, commit/fingerprint, source/report/record IDs, exact expected report sets, per-document NOT_APPLIED, READY, delta, allowed metadata and owner ground-local-cli-v0. after_fingerprint, final_recorded_at, final_record_hashes, independent_read remain UNBOUND. validatePrepared rejects extra/altered fields and verifies actual frozen files. Completed receipt includes prepared data, final recorded_at, all 31 full-record hashes, after fingerprint and matching independent-read fingerprint. It is an owner operations artifact, not a canonical record or signed proof. Authorized Git commit must be matched externally to user-approved checkpoint at future publication; syntax checks do not establish that approval.

verifyFreeze checks pinned dependency/file hashes. Manifest excludes itself and commit-specific receipt/verification logs to avoid hash cycles. Package fingerprint is not a Reality identity/revision. Reproducibility concerns inputs, IDs, grouping and candidate semantics; actual applyPatch clock fields remain execution-bound.

## Future atomic publish and recovery (not performed here)

After separate approval: verify approved Git commit + package fingerprint; acquire ground-local-cli-v0 session; load latest exact snapshot and require BASELINE, validation and all-seven READY; bind one final recorded_at; prepare receipt; back up exact before bytes outside canonical discovery; compose once in memory, validate delta/old records/refs, then one atomic save. Never save per Document. After save, read exact snapshot and full-record hashes; release owner, independently read, require matching after fingerprint, complete receipt. Exact already-applied batch + matching owner receipt => return without save.

backup() verifies expected exact hash, requires absolute external operations directory, resolves physical parent paths to reject symlink aliases into discovery, writes exclusive wx/read-only bytes, rechecks hash. dry-review.ts tests success and overwrite/wrong hash/contained-path/symlink rejection in a disposable temporary operations directory using the single acquired snapshot bytes. No real owner operations area is changed. This does not add an adversarial filesystem race guarantee or a new storage durability guarantee.

If publish succeeds but completion logging fails: HOLD, preserve backup/prepared data, reconcile current bytes and subsequent writes. No auto rollback, stale lock deletion or blind retry. Before hash changes => HOLD, never reset live state.

## Verification commands

From this worktree:

```sh
node --import tsx --test ground-core/__tests__/historical-expansion.test.ts ground-core/__tests__/historical-batch.test.ts ground-core/__tests__/inspection-composition.test.ts ground-core/__tests__/historical-injection-freeze.test.ts
npx tsc --noEmit -p ground-core/tsconfig.json
node --import tsx ground-core/injections/historical-expansion-v1/dry-review.ts '/absolute/canonical/live/root' '/absolute/HUMAN-006B/worktree'
```

Optional third argument is the externally approved package commit for prepared receipt validation. The Human Interface path imports its existing adapter read-only and supplies the memory-only dry state through its existing server-side resolver seam. It does not register a live/proof source, save a fixture, start a server or modify UI. The review records the adapter hash; all eleven Entities, 3/2/3 Observation groups and one Evidence per Observation are checked. Existing 392 and LIVE-004 regression suites/freeze remain required.

One batch remains reviewable as seven bounded groups. No concrete reason for splitting was found. LIVE-005C stays HOLD pending approval of this exact package and owner publish procedure. This checkpoint alone does not execute or authorize publication.
