# LIVE-004B verification

Base: a6f4de1ff92f8ce2e6e6c16de66e714b68b97f9f (SEMANTIC-002).
Branch ground/live-004b. No remote push or live publish. Human Interface unchanged.

Live start/end SHA-256:
f1ed694f3e0c3a10d383e816f43ca003cd6c123dad18c3f0688d2289c0f3e3bc
Stored/read schema 0.1.25. Existing canonical records: Document1/Observation1/Evidence1;
Claims/links/events/states/legacy observations0. Fresh load validates.

## Package

Tracked inputs and hashes: selection-manifest.json and selected-{393,394,396}.json.
Approved IDs/content, namespace and exact seed algorithm documented in package README.
package-fingerprint.json aggregate:
1dbeec4e4719970d7254c4a7b5ba614651a9b13d4bd4fc88308c2b1368a94f69
Enclosing commit is reported after committing, not included in its own fingerprint.

Full source hash and selected input hashes match LIVE-004A approvals. All 9 IDs exact,
mutually distinct and absent from actual live baseline. Per-document NOT_APPLIED,
batch READY. Ready is preflight eligibility, not publication authorization.

Dry projection uses a single canonical live load then memory-only applyPatch. Delta
+3/+3/+3 entities/epistemic observations/evidence; all other collections unchanged.
Existing392 records and semantic metadata/current_state unchanged. Core project and
state updated_at permitted; never restored. Canonical validator/reference invariants
PASS. Full candidates and individual hashes in dry-review.json use labeled DRY_RUN
bindings, not future final timestamps/hashes. Repeated dry CLI output byte-identical.
392 original and shared-composition patches byte-identical at the same supplied clock.

## Verification results

Dedicated batch + prior Historical package suites: 37 PASS / 0 FAIL (13 new tests).
Full core baseline: 3,807 PASS / 104 FAIL, 3,911 tests.
Full core final: 3,820 PASS / 104 FAIL, 3,924 tests.
Failure name sets identical; existing missing storage fixture failures retained.
Core typecheck: PASS (`tsc --noEmit -p ground-core/tsconfig.json`).
Production build: PASS (Vite, 219 modules).
Initially sandbox IPC blocked tsx CLI startup and a nested CLI test; final full suites
were run in the normal permitted environment on both baseline and candidate.

Current HUMAN-005C read-adapter (1bf1e44ac44c7fc2644f5ca2f47be40119e55b29), without
modifications, read the memory candidate: Browse4 Documents, each Observation1 and
observation-linked Evidence1. No new source registry/UI branch introduced. This is
server-contract verification, not a claim of browser testing against published data.

Prepared receipt exact-format validator rejects changed/unbound completion values.
Future completed receipts include all timestamp-bearing record hashes. Mixed state,
partial state, source/URL collision, extra references, content/provenance differences,
missing or mismatched receipt all HOLD. All exact is NO_OP.

Recovery procedure tested using actual baseline bytes in operations-only temporary
location: /private/tmp/live-004b-recovery-kjAmnt/before-project-state.bytes.
Hash equals live baseline; exclusive creation rejects overwrite. No rollback.
This temporary backup demonstrates the procedure; LIVE-004C must prepare durable
owner-managed operations material afresh after checking the then-current baseline.

## Gate

LIVE-004B freeze/dry verification complete. LIVE-004C NOT EXECUTED. Future publish
requires explicit approval, enclosing package commit/hash verification, owner session,
fresh expected-before check, durable backup and prepared journal, final clock binding,
one atomic save, owner release, independent exact snapshot read and completed receipt.
Known 104 failures remain; no new suite failure. No Human Interface change required.
