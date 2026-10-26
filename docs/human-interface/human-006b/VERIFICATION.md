# HUMAN-006B — In-Page Navigation / Context Retention

Date: 2026-09-16. Branch: `ground/human-006b`.
Base: `1bf1e44ac44c7fc2644f5ca2f47be40119e55b29`.
Worktree: `/private/tmp/ground-human-006b`.

## Boundary and implementation

Presentation only. No changes to canonical read scope, API handlers/adapters, ground-core, schema, fixtures, or live Project. No new dependencies. No publish or owner session.

- Native links target Entity, Worldline, Observations, Claims. Zero-result sections remain navigable as scope results. These are document navigation, not semantic ordering.
- Compact sticky context repeats canonical Entity label and kind. Label links to complete Entity fields/ID. Project and Back to top remain accessible while reading raw. Long labels can wrap to two lines in the compact bar; full label remains in canonical fields and heading.
- ResizeObserver measures presentation height for scroll margin. Allowlisted fragments receive focus after asynchronous read completion and on hash changes. Fragments do not select or reinterpret records.
- Transport metadata uses a default-closed details element. Source mode, qualification, fingerprint and stored/read schema remain one disclosure action away; transport raw remains nested.
- Existing raw disclosures remain closed initially. Observation-linked Evidence remains immediately under its Observation. No representative record selection.
- Request rendering was extracted without changing fetch behavior to test loading/error scope guards directly. It stores no additional semantic state.
- Existing opt-in live UI test expected hash was updated to the approved LIVE-004C snapshot. This is a test baseline change only.

## Browser verification

Preview: `http://localhost:3006`, existing API/router and explicit existing runtime config. CUA browser audit at 390×844, followed by restoring viewport override.

- Live FRUS 392 / 393 / 394 / 396: Project → Document → Observations link → local Evidence → Evidence raw expansion → sticky Project return. Correct Entity identity retained for every document. Raw shows observation_ref. No horizontal page overflow (390px content width).
- 394: Observations reached in one link action, independent of preceding document height. Sticky bar about 100px; target heading about 112px below viewport top, unobscured. These measurements are audit observations, not a performance contract.
- HUMAN-001: Observation 0 section still navigable; Claim 1 retained. Claims link activated with Enter; focus lands on Claims.
- B15: Event 1 / State 2 / Observation 2 retained; both Observations displayed with their respective Evidence results (0 and 1). No representative Observation.
- Round4 Entity 466b098e-ae25-5b28-ad11-a5dc931eeb75: direct Claims navigation, all 23 Claim disclosures retained. First Claim and its raw expanded; sticky identity/navigation remain usable and Project return succeeds. Navigation does not cover the section heading or disclosure controls.
- Fragment reload of live 394 #observations restores section position and focus after read. Entity link keyboard activation focuses Entity canonical fields. Back to top succeeds.
- Transport opens in one action and exposes source fields, fingerprint and schemas.
- Loading: temporary audit-only wrapper delayed the real read by 20 seconds, without altering response bytes or product server code. Loading displayed no previous canonical identity/navigation. Delay reset to zero afterwards.
- Error: absent valid-format Entity ID returns actual ENTITY_NOT_IN_SNAPSHOT / HTTP 404. No sticky identity or canonical content, and no fabricated zero-count result.

## Automated verification

All commands executed from the dedicated worktree.

```sh
TSX_TSCONFIG_PATH=server/human-interface/ui-test-tsconfig.json node --import tsx --test server/human-interface/*.test.ts server/human-interface/*.test.tsx ground-core/__tests__/observation-evidence-read.test.ts ground-core/__tests__/epistemic-core.test.ts
```

111 tests: 110 PASS, 0 FAIL, 1 opt-in live test SKIP. Separately with explicit existing GROUND_RUNTIME_CONFIG, observation-evidence-ui.test.tsx: 5 PASS, 0 FAIL (includes skipped live test; four overlap). All 111 distinct tests covered successfully.

New navigation tests: six, covering anchors/focusable targets, retained identity/returns, transport disclosure, B15/Round4, stale loading scope and error with old response.

- Core typecheck: `npx tsc --noEmit -p ground-core/tsconfig.json` PASS.
- Adapter typecheck: `npx tsc --noEmit -p server/human-interface/tsconfig.json` PASS.
- `npx eslint src/human-interface` PASS.
- `npm run build` PASS.
- `node --import tsx scripts/human-interface/verify-human-001.ts` PASS.
- `git diff --check` PASS.
- Full core suite not run; no core semantics changed.

## Read-only verification

Live Project: `088d09dc-dfc5-487a-8f8f-22d2b33a9249`.
Before and after browser audit, exact-file SHA-256:

`f45b265afb6f4d9165ac46aa26eb1f16d82bbf94a3739212421bca93463e830b`

Stored/read schema remains 0.1.25. Diff is limited to presentation, UI tests and this record. No canonical storage write, schema/core/API contract/fixture mutation. Original dirty checkout not modified by this task.

## Remaining limits

Long raw/record fields and within-section traversal remain long. This change improves section access, not record summarization. Narrow viewport audit is not a complete mobile UX or third-party comprehension study.

Projects catalog remains ID-centered; catalog title enrichment is a separate contract question. Provenance/source locator traversal remains outside read scope. Search/filter/sort/comparison/Timeline/Graph are not justified by this audit. No blocking issue found for this checkpoint; no automatic HUMAN-006C work or remote push. Further interface work should follow an observed remaining task, rather than automatic feature expansion.
