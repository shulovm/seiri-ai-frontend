/**
 * Reality Core v0.7 — Structural Finding / Discovery Core I (GROUND-010).
 *
 * StructuralFinding = identifiable unresolved/noteworthy structure inside a Situation.
 * StructuralFinding ≠ Problem / Risk / Need / Blocker / Opportunity.
 * Derived only — schema remains 0.1.3.
 */

# GROUND-010 — Discovery Core I / Structural Findings

## Role

```text
This Situation contains these structurally unresolved or noteworthy findings.
```

Not:

```text
This is a Problem / Risk / Blocker that must be fixed.
```

## APIs

```text
discoverStructuralFindings(situation)
assessSituationDiscoveries(projectState, situationQuery)
getStructuralFindingsForSubject(projectState, subjectId, at, options?)
discoverUnresolvedSubjectFindings(projectState, at?)  // project-level only
```

## Dependency

```text
buildSituation(...)
→ discoverStructuralFindings(...)
```

Discovery does not reimplement Belief / Gap / Inquiry / ObservationNeed.

## Finding kinds

| Kind | Source | Not meaning |
| --- | --- | --- |
| `ONTIC_STATE_CONFLICT` | Situation state `value_conflict` | which State is true |
| `EPISTEMIC_POSITION_CONFLICT` | Belief `CONTESTED` | winner / PROBLEM |
| `KNOWLEDGE_GAP` | Gap `NO_APPLICABLE_CLAIMS` | Reality missing / dangerous |
| `EVIDENCE_DEFICIT` | Gap `NO_LINKED_EVIDENCE` | Claim false/weak |
| `EVIDENCE_TENSION` | Gap `EVIDENCE_TENSION` | Evidence vote |
| `TEMPORAL_KNOWLEDGE_GAP` | Gap `TEMPORAL_COVERAGE_GAP` | interpolated continuity |
| `UNRESOLVED_SUBJECT` | null-subject Claims (explicit API) | identity match |
| `UNPLACED_EVENT` | unplaced RealityEvents | fabricated occurrence time |
| `OBSERVATION_NEED_PRESENT` | ObservationNeeds on Situation | dispatch / priority |

`CONTESTED_POSITIONS` Gap does **not** emit a separate Finding; covered by `EPISTEMIC_POSITION_CONFLICT`.

## Status

```text
OPEN
```

only. No RESOLVED / CLOSED lifecycle — absence of derivation = gone.

## Persistence

```text
schema: 0.1.3 unchanged
findings[]: none
write path: none
```
