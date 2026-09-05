# Scripts

Three stub scanners react-stinger can invoke on a codebase. All are written in TypeScript; run with `pnpm tsx` (or `npx tsx`).

## `scan-anti-patterns.ts`

AST scan for the first 8 anti-patterns in `guides/12-anti-patterns.md`. Emits a markdown report; exit code = number of must-fix findings.

```bash
pnpm tsx .claude/skills/react-stinger/scripts/scan-anti-patterns.ts src/
```

Dependencies: `ts-morph`.

## `bundle-budget-check.ts`

Checks built bundle sizes against per-route budgets from `react-stinger.budgets.json`. Fails CI on violation unless a waiver is recorded.

```bash
pnpm build
pnpm tsx .claude/skills/react-stinger/scripts/bundle-budget-check.ts dist/
```

See `guides/07-performance.md §bundle-budgets` for default budgets.

## `react-version-audit.ts`

Reads `package.json` and reports React version, Compiler readiness, deprecated dependencies, and which version-specific idioms apply.

```bash
pnpm tsx .claude/skills/react-stinger/scripts/react-version-audit.ts
```

Run this **first** on any invocation: the output tells you which guides are relevant for the stack.

## Adapting

These are stubs. Expected to be extended per project:

- Add detectors for anti-patterns #4-12 in `scan-anti-patterns.ts`.
- Wire real build-manifest parsing in `bundle-budget-check.ts` (Vite `stats.json`, Next `.next/build-manifest.json`).
- Extend `react-version-audit.ts` with framework-specific checks (Next.js pages-vs-app, Remix loader presence).
