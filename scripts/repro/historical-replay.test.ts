import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadDependencyManifest, materializeHistoricalCheckpoint, executeHistoricalCheckpoint } from '../historical-dependencies/execution.js';
import { sha256 } from '../historical-dependencies/resolver.js';

test('LIVE-003B original 11 review tests execute verified historical closure under read-only isolation',()=>{
  const {manifest}=loadDependencyManifest('live-003b-review.json');
  const entry=manifest.dependencies.find(d=>d.repo_relative_path===manifest.entrypoint)!;
  // If a future integration contains an evolved test, do not silently replace it with older assertions.
  if(existsSync(resolve(entry.repo_relative_path)))assert.equal(sha256(readFileSync(resolve(entry.repo_relative_path))),entry.expected_sha256,'current review test evolved; explicit test dispatch review required');
  const checkpoint=materializeHistoricalCheckpoint(resolve('.'),'live-003b-review.json');
  try {
    const result=executeHistoricalCheckpoint(checkpoint);
    console.log('Historical execution receipt: '+JSON.stringify(result.receipt));
    console.log(result.stdout);
    assert.equal(result.status,0,result.stderr||result.error);
    assert.match(result.stdout,/(?:pass 11|# pass 11)/);
    assert.match(result.stdout,/(?:fail 0|# fail 0)/);
  }finally{checkpoint.cleanup();}
});
