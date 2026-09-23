# 03. Fetching and rendering

Grounded in `references/research/distilled-site-crawler.md`, the parts of the archive that are
genuinely about fetching a single page's response, which is this Stinger's per-page unit of work
repeated up to 100 times.

## Fetch with a real desktop Chrome user agent

`raw/edgedns-dev-guides-domain-tech.md`'s detection methodology fetches "with a real Chrome
desktop User-Agent" specifically so that "sites that gate analytics/consent JS behind UA sniffing
return their full stack" [distilled-site-crawler.md section 4]. `crawl-extract.py` applies the
same tactic to every fetch, not just a landing-page check, since a site that UA-sniffs its landing
page has no reason not to UA-sniff every inner page too.

## The client-rendered blind spot is a storage-quality problem, not a crawl-failure problem

The single most directly crawl-relevant claim in the archive: "fully client-rendered pages can
hide HTML signatures, though headers and cookies still work" for a plain HTTP fetch without JS
execution [distilled-site-crawler.md section 4, `raw/dev-to-scrapemint-...md`]. This Stinger's
crawler does not execute JavaScript (a scope decision made for harness-portability, see
`references/scripts/README.md`), so for any page on a `client-side rendered` site (per
`target-profile.json`'s `rendering` field), the stored `.html` file may be a near-empty shell and
the `.md` extraction derived from it will be correspondingly thin.

**This is not a bug to silently work around.** It is a documented limitation that must be visible
to every downstream Wave-5 Drone. The manifest's `rendering` field carries this forward
(`references/templates/manifest-schema.md`); any Wave-5 Drone auditing content depth, SEO copy, or
semantics on a `client-side rendered` site should treat a thin `.md` file as an expected
consequence of this Stinger's own documented scope, not evidence the page itself is thin.

UA-spoofing (what this Stinger does) and JS execution (what this Stinger does not do) solve
different problems. The two raw sources are not in direct conflict on this point, they simply
address different failure modes under similar-sounding language [distilled-site-crawler.md section
4]. Do not conflate "we fetch with a convincing UA" with "we render the page."

## Bot protection and unreachable pages: record and move on, never retry into a block

`raw/dev-to-scrapemint-...md`'s explicit recommendation, when a target does not respond because of
aggressive bot protection, is to record `reachable: false` and move on rather than retrying into a
block [distilled-site-crawler.md section 5]. `crawl-extract.py` implements this directly: any
fetch exception, non-200 status, or non-HTML content type is written to the manifest's
`unreachable[]` array with a reason string, and the crawl continues to the next frontier item.
There is no retry-with-backoff logic in this Stinger by design; a page that fails once in a
single-pass crawl is recorded as unreachable, not re-attempted.

## Inner-page-only tooling is why this Stinger exists at all

`raw/dev-to-scrapemint-...md` names a checkout-only payment SDK as an example of something "loaded
only on inner pages" that a landing-page-only check will miss entirely
[distilled-site-crawler.md section 6]. This is the clearest raw-sourced justification for why a
multi-page crawl (this Stinger) is a genuinely separate component from `stack-fingerprint-stinger`
(landing-page-only), rather than the same check run in a loop. Keep this in mind when a Wave-5 Drone
asks why site-crawler-wasp-drone exists as its own wave instead of being folded into fingerprinting.
