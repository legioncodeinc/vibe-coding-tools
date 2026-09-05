# Reference plugin skeleton

This is a minimal, working cross-harness plugin skeleton for Project Hive. Every file in here is a stub, not a finished plugin. Copy this folder, rename it, and replace the `{placeholder}` values before you ship anything.

## Layout rule

The manifest and only the manifest goes inside `.claude-plugin/`. Every component, `skills/`, `commands/`, `agents/`, `hooks/`, `.mcp.json`, lives at the plugin root, one level up from `.claude-plugin/`, never nested inside it. Get this backwards and Claude Code, Cowork, and Codex's legacy-compat path all fail to find your components.

**Rename before you use this.** In this template the manifest folder ships as `dot-claude-plugin/`, not `.claude-plugin/`. That is deliberate. This template lives inside a skill, and a skill ships inside a plugin, so a real `.claude-plugin/plugin.json` down here would give the outer package two manifests and every installer rejects a package with more than one. Copy the template out, rename `dot-claude-plugin/` to `.claude-plugin/`, and it becomes a working plugin.

```
reference-plugin/
├── dot-claude-plugin/plugin.json.template   (rename dir to .claude-plugin/ and file to plugin.json)
├── skills/example-stinger/SKILL.md
├── commands/example-command.md
├── agents/example-bee.md
├── .mcp.json
├── hooks/hooks.json
└── README.md
```

## Where each harness picks this up

- **Claude Code and Cowork** read `.claude-plugin/plugin.json` directly. Same package format, no translation needed.
- **Codex** reads it too, through its legacy-compat marketplace path (`.claude-plugin/marketplace.json`), and also reads `.mcp.json`/`hooks/hooks.json` if you bundle it as a Codex-native plugin instead.
- **Cursor** does not read `.claude-plugin/plugin.json`. It needs its own `.cursor-plugin/plugin.json` alongside this one if you want full Cursor plugin support (rules, agents, commands, hooks, variables).

## Full reference

Every claim behind this layout, every field table, every gotcha, lives in `../harness-specific-reference.md`. Read that before you build a real plugin from this skeleton.
