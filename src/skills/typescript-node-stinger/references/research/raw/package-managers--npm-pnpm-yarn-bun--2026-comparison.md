# npm vs pnpm vs Yarn Berry vs Bun: install mechanism, monorepos, production reliability (2026)

- URL: https://www.nazarboyko.com/articles/package-managers-compared-npm-pnpm-yarn-bun
- Fetched: 2026-08-14
- Source type: Blog (long-form technical comparison, 2026-05-30)
- Component: Package manager selection

## Content

### The four tools' core architectural bets (why the benchmarks look the way they do)

- **npm** - ships with Node, flat-hoists `node_modules` (since npm v3, 2015) to fight Windows path-length limits. Hoisting is the direct cause of phantom dependencies (code can `require()` a package it never declared in `package.json`, because hoisting happened to place it at the top level; this breaks unpredictably the day the hoisting shape changes).
- **pnpm** (first released June 2017) - single global content-addressable store, hard-linked into each project via a `.pnpm/` virtual store, then symlinked into the visible `node_modules`. Same package version used across N projects is stored once on disk. Strict dependency resolution: code can only import what it declares, by construction of the symlink graph - phantom dependencies become structurally impossible rather than just discouraged.
- **Yarn Berry (Yarn 2+ / v4)** - Plug'n'Play (PnP) removes `node_modules` entirely in favor of a single `.pnp.cjs` lookup-table file mapping `(package, version)` to on-disk location (zip archives in the global cache), patched directly into Node's module resolver. "Yarn Classic" (v1) is now legacy/maintenance-only and explicitly not recommended for new projects. Yarn Berry also supports a conventional `nodeLinker: node-modules` mode that behaves more like pnpm (loses PnP's strictness/speed, gains compatibility).
- **Bun** (1.0 in September 2023) - a from-scratch, Zig-then-Rust-rewritten package manager that produces a flat, npm-shaped `node_modules` (no exotic indirection), fast because it's a compiled binary with high install parallelism, not because of a different dependency-resolution model. **Note:** Bun was acquired by/joined Anthropic in December 2025, per this source - relevant context for its long-term maintenance trajectory as of this research window.

### Install speed, with explicit caveats against over-weighting it

- Cold install (no lockfile/cache): Bun typically 5-20x faster than npm; pnpm and Yarn Berry typically 2-3x faster than npm. Gap widens with larger dependency graphs.
- Warm install (lockfile + primed cache): gap shrinks dramatically across all four - now measuring filesystem speed more than package-manager algorithm.
- CI install (lockfile + clean cache, i.e. the scenario that matters most for a team): resembles the cold-install picture (Bun fastest, pnpm/Yarn close behind, npm slowest), but a CI-side package-manager-store cache collapses the gap again.

Explicit caveat from the source: benchmark numbers vary by project/machine/week - "the 17x-faster-than-npm claim you see in blog posts is real for a specific project on a specific machine. Your project might see 4x. It might see 25x." And: install-speed savings only matter when they're the bottleneck in the actual dev loop - "if `npm install` takes 90 seconds but your test suite takes 12 minutes, switching to Bun saves you 75 seconds and you'll forget you did it."

### Lockfile formats

- `package-lock.json` (npm, lockfileVersion 3) - verbose JSON, noisy-but-readable diffs, mechanical merge-conflict resolution (accept theirs, re-run install).
- `pnpm-lock.yaml` - terser YAML, pnpm has invested in keeping diffs minimal across versions; described as "noticeably easier to read in code review" than npm's in a monorepo with a dozen workspaces.
- `yarn.lock` - Yarn's own YAML-ish (not quite YAML) format, deliberately optimized for readable diffs since 2016; Berry extends the same shape with PnP metadata.
- `bun.lock` - originally binary (`bun.lockb`, fast but unreviewable in a PR diff, catastrophic on merge conflict); Bun switched to a text-based JSONC `bun.lock` as the **default as of Bun v1.2**. Existing projects migrate via `bun install --save-text-lockfile`. New Bun projects today get the text format automatically.

### Monorepo/workspace support - this is where the four diverge most

- **npm workspaces** - basic; hoisted deps + symlinks between local packages; no `workspace:` protocol support, so a package can't hard-guarantee "always resolve to the local workspace copy, never the registry" the way pnpm/Yarn can.
- **pnpm workspaces** - described as "the strongest option ... not particularly close." `pnpm-workspace.yaml` declares member globs; the `workspace:*` protocol is a hard guarantee resolved only to the local copy, and pnpm automatically rewrites `workspace:*` to the real published version number at publish time (so a package can never accidentally ship a manifest referencing a local-only version). Each workspace package additionally gets its own strict, isolated `node_modules` - cross-workspace phantom dependencies ("this app only works because it accidentally imports a package from a sibling lib's node_modules") are structurally prevented.
- **Yarn Berry workspaces** - equivalent `workspace:` protocol semantics to pnpm. Pulls ahead specifically via its plugin ecosystem (parallel cross-workspace script running, cross-workspace dependency constraints, TypeScript project-reference integration).
- **Bun workspaces** - functional, `workspace:` protocol supported as of Bun 1.x, but "the youngest of the four implementations" - smaller gap to pnpm/Yarn than in 2024 but still the newest/least battle-tested.

Source's rule of thumb: new monorepo with more than 2-3 packages -> pnpm or Yarn Berry. Already on Bun as a runtime -> stay on Bun, accept occasional rough edges. On npm with a monorepo no bigger than 4-5 packages -> npm workspaces are fine, don't switch just for the sake of switching.

### Production reliability factors (ranked by how often they actually bite a team)

1. **Strict-mode dependency resolution** - phantom dependencies are named as "the single most common cause of 'works on my machine, breaks in CI/staging/prod' incidents in JavaScript." npm and Bun's flat hoisting allow them; pnpm prevents them structurally by default; Yarn PnP prevents them by default; Yarn in `node-modules` linker mode allows them again. Direct claim: "If you only take one thing from this article, take this one: strict dependency resolution is a free upgrade."
2. **Deterministic/frozen installs in CI** - all four support a frozen-lockfile flag (`npm ci`, `pnpm install --frozen-lockfile`, `bun install --frozen-lockfile`, Yarn's default-in-CI immutable installs). Explicit warning: skipping the frozen-lockfile flag in CI lets a misaligned lockfile silently rewrite itself, shipping dependency versions nobody reviewed.
3. **Supply-chain hygiene** - all four support integrity hashes; differ on policy hooks. pnpm has `onlyBuiltDependencies` and a minimum-release-age setting (blocks installing a package version published too recently, a defense against hijacked-release supply-chain attacks); Yarn has plugins for similar; npm added `--no-scripts` and audit/provenance signals; Bun is described as youngest here with a smaller supply-chain-plugin ecosystem, though basics are present.
4. **Postinstall-script edge cases** - native-module packages (node-gyp builds, prebuilt binaries, Prisma's engine downloads) run via postinstall scripts; pnpm's strict layout and Yarn PnP both have documented edge cases where a postinstall script assumes a `node_modules` shape that isn't true under their model. Usually fixable with a one-line config or tool update, but worth testing before broadly recommending a package manager change on a project with heavy native deps.

### Bottom-line recommendation (source's own verdict, stated directly)

"If you're starting a new project today and nothing pushes you in another direction, use pnpm. The strict dependency resolution alone is worth it. The disk savings are real. The monorepo story is the strongest of the four." Staying on an already-working npm setup is explicitly endorsed too ("the benchmark wins are not worth the migration cost on a working project") - this is not a "always migrate" argument, it is a "pnpm is the better default for a new project" argument specifically.
