/**
 * GROUND-047 — Observation Core I / Planning Basis Foundation
 *
 * Pure 046 eligibility + explicit ObservationNeed collection (no ProjectState / no 041–045).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  assessAttentionCandidateObservationEligibility,
  buildAttentionObservationEligibilitySet,
} from "../reality/attention-observation-eligibility-core.js";
import {
  ATTENTION_OBSERVATION_PLANNING_MODEL_LIMITATIONS,
  assessAttentionCandidateObservationPlanning,
  attentionObservationPlanningBasisKey,
  buildAttentionObservationPlanningSet,
  normalizeObservationNeedCollection,
} from "../reality/attention-observation-planning-core.js";
import type {
  AttentionCandidate,
  AttentionCandidateSetAssessment,
} from "../reality/attention-candidate-types.js";
import type { ObservationNeed } from "../reality/observation-need-types.js";
import type { SalienceSignal, SalienceSignalKind } from "../reality/situation-types.js";
import type { ResourceContentionFindingKind } from "../reality/resource-contention-discovery-types.js";
import type { ResourceSituationSalienceSignal } from "../reality/resource-situation-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const SUBJECT = "ff010101-0101-4101-8101-010101010101";
const RES_A = "ff060606-0606-4606-8606-060606060601";
const AT = "2026-09-01T10:00:00.000Z";
const NEED_KEY = "observation-need|observe-proposition|q|1";
const OTHER_NEED_KEY = "observation-need|other|q|2";
const QUESTION_KEY = "inquiry-question|establish-proposition|q|1";

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

function resourceCandidate(
  findingKind: ResourceContentionFindingKind
): AttentionCandidate {
  const findingKey = `finding|${findingKind}`;
  const signalKey = ["resource-situation-salience", RES_A, findingKey].join(
    "|"
  );
  const signal: ResourceSituationSalienceSignal = {
    key: signalKey,
    kind: "RESOURCE_CONTENTION_FINDING_PRESENT",
    resource_declaration_id: RES_A,
    resource_finding_key: findingKey,
    resource_finding_kind: findingKind,
    basis: {
      kind: "CAPACITY_BASIS_MISSING",
      reservation_load_status: "COMPLETE_NUMERIC_COMPOSITION",
    },
  };
  return {
    key: [
      "attention-candidate",
      "resource-situation-salience",
      SUBJECT,
      AT,
      signalKey,
    ].join("|"),
    source_kind: "RESOURCE_SITUATION_SALIENCE",
    situation_subject_id: SUBJECT,
    at: AT,
    basis: {
      kind: "RESOURCE_SITUATION_SALIENCE",
      situation_subject_id: SUBJECT,
      situation_at: AT,
      resource_declaration_id: RES_A,
      resource_salience_signal_key: signalKey,
      resource_finding_key: findingKey,
      resource_finding_kind: findingKind,
      resource_salience_signal: signal,
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

function planningInputFor(
  candidates: AttentionCandidate[],
  observationNeeds: ObservationNeed[]
) {
  const eligibilitySet = buildAttentionObservationEligibilitySet(
    emptyCandidateSet(candidates)
  );
  return {
    eligibility_set: eligibilitySet,
    observation_needs: observationNeeds,
  };
}

function assertNoForbidden(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"ObservationPlan"/.test(json));
  assert.ok(!/"ObservationRequest"/.test(json));
  assert.ok(!/"ObservationTask"/.test(json));
  assert.ok(!/"ObserverCandidate"/.test(json));
  assert.ok(!/"WorldInformationTarget"/.test(json));
  assert.ok(!/"COMPLETE_PLAN"/.test(json));
  assert.ok(!/"READY"/.test(json));
  assert.ok(!/"PLANNABLE"/.test(json));
  assert.ok(!/"FEASIBLE"/.test(json));
  assert.ok(!/"CAN_OBSERVE"/.test(json));
  assert.ok(!/"selected"/.test(json));
  assert.ok(!/"priority"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"rank"\s*:/.test(json));
  assert.ok(!/"observer_id"/.test(json));
  assert.ok(!/"sensor_id"/.test(json));
  assert.ok(!/"dispatch"/.test(json));
  assert.ok(!/"schedule"/.test(json));
}

describe("Attention Observation Planning Basis (GROUND-047)", () => {
  describe("Schema / purity / branch independence", () => {
    it("schema 0.1.24; pure 046 + explicit ObservationNeed; no 041–045 / ProjectState", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-planning-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-planning-types.ts"
        ),
        "utf8"
      );
      assert.ok(!/from ["'].*state-engine/.test(core));
      assert.ok(!/from ["'].*file-store/.test(core));
      assert.ok(!/from ["'].*studio\//.test(core));
      assert.ok(!/import type \{[^}]*ProjectState/.test(core));
      assert.ok(!/\(projectState/.test(core));
      assert.ok(!/from ["'].*attention-consideration/.test(core));
      assert.ok(!/from ["'].*attention-basis-coverage/.test(core));
      assert.ok(!/from ["'].*attention-basis-requirement/.test(core));
      assert.ok(!/from ["'].*attention-basis-resolution/.test(core));
      assert.ok(!/from ["'].*attention-resolution-eligibility/.test(core));
      assert.ok(!/"ObservationPlan"|"WorldInformationTarget"/.test(types));
      assert.ok(/CANONICAL_OBSERVATION_NEED_STRUCTURE/.test(types));
      assert.ok(/OBSERVATION_NEED_LIFECYCLE_NOT_MODELED/.test(types));
    });
  });

  describe("Positive planning basis", () => {
    it("OBSERVATION_NEED → CANONICAL planning basis with exact structure", () => {
      const candidate = baseCandidate("OBSERVATION_NEED");
      const need = sampleObservationNeed(NEED_KEY);
      const eligibility = assessAttentionCandidateObservationEligibility(
        candidate
      );
      const byKey = normalizeObservationNeedCollection([need]);
      const assessment = assessAttentionCandidateObservationPlanning(
        eligibility,
        byKey
      );

      assert.equal(
        assessment.status,
        "CANONICAL_OBSERVATION_PLANNING_BASIS_PRESENT"
      );
      assert.ok(assessment.planning_basis);
      const basis = assessment.planning_basis!;
      assert.equal(
        basis.key,
        attentionObservationPlanningBasisKey(candidate.key, NEED_KEY)
      );
      assert.equal(basis.observation_need, need);
      assert.deepEqual(basis.target_basis.target, need.target);
      assert.deepEqual(
        basis.evidence_requirement_basis.evidence_requirements,
        need.evidence_requirements
      );
      assert.deepEqual(basis.inquiry_context_basis.question_keys, [
        QUESTION_KEY,
      ]);
      assert.equal(basis.observation_need.kind, "OBSERVE_PROPOSITION");
      assertNoForbidden(assessment);
    });

    it("empty evidence_requirements and question_keys preserved", () => {
      const candidate = baseCandidate("OBSERVATION_NEED");
      const need = sampleObservationNeed(NEED_KEY, {
        evidence_requirements: [],
        question_keys: [],
      });
      const assessment = assessAttentionCandidateObservationPlanning(
        assessAttentionCandidateObservationEligibility(candidate),
        normalizeObservationNeedCollection([need])
      );
      assert.deepEqual(
        assessment.planning_basis!.evidence_requirement_basis
          .evidence_requirements,
        []
      );
      assert.deepEqual(
        assessment.planning_basis!.inquiry_context_basis.question_keys,
        []
      );
    });
  });

  describe("Negative / validation", () => {
    it("EPISTEMIC_GAP → NO_OBSERVATION_PLANNING_BASIS; no lookup", () => {
      const candidate = baseCandidate("EPISTEMIC_GAP");
      const need = sampleObservationNeed(NEED_KEY);
      const assessment = assessAttentionCandidateObservationPlanning(
        assessAttentionCandidateObservationEligibility(candidate),
        normalizeObservationNeedCollection([need])
      );
      assert.equal(assessment.status, "NO_OBSERVATION_PLANNING_BASIS");
      assert.equal(assessment.planning_basis, null);
    });

    it("missing ObservationNeed reference throws", () => {
      const candidate = baseCandidate("OBSERVATION_NEED");
      const eligibility = assessAttentionCandidateObservationEligibility(
        candidate
      );
      assert.throws(
        () =>
          assessAttentionCandidateObservationPlanning(
            eligibility,
            normalizeObservationNeedCollection([])
          ),
        /ObservationNeed observation-need\|observe-proposition\|q\|1 not found for observation eligibility basis/
      );
    });

    it("duplicate ObservationNeed key throws", () => {
      const need = sampleObservationNeed(NEED_KEY);
      assert.throws(
        () => normalizeObservationNeedCollection([need, need]),
        /Duplicate ObservationNeed key/
      );
    });

    it("empty ObservationNeed key throws", () => {
      assert.throws(
        () =>
          normalizeObservationNeedCollection([
            sampleObservationNeed(""),
          ]),
        /ObservationNeed key must be non-empty/
      );
    });

    it("unreferenced ObservationNeeds do not create planning assessments", () => {
      const candidate = baseCandidate("OBSERVATION_NEED");
      const set = buildAttentionObservationPlanningSet(
        planningInputFor(
          [candidate],
          [sampleObservationNeed(NEED_KEY), sampleObservationNeed(OTHER_NEED_KEY)]
        )
      );
      assert.equal(set.candidate_planning.length, 1);
      assert.equal(
        set.candidate_planning[0].planning_basis!.observation_need_key,
        NEED_KEY
      );
    });

    it("same subject different key does not match", () => {
      const candidate = baseCandidate("OBSERVATION_NEED", {
        observationNeedKeys: [NEED_KEY],
      });
      const similarNeed = sampleObservationNeed(OTHER_NEED_KEY, {
        target: {
          kind: "PROPOSITION_TARGET",
          subject_id: SUBJECT,
          predicate_kind: "state",
          predicate: "condition",
        },
      });
      assert.throws(
        () =>
          buildAttentionObservationPlanningSet(
            planningInputFor([candidate], [similarNeed])
          ),
        /not found for observation eligibility basis/
      );
    });
  });

  describe("Set / immutability / determinism", () => {
    it("OBSERVATION_NEED + Resource + EPISTEMIC coexistence", () => {
      const need = sampleObservationNeed(NEED_KEY);
      const set = buildAttentionObservationPlanningSet(
        planningInputFor(
          [
            baseCandidate("EPISTEMIC_GAP"),
            baseCandidate("OBSERVATION_NEED"),
            resourceCandidate("RESOURCE_CAPACITY_BASIS_MISSING"),
          ],
          [need]
        )
      );
      assert.equal(set.candidate_planning.length, 3);
      assert.equal(
        set.candidate_planning[0].status,
        "NO_OBSERVATION_PLANNING_BASIS"
      );
      assert.equal(
        set.candidate_planning[1].status,
        "CANONICAL_OBSERVATION_PLANNING_BASIS_PRESENT"
      );
      assert.equal(
        set.candidate_planning[2].status,
        "NO_OBSERVATION_PLANNING_BASIS"
      );
      assert.equal(set.has_observation_planning_basis, true);
      assertNoForbidden(set);
    });

    it("immutability / determinism / model limitations", () => {
      const candidate = baseCandidate("OBSERVATION_NEED");
      const need = sampleObservationNeed(NEED_KEY);
      const input = planningInputFor([candidate], [need]);
      const eligibilityBefore = structuredClone(input.eligibility_set);
      const needsBefore = structuredClone(input.observation_needs);
      const a = buildAttentionObservationPlanningSet(input);
      const b = buildAttentionObservationPlanningSet(input);
      assert.deepEqual(a, b);
      assert.deepEqual(input.eligibility_set, eligibilityBefore);
      assert.deepEqual(input.observation_needs, needsBefore);
      assert.deepEqual(
        a.model_limitations,
        ATTENTION_OBSERVATION_PLANNING_MODEL_LIMITATIONS
      );
    });

    it("empty candidate set: no synthetic planning", () => {
      const set = buildAttentionObservationPlanningSet(
        planningInputFor([], [sampleObservationNeed(NEED_KEY)])
      );
      assert.deepEqual(set.candidate_planning, []);
      assert.equal(set.has_observation_planning_basis, false);
    });
  });
});
