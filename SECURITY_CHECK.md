# 安全確認チェックリスト（ground.ink / www.ground.ink）

## コード側で問題ない点

- **API キー**: `ANTHROPIC_API_KEY` はサーバー（Railway）の環境変数のみ。フロントや HTML には一切出さない。
- **/api/health**: キーの有無だけ返し（`"set"` / `"missing"`）、キー本体は返さない。
- **エラー表示**: サーバーエラー時に `key` / `secret` / `password` を含むメッセージはクライアントに返さない処理あり。
- **CORS**: `CORS_ORIGIN` を設定している場合、許可したオリジンだけ API を呼べる。

## ブラウザで確認すること（https://www.ground.ink）

1. **HTTPS になっているか**
   - アドレスバーが `https://www.ground.ink` で、鍵マーク（または「接続は安全」）が出ているか。

2. **証明書**
   - 鍵マークをクリック → 「証明書」や「接続は安全」の詳細を開く。
   - 発行先が Railway または Let's Encrypt 等で、`*.ground.ink` または `www.ground.ink` をカバーしているか。
   - 有効期限切れでないか。

3. **混在コンテンツ**
   - ページ内で `http://` のスクリプトや画像が読み込まれていないか（ブラウザの開発者ツール → Console に「Mixed Content」などの警告が出ていないか）。

4. **API の向き先**
   - 本番では `VITE_API_BASE` を空にしていれば、API は同じオリジン（https://www.ground.ink/api/...）に飛ぶ。別ドメインに API を飛ばしていないか（環境変数設定の確認）。

## 運用で気をつけること

- **環境変数**: Railway の Variables に `ANTHROPIC_API_KEY` を入れている場合、ダッシュボードの共有やスクショで見えないようにする。
- **キー漏れ**: キーを誤ってコミット・貼り付けした場合は、Anthropic でキーをローテーション（再発行）する。

## まとめ

- コード上は API キーをクライアントに渡していない。
- **https://www.ground.ink** で鍵マークと証明書が妥当なら、通信は暗号化され、一般的な運用として「安全な状態」と言える。
