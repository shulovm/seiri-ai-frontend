# Phase4B-A — frozen baseline and failure census

Implementation changes: none at this gate.

Baseline branch `ground/checkpoint-187`, HEAD `04e8072cfaf6031b1b1221da5a781ddbf43b55e8`, schema0.1.24.
Phase4 gates: A d055f66, B0cfcaa8, C805f92a, Ddcd745d, Eee98e52, F04e8072.

Phase4 primary failures:85/320cases,255/960trials. All are stable over three runs. Root-cause census (not independent discoveries):

- Epistemic qualification:15cases/45trials. Uninspected/negative scope and knowledge arrival combined with unknown clauses.
- Provenance:10cases/30trials. Verified observation kind and negative report scope swallowing a positive instruction.
- Execution lifecycle:5cases/15trials. Unknown/unrecorded start-time reference converted to execution occurrence.
- Relation extraction:20cases/60trials. Owner/custodian grammatical roles and token boundaries.
- Temporal interpretation:15cases/45trials. Permission revocation, scene original/post and unknown scope.
- Identity resolution:10cases/30trials. Five identity roles unnecessarily tied to one sentence/lexical trigger.
- Resource semantics:10cases/30trials. Record/physical counts classified only by number prefix.

Every failed trial has original input, typed expected constraints, actual canonical path, failed positive/negative checks, root family and first-divergence location. All15false-derivation trials additionally record the triggering phrase, unsupported inference and metamorphic validation still required.

First wrong transformation: `decomposeReality` sees 「始まった」 inside 「いつ処置が始まったかは記録がない」 and emits `execution_started`; unknown/question scope is not qualified. Composition and persistence faithfully carry the erroneous extraction. Do not fix storage or weaken oracle.

Cross-domain recurrence exists in five domain contexts. Sentence-order/context variation exists; independent paraphrase and event-sentence reorder must be tested in4B-B before claiming transfer.

Source-channel/decision protection from Phase4 remains baseline. Phase4 corpus is now development only. Final4B gate requires freshV2 gold frozen and typed-materialized before any NL trial, >=480cases, >=3domains per boundary. No core/schema/migration/historical-input mutation, no domain shortcuts, no oracle injection.

[Baseline lock](/Users/macsaku/.codex/visualizations/2026/09/14/01a09d7e-7dd5-77b0-9d10-c304663e2928/GROUND-phase4b/phase4-baseline-lock.json)
[Complete failure census](/Users/macsaku/.codex/visualizations/2026/09/14/01a09d7e-7dd5-77b0-9d10-c304663e2928/GROUND-phase4b/failure-census.json)
[All false-derivation trials](/Users/macsaku/.codex/visualizations/2026/09/14/01a09d7e-7dd5-77b0-9d10-c304663e2928/GROUND-phase4b/false-derivation-census.json)
