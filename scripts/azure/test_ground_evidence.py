import hashlib
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import urllib.error
from ground_evidence import (prepare, publish, verify_remote, EntraBlockBlobStore,
                             GateError, NoRedirect, sha)

class MemoryStore:
    def __init__(self, values=None):
        self.values = dict(values or {})
        self.writes = []
        self.types = {}
    def list(self, prefix):
        return [n for n in self.values if n.startswith(prefix)]
    def get(self, name):
        return self.values[name], self.types.get(name, 'BlockBlob')
    def create(self, name, data):
        if name in self.values:
            raise GateError('412 collision')
        self.writes.append(name)
        self.values[name] = data

class ProtocolTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root/'a.json').write_bytes(b'{"a":1}\n')
        self.raw = (json.dumps([{'path':'a.json', 'sha256':sha(b'{"a":1}\n')}],indent=2)+'\n').encode()
        self.release = prepare(self.root, self.raw, sha(self.raw))
    def test_deterministic_format(self):
        self.assertEqual(self.release, prepare(self.root,self.raw,sha(self.raw)))
        self.assertEqual(self.release.objects[-1][1], self.raw)
    def test_new_manifest_last_and_all_bytes_readback(self):
        store, journal = MemoryStore(), []
        result = publish(store, self.release, journal.append)
        self.assertEqual(result['status'],'PUBLISHED_BYTE_VERIFIED')
        self.assertFalse(result['promotion'])
        self.assertEqual(store.writes[-1],self.release.prefix+'manifest.json')
        self.assertEqual(len(result['receipts']),2)
        self.assertEqual(len(journal),2)
    def test_identical_zero_writes(self):
        store = MemoryStore(self.release.mapping())
        result = publish(store,self.release,lambda _: self.fail('journal write'))
        self.assertEqual(result['status'],'ALREADY_PUBLISHED')
        self.assertEqual(store.writes,[])
    def test_existing_different_fails_without_write(self):
        store = MemoryStore(self.release.mapping())
        store.values[self.release.objects[0][0]] = b'changed'
        with self.assertRaises(GateError): publish(store,self.release,lambda _: None)
        self.assertEqual(store.writes,[])
    def test_partial_fails_without_repair(self):
        store = MemoryStore(self.release.objects[:1])
        with self.assertRaises(GateError): publish(store,self.release,lambda _: None)
        self.assertEqual(store.writes,[])
    def test_extra_fails(self):
        store = MemoryStore(self.release.mapping())
        store.values[self.release.prefix+'extra'] = b'extra'
        with self.assertRaises(GateError): publish(store,self.release,lambda _: None)
        self.assertEqual(store.writes,[])
    def test_append_blob_rejected(self):
        store=MemoryStore(self.release.mapping())
        store.types[self.release.objects[0][0]]='AppendBlob'
        with self.assertRaises(GateError): publish(store,self.release,lambda _: None)
    def test_race_collision_no_retry(self):
        store=MemoryStore()
        def collision(name,data):
            store.writes.append(name)
            raise GateError('412 concurrent create')
        store.create=collision
        with self.assertRaises(GateError): publish(store,self.release,lambda _: None)
        self.assertEqual(len(store.writes),1)
    def test_ambiguous_create_stops_keeps_evidence(self):
        store, journal = MemoryStore(), []
        def uncertain(name,data):
            store.values[name]=data
            raise TimeoutError('response lost')
        store.create=uncertain
        with self.assertRaises(TimeoutError): publish(store,self.release,journal.append)
        self.assertEqual(len(journal),1)
        self.assertEqual(len(store.values),1)
        self.assertNotIn(self.release.prefix+'manifest.json',store.values)
    def test_readback_corruption_stops_before_manifest(self):
        store=MemoryStore()
        store.get=lambda name:(b'corrupt','BlockBlob')
        with self.assertRaises(GateError): publish(store,self.release,lambda _:None)
        self.assertEqual(len(store.writes),1)
    def test_listing_failure_not_absent(self):
        store=MemoryStore()
        def forbidden(prefix): raise PermissionError('403')
        store.list=forbidden
        with self.assertRaises(PermissionError): publish(store,self.release,lambda _:None)
        self.assertEqual(store.writes,[])
    def test_source_changed_no_fallback(self):
        (self.root/'a.json').write_bytes(b'changed')
        with self.assertRaises(GateError): prepare(self.root,self.raw,sha(self.raw))
    def test_wrong_release(self):
        with self.assertRaises(GateError): prepare(self.root,self.raw,'0'*64)
    def test_duplicate_pin(self):
        raw=(json.dumps(json.loads(self.raw)*2,indent=2)+'\n').encode()
        with self.assertRaises(GateError): prepare(self.root,raw,sha(raw))
    def test_path_escape(self):
        for name in ('../a','/a','a/../b','a\\b','a//b'):
            raw=(json.dumps([{'path':name,'sha256':'0'*64}],indent=2)+'\n').encode()
            with self.subTest(name=name),self.assertRaises(GateError): prepare(self.root,raw,sha(raw))
    def test_symlink(self):
        (self.root/'a.json').unlink()
        (self.root/'a.json').symlink_to('/etc/hosts')
        with self.assertRaises(GateError): prepare(self.root,self.raw,sha(self.raw))
    def test_no_format_silent_normalization(self):
        raw=json.dumps(json.loads(self.raw)).encode()
        with self.assertRaises(GateError): prepare(self.root,raw,sha(raw))
    def test_size_bound(self):
        with patch('ground_evidence.MAX_BLOB',1),self.assertRaises(GateError):
            prepare(self.root,self.raw,sha(self.raw))

class Response:
    def __init__(self,data=b'',status=200,headers=None):
        self.data,self.status,self.headers=data,status,headers or {}
    def __enter__(self): return self
    def __exit__(self,*args): pass
    def read(self,n): return self.data[:n]
class Opener:
    def __init__(self,responses): self.responses=list(responses);self.requests=[]
    def open(self,req,timeout):
        self.requests.append(req)
        response=self.responses.pop(0)
        if isinstance(response,Exception): raise response
        return response
class TransportTests(unittest.TestCase):
    prefix='historical-round6-staging/sha256-'+'a'*64+'/'
    def test_single_put_add_only_headers(self):
        opener=Opener([Response(status=201)])
        EntraBlockBlobStore('token',opener).create(self.prefix+'manifest.json',b'[]')
        req=opener.requests[0]
        self.assertEqual(req.method,'PUT')
        headers={k.lower():v for k,v in req.header_items()}
        self.assertEqual(headers['if-none-match'],'*')
        self.assertEqual(headers['x-ms-blob-type'],'BlockBlob')
        self.assertEqual(headers['authorization'],'Bearer token')
        self.assertNotIn('?',req.full_url)
    def test_no_delete_or_multipart(self):
        store=EntraBlockBlobStore('token',Opener([]))
        with self.assertRaises(GateError): store._request('DELETE',self.prefix+'x')
        with self.assertRaises(GateError): store._request('PUT',self.prefix+'x',query={'comp':'blocklist'},data=b'')
    def test_complete_pagination(self):
        first=f'<EnumerationResults><Blobs><Blob><Name>{self.prefix}x</Name></Blob></Blobs><NextMarker>next</NextMarker></EnumerationResults>'.encode()
        last=b'<EnumerationResults><Blobs/><NextMarker/></EnumerationResults>'
        opener=Opener([Response(first),Response(last)])
        self.assertEqual(EntraBlockBlobStore('token',opener).list(self.prefix),[self.prefix+'x'])
        self.assertIn('marker=next',opener.requests[1].full_url)
    def test_incomplete_list_rejected(self):
        store=EntraBlockBlobStore('token',Opener([Response(b'<EnumerationResults><Blobs/></EnumerationResults>')]))
        with self.assertRaises(GateError): store.list(self.prefix)
    def test_http_failure_propagates_no_retry(self):
        error=urllib.error.HTTPError('url',403,'Forbidden',{},None)
        opener=Opener([error])
        with self.assertRaises(urllib.error.HTTPError): EntraBlockBlobStore('token',opener).list(self.prefix)
        self.assertEqual(len(opener.requests),1)
    def test_redirect_rejected(self):
        with self.assertRaises(GateError): NoRedirect().redirect_request(None,None,307,'',{},'https://other/')


class AuthorityDesignTests(unittest.TestCase):
    def test_publisher_exact_actions_and_scope(self):
        base=Path(__file__).parent
        role=json.loads((base/'evidence-publisher/role-definition.json').read_text())
        plan=json.loads((base/'evidence-publisher/pipeline-design.json').read_text())
        prefix='Microsoft.Storage/storageAccounts/blobServices/containers/blobs/'
        self.assertEqual(role['Actions'],[])
        self.assertEqual(set(role['DataActions']),{prefix+'read',prefix+'add/action'})
        self.assertTrue(plan['assignment_scope'].endswith('/blobServices/default/containers/ground-evidence-staging'))
        self.assertFalse(plan['publish_vs_promote']['automatic_promotion'])
    def test_verified_worker_baseline_reader_only(self):
        base=Path(__file__).parent
        digest='a8f2c0294d1546ebc43b80ef0624112b8a5f3b504925d141f9a1cb9e88e870d2'
        raw=(base/'baselines'/f'{digest}.json').read_bytes()
        self.assertEqual(sha(raw),digest)
        baseline=json.loads(raw)
        self.assertEqual({r['roleDefinitionId'].split('/')[-1] for r in baseline['worker_roles']},
                         {'2a2b9908-6ea1-4ae2-8e65-a410df84e7d1','b93aa761-3e63-49ed-ac28-beffa264f7ac'})
        self.assertTrue(all(r['principalId']==baseline['worker_principal_id'] for r in baseline['worker_roles']))


class WorkflowGateTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        import importlib.util
        p=Path(__file__).parent/'ground-evidence-run.py'
        spec=importlib.util.spec_from_file_location('publisher_entry',p)
        cls.entry=importlib.util.module_from_spec(spec);spec.loader.exec_module(cls.entry)
    def test_validation_release_deterministic_and_isolated(self):
        with tempfile.TemporaryDirectory() as a,tempfile.TemporaryDirectory() as b:
            first=self.entry.validation_release(Path(a));second=self.entry.validation_release(Path(b))
            self.assertEqual(first,second)
            self.assertTrue(first.prefix.startswith('ground-005-publisher-validation/'))
            self.assertEqual(len(first.objects),2)
            store=MemoryStore();self.assertEqual(publish(store,first,lambda _:None)['status'],'PUBLISHED_BYTE_VERIFIED')
            self.assertEqual(publish(store,first,lambda _:self.fail('unexpected write'))['status'],'ALREADY_PUBLISHED')
    def test_negative_tests_reject_real_evidence(self):
        from ground_evidence import Release
        real=Release('a'*64,'historical-round6-staging/sha256-'+'a'*64+'/',())
        with self.assertRaises(GateError): self.entry.negative_canary('token',real)
    def test_negative_requests_cannot_modify_canary_on_permission_drift(self):
        from ground_evidence import Release
        canary=Release('a'*64,'ground-005-publisher-validation/sha256-'+'a'*64+'/',())
        errors=[urllib.error.HTTPError('url',403,'Forbidden',{'x-ms-error-code':'AuthorizationPermissionMismatch'},None) for _ in range(2)]
        opener=Opener(errors)
        with patch.object(self.entry.urllib.request,'build_opener',return_value=opener):
            self.assertEqual(set(self.entry.negative_canary('token',canary)),{'PUT','DELETE'})
        for req in opener.requests:
            h={k.lower():v for k,v in req.header_items()}
            self.assertTrue(h['if-match'].startswith('"ground-impossible-'))
            self.assertIn('/ground-005-publisher-validation/',req.full_url)
    def test_condition_failure_is_not_authority_denial(self):
        from ground_evidence import Release
        canary=Release('a'*64,'ground-005-publisher-validation/sha256-'+'a'*64+'/',())
        opener=Opener([urllib.error.HTTPError('url',412,'condition mismatch',{},None)])
        with patch.object(self.entry.urllib.request,'build_opener',return_value=opener),self.assertRaises(GateError):
            self.entry.negative_canary('token',canary)
    def test_verify_validation_never_publishes_or_probes(self):
        import sys
        from contextlib import ExitStack
        with ExitStack() as stack:
            stack.enter_context(patch.object(sys,'argv',['publisher','verify-validation']))
            stack.enter_context(patch.object(self.entry,'validate_bundle',return_value=object()))
            stack.enter_context(patch.object(self.entry,'token_gate',return_value='test-token'))
            read=stack.enter_context(patch.object(self.entry,'verify_remote',return_value=[]))
            write=stack.enter_context(patch.object(self.entry,'publish',side_effect=AssertionError('write forbidden')))
            probe=stack.enter_context(patch.object(self.entry,'negative_canary',side_effect=AssertionError('probe forbidden')))
            saved=stack.enter_context(patch.object(self.entry,'save'))
            self.entry.main()
            self.assertEqual(read.call_count,2)
            write.assert_not_called();probe.assert_not_called()
            report=saved.call_args.args[1]
            self.assertEqual(report['status'],'RETAINED_VALIDATION_BYTE_VERIFIED')
            self.assertEqual(report['blob_mutations'],0)
            self.assertEqual(report['write_attempts'],[])
    def test_missing_identity_binding_fails_closed(self):
        with patch.object(self.entry,'CONFIG',{'status':'NOT_CREATED'}),self.assertRaises(GateError):self.entry.binding()

if __name__=='__main__': unittest.main()
