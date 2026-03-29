# ground.ink を GROUND アプリに向ける手順

ground.ink で「MA」のまま表示される場合、**ground.ink が別のサーバー／古いビルドを向いています**。このリポジトリをデプロイした **同じアプリ** に向けると GROUND になります。

---

## 1. このアプリの URL を確認

- **Railway**: `https://seiri-ai-frontend-production-a2ef.up.railway.app/`
- ここで **GROUND** と表示されていれば、このアプリが正しいビルドです。

---

## 2. ground.ink の DNS をこのアプリに向ける

### Railway 側

1. Railway ダッシュボード → **seiri-ai-frontend** プロジェクト → 対象サービス
2. **Settings** → **Networking** / **Domains**
3. **Custom Domain** で `ground.ink` を追加
4. 表示された **CNAME の値**（例: `xxx.up.railway.app`）をメモ

### DNS 管理側（Cloudflare / お名前.com など）

1. ground.ink の **DNS レコード** を開く
2. ground.ink（ルート）の **CNAME** または **A レコード** を、上記 Railway の CNAME に向ける
3. 保存し、数分〜最大 48 時間待つ（多くは 5〜15 分で反映）

---

## 3. 動作確認

- **https://ground.ink** → GROUND の画面
- **https://ground.ink/ma/** → 同じ GROUND の画面（このリポジトリは / と /ma の両方で配信）

まだ「MA」のときは、ブラウザの **シークレットウィンドウ** または **Ctrl+Shift+R** でハードリロードしてから再度開く。

---

## 4. 接続タイムアウト（ERR_CONNECTION_TIMED_OUT）のとき

「ground.ink の応答に時間がかかりすぎました」と出る場合は、**ground.ink と Railway のつながり**か **DNS** に原因があります。コードでは直せないので、次の順で確認してください。

### 4-1. Railway の URL は開けるか

まず次をブラウザで開く：

- **https://seiri-ai-frontend-production-a2ef.up.railway.app/**
- **https://seiri-ai-frontend-production-a2ef.up.railway.app/api/health**

- **ここが開ける** → アプリは動いている。原因は **ground.ink の DNS か Railway のカスタムドメイン**。
- **ここもタイムアウト** → Railway のサービスが止まっているか、ネット環境の問題。Railway ダッシュボードでデプロイ状態を確認する。

### 4-2. Railway でカスタムドメインの状態を確認

1. Railway → **seiri-ai-frontend** → 対象サービス → **Settings** → **Networking** / **Domains**
2. **ground.ink** が一覧にあり、ステータスが **有効・Verified・Active** などになっているか確認
3. **未検証・エラー** のときは、表示されている **CNAME の値** をコピーし、次の 4-3 のとおり DNS と完全一致しているか見る

### 4-3. DNS の設定を確認

1. ground.ink の **DNS 管理画面**（Cloudflare / お名前.com など）を開く
2. **ground.ink**（ルート、名前が `@` のレコード）を確認：
   - **CNAME** の場合：**値** が Railway で表示されている CNAME と **完全に同じ**か（例: `seiri-ai-frontend-production-a2ef.up.railway.app`）。末尾の `.` の有無はプロバイダによる
   - **A レコード** の場合：Railway が A 用の IP を案内していれば、その IP になっているか
3. **別の A レコードや CNAME** が残っていて、古いサーバーを向いていないか確認（あれば削除するか、正しい向き先に変更）
4. **ルートで CNAME が使えない** プロバイダの場合は、**CNAME フラットニング**（Cloudflare なら「DNS only」ではなく「Proxied」でも可）を使うか、プロバイダの案内どおり **A レコード** で Railway の IP を指定

### 4-4. 反映待ちと再確認

- DNS を変えたあと、**5分〜最大 48 時間**かかることがある
- 別ネットワーク（スマホの回線など）で **https://ground.ink** を開いてみる
- コマンドで確認する場合（PowerShell）:  
  `nslookup ground.ink`  
  → 表示されるアドレスが Railway のホスト名／IP と一致しているか見る

### 4-5. 一時的なつなぎ方（DNS が直るまで）

ground.ink がつながらないあいだは、**Railway の URL をそのまま使う**：

- **https://seiri-ai-frontend-production-a2ef.up.railway.app/**  
- **https://seiri-ai-frontend-production-a2ef.up.railway.app/ma/**

ここなら GROUND アプリを利用できます。

---

## 5. 別サーバーで ground.ink を運用している場合

- ground.ink が **別の VPS / Netlify / Vercel** などを指していると、そこが「MA」のままになります。
- **そのサーバーをやめて、ground.ink の DNS を上記 Railway の URL に向ける**か、
- そのサーバーを **リバースプロキシ** にして、**ground.ink と ground.ink/ma/ のリクエストをすべて**  
  `https://seiri-ai-frontend-production-a2ef.up.railway.app` に転送する設定にすると、GROUND になります。
