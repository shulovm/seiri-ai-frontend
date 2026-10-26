import { constants, closeSync, fstatSync, lstatSync, openSync, readFileSync, realpathSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { createHumanRealityReader, type HumanRealityReadTransport } from './read-adapter.js';
import { PROVENANCE_BUNDLE_SHA256 } from './provenance-pin.js';
// All types below are transport/operations metadata, never canonical domain types.
type Json = any;
interface FilePin {
    sha256: string;
    origin: {
        kind: string;
        commit?: string;
        path?: string;
        blob?: string;
        identity?: string;
    };
}
interface PackagePin {
    commit: string;
    receipt: string;
    receipt_identity: string;
    manifest: string;
    package_metadata: string;
    package_fingerprint: string;
    package_fingerprint_kind: string;
    dataset_sha256: string;
    qualification: string;
}
interface Binding {
    project_id: string;
    entity_id: string;
    observation_id: string;
    expected_provenance: Json;
    observation_sha256: string;
    package_key: string;
    source_family: string;
    selected_input: string;
    source_id: string;
    report_id: string;
}
interface Manifest {
    format: string;
    files: Record<string, FilePin>;
    packages: Record<string, PackagePin>;
    bindings: Binding[];
}
export class ProvenanceSourceError extends Error {
    constructor(public readonly code: string, public readonly status = 503) { super(code); }
}
const fail = (code: string, status = 503): never => { throw new ProvenanceSourceError(code, status); };
const hash = (bytes: Buffer | string) => createHash('sha256').update(bytes).digest('hex');
const hex = (s: unknown, n = 64) => typeof s === 'string' && new RegExp(`^[a-f0-9]{${n}}$`).test(s);
const uuid = (s: unknown) => typeof s === 'string' && /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/.test(s);
// Same serialization used by the approved publication receipts; not a canonical identity.
export function publishedRecordHash(value: unknown) { return hash(stable(value)); }
function stable(value: Json): string {
    const sorted = (v: Json): Json => Array.isArray(v) ? v.map(sorted) : v !== null && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map(k => [k, sorted(v[k])])) : v;
    return JSON.stringify(sorted(value)) + '\n';
}
const same = (a: Json, b: Json) => stable(a) === stable(b);
function validPath(path: unknown): path is string { return typeof path === 'string' && /^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_.-]+)*\.json$/.test(path) && !path.split('/').some(s => s === '.' || s === '..'); }
function readContained(root: string, path: string): Buffer {
    if (!isAbsolute(root) || !validPath(path))
        return fail('PROVENANCE_PATH_REJECTED');
    const target = resolve(root, path);
    if (relative(root, target).startsWith('..' + sep))
        return fail('PROVENANCE_PATH_REJECTED');
    let fd: number | undefined;
    try {
        // Reject symlinked root ancestors as well as every artifact path component.
        let cursor = target;
        while (true) {
            if (lstatSync(cursor).isSymbolicLink())
                return fail('PROVENANCE_PATH_REJECTED');
            const parent = dirname(cursor);
            if (parent === cursor)
                break;
            cursor = parent;
        }
        if (realpathSync(target) !== target)
            return fail('PROVENANCE_PATH_REJECTED');
        const before = lstatSync(target);
        fd = openSync(target, constants.O_RDONLY | constants.O_NOFOLLOW);
        const stat = fstatSync(fd);
        if (stat.dev !== before.dev || stat.ino !== before.ino || realpathSync(target) !== target)
            return fail('PROVENANCE_PATH_REJECTED');
        if (!stat.isFile() || stat.size > 2 * 1024 * 1024)
            return fail('PROVENANCE_PATH_REJECTED');
        return readFileSync(fd);
    }
    catch (error) {
        if (error instanceof ProvenanceSourceError)
            throw error;
        return fail('PROVENANCE_SOURCE_UNAVAILABLE');
    }
    finally {
        if (fd !== undefined)
            closeSync(fd);
    }
}
function parse(bytes: Buffer, code: string): Json { try {
    return JSON.parse(bytes.toString('utf8'));
}
catch {
    return fail(code);
} }
function validateRegistry(m: Manifest) {
    const bad = () => fail('PROVENANCE_REGISTRY_INVALID');
    if (m?.format !== 'human-provenance-bundle.v1' || !m.files || !m.packages || !Array.isArray(m.bindings) || !m.bindings.length)
        bad();
    for (const [path, pin] of Object.entries(m.files))
        if (!validPath(path) || !hex(pin?.sha256) || !pin.origin)
            bad();
    for (const p of Object.values(m.packages)) {
        if (!hex(p.commit, 40) || !hex(p.package_fingerprint) || !hex(p.dataset_sha256) || !p.qualification || !p.receipt_identity || !['projection_implementation_sha256', 'file_map_sha256'].includes(p.package_fingerprint_kind))
            bad();
        for (const path of [p.receipt, p.manifest, p.package_metadata])
            if (!validPath(path) || !m.files[path])
                bad();
        if (m.files[p.receipt].origin.kind !== 'completed-operation' || m.files[p.receipt].origin.identity !== p.receipt_identity)
            bad();
        for (const path of [p.manifest, p.package_metadata])
            if (m.files[path].origin.kind !== 'git' || m.files[path].origin.commit !== p.commit || !hex(m.files[path].origin.blob, 40) || !m.files[path].origin.path)
                bad();
    }
    const keys = new Set<string>(), observations = new Set<string>();
    for (const b of m.bindings) {
        const p = m.packages[b.package_key], f = m.files[b.selected_input];
        if (!uuid(b.project_id) || !uuid(b.entity_id) || !uuid(b.observation_id) || !hex(b.observation_sha256) || !p || !f || !validPath(b.selected_input) || !b.source_id || !b.report_id || b.source_family !== 'historical-round1-inspection' || b.expected_provenance?.kind !== 'document' || typeof b.expected_provenance.external_id !== 'string' || typeof b.expected_provenance.label !== 'string')
            bad();
        if (f.origin.kind !== 'git' || f.origin.commit !== p.commit || !f.origin.path || !hex(f.origin.blob, 40))
            bad();
        const key = [b.project_id, b.entity_id, b.observation_id].join('/'), obs = [b.project_id, b.observation_id].join('/');
        if (keys.has(key) || observations.has(obs))
            fail('PROVENANCE_BINDING_AMBIGUOUS');
        keys.add(key);
        observations.add(obs);
    }
}
const defaultRoot = fileURLToPath(new URL('../../fixtures/human-interface/provenance/historical-round1-v1/', import.meta.url));
export function createProvenanceRegistry(root = defaultRoot, expectedHash = PROVENANCE_BUNDLE_SHA256) {
    if (!isAbsolute(root))
        fail('PROVENANCE_PATH_REJECTED');
    const manifest = () => { const bytes = readContained(resolve(root), 'manifest.json'); if (!hex(expectedHash) || hash(bytes) !== expectedHash)
        fail('PROVENANCE_MANIFEST_INTEGRITY_FAILURE'); const m = parse(bytes, 'PROVENANCE_REGISTRY_INVALID') as Manifest; try {
        validateRegistry(m);
    }
    catch (error) {
        if (error instanceof ProvenanceSourceError)
            throw error;
        fail('PROVENANCE_REGISTRY_INVALID');
    } return m; };
    manifest(); // Reject malformed/ambiguous registry at construction; no cross-endpoint initialization.
    return { read(projectId: string, entityId: string, observationId: string) {
            const m = manifest(); // Every request rechecks bytes; no old-valid cache or fallback.
            const b = m.bindings.find(x => x.project_id === projectId && x.entity_id === entityId && x.observation_id === observationId);
            if (!b)
                return fail('PROVENANCE_SOURCE_UNSUPPORTED', 422);
            const p = m.packages[b.package_key];
            const read = (path: string, code: string) => { const bytes = readContained(resolve(root), path); if (hash(bytes) !== m.files[path].sha256)
                fail(code); return { bytes, value: parse(bytes, code) }; };
            const receipt = read(p.receipt, 'PROVENANCE_RECEIPT_INTEGRITY_FAILURE').value;
            const selection = read(p.manifest, 'PROVENANCE_PACKAGE_INTEGRITY_FAILURE').value;
            const metadata = read(p.package_metadata, 'PROVENANCE_PACKAGE_INTEGRITY_FAILURE').value;
            const selected = read(b.selected_input, 'PROVENANCE_INPUT_INTEGRITY_FAILURE');
            const inputHash = m.files[b.selected_input].sha256;
            const receiptBad = () => fail('PROVENANCE_RECEIPT_BINDING_MISMATCH');
            const independent = receipt.independent_read_result ?? receipt.independent_read;
            if (!hex(receipt.after_fingerprint) || independent?.after_fingerprint !== receipt.after_fingerprint)
                receiptBad();
            if (b.package_key === '392') {
                if (receipt.status !== 'PUBLISHED_AND_INDEPENDENTLY_VERIFIED' || receipt.project_id !== b.project_id || receipt.semantic_package_commit !== p.commit || receipt.selected_input_sha256 !== inputHash || receipt.dataset_fingerprint !== p.dataset_sha256 || receipt.projection_implementation_fingerprint !== p.package_fingerprint || receipt.generated_ids?.observation !== b.observation_id || receipt.generated_ids?.document !== b.entity_id || receipt.record_hashes?.[b.observation_id] !== b.observation_sha256 || receipt.input_key !== b.report_id || receipt.source_id !== b.source_id || receipt.validation_result !== 'PASS' || receipt.publish_result?.result !== 'PASS' || receipt.independent_read_result?.result !== 'PASS')
                    receiptBad();
                if (selection.target_project_id !== b.project_id || selection.generated_ids?.observation !== b.observation_id || selection.generated_ids?.document !== b.entity_id || selection.selected_input_sha256 !== inputHash || selection.full_dataset_sha256 !== p.dataset_sha256 || selection.projection_sha256 !== p.package_fingerprint || selection.historical_input_key !== b.report_id || selection.source_id !== b.source_id)
                    fail('PROVENANCE_PACKAGE_BINDING_MISMATCH');
            }
            else {
                if (receipt.status !== 'COMPLETED' || receipt.package_commit !== p.commit || receipt.package_fingerprint !== p.package_fingerprint || receipt.dataset_hash !== p.dataset_sha256 || receipt.independent_read?.result !== 'PASS')
                    receiptBad();
                if (metadata.package_sha256 !== p.package_fingerprint || hash(stable(metadata.files)) !== p.package_fingerprint || metadata.files?.[b.selected_input.split('/').at(-1)!] !== inputHash || metadata.files?.['../../experimental/historical-reality/round1.dataset.json'] !== p.dataset_sha256)
                    fail('PROVENANCE_PACKAGE_BINDING_MISMATCH');
                if (selection.dataset_sha256 !== p.dataset_sha256)
                    fail('PROVENANCE_PACKAGE_BINDING_MISMATCH');
                if (b.package_key === '004') {
                    const row = selection.selections?.find((x: Json) => x.report === b.report_id);
                    const i = receipt.report_ids?.indexOf(b.report_id);
                    if (receipt.project_id !== b.project_id || i < 0 || receipt.selected_input_hashes?.[i] !== inputHash || receipt.generated_ids?.[i]?.observation !== b.observation_id || receipt.generated_ids?.[i]?.document !== b.entity_id || receipt.source_ids?.[i] !== b.source_id || receipt.record_hashes?.[b.observation_id] !== b.observation_sha256)
                        receiptBad();
                    if (!row || row.hash !== inputHash || row.ids?.observation !== b.observation_id || row.ids?.document !== b.entity_id || `frus:1904:${row.number}` !== b.source_id)
                        fail('PROVENANCE_PACKAGE_BINDING_MISMATCH');
                }
                else if (b.package_key === '005') {
                    const completion = receipt.package_completion, prepared = completion?.prepared, i = prepared?.report_ids?.indexOf(b.report_id);
                    if (completion?.status !== 'COMPLETED' || prepared?.target_project !== b.project_id || prepared.package_commit !== p.commit || prepared.package_fingerprint !== p.package_fingerprint || prepared.dataset_hash !== p.dataset_sha256 || completion.after_fingerprint !== receipt.after_fingerprint || completion.independent_read_fingerprint !== receipt.after_fingerprint || i < 0 || prepared.selected_input_hashes?.[i] !== inputHash || !prepared.generated_ids?.includes(b.observation_id) || !prepared.generated_ids?.includes(b.entity_id) || completion.record_hashes?.[b.observation_id] !== b.observation_sha256 || receipt.final_record_hashes?.[b.observation_id] !== b.observation_sha256)
                        receiptBad();
                    const group = selection.groups?.find((g: Json) => g.document_id === b.entity_id && g.source_id === b.source_id), row = group?.reports?.find((x: Json) => x.report_id === b.report_id);
                    if (selection.project_id !== b.project_id || !row || row.observation_id !== b.observation_id || row.selected_sha256 !== inputHash)
                        fail('PROVENANCE_PACKAGE_BINDING_MISMATCH');
                }
                else
                    fail('PROVENANCE_REGISTRY_INVALID');
            }
            const input = selected.value;
            if (input?.sources?.length !== 1 || input?.claims?.length !== 1 || input.sources[0].id !== b.source_id || input.claims[0].id !== b.report_id || input.claims[0].source_id !== b.source_id || !Array.isArray(input.actors))
                fail('PROVENANCE_INPUT_IDENTITY_MISMATCH');
            return { binding: b, package: p, input, raw: selected.bytes.toString('utf8'), inputHash, receiptHash: m.files[p.receipt].sha256 };
        } };
}
export function createProvenanceSourceResolver(options: {
    readEntity?: (project: string, entity: string) => HumanRealityReadTransport;
    registry?: ReturnType<typeof createProvenanceRegistry>;
} = {}) {
    const read = options.readEntity ?? createHumanRealityReader();
    return (projectId: string, entityId: string, observationId: string, precondition: unknown) => {
        if (precondition === undefined)
            fail('SNAPSHOT_PRECONDITION_REQUIRED', 428);
        if (!hex(precondition))
            fail('SNAPSHOT_PRECONDITION_INVALID', 400);
        const result = read(projectId, entityId); // One canonical snapshot/read path for every scope check.
        if (result.transport.source.snapshot_fingerprint !== precondition)
            fail('SNAPSHOT_MISMATCH', 409);
        const observation = result.canonical_records.observations.find(o => o.id === observationId);
        if (!observation)
            return fail('OBSERVATION_NOT_IN_SCOPE', 404);
        const resolved = (options.registry ?? createProvenanceRegistry()).read(projectId, entityId, observationId);
        if (!same(observation.provenance, resolved.binding.expected_provenance))
            fail('PROVENANCE_BINDING_MISMATCH', 409);
        const observationHash = publishedRecordHash(observation);
        if (observationHash !== resolved.binding.observation_sha256)
            fail('OBSERVATION_BINDING_MISMATCH', 409);
        const report = resolved.input.claims[0], source = resolved.input.sources[0];
        const refs = new Set([source.creator, source.recipient, report.subject_id, report.claimant_id, ...(Array.isArray(report.report_chain) ? report.report_chain : [])]);
        return {
            transport: { contract: 'human-interface-provenance-source.v1', source_family: resolved.binding.source_family, qualification: resolved.package.qualification, package_commit: resolved.package.commit, package_fingerprint: resolved.package.package_fingerprint, package_fingerprint_kind: resolved.package.package_fingerprint_kind, selected_input_fingerprint: resolved.inputHash, dataset_fingerprint: resolved.package.dataset_sha256, receipt_identity: resolved.package.receipt_identity, receipt_fingerprint: resolved.receiptHash, project_snapshot_fingerprint: precondition, observation_record_hash: observationHash, raw_selected_input_bytes: Buffer.byteLength(resolved.raw) },
            canonical_binding_context: { project_id: projectId, entity_id: entityId, observation_id: observationId, provenance: observation.provenance },
            frozen_selected_input: { input_schema: resolved.input.schema_version, source, report, relevant_actors: resolved.input.actors.filter((a: Json) => refs.has(a.id)) },
            raw_selected_input: resolved.raw,
        };
    };
}
export const resolveProvenanceSource = createProvenanceSourceResolver();
