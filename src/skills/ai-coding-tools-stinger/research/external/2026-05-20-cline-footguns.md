---
source_url: https://github.com/cline/cline/issues/4374
retrieved_on: 2026-05-20
source_type: github-readme
authority: community
relevance: high
topic: footguns
stinger: ai-coding-tools-stinger
---

# Cline Known Issues and Footguns (2026 GitHub Issues)

## Summary

A synthesis of documented Cline (formerly Claude Dev) issues from GitHub as of 2025-2026. Key failure modes: Claude Code tool name clash when used as Cline's API provider, command execution hangs, terminal integration conflicts, file editing reliability bugs, and task history corruption. All affect production use. Sources: GitHub issues #4374, #7898, #8538, #4384, #4359.

## Key quotations / statistics

- "Using Claude Code as an API provider in Cline causes a 'tools: Tool names must be unique' error due to duplicate tool definitions between the two extensions."
- "A workaround is disabling the auto-connect IDE feature with `CLAUDE_CODE_AUTO_CONNECT_IDE=false`." (Issue #4374)
- "Cline gets stuck indefinitely when GitHub CLI commands succeed on GitHub's end but fail to return validation responses back to Cline, leaving the chat blocked and unable to progress." (Issue #7898)
- "Startup commands from multiple plugins interfere when Cline opens new terminals, causing commands from Cline and other extensions to merge into garbled single-line commands that fail immediately." (Issue #8538)
- "The replace_in_file and write_to_file tools suffer from widespread failures including 'Diff Edit Mismatch' errors, infinite retry loops, whitespace handling problems, and content truncation for large files." (Issue #4384)
- "Task persistence is vulnerable to corruption from special characters, large context windows (>8MB), terminal output with escape sequences, and file encoding issues." (Issue #4359)

## Documented failure modes catalog

### 1. Claude Code + Cline tool name clash (Issue #4374)
- **Trigger**: Using Claude Code (Anthropic's CLI agent) as the API provider within Cline VS Code extension
- **Symptom**: "tools: Tool names must be unique" error
- **Workaround**: Set `CLAUDE_CODE_AUTO_CONNECT_IDE=false` environment variable

### 2. Command execution hang (Issue #7898)
- **Trigger**: GitHub CLI commands (gh pr create, gh pr submit) that succeed on GitHub's end but produce no terminal response
- **Symptom**: Cline chat blocks indefinitely with no progress
- **Workaround**: Manual task interruption and restart

### 3. Terminal integration conflict (Issue #8538)
- **Trigger**: Running Cline alongside other VS Code extensions that inject terminal startup commands
- **Symptom**: Multiple startup commands merge into a single garbled command that fails immediately
- **Workaround**: Switch to Background Execution Mode or increase shell integration timeout

### 4. File editing reliability (Issue #4384)
- **Trigger**: Large files, files with complex whitespace, or high-frequency edit operations
- **Symptom**: Diff Edit Mismatch errors, infinite retry loops, content truncation
- **Workaround**: Use write_to_file (full replacement) instead of replace_in_file (diff-based edit) for large files

### 5. Task history corruption (Issue #4359)
- **Trigger**: Context windows >8MB, files with binary content, terminal output with ANSI escape sequences
- **Symptom**: Task history disappears, unable to resume task
- **Workaround**: Keep context windows lean; avoid binary files in context

## Annotations for stinger-forge

- `guides/05-footguns.md`: All five failure modes belong here. The Claude Code + Cline clash is particularly important because developers frequently try to use both together.
- The footguns section should include severity ratings: (1) Claude Code clash = HIGH (blocks all use), (2) file editing reliability = HIGH (data loss risk), (3) context corruption = MEDIUM (recoverable with good habits), (4) terminal conflict = LOW (workaround easy)
- Cross-reference: The Cursor vs Cline conflict (installing Cline in Cursor IDE, which already has its own agentic system) also deserves mention: Cursor's built-in Composer/Agent makes Cline redundant and occasionally conflicting in Cursor environments
