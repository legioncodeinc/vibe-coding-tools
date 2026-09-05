---
name: "tailwind-stinger"
description: "Tailwind CSS v4 the framework itself, CSS-first config, @theme, the Vite plugin, v3-to-v4 migration, dark mode, container queries, class ordering. Generic, any codebase, not OSPRY-specific."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork. Any codebase using Tailwind CSS v4; Vite/SvelteKit examples included alongside framework-agnostic guidance.
metadata:
  hive-bee: tailwind-worker-bee
  research-window: 2026-02-14 to 2026-08-14
---

# Tailwind Stinger

You are holding the knowledge for Tailwind CSS v4, the framework and engine itself. This skill covers CSS-first configuration, the `@theme` directive and its namespaces, the full directive/function set (`@utility`, `@variant`, `@custom-variant`, `@apply`, `@reference`, `@source`), the `@tailwindcss/vite` plugin, v3-to-v4 migration, dark mode via `@custom-variant`, container queries, arbitrary values, class ordering with `prettier-plugin-tailwindcss`, and the Oxide engine's performance characteristics.

## Scope boundary (read this first)

This skill is about Tailwind CSS v4 the framework, general knowledge usable on any project. It is a sibling to, and explicitly not a replacement for, `ux-ui-svelte-stinger`, which owns the OSPRY-specific PRD-071 design-token contract, the `@theme inline` bridge into `apps/portal`, `apps/web`, and `apps/wl`, and the white-label `--brand-*` chain under ADR-007.

- **This skill answers**: "How does `@theme` work?", "How do I migrate this project from v3 to v4?", "How do I wire up the Vite plugin in SvelteKit?", "How do container queries work?", "Why isn't my dark mode class toggle doing anything?"
- **`ux-ui-svelte-stinger` answers**: "What should `--interactive` resolve to for OSPRY?", "Is this component on-brief?", "Does the white-label still work?", "How do I copy in a shadcn-svelte Button?"

If a task touches an OSPRY app's actual token values or brand contract, read `ux-ui-svelte-stinger` first. If a task is about Tailwind v4 mechanics that would be true on any codebase, this skill is the source of truth.

## When to use this skill

- Explaining or applying `@theme`, theme variable namespaces, or CSS-first configuration
- Migrating a project from Tailwind v3 to v4
- Setting up `@tailwindcss/vite`, including the SvelteKit 2 + Svelte 5 wiring
- Implementing or debugging dark mode / `@custom-variant`
- Using or explaining container queries (`@container`, `@min-*`, `@max-*`)
- Reviewing arbitrary-value usage (`bg-[#123456]`) and flagging when it should be a token instead
- Setting up class ordering (`prettier-plugin-tailwindcss`) or reviewing for utility-soup / premature `@apply` anti-patterns
- Explaining the Oxide engine's performance model

Do NOT use this skill for the OSPRY token contract or product-surface enforcement (`ux-ui-svelte-stinger`), Svelte component/runes architecture (`svelte-stinger`), or shadcn-svelte component internals (`shadcn-svelte-stinger`).

## File map

Load on demand; do not read everything up front.

| Path | Load when |
| --- | --- |
| `guides/00-principles.md` | Orienting to the v4 mental model and this skill's scope boundary |
| `guides/01-theme-and-tokens.md` | Deciding how to define, extend, override, or reset design tokens |
| `guides/02-migrating-v3-to-v4.md` | Running or reviewing a v3-to-v4 migration |
| `guides/03-vite-plugin-sveltekit-setup.md` | Wiring the Vite plugin, especially for SvelteKit 2 + Svelte 5 |
| `guides/04-dark-mode-and-variants.md` | Implementing or debugging dark mode / custom variants |
| `guides/05-container-queries.md` | Using `@container` and its variants |
| `guides/06-class-ordering-and-tooling.md` | Setting up or explaining `prettier-plugin-tailwindcss` |
| `guides/07-anti-patterns-and-performance.md` | Reviewing for utility soup, premature `@apply`, or explaining Oxide performance |
| `references/theme-directive-reference.md` | Exact `@theme` namespace-to-utility mapping and syntax |
| `references/v3-to-v4-migration-cheatsheet.md` | Full side-by-side breaking-change table |
| `references/sveltekit-vite-setup.md` | Exact copy-paste Vite config + `app.css` + `+layout.svelte` |
| `references/research/distilled-tailwind.md` | Verifying a claim or resolving a research conflict |
| `references/research/raw/` | Tracing a claim to its primary source |

## Quality bar

Every factual claim in this skill's guides and references traces to `references/research/raw/`. Where the archive disagrees with itself, or a claim comes from a single community source rather than official docs, the distillation and guides say so explicitly rather than presenting it as settled fact.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [ux-ui-svelte-stinger](../ux-ui-svelte-stinger) - The OSPRY-specific enforcement layer: PRD-071 token bridge, white-label brand contract, shadcn-svelte rollout across apps/portal, apps/web, apps/wl.
  - [svelte-stinger](../svelte-stinger) - Svelte 5 runes, component architecture, and SvelteKit patterns beyond styling.
  - [shadcn-svelte-stinger](../shadcn-svelte-stinger) - shadcn-svelte component library specifics: copy-in anatomy, Bits UI v2, Melt UI internals.
  - [dark-mode-theming-stinger](../dark-mode-theming-stinger) - Cross-framework dark mode and theming patterns beyond Tailwind's `@custom-variant` mechanics.
  - [design-system-stinger](../design-system-stinger) - Bootstrapping a design system from scratch, upstream of any Tailwind-specific token bridge.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
