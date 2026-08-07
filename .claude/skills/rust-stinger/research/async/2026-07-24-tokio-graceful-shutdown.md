---
source_url: https://tokio.rs/tokio/topics/shutdown
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: critical
topic: shutdown
stinger: rust-stinger
---

# Tokio graceful shutdown

## Summary
Tokio presents graceful shutdown as three explicit phases: detect the trigger, notify owned work, and wait for work to finish. It demonstrates cancellation tokens for cooperative notification and task trackers for joining all tracked work, allowing cleanup such as database flushes before termination.

## Key quotations / statistics
- "Figuring out when to shut down."
- "Waiting for other parts of the program to shut down."

## Version/date caveat
Conceptual Tokio topic page; exact APIs may live in `tokio-util` and must match the selected versions.

## Annotations for stinger-forge
- Core source for task ownership and shutdown checklists.
- Supports a root cancellation token plus explicit join/timeout/escalation evidence.

