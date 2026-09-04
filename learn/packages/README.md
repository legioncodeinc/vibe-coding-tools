# Release Packages

These version `1.0.0` archives are snapshots generated from the operational harness directories at repository root. Their table describes the archived contents, not the current source-tree inventory. See the [Asset Catalog](../ASSET-CATALOG.md) for current counts, and rebuild the archives before publishing a newer release.

| Archive | Installable root | Contents |
|---|---|---|
| `vibe-coding-tools-claude-code-1.0.0.zip` | `.claude/` | Claude Code agents, skills, commands, rules, and hooks |
| `vibe-coding-tools-codex-1.0.0.zip` | `.codex/plugins/vibe-coding-tools/` | Codex plugin with 80 skills and hooks |
| `vibe-coding-tools-codex-project-1.0.0.zip` | Repository root | Codex project adapter with 80 repository skills, 75 TOML agents, configuration, and hooks |
| `vibe-coding-tools-cursor-1.0.0.zip` | `.cursor/` | Cursor agents, skills, commands, rules, and hooks |

The Codex plugin archive is the installable distribution. The Codex project archive is the clone-and-use layer: extract it at a repository root to add `.agents/skills` and `.codex` project configuration. Codex plugins do not install custom project-agent TOMLs, so the two packages intentionally solve different jobs.

Before publishing a new version:

1. Run `python learn/scripts/generate-harnesses.py`.
2. Validate Claude and Codex manifests.
3. Validate every component.
4. Rebuild all four archives.
5. Extract them into an empty temporary folder.
6. Check for absolute paths, parent traversal, `.git`, `.env`, and secrets.
7. Run security before quality.
