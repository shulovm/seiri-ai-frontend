/**
 * GROUND-084 — Observation Core XXXVIII / Explicit Observer Operational
 * Eligibility Dimension Policy Foundation
 *
 * Pure 048 Capability Requirement Set + explicit Operational Eligibility
 * Dimension Policy Specification (declaration only; no GROUND-083 current
 * Capability State / Permission / Authority / Resource / Feasibility states;
 * no eligibility result / effective Capability / can_execute).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_MODEL_LIMITATIONS,
  attentionObservationOperationalEligibilityDimensionPolicyKey,
  buildAttentionObservationCapabilityRequirementSetKey,
  buildAttentionObservationOperationalEligibilityDimensionPolicySet,
  buildCanonicalOperationalEligibilityRequiredDimensionSetKey,
  canonicalizeOperationalEligibilityRequiredDimensions,
  CANONICAL_OPERATIONAL_ELIGIBILITY_DIMENSION_ORDER,
  normalizeAttentionObservationOperationalEligibilityDimensionPolicySpecification,
} from "../reality/attention-observation-operational-eligibility-dimension-policy-core.js";
import type {
  AttentionObservationOperationalEligibilityDimension,
} from "../reality/attention-observation-operational-eligibility-dimension-policy-types.js";
import type {
  AttentionObservationCapabilityRequirementSetAssessment,
} from "../reality/attention-observation-capability-requirement-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const NEED_KEY = "need";
const NEED_KEY_2 = "need-b";
const REQ_KEY = "attention-observation-capability-requirement|need|inspect";
const REQ_KEY_2 =
  "attention-observation-capability-requirement|need|human_inspection";
const REQ_KEY_3 =
  "attention-observation-capability-requirement|need|satellite_imaging";

const CAPABILITY_STATE = "CAPABILITY_STATE" as const;
const PERMISSION = "PERMISSION" as const;
const AUTHORITY = "AUTHORITY" as const;
const RESOURCE_READINESS = "RESOURCE_READINESS" as const;
const FEASIBILITY = "FEASIBILITY" as const;

function assertNoOperationalEligibilitySemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"CAPABILITY_PRESENT"/.test(json));
  assert.ok(!/"CAPABILITY_ABSENT"/.test(json));
  assert.ok(!/"HAS_CAPABILITY"/.test(json));
  assert.ok(!/"LACKS_CAPABILITY"/.test(json));
  assert.ok(!/"has_capability"\s*:/.test(json));
  assert.ok(!/"effective_capability"/.test(json));
  assert.ok(!/"capability_state"\s*:/.test(json));
  assert.ok(!/"permission_state"\s*:/.test(json));
  assert.ok(!/"authority_state"\s*:/.test(json));
  assert.ok(!/"resource_readiness_state"\s*:/.test(json));
  assert.ok(!/"feasibility_state"\s*:/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
  assert.ok(!/"OPERATIONALLY_INELIGIBLE"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"coverage"/.test(json));
  assert.ok(!/"accepted"/.test(json));
  assert.ok(!/"composition"/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
}

function mockRequirementSet(options?: {
  candidates?: {
    candidate_key: string;
    status?:
      | "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      | "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED"
      | "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT";
    observation_need_key?: string;
    requirements?: { key: string; semantic: string }[];
  }[];
}): AttentionObservationCapabilityRequirementSetAssessment {
  const candidates = options?.candidates ?? [
    {
      candidate_key: "cand",
      status: "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT" as const,
      observation_need_key: NEED_KEY,
      requirements: [
        { key: REQ_KEY, semantic: "inspect" },
        { key: REQ_KEY_2, semantic: "human_inspection" },
      ],
    },
  ];

  return {
    planning_set: {} as never,
    specification: { requirements: [] },
    candidate_requirements: candidates.map((c) => {
      const status =
        c.status ?? "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT";
      const requirements = c.requirements ?? [];
      const observation_need_key = c.observation_need_key ?? NEED_KEY;
      const hasExplicit =
        status === "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT" &&
        requirements.length > 0;

      return {
        candidate_key: c.candidate_key,
        planning: {} as never,
        status,
        capability_requirement_basis:
          status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
            ? null
            : {
                observation_need_key,
                requirements: requirements.map((r) => ({
                  key: r.key,
                  observation_need_key,
                  capability_semantic_key: r.semantic,
                })),
              },
        has_explicit_capability_requirements: hasExplicit,
        model_limitations: [],
      };
    }),
    has_explicit_capability_requirements: candidates.some(
      (c) =>
        (c.status ?? "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT") ===
          "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT" &&
        (c.requirements?.length ?? 0) > 0
    ),
    model_limitations: [],
  };
}

function buildSet(
  policies: {
    candidate_key: string;
    required_dimensions: AttentionObservationOperationalEligibilityDimension[];
  }[],
  requirementSet: AttentionObservationCapabilityRequirementSetAssessment = mockRequirementSet()
) {
  return buildAttentionObservationOperationalEligibilityDimensionPolicySet({
    capability_requirement_set: requirementSet,
    specification: { policies },
  });
}

function firstCandidate(set: ReturnType<typeof buildSet>) {
  return set.candidate_assessments[0]!;
}

describe("GROUND-084 Explicit Operational Eligibility Dimension Policy", () => {
  describe("single-dimension and all-five policies", () => {
    it("Capability State only policy PRESENT; no current Capability State inspection", () => {
      const set = buildSet([
        {
          candidate_key: "cand",
          required_dimensions: [CAPABILITY_STATE],
        },
      ]);
      const assessment = firstCandidate(set);
      assert.equal(
        assessment.status,
        "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT"
      );
      assert.notEqual(
        assessment.operational_eligibility_dimension_policy,
        null
      );
      assert.deepEqual(
        assessment.operational_eligibility_dimension_policy!
          .required_dimensions,
        [CAPABILITY_STATE]
      );
      assertNoOperationalEligibilitySemantics(set);
    });

    it("Permission only policy valid; no automatic Capability dimension", () => {
      const set = buildSet([
        { candidate_key: "cand", required_dimensions: [PERMISSION] },
      ]);
      assert.deepEqual(
        firstCandidate(set).operational_eligibility_dimension_policy!
          .required_dimensions,
        [PERMISSION]
      );
      assert.ok(
        !firstCandidate(
          set
        ).operational_eligibility_dimension_policy!.required_dimensions.includes(
          CAPABILITY_STATE
        )
      );
    });

    it("Authority only policy valid", () => {
      const set = buildSet([
        { candidate_key: "cand", required_dimensions: [AUTHORITY] },
      ]);
      assert.deepEqual(
        firstCandidate(set).operational_eligibility_dimension_policy!
          .required_dimensions,
        [AUTHORITY]
      );
    });

    it("Resource readiness only policy valid", () => {
      const set = buildSet([
        { candidate_key: "cand", required_dimensions: [RESOURCE_READINESS] },
      ]);
      assert.deepEqual(
        firstCandidate(set).operational_eligibility_dimension_policy!
          .required_dimensions,
        [RESOURCE_READINESS]
      );
    });

    it("Feasibility only policy valid", () => {
      const set = buildSet([
        { candidate_key: "cand", required_dimensions: [FEASIBILITY] },
      ]);
      assert.deepEqual(
        firstCandidate(set).operational_eligibility_dimension_policy!
          .required_dimensions,
        [FEASIBILITY]
      );
    });

    it("all five explicitly declared valid; still no operational result", () => {
      const set = buildSet([
        {
          candidate_key: "cand",
          required_dimensions: [
            CAPABILITY_STATE,
            PERMISSION,
            AUTHORITY,
            RESOURCE_READINESS,
            FEASIBILITY,
          ],
        },
      ]);
      assert.deepEqual(
        firstCandidate(set).operational_eligibility_dimension_policy!
          .required_dimensions,
        CANONICAL_OPERATIONAL_ELIGIBILITY_DIMENSION_ORDER
      );
      assertNoOperationalEligibilitySemantics(set);
    });
  });

  describe("defaults / empty / absence firewalls", () => {
    it("no default all-five / Capability / Permission / Authority / Resource / Feasibility", () => {
      const set = buildSet([]);
      assert.equal(
        firstCandidate(set).status,
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
      );
      assert.equal(
        firstCandidate(set).operational_eligibility_dimension_policy,
        null
      );
      assert.equal(
        set.has_explicit_operational_eligibility_dimension_policies,
        false
      );
    });

    it("explicit empty policy PRESENT and != absent / != eligible / != can_execute", () => {
      const empty = buildSet([
        { candidate_key: "cand", required_dimensions: [] },
      ]);
      assert.equal(
        firstCandidate(empty).status,
        "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT"
      );
      assert.deepEqual(
        firstCandidate(empty).operational_eligibility_dimension_policy!
          .required_dimensions,
        []
      );
      assert.ok(
        firstCandidate(
          empty
        ).operational_eligibility_dimension_policy!.key.includes(
          "EMPTY_REQUIRED_DIMENSION_SET"
        )
      );
      assert.equal(
        empty.has_explicit_operational_eligibility_dimension_policies,
        true
      );

      const absent = buildSet([]);
      assert.notEqual(
        firstCandidate(empty).status,
        firstCandidate(absent).status
      );
      assertNoOperationalEligibilitySemantics(empty);
    });

    it("required != represented / positive / accepted / AND (semantic only)", () => {
      const set = buildSet([
        {
          candidate_key: "cand",
          required_dimensions: [CAPABILITY_STATE, PERMISSION],
        },
      ]);
      const policy =
        firstCandidate(set).operational_eligibility_dimension_policy!;
      assert.deepEqual(policy.required_dimensions, [
        CAPABILITY_STATE,
        PERMISSION,
      ]);
      assert.equal(
        Object.prototype.hasOwnProperty.call(policy, "accepted_dimensions"),
        false
      );
      assert.equal(
        Object.prototype.hasOwnProperty.call(policy, "composition"),
        false
      );
      assert.equal(
        Object.prototype.hasOwnProperty.call(policy, "and_dimensions"),
        false
      );
      assertNoOperationalEligibilitySemantics(set);
    });
  });

  describe("conflicts / duplicates / domain rejection", () => {
    it("exact duplicate dimension normalize; reorder same key", () => {
      const a = buildSet([
        {
          candidate_key: "cand",
          required_dimensions: [
            CAPABILITY_STATE,
            CAPABILITY_STATE,
            PERMISSION,
          ],
        },
      ]);
      const b = buildSet([
        {
          candidate_key: "cand",
          required_dimensions: [PERMISSION, CAPABILITY_STATE],
        },
      ]);
      assert.deepEqual(
        a.candidate_assessments[0]!.operational_eligibility_dimension_policy!
          .required_dimensions,
        b.candidate_assessments[0]!.operational_eligibility_dimension_policy!
          .required_dimensions
      );
      assert.equal(
        a.candidate_assessments[0]!.operational_eligibility_dimension_policy!
          .key,
        b.candidate_assessments[0]!.operational_eligibility_dimension_policy!
          .key
      );
    });

    it("unknown dimension rejects", () => {
      assert.throws(() =>
        canonicalizeOperationalEligibilityRequiredDimensions([
          "UNKNOWN_DIMENSION" as never,
        ])
      );
    });

    it("exact duplicate policy normalize; different dimension set reject; no silent merge", () => {
      const dup = buildSet([
        {
          candidate_key: "cand",
          required_dimensions: [CAPABILITY_STATE, PERMISSION],
        },
        {
          candidate_key: "cand",
          required_dimensions: [PERMISSION, CAPABILITY_STATE],
        },
      ]);
      assert.equal(dup.specification.policies.length, 1);

      assert.throws(() =>
        buildSet([
          {
            candidate_key: "cand",
            required_dimensions: [CAPABILITY_STATE, PERMISSION],
          },
          {
            candidate_key: "cand",
            required_dimensions: [RESOURCE_READINESS, FEASIBILITY],
          },
        ])
      );
    });

    it("zero Requirement / no planning / unknown context reject", () => {
      assert.throws(() =>
        buildSet(
          [
            {
              candidate_key: "cand",
              required_dimensions: [CAPABILITY_STATE],
            },
          ],
          mockRequirementSet({
            candidates: [
              {
                candidate_key: "cand",
                status: "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED",
                requirements: [],
              },
            ],
          })
        )
      );

      assert.throws(() =>
        buildSet(
          [
            {
              candidate_key: "cand",
              required_dimensions: [CAPABILITY_STATE],
            },
          ],
          mockRequirementSet({
            candidates: [
              {
                candidate_key: "cand",
                status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
                requirements: [],
              },
            ],
          })
        )
      );

      assert.throws(() =>
        buildSet([
          {
            candidate_key: "missing",
            required_dimensions: [CAPABILITY_STATE],
          },
        ])
      );
    });

    it("Verification / Capability Availability / Context Applicability not auto-added", () => {
      const set = buildSet([
        {
          candidate_key: "cand",
          required_dimensions: [CAPABILITY_STATE],
        },
      ]);
      const dims =
        firstCandidate(set).operational_eligibility_dimension_policy!
          .required_dimensions;
      assert.equal(dims.length, 1);
      assert.deepEqual(dims, [CAPABILITY_STATE]);
      assert.throws(() =>
        canonicalizeOperationalEligibilityRequiredDimensions([
          "VERIFICATION_EFFECTIVE_STATE" as never,
        ])
      );
      assert.throws(() =>
        canonicalizeOperationalEligibilityRequiredDimensions([
          "CAPABILITY_AVAILABILITY_EFFECTIVE_STATE" as never,
        ])
      );
      assert.throws(() =>
        canonicalizeOperationalEligibilityRequiredDimensions([
          "OBSERVATION_CONTEXT_APPLICABILITY" as never,
        ])
      );
    });
  });

  describe("identity / shared set key", () => {
    it("policy identity changes with dimension set / Requirement set; order invariant", () => {
      const capabilityOnly = firstCandidate(
        buildSet([
          {
            candidate_key: "cand",
            required_dimensions: [CAPABILITY_STATE],
          },
        ])
      ).operational_eligibility_dimension_policy!;
      const withPermission = firstCandidate(
        buildSet([
          {
            candidate_key: "cand",
            required_dimensions: [CAPABILITY_STATE, PERMISSION],
          },
        ])
      ).operational_eligibility_dimension_policy!;
      assert.notEqual(capabilityOnly.key, withPermission.key);

      const threeReq = firstCandidate(
        buildSet(
          [
            {
              candidate_key: "cand",
              required_dimensions: [CAPABILITY_STATE],
            },
          ],
          mockRequirementSet({
            candidates: [
              {
                candidate_key: "cand",
                requirements: [
                  { key: REQ_KEY, semantic: "inspect" },
                  { key: REQ_KEY_2, semantic: "human_inspection" },
                  { key: REQ_KEY_3, semantic: "satellite_imaging" },
                ],
              },
            ],
          })
        )
      ).operational_eligibility_dimension_policy!;
      assert.notEqual(capabilityOnly.key, threeReq.key);

      const reorderedReqs = firstCandidate(
        buildSet(
          [
            {
              candidate_key: "cand",
              required_dimensions: [CAPABILITY_STATE],
            },
          ],
          mockRequirementSet({
            candidates: [
              {
                candidate_key: "cand",
                requirements: [
                  { key: REQ_KEY_2, semantic: "human_inspection" },
                  { key: REQ_KEY, semantic: "inspect" },
                ],
              },
            ],
          })
        )
      ).operational_eligibility_dimension_policy!;
      assert.equal(capabilityOnly.key, reorderedReqs.key);
      assert.equal(
        capabilityOnly.capability_requirement_set_key,
        buildAttentionObservationCapabilityRequirementSetKey("cand", NEED_KEY, [
          REQ_KEY,
          REQ_KEY_2,
        ])
      );
    });

    it("empty policy has stable identity distinct from absence", () => {
      const empty = firstCandidate(
        buildSet([{ candidate_key: "cand", required_dimensions: [] }])
      ).operational_eligibility_dimension_policy!;
      assert.equal(
        buildCanonicalOperationalEligibilityRequiredDimensionSetKey([]),
        "EMPTY_REQUIRED_DIMENSION_SET"
      );
      assert.equal(
        empty.key,
        attentionObservationOperationalEligibilityDimensionPolicyKey(
          "cand",
          NEED_KEY,
          empty.capability_requirement_set_key,
          "EMPTY_REQUIRED_DIMENSION_SET"
        )
      );
    });

    it("canonical dimension order; CAPABILITY_STATE first != privileged result", () => {
      assert.deepEqual(CANONICAL_OPERATIONAL_ELIGIBILITY_DIMENSION_ORDER, [
        CAPABILITY_STATE,
        PERMISSION,
        AUTHORITY,
        RESOURCE_READINESS,
        FEASIBILITY,
      ]);
      const set = buildSet([
        {
          candidate_key: "cand",
          required_dimensions: [FEASIBILITY, AUTHORITY, PERMISSION],
        },
      ]);
      assert.deepEqual(
        firstCandidate(set).operational_eligibility_dimension_policy!
          .required_dimensions,
        [PERMISSION, AUTHORITY, FEASIBILITY]
      );
      assertNoOperationalEligibilitySemantics(set);
    });
  });

  describe("mixed candidates / statuses", () => {
    it("mixed context statuses preserved; empty-policy set boolean true", () => {
      const set = buildSet(
        [
          {
            candidate_key: "c1",
            required_dimensions: [CAPABILITY_STATE],
          },
          { candidate_key: "c2", required_dimensions: [] },
        ],
        mockRequirementSet({
          candidates: [
            {
              candidate_key: "c1",
              requirements: [{ key: REQ_KEY, semantic: "inspect" }],
            },
            {
              candidate_key: "c2",
              requirements: [{ key: REQ_KEY_2, semantic: "human_inspection" }],
            },
            {
              candidate_key: "c3",
              requirements: [{ key: REQ_KEY_3, semantic: "satellite_imaging" }],
            },
            {
              candidate_key: "c4",
              status: "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED",
              requirements: [],
            },
          ],
        })
      );

      assert.equal(
        set.candidate_assessments[0]!.status,
        "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT"
      );
      assert.equal(
        set.candidate_assessments[1]!.status,
        "EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_PRESENT"
      );
      assert.equal(
        set.candidate_assessments[2]!.status,
        "NO_EXPLICIT_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_DECLARED"
      );
      assert.equal(
        set.candidate_assessments[3]!.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
      assert.equal(
        set.has_explicit_operational_eligibility_dimension_policies,
        true
      );
    });

    it("no planning basis / no Requirements statuses without policy entries", () => {
      const set = buildSet(
        [],
        mockRequirementSet({
          candidates: [
            {
              candidate_key: "c1",
              status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
              requirements: [],
            },
            {
              candidate_key: "c2",
              status: "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED",
              requirements: [],
            },
          ],
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
      assert.equal(
        set.candidate_assessments[1]!.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
      assert.equal(
        set.candidate_assessments[0]!.operational_eligibility_dimension_policy,
        null
      );
      assert.equal(
        set.candidate_assessments[1]!.operational_eligibility_dimension_policy,
        null
      );
    });
  });

  describe("determinism / immutability / isolation", () => {
    it("cross-Candidate / ObservationNeed isolation; specification reorder deepEqual", () => {
      const requirementSet = mockRequirementSet({
        candidates: [
          {
            candidate_key: "a",
            observation_need_key: NEED_KEY,
            requirements: [{ key: REQ_KEY, semantic: "inspect" }],
          },
          {
            candidate_key: "b",
            observation_need_key: NEED_KEY_2,
            requirements: [{ key: REQ_KEY_2, semantic: "human_inspection" }],
          },
        ],
      });
      const set = buildSet(
        [
          {
            candidate_key: "b",
            required_dimensions: [FEASIBILITY],
          },
          {
            candidate_key: "a",
            required_dimensions: [CAPABILITY_STATE],
          },
        ],
        requirementSet
      );
      assert.equal(set.specification.policies[0]!.candidate_key, "a");
      assert.equal(set.specification.policies[1]!.candidate_key, "b");
      assert.notEqual(
        set.candidate_assessments[0]!.operational_eligibility_dimension_policy!
          .key,
        set.candidate_assessments[1]!.operational_eligibility_dimension_policy!
          .key
      );
      assert.notEqual(
        set.candidate_assessments[0]!.operational_eligibility_dimension_policy!
          .capability_requirement_set_key,
        set.candidate_assessments[1]!.operational_eligibility_dimension_policy!
          .capability_requirement_set_key
      );
    });

    it("determinism, deep-clone, input immutability, no pointer identity", () => {
      const requirementSet = mockRequirementSet();
      const specification = {
        policies: [
          {
            candidate_key: "cand",
            required_dimensions: [FEASIBILITY, PERMISSION, CAPABILITY_STATE],
          },
        ],
      };
      const beforeReq = structuredClone(requirementSet);
      const beforeSpec = structuredClone(specification);
      const a = buildAttentionObservationOperationalEligibilityDimensionPolicySet(
        {
          capability_requirement_set: requirementSet,
          specification,
        }
      );
      const b = buildAttentionObservationOperationalEligibilityDimensionPolicySet(
        {
          capability_requirement_set: requirementSet,
          specification,
        }
      );
      assert.deepEqual(a, b);
      assert.deepEqual(requirementSet, beforeReq);
      assert.deepEqual(specification, beforeSpec);

      const cloned = {
        capability_requirement_set: structuredClone(requirementSet),
        specification: structuredClone(specification),
      };
      const c =
        buildAttentionObservationOperationalEligibilityDimensionPolicySet(
          cloned
        );
      assert.deepEqual(a, c);
      assert.notEqual(
        a.capability_requirement_set,
        cloned.capability_requirement_set
      );
    });
  });

  describe("static proofs / schema / model limitations", () => {
    it("fixed model limitation order", () => {
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_MODEL_LIMITATIONS[0],
        "OPERATIONAL_ELIGIBILITY_DIMENSION_STATE_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_DIMENSION_POLICY_MODEL_LIMITATIONS.at(
          -1
        ),
        "EXECUTION_NOT_MODELED"
      );
    });

    it("schema 0.1.24; 048-only runtime; no 083 / current-state / eligibility / execution", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-dimension-policy-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-dimension-policy-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(/capability_requirement_set/.test(core));
      assert.ok(
        /attention-observation-capability-requirement-set-identity/.test(core)
      );
      assert.ok(
        !/from ["'].*capability-state-core/.test(src)
      );
      assert.ok(
        !/from ["'].*capability-interpretation-core/.test(src)
      );
      assert.ok(
        !/from ["'].*capability-interpretation-policy-core/.test(src)
      );
      assert.ok(
        !/from ["'].*capability-requirement-set-evaluation-state-core/.test(src)
      );

      assert.ok(!/Date\.now\(/.test(core));
      assert.ok(!/new Date\(/.test(core));
      assert.ok(!/performance\.now\(/.test(core));
      assert.ok(!/\bsaveProject\b/.test(core));
      assert.ok(!/\bapplyPatch\b/.test(core));
      assert.ok(!/\bStatePatch\b/.test(core));
      assert.ok(!/\bProjectState\b/.test(core));

      assert.ok(!/"CAPABILITY_PRESENT"/.test(core));
      assert.ok(!/"CAPABILITY_ABSENT"/.test(core));
      assert.ok(!/\bCAPABILITY_PRESENT\b/.test(core));
      assert.ok(!/\bCAPABILITY_ABSENT\b/.test(core));
      assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(src));
      assert.ok(!/"OPERATIONALLY_INELIGIBLE"/.test(src));
      assert.ok(!/"can_execute"/.test(src));
      assert.ok(!/"effective_capability"/.test(src));
      assert.ok(!/REQUIRE_ALL_OPERATIONAL_DIMENSIONS_RESOLVED/.test(src));
      assert.ok(!/\bpermission_state\s*:/.test(src));
      assert.ok(!/\bauthority_state\s*:/.test(src));
      assert.ok(!/\bresource_readiness_state\s*:/.test(src));
      assert.ok(!/\bfeasibility_state\s*:/.test(src));
      assert.ok(!/\bcapability_state\s*:/.test(src));
      assert.ok(!/selectObserver|assignObserver|dispatchObservation|scheduleObservation/.test(src));
    });

    it("normalize rejects empty candidate key", () => {
      assert.throws(() =>
        normalizeAttentionObservationOperationalEligibilityDimensionPolicySpecification(
          mockRequirementSet(),
          {
            policies: [
              {
                candidate_key: "  ",
                required_dimensions: [CAPABILITY_STATE],
              },
            ],
          }
        )
      );
    });
  });
});
