# GROUND v0.6.1 — Reality Semantics

## 目的

Reality Loop の安全境界（propose ≠ apply、observation ≠ mutation）を維持したまま、
既存 decision/candidate 中心の Semantic modality では扱えない
**観測・進捗・意図**を PatchProposal に落とす。

## 経路

```
Reality input
  → (1) 既存 modality 検出あれば rule-modality → semantic propose
  → (2) なければ Reality Semantics 分類
        observation | progress | intention | ambiguous | unknown
  → PatchProposal または Reality向け Clarification
  → human apply（既存 reality-apply）
```

## 責務境界

| 層 | 責務 |
|----|------|
| `rule-modality-v1` | Candidate / Decision / Deferred / Priority / Stop（**変更しない**） |
| `reality/semantics.ts` | observation / progress / intention の分類 |
| `reality/draft.ts` | 分類 → ExtractionDraft / Clarification |
| `reality/propose.ts` | Reality Loop 入口。modality 優先 → Reality Semantics |

## カテゴリ mapping

| kind | Proposal |
|------|----------|
| observation | `observation` upsert |
| progress | `observation` + `current_state.summary` 更新。完了断定しない表現では **phase 変更なし**。vX.Y 実装・到達が明確なときのみ保守的 `phase` 候補 |
| intention | `observation`（未実行の意図）+ `next_action` **pending**（done にしない） |
| ambiguous | Clarification（事実か意図か） |
| unknown | Reality向け Clarification |

## Clarification 例

- 「これは既に完了した事実ですか、それとも今後やりたいことですか？」

## CLI

外形変更なし: `reality-propose` / `reality-apply`

## Phase 2 禁止事項

依然として LLM / 自動 apply / Event store 等は入れない。
