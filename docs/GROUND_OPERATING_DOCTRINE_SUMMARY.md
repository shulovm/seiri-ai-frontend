# GROUND Operating Doctrine — Summary

> 本体: [GROUND_OPERATING_DOCTRINE_V0.2.md](./GROUND_OPERATING_DOCTRINE_V0.2.md)（**v0.2.2**）

---

## GROUND とは

**思考・実験・創作の不確実性を、ProjectState と次の Action へ変換する OS。**

- ❌ チャット / タスク管理 / コンテンツ生成工場
- ✅ Seed → State → Brief → Action → Patch（preview）→ Human apply → Next Brief

**Patch は適用前に preview 可能であるべき。**  
GROUND では、CLI/AI が直接状態を進めるより、人間が確認できる `StatePatch` を生成し、Human が apply する流れを優先する。

---

## 中核概念（一行定義）

| 概念 | 定義 |
|------|------|
| **ProjectState** | thought + decision + execution の現在地 |
| **Brief** | State を人間の次 Action へ変換した作戦書 |
| **ExperimentSeed** | 未構造化の実験入口。adapter で State 化 |
| **Patch** | 人間の Action 結果を State へ戻す **確認可能な状態更新案** |
| **Human** | Owner / Actor / 最終決定者 / Patch 承認者 |
| **AI / CLI** | Structurer / Patch 提案・preview（apply しない） |

---

## Brief modes（v0.2.2）

| mode | 役割 |
|------|------|
| **morning** | Portfolio 全体を見て、今日の主作業を決める |
| **session** | 直近 / 指定 Project の作業文脈を続け、次 Action へ進む |
| **deep-work** | 集中価値の高い Action を選び、深く進める |

Mode は **単なる表示量ではなく、判断文脈** であるべき。  
**v0.4.8:** session mode は `--focus-project` と先頭 fallback bonus で Portfolio primary に反映。morning / deep-work は unchanged。  
**v0.4.9:** Session focus は studio-brief 本文（TODAY）でも可視。morning と session で TODAY が違う理由を Human が読める。

詳細: [GROUND_PORTFOLIO_MODE_SEMANTICS_V0.4.6.md](./GROUND_PORTFOLIO_MODE_SEMANTICS_V0.4.6.md), [GROUND_SESSION_FOCUS_PORTFOLIO_V0.4.8.md](./GROUND_SESSION_FOCUS_PORTFOLIO_V0.4.8.md)

---

## 10 原則

1. **State first** — すべて ProjectState への影響で判断
2. **Brief must lead to action** — TODAY が実行可能であること
3. **Human remains owner** — AI / CLI は決定・apply しない
4. **No feature without loop** — ループ未接続機能は作らない
5. **Small surface, deep structure** — UI より構造を先に
6. **Extensions before schema changes** — メタデータは extensions 優先
7. **Do not confuse risk with blocker** — 注意 ≠ 進行障害
8. **Do not confuse assumption with hypothesis** — 前提 ≠ 検証対象
9. **Patch must be previewable before apply** — 暗黙の状態更新禁止。generate → preview → human apply
10. **Brief mode must change decision context, not only display density** — mode は判断文脈の違い。現状は表示差中心を正直に記録し、段階的に type-aware 化する

---

## 到達点（抜粋）

- **v0.1〜v0.1.2**: Intake → Brief → Patch → Next Brief
- **v0.3**: `build-complete-action-patch`（生成のみ、直接保存しない）
- **v0.3.1**: Patch text preview（operations / next primary / apply コマンド確認）
- **v0.4.6**: morning / session / deep-work 比較検証
- **v0.4.8**: session `--focus-project` + input-order fallback bonus（session のみ）
- **v0.4.9**: session focus が studio-brief 本文に表示
- **v0.4.10**: deep-work mode 調査 — primary は morning 同等、表示 truncate のみ
- **v0.4.11**: Intake が action-level intent metadata を `extensions.intake.action_intents` に保存
- **v0.4.12**: deep-work mode が explicit `action_intent` と downstream unlock fallback を小さな explainable focus signal として使用。morning / session selection は未変更
- **v0.4.13**: deep-work が non-primary `deep_work` action を見るべきか調査 — selection は primary のみ維持、後続候補は FLOW NOTES 表示が安全（v0.4.14 候補）
- **v0.4.14**: deep-work mode が non-primary `deep_work` action を FLOW NOTES 候補として表示。primary selection / 依存順序は不変
- **v0.4.15**: mode golden fixtures で morning / session / deep-work の核心挙動を回帰固定

**306 tests pass**

---

## 反パターン（抜粋）

- **Silent state mutation** — Patch なし・preview なしで ProjectState を暗黙更新
- **Mode as mere formatting** — mode を表示件数差だけにし、判断文脈を偽装する

---

## 次に作るもの（方向性のみ）

Brief mode の type-aware 化（**session 完了 v0.4.8–v0.4.9**、**deep-work 完了 v0.4.12–v0.4.14**、**mode golden fixtures v0.4.15**）、session patch 例追加、Brief observation 表示等。  
**Production Run 01:** 最初の本番運用 seed「もしも動画 1本目制作」を追加。Operator Playbook より先に1本を GROUND ループで回す検証。  
`complete-action` 直接保存・state-engine 暗黙更新は非推奨。  
UI・LLM 自動化は後回し。
