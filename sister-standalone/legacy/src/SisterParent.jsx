import { useMemo } from "react";
import { Link } from "react-router-dom";
import { getWeeklyWeaknessRanking, loadMistakeLogs } from "./lib/sisterMistakeLog";

export default function SisterParent() {
  const logs = useMemo(() => loadMistakeLogs(), []);
  const weeklyRank = useMemo(() => getWeeklyWeaknessRanking(logs), [logs]);

  const todayTheme = logs[0]?.topicName ? `数学・${logs[0].topicName}` : "数学・一次関数";
  const reviewToday = weeklyRank.slice(0, 2).map((x) => x.label);
  const reviewTomorrow = weeklyRank.slice(2, 4).map((x) => x.label);
  const canWait = ["国語：語彙", "社会：地理暗記"];

  return (
    <main className="min-h-screen bg-stone-50 text-stone-700">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <Link to="/" className="text-xs text-stone-500 no-underline">← 戻る</Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-800">SISTER Parent</h1>
          <p className="mt-1 text-sm text-stone-500">娘の学習状況を、責めずに支えるためのページ</p>
        </header>

        <section className="mt-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-800">今日の状況</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-600">
            <li>今日学習したか：はい（5分復習を実施）</li>
            <li>今日の理解テーマ：{todayTheme}</li>
            <li>今日の復習予定：一次関数 / イオン</li>
            <li>確認1問の結果：1/1 正解</li>
          </ul>
        </section>

        <section className="mt-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-800">今週の進度</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "学習日数：5日",
              "問題写真送信数：12件",
              "復習実行率：78%",
              "克服中の単元：一次関数",
              "定着しつつある単元：イオン",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-800">弱点ランキング</h2>
          <div className="mt-3 space-y-3">
            {(weeklyRank.length ? weeklyRank.slice(0, 3) : fallbackWeakness).map((row, i) => (
              <div key={row.key || `${row.label}-${i}`} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                <p className="text-sm font-semibold text-stone-800">{i + 1}. {row.label}</p>
                <p className="mt-1 text-sm text-stone-600">原因：{row.cause || "前段整理が不安定"}</p>
                <p className="mt-1 text-sm text-stone-600">対策：{row.recommendedAction}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-800">復習タイミング</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Block title="今日やると定着しやすい復習" items={reviewToday.length ? reviewToday : ["数学：一次関数"]} />
            <Block title="明日出す予定の復習" items={reviewTomorrow.length ? reviewTomorrow : ["理科：イオン"]} />
            <Block title="しばらく空けていい単元" items={canWait} />
          </div>
        </section>

        <section className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-stone-800">声かけヒント</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-600">
              <li>「今日の3分だけ見たら十分だよ」</li>
              <li>「続いてるのがいいね」</li>
              <li>「今日は何を見た？」</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
            <h2 className="text-base font-semibold text-rose-800">注意する声かけ</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-rose-700">
              <li>なんでできないの？</li>
              <li>もっとやりなさい</li>
              <li>何点だったの？</li>
              <li>ちゃんとやってるの？</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

function Block({ title, items }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
      <h3 className="text-sm font-semibold text-stone-700">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm text-stone-600">
        {items.map((item) => (
          <li key={item}>・{item}</li>
        ))}
      </ul>
    </div>
  );
}

const fallbackWeakness = [
  {
    key: "math:linear",
    label: "数学：一次関数",
    cause: "グラフから式に変える前の整理が不安定",
    recommendedAction: "傾きと切片を分ける確認",
  },
  {
    key: "science:ion",
    label: "理科：イオン",
    cause: "電子の増減イメージが弱い",
    recommendedAction: "粒子モデルの確認",
  },
  {
    key: "english:reading",
    label: "英語：長文読解",
    cause: "主語と動詞の把握が遅い",
    recommendedAction: "1文ずつ主語・動詞チェック",
  },
];
