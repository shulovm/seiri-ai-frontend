/** Ingestion-only qualification. These are not canonical primitives. */
export type DecisionLifecycle = 'considered'|'candidate'|'preferred'|'intended'|'planned'|'selected'|'instructed'|'executing'|'completed';
export function interpretDecisionLifecycle(text:string): DecisionLifecycle|null {
 const choice=/案|選択|採用|判断|待つか.*か/.test(text);
 if(!choice)return null;
 // Scope denials and unresolved selection before affirmative commitment.
 if(/未(?:決定|選択|確定)|決まっていない|選んでいない|選択(?:して|されて)いない|最終判断には至っていない|確定を待つ|決めた(?:わけ|事実|という報告).*(?:ない|なく)|決定.*(?:していない|されていない)/.test(text))return 'considered';
 if(/実行.*(?:完了|終了)|実施.*完了/.test(text)&&!/(?:完了|終了).*(?:未確認|していない|していない)/.test(text))return 'completed';
 if(/実行.*(?:開始|している)|実施.*(?:開始|している)/.test(text)&&!/(?:実行|実施).*していない/.test(text))return 'executing';
 if(/指示(?:を送った|した)|命令(?:を送った|した)/.test(text))return 'instructed';
 if(/(?:決める|決定する).*予定|決める予定|調整している/.test(text))return 'planned';
 if(/有力|推している|推す|推薦/.test(text))return 'preferred';
 if(/決めた|決定した|正式決定|正式に選んだ|正式に選択|正式に決めた/.test(text))return 'selected';
 if(/検討|比較|検討中/.test(text))return 'considered';
 if(/候補/.test(text))return 'candidate';
 if(/したい|するつもり|しようと思う/.test(text))return 'intended';
 return null;
}
