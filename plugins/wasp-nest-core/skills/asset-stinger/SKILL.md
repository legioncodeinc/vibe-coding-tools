---
name: "asset-stinger"
license: AGPL-3.0-or-later
description: "Maintain the Universal Asset Registry. Use to register assets, audit code-to-registry drift, or generate migrations. Read README.md for the guide map."
---

# asset-stinger

Cursor-skill wrapper for the `asset-wasp-drone` Drone's companion resource bundle. The full directory map, intent-routing tables, per-asset guide index, schema picker, examples catalog, templates list, and self-operation notes are in [`README.md`](README.md): start there.

> **Agent entry point:** [`colony/.claude/agents/asset-wasp-drone.md`](../../agents/asset-wasp-drone.md)
>
> **Peer Drones:** [`library-wasp-drone`](../../agents/library-wasp-drone.md), [`quality-wasp-drone`](../../agents/quality-wasp-drone.md), [`security-wasp-drone`](../../agents/security-wasp-drone.md), [`ux-ui-svelte-wasp-drone`](../../agents/ux-ui-svelte-wasp-drone.md). Scope boundaries are documented in [`guides/05-hand-offs.md`](guides/05-hand-offs.md).

This file exists so Cursor's skill router can discover the stinger by description and trigger correctly. The Drone reads `README.md` for navigation and the matching `guides/*.md` for procedural detail per invocation. The principles guide [`guides/00-principles.md`](guides/00-principles.md) holds the nine non-negotiables (additive-only schema, indexed-payload-only filters, every asset has a stable code-side anchor, etc.) and is required reading before any registry mutation.

The registry source-of-truth (the host repo's `library/knowledge/private/asset-registry/` folder) is described in [`templates/registry-kb-README.md`](templates/registry-kb-README.md). The canonical Prisma + SQL schema lives in [`schema/`](schema/) with bootstrap (greenfield DB) and overlay (existing DB) variants.
