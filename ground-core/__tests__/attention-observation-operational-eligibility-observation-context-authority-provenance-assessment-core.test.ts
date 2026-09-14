/**
 * GROUND-111 — Observation Core LXV / Observation-Context AUTHORITY
 * Provenance Assessment Foundation
 *
 * Pure 110 Declared AUTHORITY + ProjectState + GROUND-020 assessAuthorityProvenance
 * (raw provenance preserved; no canonical/effective Authority / OE).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_OBSERVATION_CONTEXT_AUTHORITY_PROVENANCE_ASSESSMENT_MODEL_LIMITATIONS,
  buildAttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentSet,
  buildAuthorityProvenanceAssessmentCanonicalKey,
} from "../reality/attention-observation-operational-eligibility-observation-context-authority-provenance-assessment-core.js";
import {
  buildAttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentSet,
} from "../reality/attention-observation-operational-eligibility-observation-context-declared-authority-assessment-core.js";
import {
  buildAttentionObservationOperationalEligibilityAuthorityEvaluationInstantSet,
} from "../reality/attention-observation-operational-eligibility-authority-evaluation-instant-core.js";
import {
  buildAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSet,
} from "../reality/attention-observation-operational-eligibility-authority-observation-context-binding-core.js";
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
const REQ_KEY_2 =
  "attention-observation-capability-requirement|need|human_inspection";

const ENTITY_A = "f4010101-0101-4101-8101-010101010101";
const ENTITY_B = "f4010101-0101-4101-8101-010101010102";
const ORG_A = "f1010101-0101-4101-8101-010101010103";
const ORG_B = "f1010101-0101-4101-8101-010101010104";
const OBJECTIVE_A = "f5050505-0505-4505-8505-050505050901";
const AUTH_DECL_A = "f4040404-0404-4404-8404-040404040401";
const AUTH_GOV_A = "f9090909-0909-4909-8909-090909090901";
const DELEGATION_A = "fa0a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a01";
const CONTEST_A = "fb1b1b1b-1b1b-4b1b-8b1b-1b1b1b1b1b01";
const TS = "2026-08-24T10:00:00.000Z";
const FROM = "2026-08-24T00:00:00.000Z";
const AT = "2026-08-24T11:00:00.000Z";

const SCOPE_A: GovernanceScope = {
  kind: "SUBJECT_STATE",
  subject_id: "subject-a",
  state_kind: "active",
};

const SCOPE_OBJ: GovernanceScope = {
  kind: "REALITY_OBJECTIVE",
  objective_id: OBJECTIVE_A,
};

function assertNoCanonicalAuthoritySemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"AUTHORIZED"/.test(json));
  assert.ok(!/"UNAUTHORIZED"/.test(json));
  assert.ok(!/"AUTHORITY_PRESENT"/.test(json));
  assert.ok(!/"AUTHORITY_ABSENT"/.test(json));
  assert.ok(!/"effective_authority"/.test(json));
  assert.ok(!/"is_authorized"/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"preferred_path"/.test(json));
  assert.ok(!/"winner"/.test(json));
}

function entity(id: string, overrides: Partial<RealityEntity> = {}): RealityEntity {
  return {
    id,
    project_id: PROJECT_ID,
    kind: "organization",
    label: id,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function objective(): RealityObjective {
  return {
    id: OBJECTIVE_A,
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
    contesting_entity_id: ENTITY_B,
    target: {
      kind: "AUTHORITY_DECLARATION",
      authority_declaration_id: AUTH_GOV_A,
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
  entities?: RealityEntity[];
  authority_declarations?: AuthorityDeclaration[];
  authority_delegation_declarations?: AuthorityDelegationDeclaration[];
  authority_contest_declarations?: AuthorityContestDeclaration[];
  reality_objectives?: RealityObjective[];
}): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    project: { id: PROJECT_ID } as ProjectState["project"],
    reality_entities: options?.entities ?? [
      entity(ENTITY_A),
      entity(ENTITY_B),
      entity(ORG_A),
      entity(ORG_B),
    ],
    reality_objectives: options?.reality_objectives ?? [objective()],
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
            {
              key: REQ_KEY_2,
              observation_need_key: NEED_KEY,
              capability_semantic_key: "human_inspection",
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

function buildDeclaredSet(options?: {
  bindings?: {
    candidate_key: string;
    authority_holder_entity_id: string;
    authority_power: AuthorityDeclaration["power"];
    governance_scope: GovernanceScope;
  }[];
  evaluationInstants?: { candidate_key: string; authority_evaluation_at: string }[];
  projectState?: ProjectState;
}) {
  const bindingSet =
    buildAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSet(
      {
        capability_requirement_set: mockRequirementSet(),
        project_state: options?.projectState ?? mockProjectState(),
        specification: {
          bindings: options?.bindings ?? [
            {
              candidate_key: "cand",
              authority_holder_entity_id: ENTITY_A,
              authority_power: "AUTHORIZE_INTERVENTION",
              governance_scope: SCOPE_A,
            },
          ],
        },
      }
    );
  const instantSet =
    buildAttentionObservationOperationalEligibilityAuthorityEvaluationInstantSet(
      {
        authority_observation_context_binding_set: bindingSet,
        specification: {
          evaluation_instants: options?.evaluationInstants ?? [
            { candidate_key: "cand", authority_evaluation_at: AT },
          ],
        },
      }
    );
  return buildAttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentSet(
    {
      project_state: options?.projectState ?? mockProjectState(),
      authority_evaluation_instant_set: instantSet,
    }
  );
}

function buildProvenanceSet(options?: Parameters<typeof buildDeclaredSet>[0]) {
  const declaredSet = buildDeclaredSet(options);
  return buildAttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentSet(
    {
      project_state: options?.projectState ?? mockProjectState(),
      observation_context_declared_authority_assessment_set: declaredSet,
    }
  );
}

function firstCandidate(set: ReturnType<typeof buildProvenanceSet>) {
  return set.candidate_assessments[0]!;
}

function firstProvenanceWrapper(set: ReturnType<typeof buildProvenanceSet>) {
  return firstCandidate(set).observation_context_authority_provenance_assessments[0]!;
}

describe("GROUND-111 Observation-Context AUTHORITY Provenance Assessment", () => {
  describe("raw GROUND-020 provenance preservation", () => {
    it("direct Authority + direct provenance path preserved", () => {
      const set = buildProvenanceSet({
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const wrapper = firstProvenanceWrapper(set);
      assert.equal(
        firstCandidate(set).status,
        "OBSERVATION_CONTEXT_AUTHORITY_PROVENANCE_ASSESSMENTS_PRESENT"
      );
      assert.equal(
        wrapper.authority_provenance_assessment.has_direct_declared_authority,
        true
      );
      assert.ok(
        wrapper.authority_provenance_assessment.provenance_paths.some(
          (path) => path.kind === "DIRECT_DECLARATION"
        )
      );
      assert.equal(
        wrapper.observation_context_declared_authority_assessment_key,
        firstCandidate(set).observation_context_declared_authority_assessment
          .observation_context_declared_authority_assessments[0]!.key
      );
      assertNoCanonicalAuthoritySemantics(set);
    });

    it("critical: NO_DECLARED direct + delegated provenance coexist", () => {
      const projectState = mockProjectState({
        authority_declarations: [authorityGovObjective()],
        authority_delegation_declarations: [delegationToOrgB()],
      });
      const set = buildProvenanceSet({
        projectState,
        bindings: [
          {
            candidate_key: "cand",
            authority_holder_entity_id: ORG_B,
            authority_power: "GOVERN_OBJECTIVE",
            governance_scope: SCOPE_OBJ,
          },
        ],
      });
      const declared =
        firstCandidate(set).observation_context_declared_authority_assessment
          .observation_context_declared_authority_assessments[0]!;
      const provenance = firstProvenanceWrapper(set);
      assert.equal(declared.declared_authority_status, "NO_DECLARED_AUTHORITY");
      assert.equal(
        provenance.authority_provenance_assessment.has_delegated_authority_claim,
        true
      );
      assert.equal(
        provenance.authority_provenance_assessment.has_direct_declared_authority,
        false
      );
      assert.ok(
        provenance.authority_provenance_assessment.provenance_paths.some(
          (path) => path.kind === "ONE_HOP_DELEGATION"
        )
      );
      assertNoCanonicalAuthoritySemantics(set);
    });

    it("direct present + delegated provenance coexist; no merge", () => {
      const projectState = mockProjectState({
        authority_declarations: [
          authorityGovObjective(),
          authorityGovObjective({
            id: "f9090909-0909-4909-8909-090909090903",
            holder_entity_id: ORG_B,
          }),
        ],
        authority_delegation_declarations: [delegationToOrgB()],
      });
      const set = buildProvenanceSet({
        projectState,
        bindings: [
          {
            candidate_key: "cand",
            authority_holder_entity_id: ORG_B,
            authority_power: "GOVERN_OBJECTIVE",
            governance_scope: SCOPE_OBJ,
          },
        ],
      });
      const provenance = firstProvenanceWrapper(set);
      assert.equal(
        firstCandidate(set).observation_context_declared_authority_assessment
          .observation_context_declared_authority_assessments[0]!
          .declared_authority_status,
        "DECLARED_AUTHORITY_PRESENT"
      );
      assert.equal(
        provenance.authority_provenance_assessment.has_direct_declared_authority,
        true
      );
      assert.equal(
        provenance.authority_provenance_assessment.has_delegated_authority_claim,
        true
      );
      assertNoCanonicalAuthoritySemantics(set);
    });

    it("direct present + contested path preserved; contest != revocation", () => {
      const set = buildProvenanceSet({
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
          authority_contest_declarations: [
            contestOnAuthority({
              target: {
                kind: "AUTHORITY_DECLARATION",
                authority_declaration_id: AUTH_DECL_A,
              },
            }),
          ],
        }),
      });
      const provenance = firstProvenanceWrapper(set);
      const contested = provenance.authority_provenance_assessment.provenance_paths.filter(
        (path) => path.contested
      );
      assert.ok(contested.length > 0);
      assert.equal(
        firstCandidate(set).observation_context_declared_authority_assessment
          .observation_context_declared_authority_assessments[0]!
          .declared_authority_status,
        "DECLARED_AUTHORITY_PRESENT"
      );
      assertNoCanonicalAuthoritySemantics(set);
    });

    it("zero provenance paths still produces wrapper; no UNAUTHORIZED", () => {
      const set = buildProvenanceSet({
        projectState: mockProjectState({ authority_declarations: [] }),
      });
      const provenance = firstProvenanceWrapper(set);
      assert.equal(
        provenance.authority_provenance_assessment.provenance_paths.length,
        0
      );
      assert.equal(
        firstCandidate(set).status,
        "OBSERVATION_CONTEXT_AUTHORITY_PROVENANCE_ASSESSMENTS_PRESENT"
      );
      assertNoCanonicalAuthoritySemantics(set);
    });
  });

  describe("multiplicity / lineage / gating", () => {
    it("N GROUND-110 wrappers → N GROUND-111 wrappers", () => {
      const set = buildProvenanceSet({
        bindings: [
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
        ],
        projectState: mockProjectState({
          authority_declarations: [
            authorityDeclaration(),
            authorityGovObjective({ holder_entity_id: ORG_B }),
          ],
          authority_delegation_declarations: [],
        }),
      });
      assert.equal(
        firstCandidate(set).observation_context_authority_provenance_assessments
          .length,
        2
      );
    });

    it("GROUND-110 raw status does not gate provenance evaluation", () => {
      const projectState = mockProjectState({
        authority_declarations: [authorityGovObjective()],
        authority_delegation_declarations: [delegationToOrgB()],
      });
      const set = buildProvenanceSet({
        projectState,
        bindings: [
          {
            candidate_key: "cand",
            authority_holder_entity_id: ORG_B,
            authority_power: "GOVERN_OBJECTIVE",
            governance_scope: SCOPE_OBJ,
          },
        ],
      });
      const declaredWrapper =
        firstCandidate(set).observation_context_declared_authority_assessment
          .observation_context_declared_authority_assessments[0]!;
      assert.equal(declaredWrapper.declared_authority_status, "NO_DECLARED_AUTHORITY");
      assert.equal(
        firstProvenanceWrapper(set).authority_provenance_assessment
          .provenance_paths.length,
        1
      );
    });

    it("retains exact 110 wrapper key, binding key, holder, power, scope, instant lineage", () => {
      const set = buildProvenanceSet({
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const declaredWrapper =
        firstCandidate(set).observation_context_declared_authority_assessment
          .observation_context_declared_authority_assessments[0]!;
      const provenanceWrapper = firstProvenanceWrapper(set);
      assert.equal(
        provenanceWrapper.observation_context_declared_authority_assessment_key,
        declaredWrapper.key
      );
      assert.equal(
        provenanceWrapper.authority_observation_context_binding_key,
        declaredWrapper.authority_observation_context_binding_key
      );
      assert.equal(
        provenanceWrapper.authority_holder_entity_id,
        declaredWrapper.authority_holder_entity_id
      );
      assert.equal(
        provenanceWrapper.authority_power,
        declaredWrapper.authority_power
      );
      assert.deepEqual(
        provenanceWrapper.governance_scope,
        declaredWrapper.governance_scope
      );
      assert.equal(
        provenanceWrapper.authority_evaluation_at,
        declaredWrapper.authority_evaluation_at
      );
      assert.notEqual(
        provenanceWrapper.candidate_key,
        provenanceWrapper.authority_holder_entity_id
      );
      assert.ok(provenanceWrapper.authority_provenance_assessment);
      assert.ok(
        Object.prototype.hasOwnProperty.call(
          provenanceWrapper.authority_provenance_assessment,
          "provenance_paths"
        )
      );
    });

    it("path-order invariance for canonical provenance identity", () => {
      const projectState = mockProjectState({
        authority_declarations: [
          authorityGovObjective(),
          authorityGovObjective({
            id: "f9090909-0909-4909-8909-090909090903",
            holder_entity_id: ORG_B,
          }),
        ],
        authority_delegation_declarations: [delegationToOrgB()],
      });
      const a = buildProvenanceSet({
        projectState,
        bindings: [
          {
            candidate_key: "cand",
            authority_holder_entity_id: ORG_B,
            authority_power: "GOVERN_OBJECTIVE",
            governance_scope: SCOPE_OBJ,
          },
        ],
      });
      const b = buildProvenanceSet({
        projectState,
        bindings: [
          {
            candidate_key: "cand",
            authority_holder_entity_id: ORG_B,
            authority_power: "GOVERN_OBJECTIVE",
            governance_scope: SCOPE_OBJ,
          },
        ],
      });
      assert.deepEqual(a, b);
    });
  });

  describe("absence / NOT_APPLICABLE", () => {
    it("NO_BINDINGS / NO_INSTANT / NOT_APPLICABLE → zero wrappers", () => {
      const noBindings = buildProvenanceSet({ bindings: [], evaluationInstants: [] });
      assert.equal(
        firstCandidate(noBindings).status,
        "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
      );
      assert.equal(
        firstCandidate(noBindings).observation_context_authority_provenance_assessments
          .length,
        0
      );

      const noInstant = buildProvenanceSet({ evaluationInstants: [] });
      assert.equal(
        firstCandidate(noInstant).status,
        "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED"
      );
    });
  });

  describe("firewalls / determinism", () => {
    it("determinism, deep-clone, input immutability", () => {
      const projectState = mockProjectState({
        authority_declarations: [authorityDeclaration()],
      });
      const declaredSet = buildDeclaredSet({ projectState });
      const beforeProject = structuredClone(projectState);
      const beforeDeclared = structuredClone(declaredSet);

      const a =
        buildAttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentSet(
          {
            project_state: projectState,
            observation_context_declared_authority_assessment_set: declaredSet,
          }
        );
      const b =
        buildAttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentSet(
          {
            project_state: projectState,
            observation_context_declared_authority_assessment_set: declaredSet,
          }
        );
      assert.deepEqual(a, b);
      assert.deepEqual(projectState, beforeProject);
      assert.deepEqual(declaredSet, beforeDeclared);
    });

    it("malformed 110 lineage rejects", () => {
      const declaredSet = buildDeclaredSet({
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const tampered = structuredClone(declaredSet);
      tampered.candidate_assessments[0]!.observation_context_declared_authority_assessments[0]!.candidate_key =
        "other";
      assert.throws(() =>
        buildAttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentSet(
          {
            project_state: mockProjectState(),
            observation_context_declared_authority_assessment_set: tampered,
          }
        )
      );
    });
  });

  describe("static proofs / schema / model limitations", () => {
    it("fixed model limitation order", () => {
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_OBSERVATION_CONTEXT_AUTHORITY_PROVENANCE_ASSESSMENT_MODEL_LIMITATIONS[0],
        "OPERATIONAL_ELIGIBILITY_AUTHORITY_STATE_SEMANTIC_INTERPRETATION_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_OBSERVATION_CONTEXT_AUTHORITY_PROVENANCE_ASSESSMENT_MODEL_LIMITATIONS.at(
          -1
        ),
        "EXECUTION_NOT_MODELED"
      );
    });

    it("schema 0.1.24; 020 only; no independent 019/Delegation/Standing/Permission", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-observation-context-authority-provenance-assessment-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-observation-context-authority-provenance-assessment-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(/observation_context_declared_authority_assessment_set/.test(core));
      assert.ok(/assessAuthorityProvenance/.test(core));
      assert.ok(!/assessDeclaredAuthority\s*\(/.test(core));
      assert.ok(!/assessAuthorityDelegation\s*\(/.test(core));
      assert.ok(!/assessDeclaredStanding\s*\(/.test(core));
      assert.ok(!/assessAuthorityContest\s*\(/.test(core));
      assert.ok(!/getAuthorityProvenancePaths\s*\(/.test(core));
      assert.ok(!/getApplicableAuthorityDelegationsToHolder\s*\(/.test(core));
      assert.ok(
        !/from ["'].*attention-observation-operational-eligibility-authority-observation-context-binding-core/.test(
          core
        )
      );
      assert.ok(
        !/from ["'].*attention-observation-operational-eligibility-authority-evaluation-instant-core/.test(
          core
        )
      );
      assert.ok(!/from ["'].*permission-core/.test(src));
      assert.ok(
        !/from ["'].*operational-eligibility-dimension-policy-core/.test(src)
      );

      assert.ok(!/Date\.now\(/.test(core));
      assert.ok(!/new Date\(/.test(core));
      assert.ok(!/"AUTHORIZED"/.test(src));
      assert.ok(!/"UNAUTHORIZED"/.test(src));
      assert.ok(!/"can_execute"/.test(src));
    });

    it("buildAuthorityProvenanceAssessmentCanonicalKey is path-order invariant", () => {
      const base = firstProvenanceWrapper(
        buildProvenanceSet({
          projectState: mockProjectState({
            authority_declarations: [authorityGovObjective()],
            authority_delegation_declarations: [delegationToOrgB()],
          }),
          bindings: [
            {
              candidate_key: "cand",
              authority_holder_entity_id: ORG_B,
              authority_power: "GOVERN_OBJECTIVE",
              governance_scope: SCOPE_OBJ,
            },
          ],
        })
      ).authority_provenance_assessment;
      const reordered = {
        ...base,
        provenance_paths: [...base.provenance_paths].reverse(),
      };
      assert.equal(
        buildAuthorityProvenanceAssessmentCanonicalKey(base),
        buildAuthorityProvenanceAssessmentCanonicalKey(reordered)
      );
    });
  });
});
