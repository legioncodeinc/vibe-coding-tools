# 08. Launch and indexation playbook

The "rank fast" runbook: what to do day 1, week 1, month 1. Also covers IndexNow and the Google Search Console URL Inspection API.

## Day 1 (before or at launch)

1. Confirm `robots.txt` allows the target AI crawlers and the sitemap directive is present (`guides/01`).
2. Confirm every indexable route has `ssr = true` and a unique title/description via `generateSEO()` (`guides/02`).
3. Confirm the sitemap endpoint returns valid XML including every published Payload slug (`guides/01`, `guides/04`).
4. Ship `/llms.txt` (near-zero cost, some upside; see `guides/06`).
5. Verify the domain in Google Search Console and Bing Webmaster Tools. Submit the sitemap in both.
6. Set up IndexNow (see below) so Bing/Yandex/Seznam/Naver recrawl new/changed URLs within minutes to hours instead of days. [raw/seo-aeo--indexation--indexnow-vs-indexing-api.md]

## Week 1

1. Use Search Console's URL Inspection tool (manual, in the UI, or the `urlInspection.index.inspect` API) to request indexing for the homepage and the handful of highest-priority pages -- there is a daily limit of roughly 10-12 manual requests, so spend them on pages that matter, not on everything. [raw/seo-aeo--indexation--gsc-url-inspection-docs.md]
2. Let the sitemap handle bulk indexation for everything else -- do not try to manually request-index the entire site.
3. Run the AEO checklist (`references/aeo-content-structure-checklist.md`) against the top 5-10 priority pages.
4. Validate all shipped JSON-LD via Rich Results Test and validator.schema.org (`guides/03`).
5. Capture a Core Web Vitals lab baseline (Lighthouse/PageSpeed Insights) for the homepage and top templates (`guides/05`).

## Month 1

1. Check Search Console's Coverage report and, for any URL still showing `Discovered - currently not indexed` after several days, treat it as a content-quality or crawl-budget signal, not a submission problem -- resubmitting does not help. [raw/seo-aeo--indexation--indexnow-vs-indexing-api.md]
2. Pull the first field-data (CrUX) read on Core Web Vitals at p75; compare against the lab baseline from Week 1.
3. Begin querying ChatGPT, Perplexity, and Google (AI Overviews on) with target prompts to check for citation -- Search Console does not show this, it has to be checked directly (`guides/06`).
4. Start the topical-cluster build-out per `guides/07` if it hasn't started already -- month 1 is early, but pillar-first content architecture compounds, so don't wait.

## IndexNow

Google does not participate in IndexNow (evaluated post-2021, never adopted). Participating engines are Bing, Yandex, Seznam, Naver -- one ping notifies all of them. Because Bing's index powers ChatGPT Search and Microsoft Copilot and is a major source for Perplexity, IndexNow submission is a meaningful lever for AI-assistant visibility even though it has zero direct effect on Google. [raw/seo-aeo--indexation--indexnow-vs-indexing-api.md]

Implementation: generate an API key, host it as a plaintext file at `https://yoursite.com/<key>.txt`, then POST changed URLs (batch up to 10,000 per request) to `https://api.indexnow.org/indexnow`. Automate this at the moment of publish/update (a Payload `afterChange` hook is the natural trigger, matching the `website-stinger` webhook pattern in `guides/10-webhooks.md`), not on a slow cron. A `422` response almost always means a host mismatch (stray `www` or protocol); a `429` means batch larger and submit less often. [raw/seo-aeo--indexation--indexnow-vs-indexing-api.md]

## Google Indexing API: narrow, do not misuse

Google's Indexing API is officially scoped only to pages carrying `JobPosting` or `BroadcastEvent` structured data. Using it for arbitrary content is unsupported -- it may trigger a crawl but Google does not guarantee or commit to indexing through it, and doing so anyway burns the default 200-requests/day quota for no reliable benefit. For everything else, rely on sitemap freshness (`lastmod`) plus URL Inspection. [raw/seo-aeo--indexation--indexnow-vs-indexing-api.md]

## Search Console URL Inspection API

`urlInspection.index.inspect` returns the status of the most-recently-indexed version of a URL (not a live fetch) -- use it to verify a submitted or changed URL was actually recrawled, reading `coverageState` and `lastCrawlTime`, rather than assuming a submission worked. [raw/seo-aeo--indexation--gsc-url-inspection-docs.md]

```ts
async function lastCrawlState(url: string, site: string) {
  const res = await searchConsole.urlInspection.index.inspect({
    requestBody: { inspectionUrl: url, siteUrl: site },
  });
  const idx = res.data.inspectionResult?.indexStatusResult;
  return { coverage: idx?.coverageState, lastCrawl: idx?.lastCrawlTime, verdict: idx?.verdict };
}
```

Caveat: the "Indexing allowed?" field always reads "Yes" for a robots.txt-blocked URL, because Google cannot fetch the page at all to check for a `noindex` directive -- robots.txt blocking is evaluated as a wholly separate condition and will not show up as a reason there. Don't rely on that single field to confirm a page is crawlable; check the robots.txt rule directly too. [raw/seo-aeo--indexation--gsc-url-inspection-docs.md]

## Recommended architecture summary

| Channel | Use for | Limit |
| --- | --- | --- |
| IndexNow | Bing/Yandex/Seznam/Naver + downstream AI-assistant visibility (Bing-powered) | Up to 10,000 URLs/batch, free |
| Google Indexing API | `JobPosting`/`BroadcastEvent` pages only | 200 requests/day default |
| Search Console URL Inspection (manual/API) | High-priority individual pages, verification | ~10-12 manual requests/day |
| Sitemap freshness (`lastmod`) | Everything else on Google | No hard limit, but honesty matters -- a stale `lastmod` undermines trust in the signal |

[raw/seo-aeo--indexation--indexnow-vs-indexing-api.md], [raw/seo-aeo--indexation--gsc-url-inspection-docs.md]
