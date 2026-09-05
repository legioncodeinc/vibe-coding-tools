# husky vs lefthook vs lint-staged 2026 — PkgPulse Guides
- URL: https://www.pkgpulse.com/guides/husky-vs-lefthook-vs-lint-staged-git-hooks-nodejs-2026
- Fetched: 2026-08-14
- Source type: community-guide
- Component: git-hooks
- Published: 2026-03-09, Author: PkgPulse Team

## TL;DR

husky is the most popular Git-hooks manager for Node.js (~5M weekly downloads): simple `.husky/` shell-script setup, integrates with npm scripts. lefthook (~400K weekly downloads) is the fast, Go-based, multi-language alternative: parallel execution, ~10x faster on large projects, no Node.js runtime required. lint-staged (~8M weekly downloads) is not a hook runner but a companion — it scopes linters/formatters to files actually staged for commit. In 2026 the two viable combinations are: husky + lint-staged (industry standard, used by React/Next.js/Vite and thousands of OSS repos), or lefthook alone (built-in staged-file filtering, no lint-staged needed).

## husky setup

```bash
npm install -D husky
npx husky init   # creates .husky/pre-commit, adds "prepare": "husky" to package.json
```

Hooks are plain shell scripts:
```
# .husky/pre-commit
npm run lint
npm run type-check

# .husky/commit-msg
npx --no -- commitlint --edit $1

# .husky/pre-push
npm run test
```
The `prepare` script means `npm install` auto-installs hooks for every contributor — zero-effort onboarding. CI environments skip husky install automatically when `HUSKY=0` or a `CI` env var is set.

## husky + lint-staged (recommended combo)

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{js,jsx}": ["eslint --fix"],
    "*.{css,md,json}": ["prettier --write"]
  }
}
```
`.husky/pre-commit` then just runs `npx lint-staged`. Rationale: linting the whole repo on every commit (~30s for 500 files) is impractical; lint-staged scopes to the 1-2 changed files (~0.5s).

## commitlint integration

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```
```js
// commitlint.config.js
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", ["feat","fix","docs","style","refactor","perf","test","chore","ci","revert"]],
    "subject-max-length": [2, "always", 100],
  },
}
```

## lefthook

```bash
npx lefthook install   # creates lefthook.yml
```
```yaml
pre-commit:
  parallel: true
  commands:
    lint:
      glob: "*.{ts,tsx,js}"
      run: npx eslint --fix {staged_files}
      stage_fixed: true
    format:
      glob: "*.{ts,tsx,js,json,css,md}"
      run: npx prettier --write {staged_files}
      stage_fixed: true
    type-check:
      run: npx tsc --noEmit
commit-msg:
  commands:
    commitlint:
      run: npx commitlint --edit {1}
pre-push:
  commands:
    tests:
      run: npm test
```
`parallel: true` runs lint/format/type-check concurrently instead of sequentially (husky's default), cutting a 15s sequential run to ~8s (the longest single task). `{staged_files}` interpolates staged paths matching `glob` — the lint-staged behavior baked directly into the runner. `root:` scopes a command to a monorepo subdirectory, skipping it entirely when no staged files fall under that root — first-class monorepo support without shell-scripting `cd` chains.

## TypeScript-specific caveat (cross-source consensus)

Type-checking cannot be meaningfully scoped to staged files the way ESLint can, because `tsc`'s type graph spans the whole project — passing only staged files to `tsc --noEmit` produces misleading results (misses errors from relationships between the changed file and unstaged files). Correct approach: run `tsc --noEmit` on the *full* project inside a pre-commit or pre-push hook (accepting the latency), and reserve lint-staged/`{staged_files}` scoping for ESLint and Prettier only. Scoping the full type-check to pre-push rather than pre-commit avoids paying that latency on every single commit while still blocking a push with type errors.

## When to choose which (source's framing)

Choose husky + lint-staged if the team already lives in npm/pnpm/yarn scripts and is JS/TS-only — shortest path, most StackOverflow/tutorial coverage, but sequential execution and Node.js runtime dependency. Choose lefthook for large or polyglot repos where hook wall-clock time matters, for monorepos needing per-package scoping, or to avoid requiring Node.js on machines that shouldn't need it (e.g. a Go service living in the same repo). Migration from husky to lefthook is described elsewhere in the same source family as "mostly mechanical": remove husky + lint-staged, delete `.husky/`, remove the `prepare` script, write `lefthook.yml`, run `lefthook install`.
