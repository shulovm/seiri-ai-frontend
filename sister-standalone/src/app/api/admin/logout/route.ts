import { cookies } from "next/headers";

export async function POST() {
  const jar = await cookies();
  jar.set("sister_admin_session", "", {
    httpOnly: true,
    secure: process.env.VERCEL === "1" || process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return Response.json({ ok: true });
}
