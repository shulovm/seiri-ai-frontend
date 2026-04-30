import crypto from "crypto";

export function verifyLineSignature(
  rawBody: string,
  signature: string,
  channelSecret: string
): boolean {
  if (!rawBody || !signature || !channelSecret) return false;
  const expected = crypto
    .createHmac("sha256", channelSecret)
    .update(rawBody)
    .digest("base64");
  return expected === signature;
}
