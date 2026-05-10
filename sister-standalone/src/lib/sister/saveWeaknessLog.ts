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
  /** どの工程・条件で詰まっているか（分析の主眼） */
  mistakeHint: string;
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

export type MistakeLogSource = "line-image";

export type WeaknessLog = {
  /** テーマ/復習候補として扱うユニークID */
  id: string;
  createdAt: string;
  /** LINE event の timestamp */
  timestamp: number;
  /** userId（LINEのsource.userId） */
  studentLineUserId: string;
  subject: ProblemImageAnalysis["subject"];
  /** 単元（分析の topicName） */
  unit: string;
  /** テーマ・問題の型（分析の problemType） */
  topic: string;
  /** 互換・理解ページ等: 単元ラベルと同一 */
  topicName: string;
  /** 詰まりどころ（保存の主眼） */
  mistakeHint: string;
  /** 信頼度（0-1） */
  confidenceScore: number;
  /** 元の LINE messageId（画像本体は保存しない） */
  originalMessageId: string;
  /** 復習タイミング算出のための状態 */
  reviewState: ReviewState;
  /** 記録の由来 */
  source: MistakeLogSource | string;
};

const STORAGE_DIR = process.env.VERCEL
  ? path.resolve("/tmp/sister-parent-monitor")
  : path.resolve(process.cwd(), "storage");
const DB_PATH = path.join(STORAGE_DIR, "sister-parent-monitor-logs.json");
const REVIEW_SENT_PATH = path.join(STORAGE_DIR, "review-reminder-state.json");

const MAX_STORED_TEXT = 500;

function clampStoredText(s: string, max = MAX_STORED_TEXT): string {
  const t = String(s || "").trim();
  return t.length <= max ? t : `${t.slice(0, max)}…`;
}

function ensureStorage() {
  if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

function normalizeLoadedLog(raw: any): WeaknessLog {
  const ar = raw?.analysisResult;
  const now = new Date();

  const subject: WeaknessLog["subject"] =
    raw?.subject ||
    ar?.subject ||
    "math";

  const topicName =
    typeof raw?.topicName === "string" && raw.topicName.trim()
      ? raw.topicName
      : typeof ar?.topicName === "string" && ar.topicName.trim()
        ? ar.topicName
        : "不明テーマ";

  const unit =
    typeof raw?.unit === "string" && raw.unit.trim()
      ? raw.unit.trim()
      : topicName;

  const topic =
    typeof raw?.topic === "string" && raw.topic.trim()
      ? raw.topic.trim()
      : typeof ar?.problemType === "string" && ar.problemType.trim()
        ? ar.problemType.trim()
        : typeof raw?.problemType === "string" && raw.problemType.trim()
          ? raw.problemType.trim()
          : "";

  const mistakeHint =
    (typeof raw?.mistakeHint === "string" && raw.mistakeHint.trim() ? raw.mistakeHint : "") ||
    (typeof raw?.missCause === "string" && raw.missCause.trim() ? raw.missCause : "") ||
    (typeof ar?.mistakeHint === "string" && ar.mistakeHint.trim() ? ar.mistakeHint : "") ||
    (typeof ar?.missCause === "string" && ar.missCause.trim() ? ar.missCause : "") ||
    "詰まりどころ不明";

  const confidenceScore =
    Number(raw?.confidenceScore ?? ar?.confidenceScore ?? 0.66) || 0.66;

  const originalMessageId =
    String(raw?.originalMessageId ?? raw?.messageId ?? raw?.imageId ?? "");

  const createdAt =
    typeof raw?.createdAt === "string" && raw.createdAt.trim()
      ? raw.createdAt
      : now.toISOString();

  const timestamp = Number(raw?.timestamp ?? now.getTime()) || now.getTime();

  const reviewState: ReviewState =
    raw?.reviewState && typeof raw.reviewState === "object"
      ? raw.reviewState
      : createInitialReviewState({
          itemId: originalMessageId || String(raw?.messageId || ""),
          missCause: mistakeHint,
          confidenceScore,
          now,
        });

  const sourceRaw = raw?.source;
  const source =
    typeof sourceRaw === "string" && sourceRaw.trim() ? sourceRaw.trim() : "line-image";

  return {
    id: String(raw?.id || `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`),
    createdAt,
    timestamp,
    studentLineUserId: String(raw?.studentLineUserId || ""),
    subject,
    unit: String(unit),
    topic: String(topic),
    topicName: String(topicName),
    mistakeHint: String(mistakeHint),
    confidenceScore,
    originalMessageId,
    reviewState,
    source,
  };
}

export function loadWeaknessLogs(): WeaknessLog[] {
  ensureStorage();
  if (!fs.existsSync(DB_PATH)) return [];
  try {
    const raw = fs.readFileSync(DB_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeLoadedLog);
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
  analysis: ProblemImageAnalysis;
  source?: MistakeLogSource | string;
}): WeaknessLog {
  const a = args.analysis;
  const mistakeHint = clampStoredText(a.mistakeHint || a.missCause);
  const conf = Number(a.confidenceScore || 0.6);
  const now = new Date();
  const unit = clampStoredText(a.topicName, 200);
  const topic = clampStoredText(a.problemType, 120);

  // 画像バイナリは保持しない。分析結果も JSON にはテキスト・構造化フィールドのみ
  const entry: WeaknessLog = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now.toISOString(),
    timestamp: Number(args.timestamp || now.getTime()),
    studentLineUserId: args.studentLineUserId,
    subject: a.subject,
    unit,
    topic,
    topicName: unit,
    mistakeHint,
    confidenceScore: conf,
    originalMessageId: String(args.messageId),
    source: args.source ?? "line-image",
    reviewState: createInitialReviewState({
      itemId: args.messageId,
      missCause: mistakeHint,
      confidenceScore: conf,
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
    missCause: args.missCause || current.mistakeHint,
  });

  logs[idx] = {
    ...current,
    reviewState: nextState,
  };
  saveWeaknessLogs(logs);
  return logs[idx];
}
