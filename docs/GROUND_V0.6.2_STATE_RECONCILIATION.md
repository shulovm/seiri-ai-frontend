# GROUND v0.6.2 — State Reconciliation Controls

## 目的

Reality Loop で得た新しい事実によって陳腐化した ProjectState の
**構造情報**を、人間承認前提で安全に整理する。

これは Phase 2 ではない。新しい自動判断エンジンも作らない。

## Reality との責務境界

| 層 | 扱うこと | 扱わないこと |
|----|----------|--------------|
| Reality Semantics (v0.6.1) | 何が起きたか（observation / progress / intention） | blocker resolve / action done / primary 選定 |
| State Reconciliation (v0.6.2) | 既存 state のどの構造を整理するか | 出来事の意味分類、自動 primary 判定 |
| Decision（人間） | 次 primary を承認する | AI の rank を mutation にすること |

```
Reality observation  ─×→  自動で blocker / action / primary を書き換えない
人間明示 reconcile   ──→  PatchProposal → (人間) reconcile-apply / reality-apply
```

## Operations（1 Proposal = 1 op）

| `--op` | 必須入力 | Proposal 効果 |
|--------|----------|---------------|
| `resolve-blocker` | `--blocker-id` + `--evidence` | blocker → resolved + observation（根拠） |
| `complete-action` | `--action-id` | action → done。**次 primary 自動選定なし**。対象が現行 primary なら `primary_next_action_id = null` |
| `set-primary` | `--action-id` **または** `--new-action-title` | 指定 action のみ primary / 新規 pending を作成して primary |
| `update-current-state` | `--summary` および/または `--phase` | current_state の明示更新（補助 op） |

## CLI

```bash
npx tsx ground-core/cli.ts reconcile-propose <project_id> --op resolve-blocker \
  --blocker-id <id> --evidence <text> [--reason <text>] [--out <path>]

npx tsx ground-core/cli.ts reconcile-propose <project_id> --op complete-action \
  --action-id <id> [--out <path>]

npx tsx ground-core/cli.ts reconcile-propose <project_id> --op set-primary \
  --action-id <id> [--out <path>]

npx tsx ground-core/cli.ts reconcile-propose <project_id> --op set-primary \
  --new-action-title <title> [--new-action-description <text>] [--out <path>]

npx tsx ground-core/cli.ts reconcile-propose <project_id> --op update-current-state \
  --summary <text> --phase <text> [--out <path>]

# apply は既存 applyPatch / saveProject（reality-apply 互換）
npx tsx ground-core/cli.ts reconcile-apply <project_id> --proposal <path>
npx tsx ground-core/cli.ts reality-apply <project_id> --proposal <path>
```

## Safety

- propose だけでは storage 不変
- 明示 ID / 明示新規内容が必須
- Director ranking を mutation decision に使わない
- 二重操作（既に resolved / done）は Clarification
- 存在しない ID は ValidationError
- `build-complete-action-patch`（自動 next-primary）は残すが、reconciliation 経路では使わない

## 既存 `build-complete-action-patch` との関係

旧 helper は「done + 自動 next primary」を結合したまま残す（後方互換）。
v0.6.2 reconciliation は **complete と set-primary を分離**した安全経路。
