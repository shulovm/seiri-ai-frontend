import copy
import datetime as dt
import json
from types import SimpleNamespace
import unittest
from unittest.mock import patch
import ground_staging as g


def fixture():
    uami = g.ROOT + "/providers/Microsoft.ManagedIdentity/userAssignedIdentities/id-ground-worker-staging"
    image = g.POLICY["registry_server"] + "/ground-worker@" + g.POLICY["initial_digest"]
    revision = g.POLICY["initial_revision"]
    app = {"id": g.APP, "location": "japaneast", "identity": {"type": "UserAssigned", "userAssignedIdentities": {uami: {"principalId": "worker"}}},
           "properties": {"latestRevisionName": revision, "latestReadyRevisionName": revision, "provisioningState": "Succeeded",
                          "configuration": {"activeRevisionsMode": "Single", "ingress": None, "registries": [{"server": g.POLICY["registry_server"], "identity": uami}]},
                          "template": {"revisionSuffix": "old", "scale": {"minReplicas": 1, "maxReplicas": 1, "rules": None, "cooldownPeriod": 300, "pollingInterval": 30},
                                       "containers": [{"name": "worker", "image": image, "probes": [{"type": "Readiness", "httpGet": {"path": "/readyz", "port": 8080}}],
                                                       "env": [{"name": "GROUND_WORKER_INPUT_SOURCE", "value": "azure-blob"}, {"name": "GROUND_WORKER_IDENTITY_RESOURCE_ID", "value": uami}]}]}}}
    revs = [{"name": revision, "properties": {"active": True, "healthState": "Healthy", "provisioningState": "Provisioned", "template": app["properties"]["template"]}}]
    reps = [{"properties": {"containers": [{"ready": True, "runningState": "Running", "restartCount": 0}]}}]
    return app, revs, reps, revision, image


class Guards(unittest.TestCase):
    def test_only_exact_source_baseline_failure_is_admitted(self):
        text = (g.HERE / "core-baseline-failure-report.txt").read_text()
        result = g.classify_core_result(text, 1, g.POLICY["initial_source"])
        self.assertEqual(result["classification"], "PRE_EXISTING_KNOWN_FAILURE")
        self.assertEqual(result["raw_exit_code"], 1)
        variants = [text.replace("unapproved candidate path set", "different assertion failure"),
                    text.replace("ℹ fail 2", "ℹ fail 3"),
                    text.replace("ℹ skipped 0", "ℹ skipped 1"),
                    text.replace("ℹ pass 4108", "ℹ pass 4107")]
        for variant in variants:
            with self.assertRaises(RuntimeError):
                g.classify_core_result(variant, 1, g.POLICY["initial_source"])
        with self.assertRaises(RuntimeError):
            g.classify_core_result(text, 1, "a" * 40)
        with self.assertRaises(RuntimeError):
            g.classify_core_result(text, 2, g.POLICY["initial_source"])

    def test_artifact_cannot_verify_one_digest_and_deploy_another(self):
        digest = "sha256:" + "a" * 64
        image = g.POLICY["registry_server"] + "/ground-worker@" + digest
        g.verify_image_binding({"digest": digest, "image": image})
        with self.assertRaisesRegex(RuntimeError, "image/digest binding"):
            g.verify_image_binding({"digest": "sha256:" + "b" * 64, "image": image})

    def test_good_health(self):
        g.healthy(*fixture())

    def test_replica_count_is_not_readiness(self):
        args = fixture()
        args[2][0]["properties"]["containers"][0]["ready"] = False
        with self.assertRaisesRegex(RuntimeError, "ready/running"):
            g.healthy(*args)

    def test_restart_stops(self):
        args = fixture()
        args[2][0]["properties"]["containers"][0]["restartCount"] = 1
        with self.assertRaises(RuntimeError):
            g.healthy(*args)

    def test_missing_old_revision_not_healthy(self):
        args = list(fixture())
        args[1] = []
        with self.assertRaises(RuntimeError):
            g.healthy(*args)

    def test_digest_cannot_be_mutable_tag(self):
        app, _, _, _, _ = fixture()
        with self.assertRaisesRegex(RuntimeError, "immutable image"):
            g.deployment_body(app, g.POLICY["registry_server"] + "/ground-worker:latest", "ci-e23ff04-123-1")

    def test_patch_excludes_get_defaults_and_preserves_probes(self):
        app, _, _, _, image = fixture()
        original = copy.deepcopy(app)
        body = g.deployment_body(app, image, "ci-e23ff04-123-1")
        text = json.dumps(body)
        self.assertNotIn("cooldownPeriod", text)
        self.assertNotIn("pollingInterval", text)
        self.assertEqual(set(body["properties"]), {"template"})
        self.assertEqual(app, original)
        self.assertEqual(body["properties"]["template"]["containers"][0]["probes"], app["properties"]["template"]["containers"][0]["probes"])

    def test_new_template_field_requires_review(self):
        app, _, _, _, image = fixture()
        app["properties"]["template"]["newAuthority"] = True
        with self.assertRaisesRegex(RuntimeError, "unreviewed template"):
            g.deployment_body(app, image, "ci-e23ff04-123-1")

    def test_config_comparison_only_exempts_rollout_image_and_suffix(self):
        app, _, _, _, _ = fixture()
        new = copy.deepcopy(app)
        new["properties"]["template"]["containers"][0]["image"] = "new"
        new["properties"]["template"]["revisionSuffix"] = "new"
        self.assertEqual(g.contract(app), g.contract(new))
        new["properties"]["configuration"]["ingress"] = {"external": True}
        self.assertNotEqual(g.contract(app), g.contract(new))

    def test_embedded_input_forbidden(self):
        app, _, _, _, _ = fixture()
        app["properties"]["template"]["containers"][0]["env"][0]["value"] = "embedded"
        with self.assertRaisesRegex(RuntimeError, "azure-blob"):
            g.static_gates(app)

    def log_result(self, override=None, failure_count=0):
        release = next(iter(g.POLICY["approved_releases"]))
        p = {**g.POLICY["approved_releases"][release], "event": "snapshot_integrity_checked", "input_source": "azure-blob", "corpus_release": release,
             "production_input": False, "production_authority": False, "source_authenticity_certified": False}
        p.update(override or {})
        rows = [[g.now(), p, failure_count], [g.now(), p, failure_count]]
        return release, SimpleNamespace(stdout=json.dumps({"tables": [{"rows": rows}]}))

    def test_exact_integrity(self):
        release, response = self.log_result()
        with patch.object(g, "az", return_value=response):
            g.integrity(g.POLICY["initial_revision"], release, g.now())

    def test_authority_true_and_string_false_both_rejected(self):
        for value in (True, "false", 0):
            release, response = self.log_result({"production_authority": value})
            with patch.object(g, "az", return_value=response), self.assertRaisesRegex(RuntimeError, "production_authority"):
                g.integrity(g.POLICY["initial_revision"], release, g.now())

    def test_failure_cannot_be_hidden_by_later_success(self):
        release, response = self.log_result(failure_count=1)
        with patch.object(g, "az", return_value=response), self.assertRaisesRegex(RuntimeError, "runtime integrity failure"):
            g.integrity(g.POLICY["initial_revision"], release, g.now())

    def test_wrong_metric_stops(self):
        release, response = self.log_result({"claims": 188})
        with patch.object(g, "az", return_value=response), self.assertRaisesRegex(RuntimeError, "claims"):
            g.integrity(g.POLICY["initial_revision"], release, g.now())


if __name__ == "__main__":
    unittest.main()

class ImmutableBaselines(unittest.TestCase):
    def test_verified_successor_preserves_original_configuration_and_lineage(self):
        from ground_staging import approved_baseline_bytes, HERE, POLICY
        import hashlib,json
        raw=approved_baseline_bytes();current=json.loads(raw)
        lineage=json.loads((HERE / "baselines" / (POLICY["current_baseline_sha256"]+".lineage.json")).read_text())
        parent_raw=(HERE / "baselines" / (lineage["parent_baseline_sha256"]+".json")).read_bytes()
        self.assertEqual(hashlib.sha256(parent_raw).hexdigest(),lineage["parent_baseline_sha256"])
        self.assertEqual(hashlib.sha256(raw).hexdigest(),lineage["successor_baseline_sha256"])
        parent=json.loads(parent_raw)
        self.assertEqual(parent["contract"],current["contract"])
        self.assertEqual(parent["worker_roles"],current["worker_roles"])
        self.assertTrue(set(parent["retained_revisions"])<=set(current["retained_revisions"]))
        self.assertNotEqual(parent["revision"],current["revision"])
