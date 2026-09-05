/**
 * GROUND-109 — Observation Core LXIII / Explicit Operational Eligibility AUTHORITY
 * Evaluation Instant Foundation
 *
 * Pure 108 binding assessment + explicit evaluation instant specification
 * (temporal context only; no Authority declaration assessment / OE).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVALUATION_INSTANT_MODEL_LIMITATIONS,
  assertAuthorityEvaluationAt,
  attentionObservationOperationalEligibilityAuthorityEvaluationInstantKey,
  buildAttentionObservationOperationalEligibilityAuthorityEvaluationInstantSet,
  normalizeAttentionObservationOperationalEligibilityAuthorityEvaluationInstantSpecification,
} from "../reality/attention-observation-operational-eligibility-authority-evaluation-instant-core.js";
import {
  buildAttentionObservationCapabilityRequirementSetKey,
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
import { PROJECT_ID } from "./fixtures.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const NEED_KEY = "need";
const REQ_KEY = "attention-observation-capability-requirement|need|inspect";
const REQ_KEY_2 =
  "attention-observation-capability-requirement|need|human_inspection";

const ENTITY_A = "f4010101-0101-4101-8101-010101010101";
const ENTITY_B = "f4010101-0101-4101-8101-010101010102";
const TS = "2026-08-24T10:00:00.000Z";
const AT = "2026-08-24T11:00:00.000Z";
const AT_ALT = "2026-08-24T11:30:00.000Z";

const SCOPE_A: GovernanceScope = {
  kind: "SUBJECT_STATE",
  subject_id: "subject-a",
  state_kind: "active",
};

const SCOPE_B: GovernanceScope = {
  kind: "REFERENCE_CONDITION",
  reference_condition_id: "ref-cond-b",
};

function assertNoAuthorityAssessmentSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"DECLARED_AUTHORITY_PRESENT"/.test(json));
  assert.ok(!/"NO_DECLARED_AUTHORITY"/.test(json));
  assert.ok(!/"AUTHORIZED"/.test(json));
  assert.ok(!/"UNAUTHORIZED"/.test(json));
  assert.ok(!/"AUTHORITY_PRESENT"/.test(json));
  assert.ok(!/"AUTHORITY_ABSENT"/.test(json));
  assert.ok(!/"authority_declaration_id"/.test(json));
  assert.ok(!/"effective_authority"/.test(json));
  assert.ok(!/"is_authorized"/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"required_dimensions"/.test(json));
  assert.ok(!/"permission_actor_entity_id"/.test(json));
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
    project: { id: PROJECT_ID } as ProjectState["project"],
    reality_entities: [entity(ENTITY_A), entity(ENTITY_B)],
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

function buildBindingSet(
  bindings: {
    candidate_key: string;
    authority_holder_entity_id: string;
    authority_power:
      | "ESTABLISH_REFERENCE"
      | "GOVERN_OBJECTIVE"
      | "DECLARE_IMPACT"
      | "DECLARE_IMPACT_MEASURE"
      | "AUTHORIZE_INTERVENTION";
    governance_scope: GovernanceScope;
  }[],
  options?: {
    requirementSet?: AttentionObservationCapabilityRequirementSetAssessment;
  }
): AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSetAssessment {
  return buildAttentionObservationOperationalEligibilityAuthorityObservationContextBindingSet(
    {
      capability_requirement_set:
        options?.requirementSet ?? mockRequirementSet(),
      project_state: mockProjectState(),
      specification: { bindings },
    }
  );
}

function buildInstantSet(
  bindingSet: AttentionObservationOperationalEligibilityAuthorityObservationContextBindingSetAssessment,
  evaluationInstants: { candidate_key: string; authority_evaluation_at: string }[]
) {
  return buildAttentionObservationOperationalEligibilityAuthorityEvaluationInstantSet(
    {
      authority_observation_context_binding_set: bindingSet,
      specification: { evaluation_instants: evaluationInstants },
    }
  );
}

function firstCandidate(set: ReturnType<typeof buildInstantSet>) {
  return set.candidate_assessments[0]!;
}

describe("GROUND-109 Explicit AUTHORITY Evaluation Instant", () => {
  describe("basic instant / binding lineage", () => {
    it("one binding + explicit instant → PRESENT; exactly one instant", () => {
      const bindingSet = buildBindingSet([
        {
          candidate_key: "cand",
          authority_holder_entity_id: ENTITY_A,
          authority_power: "AUTHORIZE_INTERVENTION",
          governance_scope: SCOPE_A,
        },
      ]);
      const set = buildInstantSet(bindingSet, [
        { candidate_key: "cand", authority_evaluation_at: AT },
      ]);
      const assessment = firstCandidate(set);
      assert.equal(
        assessment.status,
        "EXPLICIT_AUTHORITY_EVALUATION_INSTANT_PRESENT"
      );
      assert.equal(assessment.has_explicit_authority_evaluation_instant, true);
      assert.ok(assessment.authority_evaluation_instant);
      assert.equal(
        assessment.authority_evaluation_instant!.authority_evaluation_at,
        AT
      );
      assert.equal(
        assessment.authority_observation_context_binding_assessment
          .authority_observation_context_bindings.length,
        1
      );
      assertNoAuthorityAssessmentSemantics(set);
    });

    it("multiple bindings + one instant; no per-binding instant records", () => {
      const bindingSet = buildBindingSet([
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
      ]);
      const set = buildInstantSet(bindingSet, [
        { candidate_key: "cand", authority_evaluation_at: AT },
      ]);
      const assessment = firstCandidate(set);
      assert.equal(
        assessment.status,
        "EXPLICIT_AUTHORITY_EVALUATION_INSTANT_PRESENT"
      );
      assert.equal(
        assessment.authority_observation_context_binding_assessment
          .authority_observation_context_bindings.length,
        2
      );
      assert.ok(assessment.authority_evaluation_instant);
      assert.equal(
        Object.prototype.hasOwnProperty.call(
          assessment.authority_evaluation_instant!,
          "authority_observation_context_binding_key"
        ),
        false
      );
      assert.equal(
        Object.prototype.hasOwnProperty.call(
          assessment.authority_evaluation_instant!,
          "authority_holder_entity_id"
        ),
        false
      );
      assert.equal(
        Object.prototype.hasOwnProperty.call(
          assessment.authority_evaluation_instant!,
          "authority_power"
        ),
        false
      );
      assert.equal(
        Object.prototype.hasOwnProperty.call(
          assessment.authority_evaluation_instant!,
          "governance_scope"
        ),
        false
      );
    });

    it("bindings + no instant → NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED", () => {
      const bindingSet = buildBindingSet([
        {
          candidate_key: "cand",
          authority_holder_entity_id: ENTITY_A,
          authority_power: "AUTHORIZE_INTERVENTION",
          governance_scope: SCOPE_A,
        },
      ]);
      const set = buildInstantSet(bindingSet, []);
      assert.equal(
        firstCandidate(set).status,
        "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED"
      );
      assert.equal(firstCandidate(set).authority_evaluation_instant, null);
      assert.equal(
        firstCandidate(set).has_explicit_authority_evaluation_instant,
        false
      );
      assertNoAuthorityAssessmentSemantics(set);
    });

    it("no bindings + no instant → NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED", () => {
      const bindingSet = buildBindingSet([]);
      const set = buildInstantSet(bindingSet, []);
      assert.equal(
        firstCandidate(set).status,
        "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
      );
      assert.equal(firstCandidate(set).authority_evaluation_instant, null);
    });
  });

  describe("validation / rejection", () => {
    it("no bindings + supplied instant rejects dangling specification", () => {
      const bindingSet = buildBindingSet([]);
      assert.throws(() =>
        buildInstantSet(bindingSet, [
          { candidate_key: "cand", authority_evaluation_at: AT },
        ])
      );
    });

    it("no planning / no Requirements outer + supplied instant reject", () => {
      const noPlanning = buildBindingSet([], {
        requirementSet: mockRequirementSet({
          candidates: [
            {
              candidate_key: "c1",
              status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
              requirements: [],
            },
          ],
        }),
      });
      assert.throws(() =>
        buildInstantSet(noPlanning, [
          { candidate_key: "c1", authority_evaluation_at: AT },
        ])
      );

      const noReqs = buildBindingSet([], {
        requirementSet: mockRequirementSet({
          candidates: [
            {
              candidate_key: "c2",
              status: "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED",
              requirements: [],
            },
          ],
        }),
      });
      assert.throws(() =>
        buildInstantSet(noReqs, [
          { candidate_key: "c2", authority_evaluation_at: AT },
        ])
      );
    });

    it("unknown Candidate rejects", () => {
      const bindingSet = buildBindingSet([
        {
          candidate_key: "cand",
          authority_holder_entity_id: ENTITY_A,
          authority_power: "AUTHORIZE_INTERVENTION",
          governance_scope: SCOPE_A,
        },
      ]);
      assert.throws(() =>
        buildInstantSet(bindingSet, [
          { candidate_key: "missing", authority_evaluation_at: AT },
        ])
      );
    });

    it("duplicate same instant normalizes; conflicting instants reject", () => {
      const bindingSet = buildBindingSet([
        {
          candidate_key: "cand",
          authority_holder_entity_id: ENTITY_A,
          authority_power: "AUTHORIZE_INTERVENTION",
          governance_scope: SCOPE_A,
        },
      ]);

      const dup = buildInstantSet(bindingSet, [
        { candidate_key: "cand", authority_evaluation_at: AT },
        { candidate_key: "cand", authority_evaluation_at: AT },
      ]);
      assert.equal(dup.specification.evaluation_instants.length, 1);

      assert.throws(() =>
        buildInstantSet(bindingSet, [
          { candidate_key: "cand", authority_evaluation_at: AT },
          { candidate_key: "cand", authority_evaluation_at: AT_ALT },
        ])
      );
    });

    it("specification-order invariance; no latest-wins / earliest-wins", () => {
      const bindingSet = buildBindingSet([
        {
          candidate_key: "cand",
          authority_holder_entity_id: ENTITY_A,
          authority_power: "AUTHORIZE_INTERVENTION",
          governance_scope: SCOPE_A,
        },
      ]);
      const a = buildInstantSet(bindingSet, [
        { candidate_key: "cand", authority_evaluation_at: AT },
      ]);
      const b = buildInstantSet(bindingSet, [
        { candidate_key: "cand", authority_evaluation_at: AT },
      ]);
      assert.deepEqual(a, b);
    });

    it("malformed authority_evaluation_at rejects", () => {
      assert.throws(() => assertAuthorityEvaluationAt("not-an-instant"));
      assert.throws(() => assertAuthorityEvaluationAt(""));
    });
  });

  describe("identity / binding-set stability", () => {
    it("instant key excludes binding key / holder / power / scope", () => {
      const reqSetKey = buildAttentionObservationCapabilityRequirementSetKey(
        "cand",
        NEED_KEY,
        [REQ_KEY, REQ_KEY_2]
      );
      const key = attentionObservationOperationalEligibilityAuthorityEvaluationInstantKey(
        "cand",
        NEED_KEY,
        reqSetKey,
        AT
      );
      assert.equal(
        key,
        [
          "attention-observation-operational-eligibility-authority-evaluation-instant",
          "cand",
          NEED_KEY,
          reqSetKey,
          "AUTHORITY",
          AT,
        ].join("|")
      );
    });

    it("instant changes → key changes; candidate/context changes → key changes", () => {
      const bindingSet = buildBindingSet([
        {
          candidate_key: "cand",
          authority_holder_entity_id: ENTITY_A,
          authority_power: "AUTHORIZE_INTERVENTION",
          governance_scope: SCOPE_A,
        },
      ]);
      const atA = buildInstantSet(bindingSet, [
        { candidate_key: "cand", authority_evaluation_at: AT },
      ]).candidate_assessments[0]!.authority_evaluation_instant!.key;
      const atB = buildInstantSet(bindingSet, [
        { candidate_key: "cand", authority_evaluation_at: AT_ALT },
      ]).candidate_assessments[0]!.authority_evaluation_instant!.key;
      assert.notEqual(atA, atB);
    });

    it("binding set changes, same candidate context + same instant → instant key unchanged", () => {
      const oneBinding = buildBindingSet([
        {
          candidate_key: "cand",
          authority_holder_entity_id: ENTITY_A,
          authority_power: "AUTHORIZE_INTERVENTION",
          governance_scope: SCOPE_A,
        },
      ]);
      const twoBindings = buildBindingSet([
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
      ]);

      const one = buildInstantSet(oneBinding, [
        { candidate_key: "cand", authority_evaluation_at: AT },
      ]);
      const two = buildInstantSet(twoBindings, [
        { candidate_key: "cand", authority_evaluation_at: AT },
      ]);

      assert.equal(
        one.candidate_assessments[0]!.authority_evaluation_instant!.key,
        two.candidate_assessments[0]!.authority_evaluation_instant!.key
      );
      assert.equal(
        one.candidate_assessments[0]!.authority_observation_context_binding_assessment
          .authority_observation_context_bindings.length,
        1
      );
      assert.equal(
        two.candidate_assessments[0]!.authority_observation_context_binding_assessment
          .authority_observation_context_bindings.length,
        2
      );
    });

    it("same instant + binding order changes → same instant identity", () => {
      const orderedA = buildBindingSet([
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
      ]);
      const orderedB = buildBindingSet([
        {
          candidate_key: "cand",
          authority_holder_entity_id: ENTITY_B,
          authority_power: "GOVERN_OBJECTIVE",
          governance_scope: SCOPE_B,
        },
        {
          candidate_key: "cand",
          authority_holder_entity_id: ENTITY_A,
          authority_power: "AUTHORIZE_INTERVENTION",
          governance_scope: SCOPE_A,
        },
      ]);

      const a = buildInstantSet(orderedA, [
        { candidate_key: "cand", authority_evaluation_at: AT },
      ]);
      const b = buildInstantSet(orderedB, [
        { candidate_key: "cand", authority_evaluation_at: AT },
      ]);
      assert.equal(
        a.candidate_assessments[0]!.authority_evaluation_instant!.key,
        b.candidate_assessments[0]!.authority_evaluation_instant!.key
      );
    });
  });

  describe("NOT_APPLICABLE propagation", () => {
    it("no planning / no Requirements propagate outer status; instant null", () => {
      const bindingSet = buildBindingSet([], {
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
      const set = buildInstantSet(bindingSet, []);
      assert.equal(
        set.candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
      assert.equal(
        set.candidate_assessments[1]!.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
      assert.equal(set.candidate_assessments[0]!.authority_evaluation_instant, null);
      assert.equal(set.candidate_assessments[1]!.authority_evaluation_instant, null);
    });
  });

  describe("isolation / determinism / firewalls", () => {
    it("determinism, deep-clone, input immutability, no pointer identity", () => {
      const bindingSet = buildBindingSet([
        {
          candidate_key: "cand",
          authority_holder_entity_id: ENTITY_A,
          authority_power: "AUTHORIZE_INTERVENTION",
          governance_scope: SCOPE_A,
        },
      ]);
      const specification = {
        evaluation_instants: [
          { candidate_key: "cand", authority_evaluation_at: AT },
        ],
      };
      const beforeBinding = structuredClone(bindingSet);
      const beforeSpec = structuredClone(specification);

      const a = buildAttentionObservationOperationalEligibilityAuthorityEvaluationInstantSet(
        {
          authority_observation_context_binding_set: bindingSet,
          specification,
        }
      );
      const b = buildAttentionObservationOperationalEligibilityAuthorityEvaluationInstantSet(
        {
          authority_observation_context_binding_set: bindingSet,
          specification,
        }
      );
      assert.deepEqual(a, b);
      assert.deepEqual(bindingSet, beforeBinding);
      assert.deepEqual(specification, beforeSpec);

      const cloned = {
        authority_observation_context_binding_set: structuredClone(bindingSet),
        specification: structuredClone(specification),
      };
      const c =
        buildAttentionObservationOperationalEligibilityAuthorityEvaluationInstantSet(
          cloned
        );
      assert.deepEqual(a, c);
      assert.notEqual(
        a.authority_observation_context_binding_set,
        cloned.authority_observation_context_binding_set
      );
    });

    it("instant PRESENT != Authority positive; instant absent != Authority negative", () => {
      const bindingSet = buildBindingSet([
        {
          candidate_key: "cand",
          authority_holder_entity_id: ENTITY_A,
          authority_power: "AUTHORIZE_INTERVENTION",
          governance_scope: SCOPE_A,
        },
      ]);
      const withInstant = buildInstantSet(bindingSet, [
        { candidate_key: "cand", authority_evaluation_at: AT },
      ]);
      const withoutInstant = buildInstantSet(bindingSet, []);
      assertNoAuthorityAssessmentSemantics(withInstant);
      assertNoAuthorityAssessmentSemantics(withoutInstant);
      assert.equal(
        withInstant.candidate_assessments[0]!.status,
        "EXPLICIT_AUTHORITY_EVALUATION_INSTANT_PRESENT"
      );
      assert.equal(
        withoutInstant.candidate_assessments[0]!.status,
        "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED"
      );
    });
  });

  describe("static proofs / schema / model limitations", () => {
    it("fixed model limitation order", () => {
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVALUATION_INSTANT_MODEL_LIMITATIONS[0],
        "OPERATIONAL_ELIGIBILITY_AUTHORITY_DECLARED_ASSESSMENT_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_EVALUATION_INSTANT_MODEL_LIMITATIONS.at(
          -1
        ),
        "EXECUTION_NOT_MODELED"
      );
    });

    it("schema 0.1.24; no ProjectState / Governance / OE / wall-clock", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-evaluation-instant-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-evaluation-instant-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(/authority_observation_context_binding_set/.test(core));
      assert.ok(!/ProjectState/.test(core));
      assert.ok(!/project_state/.test(core));
      assert.ok(!/reality_entities/.test(core));
      assert.ok(!/authority_declarations/.test(core));
      assert.ok(!/assessDeclaredAuthority/.test(src));
      assert.ok(!/assessAuthorityProvenance/.test(src));
      assert.ok(!/from ["'].*governance-core/.test(core));
      assert.ok(!/from ["'].*permission-core/.test(src));
      assert.ok(
        !/from ["'].*operational-eligibility-dimension-policy-core/.test(src)
      );
      assert.ok(!/from ["'].*capability-requirement-types/.test(core));
      assert.ok(
        !/buildAttentionObservationCapabilityRequirementSet\(/.test(core)
      );

      assert.ok(!/Date\.now\(/.test(core));
      assert.ok(!/new Date\(/.test(core));
      assert.ok(!/performance\.now\(/.test(core));
      assert.ok(!/\bsaveProject\s*\(/.test(core));
      assert.ok(!/\bapplyPatch\s*\(/.test(core));
      assert.ok(!/\bStatePatch\b/.test(types));

      assert.ok(!/authority_observation_context_binding_key/.test(types));
      assert.ok(!/authority_holder_entity_id/.test(types));
      assert.ok(!/authority_power/.test(types));
      assert.ok(!/governance_scope/.test(types));
      assert.ok(!/authority_declaration_id/.test(src));
      assert.ok(!/"AUTHORIZED"/.test(src));
      assert.ok(!/"UNAUTHORIZED"/.test(src));
      assert.ok(!/"can_execute"/.test(src));
    });

    it("normalize rejects empty candidate key", () => {
      const bindingSet = buildBindingSet([
        {
          candidate_key: "cand",
          authority_holder_entity_id: ENTITY_A,
          authority_power: "AUTHORIZE_INTERVENTION",
          governance_scope: SCOPE_A,
        },
      ]);
      assert.throws(() =>
        normalizeAttentionObservationOperationalEligibilityAuthorityEvaluationInstantSpecification(
          bindingSet,
          {
            evaluation_instants: [
              { candidate_key: "  ", authority_evaluation_at: AT },
            ],
          }
        )
      );
    });
  });
});
