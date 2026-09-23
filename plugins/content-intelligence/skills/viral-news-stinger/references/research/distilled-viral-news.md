# Distilled research: mining trending news for viral posts

Distilled 2026-08-17 from the raw archive in `raw/`. Every claim cites its raw file. Where sources conflict, both readings are stated.

## Tool surface (what a Routine session can actually call)

| Capability | Tool | Freshness control | Citation |
|---|---|---|---|
| News sweep, index-bounded to ~24h | Firecrawl `firecrawl_search` with `sources: [{"type":"news"}]`, `tbs: "qdr:d"` | `tbs` time-bounded search (`qdr:h` hour, `qdr:d` day) | raw/firecrawl-mcp-tool-schemas.md |
| Semantic search, general web | Exa `web_search_exa` (query + numResults only) | none built in; verify `publishedDate` per result | raw/exa-mcp-and-search-api.md |
| Date-filtered search (if enabled) | Exa `web_search_advanced_exa` | `startPublishedDate` ISO 8601; `category: news` or `tweet` | raw/exa-mcp-and-search-api.md |
| Read any URL as markdown | Exa `web_fetch_exa` (batchable) | n/a | raw/exa-mcp-and-search-api.md |
| X trend candidates without an X API key | Fetch a public mirror (XTapDown top 50 hourly, TrendWatchy, snaplytics, twtData) | mirrors refresh hourly | raw/x-trend-mirrors.md |

The default Exa MCP toolset has NO date filter, so published dates in results are the freshness authority and must be checked per story, not assumed (raw/exa-mcp-and-search-api.md). Exa's crawl-date filters are deprecated and ignored; only published-date filters are live (raw/exa-mcp-and-search-api.md).

## Trend discovery model

X's What's-happening panel is mirrored hourly by several fetchable public sites; the raw panel is dominated by sports and entertainment noise at any hour, so trends are candidate generators only. The factual basis for a post must come from real reporting found afterward (raw/x-trend-mirrors.md).

## Post craft (points of cross-source agreement)

- Structure is Hook, Tension, Payoff; the first line is the whole post for roughly 90% of viewers (raw/viral-post-craft.md).
- Specific numbers and names beat abstractions; every post needs at least one concrete detail (raw/viral-post-craft.md).
- Repeating viral formats: one-liner truth bomb, short story with payoff, numbered list, contrarian take, receipt/screenshot (raw/viral-post-craft.md).
- Engagement bait is penalized by X's AI content scoring; a strong genuine position that invites debate is not bait, the line is intent (raw/viral-post-craft.md). This is why the skill demands sharp-but-accurate: fabrication is both an ethics failure and an algorithmic one.
- Most posts' impression window closes within 24-48 hours, which is the mechanical argument for the 24-hour freshness gate: stale news cannot ride a wave that already crested (raw/viral-post-craft.md).
- Hashtags on X 2026: one or two in the post body at most; stacks dilute the topical read. The separate 2-4 hashtag block this skill outputs is owner spec, offered apart from the post body so Mario chooses what to paste (raw/viral-post-craft.md).

## Flagged conflict

Threads: Buffer-based sources say threads outperform single posts; HelperX 2026 says thread reach collapsed 70-85% after tweet 1 and recommends long single posts. Unresolved. This skill outputs single posts at three lengths and never threads, so the dispute does not bind it (raw/viral-post-craft.md).
