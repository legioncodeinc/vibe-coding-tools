# Guide 00: The Decision Framework for Cross-Harness Integration

**Sources:** `research/distilled-harness-integration.md` §1, §5; queen-bee-stinger distilled-research-articles.md (all four harness sections)

---

## What "integration" means here

The Hive ships capabilities (a skill, an agent, a hook-driven behavior, an MCP-backed tool) across four harnesses: **Claude Code, Cursor, ChatGPT Codex, Claude Cowork**. Each harness has its own component model, its own file formats, and its own feature ceiling. Integrating a capability means deciding, per harness:

1. Which component type carries it (rule, command, agent, skill, plugin)?
2. Which wiring mechanism delivers its behavior (hooks, MCP, native extension, or a plain instruction file)?
3. What happens on a harness that can't fully support it - degrade, translate, or drop?

This stinger's job is answering those three questions correctly, not building any one product's installer. See `guides/06-distribution-and-audit.md` → the Hivemind case study for what a full, worked six-host answer looked like for one real product.

---

## The four harnesses, one paragraph each

- **Claude Code**: the richest component model of the four - full subagents, the most hook events (26), skills as the modern primary extension mechanism, a mature plugin/marketplace system. Treat it as the reference implementation when a feature exists nowhere else to compare against.
- **Cursor**: rules (`.mdc` + `AGENTS.md`), subagents, skills, and plugins all landed within the same few months (2.4-2.5, Jan-Feb 2026) and explicitly fall back to reading Claude Code's and Codex's native directories (`.claude/agents/`, `.codex/agents/`, `.claude/skills/`, `.codex/skills/`) for cross-compat - the friendliest harness for a capability that already exists elsewhere.
- **ChatGPT Codex**: `AGENTS.md`-first, TOML-configured, deliberately narrower hook surface (5 events vs. Claude Code's 26), commands deprecated in favor of skills, MCP config lives in `config.toml` under `mcp_servers` (TOML, not JSON - the single most common copy-paste failure across harnesses).
- **Claude Cowork**: no CLI, no user-facing `.claude/agents/`, rules are UI-set Global/Folder instructions rather than committed files, skills sync from a claude.ai account rather than reading local disk, plugins share Claude Code's package format. The most constrained of the four for anything that isn't a skill or a plugin-shipped component.

---

## The wiring-mechanism decision matrix

Answer this per harness, per capability. It generalizes the old single-product matrix into the four questions that actually decide the mechanism:

```
Does the capability need to run code on a lifecycle event (session start, before/after
a tool call, turn end)?
  YES → Use hooks, if the harness has them. See guides/02-hook-lifecycle.md for what
         each harness actually fires - the shared floor across all four is much
         smaller than Claude Code's own 26-event surface.
   NO  ↓

Does the capability need to call out to an external service or expose tools with a
stable schema?
  YES → Register an MCP server, if the harness speaks MCP as a host. See
         guides/03-mcp-registration.md - registration syntax differs per harness
         (JSON vs. TOML) even though the protocol underneath is identical.
   NO  ↓

Does the capability need a dedicated UI surface (panel, status bar, custom commands)
that only a native extension can provide?
  YES → Ship a native extension for the harnesses that support one (chiefly Cursor's
         VS Code/Cursor extension surface). This is the least portable option - budget
         for a harness-specific build per target, not a shared bundle.
   NO  ↓

Default: ship it as a skill (or, for shared baseline instructions, a rules file). This
is the most portable path across all four harnesses - see
guides/05-portability-and-contracts.md for the spec-six frontmatter that keeps a skill
loading correctly everywhere.
```

Most real capabilities combine mechanisms - e.g., a skill that documents a tool surface an MCP server also exposes, or a hook that captures activity and a skill that explains when to invoke recall. Decide per mechanism, not once for the whole capability.

---

## How the rest of this stinger is organized

| Guide | Answers |
|---|---|
| `guides/01-component-placement.md` | Where does each component type live, per harness? |
| `guides/02-hook-lifecycle.md` | What lifecycle events actually exist, per harness, and what's the shared floor? |
| `guides/03-mcp-registration.md` | How do you register an MCP server, per harness, and what does capability negotiation mean for it? |
| `guides/04-capability-detection-and-degradation.md` | How do you detect what a harness supports, and what do you do when it doesn't? |
| `guides/05-portability-and-contracts.md` | What frontmatter/format keeps a skill, rule, or tool contract portable across all four? |
| `guides/06-distribution-and-audit.md` | How does a capability actually ship (marketplace, bundle, install flow) per harness, and what's the worked six-host example? |

The Hivemind six-host installer (the product this stinger originally documented) is preserved as a full worked example under `examples/case-study-hivemind-six-host-installer.md` and the three existing per-scenario examples (`examples/wire-a-new-harness.md`, `examples/add-a-hook-event.md`, `examples/register-mcp-in-hermes.md`). Read the general guides first; the case study shows every decision point above answered concretely for one real, shipped integration across six hosts (four of which map onto today's Hive harnesses, plus Hermes and pi as historical context).

---

## Critical directives that apply regardless of harness

See the `## Critical directives` section of `SKILL.md` - those are the non-negotiables for any integration built with this stinger. This guide sets up the vocabulary; the critical directives are what gets flagged in a review.
