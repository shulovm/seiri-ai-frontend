/**
 * GROUND-118 — Observation Core LXXII / Operational Eligibility AUTHORITY
 * Required Dimension Coverage Foundation
 *
 * Pure 084 Dimension Policy + 117 AUTHORITY source bridge
 * (required ≠ represented; REPRESENTED ≠ accepted / positive;
 * NOT_REPRESENTED ≠ rejected / negative; no aggregation / OE / can_execute).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_REQUIRED_DIMENSION_COVERAGE_MODEL_LIMITATIONS,
  assertCompatibleOperationalEligibilityAuthorityRequiredDimensionCoverageContexts,
  assessAttentionCandidateObservationOperationalEligibilityAuthorityRequiredDimensionCoverage,
  attentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageKey,
  buildAttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageSet,
  buildCanonicalAuthoritySourceKeySetKey,
  EMPTY_AUTHORITY_SOURCE_SET_KEY,
} from "../reality/attention-observation-operational-eligibility-authority-required-dimension-coverage-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimension,
  AttentionObservationOperationalEligibilityDimensionPolicy,
} from "../reality/attention-observation-operational-eligibility-dimension-policy-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment,
  AttentionObservationOperationalEligibilityAuthoritySource,
} from "../reality/attention-observation-operational-eligibility-authority-source-bridge-types.js";
import type { AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue } from "../reality/attention-observation-operational-eligibility-canonical-authority-state-types.js";
import type { GovernanceScope } from "../types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const NEED_KEY = "need";
const NEED_KEY_2 = "need-b";
const SET_KEY =
  "attention-observation-capability-requirement-set|cand|need|req";
const SET_KEY_2 =
  "attention-observation-capability-requirement-set|cand|need|req-b";
const POLICY_KEY = "084-oe-dimension-policy|cand";
const POLICY_KEY_ALT = "084-oe-dimension-policy|cand|alt";
const BINDING_KEY =
  "attention-observation-authority-context-binding|cand|need|set|holder|power|scope";
const AT = "2026-08-24T11:00:00.000Z";

const POSITIVE = "EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE" as const;
const NEGATIVE = "EXPLICITLY_INTERPRETED_AUTHORITY_NEGATIVE" as const;
const UNRESOLVED_POLICY =
  "UNRESOLVED_NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_POLICY" as const;
const UNRESOLVED_MAPPING =
  "UNRESOLVED_NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE" as const;

const SCOPE_A: GovernanceScope = {
  kind: "SUBJECT_STATE",
  subject_id: "subject-a",
  state_kind: "active",
};

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"PASS"/.test(json));
  assert.ok(!/"FAIL"/.test(json));
  assert.ok(!/"ACCEPTED"/.test(json));
  assert.ok(!/"REJECTED"/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"OPERATIONALLY_INELIGIBLE"/.test(json));
  assert.ok(!/"effective_authority"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"has_authority"\s*:/.test(json));
  assert.ok(!/"is_authorized"/.test(json));
  assert.ok(!/"ANY_SOURCE"/.test(json));
  assert.ok(!/"ALL_SOURCES"/.test(json));
  assert.ok(!/"permission_state_source"/.test(json));
  assert.ok(!/"capability_state_source"/.test(json));
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

function mockAuthoritySource(options: {
  canonical_authority_state_value: AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue;
  source_key?: string;
  binding_key?: string;
  candidate_key?: string;
  observation_need_key?: string;
  set_key?: string;
}): AttentionObservationOperationalEligibilityAuthoritySource {
  const candidate_key = options.candidate_key ?? CAND;
  const observation_need_key = options.observation_need_key ?? NEED_KEY;
  const set_key = options.set_key ?? SET_KEY;
  const binding_key = options.binding_key ?? BINDING_KEY;
  return {
    key:
      options.source_key ??
      [
        "attention-observation-operational-eligibility-authority-source",
        candidate_key,
        observation_need_key,
        set_key,
        "AUTHORITY",
        binding_key,
        "holder",
        "AUTHORIZE_INTERVENTION",
        "scope",
        "instant",
        AT,
        `state|${binding_key}`,
        `basis|${binding_key}`,
        options.canonical_authority_state_value,
        "SOURCE_PRESENT",
      ].join("|"),
    candidate_key,
    observation_need_key,
    capability_requirement_set_key: set_key,
    dimension: "AUTHORITY",
    authority_observation_context_binding_key: binding_key,
    authority_holder_entity_id: "holder",
    authority_power: "AUTHORIZE_INTERVENTION",
    governance_scope: SCOPE_A,
    governance_scope_key: "scope",
    authority_evaluation_instant_key: "instant",
    authority_evaluation_at: AT,
    canonical_authority_state_key: `state|${binding_key}`,
    canonical_authority_state_basis_key: `basis|${binding_key}`,
    canonical_authority_state_value: options.canonical_authority_state_value,
    source_presence: "SOURCE_PRESENT",
  };
}

function mockSourceAssessment(options?: {
  status?:
    | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    | "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
    | "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED"
    | "AUTHORITY_SOURCES_PRESENT";
  sources?: AttentionObservationOperationalEligibilityAuthoritySource[];
  candidate_key?: string;
}): AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment {
  const status = options?.status ?? "AUTHORITY_SOURCES_PRESENT";
  const present = status === "AUTHORITY_SOURCES_PRESENT";
  const sources = present
    ? (options?.sources ?? [
        mockAuthoritySource({ canonical_authority_state_value: POSITIVE }),
      ])
    : [];

  return {
    candidate_key: options?.candidate_key ?? CAND,
    canonical_authority_state_assessment: {} as never,
    status,
    authority_sources: sources,
    has_authority_sources: sources.length > 0,
    has_positive_canonical_authority_state_sources: sources.some(
      (s) => s.canonical_authority_state_value === POSITIVE
    ),
    has_negative_canonical_authority_state_sources: sources.some(
      (s) => s.canonical_authority_state_value === NEGATIVE
    ),
    has_unresolved_canonical_authority_state_sources: sources.some(
      (s) =>
        s.canonical_authority_state_value === UNRESOLVED_POLICY ||
        s.canonical_authority_state_value === UNRESOLVED_MAPPING
    ),
    model_limitations: [],
  };
}

function buildSet(
  policy = mockPolicy(),
  source = mockSourceAssessment()
) {
  return buildAttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageSet(
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
      authority_source_bridge_set: {
        canonical_authority_state_set: {} as never,
        candidate_assessments: [source],
        has_authority_sources: source.has_authority_sources,
        has_positive_canonical_authority_state_sources:
          source.has_positive_canonical_authority_state_sources,
        has_negative_canonical_authority_state_sources:
          source.has_negative_canonical_authority_state_sources,
        has_unresolved_canonical_authority_state_sources:
          source.has_unresolved_canonical_authority_state_sources,
        model_limitations: [],
      },
    }
  );
}

function deepClone<T>(value: T): T {
  return structuredClone(value);
}

describe("GROUND-118 Operational Eligibility AUTHORITY Required Dimension Coverage", () => {
  describe("required + source representation", () => {
    it("positive source → REPRESENTED", () => {
      const set = buildSet(
        mockPolicy(),
        mockSourceAssessment({
          sources: [
            mockAuthoritySource({ canonical_authority_state_value: POSITIVE }),
          ],
        })
      );
      const coverage =
        set.candidate_assessments[0]!.authority_required_dimension_coverage!;
      assert.equal(
        set.candidate_assessments[0]!.status,
        "REQUIRED_AUTHORITY_DIMENSION_COVERAGE_PRESENT"
      );
      assert.equal(coverage.coverage, "REPRESENTED");
      assert.equal(coverage.dimension, "AUTHORITY");
      assert.equal(
        coverage.operational_eligibility_dimension_policy_key,
        POLICY_KEY
      );
      assert.ok(coverage.authority_source_keys.length > 0);
      assertNoForbiddenSemantics(set);
    });

    it("negative source → REPRESENTED", () => {
      assert.equal(
        buildSet(
          mockPolicy(),
          mockSourceAssessment({
            sources: [
              mockAuthoritySource({ canonical_authority_state_value: NEGATIVE }),
            ],
          })
        ).candidate_assessments[0]!.authority_required_dimension_coverage!
          .coverage,
        "REPRESENTED"
      );
    });

    it("both unresolved sources → REPRESENTED", () => {
      for (const canonical_authority_state_value of [
        UNRESOLVED_POLICY,
        UNRESOLVED_MAPPING,
      ] as const) {
        assert.equal(
          buildSet(
            mockPolicy(),
            mockSourceAssessment({
              sources: [
                mockAuthoritySource({ canonical_authority_state_value }),
              ],
            })
          ).candidate_assessments[0]!.authority_required_dimension_coverage!
            .coverage,
          "REPRESENTED"
        );
      }
    });

    it("mixed four canonical values → REPRESENTED; no aggregation", () => {
      const coverage = buildSet(
        mockPolicy(),
        mockSourceAssessment({
          sources: [
            mockAuthoritySource({
              canonical_authority_state_value: POSITIVE,
              binding_key: `${BINDING_KEY}|a`,
              source_key: "src-b",
            }),
            mockAuthoritySource({
              canonical_authority_state_value: NEGATIVE,
              binding_key: `${BINDING_KEY}|b`,
              source_key: "src-a",
            }),
            mockAuthoritySource({
              canonical_authority_state_value: UNRESOLVED_POLICY,
              binding_key: `${BINDING_KEY}|c`,
              source_key: "src-c",
            }),
            mockAuthoritySource({
              canonical_authority_state_value: UNRESOLVED_MAPPING,
              binding_key: `${BINDING_KEY}|d`,
              source_key: "src-d",
            }),
          ],
        })
      ).candidate_assessments[0]!.authority_required_dimension_coverage!;
      assert.equal(coverage.coverage, "REPRESENTED");
      assert.deepEqual(coverage.authority_source_keys, [
        "src-a",
        "src-b",
        "src-c",
        "src-d",
      ]);
    });

    it("required + zero sources → NOT_REPRESENTED", () => {
      const set = buildSet(
        mockPolicy(),
        mockSourceAssessment({
          status: "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        })
      );
      const coverage =
        set.candidate_assessments[0]!.authority_required_dimension_coverage!;
      assert.equal(coverage.coverage, "NOT_REPRESENTED");
      assert.deepEqual(coverage.authority_source_keys, []);
      assert.equal(
        set.candidate_assessments[0]!.has_authority_required_dimension_coverage,
        true
      );
    });

    it("required + no evaluation instant → NOT_REPRESENTED", () => {
      assert.equal(
        buildSet(
          mockPolicy(),
          mockSourceAssessment({
            status: "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED",
          })
        ).candidate_assessments[0]!.authority_required_dimension_coverage!
          .coverage,
        "NOT_REPRESENTED"
      );
    });

    it("unresolved source != NOT_REPRESENTED; negative != NOT_REPRESENTED", () => {
      assert.notEqual(
        buildSet(
          mockPolicy(),
          mockSourceAssessment({
            sources: [
              mockAuthoritySource({
                canonical_authority_state_value: UNRESOLVED_POLICY,
              }),
            ],
          })
        ).candidate_assessments[0]!.authority_required_dimension_coverage!
          .coverage,
        "NOT_REPRESENTED"
      );
      assert.notEqual(
        buildSet(
          mockPolicy(),
          mockSourceAssessment({
            sources: [
              mockAuthoritySource({ canonical_authority_state_value: NEGATIVE }),
            ],
          })
        ).candidate_assessments[0]!.authority_required_dimension_coverage!
          .coverage,
        "NOT_REPRESENTED"
      );
    });
  });

  describe("policy presence / requirement", () => {
    it("AUTHORITY not required → NOT_REQUIRED; coverage null", () => {
      const set = buildSet(
        mockPolicy({ required_dimensions: ["CAPABILITY_STATE"] }),
        mockSourceAssessment()
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
      );
      assert.equal(
        set.candidate_assessments[0]!.authority_required_dimension_coverage,
        null
      );
      assert.equal(
        set.candidate_assessments[0]!.has_authority_required_dimension_coverage,
        false
      );
    });

    it("explicit empty 084 policy → NOT_REQUIRED (not NO_POLICY)", () => {
      const set = buildSet(
        mockPolicy({ required_dimensions: [] }),
        mockSourceAssessment({
          status: "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
      );
      assert.notEqual(
        set.candidate_assessments[0]!.status,
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
      );
    });

    it("policy absent → NO_POLICY; coverage null", () => {
      const set = buildSet(
        mockPolicy({
          status: "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
        }),
        mockSourceAssessment()
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
      );
      assert.equal(
        set.candidate_assessments[0]!.authority_required_dimension_coverage,
        null
      );
    });

    it("policy absence != not required; not required != NOT_REPRESENTED", () => {
      const absent = buildSet(
        mockPolicy({
          status: "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED",
        }),
        mockSourceAssessment({
          status: "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        })
      ).candidate_assessments[0]!.status;
      const notRequired = buildSet(
        mockPolicy({ required_dimensions: ["PERMISSION"] }),
        mockSourceAssessment({
          status: "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        })
      ).candidate_assessments[0]!.status;
      const notRepresented = buildSet(
        mockPolicy(),
        mockSourceAssessment({
          status: "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        })
      ).candidate_assessments[0]!;
      assert.notEqual(absent, notRequired);
      assert.notEqual(notRequired, notRepresented.status);
      assert.equal(
        notRepresented.authority_required_dimension_coverage!.coverage,
        "NOT_REPRESENTED"
      );
    });

    it("source exists but dimension not required → still NOT_REQUIRED", () => {
      const set = buildSet(
        mockPolicy({ required_dimensions: ["FEASIBILITY"] }),
        mockSourceAssessment({
          sources: [
            mockAuthoritySource({ canonical_authority_state_value: POSITIVE }),
          ],
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
      );
      assert.equal(
        set.candidate_assessments[0]!.authority_required_dimension_coverage,
        null
      );
    });
  });

  describe("coverage identity / source keys", () => {
    it("source order invariance → same coverage key", () => {
      const keysA = ["src-b", "src-a", "src-c"];
      const keysB = ["src-c", "src-a", "src-b"];
      assert.equal(
        buildCanonicalAuthoritySourceKeySetKey(keysA),
        buildCanonicalAuthoritySourceKeySetKey(keysB)
      );
      const keyA = attentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageKey(
        CAND,
        NEED_KEY,
        SET_KEY,
        POLICY_KEY,
        "REPRESENTED",
        buildCanonicalAuthoritySourceKeySetKey(keysA)
      );
      const keyB = attentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageKey(
        CAND,
        NEED_KEY,
        SET_KEY,
        POLICY_KEY,
        "REPRESENTED",
        buildCanonicalAuthoritySourceKeySetKey(keysB)
      );
      assert.equal(keyA, keyB);
    });

    it("source set change → coverage key changes even if REPRESENTED", () => {
      const one = buildSet(
        mockPolicy(),
        mockSourceAssessment({
          sources: [
            mockAuthoritySource({
              canonical_authority_state_value: POSITIVE,
              source_key: "src-a",
            }),
          ],
        })
      ).candidate_assessments[0]!.authority_required_dimension_coverage!.key;
      const two = buildSet(
        mockPolicy(),
        mockSourceAssessment({
          sources: [
            mockAuthoritySource({
              canonical_authority_state_value: POSITIVE,
              source_key: "src-a",
            }),
            mockAuthoritySource({
              canonical_authority_state_value: NEGATIVE,
              source_key: "src-b",
              binding_key: `${BINDING_KEY}|b`,
            }),
          ],
        })
      ).candidate_assessments[0]!.authority_required_dimension_coverage!.key;
      assert.notEqual(one, two);
    });

    it("policy key change → coverage key changes", () => {
      const base = buildSet(
        mockPolicy({ policy_key: POLICY_KEY }),
        mockSourceAssessment()
      ).candidate_assessments[0]!.authority_required_dimension_coverage!.key;
      const alt = buildSet(
        mockPolicy({ policy_key: POLICY_KEY_ALT }),
        mockSourceAssessment()
      ).candidate_assessments[0]!.authority_required_dimension_coverage!.key;
      assert.notEqual(base, alt);
    });

    it("empty source set token is deterministic", () => {
      assert.equal(
        buildCanonicalAuthoritySourceKeySetKey([]),
        EMPTY_AUTHORITY_SOURCE_SET_KEY
      );
      const key = buildSet(
        mockPolicy(),
        mockSourceAssessment({
          status: "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        })
      ).candidate_assessments[0]!.authority_required_dimension_coverage!.key;
      assert.ok(key.includes(EMPTY_AUTHORITY_SOURCE_SET_KEY));
    });
  });

  describe("set boolean / outer statuses", () => {
    it("all NOT_REPRESENTED → has_authority_required_dimension_coverages true", () => {
      assert.equal(
        buildSet(
          mockPolicy(),
          mockSourceAssessment({
            status: "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
          })
        ).has_authority_required_dimension_coverages,
        true
      );
    });

    it("outer no-planning / no-Requirements → coverage null", () => {
      for (const status of [
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
      ] as const) {
        const set = buildSet(
          mockPolicy({ status }),
          mockSourceAssessment({ status })
        );
        assert.equal(set.candidate_assessments[0]!.status, status);
        assert.equal(
          set.candidate_assessments[0]!.authority_required_dimension_coverage,
          null
        );
      }
    });
  });

  describe("join / rejection", () => {
    it("missing source counterpart rejects", () => {
      assert.throws(() =>
        assertCompatibleOperationalEligibilityAuthorityRequiredDimensionCoverageContexts(
          {
            capability_requirement_set: {} as never,
            specification: { policies: [] },
            candidate_assessments: [mockPolicy()],
            has_explicit_operational_eligibility_dimension_policies: true,
            model_limitations: [],
          },
          {
            canonical_authority_state_set: {} as never,
            candidate_assessments: [],
            has_authority_sources: false,
            has_positive_canonical_authority_state_sources: false,
            has_negative_canonical_authority_state_sources: false,
            has_unresolved_canonical_authority_state_sources: false,
            model_limitations: [],
          }
        )
      );
    });

    it("duplicate source candidate keys reject", () => {
      assert.throws(() =>
        assertCompatibleOperationalEligibilityAuthorityRequiredDimensionCoverageContexts(
          {
            capability_requirement_set: {} as never,
            specification: { policies: [] },
            candidate_assessments: [mockPolicy()],
            has_explicit_operational_eligibility_dimension_policies: true,
            model_limitations: [],
          },
          {
            canonical_authority_state_set: {} as never,
            candidate_assessments: [
              mockSourceAssessment(),
              mockSourceAssessment(),
            ],
            has_authority_sources: true,
            has_positive_canonical_authority_state_sources: true,
            has_negative_canonical_authority_state_sources: false,
            has_unresolved_canonical_authority_state_sources: false,
            model_limitations: [],
          }
        )
      );
    });

    it("candidate key mismatch rejects", () => {
      assert.throws(() =>
        assessAttentionCandidateObservationOperationalEligibilityAuthorityRequiredDimensionCoverage(
          mockPolicy(),
          mockSourceAssessment({ candidate_key: "other" })
        )
      );
    });

    it("observation need mismatch rejects", () => {
      assert.throws(() =>
        assessAttentionCandidateObservationOperationalEligibilityAuthorityRequiredDimensionCoverage(
          mockPolicy(),
          mockSourceAssessment({
            sources: [
              mockAuthoritySource({
                canonical_authority_state_value: POSITIVE,
                observation_need_key: NEED_KEY_2,
              }),
            ],
          })
        )
      );
    });

    it("requirement set mismatch rejects", () => {
      assert.throws(() =>
        assessAttentionCandidateObservationOperationalEligibilityAuthorityRequiredDimensionCoverage(
          mockPolicy(),
          mockSourceAssessment({
            sources: [
              mockAuthoritySource({
                canonical_authority_state_value: POSITIVE,
                set_key: SET_KEY_2,
              }),
            ],
          })
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
        authority_source_bridge_set: {
          canonical_authority_state_set: {} as never,
          candidate_assessments: [mockSourceAssessment()],
          has_authority_sources: true,
          has_positive_canonical_authority_state_sources: true,
          has_negative_canonical_authority_state_sources: false,
          has_unresolved_canonical_authority_state_sources: false,
          model_limitations: [],
        },
      };
      const before = deepClone(input);
      const a =
        buildAttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageSet(
          input
        );
      const b =
        buildAttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageSet(
          input
        );
      const c =
        buildAttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageSet(
          deepClone(input)
        );
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
    });

    it("schema 0.1.24; 084+117 only; no 116/094/095; no polarity branch", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      assert.deepEqual(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_REQUIRED_DIMENSION_COVERAGE_MODEL_LIMITATIONS.slice(
          0,
          3
        ),
        [
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED",
        ]
      );

      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-required-dimension-coverage-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-required-dimension-coverage-types.ts"
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
        /attention-observation-operational-eligibility-authority-source-bridge-types/.test(
          core
        )
      );
      assert.ok(
        !/from ["'].*canonical-authority-state/.test(src)
      );
      assert.ok(
        !/from ["'].*permission-required-dimension-coverage/.test(src)
      );
      assert.ok(
        !/from ["'].*permission-source-resolution/.test(src)
      );
      assert.ok(!/import.*ProjectState/.test(coreCode));
      assert.ok(!/Date\.now\(/.test(coreCode));
      assert.ok(!/new Date\(/.test(coreCode));
      assert.ok(!/performance\.now\(/.test(coreCode));
      assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(src));
      assert.ok(!/"can_execute"/.test(src));
      assert.ok(!/"ACCEPTED"/.test(src));
      assert.ok(!/"REJECTED"/.test(src));
      assert.ok(!/"RESOLVED"/.test(src) || /UNRESOLVED/.test(src));
      assert.ok(
        !/EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE/.test(coreCode)
      );
      assert.ok(
        !/EXPLICITLY_INTERPRETED_AUTHORITY_NEGATIVE/.test(coreCode)
      );
      assert.ok(!/\bfilter\(/.test(coreCode));
    });
  });
});
