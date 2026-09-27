"""Isolated source preparation / publisher OIDC / create-only release entrypoint."""
import argparse,base64,json,os,pathlib,re,subprocess,tempfile,urllib.request,urllib.parse,urllib.error,uuid
from ground_evidence import prepare,publish,verify_remote,EntraBlockBlobStore,NoRedirect,sha,require,VALIDATION_SCOPE,ENDPOINT
from ground_staging import POLICY,save,now,run
HERE=pathlib.Path(__file__).resolve().parent
CONFIG=json.loads((HERE/'evidence-publisher/identity.json').read_text())
SOURCE=POLICY['initial_source']; RELEASE=next(iter(POLICY['approved_releases']))
WORKFLOW='shulovm/seiri-ai-frontend/.github/workflows/ground-evidence-publish.yml@refs/heads/master'
SUBJECT='repo:shulovm/seiri-ai-frontend:environment:ground-staging:job_workflow_ref:'+WORKFLOW
TENANT='cc666046-841b-4c45-bf95-a23daa02d671'

def claims(t):
 p=t.split('.')[1];return json.loads(base64.urlsafe_b64decode(p+'='*(-len(p)%4)))
def azure(*args):
 return json.loads(run(['az',*args,'--only-show-errors','-o','json']).stdout)
def binding():
 require(CONFIG['status']=='BOOTSTRAP_VERIFIED','publisher identity not activated')
 for k in ('client_id','principal_id'):require(re.fullmatch(r'[0-9a-f-]{36}',CONFIG[k]),'identity binding missing')

def validate_bundle(bundle):
 meta=json.loads((bundle/'prepared.json').read_text())
 require(meta['source_commit']==SOURCE and meta['release_id']==RELEASE,'unapproved source/release bundle')
 require(meta['equivalence']=={**POLICY['approved_releases'][RELEASE],'input_scope':'historical-round6-staging','production_input':False,'production_authority':False,'source_authenticity_certified':False},'equivalence mismatch')
 return prepare(bundle/'files',(bundle/'manifest.json').read_bytes(),RELEASE)

def prepare_bundle(args):
 src=pathlib.Path(args.source).resolve();dest=pathlib.Path(args.bundle)
 require(args.sha==SOURCE and args.release==RELEASE,'unapproved source/release')
 require(run(['git','rev-parse','HEAD'],cwd=src).stdout.strip()==SOURCE,'source checkout mismatch')
 require(not run(['git','status','--porcelain','--untracked-files=no'],cwd=src).stdout,'source modified during tests')
 test=json.loads(pathlib.Path(args.test_checkpoint).read_text())
 require(test['source_commit']==SOURCE and test['status'] in ('TESTS_PASSED','ADMISSION_PASSED_WITH_EXACT_PRE_EXISTING_FAILURES'),'source tests not admitted')
 raw=(src/'containers/ground-worker/corpus-pins.json').read_bytes()
 release=prepare(src/'ground-core/experimental/historical-reality',raw,RELEASE)
 dest.mkdir(parents=True,exist_ok=False)
 for name,data in release.objects:
  local=dest/name[len(release.prefix):];local.parent.mkdir(parents=True,exist_ok=True);local.write_bytes(data)
 # No Azure token in this job. Use original compiled verifier against exactly bundled bytes.
 script="import {pathToFileURL} from 'node:url'; const {verify}=await import(pathToFileURL(process.argv[1])); console.log(JSON.stringify(verify({root:process.argv[2],interval:60000,port:8080})));"
 verified=json.loads(run(['node','--input-type=module','-e',script,str(src/'dist-worker/containers/ground-worker/verify.js'),str((dest/'files').resolve())],cwd=src).stdout)
 save(dest/'prepared.json',{'source_commit':SOURCE,'release_id':RELEASE,'equivalence':verified,'test_gate':test,'control_sha':os.environ.get('GITHUB_SHA'),'prepared_at':now()})
 validate_bundle(dest)

def subject_gate():
 binding()
 require(os.environ['GITHUB_REPOSITORY']=='shulovm/seiri-ai-frontend' and os.environ['GITHUB_REF']=='refs/heads/master','workflow context')
 url=os.environ['ACTIONS_ID_TOKEN_REQUEST_URL']+'&audience=api%3A%2F%2FAzureADTokenExchange'
 req=urllib.request.Request(url,headers={'Authorization':'bearer '+os.environ['ACTIONS_ID_TOKEN_REQUEST_TOKEN']})
 with urllib.request.build_opener(NoRedirect()).open(req,timeout=30) as res:t=json.load(res)['value']
 c=claims(t)
 require(c.get('iss')=='https://token.actions.githubusercontent.com' and c.get('aud')=='api://AzureADTokenExchange' and c.get('sub')==SUBJECT,'exact OIDC subject mismatch')
 require(c.get('job_workflow_ref')==WORKFLOW and c.get('environment')=='ground-staging','workflow/environment mismatch')
 return {k:c.get(k) for k in ('iss','aud','sub','job_workflow_ref','job_workflow_sha','environment')}

def token_gate():
 binding()
 t=azure('account','get-access-token','--resource','https://storage.azure.com/','--subscription',POLICY['subscription'])['accessToken']
 c=claims(t)
 require(c.get('oid')==CONFIG['principal_id'] and c.get('appid',c.get('azp'))==CONFIG['client_id'] and c.get('tid')==TENANT,'publisher principal mismatch')
 require(c.get('aud','').rstrip('/')=='https://storage.azure.com','Storage audience mismatch')
 return t

def validation_release(root):
 root.mkdir(parents=True,exist_ok=True)
 data=(json.dumps({'purpose':'GROUND-AZURE-005 deterministic create-only validation','promotion_allowed':False,'source_commit':SOURCE,'known_release':RELEASE},sort_keys=True,indent=2)+'\n').encode()
 (root/'validation.json').write_bytes(data)
 raw=(json.dumps([{'path':'validation.json','sha256':sha(data)}],indent=2)+'\n').encode()
 return prepare(root,raw,sha(raw),VALIDATION_SCOPE)

def negative_canary(token,release):
 # An impossible If-Match protects the retained validation marker even if authority drifted.
 # Never send these requests to real Evidence. A 412 is NOT a successful denial test.
 require(release.prefix.startswith(VALIDATION_SCOPE+'/'),'negative tests require isolated canary')
 url=ENDPOINT+'/'+release.prefix+'manifest.json';results={}
 for method in ('PUT','DELETE'):
  headers={'Authorization':'Bearer '+token,'x-ms-version':'2023-11-03','If-Match':'"ground-impossible-'+str(uuid.uuid4())+'"'}
  if method=='PUT':headers['x-ms-blob-type']='BlockBlob'
  req=urllib.request.Request(url,method=method,headers=headers,data=b'never-write' if method=='PUT' else None)
  try:
   with urllib.request.build_opener(NoRedirect()).open(req,timeout=30) as res:
    raise RuntimeError('unexpected allowed canary operation: '+method+' '+str(res.status))
  except urllib.error.HTTPError as e:
   code=e.headers.get('x-ms-error-code');require(e.code==403 and code=='AuthorizationPermissionMismatch','negative authority unresolved: '+method+' '+str(e.code)+' '+str(code))
   results[method]={'http':e.code,'code':code,'scope':'isolated validation manifest','guard':'impossible If-Match'}
 return results

def main():
 p=argparse.ArgumentParser();p.add_argument('stage',choices=['prepare','subject','auth','verify-existing','create-validation']);p.add_argument('--source');p.add_argument('--sha');p.add_argument('--release');p.add_argument('--bundle',default='bundle');p.add_argument('--test-checkpoint');a=p.parse_args()
 out=pathlib.Path('evidence/publisher');out.mkdir(parents=True,exist_ok=True)
 report={'stage':a.stage,'status':'STOPPED','source_commit':SOURCE,'release_id':RELEASE,'started':now(),'workflow_run':os.environ.get('GITHUB_RUN_ID'),'workflow_attempt':os.environ.get('GITHUB_RUN_ATTEMPT'),'control_sha':os.environ.get('GITHUB_SHA'),'worker_mutations':0,'write_attempts':[],'promotion':False}
 def journal(row):
  report['write_attempts'].append(row);save(out/(a.stage+'.json'),report)
 try:
  if a.stage=='prepare':prepare_bundle(a);report['status']='LOCAL_VALIDATION_VERIFIED'
  elif a.stage=='subject':report.update(status='OIDC_SUBJECT_VERIFIED',claims=subject_gate())
  else:
   release=validate_bundle(pathlib.Path(a.bundle));token=token_gate();store=EntraBlockBlobStore(token)
   report['publisher_principal_id']=CONFIG['principal_id']
   # All credentialed modes first require full byte identity of the existing release.
   report['existing_release_receipts']=verify_remote(store,release)
   report['existing_release_untouched']=True
   if a.stage=='auth':report['status']='OIDC_AND_EXISTING_RELEASE_READ_VERIFIED'
   elif a.stage=='verify-existing':
    # No create fallback here: explicitly stop if the existing release disappears.
    report.update(status='ALREADY_PUBLISHED',blob_mutations=0,equivalence='FULL_BYTE_HASH_VERIFIED')
   else:
    with tempfile.TemporaryDirectory() as td:
     testrelease=validation_release(pathlib.Path(td))
     result=publish(store,testrelease,journal)
     report['validation_release']=result
     report['negative_authority']=negative_canary(token,testrelease)
     report['validation_readback_after_negative_tests']=verify_remote(store,testrelease)
     report['existing_release_receipts_after']=verify_remote(store,release)
     report.update(status='ISOLATED_CREATE_PATH_VERIFIED',validation_release_id=testrelease.release_id,equivalence='FULL_BYTE_HASH_VERIFIED',promotion=False)
 except Exception as e:report['failed_gate']=str(e);raise
 finally:report['ended']=now();save(out/(a.stage+'.json'),report)
if __name__=='__main__':main()
