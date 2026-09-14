/** Grammatical clause boundaries only. A nested quotation stays one attributed act. */
export function semanticClauses(sentence:string):{span:string,sourceSentence:string}[]{
 let depth=0,start=0;const result:{span:string,sourceSentence:string}[]=[];
 for(let i=0;i<sentence.length;i++){
  const ch=sentence[i];if(ch==='「'||ch==='『')depth++;if(ch==='」'||ch==='』')depth=Math.max(0,depth-1);if(depth)continue;
  const tail=sentence.slice(i);const conjunct=/^(?:が、|が,)/.test(tail)&&/(?:した|された|いる|ある|ない)$/.test(sentence.slice(start,i))?tail.slice(0,2):undefined;const connective=conjunct??tail.match(/^(?:そのうち|一方|ただし|しかし|だが|あるが|に対して|であり、|であり,)/)?.[0];
  const comma=/[、,；;]/.test(ch)&&/(?:した|された|いる|ある|ない|\d+(?:人|個|点|台|時)で?)$/.test(sentence.slice(start,i));
  if(connective&&i>start||comma){const end=connective?i:i+1;const part=sentence.slice(start,end).trim();if(part)result.push({span:part,sourceSentence:sentence});start=connective?i+connective.length:i+1;if(connective)i+=connective.length-1;}
 }
 const last=sentence.slice(start).trim();if(last)result.push({span:last,sourceSentence:sentence});return result.length?result:[{span:sentence,sourceSentence:sentence}];
}
