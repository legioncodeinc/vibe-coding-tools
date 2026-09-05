# Guide 6: Virtualization with TanStack Virtual

Grounded in `references/research/distilled-tanstack.md` §3 and §6, `references/research/raw/tanstack--virtual--svelte-adapter.md`.

## When to walk this guide

Rendering a very large list or table (thousands of rows) and DOM node count is becoming a real performance problem.

## Status

`@tanstack/svelte-virtual` is a real, official adapter around the framework-agnostic `@tanstack/virtual-core`. Two entry points documented: `createVirtualizer` (for a scroll container you control) and `createWindowVirtualizer` (uses the browser window itself as the scroll element, for full-page virtualized lists).

## Before scaffolding: verify the current API shape live

This skill's research pass did not archive a complete worked Svelte code example for either function - only the API surface. Before writing virtualization code, pull the current example from the live TanStack Virtual Svelte docs rather than inferring the option shape from the React adapter or assuming it follows the same "wrap in a function" convention Query/Form use - confirm rather than assume, since this specific detail wasn't independently verified for Virtual.

## Pairing with TanStack Table

TanStack Table has no built-in virtualization (confirmed in Guide 4 / distilled research §3 - its own large-dataset examples simply slice to a display-sized page rather than virtualizing). The pattern is: wrap the table's scroll container (usually the `<tbody>`'s parent, or a dedicated scroll `<div>`) with a virtualizer from `@tanstack/svelte-virtual`, and render only the rows the virtualizer reports as visible plus overscan, rather than the full row model.

## Decision rule

Don't reach for virtualization by default - it adds real complexity (measured row heights, scroll-container sizing, overscan tuning). Reach for it specifically when a list/table's row count is large enough (typically four figures or more, or when profiling shows DOM node count as the actual bottleneck) that rendering every row is measurably slow. For smaller lists, plain pagination (which TanStack Table already supports natively via `rowPaginationFeature`) is simpler and usually sufficient.

## Common mistakes

- Adding virtualization preemptively to a table that will only ever show a few hundred rows.
- Assuming the Virtual adapter's option-wrapping convention matches Query/Form without checking - this wasn't confirmed in research.
- Virtualizing without accounting for variable row heights, which needs explicit measurement configuration rather than a fixed-size assumption.
