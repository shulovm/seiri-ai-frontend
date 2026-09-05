/**
 * GROUND-113 — Observation Core LXVII / Authority Evidence Evaluation State
 * Foundation
 *
 * Pure GROUND-111 → structured finite evidence normalization
 * (no canonical Authority polarity / interpretation / OE).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_EVALUATION_STATE_MODEL_LIMITATIONS,
  buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateSet,
  buildAuthorityEvidenceEvaluationStateValueCanonicalKey,
  deriveAuthorityEvidenceEvaluationStateValue,
} from "../reality/attention-observation-operational-eligibility-authority-evidence-evaluation-state-core.js";
import {
  buildAttentionObservationOperationalEligibilityObservationContextAuthorityProvenanceAssessmentSet,
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
import type { AuthorityProvenanceAssessment } from "../reality/governance-types.js";
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

const ENTITY_A = "f4010101-0101-4101-8101-010101010101";
const ORG_A = "f1010101-0101-4101-8101-010101010103";
const ORG_B = "f1010101-0101-4101-8101-010101010104";
const OBJECTIVE_A = "f5050505-0505-4505-8505-050505050901";
const AUTH_DECL_A = "f4040404-0404-4404-8404-040404040401";
const AUTH_GOV_A = "f9090909-0909-4909-8909-090909090901";
const AUTH_GOV_B = "f9090909-0909-4909-8909-090909090902";
const DELEGATION_A = "fa0a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a01";
const DELEGATION_B = "fa0a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a02";
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
  assert.ok(!/"INTERPRET_AS_AUTHORITY"/.test(json));
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
  entities?: RealityEntity[];
  authority_declarations?: AuthorityDeclaration[];
  authority_delegation_declarations?: AuthorityDelegationDeclaration[];
  authority_contest_declarations?: AuthorityContestDeclaration[];
}): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    project: { id: PROJECT_ID } as ProjectState["project"],
    reality_entities: options?.entities ?? [
      entity(ENTITY_A),
      entity(ORG_A),
      entity(ORG_B),
    ],
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
          observation_need_key: "need",
          requirements: [
            {
              key: "attention-observation-capability-requirement|need|inspect",
              observation_need_key: "need",
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

function buildProvenanceSet(options?: {
  bindings?: {
    candidate_key: string;
    authority_holder_entity_id: string;
    authority_power: AuthorityDeclaration["power"];
    governance_scope: GovernanceScope;
  }[];
  evaluationInstants?: { candidate_key: string; authority_evaluation_at: string }[];
  projectState?: ProjectState;
}) {
  const projectState = options?.projectState ?? mockProjectState();
  const bindingSet =
    buildAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSet(
      {
        capability_requirement_set: mockRequirementSet(),
        project_state: projectState,
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

function firstCandidate(set: ReturnType<typeof buildEvidenceSet>) {
  return set.candidate_assessments[0]!;
}

function firstState(set: ReturnType<typeof buildEvidenceSet>) {
  return firstCandidate(set).authority_evidence_evaluation_states[0]!;
}

function firstBasis(set: ReturnType<typeof buildEvidenceSet>) {
  return firstCandidate(set).authority_evidence_evaluation_state_bases[0]!;
}

describe("GROUND-113 Authority Evidence Evaluation State", () => {
  describe("structured evidence axes", () => {
    it("scenario A: DECLARED + direct uncontested axes only", () => {
      const set = buildEvidenceSet({
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const value = firstState(set).value;
      assert.equal(value.direct_declared_status, "DECLARED_AUTHORITY_PRESENT");
      assert.equal(value.direct_provenance_path_presence, "PRESENT");
      assert.equal(value.delegated_provenance_path_presence, "NOT_PRESENT");
      assert.equal(value.contested_path_presence, "NOT_PRESENT");
      assert.equal(value.uncontested_path_presence, "PRESENT");
      assertNoCanonicalAuthoritySemantics(set);
    });

    it("critical scenario B: NO_DECLARED + active delegated evidence", () => {
      const set = buildEvidenceSet({
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
      });
      const value = firstState(set).value;
      assert.equal(value.direct_declared_status, "NO_DECLARED_AUTHORITY");
      assert.equal(value.delegated_provenance_path_presence, "PRESENT");
      assert.equal(value.active_source_basis_presence, "PRESENT");
      assert.equal(value.uncontested_path_presence, "PRESENT");
      assertNoCanonicalAuthoritySemantics(set);
    });

    it("scenario C: inactive source basis without negative inference", () => {
      const set = buildEvidenceSet({
        projectState: mockProjectState({
          authority_declarations: [
            authorityGovObjective({
              valid_from: "2099-01-01T00:00:00.000Z",
            }),
          ],
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
      });
      const value = firstState(set).value;
      assert.equal(value.inactive_source_basis_presence, "PRESENT");
      assertNoCanonicalAuthoritySemantics(set);
    });

    it("scenario G: zero provenance paths still produces structured state", () => {
      const set = buildEvidenceSet({
        projectState: mockProjectState({ authority_declarations: [] }),
      });
      const value = firstState(set).value;
      assert.equal(value.direct_declared_status, "NO_DECLARED_AUTHORITY");
      assert.equal(value.direct_provenance_path_presence, "NOT_PRESENT");
      assert.equal(value.delegated_provenance_path_presence, "NOT_PRESENT");
      assert.equal(value.contested_path_presence, "NOT_PRESENT");
      assert.equal(value.uncontested_path_presence, "NOT_PRESENT");
      assert.equal(
        firstCandidate(set).status,
        "AUTHORITY_EVIDENCE_EVALUATION_STATES_PRESENT"
      );
      assertNoCanonicalAuthoritySemantics(set);
    });

    it("scenario E: contested direct path preserved", () => {
      const set = buildEvidenceSet({
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
          authority_contest_declarations: [contestOnAuthority()],
        }),
      });
      const value = firstState(set).value;
      assert.equal(value.direct_declared_status, "DECLARED_AUTHORITY_PRESENT");
      assert.equal(value.direct_provenance_path_presence, "PRESENT");
      assert.equal(value.contested_path_presence, "PRESENT");
      assertNoCanonicalAuthoritySemantics(set);
    });

    it("direct + delegated coexistence without precedence", () => {
      const set = buildEvidenceSet({
        projectState: mockProjectState({
          authority_declarations: [
            authorityGovObjective(),
            authorityGovObjective({
              id: AUTH_GOV_B,
              holder_entity_id: ORG_B,
            }),
          ],
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
      });
      const value = firstState(set).value;
      assert.equal(value.direct_provenance_path_presence, "PRESENT");
      assert.equal(value.delegated_provenance_path_presence, "PRESENT");
      assertNoCanonicalAuthoritySemantics(set);
    });

    it("contested + uncontested paths may coexist", () => {
      const set = buildEvidenceSet({
        projectState: mockProjectState({
          authority_declarations: [
            authorityDeclaration(),
            authorityDeclaration({
              id: "f4040404-0404-4404-8404-040404040402",
              holder_entity_id: ENTITY_A,
            }),
          ],
          authority_contest_declarations: [contestOnAuthority()],
        }),
      });
      const value = firstState(set).value;
      assert.equal(value.contested_path_presence, "PRESENT");
      assert.equal(value.uncontested_path_presence, "PRESENT");
    });

    it("multiple delegated paths → delegated_path_multiplicity MULTIPLE", () => {
      const set = buildEvidenceSet({
        projectState: mockProjectState({
          authority_declarations: [
            authorityGovObjective(),
            authorityGovObjective({
              id: AUTH_GOV_B,
              holder_entity_id: ORG_C(),
            }),
          ],
          authority_delegation_declarations: [
            delegationToOrgB(),
            delegationToOrgB({
              id: DELEGATION_B,
              delegator_entity_id: ORG_C(),
              source_authority_declaration_ids: [AUTH_GOV_B],
            }),
          ],
        }),
        bindings: [
          {
            candidate_key: "cand",
            authority_holder_entity_id: ORG_B,
            authority_power: "GOVERN_OBJECTIVE",
            governance_scope: SCOPE_OBJ,
          },
        ],
      });
      assert.equal(
        firstState(set).value.delegated_path_multiplicity,
        "MULTIPLE"
      );
    });
  });

  function ORG_C(): string {
    return "f1010101-0101-4101-8101-010101010105";
  }

  describe("cardinality / lineage / outer statuses", () => {
    it("N 111 wrappers → N states + N bases", () => {
      const set = buildEvidenceSet({
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
        }),
      });
      assert.equal(
        firstCandidate(set).authority_evidence_evaluation_states.length,
        2
      );
      assert.equal(
        firstCandidate(set).authority_evidence_evaluation_state_bases.length,
        2
      );
    });

    it("NO_BINDINGS / NO_INSTANT propagate with zero states", () => {
      const noBindings = buildEvidenceSet({
        bindings: [],
        evaluationInstants: [],
      });
      assert.equal(
        firstCandidate(noBindings).status,
        "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
      );
      assert.equal(
        firstCandidate(noBindings).authority_evidence_evaluation_states.length,
        0
      );

      const noInstant = buildEvidenceSet({ evaluationInstants: [] });
      assert.equal(
        firstCandidate(noInstant).status,
        "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED"
      );
    });

    it("Basis retains full 111 lineage", () => {
      const provenanceSet = buildProvenanceSet({
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const evidenceSet = buildEvidenceSet({
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const wrapper =
        provenanceSet.candidate_assessments[0]!
          .observation_context_authority_provenance_assessments[0]!;
      const basis = firstBasis(evidenceSet);
      assert.equal(
        basis.observation_context_authority_provenance_assessment_key,
        wrapper.key
      );
      assert.equal(
        basis.observation_context_declared_authority_assessment_key,
        wrapper.observation_context_declared_authority_assessment_key
      );
      assert.equal(
        basis.authority_observation_context_binding_key,
        wrapper.authority_observation_context_binding_key
      );
      assert.ok(basis.authority_provenance_assessment_canonical_key.length > 0);
    });

    it("structured value has no raw ID fields", () => {
      const set = buildEvidenceSet({
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const json = JSON.stringify(firstState(set).value);
      assert.ok(!json.includes("authority_declaration_ids"));
      assert.ok(!json.includes("delegation_declaration_ids"));
      assert.ok(!json.includes("contest_declaration_ids"));
    });
  });

  describe("determinism / identity", () => {
    it("path order invariance for structured value", () => {
      const set = buildEvidenceSet({
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
      });
      const provenance =
        firstCandidate(set).observation_context_authority_provenance_assessment
          .observation_context_authority_provenance_assessments[0]!
          .authority_provenance_assessment;
      const reordered = {
        ...provenance,
        provenance_paths: [...provenance.provenance_paths].reverse(),
      };
      assert.deepEqual(
        deriveAuthorityEvidenceEvaluationStateValue(provenance),
        deriveAuthorityEvidenceEvaluationStateValue(reordered)
      );
    });

    it("raw lineage change with same structured value changes Basis key", () => {
      const base = buildEvidenceSet({
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const alt = buildEvidenceSet({
        projectState: mockProjectState({
          authority_declarations: [
            authorityDeclaration({
              id: "f4040404-0404-4404-8404-040404040402",
            }),
          ],
        }),
      });
      assert.deepEqual(firstState(base).value, firstState(alt).value);
      assert.notEqual(firstBasis(base).key, firstBasis(alt).key);
      assert.notEqual(firstState(base).key, firstState(alt).key);
    });

    it("determinism, deep-clone, input immutability", () => {
      const provenanceSet = buildProvenanceSet({
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const before = structuredClone(provenanceSet);
      const a =
        buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateSet(
          {
            observation_context_authority_provenance_assessment_set:
              provenanceSet,
          }
        );
      const b =
        buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateSet(
          {
            observation_context_authority_provenance_assessment_set:
              provenanceSet,
          }
        );
      assert.deepEqual(a, b);
      assert.deepEqual(provenanceSet, before);
    });
  });

  describe("validation / static proofs", () => {
    it("rejects forged summary/path contradiction", () => {
      const provenanceSet = buildProvenanceSet({
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const wrapper =
        provenanceSet.candidate_assessments[0]!
          .observation_context_authority_provenance_assessments[0]!;
      const forged = structuredClone(provenanceSet);
      forged.candidate_assessments[0]!
        .observation_context_authority_provenance_assessments[0]!
        .authority_provenance_assessment.has_direct_declared_authority = false;
      assert.throws(
        () =>
          buildAttentionObservationOperationalEligibilityAuthorityEvidenceEvaluationStateSet(
            {
              observation_context_authority_provenance_assessment_set: forged,
            }
          ),
        /summary inconsistency/
      );
      assert.equal(wrapper.key.length > 0, true);
    });

    it("fixed model limitation order", () => {
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_EVALUATION_STATE_MODEL_LIMITATIONS[0],
        "OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_INTERPRETATION_POLICY_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVIDENCE_EVALUATION_STATE_MODEL_LIMITATIONS.at(
          -1
        ),
        "EXECUTION_NOT_MODELED"
      );
    });

    it("schema 0.1.24; 111 only; no 019/020/110/ProjectState", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-evidence-evaluation-state-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-evidence-evaluation-state-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(
        /observation_context_authority_provenance_assessment_set/.test(core)
      );
      assert.ok(!/assessAuthorityProvenance\s*\(/.test(core));
      assert.ok(!/assessDeclaredAuthority\s*\(/.test(core));
      assert.ok(!/assessDeclaredStanding\s*\(/.test(core));
      assert.ok(!/assessAuthorityDelegation\s*\(/.test(core));
      assert.ok(
        !/from ["'].*attention-observation-operational-eligibility-observation-context-declared-authority-assessment-core/.test(
          core
        )
      );
      assert.ok(
        !/from ["'].*attention-observation-operational-eligibility-authority-observation-context-binding-core/.test(
          core
        )
      );
      assert.ok(!/from ["'].*permission-core/.test(src));
      assert.ok(!/Date\.now\(/.test(core));
      assert.ok(!/"AUTHORIZED"/.test(src));
      assert.ok(!/"AUTHORITY_PRESENT"/.test(src));
      assert.ok(!/"INTERPRET_AS_AUTHORITY"/.test(src));
    });

    it("buildAuthorityEvidenceEvaluationStateValueCanonicalKey is deterministic", () => {
      const value = firstState(
        buildEvidenceSet({
          projectState: mockProjectState({
            authority_declarations: [authorityDeclaration()],
          }),
        })
      ).value;
      assert.equal(
        buildAuthorityEvidenceEvaluationStateValueCanonicalKey(value),
        buildAuthorityEvidenceEvaluationStateValueCanonicalKey(value)
      );
    });
  });
});
