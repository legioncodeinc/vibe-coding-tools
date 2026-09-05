/**
 * scripts/react-version-audit.ts
 *
 * Stub — reads package.json, determines React + ecosystem versions, and
 * reports:
 *   - Whether the app is React 18 or 19
 *   - Whether React Compiler is adoptable
 *   - Which version-specific idioms apply (`guides/10-react-19-idioms.md`)
 *   - Deprecated libraries to retire (moment, enzyme, recoil, CRA, ...)
 *
 * Run:
 *   pnpm tsx .cursor/skills/react-stinger/scripts/react-version-audit.ts
 *
 * Output: markdown report to stdout; exit 0.
 */

import { readFile } from 'node:fs/promises';

type PackageJson = {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

const DEPRECATED: Record<string, string> = {
  moment: 'Use date-fns. See guides/13-ecosystem-catalog.md.',
  enzyme: 'Abandoned. Migrate to React Testing Library.',
  recoil: 'Meta deprecated. Migrate to Jotai.',
  'react-scripts': 'CRA retired. Migrate to Vite or Next.js.',
  'styled-components': 'Runtime CSS-in-JS. Prefer Tailwind / CSS Modules / vanilla-extract for new code.',
  '@emotion/styled': 'Runtime CSS-in-JS. Prefer Tailwind / CSS Modules / vanilla-extract for new code.',
};

async function main() {
  const pkg: PackageJson = JSON.parse(await readFile('package.json', 'utf8'));
  const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };

  const reactVersion = (deps.react ?? '').replace(/[^0-9.]/g, '');
  const [major] = reactVersion.split('.');

  console.log(`# React Version Audit — ${pkg.name ?? 'unnamed'}`);
  console.log('');
  console.log(`React: ${reactVersion || '(not found)'}`);
  console.log('');

  if (!major) {
    console.log('WARN — React not found in dependencies.');
    return;
  }

  if (Number(major) >= 19) {
    console.log('## React 19 idioms apply');
    console.log('- Actions + `useActionState` for forms (replaces manual loading state).');
    console.log('- `useOptimistic` for instant UI feedback on mutations.');
    console.log('- `useFormStatus` for nested submit buttons.');
    console.log('- `use()` hook for reading promises / contexts.');
    console.log('- Ref as a prop (retire new `forwardRef` usage).');
    console.log('- `<Context value=...>` (no `.Provider`).');
    console.log('');
  } else if (Number(major) === 18) {
    console.log('## React 18 — upgrade to 19 candidate');
    console.log('- Plan migration. See guides/10-react-19-idioms.md.');
    console.log('- React Compiler is still adoptable on React 18; consider enabling first.');
    console.log('');
  } else {
    console.log(`## React ${major} — upgrade required.`);
    console.log('');
  }

  // Compiler adoption check
  const hasCompilerPlugin = !!deps['eslint-plugin-react-compiler'];
  const hasCompilerRuntime = !!deps['babel-plugin-react-compiler'] || !!deps['react-compiler-runtime'];
  console.log('## React Compiler');
  if (hasCompilerPlugin && hasCompilerRuntime) {
    console.log('- Enabled. Good.');
  } else {
    console.log('- Not fully enabled.');
    if (!hasCompilerPlugin) console.log('  - Add `eslint-plugin-react-compiler` and fix violations.');
    if (!hasCompilerRuntime) console.log('  - Add compiler plugin to Babel / SWC / Vite config.');
    console.log('  - See guides/07-performance.md §react-compiler.');
  }
  console.log('');

  // Deprecated
  const toRetire = Object.keys(DEPRECATED).filter((p) => deps[p]);
  if (toRetire.length) {
    console.log('## Deprecated dependencies to retire');
    for (const p of toRetire) console.log(`- \`${p}\`: ${DEPRECATED[p]}`);
    console.log('');
  }

  // Stack classification
  console.log('## Stack classification');
  const stack = [
    deps.next ? `Next.js ${deps.next}` : null,
    deps.vite ? `Vite ${deps.vite}` : null,
    deps.remix ? `Remix ${deps.remix}` : null,
    deps['react-router'] ? `React Router ${deps['react-router']}` : null,
  ].filter(Boolean);
  console.log(`- Framework: ${stack.join(', ') || '(unclear — assume Vite SPA)'}`);
  console.log(`- Server cache: ${deps['@tanstack/react-query'] ? `TanStack Query ${deps['@tanstack/react-query']}` : deps.swr ? `SWR ${deps.swr}` : '(none — add TanStack Query)'}`);
  console.log(`- Global state: ${deps.zustand ? `Zustand ${deps.zustand}` : deps.jotai ? `Jotai ${deps.jotai}` : deps['@reduxjs/toolkit'] ? `RTK ${deps['@reduxjs/toolkit']}` : '(none — default Zustand)'}`);
  console.log(`- Forms: ${deps['react-hook-form'] ? `React Hook Form ${deps['react-hook-form']}` : '(none — default React Hook Form)'}`);
  console.log(`- Validation: ${deps.zod ? `Zod ${deps.zod}` : '(none — default Zod)'}`);
  console.log(`- Test runner: ${deps.vitest ? `Vitest ${deps.vitest}` : deps.jest ? `Jest ${deps.jest}` : '(none — default Vitest)'}`);
}

main().catch((e) => { console.error(e); process.exit(2); });
