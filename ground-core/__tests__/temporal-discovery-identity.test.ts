import test from "node:test";
import assert from "node:assert/strict";
import { createEmptyProject } from "../state-engine.js";
import { formulateInquiryAt, formulateInquiryFromGapAssessment, formulateUnresolvedSubjectInquiries } from "../reality/inquiry.js";
import { deriveObservationNeedsForInquiry } from "../reality/observation-need.js";
import { assessEpistemicGapsAt } from "../reality/epistemic-gaps.js";
import { assessSituationDiscoveries } from "../reality/discovery.js";
import { assessNormativeDiscovery } from "../reality/normative-discovery.js";
import { TemporalResolutionError } from "../temporal.js";
import type { EpistemicGapKind } from "../reality/epistemic-gap-types.js";
const utc = "2026-09-05T00:00:00.123456789123456789Z";
const offset = "2026-09-05T09:00:00.123456789123456789+09:00";
const id = "e1010101-0101-4101-8101-010101010101";
const p = createEmptyProject({ title: "Temporal discovery identity", summary: "" });
p.reality_entities.push({ id, project_id: p.project.id, kind: "asset", label: "asset", created_at: utc, updated_at: utc });
const query = (at: string) => ({ subjectId: id, predicateKind: "state" as const, predicate: "condition", at });

for (const kind of ["NO_APPLICABLE_CLAIMS", "TEMPORAL_COVERAGE_GAP", "CONTESTED_POSITIONS", "NO_LINKED_EVIDENCE", "EVIDENCE_TENSION"] as EpistemicGapKind[]) {
  test(`Inquiry and ObservationNeed instant identity across ${kind}`, () => {
    const derive = (at: string) => {
      const gaps = assessEpistemicGapsAt(p, query(at));
      // Explicit canonical gap input isolates each mapping branch from discovery policy.
      gaps.gaps = [{ kind, subject_id: id, predicate_kind: "state", predicate: "condition", at, claim_ids: [id], evidence_ids: [id], details: { position_value_keys: ['"A"', '"B"'] } }];
      gaps.has_gaps = true;
      const inquiry = formulateInquiryFromGapAssessment(gaps)!;
      return { inquiry, needs: deriveObservationNeedsForInquiry(inquiry) };
    };
    const a = derive(utc), b = derive(offset);
    assert.equal(a.inquiry.key, b.inquiry.key);
    assert.deepEqual(a.inquiry.questions.map(q => q.key), b.inquiry.questions.map(q => q.key));
    assert.deepEqual(a.needs.map(n => n.key), b.needs.map(n => n.key));
    assert.equal(b.inquiry.questions[0]!.at, offset);
    assert.notEqual(a.inquiry.key, derive("2026-09-05T00:00:00.123456789123456788Z").inquiry.key);
  });
}

test("ObservationNeed merging uses instant scope and retains representative declaration", () => {
  const a = formulateInquiryAt(p, query(utc))!, b = formulateInquiryAt(p, query(offset))!;
  const needs = deriveObservationNeedsForInquiry({ ...a, questions: [...a.questions, ...b.questions] });
  assert.equal(needs.length, 1);
  assert.deepEqual(needs[0]!.temporal_scope, { kind: "POINT", at: utc });
  const unresolved = structuredClone(a);
  unresolved.questions[0]!.at = "2026-09-05T23:59:60Z";
  assert.throws(() => deriveObservationNeedsForInquiry(unresolved), TemporalResolutionError);
});

test("Structural Finding identity remains equal across equivalent query instants", () => {
  const derive = (at: string) => assessSituationDiscoveries(p, { subjectId: id, at, predicateScopes: [{ predicateKind: "state", predicate: "condition" }] });
  const a = derive(utc), b = derive(offset);
  assert.ok(a.findings.length > 0);
  assert.deepEqual(a.findings.map(f => f.key), b.findings.map(f => f.key));
  assert.equal(b.at, offset);
});

test("Normative Finding identity remains equal across equivalent query instants", () => {
  const state = structuredClone(p);
  state.reference_conditions.push({ id, project_id: p.project.id, subject_id: id, state_kind: "condition", reference_kind: "EXPECTED", criterion: { kind: "EQUALS", value: "normal" }, valid_from: "2026-09-04T00:00:00Z", valid_until: null, declared_by: { kind: "human" }, recorded_at: utc, created_at: utc, updated_at: utc });
  const a = assessNormativeDiscovery(state, id, utc), b = assessNormativeDiscovery(state, id, offset);
  assert.ok(a.findings.length > 0);
  assert.deepEqual(a.findings.map(f => f.key), b.findings.map(f => f.key));
  assert.equal(b.at, offset);
});

test("Unresolved-subject Inquiry retains source time but normalizes instant identity", () => {
  const state = structuredClone(p);
  state.claims.push({ id, project_id: p.project.id, subject_id: null, predicate_kind: "state", predicate: "condition", value: "normal", provenance: { kind: "human" }, confidence: 0.5, applicable_from: null, applicable_until: null, recorded_at: utc, created_at: utc, updated_at: utc });
  const a = formulateUnresolvedSubjectInquiries(state, utc), b = formulateUnresolvedSubjectInquiries(state, offset);
  assert.equal(a.length, 1);
  assert.equal(a[0]!.key, b[0]!.key);
  assert.equal(b[0]!.questions[0]!.at, offset);
});
