# Decision snapshot persistence-time verification

## Adopted authority

The human Option A decision makes the verification performed by the existing
Decision upsert path authoritative for historical verification. The frozen
snapshot, its persistence-time verification fact, and any future current
revalidation are different facts. No current revalidation is implemented.

The engine generates snapshot_verification only after its existing snapshot
recomputation/check. Callers cannot supply this field through a patch. Executable
mismatch still rejects. Temporal non-resolution preserves the snapshot with
UNVERIFIED and the original temporal reason/declaration/operation. Successful
semantic matching produces VERIFIED. Object member insertion order is irrelevant;
temporal comparison still uses resolved instant identity. All non-temporal and
whole-state invariants remain in place.

## Persistence and identity

Canonical schema 0.1.25 requires a snapshot-specific record on every Decision.
It contains the Decision id, an exact content digest, status, and actual patch
acceptance timestamp for newly generated facts. The digest covers the snapshot
and its owning Decision context, including selection and declared decision/capture
times. It uses canonical JSON member ordering and SHA-256. This is a content
integrity anchor, not a semantic instant key, signature or social authorization.
It preserves source timestamp spelling and grants no instant identity to unresolved
declarations. Exact content binding is stronger than semantic equivalence: a
semantically different snapshot cannot inherit a prior verification fact.

Decision records remain append-only. Canonical load/normalization and historical
read adapters check content binding, never recompute the historical basis from
current ProjectState. Changing current sources cannot alter the stored fact.
The existing operation-time snapshot-check location and evaluation context are
preserved; no new patch ordering or transaction semantics are introduced.

## Legacy records

Schemas through 0.1.24 did not persist this verification fact and include both
successfully checked and temporally deferred Decisions. Migration cannot recover
which occurred from a schema version or a later snapshot match. It preserves the
snapshot and records NOT_RECORDED / LEGACY_VERIFICATION_FACT_NOT_RECORDED with no
invented acceptance timestamp. This is missing historical evidence, distinct from
known temporal UNVERIFIED and from VERIFIED. Historical validators remain available;
new patches retain support for older patch versions. Current-schema missing records
are invalid. Migration neither reads current evidence for verification nor backfills
success. No existing project file is migrated in place by this implementation run.

## Downstream boundary

getDecisionHistoricalSnapshot returns recorded content with its verification fact,
including when the Decision's own instant cannot resolve. assessDecisionMemory
retains its strict temporal capture-relation evaluation and includes the historical
verification fact. Intent and Commitment snapshot-derived relations carry the same
fact, associated with the Decision id. Candidate membership and frozen Permission
fields describe recorded contents; they do not independently establish verification.
Only status VERIFIED can serve a requirement for verified historical basis.
UNVERIFIED and NOT_RECORDED remain inspectable and cannot satisfy that requirement.

VERIFIED says only that the checked snapshot matched the persistence-time basis.
It proves no truth, Decision validity, Permission validity, feasibility, readiness,
can_execute, execution, actor authorization or current-world match.

## Verification

Thirteen new tests cover verified/unverified persistence, actual mismatch,
Permission reproduction, exact content binding, object-order invariance, legacy
absence, caller override rejection, later-source independence, file-store round
trip, Intent/Commitment propagation and unresolved historical inspection.
Focused Decision/temporal/identity/Intent/Commitment suite: 241 PASS.
Full suite: 3,834 PASS, zero failures or skips. Typecheck and build PASS.
Canonical schema/version assertions advance to 0.1.25; historical input fixtures
remain versioned and are not relabeled as current data.
