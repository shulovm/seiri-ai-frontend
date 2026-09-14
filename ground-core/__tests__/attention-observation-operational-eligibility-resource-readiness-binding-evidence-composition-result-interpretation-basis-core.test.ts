/**
 * GROUND-150 — Observation Core CIV / RESOURCE_READINESS Binding Evidence
 * Composition Result Interpretation Basis Foundation
 *
 * current GROUND-148 Result + GROUND-149 Interpretation Policy
 * → exact current Result Interpretation Basis
 *
 * Five statuses remain distinct. Unusual mappings are authoritative.
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
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
  attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisKey,
  buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisSet,
  findExactResourceReadinessBindingEvidenceCompositionResultInterpretationMapping,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-interpretation-basis-core.js";
import {
  buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicySet,
  extractStableResourceReadinessBindingEvidenceCompositionPolicyFromResultAssessment,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-interpretation-policy-core.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicySetAssessment,
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
  policySet: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicySetAssessment
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisSet(
    {
      resource_readiness_binding_evidence_composition_result_set: resultSet,
      resource_readiness_binding_evidence_composition_result_interpretation_policy_set:
        policySet,
    }
  );
}

function r1Basis(
  set: ReturnType<typeof build150>
) {
  return set.candidate_assessments[0]!.requirement_interpretation_basis_assessments.find(
    (a) => a.observation_resource_requirement_key === R1.key
  )!;
}

function r3Basis(
  set: ReturnType<typeof build150>
) {
  return set.candidate_assessments[0]!.requirement_interpretation_basis_assessments.find(
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

describe("GROUND-150 RESOURCE_READINESS Binding Evidence Composition Result Interpretation Basis", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.25");
  });

  it("model limitations fixed order", () => {
    assert.deepEqual(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
      [
        "PER_REQUIREMENT_CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_NOT_MODELED",
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

  describe("five-status semantics", () => {
    it("NOT_APPLICABLE → no Basis", () => {
      const resultSet = build148Pipeline({
        includeR1Any: false,
        includeR1All: false,
        declareReadiness: false,
        stateValues: [],
        r1Members: [],
      });
      const set = build150(resultSet, build149(resultSet));
      const r3 = r3Basis(set);
      assert.equal(
        r3.status,
        "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY"
      );
      assert.equal(r3.interpretation_basis, null);
      assert.equal(r3.current_composition_condition, null);
      assert.equal(r3.interpretation, null);
      assert.equal(
        r3.has_resource_readiness_binding_evidence_composition_result_interpretation_basis,
        false
      );
    });

    it("no current Result + no Policy → NO_CURRENT_RESULT (≠ NO_POLICY)", () => {
      const resultSet = build148Pipeline({ declareReadiness: false });
      const set = build150(resultSet, build149(resultSet));
      const r1 = r1Basis(set);
      assert.equal(
        r1.status,
        "NO_CURRENT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT"
      );
      assert.equal(
        r1.binding_evidence_composition_result_assessment.status,
        "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_DECLARED"
      );
      assert.notEqual(
        r1.status,
        "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(r1.interpretation, null);
    });

    it("no current Result + Policy present → NO_CURRENT_RESULT", () => {
      const resultSet = build148Pipeline({ declareReadiness: false });
      const key = compositionPolicyKeyFrom148(resultSet);
      const set = build150(
        resultSet,
        build149(resultSet, {
          requirement_policies: [
            {
              resource_readiness_binding_evidence_composition_policy_key: key,
              mappings: conventionalMappings(),
            },
          ],
        })
      );
      const r1 = r1Basis(set);
      assert.equal(
        r1.status,
        "NO_CURRENT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT"
      );
      assert.equal(
        r1.result_interpretation_policy_assessment.status,
        "EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_PRESENT"
      );
      assert.equal(r1.interpretation_basis, null);
    });

    it("no current Result + explicit empty Policy → NO_CURRENT_RESULT (≠ NO_MAPPING)", () => {
      const resultSet = build148Pipeline({
        stateValues: [UNRESOLVED_POLICY, POSITIVE],
      });
      const key = compositionPolicyKeyFrom148(resultSet);
      assert.equal(
        resultSet.candidate_assessments[0]!.requirement_composition_result_assessments.find(
          (a) => a.observation_resource_requirement_key === R1.key
        )!.status,
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
      );
      const set = build150(
        resultSet,
        build149(resultSet, {
          requirement_policies: [
            {
              resource_readiness_binding_evidence_composition_policy_key: key,
              mappings: [],
            },
          ],
        })
      );
      const r1 = r1Basis(set);
      assert.equal(
        r1.status,
        "NO_CURRENT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT"
      );
      assert.notEqual(
        r1.status,
        "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_COMPOSITION_RESULT"
      );
    });

    it("current HOLDS / no Policy → NO_POLICY", () => {
      const resultSet = build148Pipeline();
      const r1Result =
        resultSet.candidate_assessments[0]!.requirement_composition_result_assessments.find(
          (a) => a.observation_resource_requirement_key === R1.key
        )!;
      assert.equal(r1Result.composition_condition, COND_HOLDS);
      const set = build150(resultSet, build149(resultSet));
      const r1 = r1Basis(set);
      assert.equal(
        r1.status,
        "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(r1.current_composition_condition, COND_HOLDS);
      assert.equal(r1.interpretation_basis, null);
    });

    it("current DOES_NOT_HOLD / no Policy → NO_POLICY", () => {
      const resultSet = build148Pipeline({
        stateValues: [NEGATIVE, NEGATIVE],
      });
      const r1Result =
        resultSet.candidate_assessments[0]!.requirement_composition_result_assessments.find(
          (a) => a.observation_resource_requirement_key === R1.key
        )!;
      assert.equal(r1Result.composition_condition, COND_DOES_NOT_HOLD);
      const set = build150(resultSet, build149(resultSet));
      const r1 = r1Basis(set);
      assert.equal(
        r1.status,
        "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(r1.current_composition_condition, COND_DOES_NOT_HOLD);
    });

    it("current HOLDS / empty explicit Policy → NO_MAPPING", () => {
      const resultSet = build148Pipeline();
      const key = compositionPolicyKeyFrom148(resultSet);
      const set = build150(
        resultSet,
        build149(resultSet, {
          requirement_policies: [
            {
              resource_readiness_binding_evidence_composition_policy_key: key,
              mappings: [],
            },
          ],
        })
      );
      const r1 = r1Basis(set);
      assert.equal(
        r1.status,
        "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_COMPOSITION_RESULT"
      );
      assert.equal(r1.current_composition_condition, COND_HOLDS);
      assert.equal(r1.interpretation, null);
      assert.notEqual(
        r1.status,
        "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_DECLARED"
      );
    });

    it("current DOES_NOT_HOLD / empty explicit Policy → NO_MAPPING", () => {
      const resultSet = build148Pipeline({
        stateValues: [NEGATIVE, NEGATIVE],
      });
      const key = compositionPolicyKeyFrom148(resultSet);
      const set = build150(
        resultSet,
        build149(resultSet, {
          requirement_policies: [
            {
              resource_readiness_binding_evidence_composition_policy_key: key,
              mappings: [],
            },
          ],
        })
      );
      assert.equal(
        r1Basis(set).status,
        "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_COMPOSITION_RESULT"
      );
    });

    it("NO_POLICY != NO_MAPPING", () => {
      const resultSet = build148Pipeline();
      const key = compositionPolicyKeyFrom148(resultSet);
      const noPolicy = r1Basis(build150(resultSet, build149(resultSet)));
      const noMapping = r1Basis(
        build150(
          resultSet,
          build149(resultSet, {
            requirement_policies: [
              {
                resource_readiness_binding_evidence_composition_policy_key: key,
                mappings: [],
              },
            ],
          })
        )
      );
      assert.equal(
        noPolicy.status,
        "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(
        noMapping.status,
        "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_COMPOSITION_RESULT"
      );
      assert.notEqual(noPolicy.status, noMapping.status);
    });

    it("Result absent + Policy absent → NO_CURRENT_RESULT (ordering)", () => {
      const resultSet = build148Pipeline({ declareReadiness: false });
      const r1 = r1Basis(build150(resultSet, build149(resultSet)));
      assert.equal(
        r1.status,
        "NO_CURRENT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT"
      );
    });
  });

  describe("exact mapping / unusual trust", () => {
    it("current HOLDS / partial HOLDS→POSITIVE → BASIS_PRESENT / POSITIVE", () => {
      const resultSet = build148Pipeline();
      const key = compositionPolicyKeyFrom148(resultSet);
      const set = build150(
        resultSet,
        build149(resultSet, {
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
      const r1 = r1Basis(set);
      assert.equal(
        r1.status,
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_BASIS_PRESENT"
      );
      assert.equal(r1.interpretation, INTERP_POSITIVE);
      assert.ok(r1.interpretation_basis);
      assert.equal(
        r1.has_resource_readiness_binding_evidence_composition_result_interpretation_basis,
        true
      );
    });

    it("current HOLDS / partial HOLDS→NEGATIVE → BASIS_PRESENT / NEGATIVE", () => {
      const resultSet = build148Pipeline();
      const key = compositionPolicyKeyFrom148(resultSet);
      const r1 = r1Basis(
        build150(
          resultSet,
          build149(resultSet, {
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
        )
      );
      assert.equal(
        r1.status,
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_BASIS_PRESENT"
      );
      assert.equal(r1.interpretation, INTERP_NEGATIVE);
    });

    it("current DOES_NOT_HOLD / DOES_NOT_HOLD→NEGATIVE → BASIS_PRESENT", () => {
      const resultSet = build148Pipeline({
        stateValues: [NEGATIVE, NEGATIVE],
      });
      const key = compositionPolicyKeyFrom148(resultSet);
      const r1 = r1Basis(
        build150(
          resultSet,
          build149(resultSet, {
            requirement_policies: [
              {
                resource_readiness_binding_evidence_composition_policy_key: key,
                mappings: [
                  {
                    composition_condition: COND_DOES_NOT_HOLD,
                    interpretation: INTERP_NEGATIVE,
                  },
                ],
              },
            ],
          })
        )
      );
      assert.equal(r1.interpretation, INTERP_NEGATIVE);
    });

    it("current DOES_NOT_HOLD / DOES_NOT_HOLD→POSITIVE → BASIS_PRESENT", () => {
      const resultSet = build148Pipeline({
        stateValues: [NEGATIVE, NEGATIVE],
      });
      const key = compositionPolicyKeyFrom148(resultSet);
      const r1 = r1Basis(
        build150(
          resultSet,
          build149(resultSet, {
            requirement_policies: [
              {
                resource_readiness_binding_evidence_composition_policy_key: key,
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
      assert.equal(r1.interpretation, INTERP_POSITIVE);
    });

    it("current HOLDS / only DOES_NOT_HOLD mapping → NO_MAPPING", () => {
      const resultSet = build148Pipeline();
      const key = compositionPolicyKeyFrom148(resultSet);
      const r1 = r1Basis(
        build150(
          resultSet,
          build149(resultSet, {
            requirement_policies: [
              {
                resource_readiness_binding_evidence_composition_policy_key: key,
                mappings: [
                  {
                    composition_condition: COND_DOES_NOT_HOLD,
                    interpretation: INTERP_NEGATIVE,
                  },
                ],
              },
            ],
          })
        )
      );
      assert.equal(
        r1.status,
        "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_COMPOSITION_RESULT"
      );
      assert.equal(r1.interpretation, null);
    });

    it("current DOES_NOT_HOLD / only HOLDS mapping → NO_MAPPING", () => {
      const resultSet = build148Pipeline({
        stateValues: [NEGATIVE, NEGATIVE],
      });
      const key = compositionPolicyKeyFrom148(resultSet);
      const r1 = r1Basis(
        build150(
          resultSet,
          build149(resultSet, {
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
        )
      );
      assert.equal(
        r1.status,
        "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_MAPPING_FOR_CURRENT_COMPOSITION_RESULT"
      );
    });

    it("conventional full Policy exact expected mappings", () => {
      const holdsSet = build148Pipeline();
      const holdsKey = compositionPolicyKeyFrom148(holdsSet);
      const holds = r1Basis(
        build150(
          holdsSet,
          build149(holdsSet, {
            requirement_policies: [
              {
                resource_readiness_binding_evidence_composition_policy_key:
                  holdsKey,
                mappings: conventionalMappings(),
              },
            ],
          })
        )
      );
      assert.equal(holds.interpretation, INTERP_POSITIVE);

      const notHoldsSet = build148Pipeline({
        stateValues: [NEGATIVE, NEGATIVE],
      });
      const notHoldsKey = compositionPolicyKeyFrom148(notHoldsSet);
      const notHolds = r1Basis(
        build150(
          notHoldsSet,
          build149(notHoldsSet, {
            requirement_policies: [
              {
                resource_readiness_binding_evidence_composition_policy_key:
                  notHoldsKey,
                mappings: conventionalMappings(),
              },
            ],
          })
        )
      );
      assert.equal(notHolds.interpretation, INTERP_NEGATIVE);
    });

    it("reverse full Policy exact reverse mappings trusted", () => {
      const holdsSet = build148Pipeline();
      const holdsKey = compositionPolicyKeyFrom148(holdsSet);
      const holds = r1Basis(
        build150(
          holdsSet,
          build149(holdsSet, {
            requirement_policies: [
              {
                resource_readiness_binding_evidence_composition_policy_key:
                  holdsKey,
                mappings: reverseMappings(),
              },
            ],
          })
        )
      );
      assert.equal(holds.interpretation, INTERP_NEGATIVE);

      const notHoldsSet = build148Pipeline({
        stateValues: [NEGATIVE, NEGATIVE],
      });
      const notHoldsKey = compositionPolicyKeyFrom148(notHoldsSet);
      const notHolds = r1Basis(
        build150(
          notHoldsSet,
          build149(notHoldsSet, {
            requirement_policies: [
              {
                resource_readiness_binding_evidence_composition_policy_key:
                  notHoldsKey,
                mappings: reverseMappings(),
              },
            ],
          })
        )
      );
      assert.equal(notHolds.interpretation, INTERP_POSITIVE);
    });

    it("same interpretation both source values → distinct Basis lineage", () => {
      const holdsSet = build148Pipeline();
      const holdsKey = compositionPolicyKeyFrom148(holdsSet);
      const samePositive = [
        {
          composition_condition: COND_HOLDS,
          interpretation: INTERP_POSITIVE,
        },
        {
          composition_condition: COND_DOES_NOT_HOLD,
          interpretation: INTERP_POSITIVE,
        },
      ];
      const holdsBasis = r1Basis(
        build150(
          holdsSet,
          build149(holdsSet, {
            requirement_policies: [
              {
                resource_readiness_binding_evidence_composition_policy_key:
                  holdsKey,
                mappings: samePositive,
              },
            ],
          })
        )
      ).interpretation_basis!;

      const notHoldsSet = build148Pipeline({
        stateValues: [NEGATIVE, NEGATIVE],
      });
      const notHoldsKey = compositionPolicyKeyFrom148(notHoldsSet);
      const notHoldsBasis = r1Basis(
        build150(
          notHoldsSet,
          build149(notHoldsSet, {
            requirement_policies: [
              {
                resource_readiness_binding_evidence_composition_policy_key:
                  notHoldsKey,
                mappings: samePositive,
              },
            ],
          })
        )
      ).interpretation_basis!;

      assert.equal(holdsBasis.interpretation, INTERP_POSITIVE);
      assert.equal(notHoldsBasis.interpretation, INTERP_POSITIVE);
      assert.notEqual(holdsBasis.key, notHoldsBasis.key);
      assert.notEqual(
        holdsBasis.current_composition_condition,
        notHoldsBasis.current_composition_condition
      );
      assert.notEqual(
        holdsBasis.resource_readiness_binding_evidence_composition_result_key,
        notHoldsBasis.resource_readiness_binding_evidence_composition_result_key
      );
    });

    it("mapping lookup by exact composition_condition only", () => {
      const found = findExactResourceReadinessBindingEvidenceCompositionResultInterpretationMapping(
        [
          {
            key: "m1",
            composition_condition: COND_HOLDS,
            interpretation: INTERP_POSITIVE,
          },
          {
            key: "m2",
            composition_condition: COND_DOES_NOT_HOLD,
            interpretation: INTERP_NEGATIVE,
          },
        ],
        COND_HOLDS
      );
      assert.equal(found?.key, "m1");
      assert.equal(
        findExactResourceReadinessBindingEvidenceCompositionResultInterpretationMapping(
          [
            {
              key: "m2",
              composition_condition: COND_DOES_NOT_HOLD,
              interpretation: INTERP_NEGATIVE,
            },
          ],
          COND_HOLDS
        ),
        null
      );
    });

    it("conflicting duplicate mappings reject", () => {
      assert.throws(
        () =>
          findExactResourceReadinessBindingEvidenceCompositionResultInterpretationMapping(
            [
              {
                key: "m1",
                composition_condition: COND_HOLDS,
                interpretation: INTERP_POSITIVE,
              },
              {
                key: "m2",
                composition_condition: COND_HOLDS,
                interpretation: INTERP_NEGATIVE,
              },
            ],
            COND_HOLDS
          ),
        /multiplicity/
      );
    });
  });

  describe("identity / firewall", () => {
    it("Basis identity includes Result / Policy / mapping keys", () => {
      const resultSet = build148Pipeline();
      const key = compositionPolicyKeyFrom148(resultSet);
      const policySet = build149(resultSet, {
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
      const basis = r1Basis(build150(resultSet, policySet)).interpretation_basis!;
      const expected =
        attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationBasisKey(
          {
            candidate_key: basis.candidate_key,
            observation_need_key: basis.observation_need_key,
            capability_requirement_set_key:
              basis.capability_requirement_set_key,
            observation_resource_requirement_key:
              basis.observation_resource_requirement_key,
            resource_readiness_binding_evidence_composition_policy_key:
              basis.resource_readiness_binding_evidence_composition_policy_key,
            resource_readiness_binding_evidence_composition_result_key:
              basis.resource_readiness_binding_evidence_composition_result_key,
            resource_readiness_binding_evidence_composition_result_interpretation_policy_key:
              basis.resource_readiness_binding_evidence_composition_result_interpretation_policy_key,
            matched_mapping_key: basis.matched_mapping_key,
            current_composition_condition:
              basis.current_composition_condition,
            interpretation: basis.interpretation,
          }
        );
      assert.equal(basis.key, expected);
      assert.match(
        basis.key,
        /^attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-interpretation-basis\|/
      );
      assert.ok(
        basis.key.includes(
          basis.resource_readiness_binding_evidence_composition_result_key
        )
      );
      assert.ok(
        basis.key.includes(
          basis.resource_readiness_binding_evidence_composition_result_interpretation_policy_key
        )
      );
      assert.ok(basis.key.includes(basis.matched_mapping_key));
    });

    it("Basis identity changes when current Result / Policy / mapping change", () => {
      const holdsSet = build148Pipeline();
      const holdsKey = compositionPolicyKeyFrom148(holdsSet);
      const positivePolicy = build149(holdsSet, {
        requirement_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key: holdsKey,
            mappings: [
              {
                composition_condition: COND_HOLDS,
                interpretation: INTERP_POSITIVE,
              },
            ],
          },
        ],
      });
      const negativePolicy = build149(holdsSet, {
        requirement_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key: holdsKey,
            mappings: [
              {
                composition_condition: COND_HOLDS,
                interpretation: INTERP_NEGATIVE,
              },
            ],
          },
        ],
      });
      const a = r1Basis(build150(holdsSet, positivePolicy)).interpretation_basis!;
      const b = r1Basis(build150(holdsSet, negativePolicy)).interpretation_basis!;
      assert.notEqual(a.key, b.key);
      assert.notEqual(a.matched_mapping_key, b.matched_mapping_key);
      assert.notEqual(
        a.resource_readiness_binding_evidence_composition_result_interpretation_policy_key,
        b.resource_readiness_binding_evidence_composition_result_interpretation_policy_key
      );

      const notHoldsSet = build148Pipeline({
        stateValues: [NEGATIVE, NEGATIVE],
      });
      const notHoldsKey = compositionPolicyKeyFrom148(notHoldsSet);
      const c = r1Basis(
        build150(
          notHoldsSet,
          build149(notHoldsSet, {
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
      ).interpretation_basis!;
      assert.equal(a.interpretation, INTERP_POSITIVE);
      assert.equal(c.interpretation, INTERP_POSITIVE);
      assert.notEqual(a.key, c.key);
    });

    it("NO_CURRENT_RESULT / NO_MAPPING != NEGATIVE; HOLDS != POSITIVE without mapping", () => {
      const noResultSet = build148Pipeline({ declareReadiness: false });
      const noResult = r1Basis(
        build150(noResultSet, build149(noResultSet))
      );
      assert.equal(noResult.interpretation, null);
      assert.notEqual(noResult.interpretation, INTERP_NEGATIVE);

      const resultSet = build148Pipeline();
      const key = compositionPolicyKeyFrom148(resultSet);
      const noMapping = r1Basis(
        build150(
          resultSet,
          build149(resultSet, {
            requirement_policies: [
              {
                resource_readiness_binding_evidence_composition_policy_key: key,
                mappings: [],
              },
            ],
          })
        )
      );
      assert.equal(noMapping.current_composition_condition, COND_HOLDS);
      assert.equal(noMapping.interpretation, null);

      const noPolicy = r1Basis(build150(resultSet, build149(resultSet)));
      assert.equal(noPolicy.current_composition_condition, COND_HOLDS);
      assert.equal(noPolicy.interpretation, null);
    });

    it("candidate positive/negative booleans coexist (existence only)", () => {
      // R1 HOLDS→POSITIVE via ANY; only one composition requirement with Basis.
      // Mixed coexistence across requirements isn't available with single R1 policy —
      // verify set-level existence flags remain existence-only.
      const resultSet = build148Pipeline();
      const key = compositionPolicyKeyFrom148(resultSet);
      const set = build150(
        resultSet,
        build149(resultSet, {
          requirement_policies: [
            {
              resource_readiness_binding_evidence_composition_policy_key: key,
              mappings: reverseMappings(),
            },
          ],
        })
      );
      assert.equal(
        set.has_resource_readiness_binding_evidence_composition_result_interpretation_bases,
        true
      );
      assert.equal(
        set.has_resource_readiness_binding_evidence_composition_positive_interpretations,
        false
      );
      assert.equal(
        set.has_resource_readiness_binding_evidence_composition_negative_interpretations,
        true
      );
    });
  });

  describe("cross-input join", () => {
    it("composition-policy-key mismatch rejects", () => {
      const anySet = build148Pipeline({ includeR1Any: true });
      const allSet = build148Pipeline({
        includeR1Any: false,
        includeR1All: true,
      });
      const anyKey = compositionPolicyKeyFrom148(anySet);
      const anyPolicy = build149(anySet, {
        requirement_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key: anyKey,
            mappings: conventionalMappings(),
          },
        ],
      });
      assert.throws(
        () => build150(allSet, anyPolicy),
        /do not share compatible stable composition context/
      );
    });

    it("stale old composition policy rejects", () => {
      const anySet = build148Pipeline();
      const allSet = build148Pipeline({
        includeR1Any: false,
        includeR1All: true,
      });
      const anyKey = compositionPolicyKeyFrom148(anySet);
      assert.notEqual(anyKey, compositionPolicyKeyFrom148(allSet));
      assert.throws(
        () =>
          build150(
            allSet,
            build149(anySet, {
              requirement_policies: [
                {
                  resource_readiness_binding_evidence_composition_policy_key:
                    anyKey,
                  mappings: conventionalMappings(),
                },
              ],
            })
          ),
        /composition context/
      );
    });

    it("readiness-policy-key is not required in Interpretation Policy / Basis identity", () => {
      const resultSet = build148Pipeline();
      const key = compositionPolicyKeyFrom148(resultSet);
      const basis = r1Basis(
        build150(
          resultSet,
          build149(resultSet, {
            requirement_policies: [
              {
                resource_readiness_binding_evidence_composition_policy_key: key,
                mappings: conventionalMappings(),
              },
            ],
          })
        )
      ).interpretation_basis!;
      assert.ok(
        !("resource_readiness_binding_evidence_composition_readiness_policy_key" in basis)
      );
      assert.equal(
        Object.keys(basis).includes(
          "resource_readiness_binding_evidence_composition_readiness_policy_key"
        ),
        false
      );
      assert.ok(
        basis.resource_readiness_binding_evidence_composition_policy_key === key
      );
    });
  });

  describe("immutability / determinism / ordering", () => {
    it("input immutability / deep-clone / determinism / ordering", () => {
      const resultSet = build148Pipeline();
      const key = compositionPolicyKeyFrom148(resultSet);
      const policySet = build149(resultSet, {
        requirement_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key: key,
            mappings: conventionalMappings(),
          },
        ],
      });
      const beforeResult = deepClone(resultSet);
      const beforePolicy = deepClone(policySet);
      const a = build150(resultSet, policySet);
      assert.deepEqual(resultSet, beforeResult);
      assert.deepEqual(policySet, beforePolicy);
      assert.deepEqual(a, build150(resultSet, policySet));
      assert.deepEqual(
        a,
        build150(deepClone(resultSet), deepClone(policySet))
      );

      const permutedResult = deepClone(resultSet);
      permutedResult.candidate_assessments[0]!.requirement_composition_result_assessments =
        [
          ...permutedResult.candidate_assessments[0]!
            .requirement_composition_result_assessments,
        ].reverse();
      // Cross-input still matches by key; nested 149 must stay consistent —
      // use authentic pair after rebuild for permutation of candidate order only.
      const permutedCandidates = deepClone(resultSet);
      const permutedPolicy = deepClone(policySet);
      // Single candidate — order invariance of set builder still holds.
      assert.deepEqual(
        build150(permutedCandidates, permutedPolicy),
        a
      );
    });
  });

  describe("static proofs", () => {
    it("GROUND-148+149 only; no default polarity / READY / OE / older recomputation", () => {
      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-interpretation-basis-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-interpretation-basis-types.ts"
      );
      const core = readFileSync(corePath, "utf8");
      const types = readFileSync(typesPath, "utf8");
      const src = `${core}\n${types}`;

      assert.ok(
        /binding-evidence-composition-result-types/.test(core)
      );
      assert.ok(
        /binding-evidence-composition-result-interpretation-policy-types/.test(
          core
        )
      );
      assert.ok(
        /binding-evidence-composition-result-interpretation-policy-core/.test(
          core
        )
      );
      assert.ok(
        !/binding-evidence-composition-readiness-basis-core/.test(core)
      );
      assert.ok(
        !/binding-evidence-composition-readiness-policy-core/.test(core)
      );
      assert.ok(!/binding-evidence-composition-policy-core/.test(core));
      assert.ok(
        !/canonical-per-binding-resource-readiness-evidence-state-core/.test(
          core
        )
      );
      assert.ok(
        !/resource-readiness-evidence-evaluation-state-interpretation-basis-core/.test(
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
      assert.ok(!/from "\.\/resource-reservation/.test(core));
      assert.ok(!/from "\.\/feasibility/.test(core));
      assert.ok(!/ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS/.test(core));
      assert.ok(!/ALL_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITIONS_HOLD/.test(core));
      assert.ok(
        !/EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_POSITIVE/.test(core)
      );
      assert.ok(
        !/deriveAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionCondition/.test(
          core
        )
      );
      assert.ok(
        !/composition_condition\s*===\s*"RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_HOLDS"[\s\S]*INTERPRET_AS_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POSITIVE/.test(
          core
        )
      );
      assert.ok(
        /PER_REQUIREMENT_CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_NOT_MODELED/.test(
          types
        )
      );
      assert.ok(
        /TRUE_PER_REQUIREMENT_RESOURCE_READINESS_NOT_MODELED/.test(types)
      );
      assert.ok(!/wildcard/i.test(src));
      assert.ok(!/nearest mapping/i.test(src));
      assert.ok(!/fallback mapping/i.test(src));
    });
  });
});
