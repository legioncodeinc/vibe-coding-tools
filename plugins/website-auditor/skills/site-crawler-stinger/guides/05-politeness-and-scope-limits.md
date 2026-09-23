# 05. Politeness and scope limits

The conduct-rule and Non-Goals boundaries that apply to every crawl, regardless of platform.

## Robots.txt

`crawl-extract.py` fetches `/robots.txt` once per run and checks every candidate URL against it
before fetching. A missing or unreachable `robots.txt` is treated as "no restrictions stated," not
as a crawl-stopping error, consistent with the same graceful-failure discipline documented for
sitemap.xml in `guides/03-fetching-and-rendering.md`. A URL disallowed by robots.txt is recorded in
`manifest.json`'s `unreachable[]` array with `reason: "robots-disallowed"`, not silently skipped
with no record.

## Rate limiting

A fixed delay (default 0.5 seconds, configurable via `--delay-seconds`) is applied between fetch
attempts. Neither raw source in this Stinger's archive documents a specific rate-limiting standard
for crawling (per `references/research/distilled-site-crawler.md` section 7's gap note), so this
default is a judgment call favoring politeness over speed: a 100-page crawl at 0.5s/page takes
roughly one minute of fetch time, which is a reasonable tradeoff against the risk of tripping a
target site's own rate limiting or bot protection mid-crawl.

## Same-domain only

`crawl-extract.py` never follows a link whose netloc differs from `--base-url`'s netloc. This
crawler is not a general-purpose web crawler; it exists to build one site's `site-data/`, not to
wander into every third-party domain the site links to.

## The 100-page cap, and what happens at the cap

Per PRD-007 Goals and Non-Goals: "Crawls up to 100 pages... does not exceed 100 pages without
explicit user opt-in for a deeper crawl." When the frontier is exhausted before 100 pages, the
crawl simply stops early; hitting exactly 100 is not a target to reach, it is a ceiling. If the
frontier still has unvisited URLs when the cap is hit, those URLs are neither fetched nor recorded
in `unreachable[]` (they were never attempted); a Wave-5 Drone that needs to know whether the site
has more pages than 100 should compare `manifest.json`'s `pages_fetched` count against its own
independent estimate of site size (e.g. from a sitemap-index entry count), not assume 100 fetched
pages means the site has exactly 100 pages.

Deeper crawls (past 100 pages) require the explicit per-run opt-in PRD-007's Non-Goals describes.
This Stinger's default invocation never does this on its own; a deeper crawl is a deliberate,
user-approved re-run with a raised `--max-pages` value, not a fallback this Drone decides on its own.

## No authenticated areas, no forms, no state-changing requests

Every fetch in this Stinger is a plain `GET` request with no credentials, no cookies carried
between requests, and no form submission. This mirrors the plugin-wide conduct rule ("Read-only/
passive by default; any step that would create state on the target... requires explicit per-run
opt-in that defaults OFF," carried into every PRD in this build) and PRD-007's own Non-Goals line:
"Does not crawl authenticated/gated areas, does not submit forms." A login page or a `/account/`
path discovered during link-following is still fetched (its public-facing HTML is not gated), but
this Stinger never attempts to authenticate past it.

## Re-crawl discipline

This Stinger's binding contract (PRD-007's Shared workspace contract: "Writes once; every Wave-5
Drone reads this folder read-only with no write contention") means `site-data/` is not designed for
incremental updates. If a mid-engagement site restructure is suspected (this Stinger's Drone file
lists this as a valid re-invocation trigger), the correct procedure is a full re-crawl that
overwrites `site-data/` and `manifest.json` wholesale, not a partial patch. A partial patch risks
leaving stale pages in `site-data/` with no manifest entry pointing at them, which breaks the
"manifest is the single source of truth" contract in `guides/04-storage-and-manifest-convention.md`.
