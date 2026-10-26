# HUMAN-007B — Observation Record Navigation

Baseline: `4629b0f031e7d6c988c7199ff8ac671199454b22` (HUMAN-006B).
Branch: `ground/human-007b`. Worktree: `/private/tmp/ground-human-007b`.
Presentation-only checkpoint. No push and no HUMAN-007C work.

## Navigation decisions

- Observations section shows an index only when the returned Observation collection has at least two records. A single record retains a stable fragment without a redundant index. Zero records retain the existing scope wording and have no index.
- Each list item is one native anchor to `#observation-<canonical id>`. The focusable target is the enclosing Observation region, named with the type and full UUID; it contains the canonical record and its existing Evidence relation section.
- Primary text is exactly `content`, visually clipped at three lines by CSS. No string extraction, generated title, summary, inferred grouping, or canonical mutation. Full text remains in the link DOM/title and canonical record fields/raw.
- Secondary text is existing `provenance.external_id`, when present; tertiary text is the full UUID. Locator text is part of the record-navigation link, whose destination is only the local Observation anchor. No dataset/source resolver or traversal.
- Index and records preserve response order. An explicit note disclaims chronology and importance. No numbered ranking.
- Each multi-record group has Back to Observation index at its start and after its Evidence. From the index, any record takes one action; from another record, return plus selection takes two actions with no long page scroll.
- Prev/Next omitted: browser checks showed the index return makes every record directly revisitable, including after raw expansion. No additional response-order controls are necessary for the observed 2–3 record scopes.
- Existing sticky Entity bar, Project links, four section links, Back to top, and closed-by-default Transport disclosure remain. No Observation link list is added to the sticky bar.
- Observation/Evidence raw retains native details, with a scrollable pre capped at min(60vh, 32rem). This keeps its close control nearby without shortening the canonical JSON. Evidence remains nested under its explicit Observation scope; no independent Evidence index.
- The existing async-fragment focus/scroll handler accepts only section/index and actually returned Observation targets. It uses DOM ID lookup within the current main, without interpreting fragments as data selectors or reads.

## Browser verification (2026-09-16)

Dedicated local preview at port 3007, existing router/runtime configuration; no product server edits. Audit-only delay was set temporarily to 15 seconds and restored to zero. Default viewport 1280×720; narrow override 390×844 was reset afterward.

- FRUS 395: Project → Entity → Observations → each of three index links → corresponding record/Evidence → bottom return to index. Response order: c395-sunk, c395-first-fire, c395-captured. All direct jumps focused the correct region. Desktop target tops 112.12–112.47px below sticky bottom 100.29px. Keyboard Enter on second index link focused the correct region. Observation and Evidence raw opened; return worked with raw open. Browser back restored that record and forward restored index.
- FRUS 678: both index targets and bottom returns worked; c678-sent then c678-uncertainty, one explicit Evidence per record.
- FRUS 430: all three index targets and returns worked; c430-occupation, c430-consent, c430-guarantee, one explicit Evidence per record.
- Single cases 392 / 393 / 394 / 396 / 679 / 680 / 86 / 815: each visited from Project and through Observations link; one Observation and one local Evidence, no index. No different semantic display for singles.
- HUMAN-001: zero Observations, no index, one Claim retained.
- B15: generic two-record index, existing Japanese content unchanged, no fabricated locator; both anchor/return paths worked. Local Evidence counts remain 0 and 1.
- Round4: zero Observations, no index, all 23 Claims retained; Claims section navigation worked.
- Narrow 395: all three jumps and returns worked; target tops 112.09–112.45px. Preview, locator, full UUID wrap within viewport. Observation/Evidence raw opened, Evidence raw closed, index return worked.
- Narrow 430: third record jump, Observation/Evidence raw opening, bottom return checked visually. The index itself fits in a viewport after returning to it. Both 395/430 document scrollWidth equals 390px. Open raw height approximately 506px; full JSON scroll heights 527–610px.
- Direct 395 third-record fragment followed by reload: async response mounted and focused correct record at 112.27px.
- Project, Entity, Worldline, Observations, Claims, Back to top checked. Transport remains initially closed.
- Delayed navigation from B15 to 395: loading status displayed with no index, no retained context, zero mounted Observation groups. RequestView regression tests also check stale response objects during Project/Entity changes.
- Error route: PROJECT_SCOPE_MISMATCH alert, no index/context/record panels; it remains a read failure, not an empty canonical result.

## Automated verification

- Proof/default suite: 115 tests, 113 PASS, 2 explicit opt-in live skips, 0 FAIL.
- Opt-in live UI suites: 9 PASS, 0 FAIL, 0 skips. Actual saved 3 / 2 / 3 / 1 Observation scopes checked, including exact content, locator, unique focusable anchor, response order, and unchanged response serialization.
- Zero and two-record cases use immutable existing proofs. Single-case default render test slices an existing returned record solely in memory; it creates no canonical fixture or data. Actual live single also verified independently.
- Existing Evidence/Claim regression tests retained. Loading/error tests now explicitly reject mounted index/group markup.
- Core TypeScript check, server adapter TypeScript check, Human Interface ESLint, production build, HUMAN-001 foundation verifier, git diff --check: PASS.
- Full historical core suite was not rerun; the known 104 missing-storage-fixture failures were not changed or addressed.
- Initial HTTP suite run hit sandbox listen EPERM; rerun with local listen allowed passed. An initial all-suite invocation with live configuration exposed two pre-existing proof-only catalog assumptions; final runs correctly separate the default suite from opt-in live UI tests. No runtime/read behavior was changed to satisfy tests.

Reproduction (from worktree):

```sh
TSX_TSCONFIG_PATH=server/human-interface/ui-test-tsconfig.json node --import tsx --test server/human-interface/*.test.ts server/human-interface/*.test.tsx ground-core/__tests__/observation-evidence-read.test.ts ground-core/__tests__/epistemic-core.test.ts
GROUND_RUNTIME_CONFIG="$HOME/Library/Application Support/GROUND/runtime.json" TSX_TSCONFIG_PATH=server/human-interface/ui-test-tsconfig.json node --import tsx --test server/human-interface/observation-evidence-ui.test.tsx server/human-interface/observation-navigation-ui.test.tsx
npx tsc --noEmit -p ground-core/tsconfig.json
npx tsc --noEmit -p server/human-interface/tsconfig.json
npx eslint src/human-interface
npm run build
node --import tsx scripts/human-interface/verify-human-001.ts
```

## Read-only boundary and remaining limits

Audit before/after exact live SHA-256, Project `088d09dc-dfc5-487a-8f8f-22d2b33a9249`:
`9ff0d8070296d2d5493b618b13d75beab003581a6f7011ae642a53f46fc453cf`.

Only three presentation files, three UI test files, and this document change. Tests live under server/human-interface, but no server implementation/API/resolver/registry, ground-core, schema, read scope, fixture, experimental output, or live bytes change. Existing live UI test fingerprint expectation is updated to the approved LIVE-005C bytes; no snapshot is rewritten.

Remaining presentation limit: reading complete canonical fields still involves vertical scroll, and this audit is not third-party comprehension testing or a large-collection proof. Record-to-record discovery in the current maximum three-Observation scopes no longer depends on ~5,900px scrolling. Raw inspection retains standard nested scrolling.

Remaining read-scope limit: external_id identifies stored provenance but does not resolve the underlying dataset/document. Source traversal requires a separately approved read contract. This UI does not supply historical Event/State, original observation time, or truth judgments absent from the current records.

Search/filter/sort/comparison/Timeline/Graph remain unnecessary for the verified scope. No new input records are required to justify this navigation change. Further Human Interface feature work should wait for concrete observed friction or separately approved source-traversal needs. No blocking issue remains within HUMAN-007B; do not automatically advance to HUMAN-007C.
