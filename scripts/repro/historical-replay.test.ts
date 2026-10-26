import test from 'node:test';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {verifyHistoricalFamily,executeHistoricalFamilyVerification,type FamilyName} from '../historical-dependencies/family.js';
import {assertCurrentBoundary} from '../historical-dependencies/current-boundary.js';
test('current code graph excludes only byte-covered historical packages and tests',()=>{assertCurrentBoundary(resolve('.'));});
for(const [name,count] of Object.entries({'live-003-review.json':11,'live-003-inspection.json':13,'live-004.json':13,'live-005.json':57})) {
  test(name+' original tests and historical compiler boundary',()=>{
    const handle=verifyHistoricalFamily(resolve('.'),name as FamilyName);
    try {
      const result=executeHistoricalFamilyVerification(handle);
      console.log('Historical family receipt: '+JSON.stringify({...result.receipt,package_fingerprint:result.package_fingerprint}));
      console.log(result.tests.stdout);
      assert.equal(result.status,0,result.tests.stdout+result.tests.stderr+(result.tests.error??''));
      assert.match(result.tests.stdout,new RegExp('(?:# |ℹ )pass '+count+'(?:\\n|\\r|$)'));
      assert.match(result.tests.stdout,/(?:# |ℹ )fail 0/);
    }finally{handle.cleanup();}
  });
}
