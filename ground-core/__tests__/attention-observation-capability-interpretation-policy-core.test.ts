/**
 * GROUND-081 — Observation Core XXXV / Explicit Capability Interpretation
 * Policy Foundation
 *
 * Pure 048 Capability Requirement Set + explicit Capability Interpretation
 * Policy Specification (declaration only; no 080 current Evaluation State /
 * no Capability Interpretation Basis / no Capability State).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_CAPABILITY_INTERPRETATION_POLICY_MODEL_LIMITATIONS,
  attentionObservationCapabilityInterpretationPolicyKey,
  buildAttentionObservationCapabilityInterpretationPolicySet,
  buildAttentionObservationCapabilityRequirementSetKey,
  buildCanonicalCapabilityInterpretationMappingSetKey,
  canonicalizeCapabilityInterpretationMappings,
  CANONICAL_CAPABILITY_INTERPRETATION_ORDER,
  CANONICAL_CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_ORDER,
  normalizeAttentionObservationCapabilityInterpretationPolicySpecification,
} from "../reality/attention-observation-capability-interpretation-policy-core.js";
import type {
  AttentionObservationCapabilityInterpretationMapping,
} from "../reality/attention-observation-capability-interpretation-policy-types.js";
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

const HOLDS =
  "CAPABILITY_REQUIREMENT_SET_COMPOSITION_CONDITION_HOLDS" as const;
const DOES_NOT_HOLD =
  "CAPABILITY_REQUIREMENT_SET_COMPOSITION_CONDITION_DOES_NOT_HOLD" as const;
const UNRESOLVED_COMPOSITION_POLICY =
  "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_POLICY_NOT_DECLARED" as const;
const UNRESOLVED_READINESS_POLICY =
  "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_NOT_DECLARED" as const;
const UNRESOLVED_READINESS_CONDITION =
  "UNRESOLVED_CAPABILITY_REQUIREMENT_SET_COMPOSITION_READINESS_POLICY_CONDITION_DOES_NOT_HOLD" as const;

const PRESENT = "INTERPRET_AS_CAPABILITY_PRESENT" as const;
const ABSENT = "INTERPRET_AS_CAPABILITY_ABSENT" as const;

function assertNoCurrentCapabilitySemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"CAPABILITY_PRESENT"/.test(json));
  assert.ok(!/"CAPABILITY_ABSENT"/.test(json));
  assert.ok(!/"HAS_CAPABILITY"/.test(json));
  assert.ok(!/"LACKS_CAPABILITY"/.test(json));
  assert.ok(!/"has_capability"\s*:/.test(json));
  assert.ok(!/"effective_capability"/.test(json));
  assert.ok(!/"evaluation_state_basis"/.test(json));
  assert.ok(!/"composition_result_basis"/.test(json));
  assert.ok(!/"capability_interpretation_basis"/.test(json));
  assert.ok(!/"capability_state"\s*:/.test(json));
  assert.ok(!/"mapping_count"/.test(json));
  assert.ok(!/"coverage"/.test(json));
  assert.ok(!/"complete"/.test(json));
  assert.ok(!/"wildcard"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
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
    mappings: AttentionObservationCapabilityInterpretationMapping[];
  }[],
  requirementSet: AttentionObservationCapabilityRequirementSetAssessment = mockRequirementSet()
) {
  return buildAttentionObservationCapabilityInterpretationPolicySet({
    capability_requirement_set: requirementSet,
    specification: { policies },
  });
}

function firstCandidate(set: ReturnType<typeof buildSet>) {
  return set.candidate_assessments[0]!;
}

describe("GROUND-081 Explicit Capability Interpretation Policy", () => {
  describe("baseline mappings", () => {
    it("HOLDS → PRESENT policy baseline PRESENT; no current Capability result", () => {
      const set = buildSet([
        {
          candidate_key: "cand",
          mappings: [{ evaluation_state: HOLDS, interpretation: PRESENT }],
        },
      ]);
      const assessment = firstCandidate(set);
      assert.equal(
        assessment.status,
        "EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_PRESENT"
      );
      assert.notEqual(assessment.capability_interpretation_policy, null);
      assert.deepEqual(assessment.capability_interpretation_policy!.mappings, [
        { evaluation_state: HOLDS, interpretation: PRESENT },
      ]);
      assertNoCurrentCapabilitySemantics(set);
    });

    it("DOES_NOT_HOLD → ABSENT baseline", () => {
      const set = buildSet([
        {
          candidate_key: "cand",
          mappings: [
            { evaluation_state: DOES_NOT_HOLD, interpretation: ABSENT },
          ],
        },
      ]);
      assert.equal(
        firstCandidate(set).status,
        "EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_PRESENT"
      );
      assert.deepEqual(
        firstCandidate(set).capability_interpretation_policy!.mappings,
        [{ evaluation_state: DOES_NOT_HOLD, interpretation: ABSENT }]
      );
    });

    it("typical two-mapping policy; no implied second mapping from HOLDS alone", () => {
      const two = buildSet([
        {
          candidate_key: "cand",
          mappings: [
            { evaluation_state: HOLDS, interpretation: PRESENT },
            { evaluation_state: DOES_NOT_HOLD, interpretation: ABSENT },
          ],
        },
      ]);
      assert.equal(
        two.candidate_assessments[0]!.capability_interpretation_policy!
          .mappings.length,
        2
      );

      const onlyHolds = buildSet([
        {
          candidate_key: "cand",
          mappings: [{ evaluation_state: HOLDS, interpretation: PRESENT }],
        },
      ]);
      assert.deepEqual(
        onlyHolds.candidate_assessments[0]!.capability_interpretation_policy!
          .mappings,
        [{ evaluation_state: HOLDS, interpretation: PRESENT }]
      );
    });

    it("unusual HOLDS→ABSENT and DOES_NOT_HOLD→PRESENT allowed", () => {
      const set = buildSet([
        {
          candidate_key: "cand",
          mappings: [
            { evaluation_state: HOLDS, interpretation: ABSENT },
            { evaluation_state: DOES_NOT_HOLD, interpretation: PRESENT },
          ],
        },
      ]);
      assert.deepEqual(
        firstCandidate(set).capability_interpretation_policy!.mappings,
        [
          { evaluation_state: HOLDS, interpretation: ABSENT },
          { evaluation_state: DOES_NOT_HOLD, interpretation: PRESENT },
        ]
      );
    });

    it("all unresolved states may map to PRESENT or ABSENT", () => {
      for (const state of [
        UNRESOLVED_COMPOSITION_POLICY,
        UNRESOLVED_READINESS_POLICY,
        UNRESOLVED_READINESS_CONDITION,
      ] as const) {
        for (const interpretation of [PRESENT, ABSENT] as const) {
          const set = buildSet([
            {
              candidate_key: "cand",
              mappings: [{ evaluation_state: state, interpretation }],
            },
          ]);
          assert.equal(
            firstCandidate(set).status,
            "EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_PRESENT"
          );
          assert.deepEqual(
            firstCandidate(set).capability_interpretation_policy!.mappings,
            [{ evaluation_state: state, interpretation }]
          );
        }
      }
    });

    it("all five states mapped is valid; no current matching", () => {
      const set = buildSet([
        {
          candidate_key: "cand",
          mappings: CANONICAL_CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_ORDER.map(
            (evaluation_state, i) => ({
              evaluation_state,
              interpretation: i % 2 === 0 ? PRESENT : ABSENT,
            })
          ),
        },
      ]);
      assert.equal(
        firstCandidate(set).capability_interpretation_policy!.mappings.length,
        5
      );
      assertNoCurrentCapabilitySemantics(set);
    });
  });

  describe("defaults / empty / absence firewalls", () => {
    it("no default HOLDS/DOES_NOT_HOLD/unresolved mappings when policy absent", () => {
      const set = buildSet([]);
      assert.equal(
        firstCandidate(set).status,
        "NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(firstCandidate(set).capability_interpretation_policy, null);
      assert.equal(set.has_explicit_capability_interpretation_policies, false);
    });

    it("explicit empty policy PRESENT and != absent / != Capability ABSENT", () => {
      const empty = buildSet([{ candidate_key: "cand", mappings: [] }]);
      assert.equal(
        firstCandidate(empty).status,
        "EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_PRESENT"
      );
      assert.deepEqual(
        firstCandidate(empty).capability_interpretation_policy!.mappings,
        []
      );
      assert.ok(
        firstCandidate(
          empty
        ).capability_interpretation_policy!.key.includes("EMPTY_MAPPING_SET")
      );

      const absent = buildSet([]);
      assert.notEqual(
        firstCandidate(empty).status,
        firstCandidate(absent).status
      );
      assertNoCurrentCapabilitySemantics(empty);
    });

    it("partial mapping set valid; no completeness requirement", () => {
      const set = buildSet([
        {
          candidate_key: "cand",
          mappings: [{ evaluation_state: HOLDS, interpretation: PRESENT }],
        },
      ]);
      assert.equal(
        firstCandidate(set).capability_interpretation_policy!.mappings.length,
        1
      );
    });
  });

  describe("conflicts / duplicates / domain rejection", () => {
    it("exact duplicate mapping normalize; reorder same key", () => {
      const a = buildSet([
        {
          candidate_key: "cand",
          mappings: [
            { evaluation_state: HOLDS, interpretation: PRESENT },
            { evaluation_state: HOLDS, interpretation: PRESENT },
            { evaluation_state: DOES_NOT_HOLD, interpretation: ABSENT },
          ],
        },
      ]);
      const b = buildSet([
        {
          candidate_key: "cand",
          mappings: [
            { evaluation_state: DOES_NOT_HOLD, interpretation: ABSENT },
            { evaluation_state: HOLDS, interpretation: PRESENT },
          ],
        },
      ]);
      assert.deepEqual(
        a.candidate_assessments[0]!.capability_interpretation_policy!.mappings,
        b.candidate_assessments[0]!.capability_interpretation_policy!.mappings
      );
      assert.equal(
        a.candidate_assessments[0]!.capability_interpretation_policy!.key,
        b.candidate_assessments[0]!.capability_interpretation_policy!.key
      );
    });

    it("conflicting mapping for same state rejects", () => {
      assert.throws(() =>
        buildSet([
          {
            candidate_key: "cand",
            mappings: [
              { evaluation_state: HOLDS, interpretation: PRESENT },
              { evaluation_state: HOLDS, interpretation: ABSENT },
            ],
          },
        ])
      );
    });

    it("exact duplicate policy normalize; different mapping set reject; no silent merge", () => {
      const dup = buildSet([
        {
          candidate_key: "cand",
          mappings: [{ evaluation_state: HOLDS, interpretation: PRESENT }],
        },
        {
          candidate_key: "cand",
          mappings: [{ evaluation_state: HOLDS, interpretation: PRESENT }],
        },
      ]);
      assert.equal(dup.specification.policies.length, 1);

      assert.throws(() =>
        buildSet([
          {
            candidate_key: "cand",
            mappings: [{ evaluation_state: HOLDS, interpretation: PRESENT }],
          },
          {
            candidate_key: "cand",
            mappings: [
              { evaluation_state: DOES_NOT_HOLD, interpretation: ABSENT },
            ],
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
              mappings: [{ evaluation_state: HOLDS, interpretation: PRESENT }],
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
              mappings: [{ evaluation_state: HOLDS, interpretation: PRESENT }],
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
            mappings: [{ evaluation_state: HOLDS, interpretation: PRESENT }],
          },
        ])
      );
    });

    it("unknown Evaluation State / interpretation reject", () => {
      assert.throws(() =>
        canonicalizeCapabilityInterpretationMappings([
          {
            evaluation_state: "UNKNOWN_STATE" as never,
            interpretation: PRESENT,
          },
        ])
      );
      assert.throws(() =>
        canonicalizeCapabilityInterpretationMappings([
          {
            evaluation_state: HOLDS,
            interpretation: "INTERPRET_AS_CAPABLE" as never,
          },
        ])
      );
    });
  });

  describe("identity / shared set key", () => {
    it("policy identity changes with interpretation / mapping set / Requirement set", () => {
      const holdsPresent = firstCandidate(
        buildSet([
          {
            candidate_key: "cand",
            mappings: [{ evaluation_state: HOLDS, interpretation: PRESENT }],
          },
        ])
      ).capability_interpretation_policy!;
      const holdsAbsent = firstCandidate(
        buildSet([
          {
            candidate_key: "cand",
            mappings: [{ evaluation_state: HOLDS, interpretation: ABSENT }],
          },
        ])
      ).capability_interpretation_policy!;
      assert.notEqual(holdsPresent.key, holdsAbsent.key);

      const two = firstCandidate(
        buildSet([
          {
            candidate_key: "cand",
            mappings: [
              { evaluation_state: HOLDS, interpretation: PRESENT },
              { evaluation_state: DOES_NOT_HOLD, interpretation: ABSENT },
            ],
          },
        ])
      ).capability_interpretation_policy!;
      assert.notEqual(holdsPresent.key, two.key);

      const threeReq = firstCandidate(
        buildSet(
          [
            {
              candidate_key: "cand",
              mappings: [{ evaluation_state: HOLDS, interpretation: PRESENT }],
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
      ).capability_interpretation_policy!;
      assert.notEqual(holdsPresent.key, threeReq.key);

      const reorderedReqs = firstCandidate(
        buildSet(
          [
            {
              candidate_key: "cand",
              mappings: [{ evaluation_state: HOLDS, interpretation: PRESENT }],
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
      ).capability_interpretation_policy!;
      assert.equal(holdsPresent.key, reorderedReqs.key);
      assert.equal(
        holdsPresent.capability_requirement_set_key,
        buildAttentionObservationCapabilityRequirementSetKey("cand", NEED_KEY, [
          REQ_KEY,
          REQ_KEY_2,
        ])
      );
    });

    it("empty policy has stable identity distinct from absence", () => {
      const empty = firstCandidate(
        buildSet([{ candidate_key: "cand", mappings: [] }])
      ).capability_interpretation_policy!;
      assert.equal(
        buildCanonicalCapabilityInterpretationMappingSetKey([]),
        "EMPTY_MAPPING_SET"
      );
      assert.equal(
        empty.key,
        attentionObservationCapabilityInterpretationPolicyKey(
          "cand",
          NEED_KEY,
          empty.capability_requirement_set_key,
          "EMPTY_MAPPING_SET"
        )
      );
    });

    it("canonical Evaluation State / interpretation order; no preference", () => {
      assert.deepEqual(CANONICAL_CAPABILITY_REQUIREMENT_SET_EVALUATION_STATE_ORDER, [
        HOLDS,
        DOES_NOT_HOLD,
        UNRESOLVED_COMPOSITION_POLICY,
        UNRESOLVED_READINESS_POLICY,
        UNRESOLVED_READINESS_CONDITION,
      ]);
      assert.deepEqual(CANONICAL_CAPABILITY_INTERPRETATION_ORDER, [
        PRESENT,
        ABSENT,
      ]);
    });
  });

  describe("mixed candidates / statuses", () => {
    it("mixed context statuses preserved; set boolean true", () => {
      const set = buildSet(
        [
          {
            candidate_key: "c1",
            mappings: [{ evaluation_state: HOLDS, interpretation: PRESENT }],
          },
          { candidate_key: "c2", mappings: [] },
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
        "EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_PRESENT"
      );
      assert.equal(
        set.candidate_assessments[1]!.status,
        "EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_PRESENT"
      );
      assert.equal(
        set.candidate_assessments[2]!.status,
        "NO_EXPLICIT_CAPABILITY_INTERPRETATION_POLICY_DECLARED"
      );
      assert.equal(
        set.candidate_assessments[3]!.status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
      assert.equal(set.has_explicit_capability_interpretation_policies, true);
      assertNoCurrentCapabilitySemantics(set);
    });

    it("no planning basis / no Requirements without policy remain NOT_APPLICABLE", () => {
      const set = buildSet(
        [],
        mockRequirementSet({
          candidates: [
            {
              candidate_key: "np",
              status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
            },
            {
              candidate_key: "nr",
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
            mappings: [{ evaluation_state: DOES_NOT_HOLD, interpretation: ABSENT }],
          },
          {
            candidate_key: "a",
            mappings: [{ evaluation_state: HOLDS, interpretation: PRESENT }],
          },
        ],
        requirementSet
      );
      assert.equal(set.specification.policies[0]!.candidate_key, "a");
      assert.equal(set.specification.policies[1]!.candidate_key, "b");
      assert.notEqual(
        set.candidate_assessments[0]!.capability_interpretation_policy!.key,
        set.candidate_assessments[1]!.capability_interpretation_policy!.key
      );
    });

    it("determinism, deep-clone, input immutability, no pointer identity", () => {
      const requirementSet = mockRequirementSet();
      const specification = {
        policies: [
          {
            candidate_key: "cand",
            mappings: [
              { evaluation_state: DOES_NOT_HOLD, interpretation: ABSENT },
              { evaluation_state: HOLDS, interpretation: PRESENT },
            ],
          },
        ],
      };
      const beforeReq = structuredClone(requirementSet);
      const beforeSpec = structuredClone(specification);
      const a = buildAttentionObservationCapabilityInterpretationPolicySet({
        capability_requirement_set: requirementSet,
        specification,
      });
      const b = buildAttentionObservationCapabilityInterpretationPolicySet({
        capability_requirement_set: requirementSet,
        specification,
      });
      assert.deepEqual(a, b);
      assert.deepEqual(requirementSet, beforeReq);
      assert.deepEqual(specification, beforeSpec);

      const cloned = {
        capability_requirement_set: structuredClone(requirementSet),
        specification: structuredClone(specification),
      };
      const c =
        buildAttentionObservationCapabilityInterpretationPolicySet(cloned);
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
        ATTENTION_OBSERVATION_CAPABILITY_INTERPRETATION_POLICY_MODEL_LIMITATIONS[0],
        "CAPABILITY_INTERPRETATION_EVALUATION_NOT_MODELED"
      );
      assert.equal(
        ATTENTION_OBSERVATION_CAPABILITY_INTERPRETATION_POLICY_MODEL_LIMITATIONS.at(
          -1
        ),
        "EXECUTION_NOT_MODELED"
      );
    });

    it("schema 0.1.24; 048-only runtime; type-only 080; no current matching", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-interpretation-policy-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-interpretation-policy-types.ts"
        ),
        "utf8"
      );
      const src = core + types;

      assert.ok(/capability_requirement_set/.test(core));
      assert.ok(/import type/.test(core));
      assert.ok(
        /attention-observation-capability-requirement-set-evaluation-state-types/.test(
          src
        )
      );
      assert.ok(
        !/attention-observation-capability-requirement-set-evaluation-state-core/.test(
          src
        )
      );
      assert.ok(
        !/from ["'].*set-composition-result-core/.test(src)
      );
      assert.ok(
        !/from ["'].*set-composition-readiness-core/.test(src)
      );
      assert.ok(
        !/from ["'].*set-composition-policy-core/.test(src)
      );
      assert.ok(
        !/from ["'].*capability-requirement-satisfaction-core/.test(src)
      );

      assert.ok(!/Date\.now\(/.test(core));
      assert.ok(!/new Date\(/.test(core));
      assert.ok(!/performance\.now\(/.test(core));
      assert.ok(!/\bsaveProject\b/.test(core));
      assert.ok(!/\bapplyPatch\b/.test(core));
      assert.ok(!/\bStatePatch\b/.test(core));
      assert.ok(!/\bProjectState\b/.test(core));

      assert.ok(!/evaluation_state_basis/.test(core));
      assert.ok(!/composition_result_basis/.test(core));
      assert.ok(!/currentState/.test(core));
      assert.ok(!/current_evaluation_state/.test(core));
      assert.ok(!/\.find\(/.test(core));
      assert.ok(!/"HAS_CAPABILITY"/.test(core));
      assert.ok(!/"LACKS_CAPABILITY"/.test(core));
      assert.ok(!/"CAPABILITY_PRESENT"/.test(core));
      assert.ok(!/"CAPABILITY_ABSENT"/.test(core));
      assert.ok(!/ANY_UNRESOLVED/.test(core));
      assert.ok(!/\bDEFAULT\b/.test(core));
    });

    it("normalize rejects empty candidate key", () => {
      assert.throws(() =>
        normalizeAttentionObservationCapabilityInterpretationPolicySpecification(
          mockRequirementSet(),
          {
            policies: [
              {
                candidate_key: "  ",
                mappings: [],
              },
            ],
          }
        )
      );
    });
  });
});
