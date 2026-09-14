# Experiment Seed Samples

`ExperimentSeed` → `ProjectState` 変換のサンプル集です。

## ファイル一覧

| ファイル | kind | 目的 |
|----------|------|------|
| [sample.json](./sample.json) | `content` | 仮説型コンテンツ（60秒動画）制作実験 |
| [business-sample.json](./business-sample.json) | `business` | 無料配布型プロモーションの小規模事業検証 |
| [research-sample.json](./research-sample.json) | `research` | 脳とAI接続領域の研究テーマ整理 |
| [product-sample.json](./product-sample.json) | `product` | 思考整理ツールの最小利用体験検証 |

## intake

```bash
# content（既存 sample）
npm run ground-core -- intake --file ground-core/examples/experiment-seeds/sample.json

# business
npm run ground-core -- intake --file ground-core/examples/experiment-seeds/business-sample.json

# research
npm run ground-core -- intake --file ground-core/examples/experiment-seeds/research-sample.json

# product
npm run ground-core -- intake --file ground-core/examples/experiment-seeds/product-sample.json
```

## studio-brief 確認

```bash
npm run ground-core -- show <project_id>
npm run ground-core -- studio-brief --projects <project_id>
```

TODAY に最初の `initial_next_actions` が出ることを確認する。

## 変換ルール（v0.1.1）

| Seed フィールド | ProjectState |
|-----------------|--------------|
| `risks` | `extensions.intake.risks`（blocker にしない） |
| `assumptions` | `extensions.intake.assumptions`（hypothesis にしない） |
| `initial_hypotheses` | `hypotheses[]` |
| `initial_blockers` | `blockers[]` |

## 関連

- Session 運用例: [../sessions/README.md](../sessions/README.md)
- Patch template: [../patch-templates/README.md](../patch-templates/README.md)
