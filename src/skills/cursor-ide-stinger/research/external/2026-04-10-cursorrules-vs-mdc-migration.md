---
source_type: blog
authority: high
relevance: high
topic: rule-file-authoring
url: https://thepromptshelf.dev/blog/cursorrules-vs-mdc-format-guide-2026
fetched: 2026-05-20
---

# .cursorrules vs .cursor/rules (MDC): Which Format to Use in 2026

## Summary

Published April 10, 2026. This guide provides the definitive comparison between `.cursorrules` (legacy, single-file, always-on) and `.cursor/rules/*.mdc` (modern, multi-file, four activation modes). The key finding: `.cursorrules` is silently ignored in Cursor's Agent mode. Any team using agentic workflows must migrate to MDC format or their rules will not apply.

The MDC format uses YAML frontmatter with three fields (`description`, `alwaysApply`, `globs`) to create four activation modes. Critical performance note: total `alwaysApply: true` rule content should stay under approximately 2,000 tokens combined - these consume context budget before any code is analyzed.

When both formats coexist, `.mdc` rules win over `.cursorrules` on conflicting instructions, but the override is silent and may cause unexpected behavior.

The comparison table shows MDC wins on every modern dimension: Agent mode support, subdirectory rules, file scoping via globs, team rules (Enterprise), conflict resolution, and multiple rule files. The only case for keeping `.cursorrules` is very small, non-agentic projects where no migration is planned.

Migration path: (1) inventory all rules in `.cursorrules`, (2) categorize each by activation mode needed, (3) create one `.mdc` file per logical rule group, (4) set appropriate frontmatter, (5) test by mentioning matching files, (6) archive or delete `.cursorrules`.

## Key quotations

- "`.cursorrules` is silently ignored in Cursor's Agent mode."
- "Important constraint: Keep total `alwaysApply` rule content under approximately 2,000 tokens combined."
- "There is also a precedence issue when both formats coexist: `.mdc` rules win over `.cursorrules` on conflicting instructions."
- "The moment you enable Agent mode, you need MDC — your existing rules are invisible to it. Migration takes under an hour for most projects."

## Annotations for stinger-forge

- The "`.cursorrules` silently ignored in Agent mode" finding is the single most important migration motivator - put it at the top of the migration section in `guides/02-rule-file-authoring.md`.
- The 2,000-token budget for `alwaysApply: true` rules is a critical constraint that should appear in `guides/01-principles.md`.
- The MDC vs `.cursorrules` comparison table is worth reproducing verbatim in the guide.
- The activation mode descriptions (Loaded in every Chat/Composer/Agent, Activates on glob match, AI-decided, Manual mention) should be the four-mode framework for the authoring guide.
