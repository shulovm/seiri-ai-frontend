# GROUND Core v0.2.2 — EventResolver 設計

> **地位**: v0.2.1 SemanticEvent + `resolver_hint.raw_target_span` の **entity 候補解決** 層。  
> **v0.2.2 の位置づけ**: **設計のみ**。実装・自動適用・LLM API は **行わない**。

---

## 0. 背景と v0.2.2 の位置づけ

### v0.2.1 まで

```
UserInput → EventDetector → SemanticEvent (+ resolver_hint.raw_target_span)
         → semantic-propose → PatchProposal (observation / judgment のみ)
```

**例**: 「桃太郎はまずキャラ固定からやる」

- Event: `PriorityChanged`
- `raw_target_span`: `"キャラ固定"`
- **未解決**: これが next_action「桃太郎のキャラクター固定ルールを整理する」を指すか不明

### v0.2.2 で追加

```
SemanticEvent[] + ProjectState
        ↓
   EventResolver
        ↓
   ResolutionResult[]  （候補 + score + ambiguity）
        ↓
   PatchProposal (+ resolution_results[], 既存 patch は v0.2.1 同様)
        ↓
   Human Review（selected_candidate_id は人間が選ぶ）
```

**v0.2.2 では StatePatch に primary / status 変更を載せない。**  
resolution は **候補提示まで**。自動適用禁止。

---

## 1. v0.2.2 の全体思想

| 原則 | 説明 |
|------|------|
| **意味と解決の分離** | EventDetector = 意味イベント。EventResolver = ProjectState 参照 |
| **固有名詞非依存** | match は `raw_target_span` と entity title/description の token 比較 |
| **候補提示のみ** | `selected_candidate_id` は Resolver が自動設定しない（optional 空） |
| **score + ambiguity** | 機械可読な信頼度。低 score / 近接 score → ambiguity |
| **人間レビュー必須** | `needs_human_review: true` 固定 |
| **自動保存禁止** | propose は PatchProposal 出力のみ |

### パイプライン（v0.2.2）

```mermaid
flowchart TD
  IN[UserInput] --> ED[EventDetector]
  PS[(ProjectState)] --> ER[EventResolver]
  ED --> SE[SemanticEvent]
  SE --> ER
  ER --> RR[ResolutionResult[]]
  SE --> SP[semantic-propose]
  RR --> SP
  PS --> SP
  SP --> PP[PatchProposal]
  PP --> HR[Human Review]
```

---

## 2. EventResolver interface 案

```typescript
import type { ProjectState } from "../../types.js";
import type { SemanticEvent } from "./types.js";
import type { ResolutionResult } from "./resolution-types.js";

export interface ResolverInput {
  project_state: ProjectState;
  events: SemanticEvent[];
}

/** v0.2.2 — next_action 解決のみ。blocker/goal は v0.2.3+ */
export interface EventResolver {
  readonly name: string; // "token-match-v1"
  resolve(input: ResolverInput): ResolutionResult[];
}

/** 解決対象 event type（v0.2.2） */
export const RESOLVABLE_EVENT_TYPES = [
  "PriorityChanged",
  "ActionDeferred",
] as const;

export type ResolvableEventType = (typeof RESOLVABLE_EVENT_TYPES)[number];

export function isResolvableEvent(event: SemanticEvent): boolean {
  return (
    event.resolver_hint?.strategy === "semantic_match_next_action" &&
    Boolean(event.resolver_hint.raw_target_span) &&
    RESOLVABLE_EVENT_TYPES.includes(event.type as ResolvableEventType)
  );
}
```

### EventResolver の責務

| やること | やらないこと |
|----------|--------------|
| `raw_target_span` を正規化 | Event type 再判定 |
| next_action 候補を score 付きで列挙 | `selected_candidate_id` 自動設定 |
| ambiguity_level 算出 | StatePatch operation 生成 |
| `matched_terms[]` / `reason` 記録 | LLM fuzzy match |
| pending action 優先 | project 名 / 固有名詞条件 |

---

## 3. ResolutionCandidate 型案

```typescript
export type ResolutionEntityType = "next_action" | "blocker" | "goal";

export interface ResolutionCandidate {
  /** 解決先 entity 種別 */
  entity_type: ResolutionEntityType;
  /** ProjectState 上の UUID */
  entity_id: string;
  /** 人間向けラベル（title） */
  label: string;
  /** 0.0–1.0。match 算法の出力 */
  score: number;
  /** raw_target_span と entity 側で一致した token */
  matched_terms: string[];
  /** 短い説明（例: "title partial match: キャラ + 固定"） */
  reason: string;
  /** v0.2.2 optional — status 等の context */
  context?: {
    status?: string;
    sort_order?: number;
    is_primary?: boolean;
  };
}
```

---

## 4. ResolutionResult 型案

```typescript
export type ResolutionAmbiguityLevel = "none" | "low" | "medium" | "high";

export interface ResolutionResult {
  /** 対応する SemanticEvent.id */
  event_id: string;
  /** SemanticEvent.target_kind */
  target_kind: SemanticTargetKind;
  /** resolver_hint から引き継ぎ */
  raw_target_span: string;
  /** score 降順。最大 5 件まで */
  candidates: ResolutionCandidate[];
  /**
   * v0.2.2 では常に undefined（人間が review 後に設定）
   * v0.2.3+ で optional auto-suggest 可
   */
  selected_candidate_id?: string;
  ambiguity_level: ResolutionAmbiguityLevel;
  /** v0.2.2 では常に true */
  needs_human_review: true;
  /** 候補0 / 近接 score 等の理由 */
  resolution_note?: string;
}
```

---

## 5. resolver_hint → entity candidates の流れ

```
1. EventDetector が SemanticEvent を生成
   └─ resolver_hint: { strategy: "semantic_match_next_action", raw_target_span: "キャラ固定" }

2. semantic-propose が Patch 草案を組み立て（v0.2.1 同様）

3. EventResolver.resolve({ project_state, events: [event] })
   a. isResolvableEvent(event) ? 続行 : skip（ResolutionResult なし）
   b. normalize(raw_target_span) → tokens[]
   c. project_state.next_actions を走査
   d. 各 action に scoreNextAction(span, action, context) 
   e. score >= MIN_CANDIDATE_SCORE (0.65) を candidates に
   f. ambiguity_level を算出
   g. ResolutionResult を返す

4. PatchProposal に resolution_results[] を embed

5. 人間が candidates を読み、必要なら selected_candidate_id を手編集

6. v0.2.3+ で selected_candidate_id を使った patch 提案（別フェーズ）
```

---

## 6. next_action 解決ルール

### 6.1 正規化（normalize）

入力 `raw_target_span` と `next_action.title` / `description` に同一関数を適用:

| ステップ | 処理 |
|----------|------|
| NFKC | 全角半角統一 |
| lower | 英字小文字化（MJ → mj） |
| 記号除去 | 句読点・括弧・スラッシュを空白化 |
| 空白分割 | 連続空白を単一化 |
| token 化 | 2 文字未満 token は除外（「を」「に」等の stopword リスト optional） |
| 英数字 | Midjourney → `midjourney` として 1 token または分割ルール |

**固有名詞リストは使わない。** 「桃太郎」token が title にあっても span に無ければ match 加点しない。

### 6.2 スコアリング（token-match-v1）

各 `next_action` に対し:

```
base = 0.0

# span token が title に含まれる
for token in span_tokens:
  if token in title_tokens: base += 0.35
  elif partial_substring_match(token, title): base += 0.20

# description も同様（weight 0.5）
...

# status 補正
if status == "pending": base += 0.10
if status == "done": base -= 0.40
if status == "cancelled": base -= 0.50

# primary context（加点のみ、決定には使わない）
if action.id == primary_next_action_id: base += 0.05

# sort_order 近接（optional v0.2.2.1）
# ...

score = clamp(base, 0.0, 1.0)
```

**partial_substring_match**: span token 長 >= 2 が title 文字列に部分一致（例: `キャラ` in `キャラクター`, `固定` in `固定ルール`）

**MJ 特殊**: token `mj` と title に `midjourney` 含む → alias table（**project 非依存の一般略語表**のみ）

| alias | expands_to |
|-------|------------|
| mj | midjourney |
| 文面 | 本文 |
| 本文 | 本文 |

alias 表は **一般略語** のみ。`キャラ固定` 等 project 語は入れない。

### 6.3 候補採用閾値

| 定数 | 値 | 意味 |
|------|-----|------|
| `MIN_CANDIDATE_SCORE` | **0.65** | これ未満は candidates から除外 |
| `AMBIGUITY_GAP` | **0.10** | top - second < 0.10 → ambiguity medium |
| `MAX_CANDIDATES` | **5** | 返却上限 |

### 6.4 matched_terms / reason

```typescript
matched_terms: ["キャラ", "固定"]  // span tokens that hit title
reason: "title token overlap (2/2 span tokens)"
```

---

## 7. blocker / goal / observation 解決 — 今回やるか

| entity | v0.2.2 | 理由 |
|--------|--------|------|
| **next_action** | **やる** | PriorityChanged / ActionDeferred の主対象 |
| blocker | **やらない** | target_kind が next_action。BlockerMitigated は v0.2.3+ |
| goal | **やらない** | span → goal の convention 未整備 |
| observation | **やらない** | 新規作成 entity。解決不要 |

`ResolutionEntityType` に blocker / goal は **型として予約** するが、v0.2.2 resolver は `next_action` のみ返す。

---

## 8. confidence / score 設計

| 層 | フィールド | 意味 |
|----|-----------|------|
| EventDetector | `SemanticEvent.confidence` | 意味分類の確信度（v0.2.1 既存） |
| EventResolver | `ResolutionCandidate.score` | entity 一致度（v0.2.2 新規） |
| PatchProposal | `confidence` | **意味 + 解決の合成**（v0.2.2 実装時） |

### 合成 confidence 案（実装フェーズ）

```
if resolution_results[0].candidates.length === 0:
  proposal.confidence *= 0.8  // または clarification 検討
if ambiguity_level === "medium":
  proposal.confidence *= 0.9
if ambiguity_level === "high":
  → ClarificationResponse または clarification_question 追加
```

v0.2.2 設計段階では **PatchProposal.confidence は Event confidence を維持** し、`resolution_results` で解決品質を別表示。

---

## 9. ambiguity 処理

| 条件 | ambiguity_level | resolution_note 例 |
|------|-----------------|-------------------|
| candidates 0 件 | **high** | "no next_action matched raw_target_span" |
| 1 件、score >= 0.80 | **none** | — |
| 1 件、0.65 <= score < 0.80 | **low** | "single weak match" |
| 2+ 件、top - second < 0.10 | **medium** | "top candidates within 0.10" |
| 2+ 件、top - second >= 0.10 | **low** | "clear top candidate" |
| candidates 3+ かつ top score < 0.75 | **medium** | "multiple plausible matches" |

**Resolver は ClarificationResponse に昇格しない**（v0.2.2）。  
PatchProposal を返し、`resolution_results` + `clarification_question` optional で人間判断。

例: ambiguity high 時

```json
"clarification_question": "raw_target_span「準備」に該当する next_action が見つかりません。どの action を指していますか？"
```

---

## 10. PatchProposal への resolution_results[] embed 方針

### 型変更

```typescript
export interface PatchProposal {
  // ... v0.2.1 既存 ...
  semantic_events?: SemanticEvent[];
  resolution_results?: ResolutionResult[];  // v0.2.2 追加
}
```

### embed ルール

1. `resolution_results.length` === resolvable events 数（通常 1）
2. resolvable でない event（CandidateCreated 等）は `resolution_results` に含めない
3. `proposed_patch` は **v0.2.1 と同一**（observation / judgment のみ）
4. `selected_candidate_id` は **常に undefined**（v0.2.2）
5. ClarificationResponse にも optional `resolution_results`（StopRequested 前に partial resolve した場合）

### レビュー UX（CLI 将来）

```bash
npm run ground-core -- review-proposal proposal.json
# → semantic_events[0].type
# → resolution_results[0].candidates[0].label (score 0.82)
```

---

## 11. v0.2.2 で作る範囲

| 項目 | 内容 |
|------|------|
| 設計 doc | 本ファイル |
| 型案 | `resolution-types.ts` — ResolutionCandidate, ResolutionResult |
| Interface | `event-resolver.ts` — EventResolver |
| アルゴリズム spec | `token-match-next-action.ts` 設計（normalize + score） |
| PatchProposal 拡張 | `resolution_results[]` |
| semantic-propose 接続設計 | detect → resolve → embed |
| テストケース設計 | 4 代表例 + ambiguity + guard |
| 定数 | MIN_SCORE 0.65, GAP 0.10, MAX 5 |

---

## 12. v0.2.2 で作らない範囲

| 項目 | 延期 |
|------|------|
| 実装 | v0.2.2 実装フェーズ |
| primary_next_action_id 更新 | v0.2.3 |
| next_action status_change | v0.2.3 |
| blocker resolved | v0.2.3+ |
| ActionCompleted / BlockerMitigated event | v0.2.3+ |
| LLM fuzzy matching | v0.2.4+ |
| selected_candidate_id 自動設定 | v0.2.3 以降も human 優先 |
| Web UI / DB / Router | 将来 |
| blocker / goal resolver | v0.2.3+ |

---

## 13. テスト方針

### 13.1 単体 — TokenMatchNextActionResolver

| # | fixture | input span | expected top candidate | min score |
|---|---------|------------|------------------------|-----------|
| R1 | Momotaro | キャラ固定 | 桃太郎のキャラクター固定ルールを整理する | 0.80 |
| R2 | Momotaro | MJ文面 | Midjourneyに投げる本文ルールを確定する | 0.65 |
| R3 | FreeWater | 場所 | 配布場所を1つ決める | 0.80 |
| R4 | Momotaro | 準備 | 0 候補 or ambiguity high | — |

### 13.2 ambiguity

| 条件 | 期待 |
|------|------|
| 「先に準備する」+ 複数 pending action | medium/high |
| top 0.72, second 0.68 | medium |
| 唯一 candidate score 0.90 | none |

### 13.3 ガード

- resolver ソースに `桃太郎` / `FreeWater` / `新宿` リテラルなし
- `キャラ固定` を hardcode match 条件にしない
- done action が top にならない（score  penalized）

### 13.4 統合（実装後）

- propose → PatchProposal に `resolution_results` あり
- `proposed_patch` に primary / status 変更なし
- ProjectState ファイル unchanged

### 13.5 fixture

- `ground-core/__tests__/fixtures/momotaro-minimal.json`
- `ground-core/__tests__/fixtures/freewater-minimal.json`
- storage gitignore 回避

---

## 14. 危険パターン

| # | パターン | 対策 |
|---|----------|------|
| D1 | span「場所」が複数 action に hit | ambiguity medium + 全候補表示 |
| D2 | MJ → 誤 action マッチ | alias 表は一般略語のみ。score  alone で auto-apply しない |
| D3 | done action が top | status penalty -0.40 |
| D4 | primary が常に top | +0.05 のみ。決定因子にしない |
| D5 | title 完全一致 hardcode | token overlap のみ |
| D6 | Resolver が patch に entity_id 注入 | v0.2.2 禁止。resolution_results のみ |
| D7 | selected_candidate_id 自動設定 | v0.2.2 禁止 |
| D8 | 低 score を candidate に含める | MIN 0.65 未満除外 |
| D9 | 固有名詞 token で誤 boost | span 側 token のみ match 対象 |
| D10 | EventDetector が entity 解決 | 責務分離。Resolver のみ |

---

## 15. 代表例 expected resolution

### 例 1 — Momotaro PriorityChanged

**Input**: 「桃太郎はまずキャラ固定からやる」

```json
{
  "event_id": "<uuid>",
  "target_kind": "next_action",
  "raw_target_span": "キャラ固定",
  "candidates": [{
    "entity_type": "next_action",
    "entity_id": "c3333333-3333-4333-8333-333333333301",
    "label": "桃太郎のキャラクター固定ルールを整理する",
    "score": 0.85,
    "matched_terms": ["キャラ", "固定"],
    "reason": "title token overlap (2/2 span tokens)",
    "context": { "status": "pending", "sort_order": 0, "is_primary": true }
  }],
  "ambiguity_level": "none",
  "needs_human_review": true
}
```

### 例 2 — Momotaro ActionDeferred

**Input**: 「MJ文面は後でいい」

```json
{
  "raw_target_span": "MJ文面",
  "candidates": [{
    "entity_id": "c3333333-3333-4333-8333-333333333304",
    "label": "Midjourneyに投げる本文ルールを確定する",
    "score": 0.72,
    "matched_terms": ["mj", "文面"],
    "reason": "title token overlap + mj alias"
  }],
  "ambiguity_level": "low"
}
```

### 例 3 — FreeWater PriorityChanged

**Input**: 「FreeWaterは先に場所を決める」

```json
{
  "raw_target_span": "場所",
  "candidates": [{
    "entity_id": "f3333333-3333-4333-8333-333333333301",
    "label": "配布場所を1つ決める",
    "score": 0.88,
    "matched_terms": ["場所"],
    "reason": "title contains span token"
  }],
  "ambiguity_level": "none"
}
```

### 例 4 — Ambiguous

**Input**: 「先に準備する」（hypothetical project with 準備 in multiple titles）

```json
{
  "raw_target_span": "準備",
  "candidates": [
    { "label": "...", "score": 0.68 },
    { "label": "...", "score": 0.66 }
  ],
  "ambiguity_level": "medium",
  "resolution_note": "top candidates within 0.10"
}
```

または candidates 0 → `ambiguity_level: "high"`

---

## 16. PatchProposal 変更案（完全例）

```json
{
  "id": "...",
  "project_id": "839578f5-36e1-4b6f-9be5-a97520f52b66",
  "input_text": "桃太郎はまずキャラ固定からやる",
  "summary": "優先順位が変わったため observation を記録する提案。",
  "confidence": 0.7,
  "risk_level": "medium",
  "semantic_events": [{
    "type": "PriorityChanged",
    "resolver_hint": {
      "strategy": "semantic_match_next_action",
      "raw_target_span": "キャラ固定"
    }
  }],
  "resolution_results": [{
    "event_id": "...",
    "raw_target_span": "キャラ固定",
    "candidates": [{ "...": "..." }],
    "ambiguity_level": "none",
    "needs_human_review": true
  }],
  "proposed_patch": {
    "operations": [{ "entity": "observation", "op": "upsert" }]
  },
  "requires_human_approval": true
}
```

---

## 17. 実装に進む前の確認ポイント

1. **MIN_CANDIDATE_SCORE 0.65** — 例 2 MJ文面 が閾値を超えるか fixture で検証
2. **alias 表の scope** — mj / 文面 / 本文 のみで十分か
3. **stopword リスト** — 日本語助詞を token から除外するか
4. **description match weight** — title 0.35 / desc 0.20 でよいか
5. **ambiguity high 時** — PatchProposal のまま vs ClarificationResponse 昇格
6. **resolution_results を ClarificationResponse にも載せるか**
7. **MAX_CANDIDATES 5** — CLI 表示上限
8. **合成 confidence** — v0.2.2 実装で PatchProposal.confidence を変えるか
9. **fixture 複製** — storage → `__tests__/fixtures/` 正式化
10. **v0.2.3 scope** — selected_candidate_id 確定後の primary 更新 patch 提案

---

## 18. ファイル構成案（実装フェーズ）

```
ground-core/extraction/semantic/
  resolution-types.ts       # ResolutionCandidate, ResolutionResult
  event-resolver.ts         # EventResolver interface
  token-match-resolver.ts   # v0.2.2 実装
  normalize.ts              # span / title 正規化
  score-next-action.ts      # スコアリング
  alias-table.ts            # mj → midjourney 等（一般略語のみ）
  semantic-propose.ts       # resolve 呼び出し + embed
  __tests__/
    token-match-resolver.test.ts
    resolution-fixtures/
      momotaro-minimal.json
      freewater-minimal.json
docs/
  GROUND_CORE_V0.2.2_EVENT_RESOLVER_DESIGN.md
```

---

## 19. 関連ドキュメント

- [GROUND_CORE_V0.2.1_SEMANTIC_EXTRACTION.md](./GROUND_CORE_V0.2.1_SEMANTIC_EXTRACTION.md)
- [GROUND_CORE_V0.2.1_SEMANTIC_MANUAL_RUN.md](./GROUND_CORE_V0.2.1_SEMANTIC_MANUAL_RUN.md)
- [GROUND_CORE_V0.2.1_SEMANTIC_EXTRACTION_DESIGN.md](./GROUND_CORE_V0.2.1_SEMANTIC_EXTRACTION_DESIGN.md)
