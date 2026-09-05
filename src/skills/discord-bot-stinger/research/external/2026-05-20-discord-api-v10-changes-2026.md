---
source_url: https://space-node.net/blog/discord-api-changes-whats-new-2026
retrieved_on: 2026-05-20
source_type: blog
authority: medium
relevance: high
topic: api-versioning
url: https://space-node.net/blog/discord-api-changes-whats-new-2026
fetched: 2026-05-20
---

# Discord API Changes: What's New in 2026 (space-node.net)

## Summary

Practitioner blog post (March 2026) summarizing current Discord API state. API v10 remains the current stable major version for bot development. New features (polls, components, permissions) are shipping on top of v10 without a major version bump. Gateway intents remain mandatory. Quarterly maintenance checklist provided.

## Key quotations / statistics

- "The headline is simple: API v10 remains the current major for bot development, while features like polls, components, and permission refinements continue to ship on top."
- "Message content intent is the permission layer for reading message bodies in many event types."
- "Assume content is absent until you prove otherwise in code and Portal settings."

## Quarterly Maintenance Checklist (2026)

1. Confirm API v10 across REST and gateway paths
2. Audit intents: remove unused privileged toggles
3. Load-test slash commands under missing permissions
4. Graph 429 rates and gateway resume frequency
5. Rehearse token rotation and command registration rollback

## Annotations for stinger-forge

- **guides/05-scaling-ops.md**: The quarterly checklist is a ready-made ops guide item. v10 is stable and current: no migration pressure.
- **guides/00-principles.md**: Intents audit and 429 rate tracking belong in the principles guide as ongoing discipline.
- Medium authority (practitioner blog, not Discord official) but consistent with official docs. Verify specific claims against Discord Changelog at discord.com/developers/docs/change-log.
