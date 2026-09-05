/**
 * GROUND-117 — Observation Core LXXI / Operational Eligibility AUTHORITY
 * Source Bridge Foundation
 *
 * Pure GROUND-116 projection (raw canonical Authority State preserved;
 * 0..many sources per Candidate; no polarity / acceptance / aggregation /
 * effective Authority / OE result).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_MODEL_LIMITATIONS,
  assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceBridge,
  attentionObservationOperationalEligibilityAuthoritySourceKey,
  buildAttentionObservationOperationalEligibilityAuthoritySourceBridgeSet,
} from "../reality/attention-observation-operational-eligibility-authority-source-bridge-core.js";
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
  buildAttentionObservationOperationalEligibilityCanonicalAuthorityStateSet,
} from "../reality/attention-observation-operational-eligibility-canonical-authority-state-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityCanonicalAuthorityStateAssessment,
} from "../reality/attention-observation-operational-eligibility-canonical-authority-state-types.js";
import type {
  AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationMapping,
} from "../reality/attention-observation-operational-eligibility-authority-evidence-evaluation-state-interpretation-policy-types.js";
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

function deepClone<T>(value: T): T {
  return structuredClone(value);
}

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"AUTHORIZED"/.test(json));
  assert.ok(!/"UNAUTHORIZED"/.test(json));
  assert.ok(!/"AUTHORITY_POSITIVE"/.test(json));
  assert.ok(!/"AUTHORITY_NEGATIVE"/.test(json));
  assert.ok(!/"AUTHORITY_RESOLVED"/.test(json));
  assert.ok(!/"AUTHORITY_UNRESOLVED"/.test(json));
  assert.ok(!/"CANDIDATE_AUTHORITY_SOURCE_POSITIVE"/.test(json));
  assert.ok(!/"CANDIDATE_AUTHORITY_SOURCE_NEGATIVE"/.test(json));
  assert.ok(!/"ACCEPTED"/.test(json));
  assert.ok(!/"REJECTED"/.test(json));
  assert.ok(!/"MATCH"/.test(json));
  assert.ok(!/"NO_MATCH"/.test(json));
  assert.ok(!/"RESOLVED"/.test(json) || /UNRESOLVED/.test(json));
  assert.ok(!/"effective_authority"/.test(json));
  assert.ok(!/"is_authorized"/.test(json));
  assert.ok(!/"has_authority"\s*:/.test(json));
  assert.ok(!/"permission_state"\s*:/.test(json));
  assert.ok(!/"capability_state"\s*:/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"majority"/.test(json));
  assert.ok(!/"veto"/.test(json));
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
    id: "fb1b1b1b-1b1b-4b1b-8b1b-1b1b1b1b1b01",
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

function buildBridgeSet(
  policies: {
    authority_observation_context_binding_key: string;
    mappings: AttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateInterpretationMapping[];
  }[],
  options?: Parameters<typeof buildProvenanceSet>[0]
) {
  const canonicalSet = buildCanonicalSet(policies, options);
  return buildAttentionObservationOperationalEligibilityAuthoritySourceBridgeSet(
    { canonical_authority_state_set: canonicalSet }
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

function firstCandidate(set: ReturnType<typeof buildBridgeSet>) {
  return set.candidate_assessments[0]!;
}

function firstSource(set: ReturnType<typeof buildBridgeSet>) {
  return firstCandidate(set).authority_sources[0]!;
}

describe("GROUND-117 Operational Eligibility AUTHORITY Source Bridge", () => {
  describe("all four canonical values bridge to SOURCE_PRESENT", () => {
    it("POSITIVE → one SOURCE_PRESENT AUTHORITY source", () => {
      const bindings = defaultBindings();
      const projectState = mockProjectState({
        authority_declarations: [authorityDeclaration()],
      });
      const bk = bindingKey(bindings, 0, projectState);
      const evidenceSet = buildEvidenceSet({ bindings, projectState });
      const set = buildBridgeSet(
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
      assert.equal(firstCandidate(set).status, "AUTHORITY_SOURCES_PRESENT");
      assert.equal(firstCandidate(set).authority_sources.length, 1);
      assert.equal(firstSource(set).source_presence, "SOURCE_PRESENT");
      assert.equal(
        firstSource(set).canonical_authority_state_value,
        "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE"
      );
      assert.equal(firstCandidate(set).has_authority_sources, true);
      assert.equal(
        firstCandidate(set).has_positive_canonical_authority_state_sources,
        true
      );
      assertNoForbiddenSemantics(set);
    });

    it("NEGATIVE → one SOURCE_PRESENT AUTHORITY source (not filtered)", () => {
      const bindings = defaultBindings();
      const projectState = mockProjectState({
        authority_declarations: [authorityDeclaration()],
      });
      const bk = bindingKey(bindings, 0, projectState);
      const evidenceSet = buildEvidenceSet({ bindings, projectState });
      const set = buildBridgeSet(
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
      assert.equal(firstSource(set).source_presence, "SOURCE_PRESENT");
      assert.equal(
        firstSource(set).canonical_authority_state_value,
        "EXPLICITLY_INTERPRETED_AUTHORITY_NEGATIVE"
      );
      assert.equal(firstCandidate(set).has_authority_sources, true);
      assert.equal(
        firstCandidate(set).has_negative_canonical_authority_state_sources,
        true
      );
      assert.equal(
        firstCandidate(set).has_positive_canonical_authority_state_sources,
        false
      );
    });

    it("NO_POLICY unresolved → one SOURCE_PRESENT AUTHORITY source", () => {
      const set = buildBridgeSet([], {
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      assert.equal(firstSource(set).source_presence, "SOURCE_PRESENT");
      assert.equal(
        firstSource(set).canonical_authority_state_value,
        "UNRESOLVED_NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_POLICY"
      );
      assert.equal(
        firstCandidate(set).has_unresolved_canonical_authority_state_sources,
        true
      );
    });

    it("NO_MAPPING unresolved → one SOURCE_PRESENT AUTHORITY source", () => {
      const bindings = defaultBindings();
      const projectState = mockProjectState({
        authority_declarations: [authorityDeclaration()],
      });
      const bk = bindingKey(bindings, 0, projectState);
      const set = buildBridgeSet(
        [{ authority_observation_context_binding_key: bk, mappings: [] }],
        { bindings, projectState }
      );
      assert.equal(firstSource(set).source_presence, "SOURCE_PRESENT");
      assert.equal(
        firstSource(set).canonical_authority_state_value,
        "UNRESOLVED_NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
      );
    });
  });

  describe("cardinality / mixed sources / no aggregation", () => {
    it("mixed positive + negative + unresolved across bindings → independent sources", () => {
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
      const bridgeSet = buildBridgeSet(
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
      const sources = bridgeSet.candidate_assessments[0]!.authority_sources;
      assert.equal(sources.length, 2);
      assert.equal(
        sources.filter(
          (s) =>
            s.canonical_authority_state_value ===
            "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE"
        ).length,
        1
      );
      assert.equal(
        sources.filter(
          (s) =>
            s.canonical_authority_state_value ===
            "EXPLICITLY_INTERPRETED_AUTHORITY_NEGATIVE"
        ).length,
        1
      );
      assert.equal(bridgeSet.has_authority_sources, true);
      assert.equal(
        bridgeSet.has_positive_canonical_authority_state_sources,
        true
      );
      assert.equal(
        bridgeSet.has_negative_canonical_authority_state_sources,
        true
      );
      assert.equal(
        new Set(sources.map((s) => s.authority_observation_context_binding_key))
          .size,
        2
      );
    });

    it("positive + negative + unresolved coexist without veto", () => {
      const bindings = defaultBindings();
      const projectState = mockProjectState({
        authority_declarations: [authorityDeclaration()],
      });
      const bk = bindingKey(bindings, 0, projectState);
      const evidenceSet = buildEvidenceSet({ bindings, projectState });
      const noPolicy = buildBridgeSet([], { bindings, projectState });
      const negative = buildBridgeSet(
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
      assert.equal(noPolicy.candidate_assessments[0]!.has_authority_sources, true);
      assert.equal(negative.candidate_assessments[0]!.has_authority_sources, true);
      assert.equal(
        negative.candidate_assessments[0]!
          .has_negative_canonical_authority_state_sources,
        true
      );
      assert.equal(
        noPolicy.candidate_assessments[0]!
          .has_unresolved_canonical_authority_state_sources,
        true
      );
    });

    it("N canonical States → N sources (1:1)", () => {
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
      const canonicalSet = buildCanonicalSet(
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
      const bridgeSet =
        buildAttentionObservationOperationalEligibilityAuthoritySourceBridgeSet(
          { canonical_authority_state_set: canonicalSet }
        );
      assert.equal(
        bridgeSet.candidate_assessments[0]!.authority_sources.length,
        canonicalSet.candidate_assessments[0]!.canonical_authority_states.length
      );
    });
  });

  describe("source identity changes", () => {
    it("same canonical value + different Basis lineage → different source keys", () => {
      const bindings = defaultBindings();
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
      const base = buildBridgeSet(mapping(bkBase, evidenceBase), {
        bindings,
        projectState: baseProject,
      });
      const alt = buildBridgeSet(mapping(bkAlt, evidenceAlt), {
        bindings,
        projectState: altProject,
      });
      assert.equal(
        firstSource(base).canonical_authority_state_value,
        firstSource(alt).canonical_authority_state_value
      );
      assert.notEqual(firstSource(base).key, firstSource(alt).key);
      assert.notEqual(
        firstSource(base).canonical_authority_state_basis_key,
        firstSource(alt).canonical_authority_state_basis_key
      );
    });

    it("evaluation instant change → different source key", () => {
      const bindings = defaultBindings();
      const projectState = mockProjectState({
        authority_declarations: [authorityDeclaration()],
      });
      const bk = bindingKey(bindings, 0, projectState);
      const evidenceAt = buildEvidenceSet({
        bindings,
        projectState,
        evaluationInstants: [{ candidate_key: "cand", authority_evaluation_at: AT }],
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
      const at = buildBridgeSet(mapping(evidenceAt), {
        bindings,
        projectState,
        evaluationInstants: [{ candidate_key: "cand", authority_evaluation_at: AT }],
      });
      const later = buildBridgeSet(mapping(evidenceLater), {
        bindings,
        projectState,
        evaluationInstants: [
          { candidate_key: "cand", authority_evaluation_at: AT_LATER },
        ],
      });
      assert.notEqual(firstSource(at).key, firstSource(later).key);
    });

    it("unresolved cause change → different source key", () => {
      const bindings = defaultBindings();
      const projectState = mockProjectState({
        authority_declarations: [authorityDeclaration()],
      });
      const bk = bindingKey(bindings, 0, projectState);
      const noPolicy = buildBridgeSet([], { bindings, projectState });
      const noMapping = buildBridgeSet(
        [{ authority_observation_context_binding_key: bk, mappings: [] }],
        { bindings, projectState }
      );
      assert.notEqual(firstSource(noPolicy).key, firstSource(noMapping).key);
      assert.notEqual(
        firstSource(noPolicy).canonical_authority_state_value,
        firstSource(noMapping).canonical_authority_state_value
      );
    });
  });

  describe("outer statuses", () => {
    it("no planning / Requirements / bindings / instant → no sources", () => {
      const canonicalSet = buildCanonicalSet([]);
      for (const status of [
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
        "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED",
      ] as const) {
        const candidate = {
          ...canonicalSet.candidate_assessments[0]!,
          status,
          canonical_authority_state_bases: [],
          canonical_authority_states: [],
          has_canonical_authority_states: false,
          has_resolved_canonical_authority_states: false,
          has_unresolved_canonical_authority_states: false,
          has_explicitly_interpreted_authority_positive_states: false,
          has_explicitly_interpreted_authority_negative_states: false,
        } as AttentionCandidateObservationOperationalEligibilityCanonicalAuthorityStateAssessment;
        const assessment =
          assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceBridge(
            candidate
          );
        assert.equal(assessment.status, status);
        assert.deepEqual(assessment.authority_sources, []);
        assert.equal(assessment.has_authority_sources, false);
      }
    });
  });

  describe("malformed input rejection", () => {
    it("missing State Basis rejects", () => {
      const set = buildCanonicalSet([], {
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const candidate = deepClone(set.candidate_assessments[0]!);
      candidate.canonical_authority_state_bases = [];
      assert.throws(() =>
        assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceBridge(
          candidate
        )
      );
    });

    it("State/Basis value mismatch rejects", () => {
      const set = buildCanonicalSet([], {
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const candidate = deepClone(set.candidate_assessments[0]!);
      candidate.canonical_authority_states[0]!.value =
        "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE";
      assert.throws(() =>
        assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceBridge(
          candidate
        )
      );
    });

    it("non-applicable candidate containing States rejects", () => {
      const set = buildCanonicalSet([], {
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const candidate = deepClone(set.candidate_assessments[0]!);
      candidate.status = "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS";
      assert.throws(() =>
        assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceBridge(
          candidate
        )
      );
    });

    it("STATES_PRESENT with zero States rejects", () => {
      const set = buildCanonicalSet([], {
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const candidate = deepClone(set.candidate_assessments[0]!);
      candidate.canonical_authority_states = [];
      candidate.canonical_authority_state_bases = [];
      candidate.has_canonical_authority_states = false;
      assert.throws(() =>
        assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceBridge(
          candidate
        )
      );
    });
  });

  describe("determinism / immutability / static boundaries", () => {
    it("input immutability, deep-clone equivalence, determinism", () => {
      const canonicalSet = buildCanonicalSet([], {
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const input = { canonical_authority_state_set: canonicalSet };
      const before = deepClone(input);
      const a =
        buildAttentionObservationOperationalEligibilityAuthoritySourceBridgeSet(
          input
        );
      const b =
        buildAttentionObservationOperationalEligibilityAuthoritySourceBridgeSet(
          input
        );
      const c =
        buildAttentionObservationOperationalEligibilityAuthoritySourceBridgeSet(
          deepClone(input)
        );
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
    });

    it("SOURCE_PRESENT != positive Authority (static proof)", () => {
      const set = buildBridgeSet([], {
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const source = firstSource(set);
      assert.equal(source.source_presence, "SOURCE_PRESENT");
      assert.ok(
        source.canonical_authority_state_value.includes("UNRESOLVED")
      );
      assert.equal(
        source.source_presence === "SOURCE_PRESENT" &&
          source.canonical_authority_state_value ===
            "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE",
        false
      );
    });

    it("schema 0.1.24; GROUND-116 only; no direct 115/114/113/ProjectState", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      assert.deepEqual(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_BRIDGE_MODEL_LIMITATIONS.slice(
          0,
          3
        ),
        [
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED",
        ]
      );

      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-source-bridge-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-source-bridge-types.ts"
        ),
        "utf8"
      );
      const stripComments = (s: string) =>
        s
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/\/\/.*$/gm, "");
      const src = stripComments(core + types);
      const coreCode = stripComments(core);

      assert.ok(
        /attention-observation-operational-eligibility-canonical-authority-state/.test(
          core
        )
      );
      assert.ok(
        !/from ["'].*authority-evidence-evaluation-state-interpretation-basis-core/.test(
          src
        )
      );
      assert.ok(
        !/from ["'].*authority-evidence-evaluation-state-interpretation-policy-core/.test(
          src
        )
      );
      assert.ok(
        !/from ["'].*authority-evidence-evaluation-state-core/.test(src)
      );
      assert.ok(
        !/from ["'].*observation-context-authority-provenance/.test(src)
      );
      assert.ok(
        !/from ["'].*permission-state-source/.test(src)
      );
      assert.ok(
        !/from ["'].*capability-state-source/.test(src)
      );
      assert.ok(!/import.*ProjectState/.test(coreCode));
      assert.ok(!/Date\.now\(/.test(coreCode));
      assert.ok(!/new Date\(/.test(coreCode));
      assert.ok(!/performance\.now\(/.test(coreCode));
      assert.ok(!/\bsaveProject\s*\(/.test(coreCode));
      assert.ok(!/\bapplyPatch\s*\(/.test(coreCode));
      assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(src));
      assert.ok(!/"can_execute"/.test(src));
      assert.ok(!/"ACCEPTED"/.test(src));
      assert.ok(!/"REJECTED"/.test(src));
      assert.ok(!/\bif\s*\(\s*resolved/.test(coreCode));
      assert.ok(!/\bif\s*\(\s*positive/.test(coreCode));
      assert.ok(!/\bfilter\(/.test(coreCode));
      assert.ok(
        attentionObservationOperationalEligibilityAuthoritySourceKey({
          candidate_key: "cand",
          observation_need_key: NEED_KEY,
          capability_requirement_set_key: "set",
          authority_observation_context_binding_key: "bk",
          authority_holder_entity_id: ENTITY_A,
          authority_power: "AUTHORIZE_INTERVENTION",
          governance_scope_key: "scope",
          authority_evaluation_instant_key: "instant",
          authority_evaluation_at: AT,
          canonical_authority_state_key: "state",
          canonical_authority_state_basis_key: "basis",
          canonical_authority_state_value:
            "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE",
        }).endsWith("SOURCE_PRESENT")
      );
    });
  });
});
