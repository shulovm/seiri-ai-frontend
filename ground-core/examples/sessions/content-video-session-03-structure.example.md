# Session 03 — 60秒構成を作る

> 前提: [Session 02](./content-video-session-02-promise.example.md) 完了後  
> 関連: [README](./README.md)

---

## 目的

3 番目の next action を完了させる。

```
60秒構成を作る
```

---

## 事前確認

```bash
npm run ground-core -- studio-brief --projects <project_id>
```

**期待する TODAY:**

```
60秒構成を作る
```

`<action_id>` は `show` で取得する。

---

## 人間が行った Action 結果

以下の 60 秒構成を作る。

```
0-3秒:
普通の人がジャンプした瞬間、想像以上に高く浮き上がる。

3-10秒:
ナレーション「もし地球の重力が半分になったら、最初に変わるのは歩き方です。」

10-20秒:
街中で人や自転車、車の動きが不安定になる。

20-35秒:
スポーツが別物になる。バスケのダンク、サッカーの浮き球、陸上の跳躍が極端化する。

35-50秒:
建物・海・大気にも影響が出る。人間だけの問題ではないと広げる。

50-60秒:
「便利そうに見えて、世界は一気に不安定になる」で締める。
```

（構成の全文は observation に要約を残す。decision には「構成を決定した」判断を記録する。）

---

## decision

**title:**

```
60秒構成を決定
```

**rationale:**

```
身体変化から始め、都市・スポーツ・環境へ広げることで、短尺でもスケール感を出せるため。
```

---

## observation

**title:**

```
60秒構成メモ
```

**body:**

```
冒頭は科学説明よりも視覚ショックを優先する。後半でスケールを広げると、ただのネタではなく世界変化として見せられる。
```

---

## summary

```
60秒構成を決定。次は冒頭3秒のフックを作る。
```

---

## Patch 生成

```bash
npm run ground-core -- build-complete-action-patch <project_id> \
  --action <action_id> \
  --decision-title "60秒構成を決定" \
  --decision-rationale "身体変化から始め、都市・スポーツ・環境へ広げることで、短尺でもスケール感を出せるため。" \
  --observation-title "60秒構成メモ" \
  --observation-body "冒頭は科学説明よりも視覚ショックを優先する。後半でスケールを広げると、ただのネタではなく世界変化として見せられる。" \
  --summary "60秒構成を決定。次は冒頭3秒のフックを作る。" \
  --out ground-core/storage/session-patches/session-03-structure.patch.json \
  --format text
```

Preview で確認してから apply する。

---

## Patch 適用

```bash
npm run ground-core -- patch <project_id> \
  --file ground-core/storage/session-patches/session-03-structure.patch.json
```

---

## 結果確認

```bash
npm run ground-core -- studio-brief --projects <project_id>
```

**期待する TODAY:**

```
冒頭3秒のフックを作る
```

---

## 次のセッション

sample seed 上の次の action は「冒頭3秒のフックを作る」。  
同じ手順（Brief → Action → build-complete-action-patch → preview → apply → Next Brief）で Session 04 以降を続けられる。
