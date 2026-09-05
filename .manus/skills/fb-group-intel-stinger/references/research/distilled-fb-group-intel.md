# Distilled Research: Facebook Group Intelligence Extraction

Every claim below cites its raw source file in `references/research/raw/`.

## 1. Transport decision: Headless Browser over Web Unblocker

Oxylabs Headless Browser is the right transport for this job. It provides a real remote Chrome driven over CDP by Playwright, with automatic CAPTCHA solving, residential proxies, state/city geotargeting, sticky sessions, and persistent profiles [oxylabs-headless-browser.md]. Web Unblocker is a request/response proxy with optional JS rendering; it supports cookie passthrough (`x-oxylabs-force-cookies: 1`) and sticky IPs (`X-Oxylabs-Session-Id`), but it is not designed for multi-step in-page interaction, and Oxylabs explicitly says it is not for use with headless browser drivers [oxylabs-web-unblocker.md]. Our extraction requires clicking tabs (group history, admins section, about sub-sections), which is browser-driving work, so Headless Browser wins.

## 2. Session architecture for the "John" persona

The lowest-risk pattern is a persistent profile plus a pinned residential IP. Persistent profiles (`o_profile=john`) save and restore cookies/localStorage across sessions for 14 days from last use, but the feature requires manual activation on the Oxylabs account [oxylabs-headless-browser.md]. Pairing the profile with `proxy_resi_ses_id` and `proxy_resi_ses_time` pins the residential exit IP; Oxylabs warns that restoring a profile from a different IP can invalidate cookies and trigger security verification screens [oxylabs-headless-browser.md]. Until persistent profiles are activated, a sticky session (`session_name`, max TTL 24h) covers a single working day [oxylabs-headless-browser.md].

## 3. What Facebook exposes and where

Group description, history (creation date and name-change dates), activity stats, privacy badge, and the admins/moderators roster are all reachable from the group's About page and Members page when logged in [facebook-group-pages.md]. Admin profile data lives under `profile.php?id={id}&sk=about_*` sub-sections; only sub-sections visible in that user's about navigation should be requested [facebook-group-pages.md].

## 4. What HAR captures do and do not contain

DevTools HAR captures of the group search page contain route-definition payloads with group IDs and names for every rendered group link, including suggestion rails, which overcounts true search results by roughly 4x (1,654 captured IDs vs 405 actual results for the elon musk query) [facebook-har-findings.md]. Member counts are absent from HAR bodies because Facebook delivers them via a separate GraphQL/Relay channel that DevTools did not persist [facebook-har-findings.md]. Live DOM scraping of search result cards recovers member counts for 100% of results without visiting any group page [facebook-har-findings.md].

## 5. Rate and risk posture

Facebook search results cap around 400-410 groups per query [facebook-har-findings.md]. Card member counts are rounded display values, so aggregate totals are display-precision [facebook-har-findings.md]. Image URLs can be stored for free; image bytes should be fetched via plain unauthenticated CDN GETs in a separate pass, never bulk-downloaded through the authenticated session [facebook-group-pages.md]. Unauthenticated group access is unreliable due to login walls [facebook-group-pages.md].

## 6. Operational gotchas

Chrome 136+ refuses `--remote-debugging-port` on the default user-data-dir; a copied user-data-dir works but arrives logged out because the Cookies DB is locked/encrypted, so manual re-login in the debug instance is required [facebook-har-findings.md]. Windows console output must be reconfigured to UTF-8 with errors=replace or emoji in group names crash the script [facebook-har-findings.md]. Oxylabs connections need retry-with-backoff and mandatory browser.close() in a finally block to avoid leaking sessions against the 100-concurrent cap [oxylabs-headless-browser.md].
