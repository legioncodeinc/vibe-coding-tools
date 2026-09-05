---
source_url: https://docs.readme.com/main/changelog/may-launch
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: platform-readme
stinger: knowledge-base-help-center-stinger
---

# ReadMe.com May 2026 Launch: GitHub AI Writer, CLI, and MCP Auth

**Published:** May 8, 2026 | **Source:** ReadMe.com Official Changelog

## Summary

Major ReadMe.com product launch covering GitHub AI Writer for automated PR-based doc updates, `@readme/cli` for Git-backed docs with AI coding agent support, MDX editor upgrade, and expanded AI Agent capabilities (Claude Opus 4.7, GPT-5.5). Also includes the April 24, 2026 MCP server authentication release. Critical for `guides/09-readme-dev-hub.md` and the AI deflection section of the platform-selection matrix.

## Key quotations / statistics

**GitHub AI Writer (May 8, 2026):**
- "Watches pull requests, detects documentation that needs updating, and automatically drafts changes on a review branch in ReadMe - posting a summary comment with preview links directly on the PR."

**`@readme/cli` (May 8, 2026):**
- New CLI tool for Git-backed docs that lints documentation, syncs OpenAPI specs, previews locally, and sets up CI in a single command.
- "Explicitly designed to work inside AI coding agents like Claude Code and Codex."

**AI Agent (May 2026):**
- Supports Claude Opus 4.7 and GPT-5.5.
- Can modify project settings (theme, colors, navigation) via chat prompts.
- Can update Recipes pages, move pages between categories, create new categories on the fly.

**MCP Server Authentication (April 24, 2026):**
- Password/API key authentication added for the MCP server.
- Admins control who can connect external AI tools to their ReadMe project.
- Vector search added to the MCP `search-endpoints` tool for semantic matching against API definitions.

**ReadMe Metrics / Developer Dashboard:**
- Three pillars: Personalized Docs (API keys surfaced in docs), Logs in the Hub (real-time API call logs for self-serve debugging), "My Developers" (admin view tracking every API user).
- **Metrics API is Enterprise-only** (contact growth@readme.io for access).
- Covers API log history, page view counts, top search terms, and page quality votes.
- SDK integrations: Node.js, PHP (Laravel), Python (Django/Flask), Ruby (Rails/Rack), .NET.

## Annotations for stinger-forge

- ReadMe is fundamentally a **developer hub for API documentation**, not a general KB platform. The platform-selection decision tree in `guides/00-platform-selection.md` must flag this: choose ReadMe only if the primary KB use case is API/developer documentation. General customer support KB is a secondary use case for ReadMe.
- Answers Command Brief Q4 (What is the 2026 state of ReadMe Metrics?): Metrics API is Enterprise-only. The Developer Dashboard covers page views, top search terms, and API log history - powerful for developer-facing docs, less useful for general KB analytics.
- The GitHub AI Writer (PR-based doc updates) is the most sophisticated CI/CD for content of any platform in the comparison set. This is a key differentiator for teams with a strong GitHub workflow.
- The `@readme/cli` with explicit AI coding agent support signals that ReadMe is deliberately positioning itself as "docs as code" for teams using Cursor, Claude Code, and similar tools. This is relevant for the `guides/09-readme-dev-hub.md` audience profile.
- Vector search in MCP search-endpoints enables semantic API endpoint discovery - relevant for `guides/02-ai-deflection.md`'s treatment of ReadMe's AI deflection capabilities.
