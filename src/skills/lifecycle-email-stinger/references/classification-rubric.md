# Lead-state classification rubric

Use observable evidence, not a loose tag or a numerical score invented for the task. Return the state, the evidence used, the missing evidence, and the next allowed action.

## Lifecycle states

| State | Entry evidence | Allowed action | Exit |
|---|---|---|---|
| `HOT` | A verified direct buying signal: requested demo, quote, proposal, pricing, trial help, purchase step, or decision-related answer; an active reply about a real need; or a recent meeting with a specific next step | Prompt human-aware response and a tightly bounded follow-up sequence matched to the stage | Reply, booking, human takeover, explicit timing change, no, opt-out, invalid address, conversion, disqualification, or final-step expiry |
| `WARM` | Valid permission or relationship plus a real but non-immediate interest: requested educational material, attended or registered for a relevant event, asked to revisit on a stated future date, or has a known problem without active evaluation | Useful nurture or low-pressure follow-up aligned to the known topic and timing | New direct buying signal moves to `HOT`; reply or human takeover moves to `HUMAN_ACTIVE`; final-step expiry moves to `NURTURE` or `CLOSED` |
| `UNCLASSIFIED` | Only a list label, lead score, page visit, open, click, imported record, inferred pain, or incomplete permission record | Ask for evidence or hold. Do not write as though the lead is hot or warm | Sufficient evidence moves the contact to another state |
| `HUMAN_ACTIVE` | The lead or a team member has replied, or an owner is actively managing the conversation | Stop automated sales follow-up and route the thread to its owner | Owner records the next state and next action |
| `NURTURE` | No active buying motion, continued lawful relevance, valid permission, and a reason to remain in longer-term education | Lower-frequency, topic-relevant nurture with a new reason for each contact | Buying signal, reply, opt-out, complaint, invalid address, or relevance expiry |
| `CLOSED` | Explicit no, opt-out, complaint, hard bounce, wrong person with no valid referral, won, disqualified, or operator-approved closed-lost status | No active follow-up. Re-entry requires a new lawful trigger and operator approval | New verified trigger plus valid permission, when policy allows |

Current vendor guidance supports stage-based segmentation and warns against treating every behavioral signal as equally warm. [research/raw/2026-07-24-sparrowcrm-lead-nurture.md]

HighLevel documents a User Replied trigger specifically to detect team-member takeover and stop remaining automation. [research/raw/2026-07-10-highlevel-user-replied-trigger.md]

## Decision path

1. If suppression is not clear, return `HOLD` through the intake schema.
2. If a lead or team member has replied and the thread awaits a person, return `HUMAN_ACTIVE`.
3. If there is a verified direct buying or decision signal, return `HOT`.
4. If permission and real topic interest exist without active buying motion, return `WARM`.
5. If only machine-observed or administrative signals exist, return `UNCLASSIFIED`.
6. If an explicit stop condition exists, return `CLOSED`.

HighLevel supports open and click tracking, but its documentation does not equate either event with a human decision. A current community report also raises bot-inflation risk. [research/raw/2026-06-30-highlevel-email-tracking.md] [research/raw/2026-06-29-reddit-highlevel-bot-engagement.md]

## Evidence strength

| Evidence | Strength | Handling |
|---|---|---|
| Direct reply that states a need, question, objection, or timeline | Strong | Quote or faithfully summarize only what was said. |
| Demo, quote, proposal, pricing, or trial request | Strong | Classify as `HOT` if current and valid. |
| Agreed meeting or next step | Strong | Use its real date instead of a default cadence. |
| Direct content or event opt-in tied to a topic | Moderate | Supports `WARM`, not an active buying claim. |
| Existing customer or prior relationship | Context only | Verify message class and relevance. It does not automatically authorize every promotion. |
| Open, click, page visit, or lead score | Weak | Prioritize review if useful, but do not classify as hot without corroboration. |
| Purchased list, scraped contact, or imported record without basis | Insufficient | Outside scope and blocked for lifecycle automation. |

The lead's own stated review window is more actionable than a generic schedule. [research/raw/2026-08-05-reddit-warm-lead-timing.md]

## Classification output

```text
State: HOT | WARM | UNCLASSIFIED | HUMAN_ACTIVE | NURTURE | CLOSED
Evidence:
- [source, timestamp, exact behavior or statement]
Missing evidence:
- [field]
Next allowed action:
- [action]
Prohibited assumptions:
- [facts the draft must not imply]
```
