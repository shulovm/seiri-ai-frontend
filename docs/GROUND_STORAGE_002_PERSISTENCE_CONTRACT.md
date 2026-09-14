# STORAGE-002 — Canonical Persistence Contract

This is a GROUND persistence contract, not a Human Interface source registration.
No canonical schema, Reality semantics, revision or generation field is added.

## Storage authority and writer ownership v0

Root resolution remains `options.storageDir` → `GROUND_CORE_STORAGE_DIR` →
module-relative `ground-core/storage/projects`. The default is implicit local /
development storage; worktree names, mtimes, record counts and Git branches never
make it system-wide authority. Explicit configuration selects a location but does
not itself establish ownership, including when supplied by an environment variable.

An explicit owned root requires a process/service owner to name that root and own
writes for each Project ID. V0 requires **one storage root / one project_id / one
writer owner**. Simultaneous independent writer processes for the same Project
are unsupported. This is a deployment/operational precondition, not a runtime lock
or ownership registry enforced by this checkpoint. No root is selected here.
The owner must serialize read-modify-save operations, not merely calls to save.

Atomic rename alone does not provide writer coordination: two stale states can
still overwrite one another. A test deliberately demonstrates this lost update.
CAS, lock, journal and persistence revisions are deferred, not silently simulated.

## Atomic save and publication

`saveProject` normalizes with existing core, verifies schema, validates, and fully
serializes the same pretty-printed JSON plus newline before creating a temporary
file. It creates `.ground-<project-id>-<randomUUID>.tmp` with exclusive `wx` in the
resolved final directory, writes complete bytes, applies file mode, closes, checks
the destination type, and renames to `<project-id>.json`. It returns success only
after rename succeeds. There is no direct-final-write fallback.

A failure before rename leaves an existing final file intact. The writer attempts
to remove only its own temp file on failure; cleanup failure does not mask the
original error. A process crash may leave a temp file. Readers neither enumerate
it as a Project nor delete it. No global cleanup job is introduced.

Existing ordinary permission bits are retained; new files are private (0600).
Ownership is that of the writer's new inode, not copied from an arbitrary old
owner. ACLs, xattrs and special mode bits are not preserved by this v0 contract;
roots requiring them need an explicit later policy.

The supported target is a trusted local POSIX filesystem on macOS/Linux with
same-directory atomic rename and O_NOFOLLOW support. This checkpoint verifies
atomic visibility locally on macOS. Linux behavior is based on POSIX semantics,
not a Linux CI execution in this checkpoint. Network filesystems, Windows behavior,
container volume lifetime and hosted deployments are not verified here.

No file or directory fsync is implemented. Successful rename is the **visibility
publication point**, not a power-loss durability guarantee. The previous or new
state may fail to survive a system/power crash. Applications needing durable
acknowledgement must separately specify file fsync, directory fsync, filesystem
and platform guarantees. Do not infer durability from passing visibility tests.

## Snapshot read

`loadProjectSnapshot(projectId, options?)` returns persistence metadata:

- `bytes`: the Buffer read from one opened regular file descriptor;
- `stored`: JSON parsed from those bytes;
- `state`: existing normalization's ProjectState, validated after normalization;
- `fingerprint`: lowercase SHA-256 hex of those exact bytes;
- `stored_schema_version` and `read_schema_version` separately;
- `validation`: existing canonical validation result (invalid reads throw).

Hashing never triggers another file read. All derived values originate from the
one Buffer. File replacement after open does not switch the descriptor to a new
inode on the supported filesystems. `loadProject` delegates to this primitive and
returns `.state`; return semantics and normalization remain compatible for valid
Project inputs. Reads do not create directories, write back or silently fall back.
Returned Buffer/objects belong to the caller; mutating them does not create a new
canonical persisted snapshot and does not update the recorded fingerprint.

The fingerprint is content identity, not revision, generation, truth, event time,
current Reality identity, ordering or proof of writer ownership. Whitespace changes
change it even when normalized states are equal. Re-publishing identical bytes
produces the same fingerprint. No read clock is injected into canonical timestamps.

The requested ID must match normalized `state.project.id`. Invalid JSON, unsupported
schema, failed normalization/validation or mismatched identity throws. Missing root
or file yields the existing NotFoundError; other I/O failures propagate. Errors are
not empty ProjectStates. Valid but malformed-name legacy files are intentionally
not supported: expected canonical UUID filename syntax is required.

## Path safety and discovery

Project IDs are UUID-shaped strings, without separators or additional extensions.
The configured root is process-owned input, never a client path. Root aliases are
resolved once via realpath (including macOS /tmp aliases); the resulting directory
is the boundary. A configured symlink root is thus an explicit location choice,
not a Project-file symlink traversal. The owner must trust/control the root and
its ancestors, permissions and configuration. Adversarial root/ancestor replacement
or arbitrary filesystem writers are outside the contract; path-based Node APIs
are not an openat-based sandbox. This limitation is not a writer-coordination claim.

Project-file symlinks and nonregular files are rejected. Read uses lstat plus
O_NOFOLLOW and descriptor fstat; O_NONBLOCK avoids waiting on a raced FIFO before
fstat. Save refuses an existing symlink/nonregular target and never writes through
it; final rename does not follow the destination symlink. Input IDs cannot escape
the configured root. Symlink files are excluded from listing.

`listProjects` remains sorted lexical IDs for API compatibility. It enumerates
only regular UUID.json directory entries, excluding temp files and symlinks. It
returns **candidate IDs**, not validated Projects. Contents are not loaded while
listing. A candidate can disappear/change before open; successful snapshot read
is required to confirm parse, schema, validation and ID identity. A malformed
JSON candidate is not silently erased from discovery or converted to an empty state.

## Human Interface resume gate

Resolved at the storage API level: atomic visibility under the stated filesystem
and owner assumptions; one-read state/fingerprint; ID matching; safe candidate
filename enumeration. Existing writers must adopt this implementation before
readers can rely on atomic publication—old direct-write processes remain unsafe.

Still unresolved: a named canonical owned root/service, operational enforcement
of single-writer ownership, a real live candidate or explicit reason for zero
RealityEntities, and future transport source-mode registration. Historical Round13,
HUMAN/E2 proof fixtures and replay outputs are not promoted to live sources.
No Human Interface live connection, UI change or STORAGE-003 is initiated.

## Verification scope

Tests cover validation failure, partial temp write, rename failure, complete
replacement visibility, permissions, temp exclusion, exact-byte fingerprint,
same-read substitution, stored/read schema distinction, no writeback, ID mismatch,
malformed/unsupported input, symlink/path rejection, configuration precedence and
unsupported stale-writer lost update. Failures are injected only in isolated tests;
no runtime fault switch is added. Full core and CLI regressions are also required.

### Checkpoint verification results

Baseline: `592ffb88fd46bab9b66371ef3eaf24804fc55046`, schema `0.1.25`.
Both baseline and changed full suites were executed on the same macOS / Node
24.15.0 environment. Baseline: 3,857 tests, 3,753 pass / 104 fail. STORAGE-002:
3,871 tests, 3,767 pass / 104 fail. All 104 failing test names match, with no new
failures; the known missing-storage-fixture failures are not repaired or hidden.
Fourteen persistence tests were added.

Focused file-store, persistence-contract, CLI and intake suites: 55/55 pass.
This includes init, intake and patch. Existing Reality Loop setup is blocked by a
missing unrelated local Project file; separate isolated tests use the existing
FreeWater test builder and a core-generated proposal to exercise both
`reality-apply` and the compatible `reconcile-apply` command dispatch, verifying
that successful apply publishes a different validated snapshot with observations.
These tests do not restore, promote or modify any real storage or proof fixture.
The initial sandboxed CLI child-process run failed; rerunning with subprocess
permissions passed. Full-suite results above use that same permitted environment.

`tsc -p ground-core/tsconfig.json`, `tsc -p server/human-interface/tsconfig.json`,
`npm run build` and `git diff --check` passed. No schema or domain-semantic file
changed. Reader concurrency coverage is deterministic interleaving around temp
write, read and rename, not a multi-process stress test or durability proof.
