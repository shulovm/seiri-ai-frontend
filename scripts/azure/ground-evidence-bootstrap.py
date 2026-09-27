"""Guarded operator bootstrap. Exactly one container-scoped read/add identity.

Run only in authenticated Portal Cloud Shell. No Blob or Container App writes.
"""
import json,pathlib,tempfile,urllib.parse,uuid,time
from ground_staging import (POLICY,ROOT,ARM,APP,az,get,pages,save,require,app_get,
    contract,static_gates,healthy,worker_roles,approved_baseline_bytes)
HERE=pathlib.Path(__file__).resolve().parent
SS='/subscriptions/'+POLICY['subscription']
SCOPE=ROOT+'/providers/Microsoft.Storage/storageAccounts/orimusugroundstg01/blobServices/default/containers/ground-evidence-staging'
NAME='id-ground-evidence-publisher-staging'
IDPATH=ROOT+'/providers/Microsoft.ManagedIdentity/userAssignedIdentities/'+NAME
ROLENAME='GROUND Evidence Block Blob Publisher Staging'
ROLEID=SS+'/providers/Microsoft.Authorization/roleDefinitions/'+str(uuid.uuid5(uuid.NAMESPACE_URL,'ground-005/role/'+ROLENAME))
SUBJECT='repo:shulovm/seiri-ai-frontend:environment:ground-staging:job_workflow_ref:shulovm/seiri-ai-frontend/.github/workflows/ground-evidence-publish.yml@refs/heads/master'
DATA=['Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read','Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action']
ev=pathlib.Path(tempfile.mkdtemp(prefix='ground-005-bootstrap-'))
r={'status':'STOPPED','mutation_attempts':[],'verified_resources':[],'evidence':str(ev),'storage_mutations':0,'worker_mutations':0}

def saved_get(label,path):
 value=get(path);save(ev/(label+'.json'),value);return value

def put(label,path,body):
 # A mutation is attempted once. Empty/async client output is not the outcome.
 file=ev/(label+'.request.json');save(file,body)
 r['mutation_attempts'].append({'label':label,'path':path});save(ev/'checkpoint.json',r)
 try:
  result=az(['rest','--method','put','--url',ARM+path,'--body','@'+str(file)],check=False,timeout=90)
  (ev/(label+'.stdout')).write_text(result.stdout);(ev/(label+'.stderr')).write_text(result.stderr)
 except Exception as e:save(ev/(label+'.client-error.json'),{'type':type(e).__name__})
 for attempt in range(6):
  try:return saved_get(label+'-readback',path)
  except Exception:
   if attempt==5:raise
   time.sleep(3)

def principal_roles(pid):
 return pages(SS+'/providers/Microsoft.Authorization/roleAssignments?'+urllib.parse.urlencode({'api-version':'2022-04-01','$filter':"principalId eq '"+pid+"'"}))

def validate_roles(rows,pid,allow_empty=False):
 if allow_empty and not rows:return
 require(len(rows)==1,'publisher has unexpected/duplicate role assignments')
 p=rows[0]['properties']
 require(p['principalId']==pid and p['roleDefinitionId'].lower()==ROLEID.lower() and p['scope'].lower()==SCOPE.lower() and not p.get('condition') and not p.get('delegatedManagedIdentityResourceId'),'publisher authority mismatch')

def norm_perms(items):
 return sorted([{k:sorted(s.lower() for s in p.get(k,[])) for k in ('actions','notActions','dataActions','notDataActions')} for p in items],key=str)

try:
 account=json.loads(az(['account','show']).stdout)
 require(account['id']==POLICY['subscription'] and account['tenantId']=='cc666046-841b-4c45-bf95-a23daa02d671','operator context mismatch')
 baseline=json.loads(approved_baseline_bytes());before=app_get();static_gates(before)
 require(contract(before)==baseline['contract'] and before['properties']['latestReadyRevisionName']==baseline['revision'] and before['properties']['latestRevisionName']==baseline['revision'],'worker baseline drift')
 require(before['properties']['template']['containers'][0]['image']==baseline['image'],'worker image drift')
 require(worker_roles(baseline['worker_principal_id'])==baseline['worker_roles'],'worker RBAC drift')
 save(ev/'worker-before.json',before)
 revs=pages(APP+'/revisions?api-version='+POLICY['app_api_version']);replicas=pages(APP+'/revisions/'+baseline['revision']+'/replicas?api-version='+POLICY['app_api_version'])
 healthy(before,revs,replicas,baseline['revision'],baseline['image'])
 # Resource existence proved by complete list; no failed GET is treated as absence.
 identities=pages(ROOT+'/providers/Microsoft.ManagedIdentity/userAssignedIdentities?api-version=2023-01-31')
 found=[x for x in identities if x['name']==NAME];require(len(found)<=1,'identity duplicate')
 tags={'ground-phase':'005','ground-purpose':'evidence-publish'}
 identity=saved_get('identity-existing',IDPATH+'?api-version=2023-01-31') if found else put('publisher-identity',IDPATH+'?api-version=2023-01-31',{'location':before['location'].replace(' ','').lower(),'tags':tags})
 require(all(identity.get('tags',{}).get(k)==v for k,v in tags.items()),'identity ownership mismatch')
 pid=identity['properties']['principalId'];client=identity['properties']['clientId']
 require(pid not in [baseline['worker_principal_id'],'6b124c00-5ab7-435a-ac0b-65b022fe880d','b11adb7b-9949-4580-a27c-bbce0757fcec'],'identity separation')
 r.update(publisher_principal_id=pid,publisher_client_id=client)
 current_roles=principal_roles(pid);validate_roles(current_roles,pid,allow_empty=True)
 roles=pages(SS+'/providers/Microsoft.Authorization/roleDefinitions?'+urllib.parse.urlencode({'api-version':'2022-04-01','$filter':"roleName eq '"+ROLENAME+"'"}))
 require(len(roles)<=1,'duplicate role name')
 want={'roleName':ROLENAME,'description':'GROUND Evidence create-only Block Blob publisher. Exact container assignment only.','type':'CustomRole','permissions':[{'actions':[],'notActions':[],'dataActions':DATA,'notDataActions':[]}],'assignableScopes':[ROOT]}
 role=roles[0] if roles else put('publisher-role',ROLEID+'?api-version=2022-04-01',{'properties':want})
 require(role['id'].lower()==ROLEID.lower(),'role identity mismatch')
 props=role['properties'];require(norm_perms(props['permissions'])==norm_perms(want['permissions']) and [x.lower() for x in props['assignableScopes']]==[ROOT.lower()],'role permissions mismatch')
 if current_roles:assignment=current_roles[0]
 else:
  aid=str(uuid.uuid5(uuid.NAMESPACE_URL,'ground-005/assignment/'+pid+'/'+SCOPE))
  assignment=put('publisher-container-assignment',SCOPE+'/providers/Microsoft.Authorization/roleAssignments/'+aid+'?api-version=2022-04-01',{'properties':{'principalId':pid,'principalType':'ServicePrincipal','roleDefinitionId':ROLEID}})
 validate_roles([assignment],pid)
 creds=pages(IDPATH+'/federatedIdentityCredentials?api-version=2023-01-31')
 cname='github-ground-staging-evidence-publish'
 require(len(creds)<=1 and all(c['name'].split('/')[-1]==cname for c in creds),'unexpected federation')
 ficprops={'issuer':'https://token.actions.githubusercontent.com','subject':SUBJECT,'audiences':['api://AzureADTokenExchange']}
 ficpath=IDPATH+'/federatedIdentityCredentials/'+cname+'?api-version=2023-01-31'
 fic=saved_get('federation-existing',ficpath) if creds else put('publisher-federation',ficpath,{'properties':ficprops})
 require(all(fic['properties'].get(k)==v for k,v in ficprops.items()),'federation mismatch')
 finalroles=principal_roles(pid);validate_roles(finalroles,pid);save(ev/'publisher-assignments.json',finalroles);save(ev/'publisher-role-definition.json',role)
 # Also inspect assignments at subscription ancestors, failing on a direct publisher grant.
 ancestors=pages(SS+'/providers/Microsoft.Authorization/roleAssignments?api-version=2022-04-01&$filter=atScope()')
 require(not any(x['properties']['principalId']==pid for x in ancestors),'publisher inherited broad role')
 after=app_get();require(before==after and worker_roles(baseline['worker_principal_id'])==baseline['worker_roles'],'worker state/RBAC changed')
 postrevs=pages(APP+'/revisions?api-version='+POLICY['app_api_version']);postrep=pages(APP+'/revisions/'+baseline['revision']+'/replicas?api-version='+POLICY['app_api_version'])
 healthy(after,postrevs,postrep,baseline['revision'],baseline['image'])
 require({x['name'] for x in revs}<={x['name'] for x in postrevs},'old revision missing')
 save(ev/'worker-after.json',after)
 r.update(status='PUBLISHER_IDENTITY_RBAC_FEDERATION_READBACK_VERIFIED',publisher_identity=identity['id'],publisher_scope=SCOPE,publisher_actions=DATA,oidc_subject=SUBJECT,verified_resources=[identity['id'],role['id'],assignment['id'],fic['id']],forbidden_actions_verified='MINIMAL_ROLE_AND_EXACT_ASSIGNMENT_READBACK; REAL_OIDC_AND_CANARY_DENIAL_PENDING',worker_identity_unchanged=True,worker_rbac_unchanged=True,github_variable={'GROUND_PUBLISHER_CLIENT_ID':client},next_action='Bind verified client/principal in trusted repository, configure non-secret GitHub variable, run auth-only then existing-release verification then isolated create validation. No Blob write in bootstrap.')
except Exception as e:r['failed_gate']=str(e)
finally:
 save(ev/'checkpoint.json',r)
 durable=pathlib.Path.home()/'ground-checkpoints'/'ground-005'/ev.name
 durable.mkdir(parents=True,exist_ok=True);save(durable/'checkpoint.json',r)
 r['durable_checkpoint']=str(durable/'checkpoint.json');save(ev/'checkpoint.json',r)
 print('CHECKPOINT='+json.dumps(r))
