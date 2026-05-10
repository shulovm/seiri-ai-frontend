import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 px-6 py-12 text-stone-800">
      <main className="mx-auto max-w-lg text-center">
        <p className="text-sm font-medium text-stone-500">SISTER</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">学習サポート</h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          LINE で送った問題の「理解ページ」から確認できます。
        </p>
        <div className="mt-8">
          <Link
            href="/sister/understanding"
            className="inline-flex rounded-xl bg-stone-800 px-6 py-3 text-sm font-medium text-white no-underline"
          >
            理解ページを開く
          </Link>
        </div>
        <p className="mt-10 text-xs text-stone-400">この画面は関係者向けの入口ではありません。</p>
      </main>
    </div>
  );
}
