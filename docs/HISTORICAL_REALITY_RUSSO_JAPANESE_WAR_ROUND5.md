# Historical Reality / GROUND — Round 5

## 判定

**新core primitive 0、新canonical relation 0、schema変更0。33 candidateをA 5／B 18／C 0／D 4／E 6に分類した。一般化すべき意味は確認できたが、多くは新しい物体型ではなく、既存Entity／Observation／Claim／Evidence／derived assessmentのcomposition契約だった。**

Round 4のCore Promotion Candidateは最終昇格ではなく、このgateの入力として再評価した。頻度や「一般化できそう」だけでprimitiveへ昇格させなかった。実装したのは既存0.1.24を使うopt-in source-assertion adapterとusage contract一件。旧adapter、core、Round 1〜4はbyte単位で維持した。

新しいHistorical windowの調査は行っていない。評価対象は凍結したRound 1〜4 Evidenceと現在のGROUND実装・既存非歴史fixtureであり、1904年当時のKnowledgeではない。実証の範囲はrepository内の実行可能なcontract／fixtureで、外部運用実績とは呼ばない。

## 1. 全candidate inventory

[完全inventory](/Users/macsaku/seiri-ai-frontend/ground-core/experimental/historical-reality/round5/candidate-inventory.json)、[各candidate→実Claim／Sourceの経路](/Users/macsaku/seiri-ai-frontend/ground-core/experimental/historical-reality/round5/replay/candidate-evidence.json)、[SG01〜35の元record保持index](/Users/macsaku/seiri-ai-frontend/ground-core/experimental/historical-reality/round5/semantic-signal-index.json)。

各entryにHistorical case Claim IDs→existing core→lost meaning／adapter failure→sidecar representation→Round recurrence→existing-domain witness→minimal requirement、counterexample、10項目gate、priority、decisionを残した。SG13とSG-13等の表記差はreview indexだけでalias化し、親ファイルは変更していない。

### A. EXISTING CORE SUFFICIENT

* R5-C06 — source content certainty (P0)
* R5-C07 — reality certainty (P0)
* R5-C17 — state transition / reported damage boundary (P0)
* R5-C27 — legal declaration / actual control / capability boundary (P0)
* R5-C33 — reconciliation query scope / predicate cardinality (P0)

### B. CORE COMPOSITION GAP

* R5-C01 — actor-scoped epistemic state (P0)
* R5-C02 — information propagation (P1)
* R5-C03 — temporal role (P0)
* R5-C04 — general provenance lineage (P1)
* R5-C05 — source identity certainty (P1)
* R5-C08 — unknown target/reason (P0)
* R5-C09 — observation scope (P1)
* R5-C10 — partial observation and silence (P0)
* R5-C11 — Evidence dependency (P1)
* R5-C13 — contradiction dimension/alignment (P1)
* R5-C16 — quantity disagreement and unit/scope (P1)
* R5-C18 — Reconstruction / derived assessment (P1)
* R5-C20 — nested claimant / reported speech (P0)
* R5-C21 — certainty assessment target / extraction resolution (P0)
* R5-C23 — identifier namespace / assignment context (P1)
* R5-C26 — accessibility / possession / reading / knowledge boundary (P0)
* R5-C28 — interpretation / Narrative provenance (P2)
* R5-C29 — modality / catalogue / depicted-event boundary (P0)

### C. CORE PRIMITIVE CANDIDATE

該当なし。新primitiveを必要とする証拠が、最小composition／relation案を超えて成立したcandidateはなかった。

### D. HISTORICAL / DOMAIN SIDECAR

* R5-C22 — documentary manifestation / bibliographic custody (P2)
* R5-C24 — translation operations / editorial collation (P2)
* R5-C25 — calendar / archival historical date conventions (P2)
* R5-C31 — research absence taxonomy / archive survival (P2)

### E. IMMATURE

* R5-C12 — independent corroboration verdict (P3)
* R5-C14 — event identity resolution (P3)
* R5-C15 — spatial uncertainty (P3)
* R5-C19 — Reconstruction versioning (P3)
* R5-C30 — probability calibration / universal certainty scale (P3)
* R5-C32 — automatic inference / Knowledge truth / entity merge (P3)


## 2. A〜E classification

Aは既存coreの意図されたcompositionで十分。Bはatomが既にあるが、対象・role・参照・scope・constraintの契約が不足。Cは新atomの意味利得を実証したもののみ。Dはdocumentary／archival／historical vocabulary。Eは粒度・identity・判定・lifecycleが未成熟。

**JSONに保存できることを、generic core semanticが成立したこととは数えていない。** Bではtyped参照やquery契約が未実装という実際の意味損失を認める。その解決が大きなprimitiveより最小relation／contractで可能なため、Cに自動昇格させない。

## 3. Round 1〜4で再出現した意味

* actor／nested reporting：R1 `c678-uncertainty`、R2 `r2:c-ack82`、R3 `r3:c-pak-nagasaki`、R4 `r4:c-stark-belief`／`r4:c-press-paris`。宛先・報告者・authority・holder／observerは同じではない。
* 時間role：R1/R2 `c679-held`のreported date≠possession time、R3 release／edition／delivery、R4 approach≠firing、explosion≠heard gunfire、creation≠dispatch。
* certainty target：R1 capturedというSource assertion、R2 assessment target、R3 documentary identity／delivery、R4 53/54、Paris沈没伝聞、手書きの分の判読不能。
* provenance／dependency：R1のrisk-only SG06、R3 citationとcopyの区別、R4 Togo再掲／guide、Stark編成元。R1 riskを確立済みlineageに遡及昇格していない。
* unknown／access：R1欠落と無知の区別、R2送信と受信、R3未確認reference endpoint、R4 partial download／uninspected photo。

一方event alignment、具体的空間比較、Reconstruction v1／v2 lifecycleは主にR4に集中する。全candidateが複数Roundの実例で同程度に成熟したとは扱わない。

## 4. 過小評価されていたexisting core

[types.ts](/Users/macsaku/seiri-ai-frontend/ground-core/types.ts)、[BeliefAssessment](/Users/macsaku/seiri-ai-frontend/ground-core/reality/belief.ts)、[EpistemicGap](/Users/macsaku/seiri-ai-frontend/ground-core/reality/epistemic-gaps.ts)を再読した。

* Entity≠Event≠State、Claim／EpistemicObservation≠ontic Realityは既にある。
* Claim confidenceはその命題についてであり、別subject／predicateの命題へ自動継承しない。
* BeliefはNO_CLAIMS／UNCONTESTED／CONTESTEDを勝者なしで保持する。UNCONTESTED≠truth、confidence meanはdescriptive arithmeticで融合scoreではない。
* query-scoped NO_APPLICABLE_CLAIMS、NO_LINKED_EVIDENCE、EVIDENCE_TENSION、TEMPORAL_COVERAGE_GAPは既にあり、false／negativeを生成しない。
* declarationのholder／subjectとdeclared_byの分離、Acceptance≠Commitment declaration、Capability declaration≠execution／effective capability、resource unit／rangeのexact semanticsが既にある。
* DecisionContextSnapshotV1、append-only declaration、derived read modelがある。Reconstructionだから直ちに新State型を要するわけではない。

非歴史対応は既存pipe condition／sensor provenance、resource-availability per-source evidence、intent holder／declarer、commitment acceptance、impact measurement、decision snapshot testsまで具体的に確認した。sensorの空想事例を新たに作って一般化したのではない。

## 5. Actual core semantic gaps

Bの中心は、epistemic actor／payload／stance、attribution nesting、role-labelled raw time、assessment target／basis／method、coverage／completeness、upstream endpoint／dependency、reported proposition alignment、cross-scope derived assessmentを結ぶ**generic composition契約**である。

現coreはClaim.valueに保存できるが、こうした関係の参照整合性・粒度・query・absence rulesをgeneric APIで保証していない。sidecar validator／traceが意味を補っている。「atom不足」と「contract不足」を分けた。

## 6. Historical／domain-only semantics

D 4件：edition／folio／shelfmark／original-label scope等のmanifestation metadata、translation／editorial collation operations、歴史暦／archive release慣行、研究・archive survival taxonomy。

一般的なderived_from、time role、target/reasonの契約と分離する。Russian Julian慣行、明治年号、FRUS modern numbering、1905/1906 edition、OCR editorのcreditをcore専用fieldにしない。

## 7. Immature semantics

E 6件：独立corroboration判定、event identity resolver、一般spatial uncertainty model、Reconstruction revision lifecycle、probability calibration／universal certainty scale、automatic Knowledge／entity merge。

実例の必要性はあるが、hidden common source、粒度、clock／frame、supersession／retraction、groundtruth校正が不足。R4のv2追加testはsyntheticで、実際のEvidence更新履歴ではない。

## 8. Proposed Core Promotion Candidates

**正式C candidateは0。** R4の推薦から安定したのは「attribution／target／role／reasonを明示する境界」であり、新primitiveという形までは確定しなかった。

次のcore設計検証対象はBのP0：actor+payload+stance、nested attribution、assessment target+basis、raw time+role、coverage／absence contract。P1はupstream dependency／reported-proposition alignment／generic derived assessment。いずれも最小relation／compositionとして先に検証する。

10項目gateはinventoryに保存した。Bはcriterion3のcontract-level lossを認めるが、criterion10「新atomの利得が最小compositionを超える」は未証明。Eは複数Round・粒度・lifecycle等も不足。Cへ置くための頻度だけの閾値は使用していない。

## 9. Rejected promotions and reasons

certaintyをidentity/content/reality/extraction/time/spaceごとのprimitive群へ分割：対象＋assessmentで足りる可能性が高い。Knowledge巨大object：receipt/read/understood/warranted knowledgeのlifecycle未確立。Propagation pipeline：現実の欠落・branchを線形必須stageにしてしまう。Source independence score：paper count／provenance fingerprintは独立性ではない。HistoricalSource等のcore専用型：専門化する。単一Event merge／damage→disabled：必要なidentity・state Evidenceなし。万能なUNKNOWN enum：structural gapとresearch statusを潰す。

## 10. Counterexample tests

[16件のRound 5 tests](/Users/macsaku/seiri-ai-frontend/ground-core/__tests__/historical-reality-round5.test.ts)。全candidateに実Claim由来counterexampleをinventoryで記録し、主要な意味損失を実行可能testに固定した。新primitive昇格が0件なので、新primitiveごとのproof義務は該当なし。

実行testにはParis Source-content UNCONTESTEDでもPallada Reality contested、claimant chain消失、current-system判読不能を上村の不確かさにしない、reported dateからRosen possessionを埋めない、Source／world predicate誤用拒否、dependency 53/54を票数で解消しない、no Claims≠unknown value≠negative、政府Knowledge非生成、holes≠hits、unknown before、catalogue≠photo observationを含む。

追加発見：旧partial adapterは同じ日本Sourceの**23別命題**を一つのpredicateでqueryするためCONTESTEDになる。新adapterは命題ごとのslotに分け、各Source-content queryだけをUNCONTESTEDにする。世界の命題の一致／対立はこのqueryから決めない。[実際のcounterexample](/Users/macsaku/seiri-ai-frontend/ground-core/experimental/historical-reality/round5/replay/predicate-scope-counterexample.json)。

## 11. Certainty architecture decision

[A/B/Eの対象別decision](/Users/macsaku/seiri-ai-frontend/ground-core/experimental/historical-reality/round5/architecture-decisions.json)。基本形は**明示した対象＋命題／assessment relation＋basis／method**。独立primitiveを大量追加しない。

source identityは「どの原本・表現物か」、source contentは「検査した箇所が何を言うか」、Realityは「外界で何が起きたか」。extractionはcurrent inspection、event identityは候補alignment、time/spaceはresolution、Reconstructionはevidence snapshotからのderived outcome。それぞれ別対象で、identity authenticityをevent identityへ移さない。

Claimの一つのconfidenceをこれらへ横流ししない。別Claim scopeでsource/worldを分離するAはexisting coreで足りる。generic target／method relationはB、qualitative scale・calibrationはE。数値confidence必須というcore制約は残る。0.95は継承した未校正text-attribution estimateで、Reality probabilityでもunknownの代用品でもない。校正できないReality confidenceは生成しなかった。

## 12. Unknown architecture decision

core EpistemicGapを再利用する。UNKNOWN(value/role unresolved)、NOT_RECORDED(query/snapshotにrecordなし)、NOT_OBSERVED(指定coverageの観測否定)、NOT_AVAILABLE(named targetのaccess状態)、NOT_RESOLVED(inference／identity未決)、NEGATIVE(明示的な否定命題)を区別する。

NOT_RECORDEDからNOT_OBSERVEDへ、NOT_AVAILABLEからlostへ、検索失敗からNEGATIVEへ進めない。一般契約はtarget+reason+basis+scopeというB。not searched／searched not found／archive incomplete／lost等の固定研究taxonomyはD、Evidenceがある場合だけそのstatusを言える。coreの構造的gap検出をarchive survival classifierにしない。

## 13. Temporal-role decision

existing occurred_at／observed_at／recorded_at／applicable_*／valid_*はそれぞれの意図で使う。**subject／reported candidate＋role-labelled Time Assertion＋Evidence**というB compositionを先に検証する。raw、precision、calendar、clock、conversion method／unknownを保持し、stageごとのfieldを増殖させない。

null Claim applicability boundsは「unbounded」で、時間unknownではない。報告日をreceipt／possessionへ入れず、sidecar unknown timeはraw descriptorとして残す。今回coreに投影したのはsource snapshotのinspection assertionで、1904年のapplicabilityではない。replayの固定2026 timestampはintegration harness上のingestion markerであり、歴史actorのKnowledge instantではない。

## 14. Information-propagation decision

B。Document/message identity＋actor/stage/payload/time relation Claim＋Evidenceの疎なgraph。sent／transmitted／delivered／possessed／read／interpretedは別のattributed relationで、固定pipeline primitiveは不要。

同じschemaでrecipient branchや未知edgeを表現し得るが、partial delivery／lossの全lifecycleをこのcaseで検証済みとは言わない。command report宛名から政府awarenessを逆算しない。

## 15. Provenance decision

Bの一般upstream endpoint／scope contractと、Dのcopied／translated／quoted／digitized／edition／archive operationを分ける。具体的変換verbはsidecarに残す。citationはcopyの証明でない。original referenceはverified original artifactでない。FRBR等の外部体系の輸入はしていない。

## 16. Evidence-dependency decision

distinct source IDs≠independent Evidence。一般に必要なのは命題scope付きdependency／common ancestor／unknown endpointというB composition。独立性verdictやcount／scoreはE。

既存resource source aggregation policyのANY／ALLは明示したsource memberを合成するruleであり、truth、独立性、source priority、authority weightingの推定ではない。既存domainの能力を再利用するが、別の意味へ転用しない。

## 17. Contradiction decision

core Evidence SUPPORTS／CONTRADICTSと、同じproposition slot内のClaim divergenceを維持する。scope／dimension／target identity／observableを明示したreported-proposition contrastはB composition。

Pallada/Pallida対立はprobable target alignment条件付き。53/54はtranslation／transcription系統の差、23:35爆発と23:45砲声はobservable差である。二つのtrue Source-content statementsを相互否定しない。多種類のprimitiveや万能な閉じたconflict enumは採用しない。Later correctionはEvidenceがある時だけ認定する。

## 18. Reconstruction decision

**評価boundaryで利用可能なEvidenceから形成した、basis／opposition／scope／alternativesを持つderived assessment**とする。Reality、単一Claim、Narrativeと区別する。existing BeliefAssessment／DecisionContextSnapshotの一般化可能な部分を先に利用するBで、新ontic Stateではない。

Reconstruction v1は原sidecarに残す。version改変拒否とappend testはあるが、Evidence cutoff、revision、retraction、supersession、部分更新のgeneric lifecycleはE。R4 v1には完全なexplicit cutoff instantがなく、source access dateを遡って埋めない。今回のreviewはbaseline manifestによる凍結snapshotを明示した。

## 19. Implemented changes

[implementation前promotion record](/Users/macsaku/seiri-ai-frontend/ground-core/experimental/historical-reality/round5/promotion-records.json)、[opt-in adapter](/Users/macsaku/seiri-ai-frontend/ground-core/experimental/historical-reality/round5/source-contract.ts)、[gate validator](/Users/macsaku/seiri-ai-frontend/ground-core/experimental/historical-reality/round5/gate.ts)。

唯一のaccepted change：既存document Entity＋external Evidence＋Source-content Claim＋SUPPORTSのusage contract。predicateを`source_assertion/<original_claim_id>`とし、原Claim、claimant／chain、actor descriptors、locator／inspection、raw time、source creationをClaim.valueに保持する。confidence対象、historical applicability非合成、source routeをopt-in validatorで検証する。

新core atom／collection／schema／relation／core helperは0。部分投影であり、sidecar全体をcoreへlossless migrationしたとは言わない。意味を持つtyped composition API一般版はまだBに残る。

## 20. Retained sidecar semantics

R1〜4のfull dataset、actor epistemic records、伝播node/edge、message edition identity、reference endpoint、lineage／translation collation、三対象certainty、unknown reason、search diagnostics、candidate alignment、clock／space precision、quantity scope、reported state、contrast、independence評価、Reconstruction alternatives／v1を維持した。

Source-assertion adapterはこれらのhistorical world meaningをcanonical Event／State／Knowledgeへ変換していない。

## 21. Migration / compatibility status

[各Roundのprevious/new/difference](/Users/macsaku/seiri-ai-frontend/ground-core/experimental/historical-reality/round5/replay/dataset-compatibility.json)。R1 18、R2 41、R3 64、R4 147 Source-content Claimsをそれぞれfresh projectionし、file-store reload後に元のattributed Claimの同値を検証した。

previous：旧partial text projection。new：命題slot分離＋explicit原attribution／scope／time。equivalence：Source根拠と原Claim内容／unknownを維持。difference：predicate keyとpayloadが異なるため旧patchのbyte同値やdrop-in API互換とは呼ばない。migration status：opt-in fresh projectionのみ、原dataset／旧state／旧adapterを書き換えていない。lineage／Knowledge／Reconstructionはnot migrated。

## 22. Full tests / typecheck / build

[verification](/Users/macsaku/seiri-ai-frontend/ground-core/experimental/historical-reality/round5/verification.json)。既存全GROUND suiteと新Round 5 tests、計**3768/3768**成功（195 test files、907 suites、新規16 tests）。ground-core strict typecheck成功。core JavaScript emit buildをtemporary outputへ実行成功、compiled CLI `new-id` smoke成功。packageのVite production build成功（213 modules）。emit outputのruntime smokeにはworkspace依存node_modulesへのtemporary linkを使用し、standalone packaging testとは呼ばない。

sandbox内の最初のsuiteは3751/3752、唯一のCLI testがtsx local IPC `listen EPERM`で失敗した。通常権限で全suiteを再実行し成功。これはcore regressionではなく実行環境制約で、既存CLI testをskip／変更していない。新fixtureの不足note fieldも型検査で修正した。最終結果は上記の全成功値。

## 23. Historical replay / promotion proof

[replay](/Users/macsaku/seiri-ai-frontend/ground-core/experimental/historical-reality/round5/replay.ts)、[9 actual-case composition proofs](/Users/macsaku/seiri-ai-frontend/ground-core/experimental/historical-reality/round5/replay/composition-proofs.json)、[238 historical Source traversals](/Users/macsaku/seiri-ai-frontend/ground-core/experimental/historical-reality/round5/replay/historical-source-traversals.json)。

全4 datasetをmaterialize／validate／fresh project／file-store reloadし、claim basis／SUPPORTS／Source URLを辿った。R1 reconstruction4、R2 propagation17、R3 documentary75、R4 derived142を再生。675 preexisting filesをhash/size検証した。

9 proofsはSource→original Claim→existing core source assertion scope→SUPPORTS→current derived source assessment→retained sidecar reconstruction／provenanceを再生する。新core primitive proofではなく、正しい既存compositionのproofである。各fresh projectionのhistorical Events／States／direct observationsは**0**。World contradictionやactor Knowledgeのunknownを検査済みsnapshot-content certaintyで埋めていない。

## 24. Legacy semantic delta

**core delta 0、schema0.1.24維持。** 全既存TypeScriptとR1〜4 reports／datasets／sidecars／signals／tests／replays／assetsがbaseline byte同一。新Round5ファイルとtestを追加したのみ。

opt-in adapterのpredicate/payload deltaは明示した。旧adapterで広いpredicateをBelief queryに渡すriskは残り、旧resultsを「正しいworld contest」と再解釈しない。この新usage contractが既存stateを自動修正するわけではない。

## 25. Remaining semantic risks

* Generic composition validationは未core化。payload retentionだけでnested relation query／upstream identity保証を達成したと言えない。
* 原Claimの外部actor IDsはsidecar namespaceのdescriptorで、known ontic person／organizationへ自動解決しない。
* Mandatory numeric confidence、未校正0.95、qualitative certainty、assessment lifecycleを混ぜない。
* 相互のclock校正、event粒度、spatial frame、independent source originはまだ未実証。
* R4 versionのexplicit evaluation cutoffと実Evidenceによる改訂／撤回は未検証。
* 現在のfixture対応はrepository内の一般domain contractで、任意のsensor／market／remote sensing datasetへの実証ではない。

## 26. Recommended next Historical Reality boundary

**territorial sovereignty／administration／occupation／actual controlの分離。第一targetは韓日議定書周辺の1904-02-23〜26、local infrastructureと韓国側actorを含む狭いwindow。**

理由はSG09がR1で発見された後、十分な独立modalityで再検証されていないこと、現在coreにあるAuthority／Mandate／Permission／Capabilityの宣言semanticと、実際の統治・現地支配の間を最も強く攻撃できること。条文・署名／伝達・現地執行・非国家actorの観測を分離し、core AuthorityPower enumへterritorial sovereigntyを無理にmappingしない。

R1のFRUS protocol／telegraph memorialという既存leadから始め、韓国側の受領・交渉・現地行政／通信記録を別起源で探す。未確認ならunknown。戦争全体・講和全体へ拡大しない。必要なのは新しい年表ではなく、**宣言された権限≠知り得た内容≠実行可能性≠実際のcontrol**を、同じgeneric atomと候補compositionで保持できるかという反証testである。

## 最終評価

> Round 1〜4で発見したHistorical semanticsのうち、GROUNDがRealityを扱う一般能力として本当に昇格すべきものは何だったか。

**一般基盤へ取り込むべき意味は、actor／payload attribution、assessment target、raw temporal role、evidenced upstream dependency、observation coverage、derived assessment basisという最小composition契約だった。新しい独立primitiveを要する実証は今回は0件だった。**

source content≠external reality、declaration≠effective world state、belief≠truth、query absence≠negativeは既存coreの能力として再確認した。書誌・翻訳・歴史暦・archive探索状態はsidecarへ、identity solver・independence verdict・certainty calibration・Reconstruction lifecycleはexperimentalへ残した。最小adapter改善のproofと全互換性検証を伴ってこの境界を明確にできたことをRound5の成功とする。
