import copy,datetime,json,os,pathlib,subprocess,tempfile,urllib.parse,uuid
os.umask(0o077)
sub='a0d869a1-8cdc-4b87-891c-9d92dd52320d';ss='/subscriptions/'+sub
root=ss+'/resourceGroups/rg-orimusu-ground-staging';arm='https://management.azure.com'
app=root+'/providers/Microsoft.App/containerApps/ground-worker-staging'
acr=root+'/providers/Microsoft.ContainerRegistry/registries/orimusugroundacr'
ws=root+'/providers/Microsoft.OperationalInsights/workspaces/law-ground-staging-jpe'
prior=pathlib.Path('/tmp/ground-004-authority-le2o8ool')
d=pathlib.Path(tempfile.mkdtemp(prefix='ground-004-bootstrap-'))
expected_assignments={}
r={'status':'STOPPED','mutation_attempts':[],'verified_resources':[],'evidence':str(d),'worker_modified':False}
def az(label,args,check=True):
 p=subprocess.run(['az']+args+['--only-show-errors','-o','json'],capture_output=True,text=True,timeout=90)
 (d/(label+'.stdout')).write_text(p.stdout);(d/(label+'.stderr')).write_text(p.stderr)
 if check and p.returncode:raise RuntimeError(label+': '+p.stderr[:600])
 return p
def get(label,path):return json.loads(az(label,['rest','--method','get','--url',arm+path]).stdout)
def items(label,path):
 result=[];i=0
 while path:
  body=get(label+'-'+str(i),path);result+=body['value'];i+=1
  nxt=body.get('nextLink')
  if nxt:assert nxt.startswith(arm+'/');path=nxt[len(arm):]
  else:path=None
 return result
def put(label,path,body):
 file=d/(label+'.request.json');file.write_text(json.dumps(body));r['mutation_attempts'].append(label)
 (d/'checkpoint.json').write_text(json.dumps(r,indent=2))
 try:az(label,['rest','--method','put','--url',arm+path,'--body','@'+str(file)],False)
 except subprocess.TimeoutExpired:pass
 return get(label+'-readback',path)
def gid(text):return str(uuid.uuid5(uuid.NAMESPACE_URL,'ground-004/'+text))
def permissions(p):
 return [{k:sorted(v.casefold() for v in x.get(k,[])) for k in ['actions','notActions','dataActions','notDataActions']} for x in p]
def worker_roles():
 p=baseline['worker_principal_id'];q=urllib.parse.urlencode({'api-version':'2022-04-01','$filter':"principalId eq '"+p+"'"})
 rows=items('worker-roles',ss+'/providers/Microsoft.Authorization/roleAssignments?'+q)
 keys=('principalId','roleDefinitionId','scope','condition','conditionVersion','delegatedManagedIdentityResourceId')
 return sorted([{k:x['properties'].get(k) for k in keys} for x in rows],key=lambda x:json.dumps(x,sort_keys=True))
def ensure_role(name,actions,scope):
 rid=gid('role/'+name);path=ss+'/providers/Microsoft.Authorization/roleDefinitions/'+rid+'?api-version=2022-04-01'
 matches=items('find-'+name,ss+'/providers/Microsoft.Authorization/roleDefinitions?'+urllib.parse.urlencode({'api-version':'2022-04-01','$filter':"roleName eq '"+name+"'"}))
 assert len(matches)<=1,'duplicate custom role name'
 want={'roleName':name,'description':'GROUND staging pipeline: narrowly scoped '+name,'type':'CustomRole','permissions':[{'actions':actions,'notActions':[],'dataActions':[],'notDataActions':[]}],'assignableScopes':[scope]}
 if matches:
  live=matches[0];assert live['name']==rid,'existing custom role identity mismatch'
 else:live=put('role-'+name,path,{'properties':want})
 p=live['properties'];assert p['roleName']==name and permissions(p['permissions'])==permissions(want['permissions']) and [v.casefold() for v in p['assignableScopes']]==[scope.casefold()]
 r['verified_resources'].append(live['id']);return ss+'/providers/Microsoft.Authorization/roleDefinitions/'+rid
def ensure_assignment(principal,role,scope,condition=None):
 aid=gid('assignment/'+principal+'/'+role+'/'+scope);path=scope+'/providers/Microsoft.Authorization/roleAssignments/'+aid+'?api-version=2022-04-01'
 rows=items('assignments-'+aid,scope+'/providers/Microsoft.Authorization/roleAssignments?api-version=2022-04-01')
 matches=[x for x in rows if x['properties']['principalId']==principal and x['properties']['roleDefinitionId'].casefold()==role.casefold() and x['properties']['scope'].casefold()==scope.casefold()]
 assert len(matches)<=1,'duplicate matching assignment'
 props={'principalId':principal,'principalType':'ServicePrincipal','roleDefinitionId':role}
 if condition:props.update(condition=condition,conditionVersion='2.0')
 live=matches[0] if matches else put('assignment-'+aid,path,{'properties':props})
 p=live['properties'];assert p['principalId']==principal and p['roleDefinitionId'].casefold()==role.casefold() and p['scope'].casefold()==scope.casefold()
 assert p.get('condition')==condition and (not condition or p.get('conditionVersion')=='2.0'),'assignment condition mismatch'
 r['verified_resources'].append(live['id'])
 expected_assignments.setdefault(principal,[]).append((role.casefold(),scope.casefold(),condition))
def repository_condition(actions):
 return '(('+ ' AND '.join("!(ActionMatches{'"+a+"'})" for a in actions)+") OR (@Request[Microsoft.ContainerRegistry/registries/repositories:name] StringEqualsIgnoreCase 'ground-worker'))"
try:
 account=json.loads(az('account',['account','show']).stdout);assert account['id']==sub
 baseline=json.loads((prior/'baseline.json').read_text());old=json.loads((prior/'worker.stdout').read_text())
 before=get('worker-before',app+'?api-version=2024-03-01')
 assert before['identity']==old['identity'] and before['properties']['configuration']==old['properties']['configuration'] and before['properties']['template']==old['properties']['template'],'worker drift'
 assert before['properties']['latestReadyRevisionName']==baseline['revision'] and before['properties']['latestRevisionName']==baseline['revision']
 assert worker_roles()==baseline['worker_roles'],'worker RBAC drift'
 reg=json.loads(az('acr-current',['acr','show','--name','orimusugroundacr','--resource-group','rg-orimusu-ground-staging','--subscription',sub]).stdout)
 assert reg['roleAssignmentMode']=='AbacRepositoryPermissions' and reg['adminUserEnabled'] is False
 definitions={}
 for key,rid in [('writer','2a1e307c-b015-4ebd-883e-5b7698a07328'),('reader','b93aa761-3e63-49ed-ac28-beffa264f7ac'),('logs','3b03c2da-16b3-4a49-8834-0f8130efdd3b')]:
  definitions[key]=get('builtin-'+key,ss+'/providers/Microsoft.Authorization/roleDefinitions/'+rid+'?api-version=2022-04-01')
 base='Microsoft.ContainerRegistry/registries/repositories/'
 dataread=[base+'metadata/read',base+'content/read'];datawrite=dataread+[base+'metadata/write',base+'content/write']
 for key,actions in [('reader',dataread),('writer',datawrite)]:
  assert permissions(definitions[key]['properties']['permissions'])==permissions([{'actions':[],'dataActions':actions}]),'built-in registry role drift'
 logactions=['Microsoft.OperationalInsights/workspaces/read','Microsoft.OperationalInsights/workspaces/query/read'];logdata=['Microsoft.OperationalInsights/workspaces/tables/data/read']
 assert permissions(definitions['logs']['properties']['permissions'])==permissions([{'actions':logactions,'dataActions':logdata}]),'built-in logs role drift'
 identities=items('identities-before',root+'/providers/Microsoft.ManagedIdentity/userAssignedIdentities?api-version=2023-01-31')
 selected={}
 for purpose in ['build','deploy']:
  name='id-ground-'+purpose+'-staging';found=[x for x in identities if x['name']==name]
  assert len(found)<=1
  tags={'ground-phase':'004','ground-purpose':purpose};path=root+'/providers/Microsoft.ManagedIdentity/userAssignedIdentities/'+name+'?api-version=2023-01-31'
  if found:live=get(name+'-existing',path)
  else:live=put(name,path,{'location':reg['location'],'tags':tags})
  assert all(live.get('tags',{}).get(k)==v for k,v in tags.items()),'identity ownership mismatch'
  assert live['properties']['principalId']!=baseline['worker_principal_id']
  selected[purpose]=live;r['verified_resources'].append(live['id'])
 appRole=ensure_role('GROUND Staging App Deployer',['microsoft.app/containerapps/read','microsoft.app/containerapps/write','microsoft.app/containerapps/revisions/read','microsoft.app/containerapps/revisions/replicas/read'],root)
 acrRole=ensure_role('GROUND Staging Registry Metadata Reader',['Microsoft.ContainerRegistry/registries/read'],root)
 auditRole=ensure_role('GROUND Worker RBAC Audit Reader',['Microsoft.Authorization/roleAssignments/read'],ss)
 for purpose in ['build','deploy']:
  ident=selected[purpose];pid=ident['properties']['principalId'];ensure_assignment(pid,acrRole,acr)
  key='writer' if purpose=='build' else 'reader'
  ensure_assignment(pid,definitions[key]['id'],acr,repository_condition(datawrite if purpose=='build' else dataread))
  if purpose=='deploy':
   ensure_assignment(pid,appRole,app)
   condition="(!(ActionMatches{'Microsoft.OperationalInsights/workspaces/tables/data/read'}) OR (@Resource[Microsoft.OperationalInsights/workspaces/tables:name] StringEquals 'ContainerAppConsoleLogs_CL'))"
   ensure_assignment(pid,definitions['logs']['id'],ws,condition);ensure_assignment(pid,auditRole,ss)
  workflow='ground-staging-build.yml' if purpose=='build' else 'ground-staging-release.yml'
  subject='repo:shulovm/seiri-ai-frontend:environment:ground-staging:job_workflow_ref:shulovm/seiri-ai-frontend/.github/workflows/'+workflow+'@refs/heads/master'
  creds=items('federations-'+purpose,ident['id']+'/federatedIdentityCredentials?api-version=2023-01-31')
  cname='github-ground-staging-'+purpose;assert all(x['name'].split('/')[-1]==cname for x in creds),'unexpected existing federation'
  want={'issuer':'https://token.actions.githubusercontent.com','subject':subject,'audiences':['api://AzureADTokenExchange']}
  path=ident['id']+'/federatedIdentityCredentials/'+cname+'?api-version=2023-01-31'
  live=get('federation-existing-'+purpose,path) if creds else put('federation-'+purpose,path,{'properties':want})
  assert all(live['properties'].get(k)==v for k,v in want.items()),'federation mismatch'
  r['verified_resources'].append(live['id'])
 for purpose in ['build','deploy']:
  pid=selected[purpose]['properties']['principalId'];q=urllib.parse.urlencode({'api-version':'2022-04-01','$filter':"principalId eq '"+pid+"'"})
  allroles=items('final-roles-'+purpose,ss+'/providers/Microsoft.Authorization/roleAssignments?'+q)
  actual=[(x['properties']['roleDefinitionId'].casefold(),x['properties']['scope'].casefold(),x['properties'].get('condition')) for x in allroles]
  assert sorted(actual,key=str)==sorted(expected_assignments[pid],key=str),'unexpected pipeline identity role assignment'
 after=get('worker-after',app+'?api-version=2024-03-01')
 assert before==after and worker_roles()==baseline['worker_roles'],'worker or worker authority changed'
 r.update(status='IDENTITIES_ROLES_FEDERATIONS_CREATED_READBACK_VERIFIED',worker_identity_unchanged=True,worker_rbac_unchanged=True,credential_model='GitHub OIDC only; environment plus separate workflow subjects',operational_identity_query_test='PENDING_GITHUB_RUN',github_variables={'GROUND_TENANT_ID':account['tenantId'],'GROUND_BUILD_CLIENT_ID':selected['build']['properties']['clientId'],'GROUND_DEPLOY_CLIENT_ID':selected['deploy']['properties']['clientId']},baseline_path=str(prior/'baseline.json'),next_action='Configure GitHub variables, install reviewed workflow on trusted branch, verify actual OIDC/permissions; no live deployment performed by bootstrap.')
except Exception as e:r['error']=str(e)
finally:
 (d/'checkpoint.json').write_text(json.dumps(r,indent=2));print('CHECKPOINT='+json.dumps(r),flush=True)
