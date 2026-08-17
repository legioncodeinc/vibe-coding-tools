# 01 — Context Contract

Derived from `research/02-context-contract.md`.

## Files the Bee owns per project

| File | Role | Written by |
|---|---|---|
| `PRODUCT.md` | Strategy: platform, users, purpose, positioning, evidence, brand commitments | `/impeccable init` |
| `DESIGN.md` | Visual system: colors, type, components, radii, elevation, rules (Google Stitch format) | `/impeccable document` |
| `.impeccable/surfaces/*.md` | Per-surface: mode, job, proof sequence, chosen direction | The work itself |
| `.impeccable/design.json` | Structured sidecar for detector/hooks/Live Mode | `document` (do not hand-edit) |

## Modes (from the surface, not the product)

- **Persuade** — visitor decides and acts (landing, marketing, pricing). Design is the product; earn attention.
- **Operate** — visitor completes a task (app UI, dashboards, admin, tools). Scanability outranks expression.
- **Read** — visitor understands (docs, guides, help). Comprehension first.
- **Experience** — visitor is inside the work (portfolios, galleries). Artifact leads, interface recedes.

A tool's landing page is still Persuade; a fashion house's docs are still Read. Name the mode explicitly only when genuinely ambiguous; persist it in the surface brief.

## Rules

- Every command reads the contract first. Never re-derive what is recorded.
- `init` scans the codebase, forms its own read, asks only what it could not work out. It does not ask about colors/type — those are decided with the surface.
- `document` auto-extracts colors, typography, spacing, radii, components, then confirms descriptive language; writes Stitch-format `DESIGN.md`.
- Missing `DESIGN.md` does not make a project greenfield: coherent code, type choices, and component behavior are authority. Scaffolds and framework defaults are not.
- If implementation is coherent but undocumented: extract invariants, confirm with the user, write `DESIGN.md` before going further.
- `context.mjs` may emit a `CONTEXT_STALE` directive — report it, do not act on it unless the user asks (except `auto` findings).
