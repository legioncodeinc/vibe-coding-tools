# Cadence, handoff, and stop rules

No source in the current archive establishes one universal hot-lead or warm-lead schedule. Use the lead's real commitments first and the starting hypotheses below only when the intake has no better timing evidence. [research/README.md]

## Timing priority

1. Follow an explicit lead-stated date or mutually agreed next step.
2. Follow a verified lifecycle event, such as a proposal sent or a real trial end date.
3. Use the stage-specific starting cadence below as a test hypothesis.
4. Apply approved business hours, timezone, frequency, and compliance policies.

Current community evidence favors capturing an exact post-demo next step, and a warm-lead scenario shows why a stated review window should override generic follow-up timing. [research/raw/2026-09-02-reddit-sales-follow-ups.md] [research/raw/2026-08-05-reddit-warm-lead-timing.md]

## Starting hypotheses

These schedules are planning defaults, not performance claims. `Day 0` means the verified trigger day. Business-day spacing is preferred unless the lead or service context supports another schedule.

### Hot lead, explicit inbound intent

| Step | Starting time | Purpose |
|---|---|---|
| H0 | As soon as a responsible person can provide an accurate answer | Acknowledge the actual request, answer what can be answered, and set one next step |
| H1 | 1 business day after H0 if no reply | Add one useful fact, clarification, or choice |
| H2 | 3 business days after H0 if no reply | Add a new decision aid, answer, or verified resource |
| H3 | 7 business days after H0 if no reply | Ask whether the goal is still active and reduce the request |
| H4 | 14 business days after H0 if no reply | Close the active loop and state that follow-up will pause |

SparrowCRM favors prompt handling of fresh inquiries and a bounded 5 to 7 touchpoint pattern across channels, while Belkins finds value in later distinct steps in its B2B outreach data. The table above is a conservative email-only test design derived from those directions, not a reported winning cadence. [research/raw/2026-08-10-sparrowcrm-lead-follow-up.md] [research/raw/2026-06-26-belkins-sales-follow-up-statistics.md]

### Hot lead after proposal, demo, or trial

- Use the agreed date if one exists.
- For a real proposal with no agreed date, test a useful follow-up 2 to 3 business days after send, then widen later steps.
- For a real trial, anchor the message to the verified trial end date and actual usage only.
- Do not manufacture a quote expiry, implementation slot, discount deadline, trial date, or stakeholder approval.

SparrowCRM proposes 2 to 3 days after a proposal and 2 to 3 days before a verified trial end as situation-specific starting points. [research/raw/2026-08-10-sparrowcrm-lead-follow-up.md]

### Warm lead

| Step | Starting time | Purpose |
|---|---|---|
| W0 | Day 0 after the verified warm trigger | Deliver the requested or relevant value and ask one low-pressure question |
| W1 | Day 4 if no reply | Clarify priority using the lead's known context |
| W2 | Day 10 if no reply | Supply a useful comparison, answer, or resource |
| W3 | Day 21 if no reply | Ask whether another timing window is better |
| W4 | Day 35 if no reply | Pause the active series and leave an easy path back |

SparrowCRM describes nurture as stage-aligned touches over weeks or months and warns against sending too many messages too quickly. Hunter's 3 to 5 day spacing is outreach guidance, so it informs only the early gap in this warm-lead test design. [research/raw/2026-07-24-sparrowcrm-lead-nurture.md] [research/raw/2026-06-12-hunter-three-follow-ups.md]

## Same-thread rule

- Keep a real follow-up in the real thread when the system supports it.
- Preserve the actual subject. Do not add `Re:` to create false history.
- Start a new, accurate subject when no prior thread exists.

HighLevel and Hunter support real threaded sequences. Neither source authorizes fabricated thread history. [research/raw/2026-06-11-highlevel-email-sequences.md] [research/raw/2026-06-12-hunter-three-follow-ups.md]

## Immediate exit conditions

| Event | Automation action | Human action |
|---|---|---|
| Lead reply | Stop sequence | Route to owner with the thread and classification evidence |
| Team member reply or active takeover | Stop or pause sequence | Record owner and next step |
| Meeting booked or purchase completed | Stop sales follow-up | Move to the correct booked, onboarding, or customer process |
| Explicit no or not interested | Stop | Record the response without rebuttal unless the lead asks a question |
| Opt-out or DND | Stop and suppress | Confirm processing only when policy calls for it |
| Spam complaint | Stop and suppress | Escalate to deliverability owner |
| Hard bounce or invalid address | Stop and suppress | Correct only from verified first-party data |
| Wrong person | Stop for that recipient | Ask for a referral only if the recipient invited it or policy permits |
| Disqualified or closed-lost | Stop active pursuit | Record a lawful re-entry condition if one exists |
| Out-of-office reply | Pause and review | Use the stated return date only if present; do not treat it as positive intent |
| Permission or message-class conflict | Hold | Route to an authorized compliance owner |

HighLevel documents stop-on-reply and a separate team-member User Replied trigger, while FTC guidance requires prompt honoring of covered opt-out requests. [research/raw/2026-06-11-highlevel-email-sequences.md] [research/raw/2026-07-10-highlevel-user-replied-trigger.md] [research/raw/outside-window-ftc-can-spam.md]

## Re-entry

Re-entry requires a new verified trigger, clear suppression status, valid permission, and an owner-approved reason to contact the lead. A scheduled timer by itself is not a new reason. A genuine change in the lead's circumstances can justify review, but the fact must be verified before it appears in copy. [research/raw/2026-09-02-reddit-sales-follow-ups.md]
