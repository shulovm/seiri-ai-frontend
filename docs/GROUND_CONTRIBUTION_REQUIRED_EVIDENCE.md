# Contribution / Binding required evidence

## Adopted boundary and owner

Human decision A authorizes required dimensions, correct operand binding, coverage
and exact upstream canonical state reporting. It does not authorize decisiveness.
The owner is the existing GROUND-133 Observation-Context Binding, whose identity
contains candidate, need, capability requirement set, resource requirement and
resource declaration. This does not borrow Capability Requirement as a new subject.
GROUND-159 already deduplicates this Binding across evaluation instants and discards
current contribution quantities when identifying its Binding-owned policy subject.
The current target is one explicitly supplied Contribution context under that Binding,
plus an explicit Availability Evidence Contract reference when availability is used.
No proposition P, consumer entity, readiness decision or social authority is created.

Evidence: observation-context-binding-types.ts (133); capacity-relation-interpretation-
policy-core.ts (159, stable Binding subject collection); capability-evaluation-dimension-
policy-core.ts (061, pattern only); required-dimension-coverage modules (062/118).
These files are in ground-core/reality with their existing full domain prefixes.

## Declaration and identity

`declareContributionRequiredEvidence` takes an existing canonical Binding and an
explicit runtime specification naming that Binding and its required dimensions.
Only the specification declares requiredness. Identity includes the full stable
Binding context and a normalized, deduplicated required set. No current quantity,
contribution declaration, evaluation instant or evidence state enters that identity.
Changing the required set changes identity. Current evaluation target updates do not.
This does not change the existing Applicability declaration's contribution identity.

The exact axes are CAPACITY_COMPATIBILITY (169 retained through 177),
REQUIRED_AMOUNT_COMPATIBILITY (175 retained through 177), and AVAILABILITY_EVIDENCE
(187 through explicit Applicability/reference resolution). Quantity is not a scalar
fourth axis. Unknown dimension names are rejected; future axes require their own
canonical authority. An explicit empty set is represented as such; absence of a
specification is rejected. No default all-required set, cardinality, precedence or
conflicting-declarer resolution is added.

## Independent operands and coverage

`assessContributionRequiredEvidence` accepts independent 177 and availability
reference operands. It never tests whether a whole composition exists. Quantity
coverage can therefore remain represented when availability cannot form a reference.
Conversely an existing explicit availability reference can be reported when the
current quantity operand is absent. The current Contribution context must belong
to the declaration's Binding. Quantity must match every context identity component,
including contribution declaration and exact evaluation instant.

Availability must match the explicitly selected stable contract and Contribution
context, and pass the existing reference resolver's lineage checks. This is reference
validation, not execution of 187's evaluator or its upstream policies. Wrong-context
or wrong-contract operands do not represent a required dimension. Corrupted
identities/lineage are rejected. No contract is inferred from absence. Multiple
contracts are not selected, ranked or aggregated by this layer.

For each required dimension, coverage is REPRESENTED or NOT_REPRESENTED. A represented
operand retains the exact upstream object/key/value. Canonical applicable/resolved/
unresolved predicates are delegated to 169, 175 or 187; no polarity is recomputed
from source declarations or category labels. NOT_APPLICABLE remains covered and
neither resolved nor unresolved where upstream says so. Missing operands have null
operand/classification, not a fabricated unresolved state. Required amount NA that
prevents an upstream 177 state from existing is not synthesized into a new 177 state.

Counts describe required, represented, not represented, canonically resolved,
canonically unresolved and canonically not-applicable required dimensions only.
Optional dimensions cannot increase these counts. There is no overall boolean,
sufficiency, decisiveness or proposition result, even with all dimensions resolved.

## Explicit exclusions

No effective/free quantity, effective availability, reservation subtraction,
allocation, consumption, deliverability, actual contribution verification,
requirement satisfaction, Resource Ready, feasibility verdict, can_execute,
execution, cross-binding aggregation, substitution, source trust ranking, majority
vote or latest-wins. Canonical runtime producers 133/159/169/175/177/187 and the
existing applicability/composition remain unchanged. Schema remains 0.1.24.

## Verification

32 focused tests cover polarity, precise unresolved causes, capacity NOT_APPLICABLE,
absence, optional dimensions, null composition, all quantity context components,
contract selection, lineage integrity, stable declaration updates, set identity,
empty declarations and no proposition verdict. The legacy storage exclusion test
now checks actual Git ignore behavior for both projects and scratch; its former
literal-path assertion did not recognize the stronger existing storage-wide rule.
Full regression: 3,754 pass, zero failures/skips. Typecheck and build pass.
Schema: 0.1.24. Existing canonical runtime producers and schemas are unchanged.
