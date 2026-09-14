# GROUND Phase4B — Failure-directed refinement

最終engineering gate: **PASS**。Runtime HEAD `a0c812c`。schema0.1.24、既存default semantic、canonicalは明示選択。

## 1. Phase4 failure breakdown

Phase4は85/320 case、255/960 trialで完全到達しなかった。全failureを記録した。Epistemic qualification 15 case/45 trial、provenance 10/30、execution lifecycle 5/15、relation extraction 20/60、temporal interpretation 15/45、identity resolution 10/30、resource semantics 10/30。残る指定root familyは独立した主原因としては0。これは同じ主文の相関contextを含む集計であり、85の独立architecture問題ではない。

## 2. False Derivation 1.56%のroot cause

全15/960 trialは同じ5 development contextのstable failure。「出血が止まった。いつ処置が始まったかは記録がない。」の「始まった」を肯定的な処置開始と取り込み、execution_startedを作った。質問・記録欠如のscopeを欠落させたextraction error。最初に安全性だけを修正したB replayは0/960、到達75.00%。言い換えと文順反転を関連テストで検査した。

## 3. First semantic divergence一覧

全255 failed trialについてfailure-census.jsonに原文・gold・actual・失敗field・最初の変換地点を記録。Epistemic: qualification scope。Provenance: source role/observation kind。Execution: 未記録の問合せをoccurrenceへ変更。Relation: owner/custodianの語尾境界。Temporal: 時刻・取り消し・scene qualifierを単一spanへ圧縮。Identity: role triggerを単文に限定。Resource: 数詞の直前だけでrole分類。誤変換は主にdecomposeReality/qualification/compositionにあり、正しく誤情報を保存したpersistenceを変更していない。

## 4. 修正したgeneral rules

質問・条件・不観測/未記録はoccurrenceを作らない。述語後の接続をquotation外で分解。所有・保管の文法role、数詞前後のquantity roleを別保存。明示source chainと引用内qualificationを保持。既知時刻prefixを限定して除去し、名前の助詞境界を守る。有限の撤回と取消可否への名詞的言及を区別。「との連絡/という報告」の内容をworld occurrenceへ昇格させない。最後の2規則はRS replayの新しい失敗から追加した。

## 5. Case-specific shortcut検査

RuntimeはRS ID・case ID・評価domain名・gold fixture・evaluatorを参照しない。新規runtimeのsemantic noun/particle/aspect/source文法は分野名で分類しない。固有名・企業名・災害名・病院名の特例も追加していない。複数分野の文法例と最終3つの実文脈で検査。ただし有限の日本語文法coverageであり、全言い換えへの一般化は未証明。

## 6. Multi-semantic decomposition

quotation depthを守り、逆接・述語後の読点・数量後の接続を意味unitへ分解。sentence内のowner/custodian、total/available、record/observed/discrepancy、過去/事後sceneを別recordに保持。nested reportは独立したworld factへ分解しない。TranslationTraceにcanonicalized/compositionally canonicalized/safely unresolved/clarification required/unsupportedを内部記録。free bodyの保存だけでは評価到達にならない。

## 7. Provenance改善

direct observer、reported observer、reporter、intermediary、document、sensor、organization statement、social claimを分離。record reviewをdirect visualへしない。EpistemicObservationのkind・provenanceとsource role Entity参照を保存し、Evidenceはobservation_refで接続。組織発表や多段報告からworld Eventを作らない。匿名/集合sourceは識別できた個人へ変換しない。受動的な集合連絡はreported_source_scopeに保持し、解決済みsource identityとは数えない。

## 8. Lifecycle改善

considered/candidate/preferred/intended/planned/selected/instructed/executing/partially_executed/completedを区別し、referenced_planをEntityへ接続。未選択からformal Decisionを作らず、指示から受領・実行、実行から成果へ進めない。明示occurrenceのEventを既知対象/計画へ接続。selectedというmeaning marker/Eventとnative RealityDecisionDeclaration・decision context snapshotは同値ではない。必要なmaker/space/contextが原文から得られない限り後者は作らない。

## 9. Temporal改善

明示ISO時刻とliteral local timeを保持。year/timezoneのないRS時刻へ年やtimezoneを補わない。Event.occurred_at、EpistemicObservation.observed_at、recorded_atを分離。meaning recordのState validityはintake artifactのvalidityであり、過去worldの有効開始を捏造しない。明示対象・時刻・検証値が揃う場合だけ実対象Stateへ値を付ける。過去knowledge/permission/sceneは別record、文章順を時系列としない。全clock roleを任意文章から解決できるとは主張しない。

## 10. Causality改善

after/temporal successionとpossible/claimed/unverified/verified causal statusを分離。afterからcause_of/caused_byを作らない。引用内の「検証された」はreported_causality_verifiedであり世界の検証ではない。明示検証のbounded Event/markerのみ許可。任意の因果graphやすべての原因候補・反実仮想を抽出する経路は未実装。

## 11. Clarification改善

observerの未解決代名詞で対象がmaterialに変わる場合だけ停止。単なる低confidence、未検証、未知、時間表現「それまで」では停止しない。回答は元本文に最小の明示参照先を加え、本文を捨てず通常のcanonical経路へ再投入。90/90 control trialで必要問合せ、90/90 answer trialで解決。これはobserver pronoun controlの検査であり、任意の権限/多義語/人物同一性に対する一般的clarification accuracyではない。

## 12. Legacy hash test 2件の原因

両方B: intentional source change / stale fixture。Round5は675、Round6は703 preexisting fileのwhole-source hashを固定し、Phase4が意図して変更したintakeの5 fileを含んでいた。cli.ts、extraction/types.ts、rule-modality-detector.ts、semantic-propose.ts、reality/propose.ts。旧baseline hash/dataを変更せず、path+元hashが一致する場合だけexact approved hash/bytesを許すtest-only integrity guardを追加。Round6がRound5 test自体も固定していたため、その正確なguard差分も承認。全semantic assertionsを維持し、未知hash/core変更を拒否するテストを追加。削除・全体expected hash上書きはしていない。最終full suiteで両方PASS。

## 13. Held-out V2 case数・評価経緯

最終V2-E: 16 boundary×30=480 primary＋名詞/有限動詞/間接報告near-pair 30=510 primary。追加30 clarification control、計540 case。3回反復で1,530 primary＋90 control=1,620 initial trial、90 answer trial。各boundaryに3 actual domain contextを本文へ含め、short/medium/long、indirect source、uncertainty、reordered timeline、distractor、conflict、multi-clauseを含む。160基本formulation×3相関domain＋10追加formulation×3相関domain。510独立発見ではない。V2-A 96.88%はtarget binding監査不足を発見し診断扱い。V2-Bは強化して88.75% FAIL。汎用名前境界修正後V2-C 95.00% PASS。その後RSで2安全性gapを発見し修正、V2-D 95.29%。最終V2-Eはdomainがmetadataだけになっていないことも入力で検査し95.29%。全dataset/gold/resultを固定して保持。後のsetは前のsetと文法familyが相関する追試であり、独立population sampleではない。

## 14. Held-out canonical arrival

最終1,458/1,530=95.2941%。基本480 caseに限っても1,368/1,440=95.00%。Goldはparserを使わず手宣言し、NL trial前に全540 typed patchをapply/save/reload/validateした。必要field、同一meaning record上のqualification/clock/target、名前で解決したrole参照、明示実対象のverified value/Event subject、禁止導出、sourceを比較。UUIDと処理時刻は同値比較対象から除く。必要positive/qualification/binding欠落72 trialはpartialであり完全到達に含めない。

## 15. False Derivation

最終0/1,530=0%。禁止Event、cause、individual identity、equipment実行などの宣言したnegative constraintで判定。全世界の非支持推論を完全列挙した指標ではない。RS診断では取消可否→撤回、着金連絡→world着金の2件が別に発見され、修正後再投入で0件になった。

## 16. False Promotion

最終0/1,530=0%。reported→verified/world fact、option→formal decision、ownership→permit、source→direct observerなど宣言negative scope。False collapseも0/1,530。未知scopeを全falseへ変える経路を増やしていない。任意のclaim/fact昇格の完全検出を保証する値ではない。

## 17. Provenance accuracy

最終1,530/1,530=100%。persisted source channelと、各caseで手宣言したsource Entity label/kind、EpistemicObservation kind、observer/reporter/intermediary roleの全必要checkを検査。明示sourceのないcaseはdocument/source-channel scope。全Realityの全source chain理解が100%という意味ではない。

## 18. Decision lifecycle accuracy

180/180=100%。boundary4/5のrequired lifecycle/referenced-plan/selection/禁止formal-decision条件を検査。native decision space/context snapshotのNL構築率とは別指標。

## 19. Clarification precision

90/90=100%。clarificationを実際に返したtrialのうち、predeclared material observer ambiguityで必要だった割合。欠落clarification 0/90、明示回答後解決90/90。

## 20. Unnecessary clarification

0/1,530=0%。determinate primary caseを停止した割合。safe unknownは問合せ成功ではなくそのまま記録する。

## 21. E2 regression

954/954 assertion PASS、failure0。controlled typed compositionを現runtimeでapply/save/reloadし、既存reference-state/resource/permission/decision-memory/decision-space semanticsを再確認。元manifest/goldを保持。

## 22. Full test suite

3,943/3,943 PASS、FAIL0、skip0。semantically valid historical/regression/新intake testを含む。Command: npm run test:ground-core。hash例外は証拠付きexact guard、全semantic behavior assertionを残した。

## 23. Typecheck

PASS。node node_modules/typescript/bin/tsc -p ground-core/tsconfig.json。最終sourceおよび全新evaluatorを含む型検査。

## 24. Build

PASS。npm run build。最終sourceで実行。共有frontendの既存user変更は今回編集していない。

## 25. RS-001〜030比較

原文30×3=90 trialを固定hashで再投入し、input alteration0、source-channel failure0、technical failure0、clarification0、formal Decision0。Phase3 focused比較10件ではRS002 unnecessary clarification、RS004/018/022/030 false collapse、RS013 false promotionだった。Phase4/4Bはこの停止・channel欠落を回避。ただし元のfocused gold全項目一致は両方1/10（RS029のcausality_verified=falseという一項目scope）。RS002 record_count581/observed_count576は保持し個別不明markerは未到達、RS013 selection未完了のみ1/4。残る9件はpartial/missingであり全文成功に数えない。RS-native Eventsを原文に照らして全件レビューし、最終はRS024の明示instructionのみ。全30の本文理解率・全provenance精度・全誤導出率にはcomplete typed oracleがなく未測定。unsupported residualはPhase4 1,054/1,294 unit、Phase4B 1,072/1,329 unit（別分解のため比率を単純改善比較しない）。全30行のmatched field/objects/残差をrs-phase-comparison.jsonへ保存。

## 26. Residual failure families

最終24/510 case、72/1,530 trialのstable partial。B01省略後の対象binding、B02測定recordと真値のqualification scope/間接verified value、B09省略されたowner/custodian binding、B10引渡し未確認の権限predicate、B16介入の対象boundary。Goldのmissing positiveを消さずFAILに残した。さらに長文RSでは native Decision/snapshot・native Resource availability/allocation・Permission/Obligation/Commitment・複数knowledge holder・名前のない対象・多義時間・元scene完全性・集合人数/個別IDのcoverageが不足。meaning record内のknowledge_of_X等はbounded status carrierであり、任意の具体的命題/holderへ完全解決したFactではない。

## 27. Architecture candidate・保留

確認された新primitive/core/schema必要性は0。E2の既存compositionは954 PASS、今回のbenchmark residualはextraction/qualification/bindingの問題。長文の権利優先順位・複数knowledge holder・native Decision/Resource/Permissionへの完全接続は未検証boundaryへ隔離する。表現不能のarchitecture候補へ昇格させる前にtyped controlled pairで再反証する。今回はcore/type/schema/semantic contract/migration/historical Realityを変更していない。1 Scenarioからarchitecture変更しない。

## 28. 第一engineering gate

PASS。Arrival95.29>=90、derivation0<=1、promotion0<=1、provenance100>=95、lifecycle100>=98、clarification precision100>=90、unnecessary0<=10、E2954 PASS、all tests3943 PASS、typecheck/build PASS。stretch targetも宣言scopeでは満たす。合格範囲は有限の日本語canonical composition benchmark。全文Reality理解、任意NL、native E3全構造同値、全clock/権利/義務解決の完成を意味しない。

## Baseline・commit・証拠

Baseline `ground/checkpoint-187` / `04e8072cfaf6031b1b1221da5a781ddbf43b55e8`。4B-A e6b1660、B088cafb、C3d9bf33、D4f812ae/92f001b/c84f102、E5c723cd、F8ddf231/e5c7453/da5fb95、B safety follow-up a0c812c。4B-Gはこのreport/凍結dataset/evaluatorを別commitに記録する。

監査のpreexisting変更11 fileはintake2、承認済hash test2、全test実行で更新された7生成temporary storage cache。cacheはhistorical Reality/baseline/proofではない。core/schema/contracts/migrationをbyte hashで別検査し不変。

- [Baseline freeze](/Users/macsaku/.codex/visualizations/2026/09/14/01a09d7e-7dd5-77b0-9d10-c304663e2928/GROUND-phase4b/phase4-baseline-lock.json)
- [全failure/first divergence](/Users/macsaku/.codex/visualizations/2026/09/14/01a09d7e-7dd5-77b0-9d10-c304663e2928/GROUND-phase4b/failure-census.json)
- [全false derivation](/Users/macsaku/.codex/visualizations/2026/09/14/01a09d7e-7dd5-77b0-9d10-c304663e2928/GROUND-phase4b/false-derivation-census.json)
- [最終fixture/runtime freeze](/Users/macsaku/.codex/visualizations/2026/09/14/01a09d7e-7dd5-77b0-9d10-c304663e2928/GROUND-phase4b/heldout-v2e-definition-lock.json)
- [全typed gold pre-trial materialization](/Users/macsaku/.codex/visualizations/2026/09/14/01a09d7e-7dd5-77b0-9d10-c304663e2928/GROUND-phase4b/heldout-v2e/oracle-runtime-lock.json)
- [最終held-out rates/全stable failure](/Users/macsaku/.codex/visualizations/2026/09/14/01a09d7e-7dd5-77b0-9d10-c304663e2928/GROUND-phase4b/heldout-v2e/summary.json)
- [全Gate/count/hash](/Users/macsaku/.codex/visualizations/2026/09/14/01a09d7e-7dd5-77b0-9d10-c304663e2928/GROUND-phase4b/final-engineering-gate.json)
- [変更制約監査](/Users/macsaku/.codex/visualizations/2026/09/14/01a09d7e-7dd5-77b0-9d10-c304663e2928/GROUND-phase4b/constraint-audit.json)
- [Regression結果](/Users/macsaku/.codex/visualizations/2026/09/14/01a09d7e-7dd5-77b0-9d10-c304663e2928/GROUND-phase4b/regression-summary.json)
- [全30 Phase3/4/4B比較](/Users/macsaku/.codex/visualizations/2026/09/14/01a09d7e-7dd5-77b0-9d10-c304663e2928/GROUND-phase4b/rs-phase-comparison.json)
