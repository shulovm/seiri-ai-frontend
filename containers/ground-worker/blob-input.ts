import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { config, verify } from './verify.js';

const manifest = readFileSync(new URL('./corpus-pins.json', import.meta.url));
export const release = createHash('sha256').update(manifest).digest('hex');
const pins = JSON.parse(manifest.toString()) as {path:string,sha256:string}[];
export const blobBase = 'https://orimusugroundstg01.blob.core.windows.net/ground-evidence-staging';
export const identityResourceId = '/subscriptions/a0d869a1-8cdc-4b87-891c-9d92dd52320d/resourceGroups/rg-orimusu-ground-staging/providers/Microsoft.ManagedIdentity/userAssignedIdentities/id-ground-worker-staging';
export const prefix = `historical-round6-staging/sha256-${release}`;
const hash = (b:Buffer) => createHash('sha256').update(b).digest('hex');
export type Fetch = typeof fetch;

export function sourceConfig(env:NodeJS.ProcessEnv) {
  const source=env.GROUND_WORKER_INPUT_SOURCE ?? 'embedded';
  if(source!=='embedded' && source!=='azure-blob')throw new Error('INPUT_SOURCE_INVALID');
  if(source==='azure-blob' && (env.GROUND_WORKER_IDENTITY_RESOURCE_ID !== identityResourceId || !env.IDENTITY_ENDPOINT || !env.IDENTITY_HEADER)) throw new Error('MANAGED_IDENTITY_REQUIRED');
  return source;
}

async function bytes(response:Response, limit:number):Promise<Buffer> {
  if(response.status!==200 || response.redirected || !response.body)throw new Error('BLOB_READ_FAILED');
  const declared=response.headers.get('content-length');
  if(declared!==null && (!/^\d+$/.test(declared) || Number(declared)>limit))throw new Error('INPUT_TOO_LARGE');
  const reader=response.body.getReader();const parts:Buffer[]=[];let total=0;
  try {while(true){const item=await reader.read();if(item.done)break;total+=item.value.length;if(total>limit)throw new Error('INPUT_TOO_LARGE');parts.push(Buffer.from(item.value));}}
  finally {await reader.cancel();}
  return Buffer.concat(parts);
}

export async function managedIdentityToken(env:NodeJS.ProcessEnv, signal:AbortSignal, request:Fetch=fetch) {
  sourceConfig({...env,GROUND_WORKER_INPUT_SOURCE:'azure-blob'});
  const url=new URL(env.IDENTITY_ENDPOINT!);
  if(!['http:','https:'].includes(url.protocol)||url.username||url.password||url.hash)throw new Error('IDENTITY_ENDPOINT_INVALID');
  url.searchParams.set('resource','https://storage.azure.com/');url.searchParams.set('api-version','2019-08-01');url.searchParams.set('mi_res_id',identityResourceId);
  const raw=await bytes(await request(url,{method:'GET',headers:{'X-IDENTITY-HEADER':env.IDENTITY_HEADER!},redirect:'error',signal:AbortSignal.any([signal,AbortSignal.timeout(15000)])}),65536);
  const token=JSON.parse(raw.toString()) as {access_token?:string,expires_on?:string};
  if(typeof token.access_token!=='string'||!token.access_token||Number(token.expires_on)*1000<Date.now()+90000||!Number.isFinite(Number(token.expires_on)))throw new Error('IDENTITY_TOKEN_INVALID');
  return token.access_token;
}

/** Only HTTPS GET to the fixed storage account/container. No list-order dependence,
 * aliases, credentials from disk, SDK default credential chain, or storage writes.
 * Each pass has private scratch files, never a canonical-live store or persistent cache.
 */
export async function verifyBlob(input:ReturnType<typeof config>, env:NodeJS.ProcessEnv, shutdown:AbortSignal, request:Fetch=fetch) {
  const controller=new AbortController();
  const signal=AbortSignal.any([shutdown,controller.signal,AbortSignal.timeout(90000)]);
  const token=await managedIdentityToken(env,signal,request);
  const get=async(path:string,limit:number)=>{
    signal.throwIfAborted();
    const url=blobBase+'/'+prefix+'/'+path.split('/').map(encodeURIComponent).join('/');
    return bytes(await request(url,{method:'GET',headers:{Authorization:`Bearer ${token}`,'x-ms-version':'2023-11-03'},redirect:'error',signal:AbortSignal.any([signal,AbortSignal.timeout(15000)])}),limit);
  };
  if(!(await get('manifest.json',manifest.length)).equals(manifest))throw new Error('MANIFEST_MISMATCH');
  if(pins.length!==152||new Set(pins.map(p=>p.path)).size!==pins.length)throw new Error('MANIFEST_INVALID');
  const root=await mkdtemp(join(tmpdir(),'ground-blob-'));let cursor=0;let downloaded=0;
  try {
    const tasks=Array.from({length:4},async()=>{
      while(cursor<pins.length){
        signal.throwIfAborted();const pin=pins[cursor++];
        if(pin.path.split('/').some(x=>!x||x==='.'||x==='..')||pin.path.includes('\\')||!/^[a-f0-9]{64}$/.test(pin.sha256))throw new Error('MANIFEST_PATH_INVALID');
        const b=await get('files/'+pin.path,64*1024*1024);
        downloaded+=b.length;if(downloaded>128*1024*1024)throw new Error('CORPUS_TOO_LARGE');
        if(hash(b)!==pin.sha256)throw new Error('INPUT_INTEGRITY');
        const out=join(root,pin.path);await mkdir(dirname(out),{recursive:true,mode:0o700});await writeFile(out,b,{flag:'wx',mode:0o400});
      }
    });
    // Await all aborted downloads before removing their scratch directory.
    const settled=await Promise.allSettled(tasks.map(p=>p.catch(e=>{controller.abort();throw e;})));
    const failed=settled.find(r=>r.status==='rejected');if(failed?.status==='rejected')throw failed.reason;
    signal.throwIfAborted();
    // The original exact-byte and domain contracts are unchanged.
    const result=verify({...input,root});
    signal.throwIfAborted();
    return {...result,input_source:'azure-blob',corpus_release:release};
  } finally {controller.abort();await rm(root,{recursive:true,force:true});}
}
