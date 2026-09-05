# GROUND Deep Work Mode Audit v0.4.10 — 調査＋最小設計

**調査日:** 2026-06-20  
**目的:** deep-work mode を type-aware にする前に、既存 ProjectState / scoring から deep-work 向き Action を判定できるか調査し、v0.4.11 の最小実装方針を決める。  
**前提:** v0.4.8 session focus、v0.4.9 session focus 本文表示完了。今回は **実装なし**。

関連: [GROUND_OPERATING_DOCTRINE_V0.2.md](./GROUND_OPERATING_DOCTRINE_V0.2.md), [GROUND_PORTFOLIO_MODE_SEMANTICS_V0.4.6.md](./GROUND_PORTFOLIO_MODE_SEMANTICS_V0.4.6.md), [GROUND_TYPE_AWARE_BRIEF_NARRATIVE_V0.4.9.md](./GROUND_TYPE_AWARE_BRIEF_NARRATIVE_V0.4.9.md)

---

## 1. Doctrine v0.2.2 との関係

| mode | 判断文脈（Doctrine） | v0.4.10 現状 |
|------|---------------------|--------------|
| **morning** | Portfolio 全体の穴・今日の主作業 | cross_project + urgency。session 以外の baseline |
| **session** | Human 明示 focus の作業文脈継続 | v0.4.8 focus bonus + v0.4.9 本文表示 ✅ |
| **deep-work** | 集中価値の高い Action を選び深く進める | **未分化** — 表示 truncate のみ |

**Principle 10:** deep-work も decision context を持つべきだが、現状は **Mode as mere formatting** に該当（Anti-pattern）。

---

## 2. `--type deep-work` の現在の経路

### 2.1 データフロー

```
CLI parseBriefType("deep-work")
  → cmdStudioBrief / cmdRecommendPortfolio
  → runStudioBriefPipeline({ brief_type: "deep-work" })
       ├─ rulePortfolioDirector.recommendPortfolio({ options: { brief_type: "deep-work" } })
       │     └─ applySessionFocus() → brief_type !== "session" → **no-op**
       │     └─ scoring 完全同一（morning と同 primary）
       ├─ ruleStudio.analyze()          … brief_type 未使用
       ├─ ruleNarrative.build()         … brief_type 未使用
       └─ renderStudioBrief({ brief_type: "deep-work" })
             └─ getSectionLimits("deep-work") のみ ★
  → formatStudioBriefText
       └─ headline: Narrative 上書き（session focus 条件なし → type 非依存）
```

### 2.2 Portfolio Director への影響

| `brief_type` | Director ロジック |
|--------------|-------------------|
| `morning` | baseline |
| `session` | `applySessionFocus` (+0.03 / +0.02) |
| `deep-work` | **変更なし**（session と同様に options は渡るが未使用） |

### 2.3 Renderer / `getSectionLimits("deep-work")`

| 設定 | morning | deep-work |
|------|---------|-----------|
| maxFlow | null | **1** |
| maxRisks | 3 | **1** |
| maxSecondary | 3 | 0 |
| includeDecisions / Growing / FlowNotes | true | false |
| filterFlowTimeBoxes | — | `["now", "session"]` |

### 2.4 `filterFlowTimeBoxes` の実効

`mapFlowSteps`（`brief-formatters.ts`）:

1. `allowedTimeBoxes` で filter
2. **0 件なら filter を無視して全 steps を使用**（フォールバック）
3. `maxCount` で truncate

Studio `buildRecommendedFlow` が付与する `time_box` は **`morning` / `afternoon` / `later`**（primary は `morning`）。`now` / `session` は **付与されない**。

**結論:** deep-work の filter は **実質無効**。`maxFlow=1` による **先頭 1 件 truncate のみ**。

### 2.5 Narrative / headline

- `buildHeadline("deep-work")` = `今集中: {action}（{project}）` — renderer では設定される
- CLI 出力は `applyNarrativePresentation` で **Narrative headline に上書き**
- mixed portfolio では「deep work が 3 件重なるため…」（morning と **同一** Narrative）

---

## 3. mixed portfolio 現状挙動（v0.4.8 / v0.4.9 同条件）

**状態:** business session-01 完了 / research・product 新規

| コマンド | TODAY primary | 備考 |
|----------|---------------|------|
| `--type morning` | research — 関連分野を5つに分類する | urgency 0.41 > business 0.40 |
| `--type session --focus-project business` | business — 配布する対象物と数量を決める | session focus +0.03 |
| `--type deep-work` | **research**（morning と同一） | 選定ロジック同一 |
| `recommend-portfolio --type deep-work` | **research** | JSON も morning 同等 |

**deep-work 表示差（primary 同一のまま）:**

| セクション | morning | deep-work |
|------------|---------|-----------|
| FLOW | 3 steps | **1 step**（rank 1 のみ） |
| RISKS | 3（observation_gap + untested + resource_overload） | **1**（observation_gap のみ） |
| DECISIONS / GROWING / FLOW NOTES | あり | なし |
| Headline | deep work 3 件警告 | **同左** |

**評価:** deep-work は「集中価値で選んでいる」ように **見えない**。Portfolio primary は morning と同じ research で、**表示だけ絞っている**。

---

## 4. deep-work 候補 signal 調査

### A. time_box

| レイヤ | time_box の有無 |
|--------|----------------|
| **`NextAction`（ProjectState）** | **なし** — `types.ts` に field 不在 |
| **ExperimentSeed** | **なし** — `initial_next_actions` は string 配列のみ |
| **Intake adapter** | **なし** — time_box を生成しない |
| **Studio `StudioFlowStep`** | **あり** — `buildRecommendedFlow` が **Portfolio rank から後付け** |

Studio 側の付与ルール（`studio/scoring.ts`）:

- ほぼ全 step の `intent` = **`deep_work`**（デフォルト）
- `time_box` = primary なら `morning`、それ以外 `morning`→`afternoon`→`later`
- rank ≥ 3 かつ非 field → `light_touch`

**判定:** ProjectState 上の Action 属性として **deep-work 判定に使えない**。Studio flow 用の **表示ラベル** に近い。

---

### B. effort / complexity

| 対象 | 結果 |
|------|------|
| `NextAction` | **field なし** |
| `Goal` | `priority: 1..5` のみ（Action 単位ではない） |
| Director scoring | effort / complexity **未使用** |
| Seeds | **未記載** |

**判定:** v0.4.11 で effort ベース deep-work をやるには **metadata 追加が必要**（案 C / E）。

---

### C. dependency / unlock

| 対象 | 結果 |
|------|------|
| `NextAction.depends_on_action_id` | **あり** — intake が chain 化 |
| `countDownstreamUnlocks()` | **あり** — `depends_on_action_id === actionId` の件数 |
| Director `scoreAction` | unlock > 0 → +0.05〜0.15 |
| Portfolio `computeCrossProjectScore` | unlock > 0 → +0.04〜0.16 相当 |
| FLOW NOTES（v0.4.3） | bottleneck / unlock 表示 |

**mixed portfolio の primary 候補（各 Project の current primary）:**

| Project | primary action | downstream_unlock |
|---------|----------------|-------------------|
| business | 配布する対象物と数量を決める | **1** |
| research | 関連分野を5つに分類する | **1** |
| product | 想定ユーザーを1人に絞る | **1** |

**判定:** signal は **存在するが今回 fixture では全員同点（1 件）**。unlock だけでは primary を **差別化できない**。ただし v0.4.11 の **軽い tie-break / 説明 reason** には使える。

---

### D. strategic value

| signal | 所在 | deep-work 向き |
|--------|------|----------------|
| `Goal.priority` | goals[] | Project 単位。全 seed で priority=1 |
| `sort_order` | next_actions[] | chain 位置。Director sort_order bonus あり |
| `cross_project_score` / urgency / momentum | Portfolio | morning baseline。mode 非依存 |
| `is_field_validation` | portfolio-scoring キーワード | business に加点。deep-work 専用ではない |
| `recommendation_score` | Director | project 内 primary の score |

**判定:** strategic value の **明示 field なし**。既存 score は morning 向け横断比較。**deep-work 専用解釈は未定義**。

---

### E. cognitive depth（タイトル推測）

| action 例 | 見え方 |
|-----------|--------|
| 関連分野を5つに分類する | 思考・構造化向き |
| 配布する対象物と数量を決める | 判断・設計向き |
| 想定ユーザーを1人に絞る | 判断向き |

**判定:** 日本語 title から深さを推測するだけの実装は **壊れやすい**（Doctrine 上も非推奨）。LLM なしで安定判定 **不可**。metadata（案 E）が必要。

---

## 5. 案 A〜E の評価

| 案 | 概要 | 評価 | v0.4.11 |
|----|------|------|---------|
| **A** | time_box / intent ベース | ProjectState に time_box **なし**。Studio intent は全員 `deep_work` になりがち | **metadata 整備後**（案 E とセット） |
| **B** | unlock / dependency ベース | 実装可能。mixed では **同点**。説明可能 reason を付けられる | **第二候補** — session focus と同型の小 bonus + reason |
| **C** | effort / complexity ベース | **field 不在** → schema / intake 変更 | v0.4.11 単独では **重い** |
| **D** | reason-based composite | 柔軟だが black-box 化リスク。unlock + field_validation + goal.priority 等 | **B+E の説明可能サブセット** なら可 |
| **E** | seed / action metadata 整備 | 最も Doctrine に合う。`action_intent` 等を **extensions 経由** で先行可能 | **第一候補（先行）** |

---

## 6. v0.4.11 推奨方針（2 段階）

### Phase 0 — metadata（案 E、schema 変更なし）

Intake / seed に Action 意図を載せ、**ProjectState.extensions** に保持（Principle 6: extensions before schema）。

例（設計案）:

```json
"extensions": {
  "intake": {
    "action_intents": {
      "関連分野を5つに分類する": "deep_work",
      "配布する対象物と数量を決める": "decision",
      "想定ユーザーを1人に絞る": "decision"
    }
  }
}
```

intent 候補: `quick_check` | `decision` | `design` | `deep_work` | `execution` | `validation`

### Phase 1 — deep-work mode bonus（案 A + B、session v0.4.8 パターン）

`applyDeepWorkFocus`（session の `applySessionFocus` と対称）:

| 条件 | 処理 |
|------|------|
| `brief_type === "deep-work"` のみ | bonus 適用 |
| `action_intent === "deep_work"`（extensions） | **+0.03** explicit deep-work intent |
| intent なし | unlock count 最大 among eligible に **+0.02** fallback（同点時は入力順 tie-break） |
| ineligible / blocked | bonus なし、reason 付き fallback |
| morning / session | **触らない** |

表示（v0.4.9 パターン）:

- `FocusItem.mode_context_note` = `deep work focus — explicit intent (+0.03)` 等
- session と **排他**（deep-work 時は session_focus なし）

**mixed portfolio 期待（metadata 追加後）:**

- research「分類する」= deep_work intent → deep-work primary が research のまま **理由付き**
- または business intent = decision → unlock + intent  composite で差が出る設計を fixture で検証

---

## 7. 今回実装しない理由

- unlock 同点・metadata 不在の状態で scoring だけ追加すると **効果が見えず信頼性を損なう**
- schema 変更前に **extensions + seed intent** を設計固定すべき
- session v0.4.8 の成功パターン（小 bonus + 明示 reason + 本文表示）を deep-work に **コピーする前に signal を確定** する

---

## 8. 残課題

| 課題 | 内容 |
|------|------|
| NextAction.time_box | schema 変更は後回し。extensions.intake.action_intents で代替 |
| Studio intent 全員 deep_work | flow 表示用。Portfolio deep-work 選定とは分離 |
| filterFlowTimeBoxes フォールバック | deep-work / session で filter が効いていない（v0.4.6 既知） |
| Narrative headline | deep-work でも morning 同一。intent 表示後に headline 最小修正 |
| cognitive depth 推測 | タイトル NLP は **採用しない** |

---

## 9. 次の候補（v0.4.12、未実装）

v0.4.11 で metadata 保存は完了 → [GROUND_ACTION_INTENT_METADATA_V0.4.11.md](./GROUND_ACTION_INTENT_METADATA_V0.4.11.md)

1. `applyDeepWorkFocus` + `deep_work_focus` reason kind
2. Brief 本文 `mode_context_note`（v0.4.9 再利用）
3. fixture: intent 差で deep-work primary が morning と **意図的に** 変わるケース
4. deep-work headline 最小修正（session v0.4.9 同型）

---

## 10. テスト

```
npm run test:ground-core
ℹ tests 272 | pass 272
```

コード変更なし（v0.4.10 時点）。

---

## 11. v0.4.12 deep-work focus（実装済み）

- `applyDeepWorkFocus` — deep-work mode のみ +0.03 intent / +0.02 unlock fallback
- 詳細: [GROUND_DEEP_WORK_FOCUS_PORTFOLIO_V0.4.12.md](./GROUND_DEEP_WORK_FOCUS_PORTFOLIO_V0.4.12.md)

---

## 12. 改訂履歴

| 版 | 日付 | 内容 |
|----|------|------|
| v0.4.11 | 2026-06-20 | action_intents metadata 実装（§11 参照）。deep-work bonus は v0.4.12 |
| v0.4.12 | 2026-06-21 | deep-work focus portfolio 実装 |
