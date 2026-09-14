import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  validateLegacyProjectState,
  validateProjectState,
  validateProjectStateV011,
  validateProjectStateV012,
  validateProjectStateV013,
  validateProjectStateV014,
  validateProjectStateV015,
  validateStatePatch,
} from "../validate.js";
import {
  PROJECT_ID,
  validProjectStateV010,
  validProjectStateV011,
  validProjectStateV012,
  validProjectStateV013,
  validProjectStateV014,
  validProjectStateV015,
  validProjectStateV0125,
  validStatePatchStatusChange,
  validStatePatchUpsert,
} from "./fixtures.js";
import { migrateProjectState } from "../migrate.js";

describe("validateProjectState v0.1.16", () => {
  it("accepts a minimal valid v0.1.16 ProjectState", () => {
    const result = validateProjectState(validProjectStateV0125);
    assert.equal(result.valid, true);
  });

  it("accepts migrated v0.1.0 fixture as v0.1.16", () => {
    const migrated = migrateProjectState(validProjectStateV010);
    const result = validateProjectState(migrated);
    assert.equal(result.valid, true);
    assert.equal(migrated.schema_version, "0.1.25");
  });

  it("rejects missing schema_version", () => {
    const { schema_version: _removed, ...invalid } = validProjectStateV0125;
    const result = validateProjectState(invalid);
    assert.equal(result.valid, false);
  });

  it("rejects invalid project id format", () => {
    const invalid = structuredClone(validProjectStateV0125);
    invalid.project.id = "not-a-uuid";
    const result = validateProjectState(invalid);
    assert.equal(result.valid, false);
  });

  it("rejects wrong schema_version", () => {
    const invalid = {
      ...structuredClone(validProjectStateV0125),
      schema_version: "0.2.0",
    };
    const result = validateProjectState(invalid);
    assert.equal(result.valid, false);
  });

  it("rejects raw v0.1.5 without migration (canonical is 0.1.16)", () => {
    const result = validateProjectState(validProjectStateV015);
    assert.equal(result.valid, false);
  });

  it("rejects raw v0.1.4 without migration (canonical is 0.1.16)", () => {
    const result = validateProjectState(validProjectStateV014);
    assert.equal(result.valid, false);
  });

  it("rejects raw v0.1.3 without migration (canonical is 0.1.16)", () => {
    const result = validateProjectState(validProjectStateV013);
    assert.equal(result.valid, false);
  });
});

describe("validateProjectStateV015", () => {
  it("still accepts historical v0.1.5 shape for migration", () => {
    const result = validateProjectStateV015(validProjectStateV015);
    assert.equal(result.valid, true);
  });
});

describe("validateProjectStateV014", () => {
  it("still accepts historical v0.1.4 shape for migration", () => {
    const result = validateProjectStateV014(validProjectStateV014);
    assert.equal(result.valid, true);
  });
});

describe("validateProjectStateV013", () => {
  it("still accepts historical v0.1.3 shape for migration", () => {
    const result = validateProjectStateV013(validProjectStateV013);
    assert.equal(result.valid, true);
  });
});

describe("validateProjectStateV012", () => {
  it("still accepts historical v0.1.2 shape for migration", () => {
    const result = validateProjectStateV012(validProjectStateV012);
    assert.equal(result.valid, true);
  });
});

describe("validateProjectStateV011", () => {
  it("still accepts historical v0.1.1 shape for migration", () => {
    const result = validateProjectStateV011(validProjectStateV011);
    assert.equal(result.valid, true);
  });
});

describe("validateLegacyProjectState v0.1.0", () => {
  it("accepts legacy fixture", () => {
    const result = validateLegacyProjectState(validProjectStateV010);
    assert.equal(result.valid, true);
  });
});

describe("validateStatePatch", () => {
  it("accepts a valid upsert patch with schema 0.1.0", () => {
    const result = validateStatePatch(validStatePatchUpsert);
    assert.equal(result.valid, true);
  });

  it("accepts a valid status_change patch", () => {
    const result = validateStatePatch(validStatePatchStatusChange);
    assert.equal(result.valid, true);
  });

  it("accepts schema_version 0.1.1", () => {
    const result = validateStatePatch({
      ...validStatePatchUpsert,
      schema_version: "0.1.1",
    });
    assert.equal(result.valid, true);
  });

  it("rejects upsert without payload", () => {
    const result = validateStatePatch({
      schema_version: "0.1.1",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "upsert",
          entity: "blocker",
          entity_id: "00000000-0000-4000-8000-000000000001",
        },
      ],
    });
    assert.equal(result.valid, false);
  });

  it("rejects status_change without status", () => {
    const result = validateStatePatch({
      schema_version: "0.1.1",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [
        {
          op: "status_change",
          entity: "blocker",
          entity_id: "00000000-0000-4000-8000-000000000001",
        },
      ],
    });
    assert.equal(result.valid, false);
  });

  it("rejects empty operations array", () => {
    const result = validateStatePatch({
      schema_version: "0.1.1",
      project_id: PROJECT_ID,
      source: "manual",
      operations: [],
    });
    assert.equal(result.valid, false);
  });
});
