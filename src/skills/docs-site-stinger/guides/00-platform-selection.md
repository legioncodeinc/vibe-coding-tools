# Platform Selection: Scored Decision Tree

Use this guide any time the platform is undecided. Score each candidate against the six dimensions below, then read the result.

> Source: `research/internal/2026-05-20-platform-comparison-matrix.md` and individual platform research files.

---

## Step 1: Filter out unsuitable platforms immediately

Run these hard filters first. If a platform fails a filter, remove it from the candidate list before scoring.

| Filter | If YES, eliminate |
|---|---|
| Team is starting a new project AND was considering MkDocs Material | **Eliminate MkDocs Material**: maintenance mode since Nov 2025; no new features. See `research/external/2026-05-20-mkdocs-material-maintenance-mode.md`. Only keep it if the team is already invested and cannot migrate. |
| Budget is $0 with no vendor lock-in | Eliminate GitBook (per-site pricing: $65-$249/month) and Mintlify Pro/Enterprise ($300-$600+/month) |
| Team needs full self-hosting and white-labeling under $300/month | Eliminate Mintlify (white-label requires Enterprise $600+) |
| Docs are exclusively API reference + SDK generation | Add Fern to top of the list; it is purpose-built for this |

---

## Step 2: Score the surviving candidates (1-5 per dimension)

Score each platform on the six dimensions relevant to the team's context. Higher score = better fit.

| Dimension | Starlight (Astro) | Docusaurus | Mintlify | Nextra v4 | GitBook | Fern |
|---|---|---|---|---|---|---|
| **Content type: API ref + guides + tutorials** | 4 | 5 | 5 | 4 | 3 | 5 |
| **Hosting: managed, zero-ops** | 2 (self-hosted default) | 2 | 5 | 2 | 5 | 4 |
| **Customization depth** | 5 (Astro components) | 4 (React/MDX) | 3 (MDX + themes) | 4 (Next.js) | 2 | 3 |
| **Search quality out-of-box** | 4 (pagefind built-in) | 3 (needs DocSearch) | 5 (built-in AI search) | 4 (pagefind) | 4 (built-in) | 4 |
| **Team's primary language fit** | JS/TS | JS/TS | Any | JS/TS (Next.js) | Any | Any (YAML/OAS) |
| **Cost at scale (100K+ page views)** | $0 (self-hosted) | $0 | $300-$600+/month | $0 | $65-$249/month | Contact sales |
| **2026 platform health** | 5 (active, v0.38+) | 4 (v4 incoming) | 4 (headless mode added) | 4 (v4 active) | 4 (active) | 4 (active) |

---

## Step 3: Apply context weights

Weight each dimension by the team's priorities. Typical profiles:

### Profile A: Open-source library or developer tool
**Top weights:** Cost (free), Customization, Platform health
**Recommendation:** **Starlight (Astro)**: 200K+ weekly downloads, Astro v6, zero cost, strong customization. Docusaurus v3.10 if the team needs React component integration or versioning is complex.
Source: `research/external/2026-05-20-starlight-astro-v6-stable.md`

### Profile B: SaaS product with API docs, fast time-to-ship
**Top weights:** Managed hosting, Search quality, API reference integration
**Recommendation:** **Mintlify**: fastest path from zero to polished docs. Name the cost upfront ($300/month Pro; white-label requires Enterprise at $600+). Consider Fern if SDK generation is also needed.
Source: `research/external/2026-05-20-mintlify-pricing-2026.md`

### Profile C: Enterprise, versioned docs with deep React integration
**Top weights:** Customization, Versioning, MDX component authoring
**Recommendation:** **Docusaurus v3.10** (with v4 flags enabled). Start v4-ready: `future.experimental_faster: true` and `future.v4.*` flags in `docusaurus.config.ts`.
Source: `research/external/2026-05-20-docusaurus-v3-react19-v4-roadmap.md`

### Profile D: Non-technical authors, mixed audience (internal + external)
**Top weights:** Managed hosting, Editor UX, No-code authoring
**Recommendation:** **GitBook**: block editor differentiator; $65-$249/month per site. Not suitable for code-heavy API reference.
Source: `research/external/2026-05-20-gitbook-pricing-2026.md`

### Profile E: Next.js monorepo, docs alongside application code
**Top weights:** Next.js integration, Monorepo support
**Recommendation:** **Nextra v4**: App Router-based, built-in pagefind search, stays in the Next.js ecosystem.
Source: `research/external/2026-05-20-nextra-v4-next-js.md`

### Profile F: API portal + automatic SDK generation + MCP server
**Top weights:** OpenAPI integration, SDK generation, AI tooling
**Recommendation:** **Fern**: purpose-built for API-first docs, auto-generates MCP server and `llms.txt` from OpenAPI spec in 2026. Pricing: contact sales (not public).
Source: `research/external/2026-05-20-fern-api-docs-sdk-generation.md`

---

## Step 4: State the recommendation with the trade-off

Always end the platform selection output with:

1. The recommended platform.
2. The one-line concrete reason ("because your team is open-source, zero budget, and needs deep customization").
3. The one named trade-off ("the trade-off is v0.x semver: breaking changes per minor release; pin your Astro and Starlight versions").
4. A fallback ("if X becomes a blocker, Docusaurus is the alternative").

---

## Open question for stinger-forge (from research)

> TODO: open question: Algolia DocSearch qualification criteria for 2026 not confirmed. Before recommending DocSearch in `guides/03-search.md`, verify current eligibility at https://docsearch.algolia.com/. The research at `research/external/2026-05-20-pagefind-self-hosted-search.md` covers pagefind as the alternative.
