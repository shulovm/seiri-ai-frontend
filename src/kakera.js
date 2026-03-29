/** かけら：chat / 探索で一元保存 */
export const KAKERA_STORAGE_KEY = "ma_kakera";

export function loadKakera() {
  try {
    const raw = typeof localStorage !== "undefined" && localStorage.getItem(KAKERA_STORAGE_KEY);
    if (!raw) return [];
    const p = JSON.parse(raw);
    return Array.isArray(p) ? p : [];
  } catch (_) {
    return [];
  }
}

export function pushKakera(entry) {
  const list = loadKakera();
  list.unshift({
    id: entry.id || Date.now().toString(36) + Math.random().toString(36).slice(2),
    createdAt: entry.createdAt || new Date().toISOString(),
    source: entry.source === "explore" ? "explore" : "chat",
    points: Array.isArray(entry.points) ? entry.points.slice(0, 3) : ["", "", ""],
    originalInput: String(entry.originalInput || "").slice(0, 50000),
  });
  try {
    localStorage.setItem(KAKERA_STORAGE_KEY, JSON.stringify(list));
  } catch (_) {}
  try {
    window.dispatchEvent(new Event("ground:kakera"));
  } catch (_) {}
}
