# Permission tiers

The most important field in the bank. Every quote gets exactly one tier, assigned by **where it
was said**, not by how good it is and not by how much the user wants to use it.

**Not legal advice.** The reasoning below rests on public sources archived in
`research/`. Advertising and publicity law varies by state and by country. Anything with real
money on it goes to a lawyer.

## Why the tier exists at all

Nothing in the FTC Endorsement Guides or in the Consumer Reviews and Testimonials Rule requires
consent before quoting a customer. The FTC's own answer to "can we quote them in our ads" is yes
(`research/distilled-testimonial-practice.md`, section 7).

The permission requirement comes from somewhere else: state right of publicity and privacy law.
New York Civil Rights Law section 51 gives a cause of action to any person whose "name, portrait,
picture, likeness or voice is used within this state for advertising purposes or for the purposes
of trade without the written consent first obtained", with injunctive relief, damages, and
discretionary exemplary damages where the use was knowing
(`research/distilled-testimonial-practice.md`, section 7). A second source names California Civil
Code 3344 as a parallel provision, also requiring prior written consent, and states it protects
ordinary customers and not only celebrities; that citation is second-hand and unverified
(`research/distilled-testimonial-practice.md`, section 7).

Note the standard those statutes set: written consent, obtained first. Note also that the
aggravating factor in both the publicity statute and the FTC penalty regime is the same word,
knowing. Using material you knew you did not have the right to use is the thing that costs extra
in both places (`research/distilled-testimonial-practice.md`, sections 2 and 7).

There is a second reason, and it is commercial rather than legal. Users discount testimonials on
a company's own site, on the stated reasoning that "the website would of course include only
positive reviews", and trust external checkable sources more than company-sponsored content
(`research/distilled-testimonial-practice.md`, section 9). A quote that can be pointed back to a
real public review or a real public post has a property that a lifted DM does not.

## The three tiers

### Tier 1: Public and reusable

**Definition.** Said in a public comment, a public review, a public post, a public recommendation,
or any other place the person chose to make it visible to strangers.

**Test:** could a stranger with no relationship to either party read this without being given
access to anything? If yes, tier 1.

**Status:** usable with attribution.

**Still required:**

- A courtesy heads-up. Not a legal gate, a relationship one, and it also gives the user a chance
  to confirm the person's current title (`attribution-verification.md`).
- Link back to the public source where the platform allows it, rather than copying the text into
  an isolated page. One archived source asserts that copying a public review into your own
  marketing is copyright infringement and recommends the platform's own embed instead. That
  assertion comes from a vendor selling testimonial-collection software and is not attributed to
  counsel, and it sits in direct tension with the FTC's own untroubled discussion of quoting
  customers in ads. **Both readings are recorded and neither is smoothed away**
  (`research/distilled-testimonial-practice.md`, section 11). Linking back satisfies both readings
  and it is also what the credibility evidence recommends
  (`research/distilled-testimonial-practice.md`, section 9).
- The Part 255 obligations apply exactly as they do to any tier. Public does not mean unregulated.
  See `ftc-compliance.md`.

**Does not qualify as public:** a post inside a private or closed group, a members-only community,
a Slack or Discord the user is a member of, a comment on a private account, or a review visible
only to logged-in customers. Those are tier 2. The test is about the stranger, not about the size
of the audience.

### Tier 2: Private, needs permission

**Definition.** Said in a DM, an email, a one-to-one thread, a private group, a text message, or
any other channel where the person was speaking to the user or to a closed circle rather than to
the world.

**Status: NOT USABLE.** Not on a landing page, not in a deck, not in a social post, not in a cold
email, not anywhere, until the person says yes.

This is the largest tier in a typical bank and it contains the warmest material, because people
are more generous in private. That is exactly why it needs a gate.

**What resolves it:** the person says yes. The skill drafts the request. The user reviews and
sends it. See the templates below.

**When they say yes:** record the yes with its date and its channel, record what they agreed to
(which quote, which channels, how long), and promote the quote to usable. Do not promote a quote
on a verbal "sure" recalled from memory with no record. The publicity statutes contemplate written
consent (`research/distilled-testimonial-practice.md`, section 7), and a written record is cheap.

**When they do not reply:** silence is not consent. The quote stays in tier 2 indefinitely. One
reminder is reasonable. Escalating urgency is not: urgency is a conversion tactic and consent is
not a conversion. One archived template recommends a day-7 "urgency framing" follow-up, and it is
recorded here specifically as a pattern not to copy
(`research/distilled-testimonial-practice.md`, section 7).

**When they say no:** the quote is deleted from the bank, not moved to a maybe pile. Record only
that this person declined, so no future run re-proposes it.

### Tier 3: Confidential, do not use

**Definition, any one of these is sufficient:**

- Said in a meeting or context governed by an NDA or a confidentiality clause
- Describes a client's own private results, revenue, margins, headcount, customer names, or
  internal problems
- Contains figures, named third parties, or competitive detail the speaker would not want public
- Concerns work the client has not publicly acknowledged the user did for them, including
  ghostwritten, white-labelled, or subcontracted work
- Was said about a third party rather than to the user, and the third party has not been consulted
- Comes from a regulated context where the speaker's employer controls their public statements

**Status: do not use. Do not ask.** Tier 3 is not a slower tier 2. Sending a permission request
for material that is confidential by construction puts the person in the position of having to
say no to something they should never have been asked, and it tells them the user has been mining
their private calls for marketing.

**The one exception, and it is narrow.** Where the underlying story is genuinely valuable, the
move is not to ask for the quote. It is to ask whether the person would be willing to say
something on the record, from scratch, that they are comfortable with. That is a new conversation,
not a permission request, and it is initiated by the user, not by this skill.

**A de-identified fallback exists but is not automatic.** Specific context can build credibility
without a name: "A 75-person brand experience agency in the UK carries more weight than a
mid-sized agency" (`research/distilled-testimonial-practice.md`, section 9). But de-identification
is only meaningful if the person cannot be identified from the description, and in a niche market
a 75-person UK agency with a named result may be identifiable by anyone in that market. Propose
de-identification only with the speaker's agreement, never as a way around a tier 3 classification.

**Meeting material defaults to tier 3.** Everything from `LB_INTERNAL_SEARCH_MEETINGS` and the
transcript tools starts at tier 3 and has to be argued down, not up. A recorded call is a private
conversation the user happened to have a transcript of.

## Assigning the tier

Assign from the source channel, mechanically, before anyone reads the quote for quality:

| Source | Default tier |
|---|---|
| Public review platform, publicly visible | 1 |
| Public social comment or post, public account | 1 |
| Public professional recommendation | 1 |
| The user's own site, already published with a prior yes | 1, with the prior consent recorded |
| Closed group, community, Slack, Discord | 2 |
| DM, email, SMS, one-to-one thread | 2 |
| Comment on a private or restricted account | 2 |
| Meeting or call transcript | 3 |
| Anything containing a third party's private figures | 3 |
| Anything under an NDA | 3 |
| Anything whose channel cannot be determined | 3 |

**Unknown channel means tier 3, not tier 2.** The default on uncertainty is the most restrictive
tier. A quote whose provenance the skill cannot establish is exactly the quote most likely to
cause a problem.

Tiers move in one direction only in an automated pass: downward, toward more restriction. Moving a
quote up a tier requires a human decision with a recorded reason.

## Drafting permission requests

The skill drafts. **The skill never sends** (`evidence-standards.md`, rule 6). Every draft is
presented to the user in full, verbatim, and approved through `AskUserQuestion` before it goes
anywhere. Approving the plan to ask is not approving the words.

Check whether a personal voice skill is installed in the session and use it. If none is installed,
say so plainly and point at this marketplace's voice creator skills rather than imitating a voice
from nothing. Never invent a voice profile.

### What every request must contain

1. The exact quote, shown back to them in full
2. Where and when they said it, so they can place it
3. Exactly where the user wants to use it, named specifically
4. A confirmation of how they want to be credited: name, role, company
5. An explicit, easy no

### What every request must NOT contain

- **Any benefit, discount, gift or incentive offered alongside the ask.** Under 465.4 it is
  prohibited to provide compensation or incentives in exchange for reviews expressing a particular
  sentiment, and all ten of the FTC's December 2025 warning letters involved incentives tied to
  positive reviews (`research/distilled-testimonial-practice.md`, sections 3 and 6). The praise
  here already exists and is not being purchased, so the request is not itself the prohibited
  conduct. Keeping money out of the message keeps it obviously clean. One archived template pairs
  a 10 percent discount with the request and is recorded specifically as a template not to copy
  (`research/distilled-testimonial-practice.md`, section 6).
- Peer pressure framing such as "many other clients have already agreed"
  (`research/distilled-testimonial-practice.md`, section 6).
- Any suggestion they improve, strengthen, or expand what they said. That converts spontaneous
  praise into solicited praise and changes the analysis. If the user wants a stronger quote, that
  is a separate ask made openly.
- Pre-checked assumptions such as "unless I hear otherwise I will use this".

### Template A: public quote, courtesy heads-up

```
Subject: Using your review on the site

Hi FIRSTNAME,

You left this on PLATFORM back in MONTH:

  "QUOTE"

Thank you, genuinely. I would like to feature it on PAGE, and link back to the original.

Two things before I do. Are you happy for me to use it, and is TITLE at COMPANY still right for
how you would want to be credited?

If you would rather I did not, that is completely fine and it will not be awkward.

NAME
```

### Template B: private quote, permission request

```
Subject: Permission to quote you

Hi FIRSTNAME,

You said this to me in CHANNEL on DATE:

  "QUOTE"

It stuck with me. I would like to use it as a testimonial on SPECIFIC PLACE.

Because you said it privately rather than publicly, I am not going to use it unless you tell me
it is fine. So: is it fine? And if so, how would you like to be credited? I have you as TITLE at
COMPANY.

Happy to trim it for length if you prefer, and I will send you the exact wording before it goes
anywhere. A no is a completely fine answer.

NAME
```

### Template C: private quote containing a specific result

Use this whenever the quote contains a number or a claimed outcome. It carries one extra
paragraph, because a results claim has requirements a general compliment does not.

```
Subject: Permission to quote you, and a check on the numbers

Hi FIRSTNAME,

You said this to me in CHANNEL on DATE:

  "QUOTE"

I would like to use it on SPECIFIC PLACE, with your name and role.

Two checks first, because it mentions a specific result. Is the figure still one you are
comfortable having in public, and is it accurate as you would state it today? I would rather use
your number than mine, and I would rather use no number at all than one you would want to
qualify.

And how would you like to be credited? I have you as TITLE at COMPANY.

If any part of this is a no, that is fine, including just the number.

NAME
```

Template C exists because a testimonial about performance is read as representing what customers
generally achieve, and the advertiser carries the substantiation burden
(`research/distilled-testimonial-practice.md`, section 5). Getting the speaker to confirm the
figure is the first step. It is not the last one. See `ftc-compliance.md`.

### Sequencing

Do not send every request at once. Order by how confident the yes is and how much the user needs
the quote, send a small first batch, and let the user see the responses before the rest goes out.
A batch of fifteen identical permission requests landing in one afternoon reads as a campaign, and
a campaign is easier to decline than a note.

## Recording consent

For every yes, record in the bank: date, channel, exact text of their reply, which quote, which
uses they agreed to, and how they asked to be credited. Where they agreed only to specific
channels or a specific duration, record that as a limit on the quote and honor it.

The archived practice guidance says a release should specify how the content will be used, where
it will appear, the duration, and the scope of commercial use
(`research/distilled-testimonial-practice.md`, section 7). A short email exchange will not cover
all four. Where the intended use is substantial, a paid campaign, a video, an ongoing homepage
placement, the user should get a real release drafted by someone qualified to draft one. Say so.

## Revocation

If someone later asks to have their quote removed, remove it, everywhere, and record the
revocation so no future run re-proposes it from the original capture. The bank persists across
runs and will happily re-surface a quote the person withdrew unless the withdrawal is written
down.
