import { compareTemporalInstants, requireTemporalInstant } from "../temporal.js";
/**
 * Reality Core v0.7 — Worldline & temporal composition (GROUND-003).
 *
 * Pure read functions over ProjectState Reality collections.
 * Must not import the durable mutation path (patch apply / project save).
 */

import { NotFoundError } from "../errors.js";
import { canonicalValueKey } from "./semantic-equality.js";
import type {
  ProjectState,
  RealityEntity,
  RealityEvent,
  RealityState,
} from "../types.js";
import type {
  RealityStateConflict,
  RealityStatesByKind,
  RealityWorldline,
  RealityWorldlineEntry,
  RealityWorldlineTemporalRole,
} from "./worldline-types.js";

/**
 * Deterministic ordering for equal timestamps:
 * 1. time ascending (exact resolved semantic instant)
 * 2. temporal_role priority: STATE_BECAME_VALID < EVENT_OCCURRED < STATE_CEASED_VALID
 * 3. recorded_at ascending
 * 4. record_id ascending
 */
const TEMPORAL_ROLE_PRIORITY: Record<RealityWorldlineTemporalRole, number> = {
  STATE_BECAME_VALID: 0,
  EVENT_OCCURRED: 1,
  STATE_CEASED_VALID: 2,
};

interface SortableEntry {
  entry: RealityWorldlineEntry;
  recorded_at: string;
}

function assertProjectScopedEntity(
  projectState: ProjectState,
  entity: RealityEntity
): void {
  if (entity.project_id !== projectState.project.id) {
    throw new NotFoundError(
      `RealityEntity ${entity.id} is not in project ${projectState.project.id}`
    );
  }
}

function findEntity(
  projectState: ProjectState,
  entityId: string
): RealityEntity {
  const entity = projectState.reality_entities.find(
    (entry) =>
      entry.id === entityId && entry.project_id === projectState.project.id
  );
  if (!entity) {
    throw new NotFoundError(`RealityEntity not found: ${entityId}`);
  }
  assertProjectScopedEntity(projectState, entity);
  return entity;
}

function entityEvents(
  projectState: ProjectState,
  entityId: string
): RealityEvent[] {
  const projectId = projectState.project.id;
  return projectState.reality_events.filter(
    (event) =>
      event.project_id === projectId && event.subject_ids.includes(entityId)
  );
}

function entityStates(
  projectState: ProjectState,
  entityId: string
): RealityState[] {
  const projectId = projectState.project.id;
  return projectState.reality_states.filter(
    (state) => state.project_id === projectId && state.subject_id === entityId
  );
}

/**
 * Half-open interval: [valid_from, valid_until)
 * valid_until === null → open-ended (active for all at >= valid_from).
 */
export function isRealityStateActiveAt(
  state: RealityState,
  at: string
): boolean {
  if (compareTemporalInstants(state.valid_from, at, "Worldline activity valid_from/evaluation_at") > 0) {
    return false;
  }
  if (state.valid_until === null) {
    return true;
  }
  return compareTemporalInstants(at, state.valid_until, "Worldline activity evaluation_at/valid_until") < 0;
}

function intervalsOverlap(
  aFrom: string,
  aUntil: string | null,
  bFrom: string,
  bUntil: string | null
): boolean {
  // Half-open [from, until): overlap iff aFrom < bUntil' && bFrom < aUntil'
  requireTemporalInstant(aFrom, "Worldline overlap start");
  requireTemporalInstant(bFrom, "Worldline overlap start");
  return (bUntil === null || compareTemporalInstants(aFrom, bUntil, "Worldline overlap end") < 0) &&
    (aUntil === null || compareTemporalInstants(bFrom, aUntil, "Worldline overlap end") < 0);
}

function compareSortable(a: SortableEntry, b: SortableEntry): number {
  if (compareTemporalInstants(a.entry.time, b.entry.time, "Worldline ordering") !== 0) {
    return compareTemporalInstants(a.entry.time, b.entry.time, "Worldline ordering") < 0 ? -1 : 1;
  }
  const roleA = TEMPORAL_ROLE_PRIORITY[a.entry.temporal_role];
  const roleB = TEMPORAL_ROLE_PRIORITY[b.entry.temporal_role];
  if (roleA !== roleB) {
    return roleA - roleB;
  }
  if (compareTemporalInstants(a.recorded_at, b.recorded_at, "Worldline ordering") !== 0) {
    return compareTemporalInstants(a.recorded_at, b.recorded_at, "Worldline ordering") < 0 ? -1 : 1;
  }
  if (a.entry.record_id !== b.entry.record_id) {
    return a.entry.record_id < b.entry.record_id ? -1 : 1;
  }
  return 0;
}

function buildOrderedEntries(
  events: RealityEvent[],
  states: RealityState[]
): {
  ordered_entries: RealityWorldlineEntry[];
  unplaced_events: RealityEvent[];
} {
  const unplaced_events = events
    .filter((event) => event.occurred_at === null)
    .slice()
    .sort((a, b) => {
      if (compareTemporalInstants(a.recorded_at, b.recorded_at, "Worldline ordering") !== 0) {
        return compareTemporalInstants(a.recorded_at, b.recorded_at, "Worldline ordering") < 0 ? -1 : 1;
      }
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    });

  const sortable: SortableEntry[] = [];

  for (const event of events) {
    if (event.occurred_at === null) {
      continue;
    }
    sortable.push({
      recorded_at: event.recorded_at,
      entry: {
        record_type: "event",
        record_id: event.id,
        time: event.occurred_at,
        temporal_role: "EVENT_OCCURRED",
        source_record_id: event.id,
      },
    });
  }

  for (const state of states) {
    sortable.push({
      recorded_at: state.recorded_at,
      entry: {
        record_type: "state",
        record_id: state.id,
        time: state.valid_from,
        temporal_role: "STATE_BECAME_VALID",
        source_record_id: state.id,
      },
    });
    if (state.valid_until !== null) {
      sortable.push({
        recorded_at: state.recorded_at,
        entry: {
          record_type: "state",
          record_id: `${state.id}:until`,
          time: state.valid_until,
          temporal_role: "STATE_CEASED_VALID",
          source_record_id: state.id,
        },
      });
    }
  }

  sortable.sort(compareSortable);

  for (const item of sortable) requireTemporalInstant(item.entry.time, "Worldline timeline placement");
  return {
    ordered_entries: sortable.map((item) => item.entry),
    unplaced_events,
  };
}

/**
 * Detect same-subject, same-kind overlapping states.
 * value_conflict when values differ; duplicate_overlap when values are identical.
 * Automatic resolution: none.
 */
export function detectRealityStateConflicts(
  projectState: ProjectState,
  entityId: string
): RealityStateConflict[] {
  findEntity(projectState, entityId);
  const states = entityStates(projectState, entityId);
  const byKind = new Map<string, RealityState[]>();

  for (const state of states) {
    const group = byKind.get(state.kind) ?? [];
    group.push(state);
    byKind.set(state.kind, group);
  }

  const conflicts: RealityStateConflict[] = [];

  for (const [kind, group] of byKind) {
    for (let i = 0; i < group.length; i += 1) {
      for (let j = i + 1; j < group.length; j += 1) {
        const a = group[i]!;
        const b = group[j]!;
        if (
          !intervalsOverlap(
            a.valid_from,
            a.valid_until,
            b.valid_from,
            b.valid_until
          )
        ) {
          continue;
        }
        const sameValue =
          canonicalValueKey(a.value) === canonicalValueKey(b.value);
        const ordered = [a, b].sort((x, y) => (x.id < y.id ? -1 : 1));
        conflicts.push({
          conflict_kind: sameValue ? "duplicate_overlap" : "value_conflict",
          subject_id: entityId,
          kind,
          state_ids: ordered.map((s) => s.id),
          states: ordered,
        });
      }
    }
  }

  conflicts.sort((a, b) => {
    if (a.kind !== b.kind) {
      return a.kind < b.kind ? -1 : 1;
    }
    if (a.conflict_kind !== b.conflict_kind) {
      return a.conflict_kind < b.conflict_kind ? -1 : 1;
    }
    const aKey = a.state_ids.join(":");
    const bKey = b.state_ids.join(":");
    return aKey < bKey ? -1 : aKey > bKey ? 1 : 0;
  });

  return conflicts;
}

/**
 * Derived Worldline for one RealityEntity.
 * Throws NotFoundError if the entity is missing or not in this project.
 */
export function getRealityWorldline(
  projectState: ProjectState,
  entityId: string
): RealityWorldline {
  const entity = findEntity(projectState, entityId);
  const events = entityEvents(projectState, entityId).slice().sort((a, b) => {
    if (a.id !== b.id) {
      return a.id < b.id ? -1 : 1;
    }
    return 0;
  });
  const states = entityStates(projectState, entityId).slice().sort((a, b) => {
    if (a.id !== b.id) {
      return a.id < b.id ? -1 : 1;
    }
    return 0;
  });

  const { ordered_entries, unplaced_events } = buildOrderedEntries(
    events,
    states
  );
  const conflicts = detectRealityStateConflicts(projectState, entityId);
  const valueConflicts = conflicts.filter(
    (c) => c.conflict_kind === "value_conflict"
  );
  const duplicateOverlaps = conflicts.filter(
    (c) => c.conflict_kind === "duplicate_overlap"
  );

  const times = ordered_entries.map((e) => e.time);
  const earliest_time = times.length > 0 ? times.reduce((a, b) => (compareTemporalInstants(a, b) < 0 ? a : b)) : null;
  const latest_time = times.length > 0 ? times.reduce((a, b) => (compareTemporalInstants(a, b) > 0 ? a : b)) : null;

  return {
    entity,
    events,
    states,
    ordered_entries,
    unplaced_events,
    temporal_summary: {
      earliest_time,
      latest_time,
      ordered_entry_count: ordered_entries.length,
      unplaced_event_count: unplaced_events.length,
      conflict_count: valueConflicts.length,
      duplicate_overlap_count: duplicateOverlaps.length,
    },
  };
}

/**
 * All RealityStates for the entity whose validity includes `at`
 * under half-open [valid_from, valid_until).
 */
export function getRealityStatesAt(
  projectState: ProjectState,
  entityId: string,
  at: string
): RealityState[] {
  findEntity(projectState, entityId);
  requireTemporalInstant(at, "Worldline query evaluation_at");
  return entityStates(projectState, entityId)
    .filter((state) => isRealityStateActiveAt(state, at))
    .slice()
    .sort((a, b) => {
      if (a.kind !== b.kind) {
        return a.kind < b.kind ? -1 : 1;
      }
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    });
}

/**
 * Current effective states grouped by kind.
 * Each kind may have 0, 1, or multiple overlapping states — no winner selected.
 * `at` defaults to now (ISO) only for the query clock; it does not invent Event occurrence times.
 */
export function getCurrentRealityStates(
  projectState: ProjectState,
  entityId: string,
  at?: string
): RealityStatesByKind[] {
  const when = at ?? new Date().toISOString();
  const active = getRealityStatesAt(projectState, entityId, when);
  const byKind = new Map<string, RealityState[]>();

  for (const state of active) {
    const group = byKind.get(state.kind) ?? [];
    group.push(state);
    byKind.set(state.kind, group);
  }

  return [...byKind.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([kind, states]) => ({
      kind,
      states: states.slice().sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)),
    }));
}
