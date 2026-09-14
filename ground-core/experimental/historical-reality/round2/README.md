# Round 2 — attributed information propagation

Read `../../../../docs/HISTORICAL_REALITY_RUSSO_JAPANESE_WAR_ROUND2.md` for the 15-part findings and eight-point experimental-change record.

`round2.dataset.json` is an additive envelope importing the immutable Round 1 dataset SHA-256. `propagation.ts` validates and materializes it without modifying the parent. Query results are documentary attestations, not historical actor truth or ignorance. `inherited_round1_records` preserves the prior epistemic layer alongside the supplementary records.

Only attested stages/links are recorded. A node's reported time can be unknown even when its source has a known date. Public edition reference dates are not proven earliest accessibility; individual possession/access/read remain unknown. Raw clocks are retained; no UTC instants are inferred.

From repository root:

```sh
node --import tsx ground-core/experimental/historical-reality/round2/replay.ts
node --import tsx --test ground-core/__tests__/historical-reality-round2.test.ts
node_modules/.bin/tsc -p ground-core/tsconfig.json --pretty false
```

`replay/` contains generated materialization, source/propagation/reconstruction traces, actor queries and a canonical file-store round-trip. Canonical projection intentionally contains source-text assertions only, with no historical RealityEvents or RealityStates. Preserve the sidecar: projection is partial.

`evidence/` includes five acquired PDFs and the earlier published telegram preview. PDF integrity is checked against dataset asset hashes; inspection is restricted to declared pages. Acquisition does not authenticate originals or imply full reading. `acquisition-manifest.json` records rejected HTML downloads separately. `verification.json` records the observed 67-test run and typecheck.
