# GROUND Core v0.2.2 — EventResolver

> **地位**: v0.2.1 の `SemanticEvent.resolver_hint.raw_target_span` を、ProjectState 内の `next_action` 候補に **解決候補として提示** する層。  
> **自動適用なし** / **LLM なし** / **自動保存なし**。

設計詳細: [GROUND_CORE_V0.2.2_EVENT_RESOLVER_DESIGN.md](./GROUND_CORE_V0.2.2_EVENT_RESOLVER_DESIGN.md)

---

## v0.2.2 の思想

| 原則 | 説明 |
|------|------|
| **意味と解決の分離** | EventDetector = 意味イベント。EventResolver = ProjectState 参照 |
| **候補提示のみ** | `selected_candidate_id` は Resolver が自動設定しない |
| **Patch は v0.2.1 同様** | observation / judgment のみ。primary / status 変更は載せない |
| **人間レビュー必須** | `needs_human_review: true` 固定 |
| **固有名詞非依存** | match は `raw_target_span` と action title/description の token 比較 |

### パイプライン

```
UserInput
  → EventDetector → SemanticEvent (+ resolver_hint)
  → EventResolver → ResolutionResult[]
  → semantic-propose → PatchProposal (+ resolution_results[])
  → Human Review
```

---

## EventDetector と EventResolver の分離

- **EventDetector** は `raw_target_span` を文から抽出するだけ。`entity_id` は解決しない。
- **EventResolver** は `ProjectState.next_actions` を読み、token match で候補を列挙する。
- Resolver は **ProjectState を変更しない**。結果は `PatchProposal.resolution_results[]` に載せるだけ。

---

## resolution_results[] の意味

`PatchProposal` に optional で付与:

```json
{
  "resolution_results": [{
    "event_id": "...",
    "target_kind": "next_action",
    "raw_target_span": "場所",
    "candidates": [{
      "entity_type": "next_action",
      "entity_id": "...",
      "label": "配布場所を1つ決める",
      "score": 0.7,
      "matched_terms": ["場所"],
      "reason": "title/description token overlap (1 term(s))"
    }],
    "ambiguity_level": "low",
    "needs_human_review": true
  }]
}
```

| フィールド | 意味 |
|-----------|------|
| `candidates[]` | スコア順の候補（最大 5 件） |
| `selected_candidate_id` | v0.2.2 では **常に undefined**（人間が後から選ぶ） |
| `ambiguity_level` | none / low / medium / high |
| `needs_human_review` | 常に `true` |

---

## TokenMatchResolver 仕様

実装: `ground-core/extraction/semantic/token-match-resolver.ts`  
名前: `token-match-v1`

### 対象 event

- `PriorityChanged` / `ActionDeferred`
- `resolver_hint.strategy === "semantic_match_next_action"`
- `raw_target_span` が非空

### 対象外 event

`CandidateCreated` / `DecisionMade` / `StopRequested` / `ActionCompleted` / `BlockerMitigated`

### 正規化

`raw_target_span` / action `title` / `description` を:

1. NFKC
2. lowercase
3. 記号除去
4. 空白正規化

### マッチ

- token / partial match（2 文字 n-gram 含む）
- 一般 alias のみ: `mj → midjourney`, `文面 → 本文`
- project 固有語は alias に入れない

### スコア

| 要素 | 重み |
|------|------|
| title token match | +0.55 |
| description token match | +0.275 |
| pending action | +0.10 |
| done action | -0.40 |
| primary action | +0.05 |
| 候補閾値 | score >= 0.65 |
| 最大候補数 | 5 |

### ambiguity

| 条件 | level |
|------|-------|
| candidates 0 | high |
| candidates 1 & score >= 0.8 | none |
| candidates 1 & score < 0.8 | low |
| top - second < 0.10 | medium |
| それ以外（複数候補） | low |

---

## 代表入力と resolution_results

### 1. Momotaro — 「桃太郎はまずキャラ固定からやる」

- `raw_target_span`: `キャラ固定`
- top candidate: `桃太郎のキャラクター固定ルールを整理する`
- score: 高（>= 0.65）
- ambiguity: none / low

### 2. Momotaro — 「MJ文面は後でいい」

- `raw_target_span`: `MJ文面`
- top candidate: `Midjourneyに投げる本文ルールを確定する`
- alias: mj → midjourney, 文面 → 本文
- ambiguity: none / low

### 3. FreeWater — 「FreeWaterは先に場所を決める」

- `raw_target_span`: `場所`
- top candidate: `配布場所を1つ決める`
- ambiguity: none / low

### 4. 曖昧 — 「先に準備する」

- `raw_target_span`: `準備`
- candidates: 0
- ambiguity: high

---

## 固定例依存ガード

Resolver ソースに以下を **条件としてハードコードしない**:

- 桃太郎 / Momotaro / FreeWater / 新宿 / 高円寺
- キャラ固定 / MJ文面 / 場所

テスト入力として fixture 文は使ってよい。alias は一般語（mj, 文面）のみ。

---

## 今回やらないこと

- OpenAI / Anthropic API 接続
- LLM 自動抽出
- 自動保存
- Web UI / AI Router / PostgreSQL / GROUND 本体連携
- `selected_candidate_id` の自動設定
- `proposed_patch` への primary / action done / blocker resolved 更新
- ProjectState の変更

---

## v0.2.3 候補

→ **実装**: [GROUND_CORE_V0.2.3_HUMAN_REVIEW_BRIDGE.md](./GROUND_CORE_V0.2.3_HUMAN_REVIEW_BRIDGE.md)

1. 人間が `selected_candidate_id` を確定した後の patch 提案（primary 更新）— **v0.2.3 実装済み**
2. DecisionMade + commitment → ActionCompleted / BlockerMitigated（Modality gate）— v0.2.4+
3. blocker / goal への resolver 拡張
4. LLM-assisted resolver（optional）
5. ambiguity high 時の ClarificationResponse 昇格検討

---

## 実装ファイル

```
ground-core/extraction/semantic/
  resolver-types.ts
  event-resolver.ts
  token-match-resolver.ts
ground-core/extraction/
  types.ts              # PatchProposal.resolution_results
  propose.ts            # buildProposalFromDraft 伝播
  semantic/semantic-propose.ts  # resolver 接続
```

---

## 関連

- [GROUND_CORE_V0.2.1_SEMANTIC_EXTRACTION.md](./GROUND_CORE_V0.2.1_SEMANTIC_EXTRACTION.md)
- [GROUND_CORE_V0.2.2_EVENT_RESOLVER_DESIGN.md](./GROUND_CORE_V0.2.2_EVENT_RESOLVER_DESIGN.md)
