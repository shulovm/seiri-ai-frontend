# GROUND Deep Work Focus Portfolio v0.4.12

**実装日:** 2026-06-21  
**目的:** `--type deep-work` のときだけ、v0.4.11 の `extensions.intake.action_intents` を使い Portfolio selection に集中作業向けの小さな判断文脈を加える。  
**前提:** [GROUND_DEEP_WORK_MODE_AUDIT_V0.4.10.md](./GROUND_DEEP_WORK_MODE_AUDIT_V0.4.10.md)、[GROUND_ACTION_INTENT_METADATA_V0.4.11.md](./GROUND_ACTION_INTENT_METADATA_V0.4.11.md)

---

## 1. v0.4.10 / v0.4.11 との関係

| 版 | 内容 |
|----|------|
| v0.4.10 | deep-work は primary に影響せず FLOW truncate のみ |
| v0.4.11 | `action_intents` を extensions に保存（selection 未使用） |
| **v0.4.12** | deep-work mode のみ `applyDeepWorkFocus` で bonus + reason |

---

## 2. deep-work focus 設計

v0.4.8 session focus と同型の **小さな explainable bonus**。

```ts
applyDeepWorkFocus(scored, input)
// options.brief_type === "deep-work" のみ
```

優先順位:

1. `action_intent === "deep_work"` on eligible primary → **+0.03**
2. eligible かつ intent bonus なしの中で downstream unlock 最大 → **+0.02** fallback
3. 既存 cross-project score

---

## 3. action_intent === deep_work

- `getActionIntent(state, primaryActionId)` で参照
- eligible project のみ bonus
- reason kind: `deep_work_focus`
- message: `action intent deep_work (+0.03)`

---

## 4. unlock fallback

- deep_work intent が **primary にない** eligible project 群の中で unlock 最大に +0.02
- intent がある project は fallback 対象外（intent 優先）
- message: `downstream unlock fallback (+0.02)`
- unlock は deep-work の本質シグナルではない → second-best

---

## 5. morning / session を変えない理由

Doctrine Principle 10:

- **morning** = 全体の穴・緊急度
- **session** = 人間の作業文脈（`--focus-project`）
- **deep-work** = 集中価値

`applyDeepWorkFocus` は `brief_type === "deep-work"` のときのみ実行。`applySessionFocus` は変更なし。

---

## 6. Brief 本文への reason 表示

v0.4.9 session focus パターン再利用:

- `formatDeepWorkFocusNote()` → `primary_focus.mode_context_note`
- TODAY 直下に `deep-work focus — 集中作業向きのAction intentが指定されています (+0.03)`
- deep-work + note あり時 headline: `Deep Work Brief — 集中価値の高いActionを優先`

---

## 7. blocked / ineligible

- deep_work intent があっても `eligible === false` → bonus なし
- reason: `deep_work intent があるが eligible ではないため bonus なし`（weight 0、primary には通常出ない）
- 無理に primary に復活させない

---

## 8. mixed portfolio 検証

### 未 patch（business, research, product）

| mode | primary | note |
|------|---------|------|
| morning | business | deep_work_focus なし |
| deep-work | research | deep_work intent +0.03 |

### session-01 後（patched business）

| mode | primary | note |
|------|---------|------|
| morning | research | 従来維持 |
| session + focus business | business | session_focus のみ |
| deep-work | research | deep_work_focus 表示（順位は morning 同様でも reason 追加） |

---

## 9. tests

`portfolio-director.test.ts` — `Deep work focus portfolio v0.4.12`（7 tests）  
`studio-brief-deep-work-focus.test.ts`（5 tests）

```
ℹ tests 291 | pass 291
```

---

## 10. 残課題

| 課題 | 内容 |
|------|------|
| effort / time_box | schema 未追加。intent のみ |
| product deep_work | primary が index 0 のため deep_work bonus は別 action |
| filterFlowTimeBoxes | deep-work flow 表示フォールバック（v0.4.6 既知） |
| Narrative headline | narrative-builder は未変更。display headline のみ最小修正 |

---

## 11. v0.4.13 eligibility 調査

non-primary `deep_work` intent の扱いを調査。**selection は primary のみ維持**、後続候補は FLOW NOTES 表示が安全（v0.4.14 候補）。

詳細: [GROUND_DEEP_WORK_ELIGIBILITY_AUDIT_V0.4.13.md](./GROUND_DEEP_WORK_ELIGIBILITY_AUDIT_V0.4.13.md)

---

## 12. 改訂履歴

| 版 | 日付 | 内容 |
|----|------|------|
| v0.4.12 | 2026-06-21 | applyDeepWorkFocus + deep_work_focus reason + Brief 表示 |
| v0.4.13 | 2026-06-21 | non-primary deep_work eligibility 調査（§11 参照） |
| v0.4.14 | 2026-06-21 | deep_work_candidate FLOW NOTES（[v0.4.14 doc](./GROUND_DEEP_WORK_CANDIDATE_FLOW_NOTES_V0.4.14.md)） |
