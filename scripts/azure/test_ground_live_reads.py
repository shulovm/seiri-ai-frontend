import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import Mock
import ground_live_reads as g

class Tests(unittest.TestCase):
    def test_denial_is_fail_closed(self):
        reader=Mock();reader.pages.side_effect=g.ReadFailure({'stderr':'ERROR: (AuthorizationFailed) missing eventtypes/values/Read at scope /subscriptions/example','stdout':'','exit_code':1})
        r={}
        with tempfile.TemporaryDirectory() as d:self.assertFalse(g.validate_activity(reader,r,Path(d)))
        self.assertEqual(r['status'],'GROUND-AZURE-006_BLOCKED_ACTIVITY_LOG_SCOPE')
        self.assertEqual(reader.pages.call_count,1);reader.get.assert_not_called()
    def test_no_event_is_not_correlation(self):
        reader=Mock();reader.pages.return_value=[];r={'deployment_correlation':'UNKNOWN'}
        with tempfile.TemporaryDirectory() as d:self.assertTrue(g.validate_activity(reader,r,Path(d)))
        self.assertEqual(r['azure_write_event'],'UNKNOWN_NO_MATCHING_EVENT')
        self.assertEqual(r['deployment_correlation'],'UNKNOWN')
    def test_transport_error_is_not_scope_evidence(self):
        reader=Mock();reader.pages.side_effect=g.ReadFailure({'stderr':'connection timed out','stdout':'','exit_code':1});r={}
        with tempfile.TemporaryDirectory() as d:self.assertFalse(g.validate_activity(reader,r,Path(d)))
        self.assertEqual(r['activity_log_scope_result'],'UNKNOWN')
    def test_token_claims_are_not_artifact(self):
        e=g.sanitized_event({'claims':{'oid':'expected','secret':'do-not-save'},'httpRequest':{'clientRequestId':'id','headers':{'Authorization':'secret'}},'properties':{'requestId':'rid','private':'secret'}})
        self.assertNotIn('secret',json.dumps(e));self.assertEqual(e['principal_id'],'expected')

if __name__=='__main__':unittest.main()
