import { answerThemeQuestion } from "@/lib/server/sister/theme";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const themeId = String(body?.themeId || "");
  const studentId = String(body?.studentId || "");
  const question = String(body?.question || "").trim();
  if (!themeId || !question) {
    return Response.json({ error: "themeId and question are required" }, { status: 400 });
  }
  return Response.json(answerThemeQuestion({ themeId, studentId, question }));
}
