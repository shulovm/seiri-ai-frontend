/**
 * GROUND-042 — Attention Core III / Basis Coverage & Capability Gap Classification
 *
 * Pure 041 → coverage classification (no ProjectState enrichment).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  ATTENTION_BASIS_COVERAGE_MODEL_LIMITATIONS,
  assessAttentionCandidateBasisCoverage,
  buildAttentionBasisCoverageSet,
} from "../reality/attention-basis-coverage-core.js";
import {
  ATTENTION_CONSIDERATION_DIMENSION_ORDER,
  assessAttentionCandidateConsideration,
  buildAttentionConsiderationBasisSet,
} from "../reality/attention-consideration-core.js";
import type {
  AttentionCandidate,
  AttentionCandidateSetAssessment,
} from "../reality/attention-candidate-types.js";
import type {
  AttentionCandidateConsiderationAssessment,
  AttentionConsiderationBasisAtom,
  AttentionConsiderationDimension,
} from "../reality/attention-consideration-types.js";
import type { AttentionBasisCoverageStatus } from "../reality/attention-basis-coverage-types.js";
import type { SalienceSignal, SalienceSignalKind } from "../reality/situation-types.js";
import type { ResourceContentionFindingKind } from "../reality/resource-contention-discovery-types.js";
import type { ResourceSituationSalienceSignal } from "../reality/resource-situation-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const SUBJECT = "ff010101-0101-4101-8101-010101010101";
const RES_A = "ff060606-0606-4606-8606-060606060601";
const AT = "2026-09-01T10:00:00.000Z";

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

function coverageOf(
  assessment: ReturnType<typeof assessAttentionCandidateBasisCoverage>,
  dimension: AttentionConsiderationDimension
): AttentionBasisCoverageStatus {
  return assessment.dimensions.find((d) => d.dimension === dimension)!
    .coverage_status;
}

function gapOf(
  assessment: ReturnType<typeof assessAttentionCandidateBasisCoverage>,
  dimension: AttentionConsiderationDimension
) {
  return assessment.dimensions.find((d) => d.dimension === dimension)!
    .capability_gap;
}

function acquisitionOf(
  assessment: ReturnType<typeof assessAttentionCandidateBasisCoverage>,
  dimension: AttentionConsiderationDimension
) {
  return assessment.dimensions.find((d) => d.dimension === dimension)!
    .acquisition_status;
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

function withSyntheticDirectBasis(
  base: AttentionCandidateConsiderationAssessment,
  dimension: AttentionConsiderationDimension
): AttentionCandidateConsiderationAssessment {
  const atom: AttentionConsiderationBasisAtom = {
    key: `attention-basis-atom|${base.candidate_key}|${dimension}|synthetic`,
    candidate_key: base.candidate_key,
    dimension,
    source_kind: base.candidate.source_kind,
    source_semantic_kind: "SYNTHETIC_DIRECT_BASIS",
    source_key: "synthetic",
  };
  const dimensions = base.dimensions.map((d) =>
    d.dimension === dimension
      ? {
          dimension,
          status: "DIRECT_BASIS_PRESENT" as const,
          basis_atoms: [atom],
        }
      : d
  );
  return {
    ...base,
    dimensions,
    represented_dimensions: dimensions
      .filter((d) => d.status === "DIRECT_BASIS_PRESENT")
      .map((d) => d.dimension),
    unrepresented_dimensions: dimensions
      .filter((d) => d.status === "NO_DIRECT_BASIS_REPRESENTED")
      .map((d) => d.dimension),
  };
}

function assertNoForbidden(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"COMPLETE"/.test(json));
  assert.ok(!/"INCOMPLETE"/.test(json));
  assert.ok(!/"READY"/.test(json));
  assert.ok(!/"NOT_READY"/.test(json));
  assert.ok(!/"RequiredDimension"/.test(json));
  assert.ok(!/"must_acquire"/.test(json));
  assert.ok(!/"priority"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"rank"\s*:/.test(json));
  assert.ok(!/"coverage_score"/.test(json));
  assert.ok(!json.includes('"PROBLEM"'));
  assert.ok(!json.includes('"RISK"'));
}

describe("Attention Basis Coverage (GROUND-042)", () => {
  describe("Schema / purity", () => {
    it("schema 0.1.24; pure 041 transform; no enrichment runtimes", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(__dirnameTest, "../reality/attention-basis-coverage-core.ts"),
        "utf8"
      );
      const types = readFileSync(
        join(__dirnameTest, "../reality/attention-basis-coverage-types.ts"),
        "utf8"
      );
      assert.ok(!/from ["'].*state-engine/.test(core));
      assert.ok(!/from ["'].*file-store/.test(core));
      assert.ok(!/from ["'].*studio\//.test(core));
      assert.ok(!/from ["'].*resource-situation/.test(core));
      assert.ok(!/from ["'].*impact/.test(core));
      assert.ok(!/from ["'].*decision/.test(core));
      assert.ok(!/from ["'].*inquiry/.test(core));
      assert.ok(!/from ["'].*observation-need/.test(core));
      assert.ok(!/import type \{[^}]*ProjectState/.test(core));
      assert.ok(!/\(projectState/.test(core));
      assert.ok(!/"COMPLETE"|"READY"|"RequiredDimension"/.test(types));
      assert.deepEqual(
        ATTENTION_CONSIDERATION_DIMENSION_ORDER.length,
        9
      );
    });
  });

  describe("Coverage classification", () => {
    it("ONTIC_EVENT_PRESENT: activity available; structural absences; linkage/estimation gaps", () => {
      const coverage = assessAttentionCandidateBasisCoverage(
        assessAttentionCandidateConsideration(
          baseCandidate("ONTIC_EVENT_PRESENT")
        )
      );
      assert.equal(
        coverageOf(coverage, "STRUCTURAL_ACTIVITY"),
        "DIRECT_BASIS_AVAILABLE"
      );
      assert.equal(
        coverageOf(coverage, "SITUATION_UNRESOLVEDNESS"),
        "SOURCE_DOES_NOT_REPRESENT_DIMENSION"
      );
      assert.equal(
        coverageOf(coverage, "OBSERVATION_NEED"),
        "SOURCE_DOES_NOT_REPRESENT_DIMENSION"
      );
      assert.equal(gapOf(coverage, "SITUATION_UNRESOLVEDNESS"), null);
      assert.equal(
        coverageOf(coverage, "IMPACT"),
        "MODEL_LINKAGE_NOT_AVAILABLE"
      );
      assert.equal(
        coverageOf(coverage, "REVERSIBILITY"),
        "MODEL_LINKAGE_NOT_AVAILABLE"
      );
      assert.equal(
        coverageOf(coverage, "OBSERVATION_COST"),
        "MODEL_ESTIMATION_NOT_AVAILABLE"
      );
      assert.equal(
        coverageOf(coverage, "INFORMATION_GAIN"),
        "MODEL_ESTIMATION_NOT_AVAILABLE"
      );
      assert.equal(
        coverageOf(coverage, "TEMPORAL_URGENCY"),
        "MODEL_ESTIMATION_NOT_AVAILABLE"
      );
      assert.equal(
        gapOf(coverage, "IMPACT")!.gap_kind,
        "EXPLICIT_LINKAGE_CAPABILITY_GAP"
      );
      assert.equal(
        gapOf(coverage, "IMPACT")!.reason,
        "CANDIDATE_IMPACT_LINKAGE_NOT_MODELED"
      );
      assert.equal(
        acquisitionOf(coverage, "IMPACT"),
        "ACQUISITION_PATHWAY_NOT_MODELED"
      );
      assert.equal(
        acquisitionOf(coverage, "OBSERVATION_NEED"),
        "NO_ACQUISITION_REQUIREMENT_INFERRED"
      );
      assertNoForbidden(coverage);
    });

    it("EPISTEMIC_GAP: unresolved available; ObservationNeed source-absent; IG estimation gap", () => {
      const coverage = assessAttentionCandidateBasisCoverage(
        assessAttentionCandidateConsideration(baseCandidate("EPISTEMIC_GAP"))
      );
      assert.equal(
        coverageOf(coverage, "SITUATION_UNRESOLVEDNESS"),
        "DIRECT_BASIS_AVAILABLE"
      );
      assert.equal(
        coverageOf(coverage, "OBSERVATION_NEED"),
        "SOURCE_DOES_NOT_REPRESENT_DIMENSION"
      );
      assert.equal(gapOf(coverage, "OBSERVATION_NEED"), null);
      assert.equal(
        coverageOf(coverage, "INFORMATION_GAIN"),
        "MODEL_ESTIMATION_NOT_AVAILABLE"
      );
      assert.equal(
        gapOf(coverage, "INFORMATION_GAIN")!.gap_kind,
        "ESTIMATION_CAPABILITY_GAP"
      );
    });

    it("OPEN_INQUIRY ObservationNeed is source absence, not model gap", () => {
      const coverage = assessAttentionCandidateBasisCoverage(
        assessAttentionCandidateConsideration(baseCandidate("OPEN_INQUIRY"))
      );
      assert.equal(
        coverageOf(coverage, "OBSERVATION_NEED"),
        "SOURCE_DOES_NOT_REPRESENT_DIMENSION"
      );
      assert.equal(gapOf(coverage, "OBSERVATION_NEED"), null);
    });

    it("OBSERVATION_NEED: dual direct; cost/IG remain estimation gaps", () => {
      const coverage = assessAttentionCandidateBasisCoverage(
        assessAttentionCandidateConsideration(
          baseCandidate("OBSERVATION_NEED")
        )
      );
      assert.equal(
        coverageOf(coverage, "SITUATION_UNRESOLVEDNESS"),
        "DIRECT_BASIS_AVAILABLE"
      );
      assert.equal(
        coverageOf(coverage, "OBSERVATION_NEED"),
        "DIRECT_BASIS_AVAILABLE"
      );
      assert.equal(
        coverageOf(coverage, "OBSERVATION_COST"),
        "MODEL_ESTIMATION_NOT_AVAILABLE"
      );
      assert.equal(
        coverageOf(coverage, "INFORMATION_GAIN"),
        "MODEL_ESTIMATION_NOT_AVAILABLE"
      );
    });

    it("Resource findings: structural available; unresolved/ObservationNeed source-absent", () => {
      for (const kind of [
        "RESOURCE_RESERVATION_OVERLAP_PRESENT",
        "RESOURCE_RESERVATION_REPRESENTATION_AMBIGUITY",
        "RESOURCE_CAPACITY_BASIS_MISSING",
      ] as const) {
        const coverage = assessAttentionCandidateBasisCoverage(
          assessAttentionCandidateConsideration(resourceCandidate(kind))
        );
        assert.equal(
          coverageOf(coverage, "RESOURCE_STRUCTURAL_DISCOVERY"),
          "DIRECT_BASIS_AVAILABLE"
        );
        assert.equal(
          coverageOf(coverage, "SITUATION_UNRESOLVEDNESS"),
          "SOURCE_DOES_NOT_REPRESENT_DIMENSION"
        );
        assert.equal(
          coverageOf(coverage, "OBSERVATION_NEED"),
          "SOURCE_DOES_NOT_REPRESENT_DIMENSION"
        );
        assert.equal(gapOf(coverage, "OBSERVATION_NEED"), null);
        assert.equal(
          coverageOf(coverage, "IMPACT"),
          "MODEL_LINKAGE_NOT_AVAILABLE"
        );
      }
    });
  });

  describe("Invariants / overrides / set", () => {
    it("source absence never creates capability gap; model statuses always do", () => {
      const coverage = assessAttentionCandidateBasisCoverage(
        assessAttentionCandidateConsideration(
          baseCandidate("ONTIC_EVENT_PRESENT")
        )
      );
      for (const dim of coverage.dimensions) {
        if (dim.coverage_status === "SOURCE_DOES_NOT_REPRESENT_DIMENSION") {
          assert.equal(dim.capability_gap, null);
          assert.equal(
            dim.acquisition_status,
            "NO_ACQUISITION_REQUIREMENT_INFERRED"
          );
        }
        if (dim.coverage_status === "DIRECT_BASIS_AVAILABLE") {
          assert.equal(dim.capability_gap, null);
          assert.equal(dim.acquisition_status, "BASIS_ALREADY_REPRESENTED");
        }
        if (dim.coverage_status === "MODEL_LINKAGE_NOT_AVAILABLE") {
          assert.ok(dim.capability_gap);
          assert.equal(
            dim.capability_gap!.gap_kind,
            "EXPLICIT_LINKAGE_CAPABILITY_GAP"
          );
        }
        if (dim.coverage_status === "MODEL_ESTIMATION_NOT_AVAILABLE") {
          assert.ok(dim.capability_gap);
          assert.equal(
            dim.capability_gap!.gap_kind,
            "ESTIMATION_CAPABILITY_GAP"
          );
        }
      }
      assert.equal(
        coverage.capability_gaps.length,
        coverage.dimensions.filter((d) => d.capability_gap !== null).length
      );
    });

    it("direct IMPACT / INFORMATION_GAIN basis overrides model-gap classification", () => {
      const base = assessAttentionCandidateConsideration(
        baseCandidate("ONTIC_EVENT_PRESENT")
      );
      const withImpact = withSyntheticDirectBasis(base, "IMPACT");
      const impactCoverage = assessAttentionCandidateBasisCoverage(withImpact);
      assert.equal(
        coverageOf(impactCoverage, "IMPACT"),
        "DIRECT_BASIS_AVAILABLE"
      );
      assert.equal(gapOf(impactCoverage, "IMPACT"), null);
      assert.equal(
        acquisitionOf(impactCoverage, "IMPACT"),
        "BASIS_ALREADY_REPRESENTED"
      );

      const withIg = withSyntheticDirectBasis(base, "INFORMATION_GAIN");
      const igCoverage = assessAttentionCandidateBasisCoverage(withIg);
      assert.equal(
        coverageOf(igCoverage, "INFORMATION_GAIN"),
        "DIRECT_BASIS_AVAILABLE"
      );
      assert.equal(gapOf(igCoverage, "INFORMATION_GAIN"), null);
    });

    it("empty set / immutability / determinism / no ranking fields", () => {
      const empty = buildAttentionConsiderationBasisSet(emptyCandidateSet([]));
      const emptyCoverage = buildAttentionBasisCoverageSet(empty);
      assert.deepEqual(emptyCoverage.candidate_coverage, []);

      const candidates = [
        baseCandidate("EPISTEMIC_GAP"),
        resourceCandidate("RESOURCE_CAPACITY_BASIS_MISSING"),
      ];
      const consideration = buildAttentionConsiderationBasisSet(
        emptyCandidateSet(candidates)
      );
      const before = structuredClone(consideration);
      const a = buildAttentionBasisCoverageSet(consideration);
      const b = buildAttentionBasisCoverageSet(consideration);
      assert.deepEqual(a, b);
      assert.deepEqual(consideration, before);
      assert.deepEqual(
        a.model_limitations,
        ATTENTION_BASIS_COVERAGE_MODEL_LIMITATIONS
      );
      assert.deepEqual(
        a.candidate_coverage.map((c) => c.candidate_key),
        candidates.map((c) => c.key)
      );
      assertNoForbidden(a);
    });
  });
});
