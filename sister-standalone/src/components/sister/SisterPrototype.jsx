import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const understandingCards = [
  {
    title: "イメージでわかる",
    icon: "👀",
    body: "y軸との交点がスタート地点。右に1進んだ時の変化が傾き。",
  },
  {
    title: "かんたんに言うと",
    icon: "💬",
    body: "一次関数は「最初の数」と「増え方」を見る問題。",
  },
  {
    title: "公式で見る",
    icon: "📘",
    body: "y = ax + b\n a = 増え方\n b = スタート地点",
  },
  {
    title: "問題ではこう出る",
    icon: "📝",
    body: "福岡県公立入試では、表・グラフ・文章からaとbを探す形で出やすい。",
  },
];

const faqItems = [
  {
    q: "傾きが分数の時は？",
    a: "右に何個進んで、上に何個動くかで見る。",
  },
  {
    q: "グラフがマイナスから始まる時は？",
    a: "スタート地点がマイナスなだけ。考え方は同じ。",
  },
  {
    q: "文章問題の時は？",
    a: "最初にある数と、1つ増えるごとに変わる数を探す。",
  },
];

const recentLogs = [
  "数学：一次関数 / 昨日",
  "理科：イオン / 2日前",
  "英語：長文読解 / 3日前",
];

const reviewTimingItems = {
  today: ["一次関数（忘れかけタイミング）", "イオン（3日前の復習）"],
  tomorrow: ["英語：長文読解（設問先読みの再確認）"],
  later: ["英単語（7日後に再チェック）"],
};

const quizChoices = [
  { id: "A", label: "A. y = 2x + 3" },
  { id: "B", label: "B. y = 3x + 2" },
  { id: "C", label: "C. y = x + 5" },
];
const correctChoiceId = "B";

export default function SisterPrototype() {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [openedFaq, setOpenedFaq] = useState(faqItems[0].q);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-700">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-800">SISTER</h1>
              <p className="mt-1 text-sm text-slate-500">間違いから理解を育てる学習サイト</p>
            </div>
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700">
              LINE連携済み
            </span>
          </div>
        </header>

        <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">今日の理解テーマ</h2>
          <p className="mt-2 text-lg font-medium text-slate-700">一次関数：グラフから式を作る考え方</p>
          <p className="mt-2 text-base leading-7 text-slate-600">
            「傾き」と「切片」を同時に見ようとして混乱しやすい傾向があります。今日は、この2つを分けて見る練習だけでOKです。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700">3分で理解する</button>
            <button className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">確認1問へ</button>
          </div>
        </section>

        <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">私のつまずき</h2>
          <p className="mt-2 text-base leading-7 text-slate-600">
            最近のミスを見ると、計算力よりも「グラフを式に変える前の整理」で止まりやすい可能性があります。
          </p>
        </section>

        <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">多方向から理解する</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {understandingCards.map((card) => (
              <article key={card.title} className="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-cyan-200 hover:bg-cyan-50/40">
                <h3 className="text-base font-semibold text-slate-800">{card.icon} {card.title}</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">こういう時は？</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {faqItems.map((item) => (
              <button
                key={item.q}
                type="button"
                onClick={() => setOpenedFaq(item.q)}
                className={`rounded-xl border px-3 py-3 text-left text-sm ${
                  openedFaq === item.q
                    ? "border-cyan-200 bg-cyan-50 text-cyan-800"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                {item.q}
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">ポイント</p>
            <p className="mt-1 text-sm leading-7 text-slate-600">
              {faqItems.find((x) => x.q === openedFaq)?.a}
            </p>
          </div>
        </section>

        <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">質問する</h2>
          <textarea
            className="mt-3 w-full rounded-2xl border border-slate-300 bg-slate-50 p-3 text-sm outline-none focus:border-cyan-300"
            rows={2}
            placeholder="なんで？ / こういう時は？ / 別の見方ある？"
          />
          <p className="mt-2 text-xs text-slate-500">理解を深める質問だけでOK。返答は短く、最大3文です。</p>
          <button className="mt-3 rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-sm">質問を送る</button>
        </section>

        <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">今日の1問クイズ</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            グラフが y軸と 2 で交わり、xが1増えるとyが3増える時、式はどうなる？
          </p>
          <div className="mt-3 space-y-2">
            {quizChoices.map((choice) => {
              const isSelected = selectedAnswer === choice.id;
              const isCorrect = choice.id === correctChoiceId;
              const isWrongSelection = isSelected && showResult && !isCorrect;
              const isCorrectSelection = isSelected && showResult && isCorrect;

              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => {
                    setSelectedAnswer(choice.id);
                    setShowResult(true);
                  }}
                  className={`relative flex w-full items-center gap-2 rounded-xl border p-3 text-left text-sm transition ${
                    isSelected
                      ? "border-cyan-300 bg-cyan-50/50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <span className="text-slate-700">{choice.label}</span>
                  <AnimatePresence mode="wait">
                    {isSelected && showResult && (
                      <motion.span
                        key={`${choice.id}-${isCorrect ? "ok" : "ng"}`}
                        initial={isCorrect ? { opacity: 0, y: -18, scale: 0.72 } : { opacity: 0, y: -6, scale: 0.78 }}
                        animate={
                          isCorrect
                            ? { opacity: [0, 1, 1], y: [-18, -8, -6], scale: [0.72, 1.18, 1.05] }
                            : { opacity: [0, 1, 1], y: [-6, -8, -6], scale: [0.78, 1.12, 1], x: [0, -3, 3, -2, 0] }
                        }
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className={`pointer-events-none absolute left-1/2 top-1 -translate-x-1/2 text-3xl ${
                          isCorrect ? "text-cyan-500/85" : "text-rose-400/80"
                        }`}
                      >
                        {isCorrect ? "⭕️" : "❌"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isWrongSelection && (
                    <motion.div
                      initial={{ x: 0 }}
                      animate={{ x: [0, -2, 2, -1, 0] }}
                      transition={{ duration: 0.35 }}
                      className="absolute inset-0 rounded-xl border border-rose-200/70"
                    />
                  )}
                  {isCorrectSelection && (
                    <motion.div
                      initial={{ opacity: 0.4 }}
                      animate={{ opacity: [0.4, 0.85, 0.55] }}
                      transition={{ duration: 0.55 }}
                      className="absolute inset-0 rounded-xl border border-cyan-200/80"
                    />
                  )}
                </button>
              );
            })}
          </div>
          {showResult && (
            selectedAnswer === correctChoiceId ? (
              <p className="mt-2 rounded-xl bg-cyan-50 px-3 py-2 text-sm leading-7 text-cyan-800">
                いい感じ。
                今日は見方がつかめてる。
              </p>
            ) : (
              <div className="mt-2 rounded-xl bg-amber-50 px-3 py-3 text-sm leading-7 text-amber-800">
                <p>惜しい。</p>
                <p>今回は「スタート地点」に気づけるとOKだった。</p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-amber-300 bg-white px-3 py-1 text-xs"
                    onClick={() => {
                      setSelectedAnswer("");
                      setShowResult(false);
                    }}
                  >
                    もう一回
                  </button>
                  <button type="button" className="rounded-lg border border-amber-300 bg-white px-3 py-1 text-xs">
                    ヒントを見る
                  </button>
                </div>
              </div>
            )
          )}
        </section>

        <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">復習タイミング</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <TimingBlock title="今日やると定着しやすい復習" items={reviewTimingItems.today} />
            <TimingBlock title="明日出す予定の復習" items={reviewTimingItems.tomorrow} />
            <TimingBlock title="しばらく空けていい単元" items={reviewTimingItems.later} />
          </div>
        </section>

        <section className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">最近送った問題</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {recentLogs.map((item) => (
                <li key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">今週の成長</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>学習継続：5日</li>
              <li>克服単元：3</li>
              <li>送信した問題：12件</li>
              <li>苦手改善中：一次関数</li>
            </ul>
          </div>
        </section>

      </div>
    </main>
  );
}

function TimingBlock({ title, items }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm text-slate-600">
        {items.map((item) => (
          <li key={item}>・{item}</li>
        ))}
      </ul>
    </div>
  );
}
