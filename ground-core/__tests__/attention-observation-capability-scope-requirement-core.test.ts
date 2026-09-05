/**
 * GROUND-054 — Observation Core VIII / Explicit Capability Scope Requirement
 *
 * Pure 048 Capability Requirement + explicit Scope Requirement Specification
 * (sibling of 050–053; no Declaration matching / applicability / satisfaction).
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
  ATTENTION_OBSERVATION_CAPABILITY_SCOPE_REQUIREMENT_MODEL_LIMITATIONS,
  attentionObservationCapabilityScopeRequirementKey,
  buildAttentionObservationCapabilityScopeRequirementSet,
  buildCanonicalCapabilityScopeKey,
  normalizeAttentionObservationCapabilityScopeRequirementSpecification,
} from "../reality/attention-observation-capability-scope-requirement-core.js";
import { capabilityScopeKey } from "../reality/capability-core.js";
import type {
  AttentionCandidate,
  AttentionCandidateSetAssessment,
} from "../reality/attention-candidate-types.js";
import type { ObservationNeed } from "../reality/observation-need-types.js";
import type {
  SalienceSignal,
  SalienceSignalKind,
} from "../reality/situation-types.js";
import type { CapabilityScope } from "../types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const SUBJECT = "ff010101-0101-4101-8101-010101010101";
const SUBJECT_S2 = "ff020202-0202-4202-8202-020202020202";
const ENTITY_E1 = "ff111111-1111-4111-8111-111111111111";
const AT = "2026-09-01T10:00:00.000Z";
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
  assert.ok(!/"ALL_SCOPED"/.test(json));
  assert.ok(!/"PARTIALLY_SCOPED"/.test(json));
  assert.ok(!/"COMPLETE"/.test(json));
  assert.ok(!/"INCOMPLETE"/.test(json));
  assert.ok(!/"APPLIES"/.test(json));
  assert.ok(!/"DOES_NOT_APPLY"/.test(json));
  assert.ok(!/"MATCHES"/.test(json));
  assert.ok(!/"COMPATIBLE"/.test(json));
  assert.ok(!/"INCOMPATIBLE"/.test(json));
  assert.ok(!/"BROADER_THAN"/.test(json));
  assert.ok(!/"NARROWER_THAN"/.test(json));
  assert.ok(!/"SUBSUMES"/.test(json));
  assert.ok(!/"valid_scopes"/.test(json));
  assert.ok(!/"matched_scopes"/.test(json));
  assert.ok(!/"applicable_scopes"/.test(json));
  assert.ok(!/"satisfied_scopes"/.test(json));
  assert.ok(!/"FEASIBLE"/.test(json));
  assert.ok(!/"can_execute"/.test(json));
  assert.ok(!/"priority"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"rank"\s*:/.test(json));
}

describe("Attention Observation Capability Scope Requirement (GROUND-054)", () => {
  describe("CapabilityScope audit / purity / architecture", () => {
    it("schema 0.1.24; reuses CapabilityScope; no 050–053 / Declaration / applicability", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-scope-requirement-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-scope-requirement-types.ts"
        ),
        "utf8"
      );
      const capabilityTypes = readFileSync(
        join(__dirnameTest, "../types.ts"),
        "utf8"
      );

      assert.ok(/export type CapabilityScopeUnscoped/.test(capabilityTypes));
      assert.ok(/export type CapabilityScopeEntity/.test(capabilityTypes));
      assert.ok(
        /export type CapabilityScopeSubjectState/.test(capabilityTypes)
      );
      assert.ok(!/export type ObservationCapabilityScope/.test(types));
      assert.ok(!/export type ObserverScope/.test(types));
      assert.ok(!/export type RequiredTargetScope/.test(types));
      assert.ok(
        /AttentionObservationRequiredCapabilityScope = CapabilityScope/.test(
          types
        )
      );

      assert.ok(!/from ["'].*state-engine/.test(core));
      assert.ok(!/from ["'].*file-store/.test(core));
      assert.ok(!/from ["'].*studio\//.test(core));
      assert.ok(!/from ["'].*capability-declaration-match/.test(core));
      assert.ok(!/from ["'].*capability-verification/.test(core));
      assert.ok(!/from ["'].*capability-availability/.test(core));
      assert.ok(!/from ["'].*state-composition/.test(core));
      assert.ok(!/\bimport\s+type\s+\{[^}]*ProjectState/.test(core));
      assert.ok(!/\bisCapabilityDeclarationActiveAt\s*\(/.test(core));
      assert.ok(!/\bassessCapability\s*\(/.test(core));
      assert.ok(!/=\s*"SATISFIED"/.test(types));
      assert.ok(!/=\s*"APPLIES"/.test(types));
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_SCOPE_REQUIREMENT_MODEL_LIMITATIONS
          .length === 27
      );

      // Canonical key helper matches GROUND-021
      const unscoped: CapabilityScope = { kind: "UNSCOPED" };
      const entity: CapabilityScope = {
        kind: "ENTITY",
        entity_id: ENTITY_E1,
      };
      const subjectState: CapabilityScope = {
        kind: "SUBJECT_STATE",
        subject_id: SUBJECT,
        state_kind: "condition",
      };
      assert.equal(
        buildCanonicalCapabilityScopeKey(unscoped),
        capabilityScopeKey(unscoped)
      );
      assert.equal(
        buildCanonicalCapabilityScopeKey(entity),
        capabilityScopeKey(entity)
      );
      assert.equal(
        buildCanonicalCapabilityScopeKey(subjectState),
        capabilityScopeKey(subjectState)
      );
    });
  });

  describe("Explicit scope requirement semantics", () => {
    it("positive Requirement + empty scope spec → NO_EXPLICIT…; does not synthesize UNSCOPED", () => {
      const capability_requirement_set = requirementSet();
      const result = buildAttentionObservationCapabilityScopeRequirementSet({
        capability_requirement_set,
        specification: { requirements: [] },
      });

      assert.equal(
        result.candidate_assessments[0].status,
        "NO_EXPLICIT_CAPABILITY_SCOPE_REQUIREMENTS_DECLARED"
      );
      const assessment =
        result.candidate_assessments[0].requirement_scope_assessments[0];
      assert.equal(
        assessment.status,
        "NO_EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT_DECLARED"
      );
      assert.equal(
        assessment.scope_requirement_basis.scope_requirement,
        null
      );
      assert.equal(result.has_explicit_capability_scope_requirements, false);
      assertNoForbiddenSemantics(result);
    });

    it("explicit UNSCOPED is distinct from absent scope requirement", () => {
      const capability_requirement_set = requirementSet();
      const key = reqKey();
      const result = buildAttentionObservationCapabilityScopeRequirementSet({
        capability_requirement_set,
        specification: {
          requirements: [
            { capability_requirement_key: key, required_scope: { kind: "UNSCOPED" } },
          ],
        },
      });

      const assessment =
        result.candidate_assessments[0].requirement_scope_assessments[0];
      assert.equal(
        assessment.status,
        "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT_PRESENT"
      );
      assert.deepEqual(
        assessment.scope_requirement_basis.scope_requirement!.required_scope,
        { kind: "UNSCOPED" }
      );
      assert.equal(
        assessment.scope_requirement_basis.scope_requirement!.key,
        attentionObservationCapabilityScopeRequirementKey(key, {
          kind: "UNSCOPED",
        })
      );
      assert.equal(
        result.candidate_assessments[0].status,
        "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENTS_PRESENT"
      );
    });

    it("explicit ENTITY and SUBJECT_STATE preserved exactly", () => {
      const capability_requirement_set = requirementSet({
        requirements: [
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C2 },
        ],
      });
      const keyC1 = reqKey(CAP_C1);
      const keyC2 = reqKey(CAP_C2);
      const entityScope: CapabilityScope = {
        kind: "ENTITY",
        entity_id: ENTITY_E1,
      };
      const subjectScope: CapabilityScope = {
        kind: "SUBJECT_STATE",
        subject_id: SUBJECT_S2,
        state_kind: "condition",
      };

      const result = buildAttentionObservationCapabilityScopeRequirementSet({
        capability_requirement_set,
        specification: {
          requirements: [
            { capability_requirement_key: keyC1, required_scope: entityScope },
            {
              capability_requirement_key: keyC2,
              required_scope: subjectScope,
            },
          ],
        },
      });

      const byCap = Object.fromEntries(
        result.candidate_assessments[0].requirement_scope_assessments.map(
          (a) => [a.capability_requirement.capability_semantic_key, a]
        )
      );
      assert.deepEqual(
        byCap[CAP_C1].scope_requirement_basis.scope_requirement!.required_scope,
        entityScope
      );
      assert.deepEqual(
        byCap[CAP_C2].scope_requirement_basis.scope_requirement!.required_scope,
        subjectScope
      );
      // Observation subject is SUBJECT, but C2 requires SUBJECT_S2 — no auto bridge
      assert.notEqual(SUBJECT_S2, SUBJECT);
    });

    it("mixed: only some Requirements scoped → candidate present; no completeness verdict", () => {
      const capability_requirement_set = requirementSet({
        requirements: [
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C2 },
        ],
      });
      const result = buildAttentionObservationCapabilityScopeRequirementSet({
        capability_requirement_set,
        specification: {
          requirements: [
            {
              capability_requirement_key: reqKey(CAP_C1),
              required_scope: { kind: "UNSCOPED" },
            },
          ],
        },
      });

      assert.equal(
        result.candidate_assessments[0].status,
        "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENTS_PRESENT"
      );
      assert.equal(
        result.candidate_assessments[0].has_explicit_capability_scope_requirements,
        true
      );
      const byCap = Object.fromEntries(
        result.candidate_assessments[0].requirement_scope_assessments.map(
          (a) => [a.capability_requirement.capability_semantic_key, a]
        )
      );
      assert.equal(
        byCap[CAP_C1].status,
        "EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT_PRESENT"
      );
      assert.equal(
        byCap[CAP_C2].status,
        "NO_EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT_DECLARED"
      );
      assertNoForbiddenSemantics(result);
    });
  });

  describe("Specification normalization / firewalls", () => {
    it("exact duplicate scope collapses; conflicting scopes reject; unknown key rejects", () => {
      const capability_requirement_set = requirementSet();
      const key = reqKey();
      const scope: CapabilityScope = {
        kind: "ENTITY",
        entity_id: ENTITY_E1,
      };

      const normalized =
        normalizeAttentionObservationCapabilityScopeRequirementSpecification(
          capability_requirement_set,
          {
            requirements: [
              { capability_requirement_key: key, required_scope: scope },
              { capability_requirement_key: key, required_scope: { ...scope } },
            ],
          }
        );
      assert.equal(normalized.requirements.length, 1);

      assert.throws(
        () =>
          normalizeAttentionObservationCapabilityScopeRequirementSpecification(
            capability_requirement_set,
            {
              requirements: [
                { capability_requirement_key: key, required_scope: scope },
                {
                  capability_requirement_key: key,
                  required_scope: { kind: "UNSCOPED" },
                },
              ],
            }
          ),
        /Multiple Capability Scope Requirements declared for capability requirement/
      );

      assert.throws(
        () =>
          buildAttentionObservationCapabilityScopeRequirementSet({
            capability_requirement_set,
            specification: {
              requirements: [
                {
                  capability_requirement_key:
                    "attention-observation-capability-requirement|missing|x",
                  required_scope: { kind: "UNSCOPED" },
                },
              ],
            },
          }),
        /Capability Requirement .* not found in observation capability requirement set/
      );
    });

    it("Observation subject/target/predicate/Evidence/Inquiry/temporal do not create Scope Requirement", () => {
      const capability_requirement_set = requirementSet();
      const result = buildAttentionObservationCapabilityScopeRequirementSet({
        capability_requirement_set,
        specification: { requirements: [] },
      });
      // ObservationNeed carries subject/target/predicate/evidence/temporal, but
      // empty scope specification yields absence — no inference.
      assert.equal(
        result.candidate_assessments[0].requirement_scope_assessments[0]
          .status,
        "NO_EXPLICIT_CAPABILITY_SCOPE_REQUIREMENT_DECLARED"
      );
      const need = sampleObservationNeed(NEED_KEY);
      assert.equal(need.subject_id, SUBJECT);
      assert.ok(need.target);
      assert.ok(need.evidence_requirements.length > 0);
      assert.ok(need.temporal_scope);
    });

    it("planning-negative / no-requirements precedence", () => {
      const planningNeg = buildAttentionObservationCapabilityScopeRequirementSet(
        {
          capability_requirement_set: requirementSet({
            attentionCandidates: [baseCandidate("EPISTEMIC_GAP")],
            requirements: [],
          }),
          specification: { requirements: [] },
        }
      );
      assert.equal(
        planningNeg.candidate_assessments[0].status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );

      const noReq = buildAttentionObservationCapabilityScopeRequirementSet({
        capability_requirement_set: requirementSet({ requirements: [] }),
        specification: { requirements: [] },
      });
      assert.equal(
        noReq.candidate_assessments[0].status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
      );
    });
  });

  describe("Immutability / determinism / independence", () => {
    it("048 set and specification remain deepEqual; reorder → same output", () => {
      const capability_requirement_set = requirementSet({
        requirements: [
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C2 },
        ],
      });
      const specification = {
        requirements: [
          {
            capability_requirement_key: reqKey(CAP_C2),
            required_scope: {
              kind: "SUBJECT_STATE" as const,
              subject_id: SUBJECT,
              state_kind: "condition",
            },
          },
          {
            capability_requirement_key: reqKey(CAP_C1),
            required_scope: {
              kind: "ENTITY" as const,
              entity_id: ENTITY_E1,
            },
          },
        ],
      };

      const reqSnap = structuredClone(capability_requirement_set);
      const specSnap = structuredClone(specification);

      const result1 = buildAttentionObservationCapabilityScopeRequirementSet({
        capability_requirement_set,
        specification,
      });
      const result2 = buildAttentionObservationCapabilityScopeRequirementSet({
        capability_requirement_set,
        specification: {
          requirements: [...specification.requirements].reverse(),
        },
      });
      const result3 = buildAttentionObservationCapabilityScopeRequirementSet({
        capability_requirement_set,
        specification,
      });

      assert.deepEqual(capability_requirement_set, reqSnap);
      assert.deepEqual(specification, specSnap);
      assert.deepEqual(result1, result2);
      assert.deepEqual(result1, result3);
      // Requirement order follows 048 (lexicographic capability keys), not input order
      assert.deepEqual(
        result1.candidate_assessments[0].requirement_scope_assessments.map(
          (a) => a.capability_requirement.capability_semantic_key
        ),
        [CAP_C2, CAP_C1].sort()
      );
    });

    it("048/050–053 do not import 054; 054 does not import 050–053 / Permission / Resource", () => {
      const core048 = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-requirement-core.ts"
        ),
        "utf8"
      );
      const core050 = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-declaration-match-core.ts"
        ),
        "utf8"
      );
      const core053 = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-state-composition-core.ts"
        ),
        "utf8"
      );
      const core054 = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-scope-requirement-core.ts"
        ),
        "utf8"
      );

      assert.ok(!/scope-requirement/.test(core048));
      assert.ok(!/scope-requirement/.test(core050));
      assert.ok(!/scope-requirement/.test(core053));
      assert.ok(!/from ["'].*capability-declaration-match/.test(core054));
      assert.ok(!/from ["'].*capability-verification/.test(core054));
      assert.ok(!/from ["'].*capability-availability/.test(core054));
      assert.ok(!/from ["'].*state-composition/.test(core054));
      assert.ok(!/attention-resolution-/.test(core054));
      assert.ok(!/from ["'].*permission/.test(core054));
      assert.ok(!/from ["'].*authority/.test(core054));
      assert.ok(!/from ["'].*resource-/.test(core054));
      // May import capability-core for capabilityScopeKey only — no active helpers
      assert.ok(/from ["'].*capability-core/.test(core054));
      assert.ok(!/\bisCapability.*ActiveAt\s*\(/.test(core054));
      assert.ok(!/\bassessCapability\s*\(/.test(core054));
    });
  });
});
