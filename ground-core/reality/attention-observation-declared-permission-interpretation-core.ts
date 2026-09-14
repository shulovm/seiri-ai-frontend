/**
 * Reality Core v0.7 — Attention Observation Declared Permission Interpretation
 * Basis (GROUND-090).
 *
 * Pure composition of:
 *   GROUND-088 Current Observation-Context Declared Permission Assessment
 *   GROUND-089 Explicit Declared Permission Interpretation Policy
 *
 * Answers only whether the exact current raw declared-Permission status has an
 * exact explicitly declared interpretation mapping for the exact binding.
 *
 * Must not import GROUND-024 Permission evaluator, GROUND-087 binding core,
 * GROUND-083–085, or ProjectState.
 *
 * Forbidden: wall-clock, Permission governance, Feasibility, Decision,
 * Operational Eligibility, Permission State emission.
 *
 * Interpretation Basis ≠ Permission State
 * INTERPRET_AS_* ≠ currently permitted / prohibited
 * policy absent ≠ no mapping
 * explicit empty policy → NO_MAPPING
 * CONTESTED mapping ≠ declaration winner
 * no default open/closed-world / PERMIT/PROHIBIT mappings
 * multiple binding Bases remain independent
 */

import type {
  AttentionCandidateObservationDeclaredPermissionAssessment,
  AttentionObservationDeclaredPermissionAssessmentSet,
  AttentionObservationDeclaredPermissionBindingAssessment,
} from "./attention-observation-declared-permission-assessment-types.js";
import type {
  AttentionCandidateObservationDeclaredPermissionInterpretationPolicyAssessment,
  AttentionObservationDeclaredPermissionInterpretation,
  AttentionObservationDeclaredPermissionInterpretationMapping,
  AttentionObservationDeclaredPermissionInterpretationPolicy,
  AttentionObservationDeclaredPermissionInterpretationPolicyBindingAssessment,
  AttentionObservationDeclaredPermissionInterpretationPolicySetAssessment,
} from "./attention-observation-declared-permission-interpretation-policy-types.js";
import type { DeclaredInterventionPermissionStatus } from "./permission-types.js";
import type {
  AttentionCandidateObservationDeclaredPermissionInterpretationAssessment,
  AttentionObservationDeclaredPermissionInterpretationBasis,
  AttentionObservationDeclaredPermissionInterpretationBindingAssessment,
  AttentionObservationDeclaredPermissionInterpretationBindingStatus,
  AttentionObservationDeclaredPermissionInterpretationInput,
  AttentionObservationDeclaredPermissionInterpretationModelLimitation,
  AttentionObservationDeclaredPermissionInterpretationSetAssessment,
  AttentionObservationDeclaredPermissionInterpretationStatus,
} from "./attention-observation-declared-permission-interpretation-types.js";

export const ATTENTION_OBSERVATION_DECLARED_PERMISSION_INTERPRETATION_MODEL_LIMITATIONS: AttentionObservationDeclaredPermissionInterpretationModelLimitation[] =
  [
    "PERMISSION_CURRENT_STATE_NOT_MODELED",
    "PERMISSION_EFFECTIVE_STATE_NOT_MODELED",
    "PERMISSION_INTERPRETATION_POLICY_COMPLETENESS_NOT_MODELED",
    "PERMISSION_INTERPRETATION_DEFAULTS_NOT_MODELED",
    "PERMISSION_DECLARATION_LEVEL_CONFLICT_RESOLUTION_NOT_MODELED",
    "PERMISSION_AUTHORITY_PRECEDENCE_NOT_MODELED",
    "PERMISSION_RECENCY_PRECEDENCE_NOT_MODELED",
    "PERMISSION_MULTIPLE_BINDING_COMPOSITION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_SOURCE_BRIDGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_RESOLUTION_CLASSIFICATION_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_ACCEPTANCE_CRITERIA_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_COVERAGE_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_PERMISSION_OUTCOME_NOT_MODELED",
    "OPERATIONAL_ELIGIBILITY_COMPOSITION_NOT_MODELED",
    "EFFECTIVE_CAPABILITY_NOT_MODELED",
    "CAN_EXECUTE_NOT_MODELED",
    "OBSERVER_ASSIGNMENT_NOT_MODELED",
    "OBSERVER_SELECTION_NOT_MODELED",
    "EXECUTION_NOT_MODELED",
  ];

const CONTEXT_MISMATCH_PREFIX =
  "Observation-Context Declared Permission Assessment set and Declared Permission Interpretation Policy set do not share the same Permission Observation-Context Binding context";

export function attentionObservationDeclaredPermissionInterpretationBasisKey(
  candidateKey: string,
  observationNeedKey: string,
  capabilityRequirementSetKey: string,
  permissionContextBindingKey: string,
  currentDeclaredPermissionAssessmentKey: string,
  declaredPermissionInterpretationPolicyKey: string,
  currentDeclaredPermissionStatus: DeclaredInterventionPermissionStatus,
  interpretation: AttentionObservationDeclaredPermissionInterpretation
): string {
  return [
    "attention-observation-declared-permission-interpretation-basis",
    candidateKey,
    observationNeedKey,
    capabilityRequirementSetKey,
    permissionContextBindingKey,
    currentDeclaredPermissionAssessmentKey,
    declaredPermissionInterpretationPolicyKey,
    currentDeclaredPermissionStatus,
    interpretation,
  ].join("|");
}

/**
 * Exact current raw-status mapping lookup.
 * At most one mapping per status (089 invariant); multiplicity rejects.
 * No fuzzy / wildcard / fallback matching.
 */
export function findExactDeclaredPermissionInterpretationMapping(
  mappings: readonly AttentionObservationDeclaredPermissionInterpretationMapping[],
  currentStatus: DeclaredInterventionPermissionStatus
): AttentionObservationDeclaredPermissionInterpretationMapping | null {
  let found: AttentionObservationDeclaredPermissionInterpretationMapping | null =
    null;

  for (const mapping of mappings) {
    if (mapping.declared_permission_status === currentStatus) {
      if (found !== null) {
        throw new Error(
          `Declared Permission Interpretation mapping multiplicity invariant violated for status ${currentStatus}`
        );
      }
      found = mapping;
    }
  }

  return found;
}

function assertAlignedBindingPair(
  permissionAssessment: AttentionObservationDeclaredPermissionBindingAssessment,
  policyAssessment: AttentionObservationDeclaredPermissionInterpretationPolicyBindingAssessment
): void {
  if (
    permissionAssessment.permission_context_binding_key !==
    policyAssessment.permission_context_binding_key
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: binding key mismatch (${permissionAssessment.permission_context_binding_key} vs ${policyAssessment.permission_context_binding_key})`
    );
  }

  if (permissionAssessment.candidate_key !== policyAssessment.candidate_key) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: Candidate key mismatch for binding ${permissionAssessment.permission_context_binding_key}`
    );
  }

  if (
    permissionAssessment.observation_need_key !==
    policyAssessment.observation_need_key
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: ObservationNeed key mismatch for binding ${permissionAssessment.permission_context_binding_key}`
    );
  }

  if (
    permissionAssessment.capability_requirement_set_key !==
    policyAssessment.capability_requirement_set_key
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: Requirement-set key mismatch for binding ${permissionAssessment.permission_context_binding_key}`
    );
  }

  if (
    permissionAssessment.permission_actor_entity_id !==
    policyAssessment.permission_actor_entity_id
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: permission actor mismatch for binding ${permissionAssessment.permission_context_binding_key}`
    );
  }

  if (
    permissionAssessment.permission_intervention_id !==
    policyAssessment.permission_intervention_id
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: permission intervention mismatch for binding ${permissionAssessment.permission_context_binding_key}`
    );
  }
}

function assertBindingInterpretationInvariant(
  assessment: AttentionObservationDeclaredPermissionInterpretationBindingAssessment
): void {
  if (
    assessment.status === "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT" &&
    assessment.interpretation_basis === null
  ) {
    throw new Error(
      `Declared Permission Interpretation Basis invariant violated: PRESENT requires non-null basis for binding ${assessment.permission_context_binding_key}`
    );
  }

  if (
    assessment.status !== "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT" &&
    assessment.interpretation_basis !== null
  ) {
    throw new Error(
      `Declared Permission Interpretation Basis invariant violated: non-present status requires null basis for binding ${assessment.permission_context_binding_key}`
    );
  }

  const expectedHasBasis =
    assessment.status === "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT";
  if (
    assessment.has_declared_permission_interpretation_basis !== expectedHasBasis
  ) {
    throw new Error(
      `Declared Permission Interpretation Basis invariant violated: has_declared_permission_interpretation_basis mismatch for binding ${assessment.permission_context_binding_key}`
    );
  }
}

function assertCandidateInterpretationInvariant(
  assessment: AttentionCandidateObservationDeclaredPermissionInterpretationAssessment
): void {
  const expectedHasBases = assessment.binding_interpretation_assessments.some(
    (b) => b.has_declared_permission_interpretation_basis
  );
  if (
    assessment.has_declared_permission_interpretation_bases !== expectedHasBases
  ) {
    throw new Error(
      `Declared Permission Interpretation Basis invariant violated: candidate has_declared_permission_interpretation_bases mismatch for ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status !== "DECLARED_PERMISSION_INTERPRETATION_ASSESSMENTS_PRESENT" &&
    assessment.binding_interpretation_assessments.length !== 0
  ) {
    throw new Error(
      `Declared Permission Interpretation Basis invariant violated: non-present candidate status requires empty binding assessments for ${assessment.candidate_key}`
    );
  }

  if (
    assessment.status === "DECLARED_PERMISSION_INTERPRETATION_ASSESSMENTS_PRESENT" &&
    assessment.binding_interpretation_assessments.length === 0
  ) {
    throw new Error(
      `Declared Permission Interpretation Basis invariant violated: ASSESSMENTS_PRESENT requires non-empty binding assessments for ${assessment.candidate_key}`
    );
  }
}

function buildInterpretationBasis(
  permissionAssessment: AttentionObservationDeclaredPermissionBindingAssessment,
  policy: AttentionObservationDeclaredPermissionInterpretationPolicy,
  matchedMapping: AttentionObservationDeclaredPermissionInterpretationMapping
): AttentionObservationDeclaredPermissionInterpretationBasis {
  const currentStatus = permissionAssessment.declared_permission_status;
  const interpretation = matchedMapping.interpretation;

  if (matchedMapping.declared_permission_status !== currentStatus) {
    throw new Error(
      `Declared Permission Interpretation Basis invariant violated: matched mapping status ${matchedMapping.declared_permission_status} does not equal current status ${currentStatus}`
    );
  }

  if (
    interpretation !== "INTERPRET_AS_PERMISSION_PERMITTED" &&
    interpretation !== "INTERPRET_AS_PERMISSION_PROHIBITED"
  ) {
    throw new Error(
      `Unknown Declared Permission Interpretation: ${String(interpretation)}`
    );
  }

  if (policy.key.length === 0) {
    throw new Error(
      `Declared Permission Interpretation Basis invariant violated: missing policy key for binding ${permissionAssessment.permission_context_binding_key}`
    );
  }

  return {
    key: attentionObservationDeclaredPermissionInterpretationBasisKey(
      permissionAssessment.candidate_key,
      permissionAssessment.observation_need_key,
      permissionAssessment.capability_requirement_set_key,
      permissionAssessment.permission_context_binding_key,
      permissionAssessment.key,
      policy.key,
      currentStatus,
      interpretation
    ),
    candidate_key: permissionAssessment.candidate_key,
    observation_need_key: permissionAssessment.observation_need_key,
    capability_requirement_set_key:
      permissionAssessment.capability_requirement_set_key,
    permission_context_binding_key:
      permissionAssessment.permission_context_binding_key,
    current_declared_permission_assessment_key: permissionAssessment.key,
    permission_evaluation_at: permissionAssessment.permission_evaluation_at,
    current_declared_permission_status: currentStatus,
    declared_permission_interpretation_policy_key: policy.key,
    matched_mapping: {
      declared_permission_status: matchedMapping.declared_permission_status,
      interpretation: matchedMapping.interpretation,
    },
    interpretation,
  };
}

/**
 * Pure per-binding Declared Permission Interpretation Basis assessment.
 *
 * Precedence:
 * 1. NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED
 * 2. NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS
 * 3. DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT
 */
export function assessAttentionObservationDeclaredPermissionInterpretationBinding(
  permissionAssessment: AttentionObservationDeclaredPermissionBindingAssessment,
  policyAssessment: AttentionObservationDeclaredPermissionInterpretationPolicyBindingAssessment
): AttentionObservationDeclaredPermissionInterpretationBindingAssessment {
  assertAlignedBindingPair(permissionAssessment, policyAssessment);

  const wrap = (
    status: AttentionObservationDeclaredPermissionInterpretationBindingStatus,
    interpretation_basis: AttentionObservationDeclaredPermissionInterpretationBasis | null
  ): AttentionObservationDeclaredPermissionInterpretationBindingAssessment => {
    const assessment: AttentionObservationDeclaredPermissionInterpretationBindingAssessment =
      {
        permission_context_binding_key:
          permissionAssessment.permission_context_binding_key,
        declared_permission_binding_assessment: permissionAssessment,
        declared_permission_interpretation_policy_assessment: policyAssessment,
        status,
        interpretation_basis,
        has_declared_permission_interpretation_basis:
          status === "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT",
      };
    assertBindingInterpretationInvariant(assessment);
    return assessment;
  };

  if (
    policyAssessment.status ===
    "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED"
  ) {
    if (policyAssessment.declared_permission_interpretation_policy !== null) {
      throw new Error(
        `Declared Permission Interpretation Policy invariant violated: NO_POLICY requires null policy for binding ${policyAssessment.permission_context_binding_key}`
      );
    }
    return wrap(
      "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_DECLARED",
      null
    );
  }

  if (
    policyAssessment.status !==
      "EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_POLICY_PRESENT" ||
    policyAssessment.declared_permission_interpretation_policy === null
  ) {
    throw new Error(
      `Declared Permission Interpretation Policy invariant violated: unexpected policy assessment status for binding ${policyAssessment.permission_context_binding_key}`
    );
  }

  const policy = policyAssessment.declared_permission_interpretation_policy;

  if (
    policy.permission_context_binding_key !==
    permissionAssessment.permission_context_binding_key
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: policy attachment mismatch for binding ${permissionAssessment.permission_context_binding_key}`
    );
  }

  const matched = findExactDeclaredPermissionInterpretationMapping(
    policy.mappings,
    permissionAssessment.declared_permission_status
  );

  if (matched === null) {
    return wrap(
      "NO_EXPLICIT_DECLARED_PERMISSION_INTERPRETATION_MAPPING_FOR_CURRENT_RAW_STATUS",
      null
    );
  }

  return wrap(
    "DECLARED_PERMISSION_INTERPRETATION_BASIS_PRESENT",
    buildInterpretationBasis(permissionAssessment, policy, matched)
  );
}

function joinPresentBindingAssessments(
  permissionCandidate: AttentionCandidateObservationDeclaredPermissionAssessment,
  policyCandidate: AttentionCandidateObservationDeclaredPermissionInterpretationPolicyAssessment
): AttentionObservationDeclaredPermissionInterpretationBindingAssessment[] {
  const permissionBindings =
    permissionCandidate.declared_permission_binding_assessments;
  const policyBindings = policyCandidate.binding_policy_assessments;

  if (permissionBindings.length !== policyBindings.length) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: binding assessment count mismatch for candidate ${permissionCandidate.candidate_key}`
    );
  }

  const policyByKey = new Map(
    policyBindings.map((b) => [b.permission_context_binding_key, b])
  );

  if (policyByKey.size !== policyBindings.length) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: duplicate policy binding assessment keys for candidate ${permissionCandidate.candidate_key}`
    );
  }

  const seen = new Set<string>();
  const joined: AttentionObservationDeclaredPermissionInterpretationBindingAssessment[] =
    [];

  for (const permissionBinding of permissionBindings) {
    const key = permissionBinding.permission_context_binding_key;
    if (seen.has(key)) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: duplicate declared-permission binding assessment keys for candidate ${permissionCandidate.candidate_key}`
      );
    }
    seen.add(key);

    const policyBinding = policyByKey.get(key);
    if (!policyBinding) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing Declared Permission Interpretation Policy binding assessment for binding ${key}`
      );
    }

    joined.push(
      assessAttentionObservationDeclaredPermissionInterpretationBinding(
        permissionBinding,
        policyBinding
      )
    );
  }

  for (const policyBinding of policyBindings) {
    if (!seen.has(policyBinding.permission_context_binding_key)) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: extra Declared Permission Interpretation Policy binding assessment for binding ${policyBinding.permission_context_binding_key}`
      );
    }
  }

  return joined;
}

/**
 * Pure per-AttentionCandidate Declared Permission Interpretation Basis assessment.
 *
 * Precedence:
 * 1. NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS
 * 2. NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS
 * 3. NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED
 * 4. NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED
 * 5. DECLARED_PERMISSION_INTERPRETATION_ASSESSMENTS_PRESENT
 */
export function assessAttentionCandidateObservationDeclaredPermissionInterpretation(
  permissionAssessment: AttentionCandidateObservationDeclaredPermissionAssessment,
  policyAssessment: AttentionCandidateObservationDeclaredPermissionInterpretationPolicyAssessment
): AttentionCandidateObservationDeclaredPermissionInterpretationAssessment {
  const candidate_key = permissionAssessment.candidate_key;

  if (candidate_key !== policyAssessment.candidate_key) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: AttentionCandidate key mismatch (${candidate_key} vs ${policyAssessment.candidate_key})`
    );
  }

  const wrap = (
    status: AttentionObservationDeclaredPermissionInterpretationStatus,
    binding_interpretation_assessments: AttentionObservationDeclaredPermissionInterpretationBindingAssessment[]
  ): AttentionCandidateObservationDeclaredPermissionInterpretationAssessment => {
    const assessment: AttentionCandidateObservationDeclaredPermissionInterpretationAssessment =
      {
        candidate_key,
        declared_permission_assessment: permissionAssessment,
        declared_permission_interpretation_policy_assessment: policyAssessment,
        status,
        binding_interpretation_assessments,
        has_declared_permission_interpretation_bases:
          binding_interpretation_assessments.some(
            (b) => b.has_declared_permission_interpretation_basis
          ),
        model_limitations: [
          ...ATTENTION_OBSERVATION_DECLARED_PERMISSION_INTERPRETATION_MODEL_LIMITATIONS,
        ],
      };
    assertCandidateInterpretationInvariant(assessment);
    return assessment;
  };

  if (
    permissionAssessment.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS" ||
    policyAssessment.status === "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
  ) {
    return wrap("NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS", []);
  }

  if (
    permissionAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS" ||
    policyAssessment.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
  ) {
    return wrap("NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS", []);
  }

  if (
    permissionAssessment.status ===
    "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
  ) {
    return wrap(
      "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED",
      []
    );
  }

  if (
    permissionAssessment.status ===
    "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED"
  ) {
    // Policies may already exist (089), but no current raw assessment → no Basis.
    return wrap("NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED", []);
  }

  if (
    permissionAssessment.status !==
    "OBSERVATION_CONTEXT_DECLARED_PERMISSION_ASSESSMENTS_PRESENT"
  ) {
    throw new Error(
      `Declared Permission Interpretation Basis invariant violated: unexpected declared-permission assessment status ${permissionAssessment.status} for candidate ${candidate_key}`
    );
  }

  if (
    policyAssessment.status !==
    "DECLARED_PERMISSION_INTERPRETATION_POLICY_ASSESSMENTS_PRESENT"
  ) {
    throw new Error(
      `${CONTEXT_MISMATCH_PREFIX}: expected Declared Permission Interpretation Policy assessments present for candidate ${candidate_key}, got ${policyAssessment.status}`
    );
  }

  const binding_interpretation_assessments = joinPresentBindingAssessments(
    permissionAssessment,
    policyAssessment
  );

  return wrap(
    "DECLARED_PERMISSION_INTERPRETATION_ASSESSMENTS_PRESENT",
    binding_interpretation_assessments
  );
}

export function assertCompatibleDeclaredPermissionInterpretationContexts(
  permissionAssessmentSet: AttentionObservationDeclaredPermissionAssessmentSet,
  interpretationPolicySet: AttentionObservationDeclaredPermissionInterpretationPolicySetAssessment
): void {
  const permissionCandidates = permissionAssessmentSet.candidate_assessments;
  const policyCandidates = interpretationPolicySet.candidate_assessments;

  if (permissionCandidates.length !== policyCandidates.length) {
    throw new Error(`${CONTEXT_MISMATCH_PREFIX}: candidate count mismatch`);
  }

  const policyByKey = new Map(
    policyCandidates.map((c) => [c.candidate_key, c])
  );

  for (const permissionCandidate of permissionCandidates) {
    const policyCandidate = policyByKey.get(permissionCandidate.candidate_key);
    if (!policyCandidate) {
      throw new Error(
        `${CONTEXT_MISMATCH_PREFIX}: missing candidate ${permissionCandidate.candidate_key}`
      );
    }

    const permissionPresent =
      permissionCandidate.status ===
      "OBSERVATION_CONTEXT_DECLARED_PERMISSION_ASSESSMENTS_PRESENT";

    if (permissionPresent) {
      if (
        policyCandidate.status !==
        "DECLARED_PERMISSION_INTERPRETATION_POLICY_ASSESSMENTS_PRESENT"
      ) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: policy assessments missing while declared-permission assessments present for candidate ${permissionCandidate.candidate_key}`
        );
      }
      // Cardinality / key join validated in joinPresentBindingAssessments.
      continue;
    }

    if (
      permissionCandidate.status ===
      "NOT_APPLICABLE_NO_OBSERVATION_PLANNING_BASIS"
    ) {
      if (
        policyCandidate.status ===
          "DECLARED_PERMISSION_INTERPRETATION_POLICY_ASSESSMENTS_PRESENT" ||
        policyCandidate.status ===
          "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
      ) {
        // Policy side must also be non-domain / non-binding for planning N/A.
        // Allow Requirements N/A or planning N/A on policy side only.
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: planning-basis mismatch for candidate ${permissionCandidate.candidate_key}`
        );
      }
      continue;
    }

    if (
      permissionCandidate.status ===
      "NOT_APPLICABLE_NO_EXPLICIT_CAPABILITY_REQUIREMENTS"
    ) {
      if (
        policyCandidate.status ===
          "DECLARED_PERMISSION_INTERPRETATION_POLICY_ASSESSMENTS_PRESENT" ||
        policyCandidate.status ===
          "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
      ) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: Requirements-domain mismatch for candidate ${permissionCandidate.candidate_key}`
        );
      }
      continue;
    }

    if (
      permissionCandidate.status ===
      "NO_EXPLICIT_PERMISSION_OBSERVATION_CONTEXT_BINDINGS_DECLARED"
    ) {
      if (
        policyCandidate.status ===
        "DECLARED_PERMISSION_INTERPRETATION_POLICY_ASSESSMENTS_PRESENT"
      ) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: bindings-domain mismatch for candidate ${permissionCandidate.candidate_key}`
        );
      }
      continue;
    }

    if (
      permissionCandidate.status ===
      "NO_EXPLICIT_PERMISSION_EVALUATION_INSTANT_DECLARED"
    ) {
      // Bindings exist; policies may already exist before an evaluation instant.
      if (
        policyCandidate.status !==
        "DECLARED_PERMISSION_INTERPRETATION_POLICY_ASSESSMENTS_PRESENT"
      ) {
        throw new Error(
          `${CONTEXT_MISMATCH_PREFIX}: evaluation-instant / policy domain mismatch for candidate ${permissionCandidate.candidate_key}`
        );
      }
    }
  }
}

function hasAnyCandidateInterpretationBasis(
  assessments: AttentionCandidateObservationDeclaredPermissionInterpretationAssessment[]
): boolean {
  for (const assessment of assessments) {
    if (assessment.has_declared_permission_interpretation_bases) {
      return true;
    }
  }
  return false;
}

/**
 * Pure set-level Declared Permission Interpretation Basis composition.
 * Does not emit current PERMISSION_PERMITTED / PERMISSION_PROHIBITED Permission State.
 */
export function buildAttentionObservationDeclaredPermissionInterpretationSet(
  input: AttentionObservationDeclaredPermissionInterpretationInput
): AttentionObservationDeclaredPermissionInterpretationSetAssessment {
  const permissionAssessmentSet = input.declared_permission_assessment_set;
  const interpretationPolicySet =
    input.declared_permission_interpretation_policy_set;

  assertCompatibleDeclaredPermissionInterpretationContexts(
    permissionAssessmentSet,
    interpretationPolicySet
  );

  const policyByKey = new Map(
    interpretationPolicySet.candidate_assessments.map((c) => [
      c.candidate_key,
      c,
    ])
  );

  const candidate_assessments =
    permissionAssessmentSet.candidate_assessments.map((permissionCandidate) => {
      const policyCandidate = policyByKey.get(
        permissionCandidate.candidate_key
      )!;
      return assessAttentionCandidateObservationDeclaredPermissionInterpretation(
        permissionCandidate,
        policyCandidate
      );
    });

  return {
    declared_permission_assessment_set: permissionAssessmentSet,
    declared_permission_interpretation_policy_set: interpretationPolicySet,
    candidate_assessments,
    has_declared_permission_interpretation_bases:
      hasAnyCandidateInterpretationBasis(candidate_assessments),
    model_limitations: [
      ...ATTENTION_OBSERVATION_DECLARED_PERMISSION_INTERPRETATION_MODEL_LIMITATIONS,
    ],
  };
}
