# GROUND Core v0.2.1 — Semantic Extraction

> **地位**: v0.2 MockExtractor を **Semantic Event 抽出** に進化させた実装 + v0.2.1 補強。  
> **Detector**: RuleModalityDetector（LLM なし）。**自動保存なし**。

---

## v0.2.1 の思想

入力文の **固有名詞** ではなく、**何が起きたか（Semantic Event）** を抽出する。

| 悪い設計（v0.2 mock） | 良い設計（v0.2.1） |
|----------------------|-------------------|
| FreeWater + 「場所」 | modality + CandidateCreated / DecisionMade |
| 「新宿中央公園」キーワード | 「かな」「決めた」等の **言語模態** |
| Momotaro + 「キャラ固定」ハードコード | PriorityChanged + **resolver_hint** |

固有名詞は `raw_span` / `observation.body` にのみ残す。  
`evidence[]` には言語手がかり（「かな」「決めた」「まず」等）だけを入れる。

---

## v0.2.1 補強（manual run 反映）

manual run で判明した不足を **安全な範囲** で補強:

1. **PriorityChanged** 追加 — 「まず / 先に / からやる / 優先 / 次は」
2. **semantic_events[]** — PatchProposal / ClarificationResponse に embed
3. **resolver_hint** — PriorityChanged / ActionDeferred に `semantic_match_next_action` + `raw_target_span`
4. **entity_id 解決はまだしない** — v0.2.2 EventResolver へ委譲

---

## 実装した 5 EventType

| Type | Modality 手がかり | PatchProposal |
|------|-------------------|---------------|
| `CandidateCreated` | しようと思う / かな / 候補 / やろう | observation のみ |
| `DecisionMade` | 決めた / 確定 / これでいく | observation + judgment hold |
| `ActionDeferred` | 考える / 保留 / 後で | observation + judgment hold + resolver_hint |
| `PriorityChanged` | まず / 先に / からやる / 優先 / 次は | observation のみ + resolver_hint |
| `StopRequested` | やめたい / 無理 / だるい | **ClarificationResponse** + semantic_events |

---

## semantic_events[] embed

PatchProposal / ClarificationResponse に optional で付与:

```json
{
  "semantic_events": [{
    "type": "PriorityChanged",
    "modality": "commitment",
    "target_kind": "next_action",
    "evidence": ["まず", "からやる"],
    "resolver_hint": {
      "strategy": "semantic_match_next_action",
      "raw_target_span": "キャラ固定"
    }
  }]
}
```

**目的**: proposal JSON から検出 event をレビュー時に即確認できる。

---

## resolver_hint の意味

| field | 説明 |
|-------|------|
| `strategy: "semantic_match_next_action"` | 将来 EventResolver が ProjectState の next_action と semantic match する |
| `raw_target_span` | 入力文から **汎用 regex** で抽出した対象語（ルール条件にはしない） |

**例**:

- 「桃太郎はまずキャラ固定からやる」→ `raw_target_span: "キャラ固定"`
- 「MJ文面は後でいい」→ `raw_target_span: "MJ文面"`

---

## まだ entity_id 解決しない理由

v0.2.1 補強では **誤爆防止** を優先:

- `primary_next_action_id` 更新なし
- action done / blocker resolved なし
- resolver_hint は **ヒントのみ** — 人間レビュー + v0.2.2 EventResolver で確定

---

## 今回あえて実装しなかった EventType

| EventType | 延期先 |
|-----------|--------|
| ActionCompleted | v0.2.2 |
| BlockerMitigated | v0.2.2 |
| EventResolver（entity_id 確定） | v0.2.2 |

---

## Event → PatchProposal 対応

| Event | operations | risk | confidence 目安 |
|-------|------------|------|-----------------|
| CandidateCreated | observation ×1 | medium | 0.62 |
| DecisionMade | observation + judgment(hold) | medium | 0.75 |
| ActionDeferred | observation + judgment(hold) | low | 0.70 |
| PriorityChanged | observation ×1 | medium | 0.70 |
| StopRequested | なし → clarification | high | — |

**禁止（コードでガード）**:

- project.status 変更
- delete operation
- next_action status_change
- blocker status_change
- primary_next_action_id 変更

---

## CLI propose

```bash
npm run ground-core -- propose <project_id> --text "..."
npm run ground-core -- propose <project_id> --text "..." --extractor mock
```

---

## 固定例依存を避けるガード

1. EventDetector に project名・地名・「キャラ固定」「MJ文面」を **条件として** 入れない
2. `raw_target_span` は文から regex 抽出（テスト入力は fixture として可）
3. PR テスト: detector source に固有名詞リテラルなし
4. `assertPatchHasNoAutoStateAdvance`

---

## v0.2.2 EventResolver（実装済み）

`resolver_hint.raw_target_span` → ProjectState `next_action` 候補 match。  
**候補提示のみ** — state 更新 patch は v0.2.3 以降。

→ [GROUND_CORE_V0.2.2_EVENT_RESOLVER.md](./GROUND_CORE_V0.2.2_EVENT_RESOLVER.md)

---

## 関連

- [GROUND_CORE_V0.2.2_EVENT_RESOLVER.md](./GROUND_CORE_V0.2.2_EVENT_RESOLVER.md)
- [GROUND_CORE_V0.2.3_HUMAN_REVIEW_BRIDGE_DESIGN.md](./GROUND_CORE_V0.2.3_HUMAN_REVIEW_BRIDGE_DESIGN.md)
- [GROUND_CORE_V0.2.1_SEMANTIC_MANUAL_RUN.md](./GROUND_CORE_V0.2.1_SEMANTIC_MANUAL_RUN.md)
- [GROUND_CORE_V0.2.1_SEMANTIC_EXTRACTION_DESIGN.md](./GROUND_CORE_V0.2.1_SEMANTIC_EXTRACTION_DESIGN.md)
