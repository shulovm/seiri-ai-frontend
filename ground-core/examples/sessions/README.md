# GROUND Session Examples

> GROUND の **Session loop** を、実運用例として示すディレクトリです。  
> 関連: [GROUND Operating Doctrine v0.2.1](../../../docs/GROUND_OPERATING_DOCTRINE_V0.2.md)

---

## 1. このディレクトリの目的

- GROUND が **1 セッションずつ** どう前に進むかを、読み物として示す
- **Action → Patch preview → Human apply → Next Brief** の流れを具体例で説明する
- 完成済み patch JSON のコピペ集 **ではない** — `build-complete-action-patch` を使った **運用ガイド**

### なぜ直接保存しないか（Doctrine v0.2.1）

| 原則 | 意味 |
|------|------|
| **Human remains owner** | 状態更新の最終承認は人間 |
| **Patch must be previewable before apply** | apply 前に Patch 内容を確認する |
| **Silent state mutation を避ける** | 裏側で勝手に ProjectState を進めない |
| **透明性 > 便利さ** | `complete-action` 的な直接保存より、preview 可能な Patch 生成を優先 |

---

## 2. 前提コマンド

```bash
# プロジェクト作成（初回のみ）
npm run ground-core -- intake --file ground-core/examples/experiment-seeds/sample.json

# 現在地確認（action_id / current_state を取得）
npm run ground-core -- show <project_id>

# 今日の一手
npm run ground-core -- studio-brief --projects <project_id>

# Patch 生成（保存しない / --out で保存）
npm run ground-core -- build-complete-action-patch <project_id> --action <action_id> ...

# Human が apply
npm run ground-core -- patch <project_id> --file <patch.json>
```

---

## 3. 基本ループ

```
Brief
  ↓
Action（人間が実際に作業）
  ↓
build-complete-action-patch（StatePatch 生成）
  ↓
Preview（text または JSON で確認）
  ↓
Human apply（patch コマンド）
  ↓
Next Brief（TODAY が次の action へ）
```

---

## 4. セッション例一覧

| ファイル | セッション | 完了する action | apply 後の TODAY |
|----------|------------|-----------------|------------------|
| [content-video-session-01-theme.example.md](./content-video-session-01-theme.example.md) | Session 01 | 動画テーマを1つ決める | 視聴者への約束を1行で書く |
| [content-video-session-02-promise.example.md](./content-video-session-02-promise.example.md) | Session 02 | 視聴者への約束を1行で書く | 60秒構成を作る |
| [content-video-session-03-structure.example.md](./content-video-session-03-structure.example.md) | Session 03 | 60秒構成を作る | 冒頭3秒のフックを作る |

**推奨順序:** 01 → 02 → 03（sample seed の `depends_on_action_id` チェーンに沿う）

---

## 5. 各セッションの進め方

1. `intake` で project を作る（または既存 project を使う）
2. `studio-brief` で TODAY を確認
3. `show` で **primary next action の `action_id`** を取得
4. 人間が Action を実行（テーマ決定、約束を書く、構成を作る、等）
5. `build-complete-action-patch` で Patch を生成
6. **Preview を確認**（下記「patch preview の確認観点」）
7. 問題なければ `patch --file` で apply
8. `studio-brief` で TODAY が次に進んだことを確認
9. 次のセッション example へ

---

## 6. patch preview の確認観点

`--format text` の preview で、apply 前に以下を確認する。

| 観点 | 問い |
|------|------|
| **completed action** | 今完了した action は正しいか |
| **next primary action** | 次に進む action は自然か（Director と整合しているか） |
| **decision title / rationale** | 意図した判断が記録されるか |
| **observation** | 後で見返せるメモになっているか |
| **summary** | 現在地を正しく表しているか |
| **apply command** | `project_id` と patch ファイルパスは正しいか |

preview に問題があれば **apply しない**。Patch を修正するか、コマンド引数を見直して再生成する。

---

## 7. 注意点

- **`action_id` は project ごとに異なる** — `show` の `next_actions` から毎回取得する
- **patch ファイルは生成してから確認する** — リポジトリ内の固定 patch をそのまま当てはめない
- **`--out <path>`** — patch JSON を保存し、preview に apply コマンドが表示される
- **`--format json`** — 機械処理・パイプ用。純粋な patch JSON のみ
- **`--format text`** — 人間確認用。operations 詳細 + apply 案内
- **patch 保存先** — 例では `ground-core/storage/session-patches/`（gitignore 対象の storage 配下）。任意のパスで可

---

## 8. 関連ファイル

```
ground-core/examples/experiment-seeds/sample.json     … Intake 用 seed
ground-core/examples/patch-templates/                 … 手動 patch 学習用 template
ground-core/examples/experiment-seeds/session-01-complete-theme.patch.json
  … v0.1.2 時代の固定 UUID 例（参考。実運用では build-complete-action-patch を推奨）
```
