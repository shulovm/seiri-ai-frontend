# GROUND Studio v0.5.5 — Studio Brief CLI

## 目的

Studio Engine + Narrative Layer + Brief Renderer を接続し、人間が利用できる `studio-brief` CLI を提供する。

## パイプライン

```
ProjectState[]
    ↓ Director
    ↓ Portfolio Director
    ↓ Studio Engine (v0.5.3)
    ↓ Narrative Layer (v0.5.4)
    ↓ Brief Adapter (v0.5.5)
    ↓ Brief Renderer (v0.5.2)
    ↓ studio-brief CLI
```

## CLI 仕様

```bash
npm run ground-core -- studio-brief
npm run ground-core -- studio-brief --type morning
npm run ground-core -- studio-brief --type session
npm run ground-core -- studio-brief --type deep-work
npm run ground-core -- studio-brief --format json
npm run ground-core -- studio-brief --out brief.json
npm run ground-core -- studio-brief --projects <id>[,id...]
```

| オプション | デフォルト | 説明 |
|-----------|-----------|------|
| `--type` | `morning` | `morning` / `session` / `deep-work` |
| `--format` | `text` | `text` / `json` |
| `--out` | なし | JSON をファイル保存 |
| `--projects` | storage 全件 | 対象 project 限定 |

## テキスト出力構成

```
Morning Brief

{headline — Narrative headline}

TODAY
BLOCKED
GROWING
DECISIONS
RISKS
FLOW
DEFERRED

{summary_text — Narrative summary_story}
```

## Brief Adapter

`StudioReport (v0.5.3)` + `StudioNarrative` + `PortfolioReport` → `BriefRendererStudioReport (v0.5.0)`

| 責務 | 内容 |
|------|------|
| 順位保持 | `recommended_flow` の project 順序を変更しない |
| Narrative 優先 | reason_messages に Narrative story を補足 |
| Renderer 契約 | primary / alignment / why_not / defer reason を満たす |

表示時は Narrative の `headline` / `summary_story` を Brief 出力に適用（Renderer 本体は変更しない）。

## Safety

| 禁止 | 状態 |
|------|------|
| saveProject | CLI read-only |
| applyPatch / StatePatch | 未使用 |
| LLM | 未使用 |
| ProjectState 変更 | 読み取りのみ |
| 自動保存・自動適用 | なし |

## ファイル構成

```
ground-core/studio/brief-adapter.ts
ground-core/studio/studio-brief.ts
ground-core/cli.ts                    — studio-brief コマンド
ground-core/__tests__/studio-brief-cli.test.ts
```

## プログラム API

```typescript
import {
  runStudioBriefPipeline,
  formatStudioBriefText,
  formatStudioBriefJson,
  adaptToBriefRendererReport,
} from "ground-core";

const result = runStudioBriefPipeline({ project_states, brief_type: "morning" });
const text = formatStudioBriefText(result.brief, result.narrative, "morning");
```

## テスト

```bash
npm run test:ground-core
```

## 変更していないもの

- Studio Engine (v0.5.3)
- Narrative Layer (v0.5.4)
- Brief Renderer (v0.5.2)
- Director / Portfolio Director

## 次のステップ

1. **Web UI / Router 連携** — 今回スコープ外
2. **Narrative → Brief 深い統合** — Renderer 側 headline 生成の見直し（任意）
3. **定期実行 / 通知** — CLI ラッパー（Push 禁止方針の範囲内で検討）
