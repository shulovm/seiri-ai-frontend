import { loadWeaknessLogs } from "@/lib/sister/saveWeaknessLog";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = String(searchParams.get("studentId") || "").trim();

  if (!studentId) {
    return Response.json({ ok: true, items: [] });
  }

  const logs = loadWeaknessLogs()
    .filter((x) => x.studentLineUserId === studentId)
    .filter((x) => x.source === "line-image");

  const items = logs.map((row) => ({
    id: row.id,
    createdAt: row.createdAt,
    subject: row.subject,
    unit: row.unit,
    topic: row.topic,
    mistakeHint: row.mistakeHint,
    confidenceScore: row.confidenceScore,
    originalMessageId: row.originalMessageId,
    source: row.source,
  }));

  return Response.json({ ok: true, items });
}
