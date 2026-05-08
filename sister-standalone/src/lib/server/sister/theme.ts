import { loadWeaknessLogs } from "@/lib/sister/saveWeaknessLog";

function subjectLabelJa(subject: string) {
  if (subject === "math") return "数学";
  if (subject === "science") return "理科";
  if (subject === "english") return "英語";
  if (subject === "social") return "社会";
  return "国語";
}

export function createThemeFromLog(log: any) {
  const themeTitle = `${subjectLabelJa(log.subject)}・${log.topicName}`;
  const focus =
    (typeof log?.mistakeHint === "string" && log.mistakeHint.trim()) || "詰まりどころ不明";
  const essence = focus;
  const isMathLinear = log.subject === "math" && /一次関数/.test(String(log.topicName || ""));
  const quickCheck = isMathLinear
    ? "グラフが y軸と2で交わり、xが1増えるとyが3増えるとき、式はどうなる？"
    : log.subject === "math"
      ? "この問題で最初に使う条件を1つだけ言ってみよう。"
      : "結果を見て、理由を1文で言ってみよう。";

  const essenceText = isMathLinear
    ? [
        "一次関数は「スタート地点」と「増え方」を見る問題。",
        "切片 = スタート地点、傾き = xが1増えた時のyの増え方。",
      ].join("\n")
    : `本質は「${essence}」を先に押さえることです。`;

  const anotherViewText = isMathLinear
    ? [
        "図で見る：切片はy軸との交点、傾きは右に1進んだ時の上下の量。",
        "式で見る：y = ax + b（a=増え方、b=スタート地点）。",
        "入試で見る：グラフ・表・文章からaとbを探す。",
      ].join("\n")
    : log.subject === "math"
      ? "グラフや式は別物ではなく、同じ関係を見方だけ変えていると考えると整理しやすい。"
      : "用語はラベル。粒子や現象の動きを先に追うと理解が安定しやすい。";

  return {
    themeId: log.id,
    title: `${themeTitle}：${isMathLinear ? "グラフから式を作る考え方" : "次に同じミスをしないための理解"}`,
    stumble: `最近の解答を見ると「${focus}」で止まりやすい可能性があります。`,
    essence: essenceText,
    anotherView: anotherViewText,
    faq: [
      {
        q: "こういう時はどこを見る？",
        a: "最初に条件を1つ、次に使う知識を1つだけ選ぶと迷いにくいです。",
      },
      {
        q: "なんでその考え方になるの？",
        a: "計算より前に、何が増減しているかを決めると根拠が崩れにくいです。",
      },
    ],
    microTrainings: [
      `「${log.topicName}」で「${focus}」が出る場面を1回だけ確認`,
      `今度は同じ詰まりを避けるために「根拠を1文」で言ってみよう`,
    ],
    quickCheckQuestion: quickCheck,
  };
}

const sisterThemeQuestionCount = new Map<string, number>();

export function getLatestTheme(studentId = "") {
  const logs = loadWeaknessLogs();
  const target = logs.find((x) => !studentId || x.studentLineUserId === studentId) || logs[0];
  if (!target) {
    return { ok: true, hasTheme: false, message: "まだ理解テーマがありません。" };
  }
  return { ok: true, hasTheme: true, theme: createThemeFromLog(target) };
}

export function answerThemeQuestion({
  themeId,
  studentId,
  question,
}: {
  themeId: string;
  studentId: string;
  question: string;
}) {
  const key = `${studentId}:${themeId}`;
  const current = Number(sisterThemeQuestionCount.get(key) || 0);
  if (current >= 3) {
    return {
      done: true,
      answer: "ここまでで十分進んでる。",
      followup: "今日は確認1問を終えて終了にしよう。",
      remaining: 0,
    };
  }
  sisterThemeQuestionCount.set(key, current + 1);

  const isAllowed = /(なんで|こういう時|別の見方|どうする|いつ使う|違い|見分け|どこを見)/.test(question);
  if (!isAllowed) {
    return {
      done: false,
      answer: "その気分も大事だね。",
      followup: "ここでは理解を深める質問を1つだけ。次は確認1問へ進もう。",
      remaining: Math.max(0, 3 - (current + 1)),
    };
  }

  const logs = loadWeaknessLogs();
  const log = logs.find((x) => x.id === themeId) || logs[0];
  const oneView =
    (typeof log?.mistakeHint === "string" && log.mistakeHint.trim()) ||
    "条件と知識を1つずつ結びつける";
  const anotherView = log?.subject === "math" ? "図→式でつなぐ視点を1つ試す" : "言葉→根拠の順で1文を作る";

  return {
    done: false,
    answer: `いい質問。まずは「${oneView}」の視点で見よう。`,
    followup: `別視点なら「${anotherView}」を1つだけ試して、確認1問に戻ろう。`,
    remaining: Math.max(0, 3 - (current + 1)),
  };
}
