---
name: "preact-stinger"
description: "Preact 11 specialist skill: signals-based reactivity (v2 API with createModel/useModel), preact/compat migration from React, third-party embed widgets (shadow DOM isolation, IIFE bundles), Astro island integration (client:* directives, 5.0.1 or newer useId fix), and Fresh 2.x framework (Deno-native, islands + serializable props). Use when building Preact components, evaluating Preact vs React, migrating from React to Preact, embedding a widget on third-party pages, or working with Astro or Fresh projects. Do NOT use for React architecture in general (react-worker-bee), Next.js App Router configuration (react-worker-bee), or Deno infrastructure beyond Fresh (devops-worker-bee)."
---

# preact-stinger

Procedural arsenal for `preact-worker-bee`, the Hive's Preact 11 specialist. This stinger encodes the opinionated decision framework, the signals API (v2), the `preact/compat` compatibility surface, the third-party embed pattern, and the Astro/Fresh integration playbooks.

**First-read priority:** Start with `guides/00-when-to-choose-preact.md`. If you have already classified the scenario, jump to the relevant guide. The research summary is at `research/research-summary.md`.

---

## When this stinger applies

Load this stinger when any of the following is true:

- The user is evaluating Preact vs React for a new project.
- The user is migrating an existing React codebase to Preact via `preact/compat`.
- The user is building a third-party embed widget and bundle size is a constraint.
- The user is working in an Astro project and wants to use Preact islands.
- The user is working in a Fresh 2.x project.
- The user has Preact code to review, debug, or refactor.
- The user asks about signals (`signal`, `computed`, `effect`, `createModel`).

Do NOT load for:
- Pure React architecture questions → `react-worker-bee`.
- Next.js App Router configuration → `react-worker-bee` (and warn: `preact/compat` + App Router is a footgun).
- Deno DevOps beyond Fresh (deploy configs, Docker, etc.) → `devops-worker-bee`.
- Design system or token decisions → `ux-ui-svelte-worker-bee`.

---

## Scenario classification (read first)

Before applying any guide, classify the incoming request:

| Scenario | Key signal | Primary guide |
|---|---|---|
| New project, evaluating Preact | "should I use Preact?", bundle size target, no existing React code | `guides/00-when-to-choose-preact.md` |
| Signals authoring | "signals", "signal()", "computed()", "createModel" | `guides/01-signals-api.md` |
| React-to-Preact migration | existing React codebase, `preact/compat`, alias setup | `guides/02-compat-migration.md` |
| Third-party embed widget | "embed", "third-party script", "widget", shadow DOM, bundle budget | `guides/03-embed-widget.md` |
| Astro integration | `@astrojs/preact`, `client:*` directives, Astro project | `guides/04-astro-integration.md` |
| Fresh framework | Fresh, Deno, `islands/`, `deno.json` | `guides/05-fresh-framework.md` |

If the scenario is ambiguous, ask one targeted clarifying question before diving into code.

---

## Critical directives

These are non-negotiables for `preact-worker-bee`. Each has a one-line "why".

- **Never recommend Preact without naming the concrete benefit.** Why: "smaller bundle" is not a reason; the specific size delta, embed constraint, or signals preference must be stated.
- **Always check `preact/compat` compatibility before migrating.** Why: React 19 `use()`, `useTransition`, RSC, and `@types/react` each break compat silently or noisily.
- **`@types/react` must NEVER be installed alongside `preact/compat`.** Why: type conflicts are pervasive and hard to debug; use `preact`'s built-in types only.
- **Next.js App Router + `preact/compat` = footgun. Stop and warn.** Why: RSC requires React's fiber; compat wraps but does not replace it, producing silent failures.
- **Scope signals to the specific use case.** Why: mixing naive `useState` patterns with signals produces tracking bugs; the mental model shift must be explicit.
- **Defer to `react-worker-bee` for React architecture.** Why: the two worker-bees share JSX surface but own different mental models; crossing produces contradictory advice.

---

## Version anchors (May 2026)

| Package | Stable version | Notes |
|---|---|---|
| preact | 10.x (v11 beta) | v11 beta as of Aug 2025; check for stable |
| @preact/signals | 2.9.0 | v2 API is current |
| preact-custom-element | 4.6.0 | embed/web component wrapper |
| @astrojs/preact | 5.1.2 | **require >= 5.0.1** (useId bug fixed) |
| Fresh | 2.2.2 | Vite-based; Fresh 1.x is esbuild |

> Source: `research/internal/2026-05-20-stinger-folder-context.md`

---

## Folder layout

```
preact-stinger/
├── SKILL.md                         (this file — master index)
├── README.md                        (one-page human overview)
├── guides/
│   ├── 00-when-to-choose-preact.md  (tradeoff matrix + honest "when React wins")
│   ├── 01-signals-api.md            (v1 primitives + v2 model pattern)
│   ├── 02-compat-migration.md       (alias setup, known gaps, migration checklist)
│   ├── 03-embed-widget.md           (shadow DOM, IIFE bundle, size checklist)
│   ├── 04-astro-integration.md      (client: directives, useId fix, compat in Astro)
│   └── 05-fresh-framework.md        (islands, serializable props, signals state)
├── examples/
│   ├── happy-path-signals-component.md
│   └── compat-migration-vite.md
├── templates/
│   └── migration-checklist.md
├── reports/
│   └── README.md
└── research/                        (authored by scripture-historian — do not modify)
    ├── research-plan.md
    ├── research-summary.md
    ├── index.md
    ├── external/
    └── internal/
```

---

*Forged by `stinger-forge` from `preact-worker-bee-command-brief.md` and `research/`. Part of The Hive by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
