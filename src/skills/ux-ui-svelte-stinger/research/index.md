# Research index: ux-ui-svelte-stinger

> One-line view of every research file. Source type, authority, relevance,
> topic. Use this to plan which files each guide cites.

| File | Source | Authority | Relevance | Topic |
|---|---|---|---|---|
| `shadcn-svelte-installation-sveltekit.md` | shadcn-svelte.com/docs/installation/sveltekit | Canonical (vendor) | **Critical** | The SvelteKit install flow; ADR-007 Phase 0 base |
| `shadcn-svelte-cli.md` | shadcn-svelte.com/docs/cli | Canonical (vendor) | **Critical** | `init` and `add` commands; what each writes |
| `shadcn-svelte-tailwind-v4-migration.md` | shadcn-svelte.com/docs/migration/tailwind-v4 | Canonical (vendor) | **Critical** | The `app.css` destination shape; `@theme inline` |
| `shadcn-svelte-theming.md` | shadcn-svelte.com/docs/theming | Canonical (vendor) | **Critical** | The `--background`/`--primary`/etc. token convention |
| `shadcn-svelte-dark-mode.md` | shadcn-svelte.com/docs/dark-mode | Canonical (vendor) | High | `.dark` class strategy, mode-watcher, OSPRY dark-first inversion |
| `shadcn-svelte-button-component.md` | shadcn-svelte.com/docs/components/button | Canonical (vendor) | High | Copy-in source shape; `tailwind-variants`, `$props()`, `child` snippet |
| `tailwind-v4-theme-variables.md` | tailwindcss.com/docs/theme | Canonical (vendor) | **Critical** | The `@theme` directive; `inline`/`static`; namespaces; monorepo sharing |
| `tailwind-v4-upgrade-guide.md` | tailwindcss.com/docs/upgrade-guide | Canonical (vendor) | High | `@tailwindcss/vite` plugin; `@reference` for Svelte `<style>`; renamed utils |
| `library-versions.md` | Synthesized | n/a | Reference | Version pins this corpus was gathered against |
| `research-summary.md` | Synthesized | n/a | Manifest | Depth, top sources, open questions |
| `README.md` | Synthesized | n/a | Map | Scope + provenance |

## Guide-to-research citation plan

- `guides/01-installation-phase-0.md` → cites install-sveltekit + cli + tailwind-upgrade-guide
- `guides/02-token-bridge.md` → cites shadcn-theming + tailwind-theme-variables + shadcn-tailwind-v4-migration
- `guides/03-component-anatomy.md` → cites shadcn-button-component + shadcn-tailwind-v4-migration
- `guides/04-dark-mode-inversion.md` → cites shadcn-dark-mode + shadcn-theming
- `guides/05-white-label-preservation.md` → cites shadcn-theming + tailwind-theme-variables
- `guides/06-surface-migration.md` → cites cli + shadcn-button-component + shadcn-theming
- `guides/07-violations-and-guardrails.md` → cites tailwind-upgrade-guide + shadcn-theming
