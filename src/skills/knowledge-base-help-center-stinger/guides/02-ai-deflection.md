# AI Deflection — Knowledge Base Help Center

## The three deflection patterns (2026)

Sources: `research/external/2026-05-20-ai-deflection-patterns.md`

---

### Pattern A: Platform-native chatbot

**What it is:** The KB platform's own AI chat widget reads the KB articles directly and answers user questions in a chat UI.

**When to use:** The team wants the simplest possible setup. The KB platform already includes an AI chat feature. No custom engineering budget.

**Examples:**
- Intercom Articles + Fin (hosted by Intercom; reads Articles + external URLs)
- Document360 + Eddy AI Search Suite (hosted by Document360; reads all articles in the workspace)
- Zendesk Guide + Answer Bot

**Limitations:**
- Feature parity tied to the platform's AI roadmap.
- Less control over retrieval quality (chunking, re-ranking).
- Intercom Fin requires the user to configure knowledge sources explicitly.

**llms.txt step (required Day 1):** Add `/llms.txt` and `/llms-full.txt` to the KB domain so AI assistants outside the platform (ChatGPT, Claude, Perplexity) can also discover the KB. See below.

---

### Pattern B: Portal chat embedding

**What it is:** A standalone AI chat product is embedded as a widget in the KB's help portal. The AI reads a curated article export, PDF uploads, or URL crawl.

**When to use:** The team wants AI deflection but does not want to be locked into the KB platform's AI tier. Intercom Fin's standalone plan ($0.99/resolution, no Intercom subscription required) is the 2026 reference implementation.

**Setup steps (Intercom Fin standalone):**
1. Create an Intercom Fin standalone workspace.
2. Upload the KB article export as PDF or connect via URL crawl.
3. Embed the Fin Messenger widget on the KB help portal.
4. Configure the "no AI answer" fallback to a support form.

**Limitations:**
- Requires a separate vendor relationship.
- Content freshness depends on re-ingestion cadence (set a weekly re-crawl job).
- The AI widget is visually separate from the KB search — two UI surfaces.

---

### Pattern C: Custom RAG endpoint

**What it is:** The team builds a custom "chat-with-your-docs" endpoint: article export → chunking → embedding → vector store → retrieval-augmented generation. The chat UI is a custom component.

**When to use:**
- Maximum control over retrieval quality and latency.
- The team has engineering resources to operate a vector pipeline.
- The platform's native AI is inadequate or unavailable.

**Architecture boundary:** This pattern requires `mind-worker-bee` for implementation. `knowledge-base-help-center-worker-bee` specifies the KB export format and chunking strategy inputs; `mind-worker-bee` implements the embedding model, vector store (Qdrant), re-ranking (Cohere rerank-v3.5), and retrieval API.

**Hand-off protocol to `mind-worker-bee`:**
> "We have exported [platform] articles in [format: HTML/markdown/JSON]. The corpus has [N] articles, average [X] words each. We want a retrieval endpoint that returns the top-3 relevant article chunks for a user query, with article title and URL as metadata. Wire Qdrant + Cohere rerank-v3.5. Generate synthetic Q&A pairs for evaluation."

---

## llms.txt — Day 1 implementation

Source: `research/external/2026-05-20-llmstxt-standard.md`

Google Lighthouse now validates `llms.txt` as of May 20, 2026. Add it to every KB setup.

**File format:**

```
# [Company Name] Help Center

> [One-sentence description of the product and KB purpose]

## Documentation

- [Section title]: [URL to section index or main article]
- [Section title]: [URL]

## Support

- Contact support: [support URL]
```

**llms-full.txt:** A more detailed variant that lists every article URL with a one-line description. Generate from the KB's sitemap export.

**Placement:** Serve from the KB domain root, e.g., `help.yourcompany.com/llms.txt`.

**Why it matters:** AI assistants (ChatGPT, Claude, Perplexity) crawl `llms.txt` to discover documentation. Without it, AI answers about your product will miss your KB entirely.

---

## Deflection pattern selection guide

| Scenario | Pattern |
|---|---|
| No engineering budget, platform has native AI | A: Platform-native |
| Engineering budget limited, want AI deflection now, KB on any platform | B: Portal embedding (Fin standalone) |
| Team already uses Intercom and Fin | A: Platform-native (Fin on Intercom Articles) |
| Enterprise KB on Document360, want agent-integration | A: Eddy AI + MCP server |
| Custom product UI, maximum retrieval control | C: Custom RAG → hand off to `mind-worker-bee` |

---

*Sources: `research/external/2026-05-20-ai-deflection-patterns.md`, `research/external/2026-05-20-llmstxt-standard.md`, `research/external/2026-05-20-document360-mcp-release-notes.md`.*
