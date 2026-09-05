/**
 * GROUND-148 — Observation Core CII / RESOURCE_READINESS
 * Binding Evidence Composition Result Foundation
 *
 * GROUND-147 sole authority → neutral ANY/ALL Composition Result.
 * readiness DOES_NOT_HOLD → no Result (≠ logical DOES_NOT_HOLD).
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
import type {
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasis,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisSetAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionMemberReadinessAssessment,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-readiness-basis-types.js";
import {
  buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-readiness-policy-core.js";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_MODEL_LIMITATIONS,
  attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultKey,
  buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultSet,
  deriveAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionCondition,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-core.js";
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
const UNRESOLVED_MAPPING =
  "UNRESOLVED_NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE" as const;

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
  const set = build133();
  return set.candidate_assessments[0]!.requirement_binding_assessments
    .find((a) => a.observation_resource_requirement_key === requirementKey)!
    .bindings.map((b) => b.key);
}

function bindingDeclarationId(bindingKey: string): string {
  const set = build133();
  for (const requirement of set.candidate_assessments[0]!
    .requirement_binding_assessments) {
    const binding = requirement.bindings.find((b) => b.key === bindingKey);
    if (binding) return binding.resource_declaration_id;
  }
  throw new Error(`binding not found: ${bindingKey}`);
}

function build145(options?: {
  includeR1Any?: boolean;
  includeR1All?: boolean;
  includeR2Any?: boolean;
  r1Members?: string[];
}): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySetAssessment {
  const bindingSet = build133();
  const r1Members =
    options?.r1Members ?? bindingKeysForRequirement(R1.key).slice(0, 2);
  const r2Members = bindingKeysForRequirement(R2.key);
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
  if (options?.includeR2Any) {
    requirement_policies.push({
      observation_resource_requirement_key: R2.key,
      member_binding_keys: r2Members,
      composition_kind:
        "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS" as const,
    });
  }

  return buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySet(
    {
      resource_readiness_observation_context_binding_set: bindingSet,
      specification: { requirement_policies },
    }
  );
}

function compositionPolicyKeyForRequirement(
  compositionSet: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySetAssessment,
  requirementKey: string
): string {
  const assessment =
    compositionSet.candidate_assessments[0]!.requirement_policy_assessments.find(
      (a) => a.observation_resource_requirement_key === requirementKey
    )!;
  assert.ok(assessment.policy);
  return assessment.policy!.key;
}

function build146(
  compositionSet: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySetAssessment,
  declareForRequirements: string[] = [R1.key]
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySet(
    {
      resource_readiness_binding_evidence_composition_policy_set: compositionSet,
      specification: {
        composition_readiness_policies: declareForRequirements.map(
          (requirementKey) => ({
            resource_readiness_binding_evidence_composition_policy_key:
              compositionPolicyKeyForRequirement(compositionSet, requirementKey),
            readiness_kind: READINESS_KIND,
          })
        ),
      },
    }
  );
}

function mockCanonicalState(
  bindingKey: string,
  state: AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateValue,
  requirementKey: string = R1.key
): AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceState {
  return {
    key: `canonical-state|${bindingKey}|${state}`,
    basis_key: `canonical-basis|${bindingKey}|${state}`,
    candidate_key: CAND,
    observation_need_key: NEED_KEY,
    capability_requirement_set_key: CAP_SET_KEY,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key: requirementKey,
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
            canonical_state.state === UNRESOLVED_POLICY ||
            canonical_state.state === UNRESOLVED_MAPPING,
        })),
        has_canonical_per_binding_resource_readiness_evidence_states:
          states.length > 0,
        has_resolved_canonical_per_binding_resource_readiness_evidence_states:
          states.some((s) => s.state === POSITIVE || s.state === NEGATIVE),
        has_unresolved_canonical_per_binding_resource_readiness_evidence_states:
          states.some(
            (s) =>
              s.state === UNRESOLVED_POLICY || s.state === UNRESOLVED_MAPPING
          ),
        model_limitations: [],
      },
    ],
    has_canonical_per_binding_resource_readiness_evidence_states:
      states.length > 0,
    has_resolved_canonical_per_binding_resource_readiness_evidence_states:
      states.some((s) => s.state === POSITIVE || s.state === NEGATIVE),
    has_unresolved_canonical_per_binding_resource_readiness_evidence_states:
      states.some(
        (s) => s.state === UNRESOLVED_POLICY || s.state === UNRESOLVED_MAPPING
      ),
    model_limitations: [],
  };
}

function build147(
  compositionOptions: Parameters<typeof build145>[0] = {},
  stateValues: AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateValue[],
  declareReadiness: boolean = true
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisSetAssessment {
  const members =
    compositionOptions?.r1Members ??
    bindingKeysForRequirement(R1.key).slice(0, stateValues.length || 2);
  const compositionSet = build145({
    ...compositionOptions,
    r1Members: members,
  });
  const readinessSet = build146(
    compositionSet,
    declareReadiness ? [R1.key] : []
  );
  const states = members.map((key, index) =>
    mockCanonicalState(key, stateValues[index] ?? POSITIVE)
  );
  return buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisSet(
    {
      canonical_per_binding_resource_readiness_evidence_state_set:
        mock141Set(states),
      resource_readiness_binding_evidence_composition_readiness_policy_set:
        readinessSet,
    }
  );
}

function build148(
  readinessBasisSet: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisSetAssessment
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultSet(
    {
      resource_readiness_binding_evidence_composition_readiness_basis_set:
        readinessBasisSet,
    }
  );
}

function r1Result(
  set: ReturnType<typeof build148>
) {
  return set.candidate_assessments[0]!.requirement_composition_result_assessments.find(
    (a) => a.observation_resource_requirement_key === R1.key
  )!;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function corruptHoldsBasis(
  readinessBasisSet: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisSetAssessment,
  mutate: (
    basis: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasis
  ) => void
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisSetAssessment {
  const cloned = deepClone(readinessBasisSet);
  const requirement =
    cloned.candidate_assessments[0]!.requirement_readiness_basis_assessments.find(
      (a) => a.observation_resource_requirement_key === R1.key
    )!;
  assert.ok(requirement.readiness_basis);
  assert.equal(
    requirement.status,
    "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS"
  );
  mutate(requirement.readiness_basis!);
  return cloned;
}

describe("GROUND-148 RESOURCE_READINESS Binding Evidence Composition Result", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.24");
  });

  it("model limitations fixed order", () => {
    assert.deepEqual(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_MODEL_LIMITATIONS,
      [
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_NOT_MODELED",
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

  describe("gate / absence", () => {
    it("NOT_APPLICABLE → no Result", () => {
      const readiness = build147(
        { includeR1Any: false, includeR1All: false },
        [],
        false
      );
      const set = build148(readiness);
      const r3 = set.candidate_assessments[0]!.requirement_composition_result_assessments.find(
        (a) => a.observation_resource_requirement_key === R3.key
      )!;
      assert.equal(
        r3.status,
        "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY"
      );
      assert.equal(r3.composition_result, null);
      assert.equal(r3.composition_condition, null);
      assert.equal(
        r3.has_resource_readiness_binding_evidence_composition_result,
        false
      );
    });

    it("NO_READINESS_POLICY → no Result", () => {
      const readiness = build147({}, [POSITIVE, POSITIVE], false);
      const set = build148(readiness);
      const r1 = r1Result(set);
      assert.equal(
        r1.status,
        "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_DECLARED"
      );
      assert.equal(r1.composition_result, null);
      assert.equal(r1.composition_condition, null);
      assert.equal(
        r1.has_resource_readiness_binding_evidence_composition_result,
        false
      );
    });

    it("readiness DOES_NOT_HOLD → no Result (≠ logical DOES_NOT_HOLD)", () => {
      const readiness = build147({}, [POSITIVE, UNRESOLVED_POLICY]);
      const set = build148(readiness);
      const r1 = r1Result(set);
      assert.equal(
        r1.status,
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(r1.composition_result, null);
      assert.equal(r1.composition_condition, null);
      assert.equal(
        r1.has_resource_readiness_binding_evidence_composition_result,
        false
      );
    });
  });

  describe("ANY evaluation", () => {
    it("ANY(POSITIVE) → HOLDS", () => {
      const set = build148(build147({ r1Members: bindingKeysForRequirement(R1.key).slice(0, 1) }, [POSITIVE]));
      assert.equal(
        r1Result(set).composition_condition,
        "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_HOLDS"
      );
    });

    it("ANY(NEGATIVE) → DOES_NOT_HOLD with Result present", () => {
      const set = build148(build147({ r1Members: bindingKeysForRequirement(R1.key).slice(0, 1) }, [NEGATIVE]));
      const r1 = r1Result(set);
      assert.equal(
        r1.status,
        "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_RESULT_PRESENT"
      );
      assert.equal(
        r1.composition_condition,
        "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD"
      );
      assert.ok(r1.composition_result);
      assert.equal(
        r1.has_resource_readiness_binding_evidence_composition_result,
        true
      );
    });

    it("ANY(POSITIVE, NEGATIVE) / ANY(POSITIVE, POSITIVE) → HOLDS; ANY(NEGATIVE, NEGATIVE) → DOES_NOT_HOLD", () => {
      assert.equal(
        r1Result(build148(build147({}, [POSITIVE, NEGATIVE])))
          .composition_condition,
        "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_HOLDS"
      );
      assert.equal(
        r1Result(build148(build147({}, [POSITIVE, POSITIVE])))
          .composition_condition,
        "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_HOLDS"
      );
      assert.equal(
        r1Result(build148(build147({}, [NEGATIVE, NEGATIVE])))
          .composition_condition,
        "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD"
      );
    });
  });

  describe("ALL evaluation", () => {
    it("ALL truth table", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 2);
      const allOpts = {
        includeR1Any: false,
        includeR1All: true,
        r1Members: members,
      } as const;

      assert.equal(
        r1Result(build148(build147({ ...allOpts, r1Members: members.slice(0, 1) }, [POSITIVE])))
          .composition_condition,
        "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_HOLDS"
      );
      assert.equal(
        r1Result(build148(build147({ ...allOpts, r1Members: members.slice(0, 1) }, [NEGATIVE])))
          .composition_condition,
        "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(
        r1Result(build148(build147(allOpts, [POSITIVE, POSITIVE])))
          .composition_condition,
        "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_HOLDS"
      );
      assert.equal(
        r1Result(build148(build147(allOpts, [POSITIVE, NEGATIVE])))
          .composition_condition,
        "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(
        r1Result(build148(build147(allOpts, [NEGATIVE, NEGATIVE])))
          .composition_condition,
        "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD"
      );
    });
  });

  describe("identity / lineage", () => {
    it("single-member ANY vs ALL: same truth, distinct Result identity", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 1);
      const anyResult = r1Result(
        build148(build147({ r1Members: members }, [POSITIVE]))
      );
      const allResult = r1Result(
        build148(
          build147(
            { includeR1Any: false, includeR1All: true, r1Members: members },
            [POSITIVE]
          )
        )
      );
      assert.equal(
        anyResult.composition_condition,
        allResult.composition_condition
      );
      assert.notEqual(
        anyResult.composition_result!.key,
        allResult.composition_result!.key
      );
      assert.notEqual(
        anyResult.composition_result!.composition_kind,
        allResult.composition_result!.composition_kind
      );
    });

    it("same HOLDS / different member lineage → distinct Result keys", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 2);
      const a = r1Result(build148(build147({ r1Members: members }, [POSITIVE, NEGATIVE])));
      const b = r1Result(build148(build147({ r1Members: members }, [NEGATIVE, POSITIVE])));
      assert.equal(
        a.composition_condition,
        "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_HOLDS"
      );
      assert.equal(
        b.composition_condition,
        "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_HOLDS"
      );
      assert.notEqual(a.composition_result!.key, b.composition_result!.key);
    });

    it("same DOES_NOT_HOLD / different member lineage → distinct Result keys", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 2);
      const allOpts = {
        includeR1Any: false,
        includeR1All: true,
        r1Members: members,
      } as const;
      const a = r1Result(build148(build147(allOpts, [NEGATIVE, POSITIVE])));
      const b = r1Result(build148(build147(allOpts, [POSITIVE, NEGATIVE])));
      assert.equal(
        a.composition_condition,
        "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(
        b.composition_condition,
        "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD"
      );
      assert.notEqual(a.composition_result!.key, b.composition_result!.key);
    });

    it("exact member lineage preserved; Result key helper matches", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 2);
      const r1 = r1Result(build148(build147({ r1Members: members }, [POSITIVE, NEGATIVE])));
      const result = r1.composition_result!;
      assert.deepEqual(result.member_binding_keys, members);
      assert.equal(result.member_evidence_state_keys.length, 2);
      assert.deepEqual(result.member_evidence_state_values, [
        POSITIVE,
        NEGATIVE,
      ]);
      assert.equal(
        result.key,
        attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionResultKey(
          {
            candidate_key: result.candidate_key,
            observation_need_key: result.observation_need_key,
            capability_requirement_set_key:
              result.capability_requirement_set_key,
            observation_resource_requirement_key:
              result.observation_resource_requirement_key,
            resource_readiness_binding_evidence_composition_policy_key:
              result.resource_readiness_binding_evidence_composition_policy_key,
            resource_readiness_binding_evidence_composition_readiness_policy_key:
              result.resource_readiness_binding_evidence_composition_readiness_policy_key,
            resource_readiness_binding_evidence_composition_readiness_basis_key:
              result.resource_readiness_binding_evidence_composition_readiness_basis_key,
            member_binding_keys: result.member_binding_keys,
            member_evidence_state_keys: result.member_evidence_state_keys,
            member_evidence_state_values: result.member_evidence_state_values,
            composition_kind: result.composition_kind,
            composition_condition: result.composition_condition,
          }
        )
      );
    });

    it("Candidate summary booleans may coexist across Requirements", () => {
      const r1Members = bindingKeysForRequirement(R1.key).slice(0, 2);
      const r2Members = bindingKeysForRequirement(R2.key);
      const compositionSet = build145({
        r1Members,
        includeR2Any: true,
      });
      const readinessSet = build146(compositionSet, [R1.key, R2.key]);
      const readinessBasis =
        buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisSet(
          {
            canonical_per_binding_resource_readiness_evidence_state_set:
              mock141Set([
                ...r1Members.map((k) => mockCanonicalState(k, NEGATIVE)),
                ...r2Members.map((k) =>
                  mockCanonicalState(k, POSITIVE, R2.key)
                ),
              ]),
            resource_readiness_binding_evidence_composition_readiness_policy_set:
              readinessSet,
          }
        );
      const set = build148(readinessBasis);
      const candidate = set.candidate_assessments[0]!;
      assert.equal(
        candidate.has_resource_readiness_binding_evidence_composition_conditions_holding,
        true
      );
      assert.equal(
        candidate.has_resource_readiness_binding_evidence_composition_conditions_not_holding,
        true
      );
    });
  });

  describe("malformed HOLDS Basis", () => {
    it("rejects unresolved / missing / not PRESENT_RESOLVED / is_resolved=false / null lineage / empty members / duplicate", () => {
      const base = build147({}, [POSITIVE, NEGATIVE]);

      assert.throws(
        () =>
          build148(
            corruptHoldsBasis(base, (basis) => {
              const member = basis.member_readiness_assessments[0]!;
              member.status =
                "SELECTED_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_PRESENT_UNRESOLVED_NO_EXPLICIT_INTERPRETATION_POLICY";
              member.canonical_binding_evidence_state_value = UNRESOLVED_POLICY;
              member.is_resolved_for_composition_readiness = true;
            })
          ),
        /not PRESENT_RESOLVED|unresolved/
      );

      assert.throws(
        () =>
          build148(
            corruptHoldsBasis(base, (basis) => {
              const member = basis.member_readiness_assessments[0]!;
              member.status =
                "SELECTED_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_MISSING";
              member.canonical_binding_evidence_state = null;
              member.canonical_binding_evidence_state_key = null;
              member.canonical_binding_evidence_state_value = null;
              member.has_current_canonical_binding_evidence_state = false;
              member.is_resolved_for_composition_readiness = true;
            })
          ),
        /PRESENT_RESOLVED|missing/
      );

      assert.throws(
        () =>
          build148(
            corruptHoldsBasis(base, (basis) => {
              basis.member_readiness_assessments[0]!.is_resolved_for_composition_readiness =
                false;
            })
          ),
        /is_resolved=false/
      );

      assert.throws(
        () =>
          build148(
            corruptHoldsBasis(base, (basis) => {
              basis.member_readiness_assessments[0]!.canonical_binding_evidence_state_key =
                null;
            })
          ),
        /missing current State/
      );

      assert.throws(
        () =>
          build148(
            corruptHoldsBasis(base, (basis) => {
              basis.member_binding_keys = [];
              basis.member_readiness_assessments = [];
            })
          ),
        /empty member/
      );

      assert.throws(
        () =>
          build148(
            corruptHoldsBasis(base, (basis) => {
              const first = basis.member_readiness_assessments[0]!;
              const duplicate: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionMemberReadinessAssessment =
                deepClone(first);
              basis.member_binding_keys = [
                first.resource_readiness_observation_context_binding_key,
                first.resource_readiness_observation_context_binding_key,
              ];
              basis.member_readiness_assessments = [first, duplicate];
            })
          ),
        /duplicate member/
      );
    });

    it("derive helper rejects empty / unresolved; ANY/ALL use POSITIVE only", () => {
      assert.throws(
        () =>
          deriveAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionCondition(
            "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
            []
          ),
        /empty selected member/
      );
      assert.throws(
        () =>
          deriveAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionCondition(
            "ALL_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITIONS_HOLD",
            [UNRESOLVED_MAPPING]
          ),
        /non-resolved/
      );
      assert.equal(
        deriveAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionCondition(
          "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
          [NEGATIVE, POSITIVE]
        ),
        "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_HOLDS"
      );
      assert.equal(
        deriveAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionCondition(
          "ALL_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITIONS_HOLD",
          [POSITIVE, NEGATIVE]
        ),
        "RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD"
      );
    });
  });

  describe("immutability / determinism", () => {
    it("input immutability / deep-clone / determinism", () => {
      const readiness = build147({}, [POSITIVE, NEGATIVE]);
      const before = deepClone(readiness);
      const a = build148(readiness);
      assert.deepEqual(readiness, before);
      const b = build148(deepClone(readiness));
      assert.deepEqual(
        a.candidate_assessments.map((c) =>
          c.requirement_composition_result_assessments.map((r) => ({
            status: r.status,
            composition_condition: r.composition_condition,
            composition_result: r.composition_result,
          }))
        ),
        b.candidate_assessments.map((c) =>
          c.requirement_composition_result_assessments.map((r) => ({
            status: r.status,
            composition_condition: r.composition_condition,
            composition_result: r.composition_result,
          }))
        )
      );
      assert.deepEqual(build148(readiness), build148(readiness));
    });
  });

  describe("static proofs", () => {
    it("GROUND-147 only; no older layers / READY / Interpretation / physical roles", () => {
      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-result-types.ts"
      );
      const core = readFileSync(corePath, "utf8");
      const types = readFileSync(typesPath, "utf8");
      const src = `${core}\n${types}`;

      assert.ok(
        /binding-evidence-composition-readiness-basis-types/.test(core)
      );
      assert.ok(
        !/binding-evidence-composition-readiness-policy-core/.test(core)
      );
      assert.ok(
        !/binding-evidence-composition-policy-core/.test(core)
      );
      assert.ok(
        !/canonical-per-binding-resource-readiness-evidence-state-core/.test(
          core
        )
      );
      assert.ok(!/interpretation-basis-core/.test(core));
      assert.ok(!/evidence-evaluation-state-core/.test(core));
      assert.ok(!/raw-evidence-assessment/.test(core));
      assert.ok(!/evaluation-instant/.test(core));
      assert.ok(
        !/resource-readiness-observation-context-binding-core/.test(core)
      );
      assert.ok(!/ProjectState/.test(core));
      assert.ok(
        !/isResolvedAttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceState/.test(
          core
        )
      );
      assert.ok(!/"RESOURCE_READY"/.test(src));
      assert.ok(!/"RESOURCE_NOT_READY"/.test(src));
      assert.ok(!/"ALTERNATIVE"/.test(src));
      assert.ok(!/"CUMULATIVE"/.test(src));
      assert.ok(!/"FOUND"/.test(src));
      assert.ok(!/"AVAILABLE"/.test(src));
      assert.ok(!/"MATCH"/.test(src) || /model_limitations/.test(types));
      assert.ok(!/from "\.\/resource-reservation/.test(core));
      assert.ok(!/from "\.\/resource-commitment/.test(core));
      assert.ok(!/from "\.\/feasibility/.test(core));
      assert.ok(!/from "\.\/attention-observation-permission/.test(core));
      assert.ok(
        /RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_NOT_MODELED/.test(
          types
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
    });
  });
});
