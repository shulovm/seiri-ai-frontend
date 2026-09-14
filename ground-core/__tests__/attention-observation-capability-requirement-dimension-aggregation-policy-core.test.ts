/**
 * GROUND-068 — Observation Core XXII / Explicit Capability Requirement Dimension
 * Aggregation Policy Foundation
 *
 * Pure 061 Evaluation Dimension Policy + explicit Requirement Aggregation Policy
 * Specification (ANY / ALL policy only; no aggregation result / 067 state inspection).
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
  attentionObservationCapabilityEvaluationDimensionPolicyKey,
  buildAttentionObservationCapabilityEvaluationDimensionPolicySet,
} from "../reality/attention-observation-capability-evaluation-dimension-policy-core.js";
import {
  ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_MODEL_LIMITATIONS,
  attentionObservationCapabilityRequirementDimensionAggregationPolicyKey,
  buildAttentionObservationCapabilityRequirementDimensionAggregationPolicySet,
  CANONICAL_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_KIND_ORDER,
  normalizeAttentionObservationCapabilityRequirementDimensionAggregationPolicySpecification,
} from "../reality/attention-observation-capability-requirement-dimension-aggregation-policy-core.js";
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

function buildEvaluationDimensionPolicySet(options?: {
  requiredDimensions?: AttentionObservationCapabilityEvaluationDimension[];
  requirements?: {
    observation_need_key: string;
    capability_semantic_key: string;
  }[];
}) {
  const planning_set = buildAttentionObservationPlanningSet({
    eligibility_set: buildAttentionObservationEligibilitySet(
      emptyCandidateSet([
        baseCandidate("OBSERVATION_NEED", { observationNeedKeys: [NEED_KEY] }),
      ])
    ),
    observation_needs: [sampleObservationNeed(NEED_KEY)],
  });
  const capability_requirement_set = buildAttentionObservationCapabilityRequirementSet(
    {
      planning_set,
      specification: {
        requirements: options?.requirements ?? [
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
        ],
      },
    }
  );
  return buildAttentionObservationCapabilityEvaluationDimensionPolicySet({
    capability_requirement_set,
    specification: {
      policies: [
        {
          capability_requirement_key: reqKey(),
          required_dimensions:
            options?.requiredDimensions ?? [
              "CAPABILITY_AVAILABILITY_REPRESENTATION",
              "CAPABILITY_VERIFICATION_REPRESENTATION",
            ],
        },
      ],
    },
  });
}

function requirementAggregationPolicyAssessment(
  result: ReturnType<
    typeof buildAttentionObservationCapabilityRequirementDimensionAggregationPolicySet
  >,
  requirementKey = reqKey()
) {
  return result.candidate_assessments[0].requirement_dimension_aggregation_policy_assessments.find(
    (a) => a.capability_requirement.key === requirementKey
  );
}

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"PARTIALLY_SATISFIED"/.test(json));
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"UNKNOWN"/.test(json));
  assert.ok(!/"IGNORE_UNRESOLVED"/.test(json));
  assert.ok(!/"FAIL_ON_UNRESOLVED"/.test(json));
  assert.ok(!/"BLOCK_ON_UNRESOLVED"/.test(json));
  assert.ok(!/"REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_HOLDS"/.test(json));
  assert.ok(!/"REQUIREMENT_DIMENSION_AGGREGATION_CONDITION_DOES_NOT_HOLD"/.test(json));
  assert.ok(!/"SOURCE_AGGREGATION_CONDITION_HOLDS"/.test(json));
  assert.ok(!/"UNRESOLVED_"/.test(json));
  assert.ok(!/"holding_count"/.test(json));
  assert.ok(!/"unresolved_count"/.test(json));
  assert.ok(!/"dimension_count"/.test(json));
  assert.ok(!/"all_requirements_have_dimension_aggregation_policy"/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
}

describe("Attention Observation Capability Requirement Dimension Aggregation Policy (GROUND-068)", () => {
  describe("purity / architecture / schema", () => {
    it("schema 0.1.24; 061-only runtime; no 067 state inspection", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-dimension-aggregation-policy-core.ts"
        ),
        "utf8"
      );
      assert.ok(/capability_evaluation_dimension_policy_set/.test(core));
      assert.ok(
        /ANY_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITION_HOLDS/.test(core)
      );
      assert.ok(
        /ALL_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITIONS_HOLD/.test(core)
      );
      assert.ok(!/from ["'].*required-dimension-evaluation-state-core/.test(core));
      assert.ok(!/from ["'].*dimension-source-aggregation-outcome-core/.test(core));
      assert.ok(!/from ["'].*dimension-source-aggregation-policy-core/.test(core));
      assert.ok(!/from ["'].*required-dimension-coverage-core/.test(core));
      assert.ok(!/mapSourceAggregationAssessmentToEvaluationState/.test(core));
      assert.ok(!/UNRESOLVED_EVALUATION_BASIS/.test(core));
      assert.ok(!/UNRESOLVED_ACCEPTANCE_CRITERION/.test(core));
      assert.ok(!/\.some\s*\(/.test(core));
      assert.ok(!/\.every\s*\(/.test(core));
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_MODEL_LIMITATIONS.includes(
          "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_RESULT_NOT_MODELED"
        )
      );
    });
  });

  describe("ANY / ALL policy baseline", () => {
    it("ANY policy → POLICY_PRESENT; retains evaluation_dimension_policy_key", () => {
      const evaluation_set = buildEvaluationDimensionPolicySet();
      const result = buildAttentionObservationCapabilityRequirementDimensionAggregationPolicySet(
        {
          capability_evaluation_dimension_policy_set: evaluation_set,
          specification: {
            policies: [
              {
                capability_requirement_key: reqKey(),
                aggregation_kind:
                  "ANY_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITION_HOLDS",
              },
            ],
          },
        }
      );
      const assessment = requirementAggregationPolicyAssessment(result);
      assert.equal(
        assessment?.status,
        "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_PRESENT"
      );
      assert.equal(
        assessment?.requirement_dimension_aggregation_policy?.aggregation_kind,
        "ANY_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITION_HOLDS"
      );
      assert.equal(
        assessment?.requirement_dimension_aggregation_policy
          ?.evaluation_dimension_policy_key,
        evaluation_set.candidate_assessments[0].requirement_policy_assessments[0]
          .evaluation_dimension_policy_basis.evaluation_dimension_policy?.key
      );
      assertNoForbiddenSemantics(result);
    });

    it("ALL policy → POLICY_PRESENT", () => {
      const result = buildAttentionObservationCapabilityRequirementDimensionAggregationPolicySet(
        {
          capability_evaluation_dimension_policy_set:
            buildEvaluationDimensionPolicySet(),
          specification: {
            policies: [
              {
                capability_requirement_key: reqKey(),
                aggregation_kind:
                  "ALL_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITIONS_HOLD",
              },
            ],
          },
        }
      );
      assert.equal(
        requirementAggregationPolicyAssessment(result)
          ?.requirement_dimension_aggregation_policy?.aggregation_kind,
        "ALL_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITIONS_HOLD"
      );
    });
  });

  describe("policy absence / rejection", () => {
    it("non-empty required Dimensions without policy → NO_POLICY_DECLARED", () => {
      const result = buildAttentionObservationCapabilityRequirementDimensionAggregationPolicySet(
        {
          capability_evaluation_dimension_policy_set:
            buildEvaluationDimensionPolicySet(),
          specification: { policies: [] },
        }
      );
      assert.equal(
        requirementAggregationPolicyAssessment(result)?.status,
        "NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_DECLARED"
      );
      assert.equal(
        result.has_explicit_capability_requirement_dimension_aggregation_policies,
        false
      );
    });

    it("empty required_dimensions without 068 spec → NO_REQUIRED_DIMENSIONS_DECLARED", () => {
      const result = buildAttentionObservationCapabilityRequirementDimensionAggregationPolicySet(
        {
          capability_evaluation_dimension_policy_set:
            buildEvaluationDimensionPolicySet({ requiredDimensions: [] }),
          specification: { policies: [] },
        }
      );
      assert.equal(
        requirementAggregationPolicyAssessment(result)?.status,
        "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
      );
      assert.equal(result.candidate_assessments[0].status, "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED");
    });

    it("empty required_dimensions + aggregation policy input rejects", () => {
      const evaluation_set = buildEvaluationDimensionPolicySet({
        requiredDimensions: [],
      });
      assert.throws(
        () =>
          normalizeAttentionObservationCapabilityRequirementDimensionAggregationPolicySpecification(
            evaluation_set,
            {
              policies: [
                {
                  capability_requirement_key: reqKey(),
                  aggregation_kind:
                    "ANY_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITION_HOLDS",
                },
              ],
            }
          ),
        /requires at least one explicit required evaluation dimension/
      );
    });

    it("no GROUND-061 policy + aggregation input rejects", () => {
      const planning_set = buildAttentionObservationPlanningSet({
        eligibility_set: buildAttentionObservationEligibilitySet(
          emptyCandidateSet([
            baseCandidate("OBSERVATION_NEED", { observationNeedKeys: [NEED_KEY] }),
          ])
        ),
        observation_needs: [sampleObservationNeed(NEED_KEY)],
      });
      const capability_requirement_set =
        buildAttentionObservationCapabilityRequirementSet({
          planning_set,
          specification: {
            requirements: [
              { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
            ],
          },
        });
      const evaluation_set =
        buildAttentionObservationCapabilityEvaluationDimensionPolicySet({
          capability_requirement_set,
          specification: { policies: [] },
        });
      assert.throws(
        () =>
          normalizeAttentionObservationCapabilityRequirementDimensionAggregationPolicySpecification(
            evaluation_set,
            {
              policies: [
                {
                  capability_requirement_key: reqKey(),
                  aggregation_kind:
                    "ALL_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITIONS_HOLD",
                },
              ],
            }
          ),
        /requires an explicit Evaluation Dimension Policy/
      );
    });

    it("unknown Requirement rejects", () => {
      assert.throws(
        () =>
          normalizeAttentionObservationCapabilityRequirementDimensionAggregationPolicySpecification(
            buildEvaluationDimensionPolicySet(),
            {
              policies: [
                {
                  capability_requirement_key: "missing-requirement",
                  aggregation_kind:
                    "ANY_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITION_HOLDS",
                },
              ],
            }
          ),
        /not found in capability evaluation dimension policy set/
      );
    });
  });

  describe("policy identity / normalization", () => {
    it("exact duplicate normalizes; specification reorder deepEqual", () => {
      const evaluation_set = buildEvaluationDimensionPolicySet();
      const specA = {
        policies: [
          {
            capability_requirement_key: reqKey(),
            aggregation_kind:
              "ANY_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITION_HOLDS" as const,
          },
          {
            capability_requirement_key: reqKey(),
            aggregation_kind:
              "ANY_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITION_HOLDS" as const,
          },
        ],
      };
      const specB = {
        policies: [...specA.policies].reverse(),
      };
      const normalizedA =
        normalizeAttentionObservationCapabilityRequirementDimensionAggregationPolicySpecification(
          evaluation_set,
          specA
        );
      const normalizedB =
        normalizeAttentionObservationCapabilityRequirementDimensionAggregationPolicySpecification(
          evaluation_set,
          specB
        );
      assert.deepEqual(normalizedA, normalizedB);
      assert.equal(normalizedA.policies.length, 1);
    });

    it("ANY + ALL conflict for same Requirement rejects", () => {
      assert.throws(
        () =>
          normalizeAttentionObservationCapabilityRequirementDimensionAggregationPolicySpecification(
            buildEvaluationDimensionPolicySet(),
            {
              policies: [
                {
                  capability_requirement_key: reqKey(),
                  aggregation_kind:
                    "ANY_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITION_HOLDS",
                },
                {
                  capability_requirement_key: reqKey(),
                  aggregation_kind:
                    "ALL_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITIONS_HOLD",
                },
              ],
            }
          ),
        /Multiple Capability Requirement Dimension Aggregation Policies declared/
      );
    });

    it("changed GROUND-061 required dimension set changes policy key", () => {
      const dimsA: AttentionObservationCapabilityEvaluationDimension[] = [
        "CAPABILITY_AVAILABILITY_REPRESENTATION",
      ];
      const dimsB: AttentionObservationCapabilityEvaluationDimension[] = [
        "CAPABILITY_AVAILABILITY_REPRESENTATION",
        "CAPABILITY_VERIFICATION_REPRESENTATION",
      ];
      const keyA = attentionObservationCapabilityRequirementDimensionAggregationPolicyKey(
        reqKey(),
        attentionObservationCapabilityEvaluationDimensionPolicyKey(reqKey(), dimsA),
        "ANY_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITION_HOLDS"
      );
      const keyB = attentionObservationCapabilityRequirementDimensionAggregationPolicyKey(
        reqKey(),
        attentionObservationCapabilityEvaluationDimensionPolicyKey(reqKey(), dimsB),
        "ANY_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITION_HOLDS"
      );
      assert.notEqual(keyA, keyB);
    });

    it("ANY → ALL changes policy key for same Evaluation Dimension Policy", () => {
      const dims: AttentionObservationCapabilityEvaluationDimension[] = [
        "CAPABILITY_AVAILABILITY_REPRESENTATION",
      ];
      const evalKey = attentionObservationCapabilityEvaluationDimensionPolicyKey(
        reqKey(),
        dims
      );
      const anyKey =
        attentionObservationCapabilityRequirementDimensionAggregationPolicyKey(
          reqKey(),
          evalKey,
          "ANY_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITION_HOLDS"
        );
      const allKey =
        attentionObservationCapabilityRequirementDimensionAggregationPolicyKey(
          reqKey(),
          evalKey,
          "ALL_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITIONS_HOLD"
        );
      assert.notEqual(anyKey, allKey);
    });

    it("single Dimension ANY and ALL remain distinct identities", () => {
      const evaluation_set = buildEvaluationDimensionPolicySet({
        requiredDimensions: ["CAPABILITY_AVAILABILITY_REPRESENTATION"],
      });
      const anyResult =
        buildAttentionObservationCapabilityRequirementDimensionAggregationPolicySet(
          {
            capability_evaluation_dimension_policy_set: evaluation_set,
            specification: {
              policies: [
                {
                  capability_requirement_key: reqKey(),
                  aggregation_kind:
                    "ANY_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITION_HOLDS",
                },
              ],
            },
          }
        );
      const allResult =
        buildAttentionObservationCapabilityRequirementDimensionAggregationPolicySet(
          {
            capability_evaluation_dimension_policy_set: evaluation_set,
            specification: {
              policies: [
                {
                  capability_requirement_key: reqKey(),
                  aggregation_kind:
                    "ALL_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITIONS_HOLD",
                },
              ],
            },
          }
        );
      assert.notEqual(
        anyResult.candidate_assessments[0]
          .requirement_dimension_aggregation_policy_assessments[0]
          .requirement_dimension_aggregation_policy?.key,
        allResult.candidate_assessments[0]
          .requirement_dimension_aggregation_policy_assessments[0]
          .requirement_dimension_aggregation_policy?.key
      );
    });
  });

  describe("mixed Requirement behavior", () => {
    it("R1 policy present / R2 no eval policy / R3 policy absent coexist", () => {
      const capability_requirement_set = (() => {
        const planning_set = buildAttentionObservationPlanningSet({
          eligibility_set: buildAttentionObservationEligibilitySet(
            emptyCandidateSet([
              baseCandidate("OBSERVATION_NEED", {
                observationNeedKeys: [NEED_KEY],
              }),
            ])
          ),
          observation_needs: [sampleObservationNeed(NEED_KEY)],
        });
        return buildAttentionObservationCapabilityRequirementSet({
          planning_set,
          specification: {
            requirements: [
              { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
              { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C2 },
            ],
          },
        });
      })();
      const evaluation_set =
        buildAttentionObservationCapabilityEvaluationDimensionPolicySet({
          capability_requirement_set,
          specification: {
            policies: [
              {
                capability_requirement_key: reqKey(CAP_C1),
                required_dimensions: ["CAPABILITY_AVAILABILITY_REPRESENTATION"],
              },
              {
                capability_requirement_key: reqKey(CAP_C2),
                required_dimensions: ["CAPABILITY_VERIFICATION_REPRESENTATION"],
              },
            ],
          },
        });
      const result =
        buildAttentionObservationCapabilityRequirementDimensionAggregationPolicySet(
          {
            capability_evaluation_dimension_policy_set: evaluation_set,
            specification: {
              policies: [
                {
                  capability_requirement_key: reqKey(CAP_C1),
                  aggregation_kind:
                    "ANY_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITION_HOLDS",
                },
              ],
            },
          }
        );
      const byKey = new Map(
        result.candidate_assessments[0].requirement_dimension_aggregation_policy_assessments.map(
          (a) => [a.capability_requirement.key, a.status]
        )
      );
      assert.equal(
        byKey.get(reqKey(CAP_C1)),
        "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_PRESENT"
      );
      assert.equal(
        byKey.get(reqKey(CAP_C2)),
        "NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_DECLARED"
      );
      assert.equal(
        result.has_explicit_capability_requirement_dimension_aggregation_policies,
        true
      );
      assert.equal(
        Object.keys(result.candidate_assessments[0]).includes(
          "all_requirements_have_dimension_aggregation_policy"
        ),
        false
      );
    });
  });

  describe("determinism / immutability", () => {
    it("deep-cloned 061 input yields identical output; inputs unchanged", () => {
      const evaluation_set = buildEvaluationDimensionPolicySet();
      const spec = {
        policies: [
          {
            capability_requirement_key: reqKey(),
            aggregation_kind:
              "ALL_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITIONS_HOLD" as const,
          },
        ],
      };
      const evalBefore = deepClone(evaluation_set);
      const specBefore = deepClone(spec);
      const first =
        buildAttentionObservationCapabilityRequirementDimensionAggregationPolicySet(
          {
            capability_evaluation_dimension_policy_set: deepClone(evaluation_set),
            specification: deepClone(spec),
          }
        );
      const second =
        buildAttentionObservationCapabilityRequirementDimensionAggregationPolicySet(
          {
            capability_evaluation_dimension_policy_set: deepClone(evaluation_set),
            specification: deepClone(spec),
          }
        );
      assert.deepEqual(first, second);
      assert.deepEqual(evaluation_set, evalBefore);
      assert.deepEqual(spec, specBefore);
    });
  });

  describe("serialization order firewall", () => {
    it("canonical ANY before ALL; order != preference", () => {
      assert.deepEqual(
        CANONICAL_REQUIREMENT_DIMENSION_AGGREGATION_POLICY_KIND_ORDER,
        [
          "ANY_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITION_HOLDS",
          "ALL_REQUIRED_DIMENSION_SOURCE_AGGREGATION_CONDITIONS_HOLD",
        ]
      );
    });
  });
});
