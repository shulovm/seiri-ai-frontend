export async function pushLineTextMessage(params: {
  accessToken: string;
  to: string;
  text: string;
}): Promise<void> {
  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: params.to,
      messages: [{ type: "text", text: params.text }],
    }),
  });
  if (!res.ok) throw new Error(`LINE push failed: ${res.status}`);
}
