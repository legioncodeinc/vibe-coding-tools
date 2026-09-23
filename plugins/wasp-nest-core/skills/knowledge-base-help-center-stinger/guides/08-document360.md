# Document360 — Platform Guide

## Profile

**Best for:** Enterprise SaaS with complex KB needs: parallel version branches, 50+ language auto-translation, MCP server integration, and the most sophisticated AI citation analytics in 2026.

**AI deflection:** Eddy AI (Business+ tier). Citation analytics tracks which articles appear in each AI response.

**Versioning:** Full branch versioning — multiple product versions (e.g., v2.x and v3.x) can coexist as active branches.

**Multi-language:** 50+ language auto-translate on Business+ tier. RTL support (Arabic, Hebrew, etc.).

**MCP server:** Launched in v12.3.1 (March 2026). Claude, ChatGPT, and Copilot can read and write KB articles via MCP protocol.

**Pricing:** Quote-based since August 2024. No self-serve pricing. Request a quote before building on Document360.

Sources: `research/external/2026-05-20-document360-2026-features.md`, `research/external/2026-05-20-document360-mcp-release-notes.md`

---

## Key 2026 features

### MCP server integration (v12.3.1, March 2026)

Document360 launched an MCP server that allows AI coding assistants and agents to interact with the KB directly:
- Claude / ChatGPT / Copilot can **read** KB articles and suggest relevant ones to users.
- Agents can **create and update** articles via MCP tools (requires write-enabled API key).
- Use cases: auto-generate release notes as new articles, sync OpenAPI changes to the KB, have Cursor propose KB updates when product code changes.

**MCP server URL format:** `https://api.document360.io/v2/mcp/` (verify current endpoint at Document360 API docs).

### Branch versioning

Create product-version-aligned branches:
1. Document360 Portal → Versions → Create Version.
2. Name the branch (e.g., "v3.0", "v2-maintenance").
3. Clone articles from the main branch as a starting point.
4. Mark articles as applicable to specific version ranges using the "Version" tag.

**End-user experience:** Users see a version selector in the portal navigation. The selected version persists across navigation.

### Eddy AI citation analytics

Every Eddy AI answer logs which articles were cited. Analytics surface:
- Articles cited frequently but rated poorly → rewrite priority.
- Topics with no cited articles despite high search volume → content gap.
- Citations per article per week → measures AI deflection contribution per article.

---

## Setup steps

1. **Request a quote** (mandatory — no self-serve signup): document360.com/pricing → Contact Sales.
2. **Create a project** in the Document360 portal.
3. **Set up categories** before importing articles — categories cannot be reorganized cheaply after import.
4. **Configure portal authentication** (public, SSO, or JWT for private portals).
5. **Enable Eddy AI** (Business+ tier): Settings → AI Features → Eddy AI → Enable Search Suite.
6. **Enable auto-translate** (Business+ tier): Settings → Localization → Enable Auto-Translate → Select target languages.
7. **Enable MCP server** (verify availability on your tier): Settings → Integrations → MCP Server.
8. **Add `llms.txt`** to the custom domain root (Document360 supports custom domain hosting).

---

## Pricing caveat

Document360 moved to fully quote-based pricing in August 2024. No public price points are available. **Always request a quote before recommending Document360 to a user** — the pricing barrier may eliminate it from consideration for teams requiring self-serve evaluation. See `research/research-summary.md` OQ-4.

---

*Sources: `research/external/2026-05-20-document360-2026-features.md`, `research/external/2026-05-20-document360-mcp-release-notes.md`.*
