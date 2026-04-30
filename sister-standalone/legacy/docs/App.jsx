import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { track } from "@vercel/analytics";
import { pickSuggestion } from "./suggestions.js";
import TopNav from "./TopNav.jsx";
import {
  getStoredLangPref,
  setStoredLangPref,
  getStoredTonePref,
  setStoredTonePref,
  getStoredPlanPref,
} from "./prefs.js";
import { loadKakera, pushKakera } from "./kakera.js";
import { getUiCopy } from "./uiCopy.js";
import { canSaveSummary } from "./plans.js";

// 本番と同じく相対パス /api（開発時は Vite が 5173 でプロキシ）
const API_BASE = import.meta.env.VITE_API_BASE ?? "";

function getOrCreateSessionId() {
  const key = "seiri_session_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = typeof crypto?.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

const SESSION_ID = getOrCreateSessionId();
const MESSAGES_STORAGE_KEY = "ma_messages";
const getAppUrl = () => (typeof window !== "undefined" && window.location.origin + window.location.pathname) || "";

const API_INITIAL_TIMEOUT_MS = 90000;

/** 入力テキストから言語を推定（日本語 / 英語） */
function detectLang(text) {
  if (!text || typeof text !== "string") return "ja";
  const t = text.trim();
  if (!t.length) return "ja";
  const ascii = (t.match(/[a-zA-Z]/g) || []).length;
  const total = (t.replace(/\s/g, "").length) || 1;
  return total > 0 && ascii / total > 0.5 ? "en" : "ja";
}

async function fetchSummarize(messages) {
  const res = await fetch(`${API_BASE}/api/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d?.error || "summarize failed");
  }
  return res.json();
}

async function organize({ text, mode, sessionId, lang, planId, onStreamChunk }) {
  const ac = new AbortController();
  let initialTimeoutId = setTimeout(() => ac.abort(), API_INITIAL_TIMEOUT_MS);
  const clearInitialTimeout = () => {
    if (initialTimeoutId) {
      clearTimeout(initialTimeoutId);
      initialTimeoutId = null;
    }
  };
  try {
    const res = await fetch(`${API_BASE}/api/organize`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        text,
        mode,
        session_id: sessionId,
        lang: lang === "en" ? "en" : "ja",
        plan_id: planId || "free",
      }),
      signal: ac.signal,
    });
    clearInitialTimeout();
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("text/event-stream") && res.ok && onStreamChunk) {
      let receiveText = "";
      let streamed = "";
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += dec.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const obj = JSON.parse(line.slice(6));
              clearInitialTimeout();
              if (obj.started === true) continue;
              if ((obj.part === "receive" || obj.part === "block1") && obj.text != null) {
                receiveText = obj.text;
                onStreamChunk(receiveText);
              }
              if (obj.chunk != null) {
                streamed += obj.chunk;
                onStreamChunk(receiveText ? receiveText + "\n\n" + streamed : streamed);
              }
              if (obj.done === true) {
                return {
                  session_id: obj.session_id,
                  type: obj.type,
                  output: obj.output,
                  question: obj.question,
                };
              }
              if (obj.error) throw new Error(obj.error === "timeout" ? "timeout" : obj.error);
            } catch (e) {
              if (e instanceof SyntaxError) continue;
              throw e;
            }
          }
        }
      }
      throw new Error("stream ended without done");
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const e = new Error(data?.error || "server error");
      e.status = res.status;
      e.serverMessage = data?.output || data?.error;
      throw e;
    }
    return data;
  } catch (err) {
    clearInitialTimeout();
    if (err.name === "AbortError") throw new Error("timeout");
    throw err;
  }
}

async function resetSession(sessionId) {
  const res = await fetch(`${API_BASE}/api/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  });
  if (!res.ok) throw new Error("reset failed");
}

function formatOptions(content) {
  return content
    .split('\n')
    .map((line, i) => (i > 0 && /^[A-D]\.\s/.test(line) ? '\n' + line : line))
    .join('\n');
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "14px 0" }}>
      {[0,1,2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: "#c1b4a5",
          display: "inline-block",
          animation: `pulse 1.2s ease-in-out ${i*0.2}s infinite`,
        }}/>
      ))}
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div
      role="article"
      aria-label={isUser ? "あなたのメッセージ" : "GROUNDの返答"}
      style={{
      display: "flex",
      flexDirection: "column",
      alignItems: isUser ? "flex-end" : "flex-start",
      marginBottom: 18,
      animation: "fadeIn 0.3s ease",
    }}>
      <div className={!isUser ? "md" : undefined} style={{
        maxWidth: "72%",
        padding: isUser ? "11px 15px" : "15px 19px",
        borderRadius: isUser ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
        background: isUser ? "#e3f0ff" : "#ffffff",
        color: isUser ? "#2a3a4f" : "#554a3f",
        fontSize: 14,
        lineHeight: 1.8,
        letterSpacing: "0.02em",
        borderLeft: msg.type === "safety" ? "3px solid #f0a5a5"
                  : msg.type === "question" ? "3px solid #c3c9ff"
                  : msg.type === "error" ? "3px solid #d38b7a"
                  : msg.type === "info" ? "3px solid #e2d8c8"
                  : "3px solid transparent",
        boxShadow: "0 3px 8px rgba(33, 23, 11, 0.04)",
        whiteSpace: isUser ? "pre-wrap" : undefined,
        wordBreak: "break-word",
      }}>
        {isUser ? msg.content : (
          <ReactMarkdown
            components={{
              p({ children }) {
                const text = Array.isArray(children)
                  ? children.map(c => typeof c === 'string' ? c : '').join('')
                  : String(children ?? '');
                const trimmed = text.trim();
                const isBullet = /^[・\-\*]\s*/.test(trimmed) || (trimmed.length > 0 && trimmed.startsWith('・'));
                const isChoice = /^[A-D]\.\s/.test(text);
                return (
                  <p style={{
                    marginTop: isBullet ? 8 : undefined,
                    marginBottom: isChoice ? '1em' : (isBullet ? 8 : '0.65em'),
                    paddingLeft: isBullet ? 2 : undefined,
                  }}>
                    {children}
                  </p>
                );
              },
              ul({ children }) {
                return <ul style={{ margin: '10px 0 12px 0', paddingLeft: 22 }}>{children}</ul>;
              },
              li({ children }) {
                return <li style={{ marginBottom: 8 }}>{children}</li>;
              },
            }}
          >{formatOptions(msg.content)}</ReactMarkdown>
        )}
      </div>
    </div>
  );
}

const OTHER_CARD_JA = "その他を書く";
const OTHER_CARD_EN = "Something else";

/** 助手メッセージから箇条書き項目を抽出（思考カード用）。最大3個。日英対応。 */
function parseThoughtItems(content) {
  if (!content || typeof content !== "string") return [];
  const lines = content.split(/\r?\n/);
  const items = [];
  for (const line of lines) {
    const trimmed = line.trim();
    const m = trimmed.match(/^[・\-\*]\s*(.+)$/);
    if (m) {
      const label = m[1].trim();
      if (label && label !== OTHER_CARD_JA && label !== OTHER_CARD_EN) items.push(label);
    }
  }
  return items.slice(0, 3);
}

function ThoughtCards({ items, lang, onSelect, onOtherExpand, onOtherClose, otherExpanded, otherValue, onOtherChange, onOtherSubmit }) {
  const isEn = lang === "en";
  const otherLabel = isEn ? OTHER_CARD_EN : OTHER_CARD_JA;
  const placeholder = isEn ? "Try writing freely." : "そのまま書いてみてください";
  const sendLabel = isEn ? "Send" : "送る";
  const closeLabel = isEn ? "Close" : "閉じる";
  const cardStyle = {
    background: "#f6f0e7",
    border: "1px solid #e0d4c5",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13,
    color: "#5a4b3f",
    cursor: "pointer",
    letterSpacing: "0.02em",
    textAlign: "left",
    width: "100%",
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
  };
  return (
    <div style={{ marginTop: 12, marginBottom: 8, maxWidth: "72%" }}>
      <div className="thought-cards-grid">
        {items.map((label, i) => (
          <button
            key={i}
            type="button"
            style={cardStyle}
            onClick={() => onSelect(label)}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          style={cardStyle}
          onClick={() => !otherExpanded && onOtherExpand()}
        >
          {otherLabel}
        </button>
      </div>
      {otherExpanded && (
        <div style={{ marginTop: 14 }}>
          <textarea
            placeholder={placeholder}
            value={otherValue}
            onChange={e => onOtherChange(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              padding: "12px 14px",
              border: "1px solid #e0d4c5",
              borderRadius: 10,
              fontSize: 13,
              color: "#5a4b3f",
              background: "#fdfbf7",
              fontFamily: "inherit",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
          <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
            <button
              type="button"
              onClick={() => otherValue.trim() && onOtherSubmit(otherValue.trim())}
              disabled={!otherValue.trim()}
              style={{
                padding: "10px 18px",
                background: "#e8e4df",
                border: "1px solid #e0d4c5",
                borderRadius: 8,
                color: "#2a3a4f",
                fontSize: 12,
                cursor: otherValue.trim() ? "pointer" : "default",
                letterSpacing: "0.04em",
              }}
            >
              {sendLabel}
            </button>
            <button
              type="button"
              onClick={onOtherClose}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                color: "#8a7d6f",
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              {closeLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function loadStoredMessages() {
  try {
    const s = typeof localStorage !== "undefined" && localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (s) {
      const p = JSON.parse(s);
      if (Array.isArray(p) && p.length > 0) return p;
    }
  } catch (_) {}
  return [];
}

export default function App() {
  const [messages, setMessages] = useState(loadStoredMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [tone, setTone] = useState(() => getStoredTonePref());
  const [langPref, setLangPref] = useState(() => getStoredLangPref()); // null = auto
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);
  const [copyRowFeedback, setCopyRowFeedback] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(null);
  const [summaryPanelOpen, setSummaryPanelOpen] = useState(false);
  const [summaryPoints, setSummaryPoints] = useState(["", "", ""]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);
  const [kakeraSavedNotice, setKakeraSavedNotice] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [kakeraExpandId, setKakeraExpandId] = useState(null);
  const [otherCardExpanded, setOtherCardExpanded] = useState(false);
  const [otherCardValue, setOtherCardValue] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [planId, setPlanId] = useState(() => getStoredPlanPref());

  const autoLangSource = useMemo(() => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content || "";
    return input || lastUser;
  }, [input, messages]);
  const lang = langPref || detectLang(autoLangSource);
  const isEn = lang === "en";
  const copy = getUiCopy(isEn);
  const canSaveKakera = canSaveSummary(planId);
  const studyPlaceholder = isEn
    ? "Where did you get stuck?"
    : "問題のどこで止まった？";

  const [inputExample, setInputExample] = useState("");

  useEffect(() => {
    // 例は1つだけ。言語に合わせてランダムで差し替え。
    setInputExample(pickSuggestion(lang, "random"));
  }, [lang]);

  useEffect(() => {
    const sync = () => {
      setLangPref(getStoredLangPref());
      setTone(getStoredTonePref());
      setPlanId(getStoredPlanPref());
    };
    window.addEventListener("storage", sync);
    window.addEventListener("ground:prefs", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("ground:prefs", sync);
    };
  }, []);

  useEffect(() => {
    setStoredTonePref(tone);
  }, [tone]);

  const refreshBookmarks = () => {
    const k = loadKakera();
    try {
      const raw = localStorage.getItem("ma_bookmarks");
      const old = raw ? JSON.parse(raw) : [];
      if (Array.isArray(old) && old.length) {
        const seen = new Set(k.map((x) => x.id));
        const extra = old
          .map((b, i) => {
            if (!b) return null;
            const id = b.id || `legacy-${i}-${b.createdAt || ""}`;
            if (seen.has(id)) return null;
            seen.add(id);
            return {
              id,
              createdAt: b.createdAt || new Date().toISOString(),
              source: "chat",
              points: Array.isArray(b.points) ? b.points.slice(0, 3) : ["", "", ""],
              originalInput: "",
            };
          })
          .filter(Boolean);
        setBookmarks([...k, ...extra]);
        return;
      }
    } catch (_) {}
    setBookmarks(k);
  };

  useEffect(() => {
    if (sidebarOpen) refreshBookmarks();
  }, [sidebarOpen]);

  useEffect(() => {
    const onKakera = () => refreshBookmarks();
    window.addEventListener("ground:kakera", onKakera);
    return () => window.removeEventListener("ground:kakera", onKakera);
  }, []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("ground_open_kakera") === "1") {
        sessionStorage.removeItem("ground_open_kakera");
        setSidebarOpen(true);
        refreshBookmarks();
      }
    } catch (_) {}
  }, []);

  // 配下の index.html が古く「MA」のままでも、表示タイトルを GROUND に統一する
  useEffect(() => {
    if (typeof document !== "undefined" && document.title !== "GROUND — ground.ink") {
      document.title = "GROUND — ground.ink";
    }
  }, []);

  const bottomRef = useRef(null);
  const streamStartedRef = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!API_BASE) {
      fetch(`/api/history?session_id=${SESSION_ID}`, { method: "GET" }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
      } catch (_) {}
    }, 800);
    return () => clearTimeout(t);
  }, [messages]);

  const ONBOARDING_DONE_KEY = "ma_onboarding_done";
  const showOnboarding = messages.length === 0 && !loading && typeof localStorage !== "undefined" && !localStorage.getItem(ONBOARDING_DONE_KEY);

  const add = (role, content, type = "result") =>
    setMessages(p => [...p, { role, content, type, id: Date.now() + Math.random() }]);

  const handleSend = async (exampleText) => {
    const text = (exampleText != null && String(exampleText).trim() !== "") ? String(exampleText).trim() : input.trim();
    if (!text || loading) return;
    setOtherCardExpanded(false);
    setOtherCardValue("");
    try {
      localStorage.setItem(ONBOARDING_DONE_KEY, "1");
    } catch (_) {}
    if (!exampleText) setInput("");
    add("user", text);
    setLoading(true);
    const streamId = Date.now() + Math.random();
    const requestStartedAt = Date.now();
    streamStartedRef.current = false;
    try {
      const data = await organize({
        text,
        mode: tone === "normal" ? "standard" : tone,
        sessionId: SESSION_ID,
        lang: langPref || detectLang(text),
        onStreamChunk: (accumulated) => {
          streamStartedRef.current = true;
          setMessages(prev => {
            const hasStream = prev.some(m => m.id === streamId);
            if (!hasStream) return [...prev, { role: "assistant", content: accumulated, type: "result", id: streamId }];
            return prev.map(m => (m.id === streamId ? { ...m, content: accumulated } : m));
          });
        },
        planId,
      });
      if (streamStartedRef.current) {
        const finalContent = data.output ?? data.question ?? "";
        setMessages(prev => prev.map(m => (m.id === streamId ? { ...m, content: finalContent, type: data.type } : m)));
      } else {
        if (data.type === "question") {
          add("assistant", data.question, "question");
          setWaiting(true);
        } else if (data.type === "safety") {
          add("assistant", data.output, "safety");
          setWaiting(false);
        } else if (data.type === "info") {
          add("assistant", data.output || "情報が返りました。", "info");
          setWaiting(false);
        } else {
          add("assistant", data.output, "result");
          setWaiting(false);
        }
      }
      setWaiting(data.type === "question");
      track("message_sent", { mode: tone === "normal" ? "standard" : tone });
      if (exampleText) track("onboarding_example_sent");
    } catch (err) {
      if (streamStartedRef.current) {
        setMessages(prev => prev.filter(m => m.id !== streamId));
      }
      const elapsed = Date.now() - requestStartedAt;
      const likelyColdStart = elapsed < 8000 && (
        err?.status === 503 || err?.status === 504 ||
        err?.message === "timeout" ||
        err?.message === "Failed to fetch" || err?.name === "TypeError"
      );

      let msg = err?.serverMessage || "";
      if (msg === "ANTHROPIC_API_KEY is missing") {
        msg = "APIキーが設定されていません。管理者は環境変数「ANTHROPIC_API_KEY」を確認してください。";
      } else if (likelyColdStart) {
        msg = "サーバーが起動中の可能性があります。30秒ほど待ってから、もう一度「送信」を押してみてください。";
      } else if (err?.status === 503 || err?.status === 504) {
        msg = tone === "short"
          ? "応答が時間内に返ってきませんでした。しばらく待ってからもう一度送信してみてください。"
          : "応答が時間内に返ってきませんでした。しばらく待つか、「短め」で短い文でもう一度お試しください。";
      } else if (!msg) {
        const alreadyShort = tone === "short";
        const tryAgainLater = "しばらく待ってから、もう一度送ってみてください。";
        msg =
          err?.message === "timeout"
            ? (alreadyShort
                ? "接続がタイムアウトしました。サーバーが起動中かもしれません。1〜2分待ってから、もう一度送信を押してみてください。"
                : "応答が遅れています。「短め」モードで短い文をお試しください。")
            : err?.message === "Failed to fetch" || err?.name === "TypeError"
              ? "接続できませんでした。ネットワークを確認するか、30秒ほど待ってからもう一度お試しください。"
              : err?.status === 500
                ? `サーバーエラーです。${tryAgainLater}${alreadyShort ? "" : "「短め」で短い文だと届きやすい場合があります。"}`
                : `一時的なエラーです。${tryAgainLater}${alreadyShort ? "" : "「短め」で短い文だと届きやすい場合があります。"}`;
      }
      add("assistant", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleFeedback = (helpful) => {
    setFeedbackSent(helpful ? "good" : "bad");
    track("feedback", { helpful });
  };

  const handleReset = async () => {
    track("reset_clicked");
    try {
      await resetSession(SESSION_ID);
      setMessages([]);
      setWaiting(false);
      setFeedbackSent(null);
      try {
        localStorage.removeItem(MESSAGES_STORAGE_KEY);
      } catch (_) {}
    } catch {
      add("assistant", "リセットに失敗しました。しばらくしてからもう一度お試しください。", "error");
    }
  };

  const [kakeraModalEdit, setKakeraModalEdit] = useState(false);
  const [kakeraOriginalSnapshot, setKakeraOriginalSnapshot] = useState("");

  const buildChatOriginalInput = (msgs) =>
    msgs
      .map((m) => (m.role === "user" ? "ユーザー" : "GROUND") + ": " + String(m.content || ""))
      .join("\n\n")
      .slice(0, 50000);

  const handleSummarize = async () => {
    if (!messages.some((m) => m.role === "assistant") || loadingSummary) return;
    setLoadingSummary(true);
    setSummaryError("");
    try {
      const data = await fetchSummarize(messages);
      const pts = Array.isArray(data.points) ? data.points : ["", "", ""];
      setKakeraOriginalSnapshot(buildChatOriginalInput(messages));
      setSummaryPoints([pts[0] ?? "", pts[1] ?? "", pts[2] ?? ""]);
      setKakeraModalEdit(false);
      setSummaryPanelOpen(true);
    } catch (e) {
      setSummaryError(e?.message === "timeout" ? "タイムアウトしました" : "要約できませんでした");
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleSaveKakeraFromChat = () => {
    try {
      pushKakera({
        source: "chat",
        points: [...summaryPoints],
        originalInput: kakeraOriginalSnapshot,
      });
      setSavedFlash(true);
      setKakeraSavedNotice(true);
      refreshBookmarks();
      setSummaryPanelOpen(false);
      setTimeout(() => setSavedFlash(false), 1400);
      setTimeout(() => setKakeraSavedNotice(false), 14000);
    } catch (_) {}
  };

  const handleShare = () => {
    const url = getAppUrl();
    const text = `GROUND（ground.ink）— Find your ground. Sort your thoughts.\n${url}`;
    navigator.clipboard?.writeText(text).then(() => {
      track("share_clicked");
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2000);
    }).catch(() => {});
  };

  const lastAssistantContent = [...messages].reverse().find(m => m.role === "assistant" && m.content && !["error", "info"].includes(m.type))?.content;

  const exploreLikeCard = {
    background: "rgba(255,255,255,0.55)",
    border: "1px solid #e8e0d5",
    borderRadius: 14,
    padding: "18px 18px 16px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
  };
  const handleCopyLast = () => {
    if (!lastAssistantContent) return;
    navigator.clipboard?.writeText(lastAssistantContent).then(() => {
      setCopyRowFeedback(true);
      track("copy_response");
      setTimeout(() => setCopyRowFeedback(false), 2000);
    }).catch(() => {});
  };

  const handleQuickStudyAction = (action) => {
    if (action === "photo") {
      const base = typeof window !== "undefined" && window.location.pathname.startsWith("/ma") ? "/ma" : "";
      window.location.assign(base + "/sister");
      return;
    }
    if (action === "review") {
      handleSend(isEn ? "Today review: one weak point only." : "今日の復習を1つだけ進めたい");
      return;
    }
    handleSend(isEn ? "Give me one hint only." : "ヒントを1つだけください");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at top, #fdfbf7 0, #f3eee6 42%, #efe7dd 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f3eee6; }
        textarea { resize: none; }
        textarea:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #d2c7ba; border-radius: 3px; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:0.2; transform:scale(0.8); } 50% { opacity:0.8; transform:scale(1); } }
        .md p { margin-bottom: 0.75em; }
        .md p:last-child { margin-bottom: 0; }
        .md ul, .md ol { padding-left: 1.4em; margin-bottom: 0.75em; }
        .md li { margin-bottom: 0.3em; }
        .md strong { color: #4d4336; font-weight: 500; }
        .md code { background: #f3ede3; padding: 1px 5px; border-radius: 4px; font-size: 12px; }
        textarea::placeholder { color: #b0a495; }
        @keyframes savedSparkle { 0% { opacity: 0.4; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 1; transform: scale(1); } }
        .thought-cards-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        @media (max-width: 480px) { .thought-cards-grid { grid-template-columns: 1fr; gap: 14px; } }
      `}</style>

      {/* サイドバー：かけら */}
      {sidebarOpen && (
        <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(320px, 85vw)", background: "#fdfbf7", borderLeft: "1px solid #e0d4c5", zIndex: 99, boxShadow: "-4px 0 20px rgba(0,0,0,0.06)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid #e8e0d5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 400, color: "#5a4b3f", letterSpacing: "0.06em" }}>{copy.kakera}</span>
            <button type="button" onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", color: "#8a7d6f", fontSize: 18, cursor: "pointer", lineHeight: 1 }} aria-label="閉じる">×</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
            {bookmarks.length === 0 ? (
              <p style={{ fontSize: 12, color: "#a29384", lineHeight: 1.7 }}>
                <>
                  {copy.kakeraEmptyLine1}
                  <br />
                  {copy.kakeraEmptyLine2}
                </>
              </p>
            ) : (
              bookmarks.map((b) => (
                <div key={b.id} style={{ marginBottom: 16, padding: 12, background: "#f9f6f0", borderRadius: 8, border: "1px solid #e8e0d5" }}>
                  <div style={{ fontSize: 10, color: "#a29384", marginBottom: 8, letterSpacing: "0.06em" }}>
                    {b.source === "explore" ? copy.sourceExplore : copy.sourceChat}
                  </div>
                  {(b.points || []).filter(Boolean).map((p, i) => (
                    <p key={i} style={{ fontSize: 12, color: "#5a4b3f", marginBottom: i < 2 ? 6 : 0, lineHeight: 1.6 }}>{p}</p>
                  ))}
                  {b.originalInput ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setKakeraExpandId((id) => (id === b.id ? null : b.id))}
                        style={{
                          marginTop: 8,
                          padding: 0,
                          border: "none",
                          background: "none",
                          color: "#8a7d6f",
                          fontSize: 10,
                          cursor: "pointer",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {kakeraExpandId === b.id ? (isEn ? "Hide source" : "元の入力を閉じる") : (isEn ? "Original input" : "元の入力")}
                      </button>
                      {kakeraExpandId === b.id ? (
                        <pre style={{
                          marginTop: 8,
                          padding: 10,
                          background: "#fdfbf7",
                          borderRadius: 8,
                          border: "1px solid #e8e0d5",
                          fontSize: 10,
                          color: "#6b5d52",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          maxHeight: 160,
                          overflowY: "auto",
                          lineHeight: 1.55,
                        }}>{b.originalInput}</pre>
                      ) : null}
                    </>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {sidebarOpen && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.15)", zIndex: 98 }} onClick={() => setSidebarOpen(false)} aria-hidden="true" />}

      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 720, margin: "0 auto" }}>
          <TopNav
            mode="chat"
            lang={lang}
            langPref={langPref}
            onSetLang={(next) => {
              setLangPref(next);
              setStoredLangPref(next);
            }}
            tone={tone}
            onSetTone={(next) => setTone(next)}
            resetLabel={isEn ? "Reset" : "リセット"}
            onReset={() => {
              setMenuOpen(false);
              handleReset();
            }}
            menuOpen={menuOpen}
            onToggleMenu={() => setMenuOpen((p) => !p)}
            menuItems={[
              {
                id: "new",
                label: isEn ? "New chat" : "新しい会話",
                onClick: () => {
                  setMenuOpen(false);
                  handleReset();
                },
              },
              {
                id: "plans",
                label: isEn ? "Plans" : "プラン",
                onClick: () => {
                  setMenuOpen(false);
                  const base = typeof window !== "undefined" && window.location.pathname.startsWith("/ma") ? "/ma" : "";
                  window.location.assign(base + "/plans");
                },
              },
              {
                id: "sister-log",
                label: isEn ? "SISTER Log" : "SISTER学習ログ",
                onClick: () => {
                  setMenuOpen(false);
                  const base = typeof window !== "undefined" && window.location.pathname.startsWith("/ma") ? "/ma" : "";
                  window.location.assign(base + "/sister");
                },
              },
              {
                id: "bookmarks",
                label: copy.kakera,
                onClick: () => {
                  setMenuOpen(false);
                  setSidebarOpen(true);
                },
              },
              {
                id: "lang-auto",
                label: isEn ? "Language: Auto" : "言語：自動",
                onClick: () => {
                  setMenuOpen(false);
                  setLangPref(null);
                  setStoredLangPref(null);
                },
              },
            ]}
            maxWidth={720}
            showTone={messages.length > 0}
          />
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 720, padding: "0 24px", margin: "0 auto" }}>
        <div style={{ height: 1, background: "#e1d8cd", margin: "16px 0 14px" }} />
      </div>

      {/* メッセージ（初期は /explore と同じ白カード） */}
      {messages.length === 0 ? (
        <main
          style={{
            flex: 1,
            width: "100%",
            maxWidth: 720,
            padding: "0 24px 22px",
            margin: "0 auto",
          }}
          aria-live="polite"
          aria-label="会話"
        >
          {kakeraSavedNotice && (
            <div
              role="status"
              style={{
                marginBottom: 14,
                padding: "11px 14px",
                borderRadius: 12,
                border: "1px solid #e0d4c5",
                background: "rgba(255,255,255,0.72)",
                boxShadow: "0 4px 14px rgba(33, 23, 11, 0.06)",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ flex: "1 1 200px", fontSize: 12, color: "#5a4b3f", lineHeight: 1.65, letterSpacing: "0.02em" }}>
                {copy.savedBanner}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSidebarOpen(true);
                  setKakeraSavedNotice(false);
                  refreshBookmarks();
                }}
                style={{
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: "1px solid #d7c8b7",
                  background: "#efe6da",
                  color: "#5a4b3f",
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                {copy.openKakera}
              </button>
            </div>
          )}
          <div style={exploreLikeCard}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 10, marginBottom: 14 }}>
              {[
                { id: "photo", label: isEn ? "Send problem photo" : "問題写真を送る", onClick: () => handleQuickStudyAction("photo") },
                { id: "today", label: isEn ? "Today's review" : "今日の復習", onClick: () => handleQuickStudyAction("review") },
                { id: "weak", label: isEn ? "Weakness notes" : "苦手ノート", onClick: () => handleQuickStudyAction("photo") },
                { id: "resume", label: isEn ? "Continue previous" : "前回の続き", onClick: () => handleQuickStudyAction("hint") },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.onClick}
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #e3d7c8",
                    background: "#f8f3eb",
                    color: "#5a4b3f",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div style={{ color: "#75675a", fontSize: 13, fontWeight: 300, lineHeight: 1.75, letterSpacing: "0.04em", marginBottom: 10 }}>
              {copy.inputLead}
            </div>
            {!input.trim() && (
              <p
                role="button"
                tabIndex={0}
                onClick={() => setInput(inputExample)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setInput(inputExample);
                  }
                }}
                style={{
                  margin: "0 0 12px",
                  color: "#9b9084",
                  fontSize: 12,
                  fontWeight: 300,
                  lineHeight: 1.7,
                  letterSpacing: "0.02em",
                  cursor: "pointer",
                  opacity: inputFocused ? 0.5 : 1,
                  transition: "opacity 160ms ease",
                }}
                title={isEn ? "Use this example" : "この例を入力に入れる"}
              >
                {copy.examplePrefix}
                {inputExample}
              </p>
            )}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={studyPlaceholder}
              aria-label="メッセージ入力"
              rows={3}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #e0d4c5",
                borderRadius: 12,
                fontSize: 14,
                color: "#5a4b3f",
                background: "#fdfbf7",
                fontFamily: "inherit",
                resize: "vertical",
                minHeight: 74,
                boxSizing: "border-box",
              }}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />
            <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <Link
                to="/explore"
                style={{
                  textDecoration: "none",
                  padding: "9px 14px",
                  background: "#f6f0e7",
                  border: "1px solid #e0d4c5",
                  borderRadius: 12,
                  color: "#5a4b3f",
                  fontSize: 12,
                  letterSpacing: "0.06em",
                  display: "inline-block",
                }}
              >
                {copy.navExplore}
              </Link>
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                style={{
                  padding: "10px 18px",
                  background: !input.trim() || loading ? "#c4b8a8" : "#5a4b3f",
                  border: "none",
                  borderRadius: 12,
                  color: "#fdfbf7",
                  fontSize: 12,
                  cursor: !input.trim() || loading ? "default" : "pointer",
                  letterSpacing: "0.06em",
                }}
              >
                {isEn ? "Send" : "送る"}
              </button>
            </div>
            {!showOnboarding && !inputFocused && (
              <div style={{ color: "#a29384", fontSize: 10, textAlign: "center", marginTop: 12, letterSpacing: "0.03em", lineHeight: 1.5 }}>
                {isEn ? "Short messages (1–2 sentences) tend to respond faster." : "短い文（1〜2文）で送ると応答が返りやすくなります"}
              </div>
            )}
          </div>
          <div ref={bottomRef} />
        </main>
      ) : (
        <main
          style={{
            flex: 1,
            width: "100%",
            maxWidth: 720,
            padding: "0 24px 8px",
            overflowY: "auto",
            minHeight: 0,
            margin: "0 auto",
          }}
          aria-live="polite"
          aria-label="会話"
        >
        {messages.map(msg => <Message key={msg.id} msg={msg} />)}
        {!loading && (() => {
          const lastMsg = messages[messages.length - 1];
          const lastIsError = lastMsg?.role === "assistant" && lastMsg?.type === "error";
          const lastUserContent = lastIsError
            ? [...messages].slice(0, -1).reverse().find(m => m.role === "user")?.content
            : null;
          if (lastUserContent) {
            return (
              <div style={{ marginTop: 8, marginBottom: 4, maxWidth: "72%" }}>
                <button
                  type="button"
                  onClick={() => handleSend(lastUserContent)}
                  style={{
                    padding: "8px 14px",
                    background: "#f6f0e7",
                    border: "1px solid #e0d4c5",
                    borderRadius: 8,
                    color: "#5a4b3f",
                    fontSize: 12,
                    cursor: "pointer",
                    letterSpacing: "0.04em",
                  }}
                >
                  {isEn ? "Resend" : "再送信"}
                </button>
              </div>
            );
          }
          return null;
        })()}
        {!loading && (() => {
          const lastAssistant = [...messages].reverse().find(m => m.role === "assistant" && m.content && !["error", "info"].includes(m.type));
          const cardLang = lang;
          const thoughtItems = lastAssistant ? parseThoughtItems(lastAssistant.content) : [];
          if (thoughtItems.length < 1) return null;
          return (
            <ThoughtCards
              items={thoughtItems}
              lang={cardLang}
              onSelect={(text) => {
                setOtherCardExpanded(false);
                setOtherCardValue("");
                handleSend(text);
              }}
              onOtherExpand={() => setOtherCardExpanded(true)}
              onOtherClose={() => { setOtherCardExpanded(false); setOtherCardValue(""); }}
              otherExpanded={otherCardExpanded}
              otherValue={otherCardValue}
              onOtherChange={setOtherCardValue}
              onOtherSubmit={(val) => {
                handleSend(val);
                setOtherCardExpanded(false);
                setOtherCardValue("");
              }}
            />
          );
        })()}
        {loading && (
          <div style={{ paddingLeft: 8, color: "#8a7d6f", fontSize: 12, marginTop: 4 }} aria-live="polite">
            <TypingDots/>
            <span style={{ display: "block", marginTop: 6 }}>
              {isEn ? "Hold on a moment. Usually returns in ~30–60s." : "少々お待ちください。通常は30秒〜1分ほどで返ります。"}
            </span>
          </div>
        )}
        {!loading && messages.some(m => m.role === "assistant") && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            <button
              type="button"
              onClick={() => handleQuickStudyAction("hint")}
              style={{ padding: "7px 10px", borderRadius: 8, border: "1px solid #decfbe", background: "#f6f0e7", color: "#5a4b3f", fontSize: 11, cursor: "pointer" }}
            >
              {isEn ? "View hint" : "ヒントを見る"}
            </button>
            <button
              type="button"
              onClick={() => handleQuickStudyAction("review")}
              style={{ padding: "7px 10px", borderRadius: 8, border: "1px solid #decfbe", background: "#f6f0e7", color: "#5a4b3f", fontSize: 11, cursor: "pointer" }}
            >
              {isEn ? "Today's review" : "今日の復習へ"}
            </button>
            <button
              type="button"
              onClick={() => handleQuickStudyAction("photo")}
              style={{ padding: "7px 10px", borderRadius: 8, border: "1px solid #decfbe", background: "#f6f0e7", color: "#5a4b3f", fontSize: 11, cursor: "pointer" }}
            >
              {isEn ? "Send problem photo" : "問題写真を送る"}
            </button>
          </div>
        )}
        {!loading && messages.some(m => m.role === "assistant") && (
          <div style={{ marginTop: 10, marginBottom: 6, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <button type="button" onClick={handleCopyLast} disabled={!lastAssistantContent} title={copyRowFeedback ? "コピーしました" : "コピー"} style={{
              background: "none", border: "none", padding: 2,
              color: copyRowFeedback ? "#8a9a6b" : "#8a7d6f",
              cursor: lastAssistantContent ? "pointer" : "default",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              {copyRowFeedback ? (
                <span style={{ fontSize: 10 }}>OK</span>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              )}
            </button>
            {feedbackSent ? (
              <span style={{ fontSize: 10, color: "#8a7d6f" }}>ありがとう</span>
            ) : (
              <>
                <button type="button" aria-label="いいね" onClick={() => handleFeedback(true)} style={{
                  background: "none", border: "none", padding: 2, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }} title="いいね">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8a7d6f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                </button>
                <button type="button" aria-label="いまいち" onClick={() => handleFeedback(false)} style={{
                  background: "none", border: "none", padding: 2, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }} title="いまいち">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8a7d6f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/></svg>
                </button>
              </>
            )}
            <button type="button" onClick={handleShare} title={shareFeedback ? "コピーしました" : "シェア"} style={{
              background: "none", border: "none", padding: 2,
              color: shareFeedback ? "#8a9a6b" : "#8a7d6f",
              cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              {shareFeedback ? (
                <span style={{ fontSize: 10 }}>OK</span>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              )}
            </button>
          </div>
        )}
        <div ref={bottomRef}/>
      </main>
      )}

      {/* 要約 → 確認 → かけらに保存 */}
      {summaryPanelOpen && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.22)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
        }} onClick={() => setSummaryPanelOpen(false)}>
          <div style={{
            background: "#fdfbf7", borderRadius: 14, padding: "20px 20px 18px", maxWidth: 480, width: "92%", boxShadow: "0 10px 36px rgba(0,0,0,0.12)", border: "1px solid #e0d4c5",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 400, color: "#5a4b3f", letterSpacing: "0.06em" }}>{copy.summaryTitle}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setKakeraModalEdit((e) => !e)}
                  style={{
                    padding: "4px 10px",
                    fontSize: 10,
                    letterSpacing: "0.06em",
                    color: "#8a7d6f",
                    background: "rgba(255,255,255,0.6)",
                    border: "1px solid #e0d4c5",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  {kakeraModalEdit ? (isEn ? "Done" : "完了") : (isEn ? "Edit" : "編集")}
                </button>
                <button type="button" onClick={() => setSummaryPanelOpen(false)} style={{ background: "none", border: "none", color: "#8a7d6f", fontSize: 18, cursor: "pointer", lineHeight: 1 }} aria-label="閉じる">×</button>
              </div>
            </div>
            <div style={{ padding: 12, borderRadius: 12, background: "#f6f0e7", border: "1px solid #e8e0d5", marginBottom: 14 }}>
              {summaryPoints.map((point, i) => (
                kakeraModalEdit ? (
                  <div key={i} style={{ marginBottom: i < 2 ? 10 : 0 }}>
                    <label style={{ display: "block", fontSize: 10, color: "#8a7d6f", marginBottom: 4 }}>{i + 1}</label>
                    <textarea
                      value={point}
                      onChange={e => setSummaryPoints(prev => { const n = [...prev]; n[i] = e.target.value; return n; })}
                      rows={2}
                      style={{
                        width: "100%", padding: "8px 10px", border: "1px solid #e0d4c5", borderRadius: 8, fontSize: 12, color: "#5a4b3f", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box",
                      }}
                    />
                  </div>
                ) : (
                  <div key={i} style={{ marginBottom: i < 2 ? 10 : 0, color: "#5a4b3f", fontSize: 12, lineHeight: 1.75 }}>
                    {point || "—"}
                  </div>
                )
              ))}
            </div>
            <p style={{ fontSize: 10, color: "#9a8f82", marginBottom: 12, lineHeight: 1.6 }}>
              {copy.saveHelpChat}
            </p>
            {!canSaveKakera && (
              <p style={{ fontSize: 10, color: "#9a8f82", marginBottom: 12, lineHeight: 1.6 }}>
                {isEn ? "Saving to Kakera is available on Light plan and above." : "かけら保存はライトプラン以上で利用できます。"}
              </p>
            )}
            <button
              type="button"
              onClick={handleSaveKakeraFromChat}
              disabled={savedFlash || !canSaveKakera}
              style={{
                width: "100%",
                padding: "11px 16px",
                background: savedFlash || !canSaveKakera ? "#f0ebe0" : "#e7dbcc",
                border: "1px solid #e0d4c5",
                borderRadius: 10,
                color: "#5a4b3f",
                fontSize: 12,
                cursor: savedFlash || !canSaveKakera ? "default" : "pointer",
                letterSpacing: "0.06em",
              }}
            >
              {!canSaveKakera ? (isEn ? "Upgrade to save" : "保存は有料プラン") : (savedFlash ? copy.savedShort : copy.save)}
            </button>
          </div>
        </div>
      )}

      {/* 入力（会話開始後は従来の下部バー） */}
      {messages.length > 0 && (
      <div style={{
        width: "100%", maxWidth: 720,
        padding: "14px 24px 26px",
        background: "linear-gradient(transparent, rgba(243,238,230,0.9) 32%)",
        margin: "0 auto",
      }}>
        {kakeraSavedNotice && (
          <div
            role="status"
            style={{
              marginBottom: 14,
              padding: "11px 14px",
              borderRadius: 12,
              border: "1px solid #e0d4c5",
              background: "rgba(255,255,255,0.72)",
              boxShadow: "0 4px 14px rgba(33, 23, 11, 0.06)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ flex: "1 1 200px", fontSize: 12, color: "#5a4b3f", lineHeight: 1.65, letterSpacing: "0.02em" }}>
              {copy.savedBanner}
            </span>
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(true);
                setKakeraSavedNotice(false);
                refreshBookmarks();
              }}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                border: "1px solid #d7c8b7",
                background: "#efe6da",
                color: "#5a4b3f",
                fontSize: 11,
                letterSpacing: "0.06em",
                cursor: "pointer",
                flexShrink: 0,
              }}
              className="ground-pressable"
            >
              {copy.openKakera}
            </button>
          </div>
        )}
        <div style={{ marginBottom: 10 }}>
          <div style={{ color: "#75675a", fontSize: 13, fontWeight: 300, lineHeight: 1.85, letterSpacing: "0.04em" }}>
            {copy.inputLead}
          </div>
          {!input.trim() && (
            <p
              role="button"
              tabIndex={0}
              onClick={() => setInput(inputExample)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setInput(inputExample);
                }
              }}
              style={{
                margin: "12px 0 0",
                color: "#9b9084",
                fontSize: 12,
                fontWeight: 300,
                lineHeight: 1.7,
                letterSpacing: "0.02em",
                cursor: "pointer",
                opacity: inputFocused ? 0.5 : 1,
                transition: "opacity 160ms ease",
              }}
              title={isEn ? "Use this example" : "この例を入力に入れる"}
            >
              {copy.examplePrefix}
              {inputExample}
            </p>
          )}
        </div>
        {messages.some((m) => m.role === "assistant") && (
          <div style={{ marginBottom: 10 }}>
            <button type="button" onClick={handleSummarize} disabled={loadingSummary} style={{
              background: "#f6f0e7", border: "1px solid #e0d4c5", borderRadius: 8, color: "#6b5d52", fontSize: 12, padding: "8px 16px", cursor: loadingSummary ? "default" : "pointer", letterSpacing: "0.04em",
            }}>
              {loadingSummary ? copy.summarizing : copy.summarize}
            </button>
            {summaryError && <span style={{ marginLeft: 10, fontSize: 11, color: "#c17a6b" }}>{summaryError}</span>}
          </div>
        )}
        {waiting && (
          <div style={{ color: "#444", fontSize: 11, marginBottom: 8, letterSpacing: "0.04em" }}>
            {isEn ? "Please answer the check question." : "確認への回答を入力してください"}
          </div>
        )}
        <div style={{
          display: "flex", gap: 8,
          background: "#ffffff", border: "1px solid #decfbe",
          borderRadius: 12, padding: "11px 13px",
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={studyPlaceholder}
            aria-label="メッセージ入力"
            rows={3}
            style={{
              flex: 1, background: "none", border: "none",
              color: "#5b4c3e", fontSize: 14, lineHeight: 1.65,
              fontFamily: "inherit", fontWeight: 300, letterSpacing: "0.02em",
              minHeight: 74, maxHeight: 220, overflowY: "auto",
              padding: "2px 0",
            }}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            onInput={e => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 220) + "px";
            }}
          />
          <button type="button" aria-label="送信" onClick={() => handleSend()} disabled={loading || !input.trim()} style={{
            background: "none", border: "none",
            color: loading || !input.trim() ? "#d1c5b8" : "#a28d79",
            cursor: loading || !input.trim() ? "default" : "pointer",
            fontSize: 17, padding: "0 3px", alignSelf: "flex-end",
          }}>
            ↑
          </button>
        </div>
        {!showOnboarding && !inputFocused && (
          <div style={{
            color: "#a29384", fontSize: 10, textAlign: "center",
            marginTop: 8, letterSpacing: "0.03em", lineHeight: 1.5,
          }}>
            {isEn ? "Short messages (1–2 sentences) tend to respond faster." : "短い文（1〜2文）で送ると応答が返りやすくなります"}
          </div>
        )}
      </div>
      )}
    </div>
  );
}