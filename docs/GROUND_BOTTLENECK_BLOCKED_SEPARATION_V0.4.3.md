# GROUND Bottleneck / Blocked Separation v0.4.3 — 修正記録

**日付:** 2026-06-20  
**前提:** [GROUND_PORTFOLIO_BRIEF_CONSISTENCY_V0.4.2.md](./GROUND_PORTFOLIO_BRIEF_CONSISTENCY_V0.4.2.md) 完了後、横断 Brief で open blocker がないのに `(blocked) — downstream 解放` が BLOCKED に出る問題を修正。

---

## 1. 問題の背景

v0.4.1 / v0.4.2 の business / research / product 横断 Brief では:

```txt
BLOCKED
  無料配布型プロモーション検証 v0.1 (blocked) — downstream 解放 1 件
```

しかし ProjectState 上 `blockers: []` で、Portfolio `blocked_projects: []` でも BLOCKED に表示されていた。

GROUND では **言葉が状態を正しく表す** 必要がある。これは進行障害ではなく、チェーン先頭 action の **構造上の注目点（unlock）** である。

---

## 2. BLOCKED / bottleneck / unlock の違い

| 概念 | 意味 | データ源 |
|------|------|----------|
| **Open blocker** | 作業を止めている障害 | `ProjectState.blockers` (status=open)、Director `open_blockers` |
| **Portfolio bottleneck** | 横断Portfolio上の構造注目点 | `portfolio_bottleneck`（チェーン先頭 or blocker 関連） |
| **Downstream unlock** | この action 完了で後続が解放 | `downstream_unlock_count`、bottleneck reasons |

---

## 3. 調査した表示経路

```txt
portfolio-director.ts
  buildPortfolioBottleneck()
    ↓
brief-adapter.ts
  cross_project_bottlenecks[]  ← portfolio_bottleneck を常に 1 件付与
    ↓
brief-formatters.ts (v0.4.1 以前)
  mapBlockedItems()
    at_risk_projects + cross_project_bottlenecks を merge
    bottleneck に status: "blocked" を付与  ← 混同の原因
    ↓
brief-renderer.ts → StudioBrief.blocked_items
    ↓
studio-brief.ts formatStudioBriefText()
  BLOCKED セクション: `(blocked) — ${reason_summary}`
```

**Open blocker 経路（正しい BLOCKED）:**

```txt
studio/scoring.ts buildBlockedProjects()
  portfolio.blocked_projects + director.open_blockers
    ↓
brief-adapter.ts mapAtRiskProjects() → at_risk_projects
    ↓
mapBlockedItems() → blocked_items（health_status: blocked/stalled/paused）
```

---

## 4. 採用した修正案

**案C（最小版）:** 新セクション `FLOW NOTES` に bottleneck / unlock を分離。

- `mapBlockedItems()` — `at_risk_projects` のみ（open blocker / stalled / paused）
- `mapFlowNoteItems()` — `cross_project_bottlenecks` を `(unlock)` / `(flow_note)` / `(bottleneck)` として表示
- BLOCKED セクションから bottleneck を除去

案A（文言のみ）では BLOCKED セクション内に残るため不採用。案B もセクション名 `BLOCKED` が嘘のまま。

---

## 5. 実施した修正

| ファイル | 変更 |
|---------|------|
| `brief-types.ts` | `FlowNoteItem`, `flow_note_items`, `maxFlowNotes` |
| `brief-formatters.ts` | `mapFlowNoteItems()`, bottleneck を `mapBlockedItems` から除去 |
| `brief-renderer.ts` | `flow_note_items` 生成 |
| `studio-brief.ts` | `FLOW NOTES` セクション追加 |
| `__tests__/brief-flow-notes.test.ts` | 新規 4 件 |

**変更なし:** Portfolio scoring、Director、ProjectState schema、CLI。

---

## 6. 修正後の Brief 表示

### open blocker なし（business/research/product 横断）

```txt
BLOCKED
  (none)

FLOW NOTES
  無料配布型プロモーション検証 v0.1 (unlock) — 検証場所の候補を3つ出す — 後続actionを1件解放
```

### open blocker あり（既存 fixture）

`at_risk_projects` 由来の `(blocked) / high — open blocker「...」` は BLOCKED に従来通り表示。open blocker と bottleneck が同一 project の場合、FLOW NOTES からは重複除外。

---

## 7. テスト

```bash
npm run test:ground-core
# 254 tests / 36 suites / 全 pass
```

`brief-flow-notes.test.ts`:
- bottleneck が blocked_items に入らない
- unlock が `(unlock)` ラベル
- open blocker は blocked_items に残る
- multi-seed 横断 Brief で `(blocked) — downstream` が出ない

---

## 8. 残した課題

1. **RISKS observation_gap 独占** — 横断 Brief maxRisks=3（v0.4.1 から未着手）
2. **FLOW NOTES と FLOW セクションの関係** — unlock 情報が FLOW reason と一部重複しうる
3. **bottleneck に open blocker があるが at_risk に載らない edge case** — 現 fixture では director 経由で at_risk に載る

---

## 9. 次の候補（実装しない）

- FLOW ステップ reason に unlock を統合し FLOW NOTES を簡素化
- observation_gap の Brief 枠分散
- mixed portfolio（FreeWater + multi-seed）再検証

---

## 関連

- v0.4.1: [GROUND_MULTI_PROJECT_PORTFOLIO_BRIEF_V0.4.1.md](./GROUND_MULTI_PROJECT_PORTFOLIO_BRIEF_V0.4.1.md)
- v0.4.2: [GROUND_PORTFOLIO_BRIEF_CONSISTENCY_V0.4.2.md](./GROUND_PORTFOLIO_BRIEF_CONSISTENCY_V0.4.2.md)
