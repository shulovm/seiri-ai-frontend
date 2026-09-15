import {stripDeclaredTimePrefix} from './semantic-times.js';
/** Explicit grammatical source chains. Claimed observers never become direct observations. */
export function statedSourceRoles(text:string):{reporter?:string,reportedObserver?:string,intermediaries:string[],organization?:string,socialRecord?:boolean}{
 const normalized=stripDeclaredTimePrefix(text).trim();
 const leading=normalized.match(/^([^「『」、。]{1,40}?)(?:が|は)/)?.[1];
 const organization=normalized.match(/^([^「『」、。]{1,40}?)(?:の公式発表|の発表|の声明|の説明)(?:では|によると|は)/)?.[1];
 const attributed=/[「『]|報告した|伝えた|聞いた|発表|声明|SNS|投稿/.test(normalized);
 const direct=[...normalized.matchAll(/([^「『」、。]{1,35}?)(?:が|は)[^「『」、。]*?(?:直接見た|目撃した|直接確認した|確認した)/g)].at(-1)?.[1];
 const nested=[...normalized.matchAll(/([^「『」、。]{1,35}?)(?:が|は)[「『]/g)].map(x=>x[1]);
 const from=normalized.match(/(?:が|は)([^「『」、。]{1,30}?)から/)?.[1];
 const witness=normalized.match(/から([^「『」、。]{1,30}?)の目撃/)?.[1];
 return {reporter:attributed?(from??organization??leading):undefined,reportedObserver:attributed?(witness??direct):undefined,intermediaries:from&&leading?[leading]:nested.slice(1),organization,socialRecord:/SNS|ソーシャルメディア|投稿/.test(normalized)};
}
