import type { LogicLevel, Subject } from "./sisterThoughtOS";
import { KNOWLEDGE_MAP } from "./sisterThoughtOS";

export type ProblemType =
  | "小問集合"
  | "計算"
  | "文章題"
  | "関数"
  | "図形"
  | "実験考察"
  | "用語整理"
  | "不明";

export interface MistakePhotoLog {
  id: string;
  createdAt: string;
  photoName: string;
  photoDataUrl: string;
  subject: Subject;
  topicId: string;
  topicName: string;
  problemType: ProblemType;
  missCause: LogicLevel;
  prerequisiteConcepts: string[];
  entrancePriority: "HIGH" | "MIDDLE" | "LOW";
  nextReviewDate: string;
  reviewMenu: string[];
  sourceText: string;
}

export interface WeeklyWeaknessRank {
  key: string;
  label: string;
  count: number;
  priority: "HIGH" | "MIDDLE" | "LOW";
  recommendedAction: string;
}

const STORAGE_KEY = "sister_mistake_photo_logs";

export function loadMistakeLogs(): MistakePhotoLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

export function saveMistakeLog(log: MistakePhotoLog): void {
  const list = loadMistakeLogs();
  list.unshift(log);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("sister:logs"));
  } catch (_) {}
}

export function getTodayStudyMenu(logs: MistakePhotoLog[]): string[] {
  const today = new Date();
  const due = logs
    .filter((log) => new Date(log.nextReviewDate).getTime() <= today.getTime())
    .slice(0, 5);

  if (due.length === 0) {
    return ["今日は復習期限の問題なし。直近ログから高優先度を1問だけ再演習する"];
  }

  return due.map((log) => {
    const firstAction = log.reviewMenu[0] ?? "根拠を1つ言語化する";
    return `${labelSubject(log.subject)} ${log.topicName}（${log.problemType}）: ${firstAction}`;
  });
}

export function getWeeklyWeaknessRanking(logs: MistakePhotoLog[]): WeeklyWeaknessRank[] {
  const from = new Date();
  from.setDate(from.getDate() - 7);
  const targets = logs.filter((log) => new Date(log.createdAt).getTime() >= from.getTime());

  const map = new Map<string, WeeklyWeaknessRank>();
  for (const log of targets) {
    const key = `${log.subject}:${log.topicId}`;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        key,
        label: `${labelSubject(log.subject)} / ${log.topicName}`,
        count: 1,
        priority: log.entrancePriority,
        recommendedAction: log.reviewMenu[0] ?? "前提知識の再確認",
      });
      continue;
    }
    existing.count += 1;
    if (priorityScore(log.entrancePriority) > priorityScore(existing.priority)) {
      existing.priority = log.entrancePriority;
      existing.recommendedAction = log.reviewMenu[0] ?? existing.recommendedAction;
    }
  }

  return [...map.values()].sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return priorityScore(b.priority) - priorityScore(a.priority);
  });
}

export function analyzeMistakePhoto(params: {
  fileName: string;
  photoDataUrl: string;
  noteText?: string;
}): MistakePhotoLog {
  const base = `${params.fileName} ${params.noteText || ""}`.toLowerCase();
  const subject = inferSubject(base);
  const topicId = inferTopicId(subject, base);
  const topic = KNOWLEDGE_MAP[subject]?.[topicId];
  const missCause = inferMissCause(base);
  const reviewMenu = buildReviewMenu(subject, topicId, missCause);
  const nextReviewDate = calcNextReviewDate(
    topic?.entrancePriority ?? "MIDDLE",
    missCause
  );

  return {
    id: makeId(),
    createdAt: new Date().toISOString(),
    photoName: params.fileName,
    photoDataUrl: params.photoDataUrl,
    subject,
    topicId,
    topicName: topic?.name ?? topicId,
    problemType: inferProblemType(base),
    missCause,
    prerequisiteConcepts:
      (topic?.dependencies || []).map(
        (dep) => findConceptNameByTopicId(dep) ?? dep
      ) || [],
    entrancePriority: topic?.entrancePriority ?? "MIDDLE",
    nextReviewDate,
    reviewMenu,
    sourceText: (params.noteText || "").slice(0, 300),
  };
}

function inferSubject(text: string): Subject {
  if (/(化学|電池|イオン|実験|生物|地層|気体|反応)/.test(text)) return "science";
  if (/(関数|相似|方程式|図形|角度|証明|数学|x|y)/.test(text)) return "math";
  return "math";
}

function inferTopicId(subject: Subject, text: string): string {
  if (subject === "science") {
    if (/(イオン|電池|中和|電気分解)/.test(text)) return "ion";
    if (/(反応式|化学式)/.test(text)) return "S2-chemical_formula";
    return "S1-atomic_structure";
  }
  if (/(相似|証明|平行線)/.test(text)) return "similarity";
  if (/(関数|グラフ|変化の割合)/.test(text)) return "linear_function";
  if (/(方程式|連立)/.test(text)) return "M2-equation";
  return "M1-algebra";
}

function inferProblemType(text: string): ProblemType {
  if (/(証明|図形|角度)/.test(text)) return "図形";
  if (/(関数|グラフ)/.test(text)) return "関数";
  if (/(実験|考察|結果)/.test(text)) return "実験考察";
  if (/(用語|語句|名称)/.test(text)) return "用語整理";
  if (/(文章題|割合|速さ)/.test(text)) return "文章題";
  if (/(計算|式)/.test(text)) return "計算";
  return "小問集合";
}

function inferMissCause(text: string): LogicLevel {
  if (/(わからん|全然|無理|空白)/.test(text)) return "BLANK";
  if (/(途中|手順|順番|式変形)/.test(text)) return "PROCEDURE_ERROR";
  if (/(つまり|よって|だから|答えは)/.test(text)) return "LOGICAL_LEAP";
  if (/(計算ミス|符号|写し|単位|凡ミス)/.test(text)) return "CARELESS";
  if (/(少し|たぶん|ここまでは)/.test(text)) return "FRAGMENTS";
  return "FRAGMENTS";
}

function buildReviewMenu(
  subject: Subject,
  topicId: string,
  missCause: LogicLevel
): string[] {
  const head = subject === "math" ? "数学" : "理科";
  const baseTopic = KNOWLEDGE_MAP[subject]?.[topicId]?.name ?? topicId;
  const base = `${head} ${baseTopic}`;

  if (missCause === "BLANK") {
    return [`${base}の前提単元を5分で確認`, `${base}の基本1問を口頭で説明`];
  }
  if (missCause === "PROCEDURE_ERROR") {
    return [`${base}の手順を3ステップで書く`, "同タイプを1問だけ再演習"];
  }
  if (missCause === "LOGICAL_LEAP") {
    return ["根拠を1行追加する練習を1問", `${base}で「なぜ」を2回言語化`];
  }
  if (missCause === "CARELESS") {
    return ["符号・単位・条件チェックを最後に実施", "制限時間を1分短くして再挑戦"];
  }
  return [`${base}の基本例題を1問復習`, "できた手順を短文で残す"];
}

function calcNextReviewDate(
  priority: "HIGH" | "MIDDLE" | "LOW",
  missCause: LogicLevel
): string {
  const baseDays = priority === "HIGH" ? 1 : priority === "MIDDLE" ? 2 : 4;
  const delta = missCause === "BLANK" ? 0 : missCause === "CARELESS" ? 1 : 0;
  const d = new Date();
  d.setDate(d.getDate() + baseDays + delta);
  return d.toISOString();
}

function labelSubject(subject: Subject): string {
  if (subject === "science") return "理科";
  if (subject === "math") return "数学";
  if (subject === "english") return "英語";
  if (subject === "social") return "社会";
  return "国語";
}

function findConceptNameByTopicId(id: string): string | null {
  for (const subject of Object.keys(KNOWLEDGE_MAP) as Subject[]) {
    const hit = KNOWLEDGE_MAP[subject][id];
    if (hit) return hit.name;
  }
  return null;
}

function priorityScore(priority: "HIGH" | "MIDDLE" | "LOW"): number {
  if (priority === "HIGH") return 3;
  if (priority === "MIDDLE") return 2;
  return 1;
}

function makeId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
