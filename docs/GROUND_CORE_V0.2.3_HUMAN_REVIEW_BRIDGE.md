# GROUND Core v0.2.3 — Human Review Bridge

> **地位**: v0.2.2 `PatchProposal` + `resolution_results[]` に対し、人間の `ReviewSelection` から **approved StatePatch** を生成する橋渡し層。  
> **自動保存なし** / **LLM なし** / **適用は既存 patch CLI のみ**。

設計: [GROUND_CORE_V0.2.3_HUMAN_REVIEW_BRIDGE_DESIGN.md](./GROUND_CORE_V0.2.3_HUMAN_REVIEW_BRIDGE_DESIGN.md)

---

## v0.2.3 の思想

| 原則 | 説明 |
|------|------|
| **提案と承認の分離** | `propose` = 候補提示。`build-approved-patch` = 人間承認後 patch 生成 |
| **ファイル出力のみ** | approved patch を JSON 出力。ProjectState は **保存しない** |
| **最小 state 進行** | primary 更新は PriorityChanged + approve のみ |
| **明示的選択** | `ReviewSelection` JSON を人間が渡す |
| **既存 patch 再利用** | 適用は `ground-core patch` のみ |

### パイプライン

```
propose → PatchProposal (+ resolution_results[])
  → 人間が候補確認
  → review-selection.json
  → build-approved-patch（保存しない）
  → approved-patch.json
  → 人間確認
  → patch CLI（saveProject）
```

---

## ReviewSelection JSON 例

### PriorityChanged 承認

```json
{
  "schema_version": "0.2.3",
  "proposal_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "project_id": "839578f5-36e1-4b6f-9be5-a97520f52b66",
  "event_id": "evt-001",
  "selected_entity_type": "next_action",
  "selected_entity_id": "c3333333-3333-4333-8333-333333333301",
  "reviewer": "human",
  "decision": "approve_resolution",
  "note": "キャラ固定を最優先にする",
  "created_at": "2026-06-07T12:00:00.000Z"
}
```

### ActionDeferred 承認（primary は変えない）

```json
{
  "schema_version": "0.2.3",
  "proposal_id": "...",
  "project_id": "...",
  "event_id": "...",
  "selected_entity_type": "next_action",
  "selected_entity_id": "c3333333-3333-4333-8333-333333333304",
  "reviewer": "human",
  "decision": "approve_resolution",
  "note": "MJ文面は後回しで合意",
  "created_at": "..."
}
```

### 却下

```json
{
  "schema_version": "0.2.3",
  "proposal_id": "...",
  "project_id": "...",
  "event_id": "...",
  "reviewer": "human",
  "decision": "reject_resolution",
  "note": "候補が違う",
  "created_at": "..."
}
```

CandidateCreated / DecisionMade は `selected_entity_*` 省略可（selection 自体も省略可）。

---

## build-approved-patch の使い方

```bash
# 1. proposal
npm run ground-core -- propose <project_id> \
  --text "桃太郎はまずキャラ固定からやる" \
  --out proposal.json

# 2. review-selection.json を作成

# 3. approved patch 生成（ProjectState 保存しない）
npm run ground-core -- build-approved-patch \
  --proposal proposal.json \
  --selection review-selection.json \
  --out approved-patch.json

# 4. 確認後、既存 patch で適用
npm run ground-core -- patch <project_id> --file approved-patch.json
```

resolution 不要 event（CandidateCreated / DecisionMade）:

```bash
npm run ground-core -- build-approved-patch \
  --proposal proposal.json \
  --out approved-patch.json
```

---

## EventType 別 — 許可 patch

| EventType | decision | 生成 patch |
|-----------|----------|-----------|
| PriorityChanged | approve | observation + **primary upsert** |
| PriorityChanged | reject | observation のみ |
| ActionDeferred | approve | observation + judgment + note 追記 |
| ActionDeferred | reject | observation のみ |
| CandidateCreated | approve（implicit可） | observation のみ |
| DecisionMade | approve（implicit可） | observation + judgment hold |
| StopRequested | — | **対象外** |
| clarify | — | patch 不出力（exit 1） |

---

## Safety gate

| # | Gate |
|---|------|
| 1 | proposal_id 一致 |
| 2 | project_id 一致 |
| 3 | event_id が semantic_events に存在 |
| 4 | approve 時 selected_entity_id が candidates に存在 |
| 5 | ambiguity high + approve → reject |
| 6 | primary 更新は selected action pending のみ |
| 7 | project.status 変更禁止 |
| 8 | delete 禁止 |
| 9 | action done 禁止 |
| 10 | blocker resolved / mitigated 禁止 |
| 11 | primary 更新は PriorityChanged + approve のみ |
| 12 | validateStatePatch 必須 |
| 13 | dryRunPatch 必須 |

---

## 今回やらないこと

- OpenAI / Anthropic API
- LLM 自動抽出 / 自動選択
- build-approved-patch からの saveProject
- Web UI / AI Router / PostgreSQL / GROUND 本体連携
- action done / blocker resolved
- StopRequested bridge
- `--format bundle`（設計のみ、未実装）

---

## v0.2.4 / v0.3 候補

- DecisionMade + commitment → ActionCompleted / BlockerMitigated
- ApprovedPatchBundle 監査出力
- validate-selection CLI
- ambiguity medium UI ガイダンス
- 複数 resolution_results の batch selection
- Web UI review panel

---

## 実装ファイル

```
ground-core/extraction/review/
  types.ts
  review-gates.ts
  build-approved-patch.ts
ground-core/cli.ts
ground-core/__tests__/human-review-bridge.test.ts
```

---

## 関連

- [GROUND_CORE_V0.2.2_EVENT_RESOLVER.md](./GROUND_CORE_V0.2.2_EVENT_RESOLVER.md)
- [GROUND_CORE_V0.2.3_E2E_MANUAL_RUN.md](./GROUND_CORE_V0.2.3_E2E_MANUAL_RUN.md)（Momotaro）
- [GROUND_CORE_V0.2.3_FREEWATER_E2E_MANUAL_RUN.md](./GROUND_CORE_V0.2.3_FREEWATER_E2E_MANUAL_RUN.md)（FreeWater）
- [GROUND_CORE_V0.2.3_HUMAN_REVIEW_BRIDGE_DESIGN.md](./GROUND_CORE_V0.2.3_HUMAN_REVIEW_BRIDGE_DESIGN.md)
