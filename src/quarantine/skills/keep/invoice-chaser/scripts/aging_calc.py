#!/usr/bin/env python3
"""Deterministic aging arithmetic for invoice-chaser.

Collapses duplicate OCR rows, derives due dates from payment terms, computes days
overdue, assigns aging buckets, and totals by bucket and currency.

This script does arithmetic and nothing else. It makes no judgment about whether an
invoice is paid, it never invents a field, and it never assigns a tier. Tiering is a
human-gated decision made in references/aging-and-verification.md.

Usage:
    python3 aging_calc.py invoices.json
    python3 aging_calc.py invoices.json --run-date 2026-08-17
    python3 aging_calc.py invoices.json --format md

Input: a JSON array of invoice objects. Recognized fields, all optional except client:

    client                str   Client name as written on the artifact
    invoice_ref           str   Invoice number, or null / "unknown"
    amount                num   Numeric amount. Never a string with symbols.
    currency              str   ISO-ish code or symbol as shown. Default "unknown"
    issue_date            str   YYYY-MM-DD
    due_date              str   YYYY-MM-DD
    terms                 str   e.g. "Net 30", "net15", "due on receipt", "COD"
    status_shown          str   Literal status string from the surface
    source_surface        str   Which surface it came from
    receipts              list  Evidence receipt strings
    extraction_confidence str   "High" | "Medium" | "Low"
    direction             str   "outbound" (we billed them) | "inbound" | "unknown"

Output: JSON (default) or a markdown report with --format md. Exit code 0 always
unless the input cannot be parsed.
"""

import argparse
import json
import re
import sys
from collections import defaultdict
from datetime import date, datetime, timedelta

BUCKETS = [
    ("current", None, 0),
    ("1-30", 1, 30),
    ("31-60", 31, 60),
    ("61-90", 61, 90),
    ("90-plus", 91, None),
]

TERMS_PATTERNS = [
    (re.compile(r"net\s*[-_]?\s*(\d{1,3})", re.I), lambda m: int(m.group(1))),
    (re.compile(r"\b(\d{1,3})\s*days?\b", re.I), lambda m: int(m.group(1))),
    (re.compile(r"due\s+on\s+receipt", re.I), lambda m: 0),
    (re.compile(r"\bupon\s+receipt\b", re.I), lambda m: 0),
    (re.compile(r"\bimmediate", re.I), lambda m: 0),
    (re.compile(r"\bcod\b", re.I), lambda m: 0),
    (re.compile(r"\bprepaid\b", re.I), lambda m: 0),
]


def parse_date(value):
    """Return a date or None. Accepts YYYY-MM-DD and YYYY/MM/DD only.

    Deliberately strict. An ambiguous format such as 03/04/2026 is not guessed,
    because guessing month-day order silently moves an invoice between buckets.
    """
    if not value or not isinstance(value, str):
        return None
    text = value.strip().replace("/", "-")
    try:
        return datetime.strptime(text, "%Y-%m-%d").date()
    except ValueError:
        return None


def terms_to_days(terms):
    """Return net days from a terms string, or None if unrecognized."""
    if not terms or not isinstance(terms, str):
        return None
    for pattern, extract in TERMS_PATTERNS:
        match = pattern.search(terms)
        if match:
            return extract(match)
    return None


def normalize_name(name):
    """Lowercase, strip punctuation and common company suffixes, for matching only.

    The original spelling is always preserved on the output line. This value is used
    for collapse comparison and nowhere else.
    """
    if not name:
        return ""
    text = name.lower()
    text = re.sub(r"[^a-z0-9 ]+", " ", text)
    text = re.sub(
        r"\b(inc|llc|ltd|limited|corp|corporation|co|company|plc|gmbh|pty|sa|bv)\b",
        " ",
        text,
    )
    return re.sub(r"\s+", " ", text).strip()


def normalize_ref(ref):
    if not ref or not isinstance(ref, str):
        return ""
    text = ref.strip().lower()
    if text in ("unknown", "none", "n/a", "na", "-"):
        return ""
    return re.sub(r"[^a-z0-9]+", "", text)


def collapse(rows):
    """Apply the collapse rules from references/invoice-discovery.md section 4.

    Rule 1: same normalized ref and same normalized client collapse.
    Rule 2: same client, same amount, issue dates within 2 days, one has a ref and one
            does not, collapse and keep the ref.
    Rule 3: same client, same amount, different refs do NOT collapse.
    Rule 4: same ref, different amount do NOT collapse. Flagged as a conflict.

    Returns (collapsed_rows, conflicts).
    """
    conflicts = []
    keyed = {}
    unkeyed = []

    for row in rows:
        ref = normalize_ref(row.get("invoice_ref"))
        client = normalize_name(row.get("client"))
        if ref:
            key = (client, ref)
            if key in keyed:
                existing = keyed[key]
                if not amounts_equal(existing.get("amount"), row.get("amount")):
                    conflicts.append(
                        {
                            "kind": "same_ref_different_amount",
                            "client": row.get("client"),
                            "invoice_ref": row.get("invoice_ref"),
                            "amounts": [existing.get("amount"), row.get("amount")],
                            "note": "Rule 4. Not collapsed. Invoice may have been "
                            "revised, or one OCR read is wrong. User must resolve.",
                        }
                    )
                    unkeyed.append(row)
                else:
                    merge_into(existing, row)
            else:
                keyed[key] = dict(row)
        else:
            unkeyed.append(dict(row))

    # Rule 2: fold ref-less rows into a keyed row with matching client, amount, and an
    # issue date within 2 days.
    leftovers = []
    for row in unkeyed:
        client = normalize_name(row.get("client"))
        row_date = parse_date(row.get("issue_date"))
        target = None
        for (kclient, _kref), candidate in keyed.items():
            if kclient != client:
                continue
            if not amounts_equal(candidate.get("amount"), row.get("amount")):
                continue
            cand_date = parse_date(candidate.get("issue_date"))
            if row_date and cand_date and abs((row_date - cand_date).days) > 2:
                continue
            target = candidate
            break
        if target is not None:
            merge_into(target, row)
        else:
            leftovers.append(row)

    return list(keyed.values()) + leftovers, conflicts


def amounts_equal(left, right):
    if left is None or right is None:
        return left is None and right is None
    try:
        return abs(float(left) - float(right)) < 0.005
    except (TypeError, ValueError):
        return str(left) == str(right)


def merge_into(target, row):
    """Merge a duplicate observation into a kept row. Never loses a receipt."""
    receipts = list(target.get("receipts") or [])
    receipts.extend(row.get("receipts") or [])
    seen = set()
    deduped = []
    for item in receipts:
        if item not in seen:
            seen.add(item)
            deduped.append(item)
    target["receipts"] = deduped
    target["observation_count"] = target.get("observation_count", 1) + 1

    # Latest observed status wins, where an observation date is available.
    row_status = row.get("status_shown")
    if row_status:
        target["status_shown"] = row_status

    for field in (
        "invoice_ref",
        "amount",
        "currency",
        "issue_date",
        "due_date",
        "terms",
        "source_surface",
        "direction",
    ):
        if not target.get(field) and row.get(field):
            target[field] = row[field]

    order = {"Low": 0, "Medium": 1, "High": 2}
    left = order.get(target.get("extraction_confidence"), -1)
    right = order.get(row.get("extraction_confidence"), -1)
    if right > left:
        target["extraction_confidence"] = row.get("extraction_confidence")


def resolve_due_date(row):
    """Return (due_date_or_None, how) where how is 'shown', 'derived', or 'unknown'."""
    shown = parse_date(row.get("due_date"))
    if shown:
        return shown, "shown"
    issue = parse_date(row.get("issue_date"))
    net_days = terms_to_days(row.get("terms"))
    if issue is not None and net_days is not None:
        return issue + timedelta(days=net_days), "derived"
    return None, "unknown"


def bucket_for(days_overdue):
    if days_overdue is None:
        return "unknown"
    if days_overdue <= 0:
        return "current"
    for name, low, high in BUCKETS:
        if low is None:
            continue
        if days_overdue >= low and (high is None or days_overdue <= high):
            return name
    return "unknown"


def compute(rows, run_date):
    collapsed, conflicts = collapse(rows)
    results = []
    for row in collapsed:
        out = dict(row)
        out.setdefault("observation_count", 1)
        out.setdefault("currency", "unknown")
        out.setdefault("receipts", [])

        due, how = resolve_due_date(row)
        out["due_date_resolved"] = due.isoformat() if due else None
        out["due_date_basis"] = how

        if due is None:
            out["days_overdue"] = None
            out["bucket"] = "unknown"
        else:
            out["days_overdue"] = (run_date - due).days
            out["bucket"] = bucket_for(out["days_overdue"])

        direction = (row.get("direction") or "unknown").lower()
        out["direction"] = direction
        out["excluded"] = direction in ("inbound", "unknown")
        if out["excluded"]:
            out["exclusion_reason"] = (
                "direction is %s; only outbound invoices are receivables" % direction
            )
        status = (row.get("status_shown") or "").strip().lower()
        if status in ("draft", "void", "voided", "cancelled", "canceled"):
            out["excluded"] = True
            out["exclusion_reason"] = "status_shown is %s; never sent or cancelled" % status
        results.append(out)

    results.sort(
        key=lambda r: (
            -(r["days_overdue"] if r["days_overdue"] is not None else -10**6),
            (r.get("client") or "").lower(),
        )
    )

    totals = defaultdict(lambda: defaultdict(float))
    counts = defaultdict(lambda: defaultdict(int))
    unpriced = defaultdict(int)
    for row in results:
        if row["excluded"]:
            continue
        bucket = row["bucket"]
        currency = row.get("currency") or "unknown"
        counts[bucket][currency] += 1
        amount = row.get("amount")
        try:
            totals[bucket][currency] += float(amount)
        except (TypeError, ValueError):
            unpriced[bucket] += 1

    return {
        "run_date": run_date.isoformat(),
        "input_rows": len(rows),
        "collapsed_rows": len(results),
        "included_rows": sum(1 for r in results if not r["excluded"]),
        "excluded_rows": sum(1 for r in results if r["excluded"]),
        "conflicts": conflicts,
        "invoices": results,
        "totals_by_bucket": {b: dict(v) for b, v in totals.items()},
        "counts_by_bucket": {b: dict(v) for b, v in counts.items()},
        "unpriced_by_bucket": dict(unpriced),
    }


def render_markdown(result):
    lines = []
    lines.append("# Aging calculation, run %s" % result["run_date"])
    lines.append("")
    lines.append(
        "Input rows: %d. After collapse: %d. Included: %d. Excluded: %d."
        % (
            result["input_rows"],
            result["collapsed_rows"],
            result["included_rows"],
            result["excluded_rows"],
        )
    )
    lines.append("")
    lines.append("Amounts are as captured. No currency conversion was performed.")
    lines.append("")

    lines.append("## Totals by bucket")
    lines.append("")
    lines.append("| Bucket | Currency | Invoices | Total | Unpriced lines |")
    lines.append("|---|---|---|---|---|")
    order = ["current", "1-30", "31-60", "61-90", "90-plus", "unknown"]
    for bucket in order:
        currencies = result["counts_by_bucket"].get(bucket, {})
        if not currencies:
            continue
        for currency, count in sorted(currencies.items()):
            total = result["totals_by_bucket"].get(bucket, {}).get(currency, 0.0)
            lines.append(
                "| %s | %s | %d | %.2f | %d |"
                % (
                    bucket,
                    currency,
                    count,
                    total,
                    result["unpriced_by_bucket"].get(bucket, 0),
                )
            )
    lines.append("")

    lines.append("## Lines")
    lines.append("")
    lines.append(
        "| Client | Ref | Amount | Issue | Due | Basis | Days overdue | Bucket "
        "| Status | Obs | Conf | Excluded |"
    )
    lines.append("|---|---|---|---|---|---|---|---|---|---|---|---|")
    for row in result["invoices"]:
        lines.append(
            "| %s | %s | %s %s | %s | %s | %s | %s | %s | %s | %d | %s | %s |"
            % (
                row.get("client") or "unknown",
                row.get("invoice_ref") or "unknown",
                row.get("currency") or "",
                row.get("amount") if row.get("amount") is not None else "unknown",
                row.get("issue_date") or "unknown",
                row.get("due_date_resolved") or "unknown",
                row.get("due_date_basis"),
                row.get("days_overdue") if row.get("days_overdue") is not None else "n/a",
                row.get("bucket"),
                row.get("status_shown") or "none",
                row.get("observation_count", 1),
                row.get("extraction_confidence") or "unrated",
                row.get("exclusion_reason", "") if row.get("excluded") else "",
            )
        )
    lines.append("")

    if result["conflicts"]:
        lines.append("## Conflicts needing a human decision")
        lines.append("")
        for conflict in result["conflicts"]:
            lines.append(
                "- %s: %s ref %s, amounts %s. %s"
                % (
                    conflict["kind"],
                    conflict.get("client"),
                    conflict.get("invoice_ref"),
                    conflict.get("amounts"),
                    conflict.get("note"),
                )
            )
        lines.append("")

    lines.append("## What this script did not do")
    lines.append("")
    lines.append("- It did not decide whether any invoice was paid.")
    lines.append("- It did not assign a verification tier.")
    lines.append("- It did not convert currencies or add across currencies.")
    lines.append("- It did not compute late fees or interest.")
    lines.append("- It did not guess an ambiguous date format. Unparsed dates are unknown.")
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Aging arithmetic for invoice-chaser.")
    parser.add_argument("input", help="Path to a JSON array of invoice objects.")
    parser.add_argument(
        "--run-date",
        default=None,
        help="YYYY-MM-DD to age against. Defaults to today.",
    )
    parser.add_argument(
        "--format", choices=("json", "md"), default="json", help="Output format."
    )
    args = parser.parse_args()

    try:
        with open(args.input, "r", encoding="utf-8") as handle:
            rows = json.load(handle)
    except (OSError, ValueError) as exc:
        print("Could not read input: %s" % exc, file=sys.stderr)
        return 2

    if not isinstance(rows, list):
        print("Input must be a JSON array of invoice objects.", file=sys.stderr)
        return 2

    if args.run_date:
        run_date = parse_date(args.run_date)
        if run_date is None:
            print("Run date must be YYYY-MM-DD.", file=sys.stderr)
            return 2
    else:
        run_date = date.today()

    result = compute(rows, run_date)

    if args.format == "md":
        print(render_markdown(result))
    else:
        print(json.dumps(result, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    sys.exit(main())
