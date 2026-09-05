---
source_url: https://code.claude.com/docs/en/best-practices
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: prompt-context-discipline
stinger: ai-coding-tools-stinger
---

# Claude Code Best Practices (Official Anthropic Docs, 2026)

## Summary

Official Anthropic documentation for Claude Code best practices. Covers CLAUDE.md structure and placement, autonomous agent patterns, verification strategies, and the explore-plan-code workflow. This is the authoritative source for Claude Code prompt and context discipline in the Stinger's `guides/04-prompt-and-context-discipline.md`.

## Key quotations / statistics

- "Give Claude verification criteria. Include tests, screenshots, or expected outputs so Claude can check its own work — this is the single highest-leverage thing you can do."
- "Claude performs dramatically better when it can verify results through tests, comparisons, or validated outputs."
- "Explore first, then plan, then code. Separate research and planning from implementation to avoid solving the wrong problem."
- "Run `/init` to get started. Claude will explore your codebase and draft a `CLAUDE.md` covering build commands, tests, structure, and detected conventions in about five minutes."

## CLAUDE.md structure and hierarchy

Claude reads and merges from multiple locations (broad to specific):

1. `~/.claude/CLAUDE.md`: personal preferences across all projects
2. `<repo-root>/CLAUDE.md`: project-level conventions (main one, committed to git)
3. `<subdir>/CLAUDE.md`: module-specific rules loaded on demand

Files are loaded at session start and delivered as a user message immediately after the system prompt. Enterprise prompt caching applies: first request pays full tokens; subsequent requests within ~5 minutes cache at a significantly lower rate.

## What to include in CLAUDE.md

Keep under ~200 lines, signal-dense:

- Build, test, and dev commands
- Naming conventions (file names, variables, CSS classes)
- Architecture overview and directory structure
- Hard rules ("ALWAYS" or "NEVER" do X)
- Tech stack details

**Exclude:** General coding advice Claude already knows, language syntax docs, lengthy explanations.

## The Explore → Plan → Code pattern

1. **Explore**: Ask Claude to read files and understand current state without making changes
2. **Plan**: Ask Claude to outline the approach and confirm before starting
3. **Code**: Implementation only after agreement on the plan

This three-phase discipline prevents Claude from solving the wrong problem and dramatically reduces wasted iterations.

## Autonomous task verification

For headless/autonomous tasks, provide Claude with:
- Unit tests that the implementation must pass
- Expected file outputs for comparison
- Screenshots of expected UI state
- Specific error messages to reproduce and fix

## Annotations for stinger-forge

- `guides/04-prompt-and-context-discipline.md`: This is the primary source for the Claude Code section. Structure it as: CLAUDE.md placement → CLAUDE.md content → Explore-Plan-Code workflow → verification criteria pattern
- The `/init` command is a valuable quick-start tip that deserves its own callout in the guide
- The prompt caching note is relevant to `guides/03-model-routing.md`: Enterprise tier users get different effective token costs
- Cross-link this guide with the `ai-tools-platform-stinger` for provider-level cost optimization (that Stinger owns the Portkey/OpenRouter layer)
