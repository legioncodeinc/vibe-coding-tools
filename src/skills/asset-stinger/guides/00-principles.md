# Guide 00: Principles (The Nine Non-Negotiables)

These are the hard rules of the Universal Asset Registry. Every other guide inherits from these; every exception must be justified in writing and linked from the exception site.

Read this before every operation. When a principle appears to conflict with a guide, the principle wins.

---

## 1. Code is the source of truth. The database is the registry.

A registry row exists because a real construct exists in the codebase: an exported React component, a Fastify route handler, a CSS variable, an i18n key, a Prisma model. The DB describes *what is*, not *what should be*.

**Corollary:** if code is deleted, the registry row is deprecated (not deleted). If code is added and not registered, the sync generator files drift. If a registry row has no backing code, the sync generator marks it `orphaned` and you investigate.

**Rejected pattern:** "I'll add the registry row first and the code later." No. Code first. Register after.

## 2. Deprecate, never delete.

No registry row is ever hard-deleted while any other row references it or while `deprecated_at + sunset_at + usage_count = 0` have not all cleared.

Lifecycle:

```
draft → active → deprecated → archived → (eligible for delete only after sunset_at + usage_count = 0)
```

**Why:** orphan FK references, silent feature removals, flag debt, untraceable behavior changes; all are prevented by keeping the row around as history.

## 3. Keys are stable and human-readable. IDs are for FKs.

Every catalog row has:

- `id: String @id @default(cuid())`: FK target; opaque; never shown to humans.
- `key: String @unique`: kebab-case, ≤64 chars, stable for the life of the asset. **Never renamed.**

If an asset's "name" changes (marketing rename, scope pivot), the `key` stays, and `display_name` or `title` moves. If the key *must* change (a migration error, a namespace collision), introduce a `key_alias` row pointing the old key at the new row; never overwrite.

## 4. Platform catalogs are platform-owned; tenants override, never mutate.

Registry tables (`Feature`, `Page`, `Route`, `Surface`, `Control`, `Display`, `Layout`, `NavEntry`, `DesignTokenDefinition`, `Icon`, `MediaAsset`, `Font`, `Motion`, `Breakpoint`, `ContentEntry`, `ContentTranslation`, `Locale`, `FeatureEntitlement`) are written by the platform only.

Tenant customization flows through the **existing** override tables:

- `TenantFeatureFlag`: overrides `FeatureFlag`
- `TenantTheme`: overrides `DesignTokenDefinition` values (via JSON)
- `CustomMenuItem`: adds tenant-authored `NavEntry`-shaped rows
- `MenuItemLabelBinding`: binds labels to nav entries (polymorphic)
- `ContentTranslation` (locale-scoped): overrides `ContentEntry.default_value`

A tenant never writes to `Feature`, `Page`, `Route`, `DesignTokenDefinition`, etc.

## 5. Features are the spine.

Every asset that participates in **billing, flagging, metering, or rollout** must link to a `Feature` via `featureKey`. Without that link, the asset is invisible to the feature-flag console, the plan matrix, the meter catalog, and the entitlement engine.

Pure design primitives (`DesignTokenDefinition`, `Icon`, `MediaAsset`, `Font`, `Motion`, `Breakpoint`) MAY omit `featureKey`: they are shared across features. Everything else must have one.

When registering any feature-bearing asset: if you cannot name the owning feature, stop and ask the user: do not guess.

## 6. No string-keyed references where a FK exists.

Today, `MenuItemLabelBinding.targetKey: String` points at a "static code-registry id": a string that the code hopes matches something. This is how the registry drifts.

**Rule going forward:** any new cross-table reference uses a real FK. When you encounter a legacy string-keyed reference, propose a migration to add a proper FK alongside (component-to-registry bindings, file as a follow-up feature PRD in the deploying product).

## 7. Derived fields are generator-owned. Human fields are generator-exempt.

Every registry table has two field classes:

| Class | Examples | Written by |
|---|---|---|
| **Generator** (derived from code) | `code_path`, `file_hash`, `detected_at`, `last_seen_at`, `props_schema_digest`, `auto_detected_kind` | CI generator only |
| **Human** (non-derivable, intent-bearing) | `description`, `owner`, `plan_tiers`, `sunset_at`, `notes`, `meter_key`, `tenant_overridable` | Humans only (Admin UI, SQL, or PR) |

The generator **never** overwrites a human field. Humans **never** edit a generator field. Violations are drift.

## 8. Every registry change is traceable.

No anonymous rows. Every row has:

- `created_by` (user ID or `sync-generator@ci`)
- `created_at`
- `pr_url` (the PR that introduced the row, nullable only for generator-created rows, where it's auto-filled)
- `prd_ref` (the feature PRD key that authorized the asset, nullable only for pre-registry assets during backfill)

When the generator sees a new asset in code with no feature PRD reference annotation, it creates a row in `status: draft` and files a drift item. A human must resolve.

## 9. Every per-asset guide follows the shared template.

See `guides/assets/_template.md`. Sections in order:

```
1. Purpose
2. DB table(s) + key fields
3. Code location(s) + how it's detected
4. Registration fields (human vs generator, each column tagged)
5. Lifecycle (draft/active/deprecated/archived rules)
6. Relationships (what links to this, what this links to)
7. Hand-offs (which worker-bee cares)
8. Pitfalls
9. Example (minimal well-formed row)
10. Checklist
```

Deviations require a comment at the top of the guide explaining why.

---

## Summary card (pin this)

1. **Code is truth; DB is the registry.**
2. **Deprecate, never delete.**
3. **Keys stable; IDs opaque.**
4. **Platform catalogs, tenant overrides.**
5. **Features are the spine.**
6. **No new string-keyed references.**
7. **Generator vs human fields are disjoint.**
8. **Every change is traceable.**
9. **Every per-asset guide follows the template.**

If you catch yourself breaking one of these, stop. Re-read the relevant guide. Ask the user. Do not ship a registry row that silently violates a principle.
