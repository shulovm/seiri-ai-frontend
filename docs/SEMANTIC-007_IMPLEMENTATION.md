# SEMANTIC-007 — Isolated Claim / Assessment Implementation

## Decision and boundary

The approved SEMANTIC-006 contract is implemented as an explicit opt-in core module at `ground-core/claim-vnext/`. Its schema is **0.1.26**. The stable global core types, schema constant, readers, CLI, owner CLI, file-store and Human Interface remain **0.1.25**, byte-for-byte unchanged in Git. No live upgrade is activated.

The existing evolution pattern uses consecutive versioned ProjectState/StatePatch schema files and explicit normalization/rejection. This checkpoint follows that pattern with new files, preserving the complete 0.1.25 schema and stable API. Import the new module explicitly; never pass its states to stable APIs. The old validator, normalizer and writer reject 0.1.26.

Base checkpoint: `2a3ab4278e278e1d61027ddeea2787b5797c9b36` (HUMAN-008C).
Branch: `ground/semantic-007`.
Worktree: `/private/tmp/ground-semantic-007`.
This report describes the commit containing this file; the completion response gives its exact hash. No push is authorized or performed by this checkpoint.

## Implementation inventory

New files only:

- `docs/SEMANTIC-006_SCHEMA_PROPOSAL.md`: the previously approved proposal, preserved from the existing design artifact.
- `docs/schemas/ground-core-project-state.v0.1.26.schema.json`.
- `docs/schemas/ground-core-state-patch.v0.1.26.schema.json`.
- `ground-core/claim-vnext/types.ts`: explicit legacy/new union and versioned types.
- `ground-core/claim-vnext/validation.ts`: closed schema, pure invariants, read normalization and review-artifact validation.
- `ground-core/claim-vnext/artifacts.ts`: explicit immutable archive and predicate/assessment definition admission.
- `ground-core/claim-vnext/state-engine.ts`: insert-only mutation and shared before/after invariant verification.
- `ground-core/claim-vnext/readers.ts`: derived views, explicit Evidence relations and scope-aware Belief.
- `ground-core/claim-vnext/file-store.ts`: marked isolated root, exclusive writer, atomic snapshot replacement, exact read and request retry.
- `ground-core/claim-vnext/index.ts`: opt-in exports.
- `ground-core/__tests__/fixtures/claim-vnext.ts`: isolated FRUS86 fixture factory.
- `ground-core/__tests__/claim-vnext.test.ts`: 62 focused contract tests.
- `fixtures/claim-vnext/definitions.json` and `README.md`: test-only definitions and origin.
- `docs/SEMANTIC-007_REGRESSION.json`: complete baseline/final failure-name comparison.
- This report.

## Completion evidence (requested 45 points)

1. **Commit**: the local `ground/semantic-007` commit containing this report; exact hash in the completion response. No remote publish.
2. **Branch/worktree**: as above; created separately from the dirty original checkout.
3. **Changed files**: the new-only inventory above. Existing code, schema and tracked fixture files are unchanged.
4. **Schema**: 0.1.26, explicit opt-in, with required `claim_assessments`. The stable active schema remains 0.1.25.
5. **New Claim**: `contract: claim-proposition.v1`, predicate definition reference, explicit manifestation scope, existing proposition/provenance/time fields. `confidence` and stored assessment status are forbidden.
6. **Legacy handling**: mutually exclusive schema branches. Read normalization preserves confidence and does not create assessor, method, calibration or assessment. Carry-only legacy records cannot be created, updated or deleted by the new writer.
7. **Manifestation scope**: `entity_only`, or `frozen_artifact` / `stored_inspection_excerpt` with source Entity, artifact key/hash, exact selector and description. A selector must resolve exactly one stored string; no filesystem interpretation or remote fetch.
8. **Claim immutability**: the entire admitted record is immutable, including provenance and all timestamps. A valid isolated after snapshot still fails when compared with a changed before record. `created_at` and `updated_at` are equal for new records.
9. **Deletion/reuse**: deleting existing Claims or inserting any existing Claim ID fails, even an identical repeated insertion. Operations retry is separate from canonical insert.
10. **Assessment**: an independent record in `claim_assessments`, carrying target, assessor, purpose, pinned definitions, result, basis, rationale and action/record timestamps. It has no `updated_at`.
11. **Assessor**: kind/label alone fail. A same-Project Entity or nonblank namespaced external identity is required. No identity is inferred.
12. **Method/scale**: immutable test definitions resolve through an explicit archive. Identity, version, hash, pointer, procedure, permitted scale and declared input requirements are checked. Definition id/version rebinding within saved records fails.
13. **Result**: finite numeric 0..1 with compatible pinned scale and explicit numeric interpretation. UNASSESSED is not a number. No production probability policy is claimed.
14. **Evidence snapshot**: exact before-snapshot artifact and stored schema, selected Evidence/Observation IDs, frozen inputs and review artifacts. The snapshot must contain the same immutable Claim and cannot contain this assessment. Referenced Evidence→Observation selections must agree.
15. **Rationale**: nonblank short canonical text; optional pinned rationale artifact, mandatory if required by the method.
16. **Assessed time**: null remains unknown action time. It is not populated from `recorded_at`. Methods may require known/resolved action time using the existing temporal resolver.
17. **Append-only**: all previous assessments must survive unchanged. Update/delete/overwrite/reused ID fail through mutation and direct persistence.
18. **Idempotency**: persistent operations request key plus complete payload. Same key/payload returns the same assessment without changing snapshot bytes. Changed payload fails. A new key must use a new assessment ID, even for an equal score. PREPARED state is conservative on stale snapshots; no stale lock deletion is implemented.
19. **References**: Claim must already be an admitted new Claim in the same Project. Assessor Entity, definitions, snapshot identity, selected basis records and hashes are checked. Legacy Claim targets fail. Claim admission also requires a complete APPROVED review artifact, exact before-state/candidate/link binding and a stable namespaced request identity.
20. **UNASSESSED**: derived only from an intact, valid required collection containing zero assessments for the new Claim. Missing/broken collection throws.
21. **Legacy view**: exposes the original legacy record and numeric confidence, method/assessor NOT_RECORDED, calibration UNKNOWN, and zero new assessments. It fabricates no assessment ID or manifestation scope.
22. **Belief**: includes unassessed applicable Claims as positions. Multiple values in the same comparison scope produce CONTESTED. Supporting/contradicting Evidence and tension remain explicit.
23. **No aggregation**: raw per-Claim assessment records and counts only. Tests verify no effective confidence, average, maximum or selected latest winner. Scores do not suppress conflicting positions.
24. **Comparison scope**: Project/subject/predicate kind/predicate/pinned predicate definition plus manifestation identity. Artifact locator aliases and description do not alter comparison identity; different frozen bytes/selectors are not automatically equivalent. Legacy remains a separate scope.
25. **Applicability**: uses the existing canonical temporal reader. Null/null is unbounded; finite bounds use the existing half-open interval and offset handling. Unresolved/invalid query time is not converted to another timestamp. Native Date is used only to stamp the aggregate write, not to resolve temporal meaning.
26. **ClaimEvidenceLink**: explicit Claim→SUPPORTS→Evidence→Observation works. Belief can also return CONTRADICTS relations. These links remain separate from an assessment's frozen selected basis.
27. **FRUS86 Claim proof**: newly identified isolated Project, Document, textual Observation and Evidence, with unmodified content from existing tracked frozen input. Confidence-free scoped Claim plus link, scripted test review and assessment count zero. Source and limitations are documented in the fixture README.
28. **One assessment**: identified test system assessor, explicit test method/scale, test-only rationale, null action time; accepted and read raw.
29. **Multiple assessments**: both identities survive exact save/load, including equal results under different request keys. No fusion or effective score.
30. **Conflict proof**: true/false positions conflict without assessments; an assessment does not choose a winner. A different frozen scope remains separate.
31. **Normalization**: old 0.1.25 fixture loads into the new in-memory view with unchanged confidence and no fake assessments. Explicit copying into a fresh isolated test root proves compatibility round-trip; the source bytes are never rewritten.
32. **Old writer**: old patch version and confidence-bearing new Claim payload fail closed. The stable save API rejects new schema states.
33. **Old reader**: stable validator/normalizer reject 0.1.26; the new collection is not silently discarded.
34. **Round-trip**: full state equality, new scopes, assessments, legacy records, archived definition/basis bytes, review bindings and exact snapshot fingerprint stability are verified by an independent store instance.
35. **Direct-save guard**: `saveProject` locks, reads the stored before state, checks expected fingerprint and calls the same transition/admission checks. Schema-valid edits and unresolved new references fail without changing Project bytes. Historical immutability cannot be proven from one standalone snapshot; before-state comparison is essential. Direct hostile filesystem edits remain outside this API contract.
36. **Focused tests**: 62 PASS / 0 FAIL. They cover positive paths and rejection paths, including valid-shaped immutable edits, method input requirements, direct save, lock ownership and independent review recovery.
37. **Full regression**: baseline 3,896 total / 3,792 PASS / 104 FAIL; new 3,958 total / 3,854 PASS / 104 FAIL. Failure-name multisets are identical; new failures zero. See the machine-readable regression record. These are the existing missing-fixture failures; they were not fixed or suppressed. An initial restricted run additionally failed the existing npm CLI subprocess test; an unrestricted baseline and final run removed that environmental difference.
38. **Typecheck/build**: `npx tsc -p ground-core/tsconfig.json --noEmit` PASS; `npm run build` PASS. The Vite build validates the unchanged application; new core TS is covered by its dedicated typecheck and tests.
39. **Human Interface**: unchanged. Future UI work must distinguish new/legacy views, display raw assessments and reference-resolution failures, and never synthesize a representative confidence. No such UI is connected here.
40. **Live fingerprint**: start and end both `9ff0d8070296d2d5493b618b13d75beab003581a6f7011ae642a53f46fc453cf` for Project `088d09dc-dfc5-487a-8f8f-22d2b33a9249`. Only the requested exact-byte hash checks accessed that live file.
41. **Live unchanged**: no live writer/session, migration, root config, admission or publish. Expected bytes are unchanged; the previously established Claim 0 state is maintained.
42. **Architecture gaps**: the module is isolated, not wired into the stable CLI/store/UI. Its marked-root lock/atomic replacement is a test persistence implementation, not a replacement for STORAGE-003 ownership or a power-loss-durability claim (no fsync proof). Production artifact registration, retention, definition governance, review authorization and receipts are not supplied. The validator checks declared method/qualification structure and pinned inputs; it cannot establish that a human review occurred, that a method was correctly performed, or that calibration is empirically valid. Retraction/correction, generic manifestation equivalence, aggregation and nonnumeric results remain outside v1.
43. **Next gate readiness**: the isolated schema/read/mutation/persistence contracts are ready for review at the next gate. This is not authorization to activate them in live storage or to admit FRUS86.
44. **Recommended next checkpoint**: independent contract and admission-boundary review, especially production authority, definition/archive governance, physical upgrade plan and old-reader rollout. Only after that should a separately approved checkpoint consider live integration. No SEMANTIC-008 work started.
45. **Blockers**: none for this isolated implementation checkpoint. Live admission remains blocked on production authority, method/definition policy and archive integration, migration/rollout approval and the specific Claim admission review. Existing missing-fixture regression failures remain a known repository verification limitation.

## Verification commands

```sh
node --import tsx --test ground-core/__tests__/claim-vnext.test.ts
node --import tsx --test --test-reporter=tap ground-core/__tests__/*.test.ts
npx tsc -p ground-core/tsconfig.json --noEmit
npm run build
```

Tests ran against the unmodified baseline worktree and the isolated candidate using the same available dependencies/runtime. Full regression exit remains nonzero because the same 104 baseline failures remain. The failure-name comparison excludes suite-level parent failures and retains test-level names with suite paths.

**Isolated implementation does not authorize live Claim admission. An expressible assessment record does not establish a confidence method or the authority to create that record.**
