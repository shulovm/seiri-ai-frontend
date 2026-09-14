# FreeWater — GROUND Core v0.1.1 Manual Patch 検証ログ

> **project_id**: `28d83a68-2064-43d7-94cb-72656b9006de`  
> **日付**: 2026-06-07  
> **patch**: `ground-core/examples/freewater-v0.1.1-manual.patch.json`

---

## 1. migrate 確認結果

```bash
npm run ground-core -- show 28d83a68-2064-43d7-94cb-72656b9006de
```

| 項目 | 結果 |
|------|------|
| `schema_version` | **0.1.1**（v0.1.0 から load 時 migrate 済み） |
| `reference_docs` | `[]`（migrate 補完） |
| `observations` | patch 前 `[]` → patch 後 1 件 |
| `judgments` | patch 前 `[]` → patch 後 1 件 |
| `primary_next_action_id` | patch 前 `null` → patch 後 設定 |
| `depends_on_action_id` | patch 前 全 action `null` → patch 後 chain 設定 |

---

## 2. 使用した next_action id 一覧

| sort | title | id | depends_on |
|------|-------|-----|------------|
| 0 | 配布場所を1つ決める | `f3333333-3333-4333-8333-333333333301` | —（**primary**） |
| 1 | 水2ケースとA4看板を用意する | `f3333333-3333-4333-8333-333333333302` | `...3301` |
| 2 | 2〜3時間配布して5分メモを残す | `f3333333-3333-4333-8333-333333333303` | `...3302` |
| 3 | 翌日にGo / Stop / 修正を判断する | `f3333333-3333-4333-8333-333333333304` | `...3303` |

`current_state.primary_next_action_id` = `f3333333-3333-4333-8333-333333333301`

---

## 3. 作成した observation id

```
f9010101-0101-4101-8101-010101010101
```

- title: Phase0 実施前メモ  
- source: manual  
- observed_at: 2026-06-07T04:03:12.000Z

---

## 4. 作成した judgment id

```
f9020202-0202-4202-8202-020202020202
```

- title: Phase0 は実施前なので hold  
- outcome: hold  
- observation_id: `f9010101-0101-4101-8101-010101010101`

---

## 5. patch ファイル

`ground-core/examples/freewater-v0.1.1-manual.patch.json`

6 operations:

1. next_action 302 → depends on 301  
2. next_action 303 → depends on 302  
3. next_action 304 → depends on 303  
4. current_state → primary_next_action_id = 301  
5. observation upsert  
6. judgment upsert  

---

## 6. patch 適用結果

```bash
npm run ground-core -- patch 28d83a68-2064-43d7-94cb-72656b9006de \
  --file ground-core/examples/freewater-v0.1.1-manual.patch.json
```

```
project_id: 28d83a68-2064-43d7-94cb-72656b9006de
updated_at: 2026-06-07T04:03:18.074Z
```

---

## 7. show 結果の要約

| 要素 | patch 後 |
|------|----------|
| **schema_version** | 0.1.1 |
| **Current State** | primary_next_action →「配布場所を1つ決める」 |
| **Next Actions** | 4 件、depends_on で線形 chain |
| **Observations** | 1 件（実施前メモ） |
| **Judgments** | 1 件（hold — 現場前） |
| **Decisions** | 3 件（変更なし） |
| **reference_docs** | 0 件（今回未使用） |

---

## 8. v0.1.1 で表現しやすくなった点

1. **今の一手が明示された** — `primary_next_action_id` で「配布場所を決める」が焦点と一目で分かる  
2. **Action chain が構造化** — sort_order だけでなく `depends_on_action_id` で依存が機械可読  
3. **実施前メモを Observation として保存** — Blocker description や next_action に押し込まなくてよい  
4. **Go/Stop 前の hold を Judgment として記録** — Decision（方針）と Judgment（判定）の分離が機能  
5. **observation → judgment リンク** — 現場後の Go 判断に同じパターンを再利用できる  

---

## 9. まだ表現しづらい点

1. **5分現場メモのテンプレ** — body 自由文のみ。受け取り率・怪しさ等の structured field はまだない  
2. **hold 後の再 judgment フロー** — 同一 goal に judgment 履歴を並べる convention はあるが、latest 判定はアプリ層  
3. **Action done 時の cascade** — depends_on はあるが、301 done 時に 302 を auto-focus する仕組みはない  
4. **location** — 配布場所は Blocker に残ったまま。確定後の location 確定 field なし  
5. **reference_docs** — 今回未使用。運用手順書リンクは次回 patch で試す余地  

---

## 10. テスト実行結果

```bash
npm run test:ground-core
```

**42 tests, 0 fail**

---

## 次の manual patch 案（Phase0 現場後）

1. next_action 301–303 を `status_change: done`  
2. observation 追加（5分現場メモ、`source: field_test`）  
3. judgment 追加（`outcome: go | stop | revise`）  
4. `primary_next_action_id` を次の pending action に更新  

---

## 関連

- [FREEWATER_GROUND_CORE_MANUAL_RUN_V0.1.md](./FREEWATER_GROUND_CORE_MANUAL_RUN_V0.1.md)
- [GROUND_CORE_V0.1.1.md](./GROUND_CORE_V0.1.1.md)
