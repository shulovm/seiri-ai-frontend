function addDays(baseDate, days) {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function decideInitialIntervals({ missCause, confidenceScore }) {
  if (missCause && missCause !== "VERIFIED") {
    // 初回で間違えた場合
    return [0, 1, 3, 7];
  }
  if (confidenceScore < 0.72) {
    // 正解だが不安定
    return [1, 4, 10];
  }
  // 安定している
  return [7, 14, 30];
}

export function createInitialReviewState({
  itemId,
  missCause,
  confidenceScore = 0.6,
  now = new Date(),
}) {
  const intervals = decideInitialIntervals({ missCause, confidenceScore });
  return {
    itemId,
    memoryStrength: Number((confidenceScore * 0.8).toFixed(2)),
    lastReviewedAt: now.toISOString(),
    nextReviewAt: addDays(now, intervals[0] || 1),
    streakCorrect: missCause === "VERIFIED" ? 1 : 0,
    stabilityScore: Number((confidenceScore * 0.75).toFixed(2)),
    reviewCount: 0,
    scheduledOffsets: intervals,
    scheduleIndex: 0,
    understandingLevel: missCause === "VERIFIED" ? "STABLE" : "UNSTABLE",
    accuracyRate: missCause === "VERIFIED" ? 1 : 0,
    avgAnswerTimeSec: null,
    missCauseHistory: missCause ? [missCause] : [],
  };
}

export function updateReviewStateAfterAttempt({
  reviewState,
  isCorrect,
  answerTimeSec,
  missCause,
  now = new Date(),
}) {
  const prev = reviewState || createInitialReviewState({ itemId: "", missCause: "FRAGMENTS" });
  const next = { ...prev };
  next.lastReviewedAt = now.toISOString();
  next.reviewCount = Number(next.reviewCount || 0) + 1;
  next.missCauseHistory = [...(next.missCauseHistory || []), missCause || null].filter(Boolean).slice(-8);

  const prevAccuracy = Number(next.accuracyRate || 0);
  next.accuracyRate = Number(
    ((prevAccuracy * (next.reviewCount - 1) + (isCorrect ? 1 : 0)) / next.reviewCount).toFixed(2)
  );

  if (answerTimeSec != null) {
    const prevTime = Number(next.avgAnswerTimeSec || answerTimeSec);
    next.avgAnswerTimeSec = Number(((prevTime + Number(answerTimeSec)) / 2).toFixed(1));
  }

  if (isCorrect) {
    next.streakCorrect = Number(next.streakCorrect || 0) + 1;
    next.memoryStrength = Math.min(1, Number((Number(next.memoryStrength || 0.4) + 0.12).toFixed(2)));
    next.stabilityScore = Math.min(1, Number((Number(next.stabilityScore || 0.4) + 0.1).toFixed(2)));
    next.scheduleIndex = Number(next.scheduleIndex || 0) + 1;
  } else {
    // 再ミスしたら短縮
    next.streakCorrect = 0;
    next.memoryStrength = Math.max(0.1, Number((Number(next.memoryStrength || 0.4) - 0.18).toFixed(2)));
    next.stabilityScore = Math.max(0.1, Number((Number(next.stabilityScore || 0.4) - 0.15).toFixed(2)));
    next.scheduleIndex = 0;
  }

  const stable = next.streakCorrect >= 3 && next.stabilityScore >= 0.72;
  next.understandingLevel = stable ? "STABLE" : "UNSTABLE";

  const baseOffsets = Array.isArray(next.scheduledOffsets) && next.scheduledOffsets.length
    ? next.scheduledOffsets
    : [1, 3, 7];

  let nextDays = baseOffsets[Math.min(next.scheduleIndex, baseOffsets.length - 1)] || 1;

  // 連続正解なら延長
  if (next.streakCorrect >= 4) nextDays = Math.max(nextDays, 14);
  if (next.streakCorrect >= 6) nextDays = Math.max(nextDays, 30);

  // 再ミスしたら短縮（即日/翌日）
  if (!isCorrect) {
    nextDays = next.reviewCount <= 1 ? 0 : 1;
  }

  next.nextReviewAt = addDays(now, nextDays);
  return next;
}

export function pickTodayReviewItems(logs, now = new Date()) {
  const nowMs = now.getTime();
  const due = logs
    .filter((x) => x?.reviewState?.nextReviewAt)
    .filter((x) => new Date(x.reviewState.nextReviewAt).getTime() <= nowMs)
    .sort((a, b) => {
      const ap = a.entrancePriority === "HIGH" ? 3 : a.entrancePriority === "MIDDLE" ? 2 : 1;
      const bp = b.entrancePriority === "HIGH" ? 3 : b.entrancePriority === "MIDDLE" ? 2 : 1;
      if (bp !== ap) return bp - ap;
      return new Date(a.reviewState.nextReviewAt).getTime() - new Date(b.reviewState.nextReviewAt).getTime();
    })
    .slice(0, 3);
  return due;
}
