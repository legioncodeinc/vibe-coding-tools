---
name: "xyflow-stinger"
description: "React Flow and Svelte Flow (xyflow) node editors: setup, state, custom nodes and edges, handles, layout, sub flows, theming, React Flow UI, SSR, tests, and migrations."
license: AGPL-3.0-or-later
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork. React Flow 12 or Svelte Flow 1.x projects; Python 3.9+ for the optional inspector.
metadata:
  hive-drone: xyflow-wasp-drone
  domain: xyflow
  pair-drone: xyflow-wasp-drone
  research-window: 2026-03-23 to 2026-09-23
---

# xyflow Stinger

Start with [README.md](README.md) for the workflow map.

## Purpose

Equip `xyflow-wasp-drone` to build, review, and migrate node-based editors, workflow builders, and diagram canvases with React Flow (`@xyflow/react`) and Svelte Flow (`@xyflow/svelte`), which share the `@xyflow/system` core. It carries a dated six-month research archive, a cited distillation, a React and Svelte API crosswalk, decision tables, worked examples, templates, and a read-only project inspector.

## When to use

- Adding a flow canvas, node editor, workflow builder, or diagram UI to a React, Next.js, Svelte, or SvelteKit app
- Building custom nodes, edges, handles, connection rules, or edge labels
- Wiring flow state (controlled React state, Zustand, `$state.raw` bindings) or persisting and restoring flows
- Auto layout with Dagre, ELK, or d3, and sub flows or groups
- Theming the canvas, dark mode, Tailwind v4 import order, or adopting React Flow UI components
- SSR of a flow, canvas performance, keyboard accessibility, or testing flow components
- Migrating `reactflow` 11 to `@xyflow/react` 12, or Svelte Flow 0.x to 1.x
- Porting a flow between React Flow and Svelte Flow

## When not to use

- General React architecture, Server Components, or app-wide state strategy; use [react-stinger](../react-stinger).
- Svelte 5 runes or SvelteKit runtime questions not specific to the canvas; use [svelte-stinger](../svelte-stinger).
- Design tokens and visual design of nodes and panels; use [impeccable-stinger](../impeccable-stinger) or the design-system owner.
- shadcn-svelte or Tailwind v4 mechanics beyond the xyflow integration; use [shadcn-svelte-stinger](../shadcn-svelte-stinger) or [tailwind-stinger](../tailwind-stinger).
- Database schema for saved flows; use [db-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/data-and-ai-tools/skills/db-stinger).
- Formal security or quality acceptance; use [security-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/security-stinger) and [quality-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/quality-stinger).

## Procedure

1. **Establish authority and scope.** Read [guides/00-authority-and-scope.md](guides/00-authority-and-scope.md). Cite distillation sections for facts, label derived patterns, and surface conflicts.
2. **Inspect before editing.** Follow [guides/01-inspect-and-align.md](guides/01-inspect-and-align.md). Resolve `scripts/inspect-xyflow-project.py` relative to this `SKILL.md` and run `python <resolved-path> <project-root> --pretty` for a read-only JSON inventory, then confirm leads by reading the code.
3. **Refresh mutable facts** before any version claim or dependency change with [guides/09-refresh-current-xyflow.md](guides/09-refresh-current-xyflow.md); [references/CURRENT-XYFLOW.md](references/CURRENT-XYFLOW.md) is dated 2026-09-23.
4. **Install and render** with [guides/02-install-and-render.md](guides/02-install-and-render.md): stylesheet, sized container, client boundary or SSR sizing.
5. **Wire state** with [guides/03-manage-state.md](guides/03-manage-state.md). Keep nodes and edges immutable in both kits.
6. **Build nodes, edges, and handles** with [guides/04-build-nodes-edges-handles.md](guides/04-build-nodes-edges-handles.md).
7. **Lay out and group** with [guides/05-layout-and-subflows.md](guides/05-layout-and-subflows.md). Route the `elkjs` license decision to the owner.
8. **Style and adopt UI kits** with [guides/06-style-theme-and-ui-kits.md](guides/06-style-theme-and-ui-kits.md). Leave attribution to the owner's documented decision.
9. **Verify** performance, accessibility, and tests with [guides/07-verify-performance-accessibility-tests.md](guides/07-verify-performance-accessibility-tests.md). Report only what you measured.
10. **Migrate** generations in slices with [guides/08-migrate.md](guides/08-migrate.md), then enter the Ship Gate.

## References map

- [references/REFERENCE.md](references/REFERENCE.md), load for package choice, state model, layout engine, styling path, red flags, and escalation tables.
- [references/API-CROSSWALK.md](references/API-CROSSWALK.md), load when working in the less familiar kit or porting between React Flow and Svelte Flow.
- [references/CURRENT-XYFLOW.md](references/CURRENT-XYFLOW.md), load before any "latest" claim, upgrade, or layout-library choice.
- [references/research/distilled-xyflow.md](references/research/distilled-xyflow.md), load to verify a claim or read the conflicts (C1 to C6) and gaps (G1 to G7).
- Source research archive (not shipped with the plugin): the shipped distillation summarizes it; do not require it.
- `examples/`, load the one matching the task: typed React flow, typed Svelte flow, Dagre layout, save and restore, or migration diffs.
- `templates/`, copy the inspection report, architecture decision, or migration plan into the consumer repository's `library/` path.
- `scripts/inspect-xyflow-project.py`, run for read-only discovery, or with `--self-test` after changing it.

## Related drones and stingers

- [xyflow-wasp-drone](../../agents/xyflow-wasp-drone.md) - Paired implementation specialist for React Flow and Svelte Flow work.
- [react-stinger](../react-stinger) - React architecture around the canvas.
- [svelte-stinger](../svelte-stinger) - Svelte 5 runes and SvelteKit around the canvas.
- [impeccable-stinger](../impeccable-stinger) - Frontend design implementation for node chrome and editor panels.
- [shadcn-svelte-stinger](../shadcn-svelte-stinger) - Svelte component primitives in place of React Flow UI.
- [tailwind-stinger](../tailwind-stinger) - Tailwind v4 mechanics beyond the xyflow import order.
- [browser-automation-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/browser-and-app-testing-tools/skills/browser-automation-stinger) - Real-browser tests of drag, connect, and pan gestures.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [react-stinger](../react-stinger) - React 18 and 19 architecture, state layering, and Server Component boundaries around a React Flow canvas.
  - [svelte-stinger](../svelte-stinger) - Svelte 5 runes, snippets, and SvelteKit load and SSR behavior around a Svelte Flow canvas.
  - [impeccable-stinger](../impeccable-stinger) - Design implementation for node visuals, editor panels, and anti-slop review.
  - [shadcn-svelte-stinger](../shadcn-svelte-stinger) - shadcn-svelte components for Svelte node chrome.
  - [tailwind-stinger](../tailwind-stinger) - Tailwind v4 configuration and layering.
  - [browser-automation-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/browser-and-app-testing-tools/skills/browser-automation-stinger) - Playwright tests for canvas interactions.
  - [security-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/security-stinger) - Required first Ship Gate audit, including untrusted saved-flow imports and HTML in node content.
  - [quality-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/quality-stinger) - Required Quality gate after Security findings are resolved.
  - [github-repo-health-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/github-repo-health-stinger) - Required orchestrator-level repository-health gate before commit or push.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
