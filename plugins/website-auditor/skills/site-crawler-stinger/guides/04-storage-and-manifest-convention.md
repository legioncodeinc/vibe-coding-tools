# 04. Storage and manifest convention

This is the file/folder convention every one of the nine Wave-5 Drones (technical-seo, aeo-audit,
content-semantics, internal-linking, visual-funnel, accessibility-audit, web-security-posture,
analytics-stack, performance-cwv) is built to consume. Those Drones are authored independently, in
this same forge dispatch, by other agents; this convention is the interface contract between this
Stinger's output and every one of them. Treat any change to it as a breaking change across nine
other pairs.

## Honesty note on grounding

`references/research/distilled-site-crawler.md` section 7 states plainly: "storage format for
per-page HTML/Markdown, deduplication of near-identical pages... [is] entirely unresearched in the
current archive." Everything below is therefore a judgment call, not a researched fact. It is
grounded instead in PRD-007's own binding text (`site-data/<slug>.html` / `<slug>.md`, from the
Goals section and Shared workspace contract) and in the practical requirement that nine
independently-authored Drones must be able to consume this convention without ambiguity.

## The convention, in full

1. **One HTML file and one Markdown file per crawled URL.** `site-data/<slug>.html` holds the raw
   fetched HTML, byte-for-byte as received (after UTF-8/Latin-1 decode). `site-data/<slug>.md`
   holds this Stinger's heuristic Markdown extraction of the same page (see
   `guides/03-fetching-and-rendering.md` for that extraction's documented limits).
2. **`<slug>` is derived from the URL path, deterministically, never from page title or content.**
   Two crawls of the same site on different days must produce the same slug for the same URL path,
   so re-crawls are diffable. The exact algorithm, spelled out in full so no consumer needs to
   guess or reimplement it differently:
   - Query string and fragment are dropped before slugifying. `/page?x=1` and `/page#section` are
     the same page; only the first one the crawler reaches gets stored.
   - Root path (`/` or empty) slugifies to `index`.
   - Trailing slash is stripped (except root).
   - Path separators (`/`) become `__` (double underscore) in the slug, so a nested path like
     `/blog/how-we-built-it` becomes `blog__how-we-built-it`, visually distinct from a hyphenated
     single-segment slug.
   - Within each path segment: lowercase, then any character outside `[a-z0-9_-]` becomes `-`, then
     collapse repeated hyphens and trim leading/trailing hyphens.
   - If the resulting slug exceeds 150 characters, truncate to 142 characters and append an 8-hex-
     char md5 hash of the original path, joined by `-`, to stay under common filesystem filename
     limits while remaining unique.
   - On a same-run slug collision (two different normalized URLs somehow producing the same slug,
     which should not happen given the above but is handled defensively), the later page's slug
     gets a 6-hex-char md5 suffix of its full URL appended.
3. **Every page is indexed in one manifest file: `site-data/manifest.json`.** This is the single
   source of truth for "what got crawled." A Wave-5 Drone should never need to `ls site-data/` and
   pattern-match filenames; it should read `manifest.json`'s `pages[]` array and use each entry's
   `html_path`/`md_path`/`slug` fields directly. Full field-by-field schema:
   `references/templates/manifest-schema.md`. Worked example:
   `references/templates/site-data-manifest.example.json`.
4. **Unreachable URLs are recorded, not silently dropped.** `manifest.json`'s `unreachable[]` array
   carries every URL the crawler attempted and could not store, with a reason. This is itself
   evidence a Wave-5 Drone (especially internal-linking and accessibility-audit) may want to consult,
   not an implementation detail to ignore.
5. **Same-domain only, no query-string variants stored separately.** A faceted/filtered URL
   (`/products?color=red`) is treated as the same page as its bare form for storage purposes. If a
   downstream Drone's scope specifically needs faceted-URL behavior (e.g. `technical-seo-wasp-drone`
   auditing canonicalization or `ecommerce-catalog-wasp-drone` auditing filter UX), that Drone should
   fetch the specific faceted URL itself; `site-data/` is not built to hold every query-string
   permutation of every page.

## Why a manifest instead of filename pattern-matching alone

The slug algorithm above is fully deterministic and documented so a Wave-5 Drone could reconstruct a
slug from a known URL if it truly needed to, but the manifest exists specifically so no Drone ever
has to. Depending on slugify-algorithm knowledge to consume `site-data/` would mean any future
change to this Stinger's slugify implementation silently breaks nine other Drones with no error, just
wrong file lookups. Depending on `manifest.json` instead means a slugify change updates the
manifest and every consumer keeps working unmodified. This is the same reasoning PRD-003 applies to
`target-profile.json`: write the derived fact once, have everyone read the artifact, not
re-derive it.
