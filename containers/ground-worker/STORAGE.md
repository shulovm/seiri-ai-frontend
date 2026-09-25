# GROUND-AZURE-002 — staging Blob Evidence input

Status: READY_TO_SEED (preparation only). Base: c828866295d4af2590866ab1ae3e006a2a671929, branch ground/azure-storage-002. Canonical master, active Container App and Azure role assignments are unchanged. No cloud seed, image build/push, or deployment has been performed.

## Representation and authority

Account: orimusugroundstg01. Private container: ground-evidence-staging.
Endpoint: https://orimusugroundstg01.blob.core.windows.net/ground-evidence-staging
Release prefix:
`historical-round6-staging/sha256-f94fa44955e45786ef0ead092a9bfd6ee309f3a4ec6fe3c7e209e6fc316bad81/`

- `manifest.json`: byte-identical to existing corpus-pins.json, SHA-256 in the prefix.
- `files/<original-relative-path>`: all 152 originally pinned payload files; no rewriting, normalization, renaming inside the corpus, metadata edits or provenance replacement.

This is the canonical distribution representation for this approved staging corpus only. It is not a canonical-live Project root or a new domain schema. The manifest retains all existing source paths, hashes, provenance records and source limitations. The worker's compiled manifest is the trust anchor; it never accepts a replacement manifest merely because Storage supplied it.

Enumeration uses the existing manifest's exact ordered path set, never bucket listing order or a mutable latest pointer. Unlisted objects are not inputs; a new manifest or future corpus requires a separately reviewed change. Remote manifest changes, duplicate/additional entries, absent payloads or wrong bytes fail closed. Prefixes are content-addressed and the seed is create-only. This is logical immutable content binding, NOT a claim that Azure WORM retention is configured. A privileged storage writer could corrupt/delete a blob; the worker will reject it rather than read a different version as valid.

Existing STORAGE-002/003 apply unchanged. Azure Blob is not mounted as their POSIX filesystem and no owner session, live root, saveProject, patch application or migration writeback is introduced. For each pass, the worker downloads into a new private temporary directory; only fully retrieved/hash-verified input reaches the original verify() boundary. Scratch is removed after the pass or failure. Scratch is not durable canonical storage.

## Worker retrieval and configuration

No new package or Azure SDK dependency. Managed Identity REST token is requested from Azure-provided IDENTITY_ENDPOINT with Azure-provided IDENTITY_HEADER, resource https://storage.azure.com/ and explicit mi_res_id. Token/header are never logged, persisted, embedded or manually configured. No credential chain, SAS, account key or client-secret fallback exists. Storage requests are GET-only to the fixed account/container; redirects are refused. Four bounded downloads, per-request 15s and per-pass 90s deadlines; 64 MiB per payload and 128 MiB per corpus limits. Abort cancels in-flight retrieval before scratch cleanup; verification cycles never overlap.

Preparation leaves existing source unchanged. After all switch gates pass, future changed-worker configuration adds:

```
GROUND_WORKER_INPUT_SOURCE=azure-blob
GROUND_WORKER_IDENTITY_RESOURCE_ID=/subscriptions/a0d869a1-8cdc-4b87-891c-9d92dd52320d/resourceGroups/rg-orimusu-ground-staging/providers/Microsoft.ManagedIdentity/userAssignedIdentities/id-ground-worker-staging
```

Keep:
```
GROUND_WORKER_INPUT_DIR=/app/corpus
GROUND_WORKER_INPUT_SCOPE=historical-round6-staging
GROUND_WORKER_HEALTH_PORT=8080
GROUND_WORKER_INTERVAL_MS=60000
```

INPUT_DIR remains the explicit embedded rollback input; azure-blob mode ignores it as a primary source and verifies the newly downloaded scratch instead. Omission of INPUT_SOURCE preserves the existing embedded behavior. Unknown source or missing MI configuration exits unsuccessfully. A blob failure marks unready, logs only a fixed failure event and retries later; it NEVER falls back to embedded success. Existing freshness checks, health endpoints, authority flags and graceful shutdown are retained. Azure supplies IDENTITY_ENDPOINT/IDENTITY_HEADER automatically. User-assigned identity must be attached and available to the Main lifecycle (not pull-only None).

## RBAC and connectivity

Worker role: Storage Blob Data Reader (`2a2b9908-6ea1-4ae2-8e65-a410df84e7d1`). It permits blob read/list without write/delete. Assign only on:

`/subscriptions/a0d869a1-8cdc-4b87-891c-9d92dd52320d/resourceGroups/rg-orimusu-ground-staging/providers/Microsoft.Storage/storageAccounts/orimusugroundstg01/blobServices/default/containers/ground-evidence-staging`

Grant to the principalId of id-ground-worker-staging, not its clientId, the ACR resource identity or the human operator. Do not grant Storage Blob Data Contributor/Owner or account-wide read to this worker. Check inherited/custom assignments and management-plane listKeys/wildcard authority as well: adding Reader does not remove existing write authority. Container scope does not authorize the account-level user-delegation-key action. No SAS is used.

The separate seeding operator needs write permission (e.g. Storage Blob Data Contributor scoped to this container); never assign that to the worker. A container-scoped role cannot create the parent container, so container creation is a separate authorized operator action. The container must have public access disabled. Existing ACR pull permissions remain as they are.

Network: main container needs HTTPS/DNS access to orimusugroundstg01.blob.core.windows.net and its local MI endpoint. Storage firewall/private endpoint/HNS state and effective role assignments are not verified while Azure CLI is unauthenticated. No network restrictions are weakened. AI Search and Foundry are not connected.

References:
- https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/storage#storage-blob-data-reader
- https://learn.microsoft.com/en-us/azure/container-apps/managed-identity#rest-endpoint-reference

## Seed and equivalence procedure — not executed against Azure

1. Authenticate the operator to the expected subscription. Read the existing storage configuration, container presence, identity principalId and all effective/inherited assignments. Resolve required IAM through the authorized administrator; do not assume current ACR pull authority permits blob reads.
2. Create private container ground-evidence-staging if absent. Assign container-scoped worker Reader and the separate seed operator's write role. Verify no worker write/delete privilege and MI Main availability.
3. Run from this checkout, with the approved source directory (the already verified embedded corpus):

```sh
python3 containers/ground-worker/seed-blob.py prepare --source /absolute/approved/corpus --output /new/local/seed-directory
python3 containers/ground-worker/seed-blob.py seed --source /absolute/approved/corpus
python3 containers/ground-worker/seed-blob.py verify --source /absolute/approved/corpus
```

The program validates every local hash before any Azure operation. All Azure calls force --auth-mode login. Seed uploads payloads first, manifest last, with --overwrite false and --if-none-match '*'. Existing blobs/collisions stop the seed; there is no automatic overwrite or delete. An interrupted incomplete release is unreadable and needs operator reconciliation; do not blindly overwrite/resume. Remote verify downloads manifest plus every payload and requires exact byte equality with the approved local source, independently of JSON/domain equivalence. No service principal secret is accepted by the script.

4. Run the separately delivered GROUND-AZURE-002-live-check.sh as a one-off process inside the CURRENT container through its authenticated console/exec, after verifying sufficient resource headroom. It uses the existing image's own manifest and verify.js, requests the named MI token, reads the seeded release and checks its result against the embedded corpus. It does not change configuration, restart the existing worker, write canonical data, or deploy a revision. Only private scratch is written/removed. This is required to prove real MI access and network reachability; an operator's successful download alone does not prove worker access.
5. Require exactly: files_checked=152, source_traversals=87, queries_checked=40, claims=187, evidence=57, production_input=false, production_authority=false, source_authenticity_certified=false. Keep the readback and live check evidence.
6. Only after byte equality AND effective read-only permissions AND independent MI semantic verification pass: build/test the changed image, then obtain deployment authorization before switching primary source. Current image is untouched during this task.

## Rollback

Embedded /app/corpus and its exact pins remain in the Dockerfile/image. Set INPUT_SOURCE=embedded in an explicitly authorized rollback, or return to the existing healthy revision/image digest sha256:64c5df8036d013cf75a0a52731f6f681181f111a22485cacad6bbe69fc9e6e56. Changing a config/revision is a deployment action and is not done by this preparation. There is no automatic fallback after a Storage failure.

## Verification record

- Core typecheck and worker compilation PASS; new test typecheck PASS.
- Existing six worker tests PASS (including readiness and SIGTERM/SIGINT).
- Eight Blob tests PASS: exact semantic equivalence, default/invalid source, missing MI, altered/incomplete/duplicated manifest, 404/403/corruption, oversized responses, redirects, invalid token, abort and scratch cleanup.
- Seed payload independently compared byte-for-byte with all 152 approved files; manifest identical. Running the unchanged verify() on the exported seed files reproduces every success-gate value exactly.
- Full core: 4110 total, 4108 pass, same two baseline contract-composition failures, no new failures. No core contract changed.
- Cloud seed/equivalence, effective RBAC, real MI access, Linux image build and new revision are NOT verified/executed. Local transport tests are mocks using real corpus bytes, not evidence of Azure connectivity.
