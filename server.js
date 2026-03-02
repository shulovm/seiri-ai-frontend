import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "200kb" }));
app.use(express.static("public"));

const PORT = Number(process.env.PORT || 3001);
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = "claude-sonnet-4-20250514";

// ─── セッション管理 ───────────────────────────────────────────
const sessions = new Map();

function newSession() {
  return { created_at: Date.now(), last_question: null, pending_text: null, history: [] };
}

function getSession(id = "default") {
  if (!sessions.has(id)) sessions.set(id, newSession());
  return sessions.get(id);
}

function pushHist(session, role, content) {
  session.history.push({ role, content, ts: Date.now() });
  if (session.history.length > 40) session.history.splice(0, session.history.length - 40);
}

// ─── システムプロンプト ───────────────────────────────────────
const SYSTEM_PROMPT = `
あなたは「整理AI」です。答えを出すAIではありません。思考を壊さないためのAIです。

## 内部処理（出力しない）
入力を受け取ったら以下の3層で内部整理する。ラベルは絶対に出力しない。
- 行動レイヤー：何が起きているか（事実）
- 心理レイヤー：どんな解釈・感情が動いているか
- 意味レイヤー：どんな価値観・前提が背景にあるか

## 出力構造（固定・順序厳守）
1. 受け取り — ユーザーの言葉をそのまま使って1文で受け取る。禁止：「〜しようとしている」「〜を見つめている」「〜の可能性がある」。禁止：ユーザーや第三者の意図・動機・内面を推測する表現。例：「正義と自尊心、両方が同時にある状況ですね。」例：「攻撃されていると感じている状況ですね。」
2. 確認（必要な場合のみ） — 情報不足の時だけ1問。1文1問に限定する。複数の質問を1文にまとめない。固定文禁止。不要なら省略。
3. 整形 — ユーザーが言った言葉の中にある要素だけを分けて並べる。ユーザーが言っていないことを加えない。第三者の動機や内面を推測しない。禁止：「〜しようとしている」「〜の可能性がある」。断定しない。
4. 分かれ道 — 最大4つ（A/B/C/保留）を並列提示。各選択肢に1文で自然に特徴を添える（例：「A. 距離を置く — 少し楽になるかもしれないが、関係はそのまま残る」）。「メリット：」「デメリット：」などのラベルや箇条書きは使わない。優劣をつけない。具体的な手段・人物名は列挙しない。方向性だけ示す。
5. 境界線（必要な場合のみ） — 医療・法律・安全・他者への影響がある時だけ。事実として静かに。
6. 減速 — 「今すぐ決めなくていい。」それだけ。
7. 1つの問い — 答えを求めない。誘導しない。
8. 固定文 — 「判断はあなたにあります。ここで止めてもいい。」

## ラベル出力禁止
「受け取り」「整形」「分かれ道」「境界線」「減速」「1つの問い」「固定文」などのステップ名・見出し・番号を出力に含めない。
内容だけを自然な流れとして続けて出力する。Markdownの見出し（##、###）も使わない。

## 禁止事項
断定 / 善悪判定 / 人格定義 / 成功保証 / 緊急性演出 / 依存を生む表現 / 単線化
慰めや励ましの言葉 / 「あなたの価値は〜」「相手の問題です」などの評価・判定 / 選択肢への具体的な手段・人物の列挙
ユーザーが言っていない情報を先読みして提示すること（例：「いじめの可能性があります」など）
内部処理のラベルや分類名を出力すること — 「行動レイヤー」「心理レイヤー」「意味レイヤー」「事実として」「解釈として」などは絶対に出力しない
「内側」「内面」「奥」などユーザーの心理の深層を決めつける言葉を使うこと
ユーザーが言っていない感情や動機を推測して提示すること
「〜しようとしている」「〜を見つめている」などユーザーの意図・動機を推測して断定すること
ユーザーの行動の目的を決めること

## ユーザーが選択肢を選んだ場合
再び整理を展開しない。その選択を静かに受け取り、1つだけ問いを返して終わる。

## 文体
短く、静かに、低刺激。興奮させる言葉を使わない。
`;

// ─── 判定レイヤー（LLMで判定）────────────────────────────────
async function checkSafety(text) {
  const r = await client.messages.create({
    model: MODEL, max_tokens: 10,
    system: "テキスト分類器。「死にたい」「消えたい」「消えてしまいたい」「自分を傷つけたい」など明確な自傷・希死念慮・自殺の意図を示す表現がある場合のみ「yes」を返す。「悲しい」「つらい」「かなしい」「しんどい」など感情の表現だけでは「yes」を返さない。該当しなければ「no」のみ返す。",
    messages: [{ role: "user", content: text }],
  });
  return r.content[0]?.text?.trim().toLowerCase() === "yes";
}

async function checkBoundary(text) {
  const r = await client.messages.create({
    model: MODEL, max_tokens: 10,
    system: "テキスト分類器。他者への加害行為・法律問題・医療的問題があれば「yes」、なければ「no」のみ返す。",
    messages: [{ role: "user", content: text }],
  });
  return r.content[0]?.text?.trim().toLowerCase() === "yes";
}

async function checkClarify(text) {
  const r = await client.messages.create({
    model: MODEL, max_tokens: 100,
    system: `テキスト分析器。確認質問が必要なら {"needed":true,"question":"質問文"} 不要なら {"needed":false} JSON以外出力しない。`,
    messages: [{ role: "user", content: text }],
  });
  try { return JSON.parse(r.content[0]?.text?.trim() || "{}"); }
  catch { return { needed: false }; }
}

// ─── モード ───────────────────────────────────────────────────
function modeToTuning(mode) {
  if (mode === "soft")  return { maxTokens: 650, note: "少し寄り添いを増やして、柔らかく短め。" };
  if (mode === "short") return { maxTokens: 450, note: "短く要点のみ。行数を抑える。" };
  return { maxTokens: 1200, note: "標準。淡々と整理。必要十分。" };
}

// ─── 整理実行 ─────────────────────────────────────────────────
async function runOrganize({ session, mode, userText, hasBoundary }) {
  const { maxTokens, note } = modeToTuning(mode);
  const extra = hasBoundary
    ? "\n\n追加：他者への影響・法律・医療の要素あり。「5.境界線」を必ず含めること。事実として静かに。恐怖を使わない。"
    : "";
  const msgs = session.history.map(m => ({ role: m.role, content: m.content }));
  msgs.push({ role: "user", content: userText });
  const r = await client.messages.create({
    model: MODEL, max_tokens: maxTokens,
    system: `${SYSTEM_PROMPT}\n\n追加指示：${note}${extra}`,
    messages: msgs,
  });
  return r.content[0]?.text?.trim() || "";
}

async function runSafetyResponse() {
  const r = await client.messages.create({
    model: MODEL, max_tokens: 200, system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: "ユーザーが自傷または希死念慮を示唆しています。静かに、責めずに応答してください。" }],
  });
  const text = r.content[0]?.text?.trim() || "";
  return `${text}\n\n少し心配しています。今、誰かと話せる状況ですか。\n\nよりそいホットライン：0120-279-338（24時間）`;
}

// ─── エンドポイント ───────────────────────────────────────────
app.post("/api/organize", async (req, res) => {
  try {
    const sid  = String(req.body?.session_id || "default");
    const mode = String(req.body?.mode || "standard");
    const text = String(req.body?.text || "").trim();

    if (!text) return res.json({ session_id: sid, type: "info", message: "入力が空です。" });

    const session = getSession(sid);

    // 確認質問への回答
    if (session.last_question && session.pending_text) {
      const merged = `${session.pending_text}\n\n【確認への回答】${text}`.trim();
      pushHist(session, "user", session.pending_text);
      pushHist(session, "assistant", session.last_question);
      pushHist(session, "user", `回答: ${text}`);
      session.last_question = null;
      session.pending_text = null;

      if (await checkSafety(merged)) {
        const out = await runSafetyResponse();
        pushHist(session, "assistant", out);
        return res.json({ session_id: sid, type: "safety", output: out });
      }
      const output = await runOrganize({ session, mode, userText: merged, hasBoundary: await checkBoundary(merged) });
      pushHist(session, "assistant", output);
      return res.json({ session_id: sid, type: "result", output });
    }

    // 安全確認（最優先）
    if (await checkSafety(text)) {
      const out = await runSafetyResponse();
      pushHist(session, "user", text);
      pushHist(session, "assistant", out);
      return res.json({ session_id: sid, type: "safety", output: out });
    }

    // 曖昧さゲート
    const clarify = await checkClarify(text);
    if (clarify.needed && clarify.question) {
      session.last_question = clarify.question;
      session.pending_text = text;
      return res.json({ session_id: sid, type: "question", question: clarify.question });
    }

    // 整理
    const hasBoundary = await checkBoundary(text);
    pushHist(session, "user", text);
    const output = await runOrganize({ session, mode, userText: text, hasBoundary });
    pushHist(session, "assistant", output);
    return res.json({ session_id: sid, type: "result", output });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

app.get("/api/history", (req, res) => {
  const sid = String(req.query?.session_id || "default");
  return res.json({ session_id: sid, history: getSession(sid).history });
});

app.post("/api/reset", (req, res) => {
  const sid = String(req.body?.session_id || "default");
  sessions.set(sid, newSession());
  return res.json({ ok: true, session_id: sid });
});

app.listen(PORT, () => console.log(`✅ 整理AI: http://localhost:${PORT}`));
