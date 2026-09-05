# 10 — Install & Verify (hybrid scope)

Derived from `research/07-hooks-enforcement.md`, `research/09-maintenance-doctor.md`, `research/10-native-platforms-harnesses.md`, `research/11-license-provenance.md`.

## Global skill install (once per machine)

```bash
npx impeccable install --scope=global --providers=codex,claude,cursor
```

- Makes `/impeccable` available in every army project (user decision 2026-08-06: global, not per-project, because the army works across many projects).
- Reload the harness afterward; `/impeccable` should appear in autocomplete.

## Per-project setup (one-time, cheap)

```bash
npx impeccable install          # writes hook manifests + .impeccable/config.json
/impeccable init                # writes PRODUCT.md
/impeccable document            # writes DESIGN.md + .impeccable/design.json
```

- Hooks are **project-local by harness design** (`.codex/hooks.json`, `.claude/settings.json`, `.cursor/hooks.json`) — they cannot be global. Codex requires `/hooks` approval after install/update.
- Context files (`PRODUCT.md`, `DESIGN.md`, `.impeccable/`) are inherently per-project.

## Verify

- `/impeccable doctor` — checks schema drift, truth drift, broken hook paths, stale config, orphaned surface briefs, monorepo platform mismatches.
- A hook that looks installed but scans nothing is the failure you would never notice — doctor catches it.
- `npx impeccable check` / `update` — keep the installed system current.

## CI gate (user decision 2026-08-06)

```bash
npx impeccable detect --json src/ > .impeccable/detect.json   # exit 2 fails the PR check
```

Add to army projects' PR checks.

## Compliance

- Build the stinger from the repo (Apache-2.0), not the site (robots.txt: `ai-train=no, use=reference`). Keep attribution.
- Never fork or modify the engine into the stinger; call the installed system. Follow the bee-army-update contract.
