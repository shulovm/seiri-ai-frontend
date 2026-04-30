import { getTodaySmartReview } from "@/lib/sister/saveWeaknessLog";
import { pushLineMessage } from "@/lib/line/client";

export async function POST() {
  const studentLineUserId = String(process.env.STUDENT_LINE_USER_ID || "");
  const appBaseUrl = String(process.env.APP_BASE_URL || "");

  if (!studentLineUserId) {
    return Response.json({ error: "line env is missing" }, { status: 400 });
  }
  const due = getTodaySmartReview(studentLineUserId);
  if (!due.length) return Response.json({ ok: true, sent: false, reason: "no due items" });

  const top = due[0];
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
  return Response.json({ ok: true, sent: true, count: due.length });
}
