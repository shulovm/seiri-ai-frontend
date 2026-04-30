import crypto from "crypto";

export function verifyLineSignature({
  rawBody,
  signature,
  channelSecret,
}) {
  if (!rawBody || !signature || !channelSecret) return false;

  const expected = crypto
    .createHmac("sha256", channelSecret)
    .update(rawBody)
    .digest("base64");

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
