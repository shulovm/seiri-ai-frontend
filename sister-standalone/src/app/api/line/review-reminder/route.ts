import {
  getTodaySmartReview,
  hasSentReviewReminderToday,
  markReviewReminderSentToday,
} from "@/lib/sister/saveWeaknessLog";
import { pushLineMessage } from "@/lib/line/client";
import { requireApiKey } from "@/lib/server/requireApiKey";

export async function POST(req: Request) {
  const unauthorized = requireApiKey(req);
  if (unauthorized) return unauthorized;

  const studentLineUserId = String(process.env.STUDENT_LINE_USER_ID || "");
  const appBaseUrl = String(process.env.APP_BASE_URL || "");

  if (!studentLineUserId) {
    return Response.json({ error: "STUDENT_LINE_USER_ID is missing" }, { status: 400 });
  }
  if (hasSentReviewReminderToday(studentLineUserId)) {
    return Response.json({ ok: true, sent: false, reason: "already sent today" });
  }
  const due = getTodaySmartReview(studentLineUserId);
  const top = due[0] || {
    id: "dummy-review-item",
    topicName: "テスト用ダミー復習",
  };
  const qs = new URLSearchParams({ themeId: top.id, studentId: studentLineUserId });
  const url = appBaseUrl ? `${appBaseUrl.replace(/\/$/, "")}/sister/understanding?${qs.toString()}` : "";
  const text = [
    "今日の5分復習タイミングです。",
    "",
    `前に間違えた「${top.topicName}」`,
    "今やると定着しやすい時間です。",
    "",
    url ? `[復習する]\n${url}` : "理解ページを開いて復習しよう。",
  ].join("\n");

  await pushLineMessage(studentLineUserId, text);
  markReviewReminderSentToday(studentLineUserId);
  return Response.json({
    ok: true,
    sent: true,
    count: due.length || 1,
    forcedDummy: due.length === 0,
  });
}
