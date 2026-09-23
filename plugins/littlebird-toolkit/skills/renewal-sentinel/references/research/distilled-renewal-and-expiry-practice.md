# Distilled: auto-renewal practice, cancellation windows, and expiry mechanics

Written from a fresh read of `raw/`. Every claim ends in a bracketed citation. Where sources
disagree, both readings are stated. Where the archive is thin, it says so.

---

## 1. The legal status of US auto-renewal rules, stated carefully

This is the section that must not be wrong. Get it in this order.

**There is no federal click-to-cancel rule in force.** The FTC's 2024 revised Negative
Option Rule, which would have required separate express consent, restricted retention
attempts during cancellation, and required a cancellation mechanism "at least as easy as the
method used to enroll", was vacated in its entirety
[raw/renewal--ftc-status--gibsondunn-2026.md]. The vacatur came in *Custom Communications,
Inc. v. Federal Trade Commission*, decided 2025-07-08 by the Eighth Circuit, days before the
rule's 2025-07-14 compliance date [raw/renewal--eighth-circuit--mayerbrown-2025.md],
[raw/renewal--state-arls--zwillgen-2026.md].

**The vacatur was procedural, not substantive.** The court held that Section 18 of the FTC
Act "mandates a separate preliminary analysis in *any* case where the FTC issues an NPRM
that surpasses the $100 million threshold", and the Commission had not performed one
[raw/renewal--eighth-circuit--mayerbrown-2025.md]. The court did not hold that the
click-to-cancel requirements were themselves unlawful
[raw/renewal--eighth-circuit--mayerbrown-2025.md].

**A replacement is at the earliest possible stage.** The FTC filed an ANPRM with OIRA on
2026-01-30, announced it 2026-03-11, published it in the Federal Register 2026-03-13, and
closed comments 2026-04-13 [raw/renewal--ftc-anprm--covington-2026.md],
[raw/renewal--ftc-status--gibsondunn-2026.md]. An ANPRM precedes a notice of proposed
rulemaking, so there is no proposed rule text, no compliance date, and nothing to comply
with [raw/renewal--ftc-anprm--covington-2026.md].

**The rule that IS in force is narrow.** The 1973 Negative Option Rule was never vacated and
remains operative, but it is "limited to prenotification plans, such as
product-of-the-month clubs, in which consumers are charged unless they affirmatively decline
an offer" [raw/renewal--ftc-anprm--covington-2026.md]. It does not reach an ordinary SaaS
annual auto-renewal [raw/renewal--ftc-anprm--covington-2026.md].

**What the FTC can still do.** ROSCA and Section 5 of the FTC Act remain "fully operative",
and the Commission has continued filing complaints and announcing settlements on
subscription practices under them [raw/renewal--ftc-status--gibsondunn-2026.md],
[raw/renewal--eighth-circuit--mayerbrown-2025.md].

**The one-paragraph version to use in output:** As of 2026-08-17 there is no federal
click-to-cancel rule. The 2024 rule was vacated on procedural grounds in July 2025, a
replacement is at advance-notice-of-rulemaking stage with comments closed in April 2026, and
federal enforcement runs through ROSCA and FTC Act Section 5. Real cancellation-ease
obligations come from state law, principally California, and from the vendor's own contract.

### Where sources agree and where they are silent

All three law firm sources agree on the vacatur, its date, its procedural basis, and the
survival of ROSCA and Section 5. None of them predicts what the replacement rule will
require. The archive contains no basis for a prediction and this distillation makes none.

---

## 2. State automatic renewal law, and why it may not cover a business buyer

| State | Effective | Requirement recorded |
|---|---|---|
| California (AB 2863) | 2025-07-01 | Express affirmative consent; retention offers only alongside a same-page button that immediately effectuates cancellation; cancellation by the same medium used to sign up |
| Arkansas | 2025-08-03 | "Largely mirrors the California auto-renewal law in all respects" |
| Colorado | 2025-08-06 cancellation, 2026-02-16 consumer definition | One-step online cancellation link |
| Massachusetts | 2025-09-02 | Point-of-sale disclosures; obligations for shorter terms |
| New York | 2025-11-05 | Price increase consent, or a 14-day cancellation window; pre-billing disclosure |
| Maine | 2026-01-01 | Separate consent to the auto-renewal provision |
| Maryland | 2026-06-01 | Pre-trial and discount notices; alternative cancellation options |
| Connecticut | 2026-07-01 | Annual renewal reminders; strict phone cancellation requirements |

All rows [raw/renewal--state-arls--zwillgen-2026.md].

California specifics worth carrying: annual reminders are mandated and must identify the
product, the charge frequency and amount, and the means of cancellation, but the source does
not state how many days before renewal the reminder must go out
[raw/renewal--california-arl--dtolaw-2025.md]. Price-increase notice must be given "between
7 and 30 days before the fee change takes effect", retainable by the consumer
[raw/renewal--california-arl--dtolaw-2025.md]. Online cancellation must "simultaneously and
prominently display a direct link or click-to-cancel button", phone lines must be answered
promptly in business hours, and a voicemail cancellation must be processed within one
business day [raw/renewal--california-arl--dtolaw-2025.md]. ZwillGen records the California
price-increase window as 7 to 30 **business** days [raw/renewal--state-arls--zwillgen-2026.md]
while DTO Law records it as 7 to 30 days [raw/renewal--california-arl--dtolaw-2025.md]. The
sources conflict on whether the days are business days. Prefer the narrower reading, treat
the notice as arriving inside about one month, and do not quote the exact count to a user.

**The scope trap.** These are consumer statutes. A business buying software on a business
account frequently falls outside them [raw/renewal--state-arls--zwillgen-2026.md]. Colorado
is the exception in progress: its amendments "broaden the existing definition of 'consumer'
to arguably apply to B2B subscriptions", and the source words that as arguable rather than
settled [raw/renewal--state-arls--zwillgen-2026.md].

### The business-to-business lever

New York General Obligations Law 5-903 covers contracts for service, maintenance, or repair
to real or personal property, and it runs against the vendor: the automatic renewal
provision is "unenforceable against the person receiving the service, maintenance or repair"
unless the vendor served written notice "at least fifteen days and not more than thirty days
previous to the time specified for serving such notice", personally or by certified mail
[raw/renewal--ny-b2b-notice--nysenate-gol-5-903.md]. It does not apply where the renewal
period is one month or less [raw/renewal--ny-b2b-notice--nysenate-gol-5-903.md].

Two limits. Whether the statute reaches a pure software subscription is unresolved and no
source in this archive settles it [raw/renewal--ny-b2b-notice--nysenate-gol-5-903.md]. And it
is New York law, so the contract's choice-of-law clause governs whether it is even in play
[raw/renewal--ny-b2b-notice--nysenate-gol-5-903.md]. Raise it as a question for a lawyer,
never as a conclusion.

---

## 3. The cancellation window, and why it is the number that matters

The operative deadline is not the renewal date. It is the notice deadline, typically 30 to
90 days before renewal, and a reminder set two weeks before renewal is already too late to
negotiate [raw/contracts--missed-renewals--lapsewise-2026.md].

Benchmark distribution, from the largest stated dataset in the archive, more than 10,000
cloud service agreements:

| Figure | Value |
|---|---|
| Agreements with automatic renewal | 85% |
| Auto-renewing agreements requiring 30 days notice of non-renewal | 84% |
| Agreements with an automatic fee increase on renewal | 21% |
| Most common automatic increase size | 5% to 8% |

All rows [raw/contracts--notice-benchmark--commonpaper-2025.md].

**Sources conflict on the typical notice length.** Common Paper's corpus puts 84% at 30 days
[raw/contracts--notice-benchmark--commonpaper-2025.md]. CloudNuro describes the range as "30-90
days before expiration" [raw/contracts--renewal-timeline--cloudnuro-2026.md]. Lapsewise says
48% of B2B contracts carry 60 to 90 day windows and gives no attribution for that figure
[raw/contracts--missed-renewals--lapsewise-2026.md]. Prefer Common Paper, because it is the
only one of the three that states its dataset. So: **default assumption 30 days, and treat
60 and 90 day windows as live possibilities that have to be checked in the contract, not
ruled out.** The practical rule that survives the conflict is to compute the decision
deadline at renewal minus 30 and separately flag that a longer window would mean the
deadline has already passed.

**The self-serve exception.** The Common Paper corpus is standardized contract paper. A
self-serve credit-card plan with no negotiated agreement often has no notice requirement at
all and simply cancels effective at the end of the current term
[raw/contracts--notice-benchmark--commonpaper-2025.md]. Do not apply a 30-day window to a
self-serve plan without evidence.

### The renewal work calendar

| Window before renewal | Stage |
|---|---|
| 120 days and earlier | Identify contracts expiring in the next 120 to 180 days |
| 90 to 120 days | Usage analysis, vendor research |
| 60 to 90 days | Formal vendor engagement, quote requests |
| 30 to 60 days | Active negotiation, typically 2 to 4 rounds |
| 0 to 30 days | Final approvals and execution |

All rows [raw/contracts--renewal-timeline--cloudnuro-2026.md].

This is the justification for a 90-day horizon rather than a 30-day one. At 90 days out every
stage is still available. At 30 days out the negotiation stage has started or passed and a
30-day notice window closes that day [raw/contracts--renewal-timeline--cloudnuro-2026.md].

Bind that against the reminder discipline: begin assessment at the notice deadline, and add a
30-day buffer before it for internal approvals [raw/contracts--missed-renewals--lapsewise-2026.md].

---

## 4. Price movement at renewal, and how much of it to believe

| Claim | Value | Source quality |
|---|---|---|
| Automatic increase written into the contract | 5% to 8%, in 21% of agreements | Stated 10,000-plus contract dataset [raw/contracts--notice-benchmark--commonpaper-2025.md] |
| Average vendor price rise, 2024 | 12% to 18% | Vendor blog, no sample named [raw/contracts--renewal-timeline--cloudnuro-2026.md] |
| Typical annual escalation at renewal | 3% to 8% | Vendor blog, no attribution [raw/contracts--missed-renewals--lapsewise-2026.md] |
| Savings from a structured renewal process | 15% to 30% | Vendor blog, no sample named [raw/contracts--renewal-timeline--cloudnuro-2026.md] |

**These do not reconcile and should not be averaged.** The only figure with a stated dataset
behind it is the 5% to 8% contractual escalator
[raw/contracts--notice-benchmark--commonpaper-2025.md]. The 12% to 18% figure describes an
enterprise cohort with no named sample [raw/contracts--renewal-timeline--cloudnuro-2026.md].
Use the contractual escalator range as the projection basis and quote the others, if at all,
as vendor estimates about enterprises.

### Hosting is the exception that breaks projection entirely

Hosting renewal rates run 2x to 4x the introductory rate, with worked examples at $2.99
renewing to $11.99, $4.99 to $14.99, and $6.99 to $24.99
[raw/hosting--renewal-price-jump--bisup-2026.md]. The model is deliberate: "The low price is
real but temporary. It usually covers only your first billing cycle", and providers rely on
migration friction to hold the customer through the increase
[raw/hosting--renewal-price-jump--bisup-2026.md].

Consequence: for a hosting item coming off its first promotional term, the prior charge is a
systematically bad predictor of the next one, in the direction of a large underestimate
[raw/hosting--renewal-price-jump--bisup-2026.md]. Mitigations the source lists are locking a
two to three year term at the intro rate, choosing hosts that disclose renewal pricing up
front, and asking for a loyalty discount before renewal
[raw/hosting--renewal-price-jump--bisup-2026.md].

---

## 5. Domains: the lifecycle, and what actually breaks

ICANN's Expired Registration Recovery Policy binds accredited registrars for gTLDs and sets
the notice obligations [raw/domain--errp-policy--icann-2024.md]:

- At least two notices before expiration, one "approximately one month prior" and one
  "approximately one week prior", where the policy notes accept 26 to 35 days and 4 to 10
  days as compliant [raw/domain--errp-policy--icann-2024.md].
- At least one further notice within five days after expiration, carrying renewal
  instructions [raw/domain--errp-policy--icann-2024.md].

**ICANN mandates DNS interruption, not a grace period.** For a registration deleted within
eight days of expiration the existing DNS resolution path "must be interrupted" from
expiration until deletion; for a later deletion, at least the last eight consecutive days
before deletion must be interrupted [raw/domain--errp-policy--icann-2024.md]. Registrars may
point interrupted traffic at a renewal notice page [raw/domain--errp-policy--icann-2024.md].
The policy sets no minimum post-expiration renewal grace period; that length is registrar
business practice [raw/domain--errp-policy--icann-2024.md].

Registrar practice, as described by a registrar:

| Phase | Duration | Status | Service state |
|---|---|---|---|
| Expiration day | day 1 | clientHold or serverHold | "Websites stop resolving, email stops routing" |
| Renewal grace | 30 to 45 days | clientHold | Offline, standard renewal fee |
| Redemption | approximately 30 days | redemptionPeriod | Offline, extra redemption fee |
| Pending delete | 5 days | pendingDelete | Locked, unrecoverable |
| Public release | ongoing | new owner | Open to anyone |

All rows [raw/domain--expiry-lifecycle--opensrs-2025.md]. "Most registrars suspend connected
services right away" on expiry [raw/domain--expiry-lifecycle--opensrs-2025.md]. After
deletion the name returns to the pool and "high-value domains are often claimed instantly
through backorder services" [raw/domain--expiry-lifecycle--opensrs-2025.md].

Two precision points. The Redemption Grace Period runs 30 days from **deletion**, not from
expiry [raw/domain--errp-policy--icann-2024.md]; conflating the two produces a wrong
deadline. And the whole path from expiry to permanent loss runs roughly 65 to 80 days, with
the site dark for essentially all of it [raw/domain--expiry-lifecycle--opensrs-2025.md].

**Why domains outrank dollars.** Expiry stops mail routing, not just web serving
[raw/domain--expiry-lifecycle--opensrs-2025.md]. A user whose mail is down stops receiving
password resets, client replies, and the renewal notices for everything else they own. A $12
domain therefore outranks a $2,000 software renewal on severity.

---

## 6. TLS certificates: a moving target, not an annual item

CA/Browser Forum ballot SC-081v3 passed with voting closing 2025-04-11 and sets a stepped
reduction [raw/ssl--validity-schedule--digicert-2025.md]:

| Effective | Max validity | DCV reuse |
|---|---|---|
| Until 2026-03-15 | 398 days | 398 days |
| 2026-03-15 to 2027-03-14 | 200 days | 200 days |
| 2027-03-15 to 2029-03-14 | 100 days | 100 days |
| 2029-03-15 onward | 47 days | 10 days |

All rows [raw/ssl--validity-schedule--digicert-2025.md]. Subject identity information reuse
drops to 398 days from 825 on 2026-03-15, for OV and EV only
[raw/ssl--validity-schedule--digicert-2025.md]. An independent CA corroborates the 200-day
step from the same date [raw/ssl--200-day-risk--sectigo-2026.md].

Operational consequence, per that CA: treat a 200-day certificate as renewing at the 180-day
mark, giving roughly two renewals a year against one previously, rising to roughly 3.6 a
year at 100 days from March 2027 and roughly 7.8 a year at 47 days from March 2029
[raw/ssl--200-day-risk--sectigo-2026.md].

**This breaks year-over-year projection for certificates specifically.** The term length
itself changed on 2026-03-15, so last year's expiry date does not predict this year's
[raw/ssl--validity-schedule--digicert-2025.md]. Read the current certificate's own expiry.

Failure mode: expiry is an instantaneous full outage, not a degradation. Named organizations
that have taken one include Shopify, Microsoft, Starlink, Spotify, LinkedIn, and US
government sites, the last with 80 certificates expiring at once
[raw/ssl--expiry-outages--redsift-keyfactor-2024.md]. A vendor-reported survey attributed to
the Keyfactor 2024 PKI and Digital Trust Report puts respondents at an average of three
expiry-caused outages over 24 months, 2.6 hours to identify and 2.7 hours to remediate
[raw/ssl--expiry-outages--redsift-keyfactor-2024.md].

**Do not quote the dollar figure.** That same source's roughly $2,862,000 average outage cost
is a $9,000-per-minute enterprise downtime assumption multiplied by a duration, and it does
not describe a small operator [raw/ssl--expiry-outages--redsift-keyfactor-2024.md]. Quote the
failure mode, not the price.

---

## 7. Named gaps in this archive

1. **No source establishes how far ahead a renewal reminder is actually useful.** The 90-day
   horizon is derived from the renewal work calendar
   [raw/contracts--renewal-timeline--cloudnuro-2026.md] plus the 30-day notice default
   [raw/contracts--notice-benchmark--commonpaper-2025.md]. It is a reasoned convention, not a
   measured optimum. Present it as this skill's convention and let the user move it.
2. **No solo-operator or small-agency data.** Every quantitative source describes enterprise
   or mid-market buyers. The dollar figures in
   [raw/contracts--missed-renewals--lapsewise-2026.md] explicitly describe $30,000 to
   $120,000 contracts. Nothing here calibrates a one-person business.
3. **California's annual reminder timing is unresolved.** The statute mandates an annual
   reminder but the archived source does not state how far ahead it must be sent
   [raw/renewal--california-arl--dtolaw-2025.md].
4. **Whether NY GOL 5-903 reaches software subscriptions is unresolved**
   [raw/renewal--ny-b2b-notice--nysenate-gol-5-903.md].
5. **No source measures how accurate prior-year-charge projection is.** The skill's practice
   of projecting an annual renewal date from last year's charge is a reasoned inference with
   one documented exception class (hosting promotional terms
   [raw/hosting--renewal-price-jump--bisup-2026.md] and certificates
   [raw/ssl--validity-schedule--digicert-2025.md]). Its general accuracy is untested here.
6. **Commercial interest is pervasive.** Nine of fifteen sources sell renewal tracking, SaaS
   management, certificate automation, contract tooling, or hosting. Their statistics are
   quoted as vendor estimates.
7. **No non-US coverage.** Everything legal here is United States law. A user with a European
   or United Kingdom vendor relationship gets nothing from section 1 or 2.
