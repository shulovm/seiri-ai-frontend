#!/usr/bin/env python3
"""Explicit operator-only staging seed; never included in the compiled worker.
prepare: validate and export the current approved bytes locally.
seed: upload with Entra login, create-only, manifest last (container must exist).
verify: read every blob back and require byte equality; no storage writes.
"""
import argparse,hashlib,json,pathlib,subprocess,tempfile
p=argparse.ArgumentParser();p.add_argument('action',choices=['prepare','seed','verify']);p.add_argument('--source',required=True);p.add_argument('--output');p.add_argument('--az',default='az');a=p.parse_args()
base=pathlib.Path(__file__).resolve().parent
raw=(base/'corpus-pins.json').read_bytes();pins=json.loads(raw);digest=hashlib.sha256(raw).hexdigest()
account='orimusugroundstg01';container='ground-evidence-staging';prefix='historical-round6-staging/sha256-'+digest
source=pathlib.Path(a.source).resolve();objects=[]
def require(condition,message):
 if not condition:raise SystemExit(message)
require(len(pins)==152 and len({x['path'] for x in pins})==152,'Invalid pin set')
for item in pins:
 rel=pathlib.PurePosixPath(item['path']);require(not rel.is_absolute() and '..' not in rel.parts,'Invalid source path')
 path=source/rel;require(not path.is_symlink() and path.is_file() and source in path.resolve().parents,'Missing or unsafe source file')
 data=path.read_bytes();require(hashlib.sha256(data).hexdigest()==item['sha256'],'Source hash mismatch: '+item['path'])
 objects.append((prefix+'/files/'+item['path'],data))
objects.append((prefix+'/manifest.json',raw))
def command(*args):
 subprocess.run([a.az,*args,'--subscription','a0d869a1-8cdc-4b87-891c-9d92dd52320d','--account-name',account,'--container-name',container,'--auth-mode','login','--only-show-errors','--output','none'],check=True)
if a.action=='prepare':
 if not a.output:raise SystemExit('--output required')
 out=pathlib.Path(a.output);out.mkdir(parents=True,exist_ok=False)
 for name,data in objects:
  dest=out/name;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(data)
else:
 with tempfile.TemporaryDirectory(prefix='ground-seed-') as temp:
  for n,(name,data) in enumerate(objects):
   file=pathlib.Path(temp)/str(n)
   if a.action=='seed':
    file.write_bytes(data)
    command('storage','blob','upload','--name',name,'--file',str(file),'--overwrite','false','--if-none-match','*','--no-progress')
   else:
    command('storage','blob','download','--name',name,'--file',str(file),'--no-progress')
    require(file.read_bytes()==data,'Remote byte mismatch: '+name)
print(json.dumps({'action':a.action,'account':account,'container':container,'prefix':prefix,'files_checked':len(pins),'manifest_sha256':digest,'byte_equivalence':a.action=='verify','production_input':False,'production_authority':False}))
