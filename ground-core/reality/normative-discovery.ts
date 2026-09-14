import { temporalInstantKey } from "../temporal.js";
/**
 * Reality Core v0.7 — Normative Discovery (GROUND-012).
 *
 * Consumes GROUND-011 ReferenceStateAssessment only — no duplicate criterion logic.
 * Consumes GROUND-009 Situation via assessNormativeSituation.
 * Must not import state-engine / file-store.
 * PROBLEM = ACCEPTABLE + DEVIATES only (reference-relative).
 */

import { buildSituation } from "./situation.js";
import { assessReferenceStateAt, isReferenceConditionActiveAt } from "./reference-state.js";
import { canonicalValueKey } from "./semantic-equality.js";
import type {
  NormativeBasisStatus,
  NormativeDiscoveryAssessment,
  NormativeFinding,
  NormativeFindingKind,
} from "./normative-discovery-types.js";
import type {
  ReferenceComparison,
  ReferenceConflict,
  ReferenceStateAssessment,
} from "./reference-types.js";
import type { ProjectState, ReferenceKind } from "../types.js";
import type { SituationQuery } from "./situation-types.js";

const FINDING_KIND_ORDER: Record<NormativeFindingKind, number> = {
  PROBLEM: 0,
  REFERENCE_CONFLICT: 1,
  CURRENT_STATE_CONFLICT: 2,
  CURRENT_STATE_MISSING: 3,
  UNSUPPORTED_REFERENCE_COMPARISON: 4,
  EXPECTED_DEVIATION: 5,
  DESIRED_GAP: 6,
};

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function sortUnique(ids: string[]): string[] {
  return [...new Set(ids)].sort(compareIds);
}

function compareFindings(a: NormativeFinding, b: NormativeFinding): number {
  const kindDiff = FINDING_KIND_ORDER[a.kind] - FINDING_KIND_ORDER[b.kind];
  if (kindDiff !== 0) {
    return kindDiff;
  }
  if (a.state_kind !== b.state_kind) {
    return a.state_kind < b.state_kind ? -1 : 1;
  }
  return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
}

function dedupeFindings(findings: NormativeFinding[]): NormativeFinding[] {
  const byKey = new Map<string, NormativeFinding>();
  for (const finding of findings) {
    byKey.set(finding.key, finding);
  }
  return [...byKey.values()].sort(compareFindings);
}

function referenceKindHasConflict(
  assessment: ReferenceStateAssessment,
  referenceKind: ReferenceKind
): boolean {
  return assessment.reference_conflicts.some(
    (c) =>
      c.reference_kind === referenceKind &&
      c.conflict_kind === "CRITERION_INCOMPATIBLE"
  );
}

function referenceIdInConflict(
  assessment: ReferenceStateAssessment,
  referenceId: string,
  referenceKind: ReferenceKind
): boolean {
  return assessment.reference_conflicts.some(
    (c) =>
      c.reference_kind === referenceKind &&
      c.reference_condition_ids.includes(referenceId)
  );
}

function basisStatusForComparison(
  assessment: ReferenceStateAssessment,
  comparison: ReferenceComparison
): NormativeBasisStatus {
  if (comparison.result === "UNSUPPORTED_COMPARISON") {
    return "INDETERMINATE";
  }
  if (
    referenceKindHasConflict(assessment, comparison.reference_kind) ||
    referenceIdInConflict(
      assessment,
      comparison.reference_condition_id,
      comparison.reference_kind
    )
  ) {
    return "CONTESTED_REFERENCE";
  }
  return "UNCONTESTED_REFERENCE";
}

function currentValueKeys(assessment: ReferenceStateAssessment): string[] {
  return assessment.current.semantic_values.map((v) => canonicalValueKey(v));
}

function findingFromComparison(
  assessment: ReferenceStateAssessment,
  comparison: ReferenceComparison,
  kind: NormativeFindingKind,
  situationKey: string | null
): NormativeFinding {
  const ref = assessment.applicable_references.find(
    (r) => r.id === comparison.reference_condition_id
  );
  const basis_status = basisStatusForComparison(assessment, comparison);
  const currentIds =
    assessment.current.status === "SINGLE_VALUE"
      ? assessment.current.active_states.map((s) => s.id)
      : assessment.current.active_states.map((s) => s.id);

  return {
    key: [
      "norm",
      kind,
      assessment.subject_id,
      assessment.state_kind,
      temporalInstantKey(assessment.at),
      comparison.reference_condition_id,
    ].join("|"),
    kind,
    subject_id: assessment.subject_id,
    state_kind: assessment.state_kind,
    at: assessment.at,
    situation_key: situationKey,
    reference_condition_ids: [comparison.reference_condition_id],
    reference_kind: comparison.reference_kind,
    current_state_ids: sortUnique(currentIds),
    current_value_keys:
      comparison.current_value !== null
        ? [canonicalValueKey(comparison.current_value)]
        : currentValueKeys(assessment),
    comparison_results: [comparison.result],
    basis_status,
    details: {
      declarer_kind: ref?.declared_by.kind,
      declarer_entity_id: ref?.declared_by.entity_id ?? null,
      note:
        kind === "PROBLEM"
          ? "Current canonical state deviates from declared ACCEPTABLE ReferenceCondition. Not must_fix / authorized."
          : undefined,
    },
  };
}

function findingFromReferenceConflict(
  conflict: ReferenceConflict,
  situationKey: string | null
): NormativeFinding {
  return {
    key: ["norm", "REFERENCE_CONFLICT", conflict.key].join("|"),
    kind: "REFERENCE_CONFLICT",
    subject_id: conflict.subject_id,
    state_kind: conflict.state_kind,
    at: conflict.at,
    situation_key: situationKey,
    reference_condition_ids: [...conflict.reference_condition_ids],
    reference_kind: conflict.reference_kind,
    current_state_ids: [],
    current_value_keys: [],
    comparison_results: [],
    basis_status: "CONTESTED_REFERENCE",
    details: {
      reference_conflict_key: conflict.key,
      note: conflict.note,
    },
  };
}

function discoverFromReferenceAssessment(
  assessment: ReferenceStateAssessment,
  situationKey: string | null
): NormativeFinding[] {
  const findings: NormativeFinding[] = [];

  if (assessment.current.status === "CONFLICTED") {
    findings.push({
      key: [
        "norm",
        "CURRENT_STATE_CONFLICT",
        assessment.subject_id,
        assessment.state_kind,
        temporalInstantKey(assessment.at),
      ].join("|"),
      kind: "CURRENT_STATE_CONFLICT",
      subject_id: assessment.subject_id,
      state_kind: assessment.state_kind,
      at: assessment.at,
      situation_key: situationKey,
      reference_condition_ids: [],
      reference_kind: null,
      current_state_ids: sortUnique(
        assessment.current.active_states.map((s) => s.id)
      ),
      current_value_keys: currentValueKeys(assessment),
      comparison_results: ["CURRENT_CONFLICTED"],
      basis_status: "INDETERMINATE",
      details: {
        note: "Multiple distinct canonical RealityState values active. No arbitrary winner for normative comparison.",
      },
    });
  } else if (
    assessment.current.status === "NO_CURRENT_STATE" &&
    assessment.applicable_references.length > 0
  ) {
    findings.push({
      key: [
        "norm",
        "CURRENT_STATE_MISSING",
        assessment.subject_id,
        assessment.state_kind,
        temporalInstantKey(assessment.at),
      ].join("|"),
      kind: "CURRENT_STATE_MISSING",
      subject_id: assessment.subject_id,
      state_kind: assessment.state_kind,
      at: assessment.at,
      situation_key: situationKey,
      reference_condition_ids: sortUnique(
        assessment.applicable_references.map((r) => r.id)
      ),
      reference_kind: null,
      current_state_ids: [],
      current_value_keys: [],
      comparison_results: ["NO_CURRENT_STATE"],
      basis_status: "INDETERMINATE",
      details: {
        note: "No canonical RealityState for comparison. Absence is not proof of Reference violation.",
      },
    });
  }

  for (const conflict of assessment.reference_conflicts) {
    findings.push(findingFromReferenceConflict(conflict, situationKey));
  }

  if (assessment.current.status !== "SINGLE_VALUE") {
    return dedupeFindings(findings);
  }

  for (const comparison of assessment.comparisons) {
    if (comparison.result === "MATCH") {
      continue;
    }
    if (comparison.result === "UNSUPPORTED_COMPARISON") {
      findings.push({
        ...findingFromComparison(
          assessment,
          comparison,
          "UNSUPPORTED_REFERENCE_COMPARISON",
          situationKey
        ),
        basis_status: "INDETERMINATE",
        details: {
          note: "Criterion/value combination cannot be safely evaluated.",
        },
      });
      continue;
    }
    if (comparison.result !== "DEVIATES") {
      continue;
    }
    if (comparison.reference_kind === "ACCEPTABLE") {
      findings.push(
        findingFromComparison(assessment, comparison, "PROBLEM", situationKey)
      );
    } else if (comparison.reference_kind === "EXPECTED") {
      findings.push(
        findingFromComparison(
          assessment,
          comparison,
          "EXPECTED_DEVIATION",
          situationKey
        )
      );
    } else if (comparison.reference_kind === "DESIRED") {
      findings.push(
        findingFromComparison(
          assessment,
          comparison,
          "DESIRED_GAP",
          situationKey
        )
      );
    }
  }

  return dedupeFindings(findings);
}

export function getApplicableReferenceStateKinds(
  projectState: ProjectState,
  subjectId: string,
  at: string
): string[] {
  const projectId = projectState.project.id;
  const kinds = new Set<string>();
  for (const ref of projectState.reference_conditions) {
    if (
      ref.project_id === projectId &&
      ref.subject_id === subjectId &&
      isReferenceConditionActiveAt(ref, at)
    ) {
      kinds.add(ref.state_kind);
    }
  }
  return [...kinds].sort();
}

export function discoverNormativeFindings(
  projectState: ProjectState,
  subjectId: string,
  at: string,
  options?: { situationKey?: string | null }
): NormativeFinding[] {
  const situationKey = options?.situationKey ?? null;
  const kinds = getApplicableReferenceStateKinds(projectState, subjectId, at);
  const all: NormativeFinding[] = [];

  for (const stateKind of kinds) {
    const assessment = assessReferenceStateAt(projectState, {
      subjectId,
      stateKind,
      at,
    });
    all.push(...discoverFromReferenceAssessment(assessment, situationKey));
  }

  return dedupeFindings(all);
}

export function assessNormativeDiscovery(
  projectState: ProjectState,
  subjectId: string,
  at: string,
  options?: { situationKey?: string | null }
): NormativeDiscoveryAssessment {
  const situationKey = options?.situationKey ?? null;
  const kinds = getApplicableReferenceStateKinds(projectState, subjectId, at);
  const reference_state_assessments: ReferenceStateAssessment[] = [];
  const findings: NormativeFinding[] = [];

  for (const stateKind of kinds) {
    const assessment = assessReferenceStateAt(projectState, {
      subjectId,
      stateKind,
      at,
    });
    reference_state_assessments.push(assessment);
    findings.push(...discoverFromReferenceAssessment(assessment, situationKey));
  }

  const deduped = dedupeFindings(findings);
  const problem_findings = deduped.filter((f) => f.kind === "PROBLEM");

  return {
    subject_id: subjectId,
    at,
    situation_key: situationKey,
    reference_state_assessments,
    findings: deduped,
    problem_findings,
    has_findings: deduped.length > 0,
    has_reference_relative_problem: problem_findings.length > 0,
    has_uncontested_problem: problem_findings.some(
      (p) => p.basis_status === "UNCONTESTED_REFERENCE"
    ),
    has_reference_conflict: deduped.some((f) => f.kind === "REFERENCE_CONFLICT"),
    has_indeterminate_comparison: deduped.some(
      (f) =>
        f.basis_status === "INDETERMINATE" ||
        f.kind === "UNSUPPORTED_REFERENCE_COMPARISON" ||
        f.kind === "CURRENT_STATE_MISSING"
    ),
  };
}

export function assessNormativeSituation(
  projectState: ProjectState,
  situationQuery: SituationQuery
): NormativeDiscoveryAssessment {
  const situation = buildSituation(projectState, situationQuery);
  return assessNormativeDiscovery(
    projectState,
    situationQuery.subjectId,
    situationQuery.at,
    { situationKey: situation.key }
  );
}
