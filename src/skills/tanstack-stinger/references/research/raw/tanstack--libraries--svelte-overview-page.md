# TanStack's own Svelte libraries landing page: the authoritative "what's real" list

- URL: https://tanstack.com/libraries/svelte
- Fetched: 2026-08-14
- Source type: Official TanStack landing page
- Component: TanStack / Svelte libraries index

## Content

TanStack's own official Svelte-specific libraries index describes itself as: "Type-safe, headless TanStack primitives with Svelte support for routing, data, UI, performance, and tooling."

This page is the closest thing to an authoritative single source for "which TanStack libraries have Svelte support" - but it must be read critically, not literally: the word "routing" in its own tagline does not correspond to an official TanStack Router Svelte adapter (confirmed absent, see `tanstack--router--no-official-svelte-support.md`). Cross-referencing this page's implied scope against the actually-shipped, versioned, npm-published packages found elsewhere in this research (`@tanstack/svelte-query`, `@tanstack/svelte-table`, `@tanstack/svelte-form`, `@tanstack/svelte-virtual`, `@tanstack/svelte-devtools`) is what this skill's status table (see distilled research §1) is built from - not this page's marketing copy alone.

## Gap

The full page content (library-by-library cards/links) was not captured in this pass beyond the tagline - treat this source as corroborating context for the tagline claim only, not as a verified complete library list. The per-library status table in this skill's distilled research is built primarily from the individual library documentation sources (Query, Table, Form, Virtual, Router, Start raw files), which are the higher-confidence sources for version/support-status claims.
