import { after } from "next/server";
import { fetchLineImageContent, pushLineMessage, replyLineMessage } from "@/lib/line/client";
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

type ParsedLineEvent = {
  webhookEventId: string | null;
  isRedelivery: boolean;
  eventType: string;
  messageType: string | null;
  replyToken: string | null;
  userId: string | null;
  text: string;
  messageId: string | null;
  timestamp: number | null;
};

type RuntimeConfig = {
  studentLineUserId: string;
  appBaseUrl: string;
  debugBody: boolean;
};

const IDEMPOTENCY_TTL_MS = 10 * 60 * 1000;
const processedEventIds = new Map<string, number>();

function isDuplicateEvent(eventId: string | null): boolean {
  if (!eventId) return false;
  const now = Date.now();
  const seenAt = processedEventIds.get(eventId);
  if (seenAt && now - seenAt < IDEMPOTENCY_TTL_MS) return true;
  processedEventIds.set(eventId, now);
  for (const [id, ts] of processedEventIds) {
    if (now - ts >= IDEMPOTENCY_TTL_MS) processedEventIds.delete(id);
  }
  return false;
}

function buildRuntimeConfig(): RuntimeConfig {
  return {
    studentLineUserId: String(process.env.STUDENT_LINE_USER_ID || ""),
    appBaseUrl: String(process.env.APP_BASE_URL || ""),
    debugBody: String(process.env.LINE_DEBUG_BODY || "") === "1",
  };
}

function parseEvent(event: any): ParsedLineEvent {
  return {
    webhookEventId: event?.webhookEventId || null,
    isRedelivery: Boolean(event?.deliveryContext?.isRedelivery),
    eventType: String(event?.type || ""),
    messageType: event?.message?.type || null,
    replyToken: event?.replyToken || null,
    userId: event?.source?.userId || null,
    text: String(event?.message?.text || ""),
    messageId: event?.message?.id || null,
    timestamp: event?.timestamp || null,
  };
}

function logEventMeta(event: ParsedLineEvent) {
  const maskedUserId = event.userId ? `${event.userId.slice(0, 4)}***` : null;
  console.log("LINE EVENT META:", {
    webhookEventId: event.webhookEventId,
    isRedelivery: event.isRedelivery,
    eventType: event.eventType,
    userId: maskedUserId,
    messageType: event.messageType,
  });
}

async function safeReply(replyToken: string | null, text: string, label: string): Promise<void> {
  if (!replyToken) return;
  try {
    await replyLineMessage(replyToken, text);
  } catch (err: any) {
    console.error(`${label}:`, err?.message || err);
  }
}

async function handleText(event: ParsedLineEvent): Promise<void> {
  if (event.eventType !== "message" || event.messageType !== "text") return;
  await safeReply(event.replyToken, buildStudyRedirectText(event.text), "LINE text reply error");
}

async function handleImage(event: ParsedLineEvent, config: RuntimeConfig): Promise<void> {
  if (event.eventType !== "message" || event.messageType !== "image") return;

  await safeReply(
    event.replyToken,
    "写真ありがとう。確認して、苦手ポイントを整理してるよ。",
    "LINE image immediate reply error",
  );

  if (!event.messageId) return;
  const sid = String(event.userId || config.studentLineUserId || "");
  if (!sid) return;

  try {
    const imageBuffer = await fetchLineImageContent(event.messageId);
    const saved = saveLineImage(String(event.messageId), imageBuffer, "jpg");
    const analysis = await analyzeProblemImage({
      imageBuffer,
      mimeType: "image/jpeg",
      noteText: "",
    });

    const savedLog = saveWeaknessLog({
      studentLineUserId: sid,
      parentLineUserId: "",
      messageId: String(event.messageId),
      messageType: "image",
      imageId: String(event.messageId),
      timestamp: Number(event.timestamp || Date.now()),
      imagePath: saved.relativePath,
      analysis,
    });

    const understandingUrl =
      savedLog && config.appBaseUrl
        ? `${config.appBaseUrl.replace(/\/$/, "")}/sister/understanding?themeId=${savedLog.id}&studentId=${encodeURIComponent(String(savedLog.studentLineUserId || ""))}`
        : "";

    const followupText = [
      "解析が終わったよ。",
      `今日のテーマは「${savedLog.topicName}」`,
      "3分だけ確認しよう。",
      ...(understandingUrl ? ["", "理解ページを開く", understandingUrl] : []),
    ].join("\n");

    await pushLineMessage(sid, followupText);
  } catch (err: any) {
    console.error("LINE image process error:", err?.message || err);
    await pushLineMessage(sid, "ごめん、画像解析でエラーが出た。もう一度送ってみて。").catch((pushErr: any) =>
      console.error("LINE image error push failed:", pushErr?.message || pushErr),
    );
  }
}

async function processEvents(events: any[], config: RuntimeConfig): Promise<void> {
  const parsedEvents = events.map(parseEvent);
  for (const event of parsedEvents) {
    if (isDuplicateEvent(event.webhookEventId)) {
      console.log("LINE EVENT SKIPPED DUPLICATE:", { webhookEventId: event.webhookEventId });
      continue;
    }
    logEventMeta(event);
    await handleText(event);
    await handleImage(event, config);
  }
}

export async function POST(req: Request) {
  const config = buildRuntimeConfig();
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-line-signature");
    if (!verifyLineSignature(rawBody, signature)) {
      console.warn("LINE webhook invalid signature");
      return Response.json({ error: "invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody || "{}");
    const events = Array.isArray(body?.events) ? body.events : [];
    if (config.debugBody) {
      console.log("LINE EVENT BODY:", JSON.stringify(body, null, 2));
    }
    console.log("LINE EVENT COUNT:", events.length);

    if (!events.length) {
      return Response.json({ ok: true });
    }

    after(async () => {
      await processEvents(events, config).catch((err: any) => {
        console.error("LINE async event process error:", err?.message || err);
      });
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("LINE webhook error:", error);
    return Response.json({ ok: true, errorHandled: true });
  }
}
