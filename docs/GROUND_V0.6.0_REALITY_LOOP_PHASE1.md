# GROUND v0.6.0 — Reality Loop Phase 1

## 目的

GROUND を「開発しているシステム」から「実際のプロジェクト運営に使うシステム」へ移行する最小ループ。

```
現実の出来事
  → GroundEvent
  → Patch Proposal
  → Human Apply
  → ProjectState 更新
  → Director / Portfolio / Studio / Narrative 再評価
  → studio-brief 更新
```

## 不変条件

| 原則 | 意味 |
|------|------|
| observation ≠ state mutation | Event / Proposal だけでは ProjectState を変えない |
| 3 段階分離 | Event → Patch Proposal → 明示 apply |
| mutation は既存機構のみ | `applyPatch` + `saveProject` を再利用。別 mutation 層は作らない |
| Studio は read-only | Director / Portfolio / Studio / Narrative は読み取り専用のまま |

## 処理経路

```
1. show / list                     … 現状の ProjectState を見る
2. reality-propose                 … 自然文 → GroundEvent + PatchProposal（state 不変）
3. proposal JSON を人が確認
4. reality-apply --proposal        … 明示 apply（このときだけ write）
5. studio-brief / recommend*       … 更新後 state を読んで再評価
```

内部:

| Stage | 関数 | 副作用 |
|-------|------|--------|
| Propose | `proposeFromReality` → 既存 `runPropose` | なし |
| Apply | `applyRealityProposal` → 既存 `applyPatch` / `saveProject` | ProjectState 更新 |

## CLI

```bash
# 1. 現状確認
npm run ground-core -- show <project_id>
npm run ground-core -- list

# 2. Event → Proposal（state は変わらない）
npm run ground-core -- reality-propose <project_id> \
  --text "配布場所、新宿中央公園に決めた" \
  --source field_test \
  --out proposal.json

# 3. Proposal を確認
# proposal.json の result.proposed_patch / dry_run_result を読む

# 4. 明示 apply
npm run ground-core -- reality-apply <project_id> --proposal proposal.json

# 5. 再評価
npm run ground-core -- studio-brief --projects <id1>,<id2>,<id3>
```

`--proposal` は次のいずれかを受け付ける:

- `PatchProposal` JSON
- `RealityProposeResult` JSON（`reality-propose --out` の出力）

ClarificationResponse は apply できない。

## GroundEvent

```typescript
interface GroundEvent {
  schema_version: "0.6.0";
  id: string;
  project_id: string;
  source: "manual" | "field_test" | "conversation" | "system";
  occurred_at: string;
  input_text: string;
  title: string;
  summary: string;
  created_at: string;
}
```

GroundEvent 自体は永続化しない（Phase 1）。Proposal と一緒に `--out` に載せる。

## Dogfood 対象

| Project | 今回 |
|---------|------|
| GROUND | 対象 |
| Free Water | 対象 |
| もしも工場 | 対象 |
| 会社関連 | 対象外（登記完了後に GROUND へ） |

## Phase 1 であえて実装しないもの

- LLM 自動更新
- 自動 save / 自動 apply
- Event store / Kafka / CQRS
- 外部 API 連携
- PostgreSQL / DB 再設計
- GroundEvent 永続ストレージ
- Web UI / Router
- 会社関連プロジェクト投入

## ファイル

```
ground-core/reality/types.ts
ground-core/reality/propose.ts
ground-core/reality/apply.ts
ground-core/__tests__/reality-loop.test.ts
ground-core/cli.ts          … reality-propose / reality-apply
ground-core/index.ts        … export
```

## 既存との関係

| 既存 | Reality Loop での扱い |
|------|----------------------|
| `propose` | `reality-propose` が内部で再利用（薄いラッパ） |
| `patch` | 引き続き使える。Reality Loop の明示 apply は `reality-apply` |
| `studio-brief` | apply 後の再評価にそのまま使う |
| Director / Studio / Narrative | 変更なし・read-only |

## Phase 2 前の dogfood 確認点

1. FreeWater / GROUND / もしも工場で、1 週間手動 Reality Loop を回す
2. Proposal の観察が実運用の粒度に合っているか
3. Clarification が出たときの人間手順が破綻しないか
4. apply 後に studio-brief が「現場の変化」を文章として拾えているか
5. 会社関連を入れるタイミングと Storage 運用ルール
