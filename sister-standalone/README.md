# SISTER

SISTER専用の独立学習アプリです。

## ルート

- `/` ダッシュボード
- `/sister` 生徒ページ（学習ログ）
- `/sister/prototype` UIプロトタイプ
- `/sister/understanding` 理解ページ
- `/sister/parent` 保護者ページ
- `/api/line/webhook` LINE Webhook（失敗作側）

## 開発

```bash
npm install
npm run dev
```

## 本番ビルド

```bash
npm run build
npm run start
```

## 環境変数

- `NEXT_PUBLIC_API_BASE`（任意）
  - 既定は空文字（同一オリジンのAPIを利用）
- `LINE_CHANNEL_ACCESS_TOKEN`（Webhook返信で使用）
- `STUDENT_APP_HOST`（本番で student サイトに割り当てるホスト）
- `PARENT_APP_HOST`（本番で parent サイトに割り当てるホスト）
- `ADMIN_APP_HOST`（本番で admin サイトに割り当てるホスト）

## 本番のサイト分離（重要）

`src/middleware.ts` により、ホスト名でアクセス可能な画面を分離します。

- studentホスト: 生徒画面のみ
- parentホスト: 保護者画面のみ
- adminホスト: 管理者ページ

このディレクトリ配下だけで完結しており、ground本体コードには依存しません。

git auto deploy test
