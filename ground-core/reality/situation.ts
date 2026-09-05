/**
 * Reality Core v0.7 — Situation / Salience formation (GROUND-009).
 *
 * Pure aggregator over:
 *   Worldline / state queries
 *   Belief / Gap / Inquiry / ObservationNeed
 *
 * Must not import state-engine / file-store.
 * Must not invent predicates, scores, Problems, or Actions.
 * Derived identity keys are semantic — never time-based or random.
 */

import {
  assessBeliefAt,
  getBeliefAssessmentsForSubject,
} from "./belief.js";
import {
  assessEpistemicGapsAt,
  getEpistemicGapsForSubject,
} from "./epistemic-gaps.js";
import {
  formulateInquiryAt,
  getInquiriesForSubject,
} from "./inquiry.js";
import {
  deriveObservationNeedsForInquiry,
  getObservationNeedsForSubject,
} from "./observation-need.js";
import {
  detectRealityStateConflicts,
  getRealityStatesAt,
  getRealityWorldline,
} from "./worldline.js";
import type { BeliefQuery } from "./belief-types.js";
import type { Inquiry } from "./inquiry-types.js";
import type { ObservationNeed } from "./observation-need-types.js";
import type {
  PredicateScope,
  SalienceSignal,
  SalienceSignalKind,
  Situation,
  SituationQuery,
  SituationStatus,
} from "./situation-types.js";
import type { ProjectState, RealityEvent } from "../types.js";

const SIGNAL_KIND_ORDER: Record<SalienceSignalKind, number> = {
  ONTIC_EVENT_PRESENT: 0,
  STATE_CONFLICT: 1,
  UNPLACED_EVENT: 2,
  EPISTEMIC_CONTEST: 3,
  EPISTEMIC_GAP: 4,
  OPEN_INQUIRY: 5,
  OBSERVATION_NEED: 6,
};

const UNRESOLVED_KINDS: ReadonlySet<SalienceSignalKind> = new Set([
  "STATE_CONFLICT",
  "EPISTEMIC_CONTEST",
  "EPISTEMIC_GAP",
  "OPEN_INQUIRY",
  "OBSERVATION_NEED",
  "UNPLACED_EVENT",
]);

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function sortUniqueIds(ids: string[]): string[] {
  return [...new Set(ids)].sort(compareIds);
}

function compareSignals(a: SalienceSignal, b: SalienceSignal): number {
  const kindDiff = SIGNAL_KIND_ORDER[a.kind] - SIGNAL_KIND_ORDER[b.kind];
  if (kindDiff !== 0) {
    return kindDiff;
  }
  return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
}

function compareScopes(a: PredicateScope, b: PredicateScope): number {
  if (a.predicateKind !== b.predicateKind) {
    return a.predicateKind < b.predicateKind ? -1 : 1;
  }
  return a.predicate < b.predicate ? -1 : a.predicate > b.predicate ? 1 : 0;
}

function scopeKey(scope: PredicateScope): string {
  return `${scope.predicateKind}\u0000${scope.predicate}`;
}

function eventInWindow(
  event: RealityEvent,
  query: SituationQuery
): boolean {
  if (event.occurred_at === null) {
    return false;
  }
  if (query.eventWindow) {
    const { from, until } = query.eventWindow;
    return from <= event.occurred_at && event.occurred_at < until;
  }
  // No window: only exact point match at query.at (conservative).
  return event.occurred_at === query.at;
}

function resolvePredicateScopes(
  projectState: ProjectState,
  query: SituationQuery
): PredicateScope[] {
  if (query.predicateScopes && query.predicateScopes.length > 0) {
    return query.predicateScopes.slice().sort(compareScopes);
  }
  const scopes = new Map<string, PredicateScope>();
  for (const claim of projectState.claims) {
    if (
      claim.project_id !== projectState.project.id ||
      claim.subject_id !== query.subjectId
    ) {
      continue;
    }
    const scope: PredicateScope = {
      predicateKind: claim.predicate_kind,
      predicate: claim.predicate,
    };
    scopes.set(scopeKey(scope), scope);
  }
  return [...scopes.values()].sort(compareScopes);
}

function situationKey(
  query: SituationQuery,
  scopes: PredicateScope[]
): string {
  return [
    "sit",
    query.subjectId,
    query.at,
    query.eventWindow
      ? `${query.eventWindow.from}..${query.eventWindow.until}`
      : "",
    ...scopes.map((s) => `${s.predicateKind}:${s.predicate}`),
  ].join("|");
}

function statusFrom(
  signals: SalienceSignal[],
  hasOnticActivity: boolean
): SituationStatus {
  if (signals.some((s) => UNRESOLVED_KINDS.has(s.kind))) {
    return "UNRESOLVED";
  }
  if (
    hasOnticActivity ||
    signals.some((s) => s.kind === "ONTIC_EVENT_PRESENT")
  ) {
    return "ACTIVE";
  }
  return "QUIET";
}

/**
 * Detect structural SalienceSignals for an explicit SituationQuery.
 * ACTIVE_STATE_PRESENT is intentionally NOT a signal — normal states live in ontic_context only.
 */
export function detectSalienceSignals(
  projectState: ProjectState,
  query: SituationQuery
): SalienceSignal[] {
  return buildSituation(projectState, query).salience_signals;
}

/**
 * Build a derived Situation for an explicit subject/time scope.
 */
export function buildSituation(
  projectState: ProjectState,
  query: SituationQuery
): Situation {
  const worldline = getRealityWorldline(projectState, query.subjectId);
  const scopes = resolvePredicateScopes(projectState, query);

  const active_states = getRealityStatesAt(
    projectState,
    query.subjectId,
    query.at
  );
  const events = worldline.events
    .filter((event) => eventInWindow(event, query))
    .slice()
    .sort((a, b) => {
      const atA = a.occurred_at ?? "";
      const atB = b.occurred_at ?? "";
      if (atA !== atB) {
        return atA < atB ? -1 : 1;
      }
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    });
  const unplaced_events = worldline.unplaced_events.slice().sort((a, b) => {
    if (a.recorded_at !== b.recorded_at) {
      return a.recorded_at < b.recorded_at ? -1 : 1;
    }
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
  const state_conflicts = detectRealityStateConflicts(
    projectState,
    query.subjectId
  )
    .slice()
    .sort((a, b) => {
      if (a.kind !== b.kind) {
        return a.kind < b.kind ? -1 : 1;
      }
      return a.state_ids.join(",") < b.state_ids.join(",") ? -1 : 1;
    });

  const belief_assessments =
    scopes.length > 0
      ? scopes.map((scope) =>
          assessBeliefAt(projectState, {
            subjectId: query.subjectId,
            predicateKind: scope.predicateKind,
            predicate: scope.predicate,
            at: query.at,
          } satisfies BeliefQuery)
        )
      : getBeliefAssessmentsForSubject(
          projectState,
          query.subjectId,
          query.at
        );

  const gap_assessments =
    scopes.length > 0
      ? scopes.map((scope) =>
          assessEpistemicGapsAt(projectState, {
            subjectId: query.subjectId,
            predicateKind: scope.predicateKind,
            predicate: scope.predicate,
            at: query.at,
          })
        )
      : getEpistemicGapsForSubject(projectState, query.subjectId, query.at);

  const gaps = gap_assessments
    .flatMap((assessment) => assessment.gaps)
    .slice()
    .sort((a, b) => {
      if (a.kind !== b.kind) {
        return a.kind < b.kind ? -1 : 1;
      }
      if (a.predicate !== b.predicate) {
        return a.predicate < b.predicate ? -1 : 1;
      }
      return a.claim_ids.join(",") < b.claim_ids.join(",") ? -1 : 1;
    });

  const inquiries: Inquiry[] =
    scopes.length > 0
      ? scopes
          .map((scope) =>
            formulateInquiryAt(projectState, {
              subjectId: query.subjectId,
              predicateKind: scope.predicateKind,
              predicate: scope.predicate,
              at: query.at,
            })
          )
          .filter((inquiry): inquiry is Inquiry => inquiry !== null)
      : getInquiriesForSubject(projectState, query.subjectId, query.at);

  inquiries.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));

  const observation_needs: ObservationNeed[] =
    scopes.length > 0
      ? inquiries.flatMap((inquiry) =>
          deriveObservationNeedsForInquiry(inquiry)
        )
      : getObservationNeedsForSubject(projectState, query.subjectId, query.at);

  const needsByKey = new Map<string, ObservationNeed>();
  for (const need of observation_needs) {
    needsByKey.set(need.key, need);
  }
  const uniqueNeeds = [...needsByKey.values()].sort((a, b) =>
    a.key < b.key ? -1 : a.key > b.key ? 1 : 0
  );

  // Subject-identity unresolved Claims (subject_id=null) are out of Entity Situation scope.
  const unresolved_subject_claims: Situation["epistemic_context"]["unresolved_subject_claims"] =
    [];

  // Claims involved in contested beliefs or gaps for this subject.
  const claimIds = new Set<string>();
  for (const belief of belief_assessments) {
    if (belief.status === "CONTESTED") {
      for (const claim of belief.applicable_claims) {
        claimIds.add(claim.id);
      }
    }
  }
  for (const gap of gaps) {
    for (const id of gap.claim_ids) {
      claimIds.add(id);
    }
  }
  const unresolved_claims = projectState.claims
    .filter(
      (c) =>
        c.project_id === projectState.project.id &&
        c.subject_id === query.subjectId &&
        claimIds.has(c.id)
    )
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  const signals: SalienceSignal[] = [];

  if (events.length > 0) {
    signals.push({
      kind: "ONTIC_EVENT_PRESENT",
      key: ["sig", "ONTIC_EVENT_PRESENT", ...events.map((e) => e.id)].join(
        "|"
      ),
      event_ids: sortUniqueIds(events.map((e) => e.id)),
      state_ids: [],
      claim_ids: [],
      gap_kinds: [],
      inquiry_keys: [],
      observation_need_keys: [],
      note: "Canonical RealityEvent(s) fall in the Situation event scope. Not importance.",
    });
  }

  for (const conflict of state_conflicts) {
    if (conflict.conflict_kind !== "value_conflict") {
      continue;
    }
    signals.push({
      kind: "STATE_CONFLICT",
      key: [
        "sig",
        "STATE_CONFLICT",
        conflict.kind,
        ...conflict.state_ids,
      ].join("|"),
      event_ids: [],
      state_ids: [...conflict.state_ids],
      claim_ids: [],
      gap_kinds: [],
      inquiry_keys: [],
      observation_need_keys: [],
      note: "Overlapping same-kind RealityStates with distinct values. Not resolved.",
    });
  }

  if (unplaced_events.length > 0) {
    signals.push({
      kind: "UNPLACED_EVENT",
      key: [
        "sig",
        "UNPLACED_EVENT",
        ...unplaced_events.map((e) => e.id),
      ].join("|"),
      event_ids: sortUniqueIds(unplaced_events.map((e) => e.id)),
      state_ids: [],
      claim_ids: [],
      gap_kinds: [],
      inquiry_keys: [],
      observation_need_keys: [],
      note: "RealityEvent with occurred_at=null — not placed on the occurrence timeline.",
    });
  }

  for (const belief of belief_assessments) {
    if (belief.status !== "CONTESTED") {
      continue;
    }
    signals.push({
      kind: "EPISTEMIC_CONTEST",
      key: [
        "sig",
        "EPISTEMIC_CONTEST",
        belief.predicate_kind,
        belief.predicate,
        ...belief.applicable_claims.map((c) => c.id),
      ].join("|"),
      event_ids: [],
      state_ids: [],
      claim_ids: sortUniqueIds(belief.applicable_claims.map((c) => c.id)),
      gap_kinds: [],
      inquiry_keys: [],
      observation_need_keys: [],
      note: "BeliefAssessment is CONTESTED. Not a winner; not priority.",
    });
  }

  for (const assessment of gap_assessments) {
    if (!assessment.has_gaps) {
      continue;
    }
    signals.push({
      kind: "EPISTEMIC_GAP",
      key: [
        "sig",
        "EPISTEMIC_GAP",
        assessment.query.predicateKind,
        assessment.query.predicate,
        ...assessment.gaps.map((g) => g.kind),
      ].join("|"),
      event_ids: [],
      state_ids: [],
      claim_ids: sortUniqueIds(
        assessment.gaps.flatMap((g) => g.claim_ids)
      ),
      gap_kinds: [...new Set(assessment.gaps.map((g) => g.kind))].sort(),
      inquiry_keys: [],
      observation_need_keys: [],
      note: "Structural EpistemicGap(s) for an explicit proposition scope. Not high priority.",
    });
  }

  for (const inquiry of inquiries) {
    signals.push({
      kind: "OPEN_INQUIRY",
      key: ["sig", "OPEN_INQUIRY", inquiry.key].join("|"),
      event_ids: [],
      state_ids: [],
      claim_ids: sortUniqueIds(
        inquiry.questions.flatMap((q) => q.originating_claim_ids)
      ),
      gap_kinds: sortUniqueIds(
        inquiry.questions.flatMap((q) => q.originating_gap_kinds)
      ),
      inquiry_keys: [inquiry.key],
      observation_need_keys: [],
      note: "Derived Inquiry exists for this scope. Not Attention; not a Task.",
    });
  }

  for (const need of uniqueNeeds) {
    signals.push({
      kind: "OBSERVATION_NEED",
      key: ["sig", "OBSERVATION_NEED", need.key].join("|"),
      event_ids: [],
      state_ids: [],
      claim_ids: [...need.originating_claim_ids],
      gap_kinds: [...need.originating_gap_kinds],
      inquiry_keys: [],
      observation_need_keys: [need.key],
      note: "Derived ObservationNeed exists. Not dispatch; not observer selection.",
    });
  }

  signals.sort(compareSignals);

  const hasOnticActivity = active_states.length > 0 || events.length > 0;
  const status = statusFrom(signals, hasOnticActivity);
  const has_unresolved = signals.some((s) => UNRESOLVED_KINDS.has(s.kind));
  const has_salience = signals.length > 0;

  return {
    key: situationKey(query, scopes),
    subject_id: query.subjectId,
    at: query.at,
    event_window: query.eventWindow ?? null,
    predicate_scopes: scopes,
    entity: worldline.entity,
    ontic_context: {
      active_states,
      events,
      unplaced_events,
      state_conflicts,
    },
    epistemic_context: {
      belief_assessments,
      gap_assessments,
      gaps,
      unresolved_subject_claims,
      unresolved_claims,
    },
    inquiry_context: {
      inquiries,
      observation_needs: uniqueNeeds,
    },
    salience_signals: signals,
    status,
    has_salience,
    has_unresolved,
  };
}

export function getSituationForSubject(
  projectState: ProjectState,
  subjectId: string,
  at: string,
  options?: {
    predicateScopes?: PredicateScope[];
    eventWindow?: SituationQuery["eventWindow"];
  }
): Situation {
  return buildSituation(projectState, {
    subjectId,
    at,
    predicateScopes: options?.predicateScopes,
    eventWindow: options?.eventWindow,
  });
}
