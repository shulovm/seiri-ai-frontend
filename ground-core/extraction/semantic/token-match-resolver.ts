import type { NextAction, ProjectState } from "../../types.js";
import type { EventResolver, ResolverInput } from "./event-resolver.js";
import { isResolvableEvent } from "./event-resolver.js";
import type {
  ResolutionAmbiguityLevel,
  ResolutionCandidate,
  ResolutionResult,
} from "./resolver-types.js";
import type { SemanticEvent } from "./types.js";

export const MIN_CANDIDATE_SCORE = 0.65;
export const MAX_CANDIDATES = 5;
export const AMBIGUITY_GAP = 0.1;

/** General abbreviations only — no project-specific terms */
const TOKEN_ALIASES: Record<string, string[]> = {
  mj: ["midjourney"],
  文面: ["本文"],
};

export function normalizeText(text: string): string {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function expandMatchTerms(token: string): string[] {
  const terms = new Set<string>([token]);
  const aliases = TOKEN_ALIASES[token];
  if (aliases) {
    for (const alias of aliases) {
      terms.add(alias);
    }
  }
  return [...terms];
}

export function tokenize(text: string): string[] {
  const normalized = normalizeText(text);
  if (!normalized) {
    return [];
  }

  const whitespaceParts = normalized.split(/\s+/).filter((part) => part.length >= 2);
  if (whitespaceParts.length > 1) {
    return whitespaceParts;
  }

  const single = whitespaceParts[0] ?? normalized;
  const tokens = new Set<string>();
  if (single.length >= 2) {
    tokens.add(single);
  }

  for (let index = 0; index <= single.length - 2; index += 1) {
    tokens.add(single.slice(index, index + 2));
  }

  return [...tokens];
}

function scoreAction(
  rawTargetSpan: string,
  action: NextAction,
  primaryNextActionId: string | null
): ResolutionCandidate | null {
  const titleNorm = normalizeText(action.title);
  const descriptionNorm = normalizeText(action.description ?? "");
  const spanTokens = tokenize(rawTargetSpan);

  let score = 0;
  const matchedTerms = new Set<string>();

  for (const spanToken of spanTokens) {
    for (const term of expandMatchTerms(spanToken)) {
      if (term.length < 2) {
        continue;
      }

      if (titleNorm.includes(term)) {
        score += 0.55;
        matchedTerms.add(term);
        continue;
      }

      if (descriptionNorm.includes(term)) {
        score += 0.275;
        matchedTerms.add(term);
      }
    }
  }

  if (action.status === "pending") {
    score += 0.1;
  } else if (action.status === "done") {
    score -= 0.4;
  } else if (action.status === "cancelled") {
    score -= 0.5;
  }

  if (primaryNextActionId === action.id) {
    score += 0.05;
  }

  score = Math.min(1, Math.max(0, score));

  if (score < MIN_CANDIDATE_SCORE) {
    return null;
  }

  const matched = [...matchedTerms];
  return {
    entity_type: "next_action",
    entity_id: action.id,
    label: action.title,
    score: Number(score.toFixed(2)),
    matched_terms: matched,
    reason:
      matched.length > 0
        ? `title/description token overlap (${matched.length} term(s))`
        : "context-adjusted match",
  };
}

function computeAmbiguityLevel(
  candidates: ResolutionCandidate[]
): { level: ResolutionAmbiguityLevel; note?: string } {
  if (candidates.length === 0) {
    return {
      level: "high",
      note: "no next_action matched raw_target_span",
    };
  }

  if (candidates.length === 1) {
    if (candidates[0]?.score >= 0.8) {
      return { level: "none" };
    }

    return { level: "low", note: "single weak match" };
  }

  const top = candidates[0]?.score ?? 0;
  const second = candidates[1]?.score ?? 0;
  if (top - second < AMBIGUITY_GAP) {
    return { level: "medium", note: "top candidates within 0.10" };
  }

  return { level: "low" };
}

export function resolveEvent(
  event: SemanticEvent,
  projectState: ProjectState
): ResolutionResult {
  const rawTargetSpan = event.resolver_hint?.raw_target_span?.trim() ?? "";
  const primaryNextActionId = projectState.current_state.primary_next_action_id;

  const candidates = projectState.next_actions
    .map((action) => scoreAction(rawTargetSpan, action, primaryNextActionId))
    .filter((candidate): candidate is ResolutionCandidate => candidate !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_CANDIDATES);

  const ambiguity = computeAmbiguityLevel(candidates);

  return {
    event_id: event.id,
    target_kind: event.target_kind,
    raw_target_span: rawTargetSpan,
    candidates,
    ambiguity_level: ambiguity.level,
    needs_human_review: true,
    resolution_note: ambiguity.note,
  };
}

export const tokenMatchResolver: EventResolver = {
  name: "token-match-v1",
  resolve(input: ResolverInput): ResolutionResult[] {
    return input.events
      .filter(isResolvableEvent)
      .map((event) => resolveEvent(event, input.project_state));
  },
};
