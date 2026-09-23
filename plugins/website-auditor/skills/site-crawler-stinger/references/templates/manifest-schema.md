# `site-data/manifest.json` schema

Copy-ready field reference for the single index file `crawl-extract.py` writes at
`site-data/manifest.json` after every run. This is the file the nine Wave-5 Drones (technical-seo,
aeo-audit, content-semantics, internal-linking, visual-funnel, accessibility-audit,
web-security-posture, analytics-stack, performance-cwv) should read to find every crawled page,
instead of listing `site-data/` and re-deriving the slug convention themselves. Per PRD-007 AC-3,
none of those nine Drones should re-fetch a page already present here.

See `references/templates/site-data-manifest.example.json` for a fully worked example, and
`guides/04-storage-and-manifest-convention.md` for the reasoning and slugify algorithm behind it.

## Top-level fields

| Field | Type | Meaning |
|---|---|---|
| `run_generated_at` | ISO 8601 string, UTC | When this manifest was written, i.e. when the crawl finished. |
| `target_url` | string | The audited site's canonical base URL, as passed to `crawl-extract.py --base-url`. |
| `platform` | string | Lowercased platform value read from `_shared/target-profile.json`, e.g. `wordpress`, `shopify`, `sveltekit`, `unknown`. |
| `rendering` | string | Rendering mode read from `_shared/target-profile.json` (`server-side rendered`, `client-side rendered`, or a named hybrid). Wave-5 Drones should treat pages on a `client-side rendered` site as thin-capture, see the guide. |
| `max_pages` | integer | The page-count cap enforced for this run (default 100, per PRD-007 Goals). |
| `pages_fetched` | integer | `len(pages)`, provided for a quick sanity check without counting the array. |
| `pages` | array of page objects | One entry per successfully fetched, stored page. See below. |
| `unreachable` | array of failure objects | One entry per URL the crawler tried and could not store as a page. See below. |

## `pages[]` entry fields

| Field | Type | Meaning |
|---|---|---|
| `url` | string | The normalized URL fetched (query string and fragment stripped, see slugify rule 1 in the storage guide). |
| `slug` | string | The deterministic filename stem for this page. Use this value directly; do not recompute it. |
| `html_path` | string | Path to the raw HTML file, relative to the audit workspace root, e.g. `site-data/about.html`. |
| `md_path` | string | Path to the Markdown extraction, relative to the audit workspace root, e.g. `site-data/about.md`. |
| `discovered_via` | string | One of `seed-root`, `platform-seed`, `sitemap`, `link-follow`. How this URL entered the frontier. |
| `fetch_order` | integer | 1-indexed order this page was fetched in, within the 100-page budget. |
| `http_status` | integer | HTTP status code of the successful fetch (always 200 for entries in `pages[]`; non-200 responses land in `unreachable[]` instead). |
| `reachable` | boolean | Always `true` for `pages[]` entries. Present for symmetry with `unreachable[]` entries, which carry `reachable: false` implicitly by being in that array. |
| `content_type` | string | The raw `Content-Type` response header value. |
| `bytes_html` | integer | Size in bytes of the stored raw HTML file. |
| `fetched_at` | ISO 8601 string, UTC | When this specific page was fetched. |

## `unreachable[]` entry fields

| Field | Type | Meaning |
|---|---|---|
| `url` | string | The URL that was attempted. |
| `reason` | string | Free-text failure reason: `robots-disallowed`, a Python exception string from the fetch attempt, or `non-html-or-non-200 (status=..., content-type=...)`. |
| `fetch_order` | null | Always `null`. Unreachable URLs never consume a slot in the 100-page fetch-order sequence. |

## Consumption contract for Wave-5 Drones

- Read `site-data/manifest.json` once per run. Iterate `pages[]` for every page to analyze.
- Do not treat `unreachable[]` entries as a defect to fix; they are the crawler's documented,
  intentional failure-recording discipline (see the guide), not a bug to route around by
  re-fetching.
- If a Wave-5 Drone's own scope requires a URL that appears in neither `pages[]` nor
  `unreachable[]`, that URL was never discovered by the crawl (not in the sitemap, not linked from
  any fetched page, not a platform seed). That is a finding about the site's internal linking or
  sitemap coverage, and belongs in that Drone's own report, not a reason to bypass `site-data/` and
  fetch it directly.
