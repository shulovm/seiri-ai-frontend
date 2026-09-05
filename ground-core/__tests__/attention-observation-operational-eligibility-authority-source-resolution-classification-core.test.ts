/**
 * GROUND-119 — Observation Core LXXIII / Operational Eligibility AUTHORITY
 * Source Resolution Classification Foundation
 *
 * Pure GROUND-117 AUTHORITY source → RESOLVED / UNRESOLVED classification
 * (independent from 084 / 118; negative is RESOLVED; unresolved ≠ absent;
 * no acceptance / aggregation / OE / can_execute).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_MODEL_LIMITATIONS,
  assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceResolutionClassification,
  attentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationKey,
  buildAttentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationSet,
  classifyOperationalEligibilityAuthoritySourceResolution,
} from "../reality/attention-observation-operational-eligibility-authority-source-resolution-classification-core.js";
import { buildAttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageSet } from "../reality/attention-observation-operational-eligibility-authority-required-dimension-coverage-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment,
  AttentionObservationOperationalEligibilityAuthoritySource,
} from "../reality/attention-observation-operational-eligibility-authority-source-bridge-types.js";
import type { AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue } from "../reality/attention-observation-operational-eligibility-canonical-authority-state-types.js";
import type {
  AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment,
  AttentionObservationOperationalEligibilityDimension,
  AttentionObservationOperationalEligibilityDimensionPolicy,
} from "../reality/attention-observation-operational-eligibility-dimension-policy-types.js";
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
const BINDING_KEY =
  "attention-observation-authority-context-binding|cand|need|set|holder|power|scope";
const BINDING_KEY_B =
  "attention-observation-authority-context-binding|cand|need|set|holderB|powerB|scopeB";
const AT = "2026-08-24T11:00:00.000Z";
const AT_ALT = "2026-08-24T11:30:00.000Z";
const BASIS_KEY = "116-canonical-authority-state-basis|cand|binding";
const BASIS_KEY_ALT = "116-canonical-authority-state-basis|cand|binding|alt";
const STATE_KEY = "116-canonical-authority-state|cand|binding";

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
  assert.ok(!/"UNKNOWN"/.test(json));
  assert.ok(!/"REPRESENTED"/.test(json));
  assert.ok(!/"NOT_REPRESENTED"/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"OPERATIONALLY_INELIGIBLE"/.test(json));
  assert.ok(!/"effective_authority"/.test(json));
  assert.ok(!/"is_authorized"/.test(json));
  assert.ok(!/"required_dimensions"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"ANY_SOURCE"/.test(json));
  assert.ok(!/"ALL_SOURCES"/.test(json));
}

function mockAuthoritySource(options: {
  canonical_authority_state_value: AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue;
  source_key?: string;
  binding_key?: string;
  basis_key?: string;
  state_key?: string;
  at?: string;
  instant_key?: string;
  candidate_key?: string;
  observation_need_key?: string;
  set_key?: string;
  holder_entity_id?: string;
  authority_power?: string;
  governance_scope_key?: string;
}): AttentionObservationOperationalEligibilityAuthoritySource {
  const candidate_key = options.candidate_key ?? CAND;
  const observation_need_key = options.observation_need_key ?? NEED_KEY;
  const set_key = options.set_key ?? SET_KEY;
  const binding_key = options.binding_key ?? BINDING_KEY;
  const basis_key = options.basis_key ?? BASIS_KEY;
  const state_key = options.state_key ?? STATE_KEY;
  const at = options.at ?? AT;
  const instant_key = options.instant_key ?? "instant";
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
        options.holder_entity_id ?? "holder",
        options.authority_power ?? "AUTHORIZE_INTERVENTION",
        options.governance_scope_key ?? "scope",
        instant_key,
        at,
        state_key,
        basis_key,
        options.canonical_authority_state_value,
        "SOURCE_PRESENT",
      ].join("|"),
    candidate_key,
    observation_need_key,
    capability_requirement_set_key: set_key,
    dimension: "AUTHORITY",
    authority_observation_context_binding_key: binding_key,
    authority_holder_entity_id: options.holder_entity_id ?? "holder",
    authority_power: "AUTHORIZE_INTERVENTION",
    governance_scope: SCOPE_A,
    governance_scope_key: options.governance_scope_key ?? "scope",
    authority_evaluation_instant_key: instant_key,
    authority_evaluation_at: at,
    canonical_authority_state_key: state_key,
    canonical_authority_state_basis_key: basis_key,
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
  sources: AttentionCandidateObservationOperationalEligibilityAuthoritySourceBridgeAssessment[] = [
    mockSourceAssessment(),
  ]
) {
  return buildAttentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationSet(
    {
      authority_source_bridge_set: {
        canonical_authority_state_set: {} as never,
        candidate_assessments: sources,
        has_authority_sources: sources.some((s) => s.has_authority_sources),
        has_positive_canonical_authority_state_sources: sources.some(
          (s) => s.has_positive_canonical_authority_state_sources
        ),
        has_negative_canonical_authority_state_sources: sources.some(
          (s) => s.has_negative_canonical_authority_state_sources
        ),
        has_unresolved_canonical_authority_state_sources: sources.some(
          (s) => s.has_unresolved_canonical_authority_state_sources
        ),
        model_limitations: [],
      },
    }
  );
}

function mockPolicy(
  required_dimensions: AttentionObservationOperationalEligibilityDimension[] = [
    "AUTHORITY",
  ]
): AttentionCandidateObservationOperationalEligibilityDimensionPolicyAssessment {
  const policy: AttentionObservationOperationalEligibilityDimensionPolicy = {
    key: POLICY_KEY,
    candidate_key: CAND,
    observation_need_key: NEED_KEY,
    capability_requirement_set_key: SET_KEY,
    capability_requirement_keys: ["req"],
    required_dimensions,
  };
  return {
    candidate_key: CAND,
    capability_requirement_assessment: {} as never,
    status: "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT",
    operational_eligibility_dimension_policy: policy,
    model_limitations: [],
  };
}

function deepClone<T>(value: T): T {
  return structuredClone(value);
}

describe("GROUND-119 Operational Eligibility AUTHORITY Source Resolution Classification", () => {
  describe("exact canonical State → resolution mapping", () => {
    it("POSITIVE → RESOLVED / null", () => {
      const classified =
        classifyOperationalEligibilityAuthoritySourceResolution(POSITIVE);
      assert.deepEqual(classified, {
        resolution: "RESOLVED",
        unresolved_reason: null,
      });
      const c = buildSet([
        mockSourceAssessment({
          sources: [
            mockAuthoritySource({ canonical_authority_state_value: POSITIVE }),
          ],
        }),
      ]).candidate_assessments[0]!
        .authority_source_resolution_classifications[0]!;
      assert.equal(c.resolution, "RESOLVED");
      assert.equal(c.unresolved_reason, null);
      assert.equal(c.canonical_authority_state_value, POSITIVE);
      assertNoForbiddenSemantics(c);
    });

    it("NEGATIVE → RESOLVED / null (not unresolved / rejected)", () => {
      const classified =
        classifyOperationalEligibilityAuthoritySourceResolution(NEGATIVE);
      assert.equal(classified.resolution, "RESOLVED");
      assert.equal(classified.unresolved_reason, null);
      const c = buildSet([
        mockSourceAssessment({
          sources: [
            mockAuthoritySource({ canonical_authority_state_value: NEGATIVE }),
          ],
        }),
      ]).candidate_assessments[0]!
        .authority_source_resolution_classifications[0]!;
      assert.equal(c.resolution, "RESOLVED");
      assert.equal(c.canonical_authority_state_value, NEGATIVE);
      assert.notEqual(c.resolution, "UNRESOLVED");
      assert.ok(!/"REJECTED"/.test(JSON.stringify(c)));
    });

    it("NO_POLICY unresolved → exact reason", () => {
      const classified =
        classifyOperationalEligibilityAuthoritySourceResolution(
          UNRESOLVED_POLICY
        );
      assert.deepEqual(classified, {
        resolution: "UNRESOLVED",
        unresolved_reason:
          "NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_POLICY",
      });
      const c = buildSet([
        mockSourceAssessment({
          sources: [
            mockAuthoritySource({
              canonical_authority_state_value: UNRESOLVED_POLICY,
            }),
          ],
        }),
      ]).candidate_assessments[0]!
        .authority_source_resolution_classifications[0]!;
      assert.equal(c.resolution, "UNRESOLVED");
      assert.equal(
        c.unresolved_reason,
        "NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_POLICY"
      );
    });

    it("NO_MAPPING unresolved → exact second reason", () => {
      const classified =
        classifyOperationalEligibilityAuthoritySourceResolution(
          UNRESOLVED_MAPPING
        );
      assert.deepEqual(classified, {
        resolution: "UNRESOLVED",
        unresolved_reason:
          "NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE",
      });
      const c = buildSet([
        mockSourceAssessment({
          sources: [
            mockAuthoritySource({
              canonical_authority_state_value: UNRESOLVED_MAPPING,
            }),
          ],
        }),
      ]).candidate_assessments[0]!
        .authority_source_resolution_classifications[0]!;
      assert.equal(
        c.unresolved_reason,
        "NO_EXPLICIT_AUTHORITY_EVIDENCE_INTERPRETATION_MAPPING_FOR_CURRENT_EVALUATION_STATE"
      );
    });

    it("two unresolved reasons remain distinct", () => {
      const a =
        classifyOperationalEligibilityAuthoritySourceResolution(
          UNRESOLVED_POLICY
        );
      const b =
        classifyOperationalEligibilityAuthoritySourceResolution(
          UNRESOLVED_MAPPING
        );
      assert.notEqual(a.unresolved_reason, b.unresolved_reason);
      assert.equal(a.resolution, "UNRESOLVED");
      assert.equal(b.resolution, "UNRESOLVED");
    });

    it("all four canonical values classified independently", () => {
      const set = buildSet([
        mockSourceAssessment({
          sources: [
            mockAuthoritySource({
              canonical_authority_state_value: POSITIVE,
              binding_key: `${BINDING_KEY}|1`,
              basis_key: `${BASIS_KEY}|1`,
            }),
            mockAuthoritySource({
              canonical_authority_state_value: NEGATIVE,
              binding_key: `${BINDING_KEY}|2`,
              basis_key: `${BASIS_KEY}|2`,
            }),
            mockAuthoritySource({
              canonical_authority_state_value: UNRESOLVED_POLICY,
              binding_key: `${BINDING_KEY}|3`,
              basis_key: `${BASIS_KEY}|3`,
            }),
            mockAuthoritySource({
              canonical_authority_state_value: UNRESOLVED_MAPPING,
              binding_key: `${BINDING_KEY}|4`,
              basis_key: `${BASIS_KEY}|4`,
            }),
          ],
        }),
      ]);
      const classifications =
        set.candidate_assessments[0]!
          .authority_source_resolution_classifications;
      assert.equal(classifications.length, 4);
      assert.deepEqual(
        classifications.map((c) => c.resolution),
        ["RESOLVED", "RESOLVED", "UNRESOLVED", "UNRESOLVED"]
      );
      assert.equal(set.has_resolved_authority_sources, true);
      assert.equal(set.has_unresolved_authority_sources, true);
    });
  });

  describe("lineage / identity / one-per-source", () => {
    it("retains exact 117 source key, State/Basis, binding, instant, raw value", () => {
      const source = mockAuthoritySource({
        canonical_authority_state_value: NEGATIVE,
        source_key: "exact-117-source-key",
        basis_key: BASIS_KEY,
        state_key: "exact-state-key",
        binding_key: BINDING_KEY,
        at: AT,
        instant_key: "instant-exact",
      });
      const c = buildSet([
        mockSourceAssessment({ sources: [source] }),
      ]).candidate_assessments[0]!
        .authority_source_resolution_classifications[0]!;
      assert.equal(c.authority_source_key, "exact-117-source-key");
      assert.equal(c.canonical_authority_state_basis_key, BASIS_KEY);
      assert.equal(c.canonical_authority_state_key, "exact-state-key");
      assert.equal(c.authority_observation_context_binding_key, BINDING_KEY);
      assert.equal(c.authority_evaluation_at, AT);
      assert.equal(c.authority_evaluation_instant_key, "instant-exact");
      assert.equal(c.canonical_authority_state_value, NEGATIVE);
      assert.equal(c.dimension, "AUTHORITY");
    });

    it("one classification per exact source", () => {
      const sources = [
        mockAuthoritySource({
          canonical_authority_state_value: POSITIVE,
          binding_key: `${BINDING_KEY}|a`,
          basis_key: `${BASIS_KEY}|a`,
        }),
        mockAuthoritySource({
          canonical_authority_state_value: UNRESOLVED_POLICY,
          binding_key: `${BINDING_KEY}|b`,
          basis_key: `${BASIS_KEY}|b`,
        }),
      ];
      const classifications = buildSet([
        mockSourceAssessment({ sources }),
      ]).candidate_assessments[0]!.authority_source_resolution_classifications;
      assert.equal(classifications.length, sources.length);
      assert.deepEqual(
        classifications.map((c) => c.authority_source_key),
        sources.map((s) => s.key)
      );
    });

    it("identity changes with source / Basis / instant / binding / value / reason", () => {
      const base = mockAuthoritySource({ canonical_authority_state_value: POSITIVE });
      const baseClassified =
        classifyOperationalEligibilityAuthoritySourceResolution(
          base.canonical_authority_state_value
        );
      const baseKey =
        attentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationKey(
          {
            candidate_key: base.candidate_key,
            observation_need_key: base.observation_need_key,
            capability_requirement_set_key: base.capability_requirement_set_key,
            authority_observation_context_binding_key:
              base.authority_observation_context_binding_key,
            authority_holder_entity_id: base.authority_holder_entity_id,
            authority_power: base.authority_power,
            governance_scope_key: base.governance_scope_key,
            authority_evaluation_instant_key: base.authority_evaluation_instant_key,
            authority_evaluation_at: base.authority_evaluation_at,
            authority_source_key: base.key,
            canonical_authority_state_key: base.canonical_authority_state_key,
            canonical_authority_state_basis_key:
              base.canonical_authority_state_basis_key,
            canonical_authority_state_value: base.canonical_authority_state_value,
            resolution: baseClassified.resolution,
            unresolved_reason: baseClassified.unresolved_reason,
          }
        );

      const sourceChanged =
        attentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationKey(
          {
            ...base,
            authority_source_key: `${base.key}|alt`,
            canonical_authority_state_key: base.canonical_authority_state_key,
            canonical_authority_state_basis_key:
              base.canonical_authority_state_basis_key,
            canonical_authority_state_value: base.canonical_authority_state_value,
            resolution: baseClassified.resolution,
            unresolved_reason: baseClassified.unresolved_reason,
          }
        );
      assert.notEqual(baseKey, sourceChanged);

      const policyClass = buildSet([
        mockSourceAssessment({
          sources: [
            mockAuthoritySource({
              canonical_authority_state_value: UNRESOLVED_POLICY,
            }),
          ],
        }),
      ]).candidate_assessments[0]!
        .authority_source_resolution_classifications[0]!;
      const mappingClass = buildSet([
        mockSourceAssessment({
          sources: [
            mockAuthoritySource({
              canonical_authority_state_value: UNRESOLVED_MAPPING,
            }),
          ],
        }),
      ]).candidate_assessments[0]!
        .authority_source_resolution_classifications[0]!;
      assert.notEqual(policyClass.key, mappingClass.key);
      assert.notEqual(
        policyClass.unresolved_reason,
        mappingClass.unresolved_reason
      );
    });
  });

  describe("candidate booleans / outer statuses", () => {
    it("all negative → has_resolved true, has_unresolved false", () => {
      const assessment = buildSet([
        mockSourceAssessment({
          sources: [
            mockAuthoritySource({
              canonical_authority_state_value: NEGATIVE,
              binding_key: `${BINDING_KEY}|a`,
            }),
            mockAuthoritySource({
              canonical_authority_state_value: NEGATIVE,
              binding_key: `${BINDING_KEY}|b`,
            }),
          ],
        }),
      ]).candidate_assessments[0]!;
      assert.equal(assessment.has_resolved_authority_sources, true);
      assert.equal(assessment.has_unresolved_authority_sources, false);
    });

    it("one unresolved does not contaminate resolved", () => {
      const assessment = buildSet([
        mockSourceAssessment({
          sources: [
            mockAuthoritySource({
              canonical_authority_state_value: POSITIVE,
              binding_key: `${BINDING_KEY}|a`,
            }),
            mockAuthoritySource({
              canonical_authority_state_value: UNRESOLVED_POLICY,
              binding_key: `${BINDING_KEY}|b`,
            }),
          ],
        }),
      ]).candidate_assessments[0]!;
      assert.equal(assessment.has_resolved_authority_sources, true);
      assert.equal(assessment.has_unresolved_authority_sources, true);
      assert.equal(
        assessment.authority_source_resolution_classifications.filter(
          (c) => c.resolution === "RESOLVED"
        ).length,
        1
      );
      assert.equal(
        assessment.authority_source_resolution_classifications.filter(
          (c) => c.resolution === "UNRESOLVED"
        ).length,
        1
      );
    });

    it("outer statuses → no classifications", () => {
      for (const status of [
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS",
        "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED",
      ] as const) {
        const assessment = buildSet([
          mockSourceAssessment({ status }),
        ]).candidate_assessments[0]!;
        assert.equal(assessment.status, status);
        assert.deepEqual(
          assessment.authority_source_resolution_classifications,
          []
        );
        assert.equal(
          assessment.has_authority_source_resolution_classifications,
          false
        );
      }
    });

    it("source absence != UNRESOLVED — no synthetic classification", () => {
      const assessment = buildSet([
        mockSourceAssessment({
          status: "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        }),
      ]).candidate_assessments[0]!;
      assert.equal(
        assessment.authority_source_resolution_classifications.length,
        0
      );
      assert.equal(assessment.has_unresolved_authority_sources, false);
    });
  });

  describe("coverage independence (118 sibling, not consumed)", () => {
    it("REPRESENTED + UNRESOLVED without 119 consuming 118", () => {
      const sourceAssessment = mockSourceAssessment({
        sources: [
          mockAuthoritySource({
            canonical_authority_state_value: UNRESOLVED_POLICY,
          }),
        ],
      });
      const resolutionSet = buildSet([sourceAssessment]);
      const coverageSet =
        buildAttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageSet(
          {
            operational_eligibility_dimension_policy_set: {
              capability_requirement_set: {} as never,
              specification: { policies: [] },
              candidate_assessments: [mockPolicy()],
              has_explicit_operational_eligibility_dimension_policies: true,
              model_limitations: [],
            },
            authority_source_bridge_set: {
              canonical_authority_state_set: {} as never,
              candidate_assessments: [sourceAssessment],
              has_authority_sources: true,
              has_positive_canonical_authority_state_sources: false,
              has_negative_canonical_authority_state_sources: false,
              has_unresolved_canonical_authority_state_sources: true,
              model_limitations: [],
            },
          }
        );
      assert.equal(
        coverageSet.candidate_assessments[0]!
          .authority_required_dimension_coverage!.coverage,
        "REPRESENTED"
      );
      const classification =
        resolutionSet.candidate_assessments[0]!
          .authority_source_resolution_classifications[0]!;
      assert.equal(classification.resolution, "UNRESOLVED");
    });

    it("REPRESENTED + RESOLVED negative without acceptance", () => {
      const sourceAssessment = mockSourceAssessment({
        sources: [
          mockAuthoritySource({ canonical_authority_state_value: NEGATIVE }),
        ],
      });
      const coverageSet =
        buildAttentionObservationOperationalEligibilityAuthorityRequiredDimensionCoverageSet(
          {
            operational_eligibility_dimension_policy_set: {
              capability_requirement_set: {} as never,
              specification: { policies: [] },
              candidate_assessments: [mockPolicy()],
              has_explicit_operational_eligibility_dimension_policies: true,
              model_limitations: [],
            },
            authority_source_bridge_set: {
              canonical_authority_state_set: {} as never,
              candidate_assessments: [sourceAssessment],
              has_authority_sources: true,
              has_positive_canonical_authority_state_sources: false,
              has_negative_canonical_authority_state_sources: true,
              has_unresolved_canonical_authority_state_sources: false,
              model_limitations: [],
            },
          }
        );
      const resolutionSet = buildSet([sourceAssessment]);
      assert.equal(
        coverageSet.candidate_assessments[0]!
          .authority_required_dimension_coverage!.coverage,
        "REPRESENTED"
      );
      assert.equal(
        resolutionSet.candidate_assessments[0]!
          .authority_source_resolution_classifications[0]!.resolution,
        "RESOLVED"
      );
      assert.equal(
        resolutionSet.candidate_assessments[0]!
          .authority_source_resolution_classifications[0]!
          .canonical_authority_state_value,
        NEGATIVE
      );
    });
  });

  describe("malformed input rejection", () => {
    it("SOURCES_PRESENT with zero sources rejects", () => {
      assert.throws(() =>
        assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceResolutionClassification(
          mockSourceAssessment({
            status: "AUTHORITY_SOURCES_PRESENT",
            sources: [],
          })
        )
      );
    });

    it("non-applicable with sources rejects", () => {
      const malformed = mockSourceAssessment({
        status: "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
      });
      malformed.authority_sources = [
        mockAuthoritySource({ canonical_authority_state_value: POSITIVE }),
      ];
      assert.throws(() =>
        assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceResolutionClassification(
          malformed
        )
      );
    });

    it("duplicate source key rejects", () => {
      const source = mockAuthoritySource({
        canonical_authority_state_value: POSITIVE,
        source_key: "dup-key",
      });
      assert.throws(() =>
        assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceResolutionClassification(
          mockSourceAssessment({ sources: [source, source] })
        )
      );
    });

    it("candidate key mismatch rejects", () => {
      assert.throws(() =>
        assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceResolutionClassification(
          mockSourceAssessment({
            sources: [
              mockAuthoritySource({
                canonical_authority_state_value: POSITIVE,
                candidate_key: "other",
              }),
            ],
          })
        )
      );
    });

    it("observation need mismatch across sources rejects", () => {
      assert.throws(() =>
        assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceResolutionClassification(
          mockSourceAssessment({
            sources: [
              mockAuthoritySource({
                canonical_authority_state_value: POSITIVE,
                observation_need_key: NEED_KEY,
                binding_key: `${BINDING_KEY}|a`,
              }),
              mockAuthoritySource({
                canonical_authority_state_value: POSITIVE,
                observation_need_key: NEED_KEY_2,
                binding_key: `${BINDING_KEY}|b`,
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
        buildAttentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationSet(
          input
        );
      const b =
        buildAttentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationSet(
          input
        );
      const c =
        buildAttentionObservationOperationalEligibilityAuthoritySourceResolutionClassificationSet(
          deepClone(input)
        );
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
    });

    it("schema 0.1.24; 117 only; no 118/084/116 runtime; no coverage semantics", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      assert.deepEqual(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_RESOLUTION_CLASSIFICATION_MODEL_LIMITATIONS.slice(
          0,
          2
        ),
        [
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_CRITERIA_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_NOT_MODELED",
        ]
      );

      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-source-resolution-classification-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-source-resolution-classification-types.ts"
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
        /attention-observation-operational-eligibility-authority-source-bridge-types/.test(
          core
        )
      );
      assert.ok(
        !/from ["'].*authority-required-dimension-coverage/.test(src)
      );
      assert.ok(
        !/from ["'].*operational-eligibility-dimension-policy/.test(src)
      );
      assert.ok(!/from ["'].*canonical-authority-state-core/.test(src));
      assert.ok(!/required_dimensions/.test(src));
      assert.ok(!/import.*ProjectState/.test(coreCode));
      assert.ok(!/Date\.now\(/.test(coreCode));
      assert.ok(!/new Date\(/.test(coreCode));
      assert.ok(!/"REPRESENTED"/.test(src));
      assert.ok(!/"NOT_REPRESENTED"/.test(src));
      assert.ok(!/"ACCEPTED"/.test(src));
      assert.ok(!/"REJECTED"/.test(src));
      assert.ok(!/\bfilter\(/.test(coreCode));
      assert.ok(!/\bif\s*\(\s*positive/.test(coreCode));
    });
  });
});
