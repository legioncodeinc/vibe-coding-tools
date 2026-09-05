# Guide 03: Sync Generator Spec

The contract between the codebase and the Universal Asset Registry. The generator is a single, deterministic CLI tool that scans the repo and upserts registry rows.

This guide is the spec: what the generator does, what it touches, what it guarantees. The implementation lives (or will live) under `tools/registry-sync/`; the actual code is out of scope here.

## Binary name

`pnpm registry:sync` (alias for `tsx tools/registry-sync/index.ts`).

Subcommands:

| Command | Purpose |
|---|---|
| `registry:sync` | Scan, upsert, report. Default. |
| `registry:check` | Scan only; produce `dist/registry-drift.json`. Zero-exit only if no critical drift. |
| `registry:report` | Emit a human-readable report to stdout. No writes. |
| `registry:backfill` | One-time: seed the registry from an existing codebase. Human-gated. |

## Scan paths

The generator walks a **configured** set of directories. Paths are defined in `tools/registry-sync/config.ts` (or whatever the deploying product calls it), not guessed. Sample defaults, adapt to the deploying product's layout:

| Asset type | Scan paths (sample) | Detection method |
|---|---|---|
| `Feature` | `app/src/features/**/index.ts`, `api/src/features/**/index.ts` | `@feature(...)` JSDoc + exported const |
| `Page` | `app/src/app/**/page.tsx` | Next.js App Router convention (or framework-equivalent) |
| `Route` (type=page) | `app/src/app/**/page.tsx` + `app/src/app/**/layout.tsx` | file path to URL path |
| `Route` (type=api) | `api/src/routes/**/*.ts` | server-framework plugin pattern + method + url |
| `Route` (type=server-action) | `app/src/**/actions.ts` + `'use server'` pragma | exported async function |
| `Route` (type=cron) | `api/src/cron/**/*.ts` | exported schedule + handler |
| `Route` (type=webhook-inbound) | `api/src/routes/webhooks/**/*.ts` | route prefix `/webhooks/` |
| `Surface` | `app/src/components/**/*.tsx` with `@surface(...)` | JSDoc annotation |
| `Control` | `app/src/components/**/*.tsx` with `@control(...)` | JSDoc annotation |
| `Display` | `app/src/components/**/*.tsx` with `@display(...)` | JSDoc annotation |
| `Layout` | `app/src/components/layouts/*.tsx` | directory convention + `@layout(...)` |
| `NavEntry` | `app/src/nav/entries.ts` | exported entries array |
| `DesignTokenDefinition` | `library/knowledge/private/ux-ui/01-master-tokens.css` (or wherever the deploying product keeps its master tokens) | CSS custom property declarations |
| `Icon` | `app/src/icons/**/*.svg` + `app/src/icons/index.ts` | exported registry |
| `MediaAsset` | `public/media/**/*` + `app/src/media/manifest.ts` | manifest |
| `Font` | `app/src/fonts/**/*.ts` | exported font declarations |
| `Motion` | the master-tokens CSS, motion section | CSS custom property declarations prefixed `--dur-`, `--ease-` |
| `Breakpoint` | the master-tokens CSS, breakpoints section | CSS custom property declarations prefixed `--bp-` |
| `ContentEntry` | `app/src/content/**/*.ts` + JSDoc `@content(key)` | exported object + annotation |
| `ContentTranslation` | `app/src/content/locales/**/*.ts` | keyed locale maps |
| `FeatureFlag` binding | `FeatureFlag` table + `@feature(...)` annotation linkage | DB read + repo scan |
| `Meter` binding | `Meter` table + `@meter(...)` annotation | DB read + repo scan |
| `Entitlement` | managed via admin UI + platform seed | DB authoritative |

**Paths are configured, never inferred.** If a new asset type lands, you add to `config.ts` and add a per-asset guide; the generator is not clever.

## Detection annotations

For asset types that require intent (a component could be a `Surface`, `Control`, or `Display` and the compiler cannot tell), the generator looks for JSDoc annotations on the default export:

```ts
/**
 * @surface card-glass
 * @kind card
 * @feature generic-ui
 * @ownerTeam ux
 */
export default function CardGlass(props: CardGlassProps) { /* */ }
```

Annotations:

| Tag | Applies to | Required | Notes |
|---|---|---|---|
| `@feature <key>` | all feature-bearing assets | yes | resolves to `feature_key` |
| `@surface <key>` | Surface components | yes for surfaces | |
| `@control <key>` | Control components | yes for controls | |
| `@display <key>` | Display components | yes for displays | |
| `@layout <key>` | Layout components | yes for layouts | |
| `@kind <value>` | Surface/Control/Display | yes | disambiguates within the class |
| `@content <key>` | Content entries | yes | required per key in content files |
| `@meter <key>` | feature-level handlers | yes if meterable | |
| `@ownerTeam <slug>` | all | yes | |
| `@prd <ref>` | all | yes for new rows | e.g., `FEA-XXX` (the deploying product's feature PRD ID) |
| `@tenantOverridable true` / `false` | DesignTokenDefinition | yes | |
| `@environments dev,staging,prod` | all | no | default: all three |

Missing a required annotation means drift class `unregistered` (for new code) or `mismatched` (for existing code).

## What the generator writes

For every asset detected:

```ts
prisma.<Table>.upsert({
  where: { key: <key> },
  update: {
    code_path,
    export_name,
    file_hash,
    last_seen_at: new Date(),
    auto_detected_kind,
    props_schema_digest,
  },
  create: {
    key,
    name: <from annotation or humanized key>,
    description: "",
    status: "draft",
    owner: <from annotation>,
    feature_key: <from annotation, nullable>,
    prd_ref: <from annotation>,
    code_path,
    export_name,
    file_hash,
    detected_at: new Date(),
    last_seen_at: new Date(),
    environments: ["dev", "staging", "prod"],
    created_by: "sync-generator@ci",
  },
});
```

**Never written by the generator:**
- `description` (beyond the initial empty string on creation)
- `status` (beyond `draft` on creation)
- `plan_tiers`, `deprecated_at`, `sunset_at`, `notes`, `tenant_overridable`, `meter_key`
- any FK into tenant-scoped tables

## Determinism guarantees

- **Idempotent.** Running the generator twice on unchanged code produces zero writes on the second run.
- **Order-free.** Scans are stable regardless of the order files are read in.
- **Hash-based change detection.** `file_hash` (SHA-256 of the file's content) drives stale detection.
- **Pure reads outside the registry.** The generator never modifies `app/`, `api/`, or any source file. Registry DB writes only.
- **Single-writer.** Only the generator writes to generator fields. Enforced by a DB-level column grant (see `security-worker-bee` review on the deploying product's registry-grants feature PRD).

## CI integration

### On PR

```yaml
- name: Registry drift check
  run: pnpm registry:check
- name: Post drift report
  if: always()
  run: pnpm registry:report | gh pr comment --body-file -
```

CI fails if `dist/registry-drift.json` reports any **critical** drift (see `guides/02-drift-audit.md`). Warnings and informational items are reported but do not fail the job.

### On merge to main

```yaml
- name: Registry sync
  run: pnpm registry:sync --env staging
- name: Re-run check
  run: pnpm registry:check --env staging
```

Sync runs against staging first. A separate production sync runs at deploy time against the prod DB.

### Nightly

```yaml
- name: Full drift audit
  run: pnpm registry:report --format=md > library/requirements/reports/asset-registry/$(date +%Y-%m-%d)-nightly-drift-audit.md
- name: Commit drift report
  run: git commit -am "asset-registry: nightly drift report"
```

## Human-only fields are protected

Enforced at three layers:

1. **Code**: the generator's upsert payload never includes human-only fields in `update`.
2. **DB**: a column-grant pattern restricts the generator's role to generator-only columns.
3. **Audit**: `registry_audit_log` records every write with `actor = sync-generator@ci | <user_id>`. Cross-role writes to protected columns are a policy violation.

## Human-exit hatch

For emergency overrides (a broken generator, an urgent rename), a platform super-admin can run:

```bash
pnpm registry:manual-write \
  --table feature \
  --key billing.addons \
  --field description \
  --value "New description" \
  --justification "Urgent copy fix, approved by <user>"
```

Every manual write produces an entry in `registry_audit_log` with `actor = <user>` and `justification = <text>`. Manual writes to generator fields are blocked by default; a `--i-know-what-im-doing` flag plus an audit entry is required.

## Backfill

The first time the generator runs on a repo that already has code, it enters **backfill mode**:

- All detected assets land as `status: draft` with `created_by: sync-generator@ci:backfill`.
- A backfill report lands at `library/requirements/reports/asset-registry/backfill-<YYYY-MM-DD>.md`.
- Humans review, fill required fields, flip `status: active` asset-by-asset.
- Backfill mode exits when fewer than 1% of detected assets remain in `draft` for more than 7 days (configurable).

See `guides/assets/*` for per-asset backfill nuances.

## Rollback

If a generator run produces bad writes:

1. Pause CI integration.
2. Replay the `registry_audit_log` in reverse for the bad run's `run_id`.
3. Investigate, patch the generator, re-run.

No hot-patching production registry rows outside the generator. The whole point is determinism.

## Out of scope for this guide

- Implementation details of the generator CLI (that lives with the tool itself).
- The specific JSDoc AST walker (a `ts-morph` or `typescript` compiler API call; implementation choice).
- The Prisma (or other ORM) client config (lives in the deploying product's data-access layer).

If you find yourself making an implementation decision here, stop and escalate. This guide is the contract; the implementation is a separate feature PRD in the deploying product.
