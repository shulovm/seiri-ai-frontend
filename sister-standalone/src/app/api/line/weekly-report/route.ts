import { buildWeeklyReportText } from "@/lib/sister/sendWeeklyReport";
import { loadWeaknessLogs } from "@/lib/sister/saveWeaknessLog";
import { requireApiKey } from "@/lib/server/requireApiKey";

export async function POST(req: Request) {
  const unauthorized = requireApiKey(req);
  if (unauthorized) return unauthorized;

  const logs = loadWeaknessLogs();
  return Response.json({
    ok: true,
    lineSent: false,
    summaryText: buildWeeklyReportText(logs),
  });
}
