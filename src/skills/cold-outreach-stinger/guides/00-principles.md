# Principles: The Six Non-Negotiables

These rules govern every cold-outreach-worker-bee engagement. They are derived from the research evidence base and the Command Brief's SUBAGENT CRITICAL DIRECTIVES. Violating any of them produces predictably bad outcomes: spam folders, burned domains, wasted personalization budget, or compliance exposure.

---

## 1. Deliverability before copy

> A perfectly written sequence landing in spam produces zero meetings.

Infrastructure problems are upstream of everything. Before assessing copy, sequences, or personalization, verify:
- Separate sending domain exists (not the main company domain)
- SPF, DKIM (2048-bit), and DMARC records are valid
- Warmup is running or completed (minimum 4 weeks)
- Sending volume is within safe limits (50-100 emails/mailbox/day)
- Google Postmaster reputation is green (Pass in v2 binary scoring)

If any of these fail, the correct action is to fix infrastructure first. No other optimization matters until the email physically reaches the inbox.

**Research grounding:** `research/external/2026-05-20-cold-email-deliverability-2026-rules.md`

---

## 2. Separate sending domains are non-negotiable

> If the user is sending from their primary domain, stop and fix this first.

The main company domain (`acme.com`) is never used for cold outreach. Cold email carries inherent spam risk. Exposing the primary domain to that risk will eventually damage the domain's reputation, affecting transactional email, product notifications, and investor correspondence.

The correct setup: dedicate 2-3 forwarding domains for cold outreach (e.g., `tryacme.com`, `getacme.io`). These domains receive all spam complaints and reputation degradation. The primary domain stays clean.

If the user has already been sending from the primary domain and it shows degraded reputation on Google Postmaster, flag this urgently. Recovery requires stopping all sends from that domain, setting up fresh domains, and warming them. Primary domain reputation cannot be fully repaired — it can only be quarantined.

---

## 3. ICP tightness before sequence optimization

> Optimizing a sequence sent to the wrong people compounds the damage.

A narrow ICP (industry + company size + title + buying trigger) is a prerequisite for any sequence work. If the user cannot articulate who their ICP is in one sentence including a buying trigger, the ICP is too broad.

The test: read the sequence to 10 people who fit the ICP description. If the problem it names does not resonate with at least 7 of them, the ICP is wrong, not the copy.

Send rate and optimization pressure on a bad list burns sender reputation and provides misleading signal about what is or is not working.

**Research grounding:** `research/external/2026-05-20-apollo-vs-lemlist-tool-decision.md`

---

## 4. AI personalization must pass the 1-in-1000 test

> Any AI opener that is true for 1000 people is not personalization. It is slop.

Personalization slop is now the default output of most AI-generated cold email. Prospects recognize it immediately and it signals "automated blast" not "researched prospect."

The 1-in-1000 test: would this specific line be true for more than 1 in 1000 people on the list? If yes, delete it.

Genuine personalization references something specific to that prospect:
- A post they published or were quoted in
- A recent job change, promotion, or company news
- A technology in their job posting that matches what you help with
- A specific business outcome they have publicly discussed

The Clay Claygent SKIP rule is the operational implementation of this principle: the prompt instructs Claygent to return "SKIP" (not a generic line) if it cannot find a specific insight. See `guides/04-clay-personalization.md`.

**Research grounding:** `research/external/2026-05-20-clay-claygent-personalization-anti-slop.md`

---

## 5. Reply rate is the canonical metric

> Open rates are dead as a meaningful KPI since Apple MPP (September 2021). Reply rate is the truth.

Since Apple Mail Privacy Protection, open rate data is fabricated for Apple device users (the most common email client). Any dashboard reporting open rates as a primary success metric is measuring noise.

The canonical metrics for cold email:
- **Reply rate** (positive replies / total emails sent): benchmark 3.43% average, 10%+ elite, below 2% = broken
- **Positive reply rate** (interested + not-now / total sent): the primary lead quality signal
- **Meeting booked rate** (booked calls / positive replies): measures sequence-to-meeting conversion

If a user presents open rate data as the main success measure, correct this before analyzing the data.

**Research grounding:** `research/external/2026-05-20-cold-email-reply-rate-benchmarks-2026.md`

---

## 6. Flag EU/GDPR cold outreach risks explicitly

> Cold email to EU prospects without legitimate interest documentation is non-compliant.

GDPR Article 6(1)(f) (legitimate interest) is the legal basis most commonly claimed for B2B cold email in the EU. However, relying on legitimate interest requires a Legitimate Interest Assessment (LIA) and must be documented before the campaign begins.

`cold-outreach-worker-bee` does NOT provide legal advice. When the user's list includes EU-domiciled prospects, flag this risk clearly:

1. Note that cold email to EU contacts requires lawful basis documentation
2. Recommend they consult their legal counsel before sending to EU contacts
3. Route the compliance audit to `security-worker-bee`
4. Do not proceed with sequence design for EU contacts until the user acknowledges the flag

CAN-SPAM (US) and CASL (Canada) are less restrictive but still require: physical address in the email, unsubscribe mechanism, and for CASL, implied or express consent. Surface these requirements in the list hygiene step.

**Research grounding:** `research/external/2026-05-20-apollo-search-filters-list-building.md` (compliance notes)
