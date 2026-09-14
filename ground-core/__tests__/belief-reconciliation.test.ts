import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  assessBeliefAt,
  detectClaimDivergence,
  getBeliefAssessmentsForSubject,
  isClaimApplicableAt,
} from "../reality/belief.js";
import {
  canonicalValueKey,
  semanticValuesEqual,
} from "../reality/semantic-equality.js";
import { detectRealityStateConflicts } from "../reality/worldline.js";
import { applyPatch } from "../state-engine.js";
import type {
  Claim,
  ClaimEvidenceLink,
  Evidence,
  EpistemicObservation,
  RealityEntity,
  RealityState,
} from "../types.js";
import { PROJECT_ID, validProjectStateV013 } from "./fixtures.js";

const ENTITY_ID = "e1010101-0101-4101-8101-010101010101";
const CLAIM_A = "e4040404-0404-4404-8404-040404040401";
const CLAIM_B = "e4040404-0404-4404-8404-040404040402";
const CLAIM_C = "e4040404-0404-4404-8404-040404040403";
const CLAIM_NULL = "e4040404-0404-4404-8404-040404040404";
const OBS_ID = "e2020202-0202-4202-8202-020202020201";
const EV_SUPPORT = "e3030303-0303-4303-8303-030303030301";
const EV_CONTRA = "e3030303-0303-4303-8303-030303030302";
const LINK_S = "e5050505-0505-4505-8505-050505050501";
const LINK_C = "e5050505-0505-4505-8505-050505050502";
const STATE_A = "e6060606-0606-4606-8606-060606060601";
const STATE_B = "e6060606-0606-4606-8606-060606060602";
const TS = "2026-08-24T12:00:00.000Z";
const AT = "2026-08-24T10:30:00.000Z";

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

function claim(overrides: Partial<Claim>): Claim {
  return {
    id: CLAIM_A,
    project_id: PROJECT_ID,
    subject_id: ENTITY_ID,
    predicate_kind: "state",
    predicate: "condition",
    value: "leaking",
    provenance: { kind: "human", label: "operator" },
    confidence: 0.72,
    applicable_from: "2026-08-24T00:00:00.000Z",
    applicable_until: null,
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function withEntityAndClaims(claims: Claim[]): ReturnType<typeof applyPatch> {
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

describe("semantic equality", () => {
  it("ignores object key order", () => {
    assert.equal(
      semanticValuesEqual({ a: 1, b: 2 }, { b: 2, a: 1 }),
      true
    );
    assert.equal(
      canonicalValueKey({ a: 1, b: 2 }),
      canonicalValueKey({ b: 2, a: 1 })
    );
  });

  it("preserves array order and type distinctions", () => {
    assert.equal(semanticValuesEqual([1, 2], [2, 1]), false);
    assert.equal(semanticValuesEqual("1", 1), false);
    assert.equal(semanticValuesEqual(null, null), true);
  });
});

describe("Belief & Reconciliation (GROUND-005)", () => {
  it("NO_CLAIMS when no applicable claims", () => {
    const state = withEntityAndClaims([]);
    const assessment = assessBeliefAt(state, {
      subjectId: ENTITY_ID,
      predicateKind: "state",
      predicate: "condition",
      at: AT,
    });
    assert.equal(assessment.status, "NO_CLAIMS");
    assert.equal(assessment.leading_position, null);
    assert.equal(assessment.positions.length, 0);
  });

  it("single Claim → UNCONTESTED but not ontic truth", () => {
    const state = withEntityAndClaims([claim({ value: "leaking" })]);
    const before = JSON.stringify({
      reality_entities: state.reality_entities,
      reality_events: state.reality_events,
      reality_states: state.reality_states,
      claims: state.claims,
    });
    const assessment = assessBeliefAt(state, {
      subjectId: ENTITY_ID,
      predicateKind: "state",
      predicate: "condition",
      at: AT,
    });
    assert.equal(assessment.status, "UNCONTESTED");
    assert.equal(assessment.positions.length, 1);
    assert.equal(assessment.leading_position?.value, "leaking");
    assert.ok(assessment.unresolved_reasons.includes("uncontested_is_not_truth"));
    assert.equal(state.reality_states.length, 0);
    assert.equal(
      JSON.stringify({
        reality_entities: state.reality_entities,
        reality_events: state.reality_events,
        reality_states: state.reality_states,
        claims: state.claims,
      }),
      before
    );
  });

  it("same-value Claims merge into one Position with both confidences", () => {
    const state = withEntityAndClaims([
      claim({ id: CLAIM_A, value: "leaking", confidence: 0.72 }),
      claim({
        id: CLAIM_B,
        value: "leaking",
        confidence: 0.91,
        recorded_at: "2026-08-24T13:00:00.000Z",
      }),
    ]);
    const assessment = assessBeliefAt(state, {
      subjectId: ENTITY_ID,
      predicateKind: "state",
      predicate: "condition",
      at: AT,
    });
    assert.equal(assessment.status, "UNCONTESTED");
    assert.equal(assessment.positions.length, 1);
    assert.deepEqual(
      assessment.positions[0]?.confidence_summary.claim_confidences,
      [0.72, 0.91]
    );
    assert.deepEqual(assessment.positions[0]?.claim_ids, [CLAIM_A, CLAIM_B]);
  });

  it("object semantic equality groups Claims into one Position", () => {
    const state = withEntityAndClaims([
      claim({ id: CLAIM_A, value: { a: 1, b: 2 }, confidence: 0.5 }),
      claim({ id: CLAIM_B, value: { b: 2, a: 1 }, confidence: 0.6 }),
    ]);
    const assessment = assessBeliefAt(state, {
      subjectId: ENTITY_ID,
      predicateKind: "state",
      predicate: "condition",
      at: AT,
    });
    assert.equal(assessment.status, "UNCONTESTED");
    assert.equal(assessment.positions.length, 1);
    assert.equal(assessment.positions[0]?.claim_ids.length, 2);
  });

  it("array order creates divergent Positions", () => {
    const state = withEntityAndClaims([
      claim({ id: CLAIM_A, value: [1, 2] }),
      claim({ id: CLAIM_B, value: [2, 1] }),
    ]);
    const assessment = assessBeliefAt(state, {
      subjectId: ENTITY_ID,
      predicateKind: "state",
      predicate: "condition",
      at: AT,
    });
    assert.equal(assessment.status, "CONTESTED");
    assert.equal(assessment.positions.length, 2);
    assert.equal(assessment.leading_position, null);
  });

  it("divergent Claims → CONTESTED with no winner", () => {
    const state = withEntityAndClaims([
      claim({ id: CLAIM_A, value: "normal", confidence: 0.84 }),
      claim({ id: CLAIM_B, value: "leaking", confidence: 0.91 }),
      claim({ id: CLAIM_C, value: "leaking", confidence: 0.72 }),
    ]);
    const assessment = assessBeliefAt(state, {
      subjectId: ENTITY_ID,
      predicateKind: "state",
      predicate: "condition",
      at: AT,
    });
    assert.equal(assessment.status, "CONTESTED");
    assert.equal(assessment.positions.length, 2);
    assert.equal(assessment.leading_position, null);
    const leaking = assessment.positions.find((p) => p.value === "leaking");
    assert.deepEqual(leaking?.confidence_summary.claim_confidences, [0.72, 0.91]);
    const divergence = detectClaimDivergence(state, {
      subjectId: ENTITY_ID,
      predicateKind: "state",
      predicate: "condition",
      at: AT,
    });
    assert.ok(divergence);
    assert.equal(divergence?.positions.length, 2);
  });

  it("applicability half-open intervals filter Claims", () => {
    assert.equal(
      isClaimApplicableAt(
        claim({
          applicable_from: "2026-08-24T10:00:00.000Z",
          applicable_until: "2026-08-24T11:00:00.000Z",
        }),
        "2026-08-24T10:30:00.000Z"
      ),
      true
    );
    assert.equal(
      isClaimApplicableAt(
        claim({
          applicable_from: "2026-08-24T10:00:00.000Z",
          applicable_until: "2026-08-24T11:00:00.000Z",
        }),
        "2026-08-24T11:00:00.000Z"
      ),
      false
    );

    const state = withEntityAndClaims([
      claim({
        id: CLAIM_A,
        value: "normal",
        applicable_from: "2026-08-24T10:00:00.000Z",
        applicable_until: "2026-08-24T11:00:00.000Z",
      }),
      claim({
        id: CLAIM_B,
        value: "leaking",
        applicable_from: "2026-08-24T11:00:00.000Z",
        applicable_until: null,
      }),
    ]);
    const at1030 = assessBeliefAt(state, {
      subjectId: ENTITY_ID,
      predicateKind: "state",
      predicate: "condition",
      at: "2026-08-24T10:30:00.000Z",
    });
    assert.equal(at1030.status, "UNCONTESTED");
    assert.equal(at1030.positions[0]?.value, "normal");

    const at1100 = assessBeliefAt(state, {
      subjectId: ENTITY_ID,
      predicateKind: "state",
      predicate: "condition",
      at: "2026-08-24T11:00:00.000Z",
    });
    assert.equal(at1100.status, "UNCONTESTED");
    assert.equal(at1100.positions[0]?.value, "leaking");
  });

  it("preserves SUPPORTS and CONTRADICTS without confidence mutation", () => {
    let state = withEntityAndClaims([
      claim({ id: CLAIM_A, value: "leaking", confidence: 0.72 }),
    ]);
    const observation: EpistemicObservation = {
      id: OBS_ID,
      project_id: PROJECT_ID,
      kind: "visual",
      content: "water on road",
      provenance: { kind: "human" },
      subject_ids: [ENTITY_ID],
      observed_at: AT,
      recorded_at: TS,
      created_at: TS,
      updated_at: TS,
    };
    const support: Evidence = {
      id: EV_SUPPORT,
      project_id: PROJECT_ID,
      kind: "observation_ref",
      observation_id: OBS_ID,
      external_ref: null,
      summary: "support",
      provenance: { kind: "human" },
      recorded_at: TS,
      created_at: TS,
      updated_at: TS,
    };
    const contra: Evidence = {
      id: EV_CONTRA,
      project_id: PROJECT_ID,
      kind: "external_ref",
      observation_id: null,
      external_ref: "doc://clear",
      summary: "contra",
      provenance: { kind: "document" },
      recorded_at: TS,
      created_at: TS,
      updated_at: TS,
    };
    const linkS: ClaimEvidenceLink = {
      id: LINK_S,
      project_id: PROJECT_ID,
      claim_id: CLAIM_A,
      evidence_id: EV_SUPPORT,
      relation: "SUPPORTS",
      recorded_at: TS,
      created_at: TS,
      updated_at: TS,
    };
    const linkC: ClaimEvidenceLink = {
      id: LINK_C,
      project_id: PROJECT_ID,
      claim_id: CLAIM_A,
      evidence_id: EV_CONTRA,
      relation: "CONTRADICTS",
      recorded_at: TS,
      created_at: TS,
      updated_at: TS,
    };
    state = applyPatch(state, {
      schema_version: "0.1.3",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "epistemic_observation",
          entity_id: OBS_ID,
          payload: observation,
        },
        {
          op: "upsert",
          entity: "evidence",
          entity_id: EV_SUPPORT,
          payload: support,
        },
        {
          op: "upsert",
          entity: "evidence",
          entity_id: EV_CONTRA,
          payload: contra,
        },
        {
          op: "upsert",
          entity: "claim_evidence_link",
          entity_id: LINK_S,
          payload: linkS,
        },
        {
          op: "upsert",
          entity: "claim_evidence_link",
          entity_id: LINK_C,
          payload: linkC,
        },
      ],
    });
    const assessment = assessBeliefAt(state, {
      subjectId: ENTITY_ID,
      predicateKind: "state",
      predicate: "condition",
      at: AT,
    });
    assert.equal(assessment.positions[0]?.supporting_evidence.length, 1);
    assert.equal(assessment.positions[0]?.contradicting_evidence.length, 1);
    assert.equal(assessment.positions[0]?.has_evidence_tension, true);
    assert.equal(state.claims[0]?.confidence, 0.72);
    assert.ok(assessment.unresolved_reasons.includes("evidence_tension"));
  });

  it("preserves multi-source provenance without reliability scores", () => {
    const state = withEntityAndClaims([
      claim({
        id: CLAIM_A,
        value: "leaking",
        confidence: 0.7,
        provenance: { kind: "sensor", external_id: "s1", label: "pressure" },
      }),
      claim({
        id: CLAIM_B,
        value: "leaking",
        confidence: 0.8,
        provenance: { kind: "ai_model", label: "sat-v1" },
      }),
    ]);
    const assessment = assessBeliefAt(state, {
      subjectId: ENTITY_ID,
      predicateKind: "state",
      predicate: "condition",
      at: AT,
    });
    assert.equal(assessment.positions[0]?.provenance_summary.length, 2);
    assert.deepEqual(
      assessment.positions[0]?.provenance_summary.map((p) => p.kind).sort(),
      ["ai_model", "sensor"]
    );
  });

  it("unknown subject Claims do not contaminate Entity assessment", () => {
    const state = withEntityAndClaims([
      claim({ id: CLAIM_A, value: "normal", confidence: 0.5 }),
      claim({
        id: CLAIM_NULL,
        subject_id: null,
        value: "leaking",
        confidence: 0.99,
      }),
    ]);
    const assessment = assessBeliefAt(state, {
      subjectId: ENTITY_ID,
      predicateKind: "state",
      predicate: "condition",
      at: AT,
    });
    assert.equal(assessment.status, "UNCONTESTED");
    assert.equal(assessment.positions[0]?.value, "normal");
    assert.equal(assessment.applicable_claims.length, 1);
  });

  it("is read-only: ProjectState checksum unchanged; no mutation imports", () => {
    const state = withEntityAndClaims([
      claim({ id: CLAIM_A, value: "normal" }),
      claim({ id: CLAIM_B, value: "leaking" }),
    ]);
    const before = JSON.stringify(state);
    assessBeliefAt(state, {
      subjectId: ENTITY_ID,
      predicateKind: "state",
      predicate: "condition",
      at: AT,
    });
    getBeliefAssessmentsForSubject(state, ENTITY_ID, AT);
    detectClaimDivergence(state, {
      subjectId: ENTITY_ID,
      predicateKind: "state",
      predicate: "condition",
      at: AT,
    });
    assert.equal(JSON.stringify(state), before);

    const beliefSrc = readFileSync(
      join(process.cwd(), "ground-core/reality/belief.ts"),
      "utf8"
    );
    const importLines = beliefSrc.split("\n").filter((line) => /^\s*import\b/.test(line));
    assert.ok(
      !importLines.some((line) => /state-engine|file-store|applyPatch|saveProject/.test(line))
    );
  });

  it("assessments are deterministic across repeated calls", () => {
    const state = withEntityAndClaims([
      claim({ id: CLAIM_B, value: "leaking", confidence: 0.91 }),
      claim({ id: CLAIM_A, value: "normal", confidence: 0.84 }),
      claim({ id: CLAIM_C, value: "leaking", confidence: 0.72 }),
    ]);
    const a = assessBeliefAt(state, {
      subjectId: ENTITY_ID,
      predicateKind: "state",
      predicate: "condition",
      at: AT,
    });
    const b = assessBeliefAt(state, {
      subjectId: ENTITY_ID,
      predicateKind: "state",
      predicate: "condition",
      at: AT,
    });
    assert.deepEqual(a, b);
  });

  it("Worldline reuses semantic equality — object key order is not value_conflict", () => {
    const stateA: RealityState = {
      id: STATE_A,
      project_id: PROJECT_ID,
      subject_id: ENTITY_ID,
      kind: "condition",
      value: { a: 1, b: 2 },
      valid_from: "2026-08-24T10:00:00.000Z",
      valid_until: "2026-08-24T12:00:00.000Z",
      recorded_at: TS,
      created_at: TS,
      updated_at: TS,
    };
    const stateB: RealityState = {
      ...stateA,
      id: STATE_B,
      value: { b: 2, a: 1 },
      valid_from: "2026-08-24T11:00:00.000Z",
      valid_until: "2026-08-24T13:00:00.000Z",
    };
    const project = {
      ...structuredClone(validProjectStateV013),
      reality_entities: [entity()],
      reality_states: [stateA, stateB],
    };
    const conflicts = detectRealityStateConflicts(project, ENTITY_ID);
    assert.equal(conflicts.length, 1);
    assert.equal(conflicts[0]?.conflict_kind, "duplicate_overlap");
  });
});

it("Belief preserves distinct provenance tuples containing separator characters", () => {
  const p = withEntityAndClaims([
    claim({ id: CLAIM_A, provenance: { kind: "document", external_id: "a\u0000b", label: "c" } }),
    claim({ id: CLAIM_B, provenance: { kind: "document", external_id: "a", label: "b\u0000c" } }),
  ]);
  const assessment = assessBeliefAt(p, { subjectId: ENTITY_ID, predicateKind: "state", predicate: "condition", at: AT });
  assert.equal(assessment.positions.length, 1);
  assert.equal(assessment.positions[0]!.provenance_summary.length, 2);
  assert.equal(assessment.status, "UNCONTESTED"); // provenance does not vote on truth
});
