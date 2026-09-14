# GROUND Studio v0.5.4 — Narrative Layer

## 目的

`StudioReport` を人間が理解しやすい **状況説明**（`StudioNarrative`）に変換する、完全ルールベースの Narrative Layer。

## パイプライン上の位置

```
ProjectState → Director → Portfolio → Studio → Narrative → Brief Renderer → CLI (将来)
```

今回実装:

```
StudioReport → StudioNarrative
```

## 思想

- GROUND は情報を並べるシステムではなく、**状況を理解させる**システム
- **StudioReport = 事実** / **Narrative = 文脈** / **StudioBrief = 表示**
- Narrative は提案者であり、**決定者ではない**

## 入出力

| 項目 | 内容 |
|------|------|
| 入力 | `StudioReport` のみ |
| 出力 | `StudioNarrative` (schema 0.5.4) |
| エンジン | `rule-narrative-v1` |
| 副作用 | なし |

## StudioNarrative 型

```typescript
interface StudioNarrative {
  schema_version: "0.5.4";
  engine: string;
  generated_at: string;
  headline: string;
  current_situation: string;
  today_focus_story: string;
  flow_story: string;
  blocker_story: string;
  growth_story: string;
  risk_story: string;
  decision_story: string;
  deferred_story: string;
  summary_story: string;
  requires_human_decision: true;
}
```

## Narrative の 8 問

| # | 問い | フィールド |
|---|------|-----------|
| 1 | 今何が起きているか | `current_situation` |
| 2 | なぜ今日それをやるべきか | `today_focus_story` |
| 3 | 何が流れを止めているか | `blocker_story` |
| 4 | どこが伸びているか | `growth_story` |
| 5 | どこに注意が必要か | `risk_story` |
| 6 | 何を判断材料として見るべきか | `decision_story` |
| 7 | 何を後回しにするか | `deferred_story` |
| 8 | 全体としてどんな状況か | `headline` + `summary_story` |

`flow_story` は Portfolio rank 順の横断フロー説明。

## 各 Story の生成ルール

| Story | ルール |
|-------|--------|
| headline | primary の reason kind（field_validation 等）・blocked 件数・deep work 警告から構造判定 |
| current_situation | `situation_summary` + alignment note + blocked 件数 |
| today_focus_story | primary + reasons 要約（最低 2 理由相当）+ Portfolio 不変宣言 |
| flow_story | `recommended_flow` を rank 順に文章化。deep work 警告を付記 |
| blocker_story | blocked あり → severity 降順要約。なし → 構造的な「なし」説明 |
| growth_story | growing あり → momentum 要約。なし → 構造的な「なし」説明 |
| risk_story | risk あり → kind + severity 要約。なし → 構造的な「なし」説明 |
| decision_story | decision_materials 要約。なし → 構造的な「なし」説明 |
| deferred_story | deferred + 理由必須。なし → 構造的な「なし」説明 |
| summary_story | headline + primary + flow + 必要な blocker/risk/deferred を 3〜5 文で統合 |

## Explainability ルール

- 空文字禁止
- 理由なし禁止（各 story は StudioReport 由来の根拠を含む）
- 「なんとなく」等の曖昧表現禁止
- Portfolio 上書き禁止（新しい優先順位を生成しない）
- `flow_story` は `recommended_flow` の project 順序を保持

## Safety

| 禁止 | 状態 |
|------|------|
| saveProject | 未使用 |
| applyPatch / StatePatch | 未使用 |
| LLM | 未使用 |
| ProjectState 読み込み | 未使用 |
| Portfolio 再計算 | 未使用 |
| StudioBrief Renderer 変更 | 変更なし |

## ファイル構成

```
ground-core/studio/narrative-types.ts
ground-core/studio/narrative-formatters.ts
ground-core/studio/narrative-rules.ts
ground-core/studio/narrative-builder.ts
ground-core/__tests__/studio-narrative.test.ts
```

## 使い方

```typescript
import { ruleStudio, ruleNarrative } from "ground-core";

const report = ruleStudio.analyze({ portfolio_report, director_reports, project_states });
const narrative = ruleNarrative.build({ report });
```

## テスト

```bash
npm run test:ground-core
```

20 ケース: 各 story 生成、Portfolio 順位保持、StudioReport 不変、save/apply 未使用、固有名詞 hardcode なし、3/4 project fixture、blocked/risk/deferred なし、純粋関数。

## 次のステップ（v0.5.5 以降）

1. **Narrative → Brief Adapter** — v0.5.3 StudioReport / v0.5.4 Narrative を Brief Renderer 入力に橋渡し
2. **CLI `studio-brief`** — Engine + Narrative + Renderer 統合
3. **Morning / Session / Deep Work バリアント** — Narrative から brief_type 別要約（Renderer 側）
