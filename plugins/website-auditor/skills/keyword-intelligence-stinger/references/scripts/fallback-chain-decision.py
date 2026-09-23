#!/usr/bin/env python3
"""fallback-chain-decision.py: deterministic tier-selection for keyword-intelligence-wasp-drone.

Owner: keyword-intelligence-stinger (local script; no central shared/scripts/ entry exists for
this domain, see references/scripts/README.md). Forge stage: 4 (References), authored against
references/research/distilled-keyword-intelligence.md and guides/05-fallback-chain-and-
provenance.md. Harness-portable: stdlib only (argparse, json, os, sys), no absolute paths.

WHAT THIS SCRIPT DOES
Implements PRD-006's binding 4-tier source-priority chain as an explicit, auditable decision,
instead of leaving "which tier did we actually use, and why" as an implicit judgment made mid-run
and never written down. Per PRD-006 AC-1/AC-2, every run must record which tier(s) produced its
output and, when a tier was skipped, why.

WHAT THIS SCRIPT DOES NOT DO
- It does not call the Google Search Console MCP, fetch a Trends export, run AI inference, or call
  a paid API itself. Those are the Drone's own actions, using this Stinger's other guides
  (guides/01 through guides/04). This script only takes the OUTCOME of checking each tier
  (connected? has data? export present? candidate count so far?) and returns which tier's output
  should be used, and why, as one auditable decision.
- Tier 4 (paid API) is never auto-selected as a simple "tier 3 failed" fallback, because tier 3
  (AI/statistical inference from crawled content) essentially always produces SOME candidates; it
  rarely "fails" outright the way an absent MCP connection or a missing customer file does. Per
  distilled-keyword-intelligence.md section 4's "Implementation implication for Tier 4," paid-API
  usage should be "gated behind an explicit cost/budget check rather than called opportunistically."
  This script therefore only escalates to tier 4 when BOTH the running candidate count is below
  PRD-006's required minimum (75 keywords / 25 questions) AND an explicit budget-approval flag is
  set, matching that cost-gating discipline. A below-minimum count with no budget approval is
  reported as a stop-and-flag condition, never silently filled with fabricated candidates: PRD-006's
  binding Non-Goal is "does not fabricate search-volume numbers... for tier-3/tier-4-unavailable
  data," and the same honesty principle applies to fabricating candidate COUNT to hit the range.

Usage:
    python3 fallback-chain-decision.py \
        --target-type keywords \
        --gsc-mcp-connected --gsc-has-data \
        --candidate-count 40

    python3 fallback-chain-decision.py \
        --target-type keywords \
        --trends-export-dir path/to/content-targets/trends-raw \
        --candidate-count 82

    python3 fallback-chain-decision.py \
        --target-type questions \
        --candidate-count 18 \
        --paid-api-budget-approved

Prints a JSON decision object to stdout; exits 0 always (this is an advisory decision tool, not a
validator; the Drone still has to act on its output).
"""

import argparse
import json
import os
import sys

MINIMUMS = {"keywords": 75, "questions": 25}
MAXIMUMS = {"keywords": 100, "questions": 50}


def decide(target_type: str, gsc_mcp_connected: bool, gsc_has_data: bool,
           trends_export_dir: str | None, candidate_count: int,
           paid_api_budget_approved: bool) -> dict:
    tiers_tried = []
    tier = None
    reason = ""

    # Tier 1: Google Search Console MCP, per PRD-006 AC-1: "connected... and returns query data
    # for the domain." Connection alone is not sufficient; both flags must be true.
    tiers_tried.append("search-console")
    if gsc_mcp_connected and gsc_has_data:
        tier = "search-console"
        reason = "Tier 1 (Search Console MCP) is connected and returned query data for this domain."
    elif gsc_mcp_connected and not gsc_has_data:
        reason_t1 = "Tier 1 MCP connected but returned no query data for this domain (new site, no indexed history, or unverified property)."
    else:
        reason_t1 = "Tier 1 MCP not connected. This is a normal, expected condition per PRD-006's Non-Goals, not an error."

    # Tier 2: customer-supplied Google Trends export.
    if tier is None:
        tiers_tried.append("customer-trends")
        has_trends_files = False
        if trends_export_dir and os.path.isdir(trends_export_dir):
            has_trends_files = any(
                f.lower().endswith(".csv") for f in os.listdir(trends_export_dir)
            )
        if has_trends_files:
            tier = "customer-trends"
            reason = f"Tier 1 unavailable ({reason_t1}) Tier 2 customer Trends export found at {trends_export_dir}."
        else:
            reason_t2 = "No customer-supplied Trends export found."

    # Tier 3: AI/statistical inference from independently-fetched site content. This tier has no
    # external precondition to check here (it can always attempt inference); it is the default
    # landing tier when tiers 1-2 are unavailable.
    if tier is None:
        tiers_tried.append("ai-inference")
        tier = "ai-inference"
        reason = f"Tier 1 unavailable ({reason_t1}) Tier 2 unavailable ({reason_t2}) falling through to Tier 3 AI/statistical inference, no user-visible error, per PRD-006 AC-2."

    # Escalation check: is the running candidate count below PRD-006's required minimum for this
    # target type, regardless of which tier produced it so far?
    minimum = MINIMUMS[target_type]
    maximum = MAXIMUMS[target_type]
    escalation = None
    if candidate_count < minimum:
        if paid_api_budget_approved and tier != "paid-api":
            tiers_tried.append("paid-api")
            escalation = (
                f"Tier {tier} produced only {candidate_count} candidates, below PRD-006's "
                f"required minimum of {minimum} for {target_type}. Paid-API budget was approved; "
                f"escalate to Tier 4 to supplement the gap. Resulting provenance tag should be "
                f"'mixed', not a wholesale tier switch: keep every already-sourced candidate's "
                f"original tier tag, add Tier 4 candidates only for the remaining gap."
            )
            tier = "mixed"
        else:
            escalation = (
                f"Tier {tier} produced only {candidate_count} candidates, below PRD-006's "
                f"required minimum of {minimum} for {target_type}, and no paid-API budget "
                f"approval was given. STOP: do not fabricate candidates to reach the minimum. "
                f"Report this gap in the run ledger and ask the orchestrating agent/user whether "
                f"to approve a Tier 4 budget or accept a below-range output with the gap disclosed."
            )

    return {
        "target_type": target_type,
        "tiers_tried_in_order": tiers_tried,
        "selected_tier": tier,
        "reason": reason,
        "candidate_count": candidate_count,
        "required_range": [minimum, maximum],
        "within_range": minimum <= candidate_count <= maximum,
        "escalation": escalation,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--target-type", choices=["keywords", "questions"], required=True)
    parser.add_argument("--gsc-mcp-connected", action="store_true")
    parser.add_argument("--gsc-has-data", action="store_true")
    parser.add_argument("--trends-export-dir", default=None)
    parser.add_argument("--candidate-count", type=int, required=True,
                         help="Running count of candidates sourced so far, before this decision.")
    parser.add_argument("--paid-api-budget-approved", action="store_true")
    args = parser.parse_args()

    decision = decide(
        target_type=args.target_type,
        gsc_mcp_connected=args.gsc_mcp_connected,
        gsc_has_data=args.gsc_has_data,
        trends_export_dir=args.trends_export_dir,
        candidate_count=args.candidate_count,
        paid_api_budget_approved=args.paid_api_budget_approved,
    )
    print(json.dumps(decision, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
