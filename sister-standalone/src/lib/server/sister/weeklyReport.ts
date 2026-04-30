import fs from "node:fs";
import path from "node:path";
import { loadWeaknessLogs } from "@/lib/server/sister/storage";

const STATE_PATH = process.env.VERCEL
  ? path.resolve("/tmp/sister-storage/sister-weekly-state.json")
  : path.resolve(process.cwd(), "storage/sister-weekly-state.json");

function loadState() {
  try {
    if (!fs.existsSync(STATE_PATH)) return { lastSentWeekKey: null };
    return JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
  } catch {
    return { lastSentWeekKey: null };
  }
}

function saveState(state: any) {
  const dir = path.dirname(STATE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), "utf8");
}

function weekKey(date = new Date()) {
  const y = date.getFullYear();
  const w = Math.ceil(((date.getTime() - new Date(y, 0, 1).getTime()) / 86400000 + new Date(y, 0, 1).getDay() + 1) / 7);
  return `${y}-W${String(w).padStart(2, "0")}`;
}

function subjectLabel(subject: string) {
  if (subject === "math") return "数学";
  if (subject === "science") return "理科";
  if (subject === "english") return "英語";
  if (subject === "social") return "社会";
  return "国語";
}

export function buildWeeklyText(logs: any[]) {
  const from = new Date();
  from.setDate(from.getDate() - 7);
  const recent = logs.filter((x) => new Date(x.createdAt).getTime() >= from.getTime());
  const grouped = new Map<string, any>();
  const rootCauseCount = new Map<string, number>();

  for (const item of recent) {
    const key = `${item.subject}:${item.topicName}`;
    const prev = grouped.get(key) || { ...item, count: 0 };
    prev.count += 1;
    grouped.set(key, prev);
    if (item.recurringRootCause) {
      rootCauseCount.set(item.recurringRootCause, Number(rootCauseCount.get(item.recurringRootCause) || 0) + 1);
    }
  }

  const ranking = [...grouped.values()].sort((a, b) => b.count - a.count).slice(0, 3);
  const lines = ["【今週の学習レポート】", "", `送信された問題：${recent.length}件`, "", "弱点ランキング："];
  if (!ranking.length) {
    lines.push("今週は新規ログがありませんでした。");
  } else {
    ranking.forEach((row, i) => {
      lines.push(`${i + 1}. ${subjectLabel(row.subject)}：${row.topicName}`);
      lines.push(`   原因：${row.missCause}`);
      if (row.recurringRootCause) lines.push(`   根本：${row.recurringRootCause}`);
      lines.push(`   対策：${row.nextAction}`);
      lines.push("");
    });
  }

  const topRoot = [...rootCauseCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  lines.push("総評：");
  lines.push(
    ranking.length
      ? `今週は${subjectLabel(ranking[0].subject)}の弱点が目立ちます。${topRoot ? `根本では「${topRoot}」が繰り返し出ています。` : ""}まず「${ranking[0].topicName}」を優先して短時間で復習すると効率的です。`
      : "学習ログが少ない週でした。写真ログを1件でも送ると分析精度が上がります。",
  );
  return lines.join("\n");
}

/** 親向けLINE送信なし（保護者サイトで確認）。 */
export async function sendWeeklyReportNow(_args: {
  accessToken: string;
  parentLineUserId: string;
}) {
  return false;
}

export function shouldSendWeeklyReportNow(tzOffsetHours = 9) {
  const nowUtc = new Date();
  const local = new Date(nowUtc.getTime() + tzOffsetHours * 60 * 60 * 1000);
  const isSunday = local.getUTCDay() === 0;
  const isNight = local.getUTCHours() >= 21 && local.getUTCHours() <= 22;
  if (!isSunday || !isNight) return false;

  const state = loadState();
  const key = weekKey(local);
  if (state.lastSentWeekKey === key) return false;
  saveState({ lastSentWeekKey: key, sentAt: new Date().toISOString() });
  return true;
}
