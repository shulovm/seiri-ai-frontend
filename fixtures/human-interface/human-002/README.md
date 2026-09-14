# HUMAN-002B — Immutable Reality Source Registry

The [registry manifest](../source-registry.json) is the single definition of source keys, fixture locations, hashes, stored/read schemas, proof scopes, origins, qualifications and limitations for the three comparison sources. New snapshots have source-specific README files; the existing HUMAN-001 fixture and manifest remain unchanged.

Each fixture preserves the complete original saved ProjectState bytes. No generator was rerun, no record added or removed, and no normalized state written back. Historical experimental sidecars and original checkout/tmp paths are documentation, never runtime authority or fallback locations.

Source qualification is fixture/transport metadata only. `controlled-experiment-canonical-snapshot` identifies E2 B15's declared controlled origin; it does not imply trust, warning, confidence or real-world verification. Historical replay qualification does not establish historical truth or source authority. Qualifications are never inserted into ProjectState.

The server-only source registry uniquely maps a registered project ID to one immutable snapshot. Duplicate project IDs or source keys reject registry construction. Unknown projects never call the byte reader. Every read verifies SHA-256 before parsing and uses only existing core normalization and validation, checks project/candidate identity and stored/read schemas, then returns one state with separate source metadata. Corruption or missing sources never trigger search, fallback, merging or writeback.

This foundation is not imported by the existing HTTP adapter. HTTP and React remain HUMAN-001-only. HUMAN-002C may explicitly connect registered source selection to the existing read boundary while preserving one snapshot per request, query/method restrictions and metadata separation. No generalized read contract or new read scope is implemented here.

## Verification

Run `node --import tsx --test server/human-interface/source-registry.test.ts server/human-interface/read-boundary.test.ts server/human-interface/ui.test.tsx`, `node_modules/.bin/tsc -p server/human-interface/tsconfig.json`, and `npm run build` from the repo root.

Verification expectations are test metadata, not canonical semantics:

- HUMAN-001: Event/State/Observation 0, Claim 1, unique linked Evidence 1, link 1; existing adapter results unchanged.
- E2 B15: Event 1, State 2, Observation 2, Claim 0, worldline entries 4, unplaced events 0; original bounded/open-ended State intervals retained. Project Evidence 1 and links 0: the claim-linked path returns no Evidence, without declaring project Evidence absent.
- Historical Round 4 candidate: Event/State/Observation 0, Claim 23, links 23, unique linked Evidence 1.

The existing core-test baseline (3,753 PASS / 104 FAIL) is unchanged and is not repaired by this checkpoint. No project-level Evidence search, Observation-to-Evidence expansion, provenance Entity expansion or domain-specific interpretation is introduced.
