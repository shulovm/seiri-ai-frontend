import { Link } from "react-router-dom";
import { PLANS } from "./plans.js";

const cardStyle = (isHighlight) => ({
  background: "#ffffff",
  border: `1px solid ${isHighlight ? "#c4b5a0" : "#e0d4c5"}`,
  borderRadius: 12,
  padding: "24px 20px",
  boxShadow: isHighlight ? "0 4px 16px rgba(0,0,0,0.06)" : "0 2px 8px rgba(0,0,0,0.03)",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  minHeight: 280,
});

export default function Plans() {
  const handleSelectPlan = (plan) => {
    if (plan.id === "free") {
      return;
    }
    // TODO: Stripe Checkout へ遷移（stripePriceId で createCheckoutSession 等）
    console.log("Select plan:", plan.id, plan.stripePriceId);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #fdfbf7 0, #f3eee6 42%, #efe7dd 100%)",
        fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif",
        padding: "32px 24px 48px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400&display=swap');
      `}</style>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <Link
            to="/"
            style={{
              color: "#8a7d6f",
              fontSize: 12,
              textDecoration: "none",
              letterSpacing: "0.04em",
            }}
          >
            ← チャットに戻る
          </Link>
        </div>

        <h1
          style={{
            color: "#5a4b3f",
            fontSize: 18,
            fontWeight: 400,
            letterSpacing: "0.06em",
            marginBottom: 8,
          }}
        >
          プラン
        </h1>
        <p
          style={{
            color: "#8a7d6f",
            fontSize: 13,
            fontWeight: 300,
            lineHeight: 1.7,
            marginBottom: 32,
          }}
        >
          決めるのは、あなた。GROUND の利用回数と機能でお選びください。
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
          }}
        >
          {PLANS.map((plan) => {
            const isFree = plan.id === "free";
            const isPremium = plan.id === "premium";
            return (
              <div
                key={plan.id}
                style={cardStyle(isPremium)}
              >
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    color: "#b39b7e",
                    marginBottom: 4,
                  }}
                >
                  {plan.nameEn.toUpperCase()}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 400,
                    color: "#5a4b3f",
                    marginBottom: 8,
                  }}
                >
                  {plan.name}
                </div>
                <div
                  style={{
                    marginBottom: 16,
                  }}
                >
                  <span style={{ fontSize: 24, color: "#5a4b3f" }}>
                    {plan.priceDisplay}
                  </span>
                  {plan.period && (
                    <span style={{ fontSize: 13, color: "#8a7d6f", marginLeft: 4 }}>
                      /{plan.period}
                    </span>
                  )}
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    flex: 1,
                    fontSize: 12,
                    color: "#6b5d52",
                    lineHeight: 2,
                    letterSpacing: "0.02em",
                  }}
                >
                  {plan.features.map((f, i) => (
                    <li key={i} style={{ paddingLeft: 0 }}>{f}</li>
                  ))}
                </ul>
                <div style={{ marginTop: 20 }}>
                  {isFree ? (
                    <span
                      style={{
                        display: "inline-block",
                        padding: "8px 16px",
                        fontSize: 12,
                        color: "#8a7d6f",
                        letterSpacing: "0.04em",
                      }}
                    >
                      現在のプラン
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan)}
                      style={{
                        width: "100%",
                        padding: "10px 16px",
                        background: isPremium ? "#5a4b3f" : "#e7dbcc",
                        border: "none",
                        borderRadius: 8,
                        color: isPremium ? "#fdfbf7" : "#5a4b3f",
                        fontSize: 12,
                        cursor: "pointer",
                        letterSpacing: "0.06em",
                      }}
                    >
                      申し込む
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 40,
            padding: "20px 24px",
            background: "#f9f6f0",
            border: "1px solid #e8e0d5",
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 400, color: "#5a4b3f", marginBottom: 10, letterSpacing: "0.04em" }}>
            今日の整理・保存
          </div>
          <ul style={{ margin: 0, paddingLeft: "1.2em", fontSize: 12, color: "#6b5d52", lineHeight: 1.9, letterSpacing: "0.02em" }}>
            <li>会話を「整理する」で3点要約。各項目は自由に編集可能</li>
            <li>ライト以上で「かけらに残す」が利用可能。フリーは整理・編集のみ（保存不可）</li>
          </ul>
        </div>

        <p
          style={{
            marginTop: 32,
            fontSize: 11,
            color: "#a29384",
            letterSpacing: "0.03em",
          }}
        >
          決済は Stripe にて安全に処理されます。解約はいつでも可能です。
        </p>
      </div>
    </div>
  );
}
