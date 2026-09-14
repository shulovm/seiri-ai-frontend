import {it} from 'node:test';import assert from 'node:assert/strict';
import {decomposeReality}from'../reality/canonical-translation.js';
import {createEmptyProject,applyPatch}from'../state-engine.js';import {proposeFromReality}from'../reality/propose.js';
const uncertain=['いつ処置が始まったかは記録がない。','どの時点で作業を開始したかは分からない。','処理を開始したという記録はない。','装置が停止したとの報告はない。','作業の実行を完了したとは限らない。','もし作業を開始したなら結果を送る。'];
for(const text of uncertain)it('unknown is not occurrence: '+text,()=>{const u=decomposeReality(text);assert.ok(u.every(x=>x.eventKinds.length===0));assert.ok(u.every(x=>x.properties.equipment_operating_status===undefined));});
for(const domain of ['医療処置','製造保全','出版物流'])for(const order of [0,1])it(`outcome does not invent start: ${domain}/${order}`,()=>{const text=order?'いつ処置が始まったかは記録がない。出血が止まった。':'出血が止まった。いつ処置が始まったかは記録がない。';const s=createEmptyProject({title:domain});const p=proposeFromReality(s,{project_id:s.project.id,input_text:text},'canonical');assert.ok('proposed_patch'in p.result);if('proposed_patch'in p.result){const n=applyPatch(s,p.result.proposed_patch);assert.equal(n.reality_events.filter(x=>x.kind==='execution_started').length,0);assert.equal(n.reality_events.filter(x=>x.kind==='outcome_established').length,1);}});
it('affirmed execution remains an occurrence',()=>assert.ok(decomposeReality('処置を開始した。')[0].eventKinds.includes('execution_started')));
it('ordinary inspection scope is not a global negative',()=>{const u=decomposeReality('通常検査項目には異常なし。薬剤は未検査。');assert.ok(u.every(x=>x.properties.X_present===undefined));});

it('nominal cancellation eligibility is not a revocation occurrence',()=>{for(const label of ['送金','入場','設備利用']){const units=decomposeReality(`${label}の取消可否。`);assert.ok(units.every(x=>!x.eventKinds.includes('permission_revoked')));assert.ok(units.every(x=>x.properties.permission_status!=='revoked'));}});
it('nominal indirect reports preserve claim status without asserting outcomes',()=>{for(const text of ['取引先から着金したとの連絡がある。','配送先に到着したという報告があった。']){const units=decomposeReality(text);assert.ok(units.every(x=>x.eventKinds.length===0));assert.ok(units.some(x=>x.qualification==='reported'&&x.properties.reported_source_scope));}});
