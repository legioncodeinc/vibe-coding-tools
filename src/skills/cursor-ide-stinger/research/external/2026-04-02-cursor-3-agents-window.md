---
source_type: blog
authority: high
relevance: high
topic: modes-and-agents
url: https://www.digitalapplied.com/blog/cursor-3-agents-window-design-mode-complete-guide
fetched: 2026-05-20
---

# Cursor 3: Agents Window, Cloud Agents, and What Changed

## Summary

Published April 2, 2026. Cursor 3 is the biggest architectural change since the editor launched. The Agents Window is a new standalone, agent-first interface for running many agents in parallel across local repos, cloud, remote SSH, and mobile. Background Agents from Cursor 2.0 are now officially "Cloud Agents." Composer 2 (Cursor's own frontier coding model) shipped with this release.

**Agents Window capabilities:**
- Unified sidebar showing all agents (local, cloud, mobile, Slack, GitHub, Linear)
- Multi-workspace: one agent session can target several repositories at once
- Local-to-cloud handoff: move agent between local and cloud mid-task
- Agent Tabs (tiled layout added April 13): multiple agents in panes side-by-side
- `/multitask` command: async subagents in parallel rather than queued
- Multi-root workspaces (v3.2): one agent targets multiple folders

**Mode decision table (from post):**
- Single agent tab: focused work on one feature
- Agent Tabs (grid): comparing two approaches side-by-side
- Agents Window: long-running cloud agents, multi-repo orchestration
- `/multitask`: single task that decomposes naturally (cross-file refactors, parallel tests)

**Cloud Agents:** spin up isolated Ubuntu VMs, clone repo, work on dedicated `agent/` branch, open PR on completion. Notifications via email, Cursor desktop, Slack. Privacy Mode must be disabled. Spend limit configurable at cursor.com/dashboard.

**Backward compatibility:** existing rules, models, and project configuration carry over from Cursor 2.0. The main change is the Agents Window becoming the primary agent interface.

## Key quotations

- "The Agents Window is now the primary surface for agent interaction, with the classic editor available as a complement."
- "All your agents appear in one sidebar -- local agents, cloud agents, and the ones you kicked off from mobile, web, the desktop app, Slack, GitHub, and Linear."
- "Background Agents have been renamed to Cloud Agents."
- "Cursor's guidance: the Agents Window works best when you want to run and manage many agents in parallel, while the classic editor remains the better choice for flexible screen splitting, VS Code extensions, and viewing many files at once."

## Annotations for stinger-forge

- The Agents Window is the correct term in 2026 (not "Background Agents" - that is deprecated). Update guide 05 terminology.
- The local-to-cloud handoff capability should be in `guides/05-modes-and-productivity.md` as a workflow pattern.
- The `/multitask` command is a high-value slash command to document in the keybindings/productivity guide.
- The "when to use which surface" table (single tab vs Agent Tabs vs Agents Window vs /multitask) is a useful decision framework.
- Cloud Agent setup steps (Settings > Beta > Background Agent, GitHub repo access, spend limit) should be in guide 05.
