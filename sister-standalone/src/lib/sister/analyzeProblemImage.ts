import type { ProblemImageAnalysis } from "./saveWeaknessLog";

const KNOWLEDGE_MAP = {
  math: {
    linear_function: {
      topicName: "一次関数",
      entrancePriority: "HIGH",
      nextAction: "グラフ→式の類題を3問",
      prerequisiteGaps: ["M1-algebra", "M2-equation"],
    },
    similarity: {
      topicName: "図形の相似",
      entrancePriority: "HIGH",
      nextAction: "角の根拠を言語化する類題を1問",
      prerequisiteGaps: ["M1-parallel_lines", "M2-congruence"],
    },
  },
  science: {
    ion: {
      topicName: "イオンと水溶液",
      entrancePriority: "HIGH",
      nextAction: "粒子モデルで電子の増減を1問確認",
      prerequisiteGaps: ["S1-atomic_structure", "S2-chemical_formula"],
    },
  },
} as const;

function byFallbackText(text: string): ProblemImageAnalysis {
  const src = String(text || "");
  const isScience = /(イオン|電池|中和|電子|化学)/.test(src);
  const subject: ProblemImageAnalysis["subject"] = isScience ? "science" : "math";
  const topicId = isScience
    ? "ion"
    : /(相似|平行線|角|証明)/.test(src)
      ? "similarity"
      : "linear_function";
  const node =
    subject === "science"
      ? KNOWLEDGE_MAP.science.ion
      : topicId === "similarity"
        ? KNOWLEDGE_MAP.math.similarity
        : KNOWLEDGE_MAP.math.linear_function;

  return {
    subject,
    topicId,
    topicName: node.topicName,
    problemType: isScience ? "実験考察" : /図形|証明/.test(src) ? "図形証明" : "関数",
    missCause: /計算ミス|符号|凡ミス/.test(src)
      ? "ケアレスミス"
      : /手順|途中|順番/.test(src)
        ? "手順ミス"
        : "根拠の言語化不足",
    prerequisiteGaps: [...node.prerequisiteGaps],
    entrancePriority: node.entrancePriority,
    nextReviewDays: node.entrancePriority === "HIGH" ? 1 : 2,
    nextAction: node.nextAction,
    studentMessage:
      subject === "math"
        ? "写真ありがとう。\nこれは「数学」の問題っぽい。\n今日は1ポイントだけ確認しよう。"
        : "写真ありがとう。\nこれは「理科」の問題っぽい。\n今日は1ポイントだけ確認しよう。",
    parentCheck:
      subject === "math"
        ? "今週は数学の同系統が続いています。週末に5分だけ親チェックすると安定しやすいです。"
        : "理科の理解は積み上げ型です。電子の増減だけ週末に短く親チェックすると効果的です。",
    hiddenWeaknessPatterns:
      subject === "math"
        ? ["変化量を比で捉えるところで止まりやすい", "文章を式に変換する工程で迷いやすい"]
        : ["粒子視点より用語暗記が先に立ちやすい", "結果と理由の接続で止まりやすい"],
    recurringRootCause:
      subject === "math" ? "数量関係を式へ変換する前段整理の不安定さ" : "粒子モデルへの変換不足",
    confidenceScore: 0.66,
    suggestedMicroTraining:
      subject === "math"
        ? ["数量関係を図で整理してから式にする1問", "xが1増えた時のy増加量を口で説明する練習"]
        : ["電子の増減を粒子図で1問確認", "実験結果→理由を1文でつなぐ練習"],
  };
}

export async function analyzeProblemImage(input: {
  imageBuffer: Buffer;
  mimeType?: string;
  noteText?: string;
}): Promise<ProblemImageAnalysis> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || !input.imageBuffer) {
    return byFallbackText(input.noteText || "");
  }

  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey });
    const mediaType =
      input.mimeType === "image/png" ||
      input.mimeType === "image/gif" ||
      input.mimeType === "image/webp" ||
      input.mimeType === "image/jpeg"
        ? input.mimeType
        : "image/jpeg";

    const resp = await client.messages.create({
      model: process.env.ANTHROPIC_GATE_MODEL || "claude-haiku-4-5",
      max_tokens: 500,
      system:
        "福岡県公立高校入試向け学習ログ分類器。答えは出さず、JSONのみを返す。key: subject,topicId,topicName,problemType,missCause,prerequisiteGaps,entrancePriority,nextReviewDays,nextAction,studentMessage,parentCheck,hiddenWeaknessPatterns,recurringRootCause,confidenceScore,suggestedMicroTraining",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: `補助メモ: ${input.noteText || "なし"}` },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: input.imageBuffer.toString("base64"),
              },
            },
          ],
        },
      ],
    });

    const text = (resp.content.find((c: any) => c.type === "text") as { text?: string } | undefined)?.text || "";
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) return byFallbackText(input.noteText || "");

    const parsed = JSON.parse(text.slice(start, end + 1));
    return {
      ...byFallbackText(input.noteText || ""),
      ...parsed,
      entrancePriority:
        parsed.entrancePriority === "HIGH" || parsed.entrancePriority === "LOW" ? parsed.entrancePriority : "MIDDLE",
      prerequisiteGaps: Array.isArray(parsed.prerequisiteGaps) ? parsed.prerequisiteGaps.slice(0, 3) : [],
      nextReviewDays: Math.max(1, Number(parsed.nextReviewDays || 1)),
      hiddenWeaknessPatterns: Array.isArray(parsed.hiddenWeaknessPatterns)
        ? parsed.hiddenWeaknessPatterns.slice(0, 4)
        : byFallbackText(input.noteText || "").hiddenWeaknessPatterns,
      recurringRootCause:
        typeof parsed.recurringRootCause === "string" && parsed.recurringRootCause.trim().length > 0
          ? parsed.recurringRootCause
          : byFallbackText(input.noteText || "").recurringRootCause,
      confidenceScore: Number(parsed.confidenceScore || 0.66),
      suggestedMicroTraining: Array.isArray(parsed.suggestedMicroTraining)
        ? parsed.suggestedMicroTraining.slice(0, 3)
        : byFallbackText(input.noteText || "").suggestedMicroTraining,
    };
  } catch {
    return byFallbackText(input.noteText || "");
  }
}
