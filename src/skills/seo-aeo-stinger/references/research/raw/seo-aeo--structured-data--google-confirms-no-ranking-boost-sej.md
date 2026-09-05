# Google Confirms That Structured Data Won't Make A Site Rank Better

- URL: https://www.searchenginejournal.com/google-confirms-that-structured-data-wont-make-a-site-rank-better/544433/
- Fetched: 2026-08-14
- Source type: vendor-blog
- Component: structured-data

## Notes

Quoting Google's John Mueller (April 2025, X/Twitter): "Structured data won't make your site rank better. It's used for displaying the search features listed in developers.google.com/search/docs/... . Use it if your pages map to & are appropriate for any of those features." Follow-up: "It's fine to use it for other things in schema.org, that won't cause problems, but you're unlikely to see any visible change from it in Google Search."

This aligns with a 2018 Mueller statement (from a since-deleted tweet): "There's no generic ranking boost for SD usage... However, SD can make it easier to understand what the page is about, which can make it easier to show where it's relevant (improves targeting, maybe ranking for the right terms)."

Google uses only a fraction of the 800+ schema.org types -- roughly 30 types for which it publishes structured-data documentation with required properties and guidelines. Adding non-documented schema.org types doesn't help or hurt; Google ignores it for search features.

Mechanism: structured data is organized content Google can more reliably parse; anything that improves Google's understanding of a page can indirectly help it match the page to the right query -- but this is not a "ranking boost" in the direct-signal sense.

Adding structured data does not guarantee rich-result display; it only makes a page eligible. In the context of AI Search, Google relies on its regular indexed data plus, where relevant, the documented structured-data types, because AI Search results are treated as a search feature themselves.
