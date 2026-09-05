---
source_type: blog
authority: high
relevance: high
topic: sdk-api
url: https://cursor.com/blog/typescript-sdk
fetched: 2026-05-20
---

# Build programmatic agents with the Cursor SDK (Official Launch Blog)

## Summary

Official Cursor blog post announcing the TypeScript SDK public beta (April 29, 2026, by Roshan Sadanani). Provides launch context, positioning, and key architectural facts for `stinger-forge` to use as narrative framing in `guides/04-sdk-api.md`.

The SDK is available to all users, billed at standard token-based consumption pricing. It targets three runtime modes: local (runs on caller's machine against cwd), cloud Cursor-hosted (dedicated VM, persistent sessions, autoCreatePR), and self-hosted workers (data residency use cases).

The post confirms integration with the Agents Window in Cursor 3: SDK-launched cloud runs appear in the Agents Window and web app at cursor.com/agents - you can start a task programmatically and jump into Cursor to inspect progress or take over.

Key capabilities beyond basic prompting: `.cursor/hooks.json` file for observing/controlling runs, subagents (delegate subtasks to named subagents with own prompts and models), codebase indexing automatically included.

Reference use cases from the post:
- **Quickstart**: minimal Node.js example, local agent, one prompt, streamed response
- **Prototyping tool**: web app for spinning up sandbox cloud agents
- **Kanban board**: engineer drags a card, agent picks up work, opens PR, posts result back
- **Coding agent CLI**: lightweight terminal interface spawning Cursor agents

## Key quotations

- "The same agent that runs in the Cursor desktop app, CLI, and web app is now accessible with a few lines of TypeScript."
- "SDK cloud runs show up in Cursor's Agents Window and web app. You can start a task programmatically and then jump into Cursor to inspect progress or take over."
- "Hooks: Observe, control with a `.cursor/hooks.json` file."
- "Subagents: Delegate subtasks to named subagents with their own prompts and models, which the main agent spawns via the `Agent` tool."

## Annotations for stinger-forge

- Use the kanban board and coding-agent CLI examples as inspiration for real-world examples in guide 04.
- The `.cursor/hooks.json` mention is a separate feature from the SDK proper - note it as a related but distinct surface in guide 04 and point to Cursor's Hooks docs.
- The "start programmatically, inspect in Cursor Agents Window" workflow is the primary selling point for cloud agents - emphasize in guide 04.
- The three runtime modes (local / Cursor-hosted cloud / self-hosted) should be the organizing framework for the runtime selection section.
