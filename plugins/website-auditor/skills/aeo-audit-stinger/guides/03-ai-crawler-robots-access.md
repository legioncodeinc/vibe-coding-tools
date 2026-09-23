# 03. AI-crawler robots.txt access

Grounded in `references/research/distilled-aeo-audit.md` Section 3. Run `shared/scripts/aeo-technical.py robots-access --robots-url <site>/robots.txt` first.

## The six agents this Stinger tracks

| Engine | User-agent(s) | Source |
|---|---|---|
| ChatGPT (OpenAI) | `GPTBot` (also `ChatGPT-User`) | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] |
| Perplexity | `PerplexityBot` | same |
| Claude (Anthropic) | `ClaudeBot` | same |
| Gemini / Google Search | `Googlebot` (shared user-agent; blocking Googlebot blocks Gemini by default) | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] |
| Google AI features generally | `Google-Extended` | [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] |
| Cohere | `Cohere-AI` | both |

The script evaluates each agent against its own robots.txt group if one exists, falling back to the default `*` group otherwise, and checks specifically for a site-wide `Disallow: /`. Path-specific disallow rules are reported in the script's raw group data but not evaluated for "is this agent blocked from citing page X specifically" - that finer-grained read is a human judgment call if a path-specific rule is found, not an automated one.

## The GPTBot-blocked-but-CCBot-allowed trap

The script flags this combination automatically. Per this archive's specific guidance: most sites should allow all four major agents; blocking GPTBot while allowing CCBot (Common Crawl) lets ChatGPT train on the content via Common Crawl's dataset while blocking it from citing that content in answers - described as "the worst of both worlds" when that split was not the deliberate intent. A wildcard `Allow: /` works, but naming each agent explicitly in robots.txt (and mirroring the same intent in llms.txt) gives finer control over crawl depth and frequency. Receipts cited by this source: OpenAI's GPTBot documentation (updated March 2026), Perplexity's webmaster guidelines (January 2026), Anthropic's ClaudeBot spec (April 2026) - these are the source's own cited receipts, not independently re-verified by this Stinger. [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

## Confirm intent before scoring

A site blocking all six agents may be making a deliberate, legitimate business decision (e.g. protecting paywalled or licensed content from AI training/citation entirely), not committing an error. Check `00-intake/` and any customer notes for a stated AI-content policy before treating a full block as a Critical finding; if no stated policy exists, flag it as Review severity ("full AI-crawler block detected; confirm this matches customer intent") rather than an automatic Critical.

## Ranki.io's independent framing

Ranki.io lists "AI-bot robots.txt access for GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, Cohere-AI" as its 5th of 15 signals, immediately below llms.txt, both in its crawl tier. [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md]
