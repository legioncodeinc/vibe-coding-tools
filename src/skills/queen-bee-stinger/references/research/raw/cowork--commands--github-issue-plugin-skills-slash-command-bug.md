# Plugin skills discoverable but not invocable via Skill tool (GitHub issue)
- URL: https://github.com/anthropics/claude-code/issues/46079
- Fetched: 2026-08-14
- Source type: community
- Component: commands (also plugins, skills)

State: closed (auto-closed as duplicate of #41842)
Author: carbonfix-tech
Created: 2026-04-10T05:45:25Z
Repository: anthropics/claude-code
Labels: duplicate, area:skills, area:plugins, area:cowork, platform:web

## Description

Skills defined in `skills/*/SKILL.md` within a custom org plugin appear correctly in the Cowork slash command menu (under a "Plugin name" section). However, invoking them — either by clicking in the menu or typing `/skill-name` — returns:

```
Unknown skill: plugin-name:skill-name
```

The Skill tool cannot resolve plugin skills. Only `anthropic-skills:*` skills work via the Skill tool.

## Reproduction

1. Create an org plugin with skills in `skills/*/SKILL.md` (standard structure, valid YAML frontmatter)
2. Deploy via Claude Team Plan admin as an org plugin
3. Open Cowork — skills appear in the `/` slash command menu under the plugin name
4. Click any skill or type `/skill-name`
5. Result: "Unknown skill: plugin-name:skill-name"

## Expected behavior

Plugin skills that appear in the slash command menu should be invocable via the Skill tool, the same way `anthropic-skills:*` skills work.

## Workaround

Add a skills table to the plugin's CLAUDE.md that maps trigger phrases to file paths. Claude reads the SKILL.md file directly via the Read tool when the Skill tool fails. This works but adds an unnecessary failure/retry step to every skill invocation.

## Environment

- Cowork (claude.ai)
- Custom org plugin deployed via Claude Team Plan admin
- GitHub-hosted plugin repo
- Skills use standard `skills/*/SKILL.md` structure with YAML frontmatter

## Related duplicate issue

- Duplicate of #41842: "Plugin skills/ directory does not register slash commands — only commands/ works" — that issue documents the same underlying gap from the Claude Code CLI side: plugin skills defined in `skills/*/SKILL.md` load as Agent Skills (Skill-tool/model invocation works in the CLI), but historically were not registered as user-invocable `/plugin-name:skill-name` slash commands; only files placed in the plugin's `commands/` directory reliably registered as slash commands. The official docs mark `commands/` as "legacy; use `skills/` for new skills" while acknowledging this gap, and issue #41842 notes the fix landed in Claude Code CLI version 2.1.98 — this Cowork-specific report (#46079, filed April 2026) shows the same class of bug recurring in Cowork's separate slash-command/Skill-tool resolution path, distinct from the CLI's.

## Why this is archived (technical substance note)

This is direct evidence that Cowork's slash-command surfacing of plugin components is implemented as its own resolution path, separate from (and not perfectly in sync with) the Claude Code CLI's plugin-skill loader — even though both consume the same `.claude-plugin/plugin.json` + `skills/*/SKILL.md` package format. It also confirms that in Cowork, plugin skills are namespaced in the `/` menu as `plugin-name:skill-name`, matching the Claude Code CLI's namespacing convention documented in `cowork--multiple--code-claude-docs-plugins-reference.md`.
