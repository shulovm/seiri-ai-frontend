import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { track } from "@vercel/analytics";
import { getPlanById, canSaveSummary } from "./plans.js";

const DEFAULT_DEV_API = "http://localhost:3001";
const API_BASE =
  import.meta.env.VITE_API_BASE ??
  (import.meta.env.DEV ? DEFAULT_DEV_API : "");

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
const PLAN_STORAGE_KEY = "ma_plan";
const BOOKMARKS_STORAGE_KEY = "ma_bookmarks";

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

async function organize({ text, mode, sessionId, onStreamChunk }) {
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
      body: JSON.stringify({ text, mode, session_id: sessionId }),
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
      aria-label={isUser ? "あなたのメッセージ" : "MAの返答"}
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
                return (
                  <p style={{ marginBottom: /^[A-D]\.\s/.test(text) ? '1em' : '0.65em' }}>
                    {children}
                  </p>
                );
              }
            }}
          >{formatOptions(msg.content)}</ReactMarkdown>
        )}
      </div>
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
  const [mode, setMode] = useState("short");
  const [shareFeedback, setShareFeedback] = useState(false);
  const [copyRowFeedback, setCopyRowFeedback] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(null);
  const [currentPlan] = useState(() => {
    try {
      const p = typeof localStorage !== "undefined" && localStorage.getItem(PLAN_STORAGE_KEY);
      return p && ["free", "light", "standard", "premium"].includes(p) ? p : "free";
    } catch (_) { return "free"; }
  });
  const [summaryPanelOpen, setSummaryPanelOpen] = useState(false);
  const [summaryPoints, setSummaryPoints] = useState(["", "", ""]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const allowSave = canSaveSummary(currentPlan);

  const refreshBookmarks = () => {
    try {
      const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      setBookmarks(raw ? JSON.parse(raw) : []);
    } catch (_) { setBookmarks([]); }
  };

  useEffect(() => {
    if (sidebarOpen) refreshBookmarks();
  }, [sidebarOpen]);
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
    try {
      localStorage.setItem(ONBOARDING_DONE_KEY, "1");
    } catch (_) {}
    if (!exampleText) setInput("");
    add("user", text);
    setLoading(true);
    const streamId = Date.now() + Math.random();
    streamStartedRef.current = false;
    try {
      const data = await organize({
        text,
        mode,
        sessionId: SESSION_ID,
        onStreamChunk: (accumulated) => {
          streamStartedRef.current = true;
          setMessages(prev => {
            const hasStream = prev.some(m => m.id === streamId);
            if (!hasStream) return [...prev, { role: "assistant", content: accumulated, type: "result", id: streamId }];
            return prev.map(m => (m.id === streamId ? { ...m, content: accumulated } : m));
          });
        },
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
      track("message_sent", { mode });
      if (exampleText) track("onboarding_example_sent");
    } catch (err) {
      if (streamStartedRef.current) {
        setMessages(prev => prev.filter(m => m.id !== streamId));
      }
      let msg = err?.serverMessage || "";
      if (msg === "ANTHROPIC_API_KEY is missing") {
        msg = "APIキーが設定されていません。管理者は環境変数「ANTHROPIC_API_KEY」を確認してください。";
      } else if (err?.status === 503 || err?.status === 504) {
        msg = mode === "short"
          ? "応答が時間内に返ってきませんでした。しばらくしてからもう一度お試しください。"
          : "応答が時間内に返ってきませんでした。\n\n「短め」モードで、1〜2文だけ送ってもう一度お試しください。";
      } else if (!msg) {
        msg =
          err?.message === "timeout"
            ? (mode === "short"
                ? "接続がタイムアウトしました。\n\nサーバーの起動に時間がかかっている可能性があります。1〜2分待ってから、もう一度「送信」を押してみてください。"
                : "応答が遅れています。「短め」モードで短い文をお試しください。")
            : err?.message === "Failed to fetch" || err?.name === "TypeError"
              ? "接続できませんでした。しばらくしてからもう一度お試しください。"
              : err?.status === 500
                ? (mode === "short"
                    ? "サーバーエラーです。しばらくしてからもう一度お試しください。"
                    : "サーバーエラーです。しばらくしてから、または「短め」で短い文でもう一度お試しください。")
                : (mode === "short"
                    ? "一時的なエラーです。しばらくしてからもう一度お試しください。"
                    : "一時的なエラーです。「短め」モードで短い文でもう一度お試しください。");
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

  const handleSummarize = async () => {
    if (!messages.some((m) => m.role === "assistant") || loadingSummary) return;
    setLoadingSummary(true);
    setSummaryError("");
    try {
      const data = await fetchSummarize(messages);
      const pts = Array.isArray(data.points) ? data.points : ["", "", ""];
      setSummaryPoints([pts[0] ?? "", pts[1] ?? "", pts[2] ?? ""]);
      setSummaryPanelOpen(true);
    } catch (e) {
      setSummaryError(e?.message === "timeout" ? "タイムアウトしました" : "要約できませんでした");
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleSaveSummaryToBookmark = () => {
    if (!allowSave) return;
    try {
      const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        points: [...summaryPoints],
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(list));
      setSavedFlash(true);
      refreshBookmarks();
      setTimeout(() => {
        setSavedFlash(false);
        setSummaryPanelOpen(false);
      }, 1200);
    } catch (_) {}
  };

  const handleShare = () => {
    const url = getAppUrl();
    const text = `答えを出さず、決断できる状態を整えるAI「MA」\n${url}`;
    navigator.clipboard?.writeText(text).then(() => {
      track("share_clicked");
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2000);
    }).catch(() => {});
  };

  const lastAssistantContent = [...messages].reverse().find(m => m.role === "assistant" && m.content && !["error", "info"].includes(m.type))?.content;
  const handleCopyLast = () => {
    if (!lastAssistantContent) return;
    navigator.clipboard?.writeText(lastAssistantContent).then(() => {
      setCopyRowFeedback(true);
      track("copy_response");
      setTimeout(() => setCopyRowFeedback(false), 2000);
    }).catch(() => {});
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
      `}</style>

      {/* サイドバー：かけら */}
      {sidebarOpen && (
        <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(320px, 85vw)", background: "#fdfbf7", borderLeft: "1px solid #e0d4c5", zIndex: 99, boxShadow: "-4px 0 20px rgba(0,0,0,0.06)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid #e8e0d5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 400, color: "#5a4b3f", letterSpacing: "0.06em" }}>かけら</span>
            <button type="button" onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", color: "#8a7d6f", fontSize: 18, cursor: "pointer", lineHeight: 1 }} aria-label="閉じる">×</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
            {bookmarks.length === 0 ? (
              <p style={{ fontSize: 12, color: "#a29384", lineHeight: 1.7 }}>まだかけらはありません。<br />「整理する」→「かけらに残す」で保存できます。</p>
            ) : (
              bookmarks.map((b) => (
                <div key={b.id} style={{ marginBottom: 16, padding: 12, background: "#f9f6f0", borderRadius: 8, border: "1px solid #e8e0d5" }}>
                  {(b.points || []).filter(Boolean).map((p, i) => (
                    <p key={i} style={{ fontSize: 12, color: "#5a4b3f", marginBottom: i < 2 ? 6 : 0, lineHeight: 1.6 }}>{p}</p>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {sidebarOpen && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.15)", zIndex: 98 }} onClick={() => setSidebarOpen(false)} aria-hidden="true" />}

      {/* ヘッダー */}
      <div style={{
        width: "100%", maxWidth: 660,
        padding: "32px 24px 0",
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
      }}>
        <div>
          <h1 style={{ margin: 0, color: "#b39b7e", fontSize: 10, fontWeight: 400, letterSpacing: "0.18em", marginBottom: 5 }}>
            MA
          </h1>
          <div style={{ color: "#75675a", fontSize: 11, fontWeight: 300, letterSpacing: "0.04em", lineHeight: 1.6 }}>
            決めるのは、あなた。<br />
            — 答えを出さず、決断できる状態を整えるAI —
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            display: "flex",
            background: "#f6f0e7",
            border: "1px solid #e0d4c5",
            borderRadius: 10,
            overflow: "hidden",
          }}>
            {[
              { id: "standard", label: "標準" },
              { id: "short", label: "短め" },
              { id: "soft", label: "やわらかめ" },
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                aria-label={`トーン: ${opt.label}`}
                aria-pressed={mode === opt.id}
                onClick={() => setMode(opt.id)}
                disabled={loading}
                style={{
                  background: mode === opt.id ? "#e7dbcc" : "transparent",
                  border: "none",
                  color: mode === opt.id ? "#5a4b3f" : "#a29384",
                  fontSize: 10,
                  padding: "6px 9px",
                  cursor: loading ? "default" : "pointer",
                  letterSpacing: "0.05em",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setSidebarOpen(true)} style={{
            fontSize: 11, padding: "5px 11px", borderRadius: 4, background: "none", border: "none",
            color: "#a19180", cursor: "pointer", letterSpacing: "0.05em",
          }}>
            かけら
          </button>
          <Link to="/plans" style={{
            fontSize: 11, padding: "5px 11px", borderRadius: 4,
            color: "#a19180", textDecoration: "none", letterSpacing: "0.05em",
          }}>
            プラン
          </Link>
          <button type="button" aria-label="新しい会話を始める" title="新しい会話を始める" onClick={handleReset} disabled={loading} style={{
            background: "none", border: "1px solid #e0d4c5",
            color: loading ? "#c3b7a8" : "#a19180",
            fontSize: 16, fontWeight: 300, padding: "2px 10px",
            borderRadius: 4, cursor: loading ? "default" : "pointer", letterSpacing: "0.02em",
            lineHeight: 1.2,
          }}>
            ＋
          </button>
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 660, padding: "0 24px" }}>
        <div style={{ height: 1, background: "#e1d8cd", margin: "18px 0 16px" }}/>
      </div>

      {/* メッセージ */}
      <main style={{
        flex: 1, width: "100%", maxWidth: 660,
        padding: "0 24px", overflowY: "auto",
        minHeight: "calc(100vh - 200px)",
      }} aria-live="polite" aria-label="会話">
        {messages.length === 0 && (
          <div style={{
            textAlign: "center", color: "#a19384", fontSize: 13,
            fontWeight: 300, marginTop: 90, lineHeight: 2.2, letterSpacing: "0.05em",
          }}>
            何でも話してください。<br/>
            答えは出しません。整理するだけです。
            {showOnboarding && (
              <div style={{ marginTop: 24 }}>
                <button
                  type="button"
                  onClick={() => handleSend("誰かに話したかった")}
                  style={{
                    background: "#f6f0e7",
                    border: "1px solid #e0d4c5",
                    borderRadius: 10,
                    color: "#6b5d52",
                    fontSize: 12,
                    padding: "10px 18px",
                    cursor: "pointer",
                    letterSpacing: "0.04em",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                  }}
                >
                  例: 誰かに話したかった → 送ってみる
                </button>
              </div>
            )}
          </div>
        )}
        {messages.map(msg => <Message key={msg.id} msg={msg} />)}
        {loading && (
          <div style={{ paddingLeft: 8, color: "#8a7d6f", fontSize: 12, marginTop: 4 }} aria-live="polite">
            <TypingDots/>
            <span style={{ display: "block", marginTop: 6 }}>少々お待ちください。通常は30秒〜1分ほどで返ります。</span>
          </div>
        )}
        {!loading && messages.some(m => m.role === "assistant") && (
          <div style={{ marginTop: 10, marginBottom: 6, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <button type="button" onClick={handleCopyLast} disabled={!lastAssistantContent} style={{
              background: "none", border: "none", padding: 0,
              color: copyRowFeedback ? "#8a9a6b" : "#8a7d6f",
              fontSize: 10, cursor: lastAssistantContent ? "pointer" : "default", letterSpacing: "0.04em",
            }}>
              {copyRowFeedback ? "コピーしました" : "コピー"}
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
            <button type="button" onClick={handleShare} style={{
              background: "none", border: "none", padding: 0,
              color: shareFeedback ? "#8a9a6b" : "#8a7d6f",
              fontSize: 10, cursor: "pointer", letterSpacing: "0.04em",
            }}>
              {shareFeedback ? "コピーしました" : "シェア"}
            </button>
          </div>
        )}
        <div ref={bottomRef}/>
      </main>

      {/* 今日の整理パネル */}
      {summaryPanelOpen && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
        }} onClick={() => setSummaryPanelOpen(false)}>
          <div style={{
            background: "#fdfbf7", borderRadius: 12, padding: "24px 24px 20px", maxWidth: 420, width: "90%", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "1px solid #e0d4c5",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 400, color: "#5a4b3f", letterSpacing: "0.04em" }}>今日の整理</span>
              <button type="button" onClick={() => setSummaryPanelOpen(false)} style={{ background: "none", border: "none", color: "#8a7d6f", fontSize: 18, cursor: "pointer", lineHeight: 1 }} aria-label="閉じる">×</button>
            </div>
            {summaryPoints.map((point, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 11, color: "#8a7d6f", marginBottom: 4 }}>{i + 1}.</label>
                <textarea
                  value={point}
                  onChange={e => setSummaryPoints(prev => { const n = [...prev]; n[i] = e.target.value; return n; })}
                  rows={2}
                  style={{
                    width: "100%", padding: "10px 12px", border: "1px solid #e0d4c5", borderRadius: 8, fontSize: 13, color: "#5a4b3f", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box",
                  }}
                />
              </div>
            ))}
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8, position: "relative" }}>
              {allowSave ? (
                <button type="button" onClick={handleSaveSummaryToBookmark} disabled={savedFlash} style={{
                  width: "100%", padding: "10px 16px", background: savedFlash ? "#f0ebe0" : "#e7dbcc", border: "none", borderRadius: 8, color: "#5a4b3f", fontSize: 12, cursor: savedFlash ? "default" : "pointer", letterSpacing: "0.04em",
                }}>
                  {savedFlash ? <span style={{ animation: "savedSparkle 1s ease" }}>✨</span> : "かけらに残す"}
                </button>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <button type="button" disabled style={{
                    width: "100%", padding: "10px 16px", background: "#e8e0d5", border: "none", borderRadius: 8, color: "#a29384", fontSize: 12, cursor: "default", letterSpacing: "0.04em",
                  }}>
                    かけらに残す
                  </button>
                  <p style={{ marginTop: 6, fontSize: 11, color: "#8a7d6f" }}>ライトプランでかけらに残せます</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 入力 */}
      <div style={{
        width: "100%", maxWidth: 660,
        padding: "12px 24px 28px",
        background: "linear-gradient(transparent, rgba(243,238,230,0.9) 32%)",
      }}>
        {messages.some((m) => m.role === "assistant") && (
          <div style={{ marginBottom: 10 }}>
            <button type="button" onClick={handleSummarize} disabled={loadingSummary} style={{
              background: "#f6f0e7", border: "1px solid #e0d4c5", borderRadius: 8, color: "#6b5d52", fontSize: 12, padding: "8px 16px", cursor: loadingSummary ? "default" : "pointer", letterSpacing: "0.04em",
            }}>
              {loadingSummary ? "要約中…" : "整理する"}
            </button>
            {summaryError && <span style={{ marginLeft: 10, fontSize: 11, color: "#c17a6b" }}>{summaryError}</span>}
          </div>
        )}
        {waiting && (
          <div style={{ color: "#444", fontSize: 11, marginBottom: 8, letterSpacing: "0.04em" }}>
            確認への回答を入力してください
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
            placeholder="いま頭の中にあることを、そのまま書いてください"
            aria-label="メッセージ入力"
            rows={1}
            style={{
              flex: 1, background: "none", border: "none",
              color: "#5b4c3e", fontSize: 14, lineHeight: 1.65,
              fontFamily: "inherit", fontWeight: 300, letterSpacing: "0.02em",
              minHeight: 22, maxHeight: 140, overflowY: "auto",
            }}
            onInput={e => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
            }}
          />
          <button type="button" aria-label="送信" onClick={handleSend} disabled={loading || !input.trim()} style={{
            background: "none", border: "none",
            color: loading || !input.trim() ? "#d1c5b8" : "#a28d79",
            cursor: loading || !input.trim() ? "default" : "pointer",
            fontSize: 17, padding: "0 3px", alignSelf: "flex-end",
          }}>
            ↑
          </button>
        </div>
        <div style={{
          color: "#b4a696", fontSize: 10, textAlign: "center",
          marginTop: 9, letterSpacing: "0.06em",
        }}>
          Enter で送信 · Shift+Enter で改行 · 判断はあなたにあります
        </div>
        {messages.length === 0 && !showOnboarding && (
          <div style={{
            color: "#a29384", fontSize: 10, textAlign: "center",
            marginTop: 6, letterSpacing: "0.03em",
          }}>
            短い文（1〜2文）で送ると応答が返りやすくなります
          </div>
        )}
      </div>
    </div>
  );
}