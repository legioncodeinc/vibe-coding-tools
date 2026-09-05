# 10 — Native Platforms & Harness Builds

**Source:** `skill/reference/ios.md`, `skill/reference/android.md`, `skill/reference/audit.native.md`, `skill/reference/adapt.native.md`, `docs/HARNESSES.md`, repo `.claude/ .cursor/ .codex/ .gemini/ .grok/ .trae/ .opencode/ .qoder/ .rovodev/` builds

## Native (iOS / Android / adaptive)

- The detector is **web only** ("The engine reads HTML and CSS, so it has nothing to say about a native iOS or Android codebase" — `impeccable.style/docs/detector`).
- When `PRODUCT.md` declares `ios`, `android`, or `adaptive`, `/impeccable audit` runs a native pass covering VoiceOver, TalkBack, touch targets, and platform conformance (`audit.native.md`); `adapt` has a native variant (`adapt.native.md`).
- `init` detects the platform from codebase evidence and asks only when ambiguous; platform is recorded in `PRODUCT.md`.
- Native guidance files: `ios.md`, `android.md` (per-platform rulebooks).

## Harness builds

- `npx impeccable install` auto-detects the harness and writes the right skill files (`.claude/skills/`, `.cursor/skills/`, `.codex/`, `.gemini/`, `.grok/`, etc.), plus provider-native hook manifests where supported.
- Per-model rule tuning: the Gemini build kills image-on-hover motion; the Codex build refuses ghost-cards and over-rounding (`README.md`; `<codex>`/`<gemini>` sections in `craft-floor.md`).
- `npx skills add pbakaus/impeccable` installs one shared build for every harness (functionally complete, not tailored).
- Claude Code plugin: `/plugin marketplace add pbakaus/impeccable`.
- GitHub Copilot: Impeccable is built in (Settings → Experimental).

## Evidence for the stinger

- The Bee's default domain is web; native surfaces route to the native playbooks and the native audit pass.
- The stinger should note the per-model build behavior so the Bee knows the installed build may carry extra rules for its model.
