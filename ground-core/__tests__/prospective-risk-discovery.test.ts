import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { discoverNormativeFindings } from "../reality/normative-discovery.js";
import { assessObjectiveDiscovery } from "../reality/objective-discovery.js";
import {
  assessAllProspectiveRisks,
  assessProspectiveRisk,
  discoverProspectiveRisks,
  getProspectiveRiskFindings,
  prospectiveRiskKey,
} from "../reality/prospective-risk-discovery.js";
import { applyPatch } from "../state-engine.js";
import type {
  FutureScenario,
  ObjectiveDependency,
  ObjectiveRequirement,
  ProjectState,
  RealityEntity,
  RealityObjective,
  RealityState,
  ReferenceCondition,
  ScenarioLikelihoodEstimate,
  ScenarioStateProjection,
} from "../types.js";
import { PROJECT_ID, validProjectStateV0124 } from "./fixtures.js";

const ENTITY_ID = "f1010101-0101-4101-8101-010101010101";
const ENTITY_B = "f1010101-0101-4101-8101-010101010102";
const DECLARER_ID = "f1010101-0101-4101-8101-010101010103";
const SCENARIO_ID = "fa0a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a01";
const PROJ_A = "fb0b0b0b-0b0b-4b0b-8b0b-0b0b0b0b0b01";
const PROJ_B = "fb0b0b0b-0b0b-4b0b-8b0b-0b0b0b0b0b02";
const PROJ_C = "fb0b0b0b-0b0b-4b0b-8b0b-0b0b0b0b0b03";
const LIK_A = "fc0c0c0c-0c0c-4c0c-8c0c-0c0c0c0c0c01";
const LIK_B = "fc0c0c0c-0c0c-4c0c-8c0c-0c0c0c0c0c02";
const LIK_C = "fc0c0c0c-0c0c-4c0c-8c0c-0c0c0c0c0c03";
const REF_ACCEPTABLE = "f6060606-0606-4606-8606-060606060901";
const REF_ACCEPTABLE_B = "f6060606-0606-4606-8606-060606060902";
const REF_EXPECTED = "f6060606-0606-4606-8606-060606060903";
const REF_DESIRED = "f6060606-0606-4606-8606-060606060904";
const REF_REQ = "f6060606-0606-4606-8606-060606060905";
const REF_DESIRED_OBJ = "f6060606-0606-4606-8606-060606060906";
const OBJ_A = "f7070707-0707-4707-8707-070707070901";
const REQ_A = "f8080808-0808-4808-8808-080808080901";
const DEP_A = "f9090909-0909-4909-8909-090909090901";
const FROM = "2026-08-24T00:00:00.000Z";
const TS = "2026-08-24T12:00:00.000Z";
const AS_OF = "2026-08-24T10:00:00.000Z";
const PROJ_FOR = "2026-08-24T14:00:00.000Z";
const AT = "2026-08-24T11:30:00.000Z";

function entity(overrides: Partial<RealityEntity> = {}): RealityEntity {
  return {
    id: ENTITY_ID,
    project_id: PROJECT_ID,
    kind: "asset",
    label: "pipe-A",
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function declarerEntity(): RealityEntity {
  return {
    id: DECLARER_ID,
    project_id: PROJECT_ID,
    kind: "organization",
    label: "org-A",
    created_at: TS,
    updated_at: TS,
  };
}

function scenario(overrides: Partial<FutureScenario> = {}): FutureScenario {
  return {
    id: SCENARIO_ID,
    project_id: PROJECT_ID,
    label: "pressure drop scenario",
    as_of: AS_OF,
    declared_by: { kind: "human", entity_id: DECLARER_ID },
    recorded_at: TS,
    basis_state_ids: [],
    basis_claim_ids: [],
    basis_evidence_ids: [],
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function projection(
  overrides: Partial<ScenarioStateProjection> = {}
): ScenarioStateProjection {
  return {
    id: PROJ_A,
    project_id: PROJECT_ID,
    scenario_id: SCENARIO_ID,
    subject_id: ENTITY_ID,
    state_kind: "pressure",
    projected_value: 55,
    projected_for: PROJ_FOR,
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function likelihood(
  overrides: Partial<ScenarioLikelihoodEstimate> = {}
): ScenarioLikelihoodEstimate {
  return {
    id: LIK_A,
    project_id: PROJECT_ID,
    scenario_id: SCENARIO_ID,
    probability: 0.3,
    estimated_by: { kind: "model", label: "model-A" },
    estimated_at: AS_OF,
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function acceptableRef(
  overrides: Partial<ReferenceCondition> = {}
): ReferenceCondition {
  return {
    id: REF_ACCEPTABLE,
    project_id: PROJECT_ID,
    subject_id: ENTITY_ID,
    state_kind: "pressure",
    reference_kind: "ACCEPTABLE",
    criterion: {
      kind: "NUMERIC_RANGE",
      min: 70,
      max: 90,
      min_inclusive: true,
      max_inclusive: true,
    },
    valid_from: "2026-08-24T13:00:00.000Z",
    valid_until: "2026-08-24T15:00:00.000Z",
    declared_by: { kind: "organization", entity_id: DECLARER_ID },
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function expectedRef(
  overrides: Partial<ReferenceCondition> = {}
): ReferenceCondition {
  return acceptableRef({
    id: REF_EXPECTED,
    reference_kind: "EXPECTED",
    criterion: {
      kind: "NUMERIC_RANGE",
      min: 70,
      max: 90,
      min_inclusive: true,
      max_inclusive: true,
    },
    ...overrides,
  });
}

function desiredRef(
  overrides: Partial<ReferenceCondition> = {}
): ReferenceCondition {
  return acceptableRef({
    id: REF_DESIRED,
    reference_kind: "DESIRED",
    criterion: {
      kind: "NUMERIC_RANGE",
      min: 70,
      max: 90,
      min_inclusive: true,
      max_inclusive: true,
    },
    ...overrides,
  });
}

function projectWith(input: {
  entities?: RealityEntity[];
  states?: RealityState[];
  references?: ReferenceCondition[];
  scenarios?: FutureScenario[];
  projections?: ScenarioStateProjection[];
  likelihoods?: ScenarioLikelihoodEstimate[];
  objectives?: RealityObjective[];
  requirements?: ObjectiveRequirement[];
  dependencies?: ObjectiveDependency[];
}): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    reality_entities: input.entities ?? [entity(), declarerEntity()],
    reality_states: input.states ?? [],
    reference_conditions: input.references ?? [],
    future_scenarios: input.scenarios ?? [],
    scenario_state_projections: input.projections ?? [],
    scenario_likelihood_estimates: input.likelihoods ?? [],
    reality_objectives: input.objectives ?? [],
    objective_requirements: input.requirements ?? [],
    objective_dependencies: input.dependencies ?? [],
  };
}

function assertNoForbidden(value: unknown) {
  const json = JSON.stringify(value);
  for (const token of [
    '"SAFE"',
    '"NO_FUTURE_HARM"',
    '"risk_score"',
    '"severity"',
    '"risk_level"',
    '"impact_score"',
    '"priority"',
    '"urgency"',
    '"risk_probability"',
    '"projection_probability"',
    '"fused_probability"',
    '"average_probability"',
    '"OPPORTUNITY"',
  ]) {
    assert.equal(json.includes(token), false, `forbidden token: ${token}`);
  }
}

describe("Prospective Risk Discovery (GROUND-016)", () => {
  it("basic RISK — projected ACCEPTABLE deviation + positive likelihood", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: 55 })],
      references: [acceptableRef()],
      likelihoods: [likelihood({ probability: 0.3 })],
    });
    const assessment = assessProspectiveRisk(project, SCENARIO_ID);
    assert.equal(assessment.has_risk, true);
    assert.equal(assessment.risk_findings.length, 1);
    const risk = assessment.risk_findings[0]!;
    assert.equal(risk.kind, "RISK");
    assert.equal(risk.likelihood_scope, "SCENARIO");
    assert.equal(risk.reference_condition_id, REF_ACCEPTABLE);
    assert.equal(risk.projection_id, PROJ_A);
    assert.equal(risk.projected_comparison_result, "DEVIATES");
    assert.deepEqual(risk.positive_likelihood_estimate_ids, [LIK_A]);
    assert.equal(
      risk.key,
      prospectiveRiskKey(SCENARIO_ID, PROJ_A, REF_ACCEPTABLE)
    );
    assertNoForbidden(assessment);
  });

  it("no likelihood estimate — RISK none, unquantified deviation flag", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: 55 })],
      references: [acceptableRef()],
    });
    const assessment = assessProspectiveRisk(project, SCENARIO_ID);
    assert.equal(assessment.has_risk, false);
    assert.equal(
      assessment.has_projected_acceptable_deviation_without_likelihood,
      true
    );
    assert.equal(assessment.risk_findings.length, 0);
    assertNoForbidden(assessment);
  });

  it("all probability estimates zero — RISK none, zero-only flag", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: 55 })],
      references: [acceptableRef()],
      likelihoods: [
        likelihood({ id: LIK_A, probability: 0 }),
        likelihood({
          id: LIK_B,
          probability: 0,
          estimated_by: { kind: "model", label: "model-B" },
        }),
      ],
    });
    const assessment = assessProspectiveRisk(project, SCENARIO_ID);
    assert.equal(assessment.has_risk, false);
    assert.equal(
      assessment.has_projected_acceptable_deviation_with_only_zero_estimates,
      true
    );
    assertNoForbidden(assessment);
  });

  it("mixed zero / positive — RISK yes, all estimates preserved", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: 55 })],
      references: [acceptableRef()],
      likelihoods: [
        likelihood({ id: LIK_A, probability: 0 }),
        likelihood({
          id: LIK_B,
          probability: 0.4,
          estimated_by: { kind: "model", label: "model-B" },
        }),
      ],
    });
    const risk = discoverProspectiveRisks(project, SCENARIO_ID)[0]!;
    assert.ok(risk);
    assert.deepEqual(risk.all_likelihood_estimate_ids, [LIK_A, LIK_B].sort());
    assert.deepEqual(risk.positive_likelihood_estimate_ids, [LIK_B]);
    assert.deepEqual(risk.zero_likelihood_estimate_ids, [LIK_A]);
    assert.deepEqual(risk.positive_probability_values, [0.4]);
    assertNoForbidden(risk);
  });

  it("probability 1 — RISK yes, RealityState unchanged", () => {
    const project = projectWith({
      scenarios: [scenario()],
      states: [
        {
          id: "f3030303-0303-4303-8303-030303030901",
          project_id: PROJECT_ID,
          subject_id: ENTITY_ID,
          kind: "condition",
          value: "normal",
          valid_from: "2026-08-24T00:00:00.000Z",
          valid_until: null,
          recorded_at: TS,
          created_at: TS,
          updated_at: TS,
        },
      ],
      projections: [
        projection({ projected_value: "leaking", state_kind: "condition" }),
      ],
      references: [
        acceptableRef({
          state_kind: "condition",
          criterion: { kind: "ONE_OF", values: ["normal"] },
        }),
      ],
      likelihoods: [likelihood({ probability: 1 })],
    });
    const before = structuredClone(project.reality_states);
    const assessment = assessProspectiveRisk(project, SCENARIO_ID);
    assert.equal(assessment.has_risk, true);
    assert.deepEqual(project.reality_states, before);
    assertNoForbidden(assessment);
  });

  it("multiple differing likelihood estimates — one RISK, diverge flag", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: 55 })],
      references: [acceptableRef()],
      likelihoods: [
        likelihood({ id: LIK_A, probability: 0.2 }),
        likelihood({
          id: LIK_B,
          probability: 0.7,
          estimated_by: { kind: "model", label: "model-B" },
        }),
        likelihood({
          id: LIK_C,
          probability: 0.5,
          estimated_by: { kind: "human", entity_id: DECLARER_ID },
        }),
      ],
    });
    const assessment = assessProspectiveRisk(project, SCENARIO_ID);
    assert.equal(assessment.risk_findings.length, 1);
    assert.equal(assessment.has_divergent_likelihood_estimates, true);
    const risk = assessment.risk_findings[0]!;
    assert.equal(risk.likelihood_estimates_diverge, true);
    assert.deepEqual(risk.all_likelihood_estimate_ids, [LIK_A, LIK_B, LIK_C]);
    assertNoForbidden(risk);
  });

  it("multiple equal estimates from different sources — one Risk, both retained", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: 55 })],
      references: [acceptableRef()],
      likelihoods: [
        likelihood({ id: LIK_A, probability: 0.5 }),
        likelihood({
          id: LIK_B,
          probability: 0.5,
          estimated_by: { kind: "human", entity_id: DECLARER_ID },
        }),
      ],
    });
    const risks = discoverProspectiveRisks(project, SCENARIO_ID);
    assert.equal(risks.length, 1);
    assert.deepEqual(risks[0]!.all_likelihood_estimate_ids, [LIK_A, LIK_B]);
    assert.equal(risks[0]!.likelihood_estimates_diverge, false);
  });

  it("high likelihood but Acceptable MATCH — RISK none", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: 80 })],
      references: [acceptableRef()],
      likelihoods: [likelihood({ probability: 0.99 })],
    });
    const assessment = assessProspectiveRisk(project, SCENARIO_ID);
    assert.equal(assessment.has_risk, false);
  });

  it("expected deviation only — RISK none", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: 55 })],
      references: [expectedRef()],
      likelihoods: [likelihood({ probability: 0.9 })],
    });
    const assessment = assessProspectiveRisk(project, SCENARIO_ID);
    assert.equal(assessment.has_risk, false);
  });

  it("desired gap only — RISK / OPPORTUNITY / NEED none", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: 55 })],
      references: [desiredRef()],
      likelihoods: [likelihood({ probability: 0.9 })],
    });
    const assessment = assessProspectiveRisk(project, SCENARIO_ID);
    assert.equal(assessment.has_risk, false);
    assertNoForbidden(assessment);
  });

  it("unsupported comparison — RISK none", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: "high" })],
      references: [acceptableRef()],
      likelihoods: [likelihood({ probability: 0.5 })],
    });
    const assessment = assessProspectiveRisk(project, SCENARIO_ID);
    assert.equal(assessment.has_risk, false);
  });

  it("reference conflict — RISK tied to deviating ref, contested", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: 72 })],
      references: [
        acceptableRef({
          criterion: {
            kind: "NUMERIC_RANGE",
            min: 70,
            max: 75,
            min_inclusive: true,
            max_inclusive: true,
          },
        }),
        acceptableRef({
          id: REF_ACCEPTABLE_B,
          criterion: {
            kind: "NUMERIC_RANGE",
            min: 90,
            max: 100,
            min_inclusive: true,
            max_inclusive: true,
          },
        }),
      ],
      likelihoods: [likelihood({ probability: 0.3 })],
    });
    const assessment = assessProspectiveRisk(project, SCENARIO_ID);
    assert.equal(assessment.has_risk, true);
    assert.equal(assessment.has_contested_risk, true);
    const risks = assessment.risk_findings;
    assert.equal(risks.length, 1);
    assert.equal(risks[0]!.reference_condition_id, REF_ACCEPTABLE_B);
    assert.equal(risks[0]!.reference_basis_contested, true);
    const match = assessment.scenario_assessment.reference_assessment.projected_reference_comparisons.filter(
      (entry) => entry.result === "MATCH"
    );
    assert.ok(match.length >= 1);
  });

  it("projection conflict — RISK tied to deviating projection, contested", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [
        projection({ id: PROJ_A, projected_value: 80 }),
        projection({ id: PROJ_B, projected_value: 55 }),
      ],
      references: [acceptableRef()],
      likelihoods: [likelihood({ probability: 0.3 })],
    });
    const assessment = assessProspectiveRisk(project, SCENARIO_ID);
    assert.equal(assessment.has_risk, true);
    const risks = assessment.risk_findings;
    assert.equal(risks.length, 1);
    assert.equal(risks[0]!.projection_id, PROJ_B);
    assert.equal(risks[0]!.projection_basis_contested, true);
    assert.equal(risks[0]!.basis_contested, true);
  });

  it("both reference + projection contested — independent flags preserved", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [
        projection({ id: PROJ_A, projected_value: 72 }),
        projection({ id: PROJ_B, projected_value: 55 }),
      ],
      references: [
        acceptableRef({
          criterion: {
            kind: "NUMERIC_RANGE",
            min: 70,
            max: 75,
            min_inclusive: true,
            max_inclusive: true,
          },
        }),
        acceptableRef({
          id: REF_ACCEPTABLE_B,
          criterion: {
            kind: "NUMERIC_RANGE",
            min: 90,
            max: 100,
            min_inclusive: true,
            max_inclusive: true,
          },
        }),
      ],
      likelihoods: [likelihood({ probability: 0.3 })],
    });
    const risk = assessProspectiveRisk(project, SCENARIO_ID).risk_findings.find(
      (entry) => entry.projection_id === PROJ_B
    );
    assert.ok(risk);
    assert.equal(risk.reference_basis_contested, true);
    assert.equal(risk.projection_basis_contested, true);
    assert.equal(risk.basis_contested, true);
  });

  it("separate deviations — two Risk findings", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [
        projection({ id: PROJ_A, projected_value: 55, state_kind: "pressure" }),
        projection({
          id: PROJ_B,
          projected_value: 120,
          state_kind: "temperature",
        }),
      ],
      references: [
        acceptableRef(),
        acceptableRef({
          id: REF_ACCEPTABLE_B,
          state_kind: "temperature",
          criterion: {
            kind: "NUMERIC_RANGE",
            min: 60,
            max: 100,
            min_inclusive: true,
            max_inclusive: true,
          },
        }),
      ],
      likelihoods: [likelihood({ probability: 0.3 })],
    });
    const risks = discoverProspectiveRisks(project, SCENARIO_ID);
    assert.equal(risks.length, 2);
  });

  it("same projection deviates from two independent Acceptable References", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: 65 })],
      references: [
        acceptableRef({
          criterion: {
            kind: "NUMERIC_RANGE",
            min: 70,
            max: 80,
            min_inclusive: true,
            max_inclusive: true,
          },
        }),
        acceptableRef({
          id: REF_ACCEPTABLE_B,
          criterion: {
            kind: "NUMERIC_RANGE",
            min: 50,
            max: 60,
            min_inclusive: true,
            max_inclusive: true,
          },
        }),
      ],
      likelihoods: [likelihood({ probability: 0.3 })],
    });
    const risks = discoverProspectiveRisks(project, SCENARIO_ID);
    assert.equal(risks.length, 2);
    const refIds = risks.map((entry) => entry.reference_condition_id).sort();
    assert.deepEqual(refIds, [REF_ACCEPTABLE, REF_ACCEPTABLE_B].sort());
  });

  it("current PROBLEM does not create RISK", () => {
    const project = projectWith({
      states: [
        {
          id: "f3030303-0303-4303-8303-030303030901",
          project_id: PROJECT_ID,
          subject_id: ENTITY_ID,
          kind: "pressure",
          value: 55,
          valid_from: FROM,
          valid_until: null,
          recorded_at: TS,
          created_at: TS,
          updated_at: TS,
        },
      ],
      references: [
        acceptableRef({
          valid_from: FROM,
          valid_until: null,
        }),
      ],
    });
    const problems = discoverNormativeFindings(project, ENTITY_ID, AT);
    assert.ok(problems.some((entry) => entry.kind === "PROBLEM"));
    assert.equal(assessAllProspectiveRisks(project).length, 0);
  });

  it("NEED/BLOCKER do not create RISK without prospective basis", () => {
    const project = projectWith({
      states: [
        {
          id: "f3030303-0303-4303-8303-030303030901",
          project_id: PROJECT_ID,
          subject_id: ENTITY_ID,
          kind: "pressure",
          value: 55,
          valid_from: FROM,
          valid_until: null,
          recorded_at: TS,
          created_at: TS,
          updated_at: TS,
        },
      ],
      objectives: [
        {
          id: OBJ_A,
          project_id: PROJECT_ID,
          kind: "STATE_TARGET",
          label: "restore service",
          target_reference_condition_ids: [REF_DESIRED_OBJ],
          valid_from: FROM,
          valid_until: null,
          declared_by: { kind: "human", entity_id: DECLARER_ID },
          recorded_at: TS,
          created_at: TS,
          updated_at: TS,
        },
      ],
      requirements: [
        {
          id: REQ_A,
          project_id: PROJECT_ID,
          label: "pressure band required",
          reference_condition_id: REF_REQ,
          valid_from: FROM,
          valid_until: null,
          declared_by: { kind: "human", entity_id: DECLARER_ID },
          recorded_at: TS,
          created_at: TS,
          updated_at: TS,
        },
      ],
      dependencies: [
        {
          id: DEP_A,
          project_id: PROJECT_ID,
          objective_id: OBJ_A,
          requirement_id: REQ_A,
          kind: "REQUIRES",
          valid_from: FROM,
          valid_until: null,
          declared_by: { kind: "human", entity_id: DECLARER_ID },
          recorded_at: TS,
          created_at: TS,
          updated_at: TS,
        },
      ],
      references: [
        acceptableRef({
          id: REF_REQ,
          valid_from: FROM,
          valid_until: null,
        }),
        acceptableRef({
          id: REF_DESIRED_OBJ,
          reference_kind: "DESIRED",
          valid_from: FROM,
          valid_until: null,
          criterion: { kind: "EQUALS", value: 90 },
        }),
      ],
    });
    const assessment = assessObjectiveDiscovery(project, OBJ_A, AT);
    assert.equal(assessment.has_need, true);
    assert.equal(assessment.has_blocker, true);
    assert.equal(assessAllProspectiveRisks(project).length, 0);
  });

  it("RISK does not create current PROBLEM", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: 55 })],
      references: [acceptableRef()],
      likelihoods: [likelihood({ probability: 0.3 })],
      states: [
        {
          id: "f3030303-0303-4303-8303-030303030901",
          project_id: PROJECT_ID,
          subject_id: ENTITY_ID,
          kind: "pressure",
          value: 80,
          valid_from: "2026-08-24T00:00:00.000Z",
          valid_until: null,
          recorded_at: TS,
          created_at: TS,
          updated_at: TS,
        },
      ],
    });
    assert.equal(assessProspectiveRisk(project, SCENARIO_ID).has_risk, true);
    const problems = discoverNormativeFindings(project, ENTITY_ID, AT);
    assert.equal(problems.some((entry) => entry.kind === "PROBLEM"), false);
  });

  it("read-only — ProjectState unchanged", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: 55 })],
      references: [acceptableRef()],
      likelihoods: [likelihood({ probability: 0.3 })],
    });
    const before = structuredClone(project);
    assessProspectiveRisk(project, SCENARIO_ID);
    assert.deepEqual(project, before);
  });

  it("ontic / epistemic / objective firewalls", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: 55 })],
      references: [acceptableRef()],
      likelihoods: [likelihood({ probability: 1 })],
    });
    const before = {
      reality_entities: structuredClone(project.reality_entities),
      reality_events: structuredClone(project.reality_events),
      reality_states: structuredClone(project.reality_states),
      claims: structuredClone(project.claims),
      evidence: structuredClone(project.evidence),
      epistemic_observations: structuredClone(project.epistemic_observations),
      reality_objectives: structuredClone(project.reality_objectives),
      objective_requirements: structuredClone(project.objective_requirements),
      objective_dependencies: structuredClone(project.objective_dependencies),
    };
    assessProspectiveRisk(project, SCENARIO_ID);
    assert.deepEqual(project.reality_entities, before.reality_entities);
    assert.deepEqual(project.reality_events, before.reality_events);
    assert.deepEqual(project.reality_states, before.reality_states);
    assert.deepEqual(project.claims, before.claims);
    assert.deepEqual(project.evidence, before.evidence);
    assert.deepEqual(
      project.epistemic_observations,
      before.epistemic_observations
    );
    assert.deepEqual(project.reality_objectives, before.reality_objectives);
    assert.deepEqual(
      project.objective_requirements,
      before.objective_requirements
    );
    assert.deepEqual(
      project.objective_dependencies,
      before.objective_dependencies
    );
  });

  it("Studio risk firewall — no studio imports", () => {
    const source = readFileSync(
      join(process.cwd(), "ground-core/reality/prospective-risk-discovery.ts"),
      "utf8"
    );
    assert.ok(
      !source.split("\n").some(
        (line) =>
          /^\s*import\b/.test(line) &&
          /studio\/|state-engine|file-store/.test(line)
      )
    );
  });

  it("determinism — repeated assessment deepEqual", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [
        projection({ id: PROJ_A, projected_value: 55, state_kind: "pressure" }),
        projection({
          id: PROJ_B,
          projected_value: 120,
          state_kind: "temperature",
        }),
      ],
      references: [
        acceptableRef(),
        acceptableRef({
          id: REF_ACCEPTABLE_B,
          state_kind: "temperature",
          criterion: {
            kind: "NUMERIC_RANGE",
            min: 60,
            max: 100,
            min_inclusive: true,
            max_inclusive: true,
          },
        }),
      ],
      likelihoods: [
        likelihood({ id: LIK_B, probability: 0.7 }),
        likelihood({ id: LIK_A, probability: 0.2 }),
      ],
    });
    const a = assessProspectiveRisk(project, SCENARIO_ID);
    const b = assessProspectiveRisk(project, SCENARIO_ID);
    assert.deepEqual(a, b);
  });

  it("layer reuse — consumes assessFutureScenario", () => {
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: 55 })],
      references: [acceptableRef()],
      likelihoods: [likelihood({ probability: 0.3 })],
    });
    const assessment = assessProspectiveRisk(project, SCENARIO_ID);
    assert.ok(assessment.scenario_assessment.scenario.id === SCENARIO_ID);
    assert.ok(assessment.scenario_assessment.reference_assessment);
    assert.ok(assessment.scenario_assessment.likelihood_assessment);
  });

  it("assessAllProspectiveRisks — deterministic scenario order", () => {
    const scenarioB = "fa0a0a0a-0a0a-4a0a-8a0a-0a0a0a0a0a02";
    const project = projectWith({
      scenarios: [
        scenario({ id: scenarioB, label: "B" }),
        scenario({ id: SCENARIO_ID, label: "A" }),
      ],
      projections: [
        projection({ projected_value: 55 }),
        projection({
          id: PROJ_C,
          scenario_id: scenarioB,
          projected_value: 55,
        }),
      ],
      references: [acceptableRef()],
      likelihoods: [
        likelihood({ probability: 0.3 }),
        likelihood({ id: LIK_B, scenario_id: scenarioB, probability: 0.4 }),
      ],
    });
    const all = assessAllProspectiveRisks(project);
    assert.equal(all.length, 2);
    assert.equal(all[0]!.scenario_id, SCENARIO_ID);
    assert.equal(all[1]!.scenario_id, scenarioB);
  });

  it("schema remains 0.1.8 — findings not persisted", () => {
    assert.equal(validProjectStateV0124.schema_version, "0.1.24");
    const project = projectWith({
      scenarios: [scenario()],
      projections: [projection({ projected_value: 55 })],
      references: [acceptableRef()],
      likelihoods: [likelihood({ probability: 0.3 })],
    });
    assessProspectiveRisk(project, SCENARIO_ID);
    assert.equal("prospective_risks" in project, false);
    assert.equal("risks" in project, false);
  });
});
