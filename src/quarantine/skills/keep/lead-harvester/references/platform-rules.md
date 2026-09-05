# Platform rules, rate limits, and account risk

Everything in this file traces to
`references/research/distilled-keyword-comment-lead-generation.md` and the raw archive
behind it. Read this before telling a user anything about what they may send.

## The one-paragraph version

Every major platform in this archive prohibits unsolicited bulk or automated direct
messaging in explicit terms. LinkedIn now flags accounts on BEHAVIOR rather than volume,
so pacing a bot inside published caps does not protect anything. Instagram suspends with
no warning. The comment-to-DM tool category is legal because it operates on a narrow
API-blessed path (one reply per comment, 7 days, no window opened), and that path captures
a small fraction of the people who raised a hand. The safe and effective move is the one
this skill produces: a ranked list and pre-written text that a human sends by hand.

## What is explicitly prohibited

| Platform | Prohibited | Source |
|---|---|---|
| X | "You may not send unsolicited Direct Messages in a bulk or automated manner." | [research/raw/leadharvest--platform-rules--x-automation-rules-2026.md] |
| X | Unsolicited automated replies "based solely on keyword searches" | [research/raw/leadharvest--platform-rules--x-automation-rules-2026.md] |
| X | "You may not like posts or hide replies in an automated manner." | [research/raw/leadharvest--platform-rules--x-automation-rules-2026.md] |
| X | Following or unfollowing "in a bulk, aggressive, or indiscriminate manner" | [research/raw/leadharvest--platform-rules--x-automation-rules-2026.md] |
| LinkedIn | User Agreement 8.2: "using bots or other automated methods to access the service, add or download contacts, or send and redirect messages" | [research/raw/leadharvest--platform-rules--linkedin-crackdown-anybiz-2026.md] |
| LinkedIn | Help Center: "third-party crawlers, bots, browser plug-ins, or extensions that scrape, modify, or automate activity" | [research/raw/leadharvest--platform-rules--linkedin-crackdown-anybiz-2026.md] |
| Meta | "requiring users to engage with content before accessing promised material" | [research/raw/leadharvest--platform-rules--meta-community-standards-spam-2026.md] |
| Meta | Giveaways offering cash prizes "in exchange for engagement" | [research/raw/leadharvest--platform-rules--meta-community-standards-spam-2026.md] |
| Meta | Misleading links "delivering substantially different content than promised" | [research/raw/leadharvest--platform-rules--meta-community-standards-spam-2026.md] |
| Meta | Activity "at very high frequencies", and lower frequencies combined with other spam indicators | [research/raw/leadharvest--platform-rules--meta-community-standards-spam-2026.md] |

**The X keyword clause deserves emphasis.** X names the exact mechanic of a keyword-comment
campaign and prohibits the automated version of it. Where a user asks for keyword-triggered
auto-DM on X, the answer is no, and the reason is a published rule, not caution.

**The Meta engagement-gating clause is about the CAMPAIGN COPY, not the follow-up.** This
is the one most operators miss. "You must comment KEYWORD to get my guide" gates promised
material behind required engagement. "Comment KEYWORD and I will send it over, and it is
also in my bio" does not, because the material is not gated. Where the user's campaign
post is visible in capture, read the wording and flag it if it gates. Where it is not,
mention the distinction once.

## What is permitted, and how narrow it is

The one API-blessed path from a comment to a DM:

| Constraint | Value | Source |
|---|---|---|
| Private replies per comment | exactly one | [research/raw/leadharvest--platform-rules--meta-private-replies-devdocs-2026.md] |
| Eligibility window from comment creation | 7 days | [research/raw/leadharvest--platform-rules--meta-private-replies-devdocs-2026.md] |
| Does the private reply open a conversation? | No. Only the person's response opens the 24-hour window. | [research/raw/leadharvest--platform-rules--meta-private-replies-devdocs-2026.md] |
| Live comments | reply only during the broadcast | [research/raw/leadharvest--platform-rules--meta-private-replies-devdocs-2026.md] |
| Account type | Instagram Professional accounts only | [research/raw/leadharvest--platform-rules--meta-private-replies-devdocs-2026.md] |

And the standard Meta messaging model:

| Mechanism | Duration | Opened by | Source |
|---|---|---|---|
| Standard messaging window | 24 hours, promotional content allowed | a user message, CTA button, Click-to-Messenger ad, plugin, or message reaction | [research/raw/leadharvest--platform-rules--meta-messenger-policy-2026.md] |
| Human agent tag | 7 days | manual response by a real person | [research/raw/leadharvest--platform-rules--meta-messenger-policy-2026.md] |
| One-Time Notification | single use, token valid up to 1 year | explicit user request | [research/raw/leadharvest--platform-rules--meta-messenger-policy-2026.md] |

A comment is NOT on the list of things that open the standard window
[research/raw/leadharvest--platform-rules--meta-messenger-policy-2026.md]. This trips up
operators who assume a commenter is reachable.

The human agent tag is the mechanism that matches this skill's workflow: a real person
answering by hand, inside 7 days
[research/raw/leadharvest--platform-rules--meta-messenger-policy-2026.md].

## Rate limits, and why the numbers are soft

**LinkedIn publishes nothing.** "LinkedIn doesn't publish an official LinkedIn connection
request limit or public message limits. These ranges come from observed usage patterns"
[research/raw/leadharvest--platform-rules--linkedin-safe-limits-phantombuster-2026.md].
Every number below is observed, not official. Say so when quoting them.

| Action | New account, first 90 days | Aged account, 90 days or more |
|---|---|---|
| Connection requests, daily | 10 to 15 | 15 to 25 |
| Connection requests, weekly | 40 to 60 | 60 to 100 |
| DMs to first-degree connections, daily | 20 to 40 | 40 to 80 |
| Profile views, daily | 100 to 200 | 150 to 300 |
| Comments, daily | 10 to 30 | 10 to 30 |
| Likes, daily | 30 to 100 | 30 to 100 |

[research/raw/leadharvest--platform-rules--linkedin-safe-limits-phantombuster-2026.md]

A second independent vendor reports the same roughly 100-per-week invitation ceiling,
consistent across free, Premium and Sales Navigator since around 2022
[research/raw/leadharvest--platform-rules--linkedin-crackdown-anybiz-2026.md].

**Instagram limits are engagement-proportional, not flat.** Published: 2 API calls per
second per account, and an allowance of "200 x Number of Engaged Users" over 24 hours.
The source that headlines a 200-per-hour number then concedes "Meta publishes no flat
hourly DM cap for Instagram"
[research/raw/leadharvest--platform-rules--instagram-dm-ban-wave-sumgenius-2026.md]. A
small account has a small allowance by design, which is precisely backwards from what a
growing operator assumes.

**Comment automation limits are unpublished by anyone.** An operator asking ManyChat
support directly for comment and DM rate limits received no official answer in the thread;
the only reply came from another user asserting "There is no limit so far for comment
trigger per hour or per day"
[research/raw/leadharvest--automation-tools--manychat-community-limits-thread.md]. Do not
give a user a number for this. There isn't one.

## Why the numbers do not save you

This is the finding that should shape what the skill tells users.

LinkedIn moved from volume-based enforcement to behavioral scoring, evaluating session
origin and IP patterns (shared infrastructure reads as automation), timing consistency
(identical send times flag), acceptance rates (low conversion signals non-human activity),
and script injection from browser extensions. The stated consequence: "accounts can be
flagged even while operating inside the numeric caps" because "LinkedIn's systems score
behavior" [research/raw/leadharvest--platform-rules--linkedin-crackdown-anybiz-2026.md].

Enforcement now also reaches the vendor. LinkedIn removed a tool vendor's public page and
founder profiles in March 2026, and roughly 40% of accounts using flagged tools were
restricted between January and March 2026. That percentage is vendor-reported and
uncorroborated in this archive
[research/raw/leadharvest--platform-rules--linkedin-crackdown-anybiz-2026.md]. Directional
at best, but the direction is that USING a flagged tool is itself a risk factor, separate
from the user's own volume.

On Instagram, suspension can arrive with no warning and with no actual violation, because
the reported causes include context-blind AI moderation producing false positives
alongside genuine automation abuse. Recovery is described as a 48 to 72 hour pause and an
appeal [research/raw/leadharvest--platform-rules--instagram-dm-ban-wave-sumgenius-2026.md].
Meta's own standard notes that restrictions may apply "even at lower frequencies when
combined with other spam indicators"
[research/raw/leadharvest--platform-rules--meta-community-standards-spam-2026.md].

## A conflict in the evidence, stated rather than smoothed

Expandi's H1 2026 report presents LinkedIn automation working well, with a 10.3% overall
reply rate measured across 70,130 campaigns
[research/raw/leadharvest--first-touch--expandi-state-of-linkedin-outreach-h1-2026.md].
AnyBiz names Expandi specifically as a flagged tool whose users faced restrictions
[research/raw/leadharvest--platform-rules--linkedin-crackdown-anybiz-2026.md]. Both are
vendors with opposite commercial interests.

Preferred reading: the two claims are not actually in conflict. The performance data is
probably sound, because it is platform-measured on a large sample. The risk data is
probably directionally sound, because it is corroborated by LinkedIn's own quoted User
Agreement language. Automated outreach can produce replies AND put the account at risk at
the same time. The conclusion is not "automation does not work". It is "automation works
until the account is gone", and for an operator whose business runs on one profile, that
is the whole calculation.

## Legal regime: contractual versus statutory

| Channel | Regime | Enforcer | Consequence |
|---|---|---|---|
| Platform DMs, comments, connection requests | Contractual, via user agreement and community standards | The platform | Account restriction or termination, sometimes with no warning [research/raw/leadharvest--platform-rules--instagram-dm-ban-wave-sumgenius-2026.md] |
| Email | Statutory, CAN-SPAM | The FTC | Up to $53,088 per violating message, counted per message [research/raw/leadharvest--legal--ftc-can-spam-compliance-guide.md] |

The seven CAN-SPAM requirements, verbatim headings: do not use false or misleading header
information; do not use deceptive subject lines; identify the message as an ad; tell
recipients where you are located; tell recipients how to opt out; remember that
subscribers and members can opt out; honor opt-out requests promptly
[research/raw/leadharvest--legal--ftc-can-spam-compliance-guide.md].

**Consent does not travel between channels.** Commenting a keyword is not an email
address and is not consent to email
[research/raw/leadharvest--legal--ftc-can-spam-compliance-guide.md].

**The line is not perfectly clean.** In Facebook, Inc. v. MAXBOUNTY, Inc., Case No.
CV-10-4712-JF (N.D. Cal., March 28, 2011), the court held that communications posted on
Facebook can qualify as "commercial electronic mail message[s]" under CAN-SPAM, reading
"electronic mail address" as a "destination...to which an electronic mail message can be
sent or delivered". Caveats from the source: district court, motion to dismiss, merits not
reached, 2011 [research/raw/leadharvest--legal--dmlp-facebook-v-maxbounty.md]. Do not tell
a user that social DMs are categorically outside CAN-SPAM.

For this skill's user, the near-term risk is contractual. It arrives fast and it takes the
audience with it.

## Steering language: what to say when a user asks the skill to automate

Do not lecture. Say it once, concretely, then offer the alternative.

> I draft these, I do not send them, and I will not automate the sending. X prohibits
> unsolicited bulk or automated DMs outright, LinkedIn's user agreement bans automated
> message sending in section 8.2, and LinkedIn now flags accounts on behavior rather than
> volume, so staying under the caps does not protect you. Instagram suspends without
> warning. Your Facebook profile is the asset the whole campaign runs on. What I can do is
> get the list ranked and the messages written so sending them by hand takes fifteen
> minutes instead of an afternoon.

If the user pushes, do not argue past one round. Note the risk in the deliverable and let
them make their own call about their own account. The skill still will not send.

## Named research gaps to disclose when relevant

1. No numeric LinkedIn limit in this archive comes from a LinkedIn-published document.
   LinkedIn blocks automated fetching of its user agreement and help center, and LinkedIn's
   own text confirms it does not publish those numbers
   [research/raw/leadharvest--platform-rules--linkedin-safe-limits-phantombuster-2026.md].
2. No comment-automation rate limit is published by any vendor or platform in this archive
   [research/raw/leadharvest--automation-tools--manychat-community-limits-thread.md].
3. Meta's Private Replies documentation covers Instagram professional accounts and pages.
   Keyword campaigns run from a PERSONAL Facebook profile, which is common among these
   operators, have no documented API path in this archive at all. For those, manual
   follow-up is not the safe option, it is the only option
   [research/raw/leadharvest--platform-rules--meta-private-replies-devdocs-2026.md].
