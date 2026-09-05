/**
 * GROUND-134 — Observation Core LXXXVIII / Operational Eligibility
 * RESOURCE_READINESS Evaluation Instant Foundation
 *
 * Pure GROUND-133 binding assessment + explicit evaluation instant specification
 * (temporal context only; no resource evidence assessment / readiness).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVALUATION_INSTANT_MODEL_LIMITATIONS,
  assertResourceReadinessEvaluationAt,
  attentionObservationOperationalEligibilityResourceReadinessEvaluationInstantKey,
  assessAttentionCandidateObservationOperationalEligibilityResourceReadinessEvaluationInstant,
  buildAttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSet,
  normalizeAttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSpecification,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-evaluation-instant-core.js";
import type {
  AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment,
  AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment,
} from "../reality/attention-observation-operational-eligibility-resource-readiness-observation-context-binding-types.js";
import type {
  AttentionCandidateObservationResourceRequirementSetAssessment,
  AttentionObservationResourceRequirement,
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
const AT = "2026-09-02T12:00:00.000Z";
const AT_ALT = "2026-09-02T13:00:00.000Z";

function mockResourceRequirement(
  overrides: Partial<AttentionObservationResourceRequirement> & { key: string }
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

const R1 = mockResourceRequirement({ key: "req-r1" });
const R2 = mockResourceRequirement({ key: "req-r2", resource_key: "NETWORK" });
const R3 = mockResourceRequirement({ key: "req-r3", resource_key: "COMPUTE" });

function binding(
  requirement: AttentionObservationResourceRequirement,
  resourceDeclarationId: string
) {
  return {
    key: `binding|${requirement.key}|${resourceDeclarationId}`,
    candidate_key: requirement.candidate_key,
    observation_need_key: requirement.observation_need_key,
    capability_requirement_set_key: requirement.capability_requirement_set_key,
    observation_resource_requirement_key: requirement.key,
    resource_declaration_id: resourceDeclarationId,
  };
}

function mock133Candidate(
  overrides: Partial<AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment> & {
    candidate_key: string;
  }
): AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment {
  const defaultBindings = [
    binding(R1, RD1),
    binding(R1, RD2),
    binding(R3, RD3),
  ];
  const base: AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment =
    {
      candidate_key: overrides.candidate_key,
      observation_resource_requirement_set_assessment: {
        candidate_key: overrides.candidate_key,
        capability_requirement_assessment: {} as never,
        status: "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT",
        resource_requirements: [R1, R2, R3],
        has_explicit_observation_resource_requirement_set: true,
        has_observation_resource_requirements: true,
        model_limitations: [],
      },
      status: "RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_PRESENT",
      requirement_binding_assessments: [],
      bindings: defaultBindings,
      has_resource_readiness_observation_context_bindings: true,
      model_limitations: [],
    };
  return { ...base, ...overrides };
}

function mock133Set(options?: {
  candidates?: (Partial<AttentionCandidateObservationOperationalEligibilityResourceReadinessObservationContextBindingAssessment> & {
    candidate_key: string;
  })[];
}): AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment {
  const candidates = options?.candidates ?? [{ candidate_key: CAND }];
  return {
    observation_resource_requirement_set: {} as never,
    specification: { candidate_binding_sets: [] },
    candidate_assessments: candidates.map((c) => mock133Candidate(c)),
    has_resource_readiness_observation_context_bindings: candidates.some(
      (c) =>
        (c.status ?? "RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_PRESENT") ===
          "RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_PRESENT" &&
        (c.has_resource_readiness_observation_context_bindings ?? true)
    ),
    model_limitations: [],
  };
}

function build134(
  bindingSet: AttentionObservationOperationalEligibilityResourceReadinessObservationContextBindingSetAssessment = mock133Set(),
  specification: { evaluation_instants: { candidate_key: string; evaluation_at: string }[] } = {
    evaluation_instants: [],
  }
) {
  return buildAttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSet({
    resource_readiness_observation_context_binding_set: bindingSet,
    specification,
  });
}

function assertNoReadinessSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"RESOURCE_READY"/.test(json));
  assert.ok(!/"RESOURCE_NOT_READY"/.test(json));
  assert.ok(!/"can_execute"\s*:/.test(json));
  assert.ok(!/"OPERATIONALLY_ELIGIBLE"/.test(json));
}

describe("GROUND-134 RESOURCE_READINESS Evaluation Instant", () => {
  it("schema unchanged at 0.1.24", () => {
    assert.equal(SCHEMA_VERSION, "0.1.25");
  });

  it("model limitations fixed order", () => {
    assert.deepEqual(
      ATTENTION_OBSERVATION_OPERATIONAL_ELIGIBILITY_RESOURCE_READINESS_EVALUATION_INSTANT_MODEL_LIMITATIONS,
      [
        "RESOURCE_DECLARATION_EXISTENCE_NOT_EVALUATED",
        "RESOURCE_REQUIREMENT_TO_DECLARATION_MATCH_NOT_EVALUATED",
        "OBSERVATION_RESOURCE_EVIDENCE_ASSESSMENT_NOT_MODELED",
        "OBSERVATION_RESOURCE_TEMPORAL_APPLICABILITY_NOT_EVALUATED",
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

  describe("instant declaration", () => {
    it("one Candidate / one binding / one instant", () => {
      const set = build134(
        mock133Set({
          candidates: [
            {
              candidate_key: CAND,
              bindings: [binding(R1, RD1)],
            },
          ],
        }),
        { evaluation_instants: [{ candidate_key: CAND, evaluation_at: AT }] }
      );
      const cand = set.candidate_assessments[0]!;
      assert.equal(
        cand.status,
        "EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_PRESENT"
      );
      assert.equal(cand.resource_readiness_evaluation_instant!.evaluation_at, AT);
      assert.equal(set.candidate_assessments.length, 1);
      assertNoReadinessSemantics(set);
    });

    it("one Candidate / multiple bindings / one instant", () => {
      const set = build134(mock133Set(), {
        evaluation_instants: [{ candidate_key: CAND, evaluation_at: AT }],
      });
      assert.equal(
        set.candidate_assessments[0]!.status,
        "EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_PRESENT"
      );
      assert.equal(
        set.candidate_assessments[0]!.resource_readiness_evaluation_instant!.evaluation_at,
        AT
      );
      assert.equal(
        set.candidate_assessments[0]!
          .resource_readiness_observation_context_binding_assessment.bindings
          .length,
        3
      );
    });

    it("multiple requirements / multiple bindings still one instant", () => {
      const set = build134(mock133Set(), {
        evaluation_instants: [{ candidate_key: CAND, evaluation_at: AT }],
      });
      assert.equal(
        set.candidate_assessments[0]!.resource_readiness_evaluation_instant!.dimension,
        "RESOURCE_READINESS"
      );
      assert.ok(
        !JSON.stringify(set).includes("per_binding_evaluation_at")
      );
    });

    it("partial binding coverage + instant valid", () => {
      const set = build134(
        mock133Set({
          candidates: [
            {
              candidate_key: CAND,
              bindings: [binding(R1, RD1), binding(R3, RD3)],
            },
          ],
        }),
        { evaluation_instants: [{ candidate_key: CAND, evaluation_at: AT }] }
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_PRESENT"
      );
    });
  });

  describe("no instant contexts", () => {
    it("no bindings → no instant", () => {
      const set = build134(
        mock133Set({
          candidates: [
            {
              candidate_key: CAND,
              status: "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
              bindings: [],
              has_resource_readiness_observation_context_bindings: false,
            },
          ],
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
      );
      assert.equal(
        set.candidate_assessments[0]!.resource_readiness_evaluation_instant,
        null
      );
    });

    it("requirement-set absent → no instant", () => {
      const set = build134(
        mock133Set({
          candidates: [
            {
              candidate_key: CAND,
              status: "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED",
              bindings: [],
              has_resource_readiness_observation_context_bindings: false,
              observation_resource_requirement_set_assessment: {
                candidate_key: CAND,
                capability_requirement_assessment: {} as never,
                status: "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED",
                resource_requirements: [],
                has_explicit_observation_resource_requirement_set: false,
                has_observation_resource_requirements: false,
                model_limitations: [],
              } satisfies AttentionCandidateObservationResourceRequirementSetAssessment,
            },
          ],
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED"
      );
    });

    it("explicit empty requirements → no instant", () => {
      const set = build134(
        mock133Set({
          candidates: [
            {
              candidate_key: CAND,
              status: "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_EMPTY",
              bindings: [],
              has_resource_readiness_observation_context_bindings: false,
              observation_resource_requirement_set_assessment: {
                candidate_key: CAND,
                capability_requirement_assessment: {} as never,
                status: "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_PRESENT",
                resource_requirements: [],
                has_explicit_observation_resource_requirement_set: true,
                has_observation_resource_requirements: false,
                model_limitations: [],
              },
            },
          ],
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_EMPTY"
      );
    });

    it("outer no planning → no instant", () => {
      const set = build134(
        mock133Set({
          candidates: [
            {
              candidate_key: CAND_OUTER,
              status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
              bindings: [],
              has_resource_readiness_observation_context_bindings: false,
            },
          ],
        })
      );
      assert.equal(
        set.candidate_assessments[0]!.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
    });

    it("bindings present + no instant spec", () => {
      const set = build134(mock133Set());
      assert.equal(
        set.candidate_assessments[0]!.status,
        "NO_EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_DECLARED"
      );
      assert.equal(
        set.candidate_assessments[0]!.has_explicit_resource_readiness_evaluation_instant,
        false
      );
    });
  });

  describe("validation rejects", () => {
    it("no bindings + instant specification rejects", () => {
      assert.throws(
        () =>
          build134(
            mock133Set({
              candidates: [
                {
                  candidate_key: CAND,
                  status: "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
                  bindings: [],
                  has_resource_readiness_observation_context_bindings: false,
                },
              ],
            }),
            { evaluation_instants: [{ candidate_key: CAND, evaluation_at: AT }] }
          ),
        /requires an applicable RESOURCE_READINESS Binding domain/
      );
    });

    it("requirement-set absent + instant specification rejects", () => {
      assert.throws(
        () =>
          build134(
            mock133Set({
              candidates: [
                {
                  candidate_key: CAND,
                  status: "NO_EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_DECLARED",
                  bindings: [],
                  has_resource_readiness_observation_context_bindings: false,
                },
              ],
            }),
            { evaluation_instants: [{ candidate_key: CAND, evaluation_at: AT }] }
          ),
        /requires an applicable RESOURCE_READINESS Binding domain/
      );
    });

    it("explicit empty + instant specification rejects", () => {
      assert.throws(
        () =>
          build134(
            mock133Set({
              candidates: [
                {
                  candidate_key: CAND,
                  status: "EXPLICIT_OBSERVATION_RESOURCE_REQUIREMENT_SET_EMPTY",
                  bindings: [],
                  has_resource_readiness_observation_context_bindings: false,
                },
              ],
            }),
            { evaluation_instants: [{ candidate_key: CAND, evaluation_at: AT }] }
          ),
        /requires an applicable RESOURCE_READINESS Binding domain/
      );
    });

    it("outer + instant specification rejects", () => {
      assert.throws(
        () =>
          build134(
            mock133Set({
              candidates: [
                {
                  candidate_key: CAND_OUTER,
                  status: "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS",
                  bindings: [],
                  has_resource_readiness_observation_context_bindings: false,
                },
              ],
            }),
            {
              evaluation_instants: [
                { candidate_key: CAND_OUTER, evaluation_at: AT },
              ],
            }
          ),
        /requires an applicable RESOURCE_READINESS Binding domain/
      );
    });

    it("unknown Candidate rejects", () => {
      assert.throws(
        () =>
          build134(mock133Set(), {
            evaluation_instants: [
              { candidate_key: "unknown", evaluation_at: AT },
            ],
          }),
        /not found in RESOURCE_READINESS Observation-Context Binding set/
      );
    });

    it("conflicting instants for same Candidate reject", () => {
      assert.throws(
        () =>
          build134(mock133Set(), {
            evaluation_instants: [
              { candidate_key: CAND, evaluation_at: AT },
              { candidate_key: CAND, evaluation_at: AT_ALT },
            ],
          }),
        /Conflicting RESOURCE_READINESS evaluation instants/
      );
    });

    it("malformed instant rejects", () => {
      assert.throws(
        () =>
          build134(mock133Set(), {
            evaluation_instants: [
              { candidate_key: CAND, evaluation_at: "not-a-timestamp" },
            ],
          }),
        /Malformed evaluation_at/
      );
    });

    it("duplicate same Candidate/same instant normalizes", () => {
      const normalized =
        normalizeAttentionObservationOperationalEligibilityResourceReadinessEvaluationInstantSpecification(
          mock133Set(),
          {
            evaluation_instants: [
              { candidate_key: CAND, evaluation_at: AT },
              { candidate_key: CAND, evaluation_at: AT },
            ],
          }
        );
      assert.equal(normalized.evaluation_instants.length, 1);
    });
  });

  describe("identity", () => {
    it("instant key excludes binding keys and ResourceDeclaration IDs", () => {
      const key = attentionObservationOperationalEligibilityResourceReadinessEvaluationInstantKey(
        CAND,
        NEED_KEY,
        CAP_SET_KEY,
        AT
      );
      assert.ok(!key.includes(RD1));
      assert.ok(!key.includes(R1.key));
      assert.ok(!key.includes("resource_declaration_id"));
      assert.ok(key.includes("RESOURCE_READINESS"));
      assert.ok(key.includes(AT));
    });

    it("same context + same instant same key", () => {
      const a = attentionObservationOperationalEligibilityResourceReadinessEvaluationInstantKey(
        CAND,
        NEED_KEY,
        CAP_SET_KEY,
        AT
      );
      const b = attentionObservationOperationalEligibilityResourceReadinessEvaluationInstantKey(
        CAND,
        NEED_KEY,
        CAP_SET_KEY,
        AT
      );
      assert.equal(a, b);
    });

    it("same context + different instant different key", () => {
      const a = attentionObservationOperationalEligibilityResourceReadinessEvaluationInstantKey(
        CAND,
        NEED_KEY,
        CAP_SET_KEY,
        AT
      );
      const b = attentionObservationOperationalEligibilityResourceReadinessEvaluationInstantKey(
        CAND,
        NEED_KEY,
        CAP_SET_KEY,
        AT_ALT
      );
      assert.notEqual(a, b);
    });

    it("same context + same instant / different binding set same instant key", () => {
      const set1 = build134(
        mock133Set({
          candidates: [{ candidate_key: CAND, bindings: [binding(R1, RD1)] }],
        }),
        { evaluation_instants: [{ candidate_key: CAND, evaluation_at: AT }] }
      );
      const set2 = build134(
        mock133Set({
          candidates: [
            {
              candidate_key: CAND,
              bindings: [binding(R1, RD1), binding(R2, RD2), binding(R3, RD3)],
            },
          ],
        }),
        { evaluation_instants: [{ candidate_key: CAND, evaluation_at: AT }] }
      );
      assert.equal(
        set1.candidate_assessments[0]!.resource_readiness_evaluation_instant!.key,
        set2.candidate_assessments[0]!.resource_readiness_evaluation_instant!.key
      );
      assert.notEqual(
        set1.candidate_assessments[0]!
          .resource_readiness_observation_context_binding_assessment.bindings
          .length,
        set2.candidate_assessments[0]!
          .resource_readiness_observation_context_binding_assessment.bindings
          .length
      );
    });
  });

  describe("candidate mixed behavior", () => {
    it("C1 bindings+instant, C2 bindings+no instant, C3 no bindings coexist", () => {
      const set = build134(
        mock133Set({
          candidates: [
            { candidate_key: "c1" },
            { candidate_key: "c2" },
            {
              candidate_key: "c3",
              status: "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
              bindings: [],
              has_resource_readiness_observation_context_bindings: false,
            },
          ],
        }),
        {
          evaluation_instants: [{ candidate_key: "c1", evaluation_at: AT }],
        }
      );
      const byKey = new Map(
        set.candidate_assessments.map((c) => [c.candidate_key, c])
      );
      assert.equal(
        byKey.get("c1")!.status,
        "EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_PRESENT"
      );
      assert.equal(
        byKey.get("c2")!.status,
        "NO_EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_DECLARED"
      );
      assert.equal(
        byKey.get("c3")!.status,
        "NO_EXPLICIT_RESOURCE_READINESS_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
      );
    });
  });

  describe("readiness and resource firewalls (static)", () => {
    it("explicit instant != ready and missing instant != not ready", () => {
      const withInstant = build134(mock133Set(), {
        evaluation_instants: [{ candidate_key: CAND, evaluation_at: AT }],
      });
      const withoutInstant = build134(mock133Set());
      assertNoReadinessSemantics(withInstant);
      assertNoReadinessSemantics(withoutInstant);
    });

    it("no wall clock / no resource lookup in core", () => {
      const coreSrc = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-resource-readiness-evaluation-instant-core.ts"
        ),
        "utf8"
      );
      assert.ok(!/Date\.now\(/.test(coreSrc));
      assert.ok(!/new Date\(/.test(coreSrc));
      assert.ok(!/performance\.now\(/.test(coreSrc));
      assert.ok(!/from ["'].*state-engine/.test(coreSrc));
      assert.ok(!/from ["'].*resource-core/.test(coreSrc));
      assert.ok(!/resource_declarations/.test(coreSrc));
      assert.ok(!/Date\.parse\(/.test(coreSrc));
      assert.ok(!/"RESOURCE_READY"/.test(coreSrc));
      assert.ok(!/"RESOURCE_NOT_READY"/.test(coreSrc));
    });

    it("no per-binding or per-requirement instant fields in types", () => {
      const typesSrc = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-resource-readiness-evaluation-instant-types.ts"
        ),
        "utf8"
      );
      assert.ok(!/per_binding/.test(typesSrc));
      assert.ok(!/binding_evaluation_at/.test(typesSrc));
      assert.ok(!/requirement_evaluation_at/.test(typesSrc));
      assert.ok(!/resource_declaration_id/.test(typesSrc));
    });

    it("no requirement temporal evaluation", () => {
      const coreSrc = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-operational-eligibility-resource-readiness-evaluation-instant-core.ts"
        ),
        "utf8"
      );
      assert.ok(!/valid_from/.test(coreSrc));
      assert.ok(!/valid_until/.test(coreSrc));
    });
  });

  describe("determinism and immutability", () => {
    it("specification order invariance", () => {
      const bindingSet = mock133Set({
        candidates: [{ candidate_key: CAND }, { candidate_key: CAND_2 }],
      });
      const spec = {
        evaluation_instants: [
          { candidate_key: CAND, evaluation_at: AT },
          { candidate_key: CAND_2, evaluation_at: AT_ALT },
        ],
      };
      const a = build134(bindingSet, spec);
      const b = build134(bindingSet, {
        evaluation_instants: [...spec.evaluation_instants].reverse(),
      });
      assert.deepEqual(
        a.candidate_assessments.map((c) => c.resource_readiness_evaluation_instant),
        b.candidate_assessments.map((c) => c.resource_readiness_evaluation_instant)
      );
    });

    it("input immutability deepEqual", () => {
      const bindingSet = mock133Set();
      const spec = {
        evaluation_instants: [{ candidate_key: CAND, evaluation_at: AT }],
      };
      const beforeBinding = structuredClone(bindingSet);
      const beforeSpec = structuredClone(spec);
      build134(bindingSet, spec);
      assert.deepEqual(bindingSet, beforeBinding);
      assert.deepEqual(spec, beforeSpec);
    });

    it("deep-cloned equivalent inputs same output", () => {
      const bindingSet = mock133Set();
      const spec = {
        evaluation_instants: [{ candidate_key: CAND, evaluation_at: AT }],
      };
      assert.deepEqual(
        build134(structuredClone(bindingSet), structuredClone(spec)),
        build134(structuredClone(bindingSet), structuredClone(spec))
      );
    });
  });

  it("assertResourceReadinessEvaluationAt accepts canonical ISO instant", () => {
    assert.equal(assertResourceReadinessEvaluationAt(AT), AT);
  });

  it("assessAttentionCandidate direct API", () => {
    const bindingAssessment = mock133Candidate({ candidate_key: CAND });
    const assessment =
      assessAttentionCandidateObservationOperationalEligibilityResourceReadinessEvaluationInstant(
        bindingAssessment,
        new Map([[CAND, { candidate_key: CAND, evaluation_at: AT }]])
      );
    assert.equal(
      assessment.status,
      "EXPLICIT_RESOURCE_READINESS_EVALUATION_INSTANT_PRESENT"
    );
    assert.equal(assessment.resource_readiness_evaluation_instant!.evaluation_at, AT);
  });
});
