# Temporal patch admission

## Authority and contract

The adopted human Option A decision separates ProjectState persistence from
semantic temporal verification. applyPatch retains whole-state invariants and
schema/structural validation. A schema-valid unresolved instant is not, by itself,
a reason to reject either an unrelated patch or a new/modified temporal declaration.
A proven violation still rejects with the existing invariant error.

The internal temporal-admission boundary retains VERIFIED with an evaluated value
or UNRESOLVED with the dedicated TemporalResolutionError. An unresolved result is
neither a successful temporal validation nor a failed temporal invariant. There is
no new global validation state, persisted status, leap-second calendar or authority.
Other exceptions propagate. Final schema validation remains mandatory even when
an earlier temporal prerequisite could not be resolved.

## Corrected paths

State, Claim, Reference, Objective, Governance, Capability, Resource, Intervention,
Decision, Intent, Commitment, Acceptance, declared terms and Reservation invariant
comparisons use exact instants. Existing strict/non-strict interval inequalities,
null open ends and whole-state consistency checks remain. Overlap and semantic
duplicate rejection require proven relations; unavailable keys do not compare equal.
Temporal prerequisites of Decision snapshot recomputation and indirect Commitment
identity checks may remain unresolved. Independent snapshot shape/reference and
other structural checks still run. Snapshot time comparisons use instant identity.

Declared source text and immutable representation checks remain intact. No raw
source spelling becomes a fallback semantic key. The public Worldline and identity
adapters stay strict: evaluation requiring unresolved time raises the dedicated
resolution error, never false, an empty result or a fabricated canonical identity.
Persistence does not certify a snapshot or interval as temporally verified.

## Verification

20 new admission tests cover stored and introduced unresolved values, exact offset
and high-precision intervals, proven inversions, schema/structural rejection,
independent whole-state failures, strict evaluation/identity after persistence,
Decision snapshot prerequisites and indirect Commitment/Acceptance identity.
Focused admission/temporal/Worldline tests: 61 PASS. Full suite: 3,803 PASS with
zero failures or skips. Typecheck and build PASS. Schema remains 0.1.24.

No schema, dependency, quantity, availability, coverage, readiness, feasibility,
execution or social authorization contract changed. This checkpoint resolves the
admission frontier only; global frontier discovery continues separately.
