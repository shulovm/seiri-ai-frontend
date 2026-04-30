const LINE_API_BASE = "https://api.line.me/v2/bot";
const LINE_DATA_API_BASE = "https://api-data.line.me/v2/bot";

function getAccessToken(): string {
  return String(process.env.LINE_CHANNEL_ACCESS_TOKEN || "");
}

async function postJson(path: string, payload: unknown) {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("LINE_CHANNEL_ACCESS_TOKEN is missing");
  }

  const res = await fetch(`${LINE_API_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`LINE API failed: ${res.status} ${body}`);
  }
}

export async function replyLineMessage(replyToken: string, text: string) {
  await postJson("/message/reply", {
    replyToken,
    messages: [{ type: "text", text }],
  });
}

export async function pushLineMessage(to: string, text: string) {
  await postJson("/message/push", {
    to,
    messages: [{ type: "text", text }],
  });
}

export async function fetchLineImageContent(messageId: string): Promise<Buffer> {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("LINE_CHANNEL_ACCESS_TOKEN is missing");
  }

  const res = await fetch(`${LINE_DATA_API_BASE}/message/${messageId}/content`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`LINE image content fetch failed: ${res.status}`);
  }

  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}
