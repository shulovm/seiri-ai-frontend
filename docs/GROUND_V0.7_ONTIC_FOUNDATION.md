# GROUND Reality Core v0.7 — Ontic Foundation (GROUND-002)

Status: **stable substrate** — Entity / Event / State only.

## What this introduces

Canonical ProjectState collections (schema `0.1.2`):

| Collection | Type | Meaning |
|------------|------|---------|
| `reality_entities` | `RealityEntity` | Something that persists through time |
| `reality_events` | `RealityEvent` | Something that happened |
| `reality_states` | `RealityState` | Something that is/was the case for a subject |

## Mutation path (unchanged)

```text
StatePatch (entity: reality_entity | reality_event | reality_state)
→ applyPatch
→ validate + referential invariants
→ saveProject
```

No parallel store. No auto-generation from `reality-propose`.

Worldline (GROUND-003) is a **derived read model** — see `docs/GROUND_V0.7_WORLDLINE.md`.
Not persisted on ProjectState.

## Temporal fields

| Field | Applies to | Meaning |
|-------|------------|---------|
| `occurred_at` | Event | When Reality says it happened (`null` = unknown) |
| `recorded_at` | Event, State | When GROUND accepted the record |
| `valid_from` / `valid_until` | State | Effectiveness interval (`valid_until: null` = open) |

## Migration

```text
0.1.0 → 0.1.1 fields → 0.1.2 (+ empty reality_* arrays)
0.1.1 → 0.1.2 (+ empty reality_* arrays)
```

No speculative backfill of Observation / Action / Decision into Reality types.

## Explicitly deferred (beyond Ontic + Worldline)

Claim, Evidence, Belief, Unknown, Situation, Salience, Intent, Commitment redesign, Authority, Mandate, Governance, Coordination, Inquiry, Causal learning, Federation.
