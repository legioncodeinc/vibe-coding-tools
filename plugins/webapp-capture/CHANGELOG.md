# Changelog

All notable changes to the Webapp Capture plugin are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.1.0] - 2026-09-22

### Added

- Recursive `crawl-links` route discovery with route caps, pathname filtering, and route-family tab exclusions.
- Explicitly approved local or seeded onboarding plans that run once before screenshot or inventory shards and capture evidence before each step.
- Ordered screenshot-manifest merging so successful retry runs supersede earlier errors or truncations.
- Optional project context files and onboarding screenshots in Claude Design handoffs.

### Changed

- Tab capture reloads the base route and resolves the current tab before each click, preventing state from leaking between captures.
- Scroll-container selection favors substantial overflow regions and ignores short nested controls.
- Token exports report the configured capture theme instead of assuming dark mode.
- Sharp is updated to 0.35.4 and the documented Node.js minimum is aligned to 20.9.

### Security

- Onboarding validates every action before navigation, retains the built-in destructive-click denylist when custom rules are added, rejects secret-looking live fields, and confines onboarding evidence to the screenshots directory.

## [1.0.0] - 2026-09-15

### Added

- `/webapp-capture` command: orchestrator instructions for demo, screenshots, library, audit, all, and doctor routes, with intake, dry run, watchdogs, verification, reporting, and a Ship Gate.
- `webapp-capture-stinger` skill: foundation, demo, component library, and inconsistency audit guides; reference tables; describe, merge, and reconcile prompt templates; an 83-source research archive with a cited distillation.
- `webapp-capture-worker-bee` agent for delegated capture runs.
- Scripts: `doctor`, `save-session` (human login, sessionStorage sidecar), `parallel` (memory-capped sharding), `screenshots`, inventory (`extract`, `cluster`, `tokens`, `tokens-dtcg`, `sheets`, `prepare-describe`, `prepare-merge`, `validate-merge`, `build`), `demo/record-demo` with ffmpeg assembly, and `audit` (visual and code).
- Safety: read-only crawling, off-origin navigation blocking, theme guard, text redaction seeded from GitHub secret scanning patterns and the OWASP never-log list, screenshot masks, demo plan approval gate, destructive-target and secret-field guards.
- Candidate design tokens in the DTCG Format Module 2025.10 shape.
- Claude Design handoff: `inventory/design-handoff.mjs` packages the library, tokens, audits, page screenshots, and the shadcn/ui map with a filled `CLAUDE-DESIGN-INSTRUCTIONS.md` brief into one zip (lossless WebP images), delivered at the end of every library-based route.
- shadcn/ui map route: `inventory/shadcn-prepare.mjs`, mapping and theme prompts, a shadcn/ui catalog, and `inventory/shadcn-build.mjs`, which validates every mapping and writes `SHADCN-MAP.md`, `shadcn-map.json`, and an OKLCH `globals.css` theme draft.

### Security

- Session files are written owner-only, checked for gitignore coverage by `save-session` and `doctor`, and never read by the agent.

Designed and built by Legion Code Inc.
