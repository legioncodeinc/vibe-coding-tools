---
source_url: https://fin.ai
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: ai-deflection
stinger: knowledge-base-help-center-stinger
---

# AI Deflection Patterns: Intercom Fin, RAG Over KB, and Platform-Native Chatbots (2026)

**Sources synthesized:** fin.ai (official), Docsie Portal Chat docs, Medium LangChain+Pinecone tutorial (Feb 2026), Intercom Help Center
**Retrieved:** 2026-05-20

## Summary

Covers the three major AI deflection patterns found in the research: (1) platform-native chatbots (Intercom Fin, Document360 Eddy AI), (2) portal chat embedding on a KB (Docsie Portal Chat pattern), and (3) custom RAG endpoint built on the KB content. This is the primary source for `guides/02-ai-deflection.md`. The research also surfaces Intercom's migration to the `fin.ai` domain as a separate product surface.

## Key quotations / statistics

**Intercom Fin (fin.ai, 2026):**
- Fin runs a standalone RAG engine over Intercom Articles (and external KB sources) to answer customer questions.
- **Standalone Fin plan**: teams can now subscribe to Fin without purchasing Intercom seats, enabling Fin to layer on top of any existing helpdesk.
- Resolution rate: up to 73% on grounded knowledge bases (vendor claim; 1% monthly improvement cited).
- Resolution pricing: $0.99/resolution.
- Fin supports 45 languages for customer conversations.
- Fin can now read custom KB articles, external URLs, and PDFs - not just Intercom Articles.

**Docsie Portal Chat (2026):**
- Embeds a chatbot directly inside a KB portal. Users query the KB conversationally without leaving the help center.
- Pattern: user opens portal → chatbot reads indexed KB articles → returns cited answer → fallback to article link if confidence below threshold.
- Deflection use case: prevents ticket creation for questions the KB already answers.

**Custom RAG over KB (LangChain + Pinecone, Feb 2026 tutorial):**
- Pattern: export KB articles → chunk (1,000 tokens, 200 overlap) → embed with OpenAI text-embedding-3-small → store in Pinecone/Qdrant → retrieve top-5 chunks → LLM (GPT-4o / Claude) generates answer with citations.
- React frontend displays cited sources from the KB with links back to original articles.
- This is the "standalone chat-with-your-docs endpoint" pattern referenced in the Command Brief.

**llms.txt (from research on the standard):**
- llms.txt is a plain-text file at the root of a domain (e.g., `/llms.txt`) that tells AI crawlers what content is available for indexing, what should be excluded, and how the content is structured.
- Google added llms.txt checks to Chrome Lighthouse (May 20, 2026) - the same day as this research.
- Adoption is growing: ~48% of top-50 SaaS documentation sites have added `/llms.txt` as of April 2026 (Presenc AI report).
- Relevance for KB: a help center with a well-formed `/llms.txt` is more likely to be accurately cited by AI assistants (ChatGPT, Perplexity, Claude) answering user questions - this is the "AI discoverability" layer above traditional SEO.

## Three AI deflection wiring patterns (for guides/02-ai-deflection.md)

| Pattern | When to use | Platforms | Hand-off to mind-worker-bee? |
|---|---|---|---|
| **Platform-native chatbot** | Team wants zero custom code, accepts platform's AI quality | Intercom Fin, Document360 Eddy AI | No - fully managed |
| **Portal Chat embedding** | Team has an existing KB, wants conversational search within it | Docsie, custom React on top of Help Scout/Zendesk API | Partial - mind-worker-bee configures retrieval if quality is poor |
| **Custom RAG endpoint** | Team needs custom AI quality, multi-KB sources, or brand voice control | Any KB with an export API | Yes - full hand-off to mind-worker-bee for RAG pipeline |

## Annotations for stinger-forge

- The Command Brief's critical directive "Never recommend a platform without checking its AI deflection maturity" maps to this matrix. Every platform in the comparison must be labeled with its deflection pattern tier and the level of custom code required.
- The standalone Fin plan changes the AI deflection decision tree: even teams not on Intercom can access Fin-quality deflection at $0.99/resolution. This must be in `guides/02-ai-deflection.md` as an option for teams using Help Scout or Zendesk Guide.
- llms.txt implementation should be recommended alongside any KB setup in `guides/02-ai-deflection.md`. It takes 30 minutes to implement and improves AI assistant citation accuracy - high ROI for low effort.
- For custom RAG: hand-off to `mind-worker-bee` with a specific brief: "KB export format, expected article count, chunking strategy preference (fixed-size vs semantic), and retrieval quality bar." Do not let this Angel design the embedding pipeline.
- 45-language Fin support feeds directly into `guides/04-multi-language.md`: for teams using Intercom, Fin handles multilingual deflection natively without the TMS complexity.
