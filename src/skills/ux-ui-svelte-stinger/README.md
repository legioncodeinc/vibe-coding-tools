# ux-ui-svelte-stinger

The Svelte 5 + SvelteKit UI enforcement and implementation skill for the OSPRY
SvelteKit apps (portal, web, wl). Owns the shadcn-svelte 1.x + Tailwind v4
standard adopted in ADR-007, including the `@theme` token bridge to the existing
PRD-071 design tokens and the white-label brand contract preservation.

## Why this skill exists

The portal, web, and wl SvelteKit apps have poor UI standardization: 199
`.svelte` files in the portal alone, 66 with bespoke `<style>` blocks, ad-hoc
button/control classes scattered across routes. ADR-007 adopts shadcn-svelte +
Tailwind v4 as the standard, rolled out in phases. This skill is the procedural
arsenal that enforces and implements that decision.

## Source documents

- **Decision:** [`library/knowledge/private/architecture/ADR-007-shadcn-svelte-and-tailwind-v4-as-ui-standard.md`](../../../../library/knowledge/private/architecture/ADR-007-shadcn-svelte-and-tailwind-v4-as-ui-standard.md)
- **Research manifest:** [`research/research-summary.md`](research/research-summary.md)
- **Existing token system:** `apps/portal/src/lib/styles/{tokens,brand,base,shell}.css`

## Structure

```
ux-ui-svelte-stinger/
├── SKILL.md                       # the index + when-to-use (read first)
├── guides/                        # the procedural instruction set
│   ├── 00-principles.md
│   ├── 01-installation-phase-0.md
│   ├── 02-token-bridge.md         # the load-bearing guide
│   ├── 03-component-anatomy.md
│   ├── 04-dark-mode-inversion.md
│   ├── 05-white-label-preservation.md
│   ├── 06-surface-migration.md
│   └── 07-violations-and-guardrails.md
├── examples/                      # worked before/after
│   ├── phase-0-app-css.md
│   └── button-surface-migration.md
├── templates/                     # fill-in stubs
│   ├── phase-0-done-checklist.md
│   └── ui-review-output.md
├── reports/                       # past review runs (audit trail)
└── research/                      # raw primary-source dumps (READ-ONLY)
```

## Paired Bee

`ux-ui-svelte-worker-bee` (at `.claude/agents/ux-ui-svelte-worker-bee.md`) wields
this Stinger. The Bee is the persona + guardrails; this Stinger is the
procedural arsenal.

## Maintenance

Researched against the versions in `research/library-versions.md`. When a major
version of shadcn-svelte, Tailwind, or Bits UI ships:

1. Write a fresh `research/YYYY-MM-DD-<library>-vX-migration.md` note.
2. Update the affected guide(s).
3. Update `research/library-versions.md`.
