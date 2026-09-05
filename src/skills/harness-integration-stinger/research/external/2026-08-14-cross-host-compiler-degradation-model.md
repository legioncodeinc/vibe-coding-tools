# Pluxx / OIAP - preserve/translate/degrade/drop: a decision model for cross-host capability mapping
- URL: https://github.com/orchidautomation/pluxx/blob/main/docs/core-four-primitive-implementation-plan.md and https://github.com/fboldo/oiap
- Fetched: 2026-08-14
- Source type: open-source projects (community, cross-host plugin compilers)
- Component: capability detection and graceful degradation, cross-harness portability decision-making (Claude Code, Cursor, Codex, OpenCode)

## The four-outcome classification (Pluxx)

Pluxx is "a real cross-host compiler" that imports a plugin authored strongly for one host (Claude Code, Cursor, Codex, or OpenCode) into a canonical intermediate model, then compiles it back out to native form for every other host. Its core design principle: "host-specific degradation is explicit and intentional." Every mapped feature is classified into exactly one of four outcomes:

| Outcome | Meaning |
|---|---|
| `preserve` | The target host has a close native equivalent - no loss |
| `translate` | The host has a *different* native surface that can express the same intent |
| `degrade` | The host cannot express the full intent, but the workflow's user-facing meaning can be preserved in a weaker form |
| `drop` | Unsupported, and not worth emulating yet |

The project frames the seven-bucket capability surface it tracks per host as: `instructions`, `skills`, `commands`, `agents`, `hooks`, `permissions`, `runtime`, `distribution` - a broader and more general list than the harness-integration-stinger's Hivemind-era five-surface breakdown (tool contract, hook lifecycle, capability detection, extension adapters, MCP), and one that maps cleanly onto "per-harness component placement" work generally, not just one product's memory-capture use case.

## Concrete per-bucket mapping examples (worked, cross-checked against queen-bee-stinger research)

- `instructions` → Claude: `CLAUDE.md`; Cursor: `rules/` + `AGENTS.md` support; Codex: `AGENTS.md`; OpenCode: config-driven instructions. This matches the "AGENTS.md as shared baseline, CLAUDE.md as the Claude-specific superset" framing already established from the agents.md and Claude Code memory research.
- `commands` → compile natively for Claude, Cursor, OpenCode; **degrade into skills plus instruction routing for Codex** - a concrete, named `degrade` case (Codex deprecated its custom-prompts/commands surface in favor of skills, per the queen-bee-stinger Codex research, so a commands-shaped capability has no native Codex target and must be re-expressed as a skill).
- `agents` → Claude: plugin agents; Cursor: agents or subagents; Codex: `.codex/agents/*.toml`; OpenCode: agents config or markdown agents.
- `hooks` → "compile host-specific event vocabularies; keep unsupported events visible as linted degradations" - the same shape as Hookbridge's loss-report, expressed as a lint rule instead of a generated report file.
- `permissions` → "preserve allow/ask/deny canonically; translate to host-native control planes" - i.e. the permission *decision* (allow/ask/deny) is the portable unit; the mechanism enforcing it (Claude Code's `permissions.allow/deny` rules, Cursor's approval settings, Codex's `approval_policy`/`sandbox_mode`) is host-specific and gets translated, never assumed identical.

## Why explicit degradation beats silent approximation

Pluxx's stated acceptance criteria for its own migration tooling: "authors can see exactly why a feature preserved, translated, degraded, or dropped... warnings become actionable rather than noisy." The project explicitly rejects "preserving raw host syntax" as a portability strategy - importing a Cursor subagent file and re-emitting it byte-for-byte on Codex isn't portability, it's a broken file. The correct move is importing *intent* (a canonical representation of what the feature is trying to do) and re-compiling that intent into whatever native surface the target host actually offers, accepting a documented `degrade` or `drop` when no equivalent exists.

## OIAP's complementary framing (same problem, shipped SDK)

OIAP ("Open Interoperable Agent Plugins") is a TypeScript SDK implementing the same idea for author-facing tooling rather than migration: "write your AI agent plugin in TypeScript once" and export to host-native bundles for Claude Code, Codex, Cursor, Cline, OpenClaw, and others via per-host exporters. Each exporter run produces "compatibility reports that describe which capabilities mapped cleanly, degraded, or were unsupported for a target" - the same preserve/degrade/unsupported vocabulary, generated automatically rather than hand-audited. OIAP frames itself as "complementary to specification efforts such as the Open Plugin Spec... not a competing standards body; it is practical authoring and bundling infrastructure for developers who need to ship across several agent harnesses" - the same posture the Hive's own harness-integration surface should take: use the open standards (Agent Skills, AGENTS.md, MCP) as the substrate, and be explicit and honest about the parts that don't carry over.
