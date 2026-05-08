import fs from "node:fs";
import path from "node:path";
import type { WeaknessLog } from "./saveWeaknessLog";

const WEEKLY_STATE_PATH = process.env.VERCEL
  ? path.resolve("/tmp/sister-parent-monitor/weekly-state.json")
  : path.resolve(process.cwd(), "storage/sister-weekly-state.json");

function subjectLabel(subject: WeaknessLog["subject"]): string {
  if (subject === "math") return "数学";
  if (subject === "science") return "理科";
  if (subject === "english") return "英語";
  if (subject === "social") return "社会";
  return "国語";
}

function loadState(): { lastSentWeekKey: string | null } {
  try {
    if (!fs.existsSync(WEEKLY_STATE_PATH)) return { lastSentWeekKey: null };
    return JSON.parse(fs.readFileSync(WEEKLY_STATE_PATH, "utf8"));
  } catch {
    return { lastSentWeekKey: null };
  }
}

function saveState(state: { lastSentWeekKey: string | null; sentAt: string }) {
  const dir = path.dirname(WEEKLY_STATE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(WEEKLY_STATE_PATH, JSON.stringify(state, null, 2), "utf8");
}

function currentWeekKey(now = new Date()): string {
  const y = now.getFullYear();
  const first = new Date(y, 0, 1);
  const day = Math.ceil((now.getTime() - first.getTime()) / 86400000);
  const w = Math.ceil((day + first.getDay() + 1) / 7);
  return `${y}-W${String(w).padStart(2, "0")}`;
}

export function buildWeeklyReportText(logs: WeaknessLog[]): string {
  const from = new Date();
  from.setDate(from.getDate() - 7);
  const recent = logs.filter((x) => new Date(x.createdAt).getTime() >= from.getTime());

  const grouped = new Map<
    string,
    { subject: WeaknessLog["subject"]; topicName: string; mistakeHint: string; count: number }
  >();
  for (const item of recent) {
    const key = `${item.subject}:${item.topicName}`;
    const prev = grouped.get(key) || {
      subject: item.subject,
      topicName: item.topicName,
      mistakeHint: item.mistakeHint,
      count: 0,
    };
    prev.count += 1;
    prev.mistakeHint = item.mistakeHint;
    grouped.set(key, prev);
  }

  const ranking = [...grouped.values()].sort((a, b) => b.count - a.count).slice(0, 3);
  const lines = ["【今週の学習レポート】", "", `送信された問題：${recent.length}件`, "", "弱点ランキング："];

  if (ranking.length === 0) {
    lines.push("今週は新しい問題送信がありませんでした。");
  } else {
    ranking.forEach((item, idx) => {
      lines.push(`${idx + 1}. ${subjectLabel(item.subject)}：${item.topicName}`);
      lines.push(`   詰まりどころ：${item.mistakeHint}`);
      lines.push(`   対策：今度は「${item.mistakeHint}」を避ける意識で1回復習`);
      lines.push("");
    });
  }

  lines.push("総評：");
  lines.push(
    ranking.length > 0
      ? `今週は${subjectLabel(ranking[0].subject)}の弱点がはっきり出ています。まず「${ranking[0].topicName}」を優先すると最短で点につながります。`
      : "来週は1件でも問題写真があると、傾向分析がさらに正確になります。"
  );
  return lines.join("\n");
}

export function shouldSendWeeklyReport(now = new Date()): boolean {
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const isSunday = jst.getUTCDay() === 0;
  const hour = jst.getUTCHours();
  const isNight = hour >= 21 && hour <= 22;
  if (!isSunday || !isNight) return false;

  const state = loadState();
  const wk = currentWeekKey(jst);
  if (state.lastSentWeekKey === wk) return false;
  saveState({ lastSentWeekKey: wk, sentAt: new Date().toISOString() });
  return true;
}
