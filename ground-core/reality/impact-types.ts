/**
 * Reality Core v0.7 — Impact Core assessment types (GROUND-017).
 *
 * Derived only. Not persisted.
 * No severity / magnitude / priority / OPPORTUNITY / causality.
 */

import type { ReferenceDeclarer } from "../types.js";

export interface ImpactPosition {
  affected_entity_id: string;
  dimension: string;
  direction: "ADVERSE" | "BENEFICIAL";
  declaration_ids: string[];
  declarers: ReferenceDeclarer[];
}

export interface ImpactDirectionConflict {
  key: string;
  reference_condition_id: string;
  affected_entity_id: string;
  dimension: string;
  at: string;
  adverse_declaration_ids: string[];
  beneficial_declaration_ids: string[];
}

export interface ImpactScopeAssessment {
  basis_reference_condition_id: string;
  deviation_subject_id: string;
  state_kind: string;
  at: string;

  applicable_declarations: import("../types.js").ImpactDeclaration[];

  positions: ImpactPosition[];
  direction_conflicts: ImpactDirectionConflict[];

  affected_entity_ids: string[];
  adverse_affected_entity_ids: string[];
  beneficial_affected_entity_ids: string[];

  impact_dimensions: string[];

  has_declared_affectedness: boolean;
  has_adverse_affectedness: boolean;
  has_beneficial_affectedness: boolean;
  has_cross_entity_affectedness: boolean;
  has_direction_conflict: boolean;
}
