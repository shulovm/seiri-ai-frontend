# GROUND-013 — Objective Core / Requirement & Dependency Foundation

## Role

Canonical declarations for:

```text
RealityObjective
ObjectiveRequirement
ObjectiveDependency (REQUIRES)
```

Derived assessments only — no NEED / BLOCKER yet.

```text
legacy Goal ≠ RealityObjective
Requirement ≠ NEED
Dependency ≠ BLOCKER
TARGETS_SATISFIED ≠ completed
```

## Persistence

```text
schema: 0.1.4 → 0.1.5
collections:
  reality_objectives[]
  objective_requirements[]
  objective_dependencies[]
patch entities:
  reality_objective
  objective_requirement
  objective_dependency
migration: empty arrays (no backfill from Goals / DESIRED / Actions)
```

## Architecture

```text
Objective.target_reference_condition_ids[] → DESIRED ReferenceCondition
Requirement.reference_condition_id → ReferenceCondition (any kind)
Dependency: Objective REQUIRES Requirement
```

ReferenceCondition remains the criterion engine (GROUND-011).

## Assessments

```text
RequirementAssessment: SATISFIED | UNSATISFIED | INDETERMINATE
ObjectiveTargetAssessment: TARGETS_SATISFIED | TARGETS_UNSATISFIED | TARGETS_INDETERMINATE
DependencyAssessment: PREREQUISITE_SATISFIED | PREREQUISITE_UNSATISFIED | PREREQUISITE_INDETERMINATE
```

## Boundaries

- No NEED / BLOCKER / RISK / OPPORTUNITY
- No priority / severity / Attention / Decision / Action
- No Authority / binding / official
- No transitive dependency graph
- No Capability / Resource requirement kinds
- No automatic Objective generation from DESIRED_GAP / PROBLEM / legacy Goal
