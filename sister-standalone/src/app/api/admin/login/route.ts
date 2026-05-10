import { cookies } from "next/headers";
import { createAdminSessionToken } from "@/lib/server/adminSession";

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function resolveLoginPassword(): string {
  return String(
    process.env.SISTER_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || process.env.INTERNAL_API_KEY || "",
  );
}

async function setAdminCookie() {
  const secret = String(process.env.SISTER_ADMIN_SECRET || process.env.INTERNAL_API_KEY || "");
  if (!secret) return Response.json({ error: "admin secret not configured" }, { status: 500 });
  const token = await createAdminSessionToken(secret);
  const jar = await cookies();
  jar.set("sister_admin_session", token, {
    httpOnly: true,
    secure: process.env.VERCEL === "1" || process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return Response.json({ ok: true });
}

export async function POST(req: Request) {
  const secret = String(process.env.SISTER_ADMIN_SECRET || process.env.INTERNAL_API_KEY || "");
  if (!secret) {
    return Response.json({ error: "admin secret not configured" }, { status: 500 });
  }

  const expectedKey = String(process.env.INTERNAL_API_KEY || "");
  const apiKey = req.headers.get("x-api-key") || "";
  if (expectedKey && timingSafeEqual(apiKey, expectedKey)) {
    return setAdminCookie();
  }

  const body = await req.json().catch(() => ({}));
  const password = typeof body?.password === "string" ? body.password : "";
  const expectedPass = resolveLoginPassword();
  if (!expectedPass || !timingSafeEqual(password, expectedPass)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  return setAdminCookie();
}
