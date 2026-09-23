# Security headers scoring checklist

Copy-ready per-header checklist for `web-security-posture-wasp-drone`. Grounded in distilled research section 1 and 2, itself synthesized from OWASP's HTTP Headers Cheat Sheet and Google's web.dev security-headers article, both official docs. [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md] [raw/web-dev-articles-security-headers.md] Every row is a boolean checkpoint per build plan section 4.1 ("Boolean checkpoints resolve only to 6 or 1. Nothing between."), scored automatically by `shared/scripts/security-headers.py`, which emits exactly this evidence/justification pair per row; use this table to interpret and, where necessary, override that script's output with a manual read (e.g. a CSP present but syntactically weak still needs a human judgment call the script does not make).

## Headers required present

| Header | Score 6 when | Score 1 when | Source |
|---|---|---|---|
| Strict-Transport-Security (HSTS) | Present, recommended `max-age=63072000; includeSubDomains; preload` | Absent | [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md] [raw/web-dev-articles-security-headers.md] |
| Content-Security-Policy (CSP) | Present with a nonce-based or hash-based strict policy | Absent | [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md] [raw/web-dev-articles-security-headers.md] |
| X-Frame-Options **or** CSP `frame-ancestors` | Either present (OWASP: CSP's `frame-ancestors` obsoletes X-Frame-Options for supporting browsers) | Neither present | [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md] |
| X-Content-Type-Options | `nosniff` | Absent or any other value | [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md] [raw/web-dev-articles-security-headers.md] |
| Referrer-Policy | Present (recommended `strict-origin-when-cross-origin`) | Absent | [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md] |
| Cache-Control | Present, `no-store` for sensitive pages, `private` for user-specific caching | Absent on a page carrying sensitive data | [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md] |

## Headers that should NOT be present (or must be explicitly disabled)

| Header | Score 6 when | Score 1 when | Source |
|---|---|---|---|
| X-XSS-Protection | Absent, or explicitly set to `0` | Present with any non-zero value | [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md] |
| Expect-CT | Absent | Present (OWASP marks this deprecated with an explicit warning) | [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md] |

## web.dev-specific headers OWASP's archived excerpt does not name

Score these per web.dev's own three-tier grouping; do not treat their absence as automatically critical the way the "all sites" tier headers above are, since web.dev itself only recommends the "sensitive data" and "advanced capabilities" tiers conditionally. [raw/web-dev-articles-security-headers.md]

| Header | Tier | Recommended for |
|---|---|---|
| Cross-Origin Resource Policy (CORP) | All websites | Prevents a site's resources being included by a cross-origin page |
| Cross-Origin Opener Policy (COOP) | All websites | Protects a page's window from interaction by malicious cross-origin windows |
| Trusted Types | Sensitive user data | Enforces sanitization before data reaches dangerous JS APIs, paired with CSP |
| Cross-Origin Resource Sharing (CORS) | Advanced capabilities | Controls cross-origin access to resources |
| Cross-Origin Embedder Policy (COEP) | Advanced capabilities, paired with COOP | Cross-origin isolation for `SharedArrayBuffer` and similar |

## Cookie attributes (not itself a single boolean checkpoint)

OWASP defers cookie-attribute depth to its own Session Management Cheat Sheet, not archived in this Stinger's raw set. [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md] Score each session-bearing cookie individually using `shared/scripts/security-headers.py`'s per-cookie `secure`/`httponly`/`samesite` evidence: 6 if all three attributes are present and appropriate to the cookie's purpose (e.g. `SameSite=Strict` or `Lax` for a session cookie, `Secure` and `HttpOnly` always for anything session-bearing), 1 if any is missing on a session-bearing cookie. Non-session cookies (e.g. a CMP consent flag) are lower-stakes; use judgment and label the reasoning.

## Running the automated check

```
python3 shared/scripts/security-headers.py --url https://example.com --out 07-security/header-scan-findings.json
```

Pass `--urls-file` with a list of crawled URLs (drawn from `site-data/`) to check headers across more than just the landing page; header configuration can differ by route (e.g. a checkout page may set a stricter CSP than the marketing homepage).
