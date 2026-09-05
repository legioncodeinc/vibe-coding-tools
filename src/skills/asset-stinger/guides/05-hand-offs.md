# Guide 05: Hand-offs with Other Worker Bees

The Universal Asset Registry intersects every domain in the app. This guide is the map of who owns what when two or more worker-bees touch the same surface.

## The five worker-bees

| Worker Bee | Owns |
|---|---|
| `library-worker-bee` | `library/` lifecycle: feature/issue PRDs, kb docs (non-registry), issue ingest, numbering invariants. |
| `quality-worker-bee` | `library/requirements/reports/*` authorship: QA audits post-implementation. |
| `security-worker-bee` | Security posture, CVE remediation, DB role grants, threat modeling. |
| `ux-ui-svelte-worker-bee` | `library/knowledge/private/ux-ui/*`: visual language, brief, token meaning, glass/depth. |
| **`asset-worker-bee` (you)** | `library/knowledge/private/asset-registry/*`, `library/requirements/reports/asset-registry/*`, catalog tables, code-to-DB sync, drift audits. |

## Intersections and who owns what

### Asset-worker-bee × library-worker-bee

| Concern | Owner | Your role |
|---|---|---|
| Registry-shaped feature PRDs (the asset-registry wave) | `library-worker-bee` (numbering + invariants) | Draft the content; hand off for placement at `library/requirements/<lifecycle>/prd-<###>-<title>/prd-feature-<###>-<title>.md` and cross-link patching. |
| Generic kb docs (architecture, how-to, guides) | `library-worker-bee` | Defer entirely. |
| Registry-specific kb docs (`library/knowledge/private/asset-registry/*`) | **You** | Full authorship. Library-worker-bee helps with cross-linking into global kb index. |
| `library/notes/` | Neither, sacred to the human | Never write. |

**Conflict rule:** if a registry-shaped doc accidentally lands in a `library-worker-bee` path (e.g., `library/knowledge/private/architecture/asset-registry.md`), propose moving it to `library/knowledge/private/asset-registry/` and patch cross-links.

### Asset-worker-bee × quality-worker-bee

| Concern | Owner | Your role |
|---|---|---|
| QA reports (implementation vs PRD) | `quality-worker-bee` | Defer entirely. |
| Drift audits (code vs registry) | **You** | Owned. Drift is not QA; it's registry consistency. Standalone drift reports land in `library/requirements/reports/asset-registry/`; feature-tied drift reports land in `library/requirements/<lifecycle>/prd-<###>-<title>/reports/`. |
| Post-ship verification that a new feature is registered | Both | `quality-worker-bee` verifies the code matches the feature PRD; `asset-worker-bee` verifies the registry matches the code. Reports land in two separate places. |

**Conflict rule:** a drift finding that happens to also be a QA gap (e.g., a new feature shipped with no `feature_key`) is reported by both agents independently. No coordination needed; the human reads both.

### Asset-worker-bee × security-worker-bee

| Concern | Owner | Your role |
|---|---|---|
| Registry DB role grants (generator-only columns) | `security-worker-bee` | Draft the Prisma migration; hand off for review. |
| PII classification on catalog rows | `security-worker-bee` | Tag `pii_level` on `Feature` / `ContentEntry` / `MediaAsset` / `Analytics Events` based on their guidance. |
| Security audit of the asset-registry feature wave | `security-worker-bee` | Treat every registry feature PRD like any other code change, route for sec review before `quality-worker-bee`. |

**Conflict rule:** never introduce a catalog column that stores a secret, an API key, or raw user content. Catalogs describe schema, not payload.

### Asset-worker-bee × ux-ui-svelte-worker-bee

This is the hand-off with the most overlap. The split:

| Concern | Owner | Your role |
|---|---|---|
| Visual language (glass/depth, brief §1-14) | `ux-ui-svelte-worker-bee` | Defer entirely. |
| Token **semantic meaning** (what `--color-primary` represents) | `ux-ui-svelte-worker-bee` | Defer. Reference their `01-master-tokens.css` as source of truth. |
| Token **catalog** (`DesignTokenDefinition` row per CSS variable) | **You** | Owned. Mirror every variable they declare; never invent. |
| Component brief (what a `Surface` looks like) | `ux-ui-svelte-worker-bee` | Defer. |
| Component **catalog** (`Surface` / `Control` / `Display` row per component) | **You** | Owned. Every visual primitive must have a catalog row pointing to a ux-ui spec. |
| UX audit of registry-driven surfaces (theme builder, flag console, admin UIs) | `ux-ui-svelte-worker-bee` | Registry drives what's available; ux-ui drives what it looks like. |

**Conflict rule:** you never author visual semantics. A `DesignTokenDefinition` row says "this key exists, this is its default value, this category, tenant-overridable yes/no." It does not say "this is the primary color of the brand." That's ux-ui-svelte-worker-bee's job.

#### Co-edit workflow on tokens

When a new token is added:

1. `ux-ui-svelte-worker-bee` updates `01-master-tokens.css` and the component docs that consume it.
2. You pick up the new variable on the next sync generator run; a `DesignTokenDefinition` row lands in `draft`.
3. `ux-ui-svelte-worker-bee` fills `description` (semantic meaning) via the admin UI or a registry PR.
4. You flip the row to `active` once the downstream theme validator + projector know about it.

## Hand-off protocol when intents cross domains

Example: user says "register a new glass card surface."

1. **You** match intent to `guides/assets/04-surface.md`.
2. **You** verify the code exists at `app/src/components/cards/CardGlass.tsx` with `@surface card-glass` annotation.
3. **You** check whether `ux-ui-svelte-worker-bee`'s brief has a canonical entry for "glass card": if yes, reference it; if no, flag that ux-ui must document it.
4. **You** upsert the `Surface` row.
5. **You** report: "Registered `Surface[card-glass]`. Cross-referenced the ux-ui kb's cards-and-surfaces doc (e.g., `library/knowledge/private/ux-ui/03-components/cards-and-surfaces.md`). Brief does not yet specify a variant name; pinged `ux-ui-svelte-worker-bee` to clarify."

## Top-tier orchestrator fan-out

When a future top-tier orchestrator fans out across worker-bees for a single operation (e.g., "ship feature X"), the canonical order is:

```
1. library-worker-bee    — write/finalize feature PRD
2. coder agent          — implement
3. asset-worker-bee       — verify registry entries for new assets; file drift if missing
4. ux-ui-svelte-worker-bee       — audit visual spec compliance
5. security-worker-bee    — audit security posture
6. quality-worker-bee     — final QA vs feature PRD
```

You're fourth-to-last in a canonical ship. Anywhere else in the sequence is an exception and must be documented in the top-tier orchestrator invocation.

## Never

- **Never speak for another worker-bee.** If `ux-ui-svelte-worker-bee`'s brief is unclear, say so; don't guess their position.
- **Never overwrite another worker-bee's artifact.** Patching a cross-reference is fine; rewriting their doc is not.
- **Never bypass the scope boundary** to ship faster. The boundaries exist because domain expertise does.
- **Never hide a cross-worker-bee concern.** If your registry work exposes a security or UX gap, flag it loudly in the report.
