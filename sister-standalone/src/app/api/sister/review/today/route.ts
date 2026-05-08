import { getTodaySmartReview } from "@/lib/sister/saveWeaknessLog";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = String(searchParams.get("studentId") || "");
  const due = getTodaySmartReview(studentId);
  return Response.json({
    ok: true,
    intro: due.length
      ? `今日の復習 5分で終わる。今やると覚えやすい${due.length}件があります。`
      : "今日は短い復習はなし。次のタイミングで案内するね。",
    items: due.map((x) => ({
      id: x.id,
      subject: x.subject,
      topicName: x.topicName,
      reason: x.reviewState?.stabilityScore != null && x.reviewState.stabilityScore < 0.55
        ? "再ミス後の短縮タイミング"
        : "忘れかけタイミング",
      nextAction: `「${x.mistakeHint}」が出る場面を1回だけ確認`,
      nextReviewAt: x.reviewState?.nextReviewAt,
    })),
  });
}
