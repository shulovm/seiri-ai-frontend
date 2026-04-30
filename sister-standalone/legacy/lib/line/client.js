const LINE_API_BASE = "https://api-data.line.me/v2/bot";
const LINE_PUSH_BASE = "https://api.line.me/v2/bot";

function lineHeaders(accessToken, contentType = "application/json") {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  if (contentType) headers["Content-Type"] = contentType;
  return headers;
}

export async function fetchLineMessageContent(messageId, accessToken) {
  const res = await fetch(`${LINE_API_BASE}/message/${messageId}/content`, {
    method: "GET",
    headers: lineHeaders(accessToken, null),
  });
  if (!res.ok) throw new Error(`line content fetch failed: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function pushLineMessage(to, text, accessToken) {
  const res = await fetch(`${LINE_PUSH_BASE}/message/push`, {
    method: "POST",
    headers: lineHeaders(accessToken),
    body: JSON.stringify({
      to,
      messages: [{ type: "text", text }],
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`line push failed: ${res.status} ${body}`);
  }
}
