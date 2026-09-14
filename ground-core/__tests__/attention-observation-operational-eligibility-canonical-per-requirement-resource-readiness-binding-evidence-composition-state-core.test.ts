/**
 * GROUND-151 — Observation Core CV / Canonical per-requirement
 * RESOURCE_READINESS Binding Evidence Composition State Foundation
 *
 * GROUND-150 Result Interpretation Basis
 * → Canonical per-requirement Binding Evidence Composition State
 *
 * Sole polarity authority: GROUND-150 Basis.interpretation
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import type {
  AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceState,
  AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateSetAssessment,
  AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateValue,
} from "../reality/attention-observation-operational-eligibility-canonical-per-binding-resource-readiness-evidence-state-types.js";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_CANONICAL_PER_REQUIREMENT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_STATE_MODEL_LIMITATIONS,
  attentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateKey,
  buildAttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateSet,
  deriveAttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateValue,
  isApplicableAttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionState,
  isResolvedAttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionState,
  isUnresolvedAttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionState,
} from "../reality/attention-observation-operational-eligibility-canonical-per-requirement-resource-readiness-binding-evidence-composition-state-core.js";
import {
  buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-policy-core.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySetAssessment,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-policy-types.js";
import {
  buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisSet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-readiness-basis-core.js";
import {
  buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-readiness-policy-core.js";
import {
  buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultSet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-core.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultSetAssessment,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-types.js";
import {
  buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisSet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-interpretation-basis-core.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisRequirementAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisSetAssessment,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-interpretation-basis-types.js";
import {
  buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicySet,
  extractStableResourceReadinessBindingEvidenceCompositionPolicyFromResultAssessment,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-interpretation-policy-core.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicySpecification,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-interpretation-policy-types.js";
import {
  buildAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-observation-context-binding-core.js";
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

const READINESS_KIND =
  "REQUIRE_ALL_SELECTED_RESOURCE_READINESS_BINDING_EVIDENCE_STATES_RESOLVED_BEFORE_COMPOSITION" as const;

const POSITIVE =
  "EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_POSITIVE" as const;
const NEGATIVE =
  "EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_NEGATIVE" as const;
const UNRESOLVED_POLICY =
  "UNRESOLVED_NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY" as const;

const COND_HOLDS =
  "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_HOLDS" as const;
const COND_DOES_NOT_HOLD =
  "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD" as const;

const INTERP_POSITIVE =
  "INTERPRET_AS_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POSITIVE" as const;
const INTERP_NEGATIVE =
  "INTERPRET_AS_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_NEGATIVE" as const;

const CANONICAL_POSITIVE =
  "EXPLICITLY_INTERPRETED_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POSITIVE" as const;
const CANONICAL_NEGATIVE =
  "EXPLICITLY_INTERPRETED_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_NEGATIVE" as const;
const CANONICAL_NOT_APPLICABLE =
  "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY" as const;
const CANONICAL_UNRESOLVED_NO_CURRENT_RESULT =
  "UNRESOLVED_NO_CURRENT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT" as const;
const CANONICAL_UNRESOLVED_NO_POLICY =
  "UNRESOLVED_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY" as const;
const CANONICAL_UNRESOLVED_NO_MAPPING =
  "UNRESOLVED_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_COMPOSITION_RESULT" as const;

function mockResourceRequirement(
  overrides: Partial<AttentionObservationResourceRequirement> & {
    key: string;
  }
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
const R3 = mockResourceRequirement({
  key: "req-r3",
  resource_key: "COMPUTE",
  unit: "GB",
});

function mock132Candidate(
  overrides: Partial<AttentionCandidateObservationResourceRequirementSetAssessment> & {
    candidate_key: string;
  }
): AttentionCandidateObservationResourceRequirementSetAssessment {
  return {
    capability_requirement_assessment: {} as never,
    status: "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT",
    resource_requirements: [R1, R2, R3],
    has_explicit_observation_resource_requirement_set: true,
    has_observation_resource_requirements: true,
    model_limitations: [],
    ...overrides,
  };
}

function mock132Set(): AttentionObservationResourceRequirementSetAssessment {
  return {
    capability_requirement_set: {} as never,
    specification: { candidate_requirement_sets: [] },
    candidate_assessments: [mock132Candidate({ candidate_key: CAND })],
    has_explicit_observation_resource_requirement_sets: true,
    has_observation_resource_requirements: true,
    model_limitations: [],
  };
}

function build133() {
  return buildAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment(
    {
      observation_resource_requirement_set: mock132Set(),
      specification: {
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
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD3,
              },
              {
                observation_resource_requirement_key: R2.key,
                resource_declaration_id: RD1,
              },
            ],
          },
        ],
      },
    }
  );
}

function bindingKeysForRequirement(requirementKey: string): string[] {
  return build133()
    .candidate_assessments[0]!.requirement_binding_assessments.find(
      (a) => a.observation_resource_requirement_key === requirementKey
    )!
    .bindings.map((b) => b.key);
}

function bindingDeclarationId(bindingKey: string): string {
  for (const requirement of build133().candidate_assessments[0]!
    .requirement_binding_assessments) {
    const binding = requirement.bindings.find((b) => b.key === bindingKey);
    if (binding) return binding.resource_declaration_id;
  }
  throw new Error(`binding not found: ${bindingKey}`);
}

function build145(options?: {
  includeR1Any?: boolean;
  includeR1All?: boolean;
  r1Members?: string[];
}): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySetAssessment {
  const r1Members =
    options?.r1Members ?? bindingKeysForRequirement(R1.key).slice(0, 2);
  const requirement_policies = [];

  if (options?.includeR1Any !== false && options?.includeR1All !== true) {
    requirement_policies.push({
      observation_resource_requirement_key: R1.key,
      member_binding_keys: r1Members,
      composition_kind:
        "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS" as const,
    });
  }
  if (options?.includeR1All) {
    requirement_policies.push({
      observation_resource_requirement_key: R1.key,
      member_binding_keys: r1Members,
      composition_kind:
        "ALL_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITIONS_HOLD" as const,
    });
  }

  return buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySet(
    {
      resource_readiness_observation_context_binding_set: build133(),
      specification: { requirement_policies },
    }
  );
}

function compositionPolicyKey(
  compositionSet: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySetAssessment,
  requirementKey: string = R1.key
): string {
  const assessment =
    compositionSet.candidate_assessments[0]!.requirement_policy_assessments.find(
      (a) => a.observation_resource_requirement_key === requirementKey
    )!;
  assert.ok(assessment.policy);
  return assessment.policy!.key;
}

function mockCanonicalState(
  bindingKey: string,
  state: AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateValue
): AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceState {
  return {
    key: `canonical-state|${bindingKey}|${state}`,
    basis_key: `canonical-basis|${bindingKey}|${state}`,
    candidate_key: CAND,
    observation_need_key: NEED_KEY,
    capability_requirement_set_key: CAP_SET_KEY,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key: R1.key,
    resource_readiness_observation_context_binding_key: bindingKey,
    resource_declaration_id: bindingDeclarationId(bindingKey),
    state,
  };
}

function mock141Set(
  states: AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceState[]
): AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateSetAssessment {
  return {
    resource_readiness_evidence_interpretation_basis_set: {} as never,
    candidate_assessments: [
      {
        candidate_key: CAND,
        resource_readiness_evidence_interpretation_basis_assessment: {} as never,
        status: "CANONICAL_PER_BINDING_RESOURCE_READINESS_EVIDENCE_STATES_PRESENT",
        requirement_state_assessments: [],
        canonical_binding_state_assessments: states.map((canonical_state) => ({
          resource_readiness_observation_context_binding_key:
            canonical_state.resource_readiness_observation_context_binding_key,
          resource_readiness_evidence_interpretation_basis_assessment:
            {} as never,
          canonical_state_basis: {} as never,
          canonical_state,
          has_canonical_per_binding_resource_readiness_evidence_state: true as const,
          has_resolved_canonical_per_binding_resource_readiness_evidence_state:
            canonical_state.state === POSITIVE ||
            canonical_state.state === NEGATIVE,
          has_unresolved_canonical_per_binding_resource_readiness_evidence_state:
            canonical_state.state === UNRESOLVED_POLICY,
        })),
        has_canonical_per_binding_resource_readiness_evidence_states:
          states.length > 0,
        has_resolved_canonical_per_binding_resource_readiness_evidence_states:
          true,
        has_unresolved_canonical_per_binding_resource_readiness_evidence_states:
          false,
        model_limitations: [],
      },
    ],
    has_canonical_per_binding_resource_readiness_evidence_states:
      states.length > 0,
    has_resolved_canonical_per_binding_resource_readiness_evidence_states: true,
    has_unresolved_canonical_per_binding_resource_readiness_evidence_states:
      false,
    model_limitations: [],
  };
}

function build148Pipeline(options?: {
  includeR1Any?: boolean;
  includeR1All?: boolean;
  r1Members?: string[];
  stateValues?: AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateValue[];
  declareReadiness?: boolean;
}): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultSetAssessment {
  const members =
    options?.r1Members ?? bindingKeysForRequirement(R1.key).slice(0, 2);
  const stateValues = options?.stateValues ?? [POSITIVE, NEGATIVE];
  const compositionSet = build145({
    includeR1Any: options?.includeR1Any,
    includeR1All: options?.includeR1All,
    r1Members: members,
  });
  const readinessSet =
    buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySet(
      {
        resource_readiness_binding_evidence_composition_policy_set:
          compositionSet,
        specification: {
          composition_readiness_policies:
            options?.declareReadiness === false ||
            compositionSet.candidate_assessments[0]!.requirement_policy_assessments.every(
              (a) => a.policy === null
            )
              ? []
              : [
                  {
                    resource_readiness_binding_evidence_composition_policy_key:
                      compositionPolicyKey(compositionSet),
                    readiness_kind: READINESS_KIND,
                  },
                ],
        },
      }
    );
  const basisSet =
    buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisSet(
      {
        canonical_per_binding_resource_readiness_evidence_state_set: mock141Set(
          members.map((key, index) =>
            mockCanonicalState(key, stateValues[index] ?? POSITIVE)
          )
        ),
        resource_readiness_binding_evidence_composition_readiness_policy_set:
          readinessSet,
      }
    );
  return buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultSet(
    {
      resource_readiness_binding_evidence_composition_readiness_basis_set:
        basisSet,
    }
  );
}

function compositionPolicyKeyFrom148(
  resultSet: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultSetAssessment
): string {
  const r1 =
    resultSet.candidate_assessments[0]!.requirement_composition_result_assessments.find(
      (a) => a.observation_resource_requirement_key === R1.key
    )!;
  const policy =
    extractStableResourceReadinessBindingEvidenceCompositionPolicyFromResultAssessment(
      r1
    );
  assert.ok(policy);
  return policy!.key;
}

function build149(
  resultSet: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultSetAssessment,
  specification: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicySpecification = {
    requirement_policies: [],
  }
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicySet(
    {
      resource_readiness_binding_evidence_composition_result_set: resultSet,
      specification,
    }
  );
}

function build150(
  resultSet: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultSetAssessment,
  policySpec: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicySpecification = {
    requirement_policies: [],
  }
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisSetAssessment {
  return buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisSet(
    {
      resource_readiness_binding_evidence_composition_result_set: resultSet,
      resource_readiness_binding_evidence_composition_result_interpretation_policy_set:
        build149(resultSet, policySpec),
    }
  );
}

function build151(
  basisSet: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisSetAssessment
) {
  return buildAttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateSet(
    {
      resource_readiness_binding_evidence_composition_result_interpretation_basis_set:
        basisSet,
    }
  );
}

function r1State(set: ReturnType<typeof build151>) {
  return set.candidate_assessments[0]!.requirement_canonical_state_assessments.find(
    (a) => a.observation_resource_requirement_key === R1.key
  )!;
}

function r3State(set: ReturnType<typeof build151>) {
  return set.candidate_assessments[0]!.requirement_canonical_state_assessments.find(
    (a) => a.observation_resource_requirement_key === R3.key
  )!;
}

function conventionalMappings() {
  return [
    {
      composition_condition: COND_HOLDS,
      interpretation: INTERP_POSITIVE,
    },
    {
      composition_condition: COND_DOES_NOT_HOLD,
      interpretation: INTERP_NEGATIVE,
    },
  ];
}

function reverseMappings() {
  return [
    {
      composition_condition: COND_HOLDS,
      interpretation: INTERP_NEGATIVE,
    },
    {
      composition_condition: COND_DOES_NOT_HOLD,
      interpretation: INTERP_POSITIVE,
    },
  ];
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-151 Canonical per-requirement RESOURCE_READINESS Binding Evidence Composition State", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.25");
  });

  it("model limitations fixed order", () => {
    assert.deepEqual(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_CANONICAL_PER_REQUIREMENT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_STATE_MODEL_LIMITATIONS,
      [
        "MULTIPLE_BINDING_COMPOSITION_GROUPS_PER_REQUIREMENT_NOT_MODELED",
        "NESTED_BOOLEAN_BINDING_COMPOSITION_NOT_MODELED",
        "PHYSICAL_RESOURCE_BINDING_ROLE_NOT_MODELED",
        "OBSERVATION_RESOURCE_QUANTITY_RELATION_NOT_MODELED",
        "RESOURCE_QUANTITY_CONTRIBUTION_NOT_MODELED",
        "RESOURCE_FUNGIBILITY_NOT_MODELED",
        "RESOURCE_SUBSTITUTION_NOT_MODELED",
        "OBSERVATION_RESOURCE_RESERVATION_EVIDENCE_NOT_INCLUDED",
        "OBSERVATION_RESOURCE_COMMITMENT_EVIDENCE_NOT_INCLUDED",
        "OBSERVATION_RESOURCE_CONTENTION_EVIDENCE_NOT_INCLUDED",
        "TRUE_PER_REQUIREMENT_RESOURCE_READINESS_NOT_MODELED",
        "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
        "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED",
        "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
        "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
        "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
        "CAN_EXECUTE_NOT_MODELED",
        "EXECUTION_NOT_MODELED",
      ]
    );
  });

  describe("normalization table", () => {
    it("NOT_APPLICABLE → canonical NOT_APPLICABLE", () => {
      const basisSet = build150(
        build148Pipeline({
          includeR1Any: false,
          includeR1All: false,
          declareReadiness: false,
          stateValues: [],
          r1Members: [],
        })
      );
      const set = build151(basisSet);
      const r3 = r3State(set);
      assert.equal(r3.canonical_state_value, CANONICAL_NOT_APPLICABLE);
      assert.equal(
        r3.canonical_state.resource_readiness_binding_evidence_composition_policy_key,
        null
      );
      assert.equal(
        r3.canonical_state
          .resource_readiness_binding_evidence_composition_result_interpretation_basis_key,
        null
      );
      assert.equal(
        isApplicableAttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionState(
          r3.canonical_state_value
        ),
        false
      );
      assert.equal(
        isUnresolvedAttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionState(
          r3.canonical_state_value
        ),
        false
      );
    });

    it("NO_CURRENT_RESULT → UNRESOLVED_NO_CURRENT_RESULT", () => {
      const resultSet = build148Pipeline({ declareReadiness: false });
      const set = build151(build150(resultSet));
      const r1 = r1State(set);
      assert.equal(
        r1.canonical_state_value,
        CANONICAL_UNRESOLVED_NO_CURRENT_RESULT
      );
      assert.notEqual(r1.canonical_state_value, CANONICAL_NEGATIVE);
      assert.ok(
        r1.canonical_state.resource_readiness_binding_evidence_composition_policy_key
      );
      assert.equal(
        r1.canonical_state
          .resource_readiness_binding_evidence_composition_result_interpretation_basis_key,
        null
      );
    });

    it("NO_POLICY → UNRESOLVED_NO_POLICY", () => {
      const resultSet = build148Pipeline();
      const set = build151(build150(resultSet));
      const r1 = r1State(set);
      assert.equal(r1.canonical_state_value, CANONICAL_UNRESOLVED_NO_POLICY);
      assert.equal(
        r1.result_interpretation_basis_assessment.current_composition_condition,
        COND_HOLDS
      );
      assert.equal(
        r1.canonical_state
          .resource_readiness_binding_evidence_composition_result_interpretation_basis_key,
        null
      );
    });

    it("NO_MAPPING → UNRESOLVED_NO_MAPPING", () => {
      const resultSet = build148Pipeline();
      const key = compositionPolicyKeyFrom148(resultSet);
      const set = build151(
        build150(resultSet, {
          requirement_policies: [
            {
              resource_readiness_binding_evidence_composition_policy_key: key,
              mappings: [],
            },
          ],
        })
      );
      const r1 = r1State(set);
      assert.equal(r1.canonical_state_value, CANONICAL_UNRESOLVED_NO_MAPPING);
      assert.notEqual(r1.canonical_state_value, CANONICAL_UNRESOLVED_NO_POLICY);
      assert.equal(
        r1.canonical_state
          .resource_readiness_binding_evidence_composition_result_interpretation_basis_key,
        null
      );
    });

    it("BASIS_PRESENT + POSITIVE → canonical POSITIVE", () => {
      const resultSet = build148Pipeline();
      const key = compositionPolicyKeyFrom148(resultSet);
      const set = build151(
        build150(resultSet, {
          requirement_policies: [
            {
              resource_readiness_binding_evidence_composition_policy_key: key,
              mappings: [
                {
                  composition_condition: COND_HOLDS,
                  interpretation: INTERP_POSITIVE,
                },
              ],
            },
          ],
        })
      );
      const r1 = r1State(set);
      assert.equal(r1.canonical_state_value, CANONICAL_POSITIVE);
      assert.ok(
        r1.canonical_state
          .resource_readiness_binding_evidence_composition_result_interpretation_basis_key
      );
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionState(
          r1.canonical_state_value
        ),
        true
      );
    });

    it("BASIS_PRESENT + NEGATIVE → canonical NEGATIVE (resolved)", () => {
      const resultSet = build148Pipeline();
      const key = compositionPolicyKeyFrom148(resultSet);
      const set = build151(
        build150(resultSet, {
          requirement_policies: [
            {
              resource_readiness_binding_evidence_composition_policy_key: key,
              mappings: [
                {
                  composition_condition: COND_HOLDS,
                  interpretation: INTERP_NEGATIVE,
                },
              ],
            },
          ],
        })
      );
      const r1 = r1State(set);
      assert.equal(r1.canonical_state_value, CANONICAL_NEGATIVE);
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionState(
          r1.canonical_state_value
        ),
        true
      );
      assert.equal(
        isUnresolvedAttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionState(
          r1.canonical_state_value
        ),
        false
      );
    });
  });

  describe("unusual mapping preservation", () => {
    it("HOLDS→NEGATIVE ancestry → canonical NEGATIVE (no correction)", () => {
      const resultSet = build148Pipeline();
      assert.equal(
        resultSet.candidate_assessments[0]!.requirement_composition_result_assessments.find(
          (a) => a.observation_resource_requirement_key === R1.key
        )!.composition_condition,
        COND_HOLDS
      );
      const key = compositionPolicyKeyFrom148(resultSet);
      const basisSet = build150(resultSet, {
        requirement_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key: key,
            mappings: reverseMappings(),
          },
        ],
      });
      const r1Basis =
        basisSet.candidate_assessments[0]!.requirement_interpretation_basis_assessments.find(
          (a) => a.observation_resource_requirement_key === R1.key
        )!;
      assert.equal(r1Basis.interpretation, INTERP_NEGATIVE);
      const r1 = r1State(build151(basisSet));
      assert.equal(r1.canonical_state_value, CANONICAL_NEGATIVE);
    });

    it("DOES_NOT_HOLD→POSITIVE ancestry → canonical POSITIVE", () => {
      const resultSet = build148Pipeline({
        stateValues: [NEGATIVE, NEGATIVE],
      });
      assert.equal(
        resultSet.candidate_assessments[0]!.requirement_composition_result_assessments.find(
          (a) => a.observation_resource_requirement_key === R1.key
        )!.composition_condition,
        COND_DOES_NOT_HOLD
      );
      const key = compositionPolicyKeyFrom148(resultSet);
      const r1 = r1State(
        build151(
          build150(resultSet, {
            requirement_policies: [
              {
                resource_readiness_binding_evidence_composition_policy_key: key,
                mappings: reverseMappings(),
              },
            ],
          })
        )
      );
      assert.equal(r1.canonical_state_value, CANONICAL_POSITIVE);
    });

    it("conventional HOLDS→POSITIVE / DOES_NOT_HOLD→NEGATIVE", () => {
      const holdsSet = build148Pipeline();
      const holdsKey = compositionPolicyKeyFrom148(holdsSet);
      assert.equal(
        r1State(
          build151(
            build150(holdsSet, {
              requirement_policies: [
                {
                  resource_readiness_binding_evidence_composition_policy_key:
                    holdsKey,
                  mappings: conventionalMappings(),
                },
              ],
            })
          )
        ).canonical_state_value,
        CANONICAL_POSITIVE
      );

      const notHoldsSet = build148Pipeline({
        stateValues: [NEGATIVE, NEGATIVE],
      });
      const notHoldsKey = compositionPolicyKeyFrom148(notHoldsSet);
      assert.equal(
        r1State(
          build151(
            build150(notHoldsSet, {
              requirement_policies: [
                {
                  resource_readiness_binding_evidence_composition_policy_key:
                    notHoldsKey,
                  mappings: conventionalMappings(),
                },
              ],
            })
          )
        ).canonical_state_value,
        CANONICAL_NEGATIVE
      );
    });
  });

  describe("cardinality / identity / resolvedness", () => {
    it("all GROUND-150 Requirement assessments represented", () => {
      const basisSet = build150(build148Pipeline());
      const set = build151(basisSet);
      assert.equal(
        set.candidate_assessments[0]!.requirement_canonical_state_assessments
          .length,
        basisSet.candidate_assessments[0]!
          .requirement_interpretation_basis_assessments.length
      );
    });

    it("candidate summaries coexist; State identity includes Basis lineage", () => {
      const resultSet = build148Pipeline();
      const key = compositionPolicyKeyFrom148(resultSet);
      // R1 NEGATIVE (resolved) + R2/R3 NOT_APPLICABLE; separately verify unresolved flag via NO_POLICY path
      const set = build151(
        build150(resultSet, {
          requirement_policies: [
            {
              resource_readiness_binding_evidence_composition_policy_key: key,
              mappings: reverseMappings(),
            },
          ],
        })
      );
      assert.equal(
        set.has_explicitly_interpreted_resource_readiness_binding_evidence_composition_negative_states,
        true
      );
      assert.equal(
        set.has_not_applicable_resource_readiness_binding_evidence_composition_states,
        true
      );

      const unresolvedSet = build151(build150(resultSet));
      assert.equal(
        unresolvedSet.has_unresolved_resource_readiness_binding_evidence_composition_states,
        true
      );
      assert.equal(
        unresolvedSet.has_not_applicable_resource_readiness_binding_evidence_composition_states,
        true
      );

      const r1 = r1State(set);
      const expected =
        attentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateKey(
          {
            candidate_key: r1.canonical_state.candidate_key,
            observation_need_key: r1.canonical_state.observation_need_key,
            capability_requirement_set_key:
              r1.canonical_state.capability_requirement_set_key,
            observation_resource_requirement_key:
              r1.canonical_state.observation_resource_requirement_key,
            resource_readiness_binding_evidence_composition_policy_key:
              r1.canonical_state
                .resource_readiness_binding_evidence_composition_policy_key,
            resource_readiness_binding_evidence_composition_result_interpretation_basis_key:
              r1.canonical_state
                .resource_readiness_binding_evidence_composition_result_interpretation_basis_key,
            ground150_status:
              r1.result_interpretation_basis_assessment.status,
            value: r1.canonical_state_value,
          }
        );
      assert.equal(r1.canonical_state.key, expected);
    });

    it("same POSITIVE value / different Basis lineage → distinct State keys", () => {
      const holdsSet = build148Pipeline();
      const holdsKey = compositionPolicyKeyFrom148(holdsSet);
      const a = r1State(
        build151(
          build150(holdsSet, {
            requirement_policies: [
              {
                resource_readiness_binding_evidence_composition_policy_key:
                  holdsKey,
                mappings: [
                  {
                    composition_condition: COND_HOLDS,
                    interpretation: INTERP_POSITIVE,
                  },
                ],
              },
            ],
          })
        )
      );

      const notHoldsSet = build148Pipeline({
        stateValues: [NEGATIVE, NEGATIVE],
      });
      const notHoldsKey = compositionPolicyKeyFrom148(notHoldsSet);
      const b = r1State(
        build151(
          build150(notHoldsSet, {
            requirement_policies: [
              {
                resource_readiness_binding_evidence_composition_policy_key:
                  notHoldsKey,
                mappings: [
                  {
                    composition_condition: COND_DOES_NOT_HOLD,
                    interpretation: INTERP_POSITIVE,
                  },
                ],
              },
            ],
          })
        )
      );

      assert.equal(a.canonical_state_value, CANONICAL_POSITIVE);
      assert.equal(b.canonical_state_value, CANONICAL_POSITIVE);
      assert.notEqual(a.canonical_state.key, b.canonical_state.key);
      assert.notEqual(
        a.canonical_state
          .resource_readiness_binding_evidence_composition_result_interpretation_basis_key,
        b.canonical_state
          .resource_readiness_binding_evidence_composition_result_interpretation_basis_key
      );
    });

    it("State existence != resolvedness; NO_CURRENT != NO_POLICY != NO_MAPPING", () => {
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionState(
          CANONICAL_UNRESOLVED_NO_CURRENT_RESULT
        ),
        false
      );
      assert.equal(
        isResolvedAttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionState(
          CANONICAL_NOT_APPLICABLE
        ),
        false
      );
      assert.notEqual(
        CANONICAL_UNRESOLVED_NO_CURRENT_RESULT,
        CANONICAL_UNRESOLVED_NO_POLICY
      );
      assert.notEqual(
        CANONICAL_UNRESOLVED_NO_POLICY,
        CANONICAL_UNRESOLVED_NO_MAPPING
      );
    });
  });

  describe("malformed input rejection", () => {
    it("BASIS_PRESENT + null Basis rejects", () => {
      const resultSet = build148Pipeline();
      const key = compositionPolicyKeyFrom148(resultSet);
      const basisSet = build150(resultSet, {
        requirement_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key: key,
            mappings: [
              {
                composition_condition: COND_HOLDS,
                interpretation: INTERP_POSITIVE,
              },
            ],
          },
        ],
      });
      const good =
        basisSet.candidate_assessments[0]!.requirement_interpretation_basis_assessments.find(
          (a) => a.observation_resource_requirement_key === R1.key
        )!;
      const malformed = {
        ...good,
        interpretation_basis: null,
      } as AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisRequirementAssessment;
      assert.throws(
        () =>
          deriveAttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateValue(
            malformed
          ),
        /BASIS_PRESENT requires non-null Basis/
      );
    });

    it("BASIS_PRESENT + null interpretation rejects", () => {
      const resultSet = build148Pipeline();
      const key = compositionPolicyKeyFrom148(resultSet);
      const basisSet = build150(resultSet, {
        requirement_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key: key,
            mappings: [
              {
                composition_condition: COND_HOLDS,
                interpretation: INTERP_POSITIVE,
              },
            ],
          },
        ],
      });
      const good =
        basisSet.candidate_assessments[0]!.requirement_interpretation_basis_assessments.find(
          (a) => a.observation_resource_requirement_key === R1.key
        )!;
      const malformed = {
        ...good,
        interpretation: null,
      } as AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisRequirementAssessment;
      assert.throws(
        () =>
          deriveAttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateValue(
            malformed
          ),
        /BASIS_PRESENT requires non-null interpretation/
      );
    });

    it("non-BASIS status + contradictory Basis rejects", () => {
      const resultSet = build148Pipeline();
      const key = compositionPolicyKeyFrom148(resultSet);
      const withBasis = build150(resultSet, {
        requirement_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key: key,
            mappings: [
              {
                composition_condition: COND_HOLDS,
                interpretation: INTERP_POSITIVE,
              },
            ],
          },
        ],
      });
      const present =
        withBasis.candidate_assessments[0]!.requirement_interpretation_basis_assessments.find(
          (a) => a.observation_resource_requirement_key === R1.key
        )!;
      const noPolicy =
        build150(resultSet).candidate_assessments[0]!
          .requirement_interpretation_basis_assessments.find(
            (a) => a.observation_resource_requirement_key === R1.key
          )!;
      const malformed = {
        ...noPolicy,
        interpretation_basis: present.interpretation_basis,
        interpretation: present.interpretation,
      } as AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisRequirementAssessment;
      assert.throws(
        () =>
          deriveAttentionObservationOperationalEligibilityCanonicalPerRequirementResourceReadinessBindingEvidenceCompositionStateValue(
            malformed
          ),
        /non-present status requires null Basis/
      );
    });
  });

  describe("immutability / determinism", () => {
    it("input immutability / deep-clone / determinism", () => {
      const resultSet = build148Pipeline();
      const key = compositionPolicyKeyFrom148(resultSet);
      const basisSet = build150(resultSet, {
        requirement_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key: key,
            mappings: conventionalMappings(),
          },
        ],
      });
      const before = deepClone(basisSet);
      const a = build151(basisSet);
      assert.deepEqual(basisSet, before);
      assert.deepEqual(a, build151(basisSet));
      assert.deepEqual(a, build151(deepClone(basisSet)));
    });
  });

  describe("static proofs", () => {
    it("GROUND-150 only; no HOLDS reopen / READY / older layers / generic UNRESOLVED", () => {
      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-canonical-per-requirement-resource-readiness-binding-evidence-composition-state-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-canonical-per-requirement-resource-readiness-binding-evidence-composition-state-types.ts"
      );
      const core = readFileSync(corePath, "utf8");
      const types = readFileSync(typesPath, "utf8");
      const src = `${core}\n${types}`;

      assert.ok(
        /binding-evidence-composition-result-interpretation-basis-types/.test(
          core
        )
      );
      assert.ok(
        !/binding-evidence-composition-result-interpretation-policy-core/.test(
          core
        )
      );
      assert.ok(
        !/binding-evidence-composition-result-core/.test(core)
      );
      assert.ok(
        !/binding-evidence-composition-readiness-basis-core/.test(core)
      );
      assert.ok(
        !/binding-evidence-composition-policy-core/.test(core)
      );
      assert.ok(
        !/canonical-per-binding-resource-readiness-evidence-state-core/.test(
          core
        )
      );
      assert.ok(!/ProjectState/.test(core));
      assert.ok(!/applyPatch/.test(src));
      assert.ok(!/saveProject/.test(src));
      assert.ok(!/"RESOURCE_READY"/.test(src));
      assert.ok(!/"RESOURCE_NOT_READY"/.test(src));
      assert.ok(!/"SATISFIED"/.test(src));
      assert.ok(!/"UNSATISFIED"/.test(src));
      assert.ok(!/can_execute/.test(src));
      assert.ok(!/"FEASIBILITY"/.test(src));
      assert.ok(!/from "\.\/feasibility/.test(core));
      assert.ok(
        !/RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_HOLDS/.test(
          core
        )
      );
      assert.ok(
        !/RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD/.test(
          core
        )
      );
      assert.ok(!/current_composition_condition/.test(core));
      assert.ok(!/findExactResourceReadiness/.test(core));
      assert.ok(!/ANY_RESOURCE_READINESS/.test(core));
      assert.ok(!/ALL_RESOURCE_READINESS/.test(core));
      assert.ok(!/"UNRESOLVED"/.test(types));
      assert.ok(
        /UNRESOLVED_NO_CURRENT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT/.test(
          types
        )
      );
      assert.ok(
        /TRUE_PER_REQUIREMENT_RESOURCE_READINESS_NOT_MODELED/.test(types)
      );
      assert.ok(
        /OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED/.test(
          types
        )
      );
      assert.ok(!/\bcan_execute\b/.test(src) || /CAN_EXECUTE_NOT_MODELED/.test(types));
      assert.ok(
        /INTERPRET_AS_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POSITIVE/.test(
          core
        )
      );
      assert.ok(
        /INTERPRET_AS_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_NEGATIVE/.test(
          core
        )
      );
      assert.ok(/case POSITIVE_INTERPRETATION/.test(core));
      assert.ok(/case NEGATIVE_INTERPRETATION/.test(core));
    });
  });
});
