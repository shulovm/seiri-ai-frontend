# GROUND Action Intent Metadata v0.4.11

**実装日:** 2026-06-20  
**目的:** ExperimentSeed / Intake から Action 単位の intent metadata を受け取り、`extensions.intake.action_intents` に保存する。deep-work selection は **今回実装しない**。  
**前提:** [GROUND_DEEP_WORK_MODE_AUDIT_V0.4.10.md](./GROUND_DEEP_WORK_MODE_AUDIT_V0.4.10.md)

---

## 1. v0.4.10 との関係

v0.4.10 は deep-work を type-aware にする前に **判定材料不足** を特定した。

| 不足 | v0.4.11 対応 |
|------|--------------|
| NextAction に effort / time_box / intent なし | **extensions.intake.action_intents** で明示保存 |
| title 推測は壊れやすい | seed で Human が intent を指定 |
| schema 変更は重い | **Principle 6: Extensions before schema changes** |

v0.4.12 予定: `applyDeepWorkFocus` が `action_intent === "deep_work"` を参照。

---

## 2. action_intent が必要な理由

Doctrine deep-work:

> 集中価値の高い Action を選び、深く進める。

現状の Portfolio scoring は urgency / unlock / momentum 等で **morning 向け**。  
「この Action は軽い確認か、集中設計か」を **明示 metadata** なしでは正直に判定できない。

---

## 3. ActionIntent 一覧

| intent | 意味 |
|--------|------|
| `quick_check` | 短時間の確認・軽い整理 |
| `decision` | 選択・判断・方針決定 |
| `design` | 構造設計・設計案作成 |
| `research` | 調査・分類・情報収集・比較 |
| `execution` | 実行・配布・制作・実装 |
| `validation` | 検証・テスト・観測・結果確認 |
| `deep_work` | まとまった集中時間を使う価値がある作業 |

1 Action = 1 primary intent（複数 intent は今回非対応）。

---

## 4. ExperimentSeed での表現

```json
{
  "initial_next_actions": ["関連分野を5つに分類する", "..."],
  "action_intents": [
    {
      "action_index": 0,
      "intent": "deep_work",
      "rationale": "分野地図の構造化に集中時間が必要"
    }
  ]
}
```

- `action_index` = `initial_next_actions` の 0-based インデックス
- `rationale` = optional（Human 可読の理由）
- `action_intents` 全体 = optional（既存 seed 互換）

---

## 5. ProjectState extensions 保存形式

```json
{
  "extensions": {
    "intake": {
      "source": "experiment_seed",
      "action_intents": [
        {
          "action_id": "<generated uuid>",
          "action_title": "関連分野を5つに分類する",
          "action_index": 0,
          "intent": "deep_work",
          "rationale": "分野地図の構造化に集中時間が必要",
          "source": "seed"
        }
      ]
    }
  }
}
```

- `action_id` は intake 時に生成された `next_actions[].id` と紐づく
- `action_intents` なし seed では **field 自体を作らない**（空配列も作らない）
- 既存 `extensions.intake`（risks, assumptions 等）は維持

---

## 6. schema を変えない理由

- `NextAction` 型・ProjectState schema は **未変更**
- validate ProjectState は extensions を検証しない（既存通り）
- intake 専用 metadata は `extensions.intake` に閉じる
- 将来 schema bump が必要になった時点で migration 設計可能

---

## 7. validate-seed 検証

| 条件 | 結果 |
|------|------|
| `action_intents` 省略 | valid（従来通り） |
| `action_index` 範囲外 | error |
| 重複 `action_index` | error |
| unknown intent（例: `deepwork`） | error |
| `rationale` 空文字 | error |

---

## 8. sample seed 更新

### business
decision / execution / design / research / validation を分散。全 8 action に intent 付与。

### research
index 0「関連分野を5つに分類する」= **`deep_work`**（future deep-work 検証用）。他は research / decision / design。

### product
index 4「1画面フローを文章で描く」= **`deep_work`**。index 0 = decision、index 7 = quick_check。

---

## 9. 読み取り helper（将来用）

```ts
import { getActionIntent, getActionIntentRecords } from "ground-core";

getActionIntent(projectState, actionId); // ActionIntent | undefined
getActionIntentRecords(projectState);    // ActionIntentRecord[]
```

Portfolio / deep-work は **v0.4.12 で使用予定**。今回は selection に未使用。

---

## 10. tests

`ground-core/__tests__/intake.test.ts` — `Action intent metadata v0.4.11`（7 tests）

```
ℹ tests 279 | pass 279
```

---

## 11. v0.4.12 deep-work focus（実装済み）

v0.4.11 metadata を deep-work selection で使用。詳細: [GROUND_DEEP_WORK_FOCUS_PORTFOLIO_V0.4.12.md](./GROUND_DEEP_WORK_FOCUS_PORTFOLIO_V0.4.12.md)

---

## 12. 改訂履歴

| 版 | 日付 | 内容 |
|----|------|------|
| v0.4.11 | 2026-06-20 | action_intents intake + extensions 保存 + sample + tests |
| v0.4.12 | 2026-06-21 | applyDeepWorkFocus + Brief deep_work_focus 表示 |
