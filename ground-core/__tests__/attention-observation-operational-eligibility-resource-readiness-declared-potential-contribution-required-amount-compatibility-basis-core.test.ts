/**
 * GROUND-174 — Observation Core CXXVIII / Deterministic POINT-STOCK
 * Required-Amount Compatibility Relation Basis Foundation
 *
 * GROUND-157 + GROUND-171 + GROUND-173
 * → deterministic MINIMUM/EXACT polarity for POINT×STOCK only
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationKey,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-physical-potential-contribution-declaration-core.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration,
  AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBindingAssessment,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-physical-potential-contribution-declaration-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawQuantityRelation,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasis,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBindingAssessment,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-raw-relation-basis-types.js";
import {
  attentionObservationResourceRequiredAmountSemanticDeclarationKey,
} from "../reality/attention-observation-resource-required-amount-semantic-declaration-core.js";
import type {
  AttentionCandidateObservationResourceRequiredAmountSemanticDeclarationAssessment,
  AttentionObservationResourceRequiredAmountQuantityKind,
  AttentionObservationResourceRequiredAmountRole,
  AttentionObservationResourceRequiredAmountSemanticDeclarationRequirementAssessment,
  AttentionObservationResourceRequiredAmountSemanticDeclarationSetAssessment,
} from "../reality/attention-observation-resource-required-amount-semantic-declaration-types.js";
import {
  attentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationKey,
} from "../reality/attention-observation-resource-declared-potential-contribution-quantity-kind-semantic-declaration-core.js";
import type {
  AttentionCandidateObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationAssessment,
  AttentionObservationResourceDeclaredPotentialContributionQuantityKind,
  AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationBindingAssessment,
  AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSetAssessment,
} from "../reality/attention-observation-resource-declared-potential-contribution-quantity-kind-semantic-declaration-types.js";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_BASIS_MODEL_LIMITATIONS,
  attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisKey,
  buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisSet,
  deriveAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityInterpretation,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-required-amount-compatibility-basis-core.js";
import type { ResourceRequirementAmount } from "../types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const NEED = "need";
const CAP = "cap-set";
const REQ = "req-key";
const BINDING = "binding-a";
const RD = "rd-1";
const EVAL_AT = "2026-01-01T00:00:00.000Z";

const STOCK = "STOCK_QUANTITY" as const;
const FLOW = "FLOW_QUANTITY" as const;
const UNDECLARED = "UNDECLARED_QUANTITY_KIND" as const;
const MINIMUM = "MINIMUM_REQUIRED_AMOUNT" as const;
const EXACT = "EXACT_REQUIRED_AMOUNT" as const;
const TARGET = "TARGET_REQUIRED_AMOUNT" as const;

const RAW_BELOW =
  "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_BELOW_REFERENCE_INTERVAL" as const;
const RAW_EQUALS =
  "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_EXACTLY_EQUALS_REFERENCE_INTERVAL" as const;
const RAW_ABOVE =
  "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_STRICTLY_ABOVE_REFERENCE_INTERVAL" as const;
const RAW_SUB =
  "DECLARED_POTENTIAL_CONTRIBUTION_INTERVAL_IS_STRICT_SUBINTERVAL_OF_REFERENCE_INTERVAL" as const;

const SUPPORTING =
  "SUPPORTING_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE" as const;
const CONTRADICTING =
  "CONTRADICTING_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_EVIDENCE" as const;

function amountKey(amount: ResourceRequirementAmount): string {
  return amount.kind === "POINT"
    ? `POINT|${amount.value}`
    : `RANGE|${amount.min}|${amount.max}`;
}

function makeContribution(quantity: ResourceRequirementAmount) {
  const key =
    attentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationKey(
      {
        candidate_key: CAND,
        observation_need_key: NEED,
        capability_requirement_set_key: CAP,
        observation_resource_requirement_key: REQ,
        resource_readiness_observation_context_binding_key: BINDING,
        resource_declaration_id: RD,
        evaluation_at: EVAL_AT,
        declared_potential_contribution_quantity_canonical_key:
          amountKey(quantity),
      }
    );
  const declaration: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration =
    {
      key,
      candidate_key: CAND,
      observation_need_key: NEED,
      capability_requirement_set_key: CAP,
      dimension: "RESOURCE_READINESS",
      observation_resource_requirement_key: REQ,
      resource_readiness_observation_context_binding_key: BINDING,
      resource_declaration_id: RD,
      resource_readiness_evaluation_instant_key: `instant|${EVAL_AT}`,
      evaluation_at: EVAL_AT,
      declared_potential_contribution_quantity: quantity,
      resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
        `ctx|${BINDING}`,
    };
  return declaration;
}

function make155Binding(
  declaration: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration | null
): AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclarationBindingAssessment {
  if (declaration === null) {
    return {
      observation_resource_requirement_key: REQ,
      resource_readiness_observation_context_binding_key: BINDING,
      resource_declaration_id: RD,
      resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
        "ctx|absent",
      quantity_relation_binding_assessment: {} as never,
      status:
        "NO_EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION",
      declaration: null,
      has_explicit_physical_potential_contribution_declaration: false,
    };
  }
  return {
    observation_resource_requirement_key:
      declaration.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key:
      declaration.resource_readiness_observation_context_binding_key,
    resource_declaration_id: declaration.resource_declaration_id,
    resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
      declaration.resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key,
    quantity_relation_binding_assessment: {} as never,
    status:
      "EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION_PRESENT",
    declaration,
    has_explicit_physical_potential_contribution_declaration: true,
  };
}

function makeRawBasis(params: {
  contribution: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration;
  required_amount: ResourceRequirementAmount;
  relation: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawQuantityRelation;
}): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasis {
  const required_amount_relation_key = [
    "attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-required-amount-raw-relation",
    params.contribution.key,
    amountKey(params.contribution.declared_potential_contribution_quantity),
    amountKey(params.required_amount),
    params.relation,
  ].join("|");
  return {
    key: [
      "attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-raw-relation-basis",
      CAND,
      NEED,
      CAP,
      "RESOURCE_READINESS",
      REQ,
      BINDING,
      RD,
      EVAL_AT,
      params.contribution.key,
      required_amount_relation_key,
      "NONE",
    ].join("|"),
    candidate_key: CAND,
    observation_need_key: NEED,
    capability_requirement_set_key: CAP,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key: REQ,
    resource_readiness_observation_context_binding_key: BINDING,
    resource_declaration_id: RD,
    resource_readiness_evaluation_instant_key: `instant|${EVAL_AT}`,
    evaluation_at: EVAL_AT,
    resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
      params.contribution
        .resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key,
    physical_potential_contribution_declaration_key: params.contribution.key,
    declared_potential_contribution_quantity:
      params.contribution.declared_potential_contribution_quantity,
    contribution_required_amount_relation: {
      key: required_amount_relation_key,
      reference_kind: "REQUIRED_AMOUNT",
      declared_potential_contribution_quantity:
        params.contribution.declared_potential_contribution_quantity,
      contribution_lower_bound:
        params.contribution.declared_potential_contribution_quantity.kind ===
        "POINT"
          ? params.contribution.declared_potential_contribution_quantity.value
          : params.contribution.declared_potential_contribution_quantity.min,
      contribution_upper_bound:
        params.contribution.declared_potential_contribution_quantity.kind ===
        "POINT"
          ? params.contribution.declared_potential_contribution_quantity.value
          : params.contribution.declared_potential_contribution_quantity.max,
      required_amount: params.required_amount,
      required_amount_lower_bound:
        params.required_amount.kind === "POINT"
          ? params.required_amount.value
          : params.required_amount.min,
      required_amount_upper_bound:
        params.required_amount.kind === "POINT"
          ? params.required_amount.value
          : params.required_amount.max,
      relation: params.relation,
    },
    contribution_capacity_relation_entries: [],
    capacity_relation_entry_count: 0,
    has_capacity_relation_entries: false,
  };
}

function make157Binding(params: {
  contribution: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration | null;
  required_amount?: ResourceRequirementAmount;
  relation?: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawQuantityRelation;
}): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBindingAssessment {
  const declarationAssessment = make155Binding(params.contribution);
  if (params.contribution === null) {
    return {
      observation_resource_requirement_key: REQ,
      resource_readiness_observation_context_binding_key: BINDING,
      resource_declaration_id: RD,
      resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
        "ctx|absent",
      physical_potential_contribution_declaration_assessment:
        declarationAssessment,
      quantity_relation_binding_assessment: {} as never,
      status:
        "NO_EXPLICIT_RESOURCE_READINESS_PHYSICAL_POTENTIAL_CONTRIBUTION_DECLARATION",
      raw_relation_basis: null,
      has_declared_potential_contribution_raw_relation_basis: false,
      capacity_relation_entry_count: 0,
      has_capacity_relation_entries: false,
    };
  }
  const required_amount = params.required_amount ?? {
    kind: "POINT",
    value: 10,
  };
  const relation = params.relation ?? RAW_ABOVE;
  const raw_relation_basis = makeRawBasis({
    contribution: params.contribution,
    required_amount,
    relation,
  });
  return {
    observation_resource_requirement_key: REQ,
    resource_readiness_observation_context_binding_key: BINDING,
    resource_declaration_id: RD,
    resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key:
      params.contribution
        .resource_readiness_declared_capacity_required_amount_quantity_relation_binding_context_key,
    physical_potential_contribution_declaration_assessment:
      declarationAssessment,
    quantity_relation_binding_assessment: {} as never,
    status:
      "RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_RAW_RELATION_BASIS_PRESENT",
    raw_relation_basis,
    has_declared_potential_contribution_raw_relation_basis: true,
    capacity_relation_entry_count: 0,
    has_capacity_relation_entries: false,
  };
}

function make157Set(
  bindings: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBindingAssessment[]
): AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisSetAssessment {
  const candidate: AttentionCandidateObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawRelationBasisAssessment =
    {
      candidate_key: CAND,
      resource_readiness_declared_capacity_required_amount_quantity_relation_assessment:
        {} as never,
      resource_readiness_physical_potential_contribution_declaration_assessment:
        {} as never,
      requirement_raw_relation_assessments: [],
      binding_raw_relation_assessments: bindings,
      has_declared_potential_contribution_raw_relation_bases: bindings.some(
        (b) => b.has_declared_potential_contribution_raw_relation_basis
      ),
      has_capacity_relation_entries: false,
      model_limitations: [],
    };
  return {
    resource_readiness_declared_capacity_required_amount_quantity_relation_set:
      {} as never,
    resource_readiness_physical_potential_contribution_declaration_set:
      {} as never,
    candidate_assessments: [candidate],
    has_declared_potential_contribution_raw_relation_bases:
      candidate.has_declared_potential_contribution_raw_relation_bases,
    has_capacity_relation_entries: false,
    model_limitations: [],
  };
}

function make171Assessment(params: {
  required_amount: ResourceRequirementAmount;
  amount_role?: AttentionObservationResourceRequiredAmountRole | null;
  quantity_kind?: AttentionObservationResourceRequiredAmountQuantityKind | null;
}): AttentionObservationResourceRequiredAmountSemanticDeclarationRequirementAssessment {
  const resource_requirement = {
    key: REQ,
    candidate_key: CAND,
    observation_need_key: NEED,
    capability_requirement_set_key: CAP,
    resource_key: "WATER",
    unit: "L",
    resource_scope: { kind: "UNSCOPED" as const },
    required_amount: params.required_amount,
    valid_from: null,
    valid_until: null,
  };
  if (params.amount_role == null || params.quantity_kind == null) {
    return {
      observation_resource_requirement_key: REQ,
      resource_requirement,
      status: "NO_EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION",
      semantic_declaration: null,
      has_explicit_required_amount_semantic_declaration: false,
    };
  }
  const semantic_declaration = {
    key: attentionObservationResourceRequiredAmountSemanticDeclarationKey({
      candidate_key: CAND,
      observation_need_key: NEED,
      capability_requirement_set_key: CAP,
      observation_resource_requirement_key: REQ,
      amount_role: params.amount_role,
      quantity_kind: params.quantity_kind,
    }),
    candidate_key: CAND,
    observation_need_key: NEED,
    capability_requirement_set_key: CAP,
    dimension: "RESOURCE_READINESS" as const,
    observation_resource_requirement_key: REQ,
    amount_role: params.amount_role,
    quantity_kind: params.quantity_kind,
  };
  return {
    observation_resource_requirement_key: REQ,
    resource_requirement,
    status: "EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION_PRESENT",
    semantic_declaration,
    has_explicit_required_amount_semantic_declaration: true,
  };
}

function make171Set(
  requirement: AttentionObservationResourceRequiredAmountSemanticDeclarationRequirementAssessment
): AttentionObservationResourceRequiredAmountSemanticDeclarationSetAssessment {
  const candidate: AttentionCandidateObservationResourceRequiredAmountSemanticDeclarationAssessment =
    {
      candidate_key: CAND,
      resource_requirement_set_assessment: {} as never,
      requirement_semantic_declaration_assessments: [requirement],
      has_explicit_required_amount_semantic_declarations:
        requirement.has_explicit_required_amount_semantic_declaration,
      model_limitations: [],
    };
  return {
    observation_resource_requirement_set: {} as never,
    specification: { declarations: [] },
    candidate_assessments: [candidate],
    has_explicit_required_amount_semantic_declarations:
      candidate.has_explicit_required_amount_semantic_declarations,
    model_limitations: [],
  };
}

function make173Assessment(params: {
  contribution: AttentionObservationOperationalEligibilityResourceReadinessPhysicalPotentialContributionDeclaration | null;
  quantity_kind?: AttentionObservationResourceDeclaredPotentialContributionQuantityKind | null;
}): AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationBindingAssessment {
  const declarationAssessment = make155Binding(params.contribution);
  if (params.contribution === null) {
    return {
      observation_resource_requirement_key: REQ,
      resource_readiness_observation_context_binding_key: BINDING,
      resource_declaration_id: RD,
      physical_potential_contribution_declaration_binding_assessment:
        declarationAssessment,
      physical_potential_contribution_declaration: null,
      status:
        "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_SPECIFICATION",
      semantic_declaration: null,
      has_explicit_potential_contribution_quantity_kind_semantic_declaration:
        false,
    };
  }
  if (params.quantity_kind == null) {
    return {
      observation_resource_requirement_key: REQ,
      resource_readiness_observation_context_binding_key: BINDING,
      resource_declaration_id: RD,
      physical_potential_contribution_declaration_binding_assessment:
        declarationAssessment,
      physical_potential_contribution_declaration: params.contribution,
      status:
        "NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION",
      semantic_declaration: null,
      has_explicit_potential_contribution_quantity_kind_semantic_declaration:
        false,
    };
  }
  const semantic_declaration = {
    key: attentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationKey(
      {
        candidate_key: CAND,
        observation_need_key: NEED,
        capability_requirement_set_key: CAP,
        observation_resource_requirement_key: REQ,
        resource_readiness_observation_context_binding_key: BINDING,
        resource_declaration_id: RD,
        evaluation_at: EVAL_AT,
        physical_potential_contribution_declaration_key:
          params.contribution.key,
        quantity_kind: params.quantity_kind,
      }
    ),
    candidate_key: CAND,
    observation_need_key: NEED,
    capability_requirement_set_key: CAP,
    dimension: "RESOURCE_READINESS" as const,
    observation_resource_requirement_key: REQ,
    resource_readiness_observation_context_binding_key: BINDING,
    resource_declaration_id: RD,
    evaluation_at: EVAL_AT,
    physical_potential_contribution_declaration_key: params.contribution.key,
    quantity_kind: params.quantity_kind,
  };
  return {
    observation_resource_requirement_key: REQ,
    resource_readiness_observation_context_binding_key: BINDING,
    resource_declaration_id: RD,
    physical_potential_contribution_declaration_binding_assessment:
      declarationAssessment,
    physical_potential_contribution_declaration: params.contribution,
    status:
      "EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_QUANTITY_KIND_SEMANTIC_DECLARATION_PRESENT",
    semantic_declaration,
    has_explicit_potential_contribution_quantity_kind_semantic_declaration:
      true,
  };
}

function make173Set(
  binding: AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationBindingAssessment
): AttentionObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationSetAssessment {
  const candidate: AttentionCandidateObservationResourceDeclaredPotentialContributionQuantityKindSemanticDeclarationAssessment =
    {
      candidate_key: CAND,
      physical_potential_contribution_declaration_assessment: {} as never,
      binding_quantity_kind_semantic_declaration_assessments: [binding],
      has_explicit_potential_contribution_quantity_kind_semantic_declarations:
        binding.has_explicit_potential_contribution_quantity_kind_semantic_declaration,
      model_limitations: [],
    };
  return {
    physical_potential_contribution_declaration_set: {} as never,
    specification: { declarations: [] },
    candidate_assessments: [candidate],
    has_explicit_potential_contribution_quantity_kind_semantic_declarations:
      candidate.has_explicit_potential_contribution_quantity_kind_semantic_declarations,
    model_limitations: [],
  };
}

function build174(params: {
  contributionQuantity?: ResourceRequirementAmount;
  requiredAmount?: ResourceRequirementAmount;
  relation?: AttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRawQuantityRelation;
  amount_role?: AttentionObservationResourceRequiredAmountRole | null;
  required_kind?: AttentionObservationResourceRequiredAmountQuantityKind | null;
  contribution_kind?: AttentionObservationResourceDeclaredPotentialContributionQuantityKind | null;
  noContribution?: boolean;
}) {
  const contribution = params.noContribution
    ? null
    : makeContribution(
        params.contributionQuantity ?? { kind: "POINT", value: 12 }
      );
  const required_amount = params.requiredAmount ?? {
    kind: "POINT",
    value: 10,
  };
  const set157 = make157Set([
    make157Binding({
      contribution,
      required_amount,
      relation: params.relation,
    }),
  ]);
  const set171 = make171Set(
    make171Assessment({
      required_amount,
      amount_role: params.amount_role === undefined ? MINIMUM : params.amount_role,
      quantity_kind:
        params.required_kind === undefined ? STOCK : params.required_kind,
    })
  );
  const set173 = make173Set(
    make173Assessment({
      contribution,
      quantity_kind:
        params.contribution_kind === undefined
          ? STOCK
          : params.contribution_kind,
    })
  );
  return buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisSet(
    {
      physical_potential_contribution_raw_relation_basis_set: set157,
      required_amount_semantic_declaration_set: set171,
      declared_potential_contribution_quantity_kind_semantic_declaration_set:
        set173,
    }
  );
}

function firstBinding(set: ReturnType<typeof build174>) {
  return set.candidate_assessments[0]!.binding_compatibility_basis_assessments[0]!;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-174 Deterministic POINT-STOCK Required-Amount Compatibility Basis", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.24");
  });

  it("model limitations fixed order", () => {
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_BASIS_MODEL_LIMITATIONS[0],
      "TARGET_REQUIRED_AMOUNT_ACCEPTANCE_SEMANTICS_NOT_MODELED"
    );
    assert.equal(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_BASIS_MODEL_LIMITATIONS.at(
        -1
      ),
      "EXECUTION_NOT_MODELED"
    );
  });

  it("MINIMUM BELOW/EQUAL/ABOVE deterministic polarity", () => {
    assert.equal(
      firstBinding(build174({ relation: RAW_BELOW, amount_role: MINIMUM }))
        .interpretation,
      CONTRADICTING
    );
    assert.equal(
      firstBinding(build174({ relation: RAW_EQUALS, amount_role: MINIMUM }))
        .interpretation,
      SUPPORTING
    );
    assert.equal(
      firstBinding(build174({ relation: RAW_ABOVE, amount_role: MINIMUM }))
        .interpretation,
      SUPPORTING
    );
  });

  it("EXACT BELOW/EQUAL/ABOVE deterministic polarity", () => {
    assert.equal(
      firstBinding(build174({ relation: RAW_BELOW, amount_role: EXACT }))
        .interpretation,
      CONTRADICTING
    );
    assert.equal(
      firstBinding(build174({ relation: RAW_EQUALS, amount_role: EXACT }))
        .interpretation,
      SUPPORTING
    );
    assert.equal(
      firstBinding(build174({ relation: RAW_ABOVE, amount_role: EXACT }))
        .interpretation,
      CONTRADICTING
    );
  });

  it("same SUPPORTING polarity / different raw relation → distinct Basis keys", () => {
    const equal = firstBinding(
      build174({ relation: RAW_EQUALS, amount_role: MINIMUM })
    ).compatibility_basis!;
    const above = firstBinding(
      build174({ relation: RAW_ABOVE, amount_role: MINIMUM })
    ).compatibility_basis!;
    assert.equal(equal.interpretation, SUPPORTING);
    assert.equal(above.interpretation, SUPPORTING);
    assert.notEqual(equal.key, above.key);
  });

  it("ABOVE role sensitivity: MINIMUM SUPPORTING / EXACT CONTRADICTING", () => {
    assert.equal(
      firstBinding(build174({ relation: RAW_ABOVE, amount_role: MINIMUM }))
        .interpretation,
      SUPPORTING
    );
    assert.equal(
      firstBinding(build174({ relation: RAW_ABOVE, amount_role: EXACT }))
        .interpretation,
      CONTRADICTING
    );
  });

  it("TARGET unresolved with reason, no Basis", () => {
    const assessment = firstBinding(
      build174({ amount_role: TARGET, relation: RAW_EQUALS })
    );
    assert.equal(assessment.compatibility_basis, null);
    assert.equal(assessment.interpretation, null);
    assert.ok(
      assessment.unresolved_reasons.includes(
        "TARGET_ACCEPTANCE_SEMANTICS_NOT_MODELED"
      )
    );
    assert.equal(
      assessment.status,
      "UNRESOLVED_TARGET_REQUIRED_AMOUNT_ACCEPTANCE_SEMANTICS_NOT_MODELED"
    );
  });

  it("contribution FLOW / required FLOW / both FLOW unresolved", () => {
    for (const entry of [
      { contribution_kind: FLOW, required_kind: STOCK },
      { contribution_kind: STOCK, required_kind: FLOW },
      { contribution_kind: FLOW, required_kind: FLOW },
    ] as const) {
      const assessment = firstBinding(
        build174({
          contribution_kind: entry.contribution_kind,
          required_kind: entry.required_kind,
          amount_role: MINIMUM,
        })
      );
      assert.equal(assessment.compatibility_basis, null);
      assert.ok(
        assessment.unresolved_reasons.includes(
          "FLOW_TIME_BASIS_SEMANTICS_NOT_MODELED"
        )
      );
    }
  });

  it("contribution/required UNDECLARED and missing declarations unresolved distinctly", () => {
    const contribUndeclared = firstBinding(
      build174({ contribution_kind: UNDECLARED })
    );
    assert.ok(
      contribUndeclared.unresolved_reasons.includes(
        "CONTRIBUTION_QUANTITY_KIND_UNDECLARED"
      )
    );

    const requiredUndeclared = firstBinding(
      build174({ required_kind: UNDECLARED })
    );
    assert.ok(
      requiredUndeclared.unresolved_reasons.includes(
        "REQUIRED_AMOUNT_QUANTITY_KIND_UNDECLARED"
      )
    );

    const missingKind = firstBinding(
      build174({ contribution_kind: null })
    );
    assert.ok(
      missingKind.unresolved_reasons.includes(
        "NO_EXPLICIT_CONTRIBUTION_QUANTITY_KIND_DECLARATION"
      )
    );
    assert.ok(
      !missingKind.unresolved_reasons.includes(
        "CONTRIBUTION_QUANTITY_KIND_UNDECLARED"
      )
    );

    const missingRequired = firstBinding(
      build174({ amount_role: null, required_kind: null })
    );
    assert.ok(
      missingRequired.unresolved_reasons.includes(
        "NO_EXPLICIT_REQUIRED_AMOUNT_SEMANTIC_DECLARATION"
      )
    );
  });

  it("kind mismatch unresolved and not CONTRADICTING", () => {
    const assessment = firstBinding(
      build174({
        contribution_kind: STOCK,
        required_kind: FLOW,
        amount_role: MINIMUM,
      })
    );
    assert.equal(assessment.interpretation, null);
    assert.ok(
      assessment.unresolved_reasons.includes(
        "CONTRIBUTION_REQUIRED_AMOUNT_QUANTITY_KIND_MISMATCH"
      )
    );
    assert.notEqual(
      assessment.status,
      "DECLARED_POTENTIAL_CONTRIBUTION_REQUIRED_AMOUNT_COMPATIBILITY_BASIS_PRESENT"
    );
  });

  it("contribution/required RANGE unresolved; both preserve reasons", () => {
    const both = firstBinding(
      build174({
        contributionQuantity: { kind: "RANGE", min: 1, max: 5 },
        requiredAmount: { kind: "RANGE", min: 10, max: 20 },
        relation: RAW_BELOW,
        amount_role: MINIMUM,
      })
    );
    assert.ok(
      both.unresolved_reasons.includes("CONTRIBUTION_RANGE_SEMANTICS_NOT_MODELED")
    );
    assert.ok(
      both.unresolved_reasons.includes(
        "REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_MODELED"
      )
    );
  });

  it("RANGE + TARGET + FLOW preserves all unresolved reasons", () => {
    const assessment = firstBinding(
      build174({
        contributionQuantity: { kind: "RANGE", min: 1, max: 5 },
        requiredAmount: { kind: "RANGE", min: 10, max: 20 },
        contribution_kind: FLOW,
        required_kind: FLOW,
        amount_role: TARGET,
        relation: RAW_BELOW,
      })
    );
    assert.equal(assessment.compatibility_basis, null);
    for (const reason of [
      "CONTRIBUTION_RANGE_SEMANTICS_NOT_MODELED",
      "REQUIRED_AMOUNT_RANGE_SEMANTICS_NOT_MODELED",
      "TARGET_ACCEPTANCE_SEMANTICS_NOT_MODELED",
      "FLOW_TIME_BASIS_SEMANTICS_NOT_MODELED",
    ] as const) {
      assert.ok(assessment.unresolved_reasons.includes(reason));
    }
  });

  it("no GROUND-155 contribution → NOT_APPLICABLE", () => {
    const assessment = firstBinding(build174({ noContribution: true }));
    assert.equal(
      assessment.status,
      "NOT_APPLICABLE_NO_EXPLICIT_DECLARED_POTENTIAL_CONTRIBUTION_SPECIFICATION"
    );
    assert.deepEqual(assessment.unresolved_reasons, []);
    assert.equal(assessment.compatibility_basis, null);
  });

  it("POINT×POINT impossible raw relation token rejects", () => {
    assert.throws(
      () =>
        build174({
          relation: RAW_SUB,
          amount_role: MINIMUM,
          contribution_kind: STOCK,
          required_kind: STOCK,
        }),
      /structurally impossible/
    );
  });

  it("Basis identity includes current relation and role", () => {
    const assessment = firstBinding(
      build174({ relation: RAW_ABOVE, amount_role: MINIMUM })
    );
    const basis = assessment.compatibility_basis!;
    const helper =
      attentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisKey(
        {
          candidate_key: basis.candidate_key,
          observation_need_key: basis.observation_need_key,
          capability_requirement_set_key: basis.capability_requirement_set_key,
          observation_resource_requirement_key:
            basis.observation_resource_requirement_key,
          resource_readiness_observation_context_binding_key:
            basis.resource_readiness_observation_context_binding_key,
          resource_declaration_id: basis.resource_declaration_id,
          evaluation_at: basis.evaluation_at,
          physical_potential_contribution_declaration_key:
            basis.physical_potential_contribution_declaration_key,
          contribution_quantity_kind_semantic_declaration_key:
            basis.contribution_quantity_kind_semantic_declaration_key,
          required_amount_semantic_declaration_key:
            basis.required_amount_semantic_declaration_key,
          raw_relation_basis_key: basis.raw_relation_basis_key,
          contribution_quantity_kind: "STOCK_QUANTITY",
          required_amount_quantity_kind: "STOCK_QUANTITY",
          required_amount_role: MINIMUM,
          contribution_required_amount_relation: RAW_ABOVE,
          interpretation: SUPPORTING,
        }
      );
    assert.equal(basis.key, helper);
  });

  it("input immutability and pointer-identity equivalence", () => {
    const contribution = makeContribution({ kind: "POINT", value: 12 });
    const required_amount = { kind: "POINT" as const, value: 10 };
    const set157 = make157Set([
      make157Binding({
        contribution,
        required_amount,
        relation: RAW_EQUALS,
      }),
    ]);
    const set171 = make171Set(
      make171Assessment({
        required_amount,
        amount_role: EXACT,
        quantity_kind: STOCK,
      })
    );
    const set173 = make173Set(
      make173Assessment({ contribution, quantity_kind: STOCK })
    );
    const input = {
      physical_potential_contribution_raw_relation_basis_set: set157,
      required_amount_semantic_declaration_set: set171,
      declared_potential_contribution_quantity_kind_semantic_declaration_set:
        set173,
    };
    const before = deepClone(input);
    const out1 =
      buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisSet(
        input
      );
    assert.deepEqual(input, before);
    const out2 =
      buildAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityBasisSet(
        deepClone(input)
      );
    assert.deepEqual(out1.candidate_assessments, out2.candidate_assessments);
  });

  it("derive helper tables match role authority", () => {
    assert.equal(
      deriveAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityInterpretation(
        {
          required_amount_role: MINIMUM,
          contribution_required_amount_relation: RAW_BELOW,
        }
      ),
      CONTRADICTING
    );
    assert.equal(
      deriveAttentionObservationOperationalEligibilityResourceReadinessDeclaredPotentialContributionRequiredAmountCompatibilityInterpretation(
        {
          required_amount_role: EXACT,
          contribution_required_amount_relation: RAW_ABOVE,
        }
      ),
      CONTRADICTING
    );
  });

  it("static proofs: no Policy/numeric compare/157 recompute/inference/satisfaction", () => {
    const core = readFileSync(
      join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-required-amount-compatibility-basis-core.ts"
      ),
      "utf8"
    );
    const types = readFileSync(
      join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-declared-potential-contribution-required-amount-compatibility-basis-types.ts"
      ),
      "utf8"
    );
    const src = `${core}\n${types}`;

    assert.ok(!/InterpretationPolicy/.test(core));
    assert.ok(!/canonical-aggregated/.test(core));
    assert.ok(!/deriveDeclaredPotentialContributionRawQuantityRelation/.test(core));
    assert.ok(!/normalizeResourceQuantityClosedInterval/.test(core));
    assert.ok(!/ResourceAvailability|ResourceReservation/.test(src));
    assert.ok(!/applyPatch|saveProject|ProjectState/.test(core));
    assert.ok(!/"SATISFIED"|"UNSATISFIED"|"SUFFICIENT"|"INSUFFICIENT"|"READY"/.test(src));
    // Unusual MINIMUM+BELOW→SUPPORTING must not exist; BELOW must return CONTRADICTING.
    assert.ok(
      /contribution_required_amount_relation === RAW_BELOW\) \{\s*return CONTRADICTING;/.test(
        core
      )
    );
    assert.ok(!/RAW_BELOW\) \{\s*return SUPPORTING;/.test(core));
    assert.ok(!/contribution\.value\s*[<>]=?/.test(core));
    assert.ok(!/required_amount\.value\s*[<>]=?/.test(core));
    assert.ok(/No arbitrary Interpretation Policy/.test(src));
  });
});
