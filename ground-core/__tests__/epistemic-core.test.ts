import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { PatchError } from "../errors.js";
import { loadProject, saveProject } from "../file-store.js";
import { migrateProjectState } from "../migrate.js";
import {
  getClaimsForSubject,
  getEvidenceForClaim,
  getObservationsForSubject,
} from "../reality/epistemic.js";
import { getRealityWorldline } from "../reality/worldline.js";
import { applyPatch } from "../state-engine.js";
import type {
  Claim,
  ClaimEvidenceLink,
  Evidence,
  EpistemicObservation,
  RealityEntity,
  StatePatch,
} from "../types.js";
import {
  PROJECT_ID,
  validProjectStateV012,
  validProjectStateV013,
} from "./fixtures.js";

const ENTITY_ID = "d1010101-0101-4101-8101-010101010101";
const OBS_ID = "d2020202-0202-4202-8202-020202020201";
const EVIDENCE_SUPPORT_ID = "d3030303-0303-4303-8303-030303030301";
const EVIDENCE_CONTRA_ID = "d3030303-0303-4303-8303-030303030302";
const CLAIM_NORMAL_ID = "d4040404-0404-4404-8404-040404040401";
const CLAIM_LEAK_ID = "d4040404-0404-4404-8404-040404040402";
const LINK_SUPPORT_ID = "d5050505-0505-4505-8505-050505050501";
const LINK_CONTRA_ID = "d5050505-0505-4505-8505-050505050502";
const TS = "2026-04-01T12:00:00.000Z";
const OBSERVED = "2026-04-01T10:00:00.000Z";
const RECORDED = "2026-04-01T12:00:00.000Z";

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

function observation(
  overrides: Partial<EpistemicObservation> = {}
): EpistemicObservation {
  return {
    id: OBS_ID,
    project_id: PROJECT_ID,
    kind: "visual",
    content: "Water is coming out of the road.",
    provenance: {
      kind: "human",
      external_id: "citizen-report-1",
      label: "citizen",
    },
    subject_ids: [ENTITY_ID],
    observed_at: OBSERVED,
    recorded_at: RECORDED,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function evidence(
  overrides: Partial<Evidence> = {}
): Evidence {
  return {
    id: EVIDENCE_SUPPORT_ID,
    project_id: PROJECT_ID,
    kind: "observation_ref",
    observation_id: OBS_ID,
    external_ref: null,
    summary: "Citizen visual report",
    provenance: { kind: "human", label: "citizen" },
    recorded_at: RECORDED,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function claim(overrides: Partial<Claim> = {}): Claim {
  return {
    id: CLAIM_NORMAL_ID,
    project_id: PROJECT_ID,
    subject_id: ENTITY_ID,
    predicate_kind: "state",
    predicate: "condition",
    value: "normal",
    provenance: { kind: "human", label: "operator" },
    confidence: 0.5,
    applicable_from: OBSERVED,
    applicable_until: null,
    recorded_at: RECORDED,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function link(overrides: Partial<ClaimEvidenceLink> = {}): ClaimEvidenceLink {
  return {
    id: LINK_SUPPORT_ID,
    project_id: PROJECT_ID,
    claim_id: CLAIM_LEAK_ID,
    evidence_id: EVIDENCE_SUPPORT_ID,
    relation: "SUPPORTS",
    recorded_at: RECORDED,
    created_at: TS,
    updated_at: TS,
    ...overrides,
  };
}

function withEntity(): typeof validProjectStateV013 {
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
    ],
  });
}

function onticSnapshot(state: {
  reality_entities: unknown;
  reality_events: unknown;
  reality_states: unknown;
}): string {
  return JSON.stringify({
    reality_entities: state.reality_entities,
    reality_events: state.reality_events,
    reality_states: state.reality_states,
  });
}

describe("Epistemic Core I (GROUND-004)", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "ground-core-epistemic-"));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  describe("EpistemicObservation", () => {
    it("creates, preserves observed_at/recorded_at/provenance, roundtrips", () => {
      const base = withEntity();
      const next = applyPatch(base, {
        schema_version: "0.1.3",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "epistemic_observation",
            entity_id: OBS_ID,
            payload: observation(),
          },
        ],
      });
      assert.equal(next.epistemic_observations.length, 1);
      assert.equal(next.epistemic_observations[0]?.observed_at, OBSERVED);
      assert.equal(next.epistemic_observations[0]?.recorded_at, RECORDED);
      assert.equal(next.epistemic_observations[0]?.provenance.kind, "human");
      assert.equal(
        next.epistemic_observations[0]?.provenance.external_id,
        "citizen-report-1"
      );

      saveProject(next, { storageDir: tempDir });
      const loaded = loadProject(PROJECT_ID, { storageDir: tempDir });
      assert.equal(loaded.epistemic_observations[0]?.observed_at, OBSERVED);
      assert.equal(loaded.epistemic_observations[0]?.recorded_at, RECORDED);
    });

    it("allows unknown observed_at as null without fabricating recorded_at", () => {
      const next = applyPatch(withEntity(), {
        schema_version: "0.1.3",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "epistemic_observation",
            entity_id: OBS_ID,
            payload: observation({ observed_at: null }),
          },
        ],
      });
      assert.equal(next.epistemic_observations[0]?.observed_at, null);
      assert.equal(next.epistemic_observations[0]?.recorded_at, RECORDED);
    });
  });

  describe("Evidence", () => {
    it("creates observation_ref evidence and roundtrips", () => {
      const withObs = applyPatch(withEntity(), {
        schema_version: "0.1.3",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "epistemic_observation",
            entity_id: OBS_ID,
            payload: observation(),
          },
        ],
      });
      const next = applyPatch(withObs, {
        schema_version: "0.1.3",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "evidence",
            entity_id: EVIDENCE_SUPPORT_ID,
            payload: evidence(),
          },
        ],
      });
      assert.equal(next.evidence[0]?.observation_id, OBS_ID);
      saveProject(next, { storageDir: tempDir });
      const loaded = loadProject(PROJECT_ID, { storageDir: tempDir });
      assert.equal(loaded.evidence[0]?.kind, "observation_ref");
    });

    it("rejects unknown strict observation reference", () => {
      assert.throws(
        () =>
          applyPatch(withEntity(), {
            schema_version: "0.1.3",
            project_id: PROJECT_ID,
            source: "manual",
            operations: [
              {
                op: "upsert",
                entity: "evidence",
                entity_id: EVIDENCE_SUPPORT_ID,
                payload: evidence(),
              },
            ],
          }),
        (err: unknown) =>
          err instanceof PatchError && /missing observation_id/.test(err.message)
      );
    });
  });

  describe("Claim", () => {
    it("creates claim about RealityEntity with confidence bounds", () => {
      const base = withEntity();
      for (const confidence of [0, 1, 0.72]) {
        const next = applyPatch(base, {
          schema_version: "0.1.3",
          project_id: PROJECT_ID,
          source: "manual",
          operations: [
            {
              op: "upsert",
              entity: "claim",
              entity_id: CLAIM_NORMAL_ID,
              payload: claim({ confidence }),
            },
          ],
        });
        assert.equal(next.claims[0]?.confidence, confidence);
      }
    });

    it("rejects confidence outside [0,1]", () => {
      for (const confidence of [-0.01, 1.01]) {
        assert.throws(
          () =>
            applyPatch(withEntity(), {
              schema_version: "0.1.3",
              project_id: PROJECT_ID,
              source: "manual",
              operations: [
                {
                  op: "upsert",
                  entity: "claim",
                  entity_id: CLAIM_NORMAL_ID,
                  payload: claim({ confidence }),
                },
              ],
            }),
          (err: unknown) => {
            if (err instanceof PatchError) {
              return (
                /confidence/.test(err.message) ||
                Array.isArray(err.details)
              );
            }
            return false;
          }
        );
      }
    });

    it("persist/load roundtrip preserves claim", () => {
      const next = applyPatch(withEntity(), {
        schema_version: "0.1.3",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "claim",
            entity_id: CLAIM_LEAK_ID,
            payload: claim({
              id: CLAIM_LEAK_ID,
              value: "leaking",
              confidence: 0.72,
              provenance: { kind: "ai_model", label: "sat-v1" },
            }),
          },
        ],
      });
      saveProject(next, { storageDir: tempDir });
      const loaded = loadProject(PROJECT_ID, { storageDir: tempDir });
      assert.equal(loaded.claims[0]?.value, "leaking");
      assert.equal(loaded.claims[0]?.confidence, 0.72);
    });
  });

  describe("Disagreement + support/contradiction", () => {
    it("persists incompatible Claims simultaneously without overwrite", () => {
      const next = applyPatch(withEntity(), {
        schema_version: "0.1.3",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "claim",
            entity_id: CLAIM_NORMAL_ID,
            payload: claim({ value: "normal", confidence: 0.4 }),
          },
          {
            op: "upsert",
            entity: "claim",
            entity_id: CLAIM_LEAK_ID,
            payload: claim({
              id: CLAIM_LEAK_ID,
              value: "leaking",
              confidence: 0.8,
            }),
          },
        ],
      });
      assert.equal(next.claims.length, 2);
      const values = next.claims.map((c) => c.value).sort();
      assert.deepEqual(values, ["leaking", "normal"]);
      assert.equal(getClaimsForSubject(next, ENTITY_ID).length, 2);
    });

    it("keeps SUPPORTS and CONTRADICTS visible without mutating confidence", () => {
      let state = applyPatch(withEntity(), {
        schema_version: "0.1.3",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "epistemic_observation",
            entity_id: OBS_ID,
            payload: observation(),
          },
          {
            op: "upsert",
            entity: "claim",
            entity_id: CLAIM_LEAK_ID,
            payload: claim({
              id: CLAIM_LEAK_ID,
              value: "leaking",
              confidence: 0.72,
            }),
          },
        ],
      });
      state = applyPatch(state, {
        schema_version: "0.1.3",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "evidence",
            entity_id: EVIDENCE_SUPPORT_ID,
            payload: evidence(),
          },
          {
            op: "upsert",
            entity: "evidence",
            entity_id: EVIDENCE_CONTRA_ID,
            payload: evidence({
              id: EVIDENCE_CONTRA_ID,
              kind: "external_ref",
              observation_id: null,
              external_ref: "doc://inspection-clear",
              summary: "Earlier inspection said normal",
              provenance: { kind: "document", label: "inspection" },
            }),
          },
          {
            op: "upsert",
            entity: "claim_evidence_link",
            entity_id: LINK_SUPPORT_ID,
            payload: link({
              claim_id: CLAIM_LEAK_ID,
              evidence_id: EVIDENCE_SUPPORT_ID,
              relation: "SUPPORTS",
            }),
          },
          {
            op: "upsert",
            entity: "claim_evidence_link",
            entity_id: LINK_CONTRA_ID,
            payload: link({
              id: LINK_CONTRA_ID,
              claim_id: CLAIM_LEAK_ID,
              evidence_id: EVIDENCE_CONTRA_ID,
              relation: "CONTRADICTS",
            }),
          },
        ],
      });

      const bundle = getEvidenceForClaim(state, CLAIM_LEAK_ID);
      assert.equal(bundle.supports.length, 1);
      assert.equal(bundle.contradicts.length, 1);
      assert.equal(state.claims[0]?.confidence, 0.72);
      assert.equal(getObservationsForSubject(state, ENTITY_ID).length, 1);
    });
  });

  describe("Ontic firewall + Worldline isolation", () => {
    it("epistemic-only patch does not mutate ontic Reality collections", () => {
      const base = withEntity();
      const before = onticSnapshot(base);
      const patch: StatePatch = {
        schema_version: "0.1.3",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "epistemic_observation",
            entity_id: OBS_ID,
            payload: observation(),
          },
          {
            op: "upsert",
            entity: "claim",
            entity_id: CLAIM_LEAK_ID,
            payload: claim({
              id: CLAIM_LEAK_ID,
              value: "leaking",
              confidence: 0.81,
              provenance: { kind: "ai_model", label: "satellite" },
            }),
          },
        ],
      };
      const next = applyPatch(base, patch);
      assert.equal(onticSnapshot(next), before);
      assert.equal(next.reality_states.length, 0);
      assert.equal(next.reality_events.length, 0);
      assert.equal(next.claims.length, 1);
    });

    it("Worldline remains ontic-only after epistemic records exist", () => {
      const state = applyPatch(withEntity(), {
        schema_version: "0.1.3",
        project_id: PROJECT_ID,
        source: "manual",
        operations: [
          {
            op: "upsert",
            entity: "epistemic_observation",
            entity_id: OBS_ID,
            payload: observation(),
          },
          {
            op: "upsert",
            entity: "claim",
            entity_id: CLAIM_LEAK_ID,
            payload: claim({ id: CLAIM_LEAK_ID, value: "leaking" }),
          },
        ],
      });
      const wl = getRealityWorldline(state, ENTITY_ID);
      assert.equal(wl.events.length, 0);
      assert.equal(wl.states.length, 0);
      assert.equal(wl.ordered_entries.length, 0);
      assert.ok(!("claims" in wl));
      assert.ok(!JSON.stringify(wl).includes("leaking"));
    });
  });

  describe("Migration", () => {
    it("migrates 0.1.2 to 0.1.4 with empty epistemic collections", () => {
      const migrated = migrateProjectState(validProjectStateV012);
      assert.equal(migrated.schema_version, "0.1.25");
      assert.deepEqual(migrated.epistemic_observations, []);
      assert.deepEqual(migrated.evidence, []);
      assert.deepEqual(migrated.claims, []);
      assert.deepEqual(migrated.claim_evidence_links, []);
      assert.deepEqual(migrated.observations, []);
    });
  });
});
