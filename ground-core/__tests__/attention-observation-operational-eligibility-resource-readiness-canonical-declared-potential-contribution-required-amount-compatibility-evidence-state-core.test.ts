/**
 * GROUND-175 — Observation Core CXXIX / Canonical Declared Potential
 * Contribution Required-Amount Compatibility Evidence State Foundation
 *
 * GROUND-174 Basis Set → canonical evidence State (normalization only).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasis,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisStatus,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityInterpretation,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityUnresolvedReason,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-required-amount-compatibility-basis-types.js";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE_STATE_MODEL_LIMITATIONS,
  attentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateKey,
  buildAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateSet,
  deriveAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue,
  isApplicableAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState,
  isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState,
  isUnresolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-canonical-declared-potential-contribution-required-amount-compatibility-evidence-state-core.js";
import type { AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue } from "../reality/attention-observation-operational-eligibility-resource-readiness-canonical-declared-potential-contribution-required-amount-compatibility-evidence-state-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const NEED = "need";
const CAP = "cap-set";
const REQ = "req-key";
const BINDING = "binding-a";
const RD = "rd-1";
const EVAL_AT = "2026-01-01T00:00:00.000Z";
const EVAL_AT_B = "2026-01-02T00:00:00.000Z";
const CONTRIB_KEY = "contrib-decl-key";
const CONTRIB_KEY_B = "contrib-decl-key-b";

const SUPPORTING =
  "SUPPORTING_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE" as const;
const CONTRADICTING =
  "CONTRADICTING_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE" as const;
const CANONICAL_SUPPORTING =
  "EXPLICITLY_DERIVED_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE_SUPPORTING" as const;
const CANONICAL_CONTRADICTING =
  "EXPLICITLY_DERIVED_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE_CONTRADICTING" as const;
const NOT_APPLICABLE =
  "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_SPECIFICATION" as const;

const ALL_UNRESOLVED: AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue[] =
  [
    "UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION",
    "UNRESOLVED_NO_EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION",
    "UNRESOLVED_CONTRIBUTION_QUANTITY_KIND_UNDECLARED",
    "UNRESOLVED_REQUIRED_AMOUNT_QUANTITY_KIND_UNDECLARED",
    "UNRESOLVED_CONTRIBUTION_REQUIRED_AMOUNT_QUANTITY_KIND_MISMATCH",
    "UNRESOLVED_CONTRIBUTION_RANGE_SEMANTICS_NOT_MODELED",
    "UNRESOLVED_REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_MODELED",
    "UNRESOLVED_TARGET_REQUIRED_AMOUNT_ACCEPTANCE_SEMANTICS_NOT_MODELED",
    "UNRESOLVED_FLOW_TIME_BASIS_SEMANTICS_NOT_MODELED",
  ];

function makeContribution(params?: {
  key?: string;
  evaluation_at?: string;
}) {
  return {
    key: params?.key ?? CONTRIB_KEY,
    candidate_key: CAND,
    observation_need_key: NEED,
    capability_requirement_set_key: CAP,
    dimension: "RESOURCE_READINESS" as const,
    observation_resource_requirement_key: REQ,
    resource_readiness_observation_context_binding_key: BINDING,
    resource_declaration_id: RD,
    resource_readiness_evaluation_instant_key: `instant|${params?.evaluation_at ?? EVAL_AT}`,
    evaluation_at: params?.evaluation_at ?? EVAL_AT,
    declared_potential_contribution_quantity: {
      kind: "POINT" as const,
      value: 12,
    },
    resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
      "ctx",
  };
}

function makeRequiredAssessment() {
  return {
    observation_resource_requirement_key: REQ,
    resource_requirement: {
      key: REQ,
      candidate_key: CAND,
      observation_need_key: NEED,
      capability_requirement_set_key: CAP,
      resource_key: "WATER",
      unit: "L",
      resource_scope: { kind: "UNSCOPED" as const },
      required_amount: { kind: "POINT" as const, value: 10 },
      valid_from: null,
      valid_until: null,
    },
    status: "NO_EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION" as const,
    semantic_declaration: null,
    has_explicit_required_amount_semantic_declaration: false,
  };
}

function makeKindAssessment(contribution: ReturnType<typeof makeContribution> | null) {
  return {
    observation_resource_requirement_key: REQ,
    resource_readiness_observation_context_binding_key: BINDING,
    resource_declaration_id: RD,
    physical_potential_contribution_declaration_binding_assessment: {} as never,
    physical_potential_contribution_declaration: contribution,
    status:
      contribution === null
        ? ("NOT_APPLICABLE_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_SPECIFICATION" as const)
        : ("NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION" as const),
    semantic_declaration: null,
    has_explicit_potential_contribution_quantity_kind_semantic_declaration:
      false,
  };
}

function makeRawBinding(contribution: ReturnType<typeof makeContribution> | null) {
  return {
    observation_resource_requirement_key: REQ,
    resource_readiness_observation_context_binding_key: BINDING,
    resource_declaration_id: RD,
    resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
      "ctx",
    physical_potential_contribution_declaration_assessment: {
      observation_resource_requirement_key: REQ,
      resource_readiness_observation_context_binding_key: BINDING,
      resource_declaration_id: RD,
      resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
        "ctx",
      quantity_relation_binding_assessment: {} as never,
      status:
        contribution === null
          ? ("NO_EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION" as const)
          : ("EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION_PRESENT" as const),
      declaration: contribution,
      has_explicit_physical_potential_contribution_declaration:
        contribution !== null,
    },
    quantity_relation_binding_assessment: {} as never,
    status:
      contribution === null
        ? ("NO_EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION" as const)
        : ("RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_RAW_RELATION_BASIS_PRESENT" as const),
    raw_relation_basis:
      contribution === null
        ? null
        : {
            key: "raw-basis-key",
            candidate_key: CAND,
            observation_need_key: NEED,
            capability_requirement_set_key: CAP,
            dimension: "RESOURCE_READINESS" as const,
            observation_resource_requirement_key: REQ,
            resource_readiness_observation_context_binding_key: BINDING,
            resource_declaration_id: RD,
            resource_readiness_evaluation_instant_key: `instant|${contribution.evaluation_at}`,
            evaluation_at: contribution.evaluation_at,
            resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
              "ctx",
            physical_potential_contribution_declaration_key: contribution.key,
            declared_potential_contribution_quantity:
              contribution.declared_potential_contribution_quantity,
            contribution_required_amount_relation: {} as never,
            contribution_capacity_relation_entries: [],
            capacity_relation_entry_count: 0,
            has_capacity_relation_entries: false,
          },
    has_declared_potential_contribution_raw_relation_basis:
      contribution !== null,
    capacity_relation_entry_count: 0,
    has_capacity_relation_entries: false,
  };
}

function makeBasis(params: {
  interpretation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityInterpretation;
  contribution_key?: string;
  evaluation_at?: string;
  basis_key_suffix?: string;
}): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasis {
  const contribution_key = params.contribution_key ?? CONTRIB_KEY;
  const evaluation_at = params.evaluation_at ?? EVAL_AT;
  return {
    key: `basis-key|${params.basis_key_suffix ?? params.interpretation}|${contribution_key}|${evaluation_at}`,
    candidate_key: CAND,
    observation_need_key: NEED,
    capability_requirement_set_key: CAP,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key: REQ,
    resource_readiness_observation_context_binding_key: BINDING,
    resource_declaration_id: RD,
    evaluation_at,
    physical_potential_contribution_declaration_key: contribution_key,
    contribution_quantity_kind_semantic_declaration_key: "kind-decl-key",
    required_amount_semantic_declaration_key: "req-decl-key",
    raw_relation_basis_key: "raw-basis-key",
    contribution_quantity_kind: "STOCK_QUANTITY",
    required_amount_quantity_kind: "STOCK_QUANTITY",
    required_amount_role: "MINIMUM_REQUIRED_AMOUNT",
    contribution_required_amount_relation:
      "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_ABOVE_REFERENCE_INTERVAL",
    interpretation: params.interpretation,
  };
}

function make174Binding(params: {
  status: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisStatus;
  unresolved_reasons?: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityUnresolvedReason[];
  interpretation?: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityInterpretation | null;
  contribution?: ReturnType<typeof makeContribution> | null;
  basis?: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasis | null;
}): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisBindingAssessment {
  const contribution =
    params.contribution === undefined
      ? params.status === NOT_APPLICABLE
        ? null
        : makeContribution()
      : params.contribution;
  const interpretation = params.interpretation ?? null;
  const basis =
    params.basis === undefined
      ? interpretation === null
        ? null
        : makeBasis({ interpretation })
      : params.basis;

  return {
    observation_resource_requirement_key: REQ,
    resource_readiness_observation_context_binding_key: BINDING,
    resource_declaration_id: RD,
    raw_relation_binding_assessment: makeRawBinding(contribution) as never,
    required_amount_semantic_declaration_assessment: makeRequiredAssessment(),
    contribution_quantity_kind_semantic_declaration_assessment:
      makeKindAssessment(contribution) as never,
    status: params.status,
    unresolved_reasons: params.unresolved_reasons ?? [],
    compatibility_basis: basis,
    interpretation,
    has_compatibility_basis: basis !== null,
  };
}

function make174Set(
  bindings: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisBindingAssessment[]
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisSetAssessment {
  const candidate: AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisAssessment =
    {
      candidate_key: CAND,
      declared_potential_contribution_raw_relation_assessment: {} as never,
      required_amount_semantic_declaration_assessment: {
        candidate_key: CAND,
        resource_requirement_set_assessment: {} as never,
        requirement_semantic_declaration_assessments: [
          makeRequiredAssessment(),
        ],
        has_explicit_required_amount_semantic_declarations: false,
        model_limitations: [],
      },
      contribution_quantity_kind_semantic_declaration_assessment: null,
      binding_compatibility_basis_assessments: bindings,
      has_required_amount_compatibility_bases: bindings.some(
        (b) => b.has_compatibility_basis
      ),
      has_supporting_required_amount_compatibility_evidence: bindings.some(
        (b) => b.interpretation === SUPPORTING
      ),
      has_contradicting_required_amount_compatibility_evidence: bindings.some(
        (b) => b.interpretation === CONTRADICTING
      ),
      has_unresolved_required_amount_compatibility_assessments: bindings.some(
        (b) => b.status.startsWith("UNRESOLVED_")
      ),
      model_limitations: [],
    };
  return {
    physical_potential_contribution_raw_relation_basis_set: {} as never,
    required_amount_semantic_declaration_set: {} as never,
    declared_potential_contribution_quantity_kind_semantic_declaration_set:
      {} as never,
    candidate_assessments: [candidate],
    has_required_amount_compatibility_bases:
      candidate.has_required_amount_compatibility_bases,
    has_supporting_required_amount_compatibility_evidence:
      candidate.has_supporting_required_amount_compatibility_evidence,
    has_contradicting_required_amount_compatibility_evidence:
      candidate.has_contradicting_required_amount_compatibility_evidence,
    has_unresolved_required_amount_compatibility_assessments:
      candidate.has_unresolved_required_amount_compatibility_assessments,
    model_limitations: [],
  };
}

function build175(
  bindings: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisBindingAssessment[]
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateSet(
    {
      required_amount_compatibility_basis_set: make174Set(bindings),
    }
  );
}

function firstState(set: ReturnType<typeof build175>) {
  return set.candidate_assessments[0]!.binding_state_assessments[0]!;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-175 Canonical Required-Amount Compatibility Evidence State", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.25");
  });

  it("model limitations fixed order", () => {
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE_STATE_MODEL_LIMITATIONS[0],
      "TARGET_REQUIRED_AMOUNT_ACCEPTANCE_SEMANTICS_NOT_MODELED"
    );
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE_STATE_MODEL_LIMITATIONS.at(
        -1
      ),
      "EXECUTION_NOT_MODELED"
    );
  });

  it("NOT_APPLICABLE remains NOT_APPLICABLE (not unresolved)", () => {
    const state = firstState(
      build175([make174Binding({ status: NOT_APPLICABLE })])
    );
    assert.equal(state.canonical_state_value, NOT_APPLICABLE);
    assert.equal(
      isApplicableAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState(
        state.canonical_state_value
      ),
      false
    );
    assert.equal(
      isUnresolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState(
        state.canonical_state_value
      ),
      false
    );
    assert.equal(
      state.canonical_state.physical_potential_contribution_declaration_key,
      null
    );
    assert.equal(
      state.canonical_state.required_amount_compatibility_basis_key,
      null
    );
  });

  it("nine unresolved statuses canonicalize exactly; mismatch/TARGET/FLOW/RANGE ≠ CONTRADICTING", () => {
    const cases: {
      status: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisStatus;
      reason: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityUnresolvedReason;
      expected: AttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue;
    }[] = [
      {
        status:
          "UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION",
        reason: "NO_EXPLICIT_CONTRIBUTION_QUANTITY_KIND_DECLARATION",
        expected:
          "UNRESOLVED_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION",
      },
      {
        status: "UNRESOLVED_NO_EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION",
        reason: "NO_EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION",
        expected: "UNRESOLVED_NO_EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION",
      },
      {
        status: "UNRESOLVED_CONTRIBUTION_QUANTITY_KIND_UNDECLARED",
        reason: "CONTRIBUTION_QUANTITY_KIND_UNDECLARED",
        expected: "UNRESOLVED_CONTRIBUTION_QUANTITY_KIND_UNDECLARED",
      },
      {
        status: "UNRESOLVED_REQUIRED_AMOUNT_QUANTITY_KIND_UNDECLARED",
        reason: "REQUIRED_AMOUNT_QUANTITY_KIND_UNDECLARED",
        expected: "UNRESOLVED_REQUIRED_AMOUNT_QUANTITY_KIND_UNDECLARED",
      },
      {
        status: "UNRESOLVED_CONTRIBUTION_REQUIRED_AMOUNT_QUANTITY_KIND_MISMATCH",
        reason: "CONTRIBUTION_REQUIRED_AMOUNT_QUANTITY_KIND_MISMATCH",
        expected:
          "UNRESOLVED_CONTRIBUTION_REQUIRED_AMOUNT_QUANTITY_KIND_MISMATCH",
      },
      {
        status: "UNRESOLVED_CONTRIBUTION_RANGE_SEMANTICS_NOT_MODELED",
        reason: "CONTRIBUTION_RANGE_SEMANTICS_NOT_MODELED",
        expected: "UNRESOLVED_CONTRIBUTION_RANGE_SEMANTICS_NOT_MODELED",
      },
      {
        status: "UNRESOLVED_REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_MODELED",
        reason: "REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_MODELED",
        expected: "UNRESOLVED_REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_MODELED",
      },
      {
        status:
          "UNRESOLVED_TARGET_REQUIRED_AMOUNT_ACCEPTANCE_SEMANTICS_NOT_MODELED",
        reason: "TARGET_ACCEPTANCE_SEMANTICS_NOT_MODELED",
        expected:
          "UNRESOLVED_TARGET_REQUIRED_AMOUNT_ACCEPTANCE_SEMANTICS_NOT_MODELED",
      },
      {
        status: "UNRESOLVED_FLOW_TIME_BASIS_SEMANTICS_NOT_MODELED",
        reason: "FLOW_TIME_BASIS_SEMANTICS_NOT_MODELED",
        expected: "UNRESOLVED_FLOW_TIME_BASIS_SEMANTICS_NOT_MODELED",
      },
    ];

    for (const entry of cases) {
      const state = firstState(
        build175([
          make174Binding({
            status: entry.status,
            unresolved_reasons: [entry.reason],
          }),
        ])
      );
      assert.equal(state.canonical_state_value, entry.expected);
      assert.notEqual(state.canonical_state_value, CANONICAL_CONTRADICTING);
      assert.deepEqual(state.canonical_state.unresolved_reasons, [
        entry.reason,
      ]);
      assert.equal(
        isUnresolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState(
          state.canonical_state_value
        ),
        true
      );
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState(
          state.canonical_state_value
        ),
        false
      );
    }
  });

  it("SUPPORTING / CONTRADICTING Basis normalize to EXPLICITLY_DERIVED values", () => {
    const supporting = firstState(
      build175([
        make174Binding({
          status:
            "DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_BASIS_PRESENT",
          interpretation: SUPPORTING,
        }),
      ])
    );
    assert.equal(supporting.canonical_state_value, CANONICAL_SUPPORTING);
    assert.ok(
      supporting.canonical_state.required_amount_compatibility_basis_key
    );
    assert.equal(
      supporting.canonical_state.physical_potential_contribution_declaration_key,
      CONTRIB_KEY
    );

    const contradicting = firstState(
      build175([
        make174Binding({
          status:
            "DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_BASIS_PRESENT",
          interpretation: CONTRADICTING,
        }),
      ])
    );
    assert.equal(contradicting.canonical_state_value, CANONICAL_CONTRADICTING);
  });

  it("MINIMUM ABOVE ancestry SUPPORTING and EXACT ABOVE CONTRADICTING preserved without recomputation", () => {
    assert.equal(
      deriveAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue(
        make174Binding({
          status:
            "DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_BASIS_PRESENT",
          interpretation: SUPPORTING,
        })
      ),
      CANONICAL_SUPPORTING
    );
    assert.equal(
      deriveAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateValue(
        make174Binding({
          status:
            "DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_BASIS_PRESENT",
          interpretation: CONTRADICTING,
        })
      ),
      CANONICAL_CONTRADICTING
    );
  });

  it("multiple unresolved reasons preserved; same primary/different secondary → distinct State", () => {
    const multi = firstState(
      build175([
        make174Binding({
          status:
            "UNRESOLVED_TARGET_REQUIRED_AMOUNT_ACCEPTANCE_SEMANTICS_NOT_MODELED",
          unresolved_reasons: [
            "TARGET_ACCEPTANCE_SEMANTICS_NOT_MODELED",
            "FLOW_TIME_BASIS_SEMANTICS_NOT_MODELED",
            "CONTRIBUTION_RANGE_SEMANTICS_NOT_MODELED",
          ],
        }),
      ])
    );
    assert.equal(
      multi.canonical_state_value,
      "UNRESOLVED_TARGET_REQUIRED_AMOUNT_ACCEPTANCE_SEMANTICS_NOT_MODELED"
    );
    assert.equal(multi.canonical_state.unresolved_reasons.length, 3);

    const targetOnly = firstState(
      build175([
        make174Binding({
          status:
            "UNRESOLVED_TARGET_REQUIRED_AMOUNT_ACCEPTANCE_SEMANTICS_NOT_MODELED",
          unresolved_reasons: ["TARGET_ACCEPTANCE_SEMANTICS_NOT_MODELED"],
        }),
      ])
    );
    assert.equal(
      multi.canonical_state_value,
      targetOnly.canonical_state_value
    );
    assert.notEqual(multi.canonical_state.key, targetOnly.canonical_state.key);
  });

  it("resolvedness / applicability / unresolved helpers", () => {
    assert.equal(
      isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState(
        CANONICAL_SUPPORTING
      ),
      true
    );
    assert.equal(
      isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState(
        CANONICAL_CONTRADICTING
      ),
      true
    );
    assert.equal(
      isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState(
        NOT_APPLICABLE
      ),
      false
    );
    for (const value of ALL_UNRESOLVED) {
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState(
          value
        ),
        false
      );
      assert.equal(
        isUnresolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState(
          value
        ),
        true
      );
      assert.equal(
        isApplicableAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState(
          value
        ),
        true
      );
    }
    assert.equal(
      isUnresolvedAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState(
        CANONICAL_SUPPORTING
      ),
      false
    );
    assert.equal(
      isApplicableAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceState(
        CANONICAL_SUPPORTING
      ),
      true
    );
  });

  it("same polarity/different Basis, different instant, different contribution → distinct State keys", () => {
    const a = firstState(
      build175([
        make174Binding({
          status:
            "DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_BASIS_PRESENT",
          interpretation: SUPPORTING,
          basis: makeBasis({
            interpretation: SUPPORTING,
            basis_key_suffix: "equal",
          }),
        }),
      ])
    );
    const b = firstState(
      build175([
        make174Binding({
          status:
            "DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_BASIS_PRESENT",
          interpretation: SUPPORTING,
          basis: makeBasis({
            interpretation: SUPPORTING,
            basis_key_suffix: "above",
          }),
        }),
      ])
    );
    assert.equal(a.canonical_state_value, b.canonical_state_value);
    assert.notEqual(a.canonical_state.key, b.canonical_state.key);

    const instantB = firstState(
      build175([
        make174Binding({
          status:
            "DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_BASIS_PRESENT",
          interpretation: SUPPORTING,
          contribution: makeContribution({ evaluation_at: EVAL_AT_B }),
          basis: makeBasis({
            interpretation: SUPPORTING,
            evaluation_at: EVAL_AT_B,
          }),
        }),
      ])
    );
    assert.notEqual(a.canonical_state.key, instantB.canonical_state.key);

    const contribB = firstState(
      build175([
        make174Binding({
          status:
            "DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_BASIS_PRESENT",
          interpretation: SUPPORTING,
          contribution: makeContribution({ key: CONTRIB_KEY_B }),
          basis: makeBasis({
            interpretation: SUPPORTING,
            contribution_key: CONTRIB_KEY_B,
          }),
        }),
      ])
    );
    assert.notEqual(a.canonical_state.key, contribB.canonical_state.key);
  });

  it("malformed BASIS_PRESENT/null Basis and non-PRESENT with Basis reject", () => {
    assert.throws(() =>
      build175([
        {
          ...make174Binding({
            status:
              "DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_BASIS_PRESENT",
            interpretation: SUPPORTING,
          }),
          compatibility_basis: null,
          has_compatibility_basis: false,
        },
      ])
    );
    assert.throws(() =>
      build175([
        {
          ...make174Binding({
            status: "UNRESOLVED_FLOW_TIME_BASIS_SEMANTICS_NOT_MODELED",
            unresolved_reasons: ["FLOW_TIME_BASIS_SEMANTICS_NOT_MODELED"],
          }),
          compatibility_basis: makeBasis({ interpretation: SUPPORTING }),
          has_compatibility_basis: true,
        },
      ])
    );
  });

  it("Binding cardinality equals GROUND-174 Binding count", () => {
    const set = build175([
      make174Binding({ status: NOT_APPLICABLE }),
      make174Binding({
        status:
          "DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_BASIS_PRESENT",
        interpretation: SUPPORTING,
      }),
    ]);
    assert.equal(
      set.candidate_assessments[0]!.binding_state_assessments.length,
      2
    );
  });

  it("input immutability and pointer-identity equivalence", () => {
    const input = {
      required_amount_compatibility_basis_set: make174Set([
        make174Binding({
          status:
            "DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_BASIS_PRESENT",
          interpretation: CONTRADICTING,
        }),
      ]),
    };
    const before = deepClone(input);
    const out1 =
      buildAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateSet(
        input
      );
    assert.deepEqual(input, before);
    const out2 =
      buildAttentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateSet(
        deepClone(input)
      );
    assert.deepEqual(out1.candidate_assessments, out2.candidate_assessments);
  });

  it("State identity helper matches constructed key", () => {
    const assessment = firstState(
      build175([
        make174Binding({
          status:
            "DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_BASIS_PRESENT",
          interpretation: SUPPORTING,
        }),
      ])
    );
    const state = assessment.canonical_state;
    const helper =
      attentionObservationOperationalEligibilityResourceReadinessCanonicalDeclaredPotentialContributionRequiredAmountCompatibilityEvidenceStateKey(
        {
          candidate_key: state.candidate_key,
          observation_need_key: state.observation_need_key,
          capability_requirement_set_key: state.capability_requirement_set_key,
          observation_resource_requirement_key:
            state.observation_resource_requirement_key,
          resource_readiness_observation_context_binding_key:
            state.resource_readiness_observation_context_binding_key,
          resource_declaration_id: state.resource_declaration_id,
          evaluation_at: state.evaluation_at,
          physical_potential_contribution_declaration_key:
            state.physical_potential_contribution_declaration_key,
          ground174_status:
            assessment.required_amount_compatibility_basis_assessment.status,
          unresolved_reasons: state.unresolved_reasons,
          required_amount_compatibility_basis_key:
            state.required_amount_compatibility_basis_key,
          value: state.value,
        }
      );
    assert.equal(state.key, helper);
  });

  it("static proofs: no polarity recompute / 171/173/157 / satisfaction / capacity composition", () => {
    const core = readFileSync(
      join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-canonical-declared-potential-contribution-required-amount-compatibility-evidence-state-core.ts"
      ),
      "utf8"
    );
    const types = readFileSync(
      join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-canonical-declared-potential-contribution-required-amount-compatibility-evidence-state-types.ts"
      ),
      "utf8"
    );
    const src = `${core}\n${types}`;

    assert.ok(!/required-amount-semantic-declaration-core/.test(core));
    assert.ok(
      !/quantity-kind-semantic-declaration-core/.test(core)
    );
    assert.ok(!/raw-relation-basis-core/.test(core));
    assert.ok(!/canonical-aggregated-declared-potential-contribution-capacity/.test(core));
    assert.ok(!/deriveDeclaredPotentialContributionRawQuantityRelation/.test(core));
    assert.ok(!/MINIMUM_REQUIRED_AMOUNT[\s\S]{0,80}RAW_BELOW/.test(core));
    assert.ok(!/contribution\.value\s*[<>]=?/.test(core));
    assert.ok(!/ResourceAvailability|ResourceReservation/.test(src));
    assert.ok(!/applyPatch|saveProject|ProjectState/.test(core));
    assert.ok(
      !/"SATISFIED"|"UNSATISFIED"|"MEETS_REQUIREMENT"|"FAILS_REQUIREMENT"|"READY"/.test(
        src
      )
    );
    assert.ok(/EXPLICITLY_DERIVED/.test(src));
    assert.ok(/NOT_APPLICABLE ≠ UNRESOLVED/.test(src));
  });
});
