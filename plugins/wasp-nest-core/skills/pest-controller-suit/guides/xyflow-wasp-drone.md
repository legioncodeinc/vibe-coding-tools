# xyflow-wasp-drone

## Domain
This Drone owns node-based interfaces built with the xyflow libraries: React Flow (`@xyflow/react`) and Svelte Flow (`@xyflow/svelte`), which share the `@xyflow/system` core. It installs and renders the canvas, wires flow state immutably in either kit, builds typed custom nodes, edges, handles, and connection rules, integrates Dagre, ELK, or d3 layout against measured node sizes, builds sub flows, themes the canvas and adopts React Flow UI, handles SSR, performance, keyboard accessibility, and tests of flow code, and migrates `reactflow` 11 and Svelte Flow 0.x projects. It owns the canvas boundary, not the surrounding app architecture, design system, or storage.

## Paired Stinger
[xyflow-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/web-development-tools/skills/xyflow-stinger) - dated React Flow and Svelte Flow research with a cited distillation, a React and Svelte API crosswalk, decision tables, guides for each verb (inspect, render, state, nodes and edges, layout, styling, verification, migration, refresh), worked examples, templates, and a read-only project inspector.

## Trigger phrases
- "build a workflow builder" or "node editor" or "pipeline editor"
- "add a React Flow canvas" / "use Svelte Flow for this diagram"
- "make a custom node with inputs" / "add a custom edge with a delete button"
- "only allow these connections" / "validate connections between handles"
- "auto layout this graph" / "use dagre or elk with React Flow"
- "group nodes" / "sub flows" / "parent and child nodes"
- "React Flow dark mode" / "Tailwind v4 breaks React Flow styles"
- "install React Flow UI components"
- "React Flow in Next.js" / "Svelte Flow with SvelteKit SSR"
- "the flow is slow with 2000 nodes"
- "migrate reactflow to @xyflow/react" / "upgrade Svelte Flow to Svelte 5"
- "port this React Flow editor to Svelte Flow"

Also route proactively when the work touches `@xyflow/*`, `reactflow`, or `react-flow-renderer` imports, `<ReactFlow>` or `<SvelteFlow>`, `nodeTypes`/`edgeTypes`, `Handle`, `BaseEdge`, xyflow hooks, or `--xy-*` styles.

## Do NOT route when
- The request is React architecture, routing, data fetching, or Server Components with no canvas-specific concern: route to `react-wasp-drone`.
- The request is Svelte 5 runes, SvelteKit load functions, form actions, or remote functions beyond the flow component: route to `svelte-wasp-drone`.
- The request is visual design, brand, or design-system tokens for the editor: route to `impeccable-wasp-drone` (or `design-system-wasp-drone` for a new system); return here to map approved tokens to `--xy-*` variables.
- The request is shadcn-svelte installs or Tailwind v4 configuration unrelated to the xyflow stylesheet: route to `shadcn-svelte-wasp-drone` or `tailwind-wasp-drone`.
- The request is the database schema or API for storing flows: route to `db-wasp-drone` or `neon-drizzle-wasp-drone`; this Drone defines the serialized shape and validation.
- The request is a Playwright or Puppeteer suite for canvas gestures: route to `browser-automation-wasp-drone`.
- The request is a general React-to-Svelte port wave where the flow is one surface among many: route to `react-to-svelte-wasp-drone`, with this Drone consulted for the flow surface.
- The request is dependency advisory or license disposition (for example adopting `elkjs`), formal security acceptance, or final QA: route to `dependency-audit-wasp-drone`, `security-wasp-drone`, or `quality-wasp-drone`.
- The request is a generic chart or graph visualization without editable nodes and edges (plots, dashboards): route to the frontend owner; xyflow is for interactive node graphs.

If a request straddles domains, this Drone owns the canvas and the peer owns the rest. For example, `react-wasp-drone` decides the app's state architecture, then this Drone wires the flow into it.

## Inputs the Drone needs
- Repository, owned paths, authorizing PRD or issue, acceptance criteria, and current gate state.
- Kit (React Flow or Svelte Flow) and host framework and version (React, Next.js, Svelte, SvelteKit), or permission to determine them by inspection.
- Node and edge kinds with their data shapes, connection rules, expected graph size, and whether flows are saved, shared, or imported.
- Styling system (Tailwind version, design tokens, React Flow UI or not) and color-mode requirements.
- Owner decisions where relevant: attribution visibility, `elkjs` license acceptance, prerelease adoption, and dependency installation approval.

## Outputs
- A working, typed flow implementation or migration inside the owned paths, following one xyflow generation.
- Inspector output before and after, type-check and test results, and measured performance or accessibility evidence when in scope.
- A report under the consumer repository's root `library/` path naming versions (with refresh date), derived patterns, source conflicts encountered, owner decisions pending, and handoffs.
- Filled templates when useful: inspection report, flow architecture decision, migration plan.

## Commonly sequenced with
- Build a node editor: `impeccable-wasp-drone` shapes the editor's visual language; this Drone builds the canvas, nodes, edges, layout, and state; `react-wasp-drone` or `svelte-wasp-drone` owns the surrounding app; `db-wasp-drone` stores flows; `browser-automation-wasp-drone` adds gesture tests; then the Ship Gate.
- Migration: `dependency-audit-wasp-drone` reviews the new dependency set; this Drone migrates in slices; `quality-wasp-drone` verifies against the plan after `security-wasp-drone`.
- Ship Gate: implementation checks, then `security-wasp-drone`, then `quality-wasp-drone`; the orchestrator loads `github-repo-health-stinger`, and the user approves before commit or push.

## Critical directives the orchestrator should respect
- Require dated sources for any "latest" or version claim; the Stinger's snapshot is dated and must be refreshed before upgrades.
- Keep React and Svelte idioms separate: camelCase events and controlled change handlers in React, lowercase events and `$state.raw` bindings in Svelte.
- Nodes and edges are immutable in both kits; reject changes that mutate them in place.
- Attribution visibility, copyleft layout engines, prerelease adoption, and Pro content are owner decisions, never Drone decisions.
- Treat imported or shared flow documents and user-authored node content as untrusted; validate before rendering and send HTML rendering paths to `security-wasp-drone`.

---

*Part of Pest-Controller-Suit's roster. See [`.claude/skills/pest-controller-suit/SKILL.md`](../SKILL.md) for the full colony.*
