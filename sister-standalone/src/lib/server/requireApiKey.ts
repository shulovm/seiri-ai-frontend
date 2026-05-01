export function requireApiKey(req: Request): Response | null {
  const expected = String(process.env.INTERNAL_API_KEY || "");
  if (!expected) {
    return Response.json({ error: "INTERNAL_API_KEY is missing" }, { status: 500 });
  }

  const actual = req.headers.get("x-api-key") || "";
  if (actual !== expected) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}
