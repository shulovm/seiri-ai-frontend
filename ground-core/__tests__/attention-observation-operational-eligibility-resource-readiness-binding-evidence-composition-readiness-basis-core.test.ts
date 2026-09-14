/**
 * GROUND-147 — Observation Core CI / RESOURCE_READINESS
 * Binding Evidence Composition Readiness Basis Foundation
 *
 * GROUND-141 current States + GROUND-146 Readiness Policy → Readiness Basis.
 * No ANY/ALL Composition Result. NEGATIVE is resolved.
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
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_BASIS_MODEL_LIMITATIONS,
  attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisKey,
  buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisSet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-readiness-basis-core.js";
import {
  buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySet,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-readiness-policy-core.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySetAssessment,
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

function bindingKeysForRequirement(requirementKey: string): string[] {
  const set = build133();
  const requirement = set.candidate_assessments[0]!.requirement_binding_assessments.find(
    (a) => a.observation_resource_requirement_key === requirementKey
  )!;
  return requirement.bindings.map((b) => b.key);
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
  compositionSet: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionPolicySetAssessment = build145(),
  declareForRequirements: string[] = [R1.key]
): AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySetAssessment {
  const composition_readiness_policies = declareForRequirements.map(
    (requirementKey) => ({
      resource_readiness_binding_evidence_composition_policy_key:
        compositionPolicyKeyForRequirement(compositionSet, requirementKey),
      readiness_kind: READINESS_KIND,
    })
  );
  return buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySet(
    {
      resource_readiness_binding_evidence_composition_policy_set: compositionSet,
      specification: { composition_readiness_policies },
    }
  );
}

function mockCanonicalState(
  bindingKey: string,
  state: AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateValue,
  requirementKey: string = R1.key
): AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceState {
  const declarationId = bindingDeclarationId(bindingKey);
  return {
    key: `canonical-state|${bindingKey}|${state}`,
    basis_key: `canonical-basis|${bindingKey}|${state}`,
    candidate_key: CAND,
    observation_need_key: NEED_KEY,
    capability_requirement_set_key: CAP_SET_KEY,
    dimension: "RESOURCE_READINESS",
    observation_resource_requirement_key: requirementKey,
    resource_readiness_observation_context_binding_key: bindingKey,
    resource_declaration_id: declarationId,
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
  readinessPolicySet: AttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessPolicySetAssessment,
  canonicalStateSet: AttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceStateSetAssessment
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisSet(
    {
      canonical_per_binding_resource_readiness_evidence_state_set:
        canonicalStateSet,
      resource_readiness_binding_evidence_composition_readiness_policy_set:
        readinessPolicySet,
    }
  );
}

function r1Assessment(
  set: ReturnType<typeof build147>
) {
  return set.candidate_assessments[0]!.requirement_readiness_basis_assessments.find(
    (a) => a.observation_resource_requirement_key === R1.key
  )!;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-147 RESOURCE_READINESS Binding Evidence Composition Readiness Basis", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.25");
  });

  it("model limitations fixed order", () => {
    assert.deepEqual(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_BASIS_MODEL_LIMITATIONS,
      [
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_NOT_MODELED",
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_POLICY_NOT_MODELED",
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_INTERPRETATION_BASIS_NOT_MODELED",
        "PER_REQUIREMENT_CANONICAL_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_NOT_MODELED",
        "BOOLEAN_SHORT_CIRCUIT_COMPOSITION_NOT_MODELED",
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
  });

  describe("status semantics", () => {
    it("Composition Policy absent → NOT_APPLICABLE", () => {
      const compositionSet = build145({
        includeR1Any: false,
        includeR1All: false,
      });
      const readinessSet = build146(compositionSet, []);
      const set = build147(readinessSet, mock141Set([]));
      const r3 = set.candidate_assessments[0]!.requirement_readiness_basis_assessments.find(
        (a) => a.observation_resource_requirement_key === R3.key
      )!;
      assert.equal(
        r3.status,
        "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY"
      );
      assert.equal(r3.readiness_basis, null);
      assert.equal(r3.readiness_policy_condition, null);
      assert.equal(
        r3.has_resource_readiness_binding_evidence_composition_readiness_basis,
        false
      );
    });

    it("Composition Policy present / Readiness Policy absent → NO_READINESS_POLICY", () => {
      const compositionSet = build145();
      const readinessSet = build146(compositionSet, []);
      const members = bindingKeysForRequirement(R1.key).slice(0, 2);
      const set = build147(
        readinessSet,
        mock141Set(members.map((k) => mockCanonicalState(k, POSITIVE)))
      );
      const r1 = r1Assessment(set);
      assert.equal(
        r1.status,
        "NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_DECLARED"
      );
      assert.equal(r1.readiness_basis, null);
      assert.equal(r1.readiness_policy_condition, null);
      assert.equal(
        r1.has_resource_readiness_binding_evidence_composition_readiness_basis,
        false
      );
    });

    it("NOT_APPLICABLE != NO_READINESS_POLICY != DOES_NOT_HOLD", () => {
      const compositionSet = build145({ includeR2Any: true });
      const readinessSet = build146(compositionSet, [R2.key]);
      const r1Members = bindingKeysForRequirement(R1.key).slice(0, 2);
      const r2Members = bindingKeysForRequirement(R2.key);
      const set = build147(
        readinessSet,
        mock141Set([
          ...r1Members.map((k) => mockCanonicalState(k, POSITIVE)),
          ...r2Members.map((k) =>
            mockCanonicalState(k, UNRESOLVED_POLICY, R2.key)
          ),
        ])
      );
      const assessments =
        set.candidate_assessments[0]!.requirement_readiness_basis_assessments;
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
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(
        r3.status,
        "NOT_APPLICABLE_NO_EXPLICIT_RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_POLICY"
      );
      assert.notEqual(r1.status, r2.status);
      assert.notEqual(r1.status, r3.status);
      assert.notEqual(r2.status, r3.status);
    });
  });

  describe("readiness condition evaluation", () => {
    it("one POSITIVE member → HOLDS", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 1);
      const compositionSet = build145({ r1Members: members });
      const readinessSet = build146(compositionSet);
      const set = build147(
        readinessSet,
        mock141Set([mockCanonicalState(members[0]!, POSITIVE)])
      );
      const r1 = r1Assessment(set);
      assert.equal(
        r1.status,
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS"
      );
      assert.ok(r1.readiness_basis);
      assert.equal(
        r1.has_resource_readiness_binding_evidence_composition_readiness_basis,
        true
      );
    });

    it("one NEGATIVE member → HOLDS (NEGATIVE is resolved)", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 1);
      const compositionSet = build145({ r1Members: members });
      const readinessSet = build146(compositionSet);
      const set = build147(
        readinessSet,
        mock141Set([mockCanonicalState(members[0]!, NEGATIVE)])
      );
      const r1 = r1Assessment(set);
      assert.equal(
        r1.status,
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS"
      );
      assert.equal(
        r1.readiness_basis!.member_readiness_assessments[0]!.status,
        "SELECTED_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_PRESENT_RESOLVED"
      );
      assert.equal(
        r1.readiness_basis!.member_readiness_assessments[0]!
          .is_resolved_for_composition_readiness,
        true
      );
    });

    it("unresolved-policy → DOES_NOT_HOLD with preserved reason", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 1);
      const compositionSet = build145({ r1Members: members });
      const readinessSet = build146(compositionSet);
      const set = build147(
        readinessSet,
        mock141Set([mockCanonicalState(members[0]!, UNRESOLVED_POLICY)])
      );
      const r1 = r1Assessment(set);
      assert.equal(
        r1.status,
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
      );
      assert.ok(r1.readiness_basis);
      assert.equal(
        r1.readiness_basis!.member_readiness_assessments[0]!.status,
        "SELECTED_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_PRESENT_UNRESOLVED_NO_EXPLICIT_INTERPRETATION_POLICY"
      );
    });

    it("unresolved-mapping → DOES_NOT_HOLD with distinct reason", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 1);
      const compositionSet = build145({ r1Members: members });
      const readinessSet = build146(compositionSet);
      const set = build147(
        readinessSet,
        mock141Set([mockCanonicalState(members[0]!, UNRESOLVED_MAPPING)])
      );
      const r1 = r1Assessment(set);
      assert.equal(
        r1.status,
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(
        r1.readiness_basis!.member_readiness_assessments[0]!.status,
        "SELECTED_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_PRESENT_UNRESOLVED_NO_EXPLICIT_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
      );
    });

    it("missing selected member → DOES_NOT_HOLD with MISSING reason", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 2);
      const compositionSet = build145({ r1Members: members });
      const readinessSet = build146(compositionSet);
      const set = build147(
        readinessSet,
        mock141Set([mockCanonicalState(members[0]!, POSITIVE)])
      );
      const r1 = r1Assessment(set);
      assert.equal(
        r1.status,
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(r1.readiness_basis!.member_readiness_assessments.length, 2);
      const missing = r1.readiness_basis!.member_readiness_assessments.find(
        (a) =>
          a.resource_readiness_observation_context_binding_key === members[1]
      )!;
      assert.equal(
        missing.status,
        "SELECTED_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_MISSING"
      );
      assert.equal(missing.canonical_binding_evidence_state, null);
      assert.equal(missing.has_current_canonical_binding_evidence_state, false);
      assert.equal(missing.is_resolved_for_composition_readiness, false);
    });

    it("all POSITIVE / all NEGATIVE / mixed → HOLDS", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 3);
      for (const states of [
        [POSITIVE, POSITIVE, POSITIVE],
        [NEGATIVE, NEGATIVE, NEGATIVE],
        [POSITIVE, NEGATIVE, NEGATIVE],
      ] as const) {
        const compositionSet = build145({ r1Members: members });
        const readinessSet = build146(compositionSet);
        const set = build147(
          readinessSet,
          mock141Set(
            members.map((k, i) => mockCanonicalState(k, states[i]!))
          )
        );
        assert.equal(
          r1Assessment(set).status,
          "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS"
        );
      }
    });

    it("POSITIVE + unresolved/missing → DOES_NOT_HOLD", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 2);
      const compositionSet = build145({ r1Members: members });
      const readinessSet = build146(compositionSet);

      for (const second of [UNRESOLVED_POLICY, UNRESOLVED_MAPPING] as const) {
        const set = build147(
          readinessSet,
          mock141Set([
            mockCanonicalState(members[0]!, POSITIVE),
            mockCanonicalState(members[1]!, second),
          ])
        );
        assert.equal(
          r1Assessment(set).status,
          "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
        );
      }

      const missingSet = build147(
        readinessSet,
        mock141Set([mockCanonicalState(members[0]!, POSITIVE)])
      );
      assert.equal(
        r1Assessment(missingSet).status,
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
      );
    });

    it("NEGATIVE + unresolved → DOES_NOT_HOLD", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 2);
      const compositionSet = build145({ r1Members: members });
      const readinessSet = build146(compositionSet);
      const set = build147(
        readinessSet,
        mock141Set([
          mockCanonicalState(members[0]!, NEGATIVE),
          mockCanonicalState(members[1]!, UNRESOLVED_POLICY),
        ])
      );
      assert.equal(
        r1Assessment(set).status,
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
      );
    });
  });

  describe("ANY/ALL short-circuit firewall", () => {
    it("ANY(POSITIVE, UNRESOLVED) → DOES_NOT_HOLD", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 2);
      const compositionSet = build145({ r1Members: members });
      const readinessSet = build146(compositionSet);
      const set = build147(
        readinessSet,
        mock141Set([
          mockCanonicalState(members[0]!, POSITIVE),
          mockCanonicalState(members[1]!, UNRESOLVED_MAPPING),
        ])
      );
      assert.equal(
        r1Assessment(set).status,
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(
        r1Assessment(set).readiness_basis!.composition_kind,
        "ANY_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITION_HOLDS"
      );
    });

    it("ALL(NEGATIVE, UNRESOLVED) → DOES_NOT_HOLD", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 2);
      const compositionSet = build145({
        includeR1Any: false,
        includeR1All: true,
        r1Members: members,
      });
      const readinessSet = build146(compositionSet);
      const set = build147(
        readinessSet,
        mock141Set([
          mockCanonicalState(members[0]!, NEGATIVE),
          mockCanonicalState(members[1]!, UNRESOLVED_POLICY),
        ])
      );
      assert.equal(
        r1Assessment(set).status,
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(
        r1Assessment(set).readiness_basis!.composition_kind,
        "ALL_RESOURCE_READINESS_BINDING_EVIDENCE_CONDITIONS_HOLD"
      );
    });

    it("ANY/ALL(POSITIVE, NEGATIVE) → HOLDS only; same condition; distinct identity", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 2);
      const anySet = build145({ r1Members: members });
      const allSet = build145({
        includeR1Any: false,
        includeR1All: true,
        r1Members: members,
      });
      const states = mock141Set([
        mockCanonicalState(members[0]!, POSITIVE),
        mockCanonicalState(members[1]!, NEGATIVE),
      ]);
      const anyResult = build147(build146(anySet), states);
      const allResult = build147(build146(allSet), states);
      const anyR1 = r1Assessment(anyResult);
      const allR1 = r1Assessment(allResult);
      assert.equal(
        anyR1.readiness_policy_condition,
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS"
      );
      assert.equal(
        allR1.readiness_policy_condition,
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS"
      );
      assert.notEqual(anyR1.readiness_basis!.key, allR1.readiness_basis!.key);
      assert.notEqual(
        anyR1.readiness_basis!.composition_kind,
        allR1.readiness_basis!.composition_kind
      );
    });
  });

  describe("selected subset / unselected States", () => {
    it("selected B1/B3 resolved; unselected B2 unresolved → HOLDS", () => {
      const all = bindingKeysForRequirement(R1.key);
      const selected = [all[0]!, all[2]!];
      const compositionSet = build145({ r1Members: selected });
      const readinessSet = build146(compositionSet);
      const set = build147(
        readinessSet,
        mock141Set([
          mockCanonicalState(all[0]!, POSITIVE),
          mockCanonicalState(all[1]!, UNRESOLVED_POLICY),
          mockCanonicalState(all[2]!, NEGATIVE),
        ])
      );
      assert.equal(
        r1Assessment(set).status,
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS"
      );
      assert.equal(
        r1Assessment(set).readiness_basis!.member_readiness_assessments.length,
        2
      );
    });

    it("extra unselected States do not affect readiness", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 1);
      const extra = bindingKeysForRequirement(R1.key)[1]!;
      const compositionSet = build145({ r1Members: members });
      const readinessSet = build146(compositionSet);
      const set = build147(
        readinessSet,
        mock141Set([
          mockCanonicalState(members[0]!, POSITIVE),
          mockCanonicalState(extra, UNRESOLVED_MAPPING),
        ])
      );
      assert.equal(
        r1Assessment(set).status,
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS"
      );
    });

    it("duplicate current State for same selected binding rejects", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 1);
      const compositionSet = build145({ r1Members: members });
      const readinessSet = build146(compositionSet);
      const state = mockCanonicalState(members[0]!, POSITIVE);
      const duplicateSet = mock141Set([state, { ...state, key: "dup-key" }]);
      assert.throws(
        () => build147(readinessSet, duplicateSet),
        /Duplicate current GROUND-141/
      );
    });

    it("member-assessment cardinality includes missing States", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 3);
      const compositionSet = build145({ r1Members: members });
      const readinessSet = build146(compositionSet);
      const set = build147(readinessSet, mock141Set([]));
      const assessments =
        r1Assessment(set).readiness_basis!.member_readiness_assessments;
      assert.equal(assessments.length, 3);
      assert.deepEqual(
        assessments.map(
          (a) => a.resource_readiness_observation_context_binding_key
        ),
        members
      );
      assert.ok(
        assessments.every(
          (a) =>
            a.status ===
            "SELECTED_RESOURCE_READINESS_BINDING_EVIDENCE_STATE_MISSING"
        )
      );
    });
  });

  describe("identity / lineage", () => {
    it("same HOLDS / different current lineage → distinct Basis keys", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 2);
      const compositionSet = build145({ r1Members: members });
      const readinessSet = build146(compositionSet);
      const a = build147(
        readinessSet,
        mock141Set(members.map((k) => mockCanonicalState(k, POSITIVE)))
      );
      const b = build147(
        readinessSet,
        mock141Set(members.map((k) => mockCanonicalState(k, NEGATIVE)))
      );
      assert.equal(
        r1Assessment(a).readiness_policy_condition,
        r1Assessment(b).readiness_policy_condition
      );
      assert.notEqual(
        r1Assessment(a).readiness_basis!.key,
        r1Assessment(b).readiness_basis!.key
      );
    });

    it("same DOES_NOT_HOLD / different failure cause → distinct Basis keys", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 1);
      const compositionSet = build145({ r1Members: members });
      const readinessSet = build146(compositionSet);
      const missing = build147(readinessSet, mock141Set([]));
      const noPolicy = build147(
        readinessSet,
        mock141Set([mockCanonicalState(members[0]!, UNRESOLVED_POLICY)])
      );
      const noMapping = build147(
        readinessSet,
        mock141Set([mockCanonicalState(members[0]!, UNRESOLVED_MAPPING)])
      );
      assert.equal(
        r1Assessment(missing).readiness_policy_condition,
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(
        r1Assessment(noPolicy).readiness_policy_condition,
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
      );
      assert.equal(
        r1Assessment(noMapping).readiness_policy_condition,
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD"
      );
      assert.notEqual(
        r1Assessment(missing).readiness_basis!.key,
        r1Assessment(noPolicy).readiness_basis!.key
      );
      assert.notEqual(
        r1Assessment(noPolicy).readiness_basis!.key,
        r1Assessment(noMapping).readiness_basis!.key
      );
      assert.notEqual(
        r1Assessment(missing).readiness_basis!.member_readiness_assessments[0]!
          .status,
        r1Assessment(noPolicy).readiness_basis!.member_readiness_assessments[0]!
          .status
      );
    });

    it("Basis exists when condition DOES_NOT_HOLD; existence != HOLDS", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 1);
      const compositionSet = build145({ r1Members: members });
      const readinessSet = build146(compositionSet);
      const set = build147(readinessSet, mock141Set([]));
      const r1 = r1Assessment(set);
      assert.equal(
        r1.has_resource_readiness_binding_evidence_composition_readiness_basis,
        true
      );
      assert.ok(r1.readiness_basis);
      assert.notEqual(
        r1.readiness_policy_condition,
        "RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_READINESS_POLICY_CONDITION_HOLDS"
      );
    });

    it("basis key helper includes member lineage and condition", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 1);
      const compositionSet = build145({ r1Members: members });
      const readinessSet = build146(compositionSet);
      const set = build147(
        readinessSet,
        mock141Set([mockCanonicalState(members[0]!, POSITIVE)])
      );
      const basis = r1Assessment(set).readiness_basis!;
      assert.equal(
        basis.key,
        attentionObservationOperationalEligibilityResourceReadinessBindingEvidenceCompositionReadinessBasisKey(
          {
            candidate_key: basis.candidate_key,
            observation_need_key: basis.observation_need_key,
            capability_requirement_set_key: basis.capability_requirement_set_key,
            observation_resource_requirement_key:
              basis.observation_resource_requirement_key,
            resource_readiness_binding_evidence_composition_policy_key:
              basis.resource_readiness_binding_evidence_composition_policy_key,
            resource_readiness_binding_evidence_composition_readiness_policy_key:
              basis.resource_readiness_binding_evidence_composition_readiness_policy_key,
            member_readiness_assessments: basis.member_readiness_assessments,
            readiness_policy_condition: basis.readiness_policy_condition,
          }
        )
      );
    });
  });

  describe("immutability / determinism", () => {
    it("input immutability", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 2);
      const readinessSet = build146(build145({ r1Members: members }));
      const stateSet = mock141Set(
        members.map((k) => mockCanonicalState(k, POSITIVE))
      );
      const beforeReadiness = deepClone(readinessSet);
      const beforeStates = deepClone(stateSet);
      build147(readinessSet, stateSet);
      assert.deepEqual(readinessSet, beforeReadiness);
      assert.deepEqual(stateSet, beforeStates);
    });

    it("deep-cloned equivalent inputs / ordering permutations / determinism", () => {
      const members = bindingKeysForRequirement(R1.key).slice(0, 2);
      const readinessSet = build146(build145({ r1Members: members }));
      const states = [
        mockCanonicalState(members[0]!, POSITIVE),
        mockCanonicalState(members[1]!, NEGATIVE),
      ];
      const a = build147(readinessSet, mock141Set(states));
      const b = build147(
        deepClone(readinessSet),
        mock141Set([...states].reverse())
      );
      assert.deepEqual(
        a.candidate_assessments.map((c) =>
          c.requirement_readiness_basis_assessments.map((r) => ({
            status: r.status,
            readiness_policy_condition: r.readiness_policy_condition,
            readiness_basis: r.readiness_basis,
          }))
        ),
        b.candidate_assessments.map((c) =>
          c.requirement_readiness_basis_assessments.map((r) => ({
            status: r.status,
            readiness_policy_condition: r.readiness_policy_condition,
            readiness_basis: r.readiness_basis,
          }))
        )
      );
      assert.deepEqual(
        build147(readinessSet, mock141Set(states)),
        build147(readinessSet, mock141Set(states))
      );
    });
  });

  describe("static proofs", () => {
    it("no Composition Result / short-circuit / older layer runtime / READY tokens", () => {
      const corePath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-readiness-basis-core.ts"
      );
      const typesPath = join(
        __dirnameTest,
        "../reality/attention-observation-operational-eligibility-resource-readiness-binding-evidence-composition-readiness-basis-types.ts"
      );
      const core = readFileSync(corePath, "utf8");
      const types = readFileSync(typesPath, "utf8");
      const src = `${core}\n${types}`;

      assert.ok(
        /canonical-per-binding-resource-readiness-evidence-state/.test(core)
      );
      assert.ok(
        /binding-evidence-composition-readiness-policy-types/.test(core)
      );
      assert.ok(
        !/binding-evidence-composition-policy-core/.test(core)
      );
      assert.ok(!/interpretation-basis-core/.test(core));
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
        /isResolvedAttentionObservationOperationalEligibilityCanonicalPerBindingResourceReadinessEvidenceState/.test(
          core
        )
      );
      assert.ok(/BOOLEAN_SHORT_CIRCUIT_COMPOSITION_NOT_MODELED/.test(types));
      assert.ok(
        /RESOURCE_READINESS_BINDING_EVIDENCE_COMPOSITION_RESULT_NOT_MODELED/.test(
          types
        )
      );
      // composition_kind retained for lineage only — no POSITIVE short-circuit branch
      assert.ok(!/composition_kind\s*===\s*"ANY/.test(core));
      assert.ok(!/composition_kind\s*===\s*"ALL/.test(core));
    });
  });
});
