# GROUND Deep Work Candidate Flow Notes v0.4.14

**実装日:** 2026-06-21  
**目的:** deep-work mode のみ、non-primary `deep_work` action を FLOW NOTES に後続候補として表示する。**selection は変更しない。**  
**前提:** [GROUND_DEEP_WORK_ELIGIBILITY_AUDIT_V0.4.13.md](./GROUND_DEEP_WORK_ELIGIBILITY_AUDIT_V0.4.13.md)

---

## 1. v0.4.13 との関係

| 版 | 役割 |
|----|------|
| v0.4.12 | primary `deep_work` → Portfolio +0.03 |
| v0.4.13 | non-primary `deep_work` は primary 化せず FLOW NOTES 候補が安全と結論 |
| **v0.4.14** | 上記 visibility を実装 |

---

## 2. なぜ primary selection には使わないか

- State first: `primary_next_action_id` と Brief の矛盾を避ける
- 線形依存チェーンの飛び級を防ぐ（product index 4 は index 0–3 完了後）
- Brief must lead to action: TODAY は「今やるべき」、候補は「後続にある」

---

## 3. deep_work_candidate FLOW NOTE 設計

### 検出条件

`extensions.intake.action_intents` から:

- `intent === "deep_work"`
- `action_id !== current_state.primary_next_action_id`
- action `status` が `done` / `cancelled` でない

### 表示

- `note_kind`: `deep_work_candidate`
- `reason_summary`: `後続に deep-work 候補「{title}」があります`
- dependency 未解放でも表示可（「今やれる」とは書かない）

### モード

| mode | 表示 |
|------|------|
| morning | なし |
| session | なし |
| deep-work | あり（`maxFlowNotes: 3`） |

### 実装

- `collectNonPrimaryDeepWorkCandidateNotes()` — `brief-formatters.ts`
- `mapFlowNoteItems(..., { briefType, projectStates })` — deep-work 時にマージ
- `BriefRendererInput.project_states` — pipeline から Renderer へ渡す

---

## 4. product sample

| index | Action | intent | FLOW NOTE |
|-------|--------|--------|-----------|
| 0 | 想定ユーザーを1人に絞る | decision | TODAY primary（不変） |
| 4 | 1画面フローを文章で描く | deep_work | **deep_work_candidate** |

---

## 5. mixed portfolio

```
TODAY: research — 関連分野を5つに分類する
       deep-work focus (+0.03)

FLOW NOTES:
  product (deep_work_candidate) — 後続に deep-work 候補「1画面フローを文章で描く」があります
```

research primary は維持。product は primary にならない。

---

## 6. morning / session に出さない理由

Doctrine: deep-work は集中価値の判断文脈。後続 deep_work 候補は deep-work 専用の visibility。

---

## 7. tests

`studio-brief-deep-work-candidates.test.ts`（6 tests）

```
ℹ tests 297 | pass 297
```

---

## 8. 残課題

| 課題 | 内容 |
|------|------|
| 同一 project 複数 deep_work | 現状 1 件のみ（先頭） |
| bottleneck unlock と併記 | maxFlowNotes=3 で共存 |
| eligible 後の自然切替 | index 4 が primary になれば +0.03 が自動適用（v0.4.12） |

---

## 9. v0.4.15 mode golden fixtures

代表挙動の回帰固定。詳細: [GROUND_MODE_GOLDEN_FIXTURES_V0.4.15.md](./GROUND_MODE_GOLDEN_FIXTURES_V0.4.15.md)

---

## 10. 改訂履歴

| 版 | 日付 | 内容 |
|----|------|------|
| v0.4.14 | 2026-06-21 | deep_work_candidate FLOW NOTES 実装 |
| v0.4.15 | 2026-06-21 | mode golden fixtures 回帰テスト |
