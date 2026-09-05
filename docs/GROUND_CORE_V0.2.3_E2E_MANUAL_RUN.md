# GROUND Core v0.2.3 — E2E Manual Run ログ

> **日付**: 2026-06-07  
> **方式**: propose → review-selection → build-approved-patch → **patch 適用**  
> **extractor**: semantic（デフォルト）

実装: [GROUND_CORE_V0.2.3_HUMAN_REVIEW_BRIDGE.md](./GROUND_CORE_V0.2.3_HUMAN_REVIEW_BRIDGE.md)

---

## 対象 project

| 項目 | 値 |
|------|-----|
| title | Japanese Folktale / Momotaro |
| project_id | `839578f5-36e1-4b6f-9be5-a97520f52b66` |

---

## 入力文

```
桃太郎はまずキャラ固定からやる
```

---

## 検証前 ProjectState スナップショット

| 項目 | 値 |
|------|-----|
| `updated_at` | `2026-06-07T04:07:33.353Z` |
| `observations` 件数 | 1 |
| `primary_next_action_id` | `c3333333-3333-4333-8333-333333333301`（桃太郎のキャラクター固定ルールを整理する） |
| primary action status | `pending` |
| 全 blocker status | `open` |
| `project.status` | `active` |

---

## Step 1 — propose

```bash
npm run ground-core -- propose 839578f5-36e1-4b6f-9be5-a97520f52b66 \
  --text "桃太郎はまずキャラ固定からやる" \
  --out ground-core/examples/proposals/momotaro-priority-v0.2.3.proposal.json
```

| 項目 | 結果 |
|------|------|
| **出力ファイル** | `ground-core/examples/proposals/momotaro-priority-v0.2.3.proposal.json` |
| **proposal_id** | `8a60f773-771a-4a85-81d8-fb17fe7aa70d` |
| **exit code** | 0 |
| **ProjectState 変更** | **なし** |

### 検出 SemanticEvent

| フィールド | 値 |
|-----------|-----|
| event_id | `9722fd35-a352-4f82-926f-7e1db9fde737` |
| type | `PriorityChanged` |
| modality | `commitment` |
| evidence | `まず`, `からやる` |
| raw_span | `桃太郎はまずキャラ固定からやる` |
| resolver_hint.raw_target_span | `キャラ固定` |

### resolution_results

| フィールド | 値 |
|-----------|-----|
| raw_target_span | `キャラ固定` |
| ambiguity_level | `none` |
| top candidate entity_id | `c3333333-3333-4333-8333-333333333301` |
| top candidate label | 桃太郎のキャラクター固定ルールを整理する |
| score | 1.0 |

### proposed_patch（v0.2.2 段階）

- observation ×1（`優先順位の記録`）
- primary 更新 **なし**

---

## Step 2 — review-selection.json 作成

**ファイル**: `ground-core/examples/reviews/momotaro-priority-v0.2.3.selection.json`

```json
{
  "schema_version": "0.2.3",
  "proposal_id": "8a60f773-771a-4a85-81d8-fb17fe7aa70d",
  "project_id": "839578f5-36e1-4b6f-9be5-a97520f52b66",
  "event_id": "9722fd35-a352-4f82-926f-7e1db9fde737",
  "selected_entity_type": "next_action",
  "selected_entity_id": "c3333333-3333-4333-8333-333333333301",
  "reviewer": "human",
  "decision": "approve_resolution",
  "note": "E2E manual run: キャラ固定を最優先にする",
  "created_at": "2026-06-07T06:18:30.000Z"
}
```

---

## Step 3 — build-approved-patch

```bash
npm run ground-core -- build-approved-patch \
  --proposal ground-core/examples/proposals/momotaro-priority-v0.2.3.proposal.json \
  --selection ground-core/examples/reviews/momotaro-priority-v0.2.3.selection.json \
  --out ground-core/examples/approved-patches/momotaro-priority-v0.2.3.approved.patch.json
```

| 項目 | 結果 |
|------|------|
| **出力ファイル** | `ground-core/examples/approved-patches/momotaro-priority-v0.2.3.approved.patch.json` |
| **exit code** | 0 |
| **source** | `human_review` |
| **operations** | 2 |
| **dry_run** | `would_apply=true` |
| **ProjectState 変更** | **なし** |

### approved patch operations 要約

| # | entity | op | 内容 |
|---|--------|-----|------|
| 1 | observation | upsert | `優先順位の記録` — body: `桃太郎はまずキャラ固定からやる` |
| 2 | current_state | upsert | `primary_next_action_id → c3333333-...3301`（キャラ固定 action） |

**含まれないもの**: action status_change / blocker status_change / project 変更 / delete

---

## Step 4 — patch 適用

```bash
npm run ground-core -- patch 839578f5-36e1-4b6f-9be5-a97520f52b66 \
  --file ground-core/examples/approved-patches/momotaro-priority-v0.2.3.approved.patch.json
```

| 項目 | 結果 |
|------|------|
| **exit code** | 0 |
| **updated_at（適用前）** | `2026-06-07T04:07:33.353Z` |
| **updated_at（適用後）** | `2026-06-07T06:18:36.108Z` |
| **ProjectState 変更** | **あり（この step のみ）** |

---

## Step 5 — show 確認

```bash
npm run ground-core -- show 839578f5-36e1-4b6f-9be5-a97520f52b66
```

### 適用後 ProjectState

| 項目 | 適用前 | 適用後 | 期待 |
|------|--------|--------|------|
| `primary_next_action_id` | `...3301`（キャラ固定） | `...3301`（キャラ固定） | キャラ固定 action を指す |
| primary action status | `pending` | `pending` | done しない |
| blocker status | 全 `open` | 全 `open` | resolved しない |
| `project.status` | `active` | `active` | 変更なし |
| `observations` 件数 | 1 | **2** | observation 追加 |
| 新 observation id | — | `b4a8c79e-a696-474e-acb0-e25642b7833c` | 優先順位の記録 |
| `current_state.updated_at` | `2026-06-07T04:07:33.353Z` | `2026-06-07T06:18:36.108Z` | patch で更新 |

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
| resolution candidate: キャラ固定 action | **一致**（score 1.0, ambiguity none） |
| human approve → observation + primary upsert | **一致** |
| primary がキャラ固定 action | **一致** |
| action done なし | **一致** |
| blocker resolved なし | **一致** |
| patch コマンド時のみ state 変更 | **一致** |

---

## E2E で見えた問題点 / 注意点

1. **primary は適用前から既にキャラ固定 action を指していた**  
   前回 manual patch（v0.1.1）の結果。今回の patch は primary **値の変更**より、human_review 経由の **observation 追加 + current_state 再確定**が主効果。

2. **review-selection の event_id / proposal_id は propose 実行ごとに変わる**  
   固定 UUID 前提にしない。proposal JSON から毎回読み取る必要あり。

3. **build-approved-patch の stdout**  
   要約行 + StatePatch JSON が連続出力される。`--out` には patch JSON のみ保存。

4. **問題なし**  
   validate + dry-run、安全ゲート、exit code、全 next_action pending / blocker open は期待どおり。

---

## 生成ファイル一覧

| ファイル | 用途 |
|---------|------|
| `ground-core/examples/proposals/momotaro-priority-v0.2.3.proposal.json` | propose 出力 |
| `ground-core/examples/reviews/momotaro-priority-v0.2.3.selection.json` | 人間レビュー入力 |
| `ground-core/examples/approved-patches/momotaro-priority-v0.2.3.approved.patch.json` | approved StatePatch |

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
- [GROUND_CORE_V0.2.3_FREEWATER_E2E_MANUAL_RUN.md](./GROUND_CORE_V0.2.3_FREEWATER_E2E_MANUAL_RUN.md)
- [GROUND_CORE_V0.2.3_HUMAN_REVIEW_BRIDGE_DESIGN.md](./GROUND_CORE_V0.2.3_HUMAN_REVIEW_BRIDGE_DESIGN.md)
- [GROUND_CORE_V0.2.2_EVENT_RESOLVER.md](./GROUND_CORE_V0.2.2_EVENT_RESOLVER.md)
