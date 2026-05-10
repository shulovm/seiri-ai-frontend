/**
 * 管理画面用セッション（Cookie）。秘密はサーバーのみ。
 * Edge / Node 両方で crypto.subtle が使える前提。
 */
export async function createAdminSessionToken(secret: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`sister-admin-session:v1:${secret}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function isValidAdminSessionCookie(value: string | undefined, secret: string): Promise<boolean> {
  if (!value || !secret) return false;
  const expected = await createAdminSessionToken(secret);
  if (value.length !== expected.length) return false;
  let ok = 0;
  for (let i = 0; i < expected.length; i++) {
    ok |= value.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return ok === 0;
}
