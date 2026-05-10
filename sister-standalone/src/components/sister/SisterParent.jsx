"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function subjectLabelJa(subject) {
  if (subject === "math") return "数学";
  if (subject === "science") return "理科";
  if (subject === "english") return "英語";
  if (subject === "social") return "社会";
  return "国語";
}

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

function groupBySubjectUnit(items) {
  const map = new Map();
  for (const row of items) {
    const subj = row.subject || "math";
    const unit = (row.unit || "").trim() || "（単元未分類）";
    const key = `${subj}\0${unit}`;
    if (!map.has(key)) {
      map.set(key, { subject: subj, unit, rows: [] });
    }
    map.get(key).rows.push(row);
  }
  const groups = [...map.values()].map((g) => {
    g.rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return g;
  });
  groups.sort((a, b) => {
    const ta = new Date(a.rows[0]?.createdAt || 0).getTime();
    const tb = new Date(b.rows[0]?.createdAt || 0).getTime();
    return tb - ta;
  });
  return groups;
}

export default function SisterParent({ studentLineUserId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!studentLineUserId) {
        setItems([]);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `/api/sister/student/mistake-ledger?studentId=${encodeURIComponent(studentLineUserId)}`,
          { cache: "no-store" },
        );
        const data = await res.json().catch(() => ({}));
        if (!cancelled && data?.ok && Array.isArray(data.items)) {
          setItems(data.items);
        } else if (!cancelled) {
          setItems([]);
        }
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [studentLineUserId]);

  const groups = useMemo(() => groupBySubjectUnit(items), [items]);

  const emptyCopy = (
    <div className="mt-4 space-y-3 text-sm leading-relaxed text-stone-600">
      <p>まだ記録はありません。</p>
      <p>LINEに勉強写真を送ると、ここに少しずつ残ります。</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-stone-50 text-stone-700">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <button
            type="button"
            onClick={() => router.back()}
            className="block cursor-pointer border-0 bg-transparent p-0 text-left text-xs text-stone-500 underline-offset-2 hover:underline"
          >
            ← 前の画面へ
          </button>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-800">SISTER 保護者向け</h1>
          <p className="mt-1 text-sm text-stone-500">間違いの記録（写真は保存されません）</p>
        </header>

        <section className="mt-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-800">間違いログ台帳</h2>
          <p className="mt-1 text-xs text-stone-500">科目・単元ごとにまとめています。</p>

          {loading ? (
            <p className="mt-4 text-sm text-stone-500">読み込み中…</p>
          ) : groups.length === 0 ? (
            emptyCopy
          ) : (
            <div className="mt-4 space-y-6">
              {groups.map((g) => (
                <div key={`${g.subject}-${g.unit}`} className="rounded-xl border border-stone-200 bg-stone-50/80 p-4">
                  <h3 className="text-sm font-semibold text-stone-800">
                    {subjectLabelJa(g.subject)} ／ {g.unit}
                  </h3>
                  <ul className="mt-3 space-y-3">
                    {g.rows.map((row) => (
                      <li
                        key={row.id}
                        className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700"
                      >
                        <p className="text-xs text-stone-500">{formatDate(row.createdAt)}</p>
                        {row.topic ? <p className="mt-0.5 text-xs text-stone-600">テーマ: {row.topic}</p> : null}
                        <p className="mt-1 leading-relaxed">{row.mistakeHint}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-stone-800">声かけのヒント</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-600">
            <li>短い時間でも続いていれば十分です。</li>
            <li>「どこが分からない？」より「今日は何を見た？」と聞くと話しやすくなります。</li>
            <li>結果より、本人のペースを尊重する言葉を心がけましょう。</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
