#!/usr/bin/env python3
"""vendor-census.py

Deterministic, harness-portable third-party vendor classifier for vendor-inventory-stinger
(Drone: agents/vendor-inventory-wasp-drone.md). Stdlib only, no absolute paths, safe to run from any
working directory per shared/scripts/README.md.

What this script does, and what it does not do:
  - It classifies already-captured evidence (a list of network request URLs, a list of DOM script
    `src` attributes, and/or the raw page HTML) against the vendor lookup table in VENDOR_SIGNATURES
    below, and against the GTM signature set researched for this Stinger, and emits one row per
    matched vendor plus a dedicated Google Tag Manager section and a dedicated content-injection/
    metadata-manipulation section, per PRD-004's goals.
  - It does NOT drive a headless browser itself and does NOT execute JavaScript. PRD-004 requires
    "a real headless-browser load" so that anything Google Tag Manager hydrates at runtime is
    visible; that load, and the resulting network-request log and rendered DOM, come from whatever
    browser-automation tool the calling Drone's harness exposes. Feed the captured evidence into this
    script via --network-log-file / --dom-scripts-file / --html-file; a run against static HTML
    only, with no network log, will under-report per the GTM research (a container detection alone
    does not surface what it dispatches) and this script labels that run "static-only" so the
    shortfall is visible in the output, not silently absorbed.

Grounding note: VENDOR_SIGNATURES rows carry a `grounded` field. `researched` rows trace to the two
raw sources in skills/vendor-inventory-stinger/references/research/raw/, cited inline. `judgment-
call` rows are common public vendor domains NOT present in that archive; the archive explicitly
notes it has no fingerprinting signature at all for the OTTO Pixel itself (gap note, section 7), so
the Search Atlas row below is a best-effort domain heuristic that MUST be reported as
"candidate, needs manual confirmation," never as a confirmed detection.

Usage:
    python3 shared/scripts/vendor-census.py \
        --network-log-file requests.json \
        --dom-scripts-file scripts.json \
        --html-file rendered.html \
        --out vendor-census.json
"""
import argparse
import json
import re
import sys
from datetime import datetime, timezone

SCHEMA_VERSION = "1.0"

# ---------------------------------------------------------------------------------------------
# Vendor lookup table. `category` follows PRD-004's fixed function taxonomy: analytics,
# tag-manager, chat, payments, cro-testing, seo-injection, ads, consent-cmp, other.
# `match`: substrings tested against request URLs, script src attributes, and raw HTML (all
# lowercased first). `grounded`: researched rows cite a raw source; judgment-call rows are common
# public vendor domains not present in this Stinger's research archive and must be reported with
# that caveat attached, never silently presented at the same confidence as a researched row.
# ---------------------------------------------------------------------------------------------
VENDOR_SIGNATURES = [
    {
        "vendor": "Google Tag Manager",
        "category": "tag-manager",
        "grounded": "researched",
        "source": "raw/sme-mapree-dev-stack-tech-google-tag-manager.md",
        "match": ["googletagmanager.com/gtm.js", "googletagmanager.com"],
        "js_global": ["window.google_tag_data", "window.google_tag_manager", "window.googletag"],
        "html_pattern": [r"googletagmanager\.com/ns\.html[^>]+></iframe>",
                          r"<!--\s*(?:End )?Google Tag Manager\s*-->"],
    },
    {
        "vendor": "Search Atlas OTTO Pixel",
        "category": "seo-injection",
        "grounded": "judgment-call",
        "source": "raw/searchatlas-com-otto-pixel.md (vendor's own product page; no fingerprinting "
                   "signature is documented there, gap note section 7 of the distillation, so this "
                   "domain-substring heuristic is NOT itself researched, only the vendor's own "
                   "description of what the pixel does once installed is)",
        "match": ["searchatlas.com", "otto-pixel", "ottopixel"],
        "js_global": [],
        "html_pattern": [],
        "flag_as": "content-injection",
    },
    {
        "vendor": "Adobe Launch",
        "category": "tag-manager",
        "grounded": "researched",
        "source": "raw/sme-mapree-dev-stack-tech-google-tag-manager.md (named for comparison, not "
                   "detailed; distillation section 4)",
        "match": ["assets.adobedtm.com"],
        "js_global": ["window._satellite"],
        "html_pattern": [],
    },
    {
        "vendor": "Tealium",
        "category": "tag-manager",
        "grounded": "researched",
        "source": "raw/sme-mapree-dev-stack-tech-google-tag-manager.md (named for comparison, not "
                   "detailed; distillation section 4)",
        "match": ["utag.js"],
        "js_global": [],
        "html_pattern": [],
    },
    # Everything below is common public vendor-domain knowledge, NOT present in this Stinger's
    # research archive (which covers only GTM and Search Atlas in any depth). Included because
    # PRD-004 requires a full census across analytics/chat/payments/CRO/ads/consent, and an empty
    # table for those categories would silently under-serve the acceptance criteria. Every row is
    # `judgment-call` and must be reported as such, never presented as researched fact.
    {"vendor": "Google Analytics (GA4)", "category": "analytics", "grounded": "judgment-call",
     "source": None, "match": ["googletagmanager.com/gtag/js", "google-analytics.com/g/collect",
                                "google-analytics.com/analytics.js"], "js_global": ["window.gtag",
     "window.ga"], "html_pattern": []},
    {"vendor": "Meta Pixel", "category": "ads", "grounded": "judgment-call", "source": None,
     "match": ["connect.facebook.net", "facebook.com/tr"], "js_global": ["window.fbq"],
     "html_pattern": []},
    {"vendor": "LinkedIn Insight Tag", "category": "ads", "grounded": "judgment-call", "source": None,
     "match": ["snap.licdn.com"], "js_global": ["window._linkedin_data_partner_ids"],
     "html_pattern": []},
    {"vendor": "TikTok Pixel", "category": "ads", "grounded": "judgment-call", "source": None,
     "match": ["analytics.tiktok.com"], "js_global": ["window.ttq"], "html_pattern": []},
    {"vendor": "HubSpot", "category": "other", "grounded": "researched",
     "source": "raw/dev-to-scrapemint-detect-any-websites-tech-stack-with-one-http-request-3opf.md "
                "(cited as an example signature in the stack-fingerprint archive, not this "
                "Stinger's own; carried over because it is a directly-cited vendor domain)",
     "match": ["js.hs-scripts.com", "js.hubspot.com"], "js_global": ["window._hsq"],
     "html_pattern": []},
    {"vendor": "Intercom", "category": "chat", "grounded": "judgment-call", "source": None,
     "match": ["widget.intercom.io", "js.intercomcdn.com"], "js_global": ["window.Intercom"],
     "html_pattern": []},
    {"vendor": "Drift", "category": "chat", "grounded": "judgment-call", "source": None,
     "match": ["js.driftt.com"], "js_global": ["window.drift"], "html_pattern": []},
    {"vendor": "Stripe", "category": "payments", "grounded": "judgment-call", "source": None,
     "match": ["js.stripe.com"], "js_global": ["window.Stripe"], "html_pattern": []},
    {"vendor": "PayPal", "category": "payments", "grounded": "judgment-call", "source": None,
     "match": ["paypal.com/sdk/js"], "js_global": ["window.paypal"], "html_pattern": []},
    {"vendor": "Optimizely", "category": "cro-testing", "grounded": "judgment-call", "source": None,
     "match": ["cdn.optimizely.com"], "js_global": ["window.optimizely"], "html_pattern": []},
    {"vendor": "VWO", "category": "cro-testing", "grounded": "judgment-call", "source": None,
     "match": ["dev.visualwebsiteoptimizer.com"], "js_global": ["window.VWO"], "html_pattern": []},
    {"vendor": "Hotjar", "category": "cro-testing", "grounded": "judgment-call", "source": None,
     "match": ["static.hotjar.com"], "js_global": ["window.hj"], "html_pattern": []},
    {"vendor": "OneTrust", "category": "consent-cmp", "grounded": "judgment-call", "source": None,
     "match": ["cdn.cookielaw.org", "onetrust.com"], "js_global": ["window.OneTrust"],
     "html_pattern": []},
    {"vendor": "Cookiebot", "category": "consent-cmp", "grounded": "judgment-call", "source": None,
     "match": ["consent.cookiebot.com"], "js_global": ["window.Cookiebot"], "html_pattern": []},
]

FUNCTION_CATEGORIES = ["analytics", "tag-manager", "chat", "payments", "cro-testing",
                        "seo-injection", "ads", "consent-cmp", "other"]


def _lower_all(items):
    return [str(i).lower() for i in items]


def classify(network_urls, dom_script_srcs, html, static_only):
    html_lower = (html or "").lower()
    haystacks_url = _lower_all((network_urls or []) + (dom_script_srcs or []))

    results = []
    for sig in VENDOR_SIGNATURES:
        evidence = []
        for needle in sig["match"]:
            for haystack in haystacks_url:
                if needle in haystack:
                    evidence.append({"channel": "request-or-script-src", "signal": needle,
                                      "matched": haystack})
                    break
        for needle in sig.get("html_pattern", []):
            if re.search(needle, html_lower):
                evidence.append({"channel": "html-pattern", "signal": needle})
        # js_global entries cannot be confirmed from static evidence alone; recorded as a
        # supplementary note only when other evidence already fired, never as sole evidence, since
        # confirming a JS global requires the actual executed page, not this script.
        if evidence and sig.get("js_global"):
            evidence.append({"channel": "js-global-expected-not-confirmed-by-this-script",
                              "signal": sig["js_global"]})
        if evidence:
            confidence = "low" if sig["grounded"] == "judgment-call" else (
                "high" if len({e["channel"] for e in evidence}) >= 2 else "medium")
            row = {
                "vendor": sig["vendor"],
                "category": sig["category"],
                "grounded": sig["grounded"],
                "source": sig["source"],
                "confidence": confidence,
                "evidence": evidence,
            }
            if sig.get("flag_as"):
                row["flag_as"] = sig["flag_as"]
                row["verification_status"] = "candidate, needs manual confirmation"
            results.append(row)

    gtm_row = next((r for r in results if r["vendor"] == "Google Tag Manager"), None)
    gtm_present = gtm_row is not None

    return {
        "schema_version": SCHEMA_VERSION,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "generated_by": "vendor-inventory-wasp-drone",
        "capture_mode": "static-only" if static_only else "js-executed-headless-load",
        "capture_caveat": (
            "No network request log was supplied; per raw/sme-mapree-dev-stack-tech-google-tag-"
            "manager.md, a GTM container detected from static HTML alone under-reports the vendors "
            "it hydrates at runtime. This census should be re-run with --network-log-file from a "
            "real JS-executed page load before being treated as complete." if static_only else None
        ),
        "gtm_detected": gtm_present,
        "gtm_hydration_note": (
            "GTM is present. Its own signature alone does not enumerate what it loads at runtime; "
            "cross-reference every other vendor in this census against the same page load rather "
            "than assuming GTM's presence explains them away, per raw/sme-mapree-dev-stack-tech-"
            "google-tag-manager.md ('whatever else is tracking the user is very likely being "
            "loaded through it')." if gtm_present else None
        ),
        "content_injection_flags": [r for r in results if r.get("flag_as") == "content-injection"],
        "vendors": results,
        "vendors_by_category": {
            cat: [r["vendor"] for r in results if r["category"] == cat]
            for cat in FUNCTION_CATEGORIES if any(r["category"] == cat for r in results)
        },
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--network-log-file", help="JSON array of request URLs captured during a "
                         "real JS-executed headless-browser load.")
    parser.add_argument("--dom-scripts-file", help="JSON array of <script src> values from the "
                         "rendered DOM.")
    parser.add_argument("--html-file", help="Path to the rendered page HTML (post-JS-execution "
                         "preferred; raw HTML accepted for a degraded static-only pass).")
    parser.add_argument("--out", help="Write the vendor-census.json-shaped result here instead of "
                         "stdout.")
    args = parser.parse_args()

    network_urls = json.load(open(args.network_log_file, encoding="utf-8")) if args.network_log_file else None
    dom_scripts = json.load(open(args.dom_scripts_file, encoding="utf-8")) if args.dom_scripts_file else None
    html = open(args.html_file, encoding="utf-8").read() if args.html_file else None
    static_only = network_urls is None

    result = classify(network_urls, dom_scripts, html, static_only)
    output = json.dumps(result, indent=2)
    if args.out:
        with open(args.out, "w", encoding="utf-8") as f:
            f.write(output + "\n")
    else:
        print(output)
    return 0


if __name__ == "__main__":
    sys.exit(main())
