import { temporalInstantKey } from "../temporal.js";
/**
 * Reality Core v0.7 — Structural Finding detection (GROUND-010).
 *
 * Consumes Situation (and nested Belief/Gap/Inquiry/Need outputs).
 * Must not reimplement Belief/Gap/Inquiry/ObservationNeed logic.
 * Must not import state-engine / file-store.
 * Must not invent PROBLEM / RISK / NEED / BLOCKER / OPPORTUNITY.
 */

import { getUnresolvedSubjectClaims } from "./epistemic-gaps.js";
import { buildSituation } from "./situation.js";
import type {
  DiscoveryAssessment,
  StructuralFinding,
  StructuralFindingKind,
} from "./discovery-types.js";
import type { Situation, SituationQuery } from "./situation-types.js";
import type { ProjectState } from "../types.js";

const FINDING_KIND_ORDER: Record<StructuralFindingKind, number> = {
  ONTIC_STATE_CONFLICT: 0,
  EPISTEMIC_POSITION_CONFLICT: 1,
  KNOWLEDGE_GAP: 2,
  EVIDENCE_DEFICIT: 3,
  EVIDENCE_TENSION: 4,
  TEMPORAL_KNOWLEDGE_GAP: 5,
  UNRESOLVED_SUBJECT: 6,
  UNPLACED_EVENT: 7,
  OBSERVATION_NEED_PRESENT: 8,
};

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function sortUnique(ids: string[]): string[] {
  return [...new Set(ids)].sort(compareIds);
}

function mergeSorted(a: string[], b: string[]): string[] {
  return sortUnique([...a, ...b]);
}

function compareFindings(a: StructuralFinding, b: StructuralFinding): number {
  const kindDiff = FINDING_KIND_ORDER[a.kind] - FINDING_KIND_ORDER[b.kind];
  if (kindDiff !== 0) {
    return kindDiff;
  }
  return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
}

function emptyFinding(
  partial: Omit<
    StructuralFinding,
    | "source_signal_kinds"
    | "source_gap_kinds"
    | "state_ids"
    | "event_ids"
    | "claim_ids"
    | "evidence_ids"
    | "inquiry_keys"
    | "observation_need_keys"
    | "details"
    | "status"
  > & {
    source_signal_kinds?: string[];
    source_gap_kinds?: string[];
    state_ids?: string[];
    event_ids?: string[];
    claim_ids?: string[];
    evidence_ids?: string[];
    inquiry_keys?: string[];
    observation_need_keys?: string[];
    details?: StructuralFinding["details"];
  }
): StructuralFinding {
  return {
    key: partial.key,
    kind: partial.kind,
    subject_id: partial.subject_id,
    situation_key: partial.situation_key,
    predicate_kind: partial.predicate_kind,
    predicate: partial.predicate,
    at: partial.at,
    source_signal_kinds: sortUnique(partial.source_signal_kinds ?? []),
    source_gap_kinds: sortUnique(partial.source_gap_kinds ?? []),
    state_ids: sortUnique(partial.state_ids ?? []),
    event_ids: sortUnique(partial.event_ids ?? []),
    claim_ids: sortUnique(partial.claim_ids ?? []),
    evidence_ids: sortUnique(partial.evidence_ids ?? []),
    inquiry_keys: sortUnique(partial.inquiry_keys ?? []),
    observation_need_keys: sortUnique(partial.observation_need_keys ?? []),
    details: partial.details ?? {},
    status: "OPEN",
  };
}

function mergeFindings(
  a: StructuralFinding,
  b: StructuralFinding
): StructuralFinding {
  return {
    ...a,
    source_signal_kinds: mergeSorted(
      a.source_signal_kinds,
      b.source_signal_kinds
    ),
    source_gap_kinds: mergeSorted(a.source_gap_kinds, b.source_gap_kinds),
    state_ids: mergeSorted(a.state_ids, b.state_ids),
    event_ids: mergeSorted(a.event_ids, b.event_ids),
    claim_ids: mergeSorted(a.claim_ids, b.claim_ids),
    evidence_ids: mergeSorted(a.evidence_ids, b.evidence_ids),
    inquiry_keys: mergeSorted(a.inquiry_keys, b.inquiry_keys),
    observation_need_keys: mergeSorted(
      a.observation_need_keys,
      b.observation_need_keys
    ),
    details: {
      ...a.details,
      ...b.details,
      position_value_keys: sortUnique([
        ...(a.details.position_value_keys ?? []),
        ...(b.details.position_value_keys ?? []),
      ]),
      supporting_evidence_ids: sortUnique([
        ...(a.details.supporting_evidence_ids ?? []),
        ...(b.details.supporting_evidence_ids ?? []),
      ]),
      contradicting_evidence_ids: sortUnique([
        ...(a.details.contradicting_evidence_ids ?? []),
        ...(b.details.contradicting_evidence_ids ?? []),
      ]),
      prior_claim_ids: sortUnique([
        ...(a.details.prior_claim_ids ?? []),
        ...(b.details.prior_claim_ids ?? []),
      ]),
      later_claim_ids: sortUnique([
        ...(a.details.later_claim_ids ?? []),
        ...(b.details.later_claim_ids ?? []),
      ]),
      note: a.details.note ?? b.details.note,
      conflict_kind: a.details.conflict_kind ?? b.details.conflict_kind,
      state_kind: a.details.state_kind ?? b.details.state_kind,
    },
  };
}

function dedupeFindings(findings: StructuralFinding[]): StructuralFinding[] {
  const byKey = new Map<string, StructuralFinding>();
  for (const finding of findings) {
    const existing = byKey.get(finding.key);
    byKey.set(
      finding.key,
      existing ? mergeFindings(existing, finding) : finding
    );
  }
  return [...byKey.values()].sort(compareFindings);
}

function relatedInquiryKeys(
  situation: Situation,
  predicateKind: string | null,
  predicate: string | null
): string[] {
  return situation.inquiry_context.inquiries
    .filter((inquiry) => {
      if (predicateKind === null || predicate === null) {
        return true;
      }
      return inquiry.questions.some(
        (q) =>
          q.predicate_kind === predicateKind && q.predicate === predicate
      );
    })
    .map((inquiry) => inquiry.key);
}

function relatedNeedKeys(
  situation: Situation,
  predicateKind: string | null,
  predicate: string | null
): string[] {
  return situation.inquiry_context.observation_needs
    .filter((need) => {
      if (predicateKind === null || predicate === null) {
        return true;
      }
      return (
        need.predicate_kind === predicateKind && need.predicate === predicate
      );
    })
    .map((need) => need.key);
}

function signalKindsFor(
  situation: Situation,
  kinds: string[]
): string[] {
  return situation.salience_signals
    .filter((s) => kinds.includes(s.kind))
    .map((s) => s.kind);
}

/**
 * Detect StructuralFindings from an already-built Situation.
 * Does not rebuild Belief/Gap/Inquiry logic.
 */
export function discoverStructuralFindings(
  situation: Situation
): StructuralFinding[] {
  const findings: StructuralFinding[] = [];
  const sitKey = situation.key;
  const subjectId = situation.subject_id;
  const at = situation.at;

  for (const conflict of situation.ontic_context.state_conflicts) {
    if (conflict.conflict_kind !== "value_conflict") {
      continue;
    }
    findings.push(
      emptyFinding({
        key: [
          "finding",
          "ONTIC_STATE_CONFLICT",
          subjectId,
          conflict.kind,
          ...conflict.state_ids,
        ].join("|"),
        kind: "ONTIC_STATE_CONFLICT",
        subject_id: subjectId,
        situation_key: sitKey,
        predicate_kind: null,
        predicate: null,
        at,
        source_signal_kinds: signalKindsFor(situation, ["STATE_CONFLICT"]),
        state_ids: conflict.state_ids,
        details: {
          conflict_kind: conflict.conflict_kind,
          state_kind: conflict.kind,
          note: "Overlapping same-kind RealityStates with distinct values. Not which state is true.",
        },
      })
    );
  }

  for (const belief of situation.epistemic_context.belief_assessments) {
    if (belief.status !== "CONTESTED") {
      continue;
    }
    const positionKeys = belief.positions.map((p) => p.value_key).sort();
    const claimIds = belief.applicable_claims.map((c) => c.id);
    const evidenceIds = belief.positions.flatMap((p) => [
      ...p.supporting_evidence.map((e) => e.id),
      ...p.contradicting_evidence.map((e) => e.id),
    ]);
    findings.push(
      emptyFinding({
        key: [
          "finding",
          "EPISTEMIC_POSITION_CONFLICT",
          belief.subject_id,
          belief.predicate_kind,
          belief.predicate,
          temporalInstantKey(belief.at),
          ...positionKeys,
        ].join("|"),
        kind: "EPISTEMIC_POSITION_CONFLICT",
        subject_id: belief.subject_id,
        situation_key: sitKey,
        predicate_kind: belief.predicate_kind,
        predicate: belief.predicate,
        at: belief.at,
        source_signal_kinds: signalKindsFor(situation, [
          "EPISTEMIC_CONTEST",
          "EPISTEMIC_GAP",
        ]),
        source_gap_kinds: ["CONTESTED_POSITIONS"],
        claim_ids: claimIds,
        evidence_ids: evidenceIds,
        inquiry_keys: relatedInquiryKeys(
          situation,
          belief.predicate_kind,
          belief.predicate
        ),
        observation_need_keys: relatedNeedKeys(
          situation,
          belief.predicate_kind,
          belief.predicate
        ),
        details: {
          position_value_keys: positionKeys,
          note: "Multiple epistemic positions apply. No winner selected.",
        },
      })
    );
  }

  for (const gap of situation.epistemic_context.gaps) {
    if (gap.kind === "NO_APPLICABLE_CLAIMS") {
      findings.push(
        emptyFinding({
          key: [
            "finding",
            "KNOWLEDGE_GAP",
            gap.subject_id,
            gap.predicate_kind,
            gap.predicate,
            temporalInstantKey(gap.at),
          ].join("|"),
          kind: "KNOWLEDGE_GAP",
          subject_id: gap.subject_id,
          situation_key: sitKey,
          predicate_kind: gap.predicate_kind,
          predicate: gap.predicate,
          at: gap.at,
          source_signal_kinds: signalKindsFor(situation, ["EPISTEMIC_GAP"]),
          source_gap_kinds: ["NO_APPLICABLE_CLAIMS"],
          claim_ids: gap.claim_ids,
          evidence_ids: gap.evidence_ids,
          inquiry_keys: relatedInquiryKeys(
            situation,
            gap.predicate_kind,
            gap.predicate
          ),
          observation_need_keys: relatedNeedKeys(
            situation,
            gap.predicate_kind,
            gap.predicate
          ),
          details: {
            note: "No applicable Claim for an explicit proposition scope. Not Reality-missing.",
          },
        })
      );
    } else if (gap.kind === "NO_LINKED_EVIDENCE") {
      findings.push(
        emptyFinding({
          key: [
            "finding",
            "EVIDENCE_DEFICIT",
            gap.subject_id,
            gap.predicate_kind,
            gap.predicate,
            temporalInstantKey(gap.at),
            ...gap.claim_ids,
          ].join("|"),
          kind: "EVIDENCE_DEFICIT",
          subject_id: gap.subject_id,
          situation_key: sitKey,
          predicate_kind: gap.predicate_kind,
          predicate: gap.predicate,
          at: gap.at,
          source_signal_kinds: signalKindsFor(situation, ["EPISTEMIC_GAP"]),
          source_gap_kinds: ["NO_LINKED_EVIDENCE"],
          claim_ids: gap.claim_ids,
          evidence_ids: gap.evidence_ids,
          inquiry_keys: relatedInquiryKeys(
            situation,
            gap.predicate_kind,
            gap.predicate
          ),
          observation_need_keys: relatedNeedKeys(
            situation,
            gap.predicate_kind,
            gap.predicate
          ),
          details: {
            note: "Relevant Claim(s) lack canonical Evidence links. Not false/weak.",
          },
        })
      );
    } else if (gap.kind === "EVIDENCE_TENSION") {
      findings.push(
        emptyFinding({
          key: [
            "finding",
            "EVIDENCE_TENSION",
            gap.subject_id,
            gap.predicate_kind,
            gap.predicate,
            temporalInstantKey(gap.at),
            ...gap.claim_ids,
          ].join("|"),
          kind: "EVIDENCE_TENSION",
          subject_id: gap.subject_id,
          situation_key: sitKey,
          predicate_kind: gap.predicate_kind,
          predicate: gap.predicate,
          at: gap.at,
          source_signal_kinds: signalKindsFor(situation, ["EPISTEMIC_GAP"]),
          source_gap_kinds: ["EVIDENCE_TENSION"],
          claim_ids: gap.claim_ids,
          evidence_ids: gap.evidence_ids,
          inquiry_keys: relatedInquiryKeys(
            situation,
            gap.predicate_kind,
            gap.predicate
          ),
          observation_need_keys: relatedNeedKeys(
            situation,
            gap.predicate_kind,
            gap.predicate
          ),
          details: {
            supporting_evidence_ids: [
              ...(gap.details.supporting_evidence_ids ?? []),
            ].sort(),
            contradicting_evidence_ids: [
              ...(gap.details.contradicting_evidence_ids ?? []),
            ].sort(),
            note: "SUPPORTS and CONTRADICTS Evidence coexist. No voting.",
          },
        })
      );
    } else if (gap.kind === "TEMPORAL_COVERAGE_GAP") {
      findings.push(
        emptyFinding({
          key: [
            "finding",
            "TEMPORAL_KNOWLEDGE_GAP",
            gap.subject_id,
            gap.predicate_kind,
            gap.predicate,
            temporalInstantKey(gap.at),
          ].join("|"),
          kind: "TEMPORAL_KNOWLEDGE_GAP",
          subject_id: gap.subject_id,
          situation_key: sitKey,
          predicate_kind: gap.predicate_kind,
          predicate: gap.predicate,
          at: gap.at,
          source_signal_kinds: signalKindsFor(situation, ["EPISTEMIC_GAP"]),
          source_gap_kinds: ["TEMPORAL_COVERAGE_GAP"],
          claim_ids: gap.claim_ids,
          evidence_ids: gap.evidence_ids,
          inquiry_keys: relatedInquiryKeys(
            situation,
            gap.predicate_kind,
            gap.predicate
          ),
          observation_need_keys: relatedNeedKeys(
            situation,
            gap.predicate_kind,
            gap.predicate
          ),
          details: {
            prior_claim_ids: [...(gap.details.prior_claim_ids ?? [])].sort(),
            later_claim_ids: [...(gap.details.later_claim_ids ?? [])].sort(),
            note: "Claims exist before/after query time with none applicable at `at`. No interpolation.",
          },
        })
      );
    }
    // CONTESTED_POSITIONS → covered by EPISTEMIC_POSITION_CONFLICT (Belief CONTESTED).
    // Do not emit a redundant KNOWLEDGE_GAP-style Finding for contest.
  }

  if (situation.ontic_context.unplaced_events.length > 0) {
    const eventIds = situation.ontic_context.unplaced_events.map((e) => e.id);
    findings.push(
      emptyFinding({
        key: ["finding", "UNPLACED_EVENT", subjectId, ...eventIds].join("|"),
        kind: "UNPLACED_EVENT",
        subject_id: subjectId,
        situation_key: sitKey,
        predicate_kind: null,
        predicate: null,
        at,
        source_signal_kinds: signalKindsFor(situation, ["UNPLACED_EVENT"]),
        event_ids: eventIds,
        details: {
          note: "RealityEvent(s) with occurred_at=null. recorded_at is not occurrence time.",
        },
      })
    );
  }

  if (situation.inquiry_context.observation_needs.length > 0) {
    const needKeys = situation.inquiry_context.observation_needs.map(
      (n) => n.key
    );
    const inquiryKeys = situation.inquiry_context.inquiries.map((i) => i.key);
    findings.push(
      emptyFinding({
        key: [
          "finding",
          "OBSERVATION_NEED_PRESENT",
          subjectId,
          temporalInstantKey(at),
          ...needKeys,
        ].join("|"),
        kind: "OBSERVATION_NEED_PRESENT",
        subject_id: subjectId,
        situation_key: sitKey,
        predicate_kind: null,
        predicate: null,
        at,
        source_signal_kinds: signalKindsFor(situation, [
          "OBSERVATION_NEED",
          "OPEN_INQUIRY",
        ]),
        inquiry_keys: inquiryKeys,
        observation_need_keys: needKeys,
        details: {
          note: "Inquiry chain derived ObservationNeed(s). Not dispatch or priority.",
        },
      })
    );
  }

  return dedupeFindings(findings);
}

/**
 * Build Situation then detect StructuralFindings.
 */
export function assessSituationDiscoveries(
  projectState: ProjectState,
  situationQuery: SituationQuery
): DiscoveryAssessment {
  const situation = buildSituation(projectState, situationQuery);
  const findings = discoverStructuralFindings(situation);
  const finding_kinds = [
    ...new Set(findings.map((f) => f.kind)),
  ].sort(
    (a, b) => FINDING_KIND_ORDER[a] - FINDING_KIND_ORDER[b]
  ) as StructuralFindingKind[];

  return {
    situation_key: situation.key,
    subject_id: situation.subject_id,
    at: situation.at,
    findings,
    has_findings: findings.length > 0,
    finding_kinds,
  };
}

export function getStructuralFindingsForSubject(
  projectState: ProjectState,
  subjectId: string,
  at: string,
  options?: {
    predicateScopes?: SituationQuery["predicateScopes"];
    eventWindow?: SituationQuery["eventWindow"];
  }
): StructuralFinding[] {
  return assessSituationDiscoveries(projectState, {
    subjectId,
    at,
    predicateScopes: options?.predicateScopes,
    eventWindow: options?.eventWindow,
  }).findings;
}

/**
 * Project-level unresolved-subject Findings.
 * Not injected into Entity-scoped Situations.
 */
export function discoverUnresolvedSubjectFindings(
  projectState: ProjectState,
  at?: string
): StructuralFinding[] {
  const views = getUnresolvedSubjectClaims(projectState, at);
  const findings = views.map((view) =>
    emptyFinding({
      key: ["finding", "UNRESOLVED_SUBJECT", view.claim.id].join("|"),
      kind: "UNRESOLVED_SUBJECT",
      subject_id: null,
      situation_key: null,
      predicate_kind: view.claim.predicate_kind,
      predicate: view.claim.predicate,
      at: at ?? null,
      source_gap_kinds: [],
      claim_ids: [view.claim.id],
      details: {
        note: "Claim with subject_id=null. Identity not matched; not attached to an Entity Situation.",
      },
    })
  );
  return dedupeFindings(findings);
}
