import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const API_BASE = "http://localhost:3001";
const SESSION_ID = "default";

async function organize(text) {
  const res = await fetch(`${API_BASE}/api/organize`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ text, session_id: SESSION_ID }),
  });
  return res.json();
}

async function resetSession() {
  await fetch(`${API_BASE}/api/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: SESSION_ID }),
  });
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
          width: 5, height: 5, borderRadius: "50%", background: "#666",
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
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: 20,
      animation: "fadeIn 0.3s ease",
    }}>
      <div className={!isUser ? "md" : undefined} style={{
        maxWidth: "72%",
        padding: isUser ? "11px 15px" : "15px 19px",
        borderRadius: isUser ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
        background: isUser ? "#333" : "#1e1e1e",
        color: isUser ? "#ddd" : "#b8b8b8",
        fontSize: 14,
        lineHeight: 1.8,
        letterSpacing: "0.02em",
        borderLeft: msg.type === "safety" ? "2px solid #555"
                  : msg.type === "question" ? "2px solid #444"
                  : "none",
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

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const add = (role, content, type = "result") =>
    setMessages(p => [...p, { role, content, type, id: Date.now() + Math.random() }]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    add("user", text);
    setLoading(true);
    try {
      const data = await organize(text);
      if (data.type === "question") {
        add("assistant", data.question, "question");
        setWaiting(true);
      } else if (data.type === "safety") {
        add("assistant", data.output, "safety");
        setWaiting(false);
      } else {
        add("assistant", data.output, "result");
        setWaiting(false);
      }
    } catch {
      add("assistant", "接続できませんでした。サーバーを確認してください。", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleReset = async () => {
    await resetSession();
    setMessages([]);
    setWaiting(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#141414",
      display: "flex", flexDirection: "column", alignItems: "center",
      fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #141414; }
        textarea { resize: none; }
        textarea:focus { outline: none; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #2e2e2e; border-radius: 2px; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:0.2; transform:scale(0.8); } 50% { opacity:0.8; transform:scale(1); } }
        .md p { margin-bottom: 0.75em; }
        .md p:last-child { margin-bottom: 0; }
        .md ul, .md ol { padding-left: 1.4em; margin-bottom: 0.75em; }
        .md li { margin-bottom: 0.3em; }
        .md strong { color: #ccc; font-weight: 400; }
        .md code { background: #252525; padding: 1px 5px; border-radius: 3px; font-size: 12px; }
      `}</style>

      {/* ヘッダー */}
      <div style={{
        width: "100%", maxWidth: 660,
        padding: "32px 24px 0",
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
      }}>
        <div>
          <div style={{ color: "#666", fontSize: 10, letterSpacing: "0.18em", marginBottom: 5 }}>
            SEIRI AI
          </div>
          <div style={{ color: "#3a3a3a", fontSize: 12, fontWeight: 300, letterSpacing: "0.06em" }}>
            思考を壊さないための場所
          </div>
        </div>
        <button onClick={handleReset} style={{
          background: "none", border: "1px solid #2a2a2a",
          color: "#444", fontSize: 11, padding: "5px 11px",
          borderRadius: 4, cursor: "pointer", letterSpacing: "0.05em",
        }}>
          リセット
        </button>
      </div>

      <div style={{ width: "100%", maxWidth: 660, padding: "0 24px" }}>
        <div style={{ height: 1, background: "#1e1e1e", margin: "20px 0" }}/>
      </div>

      {/* メッセージ */}
      <div style={{
        flex: 1, width: "100%", maxWidth: 660,
        padding: "0 24px", overflowY: "auto",
        minHeight: "calc(100vh - 200px)",
      }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: "center", color: "#2e2e2e", fontSize: 13,
            fontWeight: 300, marginTop: 100, lineHeight: 2.2, letterSpacing: "0.05em",
          }}>
            何でも話してください。<br/>
            答えは出しません。整理するだけです。
          </div>
        )}
        {messages.map(msg => <Message key={msg.id} msg={msg}/>)}
        {loading && (
          <div style={{ paddingLeft: 8 }}>
            <TypingDots/>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* 入力 */}
      <div style={{
        width: "100%", maxWidth: 660,
        padding: "12px 24px 28px",
        background: "linear-gradient(transparent, #141414 28%)",
      }}>
        {waiting && (
          <div style={{ color: "#444", fontSize: 11, marginBottom: 8, letterSpacing: "0.04em" }}>
            確認への回答を入力してください
          </div>
        )}
        <div style={{
          display: "flex", gap: 8,
          background: "#1a1a1a", border: "1px solid #272727",
          borderRadius: 12, padding: "11px 13px",
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="いま頭の中にあることを、そのまま書いてください"
            rows={1}
            style={{
              flex: 1, background: "none", border: "none",
              color: "#bbb", fontSize: 14, lineHeight: 1.65,
              fontFamily: "inherit", fontWeight: 300, letterSpacing: "0.02em",
              minHeight: 22, maxHeight: 140, overflowY: "auto",
            }}
            onInput={e => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
            }}
          />
          <button onClick={handleSend} disabled={loading || !input.trim()} style={{
            background: "none", border: "none",
            color: loading || !input.trim() ? "#2e2e2e" : "#555",
            cursor: loading || !input.trim() ? "default" : "pointer",
            fontSize: 17, padding: "0 3px", alignSelf: "flex-end",
          }}>
            ↑
          </button>
        </div>
        <div style={{
          color: "#252525", fontSize: 10, textAlign: "center",
          marginTop: 9, letterSpacing: "0.06em",
        }}>
          Enter で送信 · Shift+Enter で改行 · 判断はあなたにあります
        </div>
      </div>
    </div>
  );
}