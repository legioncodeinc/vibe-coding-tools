# Lifecycle email measurement framework

Measure the business conversation, not just mailbox telemetry. HighLevel exposes sequence-level and step-level statistics, but its product support for opens and clicks does not make those events proof of a human response. [research/raw/2026-06-11-highlevel-email-sequences.md] [research/raw/2026-06-30-highlevel-email-tracking.md]

## Required event fields

Record these fields for each enrolled lead and each step:

```text
sequence_id
sequence_version
lead_state_at_entry
verified_trigger_type
trigger_timestamp
segment
message_step
send_timestamp
delivery_status
reply_timestamp
reply_class
human_owner
qualified_next_step
booking_timestamp
conversion_event
opt_out_timestamp
complaint_timestamp
bounce_class
exit_reason
```

## Outcome metrics

| Metric | Formula | Why it matters |
|---|---|---|
| Delivery rate | delivered messages / attempted messages | Separates content performance from address and infrastructure failure |
| Any reply rate | leads with any direct reply / delivered leads | Shows whether the sequence starts conversations |
| Positive reply rate | leads with a qualified positive reply / delivered leads | Excludes out-of-office, wrong-person, and negative replies |
| Qualified next-step rate | leads with an agreed qualified action / delivered leads | Measures movement, not politeness |
| Booking rate | leads who book the intended meeting / delivered leads | Measures the scheduling outcome when booking is the CTA |
| Stage advancement rate | leads who move to the defined next stage / enrolled leads | Measures lifecycle progress |
| Conversion rate | leads who complete the defined business outcome / enrolled leads | Measures the final outcome when attribution is supportable |
| Median time to first human response | median human-response timestamp minus verified inbound trigger timestamp | Measures hot-lead handling speed without claiming a universal SLA |
| Opt-out rate | opt-outs / delivered leads | Guardrail for relevance and frequency |
| Complaint rate | complaints / delivered messages | Deliverability and trust guardrail |
| Hard-bounce rate | hard bounces / attempted messages | List and address-quality guardrail |
| Final-step silent rate | leads reaching the final step without a direct reply / enrolled leads | Shows how much of the cohort exits active pursuit silently |

Belkins' study emphasizes cumulative sequence outcomes rather than judging only the first step. Its rates must not be imported as expected results for another audience. [research/raw/2026-06-26-belkins-sales-follow-up-statistics.md]

## Reply classes

- `positive`: agrees to a relevant next step or requests substantive information.
- `timing`: supplies a future date or says not now.
- `question`: asks a relevant product, service, process, or decision question.
- `objection`: states a concern that needs a human response.
- `negative`: explicit no or not interested.
- `opt_out`: asks to stop marketing email.
- `wrong_person`: says the recipient is not the right contact.
- `out_of_office`: automated absence response.
- `other`: cannot be safely classified without review.

## Diagnostic metrics only

- Open rate.
- Click rate.
- Click-to-open rate.
- Lead score derived mainly from opens or clicks.

A current community report claims bot inflation in one HighLevel account and has a promotional conflict, so its number is not reusable. The appropriate conclusion is only that direct replies and downstream events are stronger evidence than raw opens. [research/raw/2026-06-29-reddit-highlevel-bot-engagement.md]

## Experiment card

```text
Question:
Lead state and segment:
Control sequence version:
Variant sequence version:
Single variable changed:
Primary outcome:
Guardrails:
Enrollment start and end:
Evaluation date:
Minimum sample rule supplied by:
Exclusions:
Decision owner:
Decision: keep | reject | continue collecting
```

Change one meaningful variable at a time. Predefine the primary outcome, guardrails, evaluation date, and sample rule with the responsible analyst or operator. Do not declare a winner from an early open-rate fluctuation.

## Reporting table

| Cohort | Version | Delivered leads | Positive replies | Qualified next steps | Bookings | Conversions | Opt-outs | Complaints | Hard bounces | Decision |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `{segment}` | `{version}` | `{n}` | `{n}` | `{n}` | `{n}` | `{n}` | `{n}` | `{n}` | `{n}` | `{continue_or_change}` |

Never invent a baseline, uplift, sample size, or causal explanation. If attribution is uncertain, label the metric observational.

