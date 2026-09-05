# 28 - pnpm and monorepo options

**Primary context: SvelteKit app (+ Payload CMS) on Vercel.** This guide replaces the assumption behind `references/npm-vs-pnpm.md` (which documents why the Hivemind case specifically stays on npm) with the opposite default for THIS repo's stack. Both are correct in their own context - see the framing note at the end.

## pnpm is the default for this stack, not npm

Unlike the Hivemind case (npm, because the lockfile/lifecycle scripts/publish flow all assume it - see `guides/14-npm-and-publishing.md` and `references/npm-vs-pnpm.md`), a SvelteKit app on Vercel with no npm-publish contract to protect has no equivalent lock-in reason to stay on npm. Current research gives pnpm as the stronger default for a new project:

- **Structural phantom-dependency prevention.** pnpm's content-addressable store + symlink graph means code can only import what it actually declares in `package.json` - npm's flat hoisting allows importing an undeclared package that happens to be hoisted nearby, which works until a minor dependency bump changes the hoisting shape and breaks in CI or production with no code change on your side. This is named directly as "the single most common cause of 'works on my machine, breaks in CI/staging/prod' incidents in JavaScript."
- **Install speed.** Typically 2-3x faster than npm on cold/CI installs.
- **Disk efficiency.** One copy of each package version on disk, hard-linked across every project on the machine.
- **Monorepo support.** Described as "the strongest option... not particularly close" among npm/pnpm/Yarn/Bun - the `workspace:*` protocol is a hard local-only guarantee (auto-rewritten to the real published version at publish time), and each workspace package gets its own strict, isolated `node_modules`.
- **Vercel compatibility.** Vercel's Turborepo auto-detection and build-command inference work natively with pnpm workspaces - confirmed independently in this repo's `vercel-stinger` research archive.

Source: `references/research/raw/package-managers--npm-pnpm-yarn-bun--2026-comparison.md`.

## What this does NOT mean

This is "pnpm is the better default for a new project," not "migrate every existing npm project immediately." If this repo (or a specific package within it) is already on npm and working, the migration cost is a real cost to weigh against the benefit - don't propose a package-manager swap as a drive-by suggestion in an unrelated PR. Flag it as a should-refactor with the reasoning above, let the team decide the timing.

## Monorepo tooling: Turborepo + pnpm workspaces is the common pairing for this shape

For a SvelteKit(+Payload) app, the most common and best-supported combination is pnpm workspaces (dependency management) + Turborepo (task orchestration/caching) - two purpose-built tools handling two separate concerns, not one tool trying to do both.

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

```json
// apps/web/package.json
{
  "dependencies": { "@org/ui": "workspace:*" }
}
```

Vercel auto-detects a Turborepo monorepo and sets Build Command to `turbo run build` (or a filtered variant) and Root Directory to the specific app automatically. Payload CMS's own first-party integration story is Next.js-centric, not SvelteKit-centric - a SvelteKit+Payload monorepo runs Payload as its own standalone server (Express or Payload's Node adapter) alongside, not embedded inside, the SvelteKit app. This is confirmed by community example repos pairing SvelteKit with a separate Payload+tRPC server inside one Turborepo/pnpm workspace, not by an official Payload SvelteKit integration (none exists as of this research pass).

Source: `references/research/raw/monorepo--turborepo-pnpm-sveltekit-example.md`.

## Nx: know when it earns its place, don't default to it prematurely

Nx's own comparison against Turborepo (disclosed benchmark methodology, but Nx's own advocacy page - treat the framing, not the raw numbers, as one-sided) documents real advantages at scale: composable `namedInputs` caching (vs Turborepo's flat, repeated input lists), task sandboxing/cache-poisoning protection (Turborepo has none, tied explicitly to CVE-2025-36852/"CREEP"), built-in distributed CI (roughly 2x faster than Turborepo's manual task-binning across 4 machines on the same benchmark workspace), first-class AI-agent integration (`nx configure-ai-agents`, an MCP server, self-healing CI), polyglot-language support, and built-in release/versioning management.

These advantages become load-bearing specifically at a scale this repo may not yet be at: many packages, many CI machines needed for distribution, multiple non-JS services, or a dedicated platform team maintaining the monorepo tooling itself. A practitioner building a real multi-app SvelteKit Turborepo monorepo independently reports Turborepo's simplicity - "the entire configuration fits in 20 lines of JSON" - as the actual win for a smaller setup. Both framings are true at their respective scales; this is not a contradiction to resolve in favor of one tool universally.

**This skill's guidance**: default to pnpm workspaces + Turborepo for this repo's current shape. Revisit toward Nx specifically if/when the monorepo grows to need distributed CI across many machines, adds non-JS services, or gets a dedicated platform team - the trigger conditions Nx's own comparison names, not a default recommendation to adopt it now.

Source: `references/research/raw/monorepo--nx-vs-turborepo--official-comparison.md`.

## Common findings

- Proposing a package-manager migration as a drive-by change inside an unrelated PR - **should-refactor**, surface the recommendation separately with a migration plan, don't bundle it.
- A monorepo `workspace:*` reference left unresolved incorrectly at publish time (if this repo ever publishes an internal package) - **must-fix**, verify pnpm's publish-time rewrite actually ran.
- Adopting Nx before any of its scale-specific advantages are actually needed, adding tooling complexity with no corresponding benefit yet - **should-refactor**, revisit the decision against the trigger conditions above.
- A `pnpm-workspace.yaml` glob that doesn't match the actual `apps/`/`packages/` layout, silently excluding a package from workspace resolution - **must-fix**.

## Sources

- `references/research/raw/package-managers--npm-pnpm-yarn-bun--2026-comparison.md`
- `references/research/raw/monorepo--turborepo-pnpm-sveltekit-example.md`
- `references/research/raw/monorepo--nx-vs-turborepo--official-comparison.md`
- `references/research/distilled-typescript-node.md` sections 7-8
- `references/npm-vs-pnpm.md` for the contrasting Hivemind-case reasoning (why THAT package stays on npm)
