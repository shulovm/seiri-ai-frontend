/**
 * GROUND-139 — Observation Core XCIII / Explicit per-binding RESOURCE_READINESS
 * Evidence Evaluation State Interpretation Policy Foundation
 *
 * Pure GROUND-133 Binding + explicit interpretation policy specification
 * (declaration only; no current 137 state / Basis / canonical Evidence State).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
  attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationMappingKey,
  attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationPolicyKey,
  buildAttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicySet,
  buildCanonicalResourceReadinessEvidenceEvaluationStateInterpretationMappingSetKey,
  canonicalizeResourceReadinessEvidenceEvaluationStateInterpretationMappings,
  EMPTY_RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_INTERPRETATION_MAPPING_SET,
  normalizeAttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicySpecification,
  normalizeResourceReadinessEvidenceEvaluationStateValue,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-interpretation-policy-core.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationMapping,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-interpretation-policy-types.js";
import type { AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValue } from "../reality/attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-types.js";
import { buildAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment } from "../reality/attention-observation-operational-eligibility-resource-readiness-observation-context-binding-core.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSpecification,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-observation-context-binding-types.js";
import type {
  AttentionCandidateObservationResourceRequirementSetAssessment,
  AttentionObservationResourceRequirement,
  AttentionObservationResourceRequirementSetAssessment,
} from "../reality/attention-observation-resource-requirement-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const NEED_KEY = "need";
const CAP_SET_KEY = "cap-set-key";
const RD1 = "rd-00000000-0000-4000-8000-000000000001";
const RD2 = "rd-00000000-0000-4000-8000-000000000002";
const RD3 = "rd-00000000-0000-4000-8000-000000000003";

const AS_POSITIVE = "INTERPRET_AS_RESOURCE_READINESS_EVIDENCE_POSITIVE" as const;
const AS_NEGATIVE = "INTERPRET_AS_RESOURCE_READINESS_EVIDENCE_NEGATIVE" as const;

function assertNoReadinessOrLookupSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"RESOURCE_READY"/.test(json));
  assert.ok(!/"RESOURCE_NOT_READY"/.test(json));
  assert.ok(!/"INTERPRET_AS_SATISFIED"/.test(json));
  assert.ok(!/"INTERPRET_AS_UNSATISFIED"/.test(json));
  assert.ok(!/"INTERPRET_AS_UNRESOLVED"/.test(json));
  assert.ok(!/"interpretation_basis"/.test(json));
  assert.ok(!/"evidence_evaluation_states"/.test(json));
  assert.ok(!/"raw_binding_evidence"/.test(json));
  assert.ok(!/"evaluation_instant"/.test(json));
  assert.ok(!/"evaluation_at"/.test(json));
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
const R2 = mockResourceRequirement({ key: "req-r2", resource_key: "NETWORK_BANDWIDTH", unit: "MBPS" });
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
  observationResourceRequirementSet: AttentionObservationResourceRequirementSetAssessment = mock132Set(),
  specification: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSpecification = {
    candidate_binding_sets: [],
  }
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment(
    {
      observation_resource_requirement_set: observationResourceRequirementSet,
      specification,
    }
  );
}

function defaultBindingSpec(): AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSpecification {
  return {
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
  };
}

function buildBindingSet(
  specification: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSpecification = defaultBindingSpec()
): AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment {
  return build133(mock132Set(), specification);
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

function buildSet(
  bindingPolicies: {
    resource_readiness_observation_context_binding_key: string;
    mappings: AttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationMapping[];
  }[],
  bindingSet?: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment
) {
  const bindings = bindingSet ?? buildBindingSet();
  return buildAttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicySet(
    {
      resource_readiness_observation_context_binding_set: bindings,
      specification: { binding_policies: bindingPolicies },
    }
  );
}

function bindingKey(
  bindingSet: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
  index = 0
) {
  return bindingSet.candidate_assessments[0]!.bindings[index]!.key;
}

describe("GROUND-139 RESOURCE_READINESS Evidence Interpretation Policy", () => {
  describe("mapping semantics", () => {
    it("favorable-looking FOUND State → NEGATIVE unusual mapping is valid", () => {
      const bindingSet = buildBindingSet();
      const state = fullFoundState();
      const set = buildSet(
        [
          {
            resource_readiness_observation_context_binding_key: bindingKey(bindingSet),
            mappings: [
              {
                resource_readiness_evidence_evaluation_state_value: state,
                interpretation: AS_NEGATIVE,
              },
            ],
          },
        ],
        bindingSet
      );
      const policy =
        set.candidate_assessments[0]!.binding_policy_assessments[0]!.policy!;
      assert.equal(policy.mappings.length, 1);
      assert.equal(policy.mappings[0]!.interpretation, AS_NEGATIVE);
      assert.deepEqual(
        policy.mappings[0]!.resource_readiness_evidence_evaluation_state_value,
        state
      );
      assertNoReadinessOrLookupSemantics(set);
    });

    it("NOT_FOUND → POSITIVE unusual mapping is valid", () => {
      const bindingSet = buildBindingSet();
      const state = notFoundState();
      const set = buildSet(
        [
          {
            resource_readiness_observation_context_binding_key: bindingKey(bindingSet),
            mappings: [
              {
                resource_readiness_evidence_evaluation_state_value: state,
                interpretation: AS_POSITIVE,
              },
            ],
          },
        ],
        bindingSet
      );
      assert.equal(
        set.candidate_assessments[0]!.binding_policy_assessments[0]!.policy!
          .mappings[0]!.interpretation,
        AS_POSITIVE
      );
    });

    it("UNAVAILABLE → POSITIVE is valid", () => {
      const bindingSet = buildBindingSet();
      const set = buildSet(
        [
          {
            resource_readiness_observation_context_binding_key: bindingKey(bindingSet),
            mappings: [
              {
                resource_readiness_evidence_evaluation_state_value: fullFoundState({
                  availability_assessment_status: "UNAVAILABLE_DECLARED",
                }),
                interpretation: AS_POSITIVE,
              },
            ],
          },
        ],
        bindingSet
      );
      assert.equal(
        set.candidate_assessments[0]!.binding_policy_assessments[0]!.policy!
          .mappings[0]!.interpretation,
        AS_POSITIVE
      );
    });

    it("CONTESTED → POSITIVE is valid", () => {
      const bindingSet = buildBindingSet();
      const set = buildSet(
        [
          {
            resource_readiness_observation_context_binding_key: bindingKey(bindingSet),
            mappings: [
              {
                resource_readiness_evidence_evaluation_state_value: fullFoundState({
                  availability_assessment_status: "CONTESTED_AVAILABILITY",
                }),
                interpretation: AS_POSITIVE,
              },
            ],
          },
        ],
        bindingSet
      );
      assert.equal(
        set.candidate_assessments[0]!.binding_policy_assessments[0]!.policy!
          .mappings[0]!.interpretation,
        AS_POSITIVE
      );
    });

    it("CONTESTED → NEGATIVE is valid in separate mapping", () => {
      const bindingSet = buildBindingSet();
      const set = buildSet(
        [
          {
            resource_readiness_observation_context_binding_key: bindingKey(bindingSet),
            mappings: [
              {
                resource_readiness_evidence_evaluation_state_value: fullFoundState({
                  availability_assessment_status: "CONTESTED_AVAILABILITY",
                }),
                interpretation: AS_NEGATIVE,
              },
            ],
          },
        ],
        bindingSet
      );
      assert.equal(
        set.candidate_assessments[0]!.binding_policy_assessments[0]!.policy!
          .mappings[0]!.interpretation,
        AS_NEGATIVE
      );
    });

    it("MISMATCH → POSITIVE is valid", () => {
      const bindingSet = buildBindingSet();
      const set = buildSet(
        [
          {
            resource_readiness_observation_context_binding_key: bindingKey(bindingSet),
            mappings: [
              {
                resource_readiness_evidence_evaluation_state_value: fullFoundState({
                  resource_key_relation: "RESOURCE_KEY_DOES_NOT_EXACT_MATCH",
                  resource_unit_relation: "RESOURCE_UNIT_DOES_NOT_EXACT_MATCH",
                  resource_scope_relation: "RESOURCE_SCOPE_DOES_NOT_EXACT_MATCH",
                }),
                interpretation: AS_POSITIVE,
              },
            ],
          },
        ],
        bindingSet
      );
      assert.equal(
        set.candidate_assessments[0]!.binding_policy_assessments[0]!.policy!
          .mappings[0]!.interpretation,
        AS_POSITIVE
      );
    });

    it("APPLIES → NEGATIVE is valid", () => {
      const bindingSet = buildBindingSet();
      const set = buildSet(
        [
          {
            resource_readiness_observation_context_binding_key: bindingKey(bindingSet),
            mappings: [
              {
                resource_readiness_evidence_evaluation_state_value: fullFoundState({
                  requirement_temporal_relation:
                    "OBSERVATION_RESOURCE_REQUIREMENT_APPLIES_AT_EVALUATION_INSTANT",
                }),
                interpretation: AS_NEGATIVE,
              },
            ],
          },
        ],
        bindingSet
      );
      assert.equal(
        set.candidate_assessments[0]!.binding_policy_assessments[0]!.policy!
          .mappings[0]!.interpretation,
        AS_NEGATIVE
      );
    });

    it("DOES_NOT_APPLY → POSITIVE is valid", () => {
      const bindingSet = buildBindingSet();
      const set = buildSet(
        [
          {
            resource_readiness_observation_context_binding_key: bindingKey(bindingSet),
            mappings: [
              {
                resource_readiness_evidence_evaluation_state_value: fullFoundState({
                  requirement_temporal_relation:
                    "OBSERVATION_RESOURCE_REQUIREMENT_DOES_NOT_APPLY_AT_EVALUATION_INSTANT",
                }),
                interpretation: AS_POSITIVE,
              },
            ],
          },
        ],
        bindingSet
      );
      assert.equal(
        set.candidate_assessments[0]!.binding_policy_assessments[0]!.policy!
          .mappings[0]!.interpretation,
        AS_POSITIVE
      );
    });

    it("rejects malformed partial source value (missing axis)", () => {
      assert.throws(
        () =>
          normalizeResourceReadinessEvidenceEvaluationStateValue({
            declaration_lookup_status: "BOUND_RESOURCE_DECLARATION_FOUND",
          } as never),
        /missing axis/
      );
    });

    it("NOT_FOUND malformed source with non-null declaration-dependent axis rejects", () => {
      assert.throws(
        () =>
          normalizeResourceReadinessEvidenceEvaluationStateValue(
            notFoundState({ resource_key_relation: "RESOURCE_KEY_EXACT_MATCH" })
          ),
        /NOT_FOUND requires null resource_key_relation/
      );
    });

    it("FOUND malformed source with null declaration-dependent axis rejects", () => {
      assert.throws(
        () =>
          normalizeResourceReadinessEvidenceEvaluationStateValue(
            fullFoundState({ resource_key_relation: null })
          ),
        /FOUND requires non-null resource_key_relation/
      );
    });

    it("exact duplicate mapping normalizes", () => {
      const state = fullFoundState();
      const canonical =
        canonicalizeResourceReadinessEvidenceEvaluationStateInterpretationMappings([
          {
            resource_readiness_evidence_evaluation_state_value: state,
            interpretation: AS_POSITIVE,
          },
          {
            resource_readiness_evidence_evaluation_state_value: { ...state },
            interpretation: AS_POSITIVE,
          },
        ]);
      assert.equal(canonical.length, 1);
    });

    it("conflicting same-source mapping rejects", () => {
      const state = fullFoundState();
      assert.throws(
        () =>
          canonicalizeResourceReadinessEvidenceEvaluationStateInterpretationMappings([
            {
              resource_readiness_evidence_evaluation_state_value: state,
              interpretation: AS_POSITIVE,
            },
            {
              resource_readiness_evidence_evaluation_state_value: { ...state },
              interpretation: AS_NEGATIVE,
            },
          ]),
        /Conflicting/
      );
    });

    it("mapping order invariance", () => {
      const e1 = fullFoundState();
      const e2 = notFoundState({
        requirement_temporal_relation:
          "OBSERVATION_RESOURCE_REQUIREMENT_DOES_NOT_APPLY_AT_EVALUATION_INSTANT",
      });
      const a = canonicalizeResourceReadinessEvidenceEvaluationStateInterpretationMappings([
        {
          resource_readiness_evidence_evaluation_state_value: e1,
          interpretation: AS_POSITIVE,
        },
        {
          resource_readiness_evidence_evaluation_state_value: e2,
          interpretation: AS_NEGATIVE,
        },
      ]);
      const b = canonicalizeResourceReadinessEvidenceEvaluationStateInterpretationMappings([
        {
          resource_readiness_evidence_evaluation_state_value: e2,
          interpretation: AS_NEGATIVE,
        },
        {
          resource_readiness_evidence_evaluation_state_value: e1,
          interpretation: AS_POSITIVE,
        },
      ]);
      assert.deepEqual(a, b);
    });

    it("partial policy is valid (subset of states mapped)", () => {
      const bindingSet = buildBindingSet();
      const set = buildSet(
        [
          {
            resource_readiness_observation_context_binding_key: bindingKey(bindingSet),
            mappings: [
              {
                resource_readiness_evidence_evaluation_state_value: fullFoundState(),
                interpretation: AS_POSITIVE,
              },
            ],
          },
        ],
        bindingSet
      );
      assert.equal(
        set.candidate_assessments[0]!.binding_policy_assessments[0]!.policy!
          .mappings.length,
        1
      );
    });
  });

  describe("policy binding behavior", () => {
    it("no policy → NO_POLICY / policy null / boolean false", () => {
      const set = buildSet([]);
      const assessment = set.candidate_assessments[0]!.binding_policy_assessments[0]!;
      assert.equal(
        assessment.status,
        "NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(assessment.policy, null);
      assert.equal(
        assessment.has_explicit_resource_readiness_evidence_interpretation_policy,
        false
      );
    });

    it("explicit empty policy → PRESENT / mappings=[] / boolean true", () => {
      const bindingSet = buildBindingSet();
      const set = buildSet(
        [
          {
            resource_readiness_observation_context_binding_key: bindingKey(bindingSet),
            mappings: [],
          },
        ],
        bindingSet
      );
      const assessment = set.candidate_assessments[0]!.binding_policy_assessments[0]!;
      assert.equal(
        assessment.status,
        "EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_PRESENT"
      );
      assert.ok(assessment.policy);
      assert.equal(assessment.policy!.mappings.length, 0);
      assert.equal(
        assessment.has_explicit_resource_readiness_evidence_interpretation_policy,
        true
      );
      assert.equal(
        buildCanonicalResourceReadinessEvidenceEvaluationStateInterpretationMappingSetKey([]),
        EMPTY_RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_INTERPRETATION_MAPPING_SET
      );
    });

    it("explicit empty != policy absence", () => {
      const bindingSet = buildBindingSet();
      const absent = buildSet([], bindingSet);
      const empty = buildSet(
        [
          {
            resource_readiness_observation_context_binding_key: bindingKey(bindingSet),
            mappings: [],
          },
        ],
        bindingSet
      );
      assert.notEqual(
        absent.candidate_assessments[0]!.binding_policy_assessments[0]!.status,
        empty.candidate_assessments[0]!.binding_policy_assessments[0]!.status
      );
    });

    it("mixed PRESENT / NO_POLICY / explicit-empty across bindings", () => {
      const bindingSet = build133(mock132Set(), multiBindingSpec());
      const set = buildSet(
        [
          {
            resource_readiness_observation_context_binding_key: bindingKey(bindingSet, 0),
            mappings: [
              {
                resource_readiness_evidence_evaluation_state_value: fullFoundState(),
                interpretation: AS_POSITIVE,
              },
            ],
          },
          {
            resource_readiness_observation_context_binding_key: bindingKey(bindingSet, 1),
            mappings: [],
          },
        ],
        bindingSet
      );
      const candidate = set.candidate_assessments[0]!;
      assert.equal(candidate.binding_policy_assessments.length, 3);
      assert.equal(
        candidate.has_explicit_resource_readiness_evidence_interpretation_policies,
        true
      );
      assert.equal(
        candidate.binding_policy_assessments[0]!.status,
        "EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_PRESENT"
      );
      assert.equal(
        candidate.binding_policy_assessments[1]!.status,
        "EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_PRESENT"
      );
      assert.equal(
        candidate.binding_policy_assessments[2]!.status,
        "NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_DECLARED"
      );
    });

    it("same State value may differ across bindings", () => {
      const bindingSet = build133(mock132Set(), multiBindingSpec());
      const state = fullFoundState();
      const set = buildSet(
        [
          {
            resource_readiness_observation_context_binding_key: bindingKey(bindingSet, 0),
            mappings: [
              {
                resource_readiness_evidence_evaluation_state_value: state,
                interpretation: AS_POSITIVE,
              },
            ],
          },
          {
            resource_readiness_observation_context_binding_key: bindingKey(bindingSet, 1),
            mappings: [
              {
                resource_readiness_evidence_evaluation_state_value: state,
                interpretation: AS_NEGATIVE,
              },
            ],
          },
        ],
        bindingSet
      );
      const p0 =
        set.candidate_assessments[0]!.binding_policy_assessments[0]!.policy!;
      const p1 =
        set.candidate_assessments[0]!.binding_policy_assessments[1]!.policy!;
      assert.equal(p0.mappings[0]!.interpretation, AS_POSITIVE);
      assert.equal(p1.mappings[0]!.interpretation, AS_NEGATIVE);
      assert.notEqual(p0.key, p1.key);
    });

    it("binding lineage copied from GROUND-133", () => {
      const bindingSet = buildBindingSet();
      const binding = bindingSet.candidate_assessments[0]!.bindings[0]!;
      const set = buildSet(
        [
          {
            resource_readiness_observation_context_binding_key: binding.key,
            mappings: [],
          },
        ],
        bindingSet
      );
      const policy =
        set.candidate_assessments[0]!.binding_policy_assessments[0]!.policy!;
      assert.equal(policy.candidate_key, binding.candidate_key);
      assert.equal(policy.observation_need_key, binding.observation_need_key);
      assert.equal(
        policy.capability_requirement_set_key,
        binding.capability_requirement_set_key
      );
      assert.equal(
        policy.observation_resource_requirement_key,
        binding.observation_resource_requirement_key
      );
      assert.equal(policy.resource_declaration_id, binding.resource_declaration_id);
      assert.equal(
        policy.resource_readiness_observation_context_binding_key,
        binding.key
      );
    });

    it("unknown binding target rejects", () => {
      const bindingSet = buildBindingSet();
      assert.throws(
        () =>
          normalizeAttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicySpecification(
            bindingSet,
            {
              binding_policies: [
                {
                  resource_readiness_observation_context_binding_key: "missing-binding",
                  mappings: [],
                },
              ],
            }
          ),
        /not found/
      );
    });

    it("conflicting policies for same binding reject", () => {
      const bindingSet = buildBindingSet();
      const key = bindingKey(bindingSet);
      const state = fullFoundState();
      assert.throws(
        () =>
          normalizeAttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicySpecification(
            bindingSet,
            {
              binding_policies: [
                {
                  resource_readiness_observation_context_binding_key: key,
                  mappings: [
                    {
                      resource_readiness_evidence_evaluation_state_value: state,
                      interpretation: AS_POSITIVE,
                    },
                  ],
                },
                {
                  resource_readiness_observation_context_binding_key: key,
                  mappings: [
                    {
                      resource_readiness_evidence_evaluation_state_value: state,
                      interpretation: AS_NEGATIVE,
                    },
                  ],
                },
              ],
            }
          ),
        /Conflicting/
      );
    });

    it("duplicate same binding/same policy normalizes", () => {
      const bindingSet = buildBindingSet();
      const key = bindingKey(bindingSet);
      const normalized =
        normalizeAttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicySpecification(
          bindingSet,
          {
            binding_policies: [
              {
                resource_readiness_observation_context_binding_key: key,
                mappings: [
                  {
                    resource_readiness_evidence_evaluation_state_value: fullFoundState(),
                    interpretation: AS_POSITIVE,
                  },
                ],
              },
              {
                resource_readiness_observation_context_binding_key: key,
                mappings: [
                  {
                    resource_readiness_evidence_evaluation_state_value: fullFoundState(),
                    interpretation: AS_POSITIVE,
                  },
                ],
              },
            ],
          }
        );
      assert.equal(normalized.binding_policies.length, 1);
    });

    it("policy identity excludes evaluation instant and current evidence keys", () => {
      const bindingSet = buildBindingSet();
      const key = bindingKey(bindingSet);
      const state = fullFoundState();
      const policyKey =
        attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationPolicyKey(
          {
            candidateKey: CAND,
            observationNeedKey: NEED_KEY,
            capabilityRequirementSetKey: CAP_SET_KEY,
            observationResourceRequirementKey: R1.key,
            resourceReadinessObservationContextBindingKey: key,
            resourceDeclarationId: RD1,
            canonicalMappingSetKey:
              buildCanonicalResourceReadinessEvidenceEvaluationStateInterpretationMappingSetKey([
                {
                  resource_readiness_evidence_evaluation_state_value: state,
                  interpretation: AS_POSITIVE,
                },
              ]),
          }
        );
      assert.ok(!policyKey.includes("evaluation_instant"));
      assert.ok(!policyKey.includes("evaluation_at"));
      assert.ok(!policyKey.includes("raw_binding"));
      assert.ok(!policyKey.includes("raw-evidence"));
    });

    it("mapping key helper uses GROUND-137 canonicalization", () => {
      const state = fullFoundState();
      const mappingKey =
        attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateInterpretationMappingKey(
          state,
          AS_POSITIVE
        );
      assert.ok(mappingKey.includes("INTERPRET_AS_RESOURCE_READINESS_EVIDENCE_POSITIVE"));
      assert.ok(mappingKey.startsWith("resource-readiness-evidence-evaluation-state-interpretation-mapping|"));
    });

    it("requirement-level grouping preserves binding policies", () => {
      const bindingSet = build133(mock132Set(), multiBindingSpec());
      const set = buildSet(
        [
          {
            resource_readiness_observation_context_binding_key: bindingKey(bindingSet, 0),
            mappings: [],
          },
        ],
        bindingSet
      );
      const candidate = set.candidate_assessments[0]!;
      const r1 = candidate.requirement_policy_assessments.find(
        (a) => a.observation_resource_requirement_key === R1.key
      )!;
      assert.equal(r1.binding_policy_assessments.length, 2);
      assert.equal(candidate.binding_policy_assessments.length, 3);
    });

    it("zero-binding requirement set → zero binding policies", () => {
      const bindingSet = build133(mock132Set(), {
        candidate_binding_sets: [],
      });
      const set = buildSet([], bindingSet);
      assert.equal(set.candidate_assessments[0]!.binding_policy_assessments.length, 0);
      assert.equal(
        set.has_explicit_resource_readiness_evidence_interpretation_policies,
        false
      );
    });

    it("determinism, deep-clone, input immutability", () => {
      const bindingSet = buildBindingSet();
      const key = bindingKey(bindingSet);
      const beforeBindings = structuredClone(bindingSet);
      const spec = {
        binding_policies: [
          {
            resource_readiness_observation_context_binding_key: key,
            mappings: [
              {
                resource_readiness_evidence_evaluation_state_value: fullFoundState(),
                interpretation: AS_POSITIVE,
              },
            ],
          },
        ],
      };
      const beforeSpec = structuredClone(spec);
      const a = buildAttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicySet(
        {
          resource_readiness_observation_context_binding_set: bindingSet,
          specification: spec,
        }
      );
      const b = buildAttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicySet(
        {
          resource_readiness_observation_context_binding_set: bindingSet,
          specification: spec,
        }
      );
      assert.deepEqual(a, b);
      assert.deepEqual(bindingSet, beforeBindings);
      assert.deepEqual(spec, beforeSpec);
    });

    it("specification order invariance", () => {
      const bindingSet = build133(mock132Set(), multiBindingSpec());
      const key0 = bindingKey(bindingSet, 0);
      const key1 = bindingKey(bindingSet, 1);
      const specA = {
        binding_policies: [
          {
            resource_readiness_observation_context_binding_key: key0,
            mappings: [],
          },
          {
            resource_readiness_observation_context_binding_key: key1,
            mappings: [],
          },
        ],
      };
      const specB = {
        binding_policies: [
          {
            resource_readiness_observation_context_binding_key: key1,
            mappings: [],
          },
          {
            resource_readiness_observation_context_binding_key: key0,
            mappings: [],
          },
        ],
      };
      const a = buildAttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicySet(
        {
          resource_readiness_observation_context_binding_set: bindingSet,
          specification: specA,
        }
      );
      const b = buildAttentionObservationOperationalEligibilityResourceReadinessEvidenceInterpretationPolicySet(
        {
          resource_readiness_observation_context_binding_set: bindingSet,
          specification: specB,
        }
      );
      assert.deepEqual(a.specification, b.specification);
      assert.deepEqual(
        a.candidate_assessments[0]!.binding_policy_assessments.map((x) => x.status),
        b.candidate_assessments[0]!.binding_policy_assessments.map((x) => x.status)
      );
    });
  });

  describe("static proofs / schema", () => {
    it("fixed model limitation order", () => {
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_MODEL_LIMITATIONS[0],
        "CURRENT_RESOURCE_READINESS_EVIDENCE_EVALUATION_STATE_LOOKUP_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY_MODEL_LIMITATIONS.at(
          -1
        ),
        "EXECUTION_NOT_MODELED"
      );
    });

    it("schema 0.1.24; GROUND-133 only; no current 137/135/ProjectState", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-interpretation-policy-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-resource-readiness-evidence-evaluation-state-interpretation-policy-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(/resource_readiness_observation_context_binding_set/.test(core));
      assert.ok(!/buildAttentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateSet/.test(core));
      assert.ok(!/resource_readiness_raw_evidence_assessment/.test(core));
      assert.ok(!/assessResource\s*\(/.test(core));
      assert.ok(!/interpretation_basis/.test(src));
      assert.ok(!/ANY_VALUE/.test(src));
      assert.ok(!/wildcard/.test(src));
      assert.ok(!/"RESOURCE_READY"/.test(src));
      assert.ok(!/"RESOURCE_NOT_READY"/.test(src));
      assert.ok(!/"INTERPRET_AS_UNRESOLVED"/.test(src));
      assert.ok(!/DEFAULT/.test(src));
      assert.ok(
        /attentionObservationOperationalEligibilityResourceReadinessEvidenceEvaluationStateValueKey/.test(
          core
        )
      );
    });
  });
});
