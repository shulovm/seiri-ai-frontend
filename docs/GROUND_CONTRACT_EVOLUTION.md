# Contract Evolution: historical checkpoint, transition, current Integration

## Adopted scope

GROUND-CONTRACT-EVOLUTION-001 implements the explicit user instruction of
2026-09-14 to separate the three remaining Integration contracts. The executable
record is `contract-evolution/schema24-to25.json`. It names the previously approved
core checkpoint; a digest is an integrity witness, not a source of authorization.
Changes to that record or its test-only implementation require explicit review.
This record grants no automatic authority to a later version, date, or HEAD.

## Historical truth

Round5's 675 and Round6's 703 source entries are checked against exact Git blobs
at 9cb9dc6fe2ac522679abc970c5a7daa08bcd253b, using that checkpoint's exact reviewed
intake/guard approvals. Original manifests, original hashes, the approval fixture,
and historical artifacts are unchanged. This is the reproducible accepted
checkpoint including its recorded intake approvals, not an invented raw-original
tree from before Git tracking. Round6's original Round5 proof source remains in
that checkpoint, including its schema24 assertion. Historical schema definitions
remain available. Missing Git objects fail; current files are never a fallback.

## Approved transition

The schema25 introducing event is aed4eb7a07414a9d8df07fb7a91e1b2f8fafb595.
Its adopted Option A semantics are recorded in
GROUND_DECISION_SNAPSHOT_VERIFICATION.md. The approved target is
8c0570cf3eb272fd932daa620807b012dad9be34. These are on the core evolution branch;
the schema24 Integration base is on a separate branch. The common ancestor,
14-commit lineage, introducing parent/version, retained historical schemas, and
285 adopted paths are verified from Git, not inferred from calendar ordering.
The source candidate digest records the input to this implementation, not the
post-implementation result or its future commit hash.

Old current-source freeze applicability is explicitly replaced by this
Integration composition gate for the three listed contracts. Their historical
checkpoint applicability is retained. Existing intake exceptions are not widened.
Legacy migration must retain historical facts rather than fabricate successful
verification: old Decision snapshots receive NOT_RECORDED with null persistence
time. The existing Decision migration tests retain that content-level obligation.

## Current truth

The candidate's actual ground-core, docs, scripts, package files and ignore rules
are compared to the accepted base plus the approved core diff. The pre-reviewed
ignore adjustment has an exact digest. Only the enumerated seven contract
implementation paths are exempted from old byte equality; that reviewed source
is the implementation of this gate and cannot self-attest its own correctness.
The gate rejects unknown files, missing files and modified non-exempt bytes.
Generated ground-core/storage is excluded as runtime test storage, matching the
existing reproducibility runner. Production core/schema semantics are not edited.

The existing world-target rejection remains a current behavior assertion. Its
schema assertion now compares composition output to its input project. A separate
contract binds the canonical version to the approved checkpoint, so merely
changing SCHEMA_VERSION cannot silently authorize schema26. A separate historical
contract proves that the previous canonical version and original proof were 24.

## Reproduction and future transitions

Run the normal test:ground-core command from a checkout containing the two exact
checkpoint histories and installed dependencies. The runner copies repository
inputs into a disposable workspace and imports those two histories into its own
Git repository. It reads no other worktree's runtime data or branch state.
This is a local history transfer; no network remote or mutable branch is used.
A source export without those Git objects intentionally fails closed.

A future approved core/schema change requires a newly reviewed transition record
that names its previous authority, introducing event, approved target and affected
contracts. Old records and snapshots remain historical evidence. Do not rewrite
old hashes, relabel archived schema versions, or automatically follow HEAD.
This minimal mechanism does not implement a generic authorization service,
production persistence framework, Human integration, or Historical research.
