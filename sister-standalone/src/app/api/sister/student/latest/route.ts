import { loadWeaknessLogs } from "@/lib/sister/saveWeaknessLog";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = String(searchParams.get("studentId") || "").trim();

  if (!studentId) {
    return Response.json({ ok: true, hasData: false, latest: null });
  }

  const logs = loadWeaknessLogs().filter((x) => x.studentLineUserId === studentId);
  const row = logs[0];
  if (!row) {
    return Response.json({ ok: true, hasData: false, latest: null });
  }

  return Response.json({
    ok: true,
    hasData: true,
    latest: {
      id: row.id,
      subject: row.subject,
      topicName: row.topicName,
      mistakeHint: row.mistakeHint,
      confidenceScore: row.confidenceScore,
    },
  });
}
