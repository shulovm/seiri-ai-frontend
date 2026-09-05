/**
 * GROUND-044 — Attention Core V / Required Basis Resolution Pathway Classification
 *
 * Pure 043 requirement assessment → resolution pathway classification
 * (no ProjectState enrichment).
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
  assessAttentionCandidateRequirements,
  buildAttentionBasisRequirementSet,
} from "../reality/attention-basis-requirement-core.js";
import {
  ATTENTION_BASIS_RESOLUTION_MODEL_LIMITATIONS,
  assessAttentionCandidateBasisResolution,
  buildAttentionBasisResolutionSet,
} from "../reality/attention-basis-resolution-core.js";
import {
  assessAttentionCandidateConsideration,
  buildAttentionConsiderationBasisSet,
} from "../reality/attention-consideration-core.js";
import type {
  AttentionCandidate,
  AttentionCandidateSetAssessment,
} from "../reality/attention-candidate-types.js";
import type { AttentionConsiderationDimension } from "../reality/attention-consideration-types.js";
import type { AttentionBasisRequirementSpecification } from "../reality/attention-basis-requirement-types.js";
import type { AttentionRequiredBasisResolutionStatus } from "../reality/attention-basis-resolution-types.js";
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

function requirementFor(
  candidate: AttentionCandidate,
  spec: AttentionBasisRequirementSpecification
) {
  const coverage = assessAttentionCandidateBasisCoverage(
    assessAttentionCandidateConsideration(candidate)
  );
  return assessAttentionCandidateRequirements(coverage, spec);
}

function requirementSetFor(
  candidates: AttentionCandidate[],
  spec: AttentionBasisRequirementSpecification
) {
  const coverageSet = buildAttentionBasisCoverageSet(
    buildAttentionConsiderationBasisSet(emptyCandidateSet(candidates))
  );
  return buildAttentionBasisRequirementSet(coverageSet, spec);
}

function resStatusOf(
  assessment: ReturnType<typeof assessAttentionCandidateBasisResolution>,
  dimension: AttentionConsiderationDimension
): AttentionRequiredBasisResolutionStatus {
  return assessment.dimensions.find((d) => d.dimension === dimension)!
    .resolution_status;
}

function resPathwayOf(
  assessment: ReturnType<typeof assessAttentionCandidateBasisResolution>,
  dimension: AttentionConsiderationDimension
) {
  return assessment.dimensions.find((d) => d.dimension === dimension)!
    .resolution_pathway;
}

function assertNoForbidden(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"WORLD_INFORMATION_ACQUISITION"/.test(json));
  assert.ok(!/"WORLD_INFORMATION_REQUIRED"/.test(json));
  assert.ok(!/"COMPLETE"/.test(json));
  assert.ok(!/"INCOMPLETE"/.test(json));
  assert.ok(!/"READY"/.test(json));
  assert.ok(!/"NOT_READY"/.test(json));
  assert.ok(!/"SELECTION_READY"/.test(json));
  assert.ok(!/"BLOCKED"/.test(json));
  assert.ok(!/"UNBLOCKED"/.test(json));
  assert.ok(!/"RESOLVABLE"/.test(json));
  assert.ok(!/"UNRESOLVABLE"/.test(json));
  assert.ok(!/"SATISFIED"/.test(json));
  assert.ok(!/"UNSATISFIED"/.test(json));
  assert.ok(!/"must_acquire"/.test(json));
  assert.ok(!/"IMPLEMENT"/.test(json));
  assert.ok(!/"DEVELOP"/.test(json));
  assert.ok(!/"preferred"/.test(json));
  assert.ok(!/"recommended"/.test(json));
  assert.ok(!/"priority"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"rank"\s*:/.test(json));
  assert.ok(!/"latency"\s*:/.test(json));
  assert.ok(!/"cost"\s*:/.test(json));
  assert.ok(!json.includes('"PROBLEM"'));
  assert.ok(!json.includes('"RISK"'));
  assert.ok(!json.includes('"NEED"'));
  assert.ok(!json.includes('"BLOCKER"'));
  assert.ok(!json.includes('"INQUIRY_ELIGIBLE"'));
  assert.ok(!json.includes('"DEVELOPMENT_ELIGIBLE"'));
}

describe("Attention Basis Resolution Pathway (GROUND-044)", () => {
  describe("Schema / purity", () => {
    it("schema 0.1.24; pure 043 transform; no enrichment runtimes", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(__dirnameTest, "../reality/attention-basis-resolution-core.ts"),
        "utf8"
      );
      const types = readFileSync(
        join(__dirnameTest, "../reality/attention-basis-resolution-types.ts"),
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
      assert.ok(!/"WORLD_INFORMATION_ACQUISITION"|"WORLD_INFORMATION_REQUIRED"/.test(types));
      assert.ok(!/"READY"|"RESOLVABLE"|"UNRESOLVABLE"/.test(types));
      assert.ok(!/"AcquisitionPlan"|"ResolutionAction"|"DevelopmentTask"/.test(types));
      assert.ok(/WORLD_INFORMATION_RESOLUTION_PATHWAY_NOT_MODELED/.test(types));
    });
  });

  describe("No gap / not-declared / direct basis", () => {
    it("empty requirement: no pathways; flags false", () => {
      const requirement = requirementFor(
        baseCandidate("EPISTEMIC_GAP"),
        EMPTY_SPEC
      );
      const resolution = assessAttentionCandidateBasisResolution(requirement);
      assert.deepEqual(resolution.required_basis_resolution_pathways, []);
      assert.equal(resolution.has_required_basis_gaps, false);
      assert.equal(resolution.has_identified_model_capability_pathways, false);
      assert.equal(resolution.has_undetermined_resolution_pathways, false);
      for (const dim of resolution.dimensions) {
        assert.equal(dim.resolution_status, "NO_REQUIRED_BASIS_GAP");
        assert.equal(dim.resolution_pathway, null);
      }
      assertNoForbidden(resolution);
    });

    it("required direct basis: no pathway", () => {
      const requirement = requirementFor(baseCandidate("ONTIC_EVENT_PRESENT"), {
        required_for_all_candidates: ["STRUCTURAL_ACTIVITY"],
        candidate_requirements: [],
      });
      const resolution = assessAttentionCandidateBasisResolution(requirement);
      assert.equal(
        resStatusOf(resolution, "STRUCTURAL_ACTIVITY"),
        "NO_REQUIRED_BASIS_GAP"
      );
      assert.equal(resPathwayOf(resolution, "STRUCTURAL_ACTIVITY"), null);
      assert.deepEqual(resolution.required_basis_resolution_pathways, []);
    });

    it("not-declared-required model gap: pathway null", () => {
      const requirement = requirementFor(
        baseCandidate("ONTIC_EVENT_PRESENT"),
        EMPTY_SPEC
      );
      assert.ok(requirement.coverage.has_capability_gaps);
      const resolution = assessAttentionCandidateBasisResolution(requirement);
      assert.equal(resStatusOf(resolution, "IMPACT"), "NO_REQUIRED_BASIS_GAP");
      assert.equal(resPathwayOf(resolution, "IMPACT"), null);
      assert.equal(
        resStatusOf(resolution, "INFORMATION_GAIN"),
        "NO_REQUIRED_BASIS_GAP"
      );
    });
  });

  describe("Gap-kind → pathway mapping", () => {
    it("SOURCE_NON_REPRESENTATION_GAP → UNDETERMINED, pathway_kind null", () => {
      const requirement = requirementFor(baseCandidate("EPISTEMIC_GAP"), {
        required_for_all_candidates: ["OBSERVATION_NEED"],
        candidate_requirements: [],
      });
      const resolution = assessAttentionCandidateBasisResolution(requirement);
      assert.equal(
        resStatusOf(resolution, "OBSERVATION_NEED"),
        "RESOLUTION_PATHWAY_UNDETERMINED"
      );
      const pathway = resPathwayOf(resolution, "OBSERVATION_NEED")!;
      assert.equal(pathway.pathway_kind, null);
      assert.equal(pathway.status, "RESOLUTION_PATHWAY_UNDETERMINED");
      assert.equal(
        pathway.required_basis_gap.gap_kind,
        "SOURCE_NON_REPRESENTATION_GAP"
      );
      assert.equal(pathway.required_basis_gap.capability_gap, null);
      assert.equal(resolution.has_undetermined_resolution_pathways, true);
      assert.equal(resolution.has_identified_model_capability_pathways, false);
      assertNoForbidden(resolution);
    });

    it("IMPACT linkage → EXPLICIT_SEMANTIC_LINKAGE_CAPABILITY", () => {
      const requirement = requirementFor(baseCandidate("EPISTEMIC_GAP"), {
        required_for_all_candidates: ["IMPACT"],
        candidate_requirements: [],
      });
      const resolution = assessAttentionCandidateBasisResolution(requirement);
      assert.equal(
        resStatusOf(resolution, "IMPACT"),
        "MODEL_CAPABILITY_PATHWAY_IDENTIFIED"
      );
      const pathway = resPathwayOf(resolution, "IMPACT")!;
      assert.equal(pathway.pathway_kind, "EXPLICIT_SEMANTIC_LINKAGE_CAPABILITY");
      assert.equal(
        pathway.required_basis_gap.capability_gap!.reason,
        "CANDIDATE_IMPACT_LINKAGE_NOT_MODELED"
      );
      assert.equal(resolution.has_identified_model_capability_pathways, true);
    });

    it("REVERSIBILITY linkage preserves exact reason", () => {
      const requirement = requirementFor(baseCandidate("ONTIC_EVENT_PRESENT"), {
        required_for_all_candidates: ["REVERSIBILITY"],
        candidate_requirements: [],
      });
      const pathway = resPathwayOf(
        assessAttentionCandidateBasisResolution(requirement),
        "REVERSIBILITY"
      )!;
      assert.equal(pathway.pathway_kind, "EXPLICIT_SEMANTIC_LINKAGE_CAPABILITY");
      assert.equal(
        pathway.required_basis_gap.capability_gap!.reason,
        "CANDIDATE_REVERSIBILITY_LINKAGE_NOT_MODELED"
      );
    });

    it("OBSERVATION_COST / INFORMATION_GAIN / TEMPORAL_URGENCY → ESTIMATION_CAPABILITY", () => {
      const cases: Array<{
        dim: AttentionConsiderationDimension;
        reason: string;
      }> = [
        {
          dim: "OBSERVATION_COST",
          reason: "OBSERVATION_COST_MODEL_NOT_MODELED",
        },
        {
          dim: "INFORMATION_GAIN",
          reason: "INFORMATION_GAIN_MODEL_NOT_MODELED",
        },
        {
          dim: "TEMPORAL_URGENCY",
          reason: "TEMPORAL_URGENCY_MODEL_NOT_MODELED",
        },
      ];
      for (const { dim, reason } of cases) {
        const requirement = requirementFor(baseCandidate("ONTIC_EVENT_PRESENT"), {
          required_for_all_candidates: [dim],
          candidate_requirements: [],
        });
        const pathway = resPathwayOf(
          assessAttentionCandidateBasisResolution(requirement),
          dim
        )!;
        assert.equal(pathway.status, "MODEL_CAPABILITY_PATHWAY_IDENTIFIED");
        assert.equal(pathway.pathway_kind, "ESTIMATION_CAPABILITY");
        assert.equal(pathway.required_basis_gap.capability_gap!.reason, reason);
      }
    });

    it("gap-kind mapping strictness", () => {
      const requirement = requirementFor(baseCandidate("ONTIC_EVENT_PRESENT"), {
        required_for_all_candidates: [
          "OBSERVATION_NEED",
          "IMPACT",
          "INFORMATION_GAIN",
        ],
        candidate_requirements: [],
      });
      const resolution = assessAttentionCandidateBasisResolution(requirement);
      const source = resPathwayOf(resolution, "OBSERVATION_NEED")!;
      const linkage = resPathwayOf(resolution, "IMPACT")!;
      const estimation = resPathwayOf(resolution, "INFORMATION_GAIN")!;
      assert.equal(source.pathway_kind, null);
      assert.notEqual(source.pathway_kind, "EXPLICIT_SEMANTIC_LINKAGE_CAPABILITY");
      assert.notEqual(source.pathway_kind, "ESTIMATION_CAPABILITY");
      assert.equal(linkage.pathway_kind, "EXPLICIT_SEMANTIC_LINKAGE_CAPABILITY");
      assert.notEqual(linkage.pathway_kind, "ESTIMATION_CAPABILITY");
      assert.equal(estimation.pathway_kind, "ESTIMATION_CAPABILITY");
      assert.notEqual(
        estimation.pathway_kind,
        "EXPLICIT_SEMANTIC_LINKAGE_CAPABILITY"
      );
    });
  });

  describe("Candidate-relative / set / firewalls", () => {
    it("ten IMPACT gaps remain Candidate-relative; no global task", () => {
      const candidates = Array.from({ length: 10 }, (_, i) =>
        baseCandidate("EPISTEMIC_GAP", `sig|impact-${i}`)
      );
      const requirementSet = requirementSetFor(candidates, {
        required_for_all_candidates: ["IMPACT"],
        candidate_requirements: [],
      });
      const resolutionSet = buildAttentionBasisResolutionSet(requirementSet);
      assert.equal(
        resolutionSet.required_basis_resolution_pathways.length,
        10
      );
      const keys = new Set(
        resolutionSet.required_basis_resolution_pathways.map((p) => p.key)
      );
      assert.equal(keys.size, 10);
      assert.deepEqual(
        resolutionSet.candidate_resolution.map((c) => c.candidate_key),
        candidates.map((c) => c.key)
      );
      assertNoForbidden(resolutionSet);
    });

    it("preserves exact 043 gap object reference semantics", () => {
      const requirement = requirementFor(baseCandidate("EPISTEMIC_GAP"), {
        required_for_all_candidates: ["IMPACT"],
        candidate_requirements: [],
      });
      const gap = requirement.required_basis_gaps[0];
      const pathway = resPathwayOf(
        assessAttentionCandidateBasisResolution(requirement),
        "IMPACT"
      )!;
      assert.equal(pathway.required_basis_gap_key, gap.key);
      assert.deepEqual(pathway.required_basis_gap, gap);
    });

    it("empty candidate set: no synthetic pathways", () => {
      const requirementSet = requirementSetFor([], {
        required_for_all_candidates: ["IMPACT"],
        candidate_requirements: [],
      });
      const resolutionSet = buildAttentionBasisResolutionSet(requirementSet);
      assert.deepEqual(resolutionSet.candidate_resolution, []);
      assert.deepEqual(resolutionSet.required_basis_resolution_pathways, []);
      assert.equal(
        resolutionSet.has_identified_model_capability_pathways,
        false
      );
    });

    it("immutability / determinism / model limitations", () => {
      const candidates = [
        baseCandidate("EPISTEMIC_GAP"),
        resourceCandidate("RESOURCE_CAPACITY_BASIS_MISSING"),
      ];
      const requirementSet = requirementSetFor(candidates, {
        required_for_all_candidates: ["IMPACT", "OBSERVATION_NEED"],
        candidate_requirements: [],
      });
      const before = structuredClone(requirementSet);
      const a = buildAttentionBasisResolutionSet(requirementSet);
      const b = buildAttentionBasisResolutionSet(requirementSet);
      assert.deepEqual(a, b);
      assert.deepEqual(requirementSet, before);
      assert.deepEqual(
        a.model_limitations,
        ATTENTION_BASIS_RESOLUTION_MODEL_LIMITATIONS
      );
      assert.equal(a.has_identified_model_capability_pathways, true);
      assert.equal(a.has_undetermined_resolution_pathways, true);
      assertNoForbidden(a);
    });

    it("resource finding with empty requirement still has no pathway", () => {
      const requirement = requirementFor(
        resourceCandidate("RESOURCE_CAPACITY_BASIS_MISSING"),
        EMPTY_SPEC
      );
      const resolution = assessAttentionCandidateBasisResolution(requirement);
      assert.deepEqual(resolution.required_basis_resolution_pathways, []);
      assert.equal(resStatusOf(resolution, "IMPACT"), "NO_REQUIRED_BASIS_GAP");
    });
  });
});
