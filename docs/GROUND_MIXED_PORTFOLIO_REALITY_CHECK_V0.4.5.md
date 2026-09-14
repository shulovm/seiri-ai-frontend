# GROUND Mixed Portfolio Reality Check v0.4.5 — 検証記録

**検証日:** 2026-06-20  
**目的:** business だけ 1 セッション進行（observation / decision / done action）した mixed portfolio で、横断 Brief が状態差分に応じて変わるか確認する。

---

## 1. 使用 Project

| kind | project_id |
|------|------------|
| business | `fe45f9d3-1b34-4d2e-ad59-759cbea048cc` |
| research | `44cc405d-39ef-445d-9683-ffa056157f4c` |
| product | `b673cdb2-3428-4f9e-b21a-ac7aa67f96eb` |

`--projects` 引数順: **business, research, product**（全 run で統一）

---

## 2. 初期横断 Brief（3 Project すべて新規）

| 項目 | 内容 |
|------|------|
| **TODAY** | 無料配布型プロモーション検証 v0.1 — 検証場所の候補を3つ出す |
| **FLOW** | 1.business → 2.research → 3.product（入力順 tie-break、同点 0.66） |
| **RISKS** | observation_gap — **3 projects** / untested_hypothesis（business） / resource_overload |
| **BLOCKED** | (none) |
| **FLOW NOTES** | business (unlock) — 検証場所の候補を3つ出す |

v0.4.2〜v0.4.4 の改善が期待通り動作。

---

## 3. business session-01 patch

**完了 action:** 検証場所の候補を3つ出す (`d07c7326-ada5-4719-90dc-0865f2099415`)

**追加 decision:** 初回検証場所の候補を3つに絞る

**追加 observation:** 検証場所候補メモ

**summary:** 検証場所候補を3つに絞った。次は配布する対象物と数量を決める。

**新 primary_next_action:** 配布する対象物と数量を決める (`1a64d441-0285-496a-b935-9a602a18880e`)

**patch ファイル:** `ground-core/storage/session-patches/business-session-01-place.patch.json`

**フロー:** `build-complete-action-patch` → preview → `patch`（Human apply）

---

## 4. patch 適用後 — business 単体 Brief

| 項目 | 内容 |
|------|------|
| **TODAY** | 配布する対象物と数量を決める ✅ |
| **RISKS** | untested_hypothesis × 2（**observation_gap なし**） |
| **DECISIONS** | 初回検証場所の候補を3つに絞る が追加 ✅ |
| **momentum** | 0.25 → **0.35**（recent observation 加点） |
| **BLOCKED** | (none) |
| **FLOW NOTES** | unlock — 配布する対象物と数量を決める |

単体ループ `Action → Patch → Next Brief` は正常。

---

## 5. patch 適用後 — mixed portfolio Brief

| 項目 | 内容 |
|------|------|
| **TODAY** | **research** — 関連分野を5つに分類する（business ではない） |
| **FLOW** | 1.research → 2.product → 3.**business**（rank 3） |
| **RISKS** | observation_gap — **2 projects** / untested_hypothesis（research） / resource_overload |
| **BLOCKED** | (none) |
| **FLOW NOTES** | research (unlock) |
| **DEFERRED** | product, **business**（配布する対象物と数量を決める） |
| **GROWING** | business momentum **0.35**, research 0.25 |

---

## 6. observation_gap の変化

| 状態 | business | research | product | RISKS 表示 |
|------|----------|----------|---------|------------|
| 初期（全新規） | gap | gap | gap | **3 projects** 集約 |
| session-01 後 | **解消** | gap | gap | **2 projects** 集約 |

business に observation を追加したことで、横断 RISKS の集約件数が 3 → 2 に減った。v0.4.4 集約ロジックは mixed 状態でも有効。

---

## 7. recommend-portfolio JSON（session-01 後）

| 項目 | 値 |
|------|-----|
| **primary** | research — 関連分野を5つに分類する |
| **project_ranking** | 1.research 2.product 3.business |
| **business cross_project_score** | 0.66（変わらず） |
| **business urgency** | **0.40**（他 0.41） |
| **business momentum** | **0.35**（他 0.25） |
| **business recommendation_score** | **0.83**（先頭 action 完了で 0.85→0.83） |
| **deferred** | product, business |

**primary が research になった理由（説明可能）:**

1. `cross_project_score` は 3 Project とも 0.66 で同点
2. business は observation 追加で `urgency 0.40`、research/product は `0.41`
3. tie-break 前に urgency で research/product が business より上
4. `--projects` 入力順は **同点時のみ** 効く（v0.4.2）→ urgency 差で research が primary
5. business は momentum 最高（0.35）だが Portfolio primary 選定では urgency / director score の方が効いた

---

## 8. 評価

### 状態が変わると Brief も変わるか

**はい。** 単体・横断の両方で変化を確認。

- business 単体: TODAY / DECISIONS / RISKS / momentum が更新
- 横断: TODAY primary 切替、observation_gap 2 projects、FLOW rank 入替、DEFERRED に business

### TODAY は自然か

**議論余地あり（仕様として説明可能）。**

- business を 1 セッション進めた直後でも、横断 TODAY は **research** になる
- 理由: urgency / 入力順 tie-break 解除（business urgency が微減）
- GROWING に business momentum 0.35 と表示 → 人間は「business を続ける」判断材料はある
- Portfolio primary を盲信せず、GROWING + DEFERRED + FLOW rank 3 を見る運用が現実的

### RISKS は多様か

**はい。** v0.4.4 改善が mixed 状態でも有効。

```txt
observation_gap — 2 projects
untested_hypothesis — research
resource_overload — 3 project deep work
```

### FLOW NOTES / BLOCKED は正確か

**はい。** v0.4.3 分離が mixed 状態でも維持。

- BLOCKED: (none)
- FLOW NOTES: primary project（research）の unlock のみ

---

## 9. 見つかった問題（修正は今回しない）

| # | 問題 | 深刻度 |
|---|------|--------|
| 1 | business 進行直後でも横断 TODAY が research に切替 — momentum 最高でも primary にならない | 情報（仕様） |
| 2 | DEFERRED に「今進めている business」が入り、続行意欲と Brief primary がズレる | 低 |
| 3 | `--projects` 順が business 先でも、urgency 差で ranking 順が research 先になる | 情報 |
| 4 | narrative「注意点は 3 件 — research の観測不足が先頭」— business 進行は narrative に弱く反映 | 低 |

---

## 10. 次の候補（実装しない）

1. momentum / recent observation を Portfolio primary tie-break に反映するか検討
2. 「直近 session 進行 Project」を Brief narrative で明示
3. research / product も session 進行した 3-way mixed 再検証
4. FreeWater 等スコア差あり Project との mixed portfolio

---

## 11. 実行コマンド

```bash
npm run ground-core -- intake --file ground-core/examples/experiment-seeds/business-sample.json
npm run ground-core -- intake --file ground-core/examples/experiment-seeds/research-sample.json
npm run ground-core -- intake --file ground-core/examples/experiment-seeds/product-sample.json

npm run ground-core -- studio-brief --projects <business>,<research>,<product>

npm run ground-core -- build-complete-action-patch <business_id> \
  --action <first_action_id> \
  --decision-title "初回検証場所の候補を3つに絞る" \
  --decision-rationale "..." \
  --observation-title "検証場所候補メモ" \
  --observation-body "..." \
  --summary "..." \
  --out ground-core/storage/session-patches/business-session-01-place.patch.json \
  --format text

npm run ground-core -- patch <business_id> \
  --file ground-core/storage/session-patches/business-session-01-place.patch.json

npm run ground-core -- studio-brief --projects <business_id>
npm run ground-core -- studio-brief --projects <business>,<research>,<product>
npm run ground-core -- recommend-portfolio --projects <business>,<research>,<product> --format json

npm run test:ground-core
```

---

## 関連

- v0.4.1: [GROUND_MULTI_PROJECT_PORTFOLIO_BRIEF_V0.4.1.md](./GROUND_MULTI_PROJECT_PORTFOLIO_BRIEF_V0.4.1.md)
- v0.4.4: [GROUND_RISK_SIGNAL_DIVERSITY_V0.4.4.md](./GROUND_RISK_SIGNAL_DIVERSITY_V0.4.4.md)
