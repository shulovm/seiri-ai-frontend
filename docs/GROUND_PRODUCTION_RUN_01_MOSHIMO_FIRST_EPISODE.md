# GROUND Production Run 01 — Moshimo First Episode Seed v0.1.0

**作成日:** 2026-06-21  
**位置づけ:** GROUND Core 既存のまま / **Production Run 01** / 最初の本番運用 Project Seed  
**Seed:** `ground-core/examples/experiment-seeds/moshimo-first-episode.v0.1.0.json`

---

## 1. 目的

「もしも動画」シリーズ第1本目を、GROUND Core の既存ループだけで完成まで運ぶ。

```txt
ExperimentSeed → ProjectState → studio-brief → Action
→ build-complete-action-patch → Patch preview → Human apply → Next Brief
```

もしも専用システム（DB / UI / API / Lab / ランキング）は作らない。

---

## 2. なぜ Operator Playbook より先に実運用 Project か

Playbook は「回した後」に強い。Production Run 01 は、**1本の動画を実際に GROUND 上で走らせる**ことで、Operator が触るべき粒度・観測の戻し方・session/deep-work の使い分けを具体化する。

---

## 3. GROUND の最初の本番運用 Project としての位置づけ

| 項目 | 値 |
|------|-----|
| GROUND Core 版 | 既存（v0.5.x 系 Studio/Brief 含む） |
| Production Run | Run 01 |
| Project title | もしも動画 1本目制作 |
| kind | content |
| 成功条件 | 60秒動画1本完成 + 観測を GROUND へ戻す |

---

## 4. seed 構成

- **description（現在地）:** テーマ未決定。まず「もしも〇〇だったら？」を1つ決める。制作ループ検証も目的。
- **11 Action** 線形チェーン（depends_on 自動）
- **action_intents** 全11件（deep_work × 3: index 2, 4, 6）
- **assumptions / risks / hypotheses** 分離（blockers には変換しない）

---

## 5. next_actions 一覧

| # | Action |
|---|--------|
| 0 | 第1本目のテーマを1つ決める |
| 1 | 視聴者への約束を1行で書く |
| 2 | 60秒構成を作る |
| 3 | 冒頭3秒のフックを作る |
| 4 | 6〜8カットに分解する |
| 5 | 各カットの映像内容を決める |
| 6 | ナレーション台本を書く |
| 7 | 生成素材の方針を決める |
| 8 | 編集順序を決める |
| 9 | 1本目を完成させる |
| 10 | 完成後の観測項目を記録する |

---

## 6. action_intents 一覧

| index | intent | 備考 |
|-------|--------|------|
| 0 | decision | テーマ決定 |
| 1 | design | 約束文 |
| 2 | **deep_work** | 60秒構成 |
| 3 | design | フック |
| 4 | **deep_work** | カット分解 |
| 5 | design | 映像内容 |
| 6 | **deep_work** | 台本 |
| 7 | execution | 素材方針 |
| 8 | design | 編集順序 |
| 9 | execution | 完成 |
| 10 | validation | 観測記録 |

---

## 7. session / deep-work で期待する挙動

### session（単独 project）

```txt
TODAY: 第1本目のテーマを1つ決める
```

### deep-work（単独 project）

- primary は index 0（decision）のため **deep_work_focus (+0.03) は付かない**（想定内）
- FLOW NOTES に後続 **deep_work_candidate**（例: 60秒構成を作る）が表示される

---

## 8. やらないこと

- もしも専用 DB / UI / API
- Theme Market / Universe / ランキング
- LLM 大量ネタ生成 / 動画自動生成 / 編集ツール統合

---

## 9. 1本完成までの運用手順

```bash
# 1. Intake
npm run ground-core -- intake --file ground-core/examples/experiment-seeds/moshimo-first-episode.v0.1.0.json

# 2. Session brief（今やること）
npm run ground-core -- studio-brief --projects <project_id> --type session

# 3. Action 完了（preview のみ）
npm run ground-core -- build-complete-action-patch <project_id> --action <action_id> --format json

# 4. Human が patch を確認・apply 後、次 brief
npm run ground-core -- studio-brief --projects <project_id> --type session

# 5. 構成・台本など集中作業時は deep-work
npm run ground-core -- studio-brief --projects <project_id> --type deep-work
```

Action 10 完了後、観測項目を GROUND の observation / decision として残し、Run 02 へ。

---

## 10. 次の候補（未実装）

- Production Run 01 実走ログ（session-01, session-02…）
- Operator Playbook（1本完成後）
- Run 02: 2本目 seed / テンプレート化

---

## 11. 改訂履歴

| 版 | 日付 | 内容 |
|----|------|------|
| v0.1.0 | 2026-06-21 | 初回 production seed |
