# GROUND Mode Golden Fixtures v0.4.15

**実装日:** 2026-06-21  
**目的:** `morning / session / deep-work` の代表挙動を golden fixture で固定し、今後の変更で mode 判断文脈が壊れたときに回帰検知する。  
**性質:** 新機能なし — **fixture + regression test + docs** のみ。

---

## 1. なぜ golden fixtures が必要か

v0.4.8〜v0.4.14 で mode 周りの signal が増えた:

- `session_focus` / `deep_work_focus`
- `deep_work_candidate` FLOW NOTES
- `mode_context_note`
- BLOCKED / FLOW NOTES 分離
- RISKS diversity

Narrative や FLOW priority を触る前に、**現状正しい判断文脈** をテストで固定する。

---

## 2. 固定した mode 挙動

| Case | mode | primary | mode note |
|------|------|---------|-----------|
| 1 | morning | research — 関連分野を5つに分類する | なし |
| 2 | session + focus business | business — 配布する対象物と数量を決める | explicit +0.03 |
| 3 | session fallback | business — 配布… | fallback +0.02 |
| 4 | session order | research — 関連分野…（research 先頭時） | fallback +0.02 |
| 5 | deep-work | research — 関連分野… | deep_work +0.03 |
| 6 | deep-work FLOW | product deep_work_candidate | visibility only |
| 7 | morning/session | — | deep_work_candidate なし |
| 8 | BLOCKED | (none) | flow note 非混入 |
| 9 | RISKS | 2 projects observation_gap 集約 + untested_hypothesis | diversity |

---

## 3. fixture 構成

`ground-core/__tests__/fixtures/mode-golden-fixtures.ts`

| Project | 状態 |
|---------|------|
| **business** | session-01 完了（`buildCompleteActionPatch`）。primary = 配布する対象物と数量を決める。observation あり。 |
| **research** | fresh intake。primary = 関連分野を5つに分類する。intent = deep_work。 |
| **product** | fresh intake。primary = 想定ユーザーを1人に絞る。index 4 = deep_work 後続候補。 |

入力順デフォルト: `[business, research, product]`

---

## 4. テスト方針

**固定する:**

- primary project / action title
- `mode_context_note` の有無・種別
- `deep_work_candidate` の有無
- BLOCKED 誤混入なし
- RISKS diversity 最低条件

**固定しない:**

- headline / summary_story 全文
- score 小数完全一致
- 自然言語の細部文体

全文 snapshot は使わず **部分一致** 中心。

---

## 5. テストファイル

`ground-core/__tests__/mode-golden-fixtures.test.ts` — `Mode Golden Fixtures v0.4.15`（9 tests）

```
ℹ tests 306 | pass 306
```

---

## 6. 今後このテストが守るもの

- Principle 10: mode は判断文脈を変える（表示密度だけではない）
- State first: product deep_work を primary に飛び級させない
- session focus = Human 文脈 signal（explicit / input-order fallback）
- deep-work = primary deep_work bonus + 後続候補 visibility

---

## 7. 改訂履歴

| 版 | 日付 | 内容 |
|----|------|------|
| v0.4.15 | 2026-06-21 | mode golden fixtures + regression tests |
