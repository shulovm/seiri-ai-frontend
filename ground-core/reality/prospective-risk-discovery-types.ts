/**
 * Reality Core v0.7 — Prospective Risk Discovery types (GROUND-016).
 *
 * Derived only. Not persisted.
 * ProspectiveRiskFinding ≠ StudioRiskProject / legacy risk_* vocabulary.
 * No severity / risk_score / priority / probability fusion.
 */

import type { ReferenceDeclarer } from "../types.js";
import type { FutureScenarioAssessment } from "./prospective-types.js";

/** Scenario-level likelihood scope — NOT projection_probability or risk_probability. */
export type ProspectiveLikelihoodScope = "SCENARIO";

export interface ProspectiveRiskProvenance {
  scenario_declarer: ReferenceDeclarer;
  reference_declarer: ReferenceDeclarer;
  likelihood_estimators: ReferenceDeclarer[];
}

export interface ProspectiveRiskFindingDetails {
  note?: string;
}

/**
 * Reference-relative prospective RISK finding.
 * Distinct from Studio `risk_kind` / `risk_story` legacy read models.
 */
export interface ProspectiveRiskFinding {
  key: string;
  kind: "RISK";

  scenario_id: string;
  projection_id: string;

  subject_id: string;
  state_kind: string;
  projected_for: string;
  projected_value_key: string;

  reference_condition_id: string;
  reference_kind: "ACCEPTABLE";

  projected_comparison_result: "DEVIATES";

  likelihood_scope: ProspectiveLikelihoodScope;

  all_likelihood_estimate_ids: string[];
  positive_likelihood_estimate_ids: string[];
  zero_likelihood_estimate_ids: string[];

  scenario_probability_values: number[];
  positive_probability_values: number[];

  reference_basis_contested: boolean;
  projection_basis_contested: boolean;
  likelihood_estimates_diverge: boolean;
  /** reference_basis_contested || projection_basis_contested */
  basis_contested: boolean;

  provenance: ProspectiveRiskProvenance;
  details: ProspectiveRiskFindingDetails;
}

export interface ProspectiveRiskAssessment {
  scenario_id: string;
  scenario_assessment: FutureScenarioAssessment;
  risk_findings: ProspectiveRiskFinding[];

  has_risk: boolean;
  has_uncontested_risk: boolean;
  has_contested_risk: boolean;
  has_divergent_likelihood_estimates: boolean;

  /**
   * Future unacceptable projection exists but no declared Scenario likelihood.
   * Does NOT mean safe / zero probability / no harm in Reality.
   */
  has_projected_acceptable_deviation_without_likelihood: boolean;

  /**
   * Projected ACCEPTABLE deviation exists but all declared estimates are zero.
   * Does NOT mean Scenario is objectively impossible.
   */
  has_projected_acceptable_deviation_with_only_zero_estimates: boolean;
}
