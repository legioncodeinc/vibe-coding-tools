# CSP implementation depth: nonce vs hash strategy

Grounded in distilled research section 3. Read this before scoring a present CSP as anything better than "present"; presence alone (checked by `guides/02`) is not the same as a well-implemented policy.

## 1. web.dev gives the more concrete implementation guidance of the two sources

Use a nonce-based strict CSP when HTML is server-rendered: generate a fresh nonce per request, set it as the `nonce` attribute on every script tag. Use a hash-based strict CSP when HTML must be served statically or cached (e.g. a single-page application): scripts must be inlined, since most browsers do not support hashing external script files. [raw/web-dev-articles-security-headers.md] web.dev names Google Photos as a real-world nonce-based strict CSP example, and CSP Evaluator as a tool for assessing a deployed policy (this tool reference is itself cut off mid-sentence in the archived text, so no further detail on it is available from this archive). [raw/web-dev-articles-security-headers.md]

## 2. OWASP's CSP section is thin in the archived excerpt

OWASP defines CSP's purpose and threat coverage (XSS, data injection, "data theft to site defacement to distribution of malware") but the archived text cuts off mid-sentence immediately after a "NOTE: This header is relev..." fragment, before any recommendation detail is captured. [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md] This is a fetch-truncation artifact, not a missing-Read issue; nothing past that point is available. For CSP specifically, treat web.dev as the more complete of the two sources as archived, not because it is more authoritative in principle (both are official docs) but purely because more of its text survived the fetch.

## 3. What to actually check when a CSP is present

- Rendering mode: is the site server-rendered (favor nonce-based) or a cached/static SPA (favor hash-based, scripts inlined)? Mismatch between rendering mode and CSP strategy is itself worth flagging, e.g. a hash-based policy on a server-rendered site that could use the simpler nonce approach.
- `strict-dynamic` presence: this is the mechanism web.dev's own example CSP uses to let a trusted, nonce-bearing script load further scripts without each one needing its own allowlisted origin. Its presence or absence matters directly for the GTM/tag-manager interaction covered in `guides/04-client-side-injection-and-vendor-crossreference.md`.
- `object-src 'none'` and `base-uri 'none'`: named in web.dev's own example policy alongside `script-src`; their absence from an otherwise-present CSP is a specific, evidence-backed finding, not a vague "could be stronger" note.
- Do not score CSP strength beyond what this archive documents. If a policy's actual effectiveness needs deeper evaluation than "nonce vs hash strategy matches rendering mode, plus the three directives above," say so as a gap requiring a dedicated CSP-evaluation pass (e.g. an actual CSP Evaluator run), rather than inventing a more granular scoring rubric this archive does not support.
