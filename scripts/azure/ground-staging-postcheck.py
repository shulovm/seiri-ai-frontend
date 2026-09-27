"""Read-only reconciliation of the one authorized deployment; never retries PATCH."""
import base64,hashlib,json,os,time
from pathlib import Path
from ground_staging import *
BASE='cd1ea34ade3d162fc0e0bf8fa62b3afee38fd6f9d9ebd151eea49143b49890a7'
REV='ground-worker-staging--ci-e23ff04-36288568608-1'
DIGEST='sha256:b42d6adbbebe958587a5682bac6200997d9ef41e0ab77580c8dc1f73c2b8b1e1'
IMAGE=POLICY['registry_server']+'/ground-worker@'+DIGEST
E=Path('evidence/postcheck');E.mkdir(parents=True,exist_ok=True)
r={'phase':'GROUND-AZURE-004','status':'STOPPED','azure_mutations':0,'original_deployment_run':'36288568608','origin_build_run':'36288094609','verification_run':os.environ['GITHUB_RUN_ID'],'parent_baseline_sha256':BASE,'expected_revision':REV,'image':IMAGE}
try:
 raw=(Path(__file__).parent/'baselines'/(BASE+'.json')).read_bytes();require(hashlib.sha256(raw).hexdigest()==BASE,'original baseline hash');b=json.loads(raw)
 token=json.loads(az(['account','get-access-token','--resource',ARM+'/']).stdout)['accessToken'];part=token.split('.')[1];c=json.loads(base64.urlsafe_b64decode(part+'='*(-len(part)%4)))
 require(c['oid']=='b11adb7b-9949-4580-a27c-bbce0757fcec' and c.get('appid',c.get('azp'))=='5e86e667-cf19-4463-b26d-0a639138eed4','exact deploy principal')
 deadline=time.monotonic()+300;i=0
 while True:
  app=app_get();rs=revisions();rp=replicas(REV)
  save(E/('observation-'+str(i)+'.json'),{'app':app,'revisions':rs,'replicas':rp});i+=1
  require(contract(app)==b['contract'],'preserved configuration mismatch')
  require(set(b['retained_revisions'])<={x['name'] for x in rs},'old revisions missing')
  try:healthy(app,rs,rp,REV,IMAGE);break
  except RuntimeError as error:
   if str(error)!='one expected active revision' or time.monotonic()>=deadline:raise
   time.sleep(15)
 roles=worker_roles(b['worker_principal_id']);require(roles==b['worker_roles'],'worker RBAC mismatch');save(E/'worker-roles.json',roles)
 signal=integrity(REV,next(iter(POLICY['approved_releases'])),'2026-09-27T02:29:39.298841+00:00');save(E/'integrity.json',signal)
 final=app_get();fr=revisions();fp=replicas(REV);healthy(final,fr,fp,REV,IMAGE);require(contract(final)==b['contract'],'final configuration');require(worker_roles(b['worker_principal_id'])==roles,'final worker RBAC')
 successor={**b,'revision':REV,'image':IMAGE,'retained_revisions':sorted(x['name'] for x in fr)};save(E/'next-baseline.json',successor);newsha=hashlib.sha256((E/'next-baseline.json').read_bytes()).hexdigest()
 save(E/'baseline-lineage.json',{'parent_baseline_sha256':BASE,'successor_baseline_sha256':newsha,'source_commit':POLICY['initial_source'],'image_digest':DIGEST,'origin_build_run':'36288094609','deployment_run':'36288568608','verification_run':os.environ['GITHUB_RUN_ID'],'revision':REV,'evidence':['checkpoint.json','worker-roles.json','integrity.json','final-state.json'],'original_baseline_preserved':True})
 save(E/'final-state.json',{'app':final,'revisions':fr,'replicas':fp})
 r.update(status='DEPLOYED_VERIFIED',health_gate='VERIFIED',integrity_gate='VERIFIED',worker_identity_unchanged=True,worker_rbac_unchanged=True,successor_baseline_sha256=newsha,active_revision=REV,verification_completed=now(),integrity_checks_verified=len(signal),activity_log_correlation='Original deployment run/time/source/digest/revision recorded; no additional write; activity alert retained')
except Exception as error:r['failed_gate']=str(error);raise
finally:save(E/'checkpoint.json',r);print(json.dumps(r,indent=2))
