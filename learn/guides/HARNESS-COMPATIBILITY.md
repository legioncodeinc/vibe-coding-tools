# Harness Compatibility

Vibe Coding Tools preserves each capability using the format its harness actually supports. Compatibility means the behavior survives, not that every directory name is identical.

| Capability | Claude Code | Codex | Cursor |
|---|---|---|---|
| 82 agents | Markdown agents | 82 project TOML agents | Markdown agents |
| 85 core skills | Native plugin skills | Repository skills plus plugin skills | Native skills |
| 2 commands | Native commands | Translated into 2 explicit-invocation skills in both Codex layers | Native commands |
| 4 rules | `CLAUDE.md` and `.md` rules | Project developer instructions | Native `.mdc` rules |
| Dash guard | Blocking PreToolUse hook | Blocking PreToolUse adapter parses patches | Blocking preToolUse hook |
| Component validation | Advisory PostToolUse hook | Advisory PostToolUse patch adapter | Advisory postToolUse hook |
| Package manifest | `.claude-plugin/plugin.json` | `.codex-plugin/plugin.json` | `.cursor-plugin/plugin.json` |

## Codex has two layers

The Codex plugin provides skills and hooks in the ChatGPT desktop app and Codex CLI. The generator builds `.agents/skills`, `.codex/agents`, and a separate plugin skill layer under `.codex/plugins/vibe-coding-tools/skills` as ignored local output. Generate these from `src` before using a source checkout as an installed adapter.

## Source and generation

The `src` tree is canonical. Harness folders are ignored build outputs; shared entry templates and manifests live under `src/harnesses/`. `learn/scripts/generate-harnesses.py` removes unsupported shared agent metadata, translates active Cursor paths, creates Codex TOML agents, and refreshes the same 87 Codex-facing skills in `.agents/skills` and the plugin.

## Honest limits

- A Codex plugin does not contain the 82 custom-agent TOMLs. The project adapter does.
- Codex does not use a repository `.codex/commands` directory. The two shared command workflows are explicit-invocation skills named `$the-beekeeper` and `$the-smoker`.
- Cursor and Claude hook payloads are not interchangeable, even when they call the same script.
- A model name from one provider is not copied into another provider's configuration.
- Installed hooks require each harness's trust and reload process.
