# External research and verification

The public-footprint half of the dossier. This half is commodity work that many tools can
do. What makes it worth including is the discipline applied to it, and the fact that it is
what the Reconciliation section checks the internal record against.

Domain claims trace to `research/distilled-due-diligence-and-osint.md`, sections 3, 4, and 5.

## Tooling

**List the search and fetch tools available in this session and use the real names.** Do not
assume a specific provider. Exa, Firecrawl, and a built-in web search and fetch pair are all
common, and sessions differ. If no web tool is available, say so, produce the internal half
plus a Reconciliation section marked as unrun, and tell the user the external half was not
possible.

## What to search, bound by purpose

The purpose from `references/purpose-binding-and-scope.md` sets the search list. Do not run
searches outside it. Collecting outside the defined scope is the named fastest route to
liability (distilled section 6).

| Purpose | Search |
|---|---|
| Partner diligence | The person plus company; the company's own site, about page, and team page; company registration or filings where public; the person's professional profiles; press mentions of the partnership or the company |
| Prospect prep | The person's professional profile and current role; the company's product, market, and recent announcements; anything the person has published or presented |
| Negotiation prep | The company's public positioning on the subject of the negotiation; announced deals, pricing, or partnerships; the person's public statements on the topic |
| Claim verification | Exactly and only the specific claims. One search per claim, targeted at the artifact that would confirm or contradict it |

The exclusion list in `references/purpose-binding-and-scope.md` applies with full force here,
and it is easier to violate externally than internally because a search engine will happily
return court records, home addresses, and family details for a name query. Do not run those
searches. If they surface unbidden inside a broader result, drop them.

## The search hygiene rules

**Quote the name.** Unquoted name searches return collisions freely (distilled section 4).

**Pair the name with a medium-strength identifier** on every query: the company, the role,
or the city. A bare name search on a common name is not a search, it is a lottery.

**Timestamp everything at fetch time.** Some platforms serve stale cached data and others are
near real-time, and the fix named in the source literature is to timestamp findings when you
find them (distilled section 4). Every external line in the dossier carries its fetch date
alongside its URL.

**Capture the URL, not a description of the URL.** A reader has to be able to open the exact
page. "Their LinkedIn says" is not a citation. The URL is.

## Identity disambiguation applies externally too

Everything found externally has to be tied to the SAME person the internal half is about,
and the internal half is where the strong identifiers live. Use them.

- An email address or a profile URL observed in Littlebird capture is the strongest possible
  bridge to an external profile. If the profile URL seen on screen matches the profile found
  in search, the identity link is solid.
- A company plus role match, consistent with what the internal capture showed, is a good
  medium-strength link.
- A name match alone is not a link. Mark it as an unconfirmed candidate and either resolve it
  or leave it out.

Impersonation and fabricated profiles are named risks (distilled section 4). Two specific
checks that fit a business dossier:

1. **Depth and interconnection.** A long-established person has a messy, interconnected
   trail. A footprint that begins abruptly is a signal (distilled section 4). Report it as
   an open question and a confidence penalty. It is genuinely ambiguous: privacy-conscious
   people also present thin, superficial profiles deliberately (distilled section 4).
2. **Cross-linking.** Do the profiles link to each other? A profile that links out to a
   personal site which links back is harder to fake than an isolated page. The Littlebird
   capture frequently shows exactly these outbound link clusters on a profile page.

## Corroboration: independence, not headcount

The stated OSINT standard is two independent sources for every material finding, with each
conclusion carrying a primary source, a timestamp, and a corroborating second source
(distilled section 3).

**The two-source rule fails when the two sources share an origin, and this is the single
most important idea in this guide.** The documented case: twelve people gave consistent
accounts of an event, the accounts were consistent and wrong, shaped by a shared narrative,
and the reporter did not question the consistency because it looked like corroboration
(distilled section 3).

For a person dossier this failure is not a rare edge case, it is the default condition. The
subject's LinkedIn headline, their conference bio, their company about page, their email
signature, and their spoken self-introduction in a recorded meeting will all agree, because
the subject wrote all of them. **Five agreeing artifacts is one source.**

**The independence test.** Before counting a second source, ask who produced it and where
they got it:

| Artifact | Origin | Counts as independent of the subject? |
|---|---|---|
| Their own profile, bio, site, deck, signature | The subject | No |
| A press release from their company | The subject's organization | No |
| An article that quotes them or is clearly built from their press release | The subject, laundered through an outlet | No |
| A company registration or public filing | A registry, from a submission with legal consequences for falsity | Yes, and strong |
| A former employer's or a counterparty's own site listing them | A third party with its own interest in accuracy | Yes |
| Independent reporting that names its own sourcing | A journalist | Yes, if the sourcing is not the subject |
| A Littlebird receipt of the subject stating it themselves | The subject | No, and it is important to say so |

The second question from the Verification Handbook is the operational form: after "how do you
know that", ask **"how else do you know that"** (distilled section 3). If the answer to the
second question routes back to the subject, there is no second source.

Question authoritative-looking sources hardest. Official sources fail too, with the
documented case being a governor announcing twelve miners rescued when one had survived
(distilled section 3).

## Press coverage is coverage, not corroboration

Using television appearances, social media, and press materials to manufacture legitimacy is
a named credential-fraud technique (distilled section 5). So a media hit is not evidence of
the thing the media hit describes until you know whether the outlet reported independently
or ran a placement. Check whether the piece names its own sourcing, whether it reads as a
rewritten announcement, and whether the outlet has an editorial identity distinct from the
subject's industry marketing. Report the finding either way, with the assessment attached.

## Claim types worth checking

The regulator taxonomy of what gets inflated (distilled section 5), which is the checklist
for turning the "what they told you" section into external searches:

| Claim type | What it looks like | Where the independent check lives |
|---|---|---|
| Education | A named degree from a named institution | The institution, or a public alumni or directory record. Absence proves nothing on its own |
| Honors and awards | A named award from a named body, including fabricated ones attributed to real publications | The awarding body's own published list. A fabricated award will not appear on the awarder's site |
| Titles and certifications | A professional designation or certification | The certifying body's register. For financial roles the SEC names IAPD, FINRA BrokerCheck, and state securities regulators specifically |
| Experience and track record | Years in an industry, prior roles, past results | Prior employers' own records, filings, and independently sourced reporting |
| Media | Appearances and coverage cited as legitimacy | See the section above |

For company and metric claims the parallel patterns are inflated metrics and customer data,
misrepresentations to lenders or acquirers, and hidden operational weaknesses (distilled
section 5). The red flags are explosive growth numbers, unusual conversion rates,
suspiciously high revenue per user, resistance to sharing raw data, polished reports
substituting for source data, and conviction resting on personality rather than evidence
(distilled section 5).

**Write these as claim shapes, never as person judgments.** The correct dossier line is that
a specific number was stated on a specific date and nothing independent supports or
contradicts it. The incorrect line characterizes the person. This distinction is what keeps
the artifact defensible, and the expected posture from the source literature is a baseline of
skepticism, not an accusation (distilled section 5).

Note that the source literature's remedy for an unverified metric is to request source data
from the counterparty directly: logs, bank statements, operational records rather than slide
decks (distilled section 5). That is a request the user makes, not a search the skill runs,
which is why unresolved claims convert into prep-pack questions rather than findings.

## Absence is not a finding

"No independent evidence found for X in the sources searched" and "X is false" are different
claims and only the first is supportable (`references/evidence-standards.md`, rule 2). Write
the first. Name what was searched so the reader can judge how much the absence is worth.

This matters most for credential checks, where many legitimate credentials have no public
verification path at all. A degree that does not appear in a public directory is usually a
directory limitation, not a lie.

## Reporting external claims

Every external statement is reported as a claim with its source attached:

- Correct: "Their company site states the firm was founded in 2019
  [https://example.com/about, fetched 2026-08-17]."
- Wrong: "The firm was founded in 2019."

The difference is not pedantry. It is what lets the Reconciliation section work at all,
because a conflict between "their site says 2019" and a Littlebird receipt of them saying
2021 is legible, while a conflict between two bare assertions is just a contradiction the
reader has to untangle.
