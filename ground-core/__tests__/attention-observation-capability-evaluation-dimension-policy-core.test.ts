/**
 * GROUND-061 — Observation Core XV / Explicit Capability Evaluation Dimension Policy
 *
 * Pure 048 Capability Requirement + explicit Evaluation Dimension Policy Specification
 * (Requirement-side sibling of 054/056; no 050–060 / acceptance / satisfaction).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { buildAttentionObservationEligibilitySet } from "../reality/attention-observation-eligibility-core.js";
import { buildAttentionObservationPlanningSet } from "../reality/attention-observation-planning-core.js";
import {
  attentionObservationCapabilityRequirementKey,
  buildAttentionObservationCapabilityRequirementSet,
} from "../reality/attention-observation-capability-requirement-core.js";
import {
  ATTENTION_OBSERVATION_CAPABILITY_EVALUATION_DIMENSIONS,
  ATTENTION_OBSERVATION_CAPABILITY_EVALUATION_DIMENSION_POLICY_MODEL_LIMITATIONS,
  attentionObservationCapabilityEvaluationDimensionPolicyKey,
  buildAttentionObservationCapabilityEvaluationDimensionPolicySet,
  buildCanonicalCapabilityEvaluationDimensionSetKey,
  normalizeAttentionObservationCapabilityEvaluationDimensionPolicySpecification,
  normalizeRequiredDimensions,
} from "../reality/attention-observation-capability-evaluation-dimension-policy-core.js";
import type { AttentionObservationCapabilityEvaluationDimension } from "../reality/attention-observation-capability-evaluation-dimension-policy-types.js";
import type {
  AttentionCandidate,
  AttentionCandidateSetAssessment,
} from "../reality/attention-candidate-types.js";
import type { ObservationNeed } from "../reality/observation-need-types.js";
import type {
  SalienceSignal,
  SalienceSignalKind,
} from "../reality/situation-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const SUBJECT = "ff010101-0101-4101-8101-010101010101";
const AT = "2026-09-01T10:00:00.000Z";
const NEED_KEY = "observation-need|observe-proposition|q|1";
const NEED_KEY_2 = "observation-need|observe-proposition|q|2";
const QUESTION_KEY = "inquiry-question|establish-proposition|q|1";
const CAP_C1 = "inspect";
const CAP_C2 = "human_inspection";
const PROJECT_ID = "00000000-0000-4000-8000-000000000001";

function sampleObservationNeed(
  key: string,
  overrides: Partial<ObservationNeed> = {}
): ObservationNeed {
  return {
    key,
    kind: "OBSERVE_PROPOSITION",
    question_keys: [QUESTION_KEY],
    subject_id: SUBJECT,
    predicate_kind: "state",
    predicate: "condition",
    temporal_scope: { kind: "POINT", at: AT },
    target: {
      kind: "PROPOSITION_TARGET",
      subject_id: SUBJECT,
      predicate_kind: "state",
      predicate: "condition",
    },
    evidence_requirements: [
      {
        kind: "BEARS_ON_PROPOSITION",
        target: {
          kind: "PROPOSITION_TARGET",
          subject_id: SUBJECT,
          predicate_kind: "state",
          predicate: "condition",
        },
        temporal_scope: { kind: "POINT", at: AT },
        must_be_inspectable: true,
        required_relation: "bears_on",
        distinguishing_value_keys: [],
      },
    ],
    discriminates_between_value_keys: [],
    originating_gap_kinds: ["NO_APPLICABLE_CLAIMS"],
    originating_claim_ids: [],
    originating_evidence_ids: [],
    prior_claim_ids: [],
    later_claim_ids: [],
    satisfaction_condition: {
      kind: "EPISTEMIC_RECORD_BEARS_ON_PROPOSITION",
      note: "test",
    },
    ...overrides,
  };
}

function emptySalience(
  kind: SalienceSignalKind,
  key: string,
  observationNeedKeys: string[] = []
): SalienceSignal {
  return {
    kind,
    key,
    event_ids: [],
    state_ids: [],
    claim_ids: [],
    gap_kinds: [],
    inquiry_keys: [],
    observation_need_keys: observationNeedKeys,
    note: "test",
  };
}

function baseCandidate(
  kind: SalienceSignalKind,
  options?: { signalKey?: string; observationNeedKeys?: string[] }
): AttentionCandidate {
  const signalKey = options?.signalKey ?? `sig|${kind}`;
  const observationNeedKeys =
    options?.observationNeedKeys ??
    (kind === "OBSERVATION_NEED" ? [NEED_KEY] : []);
  const signal = emptySalience(kind, signalKey, observationNeedKeys);
  return {
    key: [
      "attention-candidate",
      "base-situation-salience",
      SUBJECT,
      AT,
      signalKey,
    ].join("|"),
    source_kind: "BASE_SITUATION_SALIENCE",
    situation_subject_id: SUBJECT,
    at: AT,
    basis: {
      kind: "BASE_SITUATION_SALIENCE",
      situation_subject_id: SUBJECT,
      situation_at: AT,
      salience_signal_key: signalKey,
      salience_signal_kind: kind,
      salience_signal: signal,
    },
  };
}

function emptyCandidateSet(
  candidates: AttentionCandidate[]
): AttentionCandidateSetAssessment {
  return {
    query: {
      situation_query: { subjectId: SUBJECT, at: AT },
      resource_declaration_ids: [],
    },
    situation: {
      query: {
        situation_query: { subjectId: SUBJECT, at: AT },
        resource_declaration_ids: [],
      },
      base_situation: {
        key: "sit|test",
        subject_id: SUBJECT,
        at: AT,
        event_window: null,
        predicate_scopes: [],
        entity: {
          id: SUBJECT,
          project_id: PROJECT_ID,
          kind: "person",
          label: "A",
          created_at: AT,
          updated_at: AT,
        },
        ontic_context: {
          active_states: [],
          events: [],
          unplaced_events: [],
          state_conflicts: [],
        },
        epistemic_context: {
          belief_assessments: [],
          gap_assessments: [],
          gaps: [],
          unresolved_claims: [],
          unresolved_subject_claims: [],
        },
        inquiry_context: { inquiries: [], observation_needs: [] },
        salience_signals: [],
        status: "QUIET",
        has_salience: false,
        has_unresolved: false,
      },
      resource_declaration_ids: [],
      resource_facets: [],
      resource_findings: [],
      resource_salience_signals: [],
      resource_salience_status: "NO_RESOURCE_SCOPE",
      has_resource_scope: false,
      has_resource_findings: false,
      has_resource_salience: false,
      model_limitations: [],
    },
    candidates,
    status:
      candidates.length > 0
        ? "ATTENTION_CANDIDATES_PRESENT"
        : "NO_ATTENTION_CANDIDATES",
    candidate_count: candidates.length,
    base_situation_candidate_count: candidates.filter(
      (c) => c.source_kind === "BASE_SITUATION_SALIENCE"
    ).length,
    resource_candidate_count: candidates.filter(
      (c) => c.source_kind === "RESOURCE_SITUATION_SALIENCE"
    ).length,
    has_candidates: candidates.length > 0,
    model_limitations: [],
  };
}

function reqKey(cap = CAP_C1, need = NEED_KEY): string {
  return attentionObservationCapabilityRequirementKey(need, cap);
}

function deepClone<T>(value: T): T {
  return structuredClone(value);
}

function requirementSet(options?: {
  requirements?: {
    observation_need_key: string;
    capability_semantic_key: string;
  }[];
  attentionCandidates?: AttentionCandidate[];
  needs?: ObservationNeed[];
}) {
  const attentionCandidates =
    options?.attentionCandidates ?? [
      baseCandidate("OBSERVATION_NEED", { observationNeedKeys: [NEED_KEY] }),
    ];
  const needs = options?.needs ?? [sampleObservationNeed(NEED_KEY)];
  const planning_set = buildAttentionObservationPlanningSet({
    eligibility_set: buildAttentionObservationEligibilitySet(
      emptyCandidateSet(attentionCandidates)
    ),
    observation_needs: needs,
  });

  return buildAttentionObservationCapabilityRequirementSet({
    planning_set,
    specification: {
      requirements: options?.requirements ?? [
        { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
      ],
    },
  });
}

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"PARTIALLY_SATISFIED"/.test(json));
  assert.ok(!/"POLICY_SATISFIED"/.test(json));
  assert.ok(!/"POLICY_UNSATISFIED"/.test(json));
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"MET"/.test(json));
  assert.ok(!/"UNMET"/.test(json));
  assert.ok(!/"has_capability"/.test(json));
  assert.ok(!/"READY_TO_EVALUATE"/.test(json));
  assert.ok(!/"ALL_REQUIREMENTS_HAVE_POLICY"/.test(json));
  assert.ok(!/"PARTIAL_POLICY_COVERAGE"/.test(json));
  assert.ok(!/"POLICY_COMPLETE"/.test(json));
  assert.ok(!/"coverage_percent"/.test(json));
  assert.ok(!/"weight"\s*:/.test(json));
  assert.ok(!/"priority"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"accepted_values"/.test(json));
  assert.ok(!/"pass_conditions"/.test(json));
  assert.ok(!/"failure_conditions"/.test(json));
  assert.ok(!/"DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT"/.test(json));
  assert.ok(!/"FULL_REQUIRED_WINDOW_COVERAGE"/.test(json));
  assert.ok(!/"FEASIBLE"/.test(json));
  assert.ok(!/"can_execute"/.test(json));
}

describe("Attention Observation Capability Evaluation Dimension Policy (GROUND-061)", () => {
  describe("purity / architecture / schema", () => {
    it("schema 0.1.24; 048-only; no 050–060 / 041–045 / ProjectState / persistence", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-evaluation-dimension-policy-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-evaluation-dimension-policy-types.ts"
        ),
        "utf8"
      );

      assert.equal(
        ATTENTION_OBSERVATION_CAPABILITY_EVALUATION_DIMENSIONS.length,
        9
      );
      assert.ok(/capability_requirement_set/.test(types));
      assert.ok(/required_dimensions/.test(types));
      assert.ok(!/from ["'].*declaration-match/.test(core));
      assert.ok(!/from ["'].*capability-verification/.test(core));
      assert.ok(!/from ["'].*capability-availability/.test(core));
      assert.ok(!/from ["'].*state-composition/.test(core));
      assert.ok(!/from ["'].*scope-requirement/.test(core));
      assert.ok(!/from ["'].*scope-applicability/.test(core));
      assert.ok(!/from ["'].*temporal-requirement/.test(core));
      assert.ok(!/from ["'].*declaration-temporal-applicability/.test(core));
      assert.ok(!/from ["'].*verification-temporal-applicability/.test(core));
      assert.ok(!/from ["'].*availability-temporal-applicability/.test(core));
      assert.ok(!/from ["'].*applicability-composition/.test(core));
      assert.ok(!/from ["'].*observation-eligibility/.test(core));
      assert.ok(!/from ["'].*observation-planning/.test(core));
      assert.ok(!/\bimport\s+type\s+\{[^}]*ProjectState/.test(core));
      assert.ok(!/\bDate\.now\s*\(/.test(core));
      assert.ok(!/\bnew Date\s*\(/.test(core));
      assert.ok(/Derived only\. Not persisted/.test(types));
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_EVALUATION_DIMENSION_POLICY_MODEL_LIMITATIONS.includes(
          "CAPABILITY_EVALUATION_DIMENSION_ACCEPTANCE_CRITERIA_NOT_MODELED"
        )
      );
    });
  });

  describe("explicit / absent / empty policy", () => {
    it("explicit non-empty required dimensions → POLICY_PRESENT", () => {
      const capability_requirement_set = requirementSet();
      const result =
        buildAttentionObservationCapabilityEvaluationDimensionPolicySet({
          capability_requirement_set,
          specification: {
            policies: [
              {
                capability_requirement_key: reqKey(),
                required_dimensions: [
                  "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
                  "CAPABILITY_SCOPE_APPLICABILITY",
                  "CAPABILITY_VERIFICATION_REPRESENTATION",
                ],
              },
            ],
          },
        });

      assert.equal(
        result.candidate_assessments[0].status,
        "EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES_PRESENT"
      );
      assert.equal(
        result.has_explicit_capability_evaluation_dimension_policies,
        true
      );
      const assessment =
        result.candidate_assessments[0].requirement_policy_assessments[0];
      assert.equal(
        assessment.status,
        "EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY_PRESENT"
      );
      assert.deepEqual(
        assessment.evaluation_dimension_policy_basis.evaluation_dimension_policy
          ?.required_dimensions,
        [
          "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
          "CAPABILITY_SCOPE_APPLICABILITY",
          "CAPABILITY_VERIFICATION_REPRESENTATION",
        ]
      );
      assertNoForbiddenSemantics(result);
    });

    it("no policy → NO_POLICY; no default dimensions", () => {
      const result =
        buildAttentionObservationCapabilityEvaluationDimensionPolicySet({
          capability_requirement_set: requirementSet(),
          specification: { policies: [] },
        });
      assert.equal(
        result.candidate_assessments[0].status,
        "NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES_DECLARED"
      );
      const assessment =
        result.candidate_assessments[0].requirement_policy_assessments[0];
      assert.equal(
        assessment.status,
        "NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY_DECLARED"
      );
      assert.equal(
        assessment.evaluation_dimension_policy_basis
          .evaluation_dimension_policy,
        null
      );
      assert.equal(
        result.has_explicit_capability_evaluation_dimension_policies,
        false
      );
      assertNoForbiddenSemantics(result);
    });

    it("explicit empty required_dimensions → POLICY_PRESENT with []", () => {
      const result =
        buildAttentionObservationCapabilityEvaluationDimensionPolicySet({
          capability_requirement_set: requirementSet(),
          specification: {
            policies: [
              {
                capability_requirement_key: reqKey(),
                required_dimensions: [],
              },
            ],
          },
        });
      const assessment =
        result.candidate_assessments[0].requirement_policy_assessments[0];
      assert.equal(
        assessment.status,
        "EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY_PRESENT"
      );
      assert.deepEqual(
        assessment.evaluation_dimension_policy_basis.evaluation_dimension_policy
          ?.required_dimensions,
        []
      );
      assert.equal(
        assessment.evaluation_dimension_policy_basis.evaluation_dimension_policy
          ?.key,
        attentionObservationCapabilityEvaluationDimensionPolicyKey(
          reqKey(),
          []
        )
      );
      assertNoForbiddenSemantics(result);
    });
  });

  describe("normalization / conflicts", () => {
    it("dedupes duplicate dimensions and reorders to canonical enum order", () => {
      assert.deepEqual(
        normalizeRequiredDimensions([
          "CAPABILITY_VERIFICATION_REPRESENTATION",
          "CAPABILITY_SCOPE_APPLICABILITY",
          "CAPABILITY_SCOPE_APPLICABILITY",
          "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
        ]),
        [
          "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
          "CAPABILITY_SCOPE_APPLICABILITY",
          "CAPABILITY_VERIFICATION_REPRESENTATION",
        ]
      );
      assert.equal(
        buildCanonicalCapabilityEvaluationDimensionSetKey([
          "CAPABILITY_SCOPE_APPLICABILITY",
          "CAPABILITY_VERIFICATION_REPRESENTATION",
        ]),
        buildCanonicalCapabilityEvaluationDimensionSetKey([
          "CAPABILITY_VERIFICATION_REPRESENTATION",
          "CAPABILITY_SCOPE_APPLICABILITY",
        ])
      );
    });

    it("exact duplicate and reordered-equivalent policy inputs normalize to one", () => {
      const capability_requirement_set = requirementSet();
      const dimsA: AttentionObservationCapabilityEvaluationDimension[] = [
        "CAPABILITY_SCOPE_APPLICABILITY",
        "CAPABILITY_VERIFICATION_REPRESENTATION",
      ];
      const dimsB: AttentionObservationCapabilityEvaluationDimension[] = [
        "CAPABILITY_VERIFICATION_REPRESENTATION",
        "CAPABILITY_SCOPE_APPLICABILITY",
      ];
      const normalized =
        normalizeAttentionObservationCapabilityEvaluationDimensionPolicySpecification(
          capability_requirement_set,
          {
            policies: [
              {
                capability_requirement_key: reqKey(),
                required_dimensions: dimsA,
              },
              {
                capability_requirement_key: reqKey(),
                required_dimensions: dimsB,
              },
              {
                capability_requirement_key: reqKey(),
                required_dimensions: dimsA,
              },
            ],
          }
        );
      assert.equal(normalized.policies.length, 1);
      assert.deepEqual(normalized.policies[0].required_dimensions, [
        "CAPABILITY_SCOPE_APPLICABILITY",
        "CAPABILITY_VERIFICATION_REPRESENTATION",
      ]);
    });

    it("rejects same Requirement + different required dimension sets", () => {
      const capability_requirement_set = requirementSet();
      assert.throws(
        () =>
          normalizeAttentionObservationCapabilityEvaluationDimensionPolicySpecification(
            capability_requirement_set,
            {
              policies: [
                {
                  capability_requirement_key: reqKey(),
                  required_dimensions: ["CAPABILITY_SCOPE_APPLICABILITY"],
                },
                {
                  capability_requirement_key: reqKey(),
                  required_dimensions: [
                    "CAPABILITY_VERIFICATION_REPRESENTATION",
                  ],
                },
              ],
            }
          ),
        /Multiple Capability Evaluation Dimension Policies declared for capability requirement/
      );
    });

    it("rejects unknown Capability Requirement key", () => {
      assert.throws(
        () =>
          buildAttentionObservationCapabilityEvaluationDimensionPolicySet({
            capability_requirement_set: requirementSet(),
            specification: {
              policies: [
                {
                  capability_requirement_key: "unknown|requirement",
                  required_dimensions: [
                    "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
                  ],
                },
              ],
            },
          }),
        /Capability Requirement unknown\|requirement not found in observation capability requirement set/
      );
    });

    it("policy input-order and required-dimension order are invariant", () => {
      const capability_requirement_set = requirementSet({
        requirements: [
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C2 },
        ],
      });
      const a =
        buildAttentionObservationCapabilityEvaluationDimensionPolicySet({
          capability_requirement_set,
          specification: {
            policies: [
              {
                capability_requirement_key: reqKey(CAP_C1),
                required_dimensions: [
                  "CAPABILITY_SCOPE_APPLICABILITY",
                  "CAPABILITY_VERIFICATION_REPRESENTATION",
                ],
              },
              {
                capability_requirement_key: reqKey(CAP_C2),
                required_dimensions: [
                  "CAPABILITY_AVAILABILITY_REPRESENTATION",
                ],
              },
            ],
          },
        });
      const b =
        buildAttentionObservationCapabilityEvaluationDimensionPolicySet({
          capability_requirement_set,
          specification: {
            policies: [
              {
                capability_requirement_key: reqKey(CAP_C2),
                required_dimensions: [
                  "CAPABILITY_AVAILABILITY_REPRESENTATION",
                ],
              },
              {
                capability_requirement_key: reqKey(CAP_C1),
                required_dimensions: [
                  "CAPABILITY_VERIFICATION_REPRESENTATION",
                  "CAPABILITY_SCOPE_APPLICABILITY",
                ],
              },
            ],
          },
        });
      assert.deepEqual(a, b);
    });
  });

  describe("single-dimension representability (no upstream lookup)", () => {
    const aloneCases: AttentionObservationCapabilityEvaluationDimension[] = [
      "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
      "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT",
      "CAPABILITY_SCOPE_APPLICABILITY",
      "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT",
      "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY",
      "CAPABILITY_VERIFICATION_REPRESENTATION",
      "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY",
      "CAPABILITY_AVAILABILITY_REPRESENTATION",
      "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY",
    ];

    for (const dimension of aloneCases) {
      it(`represents ${dimension} alone without inspecting composition`, () => {
        const result =
          buildAttentionObservationCapabilityEvaluationDimensionPolicySet({
            capability_requirement_set: requirementSet(),
            specification: {
              policies: [
                {
                  capability_requirement_key: reqKey(),
                  required_dimensions: [dimension],
                },
              ],
            },
          });
        const policy =
          result.candidate_assessments[0].requirement_policy_assessments[0]
            .evaluation_dimension_policy_basis.evaluation_dimension_policy;
        assert.deepEqual(policy?.required_dimensions, [dimension]);
        assertNoForbiddenSemantics(result);
      });
    }

    it("all nine dimensions representable without satisfaction", () => {
      const result =
        buildAttentionObservationCapabilityEvaluationDimensionPolicySet({
          capability_requirement_set: requirementSet(),
          specification: {
            policies: [
              {
                capability_requirement_key: reqKey(),
                required_dimensions: [
                  ...ATTENTION_OBSERVATION_CAPABILITY_EVALUATION_DIMENSIONS,
                ],
              },
            ],
          },
        });
      assert.deepEqual(
        result.candidate_assessments[0].requirement_policy_assessments[0]
          .evaluation_dimension_policy_basis.evaluation_dimension_policy
          ?.required_dimensions,
        ATTENTION_OBSERVATION_CAPABILITY_EVALUATION_DIMENSIONS
      );
      assertNoForbiddenSemantics(result);
    });
  });

  describe("inference / acceptance firewalls", () => {
    it("does not auto-add dimensions from ObservationNeed / capability key / empty defaults", () => {
      const result =
        buildAttentionObservationCapabilityEvaluationDimensionPolicySet({
          capability_requirement_set: requirementSet({
            needs: [
              sampleObservationNeed(NEED_KEY, {
                kind: "OBSERVE_PROPOSITION",
              }),
            ],
          }),
          specification: { policies: [] },
        });
      assert.equal(
        result.candidate_assessments[0].requirement_policy_assessments[0]
          .evaluation_dimension_policy_basis.evaluation_dimension_policy,
        null
      );
      assert.ok(!/"INSPECT"/.test(JSON.stringify(result)));
    });

    it("mixed Requirement policy presence is existential only", () => {
      const capability_requirement_set = requirementSet({
        requirements: [
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C2 },
        ],
      });
      const result =
        buildAttentionObservationCapabilityEvaluationDimensionPolicySet({
          capability_requirement_set,
          specification: {
            policies: [
              {
                capability_requirement_key: reqKey(CAP_C1),
                required_dimensions: ["CAPABILITY_SCOPE_APPLICABILITY"],
              },
            ],
          },
        });
      assert.equal(
        result.candidate_assessments[0].status,
        "EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICIES_PRESENT"
      );
      const byReqKey = new Map(
        result.candidate_assessments[0].requirement_policy_assessments.map(
          (a) => [a.capability_requirement.key, a]
        )
      );
      assert.equal(
        byReqKey.get(reqKey(CAP_C1))?.status,
        "EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY_PRESENT"
      );
      assert.equal(
        byReqKey.get(reqKey(CAP_C2))?.status,
        "NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY_DECLARED"
      );
      assert.ok(!/"ALL_REQUIREMENTS_HAVE_POLICY"/.test(JSON.stringify(result)));
    });

    it("required dimensions carry no accepted FULL / exact / AVAILABLE criteria fields", () => {
      const result =
        buildAttentionObservationCapabilityEvaluationDimensionPolicySet({
          capability_requirement_set: requirementSet(),
          specification: {
            policies: [
              {
                capability_requirement_key: reqKey(),
                required_dimensions: [
                  "CAPABILITY_SCOPE_APPLICABILITY",
                  "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY",
                  "CAPABILITY_VERIFICATION_REPRESENTATION",
                  "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY",
                  "CAPABILITY_AVAILABILITY_REPRESENTATION",
                  "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY",
                ],
              },
            ],
          },
        });
      const policy =
        result.candidate_assessments[0].requirement_policy_assessments[0]
          .evaluation_dimension_policy_basis.evaluation_dimension_policy;
      assert.ok(policy);
      assert.equal(
        Object.keys(policy).sort().join(","),
        [
          "capability_requirement_key",
          "capability_semantic_key",
          "key",
          "observation_need_key",
          "required_dimensions",
        ].join(",")
      );
      assertNoForbiddenSemantics(result);
    });
  });

  describe("immutability / determinism", () => {
    it("preserves Capability Requirement set and specification deepEqual", () => {
      const capability_requirement_set = requirementSet();
      const specification = {
        policies: [
          {
            capability_requirement_key: reqKey(),
            required_dimensions: [
              "STRUCTURAL_CAPABILITY_DECLARATION_MATCH" as const,
            ],
          },
        ],
      };
      const beforeReq = deepClone(capability_requirement_set);
      const beforeSpec = deepClone(specification);
      buildAttentionObservationCapabilityEvaluationDimensionPolicySet({
        capability_requirement_set,
        specification,
      });
      assert.deepEqual(capability_requirement_set, beforeReq);
      assert.deepEqual(specification, beforeSpec);
    });

    it("is deterministic across repeated calls", () => {
      const input = {
        capability_requirement_set: requirementSet(),
        specification: {
          policies: [
            {
              capability_requirement_key: reqKey(),
              required_dimensions: [
                "CAPABILITY_VERIFICATION_REPRESENTATION" as const,
                "CAPABILITY_SCOPE_APPLICABILITY" as const,
              ],
            },
          ],
        },
      };
      const a =
        buildAttentionObservationCapabilityEvaluationDimensionPolicySet(input);
      const b =
        buildAttentionObservationCapabilityEvaluationDimensionPolicySet(input);
      assert.deepEqual(a, b);
    });

    it("does not invent policy from ObservationNeed.kind or second need presence", () => {
      const capability_requirement_set = requirementSet({
        needs: [
          sampleObservationNeed(NEED_KEY),
          sampleObservationNeed(NEED_KEY_2),
        ],
        attentionCandidates: [
          baseCandidate("OBSERVATION_NEED", {
            signalKey: "sig|need1",
            observationNeedKeys: [NEED_KEY],
          }),
          baseCandidate("OBSERVATION_NEED", {
            signalKey: "sig|need2",
            observationNeedKeys: [NEED_KEY_2],
          }),
        ],
        requirements: [
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
        ],
      });
      const result =
        buildAttentionObservationCapabilityEvaluationDimensionPolicySet({
          capability_requirement_set,
          specification: { policies: [] },
        });
      const withRequirement = result.candidate_assessments.find(
        (c) => c.requirement_policy_assessments.length > 0
      );
      assert.ok(withRequirement);
      assert.equal(withRequirement.requirement_policy_assessments.length, 1);
      assert.equal(
        withRequirement.requirement_policy_assessments[0].status,
        "NO_EXPLICIT_CAPABILITY_EVALUATION_DIMENSION_POLICY_DECLARED"
      );
      assert.equal(
        withRequirement.requirement_policy_assessments[0]
          .evaluation_dimension_policy_basis.evaluation_dimension_policy,
        null
      );
    });
  });
});
