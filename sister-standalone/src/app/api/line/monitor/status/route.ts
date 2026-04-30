import { loadWeaknessLogs } from "@/lib/sister/saveWeaknessLog";

export async function GET() {
  const logs = loadWeaknessLogs();
  const accessToken = String(process.env.LINE_CHANNEL_ACCESS_TOKEN || "");
  let lineApiCheck: {
    ok: boolean;
    status: number | null;
    detail: string;
    basicId?: string;
    displayName?: string;
  } = {
    ok: false,
    status: null,
    detail: "LINE_CHANNEL_ACCESS_TOKEN is missing",
  };

  if (accessToken) {
    try {
      const res = await fetch("https://api.line.me/v2/bot/info", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          basicId?: string;
          displayName?: string;
        };
        lineApiCheck = {
          ok: true,
          status: res.status,
          detail: "token is valid",
          basicId: body.basicId || "",
          displayName: body.displayName || "",
        };
      } else {
        const errText = await res.text().catch(() => "");
        lineApiCheck = {
          ok: false,
          status: res.status,
          detail: errText || "LINE API request failed",
        };
      }
    } catch (error: any) {
      lineApiCheck = {
        ok: false,
        status: null,
        detail: error?.message || "LINE API request error",
      };
    }
  }

  return Response.json({
    ok: true,
    configured: {
      lineAccessToken: Boolean(accessToken),
      lineSecret: Boolean(process.env.LINE_CHANNEL_SECRET),
      studentLineUserId: Boolean(process.env.STUDENT_LINE_USER_ID),
      anthropicApiKey: Boolean(process.env.ANTHROPIC_API_KEY),
      appBaseUrl: Boolean(process.env.APP_BASE_URL),
    },
    lineApiCheck,
    totalLogs: logs.length,
  });
}
