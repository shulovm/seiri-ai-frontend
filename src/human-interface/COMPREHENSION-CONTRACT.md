# HUMAN-002E — Comprehension Contract / Explorer Core v0 Gate

## Scope and procedure

This document fixes screen-answerable questions and prohibited inferences for
future third-party tests. It is presentation/audit documentation, not a canonical
contract, additional source authority or a new read scope. Baseline: HUMAN-002D
96ac39bf4d4755548c1778e76f32e7c980085a4a, confirmed on origin/ground/human-002.

No independent participant took part. The implementation author already knows
the project; this is a screen-evidence-only cold pass before edits, not a blinded
or independent study. Initial observations below were recorded after opening
all three unchanged D screens, before changing JSX/CSS. No fixture-generation
knowledge was used as an answer source. Where the screen cannot justify a claim,
record “この画面／read scopeからは判断できない”, not an invented yes/no verdict.

For a future participant, provide only the three routes and the questions below,
without source code, fixture files, this answer key or coaching. Ask them to cite
visible field/record/section evidence, retain their exact response and record
whether help was needed. Exercise normal and 390x844 viewports. These questions
are comprehension probes, not a claim of statistically validated usability.
Do not count a correct number with an incorrect authority/scope explanation as
fully correct. Record unsupported truth, availability, execution or absence
inferences separately from inability to find a field. Test errors separately
from successful empty collections. Do not infer a universal success rate from
this implementation audit.

## Cold audit — unchanged D screens

### HUMAN-001

Expected to read: Entity label/identity, 1 returned Claim, explicit Claim-Link-
Evidence identities and SUPPORTS, confidence 0.95, document provenance,
applicable_from 2026-09-14T00:00:00.000Z, scope-only zeros, stored/read schemas.
Must not infer: historical truth, 95% truth probability, source trust/rank or a
1904 occurrence time from the displayed applicability/recording fields.

Observed: all these values and scope notes are exposed; one Claim is initially
expanded. Raw fields, SUPPORTS and source-reference notes are reachable. Transport
uses a dashed box; confidence has a declared-value heading, not a gauge. Risk:
Worldline and canonical sections use very similar section outlines despite their
different headings. The repeated technical vocabulary is a comprehension burden,
but no screen assertion of historical truth was found.

### B15

Expected to read: neutral controlled qualification, Event 1 / State 2 /
Observation 2 / Claim 0, literal true/false, actual validity intervals and null,
observed_at 10:00 and 12:00, four ordered entries and latest_time 11:00.
Must not infer: fake/unreliable content, Resource readiness or can_execute from
values, all-record latest time, or an Event/State-Evidence relation.

Observed: qualification appears as ordinary code in the same dashed source box,
without warning icon/color. State null is rendered literally with a field-specific
open-ended explanation. Core Worldline includes a scope note before summary;
Observation separately includes 12:00. Claims and claim-linked bundle zeros are
visible; no project-total Evidence figure appears. Risk: after scrolling past
Event/State panels, the Worldline scope explanation is distant from Observations.
A reader could treat the two times as stale/inconsistent despite the earlier note.
The screen cannot answer how many Evidence records exist in the whole Project.

### Historical Round 4

Expected to read: 23 Claims, 23 links, 1 unique linked Evidence, all Claim IDs,
shared Evidence identity, scope-only Event/State/Observation zeros.
Must not infer: importance/truth order, 23 distinct Evidence records, identical
meaning of Claims sharing Evidence, historical conclusions from experimental
metadata, or an algorithmically selected representative Claim.

Observed: counts and scopes are explicit. All 23 full-ID summaries are visible;
first Claim opens and closes, last Claim/raw/Evidence is reachable. Each bundle
retains its Evidence ID. Risk: English link/unique labels and repeated bundles
require attention to distinguish relation count from identity count. Opening
multiple long Claims increases scroll burden; native disclosure closes each one
without dropping other identities. No pagination or new navigation is needed
for the 23-record proof.

### Cold findings to address

1. Comprehension / canonical boundary: strengthen visual separation of the core
   Worldline result from canonical record panels without a trust/status treatment.
2. Comprehension: repeat a short scope reminder at Observations, where later times
   are read, without computing an all-record latest or adding entries.
3. Comprehension / read scope: explicitly distinguish link count from unique
   Evidence identity count; remind readers that this path asserts only Claim links.
4. Read-scope / error comprehension: the exposed compatibility code
   ENTITY_NOT_FOUND can sound like canonical absence. Explain its registered-scope
   meaning and explain that read errors are not zero-record results.

No raw-field corruption, new semantic value, source-based rendering branch or
missing Claim was observed. These are implementation-author risk observations,
not reports of actual participant misunderstanding.

## HUMAN-001 participant questions and answer key

Route: `/reality/19041904-1904-4904-8904-190419041904/72bf5051-f100-524a-ac33-7a911f6d974a`

Screen-answerable questions:

1. 何というEntityを見ているか？ — FRUS 1904, document 392;
   Entity 72bf5051-f100-524a-ac33-7a911f6d974a, kind document.
2. Claimはいくつ返されたか？ — This scope: 1.
3. EvidenceはどのClaimとcanonical linkを持つか？ — Claim
   79f42640-9eff-5def-a807-268ea0c0650f → link
   44bcabb0-59b3-5d23-aa4b-b9edd5d00959 → Evidence
   496d2e47-849a-5ddc-ae95-7ef6891b6ef3. Cite link claim_id/evidence_id.
4. relation名は何か？ — SUPPORTS; no UI truth verdict follows.
5. confidenceのcanonical valueはいくつか？ — 0.95, as a declared field.
6. provenanceは何か？ — Claim: kind document, entity_id matching the Entity,
   external_id frus:1904:392. Evidence retains that provenance plus its label;
   inspect raw for the complete object. It is not a trust rank.
7. applicable_fromは何か？ — 2026-09-14T00:00:00.000Z, applicability field.
8. Observation / Event / Stateはこのscopeで何件か？ — 0 / 0 / 0.
9. stored schemaとread schemaは何か？ — 0.1.24 / 0.1.25, transport metadata.

Questions for which the screen must not license a substantive verdict:

1. Claimは歴史的に真か？ — Not established by this display.
2. confidence 0.95は95%の真実確率か？ — The UI does not make this interpretation.
3. sourceはGROUNDが信頼済みか？ — No trust status is provided.
4. source rankingは何位か？ — No ranking is provided.
5. 1904年の出来事の発生日時は何か？ — Cannot derive it from Entity label,
   Claim text, applicability or ingestion fields; no Event is returned here.

## B15 participant questions and answer key

Route: `/reality/b7c4492f-955a-4189-a913-5ece6c6a876a/3b35ea51-6db5-4dee-8759-bb17377cbc0c`

Screen-answerable questions:

1. source qualificationは何か？ — controlled-experiment-canonical-snapshot,
   transport/source origin, not a canonical truth classification.
2. Eventはいくつ返されたか？ — 1.
3. Stateはいくつ返されたか？ — 2.
4. Observationはいくつ返されたか？ — 2.
5. Claimはいくつ返されたか？ — 0 in this scope.
6. Stateのvalid_from / valid_untilは何か？ — State
   7b2e555c-7fa6-40ff-8989-bdbd34657c8e: 2026-09-01T10:00:00.000Z /
   2026-09-01T11:00:00.000Z, value true. State
   6c0edf75-755d-4c03-82e4-09ff29767148: 2026-09-01T11:00:00.000Z / null,
   value false. Do not impose chronological order on the State collection.
7. open-ended Stateのvalid_untilはnullか？ — Yes, literal null; this field's
   open-ended role, not a global null/unknown classifier.
8. Observationのobserved_atは何か？ — Observation
   27e042ed-38da-44c1-8a78-0a594e04fa7a: 2026-09-01T10:00:00.000Z;
   1e8a9b55-a7fe-4bdd-8bc0-e6169ee941d2: 2026-09-01T12:00:00.000Z.
9. worldline entriesはいくつか？ — 4, in the core-returned order.
10. worldline latestは何か？ — latest_time 2026-09-01T11:00:00.000Z,
    a field of the existing core worldline result.
11. Observationに12:00 recordが存在するか？ — Yes, separately returned Observation.

Questions for which the screen must not license a substantive verdict:

1. controlledだから内容が偽物か？ — Qualification does not decide truth.
2. controlledだから信頼度が低いか？ — Qualification is not a confidence scale.
3. State falseはResourceがnot readyという意味か？ — No such UI interpretation.
4. State trueはcan_executeという意味か？ — No such UI interpretation.
5. worldline latest 11:00はReality全体の最新record時刻か？ — Not an all-record metric.
6. 12:00 Observationを含めると本当のlatestは12:00なのか？ — The screen provides
   separate results, not an alternative all-record latest or a correction.
7. Event / Stateの根拠はそのEvidenceなのか？ — No such relation is exposed.
8. Project内Evidenceが1件だから、このEntityのEventにはEvidenceが1件あるのか？
   — Neither the project-wide count nor that Event-Evidence edge is supplied by
   this screen. Do not give the participant the project count as a UI answer.

Additional scope probe: Claim-linked bundle count 0 does not prove ProjectState
Evidence absence. Correct response about the project's Evidence total is “not
returned by this read scope”, not zero and not a guessed one.

## Round 4 participant questions and answer key

Route: `/reality/19041904-1904-4904-8904-190419044004/466b098e-ae25-5b28-ad11-a5dc931eeb75`

Screen-answerable questions:

1. Claimはいくつ返されたか？ — 23, without selecting a representative.
2. Linkはいくつ返されたか？ — 23 ClaimEvidenceLink records.
3. unique linked Evidenceはいくつか？ — 1 unique returned Evidence identity.
4. 各Claim identityへ到達できるか？ — All 23 full-ID summaries are present;
   open first, another and last; cite their raw IDs. Last:
   fc2ed629-c488-53df-aaa0-6658bbb76850.
5. Evidence identityが共有されていることを確認できるか？ — Compare Evidence id
   and link evidence_id in two Claims: 7cc1cc55-845a-55ad-ac87-1293c016c0a0.
6. Event / State / Observationはこのscopeで何件か？ — 0 / 0 / 0.

Questions for which the screen must not license a substantive verdict:

1. 23 Claimのうちどれが最重要か？ — No importance ranking is provided.
2. どれが最も真らしいか？ — No truth ranking is provided.
3. 23 linksだからEvidenceが23個存在するか？ — Relation count does not imply
   distinct Evidence count; the returned unique identity count is 1.
4. Evidenceが共有されているから23 Claimは同じ意味か？ — Shared reference does
   not equate Claim meanings; separate identities and contents remain.
5. experimental metadataから歴史的結論を導けるか？ — No extra Historical
   resolution/authority is provided by displaying stored metadata.
6. UIが代表Claimを選んでいるか？ — No; all 23 are accessible in returned order.
   A closed disclosure is not omission or an implicit lower rank.

## Cross-screen error and authority probes

Ask the reader to distinguish canonical records/provenance fields from existing
core results (worldline, temporal_summary, conflict/unplaced fields) and transport
(source qualification, hash, schemas, requested scope). Raw JSON must remain
accessible within the corresponding record/result, without requiring a new API.

Show PROJECT_SCOPE_MISMATCH, ENTITY_NOT_FOUND, FIXTURE_INTEGRITY_FAILURE and
CANONICAL_READ_FAILURE separately. Expected: registered-source/scope or read
failure, no canonical absence finding. 503 must show no canonical content;
zero-record claims are not valid answers to any of these error screens.

## Gate decision and remaining limits

Decision: **PASS**, after the minimal corrections and verification recorded
in the README. PASS means only an implementation-audited common read-only core
for these three registered canonical shapes, not a completed product, participant
comprehension result or proof that no person can misread it.

Do not widen this gate to populated conflicts/unresolved/unplaced temporal cases,
new domains or naturally sourced populated Event/State/Observation, arbitrary
Entity browsing, project-wide Evidence, relation expansion, large datasets,
ranking, execution or writes. These need separately scoped work and proof.

# HUMAN-003D — Browse Comprehension Contract / Browse v0 Gate

## Method and limits

Implementer cold audit starts at `/reality` before D UI changes, inspecting three
Projects through visible navigation rather than deriving meanings from fixture
or code. The implementer has prior project knowledge: this is not an independent
third-party comprehension test. Hosted deployment is outside this local gate.

## Cold audit findings and minimal changes

- Catalog: three registered IDs and origin strings are visible, without title,
  count, hash or verified schema. “Registered” did not explicitly identify Human
  Interface as the registering scope. Added that scope and the statement that
  this is not a list of all GROUND Projects.
- Qualification: Project source section already separates origin from quality;
  catalog lacked this explanation. Added a neutral origin/truth boundary sentence,
  with no colors, warnings, badges or source-specific treatment.
- Project: fields are literal and source metadata is structurally separate.
  Prominent title and `historical sidecar required` could be read as current
  conclusions/requirements. Added a saved-field explanation, without changing
  canonical values or treating summary as runtime instructions.
- Entity selection: identity-only rows, no ranks/numbers/count badges; stored
  ordering note is already accurate. Added selection/knowledge-quantity boundary
  and identified kind as a stored field. No document→Evidence, person→Actor or
  asset→Resource mapping exists.
- Source A: visible as person in B15, opens normally, zero subject records remain
  scoped read results, no warning or error. No reverse provenance is added.
- Project error: made Human Interface registration scope explicit. Entity absence
  already states verified snapshot membership only; it is not a global absence.

## Questions and permitted answers

Projects page:

1. How many read scopes are registered here? Three visible registry entries in
   these fixtures; this is not GROUND's total Project count or a UI count metric.
2. What identifies each entry? project_id, source_key and source_qualification.
3. What does qualification mean? Snapshot origin metadata, not quality/trust/truth.
4. Can title, summary, schema validity or Entity count be concluded here? No.
5. Does order imply recent/important/production? No.

Project page:

1. What is its title/ID/summary/status? Read the saved canonical Project fields.
2. Is title a current GROUND conclusion, or summary a runtime instruction? No.
3. Which data describes the snapshot source? The separate Transport section.
4. Which Entities can be selected? Every returned canonical identity, using label,
   kind and ID; the disclosure includes project_id.
5. Does selection/order indicate importance, record quantity, completeness,
   freshness, activity or evidence richness? No.
6. Is kind mapped to another canonical role? No; it remains its saved value.

Selected Entity:

1. Why can Source A be opened despite zero records? Its canonical Entity exists;
   returned record counts describe only the selected read scope.
2. Does zero mean useless, incomplete, unknown everywhere or historical absence? No.
3. What does ENTITY_NOT_IN_SNAPSHOT establish? Only absence of that ID from the
   verified selected snapshot's RealityEntity collection.
4. What does PROJECT_SCOPE_MISMATCH establish? No registered Human Interface read
   scope for that Project ID; not absence from all GROUND.

## Gate invariants

Catalog loads only registry metadata. Project content is fetched after selection.
Canonical and transport sections remain separate. Client performs no sort/filter,
ranking, record-count enrichment, provenance traversal or temporal resolution.
Navigation adds no authority. Errors render alerts rather than empty lists.
Successful zero identity lists remain Project views (UI logic test only; none of
the three real snapshots has an empty Entity collection). Source A zero records
are covered with the existing real snapshot.

Request state is keyed by catalog/project scope and by project/entity IDs.
Render guards hide mismatching previous scope; AbortController prevents late
responses from repopulating an abandoned scope. No semantic state/cache is added.

## Remaining limits / next phase candidates

Independent reader comprehension and hosted deployment remain unproven. Future
work may run these questions with third parties, or select another real saved
shape for proof. No HUMAN-004, search, filtering, sorting, lens, metrics, expanded
read scope or write/action is started by this gate.

## Local gate result

Browse semantic gate: PASS for the three registered snapshots. No unresolved
blocking semantic bug was found. All 58 tests pass (existing 56 plus two D
semantic/presentation tests). Adapter/core typechecks, focused lint, build and
Foundation verification pass. The 36 frontend lint errors match the unchanged
baseline diagnostics. Fixture hashes, core/schema, registry and server contracts
are unchanged. Full core suite was not rerun; 3,753 PASS / 104 FAIL remains the
previous measured baseline.

Round4 has 42 reachable identity links; its final Te Papa Entity was opened and
Project back navigation succeeded. At 390×844, Project/identity associations and
qualification remain readable, with document scrollWidth equal to 390. Loading
views carry only their current request stage, while mismatched scope guards and
cancellation remain intact. Error-vs-empty behavior is covered by the preserved
read-failure tests and an additional successful zero-list presentation test.

The gate establishes local read-only discovery of registered saved Entity
identities through existing canonical read paths. It does not establish full
GROUND coverage, independent human comprehension, arbitrary future shapes,
hosted deployment or any write/action capability.
