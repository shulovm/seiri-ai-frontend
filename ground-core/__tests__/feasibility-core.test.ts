import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SCHEMA_VERSION } from "../types.js";
import {
  assessDecisionSpaceFeasibilityBasis,
  deriveFeasibilityBasisContests,
} from "../reality/feasibility-core.js";
import type { DecisionOptionActorCompositionAssessment } from "../reality/agency-types.js";
import { applyPatch } from "../state-engine.js";
import type {
  CapabilityAvailabilityDeclaration,
  CapabilityDeclaration,
  CapabilityVerificationDeclaration,
  DecisionOptionActorCandidateDeclaration,
  DecisionOptionDeclaration,
  DecisionSpaceDeclaration,
  Evidence,
  EpistemicObservation,
  InterventionCapabilityRequirementDeclaration,
  InterventionDeclaration,
  InterventionPermissionDeclaration,
  InterventionResourceRequirementDeclaration,
  PatchEntity,
  ProjectState,
  RealityEntity,
  ResourceAvailabilityDeclaration,
  ResourceCapacityDeclaration,
  ResourceDeclaration,
  StatePatch,
} from "../types.js";
import { PROJECT_ID, validProjectStateV0124 } from "./fixtures.js";

const ENTITY_PIPE = "f6010101-0101-4101-8101-010101010101";
const ENTITY_ACTOR_A = "f6010101-0101-4101-8101-010101010102";
const ENTITY_ACTOR_B = "f6010101-0101-4101-8101-010101010103";
const ENTITY_HOLDER_B = "f6010101-0101-4101-8101-010101010104";
const ENTITY_HOLDER_C = "f6010101-0101-4101-8101-010101010105";
const SPACE_D = "f6020202-0202-4202-8202-020202020201";
const OPT_INT_A = "f6030303-0303-4303-8303-030303030301";
const OPT_DN = "f6030303-0303-4303-8303-030303030302";
const CAND_A = "f6040404-0404-4404-8404-040404040401";
const CAND_B = "f6040404-0404-4404-8404-040404040402";
const INT_A = "f6050505-0505-4505-8505-050505050501";
const CAP_REQ = "f6060606-0606-4606-8606-060606060601";
const RES_REQ = "f6070707-0707-4707-8707-070707070701";
const CAP_A = "f6080808-0808-4808-8808-080808080801";
const CAP_B = "f6080808-0808-4808-8808-080808080802";
const VER_A = "f6090909-0909-4909-8909-090909090901";
const CAP_AVAIL = "f60a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a01";
const CAP_AVAIL_B = "f60a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a02";
const RES_B = "f60b0b0b-0b0b-4b0b-8b0b-0b0b0b0b0b01";
const RES_C = "f60b0b0b-0b0b-4b0b-8b0b-0b0b0b0b0b02";
const CAPACITY_B = "f60c0c0c-0c0c-4c0c-8c0c-0c0c0c0c0c01";
const CAPACITY_C = "f60c0c0c-0c0c-4c0c-8c0c-0c0c0c0c0c02";
const RES_AVAIL_B = "f60d0d0d-0d0d-4d0d-8d0d-0d0d0d0d0d01";
const RES_AVAIL_C = "f60d0d0d-0d0d-4d0d-8d0d-0d0d0d0d0d02";
const RES_UNAVAIL_C = "f60d0d0d-0d0d-4d0d-8d0d-0d0d0d0d0d03";
const PERM_A = "f60e0e0e-0e0e-4e0e-8e0e-0e0e0e0e0e01";
const PERM_B = "f60e0e0e-0e0e-4e0e-8e0e-0e0e0e0e0e02";
const EPOBS_A = "f60f0f0f-0f0f-4f0f-8f0f-0f0f0f0f0f01";
const EVIDENCE_A = "f6101010-1010-4101-8101-101010101001";

const TS = "2026-08-24T10:00:00.000Z";
const FROM = "2026-08-24T10:00:00.000Z";
const UNTIL_NOON = "2026-08-24T12:00:00.000Z";
const AT = "2026-08-24T11:00:00.000Z";
const AT_AFTER = "2026-08-24T13:00:00.000Z";

const FORBIDDEN =
  /\b(feasible|infeasible|eligible|qualified)\b|feasibility_status|feasibility_score|feasibility_probability|ready_to_execute|can_execute|requirements_satisfied|conditions_met|coverage_percentage|gap_score|readiness_score|"SATISFIED"/;

function entity(
  id: string,
  label: string,
  overrides: Partial<RealityEntity> = {}
): RealityEntity {
  return {
    id,
    project_id: PROJECT_ID,
    kind: "asset",
    label,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function intervention(
  overrides: Partial<InterventionDeclaration> = {}
): InterventionDeclaration {
  return {
    id: INT_A,
    project_id: PROJECT_ID,
    intervention_key: "repair_pipe",
    target_scope: { kind: "ENTITY", entity_id: ENTITY_PIPE },
    description: null,
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "ops" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function decisionSpace(
  overrides: Partial<DecisionSpaceDeclaration> = {}
): DecisionSpaceDeclaration {
  return {
    id: SPACE_D,
    project_id: PROJECT_ID,
    label: "respond to pipe condition",
    description: null,
    basis: [],
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "ops" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function interventionOption(
  overrides: Partial<DecisionOptionDeclaration> = {}
): DecisionOptionDeclaration {
  return {
    id: OPT_INT_A,
    project_id: PROJECT_ID,
    decision_space_id: SPACE_D,
    option: { kind: "INTERVENTION", intervention_id: INT_A },
    label: "repair",
    description: null,
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "ops-a" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function candidate(
  overrides: Partial<DecisionOptionActorCandidateDeclaration> = {}
): DecisionOptionActorCandidateDeclaration {
  return {
    id: CAND_A,
    project_id: PROJECT_ID,
    decision_option_declaration_id: OPT_INT_A,
    actor_entity_id: ENTITY_ACTOR_A,
    note: null,
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "ops-a" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function capReq(): InterventionCapabilityRequirementDeclaration {
  return {
    id: CAP_REQ,
    project_id: PROJECT_ID,
    intervention_id: INT_A,
    capability_key: "repair_pipe",
    capability_scope: { kind: "ENTITY", entity_id: ENTITY_PIPE },
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "ops" },
    recorded_at: TS,
    note: null,
    created_at: TS,
    updated_at: TS,
  };
}

function resReq(): InterventionResourceRequirementDeclaration {
  return {
    id: RES_REQ,
    project_id: PROJECT_ID,
    intervention_id: INT_A,
    resource_key: "repair_parts",
    unit: "unit",
    resource_scope: { kind: "ENTITY", entity_id: ENTITY_PIPE },
    required_amount: { kind: "POINT", value: 10 },
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "ops" },
    recorded_at: TS,
    note: null,
    created_at: TS,
    updated_at: TS,
  };
}

function capability(
  overrides: Partial<CapabilityDeclaration> = {}
): CapabilityDeclaration {
  return {
    id: CAP_A,
    project_id: PROJECT_ID,
    holder_entity_id: ENTITY_ACTOR_A,
    capability_key: "repair_pipe",
    scope: { kind: "ENTITY", entity_id: ENTITY_PIPE },
    description: null,
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "ops" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function resource(
  overrides: Partial<ResourceDeclaration> = {}
): ResourceDeclaration {
  return {
    id: RES_B,
    project_id: PROJECT_ID,
    holder_entity_id: ENTITY_HOLDER_B,
    resource_key: "repair_parts",
    unit: "unit",
    scope: { kind: "ENTITY", entity_id: ENTITY_PIPE },
    resource_entity_id: null,
    description: null,
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "ops" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function permission(
  overrides: Partial<InterventionPermissionDeclaration> = {}
): InterventionPermissionDeclaration {
  return {
    id: PERM_A,
    project_id: PROJECT_ID,
    actor_entity_id: ENTITY_ACTOR_A,
    intervention_id: INT_A,
    effect: "PERMIT",
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "gov" },
    recorded_at: TS,
    note: null,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function baseProject(): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    reality_entities: [
      entity(ENTITY_PIPE, "pipe-A"),
      entity(ENTITY_ACTOR_A, "actor-A"),
      entity(ENTITY_ACTOR_B, "actor-B"),
      entity(ENTITY_HOLDER_B, "holder-B"),
      entity(ENTITY_HOLDER_C, "holder-C"),
    ],
    schema_version: "0.1.24",
  };
}

function patch(
  entityKind: PatchEntity,
  entityId: string,
  payload: object
): StatePatch {
  return {
    schema_version: "0.1.24",
    project_id: PROJECT_ID,
    source: "manual",
    operations: [{ op: "upsert", entity: entityKind, entity_id: entityId, payload }],
  } as StatePatch;
}

function withSpaceOptionIntervention(): ProjectState {
  let next = applyPatch(baseProject(), patch("intervention_declaration", INT_A, intervention()));
  next = applyPatch(next, patch("decision_space_declaration", SPACE_D, decisionSpace()));
  next = applyPatch(
    next,
    patch("decision_option_declaration", OPT_INT_A, interventionOption())
  );
  return next;
}

function withCandidate(project: ProjectState = withSpaceOptionIntervention()): ProjectState {
  return applyPatch(
    project,
    patch("decision_option_actor_candidate_declaration", CAND_A, candidate())
  );
}

function withEvidence(project: ProjectState): ProjectState {
  return applyPatch(project, {
    schema_version: "0.1.24",
    project_id: PROJECT_ID,
    source: "manual",
    operations: [
      {
        op: "upsert",
        entity: "epistemic_observation",
        entity_id: EPOBS_A,
        payload: {
          id: EPOBS_A,
          project_id: PROJECT_ID,
          kind: "sensor_reading",
          content: "ok",
          provenance: { kind: "human", label: "ops" },
          subject_ids: [ENTITY_PIPE],
          observed_at: TS,
          recorded_at: TS,
          created_at: TS,
          updated_at: TS,
        } satisfies EpistemicObservation,
      },
      {
        op: "upsert",
        entity: "evidence",
        entity_id: EVIDENCE_A,
        payload: {
          id: EVIDENCE_A,
          project_id: PROJECT_ID,
          kind: "observation_ref",
          observation_id: EPOBS_A,
          external_ref: null,
          summary: "ok",
          provenance: { kind: "human", label: "ops" },
          recorded_at: TS,
          created_at: TS,
          updated_at: TS,
        } satisfies Evidence,
      },
    ],
  } as StatePatch);
}

function withPositiveComposition(): ProjectState {
  let next = withCandidate();
  next = applyPatch(next, patch("intervention_capability_requirement_declaration", CAP_REQ, capReq()));
  next = applyPatch(next, patch("intervention_resource_requirement_declaration", RES_REQ, resReq()));
  next = applyPatch(next, patch("capability_declaration", CAP_A, capability()));
  next = withEvidence(next);
  next = applyPatch(
    next,
    patch("capability_verification_declaration", VER_A, {
      id: VER_A,
      project_id: PROJECT_ID,
      capability_declaration_id: CAP_A,
      evidence_ids: [EVIDENCE_A],
      verified_by: { kind: "human", label: "ops" },
      verified_at: FROM,
      valid_until: null,
      note: null,
      recorded_at: TS,
      created_at: TS,
      updated_at: TS,
    } satisfies CapabilityVerificationDeclaration)
  );
  next = applyPatch(
    next,
    patch("capability_availability_declaration", CAP_AVAIL, {
      id: CAP_AVAIL,
      project_id: PROJECT_ID,
      capability_declaration_id: CAP_A,
      status: "AVAILABLE",
      valid_from: FROM,
      valid_until: null,
      declared_by: { kind: "human", label: "ops" },
      recorded_at: TS,
      note: null,
      created_at: TS,
      updated_at: TS,
    } satisfies CapabilityAvailabilityDeclaration)
  );
  next = applyPatch(next, patch("resource_declaration", RES_B, resource()));
  next = applyPatch(
    next,
    patch("resource_capacity_declaration", CAPACITY_B, {
      id: CAPACITY_B,
      project_id: PROJECT_ID,
      resource_declaration_id: RES_B,
      capacity: { kind: "POINT", value: 100 },
      valid_from: FROM,
      valid_until: null,
      declared_by: { kind: "human", label: "ops" },
      recorded_at: TS,
      note: null,
      created_at: TS,
      updated_at: TS,
    } satisfies ResourceCapacityDeclaration)
  );
  next = applyPatch(
    next,
    patch("resource_availability_declaration", RES_AVAIL_B, {
      id: RES_AVAIL_B,
      project_id: PROJECT_ID,
      resource_declaration_id: RES_B,
      status: "AVAILABLE",
      valid_from: FROM,
      valid_until: null,
      declared_by: { kind: "human", label: "ops" },
      recorded_at: TS,
      note: null,
      created_at: TS,
      updated_at: TS,
    } satisfies ResourceAvailabilityDeclaration)
  );
  next = applyPatch(
    next,
    patch("intervention_permission_declaration", PERM_A, permission())
  );
  return next;
}

describe("Feasibility Basis (GROUND-027)", () => {
  it("does not change schema 0.1.16", () => {
    assert.equal(SCHEMA_VERSION, "0.1.25");
    assert.equal(withPositiveComposition().schema_version, "0.1.25");
  });

  it("all-positive composition exposes basis without feasibility verdict", () => {
    const project = withPositiveComposition();
    const before = structuredClone(project);
    const assessment = assessDecisionSpaceFeasibilityBasis(project, SPACE_D, AT);
    const actor = assessment.actor_feasibility_bases[0];
    assert.equal(actor?.has_gaps, false);
    assert.equal(actor?.has_declared_constraints, false);
    assert.equal(actor?.capability_bases[0]?.has_exact_match, true);
    assert.equal(actor?.capability_bases[0]?.has_active_verification, true);
    assert.equal(actor?.capability_bases[0]?.has_available_declaration, true);
    assert.equal(actor?.resource_bases[0]?.has_exact_match, true);
    assert.equal(actor?.resource_bases[0]?.has_any_capacity_declaration, true);
    assert.equal(actor?.permission_basis.permission_status, "PERMIT_DECLARED");
    assert.deepEqual(actor?.model_limitations, [
      "EFFECTIVE_CAPABILITY_NOT_MODELED",
      "EFFECTIVE_PERMISSION_NOT_MODELED",
      "AUTHORITY_PRECEDENCE_NOT_MODELED",
      "RESOURCE_AVAILABLE_QUANTITY_NOT_MODELED",
      "RESOURCE_ACCESS_PERMISSION_NOT_MODELED",
      "RESOURCE_RESERVATION_NOT_MODELED",
      "COMMITMENT_NOT_MODELED",
      "EXECUTION_CONDITIONS_NOT_MODELED",
    ]);
    assert.doesNotMatch(JSON.stringify(assessment), FORBIDDEN);
    assert.deepEqual(project, before);
    assert.deepEqual(
      assessment,
      assessDecisionSpaceFeasibilityBasis(project, SPACE_D, AT)
    );
  });

  it("emits Capability exact-match / verification / availability gaps", () => {
    let next = withCandidate();
    next = applyPatch(
      next,
      patch("intervention_capability_requirement_declaration", CAP_REQ, capReq())
    );
    let gaps = assessDecisionSpaceFeasibilityBasis(next, SPACE_D, AT)
      .actor_feasibility_bases[0]?.gaps.map((entry) => entry.kind);
    assert.ok(gaps?.includes("CAPABILITY_EXACT_MATCH_ABSENT"));
    assert.equal(gaps?.includes("CAPABILITY_ACTIVE_VERIFICATION_ABSENT"), false);

    next = applyPatch(next, patch("capability_declaration", CAP_A, capability()));
    gaps = assessDecisionSpaceFeasibilityBasis(next, SPACE_D, AT)
      .actor_feasibility_bases[0]?.gaps.map((entry) => entry.kind);
    assert.ok(gaps?.includes("CAPABILITY_ACTIVE_VERIFICATION_ABSENT"));
    assert.ok(gaps?.includes("CAPABILITY_AVAILABILITY_UNDECLARED"));
    assert.doesNotMatch(JSON.stringify(gaps), /INCAPABLE|NEED|BLOCKER/);
  });

  it("exposes Capability UNAVAILABLE as constraint, not infeasible", () => {
    let next = withCandidate();
    next = applyPatch(
      next,
      patch("intervention_capability_requirement_declaration", CAP_REQ, capReq())
    );
    next = applyPatch(next, patch("capability_declaration", CAP_A, capability()));
    next = applyPatch(
      next,
      patch("capability_availability_declaration", CAP_AVAIL, {
        id: CAP_AVAIL,
        project_id: PROJECT_ID,
        capability_declaration_id: CAP_A,
        status: "UNAVAILABLE",
        valid_from: FROM,
        valid_until: null,
        declared_by: { kind: "human", label: "ops" },
        recorded_at: TS,
        note: null,
        created_at: TS,
        updated_at: TS,
      } satisfies CapabilityAvailabilityDeclaration)
    );
    const actor = assessDecisionSpaceFeasibilityBasis(next, SPACE_D, AT)
      .actor_feasibility_bases[0];
    assert.ok(
      actor?.declared_constraints.some(
        (entry) => entry.kind === "CAPABILITY_UNAVAILABLE_DECLARATION_PRESENT"
      )
    );
    assert.doesNotMatch(JSON.stringify(actor), FORBIDDEN);
  });

  it("does not fabricate cross-Capability contest from AVAILABLE + UNAVAILABLE", () => {
    let next = withCandidate();
    next = applyPatch(
      next,
      patch("intervention_capability_requirement_declaration", CAP_REQ, capReq())
    );
    next = applyPatch(next, patch("capability_declaration", CAP_A, capability()));
    next = applyPatch(
      next,
      patch(
        "capability_declaration",
        CAP_B,
        capability({
          id: CAP_B,
          declared_by: { kind: "human", label: "ops-b" },
        })
      )
    );
    next = applyPatch(
      next,
      patch("capability_availability_declaration", CAP_AVAIL, {
        id: CAP_AVAIL,
        project_id: PROJECT_ID,
        capability_declaration_id: CAP_A,
        status: "AVAILABLE",
        valid_from: FROM,
        valid_until: null,
        declared_by: { kind: "human", label: "ops" },
        recorded_at: TS,
        note: null,
        created_at: TS,
        updated_at: TS,
      } satisfies CapabilityAvailabilityDeclaration)
    );
    next = applyPatch(
      next,
      patch("capability_availability_declaration", CAP_AVAIL_B, {
        id: CAP_AVAIL_B,
        project_id: PROJECT_ID,
        capability_declaration_id: CAP_B,
        status: "UNAVAILABLE",
        valid_from: FROM,
        valid_until: null,
        declared_by: { kind: "human", label: "ops-b" },
        recorded_at: TS,
        note: null,
        created_at: TS,
        updated_at: TS,
      } satisfies CapabilityAvailabilityDeclaration)
    );
    const actor = assessDecisionSpaceFeasibilityBasis(next, SPACE_D, AT)
      .actor_feasibility_bases[0];
    assert.equal(actor?.capability_bases[0]?.has_available_declaration, true);
    assert.equal(actor?.capability_bases[0]?.has_unavailable_declaration, true);
    assert.equal(
      actor?.contests.some(
        (entry) => entry.kind === "CAPABILITY_AVAILABILITY_CONTEST_PRESENT"
      ),
      false
    );
  });

  it("emits Resource exact-match / capacity / availability gaps", () => {
    let next = withCandidate();
    next = applyPatch(
      next,
      patch("intervention_resource_requirement_declaration", RES_REQ, resReq())
    );
    let kinds = assessDecisionSpaceFeasibilityBasis(next, SPACE_D, AT)
      .actor_feasibility_bases[0]?.gaps.map((entry) => entry.kind);
    assert.ok(kinds?.includes("RESOURCE_EXACT_MATCH_ABSENT"));

    next = applyPatch(next, patch("resource_declaration", RES_B, resource()));
    kinds = assessDecisionSpaceFeasibilityBasis(next, SPACE_D, AT)
      .actor_feasibility_bases[0]?.gaps.map((entry) => entry.kind);
    assert.ok(kinds?.includes("RESOURCE_CAPACITY_UNDECLARED"));
    assert.ok(kinds?.includes("RESOURCE_AVAILABILITY_UNDECLARED"));
  });

  it("preserves Resource holder heterogeneity without automatic contest", () => {
    let next = withCandidate();
    next = applyPatch(
      next,
      patch("intervention_resource_requirement_declaration", RES_REQ, resReq())
    );
    next = applyPatch(next, patch("resource_declaration", RES_B, resource()));
    next = applyPatch(
      next,
      patch(
        "resource_declaration",
        RES_C,
        resource({ id: RES_C, holder_entity_id: ENTITY_HOLDER_C })
      )
    );
    next = applyPatch(
      next,
      patch("resource_availability_declaration", RES_AVAIL_B, {
        id: RES_AVAIL_B,
        project_id: PROJECT_ID,
        resource_declaration_id: RES_B,
        status: "AVAILABLE",
        valid_from: FROM,
        valid_until: null,
        declared_by: { kind: "human", label: "ops" },
        recorded_at: TS,
        note: null,
        created_at: TS,
        updated_at: TS,
      } satisfies ResourceAvailabilityDeclaration)
    );
    next = applyPatch(
      next,
      patch("resource_availability_declaration", RES_UNAVAIL_C, {
        id: RES_UNAVAIL_C,
        project_id: PROJECT_ID,
        resource_declaration_id: RES_C,
        status: "UNAVAILABLE",
        valid_from: FROM,
        valid_until: null,
        declared_by: { kind: "human", label: "ops" },
        recorded_at: TS,
        note: null,
        created_at: TS,
        updated_at: TS,
      } satisfies ResourceAvailabilityDeclaration)
    );
    const actor = assessDecisionSpaceFeasibilityBasis(next, SPACE_D, AT)
      .actor_feasibility_bases[0];
    assert.equal(actor?.resource_bases[0]?.matching_resource_holder_ids.length, 2);
    assert.equal(actor?.resource_bases[0]?.has_available_declaration, true);
    assert.equal(actor?.resource_bases[0]?.has_unavailable_declaration, true);
    assert.equal(
      actor?.contests.some(
        (entry) => entry.kind === "RESOURCE_AVAILABILITY_CONTEST_PRESENT"
      ),
      false
    );
  });

  it("exposes existing Resource availability contest and capacity divergence", () => {
    let next = withCandidate();
    next = applyPatch(
      next,
      patch("intervention_resource_requirement_declaration", RES_REQ, resReq())
    );
    next = applyPatch(next, patch("resource_declaration", RES_B, resource()));
    next = applyPatch(
      next,
      patch("resource_capacity_declaration", CAPACITY_B, {
        id: CAPACITY_B,
        project_id: PROJECT_ID,
        resource_declaration_id: RES_B,
        capacity: { kind: "POINT", value: 100 },
        valid_from: FROM,
        valid_until: null,
        declared_by: { kind: "human", label: "ops" },
        recorded_at: TS,
        note: null,
        created_at: TS,
        updated_at: TS,
      } satisfies ResourceCapacityDeclaration)
    );
    next = applyPatch(
      next,
      patch("resource_capacity_declaration", CAPACITY_C, {
        id: CAPACITY_C,
        project_id: PROJECT_ID,
        resource_declaration_id: RES_B,
        capacity: { kind: "POINT", value: 50 },
        valid_from: FROM,
        valid_until: null,
        declared_by: { kind: "human", label: "ops-b" },
        recorded_at: TS,
        note: null,
        created_at: TS,
        updated_at: TS,
      } satisfies ResourceCapacityDeclaration)
    );
    next = applyPatch(
      next,
      patch("resource_availability_declaration", RES_AVAIL_B, {
        id: RES_AVAIL_B,
        project_id: PROJECT_ID,
        resource_declaration_id: RES_B,
        status: "AVAILABLE",
        valid_from: FROM,
        valid_until: null,
        declared_by: { kind: "human", label: "ops" },
        recorded_at: TS,
        note: null,
        created_at: TS,
        updated_at: TS,
      } satisfies ResourceAvailabilityDeclaration)
    );
    next = applyPatch(
      next,
      patch("resource_availability_declaration", RES_AVAIL_C, {
        id: RES_AVAIL_C,
        project_id: PROJECT_ID,
        resource_declaration_id: RES_B,
        status: "UNAVAILABLE",
        valid_from: FROM,
        valid_until: null,
        declared_by: { kind: "human", label: "ops-b" },
        recorded_at: TS,
        note: null,
        created_at: TS,
        updated_at: TS,
      } satisfies ResourceAvailabilityDeclaration)
    );
    const actor = assessDecisionSpaceFeasibilityBasis(next, SPACE_D, AT)
      .actor_feasibility_bases[0];
    const kinds = actor?.contests.map((entry) => entry.kind) ?? [];
    assert.ok(kinds.includes("RESOURCE_CAPACITY_DIVERGENCE_PRESENT"));
    assert.ok(kinds.includes("RESOURCE_AVAILABILITY_CONTEST_PRESENT"));
  });

  it("maps Permission undeclared / PERMIT / PROHIBIT / CONTESTED without winner", () => {
    let next = withCandidate();
    let actor = assessDecisionSpaceFeasibilityBasis(next, SPACE_D, AT)
      .actor_feasibility_bases[0];
    assert.ok(
      actor?.gaps.some((entry) => entry.kind === "INTERVENTION_PERMISSION_UNDECLARED")
    );
    assert.ok(
      actor?.model_limitations.includes("EFFECTIVE_PERMISSION_NOT_MODELED")
    );

    next = applyPatch(
      next,
      patch("intervention_permission_declaration", PERM_A, permission())
    );
    actor = assessDecisionSpaceFeasibilityBasis(next, SPACE_D, AT)
      .actor_feasibility_bases[0];
    assert.equal(actor?.permission_basis.permission_status, "PERMIT_DECLARED");
    assert.equal(
      actor?.gaps.some((entry) => entry.kind === "INTERVENTION_PERMISSION_UNDECLARED"),
      false
    );

    next = applyPatch(
      next,
      patch(
        "intervention_permission_declaration",
        PERM_B,
        permission({
          id: PERM_B,
          effect: "PROHIBIT",
          declared_by: { kind: "human", label: "gov-b" },
        })
      )
    );
    actor = assessDecisionSpaceFeasibilityBasis(next, SPACE_D, AT)
      .actor_feasibility_bases[0];
    assert.equal(actor?.permission_basis.permission_status, "CONTESTED_PERMISSION");
    assert.ok(
      actor?.contests.some(
        (entry) => entry.kind === "INTERVENTION_PERMISSION_CONTEST_PRESENT"
      )
    );
    assert.ok(
      actor?.declared_constraints.some(
        (entry) => entry.kind === "INTERVENTION_PROHIBIT_DECLARATION_PRESENT"
      )
    );
    assert.doesNotMatch(JSON.stringify(actor), FORBIDDEN);
  });

  it("exposes Permission issuer Authority contest from existing governance metadata", () => {
    const composition = {
      candidate_position: { key: "actor-candidate|space|int|actor" },
      permission: {
        has_permission_conflict: false,
        permission_declaration_ids: [PERM_A],
        prohibit_declaration_ids: [],
      },
      permission_governance: {
        has_permission_from_contested_authority_path: true,
        declaration_governance_contexts: [
          {
            permission_declaration_id: PERM_A,
            has_contested_authority_path: true,
          },
        ],
      },
      capability_requirement_matches: [],
      resource_requirement_matches: [],
    } as unknown as DecisionOptionActorCompositionAssessment;
    const contests = deriveFeasibilityBasisContests(composition, [], []);
    assert.ok(
      contests.some(
        (entry) => entry.kind === "PERMISSION_ISSUER_AUTHORITY_CONTEST_PRESENT"
      )
    );
  });

  it("zero requirements do not imply trivial feasibility", () => {
    const next = withCandidate();
    const actor = assessDecisionSpaceFeasibilityBasis(next, SPACE_D, AT)
      .actor_feasibility_bases[0];
    assert.equal(actor?.capability_bases.length, 0);
    assert.equal(actor?.resource_bases.length, 0);
    assert.ok(actor?.model_limitations.includes("COMMITMENT_NOT_MODELED"));
    assert.ok(actor?.model_limitations.includes("EXECUTION_CONDITIONS_NOT_MODELED"));
    assert.doesNotMatch(JSON.stringify(actor), /trivially|all requirements satisfied/);
  });

  it("lists candidate-free options and excludes DO_NOTHING from actor feasibility basis", () => {
    let next = withSpaceOptionIntervention();
    next = applyPatch(
      next,
      patch("decision_option_declaration", OPT_DN, {
        ...interventionOption({ id: OPT_DN }),
        option: { kind: "DO_NOTHING" },
        declared_by: { kind: "human", label: "ops-dn" },
      })
    );
    const assessment = assessDecisionSpaceFeasibilityBasis(next, SPACE_D, AT);
    assert.deepEqual(
      assessment.intervention_option_ids_without_actor_candidates,
      [OPT_INT_A]
    );
    assert.equal(assessment.has_actor_feasibility_bases, false);
    assert.equal(assessment.actor_composition.decision_space.has_do_nothing_option, true);
  });

  it("exposes temporal mismatch as basis gap without invalidation", () => {
    let next = applyPatch(
      baseProject(),
      patch(
        "intervention_declaration",
        INT_A,
        intervention({ valid_until: UNTIL_NOON })
      )
    );
    next = applyPatch(
      next,
      patch(
        "decision_space_declaration",
        SPACE_D,
        decisionSpace({ valid_until: UNTIL_NOON })
      )
    );
    next = applyPatch(
      next,
      patch(
        "decision_option_declaration",
        OPT_INT_A,
        interventionOption({ valid_until: UNTIL_NOON })
      )
    );
    next = applyPatch(
      next,
      patch(
        "decision_option_actor_candidate_declaration",
        CAND_A,
        candidate({ valid_until: null })
      )
    );
    const actor = assessDecisionSpaceFeasibilityBasis(next, SPACE_D, AT_AFTER)
      .actor_feasibility_bases[0];
    const temporal = actor?.gaps.filter(
      (entry) => entry.kind === "TEMPORAL_BASIS_MISMATCH"
    );
    assert.ok((temporal?.length ?? 0) >= 1);
    assert.equal(actor?.candidate_composition.actor_entity_id, ENTITY_ACTOR_A);
  });

  it("does not rank actors or options by gaps", () => {
    let next = withCandidate();
    next = applyPatch(
      next,
      patch(
        "decision_option_actor_candidate_declaration",
        CAND_B,
        candidate({
          id: CAND_B,
          actor_entity_id: ENTITY_ACTOR_B,
          declared_by: { kind: "human", label: "ops-b" },
        })
      )
    );
    const assessment = assessDecisionSpaceFeasibilityBasis(next, SPACE_D, AT);
    assert.equal(assessment.actor_feasibility_bases.length, 2);
    assert.ok(
      assessment.actor_feasibility_bases[0]!.candidate_composition.actor_entity_id <
        assessment.actor_feasibility_bases[1]!.candidate_composition.actor_entity_id
    );
    assert.doesNotMatch(JSON.stringify(assessment), /rank|best_actor|coverage_percentage/);
  });
});
