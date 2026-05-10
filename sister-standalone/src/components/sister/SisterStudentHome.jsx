"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function subjectLabelJa(subject) {
  if (subject === "math") return "数学";
  if (subject === "science") return "理科";
  if (subject === "english") return "英語";
  if (subject === "social") return "社会";
  return "国語";
}

export default function SisterStudentHome({ studentLineUserId }) {
  const [loading, setLoading] = useState(true);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!studentLineUserId) {
        setLatest(null);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `/api/sister/student/latest?studentId=${encodeURIComponent(studentLineUserId)}`,
          { cache: "no-store" },
        );
        const data = await res.json().catch(() => ({}));
        if (!cancelled && data?.ok && data?.hasData && data?.latest) {
          setLatest(data.latest);
        } else if (!cancelled) {
          setLatest(null);
        }
      } catch {
        if (!cancelled) setLatest(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [studentLineUserId]);

  const understandingHref =
    latest && studentLineUserId
      ? `/sister/understanding?themeId=${encodeURIComponent(latest.id)}&studentId=${encodeURIComponent(studentLineUserId)}`
      : null;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-700">
      <div className="mx-auto w-full max-w-lg px-4 py-8 sm:px-6">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800">SISTER</h1>
          <p className="mt-1 text-sm text-slate-500">あなたの復習メモ</p>
        </header>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800">いまの記録</h2>

          {loading ? (
            <p className="mt-4 text-sm text-slate-500">読み込み中…</p>
          ) : !latest ? (
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
              <p>まだ復習データはありません。</p>
              <p>LINEに勉強写真を送ると、ここに少しずつ表示されます。</p>
            </div>
          ) : (
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs font-medium text-slate-500">科目</dt>
                <dd className="mt-0.5 text-slate-800">{subjectLabelJa(latest.subject)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">テーマ</dt>
                <dd className="mt-0.5 text-slate-800">{latest.topicName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">つまずき</dt>
                <dd className="mt-0.5 leading-relaxed text-slate-800">{latest.mistakeHint}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">自信度</dt>
                <dd className="mt-0.5 text-slate-800">
                  {typeof latest.confidenceScore === "number" ? latest.confidenceScore.toFixed(2) : "—"}
                </dd>
              </div>
              {understandingHref ? (
                <div className="pt-2">
                  <Link
                    href={understandingHref}
                    className="inline-flex rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-white no-underline"
                  >
                    理解ページを開く
                  </Link>
                </div>
              ) : null}
            </dl>
          )}
        </section>
      </div>
    </main>
  );
}
