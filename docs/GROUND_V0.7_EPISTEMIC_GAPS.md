# GROUND Reality Core v0.7 — Epistemic Gap / Unknown (GROUND-006)

Status: **stable derived gap layer** — schema remains `0.1.3`.

## Invariant

```text
Epistemic gap ≠ Claim(value="unknown")
Unknown ≠ low confidence
NO_CLAIMS ≠ CONTESTED
Absence detection is query-scoped (does not invent predicates)
```

## API

| Function | Role |
|----------|------|
| `assessEpistemicGapsAt(state, query)` | Gaps for one explicit proposition query |
| `getEpistemicGapsForSubject(state, subjectId, at)` | Only predicates already present on Claims |
| `getUnresolvedSubjectClaims(state, at?)` | `subject_id === null` visibility |

## Gap kinds

| Kind | Trigger | Does NOT mean |
|------|---------|---------------|
| `NO_APPLICABLE_CLAIMS` | Belief `NO_CLAIMS` | Reality absent / Claim(value=unknown) |
| `CONTESTED_POSITIONS` | Belief `CONTESTED` | Winner chosen |
| `NO_LINKED_EVIDENCE` | Applicable Claim has no links | Claim is false |
| `EVIDENCE_TENSION` | Claim has SUPPORTS + CONTRADICTS | Confidence rewritten |
| `TEMPORAL_COVERAGE_GAP` | Scope Claims before AND after `at`, none at `at` | Interpolated value |

## Deferred

Inquiry, Question generation, Observation request, Attention, Salience, Situation, Operational State, Claim→ontic promotion, reliability, confidence fusion, Novelty, Causal/Future/Authority/Capability Unknown.
