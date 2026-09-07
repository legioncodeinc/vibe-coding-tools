---
name: "elevenlabs-api-stinger"
description: "ElevenLabs API integration for speech, voices, streaming, webhooks, usage, and key boundaries. Use for ElevenLabs API implementation, review, or troubleshooting."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-bee: elevenlabs-api-worker-bee
  domain: elevenlabs-api
  pair-bee: elevenlabs-api-worker-bee
  research-window: 2026-03-05 to 2026-09-05
---

# ElevenLabs API Stinger

## Purpose

Guide secure, observable ElevenLabs API integrations. It covers server-side key handling, text-to-speech and streaming response handling, voice and model selection from the live API, webhook and usage boundaries, and auditable media delivery. Every domain claim is grounded in this skill's primary-source captures.

## When to use

- Adding ElevenLabs text-to-speech, speech-to-text, voices, dubbing, or streaming to an application
- Debugging an ElevenLabs request, audio response, cost record, or API credential boundary
- Designing a server endpoint that fronts the ElevenLabs API

## When not to use

- General provider or model selection outside the ElevenLabs API, use [ai-tools-platform-stinger](../ai-tools-platform-stinger).
- Browser-side secrets, webhook acceptance, or a formal security finding, use [security-stinger](../security-stinger).

## Procedure

1. Read [guides/01-integration-boundary.md](guides/01-integration-boundary.md) before adding a call.
2. Keep API keys on a trusted server. Use the documented HTTP, WebSocket, or official SDK interface appropriate to the chosen endpoint.
3. Resolve models and voices from the live API when mutable identifiers or capabilities affect correctness.
4. Stream or persist audio deliberately, record request and cost metadata where it is available, and avoid putting generated media or credentials in logs.
5. Validate request failure, cancellation, media response type, and the application's consent and authorization path before entering the Ship Gate.

## References map

- [references/REFERENCE.md](references/REFERENCE.md), load for integration decisions and verification checklist.
- [references/research/distilled-elevenlabs-api.md](references/research/distilled-elevenlabs-api.md), load to verify a domain claim.
- `references/research/raw/`, load to trace a claim to the primary source capture.
- [guides/01-integration-boundary.md](guides/01-integration-boundary.md), load for implementation work.

## Related bees and stingers

- [elevenlabs-api-worker-bee](../../agents/elevenlabs-api-worker-bee.md) - paired implementation specialist.
- [ai-tools-platform-stinger](../ai-tools-platform-stinger) - provider selection and platform-level tradeoffs.
- [security-stinger](../security-stinger) - independent audit of credentials and untrusted input.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [ai-tools-platform-stinger](../ai-tools-platform-stinger) - model and provider selection.
  - [security-stinger](../security-stinger) - credential and data-flow audit.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
