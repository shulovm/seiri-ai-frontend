# GROUND Studio v0.5.1 — Studio Brief Design

> **地位**: `StudioReport` を **人間が 30 秒以内に理解できる Brief** へ変換する **プレゼンテーション契約**。  
> **v0.5.1 の位置づけ**: **設計のみ**。実装・LLM API・Web UI・自動保存は **行わない**。

前段: [GROUND_STUDIO_V0.5_CONSTITUTION.md](./GROUND_STUDIO_V0.5_CONSTITUTION.md)  
Core 到達: [GROUND_CORE_V0.4_MULTI_PROJECT_DIRECTOR.md](./GROUND_CORE_V0.4_MULTI_PROJECT_DIRECTOR.md)

---

## 0. 背景 — なぜ StudioBrief か

### 0.1 現在の層

```
ProjectState
      ↓
DirectorReport          （各 project の次 action）
      ↓
PortfolioReport         （今日の一手 — 順位付け）
      ↓
StudioReport（v0.5）    （横断状況 — 構造化提案）
      ↓
StudioBrief（v0.5.1）   （人間可読 — 30 秒理解）
      ↓
人間が読んで判断
```

### 0.2 StudioBrief の目的

**StudioBrief は UI ではない。**  
Web 画面でも Push 通知でもない。CLI stdout / JSON / 将来 UI が **同じ契約** を消費する。

StudioBrief の唯一の目的:

> 人間が **「今どこにいるのか」** を **30 秒以内** で理解できること。

### 0.3 StudioBrief が答える 8 問

| # | 質問 | Brief セクション |
|---|------|-----------------|
| 1 | 今日一番重要なことは何か？ | `primary_focus` / TODAY |
| 2 | なぜそれが重要か？ | `primary_focus.reason_summary` + `why_not_summary` |
| 3 | 今やらなくていいことは何か？ | `deferred_items` / DEFERRED |
| 4 | どこが詰まっているか？ | `blocked_items` / BLOCKED |
| 5 | 何が伸びているか？ | `growth_items` / GROWING |
| 6 | 判断待ちは何か？ | `decision_briefs` / DECISIONS |
| 7 | 今日の推奨フローは何か？ | `recommended_flow` / FLOW |
| 8 | 何に注意するべきか？ | `risk_briefs` / RISKS |

---

## 1. StudioBrief Definition

### 1.1 定義

**StudioBrief** とは、`StudioReport`（およびその入力である `PortfolioReport`）の **構造情報** を、ルールベースで **人間向け要約** に変換した **読み取り専用ドキュメント** である。

| 性質 | 説明 |
|------|------|
| **変換契約** | StudioReport → Human Readable Brief |
| **非 UI** | レンダリング形式（text / json）は Interface 層の責務 |
| **非 Agent** | 実行・保存・通知をしない |
| **非 LLM** | v0.5.1 はテンプレート + ルールのみ |
| **時間boxed** | 30 秒読了を設計目標（Morning Brief 基準） |

### 1.2 StudioBriefRenderer interface（設計）

```typescript
interface StudioBriefInput {
  studio_report: StudioReport;
  portfolio_report: PortfolioReport;
  brief_type: StudioBriefType;
  options?: StudioBriefOptions;
}

type StudioBriefType = "morning" | "session" | "deep-work" | "default";

interface StudioBriefRenderer {
  readonly name: string; // "rule-brief-renderer-v1"
  render(input: StudioBriefInput): StudioBrief;
}
```

**v0.5.1 設計**: interface のみ。実装は v0.5.1 実装フェーズ。

---

## 2. StudioReport と StudioBrief の違い

| 次元 | StudioReport | StudioBrief |
|------|--------------|-------------|
| **読者** | 機械 / 下位レイヤ / テスト | **人間** |
| **粒度** | 全フィールド・reasons 配列・confidence_factors | **要約・見出し・1 行理由** |
| **長さ** | 長い（監査・trace 向け） | **短い**（30 秒〜数分） |
| **構造** | 正規化（situation / flow / risk 分離） | **セクション**（TODAY / BLOCKED / …） |
| **Portfolio** | alignment_notes（構造） | headline + primary_focus（自然文） |
| **時間軸** | today + week 混在 | **brief_type** で絞り込み |
| **保存** | `--out` 任意 | `--out` 任意。**state には入れない** |

```
StudioReport = 監督の「完整な判断材料」
StudioBrief   = 監督が人間に口頭で伝える「朝の申し送り」
```

---

## 3. StudioBrief 型

### 3.1 ルート型

```typescript
interface StudioBrief {
  schema_version: "0.5.1";
  brief_type: StudioBriefType;
  engine: string; // "rule-brief-renderer-v1"
  generated_at: string; // ISO 8601

  /** 1 行 — 30 秒理解の入口 */
  headline: string;

  /** TODAY — 今日 1 件のみ */
  primary_focus: FocusItem;

  /** TODAY — 最大 3 件 */
  secondary_focuses: FocusItem[];

  /** BLOCKED — severity 降順 */
  blocked_items: BlockedItem[];

  /** GROWING — momentum 降順 */
  growth_items: GrowthItem[];

  /** DECISIONS — active decision のみ */
  decision_briefs: DecisionBrief[];

  /** RISKS — severity / urgency 順 */
  risk_briefs: RiskBrief[];

  /** FLOW — 時間順ステップ */
  recommended_flow: FlowStep[];

  /** DEFERRED — 理由必須 */
  deferred_items: DeferredItem[];

  /** Portfolio との関係 — 上書きしていないことの明示 */
  portfolio_note: PortfolioNote;

  /** なぜ primary が 2 位でないか — primary に必須 */
  why_not_summary: WhyNotSummary[];

  /** CLI text 用フル要約 */
  summary_text: string;

  requires_human_decision: true;
}
```

### 3.2 構成型

```typescript
interface FocusItem {
  project_id: string;
  project_title: string;
  action_id: string;
  action_title: string;
  reason_summary: string;       // 1–2 文。空禁止
  confidence: number;           // 0.0–1.0。Portfolio / Studio 由来
  source: "portfolio_primary" | "portfolio_alternative" | "studio_session" | "studio_deep_work";
}

interface BlockedItem {
  project_id: string;
  project_title: string;
  status: "blocked" | "stalled" | "paused";
  blocker_title: string | null;
  action_title: string | null;
  severity: "low" | "medium" | "high" | "critical" | null;
  reason_summary: string;
}

interface GrowthItem {
  project_id: string;
  project_title: string;
  momentum_score: number;
  signal_summary: string;       // 伸び理由 1 文
}

interface DecisionBrief {
  project_id: string;
  project_title: string;
  decision_id: string;
  decision_title: string;
  rationale_summary: string;    // 最大 120 字
  pending_question: string;     // 人間が答えるべき問い
}

interface RiskBrief {
  kind: RiskBriefKind;
  severity: "low" | "medium" | "high";
  message: string;
  entity_type?: "project" | "blocker" | "hypothesis" | "decision";
  entity_id?: string;
  mitigation_hint: string;      // 「注意」— 命令ではない
}

type RiskBriefKind =
  | "observation_gap"
  | "untested_hypothesis"
  | "blocker_pressure"
  | "resource_overload"
  | "decision_pending"
  | "scope_creep"
  | "portfolio_misalignment";

interface FlowStep {
  order: number;
  time_box: "morning" | "afternoon" | "session" | "now" | "later";
  project_id: string;
  project_title: string;
  action_id: string | null;
  action_title: string;
  intent: "deep_work" | "light_touch" | "defer" | "observe";
  reason_summary: string;
}

interface DeferredItem {
  project_id: string;
  project_title: string;
  action_id: string;
  action_title: string;
  defer_reason: string;         // 必須。空禁止
}

interface PortfolioNote {
  primary_project_id: string;
  primary_action_id: string;
  alignment: "identical" | "complemented" | "time_split";
  note: string;                 // 「Portfolio primary を変更していない」等
}

interface WhyNotSummary {
  compared_project_id: string;
  compared_action_title: string;
  summary: string;              // 1 文
}
```

---

## 4. Brief Section 一覧

### 4.1 セクション定義

| セクション ID | 表示名 | ソース（StudioReport） | Brief フィールド |
|--------------|--------|-------------------------|-----------------|
| **TODAY** | 今日 | `today_focus` + Portfolio primary | `headline`, `primary_focus`, `secondary_focuses` |
| **BLOCKED** | 詰まり | `at_risk_projects` + blocked + bottlenecks | `blocked_items` |
| **GROWING** | 伸び | `growing_projects` | `growth_items` |
| **DECISIONS** | 判断待ち | `decision_brief.active_decisions[]` | `decision_briefs` |
| **RISKS** | 注意 | `risk_warnings[]` | `risk_briefs` |
| **FLOW** | 推奨フロー | `flow_proposal.steps[]` | `recommended_flow` |
| **DEFERRED** | 後回し | `explicit_deferrals[]` | `deferred_items` |

### 4.2 brief_type 別セクション可視性

| セクション | default | morning | session | deep-work |
|-----------|---------|---------|---------|-----------|
| TODAY | ✅ | ✅ 必須 | ✅ 簡略 | ✅ primary のみ |
| BLOCKED | ✅ | ✅ 上位 3 | △ 1 件 | ❌ |
| GROWING | ✅ | ✅ 上位 2 | ❌ | ❌ |
| DECISIONS | ✅ | ✅ 上位 3 | △ 関連のみ | ❌ |
| RISKS | ✅ | ✅ 上位 3 | ✅ 上位 2 | ✅ 1 件 |
| FLOW | ✅ | ✅ 全日 | ✅ 2h | ✅ 1 テーマ |
| DEFERRED | ✅ | ✅ | ✅ | ✅ 強調 |

△ = 条件付き（primary project に関連するもののみ）

### 4.3 summary_text セクション順（text CLI）

```
=== GROUND Studio Brief ===
{headline}

--- TODAY ---
Primary: ...
Why: ...
Why not: ...

--- BLOCKED ---   （該当時）
--- GROWING ---   （該当時）
--- DECISIONS ---
--- RISKS ---
--- FLOW ---
--- DEFERRED ---

portfolio_note: ...
requires_human_decision: true
```

---

## 5. Brief Priority Rule

### 5.1 全局ルール

| ルール | 内容 |
|--------|------|
| **Today primary** | **1 件のみ**。Portfolio `primary_recommendation` と同一 `(project_id, action_id)` |
| **Secondary** | 最大 **3 件**。Portfolio alternatives 優先、不足時 Studio priority_stack |
| **Blocked** | `severity` 降順 → `cross_project_score` 昇順（低いほど危険） |
| **Growing** | `momentum_score` 降順、最大 **3 件**（morning）/ **1 件**（session） |
| **Decisions** | `status === active` のみ。最大 **5 件**、project 横断 |
| **Risks** | `severity` high → medium → low。最大 **5 件**（morning）/ **2 件**（session） |
| **Deferred** | Portfolio deferred + Studio explicit_deferrals。**理由必須** |
| **Flow** | 時間順。deep-work は **1 ステップ** |

### 5.2 primary_focus 決定（上書き禁止）

```
primary_focus = PortfolioReport.primary_recommendation
  mapped to FocusItem
  source = "portfolio_primary"
```

Studio が primary を変更する **brief_type は存在しない**。  
`session` / `deep-work` は **フローと時間箱** を変えるだけ。primary の `(project_id, action_id)` は Portfolio と一致。

### 5.3 secondary_focuses 決定

```
1. PortfolioReport.alternative_recommendations[]（順序維持）
2. 不足分: StudioReport.priority_stack の 2 位以降
3. slice(0, 3)
4. primary と重複除外
```

### 5.4 headline 生成ルール

テンプレート（ルールベース）:

```
今日の焦点: {project_title} — {action_title}
```

`deep-work`:

```
今集中: {action_title}（{project_title}）
```

`session`:

```
次の 2 時間: {primary action_title} を優先
```

---

## 6. Brief Explainability Rule

### 6.1 必須

| 要件 | 適用 |
|------|------|
| **reason_summary 非空** | すべての FocusItem / BlockedItem / FlowStep / DeferredItem |
| **why_not_summary** | primary に対し ≥ 1 件（secondary の代表と比較） |
| **confidence 表示** | primary_focus + secondary（0.0–1.0） |
| **defer_reason 非空** | すべての deferred_items |
| **mitigation_hint** | すべての risk_briefs（命令形禁止。「〜に注意」） |
| **portfolio_note** | Portfolio primary との関係を 1 文で明示 |

### 6.2 禁止

| 禁止 | 代替 |
|------|------|
| 「なんとなく今日は A」 | reason_summary に urgency / blocker / portfolio score 引用 |
| 「AI おすすめ」 | source + engine 名 |
| 理由なし defer | defer_reason 必須 |
| primary 上書き | portfolio_note.alignment = identical |

### 6.3 reason_summary テンプレート（ルール）

| ソース kind | テンプレート |
|------------|-------------|
| portfolio_primary | `Portfolio 1 位: {reasons[0].message 要約}` |
| field_validation | `現場検証チェーン先頭 — high blocker 解消で downstream 解放` |
| meta_work_defer | `メタ改善系 — 実行系 project を先に` |
| observation_gap | `観測不足 — 判断材料が足りない` |
| flow_sequencing | `{time_box}: 注意力分散を避けるため順序提案` |

---

## 7. Brief Safety Rule

### 7.1 継承（Studio 憲法 + Core 憲法）

StudioBrief は **StudioReport の下流** である。Safety 義務は **増やすのみ、減らさない**。

| 禁止 | Brief 層での保証 |
|------|-----------------|
| saveProject | Renderer は file-store を import しない |
| applyPatch | patch 型を出力しない |
| status 変更 | Brief に operation / patch 提案を含めない |
| Push 通知 | CLI stdout / `--out` のみ |
| 自動適用 | `requires_human_decision: true` 固定 |
| LLM | rule-brief-renderer-v1 のみ |

### 7.2 人間へのトーン

| OK | NG |
|----|-----|
| 「今日の提案: …」 | 「今すぐやれ」 |
| 「後回し提案: …」 | 「禁止」 |
| 「注意: 観測不足」 | 「自動で observation を追加した」 |

### 7.3 --out 行为

`--out brief.json` は **人間が明示指定した場合のみ**。  
ProjectState / storage への自動書込 **禁止**。

---

## 8. CLI 出力案

### 8.1 コマンド

```bash
# default = morning 相当
npm run ground-core -- studio-brief

npm run ground-core -- studio-brief --type morning
npm run ground-core -- studio-brief --type session
npm run ground-core -- studio-brief --type deep-work

npm run ground-core -- studio-brief --format text|json
npm run ground-core -- studio-brief --out studio-brief.json
npm run ground-core -- studio-brief --projects <id>[,id...]
```

### 8.2 内部パイプライン（read-only）

```
1. loadProject × N
2. ruleDirector.recommend × N
3. rulePortfolioDirector.recommendPortfolio
4. ruleStudio.brief → StudioReport          （v0.5 実装後）
5. ruleBriefRenderer.render → StudioBrief   （v0.5.1 実装後）
6. stdout summary_text / --out JSON
7. saveProject / applyPatch を呼ばない
```

### 8.3 exit code

| code | 意味 |
|------|------|
| 0 | Brief 生成成功 |
| 1 | 警告付き（eligible project 0 等） |
| 2 | validation / 入力不整合 |

---

## 9. Morning Brief 仕様

### 9.1 目的

**朝 30 秒**で「今日どこにいるか」を把握する。

### 9.2 設計制約

| 項目 | 値 |
|------|-----|
| 読了目標 | ≤ 30 秒（~150–200 日本語字） |
| primary | 1 件 |
| secondary | ≤ 3 件 |
| blocked | ≤ 3 件 |
| growing | ≤ 2 件 |
| decisions | ≤ 3 件 |
| risks | ≤ 3 件 |
| flow | 全日（morning + afternoon + later） |
| deferred | すべて（通常 ≤ 4 件） |

### 9.3 headline 例（構造）

```
今日の焦点: {現場検証型 project} — {先頭 action}
```

---

## 10. Session Brief 仕様

### 10.1 目的

**今から 2 時間**、何に手を付けるか。

### 10.2 設計制約

| 項目 | 値 |
|------|-----|
| 読了目標 | ≤ 60 秒 |
| primary | Portfolio primary（変更なし） |
| secondary | ≤ 1 件（Portfolio 2 位のみ） |
| flow | **1–2 ステップ**、`time_box = session` |
| risks | ≤ 2 件（primary project 関連優先） |
| blocked / growing | 省略または 1 行サマリー |
| deferred | primary 以外を「2h 内触らない」 |

### 10.3 flow 意図

```
Step 1: deep_work — primary action（90–120 min）
Step 2（optional）: light_touch — observation / 短い確認（C 型など）
```

---

## 11. Deep Work Brief 仕様

### 11.1 目的

**今集中する 1 テーマ** のみ。通知・一覧・雑多情報を排除。

### 11.2 設計制約

| 項目 | 値 |
|------|-----|
| 読了目標 | ≤ 15 秒 |
| primary | Portfolio primary |
| secondary | **空** |
| flow | **1 ステップ**、`intent = deep_work` |
| risks | **1 件**（primary 関連で最も severe） |
| blocked / growing / decisions | **省略** |
| deferred | headline 下 1 行「他 project は defer」 |

### 11.3 headline 例（構造）

```
今集中: {action_title}（{project_title}）
```

---

## 12. Portfolio との関係

### 12.1 責務分界

| レイヤ | 役割 | 比喩 |
|--------|------|------|
| **Portfolio Director** | **順位付け** — 今日の一手 | 配役表 |
| **StudioReport** | **構造化提案** — フロー・リスク・材料 | 監督メモ |
| **StudioBrief** | **説明** — 人間可読 | 申し送り |

### 12.2 上書き禁止

```typescript
// 不変条件（Brief 生成後検証）
brief.primary_focus.project_id === portfolio.primary_recommendation.project_id
brief.primary_focus.action_id === portfolio.primary_recommendation.next_action_id
```

違反時: **Brief 生成失敗**（throw / exit 2）。黙って上書きしない。

### 12.3 portfolio_note 必須内容

| alignment | note 例 |
|-----------|---------|
| `identical` | Portfolio 1 位と同一。Brief は説明のみ追加。 |
| `complemented` | Portfolio 1 位維持。フローで時間分割を提案。 |
| `time_split` | 午前 primary / 午後 alternative を提案。順位は変更なし。 |

---

## 13. StudioReport → StudioBrief 変換方針

### 13.1 変換パイプライン

```
StudioReport + PortfolioReport + brief_type
        ↓
  [1] mapPrimaryFocus()      ← Portfolio primary（上書き禁止）
        ↓
  [2] mapSecondaryFocuses() ← Portfolio alt + priority_stack
        ↓
  [3] mapBlockedItems()      ← at_risk + blocked + bottlenecks
        ↓
  [4] mapGrowthItems()       ← growing_projects
        ↓
  [5] mapDecisionBriefs()    ← decision_brief.active_decisions
        ↓
  [6] mapRiskBriefs()        ← risk_warnings（brief_type で slice）
        ↓
  [7] mapFlowSteps()         ← flow_proposal（brief_type で filter）
        ↓
  [8] mapDeferredItems()     ← explicit_deferrals + portfolio deferred
        ↓
  [9] buildWhyNotSummary()   ← portfolio why_not + studio alignment
        ↓
  [10] buildHeadline()       ← brief_type テンプレート
        ↓
  [11] assembleSummaryText() ← セクション順レンダリング
        ↓
  StudioBrief
```

### 13.2 フィールドマッピング表

| StudioReport | StudioBrief |
|--------------|-------------|
| `today_focus.primary` | `primary_focus`（Portfolio 経由で同一） |
| `priority_stack.alternatives[]` | `secondary_focuses[]` |
| `at_risk_projects[]` + `cross_project_bottlenecks[]` | `blocked_items[]` |
| `growing_projects[]` | `growth_items[]` |
| `decision_brief.decisions[]` | `decision_briefs[]` |
| `risk_warnings[]` | `risk_briefs[]` |
| `flow_proposal.steps[]` | `recommended_flow[]` |
| `explicit_deferrals[]` | `deferred_items[]` |
| `portfolio_alignment` | `portfolio_note` + `why_not_summary` |

### 13.3 要約ルール（LLM 不使用）

| 入力 | 要約方法 |
|------|---------|
| `StudioReason.message` | 先頭 80 字 + entity title 保持 |
| `Decision.rationale` | 先頭 120 字 |
| 複数 reasons | weight 最大 2 件を `; ` 連結 |
| 空配列 | セクション省略（summary_text に「（なし）」） |

### 13.4 brief_type 変換差分

| 変換 | morning | session | deep-work |
|------|---------|---------|-----------|
| `mapFlowSteps` | 全 steps | session 箱のみ | 1 step |
| `mapRiskBriefs` | top 3 | top 2, primary 関連 | top 1 |
| `mapSecondaryFocuses` | max 3 | max 1 | [] |
| `assembleSummaryText` | 全セクション | 短縮 | 最小 |

---

## 14. v0.5.1 完了定義

### 14.1 設計完了（今回）

1. 本ドキュメントが StudioBrief 変換契約として成立  
2. StudioBrief 型 + 構成型が定義  
3. 7 セクション + 3 brief_type の可視性が定義  
4. Priority / Explainability / Safety ルールが Studio 憲法と整合  
5. Portfolio 上書き禁止が型・検証で明示  
6. StudioReport → Brief マッピングが完全  
7. Morning / Session / Deep Work 仕様 + 4 型 project 例  

### 14.2 実装完了（将来 v0.5.1 実装フェーズ）

1. `rule-brief-renderer-v1` が `StudioBrief` を返す  
2. `studio-brief` CLI（3 type + default）が read-only 動作  
3. primary が Portfolio と常に一致（不変条件テスト）  
4. すべての deferred に defer_reason  
5. primary に why_not_summary ≥ 1  
6. saveProject / applyPatch 未使用  
7. テスト ≥ 12 件 + manual run doc  

---

## 15. 実例 — 4 Project 構成（構造ラベルのみ）

> **A: 現場検証型 / B: 創作制作型 / C: 問題解決型 / D: メタインフラ型**  
> 固有名詞・実 project 名は **使用しない**。実装も hardcode しない。

### 15.1 共通前提（構造）

| ラベル | 構造 | Portfolio 順位（例） |
|--------|------|---------------------|
| A | field_validation, high blocker, 先頭 action | **1 位** |
| B | production chain, ready | **2 位** |
| C | observation_gap, untested hypothesis | 4 位（defer 寄り） |
| D | meta infra, ready, execution より低 | **3 位** |

Portfolio primary = **A の先頭 action**（不変）

---

### 15.2 Morning Brief 実例

```
=== GROUND Studio Brief（morning）===

headline:
  今日の焦点: 現場検証型 project — 入口条件を1つ決める

--- TODAY ---
Primary:
  現場検証型 — 入口条件を1つ決める
  reason: Portfolio 1 位。high blocker 解消で downstream 2 件解放。
  confidence: 0.73

Secondary:
  1. 創作制作型 — チェーン先頭ルールを整理（0.65）
  2. メタインフラ型 — v0.5 範囲を定義（0.58）

Why not #2（創作制作型）:
  横断スコア差 0.10。現場検証チェーン先頭を今日優先。

--- BLOCKED ---
  • 問題解決型（stalled）— 30 日 observation なし

--- GROWING ---
  • 現場検証型 — primary 確定 + high blocker 紐づき
  • 創作制作型 — confidence 0.7+ / チェーン先頭

--- DECISIONS ---
  • メタインフラ型: 自動適用禁止を維持 — 今日の判断: なし（遵守のみ）
  • メタインフラ型: 本体接続方針未確定 — 今日決める必要は低

--- RISKS ---
  [high] 問題解決型: 観測不足 — 判断先送りに注意
  [medium] 4 project 同日 deep — 並行上限 2 を超えない
  [medium] メタインフラ型: 早期 Web 接続は decision 未確定

--- FLOW ---
  1. morning / deep_work — 現場検証型 — 入口条件を1つ決める
  2. afternoon / deep_work — 創作制作型 — チェーン先頭（余力時）
  3. later / light_touch — 問題解決型 — 短い observation メモのみ
  4. later / defer — メタインフラ型 — 設計 doc 読了程度

--- DEFERRED ---
  • 創作制作型 — 午前は現場検証優先（flow_sequencing）
  • 問題解決型 — 観測不足のまま deep に入らない
  • メタインフラ型 — 実行系より後（defer_explicit）

portfolio_note:
  Portfolio 1 位と同一。Brief は時間分割のみ補完。

requires_human_decision: true
```

---

### 15.3 Session Brief 実例（2 時間）

```
=== GROUND Studio Brief（session）===

headline:
  次の 2 時間: 入口条件を1つ決める を優先

--- TODAY ---
Primary:
  現場検証型 — 入口条件を1つ決める
  reason: Portfolio 1 位。この session の deep work テーマ。
  confidence: 0.73

Secondary:
  創作制作型 — チェーン先頭（session 内触らない — 参考のみ）

--- RISKS ---
  [medium] 注意力分散 — 2h 内は primary 以外の deep work 非推奨

--- FLOW ---
  1. session / deep_work — 現場検証型 — 入口条件を1つ決める（90–120 min）

--- DEFERRED ---
  • 創作制作型 — この session では触らない
  • 問題解決型 — 観測追加は 15 分以下なら可、deep work 不可
  • メタインフラ型 — 触らない

portfolio_note:
  Portfolio 1 位維持。Session は時間箱のみ狭める。

requires_human_decision: true
```

---

### 15.4 Deep Work Brief 実例（1 テーマ）

```
=== GROUND Studio Brief（deep-work）===

headline:
  今集中: 入口条件を1つ決める（現場検証型 project）

--- TODAY ---
Primary:
  現場検証型 — 入口条件を1つ決める
  reason: Portfolio 1 位。チェーン先頭。他 project は defer。
  confidence: 0.73

--- RISKS ---
  [medium] 他 project への切替 — この block では primary のみ

--- FLOW ---
  1. now / deep_work — 現場検証型 — 入口条件を1つ決める

--- DEFERRED ---
  創作制作型・問題解決型・メタインフラ型 — この deep work block では後回し

portfolio_note:
  Portfolio 1 位と同一。Deep Work Brief は説明最小化。

requires_human_decision: true
```

---

## 16. 関連ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [GROUND_STUDIO_V0.5_CONSTITUTION.md](./GROUND_STUDIO_V0.5_CONSTITUTION.md) | Studio 憲法・StudioReport |
| [GROUND_CORE_V0.4_MULTI_PROJECT_DIRECTOR.md](./GROUND_CORE_V0.4_MULTI_PROJECT_DIRECTOR.md) | Portfolio Director |
| [GROUND_CORE_V0.4_SELF_STATE_UPDATE.md](./GROUND_CORE_V0.4_SELF_STATE_UPDATE.md) | GROUND Core v0.4 state |

---

## 17. 要約 — Brief 憲法 3 条

1. **StudioBrief は変換契約** — UI でも Agent でもない。StudioReport を人間語にする。  
2. **Portfolio を上書きしない** — primary は常に Portfolio 1 位。Brief は説明と時間箱。  
3. **30 秒理解** — 理由・why_not・defer 理由必須。「なんとなく」禁止。人間が決める。

---

*v0.5.1 Studio Brief Design — 設計のみ。実装は次フェーズ。*

→ **v0.5.2 Renderer 実装**: [GROUND_STUDIO_V0.5.2_BRIEF_RENDERER.md](./GROUND_STUDIO_V0.5.2_BRIEF_RENDERER.md)
