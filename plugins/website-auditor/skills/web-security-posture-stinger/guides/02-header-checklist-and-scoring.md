# Header checklist and scoring, procedural detail

Companion to `references/templates/security-headers-scoring-checklist.md`. Grounded in distilled research sections 1-2.

## 1. Read both header sources as complementary, not competing

OWASP's HTTP Headers Cheat Sheet and Google's web.dev security-headers article are both official docs (OWASP's own cheat sheet series; Google's web.dev), and they cover overlapping but not identical ground. Where they overlap (CSP, X-Frame-Options, X-Content-Type-Options, HSTS), they do not conflict. [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md] [raw/web-dev-articles-security-headers.md] Where they do not overlap, web.dev is the broader source on cross-origin isolation headers (CORP, COOP, COEP, CORS, Trusted Types), while OWASP is the broader source on legacy/deprecated headers (X-XSS-Protection, Expect-CT) and cache/content-type hygiene. [raw/web-dev-articles-security-headers.md] Read both sections, do not treat one as a superset of the other.

## 2. Boolean scoring, not a spectrum, for presence checks

Per build plan section 4.1: "Boolean checkpoints resolve only to 6 or 1. Nothing between." A header is present with an acceptable value, or it is not; do not score a header 3 or 4 for "partially configured" unless you are scoring the underlying implementation quality of a present header (e.g. a present-but-weak CSP, see guide 03) as a separate leaf from the header's mere presence.

## 3. The "should not be present" headers are graded the same way, just inverted

X-XSS-Protection and Expect-CT both score 6 when *absent* (or, for X-XSS-Protection, explicitly disabled with value `0`). This is not a typo in the checklist; OWASP explicitly recommends against these headers. X-XSS-Protection "can itself introduce XSS in otherwise-safe sites" and is superseded by CSP; Expect-CT is marked deprecated with an explicit warning symbol in the source, since mainstream clients now require CT qualification independent of the header. [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md] Finding either present and non-zero is itself the critical finding, not a neutral observation.

## 4. Cookie attributes are evaluated per-cookie, not as one checklist row

OWASP defers cookie-attribute depth to its own Session Management Cheat Sheet, not archived here. [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md] Use `security-headers.py`'s per-cookie evidence (Secure/HttpOnly/SameSite flags, captured verbatim from the raw `Set-Cookie` header) and score each session-bearing cookie individually. A missing `Secure` or `HttpOnly` flag on a session cookie is a strong candidate for a critical (1) finding on its own, independent of the rest of the header checklist.

## 5. Check more than the landing page when it matters

Header configuration commonly differs by route: a marketing homepage and a checkout page are frequently served through different caching layers or CDN configurations with different header sets. Pass `--urls-file` to `security-headers.py` with a handful of representative crawled URLs (checkout, login, account pages if present in `site-data/`) rather than scoring the whole site from a single landing-page request.
