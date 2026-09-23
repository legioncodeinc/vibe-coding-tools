# AI-crawler robots.txt access checklist

Grounded in `references/research/distilled-aeo-audit.md` Section 3. Run `shared/scripts/aeo-technical.py robots-access` first for the mechanical per-agent evaluation.

```markdown
## AI-crawler access - <domain>

| Engine | User-agent(s) checked | Access state | Evidence | Source |
|---|---|---|---|---|
| ChatGPT (OpenAI) | GPTBot, ChatGPT-User | | script output | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] |
| Perplexity | PerplexityBot | | script output | same |
| Claude (Anthropic) | ClaudeBot | | script output | same |
| Gemini / Google Search | Googlebot (shared user-agent - blocking Googlebot blocks Gemini by default) | | script output | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] |
| Google AI features generally | Google-Extended | | script output | [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] |
| Cohere | Cohere-AI | | script output | [raw/theaeoreport-com-answer-engine-optimization-checklist.md] [raw/ranki-io-blog-aeo-checklist-2026-complete-guide.md] |

### The GPTBot-blocked-but-CCBot-allowed trap

The script flags this combination automatically when present. Per this archive: blocking GPTBot while allowing CCBot (Common Crawl) lets ChatGPT train on the content via the Common Crawl dataset while blocking it from citing that content in live answers - "the worst of both worlds" if the site's actual intent was full AI opt-out, or a genuine, separate finding if the intent was narrower (block live-citation crawling only). Confirm intent with the customer at intake rather than assuming either reading; do not score this as an automatic Critical without that context. [raw/theaeoreport-com-answer-engine-optimization-checklist.md]

### Guidance to weigh, not a hard rule

Most sites should allow all four major agents (GPTBot, PerplexityBot, ClaudeBot, and either Googlebot or Google-Extended depending on scope). A wildcard `Allow: /` works; naming each agent explicitly in robots.txt (and mirroring the same intent in llms.txt) gives finer control over crawl depth and frequency. This is one vendor source's specific recommendation (receipts cited: OpenAI's GPTBot documentation, Perplexity's webmaster guidelines, Anthropic's ClaudeBot spec, each dated in the source), not an assertion that blocking is always wrong - a site with an explicit business reason to opt out of AI training/citation is making a legitimate choice, not committing an error. [raw/theaeoreport-com-answer-engine-optimization-checklist.md]
```
