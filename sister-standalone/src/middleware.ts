import { NextResponse, type NextRequest } from "next/server";
import { isValidAdminSessionCookie } from "@/lib/server/adminSession";

type SiteRole = "student" | "parent" | "admin";

function normalizeHost(host: string): string {
  return host.toLowerCase().replace(/:\d+$/, "");
}

function resolveSiteRole(req: NextRequest): SiteRole {
  const host = normalizeHost(req.headers.get("host") || "");
  const studentHost = normalizeHost(process.env.STUDENT_APP_HOST || "");
  const parentHost = normalizeHost(process.env.PARENT_APP_HOST || "");
  const adminHost = normalizeHost(process.env.ADMIN_APP_HOST || "");

  if (studentHost && host === studentHost) return "student";
  if (parentHost && host === parentHost) return "parent";
  if (adminHost && host === adminHost) return "admin";
  return "student";
}

function isStudentPath(pathname: string): boolean {
  return pathname === "/sister/prototype" || pathname.startsWith("/sister/understanding");
}

function isParentPath(pathname: string): boolean {
  return pathname === "/sister/parent";
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  const secret = String(process.env.SISTER_ADMIN_SECRET || process.env.INTERNAL_API_KEY || "");
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const cookieVal = req.cookies.get("sister_admin_session")?.value;
    const ok = secret ? await isValidAdminSessionCookie(cookieVal, secret) : false;
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  const role = resolveSiteRole(req);

  if (role === "student") {
    if (isParentPath(pathname)) {
      const url = req.nextUrl.clone();
      url.pathname = "/sister/prototype";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (role === "parent") {
    if (isStudentPath(pathname)) {
      const url = req.nextUrl.clone();
      url.pathname = "/sister/parent";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
};
