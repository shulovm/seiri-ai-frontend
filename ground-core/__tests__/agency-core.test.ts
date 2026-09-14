import assert from "node:assert/strict";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { loadProject, saveProject } from "../file-store.js";
import { migrateProjectState } from "../migrate.js";
import {
  assessCapabilityRequirementMatchesForActor,
  assessDecisionSpaceActorComposition,
  assessResourceRequirementMatches,
  decisionOptionActorCandidateSemanticKey,
  groupDecisionOptionActorCandidatePositions,
  isDecisionOptionActorCandidateActiveAt,
} from "../reality/agency-core.js";
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
import {
  validateProjectState,
  validateProjectStateV0115,
} from "../validate.js";
import {
  PROJECT_ID,
  validProjectStateV0115,
  validProjectStateV0124,
} from "./fixtures.js";

const ENTITY_PIPE = "f5010101-0101-4101-8101-010101010101";
const ENTITY_ACTOR_A = "f5010101-0101-4101-8101-010101010102";
const ENTITY_ACTOR_B = "f5010101-0101-4101-8101-010101010103";
const ENTITY_HOLDER = "f5010101-0101-4101-8101-010101010104";
const SPACE_D = "f5020202-0202-4202-8202-020202020201";
const OPT_INT_A = "f5030303-0303-4303-8303-030303030301";
const OPT_INT_B = "f5030303-0303-4303-8303-030303030302";
const OPT_DN = "f5030303-0303-4303-8303-030303030303";
const CAND_A = "f5040404-0404-4404-8404-040404040401";
const CAND_B = "f5040404-0404-4404-8404-040404040402";
const CAND_C = "f5040404-0404-4404-8404-040404040403";
const INT_A = "f5050505-0505-4505-8505-050505050501";
const CAP_REQ = "f5060606-0606-4606-8606-060606060601";
const RES_REQ = "f5070707-0707-4707-8707-070707070701";
const RES_REQ_B = "f5070707-0707-4707-8707-070707070702";
const CAP_A = "f5080808-0808-4808-8808-080808080801";
const CAP_B = "f5080808-0808-4808-8808-080808080802";
const VER_A = "f5090909-0909-4909-8909-090909090901";
const CAP_AVAIL = "f50a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a01";
const RES_A = "f50b0b0b-0b0b-4b0b-8b0b-0b0b0b0b0b01";
const CAPACITY_A = "f50c0c0c-0c0c-4c0c-8c0c-0c0c0c0c0c01";
const RES_AVAIL = "f50d0d0d-0d0d-4d0d-8d0d-0d0d0d0d0d01";
const PERM_A = "f50e0e0e-0e0e-4e0e-8e0e-0e0e0e0e0e01";
const EPOBS_A = "f50f0f0f-0f0f-4f0f-8f0f-0f0f0f0f0f01";
const EVIDENCE_A = "f5101010-1010-4101-8101-101010101001";

const TS = "2026-08-24T10:00:00.000Z";
const FROM = "2026-08-24T10:00:00.000Z";
const UNTIL_NOON = "2026-08-24T12:00:00.000Z";
const AT = "2026-08-24T11:00:00.000Z";
const AT_AFTER = "2026-08-24T13:00:00.000Z";

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

function capReq(
  overrides: Partial<InterventionCapabilityRequirementDeclaration> = {}
): InterventionCapabilityRequirementDeclaration {
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
    ...overrides,
  };
}

function resReq(
  overrides: Partial<InterventionResourceRequirementDeclaration> = {}
): InterventionResourceRequirementDeclaration {
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
    ...overrides,
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
    id: RES_A,
    project_id: PROJECT_ID,
    holder_entity_id: ENTITY_HOLDER,
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

function baseProject(extras: Partial<ProjectState> = {}): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    reality_entities: [
      entity(ENTITY_PIPE, "pipe-A"),
      entity(ENTITY_ACTOR_A, "actor-A"),
      entity(ENTITY_ACTOR_B, "actor-B"),
      entity(ENTITY_HOLDER, "holder-B"),
    ],
    intervention_declarations: [],
    decision_space_declarations: [],
    decision_option_declarations: [],
    decision_option_actor_candidate_declarations: [],
    ...extras,
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
  let next = applyPatch(
    baseProject(),
    patch("intervention_declaration", INT_A, intervention())
  );
  next = applyPatch(
    next,
    patch("decision_space_declaration", SPACE_D, decisionSpace())
  );
  next = applyPatch(
    next,
    patch("decision_option_declaration", OPT_INT_A, interventionOption())
  );
  return next;
}

function withPositiveComposition(): ProjectState {
  let next = withSpaceOptionIntervention();
  next = applyPatch(next, patch("intervention_capability_requirement_declaration", CAP_REQ, capReq()));
  next = applyPatch(next, patch("intervention_resource_requirement_declaration", RES_REQ, resReq()));
  next = applyPatch(next, patch("capability_declaration", CAP_A, capability()));
  next = applyPatch(
    next,
    {
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
    } as StatePatch
  );
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
  next = applyPatch(next, patch("resource_declaration", RES_A, resource()));
  next = applyPatch(
    next,
    patch("resource_capacity_declaration", CAPACITY_A, {
      id: CAPACITY_A,
      project_id: PROJECT_ID,
      resource_declaration_id: RES_A,
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
    patch("resource_availability_declaration", RES_AVAIL, {
      id: RES_AVAIL,
      project_id: PROJECT_ID,
      resource_declaration_id: RES_A,
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
    patch("intervention_permission_declaration", PERM_A, {
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
    } satisfies InterventionPermissionDeclaration)
  );
  next = applyPatch(
    next,
    patch("decision_option_actor_candidate_declaration", CAND_A, candidate())
  );
  return next;
}

describe("Agency Composition (GROUND-026)", () => {
  it("migrates 0.1.15 → 0.1.17 with empty candidate array", () => {
    assert.ok(validateProjectStateV0115(validProjectStateV0115).valid);
    const migrated = migrateProjectState(validProjectStateV0115);
    assert.equal(migrated.schema_version, "0.1.25");
    assert.deepEqual(migrated.decision_option_actor_candidate_declarations, []);
    assert.ok(validateProjectState(migrated).valid);
  });

  it("persists Actor Candidate for INTERVENTION option", () => {
    const next = applyPatch(
      withSpaceOptionIntervention(),
      patch("decision_option_actor_candidate_declaration", CAND_A, candidate())
    );
    assert.equal(
      next.decision_option_actor_candidate_declarations[0]?.actor_entity_id,
      ENTITY_ACTOR_A
    );
    const dir = join(process.cwd(), "ground-core/storage/.agency-tmp");
    try {
      saveProject(next, { storageDir: dir });
      const loaded = loadProject(PROJECT_ID, { storageDir: dir });
      assert.equal(
        loaded.decision_option_actor_candidate_declarations[0]?.id,
        CAND_A
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("rejects unknown option / unknown actor / DO_NOTHING candidate", () => {
    const project = withSpaceOptionIntervention();
    assert.throws(
      () =>
        applyPatch(
          project,
          patch(
            "decision_option_actor_candidate_declaration",
            CAND_A,
            candidate({
              decision_option_declaration_id:
                "f4999999-9999-4999-8999-999999999999",
            })
          )
        ),
      /missing DecisionOptionDeclaration/
    );
    assert.throws(
      () =>
        applyPatch(
          project,
          patch(
            "decision_option_actor_candidate_declaration",
            CAND_A,
            candidate({
              actor_entity_id: "f4999999-9999-4999-8999-999999999999",
            })
          )
        ),
      /missing RealityEntity/
    );
    let withDn = applyPatch(
      project,
      patch("decision_option_declaration", OPT_DN, {
        ...interventionOption({ id: OPT_DN }),
        option: { kind: "DO_NOTHING" },
        declared_by: { kind: "human", label: "ops-dn" },
      })
    );
    assert.throws(
      () =>
        applyPatch(
          withDn,
          patch(
            "decision_option_actor_candidate_declaration",
            CAND_A,
            candidate({ decision_option_declaration_id: OPT_DN })
          )
        ),
      /DO_NOTHING/
    );
  });

  it("does not auto-create candidates from Capability or Permission", () => {
    let next = withSpaceOptionIntervention();
    next = applyPatch(next, patch("capability_declaration", CAP_A, capability()));
    next = applyPatch(
      next,
      patch("intervention_permission_declaration", PERM_A, {
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
      } satisfies InterventionPermissionDeclaration)
    );
    const composition = assessDecisionSpaceActorComposition(next, SPACE_D, AT);
    assert.equal(composition.has_actor_candidates, false);
    assert.equal(composition.actor_candidate_count, 0);
  });

  it("rejects same-declarer semantic duplicate across Option declaration IDs", () => {
    let next = withSpaceOptionIntervention();
    next = applyPatch(
      next,
      patch(
        "decision_option_declaration",
        OPT_INT_B,
        interventionOption({
          id: OPT_INT_B,
          declared_by: { kind: "human", label: "ops-b" },
        })
      )
    );
    next = applyPatch(
      next,
      patch("decision_option_actor_candidate_declaration", CAND_A, candidate())
    );
    assert.throws(
      () =>
        applyPatch(
          next,
          patch(
            "decision_option_actor_candidate_declaration",
            CAND_B,
            candidate({
              id: CAND_B,
              decision_option_declaration_id: OPT_INT_B,
            })
          )
        ),
      /duplicates overlapping/
    );
  });

  it("preserves different declarers and different actors without ranking", () => {
    let next = withSpaceOptionIntervention();
    next = applyPatch(
      next,
      patch("decision_option_actor_candidate_declaration", CAND_A, candidate())
    );
    next = applyPatch(
      next,
      patch(
        "decision_option_actor_candidate_declaration",
        CAND_B,
        candidate({
          id: CAND_B,
          declared_by: { kind: "human", label: "ops-b" },
        })
      )
    );
    next = applyPatch(
      next,
      patch(
        "decision_option_actor_candidate_declaration",
        CAND_C,
        candidate({
          id: CAND_C,
          actor_entity_id: ENTITY_ACTOR_B,
          declared_by: { kind: "human", label: "ops-c" },
        })
      )
    );
    const positions = groupDecisionOptionActorCandidatePositions(
      next,
      SPACE_D,
      AT
    );
    assert.equal(positions.length, 2);
    const actorA = positions.find(
      (entry) => entry.actor_entity_id === ENTITY_ACTOR_A
    );
    assert.equal(actorA?.candidate_declaration_ids.length, 2);
    assert.equal(actorA?.has_multiple_declarations, true);
    const json = JSON.stringify(positions);
    assert.doesNotMatch(json, /rank|score|preferred|selected|best_actor/);
  });

  it("matches Capability exactly for candidate actor only", () => {
    let next = withSpaceOptionIntervention();
    next = applyPatch(next, patch("intervention_capability_requirement_declaration", CAP_REQ, capReq()));
    next = applyPatch(next, patch("capability_declaration", CAP_A, capability()));
    next = applyPatch(
      next,
      patch(
        "capability_declaration",
        CAP_B,
        capability({
          id: CAP_B,
          holder_entity_id: ENTITY_ACTOR_B,
        })
      )
    );
    next = applyPatch(
      next,
      patch("decision_option_actor_candidate_declaration", CAND_A, candidate())
    );
    const matches = assessCapabilityRequirementMatchesForActor(
      next,
      INT_A,
      ENTITY_ACTOR_A,
      AT
    );
    assert.equal(matches[0]?.has_matching_capability_declaration, true);
    assert.deepEqual(matches[0]?.matching_capability_declaration_ids, [CAP_A]);
    assert.doesNotMatch(
      JSON.stringify(matches),
      /satisfied|capable|feasible|can_execute/
    );
  });

  it("rejects Capability key/scope/UNSCOPED mismatch", () => {
    let next = withSpaceOptionIntervention();
    next = applyPatch(next, patch("intervention_capability_requirement_declaration", CAP_REQ, capReq()));
    next = applyPatch(
      next,
      patch(
        "capability_declaration",
        CAP_A,
        capability({ capability_key: "other_key" })
      )
    );
    assert.equal(
      assessCapabilityRequirementMatchesForActor(next, INT_A, ENTITY_ACTOR_A, AT)[0]
        ?.has_matching_capability_declaration,
      false
    );
    next = applyPatch(
      next,
      patch(
        "capability_declaration",
        CAP_A,
        capability({ scope: { kind: "UNSCOPED" } })
      )
    );
    assert.equal(
      assessCapabilityRequirementMatchesForActor(next, INT_A, ENTITY_ACTOR_A, AT)[0]
        ?.has_matching_capability_declaration,
      false
    );
  });

  it("matches Resource by key/unit/scope with holder independent of actor", () => {
    let next = withSpaceOptionIntervention();
    next = applyPatch(next, patch("intervention_resource_requirement_declaration", RES_REQ, resReq()));
    next = applyPatch(next, patch("resource_declaration", RES_A, resource()));
    next = applyPatch(
      next,
      patch("decision_option_actor_candidate_declaration", CAND_A, candidate())
    );
    const matches = assessResourceRequirementMatches(next, INT_A, AT);
    assert.equal(matches[0]?.has_matching_resource_declaration, true);
    assert.deepEqual(matches[0]?.matching_resource_holder_ids, [ENTITY_HOLDER]);
    assert.doesNotMatch(
      JSON.stringify(matches),
      /sufficient|remaining|feasible|requirement_satisfied/
    );
  });

  it("preserves divergent Resource amounts without sufficiency", () => {
    let next = withSpaceOptionIntervention();
    next = applyPatch(next, patch("intervention_resource_requirement_declaration", RES_REQ, resReq()));
    next = applyPatch(
      next,
      patch(
        "intervention_resource_requirement_declaration",
        RES_REQ_B,
        resReq({
          id: RES_REQ_B,
          required_amount: { kind: "POINT", value: 20 },
          declared_by: { kind: "human", label: "ops-b" },
        })
      )
    );
    next = applyPatch(next, patch("resource_declaration", RES_A, resource()));
    next = applyPatch(
      next,
      patch("resource_capacity_declaration", CAPACITY_A, {
        id: CAPACITY_A,
        project_id: PROJECT_ID,
        resource_declaration_id: RES_A,
        capacity: { kind: "POINT", value: 5 },
        valid_from: FROM,
        valid_until: null,
        declared_by: { kind: "human", label: "ops" },
        recorded_at: TS,
        note: null,
        created_at: TS,
        updated_at: TS,
      } satisfies ResourceCapacityDeclaration)
    );
    const matches = assessResourceRequirementMatches(next, INT_A, AT);
    assert.equal(matches[0]?.has_requirement_divergence, true);
    assert.equal(matches[0]?.required_amounts.length, 2);
    assert.doesNotMatch(
      JSON.stringify(matches),
      /insufficient|sufficient|remaining|feasible/
    );
  });

  it("all-positive composition still has no feasibility verdict", () => {
    const next = withPositiveComposition();
    const before = structuredClone(next);
    const composition = assessDecisionSpaceActorComposition(next, SPACE_D, AT);
    const actor = composition.actor_compositions[0];
    assert.equal(composition.has_actor_candidates, true);
    assert.equal(actor?.permission.status, "PERMIT_DECLARED");
    assert.equal(actor?.has_matching_verified_capability, true);
    assert.equal(actor?.has_matching_available_capability, true);
    assert.equal(actor?.has_matching_available_resource, true);
    assert.equal(
      actor?.resource_requirement_matches[0]?.matching_resource_holder_ids[0],
      ENTITY_HOLDER
    );
    const json = JSON.stringify(composition);
    assert.doesNotMatch(
      json,
      /feasible|infeasible|ready_to_execute|can_execute|eligible|selected|recommended|best_actor|requirement_satisfied|capacity_sufficient|remaining/
    );
    assert.deepEqual(next, before);
    const again = assessDecisionSpaceActorComposition(next, SPACE_D, AT);
    assert.deepEqual(composition, again);
  });

  it("PROHIBIT / CONTESTED / NO permission leave candidate represented", () => {
    let next = withSpaceOptionIntervention();
    next = applyPatch(
      next,
      patch("decision_option_actor_candidate_declaration", CAND_A, candidate())
    );
    let composition = assessDecisionSpaceActorComposition(next, SPACE_D, AT);
    assert.equal(composition.actor_compositions[0]?.permission.status, "NO_PERMISSION_DECLARATIONS");
    assert.equal(composition.has_actor_candidates, true);

    next = applyPatch(
      next,
      patch("intervention_permission_declaration", PERM_A, {
        id: PERM_A,
        project_id: PROJECT_ID,
        actor_entity_id: ENTITY_ACTOR_A,
        intervention_id: INT_A,
        effect: "PROHIBIT",
        valid_from: FROM,
        valid_until: null,
        declared_by: { kind: "human", label: "gov" },
        recorded_at: TS,
        note: null,
        created_at: TS,
        updated_at: TS,
      } satisfies InterventionPermissionDeclaration)
    );
    composition = assessDecisionSpaceActorComposition(next, SPACE_D, AT);
    assert.equal(composition.actor_compositions[0]?.permission.status, "PROHIBIT_DECLARED");
    assert.equal(composition.has_actor_candidates, true);
  });

  it("DO_NOTHING is excluded from actor composition", () => {
    let next = withSpaceOptionIntervention();
    next = applyPatch(
      next,
      patch("decision_option_declaration", OPT_DN, {
        ...interventionOption({ id: OPT_DN }),
        option: { kind: "DO_NOTHING" },
        declared_by: { kind: "human", label: "ops-dn" },
      })
    );
    next = applyPatch(
      next,
      patch("decision_option_actor_candidate_declaration", CAND_A, candidate())
    );
    const composition = assessDecisionSpaceActorComposition(next, SPACE_D, AT);
    assert.equal(
      composition.decision_space.has_do_nothing_option,
      true
    );
    assert.equal(
      composition.actor_candidate_positions.every(
        (entry) => entry.intervention_id === INT_A
      ),
      true
    );
  });

  it("uses [valid_from, valid_until) and deletion guards", () => {
    const cand = candidate({ valid_from: FROM, valid_until: UNTIL_NOON });
    assert.equal(isDecisionOptionActorCandidateActiveAt(cand, AT), true);
    assert.equal(isDecisionOptionActorCandidateActiveAt(cand, UNTIL_NOON), false);

    let next = applyPatch(
      withSpaceOptionIntervention(),
      patch("decision_option_actor_candidate_declaration", CAND_A, candidate())
    );
    assert.throws(
      () =>
        applyPatch(next, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            { op: "delete", entity: "decision_option_declaration", entity_id: OPT_INT_A },
          ],
        }),
      /decision_option_actor_candidate_declaration/
    );
    assert.throws(
      () =>
        applyPatch(next, {
          schema_version: "0.1.24",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            { op: "delete", entity: "reality_entity", entity_id: ENTITY_ACTOR_A },
          ],
        }),
      /decision_option_actor_candidate_declaration/
    );
  });

  it("exposes semantic candidate key and option-without-candidate list", () => {
    const next = withSpaceOptionIntervention();
    const composition = assessDecisionSpaceActorComposition(next, SPACE_D, AT);
    assert.deepEqual(
      composition.intervention_option_ids_without_actor_candidates,
      [OPT_INT_A]
    );
    assert.equal(
      decisionOptionActorCandidateSemanticKey({
        decision_space_id: SPACE_D,
        intervention_id: INT_A,
        actor_entity_id: ENTITY_ACTOR_A,
      }),
      `actor-candidate|${SPACE_D}|${INT_A}|${ENTITY_ACTOR_A}`
    );
  });
});
