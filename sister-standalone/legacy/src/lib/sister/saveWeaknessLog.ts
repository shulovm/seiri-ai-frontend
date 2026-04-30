export interface WeaknessLogRecord {
  id: string;
  createdAt: string;
  subject: string;
  topicName: string;
  missCause: string;
  entrancePriority: "HIGH" | "MIDDLE" | "LOW";
  nextReviewDate: string;
}

/**
 * サーバー保存結果の型ガイド。
 * 永続化本体は `lib/sister/saveWeaknessLog.js` で実装。
 */
export function toWeaknessLogRecord(input: Partial<WeaknessLogRecord>): WeaknessLogRecord {
  return {
    id: input.id || "",
    createdAt: input.createdAt || new Date().toISOString(),
    subject: input.subject || "math",
    topicName: input.topicName || "未分類",
    missCause: input.missCause || "FRAGMENTS",
    entrancePriority: input.entrancePriority || "MIDDLE",
    nextReviewDate: input.nextReviewDate || new Date().toISOString(),
  };
}
