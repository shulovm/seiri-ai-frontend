# GROUND-012 — Normative Discovery I

## Role

Reference-relative normative findings from explicit ReferenceConditions.

```text
PROBLEM = ACCEPTABLE Reference + DEVIATES only
PROBLEM ≠ must_fix / authorized / priority
```

## Finding kinds

| Kind | Trigger |
| --- | --- |
| `PROBLEM` | ACCEPTABLE + DEVIATES |
| `EXPECTED_DEVIATION` | EXPECTED + DEVIATES |
| `DESIRED_GAP` | DESIRED + DEVIATES |
| `REFERENCE_CONFLICT` | GROUND-011 ReferenceConflict |
| `CURRENT_STATE_MISSING` | NO_CURRENT_STATE + applicable References |
| `CURRENT_STATE_CONFLICT` | Current CONFLICTED |
| `UNSUPPORTED_REFERENCE_COMPARISON` | UNSUPPORTED_COMPARISON |

Not implemented: NEED, RISK, BLOCKER, OPPORTUNITY.

## Basis status

```text
UNCONTESTED_REFERENCE — no same-kind Reference conflict (≠ authorized)
CONTESTED_REFERENCE — References conflict
INDETERMINATE — unsafe comparison
```

## APIs

```text
discoverNormativeFindings(projectState, subjectId, at, options?)
assessNormativeDiscovery(projectState, subjectId, at, options?)
assessNormativeSituation(projectState, situationQuery)
```

## Persistence

```text
schema: 0.1.4 unchanged
normative_findings[]: none (derived only)
```
