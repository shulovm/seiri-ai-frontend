/**
 * GROUND-046 — Attention Core VII / Canonical Observation Eligibility Bridge
 *
 * Pure 040 Candidate → Observation Eligibility (no ProjectState / no 041–045).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_OBSERVATION_ELIGIBILITY_MODEL_LIMITATIONS,
  assessAttentionCandidateObservationEligibility,
  attentionObservationEligibilityBasisKey,
  buildAttentionObservationEligibilitySet,
} from "../reality/attention-observation-eligibility-core.js";
import type {
  AttentionCandidate,
  AttentionCandidateSetAssessment,
} from "../reality/attention-candidate-types.js";
import type { SalienceSignal, SalienceSignalKind } from "../reality/situation-types.js";
import type { ResourceContentionFindingKind } from "../reality/resource-contention-discovery-types.js";
import type { ResourceSituationSalienceSignal } from "../reality/resource-situation-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const SUBJECT = "ff010101-0101-4101-8101-010101010101";
const RES_A = "ff060606-0606-4606-8606-060606060601";
const AT = "2026-09-01T10:00:00.000Z";
const NEED_KEY = "observation-need|observe-proposition|q|1";

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
    basis:
      findingKind === "RESOURCE_CAPACITY_BASIS_MISSING"
        ? {
            kind: "CAPACITY_BASIS_MISSING",
            reservation_load_status: "COMPLETE_NUMERIC_COMPOSITION",
          }
        : findingKind === "RESOURCE_RESERVATION_OVERLAP_PRESENT"
          ? {
              kind: "RESERVATION_OVERLAP",
              overlap_candidate_keys: ["pair|1"],
              reservation_position_keys: ["pos|1", "pos|2"],
              reservation_declaration_ids: ["rr|1"],
            }
          : findingKind === "RESOURCE_RESERVATION_REPRESENTATION_AMBIGUITY"
            ? {
                kind: "RESERVATION_REPRESENTATION_AMBIGUITY",
                reservation_position_keys: ["pos|1"],
                representation_keys: ["rep|1"],
                reservation_declaration_ids: ["rr|1"],
                has_scope_divergence: false,
                has_amount_divergence: true,
                has_window_divergence: false,
                has_coverage_ambiguity_at: false,
                has_scope_or_amount_ambiguity_at: true,
              }
            : findingKind === "RESOURCE_LOAD_ABOVE_DECLARED_CAPACITY_BASIS"
              ? {
                  kind: "CAPACITY_RELATION_DIVERGENCE",
                  comparison_keys: ["cmp|1"],
                  capacity_representation_keys: ["cap|1"],
                  relation_values: ["LOAD_MIN_ABOVE_CAPACITY_MAX"],
                }
              : {
                  kind: "CAPACITY_RELATION_DIVERGENCE",
                  comparison_keys: ["cmp|1"],
                  capacity_representation_keys: ["cap|1"],
                  relation_values: ["LOAD_MIN_ABOVE_CAPACITY_MAX"],
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

function assertNoForbidden(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"WORLD_INFORMATION_ELIGIBLE"/.test(json));
  assert.ok(!/"WORLD_INFORMATION_REQUIRED"/.test(json));
  assert.ok(!/"eligible_candidates"/.test(json));
  assert.ok(!/"selected_for_attention"/.test(json));
  assert.ok(!/"selected_for_observation"/.test(json));
  assert.ok(!/"chosen"/.test(json));
  assert.ok(!/"preferred"/.test(json));
  assert.ok(!/"focus"\s*:/.test(json));
  assert.ok(!/"priority"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"rank"\s*:/.test(json));
  assert.ok(!/"observer_id"/.test(json));
  assert.ok(!/"sensor_id"/.test(json));
  assert.ok(!/"must_acquire"/.test(json));
  assert.ok(!/"FEASIBLE"/.test(json));
  assert.ok(!/"CAN_OBSERVE"/.test(json));
  assert.ok(!/"OBSERVABLE"/.test(json));
  assert.ok(!json.includes('"PROBLEM"'));
  assert.ok(!json.includes('"RISK"'));
  assert.ok(!json.includes('"BLOCKER"'));
}

describe("Attention Observation Eligibility (GROUND-046)", () => {
  describe("Schema / purity / branch independence", () => {
    it("schema 0.1.24; pure 040 transform; no 041–045 / ProjectState", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-eligibility-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-eligibility-types.ts"
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
      assert.ok(!/"WORLD_INFORMATION_ELIGIBLE"|"WORLD_INFORMATION_REQUIRED"/.test(types));
      assert.ok(!/"ELIGIBLE"|"INELIGIBLE"|"APPROVED"|"DENIED"/.test(types));
      assert.ok(!/"WorldInformationTarget"/.test(types));
      assert.ok(/EXISTING_CANONICAL_OBSERVATION_NEED/.test(types));
    });
  });

  describe("Positive OBSERVATION_NEED mapping", () => {
    it("OBSERVATION_NEED → DIRECT with exact canonical key; one basis", () => {
      const candidate = baseCandidate("OBSERVATION_NEED", {
        observationNeedKeys: [NEED_KEY],
      });
      const assessment =
        assessAttentionCandidateObservationEligibility(candidate);
      assert.equal(
        assessment.status,
        "DIRECT_OBSERVATION_ELIGIBILITY_BASIS_PRESENT"
      );
      assert.equal(assessment.has_direct_observation_eligibility_basis, true);
      assert.equal(assessment.eligibility_bases.length, 1);
      const basis = assessment.eligibility_bases[0];
      assert.equal(basis.basis_kind, "EXISTING_CANONICAL_OBSERVATION_NEED");
      assert.equal(
        basis.observation_need_reference.observation_need_key,
        NEED_KEY
      );
      assert.equal(
        basis.key,
        attentionObservationEligibilityBasisKey(candidate.key, NEED_KEY)
      );
      assert.equal(basis.salience_signal_key, candidate.basis.kind === "BASE_SITUATION_SALIENCE" ? candidate.basis.salience_signal_key : "");
      assertNoForbidden(assessment);
    });

    it("empty observation_need_keys on OBSERVATION_NEED → no direct basis (no guessing)", () => {
      const candidate = baseCandidate("OBSERVATION_NEED", {
        observationNeedKeys: [],
      });
      const assessment =
        assessAttentionCandidateObservationEligibility(candidate);
      assert.equal(
        assessment.status,
        "NO_DIRECT_OBSERVATION_ELIGIBILITY_BASIS_REPRESENTED"
      );
      assert.deepEqual(assessment.eligibility_bases, []);
    });

    it("duplicate observation_need_keys normalize to one basis", () => {
      const candidate = baseCandidate("OBSERVATION_NEED", {
        observationNeedKeys: [NEED_KEY, NEED_KEY],
      });
      const assessment =
        assessAttentionCandidateObservationEligibility(candidate);
      assert.equal(assessment.eligibility_bases.length, 1);
    });
  });

  describe("Negative base salience boundaries", () => {
    for (const kind of [
      "ONTIC_EVENT_PRESENT",
      "STATE_CONFLICT",
      "UNPLACED_EVENT",
      "EPISTEMIC_CONTEST",
      "EPISTEMIC_GAP",
      "OPEN_INQUIRY",
    ] as const) {
      it(`${kind} → no direct observation eligibility`, () => {
        const assessment = assessAttentionCandidateObservationEligibility(
          baseCandidate(kind)
        );
        assert.equal(
          assessment.status,
          "NO_DIRECT_OBSERVATION_ELIGIBILITY_BASIS_REPRESENTED"
        );
        assert.equal(assessment.has_direct_observation_eligibility_basis, false);
        assert.deepEqual(assessment.eligibility_bases, []);
      });
    }
  });

  describe("Resource Finding boundaries", () => {
    for (const kind of [
      "RESOURCE_RESERVATION_OVERLAP_PRESENT",
      "RESOURCE_RESERVATION_REPRESENTATION_AMBIGUITY",
      "RESOURCE_CAPACITY_RELATION_DIVERGENCE",
      "RESOURCE_LOAD_ABOVE_DECLARED_CAPACITY_BASIS",
      "RESOURCE_CAPACITY_BASIS_MISSING",
    ] as const) {
      it(`${kind} → no direct observation eligibility`, () => {
        const assessment = assessAttentionCandidateObservationEligibility(
          resourceCandidate(kind)
        );
        assert.equal(
          assessment.status,
          "NO_DIRECT_OBSERVATION_ELIGIBILITY_BASIS_REPRESENTED"
        );
        assert.deepEqual(assessment.eligibility_bases, []);
      });
    }
  });

  describe("Set / coexistence / determinism", () => {
    it("OBSERVATION_NEED + Resource coexistence: no cross-domain merging", () => {
      const need = baseCandidate("OBSERVATION_NEED");
      const resource = resourceCandidate("RESOURCE_CAPACITY_BASIS_MISSING");
      const set = buildAttentionObservationEligibilitySet(
        emptyCandidateSet([need, resource])
      );
      assert.equal(set.candidate_eligibility.length, 2);
      assert.equal(
        set.candidate_eligibility[0].status,
        "DIRECT_OBSERVATION_ELIGIBILITY_BASIS_PRESENT"
      );
      assert.equal(
        set.candidate_eligibility[1].status,
        "NO_DIRECT_OBSERVATION_ELIGIBILITY_BASIS_REPRESENTED"
      );
      assert.equal(set.has_direct_observation_eligibility_basis, true);
      assertNoForbidden(set);
    });

    it("multiple ObservationNeed Candidates remain independent; no ranking", () => {
      const a = baseCandidate("OBSERVATION_NEED", {
        signalKey: "sig|need-a",
        observationNeedKeys: ["need|a"],
      });
      const b = baseCandidate("OBSERVATION_NEED", {
        signalKey: "sig|need-b",
        observationNeedKeys: ["need|b"],
      });
      const set = buildAttentionObservationEligibilitySet(
        emptyCandidateSet([a, b])
      );
      assert.equal(set.candidate_eligibility[0].eligibility_bases[0]
        .observation_need_reference.observation_need_key, "need|a");
      assert.equal(set.candidate_eligibility[1].eligibility_bases[0]
        .observation_need_reference.observation_need_key, "need|b");
      assertNoForbidden(set);
    });

    it("immutability / determinism / model limitations", () => {
      const candidates = [
        baseCandidate("EPISTEMIC_GAP"),
        baseCandidate("OBSERVATION_NEED"),
        resourceCandidate("RESOURCE_CAPACITY_BASIS_MISSING"),
      ];
      const candidateSet = emptyCandidateSet(candidates);
      const before = structuredClone(candidateSet);
      const x = buildAttentionObservationEligibilitySet(candidateSet);
      const y = buildAttentionObservationEligibilitySet(candidateSet);
      assert.deepEqual(x, y);
      assert.deepEqual(candidateSet, before);
      assert.deepEqual(
        x.model_limitations,
        ATTENTION_OBSERVATION_ELIGIBILITY_MODEL_LIMITATIONS
      );
      assert.deepEqual(
        x.candidate_eligibility.map((c) => c.candidate_key),
        candidates.map((c) => c.key)
      );
    });

    it("empty candidate set: no synthetic eligibility", () => {
      const set = buildAttentionObservationEligibilitySet(emptyCandidateSet([]));
      assert.deepEqual(set.candidate_eligibility, []);
      assert.equal(set.has_direct_observation_eligibility_basis, false);
    });
  });
});
