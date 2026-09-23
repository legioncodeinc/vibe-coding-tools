# 02. Platform traversal strategies

Per PRD-007 AC-1: "Given `target-profile.json` names a supported platform, when the crawl runs,
then it uses that platform's specific traversal strategy rather than a generic link-follow."

## Honesty note on grounding

`references/research/distilled-site-crawler.md` is explicit that its two raw sources
(`raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md` and
`raw/edgedns-dev-guides-domain-tech.md`) are both about single-request technology **detection**,
not crawl **seeding** or traversal strategy. Neither source names a per-platform seed-path list for
a multi-page crawl. The seed-path table below is therefore a judgment call, reasoned from:

- The well-known platform paths both raw sources do document as detection signatures (`/wp-admin/`,
  `/wp-content/`, `/_next/`, `/.nuxt/`), read as structural hints about where a platform exposes
  content, which the distillation itself frames as an inference, not a stated recommendation
  (`references/research/distilled-site-crawler.md` section 3).
- The build plan's own platform-guide file list (`plan/website-auditor-build-plan.md` section 6:
  `platform-cms-wordpress.md`, `platform-ecom-shopify.md`, `platform-ecom-magento.md`,
  `platform-vibe-nextjs.md`, `platform-vibe-sveltekit.md`, `platform-vibe-react-vite.md`), which
  names the platform categories this Stinger must handle even though the guide files themselves
  (`shared/platform-guides/*.md`) are still forge-stage-3 stubs as of this writing, owned by other
  pairs in this build (primarily `stack-fingerprint-stinger`). When those guides are populated in a
  later forge pass, re-derive this table from them rather than this judgment call.

Every strategy below always includes `/sitemap.xml` as a seed and always falls back to plain
same-domain link-following once seeds are exhausted, so an unrecognized or partially-wrong platform
classification degrades to a generic crawl rather than finding zero pages.

## Seed-path table by `target-profile.json` platform value

| Platform value | Seed paths tried first | Reasoning |
|---|---|---|
| `wordpress` | `/wp-json/wp/v2/pages`, `/wp-json/wp/v2/posts`, `/sitemap.xml`, `/sitemap_index.xml` | WordPress's REST API exposes a paginated JSON list of pages/posts at these well-known paths; this is the most direct way to enumerate content without guessing nav structure. `/wp-content/` and `/wp-admin/` are detection signatures, not crawl targets, so they are deliberately excluded from the seed list (crawling `/wp-admin/` would attempt an authenticated area, which PRD-007's Non-Goals explicitly forbid). |
| `shopify` | `/sitemap.xml`, `/collections/all`, `/collections`, `/products` | Per PRD-007 Goals' own example: "Shopify needs `/collections/` and `/products/` traversal." `/collections/all` is Shopify's conventional full-catalog listing page. |
| `magento` | `/sitemap.xml`, `/catalogsearch/advanced` | Magento sites vary widely in URL structure by theme; `/sitemap.xml` is the only reliably present enumeration surface, `/catalogsearch/advanced` is a common secondary entry point into the catalog. |
| `nextjs`, `sveltekit`, `react-vite` | `/sitemap.xml` | These are the plugin's own three "vibe-code" stacks (per PRD-003). None expose a public route-manifest endpoint by default; the build plan's own guide list names "SvelteKit needs route-manifest discovery," but route manifests are a build-time server-side artifact, not something an external crawler can fetch without the site author explicitly exposing it. Absent that, `/sitemap.xml` plus link-following is the honest fallback: flagged here rather than claiming a "route-manifest discovery" mechanism this archive does not ground. |
| `unknown` (per PRD-003 AC-2, an explicit, valid classification) | `/sitemap.xml` | An `unknown` platform is not an error state to work around; it means stack-fingerprint-wasp-drone could not classify the stack and said so honestly. Crawl it the same way as any unrecognized platform: sitemap-first, then link-follow. |

## What "traversal strategy" changes, concretely

Per PRD-007 AC-1, the requirement is that the strategy differs by platform, not that every
platform gets a wholly custom crawler. In this Stinger's implementation (`crawl-extract.py`), the
platform value changes exactly one thing: which URLs seed the frontier before link-following takes
over. The link-following, storage, slugification, robots.txt handling, and 100-page cap are
identical across all platforms. This is a deliberate scope decision: PRD-007's Non-Goals rule out
authenticated-area crawling and form submission for every platform equally, so there is no
platform-specific traversal that would require a genuinely different fetch mechanism, only a
different starting point.
