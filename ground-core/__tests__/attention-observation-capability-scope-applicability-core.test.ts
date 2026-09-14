/**
 * GROUND-055 — Observation Core IX / Capability Scope Applicability Basis
 *
 * Pure 050 Declaration Match + 054 Scope Requirement composition
 * (exact capabilityScopeKey equality only; no hierarchy/wildcard/satisfaction).
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
import { buildAttentionObservationObserverCandidateSet } from "../reality/attention-observation-observer-candidate-core.js";
import { buildAttentionObservationCapabilityDeclarationMatchSet } from "../reality/attention-observation-capability-declaration-match-core.js";
import { buildAttentionObservationCapabilityScopeRequirementSet } from "../reality/attention-observation-capability-scope-requirement-core.js";
import {
  ATTENTION_OBSERVATION_CAPABILITY_SCOPE_APPLICABILITY_MODEL_LIMITATIONS,
  assertCompatibleCapabilityScopeApplicabilitySiblingContexts,
  attentionObservationCapabilityScopeApplicabilityBasisKey,
  buildAttentionObservationCapabilityScopeApplicabilitySet,
  hasExactCanonicalCapabilityScopeCorrespondence,
} from "../reality/attention-observation-capability-scope-applicability-core.js";
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
import type {
  CapabilityDeclaration,
  CapabilityScope,
  RealityEntity,
} from "../types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const SUBJECT = "ff010101-0101-4101-8101-010101010101";
const SUBJECT_S2 = "ff020202-0202-4202-8202-020202020202";
const ENTITY_E1 = "ff111111-1111-4111-8111-111111111111";
const ENTITY_E2 = "ff222222-2222-4222-8222-222222222222";
const FACILITY_1 = "ff777777-7777-4777-8777-777777777777";
const FACILITY_2 = "ff888888-8888-4888-8888-888888888888";
const AT = "2026-09-01T10:00:00.000Z";
const NEED_KEY = "observation-need|observe-proposition|q|1";
const OTHER_NEED_KEY = "observation-need|other|q|2";
const QUESTION_KEY = "inquiry-question|establish-proposition|q|1";
const CAP_C1 = "inspect";
const CAP_C2 = "human_inspection";
const PROJECT_ID = "00000000-0000-4000-8000-000000000001";
const DECL_D1 = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const DECL_D2 = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

function sampleEntity(id: string): RealityEntity {
  return {
    id,
    project_id: PROJECT_ID,
    kind: "person",
    label: "observer",
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

function capability(
  overrides: Partial<CapabilityDeclaration> = {}
): CapabilityDeclaration {
  return {
    id: DECL_D1,
    project_id: PROJECT_ID,
    holder_entity_id: ENTITY_E1,
    capability_key: CAP_C1,
    scope: { kind: "ENTITY", entity_id: FACILITY_1 },
    description: null,
    valid_from: "2020-01-01T00:00:00.000Z",
    valid_until: "2030-01-01T00:00:00.000Z",
    declared_by: { kind: "organization", entity_id: ENTITY_E2 },
    recorded_at: AT,
    created_at: AT,
    updated_at: AT,
    ...overrides,
  };
}

function siblingInputs(options?: {
  requirements?: {
    observation_need_key: string;
    capability_semantic_key: string;
  }[];
  candidates?: {
    observation_need_key: string;
    observer_entity_id: string;
  }[];
  declarations?: CapabilityDeclaration[];
  scopeSpec?: {
    capability_requirement_key: string;
    required_scope: CapabilityScope;
  }[];
  attentionCandidates?: AttentionCandidate[];
  needs?: ObservationNeed[];
}) {
  const attentionCandidates =
    options?.attentionCandidates ?? [
      baseCandidate("OBSERVATION_NEED", { observationNeedKeys: [NEED_KEY] }),
    ];
  const needs = options?.needs ?? [sampleObservationNeed(NEED_KEY)];
  const planning_set = buildAttentionObservationPlanningSet({
    eligibility_set: buildAttentionObservationEligibilitySet(
      emptyCandidateSet(attentionCandidates)
    ),
    observation_needs: needs,
  });

  const capability_requirement_set =
    buildAttentionObservationCapabilityRequirementSet({
      planning_set,
      specification: {
        requirements: options?.requirements ?? [
          { observation_need_key: NEED_KEY, capability_semantic_key: CAP_C1 },
        ],
      },
    });

  const observer_candidate_set = buildAttentionObservationObserverCandidateSet({
    planning_set,
    specification: {
      candidates: options?.candidates ?? [
        { observation_need_key: NEED_KEY, observer_entity_id: ENTITY_E1 },
      ],
    },
    observer_entities: [sampleEntity(ENTITY_E1), sampleEntity(ENTITY_E2)],
  });

  const capability_declaration_match_set =
    buildAttentionObservationCapabilityDeclarationMatchSet({
      capability_requirement_set,
      observer_candidate_set,
      capability_declarations: options?.declarations ?? [capability()],
    });

  const capability_scope_requirement_set =
    buildAttentionObservationCapabilityScopeRequirementSet({
      capability_requirement_set,
      specification: {
        requirements: options?.scopeSpec ?? [],
      },
    });

  return {
    capability_declaration_match_set,
    capability_scope_requirement_set,
    capability_requirement_set,
  };
}

function reqKey(cap = CAP_C1, need = NEED_KEY): string {
  return attentionObservationCapabilityRequirementKey(need, cap);
}

function firstDeclarationPositions(
  result: ReturnType<typeof buildAttentionObservationCapabilityScopeApplicabilitySet>
) {
  return result.candidate_assessments[0].observer_scope_bases[0]
    .requirement_scope_positions[0].declaration_scope_positions;
}

function assertNoForbiddenSemantics(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"APPLICABLE"/.test(json));
  assert.ok(!/"INAPPLICABLE"/.test(json));
  assert.ok(!/"MATCHED"/.test(json));
  assert.ok(!/"MISMATCHED"/.test(json));
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"has_capability"/.test(json));
  assert.ok(!/"BROADER"/.test(json));
  assert.ok(!/"NARROWER"/.test(json));
  assert.ok(!/"SUBSUMES"/.test(json));
  assert.ok(!/"COMPATIBLE"/.test(json));
  assert.ok(!/"INCOMPATIBLE"/.test(json));
  assert.ok(!/"ALL_SCOPE_REQUIREMENTS_APPLICABLE"/.test(json));
  assert.ok(!/"PARTIALLY_APPLICABLE"/.test(json));
  assert.ok(!/"applicable_observers"/.test(json));
  assert.ok(!/"scope_valid_observers"/.test(json));
  assert.ok(!/"FEASIBLE"/.test(json));
  assert.ok(!/"can_execute"/.test(json));
  assert.ok(!/"priority"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"rank"\s*:/.test(json));
}

describe("Attention Observation Capability Scope Applicability (GROUND-055)", () => {
  describe("CapabilityScope audit / purity / architecture", () => {
    it("schema 0.1.24; only UNSCOPED/ENTITY/SUBJECT_STATE; no hierarchy helpers; no 051–053", () => {
      assert.equal(SCHEMA_VERSION, "0.1.25");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-scope-applicability-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-scope-applicability-types.ts"
        ),
        "utf8"
      );
      const capabilityCore = readFileSync(
        join(__dirnameTest, "../reality/capability-core.ts"),
        "utf8"
      );
      const capabilityTypes = readFileSync(
        join(__dirnameTest, "../types.ts"),
        "utf8"
      );

      assert.ok(/CapabilityScopeUnscoped/.test(capabilityTypes));
      assert.ok(/CapabilityScopeEntity/.test(capabilityTypes));
      assert.ok(/CapabilityScopeSubjectState/.test(capabilityTypes));
      assert.ok(!/subsum|hierarchy|wildcard|scopeApplic/i.test(capabilityCore));

      assert.ok(!/from ["'].*state-engine/.test(core));
      assert.ok(!/from ["'].*file-store/.test(core));
      assert.ok(!/from ["'].*capability-verification/.test(core));
      assert.ok(!/from ["'].*capability-availability/.test(core));
      assert.ok(!/from ["'].*state-composition/.test(core));
      assert.ok(!/\bimport\s+type\s+\{[^}]*ProjectState/.test(core));
      assert.ok(!/Date\.now\s*\(/.test(core));
      assert.ok(!/new Date\s*\(/.test(core));
      assert.ok(!/\bisCapability.*ActiveAt\s*\(/.test(core));
      assert.ok(!/=\s*"APPLICABLE"/.test(types));
      assert.ok(!/=\s*"SATISFIED"/.test(types));
      assert.ok(
        ATTENTION_OBSERVATION_CAPABILITY_SCOPE_APPLICABILITY_MODEL_LIMITATIONS
          .length === 24
      );

      assert.equal(
        hasExactCanonicalCapabilityScopeCorrespondence(
          { kind: "UNSCOPED" },
          { kind: "UNSCOPED" }
        ),
        true
      );
      assert.equal(
        hasExactCanonicalCapabilityScopeCorrespondence(
          { kind: "UNSCOPED" },
          { kind: "ENTITY", entity_id: FACILITY_1 }
        ),
        false
      );
      assert.equal(
        capabilityScopeKey({ kind: "ENTITY", entity_id: FACILITY_1 }),
        "ENTITY|" + FACILITY_1
      );
    });
  });

  describe("Exact correspondence rules", () => {
    it("exact UNSCOPED → direct basis; not wildcard", () => {
      const inputs = siblingInputs({
        declarations: [
          capability({ scope: { kind: "UNSCOPED" } }),
        ],
        scopeSpec: [
          {
            capability_requirement_key: reqKey(),
            required_scope: { kind: "UNSCOPED" },
          },
        ],
      });
      const result = buildAttentionObservationCapabilityScopeApplicabilitySet(
        inputs
      );
      const positions = firstDeclarationPositions(result);
      assert.equal(positions.length, 1);
      assert.equal(
        positions[0].status,
        "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT"
      );
      assert.equal(
        positions[0].applicability_basis!.basis_kind,
        "EXACT_CANONICAL_CAPABILITY_SCOPE_CORRESPONDENCE"
      );
      assertNoForbiddenSemantics(result);
    });

    it("required UNSCOPED vs declaration ENTITY → no direct basis", () => {
      const result = buildAttentionObservationCapabilityScopeApplicabilitySet(
        siblingInputs({
          declarations: [
            capability({
              scope: { kind: "ENTITY", entity_id: FACILITY_1 },
            }),
          ],
          scopeSpec: [
            {
              capability_requirement_key: reqKey(),
              required_scope: { kind: "UNSCOPED" },
            },
          ],
        })
      );
      assert.equal(
        firstDeclarationPositions(result)[0].status,
        "NO_DIRECT_SCOPE_APPLICABILITY_BASIS_REPRESENTED"
      );
      assert.equal(
        firstDeclarationPositions(result)[0].applicability_basis,
        null
      );
    });

    it("required ENTITY vs declaration UNSCOPED → no direct basis", () => {
      const result = buildAttentionObservationCapabilityScopeApplicabilitySet(
        siblingInputs({
          declarations: [capability({ scope: { kind: "UNSCOPED" } })],
          scopeSpec: [
            {
              capability_requirement_key: reqKey(),
              required_scope: { kind: "ENTITY", entity_id: FACILITY_1 },
            },
          ],
        })
      );
      assert.equal(
        firstDeclarationPositions(result)[0].status,
        "NO_DIRECT_SCOPE_APPLICABILITY_BASIS_REPRESENTED"
      );
    });

    it("exact ENTITY positive; different ENTITY no direct basis", () => {
      const result = buildAttentionObservationCapabilityScopeApplicabilitySet(
        siblingInputs({
          declarations: [
            capability({
              id: DECL_D1,
              scope: { kind: "ENTITY", entity_id: FACILITY_1 },
            }),
            capability({
              id: DECL_D2,
              scope: { kind: "ENTITY", entity_id: FACILITY_2 },
            }),
          ],
          scopeSpec: [
            {
              capability_requirement_key: reqKey(),
              required_scope: { kind: "ENTITY", entity_id: FACILITY_1 },
            },
          ],
        })
      );
      const byId = Object.fromEntries(
        firstDeclarationPositions(result).map((p) => [
          p.capability_declaration_match.capability_declaration_id,
          p,
        ])
      );
      assert.equal(
        byId[DECL_D1].status,
        "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT"
      );
      assert.equal(
        byId[DECL_D2].status,
        "NO_DIRECT_SCOPE_APPLICABILITY_BASIS_REPRESENTED"
      );
      assert.equal(
        byId[DECL_D1].applicability_basis!.key,
        attentionObservationCapabilityScopeApplicabilityBasisKey(
          reqKey(),
          byId[DECL_D1].capability_scope_requirement.key,
          DECL_D1
        )
      );
    });

    it("SUBJECT_STATE exact / mismatch / ENTITY cross-case", () => {
      const subjectScope: CapabilityScope = {
        kind: "SUBJECT_STATE",
        subject_id: FACILITY_1,
        state_kind: "condition",
      };
      const result = buildAttentionObservationCapabilityScopeApplicabilitySet(
        siblingInputs({
          declarations: [
            capability({ id: DECL_D1, scope: subjectScope }),
            capability({
              id: DECL_D2,
              scope: {
                kind: "SUBJECT_STATE",
                subject_id: FACILITY_1,
                state_kind: "other",
              },
            }),
          ],
          scopeSpec: [
            {
              capability_requirement_key: reqKey(),
              required_scope: subjectScope,
            },
          ],
        })
      );
      const byId = Object.fromEntries(
        firstDeclarationPositions(result).map((p) => [
          p.capability_declaration_match.capability_declaration_id,
          p,
        ])
      );
      assert.equal(
        byId[DECL_D1].status,
        "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT"
      );
      assert.equal(
        byId[DECL_D2].status,
        "NO_DIRECT_SCOPE_APPLICABILITY_BASIS_REPRESENTED"
      );

      // ENTITY vs SUBJECT_STATE
      const cross = buildAttentionObservationCapabilityScopeApplicabilitySet(
        siblingInputs({
          declarations: [
            capability({
              scope: {
                kind: "SUBJECT_STATE",
                subject_id: FACILITY_1,
                state_kind: "condition",
              },
            }),
          ],
          scopeSpec: [
            {
              capability_requirement_key: reqKey(),
              required_scope: { kind: "ENTITY", entity_id: FACILITY_1 },
            },
          ],
        })
      );
      assert.equal(
        firstDeclarationPositions(cross)[0].status,
        "NO_DIRECT_SCOPE_APPLICABILITY_BASIS_REPRESENTED"
      );

      // different subject / same state_kind
      assert.equal(
        hasExactCanonicalCapabilityScopeCorrespondence(
          {
            kind: "SUBJECT_STATE",
            subject_id: SUBJECT,
            state_kind: "condition",
          },
          {
            kind: "SUBJECT_STATE",
            subject_id: SUBJECT_S2,
            state_kind: "condition",
          }
        ),
        false
      );
    });
  });

  describe("No Scope Requirement / structural / consistency", () => {
    it("no Scope Requirement → NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_SCOPE_REQUIREMENTS; no synthetic UNSCOPED", () => {
      const result = buildAttentionObservationCapabilityScopeApplicabilitySet(
        siblingInputs({ scopeSpec: [] })
      );
      assert.equal(
        result.candidate_assessments[0].status,
        "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_SCOPE_REQUIREMENTS"
      );
      assert.equal(
        result.candidate_assessments[0].observer_scope_bases[0]
          .requirement_scope_positions[0].declaration_scope_positions.length,
        0
      );
      assertNoForbiddenSemantics(result);
    });

    it("two exact-positive Declarations; no winner; mixed positive+negative coexist", () => {
      const result = buildAttentionObservationCapabilityScopeApplicabilitySet(
        siblingInputs({
          declarations: [
            capability({
              id: DECL_D1,
              scope: { kind: "ENTITY", entity_id: FACILITY_1 },
            }),
            capability({
              id: DECL_D2,
              scope: { kind: "ENTITY", entity_id: FACILITY_1 },
            }),
          ],
          scopeSpec: [
            {
              capability_requirement_key: reqKey(),
              required_scope: { kind: "ENTITY", entity_id: FACILITY_1 },
            },
          ],
        })
      );
      const positions = firstDeclarationPositions(result);
      assert.equal(positions.length, 2);
      assert.ok(
        positions.every(
          (p) => p.status === "DIRECT_EXACT_SCOPE_APPLICABILITY_BASIS_PRESENT"
        )
      );
      assert.equal(
        result.candidate_assessments[0].status,
        "DIRECT_SCOPE_APPLICABILITY_BASIS_PRESENT"
      );
    });

    it("pointer-independent equivalent contexts compose; mismatch rejects", () => {
      const a = siblingInputs({
        scopeSpec: [
          {
            capability_requirement_key: reqKey(),
            required_scope: { kind: "ENTITY", entity_id: FACILITY_1 },
          },
        ],
      });
      const b = siblingInputs({
        scopeSpec: [
          {
            capability_requirement_key: reqKey(),
            required_scope: { kind: "ENTITY", entity_id: FACILITY_1 },
          },
        ],
      });
      assert.notEqual(
        a.capability_declaration_match_set,
        b.capability_declaration_match_set
      );
      assertCompatibleCapabilityScopeApplicabilitySiblingContexts(
        a.capability_declaration_match_set,
        b.capability_scope_requirement_set
      );

      const left = siblingInputs({
        attentionCandidates: [
          baseCandidate("OBSERVATION_NEED", {
            signalKey: "sig|a",
            observationNeedKeys: [NEED_KEY],
          }),
        ],
        scopeSpec: [
          {
            capability_requirement_key: reqKey(),
            required_scope: { kind: "UNSCOPED" },
          },
        ],
      });
      const right = siblingInputs({
        attentionCandidates: [
          baseCandidate("OBSERVATION_NEED", {
            signalKey: "sig|b",
            observationNeedKeys: [OTHER_NEED_KEY],
          }),
        ],
        needs: [sampleObservationNeed(OTHER_NEED_KEY)],
        requirements: [
          {
            observation_need_key: OTHER_NEED_KEY,
            capability_semantic_key: CAP_C1,
          },
        ],
        candidates: [
          {
            observation_need_key: OTHER_NEED_KEY,
            observer_entity_id: ENTITY_E1,
          },
        ],
        declarations: [
          capability({ holder_entity_id: ENTITY_E1, capability_key: CAP_C1 }),
        ],
        scopeSpec: [
          {
            capability_requirement_key: reqKey(CAP_C1, OTHER_NEED_KEY),
            required_scope: { kind: "UNSCOPED" },
          },
        ],
      });
      assert.throws(
        () =>
          buildAttentionObservationCapabilityScopeApplicabilitySet({
            capability_declaration_match_set:
              left.capability_declaration_match_set,
            capability_scope_requirement_set:
              right.capability_scope_requirement_set,
          }),
        /do not share the same Capability Requirement context/
      );
    });

    it("structural absent / planning-negative precedence", () => {
      const noStruct = buildAttentionObservationCapabilityScopeApplicabilitySet(
        siblingInputs({
          declarations: [
            capability({
              holder_entity_id: ENTITY_E2,
              capability_key: CAP_C1,
            }),
          ],
          scopeSpec: [
            {
              capability_requirement_key: reqKey(),
              required_scope: { kind: "UNSCOPED" },
            },
          ],
        })
      );
      assert.equal(
        noStruct.candidate_assessments[0].status,
        "NOT_APPLICABLE_NO_STRUCTURALLY_MATCHING_CAPABILITY_DECLARATIONS"
      );

      const planningNeg =
        buildAttentionObservationCapabilityScopeApplicabilitySet(
          siblingInputs({
            attentionCandidates: [baseCandidate("EPISTEMIC_GAP")],
            requirements: [],
            candidates: [],
            declarations: [],
            scopeSpec: [],
          })
        );
      assert.equal(
        planningNeg.candidate_assessments[0].status,
        "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
      );
    });
  });

  describe("Immutability / independence / determinism", () => {
    it("050/054 inputs deepEqual preserved; repeated output deepEqual", () => {
      const inputs = siblingInputs({
        declarations: [
          capability({
            id: DECL_D2,
            scope: { kind: "ENTITY", entity_id: FACILITY_1 },
          }),
          capability({
            id: DECL_D1,
            scope: { kind: "ENTITY", entity_id: FACILITY_1 },
          }),
        ],
        scopeSpec: [
          {
            capability_requirement_key: reqKey(),
            required_scope: { kind: "ENTITY", entity_id: FACILITY_1 },
          },
        ],
      });
      const matchSnap = structuredClone(inputs.capability_declaration_match_set);
      const scopeSnap = structuredClone(
        inputs.capability_scope_requirement_set
      );
      const result1 =
        buildAttentionObservationCapabilityScopeApplicabilitySet(inputs);
      const result2 =
        buildAttentionObservationCapabilityScopeApplicabilitySet(inputs);
      assert.deepEqual(inputs.capability_declaration_match_set, matchSnap);
      assert.deepEqual(inputs.capability_scope_requirement_set, scopeSnap);
      assert.deepEqual(result1, result2);
      // Declaration order follows CapabilityDeclaration.id
      assert.deepEqual(
        firstDeclarationPositions(result1).map(
          (p) => p.capability_declaration_match.capability_declaration_id
        ),
        [DECL_D1, DECL_D2]
      );
    });

    it("050/054 do not import 055; 055 does not import 051–053 / Permission / Resource", () => {
      const core050 = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-declaration-match-core.ts"
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
      const core055 = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-observation-capability-scope-applicability-core.ts"
        ),
        "utf8"
      );
      assert.ok(!/scope-applicability/.test(core050));
      assert.ok(!/scope-applicability/.test(core054));
      assert.ok(!/from ["'].*capability-verification/.test(core055));
      assert.ok(!/from ["'].*capability-availability/.test(core055));
      assert.ok(!/from ["'].*state-composition/.test(core055));
      assert.ok(!/attention-resolution-/.test(core055));
      assert.ok(!/from ["'].*permission/.test(core055));
      assert.ok(!/from ["'].*resource-/.test(core055));
      assert.ok(/capabilityScopeKey/.test(core055));
    });
  });
});
