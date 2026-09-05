/**
 * GROUND-110 — Observation Core LXIV / Observation-Context Declared AUTHORITY
 * Assessment Foundation
 *
 * Pure 109 Evaluation Instant + ProjectState + GROUND-019 assessDeclaredAuthority
 * (raw vocabulary preserved; no canonical/effective Authority / OE).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_OBSERVATION_CONTEXT_DECLARED_AUTHORITY_ASSESSMENT_MODEL_LIMITATIONS,
  buildAttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentSet,
  buildDeclaredAuthorityAssessmentCanonicalKey,
} from "../reality/attention-observation-operational-eligibility-observation-context-declared-authority-assessment-core.js";
import {
  buildAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSet,
} from "../reality/attention-observation-operational-eligibility-authority-observation-context-binding-core.js";
import {
  buildAttentionObservationOperationalEligibilityAuthorityEvaluationInstantSet,
} from "../reality/attention-observation-operational-eligibility-authority-evaluation-instant-core.js";
import { assessDeclaredAuthority } from "../reality/governance-core.js";
import type {
  AttentionObservationCapabilityRequirementSetAssessment,
} from "../reality/attention-observation-capability-requirement-types.js";
import type {
  AuthorityDeclaration,
  GovernanceScope,
  ProjectState,
  RealityEntity,
} from "../types.js";
import { SCHEMA_VERSION } from "../types.js";
import { PROJECT_ID } from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const NEED_KEY = "need";
const REQ_KEY = "attention-observation-capability-requirement|need|inspect";
const REQ_KEY_2 =
  "attention-observation-capability-requirement|need|human_inspection";

const ENTITY_A = "f4010101-0101-4101-8101-010101010101";
const ENTITY_B = "f4010101-0101-4101-8101-010101010102";
const AUTH_DECL_A = "f4040404-0404-4404-8404-040404040401";
const AUTH_DECL_B = "f4040404-0404-4404-8404-040404040402";
const TS = "2026-08-24T10:00:00.000Z";
const FROM = "2026-08-24T00:00:00.000Z";
const AT = "2026-08-24T11:00:00.000Z";

const SCOPE_A: GovernanceScope = {
  kind: "SUBJECT_STATE",
  subject_id: "subject-a",
  state_kind: "active",
};

const SCOPE_B: GovernanceScope = {
  kind: "REFERENCE_CONDITION",
  reference_condition_id: "ref-cond-b",
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
  assert.ok(!/"required_dimensions"/.test(json));
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

function mockProjectState(options?: {
  entities?: RealityEntity[];
  authority_declarations?: AuthorityDeclaration[];
}): ProjectState {
  return {
    project: { id: PROJECT_ID } as ProjectState["project"],
    reality_entities: options?.entities ?? [entity(ENTITY_A), entity(ENTITY_B)],
    authority_declarations: options?.authority_declarations ?? [],
  } as ProjectState;
}

function mockRequirementSet(options?: {
  candidates?: {
    candidate_key: string;
    status?:
      | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      | "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED"
      | "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT";
    requirements?: { key: string; semantic: string }[];
  }[];
}): AttentionObservationCapabilityRequirementSetAssessment {
  const candidates = options?.candidates ?? [
    {
      candidate_key: "cand",
      status: "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT" as const,
      requirements: [
        { key: REQ_KEY, semantic: "inspect" },
        { key: REQ_KEY_2, semantic: "human_inspection" },
      ],
    },
  ];

  return {
    planning_set: {} as never,
    specification: { requirements: [] },
    candidate_requirements: candidates.map((c) => {
      const status =
        c.status ?? "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT";
      const requirements = c.requirements ?? [];
      const hasExplicit =
        status === "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT" &&
        requirements.length > 0;

      return {
        candidate_key: c.candidate_key,
        planning: {} as never,
        status,
        capability_requirement_basis:
          status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
            ? null
            : {
                observation_need_key: NEED_KEY,
                requirements: requirements.map((r) => ({
                  key: r.key,
                  observation_need_key: NEED_KEY,
                  capability_semantic_key: r.semantic,
                })),
              },
        has_explicit_capability_requirements: hasExplicit,
        model_limitations: [],
      };
    }),
    has_explicit_capability_requirements: candidates.some(
      (c) =>
        (c.status ?? "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT") ===
          "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT" &&
        (c.requirements?.length ?? 0) > 0
    ),
    model_limitations: [],
  };
}

function buildPipeline(options?: {
  bindings?: {
    candidate_key: string;
    authority_holder_entity_id: string;
    authority_power: AuthorityDeclaration["power"];
    governance_scope: GovernanceScope;
  }[];
  evaluationInstants?: { candidate_key: string; authority_evaluation_at: string }[];
  projectState?: ProjectState;
  requirementSet?: AttentionObservationCapabilityRequirementSetAssessment;
}) {
  const bindingSet =
    buildAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSet(
      {
        capability_requirement_set:
          options?.requirementSet ?? mockRequirementSet(),
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

function firstCandidate(set: ReturnType<typeof buildPipeline>) {
  return set.candidate_assessments[0]!;
}

function firstWrapper(set: ReturnType<typeof buildPipeline>) {
  return firstCandidate(set)
    .observation_context_declared_authority_assessments[0]!;
}

describe("GROUND-110 Observation-Context Declared AUTHORITY Assessment", () => {
  describe("raw GROUND-019 status preservation", () => {
    it("active direct declaration → DECLARED_AUTHORITY_PRESENT; 1 wrapper", () => {
      const set = buildPipeline({
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const assessment = firstCandidate(set);
      assert.equal(
        assessment.status,
        "OBSERVATION_CONTEXT_DECLARED_AUTHORITY_ASSESSMENTS_PRESENT"
      );
      assert.equal(
        assessment.observation_context_declared_authority_assessments.length,
        1
      );
      const wrapper = firstWrapper(set);
      assert.equal(
        wrapper.declared_authority_status,
        "DECLARED_AUTHORITY_PRESENT"
      );
      assert.equal(
        wrapper.declared_authority_assessment.status,
        "DECLARED_AUTHORITY_PRESENT"
      );
      assert.deepEqual(
        wrapper.declared_authority_assessment.authority_declaration_ids,
        [AUTH_DECL_A]
      );
      assertNoCanonicalAuthoritySemantics(set);
    });

    it("zero applicable declarations → NO_DECLARED_AUTHORITY; wrapper retained", () => {
      const set = buildPipeline({
        projectState: mockProjectState({ authority_declarations: [] }),
      });
      const wrapper = firstWrapper(set);
      assert.equal(wrapper.declared_authority_status, "NO_DECLARED_AUTHORITY");
      assert.equal(
        wrapper.declared_authority_assessment.status,
        "NO_DECLARED_AUTHORITY"
      );
      assert.deepEqual(
        wrapper.declared_authority_assessment.authority_declaration_ids,
        []
      );
      assertNoCanonicalAuthoritySemantics(set);
    });

    it("DECLARER_NOT_ENTITY raw vocabulary preserved in canonical key path", () => {
      const raw = assessDeclaredAuthority(
        mockProjectState(),
        null,
        "AUTHORIZE_INTERVENTION",
        SCOPE_A,
        AT
      );
      assert.equal(raw.status, "DECLARER_NOT_ENTITY");
      assert.equal(
        buildDeclaredAuthorityAssessmentCanonicalKey(raw),
        "DECLARER_NOT_ENTITY|EMPTY_APPLICABLE_AUTHORITY_DECLARATION_SET|SINGLE"
      );
      assertNoCanonicalAuthoritySemantics(raw);
    });

    it("multiple applicable declarations preserved; no winner", () => {
      const set = buildPipeline({
        projectState: mockProjectState({
          authority_declarations: [
            authorityDeclaration({ id: AUTH_DECL_A }),
            authorityDeclaration({
              id: AUTH_DECL_B,
              declared_by: { kind: "organization", entity_id: ENTITY_B },
            }),
          ],
        }),
      });
      const wrapper = firstWrapper(set);
      assert.equal(
        wrapper.declared_authority_status,
        "DECLARED_AUTHORITY_PRESENT"
      );
      assert.equal(
        wrapper.declared_authority_assessment.has_multiple_declarations,
        true
      );
      assert.deepEqual(
        wrapper.declared_authority_assessment.authority_declaration_ids.sort(),
        [AUTH_DECL_A, AUTH_DECL_B].sort()
      );
      assertNoCanonicalAuthoritySemantics(set);
    });
  });

  describe("multiplicity / lineage / instant", () => {
    it("N bindings → N assessments; same exact instant", () => {
      const set = buildPipeline({
        bindings: [
          {
            candidate_key: "cand",
            authority_holder_entity_id: ENTITY_A,
            authority_power: "AUTHORIZE_INTERVENTION",
            governance_scope: SCOPE_A,
          },
          {
            candidate_key: "cand",
            authority_holder_entity_id: ENTITY_B,
            authority_power: "GOVERN_OBJECTIVE",
            governance_scope: SCOPE_B,
          },
        ],
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const assessment = firstCandidate(set);
      assert.equal(
        assessment.observation_context_declared_authority_assessments.length,
        2
      );
      const ats = assessment.observation_context_declared_authority_assessments.map(
        (w) => w.authority_evaluation_at
      );
      assert.deepEqual(ats, [AT, AT]);
      assert.equal(
        assessment.observation_context_declared_authority_assessments[0]!
          .authority_evaluation_instant_key,
        assessment.observation_context_declared_authority_assessments[1]!
          .authority_evaluation_instant_key
      );
    });

    it("mixed raw statuses across bindings; no aggregation", () => {
      const set = buildPipeline({
        bindings: [
          {
            candidate_key: "cand",
            authority_holder_entity_id: ENTITY_A,
            authority_power: "AUTHORIZE_INTERVENTION",
            governance_scope: SCOPE_A,
          },
          {
            candidate_key: "cand",
            authority_holder_entity_id: ENTITY_B,
            authority_power: "GOVERN_OBJECTIVE",
            governance_scope: SCOPE_B,
          },
        ],
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const assessment = firstCandidate(set);
      assert.equal(assessment.has_declared_authority_present_assessments, true);
      assert.equal(assessment.has_no_declared_authority_assessments, true);
      assert.equal(assessment.has_declarer_not_entity_assessments, false);
      const statuses =
        assessment.observation_context_declared_authority_assessments.map(
          (w) => w.declared_authority_status
        );
      assert.ok(statuses.includes("DECLARED_AUTHORITY_PRESENT"));
      assert.ok(statuses.includes("NO_DECLARED_AUTHORITY"));
    });

    it("binding order invariance → same semantic assessment keys", () => {
      const bindingsA = [
        {
          candidate_key: "cand",
          authority_holder_entity_id: ENTITY_A,
          authority_power: "AUTHORIZE_INTERVENTION" as const,
          governance_scope: SCOPE_A,
        },
        {
          candidate_key: "cand",
          authority_holder_entity_id: ENTITY_B,
          authority_power: "GOVERN_OBJECTIVE" as const,
          governance_scope: SCOPE_B,
        },
      ];
      const bindingsB = [...bindingsA].reverse();
      const a = buildPipeline({ bindings: bindingsA });
      const b = buildPipeline({ bindings: bindingsB });
      assert.deepEqual(
        a.candidate_assessments[0]!.observation_context_declared_authority_assessments
          .map((w) => w.key)
          .sort(),
        b.candidate_assessments[0]!.observation_context_declared_authority_assessments
          .map((w) => w.key)
          .sort()
      );
    });

    it("retains exact binding key, holder, power, scope, instant lineage", () => {
      const bindingSet =
        buildAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSet(
          {
            capability_requirement_set: mockRequirementSet(),
            project_state: mockProjectState(),
            specification: {
              bindings: [
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
      const binding =
        bindingSet.candidate_assessments[0]!
          .authority_observation_context_bindings[0]!;
      const set = buildPipeline({
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const wrapper = firstWrapper(set);
      assert.equal(
        wrapper.authority_observation_context_binding_key,
        binding.key
      );
      assert.equal(wrapper.authority_holder_entity_id, ENTITY_A);
      assert.equal(wrapper.authority_power, "AUTHORIZE_INTERVENTION");
      assert.deepEqual(wrapper.governance_scope, SCOPE_A);
      assert.equal(wrapper.governance_scope_key, binding.governance_scope_key);
      assert.equal(wrapper.authority_evaluation_at, AT);
      assert.notEqual(binding.candidate_key, wrapper.authority_holder_entity_id);
    });
  });

  describe("absence / NOT_APPLICABLE", () => {
    it("no bindings → zero wrappers; no GROUND-019 semantic dependency in output", () => {
      const set = buildPipeline({
        bindings: [],
        evaluationInstants: [],
      });
      assert.equal(
        firstCandidate(set).status,
        "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
      );
      assert.equal(
        firstCandidate(set).observation_context_declared_authority_assessments
          .length,
        0
      );
    });

    it("bindings + no instant → zero wrappers", () => {
      const set = buildPipeline({ evaluationInstants: [] });
      assert.equal(
        firstCandidate(set).status,
        "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED"
      );
      assert.equal(
        firstCandidate(set).observation_context_declared_authority_assessments
          .length,
        0
      );
    });

    it("no planning / no Requirements → zero wrappers", () => {
      const req = mockRequirementSet({
        candidates: [
          {
            candidate_key: "c1",
            status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
            requirements: [],
          },
          {
            candidate_key: "c2",
            status: "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED",
            requirements: [],
          },
        ],
      });
      const set = buildPipeline({
        bindings: [],
        evaluationInstants: [],
        requirementSet: req,
      });
      assert.equal(
        set.candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
      assert.equal(
        set.candidate_assessments[1]!.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
    });
  });

  describe("firewalls / determinism", () => {
    it("assessment record existence != Authority positive", () => {
      const withDecl = buildPipeline({
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const withoutDecl = buildPipeline({
        projectState: mockProjectState({ authority_declarations: [] }),
      });
      assert.equal(
        withDecl.candidate_assessments[0]!.status,
        "OBSERVATION_CONTEXT_DECLARED_AUTHORITY_ASSESSMENTS_PRESENT"
      );
      assert.equal(
        withoutDecl.candidate_assessments[0]!.status,
        "OBSERVATION_CONTEXT_DECLARED_AUTHORITY_ASSESSMENTS_PRESENT"
      );
      assertNoCanonicalAuthoritySemantics(withDecl);
      assertNoCanonicalAuthoritySemantics(withoutDecl);
    });

    it("determinism, deep-clone, input immutability", () => {
      const projectState = mockProjectState({
        authority_declarations: [authorityDeclaration()],
      });
      const bindingSet =
        buildAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSet(
          {
            capability_requirement_set: mockRequirementSet(),
            project_state: projectState,
            specification: {
              bindings: [
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
              evaluation_instants: [
                { candidate_key: "cand", authority_evaluation_at: AT },
              ],
            },
          }
        );
      const beforeProject = structuredClone(projectState);
      const beforeInstant = structuredClone(instantSet);

      const a =
        buildAttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentSet(
          {
            project_state: projectState,
            authority_evaluation_instant_set: instantSet,
          }
        );
      const b =
        buildAttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentSet(
          {
            project_state: projectState,
            authority_evaluation_instant_set: instantSet,
          }
        );
      assert.deepEqual(a, b);
      assert.deepEqual(projectState, beforeProject);
      assert.deepEqual(instantSet, beforeInstant);
    });

    it("malformed stale binding lineage rejects", () => {
      const bindingSet =
        buildAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSet(
          {
            capability_requirement_set: mockRequirementSet(),
            project_state: mockProjectState(),
            specification: {
              bindings: [
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
              evaluation_instants: [
                { candidate_key: "cand", authority_evaluation_at: AT },
              ],
            },
          }
        );
      const tampered = structuredClone(instantSet);
      tampered.candidate_assessments[0]!.authority_evaluation_instant!.candidate_key =
        "other";
      assert.throws(() =>
        buildAttentionObservationOperationalEligibilityObservationContextDeclaredAuthorityAssessmentSet(
          {
            project_state: mockProjectState(),
            authority_evaluation_instant_set: tampered,
          }
        )
      );
    });
  });

  describe("static proofs / schema / model limitations", () => {
    it("fixed model limitation order", () => {
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_OBSERVATION_CONTEXT_DECLARED_AUTHORITY_ASSESSMENT_MODEL_LIMITATIONS[0],
        "OPERATIONAL_ELIGIBILITY_AUTHORITY_PROVENANCE_ASSESSMENT_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_OBSERVATION_CONTEXT_DECLARED_AUTHORITY_ASSESSMENT_MODEL_LIMITATIONS.at(
          -1
        ),
        "EXECUTION_NOT_MODELED"
      );
    });

    it("schema 0.1.24; 019 only; no provenance/Permission/OE/wall-clock", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-observation-context-declared-authority-assessment-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-observation-context-declared-authority-assessment-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(/authority_evaluation_instant_set/.test(core));
      assert.ok(/assessDeclaredAuthority/.test(core));
      assert.ok(!/from ["'].*governance-provenance/.test(src));
      assert.ok(!/assessAuthorityProvenance/.test(src));
      assert.ok(!/from ["'].*permission-core/.test(src));
      assert.ok(!/assessPermissionIssuerGovernance/.test(src));
      assert.ok(
        !/from ["'].*attention-observation-operational-eligibility-authority-observation-context-binding-core/.test(
          core
        )
      );
      assert.ok(
        !/buildAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSet/.test(
          core
        )
      );
      assert.ok(
        !/from ["'].*operational-eligibility-dimension-policy-core/.test(src)
      );

      assert.ok(!/Date\.now\(/.test(core));
      assert.ok(!/new Date\(/.test(core));
      assert.ok(!/performance\.now\(/.test(core));
      assert.ok(!/\bsaveProject\s*\(/.test(core));
      assert.ok(!/\bapplyPatch\s*\(/.test(core));

      assert.ok(!/"AUTHORIZED"/.test(src));
      assert.ok(!/"UNAUTHORIZED"/.test(src));
      assert.ok(!/"can_execute"/.test(src));
      assert.ok(!/getApplicableAuthorityDeclarations/.test(core));
      assert.ok(!/isGovernanceDeclarationActiveAt/.test(core));
    });
  });
});
