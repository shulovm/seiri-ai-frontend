# Round 4 experimental extension

Historical case → current representation → lost meaning → minimal semantic:

* Pallada sunk in a Paris-attributed newspaper report versus explicitly not sunk in a Russian official telegram reprinted elsewhere. Round 1 text assertions can retain both, but canonical CONTRADICTS would incorrectly contradict two true statements about text. Add a contrast between **reported propositions**, with manually justified target/episode alignment, never canonical truth adjudication.
* Japanese fleet 53 wounded versus a modern English reprint 54; Russian/Japanese ship counts 15/16; 60 holes in a boat versus projectile hits. Existing claim strings retain wording but do not support unit/scope-sensitive comparisons. Add source-attributed quantity descriptors, not a world-valued numeric slot.
* 23:35 explosion, 23:45 heard firing, 11:08 opened fire, 11:25 first shell near own ship. A normalized day alone loses observable/time-role and unknown clock standard. Add raw-clock observations and conditional calendar interpretations, with no canonical instant.
* Parallel night/day report candidates and uncertain Pallada/Pallida target identity. Add manually assessed episode relations; do not infer identity from names/times.
* Damaged funnel, continued operation, and next-day memoir repair. Add separately attributed state descriptors with unknown pre-state; do not project a historical State.
* Diagram-relative positions and a photographic catalogue's year interval masquerading as January 1. Add spatial precision and modality boundaries; catalogue metadata cannot become an inspected image.
* Stark says his account compiles watch logs and captain reports; English Togo and JACAR repeat the same Japanese report. Reuse Round 3 documentary lineage, and add proposition-scoped independence assessments without source counting.
* Reconstruction needs retained alternatives/support/opposition and later amendment. Add immutable versioned proposition sets; interpretation does not become Event.

Alternatives considered: core changes (premature); string-only claims (loss of queryable role/unit/alignment); one canonical Event (erases disagreement); numerical confidence scores (unvalidated); fixed universal conflict ontology (no evidence for a closed vocabulary). The extension uses a small tagged record envelope with case-specific descriptors and explicit limits. It is experimental, not a proposed universal ontology.

Implementation: `reconstruction.ts`; case data: `round4.dataset.json`; tests: `../../../__tests__/historical-reality-round4.test.ts`; serialization/reload/provenance/core projection: `replay.ts`. Round 3 documentary validation and traversal are reused without modification. Round 1–3 files are hash-pinned. Legacy impact: additive only, no core schema changes, no historical Events or States projected. `verification.json` records executed checks, not planned checks.
