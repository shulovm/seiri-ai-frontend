import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let _anthropicClient = null;
async function getAnthropicClient() {
  if (!_anthropicClient) {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    _anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _anthropicClient;
}

const app = express();
const allowedOrigins = String(process.env.CORS_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (allowedOrigins.length === 0) return cb(null, true);
    return cb(null, allowedOrigins.includes(origin));
  },
}));
app.use(express.json({ limit: "200kb" }));

const isVercel = process.env.VERCEL === "1";
if (isVercel) {
  app.use((req, res, next) => {
    if (!req.path.startsWith("/api")) {
      req.url = "/api" + (req.url.startsWith("/") ? req.url : "/" + req.url);
    }
    next();
  });
}
const PORT = Number(process.env.PORT || 3001);
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = String(process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514");
const GATE_MODEL = String(process.env.ANTHROPIC_GATE_MODEL || (isVercel ? "claude-haiku-4-5" : MODEL));
const MAX_INPUT_CHARS = Number(process.env.MAX_INPUT_CHARS || 8000);
const LLM_TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS || (isVercel ? 35000 : 90000));
const GATE_TIMEOUT_MS = Number(process.env.GATE_TIMEOUT_MS || (isVercel ? 20000 : 40000));
const SESSION_TTL_MS = Number(process.env.SESSION_TTL_MS || 1000 * 60 * 60 * 6);
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 60);

// ─── レート制限（セッション単位）────────────────────────────────
const rateLimitMap = new Map();
function checkRateLimit(sid) {
  const now = Date.now();
  let list = rateLimitMap.get(sid) || [];
  list = list.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
  if (list.length >= RATE_LIMIT_MAX) return false;
  list.push(now);
  rateLimitMap.set(sid, list);
  return true;
}

// ─── セッション管理 ───────────────────────────────────────────
const sessions = new Map();

function newSession() {
  const now = Date.now();
  return { created_at: now, last_seen: now, last_question: null, pending_text: null, history: [] };
}

function getSession(id = "default") {
  if (!sessions.has(id)) sessions.set(id, newSession());
  const s = sessions.get(id);
  s.last_seen = Date.now();
  return s;
}

const MAX_HISTORY_LEN = 60;
function pushHist(session, role, content) {
  session.history.push({ role, content, ts: Date.now() });
  if (session.history.length > MAX_HISTORY_LEN) session.history.splice(0, session.history.length - MAX_HISTORY_LEN);
}

// 古いセッションの掃除（メモリ増加を抑える）
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [id, s] of sessions.entries()) {
    if (now - (s.last_seen || s.created_at || now) > SESSION_TTL_MS) sessions.delete(id);
  }
}, 60_000);
cleanupTimer.unref?.();

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
5. 境界線（必要な場合のみ） — 医療・法律・安全・他者への影響がある時だけ。1文で事実として静かに。長い注意書きにしない。
6. 減速 — 「今すぐ決めなくていい。」それだけ。
7. 1つの問い — 答えを求めない。誘導しない。1文だけ。
8. 固定文 — 「判断はあなたにあります。ここで止めてもいい。」
分かれ道のあとは、境界線・減速・問い・固定文を簡潔に短く。だらだら続けない。

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
「〜そのものと、それに対するあなたの感覚」のように、事象と「あなたの感覚」を分けて定義する表現は禁止。ユーザーの内面を決めつけない。

## ユーザーが選択肢を選んだ場合
再び整理を展開しない。その選択を静かに受け取り、1つだけ問いを返して終わる。

## 文体
短く、静かに、低刺激。興奮させる言葉を使わない。
`;

function extractJsonObject(text) {
  if (!text) return null;
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  const slice = text.slice(start, end + 1);
  try { return JSON.parse(slice); } catch { return null; }
}

function withTimeout(promise, ms, message = "timeout") {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms)),
  ]);
}

// ─── 判定レイヤー（LLMでまとめて判定）────────────────────────
async function analyzeInput(text, { needClarify } = { needClarify: true }) {
  const system = `
あなたはテキスト分類器。必ずJSONだけを返す（前後に説明文を付けない）。

出力形式:
{
  "safety": boolean,
  "boundary": boolean,
  "clarify": { "needed": boolean, "question": string | null }
}

判定ルール:
- safety は「死にたい」「消えたい」「自分を傷つけたい」など、明確な自傷・希死念慮・自殺の意図を示す表現がある場合のみ true。単なる感情（つらい/悲しい/しんどい等）だけなら false。
- boundary は、他者への加害行為・法律問題・医療的問題が含まれる場合 true。なければ false。
- clarify は、情報不足で確認質問が「必須」の場合のみ needed=true。質問は日本語で1文1問。複数質問を1文にまとめない。不要なら needed=false, question=null。
`;

  const client = await getAnthropicClient();
  const r = await withTimeout(
    client.messages.create({
      model: GATE_MODEL,
      max_tokens: isVercel ? 120 : 180,
      system: needClarify ? system : `${system}\nclarify は常に { "needed": false, "question": null } にする。`,
      messages: [{ role: "user", content: text }],
    }),
    GATE_TIMEOUT_MS,
    "analyze_timeout"
  );

  const raw = r.content[0]?.text?.trim() || "";
  const json = extractJsonObject(raw) || {};
  return {
    safety: Boolean(json.safety),
    boundary: Boolean(json.boundary),
    clarify: {
      needed: Boolean(json.clarify?.needed),
      question: typeof json.clarify?.question === "string" ? json.clarify.question : null,
    },
  };
}

// ─── モード ───────────────────────────────────────────────────
function modeToTuning(mode) {
  if (isVercel) {
    if (mode === "short") return { maxTokens: 380, note: "短く要点のみ。行数を抑える。" };
    if (mode === "soft")  return { maxTokens: 480, note: "少し寄り添いを増やして、柔らかく短め。" };
    return { maxTokens: 550, note: "標準。淡々と整理。必要十分。簡潔に。" };
  }
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
  const client = await getAnthropicClient();
  const r = await withTimeout(
    client.messages.create({
      model: MODEL, max_tokens: maxTokens,
      system: `${SYSTEM_PROMPT}\n\n追加指示：${note}${extra}`,
      messages: msgs,
    }),
    LLM_TIMEOUT_MS,
    "organize_timeout"
  );
  return r.content[0]?.text?.trim() || "";
}

async function runSafetyResponse() {
  const client = await getAnthropicClient();
  const r = await withTimeout(
    client.messages.create({
      model: MODEL, max_tokens: 200, system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: "ユーザーが自傷または希死念慮を示唆しています。静かに、責めずに応答してください。" }],
    }),
    LLM_TIMEOUT_MS,
    "safety_timeout"
  );
  const text = r.content[0]?.text?.trim() || "";
  return `${text}\n\n少し心配しています。今、誰かと話せる状況ですか。\n\nよりそいホットライン：0120-279-338（24時間）`;
}

// ─── Vercel 用：1回のLLM呼び出しで判定＋整理（60秒制限内に確実に返す）────────────────
const SINGLE_CALL_SYSTEM = `
## 応答形式（必ず次のいずれか1つだけを、先頭のラベル改行のあとに本文を書く）
- [SAFETY] … 自傷・希死念慮を示す表現がある場合のみ。静かに受け止め、責めず。そのあと本文。
- [CLARIFY] … 情報不足で1問だけ確認が必須の場合のみ。1文1問。そのあと本文。
- [RESULT] … 上記以外。整理AIとして通常の出力（受け取り・整形・分かれ道・減速・1つの問い・固定文）。ラベルは出力しない。

判定ルール:
- [SAFETY] は「死にたい」「消えたい」「自分を傷つけたい」など明確な自傷・希死念慮のみ。つらい/悲しい/しんどい等だけなら使わない。
- [CLARIFY] は情報不足で確認が必須のときだけ。不要なら [RESULT] で整理する。
- それ以外は必ず [RESULT] で、下記の整理AIのルールに従う。
` + SYSTEM_PROMPT;

function parseSingleCallResponse(raw) {
  const text = (raw || "").trim();
  if (text.startsWith("[SAFETY]")) {
    const body = text.slice(8).trim();
    return { type: "safety", output: body ? `${body}\n\n少し心配しています。今、誰かと話せる状況ですか。\n\nよりそいホットライン：0120-279-338（24時間）` : "少し心配しています。今、誰かと話せる状況ですか。\n\nよりそいホットライン：0120-279-338（24時間）" };
  }
  if (text.startsWith("[CLARIFY]")) {
    const question = text.slice(9).trim().split("\n")[0].trim();
    return { type: "question", question: question || "もう少し教えてもらえますか？" };
  }
  if (text.startsWith("[RESULT]")) return { type: "result", output: text.slice(8).trim() };
  return { type: "result", output: text };
}

async function runOrganizeVercelSingle({ session, mode, userText, isMerged }) {
  const { maxTokens, note } = modeToTuning(mode);
  const system = SINGLE_CALL_SYSTEM + `\n\n追加指示：${note}`;
  const msgs = session.history.map(m => ({ role: m.role, content: m.content }));
  const lastUser = msgs.filter(m => m.role === "user").pop();
  if (!lastUser || lastUser.content !== userText) msgs.push({ role: "user", content: userText });
  const client = await getAnthropicClient();
  const r = await withTimeout(
    client.messages.create({
      model: MODEL,
      max_tokens: isVercel ? Math.min(maxTokens, 550) : Math.min(maxTokens, 500),
      system,
      messages: msgs,
    }),
    isVercel ? 70000 : LLM_TIMEOUT_MS,
    "organize_timeout"
  );
  const raw = r.content[0]?.text?.trim() || "";
  return parseSingleCallResponse(raw);
}

function writeSSE(res, obj) {
  try {
    res.write("data: " + JSON.stringify(obj) + "\n\n");
  } catch (_) {}
}

async function runOrganizeVercelStream(res, clearRequestTimeout, sid, session, mode, userText, isMerged) {
  clearRequestTimeout();
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();
  writeSSE(res, { started: true });

  const { maxTokens, note } = modeToTuning(mode);
  const msgs = session.history.map(m => ({ role: m.role, content: m.content }));
  const lastUser = msgs.filter(m => m.role === "user").pop();
  if (!lastUser || lastUser.content !== userText) msgs.push({ role: "user", content: userText });

  try {
    const client = await getAnthropicClient();
    const block1Prompt = `
必ず次のいずれか1つで始め、ラベル行の改行のあとに本文を書く。
[SAFETY] … 自傷・希死念慮のみ。その受け止めだけ。
[CLARIFY] … 受け取り+確認1問のみ。
[RESULT] … 受け取り+確認(必要なら)+整形のみ。分かれ道・減速・問い・固定文は書かない。
禁止：「〜そのものと、それに対するあなたの感覚」のような表現。
` + SYSTEM_PROMPT;
    const block1Res = await withTimeout(
      client.messages.create({
        model: GATE_MODEL,
        max_tokens: 220,
        system: block1Prompt,
        messages: msgs,
      }),
      isVercel ? 15000 : 20000,
      "receive_timeout"
    );
    const block1Raw = (block1Res.content[0]?.text?.trim() || "").trim();
    const block1Parsed = parseSingleCallResponse(block1Raw);
    const block1Text = block1Parsed.output || block1Parsed.question || block1Raw || "受け取りました。";
    writeSSE(res, { part: "block1", text: block1Text });

    if (block1Parsed.type === "safety") {
      pushHist(session, "assistant", block1Text);
      writeSSE(res, { done: true, session_id: sid, type: "safety", output: block1Text, question: null });
    } else if (block1Parsed.type === "question") {
      session.last_question = block1Parsed.question;
      session.pending_text = userText;
      pushHist(session, "assistant", block1Text);
      writeSSE(res, { done: true, session_id: sid, type: "question", output: block1Text, question: block1Parsed.question });
    } else {
      const restSystem = SINGLE_CALL_SYSTEM + `\n\n受け取り・確認・整形はすでに送った。出力では書かず、[RESULT] で 分かれ道（A-D）・境界線(必要なら)・減速・1つの問い・固定文だけを出力。\n\n追加指示：${note}`;
      const streamModel = isVercel ? GATE_MODEL : MODEL;
      const streamMaxTokens = isVercel ? 280 : Math.min(maxTokens, 480);
      const stream = client.messages.stream({
        model: streamModel,
        max_tokens: streamMaxTokens,
        system: restSystem,
        messages: msgs,
      });
      stream.on("text", (text) => writeSSE(res, { chunk: text }));
      const msg = await withTimeout(stream.finalMessage(), isVercel ? 35000 : 60000, "organize_timeout");
      const streamedRaw = (msg.content[0]?.text?.trim() || "").trim();
      const restParsed = parseSingleCallResponse(streamedRaw);
      const restOutput = restParsed.output || "";
      const fullOutput = block1Text + "\n\n" + restOutput;
      pushHist(session, "assistant", fullOutput);
      writeSSE(res, { done: true, session_id: sid, type: "result", output: fullOutput, question: null });
    }
  } catch (err) {
    writeSSE(res, {
      error: err?.message === "organize_timeout" || err?.message === "receive_timeout" ? "timeout" : (err?.message || "stream error"),
    });
  } finally {
    res.end();
  }
}

// ─── エンドポイント ───────────────────────────────────────────
const REQUEST_TIMEOUT_MS = isVercel ? 55000 : 85000;

app.post("/api/organize", async (req, res) => {
  let requestTimeoutId;
  const clearRequestTimeout = () => {
    if (requestTimeoutId) clearTimeout(requestTimeoutId);
  };
  const send = (status, body) => {
    clearRequestTimeout();
    if (status === 200) return res.json(body);
    return res.status(status).json(body);
  };

  try {
    await Promise.race([
      new Promise((_, reject) => {
        requestTimeoutId = setTimeout(() => reject(new Error("request_timeout")), REQUEST_TIMEOUT_MS);
      }),
      (async () => {
        const sid  = String(req.body?.session_id || "default");
        const mode = String(req.body?.mode || "standard");
        const text = String(req.body?.text || "").trim();

        if (!ANTHROPIC_API_KEY) return send(500, { error: "ANTHROPIC_API_KEY is missing" });
        if (!text) return send(200, { session_id: sid, type: "info", output: "入力が空です。" });
        if (text.length > MAX_INPUT_CHARS) {
          return send(200, { session_id: sid, type: "info", output: `入力が長すぎます（最大 ${MAX_INPUT_CHARS} 文字）。` });
        }
        if (!checkRateLimit(sid)) {
          return send(429, { session_id: sid, type: "info", output: "送信が多すぎます。1分ほど待ってからお試しください。" });
        }

        const session = getSession(sid);

        if (session.last_question && session.pending_text) {
          const merged = `${session.pending_text}\n\n【確認への回答】${text}`.trim();
          pushHist(session, "user", session.pending_text);
          pushHist(session, "assistant", session.last_question);
          pushHist(session, "user", `回答: ${text}`);
          session.last_question = null;
          session.pending_text = null;

          if (isVercel) {
            await runOrganizeVercelStream(res, clearRequestTimeout, sid, session, mode, merged, true);
            return;
          }
          const gate = await analyzeInput(merged, { needClarify: false });
          if (gate.safety) {
            const out = await runSafetyResponse();
            pushHist(session, "assistant", out);
            return send(200, { session_id: sid, type: "safety", output: out });
          }
          const output = await runOrganize({ session, mode, userText: merged, hasBoundary: gate.boundary });
          pushHist(session, "assistant", output);
          return send(200, { session_id: sid, type: "result", output });
        }

        if (isVercel) {
          pushHist(session, "user", text);
          await runOrganizeVercelStream(res, clearRequestTimeout, sid, session, mode, text, false);
          return;
        }

        const gate = await analyzeInput(text, { needClarify: true });
        if (gate.safety) {
          const out = await runSafetyResponse();
          pushHist(session, "user", text);
          pushHist(session, "assistant", out);
          return send(200, { session_id: sid, type: "safety", output: out });
        }
        if (gate.clarify.needed && gate.clarify.question) {
          session.last_question = gate.clarify.question;
          session.pending_text = text;
          return send(200, { session_id: sid, type: "question", question: gate.clarify.question });
        }
        pushHist(session, "user", text);
        const output = await runOrganize({ session, mode, userText: text, hasBoundary: gate.boundary });
        pushHist(session, "assistant", output);
        return send(200, { session_id: sid, type: "result", output });
      })(),
    ]);
  } catch (err) {
    clearRequestTimeout();
    if (res.headersSent) return;
    try {
      if (err?.message === "request_timeout" || err?.message === "analyze_timeout" || err?.message === "organize_timeout" || err?.message === "safety_timeout") {
        const sid = String(req.body?.session_id || "default");
        return res.status(503).json({
          session_id: sid,
          type: "info",
          output: "応答が遅れています。\n\nもう一度送るか、1〜2文だけ「短め」で送ってみてください。",
        });
      }
      console.error(err);
      const safeMsg = err?.message && String(err.message).length < 100 && !/key|secret|password/i.test(String(err.message))
        ? String(err.message)
        : "server error";
      return res.status(500).json({ error: "server error", output: safeMsg });
    } catch (sendErr) {
      console.error("send error", sendErr);
    }
  }
});

app.get("/api/ping", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  return res.json({ ok: true, t: Date.now(), vercel: isVercel });
});

app.get("/api/history", (req, res) => {
  const sid = String(req.query?.session_id || "default");
  return res.json({ session_id: sid, history: getSession(sid).history });
});

app.get("/api/health", (_req, res) => {
  const hasKey = Boolean(ANTHROPIC_API_KEY && ANTHROPIC_API_KEY.length > 10);
  return res.json({
    ok: hasKey,
    anthropic: hasKey ? "set" : "missing",
  });
});

app.post("/api/reset", (req, res) => {
  const sid = String(req.body?.session_id || "default");
  sessions.set(sid, newSession());
  return res.json({ ok: true, session_id: sid });
});

const apiOnly = process.env.API_ONLY === "1";

// API_ONLY のとき /ma/ で案内を表示（空白を防ぐ）
if (!isVercel && apiOnly) {
  app.get("/", (req, res) => res.redirect(302, "/ma/"));
  app.get("/ma", (req, res) => res.redirect(302, "/ma/"));
  const apiOnlyHtml = `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>MA</title></head>
<body style="font-family:sans-serif;padding:2rem;background:#f3eee6;color:#554a3f;max-width:480px;margin:0 auto;">
  <h1 style="font-size:1.25rem;">MA</h1>
  <p>このデプロイは API 専用です。アプリを表示するには:</p>
  <ol style="line-height:1.8;">
    <li>Railway の <strong>Variables</strong> で <code>API_ONLY</code> を削除する</li>
    <li><strong>Settings</strong> の Build で <strong>Build Command</strong> に <code>npm run build</code> を設定する</li>
    <li>再デプロイする</li>
  </ol>
  <p style="margin-top:1.5rem;font-size:0.9em;color:#8a7d6f;">API は <a href="/api/health">/api/health</a> で確認できます。</p>
</body>
</html>`;
  app.get("/ma/", (req, res) => res.type("html").send(apiOnlyHtml));
  app.get(/^\/ma\/.+/, (req, res) => res.redirect(302, "/ma/"));
}

// ローカル用: フロント配信・リダイレクト（Vercel / API_ONLY では静的配信しない）
if (!isVercel && !apiOnly) {
  const frontendRoot = path.resolve(__dirname, "dist");
  const distExists = fs.existsSync(frontendRoot) && fs.existsSync(path.join(frontendRoot, "index.html"));
  if (distExists) {
    app.use("/ma", express.static(frontendRoot));
  }
  app.get("/", (req, res) => res.redirect(302, "/ma/"));
  app.get("/ma", (req, res) => res.redirect(302, "/ma/"));
  const maFallbackHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MA</title>
</head>
<body style="font-family:sans-serif;padding:2rem;background:#f3eee6;color:#554a3f;">
  <h1 style="font-size:1.5rem;">MA</h1>
  <p>フロントをビルドしてください。</p>
  <pre style="background:#e5dccf;padding:1rem;border-radius:8px;">npm run build</pre>
  <p>実行後、もう一度 <a href="/ma/">/ma/</a> を開いてください。</p>
</body>
</html>
`;
  app.get(/^\/ma\/.+/, (req, res, next) => {
    if (!distExists) {
      res.type("html").send(maFallbackHtml);
      return;
    }
    res.sendFile("index.html", { root: frontendRoot }, (err) => {
      if (err) next();
    });
  });
}
if (!isVercel) {
  app.listen(PORT, () => {
    if (apiOnly) {
      console.log(`✅ MA API only: http://localhost:${PORT}/api/organize など`);
    } else {
      const url = `http://localhost:${PORT}/ma/`;
      console.log(`✅ MA: ${url}`);
      const frontendRoot = path.resolve(__dirname, "dist");
      const distExists = fs.existsSync(frontendRoot) && fs.existsSync(path.join(frontendRoot, "index.html"));
      if (!distExists) console.log("   ※ dist がありません。npm run build を実行してください。");
    }
  });
}

export { app };
