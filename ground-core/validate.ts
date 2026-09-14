/**
 * Validation for GROUND Core ProjectState / StatePatch.
 * Canonical schema: v0.1.25. Intermediate validators support migration.
 */

import Ajv2020Import from "ajv/dist/2020.js";
import addFormatsImport from "ajv-formats";
import type { ErrorObject, ValidateFunction } from "ajv/dist/2020.js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA_DIR = join(__dirname, "../docs/schemas");

const PROJECT_STATE_SCHEMA_V0125 = "ground-core-project-state.v0.1.25.schema.json";
const PROJECT_STATE_SCHEMA_V0124 = "ground-core-project-state.v0.1.24.schema.json";
const PROJECT_STATE_SCHEMA_V0123 = "ground-core-project-state.v0.1.23.schema.json";
const PROJECT_STATE_SCHEMA_V0122 = "ground-core-project-state.v0.1.22.schema.json";
const PROJECT_STATE_SCHEMA_V0121 = "ground-core-project-state.v0.1.21.schema.json";
const PROJECT_STATE_SCHEMA_V0120 = "ground-core-project-state.v0.1.20.schema.json";
const PROJECT_STATE_SCHEMA_V0119 = "ground-core-project-state.v0.1.19.schema.json";
const PROJECT_STATE_SCHEMA_V0118 = "ground-core-project-state.v0.1.18.schema.json";
const PROJECT_STATE_SCHEMA_V0117 = "ground-core-project-state.v0.1.17.schema.json";
const PROJECT_STATE_SCHEMA_V0116 = "ground-core-project-state.v0.1.16.schema.json";
const PROJECT_STATE_SCHEMA_V0115 = "ground-core-project-state.v0.1.15.schema.json";
const PROJECT_STATE_SCHEMA_V0114 = "ground-core-project-state.v0.1.14.schema.json";
const PROJECT_STATE_SCHEMA_V0113 = "ground-core-project-state.v0.1.13.schema.json";
const PROJECT_STATE_SCHEMA_V0112 = "ground-core-project-state.v0.1.12.schema.json";
const PROJECT_STATE_SCHEMA_V0111 = "ground-core-project-state.v0.1.11.schema.json";
const PROJECT_STATE_SCHEMA_V0110 = "ground-core-project-state.v0.1.10.schema.json";
const PROJECT_STATE_SCHEMA_V019 = "ground-core-project-state.v0.1.9.schema.json";
const PROJECT_STATE_SCHEMA_V018 = "ground-core-project-state.v0.1.8.schema.json";
const PROJECT_STATE_SCHEMA_V017 = "ground-core-project-state.v0.1.7.schema.json";
const PROJECT_STATE_SCHEMA_V016 = "ground-core-project-state.v0.1.6.schema.json";
const PROJECT_STATE_SCHEMA_V015 = "ground-core-project-state.v0.1.5.schema.json";
const PROJECT_STATE_SCHEMA_V014 = "ground-core-project-state.v0.1.4.schema.json";
const PROJECT_STATE_SCHEMA_V013 = "ground-core-project-state.v0.1.3.schema.json";
const PROJECT_STATE_SCHEMA_V012 = "ground-core-project-state.v0.1.2.schema.json";
const PROJECT_STATE_SCHEMA_V011 = "ground-core-project-state.v0.1.1.schema.json";
const PROJECT_STATE_SCHEMA_V010 = "ground-core-project-state.v0.1.schema.json";
const STATE_PATCH_SCHEMA_V0125 = "ground-core-state-patch.v0.1.25.schema.json";
const STATE_PATCH_SCHEMA_V0124 = "ground-core-state-patch.v0.1.24.schema.json";
const STATE_PATCH_SCHEMA_V0123 = "ground-core-state-patch.v0.1.23.schema.json";
const STATE_PATCH_SCHEMA_V0122 = "ground-core-state-patch.v0.1.22.schema.json";
const STATE_PATCH_SCHEMA_V0121 = "ground-core-state-patch.v0.1.21.schema.json";
const STATE_PATCH_SCHEMA_V0120 = "ground-core-state-patch.v0.1.20.schema.json";
const STATE_PATCH_SCHEMA_V0119 = "ground-core-state-patch.v0.1.19.schema.json";
const STATE_PATCH_SCHEMA_V0118 = "ground-core-state-patch.v0.1.18.schema.json";
const STATE_PATCH_SCHEMA_V0117 = "ground-core-state-patch.v0.1.17.schema.json";
const STATE_PATCH_SCHEMA_V0116 = "ground-core-state-patch.v0.1.16.schema.json";
const STATE_PATCH_SCHEMA_V0115 = "ground-core-state-patch.v0.1.15.schema.json";
const STATE_PATCH_SCHEMA_V0114 = "ground-core-state-patch.v0.1.14.schema.json";
const STATE_PATCH_SCHEMA_V0113 = "ground-core-state-patch.v0.1.13.schema.json";
const STATE_PATCH_SCHEMA_V0112 = "ground-core-state-patch.v0.1.12.schema.json";
const STATE_PATCH_SCHEMA_V0111 = "ground-core-state-patch.v0.1.11.schema.json";
const STATE_PATCH_SCHEMA_V0110 = "ground-core-state-patch.v0.1.10.schema.json";
const STATE_PATCH_SCHEMA_V019 = "ground-core-state-patch.v0.1.9.schema.json";
const STATE_PATCH_SCHEMA_V018 = "ground-core-state-patch.v0.1.8.schema.json";

export interface ValidationResult {
  valid: boolean;
  errors?: ErrorObject[];
}

interface AjvLike {
  compile(schema: object): ValidateFunction;
}

interface AjvConstructor {
  new (opts?: { allErrors?: boolean; strict?: boolean }): AjvLike;
}

function resolveDefaultExport<T>(moduleValue: T): T {
  const candidate = moduleValue as T & { default?: T };
  return candidate.default ?? moduleValue;
}

function createAjv(): AjvLike {
  const Ajv2020 = resolveDefaultExport(Ajv2020Import) as unknown as AjvConstructor;
  const addFormats = resolveDefaultExport(addFormatsImport) as unknown as (ajv: AjvLike) => void;
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  return ajv;
}

function loadSchema(filename: string): object {
  const path = join(SCHEMA_DIR, filename);
  return JSON.parse(readFileSync(path, "utf8")) as object;
}

let projectStateValidatorV0125: ValidateFunction | undefined;
let projectStateValidatorV0124: ValidateFunction | undefined;
let projectStateValidatorV0123: ValidateFunction | undefined;
let projectStateValidatorV0122: ValidateFunction | undefined;
let projectStateValidatorV0121: ValidateFunction | undefined;
let projectStateValidatorV0120: ValidateFunction | undefined;
let projectStateValidatorV0119: ValidateFunction | undefined;
let projectStateValidatorV0118: ValidateFunction | undefined;
let projectStateValidatorV0117: ValidateFunction | undefined;
let projectStateValidatorV0116: ValidateFunction | undefined;
let projectStateValidatorV0115: ValidateFunction | undefined;
let projectStateValidatorV0114: ValidateFunction | undefined;
let projectStateValidatorV0113: ValidateFunction | undefined;
let projectStateValidatorV0112: ValidateFunction | undefined;
let projectStateValidatorV0111: ValidateFunction | undefined;
let projectStateValidatorV0110: ValidateFunction | undefined;
let projectStateValidatorV019: ValidateFunction | undefined;
let projectStateValidatorV018: ValidateFunction | undefined;
let projectStateValidatorV017: ValidateFunction | undefined;
let projectStateValidatorV016: ValidateFunction | undefined;
let projectStateValidatorV015: ValidateFunction | undefined;
let projectStateValidatorV014: ValidateFunction | undefined;
let projectStateValidatorV013: ValidateFunction | undefined;
let projectStateValidatorV012: ValidateFunction | undefined;
let projectStateValidatorV011: ValidateFunction | undefined;
let projectStateValidatorV010: ValidateFunction | undefined;
let statePatchValidatorV0125: ValidateFunction | undefined;
let statePatchValidatorV0124: ValidateFunction | undefined;
let statePatchValidatorV0123: ValidateFunction | undefined;
let statePatchValidatorV0122: ValidateFunction | undefined;
let statePatchValidatorV0121: ValidateFunction | undefined;
let statePatchValidatorV0120: ValidateFunction | undefined;
let statePatchValidatorV0119: ValidateFunction | undefined;
let statePatchValidatorV0118: ValidateFunction | undefined;
let statePatchValidatorV0117: ValidateFunction | undefined;
let statePatchValidatorV0116: ValidateFunction | undefined;
let statePatchValidatorV0115: ValidateFunction | undefined;
let statePatchValidatorV0114: ValidateFunction | undefined;
let statePatchValidatorV0113: ValidateFunction | undefined;
let statePatchValidatorV0112: ValidateFunction | undefined;
let statePatchValidatorV0111: ValidateFunction | undefined;
let statePatchValidatorV0110: ValidateFunction | undefined;
let statePatchValidatorV019: ValidateFunction | undefined;
let statePatchValidatorV018: ValidateFunction | undefined;

function compileSchema(ajv: AjvLike, filename: string): ValidateFunction {
  const compiled = ajv.compile(loadSchema(filename));
  if (!compiled) {
    throw new Error(`Failed to compile schema: ${filename}`);
  }
  return compiled;
}

function getProjectStateValidatorV0125(): ValidateFunction {
  projectStateValidatorV0125 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V0125);
  return projectStateValidatorV0125;
}
function getStatePatchValidatorV0125(): ValidateFunction {
  statePatchValidatorV0125 ??= compileSchema(createAjv(), STATE_PATCH_SCHEMA_V0125);
  return statePatchValidatorV0125;
}
function getProjectStateValidatorV0124(): ValidateFunction {
  projectStateValidatorV0124 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V0124);
  return projectStateValidatorV0124;
}

function getProjectStateValidatorV0123(): ValidateFunction {
  projectStateValidatorV0123 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V0123);
  return projectStateValidatorV0123;
}

function getProjectStateValidatorV0122(): ValidateFunction {
  projectStateValidatorV0122 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V0122);
  return projectStateValidatorV0122;
}

function getProjectStateValidatorV0121(): ValidateFunction {
  projectStateValidatorV0121 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V0121);
  return projectStateValidatorV0121;
}

function getProjectStateValidatorV0120(): ValidateFunction {
  projectStateValidatorV0120 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V0120);
  return projectStateValidatorV0120;
}

function getProjectStateValidatorV0119(): ValidateFunction {
  projectStateValidatorV0119 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V0119);
  return projectStateValidatorV0119;
}

function getProjectStateValidatorV0118(): ValidateFunction {
  projectStateValidatorV0118 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V0118);
  return projectStateValidatorV0118;
}

function getProjectStateValidatorV0117(): ValidateFunction {
  projectStateValidatorV0117 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V0117);
  return projectStateValidatorV0117;
}

function getProjectStateValidatorV0116(): ValidateFunction {
  projectStateValidatorV0116 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V0116);
  return projectStateValidatorV0116;
}

function getProjectStateValidatorV0115(): ValidateFunction {
  projectStateValidatorV0115 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V0115);
  return projectStateValidatorV0115;
}

function getProjectStateValidatorV0114(): ValidateFunction {
  projectStateValidatorV0114 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V0114);
  return projectStateValidatorV0114;
}

function getProjectStateValidatorV0113(): ValidateFunction {
  projectStateValidatorV0113 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V0113);
  return projectStateValidatorV0113;
}

function getProjectStateValidatorV0112(): ValidateFunction {
  projectStateValidatorV0112 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V0112);
  return projectStateValidatorV0112;
}

function getProjectStateValidatorV0111(): ValidateFunction {
  projectStateValidatorV0111 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V0111);
  return projectStateValidatorV0111;
}

function getProjectStateValidatorV0110(): ValidateFunction {
  projectStateValidatorV0110 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V0110);
  return projectStateValidatorV0110;
}

function getProjectStateValidatorV019(): ValidateFunction {
  projectStateValidatorV019 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V019);
  return projectStateValidatorV019;
}

function getProjectStateValidatorV018(): ValidateFunction {
  projectStateValidatorV018 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V018);
  return projectStateValidatorV018;
}

function getProjectStateValidatorV017(): ValidateFunction {
  projectStateValidatorV017 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V017);
  return projectStateValidatorV017;
}

function getProjectStateValidatorV016(): ValidateFunction {
  projectStateValidatorV016 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V016);
  return projectStateValidatorV016;
}

function getProjectStateValidatorV015(): ValidateFunction {
  projectStateValidatorV015 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V015);
  return projectStateValidatorV015;
}

function getProjectStateValidatorV014(): ValidateFunction {
  projectStateValidatorV014 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V014);
  return projectStateValidatorV014;
}

function getProjectStateValidatorV013(): ValidateFunction {
  projectStateValidatorV013 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V013);
  return projectStateValidatorV013;
}

function getProjectStateValidatorV012(): ValidateFunction {
  projectStateValidatorV012 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V012);
  return projectStateValidatorV012;
}

function getProjectStateValidatorV011(): ValidateFunction {
  projectStateValidatorV011 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V011);
  return projectStateValidatorV011;
}

function getProjectStateValidatorV010(): ValidateFunction {
  projectStateValidatorV010 ??= compileSchema(createAjv(), PROJECT_STATE_SCHEMA_V010);
  return projectStateValidatorV010;
}

function getStatePatchValidatorV0117(): ValidateFunction {
  statePatchValidatorV0117 ??= compileSchema(createAjv(), STATE_PATCH_SCHEMA_V0117);
  return statePatchValidatorV0117;
}

function getStatePatchValidatorV0116(): ValidateFunction {
  statePatchValidatorV0116 ??= compileSchema(createAjv(), STATE_PATCH_SCHEMA_V0116);
  return statePatchValidatorV0116;
}

function getStatePatchValidatorV0115(): ValidateFunction {
  statePatchValidatorV0115 ??= compileSchema(createAjv(), STATE_PATCH_SCHEMA_V0115);
  return statePatchValidatorV0115;
}

function getStatePatchValidatorV0114(): ValidateFunction {
  statePatchValidatorV0114 ??= compileSchema(createAjv(), STATE_PATCH_SCHEMA_V0114);
  return statePatchValidatorV0114;
}

function getStatePatchValidatorV0113(): ValidateFunction {
  statePatchValidatorV0113 ??= compileSchema(createAjv(), STATE_PATCH_SCHEMA_V0113);
  return statePatchValidatorV0113;
}

function getStatePatchValidatorV0112(): ValidateFunction {
  statePatchValidatorV0112 ??= compileSchema(createAjv(), STATE_PATCH_SCHEMA_V0112);
  return statePatchValidatorV0112;
}

function getStatePatchValidatorV0111(): ValidateFunction {
  statePatchValidatorV0111 ??= compileSchema(createAjv(), STATE_PATCH_SCHEMA_V0111);
  return statePatchValidatorV0111;
}

function getStatePatchValidatorV0110(): ValidateFunction {
  statePatchValidatorV0110 ??= compileSchema(createAjv(), STATE_PATCH_SCHEMA_V0110);
  return statePatchValidatorV0110;
}

function getStatePatchValidatorV019(): ValidateFunction {
  statePatchValidatorV019 ??= compileSchema(createAjv(), STATE_PATCH_SCHEMA_V019);
  return statePatchValidatorV019;
}

function getStatePatchValidatorV018(): ValidateFunction {
  statePatchValidatorV018 ??= compileSchema(createAjv(), STATE_PATCH_SCHEMA_V018);
  return statePatchValidatorV018;
}

function getStatePatchValidatorV0124(): ValidateFunction {
  statePatchValidatorV0124 ??= compileSchema(createAjv(), STATE_PATCH_SCHEMA_V0124);
  return statePatchValidatorV0124;
}

function getStatePatchValidatorV0123(): ValidateFunction {
  statePatchValidatorV0123 ??= compileSchema(createAjv(), STATE_PATCH_SCHEMA_V0123);
  return statePatchValidatorV0123;
}

function getStatePatchValidatorV0122(): ValidateFunction {
  statePatchValidatorV0122 ??= compileSchema(createAjv(), STATE_PATCH_SCHEMA_V0122);
  return statePatchValidatorV0122;
}

function getStatePatchValidatorV0121(): ValidateFunction {
  statePatchValidatorV0121 ??= compileSchema(createAjv(), STATE_PATCH_SCHEMA_V0121);
  return statePatchValidatorV0121;
}

function getStatePatchValidatorV0120(): ValidateFunction {
  statePatchValidatorV0120 ??= compileSchema(createAjv(), STATE_PATCH_SCHEMA_V0120);
  return statePatchValidatorV0120;
}

function getStatePatchValidatorV0119(): ValidateFunction {
  statePatchValidatorV0119 ??= compileSchema(createAjv(), STATE_PATCH_SCHEMA_V0119);
  return statePatchValidatorV0119;
}

function getStatePatchValidatorV0118(): ValidateFunction {
  statePatchValidatorV0118 ??= compileSchema(createAjv(), STATE_PATCH_SCHEMA_V0118);
  return statePatchValidatorV0118;
}

/** Historical ProjectState validation (v0.1.24). */
export function validateProjectStateV0124(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV0124();
  return validate(data) ? { valid: true } : { valid: false, errors: validate.errors ?? [] };
}

export function validateProjectState(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV0125();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

/** Intermediate schema used during migration from v0.1.22 → v0.1.23. */
export function validateProjectStateV0123(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV0123();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

/** Intermediate schema used during migration from v0.1.21 → v0.1.22. */
export function validateProjectStateV0122(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV0122();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

/** Intermediate schema used during migration from v0.1.20 → v0.1.21. */
export function validateProjectStateV0121(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV0121();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

/** Intermediate schema used during migration from v0.1.19 → v0.1.20. */
export function validateProjectStateV0120(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV0120();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

/** Intermediate schema used during migration from v0.1.18 → v0.1.19. */
export function validateProjectStateV0119(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV0119();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

/** Intermediate schema used during migration from v0.1.17 → v0.1.18. */
export function validateProjectStateV0118(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV0118();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

/** Intermediate schema used during migration from v0.1.16 → v0.1.17. */
export function validateProjectStateV0117(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV0117();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

/** Intermediate schema used during migration from v0.1.15 → v0.1.16. */
export function validateProjectStateV0116(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV0116();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

/** Intermediate schema used during migration from v0.1.14 → v0.1.15. */
export function validateProjectStateV0115(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV0115();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

/** Intermediate schema used during migration from v0.1.14 → v0.1.15. */
export function validateProjectStateV0114(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV0114();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

/** Intermediate schema used during migration from v0.1.13 → v0.1.14. */
export function validateProjectStateV0113(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV0113();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

/** Intermediate schema used during migration from v0.1.12 → v0.1.13. */
export function validateProjectStateV0112(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV0112();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

/** Intermediate schema used during migration from v0.1.11 → v0.1.12. */
export function validateProjectStateV0111(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV0111();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

/** Intermediate schema used during migration from v0.1.10 → v0.1.11. */
export function validateProjectStateV0110(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV0110();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

/** Intermediate schema used during migration from v0.1.9 → v0.1.10. */
export function validateProjectStateV019(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV019();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

/** Intermediate schema used during migration from v0.1.8 → v0.1.9. */
export function validateProjectStateV018(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV018();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

/** Intermediate schema used during migration from v0.1.7 → v0.1.8. */
export function validateProjectStateV017(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV017();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

/** Intermediate schema used during migration from v0.1.6 → v0.1.7. */
export function validateProjectStateV016(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV016();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

export function validateProjectStateV015(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV015();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

export function validateProjectStateV014(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV014();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

export function validateProjectStateV013(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV013();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

export function validateProjectStateV012(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV012();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

export function validateProjectStateV011(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV011();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

export function validateLegacyProjectState(data: unknown): ValidationResult {
  const validate = getProjectStateValidatorV010();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}

/** Canonical StatePatch validation (v0.1.25; accepts historical patch schema versions). */
export function validateStatePatch(data: unknown): ValidationResult {
  const validate = getStatePatchValidatorV0125();
  const valid = validate(data);
  if (valid) {
    return { valid: true };
  }
  return { valid: false, errors: validate.errors ?? [] };
}
