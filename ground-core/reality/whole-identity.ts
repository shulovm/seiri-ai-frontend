/** Explicit whole-document names/abbreviations. Never resolve competing aliases by guess. */
export interface WholeIdentityRegistry{names:string[];aliases:Map<string,string[]>;}
export function wholeIdentityRegistry(principals:string[],body:string[]):WholeIdentityRegistry{const names=[...new Set(principals.map(s=>s.trim()).filter(Boolean))];const aliases=new Map<string,string[]>();const add=(alias:string,name:string)=>{const rows=aliases.get(alias)??[];if(!rows.includes(name))rows.push(name);aliases.set(alias,rows);};
for(const raw of [...principals,...body]){const m=raw.match(/^([^。\n（(]{1,45})[（(](?:以下[、,]\s*|略称[：:]\s*)([^）)\n]{1,25})[）)]/);if(m){const name=m[1].trim(),alias=m[2].trim();const old=names.indexOf(raw.trim());if(old>=0)names.splice(old,1);if(!names.includes(name))names.push(name);add(alias,name);}}
for(const name of names){add(name,name);const m=name.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]([A-Z]\d*)$/u);if(m)add(m[1],name);}
for(const text of body)for(const m of text.matchAll(/([^。、「」『』\sはがをに]{1,25}[A-Z]\d*)(?=の|は|が|を|に|と|から|[、。])/g)){const short=m[1];const matches=names.filter(n=>n.endsWith(short));if(matches.length===1)add(short,matches[0]);}
return{names,aliases};}
export function resolveWholeName(registry:WholeIdentityRegistry,label:string):{status:'resolved'|'ambiguous'|'unregistered',label:string}{const rows=registry.aliases.get(label);return rows?.length===1?{status:'resolved',label:rows[0]}:rows?.length?{status:'ambiguous',label}:{status:'unregistered',label};}
