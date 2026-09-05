# Guide 01: Registration Workflow

The generic flow that every "register this asset" command follows. Per-asset guides under `guides/assets/NN-<asset>.md` layer details on top of this flow.

## When to use this guide

- When a user or orchestrator asks to register a specific asset and you need the canonical steps.
- When you're about to write (or review) a per-asset guide and want to check your guide against the generic flow.
- When the sync generator files a drift item and you need to resolve it.

## The five-step flow

```
1. Identify the asset
2. Locate the code
3. Determine registration fields
4. Write / upsert the row
5. Verify linkage
```

Read the matching per-asset guide for the specifics of steps 3 and 4.

### Step 1: Identify the asset

- What is it? A page, a route, a surface, a control, a token, an icon, a content string, a nav entry, a feature?
- Does it already have a registry row? Search the registry by `key`, by `code_path`, and by `name`:

```sql
-- Pseudo-query; actual implementation goes through the repo's Prisma client.
SELECT * FROM features WHERE key = ?
  UNION SELECT * FROM features WHERE code_path = ?
  UNION SELECT * FROM features WHERE name = ?;
```

- If it exists and is `active` → this is an **update**, not a new registration. Go to Step 4 with the existing `id`.
- If it exists and is `deprecated` → confirm with the human whether to **revive** (`status: active`) or **create a successor** (new key).
- If it does not exist → continue to Step 2.

### Step 2: Locate the code

Every registry row must cite a real code location. Find:

- **`code_path`**: the primary file where the asset is declared (e.g., `app/src/components/CardGlass.tsx`, `api/src/routes/billing/addons.ts`).
- **`export_name`**: the identifier the code uses (e.g., `CardGlass`, `addonsRoute`, `--radius-md`).
- **`file_hash`**: SHA-256 of the file at registration time (for the sync generator's drift check).

If you cannot locate the code, **stop**. Ask the user or file an issue. Principle 1 is not negotiable.

### Step 3: Determine registration fields

Open the per-asset guide. Fill the human fields; leave the generator fields for the sync generator to populate (or accept its proposed values unchanged).

Every asset has the **Shared Metadata Block**:

| Field | Class | Required |
|---|---|---|
| `id` | generator | yes (auto) |
| `key` | human | yes |
| `name` / `display_name` | human | yes |
| `description` | human | yes |
| `status` | human | yes (`draft` / `active` / `deprecated` / `archived`) |
| `owner` | human | yes |
| `feature_key` | human | yes if feature-bearing (see Principle 5) |
| `prd_ref` | human | yes if spawned by a feature PRD |
| `code_path` | generator | yes |
| `file_hash` | generator | yes |
| `detected_at` | generator | yes |
| `last_seen_at` | generator | yes |
| `environments` | human | yes (any of `dev` / `staging` / `prod`) |
| `version` | human | optional |
| `created_at` / `updated_at` | auto | yes |
| `deprecated_at` | human | only when `status = deprecated` |
| `sunset_at` | human | only when `status = deprecated` |
| `notes` | human | optional |

Additional fields come from the per-asset guide.

### Step 4: Write / upsert the row

- **New asset:** `INSERT` with `status: draft`. Record in `created_by: <user>` or `<sync-generator@ci>`. Flip to `active` after a human review (see §Quality gate below).
- **Existing asset (update):** `UPDATE` only human fields you explicitly want to change. Never overwrite generator fields manually.
- **Deprecation:** set `status: deprecated`, `deprecated_at: NOW()`, `sunset_at: NOW() + 90 days` (default). Runbook: `guides/04-deprecation-and-sunset.md`.

Always wrap in a transaction. Log the change to the registry-specific audit log (`registry_audit_log`) with the before/after diff.

### Step 5: Verify linkage

After the row is written, verify the downstream consequences:

- **Feature-bearing asset?** Confirm `Feature` row exists and the FK is valid.
- **Flag-gated asset?** Confirm `FeatureFlag.featureKey` matches and the flag is reachable from the feature-flag console.
- **Meter-linked asset?** Confirm `Meter.featureKey` matches and the meter appears in the usage dashboard.
- **Plan-gated asset?** Confirm `FeatureEntitlement` rows exist for the intended plans.
- **Tenant-overridable asset?** Confirm the matching override table (`TenantFeatureFlag`, `TenantTheme`, `CustomMenuItem`, etc.) can FK into the new row.
- **Content-bearing asset?** Confirm `ContentEntry` rows exist for every label/description with a `content_key` and (at minimum) a `default_value`.

Run the sync generator in `--check` mode (see `guides/03-sync-generator-spec.md`). If it reports no drift for this asset, you're done.

## Quality gate: when to flip `draft` → `active`

A row is `active` only when all of the following are true:

- [ ] All human fields are populated and reviewed.
- [ ] Code location is verifiable (`code_path` + `file_hash` resolves and matches).
- [ ] `feature_key` is present (or the asset is a design primitive exempt per Principle 5).
- [ ] Every downstream linkage in Step 5 is green.
- [ ] Sync generator `--check` returns zero drift for this row.

If any of these fail, the row stays `draft` until resolved. A `draft` row is invisible to production surfaces (feature-flag resolver, plan matrix, theme builder, nav renderer) by design.

## When you get stuck

- The asset doesn't fit any of the 19 per-asset guides → ask the user, and propose a new per-asset guide (mirror `_template.md`).
- Two assets seem to compete for the same key → the older wins; the newer gets a disambiguating suffix or a scoped namespace.
- The code location is ambiguous (multiple files export the same construct) → pick the canonical declaration (the one the rest of the app imports from) and cite others as `aliases`.
- The owning feature is unclear → stop. Feature-spine (Principle 5) must be resolved before the row flips to `active`.

## What this workflow is NOT

- It is not a feature PRD. For feature PRDs, draft content and hand off to `library-worker-bee`.
- It is not a QA report. For QA, hand off to `quality-worker-bee`.
- It is not a UX/UI decision. For visual semantics, defer to `ux-ui-svelte-worker-bee`.
- It is not a security audit. Registry-shaped feature PRDs still need a `security-worker-bee` pass like any other code change.

Keep this guide open while you work on a per-asset guide; they stack.
