import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  analyzeMistakePhoto,
  getTodayStudyMenu,
  loadMistakeLogs,
  saveMistakeLog,
} from "./lib/sisterMistakeLog";

function formatDateJP(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function SisterStudy() {
  const [file, setFile] = useState(null);
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState(() => loadMistakeLogs());

  useEffect(() => {
    const onUpdate = () => setLogs(loadMistakeLogs());
    window.addEventListener("sister:logs", onUpdate);
    return () => window.removeEventListener("sister:logs", onUpdate);
  }, []);

  const todayMenu = useMemo(() => getTodayStudyMenu(logs), [logs]);

  const handleUpload = async () => {
    if (!file || loading) return;
    setLoading(true);
    try {
      const dataUrl = await readAsDataURL(file);
      // 入力負担最小化: 写真+任意メモのみで自動分類
      const analyzed = analyzeMistakePhoto({
        fileName: file.name,
        photoDataUrl: dataUrl,
        noteText: memo,
      });
      saveMistakeLog(analyzed);
      setMemo("");
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #fdfbf7 0, #f3eee6 42%, #efe7dd 100%)",
        fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif",
        color: "#5a4b3f",
        padding: "24px 20px 40px",
      }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <Link to="/" style={{ color: "#8a7d6f", fontSize: 12, textDecoration: "none" }}>
          ← チャットへ戻る
        </Link>

        <h1 style={{ marginTop: 18, fontSize: 20, fontWeight: 500 }}>SISTER 学習ログ</h1>
        <p style={{ marginTop: 6, color: "#7d6f62", fontSize: 13 }}>
          間違えた問題写真を入れるだけで、教科・単元・ミス原因・復習日を自動化します。
        </p>

        <>
            <section style={panelStyle}>
              <h2 style={h2Style}>間違えた問題写真ログ（入力最小）</h2>
              <div style={{ display: "grid", gap: 10 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <textarea
                  rows={2}
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="任意メモ（例: 相似の証明で詰まった）"
                  style={textareaStyle}
                />
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!file || loading}
                  style={primaryButtonStyle(!file || loading)}
                >
                  {loading ? "AI分析中..." : "写真を分析して苦手ノートに追加"}
                </button>
              </div>
            </section>

            <section style={panelStyle}>
              <h2 style={h2Style}>今日の学習メニュー（自動）</h2>
              <ul style={listStyle}>
                {todayMenu.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            <section style={panelStyle}>
              <h2 style={h2Style}>苦手ノート</h2>
              {logs.length === 0 ? (
                <p style={emptyStyle}>まだログがありません。まずは1枚アップロードしてみよう。</p>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {logs.slice(0, 12).map((log) => (
                    <div key={log.id} style={cardStyle}>
                      <div style={{ fontSize: 12, color: "#8a7d6f" }}>
                        {formatDateJP(log.createdAt)} / {log.photoName}
                      </div>
                      <div style={{ marginTop: 4, fontSize: 13 }}>
                        {label(log.subject)}・{log.topicName}・{log.problemType}
                      </div>
                      <div style={{ marginTop: 4, fontSize: 12 }}>
                        ミス原因: {log.missCause} / 入試優先度: {log.entrancePriority}
                      </div>
                      <div style={{ marginTop: 4, fontSize: 12 }}>
                        前提知識: {log.prerequisiteConcepts.length ? log.prerequisiteConcepts.join(" / ") : "なし"}
                      </div>
                      <div style={{ marginTop: 4, fontSize: 12 }}>
                        次回復習日: {formatDateJP(log.nextReviewDate)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
        </>
      </div>
    </div>
  );
}

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function label(subject) {
  if (subject === "math") return "数学";
  if (subject === "science") return "理科";
  if (subject === "english") return "英語";
  if (subject === "social") return "社会";
  return "国語";
}

const panelStyle = {
  marginTop: 16,
  background: "rgba(255,255,255,0.62)",
  border: "1px solid #e6dccf",
  borderRadius: 14,
  padding: 14,
};

const h2Style = {
  fontSize: 14,
  marginBottom: 10,
};

const textareaStyle = {
  width: "100%",
  border: "1px solid #dfd2c2",
  borderRadius: 8,
  padding: "8px 10px",
  fontFamily: "inherit",
  fontSize: 13,
  boxSizing: "border-box",
};

const primaryButtonStyle = (disabled) => ({
  padding: "10px 12px",
  border: "none",
  borderRadius: 10,
  background: disabled ? "#cabfb1" : "#5a4b3f",
  color: "#fff",
  cursor: disabled ? "default" : "pointer",
  fontSize: 12,
});

const listStyle = {
  margin: 0,
  paddingLeft: "1.2em",
  fontSize: 13,
  lineHeight: 1.8,
};

const emptyStyle = {
  color: "#8e7f72",
  fontSize: 12,
};

const cardStyle = {
  border: "1px solid #e5d9cb",
  borderRadius: 10,
  padding: 10,
  background: "#f9f5ef",
};

