export class GroundCoreError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "GroundCoreError";
    this.code = code;
  }
}

export class ValidationError extends GroundCoreError {
  readonly details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
    this.details = details;
  }
}

export class PatchError extends GroundCoreError {
  readonly details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message, "PATCH_ERROR");
    this.name = "PatchError";
    this.details = details;
  }
}

export class NotFoundError extends GroundCoreError {
  constructor(message: string) {
    super(message, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}
