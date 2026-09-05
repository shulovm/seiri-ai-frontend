# GROUND Risk Signal Diversity v0.4.4 — 修正記録

**日付:** 2026-06-20  
**前提:** v0.4.3 で BLOCKED / FLOW NOTES 分離後、横断 Brief の RISKS が `observation_gap` で枠を独占する問題を修正。

---

## 1. 問題の背景

business / research / product の新規 3 Project 横断 Brief では:

```txt
RISKS
  observation_gap (high) — 30 日以内の observation がない — 判断材料不足
  observation_gap (high) — 30 日以内の observation がない — 判断材料不足
  observation_gap (high) — 30 日以内の observation がない — 判断材料不足
```

`untested_hypothesis`（各 Project 2 件ずつ）や `resource_overload`（deep work 3 件）が maxRisks=3 から押し出されていた。

---

## 2. RISKS 生成経路

```txt
studio/scoring.ts buildRiskProjects()
  observation_gap（project ごと）
  stalled / blocked health
  resource_overload（deep work > 2）
  blocker_pressure（open blocker high/critical）
    ↓
rule-studio.ts → risk_projects
    ↓
brief-adapter.ts mapRiskWarnings()
  + untested_hypothesis（decision_materials から）
  + portfolio_misalignment（deep work warning）
    ↓
brief-formatters.ts mapRiskBriefs()  ← v0.4.4 で多様化
    ↓
studio-brief.ts RISKS セクション
```

**max件数:** `getSectionLimits("morning").maxRisks = 3`

---

## 3. observation_gap の意味

- 新規 intake Project では **自然かつ正確**（30 日以内 observation なし）
- action 完了 + observation patch で解消可能
- 横断 Brief では **全 Project に同時発生しうる**
- 個別に 3 枠占有すると **判断材料の多様性が失われる**

---

## 4. 採用した修正案

**案A + 案B ハイブリッド（brief-formatters 層のみ）**

1. **同種 observation_gap を 1 件に集約**  
   `3 projects — 30日以内の observation がない — 判断材料不足`  
   mitigation_hint に project 名リスト

2. **risk kind ごとの優先順位で 1 件ずつ確保**  
   `blocker_pressure` → `decision_pending` → `observation_gap` → `untested_hypothesis` → `resource_overload` → …

3. **untested_hypothesis は primary project 優先**

新セクション追加（案C）は v0.4.3 直後のため見送り。

---

## 5. 実施した修正

| ファイル | 変更 |
|---------|------|
| `brief-formatters.ts` | `selectDiverseRiskWarnings()`, `aggregateObservationGapWarnings()` |
| `brief-adapter.ts` | risk warning に `project_id` / `project_title`、project 名を message に |
| `brief-types.ts` | `StudioRiskWarningSource` に optional project フィールド |
| `__tests__/brief-risk-diversity.test.ts` | 新規 4 件 |

**変更なし:** Portfolio scoring、Director、ProjectState schema、Studio engine risk 生成ロジック。

---

## 6. 修正後の Brief 表示

### business/research/product 横断（open blocker なし）

```txt
RISKS
  observation_gap (high) — 3 projects — 30日以内の observation がない — 判断材料不足
  untested_hypothesis (medium) — 受取時の説明が短く透明なら、怪しさを下げられる
  resource_overload (medium) — 3 project が同日 deep work 候補 — 並行上限 2 を超えない
```

### open blocker あり

`blocker_pressure` が `observation_gap` より先に選ばれる（優先順位 1 位）。

---

## 7. テスト

```bash
npm run test:ground-core
# 258 tests / 37 suites / 全 pass
```

---

## 8. 残した課題

1. 集約 observation_gap の project 名が mitigation_hint にのみ（RISKS 1 行目には件数のみ）
2. 2 件目以降の untested_hypothesis は枠次第で省略
3. risk scoring 自体は未変更 — 生成数は従来通り多い

---

## 9. 次の候補（実装しない）

- OBSERVATION GAPS 専用セクション（案C）
- observation 追加後の横断 Brief 再検証
- mixed portfolio（FreeWater + multi-seed）

---

## 関連

- v0.4.3: [GROUND_BOTTLENECK_BLOCKED_SEPARATION_V0.4.3.md](./GROUND_BOTTLENECK_BLOCKED_SEPARATION_V0.4.3.md)
- v0.4.2: [GROUND_PORTFOLIO_BRIEF_CONSISTENCY_V0.4.2.md](./GROUND_PORTFOLIO_BRIEF_CONSISTENCY_V0.4.2.md)
