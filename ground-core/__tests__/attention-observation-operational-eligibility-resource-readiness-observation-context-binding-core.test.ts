/**
 * GROUND-133 — Observation Core LXXXVII / Operational Eligibility
 * RESOURCE_READINESS Observation Context Binding Foundation
 *
 * Pure GROUND-132 Observation Resource Requirement Set + explicit Binding
 * Specification (relational declaration only; no ResourceDeclaration lookup).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDING_MODEL_LIMITATIONS,
  attentionObservationOperationalEligibilityResourceReadinessObservationContextBindingKey,
  assessAttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBinding,
  buildAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
  normalizeAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSpecification,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-observation-context-binding-core.js";
import type {
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSpecification,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-observation-context-binding-types.js";
import type {
  AttentionCandidateObservationResourceRequirementSetAssessment,
  AttentionObservationResourceRequirement,
  AttentionObservationResourceRequirementSetAssessment,
} from "../reality/attention-observation-resource-requirement-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const CAND = "cand";
const CAND_2 = "cand-b";
const CAND_OUTER = "cand-outer";
const NEED_KEY = "need";
const CAP_SET_KEY = "cap-set-key";
const RD1 = "rd-00000000-0000-4000-8000-000000000001";
const RD2 = "rd-00000000-0000-4000-8000-000000000002";
const RD3 = "rd-00000000-0000-4000-8000-000000000003";
const RD_DANGLING = "rd-dangling-unknown-id";

function mockResourceRequirement(
  overrides: Partial<AttentionObservationResourceRequirement> & {
    key: string;
  }
): AttentionObservationResourceRequirement {
  return {
    candidate_key: CAND,
    observation_need_key: NEED_KEY,
    capability_requirement_set_key: CAP_SET_KEY,
    resource_key: "SENSOR_POWER",
    unit: "WH",
    resource_scope: { kind: "UNSCOPED" },
    required_amount: { kind: "POINT", value: 50 },
    valid_from: null,
    valid_until: null,
    ...overrides,
  };
}

const R1 = mockResourceRequirement({ key: "req-r1", resource_key: "SENSOR_POWER" });
const R2 = mockResourceRequirement({ key: "req-r2", resource_key: "NETWORK_BANDWIDTH", unit: "MBPS" });
const R3 = mockResourceRequirement({ key: "req-r3", resource_key: "COMPUTE", unit: "GB" });

function mock132Candidate(
  overrides: Partial<AttentionCandidateObservationResourceRequirementSetAssessment> & {
    candidate_key: string;
  }
): AttentionCandidateObservationResourceRequirementSetAssessment {
  const base: AttentionCandidateObservationResourceRequirementSetAssessment = {
    candidate_key: overrides.candidate_key,
    capability_requirement_assessment: {} as never,
    status: "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT",
    resource_requirements: [R1, R2, R3],
    has_explicit_observation_resource_requirement_set: true,
    has_observation_resource_requirements: true,
    model_limitations: [],
  };
  return { ...base, ...overrides };
}

function mock132Set(options?: {
  candidates?: (Partial<AttentionCandidateObservationResourceRequirementSetAssessment> & {
    candidate_key: string;
  })[];
}): AttentionObservationResourceRequirementSetAssessment {
  const candidates = options?.candidates ?? [{ candidate_key: CAND }];
  return {
    capability_requirement_set: {} as never,
    specification: { candidate_requirement_sets: [] },
    candidate_assessments: candidates.map((c) =>
      mock132Candidate(c as AttentionCandidateObservationResourceRequirementSetAssessment)
    ),
    has_explicit_observation_resource_requirement_sets: true,
    has_observation_resource_requirements: true,
    model_limitations: [],
  };
}

function build133(
  observationResourceRequirementSet: AttentionObservationResourceRequirementSetAssessment = mock132Set(),
  specification: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSpecification = {
    candidate_binding_sets: [],
  }
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment(
    {
      observation_resource_requirement_set: observationResourceRequirementSet,
      specification,
    }
  );
}

function assertNoReadinessSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"RESOURCE_READY"/.test(json));
  assert.ok(!/"RESOURCE_NOT_READY"/.test(json));
  assert.ok(!/"selected_resource"/.test(json));
  assert.ok(!/"assigned_resource"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"AMBIGUOUS_RESOURCE_BINDING"/.test(json));
  assert.ok(!/"RESOURCE_CONTENTION"/.test(json));
}

describe("GROUND-133 RESOURCE_READINESS Observation Context Binding", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.24");
  });

  it("model limitations fixed order", () => {
    assert.deepEqual(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDING_MODEL_LIMITATIONS,
      [
        "RESOURCE_DECLARATION_EXISTENCE_NOT_EVALUATED",
        "RESOURCE_REQUIREMENT_TO_DECLARATION_MATCH_NOT_EVALUATED",
        "OBSERVATION_RESOURCE_READINESS_EVALUATION_INSTANT_NOT_MODELED",
        "OBSERVATION_RESOURCE_EVIDENCE_ASSESSMENT_NOT_MODELED",
        "OBSERVATION_RESOURCE_QUANTITY_SUFFICIENCY_NOT_MODELED",
        "OBSERVATION_RESOURCE_UNIT_COMPATIBILITY_NOT_MODELED",
        "OBSERVATION_RESOURCE_SUBSTITUTION_NOT_MODELED",
        "OBSERVATION_RESOURCE_PARTIAL_FULFILLMENT_NOT_MODELED",
        "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_CANONICAL_STATE_NOT_MODELED",
        "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_SOURCE_BRIDGE_NOT_MODELED",
        "OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_DIMENSION_SATISFACTION_NOT_MODELED",
        "OPERATIONAL_ELIGIBILITY_FEASIBILITY_SOURCE_BRIDGE_NOT_MODELED",
        "OPERATIONAL_ELIGIBILITY_CROSS_DIMENSION_COMPOSITION_NOT_MODELED",
        "OPERATIONAL_ELIGIBILITY_STATE_NOT_MODELED",
        "CAN_EXECUTE_NOT_MODELED",
        "EXECUTION_NOT_MODELED",
      ]
    );
  });

  describe("binding declaration", () => {
    it("one requirement / one binding", () => {
      const set = build133(mock132Set(), {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD1,
              },
            ],
          },
        ],
      });
      const cand = set.candidate_assessments[0]!;
      assert.equal(
        cand.status,
        "RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_PRESENT"
      );
      assert.equal(cand.bindings.length, 1);
      assert.equal(cand.bindings[0]!.resource_declaration_id, RD1);
      assertNoReadinessSemantics(set);
    });

    it("one requirement / multiple bindings preserved", () => {
      const set = build133(mock132Set(), {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD1,
              },
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD2,
              },
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD3,
              },
            ],
          },
        ],
      });
      const r1Assessment = set.candidate_assessments[0]!.requirement_binding_assessments.find(
        (a) => a.observation_resource_requirement_key === R1.key
      )!;
      assert.equal(r1Assessment.bindings.length, 3);
    });

    it("multiple requirements / independent bindings", () => {
      const set = build133(mock132Set(), {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD1,
              },
              {
                observation_resource_requirement_key: R2.key,
                resource_declaration_id: RD2,
              },
            ],
          },
        ],
      });
      assert.equal(set.candidate_assessments[0]!.bindings.length, 2);
      assert.equal(
        set.candidate_assessments[0]!.requirement_binding_assessments.length,
        3
      );
    });

    it("requirement with zero bindings still has requirement-binding assessment", () => {
      const set = build133(mock132Set(), {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD1,
              },
            ],
          },
        ],
      });
      const r2Assessment = set.candidate_assessments[0]!.requirement_binding_assessments.find(
        (a) => a.observation_resource_requirement_key === R2.key
      )!;
      assert.equal(r2Assessment.bindings.length, 0);
      assert.equal(r2Assessment.has_resource_readiness_observation_context_bindings, false);
    });

    it("partial binding coverage without readiness verdict", () => {
      const set = build133(mock132Set(), {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD1,
              },
              {
                observation_resource_requirement_key: R3.key,
                resource_declaration_id: RD3,
              },
            ],
          },
        ],
      });
      assert.equal(
        set.candidate_assessments[0]!.status,
        "RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_PRESENT"
      );
      const r2 = set.candidate_assessments[0]!.requirement_binding_assessments.find(
        (a) => a.observation_resource_requirement_key === R2.key
      )!;
      assert.equal(r2!.bindings.length, 0);
      assertNoReadinessSemantics(set);
    });

    it("exact duplicate binding normalizes", () => {
      const spec = {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD1,
              },
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD1,
              },
            ],
          },
        ],
      };
      const normalized =
        normalizeAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSpecification(
          mock132Set(),
          spec
        );
      assert.equal(normalized.candidate_binding_sets[0]!.bindings.length, 1);
    });

    it("same requirement / different ResourceDeclaration IDs preserved", () => {
      const set = build133(mock132Set(), {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD1,
              },
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD2,
              },
            ],
          },
        ],
      });
      assert.equal(
        set.candidate_assessments[0]!.requirement_binding_assessments.find(
          (a) => a.observation_resource_requirement_key === R1.key
        )!.bindings.length,
        2
      );
    });

    it("same ResourceDeclaration / different requirements preserved", () => {
      const set = build133(mock132Set(), {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD1,
              },
              {
                observation_resource_requirement_key: R2.key,
                resource_declaration_id: RD1,
              },
            ],
          },
        ],
      });
      assert.equal(set.candidate_assessments[0]!.bindings.length, 2);
    });

    it("dangling resource_declaration_id accepted", () => {
      const set = build133(mock132Set(), {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD_DANGLING,
              },
            ],
          },
        ],
      });
      assert.equal(set.candidate_assessments[0]!.bindings[0]!.resource_declaration_id, RD_DANGLING);
    });
  });

  describe("explicit empty vs absence", () => {
    it("requirement-set absent preserves status and zero bindings", () => {
      const set = build133(
        mock132Set({
          candidates: [
            {
              candidate_key: CAND,
              status: "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED",
              resource_requirements: [],
              has_explicit_observation_resource_requirement_set: false,
              has_observation_resource_requirements: false,
            },
          ],
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED"
      );
      assert.equal(set.candidate_assessments[0]!.bindings.length, 0);
    });

    it("explicit empty requirement set EMPTY status", () => {
      const set = build133(
        mock132Set({
          candidates: [
            {
              candidate_key: CAND,
              status: "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT",
              resource_requirements: [],
              has_explicit_observation_resource_requirement_set: true,
              has_observation_resource_requirements: false,
            },
          ],
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_EMPTY"
      );
      assert.equal(set.candidate_assessments[0]!.bindings.length, 0);
    });

    it("explicit empty != absence", () => {
      const empty = build133(
        mock132Set({
          candidates: [
            {
              candidate_key: CAND,
              status: "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT",
              resource_requirements: [],
              has_explicit_observation_resource_requirement_set: true,
              has_observation_resource_requirements: false,
            },
          ],
        })
      );
      const absent = build133(
        mock132Set({
          candidates: [
            {
              candidate_key: CAND,
              status: "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED",
              resource_requirements: [],
              has_explicit_observation_resource_requirement_set: false,
              has_observation_resource_requirements: false,
            },
          ],
        })
      );
      assert.notEqual(
        empty.candidate_assessments[0]!.status,
        absent.candidate_assessments[0]!.status
      );
    });

    it("explicit empty + non-empty binding specification rejects", () => {
      assert.throws(
        () =>
          build133(
            mock132Set({
              candidates: [
                {
                  candidate_key: CAND,
                  status: "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT",
                  resource_requirements: [],
                  has_explicit_observation_resource_requirement_set: true,
                  has_observation_resource_requirements: false,
                },
              ],
            }),
            {
              candidate_binding_sets: [
                {
                  candidate_key: CAND,
                  bindings: [
                    {
                      observation_resource_requirement_key: "fake-key",
                      resource_declaration_id: RD1,
                    },
                  ],
                },
              ],
            }
          ),
        /Explicit empty Observation Resource Requirement set/
      );
    });

    it("requirement-set absent + non-empty binding specification rejects", () => {
      assert.throws(
        () =>
          build133(
            mock132Set({
              candidates: [
                {
                  candidate_key: CAND,
                  status: "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED",
                  resource_requirements: [],
                  has_explicit_observation_resource_requirement_set: false,
                  has_observation_resource_requirements: false,
                },
              ],
            }),
            {
              candidate_binding_sets: [
                {
                  candidate_key: CAND,
                  bindings: [
                    {
                      observation_resource_requirement_key: R1.key,
                      resource_declaration_id: RD1,
                    },
                  ],
                },
              ],
            }
          ),
        /Observation Resource Requirement set is not declared/
      );
    });
  });

  describe("zero bindings outcomes", () => {
    it("non-empty requirements + no candidate binding spec", () => {
      const set = build133(mock132Set(), { candidate_binding_sets: [] });
      assert.equal(
        set.candidate_assessments[0]!.status,
        "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
      );
      assert.equal(
        set.candidate_assessments[0]!.requirement_binding_assessments.length,
        3
      );
      for (const assessment of set.candidate_assessments[0]!
        .requirement_binding_assessments) {
        assert.equal(assessment.bindings.length, 0);
      }
    });

    it("non-empty requirements + explicit empty binding set same outcome", () => {
      const absentSpec = build133(mock132Set(), { candidate_binding_sets: [] });
      const emptySpec = build133(mock132Set(), {
        candidate_binding_sets: [{ candidate_key: CAND, bindings: [] }],
      });
      assert.equal(
        absentSpec.candidate_assessments[0]!.status,
        emptySpec.candidate_assessments[0]!.status
      );
      assert.deepEqual(
        absentSpec.candidate_assessments[0]!.bindings,
        emptySpec.candidate_assessments[0]!.bindings
      );
    });

    it("PRESENT does not require all requirements bound", () => {
      const set = build133(mock132Set(), {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD1,
              },
            ],
          },
        ],
      });
      assert.equal(
        set.candidate_assessments[0]!.status,
        "RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_PRESENT"
      );
      const unbound = set.candidate_assessments[0]!.requirement_binding_assessments.filter(
        (a) => !a.has_resource_readiness_observation_context_bindings
      );
      assert.ok(unbound.length >= 1);
    });
  });

  describe("validation", () => {
    it("unknown requirement key rejects", () => {
      assert.throws(
        () =>
          build133(mock132Set(), {
            candidate_binding_sets: [
              {
                candidate_key: CAND,
                bindings: [
                  {
                    observation_resource_requirement_key: "unknown-req",
                    resource_declaration_id: RD1,
                  },
                ],
              },
            ],
          }),
        /Unknown observation_resource_requirement_key/
      );
    });

    it("cross-candidate requirement key rejects", () => {
      const malformed = mockResourceRequirement({
        key: "req-malformed",
        candidate_key: CAND_2,
      });
      const set132 = mock132Set({
        candidates: [
          {
            candidate_key: CAND,
            resource_requirements: [R1, R2, R3, malformed],
          },
        ],
      });
      assert.throws(
        () =>
          build133(set132, {
            candidate_binding_sets: [
              {
                candidate_key: CAND,
                bindings: [
                  {
                    observation_resource_requirement_key: malformed.key,
                    resource_declaration_id: RD1,
                  },
                ],
              },
            ],
          }),
        /does not belong to candidate/
      );
    });

    it("unknown candidate rejects", () => {
      assert.throws(
        () =>
          build133(mock132Set(), {
            candidate_binding_sets: [
              {
                candidate_key: "unknown",
                bindings: [
                  {
                    observation_resource_requirement_key: R1.key,
                    resource_declaration_id: RD1,
                  },
                ],
              },
            ],
          }),
        /not found in Observation Resource Requirement set/
      );
    });

    it("outer candidate specification rejects", () => {
      assert.throws(
        () =>
          build133(
            mock132Set({
              candidates: [
                {
                  candidate_key: CAND_OUTER,
                  status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
                  resource_requirements: [],
                  has_explicit_observation_resource_requirement_set: false,
                  has_observation_resource_requirements: false,
                },
              ],
            }),
            {
              candidate_binding_sets: [
                {
                  candidate_key: CAND_OUTER,
                  bindings: [
                    {
                      observation_resource_requirement_key: R1.key,
                      resource_declaration_id: RD1,
                    },
                  ],
                },
              ],
            }
          ),
        /requires an applicable Observation Resource Requirement context/
      );
    });

    it("duplicate identical candidate binding-set normalizes", () => {
      const spec = {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD1,
              },
            ],
          },
          {
            candidate_key: CAND,
            bindings: [
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD1,
              },
            ],
          },
        ],
      };
      const normalized =
        normalizeAttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSpecification(
          mock132Set(),
          spec
        );
      assert.equal(normalized.candidate_binding_sets.length, 1);
    });

    it("competing candidate binding sets reject", () => {
      assert.throws(
        () =>
          build133(mock132Set(), {
            candidate_binding_sets: [
              {
                candidate_key: CAND,
                bindings: [
                  {
                    observation_resource_requirement_key: R1.key,
                    resource_declaration_id: RD1,
                  },
                ],
              },
              {
                candidate_key: CAND,
                bindings: [
                  {
                    observation_resource_requirement_key: R2.key,
                    resource_declaration_id: RD2,
                  },
                ],
              },
            ],
          }),
        /Conflicting RESOURCE_READINESS Observation Context Binding sets/
      );
    });
  });

  describe("order invariance", () => {
    it("binding order invariance", () => {
      const spec = {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              {
                observation_resource_requirement_key: R2.key,
                resource_declaration_id: RD2,
              },
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD1,
              },
            ],
          },
        ],
      };
      const a = build133(mock132Set(), spec);
      const b = build133(mock132Set(), {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [...spec.candidate_binding_sets[0]!.bindings].reverse(),
          },
        ],
      });
      assert.deepEqual(
        a.candidate_assessments[0]!.bindings.map((bnd) => bnd.key),
        b.candidate_assessments[0]!.bindings.map((bnd) => bnd.key)
      );
    });

    it("candidate specification order invariance", () => {
      const r1Cand2 = mockResourceRequirement({
        key: "req-r1-c2",
        candidate_key: CAND_2,
      });
      const set132 = mock132Set({
        candidates: [
          { candidate_key: CAND },
          {
            candidate_key: CAND_2,
            resource_requirements: [r1Cand2],
          },
        ],
      });
      const spec = {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD1,
              },
            ],
          },
          {
            candidate_key: CAND_2,
            bindings: [
              {
                observation_resource_requirement_key: r1Cand2.key,
                resource_declaration_id: RD2,
              },
            ],
          },
        ],
      };
      const a = build133(set132, spec);
      const b = build133(set132, {
        candidate_binding_sets: [...spec.candidate_binding_sets].reverse(),
      });
      assert.deepEqual(
        a.candidate_assessments.map((c) => c.bindings),
        b.candidate_assessments.map((c) => c.bindings)
      );
    });

    it("requirement ordering follows GROUND-132 semantics", () => {
      const set = build133(mock132Set(), {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              {
                observation_resource_requirement_key: R3.key,
                resource_declaration_id: RD3,
              },
            ],
          },
        ],
      });
      const keys = set.candidate_assessments[0]!.requirement_binding_assessments.map(
        (a) => a.observation_resource_requirement_key
      );
      assert.deepEqual(keys, [R1.key, R2.key, R3.key].sort());
    });
  });

  describe("identity", () => {
    it("binding identity field sensitivity", () => {
      const base = attentionObservationOperationalEligibilityResourceReadinessObservationContextBindingKey(
        CAND,
        NEED_KEY,
        CAP_SET_KEY,
        R1.key,
        RD1
      );
      const variants = [
        attentionObservationOperationalEligibilityResourceReadinessObservationContextBindingKey(
          "other",
          NEED_KEY,
          CAP_SET_KEY,
          R1.key,
          RD1
        ),
        attentionObservationOperationalEligibilityResourceReadinessObservationContextBindingKey(
          CAND,
          "other-need",
          CAP_SET_KEY,
          R1.key,
          RD1
        ),
        attentionObservationOperationalEligibilityResourceReadinessObservationContextBindingKey(
          CAND,
          NEED_KEY,
          "other-set",
          R1.key,
          RD1
        ),
        attentionObservationOperationalEligibilityResourceReadinessObservationContextBindingKey(
          CAND,
          NEED_KEY,
          CAP_SET_KEY,
          R2.key,
          RD1
        ),
        attentionObservationOperationalEligibilityResourceReadinessObservationContextBindingKey(
          CAND,
          NEED_KEY,
          CAP_SET_KEY,
          R1.key,
          RD2
        ),
      ];
      for (const variant of variants) {
        assert.notEqual(base, variant);
      }
    });
  });

  describe("readiness and resource firewalls (static)", () => {
    it("zero bindings != not ready and one binding != ready", () => {
      const noBindings = build133(mock132Set());
      const oneBinding = build133(mock132Set(), {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD1,
              },
            ],
          },
        ],
      });
      assertNoReadinessSemantics(noBindings);
      assertNoReadinessSemantics(oneBinding);
    });

    it("no ProjectState / ResourceDeclaration lookup in core", () => {
      const coreSrc = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-resource-readiness-observation-context-binding-core.ts"
        ),
        "utf8"
      );
      assert.ok(!/from ["'].*state-engine/.test(coreSrc));
      assert.ok(!/from ["'].*file-store/.test(coreSrc));
      assert.ok(!/from ["'].*resource-core/.test(coreSrc));
      assert.ok(!/from ["'].*feasibility-core/.test(coreSrc));
      assert.ok(!/from ["'].*intervention-core/.test(coreSrc));
      assert.ok(!/\bProjectState\b/.test(coreSrc));
      assert.ok(!/resource_declarations/.test(coreSrc));
      assert.ok(!/assessResource/.test(coreSrc));
      assert.ok(!/Date\.now\(/.test(coreSrc));
      assert.ok(!/new Date\(/.test(coreSrc));
      assert.ok(!/performance\.now\(/.test(coreSrc));
    });

    it("no conflict / alternative / allocation / reservation inference", () => {
      const coreSrc = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-resource-readiness-observation-context-binding-core.ts"
        ),
        "utf8"
      );
      assert.ok(!/AMBIGUOUS_RESOURCE_BINDING/.test(coreSrc));
      assert.ok(!/DOUBLE_ASSIGNED/.test(coreSrc));
      assert.ok(!/RESOURCE_CONTENTION/.test(coreSrc));
      assert.ok(!/selected_resource/.test(coreSrc));
      assert.ok(!/\ballocated\b/.test(coreSrc));
      assert.ok(!/\breservation\b/.test(coreSrc));
      assert.ok(!/RESOURCE_READY/.test(coreSrc));
    });
  });

  describe("determinism and immutability", () => {
    it("input immutability deepEqual", () => {
      const set132 = mock132Set();
      const spec = {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD1,
              },
            ],
          },
        ],
      };
      const before132 = structuredClone(set132);
      const beforeSpec = structuredClone(spec);
      build133(set132, spec);
      assert.deepEqual(set132, before132);
      assert.deepEqual(spec, beforeSpec);
    });

    it("deep-cloned equivalent inputs same output", () => {
      const set132 = mock132Set();
      const spec = {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD1,
              },
            ],
          },
        ],
      };
      const a = build133(structuredClone(set132), structuredClone(spec));
      const b = build133(structuredClone(set132), structuredClone(spec));
      assert.deepEqual(a, b);
    });

    it("repeated output deepEqual", () => {
      const set132 = mock132Set();
      const spec = {
        candidate_binding_sets: [
          {
            candidate_key: CAND,
            bindings: [
              {
                observation_resource_requirement_key: R1.key,
                resource_declaration_id: RD1,
              },
            ],
          },
        ],
      };
      assert.deepEqual(build133(set132, spec), build133(set132, spec));
    });
  });

  it("assessAttentionCandidate direct API preserves 132 lineage", () => {
    const set132Candidate = mock132Candidate({ candidate_key: CAND });
    const assessment =
      assessAttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBinding(
        set132Candidate,
        new Map([
          [
            CAND,
            {
              candidate_key: CAND,
              bindings: [
                {
                  observation_resource_requirement_key: R1.key,
                  resource_declaration_id: RD1,
                },
              ],
            },
          ],
        ])
      );
    assert.equal(
      assessment.observation_resource_requirement_set_assessment.candidate_key,
      CAND
    );
    assert.equal(assessment.bindings.length, 1);
  });
});
