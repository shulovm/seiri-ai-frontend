import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  assessEpistemicGapsAt,
  getEpistemicGapsForSubject,
  getUnresolvedSubjectClaims,
} from "../reality/epistemic-gaps.js";
import { applyPatch } from "../state-engine.js";
import type {
  Claim,
  ClaimEvidenceLink,
  Evidence,
  EpistemicObservation,
  RealityEntity,
} from "../types.js";
import { PROJECT_ID, validProjectStateV013 } from "./fixtures.js";

const ENTITY_ID = "f1010101-0101-4101-8101-010101010101";
const CLAIM_A = "f4040404-0404-4404-8404-040404040401";
const CLAIM_B = "f4040404-0404-4404-8404-040404040402";
const CLAIM_NULL = "f4040404-0404-4404-8404-040404040403";
const OBS_ID = "f2020202-0202-4202-8202-020202020201";
const EV_S = "f3030303-0303-4303-8303-030303030301";
const EV_C = "f3030303-0303-4303-8303-030303030302";
const LINK_S = "f5050505-0505-4505-8505-050505050501";
const LINK_C = "f5050505-0505-4505-8505-050505050502";
const TS = "2026-08-24T12:00:00.000Z";
const AT = "2026-08-24T10:30:00.000Z";

function entity(): RealityEntity {
  return {
    id: ENTITY_ID,
    project_id: PROJECT_ID,
    kind: "asset",
    label: "pipe-A",
    created_at: TS,
    updated_at: TS,
  };
}

function claim(overrides: Partial<Claim> = {}): Claim {
  return {
    id: CLAIM_A,
    project_id: PROJECT_ID,
    subject_id: ENTITY_ID,
    predicate_kind: "state",
    predicate: "condition",
    value: "leaking",
    provenance: { kind: "human", label: "op" },
    confidence: 0.72,
    applicable_from: "2026-08-24T00:00:00.000Z",
    applicable_until: null,
    recorded_at: TS,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function withClaims(claims: Claim[]): ReturnType<typeof applyPatch> {
  return applyPatch(validProjectStateV013, {
    schema_version: "0.1.3",
    project_id: PROJECT_ID,
    source: "manual",
    operations: [
      {
        op: "upsert",
        entity: "reality_entity",
        entity_id: ENTITY_ID,
        payload: entity(),
      },
      ...claims.map((c) => ({
        op: "upsert" as const,
        entity: "claim" as const,
        entity_id: c.id,
        payload: c,
      })),
    ],
  });
}

function query(at = AT) {
  return {
    subjectId: ENTITY_ID,
    predicateKind: "state" as const,
    predicate: "condition",
    at,
  };
}

function gapKinds(assessment: { gaps: Array<{ kind: string }> }): string[] {
  return assessment.gaps.map((g) => g.kind);
}

describe("Epistemic Gap / Unknown (GROUND-006)", () => {
  it("NO_APPLICABLE_CLAIMS for explicit query with no Claims", () => {
    const state = withClaims([]);
    const before = JSON.stringify(state);
    const assessment = assessEpistemicGapsAt(state, query());
    assert.equal(assessment.belief_assessment.status, "NO_CLAIMS");
    assert.deepEqual(gapKinds(assessment), ["NO_APPLICABLE_CLAIMS"]);
    assert.equal(assessment.has_gaps, true);
    assert.equal(JSON.stringify(state), before);
  });

  it("uncontested Claim with SUPPORTS Evidence → no structural gaps", () => {
    let state = withClaims([claim({ confidence: 0.72 })]);
    const observation: EpistemicObservation = {
      id: OBS_ID,
      project_id: PROJECT_ID,
      kind: "visual",
      content: "water",
      provenance: { kind: "human" },
      subject_ids: [ENTITY_ID],
      observed_at: AT,
      recorded_at: TS,
      created_at: TS,
      updated_at: TS,
    };
    const evidence: Evidence = {
      id: EV_S,
      project_id: PROJECT_ID,
      kind: "observation_ref",
      observation_id: OBS_ID,
      external_ref: null,
      summary: "support",
      provenance: { kind: "human" },
      recorded_at: TS,
      created_at: TS,
      updated_at: TS,
    };
    const link: ClaimEvidenceLink = {
      id: LINK_S,
      project_id: PROJECT_ID,
      claim_id: CLAIM_A,
      evidence_id: EV_S,
      relation: "SUPPORTS",
      recorded_at: TS,
      created_at: TS,
      updated_at: TS,
    };
    state = applyPatch(state, {
      schema_version: "0.1.3",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "epistemic_observation",
          entity_id: OBS_ID,
          payload: observation,
        },
        {
          op: "upsert",
          entity: "evidence",
          entity_id: EV_S,
          payload: evidence,
        },
        {
          op: "upsert",
          entity: "claim_evidence_link",
          entity_id: LINK_S,
          payload: link,
        },
      ],
    });
    const assessment = assessEpistemicGapsAt(state, query());
    assert.equal(assessment.belief_assessment.status, "UNCONTESTED");
    assert.deepEqual(assessment.gaps, []);
    assert.equal(assessment.has_gaps, false);
    assert.equal(state.reality_states.length, 0);
  });

  it("uncontested Claim with no Evidence → NO_LINKED_EVIDENCE", () => {
    const state = withClaims([claim()]);
    const assessment = assessEpistemicGapsAt(state, query());
    assert.equal(assessment.belief_assessment.status, "UNCONTESTED");
    assert.deepEqual(gapKinds(assessment), ["NO_LINKED_EVIDENCE"]);
    assert.deepEqual(assessment.gaps[0]?.claim_ids, [CLAIM_A]);
    assert.equal(state.claims[0]?.confidence, 0.72);
  });

  it("divergent Claims → CONTESTED_POSITIONS with no winner", () => {
    const state = withClaims([
      claim({ id: CLAIM_A, value: "normal", confidence: 0.4 }),
      claim({ id: CLAIM_B, value: "leaking", confidence: 0.9 }),
    ]);
    const assessment = assessEpistemicGapsAt(state, query());
    assert.equal(assessment.belief_assessment.status, "CONTESTED");
    assert.ok(gapKinds(assessment).includes("CONTESTED_POSITIONS"));
    assert.equal(assessment.belief_assessment.leading_position, null);
    assert.deepEqual(
      assessment.gaps
        .find((g) => g.kind === "CONTESTED_POSITIONS")
        ?.claim_ids.slice()
        .sort(),
      [CLAIM_A, CLAIM_B].sort()
    );
  });

  it("Evidence tension exposes EVIDENCE_TENSION without confidence mutation", () => {
    let state = withClaims([claim({ confidence: 0.55 })]);
    state = applyPatch(state, {
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
            kind: "external_ref",
            observation_id: null,
            external_ref: "doc://c",
            summary: "c",
            provenance: { kind: "document" },
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
    const assessment = assessEpistemicGapsAt(state, query());
    assert.ok(gapKinds(assessment).includes("EVIDENCE_TENSION"));
    const tension = assessment.gaps.find((g) => g.kind === "EVIDENCE_TENSION");
    assert.deepEqual(tension?.details.supporting_evidence_ids, [EV_S]);
    assert.deepEqual(tension?.details.contradicting_evidence_ids, [EV_C]);
    assert.equal(state.claims[0]?.confidence, 0.55);
  });

  it("temporal coverage gap when Claims before and after but none at query time", () => {
    const state = withClaims([
      claim({
        id: CLAIM_A,
        value: "normal",
        applicable_from: "2026-08-24T10:00:00.000Z",
        applicable_until: "2026-08-24T11:00:00.000Z",
      }),
      claim({
        id: CLAIM_B,
        value: "leaking",
        applicable_from: "2026-08-24T12:00:00.000Z",
        applicable_until: null,
      }),
    ]);
    const assessment = assessEpistemicGapsAt(
      state,
      query("2026-08-24T11:30:00.000Z")
    );
    assert.equal(assessment.belief_assessment.status, "NO_CLAIMS");
    assert.deepEqual(gapKinds(assessment).sort(), [
      "NO_APPLICABLE_CLAIMS",
      "TEMPORAL_COVERAGE_GAP",
    ].sort());
    const temporal = assessment.gaps.find(
      (g) => g.kind === "TEMPORAL_COVERAGE_GAP"
    );
    assert.deepEqual(temporal?.details.prior_claim_ids, [CLAIM_A]);
    assert.deepEqual(temporal?.details.later_claim_ids, [CLAIM_B]);
  });

  it("Claim value \"unknown\" is not NO_APPLICABLE_CLAIMS", () => {
    const state = withClaims([claim({ value: "unknown" })]);
    const assessment = assessEpistemicGapsAt(state, query());
    assert.equal(assessment.belief_assessment.status, "UNCONTESTED");
    assert.ok(!gapKinds(assessment).includes("NO_APPLICABLE_CLAIMS"));
    assert.equal(assessment.belief_assessment.positions[0]?.value, "unknown");
    assert.ok(gapKinds(assessment).includes("NO_LINKED_EVIDENCE"));
  });

  it("low confidence alone does not create a gap", () => {
    let state = withClaims([claim({ confidence: 0.01 })]);
    state = applyPatch(state, {
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
      ],
    });
    const assessment = assessEpistemicGapsAt(state, query());
    assert.equal(assessment.belief_assessment.status, "UNCONTESTED");
    assert.deepEqual(assessment.gaps, []);
  });

  it("unresolved subject Claims are visible and isolated from Entity gaps", () => {
    const state = withClaims([
      claim({ id: CLAIM_A, value: "normal" }),
      claim({
        id: CLAIM_NULL,
        subject_id: null,
        value: "leaking",
        confidence: 0.99,
      }),
    ]);
    const unresolved = getUnresolvedSubjectClaims(state, AT);
    assert.equal(unresolved.length, 1);
    assert.equal(unresolved[0]?.claim.id, CLAIM_NULL);
    assert.equal(unresolved[0]?.claim.subject_id, null);

    const assessment = assessEpistemicGapsAt(state, query());
    assert.equal(assessment.belief_assessment.applicable_claims.length, 1);
    assert.equal(assessment.belief_assessment.positions[0]?.value, "normal");
    assert.ok(
      !assessment.gaps.some((g) => g.claim_ids.includes(CLAIM_NULL))
    );
  });

  it("evidence/claim count imbalance does not resolve CONTESTED", () => {
    const many: Claim[] = [];
    for (let i = 0; i < 10; i += 1) {
      many.push(
        claim({
          id: `f4040404-0404-4404-8404-0404040404${String(i).padStart(2, "0")}`,
          value: "leaking",
          confidence: 0.9,
        })
      );
    }
    many.push(claim({ id: CLAIM_B, value: "normal", confidence: 0.1 }));
    const state = withClaims(many);
    const assessment = assessEpistemicGapsAt(state, query());
    assert.equal(assessment.belief_assessment.status, "CONTESTED");
    assert.ok(gapKinds(assessment).includes("CONTESTED_POSITIONS"));
    assert.equal(assessment.belief_assessment.leading_position, null);
  });

  it("is deterministic and read-only; does not invent predicates", () => {
    const state = withClaims([
      claim({ id: CLAIM_A, value: "normal" }),
      claim({ id: CLAIM_B, value: "leaking" }),
    ]);
    const before = JSON.stringify(state);
    const a = assessEpistemicGapsAt(state, query());
    const b = assessEpistemicGapsAt(state, query());
    assert.deepEqual(a, b);

    const subjectGaps = getEpistemicGapsForSubject(state, ENTITY_ID, AT);
    assert.equal(subjectGaps.length, 1);
    assert.equal(subjectGaps[0]?.query.predicate, "condition");
    // temperature never claimed → not invented
    assert.ok(!subjectGaps.some((g) => g.query.predicate === "temperature"));

    assert.equal(JSON.stringify(state), before);

    const src = readFileSync(
      join(process.cwd(), "ground-core/reality/epistemic-gaps.ts"),
      "utf8"
    );
    const imports = src.split("\n").filter((line) => /^\s*import\b/.test(line));
    assert.ok(
      !imports.some((line) =>
        /state-engine|file-store|applyPatch|saveProject/.test(line)
      )
    );
  });
});
