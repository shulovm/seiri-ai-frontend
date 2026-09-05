/**
 * GROUND-043 — Attention Core IV / Explicit Basis Requirement Foundation
 *
 * Pure 042 coverage + explicit requirement specification (no ProjectState enrichment).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  assessAttentionCandidateBasisCoverage,
  buildAttentionBasisCoverageSet,
} from "../reality/attention-basis-coverage-core.js";
import {
  ATTENTION_BASIS_REQUIREMENT_MODEL_LIMITATIONS,
  assessAttentionCandidateRequirements,
  buildAttentionBasisRequirementSet,
  normalizeAttentionBasisRequirementSpecification,
} from "../reality/attention-basis-requirement-core.js";
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
  AttentionConsiderationBasisAtom,
  AttentionConsiderationDimension,
} from "../reality/attention-consideration-types.js";
import type {
  AttentionBasisCoverageSetAssessment,
  AttentionBasisCoverageStatus,
  AttentionCandidateBasisCoverageAssessment,
} from "../reality/attention-basis-coverage-types.js";
import type {
  AttentionBasisRequirementSpecification,
  AttentionRequiredBasisState,
} from "../reality/attention-basis-requirement-types.js";
import type { SalienceSignal, SalienceSignalKind } from "../reality/situation-types.js";
import type { ResourceContentionFindingKind } from "../reality/resource-contention-discovery-types.js";
import type { ResourceSituationSalienceSignal } from "../reality/resource-situation-types.js";
import { SCHEMA_VERSION } from "../types.js";

const __dirnameTest = dirname(fileURLToPath(import.meta.url));

const SUBJECT = "ff010101-0101-4101-8101-010101010101";
const RES_A = "ff060606-0606-4606-8606-060606060601";
const AT = "2026-09-01T10:00:00.000Z";

const EMPTY_SPEC: AttentionBasisRequirementSpecification = {
  required_for_all_candidates: [],
  candidate_requirements: [],
};

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

function coverageFor(
  candidate: AttentionCandidate
): AttentionCandidateBasisCoverageAssessment {
  return assessAttentionCandidateBasisCoverage(
    assessAttentionCandidateConsideration(candidate)
  );
}

function coverageSetFor(
  candidates: AttentionCandidate[]
): AttentionBasisCoverageSetAssessment {
  return buildAttentionBasisCoverageSet(
    buildAttentionConsiderationBasisSet(emptyCandidateSet(candidates))
  );
}

function reqStateOf(
  assessment: ReturnType<typeof assessAttentionCandidateRequirements>,
  dimension: AttentionConsiderationDimension
): AttentionRequiredBasisState {
  return assessment.dimensions.find((d) => d.dimension === dimension)!
    .required_basis_state;
}

function reqStatusOf(
  assessment: ReturnType<typeof assessAttentionCandidateRequirements>,
  dimension: AttentionConsiderationDimension
) {
  return assessment.dimensions.find((d) => d.dimension === dimension)!
    .requirement_status;
}

function reqGapOf(
  assessment: ReturnType<typeof assessAttentionCandidateRequirements>,
  dimension: AttentionConsiderationDimension
) {
  return assessment.dimensions.find((d) => d.dimension === dimension)!
    .required_basis_gap;
}

function coverageStatusOf(
  coverage: AttentionCandidateBasisCoverageAssessment,
  dimension: AttentionConsiderationDimension
): AttentionBasisCoverageStatus {
  return coverage.dimensions.find((d) => d.dimension === dimension)!
    .coverage_status;
}

function withSyntheticDirectBasisCoverage(
  coverage: AttentionCandidateBasisCoverageAssessment,
  dimension: AttentionConsiderationDimension
): AttentionCandidateBasisCoverageAssessment {
  const atom: AttentionConsiderationBasisAtom = {
    key: `attention-basis-atom|${coverage.candidate_key}|${dimension}|synthetic`,
    candidate_key: coverage.candidate_key,
    dimension,
    source_kind: coverage.candidate.source_kind,
    source_semantic_kind: "SYNTHETIC_DIRECT_BASIS",
    source_key: "synthetic",
  };
  const dimensions = coverage.dimensions.map((d) =>
    d.dimension === dimension
      ? {
          ...d,
          basis_status: "DIRECT_BASIS_PRESENT" as const,
          coverage_status: "DIRECT_BASIS_AVAILABLE" as const,
          basis_atoms: [atom],
          capability_gap: null,
          acquisition_status: "BASIS_ALREADY_REPRESENTED" as const,
        }
      : d
  );
  return {
    ...coverage,
    dimensions,
    capability_gaps: dimensions
      .map((d) => d.capability_gap)
      .filter((g) => g !== null),
    has_capability_gaps: dimensions.some((d) => d.capability_gap !== null),
  };
}

function assertNoForbidden(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"COMPLETE"/.test(json));
  assert.ok(!/"INCOMPLETE"/.test(json));
  assert.ok(!/"READY"/.test(json));
  assert.ok(!/"NOT_READY"/.test(json));
  assert.ok(!/"SELECTION_READY"/.test(json));
  assert.ok(!/"BLOCKED"/.test(json));
  assert.ok(!/"UNBLOCKED"/.test(json));
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"OPTIONAL"/.test(json));
  assert.ok(!/"IRRELEVANT"/.test(json));
  assert.ok(!/"NOT_NEEDED"/.test(json));
  assert.ok(!/"FORBIDDEN"/.test(json));
  assert.ok(!/"HARD"/.test(json));
  assert.ok(!/"SOFT"/.test(json));
  assert.ok(!/"MUST"/.test(json));
  assert.ok(!/"SHOULD"/.test(json));
  assert.ok(!/"priority"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"rank"\s*:/.test(json));
  assert.ok(!/"declared_by"/.test(json));
  assert.ok(!/"required_by"/.test(json));
  assert.ok(!/"policy_source"/.test(json));
  assert.ok(!json.includes('"PROBLEM"'));
  assert.ok(!json.includes('"RISK"'));
  assert.ok(!json.includes('"NEED"'));
  assert.ok(!json.includes('"BLOCKER"'));
}

describe("Attention Basis Requirement (GROUND-043)", () => {
  describe("Schema / purity", () => {
    it("schema 0.1.24; pure 042 transform; no enrichment runtimes", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(__dirnameTest, "../reality/attention-basis-requirement-core.ts"),
        "utf8"
      );
      const types = readFileSync(
        join(__dirnameTest, "../reality/attention-basis-requirement-types.ts"),
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
      assert.ok(!/"READY"|"COMPLETE"|"SATISFIED"|"OPTIONAL"/.test(types));
      assert.deepEqual(
        ATTENTION_CONSIDERATION_DIMENSION_ORDER.length,
        9
      );
    });
  });

  describe("Empty requirement specification", () => {
    it("all dimensions NOT_DECLARED_REQUIRED; no required basis gaps", () => {
      const coverage = coverageFor(baseCandidate("EPISTEMIC_GAP"));
      const assessment = assessAttentionCandidateRequirements(
        coverage,
        EMPTY_SPEC
      );
      for (const dim of ATTENTION_CONSIDERATION_DIMENSION_ORDER) {
        assert.equal(reqStatusOf(assessment, dim), "NOT_DECLARED_REQUIRED");
        assert.equal(reqStateOf(assessment, dim), "NOT_DECLARED_REQUIRED");
        assert.equal(reqGapOf(assessment, dim), null);
      }
      assert.deepEqual(assessment.required_basis_gaps, []);
      assert.equal(assessment.has_explicit_requirements, false);
      assert.equal(assessment.has_required_basis_gaps, false);
      assertNoForbidden(assessment);
    });

    it("capability gaps visible in coverage but no requirement gaps", () => {
      const coverage = coverageFor(baseCandidate("ONTIC_EVENT_PRESENT"));
      const assessment = assessAttentionCandidateRequirements(
        coverage,
        EMPTY_SPEC
      );
      assert.ok(coverage.has_capability_gaps);
      assert.deepEqual(assessment.required_basis_gaps, []);
      for (const dim of [
        "IMPACT",
        "REVERSIBILITY",
        "OBSERVATION_COST",
        "INFORMATION_GAIN",
        "TEMPORAL_URGENCY",
      ] as const) {
        assert.equal(reqStateOf(assessment, dim), "NOT_DECLARED_REQUIRED");
        assert.equal(reqGapOf(assessment, dim), null);
      }
    });
  });

  describe("Global requirements", () => {
    it("STRUCTURAL_ACTIVITY: direct basis → REQUIRED_AND_DIRECT_BASIS_AVAILABLE", () => {
      const coverage = coverageFor(baseCandidate("ONTIC_EVENT_PRESENT"));
      const assessment = assessAttentionCandidateRequirements(coverage, {
        required_for_all_candidates: ["STRUCTURAL_ACTIVITY"],
        candidate_requirements: [],
      });
      assert.equal(
        reqStatusOf(assessment, "STRUCTURAL_ACTIVITY"),
        "EXPLICITLY_REQUIRED"
      );
      assert.equal(
        reqStateOf(assessment, "STRUCTURAL_ACTIVITY"),
        "REQUIRED_AND_DIRECT_BASIS_AVAILABLE"
      );
      assert.equal(reqGapOf(assessment, "STRUCTURAL_ACTIVITY"), null);
    });

    it("OBSERVATION_NEED: source absent → SOURCE_NON_REPRESENTATION_GAP", () => {
      const coverage = coverageFor(baseCandidate("ONTIC_EVENT_PRESENT"));
      const assessment = assessAttentionCandidateRequirements(coverage, {
        required_for_all_candidates: ["OBSERVATION_NEED"],
        candidate_requirements: [],
      });
      assert.equal(
        reqStateOf(assessment, "OBSERVATION_NEED"),
        "REQUIRED_BUT_SOURCE_DOES_NOT_REPRESENT_DIMENSION"
      );
      const gap = reqGapOf(assessment, "OBSERVATION_NEED")!;
      assert.equal(gap.gap_kind, "SOURCE_NON_REPRESENTATION_GAP");
      assert.equal(gap.capability_gap, null);
    });

    it("IMPACT: model linkage gap preserved", () => {
      const coverage = coverageFor(baseCandidate("ONTIC_EVENT_PRESENT"));
      const assessment = assessAttentionCandidateRequirements(coverage, {
        required_for_all_candidates: ["IMPACT"],
        candidate_requirements: [],
      });
      assert.equal(
        reqStateOf(assessment, "IMPACT"),
        "REQUIRED_BUT_MODEL_LINKAGE_NOT_AVAILABLE"
      );
      const gap = reqGapOf(assessment, "IMPACT")!;
      assert.equal(gap.gap_kind, "MODEL_LINKAGE_CAPABILITY_GAP");
      assert.equal(
        gap.capability_gap!.reason,
        "CANDIDATE_IMPACT_LINKAGE_NOT_MODELED"
      );
    });

    it("REVERSIBILITY: model linkage gap", () => {
      const coverage = coverageFor(baseCandidate("ONTIC_EVENT_PRESENT"));
      const assessment = assessAttentionCandidateRequirements(coverage, {
        required_for_all_candidates: ["REVERSIBILITY"],
        candidate_requirements: [],
      });
      assert.equal(
        reqStateOf(assessment, "REVERSIBILITY"),
        "REQUIRED_BUT_MODEL_LINKAGE_NOT_AVAILABLE"
      );
      assert.equal(
        reqGapOf(assessment, "REVERSIBILITY")!.gap_kind,
        "MODEL_LINKAGE_CAPABILITY_GAP"
      );
    });

    it("OBSERVATION_COST / INFORMATION_GAIN / TEMPORAL_URGENCY: estimation gaps", () => {
      const coverage = coverageFor(baseCandidate("ONTIC_EVENT_PRESENT"));
      for (const dim of [
        "OBSERVATION_COST",
        "INFORMATION_GAIN",
        "TEMPORAL_URGENCY",
      ] as const) {
        const assessment = assessAttentionCandidateRequirements(coverage, {
          required_for_all_candidates: [dim],
          candidate_requirements: [],
        });
        assert.equal(
          reqStateOf(assessment, dim),
          "REQUIRED_BUT_MODEL_ESTIMATION_NOT_AVAILABLE"
        );
        assert.equal(
          reqGapOf(assessment, dim)!.gap_kind,
          "MODEL_ESTIMATION_CAPABILITY_GAP"
        );
      }
    });
  });

  describe("Candidate-specific and union requirements", () => {
    it("only specified Candidate gets INFORMATION_GAIN requirement", () => {
      const candA = baseCandidate("EPISTEMIC_GAP", "sig|A");
      const candB = baseCandidate("EPISTEMIC_GAP", "sig|B");
      const coverageSet = coverageSetFor([candA, candB]);
      const result = buildAttentionBasisRequirementSet(coverageSet, {
        required_for_all_candidates: [],
        candidate_requirements: [
          { candidate_key: candA.key, required_dimensions: ["INFORMATION_GAIN"] },
        ],
      });
      const assessA = result.candidate_requirements[0];
      const assessB = result.candidate_requirements[1];
      assert.equal(
        reqStatusOf(assessA, "INFORMATION_GAIN"),
        "EXPLICITLY_REQUIRED"
      );
      assert.equal(
        reqStatusOf(assessB, "INFORMATION_GAIN"),
        "NOT_DECLARED_REQUIRED"
      );
      assert.equal(reqGapOf(assessB, "INFORMATION_GAIN"), null);
    });

    it("global IMPACT + candidate INFORMATION_GAIN union", () => {
      const candA = baseCandidate("EPISTEMIC_GAP", "sig|A");
      const candB = baseCandidate("EPISTEMIC_GAP", "sig|B");
      const coverageSet = coverageSetFor([candA, candB]);
      const result = buildAttentionBasisRequirementSet(coverageSet, {
        required_for_all_candidates: ["IMPACT"],
        candidate_requirements: [
          { candidate_key: candA.key, required_dimensions: ["INFORMATION_GAIN"] },
        ],
      });
      assert.deepEqual(
        result.candidate_requirements[0].effective_required_dimensions,
        ["IMPACT", "INFORMATION_GAIN"]
      );
      assert.deepEqual(
        result.candidate_requirements[1].effective_required_dimensions,
        ["IMPACT"]
      );
    });
  });

  describe("Normalization / validation", () => {
    it("dedupes global and candidate dimensions; merges duplicate candidate entries", () => {
      const cand = baseCandidate("ONTIC_EVENT_PRESENT");
      const coverageSet = coverageSetFor([cand]);
      const spec: AttentionBasisRequirementSpecification = {
        required_for_all_candidates: ["IMPACT", "IMPACT", "REVERSIBILITY"],
        candidate_requirements: [
          { candidate_key: cand.key, required_dimensions: ["INFORMATION_GAIN"] },
          {
            candidate_key: cand.key,
            required_dimensions: ["TEMPORAL_URGENCY", "INFORMATION_GAIN"],
          },
        ],
      };
      const normalized = normalizeAttentionBasisRequirementSpecification(
        coverageSet,
        spec
      );
      assert.deepEqual(normalized.required_for_all_candidates, [
        "IMPACT",
        "REVERSIBILITY",
      ]);
      assert.deepEqual(
        normalized.candidate_requirements[0].required_dimensions,
        ["INFORMATION_GAIN", "TEMPORAL_URGENCY"]
      );
    });

    it("input order invariance", () => {
      const candA = baseCandidate("EPISTEMIC_GAP", "sig|A");
      const candB = baseCandidate("ONTIC_EVENT_PRESENT", "sig|B");
      const coverageSet = coverageSetFor([candA, candB]);
      const specA: AttentionBasisRequirementSpecification = {
        required_for_all_candidates: ["IMPACT", "REVERSIBILITY"],
        candidate_requirements: [
          { candidate_key: candA.key, required_dimensions: ["INFORMATION_GAIN"] },
          { candidate_key: candB.key, required_dimensions: ["TEMPORAL_URGENCY"] },
        ],
      };
      const specB: AttentionBasisRequirementSpecification = {
        required_for_all_candidates: ["REVERSIBILITY", "IMPACT"],
        candidate_requirements: [
          { candidate_key: candB.key, required_dimensions: ["TEMPORAL_URGENCY"] },
          { candidate_key: candA.key, required_dimensions: ["INFORMATION_GAIN"] },
        ],
      };
      const a = buildAttentionBasisRequirementSet(coverageSet, specA);
      const b = buildAttentionBasisRequirementSet(coverageSet, specB);
      assert.deepEqual(a, b);
    });

    it("rejects unknown candidate key", () => {
      const coverageSet = coverageSetFor([baseCandidate("EPISTEMIC_GAP")]);
      assert.throws(
        () =>
          buildAttentionBasisRequirementSet(coverageSet, {
            required_for_all_candidates: [],
            candidate_requirements: [
              {
                candidate_key: "missing-candidate",
                required_dimensions: ["IMPACT"],
              },
            ],
          }),
        /AttentionCandidate missing-candidate not found in coverage set/
      );
    });

    it("rejects invalid dimension", () => {
      const coverage = coverageFor(baseCandidate("EPISTEMIC_GAP"));
      assert.throws(
        () =>
          assessAttentionCandidateRequirements(coverage, {
            required_for_all_candidates: ["INVALID_DIM" as AttentionConsiderationDimension],
            candidate_requirements: [],
          }),
        /Invalid AttentionConsiderationDimension/
      );
    });
  });

  describe("No implicit requirement inference", () => {
    it("OBSERVATION_NEED Candidate does not auto-require INFORMATION_GAIN", () => {
      const coverage = coverageFor(baseCandidate("OBSERVATION_NEED"));
      const assessment = assessAttentionCandidateRequirements(
        coverage,
        EMPTY_SPEC
      );
      assert.equal(
        reqStateOf(assessment, "INFORMATION_GAIN"),
        "NOT_DECLARED_REQUIRED"
      );
    });

    it("Resource finding does not auto-require IMPACT", () => {
      const coverage = coverageFor(
        resourceCandidate("RESOURCE_CAPACITY_BASIS_MISSING")
      );
      const assessment = assessAttentionCandidateRequirements(
        coverage,
        EMPTY_SPEC
      );
      assert.equal(reqStateOf(assessment, "IMPACT"), "NOT_DECLARED_REQUIRED");
    });

    it("EPISTEMIC_GAP does not auto-require OBSERVATION_NEED", () => {
      const coverage = coverageFor(baseCandidate("EPISTEMIC_GAP"));
      const assessment = assessAttentionCandidateRequirements(
        coverage,
        EMPTY_SPEC
      );
      assert.equal(
        reqStateOf(assessment, "OBSERVATION_NEED"),
        "NOT_DECLARED_REQUIRED"
      );
    });
  });

  describe("Requirement / coverage firewall", () => {
    it("requirement does not alter coverage", () => {
      const coverage = coverageFor(baseCandidate("EPISTEMIC_GAP"));
      const before = structuredClone(coverage);
      assessAttentionCandidateRequirements(coverage, {
        required_for_all_candidates: [
          "IMPACT",
          "INFORMATION_GAIN",
          "OBSERVATION_NEED",
        ],
        candidate_requirements: [],
      });
      assert.deepEqual(coverage, before);
    });

    it("direct basis override: IMPACT required with synthetic direct basis", () => {
      const coverage = withSyntheticDirectBasisCoverage(
        coverageFor(baseCandidate("ONTIC_EVENT_PRESENT")),
        "IMPACT"
      );
      const assessment = assessAttentionCandidateRequirements(coverage, {
        required_for_all_candidates: ["IMPACT"],
        candidate_requirements: [],
      });
      assert.equal(
        reqStateOf(assessment, "IMPACT"),
        "REQUIRED_AND_DIRECT_BASIS_AVAILABLE"
      );
      assert.equal(reqGapOf(assessment, "IMPACT"), null);
    });

    it("all required dimensions available: no gaps but no readiness", () => {
      const coverage = coverageFor(baseCandidate("ONTIC_EVENT_PRESENT"));
      const assessment = assessAttentionCandidateRequirements(coverage, {
        required_for_all_candidates: ["STRUCTURAL_ACTIVITY"],
        candidate_requirements: [],
      });
      assert.equal(assessment.has_required_basis_gaps, false);
      assertNoForbidden(assessment);
    });

    it("NOT_DECLARED_REQUIRED even when direct basis exists", () => {
      const coverage = coverageFor(baseCandidate("ONTIC_EVENT_PRESENT"));
      const assessment = assessAttentionCandidateRequirements(
        coverage,
        EMPTY_SPEC
      );
      assert.equal(
        coverageStatusOf(coverage, "STRUCTURAL_ACTIVITY"),
        "DIRECT_BASIS_AVAILABLE"
      );
      assert.equal(
        reqStateOf(assessment, "STRUCTURAL_ACTIVITY"),
        "NOT_DECLARED_REQUIRED"
      );
    });
  });

  describe("Set-level invariants", () => {
    it("empty candidate set + global requirements: no synthetic candidates/gaps", () => {
      const coverageSet = coverageSetFor([]);
      const result = buildAttentionBasisRequirementSet(coverageSet, {
        required_for_all_candidates: ["IMPACT"],
        candidate_requirements: [],
      });
      assert.deepEqual(result.candidate_requirements, []);
      assert.deepEqual(result.required_basis_gaps, []);
      assert.equal(result.has_explicit_requirements, true);
      assert.equal(result.has_required_basis_gaps, false);
    });

    it("immutability / determinism / candidate order preserved", () => {
      const candidates = [
        baseCandidate("EPISTEMIC_GAP"),
        resourceCandidate("RESOURCE_CAPACITY_BASIS_MISSING"),
      ];
      const coverageSet = coverageSetFor(candidates);
      const spec: AttentionBasisRequirementSpecification = {
        required_for_all_candidates: ["IMPACT"],
        candidate_requirements: [],
      };
      const coverageBefore = structuredClone(coverageSet);
      const specBefore = structuredClone(spec);
      const a = buildAttentionBasisRequirementSet(coverageSet, spec);
      const b = buildAttentionBasisRequirementSet(coverageSet, spec);
      assert.deepEqual(a, b);
      assert.deepEqual(coverageSet, coverageBefore);
      assert.deepEqual(spec, specBefore);
      assert.deepEqual(
        a.candidate_requirements.map((c) => c.candidate_key),
        candidates.map((c) => c.key)
      );
      assert.deepEqual(
        a.model_limitations,
        ATTENTION_BASIS_REQUIREMENT_MODEL_LIMITATIONS
      );
      assertNoForbidden(a);
    });

    it("many required gaps: no score/rank fields", () => {
      const coverage = coverageFor(baseCandidate("ONTIC_EVENT_PRESENT"));
      const assessment = assessAttentionCandidateRequirements(coverage, {
        required_for_all_candidates: [
          "IMPACT",
          "REVERSIBILITY",
          "OBSERVATION_COST",
          "INFORMATION_GAIN",
          "TEMPORAL_URGENCY",
          "OBSERVATION_NEED",
        ],
        candidate_requirements: [],
      });
      assert.ok(assessment.required_basis_gaps.length >= 5);
      assertNoForbidden(assessment);
    });
  });
});
