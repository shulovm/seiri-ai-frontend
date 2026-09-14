# Requirement identity component boundaries

## Recovered invariant and correction

GROUND-132 Resource Requirements preserve independent exact resource_key, unit,
scope, amount and temporal declarations within their declared context. Existing
Intervention requirements likewise group only equal Capability-name/scope or
Resource-name/unit/scope tuples. Delimiter concatenation violated those invariants:
(A|B, C) and (A, B|C) could collapse into one Resource Requirement. Valid Capability
names could similarly consume a scope delimiter and collapse a distinct scope.

The corrected identities use existing canonical JSON value serialization to retain
component and set-member boundaries. GROUND-132 internal deduplication, Requirement
keys and Requirement-set keys share the same exact component meaning. Structured
scope/amount values retain their union kind. Explicit empty sets remain distinct
from a member whose text happens to equal the empty-set marker. Temporal identity
continues to use the established strict instant authority.

Intervention Capability/Resource grouping and its Feasibility Basis related keys
use the same tuple boundary principle. This repairs false aggregation; it adds no
Capability or Resource matching rule, quantity arithmetic, satisfaction, readiness,
feasibility verdict, effective availability, reservation subtraction or execution.

## Identity consumers

The changed Requirement keys are runtime-only derived identities. Consumers match
opaque exact keys, not delimiter parsers. Callers must obtain keys from canonical
builders and rebuild dependent runtime specifications; old concatenated spellings
are not guessed or aliased to new tuples. This is not a migration of persisted
entity UUIDs. Previously recorded Decision snapshots and their historical
verification facts are not rewritten from current derived identities.

## Evidence

Five regression tests reproduce distinct requirements collapsing, false agreement
between conflicting declared sets, member-boundary/empty-marker collisions and
schema-valid persisted Resource/Capability grouping collisions. All fail before
the corresponding correction and pass after it. Existing scope/unit/amount/time
and explicit-empty invariants remain covered. Static dependency checks preserve
GROUND-132 isolation while allowing only the pure JSON identity helper.

Focused Requirement/Intervention/Feasibility Basis/Decision tests: 152 PASS.
Full suite: 3,839 PASS with zero failures or skips. Typecheck/build PASS.
Schema stays 0.1.25; schema/dependency files are unchanged in this checkpoint.


## Capability Requirement exact-set boundary

The GROUND-076/077 shared exact-set identity must preserve the membership
produced by GROUND-048. A capability semantic name may contain commas and other
requirement keys. Joining member keys with a comma made a singleton and a
two-member set share the same identity. The shared builder now uses the existing
canonical JSON tuple primitive for candidate, ObservationNeed, and sorted member
array. Ordering remains presentation-only; no new duplicate or empty-set policy
is introduced. Runtime references must be rebuilt with the canonical builder.
There is no persisted schema change or new satisfaction/selection authority.


## ObservationNeed and capability name boundary

Canonical Needs with predicates `condition` and `condition||x`, without a point
time, combined with capability names `x||inspect` and `inspect`, previously shared
a delimiter-concatenated pair identity. GROUND-048 normalization consequently
discarded one explicit declaration. The requirement builder now preserves the
Need/name tuple with canonical JSON; normalization reuses that same builder.
Existing duplicate semantics remain exact-pair deduplication. Source fields,
Need construction, ordering and requirement authority are unchanged. These derived
keys are runtime references and must be rebuilt, not parsed or migrated as stored
facts. The regression derives Needs through the canonical Question mapping and
passes both through Eligibility, Planning and Requirement normalization.
