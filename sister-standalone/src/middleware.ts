import { NextResponse, type NextRequest } from "next/server";

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
  return "admin";
}

function isStudentPath(pathname: string): boolean {
  return pathname === "/sister/prototype" || pathname.startsWith("/sister/understanding");
}

function isParentPath(pathname: string): boolean {
  return pathname === "/sister/parent";
}

function isAdminOnlyPath(pathname: string): boolean {
  return pathname === "/" || pathname === "/sister";
}

export function middleware(req: NextRequest) {
  const role = resolveSiteRole(req);
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  // student site: student画面のみ
  if (role === "student") {
    if (isParentPath(pathname) || isAdminOnlyPath(pathname)) {
      const url = req.nextUrl.clone();
      url.pathname = "/sister/prototype";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // parent site: parent画面のみ
  if (role === "parent") {
    if (isStudentPath(pathname) || isAdminOnlyPath(pathname)) {
      const url = req.nextUrl.clone();
      url.pathname = "/sister/parent";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // admin site: 管理画面を起点に使う
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
};
