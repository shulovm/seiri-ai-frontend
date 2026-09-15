/** A record's producer/affiliation is distinct from a direct observer. */
export function wholeRecordSource(span:string):{record:string,attributedTo?:string}|null{const m=span.match(/^([^。、「」『』\s]{1,35}?(?:システム|台帳|記録|モデル|カメラ))(?:では|には|によると|は|に|で)/);if(!m)return null;const affiliated=m[1].match(/^(.{1,25}?)の(?:.{0,10})?(?:記録|台帳)/)?.[1];return{record:m[1],...(affiliated?{attributedTo:affiliated}:{})};}
export function wholeQuantityHolder(span:string):string|undefined{const m=span.match(/^([^。、「」『』\sのに]{1,25})(?:の|に)[^。、「」『』]{0,25}(?:人数|在籍|登校|数|数量|在庫|残高)/);return m?.[1];}
