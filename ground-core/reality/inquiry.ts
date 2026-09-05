import { temporalInstantKey } from "../temporal.js";
/**
 * Reality Core v0.7 — Inquiry / Question Formation (GROUND-007).
 *
 * Pure derived planning layer:
 *   Belief → EpistemicGap → Question → Inquiry
 *
 * Must not import state-engine / file-store.
 * Must not create ObservationRequest / Attention / Actions.
 * Derived identity keys are semantic — never time-based or random.
 */

import {
  assessEpistemicGapsAt,
  getEpistemicGapsForSubject,
  getUnresolvedSubjectClaims,
} from "./epistemic-gaps.js";
import type { BeliefQuery } from "./belief-types.js";
import type {
  EpistemicGap,
  EpistemicGapAssessment,
  EpistemicGapKind,
} from "./epistemic-gap-types.js";
import type {
  ExpectedAnswerShape,
  Inquiry,
  InquiryQuestion,
  InquiryQuestionKind,
  InquiryResolutionCondition,
} from "./inquiry-types.js";
import type { ProjectState } from "../types.js";

const QUESTION_KIND_ORDER: Record<InquiryQuestionKind, number> = {
  ESTABLISH_PROPOSITION: 0,
  FILL_TEMPORAL_COVERAGE: 1,
  DISAMBIGUATE_POSITIONS: 2,
  FIND_SUPPORTING_EVIDENCE: 3,
  RESOLVE_EVIDENCE_TENSION: 4,
  RESOLVE_SUBJECT_IDENTITY: 5,
};

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function sortUniqueIds(ids: string[]): string[] {
  return [...new Set(ids)].sort(compareIds);
}

function sortGapKinds(kinds: EpistemicGapKind[]): EpistemicGapKind[] {
  return [...new Set(kinds)].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

function propositionKey(
  subjectId: string | null,
  predicateKind: string | null,
  predicate: string | null,
  at: string | null
): string {
  return ["prop", subjectId ?? "", predicateKind ?? "", predicate ?? "", (at == null ? at : temporalInstantKey(at)) ?? ""].join(
    "|"
  );
}

function mapGapToDraft(gap: EpistemicGap): {
  kind: InquiryQuestionKind;
  merge_key: string;
  expected_answer_shape: ExpectedAnswerShape;
  candidate_value_keys: string[];
  prior_claim_ids: string[];
  later_claim_ids: string[];
  resolution: InquiryResolutionCondition;
} {
  switch (gap.kind) {
    case "NO_APPLICABLE_CLAIMS":
      return {
        kind: "ESTABLISH_PROPOSITION",
        merge_key: propositionKey(
          gap.subject_id,
          gap.predicate_kind,
          gap.predicate,
          gap.at
        ),
        expected_answer_shape: "proposition_value",
        candidate_value_keys: [],
        prior_claim_ids: [],
        later_claim_ids: [],
        resolution: {
          kind: "APPLICABLE_CLAIM_EXISTS",
          claim_ids: [],
          note: "At least one applicable Claim exists for this proposition scope. Not 'truth known'.",
        },
      };
    case "TEMPORAL_COVERAGE_GAP":
      return {
        kind: "FILL_TEMPORAL_COVERAGE",
        merge_key: propositionKey(
          gap.subject_id,
          gap.predicate_kind,
          gap.predicate,
          gap.at
        ),
        expected_answer_shape: "temporal_proposition_value",
        candidate_value_keys: [],
        prior_claim_ids: gap.details.prior_claim_ids ?? [],
        later_claim_ids: gap.details.later_claim_ids ?? [],
        resolution: {
          kind: "APPLICABLE_CLAIM_EXISTS",
          claim_ids: [],
          note: "An applicable Claim covers the query time. No interpolated value assumed.",
        },
      };
    case "CONTESTED_POSITIONS":
      return {
        kind: "DISAMBIGUATE_POSITIONS",
        merge_key: [
          "disambig",
          gap.subject_id,
          gap.predicate_kind,
          gap.predicate,
          gap.at,
          ...(gap.details.position_value_keys ?? []).slice().sort(),
        ].join("|"),
        expected_answer_shape: "position_choice_or_other",
        candidate_value_keys: (gap.details.position_value_keys ?? [])
          .slice()
          .sort(),
        prior_claim_ids: [],
        later_claim_ids: [],
        resolution: {
          kind: "BELIEF_NOT_CONTESTED",
          claim_ids: sortUniqueIds(gap.claim_ids),
          note: "BeliefAssessment is no longer CONTESTED. May result from Claim removal — not truth resolution.",
        },
      };
    case "NO_LINKED_EVIDENCE":
      return {
        kind: "FIND_SUPPORTING_EVIDENCE",
        merge_key: [
          "evidence",
          gap.subject_id,
          gap.predicate_kind,
          gap.predicate,
          gap.at,
          ...sortUniqueIds(gap.claim_ids),
        ].join("|"),
        expected_answer_shape: "evidence_bearing_on_claim",
        candidate_value_keys: [],
        prior_claim_ids: [],
        later_claim_ids: [],
        resolution: {
          kind: "CLAIM_HAS_EVIDENCE_LINK",
          claim_ids: sortUniqueIds(gap.claim_ids),
          note: "Affected Claim has >=1 Evidence link. No quality judgment.",
        },
      };
    case "EVIDENCE_TENSION":
      return {
        kind: "RESOLVE_EVIDENCE_TENSION",
        merge_key: [
          "tension",
          gap.subject_id,
          gap.predicate_kind,
          gap.predicate,
          gap.at,
          ...sortUniqueIds(gap.claim_ids),
          ...sortUniqueIds(gap.evidence_ids),
        ].join("|"),
        expected_answer_shape: "tension_discrimination",
        candidate_value_keys: [],
        prior_claim_ids: [],
        later_claim_ids: [],
        resolution: {
          kind: "STRUCTURALLY_UNSPECIFIED",
          claim_ids: sortUniqueIds(gap.claim_ids),
          note: "No explanation model yet. Tension absence alone is insufficient as a normative resolution.",
        },
      };
    default: {
      const _exhaustive: never = gap.kind;
      throw new Error(`Unhandled gap kind: ${String(_exhaustive)}`);
    }
  }
}

function preferredKind(
  current: InquiryQuestionKind,
  incoming: InquiryQuestionKind
): InquiryQuestionKind {
  // More specific temporal fill preferred over generic establish when merged.
  if (
    (current === "ESTABLISH_PROPOSITION" &&
      incoming === "FILL_TEMPORAL_COVERAGE") ||
    (current === "FILL_TEMPORAL_COVERAGE" &&
      incoming === "ESTABLISH_PROPOSITION")
  ) {
    return "FILL_TEMPORAL_COVERAGE";
  }
  return QUESTION_KIND_ORDER[incoming] < QUESTION_KIND_ORDER[current]
    ? incoming
    : current;
}

function questionsFromGaps(gaps: EpistemicGap[]): {
  questions: InquiryQuestion[];
  resolutions: InquiryResolutionCondition[];
} {
  type Acc = {
    kind: InquiryQuestionKind;
    subject_id: string | null;
    predicate_kind: InquiryQuestion["predicate_kind"];
    predicate: string | null;
    at: string | null;
    originating_gap_kinds: EpistemicGapKind[];
    originating_claim_ids: string[];
    originating_evidence_ids: string[];
    candidate_value_keys: string[];
    expected_answer_shape: ExpectedAnswerShape;
    prior_claim_ids: string[];
    later_claim_ids: string[];
    merge_key: string;
    resolutions: InquiryResolutionCondition[];
  };

  const byKey = new Map<string, Acc>();

  for (const gap of gaps) {
    const draft = mapGapToDraft(gap);
    const existing = byKey.get(draft.merge_key);
    if (!existing) {
      byKey.set(draft.merge_key, {
        kind: draft.kind,
        subject_id: gap.subject_id,
        predicate_kind: gap.predicate_kind,
        predicate: gap.predicate,
        at: gap.at,
        originating_gap_kinds: [gap.kind],
        originating_claim_ids: [...gap.claim_ids],
        originating_evidence_ids: [...gap.evidence_ids],
        candidate_value_keys: [...draft.candidate_value_keys],
        expected_answer_shape: draft.expected_answer_shape,
        prior_claim_ids: [...draft.prior_claim_ids],
        later_claim_ids: [...draft.later_claim_ids],
        merge_key: draft.merge_key,
        resolutions: [draft.resolution],
      });
      continue;
    }

    existing.kind = preferredKind(existing.kind, draft.kind);
    existing.originating_gap_kinds.push(gap.kind);
    existing.originating_claim_ids.push(...gap.claim_ids);
    existing.originating_evidence_ids.push(...gap.evidence_ids);
    existing.candidate_value_keys.push(...draft.candidate_value_keys);
    existing.prior_claim_ids.push(...draft.prior_claim_ids);
    existing.later_claim_ids.push(...draft.later_claim_ids);
    existing.resolutions.push(draft.resolution);
    if (
      draft.kind === "FILL_TEMPORAL_COVERAGE" ||
      existing.kind === "FILL_TEMPORAL_COVERAGE"
    ) {
      existing.expected_answer_shape = "temporal_proposition_value";
    }
  }

  const questions: InquiryQuestion[] = [...byKey.values()]
    .map((acc) => {
      const originating_gap_kinds = sortGapKinds(acc.originating_gap_kinds);
      const key = [
        "q",
        acc.kind,
        acc.merge_key,
        originating_gap_kinds.join(","),
      ].join("|");
      return {
        key,
        kind: acc.kind,
        subject_id: acc.subject_id,
        predicate_kind: acc.predicate_kind,
        predicate: acc.predicate,
        at: acc.at,
        originating_gap_kinds,
        originating_claim_ids: sortUniqueIds(acc.originating_claim_ids),
        originating_evidence_ids: sortUniqueIds(acc.originating_evidence_ids),
        candidate_value_keys: [...new Set(acc.candidate_value_keys)].sort(),
        expected_answer_shape: acc.expected_answer_shape,
        prior_claim_ids: sortUniqueIds(acc.prior_claim_ids),
        later_claim_ids: sortUniqueIds(acc.later_claim_ids),
      };
    })
    .sort((a, b) => {
      const kindDiff =
        QUESTION_KIND_ORDER[a.kind] - QUESTION_KIND_ORDER[b.kind];
      if (kindDiff !== 0) {
        return kindDiff;
      }
      return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    });

  const resolutions = [...byKey.values()]
    .flatMap((acc) => acc.resolutions)
    .sort((a, b) => {
      if (a.kind !== b.kind) {
        return a.kind < b.kind ? -1 : 1;
      }
      return a.claim_ids.join(",") < b.claim_ids.join(",") ? -1 : 1;
    });

  // Dedupe resolution conditions by kind+claim_ids
  const seenRes = new Set<string>();
  const uniqueResolutions: InquiryResolutionCondition[] = [];
  for (const res of resolutions) {
    const k = `${res.kind}|${res.claim_ids.join(",")}`;
    if (seenRes.has(k)) {
      continue;
    }
    seenRes.add(k);
    uniqueResolutions.push(res);
  }

  return { questions, resolutions: uniqueResolutions };
}

function inquiryKeyFromQuestions(
  subjectId: string | null,
  query: BeliefQuery | null,
  questions: InquiryQuestion[]
): string {
  return [
    "inq",
    subjectId ?? "",
    query?.predicateKind ?? "",
    query?.predicate ?? "",
    (query?.at == null ? query?.at : temporalInstantKey(query?.at)) ?? "",
    ...questions.map((q) => q.key),
  ].join("|");
}

/**
 * Formulate an Inquiry from an existing EpistemicGapAssessment.
 * Returns null when there are no gaps (no useless Questions).
 */
export function formulateInquiryFromGapAssessment(
  gapAssessment: EpistemicGapAssessment
): Inquiry | null {
  if (!gapAssessment.has_gaps || gapAssessment.gaps.length === 0) {
    return null;
  }

  const { questions, resolutions } = questionsFromGaps(gapAssessment.gaps);
  if (questions.length === 0) {
    return null;
  }

  return {
    key: inquiryKeyFromQuestions(
      gapAssessment.query.subjectId,
      gapAssessment.query,
      questions
    ),
    status: "OPEN",
    subject_id: gapAssessment.query.subjectId,
    query: gapAssessment.query,
    originating_gaps: gapAssessment.gaps.slice(),
    questions,
    resolution_conditions: resolutions,
    gap_assessment: gapAssessment,
  };
}

/** assessEpistemicGapsAt → formulateInquiryFromGapAssessment */
export function formulateInquiryAt(
  projectState: ProjectState,
  query: BeliefQuery
): Inquiry | null {
  return formulateInquiryFromGapAssessment(
    assessEpistemicGapsAt(projectState, query)
  );
}

/**
 * Inquiries for every Claim-present predicate on the Entity.
 * Does not invent absent predicates.
 */
export function getInquiriesForSubject(
  projectState: ProjectState,
  subjectId: string,
  at: string
): Inquiry[] {
  return getEpistemicGapsForSubject(projectState, subjectId, at)
    .map((assessment) => formulateInquiryFromGapAssessment(assessment))
    .filter((inquiry): inquiry is Inquiry => inquiry !== null)
    .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}

/**
 * Identity questions for Claims with subject_id === null.
 * No candidate Entity matching.
 */
export function formulateUnresolvedSubjectInquiries(
  projectState: ProjectState,
  at?: string
): Inquiry[] {
  const unresolved = getUnresolvedSubjectClaims(projectState, at);
  const inquiries: Inquiry[] = [];

  for (const view of unresolved) {
    const claim = view.claim;
    const question: InquiryQuestion = {
      key: ["q", "RESOLVE_SUBJECT_IDENTITY", claim.id].join("|"),
      kind: "RESOLVE_SUBJECT_IDENTITY",
      subject_id: null,
      predicate_kind: claim.predicate_kind,
      predicate: claim.predicate,
      at: at ?? null,
      originating_gap_kinds: [],
      originating_claim_ids: [claim.id],
      originating_evidence_ids: [],
      candidate_value_keys: [],
      expected_answer_shape: "subject_entity_identity",
      prior_claim_ids: [],
      later_claim_ids: [],
    };

    inquiries.push({
      key: ["inq", "unresolved_subject", claim.id, at ?? ""].join("|"),
      status: "OPEN",
      subject_id: null,
      query: null,
      originating_gaps: [],
      questions: [question],
      resolution_conditions: [
        {
          kind: "STRUCTURALLY_UNSPECIFIED",
          claim_ids: [claim.id],
          note: "Subject identity attachment is not yet modeled as a structural Belief change. No fuzzy matching.",
        },
      ],
      gap_assessment: null,
    });
  }

  return inquiries.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}

/** Deterministic presentation only — structure remains authoritative. */
export function formatInquiryQuestion(question: InquiryQuestion): string {
  if (question.kind === "RESOLVE_SUBJECT_IDENTITY") {
    return `Which RealityEntity, if any, does Claim ${question.originating_claim_ids[0] ?? "?"} refer to?`;
  }
  if (question.kind === "DISAMBIGUATE_POSITIONS") {
    const candidates = question.candidate_value_keys.join(" vs ");
    return `Which position applies for ${question.predicate} on ${question.subject_id} at ${question.at}? Candidates: ${candidates}`;
  }
  if (question.kind === "FIND_SUPPORTING_EVIDENCE") {
    return `What inspectable evidence bears on Claim ${question.originating_claim_ids.join(",")}?`;
  }
  if (question.kind === "RESOLVE_EVIDENCE_TENSION") {
    return `What information discriminates evidence tension on Claim ${question.originating_claim_ids.join(",")}?`;
  }
  if (
    question.kind === "FILL_TEMPORAL_COVERAGE" ||
    question.kind === "ESTABLISH_PROPOSITION"
  ) {
    return `What is ${question.predicate} for ${question.subject_id} at ${question.at}?`;
  }
  return `Inquiry question ${question.kind}`;
}
