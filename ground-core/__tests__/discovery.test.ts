import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  assessSituationDiscoveries,
  discoverStructuralFindings,
  discoverUnresolvedSubjectFindings,
  getStructuralFindingsForSubject,
} from "../reality/discovery.js";
import type {
  DiscoveryAssessment,
  StructuralFinding,
} from "../reality/discovery-types.js";
import { buildSituation } from "../reality/situation.js";
import { applyPatch } from "../state-engine.js";
import type {
  Claim,
  ProjectState,
  RealityEntity,
  RealityEvent,
  RealityState,
} from "../types.js";
import { PROJECT_ID, validProjectStateV0124 } from "./fixtures.js";

const ENTITY_ID = "e1010101-0101-4101-8101-010101010101";
const CLAIM_A = "e4040404-0404-4404-8404-040404040401";
const CLAIM_B = "e4040404-0404-4404-8404-040404040402";
const CLAIM_NULL = "e4040404-0404-4404-8404-040404040403";
const EVENT_UNKNOWN = "e2020202-0202-4202-8202-020202020203";
const STATE_NORMAL = "e3030303-0303-4303-8303-030303030301";
const STATE_LEAKING = "e3030303-0303-4303-8303-030303030302";
const OBS_ID = "e2020202-0202-4202-8202-020202020201";
const EV_S = "e3030303-0303-4303-8303-030303030311";
const EV_C = "e3030303-0303-4303-8303-030303030312";
const LINK_S = "e5050505-0505-4505-8505-050505050501";
const LINK_C = "e5050505-0505-4505-8505-050505050502";
const TS = "2026-08-24T12:00:00.000Z";
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

function claim(overrides: Partial<Claim> = {}): Claim {
  return {
    id: CLAIM_A,
    project_id: PROJECT_ID,
    subject_id: ENTITY_ID,
    predicate_kind: "state",
    predicate: "condition",
    value: "normal",
    provenance: { kind: "human" },
    confidence: 0.7,
    applicable_from: "2026-08-24T00:00:00.000Z",
    applicable_until: null,
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function event(overrides: Partial<RealityEvent> = {}): RealityEvent {
  return {
    id: EVENT_UNKNOWN,
    project_id: PROJECT_ID,
    kind: "pipe_rupture",
    subject_ids: [ENTITY_ID],
    occurred_at: null,
    recorded_at: TS,
    summary: "unknown time",
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function state(overrides: Partial<RealityState> = {}): RealityState {
  return {
    id: STATE_NORMAL,
    project_id: PROJECT_ID,
    subject_id: ENTITY_ID,
    kind: "condition",
    value: "normal",
    valid_from: "2026-08-24T00:00:00.000Z",
    valid_until: null,
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function projectWith(input: {
  entities?: RealityEntity[];
  events?: RealityEvent[];
  states?: RealityState[];
  claims?: Claim[];
}): ProjectState {
  return {
    ...structuredClone(validProjectStateV0124),
    reality_entities: input.entities ?? [entity()],
    reality_events: input.events ?? [],
    reality_states: input.states ?? [],
    claims: input.claims ?? [],
  };
}

function kinds(findings: StructuralFinding[]): string[] {
  return findings.map((f) => f.kind).sort();
}

function assertNoForbidden(
  value: StructuralFinding | DiscoveryAssessment | StructuralFinding[]
) {
  const json = JSON.stringify(value);
  for (const forbidden of [
    "priority",
    "severity",
    "urgency",
    "risk_score",
    "impact_score",
    "attention_score",
    "recommended_action",
    "decision",
  ]) {
    assert.ok(!json.includes(`"${forbidden}"`), forbidden);
  }
  assert.ok(!json.includes('"PROBLEM"'));
  assert.ok(!json.includes('"RISK"'));
  assert.ok(!json.includes('"BLOCKER"'));
  assert.ok(!json.includes('"OPPORTUNITY"'));
}

describe("Structural Discovery (GROUND-010)", () => {
  it("quiet Situation → no findings", () => {
    const project = projectWith({ states: [state()], claims: [] });
    const assessment = assessSituationDiscoveries(project, {
      subjectId: ENTITY_ID,
      at: AT,
    });
    assert.deepEqual(assessment.findings, []);
    assert.equal(assessment.has_findings, false);
    assert.deepEqual(assessment.finding_kinds, []);
  });

  it("ONTIC_STATE_CONFLICT with exact State IDs", () => {
    const project = projectWith({
      states: [
        state({ id: STATE_NORMAL, value: "normal" }),
        state({ id: STATE_LEAKING, value: "leaking" }),
      ],
    });
    const findings = getStructuralFindingsForSubject(project, ENTITY_ID, AT);
    const conflict = findings.find((f) => f.kind === "ONTIC_STATE_CONFLICT");
    assert.ok(conflict);
    assert.deepEqual(conflict?.state_ids, [STATE_LEAKING, STATE_NORMAL].sort());
    assert.equal(conflict?.details.conflict_kind, "value_conflict");
    assert.equal(conflict?.status, "OPEN");
  });

  it("EPISTEMIC_POSITION_CONFLICT preserves Claims/Positions — no winner", () => {
    const project = projectWith({
      claims: [
        claim({ id: CLAIM_A, value: "normal" }),
        claim({ id: CLAIM_B, value: "leaking" }),
      ],
    });
    const findings = getStructuralFindingsForSubject(project, ENTITY_ID, AT);
    const conflict = findings.find(
      (f) => f.kind === "EPISTEMIC_POSITION_CONFLICT"
    );
    assert.ok(conflict);
    assert.deepEqual(conflict?.claim_ids.slice().sort(), [CLAIM_A, CLAIM_B].sort());
    assert.ok((conflict?.details.position_value_keys?.length ?? 0) >= 2);
    assert.ok(!kinds(findings).includes("KNOWLEDGE_GAP"));
  });

  it("KNOWLEDGE_GAP for explicit missing Claims", () => {
    const project = projectWith({ claims: [] });
    const findings = getStructuralFindingsForSubject(project, ENTITY_ID, AT, {
      predicateScopes: [{ predicateKind: "state", predicate: "condition" }],
    });
    assert.ok(findings.some((f) => f.kind === "KNOWLEDGE_GAP"));
    assert.ok(findings.some((f) => f.kind === "OBSERVATION_NEED_PRESENT"));
  });

  it("EVIDENCE_DEFICIT for Claim without Evidence", () => {
    const project = projectWith({ claims: [claim()] });
    const findings = getStructuralFindingsForSubject(project, ENTITY_ID, AT);
    const deficit = findings.find((f) => f.kind === "EVIDENCE_DEFICIT");
    assert.ok(deficit);
    assert.deepEqual(deficit?.claim_ids, [CLAIM_A]);
  });

  it("EVIDENCE_TENSION preserves SUPPORTS/CONTRADICTS Evidence IDs", () => {
    let project = projectWith({ claims: [claim({ confidence: 0.55 })] });
    project = applyPatch(project, {
      schema_version: "0.1.3",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "epistemic_observation",
          entity_id: OBS_ID,
          payload: {
            id: OBS_ID,
            project_id: PROJECT_ID,
            kind: "visual",
            content: "x",
            provenance: { kind: "human" },
            subject_ids: [ENTITY_ID],
            observed_at: AT,
            recorded_at: TS,
            created_at: TS,
            updated_at: TS,
          },
        },
        {
          op: "upsert",
          entity: "evidence",
          entity_id: EV_S,
          payload: {
            id: EV_S,
            project_id: PROJECT_ID,
            kind: "observation_ref",
            observation_id: OBS_ID,
            external_ref: null,
            summary: "s",
            provenance: { kind: "human" },
            recorded_at: TS,
            created_at: TS,
            updated_at: TS,
          },
        },
        {
          op: "upsert",
          entity: "evidence",
          entity_id: EV_C,
          payload: {
            id: EV_C,
            project_id: PROJECT_ID,
            kind: "observation_ref",
            observation_id: OBS_ID,
            external_ref: null,
            summary: "c",
            provenance: { kind: "human" },
            recorded_at: TS,
            created_at: TS,
            updated_at: TS,
          },
        },
        {
          op: "upsert",
          entity: "claim_evidence_link",
          entity_id: LINK_S,
          payload: {
            id: LINK_S,
            project_id: PROJECT_ID,
            claim_id: CLAIM_A,
            evidence_id: EV_S,
            relation: "SUPPORTS",
            recorded_at: TS,
            created_at: TS,
            updated_at: TS,
          },
        },
        {
          op: "upsert",
          entity: "claim_evidence_link",
          entity_id: LINK_C,
          payload: {
            id: LINK_C,
            project_id: PROJECT_ID,
            claim_id: CLAIM_A,
            evidence_id: EV_C,
            relation: "CONTRADICTS",
            recorded_at: TS,
            created_at: TS,
            updated_at: TS,
          },
        },
      ],
    });
    const findings = getStructuralFindingsForSubject(project, ENTITY_ID, AT);
    const tension = findings.find((f) => f.kind === "EVIDENCE_TENSION");
    assert.ok(tension);
    assert.deepEqual(tension?.details.supporting_evidence_ids, [EV_S]);
    assert.deepEqual(tension?.details.contradicting_evidence_ids, [EV_C]);
    assert.equal(project.claims[0]?.confidence, 0.55);
  });

  it("TEMPORAL_KNOWLEDGE_GAP preserves prior/later Claims — no interpolation", () => {
    const project = projectWith({
      claims: [
        claim({
          id: CLAIM_A,
          applicable_from: "2026-08-24T10:00:00.000Z",
          applicable_until: "2026-08-24T11:00:00.000Z",
        }),
        claim({
          id: CLAIM_B,
          value: "leaking",
          applicable_from: "2026-08-24T12:00:00.000Z",
          applicable_until: null,
        }),
      ],
    });
    const findings = getStructuralFindingsForSubject(project, ENTITY_ID, AT, {
      predicateScopes: [{ predicateKind: "state", predicate: "condition" }],
    });
    const temporal = findings.find((f) => f.kind === "TEMPORAL_KNOWLEDGE_GAP");
    assert.ok(temporal);
    assert.deepEqual(temporal?.details.prior_claim_ids, [CLAIM_A]);
    assert.deepEqual(temporal?.details.later_claim_ids, [CLAIM_B]);
    assert.ok(findings.some((f) => f.kind === "KNOWLEDGE_GAP"));
  });

  it("OBSERVATION_NEED_PRESENT retains Need keys — no Task", () => {
    const project = projectWith({ claims: [] });
    const findings = getStructuralFindingsForSubject(project, ENTITY_ID, AT, {
      predicateScopes: [{ predicateKind: "state", predicate: "condition" }],
    });
    const need = findings.find((f) => f.kind === "OBSERVATION_NEED_PRESENT");
    assert.ok(need);
    assert.ok((need?.observation_need_keys.length ?? 0) >= 1);
    assertNoForbidden(need!);
  });

  it("UNPLACED_EVENT — no fake occurrence time", () => {
    const project = projectWith({ events: [event()] });
    const findings = getStructuralFindingsForSubject(project, ENTITY_ID, AT);
    const unplaced = findings.find((f) => f.kind === "UNPLACED_EVENT");
    assert.ok(unplaced);
    assert.deepEqual(unplaced?.event_ids, [EVENT_UNKNOWN]);
    const situation = buildSituation(project, {
      subjectId: ENTITY_ID,
      at: AT,
    });
    assert.equal(situation.ontic_context.unplaced_events[0]?.occurred_at, null);
  });

  it("does not classify leaking RealityState as PROBLEM/RISK/BLOCKER", () => {
    const project = projectWith({
      states: [state({ value: "leaking" })],
      claims: [],
    });
    const assessment = assessSituationDiscoveries(project, {
      subjectId: ENTITY_ID,
      at: AT,
    });
    assert.equal(assessment.has_findings, false);
    assertNoForbidden(assessment);
  });

  it("does not invent Findings for unasked predicates", () => {
    const project = projectWith({
      claims: [claim({ predicate: "condition" })],
    });
    const findings = getStructuralFindingsForSubject(project, ENTITY_ID, AT);
    assert.ok(
      !findings.some(
        (f) =>
          f.predicate === "temperature" ||
          f.predicate === "pressure" ||
          f.predicate === "ownership"
      )
    );
  });

  it("deduplicates identical Finding keys and merges provenance", () => {
    const project = projectWith({
      claims: [
        claim({ id: CLAIM_A, value: "normal" }),
        claim({ id: CLAIM_B, value: "leaking" }),
      ],
    });
    const situation = buildSituation(project, {
      subjectId: ENTITY_ID,
      at: AT,
    });
    const a = discoverStructuralFindings(situation);
    const b = discoverStructuralFindings(situation);
    assert.deepEqual(a, b);
    const conflicts = a.filter((f) => f.kind === "EPISTEMIC_POSITION_CONFLICT");
    assert.equal(conflicts.length, 1);
  });

  it("determinism — repeated discovery deepEqual", () => {
    const project = projectWith({
      states: [
        state({ id: STATE_NORMAL, value: "normal" }),
        state({ id: STATE_LEAKING, value: "leaking" }),
      ],
      claims: [
        claim({ id: CLAIM_A, value: "normal" }),
        claim({ id: CLAIM_B, value: "leaking" }),
      ],
      events: [event()],
    });
    const q = { subjectId: ENTITY_ID, at: AT };
    assert.deepEqual(
      assessSituationDiscoveries(project, q),
      assessSituationDiscoveries(project, q)
    );
  });

  it("read-only — ProjectState and Situation unchanged", () => {
    const project = projectWith({
      claims: [
        claim({ id: CLAIM_A, value: "normal" }),
        claim({ id: CLAIM_B, value: "leaking" }),
      ],
    });
    const beforeProject = JSON.stringify(project);
    const situation = buildSituation(project, {
      subjectId: ENTITY_ID,
      at: AT,
    });
    const beforeSituation = JSON.stringify(situation);
    discoverStructuralFindings(situation);
    assessSituationDiscoveries(project, { subjectId: ENTITY_ID, at: AT });
    assert.equal(JSON.stringify(project), beforeProject);
    assert.equal(JSON.stringify(situation), beforeSituation);
  });

  it("layer reuse + import guards + unresolved-subject API isolation", () => {
    const src = readFileSync(
      join(process.cwd(), "ground-core/reality/discovery.ts"),
      "utf8"
    );
    assert.ok(src.includes("buildSituation"));
    assert.ok(!src.includes("assessBeliefAt"));
    assert.ok(!src.includes("assessEpistemicGapsAt"));
    assert.ok(!src.includes("formulateInquiryAt"));
    assert.ok(!/\brandomUUID\s*\(/.test(src));
    assert.ok(!/\bDate\.now\s*\(/.test(src));
    const imports = src.split("\n").filter((line) => /^\s*import\b/.test(line));
    assert.ok(
      !imports.some((line) =>
        /state-engine|file-store|applyPatch|saveProject/.test(line)
      )
    );

    const project = projectWith({
      claims: [
        claim(),
        claim({ id: CLAIM_NULL, subject_id: null, value: "leaking" }),
      ],
    });
    const entityFindings = getStructuralFindingsForSubject(
      project,
      ENTITY_ID,
      AT
    );
    assert.ok(!entityFindings.some((f) => f.kind === "UNRESOLVED_SUBJECT"));
    const unresolved = discoverUnresolvedSubjectFindings(project, AT);
    assert.equal(unresolved.length, 1);
    assert.equal(unresolved[0]?.kind, "UNRESOLVED_SUBJECT");
    assert.deepEqual(unresolved[0]?.claim_ids, [CLAIM_NULL]);
    assert.equal(unresolved[0]?.subject_id, null);
    assertNoForbidden(unresolved);
  });

  it("schema remains 0.1.4 — Findings not persisted", () => {
    const project = projectWith({});
    assert.equal(project.schema_version, "0.1.24");
    assert.equal(
      (project as ProjectState & { findings?: unknown }).findings,
      undefined
    );
  });
});
