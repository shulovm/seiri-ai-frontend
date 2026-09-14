# GROUND Reality Core v0.7 — Worldline & Temporal Composition (GROUND-003)

Status: **stable derived read model** — no schema change (ProjectState remains `0.1.2`).

## Model

```text
RealityEntity
+ RealityEvent (subject_ids includes entity)
+ RealityState (subject_id = entity)
        ↓ derive (read-only)
   RealityWorldline
```

Worldline is **not** persisted. No `ProjectState.worldlines`.

## API

| Function | Role |
|----------|------|
| `getRealityWorldline(state, entityId)` | Full temporal view |
| `getRealityStatesAt(state, entityId, at)` | States active at `at` |
| `getCurrentRealityStates(state, entityId, at?)` | Active states grouped by kind |
| `detectRealityStateConflicts(state, entityId)` | Same-kind overlap visibility |
| `isRealityStateActiveAt(state, at)` | Half-open interval helper |

Unknown entity → `NotFoundError` (no fake empty entity).

## Interval semantics

```text
[valid_from, valid_until)
valid_until === null → open-ended
```

## Ordering (deterministic)

```text
1. time ascending
2. temporal_role: STATE_BECAME_VALID < EVENT_OCCURRED < STATE_CEASED_VALID
3. recorded_at ascending
4. record_id ascending
```

## Unknown occurrence time

`RealityEvent.occurred_at === null` → `unplaced_events` only.  
Never placed at `recorded_at` as a fake occurrence.

## Conflicts

| Case | Result |
|------|--------|
| same subject + same kind + overlap + distinct values | `value_conflict` |
| same subject + same kind + overlap + identical values | `duplicate_overlap` |
| different kinds overlapping | not a conflict |

Automatic resolution: **none**.

## GroundEvent vs RealityEvent

| | GroundEvent | RealityEvent |
|--|-------------|--------------|
| Layer | Reality-propose envelope | Canonical ontic Event |
| Persisted on ProjectState | no | yes (`reality_events`) |
| Worldline input | **no** | **yes** |

Automatic bridge / persistence: **none**. Future ingestion/epistemic work owns the bridge.

## Deferred

Claim, Evidence, Belief, Unknown, Situation, Salience, Intent, Governance, Coordination, Causal attribution, GroundEvent→RealityEvent bridge, Entity tombstones, persistent Worldline cache.
