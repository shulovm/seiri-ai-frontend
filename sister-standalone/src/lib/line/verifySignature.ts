import crypto from "node:crypto";

export function verifyLineSignature(rawBody: string, signature: string | null): boolean {
  const channelSecret = process.env.LINE_CHANNEL_SECRET || "";
  if (!channelSecret || !signature) return false;

  const expected = crypto.createHmac("sha256", channelSecret).update(rawBody).digest("base64");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
