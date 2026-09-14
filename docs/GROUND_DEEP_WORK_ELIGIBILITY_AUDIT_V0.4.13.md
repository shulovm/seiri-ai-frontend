# GROUND Deep Work Eligibility Audit v0.4.13

**調査日:** 2026-06-21  
**目的:** deep-work mode が non-primary の `deep_work` intent をどこまで見てよいか調査・設計する。**実装なし。**  
**前提:** [GROUND_DEEP_WORK_FOCUS_PORTFOLIO_V0.4.12.md](./GROUND_DEEP_WORK_FOCUS_PORTFOLIO_V0.4.12.md)、[GROUND_ACTION_INTENT_METADATA_V0.4.11.md](./GROUND_ACTION_INTENT_METADATA_V0.4.11.md)

---

## 1. v0.4.12 との関係

v0.4.12 の `applyDeepWorkFocus()` は **Portfolio Director が既に選んだ primary action 1 件** に対してのみ `getActionIntent(state, primaryActionId)` を呼ぶ。

```ts
// portfolio-director.ts L261-262
const primaryActionId = entry.context.primary.entity_id;
const intent = getActionIntent(entry.context.state, primaryActionId);
```

つまり現状の deep-work eligible 範囲は **「Project ごとの Director primary」= 実質 primary action 限定** である。non-primary の `action_intents` は extensions に保存されているが selection / Brief には未使用。

---

## 2. 用語定義

| 用語 | 定義（GROUND 現状） |
|------|---------------------|
| **primary action** | `current_state.primary_next_action_id` が指す Action。Intake 時は `initial_next_actions[0]`。Director は `matches_current_primary` で +0.35。 |
| **Director primary** | `ruleDirector` が `eligible_for_primary === true` の中から最高スコアで選ぶ 1 件。通常は chain 先頭の eligible action。Portfolio はこれを **project 代表** として使う。 |
| **eligible action** | `isDependencyReady(action)` が true — `depends_on_action_id` が null、または依存 Action が `status === "done"`。`eligible_for_primary` と同義。 |
| **downstream action** | `depends_on_action_id === 某 action.id` の Action。`countDownstreamUnlocks()` で件数化。primary 完了で **解放候補** になる。 |
| **blocked / ineligible** | 依存未完了（`dependency_blocked`）、または open blocker 等で着手不可。Director primary になれない。 |

### eligibility 判定の実装経路

```
scoreAction() → eligible_for_primary = dependencyReady
ruleDirector.pickRecommendations() → eligible のみから primary 選択
portfolio-scoring.buildProjectScoreContext() → report.primary, eligible, downstream_unlock_count
applyDeepWorkFocus() → primary.entity_id の intent のみ参照
```

**Portfolio Director は primary 以外の next_action を走査しない。** alternatives は Director report にあるが Portfolio scoring / deep-work focus には未使用。

---

## 3. deep_work intent が primary にある場合（research sample）

### 状態

| 項目 | 値 |
|------|-----|
| primary | index 0「関連分野を5つに分類する」 |
| intent | `deep_work` |
| depends_on | なし（chain 先頭） |
| eligible | はい |

### 検証（2026-06-21）

```bash
npm run ground-core -- studio-brief --projects <research_id> --type deep-work
```

```
TODAY — 関連分野を5つに分類する
deep-work focus — 集中作業向きのAction intentが指定されています (+0.03)
```

**結論:** v0.4.12 の設計と完全に整合。State first（現在地 = chain 先頭）を守りつつ集中価値を反映できる **安全なケース**。

---

## 4. deep_work intent が non-primary にある場合（product sample）

### 状態

| index | title | intent | depends_on | eligible（fresh intake） |
|-------|-------|--------|------------|-------------------------|
| 0 | 想定ユーザーを1人に絞る | decision | — | **はい（primary）** |
| 1 | 最初の入力例を3つ作る | design | index 0 | いいえ |
| 2 | 出力される現在地の形式を決める | design | index 1 | いいえ |
| 3 | 出力される次アクションの形式を決める | design | index 2 | いいえ |
| **4** | **1画面フローを文章で描く** | **deep_work** | index 3 | **いいえ** |
| 5–7 | … | … | linear chain | いいえ |

Intake は `initial_next_actions` を **線形依存チェーン** で生成する（`create-project-from-seed.ts` L58-60）。index 4 は index 0–3 完了前は **構造的に ineligible**。

### 検証（2026-06-21）

```bash
npm run ground-core -- studio-brief --projects <product_id> --type deep-work
```

```
TODAY — 想定ユーザーを1人に絞る
deep-work focus — downstream unlock fallback (+0.02)
```

- `deep_work` intent bonus（+0.03）は **付かない**（primary は decision）
- unlock fallback（+0.02）は付く（primary が downstream 1 件解放）
- **index 4 の deep_work は Brief に一切表示されない**（FLOW NOTES も空）

### mixed portfolio

```bash
npm run ground-core -- studio-brief --projects <business>,<research>,<product> --type deep-work
```

- primary: **research**（primary deep_work +0.03）
- product の index 4 deep_work: **不可視**

### 飛び級で index 4 を primary にした場合の問題

| 問題 | 内容 |
|------|------|
| State first 違反 | `primary_next_action_id` は index 0 のままなのに Brief が index 4 を推す |
| 依存破壊 | index 1–3 の設計成果なしにフロー設計へ |
| Brief must lead to action の曖昧化 | 「今やるべき」と「深くやりたい」が矛盾 |
| Human remains owner の侵害 | 順序判断を OS が暗黙に上書き |

**結論:** non-primary deep_work を **直接 primary 化してはならない**（案 B は非推奨）。

---

## 5. 案 A〜E の評価

| 案 | 概要 | 評価 | v0.4.14 |
|----|------|------|---------|
| **A** | primary action の intent のみ deep-work focus 対象 | **安全。現状維持。** State first / Doctrine Principle 1, 10 に合致 | **採用（selection）** |
| **B** | eligible non-primary も bonus 対象 | **非推奨。** chain 飛び級・primary 意味の弱化 | 採用しない |
| **C** | non-primary deep_work を FLOW NOTES に表示 | **推奨第二候補。** primary は守りつつ候補を可視化 | **採用（visibility）** |
| **D** | DEEP WORK CANDIDATES 新セクション | 分かりやすいが Brief 肥大・新セクション | 今回は見送り |
| **E** | 記録のみ | 安全だが product deep_work が活きないまま | A+C で E を超える |

### 案 C の表示例（v0.4.14 候補）

```
FLOW NOTES
  product — 後続に deep-work 候補「1画面フローを文章で描く」があります（index 4、前提 3 件完了後）
```

データソース: `extensions.intake.action_intents` + `next_actions` 依存グラフ。  
**eligible でなくても**「後続候補」として出せる（飛び級しない）。

---

## 6. 推奨する v0.4.14 方針

### 第一候補: 案 A 維持（selection）

- `applyDeepWorkFocus` は **Director primary の action_id のみ** intent 参照
- unlock fallback（+0.02）も現状維持
- morning / session 無変更

### 第二候補: 案 C 部分実装（visibility only）

deep-work mode のみ:

1. `extensions.intake.action_intents` から `intent === "deep_work"` を列挙
2. **Director primary と異なる** action を「後続 deep-work 候補」として収集
3. `mapFlowNoteItems` 拡張、または deep-work 専用 note kind（`deep_work_candidate`）で FLOW NOTES に追加
4. **Portfolio score / primary には影響させない**

### 採用しない

- 案 B: non-primary を bonus / primary 化
- 案 D: 新セクション（v0.4 系では重い）
- title 推測・LLM 分類

### 境界条件

| 条件 | 扱い |
|------|------|
| primary === deep_work intent | +0.03 bonus（現状） |
| non-primary, ineligible, deep_work intent | FLOW NOTES「後続候補」（v0.4.14） |
| non-primary, eligible, deep_work intent | **それでも primary 飛び級しない。** chain 順で Director が primary になるまで待つ。eligible になった時点で自然に primary + bonus |
| ineligible project | bonus なし（v0.4.12 既存） |

---

## 7. 今回実装しない理由

- 調査・設計フェーズ。scoring 変更は Doctrine 上の境界（State first）に触れる
- product sample が示す問題は **selection ではなく visibility** の問題
- 案 C は Brief 表示のみで済み、schema / Portfolio 変更が最小

---

## 8. 残課題

| 課題 | 内容 |
|------|------|
| FLOW NOTES 空振り | 現状 `mapFlowNoteItems` は `cross_project_bottlenecks` のみ。deep_work 後続は未接続 |
| Studio FLOW intent | `rule-studio` の `deep_work` intent は time_box ベースで `action_intents` と無関係 |
| 非線形依存 | 将来 `depends_on` が分岐した場合の「後続」定義要再検討 |
| index 4 が eligible になった後 | 追加実装不要 — Director primary が切り替われば +0.03 が自然適用 |

---

## 9. 検証ログ

```
npm run test:ground-core
ℹ tests 291 | pass 291
```

コード変更なし。

| ケース | 結果 |
|--------|------|
| research solo deep-work | primary deep_work、+0.03 reason ✓ |
| product solo deep-work | primary index 0、fallback +0.02、index 4 不可視 |
| mixed deep-work | research primary、product deep_work 不可視 |

---

## 10. v0.4.14 実装済み

案 C（FLOW NOTES visibility）を実装。詳細: [GROUND_DEEP_WORK_CANDIDATE_FLOW_NOTES_V0.4.14.md](./GROUND_DEEP_WORK_CANDIDATE_FLOW_NOTES_V0.4.14.md)

---

## 11. 改訂履歴

| 版 | 日付 | 内容 |
|----|------|------|
| v0.4.13 | 2026-06-21 | deep-work eligible 範囲調査、v0.4.14 方針（A 維持 + C visibility） |
| v0.4.14 | 2026-06-21 | deep_work_candidate FLOW NOTES 実装 |
