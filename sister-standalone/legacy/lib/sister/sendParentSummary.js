import { pushLineMessage } from "../line/client.js";

function subjectLabel(subject) {
  if (subject === "math") return "数学";
  if (subject === "science") return "理科";
  if (subject === "english") return "英語";
  if (subject === "social") return "社会";
  return "国語";
}

function priorityLabel(priority) {
  if (priority === "HIGH") return "高";
  if (priority === "LOW") return "低";
  return "中";
}

function formatDateJP(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export async function sendStudentShortReply({
  accessToken,
  to,
  analysis,
  themeUrl,
}) {
  if (!to) return;
  const text =
    `写真ありがとう。\n` +
    `今日のテーマは「${subjectLabel(analysis.subject)}：${analysis.topicName}」。\n` +
    `3分だけ確認しよう。\n` +
    (themeUrl ? `\n[理解ページを開く]\n${themeUrl}` : "");
  await pushLineMessage(to, text, accessToken);
}

export async function sendParentSummary({
  accessToken,
  to,
  logEntry,
  analysis,
  themeUrl,
}) {
  if (!to) return;
  const hidden = Array.isArray(logEntry.hiddenWeaknessPatterns)
    ? logEntry.hiddenWeaknessPatterns[0]
    : null;
  const recurring = logEntry.recurringRootCause || analysis.recurringRootCause || null;
  const micro = Array.isArray(logEntry.suggestedMicroTraining)
    ? logEntry.suggestedMicroTraining[0]
    : analysis.suggestedMicroTraining?.[0];

  const text = [
    "【SISTER 学習ログ】",
    "",
    `今日、${subjectLabel(logEntry.subject)}の問題写真が1件送られました。`,
    "",
    `教科：${subjectLabel(logEntry.subject)}`,
    `単元：${logEntry.topicName}`,
    `ミス原因：${analysis.missCause}`,
    `入試優先度：${priorityLabel(logEntry.entrancePriority)}`,
    `次回復習日：${formatDateJP(logEntry.nextReviewDate)}`,
    `次の対策：${logEntry.nextAction}`,
    hidden ? `潜在つまずき：${hidden}` : null,
    recurring ? `根本原因候補：${recurring}` : null,
    micro ? `5分補強案：${micro}` : null,
    "",
    "親チェック：",
    analysis.parentCheck ||
      "責めるより、短い声かけで「次にやる1つ」を一緒に確認すると効果的です。",
    themeUrl ? `理解ページ：${themeUrl}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  await pushLineMessage(to, text, accessToken);
}
