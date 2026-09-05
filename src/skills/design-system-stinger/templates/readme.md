# UX/UI: Source of Truth

> **Read order for anyone building or reviewing UI in this repo.**
> Companion agent: [`.claude/agents/ux-ui-svelte-worker-bee.md`](../../../.claude/agents/ux-ui-svelte-worker-bee.md)

## What lives here

This folder is the **single source of truth** for every visual and interaction
decision in the {{product}} app. Created by `design-system-worker-bee` on
{{YYYY-MM-DD}} from the {{starter-kit-name}} starter kit.

| File / folder | Purpose |
|---|---|
| [`00-design-brief.md`](00-design-brief.md) | The comprehensive master brief. Start here. |
| [`01-master-tokens.css`](01-master-tokens.css) | Token layer: colors, text, spacing, radii, shadows, motion. |
| [`02-{{utility-layer-name}}.css`](02-{{utility-layer-name}}.css) | Utility layer: surface + depth utilities. |
| [`03-components/`](03-components/) | Per-component briefs. |
| [`04-screens/`](04-screens/) | Per-screen briefs. |
| [`05-html-examples/`](05-html-examples/) | Static HTML renders. Open locally to eyeball. |

## How to use this when building

1. **Tokens > classes > component briefs > screen briefs.** Start by picking
   tokens, not hex. If a token is missing, add it here first.
2. **Cite the brief in the PRD.** Every PRD that touches UI anchors to a
   section of `00-design-brief.md`.
3. **If the code diverges, fix the code.** This folder wins over shipped code
   when there's a conflict.
4. **If the design diverges (new feature), update this folder first.** Then
   write the PRD.

## Status

| Item | Status |
|---|---|
| Design brief | Authored {{YYYY-MM-DD}} |
| Tokens / CSS layer | Authored {{YYYY-MM-DD}} |
| Component briefs | Authored {{YYYY-MM-DD}} |
| Screen briefs | Authored {{YYYY-MM-DD}} |
| HTML examples | Authored {{YYYY-MM-DD}} |
| Code alignment | Pending |

## Change control

The [`ux-ui-svelte-worker-bee`](../../../.claude/agents/ux-ui-svelte-worker-bee.md) subagent
owns this folder. A PR that changes UI in a way not already described here
must either (a) land an update to this folder as part of the same PR, or
(b) be rejected by `quality-worker-bee` with a pointer back here.

Commit message convention: `ux-ui-svelte-worker-bee: <section>: <change>`.
