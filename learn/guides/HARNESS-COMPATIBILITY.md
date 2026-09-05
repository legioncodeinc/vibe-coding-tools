# Harness Compatibility

Vibe Coding Tools preserves each capability using the format its harness actually supports. Compatibility means the behavior survives, not that every directory name is identical.

| Capability | Claude Code | Codex | Cursor |
|---|---|---|---|
| 77 agents | Markdown agents | 77 project TOML agents | Markdown agents |
| 80 core skills | Native plugin skills | Repository skills plus plugin skills | Native skills |
| 2 commands | Native commands | Translated into 2 explicit-invocation skills in both Codex layers | Native commands |
| 4 rules | `CLAUDE.md` and `.md` rules | Project developer instructions | Native `.mdc` rules |
| Dash guard | Blocking PreToolUse hook | Blocking PreToolUse adapter parses patches | Blocking preToolUse hook |
| Component validation | Advisory PostToolUse hook | Advisory PostToolUse patch adapter | Advisory postToolUse hook |
| Package manifest | `.claude-plugin/plugin.json` | `.codex-plugin/plugin.json` | `.cursor-plugin/plugin.json` |

## Codex has two layers

The Codex plugin provides skills and hooks in the ChatGPT desktop app and Codex CLI. The repository also ships `.agents/skills`, `.codex/agents`, `.codex/config.toml`, and `.codex/hooks.json` as a standalone project adapter. This gives a cloned repository all 82 skills in Codex CLI and the IDE extension without requiring plugin installation.

## Source and generation

The `.claude` tree is canonical. `learn/scripts/generate-harnesses.py` removes unsupported shared agent metadata, translates active Cursor paths, creates Codex TOML agents, and refreshes the same 82 Codex-facing skills in `.agents/skills` and the plugin.

## Honest limits

- A Codex plugin does not contain the 77 custom-agent TOMLs. The project adapter does.
- Codex does not use a repository `.codex/commands` directory. The two shared command workflows are explicit-invocation skills named `$the-beekeeper` and `$the-smoker`.
- Cursor and Claude hook payloads are not interchangeable, even when they call the same script.
- A model name from one provider is not copied into another provider's configuration.
- Installed hooks require each harness's trust and reload process.
