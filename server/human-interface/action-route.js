import {Router, json} from 'express';
import {tsImport} from 'tsx/esm/api';
export function createActionUpdateRouter(options={}) {
  const router=Router();
  router.all('/projects/:projectId/actions/:actionId/status',async(req,res,next)=>{
    res.set('Cache-Control','no-store');
    if(req.method!=='POST') return res.set('Allow','POST').status(405).json({transport_error:{code:'METHOD_NOT_ALLOWED'}});
    try {
      const loaded=await tsImport('./action-update.ts',import.meta.url);
      const origin=loaded.writeOrigin(options.origin ?? process.env.GROUND_BUSINESS_WRITE_ORIGIN);
      const runtime=options.runtimeConfigPath ?? process.env.GROUND_RUNTIME_CONFIG;
      if(!origin || !runtime) return res.status(403).json({transport_error:{code:'WRITE_DISABLED'}});
      const remote=req.socket.remoteAddress;
      if(!['127.0.0.1','::1','::ffff:127.0.0.1'].includes(remote) || req.get('Origin')!==origin || req.get('Host')!==new URL(origin).host || (req.get('Sec-Fetch-Site') && req.get('Sec-Fetch-Site')!=='same-origin')) return res.status(403).json({transport_error:{code:'WRITE_ORIGIN_DENIED'}});
      if(!req.is('application/json') || Object.keys(req.query).length) return res.status(400).json({transport_error:{code:'INVALID_UPDATE_REQUEST'}});
      json({limit:'1kb'})(req,res,error=>{
        if(error) return res.status(400).json({transport_error:{code:'INVALID_UPDATE_REQUEST'}});
        const body=req.body;
        if(!body || Array.isArray(body) || Object.keys(body).length!==1 || typeof body.transition!=='string') return res.status(400).json({transport_error:{code:'INVALID_UPDATE_REQUEST'}});
        try {
          const result=loaded.createActionUpdater(runtime)(req.params.projectId,req.params.actionId,body.transition,req.get('If-Ground-Snapshot-Fingerprint'));
          // Operational receipt only; not a new canonical audit entity.
          console.info(JSON.stringify({event:'human-action-update',...result.receipt}));
          return res.json(result);
        } catch(error) {return res.status(error.status ?? 503).json({transport_error:{code:error.code ?? 'STORAGE_FAILURE'}});}
      });
    } catch {return res.status(503).json({transport_error:{code:'WRITE_RUNTIME_UNAVAILABLE'}});}
  });
  return router;
}
