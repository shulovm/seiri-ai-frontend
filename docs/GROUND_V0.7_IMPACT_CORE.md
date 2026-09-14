# GROUND v0.7 — Impact Core (GROUND-017)

Explicit affectedness and impact scope for ACCEPTABLE reference deviations.

## Core invariant

```text
deviation subject ≠ automatically affected entity
```

Impact exists only via canonical `ImpactDeclaration` records.

## Integration

- `assessProblemImpactScope` — uses `problem.at`
- `assessRiskImpactScope` — uses `risk.projected_for`

PROBLEM / RISK remain valid without ImpactDeclarations.

## Explicit non-meanings

No severity, magnitude, priority, OPPORTUNITY, causality, or graph propagation.

Schema: 0.1.7 — `impact_declarations[]` persisted; assessments derived read-only.
