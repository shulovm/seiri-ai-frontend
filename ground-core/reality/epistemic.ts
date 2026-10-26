/**
 * Reality Core v0.7 — Epistemic Core I read helpers (GROUND-004).
 *
 * Pure read functions. Must not import applyPatch / saveProject.
 * Does not promote Claims to ontic Reality.
 */

import { NotFoundError, ValidationError } from "../errors.js";

import type {
  Claim,
  ClaimEvidenceLink,
  Evidence,
  EpistemicObservation,
  ProjectState,
} from "../types.js";

function projectScoped<T extends { project_id: string }>(
  projectState: ProjectState,
  items: T[]
): T[] {
  const projectId = projectState.project.id;
  return items.filter((item) => item.project_id === projectId);
}

/** Epistemic observations that mention the given RealityEntity subject. */
export function getObservationsForSubject(
  projectState: ProjectState,
  subjectId: string
): EpistemicObservation[] {
  return projectScoped(projectState, projectState.epistemic_observations)
    .filter((observation) => observation.subject_ids.includes(subjectId))
    .slice()
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

/** Claims about the given RealityEntity subject (subject_id exact match). */
export function getClaimsForSubject(
  projectState: ProjectState,
  subjectId: string
): Claim[] {
  return projectScoped(projectState, projectState.claims)
    .filter((claim) => claim.subject_id === subjectId)
    .slice()
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

export interface ClaimEvidenceBundle {
  claim_id: string;
  supports: Evidence[];
  contradicts: Evidence[];
  links: ClaimEvidenceLink[];
}

/** Evidence linked to a Claim via SUPPORTS / CONTRADICTS. No ranking. */
export function getEvidenceForClaim(
  projectState: ProjectState,
  claimId: string
): ClaimEvidenceBundle {
  const links = projectScoped(projectState, projectState.claim_evidence_links)
    .filter((link) => link.claim_id === claimId)
    .slice()
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  const evidenceById = new Map(
    projectScoped(projectState, projectState.evidence).map((entry) => [
      entry.id,
      entry,
    ])
  );

  const supports: Evidence[] = [];
  const contradicts: Evidence[] = [];

  for (const link of links) {
    const evidence = evidenceById.get(link.evidence_id);
    if (!evidence) {
      continue;
    }
    if (link.relation === "SUPPORTS") {
      supports.push(evidence);
    } else if (link.relation === "CONTRADICTS") {
      contradicts.push(evidence);
    }
  }

  supports.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  contradicts.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  return {
    claim_id: claimId,
    supports,
    contradicts,
    links,
  };
}

/** Reverse read of explicit observation_ref records, in stored Evidence order.
 * Zero matches says nothing about truth or Evidence outside this relation scope.
 * No source/provenance inference, sorting, repair, index or mutation.
 */
export function getEvidenceForObservation(
  projectState: ProjectState,
  observationId: string
): Evidence[] {
  const observations = projectScoped(projectState, projectState.epistemic_observations)
    .filter((observation) => observation.id === observationId);
  if (observations.length === 0) {
    throw new NotFoundError(`EpistemicObservation not found in project: ${observationId}`);
  }
  if (observations.length !== 1) {
    throw new ValidationError(`Ambiguous EpistemicObservation ID: ${observationId}`);
  }
  return projectScoped(projectState, projectState.evidence).filter(
    (evidence) => evidence.kind === "observation_ref" && evidence.observation_id === observationId
  );
}
