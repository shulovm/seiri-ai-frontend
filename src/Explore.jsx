import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { track } from "@vercel/analytics";
import { pickSuggestion } from "./suggestions.js";
import TopNav from "./TopNav.jsx";
import {
  getStoredLangPref,
  setStoredLangPref,
  getStoredTonePref,
  setStoredTonePref,
} from "./prefs.js";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

function detectLang(text) {
  if (!text || typeof text !== "string") return "ja";
  const t = text.trim();
  if (!t.length) return "ja";
  const ascii = (t.match(/[a-zA-Z]/g) || []).length;
  const total = (t.replace(/\s/g, "").length) || 1;
  return total > 0 && ascii / total > 0.5 ? "en" : "ja";
}

async function fetchExploreCards({ theme, path, lang }) {
  const res = await fetch(`${API_BASE}/api/explore/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ theme, path, lang }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "explore cards failed");
  return data;
}

async function fetchExploreCardsAdvanced({ theme, path, lang, strategy, angle, previous_cards }) {
  const res = await fetch(`${API_BASE}/api/explore/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ theme, path, lang, strategy, angle, previous_cards }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "explore cards failed");
  return data;
}

async function fetchExploreSummary({ theme, path, lang }) {
  const res = await fetch(`${API_BASE}/api/explore/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ theme, path, lang }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "explore summary failed");
  return data;
}

import { pushKakera } from "./kakera.js";
import { getUiCopy } from "./uiCopy.js";

function buildExploreOriginalInput(themeText, pathArr, en) {
  let s = (en ? "Theme:\n" : "テーマ:\n") + themeText;
  if (pathArr && pathArr.length) {
    s += (en ? "\n\nChoices:\n" : "\n\n選んだ流れ:\n") + pathArr.map((p, i) => `${i + 1}. ${p}`).join("\n");
  }
  return s.slice(0, 50000);
}

export default function Explore() {
  const nav = useNavigate();
  const [tone, setTone] = useState(() => getStoredTonePref());
  const [langPref, setLangPref] = useState(() => getStoredLangPref()); // null = auto
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("");
  const [started, setStarted] = useState(false);
  const [path, setPath] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [entering, setEntering] = useState(false);
  const [loadingTick, setLoadingTick] = useState(0);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultNarrative, setResultNarrative] = useState("");
  const [resultPoints, setResultPoints] = useState(["", "", ""]);
  const [helperNote, setHelperNote] = useState("");
  const [angleOpen, setAngleOpen] = useState(false);
  const [angleFree, setAngleFree] = useState("");
  const bottomRef = useRef(null);
  const [themeFocused, setThemeFocused] = useState(false);

  const autoLangSource = useMemo(() => theme || (path[path.length - 1] || ""), [theme, path]);
  const lang = langPref || detectLang(autoLangSource);
  const isEn = lang === "en";
  const copy = getUiCopy(isEn);
  const [exploreSaveNotice, setExploreSaveNotice] = useState(false);
  const [themeExample, setThemeExample] = useState("");

  useEffect(() => {
    setThemeExample(pickSuggestion(lang, "random"));
  }, [lang]);

  useEffect(() => {
    const sync = () => {
      setLangPref(getStoredLangPref());
      setTone(getStoredTonePref());
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [cards, started, saving, exploreSaveNotice]);

  useEffect(() => {
    if (!started) return;
    if (!Array.isArray(cards) || cards.length === 0) return;
    setEntering(true);
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) setEntering(false);
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [cards, started]);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setLoadingTick((t) => (t + 1) % 2), 1400);
    return () => clearInterval(id);
  }, [loading]);

  const loadNext = async (nextPath, opts = {}) => {
    if (!theme.trim()) return;
    setLoading(true);
    setErr("");
    try {
      const previous_cards = cards.map((c) => String(c?.title || "").trim()).filter(Boolean);
      const data = opts.strategy || opts.angle
        ? await fetchExploreCardsAdvanced({
            theme: theme.trim(),
            path: nextPath,
            lang,
            strategy: opts.strategy,
            angle: opts.angle,
            previous_cards,
          })
        : await fetchExploreCards({ theme: theme.trim(), path: nextPath, lang });
      const nextCards = Array.isArray(data.cards) ? data.cards : [];
      setCards(nextCards.slice(0, 4));
    } catch (e) {
      setErr(isEn ? "Couldn’t load cards. Please try again." : "カードを読み込めませんでした。もう一度お試しください。");
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const start = async () => {
    if (!theme.trim() || loading) return;
    setStarted(true);
    setPath([]);
    setHelperNote("");
    setSelectedTitle("");
    track("explore_start");
    await loadNext([]);
  };

  const onSelect = async (card) => {
    const title = String(card?.title || "").trim();
    if (!title || loading) return;
    setTransitioning(true);
    setSelectedTitle(title);
    setHelperNote("");
    // 進んだ感：選択を見せてから次の層へ
    await new Promise((r) => setTimeout(r, 55));
    const nextPath = [...path, title];
    setPath(nextPath);
    track("explore_select", { depth: nextPath.length });
    await loadNext(nextPath);
    setSelectedTitle("");
    setTimeout(() => setTransitioning(false), 150);
  };

  const stuck = async () => {
    if (!started || loading) return;
    setTransitioning(true);
    setSelectedTitle("");
    setHelperNote(isEn ? "Let’s try a different angle." : "少し違う角度から考えてみます。");
    track("explore_stuck");
    await loadNext(path, { strategy: "shift" });
    setTimeout(() => setTransitioning(false), 150);
  };

  const openAngle = () => {
    if (!started || loading) return;
    setAngleFree("");
    setAngleOpen(true);
    track("explore_angle_open");
  };

  const applyAngle = async (angleText) => {
    const a = String(angleText || "").trim();
    setAngleOpen(false);
    if (!a) return;
    setTransitioning(true);
    setSelectedTitle("");
    setHelperNote(isEn ? "Switching perspective." : "視点を切り替えてみます。");
    const label = isEn ? `Different angle: ${a}` : `別視点：${a}`;
    const short = label.length > 28 ? label.slice(0, 28) + "…" : label;
    const nextPath = [...path, short];
    setPath(nextPath);
    track("explore_angle_apply");
    await loadNext(nextPath, { strategy: "angle", angle: a });
    setTimeout(() => setTransitioning(false), 150);
  };

  const back = async () => {
    if (loading) return;
    if (!started) return nav("/");
    if (path.length === 0) {
      setStarted(false);
      setCards([]);
      setErr("");
      return;
    }
    setTransitioning(true);
    setSelectedTitle("");
    setHelperNote("");
    const nextPath = path.slice(0, -1);
    setPath(nextPath);
    await loadNext(nextPath);
    setTimeout(() => setTransitioning(false), 150);
  };

  const [kakeraPendingOriginal, setKakeraPendingOriginal] = useState("");
  const [resultModalEdit, setResultModalEdit] = useState(false);

  const requestSummary = async (pathForSummary) => {
    const t = theme.trim();
    if (!t || saving) return;
    setSaving(true);
    setErr("");
    try {
      const data = await fetchExploreSummary({ theme: t, path: pathForSummary, lang });
      const points = Array.isArray(data.points) ? data.points : [];
      const narrative = typeof data.narrative === "string" ? data.narrative.trim() : "";
      setKakeraPendingOriginal(buildExploreOriginalInput(t, pathForSummary, lang === "en"));
      setResultNarrative(narrative);
      setResultPoints([points[0] ?? "", points[1] ?? "", points[2] ?? ""]);
      setResultModalEdit(false);
      setResultOpen(true);
      track("explore_summarize_shown");
    } catch (_) {
      setErr(isEn ? "Couldn’t summarize. Try again." : "要約できませんでした。もう一度お試しください。");
    } finally {
      setSaving(false);
    }
  };

  const saveExploreToKakera = () => {
    try {
      pushKakera({
        source: "explore",
        points: [...resultPoints],
        originalInput: kakeraPendingOriginal,
      });
      setResultOpen(false);
      setExploreSaveNotice(true);
      setTimeout(() => setExploreSaveNotice(false), 12000);
      track("explore_kakera_saved");
    } catch (_) {
      setErr(isEn ? "Couldn’t save." : "保存できませんでした。");
    }
  };

  const summarizeFromInputOnly = () => requestSummary([]);
  const summarizeFromExplore = () => {
    if (!started) return;
    requestSummary(path);
  };

  const cardStyle = {
    background: "#f6f0e7",
    border: "1px solid #e0d4c5",
    borderRadius: 14,
    padding: "16px 16px",
    fontSize: 14,
    color: "#2a3a4f",
    cursor: "pointer",
    letterSpacing: "0.02em",
    textAlign: "left",
    width: "100%",
    boxShadow: "0 6px 18px rgba(33, 23, 11, 0.08)",
    transition: "transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease",
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
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f3eee6; }
        .explore-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 520px) { .explore-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 900px) { .explore-grid { grid-template-columns: repeat(2, 1fr); } }
        textarea:focus { outline: none; }
        .explore-card:hover { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(33, 23, 11, 0.12); background: #f8f3ec; }
        .explore-card:active { transform: translateY(0px) scale(0.96); box-shadow: 0 6px 18px rgba(33, 23, 11, 0.10); }
        .explore-helper { background: rgba(255,255,255,0.55); border: 1px solid #e8e0d5; }
        .explore-helper:hover { background: rgba(255,255,255,0.7); box-shadow: 0 10px 26px rgba(33, 23, 11, 0.10); }
        /* カード一式：控えめ・速め（統一・上品） */
        .explore-fade { opacity: 1; transform: translateY(0) scale(1); transition: opacity 150ms cubic-bezier(0.2, 0.85, 0.35, 1), transform 150ms cubic-bezier(0.2, 0.85, 0.35, 1); }
        .explore-fade.out { opacity: 0; transform: translateY(3px) scale(0.993); }
        .explore-selected { border-color: rgba(179, 155, 126, 0.8) !important; box-shadow: 0 12px 34px rgba(33, 23, 11, 0.14) !important; background: #fbf7f1 !important; }
        .explore-dim { opacity: 0.18; transform: translateY(4px) scale(0.99); filter: saturate(0.9); }
        .explore-hide { opacity: 0; transform: translateY(8px) scale(0.985); pointer-events: none; }
        .explore-enter { opacity: 0; transform: translateY(4px) scale(0.992); }
        .explore-enter.in { opacity: 1; transform: translateY(0) scale(1); transition: opacity 150ms cubic-bezier(0.2, 0.85, 0.35, 1), transform 150ms cubic-bezier(0.2, 0.85, 0.35, 1); }
        .crumb-anim { animation: crumbPop 220ms ease; }
        @keyframes crumbPop { from { opacity: 0.65; transform: translateY(2px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 720, margin: "0 auto" }}>
          <TopNav
            mode="explore"
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
              setStarted(false);
              setTheme("");
              setPath([]);
              setCards([]);
              setErr("");
              setHelperNote("");
              setSelectedTitle("");
              setAngleOpen(false);
              setAngleFree("");
              setResultOpen(false);
              setResultNarrative("");
              setResultPoints(["", "", ""]);
              setKakeraPendingOriginal("");
              setResultModalEdit(false);
              setExploreSaveNotice(false);
            }}
            menuOpen={menuOpen}
            onToggleMenu={() => setMenuOpen((p) => !p)}
            menuItems={[
              {
                id: "new-chat",
                label: isEn ? "New chat" : "新しい会話",
                onClick: () => {
                  setMenuOpen(false);
                  try {
                    localStorage.removeItem("ma_messages");
                  } catch (_) {}
                  nav("/");
                },
              },
              {
                id: "kakera",
                label: copy.kakera,
                onClick: () => {
                  setMenuOpen(false);
                  try {
                    sessionStorage.setItem("ground_open_kakera", "1");
                  } catch (_) {}
                  nav("/");
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
            showTone={false}
          />
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 720, padding: "0 24px", margin: "0 auto" }}>
        <div style={{ height: 1, background: "#e1d8cd", margin: "16px 0 14px" }} />
      </div>

      <main style={{
        flex: 1, width: "100%", maxWidth: 720,
        padding: "0 24px 22px",
        margin: "0 auto",
      }}>
        <div style={{
          background: "rgba(255,255,255,0.55)",
          border: "1px solid #e8e0d5",
          borderRadius: 14,
          padding: "18px 18px 16px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
        }}>
          <div>
            {!started ? (
              <>
                <div style={{ color: "#75675a", fontSize: 13, fontWeight: 300, lineHeight: 1.75, letterSpacing: "0.04em", marginBottom: 10 }}>
                  {copy.inputLead}
                </div>
                {!theme.trim() && (
                  <p
                    role="button"
                    tabIndex={0}
                    onClick={() => setTheme(themeExample)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setTheme(themeExample);
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
                      opacity: themeFocused ? 0.5 : 1,
                      transition: "opacity 160ms ease",
                    }}
                    title={isEn ? "Use this example" : "この例を入力に入れる"}
                  >
                    {copy.examplePrefix}
                    {themeExample}
                  </p>
                )}
                <textarea
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder={copy.placeholderSoft}
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
                  }}
                  onFocus={() => setThemeFocused(true)}
                  onBlur={() => setThemeFocused(false)}
                />
                <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={start}
                    disabled={!theme.trim() || loading || saving}
                    style={{
                      padding: "10px 18px",
                      background: "#5a4b3f",
                      border: "none",
                      borderRadius: 12,
                      color: "#fdfbf7",
                      fontSize: 12,
                      cursor: !theme.trim() || loading || saving ? "default" : "pointer",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {copy.startExplore}
                  </button>
                  {theme.trim() ? (
                    <button
                      type="button"
                      onClick={summarizeFromInputOnly}
                      disabled={saving || loading}
                      style={{
                        padding: "9px 14px",
                        background: "#f6f0e7",
                        border: "1px solid #e0d4c5",
                        borderRadius: 12,
                        color: "#5a4b3f",
                        fontSize: 12,
                        cursor: saving || loading ? "default" : "pointer",
                        letterSpacing: "0.06em",
                        whiteSpace: "nowrap",
                        flex: "0 0 auto",
                      }}
                    >
                      {saving ? copy.summarizing : copy.summarize}
                    </button>
                  ) : null}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 11, color: "#8a7d6f", letterSpacing: "0.04em", marginBottom: 12, lineHeight: 1.55 }}>
                  {isEn ? "Pick the one that catches your attention." : "気になるものを1つ選んでください。"}
                </div>
                {helperNote ? (
                  <div style={{ marginBottom: 10, fontSize: 12, color: "#75675a", lineHeight: 1.7 }}>
                    {helperNote}
                  </div>
                ) : null}
                {loading ? (
                  <div aria-live="polite" style={{ padding: "6px 0" }}>
                    <div style={{ color: "#8a7d6f", fontSize: 12, padding: "8px 0" }}>
                      {isEn
                        ? (loadingTick === 0 ? "Organizing your thoughts…" : "Finding the next lens…")
                        : (loadingTick === 0 ? "思考を整理しています…" : "次の視点を見つけています…")}
                    </div>
                    <style>{`
                      @keyframes exploreDots {
                        0%, 100% { opacity: 0.25; transform: translateY(0); }
                        50% { opacity: 0.9; transform: translateY(-1px); }
                      }
                    `}</style>
                    <div style={{ display: "flex", gap: 6, padding: "6px 0 12px" }}>
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          aria-hidden="true"
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "#c1b4a5",
                            display: "inline-block",
                            animation: `exploreDots 1.1s ease-in-out ${i * 0.18}s infinite`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className={`explore-cards-appear explore-fade${transitioning ? " out" : ""} explore-enter${entering ? "" : " in"}`}
                    >
                      <div className="explore-grid">
                        {cards.map((c, i) => (
                          (() => {
                            const t = String(c?.title || "").trim();
                            const isSelected = selectedTitle && t === selectedTitle;
                            const isOther = selectedTitle && t !== selectedTitle;
                            const hideOthers = Boolean(selectedTitle);
                            const cls = [
                              "explore-card",
                              isSelected ? "explore-selected" : "",
                              isOther ? "explore-dim" : "",
                              hideOthers && isOther ? "explore-hide" : "",
                            ].filter(Boolean).join(" ");
                            return (
                          <button
                            key={i}
                            type="button"
                            className={cls}
                            style={cardStyle}
                            onClick={() => onSelect(c)}
                          >
                            <div style={{ fontSize: 14, fontWeight: 400, color: "#2a3a4f", lineHeight: 1.45 }}>
                              {c.title}
                            </div>
                            {c.subtitle ? (
                              <div style={{ marginTop: 8, fontSize: 12, color: "#75675a", lineHeight: 1.55 }}>
                                {c.subtitle}
                              </div>
                            ) : null}
                          </button>
                            );
                          })()
                        ))}
                      </div>

                      <div style={{ height: 1, background: "#e8e0d5", margin: "14px 0 12px" }} />

                      <div className="explore-grid" style={{ gridTemplateColumns: "1fr", gap: 10 }}>
                        <button
                          type="button"
                          className="explore-card explore-helper"
                          style={{ ...cardStyle, color: "#5a4b3f", boxShadow: "0 4px 12px rgba(33, 23, 11, 0.06)" }}
                          onClick={stuck}
                          disabled={loading}
                        >
                          <div style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5 }}>
                            {isEn ? "None of these fit." : "どれもしっくりこない"}
                          </div>
                          <div style={{ marginTop: 6, fontSize: 12, color: "#8a7d6f", lineHeight: 1.55 }}>
                            {isEn ? "Try a fresh angle without forcing a choice." : "無理に選ばず、角度を変えてみます。"}
                          </div>
                        </button>

                        <button
                          type="button"
                          className="explore-card explore-helper"
                          style={{ ...cardStyle, color: "#5a4b3f", boxShadow: "0 4px 12px rgba(33, 23, 11, 0.06)" }}
                          onClick={openAngle}
                          disabled={loading}
                        >
                          <div style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.5 }}>
                            {isEn ? "Try a different perspective." : "別の視点で考えたい"}
                          </div>
                          <div style={{ marginTop: 6, fontSize: 12, color: "#8a7d6f", lineHeight: 1.55 }}>
                            {isEn ? "Choose a lens (or type one) and continue." : "視点を選ぶ（または入力する）と進めます。"}
                          </div>
                        </button>
                      </div>
                    </div>

                    <div style={{ marginTop: 14, fontSize: 11, color: "#9a8f82", lineHeight: 1.65 }}>
                      {copy.exploreToChat}
                    </div>

                    <div style={{ marginTop: 14 }}>
                      <button
                        type="button"
                        onClick={summarizeFromExplore}
                        disabled={saving || loading}
                        style={{
                          padding: "9px 14px",
                          background: "#f6f0e7",
                          border: "1px solid #e0d4c5",
                          borderRadius: 12,
                          color: "#5a4b3f",
                          fontSize: 12,
                          cursor: saving || loading ? "default" : "pointer",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {saving ? copy.summarizing : copy.summarize}
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
            {err && (
              <div style={{ marginTop: 12, color: "#c17a6b", fontSize: 12, lineHeight: 1.7 }}>
                {err}
              </div>
            )}
          </div>
        </div>
        {exploreSaveNotice && (
          <div
            role="status"
            style={{
              marginTop: 14,
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
                try {
                  sessionStorage.setItem("ground_open_kakera", "1");
                } catch (_) {}
                setExploreSaveNotice(false);
                nav("/");
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
        <div ref={bottomRef} />
      </main>

      {resultOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.22)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 120,
            padding: 16,
          }}
          onClick={() => setResultOpen(false)}
        >
          <div
            style={{
              width: "min(560px, 92vw)",
              background: "#fdfbf7",
              border: "1px solid #e0d4c5",
              borderRadius: 14,
              boxShadow: "0 10px 36px rgba(0,0,0,0.14)",
              padding: 18,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
              <div style={{ fontSize: 13, letterSpacing: "0.06em", color: "#5a4b3f" }}>
                {copy.summaryTitle}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setResultModalEdit((e) => !e)}
                  style={{
                    padding: "4px 10px",
                    fontSize: 10,
                    letterSpacing: "0.06em",
                    color: "#8a7d6f",
                    background: "rgba(255,255,255,0.65)",
                    border: "1px solid #e0d4c5",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  {resultModalEdit ? (isEn ? "Done" : "完了") : (isEn ? "Edit" : "編集")}
                </button>
                <button
                  type="button"
                  onClick={() => setResultOpen(false)}
                  style={{ background: "none", border: "none", color: "#8a7d6f", fontSize: 18, cursor: "pointer", lineHeight: 1 }}
                  aria-label={isEn ? "Close" : "閉じる"}
                >
                  ×
                </button>
              </div>
            </div>

            {resultNarrative ? (
              <div style={{ color: "#75675a", fontSize: 11, lineHeight: 1.7, marginBottom: 10 }}>
                {resultNarrative}
              </div>
            ) : null}

            <div style={{ padding: 12, borderRadius: 12, background: "#f6f0e7", border: "1px solid #e8e0d5", marginBottom: 12 }}>
              {resultPoints.map((p, i) =>
                resultModalEdit ? (
                  <div key={i} style={{ marginBottom: i < 2 ? 10 : 0 }}>
                    <label style={{ fontSize: 10, color: "#8a7d6f" }}>{i + 1}</label>
                    <textarea
                      value={p}
                      onChange={(e) => {
                        const v = e.target.value;
                        setResultPoints((prev) => {
                          const n = [...prev];
                          n[i] = v;
                          return n;
                        });
                      }}
                      rows={2}
                      style={{
                        width: "100%",
                        marginTop: 4,
                        padding: "8px 10px",
                        border: "1px solid #e0d4c5",
                        borderRadius: 8,
                        fontSize: 12,
                        color: "#5a4b3f",
                        fontFamily: "inherit",
                        resize: "vertical",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                ) : (
                  <div key={i} style={{ marginBottom: i < 2 ? 8 : 0, color: "#5a4b3f", fontSize: 12, lineHeight: 1.75 }}>
                    {p || "—"}
                  </div>
                )
              )}
            </div>

            <p style={{ fontSize: 10, color: "#9a8f82", marginBottom: 12, lineHeight: 1.6 }}>
              {copy.saveHelpExplore}
            </p>
            <button
              type="button"
              onClick={saveExploreToKakera}
              style={{
                width: "100%",
                padding: "11px 14px",
                background: "#e7dbcc",
                border: "1px solid #e0d4c5",
                borderRadius: 10,
                color: "#5a4b3f",
                fontSize: 12,
                cursor: "pointer",
                letterSpacing: "0.06em",
              }}
            >
              {copy.save}
            </button>
          </div>
        </div>
      )}

      {angleOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.22)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 121,
            padding: 16,
          }}
          onClick={() => setAngleOpen(false)}
        >
          <div
            style={{
              width: "min(560px, 92vw)",
              background: "#fdfbf7",
              border: "1px solid #e0d4c5",
              borderRadius: 14,
              boxShadow: "0 10px 36px rgba(0,0,0,0.14)",
              padding: 18,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.08em", color: "#6b5d4f" }}>
                {isEn ? "PICK A LENS" : "視点を選ぶ"}
              </div>
              <button
                type="button"
                onClick={() => setAngleOpen(false)}
                style={{ background: "none", border: "none", color: "#8a7d6f", fontSize: 18, cursor: "pointer", lineHeight: 1 }}
                aria-label={isEn ? "Close" : "閉じる"}
              >
                ×
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              {(isEn
                ? ["Feelings", "Reality check", "Relationships", "From future me"]
                : ["感情から考える", "現実的に考える", "他人との関係から見る", "少し先から逆算する"]
              ).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => applyAngle(t)}
                  style={{
                    padding: "12px 12px",
                    background: "#f6f0e7",
                    border: "1px solid #e0d4c5",
                    borderRadius: 12,
                    color: "#5a4b3f",
                    cursor: "pointer",
                    fontSize: 12,
                    letterSpacing: "0.04em",
                    textAlign: "left",
                    boxShadow: "0 4px 14px rgba(33, 23, 11, 0.06)",
                    transition: "transform 0.12s ease, box-shadow 0.12s ease",
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(33, 23, 11, 0.10)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(33, 23, 11, 0.06)"; }}
                >
                  {t}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 14, fontSize: 11, color: "#8a7d6f", letterSpacing: "0.04em" }}>
              {isEn ? "Or type your own direction (1 line)." : "または、方向を1行で入力できます。"}
            </div>
            <input
              value={angleFree}
              onChange={(e) => setAngleFree(e.target.value)}
              placeholder={isEn ? "e.g. be kinder to myself" : "例：自分を責めない視点で"}
              style={{
                marginTop: 8,
                width: "100%",
                padding: "12px 12px",
                border: "1px solid #e0d4c5",
                borderRadius: 12,
                background: "#ffffff",
                fontSize: 13,
                color: "#5a4b3f",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
            <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                onClick={() => setAngleOpen(false)}
                style={{
                  padding: "10px 14px",
                  background: "transparent",
                  border: "1px solid #e0d4c5",
                  borderRadius: 12,
                  color: "#8a7d6f",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                {isEn ? "Cancel" : "やめる"}
              </button>
              <button
                type="button"
                onClick={() => angleFree.trim() && applyAngle(angleFree.trim())}
                disabled={!angleFree.trim()}
                style={{
                  padding: "10px 14px",
                  background: angleFree.trim() ? "#e7dbcc" : "#efe7dd",
                  border: "1px solid #e0d4c5",
                  borderRadius: 12,
                  color: angleFree.trim() ? "#5a4b3f" : "#a29384",
                  cursor: angleFree.trim() ? "pointer" : "default",
                  fontSize: 12,
                  letterSpacing: "0.04em",
                }}
              >
                {isEn ? "Use this" : "この方向で進む"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

