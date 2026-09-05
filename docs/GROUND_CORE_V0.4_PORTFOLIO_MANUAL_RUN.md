# GROUND Core v0.4 — Portfolio Director Manual Run

> **日付**: 2026-06-07  
> **コマンド**: `npm run ground-core -- recommend-portfolio`  
> **対象**: GROUND Core / FreeWater / Japanese Folktale / Momotaro（storage 内 3 project）

実装: [GROUND_CORE_V0.4_MULTI_PROJECT_DIRECTOR.md](./GROUND_CORE_V0.4_MULTI_PROJECT_DIRECTOR.md)

---

## 実行コマンド

```bash
npm run ground-core -- recommend-portfolio \
  --projects 28d83a68-2064-43d7-94cb-72656b9006de,839578f5-36e1-4b6f-9be5-a97520f52b66,34092589-569a-4eec-923d-a105b6b1402c
```

---

## Top Recommendation

| 項目 | 値 |
|------|-----|
| **Project** | FreeWater |
| **Action** | 配布場所を1つ決める |
| **cross_project_score** | 0.95 |
| **urgency** | 0.74 |
| **confidence** | 0.73 |

### Why（要約）

- Director primary score 0.85 を横断比較に反映
- high blocker「配布場所が未確定」に直結
- downstream 1 件解放
- 現場検証チェーン先頭（field_validation_priority）

### Why not #2 (Momotaro)

- 横断スコア差 0.10
- urgency 0.66 < 0.74
- 現場検証チェーン先頭シグナルは FreeWater 側

---

## Project Ranking

| Rank | Project | Action | Score |
|------|---------|--------|-------|
| 1 | FreeWater | 配布場所を1つ決める | 0.95 |
| 2 | Japanese Folktale / Momotaro | 桃太郎のキャラクター固定ルールを整理する | 0.85 |
| 3 | GROUND Core | GROUND Core 自身の状態を ProjectState に保存する | 0.13 |

---

## Project Health

| Project | status | health | momentum | urgency |
|---------|--------|--------|----------|---------|
| FreeWater | ready | 0.66 | 0.50 | 0.74 |
| Momotaro | ready | 0.63 | 0.50 | 0.66 |
| GROUND Core | stalled | 0.21 | 0.20 | 0.21 |

---

## Deferred (today)

| Project | Action | 理由 |
|---------|--------|------|
| Momotaro | キャラ固定 | 横断スコア 0.85 < primary 0.95 |
| GROUND Core | ProjectState に保存 | meta_work_defer + 横断スコア低 |

---

## Portfolio Bottleneck

**FreeWater / 配布場所を1つ決める**

open blocker「配布場所が未確定」が primary action を止めている。完了で downstream 1 件解放。

---

## Blocked / Progressing

| 区分 | 結果 |
|------|------|
| **Blocked** | GROUND Core（stalled — movement シグナル弱） |
| **Progressing** | （なし — 全 project in_progress 0） |

---

## 気づき

1. **FreeWater が 1 位** — high blocker + 現場検証シグナル + Director score 0.85 が合成され、期待どおり。
2. **Momotaro は 2 位** — Director score は同率 0.85 だが、field_validation_priority と urgency で FreeWater に劣後。alternative として妥当。
3. **GROUND Core は meta_work_defer** — action / goal テキストに schema / patch / ProjectState 等の meta keyword が多く、downstream 0、blocker medium のみ → 横断スコア 0.13。deferred に明示。
4. **ProjectState は変更されない** — CLI 実行前後で storage JSON 不変（read-only 確認済み）。
5. **GROUND Core storage は v0.1 時代の goal のまま** — meta_work_defer は現 state 構造から正しく機能。将来 state を v0.4 以降に更新しても、構造シグナル方式なら project 名に依存しない。

---

## Safety / No Side Effect 確認

| 確認 | 結果 |
|------|------|
| saveProject 未呼び出し | ✅ |
| applyPatch 未呼び出し | ✅ |
| StatePatch 未生成 | ✅ |
| ProjectState 不変 | ✅ |
| requires_human_decision: true | ✅ |
| LLM API 未使用 | ✅ |

---

## テスト結果

```bash
npm run test:ground-core
```

```
ℹ tests 131
ℹ suites 26
ℹ pass 131
ℹ fail 0
```

Portfolio テスト 17 件含む（`portfolio-director.test.ts`）。

---

## 次に確認すべきポイント

1. **GROUND Core project state の更新** — v0.3/v0.4 作業を goal / next_action に反映する patch 例を examples に追加するか
2. **progressing 検出** — in_progress action を置いた manual run で progressing_projects が出るか
3. **project 間 dependency** — v0.5 で FreeWater 完了が Momotaro に波及するモデルが必要か
4. **weight チューニング** — 実運用で meta_work_defer -0.12 / field_validation +0.08 が適切か

---

*Manual run — v0.4 Portfolio Director 初回実装検証。*
