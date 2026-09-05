/**
 * GROUND-097 — Observation Core LI / Operational Eligibility Permission
 * Source Acceptance Match Foundation
 *
 * Pure 093 source + 096 criterion → LISTED / NOT_LISTED membership
 * (no 094/095; criterion/source absence ≠ NOT_LISTED; no aggregation/OE).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_MODEL_LIMITATIONS,
  assertCompatibleOperationalEligibilityPermissionSourceAcceptanceMatchContexts,
  assessAttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatch,
  attentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchKey,
  buildAttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchSet,
  matchOperationalEligibilityPermissionSourceAcceptance,
} from "../reality/attention-observation-operational-eligibility-permission-source-acceptance-match-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaAssessment,
  AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriterion,
} from "../reality/attention-observation-operational-eligibility-permission-source-acceptance-criteria-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment,
  AttentionObservationOperationalEligibilityPermissionStateSourceBridge,
} from "../reality/attention-observation-operational-eligibility-permission-state-source-types.js";
import type { AttentionObservationPermissionState } from "../reality/attention-observation-permission-state-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const NEED_KEY = "need";
const SET_KEY =
  "attention-observation-capability-requirement-set|cand|need|req";
const BINDING_KEY =
  "attention-observation-permission-context-binding|cand|need|set|actor|int";
const BINDING_KEY_B =
  "attention-observation-permission-context-binding|cand|need|set|actorB|intB";
const AT = "2026-08-24T11:00:00.000Z";
const AT_ALT = "2026-08-24T11:30:00.000Z";
const BASIS_KEY = "091-permission-state-basis|cand|binding";
const BASIS_KEY_ALT = "091-permission-state-basis|cand|binding|alt";
const POLICY_KEY = "084-oe-dimension-policy|cand";
const CRITERION_KEY =
  "attention-observation-operational-eligibility-permission-source-acceptance-criterion|cand|need|set|policy|PERMISSION|PERMISSION_PERMITTED";
const CRITERION_KEY_ALT =
  "attention-observation-operational-eligibility-permission-source-acceptance-criterion|cand|need|set|policy|PERMISSION|PERMISSION_PROHIBITED";

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
  assert.ok(!/"REPRESENTED"/.test(json));
  assert.ok(!/"NOT_REPRESENTED"/.test(json));
  assert.ok(!/"RESOLVED"/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"OPERATIONALLY_INELIGIBLE"/.test(json));
  assert.ok(!/"effective_permission"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"ANY_SOURCE"/.test(json));
  assert.ok(!/"ALL_SOURCES"/.test(json));
}

function mockSourceBridge(options: {
  permission_state: AttentionObservationPermissionState;
  source_key?: string;
  binding_key?: string;
  basis_key?: string;
  at?: string;
  candidate_key?: string;
  observation_need_key?: string;
  set_key?: string;
}): AttentionObservationOperationalEligibilityPermissionStateSourceBridge {
  const candidate_key = options.candidate_key ?? CAND;
  const observation_need_key = options.observation_need_key ?? NEED_KEY;
  const set_key = options.set_key ?? SET_KEY;
  const binding_key = options.binding_key ?? BINDING_KEY;
  const basis_key = options.basis_key ?? BASIS_KEY;
  const at = options.at ?? AT;
  return {
    key:
      options.source_key ??
      [
        "attention-observation-operational-eligibility-permission-state-source",
        candidate_key,
        observation_need_key,
        set_key,
        binding_key,
        basis_key,
        at,
        options.permission_state,
      ].join("|"),
    candidate_key,
    observation_need_key,
    capability_requirement_set_key: set_key,
    permission_context_binding_key: binding_key,
    dimension: "PERMISSION",
    permission_state_basis_key: basis_key,
    permission_evaluation_at: at,
    permission_state: options.permission_state,
  };
}

function mockSourceAssessment(options?: {
  status?:
    | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    | "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
    | "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED"
    | "PERMISSION_STATE_OPERATIONAL_ELIGIBILITY_SOURCES_PRESENT";
  sources?: AttentionObservationOperationalEligibilityPermissionStateSourceBridge[];
  candidate_key?: string;
}): AttentionCandidateObservationOperationalEligibilityPermissionStateSourceAssessment {
  const status =
    options?.status ??
    "PERMISSION_STATE_OPERATIONAL_ELIGIBILITY_SOURCES_PRESENT";
  const present =
    status === "PERMISSION_STATE_OPERATIONAL_ELIGIBILITY_SOURCES_PRESENT";
  const sources = present
    ? (options?.sources ?? [
        mockSourceBridge({ permission_state: PERMITTED }),
      ])
    : [];

  return {
    candidate_key: options?.candidate_key ?? CAND,
    permission_state_assessment: {} as never,
    status,
    permission_state_sources: sources,
    has_permission_state_operational_eligibility_sources: sources.length > 0,
    model_limitations: [],
  };
}

function mockCriterion(options?: {
  accepted_permission_states?: AttentionObservationPermissionState[];
  criterion_key?: string;
  candidate_key?: string;
  observation_need_key?: string;
  set_key?: string;
}): AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriterion {
  const accepted =
    options?.accepted_permission_states ?? [PERMITTED];
  return {
    key: options?.criterion_key ?? CRITERION_KEY,
    candidate_key: options?.candidate_key ?? CAND,
    observation_need_key: options?.observation_need_key ?? NEED_KEY,
    capability_requirement_set_key: options?.set_key ?? SET_KEY,
    dimension: "PERMISSION",
    operational_eligibility_dimension_policy_key: POLICY_KEY,
    accepted_permission_states: accepted,
  };
}

function mockCriteriaAssessment(options?: {
  status?:
    | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
    | "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
    | "NO_EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_DECLARED"
    | "EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_PRESENT";
  criterion?: AttentionObservationOperationalEligibilityPermissionSourceAcceptanceCriterion | null;
  candidate_key?: string;
  policy_present?: boolean;
  required_dimensions?: ("PERMISSION" | "AUTHORITY" | "CAPABILITY_STATE")[];
}): AttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceCriteriaAssessment {
  const status =
    options?.status ??
    "EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_PRESENT";
  const present =
    status === "EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_PRESENT";
  const criterion = present
    ? (options?.criterion ?? mockCriterion())
    : null;
  const policyPresent =
    options?.policy_present ??
    (status !== "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED" &&
      status !== "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" &&
      status !== "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  const required_dimensions = options?.required_dimensions ?? [
    "PERMISSION",
  ];

  return {
    candidate_key: options?.candidate_key ?? CAND,
    operational_eligibility_dimension_policy_assessment: {
      candidate_key: options?.candidate_key ?? CAND,
      capability_requirement_assessment: {} as never,
      status: policyPresent
        ? "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT"
        : status === "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
          ? "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
          : status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
            ? "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
            : "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
      operational_eligibility_dimension_policy: policyPresent
        ? {
            key: POLICY_KEY,
            candidate_key: options?.candidate_key ?? CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            capability_requirement_keys: ["req"],
            required_dimensions,
          }
        : null,
      model_limitations: [],
    },
    status,
    permission_source_acceptance_criterion: criterion,
    has_explicit_permission_source_acceptance_criterion: criterion !== null,
    model_limitations: [],
  };
}

function buildSet(
  source = mockSourceAssessment(),
  criteria = mockCriteriaAssessment()
) {
  return buildAttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchSet(
    {
      permission_state_source_set: {
        permission_state_set: {} as never,
        candidate_assessments: [source],
        has_permission_state_operational_eligibility_sources:
          source.has_permission_state_operational_eligibility_sources,
        model_limitations: [],
      },
      permission_source_acceptance_criteria_set: {
        operational_eligibility_dimension_policy_set: {} as never,
        specification: { criteria: [] },
        candidate_assessments: [criteria],
        has_explicit_permission_source_acceptance_criteria:
          criteria.has_explicit_permission_source_acceptance_criterion,
        model_limitations: [],
      },
    }
  );
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

describe("GROUND-097 Operational Eligibility Permission Source Acceptance Match", () => {
  describe("exact membership matching", () => {
    it("PERMISSION_PERMITTED listed → LISTED_AS_ACCEPTABLE; no ACCEPTED", () => {
      const set = buildSet(
        mockSourceAssessment({
          sources: [mockSourceBridge({ permission_state: PERMITTED })],
        }),
        mockCriteriaAssessment({
          criterion: mockCriterion({
            accepted_permission_states: [PERMITTED],
          }),
        })
      );
      const match =
        set.candidate_assessments[0]!.permission_source_acceptance_matches[0]!;
      assert.equal(match.match, "LISTED_AS_ACCEPTABLE");
      assert.equal(match.permission_state, PERMITTED);
      assertNoForbiddenSemantics(set);
    });

    it("PERMISSION_PERMITTED excluded → NOT_LISTED; no REJECTED", () => {
      const match = buildSet(
        mockSourceAssessment({
          sources: [mockSourceBridge({ permission_state: PERMITTED })],
        }),
        mockCriteriaAssessment({
          criterion: mockCriterion({
            accepted_permission_states: [PROHIBITED],
            criterion_key: CRITERION_KEY_ALT,
          }),
        })
      ).candidate_assessments[0]!.permission_source_acceptance_matches[0]!;
      assert.equal(match.match, "NOT_LISTED_AS_ACCEPTABLE");
      assert.ok(!/"REJECTED"/.test(JSON.stringify(match)));
    });

    it("PERMISSION_PROHIBITED explicitly listed → LISTED", () => {
      assert.equal(
        buildSet(
          mockSourceAssessment({
            sources: [mockSourceBridge({ permission_state: PROHIBITED })],
          }),
          mockCriteriaAssessment({
            criterion: mockCriterion({
              accepted_permission_states: [PROHIBITED],
              criterion_key: CRITERION_KEY_ALT,
            }),
          })
        ).candidate_assessments[0]!.permission_source_acceptance_matches[0]!
          .match,
        "LISTED_AS_ACCEPTABLE"
      );
    });

    it("PERMISSION_PROHIBITED excluded → NOT_LISTED only", () => {
      assert.equal(
        buildSet(
          mockSourceAssessment({
            sources: [mockSourceBridge({ permission_state: PROHIBITED })],
          }),
          mockCriteriaAssessment({
            criterion: mockCriterion({
              accepted_permission_states: [PERMITTED],
            }),
          })
        ).candidate_assessments[0]!.permission_source_acceptance_matches[0]!
          .match,
        "NOT_LISTED_AS_ACCEPTABLE"
      );
    });

    it("unresolved policy-absence / no-mapping listed → LISTED", () => {
      assert.equal(
        buildSet(
          mockSourceAssessment({
            sources: [
              mockSourceBridge({ permission_state: UNRESOLVED_POLICY }),
            ],
          }),
          mockCriteriaAssessment({
            criterion: mockCriterion({
              accepted_permission_states: [UNRESOLVED_POLICY],
            }),
          })
        ).candidate_assessments[0]!.permission_source_acceptance_matches[0]!
          .match,
        "LISTED_AS_ACCEPTABLE"
      );
      assert.equal(
        buildSet(
          mockSourceAssessment({
            sources: [
              mockSourceBridge({ permission_state: UNRESOLVED_MAPPING }),
            ],
          }),
          mockCriteriaAssessment({
            criterion: mockCriterion({
              accepted_permission_states: [UNRESOLVED_MAPPING],
            }),
          })
        ).candidate_assessments[0]!.permission_source_acceptance_matches[0]!
          .match,
        "LISTED_AS_ACCEPTABLE"
      );
    });

    it("unresolved excluded → NOT_LISTED, not rejected", () => {
      const match = buildSet(
        mockSourceAssessment({
          sources: [
            mockSourceBridge({ permission_state: UNRESOLVED_POLICY }),
          ],
        }),
        mockCriteriaAssessment({
          criterion: mockCriterion({
            accepted_permission_states: [PERMITTED],
          }),
        })
      ).candidate_assessments[0]!.permission_source_acceptance_matches[0]!;
      assert.equal(match.match, "NOT_LISTED_AS_ACCEPTABLE");
      assert.ok(!/"REJECTED"/.test(JSON.stringify(match)));
    });

    it("membership helper is exact includes only", () => {
      assert.equal(
        matchOperationalEligibilityPermissionSourceAcceptance(
          [PERMITTED, UNRESOLVED_POLICY],
          PERMITTED
        ),
        "LISTED_AS_ACCEPTABLE"
      );
      assert.equal(
        matchOperationalEligibilityPermissionSourceAcceptance(
          [PERMITTED, UNRESOLVED_POLICY],
          PROHIBITED
        ),
        "NOT_LISTED_AS_ACCEPTABLE"
      );
      assert.equal(
        matchOperationalEligibilityPermissionSourceAcceptance([], PERMITTED),
        "NOT_LISTED_AS_ACCEPTABLE"
      );
    });
  });

  describe("absence / empty criterion firewalled", () => {
    it("explicit empty criterion + sources → N NOT_LISTED matches", () => {
      const set = buildSet(
        mockSourceAssessment({
          sources: [
            mockSourceBridge({ permission_state: PERMITTED }),
            mockSourceBridge({
              permission_state: PROHIBITED,
              binding_key: BINDING_KEY_B,
              basis_key: BASIS_KEY_ALT,
            }),
          ],
        }),
        mockCriteriaAssessment({
          criterion: mockCriterion({
            accepted_permission_states: [],
            criterion_key:
              "attention-observation-operational-eligibility-permission-source-acceptance-criterion|cand|need|set|policy|PERMISSION|EMPTY_ACCEPTED_PERMISSION_STATE_SET",
          }),
        })
      );
      const candidate = set.candidate_assessments[0]!;
      assert.equal(
        candidate.status,
        "PERMISSION_SOURCE_ACCEPTANCE_MATCHES_PRESENT"
      );
      assert.equal(candidate.permission_source_acceptance_matches.length, 2);
      assert.ok(
        candidate.permission_source_acceptance_matches.every(
          (m) => m.match === "NOT_LISTED_AS_ACCEPTABLE"
        )
      );
      assert.equal(candidate.has_permission_source_acceptance_matches, true);
      assert.equal(candidate.has_listed_as_acceptable_permission_sources, false);
      assert.equal(
        candidate.has_not_listed_as_acceptable_permission_sources,
        true
      );
    });

    it("criterion absence + sources → zero matches; != empty criterion", () => {
      const absent = buildSet(
        mockSourceAssessment(),
        mockCriteriaAssessment({
          status: "NO_EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_DECLARED",
          criterion: null,
        })
      ).candidate_assessments[0]!;
      assert.equal(
        absent.status,
        "NO_EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_DECLARED"
      );
      assert.equal(absent.permission_source_acceptance_matches.length, 0);
      assert.equal(absent.has_permission_source_acceptance_matches, false);
      assert.equal(absent.has_listed_as_acceptable_permission_sources, false);
      assert.equal(
        absent.has_not_listed_as_acceptable_permission_sources,
        false
      );

      const empty = buildSet(
        mockSourceAssessment(),
        mockCriteriaAssessment({
          criterion: mockCriterion({ accepted_permission_states: [] }),
        })
      ).candidate_assessments[0]!;
      assert.equal(
        empty.status,
        "PERMISSION_SOURCE_ACCEPTANCE_MATCHES_PRESENT"
      );
      assert.equal(empty.permission_source_acceptance_matches.length, 1);
    });

    it("no sources + criterion → zero matches; source absence != NOT_LISTED", () => {
      for (const status of [
        "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED",
      ] as const) {
        const candidate = buildSet(
          mockSourceAssessment({ status }),
          mockCriteriaAssessment()
        ).candidate_assessments[0]!;
        assert.equal(candidate.status, status);
        assert.equal(candidate.permission_source_acceptance_matches.length, 0);
        assert.equal(candidate.has_not_listed_as_acceptable_permission_sources, false);
      }
    });
  });

  describe("multi-source / lineage / identity", () => {
    it("one match per source; equal raw states remain separate; mixed independent", () => {
      const set = buildSet(
        mockSourceAssessment({
          sources: [
            mockSourceBridge({
              permission_state: PERMITTED,
              binding_key: `${BINDING_KEY}|1`,
              basis_key: `${BASIS_KEY}|1`,
            }),
            mockSourceBridge({
              permission_state: PERMITTED,
              binding_key: `${BINDING_KEY}|2`,
              basis_key: `${BASIS_KEY}|2`,
            }),
            mockSourceBridge({
              permission_state: PROHIBITED,
              binding_key: `${BINDING_KEY}|3`,
              basis_key: `${BASIS_KEY}|3`,
            }),
            mockSourceBridge({
              permission_state: UNRESOLVED_POLICY,
              binding_key: `${BINDING_KEY}|4`,
              basis_key: `${BASIS_KEY}|4`,
            }),
          ],
        }),
        mockCriteriaAssessment({
          criterion: mockCriterion({
            accepted_permission_states: [PERMITTED, UNRESOLVED_POLICY],
          }),
        })
      );
      const matches =
        set.candidate_assessments[0]!.permission_source_acceptance_matches;
      assert.equal(matches.length, 4);
      assert.deepEqual(
        matches.map((m) => m.match),
        [
          "LISTED_AS_ACCEPTABLE",
          "LISTED_AS_ACCEPTABLE",
          "NOT_LISTED_AS_ACCEPTABLE",
          "LISTED_AS_ACCEPTABLE",
        ]
      );
      assert.notEqual(
        matches[0]!.permission_state_source_key,
        matches[1]!.permission_state_source_key
      );
      assert.notEqual(matches[0]!.key, matches[1]!.key);
      const candidate = set.candidate_assessments[0]!;
      assert.equal(candidate.has_listed_as_acceptable_permission_sources, true);
      assert.equal(
        candidate.has_not_listed_as_acceptable_permission_sources,
        true
      );
      assert.ok(
        matches.every(
          (m) =>
            m.permission_source_acceptance_criterion_key === CRITERION_KEY ||
            m.permission_source_acceptance_criterion_key.length > 0
        )
      );
      assert.equal(matches[0]!.permission_context_binding_key, `${BINDING_KEY}|1`);
      assert.equal(matches[0]!.permission_state_basis_key, `${BASIS_KEY}|1`);
      assert.equal(matches[0]!.permission_evaluation_at, AT);
    });

    it("all LISTED / all NOT_LISTED boolean summaries", () => {
      const allListed = buildSet(
        mockSourceAssessment({
          sources: [
            mockSourceBridge({ permission_state: PERMITTED }),
            mockSourceBridge({
              permission_state: PERMITTED,
              binding_key: BINDING_KEY_B,
              basis_key: BASIS_KEY_ALT,
            }),
          ],
        }),
        mockCriteriaAssessment({
          criterion: mockCriterion({
            accepted_permission_states: [PERMITTED],
          }),
        })
      ).candidate_assessments[0]!;
      assert.deepEqual(
        [
          allListed.has_permission_source_acceptance_matches,
          allListed.has_listed_as_acceptable_permission_sources,
          allListed.has_not_listed_as_acceptable_permission_sources,
        ],
        [true, true, false]
      );

      const allNotListed = buildSet(
        mockSourceAssessment({
          sources: [mockSourceBridge({ permission_state: PROHIBITED })],
        }),
        mockCriteriaAssessment({
          criterion: mockCriterion({
            accepted_permission_states: [PERMITTED],
          }),
        })
      ).candidate_assessments[0]!;
      assert.deepEqual(
        [
          allNotListed.has_permission_source_acceptance_matches,
          allNotListed.has_listed_as_acceptable_permission_sources,
          allNotListed.has_not_listed_as_acceptable_permission_sources,
        ],
        [true, false, true]
      );
    });

    it("source / criterion / state / binding / at change identity", () => {
      const base =
        attentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            permission_context_binding_key: BINDING_KEY,
            permission_state_source_key: "src-a",
            permission_state_basis_key: BASIS_KEY,
            permission_evaluation_at: AT,
            permission_source_acceptance_criterion_key: CRITERION_KEY,
            permission_state: PERMITTED,
            match: "LISTED_AS_ACCEPTABLE",
          }
        );
      assert.notEqual(
        base,
        attentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            permission_context_binding_key: BINDING_KEY,
            permission_state_source_key: "src-b",
            permission_state_basis_key: BASIS_KEY,
            permission_evaluation_at: AT,
            permission_source_acceptance_criterion_key: CRITERION_KEY,
            permission_state: PERMITTED,
            match: "LISTED_AS_ACCEPTABLE",
          }
        )
      );
      assert.notEqual(
        base,
        attentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            permission_context_binding_key: BINDING_KEY,
            permission_state_source_key: "src-a",
            permission_state_basis_key: BASIS_KEY,
            permission_evaluation_at: AT,
            permission_source_acceptance_criterion_key: CRITERION_KEY_ALT,
            permission_state: PERMITTED,
            match: "LISTED_AS_ACCEPTABLE",
          }
        )
      );
      assert.notEqual(
        base,
        attentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            permission_context_binding_key: BINDING_KEY,
            permission_state_source_key: "src-a",
            permission_state_basis_key: BASIS_KEY,
            permission_evaluation_at: AT,
            permission_source_acceptance_criterion_key: CRITERION_KEY,
            permission_state: PROHIBITED,
            match: "NOT_LISTED_AS_ACCEPTABLE",
          }
        )
      );
      assert.notEqual(
        base,
        attentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            permission_context_binding_key: BINDING_KEY_B,
            permission_state_source_key: "src-a",
            permission_state_basis_key: BASIS_KEY,
            permission_evaluation_at: AT,
            permission_source_acceptance_criterion_key: CRITERION_KEY,
            permission_state: PERMITTED,
            match: "LISTED_AS_ACCEPTABLE",
          }
        )
      );
      assert.notEqual(
        base,
        attentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            permission_context_binding_key: BINDING_KEY,
            permission_state_source_key: "src-a",
            permission_state_basis_key: BASIS_KEY,
            permission_evaluation_at: AT_ALT,
            permission_source_acceptance_criterion_key: CRITERION_KEY,
            permission_state: PERMITTED,
            match: "LISTED_AS_ACCEPTABLE",
          }
        )
      );
    });
  });

  describe("outer status / context join", () => {
    it("no planning / no Requirements / no policy / not required / no criterion → no matches", () => {
      assert.equal(
        buildSet(
          mockSourceAssessment({
            status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
          }),
          mockCriteriaAssessment({
            status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
          })
        ).candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
      assert.equal(
        buildSet(
          mockSourceAssessment({
            status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
          }),
          mockCriteriaAssessment({
            status: "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
          })
        ).candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
      assert.equal(
        buildSet(
          mockSourceAssessment({
            status: "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
          }),
          mockCriteriaAssessment({
            status:
              "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
            criterion: null,
            policy_present: false,
          })
        ).candidate_assessments[0]!.status,
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
      );
      assert.equal(
        buildSet(
          mockSourceAssessment(),
          mockCriteriaAssessment({
            status: "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY",
            criterion: null,
            required_dimensions: ["AUTHORITY"],
          })
        ).candidate_assessments[0]!.status,
        "PERMISSION_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
      );
      assert.equal(
        buildSet(
          mockSourceAssessment(),
          mockCriteriaAssessment({
            status: "NO_EXPLICIT_PERMISSION_SOURCE_ACCEPTANCE_CRITERION_DECLARED",
            criterion: null,
          })
        ).candidate_assessments[0]!.permission_source_acceptance_matches
          .length,
        0
      );
    });

    it("candidate/context mismatch and missing/extra counterpart reject", () => {
      assert.throws(() =>
        assessAttentionCandidateObservationOperationalEligibilityPermissionSourceAcceptanceMatch(
          mockSourceAssessment({ candidate_key: "a" }),
          mockCriteriaAssessment({ candidate_key: "b" })
        )
      );
      assert.throws(() =>
        assertCompatibleOperationalEligibilityPermissionSourceAcceptanceMatchContexts(
          {
            permission_state_set: {} as never,
            candidate_assessments: [mockSourceAssessment()],
            has_permission_state_operational_eligibility_sources: true,
            model_limitations: [],
          },
          {
            operational_eligibility_dimension_policy_set: {} as never,
            specification: { criteria: [] },
            candidate_assessments: [
              mockCriteriaAssessment(),
              mockCriteriaAssessment({ candidate_key: "extra" }),
            ],
            has_explicit_permission_source_acceptance_criteria: true,
            model_limitations: [],
          }
        )
      );
      assert.throws(() =>
        buildSet(
          mockSourceAssessment({
            sources: [
              mockSourceBridge({
                permission_state: PERMITTED,
                observation_need_key: "need-other",
              }),
            ],
          }),
          mockCriteriaAssessment()
        )
      );
    });

    it("source order preserved (not LISTED-first)", () => {
      const matches = buildSet(
        mockSourceAssessment({
          sources: [
            mockSourceBridge({
              permission_state: PROHIBITED,
              binding_key: `${BINDING_KEY}|1`,
              basis_key: `${BASIS_KEY}|1`,
            }),
            mockSourceBridge({
              permission_state: PERMITTED,
              binding_key: `${BINDING_KEY}|2`,
              basis_key: `${BASIS_KEY}|2`,
            }),
          ],
        }),
        mockCriteriaAssessment({
          criterion: mockCriterion({
            accepted_permission_states: [PERMITTED],
          }),
        })
      ).candidate_assessments[0]!.permission_source_acceptance_matches;
      assert.deepEqual(
        matches.map((m) => m.permission_state),
        [PROHIBITED, PERMITTED]
      );
    });
  });

  describe("determinism / immutability / static boundaries", () => {
    it("input immutability, deep-clone equivalence, determinism", () => {
      const input = {
        permission_state_source_set: {
          permission_state_set: {} as never,
          candidate_assessments: [
            mockSourceAssessment({
              sources: [
                mockSourceBridge({ permission_state: PERMITTED }),
                mockSourceBridge({
                  permission_state: PROHIBITED,
                  binding_key: BINDING_KEY_B,
                  basis_key: BASIS_KEY_ALT,
                }),
              ],
            }),
          ],
          has_permission_state_operational_eligibility_sources: true,
          model_limitations: [],
        },
        permission_source_acceptance_criteria_set: {
          operational_eligibility_dimension_policy_set: {} as never,
          specification: { criteria: [] },
          candidate_assessments: [
            mockCriteriaAssessment({
              criterion: mockCriterion({
                accepted_permission_states: [PERMITTED, UNRESOLVED_POLICY],
              }),
            }),
          ],
          has_explicit_permission_source_acceptance_criteria: true,
          model_limitations: [],
        },
      };
      const before = deepClone(input);
      const a =
        buildAttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchSet(
          input
        );
      const b =
        buildAttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchSet(
          input
        );
      const c =
        buildAttentionObservationOperationalEligibilityPermissionSourceAcceptanceMatchSet(
          deepClone(input)
        );
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
    });

    it("schema 0.1.24; no 094/095/084-direct/091-core; no aggregation/OE", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      assert.deepEqual(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_ACCEPTANCE_MATCH_MODEL_LIMITATIONS.slice(
          0,
          3
        ),
        [
          "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_POLICY_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_READINESS_POLICY_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_AGGREGATION_READINESS_BASIS_NOT_MODELED",
        ]
      );

      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-permission-source-acceptance-match-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-permission-source-acceptance-match-types.ts"
        ),
        "utf8"
      );
      const stripComments = (s: string) =>
        s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
      const src = stripComments(core + types);
      const coreCode = stripComments(core);

      assert.ok(/permission-state-source-types/.test(core));
      assert.ok(/permission-source-acceptance-criteria-types/.test(core));
      assert.ok(!/permission-required-dimension-coverage/.test(src));
      assert.ok(!/permission-source-resolution-classification/.test(src));
      assert.ok(
        !/operational-eligibility-dimension-policy-types/.test(coreCode)
      );
      assert.ok(!/from ["'].*permission-state-core/.test(src));
      assert.ok(!/from ["'].*permission-state-types/.test(coreCode));
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
      assert.ok(!/"ACCEPTED"/.test(src));
      assert.ok(!/"REJECTED"/.test(src));
      assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(src));
      assert.ok(!/"can_execute"/.test(src));
      assert.ok(!/ANY_SOURCE|ALL_SOURCES/.test(src));
      assert.ok(!/selectObserver|assignObserver/.test(src));
      assert.ok(!/"REPRESENTED"/.test(src));
      assert.ok(!/"RESOLVED"/.test(src));
      assert.ok(!/"UNRESOLVED"/.test(coreCode));

      // PROHIBITED RESOLVED / UNRESOLVED classification do not gate membership
      assert.equal(
        matchOperationalEligibilityPermissionSourceAcceptance(
          [PROHIBITED],
          PROHIBITED
        ),
        "LISTED_AS_ACCEPTABLE"
      );
      assert.equal(
        matchOperationalEligibilityPermissionSourceAcceptance(
          [UNRESOLVED_POLICY],
          UNRESOLVED_POLICY
        ),
        "LISTED_AS_ACCEPTABLE"
      );
    });
  });
});
