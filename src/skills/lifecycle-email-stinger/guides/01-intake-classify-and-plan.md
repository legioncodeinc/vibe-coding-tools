# Guide 01: intake, classify, and plan

Use this guide before writing any hot or warm lead email.

## 1. Build the fact record

Open `../references/intake-schema.md` and capture the sender identity, recipient, permission basis, verified trigger, stage, prior contact, stated goal, stated timing, approved offer details, CTA, suppression state, and overlapping outreach.

Treat absent information as `UNKNOWN`. Do not infer consent from presence in a CRM, infer a problem from an industry label, or infer human interest from an open or click. HighLevel exposes those tracking events, while current community evidence shows why they can be noisy. [../references/research/raw/2026-06-30-highlevel-email-tracking.md] [../references/research/raw/2026-06-29-reddit-highlevel-bot-engagement.md]

## 2. Return readiness before temperature

Choose one:

- `READY`: all critical send and truth fields are supported.
- `DRAFT_WITH_GAPS`: strategy can proceed, but unresolved fields remain visibly marked and nothing is send-ready.
- `HOLD`: sender, recipient, permission, message class, suppression, or required compliance data is missing or contradictory.

If the result is `HOLD`, list the smallest set of facts needed to resume. Do not fill the gap with a plausible guess.

## 3. Classify from observable evidence

Open `../references/classification-rubric.md` and return exactly one state: `HOT`, `WARM`, `UNCLASSIFIED`, `HUMAN_ACTIVE`, `NURTURE`, or `CLOSED`.

- A direct buying or decision signal can support `HOT`.
- Valid permission plus real non-immediate topic interest can support `WARM`.
- A list tag, lead score, open, click, or visit alone stays `UNCLASSIFIED`.
- A live reply or rep takeover moves to `HUMAN_ACTIVE` and stops automation.
- A no, opt-out, complaint, hard bounce, win, or disqualification moves to `CLOSED`.

Current SparrowCRM guidance supports stage-specific segmentation and warns against treating every behavioral signal the same. [../references/research/raw/2026-07-24-sparrowcrm-lead-nurture.md]

## 4. Select timing

Open `../references/cadence-and-stop-rules.md`.

1. Use the lead's stated date or the agreed next step.
2. Otherwise use a verified event, such as an actual proposal or trial end.
3. Only then use the hot or warm default as a test hypothesis.

A current warm-lead discussion shows the value of honoring the lead's own review window, and a post-demo discussion emphasizes capturing a concrete next step. Both are community evidence and do not set universal timing. [../references/research/raw/2026-08-05-reddit-warm-lead-timing.md] [../references/research/raw/2026-09-02-reddit-sales-follow-ups.md]

## 5. Produce the plan card

```text
Readiness: READY | DRAFT_WITH_GAPS | HOLD
Lead state:
Evidence:
Unknown or conflicting facts:
Sequence entry event:
Timing authority: lead-stated | event-based | test cadence
Selected template:
Primary CTA:
Human owner:
Exit conditions:
Compliance and platform checks still required:
```

Do not draft until the plan card makes the message context and stop behavior obvious.

