"""Auth-only validation. No resource write requests; never persist bearer tokens."""
import argparse,base64,json,os,urllib.request,urllib.parse,urllib.error,uuid
from pathlib import Path
from ground_staging import POLICY,ROOT,APP,ARM,az,get,pages,save,require,app_get,contract,static_gates,healthy,worker_roles

IDS={'build':('a4cd0083-e411-45e1-b532-d7e1e7d92425','6b124c00-5ab7-435a-ac0b-65b022fe880d'), 'deploy':('5e86e667-cf19-4463-b26d-0a639138eed4','b11adb7b-9949-4580-a27c-bbce0757fcec')}
TENANT='cc666046-841b-4c45-bf95-a23daa02d671'
SS='/subscriptions/'+POLICY['subscription']
ACR=ROOT+'/providers/Microsoft.ContainerRegistry/registries/'+POLICY['registry']
WS=ROOT+'/providers/Microsoft.OperationalInsights/workspaces/law-ground-staging-jpe'

def claims(token):
 part=token.split('.')[1];return json.loads(base64.urlsafe_b64decode(part+'='*(-len(part)%4)))
def http_json(url,headers=None,data=None):
 req=urllib.request.Request(url,headers=headers or {},data=data)
 with urllib.request.urlopen(req,timeout=60) as response:return json.load(response)
def custom_role(name):return SS+'/providers/Microsoft.Authorization/roleDefinitions/'+str(uuid.uuid5(uuid.NAMESPACE_URL,'ground-004/role/'+name))
def repo_condition(actions):return '(('+ ' AND '.join("!(ActionMatches{'"+a+"'})" for a in actions)+") OR (@Request[Microsoft.ContainerRegistry/registries/repositories:name] StringEqualsIgnoreCase 'ground-worker'))"
def audit(purpose):
 pid=IDS[purpose][1]
 rows=pages(SS+'/providers/Microsoft.Authorization/roleAssignments?'+urllib.parse.urlencode({'api-version':'2022-04-01','$filter':"principalId eq '"+pid+"'"}))
 base='Microsoft.ContainerRegistry/registries/repositories/'
 actions=[base+'metadata/read',base+'content/read']
 role='b93aa761-3e63-49ed-ac28-beffa264f7ac'
 if purpose=='build':actions += [base+'metadata/write',base+'content/write'];role='2a1e307c-b015-4ebd-883e-5b7698a07328'
 expected=[(custom_role('GROUND Staging Registry Metadata Reader'),ACR,None,None),(SS+'/providers/Microsoft.Authorization/roleDefinitions/'+role,ACR,repo_condition(actions),'2.0')]
 if purpose=='deploy':
  expected += [(custom_role('GROUND Staging App Deployer'),APP,None,None),(custom_role('GROUND Worker RBAC Audit Reader'),SS,None,None),(SS+'/providers/Microsoft.Authorization/roleDefinitions/3b03c2da-16b3-4a49-8834-0f8130efdd3b',WS,"(!(ActionMatches{'Microsoft.OperationalInsights/workspaces/tables/data/read'}) OR (@Resource[Microsoft.OperationalInsights/workspaces/tables:name] StringEquals 'ContainerAppConsoleLogs_CL'))",'2.0')]
 actual=[]
 for row in rows:
  p=row['properties'];require(p['principalId']==pid,'audit principal');actual.append((p['roleDefinitionId'],p['scope'],p.get('condition'),p.get('conditionVersion')))
 def norm(values):return sorted([(a.lower(),b.lower(),c,d) for a,b,c,d in values],key=str)
 require(norm(actual)==norm(expected),'unexpected authority assignments: '+purpose)
 return {'status':'EXACT_ASSIGNMENTS_VERIFIED','assignments':rows,'forbidden_write_grants':'NONE_IN_REVIEWED_ROLE_DESIGN','limitation':'No forbidden write attempted; custom role action definitions were verified in Azure bootstrap, not independently re-read by this identity.'}

def main():
 p=argparse.ArgumentParser();p.add_argument('--purpose',choices=IDS,required=True);p.add_argument('--stage',choices=['subject','capabilities'],required=True);args=p.parse_args()
 out=Path('evidence/auth-'+args.purpose);out.mkdir(parents=True,exist_ok=True)
 r={'status':'STOPPED','purpose':args.purpose,'stage':args.stage,'resource_mutations':0}
 try:
  if args.stage=='subject':
   url=os.environ['ACTIONS_ID_TOKEN_REQUEST_URL']+'&audience='+urllib.parse.quote('api://AzureADTokenExchange',safe='')
   token=http_json(url,{'Authorization':'bearer '+os.environ['ACTIONS_ID_TOKEN_REQUEST_TOKEN']})['value'];c=claims(token)
   workflow='ground-staging-build.yml' if args.purpose=='build' else 'ground-staging-release.yml'
   expected='repo:shulovm/seiri-ai-frontend:environment:ground-staging:job_workflow_ref:shulovm/seiri-ai-frontend/.github/workflows/'+workflow+'@refs/heads/master'
   r['claims']={k:c.get(k) for k in ['iss','aud','sub','repository','ref','environment','job_workflow_ref','job_workflow_sha']}
   require(c['iss']=='https://token.actions.githubusercontent.com' and c['aud']=='api://AzureADTokenExchange' and c['sub']==expected,'issued OIDC subject mismatch')
   require(c['ref']=='refs/heads/master' and c['repository']=='shulovm/seiri-ai-frontend','issued ref mismatch')
   r['status']='ISSUED_SUBJECT_MATCH_VERIFIED'
  else:
   account=json.loads(az(['account','show']).stdout);require(account['id']==POLICY['subscription'] and account['tenantId']==TENANT,'account mismatch')
   access=json.loads(az(['account','get-access-token','--resource',ARM+'/']).stdout)['accessToken'];c=claims(access)
   require(c['oid']==IDS[args.purpose][1] and c.get('appid',c.get('azp'))==IDS[args.purpose][0] and c['tid']==TENANT,'signed-in principal mismatch')
   r['azure_identity']={k:c.get(k) for k in ['oid','appid','azp','tid']}
   reg=get(ACR+'?api-version=2023-07-01');require(reg['properties']['adminUserEnabled'] is False,'registry admin changed')
   registry=POLICY['registry_server'];refresh=json.loads(az(['acr','login','--name',POLICY['registry'],'--expose-token']).stdout)['accessToken']
   body=urllib.parse.urlencode({'grant_type':'refresh_token','service':registry,'scope':'repository:ground-worker:pull,push,delete','refresh_token':refresh}).encode()
   acr_token=http_json('https://'+registry+'/oauth2/token',{'Content-Type':'application/x-www-form-urlencoded'},body)['access_token']
   ac=claims(acr_token);r['acr_token_authorization']=ac.get('access')
   grants=[x for x in ac.get('access',[]) if x.get('type')=='repository' and x.get('name')=='ground-worker'];require(len(grants)==1,'repository token scope missing')
   actions=set(grants[0]['actions']);require('pull' in actions and 'delete' not in actions,'repository scope mismatch')
   require(('push' in actions)==(args.purpose=='build'),'repository write capability mismatch')
   req=urllib.request.Request('https://'+registry+'/v2/ground-worker/manifests/'+POLICY['initial_digest'],headers={'Authorization':'Bearer '+acr_token,'Accept':'application/vnd.oci.image.manifest.v1+json, application/vnd.docker.distribution.manifest.v2+json'},method='HEAD')
   with urllib.request.urlopen(req,timeout=60) as response:require(response.status==200,'registry digest read')
   r['acr_digest_read']='PASS';r['acr_write_capability']='TOKEN_SCOPE_GRANTED_NO_WRITE_PERFORMED' if args.purpose=='build' else 'TOKEN_SCOPE_EXCLUDES_PUSH_AND_DELETE'
   if args.purpose=='deploy':
    before=app_get();static_gates(before)
    revs=pages(APP+'/revisions?api-version='+POLICY['app_api_version']);r['revisions_read']='PASS'
    revision=before['properties']['latestReadyRevisionName'];replicas=pages(APP+'/revisions/'+revision+'/replicas?api-version='+POLICY['app_api_version']);r['replicas']=replicas
    require(revision==POLICY['initial_revision'],'revision changed before first run')
    require(before['properties']['template']['containers'][0]['image'].endswith('@'+POLICY['initial_digest']),'digest changed')
    query="ContainerAppConsoleLogs_CL | where TimeGenerated > ago(15m) | where ContainerAppName_s == 'ground-worker-staging' | top 1 by TimeGenerated desc | project TimeGenerated, RevisionName_s, Log_s"
    result=json.loads(az(['rest','--method','post','--url','https://api.loganalytics.azure.com/v1/workspaces/'+POLICY['workspace_customer_id']+'/query','--resource','https://api.loganalytics.io','--body',json.dumps({'query':query,'timespan':'PT15M'})]).stdout)
    require(result.get('tables') and result['tables'][0].get('rows'),'console log query empty');r['log_query']=result
    r['authority_audit']={purpose:audit(purpose) for purpose in IDS}
    after=app_get();require(before==after,'worker changed during auth-only run');r['worker_unchanged']=True
    save(out/'worker-before.json',before);save(out/'revisions.json',revs)
   r['status']='AUTH_CAPABILITY_VERIFIED'
 except Exception as error:
  r['error']=str(error);raise
 finally:save(out/(args.stage+'.json'),r);print(json.dumps(r,indent=2))
if __name__=='__main__':main()
