# GROUND Core v0.2.3 — FreeWater E2E Manual Run ログ

> **日付**: 2026-06-07  
> **方式**: propose → review-selection → build-approved-patch → **patch 適用**  
> **extractor**: semantic（デフォルト）

実装: [GROUND_CORE_V0.2.3_HUMAN_REVIEW_BRIDGE.md](./GROUND_CORE_V0.2.3_HUMAN_REVIEW_BRIDGE.md)  
Momotaro 版: [GROUND_CORE_V0.2.3_E2E_MANUAL_RUN.md](./GROUND_CORE_V0.2.3_E2E_MANUAL_RUN.md)

---

## 対象 project

| 項目 | 値 |
|------|-----|
| title | FreeWater |
| project_id | `28d83a68-2064-43d7-94cb-72656b9006de` |

---

## 入力文

```
FreeWaterは先に場所を決める
```

---

## 検証前 ProjectState スナップショット

| 項目 | 値 |
|------|-----|
| `updated_at` | `2026-06-07T04:03:18.074Z` |
| `observations` 件数 | 1 |
| `primary_next_action_id` | `f3333333-3333-4333-8333-333333333301`（配布場所を1つ決める） |
| primary action status | `pending` |
| 全 blocker status | `open` |
| `project.status` | `active` |

---

## Step 1 — propose

```bash
npm run ground-core -- propose 28d83a68-2064-43d7-94cb-72656b9006de \
  --text "FreeWaterは先に場所を決める" \
  --out ground-core/examples/proposals/freewater-priority-v0.2.3.proposal.json
```

| 項目 | 結果 |
|------|------|
| **出力ファイル** | `ground-core/examples/proposals/freewater-priority-v0.2.3.proposal.json` |
| **proposal_id** | `63e12eb1-bab5-47dc-8723-464f2c844cc9` |
| **exit code** | 0 |
| **ProjectState 変更** | **なし** |

### 検出 SemanticEvent

| フィールド | 値 |
|-----------|-----|
| event_id | `acb17146-88af-41df-96bb-2c1e8f9345b0` |
| type | `PriorityChanged` |
| modality | `commitment` |
| evidence | `先に` |
| raw_span | `FreeWaterは先に場所を決める` |
| resolver_hint.raw_target_span | `場所` |

### resolution_results

| フィールド | 値 |
|-----------|-----|
| raw_target_span | `場所` |
| ambiguity_level | `low`（single weak match, score 0.7） |
| top candidate entity_id | `f3333333-3333-4333-8333-333333333301` |
| top candidate label | 配布場所を1つ決める |
| score | 0.7 |

### proposed_patch（v0.2.2 段階）

- observation ×1（`優先順位の記録`）
- primary 更新 **なし**

---

## Step 2 — review-selection.json 作成

**ファイル**: `ground-core/examples/reviews/freewater-priority-v0.2.3.selection.json`

```json
{
  "schema_version": "0.2.3",
  "proposal_id": "63e12eb1-bab5-47dc-8723-464f2c844cc9",
  "project_id": "28d83a68-2064-43d7-94cb-72656b9006de",
  "event_id": "acb17146-88af-41df-96bb-2c1e8f9345b0",
  "selected_entity_type": "next_action",
  "selected_entity_id": "f3333333-3333-4333-8333-333333333301",
  "reviewer": "human",
  "decision": "approve_resolution",
  "note": "E2E manual run: 配布場所を最優先にする",
  "created_at": "2026-06-07T06:22:40.000Z"
}
```

---

## Step 3 — build-approved-patch

```bash
npm run ground-core -- build-approved-patch \
  --proposal ground-core/examples/proposals/freewater-priority-v0.2.3.proposal.json \
  --selection ground-core/examples/reviews/freewater-priority-v0.2.3.selection.json \
  --out ground-core/examples/approved-patches/freewater-priority-v0.2.3.approved.patch.json
```

| 項目 | 結果 |
|------|------|
| **出力ファイル** | `ground-core/examples/approved-patches/freewater-priority-v0.2.3.approved.patch.json` |
| **exit code** | 0 |
| **source** | `human_review` |
| **operations** | 2 |
| **dry_run** | `would_apply=true` |
| **ProjectState 変更** | **なし** |

### approved patch operations 要約

| # | entity | op | 内容 |
|---|--------|-----|------|
| 1 | observation | upsert | `優先順位の記録` — body: `FreeWaterは先に場所を決める` |
| 2 | current_state | upsert | `primary_next_action_id → f3333333-...3301`（配布場所を1つ決める） |

**含まれないもの**: action status_change / blocker status_change / project 変更 / delete

---

## Step 4 — patch 適用

```bash
npm run ground-core -- patch 28d83a68-2064-43d7-94cb-72656b9006de \
  --file ground-core/examples/approved-patches/freewater-priority-v0.2.3.approved.patch.json
```

| 項目 | 結果 |
|------|------|
| **exit code** | 0 |
| **updated_at（適用前）** | `2026-06-07T04:03:18.074Z` |
| **updated_at（適用後）** | `2026-06-07T06:22:44.452Z` |
| **ProjectState 変更** | **あり（この step のみ）** |

---

## Step 5 — show 確認

```bash
npm run ground-core -- show 28d83a68-2064-43d7-94cb-72656b9006de
```

### 適用後 ProjectState

| 項目 | 適用前 | 適用後 | 期待 |
|------|--------|--------|------|
| `primary_next_action_id` | `...3301`（配布場所） | `...3301`（配布場所） | 配布場所 action を指す |
| primary action title | 配布場所を1つ決める | 配布場所を1つ決める | 一致 |
| primary action status | `pending` | `pending` | done しない |
| 全 next_action status | 全 `pending` | 全 `pending` | done しない |
| blocker status | 全 `open` | 全 `open` | resolved しない |
| `project.status` | `active` | `active` | 変更なし |
| `observations` 件数 | 1 | **2** | observation 追加 |
| 新 observation id | — | `9cc568d5-1523-450f-af41-a08dd82f2565` | 優先順位の記録 |

---

## ProjectState が変更された時点

| Step | コマンド | storage 変更 |
|------|---------|-------------|
| 1 | propose | **なし** |
| 2 | selection JSON 作成 | **なし**（examples のみ） |
| 3 | build-approved-patch | **なし** |
| 4 | patch | **あり** — observation 追加 + current_state upsert |
| 5 | show | **なし**（読取のみ） |

---

## 期待との一致

| 期待 | 結果 |
|------|------|
| SemanticEvent: PriorityChanged | **一致** |
| resolution candidate: 配布場所を1つ決める | **一致**（score 0.7, ambiguity low） |
| human approve → observation + primary upsert | **一致** |
| primary が配布場所 action | **一致** |
| action done なし | **一致** |
| blocker resolved なし | **一致** |
| patch コマンド時のみ state 変更 | **一致** |

---

## E2E で見えた問題点 / 注意点

1. **primary は適用前から既に配布場所 action を指していた**  
   v0.1.1 manual patch 済み。Momotaro E2E と同様、主効果は observation 追加 + human_review 経由の current_state 再確定。

2. **resolution score 0.7 / ambiguity low**  
   Momotaro（score 1.0 / none）より弱い match だが、approve ゲートは通過。`場所` → `配布場所` の部分一致として意図どおり。

3. **proposal_id / event_id は propose 実行ごとに変わる**  
   selection は proposal JSON から毎回読み取る。

4. **問題なし**  
   validate + dry-run、安全ゲート、exit code、全 action pending / blocker open は期待どおり。

---

## 生成ファイル一覧

| ファイル | 用途 |
|---------|------|
| `ground-core/examples/proposals/freewater-priority-v0.2.3.proposal.json` | propose 出力 |
| `ground-core/examples/reviews/freewater-priority-v0.2.3.selection.json` | 人間レビュー入力 |
| `ground-core/examples/approved-patches/freewater-priority-v0.2.3.approved.patch.json` | approved StatePatch |

---

## テスト実行（検証後）

```bash
npm run test:ground-core
```

```
ℹ tests 100
ℹ pass 100
ℹ fail 0
```

---

## 関連

- [GROUND_CORE_V0.2.3_HUMAN_REVIEW_BRIDGE.md](./GROUND_CORE_V0.2.3_HUMAN_REVIEW_BRIDGE.md)
- [GROUND_CORE_V0.2.3_E2E_MANUAL_RUN.md](./GROUND_CORE_V0.2.3_E2E_MANUAL_RUN.md)（Momotaro）
