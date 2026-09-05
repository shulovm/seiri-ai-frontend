/**
 * Reality Core v0.7 — Observation Need derivation (GROUND-008).
 *
 * Pure derived planning layer:
 *   InquiryQuestion → ObservationNeed → EvidenceRequirement
 *
 * Must not import state-engine / file-store.
 * Must not select observers, score Attention, or dispatch requests.
 * Derived identity keys are semantic — never time-based or random.
 */

import {
  formulateInquiryAt,
  formulateUnresolvedSubjectInquiries,
  getInquiriesForSubject,
} from "./inquiry.js";
import type { BeliefQuery } from "./belief-types.js";
import type { Inquiry, InquiryQuestion } from "./inquiry-types.js";
import type {
  EvidenceRequirement,
  ObservationNeed,
  ObservationNeedKind,
  ObservationNeedSatisfaction,
  ObservationTarget,
  TemporalObservationScope,
} from "./observation-need-types.js";
import type { ProjectState } from "../types.js";

const NEED_KIND_ORDER: Record<ObservationNeedKind, number> = {
  OBSERVE_PROPOSITION: 0,
  OBSERVE_TEMPORAL_GAP: 1,
  DISCRIMINATE_POSITIONS: 2,
  OBTAIN_CLAIM_EVIDENCE: 3,
  CLARIFY_EVIDENCE_TENSION: 4,
  IDENTIFY_SUBJECT: 5,
};

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function sortUniqueIds(ids: string[]): string[] {
  return [...new Set(ids)].sort(compareIds);
}

function sortUniqueStrings(values: string[]): string[] {
  return [...new Set(values)].sort(compareIds);
}

function temporalFromQuestion(
  question: InquiryQuestion
): TemporalObservationScope {
  if (question.at === null) {
    return { kind: "UNSPECIFIED" };
  }
  // Exact interval only when prior until / later from are both known and form a gap.
  // Inquiry stores prior/later claim IDs but not exact interval bounds on the Question.
  // Remain honest: POINT(at) for timed queries; do not invent from/until timestamps.
  return { kind: "POINT", at: question.at };
}

function mapQuestion(
  question: InquiryQuestion
): {
  kind: ObservationNeedKind;
  merge_key: string;
  target: ObservationTarget;
  temporal_scope: TemporalObservationScope;
  evidence_requirements: EvidenceRequirement[];
  discriminates_between_value_keys: string[];
  satisfaction_condition: ObservationNeedSatisfaction;
} {
  const temporal_scope = temporalFromQuestion(question);

  switch (question.kind) {
    case "ESTABLISH_PROPOSITION": {
      if (
        question.subject_id === null ||
        question.predicate_kind === null ||
        question.predicate === null
      ) {
        throw new Error("ESTABLISH_PROPOSITION requires subject/predicate");
      }
      const target: ObservationTarget = {
        kind: "PROPOSITION_TARGET",
        subject_id: question.subject_id,
        predicate_kind: question.predicate_kind,
        predicate: question.predicate,
      };
      const requirement: EvidenceRequirement = {
        kind: "BEARS_ON_PROPOSITION",
        target,
        temporal_scope,
        must_be_inspectable: true,
        required_relation: "bears_on",
        distinguishing_value_keys: [],
      };
      return {
        kind: "OBSERVE_PROPOSITION",
        merge_key: [
          "obs_prop",
          question.subject_id,
          question.predicate_kind,
          question.predicate,
          question.at ?? "",
        ].join("|"),
        target,
        temporal_scope,
        evidence_requirements: [requirement],
        discriminates_between_value_keys: [],
        satisfaction_condition: {
          kind: "EPISTEMIC_RECORD_BEARS_ON_PROPOSITION",
          note: "An inspectable epistemic record bears on the proposition scope. Not truth known; not Inquiry resolved.",
        },
      };
    }
    case "FILL_TEMPORAL_COVERAGE": {
      if (
        question.subject_id === null ||
        question.predicate_kind === null ||
        question.predicate === null
      ) {
        throw new Error("FILL_TEMPORAL_COVERAGE requires subject/predicate");
      }
      const target: ObservationTarget = {
        kind: "PROPOSITION_TARGET",
        subject_id: question.subject_id,
        predicate_kind: question.predicate_kind,
        predicate: question.predicate,
      };
      const requirement: EvidenceRequirement = {
        kind: "BEARS_ON_PROPOSITION",
        target,
        temporal_scope,
        must_be_inspectable: true,
        required_relation: "bears_on",
        distinguishing_value_keys: [],
      };
      return {
        kind: "OBSERVE_TEMPORAL_GAP",
        // Same merge key family as OBSERVE_PROPOSITION so ESTABLISH+FILL merge.
        merge_key: [
          "obs_prop",
          question.subject_id,
          question.predicate_kind,
          question.predicate,
          question.at ?? "",
        ].join("|"),
        target,
        temporal_scope,
        evidence_requirements: [requirement],
        discriminates_between_value_keys: [],
        satisfaction_condition: {
          kind: "EPISTEMIC_RECORD_BEARS_ON_PROPOSITION",
          note: "An inspectable epistemic record bears on the uncovered temporal scope. No interpolation.",
        },
      };
    }
    case "DISAMBIGUATE_POSITIONS": {
      if (
        question.subject_id === null ||
        question.predicate_kind === null ||
        question.predicate === null
      ) {
        throw new Error("DISAMBIGUATE_POSITIONS requires subject/predicate");
      }
      const candidates = sortUniqueStrings(question.candidate_value_keys);
      const target: ObservationTarget = {
        kind: "PROPOSITION_TARGET",
        subject_id: question.subject_id,
        predicate_kind: question.predicate_kind,
        predicate: question.predicate,
      };
      const requirement: EvidenceRequirement = {
        kind: "DISTINGUISHES_POSITIONS",
        target,
        temporal_scope,
        must_be_inspectable: true,
        required_relation: "distinguishes",
        distinguishing_value_keys: candidates,
      };
      return {
        kind: "DISCRIMINATE_POSITIONS",
        merge_key: [
          "obs_disambig",
          question.subject_id,
          question.predicate_kind,
          question.predicate,
          question.at ?? "",
          ...candidates,
        ].join("|"),
        target,
        temporal_scope,
        evidence_requirements: [requirement],
        discriminates_between_value_keys: candidates,
        satisfaction_condition: {
          kind: "RESULT_MUST_BEAR_ON_POSITION_DISCRIMINATION",
          note: "Result must be capable of distinguishing asserted positions. Existence alone is not automatic satisfaction.",
        },
      };
    }
    case "FIND_SUPPORTING_EVIDENCE": {
      const claimId = question.originating_claim_ids[0];
      if (!claimId) {
        throw new Error("FIND_SUPPORTING_EVIDENCE requires claim_id");
      }
      const target: ObservationTarget = {
        kind: "CLAIM_TARGET",
        claim_id: claimId,
      };
      const requirement: EvidenceRequirement = {
        kind: "BEARS_ON_CLAIM",
        target,
        temporal_scope,
        must_be_inspectable: true,
        required_relation: "bears_on",
        distinguishing_value_keys: [],
      };
      return {
        kind: "OBTAIN_CLAIM_EVIDENCE",
        merge_key: [
          "obs_claim_ev",
          claimId,
          ...sortUniqueIds(question.originating_claim_ids),
        ].join("|"),
        target,
        temporal_scope,
        evidence_requirements: [requirement],
        discriminates_between_value_keys: [],
        satisfaction_condition: {
          kind: "NEW_EVIDENCE_LINKED_TO_CLAIM",
          note: "New Evidence linked to the Claim (support or contradict). Not Claim proven true.",
        },
      };
    }
    case "RESOLVE_EVIDENCE_TENSION": {
      const claimId = question.originating_claim_ids[0];
      if (!claimId) {
        throw new Error("RESOLVE_EVIDENCE_TENSION requires claim_id");
      }
      const evidenceIds = sortUniqueIds(question.originating_evidence_ids);
      // Placeholder split; refineTensionTarget(inquiry) recovers SUPPORTS/CONTRADICTS from gaps.
      const target: ObservationTarget = {
        kind: "EVIDENCE_TENSION_TARGET",
        claim_id: claimId,
        supporting_evidence_ids: evidenceIds,
        contradicting_evidence_ids: evidenceIds,
      };

      const requirement: EvidenceRequirement = {
        kind: "BEARS_ON_EVIDENCE_TENSION",
        target,
        temporal_scope,
        must_be_inspectable: true,
        required_relation: "bears_on",
        distinguishing_value_keys: [],
      };
      return {
        kind: "CLARIFY_EVIDENCE_TENSION",
        merge_key: [
          "obs_tension",
          claimId,
          ...evidenceIds,
        ].join("|"),
        target,
        temporal_scope,
        evidence_requirements: [requirement],
        discriminates_between_value_keys: [],
        satisfaction_condition: {
          kind: "STRUCTURALLY_UNSPECIFIED",
          note: "No explanation model yet for when tension is clarified. Need satisfaction != truth.",
        },
      };
    }
    case "RESOLVE_SUBJECT_IDENTITY": {
      const claimId = question.originating_claim_ids[0];
      if (!claimId) {
        throw new Error("RESOLVE_SUBJECT_IDENTITY requires claim_id");
      }
      const target: ObservationTarget = {
        kind: "SUBJECT_IDENTITY_TARGET",
        claim_id: claimId,
      };
      const requirement: EvidenceRequirement = {
        kind: "ESTABLISHES_SUBJECT_IDENTITY",
        target,
        temporal_scope,
        must_be_inspectable: true,
        required_relation: "identifies_subject",
        distinguishing_value_keys: [],
      };
      return {
        kind: "IDENTIFY_SUBJECT",
        merge_key: ["obs_identity", claimId].join("|"),
        target,
        temporal_scope,
        evidence_requirements: [requirement],
        discriminates_between_value_keys: [],
        satisfaction_condition: {
          kind: "STRUCTURALLY_UNSPECIFIED",
          note: "Identity attachment not yet a structural Belief change. No candidate matching.",
        },
      };
    }
    default: {
      const _exhaustive: never = question.kind;
      throw new Error(`Unhandled question kind: ${String(_exhaustive)}`);
    }
  }
}

function preferredNeedKind(
  current: ObservationNeedKind,
  incoming: ObservationNeedKind
): ObservationNeedKind {
  if (
    (current === "OBSERVE_PROPOSITION" &&
      incoming === "OBSERVE_TEMPORAL_GAP") ||
    (current === "OBSERVE_TEMPORAL_GAP" &&
      incoming === "OBSERVE_PROPOSITION")
  ) {
    return "OBSERVE_TEMPORAL_GAP";
  }
  return NEED_KIND_ORDER[incoming] < NEED_KIND_ORDER[current]
    ? incoming
    : current;
}

function refineTensionTarget(
  inquiry: Inquiry | null,
  question: InquiryQuestion,
  target: ObservationTarget
): ObservationTarget {
  if (target.kind !== "EVIDENCE_TENSION_TARGET" || !inquiry?.gap_assessment) {
    return target;
  }
  const tensionGap = inquiry.gap_assessment.gaps.find(
    (gap) =>
      gap.kind === "EVIDENCE_TENSION" &&
      gap.claim_ids.includes(target.claim_id)
  );
  if (!tensionGap) {
    return {
      kind: "EVIDENCE_TENSION_TARGET",
      claim_id: target.claim_id,
      supporting_evidence_ids: sortUniqueIds(
        question.originating_evidence_ids
      ),
      contradicting_evidence_ids: sortUniqueIds(
        question.originating_evidence_ids
      ),
    };
  }
  return {
    kind: "EVIDENCE_TENSION_TARGET",
    claim_id: target.claim_id,
    supporting_evidence_ids: sortUniqueIds(
      tensionGap.details.supporting_evidence_ids ?? []
    ),
    contradicting_evidence_ids: sortUniqueIds(
      tensionGap.details.contradicting_evidence_ids ?? []
    ),
  };
}

/**
 * Derive ObservationNeeds for a single InquiryQuestion.
 * Pass parent Inquiry when available to recover tension split details.
 */
export function deriveObservationNeedsForQuestion(
  question: InquiryQuestion,
  inquiry: Inquiry | null = null
): ObservationNeed[] {
  const mapped = mapQuestion(question);
  const target = refineTensionTarget(inquiry, question, mapped.target);
  const evidence_requirements = mapped.evidence_requirements.map((req) => ({
    ...req,
    target:
      req.target.kind === "EVIDENCE_TENSION_TARGET" ? target : req.target,
  }));

  const need: ObservationNeed = {
    key: ["need", mapped.kind, mapped.merge_key].join("|"),
    kind: mapped.kind,
    question_keys: [question.key],
    subject_id: question.subject_id,
    predicate_kind: question.predicate_kind,
    predicate: question.predicate,
    temporal_scope: mapped.temporal_scope,
    target,
    evidence_requirements,
    discriminates_between_value_keys: mapped.discriminates_between_value_keys,
    originating_gap_kinds: [...question.originating_gap_kinds].sort(),
    originating_claim_ids: sortUniqueIds(question.originating_claim_ids),
    originating_evidence_ids: sortUniqueIds(question.originating_evidence_ids),
    prior_claim_ids: sortUniqueIds(question.prior_claim_ids),
    later_claim_ids: sortUniqueIds(question.later_claim_ids),
    satisfaction_condition: mapped.satisfaction_condition,
  };

  return [need];
}

/** Derive and merge ObservationNeeds for all Questions in an Inquiry. */
export function deriveObservationNeedsForInquiry(
  inquiry: Inquiry
): ObservationNeed[] {
  const byMerge = new Map<string, ObservationNeed>();

  for (const question of inquiry.questions) {
    for (const need of deriveObservationNeedsForQuestion(question, inquiry)) {
      // Strip kind from key for proposition needs that share obs_prop merge family.
      const mergeKey =
        need.kind === "OBSERVE_PROPOSITION" ||
        need.kind === "OBSERVE_TEMPORAL_GAP"
          ? [
              "obs_prop",
              need.subject_id ?? "",
              need.predicate_kind ?? "",
              need.predicate ?? "",
              need.temporal_scope.kind === "POINT"
                ? need.temporal_scope.at
                : "",
            ].join("|")
          : need.key;

      const existing = byMerge.get(mergeKey);
      if (!existing) {
        byMerge.set(mergeKey, {
          ...need,
          key:
            need.kind === "OBSERVE_PROPOSITION" ||
            need.kind === "OBSERVE_TEMPORAL_GAP"
              ? ["need", need.kind, mergeKey].join("|")
              : need.key,
        });
        continue;
      }

      const kind = preferredNeedKind(existing.kind, need.kind);
      byMerge.set(mergeKey, {
        ...existing,
        kind,
        key: ["need", kind, mergeKey].join("|"),
        question_keys: sortUniqueStrings([
          ...existing.question_keys,
          ...need.question_keys,
        ]),
        originating_gap_kinds: sortUniqueStrings([
          ...existing.originating_gap_kinds,
          ...need.originating_gap_kinds,
        ]) as ObservationNeed["originating_gap_kinds"],
        originating_claim_ids: sortUniqueIds([
          ...existing.originating_claim_ids,
          ...need.originating_claim_ids,
        ]),
        originating_evidence_ids: sortUniqueIds([
          ...existing.originating_evidence_ids,
          ...need.originating_evidence_ids,
        ]),
        prior_claim_ids: sortUniqueIds([
          ...existing.prior_claim_ids,
          ...need.prior_claim_ids,
        ]),
        later_claim_ids: sortUniqueIds([
          ...existing.later_claim_ids,
          ...need.later_claim_ids,
        ]),
        discriminates_between_value_keys: sortUniqueStrings([
          ...existing.discriminates_between_value_keys,
          ...need.discriminates_between_value_keys,
        ]),
      });
    }
  }

  return [...byMerge.values()].sort((a, b) => {
    const kindDiff = NEED_KIND_ORDER[a.kind] - NEED_KIND_ORDER[b.kind];
    if (kindDiff !== 0) {
      return kindDiff;
    }
    return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
  });
}

export function deriveObservationNeedsAt(
  projectState: ProjectState,
  query: BeliefQuery
): ObservationNeed[] {
  const inquiry = formulateInquiryAt(projectState, query);
  if (!inquiry) {
    return [];
  }
  return deriveObservationNeedsForInquiry(inquiry);
}

export function getObservationNeedsForSubject(
  projectState: ProjectState,
  subjectId: string,
  at: string
): ObservationNeed[] {
  const inquiries = getInquiriesForSubject(projectState, subjectId, at);
  const byKey = new Map<string, ObservationNeed>();
  for (const inquiry of inquiries) {
    for (const need of deriveObservationNeedsForInquiry(inquiry)) {
      const existing = byKey.get(need.key);
      if (!existing) {
        byKey.set(need.key, need);
        continue;
      }
      byKey.set(need.key, {
        ...existing,
        question_keys: sortUniqueStrings([
          ...existing.question_keys,
          ...need.question_keys,
        ]),
        originating_gap_kinds: sortUniqueStrings([
          ...existing.originating_gap_kinds,
          ...need.originating_gap_kinds,
        ]) as ObservationNeed["originating_gap_kinds"],
        originating_claim_ids: sortUniqueIds([
          ...existing.originating_claim_ids,
          ...need.originating_claim_ids,
        ]),
        originating_evidence_ids: sortUniqueIds([
          ...existing.originating_evidence_ids,
          ...need.originating_evidence_ids,
        ]),
      });
    }
  }
  return [...byKey.values()].sort((a, b) =>
    a.key < b.key ? -1 : a.key > b.key ? 1 : 0
  );
}

export function deriveUnresolvedSubjectObservationNeeds(
  projectState: ProjectState,
  at?: string
): ObservationNeed[] {
  const inquiries = formulateUnresolvedSubjectInquiries(projectState, at);
  const needs: ObservationNeed[] = [];
  for (const inquiry of inquiries) {
    needs.push(...deriveObservationNeedsForInquiry(inquiry));
  }
  return needs.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}
