# Lifecycle email QA checklist

Run every gate on every message and on the sequence as a whole. Report failures before revisions so the operator can see what changed.

## Gate 1: truth and evidence

- [ ] Every factual statement maps to intake evidence.
- [ ] The copy does not invent consent, prior contact, pain, intent, price, proof, urgency, scarcity, availability, results, competitors, or a deadline.
- [ ] `Re:` appears only when a real thread exists.
- [ ] Any proposal, trial, quote, meeting, objection, or timeline is verified.
- [ ] No unresolved placeholder can reach a live send.
- [ ] Optional facts with no evidence are omitted rather than guessed.

Situational personalization is useful only when the situation is real. [research/raw/2026-08-10-sparrowcrm-lead-follow-up.md]

## Gate 2: sender and white-label voice

- [ ] The sender is clearly `{agency}` or an approved person at `{agency}`.
- [ ] The From identity, reply address, signature, and footer agree.
- [ ] Customer-facing copy does not mention Belkins, Hunter, SparrowCRM, Reddit, HighLevel, GoHighLevel, or this research archive unless the operator explicitly requires that brand.
- [ ] No customer-facing email links to an internal research or help source.
- [ ] The tone matches supplied agency examples. If no voice exists, use plain, professional, direct language.

Google advises a consistent, accurate sender display identity, and HighLevel advises aligning the From address with the sending domain. [research/raw/outside-window-google-email-sender-guidelines.md] [research/raw/2026-06-30-highlevel-email-best-practices.md]

## Gate 3: message usefulness

- [ ] The subject accurately describes the message.
- [ ] The first sentence makes the real context clear.
- [ ] This step adds one new reason to respond.
- [ ] The primary CTA is singular, low-friction, and appropriate to the stage.
- [ ] The message is shorter or more focused than the prior step when it no longer needs to restate context.
- [ ] A no, not-now, or timing change is easy to communicate.
- [ ] The final email clearly pauses active follow-up.

Hunter and Belkins both recommend a different angle instead of a repeated nudge. [research/raw/2026-06-12-hunter-three-follow-ups.md] [research/raw/2026-06-26-belkins-sales-follow-up-statistics.md]

## Gate 4: lifecycle behavior

- [ ] The lead state and sequence entry condition are explicit.
- [ ] The lead's stated date overrides a default cadence.
- [ ] Stop-on-reply or the equivalent is enabled.
- [ ] Reply, booking, purchase, opt-out, complaint, bounce, no, disqualification, and human takeover exits are defined.
- [ ] No overlapping automation or manual outreach will race this sequence.
- [ ] The owner and response handoff are named.

HighLevel documents stop-on-reply, step-level sequence controls, and a manual team-member reply event that can stop remaining automation. [research/raw/2026-06-11-highlevel-email-sequences.md] [research/raw/2026-07-10-highlevel-user-replied-trigger.md]

## Gate 5: compliance and deliverability

- [ ] An authorized operator supplied the jurisdiction, message class, and permission basis.
- [ ] Covered commercial mail has accurate routing and subject information, sender postal address, and a clear working opt-out path.
- [ ] Opt-out handling meets the applicable policy and legal timeline.
- [ ] Sender authentication and domain readiness have been verified by the platform owner.
- [ ] Every destination, reply route, and unsubscribe path has been tested from an actual sent message.
- [ ] Hard bounces, complaints, DND, and opt-outs are suppressed.

The FTC lists United States commercial-email duties, while Google and HighLevel document deliverability prerequisites. Legal requirements can vary, so this gate does not replace qualified review. [research/raw/outside-window-ftc-can-spam.md] [research/raw/outside-window-google-email-sender-guidelines.md] [research/raw/2026-06-30-highlevel-email-best-practices.md]

## Gate 6: merge and rendering tests

Test at least these records before launch:

1. Fully populated contact.
2. Missing first name.
3. Missing optional company or goal field.
4. Long agency and sender names.
5. Mobile-width rendering.
6. Plain-text rendering.
7. Reply path.
8. Opt-out path.

HighLevel says missing merge values can create blank text and recommends fallback values or conditional content. [research/raw/2026-09-01-highlevel-merge-field-fallbacks.md]

## QA result format

```text
Result: PASS | HOLD
Blocking failures:
- [gate, email step, issue, required correction]
Non-blocking improvements:
- [step, suggestion]
Unresolved evidence:
- [placeholder or claim]
Platform tests still required:
- [test and owner]
```
