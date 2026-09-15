# HUMAN-001A — Foundation Freeze

This fixture is a read-only proof of existing canonical ProjectState references.
It does not add knowledge to GROUND or certify historical truth.

## Frozen baseline and source

- Canonical implementation: integrated master `fbfafef737132c8049998f9ca7d1d5f68fa90c56`, schema `0.1.25`.
- Source: `ground-core/experimental/historical-reality/replay/19041904-1904-4904-8904-190419041904.json` from the local `ground/checkpoint-187` checkout at `650a8c00416b77d36c7318bc73fd8f1991f95a4e`. The source was untracked; its bytes, not that commit, identify the snapshot. No replay was run.
- Project: `19041904-1904-4904-8904-190419041904`.
- Selected Entity: `72bf5051-f100-524a-ac33-7a911f6d974a`, FRUS 1904 document 392.
- SHA-256: `863545f650835b2b36c283ed2455cfe6fc31f10fbad78ee8647dc264ae56ad6c`.

`project-state.json` preserves the entire saved snapshot byte for byte, including
schema `0.1.24`. Do not filter it, regenerate it, overwrite it with migrated data,
or replace it with a frontend semantic model. The canonical normalizer reads it
as schema `0.1.25` in memory. The verifier checks every original top-level field
other than schema_version is unchanged after normalization.

The manifest and hash freeze the fixture for versioned review. Local mode is
read-only; Git does not preserve that mode or provide tamper-proof storage.
Verification rejects modified bytes. A fixture replacement requires an explicit
reviewed change; do not silently update the manifest when verification fails.

## Reproduce from a fresh checkout

Use Node >=20.19 and the committed package lock:

```sh
npm ci --ignore-scripts --no-audit --no-fund
node --import tsx scripts/human-interface/verify-human-001.ts
```

The verifier uses only canonical normalization, validation and existing read
functions. It does not import experimental code, write projects, or access the
original source path. It calls normalizeProjectState directly, the same read
normalizer used by loadProject, because the frozen filename is project-state.json
and file-store expects a project UUID filename. No alternate migration is added.

The complete fixture contains 14 RealityEntities, 18 Claims, 14 Evidence records
and 18 ClaimEvidenceLinks. RealityEvents, RealityStates and EpistemicObservations
are each empty. The selected Entity yields one Claim, one SUPPORTS link and one
external_ref Evidence. Its Worldline and observations are empty.

## Semantic limits

Experimental Historical datasets, actor stages, documentary lineage,
reconstructions, search limits and reports are not semantic authority for this
proof. No sidecar is required by the verifier. Existing experimental identity
strings and source annotations inside the canonical snapshot are preserved as
stored values, not promoted to canonical relationships or new types.

An empty collection means zero stored canonical records in this snapshot/scope.
It does not establish that a historical event did not exist or was not observed.
An empty Worldline does not establish temporal completeness.

Keep occurred_at, recorded_at, valid_from/valid_until, observed_at,
applicable_from/applicable_until and created_at/updated_at as distinct roles.
Retain original timestamp strings and field-specific null meanings. For canonical
temporal comparison/resolution use core; never implement it with native Date,
lexical UI sorting, millisecond truncation or guessed times. Preserve unresolved
core results/errors instead of supplying a substitute instant.

The selected Claim is an inspected_source_assertion about source content.
Its stored confidence 0.95 is an estimate for text attribution in the source
projection, not historical truth probability. Its applicability begins at the
2026 ingestion time, not a historical 1904 event time. SUPPORTS retains the
explicit ClaimEvidenceLink scope; it proves neither truth nor source authenticity.
No direct Event/State-to-Evidence connection is inferred.

## HUMAN-001B minimum server read boundary

This is a transport boundary proposal, not a new canonical type or implemented API.
Accept the configured fixture's project_id and entity_id; reject other identities.
Read one hash-verified snapshot per response and use existing canonical
normalization/validation without any durable save.

Expose unchanged canonical records and existing read results:

- Project identity and snapshot/read schema versions, plus fixture hash and baseline commit as transport metadata.
- getRealityWorldline(state, entity_id), including unplaced_events and temporal_summary.
- getObservationsForSubject(state, entity_id).
- getClaimsForSubject(state, entity_id).
- For each returned Claim, getEvidenceForClaim(state, claim.id), retaining links,
  supports, contradicts, full Evidence and provenance.
- For observation_ref Evidence, resolve only its explicit observation_id within
  the same ProjectState; preserve that observation record separately.
- Explicit collection scope/counts and access to each returned record's full
  canonical fields. Keep raw snapshot schema distinct from normalized read schema.

Do not add source ranking, truth scores, effective quantity/availability,
feasibility, readiness, execution, decisiveness, summaries or identity resolution.
Query-dependent State activity or epistemic gaps require a future explicit query
scope and the existing core functions; they are outside this minimum proof.
Missing references, validation failures and temporal-resolution failures must
remain visible errors rather than synthesized canonical data.
