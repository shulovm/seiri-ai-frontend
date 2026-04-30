import fs from "node:fs";
import path from "node:path";
import {
  createInitialReviewState,
  pickTodayReviewItems,
  type ReviewState,
  updateReviewStateAfterAttempt,
} from "./smartReviewEngine";

export type ProblemImageAnalysis = {
  subject: "math" | "science" | "english" | "social" | "japanese";
  topicId: string;
  topicName: string;
  problemType: string;
  missCause: string;
  prerequisiteGaps: string[];
  entrancePriority: "HIGH" | "MIDDLE" | "LOW";
  nextReviewDays: number;
  nextAction: string;
  studentMessage: string;
  parentCheck: string;
  hiddenWeaknessPatterns: string[];
  recurringRootCause: string | null;
  confidenceScore: number;
  suggestedMicroTraining: string[];
};

export type WeaknessLog = {
  id: string;
  createdAt: string;
  studentLineUserId: string;
  parentLineUserId: string;
  messageId: string;
  imagePath: string;
  subject: ProblemImageAnalysis["subject"];
  topicId: string;
  topicName: string;
  problemType: string;
  missCause: string;
  prerequisiteGaps: string[];
  entrancePriority: "HIGH" | "MIDDLE" | "LOW";
  nextReviewDate: string;
  nextAction: string;
  parentCheck: string;
  hiddenWeaknessPatterns: string[];
  recurringRootCause: string | null;
  confidenceScore: number;
  suggestedMicroTraining: string[];
  reviewState: ReviewState;
};

const STORAGE_DIR = process.env.VERCEL
  ? path.resolve("/tmp/sister-parent-monitor")
  : path.resolve(process.cwd(), "storage");
const IMAGE_DIR = path.join(STORAGE_DIR, "line-images");
const DB_PATH = path.join(STORAGE_DIR, "sister-parent-monitor-logs.json");

function ensureStorage() {
  if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });
  if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

export function saveLineImage(messageId: string, imageBuffer: Buffer, ext = "jpg") {
  ensureStorage();
  const safeId = String(messageId || Date.now());
  const filename = `${safeId}.${ext}`;
  const fullPath = path.join(IMAGE_DIR, filename);
  fs.writeFileSync(fullPath, imageBuffer);
  return {
    filename,
    fullPath,
    relativePath: `storage/line-images/${filename}`,
  };
}

export function loadWeaknessLogs(): WeaknessLog[] {
  ensureStorage();
  if (!fs.existsSync(DB_PATH)) return [];
  try {
    const raw = fs.readFileSync(DB_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveWeaknessLogs(logs: WeaknessLog[]) {
  ensureStorage();
  fs.writeFileSync(DB_PATH, JSON.stringify(logs, null, 2), "utf8");
}

export function saveWeaknessLog(args: {
  studentLineUserId: string;
  parentLineUserId: string;
  messageId: string;
  imagePath: string;
  analysis: ProblemImageAnalysis;
}): WeaknessLog {
  const now = new Date();
  const next = new Date(now);
  next.setDate(now.getDate() + Math.max(1, Number(args.analysis.nextReviewDays || 1)));

  const entry: WeaknessLog = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now.toISOString(),
    studentLineUserId: args.studentLineUserId,
    parentLineUserId: args.parentLineUserId,
    messageId: args.messageId,
    imagePath: args.imagePath,
    subject: args.analysis.subject,
    topicId: args.analysis.topicId,
    topicName: args.analysis.topicName,
    problemType: args.analysis.problemType,
    missCause: args.analysis.missCause,
    prerequisiteGaps: args.analysis.prerequisiteGaps.slice(0, 3),
    entrancePriority: args.analysis.entrancePriority,
    nextReviewDate: next.toISOString(),
    nextAction: args.analysis.nextAction,
    parentCheck: args.analysis.parentCheck,
    hiddenWeaknessPatterns: args.analysis.hiddenWeaknessPatterns.slice(0, 4),
    recurringRootCause: args.analysis.recurringRootCause,
    confidenceScore: Number(args.analysis.confidenceScore || 0.6),
    suggestedMicroTraining: args.analysis.suggestedMicroTraining.slice(0, 3),
    reviewState: createInitialReviewState({
      itemId: args.messageId,
      missCause: args.analysis.missCause,
      confidenceScore: Number(args.analysis.confidenceScore || 0.6),
      now,
    }),
  };

  const logs = loadWeaknessLogs();
  logs.unshift(entry);
  saveWeaknessLogs(logs);
  return entry;
}

export function getTodaySmartReview(studentLineUserId: string): WeaknessLog[] {
  const logs = loadWeaknessLogs();
  const scoped = studentLineUserId ? logs.filter((x) => x.studentLineUserId === studentLineUserId) : logs;
  return pickTodayReviewItems(scoped);
}

export function markReviewAttempt(args: {
  logId: string;
  isCorrect: boolean;
  answerTimeSec?: number | null;
  missCause?: string | null;
}): WeaknessLog | null {
  const logs = loadWeaknessLogs();
  const idx = logs.findIndex((x) => x.id === args.logId);
  if (idx < 0) return null;

  const current = logs[idx];
  const nextState = updateReviewStateAfterAttempt({
    reviewState: current.reviewState,
    isCorrect: Boolean(args.isCorrect),
    answerTimeSec: args.answerTimeSec,
    missCause: args.missCause || current.missCause,
  });

  logs[idx] = {
    ...current,
    reviewState: nextState,
    nextReviewDate: nextState.nextReviewAt,
  };
  saveWeaknessLogs(logs);
  return logs[idx];
}
