# GROUND Phase 0 Baseline Freeze

**Date recorded:** 2026-08-24  
**Updated:** 2026-08-24 (GROUND-001 typecheck repair)  
**Purpose:** Freeze the pre–Reality Core v0.7 measurement bar.  
**Scope:** Inspection + validation + typecheck hygiene only. No Worldline / Claim / Evidence / Situation / Intent implementation.

---

## Executable baseline (authoritative)

| Check | Result | Command / evidence |
|-------|--------|-------------------|
| Unit tests | **341 pass / 0 fail / 0 skipped** | `npm run test:ground-core` |
| Typecheck (`tsc -p ground-core`) | **PASS — 0 errors** (GROUND-001) | `npx tsc --noEmit -p ground-core/tsconfig.json` |
| Frontend build | PASS | `npm run build` (Vite; not ground-core runtime) |
| ESLint on ground-core | N/A (ignored by root eslint) | Root `npm run lint` fails on `.next/` noise — not a ground-core signal |
| Dogfood Gate 1.1 | **Historical success + unit regression** | Artifacts: `ground-core/storage/.dogfood-gate1.1-tmp/`; no npm gate script. Regression: `reality-loop.test.ts`, `reality-semantics.test.ts`, `reconcile.test.ts` |

Historical claim `341/341` matches current repository reality.

---

## Phase 0 Gate

**PASS — Phase 0 baseline is clean; ready for GROUND-002 / Phase 1 Reality Core**

Verified:

1. `tsc -p ground-core` → 0 errors (GROUND-001)
2. `npm run test:ground-core` → 341/341
3. Single mutation path via `applyPatch` + `saveProject` preserved
4. Propose paths remain non-mutating

Do not start Reality Core v0.7 until a subsequent task explicitly opens Phase 1.
