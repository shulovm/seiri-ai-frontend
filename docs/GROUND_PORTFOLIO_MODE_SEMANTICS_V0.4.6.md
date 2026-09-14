# GROUND Portfolio Mode Semantics v0.4.6 — morning / session / deep-work 比較検証

**検証日:** 2026-06-20  
**目的:** 既存 `studio-brief --type morning|session|deep-work` の意味と挙動を比較し、Portfolio Brief におけるモード設計の判断材料を作る。  
**前提:** v0.4.5 Mixed Portfolio Reality Check 完了。今回はコード変更なし。

---

## 1. 使用 Project

| kind | project_id | state |
|------|------------|-------|
| business | `69b63f4d-09ab-4de0-90a5-f379cb2cfde8` | session-01 完了（observation + decision あり、momentum 0.35） |
| research | `0f82b4de-4565-4fb4-90c2-d107a223275f` | 新規（observation なし） |
| product | `48719641-4f2f-4157-819c-2534db9e7e8e` | 新規（observation なし） |

`--projects` 引数順: **business, research, product**（全 run で統一）

---

## 2. business session-01 の状態

| 項目 | 内容 |
|------|------|
| 完了 action | 検証場所の候補を3つ出す |
| decision | 初回検証場所の候補を3つに絞る |
| observation | 検証場所候補メモ |
| summary | 検証場所候補を3つに絞った。次は配布する対象物と数量を決める。 |
| 新 primary | 配布する対象物と数量を決める |
| patch | `ground-core/storage/session-patches/business-session-01-place.patch.json` |

v0.4.5 と同内容・同フロー（`build-complete-action-patch` → `patch`）。

---

## 3. business 単体 — type 比較

| 項目 | morning | session | deep-work |
|------|---------|---------|-----------|
| **TODAY** | 配布する対象物と数量を決める | 同左 | 同左 |
| **FLOW** | 1 step | 1 step | 1 step |
| **DECISIONS** | 3 件（business decisions 含む） | (none) | (none) |
| **GROWING** | momentum 0.35 | (none) | (none) |
| **FLOW NOTES** | unlock 1 件 | (none) | (none) |
| **RISKS** | untested_hypothesis × 2 | 同左 | untested_hypothesis × 1 |
| **BLOCKED** | (none) | (none) | (none) |
| **DEFERRED** | (none) | (none) | (none) |

**評価:** 単体 Project では primary 選定は type に依存せず同一。差分は **セクション表示件数・有無** のみ（morning が最も情報量多い）。

---

## 4. mixed portfolio — type 比較

| 項目 | morning | session | deep-work |
|------|---------|---------|-----------|
| **TODAY** | research — 関連分野を5つに分類する | **同左** | **同左** |
| **Headline（Narrative）** | deep work 3 件重なり警告 | **同左** | **同左** |
| **FLOW** | 3 steps（research → product → business） | 2 steps（research → product） | 1 step（research のみ） |
| **RISKS** | observation_gap(2) + untested + resource_overload | observation_gap(2) + untested | observation_gap(2) のみ |
| **GROWING** | business 0.35, research 0.25 | (none) | (none) |
| **DECISIONS** | business decisions × 3 | (none) | (none) |
| **FLOW NOTES** | research unlock | (none) | (none) |
| **DEFERRED** | product, business | 同左 | 同左 |
| **BLOCKED** | (none) | (none) | (none) |

**morning 評価:** research primary は v0.4.5 と同じ。observation_gap(2 projects)・GROWING・resource_overload が見え、Portfolio 全体の穴を拾う morning としては **説明可能**。business は DEFERRED だが FLOW rank 3 に残る。

**session 評価:** TODAY は morning と **完全同一**（research）。business 継続はされない。session 思想（直近進行 Project の next action 継続）とは **ズレがある**。type 差は FLOW 2 件・RISKS 2 件への truncate のみ。

**deep-work 評価:** TODAY も research で morning/session と同一。FLOW 1 件・RISKS 1 件とさらに絞られるが、**heavy action 選定ロジックは未実装**（Portfolio primary と同じ research が出る）。

---

## 5. recommend-portfolio JSON 確認

`recommend-portfolio` に **type 概念はない**（morning / session / deep-work 引数なし）。

| 項目 | 値 |
|------|-----|
| **primary_recommendation** | research — 関連分野を5つに分類する (score 0.66) |
| **project_ranking** | 1.research 0.66 / 2.product 0.66 / 3.business 0.66 |
| **business urgency** | 0.40（research/product 0.41 より低い → primary 落ち） |
| **business momentum** | 0.35（最高だが cross_project_score 同点 tie-break では入力順優先） |
| **observation_gap** | business は observation あり → gap 解消。research + product が gap 対象 |
| **resource_overload** | Brief RISKS に「3 project が同日 deep work 候補」として表示（morning のみ） |
| **defer 理由** | product, business — 「横断スコアは primary と同点。portfolio 入力順により…」 |
| **confidence** | 0.68（cross_project_gap = 0 で同点） |

---

## 6. mode ごとの思想仮説（ユーザー提示）

| mode | 想定役割 |
|------|----------|
| **morning** | Portfolio 全体 / 未観測・放置 Project / 穴 / 今日触る Project |
| **session** | 直近進行 Project / current_state.primary_next_action / 作業の流れ・継続 |
| **deep-work** | 集中価値の高い Action / heavy focus / 最も深く進める 1 件 |

---

## 7. 現行実装とのズレ

### 7.1 Primary 選定

- `runStudioBriefPipeline` は **brief_type を Portfolio Director に渡さない**。
- `rulePortfolioDirector.recommendPortfolio` の結果が TODAY / primary_focus の唯一のソース。
- **結論:** type は primary 選定に **効いていない**。

### 7.2 type が効く箇所

`brief-formatters.getSectionLimits(briefType)` による **表示テンプレート差** のみ:

| 設定 | morning | session | deep-work |
|------|---------|---------|-----------|
| maxFlow | null（全件） | 2 | 1 |
| maxRisks | 3 | 2 | 1 |
| includeDecisions / Growing / Blocked / FlowNotes | true | false | false |
| filterFlowTimeBoxes | — | session, now | now, session |

`mapFlowSteps` は filter で 0 件になると **フィルタを無視して全 steps を使う**（フォールバック）。今回の flow steps は `morning/deep_work`, `afternoon/deep_work` 等で `session`/`now` が無いため、**time_box フィルタは実質未適用**。truncate は maxFlow のみ。

### 7.3 Headline

- `brief-formatters.buildHeadline(briefType, primary)` は type 別文言を持つ（例: session =「次の 2 時間: …」）。
- しかし CLI 表示は `applyNarrativePresentation` で **narrative-rules の headline に上書き**される。
- **結論:** テキスト出力の headline は type に **依存しない**（deep work 警告等の Portfolio 横断 Narrative が常に使われる）。

### 7.4 session 継続性

- `current_state` / `updated_at` / momentum を session type が特別扱いするロジックは **存在しない**。
- business を 1 セッション進めても mixed session brief では research が primary のまま。

### 7.5 表示バグ（記録のみ・今回修正しない）

- Narrative footer が session/deep-work でも「横断フローは **3** ステップ」と morning 相当の全文を出す場合がある（FLOW セクション件数と不一致）。`buildSummaryText` / narrative が type-aware でない可能性。

---

## 8. 修正判断（A〜E）

**選択: E（まだ調査のみでよい）＋ B を次フェーズの第一候補として明記**

| 選択肢 | 判断 |
|--------|------|
| A. morning として自然なので修正不要 | morning 単体では research primary は **morning 思想と整合**しうる。ただし type 横断で同一 primary なので「morning だけ正しい」とは言えない |
| B. session に継続性を持たせるべき | **最有力の次改善**。現状 session は morning の truncate 版に過ぎない |
| C. deep-work に別ロジック | 将来必要。現状は maxFlow=1 の truncate のみで heavy 選定なし |
| D. Doctrine 更新が先 | mode 定義（morning vs session vs deep-work）を Constitution / Studio ドキュメントに明文化してから実装した方がよい |
| E. 調査のみ | **今回はここ**。v0.4.6 の目的（挙動比較・判断材料）は達成 |

**v0.4.5 問題（business DEFERRED / research primary）について:**

- スコア修正だけでは session 思想は満たせない（type が primary に効いていないため）。
- morning としては observation_gap 優先で research が primary になるのは **一貫した説明**が可能。
- session として business 継続を期待するなら、**type 別 Director 入力または Portfolio スコア重み**が必要（実装は次フェーズ）。

---

## 9. 次に修正するならどこか（実装はしない）

1. **Portfolio Director:** `brief_type` を受け取り、session では `updated_at` / momentum / 直近完了 action の Project にボーナス。
2. **Studio Brief pipeline:** type 別 headline を Narrative 上書き前に使うか、Narrative 自体を type-aware に。
3. **FLOW time_box filter:** session/deep-work で `morning`/`afternoon`/`deep_work` intent をマッピングするか、フォールバックを見直す。
4. **Doctrine:** `docs/GROUND_STUDIO_V0.5_CONSTITUTION.md` 等に mode 定義を追記。
5. **recommend-portfolio:** type 別 JSON が必要なら CLI 拡張（今回スコープ外）。

---

## 10. 今回は修正しない理由

- 依頼範囲は **既存 type の比較検証のみ**。
- type 差が薄いことが判明した時点で、スコア修正より **mode 設計・Doctrine 整理が先**。
- business vs research の決め打ちを避け、判断材料を docs に残すことが成功条件。

---

## 11. 実行コマンド（参考）

```bash
npm run ground-core -- intake --file ground-core/examples/experiment-seeds/business-sample.json
npm run ground-core -- intake --file ground-core/examples/experiment-seeds/research-sample.json
npm run ground-core -- intake --file ground-core/examples/experiment-seeds/product-sample.json

npm run ground-core -- build-complete-action-patch <business_id> --action <action_id> \
  --decision-title "初回検証場所の候補を3つに絞る" \
  --decision-rationale "受取率・怪しさ・導線の違いを比較しやすく、100本規模の小規模テストに向いているため。" \
  --observation-title "検証場所候補メモ" \
  --observation-body "..." \
  --summary "検証場所候補を3つに絞った。次は配布する対象物と数量を決める。" \
  --out ground-core/storage/session-patches/business-session-01-place.patch.json

npm run ground-core -- patch <business_id> --file ground-core/storage/session-patches/business-session-01-place.patch.json

npm run ground-core -- studio-brief --projects <id> --type morning|session|deep-work
npm run ground-core -- studio-brief --projects <biz>,<res>,<prod> --type morning|session|deep-work
npm run ground-core -- recommend-portfolio --projects <biz>,<res>,<prod> --format json

npm run test:ground-core
```

---

## 12. テスト結果

```
ℹ tests 258 | pass 258 | fail 0
```

コード変更なし。既存 GROUND 本体への影響なし。
