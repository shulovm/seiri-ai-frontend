/**
 * Reality Core v0.7 — Resource-aware Situation composition types (GROUND-039).
 *
 * Derived only. Not persisted.
 * Additive Resource Salience surface — does not mutate legacy Situation / SalienceSignal.
 * Resource Salience ≠ priority / Attention / PROBLEM / BLOCKER / RISK.
 * Explicit Resource scope only — no holder-based relevance inference.
 */

import type { Situation, SituationQuery } from "./situation-types.js";
import type {
  ResourceContentionFinding,
  ResourceContentionFindingBasis,
  ResourceContentionFindingKind,
} from "./resource-contention-discovery-types.js";

/**
 * Explicit Resource Situation query.
 * resource_declaration_ids = [] means no Resource scope was supplied —
 * not "scan all project Resources".
 */
export interface ResourceAwareSituationQuery {
  situation_query: SituationQuery;
  resource_declaration_ids: string[];
}

export interface ResourceSituationFindingReference {
  resource_declaration_id: string;
  finding_key: string;
  finding_kind: ResourceContentionFindingKind;
  finding: ResourceContentionFinding;
}

/**
 * Structural Resource Salience surface entry.
 * Eligible for later Attention — not important / urgent / rank.
 */
export interface ResourceSituationSalienceSignal {
  key: string;
  kind: "RESOURCE_CONTENTION_FINDING_PRESENT";
  resource_declaration_id: string;
  resource_finding_key: string;
  resource_finding_kind: ResourceContentionFindingKind;
  basis: ResourceContentionFindingBasis;
}

/**
 * Weak descriptive Resource Salience status.
 * NO_RESOURCE_SALIENCE ≠ healthy. RESOURCE_SALIENCE_PRESENT ≠ unhealthy / ATTEND_NOW.
 */
export type ResourceSituationSalienceStatus =
  | "NO_RESOURCE_SCOPE"
  | "NO_RESOURCE_SALIENCE"
  | "RESOURCE_SALIENCE_PRESENT";

export interface ResourceSituationFacet {
  resource_declaration_id: string;
  findings: ResourceContentionFinding[];
  salience_signals: ResourceSituationSalienceSignal[];
  has_findings: boolean;
}

export type ResourceSituationModelLimitation =
  | "RESOURCE_RELEVANCE_INFERENCE_NOT_MODELED"
  | "RESOURCE_FINDING_TO_BASE_SITUATION_STATUS_NOT_MODELED"
  | "RESOURCE_FINDING_PRIORITY_NOT_MODELED"
  | "RESOURCE_FINDING_SEVERITY_NOT_MODELED"
  | "ATTENTION_NOT_MODELED"
  | "VALUE_OF_INFORMATION_NOT_MODELED"
  | "AUTOMATIC_UNKNOWN_BRIDGE_NOT_MODELED"
  | "AUTOMATIC_INQUIRY_BRIDGE_NOT_MODELED"
  | "AUTOMATIC_OBSERVATION_NEED_BRIDGE_NOT_MODELED"
  | "AUTOMATIC_DECISION_BRIDGE_NOT_MODELED"
  | "AUTOMATIC_INTERVENTION_BRIDGE_NOT_MODELED"
  | "RESOURCE_CONFLICT_ADJUDICATION_NOT_MODELED"
  | "EFFECTIVE_RESOURCE_RESERVATION_NOT_MODELED"
  | "EFFECTIVE_RESOURCE_CAPACITY_NOT_MODELED"
  | "EXECUTION_NOT_MODELED";

/**
 * Additive Resource-aware Situation read model.
 * base_situation is an unchanged GROUND-009 Situation.
 * Resource Salience lives separately — not compressed into QUIET/ACTIVE/UNRESOLVED.
 */
export interface ResourceAwareSituationAssessment {
  query: ResourceAwareSituationQuery;
  base_situation: Situation;
  resource_declaration_ids: string[];
  resource_facets: ResourceSituationFacet[];
  resource_findings: ResourceSituationFindingReference[];
  resource_salience_signals: ResourceSituationSalienceSignal[];
  resource_salience_status: ResourceSituationSalienceStatus;
  has_resource_scope: boolean;
  has_resource_findings: boolean;
  has_resource_salience: boolean;
  model_limitations: ResourceSituationModelLimitation[];
}
