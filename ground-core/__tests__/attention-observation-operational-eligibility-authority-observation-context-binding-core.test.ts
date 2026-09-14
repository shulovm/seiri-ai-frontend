/**
 * GROUND-108 — Observation Core LXII / Operational Eligibility AUTHORITY
 * Observation-Context Binding Foundation
 *
 * Pure 048 context + authority-holder RealityEntity validation + binding specification
 * (relation only; no Authority declaration assessment / OE).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_OBSERVATION_CONTEXT_BINDING_MODEL_LIMITATIONS,
  attentionObservationOperationalEligibilityAuthorityObservationContextBindingKey,
  buildAttentionObservationCapabilityRequirementSetKey,
  buildAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSet,
  normalizeAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSpecification,
} from "../reality/attention-observation-operational-eligibility-authority-observation-context-binding-core.js";
import type {
  AttentionObservationOperationalEligibilityAuthorityObservationContextBindingInput,
} from "../reality/attention-observation-operational-eligibility-authority-observation-context-binding-types.js";
import type {
  AttentionObservationCapabilityRequirementSetAssessment,
} from "../reality/attention-observation-capability-requirement-types.js";
import { governanceScopeKey } from "../reality/governance-core.js";
import type {
  AuthorityContestDeclaration,
  AuthorityDeclaration,
  AuthorityDelegationDeclaration,
  GovernanceScope,
  ProjectState,
  RealityEntity,
} from "../types.js";
import { SCHEMA_VERSION } from "../types.js";
import { PROJECT_ID } from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const NEED_KEY = "need";
const NEED_KEY_2 = "need-b";
const REQ_KEY = "attention-observation-capability-requirement|need|inspect";
const REQ_KEY_2 =
  "attention-observation-capability-requirement|need|human_inspection";
const REQ_KEY_3 =
  "attention-observation-capability-requirement|need|satellite_imaging";

const ENTITY_A = "f4010101-0101-4101-8101-010101010101";
const ENTITY_B = "f4010101-0101-4101-8101-010101010102";
const ENTITY_C = "f4010101-0101-4101-8101-010101010103";
const ENTITY_OTHER_PROJECT = "f4010101-0101-4101-8101-010101010199";
const AUTH_DECL_A = "f4040404-0404-4404-8404-040404040401";
const TS = "2026-08-24T10:00:00.000Z";

const SCOPE_A: GovernanceScope = {
  kind: "SUBJECT_STATE",
  subject_id: "subject-a",
  state_kind: "active",
};

const SCOPE_B: GovernanceScope = {
  kind: "REFERENCE_CONDITION",
  reference_condition_id: "ref-cond-b",
};

const SCOPE_C: GovernanceScope = {
  kind: "INTERVENTION_DECLARATION",
  intervention_id: "int-scope-c",
};

function assertNoAuthoritySemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"DECLARED_AUTHORITY_PRESENT"/.test(json));
  assert.ok(!/"NO_DECLARED_AUTHORITY"/.test(json));
  assert.ok(!/"AUTHORIZED"/.test(json));
  assert.ok(!/"UNAUTHORIZED"/.test(json));
  assert.ok(!/"AUTHORITY_PRESENT"/.test(json));
  assert.ok(!/"AUTHORITY_ABSENT"/.test(json));
  assert.ok(!/"authority_status"/.test(json));
  assert.ok(!/"authority_declaration_id"/.test(json));
  assert.ok(!/"delegation_declaration_id"/.test(json));
  assert.ok(!/"contest_declaration_id"/.test(json));
  assert.ok(!/"standing_declaration_id"/.test(json));
  assert.ok(!/"mandate_declaration_id"/.test(json));
  assert.ok(!/"effective_authority"/.test(json));
  assert.ok(!/"is_authorized"/.test(json));
  assert.ok(!/"authority_winner"/.test(json));
  assert.ok(!/"CONFLICTING_AUTHORITY"/.test(json));
  assert.ok(!/"CONTESTED_BINDINGS"/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"required_dimensions"/.test(json));
  assert.ok(!/"evaluation_at"/.test(json));
  assert.ok(!/"\bat\b"\s*:/.test(json));
  assert.ok(!/"permission_actor_entity_id"/.test(json));
  assert.ok(!/"permission_intervention_id"/.test(json));
  assert.ok(!/"intervention_id"\s*:/.test(json));
}

function entity(
  id: string,
  overrides: Partial<RealityEntity> = {}
): RealityEntity {
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

function authorityDeclaration(
  overrides: Partial<AuthorityDeclaration> = {}
): AuthorityDeclaration {
  return {
    id: AUTH_DECL_A,
    project_id: PROJECT_ID,
    holder_entity_id: ENTITY_A,
    power: "AUTHORIZE_INTERVENTION",
    scope: SCOPE_A,
    valid_from: TS,
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
    project: { id: PROJECT_ID } as ProjectState["project"],
    reality_entities: options?.entities ?? [
      entity(ENTITY_A),
      entity(ENTITY_B),
      entity(ENTITY_C),
    ],
    authority_declarations: options?.authority_declarations ?? [],
    authority_delegation_declarations:
      options?.authority_delegation_declarations ?? [],
    authority_contest_declarations:
      options?.authority_contest_declarations ?? [],
  } as ProjectState;
}

function mockRequirementSet(options?: {
  candidates?: {
    candidate_key: string;
    status?:
      | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      | "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED"
      | "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT";
    observation_need_key?: string;
    requirements?: { key: string; semantic: string }[];
  }[];
}): AttentionObservationCapabilityRequirementSetAssessment {
  const candidates = options?.candidates ?? [
    {
      candidate_key: "cand",
      status: "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT" as const,
      observation_need_key: NEED_KEY,
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
      const observation_need_key = c.observation_need_key ?? NEED_KEY;
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
                observation_need_key,
                requirements: requirements.map((r) => ({
                  key: r.key,
                  observation_need_key,
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

function bindingInput(
  overrides: Partial<AttentionObservationOperationalEligibilityAuthorityObservationContextBindingInput> = {}
): AttentionObservationOperationalEligibilityAuthorityObservationContextBindingInput {
  return {
    candidate_key: "cand",
    authority_holder_entity_id: ENTITY_A,
    authority_power: "AUTHORIZE_INTERVENTION",
    governance_scope: SCOPE_A,
    ...overrides,
  };
}

function buildSet(
  bindings: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingInput[],
  options?: {
    requirementSet?: AttentionObservationCapabilityRequirementSetAssessment;
    projectState?: ProjectState;
  }
) {
  return buildAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSet(
    {
      capability_requirement_set:
        options?.requirementSet ?? mockRequirementSet(),
      project_state: options?.projectState ?? mockProjectState(),
      specification: { bindings },
    }
  );
}

function firstCandidate(set: ReturnType<typeof buildSet>) {
  return set.candidate_assessments[0]!;
}

describe("GROUND-108 AUTHORITY Observation-Context Binding", () => {
  describe("basic binding / declaration independence", () => {
    it("basic explicit binding PRESENT; no Authority assessment", () => {
      const set = buildSet([bindingInput()]);
      const assessment = firstCandidate(set);
      assert.equal(
        assessment.status,
        "EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_PRESENT"
      );
      assert.equal(assessment.authority_observation_context_bindings.length, 1);
      assert.equal(
        assessment.has_explicit_authority_observation_context_bindings,
        true
      );
      assert.equal(
        assessment.has_multiple_explicit_authority_observation_context_bindings,
        false
      );
      const binding = assessment.authority_observation_context_bindings[0]!;
      assert.equal(binding.dimension, "AUTHORITY");
      assert.equal(binding.authority_holder_entity_id, ENTITY_A);
      assert.equal(binding.authority_power, "AUTHORIZE_INTERVENTION");
      assert.deepEqual(binding.governance_scope, SCOPE_A);
      assert.equal(binding.governance_scope_key, governanceScopeKey(SCOPE_A));
      assert.equal(binding.candidate_key, "cand");
      assert.equal(binding.observation_need_key, NEED_KEY);
      assert.equal(
        binding.capability_requirement_set_key,
        buildAttentionObservationCapabilityRequirementSetKey("cand", NEED_KEY, [
          REQ_KEY,
          REQ_KEY_2,
        ])
      );
      assertNoAuthoritySemantics(set);
    });

    it("binding valid with zero Authority declarations", () => {
      const set = buildSet([bindingInput()], {
        projectState: mockProjectState({ authority_declarations: [] }),
      });
      assert.equal(
        firstCandidate(set).status,
        "EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_PRESENT"
      );
      assertNoAuthoritySemantics(set);
    });

    it("Authority / Delegation / Contest declarations do not change binding", () => {
      const spec = [bindingInput()];
      const none = buildSet(spec, {
        projectState: mockProjectState({ authority_declarations: [] }),
      });
      const withAuthority = buildSet(spec, {
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
        }),
      });
      const withDelegation = buildSet(spec, {
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
          authority_delegation_declarations: [
            {
              id: "deleg-1",
              project_id: PROJECT_ID,
              delegator_entity_id: ENTITY_A,
              delegatee_entity_id: ENTITY_B,
              power: "AUTHORIZE_INTERVENTION",
              scope: SCOPE_A,
              source_authority_declaration_ids: [AUTH_DECL_A],
              valid_from: TS,
              valid_until: null,
              declared_by: { kind: "human", label: "ops" },
              recorded_at: TS,
              created_at: TS,
              updated_at: TS,
            },
          ],
        }),
      });
      const withContest = buildSet(spec, {
        projectState: mockProjectState({
          authority_declarations: [authorityDeclaration()],
          authority_contest_declarations: [
            {
              id: "contest-1",
              project_id: PROJECT_ID,
              contesting_entity_id: ENTITY_B,
              target: {
                kind: "AUTHORITY_DECLARATION",
                authority_declaration_id: AUTH_DECL_A,
              },
              note: null,
              valid_from: TS,
              valid_until: null,
              declared_by: { kind: "human", label: "ops" },
              recorded_at: TS,
              created_at: TS,
              updated_at: TS,
            },
          ],
        }),
      });

      assert.deepEqual(
        none.candidate_assessments[0]!.authority_observation_context_bindings,
        withAuthority.candidate_assessments[0]!
          .authority_observation_context_bindings
      );
      assert.deepEqual(
        withAuthority.candidate_assessments[0]!
          .authority_observation_context_bindings,
        withDelegation.candidate_assessments[0]!
          .authority_observation_context_bindings
      );
      assert.deepEqual(
        withDelegation.candidate_assessments[0]!
          .authority_observation_context_bindings,
        withContest.candidate_assessments[0]!.authority_observation_context_bindings
      );
      assertNoAuthoritySemantics(withContest);
    });
  });

  describe("duplicates / multiplicity / identity", () => {
    it("exact duplicate normalize; reorder same keys", () => {
      const a = buildSet([bindingInput(), bindingInput()]);
      assert.equal(a.specification.bindings.length, 1);
      assert.equal(
        firstCandidate(a).authority_observation_context_bindings.length,
        1
      );

      const b = buildSet([
        bindingInput({
          authority_holder_entity_id: ENTITY_B,
          authority_power: "GOVERN_OBJECTIVE",
          governance_scope: SCOPE_B,
        }),
        bindingInput(),
      ]);
      const c = buildSet([
        bindingInput(),
        bindingInput({
          authority_holder_entity_id: ENTITY_B,
          authority_power: "GOVERN_OBJECTIVE",
          governance_scope: SCOPE_B,
        }),
      ]);
      assert.deepEqual(
        b.candidate_assessments[0]!.authority_observation_context_bindings.map(
          (x) => x.key
        ),
        c.candidate_assessments[0]!.authority_observation_context_bindings.map(
          (x) => x.key
        )
      );
    });

    it("multiple distinct bindings retained; != conflict / ANY / ALL", () => {
      const set = buildSet([
        bindingInput(),
        bindingInput({
          authority_holder_entity_id: ENTITY_A,
          authority_power: "GOVERN_OBJECTIVE",
          governance_scope: SCOPE_B,
        }),
        bindingInput({
          authority_holder_entity_id: ENTITY_B,
          authority_power: "AUTHORIZE_INTERVENTION",
          governance_scope: SCOPE_A,
        }),
      ]);
      assert.equal(
        firstCandidate(set).authority_observation_context_bindings.length,
        3
      );
      assert.equal(
        firstCandidate(set).has_multiple_explicit_authority_observation_context_bindings,
        true
      );
      assert.equal(
        set.has_multiple_explicit_authority_observation_context_bindings,
        true
      );
      const json = JSON.stringify(set);
      assert.ok(!/"CONFLICT"/.test(json));
      assert.ok(!/"CONTESTED"/.test(json));
      assert.ok(!/"ANY"/.test(json));
      assert.ok(!/"ALL"/.test(json));
    });

    it("holder / power / scope / Requirement-set change identity; Requirement reorder invariant", () => {
      const base = firstCandidate(buildSet([bindingInput()]))
        .authority_observation_context_bindings[0]!;

      const holderChanged = firstCandidate(
        buildSet([bindingInput({ authority_holder_entity_id: ENTITY_B })])
      ).authority_observation_context_bindings[0]!;
      assert.notEqual(base.key, holderChanged.key);

      const powerChanged = firstCandidate(
        buildSet([
          bindingInput({ authority_power: "ESTABLISH_REFERENCE" }),
        ])
      ).authority_observation_context_bindings[0]!;
      assert.notEqual(base.key, powerChanged.key);

      const scopeChanged = firstCandidate(
        buildSet([bindingInput({ governance_scope: SCOPE_B })])
      ).authority_observation_context_bindings[0]!;
      assert.notEqual(base.key, scopeChanged.key);

      const setChanged = firstCandidate(
        buildSet([bindingInput()], {
          requirementSet: mockRequirementSet({
            candidates: [
              {
                candidate_key: "cand",
                requirements: [
                  { key: REQ_KEY, semantic: "inspect" },
                  { key: REQ_KEY_2, semantic: "human_inspection" },
                  { key: REQ_KEY_3, semantic: "satellite_imaging" },
                ],
              },
            ],
          }),
        })
      ).authority_observation_context_bindings[0]!;
      assert.notEqual(base.key, setChanged.key);

      const reorderedReqs = firstCandidate(
        buildSet([bindingInput()], {
          requirementSet: mockRequirementSet({
            candidates: [
              {
                candidate_key: "cand",
                requirements: [
                  { key: REQ_KEY_2, semantic: "human_inspection" },
                  { key: REQ_KEY, semantic: "inspect" },
                ],
              },
            ],
          }),
        })
      ).authority_observation_context_bindings[0]!;
      assert.equal(base.key, reorderedReqs.key);
      assert.equal(
        base.key,
        attentionObservationOperationalEligibilityAuthorityObservationContextBindingKey(
          "cand",
          NEED_KEY,
          base.capability_requirement_set_key,
          ENTITY_A,
          "AUTHORIZE_INTERVENTION",
          governanceScopeKey(SCOPE_A)
        )
      );
    });

    it("equivalent cloned GovernanceScope → same binding key", () => {
      const a = firstCandidate(
        buildSet([bindingInput({ governance_scope: structuredClone(SCOPE_A) })])
      ).authority_observation_context_bindings[0]!;
      const b = firstCandidate(
        buildSet([bindingInput({ governance_scope: { ...SCOPE_A } })])
      ).authority_observation_context_bindings[0]!;
      assert.equal(a.key, b.key);
    });
  });

  describe("validation / absence / NOT_APPLICABLE", () => {
    it("unknown holder / cross-project reject", () => {
      assert.throws(() =>
        buildSet([
          bindingInput({ authority_holder_entity_id: "missing-holder" }),
        ])
      );
      assert.throws(() =>
        buildSet(
          [bindingInput({ authority_holder_entity_id: ENTITY_OTHER_PROJECT })],
          {
            projectState: mockProjectState({
              entities: [
                entity(ENTITY_A),
                entity(ENTITY_OTHER_PROJECT, {
                  project_id: "other-project-id",
                }),
              ],
            }),
          }
        )
      );
    });

    it("no binding != Authority negative; empty spec no Authority semantics", () => {
      const set = buildSet([]);
      assert.equal(
        firstCandidate(set).status,
        "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
      );
      assert.equal(
        firstCandidate(set).authority_observation_context_bindings.length,
        0
      );
      assert.equal(
        firstCandidate(set).has_explicit_authority_observation_context_bindings,
        false
      );
      assert.equal(set.has_explicit_authority_observation_context_bindings, false);
      assertNoAuthoritySemantics(set);
    });

    it("no planning / no Requirements NOT_APPLICABLE; binding on non-applicable rejects", () => {
      const set = buildSet([], {
        requirementSet: mockRequirementSet({
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
        }),
      });
      assert.equal(
        set.candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
      assert.equal(
        set.candidate_assessments[1]!.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );

      assert.throws(() =>
        buildSet([bindingInput({ candidate_key: "c1" })], {
          requirementSet: mockRequirementSet({
            candidates: [
              {
                candidate_key: "c1",
                status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
                requirements: [],
              },
            ],
          }),
        })
      );

      assert.throws(() =>
        buildSet([bindingInput({ candidate_key: "missing" })])
      );
    });

    it("conflicting GovernanceScope representation for same triple rejects", () => {
      const scopeWithExtra = {
        ...SCOPE_A,
        _extra: "contradictory",
      } as GovernanceScope & { _extra: string };
      assert.throws(() =>
        normalizeAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSpecification(
          mockRequirementSet(),
          mockProjectState(),
          {
            bindings: [
              bindingInput({ governance_scope: SCOPE_A }),
              bindingInput({ governance_scope: scopeWithExtra }),
            ],
          }
        )
      );
    });

    it("unknown AuthorityPower rejects", () => {
      assert.throws(() =>
        buildSet([
          bindingInput({
            authority_power: "UNKNOWN_POWER" as never,
          }),
        ])
      );
    });
  });

  describe("Candidate / holder firewall", () => {
    it("Candidate entity != Authority holder is valid; explicit only", () => {
      const set = buildSet([
        bindingInput({
          authority_holder_entity_id: ENTITY_B,
        }),
      ]);
      const binding =
        firstCandidate(set).authority_observation_context_bindings[0]!;
      assert.notEqual(binding.candidate_key, binding.authority_holder_entity_id);
      assert.equal(binding.authority_holder_entity_id, ENTITY_B);
    });

    it("Candidate entity == Authority holder valid only when specification says so", () => {
      const set = buildSet(
        [
          bindingInput({
            candidate_key: ENTITY_A,
            authority_holder_entity_id: ENTITY_A,
          }),
        ],
        {
          requirementSet: mockRequirementSet({
            candidates: [
              {
                candidate_key: ENTITY_A,
                requirements: [{ key: REQ_KEY, semantic: "inspect" }],
              },
            ],
          }),
        }
      );
      const binding =
        firstCandidate(set).authority_observation_context_bindings[0]!;
      assert.equal(binding.candidate_key, binding.authority_holder_entity_id);
    });
  });

  describe("isolation / determinism / firewalls", () => {
    it("cross-Candidate isolation; holder != Candidate identity; scope != Need identity", () => {
      const set = buildSet(
        [
          bindingInput({
            candidate_key: "b",
            authority_holder_entity_id: ENTITY_B,
            authority_power: "GOVERN_OBJECTIVE",
            governance_scope: SCOPE_B,
          }),
          bindingInput({
            candidate_key: "a",
            authority_holder_entity_id: ENTITY_A,
            governance_scope: SCOPE_A,
          }),
        ],
        {
          requirementSet: mockRequirementSet({
            candidates: [
              {
                candidate_key: "a",
                observation_need_key: NEED_KEY,
                requirements: [{ key: REQ_KEY, semantic: "inspect" }],
              },
              {
                candidate_key: "b",
                observation_need_key: NEED_KEY_2,
                requirements: [{ key: REQ_KEY_2, semantic: "human_inspection" }],
              },
            ],
          }),
        }
      );
      assert.equal(set.candidate_assessments[0]!.candidate_key, "a");
      assert.equal(set.candidate_assessments[1]!.candidate_key, "b");
      assert.notEqual(
        set.candidate_assessments[0]!.authority_observation_context_bindings[0]!
          .key,
        set.candidate_assessments[1]!.authority_observation_context_bindings[0]!
          .key
      );
      const bindingA =
        set.candidate_assessments[0]!.authority_observation_context_bindings[0]!;
      assert.notEqual(
        bindingA.observation_need_key,
        JSON.stringify(bindingA.governance_scope)
      );
      assert.equal(
        Object.prototype.hasOwnProperty.call(bindingA, "permission_actor_entity_id"),
        false
      );
      assert.equal(
        Object.prototype.hasOwnProperty.call(bindingA, "intervention_id"),
        false
      );
    });

    it("determinism, deep-clone, input immutability, no pointer identity", () => {
      const requirementSet = mockRequirementSet();
      const projectState = mockProjectState({
        authority_declarations: [authorityDeclaration()],
      });
      const specification = {
        bindings: [
          bindingInput({
            authority_holder_entity_id: ENTITY_B,
            authority_power: "GOVERN_OBJECTIVE",
            governance_scope: SCOPE_B,
          }),
          bindingInput({
            authority_holder_entity_id: ENTITY_C,
            governance_scope: SCOPE_C,
          }),
        ],
      };
      const beforeReq = structuredClone(requirementSet);
      const beforeProject = structuredClone(projectState);
      const beforeSpec = structuredClone(specification);

      const a =
        buildAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSet(
          {
            capability_requirement_set: requirementSet,
            project_state: projectState,
            specification,
          }
        );
      const b =
        buildAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSet(
          {
            capability_requirement_set: requirementSet,
            project_state: projectState,
            specification,
          }
        );
      assert.deepEqual(a, b);
      assert.deepEqual(requirementSet, beforeReq);
      assert.deepEqual(projectState, beforeProject);
      assert.deepEqual(specification, beforeSpec);

      const cloned = {
        capability_requirement_set: structuredClone(requirementSet),
        project_state: structuredClone(projectState),
        specification: structuredClone(specification),
      };
      const c =
        buildAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSet(
          cloned
        );
      assert.deepEqual(a, c);
      assert.notEqual(
        a.capability_requirement_set,
        cloned.capability_requirement_set
      );
    });
  });

  describe("static proofs / schema / model limitations", () => {
    it("fixed model limitation order", () => {
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_OBSERVATION_CONTEXT_BINDING_MODEL_LIMITATIONS[0],
        "OPERATIONAL_ELIGIBILITY_AUTHORITY_EVALUATION_INSTANT_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_OBSERVATION_CONTEXT_BINDING_MODEL_LIMITATIONS.at(
          -1
        ),
        "EXECUTION_NOT_MODELED"
      );
    });

    it("schema 0.1.24; no Authority assessment / Permission / OE / 084–106", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-observation-context-binding-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-observation-context-binding-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(/capability_requirement_set/.test(core));
      assert.ok(/reality_entities/.test(core));
      assert.ok(!/projectState\.authority_declarations/.test(core));
      assert.ok(!/project_state\.authority_declarations/.test(core));
      assert.ok(!/delegation_declarations/.test(core));
      assert.ok(!/contest_declarations/.test(core));
      assert.ok(!/standing_declarations/.test(core));
      assert.ok(!/mandate_declarations/.test(core));
      assert.ok(!/assessDeclaredAuthority/.test(src));
      assert.ok(!/assessAuthorityProvenance/.test(src));
      assert.ok(!/from ["'].*permission-core/.test(src));
      assert.ok(!/assessPermissionIssuerGovernance/.test(src));
      assert.ok(!/assessInterventionPermissionGovernance/.test(src));
      assert.ok(
        !/from ["'].*operational-eligibility-dimension-policy-core/.test(src)
      );
      assert.ok(
        !/from ["'].*operational-eligibility-capability-state-source-core/.test(
          src
        )
      );
      assert.ok(
        !/from ["'].*operational-eligibility-permission-dimension-satisfaction-state-core/.test(
          src
        )
      );
      assert.ok(!/\.required_dimensions\b/.test(core));
      assert.ok(!/required_dimensions\s*:/.test(types));

      assert.ok(!/Date\.now\(/.test(core));
      assert.ok(!/new Date\(/.test(core));
      assert.ok(!/performance\.now\(/.test(core));
      assert.ok(!/\bsaveProject\s*\(/.test(core));
      assert.ok(!/\bapplyPatch\s*\(/.test(core));
      assert.ok(!/\bStatePatch\b/.test(types));

      assert.ok(!/authority_declaration_id\s*:/.test(src));
      assert.ok(!/delegation_declaration_id\s*:/.test(src));
      assert.ok(!/permission_actor_entity_id\s*:/.test(src));
      assert.ok(!/permission_intervention_id\s*:/.test(src));
      assert.ok(!/\bat\s*:/.test(types));
      assert.ok(!/evaluation_at\s*:/.test(src));
      assert.ok(!/"AUTHORIZED"/.test(src));
      assert.ok(!/"UNAUTHORIZED"/.test(src));
      assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(src));
      assert.ok(!/"can_execute"/.test(src));
      assert.ok(
        !/selectObserver|assignObserver|dispatchObservation|scheduleObservation/.test(
          src
        )
      );

      assert.ok(/governanceScopeKey/.test(core));
      assert.ok(!/assessDeclaredAuthority/.test(core));
      assert.ok(!/governanceScopesEqual/.test(core));
    });

    it("normalize rejects empty candidate key", () => {
      assert.throws(() =>
        normalizeAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSpecification(
          mockRequirementSet(),
          mockProjectState(),
          {
            bindings: [bindingInput({ candidate_key: "  " })],
          }
        )
      );
    });
  });
});
