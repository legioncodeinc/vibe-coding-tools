# FTC compliance for mined testimonials

**This is not legal advice.** It is a working summary of public sources archived in
`research/raw/` and distilled in `research/distilled-testimonial-practice.md`, assembled on
2026-08-17. Advertising law is jurisdiction-specific and it moves. If real money or a lawyer is on
the other side of a decision, get a lawyer. Every claim below traces to the distillation, and the
distillation traces to a primary source.

Everything here is US federal. It says nothing about any other country.

## The two instruments

| | Endorsement Guides | Consumer Reviews and Testimonials Rule |
|---|---|---|
| Citation | 16 CFR Part 255 | 16 CFR Part 465 |
| What it is | Administrative interpretations of Section 5 of the FTC Act | A trade regulation rule under 15 U.S.C. 57a |
| Current version | 88 FR 48102, July 26, 2023 | 89 FR 68077, Aug. 22, 2024 |
| Effective | in force as guides | **October 21, 2024** |
| Own civil penalties | none | yes, for knowing violations |
| Concerns | honesty, substantiation, typicality, material connections | fabrication, purchased sentiment, insiders, suppression, fake influence metrics |

(`research/distilled-testimonial-practice.md`, section 1.)

**The split that matters for this skill.** Part 465 is about praise that is not real. Part 255 is
about real praise presented in a misleading way. A bank built from genuine captured praise is
almost entirely a Part 255 problem, with one Part 465 tripwire, covered under "the incentive
tripwire" below.

## Penalty exposure, stated honestly

Part 465 authorizes courts to impose civil penalties for **knowing** violations. The maximum civil
penalty under Section 5(m)(1)(A) of the FTC Act was **$53,088 per violation** per 16 CFR 1.98 as
it read on 2026-08-17, effective for violations assessed after January 17, 2025
(`research/distilled-testimonial-practice.md`, section 2).

Three things must always be said with that number, and the skill says all three every time:

1. It is inflation-adjusted and it moves. Re-check 16 CFR 1.98.
2. It attaches to knowing violations. Neither the FTC sources nor the law-firm analysis in the
   archive defines the mechanics of that standard. Named gap.
3. Nothing in the archive defines what counts as one violation here. Named gap. **So the skill
   never multiplies the figure out into a total.** A number like "50 quotes times $53,088" is
   fabricated arithmetic and it is not in evidence.

## What the FTC has actually enforced

| Date | Matter | Conduct | Outcome |
|---|---|---|---|
| Dec 22, 2025 | 10 warning letters | creating, buying or posting fake reviews, or incentives for only positive reviews | letters only |
| Apr 2026 to Jul 2026 | TruHeight | employees posing as users, free product and discounts traded for five-star ratings | $4M judgment, $750K paid, remainder suspended |
| May 2026 | Premium Home Service, with the Illinois AG | fake listings, employees and relatives posting fake five-star reviews | pending, motion to dismiss Jul 17 2026 |

The ten warning letters: 6 property management companies, 3 personal injury law firms, 1
accounting firm. **All ten shared one pattern, incentives given in exchange for positive reviews.**
In TruHeight, Rule violations were the only legal basis for the monetary award even though the
Rule was not the case's primary focus. State attorneys general enforce in parallel
(`research/distilled-testimonial-practice.md`, section 3).

**The honest read, and the skill should say this to the user rather than frightening them.** Every
enforcement target manufactured or bought praise. Nothing in the archive suggests exposure for
accurately quoting real praise from a real customer with permission. The realistic risks for a
small business are three: the incentive tripwire, the results-claim disclosure, and permission.
The skill is built around those three.

## Requirement 1: honest opinion, unaltered

"Endorsements must reflect the honest opinions, findings, beliefs, or experience of the endorser",
and an endorsement "may not convey any express or implied representation that would be deceptive
if made directly by the advertiser" (`research/distilled-testimonial-practice.md`, section 4).

Two consequences that bite here:

- **You cannot launder a claim through a customer's mouth.** If the user could not say "we triple
  revenue for our clients" in their own voice without substantiation, putting it in a customer's
  quotation marks does not fix it.
- **Rewriting a quote breaks this requirement directly.** The FTC's own summary of the Rule lists
  AI-generated fake reviews among the prohibited categories
  (`research/distilled-testimonial-practice.md`, section 8). A language model that improves a
  customer's phrasing is generating text and attributing it to a named human. The trimming rules in
  `quote-formatting.md` are the operational form of this requirement.

The FTC's FAQ also treats a marketer's misleading alteration of a real review as the marketer's
problem and a reportable complaint (`research/distilled-testimonial-practice.md`, section 8).

## Requirement 2: bona fide user

"When the advertisement represents that the endorser uses the endorsed product, the endorser must
have been a bona fide user of it at the time the endorsement was given"
(`research/distilled-testimonial-practice.md`, section 4).

Enforced at the discovery gate, not at publication. See the bona fide user check in
`attribution-verification.md`. A prospect's enthusiasm on a sales call is not a testimonial.

## Requirement 3: the typicality rule, which governs every results quote

**This is the single most important regulatory finding in the archive and the reason the results
sub-bank is a separate artifact.**

An endorsement relating a consumer's experience on a central or key attribute "will likely be
interpreted as representing that the endorser's experience is representative of what consumers
will generally achieve with the advertised product in actual conditions of use"
(`research/distilled-testimonial-practice.md`, section 5).

Publishing "they tripled our revenue" therefore implies that tripling revenue is what clients
generally get. The implication is made by publishing it, regardless of intent.

**Disclaimers do not cure it.** Research demonstrates that "Results not typical" and "These
testimonials are based on the experiences of a few people and you are not likely to have similar
results" do not adequately reduce the representative-experience message, and such disclaimers "are
unlikely to be effective" (`research/distilled-testimonial-practice.md`, section 5). If the user
reaches for a "results not typical" line, tell them the Guides address that exact wording and say
it does not work.

**What is required instead:** where the advertiser lacks substantiation that the experience is
representative, the ad "should clearly and conspicuously disclose the generally expected
performance in the depicted circumstances"
(`research/distilled-testimonial-practice.md`, section 5).

### The three-way fork, applied to every results quote

| Situation | Flag the skill assigns | What it means |
|---|---|---|
| The user can substantiate that this result is typical | **SUBSTANTIATED** | Publishable. Keep the substantiation on file. |
| The result is atypical and the user knows what typical is | **NEEDS EXPECTED-RESULTS DISCLOSURE** | Publishable only alongside a clear and conspicuous statement of generally expected performance. Not a "results not typical" line. |
| The user does not know what typical is | **NOT PUBLISHABLE AS A RESULTS CLAIM** | Neither option above is available. Either the user computes what typical is, or the quote is used with the number trimmed out under the rules in `quote-formatting.md`, or it is not used. |

The third row is where most quotes will land for a small business, and the skill must say so
plainly rather than nudging the user toward the first row. **The skill never assesses whether a
result is typical.** It has no access to the user's full client outcomes and computing typicality
from a praise bank is circular by construction, since the bank contains only the clients who were
happy enough to say something.

### What clear and conspicuous means

"Difficult to miss (i.e., easily noticeable) and easily understandable by ordinary consumers", in
the same medium as the claim, and for interactive media "the disclosure should be unavoidable".
Part 465 adds that consumers must not have to click a hyperlink to encounter a disclosure, and
that a disclosure at the beginning of a text testimonial would qualify
(`research/distilled-testimonial-practice.md`, sections 5 and 1).

Practically: not a footnote, not a tooltip, not a link, not grey 10px text under the fold. Same
screen, same size class, adjacent to the claim.

### What counts as a results quote

Wider than most users assume. Flag a quote into the results sub-bank if it contains any of:

- A number of any kind: percentage, currency, multiple, count, duration
- A before-and-after comparison, even without figures ("we went from drowning to ahead of
  schedule")
- A claimed business outcome: revenue, cost, time, headcount, conversion, ranking, funding,
  compliance, retention
- A superlative tied to performance ("fastest", "cheapest", "best results we have had")
- A causal claim attributing an outcome to the user's work ("because of them we")
- A health, safety, financial or legal outcome of any kind, which raises the substantiation bar
  further than this archive covers

When in doubt, it is a results quote. The sub-bank is the safe default.

## Requirement 4: material connections

A connection "that might materially affect the weight or credibility of the endorsement" and that
"is not reasonably expected by the audience" must be disclosed clearly and conspicuously
(`research/distilled-testimonial-practice.md`, section 6).

The category is wide: business, family or personal relationship; monetary payment; free or
discounted product "regardless of whether the advertiser requires an endorsement in return"; early
access; the possibility of being paid, of winning a prize, or "of appearing on television or in
other media promotions" (`research/distilled-testimonial-practice.md`, section 6).

Disclosure is needed "when a significant minority of the audience ... does not understand or
expect the connection", and it "must clearly communicate the nature of the connection sufficiently
for consumers to evaluate its significance" without requiring complete details
(`research/distilled-testimonial-practice.md`, section 6).

**Screen every speaker against this list, and record the answer on the quote:**

| Relationship | Consequence |
|---|---|
| Ordinary paying client, nothing given | No material connection to disclose |
| Received free or discounted work | Disclose |
| Employee, contractor, or business partner | Disclose. Listing an employer on a profile page is not sufficient disclosure |
| Officer or manager of the user's business | Express disclosure duty under 465.5 |
| Family member or close friend | Disclose |
| Was told in advance they might be featured | Disclose |
| Was paid for the permission, having had no expectation of payment when they spoke | **No disclosure needed** |

That last row is the one that makes mined praise cleaner than solicited praise, and it comes
straight from the FTC's own FAQ: if the customers had no reason to expect compensation before they
gave their comments, there is no need to disclose a payment made afterward for permission; if they
were given a reason to expect a benefit before they spoke, disclose it in the ad
(`research/distilled-testimonial-practice.md`, section 6).

**Praise given unprompted, before any benefit existed, is the cleanest material available.** That
is precisely what this skill mines. Say so to the user, because it is the strongest argument for
doing it this way.

## The incentive tripwire

Under 465.4 it is prohibited to provide "compensation or other incentives in exchange for ...
consumer reviews expressing a particular sentiment, whether positive or negative". The FTC's
marketer guide adds: do not condition an incentive on the review being positive, explicitly or
implicitly, and where an incentive was given the review should disclose it
(`research/distilled-testimonial-practice.md`, section 6).

**All ten December 2025 warning letters were about incentives tied to positive reviews**
(`research/distilled-testimonial-practice.md`, sections 3 and 6). This is where the FTC is
actually looking.

Practical rules the skill enforces:

- No permission-request draft offers a benefit. Not a discount, not a gift card, not a free month.
  See `permission-tiers.md`.
- If the user says they already gave someone something in connection with the praise, flag the
  quote for disclosure and record what was given and when relative to the praise.
- If the user asks the skill to help design a review-collection campaign with incentives, that is
  a different job with a different risk profile and it is out of scope. Point at the FTC marketer
  guide and stop.

## Adjacent prohibited practices, worth naming once

- **Review gating.** Asking for reviews only from customers expected to be positive, including by
  geography, is called out directly by the FTC
  (`research/distilled-testimonial-practice.md`, section 6). Note the tension this creates with
  this skill: mining only praise is not gating, because it does not shape who is asked for a
  review. But if the user turns the gap report into "only ask the happy clients for a Google
  review", that is gating. Say so where the gap report is presented.
- **Asking someone to delete or change a negative review** could mislead readers. Asking them to
  add an update is acceptable (`research/distilled-testimonial-practice.md`, section 6).
- **Agency responsibility.** "You can be held responsible for what they do on your behalf"
  (`research/distilled-testimonial-practice.md`, section 6).
- **Attributing a quote to a company** rather than the individual implies an organizational
  endorsement, which must be "reached by a process sufficient to ensure that the endorsement fairly
  reflects the collective judgment of the organization"
  (`research/distilled-testimonial-practice.md`, section 4). Attribute to the person.
- **Printing a job title** can convert a consumer endorsement into an implied expert endorsement,
  which brings its own requirement that the person's qualifications actually give them the
  represented expertise (`research/distilled-testimonial-practice.md`, section 4).

## What is outside this document

- Every jurisdiction other than the United States. The archive contains one unverified GDPR
  summary and nothing else (`research/distilled-testimonial-practice.md`, section 12).
- State right of publicity law beyond two examples, and the question of which state's law governs
  an internet publication (`research/distilled-testimonial-practice.md`, sections 7 and 12).
- Industry-specific advertising rules. Health, financial, legal and regulated professional
  services carry their own testimonial restrictions that this archive does not cover at all. Where
  the user is in one of those sectors, say that this document does not cover their regime.
- Any assessment of whether a specific quote is lawful. The skill flags and explains. It does not
  clear.

## The line the skill states every time regulation comes up

This is not legal advice. It is a summary of public sources as of 2026-08-17. Advertising law
varies by jurisdiction and changes. Take anything consequential to a lawyer.
