# GROUND-011 — Reference State Core

## Role

Explicit normative comparison substrate:

```text
Current  — derived from RealityState (ontic)
Expected / Desired / Acceptable — persisted ReferenceCondition
```

```text
DEVIATES ≠ PROBLEM / NEED / RISK / unsafe
```

## Persistence

```text
schema: 0.1.3 → 0.1.4
collection: reference_conditions[]
patch entity: reference_condition
migration: reference_conditions = [] (no backfill)
```

## ReferenceCondition

```text
subject_id → RealityEntity
state_kind → compared against RealityState.kind
reference_kind: EXPECTED | DESIRED | ACCEPTABLE
criterion: EQUALS | ONE_OF | NUMERIC_RANGE
valid_from / valid_until — half-open [from, until)
declared_by — ReferenceDeclarer (not authorized_by)
```

## Current assessment

```text
NO_CURRENT_STATE — no active RealityState (Claim/Belief never substitutes)
SINGLE_VALUE — one semantic value (duplicates merged via semantic equality)
CONFLICTED — multiple distinct semantic values
```

## Comparison results

```text
MATCH / DEVIATES / NO_CURRENT_STATE / CURRENT_CONFLICTED / UNSUPPORTED_COMPARISON
```

## APIs

```text
getReferenceConditionsAt(...)
assessCurrentStateAt(...)
compareCurrentToReference(...)
assessReferenceStateAt(...)
detectReferenceConflicts(...)
```

## Boundaries

- No PROBLEM / NEED / RISK / BLOCKER / OPPORTUNITY
- No priority / severity / Attention
- Situation / StructuralFinding unchanged
- Reference conflicts ≠ ontic state conflicts
