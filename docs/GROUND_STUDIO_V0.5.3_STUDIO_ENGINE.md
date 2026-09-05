# GROUND Studio v0.5.3 — Studio Engine

## 目的

`PortfolioReport` と `DirectorReport[]` から **StudioReport** を生成する純粋関数レイヤー。

Studio は監督。実行者でも決定者でもない。Portfolio の primary を上書きしない。

## 入出力

```
PortfolioReport + DirectorReport[] (+ optional ProjectState[])
        ↓ rule-studio-v1
StudioReport (schema 0.5.3)
```

| 項目 | 内容 |
|------|------|
| 入力 | `portfolio_report`, `director_reports`, `project_states?` |
| 出力 | `StudioReport` |
| 副作用 | なし |
| 禁止 | saveProject, applyPatch, LLM, Router, 自動保存・自動適用 |

`project_states` は decision_materials（active decisions / untested hypotheses / 最新 observations）抽出用。省略時は Portfolio confidence_factors のみ。

## StudioReport 型

```typescript
interface StudioReport {
  schema_version: "0.5.3";
  engine: string;
  generated_at: string;
  today_focus: TodayFocus;
  blocked_projects: StudioBlockedProject[];
  growing_projects: StudioGrowingProject[];
  risk_projects: StudioRiskProject[];
  decision_materials: StudioDecisionMaterial[];
  recommended_flow: StudioFlowStep[];
  deferred_projects: StudioDeferredProject[];
  portfolio_alignment: PortfolioAlignment;
  summary_text: string;
  requires_human_decision: true;
}
```

## 8 問への対応

| # | 問い | StudioReport フィールド |
|---|------|-------------------------|
| 1 | 今どこにいるか | `today_focus.situation_summary` |
| 2 | 何が止まっているか | `blocked_projects` |
| 3 | 今日何をやるべきか | `today_focus.primary` |
| 4 | どの順番で進めるか | `recommended_flow` |
| 5 | どこが伸びているか | `growing_projects` |
| 6 | どこが危険か | `risk_projects` |
| 7 | 何を後回しにするか | `deferred_projects` |
| 8 | 何を判断材料として見るべきか | `decision_materials` |

## 不変条件

- `today_focus.primary.project_id` === `portfolio.primary_recommendation.project_id`
- `today_focus.primary.action_id` === `portfolio.primary_recommendation.next_action_id`
- `today_focus.primary.reasons.length` >= 2
- `portfolio_alignment.primary_*` === Portfolio primary
- `requires_human_decision: true` 固定

## Flow 生成ルール

1. Portfolio `project_ranking` を rank 昇順
2. 最大 4 ステップ
3. rank 1 → `morning` / `deep_work`（primary）
4. メタ改善パターン（構造キーワード）→ `defer` intent
5. `deep_work` intent が 2 件超 → `portfolio_alignment.deep_work_warning`

## Deferred / Blocked / Growing / Risk

| 区分 | ソース |
|------|--------|
| Deferred | Portfolio `deferred_recommendations` を引き継ぎ。理由必須 |
| Blocked | Portfolio blocked + Director open blockers。severity 降順 |
| Growing | progressing + health ready/progressing + momentum シグナル |
| Risk | stalled/blocked health, observation gap (30日), blocker pressure, resource overload |

ReferenceDoc **本文は読まない**（title / summary のみ構造判定に使用可）。

## Portfolio Alignment

| status | 条件 |
|--------|------|
| `aligned` | deep_work <= 2 |
| `partially_aligned` | deep_work > 2（primary は不変） |

## ファイル構成

```
ground-core/studio/types.ts       — v0.5.3 型
ground-core/studio/analyzers.ts   — 索引・構造パターン・situation
ground-core/studio/scoring.ts     — blocked/growing/risk/flow/focus
ground-core/studio/rule-studio.ts — rule-studio-v1 エントリ
ground-core/__tests__/studio-engine.test.ts
```

## Renderer との関係

v0.5.2 Brief Renderer は `brief-types.ts` の **v0.5.0 StudioReport** を入力とする（`BriefRendererStudioReport` として export）。

v0.5.3 Engine 出力 → Brief 入力の adapter は **v0.5.4 以降**。今回 Renderer は変更しない。

## CLI

`studio-brief` CLI は未実装（v0.5.4 以降）。

## テスト

```bash
npm run test:ground-core
```

20 ケース: primary 不変、alignment、severity 順、growing/risk/decision/flow/deferred、summary、入力不変、save/apply 未使用、固有名詞 hardcode なし、3/4 project fixture、no blocked。

## 実プロジェクト期待（3 project fixture）

| 項目 | 期待 |
|------|------|
| Today Focus | Portfolio primary（FreeWater 系） |
| Flow | rank 1 → 2 → 3 |
| Deferred | Portfolio deferred（GROUND Core 系） |

※ 固有名詞は Engine ソースに hardcode しない。期待値は fixture 実行結果から検証。
