export function buildParentSummaryText(params: {
  subject: string;
  topicName: string;
  missCause: string;
  entrancePriority: string;
  nextAction: string;
}): string {
  return [
    "【SISTER 学習ログ】",
    "",
    `教科：${params.subject}`,
    `単元：${params.topicName}`,
    `ミス原因：${params.missCause}`,
    `入試優先度：${params.entrancePriority}`,
    `次の対策：${params.nextAction}`,
    "",
    "親チェック：",
    "責めるより、短い声かけで次の1つを確認すると効果的です。",
  ].join("\n");
}
