import test from "node:test";
import assert from "node:assert/strict";
import { compareTemporalInstants, temporalInstantKey, resolveTemporalInstant, TemporalResolutionError } from "../temporal.js";
import { ValidationError, NotFoundError } from "../errors.js";
import { createEmptyProject } from "../state-engine.js";
import { validateProjectState } from "../validate.js";
import { isRealityStateActiveAt, getRealityStatesAt, getRealityWorldline, detectRealityStateConflicts } from "../reality/worldline.js";
import { assessCurrentStateAt } from "../reality/reference-state.js";
import { contributionAvailabilityContextKey, contributionAvailabilityContext, buildAvailabilityEvidenceContract } from "../reality/contribution-availability-applicability-core.js";
import { composeContributionQuantityAvailabilityEvidence } from "../reality/contribution-availability-composition-core.js";
import { declareContributionRequiredEvidence, assessContributionRequiredEvidence } from "../reality/contribution-required-evidence-core.js";
import { quantity, declare, currentAvailability } from "./fixtures/contribution-availability.js";
import { resourceReservationWindowKey } from "../reality/resource-reservation-core.js";
import { doReservationWindowsOverlap } from "../reality/resource-reservation-contention-core.js";
import { interventionCommitmentSemanticKey } from "../reality/commitment-core.js";
import { commitmentTemporalTermSemanticKey } from "../reality/commitment-temporal-term-core.js";
import { assertAuthorityEvaluationAt } from "../reality/attention-observation-operational-eligibility-authority-evaluation-instant-core.js";
const utc = "2026-09-05T00:30:00.000Z";
function fixture() {
  const p = createEmptyProject({ title: "Temporal test", summary: "in-memory" });
  const entity = { id: "c1010101-0101-4101-8101-010101010101", project_id: p.project.id, kind: "asset", label: "test", created_at: utc, updated_at: utc };
  p.reality_entities.push(entity);
  const s = { id: "c3030303-0303-4303-8303-030303030301", project_id: p.project.id, subject_id: entity.id, kind: "condition", value: "normal", valid_from: "2026-09-05T09:00:00+09:00", valid_until: "2026-09-05T10:00:00+09:00" as string | null, recorded_at: utc, created_at: utc, updated_at: utc };
  p.reality_states.push(s);
  return { p, s, id: entity.id };
}
for (const [a, b] of [
  ["2026-09-05T09:30:00+09:00", utc],
  ["2026-09-04T19:30:00-05:00", utc],
  ["2026-09-05T00:30:00.5Z", "2026-09-05T00:30:00.500000000000000000Z"],
  ["2024-03-01T00:30:00+01:00", "2024-02-29T23:30:00Z"],
  ["2025-03-01T00:30:00+01:00", "2025-02-28T23:30:00Z"],
  ["2026-01-01T00:30:00+01:00", "2025-12-31T23:30:00Z"],
  ["2025-12-31T23:30:00-01:00", "2026-01-01T00:30:00Z"],
  ["2026-09-05t00:30:00z", utc],
  ["2026-09-05 09:30:00+0900", utc],
]) test(`exact equivalent instants: ${a}`, () => {
  assert.equal(compareTemporalInstants(a, b), 0);
  assert.equal(temporalInstantKey(a), temporalInstantKey(b));
  const resolved = resolveTemporalInstant(a);
  assert.equal(resolved.status, "RESOLVED");
  assert.equal(resolved.declaration, a);
});
test("arbitrary schema-supported fractions retain distinct identity and exact order", () => {
  const a = "2026-09-05T00:00:00.123456789123456788Z", b = "2026-09-05T00:00:00.123456789123456789Z";
  const { p } = fixture();
  for (const value of [a,b]) { p.project.created_at = value; assert.equal(validateProjectState(p).valid, true); }
  assert.equal(compareTemporalInstants(a,b), -1);
  assert.notEqual(temporalInstantKey(a), temporalInstantKey(b));
  assert.equal(temporalInstantKey(a), a);
  assert.equal(assertAuthorityEvaluationAt(b), b);
  assert.equal(compareTemporalInstants("2026-09-05T00:00:00.09Z", "2026-09-05T00:00:00.1Z"), -1);
});
for (const value of ["2026-09-05T23:59:60Z", "2026-09-05T23:59:60.5Z", "2026-09-06T08:59:60+09:00"]) {
  test(`schema accepted leap declaration has no instant or fallback: ${value}`, () => {
    const { p, s } = fixture(); s.valid_from = value; s.valid_until = null;
    assert.equal(validateProjectState(p).valid, true);
    assert.deepEqual(resolveTemporalInstant(value), { status: "UNRESOLVED", declaration: value, reason: "LEAP_SECOND_AUTHORITY_NOT_AVAILABLE" });
    assert.throws(() => temporalInstantKey(value), TemporalResolutionError);
    assert.throws(() => compareTemporalInstants(value,value), TemporalResolutionError);
    assert.equal(s.valid_from, value);
  });
}
test("invalid syntax differs from temporal authority absence", () => {
  assert.equal(resolveTemporalInstant("not-time").status, "INVALID");
  assert.throws(() => temporalInstantKey("not-time"), ValidationError);
});
test("Worldline ordinary offset interval preserves boolean and half-open semantics", () => {
  const { s, p, id } = fixture();
  assert.equal(isRealityStateActiveAt(s,utc), true);
  assert.equal(isRealityStateActiveAt(s,"2026-09-05T00:00:00Z"), true);
  assert.equal(isRealityStateActiveAt(s,"2026-09-05T01:00:00Z"), false);
  assert.equal(isRealityStateActiveAt(s,"2026-09-04T23:59:59.999999999999999999Z"), false);
  assert.deepEqual(getRealityStatesAt(p,id,utc), [s]);
  assert.equal(assessCurrentStateAt(p,id,"condition",utc).status, "SINGLE_VALUE");
  assert.equal(isRealityStateActiveAt({ ...s, valid_from: "2026-09-05T00:00:00Z", valid_until: "2026-09-05T01:00:00Z" },utc), true);
});
for (const field of ["evaluation_at", "valid_from", "valid_until"] as const) test(`Worldline required ${field} non-resolution aborts without a verdict`, () => {
  const { p,s,id } = fixture(); const leap="2026-09-05T23:59:60Z";
  let at=utc;
  if(field === "evaluation_at") at=leap; else s[field]=leap;
  const before=JSON.stringify(p);
  assert.throws(() => isRealityStateActiveAt(s,at), (e: unknown) => {
    assert.ok(e instanceof TemporalResolutionError);
    assert.ok(!(e instanceof NotFoundError));
    assert.equal(e.declaration,leap);
    assert.equal(e.reason,"LEAP_SECOND_AUTHORITY_NOT_AVAILABLE");
    assert.ok(e.operation.includes("Worldline")); return true;
  });
  assert.throws(() => getRealityStatesAt(p,id,at),TemporalResolutionError);
  assert.throws(() => assessCurrentStateAt(p,id,"condition",at),TemporalResolutionError);
  assert.equal(JSON.stringify(p),before);
});
test("collection cannot masquerade as complete when a required State is unresolved", () => {
  const { p,s,id }=fixture(); p.reality_states.push({ ...s,id:"c3030303-0303-4303-8303-030303030302",valid_from:"2026-09-05T23:59:60Z" });
  assert.throws(() => getRealityStatesAt(p,id,utc),TemporalResolutionError);
  p.reality_states=[];
  assert.throws(() => getRealityStatesAt(p,id,"2026-09-05T23:59:60Z"),TemporalResolutionError);
});
test("resolution is lazy with respect to unrelated declarations and unused upper bound", () => {
  const { p,s,id }=fixture(); p.project.created_at="2026-09-05T23:59:60Z";
  s.valid_until="2026-09-05T23:59:60Z";
  assert.equal(isRealityStateActiveAt(s,"2026-09-04T00:00:00Z"),false);
  s.valid_until="2026-09-05T01:00:00Z";
  assert.deepEqual(getRealityStatesAt(p,id,utc),[s]);
});
test("timeline ordering and overlap use instants while preserving source text", () => {
  const { p,s,id }=fixture(); p.reality_states.push({ ...s,id:"c3030303-0303-4303-8303-030303030302",valid_from:"2026-09-05T00:15:00Z",value:"other" });
  assert.equal(detectRealityStateConflicts(p,id).length,1);
  const worldline=getRealityWorldline(p,id);
  assert.equal(worldline.ordered_entries[0]!.time,s.valid_from);
  assert.equal(worldline.temporal_summary.earliest_time,s.valid_from);
});
test("equivalent temporal contexts preserve Applicability and required-evidence coverage", () => {
  const q=quantity(), equivalent={...q,evaluation_at:"2026-09-02T21:00:00+09:00"};
  assert.equal(contributionAvailabilityContextKey(contributionAvailabilityContext(q)),contributionAvailabilityContextKey(contributionAvailabilityContext(equivalent)));
  const current=currentAvailability({evaluationAt:equivalent.evaluation_at});
  const contract=buildAvailabilityEvidenceContract(current.policy!);
  const a=declare(q,contract), b=declare(equivalent,contract);
  assert.equal(a.key,b.key);
  assert.equal(b.contribution_context.evaluation_at,equivalent.evaluation_at);
  const c=composeContributionQuantityAvailabilityEvidence({quantity_evaluation_state:equivalent,applicability_declaration:a,current_availability_evidence_state_set:current.states});
  assert.ok(c.composition);
  const binding={key:"binding",candidate_key:"candidate",observation_need_key:"need",capability_requirement_set_key:"requirements",observation_resource_requirement_key:"requirement",resource_declaration_id:"r"};
  const declaration=declareContributionRequiredEvidence({binding,specification:{binding_key:"binding",required_dimensions:["CAPACITY_COMPATIBILITY","REQUIRED_AMOUNT_COMPATIBILITY","AVAILABILITY_EVIDENCE"]}});
  const result=assessContributionRequiredEvidence({declaration,contribution_context:contributionAvailabilityContext(q),availability_evidence_contract:contract,quantity_evaluation_state:equivalent,availability_reference_assessment:c.availability_reference_assessment});
  assert.equal(result.summary.represented_count,3);
  assert.equal(result.declaration,declaration);
  assert.equal(equivalent.evaluation_at,"2026-09-02T21:00:00+09:00");
});
test("different instants remain different contexts; unresolved instants cannot form context identity", () => {
  const q=quantity();
  assert.notEqual(contributionAvailabilityContextKey(q),contributionAvailabilityContextKey({...q,evaluation_at:"2026-09-02T12:00:00.000000000000000001Z"}));
  assert.throws(() => contributionAvailabilityContextKey({...q,evaluation_at:"2026-09-05T23:59:60Z"}),TemporalResolutionError);
});
test("existing 187 evidence identity is invariant under offset spelling", () => {
  const a=currentAvailability(), b=currentAvailability({evaluationAt:"2026-09-02T21:00:00+09:00"});
  assert.equal(a.states.resource_assessments[0]!.canonical_state.key,b.states.resource_assessments[0]!.canonical_state.key);
});
test("reservation window/commitment/term identities use instants without new physical semantics", () => {
  const a={reserved_from:"2026-09-05T09:00:00+09:00",reserved_until:"2026-09-05T10:00:00+09:00"};
  const b={reserved_from:"2026-09-05T00:00:00Z",reserved_until:"2026-09-05T01:00:00Z"};
  assert.equal(resourceReservationWindowKey(a),resourceReservationWindowKey(b));
  assert.equal(doReservationWindowsOverlap(a,b),true);
  assert.equal(doReservationWindowsOverlap(a,{reserved_from:"2026-09-05T01:00:00Z",reserved_until:null}),false);
  assert.equal(interventionCommitmentSemanticKey("h","i",a.reserved_from),interventionCommitmentSemanticKey("h","i",b.reserved_from));
  assert.equal(commitmentTemporalTermSemanticKey("c","START_BY",a.reserved_from),commitmentTemporalTermSemanticKey("c","START_BY",b.reserved_from));
});

import { classifyRequiredWindowAgainstCapabilityDeclarationValidity } from "../reality/attention-observation-capability-declaration-temporal-applicability-core.js";
import { classifyRequiredWindowAgainstCapabilityAvailabilityInterval } from "../reality/attention-observation-capability-availability-temporal-applicability-core.js";
import { classifyRequiredWindowAgainstCapabilityVerificationValidity } from "../reality/attention-observation-capability-verification-temporal-applicability-core.js";
for (const domain of ["declaration", "availability", "verification"] as const) test(`Capability ${domain} temporal applicability retains offset-equivalent coverage`, () => {
  const required={required_from:"2026-09-05T00:00:00Z",required_until:"2026-09-05T01:00:00Z"};
  const actual={valid_from:"2026-09-05T09:00:00+09:00",valid_until:"2026-09-05T10:00:00+09:00"};
  const relation=domain==="verification" ? classifyRequiredWindowAgainstCapabilityVerificationValidity(required,{verified_at:actual.valid_from,valid_until:actual.valid_until}) : domain==="availability" ? classifyRequiredWindowAgainstCapabilityAvailabilityInterval(required,actual) : classifyRequiredWindowAgainstCapabilityDeclarationValidity(required,actual);
  assert.equal(relation,"FULL_REQUIRED_WINDOW_COVERAGE");
});
test("Gregorian year and date rollover retain exact identity without Date year-0/99 coercion", () => {
  assert.equal(temporalInstantKey("0000-01-01T00:00:00+01:00"),"-000001-12-31T23:00:00.000Z");
  assert.equal(temporalInstantKey("9999-12-31T23:59:59-01:00"),"+010000-01-01T00:59:59.000Z");
  assert.equal(temporalInstantKey("0099-01-01T00:00:00Z"),"0099-01-01T00:00:00.000Z");
});
