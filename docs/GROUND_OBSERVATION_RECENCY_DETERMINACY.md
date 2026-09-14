# Observation recency and completed report authority

The adopted human decision requires completed Studio/Portfolio reports to have
determinate required propositions. Observation storage remains permissive.

The internal Observation recency assessment preserves RESOLVED true, RESOLVED
false, and UNRESOLVED with the original TemporalResolutionError. A known recent
Observation fixes existential recency even when another operand is unresolved,
independently of input order. Old resolved operands cannot prove absence while
an unresolved operand remains. The existing lower-inclusive 30-day threshold and
created_at authority are unchanged; observed_at is not substituted.

Studio absence warnings require determinate existential recency. Portfolio
momentum evaluates both possible 0.1 bonuses through its existing clamp and
rounding; equal scores establish that recency is not decision-critical there.
Otherwise it propagates temporal failure. Existing reasons referring to momentum
use that actual score. No partial scores, ranking omissions, or new tie-breaks.

Studio recent decision materials have an independent membership/order proposition.
An unresolved Observation can change the chosen two materials even if existential
recency is true. Required membership and ordering use exact temporal comparison.
Once the existing 12-material cap is filled by earlier materials, subsequent
Observations cannot alter this output and are not temporally inspected for it.
Other outputs still evaluate their own dependencies.

No canonical report type, persistence schema, migration, or domain verdict is
introduced. Wall-clock threshold construction remains the existing 30-day duration;
source timestamp comparison never truncates accepted fractional precision.
