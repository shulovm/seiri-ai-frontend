/** Current reference resolution and independent evidence composition. Derived only. */
import type {
  AvailabilityEvidenceContract, ContributionAvailabilityApplicabilityDeclaration,
  ContributionQuantityEvaluationState,
} from "./contribution-availability-applicability-types.js";
import type {
  CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceState,
  CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateResourceAssessment,
  CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateSetAssessment,
} from "./canonical-selected-source-aggregated-declared-resource-availability-evidence-state-types.js";

/** Reference resolution only. These are not evidence polarity or readiness states. */
export type ContributionAvailabilityReferenceStatus =
  | "NO_CURRENT_RESOURCE_EVIDENCE_ASSESSMENT"
  | "NO_CURRENT_INTERPRETATION_CONTRACT"
  | "CURRENT_AVAILABILITY_CONTRACT_MISMATCH"
  | "CURRENT_CONTRACT_EVIDENCE_REFERENCED";

export interface ContributionAvailabilityReferenceAssessment {
  applicability_declaration: ContributionAvailabilityApplicabilityDeclaration;
  current_availability_evidence_state_set: CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateSetAssessment;
  evaluation_at: string;
  resource_assessment: CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceStateResourceAssessment | null;
  current_contract: AvailabilityEvidenceContract | null;
  status: ContributionAvailabilityReferenceStatus;
  referenced_evidence_state: CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceState | null;
}

/** Three exact axes. No overall polarity, resolvedness, readiness or numeric quantity. */
export interface ContributionQuantityAvailabilityEvidenceComposition {
  key: string;
  applicability_declaration: ContributionAvailabilityApplicabilityDeclaration;
  quantity_evaluation_state: ContributionQuantityEvaluationState;
  availability_reference_assessment: ContributionAvailabilityReferenceAssessment;
  capacity_compatibility_dimension: ContributionQuantityEvaluationState["capacity_compatibility_dimension"];
  required_amount_compatibility_dimension: ContributionQuantityEvaluationState["required_amount_compatibility_dimension"];
  availability_evidence_dimension: CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceState;
}

/** No composition means a reference prerequisite is absent, never a negative verdict. */
export interface ContributionQuantityAvailabilityCompositionAssessment {
  availability_reference_assessment: ContributionAvailabilityReferenceAssessment;
  quantity_evaluation_state: ContributionQuantityEvaluationState;
  composition: ContributionQuantityAvailabilityEvidenceComposition | null;
}
