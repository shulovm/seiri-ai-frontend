# GROUND Core v0.2.1 — Semantic Extraction 実データ検証ログ

> **日付**: 2026-06-07  
> **方式**: `propose` のみ（patch 未適用、ProjectState 未変更）  
> **extractor**: semantic（デフォルト）

---

## 対象 project

| project | project_id |
|---------|------------|
| FreeWater | `28d83a68-2064-43d7-94cb-72656b9006de` |
| Momotaro | `839578f5-36e1-4b6f-9be5-a97520f52b66` |

---

## 検証前 ProjectState スナップショット

| 項目 | FreeWater | Momotaro |
|------|-----------|----------|
| `updated_at` | `2026-06-07T04:03:18.074Z` | `2026-06-07T04:07:33.353Z` |
| `observations` 件数 | 1 | 1 |
| `primary_next_action_id` | `...3301`（配布場所を1つ決める） | `...3301`（キャラ固定） |
| 配布場所 action status | `pending` | — |
| 配布場所 blocker status | `open` | — |
| `project.status` | `active` | `active` |

---

## 1. FreeWater — 「新宿中央公園でやろうかな」

```bash
npm run ground-core -- propose 28d83a68-2064-43d7-94cb-72656b9006de \
  --text "新宿中央公園でやろうかな"
```

| 項目 | 結果 |
|------|------|
| **検出 EventType** | `CandidateCreated`（modality: intent, evidence: かな / やろう） |
| **出力種別** | PatchProposal（exit 0） |
| **operations** | observation ×1 |
| **confidence** | 0.62 |
| **risk_level** | medium |
| **action done** | なし |
| **blocker resolved** | なし |
| **primary 変更** | なし |
| **期待との一致** | **一致** |

出力例: `ground-core/examples/semantic-manual-run/01-candidate.raw.json`

---

## 2. FreeWater — 「新宿中央公園に決めた」

```bash
npm run ground-core -- propose 28d83a68-2064-43d7-94cb-72656b9006de \
  --text "新宿中央公園に決めた"
```

| 項目 | 結果 |
|------|------|
| **検出 EventType** | `DecisionMade`（modality: commitment, evidence: 決めた） |
| **出力種別** | PatchProposal（exit 0） |
| **operations** | observation + judgment（outcome: hold） |
| **confidence** | 0.75 |
| **risk_level** | medium |
| **action done** | なし |
| **blocker resolved** | なし |
| **primary 変更** | なし |
| **期待との一致** | **一致** |

judgment rationale: 「action done / blocker resolved は v0.2.1 では自動提案しない」

出力例: `ground-core/examples/semantic-manual-run/02-decision.raw.json`

---

## 3. FreeWater — 「もう少し考える」

```bash
npm run ground-core -- propose 28d83a68-2064-43d7-94cb-72656b9006de \
  --text "もう少し考える"
```

| 項目 | 結果 |
|------|------|
| **検出 EventType** | `ActionDeferred`（modality: deferred, evidence: 考える） |
| **出力種別** | PatchProposal（exit 0） |
| **operations** | observation + judgment（outcome: hold） |
| **confidence** | 0.70 |
| **risk_level** | low |
| **期待との一致** | **一致** |

出力例: `ground-core/examples/semantic-manual-run/03-deferred.raw.json`

---

## 4. FreeWater — 「もう無理、やめたい」

```bash
npm run ground-core -- propose 28d83a68-2064-43d7-94cb-72656b9006de \
  --text "もう無理、やめたい"
```

| 項目 | 結果 |
|------|------|
| **検出 EventType** | `StopRequested`（modality: negative, evidence: 無理 / やめたい） |
| **出力種別** | ClarificationResponse（exit 1） |
| **reason** | 感情・一時判断の可能性があるため、自動で停止判定しない |
| **questions** | hold / revise / stop の 3 問 |
| **risk_level** | high |
| **project.status 変更** | なし（patch 自体なし） |
| **期待との一致** | **一致** |

出力例: `ground-core/examples/semantic-manual-run/04-stop.raw.json`

---

## 5. Momotaro — 「桃太郎はまずキャラ固定からやる」

```bash
npm run ground-core -- propose 839578f5-36e1-4b6f-9be5-a97520f52b66 \
  --text "桃太郎はまずキャラ固定からやる"
```

| 項目 | 結果 |
|------|------|
| **検出 EventType** | **なし**（いずれの modality パターンにも不一致） |
| **出力種別** | ClarificationResponse（exit 1） |
| **reason** | Semantic Event を検出できませんでした |
| **期待との一致** | **想定内（部分一致）** |

**所見**: `PriorityChanged` 未実装のため、「まず」「からやる」だけでは event 化されない。  
v0.2 mock（`--extractor mock`）では Momotaro + 「キャラ固定」で PatchProposal になるが、semantic では clarification。

出力例: `ground-core/examples/semantic-manual-run/05-momotaro-priority.raw.json`

---

## 6. Momotaro — 「MJ文面は後でいい」

```bash
npm run ground-core -- propose 839578f5-36e1-4b6f-9be5-a97520f52b66 \
  --text "MJ文面は後でいい"
```

| 項目 | 結果 |
|------|------|
| **検出 EventType** | `ActionDeferred`（modality: deferred, evidence: 後で） |
| **出力種別** | PatchProposal（exit 0） |
| **operations** | observation + judgment hold |
| **confidence** | 0.70 |
| **risk_level** | low |
| **期待との一致** | **一致（EventType）** / **解像度不足（要確認）** |

**所見**: 「後で」は検出されるが、**何を後回しにしたか**（MJ 文面 action）は ProjectState にリンクされない。  
observation.body に原文「MJ文面は後でいい」が残るのみ。next_action / primary は変更なし。

出力例: `ground-core/examples/semantic-manual-run/06-momotaro-deferred.raw.json`

---

## 7. ProjectState 変更なし確認

6 回の `propose` 実行後、`show` で確認:

| 項目 | FreeWater（検証後） | 期待 | Momotaro（検証後） | 期待 |
|------|---------------------|------|-------------------|------|
| `updated_at` | `2026-06-07T04:03:18.074Z` | 変更なし | `2026-06-07T04:07:33.353Z` | 変更なし |
| `observations` 件数 | 1 | 変更なし | 1 | 変更なし |
| 配布場所 action | `pending` | 変更なし | — | — |
| 配布場所 blocker | `open` | 変更なし | — | — |
| `primary_next_action_id` | `...3301` | 変更なし | `...3301` | 変更なし |
| `project.status` | `active` | 変更なし | `active` | 変更なし |

**結論: ProjectState は一切変更されていない。**

---

## 8. 期待との一致サマリ

| # | 入力 | 期待 | 結果 | 判定 |
|---|------|------|------|------|
| 1 | やろうかな | CandidateCreated, obs のみ | 同左 | 一致 |
| 2 | 決めた | DecisionMade, obs + judgment hold | 同左 | 一致 |
| 3 | 考える | ActionDeferred | 同左 | 一致 |
| 4 | やめたい | Clarification | 同左 | 一致 |
| 5 | まずキャラ固定 | Clarification または弱 obs の可能性 | Clarification（event 未検出） | 想定内 |
| 6 | 後でいい | ActionDeferred | 同左（解像度不足） | 部分一致 |

---

## 9. semantic pipeline の弱点

1. **PriorityChanged 未実装** — 「まず X からやる」が event 化されず clarification 落ち（#5）
2. **Deferred の対象不明** — 「後で」だけでは next_action 特定不可（#6）
3. **DecisionMade が state を進めない** — 意図的だが、人間は「決めた」後に action done を期待しうる
4. **target_kind が observation に反映されない** — location 候補でも observation タイトルは汎用「候補の記録」
5. **EventType が PatchProposal JSON に含まれない** — デバッグ・レビュー時に modality 推定が必要
6. **mock との挙動差** — 同一 Momotaro 入力で mock は PatchProposal、semantic は clarification

---

## 10. 次に追加すべき EventType 候補

| 優先度 | EventType | 理由 |
|--------|-----------|------|
| **高** | `PriorityChanged` | 制作系「まず X から」対応（#5） |
| **高** | `ActionDeferred` + EventResolver | 「MJ文面は後で」→ 特定 next_action へのリンク（#6） |
| **中** | `ActionCompleted` | DecisionMade + commitment 後の done 提案（Modality gate 必須） |
| **中** | `BlockerMitigated` | 場所決定 + commitment 後の blocker 解消 |
| **低** | `RevisionRequested` | StopRequested と ActionDeferred の中間 |

---

## 11. v0.2.2 に進むべきか / v0.2.1 補強か

### 推奨: **v0.2.1 補強 → その後 v0.2.2**

| フェーズ | 内容 | 理由 |
|----------|------|------|
| **v0.2.1 補強（先）** | `PriorityChanged` の modality パターン追加（「まず」「からやる」— 固有名詞なし） | #5 は 1 パターン追加で改善。誤爆リスク低 |
| **v0.2.1 補強（先）** | PatchProposal に `semantic_events[]` を embed | 手動検証・レビュー効率化 |
| **v0.2.2（後）** | EventResolver + `ActionCompleted` / `BlockerMitigated` | DecisionMade 後の state 進行。Modality gate + role convention 必須 |
| **v0.2.2（後）** | Deferred → next_action 解決 | ProjectState の title semantic match または role extensions |

**理由**: FreeWater 4 ケースは v0.2.1 で期待通り。Momotaro の gap は PriorityChanged と Resolver が主因。  
ActionCompleted を先に入れると「決めた」入力で再び mock 同等の誤爆リスクが戻るため、**Resolver 整備後の v0.2.2 が安全**。

---

## 12. テスト実行結果

```bash
npm run test:ground-core
```

**64 tests, 0 fail**

---

## 関連

- [GROUND_CORE_V0.2.1_SEMANTIC_EXTRACTION.md](./GROUND_CORE_V0.2.1_SEMANTIC_EXTRACTION.md)
- [GROUND_CORE_V0.2.1_SEMANTIC_EXTRACTION_DESIGN.md](./GROUND_CORE_V0.2.1_SEMANTIC_EXTRACTION_DESIGN.md)
- 出力 JSON: `ground-core/examples/semantic-manual-run/*.raw.json`
