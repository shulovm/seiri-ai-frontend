# GROUND Core v0.4 — Multi Project Director（Portfolio Director）

> **地位**: 複数 `ProjectState` を横断し、「**今日やるべき一手**」を説明付きで推薦する **総監督（Portfolio Director）** 層。  
> **副作用なし** / **LLM なし** / **自動保存なし**。

設計: [GROUND_CORE_V0.4_MULTI_PROJECT_DIRECTOR_DESIGN.md](./GROUND_CORE_V0.4_MULTI_PROJECT_DIRECTOR_DESIGN.md)  
Manual run: [GROUND_CORE_V0.4_PORTFOLIO_MANUAL_RUN.md](./GROUND_CORE_V0.4_PORTFOLIO_MANUAL_RUN.md)

---

## v0.4 の思想

| 比喩 | レイヤ | 入力 → 出力 |
|------|--------|-------------|
| 各 project の監督 | **Director (v0.3)** | `ProjectState` → `DirectorReport` |
| 全 project の総監督 | **Portfolio Director (v0.4)** | `ProjectState[]` + `DirectorReport[]` → `PortfolioReport` |

```
ProjectState[]  ──┐
                  ├──→  rulePortfolioDirector.recommendPortfolio()
DirectorReport[] ─┘
        ↓
   PortfolioReport
        ↓
   人間が判断（requires_human_decision: true）
```

**決定権は常に人間。** Portfolio Director は patch 生成・save・apply を **しない**。

---

## Director と Portfolio Director の違い

| 項目 | Director (v0.3) | Portfolio Director (v0.4) |
|------|-----------------|---------------------------|
| スコープ | 1 project | N projects |
| 出力 | その project 内の next_action | `(project_id, next_action_id)` |
| スコア | action 単位 | 横断 `cross_project_score` |
| 比較 | project 内 alternative | project 間 ranking / defer |

Portfolio 層は **DirectorReport の primary recommendation を横断比較** する。action スコアの再計算は v0.3 に委譲。

---

## PortfolioDirector interface

```typescript
interface PortfolioDirector {
  readonly name: string; // "rule-portfolio-director-v1"
  recommendPortfolio(input: PortfolioInput): PortfolioReport;
}

interface PortfolioInput {
  project_states: ProjectState[];
  director_reports: DirectorReport[];
  options?: PortfolioDirectorOptions;
}
```

実装: `ground-core/director/portfolio-director.ts`

---

## PortfolioReport

| フィールド | 説明 |
|-----------|------|
| `primary_recommendation` | 今日の一手 |
| `alternative_recommendations[]` | 2 位以降 |
| `project_ranking[]` | 横断スコア順 |
| `project_health[]` | 各 project の健康度 |
| `blocked_projects[]` | 止まっている project |
| `progressing_projects[]` | 進んでいる project |
| `deferred_recommendations[]` | 意図的に後回し |
| `portfolio_bottleneck` | 横断ボトルネック 1 件 |
| `confidence` / `confidence_factors[]` | 確信度 |
| `summary_text` | CLI 人間可読要約 |

---

## Scoring Model

### 加点

| 因子 | 内容 |
|------|------|
| Director primary score | × 0.40 |
| blocker severity | high/critical on primary |
| downstream unlock | 完了で解放される action 数 |
| dependency ready | 着手可能 |
| project active | status === active |
| urgency | § Urgency |
| momentum | § Momentum |
| field_validation_priority | 現場検証チェーン先頭（構造シグナル） |

### 減点

| 因子 | 内容 |
|------|------|
| stalled | movement シグナル弱 |
| no eligible actions | 推薦可能 action なし |
| completed / paused | project 非活性 |
| meta_work_defer | メタ改善系 project |

### meta_work_defer

GROUND Core のような **メタ改善系 project** が、FreeWater / Momotaro の **実行系 project** を押しのけすぎないための減点。

**project 名は hardcode しない。** 以下の構造シグナルで判断:

- `schema` / `CLI` / `Director` / `patch` / `ProjectState` 等の meta keyword が複数ヒット
- downstream unlock が少ない（≤ 1）
- primary blocker severity が low / medium のみ
- 現場検証シグナル（`phase0` / `現場` / `配布` 等）が dominant でない

---

## Urgency / Momentum / Blocker Score

| スコア | 意味 |
|--------|------|
| **urgency_score** | 今日時間を割くべき度（blocker 圧 + 着手可能性 + downstream） |
| **momentum_score** | 動いている度（in_progress / primary 一致 / observation / confidence） |
| **blocker_score** | blocker の重さ（高いほど悪化） |

---

## Explainability

| 要件 | 内容 |
|------|------|
| primary | `reasons.length >= 2` |
| primary | `why_not_alternatives[]` で 2 位を説明 |
| deferred | `defer_reasons[]` で後回し理由 |
| 禁止 | 「なんとなく」 |

---

## CLI: recommend-portfolio

```bash
# 全 project（storage 内）
npm run ground-core -- recommend-portfolio

# 対象限定
npm run ground-core -- recommend-portfolio --projects <id1>,<id2>,<id3>

# JSON 出力
npm run ground-core -- recommend-portfolio --format json

# JSON 保存
npm run ground-core -- recommend-portfolio --out portfolio-report.json
```

### 動作（read-only）

1. `listProjects` / `loadProject` で ProjectState 読取
2. 各 project に `ruleDirector.recommend()`
3. `rulePortfolioDirector.recommendPortfolio()`
4. stdout / `--out` 出力
5. **saveProject / applyPatch は呼ばない**

---

## 今回やらないこと

OpenAI / Anthropic API / LLM / 自動保存 / 自動適用 / Web UI / Router / PostgreSQL / Goal Graph / Director → Patch 自動生成

---

## v0.5 候補

→ **v0.5 憲法・スコープ**: [GROUND_STUDIO_V0.5_CONSTITUTION.md](./GROUND_STUDIO_V0.5_CONSTITUTION.md)

- Portfolio ダイジェスト UI
- Director → propose 連携（自動 patch ではない）
- project 間 dependency
- `due_at` 期限 urgency
- ApprovedPatchBundle 連携
- GROUND 本体連携

---

## ファイル構成

```
ground-core/director/
├── types.ts                  # v0.3 Director 型
├── rule-director.ts          # v0.3 実装
├── portfolio-types.ts        # v0.4 型
├── portfolio-scoring.ts      # CrossProject / Urgency / Momentum
└── portfolio-director.ts     # rule-portfolio-director-v1
```

---

## テスト

```bash
npm run test:ground-core
```

Portfolio 関連: `ground-core/__tests__/portfolio-director.test.ts`（17 ケース）

---

*v0.4 Portfolio Director — 初回実装完了。*
