/**
 * 軽量ヘルスチェック（server.js を読まないのでタイムアウトしない）
 * GET /api/health で環境変数 ANTHROPIC_API_KEY の有無だけ返す
 */
export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false });
  }
  const hasKey = Boolean(
    process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.length > 10
  );
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({
    ok: hasKey,
    anthropic: hasKey ? "set" : "missing",
  });
}
