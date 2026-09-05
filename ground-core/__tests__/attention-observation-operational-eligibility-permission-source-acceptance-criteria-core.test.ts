/**
 * GROUND-096 — Observation Core L / Explicit Operational Eligibility Permission
 * Source Acceptance Criteria Foundation
 *
 * Pure 084 Dimension Policy + explicit acceptance-criteria specification
 * (declarative only; no 093/094/095; empty ≠ absence; no match/aggregation/OE).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTANCE_CRITERIA_MODEL_LIMITATIONS,
  EMPTY_ACCEPTED_PERMISSION_STATE_SET,
  assessAttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceCriteria,
  attentionObservationOperationalEligibilityPermissionSourceAcceptanceCriterionKey,
  buildAttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSet,
  buildCanonicalAcceptedPermissionStateSetKey,
  canonicalizeAcceptedPermissionStates,
  normalizeAttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSpecification,
} from "../reality/attention-observation-operational-eligibility-permission-source-acceptance-criteria-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimension,
  AttentionObservationOperationalEligibilityDimensionPolicy,
} from "../reality/attention-observation-operational-eligibility-dimension-policy-types.js";
import type { AttentionObservationPermissionState } from "../reality/attention-observation-permission-state-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const CAND_B = "cand-b";
const NEED_KEY = "need";
const SET_KEY =
  "attention-observation-capability-requirement-set|cand|need|req";
const POLICY_KEY = "084-oe-dimension-policy|cand";
const POLICY_KEY_ALT = "084-oe-dimension-policy|cand|alt";

const PERMITTED = "PERMISSION_PERMITTED" as const;
const PROHIBITED = "PERMISSION_PROHIBITED" as const;
const UNRESOLVED_POLICY =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY" as const;
const UNRESOLVED_MAPPING =
  "UNRESOLVED_NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS" as const;

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
  assert.ok(!/"RESOLVED"/.test(json));
  assert.ok(!/"UNRESOLVED"\s*:/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"OPERATIONALLY_INELIGIBLE"/.test(json));
  assert.ok(!/"effective_permission"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"ANY_SOURCE"/.test(json));
  assert.ok(!/"ALL_SOURCES"/.test(json));
  assert.ok(!/"permission_state_sources"/.test(json));
  assert.ok(!/"permission_state_source_key"/.test(json));
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
    "PERMISSION",
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
    accepted_permission_states: AttentionObservationPermissionState[];
  }[] = [
    {
      candidate_key: CAND,
      accepted_permission_states: [PERMITTED],
    },
  ]
) {
  return buildAttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSet(
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
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-096 Explicit Operational Eligibility Permission Source Acceptance Criteria", () => {
  describe("criterion declaration semantics", () => {
    it("required PERMISSION + [PERMISSION_PERMITTED] → PRESENT; no current match", () => {
      const set = buildSet();
      const assessment = set.candidate_assessments[0]!;
      assert.equal(
        assessment.status,
        "EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_PRESENT"
      );
      assert.equal(
        assessment.has_explicit_permission_source_acceptance_criterion,
        true
      );
      const criterion = assessment.permission_source_acceptance_criterion!;
      assert.deepEqual(criterion.accepted_permission_states, [PERMITTED]);
      assert.equal(criterion.dimension, "PERMISSION");
      assert.equal(
        criterion.operational_eligibility_dimension_policy_key,
        POLICY_KEY
      );
      assertNoForbiddenSemantics(set);
    });

    it("required PERMISSION + [PERMISSION_PROHIBITED] valid", () => {
      const criterion = buildSet(mockPolicy(), [
        { candidate_key: CAND, accepted_permission_states: [PROHIBITED] },
      ]).candidate_assessments[0]!.permission_source_acceptance_criterion!;
      assert.deepEqual(criterion.accepted_permission_states, [PROHIBITED]);
    });

    it("required PERMISSION + unresolved policy-absence state valid", () => {
      assert.deepEqual(
        buildSet(mockPolicy(), [
          {
            candidate_key: CAND,
            accepted_permission_states: [UNRESOLVED_POLICY],
          },
        ]).candidate_assessments[0]!.permission_source_acceptance_criterion!
          .accepted_permission_states,
        [UNRESOLVED_POLICY]
      );
    });

    it("required PERMISSION + unresolved no-mapping state valid", () => {
      assert.deepEqual(
        buildSet(mockPolicy(), [
          {
            candidate_key: CAND,
            accepted_permission_states: [UNRESOLVED_MAPPING],
          },
        ]).candidate_assessments[0]!.permission_source_acceptance_criterion!
          .accepted_permission_states,
        [UNRESOLVED_MAPPING]
      );
    });

    it("mixed and full accepted sets valid; order canonicalized", () => {
      const mixed = buildSet(mockPolicy(), [
        {
          candidate_key: CAND,
          accepted_permission_states: [
            UNRESOLVED_MAPPING,
            PERMITTED,
            PROHIBITED,
          ],
        },
      ]).candidate_assessments[0]!.permission_source_acceptance_criterion!;
      assert.deepEqual(mixed.accepted_permission_states, [
        PERMITTED,
        PROHIBITED,
        UNRESOLVED_MAPPING,
      ]);

      const full = buildSet(mockPolicy(), [
        {
          candidate_key: CAND,
          accepted_permission_states: [
            UNRESOLVED_MAPPING,
            UNRESOLVED_POLICY,
            PROHIBITED,
            PERMITTED,
          ],
        },
      ]).candidate_assessments[0]!.permission_source_acceptance_criterion!;
      assert.deepEqual(full.accepted_permission_states, [
        PERMITTED,
        PROHIBITED,
        UNRESOLVED_POLICY,
        UNRESOLVED_MAPPING,
      ]);
    });

    it("explicit empty accepted set → PRESENT; != absence / != reject-all", () => {
      const assessment = buildSet(mockPolicy(), [
        { candidate_key: CAND, accepted_permission_states: [] },
      ]).candidate_assessments[0]!;
      assert.equal(
        assessment.status,
        "EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_PRESENT"
      );
      assert.equal(
        assessment.has_explicit_permission_source_acceptance_criterion,
        true
      );
      assert.deepEqual(
        assessment.permission_source_acceptance_criterion!
          .accepted_permission_states,
        []
      );
      assert.notEqual(
        assessment.status,
        "NO_EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_DECLARED"
      );
      assert.notEqual(
        assessment.status,
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
      );
      assert.ok(!/"reject-all"|"REJECTED"/.test(JSON.stringify(assessment)));
    });

    it("criterion absent → NO_CRITERION; != accept-any / != reject-all", () => {
      const assessment = buildSet(mockPolicy(), []).candidate_assessments[0]!;
      assert.equal(
        assessment.status,
        "NO_EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_DECLARED"
      );
      assert.equal(
        assessment.has_explicit_permission_source_acceptance_criterion,
        false
      );
      assert.equal(assessment.permission_source_acceptance_criterion, null);
      assert.ok(!/"accept-any"|"ACCEPT_ANY"/.test(JSON.stringify(assessment)));
      assert.ok(!/"reject-all"|"REJECT_ALL"/.test(JSON.stringify(assessment)));
    });

    it("PERMISSION_PERMITTED not implicitly inserted; PROHIBITED/UNRESOLVED not implicitly rejected", () => {
      const empty = buildSet(mockPolicy(), [
        { candidate_key: CAND, accepted_permission_states: [] },
      ]).candidate_assessments[0]!.permission_source_acceptance_criterion!;
      assert.ok(!empty.accepted_permission_states.includes(PERMITTED));

      const prohibitedOnly = buildSet(mockPolicy(), [
        { candidate_key: CAND, accepted_permission_states: [PROHIBITED] },
      ]).candidate_assessments[0]!.permission_source_acceptance_criterion!;
      assert.deepEqual(prohibitedOnly.accepted_permission_states, [PROHIBITED]);
      assert.ok(!/"REJECTED"/.test(JSON.stringify(prohibitedOnly)));

      const unresolvedOnly = buildSet(mockPolicy(), [
        {
          candidate_key: CAND,
          accepted_permission_states: [UNRESOLVED_POLICY],
        },
      ]).candidate_assessments[0]!.permission_source_acceptance_criterion!;
      assert.deepEqual(unresolvedOnly.accepted_permission_states, [
        UNRESOLVED_POLICY,
      ]);
    });
  });

  describe("normalization / conflicts / identity", () => {
    it("duplicate accepted state normalizes; reorder same key", () => {
      assert.deepEqual(
        canonicalizeAcceptedPermissionStates([PERMITTED, PERMITTED, PROHIBITED]),
        [PERMITTED, PROHIBITED]
      );
      const a = buildSet(mockPolicy(), [
        {
          candidate_key: CAND,
          accepted_permission_states: [PROHIBITED, PERMITTED],
        },
      ]).candidate_assessments[0]!.permission_source_acceptance_criterion!;
      const b = buildSet(mockPolicy(), [
        {
          candidate_key: CAND,
          accepted_permission_states: [PERMITTED, PROHIBITED],
        },
      ]).candidate_assessments[0]!.permission_source_acceptance_criterion!;
      assert.equal(a.key, b.key);
      assert.deepEqual(a.accepted_permission_states, b.accepted_permission_states);
    });

    it("same exact criterion duplicate normalizes; conflicting rejects; no partial merge", () => {
      const policySet = {
        capability_requirement_set: {} as never,
        specification: { policies: [] },
        candidate_assessments: [mockPolicy()],
        has_explicit_operational_eligibility_dimension_policies: true,
        model_limitations: [],
      };

      const normalized =
        normalizeAttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSpecification(
          policySet,
          {
            criteria: [
              {
                candidate_key: CAND,
                accepted_permission_states: [PERMITTED],
              },
              {
                candidate_key: CAND,
                accepted_permission_states: [PERMITTED],
              },
            ],
          }
        );
      assert.equal(normalized.criteria.length, 1);

      assert.throws(() =>
        normalizeAttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSpecification(
          policySet,
          {
            criteria: [
              {
                candidate_key: CAND,
                accepted_permission_states: [PERMITTED],
              },
              {
                candidate_key: CAND,
                accepted_permission_states: [PROHIBITED],
              },
            ],
          }
        )
      );
    });

    it("policy identity / accepted-set change identity; empty set stable token", () => {
      const emptyKey = buildCanonicalAcceptedPermissionStateSetKey([]);
      assert.equal(emptyKey, EMPTY_ACCEPTED_PERMISSION_STATE_SET);

      const base =
        attentionObservationOperationalEligibilityPermissionSourceAcceptanceCriterionKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            operational_eligibility_dimension_policy_key: POLICY_KEY,
            accepted_permission_states: [PERMITTED],
          }
        );
      const policyChanged =
        attentionObservationOperationalEligibilityPermissionSourceAcceptanceCriterionKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            operational_eligibility_dimension_policy_key: POLICY_KEY_ALT,
            accepted_permission_states: [PERMITTED],
          }
        );
      assert.notEqual(base, policyChanged);

      const setChanged =
        attentionObservationOperationalEligibilityPermissionSourceAcceptanceCriterionKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            operational_eligibility_dimension_policy_key: POLICY_KEY,
            accepted_permission_states: [PROHIBITED],
          }
        );
      assert.notEqual(base, setChanged);

      const emptyA =
        attentionObservationOperationalEligibilityPermissionSourceAcceptanceCriterionKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            operational_eligibility_dimension_policy_key: POLICY_KEY,
            accepted_permission_states: [],
          }
        );
      const emptyB =
        attentionObservationOperationalEligibilityPermissionSourceAcceptanceCriterionKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            operational_eligibility_dimension_policy_key: POLICY_KEY,
            accepted_permission_states: [],
          }
        );
      assert.equal(emptyA, emptyB);
      assert.ok(emptyA.includes(EMPTY_ACCEPTED_PERMISSION_STATE_SET));
    });
  });

  describe("outer status / invalid targets", () => {
    it("no planning / no Requirements / no policy → no criterion", () => {
      assert.equal(
        buildSet(
          mockPolicy({
            status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
          }),
          []
        ).candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
      assert.equal(
        buildSet(
          mockPolicy({
            status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
          }),
          []
        ).candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
      assert.equal(
        buildSet(
          mockPolicy({
            status:
              "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
          }),
          []
        ).candidate_assessments[0]!.status,
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
      );
    });

    it("PERMISSION not required / explicit empty 084 policy → NOT_REQUIRED", () => {
      assert.equal(
        buildSet(
          mockPolicy({ required_dimensions: ["AUTHORITY"] }),
          []
        ).candidate_assessments[0]!.status,
        "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
      );
      assert.equal(
        buildSet(
          mockPolicy({ required_dimensions: [] }),
          []
        ).candidate_assessments[0]!.status,
        "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
      );
    });

    it("criterion targeting not-required / policy-absent / unknown / ambiguous → reject", () => {
      assert.throws(() =>
        buildSet(mockPolicy({ required_dimensions: ["AUTHORITY"] }), [
          { candidate_key: CAND, accepted_permission_states: [PERMITTED] },
        ])
      );
      assert.throws(() =>
        buildSet(
          mockPolicy({
            status:
              "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
          }),
          [{ candidate_key: CAND, accepted_permission_states: [PERMITTED] }]
        )
      );
      assert.throws(() =>
        buildSet(mockPolicy(), [
          {
            candidate_key: "unknown-cand",
            accepted_permission_states: [PERMITTED],
          },
        ])
      );

      const ambiguousSet = {
        capability_requirement_set: {} as never,
        specification: { policies: [] },
        candidate_assessments: [
          mockPolicy({ candidate_key: CAND }),
          mockPolicy({
            candidate_key: CAND,
            policy_key: POLICY_KEY_ALT,
            observation_need_key: "need-other",
          }),
        ],
        has_explicit_operational_eligibility_dimension_policies: true,
        model_limitations: [],
      };
      assert.throws(() =>
        normalizeAttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSpecification(
          ambiguousSet,
          {
            criteria: [
              {
                candidate_key: CAND,
                accepted_permission_states: [PERMITTED],
              },
            ],
          }
        )
      );
    });
  });

  describe("set boolean / independence", () => {
    it("set boolean true for empty criterion; false when absent", () => {
      assert.equal(
        buildSet(mockPolicy(), [
          { candidate_key: CAND, accepted_permission_states: [] },
        ]).has_explicit_permission_source_acceptance_criteria,
        true
      );
      assert.equal(
        buildSet(mockPolicy(), []).has_explicit_permission_source_acceptance_criteria,
        false
      );
    });

    it("Permission independent from Authority/Capability/Resource/Feasibility tokens in output", () => {
      const set = buildSet();
      const json = JSON.stringify(set.candidate_assessments[0]!
        .permission_source_acceptance_criterion);
      assert.ok(!/"AUTHORITY"/.test(json));
      assert.ok(!/"RESOURCE_READINESS"/.test(json));
      assert.ok(!/"FEASIBILITY"/.test(json));
      assert.ok(!/"capability_state"/.test(json));
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
              accepted_permission_states: [PROHIBITED, PERMITTED],
            },
          ],
        },
      };
      const before = deepClone(input);
      const a =
        buildAttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSet(
          input
        );
      const b =
        buildAttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSet(
          input
        );
      const c =
        buildAttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSet(
          deepClone(input)
        );
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
    });

    it("schema 0.1.24; no 093/094/095/091-core/024–090; no match/aggregation/OE", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      assert.deepEqual(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTANCE_CRITERIA_MODEL_LIMITATIONS.slice(
          0,
          3
        ),
        [
          "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_POLICY_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_NOT_MODELED",
        ]
      );

      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-permission-source-acceptance-criteria-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-permission-source-acceptance-criteria-types.ts"
        ),
        "utf8"
      );
      const stripComments = (s: string) =>
        s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
      const src = stripComments(core + types);
      const coreCode = stripComments(core);

      assert.ok(
        /attention-observation-operational-eligibility-dimension-policy-types/.test(
          core
        )
      );
      assert.ok(
        !/permission-state-source/.test(src)
      );
      assert.ok(
        !/permission-required-dimension-coverage/.test(src)
      );
      assert.ok(
        !/permission-source-resolution-classification/.test(src)
      );
      assert.ok(!/from ["'].*permission-state-core/.test(src));
      assert.ok(!/from ["'].*declared-permission-/.test(src));
      assert.ok(!/from ["'].*permission-context-binding/.test(src));
      assert.ok(!/from ["'].*permission-core/.test(src));
      assert.ok(
        !/from ["'].*operational-eligibility-capability-state-source/.test(src)
      );
      assert.ok(!/\bProjectState\b/.test(src));
      assert.ok(!/from ["'].*\.\.\/types/.test(coreCode));
      assert.ok(!/Date\.now\(/.test(coreCode));
      assert.ok(!/new Date\(/.test(coreCode));
      assert.ok(!/performance\.now\(/.test(coreCode));
      assert.ok(!/\bsaveProject\s*\(/.test(coreCode));
      assert.ok(!/\bapplyPatch\s*\(/.test(coreCode));
      assert.ok(!/"LISTED"/.test(src));
      assert.ok(!/"NOT_LISTED"/.test(src));
      assert.ok(!/"ACCEPTED"/.test(src));
      assert.ok(!/"REJECTED"/.test(src));
      assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(src));
      assert.ok(!/"can_execute"/.test(src));
      assert.ok(!/ANY_SOURCE|ALL_SOURCES/.test(src));
      assert.ok(!/selectObserver|assignObserver/.test(src));
      assert.ok(!/"REPRESENTED"/.test(src));
      assert.ok(!/"RESOLVED"/.test(src));

      // type-only Permission State vocabulary is allowed
      assert.ok(/permission-state-types/.test(types));

      // no current source required to declare criterion
      const withCriterionNoSourceConcept = buildSet();
      assert.equal(
        withCriterionNoSourceConcept.candidate_assessments[0]!.status,
        "EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_PRESENT"
      );
      assert.ok(
        !("permission_state_sources" in
          withCriterionNoSourceConcept.candidate_assessments[0]!)
      );

      // assess helper without set builder still works for NO_CRITERION
      const noCriterion =
        assessAttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceCriteria(
          mockPolicy(),
          { criteria: [] }
        );
      assert.equal(
        noCriterion.status,
        "NO_EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_DECLARED"
      );

      // multi-candidate isolation
      const multi =
        buildAttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaSet(
          {
            operational_eligibility_dimension_policy_set: {
              capability_requirement_set: {} as never,
              specification: { policies: [] },
              candidate_assessments: [
                mockPolicy(),
                mockPolicy({
                  candidate_key: CAND_B,
                  policy_key: "084-oe-dimension-policy|cand-b",
                  set_key:
                    "attention-observation-capability-requirement-set|cand-b|need|req",
                }),
              ],
              has_explicit_operational_eligibility_dimension_policies: true,
              model_limitations: [],
            },
            specification: {
              criteria: [
                {
                  candidate_key: CAND,
                  accepted_permission_states: [PERMITTED],
                },
              ],
            },
          }
        );
      assert.equal(
        multi.candidate_assessments[0]!.status,
        "EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_PRESENT"
      );
      assert.equal(
        multi.candidate_assessments[1]!.status,
        "NO_EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_DECLARED"
      );
    });
  });
});
