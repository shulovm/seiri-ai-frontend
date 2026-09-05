# GROUND Core v0.4 — Multi Project Director（Portfolio Director）設計

> **地位**: 複数 `ProjectState` を横断し、「**今日やるべき一手**」を説明付きで提案する **総監督（Portfolio Director）** 層。  
> **v0.4 の位置づけ**: **設計のみ**。実装・自動保存・LLM API は **行わない**。

前段: [GROUND_CORE_V0.3_DIRECTOR_ENGINE_DESIGN.md](./GROUND_CORE_V0.3_DIRECTOR_ENGINE_DESIGN.md)  
実装済み v0.3: [GROUND_CORE_V0.3_DIRECTOR_ENGINE.md](./GROUND_CORE_V0.3_DIRECTOR_ENGINE.md)

---

## 0. 背景と思想

### レイヤの比喩

| レイヤ | 比喩 | 入力 | 出力 | スコープ |
|--------|------|------|------|----------|
| **State Engine + Extraction** | 記録 OS / 入力係 | 自然文 / patch | ProjectState | 1 project |
| **Director Engine (v0.3)** | 各プロジェクトの監督 | ProjectState | DirectorReport | 1 project |
| **Portfolio Director (v0.4)** | 全プロジェクトの総監督 | ProjectState[] + DirectorReport[] | PortfolioReport | N projects |

```
v0.3 Director:
  ProjectState
        ↓
  DirectorReport / Recommendation

v0.4 Portfolio Director:
  ProjectState[]  ──┐
                    ├──→  PortfolioDirector.recommendPortfolio()
  DirectorReport[] ─┘
        ↓
  PortfolioReport / PortfolioRecommendation
        ↓
  人間が読んで判断（決定権は常に人間）
```

### 絶対原則

| 原則 | 説明 |
|------|------|
| **純粋関数** | `(ProjectState[], DirectorReport[]) → PortfolioReport`。副作用なし |
| **提案のみ** | patch 生成・saveProject・primary 更新・Director→Patch 自動生成は **しない** |
| **説明可能** | 「なんとなく」禁止。1 位 / 2 位 / 後回しの理由を必ず返す |
| **決定権は人間** | Portfolio Director は総監督。代わりに決めない |
| **LLM なし** | ルール + スコアリングのみ（v0.4） |
| **固有名詞非依存** | project 名・地名・キャラ名を条件ハードコードしない |
| **v0.3 を再利用** | 各 project の action スコアは DirectorReport から読む。二重計算しない |

### v0.4 でやらないこと

OpenAI API / Anthropic API / LLM / 自動保存 / 自動適用 / Web UI / Router / PostgreSQL / Goal Graph 実装 / Director → Patch 自動生成

### Portfolio Director が答える 6 つの質問

| # | 質問 | PortfolioReport のフィールド |
|---|------|------------------------------|
| 1 | 今日一番やる価値があるのは何か？ | `portfolio_recommendation.primary_recommendation` |
| 2 | なぜそれなのか？ | `primary_recommendation.reasons[]` + `why_not_alternatives[]` |
| 3 | 今はやらなくていいものは何か？ | `deferred_recommendations[]` |
| 4 | どの project が止まっているか？ | `blocked_projects[]` / `project_health` where status ∈ blocked/stalled |
| 5 | どの project が進んでいるか？ | `progressing_projects[]` / status = progressing |
| 6 | 全体のボトルネックは何か？ | `portfolio_bottleneck` |

### 検証対象プロジェクト（実プロジェクト）

| Project | project_id | 備考 |
|---------|------------|------|
| **GROUND Core** | `34092589-569a-4eec-923d-a105b6b1402c` | メタ / インフラ。examples: `ground-core-manual-run.patch.json` |
| **FreeWater** | `28d83a68-2064-43d7-94cb-72656b9006de` | 現場検証。examples: `freewater-phase0.patch.json` |
| **Momotaro** | `839578f5-36e1-4b6f-9be5-a97520f52b66` | 創作制作。examples: `momotaro-production-design.patch.json` |

---

## 1. PortfolioDirector interface

```typescript
import type { ProjectState } from "../types.js";
import type { DirectorReport } from "../director/types.js";
import type { PortfolioReport } from "./portfolio-types.js";

export interface PortfolioInput {
  /** 横断対象の ProjectState。project_id 一意 */
  project_states: ProjectState[];

  /** 各 project の v0.3 Director 出力。project_states と 1:1 対応必須 */
  director_reports: DirectorReport[];

  options?: PortfolioDirectorOptions;
}

export interface PortfolioDirectorOptions {
  /** 代替候補の最大数（default: 2） */
  max_alternatives?: number;

  /** cross_project_score の最小閾値。これ未満は primary 候補外（default: 0.25） */
  min_eligible_score?: number;

  /** stalled / completed project を ranking から除外するか（default: false = 表示はするが減点） */
  exclude_inactive_from_primary?: boolean;
}

/** v0.4 — ルールベース総監督。LLM なし */
export interface PortfolioDirector {
  readonly name: string; // "rule-portfolio-director-v1"
  recommendPortfolio(input: PortfolioInput): PortfolioReport;
}
```

### 処理フロー（実装フェーズ）

```
1. validatePortfolioInput(states, reports)     — project_id 1:1、schema 整合
2. for each project: extract Director primary   — 既存 DirectorReport から読取
3. computeProjectHealth(state, report)          — 各 project の健康度
4. computeCrossProjectScores(health[])          — 横断スコア + urgency + momentum
5. rankProjects(scored[])                       — cross_project_score 降順
6. pickPortfolioPrimary(ranked)                 — 今日の一手
7. buildDeferredList(ranked, primary)           — 後回し + 理由
8. detectBlocked / detectProgressing            — 止まり / 進行中
9. synthesizePortfolioBottleneck(health[])      — 全体ボトルネック 1 件
10. assemblePortfolioReport() + summary_text
```

**重要**: Portfolio Director は **DirectorEngine を内包呼び出ししない**（純粋関数の合成は CLI / テスト側）。`recommendPortfolio` の入力に `DirectorReport[]` を要求し、action レベルのスコアは v0.3 に委譲する。

---

## 2. PortfolioReport 型

```typescript
export interface PortfolioReport {
  schema_version: "0.4.0";
  engine: string; // "rule-portfolio-director-v1"
  generated_at: string; // ISO 8601

  /** Q1–Q3: 今日の一手 + 代替 + 後回し */
  portfolio_recommendation: PortfolioRecommendation;

  /** 全 project の cross_project_score 順 */
  project_ranking: RankedProjectEntry[];

  /** 各 project の健康度スナップショット */
  project_health: ProjectHealth[];

  /** Q4: 止まっている project */
  blocked_projects: BlockedProjectSnapshot[];

  /** Q5: 進んでいる project */
  progressing_projects: ProgressingProjectSnapshot[];

  /** Q6: 横断ボトルネック（1 件に集約） */
  portfolio_bottleneck: PortfolioBottleneck;

  /** Q3 詳細: 意図的に後回しにした project × action */
  deferred_recommendations: DeferredRecommendation[];

  /** portfolio confidence の内訳 */
  confidence_factors: PortfolioConfidenceFactor[];

  /** 人間向け要約（CLI stdout 用、10–20 行） */
  summary_text: string;

  requires_human_decision: true;
}

export interface RankedProjectEntry {
  rank: number; // 1-based
  project_id: string;
  project_title: string;
  cross_project_score: number;
  urgency_score: number;
  momentum_score: number;
  recommended_action_id: string;
  recommended_action_title: string;
}

export interface BlockedProjectSnapshot {
  project_id: string;
  project_title: string;
  health_status: "blocked" | "stalled" | "paused";
  primary_blocker_title: string | null;
  blocked_action_title: string | null;
  reasons: PortfolioRecommendationReason[];
}

export interface ProgressingProjectSnapshot {
  project_id: string;
  project_title: string;
  momentum_score: number;
  in_progress_action_count: number;
  reasons: PortfolioRecommendationReason[];
}

export interface PortfolioBottleneck {
  /** 横断的に最も効く unblock 候補 */
  project_id: string;
  project_title: string;
  next_action_id: string;
  next_action_title: string;
  blocker_title: string | null;
  downstream_unlock_count: number;
  explanation: string;
  reasons: PortfolioRecommendationReason[];
}

export interface DeferredRecommendation {
  project_id: string;
  project_title: string;
  next_action_id: string;
  next_action_title: string;
  defer_reasons: PortfolioRecommendationReason[];
}

export interface PortfolioConfidenceFactor {
  label: string;
  value: number; // 0.0–1.0 寄与
  explanation: string;
}
```

---

## 3. PortfolioRecommendation 型

```typescript
export interface PortfolioRecommendation {
  recommendation_id: string; // UUID v4
  primary_recommendation: PortfolioPrimaryRecommendation;
  alternative_recommendations: PortfolioPrimaryRecommendation[];
  confidence: number; // 0.0–1.0
  requires_human_decision: true;
  generated_at: string;
}

/** 横断 primary = project_id + next_action_id */
export interface PortfolioPrimaryRecommendation {
  project_id: string;
  project_title: string;
  next_action_id: string;
  next_action_title: string;

  cross_project_score: number;
  urgency_score: number;
  momentum_score: number;

  /** Director v0.3 から継承した action スコア（参考値） */
  director_action_score: number;
  director_confidence: number;

  /** なぜ 1 位（または alternative）か */
  reasons: PortfolioRecommendationReason[];

  /** なぜ 2 位じゃないか — primary のみ必須。alternative は optional */
  why_not_alternatives: WhyNotAlternative[];
}

export interface WhyNotAlternative {
  compared_project_id: string;
  compared_action_id: string;
  compared_action_title: string;
  reasons: PortfolioRecommendationReason[];
}
```

### PortfolioRecommendationReason

```typescript
export type PortfolioRecommendationReasonKind =
  | "director_primary"           // v0.3 Director が選んだ primary action
  | "cross_project_rank"         // 横断スコア順位
  | "urgency_high"               // urgency 因子
  | "momentum_signal"            // 動いている / 止まっている
  | "downstream_unlock"          // 完了で N 件解放（project 内）
  | "blocker_severity"           // open blocker の severity
  | "dependency_ready"           // 着手可能
  | "dependency_blocked"         // 依存未完了で止まり
  | "project_active"             // project.status === active
  | "project_inactive_penalty"   // paused / archived / completed
  | "no_eligible_actions"        // 推薦可能 action なし
  | "stalled_penalty"            // 停滞シグナル
  | "meta_work_defer"            // インフラ系 action の構造シグナル（固有名詞なし）
  | "field_validation_priority"  // 現場検証チェーン先頭（構造: blocker+短チェーン）
  | "defer_explicit";            // 後回し明示

export interface PortfolioRecommendationReason {
  kind: PortfolioRecommendationReasonKind;
  message: string; // 日本語・具体。空禁止
  entity_type?: "project" | "next_action" | "blocker" | "goal";
  entity_id?: string;
  weight: number;
  score_delta?: number;
}
```

---

## 4. ProjectHealth 型

```typescript
export type ProjectHealthStatus =
  | "progressing"  // in_progress あり、または高 momentum
  | "ready"        // 着手可能だが momentum 低
  | "blocked"      // primary が depends_on / blocker で実行不可
  | "stalled"      // eligible action あるが movement シグナルなし
  | "completed"    // 推薦可能 action なし / project completed
  | "paused";      // project.status !== active

export interface ProjectHealth {
  project_id: string;
  project_title: string;

  /** 0.0–1.0 総合健康度（下記 4 因子の合成） */
  health_score: number;

  /** 0.0–1.0 動いている度 → §7 Momentum */
  momentum_score: number;

  /** 0.0–1.0 高いほど blocker が重い（悪化度） */
  blocker_score: number;

  /** 0.0–1.0 v0.3 Director primary action score */
  recommendation_score: number;

  /** 0.0–1.0 今やるべき度 → §6 Urgency */
  urgency_score: number;

  /** 0.0–1.0 横断優先度 → §5 CrossProjectScore */
  cross_project_score: number;

  status: ProjectHealthStatus;

  open_blocker_count: number;
  primary_blocker_title: string | null;
  pending_action_count: number;
  in_progress_action_count: number;
  director_confidence: number;
}
```

### health_score 合成（実装案）

```
health_score = clamp(
  0.35 * recommendation_score
  + 0.25 * momentum_score
  + 0.25 * urgency_score
  + 0.15 * (1 - blocker_score_normalized)
  - stalled_penalty
  - inactive_penalty,
  0, 1
)
```

---

## 5. CrossProjectScore モデル

Portfolio 層の **横断優先度**。v0.3 の action score を **入力の一因子** とし、project 横断で再ランクする。

### 5.1 加点因子

| 因子 | ソース | delta 案 | kind |
|------|--------|----------|------|
| Director recommendation score | `DirectorReport.recommendation.primary_recommendation.score` | × 0.40（重み） | director_primary |
| Blocker severity | primary action に紐づく open blocker | critical +0.15 / high +0.10 / medium +0.05 | blocker_severity |
| Downstream impact | primary の `unlocks_downstream` reason | min(count × 0.04, 0.16) | downstream_unlock |
| Dependency unlock count | 同上 count を明示 | +0.05（count ≥ 2） | downstream_unlock |
| Dependency ready | primary `eligible_for_primary === true` | +0.10 | dependency_ready |
| Active status | `project.status === active` | +0.05 | project_active |
| Urgency 合成 | §6 urgency_score | × 0.25 | urgency_high |
| Momentum 合成 | §7 momentum_score | × 0.10 | momentum_signal |

### 5.2 減点因子

| 因子 | 条件 | delta | kind |
|------|------|-------|------|
| Stalled | §7 momentum < 0.25 かつ eligible あり | -0.15 | stalled_penalty |
| No eligible actions | Director `no_eligible_actions` | -0.50（primary 候補外） | no_eligible_actions |
| Completed | `project.status === completed` または eligible 0 | -0.60（primary 候補外） | project_inactive_penalty |
| Paused / archived | project.status | -0.40 | project_inactive_penalty |
| Dependency blocked primary | primary が eligible でない | -0.35 | dependency_blocked |
| Meta-work defer | §5.3 構造ヒューリスティック | -0.12 | meta_work_defer |

### 5.3 meta_work_defer（固有名詞なし）

**GROUND Core を名前で減点しない。** 代わりに state 構造から推定:

| 条件 | 解釈 |
|------|------|
| primary action の `depends_on` なし | ✓ |
| downstream unlock count === 0 | ✓ |
| open blocker が 0 または severity ≤ medium のみ | ✓ |
| project 内 pending action が 3 件以上でチェーンが長い | ✗（創作系は減点しない） |
| **上記 3 条件すべて** + primary goal title / action title に「schema」「CLI」「Director」「Engine」等の **汎用メタ語** が含まれる | meta_work_defer 減点 |

→ 創作・現場プロジェクトは downstream / blocker が強く、自然に上位へ。

### 5.4 field_validation_priority（固有名詞なし）

現場検証型 project の構造シグナル:

| 条件 | 加点 |
|------|------|
| open blocker severity ≥ high が primary action に紐づく | +0.08 |
| primary 完了で unlock ≥ 2 | +0.08 |
| action チェーン長 ≤ 4 かつ先頭 action が primary | +0.05 |

FreeWater fixture（場所決定 → 物資 → 現場 → Go 判断）はこのパターンに該当。**project 名は使わない。**

### 5.5 正規化

```
raw = sum(score_delta)
cross_project_score = clamp(raw, 0, 1)
```

- Portfolio primary: 最高 `cross_project_score` の `(project_id, next_action_id)`
- Alternatives: 2 位以降、primary との差 ≥ 0.08 または score ≥ 0.35、最大 `max_alternatives`
- 同点: urgency desc → downstream desc → director_confidence desc → project_id asc

---

## 6. Urgency モデル

**定義**: 今日その project に時間を割くべき度。0.0（低）〜 1.0（高）。

### 6.1 因子

| 因子 | 計算 | 重み |
|------|------|------|
| Blocker 圧 | open high/critical blocker 数。primary に紐づく blocker severity | 0.30 |
| 着手可能性 | primary `eligible_for_primary` | 0.20 |
| Downstream 圧 | unlock count on primary（多いほど urgent） | 0.25 |
| Director confidence | `DirectorReport.recommendation.confidence` | 0.15 |
| Project 非活性 | paused / archived / completed | -0.30（上限 0） |
| チェーン先頭 | depends_on なしの primary | +0.10 |

```
urgency_score = clamp(weighted_sum, 0, 1)
```

### 6.2 解釈例（fixture ベース・期待方向）

| Project | 期待 urgency | 理由（構造） |
|---------|--------------|--------------|
| FreeWater | **高 (0.75–0.90)** | high blocker「配布場所」+ unlock 3 + チェーン先頭 |
| Momotaro | **中 (0.55–0.75)** | high blocker あるが downstream は project 内閉じ |
| GROUND Core | **低–中 (0.30–0.50)** | meta_work_defer + downstream 0 + 旧 fixture では blocker medium のみ |

---

## 7. Momentum モデル

**定義**: project が **動いている** 度。0.0（止まり）〜 1.0（活発）。

### 7.1 因子

| 因子 | 信号 | delta |
|------|------|-------|
| in_progress action | count ≥ 1 | +0.35 |
| primary = Director primary | `matches_current_primary` | +0.20 |
| state_confidence | `current_state.confidence` ≥ 0.7 | +0.15 |
| 最近の observation | 30 日以内 `observations[].created_at` ≥ 1 | +0.10 |
| 全 pending & 先頭のみ eligible | チェーン先頭だけ動ける | +0.05（ready だが低 momentum） |
| 依存で primary 不可 | eligible false | -0.25 |
| no eligible actions | — | -0.40 |
| project paused | — | -0.50 |

```
momentum_score = clamp(sum, 0, 1)
```

### 7.2 status へのマッピング

| momentum | eligible | status |
|----------|----------|--------|
| ≥ 0.55 | yes | **progressing** |
| ≥ 0.25 | yes | **ready** |
| < 0.25 | yes | **stalled** |
| — | no | **blocked** |
| — | no actions | **completed** |
| project inactive | — | **paused** |

### 7.3 解釈例

| Project | 期待 momentum | 備考 |
|---------|---------------|------|
| FreeWater | ready–progressing | primary 確定済み、E2E patch 済みなら observation あり |
| Momotaro | ready | キャラ固定チェーン先頭、in_progress 0 なら ready |
| GROUND Core | stalled–ready | 旧 fixture は phase manual_run、更新がなければ stalled 寄り |

---

## 8. Portfolio Explainability

### 8.1 必須

| 要件 | 実装 |
|------|------|
| なぜ 1 位か | `primary_recommendation.reasons.length >= 2` |
| なぜ 2 位じゃないか | `why_not_alternatives[]` — 各 alternative project に対し ≥ 1 reason |
| なぜ後回しか | `deferred_recommendations[].defer_reasons.length >= 1` |
| ボトルネック説明 | `portfolio_bottleneck.explanation` 非空 + reasons |
| スコア trace | `score_delta` on PortfolioRecommendationReason |
| 人間可読要約 | `summary_text` 10–20 行 |

### 8.2 禁止

| 禁止 | 代替 |
|------|------|
| 「なんとなく今日は FreeWater」 | urgency + downstream + blocker reasons |
| 理由なし ranking | 各 `RankedProjectEntry` に implicit reasons（health 参照可） |
| project 名だけの差別 | 構造シグナル + Director reasons の引用 |
| 自動実行 | `requires_human_decision: true` 固定 |

### 8.3 reason メッセージテンプレート

| kind | テンプレート |
|------|-------------|
| director_primary | `project 内 Director 推薦: 「{action}」(score {n})` |
| downstream_unlock | `完了で project 内 {n} 件の action が解放される` |
| urgency_high | `urgency {n}: blocker / 着手可能性 / downstream 圧が高い` |
| meta_work_defer | `インフラ改善系 action — 創作・現場検証より後回し可能` |
| defer_explicit | `今日の primary 候補ではない: {理由}` |
| cross_project_rank | `横断スコア {n} で {rank} 位` |

### 8.4 期待 stdout  narrative（3 project fixture）

```
今日の一手:
  FreeWater — 配布場所を1つ決める

なぜ:
  - urgency 0.82: high blocker「配布場所が未確定」に直結
  - 完了で 3 件の downstream action が解放される
  - 現場検証チェーンの先頭 — 着手可能

なぜ Momotaro じゃないか:
  - 横断スコア 0.71 < FreeWater 0.86
  - downstream は project 内に閉じ、他 project への波及なし
  - ただし 2 位 — 今日 2 時間なら Momotaro キャラ固定も有効

後回し:
  - GROUND Core — Director 改善系は meta_work_defer。創作・現場が先

止まっている:
  （なし — 全 project 先頭 action 着手可能）

進んでいる:
  FreeWater（primary 確定 + observation あり）

全体ボトルネック:
  FreeWater / 配布場所を1つ決める — 配布場所 blocker が Phase0 全体を止める
```

---

## 9. CLI 仕様案

### コマンド

```bash
npm run ground-core -- recommend-portfolio [options]
```

| フラグ | 説明 |
|--------|------|
| `--projects <id>[,id...]` | 対象 project 限定。省略時は storage 内全 project |
| `--format text\|json` | default: `text` |
| `--out <path>` | PortfolioReport JSON 保存（optional） |
| `--include-health` | text 出力に Project Health 詳細を含める（default: true） |

### 動作（read-only）

```
1. resolveProjectIds(--projects | listProjects())
2. for each id:
     state = loadProject(id)          // 変更なし
     report = ruleDirector.recommend({ project_state: state })
3. portfolio = rulePortfolioDirector.recommendPortfolio({
     project_states, director_reports
   })
4. stdout: summary_text 構造化出力
5. --out 指定時 JSON 保存
6. saveProject / patch / propose を呼ばない
```

### stdout セクション（text format）

```
GROUND Core Portfolio Director Report
generated: {ISO8601}
engine: rule-portfolio-director-v1

=== Top Recommendation ===
{project_title} — {action_title}
cross_project_score: {n} | urgency: {n} | confidence: {n}

Why:
  - ...

Why not #2 ({project}):
  - ...

=== Project Ranking ===
1. ...

=== Project Health ===
{project_id} | status: {status} | health: {n} | momentum: {n} | urgency: {n}

=== Blocked Projects ===
{list or （なし）}

=== Progressing Projects ===
{list or （なし）}

=== Portfolio Bottleneck ===
{explanation}

=== Deferred (today) ===
- ...

requires_human_decision: true
```

### exit code

| code | 意味 |
|------|------|
| 0 | 推薦生成成功（eligible ≥ 1） |
| 1 | 全 project no_eligible_actions（警告付き report） |
| 2 | validation エラー（states/reports 不整合、project 不存在） |

---

## 10. テスト方針

### 10.1 単体テスト（`ground-core/__tests__/portfolio-director.test.ts` 想定）

| # | ケース | 期待 |
|---|--------|------|
| 1 | FreeWater + Momotaro + GROUND fixtures | primary = FreeWater 配布場所 |
| 2 | cross_project_score 順位 | FreeWater > Momotaro > GROUND（fixture 構造） |
| 3 | why_not_alternatives | primary に Momotaro 比較 reason あり |
| 4 | deferred_recommendations | GROUND に defer_reason あり |
| 5 | blocked_projects | primary eligible false の project のみ |
| 6 | progressing_projects | in_progress fixture で検出 |
| 7 | portfolio_bottleneck | highest unlock + severity の action |
| 8 | no_eligible_actions 全 project | exit 1 相当 report |
| 9 | project paused | cross_project_score 減点 + status paused |
| 10 | reasons 空禁止 | 全 primary / defer に reasons ≥ 1 |
| 11 | 純粋関数 | recommendPortfolio 前後 state JSON 不変 |
| 12 | 固有名詞 grep ガード | portfolio ソースに FreeWater / Momotaro / 桃太郎 なし |
| 13 | DirectorReport 不整合 | project_id mismatch → throw |
| 14 | confidence 0–1 | 範囲内 |
| 15 | alternatives 上限 | max_alternatives 尊重 |
| 16 | summary_text 非空 | CLI 用 |
| 17 | meta_work_defer | GROUND-like fixture で減点 |
| 18 | field_validation_priority | FreeWater-like fixture で加点 |

### 10.2 Fixture 戦略

| Fixture | ファイル案 |
|---------|-------------|
| 3 project 横断 | `ground-core/__fixtures__/portfolio-three-projects/` |
| FreeWater only high urgency | `freewater-phase0` 相当 JSON |
| Momotaro chain | `momotaro-production-design` 相当 JSON |
| GROUND meta | `ground-core-manual-run` + v0.4 用 **更新 fixture**（Director / Portfolio 設計 action を追加した patch 案を examples に） |

**注意**: 現行 `ground-core-manual-run.patch.json` は v0.1 時代の goal。Portfolio manual run 前に **GROUND Core project state を v0.3 以降に更新する patch 例** を `examples/ground-core-v0.4-portfolio.patch.json` として追加する（v0.4 実装フェーズ）。

### 10.3 実プロジェクト manual run（実装フェーズ）

| 手順 | 内容 |
|------|------|
| 1 | 3 project を storage に patch 適用済みであること |
| 2 | `npm run ground-core -- recommend-portfolio` |
| 3 | Top = FreeWater 配布場所、理由・後回し・ボトルネックを目視 |
| 4 | `docs/GROUND_CORE_V0.4_PORTFOLIO_MANUAL_RUN.md` にログ |

### 10.4 v0.3 Director との整合

| 検証 | 内容 |
|------|------|
| Director 単体一致 | 各 project の `DirectorReport` が単独 `recommend` と一致 |
| スコア継承 | Portfolio が action score を再計算していないこと |

---

## 11. v0.4 完了定義

1. `rule-portfolio-director-v1` が `PortfolioDirector` interface を実装
2. `recommend-portfolio` CLI が 3 project で read-only 動作
3. **今日の一手** が `(project_id, next_action_id)` で返る
4. primary に `reasons` + `why_not_alternatives` がある
5. `deferred_recommendations` / `blocked_projects` / `progressing_projects` / `portfolio_bottleneck` が埋まる
6. FreeWater fixture で Top Recommendation = 配布場所決定
7. `recommend-portfolio` は ProjectState / storage を変更しない
8. patch / propose / save / LLM を呼ばない
9. `npm run test:ground-core` 全通過（Portfolio テスト ≥ 18 件含む）
10. `docs/GROUND_CORE_V0.4_PORTFOLIO_MANUAL_RUN.md` 作成

---

## 12. v0.5 に送るもの

| 項目 | 理由 |
|------|------|
| **Portfolio → 人間向けダイジェスト UI** | CLI のみ → 読みやすい Review |
| **Director → propose 連携** | 「推薦 action を自然文 propose の seed に」— 自動 patch ではない |
| **ApprovedPatchBundle 連携** | v0.2.4 系バンドルと Portfolio 推薦の並置 |
| **project 間 dependency** | v0.4 は project 独立。将来 `depends_on_project_id` 等 |
| **due_at / カレンダー urgency** | 期限ベース urgency 加点 |
| **LLM-assisted Portfolio narrative** | ルール安定後。score はルールのまま |
| **Goal Graph 可視化** | 読取のみから graph UI へ |
| **PostgreSQL / Router / Web UI** | スコープ外継続 |
| **Portfolio → Patch 自動生成** | 禁止継続。Extraction + Review 経路維持 |
| **weight チューニング UI** | cross_project_score 係数の人間調整 |
| **GROUND 本体連携** | Core 安定後 |

---

## 13. 実装フェーズのファイル構成（参考）

```
ground-core/
├── director/                    # v0.3 既存
│   └── types.ts
├── portfolio/                   # v0.4 新規
│   ├── types.ts                 # PortfolioReport, PortfolioRecommendation, ProjectHealth
│   ├── scoring.ts               # CrossProjectScore, Urgency, Momentum
│   ├── explain.ts               # why_not, defer, bottleneck narrative
│   └── rule-portfolio-director.ts
├── __tests__/
│   └── portfolio-director.test.ts
└── cli.ts                       # recommend-portfolio 追加
```

---

## 関連ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [GROUND_CORE_V0.3_DIRECTOR_ENGINE_DESIGN.md](./GROUND_CORE_V0.3_DIRECTOR_ENGINE_DESIGN.md) | v0.3 設計（単 project Director） |
| [GROUND_CORE_V0.3_DIRECTOR_ENGINE.md](./GROUND_CORE_V0.3_DIRECTOR_ENGINE.md) | v0.3 実装 |
| [GROUND_CORE_V0.2.3_STATUS_REPORT.md](./GROUND_CORE_V0.2.3_STATUS_REPORT.md) | v0.2.3 到達点 |

---

*v0.4 Portfolio Director — 設計のみ。実装は次フェーズ。*
