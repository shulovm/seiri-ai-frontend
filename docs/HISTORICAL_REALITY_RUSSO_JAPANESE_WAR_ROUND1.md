# Historical Reality — 日露戦争 Round 1

実施日: 2026-09-14。状態: experimental calibration。歴史全体の再構成や最終ontologyではない。

## 結果

GROUNDはすでに **Entity / Event / State と Claim / Evidence を分離**し、支持・反証を同時に保持できる。今回不足が確認されたのは、資料の版と伝達経路、actor別の認識、歴史時刻の粒度・暦・役割、研究上の不明理由、根拠付きReconstructionである。

現在のGROUNDへ実資料を通すと、Sourceの記載を保存する経路は成立する。しかし、それだけでは当時のKnowledgeやHistorical Realityの再構成を意味を保ったまま再生できない。そこでcanonical schemaを変更せず、隔離したsidecarを追加した。

保存したもの:

- 14 Source samples: FRUS公刊版の外交文書11件、NIKH翻訳資料1件、JACAR資料解説1件、LOC写真catalog1件。
- 18 attributed Claims、20 Evidence relations、23 actor/identity scopes、5 actor epistemic records。
- 根拠経路を持つReconstruction 4件、外交的Interpretation 2件、資料範囲を限定したNarrative 1件。
- Archive/Collection landscape 15項目、Source class 8群、Semantic Gap Signals 12件、Micro Stress Test候補4案。

**14件を14件の一次原本と数えてはいけない。** 外交文書は一次通信を公刊・編集した版を確認した。軍事原画像、ロシア語原本、写真そのものは未確認。catalog、guide、翻訳、公刊パラフレーズを明示的に区別している。

## 1. 実際に確認したEvidence / Representative Source Samples

### 外交的instruction、意図、報告

[FRUS 1904 d392](https://history.state.gov/historicaldocuments/frus1904/d392) は、東京のGriscomによる2月6日付電報の公刊パラフレーズ。日本外相から、日本公使への指示を伝えられたとの記載を確認した。指示、原noteの提示、外交関係断絶の履行は別のClaimでなければならない。

[d393](https://history.state.gov/historicaldocuments/frus1904/d393) は、Washingtonで国務長官へ渡されたmemorandum中のnote copy。日本政府の交渉終了と独自行動の留保を保存し、そのself-defenseという外交的説明をInterpretationへ分離した。copyの日付からロシア側への原note到達時刻を作らない。

[d394](https://history.state.gov/historicaldocuments/frus1904/d394) は2月7日付の将来の出発予定を報じる文書。[d396](https://history.state.gov/historicaldocuments/frus1904/d396) は2月11日付で前日の宣戦布告発出を報じる文書。予定、発生、報告時刻を区別する試料となる。出発予定の実現をこの資料だけから確定しない。

### 報告の伝達と competing descriptions

[d395](https://history.state.gov/historicaldocuments/frus1904/d395) は2月9日付、GriscomからHayへの電報パラフレーズ。日本外相が伝えた仁川付近の戦闘に関して、Variagの捕獲、Korietzの沈没、先制発砲のallegationという別々のClaimへ分解した。Griscom本人による海戦観測ではなく、上流の軍事電報も未確認である。

[JACAR仁川沖海戦の資料解説](https://www.jacar.go.jp/exhibition/nichiro2/sensoushi/kaijou_02_outline.html) は、別の艦の処遇記述へ到達する導線を提供する。レファレンスコードと画像locatorを保存したが、原画像はweb toolで開けなかった。したがってこの比較を独立した軍事原本による反証と扱わない。捕獲の語義・時点、後の取得との関係は `r-variag: unresolved` とした。

同guideの画像33の説明には2月8日という表記がある。一方d395は2月9日の当日報告である。この日付差も保持し、guideの誤記・別行動・時刻系のいずれかと決め打ちしない。

### 「伝えられた」と「確実に知っていた」の境界

[d678](https://history.state.gov/historicaldocuments/frus1904/d678) は2月7日付McCormick報告。日本公使がロシア回答について確実なKnowledgeを持っていなかったという記載と、回答送付について伝えられたという記載を分けた。さらに回答条件は外相自身の見解として伝えられている。条件案、正式回答、回答版の同一性は未確定。

[d679](https://history.state.gov/historicaldocuments/frus1904/d679) は2月8日付、ロシア外相からMcCormickへ伝えられた回答所持に関する報告。日本公使の不確実性と、東京のロシア公使の所持は異なる主体についての記載であり、直接矛盾とはしない。発送、所持、日本側受信、回答本文のKnowledgeは別の状態である。

### 暦、translation、creation/deposition

[d680](https://history.state.gov/historicaldocuments/frus1904/d680) は2月10日にWashingtonで残された、2月9日付Lamsdorff電報の英訳。旅順襲撃のdual dateを確認した。元電報日、翻訳・提出、攻撃の夜、GROUNDへの保存日を別にした。括弧の暦対応は版の記載に基づく正規化候補で、正確なUTC時刻ではない。

### 多国間Reality / territory / infrastructure

[d86](https://history.state.gov/historicaldocuments/frus1904/d86) はHayからCongerへの2月10日付instruction。清についての中立・行政的一体性を尊重するよう求める意向を保持した。米政府の要請から清の意思決定、主権、現地の軍事controlを再構成してはいけない。直接の清側資料は取得できていない。

[d430](https://history.state.gov/historicaldocuments/frus1904/d430) は2月26日付提出文書。2月23日のprotocol、2月25日の日本公使による電報受信、2月26日の提出という日付の違いを確認した。韓国の同意についての日本政府の説明、独立・領土保全の条文、条件付きの戦略地点占領条文を分けた。条文が存在することと、同意の自由性・条約の法的評価・実際のcontrolは別である。

[NIKH jh_024r_0050_0050](https://db.history.go.kr/joseon/level.do?levelId=jh_024r_0050_0050) は2月12日付、林權助から大皇帝陛下宛の電信線使用許可の要請。translated transcription、発信者、宛先、上奏文というdesignationを確認した。request、実際の受信、許可、線路使用、民間通信への実際の影響を混ぜない。応答資料と原画像は未取得。

[d815](https://history.state.gov/historicaldocuments/frus1904/d815) は10月28日付、Eddyによる英国側の調査要求についての報告。英国、ロシア、米国と第三国・民間主体を含む次のwindowへの導線となる。調査要求を調査結果へ昇格させない。

### Material sourceの保持限界

[LOC 2005680338](https://www.loc.gov/item/2005680338/) の写真catalogでは年単位のdateと複数のデジタルmanifestationsへの案内を確認した。写真自体は視認していないので、catalogによる人物同定を自分の画像観測と表現していない。撮影日・original print・copy negative・digitization・catalog更新を分ける必要がある。

## 2. Source / Archive / Collection Landscape

機械可読な全項目は [round1.landscape.json](../ground-core/experimental/historical-reality/round1.landscape.json)。各項目にverification level、access、次の取得対象を記載した。

確認レベルは `edition/translation text inspected`、`guide/catalog inspected`、`indexed official finding-aid lead`、`unresolved` を混ぜない。

- 日本: JACAR経由の公文書・外交資料・NIDS軍事資料。軍事詳報が後の秘扱い編纂物に埋め込まれている構造が重要。
- ロシア: РГАВМФのfond 763という日記・note・新聞切抜きcollectionの公式portal leadを発見。opis/delo/folio、原文、公開条件は未確認。FRUSのロシア発外交通信はロシア語原本の代用にしない。
- 大韓帝国: NIKHの日本公使館記録翻訳を取得。現在のarchive hostが韓国であることと、記録作成主体が韓国政府であることを区別する。
- 清: FRUS China sectionへの導線を確認したが、清自身が作成したitem-level資料を確保できていない。米国経由の記述だけで清のRealityを埋めない。
- 英国: British Library [Add MS 88906/22/15](https://searcharchives.bl.uk/catalog/040-002403829) の1903–1904年のfolder descriptionを確認。印刷資料・correspondence・memorandum draftsが同居する。TNA WO 106は公式catalog leadまでで、該当itemの番号は未確定。
- 米国: FRUS、NARA Guide to Federal Records、LOCの写真・新聞・memoir lead。FRUS収録数はEvidenceの独立性を証明しない。
- フランス: SHDの [Guerre russo-japonaise notice](https://www.servicehistorique.sga.defense.gouv.fr/ark/1134995)、外交archiveのTokyo 697PO/A、London 378PO/Kのinventory lead。原record textは未取得。
- ドイツ: institutional catalogでBArch PH 3/1472の戦域地図を発見。図像は未確認で、地図に描かれた領域をそのまま主権領域へ写像しない。

実物から発見したSource classは8群: contemporary diplomatic communication、treaty/formal position、administrative request/infrastructure、military record inside later compilation、personal manuscript/memoir、press/visual/material、quantitative/geographic、later guide/edition/research。

financial/bond、logistics、casualty definitions、railway capacity、meteorology、physical remainsは今回の検証済みdatasetにない。Source universeの不存在を意味しない。未収集分として保存している。

## 3. Historical Actor / Identity Problem Map

23件のactor scopeはdatasetの `actors` に保存した。国家・政府・省・外交官・役職・艦・住民範囲を区別する。

- Russian Empire、Imperial Russian Government、Russian Navy、旅順艦隊、東京のロシア公使を統合しない。
- 日本政府、外相、日本公使、Griscom、Hayを分ける。公使への指示や外交官の報告は「日本が知った」「米国が知った」ではない。
- 大韓帝国政府、皇帝という宛先、林權助という発信者を分ける。韓国側の受信・応答はunknown。
- Variag/ワリヤーグは船体identity候補である。後代の宗谷というlabelや軍籍への移行は、その導線だけを保持し、有効時期や完全な同一性を確定していない。
- 役職名でしか示されないactorは、実名を記憶で埋めない。datasetのscopeは1904年のsample範囲で、役職任期や主体のlifetimeではない。
- local civiliansはpopulation scopeとして保持する。具体的住民の認識や代表性を仮定しない。

## 4. Temporal Problem Map

観測された時間差: protocol 2/23 → 日本公使受信2/25 → Washington提出2/26、underlying Russian telegram 2/9 → deposit 2/10、宣戦布告のreported event 2/10 → report 2/11。1905年のFRUS出版と2026年の自分たちのinspectionも別である。

現GROUNDの `recorded_at` は保存時刻で、historical source creationや当時の受信時刻に使えない。`occurred_at` はontic occurrenceなので、外交報告で述べられた日付を無条件に入れない。

今回のtime recordは原表記、precision、calendarの根拠/不明、normalized day候補、time standard不明を残す。正確なclock timeのないdayを00:00Zへ変換していない。`actorEvidenceAt` の引数はGregorian dayで、同日内順序は不明として分離する。

## 5. Knowledge-at-time Problem Map

実例 `c678-uncertainty` と `c678-sent` が、同一主体について「確実な回答Knowledgeなし」と「回答送付を伝えられた」を共存させる。どちらも完全な無知や、正式回答本文のKnowledgeではない。

実験語彙は観測された `was_told` と `explicit_no_positive_knowledge` に限定した。`knew/believed/misunderstood` を資料なしで生成しない。

会話の正確な日付をsource dateから補完しない。そのため2月7日に日本公使を照会すると、時点を確定したKnowledgeではなく、2件の `unplaced` documentary recordsが返る。これは未完成な再構成を正しく見せる挙動である。

source存在、宛先、伝達、実受信、読了、受容、belief、public accessは別。d430に明記された日本公使受信の日付以外を、宛先だけから受信として入力していない。

## 6. Claim / Evidence Problem Map

一つのd395を捕獲、沈没、alleged first-fireの3 Claimへ分解した。一次通信の公刊パラフレーズであるというextraction contextを各Claimに残す。

Evidence relationにはscopeが必要となった。`attests_recorded_assertion` は「確認したtextがこの記載を含む」を支える。外界の出来事がそうだったことを支える独立証言と同じではない。

2件の `qualifies` を保存した。日本公使の不確実性と他国公使の回答所持は主体が異なる。捕獲と後代guideの異なる処遇説明は、語義・時点が不明なままbinary contradictionにしない。

このdatasetには独立に検証した歴史的直接反証pairはない。existing regression testsで支持・反証の同時保持は確認したが、それを今回の実資料による歴史的反証取得と報告しない。

## 7. Provenance Problem Map

Source identityは `frus:1904:395`、`nikh:jh_024r_0050_0050`、LOC control numberなど、URLと別に保持した。archive hostと原本保管機関の同一性も仮定しない。

FRUSの[巻扉metadata](https://history.state.gov/historicaldocuments/frus1904)でGPO、Washington、1905年の出版を確認した。原電報のcustody、編集者、パラフレーズの工程・作成時刻、個々の原語、原本完全性はunknownである。

保存物は短いsource excerptと自分たちのparaphraseであり、原文全文snapshotでも画像の取得済みcopyでもない。引用箇所のdocument番号とURL、取得日、inspection levelを保持する。頁未確認は明示的unknown。変更検知用hashは自分たちの保存物の整合性を確認し、資料の歴史的authenticityは証明しない。

複数editionが同じ原通信から派生している可能性を保持する。shared upstreamの有無を確定していないので、独立corroborationの件数や信頼度fusionを計算しない。

## 8. Reconstruction Problem Map

- `r-reply: unresolved`: 発送・所持・受信・回答版の関係。伝聞はあるが原dispatch/receipt logがない。
- `r-variag: unresolved`: 処遇の語義、順序、day差。現時点で片方の記載を削除しない。
- `r-protocol-text: strongly_established`: **確認した英語再録text上**での条文の並置。実際の韓国のcontrol、同意、法的評価を確定するstatusではない。
- `r-portarthur: possible`: このfixtureでは翻訳外交通信1件に基づくexternal-event候補。歴史全体における襲撃の確実性評価を意味しない。

statusにはscopeとreasonを必ず付ける。単一のconfidence値やsource件数からReconstructionを作らない。`traceReconstruction` はassessment → relations / claims → source identity / locator / inspected excerptを戻す。

`unknown` は不明の理由を持つ。今回「no surviving evidence」は一度も判定していない。資料未検索、web上でアクセス失敗、original未照合、sourceのsilence、出来事の不存在は別である。Silenceを反証relationにしていない。

## 9. Interpretation / Narrative Separation

現代各国historiographyを代表させるだけの資料は今回取得していない。Japanese/Russian/Korean/Chinese/Western/Sovietのlabelを先行作成して中身を推測しない。

代わりに実際に読んだ外交的framingを2件保持した。交渉終了をself-defenseの語で説明するものと、韓国領域使用をconsentとintegrityに結び付けるもの。これらは当時のissuerのpositionであり、客観的必要性や自由な同意の確定ではない。

`n-jp-diplomatic` はこの2件に限定したNarrative record。Narrative → Interpretation → Claim → Sourceを辿れる。後世のhistoriography comparisonは次Round以降の取得課題として残す。

## 10. Current GROUND Mapping

確認範囲: `ground-core/types.ts`、最新ProjectState/StatePatch v0.1.24 schemaとvalidator、state-engine、file-store、epistemic.ts、belief.ts、epistemic-gap-types.ts、worldline-types.ts/worldline.ts、governance型、agency型と関連regression tests。

### そのまま利用可能

- `RealityEntity`: document、actor identityの保持。mutable territorial controlをidentity attrsへ混ぜない。
- `Evidence.external_ref` + `provenance.external_id`: inspectable referenceとstable source identity。
- `Claim`: truthではない明示的proposition。今回のcanonical projectionは資料記載を対象にしたClaim。
- `ClaimEvidenceLink`: 実際にscopeが適合するSUPPORTS/CONTRADICTSを共存できる。今回はtext attestationのみSUPPORTSへ写像。
- `applyPatch`、schema validation、file-store、read helpers: 保存・再読込・root sourceへの追跡を実データで確認。

### 意味が近いが不十分 / relation追加の実験対象

- `EpistemicProvenance`:最小origin contractとして有効だが、版・原本・translation・custody・locatorを保持する契約ではない。
- `EpistemicObservation.observed_at`:観測時刻の区別には使えるが、読む側の行為と1904年の元観測を混同しやすい。今回のtext読解を1904年の海戦観測へ変換していない。
- `Claim.applicable_*`: asserted propositionの適用時点であり、actorが知った時点ではない。既存 `isClaimApplicableAt` はnullをunknownではなく無境界として扱うため、不明なhistory期間を両方nullで「常時成立」にしない。
- `ClaimEvidenceRelation`: qualificationをbinary linkへ変換すると意味が落ちる。sidecarのみで追加した。
- `EpistemicGap`:構造的absence/tensionは保持できるが、未検索やarchive不可アクセスなどの研究上の不明理由は別に必要。
- `RealityState` のgeneric kind/value: 立証された歴史的controlなら候補だが、protocolの許可条文からactual controlを作る経路ではない。

### 無理に使うべきではない

- `BeliefAssessment`:queryされたpropositionのderived positionであり、1904年の特定actorのbelief biographyではない。名前だけでKnowledge-at-timeへ再利用しない。
- `RealityWorldline`:canonical ontic Event/Stateだけのread model。Source/Knowledge/Reconstructionをここへ押し込まない。
- legacy project Observation/Decision、`GroundEvent.input_text` の一括保存: 簡易記録はできてもhistorical semanticsの分離契約ではない。
- `AuthorityDeclaration`:GROUNDのreference/objective/impact/interventionについての宣言されたgovernance power。外交文書のAlexieffの回答修正権限や韓国領域占領条文を、そのままこのenumへ変換しない。
- Agency actor candidate / requirement-match: selected historical actorや当時実行された行為を意味しない。actor mapへ代用しない。

### 新しいexperimental保持が必要

version-aware Source record、attributed Claim/report chain、狭いactor epistemic stance、raw historical time、scoped qualification、不明理由付きReconstructionとInterpretation/Narrative routes。

これらはcanonical primitiveへの昇格を提案しない。time/provenance/access/reconstructionの問題は現在・未来にも一般化しうるが、別の実在事例による反復検証が必要である。

## 11. Semantic Gap Signals

各signalの observed case / current representation / lost meaning / severity / recurrence likelihood / proposed direction はlandscape JSONに保存した。severityは開発上の意味損失の深刻度で、歴史的truthの確率ではない。recurrenceは確認済み反復と未立証のriskを区別する。

1. SG-01: claimantとreport chainの欠落。
2. SG-02: source/event/transmission/reception/deposition/publication/ingestion時間の圧縮。
3. SG-03: actor認識とderived BeliefAssessmentの同一視。
4. SG-04: original/copy/paraphrase/translation/editionのprovenance不足。
5. SG-05: qualificationとbinary support/contradictionの境界。
6. SG-06: shared upstreamとindependent corroborationの誤認risk。系譜の実証は未了。
7. SG-07: structural absenceと研究上のunknown reasonsの違い。
8. SG-08: source assertionとsourced reconstructionの間の保持不足。
9. SG-09: historical role/identityとlegal provision/actual controlの境界。
10. SG-10: 暦・night・day差をISO instantへ潰す損失。
11. SG-11: existence/addressee/receipt/access/public availabilityの混同。
12. SG-12: issuer framingとReality、Interpretation/Narrative経路の欠落。

## 12. Historical Reality Experimental Substrate / Implementation policy

追加ファイルは `ground-core/experimental/historical-reality/` と専用test、本文書のみ。既存type、schema、engine、migration、CLI、production storageを変更していない。

実装の根拠と最小変更:

1. 実例: d395、d678–680、d430、NIKH memorial。
2. 現在の表現: Claim + minimal provenance + binary evidence links + ISO applicability。
3. 失われる意味: attribution、manifestation、時間役割、不明理由、qualified reconstruction。
4. signal: 上記SG-01–12。
5. minimal capability: JSON sidecar契約とreferential validation、trace read、actor documentary query、安全なpartial projection。
6. 既存primitive不足: core型の意味を変えずに、report-chainやmultiple historical time rolesの契約を表現できない。任意のvalueに埋めるだけではquery/validationが意味を保証しない。
7. implementation: `substrate.ts` と `replay.ts`。dataset全体はexperimental。観測されたrelation/stanceのみ許可する。
8. tests: dangling reference、日付、不明、unsupported knew promotion、同日順序、source route、read/persist replay、narrative route。
9. replay/provenance: canonical patch apply → file-store save/load → Evidence trace、およびsidecar reconstruction trace。
10. legacy影響: production contract変更なし。既存関連50 testも通過。**sidecarを失ったcanonical projectionだけではhistorical meaningを再生できない**という制限を明示する。

canonical document entityの存在が意味するのは「今inspectableな資料対象として登録した」ことであり、1904年の原本存在時刻を確定するEventではない。source-content Claimのconfidence 0.95は、確認textへのattributionについての未校正の作業上の見積りに限る。歴史propositionやReconstructionのconfidenceではなく、他のsourceとのfusionにも使わない。

## 13. Dataset / Records / Reproducibility

- [round1.dataset.json](../ground-core/experimental/historical-reality/round1.dataset.json): Source、Claim、Evidence relation、Actor、epistemic records、Reconstruction、Interpretation、Narrative、Knowledge-about-past records。
- [round1.landscape.json](../ground-core/experimental/historical-reality/round1.landscape.json): archive、class、semantic gap、候補window、coverage gaps。
- [substrate.ts](../ground-core/experimental/historical-reality/substrate.ts): experimental契約、validation、query、projection。
- [replay.ts](../ground-core/experimental/historical-reality/replay.ts):既存GROUNDへ実際に通す再生入口。
- `replay/`: canonical project JSON、patch、reconstruction traces、validation結果。production storageから隔離。
- `manifest.json`: 保存物のSHA-256。内容整合性用で、Source authenticity用ではない。

再実行:

```sh
node --import tsx ground-core/experimental/historical-reality/replay.ts /private/tmp/ground-rj-round1-replay
node --import tsx --test ground-core/__tests__/historical-reality-round1.test.ts ground-core/__tests__/epistemic-core.test.ts ground-core/__tests__/belief-reconciliation.test.ts ground-core/__tests__/epistemic-gaps.test.ts ground-core/__tests__/reality-worldline.test.ts
node_modules/.bin/tsc -p ground-core/tsconfig.json --pretty false
```

`tsx` CLIはこのsandboxではIPC pipe作成がEPERMとなったため、同じloaderをNodeの `--import tsx` で使った。コード検証はこの経路で成功している。

replayのlogical source/claim IDsとpatchは固定project ID・指定recordedAtで再生可能。createEmptyProject/applyPatchの管理timestampとcurrent_state IDは既存engineが生成するため、projectファイルのbyte一致は保証しない。Source/Claim/traceの内容は保持される。

## 14. Tests / Validation

専用6 testと既存50 test、合計56 test成功。ground-core全体TypeScript check成功。canonical latest-schema patch適用、file-store保存・再読込を実行した。

canonical projection結果: document entities 14、source-content claims 18、Evidence 14、historical Event/State 0。Worldline entriesも0。これらが0なのは、今回は外界の歴史Realityを独立に立証してontic stateへ登録する段階まで進めていないためである。

validationの限界: referential integrityとsemantic separationのチェックであり、原本authenticity、翻訳精度、資料完全性、historical truthの検証ではない。frontendは変更していないのでUI/build確認は対象外。

## 15. Micro Stress Test Candidates / 次Round

比較レコードはlandscape JSONの `micro_stress_test_candidates`。

1. **第一候補: 1904-02-06–02-10**。外交的断絶・回答の伝達と、仁川/旅順の初期報告を、別々のinformation flowを保ったまま二つの連結windowとして扱う。確認済み外交textが最も多く、actual semantic failureも発見済み。原軍事画像・ロシア回答原本・受信証跡が取得課題。難度high、価値highest。
2. **1904-02-23–02-26**。protocol、受信、提出、consent representation、strategic occupationの条件文を検証。大韓帝国側の応答・交渉記録と原text照合が必要。難度medium-high。領域・authorityの意味境界に価値が高い。
3. **1904-10-27–10-29**。North Sea incidentへの外交的対応。英国・ロシア・米国・漁業民間主体、competing official statements、調査要求とfindingの区別。d815とBL folder leadから開始できるが、witness/commission reportは未取得。難度high。実際の誤認の検証は次の取得後に行う。
4. **1905-09-04–09-06**。Portsmouth signing付近の暫定window。外交private Knowledgeと公開text・写真caption・領域移転を分離。今回写真catalogは年単位のみで、FRUS 1905交渉資料を追加取得する必要がある。難度high。現段階で最初に選ぶ利点は低い。

Round 2は第一候補を推奨する。最初の攻撃対象は `r-reply` のdispatch/possession/reception chainと `r-variag` の処遇記述である。原資料の取得を先に進め、時刻・話者・翻訳版を照合する。語彙やschemaはその結果から再評価する。

新しく見えたGROUND上の問題は、**text-level certaintyとworld-level certaintyが同じ「confidence」やstatusで表示されうること、記録に日付があってもactorのKnowledge-at-timeは未配置のままになりうること**である。Round 2では「分からない」を勝手に補完せず、どのEvidenceが追加されると配置・再構成が可能になるかを検証する。
