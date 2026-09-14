# GROUND Studio v0.5 — Constitution & Scope Definition

> **地位**: GROUND Core（記録 OS）の **上位概念** として、制作現場全体を **読み取り専用** で監督する **思考 OS の監督層**。  
> **v0.5 の位置づけ**: **設計のみ**。実装・LLM API・Web UI・自動保存は **行わない**。

前段: [GROUND_CORE_V0.4_MULTI_PROJECT_DIRECTOR.md](./GROUND_CORE_V0.4_MULTI_PROJECT_DIRECTOR.md)  
Core 到達: [GROUND_CORE_V0.4_SELF_STATE_UPDATE.md](./GROUND_CORE_V0.4_SELF_STATE_UPDATE.md)

---

## 0. 前文 — なぜ Studio か

GROUND Core は v0.4 まで、以下を **CLI 上で end-to-end** 実現した:

```
自然文
  → SemanticEvent
  → Proposal
  → Human Review
  → Patch
  → ProjectState
  → Director
  → Portfolio Director
```

テスト: **131 pass / 0 fail**

Portfolio Director は「**今日、どの project のどの action を優先すべきか**」を説明付きで返す。  
しかし人間の制作現場が必要とする判断は、それだけでは足りない:

- 今週の焦点はどこか
- 同時並行の上限はいくつか
- どの project が **危険**（止まり・陳腐化・判断先送り）か
- どの project が **伸びている** か
- 制作 **フロー**（順序・時間配分・切り替えタイミング）の提案
- **リスク警告**（スコープ肥大、判断未確定、観測不足）
- **判断材料**の整理（decision / hypothesis / observation の横断要約）

**GROUND Studio** は、これらを **提案として** 返す層である。  
Studio は **AI Agent でも Auto Pilot でもない**。人間の判断力を **拡張** する。代わりには **ならない**。

---

## 1. GROUND Studio Definition

### 1.1 定義

**GROUND Studio** とは、複数 `ProjectState` と Core 監督層（Director / Portfolio Director）の出力を **読み取り専用** で統合し、制作現場全体について **状況理解・優先順位・フロー・リスク・判断材料** を **説明付きで提案** する、さく個人用思考 OS の **監督層（Supervision Layer）** である。

### 1.2 比喩

| 存在 | 比喩 | 一言 |
|------|------|------|
| **GROUND Core** | 記録 OS | 「何が起きているか」を state に保存する |
| **Director** | 各 project の現場監督 | 「この project の次の一手は何か」 |
| **Portfolio Director** | 全 project の配役監督 | 「今日、どの project に手を付けるか」 |
| **GROUND Studio** | 制作現場の総監督 | 「今週・今日・この順序で、何に集中し、何を避けるか」 |

### 1.3 Studio の性質

| 性質 | 説明 |
|------|------|
| **提案者** | 推薦・警告・整理を返す |
| **非実行者** | 保存・適用・完了・解決を **しない** |
| **非決定者** | 人間の代わりに決めない |
| **説明可能** | すべての提案に理由を付ける |
| **Core 上位** | Core の State Engine / Extraction を **置き換えない** |

### 1.4 Studio が **ない** もの

| 誤解 | 正しい位置づけ |
|------|----------------|
| AI Studio（自動制作） | ❌ 制作自動化ではない |
| AI Agent（自律実行） | ❌ ツール呼び出し・タスク実行をしない |
| Auto Pilot（自動運転） | ❌ 人間不在で state を進めない |
| Chat UI | ❌ 会話履歴管理ではない（Core 同様） |
| GROUND 本体（ground.ink） | ❌ 別概念。将来接続は v0.6+ |

---

## 2. GROUND Core と Studio の違い

| 次元 | GROUND Core | GROUND Studio |
|------|-------------|---------------|
| **主責務** | ProjectState の **保存・検証・patch 適用** | 横断状況の **読取・合成・提案** |
| **書き込み** | 人間承認後の patch 経由のみ | **書き込みなし**（read-only） |
| **入力** | 自然文 / StatePatch / CLI | ProjectState[] + DirectorReport[] + PortfolioReport |
| **出力** | ProjectState / PatchProposal / DirectorReport / PortfolioReport | **StudioReport**（提案バンドル） |
| **時間軸** | 点（state スナップショット） | 点 + 横断文脈（today / this-week / defer） |
| **スコープ** | 1 project の state 操作 + N project 推薦 | N project の **制作現場全体** |
| **LLM** | v0.4 まで rule-based（将来 optional） | v0.5 も rule-based 設計のみ |
| **決定権** | 常に人間 | 常に人間 |

```
┌─────────────────────────────────────────────────────────────┐
│  GROUND Studio（v0.5+）                                      │
│  読取専用 — 状況理解 / フロー提案 / リスク / 判断材料          │
└────────────────────────────┬────────────────────────────────┘
                             │ reads
┌────────────────────────────▼────────────────────────────────┐
│  GROUND Core — Portfolio Director（v0.4）                      │
│  今日の一手 — ProjectState[] + DirectorReport[]               │
└────────────────────────────┬────────────────────────────────┘
                             │ reads
┌────────────────────────────▼────────────────────────────────┐
│  GROUND Core — Director（v0.3）                              │
│  各 project の次 action — ProjectState                       │
└────────────────────────────┬────────────────────────────────┘
                             │ reads / writes (human path only)
┌────────────────────────────▼────────────────────────────────┐
│  GROUND Core — State Engine + Extraction + Review（v0.1–v0.2）│
│  記録 OS — patch 適用は人間承認 + patch CLI のみ              │
└─────────────────────────────────────────────────────────────┘
```

**原則**: Studio は Core の上に **乗る**。Core の下流（patch / save）に **直接触れない**。

---

## 3. Studio の責務

Studio が **行う** こと（すべて **提案**）:

| # | 責務 | 説明 | 出力イメージ |
|---|------|------|-------------|
| S1 | **Project 横断の状況理解** | 各 project の phase / health / momentum を統合した現場サマリー | `situation_overview` |
| S2 | **ボトルネック発見** | Portfolio bottleneck を超え、横断的に止めている要因の整理 | `cross_project_bottlenecks[]` |
| S3 | **優先順位提案** | Portfolio primary を包含し、today / this-week / defer を階層化 | `priority_stack` |
| S4 | **制作フロー提案** | 時間・順序・切り替えの **提案**（実行は人間） | `flow_proposal` |
| S5 | **リソース配分提案** | 同日並行 project 数、注意力の配分警告 | `resource_allocation` |
| S6 | **リスク警告** | 判断未確定、観測不足、スコープ肥大、停滞 | `risk_warnings[]` |
| S7 | **判断材料整理** | active Decision / untested Hypothesis / 直近 Observation の横断要約 | `decision_brief` |

Studio は **S1–S7 を StudioReport として返す**。  
いずれも `requires_human_decision: true` 固定。

---

## 4. Studio の禁止事項

### 4.1 絶対禁止（v0.5 以降も Core 経路を維持）

| 禁止 | 理由 |
|------|------|
| **saveProject** | 保存は patch CLI + 人間のみ |
| **applyPatch** | 適用は明示的 patch CLI のみ |
| **StatePatch 生成**（Studio 経路） | 変更提案は Extraction + Review 経路 |
| **ProjectState 変更** | Studio は read-only |
| **project.status 変更** | 完了 / 停止は人間 + patch |
| **action 完了（done）** | 現場実行の記録は人間 + patch / propose |
| **blocker 解決（resolved）** | 同上 |
| **primary_next_action_id 更新** | Extraction + Review または manual patch |
| **Human 意思決定代行** | Studio は提案のみ |
| **自動保存・自動適用** | 設計上禁止（Core 憲法継承） |
| **LLM API 呼び出し**（v0.5） | 構造固定優先 |
| **Router / Web UI / PostgreSQL**（v0.5） | スコープ外 |
| **AI Agent 的ツール実行** | Studio は監督。実行者ではない |

### 4.2 禁止の検証方法（実装フェーズ）

Studio 実装は **単体テスト + grep ガード** で以下を保証する:

- `saveProject` / `applyPatch` / `writeFileSync`（state 書込）を import しない
- Studio モジュールから patch / propose CLI を呼ばない
- 出力に `approved_patch` / `operations[]` を含めない

---

## 5. Studio Layer 構造

### 5.1 レイヤ一覧

```
┌──────────────────────────────────────────────────────────────┐
│  Interface Layer（v0.6+ 候補）                                 │
│  CLI studio-brief / 将来 Web 閲覧 UI                           │
└────────────────────────────┬─────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────┐
│  Studio Layer（v0.5 設計対象）                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │ Situation   │  │ Flow &       │  │ Risk & Decision     │ │
│  │ Synthesizer │  │ Resource     │  │ Brief               │ │
│  └─────────────┘  └──────────────┘  └─────────────────────┘ │
│  rule-studio-v1（v0.5 想定）— LLM なし                         │
└────────────────────────────┬─────────────────────────────────┘
                             │ reads only
┌────────────────────────────▼─────────────────────────────────┐
│  Core Supervision Layer                                       │
│  Portfolio Director（v0.4） / Director（v0.3）                  │
└────────────────────────────┬─────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────┐
│  Core State Layer                                             │
│  ProjectState / validate / file-store                         │
└────────────────────────────┬─────────────────────────────────┘
                             │ writes (human only)
┌────────────────────────────▼─────────────────────────────────┐
│  Core Extraction + Review Layer                               │
│  propose → review → build-approved-patch → patch CLI          │
└──────────────────────────────────────────────────────────────┘
```

### 5.2 Studio 内部モジュール（v0.5 設計案）

| モジュール | 入力 | 出力 |
|-----------|------|------|
| **SituationSynthesizer** | ProjectState[] + PortfolioReport | `situation_overview` |
| **FlowProposer** | PortfolioReport + project health | `flow_proposal` |
| **ResourceAdvisor** | project_health[] + ranking | `resource_allocation` |
| **RiskScanner** | blockers / hypotheses / observations / decisions | `risk_warnings[]` |
| **DecisionBriefBuilder** | decisions / hypotheses / observations | `decision_brief` |
| **StudioAssembler** | 上記全部 | `StudioReport` |

すべて **純粋関数**。副作用なし。

### 5.3 StudioEngine interface（設計）

```typescript
interface StudioInput {
  project_states: ProjectState[];
  director_reports: DirectorReport[];
  portfolio_report: PortfolioReport;
  options?: StudioOptions;
}

interface StudioEngine {
  readonly name: string; // "rule-studio-v1"
  brief(input: StudioInput): StudioReport;
}
```

**v0.5 設計**: interface と `StudioReport` 型のみ。実装は v0.5 実装フェーズまたは v0.5.1。

---

## 6. Director / Portfolio Director / Studio の関係

### 6.1 三層監督モデル

| 層 | 比喩 | 問い | 出力 |
|----|------|------|------|
| **Director** | 現場監督 | この project で **次に何をするか**？ | `DirectorReport` |
| **Portfolio Director** | 配役監督 | **今日**、どの project に手を付けるか？ | `PortfolioReport` |
| **Studio** | 総監督 | **今**、制作現場全体をどう回すか？ | `StudioReport` |

### 6.2 データフロー

```
ProjectState[]
      │
      ├──► ruleDirector.recommend() × N ──► DirectorReport[]
      │
      └──► rulePortfolioDirector.recommendPortfolio()
                    │
                    ▼
             PortfolioReport
                    │
                    └──► ruleStudio.brief()
                              │
                              ▼
                        StudioReport
                              │
                              ▼
                        人間が読んで判断
```

### 6.3 委譲原則

| 判断 | 担当 |
|------|------|
| action 単位スコア | Director（Studio は再計算しない） |
| 今日の一手（project × action） | Portfolio Director（Studio は上書きしない） |
| フロー / リスク / 週次焦点 / 並行上限 | Studio |
| state 変更 | 人間 + Extraction / patch CLI のみ |

Studio が Portfolio primary と **異なる提案** を出す場合:

- Portfolio primary は **維持** し、Studio は **文脈・フロー・警告** で補完する
- 矛盾する場合は `alignment_notes[]` で明示（「Portfolio は A を推すが、同日並行上限のため B は午後に」）

---

## 7. Studio が扱う対象 — どこまで見るか

### 7.1 エンティティ別読取スコープ

| エンティティ | 読取 | 深度 | Studio での用途 |
|-------------|------|------|----------------|
| **Project** | ✅ | title, summary, status, tags | 横断一覧、active / paused 警告 |
| **Goal** | ✅ | primary_goal + status=active goals | 焦点のずれ、goal 未達リスク |
| **Next Action** | ✅ | pending / in_progress, depends_on チェーン | フロー提案、解放数（Director 経由） |
| **Blocker** | ✅ | open blockers, severity | リスク警告、ボトルネック |
| **Decision** | ✅ | status=active | 判断材料、制約（「LLM 禁止」等） |
| **Hypothesis** | ✅ | status=untested | 未検証リスク、先送り警告 |
| **Observation** | ✅ | 直近 N 件 / 30 日以内 | momentum、観測不足警告 |
| **ReferenceDoc** | ✅ | path, title, kind, summary のみ | ドキュメント参照リンク。**本文は読まない**（v0.5） |
| **Judgment** | △ | 直近 hold / go 等 | decision_brief 補助（v0.5 optional） |
| **GoalEdge** | ❌ | v0.5 では未使用 | Goal Graph 実装後（v0.6+） |

### 7.2 読まないもの

| 対象 | 理由 |
|------|------|
| 会話全文 / チャットログ | Core 憲法: 保存しない |
| ReferenceDoc 本文 | v0.5 はメタデータのみ。全文 NLP は v0.6+ |
| 外部 DB / Router 状態 | スコープ外 |
| LLM プロンプト / 生出力 | 保存対象外 |

### 7.3 固有名詞非依存

Studio の scoring / risk / flow ロジックは **project 名・キャラ名・地名を hardcode しない**。  
Portfolio Director と同様、**構造シグナル**（blocker severity、downstream unlock、phase パターン、meta keyword 密度、観測 recency）で判断する。

---

## 8. Studio が答えるべき質問

Portfolio Director の 6 問を **包含** し、Studio は以下を **追加** で答える。

### 8.1 Portfolio 継承（6 問）

| # | 質問 | 主担当 |
|---|------|--------|
| P1 | 今日一番やる価値があるのは何か？ | Portfolio → Studio が文脈付け |
| P2 | なぜそれなのか？ | Portfolio reasons → Studio が拡張説明 |
| P3 | 今はやらなくていいものは何か？ | Portfolio deferred → Studio が時間軸で整理 |
| P4 | どの project が止まっているか？ | Portfolio blocked → Studio が危険度付け |
| P5 | どの project が進んでいるか？ | Portfolio progressing → Studio が伸びシグナル |
| P6 | 全体のボトルネックは何か？ | Portfolio bottleneck → Studio が横断整理 |

### 8.2 Studio 固有（8 問）

| # | 質問 | StudioReport フィールド |
|---|------|------------------------|
| S1 | **今どこにいる？**（横断） | `situation_overview` |
| S2 | **何が止めている？**（複数 bottleneck） | `cross_project_bottlenecks[]` |
| S3 | **今日やるべきことは？**（フロー付き） | `today_focus` + `flow_proposal` |
| S4 | **今やらなくていいことは？**（明示 defer） | `explicit_deferrals[]` |
| S5 | **どの project が危険か？** | `at_risk_projects[]` |
| S6 | **どの project が伸びているか？** | `growing_projects[]` |
| S7 | **注意力をどう配分すべきか？** | `resource_allocation` |
| S8 | **判断に必要な材料は何か？** | `decision_brief` |

---

## 9. Studio Explainability 原則

### 9.1 必須

| 原則 | 内容 |
|------|------|
| **理由必須** | すべての提案に `StudioReason[]`（空禁止） |
| **1 位の理由** | primary focus に reasons ≥ 2 |
| **後回しの理由** | 各 deferral に defer_reasons ≥ 1 |
| **リスクの根拠** | entity 参照（blocker_id / hypothesis_id 等） |
| **Portfolio との関係** | Portfolio primary を引用し、Studio 独自判断を区別 |
| **スコア trace** | `score_delta` または `confidence_factors` |
| **人間可読要約** | `summary_text` 15–30 行 |

### 9.2 禁止

| 禁止 | 代替 |
|------|------|
| 「なんとなく今日は FreeWater」 | urgency + bottleneck + flow reasons |
| 「AI が判断した」 | rule-studio-v1 + reason kind |
| 理由なしリスク警告 | blocker / hypothesis / observation 参照 |
| Portfolio 無視の primary 上書き | alignment_notes で関係を明示 |

### 9.3 StudioReason kind（設計案）

```
portfolio_alignment    — Portfolio primary との一致 / 補完
flow_sequencing        — 順序提案の根拠
resource_limit         — 並行上限
risk_blocker           — open blocker 由来
risk_hypothesis        — untested hypothesis
risk_observation_gap   — 観測不足
risk_decision_pending  — active decision 未消化
defer_explicit         — 意図的後回し
growth_momentum        — 伸びシグナル
meta_work_defer        — 構造シグナル（固有名詞なし）
```

---

## 10. Human Authority 原則

### 10.1 憲法条項

1. **決定権は常に人間** — Studio は `requires_human_decision: true` 固定  
2. **Studio は推薦を命令に変換しない** — 「やれ」ではなく「今日は X を優先する提案」  
3. **人間が無視してよい** — Studio 出力に従う義務はない  
4. **人間が拒否できる** — Review Bridge と同型の精神  
5. **state 変更は人間の明示操作のみ** — patch CLI / approved patch 経路  
6. **Studio は Extraction をバイパスしない** — 自然文 → state は既存パイプライン  

### 10.2 人間の典型アクション（Studio 出力後）

| 人間の行動 | 経路 |
|-----------|------|
| 今日の一手を state に反映したい | propose → review → patch |
| primary を変えたい | PriorityChanged + review + patch |
| action を done にしたい | manual patch / 将来 DecisionMade + review |
| Studio 提案を却下 | 何もしない（valid） |
| 週次焦点をメモしたい | observation patch（manual） |

---

## 11. Studio Safety 原則

### 11.1 Safety レイヤ

| 原則 | 説明 |
|------|------|
| **Read-only by design** | StudioInput から ProjectState を変更しない |
| **No side effects** | ファイル書込・API・DB なし |
| **Fail closed on ambiguity** | 入力不整合は report 生成失敗（警告） |
| **Inherit Core bans** | 自動保存・自動適用・LLM（v0.5）禁止 |
| **No autopilot path** | Studio → patch 自動生成ルートを **設けない** |
| **Audit trail 分離** | StudioReport は state に自動保存しない（--out は人間任意） |

### 11.2 危険パターンと Studio の振る舞い

| 危険パターン | Studio の提案（例） |
|-------------|---------------------|
| 4 project 同日フル並行 | `resource_allocation`: 並行上限 2 警告 |
| 全 project 観測 30 日なし | `risk_observation_gap` 警告 |
| active decision が矛盾 | `decision_brief` で並置、判断は人間 |
| meta project が execution を押しのける | defer 提案（構造シグナル） |
| Portfolio と flow が矛盾 | `alignment_notes` で午前 / 午後分割提案 |

---

## 12. v0.5 Scope

### 12.1 v0.5 に **入れる** もの

| 項目 | 内容 |
|------|------|
| **本 Constitution** | GROUND Studio 憲法（本文書） |
| **StudioEngine interface 設計** | `brief(input): StudioReport` |
| **StudioReport 型設計** | situation / flow / risk / decision_brief |
| **StudioReason / Explainability** | reason kind + テンプレート |
| **Core 統合設計** | PortfolioReport を入力に含める合成 |
| **CLI 仕様案** | `studio-brief`（read-only、--out 任意） |
| **テスト方針** | 純粋関数・no side effect・grep ガード |
| **v0.5 完了定義** | 下記 §14 |
| **4 project 具体例** | 本文書 §16（構造例、hardcode なし） |

→ **v0.5.1 Brief 設計**: [GROUND_STUDIO_V0.5.1_BRIEF_DESIGN.md](./GROUND_STUDIO_V0.5.1_BRIEF_DESIGN.md)

### 12.2 v0.5 に **入れない** もの

| 項目 | 理由 |
|------|------|
| OpenAI / Anthropic / LLM 接続 | 構造固定優先 |
| Router | スコープ外 |
| Web UI | CLI 安定後 |
| PostgreSQL | file-store 継続 |
| 自動保存・自動適用 | 憲法禁止 |
| AI Agent / Auto Pilot | Studio 非実行者 |
| Goal Graph 実装 | v0.6+ |
| Director → propose **自動**連携 | v0.5 は **設計のみ** 可、実装は v0.5.1+ |
| ReferenceDoc 本文 NLP | v0.6+ |
| GROUND 本体（ground.ink）接続 | v0.6+ |
| project 間 dependency モデル | v0.6+ |

### 12.3 v0.5 実装フェーズ候補（次ステップ）

実装に進む場合の最小単位:

1. `ground-core/studio/types.ts` — StudioReport  
2. `ground-core/studio/rule-studio.ts` — rule-studio-v1  
3. `npm run ground-core -- studio-brief` — read-only CLI  
4. テスト 15+ 件 + manual run doc  

**v0.5 設計フェーズ（今回）では 1–4 は設計のみ。コード禁止。**

---

## 13. v0.6 以降へ送るもの

| 項目 | 理由 |
|------|------|
| **Review UI** | Studio brief 閲覧・ReviewSelection 入力 |
| **Director → propose 連携** | 「推薦 action を propose seed に」— 自動 patch ではない |
| **Goal Graph 可視化 + Studio 読取** | GoalEdge を at_risk 判定に |
| **project 間 dependency** | `depends_on_project_id` 等 |
| **LLM-assisted narrative** | score は rule のまま、要約のみ LLM optional |
| **GROUND 本体接続** | ground.ink ↔ Core boundary |
| **ReferenceDoc 本文参照** | 浅い citation / 未読警告 |
| **due_at / カレンダー** | 週次 flow の時間軸強化 |
| **ApprovedPatchBundle** | Studio 推薦と patch bundle 並置 |
| **PostgreSQL / multi-user** | 個人 OS からの拡張 |

---

## 14. Studio 完了定義（v0.5 実装フェーズ用）

v0.5 **設計** 完了（今回）:

1. 本 Constitution が Studio の憲法として成立  
2. Core / Director / Portfolio / Studio の責務分界が明確  
3. 禁止事項・Safety・Human Authority が Core 憲法と整合  
4. StudioReport フィールドと Studio が答える問いが定義  
5. v0.5 in/out / v0.6 送りが明確  

v0.5 **実装** 完了（将来）:

1. `studio-brief` CLI が read-only で動作  
2. StudioReport に situation / flow / risk / decision_brief が埋まる  
3. Portfolio primary を尊重し alignment_notes で補完  
4. すべての提案に reasons  
5. saveProject / applyPatch を呼ばない  
6. `npm run test:ground-core` 全通過  
7. manual run doc（4 project 想定）

---

## 15. StudioReport 型（設計案）

```typescript
interface StudioReport {
  schema_version: "0.5.0";
  engine: string; // "rule-studio-v1"
  generated_at: string;

  /** 横断現在地 */
  situation_overview: StudioSituationOverview;

  /** Portfolio 継承 + Studio 拡張 */
  today_focus: StudioTodayFocus;
  priority_stack: StudioPriorityStack;

  /** Studio 固有 */
  flow_proposal: StudioFlowProposal;
  resource_allocation: StudioResourceAllocation;
  cross_project_bottlenecks: StudioBottleneck[];
  at_risk_projects: StudioProjectSignal[];
  growing_projects: StudioProjectSignal[];
  explicit_deferrals: StudioDeferral[];
  risk_warnings: StudioRiskWarning[];
  decision_brief: StudioDecisionBrief;

  /** Portfolio との関係 */
  portfolio_alignment: PortfolioAlignmentNotes;

  confidence: number;
  confidence_factors: StudioConfidenceFactor[];
  summary_text: string;
  requires_human_decision: true;
}
```

---

## 16. 具体例 — 4 Project 保有時の Studio 振る舞い

> **注意**: 以下は **理解のための具体例** である。Studio 設計は project 名・固有名詞に **依存しない**。  
> シグナルは blocker severity / downstream unlock / phase パターン / observation recency / meta keyword 密度等の **構造** で読む。

### 16.1 想定 portfolio（例）

| 例示ラベル | 構造パターン | 典型シグナル |
|-----------|-------------|-------------|
| **A: 現場検証型** | phase0 / 配布 / 検証 / high blocker on 先頭 action | field_validation_priority 高 |
| **B: 創作制作型** | production_design / キャラ・世界観チェーン | downstream 多、blocker 複数 |
| **C: 問題解決型** | 画像分析 /  tutoring / 単発 deliverable | observation 依存、scope 要監視 |
| **D: メタインフラ型** | schema / CLI / Director / Studio 設計 | meta_work_defer、downstream 少 |

（例示ラベル A≈FreeWater、B≈Momotaro、C≈SISTER、D≈GROUND Core だが、**実装はこれらの名前を使わない**）

### 16.2 Studio が返す提案（例）

#### situation_overview

```
4 project active。
現場検証型(A)は high blocker + 先頭 action 着手可能で execution チェーン先頭。
創作制作型(B)は ready、primary はチェーン先頭。
問題解決型(C)は observation 不足シグナル — 最近の現場フィードバックなし。
メタインフラ型(D)は v0.4 到達後 ready — meta defer は弱まったが execution より優先度低。
```

#### today_focus（Portfolio 尊重）

| 順位 | 来源 | 提案 |
|------|------|------|
| Primary | Portfolio Director | **A: 先頭 action（場所 / 入口決定）** |
| Alternative | Portfolio | **B: チェーン先頭（固定ルール整理）** |
| Defer | Studio + Portfolio | **D: v0.5 設計** — 横断スコア差で後回し可 |
| Watch | Studio | **C** — 観測不足。今日触るなら短時間の observation 追加を **提案**（patch は人間） |

#### flow_proposal（実行は人間）

```
午前: A の先頭 action に集中（1 project のみ）
午後: 余力があれば B の primary（創作は分割しやすい）
C: 今日は observation / 短い検証のみ提案 — フル制作フローに入れない
D: 今日は defer — v0.5 設計 doc 読了程度に留める
切替上限: 同日 deep work は最大 2 project
```

#### resource_allocation

| 警告 | 内容 |
|------|------|
| 並行上限 | 4 project 全起動は注意力分散 — **deep work 2 まで** |
| 創作 + 現場同日 | A と B の同日 deep 並行は **フロー上非推奨**（reason: コンテキスト切替コスト） |

#### at_risk_projects

| 例示 | 理由（構造） |
|------|-------------|
| **C** | 30 日以内 observation なし + untested hypothesis あり |
| **D**（条件付き） | 旧 state なら stalled — 更新後は ready だが execution 優先度は低 |

#### growing_projects

| 例示 | 理由（構造） |
|------|-------------|
| **A** | primary 確定 + high blocker 解消で downstream 解放 |
| **B** | primary 一致 + confidence ≥ 0.7 + チェーン先頭 |

#### risk_warnings

1. **C**: 観測不足 — 判断先送りリスク（hypothesis untested）  
2. **D**: active decision「本体接続方針未確定」— 早急な Web 接続は **Studio は推奨しない**（decision 引用）  
3. **横断**: 4 project 同時 deep — リソース警告  

#### decision_brief

| 来源 | 人間への材料 |
|------|-------------|
| D project active decisions | LLM 禁止 / 自動適用禁止 / Portfolio は patch しない |
| C untested hypotheses | 「UI より Director→propose 先」の仮説 — 未検証 |
| A observations | 現場未実施メモ — Phase0 前 |

#### explicit_deferrals

| 対象 | 理由 |
|------|------|
| D: v0.5 範囲定義 | execution project（A）が先 — defer_explicit |
| B: 午前 | flow_sequencing — 午後枠を提案 |
| C: 本日の deep work | observation_gap — 先に材料不足 |

#### portfolio_alignment

```
Portfolio primary = A（一致）
Studio は primary を変更しない。
補完: 午後 B、C は軽接触、D は defer。
矛盾なし — alignment_notes に時間分割のみ記載。
```

### 16.3 Studio が **しない** こと（この例で）

| やらないこと | 理由 |
|-------------|------|
| A の場所を勝手に決める | 人間 + DecisionMade / patch |
| B の action を done にする | 人間 + patch |
| C に自動で observation を書き込む | save 禁止 |
| D の project.status を変える | 人間 + patch |
| 「今日は A だけやれ」と命令 | 提案のみ。拒否可能 |

---

## 17. 関連ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [GROUND_CORE_V0.1_DESIGN.md](./GROUND_CORE_V0.1_DESIGN.md) | Core 憲法・本体との関係 |
| [GROUND_CORE_V0.4_MULTI_PROJECT_DIRECTOR.md](./GROUND_CORE_V0.4_MULTI_PROJECT_DIRECTOR.md) | Portfolio Director 実装 |
| [GROUND_CORE_V0.4_MULTI_PROJECT_DIRECTOR_DESIGN.md](./GROUND_CORE_V0.4_MULTI_PROJECT_DIRECTOR_DESIGN.md) | Portfolio 設計 |
| [GROUND_CORE_V0.4_SELF_STATE_UPDATE.md](./GROUND_CORE_V0.4_SELF_STATE_UPDATE.md) | GROUND Core v0.4 到達 state |
| [GROUND_CORE_V0.2.3_STATUS_REPORT.md](./GROUND_CORE_V0.2.3_STATUS_REPORT.md) | Extraction + Review 到達 |

---

## 18. 要約 — Studio 憲法 3 条

1. **Studio は監督層である** — 記録も実行も決定もしない。提案だけ返す。  
2. **決定権は常に人間である** — Studio は判断力を拡張し、代わりにはならない。  
3. **Core の安全経路を侵さない** — 保存・適用・自動化・Agent 化のショートカットを設けない。

---

*GROUND Studio v0.5 — Constitution & Scope Definition。設計のみ。実装は次フェーズ。*
