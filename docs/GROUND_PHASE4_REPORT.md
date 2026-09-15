# GROUND Phase 4 — Minimal Canonical Translation Path

限定translation経路を追加した。**第一engineering gateは未達であり、Phase 4の第一段階完了とは扱わない。** 型・schema・canonical contractを変更せず、失敗を検証artifactに残した。評価後のruntime調整は行っていない。

## 1. Existing ingestion routeの実態

CLI `reality-propose` → `proposeFromReality` → whole-input modality detector → Reality-specific draft、または legacy semantic propose → proposalのvalidation/dry-run → 明示的apply → file-store保存・reload。旧parserは汎用の意味分解器ではなく、Observation／Progress／Intention等へ振り分けるrule detectorだった。各段階のinput/output/loss/semantic decision/irreversible transformationは [route trace](/Users/macsaku/seiri-ai-frontend/docs/GROUND_PHASE4_ROUTE_TRACE.md) に記録した。

## 2. General NL → canonical pathが元々存在したか

**C: Legacy-purpose route、D: 汎用composition adapterがMissing。** Reality固有経路は一部存在したが、16境界を横断して自然文を既存canonical compositionへ分解・変換する経路はなかった。

## 3. 0/4,095の主要原因

一般adapterがなく、自然文がcoarse legacy label／本文記録に着地していた。情報が存在しても、typedなrole／time／resource／decision context等に到達しなかった。modality confidenceに依存するclarificationも到達を阻害した。source channelをlegacy adapterが`conversation`へ固定し、whole-inputの「決定」検索が未選択文のlegacy labelを変質させていた。これはcore representation failureの証拠ではない。

## 4. 変更したcomponent

- extraction inputの**内部metadata**にsourceを渡し、Reality入口とlegacy adapterを接続。
- `decision-lifecycle.ts`: ingestion専用lifecycle qualification。
- `canonical-translation.ts`: bounded sentence decomposition、qualification、既存Entity／State／EpistemicObservation／Evidence／Eventのcomposition、内部trace。
- Reality APIに明示的`canonical` extractorを追加。CLIで `--extractor canonical` を選べる。
- clarification policy、47件のchannel/lifecycle/composition/clarification検証、offline held-out runnerと事前固定gold fixtureを追加。

**既存API／CLIのdefaultはsemanticのまま。canonicalは明示的選択の限定経路であり、未達の経路をdefault化していない。** `ground-core propose`の用途も変えていない。

## 5. 変更しなかったcore component

`ground-core/types.ts`、全既存schema、canonical contracts、validation/apply/persistence意味、migration、既存historical Reality／proof／baselineを変更していない。開始時631ファイルのhash監査で差分は許可した5つのingestionファイルだけだった。新規ファイルの内部trace型はcanonical primitiveではない。既存open kind/valueによる記録propertyを使い、新closed-enum semantic contractを作っていない。

## 6. Source provenance修正

source channelとsource roleを分けた。channelは入力metadataからlegacy Observation保存まで保持。direct observer、reporter、reported observer、intermediary、record reviewer、sensor/documentを既存Entity参照とEpistemicObservation provenance、bounded meaning-record propertyへ分離する。

二次報告からAの直接Observationや検証済みworld conditionを生成しない。source channelからobserverを補わない。current holderは観測者と同一視しないが、**current-holder抽出の網羅的実装・評価は未完了**。報告recordのqualificationをworld Factに昇格しない。

## 7. Decision lifecycle修正

considered／candidate／preferred／intended／planned／selected／instructed／executing／completedを内部で区別。未選択と否定をpositive「決定」より先に判定。legacy labelを未選択の検討、推奨、予定、指示、実行開始・完了へ分けた。

指示から「未選択だった」とも「選択済みだった」とも導出しない。実行開始からOutcomeを導出しない。正式RealityDecisionDeclarationは自動生成しておらず、**native decision-space／option／snapshot compositionは残課題**。lifecycle propertyやopen-kind selection Eventを正式Decision declarationの成功と混同しない。

## 8. Clarification policy修正

unknown／未確定の選択をそのまま保持する。supported grammar外はexplicit unsupportedとして保持し、confidence低下だけでは質問しない。提案budget超過はworld assertionを止めたunsupported recordに戻す。

materialな未解決参照語だけを質問する。明示的「それはXを指す」補足で元のunitを捨てずに参照を解決できる。**一般的な省略・role ambiguity・対話継続は未完了**。resolverは意味を推測して補わない。

## 9. Development-set performance

E3の1,371 inputsを開発用として3回ずつ再投入。元のE3 typed oracleと判定規則を弱めず保持した。

- 4,113 initial trials／4,095 determinable trials。
- **strict E3 oracle arrival: 267 / 4,095 = 6.52%**（旧0%）。
- unnecessary clarification: 474 / 4,095 = 11.58%（旧78.61%）。
- source-channel collapse: 0 / 4,095（旧336件）。未applyケースでの保存成功を意味しない。
- unresolved legacy-decision promotion: 0（旧45件）。formal false promotion: 0。
- follow-up: 480 trials、strict oracle resolution: 0 / 480。

この結果は、generic meaning-recordを作れることと、E2のnative compositionへ完全到達することの差がまだ大きいことを示す。

## 10. Held-out trial数

16境界×20 variants = 320 primary cases、5 domain contexts、short/medium/long、順序変更、二次報告、uncertainty、distractors。必要clarificationの16対照ケースを追加。E3 inputの完全一致は0。

336 gold definitionsを**先にtyped patchで適用・保存・reload・validate**してlockし、その後に自然文を実行。3回ずつで1,008 initial trials（primary 960）、48 answer trials、合計1,056 trials。

**64独立主文×5相関context variants。320独立発見ではない。** 追加clarification controlsも一つの参照曖昧性formを異なるanswerで評価しており、一般対話能力の統計証明ではない。

## 11. Held-out canonical arrival

事前宣言のbounded structural oracle内では **705 / 960 = 73.44%**。目標90%未達。

primary内訳：705 Canonical success、180 Partial canonical success、60 Safe unresolved、15 Incorrect canonicalization。48 necessary-control trialsはClarification required。Technical failureは0。

**73.44%はheld-outの宣言したmeaning-record／role／occurrence／time distinction scopeへの到達であり、E3の完全native oracle同値6.52%とは直接比較できない。** World Factのtarget binding、native Resource/Permission/Decision、complete scene understandingを満たしたという数値ではない。free-bodyだけの保存は成功扱いしていない。

## 12. False promotion rate

0 / 960 = 0%。宣言した禁止検査：未選択からformal-selection、報告者からdirect observer、measurementからverified value、ownershipからPERMIT等。無制限のfalse promotionが0という保証ではない。正式Decision declarationは全ケース0。

## 13. False collapse rate

0 / 960 = 0%。明示した異なるrole/valueを同値とassertした場合を検査した。抽出欠落はarrival失敗へ分けた。無名対象の同一性・cross-document co-reference・current-holderは網羅していない。

## 14. False derivation rate

**15 / 960 = 1.56%**、目標1%を超過。5 contexts×3 runsの同一stable failure。

「出血が止まった。いつ処置が始まったかは記録がない。」の後半から`execution_started` Eventを生成した。lexical positiveを未知の時刻についての質問・記録欠如と区別できなかった。これはingestionのassertion/negation scope failure。後からoracleやruntimeを調整してこの評価結果を消していない。

## 15. Provenance accuracy

declared channel／source role／observation-kind checks: **945 / 960 = 98.44%**。role goldを置いたB03の60 trialsは60/60。channelだけしか指定されていないケースはchannelを評価している。

これは七つのsource roleすべての網羅精度ではない。sensor/value verifierのqualificationやkind、current holder、cross-sentence relayには残課題がある。

## 16. Option / decision accuracy

declared lifecycle／selected-plan／forbidden formal selection scope: **120 / 120 = 100%**。未選択を選択済みへ変えない検査は通った。

native formal Decisionの適切な生成・context snapshot・knowledge-at-decisionを完成したという精度ではない。E3 strict oracleの低到達がこの差を示す。

## 17. Unnecessary clarification rate

held-out primary: **0 / 960 = 0%**。unsupported意味はexplicit unresolved/partialとして残す。対してE3 broader corpusでは11.58%が残り、任意のRealityへの解決ではない。

## 18. Clarification resolution rate

追加necessary referent controls: **48 / 48 = 100%**。質問は48/48で必要と判定、missing clarification 0/48。元の自然文＋事前宣言answerでdirect-observer参照を保存した。

単一formの制御結果であり、E3の広いambiguity corpusのstrict resolutionは0/480。一般的clarification resolverは完成していない。

## 19. Experiment 2 regression

**954 / 954 assertions PASS**。32 controlled pairs×3 runs、210 typed composition calls。元のmanifest/harnessを新規隔離directoryで実行し、954 assertionsを変更していない。

## 20. Full existing test result

**3,870 tests: 3,868 PASS / 2 FAIL**。CLIのtsx IPCのsandbox制約は実行環境で解消してから全件実行した。

失敗はhistorical-reality-round5の675ファイル固定、round6の703ファイル固定。どちらもPhase4で変更を許可された`ground-core/cli.ts`の旧hashとの不一致でfailする。historical baseline、proof、検査を変更して隠していない。他のbehavioral testsはPASS。**full suite全PASSとは報告しない。** 631-fileの独立監査では許可したingestion差分のみでcore/schema/migrationの変更はない。

## 21. Typecheck

`node node_modules/typescript/bin/tsc -p ground-core/tsconfig.json` PASS。

## 22. Build

`npm run build` PASS。Vite 213 modules。ユーザーの既存frontend差分を保持したworkspaceで実行した。Phase4はfrontendを編集していない。

## 23. RS-001〜RS-030再評価

held-out後に固定本文を変更せず3回ずつ、30 scenarios／90 trialsで再投入。input alterations 0、source-channel failures 0、technical failures 0、clarifications 0、formal decisions 0。

重点10 scenariosについて、元のE3 focused typed goldを変更せず比較：

- RS-002: 581の記録人数、576の確認人数を分離。ただしunidentified identity property未到達。
- RS-004: 金額自体のnumeric記録はできても、main/secondary account bindingとtransfer restrictionのfocused oracle未到達。
- RS-013: `selection_completed=false`は保持。98受付表示／7off-display着金報告／実処理件数unknownのrole composition未到達。
- RS-014: 14:12現場呼びかけ／14:25公式公開のauthority/time binding未到達。
- RS-018: 20台、port custody、legal-owner verificationのfocused binding未到達。
- RS-022: 初回／再測定／真の汚染の分離がfocused oracle未到達。
- RS-024: 元の現場と救助後現場のcomplete relation未到達。
- RS-025: label/content identityのverified-equality boundaryがfocused oracle未到達。
- RS-029: `causality_verified=false`のfocused一項目は保持。これはScenario全体の成功ではない。
- RS-030: 人口／現地報告lower bound／mobile prediction／truck／cold-storage deadlineのrole binding未到達。

focused oracle全項目一致は1/10。全30のcomplete typed scene oracleはないため、**30件の全文保存を30件のsemantic arrivalとは数えない**。

## 24. 残ったstable failures

85/320 primary casesが3回とも非成功。未知・未検査の言い回し、verified Observation kind、所有／保管roleの語順、permission取消、evidence arrivalとknowledge時点、container五者の参照、aggregate countの対象、scene history、質問内のexecution lexical trigger。

加えて、native Decision/Resource/Permission adapter、knowledge-at-decision snapshot、target-world-Fact binding、current-holder extraction、support済みsentence内の未抽出relationの細粒度residual追跡が不十分。traceの`preserved`は抽出したgrammar unit/spanの保持であり、scene全体のcomplete understandingを保証しない。

## 25. 次に直すべきもの

最初にclauseごとのassertion/negation/unknown scopeを直し、記録欠如・質問からWorld Eventを生成しない。次にrole/target/timeをboundした既存E2 composition adapterを作る。Resource総量とavailability/allocation、native DecisionとInstruction、Permission validity、decision時点knowledgeをmeaning-record propertyだけで済ませない。

このheld-outを使った修正を行う場合、このsetは以後developmentとして扱い、**新たな未見gold setを先に固定して最終評価し直す**。今回の未達をpassとして消さない。全面的NLPやdomain名shortcutは追加しない。

## 26. 新primitiveが必要な証拠

**ない。** E2の954 assertionsは維持。今回のfailureは自然文decomposition／qualification／既存native adapterの未接続を示す。typed composition failureを新たに実証していない。primitive/schema/migration変更を保留する。

[Interactive evaluation Canvas](/Users/macsaku/.cursor/projects/Users-macsaku-seiri-ai-frontend/canvases/GROUND-phase4.canvas.tsx)で境界別結果、caseごとのrequired checks、RS比較、26項目を確認できる。

## Artifactと再実行

[全検証artifact](/Users/macsaku/.codex/visualizations/2026/09/14/01a09d7e-7dd5-77b0-9d10-c304663e2928/GROUND-phase4)にgold lock、typed oracle、proposal、persisted canonical、trace、required-check diff、全logs、constraint auditを保存した。

[Held-out gold fixture](/Users/macsaku/seiri-ai-frontend/ground-core/__tests__/fixtures/nl-phase4-heldout.json)と[offline runner](/Users/macsaku/seiri-ai-frontend/ground-core/__tests__/nl-heldout-evaluation.ts)はproduction経路からimportされない。

```sh
GROUND_PHASE4_OUTPUT_DIR=/private/tmp/ground-phase4-independent-replay node --import tsx ground-core/__tests__/nl-heldout-evaluation.ts
```

[限定API](/Users/macsaku/seiri-ai-frontend/ground-core/reality/propose.ts)は第三引数`"canonical"`で選択する。CLIは `reality-propose <project_id> --text <text> --extractor canonical`。Proposalは既存の明示的apply手順を使う。Gate A/B/C/D/E/Fは別commitに保存した。
