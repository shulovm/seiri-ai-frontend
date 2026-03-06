/**
 * 課金プラン定義（Stripe 連携用の priceId は後で設定）
 *
 * フリー：無料・1日5回まで・記憶なし・カスタムなし・ブックマークなし
 * ライト：680円/月・1日20回・簡単な記憶・カスタムなし・ブックマークなし
 * スタンダード：1,480円/月・無制限・深い記憶・ユーモア3段階選択・ブックマーク無制限
 * プレミアム：2,980円/月・無制限・完全記憶＋感情理解・ユーモア・共感度・返答スタイルを調整・ブックマーク無制限
 *
 * ブックマーク機能：基本保存なし、気に入った言葉だけ⭐でブックマーク。サイドバーに一覧表示。スタンダード以上のみ使用可能。
 */
export const PLAN_IDS = {
  FREE: "free",
  LIGHT: "light",
  STANDARD: "standard",
  PREMIUM: "premium",
};

export const PLANS = [
  {
    id: PLAN_IDS.FREE,
    name: "フリー",
    nameEn: "Free",
    priceYen: 0,
    priceDisplay: "無料",
    period: null,
    dailyLimit: 5,
    dailyLimitDisplay: "1日5回まで",
    memory: "なし",
    memoryDetail: "記憶なし",
    bookmark: false,
    features: ["1日5回まで"],
    stripePriceId: null,
  },
  {
    id: PLAN_IDS.LIGHT,
    name: "ライト",
    nameEn: "Light",
    priceYen: 680,
    priceDisplay: "680円",
    period: "月",
    dailyLimit: 20,
    dailyLimitDisplay: "1日20回",
    memory: "簡単",
    memoryDetail: "簡単な記憶",
    bookmark: false,
    features: ["1日20回", "簡単な記憶"],
    stripePriceId: null,
  },
  {
    id: PLAN_IDS.STANDARD,
    name: "スタンダード",
    nameEn: "Standard",
    priceYen: 1480,
    priceDisplay: "1,480円",
    period: "月",
    dailyLimit: null,
    dailyLimitDisplay: "無制限",
    memory: "深い",
    memoryDetail: "深い記憶",
    bookmark: true,
    features: ["無制限", "深い記憶", "ユーモア3段階選択", "ブックマーク無制限"],
    stripePriceId: null,
  },
  {
    id: PLAN_IDS.PREMIUM,
    name: "プレミアム",
    nameEn: "Premium",
    priceYen: 2980,
    priceDisplay: "2,980円",
    period: "月",
    dailyLimit: null,
    dailyLimitDisplay: "無制限",
    memory: "完全",
    memoryDetail: "完全記憶＋感情理解",
    bookmark: true,
    features: ["無制限", "完全記憶＋感情理解", "ユーモア・共感度・返答スタイルを調整", "ブックマーク無制限"],
    stripePriceId: null,
  },
];

export function getPlanById(id) {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

/** ブックマーク利用可能なプランか（スタンダード以上） */
export function canUseBookmark(planId) {
  const plan = getPlanById(planId);
  return plan.bookmark === true;
}
