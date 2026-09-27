# GROUND staging pipeline

The control workflow is `.github/workflows/ground-staging-deploy.yml`; the separate `.github/workflows/ground-staging-auth.yml` runs authentication/capability checks and source tests without image publication or Container App updates. Both require explicit source commit and corpus release. Neither runs automatically on push.

The initial admitted source is `e23ff04b02a6df64739cb2a7d462315eb82324f2`. Trusted control code and source use separate exact checkouts. Tests have no Azure credentials. Extending source admission requires a reviewed control-policy change.

## Identity and authority

The `ground-staging` environment permits `master` only. Its four non-secret variables are `GROUND_TENANT_ID`, `GROUND_SUBSCRIPTION_ID`, `GROUND_BUILD_CLIENT_ID`, and `GROUND_DEPLOY_CLIENT_ID`. No client secret, PAT, registry-admin credential, SAS or account key is used.

GitHub's subject template is `repo/context/job_workflow_ref`. Build and deploy use distinct reusable-workflow paths, subjects, client IDs and principal IDs. The actual issued subjects and signed-in Azure principals passed GitHub run `36286944806`. Azure federation readback alone is not considered authentication proof.

The build identity has registry metadata read and Repository Writer conditioned to `ground-worker`. The deploy identity has Repository Reader with the same repository boundary, exact-app read/write/revision/replica access, table-limited Log Analytics Data Reader, and role-assignment metadata read. The runtime worker identity is never used by the pipeline.

Auth-only checks verify actual registry token authorization: build receives pull/push, deploy receives pull, neither receives delete. They read the approved manifest, and deploy reads the app, revisions, replicas, console logs and exact role assignments. Other prohibited-write checks compare assignments with the independently verified bootstrap role design; they do not attempt forbidden writes against live resources. Custom-role definitions are not independently re-read by the pipeline identity.

## Source and build gates

The authoritative source core suite returns 4108/4110 with two pre-existing composition-contract failures. Only the exact source, expected counts, names and assertion hashes in the policy are admitted. Raw failure exit status remains in evidence. Changed signatures, extra failures, skips or another source stop the gate. Worker/Blob tests pass 14/14, and the deployment guard suite passes 15/15. Historical composition contracts are not changed.

Images are built in a clean GitHub runner context from tracked source files and the existing digest-pinned base image. This avoids broader ACR Tasks authority and source-upload SAS. Publication uses the build identity's short-lived OIDC credentials. ACR and local pushed digest must agree; deployment uses only `registry/ground-worker@sha256:...`.

## Immutable baseline and deployment

The approved original baseline is stored verbatim under `baselines/cd1ea34ade3d162fc0e0bf8fa62b3afee38fd6f9d9ebd151eea49143b49890a7.json`. Its decompressed bytes were checked against the user-provided SHA-256. It is never regenerated from live state or overwritten by deployment.

Before the one permitted PATCH, the pipeline verifies that immutable baseline, the complete preserved configuration, previous revision/digest, worker RBAC, readiness, restart count, retained revisions and recent exact integrity events. The PATCH body is allowlisted and excludes GET-only scale defaults. An empty response or helper timeout causes live ARM reconciliation, never an automatic repeated write.

Postconditions require the expected immutable image and revision, Healthy/Provisioned state, a Ready/Running replica with zero restarts, unchanged configuration and worker authority, retained old revisions, at least two fresh exact integrity events, the approved Blob release and false production flags.

Success creates separate `next-baseline.json` and `baseline-lineage.json` artifacts containing parent/successor hashes, source SHA, image digest, workflow run/attempt, revision and verification evidence. The successor is not automatically substituted for the original baseline. A later rollout must explicitly admit a versioned verified successor through trusted control code.

Failure stops the rollout and retains evidence/revisions. There is no automatic repeated roll-forward or rollback. If a ready revision fails integrity verification after switching, the retained older revision is available for a separately guarded recovery; retention does not mean it is still active.

## Evidence and activity review

Artifacts record run, source, digest, time interval and revision for correlation with `ground-staging-containerapp-write-review`. The alert remains enabled; correlation does not suppress Portal incidents. GitHub artifacts retain raw evidence for 90 days. Preserve a versioned durable checkpoint and artifact hashes after a successful rollout before closing phase 004.
