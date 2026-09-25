import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname, sep } from 'node:path';
const source = resolve('ground-core/experimental/historical-reality');
const target = resolve('corpus');
const pins = JSON.parse(readFileSync('containers/ground-worker/corpus-pins.json', 'utf8'));
for (const pin of pins) {
  const input = resolve(source, pin.path), output = resolve(target, pin.path);
  if (!input.startsWith(source + sep) || !output.startsWith(target + sep)) throw new Error('Corpus path escape');
  const bytes = readFileSync(input);
  if (createHash('sha256').update(bytes).digest('hex') !== pin.sha256) throw new Error('Corpus integrity mismatch');
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, bytes, { flag: 'wx', mode: 0o444 });
}
