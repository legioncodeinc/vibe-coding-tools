# Reusable hot-lead email sequence

Use only for a lead classified `HOT` under `classification-rubric.md`. The send condition for H1 through H4 is no direct reply, no human takeover, no booking or conversion, no opt-out, no complaint, no hard bounce, and no disqualification.

The braces are portable evidence slots, not platform merge syntax. Resolve every slot or omit the sentence before send. Customer-facing messages contain no research citations or platform references.

## Required sequence inputs

```text
{agency}
{sender_name}
{sender_role}
{first_name_or_safe_greeting}
{lead_topic}
{verified_trigger_phrase}
{stated_goal_or_omit}
{direct_answer_or_summary}
{useful_detail_1}
{useful_detail_2_or_verified_resource}
{primary_next_step}
{choice_a}
{choice_b}
{small_reply_option}
{sender_contact}
{postal_address_if_required}
{unsubscribe_copy_and_url_if_required}
```

## H0: answer the real request

Send promptly after the verified inbound trigger. If a real thread exists, keep its subject. Otherwise use the new-thread subject below.

```text
Subject: Next step for {lead_topic}

{first_name_or_safe_greeting}

Thanks for {verified_trigger_phrase}.

{stated_goal_sentence_or_omit}

{direct_answer_or_summary}

The simplest next step is {primary_next_step}. Would {choice_a} or {choice_b} work better?

{sender_name}
{sender_role}, {agency}
{sender_contact}

{commercial_footer_if_required}
```

## H1: add one useful detail

Starting hypothesis: 1 business day after H0 if no exit condition fired.

```text
Subject: {keep_real_thread_subject_or_use_accurate_new_subject}

{first_name_or_safe_greeting}

One detail that may help with {stated_goal_or_lead_topic}: {useful_detail_1}

If useful, I can {choice_a} or {choice_b}. Which would help more?

{sender_name}
{agency}

{commercial_footer_if_required}
```

## H2: make evaluation easier

Starting hypothesis: 3 business days after H0 if no exit condition fired.

```text
Subject: A practical way to evaluate {lead_topic}

{first_name_or_safe_greeting}

To make this easier to evaluate, here is {useful_detail_2_or_verified_resource}.

It addresses {verified_question_or_decision_factor}. Is that the main issue you are weighing, or is there another question I should answer?

{sender_name}
{agency}

{commercial_footer_if_required}
```

If no verified resource or decision factor exists, replace the middle with one honest question. Do not fabricate a case study, result, or objection.

## H3: reduce the request

Starting hypothesis: 7 business days after H0 if no exit condition fired.

```text
Subject: Is {lead_topic} still active?

{first_name_or_safe_greeting}

Is {stated_goal_or_lead_topic} still something you want to address now?

If yes, reply with {small_reply_option} and I will take the next step. If the timing changed, tell me that and I will pause the follow-up.

{sender_name}
{agency}

{commercial_footer_if_required}
```

## H4: close the active loop

Starting hypothesis: 14 business days after H0 if no exit condition fired.

```text
Subject: Close this out for now?

{first_name_or_safe_greeting}

I have not heard back, so I will close this out for now.

If you want to pick it back up, reply with {small_reply_option} and I will help from there.

{sender_name}
{agency}

{commercial_footer_if_required}
```

## Event-specific substitutions

### Real proposal

Replace H1 with a question about the actual proposal section the lead may need clarified. Do not imply they reviewed it. SparrowCRM proposes 2 to 3 days after a proposal as a starting point. [../research/raw/2026-08-10-sparrowcrm-lead-follow-up.md]

### Real trial

Anchor the message to the verified end date and actual observed usage. If either is unavailable, omit it. [../research/raw/2026-08-10-sparrowcrm-lead-follow-up.md]

### Lead supplied a date

Send a short acknowledgement now, record the real date, and skip default steps that would violate the requested timing.

```text
Subject: {keep_real_thread_subject}

{first_name_or_safe_greeting}

Thanks for the update. I will give you time to review and follow up on {lead_supplied_date}.

If another date works better, just let me know.

{sender_name}
{agency}
```

The lead-supplied date overrides the default cadence. [../research/raw/2026-08-05-reddit-warm-lead-timing.md]

## Sequence basis

The sequence uses prompt handling, distinct reasons to respond, a smaller late-stage request, and a bounded close. Those principles are supported across current SparrowCRM, Hunter, Belkins, and HighLevel sources, while the exact timing remains a test hypothesis. [../research/raw/2026-08-10-sparrowcrm-lead-follow-up.md] [../research/raw/2026-06-12-hunter-three-follow-ups.md] [../research/raw/2026-06-26-belkins-sales-follow-up-statistics.md] [../research/raw/2026-06-11-highlevel-email-sequences.md]

