export interface ProblemImageAnalysis {
  subject: "math" | "science" | "english" | "social" | "japanese";
  topicId: string;
  topicName: string;
  problemType: string;
  missCause:
    | "BLANK"
    | "FRAGMENTS"
    | "LOGICAL_LEAP"
    | "PROCEDURE_ERROR"
    | "CARELESS"
    | "VERIFIED";
  prerequisiteGaps: string[];
  entrancePriority: "HIGH" | "MIDDLE" | "LOW";
  nextReviewDays: number;
  nextAction: string;
}

/**
 * フロント向け型定義。
 * 実処理はサーバー側 `lib/sister/analyzeProblemImage.js` を利用。
 */
export function createFallbackProblemImageAnalysis(): ProblemImageAnalysis {
  return {
    subject: "math",
    topicId: "linear_function",
    topicName: "一次関数",
    problemType: "関数",
    missCause: "FRAGMENTS",
    prerequisiteGaps: [],
    entrancePriority: "HIGH",
    nextReviewDays: 1,
    nextAction: "グラフと式の往復を3問",
  };
}
