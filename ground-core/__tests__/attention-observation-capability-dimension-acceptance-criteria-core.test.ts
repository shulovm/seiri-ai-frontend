/**
 * GROUND-063 — Observation Core XVII / Explicit Capability Dimension Acceptance Criteria
 *
 * Pure 061 Evaluation Dimension Policy + explicit Acceptance Criteria Specification
 * (no 060/062; no outcomes / defaults / aggregation).
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
import { buildAttentionObservationCapabilityEvaluationDimensionPolicySet } from "../reality/attention-observation-capability-evaluation-dimension-policy-core.js";
import {
  ATTENTION_OBSERVATION_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_MODEL_LIMITATIONS,
  buildAttentionObservationCapabilityDimensionAcceptanceCriteriaSet,
  buildCanonicalCapabilityDimensionAcceptanceCriterionValueKey,
  normalizeAttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification,
} from "../reality/attention-observation-capability-dimension-acceptance-criteria-core.js";
import type {
  AttentionObservationCapabilityDimensionAcceptanceCriterion,
  AttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification,
} from "../reality/attention-observation-capability-dimension-acceptance-criteria-types.js";
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

function policySet(options?: {
  requirements?: {
    observation_need_key: string;
    capability_semantic_key: string;
  }[];
  policies?: {
    capability_requirement_key: string;
    required_dimensions: AttentionObservationCapabilityEvaluationDimension[];
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

  const capability_requirement_set =
    buildAttentionObservationCapabilityRequirementSet({
      planning_set,
      specification: {
        requirements: options?.requirements ?? [
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
        ],
      },
    });

  return buildAttentionObservationCapabilityEvaluationDimensionPolicySet({
    capability_requirement_set,
    specification: {
      policies: options?.policies ?? [
        {
          capability_requirement_key: reqKey(),
          required_dimensions: [
            "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
            "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT",
            "CAPABILITY_SCOPE_APPLICABILITY",
            "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT",
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
}

function buildCriteria(
  policy_set: ReturnType<typeof policySet>,
  specification: AttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification
) {
  return buildAttentionObservationCapabilityDimensionAcceptanceCriteriaSet({
    capability_evaluation_dimension_policy_set: policy_set,
    specification,
  });
}

function criterionAssessment(
  result: ReturnType<typeof buildCriteria>,
  dimension: AttentionObservationCapabilityEvaluationDimension
) {
  return result.candidate_assessments[0].requirement_acceptance_criteria_assessments[0].required_dimension_criterion_assessments.find(
    (a) => a.required_dimension === dimension
  );
}

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"MET"/.test(json));
  assert.ok(!/"UNMET"/.test(json));
  assert.ok(!/"MATCH"/.test(json));
  assert.ok(!/"MISMATCH"/.test(json));
  assert.ok(!/"ACCEPTED"/.test(json));
  assert.ok(!/"NOT_ACCEPTED"/.test(json));
  assert.ok(!/"ALL_REQUIRED_DIMENSIONS_HAVE_CRITERIA"/.test(json));
  assert.ok(!/"CRITERIA_COMPLETE"/.test(json));
  assert.ok(!/"has_capability"/.test(json));
  assert.ok(!/"FEASIBLE"/.test(json));
  assert.ok(!/"can_execute"/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"weight"\s*:/.test(json));
  assert.ok(!/"priority"\s*:/.test(json));
}

describe("Attention Observation Capability Dimension Acceptance Criteria (GROUND-063)", () => {
  describe("purity / architecture / schema", () => {
    it("schema 0.1.24; 061-only runtime; type-only 055/057/058/052/059; no 060/062", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-dimension-acceptance-criteria-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-dimension-acceptance-criteria-types.ts"
        ),
        "utf8"
      );

      assert.ok(/capability_evaluation_dimension_policy_set/.test(types));
      assert.ok(/ANY_REPRESENTED_BASIS_ACCEPTABLE/.test(types));
      assert.ok(/accepted_pairs/.test(types));
      assert.ok(/import type/.test(types));
      assert.ok(!/from ["'].*applicability-composition/.test(core));
      assert.ok(!/from ["'].*required-dimension-coverage/.test(core));
      assert.ok(!/from ["'].*scope-applicability-core/.test(core));
      assert.ok(!/from ["'].*declaration-temporal-applicability-core/.test(core));
      assert.ok(!/from ["'].*verification-temporal-applicability-core/.test(core));
      assert.ok(!/from ["'].*availability-temporal-applicability-core/.test(core));
      assert.ok(!/from ["'].*capability-availability-core/.test(core));
      assert.ok(!/capabilityScopeKey\s*\(/.test(core));
      assert.ok(!/classifyRequiredWindowAgainst/.test(core));
      assert.ok(!/\bDate\.now\s*\(/.test(core));
      assert.ok(!/\bnew Date\s*\(/.test(core));
      assert.ok(!/\bimport\s+type\s+\{[^}]*ProjectState/.test(core));
      assert.ok(/Derived only\. Not persisted/.test(types));
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_MODEL_LIMITATIONS.includes(
          "CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_DEFAULTS_NOT_MODELED"
        )
      );
    });
  });

  describe("policy anchoring / rejects", () => {
    it("baseline required dimension + criterion → PRESENT; no outcome", () => {
      const result = buildCriteria(policySet({
        policies: [
          {
            capability_requirement_key: reqKey(),
            required_dimensions: ["CAPABILITY_SCOPE_APPLICABILITY"],
          },
        ],
      }), {
        criteria: [
          {
            capability_requirement_key: reqKey(),
            criterion: {
              dimension: "CAPABILITY_SCOPE_APPLICABILITY",
              accepted_position_statuses: [
                "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT",
              ],
            },
          },
        ],
      });
      assert.equal(
        result.candidate_assessments[0].status,
        "EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_PRESENT"
      );
      const assessment = criterionAssessment(
        result,
        "CAPABILITY_SCOPE_APPLICABILITY"
      );
      assert.equal(
        assessment?.status,
        "EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION_PRESENT"
      );
      assertNoForbiddenSemantics(result);
    });

    it("policy absent / empty policy / non-required / unknown key reject", () => {
      const withPolicyAbsent = policySet({ policies: [] });
      assert.throws(
        () =>
          normalizeAttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification(
            withPolicyAbsent,
            {
              criteria: [
                {
                  capability_requirement_key: reqKey(),
                  criterion: {
                    dimension: "CAPABILITY_SCOPE_APPLICABILITY",
                    accepted_position_statuses: [
                      "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT",
                    ],
                  },
                },
              ],
            }
          ),
        /has no explicit Capability Evaluation Dimension Policy/
      );

      const emptyDims = policySet({
        policies: [
          {
            capability_requirement_key: reqKey(),
            required_dimensions: [],
          },
        ],
      });
      assert.throws(
        () =>
          normalizeAttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification(
            emptyDims,
            {
              criteria: [
                {
                  capability_requirement_key: reqKey(),
                  criterion: {
                    dimension: "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
                    criterion_kind: "ANY_REPRESENTED_BASIS_ACCEPTABLE",
                  },
                },
              ],
            }
          ),
        /zero required dimensions/
      );

      const scoped = policySet({
        policies: [
          {
            capability_requirement_key: reqKey(),
            required_dimensions: ["CAPABILITY_SCOPE_APPLICABILITY"],
          },
        ],
      });
      assert.throws(
        () =>
          normalizeAttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification(
            scoped,
            {
              criteria: [
                {
                  capability_requirement_key: reqKey(),
                  criterion: {
                    dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
                    accepted_raw_statuses: ["AVAILABLE"],
                  },
                },
              ],
            }
          ),
        /is not required by policy/
      );

      assert.throws(
        () =>
          normalizeAttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification(
            scoped,
            {
              criteria: [
                {
                  capability_requirement_key: "unknown|requirement",
                  criterion: {
                    dimension: "CAPABILITY_SCOPE_APPLICABILITY",
                    accepted_position_statuses: [
                      "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT",
                    ],
                  },
                },
              ],
            }
          ),
        /not found in capability evaluation dimension policy set/
      );
    });

    it("required dimension with no criterion remains ABSENT; missing ≠ empty set", () => {
      const result = buildCriteria(
        policySet({
          policies: [
            {
              capability_requirement_key: reqKey(),
              required_dimensions: [
                "CAPABILITY_SCOPE_APPLICABILITY",
                "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY",
              ],
            },
          ],
        }),
        {
          criteria: [
            {
              capability_requirement_key: reqKey(),
              criterion: {
                dimension: "CAPABILITY_SCOPE_APPLICABILITY",
                accepted_position_statuses: [
                  "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT",
                ],
              },
            },
          ],
        }
      );
      assert.equal(
        criterionAssessment(result, "CAPABILITY_SCOPE_APPLICABILITY")?.status,
        "EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION_PRESENT"
      );
      assert.equal(
        criterionAssessment(
          result,
          "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY"
        )?.status,
        "NO_EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION_DECLARED"
      );
      assert.equal(
        criterionAssessment(
          result,
          "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY"
        )?.acceptance_criterion,
        null
      );
    });
  });

  describe("criterion variants", () => {
    it("presence-only Structural / Scope Req / Temporal Req / Verification Representation", () => {
      const dims: AttentionObservationCapabilityEvaluationDimension[] = [
        "STRUCTURAL_CAPABILITY_DECLARATION_MATCH",
        "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT",
        "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT",
        "CAPABILITY_VERIFICATION_REPRESENTATION",
      ];
      const result = buildCriteria(
        policySet({
          policies: [
            {
              capability_requirement_key: reqKey(),
              required_dimensions: dims,
            },
          ],
        }),
        {
          criteria: dims.map((dimension) => ({
            capability_requirement_key: reqKey(),
            criterion: {
              dimension,
              criterion_kind: "ANY_REPRESENTED_BASIS_ACCEPTABLE",
            } as AttentionObservationCapabilityDimensionAcceptanceCriterion,
          })),
        }
      );
      for (const dimension of dims) {
        assert.deepEqual(
          criterionAssessment(result, dimension)?.acceptance_criterion
            ?.criterion,
          {
            dimension,
            criterion_kind: "ANY_REPRESENTED_BASIS_ACCEPTABLE",
          }
        );
      }
      assertNoForbiddenSemantics(result);
    });

    it("Scope Applicability DIRECT / NO_DIRECT / both / empty", () => {
      const cases: {
        input: (
          | "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT"
          | "NO_DIRECT_SCOPE_APPLICABILITY_BASIS_REPRESENTED"
        )[];
        expected: (
          | "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT"
          | "NO_DIRECT_SCOPE_APPLICABILITY_BASIS_REPRESENTED"
        )[];
      }[] = [
        {
          input: ["DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT"],
          expected: ["DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT"],
        },
        {
          input: ["NO_DIRECT_SCOPE_APPLICABILITY_BASIS_REPRESENTED"],
          expected: ["NO_DIRECT_SCOPE_APPLICABILITY_BASIS_REPRESENTED"],
        },
        {
          input: [
            "NO_DIRECT_SCOPE_APPLICABILITY_BASIS_REPRESENTED",
            "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT",
          ],
          expected: [
            "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT",
            "NO_DIRECT_SCOPE_APPLICABILITY_BASIS_REPRESENTED",
          ],
        },
        { input: [], expected: [] },
      ];

      for (const { input, expected } of cases) {
        const result = buildCriteria(
          policySet({
            policies: [
              {
                capability_requirement_key: reqKey(),
                required_dimensions: ["CAPABILITY_SCOPE_APPLICABILITY"],
              },
            ],
          }),
          {
            criteria: [
              {
                capability_requirement_key: reqKey(),
                criterion: {
                  dimension: "CAPABILITY_SCOPE_APPLICABILITY",
                  accepted_position_statuses: input,
                },
              },
            ],
          }
        );
        const criterion = criterionAssessment(
          result,
          "CAPABILITY_SCOPE_APPLICABILITY"
        )?.acceptance_criterion?.criterion;
        assert.ok(
          criterion && criterion.dimension === "CAPABILITY_SCOPE_APPLICABILITY"
        );
        if (criterion.dimension === "CAPABILITY_SCOPE_APPLICABILITY") {
          assert.deepEqual(criterion.accepted_position_statuses, expected);
        }
      }
    });

    it("Declaration / Verification Temporal FULL/PARTIAL/NO/empty; Availability statuses/pairs", () => {
      const result = buildCriteria(policySet({
        policies: [
          {
            capability_requirement_key: reqKey(),
            required_dimensions: [
              "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY",
              "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY",
              "CAPABILITY_AVAILABILITY_REPRESENTATION",
              "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY",
            ],
          },
        ],
      }), {
        criteria: [
          {
            capability_requirement_key: reqKey(),
            criterion: {
              dimension: "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY",
              accepted_relations: [
                "NO_REQUIRED_WINDOW_OVERLAP",
                "FULL_REQUIRED_WINDOW_COVERAGE",
                "PARTIAL_REQUIRED_WINDOW_OVERLAP",
              ],
            },
          },
          {
            capability_requirement_key: reqKey(),
            criterion: {
              dimension: "CAPABILITY_VERIFICATION_TEMPORAL_APPLICABILITY",
              accepted_relations: ["NO_REQUIRED_WINDOW_OVERLAP"],
            },
          },
          {
            capability_requirement_key: reqKey(),
            criterion: {
              dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION",
              accepted_raw_statuses: ["UNAVAILABLE", "AVAILABLE"],
            },
          },
          {
            capability_requirement_key: reqKey(),
            criterion: {
              dimension: "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY",
              accepted_pairs: [
                {
                  relation: "FULL_REQUIRED_WINDOW_COVERAGE",
                  raw_availability_status: "UNAVAILABLE",
                },
                {
                  relation: "FULL_REQUIRED_WINDOW_COVERAGE",
                  raw_availability_status: "AVAILABLE",
                },
                {
                  relation: "NO_REQUIRED_WINDOW_OVERLAP",
                  raw_availability_status: "AVAILABLE",
                },
              ],
            },
          },
        ],
      });

      const decl = criterionAssessment(
        result,
        "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY"
      )?.acceptance_criterion?.criterion;
      assert.ok(
        decl &&
          decl.dimension === "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY"
      );
      if (decl.dimension === "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY") {
        assert.deepEqual(decl.accepted_relations, [
          "FULL_REQUIRED_WINDOW_COVERAGE",
          "PARTIAL_REQUIRED_WINDOW_OVERLAP",
          "NO_REQUIRED_WINDOW_OVERLAP",
        ]);
      }

      const availTemp = criterionAssessment(
        result,
        "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY"
      )?.acceptance_criterion?.criterion;
      assert.ok(
        availTemp &&
          availTemp.dimension === "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY"
      );
      if (
        availTemp.dimension === "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY"
      ) {
        assert.deepEqual(availTemp.accepted_pairs, [
          {
            relation: "FULL_REQUIRED_WINDOW_COVERAGE",
            raw_availability_status: "AVAILABLE",
          },
          {
            relation: "FULL_REQUIRED_WINDOW_COVERAGE",
            raw_availability_status: "UNAVAILABLE",
          },
          {
            relation: "NO_REQUIRED_WINDOW_OVERLAP",
            raw_availability_status: "AVAILABLE",
          },
        ]);
      }
      assertNoForbiddenSemantics(result);
    });
  });

  describe("normalization / firewalls", () => {
    it("duplicate / reordered criteria normalize; conflicting reject", () => {
      const set = policySet({
        policies: [
          {
            capability_requirement_key: reqKey(),
            required_dimensions: ["CAPABILITY_SCOPE_APPLICABILITY"],
          },
        ],
      });
      const normalized =
        normalizeAttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification(
          set,
          {
            criteria: [
              {
                capability_requirement_key: reqKey(),
                criterion: {
                  dimension: "CAPABILITY_SCOPE_APPLICABILITY",
                  accepted_position_statuses: [
                    "NO_DIRECT_SCOPE_APPLICABILITY_BASIS_REPRESENTED",
                    "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT",
                    "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT",
                  ],
                },
              },
              {
                capability_requirement_key: reqKey(),
                criterion: {
                  dimension: "CAPABILITY_SCOPE_APPLICABILITY",
                  accepted_position_statuses: [
                    "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT",
                    "NO_DIRECT_SCOPE_APPLICABILITY_BASIS_REPRESENTED",
                  ],
                },
              },
            ],
          }
        );
      assert.equal(normalized.criteria.length, 1);
      assert.deepEqual(
        (
          normalized.criteria[0]
            .criterion as Extract<
            AttentionObservationCapabilityDimensionAcceptanceCriterion,
            { dimension: "CAPABILITY_SCOPE_APPLICABILITY" }
          >
        ).accepted_position_statuses,
        [
          "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT",
          "NO_DIRECT_SCOPE_APPLICABILITY_BASIS_REPRESENTED",
        ]
      );

      assert.throws(
        () =>
          normalizeAttentionObservationCapabilityDimensionAcceptanceCriteriaSpecification(
            set,
            {
              criteria: [
                {
                  capability_requirement_key: reqKey(),
                  criterion: {
                    dimension: "CAPABILITY_SCOPE_APPLICABILITY",
                    accepted_position_statuses: [
                      "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT",
                    ],
                  },
                },
                {
                  capability_requirement_key: reqKey(),
                  criterion: {
                    dimension: "CAPABILITY_SCOPE_APPLICABILITY",
                    accepted_position_statuses: [
                      "NO_DIRECT_SCOPE_APPLICABILITY_BASIS_REPRESENTED",
                    ],
                  },
                },
              ],
            }
          ),
        /Multiple Capability Dimension Acceptance Criteria/
      );

      assert.equal(
        buildCanonicalCapabilityDimensionAcceptanceCriterionValueKey({
          dimension: "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY",
          accepted_relations: [
            "PARTIAL_REQUIRED_WINDOW_OVERLAP",
            "FULL_REQUIRED_WINDOW_COVERAGE",
          ],
        }),
        buildCanonicalCapabilityDimensionAcceptanceCriterionValueKey({
          dimension: "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY",
          accepted_relations: [
            "FULL_REQUIRED_WINDOW_COVERAGE",
            "PARTIAL_REQUIRED_WINDOW_OVERLAP",
          ],
        })
      );
    });

    it("no defaults; empty accepted set allowed; immutability; determinism", () => {
      const policies = policySet({
        policies: [
          {
            capability_requirement_key: reqKey(),
            required_dimensions: [
              "CAPABILITY_SCOPE_APPLICABILITY",
              "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY",
              "CAPABILITY_AVAILABILITY_REPRESENTATION",
              "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY",
            ],
          },
        ],
      });
      const specification = {
        criteria: [
          {
            capability_requirement_key: reqKey(),
            criterion: {
              dimension: "CAPABILITY_SCOPE_APPLICABILITY" as const,
              accepted_position_statuses: [] as [],
            },
          },
          {
            capability_requirement_key: reqKey(),
            criterion: {
              dimension: "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY" as const,
              accepted_relations: [] as [],
            },
          },
          {
            capability_requirement_key: reqKey(),
            criterion: {
              dimension: "CAPABILITY_AVAILABILITY_REPRESENTATION" as const,
              accepted_raw_statuses: [] as [],
            },
          },
          {
            capability_requirement_key: reqKey(),
            criterion: {
              dimension: "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY" as const,
              accepted_pairs: [] as [],
            },
          },
        ],
      };
      const beforePolicy = deepClone(policies);
      const beforeSpec = deepClone(specification);
      const a = buildCriteria(policies, specification);
      assert.deepEqual(policies, beforePolicy);
      assert.deepEqual(specification, beforeSpec);
      const b = buildCriteria(policies, specification);
      assert.deepEqual(a, b);

      // Empty accepted sets are PRESENT criteria, not absence / fail.
      for (const dimension of [
        "CAPABILITY_SCOPE_APPLICABILITY",
        "CAPABILITY_DECLARATION_TEMPORAL_APPLICABILITY",
        "CAPABILITY_AVAILABILITY_REPRESENTATION",
        "CAPABILITY_AVAILABILITY_TEMPORAL_APPLICABILITY",
      ] as const) {
        assert.equal(
          criterionAssessment(a, dimension)?.status,
          "EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERION_PRESENT"
        );
      }
      assertNoForbiddenSemantics(a);

      // Mixed requirements: existential PRESENT only.
      const mixed = buildCriteria(
        policySet({
          requirements: [
            {
              observation_need_key: NEED_KEY,
              capability_semantic_key: CAP_C1,
            },
            {
              observation_need_key: NEED_KEY,
              capability_semantic_key: CAP_C2,
            },
          ],
          policies: [
            {
              capability_requirement_key: reqKey(CAP_C1),
              required_dimensions: ["CAPABILITY_SCOPE_APPLICABILITY"],
            },
            {
              capability_requirement_key: reqKey(CAP_C2),
              required_dimensions: ["CAPABILITY_VERIFICATION_REPRESENTATION"],
            },
          ],
        }),
        {
          criteria: [
            {
              capability_requirement_key: reqKey(CAP_C1),
              criterion: {
                dimension: "CAPABILITY_SCOPE_APPLICABILITY",
                accepted_position_statuses: [
                  "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT",
                ],
              },
            },
          ],
        }
      );
      assert.equal(
        mixed.candidate_assessments[0].status,
        "EXPLICIT_CAPABILITY_DIMENSION_ACCEPTANCE_CRITERIA_PRESENT"
      );
      const byKey = new Map(
        mixed.candidate_assessments[0].requirement_acceptance_criteria_assessments.map(
          (a) => [a.capability_requirement.key, a]
        )
      );
      assert.equal(
        byKey.get(reqKey(CAP_C1))?.has_explicit_capability_dimension_acceptance_criteria,
        true
      );
      assert.equal(
        byKey.get(reqKey(CAP_C2))?.has_explicit_capability_dimension_acceptance_criteria,
        false
      );
      assert.ok(!/"CRITERIA_COMPLETE"/.test(JSON.stringify(mixed)));
    });
  });
});
