#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';
import { runCli } from './cli.js';
import { withCanonicalWriter, type CanonicalOwnerConfig } from './storage-owner.js';

/** Explicit owner entrypoint; ordinary cli.ts remains local/dev by default. */
export function runOwnerCli(args: string[], writeErr = (message: string) => console.error(message)): number {
  try {
    const [flag, configPath, ...command] = args;
    if (flag !== '--config' || !configPath || !isAbsolute(configPath) || !command.length) {
      throw new Error('Usage: owner-cli --config <absolute-runtime-config.json> <init|intake|patch|reality-apply|reconcile-apply> ...');
    }
    // Read-only commands use ordinary CLI/read APIs and never acquire ownership.
    if (!['init', 'intake', 'patch', 'reality-apply', 'reconcile-apply'].includes(command[0])) {
      throw new Error('Owner launcher accepts only the five canonical writer commands');
    }
    const config = JSON.parse(readFileSync(configPath, 'utf8')) as CanonicalOwnerConfig;
    return withCanonicalWriter(config, options => runCli(command, { ...options, writeErr }));
  } catch (error) {
    writeErr(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = runOwnerCli(process.argv.slice(2));
}
