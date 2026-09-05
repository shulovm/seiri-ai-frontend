# GROUND Reality Core v0.7 — Inquiry / Question Formation (GROUND-007)

Status: **stable derived planning layer** — schema remains `0.1.3`.

## Chain

```text
BeliefAssessment
→ EpistemicGapAssessment
→ InquiryQuestion
→ Inquiry
```

## Question ≠ Inquiry

| | Question | Inquiry |
|--|----------|---------|
| Asks | What proposition needs an answer? | What knowledge objective groups those Questions? |
| Action? | no | no |

## Gap → Question

| Gap | Question kind |
|-----|---------------|
| NO_APPLICABLE_CLAIMS | ESTABLISH_PROPOSITION |
| TEMPORAL_COVERAGE_GAP | FILL_TEMPORAL_COVERAGE (merges with ESTABLISH when both) |
| CONTESTED_POSITIONS | DISAMBIGUATE_POSITIONS |
| NO_LINKED_EVIDENCE | FIND_SUPPORTING_EVIDENCE |
| EVIDENCE_TENSION | RESOLVE_EVIDENCE_TENSION |
| subject_id=null | RESOLVE_SUBJECT_IDENTITY |

## Boundary

No Attention, ObservationRequest, observer selection, task creation, or Claim→ontic promotion.
