/** Grammatical role extraction, independent of domain names and benchmark IDs. */
const noun=(s:string|undefined)=>s?.trim().replace(/^(?:現物の|現物は|現物を|輸送先の)/,'').replace(/(?:にある|に帰属する|であること|である|であり|です|だが|だ$).*$/,'').trim();
export function ownershipRoles(text:string):{owner?:string,custodian?:string}{
 const owner=noun(text.match(/(?:法的所有者|所有者)(?:は|が)\s*([^、。]+?)(?:であること|である|であり|です|だが|だ$|$)/)?.[1]??text.match(/所有権は\s*([^、。]+?)(?:にある|に帰属する|である|だ$|$)/)?.[1]??text.match(/^([^、。]+?)(?:が|は)[^、。]*所有している/)?.[1]);
 const custodian=noun(text.match(/(?:保管しているの|現物の保管者|保管者)(?:は|が)\s*([^、。]+?)(?:である|であり|です|だ$|$)/)?.[1]??text.match(/(?:現物(?:は|を)|輸送先の)\s*([^、。]+?)(?:が|は).*保管/)?.[1]??text.match(/^([^、。]+?)(?:が|は).*保管して/)?.[1]);
 return {...(owner?{owner}:{}),...(custodian?{custodian}:{})};
}
export function quantityRole(prefix:string,suffix:string,unit:string):string {
 if(unit==='時間')return 'time_limit_hours';
 const local=prefix.split(/、|と|に対して|そのうち|一方|ただし/).at(-1)??prefix;
 if(/差(?:は|が)?\s*$/.test(local))return 'aggregate_record_discrepancy';
 const categories:[string,RegExp][]=[['available_quantity',/自由に|使用可能|利用可能|使える|供給できる|出荷できる/],['allocated_quantity',/予約|確保済み|引当|割当|割り当て/],['observed_count',/体育館|集まった|実人数|実数|確認は|確認された人数|確認人数|現場人数/],['record_count',/登校記録|登校者|出欠|入場記録|記録は|名簿/]];
 let best:{key:string,distance:number}|undefined;
 for(const [key,re]of categories){const matches=[...local.matchAll(new RegExp(re.source,'g'))];const last=matches.at(-1);const after=suffix.split(/[、。]|に対して|との差/)[0].slice(0,12).match(re);const distance=last?local.length-last.index!-last[0].length:after?after.index!+1:Infinity;if(Number.isFinite(distance)&&(!best||distance<best.distance))best={key,distance};}
 return best?.key??'total_quantity';
}
