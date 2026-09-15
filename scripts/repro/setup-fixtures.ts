import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {writeFixtures} from './generate-fixtures.js';
const destination=resolve(process.argv[2]);
if(readFileSync(resolve(destination,'.ground-repro-test-workspace'),'utf8')!=='GROUND-REPRO-001\n')throw new Error('Setup requires an explicit isolated test workspace marker');
const manifest=writeFixtures(resolve(destination,'ground-core/storage/projects'));
writeFileSync(resolve(destination,'fixture-digests.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({fixtureDigests:manifest}));
