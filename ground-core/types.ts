/** GROUND Core — Project Graph / State Engine types */

export const SCHEMA_VERSION = "0.1.25" as const;
export const SCHEMA_VERSION_V0124 = "0.1.24" as const;
export const SCHEMA_VERSION_V0123 = "0.1.23" as const;
export const SCHEMA_VERSION_V0122 = "0.1.22" as const;
export const SCHEMA_VERSION_V0121 = "0.1.21" as const;
export const SCHEMA_VERSION_V0120 = "0.1.20" as const;
export const SCHEMA_VERSION_V0119 = "0.1.19" as const;
export const SCHEMA_VERSION_V0118 = "0.1.18" as const;
export const SCHEMA_VERSION_V0117 = "0.1.17" as const;
export const SCHEMA_VERSION_V0116 = "0.1.16" as const;
export const SCHEMA_VERSION_V0115 = "0.1.15" as const;
export const SCHEMA_VERSION_V0114 = "0.1.14" as const;
export const SCHEMA_VERSION_V0113 = "0.1.13" as const;
export const SCHEMA_VERSION_V0112 = "0.1.12" as const;
export const SCHEMA_VERSION_V0111 = "0.1.11" as const;
export const SCHEMA_VERSION_V0110 = "0.1.10" as const;
export const SCHEMA_VERSION_V019 = "0.1.9" as const;
export const SCHEMA_VERSION_V018 = "0.1.8" as const;
export const SCHEMA_VERSION_V017 = "0.1.7" as const;
export const SCHEMA_VERSION_V016 = "0.1.6" as const;
export const SCHEMA_VERSION_V015 = "0.1.5" as const;
export const SCHEMA_VERSION_V014 = "0.1.4" as const;
export const SCHEMA_VERSION_V013 = "0.1.3" as const;
export const SCHEMA_VERSION_V012 = "0.1.2" as const;
export const SCHEMA_VERSION_V011 = "0.1.1" as const;
export const LEGACY_SCHEMA_VERSION = "0.1.0" as const;

export type SchemaVersion =
  | typeof SCHEMA_VERSION
  | typeof SCHEMA_VERSION_V0124
  | typeof SCHEMA_VERSION_V0123
  | typeof SCHEMA_VERSION_V0122
  | typeof SCHEMA_VERSION_V0121
  | typeof SCHEMA_VERSION_V0120
  | typeof SCHEMA_VERSION_V0119
  | typeof SCHEMA_VERSION_V0118
  | typeof SCHEMA_VERSION_V0117
  | typeof SCHEMA_VERSION_V0116
  | typeof SCHEMA_VERSION_V0115
  | typeof SCHEMA_VERSION_V0114
  | typeof SCHEMA_VERSION_V0113
  | typeof SCHEMA_VERSION_V0112
  | typeof SCHEMA_VERSION_V0111
  | typeof SCHEMA_VERSION_V0110
  | typeof SCHEMA_VERSION_V019
  | typeof SCHEMA_VERSION_V018
  | typeof SCHEMA_VERSION_V017
  | typeof SCHEMA_VERSION_V016
  | typeof SCHEMA_VERSION_V015
  | typeof SCHEMA_VERSION_V014
  | typeof SCHEMA_VERSION_V013
  | typeof SCHEMA_VERSION_V012
  | typeof SCHEMA_VERSION_V011
  | typeof LEGACY_SCHEMA_VERSION;

export type ProjectStatus = "active" | "paused" | "archived" | "completed";

export interface Project {
  id: string;
  title: string;
  summary: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
  tags?: string[];
}

export type GoalStatus =
  | "proposed"
  | "active"
  | "achieved"
  | "deferred"
  | "abandoned";

export interface Goal {
  id: string;
  project_id: string;
  parent_goal_id: string | null;
  title: string;
  description: string;
  status: GoalStatus;
  priority: 1 | 2 | 3 | 4 | 5;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type GoalEdgeType = "subgoal_of" | "depends_on" | "blocks" | "supports";

export interface GoalEdge {
  id: string;
  project_id: string;
  from_goal_id: string;
  to_goal_id: string;
  edge_type: GoalEdgeType;
  created_at: string;
}

export interface CurrentState {
  id: string;
  project_id: string;
  primary_goal_id: string | null;
  primary_next_action_id: string | null;
  summary: string;
  phase: string | null;
  confidence: number | null;
  updated_at: string;
}

export type BlockerSeverity = "low" | "medium" | "high" | "critical";
export type BlockerStatus = "open" | "mitigated" | "resolved" | "accepted";

export interface Blocker {
  id: string;
  project_id: string;
  goal_id: string | null;
  title: string;
  description: string;
  severity: BlockerSeverity;
  status: BlockerStatus;
  created_at: string;
  updated_at: string;
}

export type NextActionStatus = "pending" | "in_progress" | "done" | "cancelled";

export interface NextAction {
  id: string;
  project_id: string;
  goal_id: string | null;
  blocker_id: string | null;
  depends_on_action_id: string | null;
  title: string;
  description: string | null;
  status: NextActionStatus;
  due_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type DecisionStatus = "active" | "superseded" | "reversed";

export interface Decision {
  id: string;
  project_id: string;
  goal_id: string | null;
  title: string;
  rationale: string;
  alternatives_considered: string[];
  status: DecisionStatus;
  decided_at: string;
  created_at: string;
  updated_at: string;
}

export type HypothesisStatus = "untested" | "testing" | "validated" | "invalidated";

export interface Hypothesis {
  id: string;
  project_id: string;
  goal_id: string | null;
  statement: string;
  status: HypothesisStatus;
  evidence_for: string[];
  evidence_against: string[];
  created_at: string;
  updated_at: string;
}

export type ReferenceDocKind =
  | "design"
  | "schema"
  | "manual_run"
  | "prompt_bible"
  | "other";

export type ReferenceDocStatus = "active" | "archived";

export interface ReferenceDoc {
  id: string;
  project_id: string;
  title: string;
  path: string;
  kind: ReferenceDocKind;
  summary: string;
  status: ReferenceDocStatus;
  created_at: string;
  updated_at: string;
}

export type ObservationSource =
  | "manual"
  | "field_test"
  | "conversation"
  | "system";

export interface Observation {
  id: string;
  project_id: string;
  goal_id: string | null;
  title: string;
  body: string;
  source: ObservationSource;
  observed_at: string;
  created_at: string;
  updated_at: string;
}

export type JudgmentOutcome = "go" | "stop" | "revise" | "hold";

export interface Judgment {
  id: string;
  project_id: string;
  goal_id: string | null;
  observation_id: string | null;
  title: string;
  outcome: JudgmentOutcome;
  rationale: string;
  decided_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Reality Core v0.7 — Ontic Foundation
 *
 * Entity ≠ Event ≠ State.
 * Legacy Observation / Decision / Claim / Worldline are NOT these types.
 * EpistemicObservation / Evidence / Claim are epistemic — NOT ontic.
 */

/** Something that persists through time (identity survives state change). */
export interface RealityEntity {
  id: string;
  project_id: string;
  /** Open taxonomy (person, place, asset, …). Not a closed enum yet. */
  kind: string;
  label: string;
  /** Identity-bearing attributes only — mutable condition belongs in RealityState. */
  attrs?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/**
 * Something that happened (bounded occurrence).
 * occurred_at = when Reality says it happened (null if unknown).
 * recorded_at = when GROUND accepted/persisted the record.
 */
export interface RealityEvent {
  id: string;
  project_id: string;
  kind: string;
  /** Referenced RealityEntity ids; each must exist when present. */
  subject_ids: string[];
  occurred_at: string | null;
  recorded_at: string;
  summary: string;
  attrs?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/** JSON-compatible state body (not Claim/Observation/Prediction). */
export type RealityStateValue =
  | string
  | number
  | boolean
  | null
  | RealityStateValue[]
  | { [key: string]: RealityStateValue };

/**
 * Properties of Reality effective for a subject over a temporal interval.
 * valid_from / valid_until = effectiveness window (null until = open-ended).
 * recorded_at = when GROUND accepted this state record.
 */
export interface RealityState {
  id: string;
  project_id: string;
  subject_id: string;
  kind: string;
  value: RealityStateValue;
  valid_from: string;
  valid_until: string | null;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Reality Core v0.7 — Epistemic Core I
 *
 * EpistemicObservation ≠ RealityState
 * Claim ≠ RealityState / RealityEvent
 * Evidence ≠ truth
 */

export type EpistemicSourceKind =
  | "human"
  | "organization"
  | "sensor"
  | "satellite"
  | "api"
  | "document"
  | "ai_model"
  | "system";

/** Smallest provenance contract: where did this epistemic record come from? */
export interface EpistemicProvenance {
  kind: EpistemicSourceKind;
  /** Optional RealityEntity when the source is already known onticly. */
  entity_id?: string | null;
  /** External identifier without requiring a RealityEntity. */
  external_id?: string | null;
  label?: string | null;
}

/**
 * Bounded act/result of observing Reality (epistemic — not ontic State).
 * Distinct from legacy project-management Observation.
 */
export interface EpistemicObservation {
  id: string;
  project_id: string;
  /** Modality / observation kind (visual, measurement, textual, …). */
  kind: string;
  content: string;
  provenance: EpistemicProvenance;
  /** Known RealityEntity subjects; empty when unidentified. */
  subject_ids: string[];
  /** When the observation occurred (null if unknown — never fake from recorded_at). */
  observed_at: string | null;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

export type EvidenceKind = "observation_ref" | "external_ref";

/**
 * Provenance-bearing reference to something inspectable.
 * Not truth. Prefer reference over payload copy.
 */
export interface Evidence {
  id: string;
  project_id: string;
  kind: EvidenceKind;
  /** Required when kind === observation_ref; must exist in epistemic_observations. */
  observation_id: string | null;
  /** Required when kind === external_ref. */
  external_ref: string | null;
  summary: string;
  provenance: EpistemicProvenance;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

export type ClaimPredicateKind =
  | "state"
  | "event"
  | "attribute"
  | "relation"
  | "other";

/**
 * Explicit proposition about Reality. Not necessarily true.
 * Must not silently become RealityState / RealityEvent.
 */
export interface Claim {
  id: string;
  project_id: string;
  /** RealityEntity subject when known; null = unidentified (no fake UUID). */
  subject_id: string | null;
  predicate_kind: ClaimPredicateKind;
  /** e.g. condition, access, occurred — maps later toward ontic kinds. */
  predicate: string;
  value: RealityStateValue;
  provenance: EpistemicProvenance;
  /** Epistemic confidence in [0, 1] — not authority/importance. */
  confidence: number;
  /** Temporal applicability of the asserted proposition (epistemic, not ontic valid_*). */
  applicable_from: string | null;
  applicable_until: string | null;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

export type ClaimEvidenceRelation = "SUPPORTS" | "CONTRADICTS";

/** Explicit Evidence ↔ Claim link. No auto confidence mutation. */
export interface ClaimEvidenceLink {
  id: string;
  project_id: string;
  claim_id: string;
  evidence_id: string;
  relation: ClaimEvidenceRelation;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Reality Core v0.7 — Reference State Core (GROUND-011)
 *
 * ReferenceCondition = declared Expected / Desired / Acceptable criterion.
 * Not Claim, not Belief, not Current RealityState, not Authority.
 */

export type ReferenceKind = "EXPECTED" | "DESIRED" | "ACCEPTABLE";

export type ReferenceDeclarerKind =
  | "human"
  | "organization"
  | "system"
  | "document"
  | "policy"
  | "model"
  | "external";

/** Who/what declared this reference — not authorized_by. */
export interface ReferenceDeclarer {
  kind: ReferenceDeclarerKind;
  entity_id?: string | null;
  external_id?: string | null;
  label?: string | null;
}

export interface ReferenceCriterionEquals {
  kind: "EQUALS";
  value: RealityStateValue;
}

export interface ReferenceCriterionOneOf {
  kind: "ONE_OF";
  values: RealityStateValue[];
}

export interface ReferenceCriterionNumericRange {
  kind: "NUMERIC_RANGE";
  min: number | null;
  max: number | null;
  min_inclusive: boolean;
  max_inclusive: boolean;
}

export type ReferenceCriterion =
  | ReferenceCriterionEquals
  | ReferenceCriterionOneOf
  | ReferenceCriterionNumericRange;

/**
 * Declared reference for comparing canonical RealityState at a scope.
 * Persisted — not derived from Claims or Reality.
 */
export interface ReferenceCondition {
  id: string;
  project_id: string;
  subject_id: string;
  state_kind: string;
  reference_kind: ReferenceKind;
  criterion: ReferenceCriterion;
  /** Applicability window [valid_from, valid_until) — same convention as RealityState. */
  valid_from: string;
  valid_until: string | null;
  declared_by: ReferenceDeclarer;
  /** When GROUND accepted the declaration — not valid_from. */
  recorded_at: string;
  note?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Reality Core v0.7 — Objective Core (GROUND-013)
 *
 * RealityObjective ≠ legacy Goal.
 * ObjectiveRequirement ≠ NEED.
 * ObjectiveDependency ≠ BLOCKER.
 */

export type RealityObjectiveKind = "STATE_TARGET";

/** Declared aim: what Reality outcome is being pursued. Not Intent/Action/Commitment. */
export interface RealityObjective {
  id: string;
  project_id: string;
  kind: RealityObjectiveKind;
  label: string;
  description?: string | null;
  /** Must reference ReferenceCondition(s) with reference_kind = DESIRED. */
  target_reference_condition_ids: string[];
  /** Applicability window [valid_from, valid_until). */
  valid_from: string;
  valid_until: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Declared required condition for Objective dependency structures.
 * Elevates a ReferenceCondition without mutating its reference_kind.
 * Requirement ≠ NEED.
 */
export interface ObjectiveRequirement {
  id: string;
  project_id: string;
  label: string;
  description?: string | null;
  reference_condition_id: string;
  valid_from: string;
  valid_until: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

export type ObjectiveDependencyKind = "REQUIRES";

/**
 * Explicit Objective → Requirement edge.
 * O REQUIRES R ≠ R is currently a BLOCKER.
 */
export interface ObjectiveDependency {
  id: string;
  project_id: string;
  objective_id: string;
  requirement_id: string;
  kind: ObjectiveDependencyKind;
  valid_from: string;
  valid_until: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Reality Core v0.7 — Prospective Core (GROUND-015)
 *
 * FutureScenario ≠ Reality / Claim / Prediction truth.
 * ScenarioStateProjection ≠ RealityState.
 * LikelihoodEstimate ≠ fused probability / RISK.
 */

/** Declared prospective framing — not ontic Reality. */
export interface FutureScenario {
  id: string;
  project_id: string;
  label: string;
  description?: string | null;
  /** Knowledge/Reality horizon from which the Scenario is framed — not projection time. */
  as_of: string;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  basis_state_ids: string[];
  basis_claim_ids: string[];
  basis_evidence_ids: string[];
  created_at: string;
  updated_at: string;
}

/** Point-in-future projected state within a Scenario — not RealityState. */
export interface ScenarioStateProjection {
  id: string;
  project_id: string;
  scenario_id: string;
  subject_id: string;
  state_kind: string;
  projected_value: RealityStateValue;
  /** Future instant this value is projected for — must be > scenario.as_of. */
  projected_for: string;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

/** Declared likelihood for a Scenario — not GROUND's fused probability. */
export interface ScenarioLikelihoodEstimate {
  id: string;
  project_id: string;
  scenario_id: string;
  /** Declared probability ∈ [0, 1] — not ground_probability or true_probability. */
  probability: number;
  estimated_by: ReferenceDeclarer;
  /** When the source's estimate applies/was formed — not scenario.as_of. */
  estimated_at: string;
  recorded_at: string;
  method_label?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Reality Core v0.7 — Impact Core (GROUND-017)
 *
 * ImpactDeclaration ≠ CausalRelation / Authority / severity / magnitude.
 * Affected Entity is explicit — not inferred from deviation subject.
 */

export type ImpactDirection = "ADVERSE" | "BENEFICIAL";

export type ImpactBasisKind = "REFERENCE_DEVIATION";

export interface ImpactBasisReferenceDeviation {
  kind: "REFERENCE_DEVIATION";
  reference_condition_id: string;
}

export type ImpactBasis = ImpactBasisReferenceDeviation;

/** Explicit declared impact scope — not inferred affectedness. */
export interface ImpactDeclaration {
  id: string;
  project_id: string;
  basis: ImpactBasis;
  affected_entity_id: string;
  /** Non-empty dimension key — exact string equality semantics. */
  dimension: string;
  direction: ImpactDirection;
  description?: string | null;
  valid_from: string;
  valid_until: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Reality Core v0.7 — Impact Measurement (GROUND-018)
 *
 * ImpactMeasureDeclaration ≠ severity / risk_score / expected_loss.
 * Magnitude/extent is explicit — not inferred from Reference deviation size.
 */

export interface ImpactMeasurePoint {
  kind: "POINT";
  value: number;
}

export interface ImpactMeasureRange {
  kind: "RANGE";
  min: number;
  max: number;
}

export type ImpactMeasure = ImpactMeasurePoint | ImpactMeasureRange;

/** Explicit quantitative magnitude/extent for an ImpactDeclaration. */
export interface ImpactMeasureDeclaration {
  id: string;
  project_id: string;
  impact_declaration_id: string;
  /** Non-empty metric key — exact string equality; no ontology. */
  metric_key: string;
  /** Non-empty unit — exact equality; no conversion. */
  unit: string;
  measure: ImpactMeasure;
  valid_from: string;
  valid_until: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Reality Core v0.7 — Governance Core (GROUND-019)
 *
 * AuthorityDeclaration ≠ software permission / Capability / Mandate / legitimacy.
 * StandingDeclaration ≠ Authority / Affectedness / representation.
 * MandateDeclaration ≠ Intent / Commitment / Capability.
 */

export type AuthorityPower =
  | "ESTABLISH_REFERENCE"
  | "GOVERN_OBJECTIVE"
  | "DECLARE_IMPACT"
  | "DECLARE_IMPACT_MEASURE"
  | "AUTHORIZE_INTERVENTION";

export type GovernanceScopeSubjectState = {
  kind: "SUBJECT_STATE";
  subject_id: string;
  state_kind: string;
};

export type GovernanceScopeReferenceCondition = {
  kind: "REFERENCE_CONDITION";
  reference_condition_id: string;
};

export type GovernanceScopeRealityObjective = {
  kind: "REALITY_OBJECTIVE";
  objective_id: string;
};

export type GovernanceScopeImpactDeclaration = {
  kind: "IMPACT_DECLARATION";
  impact_declaration_id: string;
};

export type GovernanceScopeInterventionDeclaration = {
  kind: "INTERVENTION_DECLARATION";
  intervention_id: string;
};

export type GovernanceScope =
  | GovernanceScopeSubjectState
  | GovernanceScopeReferenceCondition
  | GovernanceScopeRealityObjective
  | GovernanceScopeImpactDeclaration
  | GovernanceScopeInterventionDeclaration;

/** Standing does not include INTERVENTION_DECLARATION (GROUND-024). */
export type StandingScope =
  | GovernanceScopeReferenceCondition
  | GovernanceScopeRealityObjective
  | GovernanceScopeImpactDeclaration;

export type StandingRight = "PARTICIPATE" | "CONTEST";

export type MandateKind = "PURSUE_OBJECTIVE";

/** Declared governance power — not absolute legitimacy or runtime ACL. */
export interface AuthorityDeclaration {
  id: string;
  project_id: string;
  holder_entity_id: string;
  power: AuthorityPower;
  scope: GovernanceScope;
  valid_from: string;
  valid_until: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

/** Declared participation/contest rights — not Authority or affectedness. */
export interface StandingDeclaration {
  id: string;
  project_id: string;
  holder_entity_id: string;
  scope: StandingScope;
  rights: StandingRight[];
  valid_from: string;
  valid_until: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

/** Declared Objective pursuit assignment — not Commitment or Capability. */
export interface MandateDeclaration {
  id: string;
  project_id: string;
  holder_entity_id: string;
  kind: MandateKind;
  objective_id: string;
  valid_from: string;
  valid_until: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Reality Core v0.7 — Governance Core II (GROUND-020)
 *
 * AuthorityDelegationDeclaration ≠ effective Authority / transitive chain.
 * AuthorityContestDeclaration ≠ revocation / invalidation / Standing.
 */

/** One-hop declared delegation — not absolute legitimacy or Permission. */
export interface AuthorityDelegationDeclaration {
  id: string;
  project_id: string;
  delegator_entity_id: string;
  delegatee_entity_id: string;
  power: AuthorityPower;
  scope: GovernanceScope;
  /** Direct AuthorityDeclaration IDs only — not other delegations. */
  source_authority_declaration_ids: string[];
  valid_from: string;
  valid_until: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

export type AuthorityContestTargetAuthority = {
  kind: "AUTHORITY_DECLARATION";
  authority_declaration_id: string;
};

export type AuthorityContestTargetDelegation = {
  kind: "AUTHORITY_DELEGATION";
  authority_delegation_id: string;
};

export type AuthorityContestTarget =
  | AuthorityContestTargetAuthority
  | AuthorityContestTargetDelegation;

/** Explicit contest event — not Standing, not revocation. */
export interface AuthorityContestDeclaration {
  id: string;
  project_id: string;
  contesting_entity_id: string;
  target: AuthorityContestTarget;
  note: string | null;
  valid_from: string;
  valid_until: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Reality Core v0.7 — Capability Core I (GROUND-021)
 *
 * CapabilityDeclaration ≠ Authority / Permission / Mandate / Resource / Commitment.
 * CapabilityVerificationDeclaration ≠ PROVEN / availability / truth.
 * CapabilityAvailabilityDeclaration ≠ can_execute / Permission / Commitment.
 */

export type CapabilityScopeUnscoped = {
  kind: "UNSCOPED";
};

export type CapabilityScopeEntity = {
  kind: "ENTITY";
  entity_id: string;
};

export type CapabilityScopeSubjectState = {
  kind: "SUBJECT_STATE";
  subject_id: string;
  state_kind: string;
};

export type CapabilityScope =
  | CapabilityScopeUnscoped
  | CapabilityScopeEntity
  | CapabilityScopeSubjectState;

/** Declared capability — not verified, available, authorized, or executable. */
export interface CapabilityDeclaration {
  id: string;
  project_id: string;
  holder_entity_id: string;
  /** Opaque exact-match key — no ontology. */
  capability_key: string;
  scope: CapabilityScope;
  description: string | null;
  valid_from: string;
  valid_until: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Evidence-backed verification of a CapabilityDeclaration.
 * Interval: [verified_at, valid_until)
 */
export interface CapabilityVerificationDeclaration {
  id: string;
  project_id: string;
  capability_declaration_id: string;
  evidence_ids: string[];
  verified_by: ReferenceDeclarer;
  verified_at: string;
  valid_until: string | null;
  note: string | null;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

export type CapabilityAvailabilityStatus = "AVAILABLE" | "UNAVAILABLE";

/** Explicit availability declaration — not can_execute / Commitment / Resource. */
export interface CapabilityAvailabilityDeclaration {
  id: string;
  project_id: string;
  capability_declaration_id: string;
  status: CapabilityAvailabilityStatus;
  valid_from: string;
  valid_until: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  note: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Resource Core I (GROUND-022).
 * ResourceDeclaration ≠ Capability / Authority / Permission / Mandate / Commitment.
 * ResourceCapacity ≠ availability / free quantity / reservation.
 * ResourceAvailability ≠ available_quantity / can_execute / Permission.
 */

export type ResourceScopeUnscoped = {
  kind: "UNSCOPED";
};

export type ResourceScopeEntity = {
  kind: "ENTITY";
  entity_id: string;
};

export type ResourceScopeSubjectState = {
  kind: "SUBJECT_STATE";
  subject_id: string;
  state_kind: string;
};

/** Distinct from CapabilityScope even when shapes match. */
export type ResourceScope =
  | ResourceScopeUnscoped
  | ResourceScopeEntity
  | ResourceScopeSubjectState;

/** Declared resource hold/administration — not ownership, availability, or capacity. */
export interface ResourceDeclaration {
  id: string;
  project_id: string;
  holder_entity_id: string;
  /** Opaque exact-match key — no ontology. */
  resource_key: string;
  /** Opaque exact-match unit — no conversion. */
  unit: string;
  scope: ResourceScope;
  /** Optional RealityEntity backing identity; null for fungible resources. */
  resource_entity_id: string | null;
  description: string | null;
  valid_from: string;
  valid_until: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

export type ResourceCapacityPoint = {
  kind: "POINT";
  value: number;
};

export type ResourceCapacityRange = {
  kind: "RANGE";
  min: number;
  max: number;
};

/** Declared capacity in parent ResourceDeclaration.unit — not free/available quantity. */
export type ResourceCapacity = ResourceCapacityPoint | ResourceCapacityRange;

export interface ResourceCapacityDeclaration {
  id: string;
  project_id: string;
  resource_declaration_id: string;
  capacity: ResourceCapacity;
  valid_from: string;
  valid_until: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export type ResourceAvailabilityStatus = "AVAILABLE" | "UNAVAILABLE";

/** Qualitative availability only — no available_quantity / reservation. */
export interface ResourceAvailabilityDeclaration {
  id: string;
  project_id: string;
  resource_declaration_id: string;
  status: ResourceAvailabilityStatus;
  valid_from: string;
  valid_until: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  note: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Intervention Core I (GROUND-023).
 * InterventionDeclaration ≠ executed Action / RealityEvent / legacy NextAction.
 * Requirements ≠ feasibility / matching / Permission / Commitment.
 */

export type InterventionScopeUnscoped = {
  kind: "UNSCOPED";
};

export type InterventionScopeEntity = {
  kind: "ENTITY";
  entity_id: string;
};

export type InterventionScopeSubjectState = {
  kind: "SUBJECT_STATE";
  subject_id: string;
  state_kind: string;
};

/** Distinct from CapabilityScope / ResourceScope even when shapes match. */
export type InterventionScope =
  | InterventionScopeUnscoped
  | InterventionScopeEntity
  | InterventionScopeSubjectState;

/** Prospective intervention specification — not execution, Decision, Intent, or Commitment. */
export interface InterventionDeclaration {
  id: string;
  project_id: string;
  /** Opaque exact-match key — no ontology. */
  intervention_key: string;
  target_scope: InterventionScope;
  description: string | null;
  valid_from: string;
  valid_until: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Actor-independent Capability prerequisite for an Intervention.
 * Does not reference CapabilityDeclaration IDs and does not imply matching/feasibility.
 */
export interface InterventionCapabilityRequirementDeclaration {
  id: string;
  project_id: string;
  intervention_id: string;
  capability_key: string;
  capability_scope: CapabilityScope;
  valid_from: string;
  valid_until: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  note: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Required amount for an Intervention — not ResourceCapacity.
 * POINT: value > 0. RANGE: 0 <= min <= max and max > 0.
 */
export type ResourceRequirementAmountPoint = {
  kind: "POINT";
  value: number;
};

export type ResourceRequirementAmountRange = {
  kind: "RANGE";
  min: number;
  max: number;
};

export type ResourceRequirementAmount =
  | ResourceRequirementAmountPoint
  | ResourceRequirementAmountRange;

/**
 * Actor/provider-independent Resource prerequisite for an Intervention.
 * Does not reference ResourceDeclaration IDs and does not imply sufficiency.
 */
export interface InterventionResourceRequirementDeclaration {
  id: string;
  project_id: string;
  intervention_id: string;
  resource_key: string;
  unit: string;
  resource_scope: ResourceScope;
  required_amount: ResourceRequirementAmount;
  valid_from: string;
  valid_until: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  note: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Permission Core I (GROUND-024).
 * InterventionPermissionDeclaration ≠ Authority / Capability / Resource / Mandate /
 * Decision / Intent / Commitment / execution / software ACL.
 * PERMIT|PROHIBIT are declaration effects only — no effective permission winner.
 */

export type InterventionPermissionEffect = "PERMIT" | "PROHIBIT";

/** Actor-specific declared permission for a canonical Intervention — not assignment/execution. */
export interface InterventionPermissionDeclaration {
  id: string;
  project_id: string;
  actor_entity_id: string;
  intervention_id: string;
  effect: InterventionPermissionEffect;
  valid_from: string;
  valid_until: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  note: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Decision Core I (GROUND-025).
 * DecisionSpaceDeclaration ≠ legacy Decision / selected option / recommendation.
 * DecisionOptionDeclaration ≠ feasibility / ranking / actor assignment / Commitment.
 */

export type DecisionBasisRealityObjective = {
  kind: "REALITY_OBJECTIVE";
  objective_id: string;
};

export type DecisionBasisReferenceCondition = {
  kind: "REFERENCE_CONDITION";
  reference_condition_id: string;
};

export type DecisionBasisFutureScenario = {
  kind: "FUTURE_SCENARIO";
  scenario_id: string;
};

/** Canonical Decision Space basis only — not derived Finding IDs. */
export type DecisionBasisReference =
  | DecisionBasisRealityObjective
  | DecisionBasisReferenceCondition
  | DecisionBasisFutureScenario;

/** Declared deliberation context — not a Decision selection or lifecycle. */
export interface DecisionSpaceDeclaration {
  id: string;
  project_id: string;
  label: string;
  description: string | null;
  basis: DecisionBasisReference[];
  valid_from: string;
  valid_until: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

export type DecisionOptionKind = "INTERVENTION" | "DO_NOTHING";

export type DecisionOptionIntervention = {
  kind: "INTERVENTION";
  intervention_id: string;
};

export type DecisionOptionDoNothing = {
  kind: "DO_NOTHING";
};

export type DecisionOptionTarget =
  | DecisionOptionIntervention
  | DecisionOptionDoNothing;

/**
 * Explicit option under consideration in a Decision Space.
 * Actor-independent. Not selected / ranked / feasible.
 */
export interface DecisionOptionDeclaration {
  id: string;
  project_id: string;
  decision_space_id: string;
  option: DecisionOptionTarget;
  label: string | null;
  description: string | null;
  valid_from: string;
  valid_until: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Agency Composition I (GROUND-026).
 * Actor Candidate ≠ selected actor / executor / Intent / Commitment / feasible.
 */
export interface DecisionOptionActorCandidateDeclaration {
  id: string;
  project_id: string;
  decision_option_declaration_id: string;
  actor_entity_id: string;
  note: string | null;
  valid_from: string;
  valid_until: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectStateExtensions {
  router?: Record<string, unknown>;
  [key: string]: unknown;
}

/** Aggregate root — trunk and branches, not conversation leaves */
export interface ProjectState {
  schema_version: SchemaVersion;
  project: Project;
  goals: Goal[];
  current_state: CurrentState;
  blockers: Blocker[];
  next_actions: NextAction[];
  decisions: Decision[];
  hypotheses: Hypothesis[];
  reference_docs: ReferenceDoc[];
  observations: Observation[];
  judgments: Judgment[];
  goal_edges: GoalEdge[];
  reality_entities: RealityEntity[];
  reality_events: RealityEvent[];
  reality_states: RealityState[];
  epistemic_observations: EpistemicObservation[];
  evidence: Evidence[];
  claims: Claim[];
  claim_evidence_links: ClaimEvidenceLink[];
  reference_conditions: ReferenceCondition[];
  reality_objectives: RealityObjective[];
  objective_requirements: ObjectiveRequirement[];
  objective_dependencies: ObjectiveDependency[];
  future_scenarios: FutureScenario[];
  scenario_state_projections: ScenarioStateProjection[];
  scenario_likelihood_estimates: ScenarioLikelihoodEstimate[];
  impact_declarations: ImpactDeclaration[];
  impact_measure_declarations: ImpactMeasureDeclaration[];
  authority_declarations: AuthorityDeclaration[];
  standing_declarations: StandingDeclaration[];
  mandate_declarations: MandateDeclaration[];
  authority_delegation_declarations: AuthorityDelegationDeclaration[];
  authority_contest_declarations: AuthorityContestDeclaration[];
  capability_declarations: CapabilityDeclaration[];
  capability_verification_declarations: CapabilityVerificationDeclaration[];
  capability_availability_declarations: CapabilityAvailabilityDeclaration[];
  resource_declarations: ResourceDeclaration[];
  resource_capacity_declarations: ResourceCapacityDeclaration[];
  resource_availability_declarations: ResourceAvailabilityDeclaration[];
  intervention_declarations: InterventionDeclaration[];
  intervention_capability_requirement_declarations: InterventionCapabilityRequirementDeclaration[];
  intervention_resource_requirement_declarations: InterventionResourceRequirementDeclaration[];
  intervention_permission_declarations: InterventionPermissionDeclaration[];
  decision_space_declarations: DecisionSpaceDeclaration[];
  decision_option_declarations: DecisionOptionDeclaration[];
  decision_option_actor_candidate_declarations: DecisionOptionActorCandidateDeclaration[];
  reality_decision_declarations: RealityDecisionDeclaration[];
  intervention_intent_declarations: InterventionIntentDeclaration[];
  intervention_commitment_declarations: InterventionCommitmentDeclaration[];
  intervention_commitment_acceptance_declarations: InterventionCommitmentAcceptanceDeclaration[];
  intervention_commitment_temporal_term_declarations: InterventionCommitmentTemporalTermDeclaration[];
  intervention_commitment_conditional_term_declarations: InterventionCommitmentConditionalTermDeclaration[];
  intervention_resource_commitment_declarations: InterventionResourceCommitmentDeclaration[];
  intervention_resource_reservation_declarations: InterventionResourceReservationDeclaration[];
  extensions: ProjectStateExtensions;
  updated_at: string;
}

// ─── GROUND-028: Decision Core II / Decision Memory I ────────────────────────

/**
 * Selection made in a RealityDecisionDeclaration.
 * Semantic: "chosen Option", not "correct / feasible / authorized / committed".
 */
export type RealityDecisionSelection =
  | { kind: "INTERVENTION"; intervention_id: string }
  | { kind: "DO_NOTHING" };

/** Frozen snapshot of one semantic Option position at capture time. */
export interface DecisionOptionSnapshot {
  option_key: string;
  kind: "INTERVENTION" | "DO_NOTHING";
  intervention_id: string | null;
  option_declaration_ids: string[];
}

/** Frozen snapshot of one Actor Candidate position at capture time. */
export interface DecisionActorCandidateSnapshot {
  candidate_key: string;
  intervention_id: string;
  actor_entity_id: string;
  candidate_declaration_ids: string[];
}

/** Frozen Capability basis per requirement, from GROUND-026/027. */
export interface DecisionCapabilityBasisSnapshot {
  capability_key: string;
  capability_scope_key: string;
  requirement_declaration_ids: string[];
  matching_capability_declaration_ids: string[];
  has_exact_match: boolean;
  has_active_verification: boolean;
  has_any_availability_declaration: boolean;
  has_available_declaration: boolean;
  has_unavailable_declaration: boolean;
  has_existing_contested_availability: boolean;
}

/** Frozen Resource basis per requirement, from GROUND-026/027. */
export interface DecisionResourceBasisSnapshot {
  resource_key: string;
  unit: string;
  resource_scope_key: string;
  requirement_declaration_ids: string[];
  required_amounts: ResourceRequirementAmount[];
  matching_resource_declaration_ids: string[];
  matching_holder_ids: string[];
  has_exact_match: boolean;
  has_any_capacity_declaration: boolean;
  has_capacity_divergence: boolean;
  has_available_declaration: boolean;
  has_unavailable_declaration: boolean;
  has_existing_contested_availability: boolean;
}

/** Frozen Permission basis per actor+intervention, from GROUND-027. */
export interface DecisionPermissionBasisSnapshot {
  permission_status: string;
  permission_declaration_ids: string[];
  permit_declaration_ids: string[];
  prohibit_declaration_ids: string[];
  has_permit_declaration: boolean;
  has_prohibit_declaration: boolean;
  has_permission_conflict: boolean;
}

/** Frozen gap from GROUND-027. */
export interface DecisionBasisGapSnapshot {
  key: string;
  kind: string;
  related_key: string;
}

/** Frozen contest from GROUND-027. */
export interface DecisionBasisContestSnapshot {
  key: string;
  kind: string;
  related_key: string;
  source_ids: string[];
}

/** Frozen declared constraint from GROUND-027. */
export interface DecisionDeclaredConstraintSnapshot {
  key: string;
  kind: string;
  source_declaration_ids: string[];
}

/**
 * Frozen Feasibility Basis for one Actor Candidate at snapshot capture time.
 * Preserves GROUND-027 assessment without a feasibility verdict.
 */
export interface DecisionActorFeasibilityBasisSnapshot {
  candidate_key: string;
  intervention_id: string;
  actor_entity_id: string;
  capability_bases: DecisionCapabilityBasisSnapshot[];
  resource_bases: DecisionResourceBasisSnapshot[];
  permission: DecisionPermissionBasisSnapshot;
  gaps: DecisionBasisGapSnapshot[];
  contests: DecisionBasisContestSnapshot[];
  declared_constraints: DecisionDeclaredConstraintSnapshot[];
  model_limitations: (
    | "EFFECTIVE_CAPABILITY_NOT_MODELED"
    | "EFFECTIVE_PERMISSION_NOT_MODELED"
    | "AUTHORITY_PRECEDENCE_NOT_MODELED"
    | "RESOURCE_AVAILABLE_QUANTITY_NOT_MODELED"
    | "RESOURCE_ACCESS_PERMISSION_NOT_MODELED"
    | "RESOURCE_RESERVATION_NOT_MODELED"
    | "COMMITMENT_NOT_MODELED"
    | "EXECUTION_CONDITIONS_NOT_MODELED"
  )[];
}

/**
 * Frozen Decision Context Snapshot (v1).
 * assessed_at = decided_at; captured_at = recorded_at.
 * Does NOT claim to be exact historical knowledge at decided_at when captured_at > decided_at.
 */
export interface DecisionContextSnapshotV1 {
  version: "1";
  decision_space_id: string;
  assessed_at: string;
  captured_at: string;
  basis_keys: string[];
  option_positions: DecisionOptionSnapshot[];
  actor_candidates: DecisionActorCandidateSnapshot[];
  actor_feasibility_bases: DecisionActorFeasibilityBasisSnapshot[];
  intervention_option_ids_without_actor_candidates: string[];
}

/** Persistence-time fact, bound to exact frozen content. Not current revalidation. */
export type DecisionSnapshotVerification = {
  decision_id: string;
  snapshot_content_digest: string;
} & (
  | { status: "VERIFIED"; persisted_at: string }
  | { status: "UNVERIFIED"; persisted_at: string; reason: "TEMPORAL_RESOLUTION_UNAVAILABLE";
      temporal_declaration: string; temporal_operation: string; temporal_reason: string }
  | { status: "NOT_RECORDED"; persisted_at: null; reason: "LEGACY_VERIFICATION_FACT_NOT_RECORDED" }
);

/**
 * Canonical persisted record of an actual declared Decision.
 * chosen != correct / feasible / authorized / committed / executed.
 * Append-only: immutable after creation.
 */
export interface RealityDecisionDeclaration {
  id: string;
  project_id: string;
  decision_space_id: string;
  decision_maker_entity_id: string;
  selected_option: RealityDecisionSelection;
  selected_actor_entity_id?: string | null;
  decided_at: string;
  rationale?: string | null;
  context_snapshot: DecisionContextSnapshotV1;
  /** Optional only for historical TypeScript inputs; canonical schema requires this. */
  snapshot_verification?: DecisionSnapshotVerification;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

// ─── GROUND-029: Intent Core I / Actor Prospective Intent Foundation ─────────

/**
 * Prospective orientation of an Intent holder toward a canonical Intervention.
 * PURSUE / REFRAIN are declared dispositions, not Permission, Commitment, or execution.
 */
export type InterventionIntentDisposition = "PURSUE" | "REFRAIN";

/**
 * Canonical persisted record that Entity H is declared to presently intend
 * to pursue, or refrain from pursuing, Intervention I.
 *
 * Intent != Decision / selected Actor / Mandate / Permission / Capability /
 * Resource / Commitment / Execution.
 *
 * intent_holder_entity_id is the Entity whose Intent is asserted.
 * declared_by is provenance only and is not automatically the holder.
 *
 * Append-only: semantic fields are immutable after creation.
 */
export interface InterventionIntentDeclaration {
  id: string;
  project_id: string;
  intent_holder_entity_id: string;
  intervention_id: string;
  disposition: InterventionIntentDisposition;
  decision_basis_declaration_id?: string | null;
  intent_formed_at: string;
  valid_until: string | null;
  note?: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

// ─── GROUND-030: Commitment Core I / Intervention Undertaking Foundation ─────

/**
 * Explicit association from a Commitment declaration to a canonical Decision
 * or Intent record. Association != causation / legal creation / proof.
 */
export type CommitmentBasisReference =
  | {
      kind: "REALITY_DECISION";
      decision_declaration_id: string;
    }
  | {
      kind: "INTERVENTION_INTENT";
      intent_declaration_id: string;
    };

/**
 * Canonical persisted record that Entity H is declared to have undertaken
 * a social/institutional commitment to pursue Intervention I.
 *
 * Commitment != Intent / Decision / selected Actor / Mandate / Permission /
 * Authority / Capability / Resource / Resource reservation / Execution.
 *
 * Declared commitment != legal enforceability / holder acceptance /
 * deadline / resource binding.
 *
 * Positive-only in Core I: absence is NO_COMMITMENT_DECLARATIONS,
 * not "not committed" / released / refused.
 *
 * Append-only: semantic fields are immutable after creation.
 */
export interface InterventionCommitmentDeclaration {
  id: string;
  project_id: string;
  commitment_holder_entity_id: string;
  intervention_id: string;
  basis: CommitmentBasisReference[];
  committed_at: string;
  valid_until: string | null;
  note?: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

// ─── GROUND-031: Commitment Core II / Holder Acceptance Foundation ───────────

/**
 * Declared holder Acceptance of a canonical InterventionCommitmentDeclaration.
 *
 * Acceptance != Commitment itself / Intent / Permission / Decision / Authority /
 * legal enforceability / Resource binding / Execution.
 *
 * Subject is the Commitment holder, derived via commitment_declaration_id.
 * declared_by is provenance only and is not automatically the holder.
 *
 * Positive-only: absence is NO_ACCEPTANCE_DECLARATIONS, not rejection.
 * Append-only: semantic fields are immutable after creation.
 */
export interface InterventionCommitmentAcceptanceDeclaration {
  id: string;
  project_id: string;
  commitment_declaration_id: string;
  accepted_at: string;
  note?: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

// ─── GROUND-032: Commitment Core III / Temporal Terms & Deadline Foundation ──

/**
 * Declared temporal performance term on a canonical Commitment.
 * START_BY / COMPLETE_BY are social terms, not execution observations.
 */
export type CommitmentTemporalTermKind = "START_BY" | "COMPLETE_BY";

/**
 * Canonical persisted record that Source S declares a temporal performance
 * term on Commitment C.
 *
 * Temporal Term != Commitment / Acceptance / execution schedule /
 * Commitment.valid_until / Resource reservation / legal obligation /
 * effective deadline.
 *
 * Positive-only: absence is no represented Temporal Term declaration,
 * not "there is no deadline in Reality".
 * Append-only: semantic fields are immutable after creation.
 */
export interface InterventionCommitmentTemporalTermDeclaration {
  id: string;
  project_id: string;
  commitment_declaration_id: string;
  term_kind: CommitmentTemporalTermKind;
  deadline_at: string;
  note?: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

// ─── GROUND-033: Commitment Core IV / Conditional Terms Foundation ───────────

/**
 * Declared role of an opaque Conditional Term on a Commitment.
 * ACTIVATION_CONDITION / EXCEPTION_CONDITION are social terms, not truth verdicts.
 */
export type CommitmentConditionRole =
  | "ACTIVATION_CONDITION"
  | "EXCEPTION_CONDITION";

/**
 * Canonical persisted record that Source S declares an opaque Conditional Term
 * on Commitment C.
 *
 * Conditional Term != Requirement / ObjectiveRequirement / Permission /
 * Temporal Term / condition truth / effective Commitment applicability.
 *
 * condition_key is exact opaque identity only — not evaluable predicate code.
 * Positive-only: absence is no represented Conditional Term declaration.
 * Append-only: semantic fields are immutable after creation.
 */
export interface InterventionCommitmentConditionalTermDeclaration {
  id: string;
  project_id: string;
  commitment_declaration_id: string;
  condition_key: string;
  condition_role: CommitmentConditionRole;
  description?: string | null;
  note?: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

// ─── GROUND-034: Resource Commitment Core I / Explicit Resource Undertaking ──

/**
 * Declared quantitative amount for a Resource Commitment undertaking.
 * Structurally similar to Capacity/Requirement amounts, but distinct:
 * POINT value > 0; RANGE min > 0 and max >= min.
 * Not free quantity / reservation / sufficiency.
 */
export type ResourceCommitmentAmountPoint = {
  kind: "POINT";
  value: number;
};

export type ResourceCommitmentAmountRange = {
  kind: "RANGE";
  min: number;
  max: number;
};

export type ResourceCommitmentAmount =
  | ResourceCommitmentAmountPoint
  | ResourceCommitmentAmountRange;

/**
 * Canonical persisted record that Source S declares Entity P undertook to
 * make Resource R available in support of Intervention Commitment C.
 *
 * Resource Commitment != Availability / Capacity / Requirement /
 * Reservation / Allocation / Consumption / ownership / access Permission.
 *
 * committed_amount null means no quantitative amount is represented —
 * not zero, not whole Resource, not unlimited.
 * Append-only: semantic fields are immutable after creation.
 */
export interface InterventionResourceCommitmentDeclaration {
  id: string;
  project_id: string;
  commitment_declaration_id: string;
  resource_declaration_id: string;
  resource_committer_entity_id: string;
  committed_amount?: ResourceCommitmentAmount | null;
  resource_committed_at: string;
  note?: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

// ─── GROUND-035: Resource Reservation Core I / Operational Hold Foundation ──

/**
 * Declared quantitative amount for an AMOUNT-scoped Reservation.
 * Structurally similar to ResourceCommitmentAmount, but distinct meaning:
 * not free quantity / capacity deduction / sufficiency.
 */
export type ResourceReservationAmountPoint = {
  kind: "POINT";
  value: number;
};

export type ResourceReservationAmountRange = {
  kind: "RANGE";
  min: number;
  max: number;
};

export type ResourceReservationAmount =
  | ResourceReservationAmountPoint
  | ResourceReservationAmountRange;

/**
 * Explicit Reservation scope.
 * FULL_RESOURCE != Capacity / numeric amount / ownership.
 * AMOUNT requires an explicit ResourceReservationAmount.
 */
export type ResourceReservationScope =
  | { kind: "FULL_RESOURCE" }
  | { kind: "AMOUNT"; amount: ResourceReservationAmount };

/**
 * Canonical persisted record that Source S declares Entity H made an
 * operational set-aside of all or an explicit amount of the Resource
 * represented by Resource Commitment RC, for a declared reservation window.
 *
 * Reservation != Resource Commitment / Availability / Capacity /
 * Allocation / Consumption / ownership / Authority / Permission /
 * effective exclusive control / execution.
 *
 * Append-only: semantic fields are immutable after creation.
 */
export interface InterventionResourceReservationDeclaration {
  id: string;
  project_id: string;
  resource_commitment_declaration_id: string;
  reserved_by_entity_id: string;
  reservation_scope: ResourceReservationScope;
  reservation_made_at: string;
  reserved_from: string;
  reserved_until: string | null;
  note?: string | null;
  declared_by: ReferenceDeclarer;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

export type PatchOp = "upsert" | "status_change" | "delete";

export type PatchEntity =
  | "project"
  | "goal"
  | "current_state"
  | "blocker"
  | "next_action"
  | "decision"
  | "hypothesis"
  | "reference_doc"
  | "observation"
  | "judgment"
  | "reality_entity"
  | "reality_event"
  | "reality_state"
  | "epistemic_observation"
  | "evidence"
  | "claim"
  | "claim_evidence_link"
  | "reference_condition"
  | "reality_objective"
  | "objective_requirement"
  | "objective_dependency"
  | "future_scenario"
  | "scenario_state_projection"
  | "scenario_likelihood_estimate"
  | "impact_declaration"
  | "impact_measure_declaration"
  | "authority_declaration"
  | "standing_declaration"
  | "mandate_declaration"
  | "authority_delegation_declaration"
  | "authority_contest_declaration"
  | "capability_declaration"
  | "capability_verification_declaration"
  | "capability_availability_declaration"
  | "resource_declaration"
  | "resource_capacity_declaration"
  | "resource_availability_declaration"
  | "intervention_declaration"
  | "intervention_capability_requirement_declaration"
  | "intervention_resource_requirement_declaration"
  | "intervention_permission_declaration"
  | "decision_space_declaration"
  | "decision_option_declaration"
  | "decision_option_actor_candidate_declaration"
  | "reality_decision_declaration"
  | "intervention_intent_declaration"
  | "intervention_commitment_declaration"
  | "intervention_commitment_acceptance_declaration"
  | "intervention_commitment_temporal_term_declaration"
  | "intervention_commitment_conditional_term_declaration"
  | "intervention_resource_commitment_declaration"
  | "intervention_resource_reservation_declaration";

export type PatchSource = "manual" | "extraction" | "import" | "human_review";

/** Entity → payload shape. Discriminated by `PatchOperation.entity`. */
export type PatchEntityPayloadMap = {
  project: Partial<Project>;
  goal: Partial<Goal>;
  current_state: Partial<CurrentState>;
  blocker: Partial<Blocker>;
  next_action: Partial<NextAction>;
  decision: Partial<Decision>;
  hypothesis: Partial<Hypothesis>;
  reference_doc: Partial<ReferenceDoc>;
  observation: Partial<Observation>;
  judgment: Partial<Judgment>;
  reality_entity: Partial<RealityEntity>;
  reality_event: Partial<RealityEvent>;
  reality_state: Partial<RealityState>;
  epistemic_observation: Partial<EpistemicObservation>;
  evidence: Partial<Evidence>;
  claim: Partial<Claim>;
  claim_evidence_link: Partial<ClaimEvidenceLink>;
  reference_condition: Partial<ReferenceCondition>;
  reality_objective: Partial<RealityObjective>;
  objective_requirement: Partial<ObjectiveRequirement>;
  objective_dependency: Partial<ObjectiveDependency>;
  future_scenario: Partial<FutureScenario>;
  scenario_state_projection: Partial<ScenarioStateProjection>;
  scenario_likelihood_estimate: Partial<ScenarioLikelihoodEstimate>;
  impact_declaration: Partial<ImpactDeclaration>;
  impact_measure_declaration: Partial<ImpactMeasureDeclaration>;
  authority_declaration: Partial<AuthorityDeclaration>;
  standing_declaration: Partial<StandingDeclaration>;
  mandate_declaration: Partial<MandateDeclaration>;
  authority_delegation_declaration: Partial<AuthorityDelegationDeclaration>;
  authority_contest_declaration: Partial<AuthorityContestDeclaration>;
  capability_declaration: Partial<CapabilityDeclaration>;
  capability_verification_declaration: Partial<CapabilityVerificationDeclaration>;
  capability_availability_declaration: Partial<CapabilityAvailabilityDeclaration>;
  resource_declaration: Partial<ResourceDeclaration>;
  resource_capacity_declaration: Partial<ResourceCapacityDeclaration>;
  resource_availability_declaration: Partial<ResourceAvailabilityDeclaration>;
  intervention_declaration: Partial<InterventionDeclaration>;
  intervention_capability_requirement_declaration: Partial<InterventionCapabilityRequirementDeclaration>;
  intervention_resource_requirement_declaration: Partial<InterventionResourceRequirementDeclaration>;
  intervention_permission_declaration: Partial<InterventionPermissionDeclaration>;
  decision_space_declaration: Partial<DecisionSpaceDeclaration>;
  decision_option_declaration: Partial<DecisionOptionDeclaration>;
  decision_option_actor_candidate_declaration: Partial<DecisionOptionActorCandidateDeclaration>;
  reality_decision_declaration: Partial<RealityDecisionDeclaration>;
  intervention_intent_declaration: Partial<InterventionIntentDeclaration>;
  intervention_commitment_declaration: Partial<InterventionCommitmentDeclaration>;
  intervention_commitment_acceptance_declaration: Partial<InterventionCommitmentAcceptanceDeclaration>;
  intervention_commitment_temporal_term_declaration: Partial<InterventionCommitmentTemporalTermDeclaration>;
  intervention_commitment_conditional_term_declaration: Partial<InterventionCommitmentConditionalTermDeclaration>;
  intervention_resource_commitment_declaration: Partial<InterventionResourceCommitmentDeclaration>;
  intervention_resource_reservation_declaration: Partial<InterventionResourceReservationDeclaration>;
};

export type PatchOperation = {
  [E in PatchEntity]: {
    op: PatchOp;
    entity: E;
    entity_id: string;
    payload?: PatchEntityPayloadMap[E];
    status?: string;
  };
}[PatchEntity];

/**
 * Read a payload field when `entity` has not been narrowed.
 * Runtime payloads are plain objects; validation remains in apply/validate.
 */
export function payloadField(
  payload: PatchOperation["payload"] | undefined,
  key: string
): unknown {
  if (!payload) {
    return undefined;
  }
  return (payload as Record<string, unknown>)[key];
}

export interface StatePatch {
  schema_version: SchemaVersion;
  project_id: string;
  source: PatchSource;
  operations: PatchOperation[];
  applied_at?: string;
}
