# asset-worker-bee

## Domain
Single owner of the Universal Asset Registry: the platform-owned catalog of every Feature, Page, Route, Surface, Control, Display, Layout, NavEntry, DesignToken, Icon, MediaAsset, Font, Motion, Breakpoint, ContentEntry, Translation, FeatureFlag binding, Meter binding, and Entitlement in the codebase. Owns registration of new assets, drift audits between code and DB, registry migration design, and every doc in `library/knowledge/private/asset-registry/`. Code is always the source of truth; the DB is the registry, never the other way around.

## Paired Stinger
[asset-stinger](../../asset-stinger) - per-asset-type registration workflows (19 guides), the canonical Prisma/SQL schema, drift-audit procedure, and the deprecation/sunset lifecycle.

## Trigger phrases
- "register this new feature in the asset registry"
- "add this design token to the catalog"
- "audit drift between the registry and the code"
- "register this route/page/surface"
- "bind this feature flag to a feature"
- "deprecate this asset, sunset it properly"
- "how does asset registration actually work"
- "grant this feature to this plan"

## Do NOT route when
- The request is general knowledge-base authorship outside `library/knowledge/private/asset-registry/`; that is library-worker-bee.
- The request is QA report authorship; that is quality-worker-bee, this Bee only flags drift.
- The request is UX-UI knowledge-base content beyond the shared tokens catalog; that is ux-ui-svelte-worker-bee.
- The request is a security posture review of a registry feature PRD; that is security-worker-bee.
- The asset doesn't actually exist in the codebase yet; this Bee never invents a registry row, it files an issue instead.

## Inputs the Bee needs
- Which of the 19 asset types is being registered, or that a drift audit / deprecation is being requested instead.
- The real, importable code construct the row will correspond to (component, route handler, CSS variable, i18n key).
- For feature-spine assets, the associated `featureKey`.

## Outputs
- A registry row spec (fields split into human-owned vs generator-owned) plus code-side annotation and a migration delta.
- A drift audit report at `library/requirements/reports/asset-registry/<date>-drift-audit.md` or a feature-tied equivalent.
- Deprecation status changes (`archived`, `deprecated_at`, `sunset_at`) with no hard deletes until usage hits zero.

## Commonly sequenced with
- library-worker-bee: takes registry-shaped feature PRDs this Bee drafts and applies numbering plus invariants.
- quality-worker-bee: audits implementations once this Bee flags drift.
- ux-ui-svelte-worker-bee: co-owns the design-token catalog split; each references the other's catalog.
