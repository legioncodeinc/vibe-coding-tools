# Domains and certificates

A separate class in the output, ranked separately, and never sorted by dollar amount.

The reason: a lapsed software subscription is an inconvenience the user discovers privately.
A lapsed domain or certificate fails loudly, in public, to every visitor and every customer,
and one of the two takes the user's email down with it.

## Why these do not belong in the software calendar

**A domain expiry stops mail routing, not just web serving.** On the expiration day the
status flips to clientHold or serverHold and "Websites stop resolving, email stops routing"
[research/distilled-renewal-and-expiry-practice.md, section 5]. Most registrars suspend
connected services immediately [same].

Follow the consequence through. Mail is down, so the user stops receiving password resets,
client replies, and **the renewal notices for everything else they own.** A $12 domain
therefore outranks a $2,000 software renewal on severity
[research/distilled-renewal-and-expiry-practice.md, section 5]. Rank this class by blast
radius, never by price.

**A certificate expiry is an instantaneous full outage**, not a degradation. Organizations
that have taken one include Shopify, Microsoft, Starlink, Spotify, LinkedIn, and US
government sites, the last with 80 certificates expiring at once
[research/distilled-renewal-and-expiry-practice.md, section 6].

## The domain lifecycle, with the day counts

| Phase | Duration | Status | Service state |
|---|---|---|---|
| Expiration day | day 1 | clientHold or serverHold | Site and mail down |
| Renewal grace | 30 to 45 days | clientHold | Offline, standard renewal fee |
| Redemption | approximately 30 days | redemptionPeriod | Offline, extra redemption fee |
| Pending delete | 5 days | pendingDelete | Locked, unrecoverable |
| Public release | ongoing | new owner | Anyone can register it |

All rows [research/distilled-renewal-and-expiry-practice.md, section 5].

Three precision points the output must get right.

1. **ICANN mandates DNS interruption, not a grace period.** For a registration deleted within
   eight days of expiration the DNS resolution path must be interrupted from expiration until
   deletion; for a later deletion, at least the last eight consecutive days before deletion
   [research/distilled-renewal-and-expiry-practice.md, section 5]. ICANN sets no minimum
   post-expiration renewal grace period at all; that length is registrar business practice
   [same]. Never tell a user they have a guaranteed grace period.
2. **The Redemption Grace Period runs 30 days from deletion, not from expiry**
   [research/distilled-renewal-and-expiry-practice.md, section 5]. Conflating the two
   produces a deadline that is roughly a month too late, which is the worst possible
   direction to be wrong in.
3. **The whole path from expiry to permanent loss runs roughly 65 to 80 days, with the site
   dark for essentially all of it** [research/distilled-renewal-and-expiry-practice.md,
   section 5]. After deletion the name goes back to the pool and high-value names "are often
   claimed instantly through backorder services" [same]. Recovery after that means buying it
   back from whoever caught it, or not at all.

## The registrar notices the sweep is looking for

ICANN's Expired Registration Recovery Policy binds accredited registrars for gTLDs and
requires at least two notices before expiration: one approximately one month prior and one
approximately one week prior, where 26 to 35 days and 4 to 10 days prior are treated as
compliant [research/distilled-renewal-and-expiry-practice.md, section 5]. At least one
further notice must go out within five days after expiration
[research/distilled-renewal-and-expiry-practice.md, section 5].

That predictability is useful in both directions:

- The notices exist and are findable. Query for them.
- **Their absence is informative.** If a domain is inside 35 days of a known expiry and no
  registrar notice appears in capture, the likeliest explanations are that the notices are
  going to an address the user does not read, or that auto-renew is on and the registrar is
  sending a renewal confirmation instead. Both are worth a line in the output. Neither is
  proof of anything on its own [evidence-standards.md, rule 2].

## Certificates: never project from last year

The maximum TLS certificate validity is on a stepped reduction schedule set by CA/Browser
Forum ballot SC-081v3:

| Effective | Max validity | Domain validation reuse |
|---|---|---|
| Until 2026-03-15 | 398 days | 398 days |
| 2026-03-15 to 2027-03-14 | 200 days | 200 days |
| 2027-03-15 to 2029-03-14 | 100 days | 100 days |
| 2029-03-15 onward | 47 days | 10 days |

All rows [research/distilled-renewal-and-expiry-practice.md, section 6].

**The term length itself changed on 2026-03-15**, so last year's expiry date does not predict
this year's [research/distilled-renewal-and-expiry-practice.md, section 6]. This is the one
class where the skill's core projection technique is prohibited outright. Read the
certificate's own expiry, from a dashboard capture, a monitoring alert, or the user.

Operating consequence: a CA recommends treating a 200-day certificate as renewing at the
180-day mark, giving roughly two renewals a year against one previously, rising to roughly
3.6 a year at 100 days from March 2027 and roughly 7.8 a year at 47 days from March 2029
[research/distilled-renewal-and-expiry-practice.md, section 6].

For the 90-day calendar that means:

- Carry a certificate from roughly 90 days before its expiry.
- Mark the action date at expiry minus 20 days, derived from the 180-day renewal target
  against a 200-day term [research/distilled-renewal-and-expiry-practice.md, section 6].
- **An item that was outside the horizon at the last weekly run can be inside it at the next
  one.** With two to four certificate events a year, the forward calendar changes composition
  faster for certificates than for anything else. Do not assume last week's certificate list
  is still complete.

### The automation question, asked once

Where a certificate is issued by an automated system, expiry is a monitoring question rather
than a renewal question and the user does not need a calendar entry for it. Ask once, record
the answer, and stop surfacing automated certificates as decisions.

Where the certificate is manually purchased and installed, it stays on the calendar. Under
the shortening schedule that manual burden roughly doubles in 2026 and roughly quadruples in
2027 [research/distilled-renewal-and-expiry-practice.md, section 6], which is itself worth
one line to the user, once, as a note rather than a recommendation.

## Hosting sits between the two classes

Hosting is a subscription, so it goes on the software calendar, but it carries a domain-class
consequence when it lapses and a pricing behavior that breaks projection.

**The pricing behavior.** Hosting renewal rates run 2x to 4x the introductory rate, with
worked examples at $2.99 renewing to $11.99, $4.99 to $14.99, and $6.99 to $24.99
[research/distilled-renewal-and-expiry-practice.md, section 4]. The model is deliberate and
relies on migration friction holding the customer through the increase [same].

So for a hosting item coming off its first promotional term, the prior charge is a
systematic underestimate [research/distilled-renewal-and-expiry-practice.md, section 4].
Project the date, and in place of an amount write "promotional term ending, expect an
increase, historically 2x to 4x in this category". Give no single figure and no false
precision.

**The levers, for a user who wants to keep the host:** lock a two to three year term at the
introductory rate, prefer hosts that disclose the renewal price up front, and ask for a
loyalty discount before renewal [research/distilled-renewal-and-expiry-practice.md,
section 4].

## Severity ranking within this class

Rank by what breaks and how recoverable it is. Not by amount.

| Rank | Item | Why |
|---|---|---|
| 1 | Domain carrying the user's email | Mail down means every other notice is missed too |
| 2 | Domain carrying a live customer-facing site | Public failure, and permanent loss after the drop |
| 3 | Certificate on a customer-facing or payment-handling endpoint | Instant full outage, browser interstitial, API clients fail |
| 4 | Certificate on an internal endpoint | Outage, contained audience |
| 5 | Hosting renewal | Money, and the site if it lapses |
| 6 | Parked or unused domain | Money, and a name the user may or may not want |

## What not to say

Do not quote the roughly $2,862,000 average outage cost from the archived survey. It is a
$9,000-per-minute enterprise downtime assumption multiplied by a duration and it does not
describe a small operator [research/distilled-renewal-and-expiry-practice.md, section 6].
Quote the failure mode instead: the site returns a browser security warning, API clients
fail their TLS handshake, and nothing works until a new certificate is installed.
