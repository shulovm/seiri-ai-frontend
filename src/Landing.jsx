import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse 120% 80% at 50% -10%, #f5f0e8 0%, #ebe4d9 35%, #e2d9cc 70%, #d8cdbe 100%)",
        fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif",
        color: "#3d3529",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500&display=swap');
        .landing-fade { animation: landingFade 1s ease-out; }
        @keyframes landingFade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .landing-fade-delay-1 { animation: landingFade 0.9s ease-out 0.15s both; }
        .landing-fade-delay-2 { animation: landingFade 0.9s ease-out 0.3s both; }
        .landing-fade-delay-3 { animation: landingFade 0.9s ease-out 0.45s both; }
        .landing-fade-delay-4 { animation: landingFade 0.9s ease-out 0.6s both; }
      `}</style>

      <header
        style={{
          padding: "28px 24px 0",
          maxWidth: 720,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: "0.2em",
            color: "#6b5d4f",
          }}
        >
          GROUND
        </span>
        <nav style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Link
            to="/ma/"
            style={{
              fontSize: 12,
              color: "#8a7d6f",
              textDecoration: "none",
              letterSpacing: "0.04em",
            }}
          >
            アプリを開く
          </Link>
        </nav>
      </header>

      <main
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "clamp(48px, 12vw, 96px) 24px 80px",
          textAlign: "center",
        }}
      >
        <p
          className="landing-fade"
          style={{
            fontSize: "clamp(11px, 2vw, 12px)",
            letterSpacing: "0.2em",
            color: "#8a7d6f",
            marginBottom: 16,
            textTransform: "uppercase",
          }}
        >
          思考を整理するAI
        </p>
        <h1
          className="landing-fade-delay-1"
          style={{
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 400,
            lineHeight: 1.5,
            letterSpacing: "0.02em",
            color: "#3d3529",
            marginBottom: 24,
          }}
        >
          答えを出さず、<br />
          思考を整理する。
        </h1>
        <p
          className="landing-fade-delay-2"
          style={{
            fontSize: 15,
            fontWeight: 300,
            lineHeight: 1.9,
            color: "#5a4f42",
            marginBottom: 40,
            letterSpacing: "0.03em",
          }}
        >
          頭の中がごちゃごちゃしているとき。<br />
          誰かに話したいけど、話せないとき。<br />
          GROUNDは「正解」を言わない。あなたの言葉を聞いて、<br />
          一緒に整理するだけ。
        </p>
        <div className="landing-fade-delay-3" style={{ marginBottom: 56 }}>
          <Link
            to="/ma/"
            style={{
              display: "inline-block",
              padding: "14px 32px",
              background: "#5a4f42",
              color: "#f5f0e8",
              fontSize: 13,
              fontWeight: 400,
              letterSpacing: "0.08em",
              textDecoration: "none",
              borderRadius: 9999,
              boxShadow: "0 4px 16px rgba(58, 50, 38, 0.2)",
              transition: "background 0.2s, transform 0.15s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#4a4036";
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#5a4f42";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            はじめる
          </Link>
        </div>

        <section
          className="landing-fade-delay-4"
          style={{
            textAlign: "left",
            padding: "32px 24px",
            background: "rgba(255,255,255,0.4)",
            borderRadius: 16,
            border: "1px solid rgba(210,199,186,0.6)",
          }}
        >
          <h2
            style={{
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.1em",
              color: "#6b5d4f",
              marginBottom: 16,
            }}
          >
            こんなときに
          </h2>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              fontSize: 14,
              fontWeight: 300,
              lineHeight: 2.2,
              color: "#5a4f42",
              letterSpacing: "0.02em",
            }}
          >
            <li>・ やるべきことが多すぎて、何から手をつければいいかわからない</li>
            <li>・ モヤモヤしているけど、誰にどう話せばいいかわからない</li>
            <li>・ 自分が何を考えているのか、言葉にしたい</li>
            <li>・ 決断したいけど、頭がまとまらない</li>
          </ul>
        </section>

        <p
          style={{
            marginTop: 48,
            fontSize: 11,
            color: "#9a8f82",
            letterSpacing: "0.04em",
          }}
        >
          判断するのは、いつもあなた。
        </p>
      </main>

      <footer
        style={{
          padding: "24px 24px 32px",
          textAlign: "center",
          borderTop: "1px solid rgba(210,199,186,0.5)",
        }}
      >
        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.15em",
            color: "#a89b8d",
          }}
        >
          GROUND — ground.ink
        </span>
      </footer>
    </div>
  );
}
