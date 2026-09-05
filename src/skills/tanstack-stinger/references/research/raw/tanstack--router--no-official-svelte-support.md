# TanStack Router: NO official Svelte support (confirmed via official GitHub discussions, ongoing as of 2026-08-14)

- URL: https://github.com/TanStack/router/discussions/281 ; https://github.com/TanStack/router/discussions/935 ; https://tanstack.com/libraries/svelte
- Fetched: 2026-08-14
- Source type: Official TanStack GitHub discussions (maintainer-participated) + official TanStack Svelte libraries landing page
- Component: TanStack Router / Svelte support status

## Content

### Plain fact, state it plainly: there is no official Svelte adapter for TanStack Router

Discussion #281 ("Svelte support for TanStack Router"), opened by a community member and still active with maintainer replies as recently as **May 17, 2026** in this archive, confirms Svelte is not one of TanStack Router's supported frameworks. A TanStack maintainer's own words in the thread: React, Solid, and Vue share an internal JSX-based architecture that makes porting relatively straightforward; **"Svelte only support[s] .svelte SFC, and is thus more cumbersome to add support for, because many of the 1000+ tests then require dedicated .svelte files."** This is the maintainers' own stated technical reason for the gap, not speculation.

A community member built an experimental, unmerged fork (`y7ya-com/router#feat/svelte-router`) described by its own author as usable "in simple low-stakes projects" and explicitly not necessarily the right shape for eventual upstream inclusion. As of the most recent visible activity, a maintainer asked the fork's author to help port it officially via Discord - meaning as of this research date, **official Svelte support for TanStack Router remains an open, unresolved feature request, not a shipped or in-progress-with-a-timeline feature.**

Discussion #935 ("Svelte Support," opened 2024-01-22) independently confirms the same status with a community reply: "Looks like this might take a while."

### Corroborating signal: the official Svelte libraries page omits Router

`https://tanstack.com/libraries/svelte` - TanStack's own official landing page for its Svelte-targeted libraries - describes itself as covering "routing, data, UI, performance, and tooling" but the specific list of officially shipped Svelte adapters observed elsewhere in this research (Query, Table, Form, Virtual) does not include Router. The word "routing" appearing in the page's own description while no official Router package exists is worth flagging explicitly rather than assuming routing is covered - SvelteKit's own file-based router is what actually serves that need for this stack (see the SvelteKit remote-functions and load-functions raw files), not TanStack Router.

### What this means for this skill's guidance

State this plainly per the mission's own instruction: **do not recommend TanStack Router for a SvelteKit project.** SvelteKit already ships an official, mature, file-based router as a core framework feature - there is no gap to fill, and the unofficial community fork is explicitly experimental and not suitable to recommend in production guidance.
