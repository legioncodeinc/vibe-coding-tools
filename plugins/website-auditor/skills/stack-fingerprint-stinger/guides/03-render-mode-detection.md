# 03. Render-mode detection

How `rendering` (`ssr` / `csr` / `hybrid` / `other` / `unknown-requires-headless-load`) is decided.

## Honesty note before anything else

Neither raw source in this Stinger's research archive documents a render-mode detection methodology
directly. The EdgeDNS source names the JavaScript-globals evidence channel generally
(`window.jQuery`, `window.React`, `window.dataLayer`, `ng-version`, `__NEXT_DATA__`, `__vue_app__`)
[raw/edgedns-dev-guides-domain-tech.md], and the dev.to source frames a single-HTTP-request fetch as
strictly unable to see fully client-rendered pages' HTML-level signatures
[raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md], but neither
source states this Stinger's specific landing-page-only render-mode boundary or a worked comparison
procedure. The visible-text-ratio heuristic below is therefore an explicit judgment call, grounded
only in PRD-003's own requirement wording ("from response body plus a single headless-browser load"),
not in the research archive. Report render mode at capped confidence and say so.

## The procedure

1. Capture the raw single-request HTML (`guides/01-fetch-and-collect-signals.md` step 1).
2. Run the one permitted headless-browser load for this Stinger (same guide, step 3) and capture the
   fully rendered DOM as HTML.
3. Run:

```
python3 shared/scripts/fingerprint.py \
  --raw-html-file page.html --rendered-html-file rendered.html --out target-profile.json
```

4. `fingerprint.py`'s `detect_render_mode()` strips `<script>`/`<style>`/tags from both HTML
   captures, measures visible-text length in each, and compares the ratio:

| Raw-vs-rendered visible-text ratio | Call | Confidence |
|---|---|---|
| >= 85% | `ssr` | medium |
| <= 25% | `csr` | medium |
| between 25% and 85% | `hybrid` | low, flagged for human confirmation |
| no `--rendered-html-file` supplied | `unknown-requires-headless-load` | low |

## Never report a render mode without the headless load

`rendering` must never be set to `ssr` or `csr` purely from documentation claims about the platform
("Next.js sites are SSR" is not evidence for this specific site, it could be statically exported or
running in a CSR-heavy client-component tree). If the headless load has not happened yet this
session, `rendering` is `unknown-requires-headless-load`, a legitimate value, not a placeholder to
be silently filled in with a guess.

## What "hybrid" actually means here

A ratio landing between the two thresholds most often means a server-rendered shell with a
significant client-hydrated section (common on Next.js App Router pages mixing server and client
components, or a WordPress theme with a heavily client-rendered widget). Report it as `hybrid` with
the measured ratio in the narrative, rather than forcing a binary ssr/csr call the evidence does not
support.
