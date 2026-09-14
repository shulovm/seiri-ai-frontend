# Session 02 — 視聴者への約束を1行で書く

> 前提: [Session 01](./content-video-session-01-theme.example.md) 完了後  
> 関連: [README](./README.md)

---

## 目的

2 番目の next action を完了させる。

```
視聴者への約束を1行で書く
```

---

## 事前確認

```bash
npm run ground-core -- studio-brief --projects <project_id>
```

**期待する TODAY:**

```
視聴者への約束を1行で書く
```

`<action_id>` は `show` で `primary_next_action_id` に一致する action を取得する。

---

## 人間が行った Action 結果

```
この動画は、重力が半分になった世界で人間の生活・都市・スポーツがどう変わるかを、60秒で一気に見せる。
```

---

## decision

**title:**

```
視聴者への約束を決定
```

**rationale:**

```
科学説明だけでなく、生活・都市・スポーツの変化を一気に見せる方が、視聴者の期待を作りやすいため。
```

---

## observation

**title:**

```
視聴者への約束メモ
```

**body:**

```
約束は「正確な科学解説」よりも「一瞬で想像できる変化」を前面に出した方が短尺向き。
```

---

## summary

```
視聴者への約束を決定。次は60秒構成を作る。
```

---

## Patch 生成

```bash
npm run ground-core -- build-complete-action-patch <project_id> \
  --action <action_id> \
  --decision-title "視聴者への約束を決定" \
  --decision-rationale "科学説明だけでなく、生活・都市・スポーツの変化を一気に見せる方が、視聴者の期待を作りやすいため。" \
  --observation-title "視聴者への約束メモ" \
  --observation-body "約束は「正確な科学解説」よりも「一瞬で想像できる変化」を前面に出した方が短尺向き。" \
  --summary "視聴者への約束を決定。次は60秒構成を作る。" \
  --out ground-core/storage/session-patches/session-02-promise.patch.json \
  --format text
```

Preview で completed action・next primary・decision・observation・summary・apply command を確認してから apply する。

---

## Patch 適用

```bash
npm run ground-core -- patch <project_id> \
  --file ground-core/storage/session-patches/session-02-promise.patch.json
```

---

## 結果確認

```bash
npm run ground-core -- studio-brief --projects <project_id>
```

**期待する TODAY:**

```
60秒構成を作る
```

---

## 次のセッション

[Session 03 — 60秒構成を作る](./content-video-session-03-structure.example.md)
