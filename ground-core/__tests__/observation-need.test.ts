import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { formulateInquiryAt, formulateUnresolvedSubjectInquiries } from "../reality/inquiry.js";
import {
  deriveObservationNeedsAt,
  deriveObservationNeedsForInquiry,
  deriveUnresolvedSubjectObservationNeeds,
  getObservationNeedsForSubject,
} from "../reality/observation-need.js";
import type { ObservationNeed } from "../reality/observation-need-types.js";
import { applyPatch } from "../state-engine.js";
import type { Claim, RealityEntity } from "../types.js";
import { PROJECT_ID, validProjectStateV013 } from "./fixtures.js";

const ENTITY_ID = "b1010101-0101-4101-8101-010101010101";
const CLAIM_A = "b4040404-0404-4404-8404-040404040401";
const CLAIM_B = "b4040404-0404-4404-8404-040404040402";
const CLAIM_NULL = "b4040404-0404-4404-8404-040404040403";
const OBS_ID = "b2020202-0202-4202-8202-020202020201";
const EV_S = "b3030303-0303-4303-8303-030303030301";
const EV_C = "b3030303-0303-4303-8303-030303030302";
const LINK_S = "b5050505-0505-4505-8505-050505050501";
const LINK_C = "b5050505-0505-4505-8505-050505050502";
const TS = "2026-08-24T12:00:00.000Z";
const AT = "2026-08-24T11:30:00.000Z";

function entity(): RealityEntity {
  return {
    id: ENTITY_ID,
    project_id: PROJECT_ID,
    kind: "asset",
    label: "pipe-A",
    created_at: TS,
    updated_at: TS,
  };
}

function claim(overrides: Partial<Claim> = {}): Claim {
  return {
    id: CLAIM_A,
    project_id: PROJECT_ID,
    subject_id: ENTITY_ID,
    predicate_kind: "state",
    predicate: "condition",
    value: "leaking",
    provenance: { kind: "human" },
    confidence: 0.72,
    applicable_from: "2026-08-24T00:00:00.000Z",
    applicable_until: null,
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function withClaims(claims: Claim[]) {
  return applyPatch(validProjectStateV013, {
    schema_version: "0.1.3",
    project_id: PROJECT_ID,
    source: "manual",
    operations: [
      {
        op: "upsert",
        entity: "reality_entity",
        entity_id: ENTITY_ID,
        payload: entity(),
      },
      ...claims.map((c) => ({
        op: "upsert" as const,
        entity: "claim" as const,
        entity_id: c.id,
        payload: c,
      })),
    ],
  });
}

function query(at = AT) {
  return {
    subjectId: ENTITY_ID,
    predicateKind: "state" as const,
    predicate: "condition",
    at,
  };
}

function assertNoForbiddenFields(need: ObservationNeed) {
  const json = JSON.stringify(need);
  for (const forbidden of [
    "priority",
    "urgency",
    "observer_id",
    "sensor_id",
    "estimated_cost",
    "information_gain",
    "attention_score",
  ]) {
    assert.ok(!json.includes(`"${forbidden}"`));
  }
}

describe("Observation Need (GROUND-008)", () => {
  it("ESTABLISH_PROPOSITION → OBSERVE_PROPOSITION", () => {
    const state = withClaims([]);
    const needs = deriveObservationNeedsAt(state, query());
    assert.equal(needs.length, 1);
    assert.equal(needs[0]?.kind, "OBSERVE_PROPOSITION");
    assert.equal(needs[0]?.target.kind, "PROPOSITION_TARGET");
    if (needs[0]?.target.kind === "PROPOSITION_TARGET") {
      assert.equal(needs[0].target.subject_id, ENTITY_ID);
      assert.equal(needs[0].target.predicate, "condition");
    }
    assert.equal(needs[0]?.temporal_scope.kind, "POINT");
    assertNoForbiddenFields(needs[0]!);
  });

  it("DISAMBIGUATE_POSITIONS → DISCRIMINATE_POSITIONS retaining candidates", () => {
    const state = withClaims([
      claim({ id: CLAIM_A, value: "normal" }),
      claim({ id: CLAIM_B, value: "leaking" }),
    ]);
    const needs = deriveObservationNeedsAt(state, query());
    const need = needs.find((n) => n.kind === "DISCRIMINATE_POSITIONS");
    assert.ok(need);
    assert.equal(need?.discriminates_between_value_keys.length, 2);
    assert.equal(
      need?.evidence_requirements[0]?.kind,
      "DISTINGUISHES_POSITIONS"
    );
    assert.equal(
      need?.satisfaction_condition.kind,
      "RESULT_MUST_BEAR_ON_POSITION_DISCRIMINATION"
    );
  });

  it("FIND_SUPPORTING_EVIDENCE → OBTAIN_CLAIM_EVIDENCE (support or contradict)", () => {
    const state = withClaims([claim()]);
    const needs = deriveObservationNeedsAt(state, query());
    const need = needs.find((n) => n.kind === "OBTAIN_CLAIM_EVIDENCE");
    assert.ok(need);
    assert.equal(need?.target.kind, "CLAIM_TARGET");
    assert.equal(need?.evidence_requirements[0]?.required_relation, "bears_on");
    assert.equal(
      need?.satisfaction_condition.kind,
      "NEW_EVIDENCE_LINKED_TO_CLAIM"
    );
  });

  it("EVIDENCE_TENSION → CLARIFY_EVIDENCE_TENSION with both Evidence IDs", () => {
    let state = withClaims([claim()]);
    state = applyPatch(state, {
      schema_version: "0.1.3",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "epistemic_observation",
          entity_id: OBS_ID,
          payload: {
            id: OBS_ID,
            project_id: PROJECT_ID,
            kind: "visual",
            content: "x",
            provenance: { kind: "human" },
            subject_ids: [ENTITY_ID],
            observed_at: AT,
            recorded_at: TS,
            created_at: TS,
            updated_at: TS,
          },
        },
        {
          op: "upsert",
          entity: "evidence",
          entity_id: EV_S,
          payload: {
            id: EV_S,
            project_id: PROJECT_ID,
            kind: "observation_ref",
            observation_id: OBS_ID,
            external_ref: null,
            summary: "s",
            provenance: { kind: "human" },
            recorded_at: TS,
            created_at: TS,
            updated_at: TS,
          },
        },
        {
          op: "upsert",
          entity: "evidence",
          entity_id: EV_C,
          payload: {
            id: EV_C,
            project_id: PROJECT_ID,
            kind: "external_ref",
            observation_id: null,
            external_ref: "doc://c",
            summary: "c",
            provenance: { kind: "document" },
            recorded_at: TS,
            created_at: TS,
            updated_at: TS,
          },
        },
        {
          op: "upsert",
          entity: "claim_evidence_link",
          entity_id: LINK_S,
          payload: {
            id: LINK_S,
            project_id: PROJECT_ID,
            claim_id: CLAIM_A,
            evidence_id: EV_S,
            relation: "SUPPORTS",
            recorded_at: TS,
            created_at: TS,
            updated_at: TS,
          },
        },
        {
          op: "upsert",
          entity: "claim_evidence_link",
          entity_id: LINK_C,
          payload: {
            id: LINK_C,
            project_id: PROJECT_ID,
            claim_id: CLAIM_A,
            evidence_id: EV_C,
            relation: "CONTRADICTS",
            recorded_at: TS,
            created_at: TS,
            updated_at: TS,
          },
        },
      ],
    });
    const inquiry = formulateInquiryAt(state, query());
    assert.ok(inquiry);
    const needs = deriveObservationNeedsForInquiry(inquiry!);
    const need = needs.find((n) => n.kind === "CLARIFY_EVIDENCE_TENSION");
    assert.ok(need);
    assert.equal(need?.target.kind, "EVIDENCE_TENSION_TARGET");
    if (need?.target.kind === "EVIDENCE_TENSION_TARGET") {
      assert.deepEqual(need.target.supporting_evidence_ids, [EV_S]);
      assert.deepEqual(need.target.contradicting_evidence_ids, [EV_C]);
    }
  });

  it("FILL_TEMPORAL_COVERAGE → OBSERVE_TEMPORAL_GAP without interpolation", () => {
    const state = withClaims([
      claim({
        id: CLAIM_A,
        value: "normal",
        applicable_from: "2026-08-24T10:00:00.000Z",
        applicable_until: "2026-08-24T11:00:00.000Z",
      }),
      claim({
        id: CLAIM_B,
        value: "leaking",
        applicable_from: "2026-08-24T12:00:00.000Z",
        applicable_until: null,
      }),
    ]);
    const needs = deriveObservationNeedsAt(state, query());
    assert.equal(needs.length, 1);
    assert.equal(needs[0]?.kind, "OBSERVE_TEMPORAL_GAP");
    assert.deepEqual(needs[0]?.prior_claim_ids, [CLAIM_A]);
    assert.deepEqual(needs[0]?.later_claim_ids, [CLAIM_B]);
    assert.ok(
      needs[0]?.originating_gap_kinds.includes("TEMPORAL_COVERAGE_GAP")
    );
    assert.ok(
      needs[0]?.originating_gap_kinds.includes("NO_APPLICABLE_CLAIMS")
    );
  });

  it("RESOLVE_SUBJECT_IDENTITY → IDENTIFY_SUBJECT with no candidates", () => {
    const state = withClaims([
      claim({ id: CLAIM_NULL, subject_id: null, value: "leaking" }),
    ]);
    const inquiries = formulateUnresolvedSubjectInquiries(state, AT);
    const needs = deriveUnresolvedSubjectObservationNeeds(state, AT);
    assert.equal(inquiries.length, 1);
    assert.equal(needs.length, 1);
    assert.equal(needs[0]?.kind, "IDENTIFY_SUBJECT");
    assert.equal(needs[0]?.target.kind, "SUBJECT_IDENTITY_TARGET");
    assert.equal(needs[0]?.discriminates_between_value_keys.length, 0);
  });

  it("no Inquiry → no ObservationNeeds", () => {
    let state = withClaims([claim()]);
    state = applyPatch(state, {
      schema_version: "0.1.3",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "epistemic_observation",
          entity_id: OBS_ID,
          payload: {
            id: OBS_ID,
            project_id: PROJECT_ID,
            kind: "visual",
            content: "x",
            provenance: { kind: "human" },
            subject_ids: [ENTITY_ID],
            observed_at: AT,
            recorded_at: TS,
            created_at: TS,
            updated_at: TS,
          },
        },
        {
          op: "upsert",
          entity: "evidence",
          entity_id: EV_S,
          payload: {
            id: EV_S,
            project_id: PROJECT_ID,
            kind: "observation_ref",
            observation_id: OBS_ID,
            external_ref: null,
            summary: "s",
            provenance: { kind: "human" },
            recorded_at: TS,
            created_at: TS,
            updated_at: TS,
          },
        },
        {
          op: "upsert",
          entity: "claim_evidence_link",
          entity_id: LINK_S,
          payload: {
            id: LINK_S,
            project_id: PROJECT_ID,
            claim_id: CLAIM_A,
            evidence_id: EV_S,
            relation: "SUPPORTS",
            recorded_at: TS,
            created_at: TS,
            updated_at: TS,
          },
        },
      ],
    });
    assert.equal(formulateInquiryAt(state, query()), null);
    assert.deepEqual(deriveObservationNeedsAt(state, query()), []);
    assert.deepEqual(getObservationNeedsForSubject(state, ENTITY_ID, AT), []);
  });

  it("deterministic, read-only, reuses Inquiry layer", () => {
    const state = withClaims([
      claim({ id: CLAIM_A, value: "normal" }),
      claim({ id: CLAIM_B, value: "leaking" }),
    ]);
    const before = JSON.stringify(state);
    const a = deriveObservationNeedsAt(state, query());
    const b = deriveObservationNeedsAt(state, query());
    assert.deepEqual(a, b);
    assert.ok(a.every((n) => n.key.startsWith("need|")));
    assert.equal(JSON.stringify(state), before);
    assert.equal(state.reality_states.length, 0);

    const src = readFileSync(
      join(process.cwd(), "ground-core/reality/observation-need.ts"),
      "utf8"
    );
    assert.ok(src.includes("formulateInquiryAt"));
    assert.ok(!/\brandomUUID\s*\(/.test(src));
    assert.ok(!/\bDate\.now\s*\(/.test(src));
    const imports = src.split("\n").filter((line) => /^\s*import\b/.test(line));
    assert.ok(
      !imports.some((line) =>
        /state-engine|file-store|applyPatch|saveProject/.test(line)
      )
    );
  });
});
