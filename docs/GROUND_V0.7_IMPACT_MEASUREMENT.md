# GROUND v0.7 — Impact Measurement (GROUND-018)

Explicit quantitative magnitude/extent for ImpactDeclarations.

## Chain

```text
ReferenceCondition
→ ImpactDeclaration
→ ImpactMeasureDeclaration
→ ImpactMetricAssessment
```

## Explicit non-meanings

No severity, impact_score, expected_loss, unit conversion, cross-metric aggregation, or probability × magnitude.

`has_measurements = false` ≠ zero impact / safe.

Schema: 0.1.8 — `impact_measure_declarations[]` persisted; assessments derived read-only.
