/**
 * Reality Core v0.7 — Resource Contention Discovery types (GROUND-038).
 *
 * Derived only. Not persisted.
 * Finding ≠ Verdict. Structural Resource Finding ≠ PROBLEM / NEED / BLOCKER / RISK.
 * Finding order is serialization/determinism only — not Attention ranking.
 * Must not import state-engine / file-store / studio.
 */

import type { ResourceReservationDeclaredCapacityRelation } from "./resource-reservation-capacity-pressure-types.js";
import type { ResourceReservationCapacityPressureBasisAt } from "./resource-reservation-capacity-pressure-types.js";
import type { ResourceReservationContentionAssessment } from "./resource-reservation-contention-types.js";

/**
 * Structural Resource Discovery kinds.
 * Not conflict / overallocation / Capacity-exceeded / shortage verdicts.
 * Kind order below is determinism only — not ranking.
 */
export type ResourceContentionFindingKind =
  | "RESOURCE_RESERVATION_REPRESENTATION_AMBIGUITY"
  | "RESOURCE_RESERVATION_OVERLAP_PRESENT"
  | "RESOURCE_CAPACITY_BASIS_MISSING"
  | "RESOURCE_CAPACITY_RELATION_DIVERGENCE"
  | "RESOURCE_LOAD_ABOVE_DECLARED_CAPACITY_BASIS";

export type ResourceContentionFindingBasis =
  | {
      kind: "RESERVATION_OVERLAP";
      overlap_candidate_keys: string[];
      reservation_position_keys: string[];
      reservation_declaration_ids: string[];
    }
  | {
      kind: "RESERVATION_REPRESENTATION_AMBIGUITY";
      reservation_position_keys: string[];
      representation_keys: string[];
      reservation_declaration_ids: string[];
      has_scope_divergence: boolean;
      has_amount_divergence: boolean;
      has_window_divergence: boolean;
      has_coverage_ambiguity_at: boolean;
      has_scope_or_amount_ambiguity_at: boolean;
    }
  | {
      kind: "CAPACITY_RELATION_DIVERGENCE";
      comparison_keys: string[];
      capacity_representation_keys: string[];
      relation_values: ResourceReservationDeclaredCapacityRelation[];
    }
  | {
      kind: "LOAD_ABOVE_DECLARED_CAPACITY_BASIS";
      comparison_keys: string[];
      capacity_representation_keys: string[];
    }
  | {
      kind: "CAPACITY_BASIS_MISSING";
      reservation_load_status: "COMPLETE_NUMERIC_COMPOSITION";
    };

export type ResourceContentionDiscoveryModelLimitation =
  | "EFFECTIVE_RESOURCE_RESERVATION_NOT_MODELED"
  | "EFFECTIVE_RESOURCE_CAPACITY_NOT_MODELED"
  | "RESOURCE_RESERVATION_AUTHORITY_NOT_MODELED"
  | "RESOURCE_CAPACITY_AUTHORITY_NOT_MODELED"
  | "RESOURCE_USE_PERMISSION_NOT_MODELED"
  | "RESERVATION_CONFLICT_ADJUDICATION_NOT_MODELED"
  | "DOUBLE_BOOKING_VERDICT_NOT_MODELED"
  | "OVERALLOCATION_VERDICT_NOT_MODELED"
  | "RESOURCE_CAPACITY_PRECEDENCE_NOT_MODELED"
  | "RESOURCE_FREE_QUANTITY_NOT_MODELED"
  | "RESOURCE_REMAINING_QUANTITY_NOT_MODELED"
  | "REQUIREMENT_SATISFACTION_NOT_MODELED"
  | "EFFECTIVE_FEASIBILITY_NOT_MODELED"
  | "DISCOVERY_PRIORITY_NOT_MODELED"
  | "ATTENTION_NOT_MODELED"
  | "AUTOMATIC_INQUIRY_BRIDGE_NOT_MODELED"
  | "AUTOMATIC_DECISION_BRIDGE_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * One structurally notable Resource Discovery finding.
 * Descriptive only — not ranking, Recommendation, or Action.
 */
export interface ResourceContentionFinding {
  key: string;
  kind: ResourceContentionFindingKind;
  resource_declaration_id: string;
  at: string;
  basis: ResourceContentionFindingBasis;
  summary: string;
  model_limitations: ResourceContentionDiscoveryModelLimitation[];
}

export interface ResourceContentionDiscoveryAssessment {
  resource_declaration_id: string;
  at: string;
  contention: ResourceReservationContentionAssessment;
  capacity_pressure_basis: ResourceReservationCapacityPressureBasisAt;
  findings: ResourceContentionFinding[];
  has_findings: boolean;
  model_limitations: ResourceContentionDiscoveryModelLimitation[];
}
