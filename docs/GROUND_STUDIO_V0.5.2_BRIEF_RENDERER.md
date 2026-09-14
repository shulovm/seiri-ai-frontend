# GROUND Studio v0.5.2 — Brief Renderer

> **地位**: `StudioReport` → `StudioBrief` の **純粋関数** 変換。推論・保存・patch なし。  
> **v0.5.2**: Renderer 初回実装。Studio Engine / CLI `studio-brief` は **未実装**。

設計: [GROUND_STUDIO_V0.5.1_BRIEF_DESIGN.md](./GROUND_STUDIO_V0.5.1_BRIEF_DESIGN.md)  
憲法: [GROUND_STUDIO_V0.5_CONSTITUTION.md](./GROUND_STUDIO_V0.5_CONSTITUTION.md)

---

## v0.5.2 の思想

| 原則 | 内容 |
|------|------|
| **Renderer は推論しない** | StudioReport の構造を要約するだけ |
| **Renderer は説明する** | 人間が 30 秒で理解できる Brief |
| **Portfolio 上書き禁止** | `primary_focus === portfolio_primary` |
| **副作用なし** | save / patch / LLM なし |

```
StudioReport（fixture / 将来 rule-studio-v1）
        ↓
ruleBriefRenderer.render({ report, brief_type })
        ↓
StudioBrief
```

---

## ファイル構成

```
ground-core/studio/
├── brief-types.ts       # StudioReport（入力）+ StudioBrief（出力）型
├── brief-formatters.ts  # マッピング・要約・summary_text
└── brief-renderer.ts    # rule-brief-renderer-v1
```

---

## BriefRenderer

```typescript
interface BriefRenderer {
  readonly name: string; // "rule-brief-renderer-v1"
  render(input: {
    report: StudioReport;
    brief_type: "morning" | "session" | "deep-work";
  }): StudioBrief;
}
```

実装: `ruleBriefRenderer` / `renderStudioBrief()`

---

## StudioBrief 型

| フィールド | 説明 |
|-----------|------|
| `headline` | 1 行入口 |
| `primary_focus` | 今日 1 件（Portfolio primary） |
| `secondary_focuses[]` | 副焦点 |
| `blocked_items[]` | 詰まり（severity 降順） |
| `growth_items[]` | 伸び |
| `decision_briefs[]` | active decision のみ |
| `risk_briefs[]` | 注意 |
| `recommended_flow[]` | 推奨フロー |
| `deferred_items[]` | 後回し（理由必須） |
| `portfolio_note` | Portfolio との関係 |
| `why_not_summary[]` | なぜ 2 位じゃないか |
| `summary_text` | CLI 用人間可読全文 |
| `requires_human_decision: true` | 固定 |

型エイリアス: `MorningBrief` / `SessionBrief` / `DeepWorkBrief`

---

## brief_type 別制限

| 項目 | morning | session | deep-work |
|------|---------|---------|-----------|
| secondary max | 3 | 1 | **0** |
| flow max | 全件 | 2 | **1** |
| blocked | ≤3 | 省略 | 省略 |
| growing | ≤2 | 省略 | 省略 |
| decisions | ≤3 | 省略 | 省略 |
| risks | ≤3 | ≤2 | **1** |

---

## 不変条件

1. `today_focus.primary` === `portfolio_primary`（入力検証）
2. `brief.primary_focus` === `portfolio_primary`（出力検証）
3. `why_not_summary.length >= 1`
4. すべての `defer_reason` 非空
5. すべての `reason_summary` 非空

違反時: `BriefRendererError`

---

## 使い方（ライブラリ）

```typescript
import { renderStudioBrief } from "ground-core";

const brief = renderStudioBrief({
  report: studioReportFixture,
  brief_type: "morning",
});

console.log(brief.summary_text);
```

**注意**: 現状 StudioReport は **fixture または将来 Studio Engine** から供給。Renderer 単体では ProjectState を読まない。

---

## テスト

```bash
npm run test:ground-core
```

`ground-core/__tests__/studio-brief-renderer.test.ts` — 16 ケース

- Morning / Session / Deep Work render
- primary 一致・件数制限・severity 順
- explainability / safety / 不変条件
- 固有名詞 grep ガード

ダミー fixture: `buildFixtureReport()`（4 project 構造、generic 名称）

---

## 今回やらないこと

| 項目 | 状態 |
|------|------|
| Studio Engine（rule-studio-v1） | 未実装 |
| CLI `studio-brief` | 未実装 |
| Portfolio 変更 | なし |
| LLM / Web UI / save / patch | 禁止 |

---

## v0.5.3 候補

1. **rule-studio-v1** — ProjectState + PortfolioReport → StudioReport
2. **CLI studio-brief** — end-to-end read-only
3. **PortfolioReport → StudioReport アダプタ**（Engine 前の段階的統合）

---

*v0.5.2 Brief Renderer — 初回実装完了。*
