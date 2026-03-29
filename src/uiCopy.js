/**
 * GROUND 主要文言（JA/EN）— トーン・役割を揃える
 */
export function getUiCopy(isEn) {
  return {
    /** ナビ：チャット → 探索へ */
    navExplore: isEn ? "Explore" : "探索する",
    /** ナビ：探索 → チャットへ */
    navChat: isEn ? "Chat" : "チャットで話す",
    /** 要約アクション */
    summarize: isEn ? "Summarize" : "要約する",
    summarizing: isEn ? "Summarizing…" : "要約中…",
    /** 保存アクション */
    save: isEn ? "Save" : "保存する",
    /** かけら（一覧・メニュー名） */
    kakera: isEn ? "Kakera" : "かけら",
    /** 要約モーダル見出し */
    summaryTitle: isEn ? "Summary" : "要約",
    /** かけら内の出所ラベル */
    sourceExplore: isEn ? "Explore" : "探索",
    sourceChat: isEn ? "Chat" : "チャット",
    /** かけらが空のとき */
    kakeraEmptyLine1: isEn ? "Nothing here yet." : "まだかけらはありません。",
    kakeraEmptyLine2: isEn
      ? "Summarize → Save to add to Kakera."
      : "「要約する」→「保存する」で残せます。",
    /** 保存前の説明（チャット） */
    saveHelpChat: isEn
      ? "Saves this summary and your chat to Kakera on this device."
      : "「保存する」で、この要約と会話の元テキストをかけらに残します（この端末）。",
    /** 保存前の説明（探索） */
    saveHelpExplore: isEn
      ? "Saves the 3 lines and your theme / choices to Kakera on this device."
      : "「保存する」で、3行の要約とテーマ・選んだ流れをかけらに残します（この端末）。",
    /** 保存直後（短いフィードバック） */
    savedShort: isEn ? "Saved" : "保存しました",
    /** 保存後：どこに行ったか・見返し */
    savedBanner: isEn
      ? "Saved to Kakera on this device. Open the menu anytime to revisit."
      : "かけらに保存しました。この端末のメニュー「かけら」からいつでも見返せます。",
    openKakera: isEn ? "Open Kakera" : "かけらを開く",
    /** 探索中のチャット誘導 */
    exploreToChat: isEn
      ? "If it’s hard to choose, you can switch to chat anytime."
      : "選びにくいときは、いつでも「チャットで話す」から話して大丈夫です。",
    /** テーマ入力の primary（探索開始） */
    startExplore: isEn ? "Explore" : "探索する",
    /** 入力エリアのリード文（チャット・探索で共通トーン） */
    inputLead: isEn ? "It doesn't have to hang together." : "まとまってなくていい。",
    /** 入力欄プレースホルダ */
    placeholderSoft: isEn ? "Try writing freely." : "そのまま書いてみてください",
    examplePrefix: isEn ? "Try: " : "例：",
  };
}
