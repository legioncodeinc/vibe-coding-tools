# 29 - Node.js version policy on Vercel

**Primary context: SvelteKit app on Vercel.** Cross-references `vercel-stinger` for anything beyond the Node-version-specific facts below - this guide exists here because it's a `package.json`/`engines` concern this skill owns, not because this skill owns Vercel platform configuration generally.

## Pin `engines.node` explicitly

```json
{ "engines": { "node": "22.x" } }
```

Vercel only ever honors the **major** version from `engines.node` - it automatically rolls minor/patch versions forward within that major, including for security fixes. Pinning an exact patch (`"22.11.0"`) is not meaningful on Vercel specifically; the platform still only reads and enforces the major. An `engines.node` entry with an unbounded range (`>=18`, `>=16.x`) is a **should-refactor**: it silently opts into whatever major Vercel considers "latest" once a new one ships, which is a real behavior change (new Node major = potential breaking changes) sneaking in with no code change or review on this repo's side.

Source: `references/research/raw/vercel--node-js-version-policy.md`.

## Currently available versions and the Node 20 cutover

As of this research window: **24.x** (default for new projects), **22.x**, **20.x** (being deprecated). Node 20 reached its own upstream end-of-life on 2026-04-30; Vercel disables Node 20 for Builds and Functions on **2026-10-01**, for new deployments only - already-deployed function invocations are unaffected, but any new deployment on a project still pinned to 20.x will fail the build after that date.

If this repo (or any package within it) has `engines.node` set to `20.x` (or unset, relying on a dashboard setting that could be 20.x), that is a **must-fix** ahead of the October 2026 cutover - move to `22.x` or `24.x` now rather than discovering it at deploy time later.

## Two places the version lives, and which wins

1. Vercel Dashboard > Project Settings > Build and Deployment > Node.js Version (applies going forward to new deployments).
2. `package.json#engines.node` (overrides the dashboard setting for that project).

A team that changed the dashboard setting but left an older value in `package.json#engines.node` (or vice versa) will get a build-step warning and the `package.json` value wins - check both when auditing which Node version a project is actually deploying on, don't trust the dashboard alone.

## Verification

`node -v` in the Build Command, or `console.log(process.version)` at runtime, confirms the actual deployed version - useful when `engines.node`, the dashboard setting, and a local `.nvmrc` disagree and it's unclear which one Vercel is actually honoring.

## Common findings

- `engines.node` unset, or set to an unbounded range - **should-refactor**, pin explicitly to `"22.x"` or `"24.x"`.
- `engines.node` pinned to `"20.x"` (or lower) - **must-fix** ahead of the 2026-10-01 Vercel deprecation.
- `engines.node` and the dashboard Project Settings disagreeing, with nobody aware which one is actually active - **should-refactor**, reconcile and document which is the source of truth (this skill's position: `package.json#engines.node` should be the source of truth, since it's versioned and reviewed in PRs, unlike a dashboard click).
- An exact-patch pin (`"22.11.0"`) under the mistaken belief it locks the deployed patch version - **should-refactor**, correct the misunderstanding; Vercel only honors the major.

## Sources

- `references/research/raw/vercel--node-js-version-policy.md`
- `references/research/distilled-typescript-node.md` section 9
- [vercel-stinger](../../vercel-stinger/) for Vercel platform configuration beyond the Node-version field itself
