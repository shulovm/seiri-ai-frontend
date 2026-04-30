import { getLatestTheme } from "@/lib/server/sister/theme";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = String(searchParams.get("studentId") || "");
  return Response.json(getLatestTheme(studentId));
}
