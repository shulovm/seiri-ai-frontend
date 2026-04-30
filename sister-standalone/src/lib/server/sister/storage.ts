import fs from "node:fs";
import path from "node:path";
import {
  createInitialReviewState,
  pickTodayReviewItems,
  type ReviewState,
  updateReviewStateAfterAttempt,
} from "./smartReviewEngine";

const STORAGE_DIR = process.env.VERCEL ? path.resolve("/tmp/sister-storage") : path.resolve(process.cwd(), "storage");
const IMAGE_DIR = path.join(STORAGE_DIR, "line-images");
const DB_PATH = path.join(STORAGE_DIR, "sister-weakness-logs.json");

export type WeaknessLog = {
  id: string;
  createdAt: string;
  studentLineUserId: string;
  parentLineUserId: string;
  messageId: string;
  imagePath: string;
  subject: string;
  topicId: string;
  topicName: string;
  problemType: string;
  missCause: string;
  prerequisiteGaps: string[];
  entrancePriority: "HIGH" | "MIDDLE" | "LOW";
  nextReviewDate: string;
  nextAction: string;
  hiddenWeaknessPatterns: string[];
  recurringRootCause: string | null;
  suggestedMicroTraining: string[];
  extractedText: string;
  confidence: number;
  confidenceScore: number;
  reviewState: ReviewState;
};

function ensureStorage() {
  if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });
  if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

function loadDb(): WeaknessLog[] {
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

function saveDb(logs: WeaknessLog[]) {
  ensureStorage();
  fs.writeFileSync(DB_PATH, JSON.stringify(logs, null, 2), "utf8");
}

export function persistLineImage({
  imageBuffer,
  ext = "jpg",
  messageId,
}: {
  imageBuffer: Buffer;
  ext?: string;
  messageId: string;
}) {
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

export function saveWeaknessLog({
  studentLineUserId,
  parentLineUserId,
  messageId,
  imagePath,
  analysis,
}: {
  studentLineUserId: string;
  parentLineUserId: string;
  messageId: string;
  imagePath: string;
  analysis: any;
}) {
  const logs = loadDb();
  const now = new Date();
  const next = new Date(now);
  next.setDate(now.getDate() + Math.max(1, Number(analysis.nextReviewDays || 2)));

  const entry: WeaknessLog = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now.toISOString(),
    studentLineUserId,
    parentLineUserId,
    messageId,
    imagePath,
    subject: analysis.subject,
    topicId: analysis.topicId,
    topicName: analysis.topicName,
    problemType: analysis.problemType,
    missCause: analysis.missCause,
    prerequisiteGaps: Array.isArray(analysis.prerequisiteGaps) ? analysis.prerequisiteGaps : [],
    entrancePriority: analysis.entrancePriority || "MIDDLE",
    nextReviewDate: next.toISOString(),
    nextAction: analysis.nextAction || "基本1問を復習",
    hiddenWeaknessPatterns: Array.isArray(analysis.hiddenWeaknessPatterns)
      ? analysis.hiddenWeaknessPatterns.slice(0, 5)
      : [],
    recurringRootCause: analysis.recurringRootCause || null,
    suggestedMicroTraining: Array.isArray(analysis.suggestedMicroTraining)
      ? analysis.suggestedMicroTraining.slice(0, 3)
      : [],
    extractedText: analysis.extractedText || "",
    confidence: Number(analysis.confidence || 0.5),
    confidenceScore: Number(analysis.confidenceScore || analysis.confidence || 0.5),
    reviewState: createInitialReviewState({
      itemId: messageId || "",
      missCause: analysis.missCause,
      confidenceScore: Number(analysis.confidenceScore || analysis.confidence || 0.5),
      now,
    }),
  };
  logs.unshift(entry);
  saveDb(logs);
  return entry;
}

export function loadWeaknessLogs() {
  return loadDb();
}

export function getTodaySmartReview(studentLineUserId: string) {
  const logs = loadDb();
  const scoped = studentLineUserId ? logs.filter((x) => x.studentLineUserId === studentLineUserId) : logs;
  return pickTodayReviewItems(scoped);
}

export function markReviewAttempt({
  logId,
  isCorrect,
  answerTimeSec,
  missCause,
}: {
  logId: string;
  isCorrect: boolean;
  answerTimeSec?: number | null;
  missCause?: string | null;
}) {
  const logs = loadDb();
  const idx = logs.findIndex((x) => x.id === logId);
  if (idx < 0) return null;
  const current = logs[idx];
  const nextState = updateReviewStateAfterAttempt({
    reviewState: current.reviewState,
    isCorrect: Boolean(isCorrect),
    answerTimeSec,
    missCause: missCause || current.missCause,
  });
  logs[idx] = {
    ...current,
    reviewState: nextState,
    nextReviewDate: nextState.nextReviewAt,
  };
  saveDb(logs);
  return logs[idx];
}
