import { buildWeeklyReportText } from "@/lib/sister/sendWeeklyReport";
import { loadWeaknessLogs } from "@/lib/sister/saveWeaknessLog";

export async function POST() {
  const logs = loadWeaknessLogs();
  return Response.json({
    ok: true,
    lineSent: false,
    summaryText: buildWeeklyReportText(logs),
  });
}
