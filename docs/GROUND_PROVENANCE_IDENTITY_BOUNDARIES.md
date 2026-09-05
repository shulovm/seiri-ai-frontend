# Provenance identity component boundaries

Existing declarer/provenance fingerprints use kind, entity_id, external_id and
label. Those fields are source representation, not authorization or trust.
Delimiter concatenation could erase the distinction between (external_id=a|b,
label=c) and (external_id=a,label=b|c), causing false same-declarer duplicate
rejection. Belief's null-character separator could similarly collapse two distinct
schema-valid provenance summaries.

These fingerprints now use the existing canonical JSON helper to preserve the
same four component boundaries. Existing absent/null/empty normalization is retained;
this unit does not decide new absence semantics, change the identity fields,
reconcile actors, rank sources, authorize a declarer, or create a truth winner.
Read-model source ordering remains deterministic presentation, not precedence.
Stored declarer fields are preserved exactly. Private fingerprint serialization
changes require no persisted UUID, schema, historical snapshot or verification-fact
migration. No source-provenance field becomes a canonical Permission authority.

Two new tests reproduce actual patch rejection and Belief provenance loss before
the correction. After it, both distinct sources survive while the same-value
Belief stays UNCONTESTED, without becoming true or higher-confidence by voting.
Focused Belief/Intervention/Governance/Decision tests: 132 PASS.
Full suite: 3,841 PASS, zero failures/skips. Typecheck/build PASS. Schema 0.1.25.
