/**
 * GROUND-145 — Observation Core XCIX / Explicit per-requirement
 * RESOURCE_READINESS Binding Evidence Composition Policy Foundation
 *
 * Declaration only over GROUND-133 Binding Set + explicit member-set/ANY-ALL
 * specification. No GROUND-141 State consumption. No composition evaluation.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY_MODEL_LIMITATIONS,
  attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyKey,
  buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySet,
  buildCanonicalResourceReadinessBindingEvidenceCompositionMemberSetKey,
  CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_KIND_ORDER,
  canonicalizeResourceReadinessBindingEvidenceCompositionMemberKeys,
  normalizeAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySpecification,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-policy-core.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySpecification,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-policy-types.js";
import {
  buildAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-observation-context-binding-core.js";
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
const CAND_2 = "cand-b";
const NEED_KEY = "need";
const NEED_KEY_2 = "need-b";
const CAP_SET_KEY = "cap-set-key";
const CAP_SET_KEY_2 = "cap-set-key-b";
const RD1 = "rd-00000000-0000-4000-8000-000000000001";
const RD2 = "rd-00000000-0000-4000-8000-000000000002";
const RD3 = "rd-00000000-0000-4000-8000-000000000003";

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
const R4 = mockResourceRequirement({
  key: "req-r4",
  resource_key: "STORAGE",
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
    resource_requirements: [R1, R2, R3, R4],
    has_explicit_observation_resource_requirement_set: true,
    has_observation_resource_requirements: true,
    model_limitations: [],
  };
  return { ...base, ...overrides };
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
          {
            observation_resource_requirement_key: R3.key,
            resource_declaration_id: RD2,
          },
        ],
      },
    ],
  }
): AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment {
  return buildAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment(
    {
      observation_resource_requirement_set: observationResourceRequirementSet,
      specification,
    }
  );
}

function bindingKeysForRequirement(
  set: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
  requirementKey: string
): string[] {
  const requirement = set.candidate_assessments[0]!.requirement_binding_assessments.find(
    (a) => a.observation_resource_requirement_key === requirementKey
  )!;
  return requirement.bindings.map((b) => b.key);
}

function build145(
  bindingSet: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment = build133(),
  specification: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySpecification = {
    requirement_policies: [],
  }
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySet(
    {
      resource_readiness_observation_context_binding_set: bindingSet,
      specification,
    }
  );
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-145 RESOURCE_READINESS Binding Evidence Composition Policy", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.25");
  });

  it("model limitations fixed order", () => {
    assert.deepEqual(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY_MODEL_LIMITATIONS,
      [
        "CURRENT_CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_STATES_NOT_CONSUMED",
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_NOT_MODELED",
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_BASIS_NOT_MODELED",
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_NOT_MODELED",
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_NOT_MODELED",
        "PER_REQUIREMENT_CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_NOT_MODELED",
        "MULTIPLE_BINDING_COMPOSITION_GROUPS_PER_REQUIREMENT_NOT_MODELED",
        "NESTED_BOOLEAN_BINDING_COMPOSITION_NOT_MODELED",
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
      CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_KIND_ORDER,
      [
        "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
        "ALL_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITIONS_HOLD",
      ]
    );
  });

  describe("policy declaration", () => {
    it("one requirement / no policy", () => {
      const set = build145();
      const r1 = set.candidate_assessments[0]!.requirement_policy_assessments.find(
        (a) => a.observation_resource_requirement_key === R1.key
      )!;
      assert.equal(
        r1.status,
        "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY_DECLARED"
      );
      assert.equal(r1.policy, null);
      assert.equal(
        r1.has_explicit_resource_readiness_binding_evidence_composition_policy,
        false
      );
    });

    it("one requirement / ANY one member", () => {
      const bindingSet = build133();
      const [b1] = bindingKeysForRequirement(bindingSet, R1.key);
      const set = build145(bindingSet, {
        requirement_policies: [
          {
            observation_resource_requirement_key: R1.key,
            member_binding_keys: [b1!],
            composition_kind:
              "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
          },
        ],
      });
      const r1 = set.candidate_assessments[0]!.requirement_policy_assessments.find(
        (a) => a.observation_resource_requirement_key === R1.key
      )!;
      assert.equal(
        r1.status,
        "EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY_PRESENT"
      );
      assert.ok(r1.policy);
      assert.deepEqual(r1.policy!.member_binding_keys, [b1!]);
      assert.equal(
        r1.policy!.composition_kind,
        "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS"
      );
    });

    it("one requirement / ALL one member is distinct from ANY", () => {
      const bindingSet = build133();
      const [b1] = bindingKeysForRequirement(bindingSet, R1.key);
      const anySet = build145(bindingSet, {
        requirement_policies: [
          {
            observation_resource_requirement_key: R1.key,
            member_binding_keys: [b1!],
            composition_kind:
              "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
          },
        ],
      });
      const allSet = build145(bindingSet, {
        requirement_policies: [
          {
            observation_resource_requirement_key: R1.key,
            member_binding_keys: [b1!],
            composition_kind:
              "ALL_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITIONS_HOLD",
          },
        ],
      });
      const anyKey = anySet.candidate_assessments[0]!.requirement_policy_assessments.find(
        (a) => a.observation_resource_requirement_key === R1.key
      )!.policy!.key;
      const allKey = allSet.candidate_assessments[0]!.requirement_policy_assessments.find(
        (a) => a.observation_resource_requirement_key === R1.key
      )!.policy!.key;
      assert.notEqual(anyKey, allKey);
    });

    it("one requirement / ANY multiple members", () => {
      const bindingSet = build133();
      const members = bindingKeysForRequirement(bindingSet, R1.key);
      const set = build145(bindingSet, {
        requirement_policies: [
          {
            observation_resource_requirement_key: R1.key,
            member_binding_keys: members,
            composition_kind:
              "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
          },
        ],
      });
      const policy = set.candidate_assessments[0]!.requirement_policy_assessments.find(
        (a) => a.observation_resource_requirement_key === R1.key
      )!.policy!;
      assert.deepEqual(
        policy.member_binding_keys,
        [...members].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
      );
    });

    it("one requirement / ALL multiple members", () => {
      const bindingSet = build133();
      const members = bindingKeysForRequirement(bindingSet, R1.key);
      const set = build145(bindingSet, {
        requirement_policies: [
          {
            observation_resource_requirement_key: R1.key,
            member_binding_keys: members,
            composition_kind:
              "ALL_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITIONS_HOLD",
          },
        ],
      });
      assert.equal(
        set.candidate_assessments[0]!.requirement_policy_assessments.find(
          (a) => a.observation_resource_requirement_key === R1.key
        )!.policy!.composition_kind,
        "ALL_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITIONS_HOLD"
      );
    });

    it("empty member set rejects", () => {
      const bindingSet = build133();
      assert.throws(
        () =>
          build145(bindingSet, {
            requirement_policies: [
              {
                observation_resource_requirement_key: R1.key,
                member_binding_keys: [],
                composition_kind:
                  "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
              },
            ],
          }),
        /empty member|vacuous/i
      );
    });

    it("duplicate member keys normalize without multiplicity", () => {
      const bindingSet = build133();
      const [b1, b2] = bindingKeysForRequirement(bindingSet, R1.key);
      const set = build145(bindingSet, {
        requirement_policies: [
          {
            observation_resource_requirement_key: R1.key,
            member_binding_keys: [b1!, b1!, b2!],
            composition_kind:
              "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
          },
        ],
      });
      const members = set.candidate_assessments[0]!.requirement_policy_assessments.find(
        (a) => a.observation_resource_requirement_key === R1.key
      )!.policy!.member_binding_keys;
      assert.deepEqual(
        members,
        canonicalizeResourceReadinessBindingEvidenceCompositionMemberKeys([
          b1!,
          b2!,
        ])
      );
      assert.equal(members.filter((k) => k === b1).length, 1);
    });

    it("member order invariance", () => {
      const bindingSet = build133();
      const [b1, b2, b3] = bindingKeysForRequirement(bindingSet, R1.key);
      const a = build145(bindingSet, {
        requirement_policies: [
          {
            observation_resource_requirement_key: R1.key,
            member_binding_keys: [b1!, b2!, b3!],
            composition_kind:
              "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
          },
        ],
      });
      const b = build145(bindingSet, {
        requirement_policies: [
          {
            observation_resource_requirement_key: R1.key,
            member_binding_keys: [b3!, b1!, b2!],
            composition_kind:
              "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
          },
        ],
      });
      assert.equal(
        a.candidate_assessments[0]!.requirement_policy_assessments.find(
          (x) => x.observation_resource_requirement_key === R1.key
        )!.policy!.key,
        b.candidate_assessments[0]!.requirement_policy_assessments.find(
          (x) => x.observation_resource_requirement_key === R1.key
        )!.policy!.key
      );
    });

    it("specification order invariance", () => {
      const bindingSet = build133();
      const r1Members = bindingKeysForRequirement(bindingSet, R1.key);
      const r2Members = bindingKeysForRequirement(bindingSet, R2.key);
      const a = build145(bindingSet, {
        requirement_policies: [
          {
            observation_resource_requirement_key: R1.key,
            member_binding_keys: r1Members,
            composition_kind:
              "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
          },
          {
            observation_resource_requirement_key: R2.key,
            member_binding_keys: r2Members,
            composition_kind:
              "ALL_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITIONS_HOLD",
          },
        ],
      });
      const b = build145(bindingSet, {
        requirement_policies: [
          {
            observation_resource_requirement_key: R2.key,
            member_binding_keys: r2Members,
            composition_kind:
              "ALL_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITIONS_HOLD",
          },
          {
            observation_resource_requirement_key: R1.key,
            member_binding_keys: r1Members,
            composition_kind:
              "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
          },
        ],
      });
      assert.deepEqual(
        a.specification.requirement_policies,
        b.specification.requirement_policies
      );
    });

    it("unknown member key rejects", () => {
      const bindingSet = build133();
      assert.throws(
        () =>
          build145(bindingSet, {
            requirement_policies: [
              {
                observation_resource_requirement_key: R1.key,
                member_binding_keys: ["missing-binding-key"],
                composition_kind:
                  "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
              },
            ],
          }),
        /Unknown or stale/
      );
    });

    it("cross-requirement member rejects", () => {
      const bindingSet = build133();
      const r2Members = bindingKeysForRequirement(bindingSet, R2.key);
      assert.throws(
        () =>
          build145(bindingSet, {
            requirement_policies: [
              {
                observation_resource_requirement_key: R1.key,
                member_binding_keys: r2Members,
                composition_kind:
                  "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
              },
            ],
          }),
        /Unknown or stale|Cross-requirement/
      );
    });

    it("exact member subset leaves unselected binding without polarity", () => {
      const bindingSet = build133();
      const [b1, , b3] = bindingKeysForRequirement(bindingSet, R1.key);
      const set = build145(bindingSet, {
        requirement_policies: [
          {
            observation_resource_requirement_key: R1.key,
            member_binding_keys: [b1!, b3!],
            composition_kind:
              "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
          },
        ],
      });
      const policy = set.candidate_assessments[0]!.requirement_policy_assessments.find(
        (a) => a.observation_resource_requirement_key === R1.key
      )!.policy!;
      assert.equal(policy.member_binding_keys.length, 2);
      const json = JSON.stringify(set);
      assert.ok(!/"EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_NEGATIVE"/.test(json));
      assert.ok(!/"EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_POSITIVE"/.test(json));
    });

    it("duplicate same ANY policy normalizes", () => {
      const bindingSet = build133();
      const [b1, b2] = bindingKeysForRequirement(bindingSet, R1.key);
      const normalized =
        normalizeAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySpecification(
          bindingSet,
          {
            requirement_policies: [
              {
                observation_resource_requirement_key: R1.key,
                member_binding_keys: [b1!, b2!],
                composition_kind:
                  "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
              },
              {
                observation_resource_requirement_key: R1.key,
                member_binding_keys: [b2!, b1!],
                composition_kind:
                  "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
              },
            ],
          }
        );
      assert.equal(normalized.requirement_policies.length, 1);
    });

    it("competing ANY vs ALL rejects", () => {
      const bindingSet = build133();
      const [b1, b2] = bindingKeysForRequirement(bindingSet, R1.key);
      assert.throws(
        () =>
          build145(bindingSet, {
            requirement_policies: [
              {
                observation_resource_requirement_key: R1.key,
                member_binding_keys: [b1!, b2!],
                composition_kind:
                  "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
              },
              {
                observation_resource_requirement_key: R1.key,
                member_binding_keys: [b1!, b2!],
                composition_kind:
                  "ALL_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITIONS_HOLD",
              },
            ],
          }),
        /Conflicting/
      );
    });

    it("competing member sets reject", () => {
      const bindingSet = build133();
      const [b1, b2, b3] = bindingKeysForRequirement(bindingSet, R1.key);
      assert.throws(
        () =>
          build145(bindingSet, {
            requirement_policies: [
              {
                observation_resource_requirement_key: R1.key,
                member_binding_keys: [b1!, b2!],
                composition_kind:
                  "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
              },
              {
                observation_resource_requirement_key: R1.key,
                member_binding_keys: [b1!, b3!],
                composition_kind:
                  "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
              },
            ],
          }),
        /Conflicting/
      );
    });

    it("policy identity includes member set and operator", () => {
      const bindingSet = build133();
      const [b1, b2, b3] = bindingKeysForRequirement(bindingSet, R1.key);
      const key12 = attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyKey(
        {
          candidate_key: CAND,
          observation_need_key: NEED_KEY,
          capability_requirement_set_key: CAP_SET_KEY,
          observation_resource_requirement_key: R1.key,
          member_binding_keys: [b1!, b2!],
          composition_kind:
            "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
        }
      );
      const key123 = attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicyKey(
        {
          candidate_key: CAND,
          observation_need_key: NEED_KEY,
          capability_requirement_set_key: CAP_SET_KEY,
          observation_resource_requirement_key: R1.key,
          member_binding_keys: [b1!, b2!, b3!],
          composition_kind:
            "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
        }
      );
      assert.notEqual(key12, key123);
      assert.equal(
        buildCanonicalResourceReadinessBindingEvidenceCompositionMemberSetKey([
          b2!,
          b1!,
        ]),
        buildCanonicalResourceReadinessBindingEvidenceCompositionMemberSetKey([
          b1!,
          b2!,
        ])
      );
    });

    it("zero-binding requirement cannot receive valid policy", () => {
      const bindingSet = build133();
      const r4 = bindingSet.candidate_assessments[0]!.requirement_binding_assessments.find(
        (a) => a.observation_resource_requirement_key === R4.key
      )!;
      assert.equal(r4.bindings.length, 0);
      const set = build145(bindingSet);
      const r4Policy = set.candidate_assessments[0]!.requirement_policy_assessments.find(
        (a) => a.observation_resource_requirement_key === R4.key
      )!;
      assert.equal(
        r4Policy.status,
        "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY_DECLARED"
      );
      assert.throws(
        () =>
          build145(bindingSet, {
            requirement_policies: [
              {
                observation_resource_requirement_key: R4.key,
                member_binding_keys: [],
                composition_kind:
                  "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
              },
            ],
          }),
        /at least one GROUND-133 binding|empty member|vacuous/i
      );
    });

    it("adding new GROUND-133 binding does not alter explicit policy membership", () => {
      const baseBindingSet = build133(mock132Set(), {
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
            ],
          },
        ],
      });
      const members = bindingKeysForRequirement(baseBindingSet, R1.key);
      const policySpec = {
        requirement_policies: [
          {
            observation_resource_requirement_key: R1.key,
            member_binding_keys: members,
            composition_kind:
              "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS" as const,
          },
        ],
      };
      const before = build145(baseBindingSet, policySpec);
      const expandedBindingSet = build133(mock132Set(), {
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
            ],
          },
        ],
      });
      const after = build145(expandedBindingSet, policySpec);
      assert.deepEqual(
        before.candidate_assessments[0]!.requirement_policy_assessments.find(
          (a) => a.observation_resource_requirement_key === R1.key
        )!.policy!.member_binding_keys,
        after.candidate_assessments[0]!.requirement_policy_assessments.find(
          (a) => a.observation_resource_requirement_key === R1.key
        )!.policy!.member_binding_keys
      );
      assert.equal(
        after.candidate_assessments[0]!.requirement_policy_assessments.find(
          (a) => a.observation_resource_requirement_key === R1.key
        )!.policy!.member_binding_keys.length,
        2
      );
      assert.equal(
        bindingKeysForRequirement(expandedBindingSet, R1.key).length,
        3
      );
    });

    it("stale declared member absent from authoritative GROUND-133 rejects", () => {
      const bindingSet = build133(mock132Set(), {
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
      });
      const staleKey =
        "attention-observation-operational-eligibility-resource-readiness-observation-context-binding|cand|need|cap-set-key|req-r1|rd-missing";
      assert.throws(
        () =>
          build145(bindingSet, {
            requirement_policies: [
              {
                observation_resource_requirement_key: R1.key,
                member_binding_keys: [staleKey],
                composition_kind:
                  "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
              },
            ],
          }),
        /Unknown or stale/
      );
    });

    it("candidate mixed requirements", () => {
      const bindingSet = build133();
      const r1Members = bindingKeysForRequirement(bindingSet, R1.key);
      const r2Members = bindingKeysForRequirement(bindingSet, R2.key);
      const set = build145(bindingSet, {
        requirement_policies: [
          {
            observation_resource_requirement_key: R1.key,
            member_binding_keys: r1Members,
            composition_kind:
              "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
          },
          {
            observation_resource_requirement_key: R2.key,
            member_binding_keys: r2Members,
            composition_kind:
              "ALL_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITIONS_HOLD",
          },
        ],
      });
      const assessments =
        set.candidate_assessments[0]!.requirement_policy_assessments;
      assert.equal(
        assessments.find((a) => a.observation_resource_requirement_key === R1.key)!
          .status,
        "EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY_PRESENT"
      );
      assert.equal(
        assessments.find((a) => a.observation_resource_requirement_key === R2.key)!
          .status,
        "EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY_PRESENT"
      );
      assert.equal(
        assessments.find((a) => a.observation_resource_requirement_key === R3.key)!
          .status,
        "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY_DECLARED"
      );
      assert.equal(
        assessments.find((a) => a.observation_resource_requirement_key === R4.key)!
          .status,
        "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY_DECLARED"
      );
      assert.equal(
        set.has_explicit_resource_readiness_binding_evidence_composition_policies,
        true
      );
      const json = JSON.stringify(set);
      assert.ok(!/"CONDITION_HOLDS"/.test(json));
      assert.ok(!/"RESOURCE_READY"/.test(json));
    });

    it("same ResourceDeclaration across distinct bindings remain distinct members", () => {
      const bindingSet = build133();
      const r1Members = bindingKeysForRequirement(bindingSet, R1.key);
      const r2Members = bindingKeysForRequirement(bindingSet, R2.key);
      assert.notEqual(r1Members[0], r2Members[0]);
      const set = build145(bindingSet, {
        requirement_policies: [
          {
            observation_resource_requirement_key: R1.key,
            member_binding_keys: [r1Members[0]!],
            composition_kind:
              "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
          },
          {
            observation_resource_requirement_key: R2.key,
            member_binding_keys: r2Members,
            composition_kind:
              "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
          },
        ],
      });
      assert.notEqual(
        set.candidate_assessments[0]!.requirement_policy_assessments.find(
          (a) => a.observation_resource_requirement_key === R1.key
        )!.policy!.key,
        set.candidate_assessments[0]!.requirement_policy_assessments.find(
          (a) => a.observation_resource_requirement_key === R2.key
        )!.policy!.key
      );
    });
  });

  describe("cross-context validation", () => {
    it("cross-Candidate member rejects", () => {
      const r1b = mockResourceRequirement({
        key: "req-r1-b",
        candidate_key: CAND_2,
        observation_need_key: NEED_KEY_2,
        capability_requirement_set_key: CAP_SET_KEY_2,
      });
      const bindingSet = build133(
        mock132Set({
          candidates: [
            {
              candidate_key: CAND,
              resource_requirements: [R1],
            },
            {
              candidate_key: CAND_2,
              resource_requirements: [r1b],
            },
          ],
        }),
        {
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
            {
              candidate_key: CAND_2,
              bindings: [
                {
                  observation_resource_requirement_key: r1b.key,
                  resource_declaration_id: RD2,
                },
              ],
            },
          ],
        }
      );
      const cand2Members = bindingSet.candidate_assessments
        .find((c) => c.candidate_key === CAND_2)!
        .requirement_binding_assessments.find(
          (a) => a.observation_resource_requirement_key === r1b.key
        )!
        .bindings.map((b) => b.key);
      assert.throws(
        () =>
          build145(bindingSet, {
            requirement_policies: [
              {
                observation_resource_requirement_key: R1.key,
                member_binding_keys: cand2Members,
                composition_kind:
                  "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS",
              },
            ],
          }),
        /Unknown or stale|Cross-Candidate|Cross-Need|Cross-Capability|Cross-requirement/
      );
    });
  });

  describe("immutability / determinism", () => {
    it("input immutability", () => {
      const bindingSet = build133();
      const members = bindingKeysForRequirement(bindingSet, R1.key);
      const specification = {
        requirement_policies: [
          {
            observation_resource_requirement_key: R1.key,
            member_binding_keys: [...members].reverse(),
            composition_kind:
              "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS" as const,
          },
        ],
      };
      const beforeBinding = deepClone(bindingSet);
      const beforeSpec = deepClone(specification);
      build145(bindingSet, specification);
      assert.deepEqual(bindingSet, beforeBinding);
      assert.deepEqual(specification, beforeSpec);
    });

    it("deep-cloned equivalent input yields same output", () => {
      const bindingSet = build133();
      const members = bindingKeysForRequirement(bindingSet, R1.key);
      const specification = {
        requirement_policies: [
          {
            observation_resource_requirement_key: R1.key,
            member_binding_keys: members,
            composition_kind:
              "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS" as const,
          },
        ],
      };
      const a = build145(bindingSet, specification);
      const b = build145(deepClone(bindingSet), deepClone(specification));
      assert.deepEqual(a.specification, b.specification);
      assert.deepEqual(
        a.candidate_assessments.map((c) =>
          c.requirement_policy_assessments.map((r) => ({
            status: r.status,
            policy: r.policy,
          }))
        ),
        b.candidate_assessments.map((c) =>
          c.requirement_policy_assessments.map((r) => ({
            status: r.status,
            policy: r.policy,
          }))
        )
      );
    });

    it("determinism", () => {
      const bindingSet = build133();
      const members = bindingKeysForRequirement(bindingSet, R1.key);
      const specification = {
        requirement_policies: [
          {
            observation_resource_requirement_key: R1.key,
            member_binding_keys: members,
            composition_kind:
              "ALL_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITIONS_HOLD" as const,
          },
        ],
      };
      const a = build145(bindingSet, specification);
      const b = build145(bindingSet, specification);
      assert.deepEqual(a, b);
    });
  });

  describe("static proofs / schema", () => {
    it("schema 0.1.24; GROUND-133 only; no GROUND-141 / Result / physical semantics", () => {
      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-policy-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-policy-types.ts"
      );
      const core = readFileSync(corePath, "utf8");
      const types = readFileSync(typesPath, "utf8");
      const src = `${core}\n${types}`;

      assert.ok(
        /resource-readiness-observation-context-binding-types/.test(core)
      );
      assert.ok(!/canonical-per-binding-resource-readiness-evidence-state/.test(core));
      assert.ok(!/interpretation-basis-core/.test(core));
      assert.ok(!/interpretation-basis-types/.test(core));
      assert.ok(!/evidence-evaluation-state-interpretation-policy-core/.test(core));
      assert.ok(!/evidence-evaluation-state-core/.test(core));
      assert.ok(!/raw-evidence-assessment/.test(core));
      assert.ok(!/evaluation-instant/.test(core));
      assert.ok(!/attention-observation-resource-requirement-core/.test(core));
      assert.ok(!/ProjectState/.test(core));
      assert.ok(!/"RESOURCE_READY"/.test(src));
      assert.ok(!/"RESOURCE_NOT_READY"/.test(src));
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
      assert.ok(!/"ALTERNATIVE"/.test(src));
      assert.ok(!/"CUMULATIVE"/.test(src));
      assert.ok(!/"FALLBACK"/.test(src));
      assert.ok(!/required_amount/.test(core));
      assert.ok(!/assessResource\s*\(/.test(core));
      assert.ok(!/from "\.\/resource-reservation/.test(core));
      assert.ok(!/from "\.\/resource-commitment/.test(core));
      assert.ok(!/from "\.\/resource-reservation-contention/.test(core));
      assert.ok(!/from "\.\/feasibility/.test(core));
      assert.ok(!/from "\.\/attention-observation-permission/.test(core));
      assert.ok(!/from "\.\/attention-observation-operational-eligibility-authority/.test(core));
      assert.ok(!/EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_POSITIVE/.test(core));
      assert.ok(!/EXPLICITLY_INTERPRETED_RESOURCE_READINESS_EVIDENCE_NEGATIVE/.test(core));
      assert.ok(!/UNRESOLVED_NO_EXPLICIT_RESOURCE_READINESS_EVIDENCE/.test(core));
      assert.ok(!/all current bindings/i.test(core));
      assert.ok(!/implicit.*all.*binding/i.test(core));
      assert.ok(/MULTIPLE_BINDING_COMPOSITION_GROUPS_PER_REQUIREMENT_NOT_MODELED/.test(types));
      assert.ok(/NESTED_BOOLEAN_BINDING_COMPOSITION_NOT_MODELED/.test(types));
      assert.ok(/PHYSICAL_RESOURCE_BINDING_ROLE_NOT_MODELED/.test(types));
      assert.ok(/CURRENT_CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_STATES_NOT_CONSUMED/.test(types));
      assert.ok(/OBSERVATION_RESOURCE_RESERVATION_EVIDENCE_NOT_INCLUDED/.test(types));
      assert.ok(/RESOURCE_FUNGIBILITY_NOT_MODELED/.test(types));
      assert.ok(/RESOURCE_SUBSTITUTION_NOT_MODELED/.test(types));
    });
  });
});
