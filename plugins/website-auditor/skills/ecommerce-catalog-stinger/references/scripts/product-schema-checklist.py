#!/usr/bin/env python3
"""product-schema-checklist.py

Deterministic schema.org Product field-completeness checker for
ecommerce-catalog-wasp-drone (wave W6b, conditional).

The required/recommended field lists below are transcribed verbatim from
this Stinger's own distilled research, section 3 ("Structured-data
(schema.org Product / Google) required vs. recommended fields"):
`references/research/distilled-ecommerce-catalog.md`, itself citing
[raw/patrickstox-com-technical-seo-on-page-structured-data-commerce-product-schema.md]
and [raw/www-anglera-com-blog-enriched-data-to-page-checklist.md], with
property definitions corroborated against
[raw/schema-org-product.md]. Do not add or remove a field from these lists
without updating the distilled research file first and citing the source -
this script's output is only as trustworthy as that list.

Google splits Product markup eligibility into two surfaces that share the
same vocabulary: "product snippet" (lighter requirements) and "merchant
listing" (stricter, full shopping detail). This script checks both and
reports them separately, since a product can pass one and fail the other.

What this script checks (quantified, deterministic):
    - Presence of each required/recommended Product-level and Offer-level
      property in a page's JSON-LD.
    - The single-product scoping rule (a Product block should describe one
      product or one product's variants, not a category/listing page).

What this script does NOT check (left to the Drone's own reasoning, per this
Stinger's [subjective]/quantified separation rule):
    - On-page copy quality, conversion architecture, image quality, alt
      text quality, or anything requiring human judgment.
    - Whether the JSON-LD values are TRUTHFUL (match what a shopper
      actually sees on the rendered page) - that reconciliation is a guide
      step (guides/02-metadata-completeness-scoring.md), not something this
      script can verify from a single JSON-LD blob.
    - Cross-system identifier consistency against a Merchant Center feed or
      checkout - out of scope for a static-page checker.

No third-party dependencies. Stdlib only. No absolute paths.

Usage:
    # Check every crawled page in site-data/ that carries Product JSON-LD:
    python3 product-schema-checklist.py --site-data /path/to/site-data --out /path/to/12-ecommerce/schema-completeness.json

    # Check a single already-extracted JSON-LD file:
    python3 product-schema-checklist.py --jsonld-file product.json
"""

import argparse
import json
import re
import sys
from pathlib import Path

# --- Verbatim from distilled-ecommerce-catalog.md section 3 -----------------

PRODUCT_FIELDS = {
    # field: (product_snippet_requirement, merchant_listing_requirement)
    "name": ("required", "required"),
    "image": ("recommended", "required"),
    "offers": ("required_or_alt", "required"),  # snippet: one of offers/review/aggregateRating
    "description": ("recommended", "recommended"),
    "sku": ("recommended", "recommended"),
    "gtin": ("recommended", "recommended"),  # generalizes gtin8/12/13/14, or mpn
    "brand": ("recommended", "recommended"),
    "aggregateRating": ("required_or_alt", "recommended"),
    "review": ("required_or_alt", "recommended"),
}

OFFER_FIELDS = {
    "price": ("required", "required"),
    "priceCurrency": ("recommended", "required"),
    "availability": ("recommended", "recommended"),
    "priceValidUntil": ("recommended", "recommended"),
    "itemCondition": ("recommended", "recommended"),
    "hasMerchantReturnPolicy": ("not_listed", "recommended"),
    "shippingDetails": ("not_listed", "recommended"),
    "url": ("recommended", "recommended"),
}

# The snippet surface accepts name + ANY ONE of these three as sufficient
# for the "required_or_alt" group (patrickstox.com, corroborated by Anglera).
SNIPPET_EITHER_OR_GROUP = ["offers", "review", "aggregateRating"]

SOURCE_NOTE = (
    "[raw/patrickstox-com-technical-seo-on-page-structured-data-commerce-product-schema.md] "
    "[raw/www-anglera-com-blog-enriched-data-to-page-checklist.md] "
    "[raw/schema-org-product.md]"
)

JSONLD_BLOCK_PATTERN = re.compile(
    r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
    re.IGNORECASE | re.DOTALL,
)


def find_product_nodes(parsed):
    """Yield every dict in `parsed` (JSON-LD, possibly @graph/array-nested)
    whose @type is or includes 'Product'."""
    if isinstance(parsed, list):
        for item in parsed:
            yield from find_product_nodes(item)
        return
    if not isinstance(parsed, dict):
        return
    type_val = parsed.get("@type")
    types = type_val if isinstance(type_val, list) else [type_val]
    if types and "Product" in types:
        yield parsed
    if "@graph" in parsed:
        yield from find_product_nodes(parsed["@graph"])


def extract_jsonld_blocks(html_text):
    blocks = []
    for match in JSONLD_BLOCK_PATTERN.finditer(html_text):
        raw = match.group(1).strip()
        try:
            blocks.append(json.loads(raw))
        except json.JSONDecodeError:
            continue
    return blocks


def check_offer(offer):
    if isinstance(offer, list):
        # Multiple offers (e.g. per-variant); check each, report the union
        # of missing fields only if EVERY offer is missing it.
        results = [check_offer(o) for o in offer if isinstance(o, dict)]
        if not results:
            return {"missing_required": list(OFFER_FIELDS.keys()), "missing_recommended": []}
        missing_required = set(results[0]["missing_required"])
        missing_recommended = set(results[0]["missing_recommended"])
        for r in results[1:]:
            missing_required &= set(r["missing_required"])
            missing_recommended &= set(r["missing_recommended"])
        return {"missing_required": sorted(missing_required), "missing_recommended": sorted(missing_recommended)}

    offer = offer or {}
    missing_required = {"product_snippet": [], "merchant_listing": []}
    missing_recommended = {"product_snippet": [], "merchant_listing": []}
    for field, (snippet_req, listing_req) in OFFER_FIELDS.items():
        present = field in offer and offer[field] not in (None, "", [])
        if present:
            continue
        if snippet_req == "required":
            missing_required["product_snippet"].append(field)
        elif snippet_req == "recommended":
            missing_recommended["product_snippet"].append(field)
        if listing_req == "required":
            missing_required["merchant_listing"].append(field)
        elif listing_req == "recommended":
            missing_recommended["merchant_listing"].append(field)
    return {"missing_required": missing_required, "missing_recommended": missing_recommended}


def check_product(node):
    findings = {
        "missing_required": {"product_snippet": [], "merchant_listing": []},
        "missing_recommended": {"product_snippet": [], "merchant_listing": []},
        "notes": [],
    }

    for field, (snippet_req, listing_req) in PRODUCT_FIELDS.items():
        present = field in node and node[field] not in (None, "", [])
        if snippet_req == "required" and not present:
            findings["missing_required"]["product_snippet"].append(field)
        elif snippet_req == "recommended" and not present:
            findings["missing_recommended"]["product_snippet"].append(field)
        if listing_req == "required" and not present:
            findings["missing_required"]["merchant_listing"].append(field)
        elif listing_req == "recommended" and not present:
            findings["missing_recommended"]["merchant_listing"].append(field)

    # Snippet's either/or group: satisfied if AT LEAST ONE of offers/review/
    # aggregateRating is present. Only flag as missing-required if none are.
    either_or_satisfied = any(
        node.get(f) not in (None, "", []) for f in SNIPPET_EITHER_OR_GROUP
    )
    if not either_or_satisfied:
        findings["missing_required"]["product_snippet"].append(
            "offers|review|aggregateRating (at least one required)"
        )
        findings["notes"].append(
            "product_snippet surface requires at least one of offers/review/aggregateRating; none present"
        )

    # offers is required outright (no either/or) for merchant_listing per
    # the distilled research - already covered by the field loop above.

    if "offers" in node and node["offers"] not in (None, "", []):
        offer_result = check_offer(node["offers"])
        for surface in ("product_snippet", "merchant_listing"):
            findings["missing_required"][surface].extend(
                f"offers.{f}" for f in offer_result["missing_required"][surface]
            )
            findings["missing_recommended"][surface].extend(
                f"offers.{f}" for f in offer_result["missing_recommended"][surface]
            )

    return findings


def _required_total(surface):
    """Count of literally-required fields for a surface, across product-
    level and offer-level tables, plus 1 for the product_snippet
    either/or group (offers/review/aggregateRating) where that applies."""
    index = 0 if surface == "product_snippet" else 1
    total = sum(1 for req in PRODUCT_FIELDS.values() if req[index] == "required")
    total += sum(1 for req in OFFER_FIELDS.values() if req[index] == "required")
    if surface == "product_snippet":
        total += 1  # the either/or group itself
    return total


def score(findings, surface):
    total_required = _required_total(surface)
    missing = len(findings["missing_required"][surface])
    present = max(total_required - missing, 0)
    return f"{present}/{total_required} required fields present"


def audit_html_file(html_path):
    html_text = html_path.read_text(encoding="utf-8", errors="ignore")
    blocks = extract_jsonld_blocks(html_text)
    results = []
    for block in blocks:
        for node in find_product_nodes(block):
            findings = check_product(node)
            results.append(
                {
                    "page": str(html_path),
                    "product_name": node.get("name", "(no name field present)"),
                    "findings": findings,
                    "score": {
                        "product_snippet": score(findings, "product_snippet"),
                        "merchant_listing": score(findings, "merchant_listing"),
                    },
                    "source": SOURCE_NOTE,
                }
            )
    return results


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--site-data", help="Directory of crawled *.html pages to scan for Product JSON-LD")
    group.add_argument("--jsonld-file", help="Single JSON-LD file to check (top-level object or array)")
    parser.add_argument("--out", default=None, help="Write JSON here instead of stdout")
    args = parser.parse_args()

    all_results = []
    if args.site_data:
        site_data_dir = Path(args.site_data)
        if not site_data_dir.is_dir():
            print(json.dumps({"error": f"--site-data path does not exist or is not a directory: {site_data_dir}"}))
            sys.exit(1)
        for html_path in sorted(site_data_dir.glob("*.html")):
            all_results.extend(audit_html_file(html_path))
    else:
        jsonld_path = Path(args.jsonld_file)
        parsed = json.loads(jsonld_path.read_text(encoding="utf-8"))
        for node in find_product_nodes(parsed):
            findings = check_product(node)
            all_results.append(
                {
                    "page": str(jsonld_path),
                    "product_name": node.get("name", "(no name field present)"),
                    "findings": findings,
                    "score": {
                        "product_snippet": score(findings, "product_snippet"),
                        "merchant_listing": score(findings, "merchant_listing"),
                    },
                    "source": SOURCE_NOTE,
                }
            )

    output = json.dumps({"generated_by": "product-schema-checklist.py", "products_checked": len(all_results), "results": all_results}, indent=2)
    if args.out:
        Path(args.out).write_text(output, encoding="utf-8")
    else:
        print(output)


if __name__ == "__main__":
    main()
