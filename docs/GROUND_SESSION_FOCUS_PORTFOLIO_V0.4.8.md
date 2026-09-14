# GROUND Session Focus Portfolio v0.4.8 — session-aware 最小実装

**実装日:** 2026-06-20  
**目的:** Doctrine v0.2.2 / v0.4.7 設計に沿い、`--type session` のみ Portfolio primary 選定に Human 明示の作業文脈を反映する。  
**前提:** [GROUND_SESSION_AWARE_PORTFOLIO_V0.4.7.md](./GROUND_SESSION_AWARE_PORTFOLIO_V0.4.7.md)

---

## 1. Doctrine v0.2.2 / v0.4.7 との関係

- **Principle 10:** Brief type は display density だけでなく decision context の違い
- **v0.4.7 結論:** 案 B（`--focus-project`）+ 案 A（先頭 fallback）のハイブリッド
- **v0.4.8:** session mode の Portfolio Director にのみ focus bonus を実装

---

## 2. 実装方針

| レイヤ | 変更 |
|--------|------|
| `portfolio-types.ts` | `PortfolioBriefType`, `session_focus` reason kind, `PortfolioDirectorOptions` 拡張 |
| `portfolio-director.ts` | session focus bonus (+0.03 explicit / +0.02 fallback), ranking に反映 |
| `studio-brief.ts` | pipeline → Director へ `options` 配線 |
| `cli.ts` | `--focus-project`, `--type` on `recommend-portfolio`, validation / warning |

**触っていない:** morning / deep-work scoring、Studio renderer、Narrative、schema

---

## 3. `--focus-project` の意味

```bash
npm run ground-core -- studio-brief \
  --projects <business>,<research>,<product> \
  --type session \
  --focus-project <business_id>
```

- Human が「この Project の作業文脈で session に入る」と **明示** する signal
- AI が勝手に Project を固定 **しない**
- `--projects` 内に存在しない ID は **エラー**
- `--type session` 以外で指定 → **warning**（bonus 適用なし）

---

## 4. session focus bonus 設計

| 条件 | bonus | reason |
|------|-------|--------|
| `--type session` + `--focus-project` + eligible | **+0.03** | `session focus: explicit focus project (+0.03)` |
| `--type session` + focus 未指定 + 複数 Project + 先頭 eligible | **+0.02** | `session focus: first project fallback (+0.02)` |
| 単体 Project session | 0 | bonus 不要（既に primary） |
| focus project ineligible | 0 | `session focus project は eligible ではないため bonus なし` |
| morning / deep-work | 0 | mode ガード |

- **強制 primary ではない** — blocked / ineligible では bonus 無効
- effective score = `cross_project_score + sessionFocusBonus`（ranking / primary / JSON score に反映）

---

## 5. morning を変えない理由

- `brief_type !== "session"` では `applySessionFocus` が no-op
- v0.4.6 mixed portfolio（business session-01 後）で morning primary は **research のまま**
- observation_gap / urgency 優先の Portfolio 穴拾いを維持

---

## 6. deep-work をまだ触らない理由

- v0.4.7 スコープ外。集中 Action 選定は別フェーズ
- `brief_type === "deep-work"` では bonus なし → morning と同一 primary

---

## 7. mixed portfolio — 修正前 / 修正後

**状態:** business session-01 完了 / research・product 新規（v0.4.6 同条件）

| コマンド | v0.4.6（修正前） | v0.4.8（修正後） |
|----------|------------------|------------------|
| `--type morning` | research | **research**（不变） |
| `--type session --focus-project business` | research | **business** ✅ |
| `--type session`（business 先頭） | research | **business** ✅ |
| `--type session`（research 先頭） | research | **research**（fallback 先頭） |
| `--type deep-work` | research | **research**（不变） |

**business が primary になる理由（session + focus）:**

```
base cross_project_score: business 0.66, research 0.66
urgency tie-break: research 0.41 > business 0.40 → morning では research
session explicit bonus: business +0.03 → effective 0.69 > 0.66
```

---

## 8. CLI

```bash
# studio-brief
npm run ground-core -- studio-brief \
  --projects <business>,<research>,<product> \
  --type session \
  --focus-project <business_id>

# recommend-portfolio（primary JSON デバッグ）
npm run ground-core -- recommend-portfolio \
  --projects <business>,<research>,<product> \
  --type session \
  --focus-project <business_id> \
  --format json
```

---

## 9. tests

`ground-core/__tests__/portfolio-director.test.ts` — `Session focus portfolio v0.4.8`:

1. morning → research primary（patched mixed）
2. session explicit focus → business + session_focus reason
3. session fallback business first → business
4. session reorder research first → research
5. unknown focus-project → error
6. deep-work → same as morning
7. CLI recommend-portfolio session + focus

```
ℹ tests 266 | pass 266
```

---

## 10. 残課題

| 課題 | 内容 |
|------|------|
| Narrative headline | session 以外は type 非依存（v0.4.9 で session のみ最小修正） |
| Brief TODAY reason | **v0.4.9 で解決** — [GROUND_TYPE_AWARE_BRIEF_NARRATIVE_V0.4.9.md](./GROUND_TYPE_AWARE_BRIEF_NARRATIVE_V0.4.9.md) |
| deep-work type-aware | v0.5.0+ |
| bonus 校正 | より極端な score 差での fixture 追加 |
| Doctrine Summary | v0.4.8 追記済み |

---

## 11. 改訂履歴

| 版 | 日付 | 内容 |
|----|------|------|
| v0.4.8 | 2026-06-20 | session focus bonus + `--focus-project` CLI |
