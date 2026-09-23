# Distilled research: finding trending GitHub repos worth posting about

Distilled 2026-08-17 from the raw archive in `raw/`. Every claim cites its raw file.

## Discovery surface

| Angle | How | Freshness control | Citation |
|---|---|---|---|
| The trending board itself | Fetch https://github.com/trending as HTML (Exa `web_fetch_exa` or Firecrawl); language and `?since=daily` filters in the URL | daily board = last 24h star momentum | raw/github-trending-discovery.md |
| Momentum analytics | OSS Insight trending API (`period=past_24_hours`, default) or trendshift.io hourly star-gain board | `past_24_hours` period | raw/github-trending-discovery.md |
| Topic-led hunt | Firecrawl `firecrawl_search` with `categories: ["github"]`, or `firecrawl_research_search_github` (query + k) over indexed issues, PRs, READMEs | none; confirm momentum on the repo page | raw/firecrawl-mcp-tool-schemas.md |
| Repo verification | Fetch the repo page and README directly | check stars-today, release dates, commit recency | raw/github-trending-discovery.md |

Hard fact: GitHub has NO official trending API; the board is fetchable HTML and third-party APIs scrape it. Third-party feeds can return empty and must be handled gracefully (raw/github-trending-discovery.md).

## What counts as fresh here

For a repository the 24-hour rule binds the TREND, not the repo's birthday. An old repo spiking today is fair game; a repo that trended last week is stale. Evidence of the current spike: presence on today's daily trending board, "stars today" counts, or an hourly star-gain ranking (raw/github-trending-discovery.md). A recent daily-board sample was dominated by AI-agent skills, Copilot tooling, and AI learning repos, confirming the niches this skill hunts are exactly what trends (raw/github-trending-discovery.md).

## Post craft carried over

Same Hook, Tension, Payoff model and specificity rule as the news skill: star counts, dollar figures, and tool names are the concrete details that make a repo post land (raw/viral-post-craft.md). Engagement bait is penalized; genuine sharp takes are not (raw/viral-post-craft.md).

## Tool surface notes

Exa default MCP tools carry no date filters; Firecrawl `firecrawl_search` accepts `tbs` time bounds and a `github` category; `firecrawl_research_search_github` returns repository, URL, snippet, and matched markdown (raw/exa-mcp-and-search-api.md, raw/firecrawl-mcp-tool-schemas.md).
