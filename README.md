# GROUND（seiri-ai-frontend）

**GROUND**（[ground.ink](https://ground.ink)）— Find your ground. Sort your thoughts.  
「答えを出す」のではなく、思考を整理するチャットUI + APIサーバーです。

**本番**: [https://ground.ink](https://ground.ink)（または [Railway デプロイ URL](https://seiri-ai-frontend-production-a2ef.up.railway.app/)）

**ドメインを開いても空白になる場合**: Railway の **Variables** で `API_ONLY` を削除し、**Settings** → **Build** で **Build Command** を `npm run build` に設定してから再デプロイしてください。詳しくは下記「本番デプロイ（Railway）」を参照。

## 構成

- `server.js`: Express API（Anthropic SDK 経由で整理・判定）
- `src/App.jsx`: チャットUI（React）
- `src/Landing.jsx`: ランディングページ（`/welcome`）

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

**http://localhost:5173/** でアクセスできます（アプリはルート `/` で動作）。

## 本番

1) ビルドしてからサーバーを起動（API とフロントを同じポートで配信）

```bash
npm run prod
```

（内部で `npm run build` → `node server.js`）

2) ブラウザで **http://localhost:3001/** を開く。

- 本番ではフロントは `dist/` をルート `/` で配信し、API は `/api` のままです。
- 本番サーバーを立てる場合は、リバースプロキシ（nginx 等）でこのポートを向けるか、`PORT` を環境変数で指定してください。

## Vercel にデプロイ（フロント + API 両方）

フロント（`/`）と API（`/api`）を Vercel でまとめて公開できます。

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

- 本番アプリ: **https://ground.ink**（または Railway のデプロイ URL）
- API: **https://ground.ink/api/organize** など（同一オリジン）
- ルート `/` がアプリ、`/welcome` がランディングページです。

**API キーが設定されているか確認する:** ブラウザで **https://ground.ink/api/health**（またはデプロイ URL/api/health）を開く。`{"ok":true,"anthropic":"set"}` なら環境変数は入っている。`{"ok":false,"anthropic":"missing"}` なら未設定。接続の確認は実際に短い文を送って返答が返るかで判断できる。

### 5. 注意（Vercel のサーバーレス）

- API は **Serverless Functions** で動きます。セッションはメモリ上のため、リクエストごとに別インスタンスだと会話が続かないことがあります（同じインスタンスに当たると続きます）。
- **Cold start（初回起動）**で、最初の1回だけ数十秒〜1分かかることがあります。タイムアウトした場合は「1〜2分待ってからもう一度送信」を試してください。`vercel.json` の **Cron** で 5 分ごとに `GET /api/history` を呼ぶようにしてあり、同じ関数がウォームに保たれるため、Cold start が起きにくくなります（Vercel Pro では 5 分ごと実行。Hobby プランでは Cron の実行頻度に制限がある場合があります）。
- 会話を確実に残したい場合は、のちに Vercel KV など外部ストアの利用を検討してください。

### 6. 課金・運用の選択肢（任意）

現在は無料の Vercel と Anthropic API の従量課金で運用できます。以下は「より安定させたい」「将来の有料サービスにしたい」場合の案です。

| 選択肢 | 内容 | 想定コスト目安 |
|--------|------|----------------|
| **Vercel Pro** | 関数の最大実行時間を延長（本プロジェクトは 120 秒に設定）。Cold start 後も余裕を持って応答し、Cron で 5 分ごとにウォーム化。 | 月額 $20 前後 |
| **Anthropic API** | 利用量に応じた従量課金のみ。モデルやトークン数で変動。 | 利用量による |
| **将来の有料機能案** | 優先応答・長文対応・法人向けサポート・利用履歴のエクスポートなど | 要設計 |

- 課金ページをアプリ内に設けない場合は、上記はあくまで運用側（Vercel ダッシュボード・Anthropic コンソール）の設定のみで対応できます。
- アプリとして「有料プラン」を提供する場合は、決済（Stripe 等）とプラン別の制限（リクエスト数・文字数など）の実装が必要です。

### 7. 接続タイムアウトの原因と切り分け

「接続がタイムアウトしました」と出る主な原因は次のとおりです。

| 原因 | 説明 | 確認方法 |
|------|------|----------|
| **Cold start** | しばらく使っていないと、API が止まり、最初のリクエストで起動に時間かかることがある。 | ブラウザで **https://ground.ink/api/ping** を開く。すぐ `{"ok":true,...}` が返れば届いている。 |
| **古いフロントがデプロイされたまま** | クライアントの待ち時間が古いままだと、サーバーが応答する前に切れる。 | デプロイ後はブラウザのハードリロード（Ctrl+Shift+R）でキャッシュを捨てる。 |
| **サーバーが 503 を返している** | サーバー側で LLM が時間内に返らず、503 を返している。 | ログで 503 や `request_timeout` が出ていないか確認する。 |
| **関数のクラッシュ** | 未処理の例外でレスポンスが返らない。 | ログでエラーやスタックトレースを確認する。`ANTHROPIC_API_KEY` 未設定でも 500 が返るはず。 |
| **FUNCTION_INVOCATION_TIMEOUT** | 関数の実行が上限を超えて強制終了する。 | サーバー側でタイムアウトを設けている。ログで確認する。 |

**診断の手順**

1. **https://ground.ink/api/ping**（またはデプロイ URL/api/ping）を開く  
   - すぐ `{"ok":true,...}` が返れば API は届いている。  
   - 504 が出る場合は **/api/health** も試す。

2. **最新をデプロイしたか**  
   - デプロイ後、本番 **https://ground.ink** で動作を確認する。

3. **ログ**  
   - Railway のログで 503・500 やエラーが出ていないか見る。

**504 / タイムアウト ベストな改善策（本プロジェクトで実施済み）**

| 対策 | 内容 |
|------|------|
| **Anthropic SDK の遅延読み込み** | `server.js` で SDK をトップレベルで読まず、`/api/organize` 処理時だけ読み込む。`/api/ping` や `/api/history` は SDK を読まないため Cold start が軽くなり、504 が出にくくなる。 |
| **軽量な /api/ping** | `api/ping.js` を Express とは別の単体関数にした。診断用にすぐ `{ ok, t, vercel }` が返る。 |
| **ストリーミング＋受け取り先行** | 応答を「受け取り1文 → 本編を少しずつ」のチャット式で返し、最初のバイトを早く送る。 |
| **Cron でウォーム** | 5 分ごとに `GET /api/history` を呼び、メイン関数を起動したままにしておく。 |
| **ページ表示時のウォーム** | 本番で `/` を開いた瞬間にフロントから `GET /api/history` を1回送る。送信前に API 関数の Cold start を起こしておき、初回送信が速くなりやすい。 |
| **黒線で一度切る** | 応答を「block1（受け取り＋確認＋整形）」と「block2（分かれ道〜）」に分け、block1 を先に返してから block2 をストリーム。前半が早く表示される。 |
| **Fluid Compute（Pro）** | まだ 504 が出る場合: Vercel Pro で **Fluid Compute** を有効にすると、実行時間上限を延長できる。 |

**Vercel 公式のタイムアウト対策（参考）**

- [FUNCTION_INVOCATION_TIMEOUT](https://vercel.com/docs/errors/FUNCTION_INVOCATION_TIMEOUT) … 関数が上限時間内に応答を返す・未処理の例外を防ぐ・上流 API のエラー確認・ログの確認（例: `https://（デプロイURL）/ _logs`）。
- より長い実行が必要な場合: Pro で **Fluid Compute** を有効にすると、関数の最大実行時間を延長できる。

**本番環境**

- 本番は **ground.ink**（Railway 等で 1 本の URL に統一）。
- アプリ: **https://ground.ink**
- API: 同一オリジン（`/api/organize` など）。Cold start 対策のため常時起動を想定しています。

---

## 本番デプロイ（Railway）

本番は **https://ground.ink** で提供しています（Railway にデプロイし、カスタムドメイン ground.ink を向ける想定）。同じリポジトリを Railway にデプロイし、次の設定をします。

### 1. ビルド・起動の設定（必須）

- **Build Command**: `npm run build`  
  - 未設定のままにすると `dist/` が作られず、`/` を開いても空白になります。
- **Start Command**: `node server.js`  
- **Root Directory**: 空のまま

### 2. 環境変数（Railway）

| 名前 | 値 | 必須 |
|------|-----|------|
| `ANTHROPIC_API_KEY` | あなたのキー | ✅ |
| `API_ONLY` | **設定しない**（未設定にするとフロント＋API を同一 URL で配信。`1` にすると API 専用になり `/` は案内ページのみ） | — |
| `CORS_ORIGIN` | 別オリジンから API を呼ぶ場合のみ: `https://seiri-ai-frontend-production-a2ef.up.railway.app` または `https://ground.ink` | 必要に応じて |
| `PORT` | Railway が自動設定 | 任意 |

### 3. ビルドし直して再デプロイする手順

**A. GitHub と Railway を連携している場合**

1. このリポジトリの最新を **push** する。
   ```bash
   git add .
   git commit -m "Update GROUND UI and error handling"
   git push origin main
   ```
2. **Railway** のダッシュボードを開く → 対象プロジェクト → **Deployments**。
3. 新しいコミットが検知されていれば自動でビルドが始まります。始まっていない場合は **Deploy** や **Redeploy** を押す。
4. **Build Command** が `npm run build` になっているか **Settings** → **Build** で確認する。
5. **https://ground.ink/ma/** で配信している場合は、**Variables** に次を追加してから再デプロイする。
   - 名前: `VITE_BASE_PATH`  
   - 値: `/ma/`
   - これでビルド時に `base: '/ma/'` が使われ、タブ・ヘッダーが GROUND になり、アセットのパスも `/ma/` 用になる。

**B. 手動でビルドしてからデプロイする場合**

1. リポジトリのルートで依存関係を入れる。
   ```bash
   cd seiri-ai-frontend
   npm install
   ```
2. ビルドする。
   - **ルート（ground.ink）で配信する場合**
     ```bash
     npm run build
     ```
   - **ground.ink/ma/ で配信する場合**（PowerShell）
     ```powershell
     $env:VITE_BASE_PATH="/ma/"; npm run build
     ```
   - **ground.ink/ma/ で配信する場合**（cmd）
     ```cmd
     set VITE_BASE_PATH=/ma/ && npm run build
     ```
3. できた **`dist/`** を、本番サーバーのルート（または `/ma/`）にアップロードする。
4. サーバー側で、`/` および `/plans`・`/welcome`（または `/ma/`・`/ma/plans`・`/ma/welcome`）で `dist/index.html` が返るようにルーティングする。

**動作確認**

- ブラウザの**ハードリロード**（Ctrl+Shift+R または Cmd+Shift+R）でキャッシュを消してから開く。
- タブ名が **GROUND — ground.ink**、画面の見出しが **GROUND** になっていれば反映済みです。

### 4. 空白になる場合の確認

1. **Variables** に `API_ONLY` が入っていないか確認し、あれば削除する。
2. **Settings** → **Build** で **Build Command** が `npm run build` になっているか確認する。
3. 上記を変更したら **Redeploy** する。

### 5. 動作確認

- **https://ground.ink**（またはデプロイ URL）でチャットが表示されること。
- **https://ground.ink/api/health** で `{"ok":true,"anthropic":"set"}` が返ること。

### 6. ground.ink/ma/ で配信する場合（補足）

アプリを **https://ground.ink/ma/** のようにサブパスで配信する場合は、ビルド時にベースパスを指定してください。

- **Mac / Linux**: `VITE_BASE_PATH=/ma/ npm run build`
- **Windows (PowerShell)**: `$env:VITE_BASE_PATH="/ma/"; npm run build`
- **Windows (cmd)**: `set VITE_BASE_PATH=/ma/ && npm run build`

生成された `dist/` をサーバーの `/ma/` に配置し、`/ma/` および `/ma/plans`・`/ma/welcome` で `index.html` が返るようにルーティングしてください。ビルド後はタブ名・ヘッダーとも **GROUND** で表示されます。

---

## 開発メモ

- `vite.config.js` で `base: '/'`、`/api` を `http://localhost:3001` にプロキシしています（CORSで詰まりにくくするため）。
- フロントは `VITE_API_BASE` があればそれを使い、なければ開発時は `http://localhost:3001` を使います。

## 環境変数（サーバー）

- `ANTHROPIC_API_KEY`（必須）
- `ANTHROPIC_MODEL`（任意）… 整理用モデル（未設定時: claude-sonnet-4-20250514）
- `ANTHROPIC_GATE_MODEL`（任意）… 安全・境界線・確認質問の判定用モデル。Vercel では未設定時は Haiku 4.5（高速）を使用。同じモデルにしたい場合は `ANTHROPIC_MODEL` と同じ値を設定。
- `PORT`（任意、デフォルト `3001`）
- `MAX_INPUT_CHARS`（任意、デフォルト `8000`）
- `SESSION_TTL_MS`（任意、デフォルト 6時間）
- `RATE_LIMIT_MAX`（任意、デフォルト `60`。1分あたりの送信回数上限）
- `CORS_ORIGIN`（API を別オリジンで動かすときは必須。カンマ区切りで許可オリジン。本番: `https://ground.ink` など）
- `API_ONLY`（任意。`1` のときは API ルートのみ起動し、フロントの静的配信を行わない。Railway/Render で API 専用デプロイするときに使う）
