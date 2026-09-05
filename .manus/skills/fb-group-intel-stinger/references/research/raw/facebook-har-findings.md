# Raw Source: Empirical findings from Facebook HAR analysis (wiener-gate project)

- URL: n/a (primary empirical findings from this project's own captures)
- Fetch date: 2026-08-28
- Source type: primary empirical data (user's own browser captures)

## What the HAR captures contained

Two HAR files captured from Chrome DevTools on 2026-08-28, each covering ~4.5 minutes of browsing a Facebook group search page (`facebook.com/search/groups/?q=elon%20musk` and `?q=dachshund%20puppy`).

- All 351 (elon) and 229 (dachshund) requests were POSTs to `https://www.facebook.com/ajax/bulk-route-definitions/` with `application/x-www-form-urlencoded` bodies containing `route_urls[N]` lists, `__user`, `__req`, `x-fb-lsd` header.
- Route-definition responses embed `"groupID":"<digits>"` ... `"meta":{"title":"<group name>"}` pairs. Regex that worked: `"groupID":"(\d+)".*?"meta":\{"title":"((?:[^"\\]|\\.)*)"` with DOTALL.
- The HAR contained group IDs and names for every group link rendered on screen, including suggestion rails ("Groups you might like"), hover cards, and related-group modules. This produced 1,654 unique IDs for elon musk vs only 405 actual search results. Lesson: HAR route-definition extraction overcounts search results roughly 4x; it captures prefetched suggestions too.
- Member counts were NOT present anywhere in the HAR response bodies. Facebook delivers member counts through a separate channel (GraphQL/Relay) whose bodies were not saved by DevTools. No `member_count`, no "12K members" strings, no visibility fields in the captured bodies.

## What the live authenticated run (v2) established

- Driving a logged-in Chrome via CDP/Playwright and scrolling the search page yields result cards whose DOM text includes "X members" (e.g. "507K members"). Walking up to 8 parent elements from the group anchor finds the card text. 405/405 elon groups and 409/409 dachshund groups yielded member counts from cards alone, no per-group page visits needed.
- Facebook search results appear capped around ~400-410 results per query.
- Member counts displayed on cards are rounded ("507K"), so totals are display-precision, not exact headcounts.
- Windows console cp1252 crashes on emoji in group names; scripts must reconfigure stdout to utf-8 errors=replace.
- Chrome 136+ (tested on 151) blocks --remote-debugging-port on the default user-data-dir; a copied user-data-dir works, but the Cookies SQLite DB is locked by any running Chrome instance and encrypted per-profile, so copied profiles arrive logged out. Manual re-login in the debug instance is the pragmatic fix.
