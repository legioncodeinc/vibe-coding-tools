---
source_type: internal-artifact
authority: high
relevance: high
topic: rule-file-authoring
url: c:/Users/mario/GitHub/legion-code/.cursor/rules/no-em-dashes.mdc
fetched: 2026-05-20
---

# Live .mdc Rule File: no-em-dashes

## Summary

The `no-em-dashes.mdc` file in this repository is a canonical example of an `alwaysApply: true` rule. It demonstrates the complete MDC format in practice: YAML frontmatter with two fields (`description` and `alwaysApply`), a clear natural-language rule title, and rich body content with BAD/GOOD examples, a substitution table, and exception cases. This rule is replicated across all three workspace repos (`legion-code`, `legion-website`, `vibe-code-training`), demonstrating the pattern of shared rules maintained in parallel.

## Key observations

- **Frontmatter fields used:** `description` (one sentence) and `alwaysApply: true`. No `globs` field because this rule applies regardless of file type.
- **Description content:** "Never use em dashes (or en dashes) in prose written for the user" - concise, action-oriented, directly tells the agent what NOT to do.
- **Body structure:** H1 title, problem statement, substitution table with BAD/GOOD examples per scenario, exceptions section, self-check instruction. This structure is a model template for other rules.
- **Token cost:** The file is ~430 words / ~600 tokens. As an `alwaysApply: true` rule, it occupies context budget in every session.
- **Cross-repo duplication:** Same file in `.cursor/rules/` across 3 repos. This is acceptable for universal prose rules but would be better served by a Team Rule (Enterprise) if the organization grows.

## Annotations for stinger-forge

- Use this as the worked example in `guides/02-rule-file-authoring.md` showing a complete, production-quality `alwaysApply: true` rule.
- The token budget concern (600 tokens always consumed) is worth noting in `guides/01-principles.md` under the "cost of alwaysApply" section.
- The BAD/GOOD example pattern in the rule body is the recommended style for writing rule content - mention this in guide 02.
- The cross-repo duplication pattern (vs. Team Rules) should be called out as a migration path consideration.
