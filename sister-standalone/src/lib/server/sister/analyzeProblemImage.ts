const KNOWLEDGE_MAP: any = {
  math: {
    linear_function: {
      name: "一次関数",
      dependencies: ["M1-algebra", "M2-equation"],
      entrancePriority: "HIGH",
      scoreStrategy: "グラフと式の往復を3問",
    },
    similarity: {
      name: "図形の相似",
      dependencies: ["M1-parallel_lines", "M2-congruence"],
      entrancePriority: "HIGH",
      scoreStrategy: "角の根拠を言語化して1問",
    },
  },
  science: {
    ion: {
      name: "イオンと水溶液",
      dependencies: ["S1-atomic_structure", "S2-chemical_formula"],
      entrancePriority: "HIGH",
      scoreStrategy: "電子増減を粒子モデルで確認",
    },
  },
};

function extractJsonObject(text: string) {
  if (!text) return null;
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

function fallbackByText(text: string) {
  const source = String(text || "");
  const isScience = /(イオン|電池|化学|実験|中和|電子)/.test(source);
  const subject = isScience ? "science" : "math";
  const topicId = isScience ? "ion" : /(相似|証明|平行線|角)/.test(source) ? "similarity" : "linear_function";
  const topic = KNOWLEDGE_MAP[subject]?.[topicId];

  return {
    subject,
    topicId,
    topicName: topic?.name ?? topicId,
    problemType: /図形|証明/.test(source) ? "図形" : /関数|グラフ/.test(source) ? "関数" : "小問集合",
    missCause: /計算ミス|符号|凡ミス/.test(source)
      ? "CARELESS"
      : /手順|途中|式変形/.test(source)
        ? "PROCEDURE_ERROR"
        : /わから|無理/.test(source)
          ? "BLANK"
          : "FRAGMENTS",
    prerequisiteGaps: (topic?.dependencies || []).slice(0, 2),
    entrancePriority: topic?.entrancePriority ?? "MIDDLE",
    nextReviewDays: topic?.entrancePriority === "HIGH" ? 1 : 2,
    nextAction: topic?.scoreStrategy ?? "基本1問を短時間で復習",
    hiddenWeaknessPatterns: isScience
      ? ["粒子視点で現象を追う部分が弱い", "用語暗記に寄りやすい"]
      : ["数量を比で捉える部分が弱い", "文章を式に変換する工程で止まりやすい"],
    recurringRootCause: isScience ? "粒子モデルへの変換不足" : "比例感覚の不安定さ",
    confidenceScore: 0.55,
    suggestedMicroTraining: isScience
      ? ["電子の増減を粒子図で1問確認", "実験結果→理由を1文で書く"]
      : ["変化量を比で言語化する30秒練習を3回", "文章を式に直す1問だけ実施"],
    studentMessage: "写真ありがとう。今日やるのは1ポイントだけでOK。10分で前に進めよう。",
    parentCheck: "今週の継続観察対象です。短時間で確認できる復習を1つだけ設定すると安定します。",
    extractedText: source.slice(0, 400),
    confidence: 0.55,
  };
}

export async function analyzeProblemImage({
  imageBuffer,
  mimeType,
  noteText,
}: {
  imageBuffer: Buffer;
  mimeType?: string;
  noteText?: string;
}) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || !imageBuffer) return fallbackByText(String(noteText || ""));
  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey });
    const safeMediaType =
      mimeType === "image/png" || mimeType === "image/gif" || mimeType === "image/webp" || mimeType === "image/jpeg"
        ? mimeType
        : "image/jpeg";
    const result = await client.messages.create({
      model: process.env.ANTHROPIC_GATE_MODEL || "claude-haiku-4-5",
      max_tokens: 700,
      system: `問題写真を学習ログ用JSONへ分類する。JSONのみ返す。`,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `メモ: ${noteText || "(なし)"}\n教科・単元・ミス原因・復習提案をJSON化して。`,
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: safeMediaType,
                data: imageBuffer.toString("base64"),
              },
            },
          ],
        },
      ],
    });
    const textBlock = result.content?.find((c: any) => c.type === "text") as { text?: string } | undefined;
    const text = textBlock?.text || "";
    const parsed = extractJsonObject(text);
    if (!parsed) return fallbackByText(String(noteText || ""));
    return {
      ...fallbackByText(String(noteText || "")),
      ...parsed,
      confidence: Number(parsed.confidence ?? 0.65),
      confidenceScore: Number(parsed.confidenceScore ?? parsed.confidence ?? 0.65),
    };
  } catch {
    return fallbackByText(String(noteText || ""));
  }
}
