import fs from "fs";
import path from "path";
import { pushLineMessage } from "../line/client.js";
import { loadWeaknessLogs } from "./saveWeaknessLog.js";

const STATE_PATH = path.resolve(process.cwd(), "storage/sister-weekly-state.json");

function loadState() {
  try {
    if (!fs.existsSync(STATE_PATH)) return { lastSentWeekKey: null };
    return JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
  } catch {
    return { lastSentWeekKey: null };
  }
}

function saveState(state) {
  const dir = path.dirname(STATE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), "utf8");
}

function weekKey(date = new Date()) {
  const y = date.getFullYear();
  const w = Math.ceil(
    ((date.getTime() - new Date(y, 0, 1).getTime()) / 86400000 +
      new Date(y, 0, 1).getDay() +
      1) /
      7
  );
  return `${y}-W${String(w).padStart(2, "0")}`;
}

function subjectLabel(subject) {
  if (subject === "math") return "数学";
  if (subject === "science") return "理科";
  if (subject === "english") return "英語";
  if (subject === "social") return "社会";
  return "国語";
}

function buildWeeklyText(logs) {
  const from = new Date();
  from.setDate(from.getDate() - 7);
  const recent = logs.filter((x) => new Date(x.createdAt).getTime() >= from.getTime());
  const grouped = new Map();
  const rootCauseCount = new Map();
  for (const item of recent) {
    const k = `${item.subject}:${item.topicName}`;
    const prev = grouped.get(k) || { ...item, count: 0 };
    prev.count += 1;
    grouped.set(k, prev);

    if (item.recurringRootCause) {
      const n = Number(rootCauseCount.get(item.recurringRootCause) || 0);
      rootCauseCount.set(item.recurringRootCause, n + 1);
    }
  }
  const ranking = [...grouped.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const lines = ["【今週の学習レポート】", "", `送信された問題：${recent.length}件`, "", "弱点ランキング："];
  if (ranking.length === 0) {
    lines.push("今週は新規ログがありませんでした。");
  } else {
    ranking.forEach((row, i) => {
      const detailLines = [
        `${i + 1}. ${subjectLabel(row.subject)}：${row.topicName}`,
        `   原因：${row.missCause}`,
        row.recurringRootCause ? `   根本：${row.recurringRootCause}` : null,
        `   対策：${row.nextAction}`,
        "",
      ].filter(Boolean);
      lines.push(...detailLines);
    });
  }

  const topRoot = [...rootCauseCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  lines.push(
    "総評：",
    ranking.length
      ? `今週は${subjectLabel(ranking[0].subject)}の弱点が目立ちます。${topRoot ? `根本では「${topRoot}」が繰り返し出ています。` : ""}まず「${ranking[0].topicName}」を優先して短時間で復習すると効率的です。`
      : "学習ログが少ない週でした。写真ログを1件でも送ると分析精度が上がります。"
  );
  return lines.join("\n");
}

export async function sendWeeklyReportNow({
  accessToken,
  parentLineUserId,
}) {
  if (!accessToken || !parentLineUserId) return false;
  const logs = loadWeaknessLogs();
  const text = buildWeeklyText(logs);
  await pushLineMessage(parentLineUserId, text, accessToken);
  return true;
}

export function startWeeklyReportScheduler({
  accessToken,
  parentLineUserId,
  tzOffsetHours = 9,
}) {
  if (!accessToken || !parentLineUserId) return;
  const tick = async () => {
    const nowUtc = new Date();
    const local = new Date(nowUtc.getTime() + tzOffsetHours * 60 * 60 * 1000);
    const isSunday = local.getUTCDay() === 0;
    const isNight = local.getUTCHours() >= 21 && local.getUTCHours() <= 22;
    if (!isSunday || !isNight) return;

    const state = loadState();
    const key = weekKey(local);
    if (state.lastSentWeekKey === key) return;

    try {
      await sendWeeklyReportNow({ accessToken, parentLineUserId });
      saveState({ lastSentWeekKey: key, sentAt: new Date().toISOString() });
    } catch (err) {
      console.error("weekly report failed", err);
    }
  };
  tick().catch(() => {});
  const timer = setInterval(() => tick().catch(() => {}), 60 * 60 * 1000);
  timer.unref?.();
}
