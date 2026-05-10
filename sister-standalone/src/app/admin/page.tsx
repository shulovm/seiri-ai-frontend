import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="min-h-screen bg-stone-50 px-6 py-10 text-stone-800">
      <main className="mx-auto max-w-3xl rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">SISTER 管理</h1>
            <p className="mt-2 text-sm text-stone-600">
              関係者向けメニューです。student / parent の公開サイトはホスト名で分離できます。
            </p>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-700"
            >
              ログアウト
            </button>
          </form>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm" href="/sister">
            生徒ページ（学習ログ）
          </Link>
          <Link className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm" href="/sister/prototype">
            UIプロトタイプ
          </Link>
          <Link className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm" href="/sister/understanding">
            理解ページ
          </Link>
          <Link className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm" href="/sister/parent">
            保護者ページ
          </Link>
        </div>
      </main>
    </div>
  );
}
