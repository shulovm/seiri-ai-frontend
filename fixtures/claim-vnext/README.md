# SEMANTIC-007 isolated contract fixture

This directory contains **test-only definition artifacts**, not a live confidence policy or an admission authorization. The executable fixture factory is `ground-core/__tests__/fixtures/claim-vnext.ts`; its Project, Entity, Observation, Evidence, Claim, link and assessment identities are generated only inside tests. No complete live ProjectState is copied. Test stores use fresh temporary directories and are removed after each test.

The fixture reads existing tracked frozen sources without changing their bytes:

- `fixtures/human-interface/provenance/historical-round1-v1/005/selected-c86-request.json`: FRUS 1904 document 86 metadata and its **stored inspection excerpt**, SHA-256 `43b917d9e171e08d53e2291da6bbca9ae2e079ff7f6339a3c04ceb17225b308f`.
- The adjacent `selection-manifest.json`: the recorded inspection-report content for `c86-request` (researcher-authored paraphrase).

The test copies that report content into a newly identified textual Observation, whose `observed_at` stays null, and constructs an explicit Evidence reference. It does not assert that the paraphrase is a historical event, a verbatim public-source excerpt, or historical truth. Provenance describes its frozen experimental source; it is not a live admission authority. New record timestamps are isolated test recording timestamps, not historical occurrence times.

`definitions.json` pins predicate, method, scale, qualification and scripted admission-review definitions. SHA-256: `aa0e2c83e38e5b26dbcbd9c705528eb41abd78859b6ce911874b6d824a0590f9`. Definition references carry id/version/artifact hash/JSON Pointer. Intra-artifact references use local pointers, avoiding a self-hash cycle. Treat these bytes as immutable; a changed definition needs a new version and reference.

The FRUS proposition concerns one selected stored string in the frozen artifact, with explicitly unbounded applicability. Its review artifact is generated from the complete candidate, proposed links and the before snapshot. The scripted review is labeled TEST ONLY and is not a ClaimAssessment. The initial Claim has no confidence and no assessments. Explicit test assessments declare 0.25 (and other test values), with an identified test system assessor and `not_established` calibration. These numbers do not assess the history.

Counterpositions, alternate scopes, invalid references and temporal edge cases are deliberately isolated contract tests authorized by SEMANTIC-007. They are not new saved live Reality. Random test IDs mean independently generated snapshots have different byte fingerprints; save/read within a run proves exact-byte fingerprint stability.

Reproduce from the worktree:

```sh
node --import tsx --test ground-core/__tests__/claim-vnext.test.ts
npx tsc -p ground-core/tsconfig.json --noEmit
```

No live root configuration, default-root fallback, migration, UI wiring, or live publish is provided here.
