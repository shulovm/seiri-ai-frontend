/** Intake qualification only; uncertainty is a positive record of unknown scope, never false. */
export function unassertedOccurrenceReason(text:string):string|null {
 if(/(?:いつ|どこで|誰が|どの時点|かどうか|したか|始まったか|停止したか|届いたか).*(?:不明|分から|知らない|未確認|記録がない|記録はない|記録が残っていない|確認でき|報告がない)/.test(text))return 'Occurrence/time is referenced in an unresolved question, not asserted.';
 if(/(?:した|された|始まった|止まった|届いた)(?:という|との)?(?:記録|報告|証拠)(?:が|は)(?:ない|残っていない|未確認)/.test(text))return 'Absence of a record/report is not an occurrence.';
 if(/(?:した|された|始まった|止まった|届いた|到着した|着金した)(?:こと|という事実|という報告|との報告|という記録|との記録|か)(?:は|が)?.*(?:未確認|確認されていない|確認していない|記録がない|記録はない|報告はない|報告がない|観測されていない|分からない)/.test(text))return 'The referenced occurrence is unverified/unobserved/unrecorded.';
 if(/(?:開始|停止|実行|完了|到着|受領|着金|採用|決定)(?:した|された|している|すること)?(?:という|した)?(?:わけではない|事実はない|とは限らない|とは言えない)/.test(text))return 'The occurrence predicate is explicitly denied or withheld.';
 if(/(?:もし|仮に|した場合|するとすれば|したなら)/.test(text))return 'Conditional occurrence is not an actual occurrence.';
 return null;
}
