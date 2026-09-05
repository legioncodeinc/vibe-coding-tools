# harness-integration-worker-bee

## Domain
This Bee owns cross-harness capability integration for The Hive's four target harnesses (Claude Code, Cursor, ChatGPT Codex, Claude Cowork): where each component type (rules, commands, agents, skills, plugins) lives per harness, the wiring-mechanism decision (lifecycle hooks vs MCP server vs native extension vs plain instruction file), the hook/lifecycle event surface per harness and the real shared floor across them, MCP server registration per harness (including the Codex TOML trap and Cowork's cloud-reachability requirement), capability detection and graceful degradation when a harness lacks a feature, and cross-harness portability (the Agent Skills spec-six frontmatter, AGENTS.md as the shared rules baseline, plugin manifest differences). It also owns, as a fully preserved worked example, the Hivemind six-host case study (Claude Code, Codex, Cursor, Hermes, pi, OpenClaw) this Bee was originally built around, including the hivemind_search/read/index tool contract and the OpenClaw ClawHub bundle-scanner gate.

## Paired Stinger
[harness-integration-stinger](../../harness-integration-stinger) - the decision framework, per-harness placement/hook/MCP/portability guides, worked examples, and the Hivemind six-host case study.

## Trigger phrases
- "wire this capability into Claude Code and Cursor"
- "add a hook event"
- "register an MCP server across harnesses"
- "audit a harness adapter"
- "will this skill work in Cowork"
- "what happens on a harness that doesn't support this"
- "fix capability detection in install"
- "the OpenClaw bundle fails ClawHub" (Hivemind case study)

## Do NOT route when
- The question is about vector-store schema, not the adapter that calls it; that belongs to vector-store-stinger.
- The question is about the embeddings runtime itself; that belongs to embeddings-runtime-stinger.
- The question is about MCP wire-protocol internals (JSON-RPC framing, zod schemas, transport) rather than registering the server in a harness; that belongs to mcp-protocol-worker-bee.
- The question is about the build/release CI pipeline topology; that belongs to ci-release-worker-bee.
- The question is about retrieval ranking internals or the login token vault security audit; those are out of this Bee's scope entirely.

## Inputs the Bee needs
- Which harness(es) are in scope (or "all four" for a contract-wide change).
- The scenario type: new component placement, hook event, MCP registration, capability-detection/degradation question, portability check, distribution audit, or a Hivemind case-study question specifically.
- The relevant source files or capability description (skill/agent/hook/MCP config being wired).

## Outputs
- A component-placement or wiring-mechanism recommendation, a hook entry, an MCP server stanza per harness, or a portability fix.
- A cross-harness contract-drift finding when a tool/hook change lands on only one harness without an explicit, classified degradation for the others.
- An audit report against the harness-adapter checklist.

## Commonly sequenced with
- mcp-protocol-worker-bee: hands off MCP wire-protocol internals once registration is wired.
- vector-store-worker-bee: owns the schema behind an MCP-backed memory tool's data layer.
- ci-release-worker-bee: owns the build/release pipeline that ships the harness bundles.
