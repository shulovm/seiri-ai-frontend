/**
 * GROUND-048 — Observation Core II / Explicit Capability Requirement Foundation
 *
 * Pure 047 planning + explicit Capability Requirement Specification
 * (no ProjectState / no 041–045 / no Capability matching runtime).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { buildAttentionObservationEligibilitySet } from "../reality/attention-observation-eligibility-core.js";
import { buildAttentionObservationPlanningSet } from "../reality/attention-observation-planning-core.js";
import {
  ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_MODEL_LIMITATIONS,
  assessAttentionCandidateObservationCapabilityRequirements,
  attentionObservationCapabilityRequirementKey,
  buildAttentionObservationCapabilityRequirementSet,
  normalizeAttentionObservationCapabilityRequirementSpecification,
} from "../reality/attention-observation-capability-requirement-core.js";
import type {
  AttentionCandidate,
  AttentionCandidateSetAssessment,
} from "../reality/attention-candidate-types.js";
import type { ObservationNeed } from "../reality/observation-need-types.js";
import type { SalienceSignal, SalienceSignalKind } from "../reality/situation-types.js";
import type { AttentionObservationCapabilityRequirementSpecification } from "../reality/attention-observation-capability-requirement-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const SUBJECT = "ff010101-0101-4101-8101-010101010101";
const AT = "2026-09-01T10:00:00.000Z";
const NEED_KEY = "observation-need|observe-proposition|q|1";
const OTHER_NEED_KEY = "observation-need|other|q|2";
const QUESTION_KEY = "inquiry-question|establish-proposition|q|1";
const CAP_C1 = "satellite_imaging";
const CAP_C2 = "human_inspection";

function sampleObservationNeed(
  key: string,
  overrides: Partial<ObservationNeed> = {}
): ObservationNeed {
  return {
    key,
    kind: "OBSERVE_PROPOSITION",
    question_keys: [QUESTION_KEY],
    subject_id: SUBJECT,
    predicate_kind: "state",
    predicate: "condition",
    temporal_scope: { kind: "POINT", at: AT },
    target: {
      kind: "PROPOSITION_TARGET",
      subject_id: SUBJECT,
      predicate_kind: "state",
      predicate: "condition",
    },
    evidence_requirements: [
      {
        kind: "BEARS_ON_PROPOSITION",
        target: {
          kind: "PROPOSITION_TARGET",
          subject_id: SUBJECT,
          predicate_kind: "state",
          predicate: "condition",
        },
        temporal_scope: { kind: "POINT", at: AT },
        must_be_inspectable: true,
        required_relation: "bears_on",
        distinguishing_value_keys: [],
      },
    ],
    discriminates_between_value_keys: [],
    originating_gap_kinds: ["NO_APPLICABLE_CLAIMS"],
    originating_claim_ids: [],
    originating_evidence_ids: [],
    prior_claim_ids: [],
    later_claim_ids: [],
    satisfaction_condition: {
      kind: "EPISTEMIC_RECORD_BEARS_ON_PROPOSITION",
      note: "test",
    },
    ...overrides,
  };
}

function emptySalience(
  kind: SalienceSignalKind,
  key: string,
  observationNeedKeys: string[] = []
): SalienceSignal {
  return {
    kind,
    key,
    event_ids: [],
    state_ids: [],
    claim_ids: [],
    gap_kinds: [],
    inquiry_keys: [],
    observation_need_keys: observationNeedKeys,
    note: "test",
  };
}

function baseCandidate(
  kind: SalienceSignalKind,
  options?: { signalKey?: string; observationNeedKeys?: string[] }
): AttentionCandidate {
  const signalKey = options?.signalKey ?? `sig|${kind}`;
  const observationNeedKeys =
    options?.observationNeedKeys ??
    (kind === "OBSERVATION_NEED" ? [NEED_KEY] : []);
  const signal = emptySalience(kind, signalKey, observationNeedKeys);
  return {
    key: [
      "attention-candidate",
      "base-situation-salience",
      SUBJECT,
      AT,
      signalKey,
    ].join("|"),
    source_kind: "BASE_SITUATION_SALIENCE",
    situation_subject_id: SUBJECT,
    at: AT,
    basis: {
      kind: "BASE_SITUATION_SALIENCE",
      situation_subject_id: SUBJECT,
      situation_at: AT,
      salience_signal_key: signalKey,
      salience_signal_kind: kind,
      salience_signal: signal,
    },
  };
}

function emptyCandidateSet(
  candidates: AttentionCandidate[]
): AttentionCandidateSetAssessment {
  return {
    query: {
      situation_query: { subjectId: SUBJECT, at: AT },
      resource_declaration_ids: [],
    },
    situation: {
      query: {
        situation_query: { subjectId: SUBJECT, at: AT },
        resource_declaration_ids: [],
      },
      base_situation: {
        key: "sit|test",
        subject_id: SUBJECT,
        at: AT,
        event_window: null,
        predicate_scopes: [],
        entity: {
          id: SUBJECT,
          project_id: "00000000-0000-4000-8000-000000000001",
          kind: "person",
          label: "A",
          created_at: AT,
          updated_at: AT,
        },
        ontic_context: {
          active_states: [],
          events: [],
          unplaced_events: [],
          state_conflicts: [],
        },
        epistemic_context: {
          belief_assessments: [],
          gap_assessments: [],
          gaps: [],
          unresolved_claims: [],
          unresolved_subject_claims: [],
        },
        inquiry_context: { inquiries: [], observation_needs: [] },
        salience_signals: [],
        status: "QUIET",
        has_salience: false,
        has_unresolved: false,
      },
      resource_declaration_ids: [],
      resource_facets: [],
      resource_findings: [],
      resource_salience_signals: [],
      resource_salience_status: "NO_RESOURCE_SCOPE",
      has_resource_scope: false,
      has_resource_findings: false,
      has_resource_salience: false,
      model_limitations: [],
    },
    candidates,
    status:
      candidates.length > 0
        ? "ATTENTION_CANDIDATES_PRESENT"
        : "NO_ATTENTION_CANDIDATES",
    candidate_count: candidates.length,
    base_situation_candidate_count: candidates.filter(
      (c) => c.source_kind === "BASE_SITUATION_SALIENCE"
    ).length,
    resource_candidate_count: candidates.filter(
      (c) => c.source_kind === "RESOURCE_SITUATION_SALIENCE"
    ).length,
    has_candidates: candidates.length > 0,
    model_limitations: [],
  };
}

function planningSetFor(
  candidates: AttentionCandidate[],
  observationNeeds: ObservationNeed[]
) {
  const eligibilitySet = buildAttentionObservationEligibilitySet(
    emptyCandidateSet(candidates)
  );
  return buildAttentionObservationPlanningSet({
    eligibility_set: eligibilitySet,
    observation_needs: observationNeeds,
  });
}

function emptySpec(): AttentionObservationCapabilityRequirementSpecification {
  return { requirements: [] };
}

function assertNoForbidden(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"ObserverCandidate"/.test(json));
  assert.ok(!/"matched_observers"/.test(json));
  assert.ok(!/"unmet_requirements"/.test(json));
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"COMPLETE"/.test(json));
  assert.ok(!/"INCOMPLETE"/.test(json));
  assert.ok(!/"FEASIBLE"/.test(json));
  assert.ok(!/"CAN_OBSERVE"/.test(json));
  assert.ok(!/"can_execute"/.test(json));
  assert.ok(!/"HARD"/.test(json));
  assert.ok(!/"SOFT"/.test(json));
  assert.ok(!/"declared_by"/.test(json));
  assert.ok(!/"required_by"/.test(json));
  assert.ok(!/"priority"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"rank"\s*:/.test(json));
  assert.ok(!/"observer_id"/.test(json));
  assert.ok(!/"capability_declaration_id"/.test(json));
}

describe("Attention Observation Capability Requirement (GROUND-048)", () => {
  describe("Schema / purity / Capability identity audit", () => {
    it("schema 0.1.24; uses GROUND-021 capability_key semantics; no matching runtime", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-types.ts"
        ),
        "utf8"
      );
      const capabilityTypes = readFileSync(
        join(__dirnameTest, "../types.ts"),
        "utf8"
      );
      assert.ok(/capability_key: string/.test(capabilityTypes));
      assert.ok(
        /Opaque exact-match key/.test(capabilityTypes) ||
          /capability_key/.test(types)
      );
      assert.ok(/CanonicalCapabilitySemanticKey/.test(types));
      assert.ok(!/from ["'].*state-engine/.test(core));
      assert.ok(!/from ["'].*file-store/.test(core));
      assert.ok(!/from ["'].*studio\//.test(core));
      assert.ok(!/import type \{[^}]*ProjectState/.test(core));
      assert.ok(!/\(projectState/.test(core));
      assert.ok(!/from ["'].*capability-core/.test(core));
      assert.ok(!/from ["'].*attention-consideration/.test(core));
      assert.ok(!/from ["'].*attention-basis-coverage/.test(core));
      assert.ok(!/from ["'].*attention-basis-requirement/.test(core));
      assert.ok(!/from ["'].*attention-basis-resolution/.test(core));
      assert.ok(!/from ["'].*attention-resolution-eligibility/.test(core));
      assert.ok(!/"SATISFIED"|"ObserverCandidate"|"can_execute"/.test(types));
    });
  });

  describe("Empty / negative / inference firewalls", () => {
    it("positive planning + empty spec → NO_EXPLICIT; no Evidence/target/kind inference", () => {
      const need = sampleObservationNeed(NEED_KEY);
      const planningSet = planningSetFor(
        [baseCandidate("OBSERVATION_NEED")],
        [need]
      );
      const assessment = assessAttentionCandidateObservationCapabilityRequirements(
        planningSet.candidate_planning[0],
        emptySpec()
      );
      assert.equal(
        assessment.status,
        "NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED"
      );
      assert.equal(assessment.has_explicit_capability_requirements, false);
      assert.ok(assessment.capability_requirement_basis);
      assert.equal(
        assessment.capability_requirement_basis!.observation_need_key,
        NEED_KEY
      );
      assert.deepEqual(
        assessment.capability_requirement_basis!.requirements,
        []
      );
      // Rich evidence/target/questions present but no inferred capability requirements
      assert.ok(need.evidence_requirements.length > 0);
      assert.ok(need.question_keys.length > 0);
      assertNoForbidden(assessment);
    });

    it("EPISTEMIC_GAP / no planning → NOT_APPLICABLE; no lookup", () => {
      const planningSet = planningSetFor(
        [baseCandidate("EPISTEMIC_GAP")],
        [sampleObservationNeed(NEED_KEY)]
      );
      const assessment = assessAttentionCandidateObservationCapabilityRequirements(
        planningSet.candidate_planning[0],
        {
          requirements: [
            {
              observation_need_key: NEED_KEY,
              capability_semantic_key: CAP_C1,
            },
          ],
        }
      );
      // Spec references NEED_KEY not in planning set → normalize would throw at set level;
      // per-candidate with empty normalized is NOT_APPLICABLE
      assert.equal(
        assessment.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
      assert.equal(assessment.capability_requirement_basis, null);
    });

    it("unknown ObservationNeed in specification throws", () => {
      const planningSet = planningSetFor(
        [baseCandidate("OBSERVATION_NEED")],
        [sampleObservationNeed(NEED_KEY)]
      );
      assert.throws(
        () =>
          buildAttentionObservationCapabilityRequirementSet({
            planning_set: planningSet,
            specification: {
              requirements: [
                {
                  observation_need_key: OTHER_NEED_KEY,
                  capability_semantic_key: CAP_C1,
                },
              ],
            },
          }),
        /ObservationNeed observation-need\|other\|q\|2 not found in observation planning basis set/
      );
    });

    it("unreferenced ObservationNeed cannot create planning via requirements", () => {
      const planningSet = planningSetFor(
        [baseCandidate("EPISTEMIC_GAP")],
        [sampleObservationNeed(NEED_KEY)]
      );
      assert.throws(
        () =>
          buildAttentionObservationCapabilityRequirementSet({
            planning_set: planningSet,
            specification: {
              requirements: [
                {
                  observation_need_key: NEED_KEY,
                  capability_semantic_key: CAP_C1,
                },
              ],
            },
          }),
        /not found in observation planning basis set/
      );
    });
  });

  describe("Explicit requirements", () => {
    it("one explicit Capability requirement", () => {
      const planningSet = planningSetFor(
        [baseCandidate("OBSERVATION_NEED")],
        [sampleObservationNeed(NEED_KEY)]
      );
      const set = buildAttentionObservationCapabilityRequirementSet({
        planning_set: planningSet,
        specification: {
          requirements: [
            {
              observation_need_key: NEED_KEY,
              capability_semantic_key: CAP_C1,
            },
          ],
        },
      });
      const assessment = set.candidate_requirements[0];
      assert.equal(
        assessment.status,
        "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT"
      );
      assert.equal(assessment.has_explicit_capability_requirements, true);
      assert.equal(
        assessment.capability_requirement_basis!.requirements.length,
        1
      );
      const req = assessment.capability_requirement_basis!.requirements[0];
      assert.equal(req.observation_need_key, NEED_KEY);
      assert.equal(req.capability_semantic_key, CAP_C1);
      assert.equal(
        req.key,
        attentionObservationCapabilityRequirementKey(NEED_KEY, CAP_C1)
      );
      assert.equal(set.has_explicit_capability_requirements, true);
      // Planning basis preserved exactly
      assert.equal(
        assessment.planning,
        planningSet.candidate_planning[0]
      );
    });

    it("multiple requirements; duplicates normalize; order invariant", () => {
      const planningSet = planningSetFor(
        [baseCandidate("OBSERVATION_NEED")],
        [sampleObservationNeed(NEED_KEY)]
      );
      const a = buildAttentionObservationCapabilityRequirementSet({
        planning_set: planningSet,
        specification: {
          requirements: [
            {
              observation_need_key: NEED_KEY,
              capability_semantic_key: CAP_C2,
            },
            {
              observation_need_key: NEED_KEY,
              capability_semantic_key: CAP_C1,
            },
            {
              observation_need_key: NEED_KEY,
              capability_semantic_key: CAP_C1,
            },
          ],
        },
      });
      const b = buildAttentionObservationCapabilityRequirementSet({
        planning_set: planningSet,
        specification: {
          requirements: [
            {
              observation_need_key: NEED_KEY,
              capability_semantic_key: CAP_C1,
            },
            {
              observation_need_key: NEED_KEY,
              capability_semantic_key: CAP_C2,
            },
          ],
        },
      });
      assert.deepEqual(a, b);
      assert.deepEqual(
        a.candidate_requirements[0].capability_requirement_basis!.requirements.map(
          (r) => r.capability_semantic_key
        ),
        [CAP_C2, CAP_C1]
      );
    });

    it("requirement representable without CapabilityDeclaration (no actor scan)", () => {
      const planningSet = planningSetFor(
        [baseCandidate("OBSERVATION_NEED")],
        [sampleObservationNeed(NEED_KEY)]
      );
      const set = buildAttentionObservationCapabilityRequirementSet({
        planning_set: planningSet,
        specification: {
          requirements: [
            {
              observation_need_key: NEED_KEY,
              capability_semantic_key: "unmet_capability_never_declared",
            },
          ],
        },
      });
      assert.equal(
        set.candidate_requirements[0].status,
        "EXPLICIT_CAPABILITY_REQUIREMENTS_PRESENT"
      );
      assert.equal(
        set.candidate_requirements[0].capability_requirement_basis!
          .requirements[0].capability_semantic_key,
        "unmet_capability_never_declared"
      );
    });

    it("empty capability semantic key throws", () => {
      const planningSet = planningSetFor(
        [baseCandidate("OBSERVATION_NEED")],
        [sampleObservationNeed(NEED_KEY)]
      );
      assert.throws(
        () =>
          normalizeAttentionObservationCapabilityRequirementSpecification(
            planningSet,
            {
              requirements: [
                {
                  observation_need_key: NEED_KEY,
                  capability_semantic_key: "  ",
                },
              ],
            }
          ),
        /Capability semantic key must be non-empty/
      );
    });
  });

  describe("Set / immutability / determinism", () => {
    it("mixed Candidates; requirement count not priority", () => {
      const planningSet = planningSetFor(
        [
          baseCandidate("EPISTEMIC_GAP"),
          baseCandidate("OBSERVATION_NEED"),
        ],
        [sampleObservationNeed(NEED_KEY)]
      );
      const set = buildAttentionObservationCapabilityRequirementSet({
        planning_set: planningSet,
        specification: {
          requirements: [
            {
              observation_need_key: NEED_KEY,
              capability_semantic_key: CAP_C1,
            },
            {
              observation_need_key: NEED_KEY,
              capability_semantic_key: CAP_C2,
            },
          ],
        },
      });
      assert.equal(set.candidate_requirements.length, 2);
      assert.equal(
        set.candidate_requirements[0].status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
      assert.equal(
        set.candidate_requirements[1].capability_requirement_basis!
          .requirements.length,
        2
      );
      assertNoForbidden(set);
    });

    it("immutability / determinism / model limitations", () => {
      const planningSet = planningSetFor(
        [baseCandidate("OBSERVATION_NEED")],
        [sampleObservationNeed(NEED_KEY)]
      );
      const specification: AttentionObservationCapabilityRequirementSpecification =
        {
          requirements: [
            {
              observation_need_key: NEED_KEY,
              capability_semantic_key: CAP_C1,
            },
          ],
        };
      const planningBefore = structuredClone(planningSet);
      const specBefore = structuredClone(specification);
      const a = buildAttentionObservationCapabilityRequirementSet({
        planning_set: planningSet,
        specification,
      });
      const b = buildAttentionObservationCapabilityRequirementSet({
        planning_set: planningSet,
        specification,
      });
      assert.deepEqual(a, b);
      assert.deepEqual(planningSet, planningBefore);
      assert.deepEqual(specification, specBefore);
      assert.deepEqual(
        a.model_limitations,
        ATTENTION_OBSERVATION_CAPABILITY_REQUIREMENT_MODEL_LIMITATIONS
      );
    });
  });
});
