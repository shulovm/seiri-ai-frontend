# TEST-RUNNER-001 — Immutable Fixture Input Contract

The full-core runner supplies immutable test inputs from the exact execution commit's Git tree.
It does not infer fixture paths from test-source strings, copy the whole repository, search other
worktrees, read live storage, fetch from a network, or generate replacement expected data.

Implementation base: `74ccdfdccb8288edd34ea445ae74062a1cee15c8` (HISTORICAL-FREEZE-004),
a formal descendant of canonical master `45140c001bbc6076496c7a6e12971509362ba665`.
The implementation branch does not contain the unfinished Stage 3 composition.

## Input classes and authority

- **A — tracked immutable test fixture:** manifest-selected regular Git blobs. This change supplies A.
- **B — generated test artifact:** existing setup creates legacy test Projects inside the disposable
  test repository's excluded `ground-core/storage`; per-test Projects/receipts/snapshots use a
  dedicated temporary output directory outside all Git repositories. Never treated as A.
- **C — Historical checkpoint artifact:** the existing family-specific Git resolver still selects
  exact historical code/types/inputs. No Historical package is moved into generic fixture copying.
- **D — live/runtime artifact:** never a fixture source. Runtime storage copy remains excluded;
  `GROUND_*`, `NODE_OPTIONS`, `NODE_PATH` and `GIT_*` are removed from setup/test child environments.

Current source under test retains the existing explicit checkout-copy policy. Its editable code
is distinct from immutable inputs: this change does not claim every source file is a Git export.
Managed fixture/schema paths are intercepted before filesystem copying and supplied only from Git.
Dependencies remain explicitly linked installed npm tooling, not fixture authority.

## Versioned manifest

`scripts/repro/fixture-inputs.json` declares root, role, required suite, presence and copy mode.
Presence is required when the suite exists in the selected commit. A suite newly present only in
the checkout fails with `RUNNER_SUITE_NOT_IN_FIXTURE_COMMIT`; commit the intended source/inputs first.
No checkout bytes can fill a missing blob. Optional/inactive families are recorded in the receipt.

Declared scopes:

- `ground-core/__tests__/fixtures`: committed JSON inputs; TS fixture factories remain source code.
- `docs/schemas`: all committed versions, including 0.1.25 and 0.1.26 when present. Required stable
  schemas are explicit; the Claim suite additionally requires both vNext schemas.
- `fixtures/claim-vnext`: test-only definitions/documentation, required by the Claim suite.
- `fixtures/human-interface/human-001`: immutable legacy 0.1.25 snapshot and its metadata.
- `fixtures/human-interface/provenance/historical-round1-v1/005`: **only** the selected FRUS86 input
  and selection manifest. These are immutable bundle inputs consumed by tests. The full serving
  bundle, its registry, completion receipts and other sources are not swept into the runner.

The four Semantic data dependencies are explicitly declared, rather than one entry per failed test:

1. `fixtures/claim-vnext/definitions.json`: scripted manifestation/assessment test definitions.
2. `fixtures/human-interface/human-001/project-state.json`: saved legacy 0.1.25 numeric Claim proof.
3. `fixtures/human-interface/provenance/historical-round1-v1/005/selected-c86-request.json`: original frozen text input.
4. `fixtures/human-interface/provenance/historical-round1-v1/005/selection-manifest.json`: original selected report/locator/content grouping.

The tests construct isolated 0.1.26 states from these inputs. They are not persisted new live fixture
Projects. No original schema, fixture, package fingerprint, expected value or test assertion changes.
Future suites must review and extend the explicit contract when adding immutable inputs; this is
not automatic path discovery. Root eligibility is also closed in the materializer, so expanding
scope requires a deliberate code/manifest change.

## Git materialization and checks

`planFixtureInputs(repository, {commit?, contract?})` resolves HEAD once (or requires an exact commit),
reads the tracked Git tree and selected blob objects, checks all required paths before tests/setup,
and builds a receipt. Missing inputs fail with `RUNNER_REQUIRED_FIXTURE_MISSING`.

Tree paths must be repository-relative and validated. Absolute/traversal/metadata paths, aliases,
external object alternates, symlinks and gitlinks are rejected. All symlinks in a declared active
fixture root are rejected, even internal ones. Checkout fixture bytes are never dereferenced;
dirty/untracked files cannot override the selected commit. No root escape or fallback exists.

`materializeFixtureInputs()` preserves relative layout in a separate workspace, writes new files
only with mode 0444, and returns a private-state integrity verifier. The full selected path set,
raw SHA-256, byte length, blob OID, roles, commit and contract hash are recorded. Integrity checks
run after setup and after test execution, including when tests fail. Removed, changed or added
inputs and destination symlink replacement fail the runner. Public receipt/plan mutation cannot
change verification authority. Mode/hash checks are not a hostile concurrent filesystem sandbox;
a transient mutation restored to identical bytes is outside this test-runner guarantee.

Tests needing mutation must make a separate working copy in their output directory. The output
root is deliberately outside the test Git repository (required by owner-storage tests) and short
enough for CLI IPC paths. The fixture root is never an output root. Output roots and disposable
repositories are retained with receipts/logs for diagnosis, not reused as later test inputs.

## Execution and reproduction

```sh
node --import tsx --test scripts/repro/fixture-inputs.test.ts
npm run test:ground-core
```

A clean checkout containing a suite must contain that suite's committed required inputs. Untracked
same-name files will not rescue an incomplete commit. A no-checkout local clone can resolve the
same inputs directly from its object database. `fixture-inputs.test.ts` demonstrates different cwd,
worktree and no-checkout-clone receipt equivalence without network or other-worktree fixture reads.
The full runner also ran against an independent tracked-only Stage 3 clone.

The implementation base has no SEMANTIC-007 module or full provenance capability. Those tests are
therefore exercised on a **separate clean equivalent Stage 3 proof**, not misreported as base code.
The pre-fix replay tree is `9d2e968edf19fc84695ea93260002baa0b986c92`, exactly matching the retained
old HOLD `AUTO_MERGE` tree. It was reconstructed from the verified Stage 2 commit
`9a980dc5c7c863b0c330591de8e71828af95b135` and SEMANTIC-007
`3c96feba22bc6b4ed44d86de3e0072a09ea16b42`, without using the old index or working files.

Proof-only detached commits are local audit objects, not canonical integration or production
checkpoints. Future convergence should freshly compose this checkpoint (already containing 004),
LIVE-005B and SEMANTIC-007, rechecking conflict resolutions. Do not merge 004/002 twice.

## Limits

Known contract-evolution failures remain visible; their guards/expectations are unchanged.
This checkpoint fixes runner input supply, not SEMANTIC-007 semantics, production Claim admission,
Human UI behavior, migration policy, Historical package algorithms or master promotion.
The old `/private/tmp` HOLD checkout directories were already missing when this work began;
remaining HEAD/index/MERGE_HEAD/AUTO_MERGE state was hashed and kept unchanged. Reflog-only
hash changes were observed and recorded; their cause is not established, and no reflog was explicitly edited. Exact tree equality establishes the clean
reproduction without claiming those removed checkout directories still exist.

See `REPORT.md`, `verification.json`, and the complete 62-name `failure-inventory.json`.
