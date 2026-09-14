/**
 * Reality Core v0.7 — Explicit Resource Situation composition (GROUND-039).
 *
 * Read-only. Must not import state-engine / file-store / studio.
 *
 * Additive wrapper over buildSituation — does not mutate legacy Situation semantics.
 * Consumes GROUND-038 Resource Discovery only (no overlap/load/Capacity recalculation).
 * Explicit ResourceDeclaration IDs only — no holder/committer/reserver inference.
 */

import {
  discoverResourceContentionFindings,
  RESOURCE_CONTENTION_FINDING_KIND_ORDER,
} from "./resource-contention-discovery.js";
import { buildSituation } from "./situation.js";
import type {
  ResourceAwareSituationAssessment,
  ResourceAwareSituationQuery,
  ResourceSituationFacet,
  ResourceSituationFindingReference,
  ResourceSituationModelLimitation,
  ResourceSituationSalienceSignal,
  ResourceSituationSalienceStatus,
} from "./resource-situation-types.js";
import type { ResourceContentionFinding } from "./resource-contention-discovery-types.js";
import type { ProjectState } from "../types.js";

export const RESOURCE_SITUATION_MODEL_LIMITATIONS: ResourceSituationModelLimitation[] =
  [
    "RESOURCE_RELEVANCE_INFERENCE_NOT_MODELED",
    "RESOURCE_FINDING_TO_BASE_SITUATION_STATUS_NOT_MODELED",
    "RESOURCE_FINDING_PRIORITY_NOT_MODELED",
    "RESOURCE_FINDING_SEVERITY_NOT_MODELED",
    "ATTENTION_NOT_MODELED",
    "VALUE_OF_INFORMATION_NOT_MODELED",
    "AUTOMATIC_UNKNOWN_BRIDGE_NOT_MODELED",
    "AUTOMATIC_INQUIRY_BRIDGE_NOT_MODELED",
    "AUTOMATIC_OBSERVATION_NEED_BRIDGE_NOT_MODELED",
    "AUTOMATIC_DECISION_BRIDGE_NOT_MODELED",
    "AUTOMATIC_INTERVENTION_BRIDGE_NOT_MODELED",
    "RESOURCE_CONFLICT_ADJUDICATION_NOT_MODELED",
    "EFFECTIVE_RESOURCE_RESERVATION_NOT_MODELED",
    "EFFECTIVE_RESOURCE_CAPACITY_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const FINDING_KIND_ORDER = Object.fromEntries(
  RESOURCE_CONTENTION_FINDING_KIND_ORDER.map((kind, index) => [kind, index])
) as Record<(typeof RESOURCE_CONTENTION_FINDING_KIND_ORDER)[number], number>;

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function sortUniqueIds(ids: string[]): string[] {
  return [...new Set(ids)].sort(compareIds);
}

export function resourceSituationSalienceSignalKey(
  resourceDeclarationId: string,
  findingKey: string
): string {
  return ["resource-situation-salience", resourceDeclarationId, findingKey].join(
    "|"
  );
}

/**
 * Normalize explicit ResourceDeclaration IDs: dedupe + sort.
 * Unknown IDs throw a deterministic query error (no silent ignore).
 */
export function normalizeResourceSituationScope(
  projectState: ProjectState,
  resourceDeclarationIds: string[]
): string[] {
  const normalized = sortUniqueIds(resourceDeclarationIds);
  const known = new Set(
    projectState.resource_declarations.map((entry) => entry.id)
  );
  for (const id of normalized) {
    if (!known.has(id)) {
      throw new Error(
        `ResourceDeclaration ${id} not found in project state`
      );
    }
  }
  return normalized;
}

export function buildResourceSituationSalienceSignals(
  findings: ResourceContentionFinding[]
): ResourceSituationSalienceSignal[] {
  return findings
    .map((finding) => ({
      key: resourceSituationSalienceSignalKey(
        finding.resource_declaration_id,
        finding.key
      ),
      kind: "RESOURCE_CONTENTION_FINDING_PRESENT" as const,
      resource_declaration_id: finding.resource_declaration_id,
      resource_finding_key: finding.key,
      resource_finding_kind: finding.kind,
      basis: finding.basis,
    }))
    .sort((a, b) => {
      if (a.resource_declaration_id !== b.resource_declaration_id) {
        return compareIds(a.resource_declaration_id, b.resource_declaration_id);
      }
      const kindDiff =
        FINDING_KIND_ORDER[a.resource_finding_kind] -
        FINDING_KIND_ORDER[b.resource_finding_kind];
      if (kindDiff !== 0) {
        return kindDiff;
      }
      return a.resource_finding_key < b.resource_finding_key
        ? -1
        : a.resource_finding_key > b.resource_finding_key
          ? 1
          : 0;
    });
}

function compareFindingRefs(
  a: ResourceSituationFindingReference,
  b: ResourceSituationFindingReference
): number {
  if (a.resource_declaration_id !== b.resource_declaration_id) {
    return compareIds(a.resource_declaration_id, b.resource_declaration_id);
  }
  const kindDiff =
    FINDING_KIND_ORDER[a.finding_kind] - FINDING_KIND_ORDER[b.finding_kind];
  if (kindDiff !== 0) {
    return kindDiff;
  }
  return a.finding_key < b.finding_key
    ? -1
    : a.finding_key > b.finding_key
      ? 1
      : 0;
}

/**
 * Compose additive Resource-aware Situation assessment.
 * Uses existing buildSituation for the base Situation (unchanged).
 * Resource Discovery uses SituationQuery.at.
 */
export function composeResourceAwareSituation(
  projectState: ProjectState,
  query: ResourceAwareSituationQuery
): ResourceAwareSituationAssessment {
  const resource_declaration_ids = normalizeResourceSituationScope(
    projectState,
    query.resource_declaration_ids
  );
  const at = query.situation_query.at;
  const base_situation = buildSituation(projectState, query.situation_query);

  const resource_facets: ResourceSituationFacet[] = [];
  const resource_findings: ResourceSituationFindingReference[] = [];

  for (const resourceId of resource_declaration_ids) {
    const findings = discoverResourceContentionFindings(
      projectState,
      resourceId,
      at
    );
    const salience_signals = buildResourceSituationSalienceSignals(findings);
    resource_facets.push({
      resource_declaration_id: resourceId,
      findings,
      salience_signals,
      has_findings: findings.length > 0,
    });
    for (const finding of findings) {
      resource_findings.push({
        resource_declaration_id: resourceId,
        finding_key: finding.key,
        finding_kind: finding.kind,
        finding,
      });
    }
  }

  resource_findings.sort(compareFindingRefs);
  const resource_salience_signals = buildResourceSituationSalienceSignals(
    resource_findings.map((ref) => ref.finding)
  );

  const has_resource_scope = resource_declaration_ids.length > 0;
  const has_resource_findings = resource_findings.length > 0;
  const has_resource_salience = resource_salience_signals.length > 0;

  let resource_salience_status: ResourceSituationSalienceStatus;
  if (!has_resource_scope) {
    resource_salience_status = "NO_RESOURCE_SCOPE";
  } else if (!has_resource_salience) {
    resource_salience_status = "NO_RESOURCE_SALIENCE";
  } else {
    resource_salience_status = "RESOURCE_SALIENCE_PRESENT";
  }

  return {
    query: {
      situation_query: query.situation_query,
      resource_declaration_ids: [...resource_declaration_ids],
    },
    base_situation,
    resource_declaration_ids,
    resource_facets,
    resource_findings,
    resource_salience_signals,
    resource_salience_status,
    has_resource_scope,
    has_resource_findings,
    has_resource_salience,
    model_limitations: [...RESOURCE_SITUATION_MODEL_LIMITATIONS],
  };
}
