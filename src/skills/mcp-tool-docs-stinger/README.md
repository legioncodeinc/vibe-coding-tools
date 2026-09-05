# mcp-tool-docs-stinger

The procedural arsenal for `mcp-tool-docs-worker-bee`, the Hive's tool, API, and CLI documentation specialist.

This stinger encodes how to document any tool, API, and CLI surface honestly: schema-selected tools (MCP tools first and foremost - name, purpose, input schema, output shape, side effects, annotations, examples), TypeScript public API reference generation (TypeDoc, and API Extractor where a reviewable contract is needed), CLI command references, doc-to-code sync, and changelog discipline tied to a released artifact's real version.

Hivemind (`@deeplake/hivemind`) remains fully covered as a worked example throughout - its MCP tools, OpenClaw goal/KPI contracts, TypeDoc setup, CLI surface, and `sync-versions`-driven changelog chain are documented in `examples/` and referenced from every guide. The guides themselves teach the general practice first.

**Research:** [`research/distilled-mcp-tool-docs.md`](research/distilled-mcp-tool-docs.md) - the current synthesis (2026-08-14), covering honest MCP tool docs (including tool annotations), TypeScript API reference generation beyond TypeDoc, CLI documentation conventions, doc-to-code sync tooling, and changelog automation. [`research/research-summary.md`](research/research-summary.md) is the original Hivemind-anchored pass (2026-06-16), still valid and reused.

Read `SKILL.md` first for the master index and the surface map. Then follow the guides in task order. Always read the real source before writing - these docs are honest about the code or they are wrong.
