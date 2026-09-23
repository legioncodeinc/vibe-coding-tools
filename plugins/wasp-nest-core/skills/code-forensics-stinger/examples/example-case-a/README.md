# Example: Example Booking Co. V3

This folder is the canonical worked example for the `code-forensics-stinger` skill. It documents the Example Booking Co. matter (Sarah Bennett / Example Booking Co. LLC v. ADA + DevPipe), completed May 2026.

## Case profile

| Attribute | Value |
|---|---|
| Project name | Example Booking Co. |
| Client legal name | Example Booking Co. LLC |
| Client principal | Sarah M. Bennett |
| Engagement start | August 11, 2021 (ACH Authorization) |
| Engagement end | May 1, 2026 (client terminated) |
| Engagement length | 57 months |
| Original ADA contract | $32,329 (signed November 22, 2021) |
| Defendants | (1) Acme Digital Agency, LLC / Northstar Holdings Inc. (Robert Hartwell); (2) Offshore Build Group LLC / DevPipe LLC (Sameer Khan) |
| Jurisdiction | Ohio (Cuyahoga County for ADA; Delaware/NJ for DevPipe US entities) |
| Documented invoice spend | $80,909.33 (ADA) + $37,800 (DevPipe) = $118,709.33 |
| Extrapolated UNK spend | $3,295.96 (ADA) + $48,000 (DevPipe) = $51,295.96 |
| Plus original 2021 Phase 1 contract | $32,329 |
| **Total documented + extrapolated** | **$202,334.29** |
| Client-reported range | $160,000 – $224,000 (matched) |
| Aggregate damages range (V3) | $183,340 — $381,150 (before punitive) |

## Materials processed

- 176 individual .eml files from the client's sarahbennett@aol.example export (Aug 2021 → Nov 2025)
- 3 Gmail "forward as attachment" multi-message dumps (covering Jul 2023 → May 2026)
- 50 individual .eml files from a separate attachments archive
- After dedup: **323 unique emails, 37 reconstructed threads**
- 33 ADA Customer Invoices (extracted from email bodies)
- 15 DevPipe/Offshore Build PDF invoices (Stripe-generated)
- Full simple-schedular-web git repo (534 commits, Nov 2023 → Apr 2026)
- WPMU DEV Defender audit log export (37 events, Dec 16, 2025 → May 2, 2026)
- Avada theme changelog (covering versions 7.3 → 7.15.2)
- ADA quarterly Account Reports (April–July 2025, etc.)
- 8 third-party technical audit reports
- Original signed ADA proposal (Nov 22, 2021)
- Offshore Build Group MSA (Nov 1, 2023)

## Key findings (the highlights)

1. **The Feb 2023 ADA mega-invoices** ($37,699.82 in 24 hours via #8642 setup + #8644 first-month services) — most line items in #8644 were never billed again. Strongest single fraud claim.
2. **The Initial Build Vendor → Offshore Build handoff** (Initial Build Vendor formally signed off Oct 30, 2023; Offshore Build MSA signed Nov 1, 2023; +96,365-line "initial commit" Nov 10, 2023) — establishes that Offshore Build inherited a substantially-complete codebase rather than rebuilding from scratch.
3. **The git "Billed vs Delivered" variance** — 574 hours of work delivered against 2,080 hours claimed at 80 hrs/month × 26 months = $150,600 implied overcharge.
4. **4 IDLE maintenance months** (Feb, Jun, Jul, Dec 2025) with ZERO git commits while billing $4,000/month each.
5. **138-day ADA maintenance gap** — the WordPress audit log shows zero ADA-driven security updates Dec 16, 2025 → May 2, 2026 (the day the client took back control).
6. **Post SMTP CVE-2025-11833** (CVSS 9.8, actively exploited from Oct 11, 2025) — left unpatched for ~7 months while ADA billed for "Website Support and Hosting."
7. **James Whitfield's 2021 operational role** documented via the Aug 17, 2021 Robert Hartwell email ("Mario will complete the payment processing this afternoon") — relevant to the Hartwell v. Whitfield Cuyahoga County case (CV-XX-XXXXXX) creating leverage.

## How V2 → V3 evolved

The investigation initially produced a V2 packet on May 15, 2026 with $132,221 documented + extrapolated and a $173K–$362K damages range. V3 (May 18, 2026) added 171 newly-discovered emails from the sarahbennett@aol.example archive, raising:
- Documented + extrapolated: $132K → $202K (closes the gap to client-reported range)
- Aggregate damages: $173K–$362K → $183K–$381K
- Strengthens the Initial Build Vendor relationship narrative
- Identifies new ADA personnel (Michelle Levinson, Eliza Sawyers Walker, Erin, AJ)

## What this example demonstrates

For the Stinger's user, the Example Booking Co. V3 example shows:

1. **All 9 phases running end-to-end** with actual outputs at each step
2. **Multi-defendant handling** — how to split the ADA narrative from the DevPipe narrative in separate reports while sharing the master report
3. **The first-and-last-observed extrapolation rule** applied to 11 recurring service buckets, producing 26 UNK invoices
4. **The Initial Build Vendor-style vendor pivot** — how to handle a case where a third party signed off on completion before a different defendant inherited the codebase
5. **A 4-version evolution** (V1 conceptual → V2 first packet → V3 expanded → pre-litigation V3) showing how the methodology accumulates evidence iteratively
6. **The "intimidating through precision" tone** in pre-litigation letters — see the actual V3 demand letters for the exact language patterns

The defendant profiles in this folder are the canonical fill-ins of `templates/defendant-profile-template.md`. For future ADA/DevPipe cases (Pioneer AMS, etc.), START FROM these profiles — but verify every fact for the new matter; don't assume continuity of personnel, addresses, or billing patterns without confirmation.

## Lessons learned for future iterations

- **Always ask the client for ALL email archives early.** Example Booking Co. V2 was based on 152 emails; V3 added 171 more from a separate archive that the client had but didn't initially share. Phase 0 intake should explicitly ask: "Do you have an export from your personal email account in addition to your business account?"
- **The dependency lockfile is the smoking gun for maintenance fraud.** Even when the git log isn't available, the lockfile shows whether patches were applied.
- **Quarterly account reports from the defendant are gold.** The defendant's own report documenting their own failure is the cleanest evidence in the marketing-services claim.
- **WordPress audit log exports vary by plugin and by retention period.** Some Defender Pro exports only cover the most recent N events. Request the full historical export, not just the default download.
