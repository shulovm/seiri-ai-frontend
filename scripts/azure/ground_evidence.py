"""Create-only Block Blob release protocol. No CLI login or live execution on import.

Transport is injected. The production adapter accepts only an Entra bearer token;
no key/SAS, delete, overwrite, multipart, deployment, or fallback path exists.
"""
from dataclasses import dataclass
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

SCOPE = 'historical-round6-staging'
VALIDATION_SCOPE = 'ground-005-publisher-validation'
SCOPES = (SCOPE, VALIDATION_SCOPE)
SCOPE_PATTERN = '(?:'+'|'.join(SCOPES)+')'
ENDPOINT = 'https://orimusugroundstg01.blob.core.windows.net/ground-evidence-staging'
MAX_BLOB = 64 * 1024 * 1024
MAX_CORPUS = 128 * 1024 * 1024

class GateError(RuntimeError):
    pass

def require(ok, message):
    if not ok:
        raise GateError(message)

def sha(data):
    return hashlib.sha256(data).hexdigest()

def safe_path(value):
    require(isinstance(value, str) and bool(value), 'invalid path')
    p = PurePosixPath(value)
    require(not p.is_absolute() and all(x not in ('', '.', '..') for x in value.split('/'))
            and '\\' not in value and not any(ord(c) < 32 for c in value), 'unsafe path')
    return p

def read_source(root, name):
    p = root
    require(not root.is_symlink(), 'symlink source root')
    for segment in safe_path(name).parts:
        p = p / segment
        require(not p.is_symlink(), 'symlink source component')
    require(p.is_file() and p.stat().st_size <= MAX_BLOB, 'missing or oversized source')
    data = p.read_bytes()
    require(len(data) <= MAX_BLOB, 'oversized source')
    return data

@dataclass(frozen=True)
class Release:
    release_id: str
    prefix: str
    # Tuple and immutable byte buffers prevent source changes during upload.
    objects: tuple

    def mapping(self):
        return dict(self.objects)

def prepare(root, raw_manifest, expected_release, input_scope=SCOPE):
    """Reconstruct hashes from approved paths; require the existing exact encoding.

    Paths/order come from the reviewed corpus-pins.json, never a directory scan.
    Existing worker trust anchor is SHA256(raw manifest bytes).
    """
    require(re.fullmatch('[0-9a-f]{64}', expected_release) is not None, 'explicit release SHA')
    require(len(raw_manifest) <= MAX_BLOB, 'manifest too large')
    require(sha(raw_manifest) == expected_release, 'manifest/release mismatch')
    pins = json.loads(raw_manifest)
    require(isinstance(pins, list) and 0 < len(pins) <= 10000, 'invalid manifest')
    rebuilt, files, seen, total = [], [], set(), 0
    for pin in pins:
        require(isinstance(pin, dict) and set(pin) == {'path', 'sha256'}, 'invalid pin fields')
        name = str(safe_path(pin['path']))
        require(name not in seen, 'duplicate path')
        seen.add(name)
        data = read_source(Path(root), name)
        total += len(data)
        require(total <= MAX_CORPUS, 'corpus too large')
        require(sha(data) == pin['sha256'], 'source hash mismatch: ' + name)
        rebuilt.append({'path': name, 'sha256': sha(data)})
        files.append(('files/' + name, data))
    canonical = (json.dumps(rebuilt, ensure_ascii=False, indent=2) + '\n').encode()
    require(canonical == raw_manifest, 'manifest encoding/order differs from existing protocol')
    require(input_scope in SCOPES, 'unapproved input scope')
    prefix = input_scope + '/sha256-' + expected_release + '/'
    return Release(expected_release, prefix, tuple((prefix+n, b) for n, b in files)
                   + ((prefix+'manifest.json', canonical),))

def verify_remote(store, release):
    """A complete listing and every byte/type must match, including the manifest."""
    expected = release.mapping()
    names = store.list(release.prefix)
    require(set(names) == set(expected) and len(names) == len(expected), 'remote object set differs')
    receipts = []
    for name, data in release.objects:
        actual, blob_type = store.get(name)
        require(blob_type == 'BlockBlob', 'non-BlockBlob release: ' + name)
        require(actual == data, 'remote byte mismatch: ' + name)
        receipts.append({'name': name, 'bytes': len(actual), 'sha256': sha(actual)})
    return receipts

def publish(store, release, journal):
    """Never repair partial releases; ambiguous writes stop without retry or delete.

    Caller must have completed source/equivalence tests and identity/RBAC gates.
    Journal is updated BEFORE each attempted write, for durable caller checkpointing.
    """
    present = store.list(release.prefix)  # errors propagate; never mean absence
    if present:
        receipts = verify_remote(store, release)
        return {'status': 'ALREADY_PUBLISHED', 'release': release.release_id,
                'receipts': receipts, 'blob_mutations': 0, 'promotion': False}
    expected = release.mapping()
    for name, data in release.objects:
        if name == release.prefix+'manifest.json':
            # Commit marker last, only after all payload objects have been read back.
            require(set(store.list(release.prefix)) == set(expected)-{name}, 'concurrent prefix change')
        journal({'attempt': name, 'sha256': sha(data), 'bytes': len(data)})
        store.create(name, data)
        actual, blob_type = store.get(name)
        require(blob_type == 'BlockBlob' and actual == data, 'created blob readback mismatch')
    receipts = verify_remote(store, release)
    return {'status': 'PUBLISHED_BYTE_VERIFIED', 'release': release.release_id,
            'receipts': receipts, 'blob_mutations': len(release.objects), 'promotion': False}

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise GateError('Storage redirect denied')

class EntraBlockBlobStore:
    """Single PUT per blob; add/action suffices without blobs/write.

    Token must already be obtained by the separately reviewed OIDC identity gate.
    This adapter has no credential discovery and never refreshes/retries writes.
    """
    def __init__(self, bearer_token, opener=None):
        require(isinstance(bearer_token, str) and bearer_token and '\n' not in bearer_token
                and '\r' not in bearer_token, 'Entra bearer token required')
        self._token = bearer_token
        self._opener = opener or urllib.request.build_opener(NoRedirect())

    def _request(self, method, name='', query=None, data=None):
        require(method in ('GET', 'PUT'), 'operation forbidden')
        if name:
            safe_path(name)
            require(re.fullmatch(SCOPE_PATTERN+r'/sha256-[0-9a-f]{64}/.+', name), 'release path required')
        require(method != 'PUT' or (name and query is None and data is not None), 'single Put Blob only')
        require(query is None or (method == 'GET' and not name and
                set(query) <= {'restype','comp','prefix','marker','maxresults'} and
                query.get('comp') == 'list' and query.get('restype') == 'container'), 'query forbidden')
        url = ENDPOINT + ('/'+urllib.parse.quote(name, safe='/') if name else '')
        if query:
            url += '?' + urllib.parse.urlencode(query)
        headers = {'Authorization': 'Bearer '+self._token, 'x-ms-version': '2023-11-03',
                   'x-ms-date': datetime.now(timezone.utc).strftime('%a, %d %b %Y %H:%M:%S GMT')}
        if method == 'PUT':
            require(len(data) <= MAX_BLOB, 'single PUT bound')
            headers.update({'If-None-Match': '*', 'x-ms-blob-type': 'BlockBlob',
                            'Content-Length': str(len(data)), 'Content-Type': 'application/octet-stream'})
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        # HTTP failures, including 403/404/409/412, propagate with no fallback.
        with self._opener.open(req, timeout=30) as response:
            require(response.status == (201 if method == 'PUT' else 200), 'unexpected Storage status')
            body = response.read(MAX_BLOB+1)
            require(len(body) <= MAX_BLOB, 'oversized Storage response')
            return body, response.headers

    def list(self, prefix):
        require(re.fullmatch(SCOPE_PATTERN+r'/sha256-[0-9a-f]{64}/', prefix), 'exact release prefix required')
        names, marker, seen = [], '', set()
        for _ in range(100):
            q = {'restype':'container','comp':'list','prefix':prefix,'maxresults':'5000'}
            if marker:
                q['marker'] = marker
            raw, _ = self._request('GET', query=q)
            root = ET.fromstring(raw)
            require(root.tag == 'EnumerationResults' and root.find('Blobs') is not None
                    and root.find('NextMarker') is not None, 'incomplete list response')
            for blob in root.findall('./Blobs/Blob'):
                name = blob.findtext('Name')
                require(name and name.startswith(prefix) and name not in names, 'invalid list object')
                names.append(name)
            marker = root.findtext('NextMarker') or ''
            if not marker:
                return names
            require(marker not in seen, 'repeated list marker')
            seen.add(marker)
        raise GateError('list pagination bound; absence not proven')

    def get(self, name):
        raw, headers = self._request('GET', name)
        return raw, headers.get('x-ms-blob-type')

    def create(self, name, data):
        self._request('PUT', name, data=data)
