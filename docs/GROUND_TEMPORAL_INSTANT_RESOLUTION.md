# Exact temporal resolution and read-model identity

## Adopted decisions

Timestamp spelling is declaration data, not instant identity. Equivalent ordinary
instants must compare equally and contribute the same temporal identity. Declared
text is retained. Schema-valid leap-second declarations are not resolved without
an explicit leap-second authority. No calendar is introduced. Worldline's existing
boolean/array contracts are retained: required temporal non-resolution throws a
dedicated error, never a domain verdict or an apparently complete partial result.

## Timestamp census and scope

The audited Reality paths consume these actual instant fields:

- Worldline occurrence/validity and recording-time ordering; Situation event windows.
- Claim applicability, Reference/Objective/requirement validity, Governance,
  Capability declarations/verification/availability, Resource declarations,
  Intervention and Permission applicability.
- Runtime required windows and Authority/Permission/Resource evaluation instants.
- Contribution context, 155/169/175/177 and 179–187 current evidence lineage,
  Applicability exact-context matching, and Binding-required evidence inputs.
- Decision capture/selection times, Commitment/Acceptance/Resource Commitment,
  reservation creation and windows, declared deadline terms, projected instants
  and estimate ordering. These remain declarations/evidence, not execution facts.

All these consumers now share ground-core/temporal.ts for instant comparison/key
contributions. Temporal normalization is confined to instant-valued operations.
Opaque identifiers, date-looking predicate values, condition_key, criterion bodies,
source/provenance text and persistent UUIDs are not parsed opportunistically.
No local civil-time or date-only canonical consumer was substituted into this helper.

## Resolution representation

resolveTemporalInstant returns RESOLVED with an exact instant, UNRESOLVED with
LEAP_SECOND_AUTHORITY_NOT_AVAILABLE and the original declaration, or INVALID with
INVALID_TIMESTAMP_SYNTAX. The latter is syntactic failure, not absent authority.

Syntax uses the installed ajv-formats full date-time validator also used by the
schema validator. Its actual accepted forms, including fractional precision,
offset spelling, lowercase separators and its accepted space separator, are not
silently narrowed to JavaScript Date syntax. The existing evaluation-specification
regexes retain their syntax checks but no longer impose a nine-digit fractional cap.

Ordinary dates use Gregorian integer day/offset arithmetic. Fractions retain every
decimal digit and compare by zero-padded decimal strings. Only trailing zeros are
semantically insignificant. No Date/Date.parse, floating seconds or millisecond
conversion is used as instant authority. Canonical key spelling uses UTC and at
least three fractional digits, preserving ordinary legacy .000Z keys. Offset
rollover beyond the four-digit declared year domain is represented in identity
with a signed extended year; it is a key contribution, not a rewritten declaration.

## Error boundary and lazy evaluation

requireTemporalInstant/temporalInstantKey/compareTemporalInstants are strict
consumption adapters over the explicit resolution result. TemporalResolutionError
extends GroundCoreError, with a distinct code and structured declaration, operation
and reason. Invalid syntax uses the existing ValidationError convention.

Worldline queries resolve the query instant even with no matching States. They
abort if a required State comparison cannot resolve time. They do not return a
partial State list. Reference, Objective and other synchronous callers propagate
the error; no catch converts it into NO_CURRENT_STATE or another domain result.
Unrelated stored timestamps are not eagerly inspected. An upper bound need not be
resolved after a lower-bound comparison already proves the State not yet active.
Timeline placement and chronology require resolved instants; source timestamps
remain in returned entries. Half-open [from, until) and null open ends are preserved.

## Identity and persistence audit

Temporal contributions in runtime keys and deduplication now use canonical instant
identity. This intentionally collapses representation-only differences. Non-temporal
identity components and explicit policy authorities are unchanged. Null/NONE/OPEN
remain absent-boundary markers, never fabricated timestamps. Grouping may retain
an original representative timestamp while comparing/deduplicating by its key.

Persisted declaration UUIDs and source timestamps are untouched. Decision snapshots
remain frozen: their basis references target canonical Objective/Reference/Scenario
IDs; option/actor identities do not acquire normalized timestamp components. This
unit introduces no stored-key rewrite, schema change or migration. Raw timestamp
checks for append-only declaration representation are not converted into permission
to rewrite the original declaration.

## Remaining write-side frontier

state-engine.ts has a distinct admission/invariant authority. assertStateInvariants
runs assertRealityInvariants and other whole-project checks on patch application;
some of those still compare interval boundaries lexically. Applying strict instant
resolution there blindly would also reject an unrelated patch when a stored
schema-valid leap declaration has an unresolved boundary. That would create eager
project-admission semantics beyond this read-model/error-consumption decision.

This write-side boundary remains for immediate post-checkpoint discovery. The
read-model correction does not claim that schema acceptance proves interval
well-formedness, or that all accepted declarations must be globally instant-resolved.

## Verification

Focused temporal/Worldline/Contribution/Applicability/Binding tests: 98 pass.
Full suite: 3,783 pass, zero failures/skips. Typecheck and build pass.
Schema remains 0.1.24; schema files and state-engine are unchanged.
The two existing tests using non-timestamp placeholders for a different evaluation
instant now use an actually different valid timestamp. No evidence polarity,
requiredness, coverage, readiness, satisfaction, quantity arithmetic or execution
policy was introduced.
