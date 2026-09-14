/**
 * Reality Core v0.7 — Impact Measurement assessment types (GROUND-018).
 *
 * Derived only. Not persisted.
 * No severity / impact_score / expected_loss / unit conversion / aggregation.
 */

import type {
  ImpactDirection,
  ImpactMeasure,
  ImpactMeasureDeclaration,
  ReferenceDeclarer,
} from "../types.js";
import type { ImpactScopeAssessment } from "./impact-types.js";

export interface ImpactMetricAssessment {
  affected_entity_id: string;
  dimension: string;
  direction: ImpactDirection;

  metric_key: string;
  unit: string;

  impact_declaration_ids: string[];
  measure_declaration_ids: string[];

  measures: ImpactMeasure[];

  point_values: number[];
  ranges: Array<{ min: number; max: number }>;

  has_multiple_declared_measures: boolean;
  has_measure_divergence: boolean;

  declarers: ReferenceDeclarer[];
}

export interface ImpactMeasurementAssessment {
  impact_scope: ImpactScopeAssessment;

  metric_assessments: ImpactMetricAssessment[];

  metric_keys: string[];
  units: string[];

  measure_declaration_ids: string[];

  /**
   * No applicable ImpactMeasureDeclaration for this Impact scope/time.
   * Does NOT mean zero impact / safe / no harm in Reality.
   */
  has_measurements: boolean;
  has_measure_divergence: boolean;
  has_multiple_metrics: boolean;
  has_multiple_units: boolean;
}
