# Session 01 — テーマを決める

> 対象 project: `intake --file sample.json` で作成した仮説型コンテンツ実験  
> 前提: [README](./README.md)

---

## 目的

最初の next action を完了させる。

```
動画テーマを1つ決める（「もしも◯◯だったら？」形式）
```

---

## 事前確認

```bash
npm run ground-core -- studio-brief --projects <project_id>
```

**期待する TODAY:**

```
動画テーマを1つ決める（「もしも◯◯だったら？」形式）
```

`<action_id>` の取得:

```bash
npm run ground-core -- show <project_id>
```

`current_state.primary_next_action_id` と一致する `next_actions[].id` を使う。

---

## 人間が行った Action 結果

```
最初の動画テーマは「もしも地球の重力が半分になったら」にする
```

---

## decision

**title:**

```
最初の動画テーマは「もしも地球の重力が半分になったら」にする
```

**rationale:**

```
視聴者が一瞬で理解でき、映像化しやすく、60秒構成に向いているため。
```

---

## observation

**title:**

```
動画テーマ決定メモ
```

**body:**

```
このテーマは、ジャンプ・建物・スポーツ・海や大気など複数の視覚的展開を作りやすい。
```

---

## summary（current_state 更新用）

```
動画テーマを決定。次は視聴者への約束を1行で書く。
```

---

## Patch 生成

`<project_id>` と `<action_id>` は **実際の `show` 出力** から取得する。

```bash
npm run ground-core -- build-complete-action-patch <project_id> \
  --action <action_id> \
  --decision-title "最初の動画テーマは「もしも地球の重力が半分になったら」にする" \
  --decision-rationale "視聴者が一瞬で理解でき、映像化しやすく、60秒構成に向いているため。" \
  --observation-title "動画テーマ決定メモ" \
  --observation-body "このテーマは、ジャンプ・建物・スポーツ・海や大気など複数の視覚的展開を作りやすい。" \
  --summary "動画テーマを決定。次は視聴者への約束を1行で書く。" \
  --out ground-core/storage/session-patches/session-01-theme.patch.json \
  --format text
```

### Preview で確認すること

- completed action: `動画テーマを1つ決める（「もしも◯◯だったら？」形式）`
- next primary action: `視聴者への約束を1行で書く`
- decision / observation / summary が上記と一致
- apply コマンドの `project_id` とファイルパス

問題なければ apply する。

---

## Patch 適用

```bash
npm run ground-core -- patch <project_id> \
  --file ground-core/storage/session-patches/session-01-theme.patch.json
```

---

## 結果確認

```bash
npm run ground-core -- studio-brief --projects <project_id>
```

**期待する TODAY:**

```
視聴者への約束を1行で書く
```

---

## 次のセッション

[Session 02 — 視聴者への約束を1行で書く](./content-video-session-02-promise.example.md)
