import { markReviewAttempt } from "@/lib/sister/saveWeaknessLog";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const logId = String(body?.logId || "");
  const isCorrect = Boolean(body?.isCorrect);
  const answerTimeSec = body?.answerTimeSec == null ? null : Number(body.answerTimeSec);
  const missCause = body?.missCause ? String(body.missCause) : null;

  if (!logId) return Response.json({ error: "logId is required" }, { status: 400 });
  const updated = markReviewAttempt({ logId, isCorrect, answerTimeSec, missCause });
  if (!updated) return Response.json({ error: "review item not found" }, { status: 404 });

  return Response.json({
    ok: true,
    nextReviewAt: updated.reviewState?.nextReviewAt,
    streakCorrect: updated.reviewState?.streakCorrect || 0,
    stabilityScore: updated.reviewState?.stabilityScore || 0,
  });
}
