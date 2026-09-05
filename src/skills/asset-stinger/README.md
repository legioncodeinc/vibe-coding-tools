# asset-worker-bee: Companion Resources

This directory holds everything the `asset-worker-bee` agent needs to own the Universal Asset Registry. The pattern is generic: any product can adopt the registry; this Stinger describes the canonical 19-asset taxonomy, the registration workflow, the drift-audit mechanism, the sync-generator contract, and the deprecation/sunset rules. Organized into four layers: **guides** (workflow rules), **schema** (canonical Prisma + SQL), **examples** (exemplars to mirror), **templates** (seeds for kb + migrations).

> **Agent entry point:** [`.claude/agents/asset-worker-bee.md`](../asset-worker-bee.md) (repo-local). The agent reads files from this directory by path; it does not auto-load everything into context.
>
> **Peer worker-bees:** [`library-worker-bee`](../library-worker-bee.md), [`quality-worker-bee`](../quality-worker-bee.md), [`security-worker-bee`](../security-worker-bee.md), [`ux-ui-svelte-worker-bee`](../ux-ui-svelte-worker-bee.md). Scope boundaries live in [`guides/05-hand-offs.md`](guides/05-hand-offs.md).

## Directory map

```
asset-stinger/
├── README.md                           # you are here
├── guides/
│   ├── 00-principles.md                # nine non-negotiables
│   ├── 01-registration-workflow.md     # generic register-an-asset flow
│   ├── 02-drift-audit.md               # code ↔ DB consistency audit
│   ├── 03-sync-generator-spec.md       # CI generator contract
│   ├── 04-deprecation-and-sunset.md    # lifecycle + removal rules
│   ├── 05-hand-offs.md                 # scope boundaries with other worker-bees
│   └── assets/
│       ├── _template.md                # the shape every per-asset guide follows
│       ├── 01-feature.md
│       ├── 02-page.md
│       ├── 03-route.md
│       ├── 04-surface.md
│       ├── 05-control.md
│       ├── 06-display.md
│       ├── 07-layout.md
│       ├── 08-nav-entry.md
│       ├── 09-design-token.md
│       ├── 10-icon.md
│       ├── 11-media-asset.md
│       ├── 12-font.md
│       ├── 13-motion.md
│       ├── 14-breakpoint.md
│       ├── 15-content-entry.md
│       ├── 16-translation.md
│       ├── 17-feature-flag-binding.md
│       ├── 18-meter-binding.md
│       └── 19-entitlement.md
├── schema/
│   ├── README.md
│   ├── registry-schema.prisma          # canonical Prisma fragment
│   ├── bootstrap.sql                   # blank-DB full create
│   └── overlay.sql                     # existing-DB additive
├── examples/
│   ├── feature-example.md
│   ├── route-api-example.md
│   ├── route-page-example.md
│   ├── surface-example.md
│   ├── design-token-example.md
│   ├── content-entry-example.md
│   ├── nav-entry-example.md
│   └── drift-audit-report-example.md
└── templates/
    ├── registry-kb-README.md           # seed for library/knowledge/private/asset-registry/README.md
    └── registry-migration-template.sql # template for future additive registry migrations
```

## Guides: which one to read

The agent dispatches based on user intent. Read the matching guide **before** acting.

| User / orchestrator intent | Read |
|---|---|
| "register a new <asset>" | `guides/assets/<NN>-<asset>.md` (19 options) |
| "audit drift" / "check registry vs code" | [`guides/02-drift-audit.md`](guides/02-drift-audit.md) |
| "design the sync generator" | [`guides/03-sync-generator-spec.md`](guides/03-sync-generator-spec.md) |
| "deprecate an asset" / "sunset" | [`guides/04-deprecation-and-sunset.md`](guides/04-deprecation-and-sunset.md) |
| "how does registration work?" | [`guides/01-registration-workflow.md`](guides/01-registration-workflow.md) |
| "what are the principles?" | [`guides/00-principles.md`](guides/00-principles.md) |
| "who owns this?" / "scope question" | [`guides/05-hand-offs.md`](guides/05-hand-offs.md) |
| "write a QA report" | Hand off to [`quality-worker-bee`](../quality-worker-bee.md). |
| "write a PRD" | Draft; hand off to [`library-worker-bee`](../library-worker-bee.md) for numbering/invariants. |

## Per-asset guides: which one to open

Every per-asset guide under `guides/assets/` follows the same template (see `_template.md`). Pattern-match your intent to the asset type.

| Asset category | Guides |
|---|---|
| **Code-featured** | `01-feature`, `02-page`, `03-route` |
| **UI primitives** | `04-surface`, `05-control`, `06-display`, `07-layout` |
| **Navigation** | `08-nav-entry` |
| **Design foundations** | `09-design-token`, `10-icon`, `11-media-asset`, `12-font`, `13-motion`, `14-breakpoint` |
| **Content + i18n** | `15-content-entry`, `16-translation` |
| **Rollout + billing bindings** | `17-feature-flag-binding`, `18-meter-binding`, `19-entitlement` |

## Schema: which file to use

| Scenario | File |
|---|---|
| Greenfield DB, creating the registry from scratch | `schema/bootstrap.sql` |
| Existing DB, adding the registry additively | `schema/overlay.sql` |
| Writing a new Prisma model that mirrors the registry | `schema/registry-schema.prisma` |
| Understanding which file to use when | `schema/README.md` |

## Examples: which one to mirror

| Writing a… | Open |
|---|---|
| Feature registration | [`examples/feature-example.md`](examples/feature-example.md) |
| API route registration | [`examples/route-api-example.md`](examples/route-api-example.md) |
| Page route registration | [`examples/route-page-example.md`](examples/route-page-example.md) |
| Surface (card/modal/sheet) registration | [`examples/surface-example.md`](examples/surface-example.md) |
| Design token catalog row | [`examples/design-token-example.md`](examples/design-token-example.md) |
| Content entry (copy/string) | [`examples/content-entry-example.md`](examples/content-entry-example.md) |
| Nav entry (menu item) | [`examples/nav-entry-example.md`](examples/nav-entry-example.md) |
| Drift audit report | [`examples/drift-audit-report-example.md`](examples/drift-audit-report-example.md) |

## Templates: used to seed kb + future migrations

| File | Purpose |
|---|---|
| `templates/registry-kb-README.md` | Seed copy for `library/knowledge/private/asset-registry/README.md` when the folder is first created. |
| `templates/registry-migration-template.sql` | Starter SQL for any future registry migration, follows the additive-only invariant. |

## For the agent (self-operation notes)

When a user (or orchestrator) invokes you:

1. **Parse intent** → match to one row in the Router table (see `asset-worker-bee.md`).
2. **Hand off if out of scope** → QA / PRD numbering / UX authority / security belong elsewhere.
3. **Read the matching guide in full.**
4. **Read the matching example** (if authoring a new registry row or report).
5. **Enforce invariants** (see `guides/00-principles.md`).
6. **Produce the artifact** and report back with: what, where, what other worker-bee (if any) should follow up.

## Supersession

This agent is new: it does not supersede any prior agent. It complements `library-worker-bee` (which owns generic documentation) with registry-specific authority.
