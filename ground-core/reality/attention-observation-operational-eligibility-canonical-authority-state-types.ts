/**
 * Reality Core v0.7 — Attention Observation Operational Eligibility
 * Canonical Authority State types (GROUND-116).
 *
 * Derived only. Not persisted.
 *
 * GROUND-115 Authority Evidence Evaluation State Interpretation Basis
 * → Canonical Observation-Context AUTHORITY State only.
 *
 * EXPLICITLY_INTERPRETED_* ≠ effective/legal Authority
 * UNRESOLVED_NO_POLICY ≠ negative Authority
 * UNRESOLVED_NO_MAPPING ≠ negative Authority
 * canonical Authority State ≠ OE AUTHORITY Satisfaction
 */

import type {
  AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisAssessment,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisStatus,
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisSetAssessment,
} from "./attention-observation-operational-eligibility-authority-evidence-evaluation-state-interpretation-basis-types.js";
import type { AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretation } from "./attention-observation-operational-eligibility-authority-evidence-evaluation-state-interpretation-policy-types.js";
import type { AuthorityPower, GovernanceScope } from "../types.js";

export type AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue =
  | "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE"
  | "EXPLICITLY_INTERPRETED_AUTHORITY_NEGATIVE"
  | "UNRESOLVED_NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_POLICY"
  | "UNRESOLVED_NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE";

export interface AttentionObservationOperationalEligibilityCanonicalAuthorityStateBasis {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "AUTHORITY";
  authority_observation_context_binding_key: string;
  authority_holder_entity_id: string;
  authority_power: AuthorityPower;
  governance_scope: GovernanceScope;
  governance_scope_key: string;
  authority_evaluation_instant_key: string;
  authority_evaluation_at: string;
  authority_evidence_evaluation_state_key: string;
  authority_evidence_evaluation_state_basis_key: string;
  authority_evidence_evaluation_state_interpretation_basis_status: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisStatus;
  authority_evidence_evaluation_state_interpretation_basis_key: string | null;
  authority_evidence_evaluation_state_interpretation_policy_key: string | null;
  interpretation: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretation | null;
  canonical_authority_state_value: AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue;
}

export interface AttentionObservationOperationalEligibilityCanonicalAuthorityState {
  key: string;
  candidate_key: string;
  observation_need_key: string;
  capability_requirement_set_key: string;
  dimension: "AUTHORITY";
  authority_observation_context_binding_key: string;
  authority_holder_entity_id: string;
  authority_power: AuthorityPower;
  governance_scope_key: string;
  authority_evaluation_at: string;
  value: AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue;
  canonical_authority_state_basis_key: string;
}

export type AttentionObservationOperationalEligibilityCanonicalAuthorityStateCandidateStatus =
  | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  | "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  | "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED"
  | "CANONICAL_AUTHORITY_STATES_PRESENT";

export type AttentionObservationOperationalEligibilityCanonicalAuthorityStateModelLimitation =
  | "EFFECTIVE_AUTHORITY_NOT_MODELED"
  | "LEGAL_AUTHORITY_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_POLICY_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_RESULT_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_EVALUATION_STATE_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_INTERPRETATION_POLICY_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_INTERPRETATION_BASIS_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_AUTHORITY_DIMENSION_SATISFACTION_STATE_NOT_MODELED"
  | "GENERIC_OPERATIONAL_ELIGIBILITY_DIMENSION_SOURCE_UNION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED"
  | "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED"
  | "CAN_EXECUTE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

export interface AttentionCandidateObservationOperationalEligibilityCanonicalAuthorityStateAssessment {
  candidate_key: string;
  authority_evidence_evaluation_state_interpretation_basis_assessment: AttentionCandidateObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisAssessment;
  status: AttentionObservationOperationalEligibilityCanonicalAuthorityStateCandidateStatus;
  canonical_authority_state_bases: AttentionObservationOperationalEligibilityCanonicalAuthorityStateBasis[];
  canonical_authority_states: AttentionObservationOperationalEligibilityCanonicalAuthorityState[];
  has_canonical_authority_states: boolean;
  has_resolved_canonical_authority_states: boolean;
  has_unresolved_canonical_authority_states: boolean;
  has_explicitly_interpreted_authority_positive_states: boolean;
  has_explicitly_interpreted_authority_negative_states: boolean;
  model_limitations: AttentionObservationOperationalEligibilityCanonicalAuthorityStateModelLimitation[];
}

export interface AttentionObservationOperationalEligibilityCanonicalAuthorityStateEvalInput {
  authority_evidence_evaluation_state_interpretation_basis_set: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisSetAssessment;
}

export interface AttentionObservationOperationalEligibilityCanonicalAuthorityStateSetAssessment {
  authority_evidence_evaluation_state_interpretation_basis_set: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisSetAssessment;
  candidate_assessments: AttentionCandidateObservationOperationalEligibilityCanonicalAuthorityStateAssessment[];
  has_canonical_authority_states: boolean;
  has_resolved_canonical_authority_states: boolean;
  has_unresolved_canonical_authority_states: boolean;
  has_explicitly_interpreted_authority_positive_states: boolean;
  has_explicitly_interpreted_authority_negative_states: boolean;
  model_limitations: AttentionObservationOperationalEligibilityCanonicalAuthorityStateModelLimitation[];
}
