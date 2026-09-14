# GROUND Core v0.1 — 手動運用ログ（Phase D）

> **目的**: 実プロジェクト 1 件を CLI で運用し、ProjectState schema の不足を検証する。  
> **日付**: 2026-06-07  
> **対象**: GROUND Core 自身

---

## 1. 作成した project_id

```
34092589-569a-4eec-923d-a105b6b1402c
```

作成コマンド:

```bash
npm run ground-core -- init --title "GROUND Core"
```

保存先: `ground-core/storage/projects/34092589-569a-4eec-923d-a105b6b1402c.json`（gitignore 済み）

---

## 2. 適用した patch

**ファイル**: `ground-core/examples/ground-core-manual-run.patch.json`

**適用コマンド**:

```bash
npm run ground-core -- patch 34092589-569a-4eec-923d-a105b6b1402c \
  --file ground-core/examples/ground-core-manual-run.patch.json
```

### patch の概要（11 operations）

| # | op | entity | 内容 |
|---|-----|--------|------|
| 1 | upsert | project | summary を設定 |
| 2 | upsert | goal | 「v0.1 手動運用検証を完了する」 |
| 3 | upsert | current_state | phase / summary / confidence / primary_goal_id |
| 4 | upsert | blocker | schema 不足が不明 |
| 5–7 | upsert | next_action ×3 | 保存・1週間運用・v0.1.1 案 |
| 8–9 | upsert | decision ×2 | CLI 手動検証 / 本体非連携 |
| 10–11 | upsert | hypothesis ×2 | 7要素十分性 / StatePatch 文脈 |

### 適用結果

```
project_id: 34092589-569a-4eec-923d-a105b6b1402c
updated_at: 2026-06-07T03:16:41.334Z
```

---

## 3. show 結果の要約

| 要素 | 状態 |
|------|------|
| **Project** | title: GROUND Core / status: active / summary 設定済み |
| **Goal** | 1 件（active, priority 1）— 手動運用検証 |
| **Current State** | phase: `manual_run` / confidence: 0.85 / primary_goal リンク済み |
| **Blocker** | 1 件 open（schema 不足不明） |
| **Next Actions** | 3 件 pending（sort_order 0–2） |
| **Decisions** | 2 件 active |
| **Hypotheses** | 2 件 untested |

確認コマンド:

```bash
npm run ground-core -- show 34092589-569a-4eec-923d-a105b6b1402c
npm run ground-core -- list
```

---

## 4. schema 上、表現しづらかった点

実際に patch を書いて感じた friction:

1. **ブートストラップが重い**  
   `init` 後に `show` で `current_state.id` を取得し、11 operation の patch を手書きする必要がある。初回セットアップ用テンプレートがない。

2. **UUID を全部自分で用意する**  
   新規 entity ごとに UUID v4 を patch 側で生成する。ID 発行ヘルパーがない。

3. **ボイラープレートの繰り返し**  
   `project_id` / `created_at` / `updated_at` を各 payload に重複記述。Engine が project_id を補完しても created_at は必須。

4. **「今の一手」の明示が弱い**  
   `next_actions` は sort_order で並べられるが、「フォーカス中の 1 件」を Current State 側で指せない。3 件 pending のうちどれが今かは sort_order=0 慣習に依存。

5. **Blocker と Next Action の関係が薄い**  
   schema 上 `next_action.blocker_id` はあるが、今回の内容では Blocker と Action の対応を構造で表しにくかった（意味的には Blocker 解消 Action だが link なし）。

6. **Decision の alternatives が空になりがち**  
   rationale は書けるが、検討した選択肢を `alternatives_considered` に入れる運用が初回 patch では空のまま。必須配列だが「後から埋める」前提が不明瞭。

7. **Goal の進捗粒度**  
   status enum のみで、「何 % 完了」「どの milestone まで来たか」は Current State の summary 一文に押し込む必要がある。

8. **phase が自由文字列**  
   `manual_run` は書けるが、一覧や filter の convention が schema 外。個人運用なら可だが、Router 拡張時に enum 化を検討したくなる。

9. **単一 primary_goal_id**  
   副次フォーカス（並行 goal）を Current State 1 つで表現できない。

10. **変更の出所（provenance）**  
    「Phase D で手動投入」などのメタデータを標準 field なく、`extensions` に逃がすしかない。

---

## 5. v0.1.1 候補（schema / CLI 補完）

| 優先度 | 候補 | 理由 |
|--------|------|------|
| 高 | `ground-core bootstrap` または examples テンプレから init+patch 一発 | 初回セットアップ friction 低減 |
| 高 | CLI `ground-core new-id`（UUID 出力） | patch 作成時の ID 生成 |
| 中 | `next_action.is_focus: boolean` または `current_state.primary_next_action_id` | 「今の一手」の明示 |
| 中 | `next_action.blocker_id` を bootstrap 例で必ず link する convention 文書化 | Blocker↔Action 関係の定着 |
| 中 | `decision.alternatives_considered` を optional 化 | 初回は rationale のみで十分なケース |
| 低 | `goal.target_at`（optional ISO date） | milestone 表現 |
| 低 | `patch_log` テーブル/file（revision なしの最小 audit） | 手動運用中の変更履歴 |
| 低 | `project.tags` の CLI 対応（schema には既存） | Router 準備 |

**v0.1.1 でまだやらない**: LLM 抽出、Web UI、PostgreSQL、GROUND 本体連携、Goal Graph DAG。

---

## 6. 1 週間運用チェックリスト

手動 patch 運用中に見る観点:

- [ ] next_action を done にする頻度は妥当か
- [ ] hypothesis の evidence_for/against を更新したくなるか
- [ ] blocker resolved 後も state が追いやすいか
- [ ] decision を superseded にする場面が出るか
- [ ] 複数 goal が必要になったタイミング
- [ ] summary だけでは足りない field があるか

---

## 7. 次のステップ（Phase E 以降）

1. 1 週間の手動 patch を継続し、上記チェックリストを埋める
2. 不足が確定したら v0.1.1 schema 補完案を別 doc に起票
3. Extraction Layer（会話 → StatePatch）は **schema 安定後**

---

## 関連

- [GROUND_CORE_V0.1_DESIGN.md](./GROUND_CORE_V0.1_DESIGN.md)
- [GROUND_CORE_CLI_V0.1.md](./GROUND_CORE_CLI_V0.1.md)
- Patch 例: `ground-core/examples/ground-core-manual-run.patch.json`
