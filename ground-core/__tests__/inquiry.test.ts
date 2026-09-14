import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { assessEpistemicGapsAt } from "../reality/epistemic-gaps.js";
import {
  formatInquiryQuestion,
  formulateInquiryAt,
  formulateInquiryFromGapAssessment,
  formulateUnresolvedSubjectInquiries,
  getInquiriesForSubject,
} from "../reality/inquiry.js";
import { applyPatch } from "../state-engine.js";
import type {
  Claim,
  ClaimEvidenceLink,
  Evidence,
  RealityEntity,
} from "../types.js";
import { PROJECT_ID, validProjectStateV013 } from "./fixtures.js";

const ENTITY_ID = "a1010101-0101-4101-8101-010101010101";
const CLAIM_A = "a4040404-0404-4404-8404-040404040401";
const CLAIM_B = "a4040404-0404-4404-8404-040404040402";
const CLAIM_NULL = "a4040404-0404-4404-8404-040404040403";
const OBS_ID = "a2020202-0202-4202-8202-020202020201";
const EV_S = "a3030303-0303-4303-8303-030303030301";
const EV_C = "a3030303-0303-4303-8303-030303030302";
const LINK_S = "a5050505-0505-4505-8505-050505050501";
const LINK_C = "a5050505-0505-4505-8505-050505050502";
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
    provenance: { kind: "human" },
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

describe("Inquiry / Question Formation (GROUND-007)", () => {
  it("NO_APPLICABLE_CLAIMS → ESTABLISH_PROPOSITION", () => {
    const state = withClaims([]);
    const inquiry = formulateInquiryAt(state, query());
    assert.ok(inquiry);
    assert.equal(inquiry?.questions.length, 1);
    assert.equal(inquiry?.questions[0]?.kind, "ESTABLISH_PROPOSITION");
    assert.equal(inquiry?.questions[0]?.subject_id, ENTITY_ID);
    assert.equal(inquiry?.questions[0]?.predicate, "condition");
    assert.equal(inquiry?.questions[0]?.at, AT);
    assert.ok(
      inquiry?.questions[0]?.originating_gap_kinds.includes(
        "NO_APPLICABLE_CLAIMS"
      )
    );
  });

  it("CONTESTED → DISAMBIGUATE_POSITIONS with both positions, no winner", () => {
    const state = withClaims([
      claim({ id: CLAIM_A, value: "normal" }),
      claim({ id: CLAIM_B, value: "leaking" }),
    ]);
    const inquiry = formulateInquiryAt(state, query());
    assert.ok(inquiry);
    const q = inquiry?.questions.find((x) => x.kind === "DISAMBIGUATE_POSITIONS");
    assert.ok(q);
    assert.equal(q?.candidate_value_keys.length, 2);
    assert.equal(inquiry?.status, "OPEN");
  });

  it("NO_LINKED_EVIDENCE → FIND_SUPPORTING_EVIDENCE", () => {
    const state = withClaims([claim()]);
    const inquiry = formulateInquiryAt(state, query());
    assert.ok(inquiry);
    assert.ok(
      inquiry?.questions.some((q) => q.kind === "FIND_SUPPORTING_EVIDENCE")
    );
    assert.deepEqual(
      inquiry?.questions.find((q) => q.kind === "FIND_SUPPORTING_EVIDENCE")
        ?.originating_claim_ids,
      [CLAIM_A]
    );
  });

  it("EVIDENCE_TENSION → RESOLVE_EVIDENCE_TENSION retaining both Evidence IDs", () => {
    let state = withClaims([claim()]);
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
          } satisfies Evidence,
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
          } satisfies ClaimEvidenceLink,
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
    const inquiry = formulateInquiryAt(state, query());
    const q = inquiry?.questions.find(
      (x) => x.kind === "RESOLVE_EVIDENCE_TENSION"
    );
    assert.ok(q);
    assert.deepEqual(q?.originating_evidence_ids.slice().sort(), [
      EV_S,
      EV_C,
    ].sort());
    assert.ok(
      inquiry?.resolution_conditions.some(
        (c) => c.kind === "STRUCTURALLY_UNSPECIFIED"
      )
    );
  });

  it("TEMPORAL_COVERAGE_GAP merges with NO_APPLICABLE into one proposition Question", () => {
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
    const at = "2026-08-24T11:30:00.000Z";
    const gaps = assessEpistemicGapsAt(state, query(at));
    assert.ok(gaps.gaps.some((g) => g.kind === "NO_APPLICABLE_CLAIMS"));
    assert.ok(gaps.gaps.some((g) => g.kind === "TEMPORAL_COVERAGE_GAP"));

    const inquiry = formulateInquiryFromGapAssessment(gaps);
    assert.ok(inquiry);
    const propQuestions = inquiry?.questions.filter(
      (q) =>
        q.kind === "FILL_TEMPORAL_COVERAGE" ||
        q.kind === "ESTABLISH_PROPOSITION"
    );
    assert.equal(propQuestions?.length, 1);
    assert.equal(propQuestions?.[0]?.kind, "FILL_TEMPORAL_COVERAGE");
    assert.deepEqual(
      propQuestions?.[0]?.originating_gap_kinds.slice().sort(),
      ["NO_APPLICABLE_CLAIMS", "TEMPORAL_COVERAGE_GAP"].sort()
    );
    assert.deepEqual(propQuestions?.[0]?.prior_claim_ids, [CLAIM_A]);
    assert.deepEqual(propQuestions?.[0]?.later_claim_ids, [CLAIM_B]);
    assert.equal(propQuestions?.[0]?.at, at);
  });

  it("unresolved subject → RESOLVE_SUBJECT_IDENTITY with no candidates", () => {
    const state = withClaims([
      claim({
        id: CLAIM_NULL,
        subject_id: null,
        value: "leaking",
      }),
    ]);
    const inquiries = formulateUnresolvedSubjectInquiries(state, AT);
    assert.equal(inquiries.length, 1);
    assert.equal(inquiries[0]?.questions[0]?.kind, "RESOLVE_SUBJECT_IDENTITY");
    assert.equal(inquiries[0]?.questions[0]?.subject_id, null);
    assert.deepEqual(inquiries[0]?.questions[0]?.originating_claim_ids, [
      CLAIM_NULL,
    ]);
    assert.equal(inquiries[0]?.questions[0]?.candidate_value_keys.length, 0);
  });

  it("no gaps → no Inquiry", () => {
    let state = withClaims([claim()]);
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
    const gaps = assessEpistemicGapsAt(state, query());
    assert.equal(gaps.has_gaps, false);
    assert.equal(formulateInquiryFromGapAssessment(gaps), null);
    assert.equal(formulateInquiryAt(state, query()), null);
    assert.deepEqual(getInquiriesForSubject(state, ENTITY_ID, AT), []);
  });

  it("deterministic keys; no UUID/Date.now; read-only; uses gap layer", () => {
    const state = withClaims([
      claim({ id: CLAIM_A, value: "normal" }),
      claim({ id: CLAIM_B, value: "leaking" }),
    ]);
    const before = JSON.stringify(state);
    const a = formulateInquiryAt(state, query());
    const b = formulateInquiryAt(state, query());
    assert.deepEqual(a, b);
    assert.ok(a?.key.startsWith("inq|"));
    assert.ok(a?.questions.every((q) => q.key.startsWith("q|")));
    assert.equal(JSON.stringify(state), before);

    const formatted = formatInquiryQuestion(a!.questions[0]!);
    assert.equal(typeof formatted, "string");
    assert.ok(formatted.length > 0);

    const src = readFileSync(
      join(process.cwd(), "ground-core/reality/inquiry.ts"),
      "utf8"
    );
    assert.ok(src.includes("assessEpistemicGapsAt"));
    assert.ok(!/\brandomUUID\s*\(/.test(src));
    assert.ok(!/\bDate\.now\s*\(/.test(src));
    const imports = src.split("\n").filter((line) => /^\s*import\b/.test(line));
    assert.ok(
      !imports.some((line) =>
        /state-engine|file-store|applyPatch|saveProject/.test(line)
      )
    );
  });
});
