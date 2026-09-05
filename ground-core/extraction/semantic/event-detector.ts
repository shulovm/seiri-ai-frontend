import type { ExtractionInput } from "../types.js";
import type { SemanticExtractionResult } from "./types.js";

export interface EventDetector {
  readonly name: string;
  detect(input: ExtractionInput): SemanticExtractionResult;
}
