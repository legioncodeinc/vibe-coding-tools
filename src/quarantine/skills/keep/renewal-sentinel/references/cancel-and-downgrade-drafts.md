# Cancel and downgrade drafts

The skill drafts. The user sends. There is no path through this skill that transmits
anything to a vendor.

## The draft-never-send law

Nothing is sent, posted, published, or written into a third-party system without the user
approving the actual final text through `AskUserQuestion`. Approving the plan is not
approving the words [evidence-standards.md, rule 6].

That holds even when an email connector is available in the session. Availability is not
permission.

Every draft goes into the drafts file headed:

```
STATUS: HELD FOR APPROVAL. Not sent.
```

## Which items get a draft

Only items the user flags. Do not draft for the whole calendar. A calendar of twelve
renewals with twelve pre-written cancellation emails reads as pressure to cancel things, and
most of those renewals are things the user wants.

The flow: present the calendar, ask which items the user wants to act on, then draft only
those. Use `AskUserQuestion` with the items grouped by action so the user can pick in one
pass.

## Four draft types

| Type | When | Ask |
|---|---|---|
| Cancel | User wants out, window open | Confirm non-renewal, confirm effective date, confirm no further charge |
| Downgrade | Tool still used, tier too high | Move to a named lower tier at the renewal date |
| Renewal negotiation | User wants to keep it, price is the issue | A specific number or a specific term, before the notice deadline |
| Window inquiry | Notice window unknown or already closed | Ask the vendor what the window actually is, or ask for an exception |

The window inquiry is the one people forget and it is frequently the most useful, because it
converts a Low-confidence assumed window into a High-confidence known one at the cost of one
email.

## Structure of a cancel draft

Four elements, in this order. Anything longer gets edited by the vendor's retention flow
rather than read.

1. **The account.** Account email or ID, plan name. Enough for the vendor to find it and
   nothing more.
2. **The instruction.** "Please do not renew this subscription at the end of the current
   term." Not "I am thinking about cancelling." Not a question.
3. **The date.** The current term end date as the user understands it, stated so the vendor
   has to correct it if it is wrong. This is how a wrong date gets found before it costs
   money.
4. **The confirmation ask.** "Please confirm in writing that the subscription will not renew
   and that no further charge will be made."

Element 4 is the one that matters six weeks later when a charge appears anyway.

### What a draft never contains

- Raw captured material of any kind [evidence-standards.md, rule 7].
- The names of other vendors the user pays.
- Any description of the user's stack beyond the account being cancelled.
- A reason, unless the user supplies one. A reason is an opening for a retention script.
- An apology.

## Structure of a downgrade draft

Same first element, then:

2. The current tier and the target tier, both by their published names.
3. The effective date, which should be the renewal date rather than immediately, so the user
   does not pay for a partial period twice.
4. The confirmation ask, including the new price.

Offer the downgrade before the cancel where the user is unsure. A downgrade is reversible and
a cancellation usually is not, and the archived renewal guidance reports 15% to 30% savings
from a structured renewal process without requiring anyone to give a tool up
[research/distilled-renewal-and-expiry-practice.md, section 4]. That figure comes from a
vendor blog with no stated sample, so quote the reasoning and not the number.

## Structure of a negotiation draft

Timing is the whole game. A vendor discounts a renewal that might not happen, and the leverage
is gone once the notice deadline passes.

Send it in the 60 to 90 day band, which is the formal-engagement stage, so the 30 to 60 day
negotiation stage still has room for the two to four rounds an enterprise negotiation
typically takes [research/distilled-renewal-and-expiry-practice.md, section 3].

Content:

1. The account and the renewal date.
2. **A specific ask.** A number, a term, or a tier. "Can you do better" gets a form reply.
3. One reason grounded in something real: usage that does not match the tier, a competitor
   quote, a budget constraint.
4. A deadline that is the user's notice deadline, stated as a date.

**Where the increase is the trigger**, anchor on the contractual norm rather than on outrage.
In the benchmark corpus 21% of agreements carry an automatic renewal increase, most commonly
5% to 8% [research/distilled-renewal-and-expiry-practice.md, section 3]. An increase well
above that band is worth naming as above the norm. Do not quote the 12% to 18% figure at a
vendor as if it were a benchmark; it comes from a vendor blog with no stated sample
[research/distilled-renewal-and-expiry-practice.md, section 4].

## Structure of a window inquiry

Short, and it costs nothing to send.

1. The account.
2. "What is the notice period for non-renewal on this plan, and what is the last date I can
   give notice for the current term?"
3. Where the window looks already closed: "If that date has passed, can you tell me what
   options I have for this term?"

Path 1 in `cancellation-windows.md` is the same email with a request attached. Many vendors
will let a customer out of a renewal they clearly do not want. Asking costs an email.

## Never assert a legal position in a draft

This is the specific way this skill can hurt a user. A draft that says "under FTC rules you
are required to let me cancel" is wrong on the facts and hands the vendor an easy dismissal.

There is no federal click-to-cancel rule in force. The 2024 rule was vacated in its entirety
on 2025-07-08 on procedural grounds, and the replacement is at advance-notice stage with
comments closed in April 2026 [research/distilled-renewal-and-expiry-practice.md, section 1].

So:

- No draft cites the FTC.
- No draft cites a state automatic renewal law.
- No draft cites NY GOL 5-903.

Where a legal angle genuinely exists, it goes in the **report** as a question for the user's
attorney, phrased as a question [research/distilled-renewal-and-expiry-practice.md,
section 2]. It does not go in an email the user sends to a vendor. The report line reads:
"The vendor may have owed you a renewal notice. Worth asking your attorney whether NY GOL
5-903 applies here." Never "you are not bound by this renewal."

## Voice

These drafts are written as the user.

1. Check whether a personal voice skill is installed in this session. If one is, use it.
2. If none is installed, say so plainly in the drafts file and write in plain, neutral,
   direct business prose.
3. Never invent a voice profile from capture. Point the user at this marketplace's voice
   creator skills instead.

Neutral is a safe default here specifically. A cancellation email does not benefit from
personality, and a retention agent reads a warm one as an opening.

## Connectors, and degrading gracefully

Gmail, Outlook, a helpdesk, and every other product surface is a separate MCP server that
may or may not be connected in this session.

1. **List the available tools before assuming any connector exists.**
2. If an email connector is present, it still does not send. It may be used only after the
   user approves the exact final text, and only for the item they approved.
3. If no connector is present, that is the normal case and it costs nothing. The drafts file
   is the deliverable, formatted for copy and paste, one draft per item, each with the
   vendor's cancellation surface named where capture showed one.

## Where drafts sit relative to the calendar

The calendar entry carries the action. The draft carries the words. Cross-reference them by
item name so a user reading the calendar can find the matching draft, and every draft names
the decision deadline it is written against, because a draft sent after that date is a
different email.

## The approval gate

Before the run ends, present each draft in full and ask for approval per draft, not per
batch. Record the answer. An unapproved draft stays in the file marked
`STATUS: HELD FOR APPROVAL. Not sent.` and nothing further happens to it
[evidence-standards.md, rule 6].
