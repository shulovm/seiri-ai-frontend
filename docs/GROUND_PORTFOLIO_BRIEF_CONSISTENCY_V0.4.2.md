# GROUND Portfolio Brief Consistency v0.4.2 — 修正記録

**日付:** 2026-06-20  
**前提:** [GROUND_MULTI_PROJECT_PORTFOLIO_BRIEF_V0.4.1.md](./GROUND_MULTI_PROJECT_PORTFOLIO_BRIEF_V0.4.1.md) で見つかった表示整合性問題への最小修正。

---

## 1. 調査結果

### primary 決定箇所

`ground-core/director/portfolio-director.ts` の `recommendPortfolioFromInput()`:

```typescript
const eligibleRanked = scored
  .filter(...)
  .sort(...);  // v0.4.1 以前: UUID localeCompare が最終 tie-break

const primaryScored = eligibleRanked[0] ?? allRanked[0];
```

### project_ranking 決定箇所

同ファイル内:

```typescript
const allRanked = [...scored].sort(...);  // v0.4.1 以前: スコアのみ、同点時は stable sort（入力順）

const projectRanking = allRanked.map((entry, index) => ({ rank: index + 1, ... }));
```

FLOW rank は `ground-core/studio/scoring.ts` の `buildRecommendedFlow()` が `portfolio.project_ranking` を rank 昇順で並べて生成。

### 不一致原因

| 処理 | v0.4.1 tie-break |
|------|------------------|
| primary (`eligibleRanked`) | UUID 辞書順昇順 |
| project_ranking (`allRanked`) | stable sort → `--projects` 引数順 |

同点 3 Project では primary=research（UUID `6c...` 最小）、FLOW rank 1=business（引数 1 番目）となり矛盾。

### DEFERRED 文言生成箇所

`portfolio-director.ts` の `buildDeferredRecommendations()`:

```typescript
message: `横断スコア ${entry.score} < primary ${primary.score} のため後回し`
```

同点でも `<` が出ていた。

### bottleneck / BLOCKED 調査

- `buildPortfolioBottleneck()` — eligible project の downstream_unlock 最大を選ぶ（同点時は入力順先頭）
- `brief-adapter.ts` — `portfolio_bottleneck` を `cross_project_bottlenecks` として常に付与
- `brief-formatters.ts` `mapBlockedItems()` — `at_risk_projects` + `cross_project_bottlenecks` を BLOCKED セクションにマージ、`status: "blocked"` 固定

open blocker がなくても `(blocked) — downstream 解放 1 件` と見える。**v0.4.2 では未修正**（Studio/Brief 表示責務のため次フェーズ候補）。

---

## 2. 実施した修正

### `portfolio-director.ts`

1. `ScoredProject` に `input_order`（`project_states` 配列 index）を追加
2. `comparePortfolioRank()` を導入 — スコア降順 → urgency 降順 → **input_order 昇順**
3. `eligibleRanked` と `allRanked` の両方で同一 comparator を使用
4. `buildDeferExplicitMessage()` — 同点時は `<` を使わない文言
5. `buildWhyNotReasons()` — 同点時に「portfolio 入力順により 1 位ではない」を追加

**変更なし:** scoring 式、Studio、Brief renderer、schema、CLI。

---

## 3. 修正後の挙動

### business, research, product 順

検証 project_id（例）:

- business: `60f38a3d-ff66-4928-a7dd-ead29ef9f8d7`
- research: `2a117b95-ff4a-45a1-b0fa-d4c66c5b9ec1`
- product: `b4c41f82-aa91-4a1a-9b59-699e76117fa2`

| 項目 | 結果 |
|------|------|
| **TODAY** | 無料配布型プロモーション検証 v0.1 — 検証場所の候補を3つ出す |
| **FLOW rank 1** | business（一致） |
| **DEFERRED** | research / product — 「横断スコアは primary と同点。portfolio 入力順により…」 |

### research, business, product 順

| 項目 | 結果 |
|------|------|
| **TODAY** | 脳とAI接続領域の研究テーマ整理 v0.1 — 関連分野を5つに分類する |
| **FLOW rank 1** | research（一致） |
| **DEFERRED** | business / product — 同点文言 |

### スコア差がある場合

FreeWater + business + research 混在では **FreeWater が primary**（スコア優先、既存 v0.4 テストも pass）。

---

## 4. recommend-portfolio JSON

同点 3 Project（business 先頭）:

- `primary_recommendation.project_id` = business
- `project_ranking[0].project_id` = business
- `cross_project_gap` confidence factor = 0（同点）
- `deferred_recommendations[].defer_reasons` — `defer_explicit` に同点文言

---

## 5. テスト

`ground-core/__tests__/portfolio-director.test.ts` に `Portfolio tie-break v0.4.2` スイート追加（5 件）:

1. 同点 → 入力順 tie-break
2. primary === project_ranking rank 1
3. 入力順変更 → primary 変更
4. スコア差 → スコア優先
5. DEFERRED 同点文言に `<` なし

```bash
npm run test:ground-core
# 250 tests / 35 suites / 全 pass
```

---

## 6. 残した課題（次フェーズ候補）

1. **BLOCKED / bottleneck 分離** — open blocker とチェーン先頭 bottleneck の表示ラベル分離
2. **RISKS observation_gap 独占** — 横断 Brief maxRisks=3
3. **tie-break の Brief 明示** — 「入力順 tie-break」理由を primary reasons に出す

---

## 関連

- v0.4.1 検証: [GROUND_MULTI_PROJECT_PORTFOLIO_BRIEF_V0.4.1.md](./GROUND_MULTI_PROJECT_PORTFOLIO_BRIEF_V0.4.1.md)
- 修正ファイル: `ground-core/director/portfolio-director.ts`
