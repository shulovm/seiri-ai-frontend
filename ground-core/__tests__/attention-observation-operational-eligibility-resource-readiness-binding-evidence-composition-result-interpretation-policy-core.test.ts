/**
 * GROUND-149 — Observation Core CIII / Explicit RESOURCE_READINESS
 * Binding Evidence Composition Result Interpretation Policy Foundation
 *
 * Declaration only over stable GROUND-148 composition context.
 * No current Result lookup. No default HOLDS→POSITIVE.
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
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
  attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyKey,
  buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicySet,
  canonicalizeResourceReadinessBindingEvidenceCompositionResultInterpretationMappings,
  EMPTY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_MAPPING_SET,
  extractStableResourceReadinessBindingEvidenceCompositionPolicyFromResultAssessment,
  normalizeAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicySpecification,
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

function r1Interp(
  set: ReturnType<typeof build149>
) {
  return set.candidate_assessments[0]!.requirement_interpretation_policy_assessments.find(
    (a) => a.observation_resource_requirement_key === R1.key
  )!;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-149 RESOURCE_READINESS Binding Evidence Composition Result Interpretation Policy", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.24");
  });

  it("model limitations fixed order", () => {
    assert.deepEqual(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
      [
        "CURRENT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_NOT_INTERPRETED",
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_BASIS_NOT_MODELED",
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

  describe("status semantics", () => {
    it("no composition policy → NOT_APPLICABLE", () => {
      const resultSet = build148Pipeline({
        includeR1Any: false,
        includeR1All: false,
        declareReadiness: false,
        stateValues: [],
        r1Members: [],
      });
      const set = build149(resultSet);
      const r3 = set.candidate_assessments[0]!.requirement_interpretation_policy_assessments.find(
        (a) => a.observation_resource_requirement_key === R3.key
      )!;
      assert.equal(
        r3.status,
        "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY"
      );
      assert.equal(r3.interpretation_policy, null);
      assert.equal(
        r3.has_explicit_resource_readiness_binding_evidence_composition_result_interpretation_policy,
        false
      );
    });

    it("stable context / no Interpretation Policy → NO_POLICY", () => {
      const resultSet = build148Pipeline();
      const set = build149(resultSet);
      const r1 = r1Interp(set);
      assert.equal(
        r1.status,
        "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(r1.interpretation_policy, null);
      assert.equal(
        r1.has_explicit_resource_readiness_binding_evidence_composition_result_interpretation_policy,
        false
      );
    });

    it("explicit empty Policy → POLICY_PRESENT (≠ NO_POLICY)", () => {
      const resultSet = build148Pipeline();
      const key = compositionPolicyKeyFrom148(resultSet);
      const set = build149(resultSet, {
        requirement_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key: key,
            mappings: [],
          },
        ],
      });
      const r1 = r1Interp(set);
      assert.equal(
        r1.status,
        "EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_PRESENT"
      );
      assert.ok(r1.interpretation_policy);
      assert.deepEqual(r1.interpretation_policy!.mappings, []);
      assert.equal(
        r1.has_explicit_resource_readiness_binding_evidence_composition_result_interpretation_policy,
        true
      );
      assert.ok(
        r1.interpretation_policy!.key.includes(
          EMPTY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_MAPPING_SET
        )
      );
    });
  });

  describe("mapping semantics", () => {
    it("partial / conventional / reverse / same-interpretation policies are valid", () => {
      const resultSet = build148Pipeline();
      const key = compositionPolicyKeyFrom148(resultSet);

      const partial = r1Interp(
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
      assert.equal(partial.interpretation_policy!.mappings.length, 1);

      const conventional = r1Interp(
        build149(resultSet, {
          requirement_policies: [
            {
              resource_readiness_binding_evidence_composition_policy_key: key,
              mappings: [
                {
                  composition_condition: COND_HOLDS,
                  interpretation: INTERP_POSITIVE,
                },
                {
                  composition_condition: COND_DOES_NOT_HOLD,
                  interpretation: INTERP_NEGATIVE,
                },
              ],
            },
          ],
        })
      );
      assert.equal(conventional.interpretation_policy!.mappings.length, 2);

      const reverse = r1Interp(
        build149(resultSet, {
          requirement_policies: [
            {
              resource_readiness_binding_evidence_composition_policy_key: key,
              mappings: [
                {
                  composition_condition: COND_HOLDS,
                  interpretation: INTERP_NEGATIVE,
                },
                {
                  composition_condition: COND_DOES_NOT_HOLD,
                  interpretation: INTERP_POSITIVE,
                },
              ],
            },
          ],
        })
      );
      assert.equal(
        reverse.interpretation_policy!.mappings.find(
          (m) => m.composition_condition === COND_HOLDS
        )!.interpretation,
        INTERP_NEGATIVE
      );

      const bothPositive = r1Interp(
        build149(resultSet, {
          requirement_policies: [
            {
              resource_readiness_binding_evidence_composition_policy_key: key,
              mappings: [
                {
                  composition_condition: COND_HOLDS,
                  interpretation: INTERP_POSITIVE,
                },
                {
                  composition_condition: COND_DOES_NOT_HOLD,
                  interpretation: INTERP_POSITIVE,
                },
              ],
            },
          ],
        })
      );
      assert.ok(
        bothPositive.interpretation_policy!.mappings.every(
          (m) => m.interpretation === INTERP_POSITIVE
        )
      );
    });

    it("duplicate identical normalize; conflicting reject; order invariance", () => {
      assert.equal(
        canonicalizeResourceReadinessBindingEvidenceCompositionResultInterpretationMappings(
          [
            {
              composition_condition: COND_HOLDS,
              interpretation: INTERP_POSITIVE,
            },
            {
              composition_condition: COND_HOLDS,
              interpretation: INTERP_POSITIVE,
            },
          ]
        ).length,
        1
      );
      assert.throws(
        () =>
          canonicalizeResourceReadinessBindingEvidenceCompositionResultInterpretationMappings(
            [
              {
                composition_condition: COND_HOLDS,
                interpretation: INTERP_POSITIVE,
              },
              {
                composition_condition: COND_HOLDS,
                interpretation: INTERP_NEGATIVE,
              },
            ]
          ),
        /Conflicting/
      );

      const resultSet = build148Pipeline();
      const key = compositionPolicyKeyFrom148(resultSet);
      const a = build149(resultSet, {
        requirement_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key: key,
            mappings: [
              {
                composition_condition: COND_DOES_NOT_HOLD,
                interpretation: INTERP_NEGATIVE,
              },
              {
                composition_condition: COND_HOLDS,
                interpretation: INTERP_POSITIVE,
              },
            ],
          },
        ],
      });
      const b = build149(resultSet, {
        requirement_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key: key,
            mappings: [
              {
                composition_condition: COND_HOLDS,
                interpretation: INTERP_POSITIVE,
              },
              {
                composition_condition: COND_DOES_NOT_HOLD,
                interpretation: INTERP_NEGATIVE,
              },
            ],
          },
        ],
      });
      assert.equal(
        r1Interp(a).interpretation_policy!.key,
        r1Interp(b).interpretation_policy!.key
      );
    });
  });

  describe("current-Result independence", () => {
    it("HOLDS and DOES_NOT_HOLD current Results yield same Policy identity", () => {
      const holdsSet = build148Pipeline({
        stateValues: [POSITIVE, POSITIVE],
      });
      const doesNotHoldSet = build148Pipeline({
        stateValues: [NEGATIVE, NEGATIVE],
      });
      assert.equal(
        r1Interp(
          build149(holdsSet, {
            requirement_policies: [],
          })
        ).binding_evidence_composition_result_assessment
          .composition_condition ??
          r1Interp(build149(holdsSet)).binding_evidence_composition_result_assessment
            .composition_condition,
        COND_HOLDS
      );
      // ensure conditions differ
      assert.equal(
        r1Interp(build149(holdsSet)).binding_evidence_composition_result_assessment
          .composition_condition,
        COND_HOLDS
      );
      assert.equal(
        r1Interp(build149(doesNotHoldSet))
          .binding_evidence_composition_result_assessment.composition_condition,
        COND_DOES_NOT_HOLD
      );

      const keyHolds = compositionPolicyKeyFrom148(holdsSet);
      const keyDoesNot = compositionPolicyKeyFrom148(doesNotHoldSet);
      assert.equal(keyHolds, keyDoesNot);

      const spec = {
        requirement_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key: keyHolds,
            mappings: [
              {
                composition_condition: COND_HOLDS,
                interpretation: INTERP_POSITIVE,
              },
              {
                composition_condition: COND_DOES_NOT_HOLD,
                interpretation: INTERP_NEGATIVE,
              },
            ],
          },
        ],
      };
      assert.equal(
        r1Interp(build149(holdsSet, spec)).interpretation_policy!.key,
        r1Interp(build149(doesNotHoldSet, spec)).interpretation_policy!.key
      );
    });

    it("current Result absent (NO_READINESS_POLICY / READINESS_DOES_NOT_HOLD) still allows Policy", () => {
      const noReadiness = build148Pipeline({ declareReadiness: false });
      assert.equal(
        r1Interp(build149(noReadiness)).binding_evidence_composition_result_assessment
          .status,
        "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_DECLARED"
      );
      const key = compositionPolicyKeyFrom148(noReadiness);
      const withPolicy = r1Interp(
        build149(noReadiness, {
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
      assert.equal(
        withPolicy.status,
        "EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_PRESENT"
      );

      const readinessFails = build148Pipeline({
        stateValues: [POSITIVE, UNRESOLVED_POLICY],
      });
      assert.equal(
        r1Interp(build149(readinessFails))
          .binding_evidence_composition_result_assessment.status,
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
      );
      const key2 = compositionPolicyKeyFrom148(readinessFails);
      assert.equal(
        r1Interp(
          build149(readinessFails, {
            requirement_policies: [
              {
                resource_readiness_binding_evidence_composition_policy_key: key2,
                mappings: [],
              },
            ],
          })
        ).status,
        "EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_PRESENT"
      );
    });
  });

  describe("identity / targeting", () => {
    it("composition-policy / mapping-set changes alter Policy identity; readiness_policy_key excluded", () => {
      const members2 = bindingKeysForRequirement(R1.key).slice(0, 2);
      const members3 = bindingKeysForRequirement(R1.key).slice(0, 3);
      const anySet = build148Pipeline({ r1Members: members2 });
      const allSet = build148Pipeline({
        includeR1Any: false,
        includeR1All: true,
        r1Members: members2,
      });
      const threeSet = build148Pipeline({ r1Members: members3 });

      const anyKey = compositionPolicyKeyFrom148(anySet);
      const allKey = compositionPolicyKeyFrom148(allSet);
      const threeKey = compositionPolicyKeyFrom148(threeSet);
      assert.notEqual(anyKey, allKey);
      assert.notEqual(anyKey, threeKey);

      const mappingsPartial = [
        { composition_condition: COND_HOLDS, interpretation: INTERP_POSITIVE },
      ];
      const mappingsFull = [
        { composition_condition: COND_HOLDS, interpretation: INTERP_POSITIVE },
        {
          composition_condition: COND_DOES_NOT_HOLD,
          interpretation: INTERP_NEGATIVE,
        },
      ];

      const policyAnyPartial = r1Interp(
        build149(anySet, {
          requirement_policies: [
            {
              resource_readiness_binding_evidence_composition_policy_key: anyKey,
              mappings: mappingsPartial,
            },
          ],
        })
      ).interpretation_policy!;
      const policyAnyFull = r1Interp(
        build149(anySet, {
          requirement_policies: [
            {
              resource_readiness_binding_evidence_composition_policy_key: anyKey,
              mappings: mappingsFull,
            },
          ],
        })
      ).interpretation_policy!;
      const policyAll = r1Interp(
        build149(allSet, {
          requirement_policies: [
            {
              resource_readiness_binding_evidence_composition_policy_key: allKey,
              mappings: mappingsPartial,
            },
          ],
        })
      ).interpretation_policy!;

      assert.notEqual(policyAnyPartial.key, policyAnyFull.key);
      assert.notEqual(policyAnyPartial.key, policyAll.key);
      assert.ok(!/readiness-policy\|/.test(policyAnyPartial.key));
      assert.ok(
        !policyAnyPartial.key.includes(
          "composition-readiness-basis"
        )
      );

      assert.equal(
        policyAnyPartial.key,
        attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicyKey(
          {
            candidate_key: policyAnyPartial.candidate_key,
            observation_need_key: policyAnyPartial.observation_need_key,
            capability_requirement_set_key:
              policyAnyPartial.capability_requirement_set_key,
            observation_resource_requirement_key:
              policyAnyPartial.observation_resource_requirement_key,
            resource_readiness_binding_evidence_composition_policy_key:
              policyAnyPartial.resource_readiness_binding_evidence_composition_policy_key,
            mappings: policyAnyPartial.mappings,
          }
        )
      );
    });

    it("unknown / stale / no-composition-policy targets reject", () => {
      const resultSet = build148Pipeline();
      assert.throws(
        () =>
          build149(resultSet, {
            requirement_policies: [
              {
                resource_readiness_binding_evidence_composition_policy_key:
                  "missing-policy-key",
                mappings: [],
              },
            ],
          }),
        /Unknown or stale/
      );

      const noComposition = build148Pipeline({
        includeR1Any: false,
        includeR1All: false,
        declareReadiness: false,
        r1Members: [],
        stateValues: [],
      });
      assert.throws(
        () =>
          normalizeAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicySpecification(
            noComposition,
            {
              requirement_policies: [
                {
                  resource_readiness_binding_evidence_composition_policy_key:
                    R1.key,
                  mappings: [],
                },
              ],
            }
          ),
        /Unknown or stale/
      );
    });

    it("duplicate identical policy normalizes; competing mapping sets reject", () => {
      const resultSet = build148Pipeline();
      const key = compositionPolicyKeyFrom148(resultSet);
      const normalized =
        normalizeAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultInterpretationPolicySpecification(
          resultSet,
          {
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
          }
        );
      assert.equal(normalized.requirement_policies.length, 1);

      assert.throws(
        () =>
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
          }),
        /Conflicting/
      );
    });
  });

  describe("immutability / determinism", () => {
    it("input immutability / deep-clone / determinism", () => {
      const resultSet = build148Pipeline();
      const key = compositionPolicyKeyFrom148(resultSet);
      const specification = {
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
      };
      const beforeResult = deepClone(resultSet);
      const beforeSpec = deepClone(specification);
      const a = build149(resultSet, specification);
      assert.deepEqual(resultSet, beforeResult);
      assert.deepEqual(specification, beforeSpec);
      assert.deepEqual(
        a.specification,
        build149(deepClone(resultSet), deepClone(specification)).specification
      );
      assert.deepEqual(
        build149(resultSet, specification),
        build149(resultSet, specification)
      );
    });
  });

  describe("static proofs", () => {
    it("GROUND-148 only; no default polarity / Basis / READY / older layers", () => {
      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-interpretation-policy-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-interpretation-policy-types.ts"
      );
      const core = readFileSync(corePath, "utf8");
      const types = readFileSync(typesPath, "utf8");
      const src = `${core}\n${types}`;

      assert.ok(/binding-evidence-composition-result-types/.test(core));
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
      assert.ok(!/ProjectState/.test(core));
      assert.ok(!/"RESOURCE_READY"/.test(src));
      assert.ok(!/"RESOURCE_NOT_READY"/.test(src));
      assert.ok(!/"INTERPRET_AS_RESOURCE_READY"/.test(src));
      assert.ok(!/"INTERPRET_AS_SATISFIED"/.test(src));
      assert.ok(!/"NO_MAPPING_FOR_CURRENT_RESULT"/.test(src));
      assert.ok(
        !/composition_condition\s*===\s*"RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_HOLDS"/.test(
          core
        )
      );
      assert.ok(
        !/composition_result\s*===\s*null/.test(core)
      );
      assert.ok(
        /CURRENT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_NOT_INTERPRETED/.test(
          types
        )
      );
      assert.ok(
        /RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_BASIS_NOT_MODELED/.test(
          types
        )
      );
      assert.ok(
        /TRUE_PER_REQUIREMENT_RESOURCE_READINESS_NOT_MODELED/.test(types)
      );
      assert.ok(!/from "\.\/resource-reservation/.test(core));
      assert.ok(!/from "\.\/feasibility/.test(core));
    });
  });
});
