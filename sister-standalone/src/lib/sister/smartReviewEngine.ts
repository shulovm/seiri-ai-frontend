function addDays(baseDate: Date | string, days: number): string {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function decideInitialIntervals(args: { missCause?: string; confidenceScore: number }): number[] {
  if (args.missCause && args.missCause !== "VERIFIED") return [0, 1, 3, 7];
  if (args.confidenceScore < 0.72) return [1, 4, 10];
  return [7, 14, 30];
}

export type ReviewState = {
  itemId: string;
  memoryStrength: number;
  lastReviewedAt: string;
  nextReviewAt: string;
  streakCorrect: number;
  stabilityScore: number;
  reviewCount: number;
  scheduledOffsets: number[];
  scheduleIndex: number;
  understandingLevel: "STABLE" | "UNSTABLE";
  accuracyRate: number;
  avgAnswerTimeSec: number | null;
  missCauseHistory: string[];
};

export function createInitialReviewState(args: {
  itemId: string;
  missCause?: string;
  confidenceScore?: number;
  now?: Date;
}): ReviewState {
  const now = args.now || new Date();
  const confidence = Number(args.confidenceScore || 0.6);
  const intervals = decideInitialIntervals({ missCause: args.missCause, confidenceScore: confidence });
  return {
    itemId: args.itemId,
    memoryStrength: Number((confidence * 0.8).toFixed(2)),
    lastReviewedAt: now.toISOString(),
    nextReviewAt: addDays(now, intervals[0] || 1),
    streakCorrect: args.missCause === "VERIFIED" ? 1 : 0,
    stabilityScore: Number((confidence * 0.75).toFixed(2)),
    reviewCount: 0,
    scheduledOffsets: intervals,
    scheduleIndex: 0,
    understandingLevel: args.missCause === "VERIFIED" ? "STABLE" : "UNSTABLE",
    accuracyRate: args.missCause === "VERIFIED" ? 1 : 0,
    avgAnswerTimeSec: null,
    missCauseHistory: args.missCause ? [args.missCause] : [],
  };
}

export function updateReviewStateAfterAttempt(args: {
  reviewState?: ReviewState;
  isCorrect: boolean;
  answerTimeSec?: number | null;
  missCause?: string | null;
  now?: Date;
}): ReviewState {
  const now = args.now || new Date();
  const prev = args.reviewState || createInitialReviewState({ itemId: "", missCause: "FRAGMENTS" });
  const next = { ...prev };
  next.lastReviewedAt = now.toISOString();
  next.reviewCount = Number(next.reviewCount || 0) + 1;
  next.missCauseHistory = [...(next.missCauseHistory || []), args.missCause || ""].filter(Boolean).slice(-8);

  const prevAccuracy = Number(next.accuracyRate || 0);
  next.accuracyRate = Number(
    ((prevAccuracy * (next.reviewCount - 1) + (args.isCorrect ? 1 : 0)) / next.reviewCount).toFixed(2)
  );

  if (args.answerTimeSec != null) {
    const prevTime = Number(next.avgAnswerTimeSec || args.answerTimeSec);
    next.avgAnswerTimeSec = Number(((prevTime + Number(args.answerTimeSec)) / 2).toFixed(1));
  }

  if (args.isCorrect) {
    next.streakCorrect = Number(next.streakCorrect || 0) + 1;
    next.memoryStrength = Math.min(1, Number((Number(next.memoryStrength || 0.4) + 0.12).toFixed(2)));
    next.stabilityScore = Math.min(1, Number((Number(next.stabilityScore || 0.4) + 0.1).toFixed(2)));
    next.scheduleIndex = Number(next.scheduleIndex || 0) + 1;
  } else {
    next.streakCorrect = 0;
    next.memoryStrength = Math.max(0.1, Number((Number(next.memoryStrength || 0.4) - 0.18).toFixed(2)));
    next.stabilityScore = Math.max(0.1, Number((Number(next.stabilityScore || 0.4) - 0.15).toFixed(2)));
    next.scheduleIndex = 0;
  }

  const stable = next.streakCorrect >= 3 && next.stabilityScore >= 0.72;
  next.understandingLevel = stable ? "STABLE" : "UNSTABLE";

  const baseOffsets = Array.isArray(next.scheduledOffsets) && next.scheduledOffsets.length ? next.scheduledOffsets : [1, 3, 7];
  let nextDays = baseOffsets[Math.min(next.scheduleIndex, baseOffsets.length - 1)] || 1;
  if (next.streakCorrect >= 4) nextDays = Math.max(nextDays, 14);
  if (next.streakCorrect >= 6) nextDays = Math.max(nextDays, 30);
  if (!args.isCorrect) nextDays = next.reviewCount <= 1 ? 0 : 1;
  next.nextReviewAt = addDays(now, nextDays);
  return next;
}

export function pickTodayReviewItems<T extends { reviewState?: ReviewState; entrancePriority?: string }>(logs: T[], now = new Date()): T[] {
  const nowMs = now.getTime();
  return logs
    .filter((x) => x?.reviewState?.nextReviewAt)
    .filter((x) => new Date(String(x.reviewState?.nextReviewAt || "")).getTime() <= nowMs)
    .sort((a, b) => {
      const ap = a.entrancePriority === "HIGH" ? 3 : a.entrancePriority === "MIDDLE" ? 2 : 1;
      const bp = b.entrancePriority === "HIGH" ? 3 : b.entrancePriority === "MIDDLE" ? 2 : 1;
      if (bp !== ap) return bp - ap;
      return new Date(String(a.reviewState?.nextReviewAt || 0)).getTime() - new Date(String(b.reviewState?.nextReviewAt || 0)).getTime();
    })
    .slice(0, 3);
}
