# ReadMe.com — Developer Hub Guide

## Profile

**Best for:** Developer-facing API documentation hubs where code, changelogs, and API references live alongside tutorials. Not a general customer-facing KB; recommend Help Scout or Document360 for non-developer end users.

**AI deflection:** AI Agent + vector search (May 2026 launch: Claude Opus 4.7 AI Agent).

**Versioning:** Git-backed version control. Each product version is a git branch. The `@readme/cli` syncs markdown changes from code repos to the ReadMe portal.

**Multi-language:** Partial; no native multi-locale routing.

**MCP server:** Yes (April 2026). Claude and Copilot can read documentation.

**Pricing:** Tiered. Metrics API is **Enterprise-only** (requires sales call).

Source: `research/external/2026-05-20-readme-com-2026-features.md`

---

## Key 2026 features

### `@readme/cli` — docs-as-code workflow

```bash
# Install
npm install -g @readme/cli

# Sync a directory of markdown files to a ReadMe project
rdme docs sync ./docs --key $README_API_KEY --version 2.0

# Sync an OpenAPI spec
rdme openapi ./openapi.yaml --key $README_API_KEY --version 2.0
```

The CLI enables a CI/CD pipeline for documentation: docs are authored in markdown in the git repo and pushed to ReadMe on every merge to main.

**GitHub AI Writer (May 2026):** ReadMe's GitHub integration can propose new documentation PRs when an OpenAPI spec changes, using AI to draft the initial article content.

### AI Agent (Claude Opus 4.7)

ReadMe's May 2026 AI Agent can:
- Answer developer questions by searching the portal's documentation and API reference.
- Generate code examples from the OpenAPI spec on demand.
- Surface changelog entries relevant to a developer's query.

### Metrics API (Enterprise caveat)

ReadMe's Metrics API tracks per-API-key usage, search queries, and article reads. **This feature is Enterprise-only and requires a sales call.** See `research/research-summary.md` OQ-4 (Document360) and Command Brief Q4.

**Implication:** For teams needing KB usage analytics (search success rate, content gaps), ReadMe Metrics is not self-serve. Use the CRAVA framework from `guides/05-analytics-loop.md` with a third-party analytics layer (Segment, Mixpanel, or Plausible events on the docs portal) until the team is on an Enterprise plan.

---

## When NOT to use ReadMe.com

- The primary audience is non-developer end users (use Help Scout Docs or Document360 instead).
- The team needs parallel-version KB branches for a non-API product (use Document360).
- Multi-language support is required for non-English markets (ReadMe's localization is partial).
- The team has no engineering resources to manage a docs-as-code git workflow (use Help Scout Docs or Intercom Articles).

---

## Setup steps

1. Create a ReadMe project at readme.com.
2. Connect a custom domain: Settings → Custom Domain.
3. Install `@readme/cli` and set up a GitHub Actions workflow to sync on PR merge.
4. Import OpenAPI spec: `rdme openapi ./openapi.yaml`.
5. Enable AI Agent: Settings → AI → Enable AI Agent (Claude Opus 4.7).
6. Add `llms.txt` to the custom domain root.
7. Configure the Metrics API (if on Enterprise plan): Settings → API Metrics.

---

*Sources: `research/external/2026-05-20-readme-com-2026-features.md`, `research/research-summary.md`.*
