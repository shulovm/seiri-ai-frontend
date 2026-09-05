/**
 * GROUND-056 — Observation Core X / Explicit Capability Temporal Requirement
 *
 * Pure 048 Capability Requirement + explicit Temporal Requirement Specification
 * (sibling of 054 Scope and 050–053 state branch; no Declaration applicability).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { buildAttentionObservationEligibilitySet } from "../reality/attention-observation-eligibility-core.js";
import { buildAttentionObservationPlanningSet } from "../reality/attention-observation-planning-core.js";
import {
  attentionObservationCapabilityRequirementKey,
  buildAttentionObservationCapabilityRequirementSet,
} from "../reality/attention-observation-capability-requirement-core.js";
import {
  buildAttentionObservationCapabilityScopeRequirementSet,
} from "../reality/attention-observation-capability-scope-requirement-core.js";
import {
  ATTENTION_OBSERVATION_CAPABILITY_TEMPORAL_REQUIREMENT_MODEL_LIMITATIONS,
  assertValidRequiredCapabilityTemporalWindow,
  attentionObservationCapabilityTemporalRequirementKey,
  buildAttentionObservationCapabilityTemporalRequirementSet,
  buildCanonicalCapabilityTemporalRequirementWindowKey,
  normalizeAttentionObservationCapabilityTemporalRequirementSpecification,
} from "../reality/attention-observation-capability-temporal-requirement-core.js";
import type {
  AttentionCandidate,
  AttentionCandidateSetAssessment,
} from "../reality/attention-candidate-types.js";
import type { ObservationNeed } from "../reality/observation-need-types.js";
import type {
  SalienceSignal,
  SalienceSignalKind,
} from "../reality/situation-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const SUBJECT = "ff010101-0101-4101-8101-010101010101";
const AT = "2026-09-01T10:00:00.000Z";
const T1 = "2026-09-01T10:00:00.000Z";
const T2 = "2026-09-01T12:00:00.000Z";
const T3 = "2026-09-01T14:00:00.000Z";
const NEED_KEY = "observation-need|observe-proposition|q|1";
const QUESTION_KEY = "inquiry-question|establish-proposition|q|1";
const CAP_C1 = "satellite_imaging";
const CAP_C2 = "human_inspection";
const PROJECT_ID = "00000000-0000-4000-8000-000000000001";

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
          project_id: PROJECT_ID,
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

function requirementSet(options?: {
  requirements?: {
    observation_need_key: string;
    capability_semantic_key: string;
  }[];
  attentionCandidates?: AttentionCandidate[];
}) {
  const attentionCandidates =
    options?.attentionCandidates ?? [
      baseCandidate("OBSERVATION_NEED", { observationNeedKeys: [NEED_KEY] }),
    ];
  const planning_set = buildAttentionObservationPlanningSet({
    eligibility_set: buildAttentionObservationEligibilitySet(
      emptyCandidateSet(attentionCandidates)
    ),
    observation_needs: [sampleObservationNeed(NEED_KEY)],
  });

  return buildAttentionObservationCapabilityRequirementSet({
    planning_set,
    specification: {
      requirements: options?.requirements ?? [
        { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
      ],
    },
  });
}

function reqKey(capabilitySemanticKey = CAP_C1): string {
  return attentionObservationCapabilityRequirementKey(
    NEED_KEY,
    capabilitySemanticKey
  );
}

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"ALL_TEMPORALLY_SPECIFIED"/.test(json));
  assert.ok(!/"PARTIALLY_TEMPORALLY_SPECIFIED"/.test(json));
  assert.ok(!/"COMPLETE"/.test(json));
  assert.ok(!/"INCOMPLETE"/.test(json));
  assert.ok(!/"COVERS"/.test(json));
  assert.ok(!/"DOES_NOT_COVER"/.test(json));
  assert.ok(!/"OVERLAPS"/.test(json));
  assert.ok(!/"DOES_NOT_OVERLAP"/.test(json));
  assert.ok(!/"APPLIES"/.test(json));
  assert.ok(!/"DOES_NOT_APPLY"/.test(json));
  assert.ok(!/"deadline"\s*:/.test(json));
  assert.ok(!/"urgent"\s*:/.test(json));
  assert.ok(!/"urgency"\s*:/.test(json));
  assert.ok(!/"scheduled_requirements"/.test(json));
  assert.ok(!/"active_requirements"/.test(json));
  assert.ok(!/"current_requirements"/.test(json));
  assert.ok(!/"time_valid_requirements"/.test(json));
  assert.ok(!/"execution_window"/.test(json));
  assert.ok(!/"FEASIBLE"/.test(json));
  assert.ok(!/"can_execute"/.test(json));
  assert.ok(!/"has_capability"/.test(json));
  assert.ok(!/"priority"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"rank"\s*:/.test(json));
}

describe("Attention Observation Capability Temporal Requirement (GROUND-056)", () => {
  describe("Temporal vocabulary / purity / architecture", () => {
    it("schema 0.1.24; minimal runtime window; no 050–055 / ActiveAt / wall-clock", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-temporal-requirement-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-temporal-requirement-types.ts"
        ),
        "utf8"
      );
      const observationNeedTypes = readFileSync(
        join(__dirnameTest, "../reality/observation-need-types.ts"),
        "utf8"
      );
      const capabilityCore = readFileSync(
        join(__dirnameTest, "../reality/capability-core.ts"),
        "utf8"
      );

      assert.ok(/export type TemporalObservationScope/.test(observationNeedTypes));
      assert.ok(
        /interface AttentionObservationRequiredCapabilityTemporalWindow/.test(
          types
        )
      );
      assert.ok(/required_from: string/.test(types));
      assert.ok(/required_until: string \| null/.test(types));
      assert.ok(!/TemporalObservationScope/.test(core));
      assert.ok(!/ResourceReservationWindow/.test(core));
      assert.ok(!/SituationEventWindow/.test(core));
      assert.ok(
        !/export (type|interface) SituationEventWindow/.test(types)
      );

      assert.ok(/isCapabilityDeclarationActiveAt/.test(capabilityCore));
      assert.ok(!/from ["'].*state-engine/.test(core));
      assert.ok(!/from ["'].*file-store/.test(core));
      assert.ok(!/from ["'].*studio\//.test(core));
      assert.ok(!/from ["'].*capability-declaration-match/.test(core));
      assert.ok(!/from ["'].*capability-verification/.test(core));
      assert.ok(!/from ["'].*capability-availability/.test(core));
      assert.ok(!/from ["'].*state-composition/.test(core));
      assert.ok(!/from ["'].*scope-requirement/.test(core));
      assert.ok(!/from ["'].*scope-applicability/.test(core));
      assert.ok(!/\bimport\s+type\s+\{[^}]*ProjectState/.test(core));
      assert.ok(!/\bisCapabilityDeclarationActiveAt\s*\(/.test(core));
      assert.ok(!/\bisCapabilityVerificationActiveAt\s*\(/.test(core));
      assert.ok(!/\bisCapabilityAvailabilityActiveAt\s*\(/.test(core));
      assert.ok(!/\bisIntervalActiveAt\s*\(/.test(core));
      assert.ok(!/\bDate\.now\s*\(/.test(core));
      assert.ok(!/\bnew Date\s*\(/.test(core));
      assert.ok(!/\bperformance\.now\s*\(/.test(core));
      assert.ok(!/=\s*"SATISFIED"/.test(types));
      assert.ok(!/=\s*"COVERS"/.test(types));
      assert.ok(!/=\s*"OVERLAPS"/.test(types));
      assert.ok(!/"deadline"\s*:/.test(types));
      assert.ok(!/deadline_at/.test(types));
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_TEMPORAL_REQUIREMENT_MODEL_LIMITATIONS
          .length === 28
      );
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_TEMPORAL_REQUIREMENT_MODEL_LIMITATIONS.includes(
          "CAPABILITY_TEMPORAL_POINT_REQUIREMENT_NOT_MODELED"
        )
      );
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_TEMPORAL_REQUIREMENT_MODEL_LIMITATIONS.includes(
          "OBSERVATION_TEMPORAL_SCOPE_TO_CAPABILITY_TEMPORAL_REQUIREMENT_BRIDGE_NOT_MODELED"
        )
      );
    });
  });

  describe("Explicit temporal requirement semantics", () => {
    it("positive Requirement + empty temporal spec → NO_EXPLICIT…; no synthetic now/open-ended", () => {
      const capability_requirement_set = requirementSet();
      const before = structuredClone(capability_requirement_set);
      const result = buildAttentionObservationCapabilityTemporalRequirementSet({
        capability_requirement_set,
        specification: { requirements: [] },
      });

      assert.equal(
        result.candidate_assessments[0].status,
        "NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENTS_DECLARED"
      );
      const assessment =
        result.candidate_assessments[0].requirement_temporal_assessments[0];
      assert.equal(
        assessment.status,
        "NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT_DECLARED"
      );
      assert.equal(
        assessment.temporal_requirement_basis.temporal_requirement,
        null
      );
      assert.equal(
        result.has_explicit_capability_temporal_requirements,
        false
      );
      assert.deepEqual(capability_requirement_set, before);
      assertNoForbiddenSemantics(result);
    });

    it("explicit bounded [T1, T2) preserved exactly", () => {
      const capability_requirement_set = requirementSet();
      const key = reqKey();
      const window = { required_from: T1, required_until: T2 };
      const result = buildAttentionObservationCapabilityTemporalRequirementSet({
        capability_requirement_set,
        specification: {
          requirements: [
            { capability_requirement_key: key, required_window: window },
          ],
        },
      });

      const assessment =
        result.candidate_assessments[0].requirement_temporal_assessments[0];
      assert.equal(
        assessment.status,
        "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT_PRESENT"
      );
      assert.deepEqual(
        assessment.temporal_requirement_basis.temporal_requirement!
          .required_window,
        window
      );
      assert.equal(
        assessment.temporal_requirement_basis.temporal_requirement!.key,
        attentionObservationCapabilityTemporalRequirementKey(key, window)
      );
      assert.equal(
        result.candidate_assessments[0].status,
        "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENTS_PRESENT"
      );
      assert.equal(result.has_explicit_capability_temporal_requirements, true);
    });

    it("explicit open-ended [T1, +∞) distinct from absence", () => {
      const capability_requirement_set = requirementSet();
      const key = reqKey();
      const openWindow = { required_from: T1, required_until: null as string | null };

      const withOpen = buildAttentionObservationCapabilityTemporalRequirementSet(
        {
          capability_requirement_set,
          specification: {
            requirements: [
              {
                capability_requirement_key: key,
                required_window: openWindow,
              },
            ],
          },
        }
      );
      const without = buildAttentionObservationCapabilityTemporalRequirementSet({
        capability_requirement_set,
        specification: { requirements: [] },
      });

      const openAssessment =
        withOpen.candidate_assessments[0].requirement_temporal_assessments[0];
      assert.equal(
        openAssessment.status,
        "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT_PRESENT"
      );
      assert.deepEqual(
        openAssessment.temporal_requirement_basis.temporal_requirement!
          .required_window,
        openWindow
      );
      assert.equal(
        buildCanonicalCapabilityTemporalRequirementWindowKey(openWindow),
        `REQUIRED_WINDOW|${T1}|OPEN`
      );

      assert.equal(
        without.candidate_assessments[0].requirement_temporal_assessments[0]
          .status,
        "NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT_DECLARED"
      );
      assert.notEqual(
        withOpen.candidate_assessments[0].status,
        without.candidate_assessments[0].status
      );
    });

    it("mixed: one explicit + one absent → existential PRESENT; no completeness", () => {
      const capability_requirement_set = requirementSet({
        requirements: [
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C2 },
        ],
      });
      const keyC1 = reqKey(CAP_C1);
      const result = buildAttentionObservationCapabilityTemporalRequirementSet({
        capability_requirement_set,
        specification: {
          requirements: [
            {
              capability_requirement_key: keyC1,
              required_window: { required_from: T1, required_until: T2 },
            },
          ],
        },
      });

      assert.equal(
        result.candidate_assessments[0].status,
        "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENTS_PRESENT"
      );
      const statuses =
        result.candidate_assessments[0].requirement_temporal_assessments.map(
          (a) => a.status
        );
      assert.ok(
        statuses.includes("EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT_PRESENT")
      );
      assert.ok(
        statuses.includes("NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT_DECLARED")
      );
      assertNoForbiddenSemantics(result);
    });
  });

  describe("Validation / normalization / anchors", () => {
    it("rejects invalid empty required_from and T2 <= T1 under half-open", () => {
      assert.throws(
        () =>
          assertValidRequiredCapabilityTemporalWindow({
            required_from: "",
            required_until: T2,
          }),
        /required_from/
      );
      assert.throws(
        () =>
          assertValidRequiredCapabilityTemporalWindow({
            required_from: T1,
            required_until: T1,
          }),
        /required_until must be after required_from/
      );
      assert.throws(
        () =>
          assertValidRequiredCapabilityTemporalWindow({
            required_from: T2,
            required_until: T1,
          }),
        /required_until must be after required_from/
      );
    });

    it("exact duplicate collapses; different windows reject; unknown key rejects", () => {
      const capability_requirement_set = requirementSet();
      const key = reqKey();
      const window = { required_from: T1, required_until: T2 };

      const normalized =
        normalizeAttentionObservationCapabilityTemporalRequirementSpecification(
          capability_requirement_set,
          {
            requirements: [
              { capability_requirement_key: key, required_window: window },
              {
                capability_requirement_key: key,
                required_window: { ...window },
              },
            ],
          }
        );
      assert.equal(normalized.requirements.length, 1);

      assert.throws(
        () =>
          normalizeAttentionObservationCapabilityTemporalRequirementSpecification(
            capability_requirement_set,
            {
              requirements: [
                { capability_requirement_key: key, required_window: window },
                {
                  capability_requirement_key: key,
                  required_window: {
                    required_from: T1,
                    required_until: T3,
                  },
                },
              ],
            }
          ),
        /Multiple Capability Temporal Requirements declared for capability requirement/
      );

      assert.throws(
        () =>
          normalizeAttentionObservationCapabilityTemporalRequirementSpecification(
            capability_requirement_set,
            {
              requirements: [
                {
                  capability_requirement_key: "unknown-req-key",
                  required_window: window,
                },
              ],
            }
          ),
        /not found in observation capability requirement set/
      );
    });

    it("ObservationNeed.temporal_scope / Situation.at do not create temporal requirement", () => {
      const needWithPoint = sampleObservationNeed(NEED_KEY, {
        temporal_scope: { kind: "POINT", at: AT },
      });
      const needWithInterval = sampleObservationNeed(NEED_KEY, {
        temporal_scope: {
          kind: "INTERVAL",
          from: T1,
          until: T2,
        },
      });

      for (const need of [needWithPoint, needWithInterval]) {
        const planning_set = buildAttentionObservationPlanningSet({
          eligibility_set: buildAttentionObservationEligibilitySet(
            emptyCandidateSet([
              baseCandidate("OBSERVATION_NEED", {
                observationNeedKeys: [NEED_KEY],
              }),
            ])
          ),
          observation_needs: [need],
        });
        const capability_requirement_set =
          buildAttentionObservationCapabilityRequirementSet({
            planning_set,
            specification: {
              requirements: [
                {
                  observation_need_key: NEED_KEY,
                  capability_semantic_key: CAP_C1,
                },
              ],
            },
          });
        const result =
          buildAttentionObservationCapabilityTemporalRequirementSet({
            capability_requirement_set,
            specification: { requirements: [] },
          });
        assert.equal(
          result.candidate_assessments[0].requirement_temporal_assessments[0]
            .status,
          "NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENT_DECLARED"
        );
      }

      // Candidate.at / situation_at present but empty temporal spec → still absent
      const capability_requirement_set = requirementSet();
      assert.ok(
        capability_requirement_set.candidate_requirements[0].candidate_key
          .length > 0
      );
      const result = buildAttentionObservationCapabilityTemporalRequirementSet({
        capability_requirement_set,
        specification: { requirements: [] },
      });
      assert.equal(
        result.candidate_assessments[0].status,
        "NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENTS_DECLARED"
      );
    });

    it("Scope Requirement sibling independence: 054 present/absent does not affect 056", () => {
      const capability_requirement_set = requirementSet();
      const key = reqKey();
      const temporalSpec = {
        requirements: [
          {
            capability_requirement_key: key,
            required_window: {
              required_from: T1,
              required_until: T2,
            },
          },
        ],
      };

      const temporalAlone =
        buildAttentionObservationCapabilityTemporalRequirementSet({
          capability_requirement_set,
          specification: temporalSpec,
        });

      // 054 can be built independently; 056 does not consume it
      const scopeSet = buildAttentionObservationCapabilityScopeRequirementSet({
        capability_requirement_set,
        specification: {
          requirements: [
            {
              capability_requirement_key: key,
              required_scope: { kind: "UNSCOPED" },
            },
          ],
        },
      });
      assert.equal(
        scopeSet.has_explicit_capability_scope_requirements,
        true
      );

      const temporalAfterScope =
        buildAttentionObservationCapabilityTemporalRequirementSet({
          capability_requirement_set,
          specification: temporalSpec,
        });

      assert.deepEqual(temporalAlone, temporalAfterScope);
      assert.equal(
        temporalAlone.candidate_assessments[0].status,
        "EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENTS_PRESENT"
      );
    });
  });

  describe("Immutability / determinism / firewalls", () => {
    it("048 and specification deepEqual preserved; reorder invariant; repeated deepEqual", () => {
      const capability_requirement_set = requirementSet({
        requirements: [
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C2 },
        ],
      });
      const keyC1 = reqKey(CAP_C1);
      const keyC2 = reqKey(CAP_C2);
      const specification = {
        requirements: [
          {
            capability_requirement_key: keyC2,
            required_window: { required_from: T1, required_until: T3 },
          },
          {
            capability_requirement_key: keyC1,
            required_window: { required_from: T1, required_until: T2 },
          },
        ],
      };
      const beforeSet = structuredClone(capability_requirement_set);
      const beforeSpec = structuredClone(specification);

      const a = buildAttentionObservationCapabilityTemporalRequirementSet({
        capability_requirement_set,
        specification,
      });
      const b = buildAttentionObservationCapabilityTemporalRequirementSet({
        capability_requirement_set,
        specification: {
          requirements: [...specification.requirements].reverse(),
        },
      });
      const c = buildAttentionObservationCapabilityTemporalRequirementSet({
        capability_requirement_set,
        specification,
      });

      assert.deepEqual(capability_requirement_set, beforeSet);
      assert.deepEqual(specification, beforeSpec);
      assert.deepEqual(a.specification, b.specification);
      assert.deepEqual(a, c);
      assertNoForbiddenSemantics(a);
    });

    it("048 / capability-core / 054 / 055 do not import 056", () => {
      const reqCore = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-core.ts"
        ),
        "utf8"
      );
      const capCore = readFileSync(
        join(__dirnameTest, "../reality/capability-core.ts"),
        "utf8"
      );
      const scopeReq = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-scope-requirement-core.ts"
        ),
        "utf8"
      );
      const scopeApp = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-scope-applicability-core.ts"
        ),
        "utf8"
      );
      assert.ok(!/temporal-requirement/.test(reqCore));
      assert.ok(!/temporal-requirement/.test(capCore));
      assert.ok(!/temporal-requirement/.test(scopeReq));
      assert.ok(!/temporal-requirement/.test(scopeApp));
    });

    it("required_until is not deadline; no planning-negative synthesizes temporal window", () => {
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-temporal-requirement-types.ts"
        ),
        "utf8"
      );
      assert.ok(/required_until/.test(types));
      assert.ok(!/"deadline"\s*:/.test(types));
      assert.ok(!/deadline_at/.test(types));
      assert.ok(!/required_deadline/.test(types));

      const nonObs = requirementSet({
        attentionCandidates: [baseCandidate("EPISTEMIC_GAP")],
        requirements: [],
      });
      // Non OBSERVATION_NEED candidate with empty requirements list
      // — ensure we don't invent temporal requirements from situation.at
      const result = buildAttentionObservationCapabilityTemporalRequirementSet({
        capability_requirement_set: nonObs,
        specification: { requirements: [] },
      });
      assert.ok(
        result.candidate_assessments[0].status ===
          "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
          result.candidate_assessments[0].status ===
            "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
          result.candidate_assessments[0].status ===
            "NO_EXPLICIT_CAPABILITY_TEMPORAL_REQUIREMENTS_DECLARED"
      );
      assert.equal(result.has_explicit_capability_temporal_requirements, false);
    });
  });
});
