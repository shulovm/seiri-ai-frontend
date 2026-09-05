/**
 * GROUND-045 — Attention Core VI / Resolution Domain Eligibility Foundation
 *
 * Pure 044 resolution → domain eligibility (no ProjectState enrichment).
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
  assessAttentionCandidateBasisResolution,
  buildAttentionBasisResolutionSet,
} from "../reality/attention-basis-resolution-core.js";
import {
  ATTENTION_RESOLUTION_DOMAIN_ORDER,
  ATTENTION_RESOLUTION_ELIGIBILITY_MODEL_LIMITATIONS,
  assessAttentionCandidateResolutionEligibility,
  buildAttentionResolutionEligibilitySet,
} from "../reality/attention-resolution-eligibility-core.js";
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
import type {
  AttentionResolutionDomain,
  AttentionResolutionDomainEligibilityStatus,
  AttentionResolutionEligibilityState,
} from "../reality/attention-resolution-eligibility-types.js";
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

function eligibilityFor(
  candidate: AttentionCandidate,
  spec: AttentionBasisRequirementSpecification
) {
  const coverage = assessAttentionCandidateBasisCoverage(
    assessAttentionCandidateConsideration(candidate)
  );
  const requirement = assessAttentionCandidateRequirements(coverage, spec);
  const resolution = assessAttentionCandidateBasisResolution(requirement);
  return assessAttentionCandidateResolutionEligibility(resolution);
}

function eligibilitySetFor(
  candidates: AttentionCandidate[],
  spec: AttentionBasisRequirementSpecification
) {
  const coverageSet = buildAttentionBasisCoverageSet(
    buildAttentionConsiderationBasisSet(emptyCandidateSet(candidates))
  );
  const requirementSet = buildAttentionBasisRequirementSet(coverageSet, spec);
  const resolutionSet = buildAttentionBasisResolutionSet(requirementSet);
  return buildAttentionResolutionEligibilitySet(resolutionSet);
}

function dimOf(
  assessment: ReturnType<typeof assessAttentionCandidateResolutionEligibility>,
  dimension: AttentionConsiderationDimension
) {
  return assessment.dimensions.find((d) => d.dimension === dimension)!;
}

function domainStatusOf(
  assessment: ReturnType<typeof assessAttentionCandidateResolutionEligibility>,
  dimension: AttentionConsiderationDimension,
  domain: AttentionResolutionDomain
): AttentionResolutionDomainEligibilityStatus {
  return dimOf(assessment, dimension).domains.find((d) => d.domain === domain)!
    .eligibility_status;
}

function domainBasesOf(
  assessment: ReturnType<typeof assessAttentionCandidateResolutionEligibility>,
  dimension: AttentionConsiderationDimension,
  domain: AttentionResolutionDomain
) {
  return dimOf(assessment, dimension).domains.find((d) => d.domain === domain)!
    .eligibility_bases;
}

function stateOf(
  assessment: ReturnType<typeof assessAttentionCandidateResolutionEligibility>,
  dimension: AttentionConsiderationDimension
): AttentionResolutionEligibilityState {
  return dimOf(assessment, dimension).eligibility_state;
}

function assertNoForbidden(payload: unknown): void {
  const json = JSON.stringify(payload);
  assert.ok(!/"WORLD_INFORMATION_REQUIRED"/.test(json));
  assert.ok(!/"WORLD_INFORMATION_ELIGIBLE"/.test(json));
  assert.ok(!/"MODEL_DEVELOPMENT_ELIGIBLE"/.test(json));
  assert.ok(!/"INQUIRY_ELIGIBLE"/.test(json));
  assert.ok(!/"selected_domain"/.test(json));
  assert.ok(!/"preferred_domain"/.test(json));
  assert.ok(!/"COMPLETE"/.test(json));
  assert.ok(!/"READY"/.test(json));
  assert.ok(!/"NOT_READY"/.test(json));
  assert.ok(!/"BLOCKED"/.test(json));
  assert.ok(!/"RESOLVABLE"/.test(json));
  assert.ok(!/"UNRESOLVABLE"/.test(json));
  assert.ok(!/"FEASIBLE"/.test(json));
  assert.ok(!/"INFEASIBLE"/.test(json));
  assert.ok(!/"must_acquire"/.test(json));
  assert.ok(!/"priority"\s*:/.test(json));
  assert.ok(!/"score"\s*:/.test(json));
  assert.ok(!/"rank"\s*:/.test(json));
  assert.ok(!/"cost"\s*:/.test(json));
  assert.ok(!/"latency"\s*:/.test(json));
  assert.ok(!/"confidence"\s*:/.test(json));
  assert.ok(!json.includes('"PROBLEM"'));
  assert.ok(!json.includes('"RISK"'));
  assert.ok(!json.includes('"NEED"'));
  assert.ok(!json.includes('"BLOCKER"'));
}

describe("Attention Resolution Domain Eligibility (GROUND-045)", () => {
  describe("Schema / purity", () => {
    it("schema 0.1.24; pure 044 transform; no enrichment runtimes", () => {
      assert.equal(SCHEMA_VERSION, "0.1.24");
      const core = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-resolution-eligibility-core.ts"
        ),
        "utf8"
      );
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-resolution-eligibility-types.ts"
        ),
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
      assert.ok(!/"WORLD_INFORMATION_REQUIRED"|"WORLD_INFORMATION_ELIGIBLE"/.test(types));
      assert.ok(!/"MODEL_DEVELOPMENT_ELIGIBLE"|"INQUIRY_ELIGIBLE"/.test(types));
      assert.ok(!/"ResolutionRecommendation"|"EligibleAction"|"ResolutionPlan"/.test(types));
      assert.deepEqual(ATTENTION_RESOLUTION_DOMAIN_ORDER, [
        "WORLD_INFORMATION_RESOLUTION",
        "MODEL_CAPABILITY_RESOLUTION",
      ]);
    });
  });

  describe("No gap / source gap / asymmetry", () => {
    it("no required gap: both domains NOT_APPLICABLE", () => {
      const eligibility = eligibilityFor(
        baseCandidate("EPISTEMIC_GAP"),
        EMPTY_SPEC
      );
      for (const dim of eligibility.dimensions) {
        assert.equal(dim.eligibility_state, "NO_REQUIRED_BASIS_GAP");
        for (const domain of ATTENTION_RESOLUTION_DOMAIN_ORDER) {
          const d = dim.domains.find((x) => x.domain === domain)!;
          assert.equal(
            d.eligibility_status,
            "NOT_APPLICABLE_NO_REQUIRED_BASIS_GAP"
          );
          assert.deepEqual(d.eligibility_bases, []);
        }
      }
      assert.equal(
        eligibility.has_world_information_resolution_eligibility_basis,
        false
      );
      assert.equal(
        eligibility.has_model_capability_resolution_eligibility_basis,
        false
      );
      assertNoForbidden(eligibility);
    });

    it("SOURCE_NON_REPRESENTATION: both domains no direct basis; undetermined", () => {
      const eligibility = eligibilityFor(baseCandidate("EPISTEMIC_GAP"), {
        required_for_all_candidates: ["OBSERVATION_NEED"],
        candidate_requirements: [],
      });
      assert.equal(
        stateOf(eligibility, "OBSERVATION_NEED"),
        "RESOLUTION_DOMAIN_ELIGIBILITY_UNDETERMINED"
      );
      assert.equal(
        domainStatusOf(
          eligibility,
          "OBSERVATION_NEED",
          "WORLD_INFORMATION_RESOLUTION"
        ),
        "NO_DIRECT_ELIGIBILITY_BASIS_REPRESENTED"
      );
      assert.equal(
        domainStatusOf(
          eligibility,
          "OBSERVATION_NEED",
          "MODEL_CAPABILITY_RESOLUTION"
        ),
        "NO_DIRECT_ELIGIBILITY_BASIS_REPRESENTED"
      );
      assert.deepEqual(
        domainBasesOf(
          eligibility,
          "OBSERVATION_NEED",
          "WORLD_INFORMATION_RESOLUTION"
        ),
        []
      );
      assert.equal(
        eligibility.has_undetermined_resolution_domain_eligibility,
        true
      );
      assert.equal(
        eligibility.has_world_information_resolution_eligibility_basis,
        false
      );
    });

    it("EPISTEMIC_GAP / OPEN_INQUIRY / Resource source gaps never yield world eligibility", () => {
      const cases: Array<{
        candidate: AttentionCandidate;
        dim: AttentionConsiderationDimension;
      }> = [
        {
          candidate: baseCandidate("EPISTEMIC_GAP"),
          dim: "OBSERVATION_NEED",
        },
        {
          candidate: baseCandidate("OPEN_INQUIRY"),
          dim: "OBSERVATION_NEED",
        },
        {
          candidate: resourceCandidate("RESOURCE_CAPACITY_BASIS_MISSING"),
          dim: "OBSERVATION_NEED",
        },
        {
          candidate: resourceCandidate(
            "RESOURCE_RESERVATION_REPRESENTATION_AMBIGUITY"
          ),
          dim: "OBSERVATION_NEED",
        },
      ];
      for (const { candidate, dim } of cases) {
        const eligibility = eligibilityFor(candidate, {
          required_for_all_candidates: [dim],
          candidate_requirements: [],
        });
        assert.equal(
          domainStatusOf(eligibility, dim, "WORLD_INFORMATION_RESOLUTION"),
          "NO_DIRECT_ELIGIBILITY_BASIS_REPRESENTED"
        );
        assert.equal(
          eligibility.has_world_information_resolution_eligibility_basis,
          false
        );
      }
    });
  });

  describe("Model capability eligibility", () => {
    it("IMPACT linkage → MODEL direct; WORLD no direct; pathway preserved", () => {
      const eligibility = eligibilityFor(baseCandidate("EPISTEMIC_GAP"), {
        required_for_all_candidates: ["IMPACT"],
        candidate_requirements: [],
      });
      assert.equal(
        stateOf(eligibility, "IMPACT"),
        "MODEL_CAPABILITY_RESOLUTION_ELIGIBILITY_BASIS_PRESENT"
      );
      assert.equal(
        domainStatusOf(eligibility, "IMPACT", "MODEL_CAPABILITY_RESOLUTION"),
        "DIRECT_ELIGIBILITY_BASIS_PRESENT"
      );
      assert.equal(
        domainStatusOf(eligibility, "IMPACT", "WORLD_INFORMATION_RESOLUTION"),
        "NO_DIRECT_ELIGIBILITY_BASIS_REPRESENTED"
      );
      const bases = domainBasesOf(
        eligibility,
        "IMPACT",
        "MODEL_CAPABILITY_RESOLUTION"
      );
      assert.equal(bases.length, 1);
      assert.equal(bases[0].basis_kind, "IDENTIFIED_MODEL_CAPABILITY_PATHWAY");
      assert.equal(
        bases[0].resolution_pathway.pathway_kind,
        "EXPLICIT_SEMANTIC_LINKAGE_CAPABILITY"
      );
      assert.equal(
        bases[0].resolution_pathway.required_basis_gap.capability_gap!.reason,
        "CANDIDATE_IMPACT_LINKAGE_NOT_MODELED"
      );
      const pathwayFrom044 = dimOf(eligibility, "IMPACT").resolution
        .resolution_pathway!;
      assert.equal(bases[0].resolution_pathway_key, pathwayFrom044.key);
      assert.deepEqual(bases[0].resolution_pathway, pathwayFrom044);
      assert.equal(
        eligibility.has_model_capability_resolution_eligibility_basis,
        true
      );
      assert.equal(
        eligibility.has_world_information_resolution_eligibility_basis,
        false
      );
    });

    it("REVERSIBILITY linkage same model-domain behavior", () => {
      const eligibility = eligibilityFor(baseCandidate("ONTIC_EVENT_PRESENT"), {
        required_for_all_candidates: ["REVERSIBILITY"],
        candidate_requirements: [],
      });
      assert.equal(
        domainStatusOf(
          eligibility,
          "REVERSIBILITY",
          "MODEL_CAPABILITY_RESOLUTION"
        ),
        "DIRECT_ELIGIBILITY_BASIS_PRESENT"
      );
      assert.equal(
        domainBasesOf(
          eligibility,
          "REVERSIBILITY",
          "MODEL_CAPABILITY_RESOLUTION"
        )[0].resolution_pathway.required_basis_gap.capability_gap!.reason,
        "CANDIDATE_REVERSIBILITY_LINKAGE_NOT_MODELED"
      );
    });

    it("estimation gaps → MODEL direct; preserve ESTIMATION_CAPABILITY reasons", () => {
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
        const eligibility = eligibilityFor(baseCandidate("ONTIC_EVENT_PRESENT"), {
          required_for_all_candidates: [dim],
          candidate_requirements: [],
        });
        assert.equal(
          domainStatusOf(eligibility, dim, "MODEL_CAPABILITY_RESOLUTION"),
          "DIRECT_ELIGIBILITY_BASIS_PRESENT"
        );
        assert.equal(
          domainStatusOf(eligibility, dim, "WORLD_INFORMATION_RESOLUTION"),
          "NO_DIRECT_ELIGIBILITY_BASIS_REPRESENTED"
        );
        const basis = domainBasesOf(
          eligibility,
          dim,
          "MODEL_CAPABILITY_RESOLUTION"
        )[0];
        assert.equal(
          basis.resolution_pathway.pathway_kind,
          "ESTIMATION_CAPABILITY"
        );
        assert.equal(
          basis.resolution_pathway.required_basis_gap.capability_gap!.reason,
          reason
        );
        assert.equal(
          eligibility.has_world_information_resolution_eligibility_basis,
          false
        );
      }
    });

    it("no WORLD_INFORMATION eligibility basis kind in types/API", () => {
      const types = readFileSync(
        join(
          __dirnameTest,
          "../reality/attention-resolution-eligibility-types.ts"
        ),
        "utf8"
      );
      assert.ok(
        !/AttentionResolutionDomainEligibilityBasisKind\s*=\s*[^;]*WORLD_INFORMATION/.test(
          types
        )
      );
      assert.ok(/IDENTIFIED_MODEL_CAPABILITY_PATHWAY/.test(types));
    });
  });

  describe("Set / flags / firewalls", () => {
    it("ten IMPACT Candidates: Candidate-relative eligibility; world flag false", () => {
      const candidates = Array.from({ length: 10 }, (_, i) =>
        baseCandidate("EPISTEMIC_GAP", `sig|elig-${i}`)
      );
      const set = eligibilitySetFor(candidates, {
        required_for_all_candidates: ["IMPACT"],
        candidate_requirements: [],
      });
      assert.equal(set.candidate_eligibility.length, 10);
      assert.equal(set.has_model_capability_resolution_eligibility_basis, true);
      assert.equal(
        set.has_world_information_resolution_eligibility_basis,
        false
      );
      assertNoForbidden(set);
    });

    it("empty candidate set: no synthetic eligibility", () => {
      const set = eligibilitySetFor([], {
        required_for_all_candidates: ["IMPACT"],
        candidate_requirements: [],
      });
      assert.deepEqual(set.candidate_eligibility, []);
      assert.equal(set.has_model_capability_resolution_eligibility_basis, false);
      assert.equal(
        set.has_world_information_resolution_eligibility_basis,
        false
      );
    });

    it("immutability / determinism / model limitations", () => {
      const candidates = [
        baseCandidate("EPISTEMIC_GAP"),
        resourceCandidate("RESOURCE_CAPACITY_BASIS_MISSING"),
      ];
      const coverageSet = buildAttentionBasisCoverageSet(
        buildAttentionConsiderationBasisSet(emptyCandidateSet(candidates))
      );
      const requirementSet = buildAttentionBasisRequirementSet(coverageSet, {
        required_for_all_candidates: ["IMPACT", "OBSERVATION_NEED"],
        candidate_requirements: [],
      });
      const resolutionSet = buildAttentionBasisResolutionSet(requirementSet);
      const before = structuredClone(resolutionSet);
      const a = buildAttentionResolutionEligibilitySet(resolutionSet);
      const b = buildAttentionResolutionEligibilitySet(resolutionSet);
      assert.deepEqual(a, b);
      assert.deepEqual(resolutionSet, before);
      assert.deepEqual(
        a.model_limitations,
        ATTENTION_RESOLUTION_ELIGIBILITY_MODEL_LIMITATIONS
      );
      assert.equal(a.has_model_capability_resolution_eligibility_basis, true);
      assert.equal(a.has_undetermined_resolution_domain_eligibility, true);
      assert.equal(a.has_world_information_resolution_eligibility_basis, false);
      assertNoForbidden(a);
    });

    it("DIRECT model eligibility does not imply development/inquiry/observation eligibility", () => {
      const eligibility = eligibilityFor(baseCandidate("ONTIC_EVENT_PRESENT"), {
        required_for_all_candidates: ["IMPACT"],
        candidate_requirements: [],
      });
      assert.equal(
        eligibility.has_model_capability_resolution_eligibility_basis,
        true
      );
      assertNoForbidden(eligibility);
    });

    it("domain order and basis consistency invariants", () => {
      const eligibility = eligibilityFor(baseCandidate("ONTIC_EVENT_PRESENT"), {
        required_for_all_candidates: ["IMPACT", "OBSERVATION_NEED"],
        candidate_requirements: [],
      });
      for (const dim of eligibility.dimensions) {
        assert.deepEqual(
          dim.domains.map((d) => d.domain),
          ATTENTION_RESOLUTION_DOMAIN_ORDER
        );
        for (const d of dim.domains) {
          if (d.eligibility_status === "DIRECT_ELIGIBILITY_BASIS_PRESENT") {
            assert.ok(d.eligibility_bases.length >= 1);
            assert.equal(d.domain, "MODEL_CAPABILITY_RESOLUTION");
          } else {
            assert.deepEqual(d.eligibility_bases, []);
          }
        }
      }
      // WORLD never gets DIRECT in GROUND-045
      assert.equal(
        domainStatusOf(
          eligibility,
          "IMPACT",
          "WORLD_INFORMATION_RESOLUTION"
        ),
        "NO_DIRECT_ELIGIBILITY_BASIS_REPRESENTED"
      );
      assert.equal(
        domainStatusOf(
          eligibility,
          "OBSERVATION_NEED",
          "WORLD_INFORMATION_RESOLUTION"
        ),
        "NO_DIRECT_ELIGIBILITY_BASIS_REPRESENTED"
      );
    });
  });
});
