"""GROUND 006: fixed-target GET-only authority validation. Never grants permissions."""
import base64
import datetime as dt
import json
import os
from pathlib import Path
import subprocess
import urllib.parse
import urllib.request
from ground_staging import (ARM, APP, ROOT, POLICY, approved_baseline_bytes,
                            contract, healthy, require, save)

PRINCIPAL = 'b11adb7b-9949-4580-a27c-bbce0757fcec'
CLIENT = '5e86e667-cf19-4463-b26d-0a639138eed4'
DEPLOY_RUN = '36288568608'
SOURCE = 'e23ff04b02a6df64739cb2a7d462315eb82324f2'
REV = 'ground-worker-staging--ci-e23ff04-36288568608-1'
DIGEST = 'sha256:b42d6adbbebe958587a5682bac6200997d9ef41e0ab77580c8dc1f73c2b8b1e1'
WS = ROOT + '/providers/Microsoft.OperationalInsights/workspaces/law-ground-staging-jpe'

class ReadFailure(RuntimeError):
    def __init__(self, evidence):
        self.evidence = evidence
        super().__init__('Azure read failed; see saved response')

class Reader:
    def __init__(self, directory): self.directory = directory
    def get(self, name, url, resource=None):
        require(url.startswith((ARM + '/subscriptions/' + POLICY['subscription'] + '/',
                                'https://api.loganalytics.azure.com/v1/workspaces/' + POLICY['workspace_customer_id'] + '/query?')), 'GET boundary')
        args = ['az', 'rest', '--method', 'get', '--url', url, '--only-show-errors', '-o', 'json']
        if resource: args += ['--resource', resource]
        p = subprocess.run(args, capture_output=True, text=True, timeout=120)
        if p.returncode:
            e = {'url': url, 'method': 'GET', 'exit_code': p.returncode, 'stderr': p.stderr, 'stdout': p.stdout}
            save(self.directory / (name + '-error.json'), e)
            raise ReadFailure(e)
        value = json.loads(p.stdout)
        require('error' not in value, 'partial/error API response')
        return value
    def pages(self, name, url):
        result = []; seen = set()
        while url:
            require(url not in seen and len(seen) < 100, 'pagination boundary')
            seen.add(url); d = self.get(name, url)
            require(isinstance(d.get('value'), list), 'incomplete paginated read')
            result += d['value']; url = d.get('nextLink')
        return result

def activity_url():
    q = urllib.parse.urlencode({'api-version':'2015-04-01', '$filter':
        "eventTimestamp ge '2026-09-27T02:20:00Z' and eventTimestamp le '2026-09-27T02:50:00Z' and resourceUri eq '" + APP + "'"})
    return ARM + '/subscriptions/' + POLICY['subscription'] + '/providers/Microsoft.Insights/eventtypes/management/values?' + q

def sanitized_event(e):
    # Preserve correlation facts, never the full claims payload or HTTP headers.
    c = e.get('claims') or {}; p = e.get('properties') or {}; h = e.get('httpRequest') or {}
    return {**{k:e.get(k) for k in ['eventDataId','resourceId','operationName','eventTimestamp','submissionTimestamp','status','subStatus','caller','correlationId','operationId']},
            'principal_id':c.get('oid', c.get('http://schemas.microsoft.com/identity/claims/objectidentifier')),
            'client_id':c.get('appid'), 'request_id':p.get('requestId'), 'client_request_id':h.get('clientRequestId')}

def validate_activity(reader, report, out):
    try: events = reader.pages('activity-log', activity_url())
    except ReadFailure as e:
        denied = 'AuthorizationFailed' in e.evidence['stderr'] or '403' in e.evidence['stderr']
        report.update(status='GROUND-AZURE-006_BLOCKED_ACTIVITY_LOG_SCOPE' if denied else 'GROUND-AZURE-006_BLOCKED_ACTIVITY_LOG_API',
                      activity_log_read='DENIED' if denied else 'FAILED',
                      activity_log_scope_result='CURRENT_NARROW_GRANT_INSUFFICIENT_FOR_REQUEST' if denied else 'UNKNOWN',
                      additional_authority_required='HUMAN_DECISION_REQUIRED; no grant or automatic scope expansion' if denied else 'UNKNOWN')
        return False
    events = [sanitized_event(e) for e in events]
    save(out / 'activity-events.json', events)
    candidates = [e for e in events if (e.get('resourceId') or '').lower() == APP.lower()
                  and (e.get('operationName') or {}).get('value','').lower() == 'microsoft.app/containerapps/write']
    report.update(activity_log_read='VERIFIED', activity_log_scope_result='CURRENT_AUTHORITY_READ_SUCCEEDED', azure_write_event=candidates or 'UNKNOWN_NO_MATCHING_EVENT')
    return True

def github_run():
    request = urllib.request.Request('https://api.github.com/repos/shulovm/seiri-ai-frontend/actions/runs/' + DEPLOY_RUN,
        headers={'Authorization':'Bearer ' + os.environ['GH_TOKEN'], 'Accept':'application/vnd.github+json', 'User-Agent':'ground-006-read-validation'})
    with urllib.request.urlopen(request, timeout=60) as response: d = json.load(response)
    return {k:d.get(k) for k in ['id','head_sha','path','event','status','conclusion','run_attempt','created_at','updated_at','html_url']}

def main():
    out = Path('evidence/live-reads'); out.mkdir(parents=True, exist_ok=True)
    r = {'status':'BLOCKED', 'activity_log_read':'UNKNOWN', 'activity_log_scope_result':'UNKNOWN',
         'alert_read_validation':'NOT_RUN', 'log_analytics_validation':'NOT_RUN',
         'github_run':os.environ.get('GITHUB_RUN_ID'), 'known_deployment_run':DEPLOY_RUN,
         'source_commit':SOURCE, 'image_digest':DIGEST, 'source_and_digest_provenance':'accepted 004 checkpoint; live comparison pending',
         'azure_write_event':'UNKNOWN', 'resulting_revision':'UNKNOWN', 'runtime_state':'UNKNOWN', 'integrity_state':'UNKNOWN',
         'deployment_correlation':'UNKNOWN', 'additional_authority_required':'UNKNOWN',
         'azure_mutations':0,'storage_mutations':0, 'worker_unchanged':'UNKNOWN_NOT_YET_READ',
         'github_mutations':'Validation workflow code and dispatch only; no Azure deployment',
         'next_action':'No monitoring changes until correlation proven', 'historical_interrupted_invocation':'UNKNOWN; accepted current RBAC clean'}
    try:
        # Confirm the actual Azure token identity without saving its token or claims.
        p = subprocess.run(['az','account','get-access-token','--resource',ARM+'/', '-o','json'],capture_output=True,text=True,check=True,timeout=60)
        token = json.loads(p.stdout)['accessToken']; part = token.split('.')[1]
        c = json.loads(base64.urlsafe_b64decode(part + '=' * (-len(part) % 4)))
        require(c.get('oid') == PRINCIPAL and c.get('appid',c.get('azp')) == CLIENT, 'exact deploy identity')
        del token, part, c, p
        reader = Reader(out)
        if not validate_activity(reader, r, out): return 1
        alerts = {}
        for kind,names,api in [('scheduledQueryRules',['ground-staging-heartbeat-missing','ground-staging-input-failures','ground-staging-unexpected-state'],'2023-12-01'),('metricAlerts',['ground-staging-no-replica','ground-staging-replica-restart'],'2018-03-01'),('activityLogAlerts',['ground-staging-containerapp-write-review'],'2020-10-01')]:
            for name in names:
                path = ROOT + '/providers/Microsoft.Insights/' + kind + '/' + name
                d = reader.get(name, ARM + path + '?api-version=' + api); save(out/(name+'.json'),d); alerts[name]='READ_VERIFIED'
                if kind == 'metricAlerts':
                    d = reader.get(name+'-status',ARM+path+'/status?api-version='+api);save(out/(name+'-status.json'),d);alerts[name+'-status']='READ_VERIFIED' if d.get('value') else 'UNKNOWN_EMPTY_STATUS'
        for label,scope in [('app',APP),('workspace',WS)]:
            d = reader.pages(label+'-incidents',ARM+scope+'/providers/Microsoft.AlertsManagement/alerts?api-version=2019-03-01')
            save(out/(label+'-incidents.json'),d);alerts[label+'-incidents']='READ_VERIFIED; empty is not proof of health' if not d else 'READ_VERIFIED'
        r['alert_read_validation']=alerts
        baseline = json.loads(approved_baseline_bytes())
        app = reader.get('app',ARM+APP+'?api-version='+POLICY['app_api_version'])
        revs = reader.pages('revisions',ARM+APP+'/revisions?api-version='+POLICY['app_api_version'])
        reps = reader.pages('replicas',ARM+APP+'/revisions/'+REV+'/replicas?api-version='+POLICY['app_api_version'])
        save(out/'runtime.json',{'app':app,'revisions':revs,'replicas':reps})
        require(contract(app)==baseline['contract'],'worker contract mismatch')
        healthy(app,revs,reps,REV,POLICY['registry_server']+'/ground-worker@'+DIGEST)
        require(set(baseline['retained_revisions']) <= {v['name'] for v in revs}, 'retained revisions missing')
        r.update(resulting_revision=REV,runtime_state='HEALTHY: Ready 1 / Running / restart 0')
        query="ContainerAppConsoleLogs_CL | where TimeGenerated > ago(15m) and ContainerAppName_s == 'ground-worker-staging' | extend p=parse_json(Log_s) | project TimeGenerated,RevisionName_s,p | order by TimeGenerated desc"
        url='https://api.loganalytics.azure.com/v1/workspaces/'+POLICY['workspace_customer_id']+'/query?'+urllib.parse.urlencode({'query':query,'timespan':'PT15M'})
        logs=reader.get('console-logs',url,'https://api.loganalytics.io');save(out/'console-logs.json',logs)
        r['log_analytics_validation']='READ_VERIFIED'
        rows=logs['tables'][0]['rows'];require(rows,'empty log window')
        signals=[]
        for time,revision,event in rows:
            e=json.loads(event) if isinstance(event,str) else event
            require(e.get('event') not in ('snapshot_integrity_failed','worker_configuration_rejected'),'failure event in window')
            if e.get('event')!='snapshot_integrity_checked':continue
            require(revision==REV,'unreviewed emitting revision')
            release=next(iter(POLICY['approved_releases']))
            expected={**POLICY['approved_releases'][release],'corpus_release':release,'input_source':'azure-blob','production_input':False,'production_authority':False,'source_authenticity_certified':False}
            require(all(type(e.get(k)) is type(v) and e[k]==v for k,v in expected.items()),'integrity metric/release mismatch')
            signals.append({'time':time,'event':e})
        require(signals,'no integrity events')
        age=(dt.datetime.now(dt.timezone.utc)-dt.datetime.fromisoformat(signals[0]['time'].replace('Z','+00:00'))).total_seconds()
        require(0<=age<300,'integrity not fresh')
        r['integrity_state']={'status':'HEALTHY','latest':signals[0],'age_seconds':age}
        after=reader.get('app-after',ARM+APP+'?api-version='+POLICY['app_api_version'])
        require(after==app,'app changed during read validation');r['worker_unchanged']=True
        run=github_run();save(out/'known-deployment-run.json',run)
        # Historic receipt lacks unique request identifiers. Never infer a full binding from time/caller alone.
        r.update(status='GROUND-AZURE-006_LIVE_READ_AUTHORITY_VERIFIED',additional_authority_required=False,
                 deployment_correlation='UNKNOWN: historic run receipt lacks proven request/correlation-ID binding; candidate write event is not unique run proof',
                 next_action='Review collected historical receipt and Azure identifiers; no observability change or new deployment')
        return 0
    except Exception as e:
        r['error']=str(e);return 1
    finally:
        save(out/'checkpoint.json',r)
        summary=os.environ.get('GITHUB_STEP_SUMMARY')
        if summary:
            with open(summary,'a') as f:f.write('## GROUND 006 live read validation\n\n```json\n'+json.dumps(r,indent=2)+'\n```\n')
        print(json.dumps(r,indent=2))

if __name__=='__main__':raise SystemExit(main())
