# GROUND Reality Core v0.7 — Belief & Reconciliation (GROUND-005)

Status: **stable derived epistemic reconciliation** — schema remains `0.1.3`.

## Invariant

```text
Belief != Truth
UNCONTESTED != TRUE
Reconciliation != Ontic mutation
```

No Claim → RealityState promotion. No persisted Belief store.

## API

| Function | Role |
|----------|------|
| `isClaimApplicableAt(claim, at)` | Half-open applicability filter |
| `assessBeliefAt(state, query)` | BeliefAssessment for one scope |
| `getBeliefAssessmentsForSubject(state, subjectId, at)` | All predicate scopes for Entity |
| `detectClaimDivergence(...)` | CONTESTED positions or null |

## Applicability

```text
[applicable_from, applicable_until)
null from  → no lower bound
null until → open-ended
```

Never substitutes `recorded_at` / `created_at`.

## Status

| Status | Meaning |
|--------|---------|
| `NO_CLAIMS` | No applicable Claims |
| `UNCONTESTED` | One semantic Position — **not truth** |
| `CONTESTED` | Multiple Positions — no winner |

`leading_position` only when UNCONTESTED; else `null`.

## Semantic equality

Shared `canonicalValueKey` / `semanticValuesEqual` (object keys sorted; arrays order-sensitive).  
Worldline conflict detection reuses the same helper.

## Deferred

Operational State, Claim→ontic promotion, source reliability, confidence fusion, Unknown taxonomy, Inquiry, Salience, Situation, Intent, Governance, Coordination, Causal attribution, GroundEvent bridge.

## JSON identity fidelity correction

The shared canonicalizer preserves every own JSON member, including `__proto__`,
without invoking the JavaScript prototype setter. Previously that member could
vanish, collapsing distinct values and changing Reference matching or Worldline
value_conflict into duplicate_overlap. Key ordering remains irrelevant; array
ordering and primitive type distinctions remain authoritative. No prototype-based
interpretation, new value policy or source ranking is introduced.

Regression evidence: eight new tests, including schema-valid Worldline and
Reference cases, fail before and pass after the correction. Focused suite: 57 PASS;
full suite: 3,811 PASS, zero failures/skips. Typecheck/build PASS. Current schema
remains 0.1.24; this corrects value identity without migrating stored declarations.
