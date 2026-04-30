import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import { SYSTEM_PROMPT_SHORT } from "./prompts/system.js";
import { verifyLineSignature } from "./lib/line/verifySignature.js";
import { fetchLineMessageContent, pushLineMessage } from "./lib/line/client.js";
import { analyzeProblemImage } from "./lib/sister/analyzeProblemImage.js";
import {
  persistLineImage,
  saveWeaknessLog,
  loadWeaknessLogs,
  getTodaySmartReview,
  markReviewAttempt,
} from "./lib/sister/saveWeaknessLog.js";
import { sendParentSummary, sendStudentShortReply } from "./lib/sister/sendParentSummary.js";
import { startWeeklyReportScheduler, sendWeeklyReportNow } from "./lib/sister/sendWeeklyReport.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let _anthropicClient = null;
let _stripeClient = null;
async function getAnthropicClient() {
  if (!_anthropicClient) {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    _anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _anthropicClient;
}

async function getStripeClient() {
  if (!STRIPE_SECRET_KEY) return null;
  if (!_stripeClient) {
    const { default: Stripe } = await import("stripe");
    _stripeClient = new Stripe(STRIPE_SECRET_KEY);
  }
  return _stripeClient;
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
app.use(express.json({
  limit: "200kb",
  verify(req, _res, buf) {
    if (req.originalUrl === "/api/billing/webhook" || req.originalUrl === "/api/line/webhook") {
      req.rawBody = buf?.toString("utf8") || "";
    }
  },
}));

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
const STRIPE_SECRET_KEY = String(process.env.STRIPE_SECRET_KEY || "");
const STRIPE_WEBHOOK_SECRET = String(process.env.STRIPE_WEBHOOK_SECRET || "");
const STRIPE_PRICE_MAP = {
  light: String(process.env.STRIPE_PRICE_LIGHT || ""),
  standard: String(process.env.STRIPE_PRICE_STANDARD || ""),
  premium: String(process.env.STRIPE_PRICE_PREMIUM || ""),
};
const LINE_CHANNEL_ACCESS_TOKEN = String(process.env.LINE_CHANNEL_ACCESS_TOKEN || "");
const LINE_CHANNEL_SECRET = String(process.env.LINE_CHANNEL_SECRET || "");
const PARENT_LINE_USER_ID = String(process.env.PARENT_LINE_USER_ID || "");
const STUDENT_LINE_USER_ID = String(process.env.STUDENT_LINE_USER_ID || "");
const APP_BASE_URL = String(process.env.APP_BASE_URL || "");
const DAILY_LIMITS = {
  free: 5,
  light: 20,
  standard: null,
  premium: null,
};

// ─── レート制限（セッション単位）────────────────────────────────
const rateLimitMap = new Map();
const dailyUsageMap = new Map();
const billingBySessionId = new Map();
const customerToSessionId = new Map();
function checkRateLimit(sid) {
  const now = Date.now();
  let list = rateLimitMap.get(sid) || [];
  list = list.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
  if (list.length >= RATE_LIMIT_MAX) return false;
  list.push(now);
  rateLimitMap.set(sid, list);
  return true;
}

function normalizePlanId(planId) {
  const v = String(planId || "").trim().toLowerCase();
  if (v === "light" || v === "standard" || v === "premium") return v;
  return "free";
}

function getDailyUsageKey(sid) {
  const day = new Date().toISOString().slice(0, 10);
  return `${sid}::${day}`;
}

function checkDailyLimit(sid, planId) {
  const normalized = normalizePlanId(planId);
  const limit = DAILY_LIMITS[normalized];
  if (limit == null) return { ok: true, remaining: null, limit: null, planId: normalized };
  const key = getDailyUsageKey(sid);
  const used = Number(dailyUsageMap.get(key) || 0);
  if (used >= limit) return { ok: false, remaining: 0, limit, planId: normalized };
  dailyUsageMap.set(key, used + 1);
  return { ok: true, remaining: Math.max(0, limit - (used + 1)), limit, planId: normalized };
}

function upsertBillingState(sessionId, partial) {
  const prev = billingBySessionId.get(sessionId) || {
    session_id: sessionId,
    plan_id: "free",
    active: false,
    customer_id: null,
    subscription_id: null,
    updated_at: Date.now(),
  };
  const next = {
    ...prev,
    ...partial,
    session_id: sessionId,
    updated_at: Date.now(),
  };
  billingBySessionId.set(sessionId, next);
  if (next.customer_id) customerToSessionId.set(next.customer_id, sessionId);
  return next;
}

function resolvePlanByPriceId(priceId) {
  if (!priceId) return "free";
  const found = Object.entries(STRIPE_PRICE_MAP).find(([, id]) => id && id === priceId);
  return found?.[0] || "free";
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
  for (const key of dailyUsageMap.keys()) {
    const day = key.split("::")[1] || "";
    if (!day) {
      dailyUsageMap.delete(key);
      continue;
    }
    const keyDate = new Date(`${day}T00:00:00.000Z`).getTime();
    if (Number.isNaN(keyDate)) {
      dailyUsageMap.delete(key);
      continue;
    }
    if (now - keyDate > 1000 * 60 * 60 * 48) dailyUsageMap.delete(key);
  }
}, 60_000);
cleanupTimer.unref?.();

// ─── システムプロンプト（system.js のみ読み込み）──────────────
const SYSTEM_PROMPT = SYSTEM_PROMPT_SHORT;

// 全出力経路で強制するルール（GROUND 返答時のみ適用）
const OUTPUT_FORCE_RULES = `
## 出力強制ルール（必ず守る）
- GROUNDは「答えるAI」ではなく「思考を整理するAI」。アドバイス・結論・人生判断は出さない。診断AIではない。
- 出力は最大3文・120文字程度を目安に短くする。長い雑談は禁止。
- 感情は1文で受け止めるが、会話を広げる質問は禁止。すぐ学習導線へ戻す。
- 返答の最後は「次の一手（5分・1問・1ステップ）」を示す。
- ノリの良い会話、キャラ立ち、ボケツッコミ、雑談を広げる展開は禁止。
`;

function getLangInstruction(lang) {
  if (lang === "en") return "\n\n【言語】必ず英語で返す。共感・箇条書き・まとめ・質問・カードラベルもすべて英語。Reply in English only.";
  return "\n\n【言語】必ず日本語で返す。共感・箇条書き・まとめ・質問・カードラベルもすべて日本語。";
}

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

function isSmallTalkText(text) {
  const t = String(text || "").trim();
  if (!t) return false;
  const casualSignals = [
    "だるい",
    "暇",
    "雑談",
    "恋愛相談",
    "つかれた",
    "疲れた",
    "眠い",
    "やる気でない",
    "なんとなく",
    "ひま",
  ];
  return casualSignals.some((s) => t.includes(s));
}

function buildStudyRedirectReply(text) {
  const t = String(text || "");
  if (t.includes("恋愛")) {
    return "それも大事な話だね。\nでも私は勉強担当だから、まず今日の課題を3分で終わらせよう。";
  }
  if (t.includes("暇") || t.includes("ひま")) {
    return "少し休むのもあり。\n終わったら、数学1問だけ片づけよう。";
  }
  if (t.includes("だるい") || t.includes("疲れ") || t.includes("つかれ")) {
    return "そういう日もあるね。\n今日は5分だけ、昨日ミスした問題を見よう。";
  }
  return "少しなら大丈夫。\nその前に、今日の復習1つを先に終わらせよう。";
}

function subjectLabelJa(subject) {
  if (subject === "math") return "数学";
  if (subject === "science") return "理科";
  if (subject === "english") return "英語";
  if (subject === "social") return "社会";
  return "国語";
}

function createThemeFromLog(log) {
  const themeTitle = `${subjectLabelJa(log.subject)}・${log.topicName}`;
  const focus = log.hiddenWeaknessPatterns?.[0] || "条件の読み取りと手順の接続";
  const essence = log.recurringRootCause || focus;
  const quickCheck =
    log.subject === "math"
      ? "xが1増えるとyがいくつ増えるかを1行で言ってみよう。"
      : "結果を見て、理由を1文で言ってみよう。";
  return {
    themeId: log.id,
    title: `${themeTitle}：次に同じミスをしないための理解`,
    stumble: `最近の解答を見ると「${focus}」で止まりやすい可能性があります。`,
    essence: `本質は「${essence}」を先に押さえることです。`,
    anotherView:
      log.subject === "math"
        ? "式は計算の道具というより、増え方をメモしたものと考えると整理しやすい。"
        : "用語はラベル。まず粒子や現象の動きとして見ると理解しやすい。",
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
    microTrainings: Array.isArray(log.suggestedMicroTraining)
      ? log.suggestedMicroTraining
      : [log.nextAction],
    quickCheckQuestion: quickCheck,
  };
}

function buildThemePageUrl(themeId, studentId = "") {
  if (!APP_BASE_URL) return "";
  const qs = new URLSearchParams();
  if (themeId) qs.set("themeId", themeId);
  if (studentId) qs.set("studentId", studentId);
  return `${APP_BASE_URL.replace(/\/$/, "")}/sister/understanding?${qs.toString()}`;
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
  const forceNote = "出力は最大8行。共感→構造→自然な言語化または近い質問（質問は必須ではない）。ユーザーの言葉のみ。型を繰り返さない。「詳しく教えて」禁止。A/B/C/D・長い要約禁止。";
  if (isVercel) {
    if (mode === "short") return { maxTokens: 320, note: `短く。${forceNote}` };
    if (mode === "soft")  return { maxTokens: 360, note: `柔らかく短め。${forceNote}` };
    return { maxTokens: 380, note: forceNote };
  }
  if (mode === "soft")  return { maxTokens: 400, note: `柔らかく短め。${forceNote}` };
  if (mode === "short") return { maxTokens: 320, note: `短く。${forceNote}` };
  return { maxTokens: 420, note: forceNote };
}

// ─── 整理実行 ─────────────────────────────────────────────────
async function runOrganize({ session, mode, userText, hasBoundary, lang }) {
  const { maxTokens, note } = modeToTuning(mode);
  const langHint = getLangInstruction(lang === "en" ? "en" : "ja");
  const extra = hasBoundary
    ? "\n\n追加：他者への影響・法律・医療の要素あり。境界線を1文で事実として静かに。恐怖を使わない。"
    : "";
  const msgs = session.history.map(m => ({ role: m.role, content: m.content }));
  msgs.push({ role: "user", content: userText });
  const client = await getAnthropicClient();
  const r = await withTimeout(
    client.messages.create({
      model: MODEL, max_tokens: maxTokens,
      system: `${OUTPUT_FORCE_RULES}${langHint}\n\n${SYSTEM_PROMPT}\n\n追加指示：${note}${extra}`,
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
const SINGLE_CALL_SYSTEM = OUTPUT_FORCE_RULES + `
## 応答形式（必ず次のいずれか1つだけを、先頭のラベル改行のあとに本文を書く）
- [SAFETY] … 自傷・希死念慮を示す表現がある場合のみ。静かに受け止め、責めず。そのあと本文。
- [CLARIFY] … 情報不足で1問だけ確認が必須の場合のみ。1文1問。そのあと本文。
- [RESULT] … 上記以外。必ず「共感1行→構造1〜3個→自然な言語化 または 近い質問」の順。質問は必須ではない。最大8行。ユーザーの言葉のみで構造化。A/B/C/D・詳しく教えて・型の繰り返しは禁止。ラベルは出力しない。

判定ルール:
- [SAFETY] は「死にたい」「消えたい」「自分を傷つけたい」など明確な自傷・希死念慮のみ。つらい/悲しい/しんどい等だけなら使わない。
- [CLARIFY] は情報不足で確認が必須のときだけ。不要なら [RESULT] で整理する。
- それ以外は必ず [RESULT] で、下記のGROUNDのルールに従う。
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

async function runOrganizeVercelSingle({ session, mode, userText, isMerged, lang }) {
  const { maxTokens, note } = modeToTuning(mode);
  const langHint = getLangInstruction(lang === "en" ? "en" : "ja");
  const system = SINGLE_CALL_SYSTEM + langHint + `\n\n追加指示：${note}`;
  const msgs = session.history.map(m => ({ role: m.role, content: m.content }));
  const lastUser = msgs.filter(m => m.role === "user").pop();
  if (!lastUser || lastUser.content !== userText) msgs.push({ role: "user", content: userText });
  const client = await getAnthropicClient();
  const r = await withTimeout(
    client.messages.create({
      model: MODEL,
      max_tokens: isVercel ? Math.min(maxTokens, 400) : Math.min(maxTokens, 420),
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

async function runOrganizeVercelStream(res, clearRequestTimeout, sid, session, mode, userText, isMerged, lang) {
  clearRequestTimeout();
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();
  writeSSE(res, { started: true });

  const { maxTokens, note } = modeToTuning(mode);
  const langHint = getLangInstruction(lang === "en" ? "en" : "ja");
  const msgs = session.history.map(m => ({ role: m.role, content: m.content }));
  const lastUser = msgs.filter(m => m.role === "user").pop();
  if (!lastUser || lastUser.content !== userText) msgs.push({ role: "user", content: userText });

  try {
    const client = await getAnthropicClient();
    const block1Prompt = OUTPUT_FORCE_RULES + langHint + `
必ず次のいずれか1つで始め、ラベル行の改行のあとに本文を書く。
[SAFETY] … 自傷・希死念慮のみ。その受け止めだけ。
[CLARIFY] … 共感1行のあと、確認1問のみ。
[RESULT] … 必ず「共感1行→構造（カード用）1〜3個→自然な言語化 または 近い質問」の順。質問は必須ではない。最大8行。ユーザーの言葉のみ。A/B/C/D・アドバイス・型の繰り返しは禁止。
禁止：「〜そのものと、それに対するあなたの感覚」のような表現。
` + SYSTEM_PROMPT;
    const block1Res = await withTimeout(
      client.messages.create({
        model: GATE_MODEL,
        max_tokens: 320,
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
      const restSystem = SINGLE_CALL_SYSTEM + langHint + `\n\n共感・構造はblock1で送済み。この出力では [RESULT] で自然な言語化 または 近い質問（質問は必須ではない。2行以内）。A/B/C/D・アドバイス・「どうしたい？」は絶対に出さない。\n\n追加指示：${note}`;
      const streamModel = isVercel ? GATE_MODEL : MODEL;
      const streamMaxTokens = isVercel ? 120 : Math.min(maxTokens, 150);
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
const sisterThemeQuestionCount = new Map();

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
        const planId = normalizePlanId(req.body?.plan_id);
        const lang = req.body?.lang === "en" ? "en" : "ja";

        if (!ANTHROPIC_API_KEY) return send(500, { error: "ANTHROPIC_API_KEY is missing" });
        if (!text) return send(200, { session_id: sid, type: "info", output: "入力が空です。" });
        if (text.length > MAX_INPUT_CHARS) {
          return send(200, { session_id: sid, type: "info", output: `入力が長すぎます（最大 ${MAX_INPUT_CHARS} 文字）。` });
        }
        if (!checkRateLimit(sid)) {
          return send(429, { session_id: sid, type: "info", output: "送信が多すぎます。1分ほど待ってからお試しください。" });
        }
        const daily = checkDailyLimit(sid, planId);
        if (!daily.ok) {
          const output = lang === "en"
            ? (planId === "free"
              ? `You've reached today's limit (${daily.limit} messages/day) on the Free plan. Please try again tomorrow or upgrade your plan.`
              : `You've reached today's limit (${daily.limit} messages/day). Please try again tomorrow.`)
            : (planId === "free"
              ? `フリープランの本日の上限（${daily.limit}回）に達しました。明日また試すか、プランの変更をご検討ください。`
              : `本日の上限（${daily.limit}回）に達しました。明日またお試しください。`);
          return send(429, { session_id: sid, type: "info", output });
        }

        if (isSmallTalkText(text)) {
          const output = buildStudyRedirectReply(text);
          return send(200, { session_id: sid, type: "result", output });
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
            await runOrganizeVercelStream(res, clearRequestTimeout, sid, session, mode, merged, true, lang);
            return;
          }
          const gate = await analyzeInput(merged, { needClarify: false });
          if (gate.safety) {
            const out = await runSafetyResponse();
            pushHist(session, "assistant", out);
            return send(200, { session_id: sid, type: "safety", output: out });
          }
          const output = await runOrganize({ session, mode, userText: merged, hasBoundary: gate.boundary, lang });
          pushHist(session, "assistant", output);
          return send(200, { session_id: sid, type: "result", output });
        }

        if (isVercel) {
          pushHist(session, "user", text);
          await runOrganizeVercelStream(res, clearRequestTimeout, sid, session, mode, text, false, lang);
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
        const output = await runOrganize({ session, mode, userText: text, hasBoundary: gate.boundary, lang });
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

// ドメイン監視用: APIプレフィックスなしでも軽量ヘルス確認できるようにする
app.get("/ping", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  return res.json({ ok: true, t: Date.now(), vercel: isVercel });
});

app.get("/healthz", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const hasKey = Boolean(ANTHROPIC_API_KEY && ANTHROPIC_API_KEY.length > 10);
  return res.json({ ok: hasKey, anthropic: hasKey ? "set" : "missing" });
});

app.post("/api/reset", (req, res) => {
  const sid = String(req.body?.session_id || "default");
  sessions.set(sid, newSession());
  return res.json({ ok: true, session_id: sid });
});

app.post("/api/billing/checkout", async (req, res) => {
  const planId = normalizePlanId(req.body?.plan_id);
  const sid = String(req.body?.session_id || "default");
  const successUrl = String(req.body?.success_url || "").trim();
  const cancelUrl = String(req.body?.cancel_url || "").trim();

  if (planId === "free") {
    return res.status(400).json({ error: "free plan does not require checkout" });
  }
  if (!successUrl || !cancelUrl) {
    return res.status(400).json({ error: "success_url and cancel_url are required" });
  }
  const priceId = STRIPE_PRICE_MAP[planId];
  if (!priceId) {
    return res.status(503).json({ error: `stripe price is not configured for ${planId}` });
  }

  try {
    const stripe = await getStripeClient();
    if (!stripe) return res.status(503).json({ error: "stripe is not configured" });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      client_reference_id: sid,
      metadata: { plan_id: planId, session_id: sid },
    });
    if (!session.url) return res.status(500).json({ error: "checkout session url is missing" });
    return res.json({ ok: true, url: session.url });
  } catch (err) {
    console.error("stripe checkout error", err);
    return res.status(500).json({ error: "failed to create checkout session" });
  }
});

app.post("/api/billing/webhook", async (req, res) => {
  try {
    const stripe = await getStripeClient();
    if (!stripe) return res.status(503).json({ error: "stripe is not configured" });
    if (!STRIPE_WEBHOOK_SECRET) return res.status(503).json({ error: "stripe webhook secret is not configured" });

    const sig = req.headers["stripe-signature"];
    if (!sig || typeof sig !== "string") return res.status(400).json({ error: "missing stripe-signature" });
    const rawBody = req.rawBody || "";
    if (!rawBody) return res.status(400).json({ error: "missing raw body" });

    const event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const sid = String(session.client_reference_id || session.metadata?.session_id || "default");
      const planId = normalizePlanId(session.metadata?.plan_id || "free");
      upsertBillingState(sid, {
        plan_id: planId,
        active: true,
        customer_id: typeof session.customer === "string" ? session.customer : null,
        subscription_id: typeof session.subscription === "string" ? session.subscription : null,
      });
    }

    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const sub = event.data.object;
      const customerId = typeof sub.customer === "string" ? sub.customer : null;
      const sid = customerId ? customerToSessionId.get(customerId) : null;
      if (sid) {
        const priceId = sub.items?.data?.[0]?.price?.id || null;
        const planId = resolvePlanByPriceId(priceId);
        const active = event.type === "customer.subscription.deleted"
          ? false
          : (sub.status === "active" || sub.status === "trialing");
        upsertBillingState(sid, {
          plan_id: active ? planId : "free",
          active,
          customer_id: customerId,
          subscription_id: typeof sub.id === "string" ? sub.id : null,
        });
      }
    }

    return res.json({ received: true });
  } catch (err) {
    console.error("stripe webhook error", err);
    return res.status(400).json({ error: "webhook signature verification failed" });
  }
});

app.post("/api/line/webhook", async (req, res) => {
  try {
    const signature = req.headers["x-line-signature"];
    const valid = verifyLineSignature({
      rawBody: req.rawBody || "",
      signature: typeof signature === "string" ? signature : "",
      channelSecret: LINE_CHANNEL_SECRET,
    });
    if (!valid) return res.status(401).json({ error: "invalid line signature" });

    const events = Array.isArray(req.body?.events) ? req.body.events : [];
    for (const event of events) {
      if (event?.type === "message" && event?.message?.type === "text") {
        const text = String(event.message.text || "");
        const studentId = String(event?.source?.userId || STUDENT_LINE_USER_ID || "");
        if (LINE_CHANNEL_ACCESS_TOKEN && studentId) {
          const short = isSmallTalkText(text)
            ? buildStudyRedirectReply(text)
            : "受け取ったよ。\n一言でOKだから、どこで止まったか教えて。";
          // 雑談長文化を防ぐため、短い学習導線返信を優先して送る
          await pushLineMessage(studentId, short, LINE_CHANNEL_ACCESS_TOKEN).catch(() => {});
        }
        continue;
      }
      if (event?.type !== "message" || event?.message?.type !== "image") continue;
      const messageId = String(event.message.id || "");
      if (!messageId) continue;

      try {
        const imageBuffer = await fetchLineMessageContent(
          messageId,
          LINE_CHANNEL_ACCESS_TOKEN
        );
        const saved = persistLineImage({
          imageBuffer,
          ext: "jpg",
          messageId,
        });
        const analysis = await analyzeProblemImage({
          anthropicClient: ANTHROPIC_API_KEY ? await getAnthropicClient() : null,
          imageBuffer,
          mimeType: "image/jpeg",
          noteText: "",
        });
        const studentId = String(event?.source?.userId || STUDENT_LINE_USER_ID || "");
        const logEntry = saveWeaknessLog({
          studentLineUserId: studentId,
          parentLineUserId: PARENT_LINE_USER_ID,
          messageId,
          imagePath: saved.relativePath,
          analysis,
        });
        const themeUrl = buildThemePageUrl(logEntry.id, studentId);

        if (LINE_CHANNEL_ACCESS_TOKEN) {
          await sendStudentShortReply({
            accessToken: LINE_CHANNEL_ACCESS_TOKEN,
            to: studentId || STUDENT_LINE_USER_ID,
            analysis,
            themeUrl,
          });
          await sendParentSummary({
            accessToken: LINE_CHANNEL_ACCESS_TOKEN,
            to: PARENT_LINE_USER_ID,
            logEntry,
            analysis,
            themeUrl,
          });
        }
      } catch (err) {
        console.error("line image event failed", err);
      }
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error("line webhook error", err);
    return res.status(500).json({ error: "line webhook failed" });
  }
});

app.post("/api/line/weekly-report", async (_req, res) => {
  try {
    if (!LINE_CHANNEL_ACCESS_TOKEN || !PARENT_LINE_USER_ID) {
      return res.status(400).json({ error: "line env is missing" });
    }
    await sendWeeklyReportNow({
      accessToken: LINE_CHANNEL_ACCESS_TOKEN,
      parentLineUserId: PARENT_LINE_USER_ID,
    });
    return res.json({ ok: true });
  } catch (err) {
    console.error("weekly report manual trigger failed", err);
    return res.status(500).json({ error: "weekly report failed" });
  }
});

app.get("/api/line/monitor/status", (_req, res) => {
  const logs = loadWeaknessLogs();
  return res.json({
    ok: true,
    configured: {
      lineAccessToken: Boolean(LINE_CHANNEL_ACCESS_TOKEN),
      lineChannelSecret: Boolean(LINE_CHANNEL_SECRET),
      parentLineUserId: Boolean(PARENT_LINE_USER_ID),
      studentLineUserId: Boolean(STUDENT_LINE_USER_ID),
    },
    totalLogs: logs.length,
  });
});

app.get("/api/sister/theme/latest", (req, res) => {
  const studentId = String(req.query?.studentId || STUDENT_LINE_USER_ID || "");
  const logs = loadWeaknessLogs();
  const target = logs.find((x) => !studentId || x.studentLineUserId === studentId) || logs[0];
  if (!target) {
    return res.json({
      ok: true,
      hasTheme: false,
      message: "まだ理解テーマがありません。",
    });
  }
  return res.json({
    ok: true,
    hasTheme: true,
    theme: createThemeFromLog(target),
  });
});

app.post("/api/sister/theme/question", async (req, res) => {
  const themeId = String(req.body?.themeId || "");
  const studentId = String(req.body?.studentId || STUDENT_LINE_USER_ID || "");
  const question = String(req.body?.question || "").trim();
  if (!themeId || !question) {
    return res.status(400).json({ error: "themeId and question are required" });
  }

  const key = `${studentId}:${themeId}`;
  const current = Number(sisterThemeQuestionCount.get(key) || 0);
  if (current >= 3) {
    return res.json({
      done: true,
      answer: "ここまでで十分進んでる。続きは復習メニューに入れておくね。",
      followup: "今日の確認1問を解いて終わろう。",
      remaining: 0,
    });
  }
  sisterThemeQuestionCount.set(key, current + 1);

  const isAllowed = /(なんで|こういう時|別の見方|どうする|いつ使う|違い|見分け|どこを見)/.test(
    question
  );
  if (!isAllowed) {
    return res.json({
      done: false,
      answer: "この欄は理解を深める質問専用だよ。『なんで？』『こういう時は？』で聞いてみよう。",
      followup: "今日の確認1問へ進もう。",
      remaining: Math.max(0, 3 - (current + 1)),
    });
  }

  const logs = loadWeaknessLogs();
  const log = logs.find((x) => x.id === themeId) || logs[0];
  const oneView = log?.hiddenWeaknessPatterns?.[0] || "条件と知識を1つずつ結びつける";
  const anotherView = log?.suggestedMicroTraining?.[0] || "5分で1問だけ確認";

  return res.json({
    done: false,
    answer: `いい質問だね。\nまずは「${oneView}」の視点で見ると整理しやすい。`,
    followup: `別視点なら「${anotherView}」を先にやってから戻ると理解しやすい。`,
    remaining: Math.max(0, 3 - (current + 1)),
  });
});

app.get("/api/sister/review/today", (req, res) => {
  const studentId = String(req.query?.studentId || STUDENT_LINE_USER_ID || "");
  const due = getTodaySmartReview(studentId);
  return res.json({
    ok: true,
    intro: due.length
      ? `今日の復習 5分で終わる。今やると覚えやすい${due.length}件があります。`
      : "今日は短い復習はなし。次のタイミングで案内するね。",
    items: due.map((x) => ({
      id: x.id,
      subject: x.subject,
      topicName: x.topicName,
      reason: "忘れかけタイミング",
      nextAction: x.nextAction,
      nextReviewAt: x.reviewState?.nextReviewAt || x.nextReviewDate,
    })),
  });
});

app.post("/api/sister/review/complete", (req, res) => {
  const logId = String(req.body?.logId || "");
  const isCorrect = Boolean(req.body?.isCorrect);
  const answerTimeSec = req.body?.answerTimeSec == null ? null : Number(req.body.answerTimeSec);
  const missCause = req.body?.missCause ? String(req.body.missCause) : null;
  if (!logId) return res.status(400).json({ error: "logId is required" });
  const updated = markReviewAttempt({ logId, isCorrect, answerTimeSec, missCause });
  if (!updated) return res.status(404).json({ error: "review item not found" });
  return res.json({
    ok: true,
    nextReviewAt: updated.reviewState?.nextReviewAt || updated.nextReviewDate,
    streakCorrect: updated.reviewState?.streakCorrect || 0,
    stabilityScore: updated.reviewState?.stabilityScore || 0,
  });
});

app.post("/api/line/review-reminder", async (_req, res) => {
  try {
    if (!LINE_CHANNEL_ACCESS_TOKEN || !STUDENT_LINE_USER_ID) {
      return res.status(400).json({ error: "line env is missing" });
    }
    const due = getTodaySmartReview(STUDENT_LINE_USER_ID);
    if (!due.length) return res.json({ ok: true, sent: false, reason: "no due items" });
    const top = due[0];
    const url = buildThemePageUrl(top.id, STUDENT_LINE_USER_ID);
    const text = [
      "今日の5分復習タイミングです。",
      "",
      `前に間違えた「${top.topicName}」`,
      "今やると定着しやすい時間です。",
      "",
      url ? `[復習する]\n${url}` : "理解ページを開いて復習しよう。",
    ].join("\n");
    await pushLineMessage(STUDENT_LINE_USER_ID, text, LINE_CHANNEL_ACCESS_TOKEN);
    if (PARENT_LINE_USER_ID) {
      await pushLineMessage(
        PARENT_LINE_USER_ID,
        "今日は復習効率の高いタイミングで、5分の確認学習を案内しました。量より定着重視で進めています。",
        LINE_CHANNEL_ACCESS_TOKEN
      );
    }
    return res.json({ ok: true, sent: true, count: due.length });
  } catch (err) {
    console.error("line review reminder failed", err);
    return res.status(500).json({ error: "review reminder failed" });
  }
});

app.get("/api/billing/status", (req, res) => {
  const sid = String(req.query?.session_id || "default");
  const item = billingBySessionId.get(sid) || null;
  if (!item) {
    return res.json({
      session_id: sid,
      plan_id: "free",
      active: false,
      updated_at: null,
    });
  }
  return res.json({
    session_id: sid,
    plan_id: item.plan_id || "free",
    active: Boolean(item.active),
    updated_at: item.updated_at || null,
  });
});

// 今日の整理：会話を3点で要約
const SUMMARY_SYSTEM = `
会話内容を「今日の整理」用に3点で要約する。各項目は1〜2文で簡潔に。
必ずJSONだけを返す（前後に説明を付けない）。
出力形式: {"points": ["1つ目の要約", "2つ目の要約", "3つ目の要約"]}
`;

app.post("/api/summarize", async (req, res) => {
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY is missing" });
  }
  const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const text = messages
    .map((m) => (m.role === "user" ? "ユーザー: " : "GROUND: ") + (m.content || ""))
    .join("\n\n");
  if (!text.trim()) {
    return res.status(400).json({ error: "messages required" });
  }
  try {
    const client = await getAnthropicClient();
    const r = await withTimeout(
      client.messages.create({
        model: GATE_MODEL,
        max_tokens: 400,
        system: SUMMARY_SYSTEM,
        messages: [{ role: "user", content: text.slice(0, 15000) }],
      }),
      isVercel ? 25000 : 30000,
      "summarize_timeout"
    );
    const block = r.content?.find((c) => c.type === "text");
    const raw = block?.text?.trim() || "";
    const parsed = extractJsonObject(raw);
    const points = Array.isArray(parsed?.points) ? parsed.points : null;
    if (!points || points.length < 3) {
      const fallback = [
        raw.split(/[。\n]/)[0] || "（要約1）",
        raw.split(/[。\n]/)[1] || "（要約2）",
        raw.split(/[。\n]/)[2] || "（要約3）",
      ].slice(0, 3);
      while (fallback.length < 3) fallback.push("（要約）");
      return res.json({ points: fallback });
    }
    return res.json({ points: points.slice(0, 3) });
  } catch (err) {
    console.error("summarize error", err);
    const msg = err?.message === "summarize_timeout" ? "timeout" : "server error";
    return res.status(err?.message === "summarize_timeout" ? 503 : 500).json({ error: msg });
  }
});

// ─── 探索モード：カード生成（選択ベース深掘り）────────────────────────
const EXPLORE_CARDS_SYSTEM = `
You are an assistant that generates question-cards for an exploration UI.
Return JSON only. No surrounding text.

Output schema:
{
  "cards": [
    { "title": "a single question", "subtitle": "optional, 1 line" }
  ]
}

Rules:
- Generate 2 to 4 cards.
- Each card must be a QUESTION the user would want to pick. (Not a statement.)
- The question should move thinking forward without giving advice.
- Titles must be 1–2 lines max (keep short). End with “?” for English, “？” for Japanese.
- Subtitles are optional and must be 1 line max (keep short, inviting).
- Not random: must reflect the user's theme and the selected path so far.
- If user is stuck (or asks for a different angle), do NOT paraphrase previous cards. Shift the perspective (emotion / reality / relationships / self-view / time-horizon) based on context.
- Avoid repeating or closely matching any of the previous card titles provided.
- Do not include an \"Other\" card (UI adds it separately).
- Avoid diagnosis, conclusions, or life decisions.
`;

function exploreLangHint(lang) {
  if (lang === "en") return "Write in English only.";
  return "日本語のみで書く。";
}

app.post("/api/explore/cards", async (req, res) => {
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY is missing" });
  }
  const theme = String(req.body?.theme || "").trim();
  const path = Array.isArray(req.body?.path) ? req.body.path.map(String).map(s => s.trim()).filter(Boolean) : [];
  const previousCards = Array.isArray(req.body?.previous_cards)
    ? req.body.previous_cards.map(String).map(s => s.trim()).filter(Boolean).slice(0, 12)
    : [];
  const strategy = req.body?.strategy === "shift" || req.body?.strategy === "angle" ? req.body.strategy : "default";
  const angle = typeof req.body?.angle === "string" ? req.body.angle.trim() : "";
  const lang = req.body?.lang === "en" ? "en" : "ja";
  if (!theme) return res.status(400).json({ error: "theme required" });

  const prompt = `
Theme:
${theme}

Selected path so far:
${path.length ? path.map((p, i) => `${i + 1}. ${p}`).join("\n") : "(none)"}

Strategy:
${strategy === "shift" ? "User is stuck. Shift perspective and propose different angles." : strategy === "angle" ? `User requested a specific angle: ${angle || "(not specified)"}` : "Normal next-layer exploration."}

Previous card titles (avoid repeating or paraphrasing these):
${previousCards.length ? previousCards.map((t, i) => `${i + 1}. ${t}`).join("\n") : "(none)"}

Generate the next layer of exploration cards.
`;

  try {
    const client = await getAnthropicClient();
    const r = await withTimeout(
      client.messages.create({
        model: GATE_MODEL,
        max_tokens: 260,
        system: `${EXPLORE_CARDS_SYSTEM}\n\n${exploreLangHint(lang)}`,
        messages: [{ role: "user", content: prompt }],
      }),
      isVercel ? 20000 : 30000,
      "explore_cards_timeout"
    );
    const raw = r.content?.find((c) => c.type === "text")?.text?.trim() || "";
    const parsed = extractJsonObject(raw);
    const cards = Array.isArray(parsed?.cards) ? parsed.cards : null;
    if (!cards) return res.status(500).json({ error: "invalid cards" });
    const cleaned = cards
      .map((c) => ({
        title: typeof c?.title === "string" ? c.title.trim() : "",
        subtitle: typeof c?.subtitle === "string" ? c.subtitle.trim() : "",
      }))
      .filter((c) => c.title)
      .slice(0, 4);
    if (cleaned.length < 2) {
      return res.json({
        cards: lang === "en"
          ? [
              { title: "Name what feels most charged", subtitle: "" },
              { title: "Look for what’s underneath", subtitle: "" },
              { title: "Map what’s pulling you two ways", subtitle: "" },
            ].slice(0, 2)
          : [
              { title: "いま一番強いところを言葉にする", subtitle: "" },
              { title: "その下にあるものを探す", subtitle: "" },
              { title: "ぶつかっている要素を並べる", subtitle: "" },
            ].slice(0, 2),
      });
    }
    return res.json({ cards: cleaned });
  } catch (err) {
    console.error("explore cards error", err);
    const msg = err?.message === "explore_cards_timeout" ? "timeout" : "server error";
    return res.status(err?.message === "explore_cards_timeout" ? 503 : 500).json({ error: msg });
  }
});

// ─── 探索モード：今日の整理（選択履歴を3点で要約）────────────────────
const EXPLORE_SUMMARY_SYSTEM = `
Return JSON only. No surrounding text.

Output schema:
{
  "narrative": "1-2 sentences describing the path",
  "points": ["point1", "point2", "point3"]
}

Rules:
- Summarize the exploration path as \"today's整理\" in 3 points.
- Each point must be 1–2 sentences, concise.
- Also write a short narrative that feels like: \"You explored X through Y and arrived at Z.\" (No advice.)
- No advice, no conclusions, no life decisions.
`;

app.post("/api/explore/summary", async (req, res) => {
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY is missing" });
  }
  const theme = String(req.body?.theme || "").trim();
  const path = Array.isArray(req.body?.path) ? req.body.path.map(String).map(s => s.trim()).filter(Boolean) : [];
  const lang = req.body?.lang === "en" ? "en" : "ja";
  if (!theme) return res.status(400).json({ error: "theme required" });

  const prompt = `
Theme:
${theme}

Path:
${path.length ? path.map((p, i) => `${i + 1}. ${p}`).join("\n") : "(none)"}
`;

  try {
    const client = await getAnthropicClient();
    const r = await withTimeout(
      client.messages.create({
        model: GATE_MODEL,
        max_tokens: 300,
        system: `${EXPLORE_SUMMARY_SYSTEM}\n\n${exploreLangHint(lang)}`,
        messages: [{ role: "user", content: prompt }],
      }),
      isVercel ? 20000 : 30000,
      "explore_summary_timeout"
    );
    const raw = r.content?.find((c) => c.type === "text")?.text?.trim() || "";
    const parsed = extractJsonObject(raw);
    const points = Array.isArray(parsed?.points) ? parsed.points : null;
    const narrative = typeof parsed?.narrative === "string" ? parsed.narrative.trim() : "";
    if (!points || points.length < 3) return res.status(500).json({ error: "invalid summary" });
    return res.json({
      narrative,
      points: points.slice(0, 3).map((p) => String(p || "").trim()),
    });
  } catch (err) {
    console.error("explore summary error", err);
    const msg = err?.message === "explore_summary_timeout" ? "timeout" : "server error";
    return res.status(err?.message === "explore_summary_timeout" ? 503 : 500).json({ error: msg });
  }
});

const apiOnly = process.env.API_ONLY === "1";

// API_ONLY のとき / で案内を表示（空白を防ぐ）
if (!isVercel && apiOnly) {
  const apiOnlyHtml = `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>GROUND — ground.ink</title></head>
<body style="font-family:sans-serif;padding:2rem;background:#f3eee6;color:#554a3f;max-width:480px;margin:0 auto;">
  <h1 style="font-size:1.25rem;">GROUND — ground.ink</h1>
  <p>このデプロイは API 専用です。アプリを表示するには:</p>
  <ol style="line-height:1.8;">
    <li>Railway の <strong>Variables</strong> で <code>API_ONLY</code> を削除する</li>
    <li><strong>Settings</strong> の Build で <strong>Build Command</strong> に <code>npm run build</code> を設定する</li>
    <li>再デプロイする</li>
  </ol>
  <p style="margin-top:1.5rem;font-size:0.9em;color:#8a7d6f;">API は <a href="/api/health">/api/health</a> で確認できます。</p>
</body>
</html>`;
  app.get("/", (req, res) => res.type("html").send(apiOnlyHtml));
}

// ローカル用: フロント配信（Vercel / API_ONLY では静的配信しない）
// ルート(/) = アプリ。SPA なので index.html を /, /plans, /welcome で配信。
if (!isVercel && !apiOnly) {
  const frontendRoot = path.resolve(__dirname, "dist");
  const distExists = fs.existsSync(frontendRoot) && fs.existsSync(path.join(frontendRoot, "index.html"));
  if (distExists) {
    app.get(["/", "/plans", "/welcome"], (req, res, next) => {
      res.sendFile("index.html", { root: frontendRoot }, (err) => {
        if (err) next();
      });
    });
    // ground.ink/ma/ 用: 同じ SPA を /ma 以下でも配信（1 つのビルドでルートと /ma 両対応）
    app.get(["/ma", "/ma/", "/ma/plans", "/ma/welcome"], (req, res, next) => {
      res.sendFile("index.html", { root: frontendRoot }, (err) => {
        if (err) next();
      });
    });
    app.use("/ma", express.static(frontendRoot));
    app.use(express.static(frontendRoot));
  } else {
    const fallbackHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GROUND — ground.ink</title>
</head>
<body style="font-family:sans-serif;padding:2rem;background:#f3eee6;color:#554a3f;">
  <h1 style="font-size:1.5rem;">GROUND — ground.ink</h1>
  <p>フロントをビルドしてください。</p>
  <pre style="background:#e5dccf;padding:1rem;border-radius:8px;">npm run build</pre>
  <p>実行後、<a href="/">/</a> を開いてください。</p>
</body>
</html>
`;
    app.get("/", (req, res) => res.type("html").send(fallbackHtml));
  }
}
if (!isVercel) {
  // Railway / コンテナでは明示的に全インターフェースで待ち受け（未設定だと接続できない環境がある）
  const host = process.env.HOST || "0.0.0.0";
  app.set("trust proxy", 1);
  app.listen(PORT, host, () => {
    if (apiOnly) {
      console.log(`✅ GROUND API only: http://${host}:${PORT}/api/organize など`);
    } else {
      const url = `http://${host}:${PORT}/`;
      console.log(`✅ GROUND: ${url}`);
      const frontendRoot = path.resolve(__dirname, "dist");
      const distExists = fs.existsSync(frontendRoot) && fs.existsSync(path.join(frontendRoot, "index.html"));
      if (!distExists) console.log("   ※ dist がありません。npm run build を実行してください。");
    }
  });
}

startWeeklyReportScheduler({
  accessToken: LINE_CHANNEL_ACCESS_TOKEN,
  parentLineUserId: PARENT_LINE_USER_ID,
  tzOffsetHours: 9,
});

export { app };
