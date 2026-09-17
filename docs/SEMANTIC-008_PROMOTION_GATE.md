# SEMANTIC-008 — Schema Promotion / Live Compatibility Gate

## Decision: HOLD (canonical integration), compatibility checks PASS

SEMANTIC-007 was pushed to `origin/ground/semantic-007` and `git ls-remote` returned exactly `3c96feba22bc6b4ed44d86de3e0072a09ea16b42`.
Its remote checkpoint is **GROUND Semantic Core — Claim / Assessment Isolated Contract v0**.

This audit does **not** promote the implementation into canonical master. It does not claim a completed integration test. The tested worktree contains the exact approved SEMANTIC-007 tree plus this audit script/report; production code, schema, fixtures and UI were not modified in SEMANTIC-008.

The blocking issue is the unresolved integration lineage, not the intentionally absent production assessment policy:

- Remote and local master agree at `0d9797fb13cb1f1d5ebf8f9aa3d30e111eff7249`. This is the remote default/mainline candidate, but it does not contain STORAGE-003 ownership or the latest live/provenance Human Interface implementation.
- The separate local `ground/core-integration-001` is `ce240537e44bf428566103e86954dcd790028b5a`. It contains a different approved core-composition/Contract Evolution gate. It is not a remote branch returned by the checked remote ref query.
- Latest Human Interface is `2a3ab4278e278e1d61027ddeea2787b5797c9b36` (HUMAN-008C), the parent of SEMANTIC-007. This lineage contains STORAGE-002/003 and the live/provenance readers used by the existing Explorer.
- Master vs SEMANTIC-007 has 38 / 22 unique commits, with common ancestor `fbfafef737132c8049998f9ca7d1d5f68fa90c56`. Core integration vs SEMANTIC-007 has 25 / 37, common ancestor `650a8c00416b77d36c7318bc73fd8f1991f95a4e`.
- Non-destructive virtual merge of master and SEMANTIC-007 reports **17 conflicting files**: persistence, package config and Human Interface files. The other core integration branch has **3 conflicts** (`.gitignore`, core index, package config) and an exact approved-composition gate requiring a separately reviewed transition record. The historical 24→25 approval does not automatically authorize 26 or replace the Human/Storage lineage.

No branch was reset, switched underneath existing work, or merged. The user was asked which canonical integration base to adopt; no answer was received during this audit. The absence of an answer is not treated as approval. A fresh audit branch `ground/semantic-008` at `/private/tmp/ground-semantic-008` preserves the results. Its commit is an **audit checkpoint**, not the proposed promoted Contract v0 checkpoint.

A safe resume first fixes the intended canonical base and the exact composition of current Human/Storage support. It then resolves that candidate's conflicts and runs its own before/after regression. The results below must not be reused to assert that an untested merged tree passed.

## Semantic diff audit: all 16 SEMANTIC-007 files

- **Schema:** the new ProjectState 0.1.26 and StatePatch 0.1.26 JSON files. Add explicit new contracts and carry-only legacy union. Existing 0.1.25 definitions are unchanged; no 0.1.25 caller selects them implicitly.
- **Types:** `ground-core/claim-vnext/types.ts`. Separate `SCHEMA_VERSION`, union and assessment collection. The stable `ground-core/types.ts` still declares 0.1.25. No existing type is replaced.
- **Validation:** `claim-vnext/validation.ts`. New schema/pure-invariant/admission checks and explicit in-memory normalization. The explicit new normalizer returns 0.1.26; it is not the stable normalizer and does not write. Stable validator behavior is unchanged.
- **Artifact validation:** `claim-vnext/artifacts.ts`. Opaque registry keys, pinned bytes/definition references and scoped selector/assessment admission. Runtime imports do not point to test fixture paths. Registry contents are injected; production retention and authority are not thereby established.
- **Mutation:** `claim-vnext/state-engine.ts`. Insert-only operations and full before/after comparison. Does not replace stable generic upsert. All existing admitted records remain unchanged; new legacy-shaped Claim insertion fails.
- **Readers / Belief:** `claim-vnext/readers.ts`. Explicit new APIs, separate legacy view, scoped positions, raw assessment lists and no score fusion. Stable `assessBeliefAt` is unchanged and remains the 0.1.25 behavior.
- **Storage compatibility:** `claim-vnext/file-store.ts`. Marked isolated roots and explicit initialization, archive, direct-save comparison and operations retry. It does not replace or alter stable file-store/owner CLI. Its test-root persistence is not promoted to STORAGE-003 production ownership by this audit.
- **Export boundary:** `claim-vnext/index.ts`. Explicit submodule exports only; stable `ground-core/index.ts` did not acquire schema-aware dispatch or silently change default types/readers.
- **Tests:** `ground-core/__tests__/claim-vnext.test.ts`, 62 tests. Adds test coverage only.
- **Fixture factory:** `ground-core/__tests__/fixtures/claim-vnext.ts`. Constructs explicitly isolated test identities from existing tracked frozen source content. Not a production constructor or live data source.
- **Definition fixture:** `fixtures/claim-vnext/definitions.json`. Pinned test-only predicate, method, scale, qualification and review process. Not production authority.
- **Fixture documentation:** `fixtures/claim-vnext/README.md`. Origin, hash and test-only limits.
- **Design documentation:** `docs/SEMANTIC-006_SCHEMA_PROPOSAL.md`. Previously approved design record; no runtime effect.
- **Implementation documentation:** `docs/SEMANTIC-007_IMPLEMENTATION.md`. Scope, evidence and remaining gaps; no runtime effect.
- **Regression record:** `docs/SEMANTIC-007_REGRESSION.json`. Failure-name baseline; no runtime effect.

Thus existing 0.1.25 entry points have no behavior change from the isolated commit. This additive fact alone does not settle which divergent canonical lineage may receive it.

## Completion evidence (39 requested items)

1. **SEMANTIC-007 push:** exact remote branch match confirmed; checkpoint name above. Only this branch was pushed.
2. **Integration base:** unresolved among the lineages above. Audit base is exactly the approved SEMANTIC-007 commit; it is not relabeled canonical master.
3. **Semantic diff:** every changed file classified above, with effects on 0.1.25 distinguished from explicit vNext use.
4. **Promotion commit:** none, because the gate is HOLD. The local audit commit is separate.
5. **Branch/worktree:** `ground/semantic-008`, `/private/tmp/ground-semantic-008`. No original checkout changes.
6. **0.1.25 read compatibility:** all three registered proofs and actual live read successfully. Important correction: the three immutable proofs are physically **0.1.24**, normalized by the existing stable path to **0.1.25**; they are not stored 0.1.25 files. HUMAN-001 has 18 legacy Claims, Round4 147, B15 0. All confidence values survive.
7. **0.1.25 write compatibility:** normalized proof states saved and re-read only in disposable roots. Stored schema stays 0.1.25; Claim records remain equal; there is no `claim_assessments` field. Repeated save of unchanged state has stable exact-byte fingerprint.
8. **Implicit migration:** no load/save path upgrades 0.1.25 to 0.1.26. The new normalizer is opt-in; dry normalization never writes. Existing 0.1.24→0.1.25 compatibility is a pre-existing behavior and is not confused with the new boundary.
9. **Explicit isolated creation:** an explicit fresh marked test root creates a 0.1.26 container through the approved isolated initializer, then admits a new Claim and Assessment, saves, and reads it back. It is not a new production bootstrap API.
10. **Old writer rejection:** stable save rejects 0.1.26 state, new Claim shape and new collection. Existing SEMANTIC tests also reject old patch/confidence paths into 0.1.26.
11. **Old reader rejection:** stable validator and normalizer fail on 0.1.26. New assessment collection cannot be silently dropped.
12. **Claim immutability:** all 62 SEMANTIC tests pass, including individually schema-valid changes to subject, predicate, value, scope and applicability rejected against before state.
13. **Assessment append-only:** update/delete/same-ID changes fail; new reassessment needs a new record identity. Same-request retry remains an operations-level exception, not overwrite permission.
14. **Direct-save protection:** SEMANTIC tests verify before/current fingerprint checks, immutable-history comparison and new-reference admission even without using the state engine. A single detached snapshot cannot independently prove its mutation history.
15. **Live writer safety:** the actual writer implementation was exercised in a **disposable owned test root** under `ground-local-cli-v0`. Injection of `claim_assessments`, vNext Claim and 0.1.26 state failed without changing stored bytes. No actual live owner session was acquired.
16. **Runtime compatibility:** actual runtime config and root manifest still match canonical-live mode, absolute root and owner identity. Manifest carries storage ownership contract, not a schema capability range. Actual snapshot schema is checked independently.
17. **Human Interface compatibility:** default regression 132 PASS / 4 explicit live skips / 0 FAIL; opt-in live UI 13 PASS / 0 FAIL; opt-in live provenance/HTTP 17 PASS / 0 FAIL. Source resolver, catalog, browse, Observation and frozen-source code are unchanged.
18. **Historical live read:** stored/read schema 0.1.25; 11 document Entities, 16 Observations, 16 Evidence, Claim 0. Core validation and requested ID match. Claim 0 is accepted normally.
19. **Legacy Claim proof:** 165 legacy Claims across HUMAN-001 and Round4 preserve numeric confidence; reader qualification stays method/assessor NOT_RECORDED and calibration UNKNOWN; no synthetic assessment. Repeated stable Belief queries before/after isolated 0.1.25 round-trip are equal.
20. **Belief version boundary:** stable `assessBeliefAt` for 0.1.25; explicit `assessBeliefVNext` for 0.1.26. No unconditional redirection of old callers. The generic schema-aware registry remains a proposal below.
21. **Mixed shapes:** allowed by 0.1.26's exclusive schema union, consistent with SEMANTIC-007. A new mixed test Project round-trips 1 legacy Claim, 1 new Claim and 1 assessment. Views and comparison scopes remain distinct; an assessment targeting the legacy Claim fails. Legacy marker is the derived view kind; no invented marker is added to old stored records.
22. **Production Assessment:** BLOCKED. No production writer/CLI path to the new isolated module has been enabled; production assessor/method/retention authority is not supplied.
23. **Production new Claim:** BLOCKED. Test review artifacts do not constitute live admission or publish approval. Live Claim count remains zero.
24. **Feature gating:** current separation is structural: stable production writer vs opt-in marked isolated writer. Do not add a single enabling flag that grants read/write/migration/admission simultaneously.
25. **Schema registry:** no unified version/capability registry exists in this lineage. Version-qualified read dispatch and separate write/migration/admission capabilities are proposed below, not silently installed during an unresolved integration.
26. **Migration mechanism:** existing `migrateProjectState` / `normalizeProjectState` provide historical in-memory normalization through 0.1.25. There is no approved explicit 0.1.25→0.1.26 production migration operation/receipt. The vNext read normalizer and isolated initializer must not be repurposed as automatic live migration.
27. **Claim-0 dry migration:** in-memory live 0.1.25→0.1.26 delta is exactly replacing `schema_version` and adding `claim_assessments: []`. Project/collection contents and timestamps otherwise compare equal. No serialization is written to live or any alternate live-copy file.
28. **Legacy dry migration:** after the existing proof normalization to 0.1.25, the same two-field delta suffices; old Claim records/confidence remain exact. No confidence→assessment conversion. This is not a claim that raw 0.1.24 bytes need only two changes.
29. **Rollback:** live bytes/manifest/runtime are unchanged. The existing 0.1.25 code remains sufficient to read them. Reverting only the added code/audit would require no storage rollback. A future migration changes this assumption and needs its own plan.
30. **SEMANTIC tests:** all 62 PASS, included in full regression. Additional compatibility script also PASS.
31. **Full core:** approved SEMANTIC-007 baseline 3,854 PASS / 104 FAIL; this audit tree 3,854 PASS / 104 FAIL. Test-level failure-name multiset including suite paths is identical, new failures zero. These numbers concern the audit lineage, not either unmerged canonical candidate.
32. **Human regression:** as item 17; core TS, Human server TS, audit-script typecheck and Vite build PASS. No UI feature implementation.
33. **Storage regression:** STORAGE-002/003 tests plus SEMANTIC tests: 92 PASS / 0 FAIL. Covers atomic save, exact reads, schema rejection, manifests, ownership and locks. All writer tests use disposable roots.
34. **Browser smoke:** prior localhost:3008 server was stopped; its initially visible cached page was not counted as proof. A dedicated GET-only router plus unchanged built UI at localhost:3010 loaded the actual live Project. Projects→live Project→FRUS395→the `c395-first-fire` Observation→frozen input panel succeeded; index had 3 Observations, Claim count 0, frozen panel identified the matching report. This tests the audit build, not a promoted canonical build. The temporary preview is stopped after the audit.
35. **Live fingerprint:** start/end match `9ff0d8070296d2d5493b618b13d75beab003581a6f7011ae642a53f46fc453cf`. No live writes, migration or publish.
36. **Decision:** HOLD for formal code promotion. Standalone compatibility checks pass; a selected/reconciled canonical integration candidate has not yet passed its own gates.
37. **Remote checkpoint:** SEMANTIC-007 Isolated Contract v0 exists and matches exactly. No promoted Contract v0 remote checkpoint or promotion tag is created. SEMANTIC-008 audit is local only.
38. **Remaining blocker:** fix canonical integration authority/base and approved composition of current Human/Storage support, resolve actual conflicts, then run merged-tree baseline/regressions and any applicable Contract Evolution gate. Production method/assessor/retention remain deliberate admission blockers, not reasons to reject schema expressibility itself.
39. **Next recommendation:** first resume SEMANTIC-008 with a fixed integration target. After successful code promotion, prefer **SEMANTIC-009 — Production Artifact / Admission Authority** before actual live migration: it defines the review/archive/receipt obligations that the migration and admission operations must preserve. MIGRATION-001 may then implement the separately approved explicit mechanism. Neither next checkpoint started.

## Capability registry proposal (not implemented)

The minimal new canonical front door should distinguish four things, without changing the stable default writer:

- **Read support:** 0.1.25 through its stable normalization and legacy readers; 0.1.26 through explicit validation and vNext readers. Return a discriminated schema-qualified result; do not erase the version by casting the union.
- **Write support:** 0.1.25 retains current owner/atomic persistence; 0.1.26 remains isolated-only until production write capability is independently admitted.
- **Migration support:** no 25→26 physical operation available yet. Pure normalization is not permission to publish normalized bytes.
- **Admission authority:** vNext production Claim and Assessment creation both blocked independently of read/schema support. Test artifact availability is not production authority.

Stored schema, read schema and capability range must remain separate. Existing manifests need no semantic field invented for this proposal. The exact registry API belongs in the selected integration candidate and requires its tests; this audit deliberately does not call unimplemented registry behavior a PASS.

## Reproduction and artifacts

Machine-readable evidence: `docs/SEMANTIC-008_VERIFICATION.json` (includes failure names, merge-conflict lists, live and proof observations).

```sh
node --import tsx scripts/semantic/verify-semantic-008.ts
# Explicit optional live read; all writes still use disposable roots only:
node --import tsx scripts/semantic/verify-semantic-008.ts --runtime-config '/absolute/path/to/approved/runtime.json'
node --import tsx --test --test-reporter=tap ground-core/__tests__/*.test.ts
TSX_TSCONFIG_PATH=server/human-interface/ui-test-tsconfig.json node --import tsx --test server/human-interface/*.test.ts server/human-interface/*.test.tsx ground-core/__tests__/observation-evidence-read.test.ts ground-core/__tests__/epistemic-core.test.ts
npx tsc -p ground-core/tsconfig.json --noEmit
npx tsc -p server/human-interface/tsconfig.json --noEmit
npm run build
```

The audit script's dependency on the SEMANTIC-007 fixture factory is intentional test scaffolding. The production `claim-vnext/` module itself has no test-artifact path import. The audit does not create source facts or write new records into canonical live storage.
