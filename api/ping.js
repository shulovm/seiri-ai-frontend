/**
 * 軽量 ping（Express を読まないので Cold start が軽い）
 * GET /api/ping で即 { ok, t, vercel } を返す。診断・ウォーム用。
 */
export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false });
  }
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({
    ok: true,
    t: Date.now(),
    vercel: process.env.VERCEL === "1",
  });
}
