import {
  fetchLineImageContent,
  replyLineMessage,
} from "@/lib/line/client";
import { verifyLineSignature } from "@/lib/line/verifySignature";
import { analyzeProblemImage } from "@/lib/sister/analyzeProblemImage";
import { saveLineImage, saveWeaknessLog } from "@/lib/sister/saveWeaknessLog";

function buildStudyRedirectText(input: string): string {
  const text = input.trim();

  if (/だるい|疲れ|しんどい|眠い/.test(text)) {
    return "そういう日もあるね。\n今日は5分だけ、昨日ミスした問題を見よう。";
  }
  if (/暇|ひま/.test(text)) {
    return "少し休むのもあり。\n終わったら、数学1問だけ片づけよう。";
  }
  if (/恋愛|相談/.test(text)) {
    return "それも大事な話だね。\nでも私は勉強担当。\nまず今日の課題を3分で終わらせよう。";
  }
  if (/雑談|話そ|はなそ|チャット/.test(text)) {
    return "少しなら大丈夫。\nその前に、今日の復習を1つ終わらせよう。";
  }

  return "受け取ったよ。\n問題のどこで止まった？\n一言だけでOK。";
}

export async function GET() {
  return Response.json({ ok: true });
}

export async function POST(req: Request) {
  const studentLineUserId = String(process.env.STUDENT_LINE_USER_ID || "");
  const appBaseUrl = String(process.env.APP_BASE_URL || "");

  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-line-signature");
    if (!verifyLineSignature(rawBody, signature)) {
      return Response.json({ error: "invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody || "{}");
    const events = Array.isArray(body?.events) ? body.events : [];
    if (!events.length) {
      return Response.json({ ok: true });
    }

    for (const event of events) {
      const replyToken = event?.replyToken;
      const messageType = event?.message?.type;
      const userId = event?.source?.userId || null;

      if (event?.type === "message" && messageType === "text") {
        const text = event?.message?.text || "";
        console.log("[LINE TEXT RECEIVED]", { userId, text, timestamp: event?.timestamp || null });

        if (replyToken) {
          await replyLineMessage(replyToken, buildStudyRedirectText(text)).catch((err) =>
            console.error("LINE text reply error:", err?.message || err),
          );
        }
      }

      if (event?.type === "message" && messageType === "image") {
        const messageId = event?.message?.id || null;
        console.log("[LINE IMAGE RECEIVED]", { userId, messageId, timestamp: event?.timestamp || null });
        let savedLog: any = null;

        if (messageId) {
          try {
            const imageBuffer = await fetchLineImageContent(messageId);
            console.log("[LINE IMAGE CONTENT FETCHED]", { messageId, sizeBytes: imageBuffer.length });
            const saved = saveLineImage(String(messageId), imageBuffer, "jpg");
            const analysis = await analyzeProblemImage({
              imageBuffer,
              mimeType: "image/jpeg",
              noteText: "",
            });
            const sid = String(userId || studentLineUserId || "");
            savedLog = saveWeaknessLog({
              studentLineUserId: sid,
              parentLineUserId: "",
              messageId: String(messageId),
              imagePath: saved.relativePath,
              analysis,
            });
          } catch (err: any) {
            console.error("LINE image fetch error:", err?.message || err);
          }
        }

        if (replyToken) {
          const understandingUrl =
            savedLog && appBaseUrl
              ? `${appBaseUrl.replace(/\/$/, "")}/sister/understanding?themeId=${savedLog.id}&studentId=${encodeURIComponent(String(savedLog.studentLineUserId || ""))}`
              : "";

          const studentText = savedLog
            ? [
                "写真ありがとう。",
                "分析したよ。",
                "",
                `今日のテーマは「${savedLog.topicName}」`,
                "",
                "サイトで3分だけ確認できるよ。",
                "途中で「こういう時は？」も聞ける。",
                ...(understandingUrl ? ["", "理解ページを開く", understandingUrl] : []),
              ].join("\n")
            : "写真ありがとう。受け取れたよ。あとで一緒に整理しよう。";

          await replyLineMessage(replyToken, studentText).catch((err) =>
            console.error("LINE image reply error:", err?.message || err),
          );
        }
      }
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("LINE webhook error:", error);
    return Response.json({ ok: true, errorHandled: true });
  }
}
