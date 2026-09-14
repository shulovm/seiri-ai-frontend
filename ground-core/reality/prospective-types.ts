/**
 * Reality Core v0.7 — Prospective Core assessment types (GROUND-015).
 *
 * Derived read models only. No RISK / OPPORTUNITY / priority / fusion.
 */

import type { ReferenceKind } from "../types.js";
import type {
  FutureScenario,
  ScenarioLikelihoodEstimate,
  ScenarioStateProjection,
} from "../types.js";

export type ProjectedReferenceComparisonResult =
  | "MATCH"
  | "DEVIATES"
  | "UNSUPPORTED_COMPARISON";

export interface ProjectedReferenceComparison {
  scenario_id: string;
  projection_id: string;
  subject_id: string;
  state_kind: string;
  projected_for: string;
  reference_condition_id: string;
  reference_kind: ReferenceKind;
  projected_value_key: string;
  result: ProjectedReferenceComparisonResult;
}

export type ProjectedReferenceFindingKind =
  | "PROJECTED_ACCEPTABLE_DEVIATION"
  | "PROJECTED_REFERENCE_CONFLICT"
  | "PROJECTED_UNSUPPORTED_COMPARISON"
  | "PROJECTED_EXPECTED_DEVIATION"
  | "PROJECTED_DESIRED_GAP";

export interface ProjectedReferenceFinding {
  key: string;
  kind: ProjectedReferenceFindingKind;
  scenario_id: string;
  projection_id: string;
  subject_id: string;
  state_kind: string;
  projected_for: string;
  reference_condition_ids: string[];
  reference_kind: ReferenceKind | null;
  projected_value_key: string;
  comparison_results: ProjectedReferenceComparisonResult[];
  reference_basis_contested: boolean;
  reference_conflict_key?: string;
}

export interface ScenarioProjectionConflict {
  key: string;
  scenario_id: string;
  subject_id: string;
  state_kind: string;
  projected_for: string;
  projection_ids: string[];
  value_keys: string[];
}

export type ScenarioLikelihoodStatus = "NO_ESTIMATES" | "ESTIMATED";

export interface ScenarioLikelihoodAssessment {
  scenario_id: string;
  estimates: ScenarioLikelihoodEstimate[];
  status: ScenarioLikelihoodStatus;
  probability_values: number[];
  min_probability: number | null;
  max_probability: number | null;
  has_multiple_values: boolean;
  source_summary: string[];
}

export interface ScenarioReferenceAssessment {
  scenario_id: string;
  projection_assessments: ScenarioStateProjection[];
  projected_reference_comparisons: ProjectedReferenceComparison[];
  projected_reference_findings: ProjectedReferenceFinding[];
  projection_conflicts: ScenarioProjectionConflict[];
  has_projected_acceptable_deviation: boolean;
  has_reference_conflict: boolean;
  has_projection_conflict: boolean;
  has_unsupported_comparison: boolean;
}

export interface FutureScenarioAssessment {
  scenario: FutureScenario;
  projections: ScenarioStateProjection[];
  projection_conflicts: ScenarioProjectionConflict[];
  likelihood_assessment: ScenarioLikelihoodAssessment;
  reference_assessment: ScenarioReferenceAssessment;
}

export type {
  FutureScenario,
  ScenarioLikelihoodEstimate,
  ScenarioStateProjection,
};
