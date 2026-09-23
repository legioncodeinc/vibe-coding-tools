#!/usr/bin/env python3
"""Deduplicate a captured vendor ledger and compute run rates by confidence.

Why this exists: OCR of a billing dashboard repeats lines, and the run-rate arithmetic
crosses four billing cadences and three confidence tiers. Both are deterministic, both
are easy to get subtly wrong by hand, and a wrong headline number is the main way this
audit loses trust.

What it does NOT do: decide anything. It does not guess a cadence, infer a price,
canonicalize a vendor name it was not told about, or promote a confidence rating. Every
judgment stays with the model and the user.

Input: a JSON array of candidate ledger lines on stdin or at a path.

    [
      {
        "vendor": "SUPABASE PRO",
        "amount": 700.19,
        "currency": "USD",
        "cadence": "monthly",
        "amount_confidence": "High",
        "cadence_confidence": "High",
        "charge_date": "2026-07-30",
        "evidence": "[Thursday, July 30, 2026 08:12 EDT | chrome]"
      }
    ]

Optional per-line keys: product, instrument, usage_verdict, status, next_charge.

Usage:

    python3 ledger_math.py candidates.json
    python3 ledger_math.py candidates.json --aliases aliases.json
    cat candidates.json | python3 ledger_math.py -

The aliases file maps a canonical vendor name to the observed variants:

    {"Supabase": ["SUPABASE PRO", "Supabase Inc", "supabase.com"]}

Output: JSON on stdout with deduplicated lines, collapse counts, run-rate totals split
by confidence, and an exceptions block listing everything excluded from the totals and
why. Read the exceptions block. It is the honest part.
"""

import argparse
import json
import re
import sys
from collections import defaultdict

CADENCE_TO_MONTHLY = {
    "monthly": 1.0,
    "annual": 1.0 / 12.0,
    "yearly": 1.0 / 12.0,
    "quarterly": 1.0 / 3.0,
    "weekly": 52.0 / 12.0,
}

# Cadences that carry no recurring monthly meaning.
NON_RECURRING = {"one-time", "onetime", "unknown", ""}

CONFIDENCE_ORDER = {"high": 3, "medium": 2, "low": 1, "unknown": 0}


def norm_key(name):
    """Normalize a vendor string for grouping. Lowercase, strip punctuation and
    common corporate suffixes and TLDs. Conservative on purpose: this collapses
    obvious OCR and casing variants, not genuinely different names."""
    s = (name or "").strip().lower()
    s = re.sub(r"https?://", "", s)
    s = re.sub(r"\bwww\.", "", s)
    s = re.sub(r"\.(com|io|ai|co|dev|app|net|org)\b", "", s)
    s = re.sub(r"\b(inc|llc|ltd|limited|corp|corporation|gmbh|bv|pte)\b", "", s)
    s = re.sub(r"[^a-z0-9]+", "", s)
    return s


def build_alias_map(aliases):
    """canonical name -> set of normalized keys."""
    lookup = {}
    for canonical, variants in (aliases or {}).items():
        keys = {norm_key(canonical)}
        for v in variants:
            keys.add(norm_key(v))
        for k in keys:
            lookup[k] = canonical
    return lookup


def conf_rank(value):
    return CONFIDENCE_ORDER.get(str(value or "unknown").strip().lower(), 0)


def weakest(a, b):
    """Return the weaker of two confidence labels. A merged line never gains
    confidence from being merged on identity alone."""
    return a if conf_rank(a) <= conf_rank(b) else b


def monthly_equivalent(amount, cadence):
    if amount is None:
        return None
    c = str(cadence or "unknown").strip().lower()
    if c in NON_RECURRING:
        return None
    factor = CADENCE_TO_MONTHLY.get(c)
    if factor is None:
        return None
    return round(float(amount) * factor, 2)


def dedupe(lines, alias_lookup):
    """Collapse exact repeats and name variants.

    Grouping key is (canonical vendor, product, amount, currency, cadence,
    charge_date). Two rows for the same vendor at DIFFERENT amounts are kept
    apart on purpose: that is a plan change, a second product, or a proration,
    and each of those is a finding, not a duplicate.
    """
    groups = defaultdict(list)
    for line in lines:
        raw_vendor = line.get("vendor", "")
        key = norm_key(raw_vendor)
        canonical = alias_lookup.get(key) or raw_vendor.strip()
        gkey = (
            norm_key(canonical),
            str(line.get("product", "") or "").strip().lower(),
            line.get("amount"),
            str(line.get("currency", "USD") or "USD").upper(),
            str(line.get("cadence", "unknown") or "unknown").strip().lower(),
            str(line.get("charge_date", "") or ""),
        )
        groups[gkey].append((canonical, line))

    merged = []
    for gkey, members in groups.items():
        canonical = members[0][0]
        rows = [m[1] for m in members]
        variants = sorted({str(r.get("vendor", "")).strip() for r in rows if r.get("vendor")})
        evidence = []
        for r in rows:
            ev = r.get("evidence")
            if isinstance(ev, list):
                evidence.extend(ev)
            elif ev:
                evidence.append(ev)
        # Deduplicate evidence strings while preserving order.
        seen = set()
        evidence = [e for e in evidence if not (e in seen or seen.add(e))]

        amt_conf = rows[0].get("amount_confidence", "unknown")
        cad_conf = rows[0].get("cadence_confidence", "unknown")
        for r in rows[1:]:
            amt_conf = weakest(amt_conf, r.get("amount_confidence", "unknown"))
            cad_conf = weakest(cad_conf, r.get("cadence_confidence", "unknown"))

        amount = rows[0].get("amount")
        cadence = rows[0].get("cadence", "unknown")
        merged.append({
            "vendor": canonical,
            "variants": [v for v in variants if v != canonical],
            "product": rows[0].get("product"),
            "amount": amount,
            "currency": str(rows[0].get("currency", "USD") or "USD").upper(),
            "cadence": cadence,
            "amount_confidence": amt_conf,
            "cadence_confidence": cad_conf,
            "monthly_equivalent": monthly_equivalent(amount, cadence),
            "charge_date": rows[0].get("charge_date"),
            "next_charge": rows[0].get("next_charge"),
            "instrument": rows[0].get("instrument"),
            "usage_verdict": rows[0].get("usage_verdict"),
            "status": rows[0].get("status"),
            "observations": len(rows),
            "evidence": evidence,
        })

    merged.sort(key=lambda r: (r["vendor"].lower(), -(r["monthly_equivalent"] or 0)))
    return merged


def run_rates(rows):
    """Split totals by confidence. Currencies are totalled separately and never
    converted: the archive rule is that an amount is reported as observed."""
    totals = defaultdict(lambda: {"confirmed": 0.0, "probable": 0.0, "all_costed": 0.0})
    exceptions = []

    for r in rows:
        cur = r["currency"]
        me = r["monthly_equivalent"]
        if me is None:
            exceptions.append({
                "vendor": r["vendor"],
                "reason": "no monthly equivalent",
                "detail": "amount missing" if r["amount"] is None
                          else "cadence is %s, excluded from run rate" % r["cadence"],
                "amount": r["amount"],
                "cadence": r["cadence"],
            })
            continue

        a_rank = conf_rank(r["amount_confidence"])
        c_rank = conf_rank(r["cadence_confidence"])
        totals[cur]["all_costed"] += me
        if a_rank >= 3 and c_rank >= 3:
            totals[cur]["confirmed"] += me
            totals[cur]["probable"] += me
        elif a_rank >= 2 and c_rank >= 2:
            totals[cur]["probable"] += me
        else:
            exceptions.append({
                "vendor": r["vendor"],
                "reason": "low confidence",
                "detail": "amount %s / cadence %s, counted only in all_costed"
                          % (r["amount_confidence"], r["cadence_confidence"]),
                "amount": r["amount"],
                "cadence": r["cadence"],
            })

    out = {}
    for cur, t in totals.items():
        out[cur] = {
            "confirmed_monthly": round(t["confirmed"], 2),
            "confirmed_annual": round(t["confirmed"] * 12, 2),
            "probable_monthly": round(t["probable"], 2),
            "probable_annual": round(t["probable"] * 12, 2),
            "all_costed_monthly": round(t["all_costed"], 2),
            "all_costed_annual": round(t["all_costed"] * 12, 2),
        }
    return out, exceptions


def main():
    p = argparse.ArgumentParser(description="Deduplicate a captured vendor ledger and compute run rates.")
    p.add_argument("input", help="path to a JSON array of candidate lines, or - for stdin")
    p.add_argument("--aliases", help="path to a JSON map of canonical vendor to variants")
    args = p.parse_args()

    text = sys.stdin.read() if args.input == "-" else open(args.input, encoding="utf-8").read()
    try:
        lines = json.loads(text)
    except json.JSONDecodeError as e:
        print(json.dumps({"error": "input is not valid JSON", "detail": str(e)}), file=sys.stderr)
        return 2
    if not isinstance(lines, list):
        print(json.dumps({"error": "input must be a JSON array of ledger lines"}), file=sys.stderr)
        return 2

    aliases = {}
    if args.aliases:
        with open(args.aliases, encoding="utf-8") as f:
            aliases = json.load(f)

    rows = dedupe(lines, build_alias_map(aliases))
    totals, exceptions = run_rates(rows)

    collapsed = sum(r["observations"] for r in rows) - len(rows)
    print(json.dumps({
        "input_lines": len(lines),
        "ledger_rows": len(rows),
        "observations_collapsed": collapsed,
        "run_rates_by_currency": totals,
        "excluded_from_totals": exceptions,
        "counts": {
            "amount_unknown": sum(1 for r in rows if r["amount"] is None),
            "cadence_unknown": sum(1 for r in rows if str(r["cadence"]).lower() in NON_RECURRING),
            "currencies": sorted(totals.keys()),
        },
        "ledger": rows,
    }, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
