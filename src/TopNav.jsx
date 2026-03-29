import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUiCopy } from "./uiCopy.js";

export default function TopNav({
  mode, // "chat" | "explore"
  lang, // "ja" | "en"
  langPref, // "ja" | "en" | null
  onSetLang, // (next: "ja" | "en") => void
  tone, // "normal" | "short" | "soft"
  onSetTone, // (next: "normal" | "short" | "soft") => void
  showTone = true,
  onReset, // () => void
  resetLabel, // string
  menuOpen,
  onToggleMenu, // () => void
  menuItems = [],
  maxWidth = 720,
}) {
  const isEn = lang === "en";
  const c = getUiCopy(isEn);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (!confirmReset) return;
    const t = setTimeout(() => setConfirmReset(false), 2200);
    return () => clearTimeout(t);
  }, [confirmReset]);

  const pillWrap = {
    display: "flex",
    gap: 12,
    alignItems: "center",
  };

  const pill = (selected) => ({
    padding: "7px 10px",
    borderRadius: 12,
    border: "1px solid " + (selected ? "#d7c8b7" : "#e0d4c5"),
    background: selected ? "#efe3d5" : "rgba(255,255,255,0.55)",
    color: selected ? "#5a4b3f" : "#8a7d6f",
    fontSize: 10,
    letterSpacing: "0.08em",
    cursor: "pointer",
    transition: "transform 120ms ease, background 160ms ease, border-color 160ms ease, box-shadow 160ms ease, color 160ms ease, opacity 160ms ease",
    userSelect: "none",
    minWidth: 48,
    textAlign: "center",
  });

  const chipWrap = {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 16,
    justifyContent: "center",
  };

  const chip = (selected) => ({
    padding: "9px 12px",
    borderRadius: 999,
    border: "1px solid " + (selected ? "#d7c8b7" : "#e0d4c5"),
    background: selected ? "#e7dbcc" : "#f6f0e7",
    color: selected ? "#5a4b3f" : "#a29384",
    fontSize: 11,
    letterSpacing: "0.06em",
    cursor: "pointer",
    transition: "transform 120ms ease, background 160ms ease, border-color 160ms ease, box-shadow 160ms ease, color 160ms ease, opacity 160ms ease",
    userSelect: "none",
  });

  const primaryTo = mode === "chat" ? "/explore" : "/";
  const primaryLabel = mode === "chat" ? c.navExplore : c.navChat;

  return (
    <div style={{ width: "100%", maxWidth, padding: "24px 22px 0", margin: "0 auto" }}>
      {/* ヘッダー行：左ロゴ / 右補助操作（コンパクト・右寄せ） */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ paddingTop: 2 }}>
          <div style={{ color: "#b39b7e", fontSize: 10, fontWeight: 400, letterSpacing: "0.18em" }}>
            GROUND
          </div>
        </div>

        <div style={{ position: "relative", ...pillWrap, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            aria-label={resetLabel}
            style={{
              padding: "7px 10px",
              borderRadius: 12,
              border: "1px solid #e0d4c5",
              background: confirmReset ? "#efe3d5" : "rgba(255,255,255,0.55)",
              color: "#6b5d52",
              fontSize: 10,
              letterSpacing: "0.08em",
              cursor: "pointer",
              minWidth: 56,
              transition: "transform 120ms ease, background 160ms ease, border-color 160ms ease, box-shadow 160ms ease",
              boxShadow: confirmReset ? "0 10px 26px rgba(33, 23, 11, 0.10)" : "none",
              textAlign: "center",
            }}
            className="ground-pressable"
            title={resetLabel}
          >
            {confirmReset ? (isEn ? "Reset?" : "リセット？") : resetLabel}
          </button>

          {confirmReset && (
            <div
              style={{
                position: "absolute",
                top: 46,
                right: 0,
                width: 240,
                background: "#fdfbf7",
                border: "1px solid #e0d4c5",
                borderRadius: 12,
                boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
                padding: 12,
                zIndex: 60,
              }}
              role="dialog"
              aria-label={isEn ? "Confirm reset" : "リセット確認"}
            >
              <div style={{ fontSize: 12, color: "#5a4b3f", lineHeight: 1.6, letterSpacing: "0.02em" }}>
                {isEn ? "Reset the current state?" : "いまの状態をリセットしますか？"}
              </div>
              <div style={{ marginTop: 10, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid #e0d4c5",
                    background: "#fdfbf7",
                    color: "#8a7d6f",
                    fontSize: 11,
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                  }}
                  className="ground-pressable"
                >
                  {isEn ? "Cancel" : "やめる"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmReset(false);
                    onReset?.();
                  }}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid #d7c8b7",
                    background: "#e7dbcc",
                    color: "#5a4b3f",
                    fontSize: 11,
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                  }}
                  className="ground-pressable"
                >
                  {isEn ? "Reset" : "リセット"}
                </button>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              type="button"
              onClick={() => onSetLang("ja")}
              aria-pressed={lang === "ja"}
              style={pill(lang === "ja")}
              className="ground-pressable"
              title={langPref ? (lang === "ja" ? "JP (fixed)" : "Switch to JP") : "JP"}
            >
              JP
            </button>
            <button
              type="button"
              onClick={() => onSetLang("en")}
              aria-pressed={lang === "en"}
              style={pill(lang === "en")}
              className="ground-pressable"
              title={langPref ? (lang === "en" ? "EN (fixed)" : "Switch to EN") : "EN"}
            >
              EN
            </button>
            <button
              type="button"
              onClick={onToggleMenu}
              aria-label={isEn ? "Menu" : "メニュー"}
              aria-expanded={menuOpen ? "true" : "false"}
              style={pill(menuOpen)}
              className="ground-pressable"
              title={isEn ? "Menu" : "メニュー"}
            >
              {isEn ? "Menu" : "メニュー"}
            </button>
          </div>

          {menuOpen && menuItems.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: 46,
                right: 0,
                width: 220,
                background: "#fdfbf7",
                border: "1px solid #e0d4c5",
                borderRadius: 12,
                boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
                overflow: "hidden",
                zIndex: 80,
              }}
              role="menu"
              aria-label={isEn ? "Menu" : "メニュー"}
            >
              {menuItems.map((it, idx) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={it.onClick}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 14px",
                    background: "transparent",
                    border: "none",
                    borderBottom: idx === menuItems.length - 1 ? "none" : "1px solid #efe6dc",
                    color: "#5a4b3f",
                    fontSize: 12,
                    letterSpacing: "0.03em",
                    cursor: "pointer",
                  }}
                  className="ground-pressable"
                >
                  {it.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA：主役（絶対に被らないようヘッダーと分離 + 余白確保） */}
      <div style={{ marginTop: 28, display: "flex", justifyContent: "center" }}>
        <Link
          to={primaryTo}
          style={{
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "14px 20px",
            minWidth: 220,
            borderRadius: 16,
            background: "#5a4b3f",
            color: "#fdfbf7",
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 14px 38px rgba(33,23,11,0.14)",
            fontSize: 13,
            letterSpacing: "0.08em",
            transition: "transform 140ms ease, box-shadow 180ms ease, filter 180ms ease",
          }}
          className="ground-cta"
          aria-label={primaryLabel}
        >
          {primaryLabel}
        </Link>
      </div>

      {/* トーン：CTAの下（チャットのみ） */}
      {showTone ? (
        <div style={{ marginTop: 24, ...chipWrap }}>
          {[
            { id: "normal", label: isEn ? "Normal" : "標準" },
            { id: "short", label: isEn ? "Short" : "短め" },
            { id: "soft", label: isEn ? "Soft" : "やわらかめ" },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              aria-label={`tone:${opt.label}`}
              aria-pressed={tone === opt.id}
              onClick={() => onSetTone?.(opt.id)}
              style={chip(tone === opt.id)}
              className="ground-pressable"
            >
              {opt.label}
            </button>
          ))}
        </div>
      ) : null}

      <style>{`
        .ground-pressable:active { transform: scale(0.96); }
        .ground-pressable:focus { outline: none; }
        .ground-cta:active { transform: scale(0.98); }
        .ground-cta:hover { filter: brightness(1.02); box-shadow: 0 16px 44px rgba(33,23,11,0.16); }
      `}</style>
    </div>
  );
}

