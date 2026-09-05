# GROUND-015 — Prospective Core I / Future Scenario, Projection & Likelihood

## Role

Canonical prospective declarations:

```text
FutureScenario
ScenarioStateProjection
ScenarioLikelihoodEstimate
```

Derived assessments — no RISK / OPPORTUNITY / probability fusion.

```text
FutureScenario != Reality
ScenarioStateProjection != RealityState
LikelihoodEstimate != fused probability
Projected deviation != RISK
```

## Persistence

```text
schema: 0.1.5 → 0.1.6
collections:
  future_scenarios[]
  scenario_state_projections[]
  scenario_likelihood_estimates[]
patch entities:
  future_scenario
  scenario_state_projection
  scenario_likelihood_estimate
migration: empty arrays (no backfill)
```

## Key invariants

```text
projected_for > scenario.as_of
Reference comparison time = projected_for (not as_of)
probability ∈ [0, 1]
duplicate semantic projection → reject
distinct values same scope → ScenarioProjectionConflict
```

## APIs

```text
getFutureScenario / getScenarioProjections / getScenarioLikelihoodEstimates
assessScenarioLikelihood / detectScenarioProjectionConflicts
assessScenarioReferences / assessFutureScenario
```

## Boundaries

- No RISK / OPPORTUNITY
- No RealityState mutation from projections
- No Claim/Evidence auto-creation
- No probability averaging / winner selection
- Reuses GROUND-011 compareValueToCriterion
