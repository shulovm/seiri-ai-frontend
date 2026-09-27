"""Read-only reconciliation of the one reviewed successful push with failed client validation."""
import hashlib,json,os,urllib.request
from pathlib import Path
from ground_staging import POLICY,az,require,save
pins=json.loads(Path(__file__).with_name('ground-staging-reconciliation.json').read_text())
require(os.environ['SOURCE_SHA']==POLICY['initial_source'],'explicit admitted reconciliation source')
for name,expected in pins['files'].items():
 p=Path('origin-evidence')/name;require(hashlib.sha256(p.read_bytes()).hexdigest()==expected,'original artifact hash: '+name)
def github(path):
 req=urllib.request.Request('https://api.github.com/repos/'+POLICY['repository']+path,headers={'Authorization':'Bearer '+os.environ['GH_TOKEN'],'Accept':'application/vnd.github+json'})
 with urllib.request.urlopen(req,timeout=60) as response:return json.load(response)
run=github('/actions/runs/'+pins['origin_run'])
require(run['head_sha']==pins['origin_workflow_sha'] and run['event']=='workflow_dispatch' and run['head_branch']=='master' and run['conclusion']=='failure','reviewed origin run')
jobs=github('/actions/runs/'+pins['origin_run']+'/jobs?per_page=100')['jobs']
require(any(j['name']=='tests' and j['conclusion']=='success' for j in jobs),'original source tests')
require(not any(j['name'].startswith('deploy /') and j['conclusion']!='skipped' for j in jobs),'origin deployment was not executed')
built=json.loads(Path('origin-evidence/build/build.json').read_text());tests=json.loads(Path('origin-evidence/tests/test-checkpoint.json').read_text())
require(built['source_commit']==tests['source_commit']==POLICY['initial_source'] and built['run_id']==pins['origin_run'] and built['attempt']==pins['origin_attempt'],'source and origin binding')
require(tests['status']=='ADMISSION_PASSED_WITH_EXACT_PRE_EXISTING_FAILURES','exact source admission')
tag='staging-'+POLICY['initial_source'][:7]+'-'+pins['origin_run']+'-'+pins['origin_attempt'];full=POLICY['registry_server']+'/ground-worker'
require(built['tag']==full+':'+tag,'original tag binding')
require(tag+': digest: '+pins['digest']+' size:' in Path('origin-evidence/build/push.log').read_text(),'pushed digest evidence')
remote=json.loads(az(['acr','repository','show','--name',POLICY['registry'],'--image','ground-worker:'+tag]).stdout)
require(remote.get('name')==tag and remote.get('digest')==pins['digest'],'live published tag/digest binding')
manifest=json.loads(az(['acr','repository','show','--name',POLICY['registry'],'--image','ground-worker@'+pins['digest']]).stdout)
require(manifest.get('digest')==pins['digest'],'exact repository manifest binding')
image={**built,'digest':pins['digest'],'image':full+'@'+pins['digest'],'reconciliation':{'deployment_run_id':os.environ['GITHUB_RUN_ID'],'deployment_attempt':os.environ['GITHUB_RUN_ATTEMPT'],'origin_artifact_hashes':pins['files'],'reason':'Tag metadata name is tag name, not repository name; successful push independently read back. No rebuild or re-push.'}}
save('image-artifact/image.json',image);save('evidence/deploy/reconciliation.json',{'image':image,'tag_readback':remote,'manifest_readback':manifest,'origin_run':run['html_url']})
