const LANG_KEY = "ma_lang_pref"; // "ja" | "en" | null(未設定)
const TONE_KEY = "ma_tone_pref"; // "normal" | "short" | "soft"

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (_) {
    return null;
  }
}

function safeSet(key, val) {
  try {
    if (val == null) localStorage.removeItem(key);
    else localStorage.setItem(key, String(val));
  } catch (_) {}
  try {
    window.dispatchEvent(new Event("ground:prefs"));
  } catch (_) {}
}

export function getStoredLangPref() {
  const v = safeGet(LANG_KEY);
  if (v === "ja" || v === "en") return v;
  return null;
}

export function setStoredLangPref(next /* "ja" | "en" | null */) {
  if (next !== "ja" && next !== "en" && next !== null) return;
  safeSet(LANG_KEY, next);
}

export function getStoredTonePref() {
  const v = safeGet(TONE_KEY);
  if (v === "standard") return "normal"; // 旧値互換
  if (v === "normal" || v === "short" || v === "soft") return v;
  return "short";
}

export function setStoredTonePref(next /* "normal" | "short" | "soft" */) {
  if (next !== "normal" && next !== "short" && next !== "soft") return;
  safeSet(TONE_KEY, next);
}

