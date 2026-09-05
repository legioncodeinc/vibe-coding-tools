# robots.txt for AI Crawlers in 2026: GPTBot, ClaudeBot, PerplexityBot - The Complete Configuration Guide

- URL: https://seo.yatna.ai/seo-academy/robots-txt-guide-ai-crawlers-2026/
- Fetched: 2026-08-14
- Source type: vendor-blog
- Component: robots

## Notes

Ten AI crawlers matter for visibility in 2026: GPTBot, ChatGPT-User, ClaudeBot, anthropic-ai, PerplexityBot, CCBot, Google-Extended, Amazonbot, meta-externalagent, and Bytespider.

robots.txt is checked before any other page on a site. If it blocks GPTBot or ClaudeBot, content does not appear in ChatGPT or Claude responses -- not a content-quality problem, a crawler-access problem.

| Bot Name | User-Agent | Operator | Purpose |
| --- | --- | --- | --- |
| GPTBot | `GPTBot` | OpenAI | ChatGPT training + browse |
| ChatGPT-User | `ChatGPT-User` | OpenAI | ChatGPT browse real-time |
| anthropic-ai | `anthropic-ai` | Anthropic | Claude training |
| ClaudeBot | `ClaudeBot` | Anthropic | Claude browse |
| PerplexityBot | `PerplexityBot` | Perplexity AI | Perplexity search |
| CCBot | `CCBot` | Common Crawl | AI training datasets |
| Google-Extended | `Google-Extended` | Google | Gemini training |
| Amazonbot | `Amazonbot` | Amazon | Alexa + Amazon AI |
| meta-externalagent | `meta-externalagent` | Meta | Meta AI |
| Bytespider | `Bytespider` | ByteDance | TikTok AI |

Key distinction: training vs. browse. GPTBot and anthropic-ai crawl to train models. ChatGPT-User and ClaudeBot are live retrieval crawlers used when a user asks the assistant to browse in real time -- separate user-agents, configurable independently.

### Recommended configuration (allow all -- most sites)

```
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: CCBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: Bytespider
Allow: /

User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

Selective alternative: allow real-time browse bots (ChatGPT-User, ClaudeBot, PerplexityBot) for citation visibility; disallow bulk training crawlers (GPTBot, anthropic-ai, CCBot, Google-Extended) to limit training-data contribution. The highest-priority change for AI citation visibility in 2026 is unblocking browse crawlers -- effect within days to weeks as recrawl cycles refresh.

Specific user-agent rules take precedence over the wildcard `User-agent: *`. A `Disallow: /` wildcard combined with a specific `Allow: /` for one bot allows only that bot.

Delete any existing static `public/robots.txt` if migrating to a dynamic endpoint approach -- having both a static file and a generated route causes conflicts.

Verify output by visiting `/robots.txt` directly after deploy.

## Cross-reference (from other 2026 crawler-guide sources gathered in the same research pass)

Companion sources (cite.sh AI Crawler Guide; TryGeoSuite/ai-crawler-bots) add nuance: OpenAI separates `GPTBot` (training) from `OAI-SearchBot` (ChatGPT Search discovery) -- you can block one without the other. Anthropic similarly separates `ClaudeBot`/`anthropic-ai` (training, now largely deprecated in favor of `ClaudeBot`) from `Claude-SearchBot` and `Claude-User`. `Perplexity-User` is a user-initiated fetcher that generally ignores robots.txt because a human requested the page. `Google-Extended` and `Applebot-Extended` are policy-only tokens with no separate crawling UA -- they gate training-data use, not Search/Spotlight/Siri indexing. There is no universal allow list; the recommended pattern for brand sites wanting AI visibility without donating content to bulk training is: allow `OAI-SearchBot`, `PerplexityBot`, `Amazonbot`, the `*-User` fetchers, `Google-Extended`/`Applebot-Extended`; disallow the bulk training crawlers (`GPTBot`, `ClaudeBot`/`anthropic-ai`, `CCBot`, `Meta-ExternalAgent`, `Bytespider`).
