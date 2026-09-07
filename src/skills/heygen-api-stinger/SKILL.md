---
name: "heygen-api-stinger"
description: "HeyGen API integration for video generation, avatars, assets, webhooks, limits, and safe asynchronous delivery. Use for HeyGen API implementation or debugging."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-bee: heygen-api-worker-bee
  domain: heygen-api
  pair-bee: heygen-api-worker-bee
  research-window: 2026-03-05 to 2026-09-05
---

# HeyGen API Stinger

## Purpose

Guide HeyGen API integrations that create, track, and deliver AI video without confusing an asynchronous provider job with a completed MP4. It covers server-side keys, generation status, assets, avatars, consent-sensitive work, webhooks, and recovery from provider failures.

## When to use

- Creating videos, avatars, translations, lipsync, or assets through HeyGen's API
- Implementing HeyGen status polling or webhooks
- Debugging HeyGen API keys, request contracts, limits, errors, or video delivery

## When not to use

- Creating a person-like image or video without confirmed consent and the required rights. Stop and obtain appropriate authorization.
- Generic webhook security review, use [security-stinger](../security-stinger).

## Procedure

1. Read [guides/01-generation-lifecycle.md](guides/01-generation-lifecycle.md).
2. Put `X-Api-Key` handling behind a trusted server boundary and validate caller authorization before work is queued.
3. Treat the create response as a job initiation. Track its documented status or a verified webhook before exposing a deliverable.
4. Preserve a mapping from local request to provider job and use idempotent local orchestration for retries.
5. Verify error handling, callback authenticity, result access control, and consent evidence before the Ship Gate.

## References map

- [references/REFERENCE.md](references/REFERENCE.md), load for lifecycle and event decisions.
- [references/research/distilled-heygen-api.md](references/research/distilled-heygen-api.md), load to verify facts.
- `references/research/raw/`, load for primary source captures.
- [guides/01-generation-lifecycle.md](guides/01-generation-lifecycle.md), load for implementation work.

## Related bees and stingers

- [heygen-api-worker-bee](../../agents/heygen-api-worker-bee.md) - paired implementation specialist.
- [security-stinger](../security-stinger) - webhook and secret audit.
- [natural-photography-stinger](../natural-photography-stinger) - consented photographic work, when available in the consumer environment.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [security-stinger](../security-stinger) - final secret and webhook review.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.
