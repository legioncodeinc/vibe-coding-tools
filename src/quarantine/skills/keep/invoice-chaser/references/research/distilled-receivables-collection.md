# Distilled: accounts receivable collection for small businesses

Written from a fresh read of the 16 files in `raw/` on 2026-08-17. Every claim ends in a
bracketed citation to the raw file it came from. Nothing here comes from training data.
Where sources disagree, both readings are printed and the preference is stated.

Nothing in this file is legal advice. Section 4 in particular summarizes what published
sources say about statutes; it is not a legal opinion and it does not survive contact with
a specific state, a specific contract, or a specific client.

---

## 1. How collection probability decays with age

The one number every collection vendor quotes traces to a single body of data:
Commercial Collection Agencies of America, whose member agencies are described as
handling roughly 60% of claims placed with professional commercial collection agencies in
the United States [raw/aging--collectibility-by-age--cstworldwide-ccaofa.md].

The fullest reproduction of that table:

| Delinquency from invoice due date | Collection potential |
|---|---|
| 1 month | 88.7% |
| 3 months | 68.9% |
| 6 months | 51.3% |
| 9 months | 37.5% |
| 12 months | 21.4% |
| 18 months | 15.2% |
| 24 months | 8.9% |

[raw/aging--collectibility-by-age--crfonline-ccaofa.md]

**Conflict.** A second vendor citing the same CCA of A survey prints 3 months at 68.9%
and 6 months at 51.3%, matching the table above, but then prints "1 year" at 8.9%, which
is the 24-month row in the CRF Online reproduction
[raw/aging--collectibility-by-age--cstworldwide-ccaofa.md]. One of the two mislabeled a
row. **Preference: the CRF Online seven-row table.** It is published by a credit research
association rather than a collection agency selling placement, it is internally monotonic,
and the disputed 8.9% appears in it at a position (24 months) that makes arithmetic sense
next to 15.2% at 18 months. Quote 21.4% at twelve months, and say the source is disputed
if the twelve-month figure is load-bearing.

**A third source is unusable for its numbers.** A receivables consultancy prints bands by
days past due where 121-180 days (40% to 50%) is *higher* than 91-120 days (30% to 40%),
and 360-plus ("Less than 70%") is a weaker constraint than 181-plus ("Less than 50%")
[raw/aging--collectibility-by-age--leibsolutions-2026.md]. Collectibility cannot rise with
age. Use that source only for its qualitative claim, which is that the collapse clusters
around the 90-day mark, and for its statement that "the time for outside, 'third-party'
collection agency action is when the debt may still be collectible, best from 90-120 days
past due. Waiting too long is to invite a total write-off"
[raw/aging--collectibility-by-age--leibsolutions-2026.md].

**What survives all three.** The decay is steep and front-loaded. Roughly a fifth of
collectability is gone by three months and roughly half by six
[raw/aging--collectibility-by-age--crfonline-ccaofa.md]. Two independent sources place the
action threshold at 90 to 120 days past due
[raw/aging--collectibility-by-age--leibsolutions-2026.md],
[raw/cadence--reminder-sequence--chaser-2026.md]. That is the entire justification for
bucketing by age instead of treating every unpaid invoice the same.

**Gap.** No source in this archive states when CCA of A collected the data, the sample
size, the industry mix, or whether "collection potential" means full or partial recovery
[raw/aging--collectibility-by-age--crfonline-ccaofa.md]. Present the curve as a shape, not
as a forecast for a specific invoice.

---

## 2. How common late payment is, and how late

| Figure | Value | Source |
|---|---|---|
| US small businesses with invoices 30-plus days overdue | 59%, up from 47% the prior year | [raw/benchmarks--smb-late-payment--quickbooks-2026.md] |
| Average amount outstanding per business | $17.7K, versus $17.5K prior year | [raw/benchmarks--smb-late-payment--quickbooks-2026.md] |
| Businesses with at least 20% of invoices past 30 days | 22% | [raw/benchmarks--smb-late-payment--quickbooks-2026.md] |
| Owners for whom one late payment threatened payroll or bills | 39% | [raw/benchmarks--smb-late-payment--quickbooks-2026.md] |
| Owners for whom a missed payment under $5,000 did the same | 27% | [raw/benchmarks--smb-late-payment--quickbooks-2026.md] |
| US average days late, Dec 2025 quarter | 7.8 days, shortest in four years | [raw/benchmarks--days-late--xero-sbi-2026.md] |
| Same measure, other countries | NZ 4.5, AU 6.6, UK 8.0, CA 9.7 | [raw/benchmarks--days-late--xero-sbi-2026.md] |
| Share of B2B invoiced sales overdue, US/UK/Asia | over 50% | Atradius 2023, via [raw/benchmarks--ar-statistics-roundup--paidnice-2026.md] |
| Time spent chasing invoices | about 5 hours a week, 10% of the workday | Xero 2024, via [raw/benchmarks--ar-statistics-roundup--paidnice-2026.md] |

**Tension worth stating rather than smoothing.** Platform data says average lateness is
falling and is now under eight days in the US
[raw/benchmarks--days-late--xero-sbi-2026.md], while survey data says the share of
businesses carrying 30-plus-day overdue invoices jumped from 47% to 59% in a year
[raw/benchmarks--smb-late-payment--quickbooks-2026.md]. These are not the same measure:
"average days late across all invoices" and "does this business have any invoice 30-plus
days out" can move in opposite directions when the mass moves to the tails. Both can be
true. Neither should be quoted as "late payment is getting better" or "getting worse."

**Weighting.** The Xero figure comes from anonymized platform records
[raw/benchmarks--days-late--xero-sbi-2026.md]; the QuickBooks figure comes from a
self-reported online survey of 1,305 US business owners commissioned by a company that
sells instant-payout products [raw/benchmarks--smb-late-payment--quickbooks-2026.md].
Prefer the platform data for magnitude and the survey for prevalence, and say which is
which.

**Caution on the automation figures.** The AR-statistics roundup carries a stack of
automation benefit claims (62% saw DSO reductions, 25% reduction in overdue payments, 91%
of mid-sized firms report gains, and the aggregator's own claim of roughly 50% DSO
reduction within 30 days) that are secondary citations, three to five years old, and
published by parties selling AR automation
[raw/benchmarks--ar-statistics-roundup--paidnice-2026.md]. Do not quote any of them as
evidence that this skill will speed up collection.

---

## 3. Reminder cadence, and where the ladder stops

The published convention, from a credit control vendor:

| Rung | Timing | Tone |
|---|---|---|
| Pre-due | 7 days before due | Warm and helpful |
| Due date | On the due date | Friendly and clear |
| First overdue | 1 to 3 days late | Polite, no blame |
| Second reminder | 7 days late | Firm but respectful |
| Payment plan offer | 14 days late | Empathetic and clear |
| First formal notice | 30 days late | Formal and direct |
| Second formal notice | 60 days late | Serious and factual |
| Final notice | 90 days late | Formal and final |

[raw/cadence--reminder-sequence--chaser-2026.md]

Shape of the whole thing, verbatim: "Most businesses send a pre-due reminder, a due-date
prompt, and two or three overdue reminders before moving to a formal notice at around 30
days" [raw/cadence--reminder-sequence--chaser-2026.md].

**Channel switch is a documented rung, not an improvisation.** "When email goes quiet, a
friendly call often resolves things faster than another message"
[raw/cadence--reminder-sequence--chaser-2026.md]. Collections placement sits after the
90-day final notice [raw/cadence--reminder-sequence--chaser-2026.md], which lines up with
the 90-to-120-day window the collectability sources name
[raw/aging--collectibility-by-age--leibsolutions-2026.md].

A second vendor recommends a tighter pre-due pattern: a reminder three days before due and
again on the due date, then follow-up at regular intervals
[raw/prevention--payment-terms--xero-guide-2026.md]. Seven days before due and three days
before due are both published; nothing in the archive tests which is better.

**Gap, and it is a large one.** No source in this archive quantifies reminder
effectiveness. The strongest claim available is "A pre-due reminder is the most underused
message in credit control, and it prevents more late payments than any other," asserted
with no supporting figure whatsoever
[raw/cadence--reminder-sequence--chaser-2026.md]. Both cadence sources sell software that
automates the cadence they recommend
[raw/cadence--reminder-sequence--chaser-2026.md],
[raw/prevention--payment-terms--xero-guide-2026.md]. Treat the ladder as industry
convention with commercial motive behind it, never as a tested schedule.

---

## 4. The legal boundary, for a business collecting its own accounts

**This is a summary of published sources, not legal advice.**

Two independent limits appear in the FDCPA's own text.

**Limit one, the definition of "debt".** 15 U.S.C. 1692a(5) defines debt as an obligation
of a consumer arising from a transaction where the money, property, insurance, or services
"are primarily for personal, family, or household purposes"
[raw/law--fdcpa-definitions--uscode-1692a.md]. A business-to-business invoice is not that.
"The FDCPA does not cover commercial debt collection"
[raw/law--fdcpa-scope-business--findlaw-2024.md].

**Limit two, the definition of "debt collector".** 1692a(6) reaches a person in a business
"the principal purpose of which is the collection of any debts," and expressly excludes
"any officer or employee of a creditor while, in the name of the creditor, collecting
debts for such creditor" [raw/law--fdcpa-definitions--uscode-1692a.md]. Restated plainly:
"A person or entity that collects its own debts or does so only in isolated instances is
not considered a debt collector," and the Act "does not apply to the company owed the
debt" [raw/law--fdcpa-scope-business--findlaw-2024.md]. The CFPB states the same in
consumer-facing language: the FDCPA "doesn't generally cover collection by the original
creditor or business you owed money to" [raw/law--fdcpa-scope--cfpb-askcfpb.md].

**So the federal call-frequency rule does not bind this user.** Regulation F's
seven-calls-in-seven-consecutive-days presumption, and the separate presumption against
calling within seven consecutive days of having had a telephone conversation about the
debt, are both written as constraints on "a debt collector"
[raw/law--regf-contact-frequency--ecfr-1006-14.md],
[raw/law--regf-contact-frequency--ballardspahr-2020.md].

**Three reasons that does not make the numbers useless.**

1. Those limits are a *rebuttable presumption*, not a safe harbor. Exceeding them presumes
   a violation, and staying under them "doesn't guarantee protection against harassment
   claims" [raw/law--regf-contact-frequency--ballardspahr-2020.md]. If seven contacts in
   seven days is not automatically safe for a professional collector, it is a bad ceiling
   for anyone.
2. The general prohibition in 1006.14(a) is on "any conduct the natural consequence of
   which is to harass, oppress, or abuse"
   [raw/law--regf-contact-frequency--ecfr-1006-14.md]. That is a description of behavior, and
   a client experiencing it does not check the statute before deciding never to hire the
   user again.
3. The medium opt-out rule in 1006.14(h) says a collector must not keep using a channel
   the person asked them to stop using
   [raw/law--regf-contact-frequency--ecfr-1006-14.md]. As ordinary courtesy this is free to
   adopt.

**State law can be broader, and at least one state is.** California's Rosenthal Fair Debt
Collection Practices Act "protects debtors from first-party creditors. It prohibits
harassment from both third-party debt collectors and original creditors"
[raw/law--state-broader--rosenthal-kandh.md]. The CFPB notes generally that "Most states
have laws about debt collection practices, many of which are similar to the FDCPA" and
that "States also have unfair and deceptive acts and practices laws that may apply to debt
collection" [raw/law--fdcpa-scope--cfpb-askcfpb.md]. FindLaw likewise: "State laws can
also address what creditors may do" [raw/law--fdcpa-scope-business--findlaw-2024.md].

**Gap, and it is the sharpest one in this archive.** The Rosenthal source is a law firm
marketing blog that quotes no statutory definition, cites no California Civil Code
section, and does not resolve whether Rosenthal reaches commercial or B2B debt
[raw/law--state-broader--rosenthal-kandh.md]. No source in this archive surveys the other
49 states. So the supportable claim is narrow: *at least one state extends
harassment rules to original creditors, so the federal carve-out is not the end of the
question, and the user's own state has to be checked by a lawyer.* Any statement stronger
than that is not supported here.

---

## 5. Late fees and interest

- A late fee generally has to be agreed in writing beforehand. "Always specify your late
  fee terms in writing before extending credit," and without written terms a creditor
  falls back to state default rates, which are typically much lower
  [raw/latefees--enforceability-by-state--clearreceivables-2026.md].
- Commercial convention: "commercial late fees of 1.5% to 2% per month (18-24%
  annualized) are widely enforced across most states"
  [raw/latefees--enforceability-by-state--clearreceivables-2026.md].
- Consumer and commercial are treated very differently. "The legal treatment of late fees
  differs dramatically between commercial and consumer contexts," with commercial terms
  getting more deference between sophisticated parties
  [raw/latefees--enforceability-by-state--clearreceivables-2026.md].
- A fee that punishes rather than compensates risks being unenforceable as a penalty:
  "Your late fee should reasonably approximate the cost of late payment, not punish the
  debtor" [raw/latefees--enforceability-by-state--clearreceivables-2026.md].
- State examples as printed: California 10% per annum default with no cap over $300,000;
  Texas no usury cap for commercial transactions; New York 9% statutory default with up to
  24% enforced commercially; Florida 18% annually under $500,000; construction-sector
  prompt payment acts mandating 1% to 2% monthly
  [raw/latefees--enforceability-by-state--clearreceivables-2026.md].

**Gap.** This is one vendor blog. Usury law is state-specific, transaction-specific, and
moves [raw/latefees--enforceability-by-state--clearreceivables-2026.md]. No primary
statutory source on late fees or usury caps is in this archive. Never compute a late fee
into an invoice total. State that a fee may apply if the contract provides for one, and
send the user to their contract and their lawyer.

---

## 6. Payment terms that prevent the problem

Everything in this section comes from a single vendor product guide, which is a real
weakness. All of it is stated as recommendation, none of it as measured result.

- **Deposits.** Request a deposit upfront, "whether as a percentage or a fixed amount,"
  which improves cash flow "before the work is even complete"
  [raw/prevention--payment-terms--xero-guide-2026.md].
- **Shorter terms.** "Net 15 or net 21 terms often lead to faster payments than the
  standard net 30" [raw/prevention--payment-terms--xero-guide-2026.md].
- **Remove payment friction.** Embedded online payment links let clients pay "in just a
  few clicks," and accepting cards plus ACH means "the fewer excuses there are for delays"
  [raw/prevention--payment-terms--xero-guide-2026.md].
- **Automatic reminders,** three days before due and again on the due date, then at
  intervals [raw/prevention--payment-terms--xero-guide-2026.md].
- **Early payment discount,** "a small discount for early payment to encourage prompt
  action" [raw/prevention--payment-terms--xero-guide-2026.md].
- Platform data lists the same four practices (online payment options, automated
  reminders, pay-now buttons, multiple payment methods) as correlating with faster payment
  [raw/benchmarks--days-late--xero-sbi-2026.md].

**The honest framing.** The 7.8-day US figure quoted alongside these recommendations is a
market-wide trend, not the measured effect of any one practice
[raw/prevention--payment-terms--xero-guide-2026.md], and the platform source presents its
four practices as correlations with no causal test
[raw/benchmarks--days-late--xero-sbi-2026.md]. Recommend these as sensible defaults with a
commercial source behind them. Do not promise a number.

**Gap.** Nothing in this archive covers milestone billing, progress billing, retainers,
or auto-charge of a card on file, despite those being the obvious structural fixes for a
services business. Anything this skill says about milestone billing or auto-charge is
practitioner convention, and must be labeled as such rather than cited.

---

## 7. Why "I never saw a payment" is not "they did not pay"

This is the section that governs the skill's central safety design.

The consequence is documented, in a vendor's own words: "Calling a customer to demand
payment on an invoice they already paid three weeks ago is one of the most damaging
interactions in the AR function," after which "the customer's AP contact becomes less
responsive to future outreach because they now associate the AR team with errors rather
than professional account management" [raw/reconciliation--unapplied-cash--stuut-2026.md].

The mechanism is documented too, and it is mundane rather than exotic. "ACH and wire
transfers move money electronically but often travel separately from the remittance advice
that identifies which invoices the payment covers," and "Missing remittance is not an edge
case: It is standard behavior for companies paying by ACH across high invoice volumes"
[raw/reconciliation--unapplied-cash--stuut-2026.md]. Unapplied cash is described as "a
systemic AR failure" arising when "rules-based matching breaks when remittance data is
unstructured, payments span multiple entities, or payment volume exceeds the team's
capacity to clear exceptions manually"
[raw/reconciliation--unapplied-cash--stuut-2026.md].

**Read that against how this skill gets its data.** A funded AR team with a full bank feed,
a processor API, and a general ledger still loses payments to unmatched remittance
[raw/reconciliation--unapplied-cash--stuut-2026.md]. A skill reading screen captures has
strictly less than that: it sees only surfaces the user actually opened. The failure mode
is therefore not a rare edge case for this skill. It is the expected case, and the
architecture has to assume it.

**Gap.** No source in this archive gives a rate for how often payments go unapplied or
misapplied [raw/reconciliation--unapplied-cash--stuut-2026.md]. So the skill cannot quote a
false-positive probability. It can only refuse to assert a negative it did not verify.

---

## 8. Named gaps in this archive

1. **No provenance on the collectability curve.** Date, sample, industry mix, and the
   meaning of "collection potential" are all unstated
   [raw/aging--collectibility-by-age--crfonline-ccaofa.md], and two vendors citing it
   disagree about the twelve-month row
   [raw/aging--collectibility-by-age--cstworldwide-ccaofa.md].
2. **No measured reminder effectiveness.** Not one figure anywhere in the archive on
   response rate by rung, by tone, or by channel
   [raw/cadence--reminder-sequence--chaser-2026.md].
3. **No survey of state debt-collection law beyond California**, and the California source
   is a marketing blog with no statutory citation
   [raw/law--state-broader--rosenthal-kandh.md].
4. **No primary source on late fees or usury.** One vendor blog carries the whole section
   [raw/latefees--enforceability-by-state--clearreceivables-2026.md].
5. **No coverage of milestone billing, retainers, or auto-charge on file**
   [raw/prevention--payment-terms--xero-guide-2026.md].
6. **No unapplied-payment rate**, so no way to size the false-positive risk
   [raw/reconciliation--unapplied-cash--stuut-2026.md].
7. **Commercial motive is nearly universal here.** Of 16 sources, 3 are official or
   quasi-official (the US Code section, the eCFR section, the CFPB page)
   [raw/law--fdcpa-definitions--uscode-1692a.md],
   [raw/law--regf-contact-frequency--ecfr-1006-14.md],
   [raw/law--fdcpa-scope--cfpb-askcfpb.md]; 2 are legal analysis
   [raw/law--fdcpa-scope-business--findlaw-2024.md],
   [raw/law--regf-contact-frequency--ballardspahr-2020.md]; 1 is an industry association
   [raw/aging--collectibility-by-age--crfonline-ccaofa.md]. The remaining 10 are published
   by companies selling collection services, AR automation, or invoicing software, each of
   which profits from a large late-payment number and a long reminder ladder.
8. **Nothing on international collection**, cross-border invoices, or non-US legal
   regimes beyond the UK and Australia figures quoted secondhand
   [raw/benchmarks--ar-statistics-roundup--paidnice-2026.md].
