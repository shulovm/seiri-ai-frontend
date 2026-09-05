# GROUND Core v0.1.1 — 変更点

> Phase D / D.5 実戦検証で見えた schema 不足を、**最小限**だけ補完する。

---

## schema_version

```
0.1.0 → 0.1.1
```

新規 `init` は **0.1.1** で作成。既存 **0.1.0** ファイルは `loadProject` 時に自動 migration。

---

## A. CurrentState.primary_next_action_id（optional, nullable）

「今の一手」を `sort_order` 以外でも明示。

```json
"current_state": {
  "primary_next_action_id": "d4e5f6a7-b8c9-4123-def0-234567890123"
}
```

---

## B. NextAction.depends_on_action_id（optional, nullable）

Action chain の最低限の依存関係。

```json
"next_actions": [{
  "depends_on_action_id": "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee"
}]
```

---

## C. reference_docs[]

制作 bible / design doc との二重管理を減らす。

| field | 型 |
|-------|-----|
| id, project_id | UUID |
| title, path, summary | string |
| kind | design \| schema \| manual_run \| prompt_bible \| other |
| status | active \| archived |
| created_at, updated_at | ISO8601 |

Patch entity: `reference_doc`（upsert / delete / status_change）

---

## D. observations[]

現場メモ・5分ログなどの観測。

| field | 型 |
|-------|-----|
| id, project_id | UUID |
| goal_id | UUID \| null |
| title, body | string |
| source | manual \| field_test \| conversation \| system |
| observed_at, created_at, updated_at | ISO8601 |

Patch entity: `observation`（upsert / delete）

---

## E. judgments[]

Go / Stop / 修正 など **観測後の判定**（Decision=方針、Judgment=判定）。

| field | 型 |
|-------|-----|
| id, project_id | UUID |
| goal_id, observation_id | UUID \| null |
| title, rationale | string |
| outcome | go \| stop \| revise \| hold |
| decided_at, created_at, updated_at | ISO8601 |

Patch entity: `judgment`（upsert / delete）

---

## F. CLI new-id

```bash
npm run ground-core -- new-id
```

UUID v4 を 1 行出力。

---

## 後方互換

| 操作 | 挙動 |
|------|------|
| **loadProject** | 0.1.0 → 0.1.1 に migrate（空配列 + null 補完） |
| **saveProject** | 常に 0.1.1 で保存 |
| **applyPatch** | 入力 state を normalize、出力は 0.1.1 |
| **patch JSON** | schema_version `0.1.0` / `0.1.1` 両方受理 |

Migration 補完:

- `reference_docs: []`
- `observations: []`
- `judgments: []`
- `current_state.primary_next_action_id: null`
- `next_actions[].depends_on_action_id: null`

---

## FK 追加（State Engine）

- `primary_next_action_id` → `next_actions`
- `depends_on_action_id` → `next_actions`（自己参照禁止）
- `observation.goal_id` / `judgment.goal_id` → `goals`
- `judgment.observation_id` → `observations`

---

## v0.1.1 でまだ追加しないもの

character / visual_rule_set / tool_profile / deliverable / asset / budget / location / patch_log / Goal Graph DAG / PostgreSQL / Web UI / LLM / Router

---

## Schema ファイル

- `docs/schemas/ground-core-project-state.v0.1.1.schema.json`
- `docs/schemas/ground-core-state-patch.v0.1.1.schema.json`
- v0.1.0 schema は legacy 読み込み用に維持

---

## 関連

- [GROUND_CORE_V0.1_DESIGN.md](./GROUND_CORE_V0.1_DESIGN.md)
- [GROUND_CORE_CLI_V0.1.md](./GROUND_CORE_CLI_V0.1.md)
