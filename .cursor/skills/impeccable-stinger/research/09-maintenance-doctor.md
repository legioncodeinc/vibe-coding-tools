# 09 — Maintenance: Doctor, Config, Ignores, Update

**Source:** `skill/reference/doctor.md`, `skill/reference/hooks.md`, `skill/scripts/doctor.mjs`, `impeccable.style/docs/doctor`, `impeccable.style/docs/config` (reference)

## Doctor — three kinds of "out of date"

1. **Tool version** — installed skill older than published; reported at boot; `npx impeccable update` fixes.
2. **Schema drift** — artifact written by an older Impeccable (fields nothing reads, fields now expected, retired locations). Mechanical; doctor repairs most of it. This is doctor's job.
3. **Truth drift** — code moved on and the document no longer describes it. Routed to `init`/`document`, not repaired.

## What doctor checks

- `PRODUCT.md` schema stamp (vintage, not release version).
- `DESIGN.md` (no stamp — follows external design.md spec) and the `.impeccable/design.json` sidecar (older than DESIGN.md, outdated schema, legacy path).
- Config: unknown keys, unknown detector keys, ignored rule ids that no longer exist, ignored file paths that are gone, `projectRoots` globs matching nothing.
- Design hook: script path that stopped resolving; enabled/disabled conflict.
- Surface briefs: records orphaned from the file/route they describe.
- Monorepos: which apps carry their own `PRODUCT.md`/`DESIGN.md` vs inherit the root's; flags a workspace with native build files inheriting a web-only root record.

## Config & ignores

- `.impeccable/config.json` (shared, commit when team intent) + `.impeccable/config.local.json` (private, gitignored).
- `npx impeccable ignores list|add-value|add-file|add-rule|remove-value`; `--local` for private; `--reason` for the why.
- Value ignores preferred for fonts/colors/radii/motion (keeps the rule useful elsewhere); wildcard value ignores only when scoped to a file.
- Inline comments travel with a file: `<!-- impeccable-disable overused-font: reason -->`, `impeccable-disable-line`, `impeccable-disable-next-line`.
- `projectRoots` for repos where design boundaries don't line up with package-manager workspaces.
- A config file fails quietly when wrong (misspelled key never read; stale rule id suppresses nothing) — doctor catches all three.

## Update flow

- `npx impeccable check` (behind?) → `npx impeccable update` (from project root); plugin users update from `/plugin` menu; `npx skills update` for the shared build.
- `stalenessCheck: false` in config or `IMPECCABLE_NO_STALENESS_CHECK=1` silences the boot notice; `doctor` still works.

## Evidence for the stinger

- Maintain phase = `extract` (consolidate drift) + `document` (re-capture system) + `doctor` (schema/truth/tool drift) + `check`/`update` (upstream).
- "Never repair drift as a side effect of a design task" — a `CONTEXT_STALE` finding is reported, not acted on, unless the user asks (`skill/SKILL.src.md`).
