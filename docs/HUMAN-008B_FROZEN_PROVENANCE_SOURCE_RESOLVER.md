# HUMAN-008B — Frozen Provenance Source Resolver

Baseline: HUMAN-007B `6f9d0d556a3b7ec8e4eb8a13b1168eb78aa1383b`.
Branch/worktree: `ground/human-008b`, `/private/tmp/ground-human-008b`.
Server-only checkpoint; React UI and the existing Entity response are unchanged. No HUMAN-008C work or push.

## Authority and scope

Provenance source resolution audits the frozen input used for projection. It does not verify truth, source authenticity, independent confirmation, or source ranking. Hash equality establishes byte identity only. Canonical Observation is projection output; selected input is projection input. Receipt/package metadata is operations provenance, not a new canonical relation. External source URL is a stored reference, not the frozen input and not fetched.

Exactly 16 bindings for Project `088d09dc-dfc5-487a-8f8f-22d2b33a9249` are supported. The composite key is Project/Entity/Observation. `external_id` is never interpreted as a filesystem path or used alone to infer a package. Existing canonical Entity read confirms the Observation scope.

Bundle: `fixtures/human-interface/provenance/historical-round1-v1/`.

- `manifest.json`: 16 bindings, package metadata, all file fingerprints and origin identities.
- `392/`: selected input, inspection manifest, exact completed receipt.
- `004/`: three selected inputs, selection manifest, package fingerprint metadata, exact completed receipt.
- `005/`: twelve selected inputs, selection manifest, package fingerprint metadata, exact completed receipt.
- 24 artifacts plus manifest, 240,204 bytes total. No full Round1 dataset, entire worktree, projection executable or runtime Git dependency.
- Source commit identities: 392 `a6f4de1ff92f8ce2e6e6c16de66e714b68b97f9f`; 004 `b361136770d48b952164cb40900554c008ad06f4`; 005 `1a5cd833b96c40aea87752f86dea9949db661ecd`.
- Exact manifest SHA-256, pinned independently in `provenance-pin.ts`: `0bf2dbb3a21225bf3bb78f0a94a2846acc32d827205ac0e121ed4ad828f4d913`.
- Common dataset SHA-256: `5bc32592aa80ee4742f8e01b09d4381dacc1ce080fb930772a7a1ea2b24c70c2`.

The 21 Git-origin artifacts were extracted from the approved commits and checked against exact Git blobs. The three receipts are exact copies from the explicitly approved operations directories, with original identity/hash recorded; they are not falsely described as Git-origin artifacts at the historical commits. Original receipts are never modified. Runtime reads only the bundled copies. Copies become tracked in this checkpoint.

The 392 package predates file-map package fingerprints. Its `package_fingerprint_kind` is explicitly `projection_implementation_sha256`, matching the receipt; 004/005 use `file_map_sha256`. Do not treat these as identical hash constructions. The bundle manifest pin additionally binds all selected/receipt/metadata bytes. The historical inspection manifest's dry-review status is preserved, while final publication authority comes from the completed receipt.

## Registry and receipt binding

Each entry carries IDs, exact expected provenance (including omitted vs null fields), published Observation hash, source family, selected relative path, source/report ID, and an explicit package key. The package entry supplies commit, qualified fingerprint, dataset hash, receipt identity/hash, qualification and manifest identity through the pinned file map. This indirection avoids repeating package metadata 16 times; it is server-owned operations metadata only.

The complete entries, canonical UUIDs, selected paths and hashes are in the bundle manifest. Report mapping:

- 392: c392-instruction → `392/selected-input.json`.
- 393: c393-termination → `004/selected-393.json`.
- 394: c394-departure → `004/selected-394.json`.
- 396: c396-declaration → `004/selected-396.json`.
- 395: c395-captured / c395-sunk / c395-first-fire → three `005/selected-<report-id>.json` artifacts.
- 678: c678-uncertainty / c678-sent → two distinct artifacts.
- 679: c679-held; 680: c680-attack; 86: c86-request.
- 430: c430-consent / c430-guarantee / c430-occupation → three distinct artifacts.
- 815: c815-inquiry.

All 16 canonical provenance values have kind document, label `Stored Historical Round1 inspection report; researcher-authored paraphrase`, omitted entity_id, and exact external_id `round1.dataset.json#claims/<report-id>`. Missing vs explicit null is preserved by the provenance comparison. The input collection named claims remains an experimental input collection, not canonical Claim.

Receipt verification checks expected file SHA-256 before parsing; target Project, package identity, selected hash, report/source identity, generated Observation/Document IDs, published Observation hash, completed status and independent-read success. For LIVE-005, selection metadata is explicitly taken from package_completion.prepared, but published record hashes and final snapshot identity come from completed/final sections. UNBOUND prepared values are never promoted to final authority. Package manifests and selected source/report identities are cross-checked separately.

The published Observation hash uses the existing package convention: recursively sorted object keys, array order preserved, JSON UTF-8 plus LF. It is not the exact whole-Project byte hash, a new canonical identity, or an RFC 8785 claim.

## GET contract

`GET /api/human-interface/reality/:projectId/:entityId/observations/:observationId/provenance-source`

Required header: `If-Ground-Snapshot-Fingerprint: <64 lowercase hexadecimal SHA-256>`.

No query parameters; no client-specified path, source key, receipt, commit or Git ref. Non-GET is rejected; HEAD also receives 405. Cache-Control is no-store.

A request invokes the existing canonical Entity reader once, using one verified ProjectState for fingerprint and Entity/Observation scope. Current fingerprint must equal the header. No second Project load occurs during artifact resolution. The current Observation's complete provenance and published record hash must match the explicit binding; identical UUID or locator alone is insufficient.

Response:

- `transport`: contract version, family/qualification, package commit, package fingerprint and kind, selected input fingerprint, dataset fingerprint, receipt identity/fingerprint, current Project snapshot fingerprint, current Observation record hash, raw input byte count.
- `canonical_binding_context`: project_id, entity_id, observation_id and actual canonical provenance. No fabricated canonical fields, and no conflation of Observation content with input.
- `frozen_selected_input`: input_schema; complete stored source record; complete stored report record; relevant stored actor records selected only by explicit creator/recipient/subject/claimant/report-chain IDs. This includes available title, URL, locator, access_date, creation metadata, predicate, object, extraction, epistemic_limit and temporal/spatial scope without inferred fields.
- `raw_selected_input`: exact full selected artifact UTF-8 JSON string, including its actors and original collections. It is not the entire Round1 dataset. Its SHA-256 corresponds to these bytes, not to the structured view or HTTP envelope.

The stored source URL is in `frozen_selected_input.source.url`; it is a reference field separate from the selected artifact and transport fingerprint. No URL availability check, external fetch, checkout switch or source fallback occurs.

Current raw input sizes: 9,982–11,081 bytes. Measured HTTP response sizes: 16,310–18,450 bytes. No information was removed to meet a size budget. Full receipts, local source paths and operations runtime configuration are not returned to clients.

Project fingerprint and source fingerprints remain separate authorities. The current Project fingerprint need not equal a historical receipt's post-publish fingerprint: later approved publications added records. The current Observation hash establishes whether the old explicit binding still applies. If another writer publishes between page load and expansion, SNAPSHOT_MISMATCH requires a new explicit page read; there is no silent rebinding or refresh.

## Fail-closed and filesystem boundary

- 428 SNAPSHOT_PRECONDITION_REQUIRED; 400 SNAPSHOT_PRECONDITION_INVALID.
- 409 SNAPSHOT_MISMATCH, OBSERVATION_BINDING_MISMATCH, PROVENANCE_BINDING_MISMATCH.
- 404 OBSERVATION_NOT_IN_SCOPE; existing Project/Entity scope classifications preserved.
- 422 PROVENANCE_SOURCE_UNSUPPORTED, including valid B15 human provenance.
- 503 PROVENANCE_SOURCE_UNAVAILABLE for missing/unreadable registered artifacts.
- Separate 503 integrity codes: PROVENANCE_MANIFEST_INTEGRITY_FAILURE, PROVENANCE_PACKAGE_INTEGRITY_FAILURE, PROVENANCE_RECEIPT_INTEGRITY_FAILURE, PROVENANCE_INPUT_INTEGRITY_FAILURE.
- Separate semantic binding/identity codes: PROVENANCE_RECEIPT_BINDING_MISMATCH, PROVENANCE_PACKAGE_BINDING_MISMATCH, PROVENANCE_INPUT_IDENTITY_MISMATCH.
- PROVENANCE_REGISTRY_INVALID, PROVENANCE_BINDING_AMBIGUOUS and PROVENANCE_PATH_REJECTED fail closed.

Registry construction rejects duplicate Project/Observation bindings, even if the Entity differs, as well as missing metadata and invalid paths. Initialization is local to the source endpoint: bundle/registry failure cannot disable existing canonical Entity API initialization. Every read rechecks manifest and relevant receipt/metadata/input bytes. No old-valid-byte cache exists.

Only server-owned relative JSON paths are accepted. Absolute/traversal paths are rejected, the root must be absolute, path containment is checked, symlinks in root ancestors/directories/artifacts are refused, and files are opened with O_NOFOLLOW. File device/inode and realpath are rechecked, regular-file and 2MiB safety bounds apply. Registered files are hashed before parse/return. Unexpected files are not discoverable or selectable. Immutability is enforced through pinned bytes and fail-closed reads, not a claim that the local owner cannot edit files.

Vite's existing deny patterns are preserved and extended to deny direct access to the entire private provenance directory, including raw imports and /@fs paths. Production serves dist; the bundle is not included in the frontend build. Only the resolver's approved response exposes input. This dev-server restriction is the sole change outside the Human Interface server/test/docs/bundle area; no React behavior changed.

A failed expansion does not imply invalid Observation, missing provenance or no Evidence. Canonical Entity/Observation API behavior is unchanged. No writes to live storage, original receipts, runtime config, canonical records or Git occur in runtime resolution.

## Verification

Final default suite: 132 tests, 128 PASS, 4 opt-in live skips, 0 FAIL.
Final live resolver/HTTP suites: 17 PASS, 0 FAIL, 0 skips.

Coverage includes 16 distinct bindings and all exact selected inputs; 392; 395 3→3, 678 2→2, 430 3→3; one canonical read per resolution; required/invalid/mismatching snapshot header; provenance presence/null/value and Observation content changes; unknown scope; unsupported B15; missing files; selected/receipt/package/manifest byte tampering after a valid read; wrong package metadata; completed versus prepared hashes; duplicate bindings; invalid and escaping paths; symlink files/directories/root; method/query rejection; local errors and unchanged proof Entity responses; real default endpoint construction; Vite raw-file rejection; fetch-disabled artifact resolution.

Runtime source resolution contains no network/Git calls; direct live resolution also passed under the restricted environment before HTTP server tests. HTTP tests use localhost only. A source URL can be unavailable without changing any success condition.

- 21 Git blobs / 3 original receipt byte copies / 16 bindings verified by `verify-provenance-origin.ts`.
- Core and adapter typecheck: PASS.
- Human Interface plus modified router/Vite lint: PASS.
- Vite production build: PASS; frontend output asset hashes unchanged from HUMAN-007B.
- HUMAN-001 foundation verification: PASS.
- Diff whitespace check: PASS.
- Full core suite not rerun; no repair or change to the known 104 missing-fixture failures.
- Before/after actual live bytes: unchanged, SHA-256 `9ff0d8070296d2d5493b618b13d75beab003581a6f7011ae642a53f46fc453cf`.
- Existing source registry/resolver, read adapter, React/CSS, core/schema and old proof fixtures: unchanged. Bundle tests mutate disposable copies only.

Reproduce from worktree:

```sh
GROUND_OPERATIONS_ROOT="$HOME/Library/Application Support/GROUND/operations" node --import tsx scripts/human-interface/verify-provenance-origin.ts
TSX_TSCONFIG_PATH=server/human-interface/ui-test-tsconfig.json node --import tsx --test server/human-interface/*.test.ts server/human-interface/*.test.tsx ground-core/__tests__/observation-evidence-read.test.ts ground-core/__tests__/epistemic-core.test.ts
GROUND_RUNTIME_CONFIG="$HOME/Library/Application Support/GROUND/runtime.json" node --import tsx --test server/human-interface/provenance-source.test.ts server/human-interface/provenance-http.test.ts
npx tsc --noEmit -p ground-core/tsconfig.json
npx tsc --noEmit -p server/human-interface/tsconfig.json
npx eslint src/human-interface server/human-interface/http-route.js vite.config.js
npm run build
node --import tsx scripts/human-interface/verify-human-001.ts
```

## Frontend handoff boundary

HUMAN-008C may call this independent GET with the displayed Entity response's fingerprint and its actual Observation ID, display frozen structured/raw input and separately labeled transport metadata, and show expansion failures locally. Suggested wording remains `View frozen inspection input`. It must not infer truth from success, treat package metadata as canonical state, silently resolve a changed snapshot, invent titles/summaries, or substitute a public URL for frozen input.

No blocking issue remains within the approved 16-binding scope. Runtime deployment must retain this bundle and pin; unsupported additional publications require separately approved bindings. HUMAN-008C has not begun.
