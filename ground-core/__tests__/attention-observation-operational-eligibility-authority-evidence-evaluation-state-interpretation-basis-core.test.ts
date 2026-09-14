/**
 * GROUND-115 — Observation Core LXIX / Authority Evidence Evaluation State
 * Interpretation Basis Foundation
 *
 * GROUND-113 current State + GROUND-114 explicit Policy
 * → exact Interpretation Basis (no canonical Authority State).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateSet,
} from "../reality/attention-observation-operational-eligibility-authority-evidence-evaluation-state-core.js";
import {
  buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicySet,
} from "../reality/attention-observation-operational-eligibility-authority-evidence-evaluation-state-interpretation-policy-core.js";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_MODEL_LIMITATIONS,
  buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisSet,
  findExactAuthorityEvidenceEvaluationStateInterpretationMapping,
} from "../reality/attention-observation-operational-eligibility-authority-evidence-evaluation-state-interpretation-basis-core.js";
import type {
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationMapping,
} from "../reality/attention-observation-operational-eligibility-authority-evidence-evaluation-state-interpretation-policy-types.js";
import type { AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateValue } from "../reality/attention-observation-operational-eligibility-authority-evidence-evaluation-state-types.js";
import {
  buildAttentionObservationOperationalEligibilityAuthorityEvaluationInstantSet,
} from "../reality/attention-observation-operational-eligibility-authority-evaluation-instant-core.js";
import {
  buildAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSet,
} from "../reality/attention-observation-operational-eligibility-authority-observation-context-binding-core.js";
import {
  buildAttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentSet,
} from "../reality/attention-observation-operational-eligibility-observation-context-authority-provenance-assessment-core.js";
import {
  buildAttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentSet,
} from "../reality/attention-observation-operational-eligibility-observation-context-declared-authority-assessment-core.js";
import type {
  AttentionObservationCapabilityRequirementSetAssessment,
} from "../reality/attention-observation-capability-requirement-types.js";
import type {
  AuthorityContestDeclaration,
  AuthorityDeclaration,
  AuthorityDelegationDeclaration,
  GovernanceScope,
  ProjectState,
  RealityEntity,
  RealityObjective,
} from "../types.js";
import { SCHEMA_VERSION } from "../types.js";
import { PROJECT_ID, validProjectStateV0124 } from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const NEED_KEY = "need";
const REQ_KEY = "attention-observation-capability-requirement|need|inspect";
const ENTITY_A = "f4010101-0101-4101-8101-010101010101";
const ORG_A = "f1010101-0101-4101-8101-010101010103";
const ORG_B = "f1010101-0101-4101-8101-010101010104";
const AUTH_DECL_A = "f4040404-0404-4404-8404-040404040401";
const AUTH_GOV_A = "f9090909-0909-4909-8909-090909090901";
const AUTH_GOV_B = "f9090909-0909-4909-8909-090909090902";
const DELEGATION_A = "fa0a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a01";
const CONTEST_A = "fb1b1b1b-1b1b-4b1b-8b1b-1b1b1b1b1b01";
const TS = "2026-08-24T10:00:00.000Z";
const FROM = "2026-08-24T00:00:00.000Z";
const AT = "2026-08-24T11:00:00.000Z";
const AT_LATER = "2026-08-24T12:00:00.000Z";

const AS_POSITIVE = "INTERPRET_AS_AUTHORITY_STATE_POSITIVE" as const;
const AS_NEGATIVE = "INTERPRET_AS_AUTHORITY_STATE_NEGATIVE" as const;

const SCOPE_A: GovernanceScope = {
  kind: "SUBJECT_STATE",
  subject_id: "subject-a",
  state_kind: "active",
};

const SCOPE_OBJ: GovernanceScope = {
  kind: "REALITY_OBJECTIVE",
  objective_id: "f5050505-0505-4505-8505-050505050901",
};

function assertNoCanonicalAuthoritySemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"AUTHORIZED"/.test(json));
  assert.ok(!/"UNAUTHORIZED"/.test(json));
  assert.ok(!/"AUTHORITY_PRESENT"/.test(json));
  assert.ok(!/"AUTHORITY_ABSENT"/.test(json));
  assert.ok(!/"AUTHORITY_POSITIVE"/.test(json));
  assert.ok(!/"AUTHORITY_NEGATIVE"/.test(json));
  assert.ok(!/"effective_authority"/.test(json));
  assert.ok(!/"UNRESOLVED_NO_EXPLICIT_AUTHORITY"/.test(json));
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

function objective(): RealityObjective {
  return {
    id: "f5050505-0505-4505-8505-050505050901",
    project_id: PROJECT_ID,
    kind: "STATE_TARGET",
    label: "objective-a",
    target_reference_condition_ids: [],
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "organization", entity_id: ORG_A },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
  };
}

function authorityDeclaration(
  overrides: Partial<AuthorityDeclaration> = {}
): AuthorityDeclaration {
  return {
    id: AUTH_DECL_A,
    project_id: PROJECT_ID,
    holder_entity_id: ENTITY_A,
    power: "AUTHORIZE_INTERVENTION",
    scope: SCOPE_A,
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "ops" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function authorityGovObjective(
  overrides: Partial<AuthorityDeclaration> = {}
): AuthorityDeclaration {
  return {
    id: AUTH_GOV_A,
    project_id: PROJECT_ID,
    holder_entity_id: ORG_A,
    power: "GOVERN_OBJECTIVE",
    scope: SCOPE_OBJ,
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "organization", entity_id: ORG_A },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function delegationToOrgB(
  overrides: Partial<AuthorityDelegationDeclaration> = {}
): AuthorityDelegationDeclaration {
  return {
    id: DELEGATION_A,
    project_id: PROJECT_ID,
    delegator_entity_id: ORG_A,
    delegatee_entity_id: ORG_B,
    power: "GOVERN_OBJECTIVE",
    scope: SCOPE_OBJ,
    source_authority_declaration_ids: [AUTH_GOV_A],
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "organization", entity_id: ORG_A },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function contestOnAuthority(
  overrides: Partial<AuthorityContestDeclaration> = {}
): AuthorityContestDeclaration {
  return {
    id: CONTEST_A,
    project_id: PROJECT_ID,
    contesting_entity_id: ENTITY_A,
    target: {
      kind: "AUTHORITY_DECLARATION",
      authority_declaration_id: AUTH_DECL_A,
    },
    note: null,
    valid_from: FROM,
    valid_until: null,
    declared_by: { kind: "human", label: "ops" },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function mockProjectState(options?: {
  authority_declarations?: AuthorityDeclaration[];
  authority_delegation_declarations?: AuthorityDelegationDeclaration[];
  authority_contest_declarations?: AuthorityContestDeclaration[];
}): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    project: { id: PROJECT_ID } as ProjectState["project"],
    reality_entities: [entity(ENTITY_A), entity(ORG_A), entity(ORG_B)],
    reality_objectives: [objective()],
    authority_declarations: options?.authority_declarations ?? [],
    authority_delegation_declarations:
      options?.authority_delegation_declarations ?? [],
    authority_contest_declarations:
      options?.authority_contest_declarations ?? [],
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

type BindingSpec = {
  candidate_key: string;
  authority_holder_entity_id: string;
  authority_power: AuthorityDeclaration["power"];
  governance_scope: GovernanceScope;
};

function defaultBindings(): BindingSpec[] {
  return [
    {
      candidate_key: "cand",
      authority_holder_entity_id: ENTITY_A,
      authority_power: "AUTHORIZE_INTERVENTION",
      governance_scope: SCOPE_A,
    },
  ];
}

function buildBindingSet(
  bindings: BindingSpec[],
  projectState = mockProjectState()
) {
  return buildAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSet(
    {
      capability_requirement_set: mockRequirementSet(),
      project_state: projectState,
      specification: { bindings },
    }
  );
}

function buildProvenanceSet(options?: {
  bindings?: BindingSpec[];
  evaluationInstants?: { candidate_key: string; authority_evaluation_at: string }[];
  projectState?: ProjectState;
}) {
  const projectState = options?.projectState ?? mockProjectState();
  const bindingSet = buildBindingSet(
    options?.bindings ?? defaultBindings(),
    projectState
  );
  const instantSet =
    buildAttentionObservationOperationalEligibilityAuthorityEvaluationInstantSet({
      authority_observation_context_binding_set: bindingSet,
      specification: {
        evaluation_instants: options?.evaluationInstants ?? [
          { candidate_key: "cand", authority_evaluation_at: AT },
        ],
      },
    });
  const declaredSet =
    buildAttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentSet(
      {
        project_state: projectState,
        authority_evaluation_instant_set: instantSet,
      }
    );
  return buildAttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentSet(
    {
      project_state: projectState,
      observation_context_declared_authority_assessment_set: declaredSet,
    }
  );
}

function buildEvidenceSet(options?: Parameters<typeof buildProvenanceSet>[0]) {
  const provenanceSet = buildProvenanceSet(options);
  return buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateSet(
    {
      observation_context_authority_provenance_assessment_set: provenanceSet,
    }
  );
}

function buildPolicySet(
  policies: {
    authority_observation_context_binding_key: string;
    mappings: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationMapping[];
  }[],
  options?: Parameters<typeof buildProvenanceSet>[0]
) {
  const projectState = options?.projectState ?? mockProjectState();
  const bindingSet = buildBindingSet(
    options?.bindings ?? defaultBindings(),
    projectState
  );
  return buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicySet(
    {
      authority_observation_context_binding_set: bindingSet,
      specification: { policies },
    }
  );
}

function buildBasisSet(
  policies: {
    authority_observation_context_binding_key: string;
    mappings: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationMapping[];
  }[],
  options?: Parameters<typeof buildProvenanceSet>[0]
) {
  const evidenceSet = buildEvidenceSet(options);
  const bindingSet = buildBindingSet(
    options?.bindings ?? defaultBindings(),
    options?.projectState ?? mockProjectState()
  );
  const policySet = buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicySet(
    {
      authority_observation_context_binding_set: bindingSet,
      specification: { policies },
    }
  );
  return buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisSet(
    {
      authority_evidence_evaluation_state_set: evidenceSet,
      authority_evidence_evaluation_state_interpretation_policy_set: policySet,
    }
  );
}

function bindingKey(
  bindings = defaultBindings(),
  index = 0,
  projectState = mockProjectState()
) {
  return buildBindingSet(bindings, projectState).candidate_assessments[0]!
    .authority_observation_context_bindings[index]!.key;
}

function firstCandidate(set: ReturnType<typeof buildBasisSet>) {
  return set.candidate_assessments[0]!;
}

function firstPerState(set: ReturnType<typeof buildBasisSet>) {
  return firstCandidate(set).interpretation_basis_assessments[0]!;
}

function firstState(set: ReturnType<typeof buildEvidenceSet>) {
  return set.candidate_assessments[0]!.authority_evidence_evaluation_states[0]!;
}

function stateForBinding(
  evidenceSet: ReturnType<typeof buildEvidenceSet>,
  bindingKeyValue: string
) {
  const candidate = evidenceSet.candidate_assessments[0]!;
  const basisByKey = new Map(
    candidate.authority_evidence_evaluation_state_bases.map((basis) => [
      basis.key,
      basis,
    ])
  );
  const state = candidate.authority_evidence_evaluation_states.find((entry) => {
    const basis = basisByKey.get(entry.authority_evidence_evaluation_state_basis_key);
    return basis?.authority_observation_context_binding_key === bindingKeyValue;
  });
  if (!state) {
    throw new Error(`missing State for binding ${bindingKeyValue}`);
  }
  return state;
}

describe("GROUND-115 Authority Evidence Interpretation Basis", () => {
  describe("exact mapping / unusual mappings", () => {
    it("conventional mapping → BASIS_PRESENT with exact interpretation", () => {
      const bindings = defaultBindings();
      const bk = bindingKey(bindings);
      const set = buildBasisSet(
        [
          {
            authority_observation_context_binding_key: bk,
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
        {
          bindings,
          projectState: mockProjectState({
            authority_declarations: [authorityDeclaration()],
          }),
        }
      );
      const perState = firstPerState(set);
      assert.equal(
        perState.status,
        "AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT"
      );
      assert.equal(
        perState.authority_evidence_evaluation_state_interpretation_basis!
          .interpretation,
        AS_POSITIVE
      );
      assert.equal(perState.has_authority_evidence_evaluation_state_interpretation_basis, true);
      assertNoCanonicalAuthoritySemantics(set);
    });

    it("DECLARED_AUTHORITY_PRESENT → NEGATIVE unusual mapping preserved", () => {
      const bindings = defaultBindings();
      const bk = bindingKey(bindings);
      const currentValue = fullState({
        direct_declared_status: "DECLARED_AUTHORITY_PRESENT",
        direct_provenance_path_presence: "PRESENT",
        uncontested_path_presence: "PRESENT",
      });
      const set = buildBasisSet(
        [
          {
            authority_observation_context_binding_key: bk,
            mappings: [
              {
                authority_evidence_evaluation_state_value: currentValue,
                interpretation: AS_NEGATIVE,
              },
            ],
          },
        ],
        {
          bindings,
          projectState: mockProjectState({
            authority_declarations: [authorityDeclaration()],
          }),
        }
      );
      assert.equal(
        firstPerState(set).authority_evidence_evaluation_state_interpretation_basis!
          .interpretation,
        AS_NEGATIVE
      );
    });

    it("NO_DECLARED + delegated active → POSITIVE unusual mapping preserved", () => {
      const bindings = [
        {
          candidate_key: "cand",
          authority_holder_entity_id: ORG_B,
          authority_power: "GOVERN_OBJECTIVE" as const,
          governance_scope: SCOPE_OBJ,
        },
      ];
      const bk = bindingKey(bindings);
      const set = buildBasisSet(
        [
          {
            authority_observation_context_binding_key: bk,
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
        {
          bindings,
          projectState: mockProjectState({
            authority_declarations: [authorityGovObjective()],
            authority_delegation_declarations: [delegationToOrgB()],
          }),
        }
      );
      assert.equal(
        firstPerState(set).authority_evidence_evaluation_state_interpretation_basis!
          .interpretation,
        AS_POSITIVE
      );
    });

    it("contested → POSITIVE and uncontested → NEGATIVE unusual mappings", () => {
      const bindings = defaultBindings();
      const contestedProject = mockProjectState({
        authority_declarations: [
          authorityDeclaration(),
          authorityDeclaration({
            id: "f4040404-0404-4404-8404-040404040402",
          }),
        ],
        authority_contest_declarations: [contestOnAuthority()],
      });
      const bk = bindingKey(bindings, 0, contestedProject);
      const contestedEvidence = buildEvidenceSet({
        bindings,
        projectState: contestedProject,
      });
      const contestedSet = buildBasisSet(
        [
          {
            authority_observation_context_binding_key: bk,
            mappings: [
              {
                authority_evidence_evaluation_state_value: stateForBinding(
                  contestedEvidence,
                  bk
                ).value,
                interpretation: AS_POSITIVE,
              },
            ],
          },
        ],
        { bindings, projectState: contestedProject }
      );
      assert.equal(
        firstPerState(contestedSet).authority_evidence_evaluation_state_interpretation_basis!
          .interpretation,
        AS_POSITIVE
      );

      const uncontestedProject = mockProjectState({ authority_declarations: [] });
      const uncontestedBk = bindingKey(bindings, 0, uncontestedProject);
      const uncontestedEvidence = buildEvidenceSet({
        bindings,
        projectState: uncontestedProject,
      });
      const uncontestedSet = buildBasisSet(
        [
          {
            authority_observation_context_binding_key: uncontestedBk,
            mappings: [
              {
                authority_evidence_evaluation_state_value: stateForBinding(
                  uncontestedEvidence,
                  uncontestedBk
                ).value,
                interpretation: AS_NEGATIVE,
              },
            ],
          },
        ],
        { bindings, projectState: uncontestedProject }
      );
      assert.equal(
        firstPerState(uncontestedSet).authority_evidence_evaluation_state_interpretation_basis!
          .interpretation,
        AS_NEGATIVE
      );
    });
  });

  describe("NO_POLICY / NO_MAPPING firewall", () => {
    it("NO_POLICY when binding has no explicit policy", () => {
      const set = buildBasisSet([], {
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const perState = firstPerState(set);
      assert.equal(
        perState.status,
        "NO_EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(perState.authority_evidence_evaluation_state_interpretation_basis, null);
      assert.equal(perState.has_authority_evidence_evaluation_state_interpretation_basis, false);
      assertNoCanonicalAuthoritySemantics(set);
    });

    it("explicit empty policy → NO_MAPPING not NO_POLICY", () => {
      const bindings = defaultBindings();
      const bk = bindingKey(bindings);
      const set = buildBasisSet(
        [{ authority_observation_context_binding_key: bk, mappings: [] }],
        {
          bindings,
          projectState: mockProjectState({
            authority_declarations: [authorityDeclaration()],
          }),
        }
      );
      const perState = firstPerState(set);
      assert.equal(
        perState.status,
        "NO_EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
      );
      assert.equal(perState.authority_evidence_evaluation_state_interpretation_basis, null);
      assert.equal(
        firstCandidate(set)
          .has_states_without_explicit_authority_evidence_interpretation_mapping,
        true
      );
      assert.equal(
        firstCandidate(set)
          .has_states_without_explicit_authority_evidence_interpretation_policy,
        false
      );
    });

    it("partial policy unmapped State → NO_MAPPING", () => {
      const bindings = defaultBindings();
      const bk = bindingKey(bindings);
      const set = buildBasisSet(
        [
          {
            authority_observation_context_binding_key: bk,
            mappings: [
              {
                authority_evidence_evaluation_state_value: fullState({
                  direct_declared_status: "NO_DECLARED_AUTHORITY",
                }),
                interpretation: AS_NEGATIVE,
              },
            ],
          },
        ],
        {
          bindings,
          projectState: mockProjectState({
            authority_declarations: [authorityDeclaration()],
          }),
        }
      );
      assert.equal(
        firstPerState(set).status,
        "NO_EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
      );
    });

    it("one-axis mismatch → NO_MAPPING", () => {
      const bindings = defaultBindings();
      const bk = bindingKey(bindings);
      const set = buildBasisSet(
        [
          {
            authority_observation_context_binding_key: bk,
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
        {
          bindings,
          projectState: mockProjectState({
            authority_declarations: [
              authorityDeclaration(),
              authorityDeclaration({
                id: "f4040404-0404-4404-8404-040404040402",
              }),
            ],
            authority_contest_declarations: [contestOnAuthority()],
          }),
        }
      );
      assert.equal(
        firstPerState(set).status,
        "NO_EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
      );
    });
  });

  describe("identity / lineage / cardinality", () => {
    it("deep-cloned current State Value matches equivalent mapping source", () => {
      const value = fullState({
        direct_declared_status: "DECLARED_AUTHORITY_PRESENT",
        direct_provenance_path_presence: "PRESENT",
        uncontested_path_presence: "PRESENT",
      });
      const cloned = structuredClone(value);
      const matched = findExactAuthorityEvidenceEvaluationStateInterpretationMapping(
        [{ authority_evidence_evaluation_state_value: cloned, interpretation: AS_POSITIVE }],
        value
      );
      assert.ok(matched);
      assert.equal(matched!.interpretation, AS_POSITIVE);
    });

    it("same structured value + different raw lineage → different Basis keys", () => {
      const bindings = defaultBindings();
      const bk = bindingKey(bindings);
      const mapping = {
        authority_observation_context_binding_key: bk,
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
      };
      const base = buildBasisSet([mapping], {
        bindings,
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const alt = buildBasisSet([mapping], {
        bindings,
        projectState: mockProjectState({
          authority_declarations: [
            authorityDeclaration({
              id: "f4040404-0404-4404-8404-040404040402",
            }),
          ],
        }),
      });
      const baseBasis =
        firstPerState(base).authority_evidence_evaluation_state_interpretation_basis!;
      const altBasis =
        firstPerState(alt).authority_evidence_evaluation_state_interpretation_basis!;
      assert.equal(
        baseBasis.authority_evidence_evaluation_state_value_canonical_key,
        altBasis.authority_evidence_evaluation_state_value_canonical_key
      );
      assert.notEqual(baseBasis.key, altBasis.key);
      assert.notEqual(
        baseBasis.authority_evidence_evaluation_state_key,
        altBasis.authority_evidence_evaluation_state_key
      );
    });

    it("evaluation instant change changes Basis identity, policy unchanged", () => {
      const bindings = defaultBindings();
      const bk = bindingKey(bindings);
      const mapping = {
        authority_observation_context_binding_key: bk,
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
      };
      const projectState = mockProjectState({
        authority_declarations: [authorityDeclaration()],
      });
      const early = buildBasisSet([mapping], {
        bindings,
        projectState,
        evaluationInstants: [
          { candidate_key: "cand", authority_evaluation_at: AT },
        ],
      });
      const later = buildBasisSet([mapping], {
        bindings,
        projectState,
        evaluationInstants: [
          { candidate_key: "cand", authority_evaluation_at: AT_LATER },
        ],
      });
      const earlyBasis =
        firstPerState(early).authority_evidence_evaluation_state_interpretation_basis!;
      const laterBasis =
        firstPerState(later).authority_evidence_evaluation_state_interpretation_basis!;
      assert.equal(
        earlyBasis.authority_evidence_evaluation_state_interpretation_policy_key,
        laterBasis.authority_evidence_evaluation_state_interpretation_policy_key
      );
      assert.notEqual(earlyBasis.key, laterBasis.key);
    });

    it("N current States → N per-State assessments", () => {
      const bindings = [
        {
          candidate_key: "cand",
          authority_holder_entity_id: ENTITY_A,
          authority_power: "AUTHORIZE_INTERVENTION" as const,
          governance_scope: SCOPE_A,
        },
        {
          candidate_key: "cand",
          authority_holder_entity_id: ORG_B,
          authority_power: "GOVERN_OBJECTIVE" as const,
          governance_scope: SCOPE_OBJ,
        },
      ];
      const projectState = mockProjectState({
        authority_declarations: [
          authorityDeclaration(),
          authorityGovObjective({ holder_entity_id: ORG_B }),
        ],
        authority_delegation_declarations: [delegationToOrgB()],
      });
      const evidenceSet = buildEvidenceSet({ bindings, projectState });
      const bk0 = bindingKey(bindings, 0, projectState);
      const bk1 = bindingKey(bindings, 1, projectState);
      const set = buildBasisSet(
        [
          {
            authority_observation_context_binding_key: bk0,
            mappings: [
              {
                authority_evidence_evaluation_state_value: stateForBinding(
                  evidenceSet,
                  bk0
                ).value,
                interpretation: AS_POSITIVE,
              },
            ],
          },
          {
            authority_observation_context_binding_key: bk1,
            mappings: [
              {
                authority_evidence_evaluation_state_value: stateForBinding(
                  evidenceSet,
                  bk1
                ).value,
                interpretation: AS_NEGATIVE,
              },
            ],
          },
        ],
        { bindings, projectState }
      );
      assert.equal(
        firstCandidate(set).interpretation_basis_assessments.length,
        2
      );
      assert.equal(
        firstCandidate(set).has_authority_evidence_evaluation_state_interpretation_bases,
        true
      );
      assert.equal(
        firstCandidate(set).has_states_without_explicit_authority_evidence_interpretation_policy,
        false
      );
    });

    it("mixed POSITIVE/NEGATIVE/NO_MAPPING/NO_POLICY across bindings", () => {
      const bindings = [
        {
          candidate_key: "cand",
          authority_holder_entity_id: ENTITY_A,
          authority_power: "AUTHORIZE_INTERVENTION" as const,
          governance_scope: SCOPE_A,
        },
        {
          candidate_key: "cand",
          authority_holder_entity_id: ORG_B,
          authority_power: "GOVERN_OBJECTIVE" as const,
          governance_scope: SCOPE_OBJ,
        },
      ];
      const projectState = mockProjectState({
        authority_declarations: [
          authorityDeclaration(),
          authorityGovObjective({ holder_entity_id: ORG_B }),
        ],
        authority_delegation_declarations: [delegationToOrgB()],
      });
      const evidenceSet = buildEvidenceSet({ bindings, projectState });
      const bk0 = bindingKey(bindings, 0, projectState);
      const bk1 = bindingKey(bindings, 1, projectState);
      const set = buildBasisSet(
        [
          {
            authority_observation_context_binding_key: bk0,
            mappings: [
              {
                authority_evidence_evaluation_state_value: stateForBinding(
                  evidenceSet,
                  bk0
                ).value,
                interpretation: AS_POSITIVE,
              },
            ],
          },
          {
            authority_observation_context_binding_key: bk1,
            mappings: [],
          },
        ],
        { bindings, projectState }
      );
      const assessments = firstCandidate(set).interpretation_basis_assessments;
      assert.equal(assessments.length, 2);
      const statuses = new Set(assessments.map((a) => a.status));
      assert.ok(
        statuses.has(
          "AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT"
        )
      );
      assert.ok(
        statuses.has(
          "NO_EXPLICIT_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
        )
      );
      assert.equal(
        firstCandidate(set).has_states_without_explicit_authority_evidence_interpretation_mapping,
        true
      );
    });
  });

  describe("outer behavior / rejects", () => {
    it("NO_INSTANT propagates with zero per-State assessments", () => {
      const evidenceSet = buildEvidenceSet({ evaluationInstants: [] });
      const policySet = buildPolicySet([]);
      const set =
        buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisSet(
          {
            authority_evidence_evaluation_state_set: evidenceSet,
            authority_evidence_evaluation_state_interpretation_policy_set:
              policySet,
          }
        );
      assert.equal(
        firstCandidate(set).status,
        "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED"
      );
      assert.equal(firstCandidate(set).interpretation_basis_assessments.length, 0);
    });

    it("rejects candidate count mismatch", () => {
      const evidenceSet = buildEvidenceSet({
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const policySet = buildPolicySet([]);
      const forged = structuredClone(policySet);
      forged.candidate_assessments = [];
      assert.throws(
        () =>
          buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisSet(
            {
              authority_evidence_evaluation_state_set: evidenceSet,
              authority_evidence_evaluation_state_interpretation_policy_set:
                forged,
            }
          ),
        /candidate count mismatch/
      );
    });

    it("rejects forged State value inconsistent with Basis", () => {
      const evidenceSet = buildEvidenceSet({
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const policySet = buildPolicySet([]);
      const forgedEvidence = structuredClone(evidenceSet);
      forgedEvidence.candidate_assessments[0]!.authority_evidence_evaluation_states[0]!.value =
        fullState({ direct_declared_status: "NO_DECLARED_AUTHORITY" });
      assert.throws(
        () =>
          buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisSet(
            {
              authority_evidence_evaluation_state_set: forgedEvidence,
              authority_evidence_evaluation_state_interpretation_policy_set:
                policySet,
            }
          ),
        /forged State value/
      );
    });
  });

  describe("determinism / immutability", () => {
    it("determinism, deep-clone, input immutability", () => {
      const bindings = defaultBindings();
      const bk = bindingKey(bindings);
      const evidenceSet = buildEvidenceSet({
        bindings,
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const policySet = buildPolicySet(
        [
          {
            authority_observation_context_binding_key: bk,
            mappings: [
              {
                authority_evidence_evaluation_state_value: firstState(
                  buildEvidenceSet({
                    bindings,
                    projectState: mockProjectState({
                      authority_declarations: [authorityDeclaration()],
                    }),
                  })
                ).value,
                interpretation: AS_POSITIVE,
              },
            ],
          },
        ],
        {
          bindings,
          projectState: mockProjectState({
            authority_declarations: [authorityDeclaration()],
          }),
        }
      );
      const beforeEvidence = structuredClone(evidenceSet);
      const beforePolicy = structuredClone(policySet);
      const a =
        buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisSet(
          {
            authority_evidence_evaluation_state_set: evidenceSet,
            authority_evidence_evaluation_state_interpretation_policy_set:
              policySet,
          }
        );
      const b =
        buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisSet(
          {
            authority_evidence_evaluation_state_set: evidenceSet,
            authority_evidence_evaluation_state_interpretation_policy_set:
              policySet,
          }
        );
      assert.deepEqual(a, b);
      assert.deepEqual(evidenceSet, beforeEvidence);
      assert.deepEqual(policySet, beforePolicy);
    });
  });

  describe("static proofs / schema", () => {
    it("fixed model limitation order", () => {
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_MODEL_LIMITATIONS[0],
        "OPERATIONAL_ELIGIBILITY_CANONICAL_AUTHORITY_STATE_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_MODEL_LIMITATIONS.at(
          -1
        ),
        "EXECUTION_NOT_MODELED"
      );
    });

    it("schema 0.1.24; 113+114 only; no direct 111/108/ProjectState", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-evidence-evaluation-state-interpretation-basis-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-evidence-evaluation-state-interpretation-basis-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(/authority_evidence_evaluation_state_set/.test(core));
      assert.ok(/authority_evidence_evaluation_state_interpretation_policy_set/.test(core));
      assert.ok(/buildAuthorityEvidenceEvaluationStateValueCanonicalKey/.test(core));
      assert.ok(!/assessAuthorityProvenance\s*\(/.test(core));
      assert.ok(!/assessDeclaredAuthority\s*\(/.test(core));
      assert.ok(!/buildAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSet/.test(core));
      assert.ok(!/observation_context_authority_provenance_assessment_set/.test(core));
      assert.ok(!/project_state/.test(core));
      assert.ok(!/Date\.now\(/.test(core));
      assert.ok(!/"AUTHORITY_PRESENT"/.test(src));
      assert.ok(!/"AUTHORIZED"/.test(src));
      assert.ok(!/"UNRESOLVED_NO_EXPLICIT_AUTHORITY"/.test(src));
      assert.ok(!/DEFAULT/.test(src));
      assert.ok(!/ANY_DIRECT_STATUS/.test(src));
    });
  });
});
