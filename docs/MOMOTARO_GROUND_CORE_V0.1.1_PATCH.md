# Momotaro — GROUND Core v0.1.1 Manual Patch 検証ログ

> **project_id**: `839578f5-36e1-4b6f-9be5-a97520f52b66`  
> **日付**: 2026-06-07  
> **patch**: `ground-core/examples/momotaro-v0.1.1-manual.patch.json`

---

## 1. migrate 確認結果

```bash
npm run ground-core -- show 839578f5-36e1-4b6f-9be5-a97520f52b66
```

| 項目 | 結果 |
|------|------|
| `schema_version` | **0.1.1**（v0.1.0 から load 時 migrate 済み） |
| `reference_docs` | patch 前 `[]` → patch 後 3 件 |
| `observations` | patch 前 `[]` → patch 後 1 件 |
| `judgments` | `[]`（今回未使用） |
| `primary_next_action_id` | patch 前 `null` → patch 後 設定 |
| `depends_on_action_id` | patch 前 全 action `null` → patch 後 chain 設定 |

---

## 2. 使用した next_action id 一覧

| sort | title | id | depends_on |
|------|-------|-----|------------|
| 0 | 桃太郎のキャラクター固定ルールを整理する | `c3333333-3333-4333-8333-333333333301` | —（**primary**） |
| 1 | 年齢別の桃太郎ビジュアルラインを作る | `c3333333-3333-4333-8333-333333333302` | `...3301` |
| 2 | 犬・猿・雉のブラッドラインを整理する | `c3333333-3333-4333-8333-333333333303` | `...3302` |
| 3 | Midjourneyに投げる本文ルールを確定する | `c3333333-3333-4333-8333-333333333304` | `...3303` |

`current_state.primary_next_action_id` = `c3333333-3333-4333-8333-333333333301`

---

## 3. 作成した reference_doc id 一覧

| title | id | path |
|-------|-----|------|
| Momotaro Trial v1 Production | `dd45038a-7fb4-40d4-b04f-4d663dd58a92` | `docs/MOMOTARO_TRIAL_V1_PRODUCTION.md` |
| Japanese Folktale Constitution v1 Light | `023d26b6-e5a4-4ea3-884a-5d942fa2c30d` | `docs/JAPANESE_FOLKTALE_CONSTITUTION_V1_LIGHT.md` |
| Japanese Folktale Governance v2 Future | `b0c267c7-05fe-4e86-84d8-732b42fb33f2` | `docs/JAPANESE_FOLKTALE_GOVERNANCE_V2_FUTURE.md` |

---

## 4. 作成した observation id

```
39787a9f-c487-48d3-a570-7c442ffa5677
```

- title: Momotaro v0.1.1 制作管理メモ  
- source: manual  
- observed_at: 2026-06-07T04:07:19.000Z

---

## 5. patch ファイル

`ground-core/examples/momotaro-v0.1.1-manual.patch.json`

8 operations:

1. next_action 302 → depends on 301  
2. next_action 303 → depends on 302  
3. next_action 304 → depends on 303  
4. current_state → primary_next_action_id = 301  
5. reference_doc upsert（Trial v1 Production）  
6. reference_doc upsert（Constitution v1 Light）  
7. reference_doc upsert（Governance v2 Future）  
8. observation upsert  

---

## 6. patch 適用結果

```bash
npm run ground-core -- patch 839578f5-36e1-4b6f-9be5-a97520f52b66 \
  --file ground-core/examples/momotaro-v0.1.1-manual.patch.json
```

```
project_id: 839578f5-36e1-4b6f-9be5-a97520f52b66
updated_at: 2026-06-07T04:07:33.353Z
```

---

## 7. show 結果の要約

| 要素 | patch 後 |
|------|----------|
| **schema_version** | 0.1.1 |
| **Current State** | primary_next_action →「桃太郎のキャラクター固定ルールを整理する」 |
| **Next Actions** | 4 件、depends_on で線形 chain（キャラ固定 → 年齢別ビジュアル → ブラッドライン → MJ ルール） |
| **Reference Docs** | 3 件（制作手順・軽量憲法・将来統治設計） |
| **Observations** | 1 件（制作管理メモ） |
| **Judgments** | 0 件（今回未使用） |
| **Decisions** | 3 件（変更なし） |
| **Blockers** | 3 件（変更なし） |

---

## 8. v0.1.1 で表現しやすくなった点

1. **制作 bible との接続** — `reference_docs[]` で Trial v1 / Constitution / Governance を ProjectState から直接参照できる  
2. **今の一手が明示** — `primary_next_action_id` で「キャラクター固定ルール整理」が焦点と分かる  
3. **制作順序の構造化** — sort_order だけでなく `depends_on_action_id` でキャラ → 年齢 → 仲間 → ツールの依存が機械可読  
4. **制作メモの独立保存** — Observation として Blocker / next_action に押し込まず、制作管理の所感を残せる  
5. **創作系でも v0.1 7要素 + v0.1.1 拡張が共存** — Decision / Hypothesis はそのまま、新構造を上乗せできる  

---

## 9. まだ表現しづらい点

1. **キャラクター roster** — 桃太郎・老人・犬猿雉・鬼など個別 entity がなく、Blocker / next_action / 外部 docs に分散  
2. **年齢別ビジュアル** — 独立した visual_rule_set entity がなく、next_action description のみ  
3. **ツール別制約** — Midjourney ルールは next_action タイトルで示すが tool_profile entity はない  
4. **reference_doc と next_action のリンク** — doc path はあるが、どの action がどの doc を読むべきかの FK なし  
5. **Action done 時の cascade** — depends_on はあるが、301 done 時に 302 を auto-focus する仕組みはない  
6. **deliverable / scene** — 試作 v1 のシーン単位成果物は docs 側に残り、ProjectState には未モデル化  

---

## 10. テスト実行結果

```bash
npm run test:ground-core
```

**42 tests, 0 fail**

---

## 次の manual patch 案（制作進行後）

1. next_action 301 を `status_change: done`、301 完了 observation 追加  
2. `primary_next_action_id` を 302 に更新  
3. reference_doc 追加（Character Bible / Visual Bible 等）  
4. 必要なら judgment 追加（キャラ固定ルール Go / Revise）  

---

## 関連

- [MOMOTARO_GROUND_CORE_MANUAL_RUN_V0.1.md](./MOMOTARO_GROUND_CORE_MANUAL_RUN_V0.1.md)
- [GROUND_CORE_V0.1.1.md](./GROUND_CORE_V0.1.1.md)
