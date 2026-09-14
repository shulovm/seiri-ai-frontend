/**
 * Reality Core v0.7 — Decision Core I derived types (GROUND-025).
 *
 * DecisionSpace ≠ legacy Decision / selected option / recommendation.
 * Options ≠ feasibility / ranking / actor / Permission verdict.
 */

import type { InterventionSpecificationAssessment } from "./intervention-types.js";
import type {
  DecisionOptionDeclaration,
  DecisionOptionKind,
  DecisionSpaceDeclaration,
  ReferenceDeclarer,
} from "../types.js";

export type DecisionSpaceDeclarationStatus =
  | "DECISION_SPACE_ACTIVE"
  | "DECISION_SPACE_NOT_ACTIVE";

export interface DecisionOptionPosition {
  key: string;
  kind: DecisionOptionKind;
  intervention_id: string | null;
  option_declaration_ids: string[];
  declarers: ReferenceDeclarer[];
  labels: string[];
  has_multiple_declarations: boolean;
}

export interface DecisionOptionAssessment {
  position: DecisionOptionPosition;
  at: string;
  active_option_declaration_ids: string[];
  intervention_specification: InterventionSpecificationAssessment | null;
  intervention_active: boolean | null;
  has_intervention_temporal_mismatch: boolean;
}

export interface DecisionSpaceAssessment {
  decision_space: DecisionSpaceDeclaration;
  at: string;
  declaration_status: DecisionSpaceDeclarationStatus;
  applicable_option_declarations: DecisionOptionDeclaration[];
  option_positions: DecisionOptionPosition[];
  option_assessments: DecisionOptionAssessment[];
  has_options: boolean;
  has_intervention_options: boolean;
  has_do_nothing_option: boolean;
  semantic_option_count: number;
  has_temporal_basis_mismatch: boolean;
  has_intervention_temporal_mismatch: boolean;
}
