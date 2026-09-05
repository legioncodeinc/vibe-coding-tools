---
name: incorporation-startup-stack-stinger
description: Company formation decision toolkit for software startup founders. Covers formation platform selection (Stripe Atlas, Clerky, Doola, Firstbase), entity type advice (Delaware C-Corp vs LLC vs international), EIN workflow, startup banking (Mercury, Brex, Relay), bookkeeping (Pilot, Bench), and the minimum founder-paperwork checklist including the 83(b) election. Activate when the user says "incorporate my startup", "which formation platform should I use", "Stripe Atlas vs Clerky", "set up Mercury or Brex", "EIN for my LLC", "83(b) election deadline", "Delaware C-Corp vs LLC", or asks about the minimum paperwork to form a company. Do NOT activate for ongoing tax compliance, cap-table management (Carta/Pulley), fundraising mechanics (SAFEs, priced rounds), or post-formation state filings — those exceed this stinger's scope.
---

# Incorporation & Startup Stack Stinger

Decision toolkit for `incorporation-startup-stack-worker-bee`. It encodes the triage logic, comparison tables, and step-by-step workflows for every phase of company formation and early back-office setup.

**Always start with the entity-type decision (Step 1) before touching platform selection.** Platform choice is downstream of entity type; reversing the order produces conflicting advice.

---

## Step 1 — Entity type decision

See `guides/00-entity-type-decision.md` for the full decision tree.

**Fast-path rules (2026):**
- VC-funded intent + US founders → Delaware C-Corp. No discussion needed.
- Bootstrapped, profitable from day one, no outside equity → Wyoming LLC or Delaware LLC.
- International founders with complex holding needs → consult `guides/06-attorney-triggers.md` first.

The Delaware franchise tax is $450/year (Assumed Authorized Shares Method). The penalty for choosing wrong is $8K+ in conversion costs. See `guides/00-entity-type-decision.md`.

---

## Step 2 — Formation platform

See `guides/01-formation-platforms.md` for the full 2026 comparison table (pricing, processing time, included services, best-for profile).

**2026 pricing at a glance:**

| Platform | One-time | Annual (yr 2+) | Best for |
|---|---|---|---|
| Stripe Atlas | $500 | $100 (RA) | Solo/small SaaS, non-US founder speed |
| Clerky | $425–$799 | $99/year | YC-track, SAFE activity, complex equity |
| Doola | $297–$597 | $300–$500 | International, lowest entry price |
| Firstbase | $399–$599 | $299/year | Non-US founders, compliance dashboard |

Source: `research/research-summary.md` + individual platform research files.

---

## Step 3 — EIN acquisition

See `guides/02-ein-workflow.md`. Online IRS application: ~4 business days. Complete IRS Form SS-4 online at https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online.

---

## Step 4 — Banking

See `guides/03-banking.md`. 2026 FDIC pass-through update: Mercury = $5M, Brex Vault = $6M, Relay = $0–$30/month. Source: `research/external/mercury-vs-brex-banking-2026.md`.

**WARNING re: Mercury and international founders:** Mercury executed mass account closures for sanctioned-country passport holders in August 2024. International founders should consider Relay as primary alternative. See `guides/03-banking.md`.

---

## Step 5 — Bookkeeping

See `guides/04-bookkeeping.md`. Upgrade trigger: monthly expenses > $25K–$50K, or preparing for Series A.

**WARNING re: Bench:** Bench shut down December 27, 2024 and was reacquired. Current operational status must be verified before recommending. See `guides/04-bookkeeping.md` open question.

---

## Step 6 — Founder paperwork minimum

See `guides/05-founder-paperwork.md`. Correct order:

> Entity formation → Stock purchase + vesting agreements → IP assignment (PIIA/CIIA) → **83(b) election within 30 calendar days** → Banking setup → Bookkeeping setup

**CRITICAL: The 83(b) election is a 30-day hard deadline. No exceptions. IRS Form 15620 now enables electronic filing (available July 2025).** Source: `research/external/83b-election-guide-2026.md`.

---

## Step 7 — Attorney triggers

See `guides/06-attorney-triggers.md`. Get a human attorney when: international holding structure, complex IP ownership pre-formation, co-founder equity dispute, SAFE notes at formation, accelerated vesting disputes.

---

## Worked examples

- `examples/happy-path-saas-solo-founder.md` — US solo founder, VC-backed intent, Stripe Atlas, Mercury, Pilot.
- `examples/edge-case-international-founder.md` — Non-US founder, Delaware C-Corp via Firstbase, Relay banking, attorney referral for holding structure.

## Templates

- `templates/formation-decision-report.md` — Saved artifact the Angel fills in per engagement.
- `templates/founder-paperwork-checklist.md` — Checkbox checklist ordered by deadline urgency.

## Reports

- `reports/README.md` — How past formation-report artifacts accumulate over time.

---

## Critical directives

- **Always lead with entity-type recommendation before platform selection.** See `guides/00-entity-type-decision.md`.
- **Never present formation-platform marketing copy as neutral analysis.** Cite primary source fee schedules only. See `research/external/stripe-atlas-official-docs-2026.md`.
- **Explicitly call out the 83(b) election 30-day deadline in every C-Corp output.** See `guides/05-founder-paperwork.md` and `research/external/83b-election-guide-2026.md`.
- **Verify Bench operational status before recommending.** See `guides/04-bookkeeping.md` open question.
- **State attorney-required triggers explicitly.** See `guides/06-attorney-triggers.md`.

---

*Forged by `stinger-forge` from `command-briefs/incorporation-startup-stack-worker-bee-command-brief.md` and `research/`. Part of the Legion AI Tools Factory.*
