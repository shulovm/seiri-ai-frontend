# GROUND-014 — Objective Discovery II / NEED & BLOCKER

## Role

Objective-relative derived findings:

```text
NEED    — active Objective has unmet declared Requirement
BLOCKER — active REQUIRES Dependency has PREREQUISITE_UNSATISFIED
```

```text
Requirement UNSATISFIED alone ≠ NEED
Dependency ≠ BLOCKER
BLOCKER ≠ legacy blockers[]
```

## Triggers

NEED when all hold at `at`:

```text
applicable Objective O
applicable REQUIRES Dependency D → O
applicable Requirement R
RequirementAssessment(R) = UNSATISFIED
```

BLOCKER when:

```text
DependencyAssessment(D) = PREREQUISITE_UNSATISFIED
```

INDETERMINATE prerequisites produce neither finding.

## APIs

```text
assessObjectiveDiscovery(projectState, objectiveId, at)
discoverObjectiveFindings(projectState, objectiveId, at)
discoverObjectiveFindingsAt(projectState, at)
```

Consumes GROUND-013 `assessObjectiveStructureAt` only.

## Boundaries

- No RISK / OPPORTUNITY
- No priority / severity / Attention / Decision / Action
- No Authority / binding / official
- No persistence (`needs[]` / `objective_blockers[]` absent)
- No bridge to legacy Goal / Blocker / NextAction
- PROBLEM / DESIRED_GAP do not auto-generate NEED
