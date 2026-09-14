/** Opt-in source-content usage proof; existing core atoms, not a core promotion. */
import type {ProjectState,StatePatch,RealityStateValue} from '../../../types.js';
import {projectSourceAssertions,type HistoricalDataset} from '../substrate.js';
const json=(v:unknown):RealityStateValue=>JSON.parse(JSON.stringify(v)) as RealityStateValue;
export function composeSourceAssertions(data:HistoricalDataset,state:ProjectState,at:string):StatePatch {
 const patch=projectSourceAssertions(data,state,at);
 for(const op of patch.operations)if(op.entity==='claim'&&op.payload){const value=op.payload.value as Record<string,RealityStateValue>;const c=data.claims.find(x=>x.id===value.experimental_claim_id)!;const s=data.sources.find(x=>x.id===c.source_id)!;
  op.payload.predicate=`source_assertion/${c.id}`;
  op.payload.value={...value,assertion_contract:'source-assertion/v1',content_scope:json({source_id:s.id,locator:c.locator??s.locator,inspection:s.inspection}),attributed_claim:json(c),actor_descriptors:json(data.actors.filter(a=>a.id===c.subject_id||a.id===c.claimant_id||c.report_chain.includes(a.id))),source_creation:json(s.creation),scope_limit:'Confidence applies to inspected source-content attribution at ingestion only; reported reality/actor reading/knowledge not asserted. Raw historical time is retained and does not replace applicability.'};
 }
 return patch;
}
export function assertSourceAssertionContract(state:ProjectState,claimId:string):void {
 const c=state.claims.find(x=>x.id===claimId);if(!c)throw new Error('Missing source Claim');const v=c.value as any;if(v?.assertion_contract!=='source-assertion/v1')throw new Error('Not opt-in source contract');const entity=state.reality_entities.find(x=>x.id===c.subject_id);
 if(c.predicate_kind!=='attribute'||c.predicate!==`source_assertion/${v.attributed_claim?.id}`||!entity||entity.kind!=='document'||!v.content_scope?.source_id||entity.attrs?.experimental_source_identity!==v.content_scope.source_id||c.provenance.external_id!==v.content_scope.source_id)throw new Error('Source-content target corrupted');
 const original=v.attributed_claim;if(!original||original.source_id!==v.content_scope.source_id||!original.claimant_id||!Array.isArray(original.report_chain)||!v.content_scope.locator||!v.content_scope.inspection||!original.temporal_scope?.raw||!original.extraction?.context||!Array.isArray(v.actor_descriptors)||!v.scope_limit)throw new Error('Lost original attribution/scope/raw time');
 if(c.applicable_from!==c.recorded_at||c.applicable_until!==null)throw new Error('Historical applicability synthesized');
 const links=state.claim_evidence_links.filter(x=>x.claim_id===c.id);if(links.length!==1||links[0].relation!=='SUPPORTS'||!state.evidence.some(e=>e.id===links[0].evidence_id&&e.provenance.external_id===v.content_scope.source_id))throw new Error('Source-content evidence route corrupted');
}
