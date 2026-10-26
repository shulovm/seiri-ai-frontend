/** Explicit read-only audit command: repository must already contain the pinned objects. */
import {isAbsolute} from 'node:path';
import {FAMILY_PINS} from './family-pins.js';
import {verifyHistoricalFamily,executeHistoricalFamilyVerification,type FamilyName} from './family.js';
const [repositoryRoot]=process.argv.slice(2);
if(!repositoryRoot||!isAbsolute(repositoryRoot))throw new Error('Usage: verify-families.ts ABSOLUTE_REPOSITORY_ROOT');
for(const name of Object.keys(FAMILY_PINS) as FamilyName[]){
 const h=verifyHistoricalFamily(repositoryRoot,name);
 try{
  const r=executeHistoricalFamilyVerification(h,process.cwd());
  console.log(JSON.stringify(r));if(r.status!==0)process.exitCode=1;
 }finally{h.cleanup();}
}
