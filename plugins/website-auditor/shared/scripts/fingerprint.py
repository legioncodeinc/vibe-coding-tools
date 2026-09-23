#!/usr/bin/env python3
"""fingerprint.py

Deterministic, harness-portable stack and render-mode signature matcher for stack-fingerprint-stinger
(Drone: agents/stack-fingerprint-wasp-drone.md). Stdlib only, no absolute paths, safe to run from any
working directory per shared/scripts/README.md.

What this script does, and what it does not do:
  - It matches HTML body text, HTTP response headers, and cookie names against the signature table
    in SIGNATURES below, and emits a target-profile.json-shaped record (see
    skills/stack-fingerprint-stinger/references/templates/target-profile.template.json).
  - It optionally fetches a URL itself for the single-request channel (HTML + headers + cookies),
    using only the standard library, matching the "one HTTP request" method described in
    skills/stack-fingerprint-stinger/references/research/raw/dev-to-scrapemint-detect-any-websites-
    tech-stack-with-one-http-request-3opf.md.
  - It does NOT drive a headless browser itself. Executing a page's JavaScript (the single
    headless-browser load PRD-003 requires for render-mode confirmation) is a harness-specific
    capability the calling Drone performs with whatever browser-automation tool its harness exposes.
    Feed the resulting rendered HTML back into this script with --rendered-html-file to complete the
    render-mode comparison; without it, rendering is reported as "unknown-requires-headless-load"
    rather than guessed.

Grounding note: the signature table below marks each row's `grounded` field. `researched` rows trace
to the two raw sources in skills/stack-fingerprint-stinger/references/research/raw/, cited inline.
`judgment-call` rows are common public knowledge NOT present in that archive (the archive's own gap
note calls this out for React+Vite, SvelteKit specifically, and Magento) and must be reported to the
user at reduced confidence, per skills/stack-fingerprint-stinger/references/fingerprint-signature-
table.md, never upgraded to the same confidence as a researched, multi-channel match.

Usage:
    python3 shared/scripts/fingerprint.py --url https://example.com
    python3 shared/scripts/fingerprint.py --raw-html-file page.html --headers-file headers.json \
        --cookies-file cookies.json [--rendered-html-file rendered.html] --out target-profile.json

Exit code 0 on a completed run (including a classification of "unknown"); non-zero only on an
unrecoverable I/O/network error, which the caller should record as `reachable: false` and move on
rather than retrying into a block, per the same raw source's guidance.
"""
import argparse
import http.cookies
import json
import re
import sys
import urllib.request
from datetime import datetime, timezone

SCHEMA_VERSION = "1.0"

# ---------------------------------------------------------------------------------------------
# Signature table. One row per platform this Stinger is in scope to classify (PRD-003 goals).
# Channels: html (substring/regex against lowercased HTML body), header (header-name, pattern),
# cookie (substring against cookie names), meta_generator (substring against <meta name=generator>).
# `grounded: researched` cites a raw source. `grounded: judgment-call` does not and must be
# reported at capped confidence; see the guides for exactly how far to trust each row.
# ---------------------------------------------------------------------------------------------
SIGNATURES = [
    {
        "stack": "shopify",
        "platform": "Shopify",
        "grounded": "researched",
        "source": "raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md",
        "html": ["cdn.shopify.com"],
        "header": [("x-shopify-stage", None)],
        "cookie": [],
        "meta_generator": ["shopify"],
    },
    {
        "stack": "nextjs-postgres",
        "platform": "Next.js",
        "grounded": "researched",
        "source": "raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md; "
                   "raw/edgedns-dev-guides-domain-tech.md",
        "html": ["__next_data__", "/_next/static/", "/_next/"],
        "header": [],
        "cookie": [],
        "meta_generator": [],
    },
    {
        "stack": "wordpress-php-mysql",
        "platform": "WordPress",
        "grounded": "researched",
        "source": "raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md; "
                   "raw/edgedns-dev-guides-domain-tech.md",
        "html": ["/wp-content/", "/wp-admin/", "/wp-includes/"],
        "header": [],
        "cookie": [("phpsessid", None)],
        "meta_generator": ["wordpress"],
    },
    {
        # Research archive covers only generic Svelte (`data-sveltekit` attribute), not SvelteKit
        # specifically as a dedicated case study, per the distillation's gap note #8. Kept as
        # `researched` because the attribute itself is directly cited, but treat a lone match as
        # weaker evidence than a multi-channel Shopify/Next.js/WordPress match.
        "stack": "sveltekit-postgres",
        "platform": "SvelteKit",
        "grounded": "researched",
        "source": "raw/edgedns-dev-guides-domain-tech.md (generic Svelte marker, not a dedicated "
                   "SvelteKit case study)",
        "html": ["data-sveltekit"],
        "header": [],
        "cookie": [],
        "meta_generator": [],
    },
    {
        # No raw source documents a React+Vite signature at all (distillation gap note #8). These
        # are common public Vite build-output conventions, not researched fact. Any match here must
        # be reported at low confidence and flagged as a judgment call in the output.
        "stack": "react-vite-postgres",
        "platform": "React + Vite",
        "grounded": "judgment-call",
        "source": None,
        "html": ["/assets/index-", "type=\"module\" crossorigin"],
        "header": [],
        "cookie": [],
        "meta_generator": [],
    },
    {
        # No raw source documents Magento at all (distillation gap note #8). Common public Magento
        # conventions, not researched fact; same reduced-confidence handling as React+Vite above.
        "stack": "magento-php-mysql",
        "platform": "Magento",
        "grounded": "judgment-call",
        "source": None,
        "html": ["/skin/frontend/", "mage.cookies", "/static/version"],
        "header": [("x-magento-cache-debug", None)],
        "cookie": [("frontend", None)],
        "meta_generator": ["magento"],
    },
]

# Hosting/CDN headers, informational only, do not by themselves resolve `stack`. Researched:
# raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md,
# raw/edgedns-dev-guides-domain-tech.md
HOSTING_HEADER_HINTS = [
    ("cf-ray", "Cloudflare"),
    ("x-vercel-id", "Vercel"),
    ("x-nf-request-id", "Netlify"),
    ("x-amz-cf-id", "CloudFront"),
    ("x-served-by", "Fastly (or similar edge cache)"),
]

# Stack id -> the build-plan-section-6 platform crawl guide site-crawler-wasp-drone selects next,
# per PRD-003 AC-3. Kept here so a downstream reader of target-profile.json does not have to
# re-derive the mapping.
PLATFORM_GUIDE_MAP = {
    "react-vite-postgres": "shared/platform-guides/platform-vibe-react-vite.md",
    "nextjs-postgres": "shared/platform-guides/platform-vibe-nextjs.md",
    "sveltekit-postgres": "shared/platform-guides/platform-vibe-sveltekit.md",
    "wordpress-php-mysql": "shared/platform-guides/platform-cms-wordpress.md",
    "shopify": "shared/platform-guides/platform-ecom-shopify.md",
    "magento-php-mysql": "shared/platform-guides/platform-ecom-magento.md",
    "unknown": None,
}


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; WebsiteAuditor/1.0)"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        html = resp.read().decode("utf-8", errors="replace")
        headers = {k.lower(): v for k, v in resp.getheaders()}
        cookie_jar = http.cookies.SimpleCookie()
        for raw_cookie in resp.headers.get_all("Set-Cookie") or []:
            try:
                cookie_jar.load(raw_cookie)
            except Exception:
                pass
        cookies = list(cookie_jar.keys())
        return html, headers, cookies


def match_signature(sig, html_lower, headers_lower, cookie_names_lower):
    hits = []
    for needle in sig["html"]:
        if needle.lower() in html_lower:
            hits.append({"channel": "html", "signal": needle})
    for header_name, pattern in sig["header"]:
        if header_name in headers_lower:
            if pattern is None or re.search(pattern, headers_lower[header_name], re.I):
                hits.append({"channel": "header", "signal": header_name})
    for cookie_needle, _ in sig["cookie"]:
        for c in cookie_names_lower:
            if cookie_needle in c:
                hits.append({"channel": "cookie", "signal": cookie_needle})
                break
    gen_match = re.search(r'<meta[^>]+name=["\']generator["\'][^>]*content=["\']([^"\']+)', html_lower)
    if gen_match:
        for needle in sig["meta_generator"]:
            if needle in gen_match.group(1):
                hits.append({"channel": "meta_generator", "signal": needle})
    return hits


def confidence_for(hits, grounded):
    """Edge-DNS-style channel-family weighting (raw/edgedns-dev-guides-domain-tech.md): more
    independently-matched channel families raises confidence. A judgment-call signature is capped
    at 'low' regardless of hit count, since it was never independently corroborated by research."""
    families = {h["channel"] for h in hits}
    if grounded == "judgment-call":
        return "low"
    if len(families) >= 2:
        return "high"
    if len(families) == 1:
        return "medium"
    return "low"


def classify_stack(html, headers, cookies):
    html_lower = html.lower()
    headers_lower = {k.lower(): v for k, v in headers.items()}
    cookie_names_lower = [c.lower() for c in cookies]

    results = []
    for sig in SIGNATURES:
        hits = match_signature(sig, html_lower, headers_lower, cookie_names_lower)
        if hits:
            results.append({
                "stack": sig["stack"],
                "platform": sig["platform"],
                "grounded": sig["grounded"],
                "source": sig["source"],
                "hits": hits,
                "confidence": confidence_for(hits, sig["grounded"]),
            })

    hosting_hints = [label for name, label in HOSTING_HEADER_HINTS if name in headers_lower]

    if not results:
        return {
            "stack": "unknown",
            "platform": "unknown",
            "confidence": "low",
            "hosting_hints": hosting_hints,
            "raw_signals": {
                "html_length": len(html),
                "header_names": sorted(headers_lower.keys()),
                "cookie_names": sorted(set(cookie_names_lower)),
            },
        }

    # Highest-confidence match wins; tie broken by researched-over-judgment-call, then by hit count.
    order = {"high": 3, "medium": 2, "low": 1}
    results.sort(key=lambda r: (order[r["confidence"]], r["grounded"] == "researched", len(r["hits"])),
                 reverse=True)
    best = results[0]
    return {
        "stack": best["stack"],
        "platform": best["platform"],
        "confidence": best["confidence"],
        "grounded": best["grounded"],
        "evidence": best["hits"],
        "source": best["source"],
        "hosting_hints": hosting_hints,
        "other_candidates": [r["stack"] for r in results[1:]],
    }


def detect_render_mode(raw_html, rendered_html):
    """PRD-003: render mode is determined from response body plus a single headless-browser load,
    never from documentation claims. Neither raw source in this Stinger's research archive documents
    a render-mode detection methodology directly (distilled-stack-fingerprint.md section 2 notes the
    implication but not a worked procedure), so this comparison heuristic is an explicit judgment
    call: it compares visible-text density in the raw single-request HTML against the rendered HTML
    from the headless load. Report at reduced confidence accordingly, never as a confirmed fact."""
    if rendered_html is None:
        return {"rendering": "unknown-requires-headless-load", "confidence": "low",
                "note": "No --rendered-html-file supplied; a single headless-browser load has not "
                         "run yet for this target. Do not report a render mode until it has."}

    def visible_text_len(html):
        text = re.sub(r"<script[^>]*>.*?</script>", " ", html, flags=re.S | re.I)
        text = re.sub(r"<style[^>]*>.*?</style>", " ", text, flags=re.S | re.I)
        text = re.sub(r"<[^>]+>", " ", text)
        return len(re.sub(r"\s+", " ", text).strip())

    raw_len = visible_text_len(raw_html)
    rendered_len = visible_text_len(rendered_html)
    if rendered_len == 0:
        return {"rendering": "unknown-requires-headless-load", "confidence": "low",
                "note": "Rendered HTML had no extractable visible text; re-run the headless load."}

    ratio = raw_len / rendered_len
    if ratio >= 0.85:
        return {"rendering": "ssr", "confidence": "medium",
                "note": f"Raw single-request HTML carries {ratio:.0%} of the rendered visible-text "
                         "volume; most content was present before JS executed."}
    if ratio <= 0.25:
        return {"rendering": "csr", "confidence": "medium",
                "note": f"Raw single-request HTML carries only {ratio:.0%} of the rendered "
                         "visible-text volume; content was materially hydrated by JS."}
    return {"rendering": "hybrid", "confidence": "low",
            "note": f"Raw single-request HTML carries {ratio:.0%} of the rendered visible-text "
                     "volume, neither clearly SSR nor clearly CSR by this heuristic; report as "
                     "hybrid/other and let a human confirm."}


def build_profile(url, html, headers, cookies, rendered_html):
    stack_result = classify_stack(html, headers, cookies)
    render_result = detect_render_mode(html, rendered_html)
    profile = {
        "schema_version": SCHEMA_VERSION,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "generated_by": "stack-fingerprint-wasp-drone",
        "target_url": url,
        "reachable": True,
        "stack": stack_result["stack"],
        "platform": stack_result["platform"],
        "rendering": render_result["rendering"],
        "confidence": {
            "stack": stack_result["confidence"],
            "rendering": render_result["confidence"],
        },
        "evidence": stack_result.get("evidence", []),
        "grounded": stack_result.get("grounded"),
        "hosting_hints": stack_result.get("hosting_hints", []),
        "platform_guide": PLATFORM_GUIDE_MAP.get(stack_result["stack"]),
        "rendering_note": render_result["note"],
    }
    if stack_result["stack"] == "unknown":
        profile["raw_signals"] = stack_result["raw_signals"]
    if stack_result.get("other_candidates"):
        profile["other_candidates"] = stack_result["other_candidates"]
    return profile


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--url", help="Fetch this URL live for the single-request channel.")
    parser.add_argument("--raw-html-file", help="Path to already-captured raw HTML instead of --url.")
    parser.add_argument("--headers-file", help="Path to a JSON object of response headers.")
    parser.add_argument("--cookies-file", help="Path to a JSON array of cookie names.")
    parser.add_argument("--rendered-html-file", help="Path to HTML captured after a single "
                         "headless-browser load, for render-mode comparison.")
    parser.add_argument("--out", help="Write the target-profile.json-shaped result here instead of "
                         "stdout.")
    args = parser.parse_args()

    if args.url:
        try:
            html, headers, cookies = fetch(args.url)
        except Exception as exc:
            result = {
                "schema_version": SCHEMA_VERSION,
                "generated_at": datetime.now(timezone.utc).isoformat(),
                "generated_by": "stack-fingerprint-wasp-drone",
                "target_url": args.url,
                "reachable": False,
                "stack": "unknown",
                "platform": "unknown",
                "rendering": "unknown-requires-headless-load",
                "confidence": {"stack": "low", "rendering": "low"},
                "error": str(exc),
            }
            print(json.dumps(result, indent=2))
            return 0
        url = args.url
    elif args.raw_html_file:
        with open(args.raw_html_file, encoding="utf-8") as f:
            html = f.read()
        headers = json.load(open(args.headers_file, encoding="utf-8")) if args.headers_file else {}
        cookies = json.load(open(args.cookies_file, encoding="utf-8")) if args.cookies_file else []
        url = args.raw_html_file
    else:
        parser.error("Provide either --url or --raw-html-file.")
        return 2

    rendered_html = None
    if args.rendered_html_file:
        with open(args.rendered_html_file, encoding="utf-8") as f:
            rendered_html = f.read()

    profile = build_profile(url, html, headers, cookies, rendered_html)
    output = json.dumps(profile, indent=2)
    if args.out:
        with open(args.out, "w", encoding="utf-8") as f:
            f.write(output + "\n")
    else:
        print(output)
    return 0


if __name__ == "__main__":
    sys.exit(main())
