# GROUND Core v0.2.3 — 到達レポート

> **日付**: 2026-06-07  
> **地位**: v0.1.0 から v0.2.3 までの到達点整理。現状の能力・禁止事項・次フェーズ判断材料。  
> **スコープ**: ドキュメントのみ。新機能実装なし。

---

## 1. 現在の到達地点

GROUND Core は **CLI ベースの ProjectState 管理エンジン** として、以下の end-to-end パイプラインを実装済み:

```
自然文
  → SemanticEvent（RuleModalityDetector）
  → resolution_results[]（TokenMatchResolver）
  → PatchProposal（semantic-propose）
  → ReviewSelection（人間 JSON）
  → approved StatePatch（build-approved-patch）
  → patch CLI 適用（saveProject）
```

**v0.2.3 の到達点**: 「意味イベント → next_action 候補提示 → 人間承認 → state 更新 patch 生成 → 明示的適用」までが **Momotaro / FreeWater の実プロジェクトで E2E 検証済み**。

LLM API・Web UI・Router・DB 連携は **未着手**。自動保存・自動適用は **設計上禁止**。

---

## 2. 実装済みフェーズ一覧

| フェーズ | 内容 | 状態 |
|---------|------|------|
| **v0.1.0** | ProjectState / StatePatch / validate / applyPatch / file-store / CLI（init, list, show, patch, new-id） | 実装済 |
| **v0.1.1** | reference_docs / observations / judgments / primary_next_action_id / depends_on_action_id / migration | 実装済 |
| **v0.2.0** | Extraction Layer / MockExtractor / PatchProposal / dry-run / propose CLI | 実装済 |
| **v0.2.1** | SemanticEvent / RuleModalityDetector / semantic-propose / 5 EventType / resolver_hint | 実装済 |
| **v0.2.2** | EventResolver / TokenMatchResolver / resolution_results[] | 実装済 |
| **v0.2.3** | Human Review Bridge / ReviewSelection / build-approved-patch CLI | 実装済 |

---

## 3. 主要ファイル構成

```
ground-core/
├── cli.ts                          # init / list / show / patch / propose / build-approved-patch
├── types.ts                        # ProjectState, StatePatch, PatchSource (+ human_review)
├── state-engine.ts                 # applyPatch, createEmptyProject
├── validate.ts                     # JSON Schema 検証
├── file-store.ts                   # saveProject / loadProject
├── migrate.ts                      # v0.1.0 → v0.1.1
├── errors.ts
├── index.ts                        # 公開 API
├── extraction/
│   ├── types.ts                    # PatchProposal, ExtractionDraft
│   ├── propose.ts                  # buildProposalFromDraft, runPropose
│   ├── mock-extractor.ts           # v0.2.0 ルールベース extractor
│   ├── dry-run.ts
│   ├── semantic/
│   │   ├── types.ts                # SemanticEvent, EventType
│   │   ├── rule-modality-detector.ts
│   │   ├── semantic-propose.ts
│   │   ├── event-resolver.ts
│   │   ├── token-match-resolver.ts
│   │   └── resolver-types.ts
│   └── review/
│       ├── types.ts                # ReviewSelection
│       ├── review-gates.ts
│       └── build-approved-patch.ts
├── storage/projects/               # ProjectState JSON（gitignore 対象）
├── examples/
│   ├── proposals/                  # propose 出力例
│   ├── reviews/                    # ReviewSelection 例
│   └── approved-patches/           # approved StatePatch 例
└── __tests__/                      # 100 tests

docs/
├── GROUND_CORE_V0.1*.md
├── GROUND_CORE_V0.2*.md
├── GROUND_CORE_V0.2.3_*.md
└── schemas/                        # JSON Schema
```

---

## 4. 現在できること

### ProjectState 管理

| 能力 | 手段 |
|------|------|
| ProjectState を JSON で保存・読込 | `file-store` + `patch` CLI |
| 状態を patch で増分更新 | `applyPatch` + `validateStatePatch` |
| UUID 生成 | `new-id` CLI |
| 空プロジェクト作成 | `init` CLI |

### Extraction（自然文 → 提案）

| 能力 | 手段 |
|------|------|
| 自然文から PatchProposal を生成 | `propose` CLI（semantic / mock） |
| SemanticEvent を抽出（LLM なし） | RuleModalityDetector |
| next_action 候補を resolution_results で提示 | TokenMatchResolver |
| dry-run で適用可否を事前確認 | `dryRunPatch` |
| ClarificationResponse を返す（StopRequested 等） | semantic-propose |

### Human Review Bridge（v0.2.3）

| 能力 | 手段 |
|------|------|
| 人間が候補を選ぶと approved StatePatch を生成 | `build-approved-patch` CLI |
| PriorityChanged + approve → primary 更新 patch | buildApprovedPatch |
| ActionDeferred + approve → observation + judgment（note 追記可） | 同上 |
| CandidateCreated / DecisionMade → selection 省略可 | implicit approve |
| 既存 patch CLI で storage に保存 | `patch` CLI（**唯一の save 経路**） |

### 安全機構

| 能力 | 内容 |
|------|------|
| propose / build-approved-patch は storage を変更しない | read-only load のみ |
| assertPatchHasNoAutoStateAdvance | v0.2.1 propose ガード |
| assertApprovedPatchGates | v0.2.3 approved patch ガード |
| 固有名詞非依存 | detector / resolver / bridge ソースガードテスト |

---

## 5. 現在できないこと

| 項目 | 理由 |
|------|------|
| LLM による意味抽出 | 未実装（RuleModalityDetector のみ） |
| 自動 saveProject（propose / build から） | 設計禁止 |
| 自動 patch 適用 | 設計禁止 |
| Web UI / Review パネル | 未実装 |
| AI Router / PostgreSQL / GROUND 本体連携 | 未実装 |
| DecisionMade → action done / blocker resolved | v0.2.4+ 候補 |
| StopRequested → patch 化 | Clarification のまま |
| 複数 resolution_results の batch selection | v0.2.3 は event_id 1 件のみ |
| ApprovedPatchBundle 監査出力 | v0.2.4 候補 |
| Goal Graph / Director Engine | v0.3 候補 |

---

## 6. 絶対にまだ禁止していること

以下は **コード・CLI・設計の全フェーズで禁止**。v0.2.3 でも例外なし。

| 禁止事項 | 適用範囲 |
|---------|---------|
| 自動保存 | propose / build-approved-patch から saveProject 禁止 |
| 自動適用 | approved patch の暗黙 apply 禁止 |
| LLM API 接続 | OpenAI / Anthropic 等 |
| Web UI / Router / DB 連携 | 外部システム |
| `project.status` 自動変更 | 全 patch パス |
| `next_action` status → done 自動変更 | propose / approved patch |
| `blocker` status → resolved / mitigated 自動変更 | propose / approved patch |
| `delete` operation | propose / approved patch |
| StopRequested の patch 化 | build-approved-patch 対象外 |
| `selected_candidate_id` の自動設定 | Resolver / propose |
| primary 更新（PriorityChanged + human approve 以外） | approved patch gates |
| 固有名詞ハードコード（detector / resolver / bridge） | テスト入力のみ可 |

---

## 7. 実プロジェクト投入状況

| # | Project | project_id | 投入内容 |
|---|---------|------------|---------|
| 1 | GROUND Core（自身） | — | エンジン本体。storage / CLI / tests |
| 2 | FreeWater | `28d83a68-2064-43d7-94cb-72656b9006de` | v0.1.1 manual patch 済。v0.2.1 semantic manual run 済。**v0.2.3 E2E 済** |
| 3 | Japanese Folktale / Momotaro | `839578f5-36e1-4b6f-9be5-a97520f52b66` | v0.1.1 production-design patch 済。v0.2.1 semantic manual run 済。**v0.2.3 E2E 済** |

storage 配置: `ground-core/storage/projects/{project_id}.json`

---

## 8. E2E 検証結果

### Momotaro

| 項目 | 結果 |
|------|------|
| 入力 | `桃太郎はまずキャラ固定からやる` |
| SemanticEvent | PriorityChanged |
| resolution candidate | 桃太郎のキャラクター固定ルールを整理する（score 1.0, ambiguity none） |
| human approve | review-selection.json |
| approved patch | observation + primary upsert（source: human_review） |
| patch apply | exit 0 |
| primary 確認 | `c3333333-...3301`（キャラ固定 action） |
| action done / blocker resolved | なし |
| storage 変更時点 | patch CLI のみ |

ログ: [GROUND_CORE_V0.2.3_E2E_MANUAL_RUN.md](./GROUND_CORE_V0.2.3_E2E_MANUAL_RUN.md)

### FreeWater

| 項目 | 結果 |
|------|------|
| 入力 | `FreeWaterは先に場所を決める` |
| SemanticEvent | PriorityChanged |
| resolution candidate | 配布場所を1つ決める（score 0.7, ambiguity low） |
| human approve | review-selection.json |
| approved patch | observation + primary upsert（source: human_review） |
| patch apply | exit 0 |
| primary 確認 | `f3333333-...3301`（配布場所 action） |
| action done / blocker resolved | なし |
| storage 変更時点 | patch CLI のみ |

ログ: [GROUND_CORE_V0.2.3_FREEWATER_E2E_MANUAL_RUN.md](./GROUND_CORE_V0.2.3_FREEWATER_E2E_MANUAL_RUN.md)

### E2E 共通の注意点

- 両 project とも **適用前から primary は対象 action を指していた**（v0.1.1 manual patch 済み）。E2E の主効果は observation 追加 + human_review 経由の current_state 再確定。
- proposal_id / event_id は propose 実行ごとに変わる。selection は proposal JSON から毎回取得。

---

## 9. 現在の安全設計

### パイプライン分離

```
EventDetector     → 意味のみ（entity 解決しない）
EventResolver     → 候補提示のみ（selected 自動設定しない）
semantic-propose  → observation / judgment のみ（state 進行なし）
build-approved-patch → 人間 selection 必須（PriorityChanged primary のみ）
patch CLI         → 唯一の saveProject 経路
```

### ゲート層

| 層 | 関数 / モジュール |
|----|------------------|
| propose ガード | `assertPatchHasNoAutoStateAdvance` |
| resolver ガード | `isResolvableEvent`, MIN_CANDIDATE_SCORE |
| review selection ガード | `validateSelectionIntegrity`, `validateApproveResolutionGates` |
| approved patch ガード | `assertApprovedPatchGates` |
| schema 検証 | `validateStatePatch`, `validateProjectState` |
| 適用前確認 | `dryRunPatch` |

### PatchSource

| source | 用途 |
|--------|------|
| `manual` | 手動 patch |
| `extraction` | propose 段階の proposed_patch |
| `human_review` | build-approved-patch 出力 |
| `import` | 将来 import 用 |

---

## 10. v0.2.4 候補

| 候補 | 内容 |
|------|------|
| ApprovedPatchBundle | 監査用ラッパ（`--format bundle`） |
| reject 時 note 追記 | observation body への rejection note |
| proposal freshness guard | propose から時間経過後の build 再検証強化 |
| ambiguity high の clarify UX | build 拒否 + 人間向けガイダンス |
| DecisionMade → action done | **慎重**。Modality gate 設計後 |
| ActionCompleted / BlockerMitigated | gate 設計後 |
| validate-selection CLI | selection 単体検証 |
| 複数 resolution_results | batch selection |

---

## 11. v0.3 候補

| 候補 | 内容 |
|------|------|
| **Director Engine** | **設計済**: [GROUND_CORE_V0.3_DIRECTOR_ENGINE_DESIGN.md](./GROUND_CORE_V0.3_DIRECTOR_ENGINE_DESIGN.md) |
| **Director Engine 実装** | **実装済**: [GROUND_CORE_V0.3_DIRECTOR_ENGINE.md](./GROUND_CORE_V0.3_DIRECTOR_ENGINE.md) |
| Review UI / Web UI | ReviewSelection フォーム、proposal 閲覧 |
| Goal Graph | goal 依存関係の可視化・操作 |
| Director Engine | プロジェクト進行の orchestration |
| Project dashboard | 複数 project の横断ビュー |
| LLM Extractor | **後回し**。RuleModalityDetector との gate 設計が前提 |

---

## 12. 次に進む前の判断ポイント

1. **v0.2.4 に進むか、v0.2.3 を安定化フェーズとするか**  
   E2E は 2 project で成功。ApprovedPatchBundle / freshness guard は運用上の優先度を決める。

2. **primary が適用前から正しい case の意味**  
   「変更」より「human_review 監査 trail + observation 記録」が主価値。UX / ドキュメントで明確化済みか。

3. **DecisionMade → state 進行の scope**  
   action done / blocker resolved は v0.2.4 でも gate なしでは危険。Modality + human approve の二重 gate が必要。

4. **LLM Extractor のタイミング**  
   v0.3 まで後回し推奨。RuleModalityDetector + TokenMatchResolver の固定例非依存が先。

5. **Web UI の入口**  
   現状 CLI + JSON ファイルで E2E 可能。UI は ReviewSelection / proposal 閲覧から小さく始める。

6. **storage の git 管理**  
   `ground-core/storage/projects/` は gitignore。examples / docs で再現手順を維持。

7. **テストカバレッジ**  
   100 tests 通過。E2E は manual run docs + unit tests。CI 組込みは別判断。

---

## テスト状況（2026-06-07）

```bash
npm run test:ground-core
```

```
ℹ tests 100
ℹ suites 22
ℹ pass 100
ℹ fail 0
```

---

## 関連ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [GROUND_CORE_V0.2.3_HUMAN_REVIEW_BRIDGE.md](./GROUND_CORE_V0.2.3_HUMAN_REVIEW_BRIDGE.md) | v0.2.3 実装 |
| [GROUND_CORE_V0.2.3_HUMAN_REVIEW_BRIDGE_DESIGN.md](./GROUND_CORE_V0.2.3_HUMAN_REVIEW_BRIDGE_DESIGN.md) | v0.2.3 設計 |
| [GROUND_CORE_V0.2.3_E2E_MANUAL_RUN.md](./GROUND_CORE_V0.2.3_E2E_MANUAL_RUN.md) | Momotaro E2E |
| [GROUND_CORE_V0.2.3_FREEWATER_E2E_MANUAL_RUN.md](./GROUND_CORE_V0.2.3_FREEWATER_E2E_MANUAL_RUN.md) | FreeWater E2E |
| [GROUND_CORE_V0.2.2_EVENT_RESOLVER.md](./GROUND_CORE_V0.2.2_EVENT_RESOLVER.md) | v0.2.2 Resolver |
| [GROUND_CORE_V0.2.1_SEMANTIC_EXTRACTION.md](./GROUND_CORE_V0.2.1_SEMANTIC_EXTRACTION.md) | v0.2.1 Semantic |
| [GROUND_CORE_V0.2_EXTRACTION.md](./GROUND_CORE_V0.2_EXTRACTION.md) | v0.2.0 Extraction |
| [GROUND_CORE_V0.3_DIRECTOR_ENGINE.md](./GROUND_CORE_V0.3_DIRECTOR_ENGINE.md) | v0.3 Director 実装 |
| [GROUND_CORE_V0.4_MULTI_PROJECT_DIRECTOR_DESIGN.md](./GROUND_CORE_V0.4_MULTI_PROJECT_DIRECTOR_DESIGN.md) | v0.4 Portfolio Director 設計 |
