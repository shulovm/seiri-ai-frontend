import { createServer } from 'node:http';
import { config, verify } from './verify.js';

const log = (event: string, fields = {}) => process.stdout.write(JSON.stringify({
  timestamp: new Date().toISOString(), event, ...fields,
}) + '\n');

try {
  const input = config(process.env);
  let ready = false;
  let stopped = false;
  let lastSuccess = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const server = createServer((req, res) => {
    const healthy = req.url === '/healthz' && !stopped;
    const fresh = ready && Date.now() - lastSuccess < input.interval + 30000;
    const available = req.url === '/readyz' && fresh && !stopped;
    res.writeHead(healthy || available ? 200 : req.url === '/readyz' ? 503 : 404,
      { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: healthy || available }));
  });
  function shutdown(signal: string, code = 0) {
    if (stopped) return;
    stopped = true;
    ready = false;
    clearTimeout(timer);
    process.exitCode = code;
    log('worker_stopping', { signal });
    server.close(() => { log('worker_stopped'); });
    server.closeAllConnections();
  }
  process.once('SIGTERM', () => shutdown('SIGTERM'));
  process.once('SIGINT', () => shutdown('SIGINT'));
  server.once('error', () => shutdown('HEALTH_SERVER_ERROR', 1));
  function cycle() {
    if (stopped) return;
    try {
      const result = verify(input);
      lastSuccess = Date.now();
      ready = true;
      log('snapshot_integrity_checked', result);
    } catch {
      ready = false;
      // Never serialize source content, environment, credentials, or exception messages.
      log('snapshot_integrity_failed', { production_authority: false });
    }
    timer = setTimeout(cycle, input.interval);
  }
  server.listen(input.port, '0.0.0.0', () => {
    log('worker_started', { production_authority: false });
    cycle();
  });
} catch {
  log('worker_configuration_rejected');
  process.exitCode = 1;
}
