# HISTORICAL-FREEZE-002 — Immutable Historical Dependency Resolution

Development/integration replay support only. Base: `45140c001bbc6076496c7a6e12971509362ba665` (clean master including STORAGE-003). This is not the held Phase A worktree, and does not integrate LIVE-005B or SEMANTIC-007.

## Authority and APIs

`HistoricalRepository.resolveHistoricalDependency` validates an exact commit, original relative path, regular blob mode/type, blob OID, SHA-256 and byte length against local Git objects. It ignores ambient Git redirection/replacement configuration, rejects external object alternates, and requires the exact explicit repository root. Missing objects fail closed; the resolver never fetches, searches other branches/files or reads current source content.

The two versioned adapter manifests are pinned by SHA-256 in `scripts/historical-dependencies/pins.ts`. They add metadata; original manifests, source, datasets, review package, and expected hashes remain byte-identical.

- `repro-001-artifacts.json`: 182 verification-only identities adopted in REPRO-001 `9cb9dc6fe2ac522679abc970c5a7daa08bcd253b`. All are reverified against the original artifact manifest. Only the conflicting `substrate.ts` current-path check is redirected in the existing reproducibility test; the other 181 current-file checks remain intact. No bulk fixture migration.
- `live-003b-review.json`: 88 exact dependencies from `25ba36665c1034c1317e7556abea007bb08da539`, including 39 local TS modules, 47 data/schema assets, package.json and package-lock.json. Both distinct substrate identities coexist without rewriting the current source.

`materializeHistoricalCheckpoint` is separate from verification. It accepts only registered execution manifests, resolves all bytes first, then writes a newly created temporary tree preserving original relative paths. No code comes from another/current worktree. Verification-only artifacts need no disk materialization.

## Execution closure

The original `historical-injection-freeze.test.ts` is the entrypoint. Static TypeScript imports/exports are traversed (including type-only edges); its full local closure is pinned. `closure-discovery.json` records the graph and filesystem input audit. `package.ts` reads the dataset, selected input, manifest and substrate source; `validate.ts` reads literal schema filenames. No dynamic local imports were found. Undeclared relative imports/dynamic imports fail materialization.

Verified TS is transpiled with the installed TypeScript compiler to adjacent JS without editing original TS or rewriting import paths. Generated JS is a toolchain transform, not a claim of byte equality to historical TS. The emitted files and all runtime dependencies are fingerprinted. Exact original substrate.ts remains present for the package's own hash verification.

Node and npm implementation are external toolchain inputs, not Git artifact authority. Runtime package versions must match the checkpoint package-lock; regular installed package files are copied into isolated node_modules with symlinks refused. The exact copied runtime tree, Node and TypeScript versions are recorded. This is not npm registry-tarball attestation or complete hermetic toolchain provenance. No npm install/network operation runs inside the resolver.

Execution uses Node 24+ permissions, cwd inside the temporary tree, read permission for that tree only, no filesystem-write or subprocess permission, and no inherited NODE_OPTIONS/NODE_PATH/tsconfig aliases. Permission tests verify external reads/imports, writes and subprocesses are refused. These are boundaries for audited historical code, not a general hostile-code sandbox service.

Inventory checks before and after execution reject symlinks, missing/modified files and unexpected injection. Receipts include checkpoint ID, manifest hash, verified source fingerprint, materialized/runtime tree fingerprint and exact entrypoint identity. Temporary trees have explicit cleanup; no canonical storage is opened.

## Existing tests and future integration dispatch

The original 11 review tests execute unchanged inside that historical closure. `scripts/repro/historical-replay.test.ts` asserts their success and prints their results/receipt. The full-core runner dispatches this one historical test file through that bridge instead of importing it against mutable current modules. If a future candidate contains changed bytes at that test path, the bridge fails rather than silently substituting older assertions. Original test names and child counts remain visible; parent test counts must not be misreported as including child assertions.

The runner's operator-invoked setup explicitly transfers the two registered histories from the selected local repository to its existing disposable Git workspace. This is local preparation, not remote fallback inside resolution. Standalone callers must already possess the required Git objects. Git-less/shallow environments missing objects fail the historical audit, never skip it.

Run:

```
node --import tsx --test scripts/repro/historical-dependencies.test.ts scripts/repro/historical-replay.test.ts
npx tsc -p scripts/historical-dependencies/tsconfig.json
npx tsc -p scripts/repro/tsconfig.json
npm run test:ground-core
```

## Scope and replay order

No cache, bundle fallback, production endpoint, Claim admission, migration or Human UI changes. The Phase A HOLD patch remains untouched. Remote retention should use separately approved protected checkpoint refs/tags; none are created here. Current reachability is not a perpetual retention guarantee.

Recommended future fresh replay order: exact previously approved base `0d9797f…`, this support commit, LIVE-005B, then (only after Phase A passes) SEMANTIC-007. Because this support branch descends from master `45140c0…`, merging it also includes the already-approved STORAGE-003 replay ancestry; remeasure that intermediate baseline and do not double-apply it. Do not silently rebase the replay onto a newer origin/master. This document does not authorize resuming Phase A.
