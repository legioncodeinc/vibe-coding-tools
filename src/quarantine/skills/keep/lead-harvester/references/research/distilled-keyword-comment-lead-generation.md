# Distilled: keyword-comment lead generation and social outreach

Written 2026-08-17 from a fresh read of the 15 files in `raw/`. Every claim ends in a
bracketed citation to the raw file it came from. Nothing here is authored from training
data. Where sources disagree, both readings are stated.

---

## 1. The category problem: automation captures a fraction of the hand-raisers

The single most useful finding in this archive comes from the category leader's own
product documentation.

| Constraint | Effect on the roster | Citation |
|---|---|---|
| Trigger fires only on a user's FIRST comment under a post | The follow-up comment, usually the more qualifying one, is never captured | [raw/leadharvest--automation-tools--manychat-ig-comment-trigger-help.md] |
| Automation is scoped to a configured set of posts | Keyword comments left on any other post are invisible | [raw/leadharvest--automation-tools--manychat-ig-comment-trigger-help.md] |
| Private reply "does not automatically opt the user into your Instagram channel and does not open the 24-hour messaging window" | A hand-raiser who does not click stays outside the automated channel entirely | [raw/leadharvest--automation-tools--manychat-ig-comment-trigger-help.md] |
| First message is a single content block, no input blocks, no dynamic blocks | No qualification can happen in the automated touch | [raw/leadharvest--automation-tools--manychat-ig-comment-trigger-help.md] |
| One private reply per comment, within 7 days | One shot, then the automated lane closes | [raw/leadharvest--platform-rules--meta-private-replies-devdocs-2026.md] |
| No capture of DMs, friend requests, connection requests, or reactions | Three of the four hand-raise signals are outside the tool's scope entirely | [raw/leadharvest--automation-tools--manychat-ig-comment-trigger-help.md] |

Read together: the comment-to-DM tool category covers exactly one signal type, on a
pre-selected set of posts, once per person, for seven days, and only converts the person
into a reachable contact if they click. Everyone who DM'd instead of commenting, sent a
friend request instead of commenting, reacted instead of commenting, commented on the
wrong post, commented twice, or received the automated DM and did not click, is invisible
to the tool. That population is what this skill recovers.

Operators cannot even size the problem from vendor data: an operator asking ManyChat
support directly for comment and DM rate limits got no official answer in the thread, only
a community member asserting "There is no limit so far for comment trigger per hour or per
day" [raw/leadharvest--automation-tools--manychat-community-limits-thread.md].

---

## 2. Platform rules: what an operator may and may not do

### The rules that are explicit

| Platform | Rule | Status | Citation |
|---|---|---|---|
| X | "You may not send unsolicited Direct Messages in a bulk or automated manner." | Explicit prohibition | [raw/leadharvest--platform-rules--x-automation-rules-2026.md] |
| X | Unsolicited automated replies "based solely on keyword searches" prohibited | Explicit prohibition, names the exact campaign mechanic | [raw/leadharvest--platform-rules--x-automation-rules-2026.md] |
| X | Where a user HAS opted in by replying or mentioning: "one automated reply or mention per user interaction" | Ceiling, with mandatory opt-out | [raw/leadharvest--platform-rules--x-automation-rules-2026.md] |
| X | "You may not like posts or hide replies in an automated manner." | Explicit prohibition | [raw/leadharvest--platform-rules--x-automation-rules-2026.md] |
| X | "You may not follow or unfollow X accounts in a bulk, aggressive, or indiscriminate manner." | Explicit prohibition | [raw/leadharvest--platform-rules--x-automation-rules-2026.md] |
| LinkedIn | User Agreement 8.2 prohibits "using bots or other automated methods to access the service, add or download contacts, or send and redirect messages" | Explicit prohibition, quoted secondhand | [raw/leadharvest--platform-rules--linkedin-crackdown-anybiz-2026.md] |
| Meta | Prohibits "requiring users to engage with content before accessing promised material" | Explicit prohibition, and it describes a badly-worded keyword campaign | [raw/leadharvest--platform-rules--meta-community-standards-spam-2026.md] |
| Meta | Cash-prize giveaways "in exchange for engagement" prohibited | Explicit prohibition | [raw/leadharvest--platform-rules--meta-community-standards-spam-2026.md] |
| Meta | Misleading links "delivering substantially different content than promised" prohibited | Explicit prohibition | [raw/leadharvest--platform-rules--meta-community-standards-spam-2026.md] |

### The rules that are windows, not bans

Meta's messaging model is opt-in by user action. The 24-hour standard window opens when
the user initiates through a message, a call-to-action button, a Click-to-Messenger ad, a
plugin, or a message reaction, and "Messages sent within the 24 hour window may contain
promotional content"
[raw/leadharvest--platform-rules--meta-messenger-policy-2026.md]. A comment is NOT on
that list. Comments are handled by the separate Private Replies path, which grants exactly
one message within 7 days and does not open a conversation
[raw/leadharvest--platform-rules--meta-private-replies-devdocs-2026.md].

The lane that fits human follow-up is the human agent tag, which lets a business "manually
respond to user communications within a 7-day period"
[raw/leadharvest--platform-rules--meta-messenger-policy-2026.md]. That is a documented
7-day window for a real person answering by hand, which is the exact shape of the work
this skill supports.

### Numbers, and why to distrust them

LinkedIn "doesn't publish an official LinkedIn connection request limit or public message
limits. These ranges come from observed usage patterns"
[raw/leadharvest--platform-rules--linkedin-safe-limits-phantombuster-2026.md]. The
observed ranges:

| Action | New account, first 90 days | Aged account | Citation |
|---|---|---|---|
| Connection requests, daily | 10 to 15 | 15 to 25 | [raw/leadharvest--platform-rules--linkedin-safe-limits-phantombuster-2026.md] |
| Connection requests, weekly | 40 to 60 | 60 to 100 | [raw/leadharvest--platform-rules--linkedin-safe-limits-phantombuster-2026.md] |
| DMs to first-degree, daily | 20 to 40 | 40 to 80 | [raw/leadharvest--platform-rules--linkedin-safe-limits-phantombuster-2026.md] |
| Comments, daily | 10 to 30 | 10 to 30 | [raw/leadharvest--platform-rules--linkedin-safe-limits-phantombuster-2026.md] |

A second vendor independently reports the same roughly 100-per-week invitation ceiling,
consistent across free, Premium, and Sales Navigator tiers since around 2022
[raw/leadharvest--platform-rules--linkedin-crackdown-anybiz-2026.md].

Instagram's published limits are shaped differently: per-second call limits of "2 calls
per second per account" and an engagement-proportional allowance of "200 x Number of
Engaged Users" over 24 hours. The same source that headlines a 200-per-hour figure then
states plainly that "Meta publishes no flat hourly DM cap for Instagram"
[raw/leadharvest--platform-rules--instagram-dm-ban-wave-sumgenius-2026.md]. The
engagement-proportional shape matters: a small account has a small allowance by design.

### Why staying under the numbers does not save you

This is the finding that changes the design. LinkedIn moved from volume-based enforcement
to behavioral scoring, evaluating session origin and IP patterns, timing consistency,
acceptance rates, and script injection from browser extensions. The direct consequence:
"accounts can be flagged even while operating inside the numeric caps" because "LinkedIn's
systems score behavior" [raw/leadharvest--platform-rules--linkedin-crackdown-anybiz-2026.md].

The same source reports vendor-level enforcement, with LinkedIn removing a tool vendor's
public page and founder profiles in March 2026, and roughly 40% of accounts using flagged
tools restricted between January and March 2026. That 40% figure is vendor-reported and
uncorroborated in this archive; treat it as directional
[raw/leadharvest--platform-rules--linkedin-crackdown-anybiz-2026.md].

On Instagram, suspension can arrive with no warning at all, and the reported causes
include context-blind AI moderation producing false positives alongside genuine
automation abuse. Recovery is described as a 48 to 72 hour pause and an appeal
[raw/leadharvest--platform-rules--instagram-dm-ban-wave-sumgenius-2026.md]. Meta also
notes that restrictions "may apply even at lower frequencies when combined with other spam
indicators" [raw/leadharvest--platform-rules--meta-community-standards-spam-2026.md].

**Conflict, stated rather than smoothed.** Expandi's own H1 2026 report presents LinkedIn
automation as working well, with a 10.3% overall reply rate across 70,130 campaigns
[raw/leadharvest--first-touch--expandi-state-of-linkedin-outreach-h1-2026.md], while
AnyBiz names Expandi specifically as a flagged tool whose users faced restrictions
[raw/leadharvest--platform-rules--linkedin-crackdown-anybiz-2026.md]. Both are vendor
sources with opposite interests. The preferred reading: the performance data is probably
sound because it is platform-measured on a large sample, and the risk data is probably
directionally sound because it is corroborated by LinkedIn's own quoted User Agreement
language. The two are not actually in conflict once separated. Automated outreach can both
produce replies AND put the account at risk. The conclusion is not "automation does not
work", it is "automation works until the account is gone."

---

## 3. Speed to lead

Direction is unanimous across every source in the archive. Magnitude is not.

| Window | Conversion | Citation |
|---|---|---|
| 0 to 5 minutes | 21% | [raw/leadharvest--speed-to-lead--artemis-benchmark-2026.md] |
| 5 to 30 minutes | 13% | [raw/leadharvest--speed-to-lead--artemis-benchmark-2026.md] |
| 30 to 60 minutes | 8% | [raw/leadharvest--speed-to-lead--artemis-benchmark-2026.md] |
| 1 to 24 hours | 5% | [raw/leadharvest--speed-to-lead--artemis-benchmark-2026.md] |
| 24 hours or more | 2.3% | [raw/leadharvest--speed-to-lead--artemis-benchmark-2026.md] |

Only about 7% of leads get a sub-5-minute reply, and 35% wait 24 hours or more, against an
overall average response time of 42 hours
[raw/leadharvest--speed-to-lead--artemis-benchmark-2026.md].

The canonical figures, all recorded as cited secondhand because the primaries are
paywalled: odds of qualifying a lead 21 times higher at 5 minutes versus 30 minutes;
contact odds dropping 10x after 5 minutes; 35 to 50% of sales won by the first responder;
leads contacted within an hour 7 times more likely to reach a decision maker; Velocify
reporting a 391% conversion increase for a call inside 1 minute across 3.5 million leads
[raw/leadharvest--speed-to-lead--leadresponse-statistics-2026.md].

**Conflicts and how to read them.** The magnitudes disagree wildly: 21x, 7x, 8x, 391%.
That is expected across different channels, definitions, and vintages. Report direction
with confidence and magnitude as a range
[raw/leadharvest--speed-to-lead--leadresponse-statistics-2026.md]. The Artemis publisher
explicitly labels its own figures "illustrative and directional, drawn from client
engagements and published industry benchmarks, not a guarantee"
[raw/leadharvest--speed-to-lead--artemis-benchmark-2026.md].

**Named gap.** No source in this archive isolates conversion data for inbound SOCIAL
leads. Every number above describes form-fill leads worked by phone
[raw/leadharvest--speed-to-lead--artemis-benchmark-2026.md]
[raw/leadharvest--speed-to-lead--leadresponse-statistics-2026.md]. Applying these
benchmarks to a Facebook commenter is an assumption. Use the shape of the decay curve,
which is steep and front-loaded, and do not quote the percentages at a user as if they
describe their campaign.

The practical bridge: platform mechanics impose their own clock independent of conversion
research. The Private Replies eligibility window is 7 days from the comment
[raw/leadharvest--platform-rules--meta-private-replies-devdocs-2026.md], and the human
agent tag also runs 7 days
[raw/leadharvest--platform-rules--meta-messenger-policy-2026.md]. Whatever the conversion
curve looks like for social, at day 8 the reachable channel is gone.

---

## 4. Scoring and qualification

**A hand-raiser is an MQL, not an SQL.** The standard definition of a Marketing-Qualified
Lead is a prospect showing engagement interest without direct sales involvement, whereas a
Sales-Qualified Lead is fully vetted with confirmed need, timing alignment, and verified
decision-making authority [raw/leadharvest--scoring--lead-qualification-frameworks-highspot-2026.md].
A comment carries none of the second set.

**The classic frameworks do not apply to a comment.** BANT (Budget, Authority, Need,
Timeline), CHAMP, MEDDIC, GPCTBA/C&I and SPICED all qualify on facts that a keyword
comment cannot carry [raw/leadharvest--scoring--lead-qualification-frameworks-highspot-2026.md].
Signal-strength scoring for hand-raisers is therefore a PRIORITIZATION model, deciding who
to talk to first, not a qualification model deciding who is a real buyer. Conflating the
two is the error to avoid.

**Recency and frequency are the established basis for stacking signals.** "Engagement
recency and frequency scoring" is a named, mainstream scoring dimension, where "recent
repeated actions score higher than isolated historical touches"
[raw/leadharvest--scoring--lead-qualification-frameworks-highspot-2026.md]. That is the
published warrant for ranking someone who commented, then DM'd, then sent a friend
request above someone who reacted once.

**Named gap.** No source in this archive gives point values, weights, or a validated
scoring model for social hand-raise signals specifically
[raw/leadharvest--scoring--lead-qualification-frameworks-highspot-2026.md]. The weights
in `scoring-and-segmentation.md` are a defensible construction from the recency and
frequency principle plus the effort each signal costs the person, and they are presented
to the user as adjustable, not as validated.

---

## 5. First touch: what the data says about the message itself

| Finding | Number | Citation |
|---|---|---|
| Short, casual messages have the highest response rate | 16.86% | [raw/leadharvest--first-touch--expandi-state-of-linkedin-outreach-h1-2026.md] |
| Template-based campaigns, the worst-named category | 8.62% | [raw/leadharvest--first-touch--expandi-state-of-linkedin-outreach-h1-2026.md] |
| LinkedIn messaging overall | 10.3% | [raw/leadharvest--first-touch--expandi-state-of-linkedin-outreach-h1-2026.md] |
| Cold email, for comparison | 5.1% | [raw/leadharvest--first-touch--expandi-state-of-linkedin-outreach-h1-2026.md] |
| Inbound visitor campaigns, warmest named category | 13.4% | [raw/leadharvest--first-touch--expandi-state-of-linkedin-outreach-h1-2026.md] |
| Connection request acceptance, best campaign type | 29.61% | [raw/leadharvest--first-touch--expandi-state-of-linkedin-outreach-h1-2026.md] |

Short and casual beats templated by close to 2x in the same dataset, on a sample of
70,130 campaigns [raw/leadharvest--first-touch--expandi-state-of-linkedin-outreach-h1-2026.md].
Warm beats cold: inbound visitors at 13.4% against 10.3% overall
[raw/leadharvest--first-touch--expandi-state-of-linkedin-outreach-h1-2026.md].

**Follow-up sequencing has a specific published shape.** The first follow-up performs
0.6% WORSE than the opener. The second follow-up produces 4.05% MORE responses. The third
and beyond deliver roughly 1%, diminishing
[raw/leadharvest--first-touch--expandi-state-of-linkedin-outreach-h1-2026.md]. Two
follow-ups is where the evidence stops supporting more.

**Volume is rarely the binding constraint.** 71% of surveyed sellers send 50 or fewer
connection requests weekly and 54% send fewer than 25, both well under the observed
ceiling [raw/leadharvest--first-touch--expandi-state-of-linkedin-outreach-h1-2026.md].
Personalization adoption: 53.71% manual, 29.19% AI-assisted, 17.10% none
[raw/leadharvest--first-touch--expandi-state-of-linkedin-outreach-h1-2026.md].

**Source-interest caveat.** This is the only source in the archive with message-level
performance data, it is a single vendor with an obvious interest, and it is a vendor named
elsewhere in the archive as a compliance risk
[raw/leadharvest--platform-rules--linkedin-crackdown-anybiz-2026.md]. The sample is large
and platform-measured, which is why it is retained. Treat the relative ordering as more
reliable than the absolute percentages.

---

## 6. Legal: contractual versus statutory

**Platform DM rules are contractual.** They live in user agreements and community
standards, and the enforcement is account restriction or termination by the platform:
LinkedIn User Agreement 8.2 [raw/leadharvest--platform-rules--linkedin-crackdown-anybiz-2026.md],
the X automation rules [raw/leadharvest--platform-rules--x-automation-rules-2026.md], Meta
community standards [raw/leadharvest--platform-rules--meta-community-standards-spam-2026.md].
No regulator is involved and no fine is issued. The account simply stops working, in
Instagram's case sometimes with no warning
[raw/leadharvest--platform-rules--instagram-dm-ban-wave-sumgenius-2026.md].

**Email is statutory.** If the follow-up moves to email, CAN-SPAM applies with seven
requirements: no false or misleading header information, no deceptive subject lines,
identify the message as an ad, disclose a physical location, tell recipients how to opt
out, honor member and subscriber opt-outs, and honor opt-out requests promptly. The
penalty is up to $53,088 per violating email, counted per message and not per campaign
[raw/leadharvest--legal--ftc-can-spam-compliance-guide.md].

**The line is not perfectly clean.** In Facebook, Inc. v. MAXBOUNTY, Inc. (N.D. Cal.,
March 28, 2011), the court held that communications posted on Facebook can qualify as
"commercial electronic mail message[s]" under CAN-SPAM, reading "electronic mail address"
expansively as a "destination...to which an electronic mail message can be sent or
delivered" [raw/leadharvest--legal--dmlp-facebook-v-maxbounty.md]. Caveats from the source
itself: this is a 2011 district court decision on a motion to dismiss, not appellate law,
and the court did not reach the merits
[raw/leadharvest--legal--dmlp-facebook-v-maxbounty.md].

**Consent does not travel between channels.** A person who commented a keyword asking for
a resource has not given an email address and has not consented to email
[raw/leadharvest--legal--ftc-can-spam-compliance-guide.md]. Moving a hand-raiser from a
DM thread onto an email list requires collecting the address and the consent separately.

**Practical ranking of risk for this skill's user.** The contractual risk is the near-term
one, it arrives faster, and for an operator whose business runs on one Facebook profile it
hurts more immediately than a regulatory action would
[raw/leadharvest--legal--dmlp-facebook-v-maxbounty.md]
[raw/leadharvest--platform-rules--instagram-dm-ban-wave-sumgenius-2026.md].

---

## 7. What this evidence dictates about the skill's design

1. **Draft, never send.** X prohibits bulk and automated DM in explicit words
   [raw/leadharvest--platform-rules--x-automation-rules-2026.md], LinkedIn's User
   Agreement 8.2 prohibits automated message sending
   [raw/leadharvest--platform-rules--linkedin-crackdown-anybiz-2026.md], and LinkedIn
   scores behavior rather than volume so that compliant-looking pacing does not protect
   an account [raw/leadharvest--platform-rules--linkedin-crackdown-anybiz-2026.md]. A tool
   that hands a human a ranked list and pre-written text, which the human then sends by
   hand, is on the correct side of every rule in this archive.
2. **Recovering missed hand-raisers is the real product.** The automation category
   structurally captures one signal on selected posts, once per person, for seven days,
   and only converts on a click
   [raw/leadharvest--automation-tools--manychat-ig-comment-trigger-help.md]
   [raw/leadharvest--platform-rules--meta-private-replies-devdocs-2026.md].
3. **Speed matters, but say why honestly.** The conversion curve is steep and front-loaded
   [raw/leadharvest--speed-to-lead--artemis-benchmark-2026.md] and the platform windows
   close hard at 7 days
   [raw/leadharvest--platform-rules--meta-private-replies-devdocs-2026.md]. The second
   reason is the one that is certain for social.
4. **Short and casual, two follow-ups maximum.** 16.86% versus 8.62% for templated, and
   the lift concentrates on the second follow-up
   [raw/leadharvest--first-touch--expandi-state-of-linkedin-outreach-h1-2026.md].
5. **Rank, do not qualify.** Signal strength orders the queue. BANT-style qualification
   happens in the conversation that follows
   [raw/leadharvest--scoring--lead-qualification-frameworks-highspot-2026.md].
6. **Warn about the campaign copy, not only the follow-up.** Gating promised material
   behind required engagement is prohibited by name
   [raw/leadharvest--platform-rules--meta-community-standards-spam-2026.md].
