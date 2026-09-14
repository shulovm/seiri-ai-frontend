# GROUND Reality Core v0.7 — Epistemic Core I (GROUND-004)

Status: **stable epistemic substrate** — Observation / Evidence / Claim only.  
Schema: `ProjectState` **0.1.3**.

## Invariant

```text
EpistemicObservation ≠ RealityState
Claim ≠ RealityState / RealityEvent
Evidence ≠ truth
```

Creating epistemic records does **not** mutate ontic Reality collections.

## Collections

| Collection | Type |
|------------|------|
| `epistemic_observations` | `EpistemicObservation` |
| `evidence` | `Evidence` |
| `claims` | `Claim` |
| `claim_evidence_links` | `ClaimEvidenceLink` (`SUPPORTS` \| `CONTRADICTS`) |

## Legacy Observation

`observations[]` / `Observation` remains the **project-management** note used by Reality propose / Studio / Director.  
**Not** redefined. **Not** backfilled into `EpistemicObservation`.

## Provenance

`EpistemicProvenance { kind, entity_id?, external_id?, label? }`  
Sources need **not** be RealityEntities.

## Mutation path

```text
StatePatch (epistemic_observation | evidence | claim | claim_evidence_link)
→ applyPatch → validation → saveProject
```

## Deferred

Belief State, Operational State, Claim reconciliation, Claim→ontic promotion, Unknown taxonomy, Inquiry, Salience, Situation, Intent, Governance, Coordination, Causal attribution, GroundEvent ingestion bridge, epistemic timeline.
