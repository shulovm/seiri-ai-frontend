/**
 * GROUND-114 — Observation Core LXVIII / Explicit Authority Evidence
 * Evaluation State Interpretation Policy Foundation
 *
 * Pure 108 Binding + explicit interpretation policy specification
 * (declaration only; no current 113 state / Basis / canonical Authority State).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
  buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicySet,
  buildCanonicalAuthorityEvidenceEvaluationStateInterpretationMappingSetKey,
  canonicalizeAuthorityEvidenceEvaluationStateInterpretationMappings,
  EMPTY_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_MAPPING_SET,
  normalizeAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicySpecification,
  normalizeAuthorityEvidenceEvaluationStateValue,
} from "../reality/attention-observation-operational-eligibility-authority-evidence-evaluation-state-interpretation-policy-core.js";
import type {
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationMapping,
} from "../reality/attention-observation-operational-eligibility-authority-evidence-evaluation-state-interpretation-policy-types.js";
import type { AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateValue } from "../reality/attention-observation-operational-eligibility-authority-evidence-evaluation-state-types.js";
import {
  buildAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSet,
} from "../reality/attention-observation-operational-eligibility-authority-observation-context-binding-core.js";
import type {
  AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSetAssessment,
} from "../reality/attention-observation-operational-eligibility-authority-observation-context-binding-types.js";
import type {
  AttentionObservationCapabilityRequirementSetAssessment,
} from "../reality/attention-observation-capability-requirement-types.js";
import type { GovernanceScope, ProjectState, RealityEntity } from "../types.js";
import { SCHEMA_VERSION } from "../types.js";
import { PROJECT_ID, validProjectStateV0124 } from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const NEED_KEY = "need";
const REQ_KEY = "attention-observation-capability-requirement|need|inspect";
const ENTITY_A = "f4010101-0101-4101-8101-010101010101";
const ENTITY_B = "f4010101-0101-4101-8101-010101010102";
const ORG_B = "f1010101-0101-4101-8101-010101010104";
const TS = "2026-08-24T10:00:00.000Z";

const SCOPE_A: GovernanceScope = {
  kind: "SUBJECT_STATE",
  subject_id: "subject-a",
  state_kind: "active",
};

const SCOPE_OBJ: GovernanceScope = {
  kind: "REALITY_OBJECTIVE",
  objective_id: "f5050505-0505-4505-8505-050505050901",
};

const AS_POSITIVE = "INTERPRET_AS_AUTHORITY_STATE_POSITIVE" as const;
const AS_NEGATIVE = "INTERPRET_AS_AUTHORITY_STATE_NEGATIVE" as const;

function assertNoCurrentAuthoritySemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"AUTHORIZED"/.test(json));
  assert.ok(!/"UNAUTHORIZED"/.test(json));
  assert.ok(!/"AUTHORITY_PRESENT"/.test(json));
  assert.ok(!/"AUTHORITY_ABSENT"/.test(json));
  assert.ok(!/"effective_authority"/.test(json));
  assert.ok(!/"authority_evaluation_at"/.test(json));
  assert.ok(!/"authority_evidence_evaluation_states"/.test(json));
  assert.ok(!/"authority_evidence_evaluation_state_bases"/.test(json));
  assert.ok(!/"interpretation_basis"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
}

function fullState(
  overrides: Partial<AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateValue> = {}
): AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateValue {
  return {
    direct_declared_status: "NO_DECLARED_AUTHORITY",
    direct_provenance_path_presence: "NOT_PRESENT",
    delegated_provenance_path_presence: "NOT_PRESENT",
    active_source_basis_presence: "NOT_PRESENT",
    inactive_source_basis_presence: "NOT_PRESENT",
    inactive_delegation_presence: "NOT_PRESENT",
    contested_path_presence: "NOT_PRESENT",
    uncontested_path_presence: "NOT_PRESENT",
    direct_declaration_multiplicity: "NOT_MULTIPLE",
    delegated_path_multiplicity: "NOT_MULTIPLE",
    ...overrides,
  };
}

function entity(id: string): RealityEntity {
  return {
    id,
    project_id: PROJECT_ID,
    kind: "organization",
    label: id,
    created_at: TS,
    updated_at: TS,
  };
}

function mockProjectState(): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    project: { id: PROJECT_ID } as ProjectState["project"],
    reality_entities: [entity(ENTITY_A), entity(ENTITY_B), entity(ORG_B)],
  } as ProjectState;
}

function mockRequirementSet(): AttentionObservationCapabilityRequirementSetAssessment {
  return {
    planning_set: {} as never,
    specification: { requirements: [] },
    candidate_requirements: [
      {
        candidate_key: "cand",
        planning: {} as never,
        status: "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT",
        capability_requirement_basis: {
          observation_need_key: NEED_KEY,
          requirements: [
            {
              key: REQ_KEY,
              observation_need_key: NEED_KEY,
              capability_semantic_key: "inspect",
            },
          ],
        },
        has_explicit_capability_requirements: true,
        model_limitations: [],
      },
    ],
    has_explicit_capability_requirements: true,
    model_limitations: [],
  };
}

function buildBindingSet(
  bindings: {
    candidate_key: string;
    authority_holder_entity_id: string;
    authority_power: "AUTHORIZE_INTERVENTION" | "GOVERN_OBJECTIVE";
    governance_scope: GovernanceScope;
  }[]
): AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSetAssessment {
  return buildAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSet(
    {
      capability_requirement_set: mockRequirementSet(),
      project_state: mockProjectState(),
      specification: { bindings },
    }
  );
}

function defaultBindings() {
  return [
    {
      candidate_key: "cand",
      authority_holder_entity_id: ENTITY_A,
      authority_power: "AUTHORIZE_INTERVENTION" as const,
      governance_scope: SCOPE_A,
    },
  ];
}

function buildSet(
  policies: {
    authority_observation_context_binding_key: string;
    mappings: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationMapping[];
  }[],
  bindingSet?: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSetAssessment
) {
  const bindings = bindingSet ?? buildBindingSet(defaultBindings());
  return buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicySet(
    {
      authority_observation_context_binding_set: bindings,
      specification: { policies },
    }
  );
}

function bindingKey(
  bindingSet: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSetAssessment,
  index = 0
) {
  return bindingSet.candidate_assessments[0]!
    .authority_observation_context_bindings[index]!.key;
}

describe("GROUND-114 Authority Evidence Interpretation Policy", () => {
  describe("mapping semantics", () => {
    it("conventional-looking positive mapping is valid", () => {
      const bindingSet = buildBindingSet(defaultBindings());
      const set = buildSet(
        [
          {
            authority_observation_context_binding_key: bindingKey(bindingSet),
            mappings: [
              {
                authority_evidence_evaluation_state_value: fullState({
                  direct_declared_status: "DECLARED_AUTHORITY_PRESENT",
                  direct_provenance_path_presence: "PRESENT",
                  uncontested_path_presence: "PRESENT",
                }),
                interpretation: AS_POSITIVE,
              },
            ],
          },
        ],
        bindingSet
      );
      const policy =
        set.candidate_assessments[0]!.binding_policy_assessments[0]!
          .authority_evidence_evaluation_state_interpretation_policy!;
      assert.equal(policy.mappings.length, 1);
      assert.equal(policy.mappings[0]!.interpretation, AS_POSITIVE);
      assertNoCurrentAuthoritySemantics(set);
    });

    it("DECLARED_AUTHORITY_PRESENT → NEGATIVE unusual mapping is valid", () => {
      const bindingSet = buildBindingSet(defaultBindings());
      const state = fullState({
        direct_declared_status: "DECLARED_AUTHORITY_PRESENT",
        direct_provenance_path_presence: "PRESENT",
        uncontested_path_presence: "PRESENT",
      });
      const set = buildSet(
        [
          {
            authority_observation_context_binding_key: bindingKey(bindingSet),
            mappings: [
              {
                authority_evidence_evaluation_state_value: state,
                interpretation: AS_NEGATIVE,
              },
            ],
          },
        ],
        bindingSet
      );
      assert.equal(
        set.candidate_assessments[0]!.binding_policy_assessments[0]!
          .authority_evidence_evaluation_state_interpretation_policy!
          .mappings[0]!.interpretation,
        AS_NEGATIVE
      );
    });

    it("NO_DECLARED + delegated active source → POSITIVE unusual mapping", () => {
      const bindingSet = buildBindingSet([
        {
          candidate_key: "cand",
          authority_holder_entity_id: ORG_B,
          authority_power: "GOVERN_OBJECTIVE",
          governance_scope: SCOPE_OBJ,
        },
      ]);
      const set = buildSet(
        [
          {
            authority_observation_context_binding_key: bindingKey(bindingSet),
            mappings: [
              {
                authority_evidence_evaluation_state_value: fullState({
                  direct_declared_status: "NO_DECLARED_AUTHORITY",
                  delegated_provenance_path_presence: "PRESENT",
                  active_source_basis_presence: "PRESENT",
                  uncontested_path_presence: "PRESENT",
                }),
                interpretation: AS_POSITIVE,
              },
            ],
          },
        ],
        bindingSet
      );
      assert.equal(
        set.candidate_assessments[0]!.binding_policy_assessments[0]!
          .authority_evidence_evaluation_state_interpretation_policy!
          .mappings[0]!.interpretation,
        AS_POSITIVE
      );
    });

    it("contested evidence → POSITIVE is valid", () => {
      const bindingSet = buildBindingSet(defaultBindings());
      const set = buildSet(
        [
          {
            authority_observation_context_binding_key: bindingKey(bindingSet),
            mappings: [
              {
                authority_evidence_evaluation_state_value: fullState({
                  contested_path_presence: "PRESENT",
                }),
                interpretation: AS_POSITIVE,
              },
            ],
          },
        ],
        bindingSet
      );
      assert.equal(
        set.candidate_assessments[0]!.binding_policy_assessments[0]!
          .authority_evidence_evaluation_state_interpretation_policy!
          .mappings[0]!.interpretation,
        AS_POSITIVE
      );
    });

    it("rejects malformed partial source value", () => {
      assert.throws(
        () =>
          normalizeAuthorityEvidenceEvaluationStateValue({
            direct_declared_status: "DECLARED_AUTHORITY_PRESENT",
          } as never),
        /incomplete structured value/
      );
    });

    it("exact duplicate mapping normalizes", () => {
      const state = fullState({
        direct_declared_status: "DECLARED_AUTHORITY_PRESENT",
        direct_provenance_path_presence: "PRESENT",
      });
      const canonical = canonicalizeAuthorityEvidenceEvaluationStateInterpretationMappings(
        [
          { authority_evidence_evaluation_state_value: state, interpretation: AS_POSITIVE },
          { authority_evidence_evaluation_state_value: { ...state }, interpretation: AS_POSITIVE },
        ]
      );
      assert.equal(canonical.length, 1);
    });

    it("conflicting same-source mapping rejects", () => {
      const state = fullState({
        direct_declared_status: "DECLARED_AUTHORITY_PRESENT",
      });
      assert.throws(
        () =>
          canonicalizeAuthorityEvidenceEvaluationStateInterpretationMappings([
            { authority_evidence_evaluation_state_value: state, interpretation: AS_POSITIVE },
            { authority_evidence_evaluation_state_value: { ...state }, interpretation: AS_NEGATIVE },
          ]),
        /Conflicting/
      );
    });

    it("mapping order invariance", () => {
      const e1 = fullState({ direct_declared_status: "DECLARED_AUTHORITY_PRESENT" });
      const e2 = fullState({ direct_declared_status: "NO_DECLARED_AUTHORITY" });
      const a = canonicalizeAuthorityEvidenceEvaluationStateInterpretationMappings([
        { authority_evidence_evaluation_state_value: e1, interpretation: AS_POSITIVE },
        { authority_evidence_evaluation_state_value: e2, interpretation: AS_NEGATIVE },
      ]);
      const b = canonicalizeAuthorityEvidenceEvaluationStateInterpretationMappings([
        { authority_evidence_evaluation_state_value: e2, interpretation: AS_NEGATIVE },
        { authority_evidence_evaluation_state_value: e1, interpretation: AS_POSITIVE },
      ]);
      assert.deepEqual(a, b);
    });
  });

  describe("policy binding behavior", () => {
    it("explicit empty policy is PRESENT", () => {
      const bindingSet = buildBindingSet(defaultBindings());
      const set = buildSet(
        [
          {
            authority_observation_context_binding_key: bindingKey(bindingSet),
            mappings: [],
          },
        ],
        bindingSet
      );
      const assessment = set.candidate_assessments[0]!.binding_policy_assessments[0]!;
      assert.equal(
        assessment.status,
        "EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_PRESENT"
      );
      assert.ok(assessment.authority_evidence_evaluation_state_interpretation_policy);
      assert.equal(
        assessment.has_explicit_authority_evidence_evaluation_state_interpretation_policy,
        true
      );
      assert.equal(
        buildCanonicalAuthorityEvidenceEvaluationStateInterpretationMappingSetKey([]),
        EMPTY_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_MAPPING_SET
      );
    });

    it("no-policy binding assessment", () => {
      const set = buildSet([]);
      const assessment = set.candidate_assessments[0]!.binding_policy_assessments[0]!;
      assert.equal(
        assessment.status,
        "NO_EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(
        assessment.authority_evidence_evaluation_state_interpretation_policy,
        null
      );
      assert.equal(
        assessment.has_explicit_authority_evidence_evaluation_state_interpretation_policy,
        false
      );
    });

    it("mixed PRESENT / NO_POLICY / explicit-empty across bindings", () => {
      const bindingSet = buildBindingSet([
        {
          candidate_key: "cand",
          authority_holder_entity_id: ENTITY_A,
          authority_power: "AUTHORIZE_INTERVENTION",
          governance_scope: SCOPE_A,
        },
        {
          candidate_key: "cand",
          authority_holder_entity_id: ORG_B,
          authority_power: "GOVERN_OBJECTIVE",
          governance_scope: SCOPE_OBJ,
        },
        {
          candidate_key: "cand",
          authority_holder_entity_id: ENTITY_B,
          authority_power: "AUTHORIZE_INTERVENTION",
          governance_scope: SCOPE_A,
        },
      ]);
      const set = buildSet(
        [
          {
            authority_observation_context_binding_key: bindingKey(bindingSet, 0),
            mappings: [
              {
                authority_evidence_evaluation_state_value: fullState({
                  direct_declared_status: "DECLARED_AUTHORITY_PRESENT",
                }),
                interpretation: AS_POSITIVE,
              },
            ],
          },
          {
            authority_observation_context_binding_key: bindingKey(bindingSet, 1),
            mappings: [],
          },
        ],
        bindingSet
      );
      const candidate = set.candidate_assessments[0]!;
      assert.equal(
        candidate.status,
        "AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_BINDING_ASSESSMENTS_PRESENT"
      );
      assert.equal(candidate.binding_policy_assessments.length, 3);
      assert.equal(
        candidate.has_explicit_authority_evidence_evaluation_state_interpretation_policies,
        true
      );
      assert.equal(
        candidate.has_bindings_without_explicit_authority_evidence_evaluation_state_interpretation_policy,
        true
      );
    });

    it("unknown binding rejects", () => {
      const bindingSet = buildBindingSet(defaultBindings());
      assert.throws(
        () =>
          normalizeAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicySpecification(
            bindingSet,
            {
              policies: [
                {
                  authority_observation_context_binding_key: "missing-binding",
                  mappings: [],
                },
              ],
            }
          ),
        /not found/
      );
    });

    it("conflicting policies for same binding reject", () => {
      const bindingSet = buildBindingSet(defaultBindings());
      const key = bindingKey(bindingSet);
      const state = fullState({ direct_declared_status: "DECLARED_AUTHORITY_PRESENT" });
      assert.throws(
        () =>
          normalizeAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicySpecification(
            bindingSet,
            {
              policies: [
                {
                  authority_observation_context_binding_key: key,
                  mappings: [
                    {
                      authority_evidence_evaluation_state_value: state,
                      interpretation: AS_POSITIVE,
                    },
                  ],
                },
                {
                  authority_observation_context_binding_key: key,
                  mappings: [
                    {
                      authority_evidence_evaluation_state_value: state,
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

    it("policy identity changes when interpretation changes", () => {
      const bindingSet = buildBindingSet(defaultBindings());
      const key = bindingKey(bindingSet);
      const state = fullState({
        direct_declared_status: "DECLARED_AUTHORITY_PRESENT",
        direct_provenance_path_presence: "PRESENT",
      });
      const positive = buildSet(
        [
          {
            authority_observation_context_binding_key: key,
            mappings: [
              { authority_evidence_evaluation_state_value: state, interpretation: AS_POSITIVE },
            ],
          },
        ],
        bindingSet
      );
      const negative = buildSet(
        [
          {
            authority_observation_context_binding_key: key,
            mappings: [
              { authority_evidence_evaluation_state_value: state, interpretation: AS_NEGATIVE },
            ],
          },
        ],
        bindingSet
      );
      const positiveKey =
        positive.candidate_assessments[0]!.binding_policy_assessments[0]!
          .authority_evidence_evaluation_state_interpretation_policy!.key;
      const negativeKey =
        negative.candidate_assessments[0]!.binding_policy_assessments[0]!
          .authority_evidence_evaluation_state_interpretation_policy!.key;
      assert.notEqual(positiveKey, negativeKey);
    });

    it("determinism, deep-clone, input immutability", () => {
      const bindingSet = buildBindingSet(defaultBindings());
      const key = bindingKey(bindingSet);
      const beforeBindings = structuredClone(bindingSet);
      const spec = {
        policies: [
          {
            authority_observation_context_binding_key: key,
            mappings: [
              {
                authority_evidence_evaluation_state_value: fullState({
                  direct_declared_status: "DECLARED_AUTHORITY_PRESENT",
                }),
                interpretation: AS_POSITIVE,
              },
            ],
          },
        ],
      };
      const beforeSpec = structuredClone(spec);
      const a = buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicySet(
        {
          authority_observation_context_binding_set: bindingSet,
          specification: spec,
        }
      );
      const b = buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicySet(
        {
          authority_observation_context_binding_set: bindingSet,
          specification: spec,
        }
      );
      assert.deepEqual(a, b);
      assert.deepEqual(bindingSet, beforeBindings);
      assert.deepEqual(spec, beforeSpec);
    });
  });

  describe("static proofs / schema", () => {
    it("fixed model limitation order", () => {
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_MODEL_LIMITATIONS[0],
        "OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_INTERPRETATION_BASIS_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_MODEL_LIMITATIONS.at(
          -1
        ),
        "EXECUTION_NOT_MODELED"
      );
    });

    it("schema 0.1.24; 108 only; no current 113/111/ProjectState", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-evidence-evaluation-state-interpretation-policy-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-evidence-evaluation-state-interpretation-policy-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(/authority_observation_context_binding_set/.test(core));
      assert.ok(!/authority_evidence_evaluation_states/.test(core));
      assert.ok(!/authority_evidence_evaluation_state_bases/.test(core));
      assert.ok(!/buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateSet/.test(core));
      assert.ok(!/observation_context_authority_provenance_assessment_set/.test(core));
      assert.ok(!/assessAuthorityProvenance\s*\(/.test(core));
      assert.ok(!/assessDeclaredAuthority\s*\(/.test(core));
      assert.ok(!/Date\.now\(/.test(core));
      assert.ok(!/"AUTHORITY_PRESENT"/.test(src));
      assert.ok(!/"AUTHORIZED"/.test(src));
      assert.ok(!/"interpretation_basis"/.test(src));
      assert.ok(!/ANY_DIRECT_STATUS/.test(src));
      assert.ok(!/DEFAULT/.test(src));
    });
  });
});
