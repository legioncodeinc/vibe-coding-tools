---
name: "asset-stinger"
description: "Equips asset-worker-bee with the Universal Asset Registry: the 19-asset taxonomy (Features, Pages, Routes, Surfaces, Controls, Displays, Layouts, NavEntries, DesignTokens, Icons, MediaAssets, Fonts, Motion, Breakpoints, ContentEntries, Translations, FeatureFlagBindings, MeterBindings, Entitlements), the registration workflow, the code-vs-DB drift audit, the sync-generator contract, the deprecation/sunset rules, and the canonical Prisma + SQL schema. Use when registering, auditing, deprecating, or generating sync code for any of the 19 asset types, when checking for drift between code and the registry, or when standing up the registry in a new repo. Not for QA report authorship (use quality-stinger), PRD numbering (use library-stinger), UX design decisions (use ux-ui-svelte-stinger), or security audits of the registry tables (use security-stinger)."
---

# asset-stinger

Cursor-skill wrapper for the `asset-worker-bee` Bee's companion resource bundle. The full directory map, intent-routing tables, per-asset guide index, schema picker, examples catalog, templates list, and self-operation notes are in [`README.md`](README.md): start there.

> **Agent entry point:** [`colony/.claude/agents/asset-worker-bee.md`](../../agents/asset-worker-bee.md)
>
> **Peer Bees:** [`library-worker-bee`](../../agents/library-worker-bee.md), [`quality-worker-bee`](../../agents/quality-worker-bee.md), [`security-worker-bee`](../../agents/security-worker-bee.md), [`ux-ui-svelte-worker-bee`](../../agents/ux-ui-svelte-worker-bee.md). Scope boundaries are documented in [`guides/05-hand-offs.md`](guides/05-hand-offs.md).

This file exists so Cursor's skill router can discover the stinger by description and trigger correctly. The Bee reads `README.md` for navigation and the matching `guides/*.md` for procedural detail per invocation. The principles guide [`guides/00-principles.md`](guides/00-principles.md) holds the nine non-negotiables (additive-only schema, indexed-payload-only filters, every asset has a stable code-side anchor, etc.) and is required reading before any registry mutation.

The registry source-of-truth (the host repo's `library/knowledge/private/asset-registry/` folder) is described in [`templates/registry-kb-README.md`](templates/registry-kb-README.md). The canonical Prisma + SQL schema lives in [`schema/`](schema/) with bootstrap (greenfield DB) and overlay (existing DB) variants.
