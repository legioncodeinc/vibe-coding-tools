# Harness capabilities

The Wasp Nest publishes one marketplace with separate plugins for core and optional packs. A Stinger is portable skill content, but agents, slash commands, hooks, and global instruction files do not have identical support in every coding harness. Choose the entry point your host actually exposes.

| Harness | Install and discovery | How to start a workflow | First-session setup |
| --- | --- | --- | --- |
| Claude Code | Add the [Claude marketplace](../../.claude-plugin/marketplace.json) with `/plugin marketplace add legioncodeinc/vibe-coding-tools`, then install the core and selected packs. | Use plugin commands such as `/pest-controller` and `/smoke-it`, or invoke a namespaced Stinger. | A supported local session hook offers global instructions, then repository Get Started, each with consent. |
| Codex | Add the [Codex marketplace](../../.agents/plugins/marketplace.json) with `codex plugin marketplace add legioncodeinc/vibe-coding-tools`, then select plugins in the browser. | Use the installed Stinger or its source-command wrapper. Claude-style slash commands do not become native Codex commands. | A supported local hook can offer the same two-step setup. Hook trust and availability depend on the client. |
| Cursor | Use the pack's Cursor-compatible plugin or local skills and agents. | Invoke a Stinger or the matching Cursor command where available. | Session hooks are supported in configured local installs; inspect the hook before enabling it. |
| ZCode | Use its Claude-compatible plugin layout where supported. | Use the plugin command, agent, or Stinger that this installation exposes. | Check the local hook configuration before relying on automatic prompts. |
| Claude Cowork | Install supported plugin bundles through Cowork's plugin interface. | Use the plugin's skill or command surface. | Cowork cannot modify files in a local home directory through the Wasp Nest hook. |

The plugin package itself is the portable source of the included content. The [core manifest](../../plugins/wasp-nest-core/plugin.json) and the selected pack's manifests show which components ship. A marketplace install does not silently merge `AGENTS.md` or `CLAUDE.md` into your home. The [public templates](../../AGENTS_template.md) and [Claude template](../../CLAUDE_template.md) are reference material until you accept the separate setup offer.

If a native command or agent is absent, ask your assistant to use the corresponding Stinger workflow by name. Do not assume that installing a plugin grants external-action authority: commits, pushes, deployments, messages, and purchases still require the permission applicable to the task. [Getting Started](../guides/GETTING-STARTED.md) explains the two lock files and consent checks.
