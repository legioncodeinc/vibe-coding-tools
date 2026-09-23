# Installation and the CLI

Full command/flag detail lives in [references/cli-command-reference.md](../references/cli-command-reference.md). This guide is the procedure.

## First install (SvelteKit)

1. Scaffold a project with Tailwind CSS already wired in: `pnpm dlx sv create my-app --add tailwindcss` [research/raw/02-installation-sveltekit-and-components-json.md].
2. If you're not using the default `$lib` alias, add your alias to `svelte.config.js`'s `kit.alias` before running the CLI [research/raw/02-installation-sveltekit-and-components-json.md].
3. Run `npx shadcn-svelte@latest init`. You'll be asked: base color, path to your global CSS file (it will be overwritten), and import aliases for lib/components/utils/hooks/ui [research/raw/02-installation-sveltekit-and-components-json.md].
4. This writes `components.json`, the project config the CLI reads on every subsequent `add` [research/raw/02-installation-sveltekit-and-components-json.md].
5. Add your first component: `npx shadcn-svelte@latest add button`. It lands at `$lib/components/ui/button/` (or wherever your `ui` alias points) [research/raw/02-installation-sveltekit-and-components-json.md].

Non-SvelteKit (Vite-only) projects follow the same `init` → `add` shape; the difference is the scaffolding step before `init`, not the CLI itself.

## Why components split across files (not one file per component)

Unlike shadcn/ui React, where a full component can live in a single `.tsx` file, Svelte doesn't support multiple components per file. So the CLI creates a folder per component, sometimes with just one `.svelte` file, sometimes several, always with an `index.ts` barrel export so you still get a single import [research/raw/02-installation-sveltekit-and-components-json.md]. See [references/component-anatomy-example.md](../references/component-anatomy-example.md) for the worked shape.

## components.json fields worth knowing

- `tailwind.css`: path to the CSS file the CLI writes tokens/imports into.
- `tailwind.baseColor`: locked in at init, cannot change without regenerating components.
- `aliases.{lib,utils,components,ui,hooks}`: where generated files land; must match real path aliases configured in `svelte.config.js`.
- `typescript`: boolean, or an object pointing at a custom tsconfig path.
- `registry`: the URL the CLI fetches components from; pin this to a fork or preview release if needed.

[research/raw/02-installation-sveltekit-and-components-json.md]

## Adding components

```bash
npx shadcn-svelte@latest add button card dialog
npx shadcn-svelte@latest add --all
npx shadcn-svelte@latest add https://example.com/r/custom-block.json
```

`add` resolves both first-party component names and full URLs to custom registry items in one call. Run with no arguments to list everything installable [research/raw/01-cli-command-reference.md].

## Presets

`apply <preset>` installs a bundled theme/style/font combination in one shot; `--only theme` or `--only font` narrows it to just that slice without touching component files [research/raw/01-cli-command-reference.md].

## What init actually installs

Per the npm package description: "The `init` command installs dependencies, adds the `cn` util, configures, and sets up CSS variables for the project" [research/raw/01-cli-command-reference.md]. It does not install every component; component installation is always an explicit `add`.

## Version note

At time of research, the current npm version was 1.4.2 (Jul 2026); the Svelte 5 / Tailwind v4 line stabilized as `1.0.0` in Jun 2025 after a long `1.0.0-next.*` prerelease track [research/raw/11-changelog-and-versions.md]. Always confirm current version before assuming a flag exists; the CLI has grown flags over time (`--no-deps-install`, `apply`, `registry build` were all later additions per the changelog history) [research/raw/11-changelog-and-versions.md].
