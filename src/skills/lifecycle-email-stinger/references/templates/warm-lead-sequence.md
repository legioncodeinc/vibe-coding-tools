# Reusable warm-lead email sequence

Use only for a lead classified `WARM` under `classification-rubric.md`. The send condition for W1 through W4 is no direct reply, no human takeover, no hot signal, no booking or conversion, no opt-out, no complaint, no hard bounce, and no disqualification.

The braces are portable evidence slots, not platform merge syntax. Resolve every slot or omit the sentence before send. Customer-facing messages contain no research citations or platform references.

## Required sequence inputs

```text
{agency}
{sender_name}
{sender_role}
{first_name_or_safe_greeting}
{verified_warm_signal_phrase}
{known_topic}
{known_goal_or_omit}
{verified_resource_name_and_url_or_omit}
{verified_resource_scope_or_omit}
{known_priority_a}
{known_priority_b}
{verified_decision_aid_or_answer}
{revisit_option}
{small_reply_option}
{sender_contact}
{postal_address_if_required}
{unsubscribe_copy_and_url_if_required}
```

## W0: deliver value tied to the real signal

```text
Subject: A useful next step for {known_topic}

{first_name_or_safe_greeting}

Because you {verified_warm_signal_phrase}, I thought {verified_resource_name_and_url_or_honest_question} could be useful.

{verified_resource_scope_sentence_or_omit}

Would you like help applying this to {known_goal_or_topic}, or would you rather review it on your own?

{sender_name}
{sender_role}, {agency}
{sender_contact}

{commercial_footer_if_required}
```

If the first clause would overstate what the lead did, rewrite it as a neutral topic statement. Never imply a download, event, referral, or prior conversation without proof.

## W1: clarify priority

Starting hypothesis: day 4 if no exit condition fired.

```text
Subject: One question about {known_topic}

{first_name_or_safe_greeting}

As you think about {known_topic}, which is more useful right now: {known_priority_a} or {known_priority_b}?

Reply with either one and I will send the most relevant next step.

{sender_name}
{agency}

{commercial_footer_if_required}
```

Both priorities must come from supplied context or approved service options. If they do not, ask one open question instead.

## W2: provide a decision aid

Starting hypothesis: day 10 if no exit condition fired.

```text
Subject: A quick guide for {known_topic}

{first_name_or_safe_greeting}

Here is {verified_decision_aid_or_answer}.

It may help you decide {verified_decision_scope}. If you want, reply with {small_reply_option} and I can tailor the next step to your situation.

{sender_name}
{agency}

{commercial_footer_if_required}
```

If there is no approved asset or answer, do not invent one. Use a short question-led email or skip the step.

## W3: honor timing

Starting hypothesis: day 21 if no exit condition fired.

```text
Subject: Better timing for {known_topic}?

{first_name_or_safe_greeting}

Should I keep {known_topic} on your radar now, or would {revisit_option} be better?

Either answer is helpful. I will follow the timing you choose.

{sender_name}
{agency}

{commercial_footer_if_required}
```

## W4: pause the active series

Starting hypothesis: day 35 if no exit condition fired.

```text
Subject: Pausing these notes

{first_name_or_safe_greeting}

I will pause these follow-ups now.

If {known_topic} becomes active later, reply with {small_reply_option} and I will help from there.

{sender_name}
{agency}

{commercial_footer_if_required}
```

## Lead-stated timing branch

If the lead supplies a real review date, replace the remaining default sequence with one acknowledgement and one scheduled follow-up on that date. Current community evidence supports honoring the stated window rather than forcing a generic schedule. [../research/raw/2026-08-05-reddit-warm-lead-timing.md]

## Sequence basis

The sequence stretches useful touches across weeks, matches content to a known stage, makes timing easy to state, and ends active pursuit. These are directional conclusions from current SparrowCRM, Hunter, and Reddit evidence, not universal performance claims. [../research/raw/2026-07-24-sparrowcrm-lead-nurture.md] [../research/raw/2026-06-12-hunter-three-follow-ups.md] [../research/raw/2026-09-02-reddit-sales-follow-ups.md]

