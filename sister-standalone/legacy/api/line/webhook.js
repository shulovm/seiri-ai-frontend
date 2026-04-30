export const config = {
  api: {
    bodyParser: false,
  },
};

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function fetchLineImageContent(messageId, accessToken) {
  const res = await fetch(`https://api-data.line.me/v2/bot/message/${messageId}/content`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) throw new Error(`line image fetch failed: ${res.status}`);
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

async function replyText(replyToken, text, accessToken) {
  const res = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: "text", text }],
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`line reply failed: ${res.status} ${body}`);
  }
}

const IMAGE_RECEIVED_MESSAGES = [
  "写真ありがとう！\n今日も1日おつかれさま。\nあとで一緒に整理するね。",
  "送ってくれてありがとう。\n今のうちに苦手を見つけられるのはかなり良いよ。",
  "写真受け取ったよ。\nこれは次に点を取りやすくする材料になるよ。",
  "ありがとう。\n間違えた問題を残せるのは、ちゃんと前に進んでる証拠だよ。",
  "写真ありがとう。\n今日はここまででも十分えらい。\nあとで大事なポイントだけ整理するね。",
  "受け取ったよ。\nできなかった問題は、伸びる場所が見つかったってこと。",
  "送ってくれてありがとう。\n今は答えより、「どこで止まったか」を見つけるのが大事だよ。",
  "写真ありがとう。\n今日やった分だけ、ちゃんと力になっていくよ。",
  "受け取ったよ。\n今の1枚が、次の得点につながる材料になるよ。",
  "ありがとう。\n今日の頑張り、ちゃんと積み上がってるよ。",
  "写真ありがとう！\nここから少しずつ分かるに変えていこう。",
  "送ってくれてありがとう。\n間違いを残せる人ほど、あとで伸びるよ。",
];

function getRandomImageReceivedMessage() {
  const idx = Math.floor(Math.random() * IMAGE_RECEIVED_MESSAGES.length);
  return IMAGE_RECEIVED_MESSAGES[idx];
}

export default async function handler(req, res) {
  const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN || "";

  if (req.method === "GET") {
    console.log("LINE webhook GET health check");
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "POST") {
    return res.status(200).json({ ok: true });
  }

  try {
    const rawBody = await readRawBody(req).catch(() => Buffer.from("{}"));
    let body = {};
    try {
      body = JSON.parse(rawBody.toString("utf8") || "{}");
    } catch {
      console.log("LINE webhook: invalid JSON body");
      body = {};
    }

    const events = Array.isArray(body?.events) ? body.events : [];
    if (!events.length) {
      console.log("LINE webhook: events empty");
      return res.status(200).json({ ok: true });
    }

    for (const event of events) {
      const replyToken = event?.replyToken;
      const messageType = event?.message?.type;
      const userId = event?.source?.userId || null;

      if (event?.type === "message" && messageType === "text") {
        const text = event?.message?.text || "";
        console.log("[LINE TEXT RECEIVED]", {
          userId,
          text,
          timestamp: event?.timestamp || null,
        });

        if (replyToken && accessToken) {
          await replyText(replyToken, "メッセージありがとう。受信できてるよ。", accessToken).catch(
            (err) => console.error("LINE text reply error:", err?.message || err)
          );
        }
      }

      if (event?.type === "message" && messageType === "image") {
        const messageId = event?.message?.id || null;
        console.log("[LINE IMAGE RECEIVED]", {
          userId,
          messageId,
          timestamp: event?.timestamp || null,
        });

        if (messageId && accessToken) {
          try {
            const imageBuffer = await fetchLineImageContent(messageId, accessToken);
            console.log("[LINE IMAGE CONTENT FETCHED]", {
              messageId,
              sizeBytes: imageBuffer.length,
            });
          } catch (err) {
            console.error("LINE image fetch error:", err?.message || err);
          }
        }

        if (replyToken && accessToken) {
          await replyText(replyToken, getRandomImageReceivedMessage(), accessToken).catch(
            (err) => console.error("LINE image reply error:", err?.message || err)
          );
        }
      }
    }

    return res.status(200).json({
      ok: true,
    });
  } catch (error) {
    console.error("LINE webhook error:", error);

    // 失敗時でもWebhookリトライ暴発を防ぐため 200 を返す
    return res.status(200).json({
      ok: true,
      errorHandled: true,
    });
  }
}
