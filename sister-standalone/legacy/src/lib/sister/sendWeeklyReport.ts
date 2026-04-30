export function buildWeeklyReportText(items: Array<{
  subject: string;
  topicName: string;
  missCause: string;
  nextAction: string;
}>): string {
  const lines = ["【今週の学習レポート】", "", `送信された問題：${items.length}件`, "", "弱点ランキング："];
  items.slice(0, 3).forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.subject}：${item.topicName}`,
      `   原因：${item.missCause}`,
      `   対策：${item.nextAction}`,
      ""
    );
  });
  lines.push("総評：今週の上位単元を短時間で復習すると効果的です。");
  return lines.join("\n");
}
