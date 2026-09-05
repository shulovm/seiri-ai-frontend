# GROUND Core v0.2 — Extraction Layer

> **地位**: v0.1.1 State Engine の上に載る、自然言語 → PatchProposal 変換層（初回実装）。  
> **実装**: MockExtractor のみ。LLM API 接続なし。自動保存なし。

---

## v0.2 の思想

GROUND Core が保存するのは **ProjectState**（幹・枝）であり、会話ログではない。

```
UserInput → Extraction Layer → PatchProposal → Human Review → patch CLI → ProjectState
```

- **Conversation は入力源** — 永続化しない
- **PatchProposal は提案** — `requires_human_approval: true` 固定
- **State 更新は人間承認後のみ** — 既存 `patch` コマンド

---

## CLI propose の使い方

```bash
# 基本
npm run ground-core -- propose <project_id> --text "..."

# ファイル入力
npm run ground-core -- propose <project_id> --file ./input.txt

# ファイル出力
npm run ground-core -- propose <project_id> --text "..." \
  --out ./proposals/example.proposal.json
```

### exit code

| code | 意味 |
|------|------|
| 0 | PatchProposal 成功 |
| 1 | ClarificationResponse |
| 2 | validation / dry-run 内部エラー |

### 承認後の適用

```bash
# proposed_patch を取り出して手編集可
jq '.proposed_patch' proposal.json > approved-patch.json

# 人間が確認後に適用
npm run ground-core -- patch <project_id> --file approved-patch.json
```

**propose は `saveProject` を呼ばない。** ProjectState ファイルは変更されない。

---

## 内部フロー

1. `loadProject(project_id)` — context 取得
2. `mockExtractor.propose(input)` — patch 草案 or clarification
3. `validateStatePatch(proposed_patch)`
4. `dryRunPatch(state, patch)` — `applyPatch` を試行（保存しない）
5. `confidence >= 0.55` 未満 → clarification
6. PatchProposal JSON 出力

---

## MockExtractor の対応ルール

| # | 条件 | 結果 |
|---|------|------|
| 1 | 「やめる」「だるい」「もう無理」 | ClarificationResponse（risk: high） |
| 2 | FreeWater + 「場所」or「新宿中央公園」 | PatchProposal（confidence 0.86, risk low） |
| 3 | Momotaro + 「キャラ固定」 | PatchProposal（confidence 0.78, risk low） |
| 4 | 上記以外 | ClarificationResponse（一致ルールなし） |

### FreeWater 配布場所 proposal の operations

1. observation 追加（配布場所の検討）
2. blocker「配布場所が未確定」→ `mitigated`
3. next_action「配布場所を1つ決める」→ `done`
4. `primary_next_action_id` → 次 action（水2ケース…）

### Momotaro キャラ固定 proposal の operations

1. observation 追加（制作優先順位メモ）
2. `primary_next_action_id` → キャラ固定 action

### やめる系 clarification

- project.status は **変更しない**
- questions: hold / revise / stop の確認

---

## 危険ルール（コードで強制）

- `project.status` 変更 proposal 禁止
- `delete` operation 禁止
- operation 上限 **8**
- `confidence < 0.55` → clarification
- dry-run 失敗 → exit 2（proposal 出力しない）
- `requires_human_approval` は常に `true`

---

## MockExtractor の限界

- **キーワードマッチのみ** — 言い回しの揺れに弱い
- **3 ルール + fallback** — 一般入力は clarification
- **project 推定なし** — `project_id` は CLI で明示必須
- **新 entity 追加不可** — 既存 state の entity_id のみ参照
- **judgment 自動生成なし** — 停止意向も clarification のみ

---

## v0.2 でやらないこと

| 項目 | 理由 |
|------|------|
| OpenAI / Anthropic API | v0.2.1 候補 |
| 自動保存 | 思想違反 |
| Web UI | Interface Layer 将来 |
| AI Router | 未着手 |
| PostgreSQL | File Store 継続 |
| conversation memory | 葉は保存しない |
| background agent | 自動 propose 禁止 |

---

## 実装ファイル

```
ground-core/extraction/
  types.ts
  mock-extractor.ts
  propose.ts
  dry-run.ts
ground-core/__tests__/extraction.test.ts
ground-core/examples/proposals/
  freewater-location.proposal.json
  momotaro-priority.proposal.json
  freewater-quit.clarification.json
```

---

## 次の v0.2.1 候補

1. **LLM Extractor** — prompt template + API 接続（保存は PatchProposal のみ）
2. **project-resolver** — `--auto-project` フラグ
3. **patch-mapper / risk-assessor 分割** — mock ルール増加時
4. **review-propose CLI** — 人間向け diff / checklist 表示
5. **golden proposal テスト** — 固定 UUID fixture

---

## 関連

- [GROUND_CORE_V0.2_EXTRACTION_DESIGN.md](./GROUND_CORE_V0.2_EXTRACTION_DESIGN.md) — 設計詳細
- [GROUND_CORE_V0.1.1.md](./GROUND_CORE_V0.1.1.md) — 現行 schema
- [GROUND_CORE_CLI_V0.1.md](./GROUND_CORE_CLI_V0.1.md) — patch コマンド
