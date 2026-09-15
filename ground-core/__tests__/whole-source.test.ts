import{it}from'node:test';import assert from'node:assert/strict';import{wholeRecordSource,wholeQuantityHolder}from'../reality/whole-source.js';
it('record attribution does not fabricate a direct observer',()=>{assert.deepEqual(wholeRecordSource('保管会社の記録では点検は正常。'),{record:'保管会社の記録',attributedTo:'保管会社'});assert.equal(wholeRecordSource('職員Aが直接見た。'),null);});
for(const text of ['学校の在籍児童は612人。','倉庫に集まった数量は37個。'])it('nominal quantity owner is distinct from its measured attribute: '+text,()=>assert.equal(wholeQuantityHolder(text),text.startsWith('学校')?'学校':'倉庫'));
it('the record source is not automatically the measured object',()=>assert.deepEqual(wholeRecordSource('電子管理システムでは記録がある。'),{record:'電子管理システム'}));
