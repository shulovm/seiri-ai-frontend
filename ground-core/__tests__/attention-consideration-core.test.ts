/**
 * GROUND-041 — Attention Core II / Consideration Basis Decomposition
 *
 * Pure Candidate → Consideration Basis tests (no ProjectState enrichment).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_CONSIDERATION_DIMENSION_ORDER,
  ATTENTION_CONSIDERATION_MODEL_LIMITATIONS,
  assessAttentionCandidateConsideration,
  buildAttentionConsiderationBasisSet,
} from "../reality/attention-consideration-core.js";
import type {
  AttentionCandidate,
  AttentionCandidateSetAssessment,
} from "../reality/attention-candidate-types.js";
import type { AttentionConsiderationDimension } from "../reality/attention-consideration-types.js";
import type { SalienceSignal, SalienceSignalKind } from "../reality/situation-types.js";
import type { ResourceContentionFindingKind } from "../reality/resource-contention-discovery-types.js";
import type { ResourceSituationSalienceSignal } from "../reality/resource-situation-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const SUBJECT = "ff010101-0101-4101-8101-010101010101";
const RES_A = "ff060606-0606-4606-8606-060606060601";
const AT = "2026-09-01T10:00:00.000Z";

const ALL_DIMENSIONS: AttentionConsiderationDimension[] = [
  ...ATTENTION_CONSIDERATION_DIMENSION_ORDER,
];

function emptySalience(kind: SalienceSignalKind, key: string): SalienceSignal {
  return {
    kind,
    key,
    event_ids: [],
    state_ids: [],
    claim_ids: [],
    gap_kinds: [],
    inquiry_keys: [],
    observation_need_keys: [],
    note: "test",
  };
}

function baseCandidate(
  kind: SalienceSignalKind,
  signalKey = `sig|${kind}`
): AttentionCandidate {
  const signal = emptySalience(kind, signalKey);
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
  findingKind: ResourceContentionFindingKind,
  findingKey = `finding|${findingKind}`
): AttentionCandidate {
  const signalKey = [
    "resource-situation-salience",
    RES_A,
    findingKey,
  ].join("|");
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
  // Use a matching basis shape for non-missing kinds without inventing semantics
  if (findingKind === "RESOURCE_RESERVATION_OVERLAP_PRESENT") {
    signal.basis = {
      kind: "RESERVATION_OVERLAP",
      overlap_candidate_keys: ["pair|1"],
      reservation_position_keys: ["pos|1", "pos|2"],
      reservation_declaration_ids: ["rr|1", "rr|2"],
    };
  } else if (findingKind === "RESOURCE_RESERVATION_REPRESENTATION_AMBIGUITY") {
    signal.basis = {
      kind: "RESERVATION_REPRESENTATION_AMBIGUITY",
      reservation_position_keys: ["pos|1"],
      representation_keys: ["rep|1", "rep|2"],
      reservation_declaration_ids: ["rr|1", "rr|2"],
      has_scope_divergence: false,
      has_amount_divergence: true,
      has_window_divergence: false,
      has_coverage_ambiguity_at: false,
      has_scope_or_amount_ambiguity_at: true,
    };
  } else if (findingKind === "RESOURCE_CAPACITY_RELATION_DIVERGENCE") {
    signal.basis = {
      kind: "CAPACITY_RELATION_DIVERGENCE",
      comparison_keys: ["cmp|1", "cmp|2"],
      capacity_representation_keys: ["cap|1", "cap|2"],
      relation_values: [
        "LOAD_MIN_ABOVE_CAPACITY_MAX",
        "LOAD_MAX_AT_OR_BELOW_CAPACITY_MIN",
      ],
    };
  } else if (findingKind === "RESOURCE_LOAD_ABOVE_DECLARED_CAPACITY_BASIS") {
    signal.basis = {
      kind: "LOAD_ABOVE_DECLARED_CAPACITY_BASIS",
      comparison_keys: ["cmp|1"],
      capacity_representation_keys: ["cap|1"],
    };
  }

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

function statusOf(
  assessment: ReturnType<typeof assessAttentionCandidateConsideration>,
  dimension: AttentionConsiderationDimension
) {
  return assessment.dimensions.find((d) => d.dimension === dimension)!.status;
}

function assertOnly(
  assessment: ReturnType<typeof assessAttentionCandidateConsideration>,
  expected: AttentionConsiderationDimension[]
) {
  assert.deepEqual(assessment.represented_dimensions, expected);
  for (const dim of ALL_DIMENSIONS) {
    const expectedStatus = expected.includes(dim)
      ? "DIRECT_BASIS_PRESENT"
      : "NO_DIRECT_BASIS_REPRESENTED";
    assert.equal(statusOf(assessment, dim), expectedStatus);
  }
}

describe("Attention Consideration Basis (GROUND-041)", () => {
  describe("Schema / architecture / purity", () => {
    it("schema 0.1.24; pure Candidate transform; no Resource/Situation/ProjectState runtime", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(__dirnameTest, "../reality/attention-consideration-core.ts"),
        "utf8"
      );
      const types = readFileSync(
        join(__dirnameTest, "../reality/attention-consideration-types.ts"),
        "utf8"
      );
      assert.ok(!/from ["'].*state-engine/.test(core));
      assert.ok(!/from ["'].*file-store/.test(core));
      assert.ok(!/from ["'].*studio\//.test(core));
      assert.ok(!/from ["'].*resource-situation/.test(core));
      assert.ok(!/from ["'].*resource-contention-discovery/.test(core));
      assert.ok(!/from ["'].*resource-reservation/.test(core));
      assert.ok(!/from ["'].*capacity-pressure/.test(core));
      assert.ok(!/from ["'].*impact/.test(core));
      assert.ok(!/from ["'].*decision/.test(core));
      assert.ok(!/import type \{[^}]*ProjectState/.test(core));
      assert.ok(!/\(projectState/.test(core));
      assert.ok(!/"priority"\s*:/.test(types));
      assert.ok(!/"score"\s*:/.test(types));
      assert.ok(!/"utility"\s*:/.test(types));
      assert.ok(!/"weight"\s*:/.test(types));
      assert.ok(!/"rank"\s*:/.test(types));
      assert.ok(!/attention_score|compareAttention/.test(core));
      assert.ok(!/\bweighted_sum\b|attention_value\s*=/.test(core));
      assert.deepEqual(
        ATTENTION_CONSIDERATION_DIMENSION_ORDER,
        ALL_DIMENSIONS
      );
    });
  });

  describe("Base Salience mappings", () => {
    it("ONTIC_EVENT_PRESENT → STRUCTURAL_ACTIVITY only", () => {
      assertOnly(
        assessAttentionCandidateConsideration(
          baseCandidate("ONTIC_EVENT_PRESENT")
        ),
        ["STRUCTURAL_ACTIVITY"]
      );
    });

    it("STATE_CONFLICT / UNPLACED / EPISTEMIC_CONTEST → unresolvedness only", () => {
      for (const kind of [
        "STATE_CONFLICT",
        "UNPLACED_EVENT",
        "EPISTEMIC_CONTEST",
      ] as const) {
        assertOnly(assessAttentionCandidateConsideration(baseCandidate(kind)), [
          "SITUATION_UNRESOLVEDNESS",
        ]);
      }
    });

    it("EPISTEMIC_GAP → unresolvedness; NOT information gain / observation need", () => {
      const a = assessAttentionCandidateConsideration(
        baseCandidate("EPISTEMIC_GAP")
      );
      assertOnly(a, ["SITUATION_UNRESOLVEDNESS"]);
      assert.equal(statusOf(a, "INFORMATION_GAIN"), "NO_DIRECT_BASIS_REPRESENTED");
      assert.equal(statusOf(a, "OBSERVATION_NEED"), "NO_DIRECT_BASIS_REPRESENTED");
    });

    it("OPEN_INQUIRY → unresolvedness; NOT ObservationNeed", () => {
      const a = assessAttentionCandidateConsideration(
        baseCandidate("OPEN_INQUIRY")
      );
      assertOnly(a, ["SITUATION_UNRESOLVEDNESS"]);
      assert.equal(statusOf(a, "OBSERVATION_NEED"), "NO_DIRECT_BASIS_REPRESENTED");
    });

    it("OBSERVATION_NEED → unresolvedness + ObservationNeed; no VOI/cost", () => {
      const a = assessAttentionCandidateConsideration(
        baseCandidate("OBSERVATION_NEED")
      );
      assertOnly(a, ["SITUATION_UNRESOLVEDNESS", "OBSERVATION_NEED"]);
      assert.equal(statusOf(a, "INFORMATION_GAIN"), "NO_DIRECT_BASIS_REPRESENTED");
      assert.equal(statusOf(a, "OBSERVATION_COST"), "NO_DIRECT_BASIS_REPRESENTED");
    });
  });

  describe("Resource mappings / firewalls", () => {
    it("all Resource Finding kinds → RESOURCE_STRUCTURAL_DISCOVERY only", () => {
      const kinds: ResourceContentionFindingKind[] = [
        "RESOURCE_RESERVATION_OVERLAP_PRESENT",
        "RESOURCE_RESERVATION_REPRESENTATION_AMBIGUITY",
        "RESOURCE_CAPACITY_RELATION_DIVERGENCE",
        "RESOURCE_LOAD_ABOVE_DECLARED_CAPACITY_BASIS",
        "RESOURCE_CAPACITY_BASIS_MISSING",
      ];
      for (const kind of kinds) {
        const a = assessAttentionCandidateConsideration(
          resourceCandidate(kind)
        );
        assertOnly(a, ["RESOURCE_STRUCTURAL_DISCOVERY"]);
        assert.equal(
          a.dimensions.find((d) => d.dimension === "RESOURCE_STRUCTURAL_DISCOVERY")!
            .basis_atoms[0]!.source_semantic_kind,
          kind
        );
      }
    });

    it("Resource ambiguity does not become Situation unresolvedness / epistemic gap", () => {
      const a = assessAttentionCandidateConsideration(
        resourceCandidate("RESOURCE_RESERVATION_REPRESENTATION_AMBIGUITY")
      );
      assert.equal(
        statusOf(a, "SITUATION_UNRESOLVEDNESS"),
        "NO_DIRECT_BASIS_REPRESENTED"
      );
    });

    it("Load above / Capacity missing do not create Impact / ObservationNeed / urgency", () => {
      for (const kind of [
        "RESOURCE_LOAD_ABOVE_DECLARED_CAPACITY_BASIS",
        "RESOURCE_CAPACITY_BASIS_MISSING",
      ] as const) {
        const a = assessAttentionCandidateConsideration(
          resourceCandidate(kind)
        );
        assert.equal(statusOf(a, "IMPACT"), "NO_DIRECT_BASIS_REPRESENTED");
        assert.equal(
          statusOf(a, "OBSERVATION_NEED"),
          "NO_DIRECT_BASIS_REPRESENTED"
        );
        assert.equal(
          statusOf(a, "TEMPORAL_URGENCY"),
          "NO_DIRECT_BASIS_REPRESENTED"
        );
      }
    });
  });

  describe("Absence / comparison / set boundaries", () => {
    it("unsupported dimensions are NO_DIRECT_BASIS_REPRESENTED for all current sources", () => {
      const candidates = [
        baseCandidate("ONTIC_EVENT_PRESENT"),
        baseCandidate("EPISTEMIC_GAP"),
        resourceCandidate("RESOURCE_CAPACITY_BASIS_MISSING"),
      ];
      for (const candidate of candidates) {
        const a = assessAttentionCandidateConsideration(candidate);
        for (const dim of [
          "IMPACT",
          "REVERSIBILITY",
          "OBSERVATION_COST",
          "INFORMATION_GAIN",
          "TEMPORAL_URGENCY",
        ] as const) {
          assert.equal(statusOf(a, dim), "NO_DIRECT_BASIS_REPRESENTED");
        }
        assert.ok(
          a.unrepresented_dimensions.includes("IMPACT") &&
            !a.represented_dimensions.includes("IMPACT")
        );
      }
    });

    it("empty Candidate Set → empty assessments; no Attention conclusion", () => {
      const set = emptyCandidateSet([]);
      const before = structuredClone(set);
      const assessment = buildAttentionConsiderationBasisSet(set);
      assert.deepEqual(assessment.candidate_assessments, []);
      assert.deepEqual(set, before);
      assert.deepEqual(
        assessment.model_limitations,
        ATTENTION_CONSIDERATION_MODEL_LIMITATIONS
      );
    });

    it("base + Resource assessed independently without merge or ranking", () => {
      const candidates = [
        baseCandidate("EPISTEMIC_GAP"),
        resourceCandidate("RESOURCE_CAPACITY_BASIS_MISSING"),
        baseCandidate("OBSERVATION_NEED"),
      ];
      const set = emptyCandidateSet(candidates);
      const beforeCandidates = structuredClone(candidates);
      const assessment = buildAttentionConsiderationBasisSet(set);
      assert.equal(assessment.candidate_assessments.length, 3);
      assert.deepEqual(
        assessment.candidate_assessments.map((a) => a.candidate_key),
        candidates.map((c) => c.key)
      );
      assert.deepEqual(candidates, beforeCandidates);
      // OBSERVATION_NEED has two dimensions — not ranked above gap
      assert.equal(
        assessment.candidate_assessments[2]!.represented_dimensions.length,
        2
      );
      assert.equal(
        assessment.candidate_assessments[0]!.represented_dimensions.length,
        1
      );
      const json = JSON.stringify(assessment);
      assert.ok(!/"priority"\s*:/.test(json));
      assert.ok(!/"score"\s*:/.test(json));
      assert.ok(!/"rank"\s*:/.test(json));
      assert.ok(!/"selected"\s*:/.test(json));
      assert.ok(!/"utility"\s*:/.test(json));
      assert.ok(!/"weight"\s*:/.test(json));
      assert.ok(!json.includes("compareAttention"));
      assert.ok(!json.includes("dominates"));
      assert.ok(!json.includes('"PROBLEM"'));
      assert.ok(!json.includes('"RISK"'));
    });

    it("determinism: repeated assessment deepEqual; dimension order fixed", () => {
      const candidate = baseCandidate("OBSERVATION_NEED");
      const a = assessAttentionCandidateConsideration(candidate);
      const b = assessAttentionCandidateConsideration(candidate);
      assert.deepEqual(a, b);
      assert.deepEqual(
        a.dimensions.map((d) => d.dimension),
        ATTENTION_CONSIDERATION_DIMENSION_ORDER
      );
      assert.ok(
        a.dimensions.every((d) =>
          d.basis_atoms.every((atom) => !("value" in atom) && !("score" in atom))
        )
      );
    });
  });
});
