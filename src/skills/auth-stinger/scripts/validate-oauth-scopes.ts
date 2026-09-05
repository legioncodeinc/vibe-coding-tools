#!/usr/bin/env -S npx tsx
/**
 * validate-oauth-scopes.ts
 *
 * Audits the OAuth scopes your code actually uses against the scopes
 * registered in your provider's consent screen / scope list. Catches the
 * common drift bug: a scope is listed (and verified!) but no longer
 * used in code, OR a scope is used in code but not declared.
 *
 * USAGE
 *   npx tsx scripts/validate-oauth-scopes.ts \
 *     --code-root ./src \
 *     --declared-scopes ./scopes.json
 *
 * --declared-scopes JSON shape:
 *   { "scopes": ["openid", "email", "profile",
 *                "https://www.googleapis.com/auth/calendar.readonly"] }
 *
 * The scanner greps for known scope strings in the codebase. It is
 * deliberately conservative — false positives are better than false
 * negatives here.
 *
 * EXIT CODES
 *   0 — scopes match
 *   1 — drift detected (scope declared but unused, or used but undeclared)
 *
 * Cite: guides/06-google-oauth.md, guides/07-google-oauth-verification.md.
 */

import { readFileSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

interface DeclaredScopes {
  scopes: string[];
}

const KNOWN_GOOGLE_SCOPE_PREFIX = 'https://www.googleapis.com/auth/';
const SHORT_SCOPES = new Set(['openid', 'email', 'profile']);

function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      args[argv[i].slice(2)] = argv[i + 1] ?? '';
    }
  }
  return args;
}

function walk(dir: string, exts = ['.ts', '.tsx', '.js', '.jsx', '.mjs']): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const stat = statSync(p);
    if (stat.isDirectory()) {
      if (entry === 'node_modules' || entry.startsWith('.')) continue;
      out.push(...walk(p, exts));
    } else if (exts.includes(extname(entry))) {
      out.push(p);
    }
  }
  return out;
}

function findUsedScopes(codeRoot: string): Set<string> {
  const used = new Set<string>();
  const files = walk(codeRoot);
  for (const f of files) {
    const text = readFileSync(f, 'utf8');
    // Match full Google scope URLs.
    const longMatches = text.match(
      /https:\/\/www\.googleapis\.com\/auth\/[a-zA-Z0-9._-]+/g,
    );
    longMatches?.forEach((s) => used.add(s));
    // Match short scopes inside string literals or arrays.
    for (const s of SHORT_SCOPES) {
      const re = new RegExp(`['"\`]${s}['"\`]`);
      if (re.test(text)) used.add(s);
    }
  }
  return used;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const codeRoot = args['code-root'] ?? './src';
  const declaredFile = args['declared-scopes'] ?? './scopes.json';

  const declared: DeclaredScopes = JSON.parse(readFileSync(declaredFile, 'utf8'));
  const declaredSet = new Set(declared.scopes);
  const usedSet = findUsedScopes(codeRoot);

  const declaredUnused = [...declaredSet].filter((s) => !usedSet.has(s));
  const usedUndeclared = [...usedSet].filter((s) => !declaredSet.has(s));

  console.log('Declared scopes:', [...declaredSet].sort());
  console.log('Used scopes:', [...usedSet].sort());
  console.log('');

  if (declaredUnused.length === 0 && usedUndeclared.length === 0) {
    console.log('OK: scopes match.');
    process.exit(0);
  }

  if (declaredUnused.length > 0) {
    console.error('DECLARED BUT UNUSED (drop on next verification cycle):');
    declaredUnused.forEach((s) => console.error('  - ' + s));
  }
  if (usedUndeclared.length > 0) {
    console.error('USED BUT NOT DECLARED (will fail consent):');
    usedUndeclared.forEach((s) => console.error('  - ' + s));
  }
  console.error('');
  console.error('Drift detected. Update scopes.json or remove unused scope code.');
  console.error('See guides/06-google-oauth.md and guides/07-google-oauth-verification.md.');
  process.exit(1);
}

main();
