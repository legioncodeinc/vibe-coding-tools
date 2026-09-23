# Renewal discovery

How to find things that are about to charge, from capture that was never organised around
renewals. This guide covers the sweep, the extraction, the projection rules, and the known
unknowns list.

Read `evidence-standards.md` first. The rule that governs everything below is rule 2: a
renewal date read off a notice is **observed**, a renewal date computed from last year's
charge is **inferred**, and the reader must be able to tell which one they are looking at
without asking.

## The two data windows, and why they differ

This skill runs two sweeps with different windows, for different reasons.

| Sweep | Window | What it is for |
|---|---|---|
| Current-signal sweep | 120 days back | Renewal notices, expiry warnings, auto-renew confirmations, registrar and hosting dashboards, price-change emails |
| Annual look-back | 13 months back | Last year's charge for an annual item, which is the strongest available predictor of this year's date |

**Why 120 days back for a 90-day forward calendar.** Renewal notices arrive ahead of the
event. A registrar is required to notify roughly 30 days and roughly 7 days before expiry
[research/distilled-renewal-and-expiry-practice.md, section 5]. A SaaS renewal reminder
typically lands somewhere in the 30 to 90 day pre-renewal band
[research/distilled-renewal-and-expiry-practice.md, section 3]. A 120-day back window
therefore catches notices for events that have not happened yet, plus the tail of the last
cycle. A 90-day back window would miss a 90-day advance notice by a day.

**Why 13 months for annual items.** An annual renewal is invisible for eleven months. There
is no notice to find inside 120 days for something that charges in month twelve. The only
evidence that it exists at all is last year's charge, so the sweep has to reach back past it.
Thirteen rather than twelve gives a month of margin for a charge that shifted.

**The tension with the research contract, stated plainly.** The authoring contract's
six-month default window governs DOMAIN research, meaning the age of the published sources
in `research/raw/`. It does not govern the user's own data window. A 13-month look-back over
the user's capture is not a contract violation, it is the only way an annual item is
findable. Say this to the user if they ask why the sweep goes back a year.

**The cost.** A 13-month sweep is expensive and returns a lot. Run it narrow: it is looking
for one thing per vendor, a charge, not for context. Do not run 13 months of broad queries.
Run 13 monthly windows of one tight query family, or run it only against the vendor names
already confirmed by the current-signal sweep and by the user.

## Query families

Run each with `search_user_context`. Use several narrow parallel queries rather than one
broad one; a broad query against this server returns 70,000-plus characters and gets written
to a file instead of returned [littlebird-mcp-reference.md, Oversized results].

### Family A. Renewal notices and auto-renew confirmations

`filters: {"data_source": "snapshots"}`, `date_range` 120 days back.

```
"your subscription renews on"
"your plan will automatically renew"
"upcoming renewal notice"
"annual renewal reminder"
"your subscription will be renewed for another year"
"we will charge your card on"
"your next payment is scheduled for"
```

### Family B. Expiry warnings

`filters: {"data_source": "snapshots"}`, 120 days back.

```
"your domain is expiring"
"domain expiration notice renew now"
"your certificate expires on"
"SSL certificate expiring in days"
"your plan expires on"
"license expires"
```

### Family C. Annual plan receipts

`filters: {"data_source": "snapshots"}`, 13 months back, walked in monthly windows.

```
"annual plan receipt"
"yearly subscription payment received"
"invoice for annual subscription"
"you saved by paying annually"
"1 year subscription order confirmation"
```

This is the family that finds the invisible eleven-month items. Every hit here becomes a
projected date, never an observed one, unless the receipt itself names the next renewal date.

### Family D. Registrar, hosting, and certificate dashboards

`filters: {"app": "chrome", "data_source": "snapshots"}`, 120 days back.

```
"domains expiring auto-renew on"
"registrar domain list expiry date"
"hosting account renewal date billing cycle"
"SSL certificates expiry status"
"nameservers domain manage renewal"
```

Dashboards are the highest-value surface in this skill, because a registrar's domain list
shows every domain and every expiry date in one screenshot. One good dashboard capture is
worth twenty notice emails.

### Family E. API plans and usage-metered commitments

`filters: {"data_source": "snapshots"}`, 120 days back.

```
"API plan renews"
"your committed use discount expires"
"credits expire on"
"usage plan billing period ends"
"your trial ends and you will be charged"
```

Trial-to-paid conversion belongs here. A trial ending is an about-to-charge event even
though nothing has ever charged before, and it is the one class where there is no prior
charge to project from.

### Family F. Message threads

`search_queries_messages`, 120 days back. Renewal and expiry warnings arrive as SMS and
in-app notifications, not only as email in a browser tab.

```
"subscription renewing"
"card will be charged"
"domain expires"
"payment due renewal"
```

### Family G. Activity digests

`filters: {"data_source": "summaries"}`, 120 days back, plus the same over the 13-month
window at lower frequency. Littlebird's own daily digests are the cheapest compressed view
of a period [littlebird-mcp-reference.md, Retrieval patterns]. Query renewal and vendor terms
against them.

## The calendar sweep

Run `LB_INTERNAL_LIST_MEETINGS` with a **future** `end_date`. That is how upcoming calendar
events are retrieved; there is no calendar tool
[littlebird-mcp-reference.md, Meeting tools].

```json
{"start_date": "2026-08-17", "end_date": "2026-11-15", "limit": 100}
```

What this catches: renewal reminders the user already set for themselves. People put
"cancel Adobe before it renews" on a calendar and then do not look at the calendar. Those
entries carry a date the user themselves believed, which makes them strong evidence.

Upcoming events appear as bare calendar entries with no id, no summary, and no transcript,
and they are not searchable [littlebird-mcp-reference.md, Meeting tools]. So read the titles
directly from the list output. Do not try to search them.

Also run `LB_INTERNAL_LIST_MEETINGS` with `name` set to a recurring vendor review title if
the user has one, which is the correct tool for finding prior instances of a recurring
meeting [littlebird-mcp-reference.md, Retrieval patterns, item 6].

## Extraction

For each hit, pull out:

| Field | Source | If missing |
|---|---|---|
| Item name | Vendor or domain as it appears | Do not guess a canonical name; record the string seen |
| Class | domain, certificate, hosting, API plan, software, other | `unclassified` |
| Renewal date | The date on the notice, or the projected date | `unknown`, and it goes to known unknowns |
| Date basis | observed, projected, or user-supplied | required, never blank |
| Amount | As shown | `not captured` |
| Amount basis | observed, projected, or estimated range | required, never blank |
| Cadence | annual, monthly, term-based, one-off | `unknown` |
| Notice window | See `cancellation-windows.md` | `assumed 30 days` with the assumption marked |
| Receipt | Canonical format per `evidence-standards.md` rule 1 | An item with no receipt is not on the calendar |

## Deduplicate before counting

OCR of a dashboard repeats lines, and the same renewal notice appears in a browser tab, an
email client, and a notification stack [littlebird-mcp-reference.md, Known limitations].
Collapse on vendor plus date before producing any list. Treat repeated identical lines as one
observation, and do not let a duplicate raise a confidence rating.

## Projection rules for annual items

This is where the skill is most likely to produce a confident wrong answer, so the rules are
strict.

1. **A projected date is never written as a date alone.** Write it as
   `2026-11-14 (projected from 2025-11-14 charge)`. The parenthetical is not optional.
2. **A projected date is Medium confidence at best**, and only when the prior charge is a
   clean annual receipt naming the vendor and the amount. One ambiguous OCR fragment
   projects to Low.
3. **Project the date, and separately decide whether to project the amount.** They have
   different reliability. The date usually holds. The amount frequently does not.
4. **Three classes where projection is prohibited:**
   - **Certificates.** The maximum validity period itself changed on 2026-03-15, from 398
     days to 200 days, so last year's expiry does not imply this year's
     [research/distilled-renewal-and-expiry-practice.md, section 6]. Read the certificate's
     own expiry instead.
   - **Hosting coming off a promotional term.** The renewal runs 2x to 4x the introductory
     rate by design [research/distilled-renewal-and-expiry-practice.md, section 4]. The
     prior amount is a systematic underestimate. Project the date, mark the amount as
     "promotional term ending, expect a large increase", and give no figure.
   - **Anything the user has told you they already cancelled.** A prior-year charge for a
     cancelled service projects a renewal that will not happen. Ask.
5. **A projected item that later gets a notice is upgraded, not merged.** When a real notice
   arrives for a projected item, replace the projection and say in the entry that it was
   previously projected and is now observed. The user learns to trust the projections by
   seeing them confirmed.

## Known unknowns: the section that keeps this honest

Absence of evidence is not evidence of no renewal. A vendor with no captured renewal signal
is not a vendor with no renewal; it is a vendor whose renewal has not been found yet.

Build the known unknowns list from three inputs:

1. **User-confirmed vendors with no date found.** Ask the user directly, using
   `AskUserQuestion`, what they pay for annually. Every named vendor that produced no date
   in either sweep goes on this list.
2. **Vendors observed paying but with unknown cadence.** A single receipt with no cadence
   evidence cannot be placed on a forward calendar.
3. **Items the sibling skill found.** If `money-leak-auditor` has run, its confirmed vendor
   ledger is the best available roster of what the user pays for. Read its output and check
   every confirmed vendor against the calendar. A vendor on that ledger with no entry here is
   a known unknown by definition.

Each known unknown carries what was searched and what would close the gap. The line shape:

```
Vendor: Figma
Status: user-confirmed paid, no renewal date found
Swept: 2026-04-19 to 2026-08-17 (families A, B, C, D, G); 2025-07-17 to 2026-08-17 (family C)
Last observation of any kind: [Monday, July 6, 2026 11:02 EDT | chrome], a design file, not billing
To close the gap: open the Figma billing page once while Littlebird is capturing, or tell me
  the renewal month and I will project from it
```

That last line matters. The user can close most of these gaps in about ninety seconds, and
telling them how is more useful than telling them the gap exists.

## Empty sweep

If families A through E return nothing across the whole window, the run ends. Report the
windows, the queries, the filters, and the fact that no renewal or expiry evidence was found.
Do not reconstruct a plausible renewal calendar from what a business of this shape usually
buys [evidence-standards.md, rule 9].

If the sweep returns nothing even for items the user has just told you they pay for, suspect
the sweep, not the stack. Check the date window and the filter values, and report the
malfunction rather than declaring the user has no renewals.
