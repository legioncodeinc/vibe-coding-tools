# Ticket lifecycle email templates

These are stage templates. Replace every placeholder with verified case data or keep the output labeled `DRAFT_WITH_GAPS`. Do not send square-bracketed editor notes.

## 1. Acknowledgment

**Subject:** `{ticket_id}: We received your {feature_name} request`

Hi {customer_first_name},

Thanks for letting us know that {customer_observable_symptom}. I have your request under ticket {ticket_id}, and {agency} is reviewing the affected {feature_name} now.

{next_update_sentence}

If the impact changes before then, reply here with the time it changed and what you observed. Please do not send passwords, verification codes, payment details, or access tokens.

{agent_name}
{agency} Support

## 2. Consolidated information request

**Subject:** `{ticket_id}: Information needed for {feature_name}`

Hi {customer_first_name},

I reviewed the details already on the case. To isolate {customer_observable_symptom}, please send the following in one reply:

1. {evidence_item_1}
2. {evidence_item_2}
3. {evidence_item_3}

Please redact private customer content and do not include passwords, verification codes, access tokens, full payment details, or unrestricted account exports.

Once I have those items, {agency} will {next_action}.

{agent_name}
{agency} Support

## 3. Investigation update

**Subject:** `{ticket_id}: Update on {feature_name}`

Hi {customer_first_name},

Here is the current status of your {feature_name} case.

Confirmed: {verified_fact}

Still being checked: {unknown_or_hypothesis}

Next action: {owner} will {next_action}.

{next_update_sentence}

I am keeping the case open while we verify the cause and the safest next step.

{agent_name}
{agency} Support

## 4. Incident-confirmed update

**Subject:** `{ticket_id}: Service issue affecting {feature_name}`

Hi {customer_first_name},

We have confirmed a service issue affecting {feature_name}. The impact we have verified for your account is {verified_impact}.

{safe_temporary_guidance}

{agency} is tracking the recovery and will update you by {next_update_at}. We will verify your account before closing this ticket.

{agent_name}
{agency} Support

## 5. Reversible troubleshooting step

**Subject:** `{ticket_id}: Next test for {feature_name}`

Hi {customer_first_name},

The evidence currently points to {evidence_matched_path}. Please run this controlled test:

1. {step_1}
2. {step_2}
3. {step_3}

Expected result: {expected_result}

Stop and reply before continuing if {stop_condition}. This test should not {prohibited_side_effect}. If it would, do not run it and tell me what blocks you.

{agent_name}
{agency} Support

## 6. Workaround available

**Subject:** `{ticket_id}: Temporary path for {feature_name}`

Hi {customer_first_name},

We have a temporary path that may let you {customer_goal} while the underlying issue remains open.

Workaround: {verified_workaround}

Known limitation: {workaround_limit}

Rollback: {rollback_step}

Please confirm the result after one controlled test. We will not treat the workaround as a permanent change without your review.

{agent_name}
{agency} Support

## 7. Escalation

**Subject:** `{ticket_id}: {feature_name} case escalated`

Hi {customer_first_name},

We verified {verified_fact}, and the next step requires {specialist_team} because {escalation_reason}.

I sent the team the affected account, timestamps, reproduction steps, redacted error, and diagnostics already completed. {agency} remains the owner of your case.

{next_update_sentence}

You do not need to repeat the earlier troubleshooting. Reply here if the impact or error changes.

{agent_name}
{agency} Support

## 8. Resolution proposed

**Subject:** `{ticket_id}: Please verify {feature_name}`

Hi {customer_first_name},

{agency} completed {verified_change_or_recovery}. Our controlled check produced {verification_result}.

Please verify the same result by {customer_verification_step}.

I will keep the ticket open until {verification_deadline_or_condition}. If the symptom remains, reply with the new timestamp and result so we can continue from the existing evidence.

{agent_name}
{agency} Support

## 9. Resolution and closure

**Subject:** `{ticket_id}: {feature_name} resolved`

Hi {customer_first_name},

We verified that {resolved_behavior}. The issue was resolved by {verified_resolution_summary}.

Verification: {objective_verification}

Prevention or monitoring: {prevention_or_monitoring}

I am closing ticket {ticket_id}. If the same symptom returns, reply to this email with the new timestamp and we will reopen the case with the existing history.

{agent_name}
{agency} Support

## 10. Post-resolution follow-up

**Subject:** `{ticket_id}: Checking {feature_name} after resolution`

Hi {customer_first_name},

I am checking that {resolved_behavior} has remained stable since {resolution_time}.

Please reply with one of these results:

- `Working as expected`
- `Issue returned at {timestamp}`
- `A different problem appeared: {brief_description}`

If it returned, we will reopen the existing case and continue from the earlier evidence.

{agent_name}
{agency} Support

## Optional next-update sentences

Use exactly one:

- `Our next update will be by {next_update_at}.`
- `I will update you after {named_diagnostic_or_team} completes the next check.`
- `The case is queued for review. I do not have a confirmed update time yet, and I will not invent one.`

Do not confuse an update commitment with a resolution ETA.
