/**
 * GROUND-140 — Observation Core XCIV / Operational Eligibility
 * RESOURCE_READINESS Evidence Evaluation State Interpretation Basis Foundation
 *
 * GROUND-137 current State + GROUND-139 explicit Policy
 * → exact Interpretation Basis (no canonical Evidence State).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
  assertCompatibleResourceReadinessEvidenceInterpretationBasisContexts,
  buildAttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisSet,
  findExactResourceReadinessEvidenceEvaluationStateInterpretationMapping,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-interpretation-basis-core.js";
import {
  buildAttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateSet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-core.js";
import {
  buildAttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicySet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-interpretation-policy-core.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationMapping,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-interpretation-policy-types.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-types.js";
import {
  buildAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-observation-context-binding-core.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSpecification,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-observation-context-binding-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentSet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-raw-evidence-assessment-types.js";
import type {
  AttentionCandidateObservationResourceRequirementSetAssessment,
  AttentionObservationResourceRequirement,
  AttentionObservationResourceRequirementSetAssessment,
} from "../reality/attention-observation-resource-requirement-types.js";
import type { ResourceAssessment } from "../reality/resource-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const NEED_KEY = "need";
const CAP_SET_KEY = "cap-set-key";
const RD1 = "rd-00000000-0000-4000-8000-000000000001";
const RD2 = "rd-00000000-0000-4000-8000-000000000002";
const RD3 = "rd-00000000-0000-4000-8000-000000000003";
const AT = "2026-09-02T12:00:00.000Z";
const INSTANT_KEY =
  "instant|cand|need|cap-set|RESOURCE_READINESS|2026-09-02T12:00:00.000Z";

const AS_POSITIVE = "INTERPRET_AS_RESOURCE_READINESS_EVIDENCE_POSITIVE" as const;
const AS_NEGATIVE = "INTERPRET_AS_RESOURCE_READINESS_EVIDENCE_NEGATIVE" as const;

function assertNoCanonicalReadinessSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"RESOURCE_READY"/.test(json));
  assert.ok(!/"RESOURCE_NOT_READY"/.test(json));
  assert.ok(!/"EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_POSITIVE"/.test(json));
  assert.ok(!/"EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_NEGATIVE"/.test(json));
  assert.ok(!/"UNRESOLVED_NO_EXPLICIT_RESOURCE_READINESS"/.test(json));
  assert.ok(!/"INTERPRET_AS_UNRESOLVED"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
}

function fullFoundState(
  overrides: Partial<AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue> = {}
): AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue {
  return {
    declaration_lookup_status: "BOUND_RESOURCE_DECLARATION_FOUND",
    requirement_temporal_relation:
      "OBSERVATION_RESOURCE_REQUIREMENT_APPLIES_AT_EVALUATION_INSTANT",
    resource_key_relation: "RESOURCE_KEY_EXACT_MATCH",
    resource_unit_relation: "RESOURCE_UNIT_EXACT_MATCH",
    resource_scope_relation: "RESOURCE_SCOPE_EXACT_MATCH",
    resource_declaration_assessment_status: "RESOURCE_DECLARATION_ACTIVE",
    availability_assessment_status: "AVAILABLE_DECLARED",
    capacity_assessment_status: "ACTIVE_CAPACITY_DECLARATIONS_PRESENT",
    has_multiple_capacity_declarations: false,
    has_capacity_divergence: false,
    has_temporal_basis_mismatch: false,
    ...overrides,
  };
}

function notFoundState(
  overrides: Partial<AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue> = {}
): AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue {
  return {
    declaration_lookup_status: "BOUND_RESOURCE_DECLARATION_NOT_FOUND",
    requirement_temporal_relation:
      "OBSERVATION_RESOURCE_REQUIREMENT_APPLIES_AT_EVALUATION_INSTANT",
    resource_key_relation: null,
    resource_unit_relation: null,
    resource_scope_relation: null,
    resource_declaration_assessment_status: null,
    availability_assessment_status: null,
    capacity_assessment_status: null,
    has_multiple_capacity_declarations: null,
    has_capacity_divergence: null,
    has_temporal_basis_mismatch: null,
    ...overrides,
  };
}

function mockResourceAssessment(
  overrides: Partial<ResourceAssessment> = {}
): ResourceAssessment {
  return {
    resource: {
      id: RD1,
      project_id: "p",
      holder_entity_id: "h",
      resource_key: "SENSOR_POWER",
      unit: "WH",
      scope: { kind: "UNSCOPED" },
      resource_entity_id: null,
      description: null,
      valid_from: "2026-09-01T00:00:00.000Z",
      valid_until: null,
      declared_by: { kind: "human", label: "ops" },
      recorded_at: "2026-09-01T00:00:00.000Z",
      created_at: "2026-09-01T00:00:00.000Z",
      updated_at: "2026-09-01T00:00:00.000Z",
    },
    at: AT,
    declaration_status: "RESOURCE_DECLARATION_ACTIVE",
    capacity: {
      resource_declaration_id: RD1,
      at: AT,
      status: "ACTIVE_CAPACITY_DECLARATIONS_PRESENT",
      capacity_declaration_ids: ["cap-1"],
      capacities: [{ kind: "POINT", value: 100 }],
      declarers: [{ kind: "human", label: "ops" }],
      has_multiple_capacity_declarations: false,
      has_capacity_divergence: false,
    },
    availability: {
      resource_declaration_id: RD1,
      at: AT,
      status: "AVAILABLE_DECLARED",
      availability_declaration_ids: ["avail-1"],
      available_declaration_ids: ["avail-1"],
      unavailable_declaration_ids: [],
      declarers: [{ kind: "human", label: "ops" }],
    },
    has_active_resource_declaration: true,
    has_capacity_declaration: true,
    has_capacity_divergence: false,
    has_available_declaration: true,
    has_unavailable_declaration: false,
    has_contested_availability: false,
    has_temporal_basis_mismatch: false,
    ...overrides,
  };
}

function mockResourceRequirement(
  overrides: Partial<AttentionObservationResourceRequirement> & { key: string }
): AttentionObservationResourceRequirement {
  return {
    candidate_key: CAND,
    observation_need_key: NEED_KEY,
    capability_requirement_set_key: CAP_SET_KEY,
    resource_key: "SENSOR_POWER",
    unit: "WH",
    resource_scope: { kind: "UNSCOPED" },
    required_amount: { kind: "POINT", value: 50 },
    valid_from: null,
    valid_until: null,
    ...overrides,
  };
}

const R1 = mockResourceRequirement({ key: "req-r1", resource_key: "SENSOR_POWER" });
const R2 = mockResourceRequirement({
  key: "req-r2",
  resource_key: "NETWORK_BANDWIDTH",
  unit: "MBPS",
});
const R3 = mockResourceRequirement({ key: "req-r3", resource_key: "COMPUTE", unit: "GB" });

function mock132Candidate(
  overrides: Partial<AttentionCandidateObservationResourceRequirementSetAssessment> & {
    candidate_key: string;
  }
): AttentionCandidateObservationResourceRequirementSetAssessment {
  const { candidate_key, ...rest } = overrides;
  return {
    candidate_key,
    capability_requirement_assessment: {} as never,
    status: "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT",
    resource_requirements: [R1, R2, R3],
    has_explicit_observation_resource_requirement_set: true,
    has_observation_resource_requirements: true,
    model_limitations: [],
    ...rest,
  };
}

function mock132Set(options?: {
  candidates?: (Partial<AttentionCandidateObservationResourceRequirementSetAssessment> & {
    candidate_key: string;
  })[];
}): AttentionObservationResourceRequirementSetAssessment {
  const candidates = options?.candidates ?? [{ candidate_key: CAND }];
  return {
    capability_requirement_set: {} as never,
    specification: { candidate_requirement_sets: [] },
    candidate_assessments: candidates.map((c) =>
      mock132Candidate(c as AttentionCandidateObservationResourceRequirementSetAssessment)
    ),
    has_explicit_observation_resource_requirement_sets: true,
    has_observation_resource_requirements: true,
    model_limitations: [],
  };
}

function build133(
  specification: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSpecification = {
    candidate_binding_sets: [
      {
        candidate_key: CAND,
        bindings: [
          {
            observation_resource_requirement_key: R1.key,
            resource_declaration_id: RD1,
          },
        ],
      },
    ],
  }
): AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment {
  return buildAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment(
    {
      observation_resource_requirement_set: mock132Set(),
      specification,
    }
  );
}

function multiBindingSpec(): AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSpecification {
  return {
    candidate_binding_sets: [
      {
        candidate_key: CAND,
        bindings: [
          {
            observation_resource_requirement_key: R1.key,
            resource_declaration_id: RD1,
          },
          {
            observation_resource_requirement_key: R1.key,
            resource_declaration_id: RD2,
          },
          {
            observation_resource_requirement_key: R2.key,
            resource_declaration_id: RD3,
          },
        ],
      },
    ],
  };
}

function bindingAt(
  bindingSet: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
  index = 0
) {
  return bindingSet.candidate_assessments[0]!.bindings[index]!;
}

function mockRawFromBinding(
  binding: {
    key: string;
    candidate_key: string;
    observation_need_key: string;
    capability_requirement_set_key: string;
    observation_resource_requirement_key: string;
    resource_declaration_id: string;
  },
  overrides: Partial<AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment> = {}
): AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment {
  const found =
    overrides.resource_declaration_lookup_status !==
    "BOUND_RESOURCE_DECLARATION_NOT_FOUND";
  return {
    key: overrides.key ?? `raw|${binding.key}|FOUND`,
    candidate_key: binding.candidate_key,
    observation_need_key: binding.observation_need_key,
    capability_requirement_set_key: binding.capability_requirement_set_key,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key:
      binding.observation_resource_requirement_key,
    resource_readiness_observation_context_binding_key: binding.key,
    resource_declaration_id: binding.resource_declaration_id,
    resource_readiness_evaluation_instant_key: INSTANT_KEY,
    evaluation_at: AT,
    resource_declaration_lookup_status: "BOUND_RESOURCE_DECLARATION_FOUND",
    requirement_temporal_relation:
      "OBSERVATION_RESOURCE_REQUIREMENT_APPLIES_AT_EVALUATION_INSTANT",
    resource_key_relation: found ? "RESOURCE_KEY_EXACT_MATCH" : null,
    resource_unit_relation: found ? "RESOURCE_UNIT_EXACT_MATCH" : null,
    resource_scope_relation: found ? "RESOURCE_SCOPE_EXACT_MATCH" : null,
    resource_assessment: found
      ? mockResourceAssessment({
          resource: {
            ...mockResourceAssessment().resource,
            id: binding.resource_declaration_id,
          },
          capacity: {
            ...mockResourceAssessment().capacity,
            resource_declaration_id: binding.resource_declaration_id,
          },
          availability: {
            ...mockResourceAssessment().availability,
            resource_declaration_id: binding.resource_declaration_id,
          },
        })
      : null,
    ...overrides,
  };
}

function mockRawNotFoundFromBinding(
  binding: {
    key: string;
    candidate_key: string;
    observation_need_key: string;
    capability_requirement_set_key: string;
    observation_resource_requirement_key: string;
    resource_declaration_id: string;
  },
  overrides: Partial<AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment> = {}
): AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment {
  return mockRawFromBinding(binding, {
    key: overrides.key ?? `raw|${binding.key}|NOT_FOUND`,
    resource_declaration_lookup_status: "BOUND_RESOURCE_DECLARATION_NOT_FOUND",
    resource_key_relation: null,
    resource_unit_relation: null,
    resource_scope_relation: null,
    resource_assessment: null,
    ...overrides,
  });
}

function mock135Candidate(
  raws: AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment[],
  overrides: Partial<AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment> = {}
): AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment {
  const status =
    overrides.status ??
    (raws.length > 0
      ? "RESOURCE_READINESS_RAW_EVIDENCE_ASSESSMENTS_PRESENT"
      : "NO_EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_DECLARED");
  return {
    candidate_key: CAND,
    resource_readiness_evaluation_instant_assessment: {} as never,
    status,
    requirement_raw_evidence_assessments: [],
    raw_binding_evidence_assessments: raws,
    has_resource_readiness_raw_evidence_assessments: raws.length > 0,
    model_limitations: [],
    ...overrides,
  };
}

function mock135Set(
  candidates: AttentionCandidateObservationOperationalEligibilityResourceReadinessRawEvidenceAssessment[]
): AttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentSet {
  return {
    resource_readiness_observation_context_binding_set: {} as never,
    resource_readiness_evaluation_instant_set: {} as never,
    candidate_assessments: candidates,
    has_resource_readiness_raw_evidence_assessments: candidates.some(
      (c) => c.has_resource_readiness_raw_evidence_assessments
    ),
    model_limitations: [],
  };
}

function build137(
  bindingSet: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
  rawBuilder: (
    bindings: ReturnType<typeof bindingAt>[]
  ) => AttentionObservationOperationalEligibilityResourceReadinessRawBindingEvidenceAssessment[]
) {
  const bindings = bindingSet.candidate_assessments[0]!.bindings;
  return buildAttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateSet(
    {
      resource_readiness_raw_evidence_assessment_set: mock135Set([
        mock135Candidate(rawBuilder(bindings)),
      ]),
    }
  );
}

function build137NoInstant(
  candidateStatus:
    | "NO_EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_DECLARED"
    | "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
    | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" = "NO_EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_DECLARED"
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateSet(
    {
      resource_readiness_raw_evidence_assessment_set: mock135Set([
        mock135Candidate([], {
          status: candidateStatus,
        }),
      ]),
    }
  );
}

function build139(
  bindingSet: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
  bindingPolicies: {
    resource_readiness_observation_context_binding_key: string;
    mappings: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationMapping[];
  }[]
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicySet(
    {
      resource_readiness_observation_context_binding_set: bindingSet,
      specification: { binding_policies: bindingPolicies },
    }
  );
}

function build140(
  evaluationStateSet: ReturnType<typeof build137>,
  policySet: ReturnType<typeof build139>
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationBasisSet(
    {
      resource_readiness_evidence_evaluation_state_set: evaluationStateSet,
      resource_readiness_evidence_interpretation_policy_set: policySet,
    }
  );
}

describe("GROUND-140 RESOURCE_READINESS Evidence Interpretation Basis", () => {
  describe("NO_POLICY / NO_MAPPING / BASIS_PRESENT", () => {
    it("current State + NO_POLICY", () => {
      const bindingSet = build133();
      const evaluationStateSet = build137(bindingSet, (bindings) => [
        mockRawFromBinding(bindings[0]!),
      ]);
      const policySet = build139(bindingSet, []);
      const set = build140(evaluationStateSet, policySet);
      const assessment = set.candidate_assessments[0]!.binding_basis_assessments[0]!;
      assert.equal(
        assessment.status,
        "NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(assessment.interpretation_basis, null);
      assert.equal(
        assessment.has_resource_readiness_evidence_interpretation_basis,
        false
      );
      assertNoCanonicalReadinessSemantics(set);
    });

    it("current State + explicit empty policy → NO_MAPPING", () => {
      const bindingSet = build133();
      const binding = bindingAt(bindingSet);
      const evaluationStateSet = build137(bindingSet, (bindings) => [
        mockRawFromBinding(bindings[0]!),
      ]);
      const policySet = build139(bindingSet, [
        {
          resource_readiness_observation_context_binding_key: binding.key,
          mappings: [],
        },
      ]);
      const set = build140(evaluationStateSet, policySet);
      const assessment = set.candidate_assessments[0]!.binding_basis_assessments[0]!;
      assert.equal(
        assessment.status,
        "NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
      );
      assert.equal(assessment.interpretation_basis, null);
      assert.equal(
        assessment.has_resource_readiness_evidence_interpretation_basis,
        false
      );
    });

    it("NO_POLICY != NO_MAPPING; explicit empty != policy absence", () => {
      const bindingSet = build133();
      const binding = bindingAt(bindingSet);
      const evaluationStateSet = build137(bindingSet, (bindings) => [
        mockRawFromBinding(bindings[0]!),
      ]);
      const noPolicy = build140(evaluationStateSet, build139(bindingSet, []));
      const emptyPolicy = build140(
        evaluationStateSet,
        build139(bindingSet, [
          {
            resource_readiness_observation_context_binding_key: binding.key,
            mappings: [],
          },
        ])
      );
      assert.notEqual(
        noPolicy.candidate_assessments[0]!.binding_basis_assessments[0]!.status,
        emptyPolicy.candidate_assessments[0]!.binding_basis_assessments[0]!
          .status
      );
    });

    it("partial policy + mapped current State → BASIS_PRESENT", () => {
      const bindingSet = build133();
      const binding = bindingAt(bindingSet);
      const stateValue = fullFoundState();
      const evaluationStateSet = build137(bindingSet, (bindings) => [
        mockRawFromBinding(bindings[0]!),
      ]);
      const policySet = build139(bindingSet, [
        {
          resource_readiness_observation_context_binding_key: binding.key,
          mappings: [
            {
              resource_readiness_evidence_evaluation_state_value: stateValue,
              interpretation: AS_POSITIVE,
            },
          ],
        },
      ]);
      const set = build140(evaluationStateSet, policySet);
      const assessment = set.candidate_assessments[0]!.binding_basis_assessments[0]!;
      assert.equal(
        assessment.status,
        "RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT"
      );
      assert.ok(assessment.interpretation_basis);
      assert.equal(
        assessment.interpretation_basis!.interpretation,
        AS_POSITIVE
      );
      assert.equal(
        assessment.has_resource_readiness_evidence_interpretation_basis,
        true
      );
      assert.equal(set.has_resource_readiness_evidence_interpretation_bases, true);
    });

    it("partial policy + unmapped current State → NO_MAPPING", () => {
      const bindingSet = build133();
      const binding = bindingAt(bindingSet);
      const evaluationStateSet = build137(bindingSet, (bindings) => [
        mockRawFromBinding(bindings[0]!),
      ]);
      const policySet = build139(bindingSet, [
        {
          resource_readiness_observation_context_binding_key: binding.key,
          mappings: [
            {
              resource_readiness_evidence_evaluation_state_value: notFoundState(),
              interpretation: AS_POSITIVE,
            },
          ],
        },
      ]);
      const set = build140(evaluationStateSet, policySet);
      assert.equal(
        set.candidate_assessments[0]!.binding_basis_assessments[0]!.status,
        "NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
      );
    });
  });

  describe("unusual mapping preservation", () => {
    it("favorable-looking State → NEGATIVE", () => {
      const bindingSet = build133();
      const binding = bindingAt(bindingSet);
      const evaluationStateSet = build137(bindingSet, (bindings) => [
        mockRawFromBinding(bindings[0]!),
      ]);
      const policySet = build139(bindingSet, [
        {
          resource_readiness_observation_context_binding_key: binding.key,
          mappings: [
            {
              resource_readiness_evidence_evaluation_state_value: fullFoundState(),
              interpretation: AS_NEGATIVE,
            },
          ],
        },
      ]);
      const basis = build140(evaluationStateSet, policySet).candidate_assessments[0]!
        .binding_basis_assessments[0]!.interpretation_basis!;
      assert.equal(basis.interpretation, AS_NEGATIVE);
    });

    it("NOT_FOUND → POSITIVE", () => {
      const bindingSet = build133();
      const binding = bindingAt(bindingSet);
      const evaluationStateSet = build137(bindingSet, (bindings) => [
        mockRawNotFoundFromBinding(bindings[0]!),
      ]);
      const policySet = build139(bindingSet, [
        {
          resource_readiness_observation_context_binding_key: binding.key,
          mappings: [
            {
              resource_readiness_evidence_evaluation_state_value: notFoundState(),
              interpretation: AS_POSITIVE,
            },
          ],
        },
      ]);
      assert.equal(
        build140(evaluationStateSet, policySet).candidate_assessments[0]!
          .binding_basis_assessments[0]!.interpretation_basis!.interpretation,
        AS_POSITIVE
      );
    });

    it("UNAVAILABLE → POSITIVE", () => {
      const bindingSet = build133();
      const binding = bindingAt(bindingSet);
      const assessment = mockResourceAssessment({
        availability: {
          ...mockResourceAssessment().availability,
          status: "UNAVAILABLE_DECLARED",
          available_declaration_ids: [],
          unavailable_declaration_ids: ["unavail-1"],
        },
        has_available_declaration: false,
        has_unavailable_declaration: true,
      });
      const evaluationStateSet = build137(bindingSet, (bindings) => [
        mockRawFromBinding(bindings[0]!, { resource_assessment: assessment }),
      ]);
      const stateValue = fullFoundState({
        availability_assessment_status: "UNAVAILABLE_DECLARED",
      });
      const policySet = build139(bindingSet, [
        {
          resource_readiness_observation_context_binding_key: binding.key,
          mappings: [
            {
              resource_readiness_evidence_evaluation_state_value: stateValue,
              interpretation: AS_POSITIVE,
            },
          ],
        },
      ]);
      assert.equal(
        build140(evaluationStateSet, policySet).candidate_assessments[0]!
          .binding_basis_assessments[0]!.interpretation_basis!.interpretation,
        AS_POSITIVE
      );
    });

    it("CONTESTED → POSITIVE and NEGATIVE in separate policies", () => {
      const bindingSet = build133(multiBindingSpec());
      const b0 = bindingAt(bindingSet, 0);
      const b1 = bindingAt(bindingSet, 1);
      const contestedAssessment = mockResourceAssessment({
        availability: {
          ...mockResourceAssessment().availability,
          status: "CONTESTED_AVAILABILITY",
          available_declaration_ids: ["avail-1"],
          unavailable_declaration_ids: ["unavail-1"],
        },
        has_available_declaration: true,
        has_unavailable_declaration: true,
        has_contested_availability: true,
      });
      const evaluationStateSet = build137(bindingSet, () => [
        mockRawFromBinding(b0, { resource_assessment: contestedAssessment }),
        mockRawFromBinding(b1, {
          key: `raw|${b1.key}|CONTESTED`,
          resource_assessment: {
            ...contestedAssessment,
            resource: {
              ...contestedAssessment.resource,
              id: b1.resource_declaration_id,
            },
          },
        }),
      ]);
      const contestedState = fullFoundState({
        availability_assessment_status: "CONTESTED_AVAILABILITY",
      });
      const policySet = build139(bindingSet, [
        {
          resource_readiness_observation_context_binding_key: b0.key,
          mappings: [
            {
              resource_readiness_evidence_evaluation_state_value: contestedState,
              interpretation: AS_POSITIVE,
            },
          ],
        },
        {
          resource_readiness_observation_context_binding_key: b1.key,
          mappings: [
            {
              resource_readiness_evidence_evaluation_state_value: contestedState,
              interpretation: AS_NEGATIVE,
            },
          ],
        },
      ]);
      const set = build140(evaluationStateSet, policySet);
      const byBinding = new Map(
        set.candidate_assessments[0]!.binding_basis_assessments.map((a) => [
          a.resource_readiness_observation_context_binding_key,
          a,
        ])
      );
      assert.equal(
        byBinding.get(b0.key)!.interpretation_basis!.interpretation,
        AS_POSITIVE
      );
      assert.equal(
        byBinding.get(b1.key)!.interpretation_basis!.interpretation,
        AS_NEGATIVE
      );
    });

    it("MISMATCH → POSITIVE", () => {
      const bindingSet = build133();
      const binding = bindingAt(bindingSet);
      const evaluationStateSet = build137(bindingSet, (bindings) => [
        mockRawFromBinding(bindings[0]!, {
          resource_key_relation: "RESOURCE_KEY_DOES_NOT_EXACT_MATCH",
          resource_unit_relation: "RESOURCE_UNIT_DOES_NOT_EXACT_MATCH",
          resource_scope_relation: "RESOURCE_SCOPE_DOES_NOT_EXACT_MATCH",
        }),
      ]);
      const stateValue = fullFoundState({
        resource_key_relation: "RESOURCE_KEY_DOES_NOT_EXACT_MATCH",
        resource_unit_relation: "RESOURCE_UNIT_DOES_NOT_EXACT_MATCH",
        resource_scope_relation: "RESOURCE_SCOPE_DOES_NOT_EXACT_MATCH",
      });
      const policySet = build139(bindingSet, [
        {
          resource_readiness_observation_context_binding_key: binding.key,
          mappings: [
            {
              resource_readiness_evidence_evaluation_state_value: stateValue,
              interpretation: AS_POSITIVE,
            },
          ],
        },
      ]);
      assert.equal(
        build140(evaluationStateSet, policySet).candidate_assessments[0]!
          .binding_basis_assessments[0]!.interpretation_basis!.interpretation,
        AS_POSITIVE
      );
    });

    it("APPLIES → NEGATIVE", () => {
      const bindingSet = build133();
      const binding = bindingAt(bindingSet);
      const evaluationStateSet = build137(bindingSet, (bindings) => [
        mockRawFromBinding(bindings[0]!),
      ]);
      const policySet = build139(bindingSet, [
        {
          resource_readiness_observation_context_binding_key: binding.key,
          mappings: [
            {
              resource_readiness_evidence_evaluation_state_value: fullFoundState(),
              interpretation: AS_NEGATIVE,
            },
          ],
        },
      ]);
      assert.equal(
        build140(evaluationStateSet, policySet).candidate_assessments[0]!
          .binding_basis_assessments[0]!.interpretation_basis!.interpretation,
        AS_NEGATIVE
      );
    });

    it("DOES_NOT_APPLY → POSITIVE", () => {
      const bindingSet = build133();
      const binding = bindingAt(bindingSet);
      const evaluationStateSet = build137(bindingSet, (bindings) => [
        mockRawFromBinding(bindings[0]!, {
          requirement_temporal_relation:
            "OBSERVATION_RESOURCE_REQUIREMENT_DOES_NOT_APPLY_AT_EVALUATION_INSTANT",
        }),
      ]);
      const stateValue = fullFoundState({
        requirement_temporal_relation:
          "OBSERVATION_RESOURCE_REQUIREMENT_DOES_NOT_APPLY_AT_EVALUATION_INSTANT",
      });
      const policySet = build139(bindingSet, [
        {
          resource_readiness_observation_context_binding_key: binding.key,
          mappings: [
            {
              resource_readiness_evidence_evaluation_state_value: stateValue,
              interpretation: AS_POSITIVE,
            },
          ],
        },
      ]);
      assert.equal(
        build140(evaluationStateSet, policySet).candidate_assessments[0]!
          .binding_basis_assessments[0]!.interpretation_basis!.interpretation,
        AS_POSITIVE
      );
    });
  });

  describe("lineage / identity / mixed outcomes", () => {
    it("Basis retains State/Basis/Policy/mapping/interpretation lineage", () => {
      const bindingSet = build133();
      const binding = bindingAt(bindingSet);
      const evaluationStateSet = build137(bindingSet, (bindings) => [
        mockRawFromBinding(bindings[0]!),
      ]);
      const state =
        evaluationStateSet.candidate_assessments[0]!.evidence_evaluation_states[0]!;
      const stateBasis =
        evaluationStateSet.candidate_assessments[0]!
          .evidence_evaluation_state_bases[0]!;
      const policySet = build139(bindingSet, [
        {
          resource_readiness_observation_context_binding_key: binding.key,
          mappings: [
            {
              resource_readiness_evidence_evaluation_state_value: fullFoundState(),
              interpretation: AS_POSITIVE,
            },
          ],
        },
      ]);
      const policy =
        policySet.candidate_assessments[0]!.binding_policy_assessments[0]!
          .policy!;
      const basis = build140(evaluationStateSet, policySet).candidate_assessments[0]!
        .binding_basis_assessments[0]!.interpretation_basis!;
      assert.equal(
        basis.resource_readiness_evidence_evaluation_state_key,
        state.key
      );
      assert.equal(
        basis.resource_readiness_evidence_evaluation_state_basis_key,
        stateBasis.key
      );
      assert.equal(
        basis.resource_readiness_evidence_interpretation_policy_key,
        policy.key
      );
      assert.ok(basis.matched_interpretation_mapping_key.length > 0);
      assert.equal(basis.interpretation, AS_POSITIVE);
      assert.deepEqual(
        basis.resource_readiness_evidence_evaluation_state_value,
        state.evaluation_state
      );
    });

    it("same State value / different binding → distinct Basis identities", () => {
      const bindingSet = build133(multiBindingSpec());
      const b0 = bindingAt(bindingSet, 0);
      const b1 = bindingAt(bindingSet, 1);
      const evaluationStateSet = build137(bindingSet, () => [
        mockRawFromBinding(b0),
        mockRawFromBinding(b1, { key: `raw|${b1.key}|FOUND` }),
      ]);
      const policySet = build139(bindingSet, [
        {
          resource_readiness_observation_context_binding_key: b0.key,
          mappings: [
            {
              resource_readiness_evidence_evaluation_state_value: fullFoundState(),
              interpretation: AS_POSITIVE,
            },
          ],
        },
        {
          resource_readiness_observation_context_binding_key: b1.key,
          mappings: [
            {
              resource_readiness_evidence_evaluation_state_value: fullFoundState(),
              interpretation: AS_POSITIVE,
            },
          ],
        },
      ]);
      const set = build140(evaluationStateSet, policySet);
      const bases = set.candidate_assessments[0]!.binding_basis_assessments
        .filter((a) => a.interpretation_basis)
        .map((a) => a.interpretation_basis!.key);
      assert.equal(bases.length, 2);
      assert.notEqual(bases[0], bases[1]);
    });

    it("mixed BASIS_PRESENT / NO_MAPPING / NO_POLICY coexist", () => {
      const bindingSet = build133(multiBindingSpec());
      const b0 = bindingAt(bindingSet, 0);
      const b1 = bindingAt(bindingSet, 1);
      const b2 = bindingAt(bindingSet, 2);
      const evaluationStateSet = build137(bindingSet, () => [
        mockRawFromBinding(b0),
        mockRawFromBinding(b1, { key: `raw|${b1.key}|FOUND` }),
        mockRawFromBinding(b2, { key: `raw|${b2.key}|FOUND` }),
      ]);
      const policySet = build139(bindingSet, [
        {
          resource_readiness_observation_context_binding_key: b0.key,
          mappings: [
            {
              resource_readiness_evidence_evaluation_state_value: fullFoundState(),
              interpretation: AS_POSITIVE,
            },
          ],
        },
        {
          resource_readiness_observation_context_binding_key: b1.key,
          mappings: [],
        },
      ]);
      const set = build140(evaluationStateSet, policySet);
      const byKey = new Map(
        set.candidate_assessments[0]!.binding_basis_assessments.map((a) => [
          a.resource_readiness_observation_context_binding_key,
          a.status,
        ])
      );
      assert.equal(
        byKey.get(b0.key),
        "RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT"
      );
      assert.equal(
        byKey.get(b1.key),
        "NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
      );
      assert.equal(
        byKey.get(b2.key),
        "NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(set.has_resource_readiness_evidence_interpretation_bases, true);
    });

    it("policy without current State → no synthetic Basis assessment", () => {
      const bindingSet = build133();
      const binding = bindingAt(bindingSet);
      const evaluationStateSet = build137NoInstant();
      const policySet = build139(bindingSet, [
        {
          resource_readiness_observation_context_binding_key: binding.key,
          mappings: [
            {
              resource_readiness_evidence_evaluation_state_value: fullFoundState(),
              interpretation: AS_POSITIVE,
            },
          ],
        },
      ]);
      const set = build140(evaluationStateSet, policySet);
      assert.equal(
        set.candidate_assessments[0]!.binding_basis_assessments.length,
        0
      );
      assert.equal(set.has_resource_readiness_evidence_interpretation_bases, false);
    });

    it("missing policy binding counterpart rejects", () => {
      const bindingSet = build133(multiBindingSpec());
      const b0 = bindingAt(bindingSet, 0);
      const b1 = bindingAt(bindingSet, 1);
      const evaluationStateSet = build137(bindingSet, () => [
        mockRawFromBinding(b0),
        mockRawFromBinding(b1, { key: `raw|${b1.key}|FOUND` }),
      ]);
      const singleBindingSet = build133();
      const policySet = build139(singleBindingSet, []);
      assert.throws(
        () =>
          assertCompatibleResourceReadinessEvidenceInterpretationBasisContexts(
            evaluationStateSet,
            policySet
          ),
        /missing Interpretation Policy binding assessment|do not share/
      );
    });

    it("exact lookup helper matches complete State value only", () => {
      const mappings = [
        {
          resource_readiness_evidence_evaluation_state_value: fullFoundState(),
          interpretation: AS_POSITIVE,
        },
        {
          resource_readiness_evidence_evaluation_state_value: notFoundState(),
          interpretation: AS_NEGATIVE,
        },
      ] as const;
      assert.equal(
        findExactResourceReadinessEvidenceEvaluationStateInterpretationMapping(
          mappings,
          fullFoundState()
        )!.interpretation,
        AS_POSITIVE
      );
      assert.equal(
        findExactResourceReadinessEvidenceEvaluationStateInterpretationMapping(
          mappings,
          fullFoundState({
            availability_assessment_status: "UNAVAILABLE_DECLARED",
          })
        ),
        null
      );
    });

    it("determinism, deep-clone, input immutability", () => {
      const bindingSet = build133();
      const binding = bindingAt(bindingSet);
      const evaluationStateSet = build137(bindingSet, (bindings) => [
        mockRawFromBinding(bindings[0]!),
      ]);
      const policySet = build139(bindingSet, [
        {
          resource_readiness_observation_context_binding_key: binding.key,
          mappings: [
            {
              resource_readiness_evidence_evaluation_state_value: fullFoundState(),
              interpretation: AS_POSITIVE,
            },
          ],
        },
      ]);
      const beforeEval = structuredClone(evaluationStateSet);
      const beforePolicy = structuredClone(policySet);
      const a = build140(evaluationStateSet, policySet);
      const b = build140(evaluationStateSet, policySet);
      assert.deepEqual(a, b);
      assert.deepEqual(evaluationStateSet, beforeEval);
      assert.deepEqual(policySet, beforePolicy);
    });

    it("requirement grouping preserves binding assessments", () => {
      const bindingSet = build133(multiBindingSpec());
      const b0 = bindingAt(bindingSet, 0);
      const b2 = bindingAt(bindingSet, 2);
      const evaluationStateSet = build137(bindingSet, () => [
        mockRawFromBinding(b0),
        mockRawFromBinding(b2, { key: `raw|${b2.key}|FOUND` }),
      ]);
      const policySet = build139(bindingSet, []);
      const set = build140(evaluationStateSet, policySet);
      const candidate = set.candidate_assessments[0]!;
      assert.equal(candidate.binding_basis_assessments.length, 2);
      const r1 = candidate.requirement_basis_assessments.find(
        (a) => a.observation_resource_requirement_key === R1.key
      )!;
      const r2 = candidate.requirement_basis_assessments.find(
        (a) => a.observation_resource_requirement_key === R2.key
      )!;
      assert.equal(r1.binding_basis_assessments.length, 1);
      assert.equal(r2.binding_basis_assessments.length, 1);
    });
  });

  describe("static proofs / schema", () => {
    it("fixed model limitation order", () => {
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_BASIS_MODEL_LIMITATIONS[0],
        "PER_BINDING_CANONICAL_RESOURCE_READINESS_EVIDENCE_STATE_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_BASIS_MODEL_LIMITATIONS.at(
          -1
        ),
        "EXECUTION_NOT_MODELED"
      );
    });

    it("schema 0.1.24; 137+139 only; no wildcard/criteria/canonical State", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-interpretation-basis-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-interpretation-basis-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(/resource_readiness_evidence_evaluation_state_set/.test(core));
      assert.ok(/resource_readiness_evidence_interpretation_policy_set/.test(core));
      assert.ok(
        /attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey/.test(
          core
        )
      );
      assert.ok(
        /attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationMappingKey/.test(
          core
        )
      );
      assert.ok(!/assessResource\s*\(/.test(core));
      assert.ok(!/buildAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment/.test(core));
      assert.ok(!/buildAttentionObservationOperationalEligibilityResourceReadinessRawEvidenceAssessmentSet/.test(core));
      assert.ok(!/ANY_VALUE/.test(src));
      assert.ok(!/wildcard/.test(src));
      assert.ok(!/"RESOURCE_READY"/.test(src));
      assert.ok(!/"RESOURCE_NOT_READY"/.test(src));
      assert.ok(!/"EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_POSITIVE"/.test(src));
      assert.ok(!/"INTERPRET_AS_UNRESOLVED"/.test(src));
      assert.ok(!/DEFAULT/.test(src));
    });
  });
});
