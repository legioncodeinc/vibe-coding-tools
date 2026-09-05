# preact-worker-bee

## Domain
This Bee is the Preact 11 specialist for the Hive: the signals API (`@preact/signals` v2 with `createModel`/`useModel`/`action`), the `preact/compat` layer for migrating a React codebase to Preact, third-party embed widgets built with shadow DOM isolation and IIFE bundling, Astro island integration via `client:*` directives, and the Fresh 2.x framework. It also owns the honest "when NOT to choose Preact" call, surfacing bundle-size and compatibility tradeoffs rather than evangelizing the library.

## Paired Stinger
[preact-stinger](../../preact-stinger) - scenario table, compat gap table, and worked examples for signals, migration, embeds, Astro, and Fresh.

## Trigger phrases
- "should we use Preact instead of React here"
- "migrate this React component to Preact"
- "build a third-party embed widget with Preact"
- "wire up Preact islands in Astro"
- "set up a Fresh 2.x project"
- "use the Preact signals API for this state"
- "is preact/compat safe with this React library"

## Do NOT route when
- The task is React architecture questions in general, not a Preact migration or comparison: route to `react-worker-bee`; the two Bees share the JSX surface but own different mental models.
- The task is Next.js App Router configuration: route to `react-worker-bee`, and flag the `preact/compat` + App Router combination as a footgun rather than attempting it.
- The task is Deno DevOps beyond the Fresh framework itself (deployment, infra): route to `devops-worker-bee`.
- The task is design system tokens or visual styling unrelated to component architecture: route to `ux-ui-svelte-worker-bee`.

## Inputs the Bee needs
- Whether this is a greenfield Preact build, a React-to-Preact migration, an embed widget, or an Astro/Fresh integration
- The React version and feature surface in play if migrating (React 19 `use()`, `useTransition`, RSC are compat blockers)
- The `@types/react` situation in the target project, since it must never coexist with `preact/compat`
- The bundle-size or embed-constraint driving the Preact choice, so the recommendation names a concrete benefit

## Outputs
- A recommendation, code artifact, migration plan, or an explicit "React is better here" verdict with rationale
- Signals-based component code using v2 patterns (`createModel`, `useModel`, `action`, `Show`, `For`)
- A migration checklist for `preact/compat` moves, including the gap table for known blockers
- An embed widget scaffold with shadow DOM isolation and a size budget

## Commonly sequenced with
- `react-worker-bee` before: to confirm the source React architecture and blockers before migrating
- `ux-ui-svelte-worker-bee` after: design token application once component architecture is settled
- `devops-worker-bee` after: Fresh/Deno deployment once the framework choice is made
