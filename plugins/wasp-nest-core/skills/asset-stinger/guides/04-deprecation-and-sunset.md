# Guide 04: Deprecation and Sunset

Every registry row lives through five states. This guide is the runbook for moving rows through them safely, especially the end-of-life transitions.

## The lifecycle

```
draft → active → deprecated → archived → (deletable, only if usage_count = 0)
```

| State | What it means | Visible to production? | Editable? |
|---|---|---|---|
| `draft` | Row exists; not yet human-reviewed | No | Yes (human fields) |
| `active` | Row is in use | Yes | Yes (human fields only) |
| `deprecated` | Scheduled for removal | Yes (with warnings in admin UI) | Limited (can change `sunset_at`, `notes`) |
| `archived` | Past `sunset_at`, still referenced somewhere | No (hidden from feature-flag console, plan matrix, theme builder) | No |
| (deleted) | Hard-deleted | - | - |

## Transition rules

### draft to active

- All human fields populated.
- Code location verifiable (`code_path` + `file_hash` resolves).
- `feature_key` assigned (or asset is a design primitive exempt per Principle 5).
- Downstream linkages green (flag reachable, meter visible, plan-matrix row present if feature-bearing).
- Sync generator `--check` returns zero drift.
- Human actor records the transition in `registry_audit_log`.

### active to deprecated

When: the code this row describes is going to be removed within 90 days.

How:

1. Set `status: deprecated`.
2. Set `deprecated_at: NOW()`.
3. Set `sunset_at: NOW() + 90 days` (default; can extend with justification).
4. Add `deprecation_reason` (human-readable) and `replacement_key` (nullable; points at the successor row if any).
5. Announce in the platform-admin digest (next section).

### deprecated to archived

When: `sunset_at` has passed AND the code has been removed from the active branches.

How (automated by the sync generator):

1. On first scan where `code_path` no longer resolves AND `now > sunset_at`: set `status: archived`.
2. Do NOT auto-delete. Archived rows stay for history.

### archived to (deleted)

When: `status: archived` AND `usage_count = 0` AND archived for at least 180 days.

How:

- Platform super-admin only.
- Requires a ticket with justification.
- Delete is executed via `pnpm registry:purge --key <key> --confirm`.
- The delete is logged in `registry_audit_log` with `actor = <user>` and `justification = <text>`.

## `usage_count`: how it is computed

Every catalog table exposes a `usage_count` column that is **computed**, not stored:

```sql
CREATE OR REPLACE FUNCTION registry_usage_count(
  p_table text,
  p_key   text
) RETURNS integer AS $$
DECLARE
  n integer := 0;
BEGIN
  -- Sum references across every table that FKs into the catalog.
  -- Implementation detail: a Prisma migration generates one helper per table.
  RETURN n;
END;
$$ LANGUAGE plpgsql;
```

For `Feature`, for example, `usage_count` sums references from `Page.featureKey`, `Route.featureKey`, `Surface.featureKey`, `FeatureFlag.featureKey`, `Meter.featureKey`, `FeatureEntitlement.featureKey`, `ContentEntry.featureKey`, `NavEntry.featureKey`, etc.

The function is called on demand (never cached) by the deprecation runbook and by the drift audit.

## The platform-admin deprecation digest

Nightly job emits a digest to `library/requirements/reports/asset-registry/<YYYY-MM-DD>-deprecations-digest.md` summarizing:

- Rows newly `deprecated` in the last 24h.
- Rows approaching `sunset_at` within 14 days.
- Rows past `sunset_at` still blocked by `usage_count > 0` (these are "debt").
- Rows eligible for hard delete.

Owners receive an email linking to the digest. Chronic debt (> 30 days past sunset with usage_count > 0) escalates to the feature's team lead.

## Special cases

### Feature deprecation

Deprecating a `Feature` cascades:

1. All linked assets (`Page`, `Route`, `Surface`, `Control`, `Display`, `NavEntry`, `ContentEntry`) inherit the deprecation warning in the admin UI but keep `status: active` until the feature actually sunsets.
2. The owning `FeatureFlag` gets `expected_removal_at = Feature.sunset_at`.
3. Any `FeatureEntitlement` rows are marked with a `grace_period_ends_at = Feature.sunset_at`.
4. Tenants on a plan whose entitlement is affected are notified 30 days before `sunset_at`.

### DesignTokenDefinition deprecation

Deprecating a token is disruptive because tenant themes reference them by key. Process:

1. Introduce a `replacement_key` and migrate every platform preset to the new token.
2. Mark the old token `deprecated` with `sunset_at + 180 days` (tokens get double the default).
3. The theme validator emits a warning when a tenant's `custom` theme still writes the deprecated key.
4. At `sunset_at`, the projector falls back from the deprecated key to the replacement automatically.
5. After a full release cycle at the replacement, the old key archives.

### ContentEntry deprecation

A deprecated `ContentEntry` continues rendering until `sunset_at`. After that:

1. The translator stops emitting translations for it.
2. The i18n runtime emits the key as-is (fallback to `key` string) if no translation exists.
3. The sync generator files a drift item if the key is still referenced in code.

### FeatureFlag deprecation

Retiring a flag is a common operation and has its own short runbook:

1. Set `FeatureFlag.retiredAt = NOW()`.
2. Code must no longer branch on the flag (CI check will fail otherwise).
3. All `TenantFeatureFlag` overrides for this flag are cleared.
4. After 30 days with `retiredAt` set and no references in code, the row archives.

## The "usage_count = 0 but still present" failure mode

Sometimes a row's `usage_count` is zero but the asset is still referenced from code (typically via string-keyed legacy references, see Principle 6). The drift audit catches this under the `unregistered` class (the code reference exists with no corresponding registry link).

If you see this pattern, do NOT delete the registry row. File a drift item and let the next registration workflow recover the linkage.

## Escalation

If you need to break any of the transition rules (e.g., to hard-delete a row that still has references), escalate to a platform super-admin. The audit log captures the override.

## Never

- **Never hard-delete** a row that any other table references.
- **Never rename** a key. Use `replacement_key` + a successor row.
- **Never revive** an archived row without an audit entry and a human justification. Prefer a successor row.
- **Never sunset** a `Feature` without notifying every tenant whose plan is affected.
