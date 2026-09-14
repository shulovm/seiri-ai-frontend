# GROUND Operating Doctrine v0.2.2

> **地位**: GROUND Core / Studio / Experiment Intake / Session Patch Helper の **内部憲法**。  
> **対象読者**: 開発者、設計者、将来の AI エージェント。  
> **目的**: GROUND を誤って拡張しないための判断基準。宣伝文ではない。  
> **ファイル**: `GROUND_OPERATING_DOCTRINE_V0.2.md`（v0.2.2 — Brief Mode Semantics 追記。リンク安定のためファイル名は維持）

前段実装: Experiment Intake v0.1〜v0.1.2、Session Patch Helper v0.3〜v0.3.1、Portfolio Mode Semantics v0.4.6  
関連: [GROUND_STUDIO_V0.5_CONSTITUTION.md](./GROUND_STUDIO_V0.5_CONSTITUTION.md), [GROUND_CORE_V0.1_DESIGN.md](./GROUND_CORE_V0.1_DESIGN.md), [GROUND_PORTFOLIO_MODE_SEMANTICS_V0.4.6.md](./GROUND_PORTFOLIO_MODE_SEMANTICS_V0.4.6.md)

---

## 0. このドキュメントの使い方

新機能・UI・API・LLM 連携・自動生成を検討するとき、**最初にこのドキュメントに照らす**。

次の問いに答えられなければ、実装を止める。

1. これは ProjectState にどう影響するか？
2. これは Brief から人間の次の Action に繋がるか？
3. これは Seed → State → Brief → Action → Patch → Next Brief のループに接続するか？
4. これは Human の所有権・責任・判断を侵していないか？
5. 状態更新は **Patch として preview 可能** か？Human が apply する前に内容を確認できるか？

---

## 1. GROUND とは何か

### 1.1 定義

**GROUND** は、人間の思考・実験・創作の不確実性を、構造化された **ProjectState** と **次の Action** へ変換するための **オペレーティングシステム** である。

> *GROUND is not a chat app.*  
> *GROUND is not a task list.*  
> *GROUND is not a content generator.*  
>  
> *GROUND is an operating system for turning human thought, experiments, and creative uncertainty into structured project state and next action.*

日本語で言えば:

**GROUND は、雑談アプリでも、タスク一覧でも、コンテンツ自動生成工場でもない。  
人間の思考と実験を、保存可能な構造と「次の一手」へ変換する OS である。**

### 1.2 GROUND の単位

GROUND が扱う最小の意味ある単位は **会話のターン** ではなく **ProjectState の更新** である。

| 単位 | 地位 |
|------|------|
| 会話ログ | 保存対象ではない（副産物に過ぎない） |
| タスク | ProjectState 内の `next_actions` の一部 |
| ProjectState | **集約ルート**。現在地の唯一の正 |
| Brief | ProjectState から生成される **行動変換** |
| Patch | 人間の Action 結果を State へ戻す **確認可能な状態更新案** |

### 1.3 GROUND のレイヤ（現時点）

```
Experiment Intake        … Seed → ProjectState への入口
Session Patch Helper     … Action 完了 → StatePatch 生成・preview（apply は Human）
GROUND Core              … ProjectState の保存・更新・検証
Director            … 単一 project の次 Action 推薦
Portfolio Director  … 複数 project の横断優先
GROUND Studio       … Brief 生成（状況理解・フロー・リスク・判断材料）
```

各レイヤは **読み取り専用の提案** と **State 更新の分離** を守る。Studio は state を書き換えない。

---

## 2. GROUND の中核ループ

GROUND のすべての機能は、以下のループに接続されなければならない。

```
Seed
  ↓
ProjectState
  ↓
Brief
  ↓
Action
  ↓
Patch（生成・preview）
  ↓
Human 確認・apply
  ↓
Updated ProjectState
  ↓
Next Brief
```

（v0.3 以降、Patch は `build-complete-action-patch` で生成し、Human が preview してから既存 `patch` コマンドで apply する。）

### 2.1 各要素の意味

| 要素 | 定義 |
|------|------|
| **Seed** | まだ構造化されていない実験・制作・事業・研究の **入口**。完全である必要はない。 |
| **ProjectState** | 思考・判断・実行の **現在地**。AI の記憶ではなく、人間が確認できる構造。 |
| **Brief** | ProjectState を **人間の次の Action** へ変換したもの。作戦書。 |
| **Action** | 人間が実際に行う **一手**。GROUND 外で起きる。 |
| **Patch** | Action の結果を ProjectState へ **戻す** 確認可能な状態更新案。apply 前に Human が読めること。 |
| **Updated ProjectState** | Patch 適用後の **新しい現在地**。 |
| **Next Brief** | 更新された State から再生成される **次の作戦書**。 |

### 2.2 ループが止まる条件

以下のいずれかが欠けると、GROUND は前に進まない。

- Seed が ProjectState に変換されていない
- Brief が生成されていない
- 人間が Action を実行していない
- Action 結果が Patch として State に戻っていない
- Human が Patch を preview せず、暗黙の状態更新が起きている

**Patch なしに Brief だけを更新しても、GROUND は前に進んだことにならない。**  
**Patch に書かれていない変更を裏側で起こしても、GROUND は前に進んだことにならない。**

### 2.3 v0.1.2 で実証されたループ

Experiment Intake v0.1.2 にて、以下が CLI 上で確認済み:

```
sample.json (ExperimentSeed)
  → intake → ProjectState 保存
  → studio-brief → TODAY: 「動画テーマを1つ決める」
  → 人間がテーマ決定
  → patch (action done + decision + observation + primary 更新)
  → studio-brief → TODAY: 「視聴者への約束を1行で書く」
```

### 2.4 v0.3 / v0.3.1 で実証された Session Patch ループ

Session Patch Helper v0.3 / v0.3.1 にて、以下が CLI 上で確認済み:

```
studio-brief → TODAY: 「動画テーマを1つ決める」
  → 人間が Action 実行
  → build-complete-action-patch（StatePatch 生成 + text preview）
  → Human が completed action / next primary / decision / observation / current_state 更新を確認
  → patch --file（Human が apply）
  → studio-brief → TODAY: 次の action へ
```

**直接保存しない。** Patch 生成と apply を分離することで、Human remains owner を維持する。

---

## 3. ProjectState とは何か

### 3.1 定義

```
ProjectState = thought state / decision state / execution state
```

ProjectState は **保存された情報の倉庫** ではない。  
**進行中の思考・判断・実行の現在地** である。

### 3.2 含めるべき要素

| 要素 | 役割 |
|------|------|
| `goals` | 何を達成しようとしているか |
| `current_state` | 今どの phase にいて、primary goal / action は何か |
| `next_actions` | 実行可能な次の作業候補（依存関係を含む） |
| `decisions` | すでに下した判断の固定点 |
| `hypotheses` | まだ検証していない **検証対象** |
| `blockers` | **今すぐ進行を妨げる** 障害 |
| `observations` | 現場・実験から得た観測 |
| `judgments` | 観測に対する go / stop / revise / hold |
| `reference_docs` | 設計・bible・manual への参照 |
| `extensions` | schema 変更前の拡張メタデータ（例: `intake`） |

### 3.3 ProjectState の性質

1. **AI の記憶ではない** — チャット履歴の代替ではない。人間が読める構造である。
2. **Brief の地面** — Director / Portfolio / Studio は ProjectState を読む。State がなければ Brief は空になる。
3. **Patch でのみ前進する** — 自動で勝手に進まない。人間の Action 結果が Patch として戻る。
4. **参照整合が必須** — `primary_goal_id`, `primary_next_action_id`, `depends_on_action_id` 等の dangling reference は禁止。

### 3.4 schema と extensions

- **schema 変更は最後の手段**（Principle 6）
- Experiment Intake では `risks`, `assumptions`, `constraints`, `notes` を `extensions.intake` に保持
- `project.tags` で `experiment`, `experiment:content` 等の分類を行う

---

## 4. Brief とは何か

### 4.1 定義

```
Brief = ProjectState を人間の次の行動に変換したもの
```

Brief は **説明文** ではない。  
Brief は **要約** でもない。  
Brief は **人間が次に動けるための作戦書** である。

### 4.2 Brief の各セクション

| セクション | 意味 | 注意 |
|------------|------|------|
| **TODAY** | **最重要**。今すぐやる 1 手 | 抽象論ではなく Action 名が出ること |
| **FLOW** | 行動の順序感・時間配分の提案 | 単一 project では 1 ステップに見えることがある（Studio 制約） |
| **DECISIONS** | すでに固定された判断 | 方針の錨。Brief 上で見えること |
| **BLOCKED** | 進行を止めている摩擦 | **open blocker のみ** が本来の対象 |
| **RISKS** | 注意すべき摩擦・未検証・観測不足 | 止まる理由ではなく **警告** |
| **GROWING** | 勢いのある project / シグナル | |
| **DEFERRED** | 今日やらない理由付きの保留 | |

### 4.3 Brief がやらないこと

- 人間の Action を **置き換えない**
- ProjectState を **自動更新しない**
- 最終決定を **下さない**（`requires_human_decision: true`）

### 4.4 Brief 品質の基準（v0.1.1 より）

Brief が「通った」だけでは不十分。**人間が次の作業を始められるか** で判断する。

- TODAY が実行可能な粒度か（例: 「動画テーマを1つ決める」）
- false positive な BLOCKED がないか（risk を blocker 化しない）
- RISKS に assumption が hypothesis として混ざっていないか

### 4.5 Brief Mode Semantics（v0.2.2）

GROUND Studio は `studio-brief --type morning|session|deep-work` で Brief を生成する。  
Brief type は **単なる表示形式ではない**。将来的には、それぞれ **異なる意思決定モード** を持つべきである。

```
morning:    Portfolio 全体を見て、今日どこを触るべきか決める
session:    今進めている流れを切らず、直近 Project の次 Action へ進む
deep-work:  集中価値の高い、重く深い Action を選ぶ
```

**現状の実装との正直な記録:**

現在の実装では、mode 差は **主に表示量・表示セクションの差** として現れている。Portfolio primary 選定そのものには、type は **大きく効いていない**。これはバグではなく、mode の意味が Doctrine 上で十分に固定されていなかったためである。  
今後の実装では、mode ごとの **判断責務** を明確化し、Portfolio Director / Studio / Narrative を type-aware にする必要がある。

検証記録: [GROUND_PORTFOLIO_MODE_SEMANTICS_V0.4.6.md](./GROUND_PORTFOLIO_MODE_SEMANTICS_V0.4.6.md)

#### morning

```
morning = Portfolio 全体の現在地を確認し、今日触るべき主作業を決める Brief
```

含めるべき観点:

- 全 Project を横断して見る
- 未観測 Project を拾う
- 放置・停滞・risk を確認する
- 今日の主作業を決める
- 直近で進めた Project を **必ず続ける必要はない**
- Portfolio 全体の穴を拾うことを **優先してよい**
- research / product / business など **別 Project へ切り替わることも自然**

**v0.4.6 の例:** business を 1 セッション進めた後、mixed portfolio の morning Brief では research が primary になった。これは morning として **説明可能** である。

```
business は一度観測済み。
research / product はまだ未観測。
morning は Portfolio 全体の穴を見るため、research を拾うのは自然。
```

#### session

```
session = 直近または指定された Project の作業文脈を維持し、次 Action へ進む Brief
```

含めるべき観点:

- 作業中の流れを **切らない**
- 直近で進めた Project を **継続する**
- `current_state.primary_next_action_id` を **重視する**
- 直近の observation / decision / patch を **文脈として扱う**
- 人間が「今この Project を進めている」状態を **尊重する**
- Portfolio 全体の穴よりも、**作業継続性を優先する場合がある**

**v0.4.6 の例:** session でも research が primary になった。これは **現状実装としては正しい**（type が primary に効いていないため）が、**session 思想としてはズレがある**。

session brief は、将来的には直近進行 Project または明示指定 Project を **継続しやすくするべき** である。  
ただし、**Human remains owner** の原則により、AI が勝手に継続 Project を **固定してはならない**。Human が別 Project を選ぶ余地は常に残す。

#### deep-work

```
deep-work = 集中価値の高い Action を選び、深く進めるための Brief
```

含めるべき観点:

- **重いが価値のある** Action を選ぶ
- 深い思考・設計・制作・検証に向く作業を優先する
- 単なる「1 件だけ表示」では **不十分**
- `time_box` / effort / dependency / unlock / strategic value などを **考慮する余地がある**
- morning や session と primary が **違ってもよい**
- deep-work は「今すぐ簡単にできること」ではなく、**「集中時間を使う価値があること」** を示すべき

**v0.4.6 の例:** deep-work も morning / session と **同じ primary** になった。現状実装としては記録済みだが、**deep-work 思想としては未分化** である（maxFlow=1 等の truncate のみ）。

#### mode 比較表

| mode | 主目的 | 優先するもの | 優先しないもの |
|------|--------|--------------|----------------|
| **morning** | 全体確認 / 今日の主作業決定 | 未観測、放置、risk、Portfolio 全体 | 直近作業の継続だけ |
| **session** | 作業文脈の継続 | 直近 Project、`current_state` primary、Patch 後の次 Action | 全体最適だけ |
| **deep-work** | 集中作業 | 重い Action、深い設計、unlock 価値 | 軽い確認作業だけ |

#### 望ましい設計方向（実装は次フェーズ）

```
mode name
  ↓
decision context（何を優先するか）
  ↓
selection logic / narrative / display
```

実装は **段階的でよい**。まず Doctrine で判断文脈を固定し、その後 Portfolio Director / Studio / Narrative へ反映する。

---

## 5. ExperimentSeed とは何か

### 5.1 定義

```
ExperimentSeed = まだ ProjectState ではないが、ProjectState に変換可能な実験の種
```

### 5.2 性質

| 性質 | 説明 |
|------|------|
| **不完全でよい** | title + description + kind が最低限 |
| **緩い入力でよい** | 外部入力者に ProjectState 内部構造を強制しない |
| **変換が前提** | seed をそのまま実行しない。adapter が正規形式へ変換する |
| **入口であり本体ではない** | Intake 後は ProjectState が正 |

### 5.3 対応する kind

- `content` — コンテンツ制作実験
- `business` — 事業・ビジネス実験
- `product` — プロダクト実験
- `research` — 調査・研究
- `other` — 上記に当てはまらない実験

### 5.4 Intake adapter の変換規則（v0.1.1 確定）

| Seed フィールド | ProjectState への変換 |
|-----------------|----------------------|
| `goal` | `goals[]` |
| `initial_next_actions` | `next_actions[]`（`depends_on_action_id` でチェーン化） |
| `initial_blockers` | `blockers[]` |
| `initial_hypotheses` | `hypotheses[]` |
| `initial_decisions` | `decisions[]` |
| `risks` | **`extensions.intake.risks`**（blocker にしない） |
| `assumptions` | **`extensions.intake.assumptions`**（hypothesis にしない） |
| `constraints`, `notes`, `target_output` | `extensions.intake` |

---

## 6. Patch とは何か

### 6.1 定義

```
Patch = 人間の Action 結果を ProjectState へ戻すための、確認可能な状態更新案
```

> *Patch is not merely history.*  
> *Patch is not an internal implementation detail.*  
> *Patch is a human-reviewable proposal to update ProjectState.*

Patch は **履歴ログ** ではない。  
Patch は **単なる内部処理** でもない。  
Patch は **ProjectState を変える前に、人間が確認できる状態更新案** である。

Patch が可視化されることで、**Human remains owner** が守られる。

### 6.2 Patch が記録するもの

| 操作 | 例 |
|------|-----|
| action 完了 | `status_change` → `next_action` → `done` |
| decision 追加 | `upsert` → `decision` |
| observation 追加 | `upsert` → `observation` |
| blocker 追加 / 解除 | `upsert` / `status_change` → `blocker` |
| next_action 更新 | `upsert` → `next_action` |
| current_state 更新 | `primary_next_action_id`, `summary`, `phase` 等 |

### 6.3 Patch の性質

1. **Brief を変える** — State が変われば Next Brief も変わる
2. **人間の Action なしでは発生しない** — 自動 Patch 生成は提案止まり（Human Review Bridge 経由）
3. **検証を通る** — `validateStatePatch` + `applyPatch` の invariant チェック必須
4. **apply 前に preview 可能** — completed action、next primary、decision、observation、`current_state` 更新が読めること（Principle 9）
5. **Action 結果・Decision・Observation・CurrentState 更新を明示する** — Patch に書かれていない変更は起きない

### 6.4 v0.1.2 で実証された Patch パターン

`session-01-complete-theme.patch.json` に代表例:

1. 1 番目 `next_action` を `done`
2. テーマ決定を `decision` として追加
3. 現場メモを `observation` として追加
4. `current_state.primary_next_action_id` を 2 番目 action へ更新

**注意**: action 完了だけでは `primary_next_action_id` は自動更新されない。Patch で明示更新が必要。state-engine の暗黙自動更新は **行わない**（v0.1.2 / v0.3 確定）。

### 6.5 v0.3 / v0.3.1 — Session Patch Helper

| 版 | 内容 |
|----|------|
| **v0.3** | `build-complete-action-patch` — Action 完了結果から `StatePatch` を **生成のみ**（保存しない）。apply は既存 `patch` コマンド |
| **v0.3.1** | text preview 改善 — apply 前に operations 内容・next primary・apply コマンドを Human が確認可能 |

望ましい Session フロー:

```
generate patch
  ↓
preview patch
  ↓
human applies patch
  ↓
next brief
```

**採用しない設計（v0.3 時点）:**

- `complete-action` — Action 完了を直接 save する CLI
- state-engine — `status_change` 時の `primary_next_action_id` 暗黙自動更新

便利さより、**状態更新の透明性** を優先する。

---

## 7. 人間と AI の役割分担

### 7.1 Human（人間）

| 役割 | 説明 |
|------|------|
| **Owner** | project の所有者 |
| **Final decision maker** | 最終決定者 |
| **Actor** | 実際に Action を実行する |
| **Taste holder** | 趣味・美学・方向性の保持者 |
| **Risk owner** | リスクを引き受ける |
| **Responsibility holder** | 結果責任を負う |
| **Patch reviewer** | Patch を preview し、状態更新を **承認** する |
| **Meaning judge** | Action 結果の意味・decision の妥当性を判断する |

### 7.2 AI / CLI

| 役割 | 説明 |
|------|------|
| **Structurer** | 非構造入力を ProjectState へ構造化 |
| **Critic** | 矛盾・不足・リスクを指摘 |
| **Proposal generator** | Patch 提案・Brief 生成 |
| **Consistency checker** | 参照整合・schema 検証 |
| **Memory assistant** | State を読み、文脈を補助（記憶の代替ではない） |
| **Brief composer** | State から作戦書を組み立て |
| **Patch proposer** | Patch **案** を生成する（apply しない） |
| **Patch preview formatter** | Patch 内容を読みやすく preview する |
| **Next-action suggester** | 次 eligible action を **提案** する（Director と同じロジック） |

AI / CLI は **勝手に ProjectState を進めない**。生成・preview・提案にとどめる。

### 7.3 境界線

```
AI is not the owner.
AI is not the final decision maker.
AI should not replace human taste, responsibility, or judgment.
```

GROUND において AI は、**人間の意思決定を奪わない**。  
**意思決定可能な構造を作る**。

Human Review Bridge（v0.2.3）もこの原則に従う: 提案は出すが、approved patch になるのは人間の選択後。

---

## 8. GROUND がやらないこと

GROUND は以下 **ではない**。

| 誤解 | 正しい理解 |
|------|------------|
| 雑談チャット | 会話ログを保存するアプリではない |
| 単なるタスク管理 | Todo リストではない。思考・判断・実行の state である |
| 自動生成工場 | コンテンツ・動画・テーマを量産しない |
| 意思決定の外注先 | AI が決める装置ではない |
| AI に全部任せる装置 | Human は Actor かつ Owner のまま |
| 進捗を増やすためだけのツール | done 数ではなく、State の質で前進を測る |
| 思想だけを書いて行動しないノート | Brief → Action → Patch なしでは進んでいない |
| 何でも入れる巨大アプリ | ループに接続しない機能は作らない |

**GROUND は、構造化された現在地から、次の Action へ進むための OS である。**

---

## 9. 実装原則

今後の実装判断は、以下 **10 原則** に従う。

### Principle 1: State first

新機能は **必ず ProjectState にどう影響するか** で判断する。

- UI も API も LLM も、最終的に State を更新するか、State から読むか
- State に接続しない機能は作らない

### Principle 2: Brief must lead to action

Brief は読んで終わりではない。**人間の次の Action に繋がる** 必要がある。

- TODAY が空・抽象・実行不能なら失敗
- Brief 品質は「生成できたか」ではなく「人間が動けるか」で測る

### Principle 3: Human remains owner

AI は提案できる。**最終決定者ではない**。

- `requires_human_decision: true` を維持
- 自動 apply・自動 publish・自動投稿は禁止（明示的な将来設計なし）

### Principle 4: No feature without loop

```
Seed → State → Brief → Action → Patch → Next Brief
```

このループに接続しない機能は **作らない**。

例: scoring / ranking / market / universe だけを復活させても、ループに接続しなければ GROUND ではない。

### Principle 5: Small surface, deep structure

UI や機能を増やす前に、**構造を深くする**。

- CLI でループが回ることを先に証明する（v0.1〜v0.1.2 がその例）
- Web UI は State / Brief / Patch が安定してから

### Principle 6: Extensions before schema changes

必要なメタデータは **まず `extensions` に置く**。schema 変更は最後の手段。

- Experiment Intake の `extensions.intake` が先例
- schema bump は migration・validate・既存 data への影響を伴う

### Principle 7: Do not confuse risk with blocker

| 概念 | 意味 | ProjectState での置き場 |
|------|------|-------------------------|
| **risk** | 注意すべき可能性 | `extensions.intake.risks` 等 |
| **blocker** | 今すぐ進行を妨げる障害 | `blockers[]`（open） |

risk を blocker 化すると、Brief の BLOCKED が false positive になり、project が「詰まっている」ように見える。

### Principle 8: Do not confuse assumption with hypothesis

| 概念 | 意味 | ProjectState での置き場 |
|------|------|-------------------------|
| **assumption** | 前提（まだ問う必要が低い） | `extensions.intake.assumptions` 等 |
| **hypothesis** | 検証対象 | `hypotheses[]`（untested） |

assumption を hypothesis 化すると、Brief の RISKS がノイズになる。

### Principle 9: Patch must be previewable before apply

> *Patch must be human-reviewable before apply.*  
> *State updates must be transparent. AI and CLI must not advance ProjectState implicitly.*

Patch は **適用前に人間が確認できなければならない**。

- GROUND では、**直接保存より preview 可能な Patch 生成を優先** する（v0.3 `build-complete-action-patch`）
- Human が Patch 内容を見て、**納得してから apply** する
- 便利さより、**状態更新の透明性** を優先する
- `complete-action` のような直接保存 CLI は、将来作る場合でも **慎重に扱う**（Human remains owner の弱体化リスク）
- state-engine の **暗黙自動更新**（例: action `done` 時の primary 自動進行）は **避ける**

### Principle 10: Brief mode must change decision context, not only display density

> *Brief type must change decision context, not only display density.*

**日本語:** Brief type は、単なる表示量の違いではなく、**判断文脈の違い** として設計されるべきである。

- `morning` / `session` / `deep-work` は **同じものの短縮版ではない**
- mode ごとに **「何を優先するか」** が違う（§4.5 参照）
- 実装は **段階的でよい** — まず Doctrine で意味を固定し、後から Portfolio Director / Studio / Narrative を type-aware にする
- **現時点では表示差中心** であることを正直に記録する（v0.4.6 検証）
- 将来、`recommend-portfolio --type` や type-aware scoring へ拡張する **余地がある**

---

## 10. 現在の到達点

### v0.1 — Experiment Intake 入口

- `ExperimentSeed` 型・validate・adapter 実装
- `ground-core intake --file` で ProjectState 作成・保存
- `list` / `show` / `studio-brief` まで接続
- 既存 schema / Director / Studio 無改修

### v0.1.1 — Brief 品質検収

- risks → blockers 変換を **やめた**
- assumptions → hypotheses 変換を **やめた**
- `initial_blockers` / `initial_hypotheses` のみ正規 entity 化
- `next_actions` を `depends_on_action_id` でチェーン化
- TODAY に実行可能な最初の一手が出ることを確認

### v0.1.2 — Session Execution Test

- Brief で提示された 1 件目 action を patch で `done`
- decision / observation を State に記録
- `primary_next_action_id` を 2 番目 action へ更新
- Next Brief の TODAY が「視聴者への約束を1行で書く」へ進むことを確認
- **Seed → State → Brief → Action → Patch → Next Brief** ループの実証

### v0.3 — Session Patch Helper

- Action 完了結果から `StatePatch` を生成する `build-complete-action-patch` を追加
- **直接保存しない** — Human 確認ステップを維持
- Action → Patch → Next Brief の摩擦を減らす
- apply は既存 `patch` コマンド。state-engine / Director / Studio 無改修

### v0.3.1 — Patch Preview

- text preview を改善
- apply 前に以下を Human が確認可能:
  - completed action
  - next primary action
  - decision / observation 追加内容
  - `current_state` 更新（`primary_next_action_id`, `summary`）
  - apply コマンド
- Patch が **人間の判断可能な状態更新案** として機能することを確認

### v0.4.6 — Portfolio Mode Semantics 検証

- business / research / product の mixed portfolio で `studio-brief --type morning|session|deep-work` を比較
- **現状:** primary 選定は **全 type で同一**。type 差は主に **表示量・セクション制限**（`getSectionLimits`）として現れる
- morning としては現在の挙動（business 1 セッション後に research primary）を **一部説明できる**
- session / deep-work は思想に対して **未分化** — 継続性・集中価値の選定ロジックは未実装
- `recommend-portfolio` に type 概念は **ない**
- **次フェーズ:** mode ごとの判断責務を実装へ反映する必要がある（Doctrine v0.2.2 で明文化）

### テスト

- ground-core: **258 tests pass**（v0.4.6 時点）

---

## 11. 次の方向性

**まだ実装しない。** 方向性の整理のみ。

次に作るべきものは、派手な自動生成 **ではない**。  
**GROUND のループをより確実に回す補助** である。

| 候補 | 優先度の考え方 |
|------|----------------|
| 複数 seed kind の sample 追加（content / business / research） | 入口の汎用性。schema 変更なし |
| session patch 例の追加（session-02 以降） | ループの反復学習 |
| Brief の observation 抜粋表示 | Studio 拡張が必要。Action 後のフィードバック改善 |
| project progression helper | depends_on チェーン上の可視化 |
| UI | **後回し**。CLI でループが安定してから |
| LLM 自動化 | **さらに後回し**。Human Review + Patch preview 原則を先に固定 |
| `complete-action` 直接保存 CLI | **非推奨**。Principle 9 と Silent state mutation に抵触しやすい |
| Brief mode の type-aware 化 | Doctrine v0.2.2 確定後。session 継続性、deep-work 集中選定、Narrative type 分岐 |

**v0.3 / v0.3.1 で完了:** session patch helper、patch preview  
**v0.4.6 で完了:** mode 比較検証、Doctrine 上の Brief Mode Semantics 明文化（v0.2.2）

---

## 12. 反パターン集（拡張前チェックリスト）

以下に該当する提案は **却下または保留** する。

- [ ] チャット履歴を保存するだけで ProjectState を更新しない
- [ ] Brief を生成するが Patch に繋がらない
- [ ] AI が自動で decision / judgment を確定する
- [ ] risk / assumption を blocker / hypothesis に混同する
- [ ] schema を先に変える（extensions で足りるのに）
- [ ] scoring / ranking / market だけを復活させる（ループ未接続）
- [ ] 動画生成・投稿・自動テーマ生成を GROUND Core に入れる
- [ ] 「とりあえず UI を作る」（State / Brief / Patch が未安定）
- [ ] ProjectState を bypass する独自 state を作る
- [ ] **Silent state mutation** — Patch なし・preview なしで ProjectState を暗黙更新する
- [ ] **Mode as mere formatting** — Brief type を表示件数差だけにし、判断文脈の違いを偽装する

### Anti-pattern: Silent state mutation

**説明:**

- Action 完了時に、裏側で勝手に ProjectState を進める
- Patch に書かれていない変更が暗黙に起きる
- Human が確認しないまま `primary_next_action_id` が変わる
- 状態更新の責任所在が曖昧になる

**なぜ悪いか:**

- **Human remains owner** に反する
- **State first** に反する — 変更が State 上で追えない
- **Patch の意味を弱める** — 更新案としての Patch が形骸化する
- 後から ProjectState の変化理由を追いにくくなる

**望ましい設計:**

```
generate patch
  ↓
preview patch
  ↓
human applies patch
  ↓
next brief
```

### Anti-pattern: Mode as mere formatting

**説明:**

- `morning` / `session` / `deep-work` を、**単なる表示件数や文言差** として扱う
- primary 選定が全 mode で同じなのに、**別の意思決定モードであるかのように見せる**
- session なのに **作業継続性を全く考慮しない**
- deep-work なのに **集中価値を考慮しない**
- mode 名が **人間の期待とズレる**

**なぜ悪いか:**

- Human が Brief の **意味を誤解** する
- mode 指定への **信頼が落ちる**
- GROUND が「それっぽい表示」をしているだけに **見える**
- Doctrine の **State first / Brief must lead to action** に弱くなる

**望ましい設計:**

```
mode name
  ↓
decision context
  ↓
selection logic / narrative / display
```

mode は display density のラベルではなく、**判断文脈の入口** である。実装が追いついていない間も、Doctrine と UI 表示でその差を **正直に明示** する。

---

## 13. 改訂履歴

| 版 | 日付 | 内容 |
|----|------|------|
| v0.2 | 2026-06-20 | Experiment Intake v0.1.2 完了を受け、中核ループ・役割分担・8 原則を明文化 |
| v0.2.1 | 2026-06-20 | Session Patch Helper v0.3 / v0.3.1 を反映。Principle 9（Patch preview）、Silent state mutation 反パターン、Patch 定義強化 |
| v0.2.2 | 2026-06-20 | Brief Mode Semantics 追記（morning / session / deep-work）。Principle 10、Mode as mere formatting 反パターン、v0.4.6 到達点 |

---

*このドキュメントは GROUND の内部憲法である。機能追加の PR・設計 doc は、該当セクションに抵触しないことを確認してから進める。*
