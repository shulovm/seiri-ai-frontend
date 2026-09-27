"""GROUND-AZURE-005 authority preflight. Read-only Azure operations only."""
import hashlib,json,pathlib,subprocess,tempfile,urllib.request,urllib.parse
SUB='a0d869a1-8cdc-4b87-891c-9d92dd52320d';SS='/subscriptions/'+SUB
ROOT=SS+'/resourceGroups/rg-orimusu-ground-staging';ARM='https://management.azure.com'
D=pathlib.Path(tempfile.mkdtemp(prefix='ground-005-inventory-'))
r={'phase':'GROUND-AZURE-005','status':'STOPPED','azure_mutations':0,'evidence':str(D)}
def az(label,args):
 p=subprocess.run(['az',*args,'--only-show-errors','-o','json'],text=True,capture_output=True,timeout=120)
 (D/(label+'.stdout')).write_text(p.stdout);(D/(label+'.stderr')).write_text(p.stderr)
 assert p.returncode==0,label+': '+p.stderr[:250]
 return json.loads(p.stdout)
def get(label,path):return az(label,['rest','--method','get','--url',ARM+path])
def pages(label,path):
 rows=[];i=0
 while path:
  data=get(label+'-'+str(i),path);rows+=data['value'];n=data.get('nextLink');i+=1
  assert not n or n.startswith(ARM+SS+'/'),'pagination outside subscription'
  path=n[len(ARM):] if n else None
 return rows
try:
 account=az('account',['account','show']);assert account['id']==SUB
 digest='a8f2c0294d1546ebc43b80ef0624112b8a5f3b504925d141f9a1cb9e88e870d2'
 url='https://raw.githubusercontent.com/shulovm/seiri-ai-frontend/df3e735e1de3cc276cf62c5c9e8d58ec4e8ad26b/scripts/azure/baselines/'+digest+'.json'
 with urllib.request.urlopen(url,timeout=30) as response:raw=response.read(65537)
 assert len(raw)<=65536 and hashlib.sha256(raw).hexdigest()==digest,'verified baseline transfer'
 baseline=json.loads(raw);app=get('worker',ROOT+'/providers/Microsoft.App/containerApps/ground-worker-staging?api-version=2024-03-01')
 props=app['properties'];template=json.loads(json.dumps(props['template']));template.pop('revisionSuffix',None)
 for c in template['containers']:c.pop('image',None)
 contract={'identity':app.get('identity'),'configuration':props['configuration'],'template':template,'environmentId':props.get('environmentId'),'managedEnvironmentId':props.get('managedEnvironmentId'),'workloadProfileName':props.get('workloadProfileName'),'location':app['location']}
 assert contract==baseline['contract'] and props['latestReadyRevisionName']==baseline['revision'] and props['template']['containers'][0]['image']==baseline['image'],'worker drift'
 q=urllib.parse.urlencode({'api-version':'2022-04-01','$filter':"principalId eq '"+baseline['worker_principal_id']+"'"})
 assignments=pages('worker-roles',SS+'/providers/Microsoft.Authorization/roleAssignments?'+q)
 keys=('principalId','roleDefinitionId','scope','condition','conditionVersion','delegatedManagedIdentityResourceId')
 roles=sorted([{k:x['properties'].get(k) for k in keys} for x in assignments],key=lambda x:json.dumps(x,sort_keys=True))
 assert roles==baseline['worker_roles'],'worker authority drift'
 op=az('storage-operations',['provider','operation','show','--namespace','Microsoft.Storage']);matches=[]
 def walk(node):
  if isinstance(node,dict):
   name=node.get('name','')
   if name.lower().startswith('microsoft.storage/storageaccounts/blobservices/containers/blobs/') and name.lower().endswith(('/read','/write','/delete','/add/action')):matches.append({'name':name,'isDataAction':node.get('isDataAction'),'display':node.get('display')})
   for child in node.values():walk(child)
  elif isinstance(node,list):
   for child in node:walk(child)
 walk(op);r['storage_blob_operations']=matches
 storage=ROOT+'/providers/Microsoft.Storage/storageAccounts/orimusugroundstg01'
 st=get('storage',storage+'?api-version=2023-05-01');container=get('container',storage+'/blobServices/default/containers/ground-evidence-staging?api-version=2023-05-01')
 r['storage_configuration']={k:st['properties'].get(k) for k in ['isHnsEnabled','allowSharedKeyAccess','allowBlobPublicAccess','publicNetworkAccess','networkAcls','minimumTlsVersion']}
 r['container_configuration']=container['properties']
 identities=pages('identities',ROOT+'/providers/Microsoft.ManagedIdentity/userAssignedIdentities?api-version=2023-01-31')
 r['existing_publisher_identities']=[x for x in identities if x['name']=='id-ground-publish-staging']
 r.update(status='READ_ONLY_AUTHORITY_INVENTORY_COMPLETE',worker_unchanged=True,worker_rbac_unchanged=True,phase004='DEPLOYED_VERIFIED',next_action='Review exact Blob read/write actions and isolated publisher scope before any publisher identity/RBAC creation. Worker stays Reader-only; no Storage data was changed.')
except Exception as error:r['error']=str(error)
finally:
 (D/'checkpoint.json').write_text(json.dumps(r,indent=2));print('CHECKPOINT='+json.dumps(r),flush=True)
