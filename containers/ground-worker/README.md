# GROUND Azure worker — BLOCKED before container verification / publication

Canonical repository: https://github.com/shulovm/seiri-ai-frontend
Remote HEAD/master and clean local master: 45140c001bbc6076496c7a6e12971509362ba665.
Implementation is in the isolated local clone, branch ground/azure-worker-001; original master is unchanged. No GitHub push or Azure resource creation occurred.

## Selected workload and binding

Read-only Historical Reality Round6 corpus integrity/provenance/replay verification. This is an existing workload wrapped in a serial timer, not a new domain architecture. The user approved tracked public-evidence corpus for staging only.

Existing binding: ground-core/experimental/historical-reality/round6/territory.ts exports materializeRound6, traceTerritory, queryTerritory and assertTerritorialProjection. Existing scripts/repro/reproducibility.test.ts proves their binding to the archived dataset, traces, queries and Source/Claim/Evidence projection. docs/repro-001/README.md documents historical admission against earlier frozen witnesses. Runtime reuses those functions plus loadProjectSnapshot, without executing the writing replay scripts.

Project ID: 19041904-1904-4904-8904-190419046006.
Input: tracked Historical Reality Round1–6 evidence and related archived records; 152 pinned non-code files. The packaging manifest identifies exact bytes from the verified master; it is not a new admission or authority contract. Tests/synthetic fixtures are not used as runtime input. Experimental historical records retain their original status; no canonical-live storage root is registered.

Each pass checks byte integrity, existing parent hashes and dataset contracts, 87 source traversals, 40 frozen queries, and existing projection invariants. Result: 187 claims and 57 Evidence records; zero historical RealityEvents, RealityStates or direct EpistemicObservations. Successful verification does not certify source authenticity, truth, knowledge, production readiness, or execution authority.

## Runtime

Entrypoint: node containers/ground-worker/main.js

Required environment:
- GROUND_WORKER_INPUT_DIR=/app/corpus
- GROUND_WORKER_INPUT_SCOPE=historical-round6-staging

Optional environment:
- GROUND_WORKER_INTERVAL_MS (default 60000, range 1000–86400000)
- GROUND_WORKER_HEALTH_PORT (default 8080, range 1024–65535)

Missing/invalid configuration exits unsuccessfully. Missing/corrupt input never becomes ready; retries remain read-only. /healthz reports process liveness; /readyz requires a recent successful full pass. Logs expose counts and fixed status fields, not source text or exception payloads. SIGTERM/SIGINT stop the timer, mark unready, close HTTP and exit normally. Cycles are synchronous and serial; unusually slow input can delay signal delivery. The fixed corpus was tested locally, not under an ACA shutdown deadline.

Container is configured as non-root. Intended invocation AFTER successful container build:

```sh
docker run --name ground-worker-check --read-only --cap-drop=ALL \
  --security-opt=no-new-privileges --network=none \
  -e GROUND_WORKER_INPUT_DIR=/app/corpus \
  -e GROUND_WORKER_INPUT_SCOPE=historical-round6-staging \
  ground-worker:staging-45140c0-20260925-r1
```

Use docker stop --time 30 ground-worker-check, inspect exit code/logs, and separately validate readiness and SIGINT. No Container App is created by any supplied file.

This worker performs no network requests or writes. Storage/Search/Foundry use: none. Input is the packaged immutable staging corpus; repeated checks do not acquire new evidence. Corpus updates require another reviewed source version and image.

Managed identity readiness: no secrets, credentials or production keys. ACR pull is performed by the future Container App platform identity, not by code inside the worker. There is no Azure SDK fallback to environment secrets; no runtime data-plane Azure role is required.

## Build and publication status

Dockerfile.worker pins node:24.15.0-bookworm-slim by verified index digest sha256:4e6b70dd6cbfc88c8157ba19aa3d9f9cce6ba4703576d55459e45efcbc9c5f5d. npm ci uses the existing unchanged lockfile; runtime copies only the required AJV dependency closure, compiled imports, schemas and pinned corpus. The allowlist excludes .env, .git, runtime storage and tests. Registry credentials are not included.

Proposed tag (NOT BUILT/PUSHED): ground-worker:staging-45140c0-20260925-r1.
Registry verified in Azure Portal: orimusugroundacr, Premium, Japan East.
Actual login server: orimusugroundacr-f2gecfdaa2ddfzhb.azurecr.io.
Target full reference (NOT PRESENT/NOT VERIFIED): orimusugroundacr-f2gecfdaa2ddfzhb.azurecr.io/ground-worker:staging-45140c0-20260925-r1.
Image digest: unavailable; no image has been built or pushed in this task.

Before any ACR build upload, create a clean allowlisted build context; do not upload this working directory, local credentials, node_modules, Git history or runtime-layout verification files. Dockerfile-specific dockerignore behavior is not evidence of what Azure CLI uploads. Build/start/stop verification must pass before image publication is reported.

## Azure permissions to verify, not granted by this task

For ABAC mode: builder needs Container Registry Tasks Contributor for ACR quick tasks and Container Registry Repository Writer for ground-worker; quick-task workflows may also require Container Registry Repository Catalog Lister per current Microsoft guidance. Use the caller identity with --source-acr-auth-id '[caller]' when appropriate. Registry read access is needed to verify location/login server/mode. Recheck actual roleAssignmentMode before selecting the role model; it was not confirmed in this task.

Future Container App pull identity: Container Registry Repository Reader scoped to ground-worker on an ABAC-enabled registry; AcrPull for legacy RBAC mode. Configure managed-identity pull using the verified login server, and verify the registry's ARM-token authentication setting. No role assignments or identity creation are performed here.

Sources:
- https://learn.microsoft.com/en-us/azure/container-registry/container-registry-rbac-abac-repository-permissions
- https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/containers
- https://learn.microsoft.com/en-us/azure/container-apps/managed-identity-image-pull

## Verification and blockers

PASS: core TypeScript; worker compilation; worker test typecheck; six worker tests, including real child-process readiness, invalid input, altered corpus, SIGTERM and SIGINT. Minimal staged runtime filesystem with only the Dockerfile's declared dependency closure/schemas successfully verified the full approved corpus. This filesystem check is NOT a container build/start test.

Full repository test runner, both unchanged master and candidate: 4110 total, 4108 pass, same 2 failures, zero skips. No new core failures. Existing contract-evolution tests reject the current candidate path set. The baseline composition record predates STORAGE-002/003, owner-cli, storage-owner, persistence/storage-owner tests, verify-human-001 and runner-copy-policy files. Do not relax this guard for containerization. Minimum safe resolution is an explicit, evidence-backed composition-contract update covering already adopted changes and their checkpoints, with review of the complete byte diff; adding paths blindly is insufficient. This is outside the minimum containerization change and was not performed.

BLOCKED: container build/start/stop and ACR push. No Docker, Podman/Colima or Azure CLI found locally. Portal sign-in and registry overview succeeded, but Cloud Shell Bash selection repeatedly failed in the UI automation tool. No authenticated executable build path was established. Restore an operable Cloud Shell or authenticated Azure CLI/build host and resolve the existing contract gate before declaring the image ready. No digest can be returned until build/push completes.
