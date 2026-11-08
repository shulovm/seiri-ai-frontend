import { RealityReadError } from './read-client.js';
async function read(path, contract, key, {signal,fetcher=fetch} = {}) {
  const base=import.meta.env?.VITE_API_BASE ?? '';
  const response=await fetcher(`${base}/api/human-interface/projects${path}`,{method:'GET',signal});
  let body;
  try { body=await response.json(); } catch { throw new RealityReadError(response.status,'INVALID_READ_RESPONSE'); }
  if (!response.ok) throw new RealityReadError(response.status,body?.transport_error?.code ?? 'SERVER_READ_FAILURE');
  if (body?.transport?.contract !== contract || !Array.isArray(body[key]) || (path && !body.canonical_project)) throw new RealityReadError(response.status,'INVALID_READ_RESPONSE');
  return body;
}
export const fetchCatalog = options => read('','human-interface-project-catalog.v1','registered_projects',options);
export const fetchProject = (projectId,options) => read(`/${encodeURIComponent(projectId)}`,'human-interface-project-browse.v1','canonical_entities',options);

export async function fetchOperating(projectId, options) {
  const body = await read(`/${encodeURIComponent(projectId)}/operating`, 'human-interface-project-operating.v1','canonical_entities',options);
  const records = body.canonical_operating_records;
  if (body.canonical_project.id !== projectId || body.transport.requested_scope?.project_id !== projectId ||
      !body.transport.source?.snapshot_fingerprint || !records?.current_state ||
      !Array.isArray(records.blockers) || !Array.isArray(records.next_actions)) {
    throw new RealityReadError(200,'INVALID_READ_RESPONSE');
  }
  return body;
}

export async function updateAction(projectId,actionId,transition,fingerprint,{fetcher=fetch}={}) {
  const base=import.meta.env?.VITE_API_BASE ?? '';
  const response=await fetcher(`${base}/api/human-interface/projects/${encodeURIComponent(projectId)}/actions/${encodeURIComponent(actionId)}/status`,{method:'POST',headers:{'Content-Type':'application/json','If-Ground-Snapshot-Fingerprint':fingerprint},body:JSON.stringify({transition})});
  let body;
  try {body=await response.json();} catch {throw new RealityReadError(response.status,'UPDATE_OUTCOME_UNKNOWN');}
  if(!response.ok) throw new RealityReadError(response.status,body?.transport_error?.code ?? 'UPDATE_OUTCOME_UNKNOWN');
  const r=body?.receipt;
  if(body?.transport?.contract!=='human-interface-action-update.v1' || r?.project_id!==projectId || r?.action_id!==actionId || r?.before_fingerprint!==fingerprint || !/^[a-f0-9]{64}$/.test(r?.after_fingerprint ?? '') || r?.new_status!==(transition==='start'?'in_progress':'done')) throw new RealityReadError(response.status,'UPDATE_OUTCOME_UNKNOWN');
  return body;
}
// No automatic retry: even a lost success response must be resolved by a new read.
export async function updateAndReload(projectId,actionId,transition,fingerprint,{write=updateAction,read=fetchOperating}={}) {
  const result=await write(projectId,actionId,transition,fingerprint);
  try {return {receipt:result.receipt,response:await read(projectId)};}
  catch {throw new RealityReadError(503,'UPDATE_SAVED_RELOAD_FAILED');}
}
