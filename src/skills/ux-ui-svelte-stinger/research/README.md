# Research: ux-ui-svelte-stinger

> Raw primary-source dumps for the shadcn-svelte 1.x + Tailwind v4 stack adopted
> in ADR-007. Gathered by scripture-historian-equivalent research (Exa-backed web
> search for discovery; the Firecrawl-scrape-equivalent web reader for raw doc
> extraction). These files are the audit trail: guides cite them, never replace
> them. Do not edit the dumps; add a dated note if a source changes.

## Scope

Two pillars only, per the decision owner's scope cut:

1. **shadcn-svelte 1.x**: the copy-in component layer (built on Bits UI v2 +
   Melt UI).
2. **Tailwind CSS v4**: the CSS-first utility layer with the `@theme` directive
   that bridges to OSPRY's existing PRD-071 token system.

Bits UI and Svelte 5 runes appear as **supporting context** inside the
shadcn-svelte dumps (they're how the components work), but they are not separate
pillars. No deep-dive on Bits UI as a standalone library.

## Files

### shadcn-svelte pillar

- `shadcn-svelte-installation-sveltekit.md`: the canonical SvelteKit install
  flow (the `sv add tailwind` + `shadcn-svelte@latest init` + `add` sequence).
- `shadcn-svelte-cli.md`: the `init` and `add` commands, what they write.
- `shadcn-svelte-tailwind-v4-migration.md`: the Tailwind v3-to-v4 + Svelte 4-to-5
  migration guide (re-anchoring for existing projects).
- `shadcn-svelte-theming.md`: CSS-variable theming, `@theme inline`, the
  `--background` / `--foreground` / `--primary` convention, oklch.
- `shadcn-svelte-dark-mode.md`: `.dark` class strategy, `data-` attribute mode,
  `mode-watcher`.
- `shadcn-svelte-button-component.md`: the canonical copy-in primitive; shows
  the source shape (`variants`, `type Props = ...`, the `cn` merge).

### Tailwind v4 pillar

- `tailwind-v4-theme-variables.md`: the `@theme` directive, namespaces, default
  theme, `inline` vs `static`, sharing across projects (monorepo).
- `tailwind-v4-upgrade-guide.md`: `@tailwindcss/vite` plugin, removed/renamed
  utilities, the `@reference` rule for Svelte `<style>` blocks.

### Supporting (read-on-demand)

- `library-versions.md`: the version pins this research was gathered against.
- `research-summary.md`: the manifest: depth, top sources, open questions.
- `index.md`: one-line view of every research file.

## Provenance

| Source | URL |
|---|---|
| shadcn-svelte docs | https://www.shadcn-svelte.com/docs |
| Tailwind v4 docs | https://tailwindcss.com/docs |
| Bits UI docs (referenced) | https://www.bits-ui.com/docs |

Gathered 2026-06-29.
