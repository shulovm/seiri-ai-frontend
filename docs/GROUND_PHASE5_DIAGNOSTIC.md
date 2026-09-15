# Phase5-A — Whole-Reality diagnostic

Baseline commit16b8672、branch ground/checkpoint-187、schema0.1.24。Runtime変更前に30原文・local/E2 dataset・source/schema hashを固定した。

重点10件のGold Ledger:252 semantic units、171 directed statement-target/source relations、119 temporal-unit/edge checks per run。3反復。主要Entity、identity distinctions、観測/主張、未知、競合、timeline、knowledge dependencies、選択肢、指示/実行/成果、資源/権限を手宣言。全typed goldをapply/save/reload/validate後にNL試行した。

Whole semantic recall0/756、critical recall0/735、relation0/513、provenance0/129、temporal0/357、lifecycle0/81、whole exact0/30。3 unit/runがpartial（RS002のrecord/observed count、RS029 causality marker）。それ以外は本文保存だけのTEXT-ONLY。Raw全文は到達と数えない。

旧重点oracle1/10と異なるscope。未知・対象・source・timeline/knowledge接続を失ったまま単一fieldが一致してもWhole到達ではない。Gold property vocabularyの不一致もあり、これは任意意味を理解できない率やcore表現不能の証明ではない。既存compositionで意味を示せる場合はcompositional判定が必要。

主原因F1 unit missing726critical trial、F2target relation missing6、F5source break3（unit主原因、相関反復を含む）。全171 relation/runとtemporal edgesも独立に欠落。F3/F4/F7/F8/F9/F10/F11/F12は、欠落と実際の誤統合/誤昇格/資源collapseを混同せず別の観測signalとして扱う。Identity split0はpresent対象が非常に少ない条件付き値でありidentity成功ではない。

最初のdivergence: decomposeRealityがheading/bulletをsemantic文として扱い、明示unknown section/timeline/entity registryを失う。その後domain predicateの未coverage、cross-unit target/source/time binding欠落が続く。Persistenceは誤った/不完全なunitを正しく保存するため変更しない。

初期annotation draftにseparator `---`をoptionsへ含める誤りとquote excerpt差があり、runtime変更前に修正。draft ledger/resultsも保存し、Gold252unitのpositiveを削除していない。正式diagnosticは修正済みGoldで再実行。

P5-B: section別の未知・timeline・decision scopeのunit coverage。
P5-C: scenario-wide explicit Entity/alias registry、曖昧referenceは保留。
P5-D: explicit statement source/targetとrelation。
P5-E: timeline graph、knowledgeとoccurrence timeを分離。
P5-F:残差/global consistency、unsupported推論を保留。

いずれも複数Scenarioで同じroot causeが観測された。body predicateをRS別field表へhardcodeしない。新core/type/schema/migrationなし。

[Baseline lock](/Users/macsaku/.codex/visualizations/2026/09/14/01a09d7e-7dd5-77b0-9d10-c304663e2928/GROUND-phase5/baseline-lock.json)
[Gold freeze](/Users/macsaku/.codex/visualizations/2026/09/14/01a09d7e-7dd5-77b0-9d10-c304663e2928/GROUND-phase5/gold-ledger-lock.json)
[Per-scenario breakdown](/Users/macsaku/.codex/visualizations/2026/09/14/01a09d7e-7dd5-77b0-9d10-c304663e2928/GROUND-phase5/diagnostic/per-scenario-breakdown.json)
[All unit/edge actuals](/Users/macsaku/.codex/visualizations/2026/09/14/01a09d7e-7dd5-77b0-9d10-c304663e2928/GROUND-phase5/diagnostic/results.json)
