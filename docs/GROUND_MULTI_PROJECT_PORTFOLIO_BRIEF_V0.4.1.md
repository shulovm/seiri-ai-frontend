# GROUND Multi-Project Portfolio Brief v0.4.1 — 検証記録

**検証日:** 2026-06-20  
**目的:** business / research / product の 3 Project を横断 Brief にかけ、既存 Portfolio / Studio / Brief がどう優先順位を出すか確認する。  
**方針:** コード変更なし。既存挙動の記録のみ。

---

## 1. 検証目的

Multi-Seed Samples v0.4 で確認した 3 kind（business / research / product）が、単体では `studio-brief` まで流れることを前提に、**複数 Project を同時に渡した横断 Brief** が人間の次 Action に使えるかを評価する。

```txt
business project + research project + product project
↓
studio-brief --projects <id>,<id>,<id>
↓
Portfolio Brief（TODAY / FLOW / DEFERRED / RISKS）
```

---

## 2. 使用 Project

v0.4.1 検証時に新規 intake した Project（storage 上の UUID。再 intake すると変わる）。

| kind | project_id | title |
|------|------------|-------|
| business | `f1297d26-9838-4ec2-94d7-f933619338e4` | 無料配布型プロモーション検証 v0.1 |
| research | `6c0c39e6-ded6-43df-9b59-72242b86b5c8` | 脳とAI接続領域の研究テーマ整理 v0.1 |
| product | `d90704dc-171b-4cce-a938-54599714ac2b` | 思考整理ツールの最小利用体験検証 v0.1 |

### 実行コマンド

```bash
npm run ground-core -- intake --file ground-core/examples/experiment-seeds/business-sample.json
npm run ground-core -- intake --file ground-core/examples/experiment-seeds/research-sample.json
npm run ground-core -- intake --file ground-core/examples/experiment-seeds/product-sample.json

npm run ground-core -- studio-brief --projects f1297d26-9838-4ec2-94d7-f933619338e4
npm run ground-core -- studio-brief --projects 6c0c39e6-ded6-43df-9b59-72242b86b5c8
npm run ground-core -- studio-brief --projects d90704dc-171b-4cce-a938-54599714ac2b

npm run ground-core -- studio-brief --projects f1297d26-9838-4ec2-94d7-f933619338e4,6c0c39e6-ded6-43df-9b59-72242b86b5c8,d90704dc-171b-4cce-a938-54599714ac2b

npm run ground-core -- recommend-portfolio --projects f1297d26-9838-4ec2-94d7-f933619338e4,6c0c39e6-ded6-43df-9b59-72242b86b5c8,d90704dc-171b-4cce-a938-54599714ac2b --format json
```

---

## 3. 単体 Brief 結果

3 Project とも単体 Brief は正常に生成。TODAY は各 seed の `initial_next_actions[0]` と一致。

| kind | TODAY |
|------|-------|
| business | 検証場所の候補を3つ出す |
| research | 関連分野を5つに分類する |
| product | 想定ユーザーを1人に絞る |

### 単体 Brief の共通パターン

- **cross_project_score:** 0.66（単体でも Portfolio 計算が走る）
- **Director 推薦 score:** 0.85
- **momentum:** 0.25 / health status: `ready`
- **open blocker:** なし（`blockers: []`）
- **RISKS:** `observation_gap (high)` + `untested_hypothesis (medium)` × 2
- **DECISIONS:** 各 Project の `initial_decisions` が表示
- **BLOCKED セクション:** open blocker がないにもかかわらず、`portfolio_bottleneck` が `(blocked) — downstream 解放 1 件` として表示される（後述）

---

## 4. 横断 Brief 結果

### Headline

```txt
deep work が 3 件重なるため、時間配分の判断が必要な状況です。
```

`alignment_status: partially_aligned` — Portfolio primary は維持しつつ、deep work 同時実行が 2 件超のため人間判断を促す。

### TODAY（Portfolio primary）

| 項目 | 値 |
|------|-----|
| **selected project** | 脳とAI接続領域の研究テーマ整理 v0.1（research） |
| **selected action** | 関連分野を5つに分類する |
| **cross_project_score** | 0.66 |
| **confidence** | 0.68 |
| **requires_human_decision** | true |

### FLOW（Portfolio rank 順 — `--projects` 引数順）

| rank | project | action | time_box | intent |
|------|---------|--------|----------|--------|
| 1 | business | 検証場所の候補を3つ出す | morning | deep_work |
| 2 | research | 関連分野を5つに分類する | morning | deep_work |
| 3 | product | 想定ユーザーを1人に絞る | later | deep_work |

### DEFERRED

| project | action | reason |
|---------|--------|--------|
| business | 検証場所の候補を3つ出す | 横断スコア 0.66 < primary 0.66 のため後回し |
| product | 想定ユーザーを1人に絞る | 横断スコア 0.66 < primary 0.66 のため後回し |

research は primary のため DEFERRED に入らない。

### RISKS / BLOCKED

**RISKS（Morning Brief、max 3 件）**

- `observation_gap (high)` × 3（business / research / product 各 1 件）
- 単体 Brief にあった `untested_hypothesis` は横断 Brief では表示されない（枠が observation_gap で埋まる）

**BLOCKED**

- business のみ: `(blocked) — downstream 解放 1 件`
- Portfolio JSON 上の `blocked_projects: []`（open blocker なし）
- `portfolio_bottleneck`（チェーン先頭 action）が Brief の BLOCKED セクションに混在

**GROWING**

- business（momentum 0.25 / ready）
- research（momentum 0.25 / ready）

**DECISIONS**

- business の decision × 2
- research の decision × 2
- product の decision は表示されない（件数上限）

---

## 5. Portfolio ranking の分析

### スコア（3 Project すべて同一）

| 指標 | 値 | 主な根拠 |
|------|-----|----------|
| cross_project_score | 0.66 | Director 0.85 × 0.4 + dependency_ready + downstream_unlock + urgency/momentum |
| urgency_score | 0.41 | eligible + downstream_unlock + director confidence |
| momentum_score | 0.25 | `matches_current_primary` (+0.2) のみ。observation なし・in_progress なし |
| blocker_score | 0 | open blocker なし |
| recommendation_score | 0.85 | 先頭 next_action、dependency ready、sort_order bonus |

### 効いている ProjectState フィールド

| フィールド | 効き |
|-----------|------|
| `next_actions`（先頭 action, depends_on, downstream） | **強** — Director / cross_project の主成分 |
| `current_state.primary_next_action_id` | **中** — momentum + matches_current_primary |
| `project.status` | **弱** — 3 件とも active で同点 |
| `blockers` | **なし** — 空 |
| `observations` | **逆** — なし → observation_gap risk |
| `decisions` / `hypotheses` | Brief DECISIONS / 単体 RISKS に反映。Portfolio スコアには直接効かない |
| `current_state.phase` / `confidence` | **なし** — null のため加点なし |

### primary 選定ロジック（同点時）

`portfolio-director.ts` の `eligibleRanked` ソート:

1. `cross_project_score` 降順
2. `urgency_score` 降順
3. **`project.id` 昇順（localeCompare）**

3 Project すべて 0.66 / 0.41 で同点のため、**UUID 辞書順**で research（`6c0c39e6...`）が primary になる。

### project_ranking との不一致

`project_ranking` は `allRanked` の stable sort（同点時は `--projects` 引数順）:

1. business
2. research
3. product

一方 `primary_recommendation` は UUID tie-break で **research**。

→ **TODAY は research、FLOW rank 1 は business** という見た目の矛盾が発生。

### business が portfolio_bottleneck になる理由

`buildPortfolioBottleneck` は eligible project の中で `downstream_unlock_count` 最大を選ぶ。3 件とも downstream 1 件で同点 → stable sort で **business（引数順 1 番目）** が bottleneck に。

---

## 6. 評価

### 横断 Brief として自然か

**部分的に自然。**

- 3 kind すべてが FLOW に載り、消えない
- deep work 3 件の overload 警告は妥当
- `requires_human_decision: true` は同点局面に適切

**不自然な点:**

- TODAY（research）と FLOW rank 1（business）の不一致
- DEFERRED 理由が「0.66 < 0.66」で同点なのに後回し表現
- BLOCKED に open blocker のない bottleneck が `(blocked)` 表示
- RISKS が observation_gap のみで埋まり、hypothesis 系の注意が消える

### 人間が次に動けるか

**動けるが、Portfolio primary だけでは決めきれない。**

- FLOW を見れば 3 Project の次 action はすべて把握できる
- TODAY = research は「UUID タイブレーク」由来で、事業上の理由ではない
- 人間は headline（時間配分）+ FLOW + DEFERRED を合わせて判断する必要がある
- 同点 fresh seed 群では **Portfolio primary を盲信しない** 運用が現実的

### 他 Project の扱いは自然か

**概ね自然。**

- DEFERRED に business / product が入り「今日の primary 以外」が明示される
- FLOW で 3 件すべての primary action が rank 順に見える
- product は rank 3 + `later` time_box で後回し感が出る

**改善余地:**

- DEFERRED 理由文が同点時に誤解を招く
- product の DECISIONS が横断 Brief から落ちる

### observation gap の影響

- 3 Project すべてで `observation_gap (high)` が出る（仕様通り: 30 日以内 observation なし）
- 横断 Brief の RISKS 枠（max 3）を独占し、他リスクが見えなくなる
- Portfolio **スコアリング**には observation gap は直接効かない（momentum の recent observation 加点のみ）
- **許容できる** — 新規 intake Project では当然。ただし Brief 表示上は重い
- **今すぐ修正不要** — 観測を記録すれば自然に解消する。スコアリング変更は別判断

---

## 7. 問題点（記録のみ）

| # | 問題 | 深刻度 | v0.4.2 |
|---|------|--------|--------|
| 1 | 同点時、primary（UUID tie-break）と project_ranking（引数順）が不一致 | 中 | **修正済** — 入力順 tie-break 統一 |
| 2 | DEFERRED 理由「score A < score B」が同点でも出る | 低 | **修正済** — 同点文言 |
| 3 | `portfolio_bottleneck` が BLOCKED セクションに `(blocked)` 表示 | 中 | **v0.4.3 修正済** → [GROUND_BOTTLENECK_BLOCKED_SEPARATION_V0.4.3.md](./GROUND_BOTTLENECK_BLOCKED_SEPARATION_V0.4.3.md) |
| 4 | 横断 RISKS が observation_gap で埋まる | 低 | 未修正 |
| 5 | 同構成 fresh seed 3 件はスコア完全同点 | 情報 | 仕様 |

---

## 8. 今回は修正しない理由（v0.4.1 時点）

- 検証フェーズ。Portfolio / Studio / Brief renderer の変更はスコープ外
- 問題 1〜2 は **v0.4.2 で修正済** → [GROUND_PORTFOLIO_BRIEF_CONSISTENCY_V0.4.2.md](./GROUND_PORTFOLIO_BRIEF_CONSISTENCY_V0.4.2.md)
- 問題 3〜4 は **同点・新規・open blocker なし** という条件での既知挙動
- 修正前に、observation 追加・blocker 追加・momentum 差がある Project 混在での再検証が望ましい

---

## 9. 次の候補（実装はまだ行わない）

1. **同点 tie-break の明示** — UUID 順であることを Brief / Portfolio report に出す、または `--projects` 順を primary tie-break に統一
2. **DEFERRED 理由の同点対応** — 「同点のため今日の primary 以外」等
3. **Bottleneck と BLOCKED の分離** — `cross_project_bottlenecks` を BLOCKED ラベルで出さない
4. **RISKS 枠の kind 分散** — observation_gap 独占時に hypothesis を 1 件残す等
5. **mixed portfolio 検証** — Momotaro / FreeWater 等、スコア差のある Project との混在 Brief
6. **content + business + research + product の 4 kind 横断**

---

## 関連

- v0.4.1 検証: [GROUND_MULTI_PROJECT_PORTFOLIO_BRIEF_V0.4.1.md](./GROUND_MULTI_PROJECT_PORTFOLIO_BRIEF_V0.4.1.md)
- **v0.4.2 修正:** [GROUND_PORTFOLIO_BRIEF_CONSISTENCY_V0.4.2.md](./GROUND_PORTFOLIO_BRIEF_CONSISTENCY_V0.4.2.md) — primary/ranking tie-break 統一、DEFERRED 同点文言

---

## 10. テスト結果（v0.4.1 時点）

```bash
npm run test:ground-core
# 245 tests / 34 suites / 全 pass
```

コード変更なし。

---

## 関連ファイル

- `ground-core/director/portfolio-director.ts` — primary 選定・ranking
- `ground-core/director/portfolio-scoring.ts` — cross_project_score 計算
- `ground-core/director/scoring.ts` — project 内 Director score
- `ground-core/studio/scoring.ts` — TODAY / FLOW / RISKS 組み立て
- `ground-core/studio/brief-adapter.ts` — bottleneck → BLOCKED 混在
- `ground-core/examples/experiment-seeds/README.md` — seed 一覧
