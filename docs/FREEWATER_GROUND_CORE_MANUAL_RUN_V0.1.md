# FreeWater — GROUND Core 実戦検証ログ（Phase D.5）

> **目的**: 実プロジェクト FreeWater を ProjectState 化し、ビジネス/現場系プロジェクトでの schema 適合性を検証する。  
> **日付**: 2026-06-07

---

## 1. 作成した FreeWater project_id

```
28d83a68-2064-43d7-94cb-72656b9006de
```

```bash
npm run ground-core -- init --title "FreeWater"
```

保存先: `ground-core/storage/projects/28d83a68-2064-43d7-94cb-72656b9006de.json`（gitignore 済み）

---

## 2. 作成した patch ファイル

**パス**: `ground-core/examples/freewater-phase0.patch.json`

```bash
npm run ground-core -- patch 28d83a68-2064-43d7-94cb-72656b9006de \
  --file ground-core/examples/freewater-phase0.patch.json
```

### patch 概要（15 operations）

| # | entity | 内容 |
|---|--------|------|
| 1 | project | summary（水インフラ実験） |
| 2 | goal | Phase0 現場検証 |
| 3 | current_state | phase0_manual_test / confidence 0.8 |
| 4–5 | blocker ×2 | 配布場所未定 / 現場反応未知 |
| 6–9 | next_action ×4 | 場所決定 → 準備 → 配布+メモ → Go判断 |
| 10–12 | decision ×3 | 現場感覚優先 / QRなし / 予算上限 |
| 13–15 | hypothesis ×3 | 48本検証 / 統計より感覚 / Phase0.5 移行条件 |

**補足**: next_action 1・3 は `blocker_id` で対応 Blocker にリンク済み（schema 上の関係を明示）。

---

## 3. patch 適用結果

```
project_id: 28d83a68-2064-43d7-94cb-72656b9006de
updated_at: 2026-06-07T03:32:02.596Z
```

---

## 4. show 結果の要約

| 要素 | 件数 | 要点 |
|------|------|------|
| **Project** | 1 | FreeWater / active / 水インフラ実験 summary |
| **Goal** | 1 | Phase0 現場検証（24〜50本） |
| **Current State** | 1 | phase: `phase0_manual_test` / confidence: 0.8 / 次は現場配布+5分メモ |
| **Blockers** | 2 | 場所未定（high）/ 反応未知（medium） |
| **Next Actions** | 4 | sort_order 0–3 の実行シーケンス |
| **Decisions** | 3 | 現場感覚 / QRなし / 予算 3千〜1.5万 |
| **Hypotheses** | 3 | 48本検証・感覚優先・Phase0.5 条件 |

確認:

```bash
npm run ground-core -- show 28d83a68-2064-43d7-94cb-72656b9006de
npm run ground-core -- list
```

現在 GROUND Core 上の Project 一覧:

- FreeWater (`28d83a68-...`)
- GROUND Core (`34092589-...`)

---

## 5. schema 上、表現しづらかった点

GROUND Core 自身（Phase D）に加え、**現場・ビジネス系**で感じた friction:

### 5.1 Phase D と共通

- init → show → 大きな patch のブートストラップ手順
- UUID / ボイラープレートの手書き
- 「今の一手」の明示が sort_order 依存

### 5.2 FreeWater 固有

1. **現場メモ（5分メモ）を置く場所がない**  
   受け取り率・怪しさ・声かけは `next_action.description` に書いたが、**配布後の観測結果**を構造化して保存する entity がない。Hypothesis の evidence に入れるのは時系列的に不自然。

2. **Go / Stop / 修正の判断フレーム**  
   翌日の判断は next_action として表現したが、**判断結果**（Go/Stop/修正）を記録する標準 field がない。Decision status や Project status では粒度が合わない。

3. **予算（3,000〜1.5万円）**  
   Decision の rationale に書くしかない。`budget_min` / `budget_max` や `decision.cost_impact` がない。

4. **場所（Location）**  
   Blocker の title/description に押し込んだ。住所・許可状態・候補リストを持てない。

5. **Phase ロードマップ（Phase0 → Phase0.5 → …）**  
   単一 Goal + phase 文字列 + Hypothesis で代用。将来 phase を subgoal 化するか、Goal Graph が必要になりそう。

6. **物理リソース（水2ケース・看板）**  
   Inventory / Asset entity がなく、next_action の description のみ。

7. **定性的 KPI と定量的 KPI の分離**  
   「続けたい感覚」は qualitative、「受け取り率」は quantitative。Hypothesis evidence 配列は両方入れられるが、**観測ログ**としては型が弱い。

8. **複数 Blocker と Action チェーン**  
   4 ステップの next_action シーケンスは sort_order で表現できた。ただし **依存関係**（action 3 は action 1,2 完了後）を schema で明示できない。

9. **Phase0.5 の条件**  
   Hypothesis に「続けたいと思えたら Phase0.5」は書けるが、**移行トリガー**として機械可読な link（goal.parent や edge）がまだない。

---

## 6. v0.1.1 に追加すべき候補

Phase D の候補に加え、FreeWater 検証で優先度が上がったもの:

| 優先度 | 候補 | 根拠（FreeWater） |
|--------|------|-------------------|
| **高** | `observation` entity（現場メモ・5分ログ） | 配布後の qualitative/quantitative 記録 |
| **高** | `judgment` または `next_action.outcome` enum（go/stop/revise） | 翌日 Go 判断の構造化 |
| **高** | bootstrap / template patch | 2 件目以降も init+patch が重い |
| **中** | `blocker.location` または `location` サブオブジェクト | 配布場所の候補・確定 |
| **中** | `decision.budget_impact` または `project.budget_range` | 予算 Decision の構造化 |
| **中** | `next_action.depends_on_action_id` | 4 ステップチェーンの依存 |
| **中** | `current_state.primary_next_action_id` | 今やる 1 件の明示 |
| **低** | Goal 階層で Phase0 / Phase0.5 | ロードマップ表現 |
| **低** | `asset` / `resource` entity | 水・看板など物理準備 |

**v0.1.1 でまだやらない**: LLM 抽出、Web UI、PostgreSQL、GROUND 本体連携、Router。

---

## 7. テスト実行結果

```bash
npm run test:ground-core
```

**27 tests, 0 fail**

---

## 8. 次の手動運用

Phase0 現場配布後、以下を patch で更新する想定:

1. next_action 1–3 を `done` に status_change
2. observation（将来 entity）相当を extensions または hypothesis evidence に暫定記録
3. Go/Stop/修正を decision または project status で反映
4. Blocker「現場反応が未知」を `resolved` または `mitigated`

---

## 関連

- [GROUND_CORE_MANUAL_RUN_V0.1.md](./GROUND_CORE_MANUAL_RUN_V0.1.md) — GROUND Core 自身の Phase D
- [GROUND_CORE_CLI_V0.1.md](./GROUND_CORE_CLI_V0.1.md)
- Patch: `ground-core/examples/freewater-phase0.patch.json`
