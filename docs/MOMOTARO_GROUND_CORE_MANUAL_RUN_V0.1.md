# Japanese Folktale / Momotaro — GROUND Core 実戦検証ログ（Phase D.5-2）

> **目的**: 創作制作プロジェクトを ProjectState 化し、事業系（FreeWater）・メタ系（GROUND Core）に加えて **制作系** での schema 適合性を検証する。  
> **日付**: 2026-06-07

---

## 1. 作成した Momotaro project_id

```
839578f5-36e1-4b6f-9be5-a97520f52b66
```

```bash
npm run ground-core -- init --title "Japanese Folktale / Momotaro"
```

保存先: `ground-core/storage/projects/839578f5-36e1-4b6f-9be5-a97520f52b66.json`（gitignore 済み）

---

## 2. 作成した patch ファイル

**パス**: `ground-core/examples/momotaro-production-design.patch.json`

```bash
npm run ground-core -- patch 839578f5-36e1-4b6f-9be5-a97520f52b66 \
  --file ground-core/examples/momotaro-production-design.patch.json
```

### patch 概要（16 operations）

| # | entity | 内容 |
|---|--------|------|
| 1 | project | summary（AI再構成・一貫性固定） |
| 2 | goal | trial v1 制作設計の安定 |
| 3 | current_state | production_design / confidence 0.75 |
| 4–6 | blocker ×3 | キャラ一貫性 / 年齢ルール / MJ プロンプト |
| 7–10 | next_action ×4 | キャラ固定 → 年齢ライン → ブラッドライン → MJ ルール |
| 11–13 | decision ×3 | 文面優先 / 物語骨格 / 要素分解 |
| 14–16 | hypothesis ×3 | 7要素適用 / Blocker管理 / 制作系適用 |

**補足**: next_action は対応 Blocker に `blocker_id` でリンク（1→一貫性、2→年齢、3→一貫性、4→MJ）。

### patch 作成時のハマりどころ

初回 draft では entity_id に `m1111111-...` のような **非16進 prefix** を使い、Ajv の `format: uuid` で reject された。  
UUID は **0-9a-f のみ**。プレフィックス命名（`m` = Momotaro）は schema 上使えない → v0.1.1 で `new-id` CLI が有用。

---

## 3. patch 適用結果

```
project_id: 839578f5-36e1-4b6f-9be5-a97520f52b66
updated_at: 2026-06-07T03:39:47.553Z
```

---

## 4. show 結果の要約

| 要素 | 件数 | 要点 |
|------|------|------|
| **Project** | 1 | Japanese Folktale / Momotaro / active |
| **Goal** | 1 | trial v1 制作設計安定（キャラ・世界観・手順固定） |
| **Current State** | 1 | phase: `production_design` / confidence: 0.75 / ドキュメント群あり・一貫性が焦点 |
| **Blockers** | 3 | キャラ一貫性（high）/ 年齢ルール（medium）/ MJ 運用（medium） |
| **Next Actions** | 4 | キャラ固定 → 年齢ライン → 犬猿雉 → MJ ルール |
| **Decisions** | 3 | 画像自動生成しない / 物語骨格省略しない / 作家名依存しない |
| **Hypotheses** | 3 | 7要素で制作管理 / Blocker+Decision 十分性 / 制作系適用 |

確認:

```bash
npm run ground-core -- show 839578f5-36e1-4b6f-9be5-a97520f52b66
npm run ground-core -- list
```

現在の Project 一覧（3 件）:

- FreeWater
- GROUND Core
- Japanese Folktale / Momotaro

---

## 5. schema 上、表現しづらかった点

### 5.1 全プロジェクト共通（Phase D / D.5）

- init → show → 大 patch のブートストラップ
- UUID 手書き・16進制約
- sort_order による「今の一手」

### 5.2 Momotaro / 創作制作 固有

1. **リポジトリ内ドキュメントとのリンク**  
   `docs/MOMOTARO_CHARACTER_BIBLE.md` 等の制作仕様書への参照 field がない。ProjectState と Markdown 群が **二重管理** になりやすい。

2. **キャラクター roster**  
   桃太郎・老人・犬猿雉・鬼は Blocker / next_action の description に散在。**Character entity**（名前・年齢段階・固定ルール）がない。

3. **物語骨格（必須 beat）**  
   Decision rationale に「芝刈り…帰還」と列挙したが、**beat チェックリスト**として構造化できない。制作進捗（どの beat まで設計済み）が追えない。

4. **年齢別ビジュアルライン**  
   「幼少期・少年期・青年期」は next_action 1 件の description。**Age variant** や Character lifecycle が schema にない。

5. **ブラッドライン / 仲間関係**  
   犬猿雉の出自・役割は next_action タイトル程度。**Lineage / cast graph** が Goal Graph 拡張待ち。

6. **視覚ルール（要素分解）**  
   「自然・静寂・土・神秘・奥行き」は Decision に平文。Visual rule set として再利用・差分管理しにくい。

7. **Midjourney 運用ルール**  
   Tool 固有の制約（改行禁止・作家名禁止・画像生成禁止）は Decision + Blocker で代用可能だが、**tool_profile** として切り出したい。

8. **成果物タイプの区別**  
   「プロンプト文」「設定 doc」「画像（将来）」の deliverable 区別がない。Decision「画像は勝手に生成しない」は方針だが、**成果物ステータス**と連動しない。

9. **trial v1 vs 本番パイプライン**  
   phase 文字列 `production_design` のみ。制作パイプライン段階（design → prompt → review → gen）の enum/entity なし。

10. **3 Blocker が parallel**  
    4 next_action が異なる Blocker にリンクする構造はうまくいったが、**優先順位の動的変更**（今週は MJ ルール優先など）は current_state 更新のみ。

---

## 6. v0.1.1 に追加すべき候補

Phase D / D.5 に加え、**制作系**で優先度が上がったもの:

| 優先度 | 候補 | 根拠（Momotaro） |
|--------|------|------------------|
| **高** | `reference_doc` entity（path, title, status） | Bible / Pipeline doc とのリンク |
| **高** | `character` entity（name, age_stages[], visual_rules[]） | キャラ一貫性・年齢ライン |
| **高** | CLI `new-id` + UUID 16進チェックのエラーメッセージ改善 | patch 作成 friction |
| **中** | `story_beat` / `canon_spine` entity | 物語骨格のチェックリスト |
| **中** | `visual_rule_set` entity | 要素分解ルールの構造化 |
| **中** | `tool_profile`（Midjourney 制約） | プロンプト運用ルール |
| **中** | `deliverable` entity（type: prompt \| spec \| asset） | 文面設計 vs 画像の区別 |
| **低** | Goal Graph で cast / bloodline | 犬猿雉ブラッドライン |
| **低** | `production_phase` enum | design / prompt / review / render |

**3 ドメイン横断で v0.1.1 最優先**:

1. bootstrap / template patch  
2. `observation`（FreeWater 現場メモ）  
3. `reference_doc` + `character`（Momotaro 制作）

---

## 7. テスト実行結果

```bash
npm run test:ground-core
```

**27 tests, 0 fail**

---

## 8. 次の手動運用

制作設計が進んだら patch で更新:

1. next_action 1 を `done` → Blocker「キャラ一貫性」を `mitigated`
2. `docs/MOMOTARO_*.md` 更新時は Decision / current_state summary を同期
3. Hypothesis 1–3 に evidence_for を追加（7要素で回せたか）

---

## 関連

- 制作 doc: `docs/MOMOTARO_TRIAL_V1_PRODUCTION.md`, `docs/MOMOTARO_CHARACTER_BIBLE.md` 等
- [FREEWATER_GROUND_CORE_MANUAL_RUN_V0.1.md](./FREEWATER_GROUND_CORE_MANUAL_RUN_V0.1.md)
- [GROUND_CORE_MANUAL_RUN_V0.1.md](./GROUND_CORE_MANUAL_RUN_V0.1.md)
- Patch: `ground-core/examples/momotaro-production-design.patch.json`
