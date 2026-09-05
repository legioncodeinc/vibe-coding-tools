# Universal Asset Registry: Knowledge Base

<!-- Owner: asset-worker-bee. Seed copied from .claude/skills/asset-stinger/templates/registry-kb-README.md on library/knowledge/private/asset-registry/ scaffold. Edit freely; do not rename the folder without updating the agent. -->

This folder is the durable documentation home for the Universal Asset Registry: the platform-owned catalog of every Feature, Page, Route, Surface, Control, Display, Layout, NavEntry, DesignToken, Icon, MediaAsset, Font, Motion, Breakpoint, ContentEntry, Translation, FeatureFlag binding, Meter binding, and Entitlement.

## When to read

- You are implementing any asset-registry sub-feature PRD.
- You are reviewing a PR that adds, modifies, or deprecates a registry row.
- You are debugging a drift audit failure.
- You need to understand how the code-to-DB sync works.

## Document map

```
library/knowledge/private/asset-registry/
├── README.md                     # this file
├── 00-architecture.md            # spine concept, principles, data flow
├── 01-tables-reference.md        # master list of registry tables + fields
├── 02-tokens-catalog.md          # design-token catalog (aligned with ux-ui brief)
├── 03-relationships-map.md       # the joins that matter (diagrams)
├── 04-critical-directives.md     # do's, don'ts, anti-patterns
├── 05-schema-example.prisma      # canonical Prisma fragment (mirrors agent/schema/)
├── 06-sync-generator-contract.md # CI generator rules
└── 07-migration-strategy.md      # blank-DB + existing-DB overlay paths
```

Drift reports do **not** live here. See:

- **Standalone drift reports** → `library/requirements/reports/asset-registry/<YYYY-MM-DD>-drift-audit.md`
- **Feature-tied drift reports** → `library/requirements/<lifecycle>/prd-<###>-<title>/reports/<YYYY-MM-DD>-asset-drift.md`

## Agent ownership

This folder is owned by [`asset-worker-bee`](../../../.claude/agents/asset-worker-bee.md). For cross-cutting concerns:

- **Documentation lifecycle** (numbering, invariants, cross-linking): [`library-worker-bee`](../../../.claude/agents/library-worker-bee.md)
- **UX/UI semantic token meaning**: [`ux-ui-svelte-worker-bee`](../../../.claude/agents/ux-ui-svelte-worker-bee.md)
- **QA of registry-shaped implementations**: [`quality-worker-bee`](../../../.claude/agents/quality-worker-bee.md)
- **Security review of registry feature PRDs**: [`security-worker-bee`](../../../.claude/agents/security-worker-bee.md)

## Governing principles

See `00-architecture.md` for the full treatment. Summary:

1. Code is truth; DB is the registry.
2. Deprecate, never delete.
3. Keys stable; IDs opaque.
4. Platform catalogs, tenant overrides.
5. Features are the spine.
6. No new string-keyed references.
7. Generator vs human fields are disjoint.
8. Every change is traceable.
9. Every per-asset guide follows the template.

## Related

- Asset-registry feature wave: `library/requirements/<lifecycle>/prd-<###>-asset-registry-master-index/feature-<###>-asset-registry-master-index.md` (when written)
- ux-ui brief: `library/knowledge/private/ux-ui/00-design-brief.md`
- Existing feature-flag schema: the deploying product's Prisma/SQL schema, `FeatureFlag` model
- Theme data model: complements the `DesignTokenDefinition` catalog (see ux-ui-svelte-worker-bee)
