# GROUND v0.7 — Prospective Risk Discovery (GROUND-016)

Reference-relative prospective **RISK** derived from GROUND-015 assessments.

## RISK trigger

```text
PROJECTED_ACCEPTABLE_DEVIATION
AND
>= 1 ScenarioLikelihoodEstimate with probability > 0
→ ProspectiveRiskFinding(RISK)
```

## Explicit non-meanings

- Not `risk_probability`, severity, priority, or Action
- Not fused probability or source reliability
- Not current PROBLEM / RealityState mutation
- `has_risk = false` ≠ safe / zero harm / no unknown risk

## Studio firewall

`ProspectiveRiskFinding` ≠ `StudioRiskProject` / legacy `risk_*` vocabulary.

No bridge. Derived read-only. Schema 0.1.6 unchanged.
