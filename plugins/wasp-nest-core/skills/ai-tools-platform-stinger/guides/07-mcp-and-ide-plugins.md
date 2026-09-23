# MCP Servers and IDE Plugins: The 2026 Vibe Coder Toolbox

## What MCP servers are

Model Context Protocol (MCP) servers are local services that give AI agents structured access to external tools and data sources: file systems, databases, APIs, web browsing, code execution. In Cursor, Claude Desktop, and compatible agents, MCP servers appear as tool-use capabilities the AI can invoke during a session.

A good MCP stack turns your AI agent from a code suggester into a genuine agentic developer: it can read your database, push to GitHub, check PostHog events, scrape documentation, and search the web, all without copy-paste.

## Must-have MCP servers (2026)

### Tier 1: Near-universal (install for every project)

| Server | What it gives you | Install |
|---|---|---|
| **Filesystem** | Read/write/list files; search by pattern | `npx @modelcontextprotocol/server-filesystem` |
| **GitHub** | Read/create PRs, issues, branches, commits | `npx @modelcontextprotocol/server-github` |
| **Supabase** | Query tables, run SQL, list schema | `npx @supabase/mcp-server-supabase` |
| **Context7** | Fetch official library documentation | `npx @upstash/context7-mcp` |

### Tier 2: Add based on your stack

| Server | What it gives you | When to install |
|---|---|---|
| **Exa** | Semantic web search; fetch page content | Research tasks; keeping up with docs |
| **Firecrawl** | Crawl websites; extract structured content | Scraping; competitor analysis; doc ingestion |
| **PostHog** | Query analytics; inspect feature flags; read events | Any project with PostHog analytics |
| **Sentry** | Fetch errors; read stack traces | Any project with Sentry error tracking |
| **Stripe** | Read payments, subscriptions, customers | Any project with Stripe |
| **Perplexity** | AI-powered web search with citations | When Exa's results need augmentation |
| **Browser (Playwright)** | Navigate, screenshot, interact with web UIs | Frontend testing; form automation |
| **Prisma** | Introspect schema; run migrations; query | Any project using Prisma ORM |
| **Vercel** | List deployments; view build logs; manage env vars | Projects deployed to Vercel |
| **Cloudflare** | Workers, KV, D1, R2, observability | Cloudflare-hosted projects |
| **Slack** | Read channels; post messages; search history | Team projects with Slack |
| **Resend** | Send emails; check delivery; manage templates | Projects using Resend for email |

### Tier 3: Specialist

| Server | What it gives you | When to install |
|---|---|---|
| **DBHub** | Query any PostgreSQL/MySQL/SQLite database | Multi-database environments |
| **Replicate** | Run image/video/audio models | Creative projects |
| **Higgsfield** | Generate and animate images/video | Visual content creation |
| **ClickUp** | Read tasks; update status; create issues | ClickUp project management |
| **AWS Serverless** | SAM templates; Lambda deployment; ESM setup | AWS serverless projects |
| **Mixpanel** | Query events; investigate metrics; build dashboards | Mixpanel analytics users |

## Cursor MCP configuration

MCP servers are configured in Cursor Settings → MCP. Configuration lives in `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<your-token>"
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase", "--access-token", "<your-token>"]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "exa": {
      "command": "npx",
      "args": ["-y", "exa-mcp-server"],
      "env": {
        "EXA_API_KEY": "<your-key>"
      }
    }
  }
}
```

**Performance note:** Each MCP server is a separate process. Running 15+ simultaneously degrades Cursor's responsiveness. Keep Tier 1 always-on; activate Tier 2/3 servers per-project in `.cursor/mcp.json` (project-level config).

## Project-level MCP config (`.cursor/mcp.json`)

Override or extend the global config per project:

```json
{
  "mcpServers": {
    "posthog": {
      "command": "uvx",
      "args": ["mcp-server-posthog"],
      "env": {
        "POSTHOG_API_KEY": "<project-key>",
        "POSTHOG_PROJECT_ID": "<project-id>"
      }
    },
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp-server"],
      "env": {
        "STRIPE_SECRET_KEY": "<sk_test_...>"
      }
    }
  }
}
```

## IDE plugins and extensions

### Cursor-native (built-in, no install needed)

- **Cursor Composer / Agent mode**: multi-file editing with tool use; core of the vibe coding workflow.
- **Cursor Tab**: inline completion; best-in-class for code suggestion.
- **Cursor Chat**: codebase-aware Q&A; `@file` references.

### Recommended extensions (VS Code / Cursor extension marketplace)

| Extension | Purpose | Priority |
|---|---|---|
| **Continue** | Open-source AI coding with local/remote models; Ollama integration | High (local LLM users) |
| **Codeium** | Fast inline completion; free tier | Alternative to Cursor Tab |
| **GitHub Copilot** | If your team has an enterprise license | Alternative to Cursor |
| **GitLens** | Git history visualization; blame; PR context in editor | High |
| **Error Lens** | Inline error display without hovering | High |
| **Pretty TypeScript Errors** | Readable TypeScript error messages | High for TS projects |
| **REST Client** | Send HTTP requests from `.http` files | Medium |
| **Thunder Client** | Postman-like GUI in VS Code | Alternative to REST Client |
| **Database Client** | GUI for PostgreSQL, MySQL, SQLite in editor | Medium |
| **Tailwind CSS IntelliSense** | Class autocomplete and hover docs | High for Tailwind projects |

## Minimal starter pack for a new project

For a new vibe-coding project, this MCP + extension stack covers 90% of needs:

**MCP servers (global):**
```
filesystem, github, context7
```

**MCP servers (project-level):**
```
supabase (or prisma if using Prisma), posthog (if instrumented), stripe (if payments)
```

**Cursor extensions:**
```
gitlens, error-lens, pretty-typescript-errors
+ tailwind-css-intellisense (if Tailwind)
```

This setup takes under 20 minutes to configure and dramatically expands what the AI agent can do without manual copy-paste.
