export const INPUT_SUGGESTIONS = {
  en: [
    "Why do I keep thinking but not acting?",
    "My thoughts feel messy — where do I start?",
    "What’s the real problem behind this?",
    "Am I overthinking or avoiding something?",
    "I have ideas, but nothing moves forward",
  ],
  ja: [
    "なんで考えてるのに行動できないんだろう",
    "頭の中がぐちゃぐちゃで、どこから整理すればいいか分からない",
    "この問題の本当の原因って何なんだろう",
    "考えすぎなのか、何かから逃げてるだけなのか分からない",
    "アイデアはあるのに、全然前に進んでない",
  ],
};

export function formatTryLabel(lang, text) {
  return (lang === "en" ? "Try: " : "例：") + text;
}

export function pickSuggestion(lang = "ja", strategy = "random", index = 0) {
  const list = INPUT_SUGGESTIONS[lang === "en" ? "en" : "ja"] || INPUT_SUGGESTIONS.ja;
  if (list.length === 0) return "";
  if (strategy === "sequential") return list[Math.abs(index) % list.length];
  const i = Math.floor(Math.random() * list.length);
  return list[i];
}

