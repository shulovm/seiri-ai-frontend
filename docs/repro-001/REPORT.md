# GROUND-REPRO-001 — execution report

Precommit acceptance: **GROUND CLEAN CHECKOUT REPRODUCIBILITY ESTABLISHED** for
the d10ad14 checkpoint and its frozen Round1–6 Historical dependency closure.

## Base, isolation and scope

- Base: `d10ad1419e5a6ab857247a4ac153e459256274c5`.
- Branch/worktree: `ground/repro-001`, `/private/tmp/ground-repro-001`.
- At start the shared Phase5 head had advanced to `4598572`; its semantic changes
  were deliberately not imported. Human-003 and Historical-Round11 were also
  active. Existing worktrees, dirty files and branch tips were not altered.
- No Human Interface merge, IMMUNE, canonical core, schema or migration change.

## Original failures and dependency graph

The fresh baseline, with lockfile-installed dependencies and IPC-enabled runner,
reproduced exactly 3,697 pass / 106 fail / 0 skip out of 3,803 tests. Build passed.
Typecheck failed with 9 TS2307 and 23 TS7006 diagnostics.

`ignored legacy store → missing Momotaro → 83 failures`;
`ignored legacy store → missing GROUND → 21 failures`;
`untracked Historical source closure → 2 unloadable test files + 32 type errors`.
All 106 failure names, locations and underlying error text were classified in
the external `failure-census.json`, with independent `typecheck-census.json`.
Missing generated declarations: 0 identified. Environmental CLI IPC error:
avoided by executing tests with the required local IPC permission. No semantic
regression was inferred from missing inputs. No type suppression was added.

After fixture restoration, a pre-existing Moshimo fallback ownership defect was
exposed. The existing versioned Moshimo seed now supplies valid owned entities.
No existing test, assertion or production code was changed to accommodate it.

## Source and storage provenance

438 local files were snapshotted with absolute/relative path, size, SHA256, role,
references, pin witnesses, peer-worktree comparisons, git-history availability,
and unknown authorship. Of these, 376 are Historical artifacts and 42 are ignored
project states; remaining files are Historical tests/reports. Snapshot and
inventory stay external, preserving production data without putting it in Git.

182 previously missing artifacts were admitted, totaling 90,124,602 bytes:
18 source/test programs, 43 data/report documents, 59 frozen generated proofs,
and 62 acquired evidence files. **Every admitted file matches a pre-existing
Round5/6/7 immutable manifest hash.** The manifests and stored proofs were
preserved, not regenerated to make tests pass. Historical Round1–4 tests are
included as part of the Round5/6 frozen closure. Round7–11 work is inventoried
but not integrated into this older base.

Three versioned manual/fixture inputs and one existing seed generate four minimal
test projects inside a unique temporary test workspace. All 42 observed runtime
project files remain runtime-only; none is copied into Git. The generation
sequence and exact content-equivalence boundary are in README.md. The 200 legacy
storage-dependent tests pass on both frozen local-state copies and generated
fixtures. Across all 13 legacy content fields, the three prepared master test
fixtures also match the generated content after excluding technical timestamps.
The current live dogfood state has additional/different content, fully recorded
in the external comparison; whole live-history equivalence is not claimed.

## Changed paths and semantic deltas

- Existing modifications: `.gitignore` (seven exact legacy scratch directories),
  `package.json` (isolated test runner command).
- Added: `scripts/repro/` (generator, setup, isolation runner, typecheck config,
  four reproducibility/provenance/replay tests), `docs/repro-001/` (contract,
  adoption manifest, original Round7 pin witness, report), the 182 admitted
  Historical files enumerated in `historical-artifacts.json`.
- Pre-existing ground-core source/tests/fixtures and all schemas: unchanged
  bytes. Canonical core delta 0; schema delta 0; migration delta 0; Phase5
  semantic delta 0. No expectation rewrite, skip or error suppression.
- Historical semantic/content delta 0: all 182 bytes/hash contracts remain
  exact; Round6 materialized dataset, 87 source traversals and 40 queries replay
  exactly. Canonical claims/evidence/links/entities match stored replay except
  technical creation/update clocks. All source/actor/time/Unknown values remain.
- `git diff --check` reports whitespace in imported source evidence HTML/XML;
  preserving the pinned bytes takes precedence over formatting acquired evidence.
  Newly authored files pass the whitespace check.

## Fresh reproducibility proof #1 and #2

The same immutable **staged tree**, `a96c56751d13d56e5c8eb0173feb321fbbe836a8`,
was independently exported by `git archive` into two empty directories before
any commit. Both performed their own `npm ci`; no other worktree's node_modules,
storage, datasets or generated state was used. The test runner used each fresh
export's dependencies and sources. Measured environment: Node24.15.0/npm11.12.1.

| Result | Proof #1 | Proof #2 |
|---|---|---|
| npm ci | PASS | PASS |
| ground-core typecheck | PASS | PASS |
| repro generator/tests typecheck | PASS | PASS |
| full tests | 3,904 / 3,904 PASS | 3,904 / 3,904 PASS |
| skip / cancelled / failure | 0 / 0 / 0 | 0 / 0 / 0 |
| build | PASS | PASS |
| original exported file changes | 0 | 0 |
| unignored additional checkout files | 0 | 0 |

Test count reconciliation: base had 3,801 actual individual tests plus 2 failed
file-load placeholders. Restoring the Historical closure supplies 99 Historical
tests across six files, giving 3,900. Four new reproducibility checks give 3,904.

These are clean checkout-equivalent exports, not falsely reported Git worktrees:
all 1,132 exported input files were hashed before/after; no source changed and
no unexpected output appeared. The later README clarification and this report
are documentation-only additions after those proofs. A committed-head fresh Git
worktree proof is required after commit and will be recorded externally, so this
report does not pretend to contain its own not-yet-created commit hash.

Fixture SHA256 digests match across both independent environments and independent
generator subprocess restarts:

- Momotaro: `7e9b42df0fbc61ee57bcf99803fc76a265b5ece55ebee6e16ba4381f0796d5ff`
- GROUND: `33c972790920270c9a17e761cb9f2834daded4871c6056111af4400545e5f174`
- FreeWater: `03006f12a837d6c65928b067796134882cda2b8b9095fcd6791ec530b1c5eac6`
- Moshimo: `4f7ff09488c245abcc9a8d4e322a368768e1d592c207d4ba359a5b16ce94c337`

## Commit, rollback, compatibility and remaining Unknowns

Commit is permitted only after the above gates and original-input hash audit.
Resolve the repair commit with `git log -1 --format=%H -- docs/repro-001/REPORT.md`.
The final commit hash and postcommit worktree results are in the external final
report. Push is prohibited and was not performed.

Rollback is to keep users on their existing branches/base. If this repair is
later integrated, revert this single repair commit through the normal reviewed
workflow. No production data migration or deletion is needed. Existing unrelated
worktrees and the retained OS-temp evidence must not be cleaned automatically.

Human Interface e769df3 is not merged here. Optional isolated compatibility
testing, if performed after PASS, is reported separately and cannot change this
repair. Textual merge success alone is not a semantic compatibility guarantee.
Later Phase5/Historical/Human changes remain outside the proven checkpoint.
Individual authorship of untracked files and reproducibility of complete live
project histories remain Unknown; the repair relies on frozen manifest lineage
and versioned fixture sources, not inferred authorship or invented histories.

IMMUNE-001 remains unimplemented. This checkpoint establishes reproducibility,
not the combined Human Interface integration base.
