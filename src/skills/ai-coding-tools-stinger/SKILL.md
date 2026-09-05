---
name: "ai-coding-tools-stinger"
description: "AI coding tool advisor for Cursor, Claude Code, Aider, Cline, Windsurf, Devin, and Bolt. Use when picking, comparing, or configuring an AI coding tool, or debugging one that misbehaves."
license: MIT
---

# AI Coding Tools Stinger

## When to use this skill

Covers the vibe-coder's AI coding tool landscape: Cursor, Claude Code, Aider, Cline, Windsurf/Cascade, Continue.dev, Replit Agent, Devin, and Bolt. Covers tool-tier classification, the selection rubric (autonomy, context, budget, language), SWE-bench benchmark data, model-routing patterns (including Aider's 3-5x cost-reducing architect/editor split), per-tool prompt and context discipline, and a documented footgun catalog.

Use when the user says "which AI coding tool should I use", "Cursor vs Claude Code vs Aider", "set up Aider", "Cline keeps breaking", "is Devin worth it", "which tool for autonomous tasks", "how do I reduce AI coding costs", "prompt discipline for Aider/Claude Code/Cline", or any question comparing or configuring AI-assisted development tools.

Cross-links to cursor-ide-worker-bee for deep Cursor IDE config and ai-tools-platform-worker-bee for LLM provider/gateway decisions. Do NOT use for Cursor IDE configuration (cursor-ide-worker-bee owns that), CI/CD pipelines that run agents (devops-worker-bee), or LLM provider gateway architecture beyond tool-specific routing (ai-tools-platform-worker-bee).

## Purpose

This Stinger equips `ai-coding-tools-worker-bee` to recommend, compare, configure, and debug AI coding tools across the 2026 ecosystem. Every factual claim in this skill traces to a file in `research/`: see `research/index.md` for the full source manifest.

The Stinger is organized around the six guides that mirror the Bee's ACTION list. Read the guide that matches the user's question. All guides reference each other and cite their research sources.

---

## Critical directives (non-negotiables)

- **Always cite the benchmark source and date.** SWE-bench scores change monthly. Every capability claim must include `(SWE-bench Verified, retrieved 2026-05-20)` or an equivalent dated citation. See `guides/02-benchmark-data.md`.

- **Windsurf is owned by Cognition AI, NOT OpenAI.** OpenAI announced a $3B acquisition in May 2025, Microsoft blocked it in July 2025, then Cognition AI (makers of Devin) acquired Windsurf for ~$250M in December 2025. All guides must reflect Cognition AI ownership. Source: `research/external/2026-05-20-windsurf-cursor-2026.md`.

- **Cross-link to `cursor-ide-worker-bee` for any Cursor IDE configuration request.** Deep Cursor config (rules, MCP servers, Cloud Agents, SDK) is out of scope for this Stinger.

- **Never recommend Devin or Replit Agent for production repos without flagging autonomy risks.** Fully-autonomous tools have write access and may make sweeping changes without user review. Surface the risk before opting in.

- **State the model-routing default explicitly.** Tool defaults change. Claude Code uses Claude (subscription or API). Aider supports 100+ models. Cursor routes to multiple providers. Windsurf uses its own Cascade model plus third-party routing. Verify before advising.

---

## When to use each guide

| User question | Guide |
|---------------|-------|
| "Which tier is this tool?" / "What's the difference?" | `guides/00-tool-tiers.md` |
| "Which tool fits my workflow?" | `guides/01-selection-rubric.md` |
| "What are the benchmark scores?" / "How good is X?" | `guides/02-benchmark-data.md` |
| "Which LLM should I use with Aider?" / "How does Cursor route?" | `guides/03-model-routing.md` |
| "How do I structure CLAUDE.md?" / ".aider.conf.yml setup" | `guides/04-prompt-and-context-discipline.md` |
| "Cline keeps failing" / "Aider auto-committed bad code" | `guides/05-footguns.md` |
| "Can I use Cursor AND Claude Code together?" | `guides/06-multi-tool-stacking.md` |

---

## Tool tier quick-reference (2026)

| Tier | Tools | Best for |
|------|-------|---------|
| Interactive-pair | Cursor (Tab + Composer), Continue.dev | Editor-integrated pair programming, in-flow completions |
| Hybrid-agent | Claude Code, Aider, Cline, Windsurf (Cascade) | Terminal/sidebar autonomous tasks with human in the loop |
| Fully-autonomous | Devin 2.0, Cursor Background Agents | Unattended long-running tasks; high autonomy tolerance required |
| Rapid-scaffold | Bolt.new, Replit Agent | Greenfield app generation from prompt; WebContainer or cloud IDE |

Cursor uniquely spans interactive-pair AND hybrid-agent (Agent Mode). See `guides/00-tool-tiers.md` for the full taxonomy.

---

## Overlap boundaries

- **`cursor-ide-worker-bee`**: owns Cursor IDE configuration depth: `.cursor/rules/` authoring, MCP server registration, Cloud Agents, Background Agents configuration, `@cursor/sdk` API. Cross-link there for anything beyond tool selection.
- **`ai-tools-platform-worker-bee`**: owns the LLM provider/gateway layer: Portkey, OpenRouter, Bedrock, Vertex AI, cost optimization across providers. This Stinger covers tool-specific model routing only (e.g., Aider's `--architect` flag, Claude Code's model lock-in).
- **`devops-worker-bee`**: owns CI/CD pipelines that invoke agents (GitHub Actions running Devin, cron jobs running Aider). This Stinger covers tool selection and configuration; not pipeline topology.

---

## Guides index

- `guides/00-tool-tiers.md`: Four-tier taxonomy with all 2026 tools mapped
- `guides/01-selection-rubric.md`: Decision matrix: autonomy, context, budget, language axes
- `guides/02-benchmark-data.md`: SWE-bench Verified and Aider polyglot scores (dated 2026-05-20)
- `guides/03-model-routing.md`: Default LLM per tool, override patterns, Aider architect/editor split
- `guides/04-prompt-and-context-discipline.md`: CLAUDE.md, `.aider.conf.yml`, Cursor rules, per-tool best practices
- `guides/05-footguns.md`: Cline reliability issues, Aider auto-commit, Devin scope creep, Bolt limits
- `guides/06-multi-tool-stacking.md`: Combining tools (e.g., Cursor for interactive + Claude Code for batch)

## Examples

- `examples/happy-path-selection.md`: Senior dev, TypeScript monorepo, hybrid workflow
- `examples/cost-constrained-workflow.md`: Solo founder, API budget constraint, Aider architect/editor

## Templates

- `templates/tool-recommendation.md`: Reusable output template for inline recommendations

## Reports

- `reports/README.md`: How past recommendation audits accumulate here

---

*Command Brief: `ai-tools/command-briefs/ai-coding-tools-worker-bee-command-brief.md`*
*Research: `research/research-summary.md` | Depth: normal | Retrieved: 2026-05-20*
