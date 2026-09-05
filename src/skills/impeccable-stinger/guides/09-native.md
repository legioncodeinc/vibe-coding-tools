# 09 — Native Surfaces (iOS / Android / adaptive)

Derived from `research/10-native-platforms-harnesses.md`.

## Rules

- The detector is **web only** — it reads HTML and CSS. It has nothing to say about a native iOS/Android codebase.
- When `PRODUCT.md` declares `ios`, `android`, or `adaptive`:
  - `/impeccable audit` runs the **native pass** (`audit.native.md`): VoiceOver, TalkBack, touch targets, platform conformance.
  - `adapt` has a native variant (`adapt.native.md`).
  - Per-platform rulebooks: `ios.md`, `android.md`.
- `init` detects the platform from codebase evidence and asks only when ambiguous; the platform is recorded in `PRODUCT.md`.

## Harness builds (per-model tuning)

- `npx impeccable install` auto-detects the harness and writes the right skill files (`.claude/skills/`, `.cursor/skills/`, `.codex/`, `.gemini/`, `.grok/`, etc.) plus provider-native hook manifests.
- Per-model rule tuning: the Gemini build kills image-on-hover motion; the Codex build refuses ghost-cards and over-rounding. The installed build may carry extra rules for the active model — expect that.
- `npx skills add pbakaus/impeccable` installs one shared build (functionally complete, not tailored).
- Claude Code plugin: `/plugin marketplace add pbakaus/impeccable`. GitHub Copilot: built in (Settings → Experimental).

## Bee behavior

- Default domain is web. Native surfaces route to the native playbooks and the native audit pass.
- The stinger is complete for any build: web, iOS, Android, adaptive (user decision 2026-08-06).
