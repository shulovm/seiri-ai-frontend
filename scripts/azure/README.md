# GROUND staging pipeline

Status: implementation candidate, not a deployed/verified pipeline. No Azure identities or role assignments are created by these files. Azure authority must be verified against live provider operations before bootstrap.

The workflow accepts an exact SHA and explicit approved corpus release. Trusted control code and source are separate checkouts. The initial admission is only `e23ff04b02a6df64739cb2a7d462315eb82324f2`; extending admission requires a reviewed control-policy change. Tests execute without Azure credentials. Tests, build and deploy use separate jobs; build/deploy use separate reusable workflows and must receive distinct OIDC subjects containing `job_workflow_ref` and the `ground-staging` environment. The environment allows only `master`. No human reviewer is required for routine staging runs.

Build uses a GitHub runner and a clean tracked-file context. This avoids the broader ACR Tasks role and ACR source-upload SAS. The existing Dockerfile and pinned base image are unchanged. Login occurs after build. Repository Writer must be ABAC-conditioned to `ground-worker` on this registry, with registry metadata read only. Deployment receives repository Reader, exact-app update/read and required read-only monitoring/audit capabilities. See `ground-staging-authority.json`; this is a plan, not evidence of a grant.

## Gates and current blocker

Local source validation on Node 24.15.0: core typecheck passes; compiled worker/Blob tests pass 14/14. The authoritative core suite returns 4108/4110, with the two existing composition-contract failures named in the policy. These failures are not waived or turned into success. The workflow stops before build/login/deployment until the source composition authority is resolved. Do not edit historical manifests or widen the composition guard just to pass CI.

The test layout must include compiled code, `corpus-pins.json` and `docs/schemas`, matching the Docker runtime layout. Missing compiled/schema files cause harness failures and are not source regressions.

## Bootstrap requirements

1. Read exact live worker configuration, replica state, retained revisions and worker role assignments. Save a reviewed baseline JSON with `contract`, `revision`, `image`, `worker_principal_id`, `worker_roles`, `retained_revisions`. Do not silently learn a drifted baseline.
2. Resolve exact provider actions and ACR ABAC mode. Create the two separate identities and narrow roles only after those checks. Never alter the worker identity's grants.
3. Configure GitHub OIDC `repo/context/job_workflow_ref`; verify the actual repository subject format before creating matching Azure federations.
4. Configure `ground-staging` variables `GROUND_BUILD_CLIENT_ID`, `GROUND_DEPLOY_CLIENT_ID`, `GROUND_TENANT_ID`, `GROUND_STAGING_BASELINE_JSON`. They contain identifiers/configuration, no credentials.
5. Install the three workflows/control scripts on the trusted default branch. Dispatch only the approved source and release after test gates pass. Capture Azure and GitHub readbacks; installation alone is not live validation.

## Deployment and recovery

The deployer compares the complete preserved configuration against the approved baseline, verifies runtime and RBAC before one sanitized PATCH, then reads ARM regardless of PATCH output. It never retries a write because JSON was empty or the helper timed out. Old revisions are retained. Postconditions include actual container readiness/running/zero restarts, exact digest, at least two fresh integrity cycles, exact metrics/release and false production flags. The current logs are read with the proven REST path, not the unavailable Log Analytics CLI command.

On failure it stops and retains evidence. It does not automatically roll forward or roll back. If ARM switched to a healthy revision but its integrity verification fails, the old revision remains available for a separately guarded recovery; retaining an inactive revision is not a claim that it is still serving. No tests induce live worker failures.

The generated `next-baseline.json` is a proposed next verified checkpoint, not automatically trusted input. Before a second rollout, bind that checkpoint through the trusted deployment-control path. Automated checkpoint promotion is still an installation gap, so this candidate is not yet a complete routine-deployment service.

Evidence artifacts record run ID/attempt, source, image digest, start/end and revision for correlation with `ground-staging-containerapp-write-review`. The alert remains enabled; this implementation records correlation evidence but does not suppress Portal incidents. Evidence retention is 90 days; a permanent checkpoint store remains to be connected before claiming durable deployment history.

No worker, Storage, ingress, scale, production authority or phase-003 policy change is made by authoring this pipeline.
