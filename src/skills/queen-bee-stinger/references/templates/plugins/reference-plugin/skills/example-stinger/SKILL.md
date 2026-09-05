---
name: example-stinger
description: Placeholder stinger shipped inside the Hive reference plugin skeleton, showing where a real plugin-bundled skill lives. Not a working stinger on its own.
license: MIT
compatibility: "Claude Code, Cursor, Codex, Cowork"
metadata:
  hive-component: stinger
  hive-status: placeholder
---

# Example stinger (plugin skeleton stub)

This is a stub. It exists to show a plugin-bundled stinger's file location (`skills/<name>/SKILL.md`, at the plugin root, never inside `.claude-plugin/`) and its required spec-six frontmatter shape.

Do not build a real stinger from this file directly. The real starting point is the full Hive stinger template at `../../../../skills/reference-template/SKILL.md`, which carries the working Critical Directive, close-out block, and `references/`/`scripts/` scaffolding a real stinger needs.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [related-stinger-name](../related-stinger-folder-path) - {Description of skill and common use cases.}
