# Round 3 — documentary lineage experiment

Before extension: FRUS p.709 is a printed **Telegram—Paraphrase**, while modern `d679` is a web identifier. Pak's Russian text quotes a collection not presently inspected; its delivery assertion cites later historians. JACAR labels a modern transcription 〔原文〕 beside 〔口語訳〕. IA labels a derivative pipeline input `original`, referring to a scan of a 1922 memoir, not a 1904 telegram.

Lost meaning: one Source or parent_source_id cannot express those distinct artifacts, reference-only endpoints, transformations, identifier scopes, or three independent certainty targets. Receipt and reading also cannot be collapsed.

Minimal requirement: additive artifact records, attributed typed upstream edges, unverified documentary references, scoped assessments, payload-specific attested stages, sparse temporal roles and documented search limitations. Reconstruction domains remain separate. No historical original is manufactured, no independent authentication claimed, and no missing edge inferred.

Alternatives: free-text Source annotations remain available but do not validate/traverse these boundaries; a single parent field loses transformation/basis; FRBR wholesale is unnecessary; canonical events, beliefs, numeric confidence or SUPPORTS lose historical attribution and scope. Extend only this sidecar; keep Round 1/2 and core unchanged.

Implementation: `lineage.ts`, additive `round3.dataset.json`, `replay.ts`. Tests exercise receipt/read boundaries, message identity, unverified endpoints, scoped certainty, provenance traversal, parent hashes and safe canonical projection. Replay writes all derived traces and persists the inherited partial core projection. Full change rationale and promotion watch are in the Round 3 report.

Run from repository root:

```sh
node --import tsx ground-core/experimental/historical-reality/round3/replay.ts
node --import tsx --test ground-core/__tests__/historical-reality-round3.test.ts
node_modules/.bin/tsc -p ground-core/tsconfig.json --pretty false
```

Edges point from a derived artifact **toward its stated upstream**. `claims_to_reproduce` or `quoted_from` ending at a reference never proves the original exists or was inspected. Acquisition hashes identify local bytes, not historical authenticity. Traversal ends explicitly at missing documentary links. `actorStagesAt` returns attributed stage evidence, never a computed knowledge state. Date queries compare Gregorian days only and do not synchronize unverified clocks.
