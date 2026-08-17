#!/usr/bin/env node
/**
 * impeccable-stinger pre-flight sync check.
 *
 * Verifies, before a design task starts, that the installed Impeccable skill
 * is current with upstream and that the stinger's vendored coverage (guides +
 * templates) still matches the installed skill's content. If everything is
 * current it is skipped (exit 0); if behind or drifted it reports what changed
 * (exit 2); if the skill is not installed it says so (exit 1).
 *
 * Usage:
 *   node sync-check.mjs            # check only
 *   node sync-check.mjs --update    # check, and run `npx impeccable update` when behind
 *
 * Exit codes:
 *   0 = current and in sync (skip)
 *   2 = behind upstream and/or content drift (needs update/refresh)
 *   1 = not installed or check failed
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const HERE = dirname(fileURLToPath(import.meta.url));
const STINGER = join(HERE, '..');
const MANIFEST = JSON.parse(readFileSync(join(HERE, 'upstream-manifest.json'), 'utf8'));

const CANDIDATE_DIRS = [
  join(process.env.HOME || '', '.agents', 'skills', 'impeccable'),
  join(process.env.HOME || '', '.codex', 'skills', 'impeccable'),
  join(process.env.HOME || '', '.claude', 'skills', 'impeccable'),
  join(process.env.HOME || '', '.cursor', 'skills', 'impeccable'),
  '.agents/skills/impeccable',
  '.codex/skills/impeccable',
  '.claude/skills/impeccable',
  '.cursor/skills/impeccable',
];

const UPDATE_HOST = process.env.IMPECCABLE_UPDATE_HOST || 'https://impeccable.style';
const FETCH_TIMEOUT_MS = 4000;

function findInstalledSkill() {
  for (const dir of CANDIDATE_DIRS) {
    if (existsSync(join(dir, 'SKILL.md'))) return dir;
  }
  return null;
}

function readInstalledVersion(dir) {
  try {
    const md = readFileSync(join(dir, 'SKILL.md'), 'utf8');
    const m = md.match(/^version:\s*(.+)$/m);
    return m ? m[1].trim() : null;
  } catch {
    return null;
  }
}

function compareVersions(a, b) {
  const pa = String(a).split('.').map((n) => parseInt(n, 10) || 0);
  const pb = String(b).split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const da = pa[i] || 0;
    const db = pb[i] || 0;
    if (da !== db) return da - db;
  }
  return 0;
}

async function fetchPublishedVersion() {
  try {
    const res = await fetch(`${UPDATE_HOST}/api/version`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const body = await res.text();
    const m = body.match(/"version"\s*:\s*"([^"]+)"/) || body.match(/"skills"\s*:\s*"([^"]+)"/) || body.match(/^([0-9]+\.[0-9]+\.[0-9]+)/m);
    return m ? m[1] : body.trim();
  } catch {
    return null;
  }
}

function contentDrift(dir) {
  const drift = { newReferenceFiles: [], newCommands: [], missingReferenceFiles: [] };
  const refDir = join(dir, 'reference');
  if (existsSync(refDir)) {
    const installed = readdirSync(refDir).filter((f) => f.endsWith('.md')).sort();
    drift.newReferenceFiles = installed.filter((f) => !MANIFEST.referenceFiles.includes(f));
    drift.missingReferenceFiles = MANIFEST.referenceFiles.filter((f) => !installed.includes(f));
  }
  const metaPath = join(dir, 'scripts', 'command-metadata.json');
  if (existsSync(metaPath)) {
    try {
      const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
      drift.newCommands = Object.keys(meta).filter((c) => !MANIFEST.commands.includes(c));
    } catch {
      /* ignore unreadable metadata */
    }
  }
  return drift;
}

function runUpdate() {
  const r = spawnSync('npx', ['impeccable', 'update'], { stdio: 'inherit', shell: true });
  return r.status === 0;
}

async function main() {
  const args = process.argv.slice(2);
  const doUpdate = args.includes('--update');

  const installedDir = findInstalledSkill();
  if (!installedDir) {
    console.log('[sync-check] NOT INSTALLED: no impeccable skill found in any harness skill dir.');
    console.log('[sync-check] Run: npx impeccable install --scope=global --providers=codex,claude,cursor');
    process.exit(1);
  }

  const installedVersion = readInstalledVersion(installedDir);
  const publishedVersion = await fetchPublishedVersion();
  const drift = contentDrift(installedDir);

  const behind = installedVersion && publishedVersion && compareVersions(publishedVersion, installedVersion) > 0;
  const hasDrift = drift.newReferenceFiles.length > 0 || drift.newCommands.length > 0;

  console.log(`[sync-check] installed: ${installedVersion || 'unknown'} @ ${installedDir}`);
  console.log(`[sync-check] published: ${publishedVersion || 'unreachable (offline?)'}`);
  if (behind) console.log(`[sync-check] BEHIND: installed ${installedVersion} < published ${publishedVersion}`);
  if (drift.newCommands.length) console.log(`[sync-check] NEW COMMANDS upstream: ${drift.newCommands.join(', ')}`);
  if (drift.newReferenceFiles.length) console.log(`[sync-check] NEW REFERENCE FILES upstream: ${drift.newReferenceFiles.join(', ')}`);
  if (drift.missingReferenceFiles.length) console.log(`[sync-check] MISSING REFERENCE FILES (installed skill lacks): ${drift.missingReferenceFiles.join(', ')}`);

  if (!behind && !hasDrift) {
    console.log('[sync-check] CURRENT: upstream in sync, stinger coverage matches. Skipping update.');
    process.exit(0);
  }

  if (doUpdate && behind) {
    console.log('[sync-check] Running `npx impeccable update`...');
    if (runUpdate()) {
      console.log('[sync-check] Updated. NOTE: Codex may require /hooks re-approval after an update.');
      process.exit(0);
    }
    console.log('[sync-check] Update failed.');
    process.exit(1);
  }

  if (hasDrift) {
    console.log('[sync-check] STINGER REFRESH NEEDED: upstream added content the stinger does not cover.');
    console.log('[sync-check] Add guides/templates for the new content, then update scripts/upstream-manifest.json.');
  }
  process.exit(2);
}

main();
