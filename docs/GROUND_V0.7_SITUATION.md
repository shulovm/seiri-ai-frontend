/**
 * Reality Core v0.7 — Situation / Salience (GROUND-009).
 *
 * Situation = bounded reasoning context assembled from ontic + epistemic + inquiry layers.
 * Derived only — not persisted. Schema remains 0.1.3.
 *
 * Salience ≠ priority / urgency / risk / Attention.
 */

# GROUND-009 — Situation / Salience Signals

## Role

```text
What part of Reality currently belongs together as one reasoning context?
```

Situation is a **read-only aggregator**. It does not decide what to do.

## APIs

```text
detectSalienceSignals(projectState, situationQuery)
buildSituation(projectState, situationQuery)
getSituationForSubject(projectState, subjectId, at, options?)
```

## SituationQuery

Required: `subjectId`, `at`

Optional:

- `predicateScopes` — explicit proposition scopes for Belief/Gap/Inquiry/Need
- `eventWindow` — half-open `[from, until)` for Event inclusion

## Temporal rules

| Layer | Rule |
| --- | --- |
| Active states | `getRealityStatesAt(..., at)` |
| Epistemic applicability | Belief/Gap/Inquiry/Need at `at` |
| Events with window | `from <= occurred_at < until` |
| Events without window | only `occurred_at === at` (exact point) |
| Unknown-time Events | `unplaced_events` + `UNPLACED_EVENT` — never synthetic timestamps |

## Predicate scopes

- Explicit scopes → derive Belief/Gap/Inquiry/Need for those scopes (may yield `NO_APPLICABLE_CLAIMS`)
- No explicit scopes → only scopes already present on Claims for the subject
- Never invent missing predicates (e.g. `temperature`)

## SalienceSignal kinds

| Signal | Trigger | Does NOT mean |
| --- | --- | --- |
| `ONTIC_EVENT_PRESENT` | Event(s) in event scope | importance / urgency |
| `STATE_CONFLICT` | `value_conflict` from Worldline | which state is true |
| `UNPLACED_EVENT` | `occurred_at = null` | fabricated time |
| `EPISTEMIC_CONTEST` | Belief `CONTESTED` | winner / priority |
| `EPISTEMIC_GAP` | EpistemicGap present | high risk |
| `OPEN_INQUIRY` | non-null Inquiry | Attention / Task |
| `OBSERVATION_NEED` | ObservationNeed present | dispatch / observer |

**Deliberate omission:** `ACTIVE_STATE_PRESENT` is **not** a SalienceSignal.
Normal active states live only in `ontic_context.active_states` — existence ≠ salience.

## Status

```text
QUIET     — no unresolved signals; no ontic activity/signals
ACTIVE    — ontic context (states and/or in-scope events) without unresolved signals
UNRESOLVED — STATE_CONFLICT / EPISTEMIC_* / OPEN_INQUIRY / OBSERVATION_NEED / UNPLACED_EVENT
```

Also: `has_salience`, `has_unresolved` flags.

Does **not** mean RESOLVED / CLOSED / CRITICAL / ESCALATED.

## Persistence

```text
schema: 0.1.3 unchanged
situations[]: none
salience_signals[]: none
write path: none
```

## Out of scope

Attention, priority, Risk/Impact, Information Gain, Problem Discovery, Situation lifecycle,
graph expansion, Operational State, Decision, Intent, Task generation.
