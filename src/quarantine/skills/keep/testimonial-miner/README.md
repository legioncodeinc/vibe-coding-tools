# testimonial-miner

Finds the praise you already earned, banks it as verbatim quotes with attribution and receipts, and tells you which ones you are allowed to publish.

## What it does

You are sitting on more praise than you can remember. It arrived as a DM at 11pm, as a line on a call nobody wrote down, as a comment six months ago. None of it is where you can find it, so the launch page has a blank space where the proof should be.

It sweeps captured messages, public comments and reviews, and meeting transcripts for gratitude, results and referrals, then banks each find: the quote, who said it, their role, the date said, and the receipt.

The most important field is the permission tier, assigned from where the words were said rather than how good they are. Public and reusable: a stranger could already read it. Private and needs permission: a DM or email, and the skill drafts the request. Confidential and do not use: an NDA, a call, or a client's private figures, where you do not use it and do not ask, because asking is its own harm. Unknown channel defaults to confidential.

Mined praise is also legally cleaner than solicited praise. Per the FTC's own guidance, if someone had no reason to expect a benefit before they spoke, a payment made later for permission needs no disclosure. Unprompted praise is exactly what this skill collects.

## When to use it

- The launch is next week and the social proof section is empty.
- You know a client said something great and you cannot find it.

Just ask for it. Trigger phrases include "find my testimonials", "build a testimonial bank", "social proof for the launch", "can I use this review", "do I need permission to quote this client".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| Monthly sweep | The 1st, 08:00 local | New praise from the last 45 days, tiered, results quotes split out. No drafts, no files |
| Deep run | Before a launch or a pitch | 180 days, the full bank, drafted requests, the gap report |

Monthly, not weekly. Praise arrives at a rate that makes a weekly report mostly empty, and an empty report trains you to stop reading. The skill sets it up: it shows you the prompt and schedule, you approve, it creates it.

## What you get

`testimonial-bank.md`, which persists across runs, so a quote someone declined is never re-proposed. Ten sections: usable now, awaiting permission, the results sub-bank, confidential material listed without its text, unverified quotes with the action that resolves each, and the gap report naming relationships with no captured praise.

Every results quote carries a flag for the disclosure it would need: SUBSTANTIATED, NEEDS EXPECTED-RESULTS DISCLOSURE, or NOT PUBLISHABLE AS A RESULTS CLAIM. Beside it, `permission-requests-YYYY-MM-DD.md` holds the drafts, one per person, held for approval.

## What it needs

- The Littlebird MCP on a Power or Pro plan.
- Your client roster, named once. It asks rather than inferring from meeting titles, because guessing turns prospects into clients.
- A personal voice skill, optional. Permission requests are written as you. Without one the skill says so instead of imitating you.

## Limits worth knowing

It never assesses whether a claimed result is typical. It cannot: computing typicality from a praise bank is circular, because the bank only holds clients happy enough to say something. Most small-business results quotes land on the third flag, and it says so rather than nudging you to the first.

It never improves a quote. Trimming follows stated rules, each trim carries the rule number that authorised it, and the original is stored beside it. Rewriting is fabrication, and the FTC lists AI-generated reviews as prohibited.

Nothing is published and nothing is sent. No draft offers a discount or a gift, because incentives tied to positive reviews are where enforcement is looking. This is not legal advice.

## Related skills

[client-health-radar](../client-health-radar/README.md), which reads the same relationships for risk.
[said-it-already](../said-it-already/README.md), to check you are not republishing yourself.
[content-repurposer](../content-repurposer/README.md), to put a banked quote to work across a week.
[routine-architect](../routine-architect/README.md), if the monthly cadence needs reshaping.

## Under the hood

`SKILL.md` has the full instruction set. `references/` holds `permission-tiers.md`, `ftc-compliance.md`, `attribution-verification.md` and `quote-formatting.md`.

`references/research/` archives 15 primary sources, including the FTC Endorsement Guides, the Reviews Rule and the December 2025 warning letters. Every domain claim traces to one.
