# HISTORICAL-FREEZE-004: family-scoped verification

This is audit/test tooling, not a runtime adapter, publish command or canonical data model.
The implementation base is `64c545981f7cb2d8ece3e635ab0c4c796a910884` (HISTORICAL-FREEZE-002),
which includes STORAGE-003 capability. Neither integration HOLD worktree is an input.

## Reproduce

With Node 24+ and installed dependencies matching the historical lock versions:

```sh
node --import tsx scripts/historical-dependencies/verify-families.ts /absolute/path/to/repository
node --import tsx --test scripts/repro/historical-family.test.ts scripts/repro/historical-replay.test.ts
node node_modules/typescript/bin/tsc -p ground-core/tsconfig.json
node node_modules/typescript/bin/tsc -p scripts/historical-dependencies/tsconfig.json
node node_modules/typescript/bin/tsc -p server/human-interface/tsconfig.json
npm run test:ground-core
npm run build
```

The explicit repository must already contain each pinned Git object. No resolver or family API
fetches objects, follows a branch name, discovers a parent repository, uses worktree source,
or substitutes regenerated inputs. The full-core runner's separate setup imports exact histories
from the explicitly selected **local** repository into its disposable test repository.
Missing objects fail closed. Historical tests are never run against the current core implementation.

## Four registered environments

- LIVE-003-review @ `25ba36665c1034c1317e7556abea007bb08da539`: original review 11 tests.
- LIVE-003-inspection @ `a6f4de1ff92f8ce2e6e6c16de66e714b68b97f9f`: original inspection 13 tests.
- LIVE-004 @ `b361136770d48b952164cb40900554c008ad06f4`: original batch 13 tests.
- LIVE-005 @ `1a5cd833b96c40aea87752f86dea9949db661ecd`: original inherited inspection,
  batch and expansion chain, 57 tests. This chain contains all 51 formerly failing tests.

Repeated tests across checkpoints are intentional. The same path at different commits has a
different authority. A family name without an exact checkpoint is insufficient.

The JSON manifests are SHA-pinned in `family-pins.ts`. Each file additionally has commit,
original repository path, blob OID, raw SHA-256 and byte length. Manifests specify source roots,
type roots, entrypoints, verification tests, inputs, expected artifacts/fingerprint, compiler
configuration and schema context. Materialization only accepts these registered manifest bytes.
Updating a package or adding another environment requires a reviewed new manifest identity.

## Code, types and assets

All local TypeScript imports/re-exports, type-only imports, literal dynamic imports and operational
source files included in the manifests resolve within the same checkpoint. The four environments
contain respectively 42/42/45/52 TypeScript roots and 102/105/115/141 total Git files.
The historical schema asset set and inherited package witnesses are deliberately broader than
just executed modules: file-map fingerprint verification reads files which are not runtime imports.
All materialized TypeScript, including operational CLIs, is typechecked. No current `types.ts` is used.

The original `ground-core/tsconfig.json` supplies target, NodeNext module resolution, strictness,
Node types and noEmit. A generated config only supplies the explicit historical file list,
root boundary and disables incremental output. Unknown extends/references/aliases/plugins fail
closed. `--listFiles` must contain only pinned historical files or copied external dependencies.
Current root options are not consulted. Execution JS is a receipted ES2022 transform of checked
original TS; the original TS remains present and hash-verifiable.

All four historical lockfiles agree on TypeScript 5.9.3 and @types/node 22.19.20. Installed versions
must match the historical lock; TypeScript used for emission must match the copied compiler.
External package dependencies are copied recursively as regular files, never symlinked into the
current checkout. Their versions and full tree hashes are receipted. Registry tarball attestation,
Node binary pinning and native platform equivalence are out of scope. A dependency-version mismatch
fails; there is no installation or substitution fallback.

## API and execution permissions

`verifyHistoricalFamily(repositoryRoot, manifestName)` resolves identities, materializes a new tree,
checks module closure and runs the historical compiler. It returns an opaque handle and receipt.
It does not run a publish/review operational CLI. `executeHistoricalFamilyVerification(handle, cwd?)`
runs only registered original tests and, where applicable, historical `verifyFreeze()`.

Receipts contain family, checkpoint, manifest hash, original/materialized tree fingerprints,
historical/effective compiler config identities, compiler/Node/npm versions, schema context,
resolved type files and test/package-fingerprint results. They are audit outputs, never ProjectState.
Public handle/receipt mutation cannot redirect the private execution capability. Before and after
execution, the entire source/compiler/dependency tree must match its recorded inventory.
Unexpected files, symlinks or mutations fail. Scratch is a separate disposable root: original
recovery tests may write there, but not into historical sources or live storage. Cleanup removes both.

Child Node processes receive explicit filesystem permission boundaries and cleared environment
(no inherited NODE_OPTIONS, NODE_PATH, Git overrides or live runtime config). Current cwd is never
module authority. Child-process creation and outside filesystem reads/writes are denied. Node's
permission mode is not claimed as a sandbox for arbitrary hostile native code or network isolation;
only reviewed, hash-pinned source and copied dependencies execute. No fetch path exists in this API.

LIVE-005's operational `dry-review.ts` has a computed optional Human adapter import. Its exact
expression is declared **typecheck-only**. It cannot be reachable from any execution entrypoint;
the closure guard rejects that condition. Running operational review/publish or that optional
external adapter remains outside this harness. No live project is passed to historical execution.

## Original authority remains unchanged

The shared Round1 dataset SHA is
`5bc32592aa80ee4742f8e01b09d4381dacc1ce080fb930772a7a1ea2b24c70c2`.
Selectors, generators, stable serializers and ID algorithms remain family/checkpoint-specific.
The historical implementation recomputes the expected package fingerprint:

- LIVE-004: `1dbeec4e4719970d7254c4a7b5ba614651a9b13d4bd4fc88308c2b1368a94f69`
- LIVE-005: `c05192742ae39eb86f42a53724d7468922a4173ce764c938a6287b069fa7d3f5`

LIVE-003 has no aggregate package file-map fingerprint: its individual file identities and original
assertions apply; receipts say NOT_APPLICABLE, never invent one. Original selected-input, manifest,
deterministic ID, output/hash and null/temporal assertions run unchanged. `UNBOUND` and dry-time
placeholders remain prepared-package values. Completed receipts never rewrite prepared artifacts.
LIVE-004 checks its three documents; LIVE-005 checks 12 inputs, seven source groups and all 31
complete candidate record hashes. No package, expected hash or canonical data is regenerated.

## Current versus historical verification

Only the four immutable injection directories and four original test files are excluded from
current core typecheck. Their exact bytes must be covered by a registered historical manifest;
changed/unregistered files fail `assertCurrentBoundary()`. All historical TS and assertions are
verified in the dedicated environments above. This is not an unchecked exclusion.

The boundary guard builds current Core/Human compiler graphs and rejects historical imports even
when tsconfig excludes the imported file. It also inspects production JS/JSX imports in server/src,
and fails closed on computed current runtime imports. Current runtime imports no historical package.
There are no Vite path aliases at this checkpoint. Future runtime resolution features require a
boundary review. The base contains no injection directory, so its initial coverage count is zero;
negative tests demonstrate that imports into excluded registered source still fail and changed
historical bytes cannot be silently dispatched to old tests.

The full-core runner dispatches four exact historical test paths to the family suite; other current
Historical/Reality tests still run against current substrate. No test assertion is removed or skipped.
The root substrate is unchanged. Integration has not been replayed to demonstrate the final merged
tree; that future work must rerun the guard, compiler and full suites after resolving conflicts.

## Integration gate

The formal harness contains HISTORICAL-FREEZE-002 by ancestry. The next proposed fresh convergence
order is 004 (including 002), LIVE-005B, SEMANTIC-007. Do not merge 002 twice. This checkpoint does
not include LIVE-005B or SEMANTIC-007 as current code, update master or resume either HOLD worktree.
Known baseline contract-evolution failures remain visible. See `verification.json` and `REPORT.md`.
