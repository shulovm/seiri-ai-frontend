import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export default function SisterUnderstanding() {
  const [params] = useSearchParams();
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [qa, setQa] = useState([]);
  const [done, setDone] = useState(false);
  const [checked, setChecked] = useState(false);
  const [todayReview, setTodayReview] = useState([]);
  const [reviewIntro, setReviewIntro] = useState("");

  const studentId = params.get("studentId") || "";
  const themeIdFromUrl = params.get("themeId") || "";

  useEffect(() => {
    const fetchTheme = async () => {
      setLoading(true);
      try {
        const qs = new URLSearchParams();
        if (studentId) qs.set("studentId", studentId);
        const res = await fetch(`${API_BASE}/api/sister/theme/latest?${qs.toString()}`);
        const data = await res.json();
        if (data?.hasTheme) {
          const selected =
            themeIdFromUrl && data.theme?.themeId !== themeIdFromUrl
              ? { ...data.theme, themeId: themeIdFromUrl }
              : data.theme;
          setTheme(selected);
        }
        const reviewRes = await fetch(`${API_BASE}/api/sister/review/today?${qs.toString()}`);
        const reviewData = await reviewRes.json().catch(() => ({}));
        setTodayReview(Array.isArray(reviewData.items) ? reviewData.items : []);
        setReviewIntro(String(reviewData.intro || ""));
      } finally {
        setLoading(false);
      }
    };
    fetchTheme();
  }, [studentId, themeIdFromUrl]);

  const remaining = useMemo(() => {
    const used = qa.length;
    return Math.max(0, 3 - used);
  }, [qa.length]);

  const ask = async () => {
    if (!theme || !question.trim() || done) return;
    const res = await fetch(`${API_BASE}/api/sister/theme/question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        themeId: theme.themeId,
        studentId,
        question: question.trim(),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setQa((prev) => [
      ...prev,
      {
        q: question.trim(),
        a: `${data.answer || ""}${data.followup ? `\n${data.followup}` : ""}`.trim(),
      },
    ]);
    setQuestion("");
    if (data.done || Number(data.remaining) <= 0) setDone(true);
  };

  if (loading) {
    return <div style={wrapStyle}>読み込み中...</div>;
  }

  if (!theme) {
    return (
      <div style={wrapStyle}>
        <p style={{ color: "#6f6156" }}>まだ理解テーマがありません。LINEで問題写真を送ってね。</p>
        <Link to="/" style={backStyle}>← 戻る</Link>
      </div>
    );
  }

  return (
    <div style={wrapStyle}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <Link to="/" style={backStyle}>← 戻る</Link>

        <Section title="1. 今日の理解テーマ">
          {theme.title}
        </Section>
        <Section title="今日の脳に効く復習">
          <div style={{ marginBottom: 8 }}>{reviewIntro || "今やると覚えやすい復習を表示します。"}</div>
          {todayReview.length === 0 ? (
            <div>今日は対象なし</div>
          ) : (
            todayReview.map((item) => (
              <div key={item.id} style={{ marginBottom: 8 }}>
                ・{item.topicName}（{item.reason}）
              </div>
            ))
          )}
        </Section>
        <Section title="2. 私のつまずき">{theme.stumble}</Section>
        <Section title="3. 3分でわかる本質説明">{theme.essence}</Section>
        <Section title="4. 別の見方">{theme.anotherView}</Section>
        <Section title="5. よくある「こういう時は？」">
          {(theme.faq || []).map((x, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div>Q. {x.q}</div>
              <div>A. {x.a}</div>
            </div>
          ))}
        </Section>
        <Section title="6. 質問する">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={2}
            placeholder="この説明で気になることを一つだけ聞いてみよう"
            style={textareaStyle}
            disabled={done}
          />
          <div style={{ marginTop: 6, fontSize: 11, color: "#8a7d6f" }}>
            残り質問: {done ? 0 : remaining} / 3
          </div>
          <button type="button" onClick={ask} disabled={!question.trim() || done} style={buttonStyle}>
            質問する
          </button>
          <div style={{ marginTop: 10 }}>
            {qa.map((item, i) => (
              <div key={i} style={qaStyle}>
                <div style={{ fontSize: 12, color: "#5a4b3f" }}>Q. {item.q}</div>
                <div style={{ marginTop: 4, fontSize: 12, color: "#6d5f53", whiteSpace: "pre-wrap" }}>
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </Section>
        <Section title="7. 今日の確認1問">
          {theme.quickCheckQuestion}
        </Section>
        <Section title="8. できたボタン">
          <button
            type="button"
            onClick={async () => {
              setChecked(true);
              if (theme?.themeId) {
                await fetch(`${API_BASE}/api/sister/review/complete`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    logId: theme.themeId,
                    isCorrect: true,
                    answerTimeSec: 180,
                  }),
                }).catch(() => {});
              }
            }}
            style={buttonStyle}
          >
            できた
          </button>
          {checked && <div style={{ marginTop: 8, fontSize: 12 }}>OK。次の復習メニューに反映したよ。</div>}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section style={sectionStyle}>
      <h2 style={{ margin: 0, fontSize: 14 }}>{title}</h2>
      <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.7 }}>{children}</div>
    </section>
  );
}

const wrapStyle = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top, #fdfbf7 0, #f3eee6 42%, #efe7dd 100%)",
  padding: "24px 20px 32px",
  fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif",
};

const sectionStyle = {
  marginTop: 12,
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #e2d7c8",
  background: "rgba(255,255,255,0.64)",
  color: "#5a4b3f",
};

const textareaStyle = {
  width: "100%",
  boxSizing: "border-box",
  borderRadius: 10,
  border: "1px solid #dfd2c2",
  padding: "8px 10px",
  fontFamily: "inherit",
  fontSize: 13,
  background: "#fff",
};

const buttonStyle = {
  marginTop: 8,
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid #d7c8b7",
  background: "#e8ded1",
  color: "#5a4b3f",
  cursor: "pointer",
  fontSize: 12,
};

const qaStyle = {
  marginBottom: 8,
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid #e8decf",
  background: "#f8f4ed",
};

const backStyle = {
  color: "#8a7d6f",
  fontSize: 12,
  textDecoration: "none",
};
