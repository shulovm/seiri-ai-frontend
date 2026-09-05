/**
 * GROUND-120 — Observation Core LXXIV / Explicit Operational Eligibility
 * AUTHORITY Source Acceptance Criteria Foundation
 *
 * Pure 084 Dimension Policy + explicit acceptance-criteria specification
 * (declarative only; no 117/118/119; empty ≠ absence; no match/aggregation/OE).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_MODEL_LIMITATIONS,
  EMPTY_ACCEPTED_CANONICAL_AUTHORITY_STATE_SET,
  assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceCriteria,
  attentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterionKey,
  buildAttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSet,
  buildCanonicalAcceptedCanonicalAuthorityStateSetKey,
  canonicalizeAcceptedCanonicalAuthorityStates,
  normalizeAttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSpecification,
} from "../reality/attention-observation-operational-eligibility-authority-source-acceptance-criteria-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimension,
  AttentionObservationOperationalEligibilityDimensionPolicy,
} from "../reality/attention-observation-operational-eligibility-dimension-policy-types.js";
import type { AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue } from "../reality/attention-observation-operational-eligibility-canonical-authority-state-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const CAND_B = "cand-b";
const NEED_KEY = "need";
const SET_KEY =
  "attention-observation-capability-requirement-set|cand|need|req";
const POLICY_KEY = "084-oe-dimension-policy|cand";
const POLICY_KEY_ALT = "084-oe-dimension-policy|cand|alt";

const POSITIVE = "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE" as const;
const NEGATIVE = "EXPLICITLY_INTERPRETED_AUTHORITY_NEGATIVE" as const;
const UNRESOLVED_POLICY =
  "UNRESOLVED_NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_POLICY" as const;
const UNRESOLVED_MAPPING =
  "UNRESOLVED_NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE" as const;

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"ACCEPTED"/.test(json));
  assert.ok(!/"REJECTED"/.test(json));
  assert.ok(!/"LISTED"/.test(json));
  assert.ok(!/"NOT_LISTED"/.test(json));
  assert.ok(!/"REPRESENTED"/.test(json));
  assert.ok(!/"NOT_REPRESENTED"/.test(json));
  assert.ok(!/"SOURCE_PRESENT"/.test(json));
  assert.ok(!/"authority_sources"/.test(json));
  assert.ok(!/"authority_source_key"/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"ANY_SOURCE"/.test(json));
  assert.ok(!/"ALL_SOURCES"/.test(json));
}

function mockPolicy(options?: {
  status?:
    | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
    | "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT";
  required_dimensions?: AttentionObservationOperationalEligibilityDimension[];
  policy_key?: string;
  candidate_key?: string;
  observation_need_key?: string;
  set_key?: string;
}): AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment {
  const status =
    options?.status ??
    "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT";
  const present =
    status === "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT";
  const required_dimensions = options?.required_dimensions ?? [
    "CAPABILITY_STATE",
    "AUTHORITY",
  ];
  const policy: AttentionObservationOperationalEligibilityDimensionPolicy | null =
    present
      ? {
          key: options?.policy_key ?? POLICY_KEY,
          candidate_key: options?.candidate_key ?? CAND,
          observation_need_key: options?.observation_need_key ?? NEED_KEY,
          capability_requirement_set_key: options?.set_key ?? SET_KEY,
          capability_requirement_keys: ["req"],
          required_dimensions,
        }
      : null;

  return {
    candidate_key: options?.candidate_key ?? CAND,
    capability_requirement_assessment: {} as never,
    status,
    operational_eligibility_dimension_policy: policy,
    model_limitations: [],
  };
}

function buildSet(
  policy = mockPolicy(),
  criteria: {
    candidate_key: string;
    accepted_canonical_authority_states: AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue[];
  }[] = [{ candidate_key: CAND, accepted_canonical_authority_states: [POSITIVE] }]
) {
  return buildAttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSet(
    {
      operational_eligibility_dimension_policy_set: {
        capability_requirement_set: {} as never,
        specification: { policies: [] },
        candidate_assessments: [policy],
        has_explicit_operational_eligibility_dimension_policies:
          policy.status ===
          "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT",
        model_limitations: [],
      },
      specification: { criteria },
    }
  );
}

function deepClone<T>(value: T): T {
  return structuredClone(value);
}

describe("GROUND-120 Explicit Operational Eligibility AUTHORITY Source Acceptance Criteria", () => {
  describe("criterion declaration semantics", () => {
    it("required AUTHORITY + [POSITIVE] → PRESENT; no current match", () => {
      const set = buildSet();
      const assessment = set.candidate_assessments[0]!;
      assert.equal(
        assessment.status,
        "EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_PRESENT"
      );
      assert.equal(
        assessment.has_explicit_authority_source_acceptance_criterion,
        true
      );
      const criterion = assessment.authority_source_acceptance_criterion!;
      assert.deepEqual(criterion.accepted_canonical_authority_states, [
        POSITIVE,
      ]);
      assert.equal(criterion.dimension, "AUTHORITY");
      assert.equal(
        criterion.operational_eligibility_dimension_policy_key,
        POLICY_KEY
      );
      assertNoForbiddenSemantics(set);
    });

    it("required AUTHORITY + [NEGATIVE] valid", () => {
      const criterion = buildSet(mockPolicy(), [
        {
          candidate_key: CAND,
          accepted_canonical_authority_states: [NEGATIVE],
        },
      ]).candidate_assessments[0]!.authority_source_acceptance_criterion!;
      assert.deepEqual(criterion.accepted_canonical_authority_states, [
        NEGATIVE,
      ]);
    });

    it("required AUTHORITY + NO_POLICY unresolved valid", () => {
      assert.deepEqual(
        buildSet(mockPolicy(), [
          {
            candidate_key: CAND,
            accepted_canonical_authority_states: [UNRESOLVED_POLICY],
          },
        ]).candidate_assessments[0]!.authority_source_acceptance_criterion!
          .accepted_canonical_authority_states,
        [UNRESOLVED_POLICY]
      );
    });

    it("required AUTHORITY + NO_MAPPING unresolved valid", () => {
      assert.deepEqual(
        buildSet(mockPolicy(), [
          {
            candidate_key: CAND,
            accepted_canonical_authority_states: [UNRESOLVED_MAPPING],
          },
        ]).candidate_assessments[0]!.authority_source_acceptance_criterion!
          .accepted_canonical_authority_states,
        [UNRESOLVED_MAPPING]
      );
    });

    it("mixed negative + unresolved and full four-value sets valid", () => {
      const mixed = buildSet(mockPolicy(), [
        {
          candidate_key: CAND,
          accepted_canonical_authority_states: [
            UNRESOLVED_POLICY,
            NEGATIVE,
          ],
        },
      ]).candidate_assessments[0]!.authority_source_acceptance_criterion!;
      assert.deepEqual(mixed.accepted_canonical_authority_states, [
        NEGATIVE,
        UNRESOLVED_POLICY,
      ]);

      const full = buildSet(mockPolicy(), [
        {
          candidate_key: CAND,
          accepted_canonical_authority_states: [
            UNRESOLVED_MAPPING,
            UNRESOLVED_POLICY,
            NEGATIVE,
            POSITIVE,
          ],
        },
      ]).candidate_assessments[0]!.authority_source_acceptance_criterion!;
      assert.deepEqual(full.accepted_canonical_authority_states, [
        POSITIVE,
        NEGATIVE,
        UNRESOLVED_POLICY,
        UNRESOLVED_MAPPING,
      ]);
    });

    it("explicit empty accepted set → PRESENT; != absence / != reject-all", () => {
      const assessment = buildSet(mockPolicy(), [
        { candidate_key: CAND, accepted_canonical_authority_states: [] },
      ]).candidate_assessments[0]!;
      assert.equal(
        assessment.status,
        "EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_PRESENT"
      );
      assert.equal(
        assessment.has_explicit_authority_source_acceptance_criterion,
        true
      );
      assert.deepEqual(
        assessment.authority_source_acceptance_criterion!
          .accepted_canonical_authority_states,
        []
      );
      assert.notEqual(
        assessment.status,
        "NO_EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_DECLARED"
      );
      assert.notEqual(
        assessment.status,
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
      );
    });

    it("criterion absent → NO_CRITERION; != accept-any / != reject-all", () => {
      const assessment = buildSet(mockPolicy(), []).candidate_assessments[0]!;
      assert.equal(
        assessment.status,
        "NO_EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_DECLARED"
      );
      assert.equal(
        assessment.has_explicit_authority_source_acceptance_criterion,
        false
      );
      assert.equal(assessment.authority_source_acceptance_criterion, null);
    });

    it("POSITIVE not implicitly inserted; NEGATIVE/UNRESOLVED not implicitly rejected", () => {
      const empty = buildSet(mockPolicy(), [
        { candidate_key: CAND, accepted_canonical_authority_states: [] },
      ]).candidate_assessments[0]!.authority_source_acceptance_criterion!;
      assert.ok(!empty.accepted_canonical_authority_states.includes(POSITIVE));

      const negativeOnly = buildSet(mockPolicy(), [
        {
          candidate_key: CAND,
          accepted_canonical_authority_states: [NEGATIVE],
        },
      ]).candidate_assessments[0]!.authority_source_acceptance_criterion!;
      assert.deepEqual(negativeOnly.accepted_canonical_authority_states, [
        NEGATIVE,
      ]);
    });
  });

  describe("normalization / conflicts / identity", () => {
    it("duplicate accepted state normalizes; reorder same key", () => {
      assert.deepEqual(
        canonicalizeAcceptedCanonicalAuthorityStates([
          POSITIVE,
          POSITIVE,
          NEGATIVE,
        ]),
        [POSITIVE, NEGATIVE]
      );
      const a = buildSet(mockPolicy(), [
        {
          candidate_key: CAND,
          accepted_canonical_authority_states: [NEGATIVE, POSITIVE],
        },
      ]).candidate_assessments[0]!.authority_source_acceptance_criterion!;
      const b = buildSet(mockPolicy(), [
        {
          candidate_key: CAND,
          accepted_canonical_authority_states: [POSITIVE, NEGATIVE],
        },
      ]).candidate_assessments[0]!.authority_source_acceptance_criterion!;
      assert.equal(a.key, b.key);
    });

    it("same exact criterion duplicate normalizes; conflicting rejects", () => {
      const policySet = {
        capability_requirement_set: {} as never,
        specification: { policies: [] },
        candidate_assessments: [mockPolicy()],
        has_explicit_operational_eligibility_dimension_policies: true,
        model_limitations: [],
      };

      const normalized =
        normalizeAttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSpecification(
          policySet,
          {
            criteria: [
              {
                candidate_key: CAND,
                accepted_canonical_authority_states: [POSITIVE],
              },
              {
                candidate_key: CAND,
                accepted_canonical_authority_states: [POSITIVE],
              },
            ],
          }
        );
      assert.equal(normalized.criteria.length, 1);

      assert.throws(() =>
        normalizeAttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSpecification(
          policySet,
          {
            criteria: [
              {
                candidate_key: CAND,
                accepted_canonical_authority_states: [POSITIVE],
              },
              {
                candidate_key: CAND,
                accepted_canonical_authority_states: [NEGATIVE],
              },
            ],
          }
        )
      );
    });

    it("policy identity / accepted-set change identity; empty set stable token", () => {
      const emptyKey = buildCanonicalAcceptedCanonicalAuthorityStateSetKey([]);
      assert.equal(emptyKey, EMPTY_ACCEPTED_CANONICAL_AUTHORITY_STATE_SET);

      const base =
        attentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterionKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            operational_eligibility_dimension_policy_key: POLICY_KEY,
            accepted_canonical_authority_states: [POSITIVE],
          }
        );
      const policyChanged =
        attentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterionKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            operational_eligibility_dimension_policy_key: POLICY_KEY_ALT,
            accepted_canonical_authority_states: [POSITIVE],
          }
        );
      assert.notEqual(base, policyChanged);

      const setChanged =
        attentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterionKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            operational_eligibility_dimension_policy_key: POLICY_KEY,
            accepted_canonical_authority_states: [POSITIVE, NEGATIVE],
          }
        );
      assert.notEqual(base, setChanged);
    });
  });

  describe("outer statuses / invalid targets", () => {
    it("no planning / Requirements / no policy → criterion null", () => {
      for (const status of [
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
      ] as const) {
        const assessment = buildSet(
          mockPolicy({ status }),
          []
        ).candidate_assessments[0]!;
        assert.equal(assessment.status, status);
        assert.equal(assessment.authority_source_acceptance_criterion, null);
      }
    });

    it("AUTHORITY not required → NOT_REQUIRED", () => {
      const assessment = buildSet(
        mockPolicy({ required_dimensions: ["CAPABILITY_STATE"] }),
        []
      ).candidate_assessments[0]!;
      assert.equal(
        assessment.status,
        "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
      );
      assert.equal(assessment.authority_source_acceptance_criterion, null);
    });

    it("explicit empty 084 required_dimensions → AUTHORITY NOT_REQUIRED", () => {
      assert.equal(
        buildSet(mockPolicy({ required_dimensions: [] }), []).candidate_assessments[0]!
          .status,
        "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
      );
    });

    it("policy absent + criterion specification rejects", () => {
      assert.throws(() =>
        buildSet(
          mockPolicy({
            status: "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
          }),
          [{ candidate_key: CAND, accepted_canonical_authority_states: [POSITIVE] }]
        )
      );
    });

    it("AUTHORITY not required + criterion specification rejects", () => {
      assert.throws(() =>
        buildSet(
          mockPolicy({ required_dimensions: ["PERMISSION"] }),
          [{ candidate_key: CAND, accepted_canonical_authority_states: [POSITIVE] }]
        )
      );
    });

    it("unknown Candidate rejects", () => {
      assert.throws(() =>
        buildSet(mockPolicy(), [
          {
            candidate_key: "unknown",
            accepted_canonical_authority_states: [POSITIVE],
          },
        ])
      );
    });

    it("ambiguous Candidate rejects", () => {
      const policySet = {
        capability_requirement_set: {} as never,
        specification: { policies: [] },
        candidate_assessments: [mockPolicy(), mockPolicy()],
        has_explicit_operational_eligibility_dimension_policies: true,
        model_limitations: [],
      };
      assert.throws(() =>
        normalizeAttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSpecification(
          policySet,
          {
            criteria: [
              {
                candidate_key: CAND,
                accepted_canonical_authority_states: [POSITIVE],
              },
            ],
          }
        )
      );
    });

    it("no planning + criterion specification rejects", () => {
      assert.throws(() =>
        buildSet(
          mockPolicy({
            status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
          }),
          [{ candidate_key: CAND, accepted_canonical_authority_states: [POSITIVE] }]
        )
      );
    });
  });

  describe("determinism / immutability / static boundaries", () => {
    it("input immutability, deep-clone equivalence, determinism", () => {
      const input = {
        operational_eligibility_dimension_policy_set: {
          capability_requirement_set: {} as never,
          specification: { policies: [] },
          candidate_assessments: [mockPolicy()],
          has_explicit_operational_eligibility_dimension_policies: true,
          model_limitations: [],
        },
        specification: {
          criteria: [
            {
              candidate_key: CAND,
              accepted_canonical_authority_states: [POSITIVE],
            },
          ],
        },
      };
      const before = deepClone(input);
      const a =
        buildAttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSet(
          input
        );
      const b =
        buildAttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSet(
          input
        );
      const c =
        buildAttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaSet(
          deepClone(input)
        );
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
    });

    it("zero current sources does not block criterion declaration", () => {
      const assessment = assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceCriteria(
        mockPolicy(),
        {
          criteria: [
            {
              candidate_key: CAND,
              accepted_canonical_authority_states: [UNRESOLVED_POLICY],
            },
          ],
        }
      );
      assert.equal(
        assessment.status,
        "EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_PRESENT"
      );
      assert.deepEqual(
        assessment.authority_source_acceptance_criterion!
          .accepted_canonical_authority_states,
        [UNRESOLVED_POLICY]
      );
    });

    it("schema 0.1.24; 084 only; no 117/118/119; no match semantics", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      assert.deepEqual(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_MODEL_LIMITATIONS.slice(
          0,
          2
        ),
        [
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_POLICY_NOT_MODELED",
        ]
      );

      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-source-acceptance-criteria-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-source-acceptance-criteria-types.ts"
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
        /attention-observation-operational-eligibility-dimension-policy-types/.test(
          core
        )
      );
      assert.ok(
        /attention-observation-operational-eligibility-canonical-authority-state-types/.test(
          types
        )
      );
      assert.ok(
        !/from ["'].*canonical-authority-state-core/.test(src)
      );
      assert.ok(
        !/from ["'].*authority-source-bridge/.test(src)
      );
      assert.ok(
        !/from ["'].*authority-required-dimension-coverage/.test(src)
      );
      assert.ok(
        !/from ["'].*authority-source-resolution-classification/.test(src)
      );
      assert.ok(!/import.*ProjectState/.test(coreCode));
      assert.ok(!/Date\.now\(/.test(coreCode));
      assert.ok(!/"ACCEPTED"/.test(src));
      assert.ok(!/"REJECTED"/.test(src));
      assert.ok(!/"LISTED"/.test(src));
      assert.ok(!/"REPRESENTED"/.test(src));
      assert.ok(!/"RESOLVED"/.test(src) || /UNRESOLVED/.test(src));
      assert.ok(!/"authority_sources"/.test(src));
      assert.ok(!/\bif\s*\(\s*resolved/.test(coreCode));
    });
  });
});
