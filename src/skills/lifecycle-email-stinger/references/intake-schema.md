# Lifecycle email intake schema

Load this file before classifying a lead or drafting a sequence. Unknown facts remain unknown. A draft may preserve a clearly labeled placeholder, but no message is send-ready until every required field is resolved or safely omitted.

## Required intake fields

| Field | Required evidence | If unknown |
|---|---|---|
| `{agency}` | Exact customer-facing agency name | Stop. The email cannot be white-label without the sender identity. |
| `{sender_name}` | Real person or approved team identity | Stop before send. Do not invent a person. |
| `{sender_role}` | Approved customer-facing role, if used | Omit the role. |
| `{sender_email}` | Approved reply-capable address | Stop before send. |
| `{first_name}` | Contact record or direct signature | Use the tested fallback greeting. Never guess. |
| `{lead_email}` | Verified destination | Stop before send. |
| `{jurisdiction}` | Recipient and sender jurisdiction as supplied by the operator | Flag for compliance review. Do not declare compliance. |
| `{message_class}` | Commercial, transactional, relationship, or unknown, assigned by an authorized operator | Treat unknown as a send blocker for automation. |
| `{permission_basis}` | Opt-in record, direct inquiry, existing relationship, or another operator-approved basis | Stop before automated commercial follow-up. Do not infer consent from a CRM record. |
| `{verified_trigger}` | Exact action and timestamp, such as a demo request, quote request, reply, meeting, proposal, or opted-in content request | Classify as `UNCLASSIFIED`. |
| `{stated_goal}` | The lead's own words or a faithful summary with source | Omit. Do not invent a pain point. |
| `{stage}` | Inquiry, discovery, demo, proposal, trial, decision, nurture, or another supplied stage | Classify as `UNCLASSIFIED`. |
| `{last_contact}` | Timestamp, channel, sender, subject, and outcome | Do not imply a prior conversation or use `Re:`. |
| `{agreed_next_step}` | Exact commitment, owner, and date if one exists | Use a default test cadence only if all other send gates pass. |
| `{lead_timeline}` | Date or timing stated by the lead | Do not create urgency or a deadline. |
| `{verified_offer}` | Approved offer and scope | Omit offer details. |
| `{verified_price}` | Approved current price and terms | Omit price. Never estimate. |
| `{verified_proof}` | Approved case study, testimonial, result, source, and usage permission | Omit proof. Never synthesize a result. |
| `{verified_resource}` | Approved asset name, URL, and accurate one-line description | Omit the asset and write a question-led email. |
| `{primary_cta}` | One valid next action and working destination | Ask for a plain-text reply if appropriate. |
| `{suppression_state}` | Opt-out, DND, complaint, hard bounce, wrong person, booked, won, lost, disqualified, or clear | Stop if unknown for an automated send. |
| `{active_automation}` | Other sequences or manual outreach currently touching the lead | Hold until overlap is ruled out. |
| `{postal_address}` | Valid sender postal address when required for a covered commercial email | Stop before covered commercial send. |
| `{unsubscribe_url}` | Working opt-out path when required | Stop before covered commercial send. |

FTC guidance distinguishes covered commercial messages from narrowly defined transactional or relationship messages, so a prior relationship alone does not settle `{message_class}`. [research/raw/outside-window-ftc-can-spam.md]

## Intake form

```text
Agency:
Sender name and role:
Sender email:
Lead name and email:
Jurisdiction:
Message class and approving owner:
Permission basis and evidence:
Verified trigger, source, and timestamp:
Lead's stated goal:
Current stage:
Last contact, channel, subject, and outcome:
Agreed next step, owner, and date:
Lead-stated timeline:
Approved offer, price, proof, and resources:
Primary CTA and destination:
Suppression status:
Other active automation or human outreach:
Required postal address and unsubscribe path:
Brand voice examples or constraints:
Words or claims that must not appear:
```

## Readiness result

Return exactly one status before drafting:

- `READY`: identity, permission, trigger, stage, suppression, and CTA are supported. Draft using only verified facts.
- `DRAFT_WITH_GAPS`: a strategy draft is useful, but unresolved placeholders are visibly listed and the output is not send-ready.
- `HOLD`: permission, recipient, sender, suppression, message class, or required compliance details are missing or contradictory.

HighLevel documents that merge fields can become blank when the source value is missing, so each field must be tested with populated and empty records before launch. [research/raw/2026-09-01-highlevel-merge-field-fallbacks.md]

