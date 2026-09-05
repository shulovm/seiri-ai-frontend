import { compareTemporalInstants, temporalInstantKey } from "./temporal.js";
import { assessTemporalPrerequisite, isAdmissionTemporalRelationProven, haveVerifiedEqualValues } from "./temporal-admission.js";
import { randomUUID } from "node:crypto";
import { PatchError, ValidationError } from "./errors.js";
import { normalizeProjectState } from "./migrate.js";
import {
  normalizeReferenceCriterion,
  validateReferenceCriterion,
} from "./reality/reference-criterion.js";
import { semanticValuesEqual } from "./reality/semantic-equality.js";
import {
  SCHEMA_VERSION,
  type Blocker,
  type CurrentState,
  type DecisionBasisReference,
  type DecisionOptionActorCandidateDeclaration,
  type DecisionOptionDeclaration,
  type DecisionOptionTarget,
  type DecisionSpaceDeclaration,
  type Decision,
  type FutureScenario,
  type AuthorityContestDeclaration,
  type AuthorityContestTarget,
  type AuthorityDeclaration,
  type AuthorityDelegationDeclaration,
  type AuthorityPower,
  type CapabilityAvailabilityDeclaration,
  type CapabilityAvailabilityStatus,
  type CapabilityDeclaration,
  type CapabilityScope,
  type CapabilityVerificationDeclaration,
  type GovernanceScope,
  type Hypothesis,
  type ImpactDeclaration,
  type ImpactDirection,
  type ImpactMeasure,
  type ImpactMeasureDeclaration,
  type InterventionCapabilityRequirementDeclaration,
  type InterventionDeclaration,
  type InterventionPermissionDeclaration,
  type InterventionPermissionEffect,
  type InterventionResourceRequirementDeclaration,
  type InterventionScope,
  type Judgment,
  type MandateDeclaration,
  type MandateKind,
  type NextAction,
  type Observation,
  type PatchEntity,
  type PatchOperation,
  type Project,
  type ProjectState,
  type ObjectiveDependency,
  type ObjectiveRequirement,
  type RealityObjective,
  type ReferenceCondition,
  type ReferenceCriterion,
  type ReferenceDoc,
  type ResourceAvailabilityDeclaration,
  type ResourceAvailabilityStatus,
  type ResourceCapacity,
  type ResourceCapacityDeclaration,
  type ResourceDeclaration,
  type ResourceRequirementAmount,
  type ResourceScope,
  type ScenarioLikelihoodEstimate,
  type ScenarioStateProjection,
  type StandingDeclaration,
  type StandingRight,
  type StandingScope,
  type StatePatch,
  type RealityDecisionDeclaration,
  type RealityDecisionSelection,
  type DecisionContextSnapshotV1,
  type InterventionIntentDeclaration,
  type InterventionIntentDisposition,
  type InterventionCommitmentDeclaration,
  type InterventionCommitmentAcceptanceDeclaration,
  type InterventionCommitmentTemporalTermDeclaration,
  type InterventionCommitmentConditionalTermDeclaration,
  type InterventionResourceCommitmentDeclaration,
  type InterventionResourceReservationDeclaration,
  type ResourceCommitmentAmount,
  type ResourceReservationAmount,
  type ResourceReservationScope,
  type CommitmentTemporalTermKind,
  type CommitmentConditionRole,
  type CommitmentBasisReference,
} from "./types.js";
import {
  governanceScopesEqual,
  standingScopesEqual,
} from "./reality/governance-core.js";
import { capabilityScopesEqual } from "./reality/capability-core.js";
import {
  decisionBasisKey,
  decisionOptionSemanticKey,
} from "./reality/decision-core.js";
import {
  buildDecisionContextSnapshot,
  realityDecisionSemanticKey,
} from "./reality/decision-memory-core.js";
import {
  decisionOptionActorCandidateSemanticKey,
} from "./reality/agency-core.js";
import {
  interventionScopesEqual,
  resourceRequirementAmountKey,
  resourceRequirementAmountsEqual,
} from "./reality/intervention-core.js";
import {
  interventionCommitmentSemanticKey,
} from "./reality/commitment-core.js";
import {
  resourceCommitmentSemanticKey,
} from "./reality/resource-commitment-core.js";
import {
  resourceCapacityKey,
  resourceScopesEqual,
} from "./reality/resource-core.js";
import { validateProjectState, validateStatePatch } from "./validate.js";

export interface CreateEmptyProjectInput {
  title: string;
  summary?: string;
}

type ArrayEntityKey =
  | "goals"
  | "blockers"
  | "next_actions"
  | "decisions"
  | "hypotheses"
  | "reference_docs"
  | "observations"
  | "judgments"
  | "reality_entities"
  | "reality_events"
  | "reality_states"
  | "epistemic_observations"
  | "evidence"
  | "claims"
  | "claim_evidence_links"
  | "reference_conditions"
  | "reality_objectives"
  | "objective_requirements"
  | "objective_dependencies"
  | "future_scenarios"
  | "scenario_state_projections"
  | "scenario_likelihood_estimates"
  | "impact_declarations"
  | "impact_measure_declarations"
  | "authority_declarations"
  | "standing_declarations"
  | "mandate_declarations"
  | "authority_delegation_declarations"
  | "authority_contest_declarations"
  | "capability_declarations"
  | "capability_verification_declarations"
  | "capability_availability_declarations"
  | "resource_declarations"
  | "resource_capacity_declarations"
  | "resource_availability_declarations"
  | "intervention_declarations"
  | "intervention_capability_requirement_declarations"
  | "intervention_resource_requirement_declarations"
  | "intervention_permission_declarations"
  | "decision_space_declarations"
  | "decision_option_declarations"
  | "decision_option_actor_candidate_declarations"
  | "reality_decision_declarations"
  | "intervention_intent_declarations"
  | "intervention_commitment_declarations"
  | "intervention_commitment_acceptance_declarations"
  | "intervention_commitment_temporal_term_declarations"
  | "intervention_commitment_conditional_term_declarations"
  | "intervention_resource_commitment_declarations"
  | "intervention_resource_reservation_declarations";

const ARRAY_ENTITY_MAP: Record<
  Exclude<PatchEntity, "project" | "current_state">,
  ArrayEntityKey
> = {
  goal: "goals",
  blocker: "blockers",
  next_action: "next_actions",
  decision: "decisions",
  hypothesis: "hypotheses",
  reference_doc: "reference_docs",
  observation: "observations",
  judgment: "judgments",
  reality_entity: "reality_entities",
  reality_event: "reality_events",
  reality_state: "reality_states",
  epistemic_observation: "epistemic_observations",
  evidence: "evidence",
  claim: "claims",
  claim_evidence_link: "claim_evidence_links",
  reference_condition: "reference_conditions",
  reality_objective: "reality_objectives",
  objective_requirement: "objective_requirements",
  objective_dependency: "objective_dependencies",
  future_scenario: "future_scenarios",
  scenario_state_projection: "scenario_state_projections",
  scenario_likelihood_estimate: "scenario_likelihood_estimates",
  impact_declaration: "impact_declarations",
  impact_measure_declaration: "impact_measure_declarations",
  authority_declaration: "authority_declarations",
  standing_declaration: "standing_declarations",
  mandate_declaration: "mandate_declarations",
  authority_delegation_declaration: "authority_delegation_declarations",
  authority_contest_declaration: "authority_contest_declarations",
  capability_declaration: "capability_declarations",
  capability_verification_declaration: "capability_verification_declarations",
  capability_availability_declaration: "capability_availability_declarations",
  resource_declaration: "resource_declarations",
  resource_capacity_declaration: "resource_capacity_declarations",
  resource_availability_declaration: "resource_availability_declarations",
  intervention_declaration: "intervention_declarations",
  intervention_capability_requirement_declaration:
    "intervention_capability_requirement_declarations",
  intervention_resource_requirement_declaration:
    "intervention_resource_requirement_declarations",
  intervention_permission_declaration: "intervention_permission_declarations",
  decision_space_declaration: "decision_space_declarations",
  decision_option_declaration: "decision_option_declarations",
  decision_option_actor_candidate_declaration:
    "decision_option_actor_candidate_declarations",
  reality_decision_declaration: "reality_decision_declarations",
  intervention_intent_declaration: "intervention_intent_declarations",
  intervention_commitment_declaration: "intervention_commitment_declarations",
  intervention_commitment_acceptance_declaration:
    "intervention_commitment_acceptance_declarations",
  intervention_commitment_temporal_term_declaration:
    "intervention_commitment_temporal_term_declarations",
  intervention_commitment_conditional_term_declaration:
    "intervention_commitment_conditional_term_declarations",
  intervention_resource_commitment_declaration:
    "intervention_resource_commitment_declarations",
  intervention_resource_reservation_declaration:
    "intervention_resource_reservation_declarations",
};

const STATUS_CHANGE_ENTITIES: PatchEntity[] = [
  "project",
  "goal",
  "blocker",
  "next_action",
  "decision",
  "hypothesis",
  "reference_doc",
];

export function createEmptyProject(input: CreateEmptyProjectInput): ProjectState {
  const now = new Date().toISOString();
  const projectId = randomUUID();
  const currentStateId = randomUUID();
  const summary = input.summary ?? "";

  const state: ProjectState = {
    schema_version: SCHEMA_VERSION,
    project: {
      id: projectId,
      title: input.title,
      summary,
      status: "active",
      created_at: now,
      updated_at: now,
    },
    goals: [],
    current_state: {
      id: currentStateId,
      project_id: projectId,
      primary_goal_id: null,
      primary_next_action_id: null,
      summary: summary || "プロジェクトを開始しました。",
      phase: null,
      confidence: null,
      updated_at: now,
    },
    blockers: [],
    next_actions: [],
    decisions: [],
    hypotheses: [],
    reference_docs: [],
    observations: [],
    judgments: [],
    goal_edges: [],
    reality_entities: [],
    reality_events: [],
    reality_states: [],
    epistemic_observations: [],
    evidence: [],
    claims: [],
    claim_evidence_links: [],
    reference_conditions: [],
    reality_objectives: [],
    objective_requirements: [],
    objective_dependencies: [],
    future_scenarios: [],
    scenario_state_projections: [],
    scenario_likelihood_estimates: [],
    impact_declarations: [],
    impact_measure_declarations: [],
    authority_declarations: [],
    standing_declarations: [],
    mandate_declarations: [],
    authority_delegation_declarations: [],
    authority_contest_declarations: [],
    capability_declarations: [],
    capability_verification_declarations: [],
    capability_availability_declarations: [],
    resource_declarations: [],
    resource_capacity_declarations: [],
    resource_availability_declarations: [],
    intervention_declarations: [],
    intervention_capability_requirement_declarations: [],
    intervention_resource_requirement_declarations: [],
    intervention_permission_declarations: [],
    decision_space_declarations: [],
    decision_option_declarations: [],
    decision_option_actor_candidate_declarations: [],
    reality_decision_declarations: [],
    intervention_intent_declarations: [],
    intervention_commitment_declarations: [],
    intervention_commitment_acceptance_declarations: [],
    intervention_commitment_temporal_term_declarations: [],
    intervention_commitment_conditional_term_declarations: [],
    intervention_resource_commitment_declarations: [],
    intervention_resource_reservation_declarations: [],
    extensions: {},
    updated_at: now,
  };

  const validation = validateProjectState(state);
  if (!validation.valid) {
    throw new ValidationError(
      "createEmptyProject produced invalid ProjectState",
      validation.errors
    );
  }

  return state;
}

export function applyPatch(
  projectState: ProjectState,
  patch: StatePatch
): ProjectState {
  const patchValidation = validateStatePatch(patch);
  if (!patchValidation.valid) {
    throw new PatchError("Invalid patch schema", patchValidation.errors);
  }

  const state = normalizeProjectState(projectState);

  if (patch.project_id !== state.project.id) {
    throw new PatchError(
      `Patch project_id (${patch.project_id}) does not match project id (${state.project.id})`
    );
  }

  const next = structuredClone(state);
  const now = new Date().toISOString();

  for (const operation of patch.operations) {
    applyOperation(next, operation, now);
  }

  next.schema_version = SCHEMA_VERSION;
  next.project.updated_at = now;
  next.updated_at = now;

  assertInvariants(next);

  const resultValidation = validateProjectState(next);
  if (!resultValidation.valid) {
    throw new ValidationError(
      "Patch produced invalid ProjectState",
      resultValidation.errors
    );
  }

  return next;
}

function applyOperation(
  state: ProjectState,
  operation: PatchOperation,
  now: string
): void {
  switch (operation.op) {
    case "upsert":
      applyUpsert(state, operation, now);
      break;
    case "status_change":
      applyStatusChange(state, operation, now);
      break;
    case "delete":
      applyDelete(state, operation);
      break;
    default:
      throw new PatchError(`Unsupported patch op: ${String(operation.op)}`);
  }
}

function applyUpsert(
  state: ProjectState,
  operation: PatchOperation,
  now: string
): void {
  if (!operation.payload) {
    throw new PatchError("upsert requires payload");
  }

  const projectId = state.project.id;

  if (operation.entity === "reality_event") {
    assertRealityEventUpsert(state, operation);
  }

  if (operation.entity === "reference_condition") {
    assertReferenceConditionUpsert(state, operation);
    if (operation.payload?.criterion) {
      operation.payload = {
        ...operation.payload,
        criterion: normalizeReferenceCriterion(
          operation.payload.criterion as ReferenceCriterion
        ),
      };
    }
  }

  if (operation.entity === "reality_objective") {
    assertRealityObjectiveUpsert(state, operation);
  }

  if (operation.entity === "objective_requirement") {
    assertObjectiveRequirementUpsert(state, operation);
  }

  if (operation.entity === "objective_dependency") {
    assertObjectiveDependencyUpsert(state, operation);
  }

  if (operation.entity === "future_scenario") {
    assertFutureScenarioUpsert(state, operation);
  }

  if (operation.entity === "scenario_state_projection") {
    assertScenarioStateProjectionUpsert(state, operation);
  }

  if (operation.entity === "scenario_likelihood_estimate") {
    assertScenarioLikelihoodEstimateUpsert(state, operation);
  }

  if (operation.entity === "impact_declaration") {
    assertImpactDeclarationUpsert(state, operation);
  }

  if (operation.entity === "impact_measure_declaration") {
    assertImpactMeasureDeclarationUpsert(state, operation);
  }

  if (operation.entity === "authority_declaration") {
    assertAuthorityDeclarationUpsert(state, operation);
  }

  if (operation.entity === "standing_declaration") {
    assertStandingDeclarationUpsert(state, operation);
  }

  if (operation.entity === "mandate_declaration") {
    assertMandateDeclarationUpsert(state, operation);
  }

  if (operation.entity === "authority_delegation_declaration") {
    assertAuthorityDelegationDeclarationUpsert(state, operation);
  }

  if (operation.entity === "authority_contest_declaration") {
    assertAuthorityContestDeclarationUpsert(state, operation);
  }

  if (operation.entity === "capability_declaration") {
    assertCapabilityDeclarationUpsert(state, operation);
  }

  if (operation.entity === "capability_verification_declaration") {
    assertCapabilityVerificationDeclarationUpsert(state, operation);
  }

  if (operation.entity === "capability_availability_declaration") {
    assertCapabilityAvailabilityDeclarationUpsert(state, operation);
  }

  if (operation.entity === "resource_declaration") {
    assertResourceDeclarationUpsert(state, operation);
  }

  if (operation.entity === "resource_capacity_declaration") {
    assertResourceCapacityDeclarationUpsert(state, operation);
  }

  if (operation.entity === "resource_availability_declaration") {
    assertResourceAvailabilityDeclarationUpsert(state, operation);
  }

  if (operation.entity === "intervention_declaration") {
    assertInterventionDeclarationUpsert(state, operation);
  }

  if (operation.entity === "intervention_capability_requirement_declaration") {
    assertInterventionCapabilityRequirementDeclarationUpsert(state, operation);
  }

  if (operation.entity === "intervention_resource_requirement_declaration") {
    assertInterventionResourceRequirementDeclarationUpsert(state, operation);
  }

  if (operation.entity === "intervention_permission_declaration") {
    assertInterventionPermissionDeclarationUpsert(state, operation);
  }

  if (operation.entity === "decision_space_declaration") {
    assertDecisionSpaceDeclarationUpsert(state, operation);
  }

  if (operation.entity === "decision_option_declaration") {
    assertDecisionOptionDeclarationUpsert(state, operation);
  }

  if (operation.entity === "decision_option_actor_candidate_declaration") {
    assertDecisionOptionActorCandidateDeclarationUpsert(state, operation);
  }

  if (operation.entity === "reality_decision_declaration") {
    assertRealityDecisionDeclarationUpsert(state, operation, now);
  }

  if (operation.entity === "intervention_intent_declaration") {
    assertInterventionIntentDeclarationUpsert(state, operation);
  }

  if (operation.entity === "intervention_commitment_declaration") {
    assertInterventionCommitmentDeclarationUpsert(state, operation);
  }

  if (operation.entity === "intervention_commitment_acceptance_declaration") {
    assertInterventionCommitmentAcceptanceDeclarationUpsert(state, operation);
  }

  if (operation.entity === "intervention_commitment_temporal_term_declaration") {
    assertInterventionCommitmentTemporalTermDeclarationUpsert(state, operation);
  }

  if (operation.entity === "intervention_commitment_conditional_term_declaration") {
    assertInterventionCommitmentConditionalTermDeclarationUpsert(state, operation);
  }

  if (operation.entity === "intervention_resource_commitment_declaration") {
    assertInterventionResourceCommitmentDeclarationUpsert(state, operation);
  }

  if (operation.entity === "intervention_resource_reservation_declaration") {
    assertInterventionResourceReservationDeclarationUpsert(state, operation);
  }

  if (operation.entity === "project") {
    if (operation.entity_id !== state.project.id) {
      throw new PatchError("Cannot upsert project with mismatched entity_id");
    }
    state.project = {
      ...state.project,
      ...operation.payload,
      id: state.project.id,
      updated_at: now,
    } as Project;
    return;
  }

  if (operation.entity === "current_state") {
    if (operation.entity_id !== state.current_state.id) {
      throw new PatchError(
        "Cannot upsert current_state with different entity_id"
      );
    }
    state.current_state = {
      ...state.current_state,
      ...operation.payload,
      id: state.current_state.id,
      project_id: projectId,
      updated_at: now,
    } as CurrentState;
    return;
  }

  const arrayKey = ARRAY_ENTITY_MAP[operation.entity];
  // Entity is already narrowed away from project/current_state; array + payload share id/project_id.
  upsertArrayEntity(
    state[arrayKey] as Array<{ id: string; project_id: string }>,
    operation.entity_id,
    projectId,
    (operation.payload ?? {}) as Partial<{ id: string; project_id: string }>,
    now
  );
}

function upsertArrayEntity<T extends { id: string; project_id: string }>(
  array: T[],
  entityId: string,
  projectId: string,
  payload: Partial<T>,
  now: string
): void {
  const index = array.findIndex((item) => item.id === entityId);

  if (index >= 0) {
    array[index] = {
      ...array[index],
      ...payload,
      id: entityId,
      project_id: projectId,
      updated_at: now,
    } as T;
    return;
  }

  const createdAt =
    "created_at" in payload && typeof payload.created_at === "string"
      ? payload.created_at
      : now;

  // Runtime invariant: applyPatch ends with validateProjectState; T is the entity array element type.
  array.push({
    ...payload,
    id: entityId,
    project_id: projectId,
    created_at: createdAt,
    updated_at: now,
  } as unknown as T);
}

function applyStatusChange(
  state: ProjectState,
  operation: PatchOperation,
  now: string
): void {
  if (!operation.status) {
    throw new PatchError("status_change requires status");
  }

  if (operation.entity === "current_state") {
    throw new PatchError("current_state does not support status_change");
  }

  if (operation.entity === "observation" || operation.entity === "judgment") {
    throw new PatchError(`${operation.entity} does not support status_change`);
  }

  if (operation.entity === "project") {
    if (operation.entity_id !== state.project.id) {
      throw new PatchError("Project not found for status_change");
    }
    state.project = {
      ...state.project,
      status: operation.status as Project["status"],
      updated_at: now,
    };
    return;
  }

  if (!STATUS_CHANGE_ENTITIES.includes(operation.entity)) {
    throw new PatchError(`${operation.entity} does not support status_change`);
  }

  const arrayKey = ARRAY_ENTITY_MAP[operation.entity];
  const item = state[arrayKey].find((entry) => entry.id === operation.entity_id);

  if (!item) {
    throw new PatchError(
      `${operation.entity} not found for status_change: ${operation.entity_id}`
    );
  }

  (item as { status: string; updated_at: string }).status = operation.status;
  item.updated_at = now;
}

function applyDelete(
  state: ProjectState,
  operation: PatchOperation
): void {
  if (operation.entity === "project" || operation.entity === "current_state") {
    throw new PatchError(`Cannot delete ${operation.entity}`);
  }

  assertEntityDeletable(state, operation.entity, operation.entity_id);

  const arrayKey = ARRAY_ENTITY_MAP[operation.entity];
  const index = state[arrayKey].findIndex(
    (entry) => entry.id === operation.entity_id
  );

  if (index < 0) {
    throw new PatchError(
      `${operation.entity} not found for delete: ${operation.entity_id}`
    );
  }

  state[arrayKey].splice(index, 1);
}

function assertEntityDeletable(
  state: ProjectState,
  entity: PatchEntity,
  entityId: string
): void {
  if (entity === "goal") {
    assertGoalDeletable(state, entityId);
    return;
  }

  if (entity === "blocker") {
    const referenced = state.next_actions.some(
      (action) => action.blocker_id === entityId
    );
    if (referenced) {
      throw new PatchError(
        `Cannot delete blocker ${entityId}: referenced by next_action.blocker_id`
      );
    }
  }

  if (entity === "next_action") {
    if (state.current_state.primary_next_action_id === entityId) {
      throw new PatchError(
        `Cannot delete next_action ${entityId}: referenced by current_state.primary_next_action_id`
      );
    }

    const referenced = state.next_actions.some(
      (action) => action.depends_on_action_id === entityId
    );
    if (referenced) {
      throw new PatchError(
        `Cannot delete next_action ${entityId}: referenced by next_action.depends_on_action_id`
      );
    }
  }

  if (entity === "observation") {
    const referenced = state.judgments.some(
      (judgment) => judgment.observation_id === entityId
    );
    if (referenced) {
      throw new PatchError(
        `Cannot delete observation ${entityId}: referenced by judgment.observation_id`
      );
    }
  }

  if (entity === "reality_entity") {
    const referencedByState = state.reality_states.some(
      (entry) => entry.subject_id === entityId
    );
    if (referencedByState) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by reality_state.subject_id`
      );
    }
    const referencedByEvent = state.reality_events.some((entry) =>
      entry.subject_ids.includes(entityId)
    );
    if (referencedByEvent) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by reality_event.subject_ids`
      );
    }
    const referencedByClaim = state.claims.some(
      (entry) => entry.subject_id === entityId
    );
    if (referencedByClaim) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by claim.subject_id`
      );
    }
    const referencedByEpObs = state.epistemic_observations.some((entry) =>
      entry.subject_ids.includes(entityId)
    );
    if (referencedByEpObs) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by epistemic_observation.subject_ids`
      );
    }
    const referencedByRef = state.reference_conditions.some(
      (entry) =>
        entry.subject_id === entityId ||
        entry.declared_by.entity_id === entityId
    );
    if (referencedByRef) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by reference_condition`
      );
    }
    const referencedByObjective = state.reality_objectives.some(
      (entry) => entry.declared_by.entity_id === entityId
    );
    if (referencedByObjective) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by reality_objective.declared_by`
      );
    }
    const referencedByRequirement = state.objective_requirements.some(
      (entry) => entry.declared_by.entity_id === entityId
    );
    if (referencedByRequirement) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by objective_requirement.declared_by`
      );
    }
    const referencedByDependency = state.objective_dependencies.some(
      (entry) => entry.declared_by.entity_id === entityId
    );
    if (referencedByDependency) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by objective_dependency.declared_by`
      );
    }
    const referencedByProjection = state.scenario_state_projections.some(
      (entry) => entry.subject_id === entityId
    );
    if (referencedByProjection) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by scenario_state_projection.subject_id`
      );
    }
    const referencedByScenario = state.future_scenarios.some(
      (entry) => entry.declared_by.entity_id === entityId
    );
    if (referencedByScenario) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by future_scenario.declared_by`
      );
    }
    const referencedByLikelihood = state.scenario_likelihood_estimates.some(
      (entry) => entry.estimated_by.entity_id === entityId
    );
    if (referencedByLikelihood) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by scenario_likelihood_estimate.estimated_by`
      );
    }
    const referencedByImpactAffected = state.impact_declarations.some(
      (entry) => entry.affected_entity_id === entityId
    );
    if (referencedByImpactAffected) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by impact_declaration.affected_entity_id`
      );
    }
    const referencedByImpactDeclarer = state.impact_declarations.some(
      (entry) => entry.declared_by.entity_id === entityId
    );
    if (referencedByImpactDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by impact_declaration.declared_by`
      );
    }
    const referencedByMeasureDeclarer = state.impact_measure_declarations.some(
      (entry) => entry.declared_by.entity_id === entityId
    );
    if (referencedByMeasureDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by impact_measure_declaration.declared_by`
      );
    }
    const referencedByAuthorityHolder = state.authority_declarations.some(
      (entry) => entry.holder_entity_id === entityId
    );
    if (referencedByAuthorityHolder) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by authority_declaration.holder_entity_id`
      );
    }
    const referencedByAuthoritySubject = state.authority_declarations.some(
      (entry) =>
        entry.scope.kind === "SUBJECT_STATE" &&
        entry.scope.subject_id === entityId
    );
    if (referencedByAuthoritySubject) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by authority_declaration scope SUBJECT_STATE.subject_id`
      );
    }
    const referencedByAuthorityDeclarer = state.authority_declarations.some(
      (entry) => entry.declared_by.entity_id === entityId
    );
    if (referencedByAuthorityDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by authority_declaration.declared_by`
      );
    }
    const referencedByStandingHolder = state.standing_declarations.some(
      (entry) => entry.holder_entity_id === entityId
    );
    if (referencedByStandingHolder) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by standing_declaration.holder_entity_id`
      );
    }
    const referencedByStandingDeclarer = state.standing_declarations.some(
      (entry) => entry.declared_by.entity_id === entityId
    );
    if (referencedByStandingDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by standing_declaration.declared_by`
      );
    }
    const referencedByMandateHolder = state.mandate_declarations.some(
      (entry) => entry.holder_entity_id === entityId
    );
    if (referencedByMandateHolder) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by mandate_declaration.holder_entity_id`
      );
    }
    const referencedByMandateDeclarer = state.mandate_declarations.some(
      (entry) => entry.declared_by.entity_id === entityId
    );
    if (referencedByMandateDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by mandate_declaration.declared_by`
      );
    }
    const referencedByDelegator = state.authority_delegation_declarations.some(
      (entry) => entry.delegator_entity_id === entityId
    );
    if (referencedByDelegator) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by authority_delegation_declaration.delegator_entity_id`
      );
    }
    const referencedByDelegatee = state.authority_delegation_declarations.some(
      (entry) => entry.delegatee_entity_id === entityId
    );
    if (referencedByDelegatee) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by authority_delegation_declaration.delegatee_entity_id`
      );
    }
    const referencedByDelegationDeclarer =
      state.authority_delegation_declarations.some(
        (entry) => entry.declared_by.entity_id === entityId
      );
    if (referencedByDelegationDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by authority_delegation_declaration.declared_by`
      );
    }
    const referencedByContester = state.authority_contest_declarations.some(
      (entry) => entry.contesting_entity_id === entityId
    );
    if (referencedByContester) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by authority_contest_declaration.contesting_entity_id`
      );
    }
    const referencedByContestDeclarer = state.authority_contest_declarations.some(
      (entry) => entry.declared_by.entity_id === entityId
    );
    if (referencedByContestDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by authority_contest_declaration.declared_by`
      );
    }
    const referencedByCapabilityHolder = state.capability_declarations.some(
      (entry) => entry.holder_entity_id === entityId
    );
    if (referencedByCapabilityHolder) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by capability_declaration.holder_entity_id`
      );
    }
    const referencedByCapabilityScope = state.capability_declarations.some(
      (entry) =>
        (entry.scope.kind === "ENTITY" && entry.scope.entity_id === entityId) ||
        (entry.scope.kind === "SUBJECT_STATE" &&
          entry.scope.subject_id === entityId)
    );
    if (referencedByCapabilityScope) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by capability_declaration scope`
      );
    }
    const referencedByCapabilityDeclarer = state.capability_declarations.some(
      (entry) => entry.declared_by.entity_id === entityId
    );
    if (referencedByCapabilityDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by capability_declaration.declared_by`
      );
    }
    const referencedByVerifier = state.capability_verification_declarations.some(
      (entry) => entry.verified_by.entity_id === entityId
    );
    if (referencedByVerifier) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by capability_verification_declaration.verified_by`
      );
    }
    const referencedByAvailabilityDeclarer =
      state.capability_availability_declarations.some(
        (entry) => entry.declared_by.entity_id === entityId
      );
    if (referencedByAvailabilityDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by capability_availability_declaration.declared_by`
      );
    }

    const referencedByResourceHolder = state.resource_declarations.some(
      (entry) => entry.holder_entity_id === entityId
    );
    if (referencedByResourceHolder) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by resource_declaration.holder_entity_id`
      );
    }
    const referencedByResourceEntity = state.resource_declarations.some(
      (entry) => entry.resource_entity_id === entityId
    );
    if (referencedByResourceEntity) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by resource_declaration.resource_entity_id`
      );
    }
    const referencedByResourceScope = state.resource_declarations.some(
      (entry) =>
        (entry.scope.kind === "ENTITY" && entry.scope.entity_id === entityId) ||
        (entry.scope.kind === "SUBJECT_STATE" &&
          entry.scope.subject_id === entityId)
    );
    if (referencedByResourceScope) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by resource_declaration scope`
      );
    }
    const referencedByResourceDeclarer = state.resource_declarations.some(
      (entry) => entry.declared_by.entity_id === entityId
    );
    if (referencedByResourceDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by resource_declaration.declared_by`
      );
    }
    const referencedByResourceCapacityDeclarer =
      state.resource_capacity_declarations.some(
        (entry) => entry.declared_by.entity_id === entityId
      );
    if (referencedByResourceCapacityDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by resource_capacity_declaration.declared_by`
      );
    }
    const referencedByResourceAvailDeclarer =
      state.resource_availability_declarations.some(
        (entry) => entry.declared_by.entity_id === entityId
      );
    if (referencedByResourceAvailDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by resource_availability_declaration.declared_by`
      );
    }

    const referencedByInterventionTarget = state.intervention_declarations.some(
      (entry) =>
        (entry.target_scope.kind === "ENTITY" &&
          entry.target_scope.entity_id === entityId) ||
        (entry.target_scope.kind === "SUBJECT_STATE" &&
          entry.target_scope.subject_id === entityId)
    );
    if (referencedByInterventionTarget) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by intervention_declaration target_scope`
      );
    }
    const referencedByInterventionDeclarer = state.intervention_declarations.some(
      (entry) => entry.declared_by.entity_id === entityId
    );
    if (referencedByInterventionDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by intervention_declaration.declared_by`
      );
    }
    const referencedByInterventionCapabilityScope =
      state.intervention_capability_requirement_declarations.some(
        (entry) =>
          (entry.capability_scope.kind === "ENTITY" &&
            entry.capability_scope.entity_id === entityId) ||
          (entry.capability_scope.kind === "SUBJECT_STATE" &&
            entry.capability_scope.subject_id === entityId)
      );
    if (referencedByInterventionCapabilityScope) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by intervention_capability_requirement_declaration capability_scope`
      );
    }
    const referencedByInterventionCapabilityDeclarer =
      state.intervention_capability_requirement_declarations.some(
        (entry) => entry.declared_by.entity_id === entityId
      );
    if (referencedByInterventionCapabilityDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by intervention_capability_requirement_declaration.declared_by`
      );
    }
    const referencedByInterventionResourceScope =
      state.intervention_resource_requirement_declarations.some(
        (entry) =>
          (entry.resource_scope.kind === "ENTITY" &&
            entry.resource_scope.entity_id === entityId) ||
          (entry.resource_scope.kind === "SUBJECT_STATE" &&
            entry.resource_scope.subject_id === entityId)
      );
    if (referencedByInterventionResourceScope) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by intervention_resource_requirement_declaration resource_scope`
      );
    }
    const referencedByInterventionResourceDeclarer =
      state.intervention_resource_requirement_declarations.some(
        (entry) => entry.declared_by.entity_id === entityId
      );
    if (referencedByInterventionResourceDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by intervention_resource_requirement_declaration.declared_by`
      );
    }
    const referencedByPermissionActor =
      state.intervention_permission_declarations.some(
        (entry) => entry.actor_entity_id === entityId
      );
    if (referencedByPermissionActor) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by intervention_permission_declaration.actor_entity_id`
      );
    }
    const referencedByPermissionDeclarer =
      state.intervention_permission_declarations.some(
        (entry) => entry.declared_by.entity_id === entityId
      );
    if (referencedByPermissionDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by intervention_permission_declaration.declared_by`
      );
    }
    const referencedByDecisionSpaceDeclarer =
      state.decision_space_declarations.some(
        (entry) => entry.declared_by.entity_id === entityId
      );
    if (referencedByDecisionSpaceDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by decision_space_declaration.declared_by`
      );
    }
    const referencedByDecisionOptionDeclarer =
      state.decision_option_declarations.some(
        (entry) => entry.declared_by.entity_id === entityId
      );
    if (referencedByDecisionOptionDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by decision_option_declaration.declared_by`
      );
    }
    const referencedByActorCandidate =
      state.decision_option_actor_candidate_declarations.some(
        (entry) => entry.actor_entity_id === entityId
      );
    if (referencedByActorCandidate) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by decision_option_actor_candidate_declaration.actor_entity_id`
      );
    }
    const referencedByActorCandidateDeclarer =
      state.decision_option_actor_candidate_declarations.some(
        (entry) => entry.declared_by.entity_id === entityId
      );
    if (referencedByActorCandidateDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by decision_option_actor_candidate_declaration.declared_by`
      );
    }
    const referencedByIntentHolder =
      state.intervention_intent_declarations.some(
        (entry) => entry.intent_holder_entity_id === entityId
      );
    if (referencedByIntentHolder) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by intervention_intent_declaration.intent_holder_entity_id`
      );
    }
    const referencedByIntentDeclarer =
      state.intervention_intent_declarations.some(
        (entry) => entry.declared_by.entity_id === entityId
      );
    if (referencedByIntentDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by intervention_intent_declaration.declared_by`
      );
    }
    const referencedByCommitmentHolder =
      state.intervention_commitment_declarations.some(
        (entry) => entry.commitment_holder_entity_id === entityId
      );
    if (referencedByCommitmentHolder) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by intervention_commitment_declaration.commitment_holder_entity_id`
      );
    }
    const referencedByCommitmentDeclarer =
      state.intervention_commitment_declarations.some(
        (entry) => entry.declared_by.entity_id === entityId
      );
    if (referencedByCommitmentDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by intervention_commitment_declaration.declared_by`
      );
    }
    const referencedByAcceptanceDeclarer =
      state.intervention_commitment_acceptance_declarations.some(
        (entry) => entry.declared_by.entity_id === entityId
      );
    if (referencedByAcceptanceDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by intervention_commitment_acceptance_declaration.declared_by`
      );
    }
    const referencedByTemporalTermDeclarer =
      state.intervention_commitment_temporal_term_declarations.some(
        (entry) => entry.declared_by.entity_id === entityId
      );
    if (referencedByTemporalTermDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by intervention_commitment_temporal_term_declaration.declared_by`
      );
    }
    const referencedByConditionalTermDeclarer =
      state.intervention_commitment_conditional_term_declarations.some(
        (entry) => entry.declared_by.entity_id === entityId
      );
    if (referencedByConditionalTermDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by intervention_commitment_conditional_term_declaration.declared_by`
      );
    }
    const referencedByResourceCommitter =
      state.intervention_resource_commitment_declarations.some(
        (entry) => entry.resource_committer_entity_id === entityId
      );
    if (referencedByResourceCommitter) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by intervention_resource_commitment_declaration.resource_committer_entity_id`
      );
    }
    const referencedByResourceCommitmentDeclarer =
      state.intervention_resource_commitment_declarations.some(
        (entry) => entry.declared_by.entity_id === entityId
      );
    if (referencedByResourceCommitmentDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by intervention_resource_commitment_declaration.declared_by`
      );
    }
    const referencedByResourceReserver =
      state.intervention_resource_reservation_declarations.some(
        (entry) => entry.reserved_by_entity_id === entityId
      );
    if (referencedByResourceReserver) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by intervention_resource_reservation_declaration.reserved_by_entity_id`
      );
    }
    const referencedByResourceReservationDeclarer =
      state.intervention_resource_reservation_declarations.some(
        (entry) => entry.declared_by.entity_id === entityId
      );
    if (referencedByResourceReservationDeclarer) {
      throw new PatchError(
        `Cannot delete reality_entity ${entityId}: referenced by intervention_resource_reservation_declaration.declared_by`
      );
    }
  }

  if (entity === "reality_state") {
    const referencedByBasis = state.future_scenarios.some((entry) =>
      entry.basis_state_ids.includes(entityId)
    );
    if (referencedByBasis) {
      throw new PatchError(
        `Cannot delete reality_state ${entityId}: referenced by future_scenario.basis_state_ids`
      );
    }
  }

  if (entity === "reference_condition") {
    const referencedByObjective = state.reality_objectives.some((entry) =>
      entry.target_reference_condition_ids.includes(entityId)
    );
    if (referencedByObjective) {
      throw new PatchError(
        `Cannot delete reference_condition ${entityId}: referenced by reality_objective.target_reference_condition_ids`
      );
    }
    const referencedByRequirement = state.objective_requirements.some(
      (entry) => entry.reference_condition_id === entityId
    );
    if (referencedByRequirement) {
      throw new PatchError(
        `Cannot delete reference_condition ${entityId}: referenced by objective_requirement.reference_condition_id`
      );
    }
    const referencedByImpact = state.impact_declarations.some(
      (entry) => entry.basis.reference_condition_id === entityId
    );
    if (referencedByImpact) {
      throw new PatchError(
        `Cannot delete reference_condition ${entityId}: referenced by impact_declaration.basis.reference_condition_id`
      );
    }
    const referencedByAuthorityScope = state.authority_declarations.some(
      (entry) =>
        entry.scope.kind === "REFERENCE_CONDITION" &&
        entry.scope.reference_condition_id === entityId
    );
    if (referencedByAuthorityScope) {
      throw new PatchError(
        `Cannot delete reference_condition ${entityId}: referenced by authority_declaration scope`
      );
    }
    const referencedByStandingScope = state.standing_declarations.some(
      (entry) =>
        entry.scope.kind === "REFERENCE_CONDITION" &&
        entry.scope.reference_condition_id === entityId
    );
    if (referencedByStandingScope) {
      throw new PatchError(
        `Cannot delete reference_condition ${entityId}: referenced by standing_declaration scope`
      );
    }
    const referencedByDecisionBasis = state.decision_space_declarations.some(
      (entry) =>
        entry.basis.some(
          (basis) =>
            basis.kind === "REFERENCE_CONDITION" &&
            basis.reference_condition_id === entityId
        )
    );
    if (referencedByDecisionBasis) {
      throw new PatchError(
        `Cannot delete reference_condition ${entityId}: referenced by decision_space_declaration.basis`
      );
    }
  }

  if (entity === "impact_declaration") {
    const referencedByMeasure = state.impact_measure_declarations.some(
      (entry) => entry.impact_declaration_id === entityId
    );
    if (referencedByMeasure) {
      throw new PatchError(
        `Cannot delete impact_declaration ${entityId}: referenced by impact_measure_declaration.impact_declaration_id`
      );
    }
    const referencedByAuthorityScope = state.authority_declarations.some(
      (entry) =>
        entry.scope.kind === "IMPACT_DECLARATION" &&
        entry.scope.impact_declaration_id === entityId
    );
    if (referencedByAuthorityScope) {
      throw new PatchError(
        `Cannot delete impact_declaration ${entityId}: referenced by authority_declaration scope`
      );
    }
    const referencedByStandingScope = state.standing_declarations.some(
      (entry) =>
        entry.scope.kind === "IMPACT_DECLARATION" &&
        entry.scope.impact_declaration_id === entityId
    );
    if (referencedByStandingScope) {
      throw new PatchError(
        `Cannot delete impact_declaration ${entityId}: referenced by standing_declaration scope`
      );
    }
  }

  if (entity === "reality_objective") {
    const referenced = state.objective_dependencies.some(
      (entry) => entry.objective_id === entityId
    );
    if (referenced) {
      throw new PatchError(
        `Cannot delete reality_objective ${entityId}: referenced by objective_dependency.objective_id`
      );
    }
    const referencedByAuthorityScope = state.authority_declarations.some(
      (entry) =>
        entry.scope.kind === "REALITY_OBJECTIVE" &&
        entry.scope.objective_id === entityId
    );
    if (referencedByAuthorityScope) {
      throw new PatchError(
        `Cannot delete reality_objective ${entityId}: referenced by authority_declaration scope`
      );
    }
    const referencedByStandingScope = state.standing_declarations.some(
      (entry) =>
        entry.scope.kind === "REALITY_OBJECTIVE" &&
        entry.scope.objective_id === entityId
    );
    if (referencedByStandingScope) {
      throw new PatchError(
        `Cannot delete reality_objective ${entityId}: referenced by standing_declaration scope`
      );
    }
    const referencedByMandate = state.mandate_declarations.some(
      (entry) => entry.objective_id === entityId
    );
    if (referencedByMandate) {
      throw new PatchError(
        `Cannot delete reality_objective ${entityId}: referenced by mandate_declaration.objective_id`
      );
    }
    const referencedByDecisionBasis = state.decision_space_declarations.some(
      (entry) =>
        entry.basis.some(
          (basis) =>
            basis.kind === "REALITY_OBJECTIVE" &&
            basis.objective_id === entityId
        )
    );
    if (referencedByDecisionBasis) {
      throw new PatchError(
        `Cannot delete reality_objective ${entityId}: referenced by decision_space_declaration.basis`
      );
    }
  }

  if (entity === "objective_requirement") {
    const referenced = state.objective_dependencies.some(
      (entry) => entry.requirement_id === entityId
    );
    if (referenced) {
      throw new PatchError(
        `Cannot delete objective_requirement ${entityId}: referenced by objective_dependency.requirement_id`
      );
    }
  }

  if (entity === "future_scenario") {
    const referencedByProjection = state.scenario_state_projections.some(
      (entry) => entry.scenario_id === entityId
    );
    if (referencedByProjection) {
      throw new PatchError(
        `Cannot delete future_scenario ${entityId}: referenced by scenario_state_projection.scenario_id`
      );
    }
    const referencedByLikelihood = state.scenario_likelihood_estimates.some(
      (entry) => entry.scenario_id === entityId
    );
    if (referencedByLikelihood) {
      throw new PatchError(
        `Cannot delete future_scenario ${entityId}: referenced by scenario_likelihood_estimate.scenario_id`
      );
    }
    const referencedByDecisionBasis = state.decision_space_declarations.some(
      (entry) =>
        entry.basis.some(
          (basis) =>
            basis.kind === "FUTURE_SCENARIO" && basis.scenario_id === entityId
        )
    );
    if (referencedByDecisionBasis) {
      throw new PatchError(
        `Cannot delete future_scenario ${entityId}: referenced by decision_space_declaration.basis`
      );
    }
  }

  if (entity === "decision_space_declaration") {
    const referencedByOption = state.decision_option_declarations.some(
      (entry) => entry.decision_space_id === entityId
    );
    if (referencedByOption) {
      throw new PatchError(
        `Cannot delete decision_space_declaration ${entityId}: referenced by decision_option_declaration`
      );
    }
    const referencedByDecision = state.reality_decision_declarations.some(
      (entry) => entry.decision_space_id === entityId
    );
    if (referencedByDecision) {
      throw new PatchError(
        `Cannot delete decision_space_declaration ${entityId}: referenced by reality_decision_declaration`
      );
    }
  }

  if (entity === "decision_option_declaration") {
    const referencedByCandidate =
      state.decision_option_actor_candidate_declarations.some(
        (entry) => entry.decision_option_declaration_id === entityId
      );
    if (referencedByCandidate) {
      throw new PatchError(
        `Cannot delete decision_option_declaration ${entityId}: referenced by decision_option_actor_candidate_declaration`
      );
    }
  }

  if (entity === "reality_decision_declaration") {
    // Append-only: Decision Memory I does not allow deletion.
    // Correction/retraction/supersession semantics are intentionally deferred.
    throw new PatchError(
      `Cannot delete reality_decision_declaration ${entityId}: Decision Memory is append-only in GROUND-028`
    );
  }

  if (entity === "intervention_intent_declaration") {
    // Append-only: Intent Core I does not allow deletion.
    // Correction/retraction/supersession semantics are intentionally deferred.
    throw new PatchError(
      `Cannot delete intervention_intent_declaration ${entityId}: Intent history is append-only in GROUND-029`
    );
  }

  if (entity === "intervention_commitment_declaration") {
    // Append-only: Commitment Core I does not allow deletion.
    // Correction/retraction/release/supersession semantics are intentionally deferred.
    throw new PatchError(
      `Cannot delete intervention_commitment_declaration ${entityId}: Commitment history is append-only in GROUND-030`
    );
  }

  if (entity === "intervention_commitment_acceptance_declaration") {
    // Append-only: Commitment Acceptance does not allow deletion.
    // Correction/retraction/denial/withdrawal semantics are intentionally deferred.
    throw new PatchError(
      `Cannot delete intervention_commitment_acceptance_declaration ${entityId}: Commitment Acceptance history is append-only in GROUND-031`
    );
  }

  if (entity === "intervention_commitment_temporal_term_declaration") {
    // Append-only: Temporal Terms do not allow deletion.
    // Correction/retraction/supersession semantics are intentionally deferred.
    throw new PatchError(
      `Cannot delete intervention_commitment_temporal_term_declaration ${entityId}: Commitment Temporal Term history is append-only in GROUND-032`
    );
  }

  if (entity === "intervention_commitment_conditional_term_declaration") {
    // Append-only: Conditional Terms do not allow deletion.
    // Correction/retraction/supersession semantics are intentionally deferred.
    throw new PatchError(
      `Cannot delete intervention_commitment_conditional_term_declaration ${entityId}: Commitment Conditional Term history is append-only in GROUND-033`
    );
  }

  if (entity === "intervention_resource_commitment_declaration") {
    // Append-only: Resource Commitment does not allow deletion.
    // Release/retraction/correction/supersession semantics are intentionally deferred.
    throw new PatchError(
      `Cannot delete intervention_resource_commitment_declaration ${entityId}: Resource Commitment history is append-only in GROUND-034`
    );
  }

  if (entity === "intervention_resource_reservation_declaration") {
    // Append-only: Resource Reservation does not allow deletion.
    // Release/revocation/correction/supersession semantics are intentionally deferred.
    throw new PatchError(
      `Cannot delete intervention_resource_reservation_declaration ${entityId}: Resource Reservation history is append-only in GROUND-035`
    );
  }

  if (entity === "epistemic_observation") {
    const referenced = state.evidence.some(
      (entry) => entry.observation_id === entityId
    );
    if (referenced) {
      throw new PatchError(
        `Cannot delete epistemic_observation ${entityId}: referenced by evidence.observation_id`
      );
    }
  }

  if (entity === "evidence") {
    const referenced = state.claim_evidence_links.some(
      (entry) => entry.evidence_id === entityId
    );
    if (referenced) {
      throw new PatchError(
        `Cannot delete evidence ${entityId}: referenced by claim_evidence_link`
      );
    }
    const referencedByBasis = state.future_scenarios.some((entry) =>
      entry.basis_evidence_ids.includes(entityId)
    );
    if (referencedByBasis) {
      throw new PatchError(
        `Cannot delete evidence ${entityId}: referenced by future_scenario.basis_evidence_ids`
      );
    }
    const referencedByCapabilityVerification =
      state.capability_verification_declarations.some((entry) =>
        entry.evidence_ids.includes(entityId)
      );
    if (referencedByCapabilityVerification) {
      throw new PatchError(
        `Cannot delete evidence ${entityId}: referenced by capability_verification_declaration.evidence_ids`
      );
    }
  }

  if (entity === "claim") {
    const referenced = state.claim_evidence_links.some(
      (entry) => entry.claim_id === entityId
    );
    if (referenced) {
      throw new PatchError(
        `Cannot delete claim ${entityId}: referenced by claim_evidence_link`
      );
    }
    const referencedByBasis = state.future_scenarios.some((entry) =>
      entry.basis_claim_ids.includes(entityId)
    );
    if (referencedByBasis) {
      throw new PatchError(
        `Cannot delete claim ${entityId}: referenced by future_scenario.basis_claim_ids`
      );
    }
  }

  if (entity === "authority_declaration") {
    const referencedByDelegation = state.authority_delegation_declarations.some(
      (entry) => entry.source_authority_declaration_ids.includes(entityId)
    );
    if (referencedByDelegation) {
      throw new PatchError(
        `Cannot delete authority_declaration ${entityId}: referenced by authority_delegation_declaration.source_authority_declaration_ids`
      );
    }
    const referencedByContest = state.authority_contest_declarations.some(
      (entry) =>
        entry.target.kind === "AUTHORITY_DECLARATION" &&
        entry.target.authority_declaration_id === entityId
    );
    if (referencedByContest) {
      throw new PatchError(
        `Cannot delete authority_declaration ${entityId}: referenced by authority_contest_declaration target`
      );
    }
  }

  if (entity === "authority_delegation_declaration") {
    const referencedByContest = state.authority_contest_declarations.some(
      (entry) =>
        entry.target.kind === "AUTHORITY_DELEGATION" &&
        entry.target.authority_delegation_id === entityId
    );
    if (referencedByContest) {
      throw new PatchError(
        `Cannot delete authority_delegation_declaration ${entityId}: referenced by authority_contest_declaration target`
      );
    }
  }

  if (entity === "capability_declaration") {
    const referencedByVerification =
      state.capability_verification_declarations.some(
        (entry) => entry.capability_declaration_id === entityId
      );
    if (referencedByVerification) {
      throw new PatchError(
        `Cannot delete capability_declaration ${entityId}: referenced by capability_verification_declaration`
      );
    }
    const referencedByAvailability =
      state.capability_availability_declarations.some(
        (entry) => entry.capability_declaration_id === entityId
      );
    if (referencedByAvailability) {
      throw new PatchError(
        `Cannot delete capability_declaration ${entityId}: referenced by capability_availability_declaration`
      );
    }
  }

  if (entity === "resource_declaration") {
    const referencedByCapacity = state.resource_capacity_declarations.some(
      (entry) => entry.resource_declaration_id === entityId
    );
    if (referencedByCapacity) {
      throw new PatchError(
        `Cannot delete resource_declaration ${entityId}: referenced by resource_capacity_declaration`
      );
    }
    const referencedByAvailability =
      state.resource_availability_declarations.some(
        (entry) => entry.resource_declaration_id === entityId
      );
    if (referencedByAvailability) {
      throw new PatchError(
        `Cannot delete resource_declaration ${entityId}: referenced by resource_availability_declaration`
      );
    }
    const referencedByResourceCommitment =
      state.intervention_resource_commitment_declarations.some(
        (entry) => entry.resource_declaration_id === entityId
      );
    if (referencedByResourceCommitment) {
      throw new PatchError(
        `Cannot delete resource_declaration ${entityId}: referenced by intervention_resource_commitment_declaration`
      );
    }
  }

  if (entity === "intervention_declaration") {
    const referencedByCapabilityRequirement =
      state.intervention_capability_requirement_declarations.some(
        (entry) => entry.intervention_id === entityId
      );
    if (referencedByCapabilityRequirement) {
      throw new PatchError(
        `Cannot delete intervention_declaration ${entityId}: referenced by intervention_capability_requirement_declaration`
      );
    }
    const referencedByResourceRequirement =
      state.intervention_resource_requirement_declarations.some(
        (entry) => entry.intervention_id === entityId
      );
    if (referencedByResourceRequirement) {
      throw new PatchError(
        `Cannot delete intervention_declaration ${entityId}: referenced by intervention_resource_requirement_declaration`
      );
    }
    const referencedByPermission =
      state.intervention_permission_declarations.some(
        (entry) => entry.intervention_id === entityId
      );
    if (referencedByPermission) {
      throw new PatchError(
        `Cannot delete intervention_declaration ${entityId}: referenced by intervention_permission_declaration`
      );
    }
    const referencedByDecisionOption = state.decision_option_declarations.some(
      (entry) =>
        entry.option.kind === "INTERVENTION" &&
        entry.option.intervention_id === entityId
    );
    if (referencedByDecisionOption) {
      throw new PatchError(
        `Cannot delete intervention_declaration ${entityId}: referenced by decision_option_declaration`
      );
    }
    const referencedByAuthorityScope = state.authority_declarations.some(
      (entry) =>
        entry.scope.kind === "INTERVENTION_DECLARATION" &&
        entry.scope.intervention_id === entityId
    );
    if (referencedByAuthorityScope) {
      throw new PatchError(
        `Cannot delete intervention_declaration ${entityId}: referenced by authority_declaration scope`
      );
    }
    const referencedByDelegationScope =
      state.authority_delegation_declarations.some(
        (entry) =>
          entry.scope.kind === "INTERVENTION_DECLARATION" &&
          entry.scope.intervention_id === entityId
      );
    if (referencedByDelegationScope) {
      throw new PatchError(
        `Cannot delete intervention_declaration ${entityId}: referenced by authority_delegation_declaration scope`
      );
    }
    const referencedByIntent = state.intervention_intent_declarations.some(
      (entry) => entry.intervention_id === entityId
    );
    if (referencedByIntent) {
      throw new PatchError(
        `Cannot delete intervention_declaration ${entityId}: referenced by intervention_intent_declaration`
      );
    }
    const referencedByCommitment = state.intervention_commitment_declarations.some(
      (entry) => entry.intervention_id === entityId
    );
    if (referencedByCommitment) {
      throw new PatchError(
        `Cannot delete intervention_declaration ${entityId}: referenced by intervention_commitment_declaration`
      );
    }
  }
}

function assertGoalDeletable(state: ProjectState, goalId: string): void {
  if (state.current_state.primary_goal_id === goalId) {
    throw new PatchError(
      `Cannot delete goal ${goalId}: referenced by current_state.primary_goal_id`
    );
  }

  if (state.goals.some((goal) => goal.parent_goal_id === goalId)) {
    throw new PatchError(
      `Cannot delete goal ${goalId}: referenced by goal.parent_goal_id`
    );
  }

  if (state.blockers.some((blocker) => blocker.goal_id === goalId)) {
    throw new PatchError(
      `Cannot delete goal ${goalId}: referenced by blocker.goal_id`
    );
  }

  if (state.next_actions.some((action) => action.goal_id === goalId)) {
    throw new PatchError(
      `Cannot delete goal ${goalId}: referenced by next_action.goal_id`
    );
  }

  if (state.decisions.some((decision) => decision.goal_id === goalId)) {
    throw new PatchError(
      `Cannot delete goal ${goalId}: referenced by decision.goal_id`
    );
  }

  if (state.hypotheses.some((hypothesis) => hypothesis.goal_id === goalId)) {
    throw new PatchError(
      `Cannot delete goal ${goalId}: referenced by hypothesis.goal_id`
    );
  }

  if (state.observations.some((observation) => observation.goal_id === goalId)) {
    throw new PatchError(
      `Cannot delete goal ${goalId}: referenced by observation.goal_id`
    );
  }

  if (state.judgments.some((judgment) => judgment.goal_id === goalId)) {
    throw new PatchError(
      `Cannot delete goal ${goalId}: referenced by judgment.goal_id`
    );
  }

  if (
    state.goal_edges.some(
      (edge) => edge.from_goal_id === goalId || edge.to_goal_id === goalId
    )
  ) {
    throw new PatchError(
      `Cannot delete goal ${goalId}: referenced by goal_edges`
    );
  }
}

function assertInvariants(state: ProjectState): void {
  const projectId = state.project.id;
  const goalIds = new Set(state.goals.map((goal) => goal.id));
  const blockerIds = new Set(state.blockers.map((blocker) => blocker.id));
  const nextActionIds = new Set(state.next_actions.map((action) => action.id));
  const observationIds = new Set(
    state.observations.map((observation) => observation.id)
  );

  if (state.current_state.project_id !== projectId) {
    throw new PatchError("current_state.project_id must match project.id");
  }

  for (const goal of state.goals) {
    if (goal.project_id !== projectId) {
      throw new PatchError(`goal ${goal.id} has mismatched project_id`);
    }
    if (goal.parent_goal_id === goal.id) {
      throw new PatchError(`goal ${goal.id} cannot reference itself as parent`);
    }
    if (goal.parent_goal_id && !goalIds.has(goal.parent_goal_id)) {
      throw new PatchError(
        `goal ${goal.id} references missing parent_goal_id ${goal.parent_goal_id}`
      );
    }
  }

  if (
    state.current_state.primary_goal_id &&
    !goalIds.has(state.current_state.primary_goal_id)
  ) {
    throw new PatchError(
      `current_state.primary_goal_id references missing goal ${state.current_state.primary_goal_id}`
    );
  }

  if (
    state.current_state.primary_next_action_id &&
    !nextActionIds.has(state.current_state.primary_next_action_id)
  ) {
    throw new PatchError(
      `current_state.primary_next_action_id references missing next_action ${state.current_state.primary_next_action_id}`
    );
  }

  assertReferencedEntities(state.blockers, projectId, goalIds, "blocker");
  assertReferencedEntities(state.decisions, projectId, goalIds, "decision");
  assertReferencedEntities(state.hypotheses, projectId, goalIds, "hypothesis");
  assertReferencedEntities(state.observations, projectId, goalIds, "observation");

  for (const action of state.next_actions) {
    if (action.project_id !== projectId) {
      throw new PatchError(`next_action ${action.id} has mismatched project_id`);
    }
    if (action.goal_id && !goalIds.has(action.goal_id)) {
      throw new PatchError(
        `next_action ${action.id} references missing goal_id ${action.goal_id}`
      );
    }
    if (action.blocker_id && !blockerIds.has(action.blocker_id)) {
      throw new PatchError(
        `next_action ${action.id} references missing blocker_id ${action.blocker_id}`
      );
    }
    if (action.depends_on_action_id) {
      if (action.depends_on_action_id === action.id) {
        throw new PatchError(
          `next_action ${action.id} cannot depend on itself`
        );
      }
      if (!nextActionIds.has(action.depends_on_action_id)) {
        throw new PatchError(
          `next_action ${action.id} references missing depends_on_action_id ${action.depends_on_action_id}`
        );
      }
    }
  }

  for (const doc of state.reference_docs) {
    if (doc.project_id !== projectId) {
      throw new PatchError(`reference_doc ${doc.id} has mismatched project_id`);
    }
  }

  for (const judgment of state.judgments) {
    if (judgment.project_id !== projectId) {
      throw new PatchError(`judgment ${judgment.id} has mismatched project_id`);
    }
    if (judgment.goal_id && !goalIds.has(judgment.goal_id)) {
      throw new PatchError(
        `judgment ${judgment.id} references missing goal_id ${judgment.goal_id}`
      );
    }
    if (judgment.observation_id && !observationIds.has(judgment.observation_id)) {
      throw new PatchError(
        `judgment ${judgment.id} references missing observation_id ${judgment.observation_id}`
      );
    }
  }

  for (const edge of state.goal_edges) {
    if (edge.project_id !== projectId) {
      throw new PatchError(`goal_edge ${edge.id} has mismatched project_id`);
    }
    if (!goalIds.has(edge.from_goal_id) || !goalIds.has(edge.to_goal_id)) {
      throw new PatchError(`goal_edge ${edge.id} references missing goal`);
    }
  }

  assertRealityInvariants(state);
  assertEpistemicInvariants(state);
  assertReferenceInvariants(state);
  assertObjectiveInvariants(state);
  assertProspectiveInvariants(state);
  assertImpactInvariants(state);
  assertImpactMeasureInvariants(state);
  assertGovernanceInvariants(state);
  assertCapabilityInvariants(state);
  assertResourceInvariants(state);
  assertInterventionInvariants(state);
  assertInterventionPermissionInvariants(state);
  assertDecisionSpaceInvariants(state);
  assertDecisionOptionInvariants(state);
  assertDecisionOptionActorCandidateInvariants(state);
  assertRealityDecisionDeclarationInvariants(state, state);
  assertInterventionIntentDeclarationInvariants(state);
  assertInterventionCommitmentDeclarationInvariants(state);
  assertInterventionCommitmentAcceptanceDeclarationInvariants(state);
  assertInterventionCommitmentTemporalTermDeclarationInvariants(state);
  assertInterventionCommitmentConditionalTermDeclarationInvariants(state);
  assertInterventionResourceCommitmentDeclarationInvariants(state);
  assertInterventionResourceReservationDeclarationInvariants(state);
}

function assertUniqueIds(
  items: Array<{ id: string }>,
  label: string
): void {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) {
      throw new PatchError(`Duplicate ${label} id: ${item.id}`);
    }
    seen.add(item.id);
  }
}

function assertRealityEventUpsert(
  state: ProjectState,
  operation: Extract<PatchOperation, { entity: "reality_event" }>
): void {
  const existing = state.reality_events.find(
    (entry) => entry.id === operation.entity_id
  );
  if (!existing || !operation.payload) {
    return;
  }

  if (
    "occurred_at" in operation.payload &&
    operation.payload.occurred_at !== existing.occurred_at
  ) {
    throw new PatchError(
      `Cannot mutate reality_event.occurred_at after create: ${operation.entity_id}`
    );
  }

  if (
    "recorded_at" in operation.payload &&
    operation.payload.recorded_at !== existing.recorded_at
  ) {
    throw new PatchError(
      `Cannot mutate reality_event.recorded_at after create: ${operation.entity_id}`
    );
  }
}

function assertRealityInvariants(state: ProjectState): void {
  const projectId = state.project.id;
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  assertUniqueIds(state.reality_entities, "reality_entity");
  assertUniqueIds(state.reality_events, "reality_event");
  assertUniqueIds(state.reality_states, "reality_state");

  for (const entity of state.reality_entities) {
    if (entity.project_id !== projectId) {
      throw new PatchError(
        `reality_entity ${entity.id} has mismatched project_id`
      );
    }
  }

  for (const event of state.reality_events) {
    if (event.project_id !== projectId) {
      throw new PatchError(
        `reality_event ${event.id} has mismatched project_id`
      );
    }
    for (const subjectId of event.subject_ids) {
      if (!entityIds.has(subjectId)) {
        throw new PatchError(
          `reality_event ${event.id} references missing subject_id ${subjectId}`
        );
      }
    }
  }

  for (const realityState of state.reality_states) {
    if (realityState.project_id !== projectId) {
      throw new PatchError(
        `reality_state ${realityState.id} has mismatched project_id`
      );
    }
    if (!entityIds.has(realityState.subject_id)) {
      throw new PatchError(
        `reality_state ${realityState.id} references missing subject_id ${realityState.subject_id}`
      );
    }
    if (
      realityState.valid_until !== null &&
      isAdmissionTemporalRelationProven(realityState.valid_until, realityState.valid_from, "<")
    ) {
      throw new PatchError(
        `reality_state ${realityState.id} has valid_until before valid_from`
      );
    }
  }
}

function assertEpistemicInvariants(state: ProjectState): void {
  const projectId = state.project.id;
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));
  const observationIds = new Set(
    state.epistemic_observations.map((entry) => entry.id)
  );
  const evidenceIds = new Set(state.evidence.map((entry) => entry.id));
  const claimIds = new Set(state.claims.map((entry) => entry.id));

  assertUniqueIds(state.epistemic_observations, "epistemic_observation");
  assertUniqueIds(state.evidence, "evidence");
  assertUniqueIds(state.claims, "claim");
  assertUniqueIds(state.claim_evidence_links, "claim_evidence_link");

  for (const observation of state.epistemic_observations) {
    if (observation.project_id !== projectId) {
      throw new PatchError(
        `epistemic_observation ${observation.id} has mismatched project_id`
      );
    }
    for (const subjectId of observation.subject_ids) {
      if (!entityIds.has(subjectId)) {
        throw new PatchError(
          `epistemic_observation ${observation.id} references missing subject_id ${subjectId}`
        );
      }
    }
    if (
      observation.provenance.entity_id &&
      !entityIds.has(observation.provenance.entity_id)
    ) {
      throw new PatchError(
        `epistemic_observation ${observation.id} provenance.entity_id missing`
      );
    }
  }

  for (const evidence of state.evidence) {
    if (evidence.project_id !== projectId) {
      throw new PatchError(`evidence ${evidence.id} has mismatched project_id`);
    }
    if (evidence.kind === "observation_ref") {
      if (!evidence.observation_id) {
        throw new PatchError(
          `evidence ${evidence.id} kind=observation_ref requires observation_id`
        );
      }
      if (!observationIds.has(evidence.observation_id)) {
        throw new PatchError(
          `evidence ${evidence.id} references missing observation_id ${evidence.observation_id}`
        );
      }
    }
    if (evidence.kind === "external_ref") {
      if (!evidence.external_ref) {
        throw new PatchError(
          `evidence ${evidence.id} kind=external_ref requires external_ref`
        );
      }
    }
    if (
      evidence.provenance.entity_id &&
      !entityIds.has(evidence.provenance.entity_id)
    ) {
      throw new PatchError(`evidence ${evidence.id} provenance.entity_id missing`);
    }
  }

  for (const claim of state.claims) {
    if (claim.project_id !== projectId) {
      throw new PatchError(`claim ${claim.id} has mismatched project_id`);
    }
    if (claim.subject_id !== null && !entityIds.has(claim.subject_id)) {
      throw new PatchError(
        `claim ${claim.id} references missing subject_id ${claim.subject_id}`
      );
    }
    if (
      typeof claim.confidence !== "number" ||
      Number.isNaN(claim.confidence) ||
      claim.confidence < 0 ||
      claim.confidence > 1
    ) {
      throw new PatchError(
        `claim ${claim.id} confidence must be in [0, 1]`
      );
    }
    if (
      claim.applicable_from !== null &&
      claim.applicable_until !== null &&
      isAdmissionTemporalRelationProven(claim.applicable_until, claim.applicable_from, "<")
    ) {
      throw new PatchError(
        `claim ${claim.id} has applicable_until before applicable_from`
      );
    }
    if (
      claim.provenance.entity_id &&
      !entityIds.has(claim.provenance.entity_id)
    ) {
      throw new PatchError(`claim ${claim.id} provenance.entity_id missing`);
    }
  }

  for (const link of state.claim_evidence_links) {
    if (link.project_id !== projectId) {
      throw new PatchError(
        `claim_evidence_link ${link.id} has mismatched project_id`
      );
    }
    if (!claimIds.has(link.claim_id)) {
      throw new PatchError(
        `claim_evidence_link ${link.id} references missing claim_id ${link.claim_id}`
      );
    }
    if (!evidenceIds.has(link.evidence_id)) {
      throw new PatchError(
        `claim_evidence_link ${link.id} references missing evidence_id ${link.evidence_id}`
      );
    }
  }
}

function assertReferenceConditionUpsert(
  state: ProjectState,
  operation: Extract<PatchOperation, { entity: "reference_condition" }>
): void {
  const payload = operation.payload;
  if (!payload) {
    return;
  }

  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));
  const subjectId =
    typeof payload.subject_id === "string" ? payload.subject_id : undefined;
  if (subjectId && !entityIds.has(subjectId)) {
    throw new PatchError(
      `reference_condition references missing subject_id ${subjectId}`
    );
  }

  const declarer = payload.declared_by as
    | { entity_id?: string | null }
    | undefined;
  if (declarer?.entity_id && !entityIds.has(declarer.entity_id)) {
    throw new PatchError(
      `reference_condition declared_by.entity_id references missing RealityEntity ${declarer.entity_id}`
    );
  }

  if (payload.criterion) {
    validateReferenceCriterion(payload.criterion as ReferenceCriterion);
  }

  const existing = state.reference_conditions.find(
    (entry) => entry.id === operation.entity_id
  );
  const merged: ReferenceCondition = {
    ...(existing ?? {
      id: operation.entity_id,
      project_id: state.project.id,
      subject_id: "",
      state_kind: "",
      reference_kind: "EXPECTED",
      criterion: { kind: "EQUALS", value: "" },
      valid_from: "",
      valid_until: null,
      declared_by: { kind: "human" },
      recorded_at: "",
      created_at: "",
      updated_at: "",
    }),
    ...payload,
    id: operation.entity_id,
    project_id: state.project.id,
    criterion: payload.criterion
      ? normalizeReferenceCriterion(payload.criterion as ReferenceCriterion)
      : existing?.criterion ?? { kind: "EQUALS", value: "" },
  } as ReferenceCondition;

  if (merged.subject_id && !entityIds.has(merged.subject_id)) {
    throw new PatchError(
      `reference_condition references missing subject_id ${merged.subject_id}`
    );
  }
  if (
    merged.declared_by.entity_id &&
    !entityIds.has(merged.declared_by.entity_id)
  ) {
    throw new PatchError(
      `reference_condition declared_by.entity_id references missing RealityEntity ${merged.declared_by.entity_id}`
    );
  }
  if (
    merged.valid_until !== null &&
    isAdmissionTemporalRelationProven(merged.valid_until, merged.valid_from, "<")
  ) {
    throw new PatchError(
      `reference_condition ${merged.id} has valid_until before valid_from`
    );
  }
  validateReferenceCriterion(merged.criterion);
}

function assertReferenceInvariants(state: ProjectState): void {
  const projectId = state.project.id;
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  assertUniqueIds(state.reference_conditions, "reference_condition");

  for (const ref of state.reference_conditions) {
    if (ref.project_id !== projectId) {
      throw new PatchError(
        `reference_condition ${ref.id} has mismatched project_id`
      );
    }
    if (!entityIds.has(ref.subject_id)) {
      throw new PatchError(
        `reference_condition ${ref.id} references missing subject_id ${ref.subject_id}`
      );
    }
    if (
      ref.declared_by.entity_id &&
      !entityIds.has(ref.declared_by.entity_id)
    ) {
      throw new PatchError(
        `reference_condition ${ref.id} declared_by.entity_id missing`
      );
    }
    if (ref.valid_until !== null && isAdmissionTemporalRelationProven(ref.valid_until, ref.valid_from, "<")) {
      throw new PatchError(
        `reference_condition ${ref.id} has valid_until before valid_from`
      );
    }
    validateReferenceCriterion(ref.criterion);
  }
}

function intervalOverlapIsProven(
  aFrom: string,
  aUntil: string | null,
  bFrom: string,
  bUntil: string | null
): boolean {
  const starts = assessTemporalPrerequisite(() => compareTemporalInstants(aFrom, bFrom, "patch interval overlap"));
  if (starts.status === "UNRESOLVED") return false; // overlap was not established
  return (bUntil === null || isAdmissionTemporalRelationProven(aFrom, bUntil, "<")) &&
    (aUntil === null || isAdmissionTemporalRelationProven(bFrom, aUntil, "<"));
}

function assertRealityObjectiveUpsert(
  state: ProjectState,
  operation: Extract<PatchOperation, { entity: "reality_objective" }>
): void {
  const payload = operation.payload;
  if (!payload) {
    return;
  }

  const existing = state.reality_objectives.find(
    (entry) => entry.id === operation.entity_id
  );
  const merged: RealityObjective = {
    ...(existing ?? {
      id: operation.entity_id,
      project_id: state.project.id,
      kind: "STATE_TARGET",
      label: "",
      target_reference_condition_ids: [],
      valid_from: "",
      valid_until: null,
      declared_by: { kind: "human" },
      recorded_at: "",
      created_at: "",
      updated_at: "",
    }),
    ...payload,
    id: operation.entity_id,
    project_id: state.project.id,
  } as RealityObjective;

  assertRealityObjectiveShape(state, merged);
}

function assertObjectiveRequirementUpsert(
  state: ProjectState,
  operation: Extract<PatchOperation, { entity: "objective_requirement" }>
): void {
  const payload = operation.payload;
  if (!payload) {
    return;
  }

  const existing = state.objective_requirements.find(
    (entry) => entry.id === operation.entity_id
  );
  const merged: ObjectiveRequirement = {
    ...(existing ?? {
      id: operation.entity_id,
      project_id: state.project.id,
      label: "",
      reference_condition_id: "",
      valid_from: "",
      valid_until: null,
      declared_by: { kind: "human" },
      recorded_at: "",
      created_at: "",
      updated_at: "",
    }),
    ...payload,
    id: operation.entity_id,
    project_id: state.project.id,
  } as ObjectiveRequirement;

  assertObjectiveRequirementShape(state, merged);
}

function assertObjectiveDependencyUpsert(
  state: ProjectState,
  operation: Extract<PatchOperation, { entity: "objective_dependency" }>
): void {
  const payload = operation.payload;
  if (!payload) {
    return;
  }

  const existing = state.objective_dependencies.find(
    (entry) => entry.id === operation.entity_id
  );
  const merged: ObjectiveDependency = {
    ...(existing ?? {
      id: operation.entity_id,
      project_id: state.project.id,
      objective_id: "",
      requirement_id: "",
      kind: "REQUIRES",
      valid_from: "",
      valid_until: null,
      declared_by: { kind: "human" },
      recorded_at: "",
      created_at: "",
      updated_at: "",
    }),
    ...payload,
    id: operation.entity_id,
    project_id: state.project.id,
  } as ObjectiveDependency;

  assertObjectiveDependencyShape(state, merged, operation.entity_id);
}

function assertRealityObjectiveShape(
  state: ProjectState,
  objective: RealityObjective
): void {
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));
  const referenceById = new Map(
    state.reference_conditions.map((entry) => [entry.id, entry])
  );

  if (objective.kind !== "STATE_TARGET") {
    throw new PatchError(
      `reality_objective ${objective.id} has unsupported kind ${String(objective.kind)}`
    );
  }
  if (
    !Array.isArray(objective.target_reference_condition_ids) ||
    objective.target_reference_condition_ids.length < 1
  ) {
    throw new PatchError(
      `reality_objective ${objective.id} requires at least one target_reference_condition_id`
    );
  }

  const seenTargets = new Set<string>();
  for (const targetId of objective.target_reference_condition_ids) {
    if (seenTargets.has(targetId)) {
      throw new PatchError(
        `reality_objective ${objective.id} has duplicate target_reference_condition_id ${targetId}`
      );
    }
    seenTargets.add(targetId);
    const ref = referenceById.get(targetId);
    if (!ref || ref.project_id !== state.project.id) {
      throw new PatchError(
        `reality_objective ${objective.id} references missing target ReferenceCondition ${targetId}`
      );
    }
    if (ref.reference_kind !== "DESIRED") {
      throw new PatchError(
        `reality_objective ${objective.id} target ${targetId} must be DESIRED (got ${ref.reference_kind})`
      );
    }
  }

  if (
    objective.declared_by.entity_id &&
    !entityIds.has(objective.declared_by.entity_id)
  ) {
    throw new PatchError(
      `reality_objective ${objective.id} declared_by.entity_id references missing RealityEntity ${objective.declared_by.entity_id}`
    );
  }
  if (
    objective.valid_until !== null &&
    isAdmissionTemporalRelationProven(objective.valid_until, objective.valid_from, "<")
  ) {
    throw new PatchError(
      `reality_objective ${objective.id} has valid_until before valid_from`
    );
  }
}

function assertObjectiveRequirementShape(
  state: ProjectState,
  requirement: ObjectiveRequirement
): void {
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));
  const ref = state.reference_conditions.find(
    (entry) =>
      entry.id === requirement.reference_condition_id &&
      entry.project_id === state.project.id
  );
  if (!ref) {
    throw new PatchError(
      `objective_requirement ${requirement.id} references missing ReferenceCondition ${requirement.reference_condition_id}`
    );
  }
  if (
    requirement.declared_by.entity_id &&
    !entityIds.has(requirement.declared_by.entity_id)
  ) {
    throw new PatchError(
      `objective_requirement ${requirement.id} declared_by.entity_id references missing RealityEntity ${requirement.declared_by.entity_id}`
    );
  }
  if (
    requirement.valid_until !== null &&
    isAdmissionTemporalRelationProven(requirement.valid_until, requirement.valid_from, "<")
  ) {
    throw new PatchError(
      `objective_requirement ${requirement.id} has valid_until before valid_from`
    );
  }
}

function assertObjectiveDependencyShape(
  state: ProjectState,
  dependency: ObjectiveDependency,
  selfId: string
): void {
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));
  const objective = state.reality_objectives.find(
    (entry) =>
      entry.id === dependency.objective_id &&
      entry.project_id === state.project.id
  );
  if (!objective) {
    throw new PatchError(
      `objective_dependency ${dependency.id} references missing RealityObjective ${dependency.objective_id}`
    );
  }
  const requirement = state.objective_requirements.find(
    (entry) =>
      entry.id === dependency.requirement_id &&
      entry.project_id === state.project.id
  );
  if (!requirement) {
    throw new PatchError(
      `objective_dependency ${dependency.id} references missing ObjectiveRequirement ${dependency.requirement_id}`
    );
  }
  if (dependency.kind !== "REQUIRES") {
    throw new PatchError(
      `objective_dependency ${dependency.id} has unsupported kind ${String(dependency.kind)}`
    );
  }
  if (
    dependency.declared_by.entity_id &&
    !entityIds.has(dependency.declared_by.entity_id)
  ) {
    throw new PatchError(
      `objective_dependency ${dependency.id} declared_by.entity_id references missing RealityEntity ${dependency.declared_by.entity_id}`
    );
  }
  if (
    dependency.valid_until !== null &&
    isAdmissionTemporalRelationProven(dependency.valid_until, dependency.valid_from, "<")
  ) {
    throw new PatchError(
      `objective_dependency ${dependency.id} has valid_until before valid_from`
    );
  }

  for (const other of state.objective_dependencies) {
    if (other.id === selfId) {
      continue;
    }
    if (
      other.objective_id === dependency.objective_id &&
      other.requirement_id === dependency.requirement_id &&
      intervalOverlapIsProven(
        other.valid_from,
        other.valid_until,
        dependency.valid_from,
        dependency.valid_until
      )
    ) {
      throw new PatchError(
        `objective_dependency ${dependency.id} duplicates overlapping REQUIRES edge for objective ${dependency.objective_id} and requirement ${dependency.requirement_id}`
      );
    }
  }
}

function assertObjectiveInvariants(state: ProjectState): void {
  const projectId = state.project.id;
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  assertUniqueIds(state.reality_objectives, "reality_objective");
  assertUniqueIds(state.objective_requirements, "objective_requirement");
  assertUniqueIds(state.objective_dependencies, "objective_dependency");

  for (const objective of state.reality_objectives) {
    if (objective.project_id !== projectId) {
      throw new PatchError(
        `reality_objective ${objective.id} has mismatched project_id`
      );
    }
    assertRealityObjectiveShape(state, objective);
  }

  for (const requirement of state.objective_requirements) {
    if (requirement.project_id !== projectId) {
      throw new PatchError(
        `objective_requirement ${requirement.id} has mismatched project_id`
      );
    }
    assertObjectiveRequirementShape(state, requirement);
  }

  for (const dependency of state.objective_dependencies) {
    if (dependency.project_id !== projectId) {
      throw new PatchError(
        `objective_dependency ${dependency.id} has mismatched project_id`
      );
    }
    assertObjectiveDependencyShape(state, dependency, dependency.id);
  }

  // Keep declared_by entity_id checks centralized even when intervals are empty.
  for (const declared of [
    ...state.reality_objectives,
    ...state.objective_requirements,
    ...state.objective_dependencies,
  ]) {
    if (
      declared.declared_by.entity_id &&
      !entityIds.has(declared.declared_by.entity_id)
    ) {
      throw new PatchError(
        `declared_by.entity_id missing for ${declared.id}`
      );
    }
  }
}

function assertFutureScenarioUpsert(
  state: ProjectState,
  operation: Extract<PatchOperation, { entity: "future_scenario" }>
): void {
  const payload = operation.payload;
  if (!payload) {
    return;
  }

  const existing = state.future_scenarios.find(
    (entry) => entry.id === operation.entity_id
  );
  const merged: FutureScenario = {
    ...(existing ?? {
      id: operation.entity_id,
      project_id: state.project.id,
      label: "",
      as_of: "",
      declared_by: { kind: "human" },
      recorded_at: "",
      basis_state_ids: [],
      basis_claim_ids: [],
      basis_evidence_ids: [],
      created_at: "",
      updated_at: "",
    }),
    ...payload,
    id: operation.entity_id,
    project_id: state.project.id,
    basis_state_ids: payload.basis_state_ids ?? existing?.basis_state_ids ?? [],
    basis_claim_ids: payload.basis_claim_ids ?? existing?.basis_claim_ids ?? [],
    basis_evidence_ids:
      payload.basis_evidence_ids ?? existing?.basis_evidence_ids ?? [],
  } as FutureScenario;

  assertFutureScenarioShape(state, merged);
}

function assertScenarioStateProjectionUpsert(
  state: ProjectState,
  operation: Extract<PatchOperation, { entity: "scenario_state_projection" }>
): void {
  const payload = operation.payload;
  if (!payload) {
    return;
  }

  const existing = state.scenario_state_projections.find(
    (entry) => entry.id === operation.entity_id
  );
  const merged: ScenarioStateProjection = {
    ...(existing ?? {
      id: operation.entity_id,
      project_id: state.project.id,
      scenario_id: "",
      subject_id: "",
      state_kind: "",
      projected_value: "",
      projected_for: "",
      recorded_at: "",
      created_at: "",
      updated_at: "",
    }),
    ...payload,
    id: operation.entity_id,
    project_id: state.project.id,
  } as ScenarioStateProjection;

  assertScenarioStateProjectionShape(state, merged, operation.entity_id);
}

function assertScenarioLikelihoodEstimateUpsert(
  state: ProjectState,
  operation: Extract<PatchOperation, { entity: "scenario_likelihood_estimate" }>
): void {
  const payload = operation.payload;
  if (!payload) {
    return;
  }

  const existing = state.scenario_likelihood_estimates.find(
    (entry) => entry.id === operation.entity_id
  );
  const merged: ScenarioLikelihoodEstimate = {
    ...(existing ?? {
      id: operation.entity_id,
      project_id: state.project.id,
      scenario_id: "",
      probability: 0,
      estimated_by: { kind: "human" },
      estimated_at: "",
      recorded_at: "",
      created_at: "",
      updated_at: "",
    }),
    ...payload,
    id: operation.entity_id,
    project_id: state.project.id,
  } as ScenarioLikelihoodEstimate;

  assertScenarioLikelihoodEstimateShape(state, merged);
}

function assertFutureScenarioShape(
  state: ProjectState,
  scenario: FutureScenario
): void {
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));
  const stateIds = new Set(state.reality_states.map((entry) => entry.id));
  const claimIds = new Set(state.claims.map((entry) => entry.id));
  const evidenceIds = new Set(state.evidence.map((entry) => entry.id));

  if (
    scenario.declared_by.entity_id &&
    !entityIds.has(scenario.declared_by.entity_id)
  ) {
    throw new PatchError(
      `future_scenario ${scenario.id} declared_by.entity_id references missing RealityEntity ${scenario.declared_by.entity_id}`
    );
  }

  for (const stateId of scenario.basis_state_ids) {
    if (!stateIds.has(stateId)) {
      throw new PatchError(
        `future_scenario ${scenario.id} references missing basis_state_id ${stateId}`
      );
    }
  }
  for (const claimId of scenario.basis_claim_ids) {
    if (!claimIds.has(claimId)) {
      throw new PatchError(
        `future_scenario ${scenario.id} references missing basis_claim_id ${claimId}`
      );
    }
  }
  for (const evidenceId of scenario.basis_evidence_ids) {
    if (!evidenceIds.has(evidenceId)) {
      throw new PatchError(
        `future_scenario ${scenario.id} references missing basis_evidence_id ${evidenceId}`
      );
    }
  }
}

function assertScenarioStateProjectionShape(
  state: ProjectState,
  projection: ScenarioStateProjection,
  selfId: string
): void {
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));
  const scenario = state.future_scenarios.find(
    (entry) =>
      entry.id === projection.scenario_id &&
      entry.project_id === state.project.id
  );
  if (!scenario) {
    throw new PatchError(
      `scenario_state_projection ${projection.id} references missing FutureScenario ${projection.scenario_id}`
    );
  }
  if (!entityIds.has(projection.subject_id)) {
    throw new PatchError(
      `scenario_state_projection ${projection.id} references missing subject_id ${projection.subject_id}`
    );
  }
  if (projection.projected_for <= scenario.as_of) {
    throw new PatchError(
      `scenario_state_projection ${projection.id} projected_for must be after scenario.as_of`
    );
  }

  for (const other of state.scenario_state_projections) {
    if (other.id === selfId) {
      continue;
    }
    if (
      other.scenario_id === projection.scenario_id &&
      other.subject_id === projection.subject_id &&
      other.state_kind === projection.state_kind &&
      other.projected_for === projection.projected_for &&
      semanticValuesEqual(other.projected_value, projection.projected_value)
    ) {
      throw new PatchError(
        `scenario_state_projection ${projection.id} duplicates semantic projection for scenario ${projection.scenario_id}`
      );
    }
  }
}

function assertScenarioLikelihoodEstimateShape(
  state: ProjectState,
  estimate: ScenarioLikelihoodEstimate
): void {
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));
  const scenario = state.future_scenarios.find(
    (entry) =>
      entry.id === estimate.scenario_id &&
      entry.project_id === state.project.id
  );
  if (!scenario) {
    throw new PatchError(
      `scenario_likelihood_estimate ${estimate.id} references missing FutureScenario ${estimate.scenario_id}`
    );
  }
  if (
    estimate.estimated_by.entity_id &&
    !entityIds.has(estimate.estimated_by.entity_id)
  ) {
    throw new PatchError(
      `scenario_likelihood_estimate ${estimate.id} estimated_by.entity_id references missing RealityEntity ${estimate.estimated_by.entity_id}`
    );
  }
  if (
    Number.isNaN(estimate.probability) ||
    estimate.probability < 0 ||
    estimate.probability > 1
  ) {
    throw new PatchError(
      `scenario_likelihood_estimate ${estimate.id} probability must be in [0, 1]`
    );
  }
}

function assertProspectiveInvariants(state: ProjectState): void {
  const projectId = state.project.id;
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  assertUniqueIds(state.future_scenarios, "future_scenario");
  assertUniqueIds(state.scenario_state_projections, "scenario_state_projection");
  assertUniqueIds(
    state.scenario_likelihood_estimates,
    "scenario_likelihood_estimate"
  );

  for (const scenario of state.future_scenarios) {
    if (scenario.project_id !== projectId) {
      throw new PatchError(
        `future_scenario ${scenario.id} has mismatched project_id`
      );
    }
    assertFutureScenarioShape(state, scenario);
  }

  for (const projection of state.scenario_state_projections) {
    if (projection.project_id !== projectId) {
      throw new PatchError(
        `scenario_state_projection ${projection.id} has mismatched project_id`
      );
    }
    assertScenarioStateProjectionShape(state, projection, projection.id);
  }

  for (const estimate of state.scenario_likelihood_estimates) {
    if (estimate.project_id !== projectId) {
      throw new PatchError(
        `scenario_likelihood_estimate ${estimate.id} has mismatched project_id`
      );
    }
    assertScenarioLikelihoodEstimateShape(state, estimate);
  }

  for (const scenario of state.future_scenarios) {
    if (
      scenario.declared_by.entity_id &&
      !entityIds.has(scenario.declared_by.entity_id)
    ) {
      throw new PatchError(
        `future_scenario ${scenario.id} declared_by.entity_id missing`
      );
    }
  }
}

function normalizeImpactDimension(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new PatchError("impact_declaration dimension must be non-empty");
  }
  return trimmed;
}

function impactDeclarerKey(
  declarer: ImpactDeclaration["declared_by"]
): string {
  return [
    declarer.kind,
    declarer.entity_id ?? "",
    declarer.external_id ?? "",
    declarer.label ?? "",
  ].join("|");
}

function assertImpactDirection(value: unknown): ImpactDirection {
  if (value === "ADVERSE" || value === "BENEFICIAL") {
    return value;
  }
  throw new PatchError(
    `impact_declaration direction must be ADVERSE or BENEFICIAL`
  );
}

function assertImpactDeclarationUpsert(
  state: ProjectState,
  operation: Extract<PatchOperation, { entity: "impact_declaration" }>
): void {
  const payload = operation.payload ?? {};
  const existing = state.impact_declarations.find(
    (entry) => entry.id === operation.entity_id
  );
  const basisPayload = (payload.basis ?? existing?.basis) as
    | ImpactDeclaration["basis"]
    | undefined;
  if (!basisPayload || basisPayload.kind !== "REFERENCE_DEVIATION") {
    throw new PatchError(
      `impact_declaration ${operation.entity_id} basis.kind must be REFERENCE_DEVIATION`
    );
  }

  const merged: ImpactDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    basis: basisPayload,
    affected_entity_id:
      (payload.affected_entity_id as string | undefined) ??
      existing?.affected_entity_id ??
      "",
    dimension: normalizeImpactDimension(
      (payload.dimension as string | undefined) ??
        existing?.dimension ??
        ""
    ),
    direction: assertImpactDirection(
      payload.direction ?? existing?.direction ?? ""
    ),
    description:
      payload.description !== undefined
        ? (payload.description as string | null)
        : (existing?.description ?? null),
    valid_from:
      (payload.valid_from as string | undefined) ??
      existing?.valid_from ??
      "",
    valid_until:
      payload.valid_until !== undefined
        ? (payload.valid_until as string | null)
        : (existing?.valid_until ?? null),
    declared_by: (payload.declared_by ??
      existing?.declared_by ?? {
        kind: "human",
      }) as ImpactDeclaration["declared_by"],
    recorded_at:
      (payload.recorded_at as string | undefined) ??
      existing?.recorded_at ??
      "",
    created_at: existing?.created_at ?? payload.created_at ?? "",
    updated_at: payload.updated_at ?? existing?.updated_at ?? "",
  };

  assertImpactDeclarationShape(state, merged, operation.entity_id);
}

function assertImpactDeclarationShape(
  state: ProjectState,
  declaration: ImpactDeclaration,
  selfId: string
): void {
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));
  const reference = state.reference_conditions.find(
    (entry) =>
      entry.id === declaration.basis.reference_condition_id &&
      entry.project_id === state.project.id
  );
  if (!reference) {
    throw new PatchError(
      `impact_declaration ${declaration.id} references missing ReferenceCondition ${declaration.basis.reference_condition_id}`
    );
  }
  if (reference.reference_kind !== "ACCEPTABLE") {
    throw new PatchError(
      `impact_declaration ${declaration.id} basis must reference ACCEPTABLE ReferenceCondition`
    );
  }
  if (!entityIds.has(declaration.affected_entity_id)) {
    throw new PatchError(
      `impact_declaration ${declaration.id} references missing affected_entity_id ${declaration.affected_entity_id}`
    );
  }
  if (
    declaration.declared_by.entity_id &&
    !entityIds.has(declaration.declared_by.entity_id)
  ) {
    throw new PatchError(
      `impact_declaration ${declaration.id} declared_by.entity_id references missing RealityEntity ${declaration.declared_by.entity_id}`
    );
  }
  if (
    declaration.valid_until !== null &&
    isAdmissionTemporalRelationProven(declaration.valid_until, declaration.valid_from, "<=")
  ) {
    throw new PatchError(
      `impact_declaration ${declaration.id} valid_until must be after valid_from`
    );
  }

  for (const other of state.impact_declarations) {
    if (other.id === selfId) {
      continue;
    }
    if (
      other.basis.reference_condition_id ===
        declaration.basis.reference_condition_id &&
      other.affected_entity_id === declaration.affected_entity_id &&
      other.dimension === declaration.dimension &&
      other.direction === declaration.direction &&
      isAdmissionTemporalRelationProven(other.valid_from, declaration.valid_from, "===") &&
      (other.valid_until === null || declaration.valid_until === null
        ? other.valid_until === declaration.valid_until
        : isAdmissionTemporalRelationProven(other.valid_until, declaration.valid_until, "===")) &&
      impactDeclarerKey(other.declared_by) ===
        impactDeclarerKey(declaration.declared_by)
    ) {
      throw new PatchError(
        `impact_declaration ${declaration.id} duplicates semantic declaration for ${declaration.basis.reference_condition_id}`
      );
    }
  }
}

function assertImpactInvariants(state: ProjectState): void {
  const projectId = state.project.id;
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  assertUniqueIds(state.impact_declarations, "impact_declaration");

  for (const declaration of state.impact_declarations) {
    if (declaration.project_id !== projectId) {
      throw new PatchError(
        `impact_declaration ${declaration.id} has mismatched project_id`
      );
    }
    assertImpactDeclarationShape(state, declaration, declaration.id);
    if (
      declaration.declared_by.entity_id &&
      !entityIds.has(declaration.declared_by.entity_id)
    ) {
      throw new PatchError(
        `impact_declaration ${declaration.id} declared_by.entity_id missing`
      );
    }
  }
}

function normalizeNonEmptyKey(value: string, field: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new PatchError(`impact_measure_declaration ${field} must be non-empty`);
  }
  return trimmed;
}

function impactMeasureSemanticKey(measure: ImpactMeasure): string {
  if (measure.kind === "POINT") {
    return `POINT|${measure.value}`;
  }
  return `RANGE|${measure.min}|${measure.max}`;
}

function assertFiniteNonNegative(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new PatchError(
      `impact_measure_declaration ${label} must be a finite non-negative number`
    );
  }
}

function assertImpactMeasure(measure: unknown): ImpactMeasure {
  if (!measure || typeof measure !== "object") {
    throw new PatchError("impact_measure_declaration measure is required");
  }
  const record = measure as Record<string, unknown>;
  if (record.kind === "POINT") {
    if (typeof record.value !== "number") {
      throw new PatchError(
        "impact_measure_declaration POINT measure requires numeric value"
      );
    }
    assertFiniteNonNegative(record.value, "POINT.value");
    return { kind: "POINT", value: record.value };
  }
  if (record.kind === "RANGE") {
    if (typeof record.min !== "number" || typeof record.max !== "number") {
      throw new PatchError(
        "impact_measure_declaration RANGE measure requires numeric min and max"
      );
    }
    assertFiniteNonNegative(record.min, "RANGE.min");
    assertFiniteNonNegative(record.max, "RANGE.max");
    if (record.min > record.max) {
      throw new PatchError(
        "impact_measure_declaration RANGE requires min <= max"
      );
    }
    return { kind: "RANGE", min: record.min, max: record.max };
  }
  throw new PatchError(
    "impact_measure_declaration measure.kind must be POINT or RANGE"
  );
}

function assertImpactMeasureDeclarationUpsert(
  state: ProjectState,
  operation: Extract<PatchOperation, { entity: "impact_measure_declaration" }>
): void {
  const payload = operation.payload ?? {};
  const existing = state.impact_measure_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  const merged: ImpactMeasureDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    impact_declaration_id:
      (payload.impact_declaration_id as string | undefined) ??
      existing?.impact_declaration_id ??
      "",
    metric_key: normalizeNonEmptyKey(
      (payload.metric_key as string | undefined) ?? existing?.metric_key ?? "",
      "metric_key"
    ),
    unit: normalizeNonEmptyKey(
      (payload.unit as string | undefined) ?? existing?.unit ?? "",
      "unit"
    ),
    measure: assertImpactMeasure(payload.measure ?? existing?.measure),
    valid_from:
      (payload.valid_from as string | undefined) ??
      existing?.valid_from ??
      "",
    valid_until:
      payload.valid_until !== undefined
        ? (payload.valid_until as string | null)
        : (existing?.valid_until ?? null),
    declared_by: (payload.declared_by ??
      existing?.declared_by ?? {
        kind: "human",
      }) as ImpactMeasureDeclaration["declared_by"],
    recorded_at:
      (payload.recorded_at as string | undefined) ??
      existing?.recorded_at ??
      "",
    created_at: existing?.created_at ?? payload.created_at ?? "",
    updated_at: payload.updated_at ?? existing?.updated_at ?? "",
  };

  assertImpactMeasureDeclarationShape(state, merged, operation.entity_id);
}

function assertImpactMeasureDeclarationShape(
  state: ProjectState,
  declaration: ImpactMeasureDeclaration,
  selfId: string
): void {
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));
  const parent = state.impact_declarations.find(
    (entry) =>
      entry.id === declaration.impact_declaration_id &&
      entry.project_id === state.project.id
  );
  if (!parent) {
    throw new PatchError(
      `impact_measure_declaration ${declaration.id} references missing ImpactDeclaration ${declaration.impact_declaration_id}`
    );
  }
  if (
    declaration.declared_by.entity_id &&
    !entityIds.has(declaration.declared_by.entity_id)
  ) {
    throw new PatchError(
      `impact_measure_declaration ${declaration.id} declared_by.entity_id references missing RealityEntity ${declaration.declared_by.entity_id}`
    );
  }
  if (
    declaration.valid_until !== null &&
    isAdmissionTemporalRelationProven(declaration.valid_until, declaration.valid_from, "<=")
  ) {
    throw new PatchError(
      `impact_measure_declaration ${declaration.id} valid_until must be after valid_from`
    );
  }

  for (const other of state.impact_measure_declarations) {
    if (other.id === selfId) {
      continue;
    }
    if (
      other.impact_declaration_id === declaration.impact_declaration_id &&
      other.metric_key === declaration.metric_key &&
      other.unit === declaration.unit &&
      isAdmissionTemporalRelationProven(other.valid_from, declaration.valid_from, "===") &&
      (other.valid_until === null || declaration.valid_until === null
        ? other.valid_until === declaration.valid_until
        : isAdmissionTemporalRelationProven(other.valid_until, declaration.valid_until, "===")) &&
      impactMeasureSemanticKey(other.measure) ===
        impactMeasureSemanticKey(declaration.measure) &&
      impactDeclarerKey(other.declared_by) ===
        impactDeclarerKey(declaration.declared_by)
    ) {
      throw new PatchError(
        `impact_measure_declaration ${declaration.id} duplicates semantic measure for impact_declaration ${declaration.impact_declaration_id}`
      );
    }
  }
}

function assertImpactMeasureInvariants(state: ProjectState): void {
  const projectId = state.project.id;
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  assertUniqueIds(
    state.impact_measure_declarations,
    "impact_measure_declaration"
  );

  for (const declaration of state.impact_measure_declarations) {
    if (declaration.project_id !== projectId) {
      throw new PatchError(
        `impact_measure_declaration ${declaration.id} has mismatched project_id`
      );
    }
    assertImpactMeasureDeclarationShape(state, declaration, declaration.id);
    if (
      declaration.declared_by.entity_id &&
      !entityIds.has(declaration.declared_by.entity_id)
    ) {
      throw new PatchError(
        `impact_measure_declaration ${declaration.id} declared_by.entity_id missing`
      );
    }
  }
}

const AUTHORITY_POWER_SCOPE_KINDS: Record<
  AuthorityPower,
  GovernanceScope["kind"]
> = {
  ESTABLISH_REFERENCE: "SUBJECT_STATE",
  GOVERN_OBJECTIVE: "REALITY_OBJECTIVE",
  DECLARE_IMPACT: "REFERENCE_CONDITION",
  DECLARE_IMPACT_MEASURE: "IMPACT_DECLARATION",
  AUTHORIZE_INTERVENTION: "INTERVENTION_DECLARATION",
};

const VALID_STANDING_RIGHTS = new Set<StandingRight>(["PARTICIPATE", "CONTEST"]);

function governanceDeclarerKey(declarer: AuthorityDeclaration["declared_by"]): string {
  return [
    declarer.kind,
    declarer.entity_id ?? "",
    declarer.external_id ?? "",
    declarer.label ?? "",
  ].join("|");
}

function standingRightsKey(rights: StandingRight[]): string {
  return [...rights].sort().join("|");
}

function assertAuthorityPowerScopeCompatibility(
  power: AuthorityPower,
  scope: GovernanceScope
): void {
  if (scope.kind !== AUTHORITY_POWER_SCOPE_KINDS[power]) {
    throw new PatchError(
      `authority_declaration power ${power} is incompatible with scope kind ${scope.kind}`
    );
  }
}

function assertGovernanceScopeReferences(
  state: ProjectState,
  scope: GovernanceScope,
  label: string
): void {
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));
  const projectId = state.project.id;

  if (scope.kind === "SUBJECT_STATE") {
    if (!scope.state_kind.trim()) {
      throw new PatchError(`${label} SUBJECT_STATE scope requires non-empty state_kind`);
    }
    if (!entityIds.has(scope.subject_id)) {
      throw new PatchError(
        `${label} SUBJECT_STATE scope references missing RealityEntity ${scope.subject_id}`
      );
    }
    return;
  }

  if (scope.kind === "REFERENCE_CONDITION") {
    const reference = state.reference_conditions.find(
      (entry) =>
        entry.id === scope.reference_condition_id &&
        entry.project_id === projectId
    );
    if (!reference) {
      throw new PatchError(
        `${label} REFERENCE_CONDITION scope references missing ReferenceCondition ${scope.reference_condition_id}`
      );
    }
    return;
  }

  if (scope.kind === "REALITY_OBJECTIVE") {
    const objective = state.reality_objectives.find(
      (entry) =>
        entry.id === scope.objective_id && entry.project_id === projectId
    );
    if (!objective) {
      throw new PatchError(
        `${label} REALITY_OBJECTIVE scope references missing RealityObjective ${scope.objective_id}`
      );
    }
    return;
  }

  if (scope.kind === "IMPACT_DECLARATION") {
    const impact = state.impact_declarations.find(
      (entry) =>
        entry.id === scope.impact_declaration_id &&
        entry.project_id === projectId
    );
    if (!impact) {
      throw new PatchError(
        `${label} IMPACT_DECLARATION scope references missing ImpactDeclaration ${scope.impact_declaration_id}`
      );
    }
    return;
  }

  const intervention = state.intervention_declarations.find(
    (entry) =>
      entry.id === scope.intervention_id && entry.project_id === projectId
  );
  if (!intervention) {
    throw new PatchError(
      `${label} INTERVENTION_DECLARATION scope references missing InterventionDeclaration ${scope.intervention_id}`
    );
  }
}

function assertStandingScopeReferences(
  state: ProjectState,
  scope: StandingScope,
  label: string
): void {
  assertGovernanceScopeReferences(state, scope, label);
}

function assertAuthorityDeclarationUpsert(
  state: ProjectState,
  operation: Extract<PatchOperation, { entity: "authority_declaration" }>
): void {
  const payload = operation.payload ?? {};
  const existing = state.authority_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  const merged: AuthorityDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    holder_entity_id:
      (payload.holder_entity_id as string | undefined) ??
      existing?.holder_entity_id ??
      "",
    power: (payload.power ?? existing?.power ?? "") as AuthorityPower,
    scope: (payload.scope ?? existing?.scope ?? {
      kind: "SUBJECT_STATE",
      subject_id: "",
      state_kind: "",
    }) as GovernanceScope,
    valid_from:
      (payload.valid_from as string | undefined) ?? existing?.valid_from ?? "",
    valid_until:
      payload.valid_until !== undefined
        ? (payload.valid_until as string | null)
        : (existing?.valid_until ?? null),
    declared_by: (payload.declared_by ??
      existing?.declared_by ?? {
        kind: "human",
      }) as AuthorityDeclaration["declared_by"],
    recorded_at:
      (payload.recorded_at as string | undefined) ??
      existing?.recorded_at ??
      "",
    created_at: existing?.created_at ?? payload.created_at ?? "",
    updated_at: payload.updated_at ?? existing?.updated_at ?? "",
  };

  assertAuthorityDeclarationShape(state, merged, operation.entity_id);
}

function assertAuthorityDeclarationShape(
  state: ProjectState,
  declaration: AuthorityDeclaration,
  selfId: string
): void {
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  if (!entityIds.has(declaration.holder_entity_id)) {
    throw new PatchError(
      `authority_declaration ${declaration.id} references missing holder RealityEntity ${declaration.holder_entity_id}`
    );
  }

  assertAuthorityPowerScopeCompatibility(declaration.power, declaration.scope);
  assertGovernanceScopeReferences(
    state,
    declaration.scope,
    `authority_declaration ${declaration.id}`
  );

  if (
    declaration.power === "DECLARE_IMPACT" &&
    declaration.scope.kind === "REFERENCE_CONDITION"
  ) {
    const refScope = declaration.scope;
    const reference = state.reference_conditions.find(
      (entry) => entry.id === refScope.reference_condition_id
    );
    if (reference && reference.reference_kind !== "ACCEPTABLE") {
      throw new PatchError(
        `authority_declaration ${declaration.id} DECLARE_IMPACT scope must reference ACCEPTABLE ReferenceCondition`
      );
    }
  }

  if (
    declaration.valid_until !== null &&
    isAdmissionTemporalRelationProven(declaration.valid_until, declaration.valid_from, "<=")
  ) {
    throw new PatchError(
      `authority_declaration ${declaration.id} valid_until must be after valid_from`
    );
  }

  for (const other of state.authority_declarations) {
    if (other.id === selfId) {
      continue;
    }
    if (
      other.holder_entity_id === declaration.holder_entity_id &&
      other.power === declaration.power &&
      governanceScopesEqual(other.scope, declaration.scope) &&
      governanceDeclarerKey(other.declared_by) ===
        governanceDeclarerKey(declaration.declared_by) &&
      intervalOverlapIsProven(
        other.valid_from,
        other.valid_until,
        declaration.valid_from,
        declaration.valid_until
      )
    ) {
      throw new PatchError(
        `authority_declaration ${declaration.id} duplicates overlapping declaration for holder ${declaration.holder_entity_id}`
      );
    }
  }
}

function assertStandingRights(rights: unknown): StandingRight[] {
  if (!Array.isArray(rights) || rights.length === 0) {
    throw new PatchError("standing_declaration rights must be a non-empty array");
  }

  const normalized: StandingRight[] = [];
  const seen = new Set<StandingRight>();
  for (const right of rights) {
    if (typeof right !== "string" || !VALID_STANDING_RIGHTS.has(right as StandingRight)) {
      throw new PatchError(
        `standing_declaration rights must contain only PARTICIPATE or CONTEST`
      );
    }
    const typed = right as StandingRight;
    if (seen.has(typed)) {
      throw new PatchError("standing_declaration rights must not contain duplicates");
    }
    seen.add(typed);
    normalized.push(typed);
  }
  return normalized;
}

function assertStandingDeclarationUpsert(
  state: ProjectState,
  operation: Extract<PatchOperation, { entity: "standing_declaration" }>
): void {
  const payload = operation.payload ?? {};
  const existing = state.standing_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  const merged: StandingDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    holder_entity_id:
      (payload.holder_entity_id as string | undefined) ??
      existing?.holder_entity_id ??
      "",
    scope: (payload.scope ?? existing?.scope ?? {
      kind: "REFERENCE_CONDITION",
      reference_condition_id: "",
    }) as StandingScope,
    rights: assertStandingRights(payload.rights ?? existing?.rights ?? []),
    valid_from:
      (payload.valid_from as string | undefined) ?? existing?.valid_from ?? "",
    valid_until:
      payload.valid_until !== undefined
        ? (payload.valid_until as string | null)
        : (existing?.valid_until ?? null),
    declared_by: (payload.declared_by ??
      existing?.declared_by ?? {
        kind: "human",
      }) as StandingDeclaration["declared_by"],
    recorded_at:
      (payload.recorded_at as string | undefined) ??
      existing?.recorded_at ??
      "",
    created_at: existing?.created_at ?? payload.created_at ?? "",
    updated_at: payload.updated_at ?? existing?.updated_at ?? "",
  };

  assertStandingDeclarationShape(state, merged, operation.entity_id);
}

function assertStandingDeclarationShape(
  state: ProjectState,
  declaration: StandingDeclaration,
  selfId: string
): void {
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  if (!entityIds.has(declaration.holder_entity_id)) {
    throw new PatchError(
      `standing_declaration ${declaration.id} references missing holder RealityEntity ${declaration.holder_entity_id}`
    );
  }

  assertStandingScopeReferences(
    state,
    declaration.scope,
    `standing_declaration ${declaration.id}`
  );

  if (
    declaration.valid_until !== null &&
    isAdmissionTemporalRelationProven(declaration.valid_until, declaration.valid_from, "<=")
  ) {
    throw new PatchError(
      `standing_declaration ${declaration.id} valid_until must be after valid_from`
    );
  }

  for (const other of state.standing_declarations) {
    if (other.id === selfId) {
      continue;
    }
    if (
      other.holder_entity_id === declaration.holder_entity_id &&
      standingScopesEqual(other.scope, declaration.scope) &&
      standingRightsKey(other.rights) === standingRightsKey(declaration.rights) &&
      governanceDeclarerKey(other.declared_by) ===
        governanceDeclarerKey(declaration.declared_by) &&
      intervalOverlapIsProven(
        other.valid_from,
        other.valid_until,
        declaration.valid_from,
        declaration.valid_until
      )
    ) {
      throw new PatchError(
        `standing_declaration ${declaration.id} duplicates overlapping declaration for holder ${declaration.holder_entity_id}`
      );
    }
  }
}

function assertMandateKind(kind: unknown): MandateKind {
  if (kind !== "PURSUE_OBJECTIVE") {
    throw new PatchError("mandate_declaration kind must be PURSUE_OBJECTIVE");
  }
  return kind;
}

function assertMandateDeclarationUpsert(
  state: ProjectState,
  operation: Extract<PatchOperation, { entity: "mandate_declaration" }>
): void {
  const payload = operation.payload ?? {};
  const existing = state.mandate_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  const merged: MandateDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    holder_entity_id:
      (payload.holder_entity_id as string | undefined) ??
      existing?.holder_entity_id ??
      "",
    kind: assertMandateKind(payload.kind ?? existing?.kind ?? ""),
    objective_id:
      (payload.objective_id as string | undefined) ??
      existing?.objective_id ??
      "",
    valid_from:
      (payload.valid_from as string | undefined) ?? existing?.valid_from ?? "",
    valid_until:
      payload.valid_until !== undefined
        ? (payload.valid_until as string | null)
        : (existing?.valid_until ?? null),
    declared_by: (payload.declared_by ??
      existing?.declared_by ?? {
        kind: "human",
      }) as MandateDeclaration["declared_by"],
    recorded_at:
      (payload.recorded_at as string | undefined) ??
      existing?.recorded_at ??
      "",
    created_at: existing?.created_at ?? payload.created_at ?? "",
    updated_at: payload.updated_at ?? existing?.updated_at ?? "",
  };

  assertMandateDeclarationShape(state, merged, operation.entity_id);
}

function assertMandateDeclarationShape(
  state: ProjectState,
  declaration: MandateDeclaration,
  selfId: string
): void {
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));
  const objective = state.reality_objectives.find(
    (entry) =>
      entry.id === declaration.objective_id &&
      entry.project_id === state.project.id
  );

  if (!entityIds.has(declaration.holder_entity_id)) {
    throw new PatchError(
      `mandate_declaration ${declaration.id} references missing holder RealityEntity ${declaration.holder_entity_id}`
    );
  }
  if (!objective) {
    throw new PatchError(
      `mandate_declaration ${declaration.id} references missing RealityObjective ${declaration.objective_id}`
    );
  }

  if (
    declaration.valid_until !== null &&
    isAdmissionTemporalRelationProven(declaration.valid_until, declaration.valid_from, "<=")
  ) {
    throw new PatchError(
      `mandate_declaration ${declaration.id} valid_until must be after valid_from`
    );
  }

  for (const other of state.mandate_declarations) {
    if (other.id === selfId) {
      continue;
    }
    if (
      other.holder_entity_id === declaration.holder_entity_id &&
      other.objective_id === declaration.objective_id &&
      other.kind === declaration.kind &&
      governanceDeclarerKey(other.declared_by) ===
        governanceDeclarerKey(declaration.declared_by) &&
      intervalOverlapIsProven(
        other.valid_from,
        other.valid_until,
        declaration.valid_from,
        declaration.valid_until
      )
    ) {
      throw new PatchError(
        `mandate_declaration ${declaration.id} duplicates overlapping declaration for holder ${declaration.holder_entity_id}`
      );
    }
  }
}

function sourceAuthorityIdsKey(ids: string[]): string {
  return [...ids].sort().join("|");
}

function assertAuthorityDelegationDeclarationUpsert(
  state: ProjectState,
  operation: Extract<
    PatchOperation,
    { entity: "authority_delegation_declaration" }
  >
): void {
  const payload = operation.payload ?? {};
  const existing = state.authority_delegation_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  const merged: AuthorityDelegationDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    delegator_entity_id:
      (payload.delegator_entity_id as string | undefined) ??
      existing?.delegator_entity_id ??
      "",
    delegatee_entity_id:
      (payload.delegatee_entity_id as string | undefined) ??
      existing?.delegatee_entity_id ??
      "",
    power: (payload.power ?? existing?.power ?? "") as AuthorityPower,
    scope: (payload.scope ?? existing?.scope ?? {
      kind: "SUBJECT_STATE",
      subject_id: "",
      state_kind: "",
    }) as GovernanceScope,
    source_authority_declaration_ids: (payload.source_authority_declaration_ids ??
      existing?.source_authority_declaration_ids ??
      []) as string[],
    valid_from:
      (payload.valid_from as string | undefined) ?? existing?.valid_from ?? "",
    valid_until:
      payload.valid_until !== undefined
        ? (payload.valid_until as string | null)
        : (existing?.valid_until ?? null),
    declared_by: (payload.declared_by ??
      existing?.declared_by ?? {
        kind: "human",
      }) as AuthorityDelegationDeclaration["declared_by"],
    recorded_at:
      (payload.recorded_at as string | undefined) ??
      existing?.recorded_at ??
      "",
    created_at: existing?.created_at ?? payload.created_at ?? "",
    updated_at: payload.updated_at ?? existing?.updated_at ?? "",
  };

  assertAuthorityDelegationDeclarationShape(state, merged, operation.entity_id);
}

function assertAuthorityDelegationDeclarationShape(
  state: ProjectState,
  declaration: AuthorityDelegationDeclaration,
  selfId: string
): void {
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  if (!entityIds.has(declaration.delegator_entity_id)) {
    throw new PatchError(
      `authority_delegation_declaration ${declaration.id} references missing delegator RealityEntity ${declaration.delegator_entity_id}`
    );
  }
  if (!entityIds.has(declaration.delegatee_entity_id)) {
    throw new PatchError(
      `authority_delegation_declaration ${declaration.id} references missing delegatee RealityEntity ${declaration.delegatee_entity_id}`
    );
  }
  if (declaration.delegator_entity_id === declaration.delegatee_entity_id) {
    throw new PatchError(
      `authority_delegation_declaration ${declaration.id} self-delegation is not allowed`
    );
  }

  assertAuthorityPowerScopeCompatibility(declaration.power, declaration.scope);
  assertGovernanceScopeReferences(
    state,
    declaration.scope,
    `authority_delegation_declaration ${declaration.id}`
  );

  if (
    declaration.power === "DECLARE_IMPACT" &&
    declaration.scope.kind === "REFERENCE_CONDITION"
  ) {
    const refScope = declaration.scope;
    const reference = state.reference_conditions.find(
      (entry) => entry.id === refScope.reference_condition_id
    );
    if (reference && reference.reference_kind !== "ACCEPTABLE") {
      throw new PatchError(
        `authority_delegation_declaration ${declaration.id} DECLARE_IMPACT scope must reference ACCEPTABLE ReferenceCondition`
      );
    }
  }

  if (
    !Array.isArray(declaration.source_authority_declaration_ids) ||
    declaration.source_authority_declaration_ids.length < 1
  ) {
    throw new PatchError(
      `authority_delegation_declaration ${declaration.id} requires non-empty source_authority_declaration_ids`
    );
  }

  const seenSource = new Set<string>();
  for (const sourceId of declaration.source_authority_declaration_ids) {
    if (seenSource.has(sourceId)) {
      throw new PatchError(
        `authority_delegation_declaration ${declaration.id} has duplicate source_authority_declaration_ids`
      );
    }
    seenSource.add(sourceId);

    const source = state.authority_declarations.find(
      (entry) =>
        entry.id === sourceId && entry.project_id === state.project.id
    );
    if (!source) {
      throw new PatchError(
        `authority_delegation_declaration ${declaration.id} references missing AuthorityDeclaration ${sourceId}`
      );
    }
    if (source.holder_entity_id !== declaration.delegator_entity_id) {
      throw new PatchError(
        `authority_delegation_declaration ${declaration.id} source AuthorityDeclaration ${sourceId} holder must equal delegator`
      );
    }
    if (source.power !== declaration.power) {
      throw new PatchError(
        `authority_delegation_declaration ${declaration.id} source AuthorityDeclaration ${sourceId} power must match`
      );
    }
    if (!governanceScopesEqual(source.scope, declaration.scope)) {
      throw new PatchError(
        `authority_delegation_declaration ${declaration.id} source AuthorityDeclaration ${sourceId} scope must match`
      );
    }
  }

  if (
    declaration.valid_until !== null &&
    isAdmissionTemporalRelationProven(declaration.valid_until, declaration.valid_from, "<=")
  ) {
    throw new PatchError(
      `authority_delegation_declaration ${declaration.id} valid_until must be after valid_from`
    );
  }

  for (const other of state.authority_delegation_declarations) {
    if (other.id === selfId) {
      continue;
    }
    if (
      other.delegator_entity_id === declaration.delegator_entity_id &&
      other.delegatee_entity_id === declaration.delegatee_entity_id &&
      other.power === declaration.power &&
      governanceScopesEqual(other.scope, declaration.scope) &&
      sourceAuthorityIdsKey(other.source_authority_declaration_ids) ===
        sourceAuthorityIdsKey(declaration.source_authority_declaration_ids) &&
      governanceDeclarerKey(other.declared_by) ===
        governanceDeclarerKey(declaration.declared_by) &&
      intervalOverlapIsProven(
        other.valid_from,
        other.valid_until,
        declaration.valid_from,
        declaration.valid_until
      )
    ) {
      throw new PatchError(
        `authority_delegation_declaration ${declaration.id} duplicates overlapping declaration`
      );
    }
  }
}

function assertContestTarget(
  state: ProjectState,
  target: unknown,
  label: string
): AuthorityContestTarget {
  if (!target || typeof target !== "object" || Array.isArray(target)) {
    throw new PatchError(`${label} target is required`);
  }
  const record = target as Record<string, unknown>;
  if (record.kind === "AUTHORITY_DECLARATION") {
    const authorityId = record.authority_declaration_id;
    if (typeof authorityId !== "string" || !authorityId) {
      throw new PatchError(
        `${label} AUTHORITY_DECLARATION target requires authority_declaration_id`
      );
    }
    const authority = state.authority_declarations.find(
      (entry) =>
        entry.id === authorityId && entry.project_id === state.project.id
    );
    if (!authority) {
      throw new PatchError(
        `${label} references missing AuthorityDeclaration ${authorityId}`
      );
    }
    return {
      kind: "AUTHORITY_DECLARATION",
      authority_declaration_id: authorityId,
    };
  }
  if (record.kind === "AUTHORITY_DELEGATION") {
    const delegationId = record.authority_delegation_id;
    if (typeof delegationId !== "string" || !delegationId) {
      throw new PatchError(
        `${label} AUTHORITY_DELEGATION target requires authority_delegation_id`
      );
    }
    const delegation = state.authority_delegation_declarations.find(
      (entry) =>
        entry.id === delegationId && entry.project_id === state.project.id
    );
    if (!delegation) {
      throw new PatchError(
        `${label} references missing AuthorityDelegationDeclaration ${delegationId}`
      );
    }
    return {
      kind: "AUTHORITY_DELEGATION",
      authority_delegation_id: delegationId,
    };
  }
  throw new PatchError(
    `${label} target.kind must be AUTHORITY_DECLARATION or AUTHORITY_DELEGATION`
  );
}

function contestTargetKey(target: AuthorityContestTarget): string {
  if (target.kind === "AUTHORITY_DECLARATION") {
    return `AUTHORITY_DECLARATION|${target.authority_declaration_id}`;
  }
  return `AUTHORITY_DELEGATION|${target.authority_delegation_id}`;
}

function assertAuthorityContestDeclarationUpsert(
  state: ProjectState,
  operation: Extract<
    PatchOperation,
    { entity: "authority_contest_declaration" }
  >
): void {
  const payload = operation.payload ?? {};
  const existing = state.authority_contest_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  const merged: AuthorityContestDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    contesting_entity_id:
      (payload.contesting_entity_id as string | undefined) ??
      existing?.contesting_entity_id ??
      "",
    target: assertContestTarget(
      state,
      payload.target ?? existing?.target,
      `authority_contest_declaration ${operation.entity_id}`
    ),
    note:
      payload.note !== undefined
        ? (payload.note as string | null)
        : (existing?.note ?? null),
    valid_from:
      (payload.valid_from as string | undefined) ?? existing?.valid_from ?? "",
    valid_until:
      payload.valid_until !== undefined
        ? (payload.valid_until as string | null)
        : (existing?.valid_until ?? null),
    declared_by: (payload.declared_by ??
      existing?.declared_by ?? {
        kind: "human",
      }) as AuthorityContestDeclaration["declared_by"],
    recorded_at:
      (payload.recorded_at as string | undefined) ??
      existing?.recorded_at ??
      "",
    created_at: existing?.created_at ?? payload.created_at ?? "",
    updated_at: payload.updated_at ?? existing?.updated_at ?? "",
  };

  assertAuthorityContestDeclarationShape(state, merged, operation.entity_id);
}

function assertAuthorityContestDeclarationShape(
  state: ProjectState,
  declaration: AuthorityContestDeclaration,
  selfId: string
): void {
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  if (!entityIds.has(declaration.contesting_entity_id)) {
    throw new PatchError(
      `authority_contest_declaration ${declaration.id} references missing contesting RealityEntity ${declaration.contesting_entity_id}`
    );
  }

  assertContestTarget(
    state,
    declaration.target,
    `authority_contest_declaration ${declaration.id}`
  );

  if (
    declaration.valid_until !== null &&
    isAdmissionTemporalRelationProven(declaration.valid_until, declaration.valid_from, "<=")
  ) {
    throw new PatchError(
      `authority_contest_declaration ${declaration.id} valid_until must be after valid_from`
    );
  }

  for (const other of state.authority_contest_declarations) {
    if (other.id === selfId) {
      continue;
    }
    if (
      other.contesting_entity_id === declaration.contesting_entity_id &&
      contestTargetKey(other.target) === contestTargetKey(declaration.target) &&
      governanceDeclarerKey(other.declared_by) ===
        governanceDeclarerKey(declaration.declared_by) &&
      intervalOverlapIsProven(
        other.valid_from,
        other.valid_until,
        declaration.valid_from,
        declaration.valid_until
      )
    ) {
      throw new PatchError(
        `authority_contest_declaration ${declaration.id} duplicates overlapping declaration`
      );
    }
  }
}

function assertGovernanceInvariants(state: ProjectState): void {
  const projectId = state.project.id;
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  assertUniqueIds(state.authority_declarations, "authority_declaration");
  assertUniqueIds(state.standing_declarations, "standing_declaration");
  assertUniqueIds(state.mandate_declarations, "mandate_declaration");
  assertUniqueIds(
    state.authority_delegation_declarations,
    "authority_delegation_declaration"
  );
  assertUniqueIds(
    state.authority_contest_declarations,
    "authority_contest_declaration"
  );

  for (const declaration of state.authority_declarations) {
    if (declaration.project_id !== projectId) {
      throw new PatchError(
        `authority_declaration ${declaration.id} has mismatched project_id`
      );
    }
    assertAuthorityDeclarationShape(state, declaration, declaration.id);
    if (
      declaration.declared_by.entity_id &&
      !entityIds.has(declaration.declared_by.entity_id)
    ) {
      throw new PatchError(
        `authority_declaration ${declaration.id} declared_by.entity_id missing`
      );
    }
  }

  for (const declaration of state.standing_declarations) {
    if (declaration.project_id !== projectId) {
      throw new PatchError(
        `standing_declaration ${declaration.id} has mismatched project_id`
      );
    }
    assertStandingDeclarationShape(state, declaration, declaration.id);
    if (
      declaration.declared_by.entity_id &&
      !entityIds.has(declaration.declared_by.entity_id)
    ) {
      throw new PatchError(
        `standing_declaration ${declaration.id} declared_by.entity_id missing`
      );
    }
  }

  for (const declaration of state.mandate_declarations) {
    if (declaration.project_id !== projectId) {
      throw new PatchError(
        `mandate_declaration ${declaration.id} has mismatched project_id`
      );
    }
    assertMandateDeclarationShape(state, declaration, declaration.id);
    if (
      declaration.declared_by.entity_id &&
      !entityIds.has(declaration.declared_by.entity_id)
    ) {
      throw new PatchError(
        `mandate_declaration ${declaration.id} declared_by.entity_id missing`
      );
    }
  }

  for (const declaration of state.authority_delegation_declarations) {
    if (declaration.project_id !== projectId) {
      throw new PatchError(
        `authority_delegation_declaration ${declaration.id} has mismatched project_id`
      );
    }
    assertAuthorityDelegationDeclarationShape(
      state,
      declaration,
      declaration.id
    );
    if (
      declaration.declared_by.entity_id &&
      !entityIds.has(declaration.declared_by.entity_id)
    ) {
      throw new PatchError(
        `authority_delegation_declaration ${declaration.id} declared_by.entity_id missing`
      );
    }
  }

  for (const declaration of state.authority_contest_declarations) {
    if (declaration.project_id !== projectId) {
      throw new PatchError(
        `authority_contest_declaration ${declaration.id} has mismatched project_id`
      );
    }
    assertAuthorityContestDeclarationShape(state, declaration, declaration.id);
    if (
      declaration.declared_by.entity_id &&
      !entityIds.has(declaration.declared_by.entity_id)
    ) {
      throw new PatchError(
        `authority_contest_declaration ${declaration.id} declared_by.entity_id missing`
      );
    }
  }
}

function evidenceIdsKey(ids: string[]): string {
  return [...ids].sort().join("|");
}

function assertCapabilityScope(
  state: ProjectState,
  scope: CapabilityScope,
  label: string
): void {
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));
  if (scope.kind === "UNSCOPED") {
    return;
  }
  if (scope.kind === "ENTITY") {
    if (!entityIds.has(scope.entity_id)) {
      throw new PatchError(
        `${label} ENTITY scope references missing RealityEntity ${scope.entity_id}`
      );
    }
    return;
  }
  if (!scope.state_kind.trim()) {
    throw new PatchError(
      `${label} SUBJECT_STATE scope requires non-empty state_kind`
    );
  }
  if (!entityIds.has(scope.subject_id)) {
    throw new PatchError(
      `${label} SUBJECT_STATE scope references missing RealityEntity ${scope.subject_id}`
    );
  }
}

function assertCapabilityDeclarationUpsert(
  state: ProjectState,
  operation: Extract<PatchOperation, { entity: "capability_declaration" }>
): void {
  const payload = operation.payload ?? {};
  const existing = state.capability_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  const merged: CapabilityDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    holder_entity_id:
      (payload.holder_entity_id as string | undefined) ??
      existing?.holder_entity_id ??
      "",
    capability_key:
      (payload.capability_key as string | undefined) ??
      existing?.capability_key ??
      "",
    scope: (payload.scope ?? existing?.scope ?? {
      kind: "UNSCOPED",
    }) as CapabilityScope,
    description:
      payload.description !== undefined
        ? (payload.description as string | null)
        : (existing?.description ?? null),
    valid_from:
      (payload.valid_from as string | undefined) ?? existing?.valid_from ?? "",
    valid_until:
      payload.valid_until !== undefined
        ? (payload.valid_until as string | null)
        : (existing?.valid_until ?? null),
    declared_by: (payload.declared_by ??
      existing?.declared_by ?? {
        kind: "human",
      }) as CapabilityDeclaration["declared_by"],
    recorded_at:
      (payload.recorded_at as string | undefined) ??
      existing?.recorded_at ??
      "",
    created_at: existing?.created_at ?? payload.created_at ?? "",
    updated_at: payload.updated_at ?? existing?.updated_at ?? "",
  };

  assertCapabilityDeclarationShape(state, merged, operation.entity_id);
}

function assertCapabilityDeclarationShape(
  state: ProjectState,
  declaration: CapabilityDeclaration,
  selfId: string
): void {
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  if (!declaration.capability_key.trim()) {
    throw new PatchError(
      `capability_declaration ${declaration.id} capability_key must be non-empty`
    );
  }
  if (!entityIds.has(declaration.holder_entity_id)) {
    throw new PatchError(
      `capability_declaration ${declaration.id} references missing holder RealityEntity ${declaration.holder_entity_id}`
    );
  }
  assertCapabilityScope(
    state,
    declaration.scope,
    `capability_declaration ${declaration.id}`
  );

  if (
    declaration.valid_until !== null &&
    isAdmissionTemporalRelationProven(declaration.valid_until, declaration.valid_from, "<=")
  ) {
    throw new PatchError(
      `capability_declaration ${declaration.id} valid_until must be after valid_from`
    );
  }

  for (const other of state.capability_declarations) {
    if (other.id === selfId) {
      continue;
    }
    if (
      other.holder_entity_id === declaration.holder_entity_id &&
      other.capability_key === declaration.capability_key &&
      capabilityScopesEqual(other.scope, declaration.scope) &&
      governanceDeclarerKey(other.declared_by) ===
        governanceDeclarerKey(declaration.declared_by) &&
      intervalOverlapIsProven(
        other.valid_from,
        other.valid_until,
        declaration.valid_from,
        declaration.valid_until
      )
    ) {
      throw new PatchError(
        `capability_declaration ${declaration.id} duplicates overlapping declaration for holder ${declaration.holder_entity_id}`
      );
    }
  }
}

function assertCapabilityVerificationDeclarationUpsert(
  state: ProjectState,
  operation: Extract<
    PatchOperation,
    { entity: "capability_verification_declaration" }
  >
): void {
  const payload = operation.payload ?? {};
  const existing = state.capability_verification_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  const merged: CapabilityVerificationDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    capability_declaration_id:
      (payload.capability_declaration_id as string | undefined) ??
      existing?.capability_declaration_id ??
      "",
    evidence_ids: (payload.evidence_ids ??
      existing?.evidence_ids ??
      []) as string[],
    verified_by: (payload.verified_by ??
      existing?.verified_by ?? {
        kind: "human",
      }) as CapabilityVerificationDeclaration["verified_by"],
    verified_at:
      (payload.verified_at as string | undefined) ??
      existing?.verified_at ??
      "",
    valid_until:
      payload.valid_until !== undefined
        ? (payload.valid_until as string | null)
        : (existing?.valid_until ?? null),
    note:
      payload.note !== undefined
        ? (payload.note as string | null)
        : (existing?.note ?? null),
    recorded_at:
      (payload.recorded_at as string | undefined) ??
      existing?.recorded_at ??
      "",
    created_at: existing?.created_at ?? payload.created_at ?? "",
    updated_at: payload.updated_at ?? existing?.updated_at ?? "",
  };

  assertCapabilityVerificationDeclarationShape(
    state,
    merged,
    operation.entity_id
  );
}

function assertCapabilityVerificationDeclarationShape(
  state: ProjectState,
  declaration: CapabilityVerificationDeclaration,
  selfId: string
): void {
  const capability = state.capability_declarations.find(
    (entry) =>
      entry.id === declaration.capability_declaration_id &&
      entry.project_id === state.project.id
  );
  if (!capability) {
    throw new PatchError(
      `capability_verification_declaration ${declaration.id} references missing CapabilityDeclaration ${declaration.capability_declaration_id}`
    );
  }

  if (
    !Array.isArray(declaration.evidence_ids) ||
    declaration.evidence_ids.length < 1
  ) {
    throw new PatchError(
      `capability_verification_declaration ${declaration.id} requires non-empty evidence_ids`
    );
  }

  const seenEvidence = new Set<string>();
  const evidenceIds = new Set(state.evidence.map((entry) => entry.id));
  for (const evidenceId of declaration.evidence_ids) {
    if (seenEvidence.has(evidenceId)) {
      throw new PatchError(
        `capability_verification_declaration ${declaration.id} has duplicate evidence_ids`
      );
    }
    seenEvidence.add(evidenceId);
    if (!evidenceIds.has(evidenceId)) {
      throw new PatchError(
        `capability_verification_declaration ${declaration.id} references missing Evidence ${evidenceId}`
      );
    }
  }

  if (
    declaration.valid_until !== null &&
    isAdmissionTemporalRelationProven(declaration.valid_until, declaration.verified_at, "<=")
  ) {
    throw new PatchError(
      `capability_verification_declaration ${declaration.id} valid_until must be after verified_at`
    );
  }

  for (const other of state.capability_verification_declarations) {
    if (other.id === selfId) {
      continue;
    }
    if (
      other.capability_declaration_id ===
        declaration.capability_declaration_id &&
      evidenceIdsKey(other.evidence_ids) ===
        evidenceIdsKey(declaration.evidence_ids) &&
      governanceDeclarerKey(other.verified_by) ===
        governanceDeclarerKey(declaration.verified_by) &&
      intervalOverlapIsProven(
        other.verified_at,
        other.valid_until,
        declaration.verified_at,
        declaration.valid_until
      )
    ) {
      throw new PatchError(
        `capability_verification_declaration ${declaration.id} duplicates overlapping verification`
      );
    }
  }
}

function assertAvailabilityStatus(
  status: unknown
): CapabilityAvailabilityStatus {
  if (status !== "AVAILABLE" && status !== "UNAVAILABLE") {
    throw new PatchError(
      "capability_availability_declaration status must be AVAILABLE or UNAVAILABLE"
    );
  }
  return status;
}

function assertCapabilityAvailabilityDeclarationUpsert(
  state: ProjectState,
  operation: Extract<
    PatchOperation,
    { entity: "capability_availability_declaration" }
  >
): void {
  const payload = operation.payload ?? {};
  const existing = state.capability_availability_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  const merged: CapabilityAvailabilityDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    capability_declaration_id:
      (payload.capability_declaration_id as string | undefined) ??
      existing?.capability_declaration_id ??
      "",
    status: assertAvailabilityStatus(
      payload.status ?? existing?.status ?? ""
    ),
    valid_from:
      (payload.valid_from as string | undefined) ?? existing?.valid_from ?? "",
    valid_until:
      payload.valid_until !== undefined
        ? (payload.valid_until as string | null)
        : (existing?.valid_until ?? null),
    declared_by: (payload.declared_by ??
      existing?.declared_by ?? {
        kind: "human",
      }) as CapabilityAvailabilityDeclaration["declared_by"],
    recorded_at:
      (payload.recorded_at as string | undefined) ??
      existing?.recorded_at ??
      "",
    note:
      payload.note !== undefined
        ? (payload.note as string | null)
        : (existing?.note ?? null),
    created_at: existing?.created_at ?? payload.created_at ?? "",
    updated_at: payload.updated_at ?? existing?.updated_at ?? "",
  };

  assertCapabilityAvailabilityDeclarationShape(
    state,
    merged,
    operation.entity_id
  );
}

function assertCapabilityAvailabilityDeclarationShape(
  state: ProjectState,
  declaration: CapabilityAvailabilityDeclaration,
  selfId: string
): void {
  const capability = state.capability_declarations.find(
    (entry) =>
      entry.id === declaration.capability_declaration_id &&
      entry.project_id === state.project.id
  );
  if (!capability) {
    throw new PatchError(
      `capability_availability_declaration ${declaration.id} references missing CapabilityDeclaration ${declaration.capability_declaration_id}`
    );
  }

  if (
    declaration.valid_until !== null &&
    isAdmissionTemporalRelationProven(declaration.valid_until, declaration.valid_from, "<=")
  ) {
    throw new PatchError(
      `capability_availability_declaration ${declaration.id} valid_until must be after valid_from`
    );
  }

  for (const other of state.capability_availability_declarations) {
    if (other.id === selfId) {
      continue;
    }
    if (
      other.capability_declaration_id ===
        declaration.capability_declaration_id &&
      other.status === declaration.status &&
      governanceDeclarerKey(other.declared_by) ===
        governanceDeclarerKey(declaration.declared_by) &&
      intervalOverlapIsProven(
        other.valid_from,
        other.valid_until,
        declaration.valid_from,
        declaration.valid_until
      )
    ) {
      throw new PatchError(
        `capability_availability_declaration ${declaration.id} duplicates overlapping declaration`
      );
    }
  }
}

function assertCapabilityInvariants(state: ProjectState): void {
  const projectId = state.project.id;
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  assertUniqueIds(state.capability_declarations, "capability_declaration");
  assertUniqueIds(
    state.capability_verification_declarations,
    "capability_verification_declaration"
  );
  assertUniqueIds(
    state.capability_availability_declarations,
    "capability_availability_declaration"
  );

  for (const declaration of state.capability_declarations) {
    if (declaration.project_id !== projectId) {
      throw new PatchError(
        `capability_declaration ${declaration.id} has mismatched project_id`
      );
    }
    assertCapabilityDeclarationShape(state, declaration, declaration.id);
    if (
      declaration.declared_by.entity_id &&
      !entityIds.has(declaration.declared_by.entity_id)
    ) {
      throw new PatchError(
        `capability_declaration ${declaration.id} declared_by.entity_id missing`
      );
    }
  }

  for (const declaration of state.capability_verification_declarations) {
    if (declaration.project_id !== projectId) {
      throw new PatchError(
        `capability_verification_declaration ${declaration.id} has mismatched project_id`
      );
    }
    assertCapabilityVerificationDeclarationShape(
      state,
      declaration,
      declaration.id
    );
    if (
      declaration.verified_by.entity_id &&
      !entityIds.has(declaration.verified_by.entity_id)
    ) {
      throw new PatchError(
        `capability_verification_declaration ${declaration.id} verified_by.entity_id missing`
      );
    }
  }

  for (const declaration of state.capability_availability_declarations) {
    if (declaration.project_id !== projectId) {
      throw new PatchError(
        `capability_availability_declaration ${declaration.id} has mismatched project_id`
      );
    }
    assertCapabilityAvailabilityDeclarationShape(
      state,
      declaration,
      declaration.id
    );
    if (
      declaration.declared_by.entity_id &&
      !entityIds.has(declaration.declared_by.entity_id)
    ) {
      throw new PatchError(
        `capability_availability_declaration ${declaration.id} declared_by.entity_id missing`
      );
    }
  }
}

function assertResourceScope(
  state: ProjectState,
  scope: ResourceScope,
  label: string
): void {
  if (scope.kind === "UNSCOPED") {
    return;
  }
  if (scope.kind === "ENTITY") {
    if (!state.reality_entities.some((entry) => entry.id === scope.entity_id)) {
      throw new PatchError(
        `${label} scope ENTITY references missing RealityEntity ${scope.entity_id}`
      );
    }
    return;
  }
  if (!scope.state_kind.trim()) {
    throw new PatchError(`${label} SUBJECT_STATE state_kind must be non-empty`);
  }
  if (!state.reality_entities.some((entry) => entry.id === scope.subject_id)) {
    throw new PatchError(
      `${label} scope SUBJECT_STATE references missing RealityEntity ${scope.subject_id}`
    );
  }
}

function assertResourceFiniteNonNegative(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new PatchError(
      `resource_capacity_declaration ${label} must be a finite non-negative number`
    );
  }
}

function assertResourceCapacity(capacity: unknown): ResourceCapacity {
  if (!capacity || typeof capacity !== "object") {
    throw new PatchError("resource_capacity_declaration capacity is required");
  }
  const record = capacity as Record<string, unknown>;
  if (record.kind === "POINT") {
    if (typeof record.value !== "number") {
      throw new PatchError(
        "resource_capacity_declaration POINT capacity requires numeric value"
      );
    }
    assertResourceFiniteNonNegative(record.value, "POINT.value");
    return { kind: "POINT", value: record.value };
  }
  if (record.kind === "RANGE") {
    if (typeof record.min !== "number" || typeof record.max !== "number") {
      throw new PatchError(
        "resource_capacity_declaration RANGE capacity requires numeric min and max"
      );
    }
    assertResourceFiniteNonNegative(record.min, "RANGE.min");
    assertResourceFiniteNonNegative(record.max, "RANGE.max");
    if (record.min > record.max) {
      throw new PatchError(
        "resource_capacity_declaration RANGE requires min <= max"
      );
    }
    return { kind: "RANGE", min: record.min, max: record.max };
  }
  throw new PatchError(
    "resource_capacity_declaration capacity.kind must be POINT or RANGE"
  );
}

function assertResourceDeclarationUpsert(
  state: ProjectState,
  operation: Extract<PatchOperation, { entity: "resource_declaration" }>
): void {
  const payload = operation.payload ?? {};
  const existing = state.resource_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  const merged: ResourceDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    holder_entity_id:
      (payload.holder_entity_id as string | undefined) ??
      existing?.holder_entity_id ??
      "",
    resource_key:
      (payload.resource_key as string | undefined) ??
      existing?.resource_key ??
      "",
    unit: (payload.unit as string | undefined) ?? existing?.unit ?? "",
    scope: (payload.scope ?? existing?.scope ?? {
      kind: "UNSCOPED",
    }) as ResourceScope,
    resource_entity_id:
      payload.resource_entity_id !== undefined
        ? (payload.resource_entity_id as string | null)
        : (existing?.resource_entity_id ?? null),
    description:
      payload.description !== undefined
        ? (payload.description as string | null)
        : (existing?.description ?? null),
    valid_from:
      (payload.valid_from as string | undefined) ?? existing?.valid_from ?? "",
    valid_until:
      payload.valid_until !== undefined
        ? (payload.valid_until as string | null)
        : (existing?.valid_until ?? null),
    declared_by: (payload.declared_by ??
      existing?.declared_by ?? {
        kind: "human",
      }) as ResourceDeclaration["declared_by"],
    recorded_at:
      (payload.recorded_at as string | undefined) ??
      existing?.recorded_at ??
      "",
    created_at: existing?.created_at ?? payload.created_at ?? "",
    updated_at: payload.updated_at ?? existing?.updated_at ?? "",
  };

  assertResourceDeclarationShape(state, merged, operation.entity_id);
}

function assertResourceDeclarationShape(
  state: ProjectState,
  declaration: ResourceDeclaration,
  selfId: string
): void {
  if (!declaration.resource_key.trim()) {
    throw new PatchError(
      `resource_declaration ${declaration.id} resource_key must be non-empty`
    );
  }
  if (!declaration.unit.trim()) {
    throw new PatchError(
      `resource_declaration ${declaration.id} unit must be non-empty`
    );
  }
  if (
    !state.reality_entities.some(
      (entry) => entry.id === declaration.holder_entity_id
    )
  ) {
    throw new PatchError(
      `resource_declaration ${declaration.id} references missing holder RealityEntity ${declaration.holder_entity_id}`
    );
  }
  if (
    declaration.resource_entity_id !== null &&
    !state.reality_entities.some(
      (entry) => entry.id === declaration.resource_entity_id
    )
  ) {
    throw new PatchError(
      `resource_declaration ${declaration.id} references missing resource_entity_id RealityEntity ${declaration.resource_entity_id}`
    );
  }
  assertResourceScope(
    state,
    declaration.scope,
    `resource_declaration ${declaration.id}`
  );
  if (
    declaration.valid_until !== null &&
    isAdmissionTemporalRelationProven(declaration.valid_until, declaration.valid_from, "<=")
  ) {
    throw new PatchError(
      `resource_declaration ${declaration.id} valid_until must be after valid_from`
    );
  }

  for (const other of state.resource_declarations) {
    if (other.id === selfId) {
      continue;
    }
    if (
      other.holder_entity_id === declaration.holder_entity_id &&
      other.resource_key === declaration.resource_key &&
      other.unit === declaration.unit &&
      resourceScopesEqual(other.scope, declaration.scope) &&
      other.resource_entity_id === declaration.resource_entity_id &&
      governanceDeclarerKey(other.declared_by) ===
        governanceDeclarerKey(declaration.declared_by) &&
      intervalOverlapIsProven(
        other.valid_from,
        other.valid_until,
        declaration.valid_from,
        declaration.valid_until
      )
    ) {
      throw new PatchError(
        `resource_declaration ${declaration.id} duplicates overlapping declaration for holder ${declaration.holder_entity_id}`
      );
    }
  }
}

function assertResourceCapacityDeclarationUpsert(
  state: ProjectState,
  operation: Extract<
    PatchOperation,
    { entity: "resource_capacity_declaration" }
  >
): void {
  const payload = operation.payload ?? {};
  const existing = state.resource_capacity_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  const merged: ResourceCapacityDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    resource_declaration_id:
      (payload.resource_declaration_id as string | undefined) ??
      existing?.resource_declaration_id ??
      "",
    capacity: assertResourceCapacity(payload.capacity ?? existing?.capacity),
    valid_from:
      (payload.valid_from as string | undefined) ?? existing?.valid_from ?? "",
    valid_until:
      payload.valid_until !== undefined
        ? (payload.valid_until as string | null)
        : (existing?.valid_until ?? null),
    declared_by: (payload.declared_by ??
      existing?.declared_by ?? {
        kind: "human",
      }) as ResourceCapacityDeclaration["declared_by"],
    recorded_at:
      (payload.recorded_at as string | undefined) ??
      existing?.recorded_at ??
      "",
    note:
      payload.note !== undefined
        ? (payload.note as string | null)
        : (existing?.note ?? null),
    created_at: existing?.created_at ?? payload.created_at ?? "",
    updated_at: payload.updated_at ?? existing?.updated_at ?? "",
  };

  assertResourceCapacityDeclarationShape(state, merged, operation.entity_id);
}

function assertResourceCapacityDeclarationShape(
  state: ProjectState,
  declaration: ResourceCapacityDeclaration,
  selfId: string
): void {
  const resource = state.resource_declarations.find(
    (entry) =>
      entry.id === declaration.resource_declaration_id &&
      entry.project_id === state.project.id
  );
  if (!resource) {
    throw new PatchError(
      `resource_capacity_declaration ${declaration.id} references missing ResourceDeclaration ${declaration.resource_declaration_id}`
    );
  }

  if (
    declaration.valid_until !== null &&
    isAdmissionTemporalRelationProven(declaration.valid_until, declaration.valid_from, "<=")
  ) {
    throw new PatchError(
      `resource_capacity_declaration ${declaration.id} valid_until must be after valid_from`
    );
  }

  for (const other of state.resource_capacity_declarations) {
    if (other.id === selfId) {
      continue;
    }
    if (
      other.resource_declaration_id === declaration.resource_declaration_id &&
      resourceCapacityKey(other.capacity) ===
        resourceCapacityKey(declaration.capacity) &&
      governanceDeclarerKey(other.declared_by) ===
        governanceDeclarerKey(declaration.declared_by) &&
      intervalOverlapIsProven(
        other.valid_from,
        other.valid_until,
        declaration.valid_from,
        declaration.valid_until
      )
    ) {
      throw new PatchError(
        `resource_capacity_declaration ${declaration.id} duplicates overlapping capacity`
      );
    }
  }
}

function assertResourceAvailabilityStatus(
  status: unknown
): ResourceAvailabilityStatus {
  if (status === "AVAILABLE" || status === "UNAVAILABLE") {
    return status;
  }
  throw new PatchError(
    "resource_availability_declaration status must be AVAILABLE or UNAVAILABLE"
  );
}

function assertResourceAvailabilityDeclarationUpsert(
  state: ProjectState,
  operation: Extract<
    PatchOperation,
    { entity: "resource_availability_declaration" }
  >
): void {
  const payload = operation.payload ?? {};
  const existing = state.resource_availability_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  const merged: ResourceAvailabilityDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    resource_declaration_id:
      (payload.resource_declaration_id as string | undefined) ??
      existing?.resource_declaration_id ??
      "",
    status: assertResourceAvailabilityStatus(
      payload.status ?? existing?.status ?? ""
    ),
    valid_from:
      (payload.valid_from as string | undefined) ?? existing?.valid_from ?? "",
    valid_until:
      payload.valid_until !== undefined
        ? (payload.valid_until as string | null)
        : (existing?.valid_until ?? null),
    declared_by: (payload.declared_by ??
      existing?.declared_by ?? {
        kind: "human",
      }) as ResourceAvailabilityDeclaration["declared_by"],
    recorded_at:
      (payload.recorded_at as string | undefined) ??
      existing?.recorded_at ??
      "",
    note:
      payload.note !== undefined
        ? (payload.note as string | null)
        : (existing?.note ?? null),
    created_at: existing?.created_at ?? payload.created_at ?? "",
    updated_at: payload.updated_at ?? existing?.updated_at ?? "",
  };

  assertResourceAvailabilityDeclarationShape(
    state,
    merged,
    operation.entity_id
  );
}

function assertResourceAvailabilityDeclarationShape(
  state: ProjectState,
  declaration: ResourceAvailabilityDeclaration,
  selfId: string
): void {
  const resource = state.resource_declarations.find(
    (entry) =>
      entry.id === declaration.resource_declaration_id &&
      entry.project_id === state.project.id
  );
  if (!resource) {
    throw new PatchError(
      `resource_availability_declaration ${declaration.id} references missing ResourceDeclaration ${declaration.resource_declaration_id}`
    );
  }

  if (
    declaration.valid_until !== null &&
    isAdmissionTemporalRelationProven(declaration.valid_until, declaration.valid_from, "<=")
  ) {
    throw new PatchError(
      `resource_availability_declaration ${declaration.id} valid_until must be after valid_from`
    );
  }

  for (const other of state.resource_availability_declarations) {
    if (other.id === selfId) {
      continue;
    }
    if (
      other.resource_declaration_id === declaration.resource_declaration_id &&
      other.status === declaration.status &&
      governanceDeclarerKey(other.declared_by) ===
        governanceDeclarerKey(declaration.declared_by) &&
      intervalOverlapIsProven(
        other.valid_from,
        other.valid_until,
        declaration.valid_from,
        declaration.valid_until
      )
    ) {
      throw new PatchError(
        `resource_availability_declaration ${declaration.id} duplicates overlapping declaration`
      );
    }
  }
}

function assertResourceInvariants(state: ProjectState): void {
  const projectId = state.project.id;
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  assertUniqueIds(state.resource_declarations, "resource_declaration");
  assertUniqueIds(
    state.resource_capacity_declarations,
    "resource_capacity_declaration"
  );
  assertUniqueIds(
    state.resource_availability_declarations,
    "resource_availability_declaration"
  );

  for (const declaration of state.resource_declarations) {
    if (declaration.project_id !== projectId) {
      throw new PatchError(
        `resource_declaration ${declaration.id} has mismatched project_id`
      );
    }
    assertResourceDeclarationShape(state, declaration, declaration.id);
    if (
      declaration.declared_by.entity_id &&
      !entityIds.has(declaration.declared_by.entity_id)
    ) {
      throw new PatchError(
        `resource_declaration ${declaration.id} declared_by.entity_id missing`
      );
    }
  }

  for (const declaration of state.resource_capacity_declarations) {
    if (declaration.project_id !== projectId) {
      throw new PatchError(
        `resource_capacity_declaration ${declaration.id} has mismatched project_id`
      );
    }
    assertResourceCapacityDeclarationShape(state, declaration, declaration.id);
    if (
      declaration.declared_by.entity_id &&
      !entityIds.has(declaration.declared_by.entity_id)
    ) {
      throw new PatchError(
        `resource_capacity_declaration ${declaration.id} declared_by.entity_id missing`
      );
    }
  }

  for (const declaration of state.resource_availability_declarations) {
    if (declaration.project_id !== projectId) {
      throw new PatchError(
        `resource_availability_declaration ${declaration.id} has mismatched project_id`
      );
    }
    assertResourceAvailabilityDeclarationShape(
      state,
      declaration,
      declaration.id
    );
    if (
      declaration.declared_by.entity_id &&
      !entityIds.has(declaration.declared_by.entity_id)
    ) {
      throw new PatchError(
        `resource_availability_declaration ${declaration.id} declared_by.entity_id missing`
      );
    }
  }
}

function assertInterventionScope(
  state: ProjectState,
  scope: InterventionScope,
  label: string
): void {
  if (scope.kind === "UNSCOPED") {
    return;
  }
  if (scope.kind === "ENTITY") {
    if (!state.reality_entities.some((entry) => entry.id === scope.entity_id)) {
      throw new PatchError(
        `${label} ENTITY scope references missing RealityEntity ${scope.entity_id}`
      );
    }
    return;
  }
  if (!scope.state_kind.trim()) {
    throw new PatchError(
      `${label} SUBJECT_STATE scope requires non-empty state_kind`
    );
  }
  if (!state.reality_entities.some((entry) => entry.id === scope.subject_id)) {
    throw new PatchError(
      `${label} SUBJECT_STATE scope references missing RealityEntity ${scope.subject_id}`
    );
  }
}

function assertResourceRequirementAmount(
  amount: unknown,
  label: string
): ResourceRequirementAmount {
  if (!amount || typeof amount !== "object") {
    throw new PatchError(`${label} required_amount is required`);
  }
  const record = amount as Record<string, unknown>;
  if (record.kind === "POINT") {
    if (typeof record.value !== "number") {
      throw new PatchError(`${label} POINT required_amount requires numeric value`);
    }
    if (!Number.isFinite(record.value) || record.value <= 0) {
      throw new PatchError(
        `${label} POINT required_amount must be a finite number greater than 0`
      );
    }
    return { kind: "POINT", value: record.value };
  }
  if (record.kind === "RANGE") {
    if (typeof record.min !== "number" || typeof record.max !== "number") {
      throw new PatchError(
        `${label} RANGE required_amount requires numeric min and max`
      );
    }
    if (
      !Number.isFinite(record.min) ||
      !Number.isFinite(record.max) ||
      record.min < 0 ||
      record.max < 0 ||
      record.min > record.max ||
      record.max <= 0
    ) {
      throw new PatchError(
        `${label} RANGE required_amount must be finite with 0 <= min <= max and max > 0`
      );
    }
    return { kind: "RANGE", min: record.min, max: record.max };
  }
  throw new PatchError(`${label} required_amount.kind must be POINT or RANGE`);
}

function assertInterventionDeclarationUpsert(
  state: ProjectState,
  operation: Extract<PatchOperation, { entity: "intervention_declaration" }>
): void {
  const payload = operation.payload ?? {};
  const existing = state.intervention_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  const merged: InterventionDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    intervention_key:
      (payload.intervention_key as string | undefined) ??
      existing?.intervention_key ??
      "",
    target_scope: (payload.target_scope ?? existing?.target_scope ?? {
      kind: "UNSCOPED",
    }) as InterventionScope,
    description:
      payload.description !== undefined
        ? (payload.description as string | null)
        : (existing?.description ?? null),
    valid_from:
      (payload.valid_from as string | undefined) ?? existing?.valid_from ?? "",
    valid_until:
      payload.valid_until !== undefined
        ? (payload.valid_until as string | null)
        : (existing?.valid_until ?? null),
    declared_by: (payload.declared_by ??
      existing?.declared_by ?? {
        kind: "human",
      }) as InterventionDeclaration["declared_by"],
    recorded_at:
      (payload.recorded_at as string | undefined) ??
      existing?.recorded_at ??
      "",
    created_at: existing?.created_at ?? payload.created_at ?? "",
    updated_at: payload.updated_at ?? existing?.updated_at ?? "",
  };

  assertInterventionDeclarationShape(state, merged, operation.entity_id);
}

function assertInterventionDeclarationShape(
  state: ProjectState,
  declaration: InterventionDeclaration,
  selfId: string
): void {
  if (!declaration.intervention_key.trim()) {
    throw new PatchError(
      `intervention_declaration ${declaration.id} intervention_key must be non-empty`
    );
  }
  assertInterventionScope(
    state,
    declaration.target_scope,
    `intervention_declaration ${declaration.id}`
  );
  if (
    declaration.valid_until !== null &&
    isAdmissionTemporalRelationProven(declaration.valid_until, declaration.valid_from, "<=")
  ) {
    throw new PatchError(
      `intervention_declaration ${declaration.id} valid_until must be after valid_from`
    );
  }

  for (const other of state.intervention_declarations) {
    if (other.id === selfId) {
      continue;
    }
    if (
      other.intervention_key === declaration.intervention_key &&
      interventionScopesEqual(other.target_scope, declaration.target_scope) &&
      governanceDeclarerKey(other.declared_by) ===
        governanceDeclarerKey(declaration.declared_by) &&
      intervalOverlapIsProven(
        other.valid_from,
        other.valid_until,
        declaration.valid_from,
        declaration.valid_until
      )
    ) {
      throw new PatchError(
        `intervention_declaration ${declaration.id} duplicates overlapping declaration for key ${declaration.intervention_key}`
      );
    }
  }
}

function assertInterventionCapabilityRequirementDeclarationUpsert(
  state: ProjectState,
  operation: Extract<
    PatchOperation,
    { entity: "intervention_capability_requirement_declaration" }
  >
): void {
  const payload = operation.payload ?? {};
  const existing = state.intervention_capability_requirement_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  const merged: InterventionCapabilityRequirementDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    intervention_id:
      (payload.intervention_id as string | undefined) ??
      existing?.intervention_id ??
      "",
    capability_key:
      (payload.capability_key as string | undefined) ??
      existing?.capability_key ??
      "",
    capability_scope: (payload.capability_scope ??
      existing?.capability_scope ?? {
        kind: "UNSCOPED",
      }) as CapabilityScope,
    valid_from:
      (payload.valid_from as string | undefined) ?? existing?.valid_from ?? "",
    valid_until:
      payload.valid_until !== undefined
        ? (payload.valid_until as string | null)
        : (existing?.valid_until ?? null),
    declared_by: (payload.declared_by ??
      existing?.declared_by ?? {
        kind: "human",
      }) as InterventionCapabilityRequirementDeclaration["declared_by"],
    recorded_at:
      (payload.recorded_at as string | undefined) ??
      existing?.recorded_at ??
      "",
    note:
      payload.note !== undefined
        ? (payload.note as string | null)
        : (existing?.note ?? null),
    created_at: existing?.created_at ?? payload.created_at ?? "",
    updated_at: payload.updated_at ?? existing?.updated_at ?? "",
  };

  assertInterventionCapabilityRequirementDeclarationShape(
    state,
    merged,
    operation.entity_id
  );
}

function assertInterventionCapabilityRequirementDeclarationShape(
  state: ProjectState,
  declaration: InterventionCapabilityRequirementDeclaration,
  selfId: string
): void {
  const intervention = state.intervention_declarations.find(
    (entry) =>
      entry.id === declaration.intervention_id &&
      entry.project_id === state.project.id
  );
  if (!intervention) {
    throw new PatchError(
      `intervention_capability_requirement_declaration ${declaration.id} references missing InterventionDeclaration ${declaration.intervention_id}`
    );
  }
  if (!declaration.capability_key.trim()) {
    throw new PatchError(
      `intervention_capability_requirement_declaration ${declaration.id} capability_key must be non-empty`
    );
  }
  assertCapabilityScope(
    state,
    declaration.capability_scope,
    `intervention_capability_requirement_declaration ${declaration.id}`
  );
  if (
    declaration.valid_until !== null &&
    isAdmissionTemporalRelationProven(declaration.valid_until, declaration.valid_from, "<=")
  ) {
    throw new PatchError(
      `intervention_capability_requirement_declaration ${declaration.id} valid_until must be after valid_from`
    );
  }

  for (const other of state.intervention_capability_requirement_declarations) {
    if (other.id === selfId) {
      continue;
    }
    if (
      other.intervention_id === declaration.intervention_id &&
      other.capability_key === declaration.capability_key &&
      capabilityScopesEqual(
        other.capability_scope,
        declaration.capability_scope
      ) &&
      governanceDeclarerKey(other.declared_by) ===
        governanceDeclarerKey(declaration.declared_by) &&
      intervalOverlapIsProven(
        other.valid_from,
        other.valid_until,
        declaration.valid_from,
        declaration.valid_until
      )
    ) {
      throw new PatchError(
        `intervention_capability_requirement_declaration ${declaration.id} duplicates overlapping requirement`
      );
    }
  }
}

function assertInterventionResourceRequirementDeclarationUpsert(
  state: ProjectState,
  operation: Extract<
    PatchOperation,
    { entity: "intervention_resource_requirement_declaration" }
  >
): void {
  const payload = operation.payload ?? {};
  const existing = state.intervention_resource_requirement_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  const merged: InterventionResourceRequirementDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    intervention_id:
      (payload.intervention_id as string | undefined) ??
      existing?.intervention_id ??
      "",
    resource_key:
      (payload.resource_key as string | undefined) ??
      existing?.resource_key ??
      "",
    unit: (payload.unit as string | undefined) ?? existing?.unit ?? "",
    resource_scope: (payload.resource_scope ?? existing?.resource_scope ?? {
      kind: "UNSCOPED",
    }) as ResourceScope,
    required_amount: assertResourceRequirementAmount(
      payload.required_amount ?? existing?.required_amount,
      `intervention_resource_requirement_declaration ${operation.entity_id}`
    ),
    valid_from:
      (payload.valid_from as string | undefined) ?? existing?.valid_from ?? "",
    valid_until:
      payload.valid_until !== undefined
        ? (payload.valid_until as string | null)
        : (existing?.valid_until ?? null),
    declared_by: (payload.declared_by ??
      existing?.declared_by ?? {
        kind: "human",
      }) as InterventionResourceRequirementDeclaration["declared_by"],
    recorded_at:
      (payload.recorded_at as string | undefined) ??
      existing?.recorded_at ??
      "",
    note:
      payload.note !== undefined
        ? (payload.note as string | null)
        : (existing?.note ?? null),
    created_at: existing?.created_at ?? payload.created_at ?? "",
    updated_at: payload.updated_at ?? existing?.updated_at ?? "",
  };

  assertInterventionResourceRequirementDeclarationShape(
    state,
    merged,
    operation.entity_id
  );
}

function assertInterventionResourceRequirementDeclarationShape(
  state: ProjectState,
  declaration: InterventionResourceRequirementDeclaration,
  selfId: string
): void {
  const intervention = state.intervention_declarations.find(
    (entry) =>
      entry.id === declaration.intervention_id &&
      entry.project_id === state.project.id
  );
  if (!intervention) {
    throw new PatchError(
      `intervention_resource_requirement_declaration ${declaration.id} references missing InterventionDeclaration ${declaration.intervention_id}`
    );
  }
  if (!declaration.resource_key.trim()) {
    throw new PatchError(
      `intervention_resource_requirement_declaration ${declaration.id} resource_key must be non-empty`
    );
  }
  if (!declaration.unit.trim()) {
    throw new PatchError(
      `intervention_resource_requirement_declaration ${declaration.id} unit must be non-empty`
    );
  }
  assertResourceScope(
    state,
    declaration.resource_scope,
    `intervention_resource_requirement_declaration ${declaration.id}`
  );
  assertResourceRequirementAmount(
    declaration.required_amount,
    `intervention_resource_requirement_declaration ${declaration.id}`
  );
  if (
    declaration.valid_until !== null &&
    isAdmissionTemporalRelationProven(declaration.valid_until, declaration.valid_from, "<=")
  ) {
    throw new PatchError(
      `intervention_resource_requirement_declaration ${declaration.id} valid_until must be after valid_from`
    );
  }

  for (const other of state.intervention_resource_requirement_declarations) {
    if (other.id === selfId) {
      continue;
    }
    if (
      other.intervention_id === declaration.intervention_id &&
      other.resource_key === declaration.resource_key &&
      other.unit === declaration.unit &&
      resourceScopesEqual(other.resource_scope, declaration.resource_scope) &&
      resourceRequirementAmountsEqual(
        other.required_amount,
        declaration.required_amount
      ) &&
      governanceDeclarerKey(other.declared_by) ===
        governanceDeclarerKey(declaration.declared_by) &&
      intervalOverlapIsProven(
        other.valid_from,
        other.valid_until,
        declaration.valid_from,
        declaration.valid_until
      )
    ) {
      throw new PatchError(
        `intervention_resource_requirement_declaration ${declaration.id} duplicates overlapping requirement`
      );
    }
  }
}

function assertInterventionInvariants(state: ProjectState): void {
  const projectId = state.project.id;
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  assertUniqueIds(state.intervention_declarations, "intervention_declaration");
  assertUniqueIds(
    state.intervention_capability_requirement_declarations,
    "intervention_capability_requirement_declaration"
  );
  assertUniqueIds(
    state.intervention_resource_requirement_declarations,
    "intervention_resource_requirement_declaration"
  );

  for (const declaration of state.intervention_declarations) {
    if (declaration.project_id !== projectId) {
      throw new PatchError(
        `intervention_declaration ${declaration.id} has mismatched project_id`
      );
    }
    assertInterventionDeclarationShape(state, declaration, declaration.id);
    if (
      declaration.declared_by.entity_id &&
      !entityIds.has(declaration.declared_by.entity_id)
    ) {
      throw new PatchError(
        `intervention_declaration ${declaration.id} declared_by.entity_id missing`
      );
    }
  }

  for (const declaration of state.intervention_capability_requirement_declarations) {
    if (declaration.project_id !== projectId) {
      throw new PatchError(
        `intervention_capability_requirement_declaration ${declaration.id} has mismatched project_id`
      );
    }
    assertInterventionCapabilityRequirementDeclarationShape(
      state,
      declaration,
      declaration.id
    );
    if (
      declaration.declared_by.entity_id &&
      !entityIds.has(declaration.declared_by.entity_id)
    ) {
      throw new PatchError(
        `intervention_capability_requirement_declaration ${declaration.id} declared_by.entity_id missing`
      );
    }
  }

  for (const declaration of state.intervention_resource_requirement_declarations) {
    if (declaration.project_id !== projectId) {
      throw new PatchError(
        `intervention_resource_requirement_declaration ${declaration.id} has mismatched project_id`
      );
    }
    assertInterventionResourceRequirementDeclarationShape(
      state,
      declaration,
      declaration.id
    );
    if (
      declaration.declared_by.entity_id &&
      !entityIds.has(declaration.declared_by.entity_id)
    ) {
      throw new PatchError(
        `intervention_resource_requirement_declaration ${declaration.id} declared_by.entity_id missing`
      );
    }
  }
}

const VALID_INTERVENTION_PERMISSION_EFFECTS = new Set<InterventionPermissionEffect>([
  "PERMIT",
  "PROHIBIT",
]);

function assertInterventionPermissionDeclarationUpsert(
  state: ProjectState,
  operation: Extract<
    PatchOperation,
    { entity: "intervention_permission_declaration" }
  >
): void {
  const payload = operation.payload ?? {};
  const existing = state.intervention_permission_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  const merged: InterventionPermissionDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    actor_entity_id:
      (payload.actor_entity_id as string | undefined) ??
      existing?.actor_entity_id ??
      "",
    intervention_id:
      (payload.intervention_id as string | undefined) ??
      existing?.intervention_id ??
      "",
    effect: (payload.effect ??
      existing?.effect ??
      "") as InterventionPermissionEffect,
    valid_from:
      (payload.valid_from as string | undefined) ?? existing?.valid_from ?? "",
    valid_until:
      payload.valid_until !== undefined
        ? (payload.valid_until as string | null)
        : (existing?.valid_until ?? null),
    declared_by: (payload.declared_by ??
      existing?.declared_by ?? {
        kind: "human",
      }) as InterventionPermissionDeclaration["declared_by"],
    recorded_at:
      (payload.recorded_at as string | undefined) ??
      existing?.recorded_at ??
      "",
    note:
      payload.note !== undefined
        ? (payload.note as string | null)
        : (existing?.note ?? null),
    created_at: existing?.created_at ?? payload.created_at ?? "",
    updated_at: payload.updated_at ?? existing?.updated_at ?? "",
  };

  assertInterventionPermissionDeclarationShape(
    state,
    merged,
    operation.entity_id
  );
}

function assertInterventionPermissionDeclarationShape(
  state: ProjectState,
  declaration: InterventionPermissionDeclaration,
  selfId: string
): void {
  if (
    !state.reality_entities.some(
      (entry) => entry.id === declaration.actor_entity_id
    )
  ) {
    throw new PatchError(
      `intervention_permission_declaration ${declaration.id} references missing RealityEntity ${declaration.actor_entity_id}`
    );
  }

  const intervention = state.intervention_declarations.find(
    (entry) =>
      entry.id === declaration.intervention_id &&
      entry.project_id === state.project.id
  );
  if (!intervention) {
    throw new PatchError(
      `intervention_permission_declaration ${declaration.id} references missing InterventionDeclaration ${declaration.intervention_id}`
    );
  }

  if (!VALID_INTERVENTION_PERMISSION_EFFECTS.has(declaration.effect)) {
    throw new PatchError(
      `intervention_permission_declaration ${declaration.id} effect must be PERMIT or PROHIBIT`
    );
  }

  if (
    declaration.valid_until !== null &&
    isAdmissionTemporalRelationProven(declaration.valid_until, declaration.valid_from, "<=")
  ) {
    throw new PatchError(
      `intervention_permission_declaration ${declaration.id} valid_until must be after valid_from`
    );
  }

  for (const other of state.intervention_permission_declarations) {
    if (other.id === selfId) {
      continue;
    }
    if (
      other.actor_entity_id === declaration.actor_entity_id &&
      other.intervention_id === declaration.intervention_id &&
      other.effect === declaration.effect &&
      governanceDeclarerKey(other.declared_by) ===
        governanceDeclarerKey(declaration.declared_by) &&
      intervalOverlapIsProven(
        other.valid_from,
        other.valid_until,
        declaration.valid_from,
        declaration.valid_until
      )
    ) {
      throw new PatchError(
        `intervention_permission_declaration ${declaration.id} duplicates overlapping declaration`
      );
    }
  }
}

function assertInterventionPermissionInvariants(state: ProjectState): void {
  const projectId = state.project.id;
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  assertUniqueIds(
    state.intervention_permission_declarations,
    "intervention_permission_declaration"
  );

  for (const declaration of state.intervention_permission_declarations) {
    if (declaration.project_id !== projectId) {
      throw new PatchError(
        `intervention_permission_declaration ${declaration.id} has mismatched project_id`
      );
    }
    assertInterventionPermissionDeclarationShape(
      state,
      declaration,
      declaration.id
    );
    if (
      declaration.declared_by.entity_id &&
      !entityIds.has(declaration.declared_by.entity_id)
    ) {
      throw new PatchError(
        `intervention_permission_declaration ${declaration.id} declared_by.entity_id missing`
      );
    }
  }
}

function assertDecisionSpaceInvariants(state: ProjectState): void {
  const projectId = state.project.id;
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  assertUniqueIds(state.decision_space_declarations, "decision_space_declaration");

  for (const declaration of state.decision_space_declarations) {
    if (declaration.project_id !== projectId) {
      throw new PatchError(
        `decision_space_declaration ${declaration.id} has mismatched project_id`
      );
    }
    assertDecisionSpaceDeclarationShape(state, declaration, declaration.id);
    if (
      declaration.declared_by.entity_id &&
      !entityIds.has(declaration.declared_by.entity_id)
    ) {
      throw new PatchError(
        `decision_space_declaration ${declaration.id} declared_by.entity_id missing`
      );
    }
  }
}

function assertDecisionOptionInvariants(state: ProjectState): void {
  const projectId = state.project.id;
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  assertUniqueIds(state.decision_option_declarations, "decision_option_declaration");

  for (const declaration of state.decision_option_declarations) {
    if (declaration.project_id !== projectId) {
      throw new PatchError(
        `decision_option_declaration ${declaration.id} has mismatched project_id`
      );
    }
    assertDecisionOptionDeclarationShape(state, declaration, declaration.id);
    if (
      declaration.declared_by.entity_id &&
      !entityIds.has(declaration.declared_by.entity_id)
    ) {
      throw new PatchError(
        `decision_option_declaration ${declaration.id} declared_by.entity_id missing`
      );
    }
  }
}

function assertDecisionBasisReferenceShape(
  state: ProjectState,
  basis: DecisionBasisReference,
  declarationId: string
): void {
  switch (basis.kind) {
    case "REALITY_OBJECTIVE": {
      const objective = state.reality_objectives.find(
        (entry) =>
          entry.id === basis.objective_id && entry.project_id === state.project.id
      );
      if (!objective) {
        throw new PatchError(
          `decision_space_declaration ${declarationId} references missing RealityObjective ${basis.objective_id}`
        );
      }
      break;
    }
    case "REFERENCE_CONDITION": {
      const reference = state.reference_conditions.find(
        (entry) =>
          entry.id === basis.reference_condition_id &&
          entry.project_id === state.project.id
      );
      if (!reference) {
        throw new PatchError(
          `decision_space_declaration ${declarationId} references missing ReferenceCondition ${basis.reference_condition_id}`
        );
      }
      break;
    }
    case "FUTURE_SCENARIO": {
      const scenario = state.future_scenarios.find(
        (entry) =>
          entry.id === basis.scenario_id && entry.project_id === state.project.id
      );
      if (!scenario) {
        throw new PatchError(
          `decision_space_declaration ${declarationId} references missing FutureScenario ${basis.scenario_id}`
        );
      }
      break;
    }
  }
}

function assertDecisionSpaceBasisUnique(
  basis: DecisionBasisReference[],
  declarationId: string
): void {
  const seen = new Set<string>();
  for (const entry of basis) {
    const key = decisionBasisKey(entry);
    if (seen.has(key)) {
      throw new PatchError(
        `decision_space_declaration ${declarationId} has duplicate basis reference ${key}`
      );
    }
    seen.add(key);
  }
}

function assertDecisionSpaceDeclarationShape(
  state: ProjectState,
  declaration: DecisionSpaceDeclaration,
  selfId: string
): void {
  if (!declaration.label.trim()) {
    throw new PatchError(
      `decision_space_declaration ${declaration.id} label must be non-empty`
    );
  }

  if (
    declaration.valid_until !== null &&
    isAdmissionTemporalRelationProven(declaration.valid_until, declaration.valid_from, "<=")
  ) {
    throw new PatchError(
      `decision_space_declaration ${declaration.id} valid_until must be after valid_from`
    );
  }

  assertDecisionSpaceBasisUnique(declaration.basis, declaration.id);
  for (const basis of declaration.basis) {
    assertDecisionBasisReferenceShape(state, basis, declaration.id);
  }
}

function assertDecisionSpaceDeclarationUpsert(
  state: ProjectState,
  operation: Extract<PatchOperation, { entity: "decision_space_declaration" }>
): void {
  const payload = operation.payload ?? {};
  const existing = state.decision_space_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  const merged: DecisionSpaceDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    label:
      (payload.label as string | undefined) ?? existing?.label ?? "",
    description:
      payload.description !== undefined
        ? (payload.description as string | null)
        : (existing?.description ?? null),
    basis: (payload.basis ??
      existing?.basis ??
      []) as DecisionSpaceDeclaration["basis"],
    valid_from:
      (payload.valid_from as string | undefined) ?? existing?.valid_from ?? "",
    valid_until:
      payload.valid_until !== undefined
        ? (payload.valid_until as string | null)
        : (existing?.valid_until ?? null),
    declared_by: (payload.declared_by ??
      existing?.declared_by ?? {
        kind: "human",
      }) as DecisionSpaceDeclaration["declared_by"],
    recorded_at:
      (payload.recorded_at as string | undefined) ??
      existing?.recorded_at ??
      "",
    created_at: existing?.created_at ?? payload.created_at ?? "",
    updated_at: payload.updated_at ?? existing?.updated_at ?? "",
  };

  assertDecisionSpaceDeclarationShape(state, merged, operation.entity_id);
}

function assertDecisionOptionDeclarationShape(
  state: ProjectState,
  declaration: DecisionOptionDeclaration,
  selfId: string
): void {
  const decisionSpace = state.decision_space_declarations.find(
    (entry) =>
      entry.id === declaration.decision_space_id &&
      entry.project_id === state.project.id
  );
  if (!decisionSpace) {
    throw new PatchError(
      `decision_option_declaration ${declaration.id} references missing DecisionSpaceDeclaration ${declaration.decision_space_id}`
    );
  }

  if (
    declaration.valid_until !== null &&
    isAdmissionTemporalRelationProven(declaration.valid_until, declaration.valid_from, "<=")
  ) {
    throw new PatchError(
      `decision_option_declaration ${declaration.id} valid_until must be after valid_from`
    );
  }

  if (declaration.option.kind === "INTERVENTION") {
    const interventionId = declaration.option.intervention_id;
    const intervention = state.intervention_declarations.find(
      (entry) =>
        entry.id === interventionId && entry.project_id === state.project.id
    );
    if (!intervention) {
      throw new PatchError(
        `decision_option_declaration ${declaration.id} references missing InterventionDeclaration ${interventionId}`
      );
    }
  }

  for (const other of state.decision_option_declarations) {
    if (other.id === selfId) {
      continue;
    }
    if (
      other.decision_space_id === declaration.decision_space_id &&
      decisionOptionSemanticKey(other.option) ===
        decisionOptionSemanticKey(declaration.option) &&
      governanceDeclarerKey(other.declared_by) ===
        governanceDeclarerKey(declaration.declared_by) &&
      intervalOverlapIsProven(
        other.valid_from,
        other.valid_until,
        declaration.valid_from,
        declaration.valid_until
      )
    ) {
      throw new PatchError(
        `decision_option_declaration ${declaration.id} duplicates overlapping declaration`
      );
    }
  }
}

function assertDecisionOptionDeclarationUpsert(
  state: ProjectState,
  operation: Extract<PatchOperation, { entity: "decision_option_declaration" }>
): void {
  const payload = operation.payload ?? {};
  const existing = state.decision_option_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  const merged: DecisionOptionDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    decision_space_id:
      (payload.decision_space_id as string | undefined) ??
      existing?.decision_space_id ??
      "",
    option: (payload.option ??
      existing?.option ?? {
        kind: "DO_NOTHING",
      }) as DecisionOptionTarget,
    label:
      payload.label !== undefined
        ? (payload.label as string | null)
        : (existing?.label ?? null),
    description:
      payload.description !== undefined
        ? (payload.description as string | null)
        : (existing?.description ?? null),
    valid_from:
      (payload.valid_from as string | undefined) ?? existing?.valid_from ?? "",
    valid_until:
      payload.valid_until !== undefined
        ? (payload.valid_until as string | null)
        : (existing?.valid_until ?? null),
    declared_by: (payload.declared_by ??
      existing?.declared_by ?? {
        kind: "human",
      }) as DecisionOptionDeclaration["declared_by"],
    recorded_at:
      (payload.recorded_at as string | undefined) ??
      existing?.recorded_at ??
      "",
    created_at: existing?.created_at ?? payload.created_at ?? "",
    updated_at: payload.updated_at ?? existing?.updated_at ?? "",
  };

  assertDecisionOptionDeclarationShape(state, merged, operation.entity_id);
}

function resolveActorCandidateSemanticTarget(
  state: ProjectState,
  optionId: string
): {
  decision_space_id: string;
  intervention_id: string;
} {
  const option = state.decision_option_declarations.find(
    (entry) => entry.id === optionId && entry.project_id === state.project.id
  );
  if (!option) {
    throw new PatchError(
      `decision_option_actor_candidate_declaration references missing DecisionOptionDeclaration ${optionId}`
    );
  }
  if (option.option.kind !== "INTERVENTION") {
    throw new PatchError(
      `decision_option_actor_candidate_declaration cannot target DO_NOTHING option ${optionId}`
    );
  }
  return {
    decision_space_id: option.decision_space_id,
    intervention_id: option.option.intervention_id,
  };
}

function assertDecisionOptionActorCandidateDeclarationShape(
  state: ProjectState,
  declaration: DecisionOptionActorCandidateDeclaration,
  selfId: string
): void {
  if (
    !state.reality_entities.some(
      (entry) => entry.id === declaration.actor_entity_id
    )
  ) {
    throw new PatchError(
      `decision_option_actor_candidate_declaration ${declaration.id} references missing RealityEntity ${declaration.actor_entity_id}`
    );
  }

  const target = resolveActorCandidateSemanticTarget(
    state,
    declaration.decision_option_declaration_id
  );

  if (
    declaration.valid_until !== null &&
    isAdmissionTemporalRelationProven(declaration.valid_until, declaration.valid_from, "<=")
  ) {
    throw new PatchError(
      `decision_option_actor_candidate_declaration ${declaration.id} valid_until must be after valid_from`
    );
  }

  const semanticKey = decisionOptionActorCandidateSemanticKey({
    decision_space_id: target.decision_space_id,
    intervention_id: target.intervention_id,
    actor_entity_id: declaration.actor_entity_id,
  });

  for (const other of state.decision_option_actor_candidate_declarations) {
    if (other.id === selfId) {
      continue;
    }
    let otherTarget: { decision_space_id: string; intervention_id: string };
    try {
      otherTarget = resolveActorCandidateSemanticTarget(
        state,
        other.decision_option_declaration_id
      );
    } catch {
      continue;
    }
    const otherKey = decisionOptionActorCandidateSemanticKey({
      decision_space_id: otherTarget.decision_space_id,
      intervention_id: otherTarget.intervention_id,
      actor_entity_id: other.actor_entity_id,
    });
    if (
      otherKey === semanticKey &&
      governanceDeclarerKey(other.declared_by) ===
        governanceDeclarerKey(declaration.declared_by) &&
      intervalOverlapIsProven(
        other.valid_from,
        other.valid_until,
        declaration.valid_from,
        declaration.valid_until
      )
    ) {
      throw new PatchError(
        `decision_option_actor_candidate_declaration ${declaration.id} duplicates overlapping declaration`
      );
    }
  }
}

function assertDecisionOptionActorCandidateDeclarationUpsert(
  state: ProjectState,
  operation: Extract<
    PatchOperation,
    { entity: "decision_option_actor_candidate_declaration" }
  >
): void {
  const payload = operation.payload ?? {};
  const existing = state.decision_option_actor_candidate_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  const merged: DecisionOptionActorCandidateDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    decision_option_declaration_id:
      (payload.decision_option_declaration_id as string | undefined) ??
      existing?.decision_option_declaration_id ??
      "",
    actor_entity_id:
      (payload.actor_entity_id as string | undefined) ??
      existing?.actor_entity_id ??
      "",
    note:
      payload.note !== undefined
        ? (payload.note as string | null)
        : (existing?.note ?? null),
    valid_from:
      (payload.valid_from as string | undefined) ?? existing?.valid_from ?? "",
    valid_until:
      payload.valid_until !== undefined
        ? (payload.valid_until as string | null)
        : (existing?.valid_until ?? null),
    declared_by: (payload.declared_by ??
      existing?.declared_by ?? {
        kind: "human",
      }) as DecisionOptionActorCandidateDeclaration["declared_by"],
    recorded_at:
      (payload.recorded_at as string | undefined) ??
      existing?.recorded_at ??
      "",
    created_at: existing?.created_at ?? payload.created_at ?? "",
    updated_at: payload.updated_at ?? existing?.updated_at ?? "",
  };

  assertDecisionOptionActorCandidateDeclarationShape(
    state,
    merged,
    operation.entity_id
  );
}

function assertDecisionOptionActorCandidateInvariants(state: ProjectState): void {
  const projectId = state.project.id;
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  assertUniqueIds(
    state.decision_option_actor_candidate_declarations,
    "decision_option_actor_candidate_declaration"
  );

  for (const declaration of state.decision_option_actor_candidate_declarations) {
    if (declaration.project_id !== projectId) {
      throw new PatchError(
        `decision_option_actor_candidate_declaration ${declaration.id} has mismatched project_id`
      );
    }
    assertDecisionOptionActorCandidateDeclarationShape(
      state,
      declaration,
      declaration.id
    );
    if (
      declaration.declared_by.entity_id &&
      !entityIds.has(declaration.declared_by.entity_id)
    ) {
      throw new PatchError(
        `decision_option_actor_candidate_declaration ${declaration.id} declared_by.entity_id missing`
      );
    }
  }
}

function assertReferencedEntities(
  entities: Array<Blocker | Decision | Hypothesis | Observation>,
  projectId: string,
  goalIds: Set<string>,
  label: string
): void {
  for (const entity of entities) {
    if (entity.project_id !== projectId) {
      throw new PatchError(`${label} ${entity.id} has mismatched project_id`);
    }
    if (entity.goal_id && !goalIds.has(entity.goal_id)) {
      throw new PatchError(
        `${label} ${entity.id} references missing goal_id ${entity.goal_id}`
      );
    }
  }
}

// ─── GROUND-028: RealityDecisionDeclaration ───────────────────────────────────

function assertRealityDecisionDeclarationShape(
  state: ProjectState,
  decl: RealityDecisionDeclaration,
  selfId: string
): void {
  const entityIds = new Set(state.reality_entities.map((e) => e.id));

  // decision_space_id must reference existing DecisionSpaceDeclaration
  if (!state.decision_space_declarations.some((d) => d.id === decl.decision_space_id)) {
    throw new PatchError(
      `reality_decision_declaration ${selfId}: unknown decision_space_id ${decl.decision_space_id}`
    );
  }

  // decision_maker_entity_id must reference RealityEntity
  if (!entityIds.has(decl.decision_maker_entity_id)) {
    throw new PatchError(
      `reality_decision_declaration ${selfId}: unknown decision_maker_entity_id ${decl.decision_maker_entity_id}`
    );
  }

  // declared_by.entity_id must reference RealityEntity when present
  if (decl.declared_by.entity_id && !entityIds.has(decl.declared_by.entity_id)) {
    throw new PatchError(
      `reality_decision_declaration ${selfId}: declared_by.entity_id not found`
    );
  }

  // INTERVENTION selection: intervention_id must reference InterventionDeclaration
  if (decl.selected_option.kind === "INTERVENTION") {
    const sel = decl.selected_option;
    if (
      !state.intervention_declarations.some(
        (d) => d.id === sel.intervention_id
      )
    ) {
      throw new PatchError(
        `reality_decision_declaration ${selfId}: unknown intervention_id ${sel.intervention_id}`
      );
    }
    // selected_actor_entity_id must reference RealityEntity when present
    if (
      decl.selected_actor_entity_id != null &&
      !entityIds.has(decl.selected_actor_entity_id)
    ) {
      throw new PatchError(
        `reality_decision_declaration ${selfId}: unknown selected_actor_entity_id ${decl.selected_actor_entity_id}`
      );
    }
  }

  // DO_NOTHING: selected_actor_entity_id must be absent/null
  if (decl.selected_option.kind === "DO_NOTHING") {
    if (decl.selected_actor_entity_id != null) {
      throw new PatchError(
        `reality_decision_declaration ${selfId}: selected_actor_entity_id must be null for DO_NOTHING selection`
      );
    }
  }

  // decided_at <= recorded_at
  if (isAdmissionTemporalRelationProven(decl.decided_at, decl.recorded_at, ">")) {
    throw new PatchError(
      `reality_decision_declaration ${selfId}: decided_at must not be after recorded_at`
    );
  }

  // context_snapshot.assessed_at must equal decided_at
  if (isAdmissionTemporalRelationProven(decl.context_snapshot.assessed_at, decl.decided_at, "!==")) {
    throw new PatchError(
      `reality_decision_declaration ${selfId}: context_snapshot.assessed_at must equal decided_at`
    );
  }

  // context_snapshot.captured_at must equal recorded_at
  if (isAdmissionTemporalRelationProven(decl.context_snapshot.captured_at, decl.recorded_at, "!==")) {
    throw new PatchError(
      `reality_decision_declaration ${selfId}: context_snapshot.captured_at must equal recorded_at`
    );
  }

  // context_snapshot.decision_space_id must match
  if (decl.context_snapshot.decision_space_id !== decl.decision_space_id) {
    throw new PatchError(
      `reality_decision_declaration ${selfId}: context_snapshot.decision_space_id must match decision_space_id`
    );
  }

  // Selected Option must appear in the context snapshot
  const selectedOptionKey = decl.selected_option.kind === "INTERVENTION"
    ? `INTERVENTION|${(decl.selected_option as { kind: "INTERVENTION"; intervention_id: string }).intervention_id}`
    : "DO_NOTHING";
  const optionRepresented = decl.context_snapshot.option_positions.some(
    (p) => p.option_key === selectedOptionKey
  );
  if (!optionRepresented) {
    throw new PatchError(
      `reality_decision_declaration ${selfId}: selected option "${selectedOptionKey}" not represented in context snapshot`
    );
  }

  // Selected Actor must appear as a candidate in the context snapshot
  if (
    decl.selected_option.kind === "INTERVENTION" &&
    decl.selected_actor_entity_id != null
  ) {
    const interventionId = (decl.selected_option as { kind: "INTERVENTION"; intervention_id: string }).intervention_id;
    const actorId = decl.selected_actor_entity_id;
    const candidateRepresented = decl.context_snapshot.actor_candidates.some(
      (c) => c.intervention_id === interventionId && c.actor_entity_id === actorId
    );
    if (!candidateRepresented) {
      throw new PatchError(
        `reality_decision_declaration ${selfId}: selected actor ${actorId} is not a represented candidate for intervention ${interventionId}`
      );
    }
  }
}

function assertRealityDecisionDeclarationInvariants(
  state: ProjectState,
  _preMutationState: ProjectState
): void {
  const projectId = state.project.id;

  assertUniqueIds(state.reality_decision_declarations, "reality_decision_declaration");

  for (const decl of state.reality_decision_declarations) {
    if (decl.project_id !== projectId) {
      throw new PatchError(
        `reality_decision_declaration ${decl.id} has mismatched project_id`
      );
    }
    // Shape validation (referential integrity, temporal, snapshot field checks)
    assertRealityDecisionDeclarationShape(state, decl, decl.id);
  }
}

function assertRealityDecisionDeclarationUpsert(
  state: ProjectState,
  operation: Extract<PatchOperation, { entity: "reality_decision_declaration" }>,
  now: string
): void {
  const payload = operation.payload ?? {};
  const existing = state.reality_decision_declarations.find(
    (d) => d.id === operation.entity_id
  );

  if (existing) {
    // Append-only guard: reject semantic mutations of existing declarations
    throw new PatchError(
      `Cannot update reality_decision_declaration ${operation.entity_id}: Decision Memory is append-only`
    );
  }

  // Build merged record from payload for creation-only validation
  const decl: RealityDecisionDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    decision_space_id: (payload.decision_space_id as string | undefined) ?? "",
    decision_maker_entity_id:
      (payload.decision_maker_entity_id as string | undefined) ?? "",
    selected_option: (payload.selected_option ??
      { kind: "DO_NOTHING" }) as RealityDecisionSelection,
    selected_actor_entity_id:
      payload.selected_actor_entity_id !== undefined
        ? (payload.selected_actor_entity_id as string | null)
        : null,
    decided_at: (payload.decided_at as string | undefined) ?? "",
    rationale:
      payload.rationale !== undefined
        ? (payload.rationale as string | null)
        : null,
    context_snapshot: (payload.context_snapshot ??
      {}) as DecisionContextSnapshotV1,
    declared_by: (payload.declared_by ?? { kind: "human" }) as RealityDecisionDeclaration["declared_by"],
    recorded_at: (payload.recorded_at as string | undefined) ?? now,
    created_at: (payload.created_at as string | undefined) ?? now,
    updated_at: (payload.updated_at as string | undefined) ?? now,
  };

  // Validate shape first (referential integrity, temporal constraints, etc.)
  assertRealityDecisionDeclarationShape(state, decl, operation.entity_id);

  // Snapshot integrity: recompute expected snapshot and deepEqual compare
  const expectedSnapshot = assessTemporalPrerequisite(() => buildDecisionContextSnapshot(
    state,
    decl.decision_space_id,
    decl.decided_at,
    decl.recorded_at
  ));

  const snapshotMatch = assessTemporalPrerequisite(() => {
    if (expectedSnapshot.status === "UNRESOLVED") throw expectedSnapshot.error;
    const semanticSnapshot = (snapshot: DecisionContextSnapshotV1) => ({
      ...snapshot, assessed_at: temporalInstantKey(snapshot.assessed_at),
      captured_at: temporalInstantKey(snapshot.captured_at),
    });
    return JSON.stringify(semanticSnapshot(decl.context_snapshot)) ===
      JSON.stringify(semanticSnapshot(expectedSnapshot.value));
  });
  if (snapshotMatch.status === "VERIFIED" && !snapshotMatch.value) {
    throw new PatchError(
      `reality_decision_declaration ${operation.entity_id}: context_snapshot does not match deterministic expected snapshot. ` +
      `Use buildDecisionContextSnapshot(state, decisionSpaceId, decidedAt, recordedAt) to obtain the correct snapshot.`
    );
  }

  // Semantic duplicate check: same declarer + semantic key = reject
  const semanticKey = assessTemporalPrerequisite(() => realityDecisionSemanticKey(
    decl.decision_space_id,
    decl.decision_maker_entity_id,
    decl.decided_at,
    decl.selected_option,
    decl.selected_actor_entity_id
  ));

  const declarerK = [
    decl.declared_by.kind,
    decl.declared_by.entity_id ?? "",
    decl.declared_by.external_id ?? "",
    decl.declared_by.label ?? "",
  ].join("|");

  const duplicate = state.reality_decision_declarations.some((d) => {
    const existingKey = assessTemporalPrerequisite(() => realityDecisionSemanticKey(
      d.decision_space_id,
      d.decision_maker_entity_id,
      d.decided_at,
      d.selected_option,
      d.selected_actor_entity_id
    ));
    if (!haveVerifiedEqualValues(existingKey, semanticKey)) {
      return false;
    }
    const dDeclarerK = [
      d.declared_by.kind,
      d.declared_by.entity_id ?? "",
      d.declared_by.external_id ?? "",
      d.declared_by.label ?? "",
    ].join("|");
    return dDeclarerK === declarerK;
  });

  if (duplicate) {
    throw new PatchError(
      `reality_decision_declaration ${operation.entity_id}: semantic duplicate from same declarer already exists`
    );
  }
}

const VALID_INTERVENTION_INTENT_DISPOSITIONS = new Set<InterventionIntentDisposition>([
  "PURSUE",
  "REFRAIN",
]);

function decisionBasisIdKey(
  id: string | null | undefined
): string {
  return id ?? "";
}

function assertInterventionIntentDeclarationShape(
  state: ProjectState,
  decl: InterventionIntentDeclaration,
  selfId: string
): void {
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  if (!entityIds.has(decl.intent_holder_entity_id)) {
    throw new PatchError(
      `intervention_intent_declaration ${selfId}: unknown intent_holder_entity_id ${decl.intent_holder_entity_id}`
    );
  }

  if (
    decl.declared_by.entity_id != null &&
    decl.declared_by.entity_id !== "" &&
    !entityIds.has(decl.declared_by.entity_id)
  ) {
    throw new PatchError(
      `intervention_intent_declaration ${selfId}: declared_by.entity_id not found`
    );
  }

  const intervention = state.intervention_declarations.find(
    (entry) =>
      entry.id === decl.intervention_id && entry.project_id === state.project.id
  );
  if (!intervention) {
    throw new PatchError(
      `intervention_intent_declaration ${selfId}: unknown intervention_id ${decl.intervention_id}`
    );
  }

  if (!VALID_INTERVENTION_INTENT_DISPOSITIONS.has(decl.disposition)) {
    throw new PatchError(
      `intervention_intent_declaration ${selfId}: disposition must be PURSUE or REFRAIN`
    );
  }

  if (isAdmissionTemporalRelationProven(decl.intent_formed_at, decl.recorded_at, ">")) {
    throw new PatchError(
      `intervention_intent_declaration ${selfId}: intent_formed_at must not be after recorded_at`
    );
  }

  if (decl.valid_until !== null && isAdmissionTemporalRelationProven(decl.intent_formed_at, decl.valid_until, ">=")) {
    throw new PatchError(
      `intervention_intent_declaration ${selfId}: valid_until must be after intent_formed_at`
    );
  }

  const basisId = decl.decision_basis_declaration_id ?? null;
  if (basisId !== null) {
    const decision = state.reality_decision_declarations.find(
      (entry) => entry.id === basisId && entry.project_id === state.project.id
    );
    if (!decision) {
      throw new PatchError(
        `intervention_intent_declaration ${selfId}: unknown decision_basis_declaration_id ${basisId}`
      );
    }

    if (decision.selected_option.kind === "DO_NOTHING") {
      throw new PatchError(
        `intervention_intent_declaration ${selfId}: DO_NOTHING Decision cannot be Intervention Intent basis`
      );
    }

    if (
      decision.selected_option.kind !== "INTERVENTION" ||
      decision.selected_option.intervention_id !== decl.intervention_id
    ) {
      throw new PatchError(
        `intervention_intent_declaration ${selfId}: decision basis must select the same Intervention`
      );
    }

    if (isAdmissionTemporalRelationProven(decl.intent_formed_at, decision.decided_at, "<")) {
      throw new PatchError(
        `intervention_intent_declaration ${selfId}: intent_formed_at must not predate linked Decision decided_at`
      );
    }
  }

  for (const other of state.intervention_intent_declarations) {
    if (other.id === selfId) {
      continue;
    }
    if (
      other.intent_holder_entity_id === decl.intent_holder_entity_id &&
      other.intervention_id === decl.intervention_id &&
      other.disposition === decl.disposition &&
      decisionBasisIdKey(other.decision_basis_declaration_id) ===
        decisionBasisIdKey(decl.decision_basis_declaration_id) &&
      governanceDeclarerKey(other.declared_by) ===
        governanceDeclarerKey(decl.declared_by) &&
      intervalOverlapIsProven(
        other.intent_formed_at,
        other.valid_until,
        decl.intent_formed_at,
        decl.valid_until
      )
    ) {
      throw new PatchError(
        `intervention_intent_declaration ${selfId}: semantic duplicate from same declarer already exists`
      );
    }
  }
}

function assertInterventionIntentDeclarationInvariants(
  state: ProjectState
): void {
  assertUniqueIds(
    state.intervention_intent_declarations,
    "intervention_intent_declaration"
  );

  for (const decl of state.intervention_intent_declarations) {
    if (decl.project_id !== state.project.id) {
      throw new PatchError(
        `intervention_intent_declaration ${decl.id} has mismatched project_id`
      );
    }
    assertInterventionIntentDeclarationShape(state, decl, decl.id);
  }
}

function assertInterventionIntentDeclarationUpsert(
  state: ProjectState,
  operation: Extract<
    PatchOperation,
    { entity: "intervention_intent_declaration" }
  >
): void {
  const payload = operation.payload ?? {};
  const existing = state.intervention_intent_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  if (existing) {
    throw new PatchError(
      `Cannot update intervention_intent_declaration ${operation.entity_id}: Intent history is append-only`
    );
  }

  const decl: InterventionIntentDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    intent_holder_entity_id:
      (payload.intent_holder_entity_id as string | undefined) ?? "",
    intervention_id: (payload.intervention_id as string | undefined) ?? "",
    disposition: (payload.disposition ??
      "") as InterventionIntentDisposition,
    decision_basis_declaration_id:
      payload.decision_basis_declaration_id !== undefined
        ? (payload.decision_basis_declaration_id as string | null)
        : null,
    intent_formed_at:
      (payload.intent_formed_at as string | undefined) ?? "",
    valid_until:
      payload.valid_until !== undefined
        ? (payload.valid_until as string | null)
        : null,
    note:
      payload.note !== undefined ? (payload.note as string | null) : null,
    declared_by: (payload.declared_by ?? {
      kind: "human",
    }) as InterventionIntentDeclaration["declared_by"],
    recorded_at: (payload.recorded_at as string | undefined) ?? "",
    created_at: (payload.created_at as string | undefined) ?? "",
    updated_at: (payload.updated_at as string | undefined) ?? "",
  };

  assertInterventionIntentDeclarationShape(state, decl, operation.entity_id);
}

function commitmentBasisRefKey(ref: CommitmentBasisReference): string {
  if (ref.kind === "REALITY_DECISION") {
    return `REALITY_DECISION|${ref.decision_declaration_id}`;
  }
  return `INTERVENTION_INTENT|${ref.intent_declaration_id}`;
}

function assertInterventionCommitmentDeclarationShape(
  state: ProjectState,
  decl: InterventionCommitmentDeclaration,
  selfId: string
): void {
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  if (!entityIds.has(decl.commitment_holder_entity_id)) {
    throw new PatchError(
      `intervention_commitment_declaration ${selfId}: unknown commitment_holder_entity_id ${decl.commitment_holder_entity_id}`
    );
  }

  if (
    decl.declared_by.entity_id != null &&
    decl.declared_by.entity_id !== "" &&
    !entityIds.has(decl.declared_by.entity_id)
  ) {
    throw new PatchError(
      `intervention_commitment_declaration ${selfId}: declared_by.entity_id not found`
    );
  }

  const intervention = state.intervention_declarations.find(
    (entry) =>
      entry.id === decl.intervention_id && entry.project_id === state.project.id
  );
  if (!intervention) {
    throw new PatchError(
      `intervention_commitment_declaration ${selfId}: unknown intervention_id ${decl.intervention_id}`
    );
  }

  if (isAdmissionTemporalRelationProven(decl.committed_at, decl.recorded_at, ">")) {
    throw new PatchError(
      `intervention_commitment_declaration ${selfId}: committed_at must not be after recorded_at`
    );
  }

  if (decl.valid_until !== null && isAdmissionTemporalRelationProven(decl.committed_at, decl.valid_until, ">=")) {
    throw new PatchError(
      `intervention_commitment_declaration ${selfId}: valid_until must be after committed_at`
    );
  }

  if (!Array.isArray(decl.basis)) {
    throw new PatchError(
      `intervention_commitment_declaration ${selfId}: basis must be an array`
    );
  }

  const seenBasis = new Set<string>();
  for (const ref of decl.basis) {
    const key = commitmentBasisRefKey(ref);
    if (seenBasis.has(key)) {
      throw new PatchError(
        `intervention_commitment_declaration ${selfId}: duplicate basis reference ${key}`
      );
    }
    seenBasis.add(key);

    if (ref.kind === "REALITY_DECISION") {
      const decision = state.reality_decision_declarations.find(
        (entry) =>
          entry.id === ref.decision_declaration_id &&
          entry.project_id === state.project.id
      );
      if (!decision) {
        throw new PatchError(
          `intervention_commitment_declaration ${selfId}: unknown decision_declaration_id ${ref.decision_declaration_id}`
        );
      }
      if (decision.selected_option.kind === "DO_NOTHING") {
        throw new PatchError(
          `intervention_commitment_declaration ${selfId}: DO_NOTHING Decision cannot be Intervention Commitment basis`
        );
      }
      if (
        decision.selected_option.kind !== "INTERVENTION" ||
        decision.selected_option.intervention_id !== decl.intervention_id
      ) {
        throw new PatchError(
          `intervention_commitment_declaration ${selfId}: decision basis must select the same Intervention`
        );
      }
      if (isAdmissionTemporalRelationProven(decl.committed_at, decision.decided_at, "<")) {
        throw new PatchError(
          `intervention_commitment_declaration ${selfId}: committed_at must not predate linked Decision decided_at`
        );
      }
    } else if (ref.kind === "INTERVENTION_INTENT") {
      const intent = state.intervention_intent_declarations.find(
        (entry) =>
          entry.id === ref.intent_declaration_id &&
          entry.project_id === state.project.id
      );
      if (!intent) {
        throw new PatchError(
          `intervention_commitment_declaration ${selfId}: unknown intent_declaration_id ${ref.intent_declaration_id}`
        );
      }
      if (intent.intent_holder_entity_id !== decl.commitment_holder_entity_id) {
        throw new PatchError(
          `intervention_commitment_declaration ${selfId}: intent basis holder must equal commitment holder`
        );
      }
      if (intent.intervention_id !== decl.intervention_id) {
        throw new PatchError(
          `intervention_commitment_declaration ${selfId}: intent basis must target the same Intervention`
        );
      }
      if (intent.disposition !== "PURSUE") {
        throw new PatchError(
          `intervention_commitment_declaration ${selfId}: REFRAIN Intent cannot be Intervention Commitment basis`
        );
      }
      if (isAdmissionTemporalRelationProven(decl.committed_at, intent.intent_formed_at, "<")) {
        throw new PatchError(
          `intervention_commitment_declaration ${selfId}: committed_at must not predate linked Intent intent_formed_at`
        );
      }
    } else {
      throw new PatchError(
        `intervention_commitment_declaration ${selfId}: unknown basis kind`
      );
    }
  }

  for (const other of state.intervention_commitment_declarations) {
    if (other.id === selfId) {
      continue;
    }
    if (
      other.commitment_holder_entity_id === decl.commitment_holder_entity_id &&
      other.intervention_id === decl.intervention_id &&
      isAdmissionTemporalRelationProven(other.committed_at, decl.committed_at, "===") &&
      governanceDeclarerKey(other.declared_by) ===
        governanceDeclarerKey(decl.declared_by)
    ) {
      throw new PatchError(
        `intervention_commitment_declaration ${selfId}: semantic duplicate from same declarer already exists`
      );
    }
  }
}

function assertInterventionCommitmentDeclarationInvariants(
  state: ProjectState
): void {
  assertUniqueIds(
    state.intervention_commitment_declarations,
    "intervention_commitment_declaration"
  );

  for (const decl of state.intervention_commitment_declarations) {
    if (decl.project_id !== state.project.id) {
      throw new PatchError(
        `intervention_commitment_declaration ${decl.id} has mismatched project_id`
      );
    }
    assertInterventionCommitmentDeclarationShape(state, decl, decl.id);
  }
}

function assertInterventionCommitmentDeclarationUpsert(
  state: ProjectState,
  operation: Extract<
    PatchOperation,
    { entity: "intervention_commitment_declaration" }
  >
): void {
  const payload = operation.payload ?? {};
  const existing = state.intervention_commitment_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  if (existing) {
    throw new PatchError(
      `Cannot update intervention_commitment_declaration ${operation.entity_id}: Commitment history is append-only`
    );
  }

  const decl: InterventionCommitmentDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    commitment_holder_entity_id:
      (payload.commitment_holder_entity_id as string | undefined) ?? "",
    intervention_id: (payload.intervention_id as string | undefined) ?? "",
    basis: Array.isArray(payload.basis)
      ? (payload.basis as CommitmentBasisReference[])
      : [],
    committed_at: (payload.committed_at as string | undefined) ?? "",
    valid_until:
      payload.valid_until !== undefined
        ? (payload.valid_until as string | null)
        : null,
    note:
      payload.note !== undefined ? (payload.note as string | null) : null,
    declared_by: (payload.declared_by ?? {
      kind: "human",
    }) as InterventionCommitmentDeclaration["declared_by"],
    recorded_at: (payload.recorded_at as string | undefined) ?? "",
    created_at: (payload.created_at as string | undefined) ?? "",
    updated_at: (payload.updated_at as string | undefined) ?? "",
  };

  assertInterventionCommitmentDeclarationShape(state, decl, operation.entity_id);
}

function assertInterventionCommitmentAcceptanceDeclarationShape(
  state: ProjectState,
  decl: InterventionCommitmentAcceptanceDeclaration,
  selfId: string
): void {
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  const commitment = state.intervention_commitment_declarations.find(
    (entry) =>
      entry.id === decl.commitment_declaration_id &&
      entry.project_id === state.project.id
  );
  if (!commitment) {
    throw new PatchError(
      `intervention_commitment_acceptance_declaration ${selfId}: unknown commitment_declaration_id ${decl.commitment_declaration_id}`
    );
  }

  if (
    decl.declared_by.entity_id != null &&
    decl.declared_by.entity_id !== "" &&
    !entityIds.has(decl.declared_by.entity_id)
  ) {
    throw new PatchError(
      `intervention_commitment_acceptance_declaration ${selfId}: declared_by.entity_id not found`
    );
  }

  if (isAdmissionTemporalRelationProven(decl.accepted_at, commitment.committed_at, "<")) {
    throw new PatchError(
      `intervention_commitment_acceptance_declaration ${selfId}: accepted_at must not predate commitment.committed_at`
    );
  }

  if (isAdmissionTemporalRelationProven(decl.accepted_at, decl.recorded_at, ">")) {
    throw new PatchError(
      `intervention_commitment_acceptance_declaration ${selfId}: accepted_at must not be after recorded_at`
    );
  }

  const semanticKey = assessTemporalPrerequisite(() => interventionCommitmentSemanticKey(
    commitment.commitment_holder_entity_id,
    commitment.intervention_id,
    commitment.committed_at
  ));

  for (const other of state.intervention_commitment_acceptance_declarations) {
    if (other.id === selfId) {
      continue;
    }
    const otherCommitment = state.intervention_commitment_declarations.find(
      (entry) => entry.id === other.commitment_declaration_id
    );
    if (!otherCommitment) {
      continue;
    }
    const otherKey = assessTemporalPrerequisite(() => interventionCommitmentSemanticKey(
      otherCommitment.commitment_holder_entity_id,
      otherCommitment.intervention_id,
      otherCommitment.committed_at
    ));
    if (
      haveVerifiedEqualValues(otherKey, semanticKey) &&
      isAdmissionTemporalRelationProven(other.accepted_at, decl.accepted_at, "===") &&
      governanceDeclarerKey(other.declared_by) ===
        governanceDeclarerKey(decl.declared_by)
    ) {
      throw new PatchError(
        `intervention_commitment_acceptance_declaration ${selfId}: semantic duplicate from same declarer already exists`
      );
    }
  }
}

function assertInterventionCommitmentAcceptanceDeclarationInvariants(
  state: ProjectState
): void {
  assertUniqueIds(
    state.intervention_commitment_acceptance_declarations,
    "intervention_commitment_acceptance_declaration"
  );

  for (const decl of state.intervention_commitment_acceptance_declarations) {
    if (decl.project_id !== state.project.id) {
      throw new PatchError(
        `intervention_commitment_acceptance_declaration ${decl.id} has mismatched project_id`
      );
    }
    assertInterventionCommitmentAcceptanceDeclarationShape(state, decl, decl.id);
  }
}

function assertInterventionCommitmentAcceptanceDeclarationUpsert(
  state: ProjectState,
  operation: Extract<
    PatchOperation,
    { entity: "intervention_commitment_acceptance_declaration" }
  >
): void {
  const payload = operation.payload ?? {};
  const existing = state.intervention_commitment_acceptance_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  if (existing) {
    throw new PatchError(
      `Cannot update intervention_commitment_acceptance_declaration ${operation.entity_id}: Commitment Acceptance history is append-only`
    );
  }

  const decl: InterventionCommitmentAcceptanceDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    commitment_declaration_id:
      (payload.commitment_declaration_id as string | undefined) ?? "",
    accepted_at: (payload.accepted_at as string | undefined) ?? "",
    note:
      payload.note !== undefined ? (payload.note as string | null) : null,
    declared_by: (payload.declared_by ?? {
      kind: "human",
    }) as InterventionCommitmentAcceptanceDeclaration["declared_by"],
    recorded_at: (payload.recorded_at as string | undefined) ?? "",
    created_at: (payload.created_at as string | undefined) ?? "",
    updated_at: (payload.updated_at as string | undefined) ?? "",
  };

  assertInterventionCommitmentAcceptanceDeclarationShape(
    state,
    decl,
    operation.entity_id
  );
}

const COMMITMENT_TEMPORAL_TERM_KINDS: CommitmentTemporalTermKind[] = [
  "START_BY",
  "COMPLETE_BY",
];

function assertInterventionCommitmentTemporalTermDeclarationShape(
  state: ProjectState,
  decl: InterventionCommitmentTemporalTermDeclaration,
  selfId: string
): void {
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  const commitment = state.intervention_commitment_declarations.find(
    (entry) =>
      entry.id === decl.commitment_declaration_id &&
      entry.project_id === state.project.id
  );
  if (!commitment) {
    throw new PatchError(
      `intervention_commitment_temporal_term_declaration ${selfId}: unknown commitment_declaration_id ${decl.commitment_declaration_id}`
    );
  }

  if (
    !COMMITMENT_TEMPORAL_TERM_KINDS.includes(decl.term_kind)
  ) {
    throw new PatchError(
      `intervention_commitment_temporal_term_declaration ${selfId}: term_kind must be START_BY or COMPLETE_BY`
    );
  }

  if (!decl.deadline_at) {
    throw new PatchError(
      `intervention_commitment_temporal_term_declaration ${selfId}: deadline_at is required`
    );
  }

  if (
    decl.declared_by.entity_id != null &&
    decl.declared_by.entity_id !== "" &&
    !entityIds.has(decl.declared_by.entity_id)
  ) {
    throw new PatchError(
      `intervention_commitment_temporal_term_declaration ${selfId}: declared_by.entity_id not found`
    );
  }

  if (isAdmissionTemporalRelationProven(decl.deadline_at, commitment.committed_at, "<")) {
    throw new PatchError(
      `intervention_commitment_temporal_term_declaration ${selfId}: deadline_at must not predate commitment.committed_at`
    );
  }

  const semanticKey = assessTemporalPrerequisite(() => interventionCommitmentSemanticKey(
    commitment.commitment_holder_entity_id,
    commitment.intervention_id,
    commitment.committed_at
  ));

  for (const other of state.intervention_commitment_temporal_term_declarations) {
    if (other.id === selfId) {
      continue;
    }
    const otherCommitment = state.intervention_commitment_declarations.find(
      (entry) => entry.id === other.commitment_declaration_id
    );
    if (!otherCommitment) {
      continue;
    }
    const otherKey = assessTemporalPrerequisite(() => interventionCommitmentSemanticKey(
      otherCommitment.commitment_holder_entity_id,
      otherCommitment.intervention_id,
      otherCommitment.committed_at
    ));
    if (
      haveVerifiedEqualValues(otherKey, semanticKey) &&
      other.term_kind === decl.term_kind &&
      isAdmissionTemporalRelationProven(other.deadline_at, decl.deadline_at, "===") &&
      governanceDeclarerKey(other.declared_by) ===
        governanceDeclarerKey(decl.declared_by)
    ) {
      throw new PatchError(
        `intervention_commitment_temporal_term_declaration ${selfId}: semantic duplicate from same declarer already exists`
      );
    }
  }
}

function assertInterventionCommitmentTemporalTermDeclarationInvariants(
  state: ProjectState
): void {
  assertUniqueIds(
    state.intervention_commitment_temporal_term_declarations,
    "intervention_commitment_temporal_term_declaration"
  );

  for (const decl of state.intervention_commitment_temporal_term_declarations) {
    if (decl.project_id !== state.project.id) {
      throw new PatchError(
        `intervention_commitment_temporal_term_declaration ${decl.id} has mismatched project_id`
      );
    }
    assertInterventionCommitmentTemporalTermDeclarationShape(
      state,
      decl,
      decl.id
    );
  }
}

function assertInterventionCommitmentTemporalTermDeclarationUpsert(
  state: ProjectState,
  operation: Extract<
    PatchOperation,
    { entity: "intervention_commitment_temporal_term_declaration" }
  >
): void {
  const payload = operation.payload ?? {};
  const existing = state.intervention_commitment_temporal_term_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  if (existing) {
    throw new PatchError(
      `Cannot update intervention_commitment_temporal_term_declaration ${operation.entity_id}: Commitment Temporal Term history is append-only`
    );
  }

  const decl: InterventionCommitmentTemporalTermDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    commitment_declaration_id:
      (payload.commitment_declaration_id as string | undefined) ?? "",
    term_kind: (payload.term_kind as CommitmentTemporalTermKind | undefined) ??
      ("" as CommitmentTemporalTermKind),
    deadline_at: (payload.deadline_at as string | undefined) ?? "",
    note:
      payload.note !== undefined ? (payload.note as string | null) : null,
    declared_by: (payload.declared_by ?? {
      kind: "human",
    }) as InterventionCommitmentTemporalTermDeclaration["declared_by"],
    recorded_at: (payload.recorded_at as string | undefined) ?? "",
    created_at: (payload.created_at as string | undefined) ?? "",
    updated_at: (payload.updated_at as string | undefined) ?? "",
  };

  assertInterventionCommitmentTemporalTermDeclarationShape(
    state,
    decl,
    operation.entity_id
  );
}

const COMMITMENT_CONDITION_ROLES: CommitmentConditionRole[] = [
  "ACTIVATION_CONDITION",
  "EXCEPTION_CONDITION",
];

function assertInterventionCommitmentConditionalTermDeclarationShape(
  state: ProjectState,
  decl: InterventionCommitmentConditionalTermDeclaration,
  selfId: string
): void {
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  const commitment = state.intervention_commitment_declarations.find(
    (entry) =>
      entry.id === decl.commitment_declaration_id &&
      entry.project_id === state.project.id
  );
  if (!commitment) {
    throw new PatchError(
      `intervention_commitment_conditional_term_declaration ${selfId}: unknown commitment_declaration_id ${decl.commitment_declaration_id}`
    );
  }

  if (!decl.condition_key.trim()) {
    throw new PatchError(
      `intervention_commitment_conditional_term_declaration ${selfId}: condition_key must be non-empty`
    );
  }

  if (!COMMITMENT_CONDITION_ROLES.includes(decl.condition_role)) {
    throw new PatchError(
      `intervention_commitment_conditional_term_declaration ${selfId}: condition_role must be ACTIVATION_CONDITION or EXCEPTION_CONDITION`
    );
  }

  if (
    decl.declared_by.entity_id != null &&
    decl.declared_by.entity_id !== "" &&
    !entityIds.has(decl.declared_by.entity_id)
  ) {
    throw new PatchError(
      `intervention_commitment_conditional_term_declaration ${selfId}: declared_by.entity_id not found`
    );
  }

  const semanticKey = assessTemporalPrerequisite(() => interventionCommitmentSemanticKey(
    commitment.commitment_holder_entity_id,
    commitment.intervention_id,
    commitment.committed_at
  ));

  for (const other of state.intervention_commitment_conditional_term_declarations) {
    if (other.id === selfId) {
      continue;
    }
    const otherCommitment = state.intervention_commitment_declarations.find(
      (entry) => entry.id === other.commitment_declaration_id
    );
    if (!otherCommitment) {
      continue;
    }
    const otherKey = assessTemporalPrerequisite(() => interventionCommitmentSemanticKey(
      otherCommitment.commitment_holder_entity_id,
      otherCommitment.intervention_id,
      otherCommitment.committed_at
    ));
    if (
      haveVerifiedEqualValues(otherKey, semanticKey) &&
      other.condition_key === decl.condition_key &&
      other.condition_role === decl.condition_role &&
      governanceDeclarerKey(other.declared_by) ===
        governanceDeclarerKey(decl.declared_by)
    ) {
      throw new PatchError(
        `intervention_commitment_conditional_term_declaration ${selfId}: semantic duplicate from same declarer already exists`
      );
    }
  }
}

function assertInterventionCommitmentConditionalTermDeclarationInvariants(
  state: ProjectState
): void {
  assertUniqueIds(
    state.intervention_commitment_conditional_term_declarations,
    "intervention_commitment_conditional_term_declaration"
  );

  for (const decl of state.intervention_commitment_conditional_term_declarations) {
    if (decl.project_id !== state.project.id) {
      throw new PatchError(
        `intervention_commitment_conditional_term_declaration ${decl.id} has mismatched project_id`
      );
    }
    assertInterventionCommitmentConditionalTermDeclarationShape(
      state,
      decl,
      decl.id
    );
  }
}

function assertInterventionCommitmentConditionalTermDeclarationUpsert(
  state: ProjectState,
  operation: Extract<
    PatchOperation,
    { entity: "intervention_commitment_conditional_term_declaration" }
  >
): void {
  const payload = operation.payload ?? {};
  const existing =
    state.intervention_commitment_conditional_term_declarations.find(
      (entry) => entry.id === operation.entity_id
    );

  if (existing) {
    throw new PatchError(
      `Cannot update intervention_commitment_conditional_term_declaration ${operation.entity_id}: Commitment Conditional Term history is append-only`
    );
  }

  const decl: InterventionCommitmentConditionalTermDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    commitment_declaration_id:
      (payload.commitment_declaration_id as string | undefined) ?? "",
    condition_key: (payload.condition_key as string | undefined) ?? "",
    condition_role:
      (payload.condition_role as CommitmentConditionRole | undefined) ??
      ("" as CommitmentConditionRole),
    description:
      payload.description !== undefined
        ? (payload.description as string | null)
        : null,
    note:
      payload.note !== undefined ? (payload.note as string | null) : null,
    declared_by: (payload.declared_by ?? {
      kind: "human",
    }) as InterventionCommitmentConditionalTermDeclaration["declared_by"],
    recorded_at: (payload.recorded_at as string | undefined) ?? "",
    created_at: (payload.created_at as string | undefined) ?? "",
    updated_at: (payload.updated_at as string | undefined) ?? "",
  };

  assertInterventionCommitmentConditionalTermDeclarationShape(
    state,
    decl,
    operation.entity_id
  );
}

function assertResourceCommitmentAmount(
  amount: ResourceCommitmentAmount | null | undefined,
  label: string
): ResourceCommitmentAmount | null {
  if (amount === undefined || amount === null) {
    return null;
  }
  if (amount.kind === "POINT") {
    if (typeof amount.value !== "number" || !Number.isFinite(amount.value)) {
      throw new PatchError(`${label} POINT committed_amount requires numeric value`);
    }
    if (!(amount.value > 0)) {
      throw new PatchError(
        `${label} POINT committed_amount must be a finite number greater than 0`
      );
    }
    return { kind: "POINT", value: amount.value };
  }
  if (amount.kind === "RANGE") {
    if (
      typeof amount.min !== "number" ||
      typeof amount.max !== "number" ||
      !Number.isFinite(amount.min) ||
      !Number.isFinite(amount.max)
    ) {
      throw new PatchError(
        `${label} RANGE committed_amount requires numeric min and max`
      );
    }
    if (!(amount.min > 0) || !(amount.max >= amount.min)) {
      throw new PatchError(
        `${label} RANGE committed_amount must be finite with min > 0 and max >= min`
      );
    }
    return { kind: "RANGE", min: amount.min, max: amount.max };
  }
  throw new PatchError(`${label} committed_amount.kind must be POINT or RANGE`);
}

function assertInterventionResourceCommitmentDeclarationShape(
  state: ProjectState,
  decl: InterventionResourceCommitmentDeclaration,
  selfId: string
): void {
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  const commitment = state.intervention_commitment_declarations.find(
    (entry) =>
      entry.id === decl.commitment_declaration_id &&
      entry.project_id === state.project.id
  );
  if (!commitment) {
    throw new PatchError(
      `intervention_resource_commitment_declaration ${selfId}: unknown commitment_declaration_id ${decl.commitment_declaration_id}`
    );
  }

  const resource = state.resource_declarations.find(
    (entry) =>
      entry.id === decl.resource_declaration_id &&
      entry.project_id === state.project.id
  );
  if (!resource) {
    throw new PatchError(
      `intervention_resource_commitment_declaration ${selfId}: unknown resource_declaration_id ${decl.resource_declaration_id}`
    );
  }

  if (!entityIds.has(decl.resource_committer_entity_id)) {
    throw new PatchError(
      `intervention_resource_commitment_declaration ${selfId}: unknown resource_committer_entity_id ${decl.resource_committer_entity_id}`
    );
  }

  if (
    decl.declared_by.entity_id != null &&
    decl.declared_by.entity_id !== "" &&
    !entityIds.has(decl.declared_by.entity_id)
  ) {
    throw new PatchError(
      `intervention_resource_commitment_declaration ${selfId}: declared_by.entity_id not found`
    );
  }

  if (!decl.resource_committed_at) {
    throw new PatchError(
      `intervention_resource_commitment_declaration ${selfId}: resource_committed_at is required`
    );
  }
  if (!decl.recorded_at) {
    throw new PatchError(
      `intervention_resource_commitment_declaration ${selfId}: recorded_at is required`
    );
  }

  if (isAdmissionTemporalRelationProven(decl.resource_committed_at, commitment.committed_at, "<")) {
    throw new PatchError(
      `intervention_resource_commitment_declaration ${selfId}: resource_committed_at must be >= commitment.committed_at`
    );
  }
  if (isAdmissionTemporalRelationProven(decl.resource_committed_at, decl.recorded_at, ">")) {
    throw new PatchError(
      `intervention_resource_commitment_declaration ${selfId}: resource_committed_at must be <= recorded_at`
    );
  }

  assertResourceCommitmentAmount(
    decl.committed_amount ?? null,
    `intervention_resource_commitment_declaration ${selfId}`
  );

  const semanticKey = assessTemporalPrerequisite(() => interventionCommitmentSemanticKey(
    commitment.commitment_holder_entity_id,
    commitment.intervention_id,
    commitment.committed_at
  ));

  for (const other of state.intervention_resource_commitment_declarations) {
    if (other.id === selfId) {
      continue;
    }
    const otherCommitment = state.intervention_commitment_declarations.find(
      (entry) => entry.id === other.commitment_declaration_id
    );
    if (!otherCommitment) {
      continue;
    }
    const otherKey = assessTemporalPrerequisite(() => interventionCommitmentSemanticKey(
      otherCommitment.commitment_holder_entity_id,
      otherCommitment.intervention_id,
      otherCommitment.committed_at
    ));
    if (
      haveVerifiedEqualValues(otherKey, semanticKey) &&
      other.resource_declaration_id === decl.resource_declaration_id &&
      other.resource_committer_entity_id === decl.resource_committer_entity_id &&
      isAdmissionTemporalRelationProven(other.resource_committed_at, decl.resource_committed_at, "===") &&
      governanceDeclarerKey(other.declared_by) ===
        governanceDeclarerKey(decl.declared_by)
    ) {
      throw new PatchError(
        `intervention_resource_commitment_declaration ${selfId}: semantic duplicate from same declarer already exists`
      );
    }
  }
}

function assertInterventionResourceCommitmentDeclarationInvariants(
  state: ProjectState
): void {
  assertUniqueIds(
    state.intervention_resource_commitment_declarations,
    "intervention_resource_commitment_declaration"
  );

  for (const decl of state.intervention_resource_commitment_declarations) {
    if (decl.project_id !== state.project.id) {
      throw new PatchError(
        `intervention_resource_commitment_declaration ${decl.id} has mismatched project_id`
      );
    }
    assertInterventionResourceCommitmentDeclarationShape(
      state,
      decl,
      decl.id
    );
  }
}

function assertInterventionResourceCommitmentDeclarationUpsert(
  state: ProjectState,
  operation: Extract<
    PatchOperation,
    { entity: "intervention_resource_commitment_declaration" }
  >
): void {
  const payload = operation.payload ?? {};
  const existing = state.intervention_resource_commitment_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  if (existing) {
    throw new PatchError(
      `Cannot update intervention_resource_commitment_declaration ${operation.entity_id}: Resource Commitment history is append-only`
    );
  }

  const committed_amount = assertResourceCommitmentAmount(
    (payload.committed_amount as ResourceCommitmentAmount | null | undefined) ??
      null,
    `intervention_resource_commitment_declaration ${operation.entity_id}`
  );

  const decl: InterventionResourceCommitmentDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    commitment_declaration_id:
      (payload.commitment_declaration_id as string | undefined) ?? "",
    resource_declaration_id:
      (payload.resource_declaration_id as string | undefined) ?? "",
    resource_committer_entity_id:
      (payload.resource_committer_entity_id as string | undefined) ?? "",
    committed_amount,
    resource_committed_at:
      (payload.resource_committed_at as string | undefined) ?? "",
    note:
      payload.note !== undefined ? (payload.note as string | null) : null,
    declared_by: (payload.declared_by ?? {
      kind: "human",
    }) as InterventionResourceCommitmentDeclaration["declared_by"],
    recorded_at: (payload.recorded_at as string | undefined) ?? "",
    created_at: (payload.created_at as string | undefined) ?? "",
    updated_at: (payload.updated_at as string | undefined) ?? "",
  };

  assertInterventionResourceCommitmentDeclarationShape(
    state,
    decl,
    operation.entity_id
  );
}

function assertResourceReservationAmount(
  amount: ResourceReservationAmount,
  label: string
): ResourceReservationAmount {
  if (amount.kind === "POINT") {
    if (typeof amount.value !== "number" || !Number.isFinite(amount.value)) {
      throw new PatchError(`${label} POINT reservation amount requires numeric value`);
    }
    if (!(amount.value > 0)) {
      throw new PatchError(
        `${label} POINT reservation amount must be a finite number greater than 0`
      );
    }
    return { kind: "POINT", value: amount.value };
  }
  if (amount.kind === "RANGE") {
    if (
      typeof amount.min !== "number" ||
      typeof amount.max !== "number" ||
      !Number.isFinite(amount.min) ||
      !Number.isFinite(amount.max)
    ) {
      throw new PatchError(
        `${label} RANGE reservation amount requires numeric min and max`
      );
    }
    if (!(amount.min > 0) || !(amount.max >= amount.min)) {
      throw new PatchError(
        `${label} RANGE reservation amount must be finite with min > 0 and max >= min`
      );
    }
    return { kind: "RANGE", min: amount.min, max: amount.max };
  }
  throw new PatchError(`${label} reservation amount.kind must be POINT or RANGE`);
}

function assertResourceReservationScope(
  scope: ResourceReservationScope | null | undefined,
  label: string
): ResourceReservationScope {
  if (!scope || typeof scope !== "object" || !("kind" in scope)) {
    throw new PatchError(`${label} reservation_scope is required`);
  }
  if (scope.kind === "FULL_RESOURCE") {
    if ("amount" in scope && (scope as { amount?: unknown }).amount != null) {
      throw new PatchError(
        `${label} FULL_RESOURCE reservation_scope must not include amount`
      );
    }
    return { kind: "FULL_RESOURCE" };
  }
  if (scope.kind === "AMOUNT") {
    if (!("amount" in scope) || scope.amount == null) {
      throw new PatchError(
        `${label} AMOUNT reservation_scope requires amount`
      );
    }
    return {
      kind: "AMOUNT",
      amount: assertResourceReservationAmount(scope.amount, label),
    };
  }
  throw new PatchError(
    `${label} reservation_scope.kind must be FULL_RESOURCE or AMOUNT`
  );
}

function resourceCommitmentSemanticKeyFromState(
  state: ProjectState,
  resourceCommitment: InterventionResourceCommitmentDeclaration
): string {
  const commitment = state.intervention_commitment_declarations.find(
    (entry) => entry.id === resourceCommitment.commitment_declaration_id
  );
  if (!commitment) {
    return `missing-commitment|${resourceCommitment.id}`;
  }
  return resourceCommitmentSemanticKey(
    interventionCommitmentSemanticKey(
      commitment.commitment_holder_entity_id,
      commitment.intervention_id,
      commitment.committed_at
    ),
    resourceCommitment.resource_declaration_id,
    resourceCommitment.resource_committer_entity_id,
    resourceCommitment.resource_committed_at
  );
}

function assertInterventionResourceReservationDeclarationShape(
  state: ProjectState,
  decl: InterventionResourceReservationDeclaration,
  selfId: string
): void {
  const entityIds = new Set(state.reality_entities.map((entry) => entry.id));

  const resourceCommitment =
    state.intervention_resource_commitment_declarations.find(
      (entry) =>
        entry.id === decl.resource_commitment_declaration_id &&
        entry.project_id === state.project.id
    );
  if (!resourceCommitment) {
    throw new PatchError(
      `intervention_resource_reservation_declaration ${selfId}: unknown resource_commitment_declaration_id ${decl.resource_commitment_declaration_id}`
    );
  }

  if (!entityIds.has(decl.reserved_by_entity_id)) {
    throw new PatchError(
      `intervention_resource_reservation_declaration ${selfId}: unknown reserved_by_entity_id ${decl.reserved_by_entity_id}`
    );
  }

  if (
    decl.declared_by.entity_id != null &&
    decl.declared_by.entity_id !== "" &&
    !entityIds.has(decl.declared_by.entity_id)
  ) {
    throw new PatchError(
      `intervention_resource_reservation_declaration ${selfId}: declared_by.entity_id not found`
    );
  }

  assertResourceReservationScope(
    decl.reservation_scope,
    `intervention_resource_reservation_declaration ${selfId}`
  );

  if (!decl.reservation_made_at) {
    throw new PatchError(
      `intervention_resource_reservation_declaration ${selfId}: reservation_made_at is required`
    );
  }
  if (!decl.recorded_at) {
    throw new PatchError(
      `intervention_resource_reservation_declaration ${selfId}: recorded_at is required`
    );
  }
  if (!decl.reserved_from) {
    throw new PatchError(
      `intervention_resource_reservation_declaration ${selfId}: reserved_from is required`
    );
  }

  if (isAdmissionTemporalRelationProven(decl.reservation_made_at, resourceCommitment.resource_committed_at, "<")) {
    throw new PatchError(
      `intervention_resource_reservation_declaration ${selfId}: reservation_made_at must be >= resource_commitment.resource_committed_at`
    );
  }
  if (isAdmissionTemporalRelationProven(decl.reservation_made_at, decl.recorded_at, ">")) {
    throw new PatchError(
      `intervention_resource_reservation_declaration ${selfId}: reservation_made_at must be <= recorded_at`
    );
  }
  if (isAdmissionTemporalRelationProven(decl.reserved_from, decl.reservation_made_at, "<")) {
    throw new PatchError(
      `intervention_resource_reservation_declaration ${selfId}: reserved_from must be >= reservation_made_at`
    );
  }
  if (
    decl.reserved_until !== null &&
    isAdmissionTemporalRelationProven(decl.reserved_from, decl.reserved_until, ">=")
  ) {
    throw new PatchError(
      `intervention_resource_reservation_declaration ${selfId}: reserved_until must be null or after reserved_from`
    );
  }

  const semanticKey = assessTemporalPrerequisite(() => resourceCommitmentSemanticKeyFromState(
    state,
    resourceCommitment
  ));

  for (const other of state.intervention_resource_reservation_declarations) {
    if (other.id === selfId) {
      continue;
    }
    const otherRc = state.intervention_resource_commitment_declarations.find(
      (entry) => entry.id === other.resource_commitment_declaration_id
    );
    if (!otherRc) {
      continue;
    }
    const otherKey = assessTemporalPrerequisite(() => resourceCommitmentSemanticKeyFromState(state, otherRc));
    if (
      haveVerifiedEqualValues(otherKey, semanticKey) &&
      other.reserved_by_entity_id === decl.reserved_by_entity_id &&
      isAdmissionTemporalRelationProven(other.reservation_made_at, decl.reservation_made_at, "===") &&
      governanceDeclarerKey(other.declared_by) ===
        governanceDeclarerKey(decl.declared_by)
    ) {
      throw new PatchError(
        `intervention_resource_reservation_declaration ${selfId}: semantic duplicate from same declarer already exists`
      );
    }
  }
}

function assertInterventionResourceReservationDeclarationInvariants(
  state: ProjectState
): void {
  assertUniqueIds(
    state.intervention_resource_reservation_declarations,
    "intervention_resource_reservation_declaration"
  );

  for (const decl of state.intervention_resource_reservation_declarations) {
    if (decl.project_id !== state.project.id) {
      throw new PatchError(
        `intervention_resource_reservation_declaration ${decl.id} has mismatched project_id`
      );
    }
    assertInterventionResourceReservationDeclarationShape(
      state,
      decl,
      decl.id
    );
  }
}

function assertInterventionResourceReservationDeclarationUpsert(
  state: ProjectState,
  operation: Extract<
    PatchOperation,
    { entity: "intervention_resource_reservation_declaration" }
  >
): void {
  const payload = operation.payload ?? {};
  const existing = state.intervention_resource_reservation_declarations.find(
    (entry) => entry.id === operation.entity_id
  );

  if (existing) {
    throw new PatchError(
      `Cannot update intervention_resource_reservation_declaration ${operation.entity_id}: Resource Reservation history is append-only`
    );
  }

  const reservation_scope = assertResourceReservationScope(
    payload.reservation_scope as ResourceReservationScope | undefined,
    `intervention_resource_reservation_declaration ${operation.entity_id}`
  );

  const reserved_until =
    payload.reserved_until === undefined
      ? null
      : (payload.reserved_until as string | null);

  const decl: InterventionResourceReservationDeclaration = {
    id: operation.entity_id,
    project_id: state.project.id,
    resource_commitment_declaration_id:
      (payload.resource_commitment_declaration_id as string | undefined) ?? "",
    reserved_by_entity_id:
      (payload.reserved_by_entity_id as string | undefined) ?? "",
    reservation_scope,
    reservation_made_at:
      (payload.reservation_made_at as string | undefined) ?? "",
    reserved_from: (payload.reserved_from as string | undefined) ?? "",
    reserved_until,
    note:
      payload.note !== undefined ? (payload.note as string | null) : null,
    declared_by: (payload.declared_by ?? {
      kind: "human",
    }) as InterventionResourceReservationDeclaration["declared_by"],
    recorded_at: (payload.recorded_at as string | undefined) ?? "",
    created_at: (payload.created_at as string | undefined) ?? "",
    updated_at: (payload.updated_at as string | undefined) ?? "",
  };

  assertInterventionResourceReservationDeclarationShape(
    state,
    decl,
    operation.entity_id
  );
}
