/**
 * GROUND-116 — Observation Core LXX / Canonical Observation-Context
 * AUTHORITY State Foundation
 *
 * Pure GROUND-115 normalization into canonical Authority State
 * (no evidence/policy rematching / no effective Authority / no OE).
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
  buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationBasisSet,
} from "../reality/attention-observation-operational-eligibility-authority-evidence-evaluation-state-interpretation-basis-core.js";
import {
  buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicySet,
} from "../reality/attention-observation-operational-eligibility-authority-evidence-evaluation-state-interpretation-policy-core.js";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_CANONICAL_AUTHORITY_STATE_MODEL_LIMITATIONS,
  assessAttentionCandidateObservationOperationalEligibilityCanonicalAuthorityState,
  buildAttentionObservationOperationalEligibilityCanonicalAuthorityStateSet,
  buildCanonicalAuthorityStateValueCanonicalKey,
  isAttentionObservationOperationalEligibilityCanonicalAuthorityStateResolved,
  isCanonicalAuthorityStateExplicitlyInterpretedPositive,
  mapAuthorityEvidenceEvaluationStateInterpretationBasisAssessmentToCanonicalAuthorityStateValue,
} from "../reality/attention-observation-operational-eligibility-canonical-authority-state-core.js";
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

function assertNoEffectiveAuthoritySemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"AUTHORIZED"/.test(json));
  assert.ok(!/"UNAUTHORIZED"/.test(json));
  assert.ok(!/"AUTHORITY_PRESENT"/.test(json));
  assert.ok(!/"AUTHORITY_ABSENT"/.test(json));
  assert.ok(!/"AUTHORITY_POSITIVE"/.test(json));
  assert.ok(!/"AUTHORITY_NEGATIVE"/.test(json));
  assert.ok(!/"effective_authority"/.test(json));
  assert.ok(!/"is_authorized"/.test(json));
  assert.ok(!/"has_authority"\s*:/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
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
  const policySet =
    buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationPolicySet(
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

function buildCanonicalSet(
  policies: {
    authority_observation_context_binding_key: string;
    mappings: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationMapping[];
  }[],
  options?: Parameters<typeof buildProvenanceSet>[0]
) {
  const basisSet = buildBasisSet(policies, options);
  return buildAttentionObservationOperationalEligibilityCanonicalAuthorityStateSet(
    {
      authority_evidence_evaluation_state_interpretation_basis_set: basisSet,
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

function firstCandidate(set: ReturnType<typeof buildCanonicalSet>) {
  return set.candidate_assessments[0]!;
}

function firstStateRecord(set: ReturnType<typeof buildCanonicalSet>) {
  return firstCandidate(set).canonical_authority_states[0]!;
}

function firstBasisRecord(set: ReturnType<typeof buildCanonicalSet>) {
  return firstCandidate(set).canonical_authority_state_bases[0]!;
}

describe("GROUND-116 Canonical Authority State", () => {
  describe("exact 115 → 116 mapping", () => {
    it("BASIS_PRESENT + POSITIVE → EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE", () => {
      const bindings = defaultBindings();
      const projectState = mockProjectState({
        authority_declarations: [authorityDeclaration()],
      });
      const bk = bindingKey(bindings, 0, projectState);
      const evidenceSet = buildEvidenceSet({ bindings, projectState });
      const set = buildCanonicalSet(
        [
          {
            authority_observation_context_binding_key: bk,
            mappings: [
              {
                authority_evidence_evaluation_state_value: stateForBinding(
                  evidenceSet,
                  bk
                ).value,
                interpretation: AS_POSITIVE,
              },
            ],
          },
        ],
        { bindings, projectState }
      );
      assert.equal(
        firstStateRecord(set).value,
        "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE"
      );
      assert.equal(firstCandidate(set).has_resolved_canonical_authority_states, true);
      assert.equal(
        firstCandidate(set).has_explicitly_interpreted_authority_positive_states,
        true
      );
      assertNoEffectiveAuthoritySemantics(set);
    });

    it("BASIS_PRESENT + NEGATIVE → EXPLICITLY_INTERPRETED_AUTHORITY_NEGATIVE", () => {
      const bindings = defaultBindings();
      const projectState = mockProjectState({
        authority_declarations: [authorityDeclaration()],
      });
      const bk = bindingKey(bindings, 0, projectState);
      const evidenceSet = buildEvidenceSet({ bindings, projectState });
      const set = buildCanonicalSet(
        [
          {
            authority_observation_context_binding_key: bk,
            mappings: [
              {
                authority_evidence_evaluation_state_value: stateForBinding(
                  evidenceSet,
                  bk
                ).value,
                interpretation: AS_NEGATIVE,
              },
            ],
          },
        ],
        { bindings, projectState }
      );
      assert.equal(
        firstStateRecord(set).value,
        "EXPLICITLY_INTERPRETED_AUTHORITY_NEGATIVE"
      );
      assert.equal(
        isAttentionObservationOperationalEligibilityCanonicalAuthorityStateResolved(
          firstStateRecord(set).value
        ),
        true
      );
      assert.equal(
        isCanonicalAuthorityStateExplicitlyInterpretedPositive(
          firstStateRecord(set).value
        ),
        false
      );
    });

    it("NO_POLICY → UNRESOLVED_NO_POLICY with State record present", () => {
      const set = buildCanonicalSet([], {
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      assert.equal(
        firstStateRecord(set).value,
        "UNRESOLVED_NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_POLICY"
      );
      assert.equal(firstCandidate(set).has_canonical_authority_states, true);
      assert.equal(firstCandidate(set).has_unresolved_canonical_authority_states, true);
      assert.equal(firstCandidate(set).has_resolved_canonical_authority_states, false);
      assert.equal(firstBasisRecord(set).authority_evidence_evaluation_state_interpretation_basis_key, null);
      assert.equal(firstBasisRecord(set).authority_evidence_evaluation_state_interpretation_policy_key, null);
    });

    it("NO_MAPPING → UNRESOLVED_NO_MAPPING with policy lineage preserved", () => {
      const bindings = defaultBindings();
      const projectState = mockProjectState({
        authority_declarations: [authorityDeclaration()],
      });
      const bk = bindingKey(bindings, 0, projectState);
      const set = buildCanonicalSet(
        [{ authority_observation_context_binding_key: bk, mappings: [] }],
        { bindings, projectState }
      );
      assert.equal(
        firstStateRecord(set).value,
        "UNRESOLVED_NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
      );
      assert.ok(
        firstBasisRecord(set).authority_evidence_evaluation_state_interpretation_policy_key!
          .length > 0
      );
      assert.equal(firstBasisRecord(set).authority_evidence_evaluation_state_interpretation_basis_key, null);
    });

    it("NO_POLICY != NO_MAPPING != negative", () => {
      const bindings = defaultBindings();
      const projectState = mockProjectState({
        authority_declarations: [authorityDeclaration()],
      });
      const bk = bindingKey(bindings, 0, projectState);
      const noPolicy = buildCanonicalSet([], { bindings, projectState });
      const noMapping = buildCanonicalSet(
        [{ authority_observation_context_binding_key: bk, mappings: [] }],
        { bindings, projectState }
      );
      assert.notEqual(
        firstStateRecord(noPolicy).value,
        firstStateRecord(noMapping).value
      );
      assert.ok(
        !firstStateRecord(noPolicy).value.includes("NEGATIVE") &&
          !firstStateRecord(noPolicy).value.includes("POSITIVE")
      );
      assert.ok(
        !firstStateRecord(noMapping).value.includes("NEGATIVE") &&
          !firstStateRecord(noMapping).value.includes("POSITIVE")
      );
    });
  });

  describe("unusual mapping preservation", () => {
    it("unusual direct-present→NEGATIVE Basis preserved", () => {
      const bindings = defaultBindings();
      const projectState = mockProjectState({
        authority_declarations: [authorityDeclaration()],
      });
      const bk = bindingKey(bindings, 0, projectState);
      const evidenceSet = buildEvidenceSet({ bindings, projectState });
      const set = buildCanonicalSet(
        [
          {
            authority_observation_context_binding_key: bk,
            mappings: [
              {
                authority_evidence_evaluation_state_value: stateForBinding(
                  evidenceSet,
                  bk
                ).value,
                interpretation: AS_NEGATIVE,
              },
            ],
          },
        ],
        { bindings, projectState }
      );
      assert.equal(
        firstStateRecord(set).value,
        "EXPLICITLY_INTERPRETED_AUTHORITY_NEGATIVE"
      );
    });

    it("unusual delegated/no-direct→POSITIVE Basis preserved", () => {
      const bindings = [
        {
          candidate_key: "cand",
          authority_holder_entity_id: ORG_B,
          authority_power: "GOVERN_OBJECTIVE" as const,
          governance_scope: SCOPE_OBJ,
        },
      ];
      const projectState = mockProjectState({
        authority_declarations: [authorityGovObjective()],
        authority_delegation_declarations: [delegationToOrgB()],
      });
      const bk = bindingKey(bindings, 0, projectState);
      const evidenceSet = buildEvidenceSet({ bindings, projectState });
      const set = buildCanonicalSet(
        [
          {
            authority_observation_context_binding_key: bk,
            mappings: [
              {
                authority_evidence_evaluation_state_value: stateForBinding(
                  evidenceSet,
                  bk
                ).value,
                interpretation: AS_POSITIVE,
              },
            ],
          },
        ],
        { bindings, projectState }
      );
      assert.equal(
        firstStateRecord(set).value,
        "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE"
      );
    });
  });

  describe("identity / cardinality / outer behavior", () => {
    it("N 115 assessments → N canonical States + Bases", () => {
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
      const set = buildCanonicalSet(
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
      assert.equal(firstCandidate(set).canonical_authority_states.length, 2);
      assert.equal(firstCandidate(set).canonical_authority_state_bases.length, 2);
      assert.equal(firstCandidate(set).has_explicitly_interpreted_authority_positive_states, true);
      assert.equal(firstCandidate(set).has_unresolved_canonical_authority_states, true);
    });

    it("same canonical value + different lineage → different State/Basis keys", () => {
      const bindings = defaultBindings();
      const mapping = (bk: string, evidenceSet: ReturnType<typeof buildEvidenceSet>) => [
        {
          authority_observation_context_binding_key: bk,
          mappings: [
            {
              authority_evidence_evaluation_state_value: stateForBinding(
                evidenceSet,
                bk
              ).value,
              interpretation: AS_POSITIVE,
            },
          ],
        },
      ];
      const baseProject = mockProjectState({
        authority_declarations: [authorityDeclaration()],
      });
      const altProject = mockProjectState({
        authority_declarations: [
          authorityDeclaration({
            id: "f4040404-0404-4404-8404-040404040402",
          }),
        ],
      });
      const bkBase = bindingKey(bindings, 0, baseProject);
      const bkAlt = bindingKey(bindings, 0, altProject);
      const evidenceBase = buildEvidenceSet({ bindings, projectState: baseProject });
      const evidenceAlt = buildEvidenceSet({ bindings, projectState: altProject });
      const base = buildCanonicalSet(mapping(bkBase, evidenceBase), {
        bindings,
        projectState: baseProject,
      });
      const alt = buildCanonicalSet(mapping(bkAlt, evidenceAlt), {
        bindings,
        projectState: altProject,
      });
      assert.equal(firstStateRecord(base).value, firstStateRecord(alt).value);
      assert.notEqual(firstStateRecord(base).key, firstStateRecord(alt).key);
      assert.notEqual(firstBasisRecord(base).key, firstBasisRecord(alt).key);
    });

    it("evaluation instant change changes State identity", () => {
      const bindings = defaultBindings();
      const projectState = mockProjectState({
        authority_declarations: [authorityDeclaration()],
      });
      const bk = bindingKey(bindings, 0, projectState);
      const evidenceEarly = buildEvidenceSet({
        bindings,
        projectState,
        evaluationInstants: [
          { candidate_key: "cand", authority_evaluation_at: AT },
        ],
      });
      const evidenceLater = buildEvidenceSet({
        bindings,
        projectState,
        evaluationInstants: [
          { candidate_key: "cand", authority_evaluation_at: AT_LATER },
        ],
      });
      const mapping = (evidenceSet: ReturnType<typeof buildEvidenceSet>) => [
        {
          authority_observation_context_binding_key: bk,
          mappings: [
            {
              authority_evidence_evaluation_state_value: stateForBinding(
                evidenceSet,
                bk
              ).value,
              interpretation: AS_POSITIVE,
            },
          ],
        },
      ];
      const early = buildCanonicalSet(mapping(evidenceEarly), {
        bindings,
        projectState,
        evaluationInstants: [
          { candidate_key: "cand", authority_evaluation_at: AT },
        ],
      });
      const later = buildCanonicalSet(mapping(evidenceLater), {
        bindings,
        projectState,
        evaluationInstants: [
          { candidate_key: "cand", authority_evaluation_at: AT_LATER },
        ],
      });
      assert.notEqual(firstStateRecord(early).key, firstStateRecord(later).key);
    });

    it("outer NO_INSTANT produces no canonical States", () => {
      const basisSet = buildBasisSet([], { evaluationInstants: [] });
      const set = buildAttentionObservationOperationalEligibilityCanonicalAuthorityStateSet(
        {
          authority_evidence_evaluation_state_interpretation_basis_set: basisSet,
        }
      );
      assert.equal(
        firstCandidate(set).status,
        "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED"
      );
      assert.equal(firstCandidate(set).canonical_authority_states.length, 0);
    });
  });

  describe("validation / rejects", () => {
    it("rejects BASIS_PRESENT + null Basis", () => {
      const basisSet = buildBasisSet([], {
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const forged = structuredClone(basisSet);
      const perState =
        forged.candidate_assessments[0]!.interpretation_basis_assessments[0]!;
      perState.status =
        "AUTHORITY_EVIDENCE_EVALUATION_STATE_INTERPRETATION_BASIS_PRESENT";
      perState.authority_evidence_evaluation_state_interpretation_basis = null;
      perState.has_authority_evidence_evaluation_state_interpretation_basis = true;
      assert.throws(
        () =>
          buildAttentionObservationOperationalEligibilityCanonicalAuthorityStateSet(
            {
              authority_evidence_evaluation_state_interpretation_basis_set:
                forged,
            }
          ),
        /requires non-null basis/
      );
    });

    it("rejects NO_POLICY + non-null Basis", () => {
      const basisSet = buildBasisSet([], {
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const forged = structuredClone(basisSet);
      const perState =
        forged.candidate_assessments[0]!.interpretation_basis_assessments[0]!;
      const fakeBasis = {
        key: "fake-basis",
        interpretation: AS_POSITIVE,
        authority_evidence_evaluation_state_key:
          perState.authority_evidence_evaluation_state.key,
        authority_evidence_evaluation_state_interpretation_policy_key: "policy",
      };
      perState.authority_evidence_evaluation_state_interpretation_basis =
        fakeBasis as never;
      assert.throws(
        () =>
          mapAuthorityEvidenceEvaluationStateInterpretationBasisAssessmentToCanonicalAuthorityStateValue(
            perState
          ),
        /non-present status requires null basis/
      );
    });
  });

  describe("resolved helper / determinism / static proofs", () => {
    it("resolved helper mapping", () => {
      assert.equal(
        isAttentionObservationOperationalEligibilityCanonicalAuthorityStateResolved(
          "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE"
        ),
        true
      );
      assert.equal(
        isAttentionObservationOperationalEligibilityCanonicalAuthorityStateResolved(
          "EXPLICITLY_INTERPRETED_AUTHORITY_NEGATIVE"
        ),
        true
      );
      assert.equal(
        isAttentionObservationOperationalEligibilityCanonicalAuthorityStateResolved(
          "UNRESOLVED_NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_POLICY"
        ),
        false
      );
      assert.equal(
        isAttentionObservationOperationalEligibilityCanonicalAuthorityStateResolved(
          "UNRESOLVED_NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
        ),
        false
      );
    });

    it("canonical value identity helper is deterministic", () => {
      assert.equal(
        buildCanonicalAuthorityStateValueCanonicalKey(
          "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE"
        ),
        "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE"
      );
    });

    it("determinism, deep-clone, input immutability", () => {
      const basisSet = buildBasisSet([], {
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const before = structuredClone(basisSet);
      const a = buildAttentionObservationOperationalEligibilityCanonicalAuthorityStateSet(
        {
          authority_evidence_evaluation_state_interpretation_basis_set: basisSet,
        }
      );
      const b = buildAttentionObservationOperationalEligibilityCanonicalAuthorityStateSet(
        {
          authority_evidence_evaluation_state_interpretation_basis_set: basisSet,
        }
      );
      assert.deepEqual(a, b);
      assert.deepEqual(basisSet, before);
    });

    it("schema 0.1.24; 115 only; no direct 113/114/111", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-canonical-authority-state-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-canonical-authority-state-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(
        /authority_evidence_evaluation_state_interpretation_basis_set/.test(core)
      );
      assert.ok(
        !/authority_evidence_evaluation_state_set/.test(core)
      );
      assert.ok(
        !/authority_evidence_evaluation_state_interpretation_policy_set/.test(
          core
        )
      );
      assert.ok(!/assessAuthorityProvenance\s*\(/.test(core));
      assert.ok(!/buildAuthorityEvidenceEvaluationStateValueCanonicalKey/.test(core));
      assert.ok(!/findExactAuthorityEvidenceEvaluationStateInterpretationMapping/.test(core));
      assert.ok(!/DECLARED_AUTHORITY_PRESENT/.test(core));
      assert.ok(!/Date\.now\(/.test(core));
      assert.ok(!/"AUTHORIZED"/.test(src));
      assert.ok(!/"AUTHORITY_PRESENT"/.test(src));
      assert.ok(!/DEFAULT/.test(src));
    });

    it("fixed model limitation order", () => {
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_CANONICAL_AUTHORITY_STATE_MODEL_LIMITATIONS[0],
        "EFFECTIVE_AUTHORITY_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_CANONICAL_AUTHORITY_STATE_MODEL_LIMITATIONS.at(
          -1
        ),
        "EXECUTION_NOT_MODELED"
      );
    });
  });
});
