# 整理AI（seiri-ai-frontend）

「答えを出す」のではなく、入力を壊さずに整えるためのチャットUI + APIサーバーです。

## 構成

- `server.js`: Express API（Anthropic SDK 経由で整理・判定）
- `src/App.jsx`: チャットUI（React）

## セットアップ

1) 依存関係をインストール

```bash
npm install
```

2) 環境変数を作成

- `.env.example` を参考に `.env` を作ってください。
- **`ANTHROPIC_API_KEY` は秘密情報です。誤って貼り付け・共有した場合はキーを再発行（ローテーション）してください。**

3) サーバー起動（別ターミナル）

```bash
npm run server
```

起動ログに `http://localhost:3001` が出ればOKです。

4) フロント起動（別ターミナル）

```bash
npm run dev
```

**http://localhost:5173/ma/** でアクセスできます（URL は MA 用に `/ma` で公開）。

## 本番

1) ビルドしてからサーバーを起動（API とフロントを同じポートで配信）

```bash
npm run prod
```

（内部で `npm run build` → `node server.js`）

2) ブラウザで **http://localhost:3001/ma/** を開く。

- 本番ではフロントは `dist/` を `/ma` で配信し、API は `/api` のままです。
- 本番サーバーを立てる場合は、リバースプロキシ（nginx 等）でこのポートを向けるか、`PORT` を環境変数で指定してください。

## Vercel にデプロイ（フロント + API 両方）

フロント（`/ma`）と API（`/api`）を Vercel でまとめて公開できます。

### 1. 前提

- [Vercel](https://vercel.com) のアカウント
- プロジェクトを Git で管理（GitHub / GitLab / Bitbucket のいずれかと連携）

### 2. 環境変数を Vercel に登録

Vercel のダッシュボードでプロジェクトを開き、**Settings → Environment Variables** で次を追加します。

| 名前 | 値 | 備考 |
|------|-----|------|
| `ANTHROPIC_API_KEY` | あなたのキー | 必須 |

必要なら `ANTHROPIC_MODEL` や `MAX_INPUT_CHARS` なども追加できます。

### 3. デプロイ手順

**A. Vercel にリポジトリをインポートする場合**

1. [vercel.com](https://vercel.com) にログイン
2. **Add New… → Project** で、このリポジトリをインポート
3. **Framework Preset** はそのまま（Vercel が `vercel.json` を読む）
4. **Build Command**: `npm run build`（`vercel.json` で指定済みならそのまま）
5. **Output Directory**: `dist`（同上）
6. 上記の環境変数を設定して **Deploy**

**B. Vercel CLI でデプロイする場合**

```bash
npm i -g vercel
cd /path/to/seiri-ai-frontend
vercel
```

初回はログインとプロジェクト作成の質問に答えます。環境変数は `vercel env add ANTHROPIC_API_KEY` で追加するか、ダッシュボードで設定します。

### 4. デプロイ後の URL

- フロント: **https://（あなたのドメイン）/ma/**
- API: **https://（あなたのドメイン）/api/organize** など
- ルート `/` にアクセスすると `/ma/` にリダイレクトされます。

**API キーが設定されているか確認する:** ブラウザで **https://（あなたのドメイン）/api/health** を開く。`{"ok":true,"anthropic":"set"}` なら環境変数は入っている。`{"ok":false,"anthropic":"missing"}` なら未設定。接続の確認は実際に短い文を送って返答が返るかで判断できる。

### 5. 注意（Vercel のサーバーレス）

- API は **Serverless Functions** で動きます。セッションはメモリ上のため、リクエストごとに別インスタンスだと会話が続かないことがあります（同じインスタンスに当たると続きます）。
- 会話を確実に残したい場合は、のちに Vercel KV など外部ストアの利用を検討してください。

---

## 開発メモ

- `vite.config.js` で `/api` を `http://localhost:3001` にプロキシしています（CORSで詰まりにくくするため）。
- フロントは `VITE_API_BASE` があればそれを使い、なければ開発時は `http://localhost:3001` を使います。

## 環境変数（サーバー）

- `ANTHROPIC_API_KEY`（必須）
- `ANTHROPIC_MODEL`（任意）… 整理用モデル（未設定時: claude-sonnet-4-20250514）
- `ANTHROPIC_GATE_MODEL`（任意）… 安全・境界線・確認質問の判定用モデル。Vercel では未設定時は Haiku 4.5（高速）を使用。同じモデルにしたい場合は `ANTHROPIC_MODEL` と同じ値を設定。
- `PORT`（任意、デフォルト `3001`）
- `MAX_INPUT_CHARS`（任意、デフォルト `8000`）
- `SESSION_TTL_MS`（任意、デフォルト 6時間）
- `CORS_ORIGIN`（任意、カンマ区切りで許可オリジン）
