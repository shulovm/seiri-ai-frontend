/**
 * GROUND-121 — Observation Core LXXV / Operational Eligibility AUTHORITY
 * Source Acceptance Match Foundation
 *
 * Pure 117 source + 120 criterion → LISTED / NOT_LISTED membership
 * (no 118/119; criterion/source absence ≠ NOT_LISTED; no aggregation/OE).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_MODEL_LIMITATIONS,
  assertCompatibleOperationalEligibilityAuthoritySourceAcceptanceMatchContexts,
  assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatch,
  attentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchKey,
  buildAttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchSet,
  matchOperationalEligibilityAuthoritySourceAcceptance,
} from "../reality/attention-observation-operational-eligibility-authority-source-acceptance-match-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaAssessment,
  AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterion,
} from "../reality/attention-observation-operational-eligibility-authority-source-acceptance-criteria-types.js";
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
const SET_KEY =
  "attention-observation-capability-requirement-set|cand|need|req";
const BINDING_KEY =
  "attention-observation-authority-context-binding|cand|need|set|holder|int";
const BINDING_KEY_B =
  "attention-observation-authority-context-binding|cand|need|set|holderB|intB";
const INSTANT_KEY = "authority-evaluation-instant|cand|binding|at";
const INSTANT_KEY_B = "authority-evaluation-instant|cand|bindingB|atB";
const AT = "2026-08-24T11:00:00.000Z";
const AT_ALT = "2026-08-24T11:30:00.000Z";
const STATE_KEY = "canonical-authority-state|cand|binding|positive";
const STATE_KEY_B = "canonical-authority-state|cand|bindingB|negative";
const BASIS_KEY = "canonical-authority-state-basis|cand|binding";
const BASIS_KEY_B = "canonical-authority-state-basis|cand|bindingB";
const POLICY_KEY = "084-oe-dimension-policy|cand";
const CRITERION_KEY =
  "attention-observation-operational-eligibility-authority-source-acceptance-criterion|cand|need|set|policy|AUTHORITY|EXPLICITLY_INTERPRETED_AUTHORITY_POSITIVE";
const CRITERION_KEY_ALT =
  "attention-observation-operational-eligibility-authority-source-acceptance-criterion|cand|need|set|policy|AUTHORITY|EXPLICITLY_INTERPRETED_AUTHORITY_NEGATIVE";
const HOLDER = "entity-holder-a";
const HOLDER_B = "entity-holder-b";
const SCOPE: GovernanceScope = {
  kind: "INTERVENTION_DECLARATION",
  intervention_id: "int-1",
};
const SCOPE_B: GovernanceScope = {
  kind: "INTERVENTION_DECLARATION",
  intervention_id: "int-2",
};

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
  assert.ok(!/"REPRESENTED"/.test(json));
  assert.ok(!/"NOT_REPRESENTED"/.test(json));
  assert.ok(!/"RESOLVED"/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"ANY_SOURCE"/.test(json));
  assert.ok(!/"ALL_SOURCES"/.test(json));
}

function mockAuthoritySource(options: {
  canonical_authority_state_value: AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue;
  source_key?: string;
  binding_key?: string;
  holder?: string;
  basis_key?: string;
  state_key?: string;
  instant_key?: string;
  at?: string;
  power?: "AUTHORIZE_INTERVENTION" | "GOVERN_OBJECTIVE";
  scope?: GovernanceScope;
  candidate_key?: string;
  observation_need_key?: string;
  set_key?: string;
}): AttentionObservationOperationalEligibilityAuthoritySource {
  const candidate_key = options.candidate_key ?? CAND;
  const observation_need_key = options.observation_need_key ?? NEED_KEY;
  const set_key = options.set_key ?? SET_KEY;
  const binding_key = options.binding_key ?? BINDING_KEY;
  const holder = options.holder ?? HOLDER;
  const basis_key = options.basis_key ?? BASIS_KEY;
  const state_key = options.state_key ?? STATE_KEY;
  const instant_key = options.instant_key ?? INSTANT_KEY;
  const at = options.at ?? AT;
  const power = options.power ?? "AUTHORIZE_INTERVENTION";
  const scope = options.scope ?? SCOPE;
  const governance_scope_key =
    options.binding_key === BINDING_KEY_B
      ? "governance-scope|int-2"
      : "governance-scope|int-1";
  const value = options.canonical_authority_state_value;

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
        holder,
        power,
        governance_scope_key,
        instant_key,
        at,
        state_key,
        basis_key,
        value,
        "SOURCE_PRESENT",
      ].join("|"),
    candidate_key,
    observation_need_key,
    capability_requirement_set_key: set_key,
    dimension: "AUTHORITY",
    authority_observation_context_binding_key: binding_key,
    authority_holder_entity_id: holder,
    authority_power: power,
    governance_scope: scope,
    governance_scope_key,
    authority_evaluation_instant_key: instant_key,
    authority_evaluation_at: at,
    canonical_authority_state_key: state_key,
    canonical_authority_state_basis_key: basis_key,
    canonical_authority_state_value: value,
    source_presence: "SOURCE_PRESENT",
  };
}

function mockBridgeAssessment(options?: {
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

function mockCriterion(options?: {
  accepted_canonical_authority_states?: AttentionObservationOperationalEligibilityCanonicalAuthorityStateValue[];
  criterion_key?: string;
  candidate_key?: string;
  observation_need_key?: string;
  set_key?: string;
}): AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterion {
  const accepted =
    options?.accepted_canonical_authority_states ?? [POSITIVE];
  return {
    key: options?.criterion_key ?? CRITERION_KEY,
    candidate_key: options?.candidate_key ?? CAND,
    observation_need_key: options?.observation_need_key ?? NEED_KEY,
    capability_requirement_set_key: options?.set_key ?? SET_KEY,
    dimension: "AUTHORITY",
    operational_eligibility_dimension_policy_key: POLICY_KEY,
    accepted_canonical_authority_states: accepted,
  };
}

function mockCriteriaAssessment(options?: {
  status?:
    | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
    | "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    | "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
    | "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
    | "NO_EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_DECLARED"
    | "EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_PRESENT";
  criterion?: AttentionObservationOperationalEligibilityAuthoritySourceAcceptanceCriterion | null;
  candidate_key?: string;
  policy_present?: boolean;
  required_dimensions?: ("AUTHORITY" | "PERMISSION" | "CAPABILITY_STATE")[];
}): AttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceCriteriaAssessment {
  const status =
    options?.status ??
    "EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_PRESENT";
  const present =
    status === "EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_PRESENT";
  const criterion = present
    ? (options?.criterion ?? mockCriterion())
    : null;
  const policyPresent =
    options?.policy_present ??
    (status !== "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED" &&
      status !== "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" &&
      status !== "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS");
  const required_dimensions = options?.required_dimensions ?? ["AUTHORITY"];

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
    authority_source_acceptance_criterion: criterion,
    has_explicit_authority_source_acceptance_criterion: criterion !== null,
    model_limitations: [],
  };
}

function buildSet(
  bridge = mockBridgeAssessment(),
  criteria = mockCriteriaAssessment()
) {
  return buildAttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchSet(
    {
      authority_source_bridge_set: {
        canonical_authority_state_set: {} as never,
        candidate_assessments: [bridge],
        has_authority_sources: bridge.has_authority_sources,
        has_positive_canonical_authority_state_sources:
          bridge.has_positive_canonical_authority_state_sources,
        has_negative_canonical_authority_state_sources:
          bridge.has_negative_canonical_authority_state_sources,
        has_unresolved_canonical_authority_state_sources:
          bridge.has_unresolved_canonical_authority_state_sources,
        model_limitations: [],
      },
      authority_source_acceptance_criteria_set: {
        operational_eligibility_dimension_policy_set: {} as never,
        specification: { criteria: [] },
        candidate_assessments: [criteria],
        has_explicit_authority_source_acceptance_criteria:
          criteria.has_explicit_authority_source_acceptance_criterion,
        model_limitations: [],
      },
    }
  );
}

function deepClone<T>(value: T): T {
  return structuredClone(value);
}

describe("GROUND-121 Operational Eligibility AUTHORITY Source Acceptance Match", () => {
  describe("exact membership matching", () => {
    it("POSITIVE listed → LISTED_AS_ACCEPTABLE; no ACCEPTED", () => {
      const set = buildSet(
        mockBridgeAssessment({
          sources: [
            mockAuthoritySource({ canonical_authority_state_value: POSITIVE }),
          ],
        }),
        mockCriteriaAssessment({
          criterion: mockCriterion({
            accepted_canonical_authority_states: [POSITIVE],
          }),
        })
      );
      const match =
        set.candidate_assessments[0]!.authority_source_acceptance_matches[0]!;
      assert.equal(match.match, "LISTED_AS_ACCEPTABLE");
      assert.equal(match.canonical_authority_state_value, POSITIVE);
      assertNoForbiddenSemantics(set);
    });

    it("POSITIVE excluded → NOT_LISTED; no REJECTED", () => {
      const match = buildSet(
        mockBridgeAssessment({
          sources: [
            mockAuthoritySource({ canonical_authority_state_value: POSITIVE }),
          ],
        }),
        mockCriteriaAssessment({
          criterion: mockCriterion({
            accepted_canonical_authority_states: [NEGATIVE],
            criterion_key: CRITERION_KEY_ALT,
          }),
        })
      ).candidate_assessments[0]!.authority_source_acceptance_matches[0]!;
      assert.equal(match.match, "NOT_LISTED_AS_ACCEPTABLE");
      assert.ok(!/"REJECTED"/.test(JSON.stringify(match)));
    });

    it("NEGATIVE explicitly listed → LISTED", () => {
      assert.equal(
        buildSet(
          mockBridgeAssessment({
            sources: [
              mockAuthoritySource({ canonical_authority_state_value: NEGATIVE }),
            ],
          }),
          mockCriteriaAssessment({
            criterion: mockCriterion({
              accepted_canonical_authority_states: [NEGATIVE],
              criterion_key: CRITERION_KEY_ALT,
            }),
          })
        ).candidate_assessments[0]!.authority_source_acceptance_matches[0]!
          .match,
        "LISTED_AS_ACCEPTABLE"
      );
    });

    it("unresolved policy / mapping listed and excluded", () => {
      assert.equal(
        buildSet(
          mockBridgeAssessment({
            sources: [
              mockAuthoritySource({
                canonical_authority_state_value: UNRESOLVED_POLICY,
              }),
            ],
          }),
          mockCriteriaAssessment({
            criterion: mockCriterion({
              accepted_canonical_authority_states: [UNRESOLVED_POLICY],
            }),
          })
        ).candidate_assessments[0]!.authority_source_acceptance_matches[0]!
          .match,
        "LISTED_AS_ACCEPTABLE"
      );
      assert.equal(
        buildSet(
          mockBridgeAssessment({
            sources: [
              mockAuthoritySource({
                canonical_authority_state_value: UNRESOLVED_MAPPING,
              }),
            ],
          }),
          mockCriteriaAssessment({
            criterion: mockCriterion({
              accepted_canonical_authority_states: [UNRESOLVED_MAPPING],
            }),
          })
        ).candidate_assessments[0]!.authority_source_acceptance_matches[0]!
          .match,
        "LISTED_AS_ACCEPTABLE"
      );
      assert.equal(
        buildSet(
          mockBridgeAssessment({
            sources: [
              mockAuthoritySource({
                canonical_authority_state_value: UNRESOLVED_POLICY,
              }),
            ],
          }),
          mockCriteriaAssessment({
            criterion: mockCriterion({
              accepted_canonical_authority_states: [POSITIVE],
            }),
          })
        ).candidate_assessments[0]!.authority_source_acceptance_matches[0]!
          .match,
        "NOT_LISTED_AS_ACCEPTABLE"
      );
    });

    it("membership helper is exact includes only", () => {
      assert.equal(
        matchOperationalEligibilityAuthoritySourceAcceptance(
          [POSITIVE, UNRESOLVED_POLICY],
          POSITIVE
        ),
        "LISTED_AS_ACCEPTABLE"
      );
      assert.equal(
        matchOperationalEligibilityAuthoritySourceAcceptance(
          [POSITIVE, UNRESOLVED_POLICY],
          NEGATIVE
        ),
        "NOT_LISTED_AS_ACCEPTABLE"
      );
      assert.equal(
        matchOperationalEligibilityAuthoritySourceAcceptance([], POSITIVE),
        "NOT_LISTED_AS_ACCEPTABLE"
      );
    });

    it("core example: mixed four sources independent membership", () => {
      const matches = buildSet(
        mockBridgeAssessment({
          sources: [
            mockAuthoritySource({
              canonical_authority_state_value: POSITIVE,
              binding_key: `${BINDING_KEY}|1`,
              basis_key: `${BASIS_KEY}|1`,
              state_key: `${STATE_KEY}|1`,
            }),
            mockAuthoritySource({
              canonical_authority_state_value: NEGATIVE,
              binding_key: `${BINDING_KEY}|2`,
              basis_key: `${BASIS_KEY}|2`,
              state_key: `${STATE_KEY}|2`,
            }),
            mockAuthoritySource({
              canonical_authority_state_value: UNRESOLVED_POLICY,
              binding_key: `${BINDING_KEY}|3`,
              basis_key: `${BASIS_KEY}|3`,
              state_key: `${STATE_KEY}|3`,
            }),
            mockAuthoritySource({
              canonical_authority_state_value: UNRESOLVED_MAPPING,
              binding_key: `${BINDING_KEY}|4`,
              basis_key: `${BASIS_KEY}|4`,
              state_key: `${STATE_KEY}|4`,
            }),
          ],
        }),
        mockCriteriaAssessment({
          criterion: mockCriterion({
            accepted_canonical_authority_states: [NEGATIVE, UNRESOLVED_POLICY],
          }),
        })
      ).candidate_assessments[0]!.authority_source_acceptance_matches;
      assert.deepEqual(
        matches.map((m) => m.match),
        [
          "NOT_LISTED_AS_ACCEPTABLE",
          "LISTED_AS_ACCEPTABLE",
          "LISTED_AS_ACCEPTABLE",
          "NOT_LISTED_AS_ACCEPTABLE",
        ]
      );
    });
  });

  describe("absence / empty criterion firewalled", () => {
    it("explicit empty criterion + sources → N NOT_LISTED matches", () => {
      const set = buildSet(
        mockBridgeAssessment({
          sources: [
            mockAuthoritySource({ canonical_authority_state_value: POSITIVE }),
            mockAuthoritySource({
              canonical_authority_state_value: NEGATIVE,
              binding_key: BINDING_KEY_B,
              basis_key: BASIS_KEY_B,
              state_key: STATE_KEY_B,
            }),
          ],
        }),
        mockCriteriaAssessment({
          criterion: mockCriterion({
            accepted_canonical_authority_states: [],
            criterion_key:
              "attention-observation-operational-eligibility-authority-source-acceptance-criterion|cand|need|set|policy|AUTHORITY|EMPTY_ACCEPTED_CANONICAL_AUTHORITY_STATE_SET",
          }),
        })
      );
      const candidate = set.candidate_assessments[0]!;
      assert.equal(
        candidate.status,
        "AUTHORITY_SOURCE_ACCEPTANCE_MATCHES_PRESENT"
      );
      assert.equal(candidate.authority_source_acceptance_matches.length, 2);
      assert.ok(
        candidate.authority_source_acceptance_matches.every(
          (m) => m.match === "NOT_LISTED_AS_ACCEPTABLE"
        )
      );
      assert.equal(candidate.has_authority_source_acceptance_matches, true);
      assert.equal(candidate.has_listed_as_acceptable_authority_sources, false);
      assert.equal(
        candidate.has_not_listed_as_acceptable_authority_sources,
        true
      );
    });

    it("criterion absence + sources → zero matches; != empty criterion", () => {
      const absent = buildSet(
        mockBridgeAssessment(),
        mockCriteriaAssessment({
          status: "NO_EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_DECLARED",
          criterion: null,
        })
      ).candidate_assessments[0]!;
      assert.equal(
        absent.status,
        "NO_EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_DECLARED"
      );
      assert.equal(absent.authority_source_acceptance_matches.length, 0);
      assert.equal(absent.has_authority_source_acceptance_matches, false);

      const empty = buildSet(
        mockBridgeAssessment(),
        mockCriteriaAssessment({
          criterion: mockCriterion({ accepted_canonical_authority_states: [] }),
        })
      ).candidate_assessments[0]!;
      assert.equal(empty.status, "AUTHORITY_SOURCE_ACCEPTANCE_MATCHES_PRESENT");
      assert.equal(empty.authority_source_acceptance_matches.length, 1);
    });

    it("no sources + criterion → zero matches; source absence != NOT_LISTED", () => {
      for (const status of [
        "NO_EXPLICIT_AUTHORITY_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
        "NO_EXPLICIT_AUTHORITY_EVALUATION_INSTANT_DECLARED",
      ] as const) {
        const candidate = buildSet(
          mockBridgeAssessment({ status }),
          mockCriteriaAssessment()
        ).candidate_assessments[0]!;
        assert.equal(candidate.status, status);
        assert.equal(candidate.authority_source_acceptance_matches.length, 0);
        assert.equal(
          candidate.has_not_listed_as_acceptable_authority_sources,
          false
        );
      }
    });
  });

  describe("multi-source / lineage / identity", () => {
    it("one match per source; equal canonical values remain separate; lineage retained", () => {
      const set = buildSet(
        mockBridgeAssessment({
          sources: [
            mockAuthoritySource({
              canonical_authority_state_value: POSITIVE,
              binding_key: `${BINDING_KEY}|1`,
              basis_key: `${BASIS_KEY}|1`,
            }),
            mockAuthoritySource({
              canonical_authority_state_value: POSITIVE,
              binding_key: `${BINDING_KEY}|2`,
              basis_key: `${BASIS_KEY}|2`,
            }),
          ],
        }),
        mockCriteriaAssessment({
          criterion: mockCriterion({
            accepted_canonical_authority_states: [POSITIVE],
          }),
        })
      );
      const matches =
        set.candidate_assessments[0]!.authority_source_acceptance_matches;
      assert.equal(matches.length, 2);
      assert.notEqual(matches[0]!.authority_source_key, matches[1]!.authority_source_key);
      assert.notEqual(matches[0]!.key, matches[1]!.key);
      assert.equal(matches[0]!.authority_observation_context_binding_key, `${BINDING_KEY}|1`);
      assert.equal(matches[0]!.canonical_authority_state_basis_key, `${BASIS_KEY}|1`);
      assert.equal(matches[0]!.authority_evaluation_at, AT);
      assert.equal(
        matches[0]!.authority_source_acceptance_criterion_key,
        CRITERION_KEY
      );
    });

    it("mixed LISTED/NOT_LISTED summary booleans both true", () => {
      const candidate = buildSet(
        mockBridgeAssessment({
          sources: [
            mockAuthoritySource({ canonical_authority_state_value: POSITIVE }),
            mockAuthoritySource({
              canonical_authority_state_value: NEGATIVE,
              binding_key: BINDING_KEY_B,
              basis_key: BASIS_KEY_B,
              state_key: STATE_KEY_B,
            }),
          ],
        }),
        mockCriteriaAssessment({
          criterion: mockCriterion({
            accepted_canonical_authority_states: [POSITIVE],
          }),
        })
      ).candidate_assessments[0]!;
      assert.equal(candidate.has_listed_as_acceptable_authority_sources, true);
      assert.equal(
        candidate.has_not_listed_as_acceptable_authority_sources,
        true
      );
    });

    it("source / criterion / state / binding / instant change identity", () => {
      const base =
        attentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            authority_observation_context_binding_key: BINDING_KEY,
            authority_holder_entity_id: HOLDER,
            authority_power: "AUTHORIZE_INTERVENTION",
            governance_scope_key: "governance-scope|int-1",
            authority_evaluation_instant_key: INSTANT_KEY,
            authority_evaluation_at: AT,
            authority_source_key: "src-a",
            canonical_authority_state_key: STATE_KEY,
            canonical_authority_state_basis_key: BASIS_KEY,
            canonical_authority_state_value: POSITIVE,
            authority_source_acceptance_criterion_key: CRITERION_KEY,
            match: "LISTED_AS_ACCEPTABLE",
          }
        );
      assert.notEqual(
        base,
        attentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            authority_observation_context_binding_key: BINDING_KEY,
            authority_holder_entity_id: HOLDER,
            authority_power: "AUTHORIZE_INTERVENTION",
            governance_scope_key: "governance-scope|int-1",
            authority_evaluation_instant_key: INSTANT_KEY,
            authority_evaluation_at: AT,
            authority_source_key: "src-b",
            canonical_authority_state_key: STATE_KEY,
            canonical_authority_state_basis_key: BASIS_KEY,
            canonical_authority_state_value: POSITIVE,
            authority_source_acceptance_criterion_key: CRITERION_KEY,
            match: "LISTED_AS_ACCEPTABLE",
          }
        )
      );
      assert.notEqual(
        base,
        attentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            authority_observation_context_binding_key: BINDING_KEY_B,
            authority_holder_entity_id: HOLDER,
            authority_power: "AUTHORIZE_INTERVENTION",
            governance_scope_key: "governance-scope|int-1",
            authority_evaluation_instant_key: INSTANT_KEY,
            authority_evaluation_at: AT,
            authority_source_key: "src-a",
            canonical_authority_state_key: STATE_KEY,
            canonical_authority_state_basis_key: BASIS_KEY,
            canonical_authority_state_value: POSITIVE,
            authority_source_acceptance_criterion_key: CRITERION_KEY,
            match: "LISTED_AS_ACCEPTABLE",
          }
        )
      );
      assert.notEqual(
        base,
        attentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchKey(
          {
            candidate_key: CAND,
            observation_need_key: NEED_KEY,
            capability_requirement_set_key: SET_KEY,
            authority_observation_context_binding_key: BINDING_KEY,
            authority_holder_entity_id: HOLDER,
            authority_power: "AUTHORIZE_INTERVENTION",
            governance_scope_key: "governance-scope|int-1",
            authority_evaluation_instant_key: INSTANT_KEY,
            authority_evaluation_at: AT_ALT,
            authority_source_key: "src-a",
            canonical_authority_state_key: STATE_KEY,
            canonical_authority_state_basis_key: BASIS_KEY,
            canonical_authority_state_value: POSITIVE,
            authority_source_acceptance_criterion_key: CRITERION_KEY,
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
          mockBridgeAssessment({
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
          mockBridgeAssessment(),
          mockCriteriaAssessment({
            status: "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY",
            criterion: null,
            required_dimensions: ["PERMISSION"],
          })
        ).candidate_assessments[0]!.status,
        "AUTHORITY_DIMENSION_NOT_REQUIRED_BY_EXPLICIT_POLICY"
      );
      assert.equal(
        buildSet(
          mockBridgeAssessment(),
          mockCriteriaAssessment({
            status: "NO_EXPLICIT_AUTHORITY_SOURCE_ACCEPTANCE_CRITERION_DECLARED",
            criterion: null,
          })
        ).candidate_assessments[0]!.authority_source_acceptance_matches.length,
        0
      );
    });

    it("candidate/context mismatch and missing/extra counterpart reject", () => {
      assert.throws(() =>
        assessAttentionCandidateObservationOperationalEligibilityAuthoritySourceAcceptanceMatch(
          mockBridgeAssessment({ candidate_key: "a" }),
          mockCriteriaAssessment({ candidate_key: "b" })
        )
      );
      assert.throws(() =>
        assertCompatibleOperationalEligibilityAuthoritySourceAcceptanceMatchContexts(
          {
            canonical_authority_state_set: {} as never,
            candidate_assessments: [mockBridgeAssessment()],
            has_authority_sources: true,
            has_positive_canonical_authority_state_sources: true,
            has_negative_canonical_authority_state_sources: false,
            has_unresolved_canonical_authority_state_sources: false,
            model_limitations: [],
          },
          {
            operational_eligibility_dimension_policy_set: {} as never,
            specification: { criteria: [] },
            candidate_assessments: [
              mockCriteriaAssessment(),
              mockCriteriaAssessment({ candidate_key: "extra" }),
            ],
            has_explicit_authority_source_acceptance_criteria: true,
            model_limitations: [],
          }
        )
      );
      assert.throws(() =>
        buildSet(
          mockBridgeAssessment({
            sources: [
              mockAuthoritySource({
                canonical_authority_state_value: POSITIVE,
                observation_need_key: "need-other",
              }),
            ],
          }),
          mockCriteriaAssessment()
        )
      );
    });

    it("duplicate source key rejects", () => {
      const source = mockAuthoritySource({
        canonical_authority_state_value: POSITIVE,
      });
      assert.throws(() =>
        buildSet(
          mockBridgeAssessment({ sources: [source, { ...source }] }),
          mockCriteriaAssessment()
        )
      );
    });
  });

  describe("determinism / immutability / static boundaries", () => {
    it("input immutability, deep-clone equivalence, determinism", () => {
      const input = {
        authority_source_bridge_set: {
          canonical_authority_state_set: {} as never,
          candidate_assessments: [
            mockBridgeAssessment({
              sources: [
                mockAuthoritySource({ canonical_authority_state_value: POSITIVE }),
                mockAuthoritySource({
                  canonical_authority_state_value: NEGATIVE,
                  binding_key: BINDING_KEY_B,
                  basis_key: BASIS_KEY_B,
                  state_key: STATE_KEY_B,
                }),
              ],
            }),
          ],
          has_authority_sources: true,
          has_positive_canonical_authority_state_sources: true,
          has_negative_canonical_authority_state_sources: true,
          has_unresolved_canonical_authority_state_sources: false,
          model_limitations: [],
        },
        authority_source_acceptance_criteria_set: {
          operational_eligibility_dimension_policy_set: {} as never,
          specification: { criteria: [] },
          candidate_assessments: [
            mockCriteriaAssessment({
              criterion: mockCriterion({
                accepted_canonical_authority_states: [
                  POSITIVE,
                  UNRESOLVED_POLICY,
                ],
              }),
            }),
          ],
          has_explicit_authority_source_acceptance_criteria: true,
          model_limitations: [],
        },
      };
      const before = deepClone(input);
      const a =
        buildAttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchSet(
          input
        );
      const b =
        buildAttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchSet(
          input
        );
      const c =
        buildAttentionObservationOperationalEligibilityAuthoritySourceAcceptanceMatchSet(
          deepClone(input)
        );
      assert.deepEqual(input, before);
      assert.deepEqual(a, b);
      assert.deepEqual(a, c);
    });

    it("schema 0.1.24; 117+120 only; no 118/119/084-direct/116-core; no aggregation/OE", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      assert.deepEqual(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_ACCEPTANCE_MATCH_MODEL_LIMITATIONS.slice(
          0,
          2
        ),
        [
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_POLICY_NOT_MODELED",
          "OPERATIONAL_ELIGIBILITY_AUTHORITY_SOURCE_AGGREGATION_READINESS_NOT_MODELED",
        ]
      );

      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-source-acceptance-match-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-authority-source-acceptance-match-types.ts"
        ),
        "utf8"
      );
      const stripComments = (s: string) =>
        s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
      const src = stripComments(core + types);
      const coreCode = stripComments(core);

      assert.ok(/authority-source-bridge-types/.test(core));
      assert.ok(/authority-source-acceptance-criteria-types/.test(core));
      assert.ok(!/authority-required-dimension-coverage/.test(src));
      assert.ok(!/authority-source-resolution-classification/.test(src));
      assert.ok(
        !/operational-eligibility-dimension-policy-types/.test(coreCode)
      );
      assert.ok(!/from ["'].*canonical-authority-state-core/.test(src));
      assert.ok(!/from ["'].*canonical-authority-state-types/.test(coreCode));
      assert.ok(!/\bProjectState\b/.test(src));
      assert.ok(!/Date\.now\(/.test(coreCode));
      assert.ok(!/"ACCEPTED"/.test(src));
      assert.ok(!/"REJECTED"/.test(src));
      assert.ok(!/"REPRESENTED"/.test(src));
      assert.ok(!/\bRESOLVED\b/.test(coreCode));
      assert.ok(!/ANY_SOURCE|ALL_SOURCES/.test(src));

      assert.equal(
        matchOperationalEligibilityAuthoritySourceAcceptance([NEGATIVE], NEGATIVE),
        "LISTED_AS_ACCEPTABLE"
      );
      assert.equal(
        matchOperationalEligibilityAuthoritySourceAcceptance(
          [UNRESOLVED_POLICY],
          UNRESOLVED_POLICY
        ),
        "LISTED_AS_ACCEPTABLE"
      );
      assert.equal(
        matchOperationalEligibilityAuthoritySourceAcceptance([NEGATIVE], POSITIVE),
        "NOT_LISTED_AS_ACCEPTABLE"
      );
    });
  });
});
