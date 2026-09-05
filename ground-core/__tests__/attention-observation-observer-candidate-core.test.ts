/**
 * GROUND-049 — Observation Core III / Explicit Observer Candidate Foundation
 *
 * Pure 047 planning + explicit Observer Candidate Spec + explicit RealityEntity
 * collection (no ProjectState / no 041–045 / no 048 / no Capability matching).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { buildAttentionObservationEligibilitySet } from "../reality/attention-observation-eligibility-core.js";
import { buildAttentionObservationPlanningSet } from "../reality/attention-observation-planning-core.js";
import {
  ATTENTION_OBSERVATION_OBSERVER_CANDIDATE_MODEL_LIMITATIONS,
  assessAttentionCandidateObservationObserverCandidates,
  attentionObservationObserverCandidateKey,
  buildAttentionObservationObserverCandidateSet,
  normalizeObserverEntityCollection,
} from "../reality/attention-observation-observer-candidate-core.js";
import type {
  AttentionCandidate,
  AttentionCandidateSetAssessment,
} from "../reality/attention-candidate-types.js";
import type { ObservationNeed } from "../reality/observation-need-types.js";
import type { SalienceSignal, SalienceSignalKind } from "../reality/situation-types.js";
import type { AttentionObservationObserverCandidateSpecification } from "../reality/attention-observation-observer-candidate-types.js";
import type { RealityEntity } from "../types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const SUBJECT = "ff010101-0101-4101-8101-010101010101";
const ENTITY_E1 = "ff111111-1111-4111-8111-111111111111";
const ENTITY_E2 = "ff222222-2222-4222-8222-222222222222";
const ENTITY_E3 = "ff333333-3333-4333-8333-333333333333";
const AT = "2026-09-01T10:00:00.000Z";
const NEED_KEY = "observation-need|observe-proposition|q|1";
const OTHER_NEED_KEY = "observation-need|other|q|2";
const QUESTION_KEY = "inquiry-question|establish-proposition|q|1";

function sampleEntity(
  id: string,
  kind = "person",
  label = "observer"
): RealityEntity {
  return {
    id,
    project_id: "00000000-0000-4000-8000-000000000001",
    kind,
    label,
    created_at: AT,
    updated_at: AT,
  };
}

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

function emptySpec(): AttentionObservationObserverCandidateSpecification {
  return { candidates: [] };
}

function assertNoForbidden(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"capability_match"/.test(json));
  assert.ok(!/"SUITABLE"/.test(json));
  assert.ok(!/"UNSUITABLE"/.test(json));
  assert.ok(!/"ELIGIBLE"/.test(json));
  assert.ok(!/"INELIGIBLE"/.test(json));
  assert.ok(!/"FEASIBLE"/.test(json));
  assert.ok(!/"CAN_OBSERVE"/.test(json));
  assert.ok(!/"can_execute"/.test(json));
  assert.ok(!/"selected_observer"/.test(json));
  assert.ok(!/"preferred_observer"/.test(json));
  assert.ok(!/"assigned_observer"/.test(json));
  assert.ok(!/"declared_by"/.test(json));
  assert.ok(!/"priority"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"rank"\s*:/.test(json));
}

describe("Attention Observation Observer Candidate (GROUND-049)", () => {
  describe("Schema / purity / RealityEntity identity / 048 independence", () => {
    it("schema 0.1.24; RealityEntity.id; no 048 / Capability / ProjectState", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-observer-candidate-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-observer-candidate-types.ts"
        ),
        "utf8"
      );
      const entityTypes = readFileSync(
        join(__dirnameTest, "../types.ts"),
        "utf8"
      );
      assert.ok(/export interface RealityEntity/.test(entityTypes));
      assert.ok(/id: string/.test(entityTypes));
      assert.ok(/CanonicalObserverEntityId/.test(types));
      assert.ok(!/from ["'].*state-engine/.test(core));
      assert.ok(!/from ["'].*file-store/.test(core));
      assert.ok(!/from ["'].*studio\//.test(core));
      assert.ok(!/import type \{[^}]*ProjectState/.test(core));
      assert.ok(!/\(projectState/.test(core));
      assert.ok(!/from ["'].*attention-observation-capability-requirement/.test(core));
      assert.ok(!/from ["'].*capability-core/.test(core));
      assert.ok(!/from ["'].*attention-consideration/.test(core));
      assert.ok(!/from ["'].*attention-basis-coverage/.test(core));
      assert.ok(!/from ["'].*attention-basis-requirement/.test(core));
      assert.ok(!/from ["'].*attention-basis-resolution/.test(core));
      assert.ok(!/from ["'].*attention-resolution-eligibility/.test(core));
      assert.ok(!/"SUITABLE"|"selected_observer"|"can_execute"/.test(types));
    });
  });

  describe("Empty / negative / discovery firewalls", () => {
    it("positive planning + empty spec → NO_EXPLICIT; empty basis; no catalog discovery", () => {
      const planningSet = planningSetFor(
        [baseCandidate("OBSERVATION_NEED")],
        [sampleObservationNeed(NEED_KEY)]
      );
      const entities = [
        sampleEntity(ENTITY_E1),
        sampleEntity(ENTITY_E2),
        sampleEntity(ENTITY_E3),
      ];
      const set = buildAttentionObservationObserverCandidateSet({
        planning_set: planningSet,
        specification: emptySpec(),
        observer_entities: entities,
      });
      const assessment = set.candidate_assessments[0];
      assert.equal(
        assessment.status,
        "NO_EXPLICIT_OBSERVER_CANDIDATES_DECLARED"
      );
      assert.ok(assessment.observer_candidate_basis);
      assert.deepEqual(assessment.observer_candidate_basis!.candidates, []);
      assert.equal(assessment.has_explicit_observer_candidates, false);
      assert.equal(set.has_explicit_observer_candidates, false);
      assertNoForbidden(assessment);
    });

    it("EPISTEMIC_GAP / no planning → NOT_APPLICABLE", () => {
      const planningSet = planningSetFor(
        [baseCandidate("EPISTEMIC_GAP")],
        [sampleObservationNeed(NEED_KEY)]
      );
      const assessment = assessAttentionCandidateObservationObserverCandidates(
        planningSet.candidate_planning[0],
        emptySpec(),
        normalizeObserverEntityCollection([sampleEntity(ENTITY_E1)])
      );
      assert.equal(
        assessment.status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
      assert.equal(assessment.observer_candidate_basis, null);
    });

    it("unreferenced entities never become candidates", () => {
      const planningSet = planningSetFor(
        [baseCandidate("OBSERVATION_NEED")],
        [sampleObservationNeed(NEED_KEY)]
      );
      const catalog = [
        sampleEntity(ENTITY_E1),
        sampleEntity(ENTITY_E2),
        sampleEntity(ENTITY_E3),
        sampleEntity(SUBJECT, "asset", "subject-not-observer"),
        sampleEntity("ff444444-4444-4444-8444-444444444444"),
      ];
      const set = buildAttentionObservationObserverCandidateSet({
        planning_set: planningSet,
        specification: {
          candidates: [
            {
              observation_need_key: NEED_KEY,
              observer_entity_id: ENTITY_E2,
            },
          ],
        },
        observer_entities: catalog,
      });
      assert.equal(
        set.candidate_assessments[0].observer_candidate_basis!.candidates
          .length,
        1
      );
      assert.equal(
        set.candidate_assessments[0].observer_candidate_basis!.candidates[0]
          .observer_entity_id,
        ENTITY_E2
      );
    });

    it("ObservationNeed.subject does not auto-become Observer Candidate", () => {
      const planningSet = planningSetFor(
        [baseCandidate("OBSERVATION_NEED")],
        [sampleObservationNeed(NEED_KEY, { subject_id: SUBJECT })]
      );
      const set = buildAttentionObservationObserverCandidateSet({
        planning_set: planningSet,
        specification: emptySpec(),
        observer_entities: [sampleEntity(SUBJECT, "asset", "subject")],
      });
      assert.deepEqual(
        set.candidate_assessments[0].observer_candidate_basis!.candidates,
        []
      );
    });

    it("unknown ObservationNeed throws", () => {
      const planningSet = planningSetFor(
        [baseCandidate("OBSERVATION_NEED")],
        [sampleObservationNeed(NEED_KEY)]
      );
      assert.throws(
        () =>
          buildAttentionObservationObserverCandidateSet({
            planning_set: planningSet,
            specification: {
              candidates: [
                {
                  observation_need_key: OTHER_NEED_KEY,
                  observer_entity_id: ENTITY_E1,
                },
              ],
            },
            observer_entities: [sampleEntity(ENTITY_E1)],
          }),
        /ObservationNeed observation-need\|other\|q\|2 not found in observation planning basis set/
      );
    });

    it("missing RealityEntity throws", () => {
      const planningSet = planningSetFor(
        [baseCandidate("OBSERVATION_NEED")],
        [sampleObservationNeed(NEED_KEY)]
      );
      assert.throws(
        () =>
          buildAttentionObservationObserverCandidateSet({
            planning_set: planningSet,
            specification: {
              candidates: [
                {
                  observation_need_key: NEED_KEY,
                  observer_entity_id: ENTITY_E1,
                },
              ],
            },
            observer_entities: [],
          }),
        /RealityEntity ff111111-1111-4111-8111-111111111111 not found for observer candidate/
      );
    });

    it("duplicate RealityEntity id throws", () => {
      assert.throws(
        () =>
          normalizeObserverEntityCollection([
            sampleEntity(ENTITY_E1),
            sampleEntity(ENTITY_E1, "organization"),
          ]),
        /Duplicate RealityEntity id/
      );
    });
  });

  describe("Explicit candidates", () => {
    it("one explicit Observer Candidate preserves exact entity", () => {
      const entity = sampleEntity(ENTITY_E1, "satellite", "sat-1");
      const planningSet = planningSetFor(
        [baseCandidate("OBSERVATION_NEED")],
        [sampleObservationNeed(NEED_KEY)]
      );
      const set = buildAttentionObservationObserverCandidateSet({
        planning_set: planningSet,
        specification: {
          candidates: [
            {
              observation_need_key: NEED_KEY,
              observer_entity_id: ENTITY_E1,
            },
          ],
        },
        observer_entities: [entity],
      });
      const assessment = set.candidate_assessments[0];
      assert.equal(
        assessment.status,
        "EXPLICIT_OBSERVER_CANDIDATES_PRESENT"
      );
      const cand = assessment.observer_candidate_basis!.candidates[0];
      assert.equal(
        cand.key,
        attentionObservationObserverCandidateKey(NEED_KEY, ENTITY_E1)
      );
      assert.equal(cand.observer_entity, entity);
      assert.equal(cand.observer_entity.kind, "satellite");
      assert.equal(assessment.planning, planningSet.candidate_planning[0]);
      assertNoForbidden(set);
    });

    it("multiple candidates; duplicates normalize; order invariant; kind-neutral", () => {
      const planningSet = planningSetFor(
        [baseCandidate("OBSERVATION_NEED")],
        [sampleObservationNeed(NEED_KEY)]
      );
      const entities = [
        sampleEntity(ENTITY_E1, "person"),
        sampleEntity(ENTITY_E2, "organization"),
        sampleEntity(ENTITY_E3, "asset"),
      ];
      const a = buildAttentionObservationObserverCandidateSet({
        planning_set: planningSet,
        specification: {
          candidates: [
            {
              observation_need_key: NEED_KEY,
              observer_entity_id: ENTITY_E3,
            },
            {
              observation_need_key: NEED_KEY,
              observer_entity_id: ENTITY_E1,
            },
            {
              observation_need_key: NEED_KEY,
              observer_entity_id: ENTITY_E1,
            },
            {
              observation_need_key: NEED_KEY,
              observer_entity_id: ENTITY_E2,
            },
          ],
        },
        observer_entities: entities,
      });
      const b = buildAttentionObservationObserverCandidateSet({
        planning_set: planningSet,
        specification: {
          candidates: [
            {
              observation_need_key: NEED_KEY,
              observer_entity_id: ENTITY_E1,
            },
            {
              observation_need_key: NEED_KEY,
              observer_entity_id: ENTITY_E2,
            },
            {
              observation_need_key: NEED_KEY,
              observer_entity_id: ENTITY_E3,
            },
          ],
        },
        observer_entities: entities,
      });
      assert.deepEqual(a, b);
      assert.deepEqual(
        a.candidate_assessments[0].observer_candidate_basis!.candidates.map(
          (c) => c.observer_entity_id
        ),
        [ENTITY_E1, ENTITY_E2, ENTITY_E3]
      );
    });

    it("same Entity across ObservationNeeds yields distinct Need-relative keys", () => {
      const needA = sampleObservationNeed(NEED_KEY);
      const needB = sampleObservationNeed(OTHER_NEED_KEY);
      const candA = baseCandidate("OBSERVATION_NEED", {
        signalKey: "sig|need-a",
        observationNeedKeys: [NEED_KEY],
      });
      const candB = baseCandidate("OBSERVATION_NEED", {
        signalKey: "sig|need-b",
        observationNeedKeys: [OTHER_NEED_KEY],
      });
      const planningSet = planningSetFor([candA, candB], [needA, needB]);
      const set = buildAttentionObservationObserverCandidateSet({
        planning_set: planningSet,
        specification: {
          candidates: [
            {
              observation_need_key: NEED_KEY,
              observer_entity_id: ENTITY_E1,
            },
            {
              observation_need_key: OTHER_NEED_KEY,
              observer_entity_id: ENTITY_E1,
            },
          ],
        },
        observer_entities: [sampleEntity(ENTITY_E1)],
      });
      const keys = set.candidate_assessments.flatMap(
        (a) =>
          a.observer_candidate_basis?.candidates.map((c) => c.key) ?? []
      );
      assert.deepEqual(keys, [
        attentionObservationObserverCandidateKey(NEED_KEY, ENTITY_E1),
        attentionObservationObserverCandidateKey(OTHER_NEED_KEY, ENTITY_E1),
      ]);
      assert.notEqual(keys[0], keys[1]);
    });
  });

  describe("Sibling branch / immutability / determinism", () => {
    it("048 empty Capability Requirements do not block Observer Candidates", () => {
      // Documented sibling: Observer Candidates present while Capability Requirements absent
      const planningSet = planningSetFor(
        [baseCandidate("OBSERVATION_NEED")],
        [sampleObservationNeed(NEED_KEY)]
      );
      const set = buildAttentionObservationObserverCandidateSet({
        planning_set: planningSet,
        specification: {
          candidates: [
            {
              observation_need_key: NEED_KEY,
              observer_entity_id: ENTITY_E1,
            },
          ],
        },
        observer_entities: [sampleEntity(ENTITY_E1)],
      });
      assert.equal(
        set.candidate_assessments[0].status,
        "EXPLICIT_OBSERVER_CANDIDATES_PRESENT"
      );
      // Ground-048 would independently report NO_EXPLICIT_CAPABILITY_REQUIREMENTS_DECLARED
      // for empty capability spec — no contradiction.
    });

    it("Capability Requirements present but no Observer Candidates is valid", () => {
      const planningSet = planningSetFor(
        [baseCandidate("OBSERVATION_NEED")],
        [sampleObservationNeed(NEED_KEY)]
      );
      const set = buildAttentionObservationObserverCandidateSet({
        planning_set: planningSet,
        specification: emptySpec(),
        observer_entities: [sampleEntity(ENTITY_E1)],
      });
      assert.equal(
        set.candidate_assessments[0].status,
        "NO_EXPLICIT_OBSERVER_CANDIDATES_DECLARED"
      );
    });

    it("immutability / determinism / model limitations", () => {
      const planningSet = planningSetFor(
        [baseCandidate("OBSERVATION_NEED")],
        [sampleObservationNeed(NEED_KEY)]
      );
      const specification: AttentionObservationObserverCandidateSpecification =
        {
          candidates: [
            {
              observation_need_key: NEED_KEY,
              observer_entity_id: ENTITY_E1,
            },
          ],
        };
      const entities = [sampleEntity(ENTITY_E1)];
      const planningBefore = structuredClone(planningSet);
      const specBefore = structuredClone(specification);
      const entitiesBefore = structuredClone(entities);
      const a = buildAttentionObservationObserverCandidateSet({
        planning_set: planningSet,
        specification,
        observer_entities: entities,
      });
      const b = buildAttentionObservationObserverCandidateSet({
        planning_set: planningSet,
        specification,
        observer_entities: entities,
      });
      assert.deepEqual(a, b);
      assert.deepEqual(planningSet, planningBefore);
      assert.deepEqual(specification, specBefore);
      assert.deepEqual(entities, entitiesBefore);
      assert.deepEqual(
        a.model_limitations,
        ATTENTION_OBSERVATION_OBSERVER_CANDIDATE_MODEL_LIMITATIONS
      );
    });
  });
});
