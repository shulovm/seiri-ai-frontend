# STORAGE-003 — Canonical Root / Writer Ownership

This checkpoint defines an owner launcher and deployment contract. It does not
activate Human Interface live reads or select a first live Project by inference.
Baseline: STORAGE-002 `31350937f99c24c692d4920272f5d6f6c614987f`, schema 0.1.25.
That commit is published on `origin/ground/storage-002` as
**GROUND Persistence Contract v0 — Atomic Snapshot Foundation**.

## Chosen local deployment

Canonical root: `~/Library/Application Support/GROUND/storage/projects`, expanded
to an absolute path in the owner's runtime configuration. On the investigated
Mac this is `/Users/macsaku/Library/Application Support/GROUND/storage/projects`.
The executable contains no user-home or live-root default.

Application Support is appropriate for application-managed persistent data under
[Apple's filesystem guidance](https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/FileSystemOverview/FileSystemOverview.html).
It is independent of branch checkout, worktree removal, git clean and repository
relocation. Caches and temporary directories are inappropriate for live storage;
Documents would expose implementation-managed files as user documents. A shared
system `/Library` root would add multi-user privileges beyond this local v0.

Read-only host inspection found Application Support owned by `macsaku`, with
private POSIX mode bits and an ACL. `tmutil isexcluded` returned `[Included]` for
that parent. This is not evidence of configured Time Machine destinations,
successful backups or successful restore. No backup setting was modified.
`GROUND` does not yet exist there. **This checkpoint does not create an empty live
root or publish a placeholder Project.** Deployment awaits first-source approval.

New root directories use 0700 and metadata uses 0600. Existing root must belong to
the current local OS user checked by Node's getuid, with no group/other mode bits;
the launcher refuses unsafe permissions rather than silently changing them. The
operator must also audit inherited ACLs and trusted ancestors. Node mode checks
are not a complete ACL audit. Do not put the root on a network filesystem or in a
cloud sync folder. The actual deployment filesystem and backup/restore procedure
remain operator checks. STORAGE-002's lack of fsync durability is unchanged.

## Explicit configuration and owner model

Owner identifier: `ground-local-cli-v0`. The owner runtime is the short-lived
`ground-core/owner-cli.ts` launcher, configured by a trusted operator file:

```json
{
  "mode": "canonical-live",
  "storageDir": "/Users/macsaku/Library/Application Support/GROUND/storage/projects",
  "writerOwner": "ground-local-cli-v0"
}
```

Suggested config location: `~/Library/Application Support/GROUND/runtime.json`,
outside the Project directory, readable only by its operator. This is a deployment
example, not a generated runtime config or an instruction to publish a Project now.
No environment variable creates ownership. Owner mode requires an absolute
`storageDir`, `canonical-live` mode and nonempty writerOwner. It never falls back
to `GROUND_CORE_STORAGE_DIR` or module-relative storage.

After an explicitly approved first Project plan, launch a writer from an updated
checkout using `npm run ground-core:owner -- --config "/absolute/runtime.json"
<writer-command> ...`. Arguments containing spaces must be shell-quoted. The
launcher permits only init, intake, patch, reality-apply and reconcile-apply.
It forwards the existing command to `runCli` while retaining ownership around
the **entire synchronous read-modify-save operation**. No daemon, server writer,
multi-project parallel writer or distributed coordination is introduced.

The library equivalent is `withCanonicalWriter(config, synchronousOperation)`.
Its nonserializable in-process session is active only inside that callback. A
copied PID, owner string, JSON config or fabricated object is not a session.
Async callbacks are unsupported; a returned Promise is rejected and the session
revoked. Do not use the API to prepare long-lived/stale writes outside its scope.

Local CLI remains unchanged by default: options.storageDir, then environment,
then module-local storage. Local mode does not infer canonical authority.
Even a local-mode save refuses a registered root or root with an owner lock if
it lacks an active canonical owner session. A mode override is not a bypass.

## Declaration, admission and publication

Two operations-only files live beside Project files:

- `.ground-storage-root.json`: version `ground-owned-root-v0`, canonical-live
  mode, writer_owner and realpath-resolved root. No ProjectState fields or source
  truth are recorded. A relocated manifest or different owner is refused.
- `.ground-writer.lock`: exclusively created 0600 regular file, with writer owner,
  diagnostic PID and random session token. Presence is exclusion, not proof of
  liveness. No PID-based takeover or lease expiry exists.

The manifest is necessary so an ordinary CLI invocation can recognize that a
root is protected even while no owner process is running. Runtime config alone
would not protect against accidentally pointing ordinary CLI at that directory.
Initial registration is allowed only for an empty, repository-independent root;
nonempty unregistered storage is refused. Thus launching an owner cannot silently
promote old Project copies or proof fixtures. Manifest initialization occurs under
the owner lock. An interrupted/malformed manifest fails closed and needs operator
recovery; metadata initialization has no power-loss durability claim.

Admission uses Node `openSync(..., 'wx')`, corresponding to exclusive creation.
[POSIX open](https://pubs.opengroup.org/onlinepubs/9799919799/functions/open.html)
specifies atomic existence-check/creation for O_EXCL with O_CREAT. Competing
cooperating owner processes cannot both acquire the same lock pathname. This is
root-wide exclusion, including different Project IDs, on the supported trusted
local POSIX filesystem. macOS is tested; Linux is specification-based and not
executed in this checkpoint. Windows and network filesystems are unsupported.

Each save checks a live session, matching root/owner/manifest and the acquired
lock inode/device and token. Normal callback completion or exception revokes the
session and removes only the original lock inode. Abrupt process exit can leave
the lock. Readers never acquire, renew or clean it. Session checks do not replace
STORAGE-002: all Project writes still normalize, validate, serialize fully and
publish via same-directory temporary-file rename.

### Conflict and recovery

If a lock exists, a second owner exits unsuccessfully before command execution.
It does not inspect PID liveness to decide takeover. This intentionally favors
exclusion over availability after crash and avoids PID reuse/stale PID ambiguity.

Manual recovery requires an operator to stop all possible owner launchers and
legacy writers, verify that none can still write, inspect the exact resolved root,
config and metadata, and preserve diagnostic evidence before removing the stale
lock. If absence of a writer cannot be established, **do not remove the lock**.
Repair of malformed declaration requires checking the intended root and owner;
never reinterpret existing data as approved live input. No force-unlock command,
reader cleanup or automatic recovery is supplied. Backup restore can bring back
a stale lock and requires the same review.

The root/ancestors and OS account must be trusted. Cooperating-process exclusion
does not prevent a same-user process from deleting locks/manifests or writing raw
files. Old binaries, direct filesystem writes, stale precomputed patches and
external root replacement are outside this guarantee. Stop them before live
activation; chmod 0700 is not isolation between processes of the same OS user.
This is not CAS, revision checking, conflict resolution or durable journaling.

## Readers and repository independence

`loadProjectSnapshot(id, {mode: 'canonical-live', storageDir: absoluteRoot})` and
`listProjects` require an explicit root and valid declaration in live mode. They
do not require a writer session or a live writer process. Missing/invalid live
declaration is an error, not an empty catalog. Ordinary local reads retain
STORAGE-002 behavior. Readers perform no writes, cleanup or migration writeback.
Declaration verification is operations metadata, not a new canonical record.

Absolute paths, realpath resolution, and rejection of any ancestor containing a
`.git` entry prevent normal repository/worktree registration (including aliases).
Two checkouts must explicitly select the same root, then compete for the same
owner lock. Moving a checkout does not relocate storage. Copying/moving the root
itself does not preserve authority automatically: its manifest realpath must match.

All five ordinary writers still reach the same `saveProject`: init/intake/patch
directly; reality-apply via applyRealityProposal; reconcile-apply uses that same
apply path. CliRuntimeOptions now preserves persistence mode and session through
these calls. No existing data, defaults, schema or domain semantics were migrated.
The existing server has no canonical writer lifecycle to reuse, which is why the
controlled CLI is smaller than introducing a server/daemon owner.

## First live Project decision remains separate

No candidate has been authorized as live by storage implementation. Read-only
inspection reconfirmed two concrete possibilities using loadProjectSnapshot:

- Historical Round13: `ground-core/experimental/historical-reality/round13/replay/
  19041904-1904-4904-8904-190419049013.json` in `/private/tmp/ground-rj-round13`.
  Stored schema 0.1.24, read schema 0.1.25, valid, 96 RealityEntities and zero
  RealityEvents/RealityStates/EpistemicObservations. Exact bytes SHA-256:
  `f9afea74d3954ea978368ea6337eb02e7359ed5f9f94f14e96d8e2334f694044`.
  It remains experimental replay output, not an approved live source.
- Original checkout's `ground-core/storage/projects/
  34092589-569a-4eec-923d-a105b6b1402c.json`, title GROUND Core. Stored schema
  0.1.1, read schema 0.1.25, valid; all four Reality collections zero.
  SHA-256 `54d8a0f864c8d48b3f2fc102a320dbd5893b175e4dd0e8d129d6aefc89ca0c0a`.
  Original-checkout location is not authority. It needs the project owner's
  decision about the intended continuation state, duplicate versions and source.

Prefer an explicitly approved continuation of an actual Reality Injection with
an accountable content owner, exact source/version, projection acceptance and
subsequent writer lifecycle. Round13 is a concrete candidate to evaluate under
those conditions, not selected because it has many entities. Alternatively an
owner-approved GROUND Core operational Project could start live persistence,
provided the zero-Reality condition is explicit; it would not prove populated
Reality browsing. No new placeholder Project is created for UI readiness.

No automatic import exists in this checkpoint. Initial content publication needs
an explicit follow-up import/injection plan; simply copying a file bypasses the
owner publish contract. The 303 historical copies are not batch migrated because
ownership, duplicate IDs, differing bytes and worktree-local provenance remain
unresolved. HUMAN/E2 proof snapshots are unchanged and never promoted.

## HUMAN-004 resume gate

Implemented: explicit live configuration, named owner model, root-wide conflict
policy, no live fallback, owner-gated STORAGE-002 publish, exact snapshot read,
read-only consumer behavior and operational separation from proof storage.
Deployment is not activated: the selected root/config have not been created,
legacy processes have not been migrated operationally, and the first live Project
source/authority remains undecided. Gate 8 is not met. Human Interface live
connection remains **HOLD**, and HUMAN-004B is not started.


## Verification record

On macOS / Node 24.15.0, full core: **3,887 tests, 3,783 pass / 104 fail**.
STORAGE-002 baseline was 3,871 tests, 3,767 pass / 104 fail. All 104 failing test
names match, with no new failures; sixteen owner-contract tests pass. Known
missing local storage fixtures were not restored or modified.

Focused owner, file-store, persistence-contract, CLI and intake tests: **71/71
pass**. Coverage includes missing live config, local fallback compatibility,
forged/revoked sessions, all five CLI writer paths, a real second owner process,
abrupt child process exit, stale locks, metadata/permission rejection, repository
aliases, working-directory independence, unauthorized environment-directed writes,
and reader access without locking or cleanup. The CLI entrypoint is also exercised
in a child process, with a conflicting storage environment ignored.

Core and existing Human Interface adapter TypeScript checks, frontend build and
git diff --check pass. No Human Interface file, ProjectState schema, Reality
semantics, Historical projection, BTC, FreeWater content or proof fixture changed.
No production runtime or live Project was started/published by verification;
all write tests used freshly isolated temporary roots and existing test builders.
