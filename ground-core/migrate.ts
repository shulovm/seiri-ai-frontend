import { legacyDecisionSnapshotVerification, getDecisionSnapshotVerification } from "./decision-snapshot-verification.js";
import { ValidationError } from "./errors.js";
import {
  LEGACY_SCHEMA_VERSION,
  SCHEMA_VERSION,
  SCHEMA_VERSION_V0124,
  SCHEMA_VERSION_V011,
  SCHEMA_VERSION_V012,
  SCHEMA_VERSION_V013,
  SCHEMA_VERSION_V014,
  SCHEMA_VERSION_V015,
  SCHEMA_VERSION_V016,
  SCHEMA_VERSION_V017,
  SCHEMA_VERSION_V018,
  SCHEMA_VERSION_V019,
  SCHEMA_VERSION_V0110,
  SCHEMA_VERSION_V0111,
  SCHEMA_VERSION_V0112,
  SCHEMA_VERSION_V0116,
  SCHEMA_VERSION_V0117,
  SCHEMA_VERSION_V0118,
  SCHEMA_VERSION_V0119,
  SCHEMA_VERSION_V0120,
  SCHEMA_VERSION_V0121,
  SCHEMA_VERSION_V0122,
  SCHEMA_VERSION_V0123,
  SCHEMA_VERSION_V0115,
  SCHEMA_VERSION_V0114,
  SCHEMA_VERSION_V0113,
  type CurrentState,
  type NextAction,
  type ProjectState,
} from "./types.js";
import {
  validateLegacyProjectState,
  validateProjectState,
  validateProjectStateV0124,
  validateProjectStateV011,
  validateProjectStateV012,
  validateProjectStateV013,
  validateProjectStateV014,
  validateProjectStateV015,
  validateProjectStateV016,
  validateProjectStateV017,
  validateProjectStateV018,
  validateProjectStateV019,
  validateProjectStateV0110,
  validateProjectStateV0111,
  validateProjectStateV0112,
  validateProjectStateV0113,
  validateProjectStateV0114,
  validateProjectStateV0115,
  validateProjectStateV0116,
  validateProjectStateV0117,
  validateProjectStateV0118,
  validateProjectStateV0119,
  validateProjectStateV0120,
  validateProjectStateV0121,
  validateProjectStateV0122,
  validateProjectStateV0123,
} from "./validate.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function migrateCurrentState(currentState: unknown): CurrentState {
  if (!isRecord(currentState)) {
    throw new ValidationError("Invalid current_state during migration");
  }

  return {
    ...(currentState as unknown as CurrentState),
    primary_next_action_id:
      typeof currentState.primary_next_action_id === "string"
        ? currentState.primary_next_action_id
        : null,
  };
}

function migrateNextActions(nextActions: unknown): NextAction[] {
  if (!Array.isArray(nextActions)) {
    return [];
  }

  return nextActions.map((action) => {
    if (!isRecord(action)) {
      throw new ValidationError("Invalid next_action during migration");
    }

    return {
      ...(action as unknown as NextAction),
      depends_on_action_id:
        typeof action.depends_on_action_id === "string"
          ? action.depends_on_action_id
          : null,
    };
  });
}

function withEmptyRealityCollections(
  data: Record<string, unknown>
): Pick<ProjectState, "reality_entities" | "reality_events" | "reality_states"> {
  return {
    reality_entities: Array.isArray(data.reality_entities)
      ? (data.reality_entities as ProjectState["reality_entities"])
      : [],
    reality_events: Array.isArray(data.reality_events)
      ? (data.reality_events as ProjectState["reality_events"])
      : [],
    reality_states: Array.isArray(data.reality_states)
      ? (data.reality_states as ProjectState["reality_states"])
      : [],
  };
}

function withEmptyEpistemicCollections(
  data: Record<string, unknown>
): Pick<
  ProjectState,
  | "epistemic_observations"
  | "evidence"
  | "claims"
  | "claim_evidence_links"
> {
  return {
    epistemic_observations: Array.isArray(data.epistemic_observations)
      ? (data.epistemic_observations as ProjectState["epistemic_observations"])
      : [],
    evidence: Array.isArray(data.evidence)
      ? (data.evidence as ProjectState["evidence"])
      : [],
    claims: Array.isArray(data.claims)
      ? (data.claims as ProjectState["claims"])
      : [],
    claim_evidence_links: Array.isArray(data.claim_evidence_links)
      ? (data.claim_evidence_links as ProjectState["claim_evidence_links"])
      : [],
  };
}

function withEmptyReferenceConditions(
  data: Record<string, unknown>
): Pick<ProjectState, "reference_conditions"> {
  return {
    reference_conditions: Array.isArray(data.reference_conditions)
      ? (data.reference_conditions as ProjectState["reference_conditions"])
      : [],
  };
}

function withEmptyObjectiveCollections(
  data: Record<string, unknown>
): Pick<
  ProjectState,
  | "reality_objectives"
  | "objective_requirements"
  | "objective_dependencies"
> {
  return {
    reality_objectives: Array.isArray(data.reality_objectives)
      ? (data.reality_objectives as ProjectState["reality_objectives"])
      : [],
    objective_requirements: Array.isArray(data.objective_requirements)
      ? (data.objective_requirements as ProjectState["objective_requirements"])
      : [],
    objective_dependencies: Array.isArray(data.objective_dependencies)
      ? (data.objective_dependencies as ProjectState["objective_dependencies"])
      : [],
  };
}

function withEmptyProspectiveCollections(
  data: Record<string, unknown>
): Pick<
  ProjectState,
  | "future_scenarios"
  | "scenario_state_projections"
  | "scenario_likelihood_estimates"
> {
  return {
    future_scenarios: Array.isArray(data.future_scenarios)
      ? (data.future_scenarios as ProjectState["future_scenarios"])
      : [],
    scenario_state_projections: Array.isArray(data.scenario_state_projections)
      ? (data.scenario_state_projections as ProjectState["scenario_state_projections"])
      : [],
    scenario_likelihood_estimates: Array.isArray(
      data.scenario_likelihood_estimates
    )
      ? (data.scenario_likelihood_estimates as ProjectState["scenario_likelihood_estimates"])
      : [],
  };
}

function withEmptyImpactCollections(
  data: Record<string, unknown>
): Pick<ProjectState, "impact_declarations"> {
  return {
    impact_declarations: Array.isArray(data.impact_declarations)
      ? (data.impact_declarations as ProjectState["impact_declarations"])
      : [],
  };
}

function withEmptyImpactMeasureCollections(
  data: Record<string, unknown>
): Pick<ProjectState, "impact_measure_declarations"> {
  return {
    impact_measure_declarations: Array.isArray(data.impact_measure_declarations)
      ? (data.impact_measure_declarations as ProjectState["impact_measure_declarations"])
      : [],
  };
}

function withEmptyGovernanceCollections(
  data: Record<string, unknown>
): Pick<
  ProjectState,
  "authority_declarations" | "standing_declarations" | "mandate_declarations"
> {
  return {
    authority_declarations: Array.isArray(data.authority_declarations)
      ? (data.authority_declarations as ProjectState["authority_declarations"])
      : [],
    standing_declarations: Array.isArray(data.standing_declarations)
      ? (data.standing_declarations as ProjectState["standing_declarations"])
      : [],
    mandate_declarations: Array.isArray(data.mandate_declarations)
      ? (data.mandate_declarations as ProjectState["mandate_declarations"])
      : [],
  };
}

function withEmptyGovernanceProvenanceCollections(
  data: Record<string, unknown>
): Pick<
  ProjectState,
  "authority_delegation_declarations" | "authority_contest_declarations"
> {
  return {
    authority_delegation_declarations: Array.isArray(
      data.authority_delegation_declarations
    )
      ? (data.authority_delegation_declarations as ProjectState["authority_delegation_declarations"])
      : [],
    authority_contest_declarations: Array.isArray(
      data.authority_contest_declarations
    )
      ? (data.authority_contest_declarations as ProjectState["authority_contest_declarations"])
      : [],
  };
}

function withEmptyCapabilityCollections(
  data: Record<string, unknown>
): Pick<
  ProjectState,
  | "capability_declarations"
  | "capability_verification_declarations"
  | "capability_availability_declarations"
> {
  return {
    capability_declarations: Array.isArray(data.capability_declarations)
      ? (data.capability_declarations as ProjectState["capability_declarations"])
      : [],
    capability_verification_declarations: Array.isArray(
      data.capability_verification_declarations
    )
      ? (data.capability_verification_declarations as ProjectState["capability_verification_declarations"])
      : [],
    capability_availability_declarations: Array.isArray(
      data.capability_availability_declarations
    )
      ? (data.capability_availability_declarations as ProjectState["capability_availability_declarations"])
      : [],
  };
}

function withEmptyResourceCollections(
  data: Record<string, unknown>
): Pick<
  ProjectState,
  | "resource_declarations"
  | "resource_capacity_declarations"
  | "resource_availability_declarations"
> {
  return {
    resource_declarations: Array.isArray(data.resource_declarations)
      ? (data.resource_declarations as ProjectState["resource_declarations"])
      : [],
    resource_capacity_declarations: Array.isArray(
      data.resource_capacity_declarations
    )
      ? (data.resource_capacity_declarations as ProjectState["resource_capacity_declarations"])
      : [],
    resource_availability_declarations: Array.isArray(
      data.resource_availability_declarations
    )
      ? (data.resource_availability_declarations as ProjectState["resource_availability_declarations"])
      : [],
  };
}

function withEmptyInterventionCollections(
  data: Record<string, unknown>
): Pick<
  ProjectState,
  | "intervention_declarations"
  | "intervention_capability_requirement_declarations"
  | "intervention_resource_requirement_declarations"
> {
  return {
    intervention_declarations: Array.isArray(data.intervention_declarations)
      ? (data.intervention_declarations as ProjectState["intervention_declarations"])
      : [],
    intervention_capability_requirement_declarations: Array.isArray(
      data.intervention_capability_requirement_declarations
    )
      ? (data.intervention_capability_requirement_declarations as ProjectState["intervention_capability_requirement_declarations"])
      : [],
    intervention_resource_requirement_declarations: Array.isArray(
      data.intervention_resource_requirement_declarations
    )
      ? (data.intervention_resource_requirement_declarations as ProjectState["intervention_resource_requirement_declarations"])
      : [],
  };
}

function withEmptyActorCandidateCollections(
  data: Record<string, unknown>
): Pick<ProjectState, "decision_option_actor_candidate_declarations"> {
  return {
    decision_option_actor_candidate_declarations: Array.isArray(
      data.decision_option_actor_candidate_declarations
    )
      ? (data.decision_option_actor_candidate_declarations as ProjectState["decision_option_actor_candidate_declarations"])
      : [],
  };
}

function withEmptyDecisionCollections(
  data: Record<string, unknown>
): Pick<ProjectState, "decision_space_declarations" | "decision_option_declarations"> {
  return {
    decision_space_declarations: Array.isArray(data.decision_space_declarations)
      ? (data.decision_space_declarations as ProjectState["decision_space_declarations"])
      : [],
    decision_option_declarations: Array.isArray(data.decision_option_declarations)
      ? (data.decision_option_declarations as ProjectState["decision_option_declarations"])
      : [],
  };
}

function withEmptyPermissionCollections(
  data: Record<string, unknown>
): Pick<ProjectState, "intervention_permission_declarations"> {
  return {
    intervention_permission_declarations: Array.isArray(
      data.intervention_permission_declarations
    )
      ? (data.intervention_permission_declarations as ProjectState["intervention_permission_declarations"])
      : [],
  };
}

function withEmptyRealityDecisionCollections(
  data: Record<string, unknown>
): Pick<ProjectState, "reality_decision_declarations"> {
  return {
    reality_decision_declarations: Array.isArray(data.reality_decision_declarations)
      ? (data.reality_decision_declarations as ProjectState["reality_decision_declarations"])
      : [],
  };
}

function withEmptyInterventionIntentCollections(
  data: Record<string, unknown>
): Pick<ProjectState, "intervention_intent_declarations"> {
  return {
    intervention_intent_declarations: Array.isArray(
      data.intervention_intent_declarations
    )
      ? (data.intervention_intent_declarations as ProjectState["intervention_intent_declarations"])
      : [],
  };
}

function withEmptyInterventionCommitmentCollections(
  data: Record<string, unknown>
): Pick<ProjectState, "intervention_commitment_declarations"> {
  return {
    intervention_commitment_declarations: Array.isArray(
      data.intervention_commitment_declarations
    )
      ? (data.intervention_commitment_declarations as ProjectState["intervention_commitment_declarations"])
      : [],
  };
}

function withEmptyCommitmentAcceptanceCollections(
  data: Record<string, unknown>
): Pick<ProjectState, "intervention_commitment_acceptance_declarations"> {
  return {
    intervention_commitment_acceptance_declarations: Array.isArray(
      data.intervention_commitment_acceptance_declarations
    )
      ? (data.intervention_commitment_acceptance_declarations as ProjectState["intervention_commitment_acceptance_declarations"])
      : [],
  };
}

function withEmptyCommitmentTemporalTermCollections(
  data: Record<string, unknown>
): Pick<ProjectState, "intervention_commitment_temporal_term_declarations"> {
  return {
    intervention_commitment_temporal_term_declarations: Array.isArray(
      data.intervention_commitment_temporal_term_declarations
    )
      ? (data.intervention_commitment_temporal_term_declarations as ProjectState["intervention_commitment_temporal_term_declarations"])
      : [],
  };
}

function withEmptyResourceReservationCollections(
  data: Record<string, unknown>
): Pick<ProjectState, "intervention_resource_reservation_declarations"> {
  return {
    intervention_resource_reservation_declarations: Array.isArray(
      data.intervention_resource_reservation_declarations
    )
      ? (data.intervention_resource_reservation_declarations as ProjectState["intervention_resource_reservation_declarations"])
      : [],
  };
}

function migrateV0124ToV0125(data: Record<string, unknown>): ProjectState {
  const migrated = structuredClone(data) as unknown as ProjectState;
  migrated.schema_version = SCHEMA_VERSION;
  migrated.reality_decision_declarations = migrated.reality_decision_declarations.map(decl => ({
    ...decl, snapshot_verification: legacyDecisionSnapshotVerification(decl),
  }));
  const validation = validateProjectState(migrated);
  if (!validation.valid) throw new ValidationError("Migration to v0.1.25 produced invalid ProjectState", validation.errors);
  return migrated;
}

function migrateV0123ToV0124(data: Record<string, unknown>): ProjectState {
  const migrated: ProjectState = {
    ...(data as unknown as ProjectState),
    schema_version: SCHEMA_VERSION_V0124,
    ...withEmptyResourceReservationCollections(data),
  };

  const validation = validateProjectStateV0124(migrated);
  if (!validation.valid) {
    throw new ValidationError(
      "Migration to v0.1.24 produced invalid ProjectState",
      validation.errors
    );
  }

  return migrateV0124ToV0125(migrated as unknown as Record<string, unknown>);
}

function withEmptyResourceCommitmentCollections(
  data: Record<string, unknown>
): Pick<ProjectState, "intervention_resource_commitment_declarations"> {
  return {
    intervention_resource_commitment_declarations: Array.isArray(
      data.intervention_resource_commitment_declarations
    )
      ? (data.intervention_resource_commitment_declarations as ProjectState["intervention_resource_commitment_declarations"])
      : [],
  };
}

function migrateV0122ToV0123(data: Record<string, unknown>): ProjectState {
  const migrated: ProjectState = {
    ...(data as unknown as ProjectState),
    schema_version: SCHEMA_VERSION_V0123,
    ...withEmptyResourceCommitmentCollections(data),
  };

  const validation = validateProjectStateV0123(migrated);
  if (!validation.valid) {
    throw new ValidationError(
      "Migration to v0.1.23 produced invalid ProjectState",
      validation.errors
    );
  }

  return migrateV0123ToV0124(migrated as unknown as Record<string, unknown>);
}

function withEmptyCommitmentConditionalTermCollections(
  data: Record<string, unknown>
): Pick<ProjectState, "intervention_commitment_conditional_term_declarations"> {
  return {
    intervention_commitment_conditional_term_declarations: Array.isArray(
      data.intervention_commitment_conditional_term_declarations
    )
      ? (data.intervention_commitment_conditional_term_declarations as ProjectState["intervention_commitment_conditional_term_declarations"])
      : [],
  };
}

function migrateV0121ToV0122(data: Record<string, unknown>): ProjectState {
  const migrated: ProjectState = {
    ...(data as unknown as ProjectState),
    schema_version: SCHEMA_VERSION_V0122,
    ...withEmptyCommitmentConditionalTermCollections(data),
  };

  const validation = validateProjectStateV0122(migrated);
  if (!validation.valid) {
    throw new ValidationError(
      "Migration to v0.1.22 produced invalid ProjectState",
      validation.errors
    );
  }

  return migrateV0122ToV0123(migrated as unknown as Record<string, unknown>);
}

function migrateV0120ToV0121(data: Record<string, unknown>): ProjectState {
  const migrated: ProjectState = {
    ...(data as unknown as ProjectState),
    schema_version: SCHEMA_VERSION_V0121,
    ...withEmptyCommitmentTemporalTermCollections(data),
  };

  const validation = validateProjectStateV0121(migrated);
  if (!validation.valid) {
    throw new ValidationError(
      "Migration to v0.1.21 produced invalid ProjectState",
      validation.errors
    );
  }

  return migrateV0121ToV0122(migrated as unknown as Record<string, unknown>);
}

function migrateV0119ToV0120(data: Record<string, unknown>): ProjectState {
  const migrated: ProjectState = {
    ...(data as unknown as ProjectState),
    schema_version: SCHEMA_VERSION_V0120,
    ...withEmptyCommitmentAcceptanceCollections(data),
  };

  const validation = validateProjectStateV0120(migrated);
  if (!validation.valid) {
    throw new ValidationError(
      "Migration to v0.1.20 produced invalid ProjectState",
      validation.errors
    );
  }

  return migrateV0120ToV0121(migrated as unknown as Record<string, unknown>);
}

function migrateV0118ToV0119(data: Record<string, unknown>): ProjectState {
  const migrated: ProjectState = {
    ...(data as unknown as ProjectState),
    schema_version: SCHEMA_VERSION_V0119,
    ...withEmptyInterventionCommitmentCollections(data),
  };

  const validation = validateProjectStateV0119(migrated);
  if (!validation.valid) {
    throw new ValidationError(
      "Migration to v0.1.19 produced invalid ProjectState",
      validation.errors
    );
  }

  return migrateV0119ToV0120(migrated as unknown as Record<string, unknown>);
}

function migrateV0117ToV0118(data: Record<string, unknown>): ProjectState {
  const migrated: ProjectState = {
    ...(data as unknown as ProjectState),
    schema_version: SCHEMA_VERSION_V0118,
    ...withEmptyInterventionIntentCollections(data),
  };

  const validation = validateProjectStateV0118(migrated);
  if (!validation.valid) {
    throw new ValidationError(
      "Migration to v0.1.18 produced invalid ProjectState",
      validation.errors
    );
  }

  return migrateV0118ToV0119(migrated as unknown as Record<string, unknown>);
}

function migrateV0116ToV0117(data: Record<string, unknown>): ProjectState {
  const migrated: ProjectState = {
    ...(data as unknown as ProjectState),
    schema_version: SCHEMA_VERSION_V0117,
    ...withEmptyRealityDecisionCollections(data),
  };

  const validation = validateProjectStateV0117(migrated);
  if (!validation.valid) {
    throw new ValidationError(
      "Migration to v0.1.17 produced invalid ProjectState",
      validation.errors
    );
  }

  return migrateV0117ToV0118(migrated as unknown as Record<string, unknown>);
}

function migrateV0115ToV0116(data: Record<string, unknown>): ProjectState {
  const migrated: ProjectState = {
    ...(data as unknown as ProjectState),
    schema_version: SCHEMA_VERSION_V0116,
    ...withEmptyActorCandidateCollections(data),
  };

  const validation = validateProjectStateV0116(migrated);
  if (!validation.valid) {
    throw new ValidationError(
      "Migration to v0.1.16 produced invalid ProjectState",
      validation.errors
    );
  }

  return migrateV0116ToV0117(migrated as unknown as Record<string, unknown>);
}

function migrateV0114ToV0115(data: Record<string, unknown>): ProjectState {
  const migrated: ProjectState = {
    ...(data as unknown as ProjectState),
    schema_version: SCHEMA_VERSION_V0115,
    ...withEmptyDecisionCollections(data),
  };

  const validation = validateProjectStateV0115(migrated);
  if (!validation.valid) {
    throw new ValidationError(
      "Migration to v0.1.15 produced invalid ProjectState",
      validation.errors
    );
  }

  return migrateV0115ToV0116(migrated as unknown as Record<string, unknown>);
}

function migrateV0113ToV0114(data: Record<string, unknown>): ProjectState {
  const migrated: ProjectState = {
    ...(data as unknown as ProjectState),
    schema_version: SCHEMA_VERSION_V0114,
    ...withEmptyPermissionCollections(data),
  };

  const validation = validateProjectStateV0114(migrated);
  if (!validation.valid) {
    throw new ValidationError(
      "Migration to v0.1.14 produced invalid ProjectState",
      validation.errors
    );
  }

  return migrateV0114ToV0115(migrated as unknown as Record<string, unknown>);
}

function migrateV0112ToV0113(data: Record<string, unknown>): ProjectState {
  const migrated: ProjectState = {
    ...(data as unknown as ProjectState),
    schema_version: SCHEMA_VERSION_V0113,
    ...withEmptyInterventionCollections(data),
  };

  const validation = validateProjectStateV0113(migrated);
  if (!validation.valid) {
    throw new ValidationError(
      "Migration to v0.1.13 produced invalid ProjectState",
      validation.errors
    );
  }

  return migrateV0113ToV0114(migrated as unknown as Record<string, unknown>);
}

function migrateV0111ToV0112(data: Record<string, unknown>): ProjectState {
  const migrated: ProjectState = {
    ...(data as unknown as ProjectState),
    schema_version: SCHEMA_VERSION_V0112,
    ...withEmptyResourceCollections(data),
  };

  const validation = validateProjectStateV0112(migrated);
  if (!validation.valid) {
    throw new ValidationError(
      "Migration to v0.1.12 produced invalid ProjectState",
      validation.errors
    );
  }

  return migrateV0112ToV0113(migrated as unknown as Record<string, unknown>);
}

function migrateV0110ToV0111(data: Record<string, unknown>): ProjectState {
  const migrated: ProjectState = {
    ...(data as unknown as ProjectState),
    schema_version: SCHEMA_VERSION_V0111,
    ...withEmptyCapabilityCollections(data),
  };

  const validation = validateProjectStateV0111(migrated);
  if (!validation.valid) {
    throw new ValidationError(
      "Migration to v0.1.11 produced invalid ProjectState",
      validation.errors
    );
  }

  return migrateV0111ToV0112(migrated as unknown as Record<string, unknown>);
}

function migrateV019ToV010(data: Record<string, unknown>): ProjectState {
  const migrated: ProjectState = {
    ...(data as unknown as ProjectState),
    schema_version: SCHEMA_VERSION_V0110,
    ...withEmptyGovernanceProvenanceCollections(data),
  };

  const validation = validateProjectStateV0110(migrated);
  if (!validation.valid) {
    throw new ValidationError(
      "Migration to v0.1.10 produced invalid ProjectState",
      validation.errors
    );
  }

  return migrateV0110ToV0111(migrated as unknown as Record<string, unknown>);
}

function migrateV018ToV019(data: Record<string, unknown>): ProjectState {
  const migrated: ProjectState = {
    ...(data as unknown as ProjectState),
    schema_version: SCHEMA_VERSION_V019,
    ...withEmptyGovernanceCollections(data),
  };

  const validation = validateProjectStateV019(migrated);
  if (!validation.valid) {
    throw new ValidationError(
      "Migration to v0.1.9 produced invalid ProjectState",
      validation.errors
    );
  }

  return migrateV019ToV010(migrated as unknown as Record<string, unknown>);
}

function migrateV017ToV018(data: Record<string, unknown>): ProjectState {
  const migrated: ProjectState = {
    ...(data as unknown as ProjectState),
    schema_version: SCHEMA_VERSION_V018,
    ...withEmptyImpactMeasureCollections(data),
  };

  const validation = validateProjectStateV018(migrated);
  if (!validation.valid) {
    throw new ValidationError(
      "Migration to v0.1.8 produced invalid ProjectState",
      validation.errors
    );
  }

  return migrateV018ToV019(migrated as unknown as Record<string, unknown>);
}

function migrateV016ToV017(data: Record<string, unknown>): ProjectState {
  const migrated: ProjectState = {
    ...(data as unknown as ProjectState),
    schema_version: SCHEMA_VERSION_V017,
    ...withEmptyImpactCollections(data),
  };

  const validation = validateProjectStateV017(migrated);
  if (!validation.valid) {
    throw new ValidationError(
      "Migration to v0.1.7 produced invalid ProjectState",
      validation.errors
    );
  }

  return migrated;
}

function migrateV015ToV016(data: Record<string, unknown>): ProjectState {
  const migrated: ProjectState = {
    ...(data as unknown as ProjectState),
    schema_version: SCHEMA_VERSION_V016,
    ...withEmptyProspectiveCollections(data),
  };

  const validation = validateProjectStateV016(migrated);
  if (!validation.valid) {
    throw new ValidationError(
      "Migration to v0.1.6 produced invalid ProjectState",
      validation.errors
    );
  }

  return migrated;
}

function migrateV014ToV015(data: Record<string, unknown>): Record<string, unknown> {
  return {
    ...data,
    schema_version: SCHEMA_VERSION_V015,
    ...withEmptyObjectiveCollections(data),
  };
}

function migrateV013ToV014(data: Record<string, unknown>): Record<string, unknown> {
  return {
    ...data,
    schema_version: SCHEMA_VERSION_V014,
    ...withEmptyReferenceConditions(data),
  };
}

function migrateV012ToV013(data: Record<string, unknown>): Record<string, unknown> {
  return {
    ...data,
    schema_version: SCHEMA_VERSION_V013,
    ...withEmptyEpistemicCollections(data),
  };
}

function migrateV011ToV012(data: Record<string, unknown>): Record<string, unknown> {
  return {
    ...data,
    schema_version: SCHEMA_VERSION_V012,
    ...withEmptyRealityCollections(data),
  };
}

/** Upgrade any supported ProjectState to canonical v0.1.25 */
export function migrateProjectState(data: unknown): ProjectState {
  if (!isRecord(data)) {
    throw new ValidationError("ProjectState must be an object");
  }

  if (data.schema_version === SCHEMA_VERSION) {
    const validation = validateProjectState(data);
    if (!validation.valid) {
      throw new ValidationError("Invalid v0.1.25 ProjectState", validation.errors);
    }
    for (const decl of (data as unknown as ProjectState).reality_decision_declarations) getDecisionSnapshotVerification(decl);
    return data as unknown as ProjectState;
  }

  if (data.schema_version === SCHEMA_VERSION_V0124) {
    const validation = validateProjectStateV0124(data);
    if (!validation.valid) throw new ValidationError("Invalid v0.1.24 ProjectState", validation.errors);
    return migrateV0124ToV0125(data);
  }

  if (data.schema_version === SCHEMA_VERSION_V0123) {
    const midValidation = validateProjectStateV0123(data);
    if (!midValidation.valid) {
      throw new ValidationError("Invalid v0.1.23 ProjectState", midValidation.errors);
    }
    return migrateV0123ToV0124(data);
  }

  if (data.schema_version === SCHEMA_VERSION_V0122) {
    const midValidation = validateProjectStateV0122(data);
    if (!midValidation.valid) {
      throw new ValidationError("Invalid v0.1.22 ProjectState", midValidation.errors);
    }
    return migrateV0122ToV0123(data);
  }

  if (data.schema_version === SCHEMA_VERSION_V0121) {
    const midValidation = validateProjectStateV0121(data);
    if (!midValidation.valid) {
      throw new ValidationError("Invalid v0.1.21 ProjectState", midValidation.errors);
    }
    return migrateV0121ToV0122(data);
  }

  if (data.schema_version === SCHEMA_VERSION_V0120) {
    const midValidation = validateProjectStateV0120(data);
    if (!midValidation.valid) {
      throw new ValidationError("Invalid v0.1.20 ProjectState", midValidation.errors);
    }
    return migrateV0120ToV0121(data);
  }

  if (data.schema_version === SCHEMA_VERSION_V0119) {
    const midValidation = validateProjectStateV0119(data);
    if (!midValidation.valid) {
      throw new ValidationError("Invalid v0.1.19 ProjectState", midValidation.errors);
    }
    return migrateV0119ToV0120(data);
  }

  if (data.schema_version === SCHEMA_VERSION_V0118) {
    const midValidation = validateProjectStateV0118(data);
    if (!midValidation.valid) {
      throw new ValidationError("Invalid v0.1.18 ProjectState", midValidation.errors);
    }
    return migrateV0118ToV0119(data);
  }

  if (data.schema_version === SCHEMA_VERSION_V0117) {
    const midValidation = validateProjectStateV0117(data);
    if (!midValidation.valid) {
      throw new ValidationError("Invalid v0.1.17 ProjectState", midValidation.errors);
    }
    return migrateV0117ToV0118(data);
  }

  if (data.schema_version === SCHEMA_VERSION_V0116) {
    const midValidation = validateProjectStateV0116(data);
    if (!midValidation.valid) {
      throw new ValidationError("Invalid v0.1.16 ProjectState", midValidation.errors);
    }
    return migrateV0116ToV0117(data);
  }

  if (data.schema_version === SCHEMA_VERSION_V0115) {
    const midValidation = validateProjectStateV0115(data);
    if (!midValidation.valid) {
      throw new ValidationError("Invalid v0.1.15 ProjectState", midValidation.errors);
    }
    return migrateV0115ToV0116(data);
  }

  if (data.schema_version === SCHEMA_VERSION_V0114) {
    const midValidation = validateProjectStateV0114(data);
    if (!midValidation.valid) {
      throw new ValidationError("Invalid v0.1.14 ProjectState", midValidation.errors);
    }
    return migrateV0114ToV0115(data);
  }

  if (data.schema_version === SCHEMA_VERSION_V0113) {
    const midValidation = validateProjectStateV0113(data);
    if (!midValidation.valid) {
      throw new ValidationError("Invalid v0.1.13 ProjectState", midValidation.errors);
    }
    return migrateV0113ToV0114(data);
  }

  if (data.schema_version === SCHEMA_VERSION_V0112) {
    const midValidation = validateProjectStateV0112(data);
    if (!midValidation.valid) {
      throw new ValidationError("Invalid v0.1.12 ProjectState", midValidation.errors);
    }
    return migrateV0112ToV0113(data);
  }

  if (data.schema_version === SCHEMA_VERSION_V0111) {
    const midValidation = validateProjectStateV0111(data);
    if (!midValidation.valid) {
      throw new ValidationError("Invalid v0.1.11 ProjectState", midValidation.errors);
    }
    return migrateV0111ToV0112(data);
  }

  if (data.schema_version === SCHEMA_VERSION_V0110) {
    const midValidation = validateProjectStateV0110(data);
    if (!midValidation.valid) {
      throw new ValidationError("Invalid v0.1.10 ProjectState", midValidation.errors);
    }
    return migrateV0110ToV0111(data);
  }

  if (data.schema_version === SCHEMA_VERSION_V019) {
    const midValidation = validateProjectStateV019(data);
    if (!midValidation.valid) {
      throw new ValidationError("Invalid v0.1.9 ProjectState", midValidation.errors);
    }
    return migrateV019ToV010(data);
  }

  if (data.schema_version === SCHEMA_VERSION_V018) {
    const midValidation = validateProjectStateV018(data);
    if (!midValidation.valid) {
      throw new ValidationError("Invalid v0.1.8 ProjectState", midValidation.errors);
    }
    return migrateV018ToV019(data);
  }

  if (data.schema_version === SCHEMA_VERSION_V017) {
    const midValidation = validateProjectStateV017(data);
    if (!midValidation.valid) {
      throw new ValidationError("Invalid v0.1.7 ProjectState", midValidation.errors);
    }
    return migrateV017ToV018(data);
  }

  if (data.schema_version === SCHEMA_VERSION_V016) {
    const midValidation = validateProjectStateV016(data);
    if (!midValidation.valid) {
      throw new ValidationError("Invalid v0.1.6 ProjectState", midValidation.errors);
    }
    return migrateV017ToV018(
      migrateV016ToV017(data) as unknown as Record<string, unknown>
    );
  }

  if (data.schema_version === SCHEMA_VERSION_V015) {
    const midValidation = validateProjectStateV015(data);
    if (!midValidation.valid) {
      throw new ValidationError("Invalid v0.1.5 ProjectState", midValidation.errors);
    }
    return migrateV017ToV018(
      migrateV016ToV017(
        migrateV015ToV016(data) as unknown as Record<string, unknown>
      ) as unknown as Record<string, unknown>
    );
  }

  if (data.schema_version === SCHEMA_VERSION_V014) {
    const midValidation = validateProjectStateV014(data);
    if (!midValidation.valid) {
      throw new ValidationError("Invalid v0.1.4 ProjectState", midValidation.errors);
    }
    return migrateV017ToV018(
      migrateV016ToV017(
        migrateV015ToV016(migrateV014ToV015(data)) as unknown as Record<string, unknown>
      ) as unknown as Record<string, unknown>
    );
  }

  if (data.schema_version === SCHEMA_VERSION_V013) {
    const midValidation = validateProjectStateV013(data);
    if (!midValidation.valid) {
      throw new ValidationError("Invalid v0.1.3 ProjectState", midValidation.errors);
    }
    return migrateV017ToV018(
      migrateV016ToV017(
        migrateV015ToV016(
          migrateV014ToV015(migrateV013ToV014(data))
        ) as unknown as Record<string, unknown>
      ) as unknown as Record<string, unknown>
    );
  }

  if (data.schema_version === SCHEMA_VERSION_V012) {
    const midValidation = validateProjectStateV012(data);
    if (!midValidation.valid) {
      throw new ValidationError("Invalid v0.1.2 ProjectState", midValidation.errors);
    }
    return migrateV017ToV018(
      migrateV016ToV017(
        migrateV015ToV016(
          migrateV014ToV015(migrateV013ToV014(migrateV012ToV013(data)))
        ) as unknown as Record<string, unknown>
      ) as unknown as Record<string, unknown>
    );
  }

  if (data.schema_version === SCHEMA_VERSION_V011) {
    const midValidation = validateProjectStateV011(data);
    if (!midValidation.valid) {
      throw new ValidationError("Invalid v0.1.1 ProjectState", midValidation.errors);
    }
    return migrateV017ToV018(
      migrateV016ToV017(
        migrateV015ToV016(
          migrateV014ToV015(
            migrateV013ToV014(migrateV012ToV013(migrateV011ToV012(data)))
          )
        ) as unknown as Record<string, unknown>
      ) as unknown as Record<string, unknown>
    );
  }

  if (data.schema_version !== LEGACY_SCHEMA_VERSION) {
    throw new ValidationError(
      `Unsupported schema_version: ${String(data.schema_version)}`
    );
  }

  const legacyValidation = validateLegacyProjectState(data);
  if (!legacyValidation.valid) {
    throw new ValidationError("Invalid v0.1.0 ProjectState", legacyValidation.errors);
  }

  const asV011: Record<string, unknown> = {
    ...data,
    schema_version: SCHEMA_VERSION_V011,
    current_state: migrateCurrentState(data.current_state),
    next_actions: migrateNextActions(data.next_actions),
    reference_docs: Array.isArray(data.reference_docs) ? data.reference_docs : [],
    observations: Array.isArray(data.observations) ? data.observations : [],
    judgments: Array.isArray(data.judgments) ? data.judgments : [],
  };

  return migrateV017ToV018(
    migrateV016ToV017(
      migrateV015ToV016(
        migrateV014ToV015(
          migrateV013ToV014(migrateV012ToV013(migrateV011ToV012(asV011)))
        )
      ) as unknown as Record<string, unknown>
    ) as unknown as Record<string, unknown>
  );
}

/** Normalize any supported ProjectState to canonical v0.1.25 */
export function normalizeProjectState(data: unknown): ProjectState {
  return migrateProjectState(data);
}
