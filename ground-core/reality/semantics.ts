/**
 * Reality Semantics v0.6.1
 *
 * decision/candidate 系の既存 SemanticEvent とは別に、
 * 現実の観測・進捗・意図を分類する薄いルールベース層。
 *
 * 配置: Reality Loop 専用。既存 rule-modality-v1 は変更しない。
 */

export type RealitySemanticKind =
  | "observation"
  | "progress"
  | "intention"
  | "ambiguous"
  | "unknown";

export interface RealityClassification {
  kind: RealitySemanticKind;
  confidence: number;
  evidence: string[];
  title: string;
  summary: string;
}

const INTENTION_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: "したい", pattern: /したい/ },
  { label: "進めたい", pattern: /進めたい/ },
  { label: "やりたい", pattern: /やりたい/ },
  { label: "作って実験したい", pattern: /作って.*したい/ },
  { label: "予定", pattern: /予定/ },
  { label: "これから", pattern: /これから/ },
];

const OBSERVATION_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: "実装した", pattern: /実装した/ },
  { label: "公開した", pattern: /公開した/ },
  { label: "完了した", pattern: /完了した/ },
  { label: "成立し", pattern: /成立し/ },
  { label: "だった", pattern: /だった/ },
  { label: "確認した", pattern: /確認した/ },
  { label: "記録した", pattern: /記録した/ },
  { label: "pass", pattern: /\bpass\b/i },
  { label: "fail", pattern: /\bfail\b/i },
  { label: "達成した", pattern: /達成した/ },
];

const PROGRESS_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: "移行しつつある", pattern: /移行しつつある/ },
  { label: "移行している", pattern: /移行している/ },
  { label: "移行中", pattern: /移行中/ },
  { label: "進んだ", pattern: /進んだ/ },
  { label: "進んでいる", pattern: /進んでいる/ },
  { label: "段階へ", pattern: /段階へ/ },
  { label: "から〜へ", pattern: /から.+へ/ },
  { label: "到達", pattern: /到達/ },
];

function matchLabels(
  text: string,
  patterns: Array<{ label: string; pattern: RegExp }>
): string[] {
  return patterns.filter(({ pattern }) => pattern.test(text)).map(({ label }) => label);
}

function deriveTitle(kind: RealitySemanticKind, text: string): string {
  const compact = text.trim().replace(/\s+/g, " ");
  const prefix =
    kind === "observation"
      ? "観測"
      : kind === "progress"
        ? "進捗"
        : kind === "intention"
          ? "意図"
          : "現実";
  if (compact.length <= 32) {
    return `${prefix}: ${compact}`;
  }
  return `${prefix}: ${compact.slice(0, 31)}…`;
}

/**
 * Reality input を observation / progress / intention 等へ分類する。
 *
 * 優先順位（意味の安全性）:
 * 1. intention — 未実行意思を完了事実にしないため最優先で分離
 * 2. observation — 完了・確認の事実
 * 3. progress — 移行・前進（完了断定しない表現を含む）
 * 4. ambiguous / unknown
 */
export function classifyRealityText(inputText: string): RealityClassification {
  const text = inputText.trim();
  if (text.length < 4) {
    return {
      kind: "unknown",
      confidence: 0.2,
      evidence: ["input_too_short"],
      title: "不明",
      summary: text,
    };
  }

  const intention = matchLabels(text, INTENTION_PATTERNS);
  const observation = matchLabels(text, OBSERVATION_PATTERNS);
  const progress = matchLabels(text, PROGRESS_PATTERNS);

  // 意図と完了事実が同時に強い場合は曖昧 — 人間に確認
  if (intention.length > 0 && observation.length > 0) {
    return {
      kind: "ambiguous",
      confidence: 0.45,
      evidence: [...intention, ...observation],
      title: deriveTitle("ambiguous", text),
      summary: text,
    };
  }

  if (intention.length > 0) {
    return {
      kind: "intention",
      confidence: Math.min(0.86, 0.62 + intention.length * 0.08),
      evidence: intention,
      title: deriveTitle("intention", text),
      summary: text,
    };
  }

  // progress と observation が同時でも、progress 表現があれば progress 優先
  // （観測根拠は draft 側で observation entity として残す）
  if (progress.length > 0) {
    return {
      kind: "progress",
      confidence: Math.min(0.88, 0.64 + progress.length * 0.07),
      evidence: [...progress, ...observation],
      title: deriveTitle("progress", text),
      summary: text,
    };
  }

  if (observation.length > 0) {
    return {
      kind: "observation",
      confidence: Math.min(0.9, 0.68 + observation.length * 0.06),
      evidence: observation,
      title: deriveTitle("observation", text),
      summary: text,
    };
  }

  if (text.length < 12) {
    return {
      kind: "unknown",
      confidence: 0.25,
      evidence: ["too_vague"],
      title: "不明",
      summary: text,
    };
  }

  return {
    kind: "unknown",
    confidence: 0.3,
    evidence: ["no_reality_pattern"],
    title: "不明",
    summary: text,
  };
}
