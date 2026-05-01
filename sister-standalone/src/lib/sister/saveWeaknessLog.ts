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
  timestamp: number;
  studentLineUserId: string;
  parentLineUserId: string;
  messageId: string;
  messageType: "text" | "image";
  imageId: string | null;
  imagePath: string;
  analysisResult: ProblemImageAnalysis;
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
const REVIEW_SENT_PATH = path.join(STORAGE_DIR, "review-reminder-state.json");

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
  messageType?: "text" | "image";
  imageId?: string | null;
  timestamp?: number;
  imagePath: string;
  analysis: ProblemImageAnalysis;
}): WeaknessLog {
  const now = new Date();
  const next = new Date(now);
  next.setDate(now.getDate() + Math.max(1, Number(args.analysis.nextReviewDays || 1)));

  const entry: WeaknessLog = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now.toISOString(),
    timestamp: Number(args.timestamp || now.getTime()),
    studentLineUserId: args.studentLineUserId,
    parentLineUserId: args.parentLineUserId,
    messageId: args.messageId,
    messageType: args.messageType || "image",
    imageId: args.imageId || args.messageId || null,
    imagePath: args.imagePath,
    analysisResult: args.analysis,
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

function toJstDateKey(date = new Date()): string {
  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = jst.getUTCFullYear();
  const m = String(jst.getUTCMonth() + 1).padStart(2, "0");
  const d = String(jst.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function loadReviewSentState(): Record<string, string[]> {
  ensureStorage();
  if (!fs.existsSync(REVIEW_SENT_PATH)) return {};
  try {
    const raw = fs.readFileSync(REVIEW_SENT_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveReviewSentState(state: Record<string, string[]>) {
  ensureStorage();
  fs.writeFileSync(REVIEW_SENT_PATH, JSON.stringify(state, null, 2), "utf8");
}

export function hasSentReviewReminderToday(studentLineUserId: string, now = new Date()): boolean {
  const key = toJstDateKey(now);
  const state = loadReviewSentState();
  return Array.isArray(state[key]) && state[key].includes(studentLineUserId);
}

export function markReviewReminderSentToday(studentLineUserId: string, now = new Date()): void {
  const key = toJstDateKey(now);
  const state = loadReviewSentState();
  const list = Array.isArray(state[key]) ? state[key] : [];
  if (!list.includes(studentLineUserId)) {
    list.push(studentLineUserId);
    state[key] = list;
  }
  // Keep only recent 14 days to bound file size.
  const keys = Object.keys(state).sort();
  if (keys.length > 14) {
    for (const oldKey of keys.slice(0, keys.length - 14)) {
      delete state[oldKey];
    }
  }
  saveReviewSentState(state);
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
