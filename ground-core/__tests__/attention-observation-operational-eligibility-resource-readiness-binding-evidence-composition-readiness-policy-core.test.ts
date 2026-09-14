/**
 * GROUND-146 — Observation Core C / Explicit RESOURCE_READINESS
 * Binding Evidence Composition Readiness Policy Foundation
 *
 * Declaration only over GROUND-145 Composition Policy Set + explicit readiness
 * specification. No GROUND-141 State consumption. No readiness evaluation.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-policy-core.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySetAssessment,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-policy-types.js";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_MODEL_LIMITATIONS,
  attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyKey,
  buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySet,
  CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_KIND_ORDER,
  FUTURE_RESOURCE_READINESS_BINDING_EVIDENCE_RESOLVED_STATES,
  FUTURE_RESOURCE_READINESS_BINDING_EVIDENCE_UNRESOLVED_STATES,
  normalizeAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySpecification,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-readiness-policy-core.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySpecification,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-readiness-policy-types.js";
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
  const base: AttentionCandidateObservationResourceRequirementSetAssessment = {
    candidate_key: overrides.candidate_key,
    capability_requirement_assessment: {} as never,
    status: "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT",
    resource_requirements: [R1, R2, R3],
    has_explicit_observation_resource_requirement_set: true,
    has_observation_resource_requirements: true,
    model_limitations: [],
  };
  return { ...base, ...overrides };
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

function bindingKeysForRequirement(
  requirementKey: string
): string[] {
  const set = build133();
  const requirement = set.candidate_assessments[0]!.requirement_binding_assessments.find(
    (a) => a.observation_resource_requirement_key === requirementKey
  )!;
  return requirement.bindings.map((b) => b.key);
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
  compositionSet: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySetAssessment = build145(),
  specification: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySpecification = {
    composition_readiness_policies: [],
  }
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySet(
    {
      resource_readiness_binding_evidence_composition_policy_set: compositionSet,
      specification,
    }
  );
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-146 RESOURCE_READINESS Binding Evidence Composition Readiness Policy", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.25");
  });

  it("model limitations and readiness vocabulary fixed order", () => {
    assert.deepEqual(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_MODEL_LIMITATIONS,
      [
        "CURRENT_CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_STATES_NOT_CONSUMED",
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_BASIS_NOT_MODELED",
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_NOT_MODELED",
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_NOT_MODELED",
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_BASIS_NOT_MODELED",
        "PER_REQUIREMENT_CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_NOT_MODELED",
        "MULTIPLE_BINDING_COMPOSITION_GROUPS_PER_REQUIREMENT_NOT_MODELED",
        "NESTED_BOOLEAN_BINDING_COMPOSITION_NOT_MODELED",
        "BOOLEAN_SHORT_CIRCUIT_COMPOSITION_READINESS_NOT_MODELED",
        "PHYSICAL_RESOURCE_BINDING_ROLE_NOT_MODELED",
        "OBSERVATION_RESOURCE_QUANTITY_RELATION_NOT_MODELED",
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
    assert.deepEqual(
      CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_KIND_ORDER,
      [READINESS_KIND]
    );
    assert.deepEqual(FUTURE_RESOURCE_READINESS_BINDING_EVIDENCE_RESOLVED_STATES, [
      "EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_POSITIVE",
      "EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_NEGATIVE",
    ]);
    assert.deepEqual(
      FUTURE_RESOURCE_READINESS_BINDING_EVIDENCE_UNRESOLVED_STATES,
      [
        "UNRESOLVED_NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_POLICY",
        "UNRESOLVED_NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE",
      ]
    );
  });

  describe("status semantics", () => {
    it("GROUND-145 NO_POLICY → NOT_APPLICABLE", () => {
      const compositionSet = build145({
        includeR1Any: false,
        includeR1All: false,
        includeR2Any: false,
      });
      const set = build146(compositionSet);
      const r3 = set.candidate_assessments[0]!.requirement_readiness_policy_assessments.find(
        (a) => a.observation_resource_requirement_key === R3.key
      )!;
      assert.equal(
        r3.status,
        "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY"
      );
      assert.equal(r3.readiness_policy, null);
      assert.equal(
        r3.has_explicit_resource_readiness_binding_evidence_composition_readiness_policy,
        false
      );
    });

    it("GROUND-145 Policy present / no GROUND-146 declaration → NO_READINESS_POLICY", () => {
      const compositionSet = build145();
      const set = build146(compositionSet);
      const r1 = set.candidate_assessments[0]!.requirement_readiness_policy_assessments.find(
        (a) => a.observation_resource_requirement_key === R1.key
      )!;
      assert.equal(
        r1.status,
        "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_DECLARED"
      );
      assert.equal(r1.readiness_policy, null);
      assert.equal(
        r1.has_explicit_resource_readiness_binding_evidence_composition_readiness_policy,
        false
      );
    });

    it("GROUND-145 Policy present / explicit readiness → POLICY_PRESENT", () => {
      const compositionSet = build145();
      const compositionPolicyKey = compositionPolicyKeyForRequirement(
        compositionSet,
        R1.key
      );
      const set = build146(compositionSet, {
        composition_readiness_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key:
              compositionPolicyKey,
            readiness_kind: READINESS_KIND,
          },
        ],
      });
      const r1 = set.candidate_assessments[0]!.requirement_readiness_policy_assessments.find(
        (a) => a.observation_resource_requirement_key === R1.key
      )!;
      assert.equal(
        r1.status,
        "EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_PRESENT"
      );
      assert.ok(r1.readiness_policy);
      assert.equal(
        r1.has_explicit_resource_readiness_binding_evidence_composition_readiness_policy,
        true
      );
      assert.equal(
        r1.readiness_policy!.resource_readiness_binding_evidence_composition_policy_key,
        compositionPolicyKey
      );
      assert.equal(r1.readiness_policy!.readiness_kind, READINESS_KIND);
      assert.equal(
        r1.readiness_policy!.composition_kind,
        "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS"
      );
      assert.deepEqual(
        r1.readiness_policy!.member_binding_keys,
        compositionSet.candidate_assessments[0]!.requirement_policy_assessments.find(
          (a) => a.observation_resource_requirement_key === R1.key
        )!.policy!.member_binding_keys
      );
    });

    it("NOT_APPLICABLE != NO_READINESS_POLICY", () => {
      const compositionSet = build145({ includeR2Any: true });
      const compositionPolicyKey = compositionPolicyKeyForRequirement(
        compositionSet,
        R2.key
      );
      const set = build146(compositionSet, {
        composition_readiness_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key:
              compositionPolicyKey,
            readiness_kind: READINESS_KIND,
          },
        ],
      });
      const assessments =
        set.candidate_assessments[0]!.requirement_readiness_policy_assessments;
      const r1 = assessments.find(
        (a) => a.observation_resource_requirement_key === R1.key
      )!;
      const r2 = assessments.find(
        (a) => a.observation_resource_requirement_key === R2.key
      )!;
      const r3 = assessments.find(
        (a) => a.observation_resource_requirement_key === R3.key
      )!;
      assert.equal(
        r1.status,
        "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_DECLARED"
      );
      assert.equal(
        r2.status,
        "EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_PRESENT"
      );
      assert.equal(
        r3.status,
        "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY"
      );
      assert.notEqual(r1.status, r3.status);
    });
  });

  describe("target validation", () => {
    it("unknown composition-policy key rejects", () => {
      const compositionSet = build145();
      assert.throws(
        () =>
          build146(compositionSet, {
            composition_readiness_policies: [
              {
                resource_readiness_binding_evidence_composition_policy_key:
                  "missing-composition-policy-key",
                readiness_kind: READINESS_KIND,
              },
            ],
          }),
        /Unknown or stale/
      );
    });

    it("targeting GROUND-145 NO_POLICY rejects", () => {
      const compositionSet = build145();
      assert.throws(
        () =>
          build146(compositionSet, {
            composition_readiness_policies: [
              {
                resource_readiness_binding_evidence_composition_policy_key: R3.key,
                readiness_kind: READINESS_KIND,
              },
            ],
          }),
        /Unknown or stale/
      );
    });

    it("stale composition-policy key rejects", () => {
      const compositionSet = build145();
      const staleKey =
        "attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-policy|cand|need|cap-set-key|RESOURCE_READINESS|req-r1|missing|ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS";
      assert.throws(
        () =>
          build146(compositionSet, {
            composition_readiness_policies: [
              {
                resource_readiness_binding_evidence_composition_policy_key:
                  staleKey,
                readiness_kind: READINESS_KIND,
              },
            ],
          }),
        /Unknown or stale/
      );
    });

    it("duplicate identical readiness declaration normalizes", () => {
      const compositionSet = build145();
      const compositionPolicyKey = compositionPolicyKeyForRequirement(
        compositionSet,
        R1.key
      );
      const normalized =
        normalizeAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySpecification(
          compositionSet,
          {
            composition_readiness_policies: [
              {
                resource_readiness_binding_evidence_composition_policy_key:
                  compositionPolicyKey,
                readiness_kind: READINESS_KIND,
              },
              {
                resource_readiness_binding_evidence_composition_policy_key:
                  compositionPolicyKey,
                readiness_kind: READINESS_KIND,
              },
            ],
          }
        );
      assert.equal(normalized.composition_readiness_policies.length, 1);
    });

    it("specification order invariance", () => {
      const compositionSet = build145({ includeR2Any: true });
      const r1Key = compositionPolicyKeyForRequirement(compositionSet, R1.key);
      const r2Key = compositionPolicyKeyForRequirement(compositionSet, R2.key);
      const a = build146(compositionSet, {
        composition_readiness_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key: r1Key,
            readiness_kind: READINESS_KIND,
          },
          {
            resource_readiness_binding_evidence_composition_policy_key: r2Key,
            readiness_kind: READINESS_KIND,
          },
        ],
      });
      const b = build146(compositionSet, {
        composition_readiness_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key: r2Key,
            readiness_kind: READINESS_KIND,
          },
          {
            resource_readiness_binding_evidence_composition_policy_key: r1Key,
            readiness_kind: READINESS_KIND,
          },
        ],
      });
      assert.deepEqual(
        a.specification.composition_readiness_policies,
        b.specification.composition_readiness_policies
      );
    });
  });

  describe("ANY/ALL common readiness rule", () => {
    it("ANY policy accepts sole readiness kind", () => {
      const compositionSet = build145();
      const key = compositionPolicyKeyForRequirement(compositionSet, R1.key);
      const set = build146(compositionSet, {
        composition_readiness_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key: key,
            readiness_kind: READINESS_KIND,
          },
        ],
      });
      assert.equal(
        set.candidate_assessments[0]!.requirement_readiness_policy_assessments.find(
          (a) => a.observation_resource_requirement_key === R1.key
        )!.readiness_policy!.composition_kind,
        "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS"
      );
    });

    it("ALL policy accepts same readiness kind", () => {
      const compositionSet = build145({
        includeR1Any: false,
        includeR1All: true,
      });
      const key = compositionPolicyKeyForRequirement(compositionSet, R1.key);
      const set = build146(compositionSet, {
        composition_readiness_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key: key,
            readiness_kind: READINESS_KIND,
          },
        ],
      });
      assert.equal(
        set.candidate_assessments[0]!.requirement_readiness_policy_assessments.find(
          (a) => a.observation_resource_requirement_key === R1.key
        )!.readiness_policy!.composition_kind,
        "ALL_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITIONS_HOLD"
      );
    });

    it("GROUND-145 member-set change alters readiness Policy identity", () => {
      const members = bindingKeysForRequirement(R1.key);
      const set2 = build145({ r1Members: members.slice(0, 2) });
      const set3 = build145({ r1Members: members.slice(0, 3) });
      const key2 = compositionPolicyKeyForRequirement(set2, R1.key);
      const key3 = compositionPolicyKeyForRequirement(set3, R1.key);
      assert.notEqual(key2, key3);
      const readiness2 = build146(set2, {
        composition_readiness_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key: key2,
            readiness_kind: READINESS_KIND,
          },
        ],
      });
      const readiness3 = build146(set3, {
        composition_readiness_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key: key3,
            readiness_kind: READINESS_KIND,
          },
        ],
      });
      assert.notEqual(
        readiness2.candidate_assessments[0]!.requirement_readiness_policy_assessments.find(
          (a) => a.observation_resource_requirement_key === R1.key
        )!.readiness_policy!.key,
        readiness3.candidate_assessments[0]!.requirement_readiness_policy_assessments.find(
          (a) => a.observation_resource_requirement_key === R1.key
        )!.readiness_policy!.key
      );
    });

    it("GROUND-145 ANY→ALL change alters readiness Policy identity", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 2);
      const anySet = build145({ r1Members: members });
      const allSet = build145({
        includeR1Any: false,
        includeR1All: true,
        r1Members: members,
      });
      const anyKey = compositionPolicyKeyForRequirement(anySet, R1.key);
      const allKey = compositionPolicyKeyForRequirement(allSet, R1.key);
      assert.notEqual(anyKey, allKey);
      const readinessAny = attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyKey(
        {
          candidate_key: CAND,
          observation_need_key: NEED_KEY,
          capability_requirement_set_key: CAP_SET_KEY,
          observation_resource_requirement_key: R1.key,
          resource_readiness_binding_evidence_composition_policy_key: anyKey,
          readiness_kind: READINESS_KIND,
        }
      );
      const readinessAll = attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicyKey(
        {
          candidate_key: CAND,
          observation_need_key: NEED_KEY,
          capability_requirement_set_key: CAP_SET_KEY,
          observation_resource_requirement_key: R1.key,
          resource_readiness_binding_evidence_composition_policy_key: allKey,
          readiness_kind: READINESS_KIND,
        }
      );
      assert.notEqual(readinessAny, readinessAll);
    });
  });

  describe("immutability / determinism", () => {
    it("input immutability", () => {
      const compositionSet = build145();
      const key = compositionPolicyKeyForRequirement(compositionSet, R1.key);
      const specification = {
        composition_readiness_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key: key,
            readiness_kind: READINESS_KIND,
          },
        ],
      };
      const beforeComposition = deepClone(compositionSet);
      const beforeSpec = deepClone(specification);
      build146(compositionSet, specification);
      assert.deepEqual(compositionSet, beforeComposition);
      assert.deepEqual(specification, beforeSpec);
    });

    it("deep-cloned equivalent inputs yield same output", () => {
      const compositionSet = build145();
      const key = compositionPolicyKeyForRequirement(compositionSet, R1.key);
      const specification = {
        composition_readiness_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key: key,
            readiness_kind: READINESS_KIND,
          },
        ],
      };
      const a = build146(compositionSet, specification);
      const b = build146(deepClone(compositionSet), deepClone(specification));
      assert.deepEqual(a.specification, b.specification);
      assert.deepEqual(
        a.candidate_assessments.map((c) =>
          c.requirement_readiness_policy_assessments.map((r) => ({
            status: r.status,
            readiness_policy: r.readiness_policy,
          }))
        ),
        b.candidate_assessments.map((c) =>
          c.requirement_readiness_policy_assessments.map((r) => ({
            status: r.status,
            readiness_policy: r.readiness_policy,
          }))
        )
      );
    });

    it("determinism", () => {
      const compositionSet = build145();
      const key = compositionPolicyKeyForRequirement(compositionSet, R1.key);
      const specification = {
        composition_readiness_policies: [
          {
            resource_readiness_binding_evidence_composition_policy_key: key,
            readiness_kind: READINESS_KIND,
          },
        ],
      };
      assert.deepEqual(
        build146(compositionSet, specification),
        build146(compositionSet, specification)
      );
    });
  });

  describe("static proofs / schema", () => {
    it("schema 0.1.24; GROUND-145 only; no GROUND-141 / Result / short-circuit", () => {
      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-readiness-policy-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-readiness-policy-types.ts"
      );
      const core = readFileSync(corePath, "utf8");
      const types = readFileSync(typesPath, "utf8");
      const src = `${core}\n${types}`;

      assert.ok(
        /resource-readiness-binding-evidence-composition-policy-types/.test(core)
      );
      assert.ok(!/canonical-per-binding-resource-readiness-evidence-state/.test(core));
      assert.ok(!/interpretation-basis-core/.test(core));
      assert.ok(!/interpretation-basis-types/.test(core));
      assert.ok(!/evidence-evaluation-state-interpretation-policy-core/.test(core));
      assert.ok(!/evidence-evaluation-state-core/.test(core));
      assert.ok(!/raw-evidence-assessment/.test(core));
      assert.ok(!/evaluation-instant/.test(core));
      assert.ok(
        !/resource-readiness-observation-context-binding-core/.test(core)
      );
      assert.ok(!/ProjectState/.test(core));
      assert.ok(!/"RESOURCE_READY"/.test(src));
      assert.ok(!/"RESOURCE_NOT_READY"/.test(src));
      assert.ok(!/"READINESS_CONDITION_HOLDS"/.test(src));
      assert.ok(!/"READINESS_CONDITION_DOES_NOT_HOLD"/.test(src));
      assert.ok(
        !/"RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_HOLDS"/.test(
          src
        )
      );
      assert.ok(
        !/"RESOURCE_REQUIREMENT_BINDING_EVIDENCE_COMPOSITION_CONDITION_DOES_NOT_HOLD"/.test(
          src
        )
      );
      assert.ok(!/"ALLOW_ANY_POSITIVE_SHORT_CIRCUIT"/.test(src));
      assert.ok(!/"ALLOW_ALL_NEGATIVE_SHORT_CIRCUIT"/.test(src));
      assert.ok(!/"ALTERNATIVE"/.test(src));
      assert.ok(!/"CUMULATIVE"/.test(src));
      assert.ok(!/from "\.\/resource-reservation/.test(core));
      assert.ok(!/from "\.\/resource-commitment/.test(core));
      assert.ok(!/from "\.\/feasibility/.test(core));
      assert.ok(!/from "\.\/attention-observation-permission/.test(core));
      assert.ok(
        !/from "\.\/attention-observation-operational-eligibility-authority/.test(
          core
        )
      );
      assert.ok(
        !/EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_POSITIVE/.test(core) ||
          /documentation only/.test(core)
      );
      // documentation-only resolved/unresolved constants may mention tokens;
      // runtime evaluation must not appear.
      assert.ok(!/isResolvedAttentionObservation/.test(core));
      assert.ok(!/\.some\s*\(\s*\(/.test(core) || /has_explicit/.test(core));
      assert.ok(/BOOLEAN_SHORT_CIRCUIT_COMPOSITION_READINESS_NOT_MODELED/.test(types));
      assert.ok(
        /CURRENT_CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_STATES_NOT_CONSUMED/.test(
          types
        )
      );
      assert.ok(
        /RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_BASIS_NOT_MODELED/.test(
          types
        )
      );
    });
  });
});
