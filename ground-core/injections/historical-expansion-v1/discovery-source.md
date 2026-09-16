# LIVE-005A — Historical Inspection Expansion Discovery

調査・設計のみ。コード・package・live state・UIの変更なし。新規downloadなし。以下の文面とIDは審査案であり、publish承認・凍結済みpackageではない。

## 基準

HUMAN-006B remote `ground/human-006b` = `4629b0f031e7d6c988c7199ff8ac671199454b22` 完全一致確認。checkpoint: GROUND Human Interface — Live Reality Explorer Navigation v0。

Source: /private/tmp/ground-live-004b/ground-core/experimental/historical-reality/round1.dataset.json

Tracked at ground/live-004b b361136; experimental input, canonical authorityではない。Full dataset SHA-256: `5bc32592aa80ee4742f8e01b09d4381dacc1ce080fb930772a7a1ea2b24c70c2`

Live Project: 088d09dc-dfc5-487a-8f8f-22d2b33a9249; schema 0.1.25; fingerprint開始時/終了時: `f45b265afb6f4d9165ac46aa26eb1f16d82bbf94a3739212421bca93463e830b`

Live counts: reality_entities=4, epistemic_observations=4, evidence=4, claims=0, reality_events=0, reality_states=0.

## 推奨

7 Documents / 12 Observations / 12 Evidence追加、合計11 / 16 / 16。Claim/Event/State 0維持。FRUS未publish全7件がstored textual inspectionとして互換。678のactor knowledgeは報告内容でありcanonical actor stateにしない。680のtranslation/dual dateは保存report内の修飾を保持し、新規翻訳・暦解決を要求しない。これらを実行・事実認定へ昇格させる処理は対象外。

以下のselected hashはLIVE-004B selectと同じ形（全actors、source 1、report 1、source/report一致のevidence_relationsとactor_epistemic_records、空reconstructions/interpretations/narratives）をstableSerializeしてdry計算。UTF-8、object keys sorted、array order preserved、末尾LF。実際のselected fileは作成していない。全dataset hashも保持し、選択外のcross-source qualificationを失ったと解釈しない。

## frus:1904:395 — 3 reports

- URL: https://history.state.gov/historicaldocuments/frus1904/d395
- Source date: {"raw":"1904-02-09","precision":"day","calendar":"edition date; original calendar unverified","normalized_day":"1904-02-09","time_standard":{"status":"unknown","reason":"no clock time or offset in inspected text"}}
- Access date: 2026-09-14
- Locator: {"document_number":"395","page":{"status":"unknown","reason":"HTML page marker not inspected for this record"}}
- Manifestation: telegram paraphrase
- Inspection: edition_text_inspected
- Document ID案: `a4046668-2a14-5190-aa6b-c43f25bfbb34`

### c395-captured

- Stored paraphrase: subject=variag; predicate=reported_fate; object=captured
- Attribution: claimant="jp-fm"; report_chain=["jp-fm","griscom","hay"]
- Content内time: {"raw":"to-day, February 9","precision":"day","calendar":"edition date; original calendar unverified","normalized_day":"1904-02-09","time_standard":{"status":"unknown","reason":"no clock time or offset in inspected text"}}
- Caveat: foreign minister informs Griscom; upstream naval telegram not inspected; source assertion; not promoted to historical reality
- Provenance locator: `round1.dataset.json#claims/c395-captured`
- Selected input SHA-256: `fe6d0c34dcf8028664c7108c6dd51428a2e123f91e37f9a73d4f37543be21ab2`
- Observation ID案: `fa61cb21-cf36-5709-ac79-323d59c44e68`
- Evidence ID案: `58dd0021-9b1d-5571-aab6-db50cc811a18`

Content審査案（新規historical extractionではない）:

Recorded researcher-authored paraphrase: Variag — reported as captured in the report attributed to the Japanese foreign minister and relayed by Griscom to Hay; upstream naval telegram not inspected.

### c395-sunk

- Stored paraphrase: subject=korietz; predicate=reported_fate; object=sunk
- Attribution: claimant="jp-fm"; report_chain=["jp-fm","griscom","hay"]
- Content内time: {"raw":"to-day, February 9","precision":"day","calendar":"edition date; original calendar unverified","normalized_day":"1904-02-09","time_standard":{"status":"unknown","reason":"no clock time or offset in inspected text"}}
- Caveat: same telegram as captured claim; separate proposition; source assertion; not promoted to historical reality
- Provenance locator: `round1.dataset.json#claims/c395-sunk`
- Selected input SHA-256: `37cd0daec71a7e2f9da6542c9089bb8af94f6743e0fe10ab9321f3e6e45fddf2`
- Observation ID案: `ea4bfcb3-b0cf-5d95-a6ee-0bb9eaa7a5c6`
- Evidence ID案: `462c0cfd-4b72-52d5-aecd-61030d0f474c`

Content審査案（新規historical extractionではない）:

Recorded researcher-authored paraphrase: Korietz — reported as sunk in the same telegram report attributed to the Japanese foreign minister and relayed by Griscom to Hay.

### c395-first-fire

- Stored paraphrase: subject=korietz; predicate=alleged_initiator; object=opened fire on Japanese torpedo boats
- Attribution: claimant="jp-fm"; report_chain=["jp-fm","griscom","hay"]
- Content内time: {"raw":"telegram announces engagement","precision":"unknown","calendar":"edition date; original calendar unverified","normalized_day":{"status":"unknown","reason":"not established by inspected edition"},"time_standard":{"status":"unknown","reason":"no clock time or offset in inspected text"}}
- Caveat: edition explicitly says upstream telegram alleges; its author and event timing unverified; source assertion; not promoted to historical reality
- Provenance locator: `round1.dataset.json#claims/c395-first-fire`
- Selected input SHA-256: `8c02d18d1a3c4c79dd0557aa8e68dabc7e73fc7a392738358f6daab1558f327d`
- Observation ID案: `f22f9834-5686-53e1-a4a5-a5ba914b6134`
- Evidence ID案: `cfe6ae8f-5cd6-5954-a14a-29a950627db5`

Content審査案（新規historical extractionではない）:

Recorded researcher-authored paraphrase: Korietz — alleged to have opened fire on Japanese torpedo boats; the edition describes an upstream telegram allegation, with its author and event timing unverified.

## frus:1904:678 — 2 reports

- URL: https://history.state.gov/historicaldocuments/frus1904/d678
- Source date: {"raw":"1904-02-07","precision":"day","calendar":"edition date; original calendar unverified","normalized_day":"1904-02-07","time_standard":{"status":"unknown","reason":"no clock time or offset in inspected text"}}
- Access date: 2026-09-14
- Locator: {"document_number":"678","page":{"status":"unknown","reason":"HTML page marker not inspected for this record"}}
- Manifestation: telegram paraphrase
- Inspection: edition_text_inspected
- Document ID案: `22e46a9a-c570-512a-ab6e-6e4ed43b7cce`

### c678-uncertainty

- Stored paraphrase: subject=jp-minister-ru; predicate=reported_knowledge_state; object=no positive knowledge of Russian reply
- Attribution: claimant="jp-minister-ru"; report_chain=["jp-minister-ru","mccormick","hay"]
- Content内time: {"raw":"as reported February 7","precision":"day","calendar":"edition date; original calendar unverified","normalized_day":"1904-02-07","time_standard":{"status":"unknown","reason":"no clock time or offset in inspected text"}}
- Caveat: no positive knowledge is not complete ignorance; time of conversation unknown; source assertion; not promoted to historical reality
- Provenance locator: `round1.dataset.json#claims/c678-uncertainty`
- Selected input SHA-256: `e9fe1509f763b67aadcf655d456ee4ef19fcbb231968dbb45b54cd89fc888d5a`
- Observation ID案: `aea84378-fce1-59f0-ad4c-a0efbc9bb155`
- Evidence ID案: `5fd5ac26-f2c2-52b3-aeca-27fa8b974299`

Content審査案（新規historical extractionではない）:

Recorded researcher-authored paraphrase: Japanese minister at St. Petersburg — reported as having no positive knowledge of the Russian reply, in the account relayed by McCormick to Hay; this does not mean complete ignorance.

### c678-sent

- Stored paraphrase: subject=ru-government; predicate=reported_reply_status; object=reply sent to Admiral Alexieff, with modification authority
- Attribution: claimant="ru-fm"; report_chain=["ru-fm","jp-minister-ru","mccormick","hay"]
- Content内time: {"raw":"before February 7 report","precision":"unknown","calendar":"edition date; original calendar unverified","normalized_day":{"status":"unknown","reason":"not established by inspected edition"},"time_standard":{"status":"unknown","reason":"no clock time or offset in inspected text"}}
- Caveat: nested reported speech; proposed conditions described as foreign minister own view; source assertion; not promoted to historical reality
- Provenance locator: `round1.dataset.json#claims/c678-sent`
- Selected input SHA-256: `562c641e60a67649b01442494a7f536e4c254b591eb7ae4ca0bd8d86720099ac`
- Observation ID案: `8e93e555-ddfd-5f9f-a1e8-484044b80b03`
- Evidence ID案: `5f3d46a4-d52b-5019-a09d-270497de2009`

Content審査案（新規historical extractionではない）:

Recorded researcher-authored paraphrase: Russian reply — reported through the Russian foreign minister, Japanese minister at St. Petersburg, McCormick and Hay as sent to Admiral Alexieff with modification authority; proposed conditions were described as the foreign minister’s own view.

## frus:1904:679 — 1 reports

- URL: https://history.state.gov/historicaldocuments/frus1904/d679
- Source date: {"raw":"1904-02-08","precision":"day","calendar":"edition date; original calendar unverified","normalized_day":"1904-02-08","time_standard":{"status":"unknown","reason":"no clock time or offset in inspected text"}}
- Access date: 2026-09-14
- Locator: {"document_number":"679","page":{"status":"unknown","reason":"HTML page marker not inspected for this record"}}
- Manifestation: telegram paraphrase
- Inspection: edition_text_inspected
- Document ID案: `bd50ef41-9888-5541-a7e2-8df8095093e6`

### c679-held

- Stored paraphrase: subject=ru-minister-jp; predicate=reportedly_possessed; object=Russian reply when Japanese minister requested passports
- Attribution: claimant="ru-fm"; report_chain=["ru-fm","mccormick","hay"]
- Content内time: {"raw":"when passports requested","precision":"unknown","calendar":"edition date; original calendar unverified","normalized_day":{"status":"unknown","reason":"not established by inspected edition"},"time_standard":{"status":"unknown","reason":"no clock time or offset in inspected text"}}
- Caveat: possession by Russian minister is not receipt by Japanese government; source assertion; not promoted to historical reality
- Provenance locator: `round1.dataset.json#claims/c679-held`
- Selected input SHA-256: `81aba6037049bcaef92b43209c46ff205b7bcd0452476679a4f83708c309ca81`
- Observation ID案: `55d67c8e-d628-5b6b-a8a7-fd0b949a2702`
- Evidence ID案: `c23046f4-c34b-5b0c-a6be-c73203bad2a5`

Content審査案（新規historical extractionではない）:

Recorded researcher-authored paraphrase: Russian minister at Tokyo — reportedly possessed the Russian reply when the Japanese minister requested passports, according to the Russian foreign minister’s account relayed by McCormick to Hay; possession does not establish receipt by the Japanese government.

## frus:1904:680 — 1 reports

- URL: https://history.state.gov/historicaldocuments/frus1904/d680
- Source date: {"raw":"1904-02-10","precision":"day","calendar":"edition date; original calendar unverified","normalized_day":"1904-02-10","time_standard":{"status":"unknown","reason":"no clock time or offset in inspected text"}}
- Access date: 2026-09-14
- Locator: {"document_number":"680","page":{"status":"unknown","reason":"HTML page marker not inspected for this record"}}
- Manifestation: translation of February 9 telegram deposited by Russian ambassador
- Inspection: edition_text_inspected
- Document ID案: `9f59765a-ede0-5ac8-a316-84d6119cc873`

### c680-attack

- Stored paraphrase: subject=ru-navy; predicate=reported_attacked_at_anchor; object=Japanese torpedo boats attacked Russian squadron
- Attribution: claimant="ru-fm"; report_chain=["ru-fm","us-state"]
- Content内time: {"raw":"night 27th January [9th February]","precision":"day","calendar":"edition dual date; no exact instant","normalized_day":"1904-02-09","time_standard":{"status":"unknown","reason":"no clock time or offset in inspected text"}}
- Caveat: translated February 9 telegram deposited February 10; source assertion; not promoted to historical reality
- Provenance locator: `round1.dataset.json#claims/c680-attack`
- Selected input SHA-256: `a62e5d6964d89e49f3af20d7bcab2c043b6f49fca5ca95aa160ca288cd4b9854`
- Observation ID案: `e61acb30-be81-5b85-ab33-98f9cb141b43`
- Evidence ID案: `574ceb71-a21f-59f4-abf3-43602f375d7c`

Content審査案（新規historical extractionではない）:

Recorded researcher-authored paraphrase: The translated Russian diplomatic telegram reports that Japanese torpedo boats attacked the Russian squadron at anchor; its wording gives “night 27th January [9th February]”. The stored report describes a February 9 telegram deposited February 10; no exact event instant is established.

## frus:1904:86 — 1 reports

- URL: https://history.state.gov/historicaldocuments/frus1904/d86
- Source date: {"raw":"1904-02-10","precision":"day","calendar":"edition date; original calendar unverified","normalized_day":"1904-02-10","time_standard":{"status":"unknown","reason":"no clock time or offset in inspected text"}}
- Access date: 2026-09-14
- Locator: {"document_number":"86","page":{"status":"unknown","reason":"HTML page marker not inspected for this record"}}
- Manifestation: telegram paraphrase
- Inspection: edition_text_inspected
- Document ID案: `0c60e1dc-c8ce-5a88-a112-ffb8410231fe`

### c86-request

- Stored paraphrase: subject=hay; predicate=instructs; object=Conger to convey US desire for Chinese neutrality and administrative entity to be respected
- Attribution: claimant="hay"; report_chain=["hay","conger"]
- Content内time: {"raw":"February 10","precision":"day","calendar":"edition date; original calendar unverified","normalized_day":"1904-02-10","time_standard":{"status":"unknown","reason":"no clock time or offset in inspected text"}}
- Caveat: policy desire is not evidence that neutrality was respected; source assertion; not promoted to historical reality
- Provenance locator: `round1.dataset.json#claims/c86-request`
- Selected input SHA-256: `43b917d9e171e08d53e2291da6bbca9ae2e079ff7f6339a3c04ceb17225b308f`
- Observation ID案: `3253dd31-256c-543c-a1f5-2566cbc17132`
- Evidence ID案: `302b3779-6975-56e4-aba0-0f2b16a078c8`

Content審査案（新規historical extractionではない）:

Recorded researcher-authored paraphrase: Hay — instructs Conger to convey the US desire for Chinese neutrality and administrative entity to be respected; the instruction does not establish that neutrality was respected.

## frus:1904:430 — 3 reports

- URL: https://history.state.gov/historicaldocuments/frus1904/d430
- Source date: {"raw":"1904-02-26","precision":"day","calendar":"edition date; original calendar unverified","normalized_day":"1904-02-26","time_standard":{"status":"unknown","reason":"no clock time or offset in inspected text"}}
- Access date: 2026-09-14
- Locator: {"document_number":"430","page":{"status":"unknown","reason":"HTML page marker not inspected for this record"}}
- Manifestation: telegram received February 25, deposited February 26; protocol reproduced in English
- Inspection: edition_text_inspected
- Document ID案: `705575ca-1a28-5494-ac1f-f723157fcafb`

### c430-consent

- Stored paraphrase: subject=jp-government; predicate=asserts; object=use of Korean ports and territory has full Korean knowledge and consent
- Attribution: claimant="jp-government"; report_chain=["jp-government","hay"]
- Content内time: {"raw":"communication deposited February 26","precision":"day","calendar":"edition date; original calendar unverified","normalized_day":"1904-02-26","time_standard":{"status":"unknown","reason":"no clock time or offset in inspected text"}}
- Caveat: preamble representation; not proof of uncoerced Korean consent; source assertion; not promoted to historical reality
- Provenance locator: `round1.dataset.json#claims/c430-consent`
- Selected input SHA-256: `e764b772c1c7e2be04810a9d412d1723d3c2a7c1d09d0e704fd4c0104e40a978`
- Observation ID案: `c37d7744-06ed-5495-af67-8a783904346e`
- Evidence ID案: `180437f2-77d0-521d-ab99-1561f5268db2`

Content審査案（新規historical extractionではない）:

Recorded researcher-authored paraphrase: Imperial Japanese Government — asserts that use of Korean ports and territory has full Korean knowledge and consent; this representation does not establish uncoerced Korean consent.

### c430-guarantee

- Stored paraphrase: subject=jp-government; predicate=protocol_text_guarantees; object=independence and territorial integrity of Korean Empire
- Attribution: claimant="jp-government"; report_chain=["jp-government","hay"]
- Content内time: {"raw":"protocol dated February 23","precision":"day","calendar":"edition date; original calendar unverified","normalized_day":"1904-02-23","time_standard":{"status":"unknown","reason":"no clock time or offset in inspected text"}}
- Caveat: Article III; legal text does not establish actual sovereignty or control; source assertion; not promoted to historical reality
- Provenance locator: `round1.dataset.json#claims/c430-guarantee`
- Selected input SHA-256: `556f7c0c38061e188bf93cefa20f9c42624fee94e143cf2379c8f488668a17e5`
- Observation ID案: `ccd06bdb-d3bf-5c6d-af35-6e85bc0a336c`
- Evidence ID案: `d4e0cea6-6644-5ce3-a8d6-04c21d0331a9`

Content審査案（新規historical extractionではない）:

Recorded researcher-authored paraphrase: Article III of the reproduced protocol text — guarantees independence and territorial integrity of the Korean Empire; the text does not establish actual sovereignty or control.

### c430-occupation

- Stored paraphrase: subject=jp-government; predicate=protocol_text_allows_conditionally; object=occupation of strategically necessary places for stated object
- Attribution: claimant="jp-government"; report_chain=["jp-government","hay"]
- Content内time: {"raw":"protocol dated February 23","precision":"day","calendar":"edition date; original calendar unverified","normalized_day":"1904-02-23","time_standard":{"status":"unknown","reason":"no clock time or offset in inspected text"}}
- Caveat: Article IV; conditional permission distinct from actual occupation; source assertion; not promoted to historical reality
- Provenance locator: `round1.dataset.json#claims/c430-occupation`
- Selected input SHA-256: `9d6d70f4f525190b0bc2f0dcbfc94e3df4c8d46e55fda6e6529b858b04802ca9`
- Observation ID案: `1184725c-02be-5106-aeb3-d7d2450f0fec`
- Evidence ID案: `05767896-15ce-50fb-a346-1f5fb7830010`

Content審査案（新規historical extractionではない）:

Recorded researcher-authored paraphrase: Article IV of the reproduced protocol text — conditionally allows occupation of strategically necessary places for the stated object; conditional permission does not establish actual occupation.

## frus:1904:815 — 1 reports

- URL: https://history.state.gov/historicaldocuments/frus1904/d815
- Source date: {"raw":"1904-10-28","precision":"day","calendar":"edition date; original calendar unverified","normalized_day":"1904-10-28","time_standard":{"status":"unknown","reason":"no clock time or offset in inspected text"}}
- Access date: 2026-09-14
- Locator: {"document_number":"815","page":{"status":"unknown","reason":"HTML page marker not inspected for this record"}}
- Manifestation: telegram paraphrase
- Inspection: edition_text_inspected
- Document ID案: `aedfbb8b-0407-59cd-a131-5ce2cf319a1d`

### c815-inquiry

- Stored paraphrase: subject=british-embassy; predicate=reportedly_demands; object=impartial inquiry at Vigo, with bilateral representatives and neutral umpire; offers Hull inquiry
- Attribution: claimant="eddy"; report_chain=["eddy","hay"]
- Content内time: {"raw":"October 28 report","precision":"day","calendar":"edition date; original calendar unverified","normalized_day":"1904-10-28","time_standard":{"status":"unknown","reason":"no clock time or offset in inspected text"}}
- Caveat: demand after rejection of Russian admiral statement; does not prove commission findings; source assertion; not promoted to historical reality
- Provenance locator: `round1.dataset.json#claims/c815-inquiry`
- Selected input SHA-256: `f94ddafb33c99acb957789ba1cae4baab54ce4d5883e19282cf6834caeb6531f`
- Observation ID案: `0dcc23bb-eaae-572a-aa70-2c3e61a0149b`
- Evidence ID案: `291aef16-7eaa-53ea-a744-366001b9707c`

Content審査案（新規historical extractionではない）:

Recorded researcher-authored paraphrase: British embassy — reportedly demands an impartial inquiry at Vigo with bilateral representatives and a neutral umpire, and offers a Hull inquiry, in Eddy’s report to Hay; this does not establish commission findings.

## 共通temporal / provenance境界

全候補のaccess dateは2026-09-14（日精度）。exact inspection instantなし→observed_at null。source.creationとcontent内dateは上記の入力文脈で保持し、occurred_at等へ昇格しない。recorded_atは将来writerの明示binding、現段階UNBOUND。created_at/updated_atは既存composition/applyPatch contract。日付へmidnight/offsetを補わない。

Observationと各Evidenceのprovenanceは既存kind=document、external_id=上記dataset locator、label=Stored Historical Round1 inspection report; researcher-authored paraphrase。researcher identityは不明のまま。URLはDocument identity attr、report provenanceと混同しない。source date/access date/report chain等の完全な文脈はpinned inputへ保持し、新canonical fieldを追加しない。

## duplicate / identity

未publish7 source IDs/URLsは一意。12 report IDsは一意。31 candidate IDsは相互重複・live全collection ID衝突なし、既存4のsource ID/URL重複なし。393/394/396の既存Document IDを同じ式で再現確認。392は旧frus-392-stored-inspection-v1 namespaceによる既存IDを保持し、generic namespaceで再生成しない。近い主題・同じ外交交渉・似た日付をmerge理由にしない。

ID案: SHA-256(project ID + NUL + historical-stored-inspection-v1 + colon + key)を既存ids関数と同じUUID-shaped形式へ変換。Document key=document:{source ID}、Observation key=inspection-result:{source ID}:{report ID}、Evidence key=inspection-evidence:{source ID}:{report ID}。標準UUIDv5生成という主張ではない。変更した文面を同一IDで無条件上書きせず、package freeze/receipt照合で差分はHOLD。

## multiple-report / next package boundary

395=1 Document/3 Observations/3 Evidence、678=1/2/2、430=1/3/3。各Observationのsubject_idsは同じDocument IDのみ。Evidenceは各Observationへ独立observation_ref。reportごとのDocument複製、report圧縮、actor knowledge projectionは禁止。

既存composeInspectionはreportごとにDocument upsertも返す。単純flatMapは同じDocument操作を重複させる。次packageではsourceごとにDocument操作1回、reportごとにObservation/Evidence操作1回とし、同一source metadataの一致を検証する設計が必要。旧batchのpreflightはobs.length===1、ev.length===1、all.length===3等を要求し、別Observationから共有Documentへの参照もoutside-packageと判定する。旧packageのrows追加では対応不可。旧frozen packageは変更せず、新batch単位のexpected membership/receipt/partial detectionへ対応する。core/schema/UI改変は不要。

## publish単位とgate

推奨は7 Documents/12 reportsをDocument別7 review groupsに分けて審査し、全12 content承認後にall-or-nothing一回publish。31新recordは有限でレビュー可能。atomicであること自体をbatch拡大理由にしない。unbound recording時刻、expected before fingerprint、既存record不変、31 IDs/record hashes、observed_at null、独立再read、partial/different時HOLD、owner release、backup/receiptを次gateで検証する。自動rollbackなし。

審査負荷が高い場合の分割案: 単report 86/679/680/815（4/4/4）、複数report 395/678/430（3/8/8）。先行分だけでは合計8 Documentsだが、件数目標より意味・審査を優先。分割時はそれぞれ新しいbefore fingerprintと個別承認が必要。

## 除外と残る範囲

未publish FRUSのsemantic除外0。ただし上記修飾を消す文面は不採用。392/393/394/396は既publishのため除外。Round1非FRUSのNIKH translation、JACAR later guide、LOC catalogは本batchの範囲外。既存FRUSだけで最終11 Documentsに達し、multiple-report・nested attribution・allegation・conditional protocol・複数content datesという自然なshape差があるため、Round4/JACAR追加調査・特殊projectionは不要。

UI publish後監査: 11件listからの識別と往復、395/678/430の全ObservationとEvidence対応、sticky context、raw展開、0 Claim/Event/Stateのscope表示、fingerprint一致。Search必要性はその実測で判断し、今は追加しない。

LIVE-005Bのpackage設計・実装へ進める材料は成立。ただし本調査はpackage validation/publish permissionではない。複数report対応preflight・exact content/input freeze・receipt/test gateは未実装でpublishにはblocking。外部調査を要求する新semantic blockerは見つからなかった。LIVE-005Bへ自動進行しない。
