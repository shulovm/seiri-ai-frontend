import { assertState, requireCondition as check, equal } from './validation.js';
import { canonicalValueKey } from '../reality/semantic-equality.js';
import { isClaimApplicableAt } from '../reality/belief.js';
import { isProposition, type ProjectStateVNext, type ClaimProposition } from './types.js';
import { FrozenArtifactRegistry, admitAssessment, definitionKey } from './artifacts.js';

export function getClaimAssessmentView(s:ProjectStateVNext,id:string) {
  assertState(s);const c=s.claims.find(c=>c.id===id);check(c,'Claim not found');
  if(!isProposition(c))return {
    kind:'legacy_claim' as const,legacy_record:structuredClone(c),legacy_numeric_confidence:c.confidence,
    qualification:{method:'NOT_RECORDED',assessor:'NOT_RECORDED',calibration:'UNKNOWN'},
    assessment_state:'LEGACY_NUMERIC_PRESENT' as const,assessment_count:0,assessment_records:[],
  };
  const records=s.claim_assessments.filter(a=>a.claim_id===id).map(a=>structuredClone(a));
  return {kind:'claim_proposition' as const,proposition:structuredClone(c),assessment_state:records.length?'ASSESSMENTS_PRESENT' as const:'UNASSESSED' as const,assessment_count:records.length,assessment_records:records};
}
/** Audit availability is independent from the stored assessment inventory. */
export function inspectAssessmentReferences(s:ProjectStateVNext,id:string,registry:FrozenArtifactRegistry) {
  const view=getClaimAssessmentView(s,id);
  return {...view,reference_resolution:view.assessment_records.map(a=>{
    try{admitAssessment(a,s,registry);return {assessment_id:a.id,status:'RESOLVED' as const};}
    catch(e){return {assessment_id:a.id,status:'UNAVAILABLE_OR_INVALID' as const,reason:(e as Error).message};}
  })};
}
export function comparisonScope(c:ProjectStateVNext['claims'][number]) {
  const common={project_id:c.project_id,subject_id:c.subject_id,predicate_kind:c.predicate_kind,predicate:c.predicate};
  if(!isProposition(c))return {...common,contract:'legacy',manifestation:'NOT_DECLARED'};
  const m=c.manifestation_scope;
  const manifestation=m.kind==='entity_only'?m:{kind:m.kind,representation_kind:m.representation_kind,source_entity_id:m.source_entity_id,sha256:m.artifact.sha256,selector:m.selector};
  return {...common,contract:c.contract,predicate_definition:definitionKey(c.predicate_ref),manifestation};
}
export function assessBeliefVNext(s:ProjectStateVNext,scope:ReturnType<typeof comparisonScope>,at:string) {
  assertState(s);
  const claims=s.claims.filter(c=>equal(comparisonScope(c),scope)&&isClaimApplicableAt(c as Parameters<typeof isClaimApplicableAt>[0],at));
  const groups=new Map<string,typeof claims>();
  for(const c of claims){const key=canonicalValueKey(c.value);groups.set(key,[...(groups.get(key)??[]),c]);}
  const positions=[...groups.entries()].sort(([a],[b])=>a<b?-1:a>b?1:0).map(([value_key,cs])=>{
    const evidence=cs.map(c=>getEvidenceForClaimVNext(s,c.id));
    const unique=(items:ProjectStateVNext['evidence'])=>[...new Map(items.map(e=>[e.id,e])).values()];
    const supporting_evidence=unique(evidence.flatMap(e=>e.supports));
    const contradicting_evidence=unique(evidence.flatMap(e=>e.contradicts));
    return {value:structuredClone(cs[0]!.value),value_key,claim_ids:cs.map(c=>c.id),claims:structuredClone(cs),
      supporting_evidence,contradicting_evidence,has_evidence_tension:supporting_evidence.length>0&&contradicting_evidence.length>0};
  });
  const views=claims.map(c=>getClaimAssessmentView(s,c.id));
  return {comparison_scope:scope,at,positions,applicable_claims:structuredClone(claims),
    status:positions.length===0?'NO_CLAIMS':positions.length===1?'UNCONTESTED':'CONTESTED',
    per_claim_assessment_views:views,unassessed_claim_count:views.filter(v=>v.assessment_state==='UNASSESSED').length,
    legacy_numeric_claim_count:views.filter(v=>v.assessment_state==='LEGACY_NUMERIC_PRESENT').length,
    assessment_count:views.reduce((sum,v)=>sum+v.assessment_count,0),
    unresolved_reasons:[...(positions.length===1?['uncontested_is_not_truth']:positions.length>1?['divergent_positions']:['no_applicable_claims']),...(positions.some(p=>p.has_evidence_tension)?['evidence_tension']:[])]};
}
export function getEvidenceForClaimVNext(s:ProjectStateVNext,id:string) {
  assertState(s);check(s.claims.some(c=>c.id===id),'Claim not found');
  const links=s.claim_evidence_links.filter(l=>l.claim_id===id);
  const select=(relation:string)=>links.filter(l=>l.relation===relation).map(l=>s.evidence.find(e=>e.id===l.evidence_id)!);
  return structuredClone({claim_id:id,links,supports:select('SUPPORTS'),contradicts:select('CONTRADICTS')});
}
export function getUnresolvedClaimsVNext(s:ProjectStateVNext) {assertState(s);return structuredClone(s.claims.filter(c=>c.subject_id===null));}
