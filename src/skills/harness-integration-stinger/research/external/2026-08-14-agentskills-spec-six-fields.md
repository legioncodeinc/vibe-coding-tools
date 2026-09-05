# Agent Skills - Format Specification (the portable spec-six frontmatter)
- URL: https://agentskills.io/specification
- Fetched: 2026-08-14
- Source type: official docs (Agent Skills open standard, agentskills.io)
- Component: Skills, all four harnesses (portability baseline)

## The six spec-legal frontmatter fields

A skill is a directory containing at minimum a `SKILL.md` file, plus optional `scripts/`, `references/`, `assets/`. `SKILL.md` must contain YAML frontmatter followed by Markdown content. The specification defines exactly six frontmatter fields:

| Field | Required | Constraints |
|---|---|---|
| `name` | Yes | Max 64 characters. Lowercase letters, numbers, and hyphens only. Must not start or end with a hyphen. |
| `description` | Yes | Max 1024 characters. Non-empty. Describes what the skill does and when to use it. |
| `license` | No | License name or reference to a bundled license file. |
| `compatibility` | No | Max 500 characters. Indicates environment requirements (intended product, system packages, network access, etc.). |
| `metadata` | No | Arbitrary key-value mapping for additional metadata (string keys to string values). |
| `allowed-tools` | No | Space-separated string of pre-approved tools the skill may use. (Experimental) |

Minimal legal example:
```markdown
---
name: skill-name
description: A description of what this skill does and when to use it.
---
```

Good vs. poor `description`: "Extracts text and tables from PDF files, fills PDF forms, and merges multiple PDFs. Use when working with PDF documents or when the user mentions PDFs, forms, or document extraction." (good - specific, keyword-rich) vs. "Helps with PDFs." (poor - no trigger signal). This confirms the queen-bee-stinger research's framing of `description` as the auto-invocation trigger text, not human-readable prose.

## Progressive disclosure (three-stage loading, matches every harness's behavior)

1. **Metadata** (~100 tokens): `name` and `description` loaded at startup for every discoverable skill.
2. **Instructions** (<5,000 tokens recommended): the full `SKILL.md` body loads only once the skill is activated.
3. **Resources** (as needed): files in `scripts/`, `references/`, `assets/` load only when actually required.

"Keep your main SKILL.md under 500 lines. Move detailed reference material to separate files." Keep file references one level deep from `SKILL.md` - avoid deeply nested reference chains.

## Why the six-field spec is the portability baseline

This is the authoritative, harness-agnostic source for the fact already captured in `queen-bee-stinger`'s distilled research (Claude Code section, "Portability-critical rule"): outside Claude Code itself, only these six fields are legal in `SKILL.md` frontmatter - any Claude-Code-only extension field (`context: fork`, `disable-model-invocation`, `argument-hint`, `paths`, `hooks`, etc.) is a Claude-Code-specific superset, not part of the portable contract. A skill authored against only these six fields is guaranteed to parse correctly wherever an Agent-Skills-compliant client (Claude Code, Cursor, Codex, Cowork, and the growing list of other adopters) reads it. Any Hive skill intended to run identically across all four harnesses should treat this six-field table as the lowest common denominator and put anything harness-specific behind a documented degradation, not a frontmatter field a non-Claude-Code harness will reject.

## Discovery convention (also relevant to per-harness skill placement)

A companion Agent Skills client-implementation guide (agentskills.io/client-implementation/adding-skills-support) notes `.agents/skills/` has emerged as "a widely-adopted convention for cross-client skill sharing" - scanning it means skills installed by one compliant client are automatically visible to another compliant client, and vice versa. Some implementations additionally scan `.claude/skills/` (project- and user-level) "for pragmatic compatibility, since many existing skills are installed there." This corroborates the per-harness placement table already in the queen-bee-stinger research (Cursor and Codex both fall back to `.claude/skills/`-style paths for cross-compat) and is the standards-level reason that convention exists.
