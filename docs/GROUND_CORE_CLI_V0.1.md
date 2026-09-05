# GROUND Core CLI v0.1

個人用思考 OS **GROUND Core** を手で操作する最小 CLI です。  
会話ログではなく **Project State**（幹・枝）を JSON ファイルで管理します。

---

## 前提

- Node.js >= 20.19
- リポジトリルートで依存関係をインストール済み（`npm install`）
- 保存先: `ground-core/storage/projects/{project_id}.json`（gitignore 済み）

---

## 実行方法

```bash
npm run ground-core -- <command> [options]
```

---

## コマンド

### init — 新規 Project 作成

```bash
npm run ground-core -- init
npm run ground-core -- init --title "My Project"
```

- `--title` 省略時は `"Untitled Project"`
- 成功時、`project_id`（UUID）を 1 行出力

### list — 保存済み Project 一覧

```bash
npm run ground-core -- list
```

出力形式（タブ区切り）:

```
<project_id>	<status>	<updated_at>	<title>
```

Project が無い場合は `(no projects)` を表示。

### show — ProjectState を表示

```bash
npm run ground-core -- show <project_id>
```

- pretty JSON で stdout に出力

### patch — StatePatch を適用

```bash
npm run ground-core -- patch <project_id> --file ./patch.json
```

- patch JSON を読み込み、`loadProject` → `applyPatch` → `saveProject`
- 成功時:

```
project_id: <uuid>
updated_at: <iso8601>
```

---

## patch.json 例

```json
{
  "schema_version": "0.1.0",
  "project_id": "<project_id>",
  "source": "manual",
  "operations": [
    {
      "op": "upsert",
      "entity": "current_state",
      "entity_id": "<current_state_id>",
      "payload": {
        "summary": "CLI から current_state を更新"
      }
    }
  ]
}
```

`show` で `current_state.id` を確認してから patch してください。

---

## エラー

| 状況 | 表示 |
|------|------|
| Project 不存在 | `Project not found: ...` |
| patch schema 不正 | `Validation error: ...` |
| FK / 不変条件違反 | `Patch error: ...` |

失敗時は **exit code 1**。

---

## テスト

```bash
npm run test:ground-core
```

---

## 関連ドキュメント

- 設計: [GROUND_CORE_V0.1_DESIGN.md](./GROUND_CORE_V0.1_DESIGN.md)
- JSON Schema: [schemas/ground-core-project-state.v0.1.schema.json](./schemas/ground-core-project-state.v0.1.schema.json)
