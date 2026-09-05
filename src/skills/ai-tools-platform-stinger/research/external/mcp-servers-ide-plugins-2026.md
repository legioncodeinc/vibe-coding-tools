# Source: MCP Servers and IDE Plugins (2026)

**Source type:** MCP registry + Cursor documentation + community
**Authority:** High
**Date fetched:** 2026-05-20
**URLs:** github.com/modelcontextprotocol/servers, cursor.com/docs, modelcontextprotocol.io

## Key findings

### MCP Protocol (2026)

- MCP (Model Context Protocol) is now the standard protocol for AI agent tool access; adopted by Cursor, Claude Desktop, VS Code Copilot, Zed.
- Protocol provides: Resources (file-like data), Tools (function calls), Prompts (templated interactions).
- Transport: stdio (local process) or HTTP/SSE (remote servers).
- Cursor implements MCP as local stdio servers configured in `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project).
- Each MCP server is a separate process; ~15 servers is a practical upper limit before performance degrades.

### Most-used official MCP servers (2026)

- **@modelcontextprotocol/server-filesystem**: read/write/list/search files; foundation for any agentic file workflow.
- **@modelcontextprotocol/server-github**: create/read PRs, issues, branches, commits via GitHub API.
- **@supabase/mcp-server-supabase**: database operations, table queries, schema inspection.
- **@upstash/context7-mcp**: fetch live documentation for 1000+ libraries by name.
- **exa-mcp-server**: semantic web search; extract page content; research tasks.
- **mcp-server-firecrawl**: advanced web scraping; multi-page crawl; structured extraction.
- **mcp-server-posthog**: analytics queries; feature flag management; error tracking.
- **@stripe/mcp-server**: payments, subscriptions, customers, webhooks.
- **mcp-server-sentry**: error tracking, stack traces, issue management.

### Cursor-specific behavior

- Global MCP config: `~/.cursor/mcp.json` applies to all projects.
- Project MCP config: `.cursor/mcp.json` overrides or extends global for the project.
- MCP servers start on Cursor launch; visible in "Tools" section of agent mode.
- Best practice: minimal global config (filesystem, github, context7); project-specific servers in per-project config.

### IDE extensions most valued by vibe coders (2026)

- **GitLens**: git history, blame, PR context; reduces context switching to GitHub web UI.
- **Error Lens**: inline errors without hovering; speeds up bug identification.
- **Pretty TypeScript Errors**: readable TS error messages; Cursor's built-in TS display is verbose.
- **Continue**: open-source AI coding assistant; best Ollama integration for VS Code/Cursor.
- **Tailwind CSS IntelliSense**: class autocomplete and hover docs; essential for Tailwind projects.

## Synthesis for stinger

- The MCP ecosystem reached critical mass in 2025-2026; context7, supabase, github, and filesystem form the near-universal starter pack.
- Project-level MCP config (`.cursor/mcp.json`) is the right pattern for project-specific servers; avoids global config bloat.
- Limit active MCP servers to < 15 for performance; activate specialist servers per-project.
- Continue.dev is the best bridge for teams that want Ollama in Cursor without native model config.
- The Portkey MCP server (if available) could unify AI tooling management, worth monitoring.
