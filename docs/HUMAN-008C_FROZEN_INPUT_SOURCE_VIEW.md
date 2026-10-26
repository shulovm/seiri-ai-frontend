# HUMAN-008C — Frozen Input Source View

Baseline: `16c4f0ebb0042ecdb344abb38077835672821514` (HUMAN-008B).
The exact baseline was pushed to origin/ground/human-008b and independently checked with ls-remote before C work.
Remote checkpoint: GROUND Human Interface — Frozen Provenance Source Resolver v0.
C branch/worktree: `ground/human-008c`, `/private/tmp/ground-human-008c`.

## Implemented UI boundary

Every returned EpistemicObservation has the same closed native disclosure, `View frozen inspection input`, after its canonical record panel and before its Observation-linked Evidence. There is no provenance-pattern/domain check. HUMAN-008B has no availability hint; a uniform explicit request with a local unsupported result satisfies the approved alternative without enlarging the server contract. A visible action does not assert supported resolution. No support hint or server endpoint change was needed.

Nothing is fetched on initial render. Opening a disclosure triggers the existing independent GET endpoint with only Project/Entity/Observation route IDs and the displayed Entity response's fingerprint in `If-Ground-Snapshot-Fingerprint`. The frontend does not specify path, source key, package commit, receipt or filename. The client checks returned contract, binding IDs and snapshot fingerprint before displaying a success response.

Three authority areas remain distinct:

- Existing canonical EpistemicObservation fields/raw are projection output.
- Frozen selected input is in a separate dashed panel, labeled projection input, with source/report/actor fields from the response. Fields are not renamed Original text or Source quote, and no missing values, interpretation, title, ranking or summary is generated.
- Operations / binding metadata is initially collapsed. One action exposes package commit, fingerprint and its kind, selected/dataset/receipt fingerprints, current Project fingerprint, Observation record hash, source qualification and returned binding context. Metadata is not inserted into the canonical record panel.

The structured view preserves complete returned source/report fields, including identity, title, locator, access date, creation, subject/claimant refs, predicate/object, extraction, epistemic_limit, temporal/spatial scope and relevant actor records. Stored fields such as authenticity and extraction confidence remain input declarations, not UI judgments. The explanatory text explicitly disclaims historical truth/source authenticity verification.

`Raw selected input · complete registered artifact` is a one-action native disclosure showing the entire returned raw string verbatim. It is not the full Round1 dataset. Raw/pre areas are capped at min(60vh, 32rem), retain all text and scroll internally. Operations metadata is independently expandable in one action.

Source URL is separately labeled External source URL, with a note that its current web content is not guaranteed equal to the frozen input. Only HTTP(S) URLs become outbound links; no automatic external fetch/iframe/preload occurs. Frozen input viewing needs the application/server connection, but no external FRUS website connection. The external link was not opened during the audit.

Observation index and Entity sticky context are unchanged. The panel provides Back to Observation and, for multi-record scopes, Back to Observation index at top/bottom. Close at the bottom returns focus to the disclosure summary. Source input remains visually outside the Evidence relation section.

## Request lifecycle and errors

State belongs to each Observation panel. Its React key includes Project/Entity/Observation/fingerprint, so a scope/snapshot change creates a fresh closed panel. Close/unmount aborts in-flight requests; aborted responses cannot repopulate a closed or departed panel. Closing clears the prior result; reopening is a new manual request with the same displayed precondition. Inner raw/metadata toggles do not trigger another source fetch.

Loading only replaces the panel body. Canonical content, provenance, Evidence and Entity context remain mounted. Errors are local role=alert content, classified by transport code with separate explanations for unsupported, unavailable, integrity, snapshot and binding failures. A failure does not turn the page into a Reality read failure or an empty collection.

Manual retry sends the same displayed fingerprint. There is no automatic retry, refresh or request to obtain a newer fingerprint. Snapshot mismatch text instructs an explicit Entity-page reread if the user wants updated data. Unsupported B15 provenance remains visible and valid independently of the unavailable resolution capability.

## Browser proof (2026-09-16)

Dedicated preview: localhost:3008, unchanged HUMAN-008B router plus a temporary audit-only wrapper outside the repository. Wrapper logged source request IDs/headers and injected delay/errors for failure testing. It did not change canonical responses, storage, bundle or receipts; fault mode restored to empty after verification.

- 392: initial page/Observations navigation showed zero source requests; opening produced exactly one request with the displayed live fingerprint. Structured report c392-instruction, complete raw and operations metadata all opened correctly. Raw/metadata toggles kept the count at one. Closing cleared results and focused the summary.
- 395: index → each Observation → source → raw → index, for c395-sunk, c395-first-fire, c395-captured in existing response order. Each raw and structured report matched its own Observation; all three canonical Observations and local Evidence scopes remained.
- 678: c678-sent and c678-uncertainty resolved to separate panels and raw reports; Evidence remained one per Observation. A browser inspection call timed out once; direct fresh DOM inspection confirmed the already-open first result, then verification continued without repeating the request.
- 430: c430-occupation, c430-consent, c430-guarantee each opened distinct structured/raw inputs via the index. All three remained separate.
- Narrow 390×844: 430 and 395 checked with source, raw and metadata expanded. document scrollWidth equals viewport width 390px. Long hashes and external URLs wrap; raw height is 506px even with roughly 5,997px of wrapped raw text. Sticky Entity context remains at top 0. Closing restores the summary near the preserved Evidence section.
- Keyboard Enter on the 430 third disclosure starts its request normally.
- Loading: a 15-second injected source delay displayed only a local status; all 3 canonical Observations, 3 Evidence records and sticky 430 context remained. Closing while pending cleared/aborted that panel.
- Snapshot mismatch: injected HTTP 409 SNAPSHOT_MISMATCH stayed local. Manual Retry with displayed snapshot repeated exactly the same fingerprint. No automatic source request or new Entity fingerprint acquisition occurred.
- Integrity failure: injected HTTP 503 PROVENANCE_INPUT_INTEGRITY_FAILURE stayed local; 3 Observations/3 Evidence remained, width 390px. No live/bundle bytes were corrupted to create this proof.
- B15: real unchanged endpoint returned PROVENANCE_SOURCE_UNSUPPORTED. Both canonical Observations, the 2-item index, Worldline, and Evidence counts 0/1 remained intact. Missing external_id is labeled field omitted, not fabricated as null or inferred from entity_id.
- HUMAN-001: no source panels for zero Observations, 1 Claim retained.
- Round4: no source panels for zero Observations, 23 Claims retained.
- Temporary viewport was reset. Final preview left on a successful 395 stored input report.

Semantic audit: labels and boundaries distinguish canonical output, frozen projection input, operations metadata and Evidence; show stored report ID/predicate/object/source locator; keep selected/package fingerprint available. Success never adds a verified/trusted/proof label. Researcher paraphrase is not relabeled exact quote. External web content is not equated with frozen bytes. No source ranking, chronology, source authenticity or truth determination is introduced. This is an agent browser audit, not independent third-party comprehension proof.

## Verification and unchanged sources

- Default regression suite: 136 tests, 132 PASS, 4 opt-in live skips, 0 FAIL.
- UI/client plus opt-in live Observation/Evidence/navigation suites: 13 PASS, 0 FAIL, 0 skips.
- Tests cover all 16 registered input views; exact raw preservation; metadata collapse; external URL separation; native closed disclosure for both supported and unsupported provenance; exact snapshot header/route; wrong response identity/fingerprint rejection; classified errors with no client retry; existing Observation index and Evidence/Claim regression.
- Actual lazy-fetch count, loading lifecycle, failure locality, keyboard, close/focus and responsive behavior verified in browser as above.
- Core/adapter typecheck, Human Interface lint, Vite production build, HUMAN-001 foundation verifier and diff whitespace check: PASS.
- Full core suite not rerun; known 104 missing-fixture failures untouched.
- Live before/after SHA-256: `9ff0d8070296d2d5493b618b13d75beab003581a6f7011ae642a53f46fc453cf`.
- Bundle files are unchanged from HUMAN-008B. Origin verifier again confirms 21 exact Git blob artifacts, 3 exact original receipt copies and 16 bindings. No operations assets/runtime config writes were performed. Original receipts remain byte-identical to bundle copies.
- Server implementation/API, existing Entity response, source registry, provenance registry/bundle, core and schema are unchanged. Only presentation/client, UI tests and this document change. One previous navigation test count changes from 2 to 4 return links per multi-record group because the new source panel adds two explicit returns.

Reproduction:

```sh
TSX_TSCONFIG_PATH=server/human-interface/ui-test-tsconfig.json node --import tsx --test server/human-interface/*.test.ts server/human-interface/*.test.tsx ground-core/__tests__/observation-evidence-read.test.ts ground-core/__tests__/epistemic-core.test.ts
GROUND_RUNTIME_CONFIG="$HOME/Library/Application Support/GROUND/runtime.json" TSX_TSCONFIG_PATH=server/human-interface/ui-test-tsconfig.json node --import tsx --test server/human-interface/frozen-input-ui.test.tsx server/human-interface/observation-evidence-ui.test.tsx server/human-interface/observation-navigation-ui.test.tsx
GROUND_OPERATIONS_ROOT="$HOME/Library/Application Support/GROUND/operations" node --import tsx scripts/human-interface/verify-provenance-origin.ts
npx tsc --noEmit -p ground-core/tsconfig.json
npx tsc --noEmit -p server/human-interface/tsconfig.json
npx eslint src/human-interface
npm run build
node --import tsx scripts/human-interface/verify-human-001.ts
```

## Remaining boundaries

Read scope remains the approved 16 Historical Round1 bindings. Other source families and future publications need explicit server bindings; a generic file browser, full dataset traversal, external source verification and provenance graph remain out of scope. No absence or truth conclusions follow from an unsupported expansion.

Presentation remains field-oriented and can be long when multiple source panels are open. Bounded raw areas, close/focus and index returns make navigation possible; independent reader comprehension and much larger source collections remain unproven. Support availability is intentionally learned by explicit request, so an unsupported record still offers the same action.

No blocker remains for HUMAN-008C. Further Human Interface work should be driven by observed reader friction or separately approved read-scope needs; Search/Timeline/Graph are not justified by this checkpoint. Do not automatically begin HUMAN-008D.
