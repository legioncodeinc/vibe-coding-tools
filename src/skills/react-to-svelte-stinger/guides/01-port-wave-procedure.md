# Guide: running a component port wave

Verb: "port the logs page", "port virtual keys to Svelte", "next wave", "verify this port against the contract".

A port wave is one bounded batch of surfaces moved from the React reference to Svelte against an immutable backend contract. The motivating production case is the Bifrost dashboard port (source stack in [raw/04](../references/research/raw/04-bifrost-ui-stack.md)); the procedure generalizes to any React reference.

## Wave anatomy (per surface)

1. **Contract extraction.** In the React source, find the surface's data dependencies: RTK Query endpoint definitions, axios calls, WebSocket subscriptions. Write them into the repo's contract inventory: method, path, query params, request shape, response shape, error shapes, and auth requirements. Shapes come from the frozen tree's `docs/openapi/` (authoritative), with the React service file as usage evidence.
2. **Behavior inventory.** Enumerate the React surface's states before writing Svelte: loading skeleton, empty state, error/retry, pagination/sorting/filtering, optimistic updates, modals/confirm flows, permission gating. These are acceptance criteria; a port missing the error state is incomplete.
3. **Port.** Write the Svelte 5 component(s) per `references/translation-table.md`. Consume the contract via the target repo's data layer (never fetch god-mode endpoints directly; tenancy scoping is enforced by the server layer the port talks to).
4. **Verify against the contract.** Exercise every inventory row: mock or live, assert request shapes match and response handling covers the documented error shapes. Behavior inventory rows are the checklist.
5. **Ship Gate.** Security, quality, and repo-health passes per the paired bee's reporting expectations before the wave is called done.

## Sequencing waves

- Order surfaces by dependency: shared shell first (layout, nav, org switcher, sign-in redirect), then read-only surfaces (logs, dashboard), then mutating surfaces (virtual keys CRUD), then the exotic (websocket live views, editors, graphs).
- One wave = one reviewable unit. A wave that touches 15 routes is not a wave, it is a rewrite.
- Keep the React source tree checked out (pinned tag) for reference during the whole port; do not modify it.

## Multi-bee orchestration

Waves parallelize across bees only after the shared shell and contract inventory exist. Safe parallel split: one bee per surface, each owning disjoint route directories. Shared files (data layer, design tokens, shared components) are single-owner: the orchestrator assigns them to one bee per wave, others consume.

## Anti-patterns

- Porting from the live upstream `main` instead of the frozen reference: shapes drift, porting effort is wasted.
- "Improving" the API while porting: the contract is immutable in both directions. Improvements are backend PRs, separate.
- Translating JSX line-by-line: translate behavior. The table converts syntax; judgment converts UX.
- Skipping the websocket decision: live log surfaces need an explicit polling-vs-WS decision per deployment before porting starts.
