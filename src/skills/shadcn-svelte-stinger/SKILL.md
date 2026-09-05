---
name: "shadcn-svelte-stinger"
description: "The shadcn-svelte library itself for any Svelte project: CLI, copy-in model, anatomy, registry, theming, forms, upgrades. Not OSPRY's design system on portal/web/wl (ux-ui-svelte-stinger owns that)."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork. Any Svelte 5 + SvelteKit or Vite project adopting shadcn-svelte.
metadata:
  hive-bee: shadcn-svelte-worker-bee
  hive-tier: stinger
  paired-bee: shadcn-svelte-worker-bee
  research-window: 2026-02-14 to 2026-08-14
---

# shadcn-svelte Stinger

This skill covers the shadcn-svelte library itself: the CLI, the copy-in model, component anatomy, the registry system, generic theming mechanics, dark mode, forms, customization patterns, and accessibility inherited from Bits UI. It is generic: it applies to any Svelte 5 project adopting shadcn-svelte, not just OSPRY's apps.

## Boundary with ux-ui-svelte-stinger

Read this before doing anything else.

**This skill owns the shadcn-svelte library itself, generically**: `npx shadcn-svelte@latest init`/`add`/`apply`, the copy-in-your-repo model and why it matters for upgrades, component anatomy (`$props()`, `tv()`, `cn()`, `data-slot`), the registry system (`registry.json`, `registry-item.json`, custom/private registries), the generic CSS-variable theming vocabulary and its `@theme inline` bridge into Tailwind v4, dark mode mechanics (`mode-watcher`), forms (Formsnap + Superforms + Zod), customization patterns that survive upstream re-syncs, and accessibility inherited from Bits UI.

**`ux-ui-svelte-stinger` owns applying the OSPRY-specific design system built on top of this library**: enforcement of ADR-007 on `apps/portal`, `apps/web`, `apps/wl` specifically; the PRD-071 token bridge into `@theme`; the white-label `--brand-*` contract; OSPRY's dark-first inversion; per-surface migration workflow; and PR review of shadcn-svelte usage in those three apps.

If a question names `apps/portal`, `apps/web`, `apps/wl`, OSPRY branding, white-label, or ADR-007, it belongs to `ux-ui-svelte-stinger`, not here. If the question is about the library mechanics that would apply to any Svelte project, it's here. Full statement and rationale: [guides/00-principles.md](guides/00-principles.md).

## When to use this skill

- Installing or initializing shadcn-svelte in a new or existing Svelte project.
- Adding, updating, or customizing a copied-in component in `src/lib/components/ui/`.
- Reading or building a custom/private component registry.
- Wiring generic CSS-variable theming or the Tailwind v4 `@theme inline` bridge (not OSPRY's specific tokens).
- Implementing dark mode with `mode-watcher`.
- Building forms with Formsnap + Superforms + Zod.
- Planning how to re-sync a customized component with an upstream `add --overwrite`.
- Reviewing whether a piece of code correctly exercises Bits UI's accessibility contract.
- Answering "does shadcn-svelte have component X" or "what's different from shadcn/ui React."

Do not use for applying OSPRY's design system to portal/web/wl (`ux-ui-svelte-stinger`), for the Svelte 5 language/runes layer itself (`svelte-stinger`), or for Tailwind v4 mechanics in general outside the shadcn-svelte token bridge (`tailwind-stinger`).

## Procedure

| Step | Action | Guide |
|---|---|---|
| 1 | Confirm the question is generic-library, not OSPRY-specific. If OSPRY-specific, hand off. | [guides/00-principles.md](guides/00-principles.md) |
| 2 | If it's install/setup or a CLI command, follow the CLI procedure. | [guides/01-installation-and-cli.md](guides/01-installation-and-cli.md) |
| 3 | If reading or editing a copied-in component, apply the anatomy pattern. | [guides/02-component-anatomy.md](guides/02-component-anatomy.md) |
| 4 | If theming or CSS variables are in question, apply the token/bridge mechanics. | [guides/03-theming-and-css-variables.md](guides/03-theming-and-css-variables.md) |
| 5 | If dark mode is in question, apply the mode-watcher pattern. | [guides/04-dark-mode.md](guides/04-dark-mode.md) |
| 6 | If building a form, apply the Superforms + Formsnap + Zod stack. | [guides/05-forms-superforms-formsnap.md](guides/05-forms-superforms-formsnap.md) |
| 7 | If customizing a component that must survive a future upstream sync, follow the commit-diff-reapply workflow. | [guides/06-customizing-without-breaking-upgrades.md](guides/06-customizing-without-breaking-upgrades.md) |
| 8 | If reviewing accessibility or asked about a missing component, ground the answer in the research, not assumption. | [guides/07-accessibility-and-gaps-vs-react.md](guides/07-accessibility-and-gaps-vs-react.md) |
| 9 | Cite the governing guide and, where relevant, the underlying raw source, in every ruling. | (all guides) |

## Guides (read on demand)

- `guides/00-principles.md`: the copy-in philosophy, foundation stack, boundary with ux-ui-svelte-stinger restated in full, severity rubric.
- `guides/01-installation-and-cli.md`: init/add/apply/registry build, components.json fields.
- `guides/02-component-anatomy.md`: the four building blocks (tv, cn, $props, snippets), why variants live in a separate file, data-slot convention.
- `guides/03-theming-and-css-variables.md`: the generic token vocabulary, the `@theme inline` bridge, adding a token, base color presets.
- `guides/04-dark-mode.md`: mode-watcher mechanics, the flash-of-wrong-theme bug and its fix.
- `guides/05-forms-superforms-formsnap.md`: the full Zod + Superforms + Formsnap stack, Svelte 5 idiom, version pitfalls.
- `guides/06-customizing-without-breaking-upgrades.md`: the maintainer-endorsed commit/diff/reapply workflow, known CLI edge cases.
- `guides/07-accessibility-and-gaps-vs-react.md`: Bits UI accessibility mechanics, documented conflicts, genuine vs. false component gaps versus shadcn/ui React.

## References (load on demand)

- `references/cli-command-reference.md`: every CLI command and flag.
- `references/theming-token-reference.md`: the full generic CSS variable vocabulary.
- `references/component-anatomy-example.md`: a complete worked Button component in Svelte 5 runes idiom.

## Research foundation

This Stinger was forged from a dedicated primary-source archive, not training data. Fourteen raw sources (official shadcn-svelte docs, Bits UI docs, Melt UI docs, GitHub releases/discussions, and corroborating community write-ups) live in `references/research/raw/`, each headed with its URL, fetch date, and source type. The distilled, cited synthesis is `references/research/distilled-shadcn-svelte.md`; it flags every conflict between sources and every gap where research was thin rather than smoothing them into a guess. If a guide states a fact, it traces back through that file to a raw source.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [dark-mode-theming-stinger](../dark-mode-theming-stinger) - Generic dark mode and theming patterns beyond the shadcn-svelte-specific mode-watcher mechanics covered here.
  - [modal-toast-dialog-stinger](../modal-toast-dialog-stinger) - Modal, toast, and dialog UX patterns generically, complementing the Bits UI dialog-family accessibility mechanics covered here.
  - [design-system-stinger](../design-system-stinger) - Bootstrapping a new design system from scratch, for when a project needs more than shadcn-svelte's defaults.
  - [tailwind-stinger](../tailwind-stinger) - Tailwind v4 mechanics in general, beyond the shadcn-svelte `@theme inline` token bridge covered here.
  - [ux-ui-svelte-stinger](../ux-ui-svelte-stinger) - Owns applying the OSPRY-specific design system, PRD-071 token bridge, and white-label brand contract built on top of this library to apps/portal, apps/web, apps/wl specifically.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
