/** Runtime-only structural requirements owned by the existing GROUND-133 Binding. */
import type { AttentionObservationOperationalEligibilityResourceReadinessObservationContextBinding } from "./attention-observation-operational-eligibility-resource-readiness-observation-context-binding-types.js";
import type { AvailabilityEvidenceContract, ContributionAvailabilityContext, ContributionQuantityEvaluationState } from "./contribution-availability-applicability-types.js";
import type { ContributionAvailabilityReferenceAssessment } from "./contribution-availability-composition-types.js";
import type { CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceState } from "./canonical-selected-source-aggregated-declared-resource-availability-evidence-state-types.js";

export type ContributionEvidenceBinding = AttentionObservationOperationalEligibilityResourceReadinessObservationContextBinding;
export type ContributionRequiredEvidenceDimension = "CAPACITY_COMPATIBILITY" | "REQUIRED_AMOUNT_COMPATIBILITY" | "AVAILABILITY_EVIDENCE";
/** No specification is not an implicit empty or all-required declaration. */
export interface ContributionRequiredEvidenceSpecification {
  binding_key: string;
  required_dimensions: readonly ContributionRequiredEvidenceDimension[];
}
export interface ContributionRequiredEvidenceDeclaration {
  key: string;
  binding: ContributionEvidenceBinding;
  required_dimensions: readonly ContributionRequiredEvidenceDimension[];
}
/** Current evaluation target is separate from stable requiredness identity. */
export interface ContributionRequiredEvidenceInput {
  declaration: ContributionRequiredEvidenceDeclaration;
  contribution_context: ContributionAvailabilityContext;
  availability_evidence_contract: AvailabilityEvidenceContract | null;
  quantity_evaluation_state: ContributionQuantityEvaluationState | null;
  availability_reference_assessment: ContributionAvailabilityReferenceAssessment | null;
}
/** Independent upstream predicates, never !resolved => unresolved. Exact operands remain primary. */
export interface ContributionEvidenceCanonicalClassification {
  is_applicable: boolean;
  is_resolved: boolean;
  is_unresolved: boolean;
}
type Operands = {
  CAPACITY_COMPATIBILITY: ContributionQuantityEvaluationState["capacity_compatibility_dimension"];
  REQUIRED_AMOUNT_COMPATIBILITY: ContributionQuantityEvaluationState["required_amount_compatibility_dimension"];
  AVAILABILITY_EVIDENCE: CanonicalSelectedSourceAggregatedDeclaredResourceAvailabilityEvidenceState;
};
export type ContributionRequiredEvidenceDimensionAssessment = {
  [D in ContributionRequiredEvidenceDimension]: { dimension: D } & (
    { coverage: "REPRESENTED"; operand: Operands[D]; canonical_classification: ContributionEvidenceCanonicalClassification } |
    { coverage: "NOT_REPRESENTED"; operand: null; canonical_classification: null }
  )
}[ContributionRequiredEvidenceDimension];
/** Counts only. Neither a proposition result nor a completeness/decisiveness verdict. */
export interface ContributionRequiredEvidenceAssessment extends ContributionRequiredEvidenceInput {
  required_dimension_assessments: ContributionRequiredEvidenceDimensionAssessment[];
  summary: {
    required_count: number;
    represented_count: number;
    not_represented_count: number;
    canonically_resolved_count: number;
    canonically_unresolved_count: number;
    canonically_not_applicable_count: number;
  };
}
