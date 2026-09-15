# Historical Reality / GROUND — Russo-Japanese War Round 2

対象窓: 1904-02-06〜1904-02-10。調査・実装日: 2026-09-14。

評価結果: **experimental sidecarは「誰について、どの内容の、どの段階が史料に記されるか」を保持できた。ただし、ロシア最終回答の全伝播経路、日本内閣・陸軍・海軍大臣の当時の閲読・認識は再構成未完。** 受信欄から閲読を生成せず、同日内順序・未確認時刻・主体範囲を残す。これは史実確定率の採点ではない。

Round 1は不変。core schema、既存projection、既存dataset、landscape、replayは変更していない。Round 2は親SHA-256を参照する追記版であり、原資料の欠落を実装によって補完していない。前窓の2月4〜5日と後窓の11〜13日・公刊日は基準・負の対照として明示する。

## 1. Confirmed Evidence

確認強度は**何を確認したか**に付く。以下の「確認」は外界命題全体の確定を意味しない。

- [日本外交公刊文書（1904年、Translation）](https://archive.org/details/correspondencere00japarich): 表紙、PDF60・64・65頁を原画像で確認。No48〜51は公刊英訳であり、原日本語電報・ロシア回答原本ではない。No49は抽出本文を確認したが原画像との照合未実施。
- [外交電報簿 B07090546900](https://www.jacar.archives.go.jp/das/meta/B07090546900): 外交史料館5.2.1.14_003、58画像。画像4〜6・8〜12を目視。小村発信控、栗野・林電報の受信注記へ到達。ロシア回答本文、配達原票、小村閲読署名ではない。
- [旅順報告 C09050255300](https://www.jacar.archives.go.jp/das/meta/C09050255300): 防衛研究所、海軍省-日露-M37-5、53画像。画像1・3・5を目視。「写」と記された同時代報告写。報告末尾2月10日、冒頭の仁川発電注記11日を別々に確認。
- [仁川備考文書 C05110032100](https://www.jacar.archives.go.jp/das/meta/C05110032100): 防衛研究所、⑨その他-千代田-470、101画像。画像4〜6・10〜11を目視。後日編纂された極秘海戦史の文書再録であり、発信された電報原物とは同一化しない。
- [Pak論文（2023）](https://hist.spbiiran.ru/wp-content/uploads/2023/04/pizh_1_37_2023_128-139_pak.pdf): PDF本文と135頁原画像を確認。ロシア公刊文書への脚注は探索経路。長崎遅延・2月7日着の説明は後年研究引用で、今回原通信ログは確認していない。
- [ロシア国立図書館／NEB公刊文書書誌](https://rusneb.ru/catalog/000199_000009_007506064/): 1905年版、49+[1]頁、FB M125/38・Я71/56・MFK801-14/1944を索引書誌で確認。viewer接続制限、PDF endpointはHTMLを返し頁未確認。
- [RGIA文書書誌](https://www.prlib.ru/item/324328): 1622/1/301-г、29葉へのarchive lead。folio未確認。書誌の1903年表記、1903〜04年交渉内容、公刊版の同一性は未解決。
- [Indianapolis Sunday Journal, 2月7日1頁](https://www.loc.gov/resource/sn82015679/1904-02-07/ed-1/?sp=1): 公式OCRのみ。原画像取得は失敗。匿名通信の報告で、東京・在英公館の受領原簿ではない。
- [陸軍配布記録 C06040574900](https://www.jacar.archives.go.jp/das/meta/C06040574900): 大本営-日露戦役-M37-10-144。catalog転記のみ。12日配布を26日に番号付けする記録。原画像・実際の奉読は未確認。

ローカルPDF5件を保存し、URL・頁数・byte数・SHA-256・目視範囲を acquisition-manifest.json に収録。全PDFを取得したことと全頁を読んだことは別。HTMLを返したロシア・LOCの取得物はPDF evidenceに登録していない。

## 2. Russian reply transmission chain

**確認できた経路は「回答発送についての発言を栗野が報告し、その報告に東京受信欄がある」経路。最終回答自体の東京受領経路ではない。**

1. No50公刊電報: 栗野は2月4日20時の面談で、ラムズドルフが回答趣旨をアレクセーエフへ送り、ローゼンへ転送させると述べた、と報告する。
2. 同電報はラムズドルフの四条件を**個人的見解**と明示し、正式回答と同じと言えない、と留保。回答本文の知識をここから生成しない。
3. 同文書datelineはPetersburg February5, **5.5 A.M.**、受信注記は同日 **5.15 P.M.**。印字の時計を保存し、UTC標準はunknown。datelineを発送原票と同一化しない。
4. [FRUS678](https://history.state.gov/historicaldocuments/frus1904/d678)はアレクセーエフへの送付・変更権限と栗野のno positive knowledgeを別々に報告。[FRUS679](https://history.state.gov/historicaldocuments/frus1904/d679)はラムズドルフがローゼンに回答があったと述べたことを記す。**possessed ≠ delivered ≠ read**。
5. 新聞の東京7日通信はその日の回答提示を報じる。Pakは長崎遅延後7日着を述べる。ただし匿名新聞報告、後年再構成、外交官の伝聞を同じ品質へ平坦化しない。

Lifecycle12項目の扱い:

- drafted_at: unknown。具体的な原草案・版対応未確認。
- approved_at: Pakの皇帝承認というreported candidate。原承認文書・暦・最終版対応はunknown。
- signed_at: unknown。原署名未確認。
- held_by: ローゼン所持というラムズドルフ発言のreported candidate。FRUS679の2月8日報告日を所持開始日にしない。
- dispatched_at: 栗野・FRUSの伝聞、Pakの2月2/3日再構成というcandidates。どの版・分割電報か未確認。
- mechanism: unknown。電報という文書種別だけで全中継経路・長崎での操作を確定しない。
- arrived_at: 新聞とPakの7日候補。original receipt未確認。
- received_by: unknown。ローゼン所持の報告と正式受領原簿を分離。
- opened/read_at: unknown。
- understood/interpreted_at: 最終回答についてunknown。個人的見解の解釈は別payload。
- known_by actor: 栗野の留保・FRUSの否定的knowledge発言を保持。回答本文を知ったactorの確定なし。
- acted_upon_at: unknown。小村訓令は回答発送・内容に依存せず実施せよと記すため、断交を回答受領への反応へ自動連結しない。

## 3. Japanese actor-specific Knowledge-at-Time

- **小村／外務大臣（発信主体）**: 外交電報簿No54の5日2-pm発信控から、訓令の作成・発信表記を保持。No50/51/52を一通告、No53を同時に提出し各受領と提出を報告せよと命じる。公刊No48/49の2.15 P.M.とは時刻・文書番号を丸めて統合しない。
- **栗野個人・在露公使**: No82は5日6.15pM日付で電報番号50・53の受信確認を記す。51/52/54やロシア回答へのknowledgeを広げない。公刊文書No50は電報番号50と別の識別子。公刊No51は6日16時に両通告提出と報告する。離露10日は予定であり実際の出発確認ではない。
- **東京外務省受信事務**: No50公刊受信欄5日17:15、No82受信欄6日04:40、公刊No51受信欄7日05:45を保持。これは受信記録。小村本人のopened/read_at、理解、閣議報告はunknown。
- **林董・在英公使**: No59は5日22:50 London日付で小村65を参照し撤退後の情報拠点を提案する。東京受信6日11:20。撤退計画を参照できたこととロシア回答本文を知ることは別。6日保護依頼No67の小村発信控から林の受信を追加しない。
- **匿名在英公館当局者**: 新聞の6日土曜遅くの報告は回答受領の示唆が新聞以外にないという限定命題。林本人の全知識・公館全員の無知へ昇格しない。
- **日本内閣／政治指導部**: 今回取得史料から6〜10日の日別閲読・会議共有を確定できず。空queryは無知という結論ではない。
- **陸軍統帥部**: 12日配布・26日番号付けの記録を負の対照として保存。6〜10日knowledgeへ遡及しない。明石→児玉に関する外交電報のroutingだけで陸軍中央の受領・認識は生成していない。
- **海軍大臣**: 旅順・仁川報告の宛先であることと受領・閲読は別。受領原票・認識日はunknown。
- **東郷・瓜生／現地指揮主体**: 本人名義報告・編纂版再録の主体を限定。現場全員が同じ観測・解釈をしたとはしない。
- **小村→グリスコム**: Round1 [FRUS392](https://history.state.gov/historicaldocuments/frus1904/d392)と[395](https://history.state.gov/historicaldocuments/frus1904/d395)のwas_toldを継承。9日の「ワリャーグ拿捕」は外務大臣から米公使への報告内容であり、海軍の確定観測ではない。

actorPropagationAtは追加layerとinherited_round1_recordsを返す。Gregorian日queryでbefore/same-day/unplacedを区分する。異なる地方時計を並べたinstant順序、継続belief、受信から閲読、公刊から個人accessは計算しない。

## 4. Initial military Event / Report chains

**旅順:** 9日攻撃・昼戦について東郷が後から報告 → 10日という報告末尾日付 → 11日仁川発電という注記。観測当日艦船日誌、報告執筆実時刻、途中の電報、海軍大臣受領・政府認識はmissing。報告は敵損傷の「認ム」と未明瞭を含む。これを敵艦数・実損害の確定へしない。

**仁川No1:** 9日12:35p.m.仁川発電（原表記「午後十二時三十五分」） → 同日16:50佐世保発電。前日夕刻のコレーツ発砲と当日退去通告を記す。日本海軍再録中の主張で、露艦側観測・独立原記録は未照合。佐世保dispatchは東京receiptではない。

**仁川No2:** 10日15:35仁川発電 → 同日20:35佐世保発電。9日の35分交戦、露艦退却・夕刻破壊、己方無損害を報告。敵艦の状態・原因について観測と推定を保存上同一視しない。原送信紙・受領紙・東京政府recognitionは未確認。

**後日No3:** 13日報告は同じNo2電報を再録し、海軍大臣宛電報の後に千代田艦長報告へ接したと記す。再録された二箇所を独立した二件の観測として数えない。9日外務省→グリスコムの拿捕報告を10日No2から生じたとする時間逆転の連結も作らない。

**ロシア→外国:** [FRUS680](https://history.state.gov/historicaldocuments/frus1904/d680)は9日付ラムズドルフ電報の英訳を10日に米国国務省へ提示した記録。原文の27th January [9th February]とnightをRound1から保存。露現地観測→露中央受領→解釈の欠落を埋めない。米国で文書が提示されたことは全米政府・世論の認識ではない。

**公衆:** 新聞issue日、外交公刊文書の3月、後日海戦史、2023研究を分離。今日原画像を閲覧できることは1904年actorが閲覧できたことではない。

## 5. Source-certainty vs Reality-certainty

scoped_assessmentsに同一claimを二つのtargetで保存した。例えばc395-capturedについてsource_assertionはstrongly_established、external_realityはunresolved。sourceは「明瞭な記述がある」、Realityは「拿捕が実際に成立した」という別命題。

東郷の損傷推定、瓜生の敵艦破壊、ロシア回答発送の伝聞、Pak再構成にも同じ分離を適用。数値confidenceを共有・転写しない。既存core projectionの0.95は変更せず、未校正の**source-text attribution estimate**という限界をreplayに記録。歴史Realityの確率ではない。sourceの明瞭さも未目視頁・OCR・訳・版対応まで保証しない。

## 6. New / repeated Semantic Gap Signals

- **SG13 対象付きcertainty:** 同じ記述にtext attributionとexternal propositionの評価を別targetで結ぶ必要を確認。
- **SG14 payload付き段階:** 受信確認50/53、個人的見解、回答発送情報、正式回答本文を区別しないknowledge relationは過大帰属を作る。
- **SG15 sparse propagation:** 仁川→佐世保発電と旅順10日作成→11日発電は保存できるが、その間・後のreceipt/readを補完してはならない。
- **SG16 対象時間と報告時間:** FRUS679の報告日からローゼン所持日を作る問題を具体的に確認。
- **SG17 contemporary accessibility:** 後日公刊から当時のpublic accessを生成しない必要。公刊参照日より前であっても不存在・非公開を確定せず、actualaccessは分からない。
- **SG18 文書番号・電報番号・版:** 公刊No50と電報No50は同一番号でも別物。正式回答と個人的見解、草案・分割・改訂の同一性は未確定。

これらは新core primitiveを要求する結論ではない。Round1のSG01/02/03/04/07/08/10/11を実例で狭くした追加signals。

## 7. Round 1 gaps confirmed again

SG01 nested reporting、SG02 time roles、SG03 actor-specific epistemic stance、SG04 manifestation、SG07 missing categories、SG08 reconstructionとsource、SG10 calendar/night、SG11 existence/access/receiptの相違を再確認。

SG06 upstream dependenceはRound1で未実証だったが、仁川No2をNo3に再録する具体例へ到達。依存riskのsignalを強めた。ただし任意の全sourceの独立性を判定する機構までは作っていない。

SG05 qualificationはラムズドルフの個人的見解・東郷の未明瞭／推定で再確認。SG09 control/identityとSG12 narrativeは今回の狭い窓では再検証対象を十分追加できず、否定・解決扱いにしない。

## 8. Round 1 gaps weakened or corrected

- 「軍事原画像へ未到達」は一部解消。旅順同時代写と仁川後日再録の原画像に到達。ただし当日艦船日誌・発信電報原物まで確認した、という修正はしない。
- ロシア回答のchain全体unknownを狭めた。栗野による発送発言の記録と東京受信注記は追加できた。回答本文の東京受領・閲読は引き続きunknown。
- FRUS395拿捕命題を外界の有力確定候補として扱う根拠は弱まった。仁川再録は退却後破壊を報じる。Round1の矛盾データを削除せず、誰が何を報告したかを維持。
- 日付の粗さは原時計表記の取得で一部改善。時計標準未確認のため、UTC instantへの精密化はしない。
- JACAR陸軍文書の配布は12日、番号付け26日というcatalog記述。宣戦・勅語の一般叙述と同じ文書として6〜10日へ流用する候補を排除。
- 個別展示の仁川日付・後年長崎説明は原記録と同じcertaintyにしない。今回の編纂史料は9日交戦を記すが、展示記載を無断上書きしない。

## 9. Experimental substrate changes — 8-point record

1. **Historical case:** No82の特定訓令受領、外務省受信欄、仁川の二つの発電、東郷報告10日／発電11日、source明瞭さと拿捕Realityの隔たり。
2. **Lost meaning:** Round1 actor stanceだけではacknowledged payload・receipt annotation・local transmission・later public availability・assessment targetを別々に再読込できない。
3. **Proposed semantic:** Round2 envelope + sparse attested nodes/edges、payload付きactor_records、target付きassessments、12 lifecycle unknown slots、missing分類、documented-publication reference dates。時計原表記・地方・unknown instantを付加。
4. **Alternatives considered:** core RealityEvent化は伝聞を真実へ昇格、core BeliefAssessmentは現在system assessmentと歴史actorを混同、metadataだけでは参照検証とqueryが欠落、全段階templateは架空stageを生成。Round1を変更するより独立typed moduleを採用。
5. **Implementation:** round2/propagation.ts、round2.dataset.json、replay.ts。materializeは親hash照合後コピー追記。Round1schemaを内部の既存validatorへ渡し、Round2layerは独自検証。core変更なし。n-rosen-heldはunknown対象時間。
6. **Tests:** 11件の意味境界検証。mutationを拒否、receipt/actor scopeの不一致を拒否、certainty targetを要求、未検証UTCを拒否、後窓陸軍／後日公刊／同日順序の境界、partial core projectionの非昇格を検証。
7. **Replay:** source-content canonical patch→apply→save/load、41claimsの各source linkを照合、17nodeのtrace、8reconstructionのtrace、日別actor query、dataset/landscape親hash、5PDF magic/size/hashを確認。
8. **Legacy impact:** Round1 artifact不変、core schema/API不変。Round2 actor queryにinherited_round1_recordsを併載。関連legacy50件とRound1の6件を含め67件成功。projectionは依然partial、sidecarを捨てればknowledge意味は失われる。

extensionの語彙は実験段階。current_inference等は型で区別可能だが今回データで無理に各stageを埋めていない。source_asserts等は史料の記載形式であり、全てのnodeに観測実在を保証するタグではない。

## 10. Dataset additions

追加: sources9、claims23、evidence relations23、actors13、reconstructions4。合計: sources23、claims41、relations43、actors36、reconstructions8。

追加layer: nodes17、edges7、actor records6、scoped assessments10、reply lifecycle12、missing-evidence logs8、publication-reference entries3、保存PDF5。Round1 actor records5を継承。Round2の6recordsだけでactor知識を網羅したとはしない。

Source・Claim・actor scope・temporal role・transmission・epistemic act・evidence relation・reconstruction・unknown reason・provenanceをJSONとtraceから再読込可能。元dataset/landscapeをSHA-256指定。replay/materialized.dataset.jsonは導出copyであり元版の上書きではない。

## 11. Tests / replay / provenance validation

- `node --import tsx --test ground-core/__tests__/historical-reality-round2.test.ts ground-core/__tests__/historical-reality-round1.test.ts ground-core/__tests__/epistemic-core.test.ts ground-core/__tests__/belief-reconciliation.test.ts ground-core/__tests__/epistemic-gaps.test.ts ground-core/__tests__/reality-worldline.test.ts`: **67 pass / 0 fail**。
- `node_modules/.bin/tsc -p ground-core/tsconfig.json --pretty false`: exit0。
- `node --import tsx ground-core/experimental/historical-reality/round2/replay.ts`: 成功。
- Round1 dataset SHA256 `5bc32592aa80ee4742f8e01b09d4381dacc1ce080fb930772a7a1ea2b24c70c2`、landscape `40c3d8b4094e67359d5469c09fcf30dcba9479e3bb123401fb618d465021960f`を確認。
- canonical projection: historical RealityEvent0、RealityState0。source assertionsのみ。

検証は参照・保存・byte整合性と意味上の禁止境界。史料真正性・原本照合・歴史的命題の真実を認証するものではない。取得PDFの全頁読了、archive完全性、未発見文書不存在を検証したとは言わない。

## 12. Unresolved evidence

ロシア20/21日January電報の原暦・原承認・公刊1905/1906版対応、アレクセーエフの変更有無、長崎中継・保留・検閲の原命令、ローゼン受領・日本への正式提示・閲読、栗野受信50/53以外の確認、小村閲読・閣議共有、陸軍・海軍中央の当日認識、双方艦船日誌・当日通信原物、東京receipt、新聞原画像、時計標準が未確認。

missing_evidenceは「既知だが接続上利用不能」「探したが未取得」「現在根拠未到達」を分離。今回archive incomplete、lost document、actor left no record、evidence suggests absenceを主張する根拠は取得していない。absence_inferenceは全件false。

## 13. Candidate primitives becoming stable

**対象付きassessment、actor＋payload＋attested epistemic act、時刻role＋raw representation＋unknown標準、疎なevidence-backed propagation edge、source manifestation＋inspection level、理由付きmissing evidence**はRound1/2の異なる実例で必要性が安定してきた。

core昇格条件は未達。別Historical Reality事例で再現性、query安全性、対立source、改訂message identityを試す必要がある。Round2のnode/edgeは最低限の実験形で、一般ontologyの完成ではない。

## 14. Too immature to promote

実際のknowledge/理解を二値で判定するprimitive、組織全体knowledgeの自動集約、送信から受領への推定、非到達から無知／不存在への推定、完全chainの必須化、certainty単一数値、時計標準の常識補完、通信遅延の因果帰属、版・電報同一性の自動判定、公衆knowledge、全source独立性の自動scoreは未成熟。

特にreply possessed・reply handed・personal views・substance dispatchedを一つの「回答を知った」stateへ圧縮する設計は今回の資料で意味を失う。

## 15. Recommended Round 3 target

**ロシア回答の20/21 January原電報・承認・版と、長崎→ローゼンの中継／受領原記録の突合**を第一目標とする。1905/1906公刊版の特定頁を照合し、改訂authorityと実際の改訂を分離。接続不能な公開viewerを利用可能な正規閲覧・所蔵提供で確認する。未確認の遅延原因を結論にしない。

第二目標は**2月9日仁川情報→東京外務省の拿捕報告**のupstream電報を探し、海軍・外務省・内閣の受領欄／閲読／会議報告を一点ずつ接続すること。Round2窓を広げる前に、具体的な一messageのdispatch→receipt→readが原記録で追えるか検証する。

評価軸は、歴史物語の完成より**どの主体が、何というpayloadに、どのstageで接したことが証拠に残るか／残らないかをGROUNDが誤帰属なく保持できるか**を継続する。
