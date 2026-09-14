# GROUND Core v0.3 — Director Engine 設計

> **地位**: ProjectState を **読むだけ** で「今どこにいるか / 次に何をするべきか / なぜそれか」を説明する **監督（Director）** 層。  
> **v0.3 の位置づけ**: **設計のみ**。実装・自動保存・LLM API は **行わない**。

前段: [GROUND_CORE_V0.2.3_STATUS_REPORT.md](./GROUND_CORE_V0.2.3_STATUS_REPORT.md)

---

## 0. 背景と思想

### GROUND Core の役割分担

| レイヤ | 比喩 | 責務 |
|--------|------|------|
| **State Engine** | 記録 OS | ProjectState の保存・patch 適用 |
| **Extraction + Review** | 入力係 | 自然文 → 提案 → 人間承認 → patch |
| **Director Engine** | 監督 | 保存済み state から **次の一手を説明** |

```
ProjectState（read-only）
        ↓
   DirectorEngine.recommend()
        ↓
   DirectorReport / Recommendation
        ↓
   人間が読んで判断（決定権は常に人間）
```

### 絶対原則

| 原則 | 説明 |
|------|------|
| **純粋関数** | `ProjectState → Recommendation`。副作用なし |
| **提案のみ** | patch 生成・saveProject・primary 更新は **しない** |
| **説明可能** | 必ず `RecommendationReason[]` を返す。「なんとなくこれ」禁止 |
| **決定権は人間** | Director は監督。代わりに決めない |
| **LLM なし** | ルール + スコアリングのみ（v0.3） |
| **固有名詞非依存** | project 名・地名を条件ハードコードしない |

### v0.2.3 との関係

| 機能 | v0.2.3 Extraction | v0.3 Director |
|------|-------------------|---------------|
| 入力 | 自然文 | ProjectState |
| 出力 | PatchProposal / approved patch | Recommendation |
| primary 更新 | human approve 後 patch | **しない** |
| 用途 | 「言ったことを state に反映」 | 「今 state から次を読む」 |

Extraction と Director は **補完**。Director は Extraction の代替ではない。

---

## 1. DirectorEngine interface

```typescript
import type { ProjectState } from "../types.js";
import type { DirectorReport } from "./director-types.js";

export interface DirectorInput {
  project_state: ProjectState;
  /** v0.3: 未使用。将来 options 用 */
  options?: DirectorOptions;
}

export interface DirectorOptions {
  /** 代替候補の最大数（default: 3） */
  max_alternatives?: number;
  /** in_progress を primary 候補に含めるか（default: true） */
  include_in_progress?: boolean;
}

/** v0.3 — ルールベース監督。LLM なし */
export interface DirectorEngine {
  readonly name: string; // "rule-director-v1"
  recommend(input: DirectorInput): DirectorReport;
}

/** 解決可能な action status（推薦対象） */
export const RECOMMENDABLE_ACTION_STATUSES = [
  "pending",
  "in_progress",
] as const;
```

### 処理フロー（実装フェーズ）

```
1. validateProjectState（読取前の整合性）
2. buildSituationSnapshot(state)     — 「今どこにいるか」
3. collectOpenBlockers(state)        — 「何が止めているか」
4. scoreActions(state)               — 全 next_action にスコア + reasons
5. pickPrimaryRecommendation(scored) — primary + alternatives
6. computeConfidence(report)         — 確信度
7. assembleDirectorReport()
```

---

## 2. Recommendation 型

```typescript
export type RecommendationEntityType = "next_action";

export interface Recommendation {
  recommendation_id: string; // UUID v4
  project_id: string;

  /** 最優先の次の一手 */
  primary_recommendation: ActionRecommendation;

  /** スコア順。primary と重複しない */
  alternative_recommendations: ActionRecommendation[];

  /** 0.0–1.0。計算根拠は confidence_factors */
  confidence: number;

  /** 人間が判断する前に読むべき注意 */
  requires_human_decision: true;

  generated_at: string; // ISO 8601
}

export interface ActionRecommendation {
  entity_type: RecommendationEntityType;
  entity_id: string;
  label: string; // next_action.title
  score: number; // 0.0–1.0（相対スコア）

  /** なぜこの action か（必須・空禁止） */
  reasons: RecommendationReason[];

  /** 関連 blocker（解消・関連の説明用） */
  related_blocker_ids: string[];

  /** 未完了の depends_on（あれば実行不可の説明） */
  blocked_by_action_ids: string[];

  /** primary_next_action_id と一致するか */
  matches_current_primary: boolean;
}
```

---

## 3. RecommendationReason 型

```typescript
export type RecommendationReasonKind =
  | "primary_action"           // current_state.primary_next_action_id と一致
  | "dependency_ready"         // depends_on が done / なし
  | "dependency_blocked"       // depends_on が未完了（減点・警告）
  | "blocker_link"             // action.blocker_id が open blocker に紐づく
  | "blocker_severity"         // 紐づく blocker の severity
  | "goal_alignment"           // primary_goal_id と action.goal_id 一致
  | "sort_order"               // チェーン上の位置
  | "unlocks_downstream"       // 完了すると N 件の downstream が解放
  | "status_penalty"           // done / cancelled / 非 pending
  | "project_status"           // project paused 等
  | "phase_context"            // current_state.phase / summary 参照
  | "judgment_hold"            // 直近 judgment が hold
  | "no_eligible_actions";     // 推薦可能 action が 0

export interface RecommendationReason {
  kind: RecommendationReasonKind;
  /** 人間可読。必須 */
  message: string;
  /** 機械可読。entity 参照 */
  entity_type?: "next_action" | "blocker" | "goal" | "judgment" | "project";
  entity_id?: string;
  /** 加点 (+) / 減点 (-) / 中立 (0) */
  weight: number;
  /** スコア計算への寄与（optional） */
  score_delta?: number;
}
```

**Explainability ルール**: `reasons.length >= 1` を primary / 各 alternative で強制。`message` は空文字禁止。

---

## 4. DirectorReport 型

DirectorReport は Recommendation を包み、Director が答える **6 つの質問** に対応する。

```typescript
export interface DirectorReport {
  schema_version: "0.3.0";
  engine: string; // "rule-director-v1"
  project_id: string;
  generated_at: string;

  /** Q1: 今どこにいる？ */
  situation: SituationSnapshot;

  /** Q2: 何が止めている？ */
  open_blockers: BlockerSnapshot[];

  /** Q3–Q6: 次にやるべきこと / 理由 / 代替 / 確信度 */
  recommendation: Recommendation;

  /** confidence の内訳 */
  confidence_factors: ConfidenceFactor[];

  /** 人間向け要約（CLI stdout 用） */
  summary_text: string;
}

export interface SituationSnapshot {
  project_title: string;
  project_status: ProjectStatus;
  phase: string | null;
  primary_goal_id: string | null;
  primary_goal_title: string | null;
  primary_next_action_id: string | null;
  primary_next_action_title: string | null;
  state_summary: string;
  state_confidence: number | null;
  pending_action_count: number;
  open_blocker_count: number;
}

export interface BlockerSnapshot {
  blocker_id: string;
  title: string;
  severity: BlockerSeverity;
  status: BlockerStatus;
  linked_action_ids: string[]; // next_actions where blocker_id matches
}

export interface ConfidenceFactor {
  label: string;
  value: number; // 0.0–1.0 寄与
  explanation: string;
}
```

### DirectorReport 人間可読例（Momotaro）

```
Current Phase:
  production_design

Primary Goal:
  桃太郎 trial v1 の制作設計を安定させる

Primary Recommendation:
  桃太郎のキャラクター固定ルールを整理する

Reasons:
  - current_state.primary_next_action_id と一致
  - depends_on なし（すぐ着手可能）
  - 年齢別ビジュアルライン等 3 件の downstream を解放
  - open blocker「キャラクター一貫性が未確定」に紐づく

Blocked By:
  キャラクター一貫性が未確定（severity: high）

Alternative Recommendations:
  （なし — 依存チェーン上 3301 以外は depends_on 未完了）

Confidence:
  0.87
```

---

## 5. Scoring Model

### 5.1 対象 action のフィルタ

| 条件 | 結果 |
|------|------|
| status `pending` / `in_progress` | スコア対象 |
| status `done` / `cancelled` | **除外**（reason: status_penalty のみ記録可） |
| `depends_on_action_id` が未完了 | スコア対象だが **大幅減点** |
| project.status `paused` / `archived` / `completed` | 全 action 減点 + 警告 reason |

### 5.2 加点（score_delta 案）

| 要素 | delta | kind |
|------|-------|------|
| `current_state.primary_next_action_id === action.id` | +0.35 | primary_action |
| depends_on なし、または depends_on が done | +0.20 | dependency_ready |
| action.goal_id === primary_goal_id | +0.15 | goal_alignment |
| 紐づく open blocker あり（解消に直結） | +0.10 | blocker_link |
| blocker severity high / critical | +0.05〜+0.10 | blocker_severity |
| downstream 解放数 × 0.05（max +0.15） | +0.05〜+0.15 | unlocks_downstream |
| sort_order がチェーン先頭（depends_on なし） | +0.05 | sort_order |
| status `in_progress` | +0.05 | （status ボーナス） |

### 5.3 減点

| 要素 | delta | kind |
|------|-------|------|
| depends_on が pending / in_progress | -0.50 | dependency_blocked |
| depends_on が存在しないが FK 不正 | -1.0（除外） | — |
| 紐づく blocker が open だが action が blocker 解消と無関係 | 0（情報のみ） | blocker_link |
| project.status !== active | -0.30 | project_status |
| 最新 judgment outcome === hold（同一 goal） | -0.05（情報） | judgment_hold |

### 5.4 正規化

```
raw_score = sum(score_delta)
normalized = clamp(raw_score, 0, 1)
```

- primary: 最高 normalized を選択
- alternatives: 2 位以降、primary との差 >= 0.10 または normalized >= 0.40、最大 3 件
- 同点: sort_order asc → created_at asc

### 5.5 primary_next_action_id との関係

| ケース | 振る舞い |
|--------|---------|
| primary が最高スコア | primary を推薦 + `matches_current_primary: true` |
| スコア最高 ≠ primary | **スコア最高を primary_recommendation**、current primary を alternative に載せ reason 付き |
| primary が done / 存在しない | スコア最高を推薦 + reason「primary が無効/完了」 |

**v0.3 方針**: Director は primary を **上書き提案しない**。スコアと primary が乖離した場合は **両方 reason で説明** し、人間が patch / Extraction で primary を更新する。

---

## 6. Priority Rules

| ID | ルール | 説明 |
|----|--------|------|
| P1 | **Dependency gate** | depends_on 未完了 action は primary にならない（normalized 上限 0.35） |
| P2 | **Primary alignment** | primary_next_action_id 一致は強い加点だが、P1 に負けない |
| P3 | **Chain head first** | 依存チェーンの先頭 pending を優先（FreeWater 場所、Momotaro キャラ固定） |
| P4 | **Goal scope** | primary_goal_id 配下の action を優先。他 goal は alternative のみ |
| P5 | **In-progress continuity** | in_progress が 1 件のみなら継続推薦を reason に明記 |
| P6 | **Sort order tie-break** | 同スコア時 sort_order 昇順 |
| P7 | **No eligible actions** | pending/in_progress が 0 → primary なし + reason no_eligible_actions |
| P8 | **Human primary 尊重** | Director は primary を変更しない。乖離時は summary_text で明示 |

---

## 7. Blocker Rules

| ID | ルール | 説明 |
|----|--------|------|
| B1 | **Open only** | status `open` の blocker を `open_blockers[]` に載せる |
| B2 | **Action link** | `next_action.blocker_id` で blocker ↔ action を双方向リンク |
| B3 | **Severity weight** | critical +0.10 / high +0.07 / medium +0.04 / low +0.02（blocker_severity） |
| B4 | **Blocked By 表示** | primary 推薦 action の blocker_id から BlockerSnapshot.title を「Blocked By」に |
| B5 | **Mitigated / resolved** | 推薦理由には載せない（解消済み） |
| B6 | **Orphan blocker** | action に紐づかない open blocker は situation に列挙、primary 理由には間接記載 |
| B7 | **No auto-resolve** | Director は blocker status を変えない |

### Blocker → Reason メッセージ例

```
open blocker「{blocker.title}」（severity: {severity}）の解消に直結する action
```

---

## 8. Confidence Model

### 8.1 計算方針

Confidence は **推薦の確信度**（正しさの保証ではない）。人間が「この提案を信じてよいか」の目安。

```
confidence = clamp(
  base(primary.normalized_score)
  × dependency_factor
  × primary_alignment_factor
  × project_status_factor
  × ambiguity_penalty,
  0.0, 1.0
)
```

### 8.2 因子

| 因子 | 計算 | 説明 |
|------|------|------|
| base | primary.score | スコアそのもの |
| dependency_factor | 1.0 if ready else 0.5 | depends_on 未完了で半減 |
| primary_alignment_factor | 1.0 if matches_current_primary else 0.85 | primary 乖離時やや下げ |
| project_status_factor | 1.0 active / 0.6 paused / 0.4 archived | |
| ambiguity_penalty | top - second < 0.10 → ×0.85 | 僅差で alternative あり |
| state_confidence_blend | optional: ×0.9 + state.confidence×0.1 | current_state.confidence を微量反映 |

### 8.3 confidence_factors 出力例

```json
[
  { "label": "primary_score", "value": 0.90, "explanation": "normalized score 0.90" },
  { "label": "dependency_ready", "value": 1.0, "explanation": "depends_on なし" },
  { "label": "primary_alignment", "value": 1.0, "explanation": "matches primary_next_action_id" },
  { "label": "ambiguity", "value": 1.0, "explanation": "2位との差 0.45" }
]
```

### 8.4 代表期待値（fixture 検証用）

| Project | primary action | 期待 confidence |
|---------|---------------|-----------------|
| Momotaro | キャラ固定（3301） | 0.85–0.92 |
| FreeWater | 配布場所（3301） | 0.85–0.92 |

---

## 9. Explainability 方針

### 必須

1. すべての `ActionRecommendation` に `reasons.length >= 1`
2. 各 `RecommendationReason.message` は **日本語・具体**（entity title 参照可）
3. `summary_text` は 5–12 行の人間可読要約
4. スコア内訳を `score_delta` で trace 可能
5. primary ≠ current primary 時は **乖離を明示**

### 禁止

| 禁止 | 代替 |
|------|------|
| 「なんとなくこれ」 | kind + message + weight |
| 理由なし alternative | alternative も reasons 必須 |
| ブラックボックス score | confidence_factors 公開 |
| 自動 primary 更新 | 人間が patch / Extraction 経由 |

### reason メッセージテンプレート（v0.3）

| kind | テンプレート |
|------|-------------|
| primary_action | `current_state の primary_next_action と一致: {title}` |
| dependency_ready | `前提 action は完了済み（または依存なし）で着手可能` |
| dependency_blocked | `前提 action「{title}」が未完了のため実行不可` |
| unlocks_downstream | `完了すると {n} 件の downstream action が解放される` |
| blocker_link | `open blocker「{title}」の解消に直結` |
| goal_alignment | `primary goal「{title}」に属する` |

---

## 10. CLI 仕様案

### コマンド

```bash
npm run ground-core -- recommend <project_id> [--out <report_json_path>] [--format text|json]
```

| フラグ | 説明 |
|--------|------|
| `--out` | DirectorReport JSON 保存（optional） |
| `--format` | `text`（default）= summary_text / `json` = フル JSON |

### 動作

1. `loadProject(project_id)` — **read-only**
2. `ruleDirector.recommend({ project_state })`
3. stdout に要約出力
4. `--out` 指定時 JSON 保存
5. **saveProject しない**

### exit code

| code | 意味 |
|------|------|
| 0 | 推薦生成成功 |
| 1 | project 不存在 / 推薦可能 action なし（警告付き report） |
| 2 | validation エラー |

### stdout 例（text format）

```
GROUND Core Director Report
project: Japanese Folktale / Momotaro (839578f5-...)

Current Phase: production_design
Primary Goal: 桃太郎 trial v1 の制作設計を安定させる

Open Blockers (3):
  - [high] キャラクター一貫性が未確定
  - [medium] 年齢ごとの見た目ルールが未整理
  - [medium] Midjourney用プロンプトの運用ルールが揺れやすい

Primary Recommendation:
  桃太郎のキャラクター固定ルールを整理する
  score: 0.90 | confidence: 0.87

Reasons:
  + current_state の primary_next_action と一致
  + 依存なし — すぐ着手可能
  + 3 件の downstream action を解放
  + blocker「キャラクター一貫性が未確定」に紐づく

Alternative Recommendations:
  （なし — 依存未完了）

requires_human_decision: true
```

---

## 11. テスト方針

### 11.1 単体テスト（`ground-core/__tests__/director-engine.test.ts` 想定）

| # | ケース | 期待 |
|---|--------|------|
| 1 | Momotaro fixture | primary = キャラ固定（3301） |
| 2 | FreeWater fixture | primary = 配布場所（3301） |
| 3 | depends_on 未完了 action | primary にならない |
| 4 | primary_next_action_id 一致 | matches_current_primary + reason |
| 5 | downstream 解放数 | unlocks_downstream reason |
| 6 | open blocker リンク | blocker_link + BlockerSnapshot |
| 7 | done action | 推薦対象外 |
| 8 | project paused | confidence 低下 + project_status reason |
| 9 | 全 action done | no_eligible_actions |
| 10 | reasons 空禁止 | 全 recommendation に reasons >= 1 |
| 11 | Director は state 不変 | recommend 前後 JSON 一致 |
| 12 | ソースに project 固有語なし | grep ガード |
| 13 | confidence 0–1 | 範囲内 |
| 14 | alternatives 最大 3 | 上限 |
| 15 | summary_text 非空 | CLI 用 |

### 11.2 実プロジェクト manual run

| Project | 検証 |
|---------|------|
| Momotaro | `recommend` → キャラ固定 + 理由 + confidence |
| FreeWater | `recommend` → 配布場所 + 理由 + confidence |

ドキュメント: `docs/GROUND_CORE_V0.3_DIRECTOR_MANUAL_RUN.md`（実装フェーズ）

### 11.3 Extraction との整合

| 検証 | 内容 |
|------|------|
| propose PriorityChanged + approve | primary と Director 推薦が一致するか |
| 乖離ケース | primary を手動でズラした fixture で Director が reason 付きで別候補を出すか |

---

## 12. v0.3 で作る範囲

| 項目 | 内容 |
|------|------|
| `DirectorEngine` interface | rule-director-v1 |
| 型 | Recommendation, RecommendationReason, DirectorReport, SituationSnapshot |
| スコアリング | P1–P8, B1–B7, 加点/減点表 |
| Confidence | 因子分解 + confidence_factors |
| Explainability | reasons 必須、summary_text |
| CLI | `recommend`（read-only） |
| テスト | 15 ケース + 2 project manual run |
| docs | 本設計 + manual run + STATUS 更新 |

### v0.3 完了定義

1. `recommend <project_id>` が Momotaro / FreeWater で期待 primary を返す
2. すべての推薦に `reasons[]` がある
3. `recommend` は ProjectState を変更しない
4. patch / propose / save を呼ばない
5. `npm run test:ground-core` 全通過（Director テスト含む）
6. manual run ドキュメント 2 件

---

## 13. v0.4 に送る範囲

→ **v0.4 設計**: [GROUND_CORE_V0.4_MULTI_PROJECT_DIRECTOR_DESIGN.md](./GROUND_CORE_V0.4_MULTI_PROJECT_DIRECTOR_DESIGN.md)（Portfolio Director / Multi Project）

| 項目 | 理由 |
|------|------|
| Review UI / Web UI | v0.3 は CLI のみ |
| Goal Graph 可視化 | 読取はするが graph UI は別 |
| LLM-assisted Director | ルールベース安定後 |
| Director → PatchProposal 連携 | 「推薦を propose に渡す」は v0.4 |
| Director → primary 自動 patch 提案 | Extraction + Review 経路を維持 |
| 複数 goal 並行スコアリング | v0.3 は primary_goal スコープ |
| hypothesis / decision 深い reasoning | v0.3 は blocker + dependency 中心 |
| ApprovedPatchBundle 連携 | v0.2.4 系 |
| PostgreSQL / Router | スコープ外 |
| due_at 期限スコア | v0.4 で追加可 |
| observation / judgment テキスト NLP | LLM なしでは浅い参照のみ |

---

## 14. 実プロジェクト期待出力（設計検証）

### Momotaro（839578f5-36e1-4b6f-9be5-a97520f52b66）

| 項目 | 期待 |
|------|------|
| phase | production_design |
| primary recommendation | 桃太郎のキャラクター固定ルールを整理する |
| blocked by | キャラクター一貫性が未確定 |
| key reason | 年齢別ビジュアル等が depends_on / downstream 依存 |
| alternatives | 3302 以降は depends_on 未完了のため 0 または低スコア |
| confidence | ~0.87 |

### FreeWater（28d83a68-2064-43d7-94cb-72656b9006de）

| 項目 | 期待 |
|------|------|
| phase | phase0_manual_test |
| primary recommendation | 配布場所を1つ決める |
| blocked by | 配布場所が未確定 |
| key reason | チェーン先頭 / 水・看板・現場テストの前提 |
| alternatives | 3302 以降 depends_on 未完了 |
| confidence | ~0.87 |

---

## 15. ファイル構成案（実装フェーズ）

```
ground-core/director/
  director-types.ts       # Recommendation, DirectorReport, ...
  rule-director.ts        # ruleDirector.recommend()
  score-action.ts         # スコアリング
  situation.ts            # SituationSnapshot, BlockerSnapshot
  confidence.ts           # confidence 計算
  templates.ts            # reason メッセージ（一般テンプレのみ）
ground-core/cli.ts        # recommend コマンド
ground-core/__tests__/
  director-engine.test.ts
docs/
  GROUND_CORE_V0.3_DIRECTOR_ENGINE_DESIGN.md  # 本書
  GROUND_CORE_V0.3_DIRECTOR_MANUAL_RUN.md      # 実装後
```

---

## 16. 関連ドキュメント

- [GROUND_CORE_V0.2.3_STATUS_REPORT.md](./GROUND_CORE_V0.2.3_STATUS_REPORT.md)
- [GROUND_CORE_V0.2.3_HUMAN_REVIEW_BRIDGE.md](./GROUND_CORE_V0.2.3_HUMAN_REVIEW_BRIDGE.md)
- [GROUND_CORE_V0.2.2_EVENT_RESOLVER.md](./GROUND_CORE_V0.2.2_EVENT_RESOLVER.md)
