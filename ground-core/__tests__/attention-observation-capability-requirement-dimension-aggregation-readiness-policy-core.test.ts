/**
 * GROUND-069 — Observation Core XXIII / Explicit Capability Requirement Dimension
 * Aggregation Readiness Policy Foundation
 *
 * Pure 061 Evaluation Dimension Policy + explicit Readiness Policy Specification
 * (all-required-dimensions-resolved prerequisite only; no readiness evaluation /
 * 067 state inspection / 068 dependency).
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
  ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS,
  attentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyKey,
  buildAttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySet,
  CANONICAL_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_KIND_ORDER,
  normalizeAttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySpecification,
} from "../reality/attention-observation-capability-requirement-dimension-aggregation-readiness-policy-core.js";
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
const QUESTION_KEY = "inquiry-question|establish-proposition|q|1";
const CAP_C1 = "inspect";
const CAP_C2 = "human_inspection";
const PROJECT_ID = "00000000-0000-4000-8000-000000000001";

const READINESS_KIND =
  "REQUIRE_ALL_REQUIRED_DIMENSION_EVALUATION_STATES_RESOLVED_BEFORE_AGGREGATION" as const;

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

function readinessPolicyAssessment(
  result: ReturnType<
    typeof buildAttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySet
  >,
  requirementKey = reqKey()
) {
  return result.candidate_assessments[0].requirement_dimension_aggregation_readiness_policy_assessments.find(
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
  assert.ok(!/"READY"/.test(json));
  assert.ok(!/"NOT_READY"/.test(json));
  assert.ok(!/"SOURCE_AGGREGATION_CONDITION_HOLDS"/.test(json));
  assert.ok(!/"SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD"/.test(json));
  assert.ok(!/"UNRESOLVED_"/.test(json));
  assert.ok(!/"IGNORE_UNRESOLVED"/.test(json));
  assert.ok(!/"AGGREGATE_RESOLVED_DIMENSIONS_ONLY"/.test(json));
  assert.ok(!/"TREAT_UNRESOLVED"/.test(json));
  assert.ok(!/"REQUIREMENT_DIMENSION_AGGREGATION_CONDITION"/.test(json));
  assert.ok(!/"all_dimensions_resolved"/.test(json));
  assert.ok(!/"resolved_count"/.test(json));
  assert.ok(!/"unresolved_count"/.test(json));
  assert.ok(!/"all_requirements_have_readiness_policy"/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
}

describe("Attention Observation Capability Requirement Dimension Aggregation Readiness Policy (GROUND-069)", () => {
  describe("purity / architecture / schema", () => {
    it("schema 0.1.24; 061-only runtime; no 067/068 state or policy inspection", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-dimension-aggregation-readiness-policy-core.ts"
        ),
        "utf8"
      );
      assert.ok(/capability_evaluation_dimension_policy_set/.test(core));
      assert.ok(
        /REQUIRE_ALL_REQUIRED_DIMENSION_EVALUATION_STATES_RESOLVED_BEFORE_AGGREGATION/.test(
          core
        )
      );
      assert.ok(
        !/from ["'].*required-dimension-evaluation-state-core/.test(core)
      );
      assert.ok(
        !/from ["'].*requirement-dimension-aggregation-policy-core/.test(core)
      );
      assert.ok(
        !/from ["'].*dimension-source-aggregation-outcome-core/.test(core)
      );
      assert.ok(
        !/from ["'].*dimension-source-aggregation-policy-core/.test(core)
      );
      assert.ok(!/from ["'].*required-dimension-coverage-core/.test(core));
      assert.ok(!/SOURCE_AGGREGATION_CONDITION_HOLDS/.test(core));
      assert.ok(!/SOURCE_AGGREGATION_CONDITION_DOES_NOT_HOLD/.test(core));
      assert.ok(!/UNRESOLVED_EVALUATION_BASIS/.test(core));
      assert.ok(!/ANY_REQUIRED_DIMENSION_SOURCE_AGGREGATION/.test(core));
      assert.ok(!/ALL_REQUIRED_DIMENSION_SOURCE_AGGREGATION/.test(core));
      assert.ok(!/\.some\s*\(/.test(core));
      assert.ok(!/\.every\s*\(/.test(core));
      assert.ok(!/"READY"/.test(core));
      assert.ok(!/"NOT_READY"/.test(core));
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_MODEL_LIMITATIONS.includes(
          "CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_EVALUATION_NOT_MODELED"
        )
      );
    });

    it("readiness requires resolution, not HOLDS; no required_state=HOLDS field", () => {
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-dimension-aggregation-readiness-policy-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-dimension-aggregation-readiness-policy-types.ts"
        ),
        "utf8"
      );
      assert.ok(/RESOLVED_BEFORE_AGGREGATION/.test(core));
      assert.ok(!/required_state/.test(core));
      assert.ok(!/required_state/.test(types));
      assert.ok(/resolved != HOLDS|resolved ≠ HOLDS/.test(types));
    });
  });

  describe("baseline readiness policy", () => {
    it("explicit readiness policy → POLICY_PRESENT; retains evaluation_dimension_policy_key", () => {
      const evaluation_set = buildEvaluationDimensionPolicySet();
      const result =
        buildAttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySet(
          {
            capability_evaluation_dimension_policy_set: evaluation_set,
            specification: {
              policies: [
                {
                  capability_requirement_key: reqKey(),
                  readiness_kind: READINESS_KIND,
                },
              ],
            },
          }
        );
      const assessment = readinessPolicyAssessment(result);
      assert.equal(
        assessment?.status,
        "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_PRESENT"
      );
      assert.notEqual(
        assessment?.requirement_dimension_aggregation_readiness_policy,
        null
      );
      assert.equal(
        assessment?.requirement_dimension_aggregation_readiness_policy
          ?.readiness_kind,
        READINESS_KIND
      );
      assert.equal(
        assessment?.requirement_dimension_aggregation_readiness_policy
          ?.evaluation_dimension_policy_key,
        evaluation_set.candidate_assessments[0].requirement_policy_assessments[0]
          .evaluation_dimension_policy_basis.evaluation_dimension_policy?.key
      );
      assertNoForbiddenSemantics(result);
    });
  });

  describe("policy absence / rejection", () => {
    it("non-empty required Dimensions without policy → NO_POLICY_DECLARED", () => {
      const result =
        buildAttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySet(
          {
            capability_evaluation_dimension_policy_set:
              buildEvaluationDimensionPolicySet(),
            specification: { policies: [] },
          }
        );
      assert.equal(
        readinessPolicyAssessment(result)?.status,
        "NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_DECLARED"
      );
      assert.equal(
        readinessPolicyAssessment(result)
          ?.requirement_dimension_aggregation_readiness_policy,
        null
      );
      assert.equal(
        result.has_explicit_capability_requirement_dimension_aggregation_readiness_policies,
        false
      );
    });

    it("empty required_dimensions without 069 spec → NO_REQUIRED_DIMENSIONS_DECLARED", () => {
      const result =
        buildAttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySet(
          {
            capability_evaluation_dimension_policy_set:
              buildEvaluationDimensionPolicySet({ requiredDimensions: [] }),
            specification: { policies: [] },
          }
        );
      assert.equal(
        readinessPolicyAssessment(result)?.status,
        "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
      );
      assert.equal(
        result.candidate_assessments[0].status,
        "NO_REQUIRED_CAPABILITY_EVALUATION_DIMENSIONS_DECLARED"
      );
    });

    it("empty required_dimensions + readiness policy input rejects", () => {
      const evaluation_set = buildEvaluationDimensionPolicySet({
        requiredDimensions: [],
      });
      assert.throws(
        () =>
          normalizeAttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySpecification(
            evaluation_set,
            {
              policies: [
                {
                  capability_requirement_key: reqKey(),
                  readiness_kind: READINESS_KIND,
                },
              ],
            }
          ),
        /requires at least one explicit required evaluation dimension/
      );
    });

    it("no GROUND-061 policy + readiness input rejects", () => {
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
          normalizeAttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySpecification(
            evaluation_set,
            {
              policies: [
                {
                  capability_requirement_key: reqKey(),
                  readiness_kind: READINESS_KIND,
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
          normalizeAttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySpecification(
            buildEvaluationDimensionPolicySet(),
            {
              policies: [
                {
                  capability_requirement_key: "missing-requirement",
                  readiness_kind: READINESS_KIND,
                },
              ],
            }
          ),
        /not found in capability evaluation dimension policy set/
      );
    });

    it("unknown readiness kind rejects", () => {
      assert.throws(
        () =>
          normalizeAttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySpecification(
            buildEvaluationDimensionPolicySet(),
            {
              policies: [
                {
                  capability_requirement_key: reqKey(),
                  readiness_kind: "IGNORE_UNRESOLVED_DIMENSIONS" as never,
                },
              ],
            }
          ),
        /Unknown Capability Requirement Dimension Aggregation Readiness Policy kind/
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
            readiness_kind: READINESS_KIND,
          },
          {
            capability_requirement_key: reqKey(),
            readiness_kind: READINESS_KIND,
          },
        ],
      };
      const specB = { policies: [...specA.policies].reverse() };
      const normalizedA =
        normalizeAttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySpecification(
          evaluation_set,
          specA
        );
      const normalizedB =
        normalizeAttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySpecification(
          evaluation_set,
          specB
        );
      assert.deepEqual(normalizedA, normalizedB);
      assert.equal(normalizedA.policies.length, 1);
    });

    it("changed GROUND-061 required dimension set changes policy key", () => {
      const dimsA: AttentionObservationCapabilityEvaluationDimension[] = [
        "CAPABILITY_AVAILABILITY_REPRESENTATION",
      ];
      const dimsB: AttentionObservationCapabilityEvaluationDimension[] = [
        "CAPABILITY_AVAILABILITY_REPRESENTATION",
        "CAPABILITY_VERIFICATION_REPRESENTATION",
      ];
      const keyA =
        attentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyKey(
          reqKey(),
          attentionObservationCapabilityEvaluationDimensionPolicyKey(
            reqKey(),
            dimsA
          ),
          READINESS_KIND
        );
      const keyB =
        attentionObservationCapabilityRequirementDimensionAggregationReadinessPolicyKey(
          reqKey(),
          attentionObservationCapabilityEvaluationDimensionPolicyKey(
            reqKey(),
            dimsB
          ),
          READINESS_KIND
        );
      assert.notEqual(keyA, keyB);
    });

    it("single required Dimension readiness policy remains valid", () => {
      const result =
        buildAttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySet(
          {
            capability_evaluation_dimension_policy_set:
              buildEvaluationDimensionPolicySet({
                requiredDimensions: ["CAPABILITY_AVAILABILITY_REPRESENTATION"],
              }),
            specification: {
              policies: [
                {
                  capability_requirement_key: reqKey(),
                  readiness_kind: READINESS_KIND,
                },
              ],
            },
          }
        );
      assert.equal(
        readinessPolicyAssessment(result)?.status,
        "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_PRESENT"
      );
    });
  });

  describe("mixed Requirement behavior", () => {
    it("R1 policy present / R2 policy absent coexist; no completeness boolean", () => {
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
      const capability_requirement_set =
        buildAttentionObservationCapabilityRequirementSet({
          planning_set,
          specification: {
            requirements: [
              { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
              { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C2 },
            ],
          },
        });
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
        buildAttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySet(
          {
            capability_evaluation_dimension_policy_set: evaluation_set,
            specification: {
              policies: [
                {
                  capability_requirement_key: reqKey(CAP_C1),
                  readiness_kind: READINESS_KIND,
                },
              ],
            },
          }
        );
      const byKey = new Map(
        result.candidate_assessments[0].requirement_dimension_aggregation_readiness_policy_assessments.map(
          (a) => [a.capability_requirement.key, a.status]
        )
      );
      assert.equal(
        byKey.get(reqKey(CAP_C1)),
        "EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_PRESENT"
      );
      assert.equal(
        byKey.get(reqKey(CAP_C2)),
        "NO_EXPLICIT_CAPABILITY_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_DECLARED"
      );
      assert.equal(
        result.has_explicit_capability_requirement_dimension_aggregation_readiness_policies,
        true
      );
      assert.equal(
        Object.keys(result.candidate_assessments[0]).includes(
          "all_requirements_have_readiness_policy"
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
            readiness_kind: READINESS_KIND,
          },
        ],
      };
      const evalBefore = deepClone(evaluation_set);
      const specBefore = deepClone(spec);
      const first =
        buildAttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySet(
          {
            capability_evaluation_dimension_policy_set: deepClone(evaluation_set),
            specification: deepClone(spec),
          }
        );
      const second =
        buildAttentionObservationCapabilityRequirementDimensionAggregationReadinessPolicySet(
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
    it("canonical readiness kind order is serialization only", () => {
      assert.deepEqual(
        CANONICAL_REQUIREMENT_DIMENSION_AGGREGATION_READINESS_POLICY_KIND_ORDER,
        [READINESS_KIND]
      );
    });
  });
});
