import {lstatSync} from 'node:fs';
import {isAbsolute, relative, resolve, sep} from 'node:path';

/** Copy trusted checkout inputs only; never import the caller's runtime store.
 * No filesystem mutation. Concurrent hostile source replacement is not supported.
 * The dependency link is created separately by the runner, outside this policy.
 */
export function createRunnerCopyPolicy(sourceRoot) {
  if (!isAbsolute(sourceRoot)) throw new Error('Runner source root must be absolute');
  const root = resolve(sourceRoot);
  return function shouldCopy(source) {
    if (!isAbsolute(source)) throw new Error('Runner source path must be absolute');
    const path = resolve(source);
    const rel = relative(root, path);
    if (isAbsolute(rel) || rel === '..' || rel.startsWith(`..${sep}`)) {
      throw new Error('Runner source path escapes source root');
    }
    const segments = rel === '' ? [] : rel.split(sep);
    // Check the root and each ancestor before trusting a lexical directory boundary.
    // Stop at excluded storage: neither follow it nor inspect its descendants.
    let current = root;
    if (lstatSync(current).isSymbolicLink()) throw new Error('Runner source symlink refused');
    for (let i = 0; i < segments.length; i++) {
      current = resolve(current, segments[i]);
      if (i === 1 && segments[0] === 'ground-core' && segments[1] === 'storage') return false;
      if (lstatSync(current).isSymbolicLink()) throw new Error('Runner source symlink refused');
    }
    return true;
  };
}
