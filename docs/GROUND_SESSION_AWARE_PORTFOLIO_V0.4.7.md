# GROUND Session-Aware Portfolio v0.4.7 — 調査＋最小設計

**検証日:** 2026-06-20  
**目的:** session mode を session-aware にするための調査・最小設計。  
**実装:** v0.4.8 で [GROUND_SESSION_FOCUS_PORTFOLIO_V0.4.8.md](./GROUND_SESSION_FOCUS_PORTFOLIO_V0.4.8.md) に従い実装済み。

関連: [GROUND_OPERATING_DOCTRINE_V0.2.md](./GROUND_OPERATING_DOCTRINE_V0.2.md), [GROUND_PORTFOLIO_MODE_SEMANTICS_V0.4.6.md](./GROUND_PORTFOLIO_MODE_SEMANTICS_V0.4.6.md), [GROUND_SESSION_FOCUS_PORTFOLIO_V0.4.8.md](./GROUND_SESSION_FOCUS_PORTFOLIO_V0.4.8.md)

---

## 1. Doctrine v0.2.2 との関係

Doctrine v0.2.2 は以下を固定した。

| mode | 判断文脈 |
|------|----------|
| **morning** | Portfolio 全体を見て、今日の主作業を決める |
| **session** | 直近または指定 Project の作業文脈を維持し、次 Action へ進む |
| **deep-work** | 集中価値の高い Action を選び、深く進める |

**Principle 10:** Brief type は display density だけでなく **decision context** の違いであるべき。

**Anti-pattern:** Mode as mere formatting — primary が全 mode 同一なのに別モードに見せる。

v0.4.7 は、上記 Doctrine に沿って **session だけ** を session-aware にする最小設計を定義する。morning の Portfolio 穴拾いは **壊さない**。deep-work は **今回大きく触らない**。

---

## 2. `--type session` の実装経路

### 2.1 データフロー（現状）

```
CLI parseBriefType(args)                    ← --type session をパース
  ↓
cmdStudioBrief()
  ↓
runStudioBriefPipeline({ project_states, brief_type })   ← brief_type はここまで
  ├─ ruleDirector.recommend() × N          ← brief_type 未使用
  ├─ rulePortfolioDirector.recommendPortfolio()  ← brief_type 未使用 ★
  ├─ ruleStudio.analyze()                  ← brief_type 未使用
  ├─ ruleNarrative.build()                 ← brief_type 未使用
  ├─ adaptToBriefRendererReport()          ← brief_type 未使用
  └─ renderStudioBrief({ report, brief_type })  ← ★ ここで初めて使用
       └─ getSectionLimits("session")      ← セクション件数・有無・maxFlow
```

`recommend-portfolio`（CLI `cmdRecommendPortfolio`）は **brief_type を一切受け取らない**。常に `rulePortfolioDirector.recommendPortfolio({ project_states, director_reports })` のみ。

### 2.2 止まっている地点

| レイヤ | brief_type | primary への影響 |
|--------|------------|------------------|
| `cli.ts` | パース・渡す | なし |
| `studio-brief.ts` pipeline | 保持 | **Portfolio / Studio / Narrative には渡さない** |
| `portfolio-director.ts` | なし | **primary 選定の唯一ソース** |
| `rule-studio.ts` | なし | portfolio_report を読むのみ |
| `narrative-builder.ts` | なし | studio_report のみ |
| `brief-renderer.ts` | 使用 | **表示 truncate のみ**（TODAY は portfolio_primary 固定） |

`brief-renderer.ts` は `assertPrimaryAlignment` で **portfolio_primary と today_focus の一致を強制** する。Renderer が primary を変えることは設計上禁止。

### 2.3 session で実際に変わるもの（v0.4.6 再確認）

`getSectionLimits("session")`（`brief-formatters.ts`）:

| 設定 | morning | session |
|------|---------|---------|
| maxFlow | null | 2 |
| maxRisks | 3 | 2 |
| includeDecisions / Growing / Blocked / FlowNotes | true | false |
| filterFlowTimeBoxes | — | session, now（0 件時はフォールバックで全件） |

**headline:** `brief-formatters.buildHeadline(session, …)` は「次の 2 時間: …」だが、CLI 出力は `applyNarrativePresentation` で **Narrative headline に上書き** され type 非依存。

**結論:** session primary が morning と同じなのは、**Portfolio Director が type を知らない** ため。表示件数差のみは Principle 10 / Anti-pattern Mode as mere formatting に該当。

---

## 3. `recommend-portfolio` の type 問題

### 3.1 現状

```bash
npm run ground-core -- recommend-portfolio --projects <ids> --format json
```

- `--type` フラグ **なし**
- `PortfolioInput` に `brief_type` フィールド **なし**
- primary_recommendation は studio-brief と **常に同一**（同一 scoring パス）

### 3.2 将来設計の検討（今回は実装しない）

| 方針 | メリット | デメリット |
|------|----------|------------|
| **A. studio-brief 内だけ type-aware** | 変更面が Studio pipeline に閉じる | recommend-portfolio JSON と Brief が乖離する |
| **B. recommend-portfolio にも `--type`** | Director 出力と Brief の primary が一致。デバッグしやすい | CLI / PortfolioInput 拡張が必要 |
| **C. Portfolio Director に mode context を渡し、両 CLI が共有** | 一貫性が最高 | v0.4.8 の本命。Director + CLI 両方 |

**推奨（v0.4.8）:** **C + B**。Portfolio Director を type-aware にしたうえで、`studio-brief` と `recommend-portfolio` の **両方** に `--type session` と `--focus-project` を載せる。JSON デバッグと Human 向け Brief の primary が一致する。

---

## 4. v0.4.6 mixed portfolio 再現

### 4.1 Project 状態

| kind | project_id | state |
|------|------------|-------|
| business | `69b63f4d-09ab-4de0-90a5-f379cb2cfde8` | session-01 完了。observation + decision。次 = 配布する対象物と数量を決める。momentum 0.35 |
| research | `0f82b4de-4565-4fb4-90c2-d107a223275f` | 新規。observation なし。momentum 0.25 |
| product | `48719641-4f2f-4157-819c-2534db9e7e8e` | 新規。observation なし。momentum 0.25 |

### 4.2 検証コマンド結果

| コマンド | TODAY |
|----------|-------|
| `--type morning --projects business,research,product` | research — 関連分野を5つに分類する |
| `--type session --projects business,research,product` | **同左（research）** |
| `--type session --projects research,business,product` | **同左（research）** — 入力順変更でも primary 不変 |
| `--type session --projects business` | business — 配布する対象物と数量を決める ✅ |
| `--type session --projects research` | research — 関連分野を5つに分類する ✅ |

### 4.3 なぜ入力順を変えても session が変わらないか

`portfolio-director.ts` の `comparePortfolioRank`:

1. `cross_project_score` 降順（3 Project とも **0.66 同点**）
2. `urgency_score` 降順（research/product **0.41**, business **0.40**）
3. `input_order` 昇順（**urgency 同点のときのみ** 効く）

business は urgency で research/product より低いため、**先頭に置いても rank 1 にならない**。  
research を先頭にしても research が rank 1 — **入力順 tie-break は urgency 同点群の中でのみ作用**。

v0.4.2 で入力順 tie-break を導入したが、それは **morning 向けの同点解消** であり、session focus signal ではない。

### 4.4 単体 session は自然

1 Project のみ渡すと Portfolio Director はその Project を primary にする。**session 思想と整合**。  
横断 session の問題は **複数 Project + type が Director に届かない** 組み合わせに限定される。

---

## 5. session 継続性の候補 signal 比較

### A. `--projects` 先頭を session focus とみなす

| 観点 | 評価 |
|------|------|
| Human remains owner | ◎ 人間が CLI で意図を示せる |
| 実装コスト | 小（session 時のみ bonus / tie-break） |
| v0.4.6  mixed で効くか | **△ 現状の tie-break だけでは不十分**（business は urgency で負ける） |
| morning への漏れ | session mode ガード必須 |
| 意味の整理 | morning も入力順 tie-break 使用。**session 専用 bonus** として区別する必要あり |

**v0.4.8 向け:** 先頭 focus は **軽い cross_project 加点**（例: +0.02〜0.05、reason `session_focus_input_order`）として session のみ適用。tie-break だけに頼らない。

---

### B. 直近更新 Project（`updated_at` / patch 時刻）

| 観点 | 評価 |
|------|------|
| session 思想との距離 | ◎ 直前に触った Project を続けやすい |
| Human remains owner | **△〜✗** AI が「続けるべき」を **推測** する |
| 実装 | `project.updated_at` は patch apply で更新済み。追加 storage 不要 |
| リスク | intake 直後の更新、無意味な touch でも updated_at が動く |
| morning | session ガード必須。morning では **使わない** |

**v0.4.8 向け:** 単独 primary signal としては **非推奨**。`--focus-project` 未指定時の **弱い fallback** に留めるなら可（明示 opt-out 可能に）。

---

### C. momentum / recent observation を session bonus

| 観点 | 評価 |
|------|------|
| 既存 signal | momentum は既に `cross_project_score` に 0.1 倍で混入 |
| v0.4.6 | business momentum 最高だが primary は research（urgency が勝る） |
| morning への漏れ | **全 mode 加点は morning を壊す** — 絶対禁止 |
| 意味 | momentum = 進行中シグナルだが、morning では「観測済み business」より「未観測 research」を拾うのが自然 |

**v0.4.8 向け:** session 専用の **追加** momentum bonus は、Doctrine 上 **第三候補以下**。理由を narrative に出せないと Mode as mere formatting になる。

---

### D. 明示 `--focus-project`

| 観点 | 評価 |
|------|------|
| Human remains owner | **◎ 最も Doctrine に合う** |
| 意味の明確さ | session = 「この Project の文脈」が CLI で固定可能 |
| 実装 | CLI + PortfolioInput + Director。schema 変更不要 |
| UX | やや重いが、AI の推測より信頼できる |
| 強制 primary | **非推奨** — eligible / blocker がある場合は reason 付きで override または警告 |

**v0.4.8 向け:** **第一候補**。

```bash
npm run ground-core -- studio-brief \
  --projects <business>,<research>,<product> \
  --type session \
  --focus-project <business_id>
```

---

### E. session は単体 Project 推奨（横断 session は未実装）

| 観点 | 評価 |
|------|------|
| 実装 | **最小**（docs / help のみ） |
| 現状 | 単体 session は既に自然 |
| 欠点 | 横断 session の Mode as mere formatting **が残る** |
| Doctrine | session 定義は「横断も可」と読める — **運用推奨だけでは Principle 10 未達** |

**v0.4.8 向け:** **第三候補 / 暫定運用**。実装前の過渡期として docs に書くのは可。最終解ではない。

---

## 6. 案 A〜E の評価（v0.4.8 実装候補）

| 案 | 概要 | 評価 | v0.4.8 |
|----|------|------|--------|
| **A** | session のみ `--projects` 先頭に軽い focus bonus | ◎ 小さく効く。Human が順序で意図表示 | **第二候補**（focus 未指定時 fallback） |
| **B** | `--focus-project` 明示 | ◎ Doctrine 最適。説明可能 | **第一候補** |
| **C** | 単体 session 推奨のみ | △ 実装ゼロだが問題残存 | 暫定 docs のみ |
| **D** | momentum / recent observation | △ morning 破壊リスク | **非推奨**（単独では） |
| **E** | まだ実装しない | — | **今回 v0.4.7 は E**。v0.4.8 で B+A 実装 |

---

## 7. 推奨する v0.4.8 実装案（最小・安全）

### 7.1 スコープ

```txt
対象: session mode のみ
触らない: morning 既存 scoring、deep-work
```

### 7.2 変更点（設計のみ — 今回未実装）

#### Step 1: PortfolioInput 拡張

```typescript
interface PortfolioDirectorOptions {
  brief_type?: "morning" | "session" | "deep-work";
  session_focus_project_id?: string;  // --focus-project
}
```

- `brief_type !== "session"` のとき `session_focus_project_id` は **無視**
- morning / deep-work では **既存 scoring 100% 維持**

#### Step 2: session scoring（session のみ）

focus project が `--projects` 内に存在し、eligible な場合:

| 条件 | 処理 |
|------|------|
| `--focus-project` 指定 | cross_project に **小さな bonus**（例 +0.03）+ reason `session_focus_explicit` |
| focus 未指定 & projects.length > 1 | 先頭 project に **より小さい bonus**（例 +0.02）+ reason `session_focus_input_order` |
| focus が blocked / ineligible | bonus なし。Brief に **理由付き** で morning 同等 primary へフォールバック |
| focus 未指定 & projects.length === 1 | bonus 不要（現状どおり） |

**強制 primary 禁止:** bonus は urgency 0.01 差程度を覆える程度に設計。blocker や no_eligible では勝てない。

#### Step 3: pipeline 配線

```txt
runStudioBriefPipeline
  → rulePortfolioDirector.recommendPortfolio({ ..., options: { brief_type, session_focus_project_id } })
```

#### Step 4: CLI

```txt
studio-brief --type session [--focus-project <id>]
recommend-portfolio --type session [--focus-project <id>]   # 将来同期
```

#### Step 5: Narrative / reason

- session 時は `session_focus_*` reason を TODAY / why_not に表示
- morning では従来 reason のみ

### 7.3 v0.4.6 mixed で期待される挙動（設計上）

```bash
--type session --projects business,research,product --focus-project business
→ TODAY: business — 配布する対象物と数量を決める
  reason: session_focus_explicit (+ observation/decision 文脈は Studio 側 DECISIONS truncate とは別に summary で)

--type morning --projects business,research,product
→ TODAY: research（変更なし）
```

---

## 8. 今回コード変更しなかった理由

- 依頼範囲は **調査＋設計のみ**
- scoring / Director / Studio / CLI 変更は v0.4.8 に委ねる
- 設計を Doctrine v0.2.2 と v0.4.6 実測に照らして固定してから実装する

---

## 9. 残課題

| 課題 | 内容 |
|------|------|
| bonus 量の校正 | +0.02〜0.05 で business が research を上回るか。テスト fixture で検証 |
| focus 未指定のデフォルト | 先頭 bonus のみ vs 単体 session 推奨メッセージ |
| deep-work | v0.4.9 以降。session 完了後に type-aware 化 |
| Narrative type-aware | headline 上書き問題（v0.4.6）。session 実装時に合わせて修正候補 |
| `recommend-portfolio --type` | studio-brief と primary 一致のため v0.4.8 で同時追加推奨 |
| updated_at fallback | focus 未指定時のみ弱く使うか — v0.4.8 では **見送り**（Human owner 優先） |
| Doctrine 運用 | session 横断利用時は `--focus-project` 推奨を Summary に追記（v0.4.8 前でも可） |

---

## 10. テスト

```
npm run test:ground-core
ℹ tests 258 | pass 258 | fail 0
```

コード変更なし。既存 GROUND 本体への影響なし。

---

## 11. 改訂履歴

| 版 | 日付 | 内容 |
|----|------|------|
| v0.4.7 | 2026-06-20 | session 経路調査、signal 比較、v0.4.8 最小設計（B+A） |
