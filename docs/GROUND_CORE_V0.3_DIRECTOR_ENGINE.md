# GROUND Core v0.3 — Director Engine

> **地位**: ProjectState を **読むだけ** で「次にやるべき next_action」を理由付きで推薦する **監督（Director）** 層。  
> **副作用なし** / **LLM なし** / **自動保存なし**。

設計: [GROUND_CORE_V0.3_DIRECTOR_ENGINE_DESIGN.md](./GROUND_CORE_V0.3_DIRECTOR_ENGINE_DESIGN.md)  
次フェーズ設計: [GROUND_CORE_V0.4_MULTI_PROJECT_DIRECTOR_DESIGN.md](./GROUND_CORE_V0.4_MULTI_PROJECT_DIRECTOR_DESIGN.md)  
v0.4 実装: [GROUND_CORE_V0.4_MULTI_PROJECT_DIRECTOR.md](./GROUND_CORE_V0.4_MULTI_PROJECT_DIRECTOR.md)

---

## v0.3 の思想

| 比喩 | レイヤ | 責務 |
|------|--------|------|
| 記録 OS | State Engine + Extraction | 保存・自然文 → patch |
| 監督 | **Director Engine** | 保存済み state から **次の一手を説明** |

```
ProjectState（read-only）
  → ruleDirector.recommend()
  → DirectorReport
  → 人間が判断（requires_human_decision: true）
```

**決定権は常に人間。** Director は patch 生成・save・apply を **しない**。

---

## DirectorEngine

```typescript
interface DirectorEngine {
  readonly name: string; // "rule-director-v1"
  recommend(input: DirectorInput): DirectorReport;
}
```

実装: `ground-core/director/rule-director.ts`

---

## Scoring Model

対象: `next_actions` のうち `pending` / `in_progress` のみ。

| 加点 | delta |
|------|-------|
| primary_next_action_id 一致 | +0.35 |
| depends_on なし / 依存先 done | +0.20 |
| primary_goal_id 一致 | +0.15 |
| open blocker 紐づき | +0.10 |
| downstream 解放 | +0.05 × count（max 0.15） |
| sort_order 小 | 最大 +0.10 |

| 減点 | delta |
|------|-------|
| depends_on 未完了 | -0.50 |
| project.status !== active | -0.30 |
| blocker severity high/critical | -0.10 |

score = clamp(sum(delta), 0, 1)

---

## Priority Rules

- depends_on 未完了 → **primary 不可**
- primary 候補: eligible の最高 score
- 同点: sort_order 昇順
- eligible 0 → `no_eligible_actions`
- Director は `primary_next_action_id` を **変更しない**

---

## Blocker Rules

- `open` のみ `open_blockers[]` に列挙
- mitigated / resolved は除外
- `action.blocker_id` → `related_blocker_ids`
- orphan blocker も situation に載る
- blocker status は変更しない

---

## Confidence Model

```
confidence = clamp(
  primary.score × dependency_factor × project_status_factor × ambiguity_penalty,
  0, 1
)
```

- `dependency_factor`: depends_on なし → 1.0 / あり → 0.5
- `project_status_factor`: active → 1.0 / それ以外 → 0.7
- `ambiguity_penalty`: top - second < 0.10 → 0.85

`confidence_factors[]` に内訳を出力。

---

## CLI recommend

```bash
# 人間可読要約（default）
npm run ground-core -- recommend <project_id>

# JSON 出力
npm run ground-core -- recommend <project_id> --format json

# ファイル保存
npm run ground-core -- recommend <project_id> --out report.json
```

| 動作 | 説明 |
|------|------|
| loadProject | read-only |
| saveProject | **呼ばない** |
| stdout | text: summary_text / json: DirectorReport |
| exit 0 | 推薦成功 |
| exit 1 | eligible action なし / エラー |

---

## v0.3 manual run 方法

```bash
# Momotaro
npm run ground-core -- recommend 839578f5-36e1-4b6f-9be5-a97520f52b66

# FreeWater
npm run ground-core -- recommend 28d83a68-2064-43d7-94cb-72656b9006de
```

期待 primary:

| Project | action |
|---------|--------|
| Momotaro | 桃太郎のキャラクター固定ルールを整理する |
| FreeWater | 配布場所を1つ決める |

---

## 今回やらないこと

- OpenAI / Anthropic API
- LLM 呼び出し
- 自動 save / apply
- StatePatch 生成
- Web UI / Router / PostgreSQL
- Goal Graph 実装
- primary 自動更新

---

## v0.4 候補

- ApprovedPatchBundle 連携
- Director → propose 連携
- due_at 期限スコア
- Review UI
- LLM-assisted Director（optional）

---

## 実装ファイル

```
ground-core/director/
  types.ts
  scoring.ts
  explain.ts
  rule-director.ts
ground-core/__tests__/director-engine.test.ts
```

---

## 関連

- [GROUND_CORE_V0.2.3_STATUS_REPORT.md](./GROUND_CORE_V0.2.3_STATUS_REPORT.md)
- [GROUND_CORE_V0.3_DIRECTOR_ENGINE_DESIGN.md](./GROUND_CORE_V0.3_DIRECTOR_ENGINE_DESIGN.md)
