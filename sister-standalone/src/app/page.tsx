import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 px-6 py-10 text-stone-800">
      <main className="mx-auto max-w-3xl rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">SISTER Admin</h1>
        <p className="mt-2 text-sm text-stone-600">
          管理者専用ページです。student / parent サイトはホスト名で分離されています。
        </p>

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
