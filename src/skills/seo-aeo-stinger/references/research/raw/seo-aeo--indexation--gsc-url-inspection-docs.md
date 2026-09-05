# Search Console API - index.inspect / URL Inspection tool

- URL: https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect ; https://support.google.com/webmasters/answer/9012289
- Fetched: 2026-08-14
- Source type: official-docs
- Component: indexation

## Notes

`urlInspection.index.inspect` (Search Console API) returns the index status of a URL for the version currently in the Google index -- it does not test the indexability of a live/unpublished URL via the API. POST to `https://searchconsole.googleapis.com/v1/urlInspection/index:inspect` with `inspectionUrl` (fully-qualified URL under the specified `siteUrl`), `siteUrl` (the verified property, `https://www.example.com/` for URL-prefix or `sc-domain:example.com` for Domain properties), and optional `languageCode`. Returns an `inspectionResult` (`UrlInspectionResult`) object.

The Search Console UI's URL Inspection tool provides three capabilities: (1) see the status of a URL in the Google index (from the most recently indexed version, not a live fetch), (2) inspect a live URL to test current indexability, (3) request indexing for a URL.

Important caveat: the "Indexing allowed?" field will always read "Yes" if the page is blocked by robots.txt, because Google cannot access the page to check for a `noindex` directive at all -- robots.txt blocking is evaluated separately and does not get folded into that field. A passing live-test verdict does not guarantee inclusion in the index; other conditions (duplicate/canonical selection, quality) still apply.

Indexing requests: submitted via "Request indexing" after a live test passes; typically takes about a day but can take much longer; not guaranteed. There is a daily limit on manual index-request submissions -- for bulk updated pages, the better channel is a fresh XML sitemap with accurate `<lastmod>` values, not individual requests.
