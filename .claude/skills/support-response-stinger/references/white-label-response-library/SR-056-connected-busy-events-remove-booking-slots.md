# SR-056: Busy events on connected calendars remove expected booking slots

## Use when

Use this response when expected public booking times are missing and a busy event on a connected calendar may be blocking availability.

## Required evidence

- Public booking page, calendar, and assigned user
- One affected date and time with timezone
- Connected calendar and exact busy event
- Availability diagnostic reason for the missing slot
- Capacity, buffer, notice, and working-hour settings
- Whether other users or dates show the expected availability

## Customer-facing email

**Subject:** {ticket_id}: Review of booking slots blocked by busy calendar events

Hi {customer_first_name},

I understand an expected booking time is missing while a connected calendar contains a busy event. That event may explain the slot, but we will verify the specific date and diagnostic result before changing availability.

Please leave the calendar connection and external event unchanged. Send us:

1. The affected booking page, calendar, assigned user, date, time, and timezone.
2. The connected calendar and the title and time range of the relevant busy event, with private event details redacted.
3. The missing-slot diagnostic reason and the current capacity, buffer, notice, and working-hour settings.
4. Whether the expected slot appears for another user or date.

Do not send calendar credentials, access tokens, or an unrestricted calendar export.

{agency} will inspect the reason for that one missing slot and compare it with the exact external busy event. We will recommend a setting change only if the current evidence identifies it. I will update you after that comparison.

{agent_name}
{agency} Support

## Agent notes

- Evidence state: `DOC_COVERED` when the missing-slot reason is available.
- Inspect one missing slot and confirm the exact external busy event before changing availability.
- Do not reconnect a working calendar, delete an external event, or remove buffers and limits as a blanket test.
- Escalate when the diagnostic reason and conflict state do not explain the missing slot.
