---
name: "localization-stinger"
description: "Implement locale routing, message resources, ICU/plurals, Intl formatting and RTL in a selected web framework. Use for localization changes and scoped translation review."
license: AGPL-3.0-or-later
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-tier: specialist
  paired-drone: localization-wasp-drone
  domain: localization
  research-window: 2026-10-08 current-source capture
---

# Localization Stinger

Read [README.md](README.md) and [the topic contract](TOPIC.md). Implement authorized locale/resource/formatting/RTL changes in the existing selected framework. Deliver changed target files and scoped evidence. This skill's synthetic mechanics establish only their declared contract.

## When to use
- Add approved languages, locale routing, resource fallback or message wiring.
- Implement ICU/plural/date/number/currency display with explicit domain inputs.
- Implement RTL, bidi isolation and scoped translation review.

## Boundaries
Do not choose a framework, locale policy, translation provider, currency conversion or user timezone by assumption. Locale does not determine authorization or identity. Render resource/interpolated content through escaped text bindings; raw HTML/resource injection routes to Core security. User-approved locale/content privacy and reviewer decisions precede dependent work. Actual UI follows Impeccable and selected framework ownership; glyph/font delivery follows Typography. Provider settings, credentials, installs, private-content uploads, deployment and publication require their own authority.

## Procedure
1. Read the target context and approved locale/content contract; ask only unresolved decisions.
2. Apply [locale/resource guide](guides/01-locales-and-resources.md) within selected route/render/resource conventions.
3. Apply [message/formatting guide](guides/02-messages-and-formatting.md) with the installed engine and explicit money/time inputs.
4. Apply [RTL/review guide](guides/03-rtl-and-translation-review.md) on the actual surface under Impeccable.
5. Run target checks and record exact output with [the evidence template](templates/evidence-report.md). Keep synthetic proof separate; unperformed native/browser/accessibility/human review is NOT_RUN. Do not infer blanket translation quality or RTL/accessibility conformance.
6. Complete the Ship Gate before any approved commit/push. Preserve other workers' files and task scope.

## References
- [Digest](references/research/distillation.md) and raw manifest: resolve domain claims.
- [Resource contract](references/contract.md) and [examples](examples/icu-and-rtl.md): bounded assumptions and unexecuted integration shape.
- [Node proof](examples/contract-proof.mjs): synthetic locale/resource/Intl mechanics only.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [impeccable-stinger](../impeccable-stinger) - Preserve UI context and design direction.
  - [typography-font-stinger](../typography-font-stinger) - Technical font/glyph/loading ownership.
  - [security-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/security-stinger) - First formal gate and resource/rendering risk.
  - [quality-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/quality-stinger) - Second formal gate.
  - [github-repo-health-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/github-repo-health-stinger) - Orchestrator final gate.
