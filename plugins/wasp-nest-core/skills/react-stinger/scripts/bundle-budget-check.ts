/**
 * scripts/bundle-budget-check.ts
 *
 * Stub — compares built JS bundle sizes against per-route budgets.
 * Fails CI if any route exceeds its budget without an approved waiver.
 *
 * Run (Vite):
 *   pnpm build
 *   pnpm tsx .cursor/skills/react-stinger/scripts/bundle-budget-check.ts dist/
 *
 * Run (Next.js):
 *   pnpm build
 *   pnpm tsx .cursor/skills/react-stinger/scripts/bundle-budget-check.ts .next/
 *
 * Configure budgets in `react-stinger.budgets.json` at repo root:
 *
 *   {
 *     "defaults": { "firstLoadJs": 300 },       // KB gz
 *     "routes": {
 *       "/":              { "firstLoadJs": 90 },
 *       "/app/login":     { "firstLoadJs": 120 },
 *       "/app/dashboard": { "firstLoadJs": 300 }
 *     },
 *     "waivers": [
 *       { "route": "/app/editor", "until": "2026-06-30", "reason": "monaco (ADR-014)" }
 *     ]
 *   }
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';
import process from 'node:process';

type Budgets = {
  defaults: { firstLoadJs: number };
  routes: Record<string, { firstLoadJs: number }>;
  waivers?: { route: string; until: string; reason: string }[];
};

async function readBudgets(): Promise<Budgets> {
  try {
    return JSON.parse(await readFile('react-stinger.budgets.json', 'utf8'));
  } catch {
    return { defaults: { firstLoadJs: 300 }, routes: {} };
  }
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

async function gzSize(path: string): Promise<number> {
  const buf = await readFile(path);
  return gzipSync(buf).length;
}

async function main() {
  const buildDir = process.argv[2] ?? 'dist';
  const budgets = await readBudgets();

  const files = await walk(buildDir);
  const byRoute = new Map<string, number>();

  for (const f of files) {
    const rel = relative(buildDir, f);
    // Heuristic: map chunk file to route. Real impls parse the build manifest
    // (Vite's stats.json, Next's .next/build-manifest.json).
    const route = chunkToRoute(rel);
    const size = await gzSize(f);
    byRoute.set(route, (byRoute.get(route) ?? 0) + size);
  }

  const violations: { route: string; actual: number; budget: number }[] = [];

  for (const [route, size] of byRoute) {
    const kb = size / 1024;
    const budget = budgets.routes[route]?.firstLoadJs ?? budgets.defaults.firstLoadJs;
    if (kb > budget) {
      const waived = budgets.waivers?.some((w) => w.route === route && new Date(w.until) > new Date());
      if (!waived) violations.push({ route, actual: kb, budget });
    }
  }

  console.log('# Bundle budget report');
  console.log('');
  for (const [route, size] of [...byRoute].sort()) {
    const kb = (size / 1024).toFixed(1);
    const budget = budgets.routes[route]?.firstLoadJs ?? budgets.defaults.firstLoadJs;
    const mark = Number(kb) > budget ? 'OVER' : 'ok';
    console.log(`- ${route.padEnd(30)} ${kb.padStart(8)} KB gz  (budget ${budget})  ${mark}`);
  }
  console.log('');

  if (violations.length > 0) {
    console.error(`FAIL — ${violations.length} route(s) over budget.`);
    process.exit(1);
  }
  console.log('PASS');
}

function chunkToRoute(chunk: string): string {
  // Very naive mapping for the stub; real impl reads the framework's manifest.
  // Example: 'assets/app-login-a1b2c3.js' -> '/app/login'
  const base = chunk.replace(/\.[a-f0-9]{6,}\.js$/, '').replace(/^assets\//, '').replace(/-/g, '/');
  return '/' + base.replace(/\/index$/, '');
}

main();
