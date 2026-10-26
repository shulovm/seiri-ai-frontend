# LIVE-005B Verification — 2026-09-16

Branch: ground/live-005b. Worktree: /private/tmp/ground-live-005b.
Parent: b361136 (ground/live-004b). No modification of old package files, shared semantic composer, UI, server API or canonical schema. Additive package and tests only.

## Freeze gate

All 12 selected-input hashes, 12 exact content strings and 31 generated IDs were re-derived from tracked Round1 bytes and compared with the LIVE-005A report before package construction. discovery-source.md preserves that report exactly. selection-manifest.json retains the hashes/IDs/content in seven groups; selected-*.json retains the twelve exact selections. No external source access/download.

Package fingerprint:
`c05192742ae39eb86f42a53724d7468922a4173ce764c938a6287b069fa7d3f5`

File-map includes package code, review/README/discovery/selected data, tests, shared composition, previous composition dependencies, dataset and core persistence/validation/mutation dependencies. This verification log is excluded to avoid fingerprint self-reference. Git commit additionally pins the complete tracked artifact.

## Actual live, read-only dry gate

Project: 088d09dc-dfc5-487a-8f8f-22d2b33a9249.
Explicit canonical-live root: /Users/macsaku/Library/Application Support/GROUND/storage/projects.
Schema stored/read: 0.1.25 / 0.1.25. Canonical validation passed.
Before and after exact bytes:
`f45b265afb6f4d9165ac46aa26eb1f16d82bbf94a3739212421bca93463e830b`.

Each dry verification execution acquired the actual ProjectState once with loadProjectSnapshot. All projections, repeat checks and compatibility reads consumed memory only. No owner session/save/publish. Existing default worktree storage was not created.

Per-document groups 395, 678, 679, 680, 86, 430, 815: all NOT_APPLIED; batch READY (dry eligibility only). Actual live remains Document/Observation/Evidence 4/4/4. Memory candidate adds 7/12/12 => 11/16/16; Claim, links, Event, State, legacy Observation remain zero. All existing records and Project semantic metadata including current_state preserved. Only permitted project.updated_at/top-level updated_at advance in the memory result. No unexpected semantic delta.

All 31 canonical candidate records with temporal/provenance/reference fields and candidate hashes are in dry-review.json and human-grouped REVIEW.md. dry recorded_at is labeled 2000-01-01T00:00:00.000Z; final time remains UNBOUND. Running the frozen dry driver reproduced dry-review.json byte-for-byte, including seven review groups.

The recovery procedure was exercised with actual acquired before bytes in a disposable external temporary directory: exact backup hash PASS, overwrite refusal PASS, wrong hash refusal PASS, inside discovery refusal PASS, symlink-to-discovery refusal PASS. No backup was written into actual live discovery or actual owner operations area; no rollback performed.

## Human Interface compatibility

Existing unchanged HUMAN-006B adapter at 4629b0f imported by the dry driver, using its existing server resolver seam with the in-memory state. Project browse returns 11 Entities. All 11 Entity reads succeed. FRUS395 has three Observations, 678 two, 430 three; each has one explicit observation_ref Evidence. Every other Document has one/one. No Claim/Event/State fabricated. Adapter SHA-256 is recorded in dry-review.json. No UI edits, source registration, synthetic proof fixture or browser claim of live publication.

## Tests and regression

Dedicated expansion: 31 PASS.
Expansion + prior Historical injection/392 inspection/LIVE-004 package tests: 68 PASS / 0 FAIL.
Coverage includes input pins, IDs, content qualifiers, grouping, subjects/provenance, delta/old-state preservation, all READY/NO_OP, mixed/partial/extra/changed HOLD, receipt tampering, semantic tampering even with recomputed record hashes, reproducibility and prior package fingerprint identity.

Full core command: node --import tsx --test ground-core/__tests__/*.test.ts.
No nested core test files were omitted (all current test files are directly under that directory).
- Parent baseline: 3,924 tests — 3,820 PASS / 104 FAIL.
- New package: 3,955 tests — 3,851 PASS / 104 FAIL.
- All 104 failure identities are identical, attributable to existing missing storage fixtures; no new failure. Missing fixtures were not restored or modified.
- Initial sandbox executions had one additional CLI IPC-related failure in both baseline and candidate. Equal-permission reruns above removed it. This is not treated as a product regression.

Core strict typecheck PASS. Vite build PASS. git diff --check PASS. No full-green claim: 104 known fixture-dependent tests remain failing.

## Publish decision

Package freeze is ready for review; one batch of seven Document groups remains practical. LIVE-005C is HOLD pending separate approval of this exact commit/fingerprint and owner-controlled publish execution. Before any eventual save: verify approved commit/fingerprint, latest exact baseline and all-seven READY, record final timestamp once, backup/prepare receipt, validate one complete in-memory mutation, perform one atomic save, release owner and independently re-read. No per-Document or partial batch save, no automatic rollback, no auto-advance to LIVE-005C.
