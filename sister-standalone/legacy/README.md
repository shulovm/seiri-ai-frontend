# SISTER Asset Vault

このディレクトリは、SISTER構想の資産をGROUND本体から分離して保全するための退避領域です。

## 含まれているもの

- `src/Sister*.jsx`: 生徒向け/保護者向けUI案
- `src/lib/sister*` と `lib/sister/*`: 学習ロジック・分析ロジック
- `api/line/webhook.js` と `src/app/api/line/webhook/route.ts`: LINE webhook実装案
- `src/lib/line/*` と `lib/line/*`: LINE署名検証/クライアント処理
- `docs/*`: SISTER混線時点のスナップショット（文言・画面・設定）

## 目的

1. GROUND本体を壊さずにSISTER案を残す
2. 将来 `sister-app` を単独プロダクトとして再構成できる状態を維持する
3. LINE連携をSISTER側へ寄せるための素材を保存する
