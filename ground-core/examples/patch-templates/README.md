# GROUND Patch Templates

学習・参考用の patch テンプレートです。

## complete-action.template.json

action 完了セッション用の patch 構造例です。

### 注意

- この template は **そのまま適用するものではありません**
- `<PROJECT_ID>` 等のプレースホルダを、`show` 出力の UUID に差し替える必要があります
- **実運用では `build-complete-action-patch` の利用を推奨します**

### 推奨フロー

```bash
# 1. patch を生成（保存しない）
npm run ground-core -- build-complete-action-patch <project_id> \
  --action <action_id> \
  --decision-title "..." \
  --decision-rationale "..." \
  --observation-title "作業メモ" \
  --observation-body "..." \
  --summary "..." \
  --out patch.json

# 2. 生成 patch を確認

# 3. 既存 patch コマンドで適用
npm run ground-core -- patch <project_id> --file patch.json
```

### action 完了時に忘れがちな点

1. 対象 `next_action` を `done` にする
2. 必要なら `decision` / `observation` を追加する
3. **`current_state.primary_next_action_id` を次 eligible action へ更新する**
4. `current_state.summary` を更新する（推奨）

`primary_next_action_id` を更新しないと、`show` 上の State 表示と Brief の TODAY が食い違うことがあります。

### UUID の取得

```bash
npm run ground-core -- show <project_id>
```

- `current_state.id` → `<CURRENT_STATE_ID>`
- `next_actions[].id` → `<COMPLETED_ACTION_ID>` / `<NEXT_PRIMARY_ACTION_ID>`
- `goals[].id` → `<GOAL_ID>`
