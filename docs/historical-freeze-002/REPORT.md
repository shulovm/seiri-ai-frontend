# HISTORICAL-FREEZE-002 result

Resolver/replay support gate: **PASS with unchanged known core baseline failures**. The full-core process is not all-green: 2 existing composition-gate failures remain. No Phase A replay or canonical convergence claim is made.

1. Branch/worktree: `ground/historical-freeze-002`, `/private/tmp/ground-historical-freeze-002`, created clean.
2. Base: `45140c001bbc6076496c7a6e12971509362ba665`, fetched current master with STORAGE-003 already integrated. It preserves the approved Core/repro lineage without using the held merge.
3. Commit: the dedicated commit containing this report; exact final hash is reported after commit/push, not self-embedded.
4. Changed files: new `scripts/historical-dependencies/` resolver/materializer/pins/typecheck config; new `docs/historical-freeze-002/` immutable adapter manifests/discovery/receipts/report; two new repro test files; bounded changes to reproducibility test and existing isolated test runner. No core semantic source changes.
5. Manifest: version/checkpoint/role/commit/original path/blob/SHA/length/resolution mode, plus entrypoint and declared external imports for execution. Manifest hashes are pinned in code.
6. Resolver: exact local commit tree → regular blob → bytes; no current-file authority.
7. Validation: commit exists/type, path and ancestor tree mode, regular blob OID/type, SHA-256, length; mismatch is an error.
8. Fallback: none. No remote fetch, alternate branch/path, latest revision, cache or bundle lookup. Ambient Git variables and replacement objects are disabled; external alternate object databases rejected.
9. Discovery: 39 local TS modules, 47 JSON/schema assets, package/lock metadata = 88 dependencies for the unchanged review entrypoint. See closure-discovery.json.
10. Closure: required local graph at LIVE-003B, not full repository export. Node/compiler/npm are explicitly external toolchain inputs, npm versions checked against historical lock and copied bytes fingerprinted.
11. Materialization: new OS temporary tree, verified bytes only, original relative layout, no symlinks, no overwrite, explicit cleanup.
12. Import isolation: audited static graph, no undeclared/dynamic imports, adjacent deterministic JS output from verified TS; Node read permission only inside the tree, cleared environment, no FS writes/child processes. Injection and outside-import negative tests PASS.
13. APIs: byte resolver and materialize/execute lifecycle are separate. Execution accepts only a registered materialization handle; root/entry/verification cannot be replaced through public receipt mutation.
14. Master substrate: 12,145 bytes, blob `91a82baeec227c6c9407894b0b399e0443367428`, SHA `96b42fee5b7350a5aa83c43dfd5c6c185ee6e0918d2c5091ce8ecafd9b6bf79a`, PASS.
15. LIVE-003B substrate: 12,572 bytes, blob `477e33b792f86281148a661de978537f86b23a7c`, SHA `4c23a611bf0ada6483df5cf62270dbae9218bb50ec4ac472b821573cd847d6ef`, PASS.
16. LIVE-003B execution: original 11 review assertions PASS, run from verified B closure. The historical package reads and verifies B substrate.ts itself. Its publish refusal remains enforced.
17. Dual coexistence: A/B resolve in the same process and repo; distinct OID/hash/bytes, no rebinding.
18. 182 artifacts: all match original adopted manifest expectations via Git. Only conflicting substrate current-path verification is adapted; other 181 current checks remain.
19. Worktree independence: focused test covers three distinct cwd locations. Additional read-only proof resolves both identities from three actual worktrees (this branch, core-integration-001, live-005b), same results despite current source differences.
20. Security: wrong/missing commit/path/OID/SHA/length, tree/blob mismatch, traversal, absolute/backslash paths, symlink escape, alternate repository/missing .git, ambient Git redirection, root rebinding, injected files, outside read/import, write/child-process denial, opaque execution handles covered. No known new failure.
21. Offline: local Git objects suffice. Missing objects fail; the operator-run existing repro setup explicitly transfers registered histories locally into its scratch Git repo. No Git-less replay or automatic network repair.
22. Remote retention: A is reachable from fetched origin/master; B from origin/ground/live-003b and origin/ground/live-005b. Durable protected refs/tags remain a separate retention policy; none created.
23. Original expected hashes: unchanged. New manifests reproduce original A expectations and B projection hash; do not replace old manifests.
24. Old package bytes: fetched from exact B blobs, unchanged. No old package is deleted or promoted.
25. Current substrate: unchanged from base. No old code rollback, no Phase A worktree mutation.
26. Historical tests: focused initial 23/0; final full suite includes one additional repository-root immutability test, so 24 support tests PASS. The original review child suite is separately 11/0. Existing master Historical tests and exact-byte guard PASS.
27. Full core: base **4,108 PASS / 2 FAIL / 4,110 tests**; final **4,132 PASS / 2 FAIL / 4,134 tests**, plus separately reported 11 historical child assertions. Failure names/stages/causes match base, new failures 0. See verification.json. No tests or expected values were deleted/rewritten to remove failures.
28. Typecheck/build: core, Human server, repro and resolver typechecks PASS; build PASS. No UI changes.
29. Live fingerprint start/end: `9ff0d8070296d2d5493b618b13d75beab003581a6f7011ae642a53f46fc453cf`, unchanged. No owner session/save/migration. Held Phase A binary patch SHA remains `8a0976aad3877c782d2662725fa8a804d6b964268a67a63256ea36f5a07bdef5`.
30. Remote: only ground/historical-freeze-002 is the authorized push target; exact commit equality is verified after push and reported separately.
31. Limits: development/audit Node 24+ only; installed npm/compiler not registry-tarball attested; trusted reviewed code, not hostile-code sandbox; concurrent same-user tampering is outside scope. No bundle fallback, live code admission, Git-less deployment proof or permanent ref-retention guarantee.
32. Replay order: approved exact base 0d9797f → resolver tip (includes master’s STORAGE-003 replay ancestry through 45140c0) → LIVE-005B → Phase A gate → SEMANTIC-007 only under its separately authorized continuation. Preserve ancestry, do not duplicate Storage commits. Existing intermediate baseline must be measured at each step.
33. Blocker: no resolver-specific blocking regression. Known 2 composition failures remain; actual Phase A convergence still needs fresh replay. A later evolved review test fails dispatch rather than losing assertions.
34. Readiness: support implementation is ready to propose for fresh Phase A replay, not proof that replay has passed. GROUND-INTEGRATION-002 was not resumed; master and the integration branch were not updated.

Known failures retained:

- `current candidate has exactly base plus approved core and enumerated contract implementation scope`: unapproved candidate path set.
- `unapproved current core bytes are rejected even when historical checkpoint integrity passes`: the same path-set guard rejects before the expected byte-mismatch stage.

Execution receipts record the historical manifest/source tree, emitted/runtime tree, original entrypoint identity, Node 24.15.0, TypeScript 5.9.3 and copied npm versions. The fixture-only `Claim` creation is confined to the original review test's in-memory state; production Claim/Assessment admission remains BLOCKED.
