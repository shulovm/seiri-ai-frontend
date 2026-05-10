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

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export default function SisterStudentHome({ studentLineUserId }) {
  const [loading, setLoading] = useState(true);
  const [latest, setLatest] = useState(null);
  const [ledger, setLedger] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!studentLineUserId) {
        setLatest(null);
        setLedger([]);
        setLoading(false);
        return;
      }
      try {
        const [resLatest, resLogs] = await Promise.all([
          fetch(`/api/sister/student/latest?studentId=${encodeURIComponent(studentLineUserId)}`, {
            cache: "no-store",
          }),
          fetch(`/api/sister/student/mistake-ledger?studentId=${encodeURIComponent(studentLineUserId)}`, {
            cache: "no-store",
          }),
        ]);
        const dataLatest = await resLatest.json().catch(() => ({}));
        const dataLogs = await resLogs.json().catch(() => ({}));
        if (!cancelled && dataLatest?.ok && dataLatest?.hasData && dataLatest?.latest) {
          setLatest(dataLatest.latest);
        } else if (!cancelled) {
          setLatest(null);
        }
        if (!cancelled && dataLogs?.ok && Array.isArray(dataLogs.items)) {
          setLedger(dataLogs.items);
        } else if (!cancelled) {
          setLedger([]);
        }
      } catch {
        if (!cancelled) {
          setLatest(null);
          setLedger([]);
        }
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

  const emptyCopy = (
    <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
      <p>まだ記録はありません。</p>
      <p>LINEに勉強写真を送ると、ここに少しずつ残ります。</p>
    </div>
  );

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
            emptyCopy
          ) : (
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs font-medium text-slate-500">科目</dt>
                <dd className="mt-0.5 text-slate-800">{subjectLabelJa(latest.subject)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">単元</dt>
                <dd className="mt-0.5 text-slate-800">{latest.unit || latest.topicName || "—"}</dd>
              </div>
              {latest.topic ? (
                <div>
                  <dt className="text-xs font-medium text-slate-500">テーマ</dt>
                  <dd className="mt-0.5 text-slate-800">{latest.topic}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-xs font-medium text-slate-500">間違えたポイント</dt>
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

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800">これまでの間違いログ</h2>
          {loading ? (
            <p className="mt-4 text-sm text-slate-500">読み込み中…</p>
          ) : ledger.length === 0 ? (
            emptyCopy
          ) : (
            <ul className="mt-4 space-y-3">
              {ledger.map((row) => (
                <li
                  key={row.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm"
                >
                  <p className="text-xs text-slate-500">{formatDate(row.createdAt)}</p>
                  <p className="mt-1 font-medium text-slate-800">
                    {subjectLabelJa(row.subject)}
                    {row.unit ? ` ・ ${row.unit}` : ""}
                    {row.topic ? ` ・ ${row.topic}` : ""}
                  </p>
                  <p className="mt-1 leading-relaxed text-slate-700">{row.mistakeHint}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
