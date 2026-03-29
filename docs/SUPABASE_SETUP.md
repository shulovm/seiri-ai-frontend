# Supabase セットアップ手順（GROUND ユーザー認証用）

メール＋パスワード認証を Supabase Auth で行うための初期設定です。

---

## 1. Supabase プロジェクトを作成

1. **https://supabase.com** にアクセスし、ログイン（GitHub 等で可）。
2. **「New Project」** をクリック。
3. 以下を入力：
   - **Name**: 例）`ground-auth` または `ground-ink`
   - **Database Password**: 強めのパスワードを設定し、**必ずメモ**（後で DB に接続するときに使う）。
   - **Region**: 利用者に近いリージョン（例: Northeast Asia (Tokyo)）。
4. **「Create new project」** をクリックし、数分待つ。

---

## 2. プロジェクトの URL と API キーを取得

1. 左メニュー **「Project Settings」**（歯車アイコン）を開く。
2. **「API」** タブを開く。
3. 次の値をメモ（後で環境変数に設定）：
   - **Project URL**  
     例: `https://xxxxxxxxxxxx.supabase.co`
   - **anon (public) key**  
     「Project API keys」の **anon** の **Reveal** を押してコピー。  
     → フロントエンドで使用（公開してよいキー）。
   - **service_role key**（オプション）  
     **Reveal** でコピー。  
     → サーバー側で管理者用に使う場合のみ。**絶対にフロントに出さない。**

---

## 3. Auth の設定（メール＋パスワード）

1. 左メニュー **「Authentication」** → **「Providers」** を開く。
2. **「Email」** がデフォルトで有効。そのまま使う場合は変更不要。
3. 必要に応じて **「Authentication」** → **「Settings」** で次を確認：
   - **Enable Email Confirmations**:  
     - ON：登録時に確認メール送信（本番では ON 推奨）。  
     - OFF：確認なしで即ログイン可（開発時は OFF でも可）。
   - **Site URL**: 本番では `https://www.ground.ink`（または `https://ground.ink`）に設定。
   - **Redirect URLs**: ログイン後のリダイレクト先を追加。  
     例: `https://www.ground.ink`, `https://www.ground.ink/`, `http://localhost:5173`（開発用）。

---

## 4. メールテンプレート（任意）

1. **「Authentication」** → **「Email Templates」** を開く。
2. **「Confirm signup」** などで、送信されるメールの文面や差出人を編集できる。
3. 本番で独自ドメインのメールを送りたい場合は、**「Project Settings」** → **「Auth」** の **SMTP** 設定で外部 SMTP を設定する（未設定の場合は Supabase のデフォルト送信）。

---

## 5. 環境変数に登録（Railway・ローカル）

取得した値を、**サーバーとフロント**で次のように使います。

### Railway（本番）

1. Railway ダッシュボード → 対象プロジェクト → **「Variables」**。
2. 次を追加：

| 名前 | 値 | 備考 |
|------|-----|------|
| `SUPABASE_URL` | 手順 2 の **Project URL** | 例: `https://xxxxxxxxxxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | 手順 2 の **anon key** | フロントから参照する場合は Vite 用に別名も用意（下記） |
| `SUPABASE_SERVICE_ROLE_KEY` | 手順 2 の **service_role key** | サーバー側でだけ使う場合 |

フロントで Supabase クライアントを直接使う場合、Vite はビルド時に `VITE_` 付きの変数だけ参照できるため、Railway に次も追加することがある：

| 名前 | 値 |
|------|-----|
| `VITE_SUPABASE_URL` | 手順 2 の **Project URL**（同上） |
| `VITE_SUPABASE_ANON_KEY` | 手順 2 の **anon key** |

※ `VITE_` 付きはビルド成果物に含まれるため、anon key のみとし、service_role は絶対に付けない。

### ローカル（.env）

プロジェクトの `.env` に同じキーを書く（コミットしないこと）。

```env
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

`.env.example` に名前だけ書いておくとよい。

```env
# Supabase（認証用）
SUPABASE_URL=
SUPABASE_ANON_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## 6. ここまでの確認

- [ ] Supabase プロジェクトが作成できている。
- [ ] **Project URL** と **anon key** をメモした。
- [ ] **Authentication** → **Providers** で Email が有効。
- [ ] **Redirect URLs** に `https://www.ground.ink` と開発用 URL を追加した。
- [ ] Railway とローカル `.env` に `SUPABASE_URL` とキーを設定した（フロントで使う場合は `VITE_SUPABASE_*` も）。

ここまでできたら、次は「フロントに Supabase クライアントを入れてログイン／登録画面を作る」「server.js で JWT 検証する」という実装に進めます。
