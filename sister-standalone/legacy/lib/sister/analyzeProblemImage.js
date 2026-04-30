const KNOWLEDGE_MAP = {
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
    "M2-equation": {
      name: "一次方程式・連立方程式",
      dependencies: ["M1-algebra"],
      entrancePriority: "HIGH",
      scoreStrategy: "立式から解答確認まで1問",
    },
  },
  science: {
    ion: {
      name: "イオンと水溶液",
      dependencies: ["S1-atomic_structure", "S2-chemical_formula"],
      entrancePriority: "HIGH",
      scoreStrategy: "電子増減を粒子モデルで確認",
    },
    "S2-chemical_formula": {
      name: "化学式・化学反応式",
      dependencies: ["S1-atomic_structure"],
      entrancePriority: "HIGH",
      scoreStrategy: "係数と原子数をそろえる練習",
    },
  },
};

function extractJsonObject(text) {
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

function fallbackByText(text) {
  const source = String(text || "");
  const lower = source.toLowerCase();
  const isScience = /(イオン|電池|化学|実験|中和|電子)/.test(source);
  const subject = isScience ? "science" : "math";
  let topicId = subject === "science" ? "ion" : "linear_function";
  if (subject === "math" && /(相似|証明|平行線|角)/.test(source)) topicId = "similarity";
  if (subject === "math" && /(方程式|連立)/.test(source)) topicId = "M2-equation";
  if (subject === "science" && /(化学式|反応式)/.test(source)) topicId = "S2-chemical_formula";
  const topic = KNOWLEDGE_MAP[subject]?.[topicId];

  const missCause = /計算ミス|符号|凡ミス/.test(source)
    ? "CARELESS"
    : /手順|途中|式変形/.test(source)
      ? "PROCEDURE_ERROR"
      : /わから|無理/.test(source)
        ? "BLANK"
        : "FRAGMENTS";

  return {
    subject,
    topicId,
    topicName: topic?.name ?? topicId,
    problemType: /図形|証明/.test(source)
      ? "図形"
      : /関数|グラフ/.test(source)
        ? "関数"
        : /実験|考察/.test(source)
          ? "実験考察"
          : "小問集合",
    missCause,
    prerequisiteGaps: (topic?.dependencies || []).slice(0, 2),
    entrancePriority: topic?.entrancePriority ?? "MIDDLE",
    nextReviewDays: topic?.entrancePriority === "HIGH" ? 1 : 2,
    nextAction: topic?.scoreStrategy ?? "基本1問を短時間で復習",
    hiddenWeaknessPatterns: isScience
      ? ["粒子視点で現象を追う部分が弱い", "用語暗記に寄りやすい"]
      : ["数量を比で捉える部分が弱い", "文章を式に変換する工程で止まりやすい"],
    recurringRootCause: isScience
      ? "粒子モデルへの変換不足"
      : "比例感覚の不安定さ",
    confidenceScore: 0.55,
    suggestedMicroTraining: isScience
      ? ["電子の増減を粒子図で1問確認", "実験結果→理由を1文で書く"]
      : ["変化量を比で言語化する30秒練習を3回", "文章を式に直す1問だけ実施"],
    studentMessage:
      "写真ありがとう。今日やるのは1ポイントだけでOK。10分で前に進めよう。",
    parentCheck:
      "今週の継続観察対象です。短時間で確認できる復習を1つだけ設定すると安定します。",
    extractedText: source.slice(0, 400),
    confidence: 0.55,
  };
}

export async function analyzeProblemImage({
  anthropicClient,
  imageBuffer,
  mimeType,
  noteText,
}) {
  if (!anthropicClient || !imageBuffer) return fallbackByText(noteText);
  try {
    const result = await anthropicClient.messages.create({
      model: process.env.ANTHROPIC_GATE_MODEL || "claude-haiku-4-5",
      max_tokens: 700,
      system: `あなたは福岡県公立高校入試対策の学習分析AI。
問題写真とメモを見て、答えは出さず、弱点分析だけをJSONで返す。
必ず以下のキーを含むJSONのみ返す:
{
 "subject":"math|science|english|social|japanese",
 "topicId":"string",
 "topicName":"string",
 "problemType":"string",
 "missCause":"BLANK|FRAGMENTS|LOGICAL_LEAP|PROCEDURE_ERROR|CARELESS|VERIFIED",
 "prerequisiteGaps":["string"],
 "entrancePriority":"HIGH|MIDDLE|LOW",
 "nextReviewDays":1,
 "nextAction":"string",
 "hiddenWeaknessPatterns":["string"],
 "recurringRootCause":"string|null",
 "confidenceScore":0.0,
 "suggestedMicroTraining":["string"],
 "studentMessage":"string",
 "parentCheck":"string",
 "extractedText":"string",
 "confidence":0.0
}`,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `メモ: ${noteText || "(なし)"}\n写真から問題内容を読み取り、学習ログ用に分類して。`,
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType || "image/jpeg",
                data: imageBuffer.toString("base64"),
              },
            },
          ],
        },
      ],
    });
    const text = result.content?.find((c) => c.type === "text")?.text || "";
    const parsed = extractJsonObject(text);
    if (!parsed) return fallbackByText(noteText);
    return {
      ...fallbackByText(noteText),
      ...parsed,
      confidence: Number(parsed.confidence ?? 0.65),
      confidenceScore: Number(parsed.confidenceScore ?? parsed.confidence ?? 0.65),
    };
  } catch {
    return fallbackByText(noteText);
  }
}
